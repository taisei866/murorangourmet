// ホットペッパーグルメAPI → Supabase 店舗取り込み（GitHub Actions から週1回実行）
// 必要な環境変数: HOTPEPPER_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY
// ローカルで試す: HOTPEPPER_KEY=... SUPABASE_URL=... SUPABASE_SERVICE_KEY=... node scripts/import.js --dry
const { HOTPEPPER_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY } = process.env;
const DRY = process.argv.includes('--dry');
if (!HOTPEPPER_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) throw Error('環境変数が不足しています');

// 検索の中心（半径3km）とエリア判定用の代表地点
const AREA_POINTS = {
  '室蘭駅': [42.3159, 140.9741], '母恋': [42.3080, 140.9790], '輪西': [42.3360, 141.0080], '中島': [42.3520, 141.0170],
  '東室蘭': [42.3488, 141.0272], '水元': [42.3775, 141.0345], '鷲別': [42.3772, 141.0575], '白鳥台': [42.3650, 140.9550],
};
const SEARCH_CENTERS = ['室蘭駅', '中島', '鷲別', '白鳥台'];

const dist = ([a, b], [c, d]) => Math.hypot((a - c) * 111000, (b - d) * 82000); // メートル（概算）
const nearestArea = p => Object.entries(AREA_POINTS).sort((x, y) => dist(p, x[1]) - dist(p, y[1]))[0][0];
const norm = s => s.replace(/[\s　・()（）]/g, '').toLowerCase();

// ホットペッパーのジャンル → アプリのジャンル
function toGenre(s) {
  const text = `${s.name} ${s.genre.name} ${s.genre.catch} ${s.catch}`;
  const g = [];
  if (s.genre.code === 'G013' || /ラーメン|らーめん/.test(text)) g.push('ラーメン');
  if (/カレー|定食|食堂/.test(text)) g.push('カレー・定食屋');
  if (['G001', 'G002', 'G012'].includes(s.genre.code) || /焼鳥|やきとり|焼き鳥|居酒屋/.test(text)) g.push('やきとり・居酒屋');
  if (['G014', 'G005', 'G006'].includes(s.genre.code)) g.push('カフェ・スイーツ・洋食');
  const budget = toBudget(s);
  if (budget && budget <= 500) g.push('ワンコイン・激安大盛り');
  if (!g.length) g.push('和食・中華・その他');
  return [...new Set(g)].join('／');
}
function toBudget(s) {
  const nums = `${s.budget?.name || ''} ${s.budget?.average || ''}`.match(/\d[\d,]*/g)?.map(n => +n.replace(/,/g, '')) || [];
  return nums.length ? Math.max(...nums) : null;
}

async function fetchHotpepper() {
  const found = new Map();
  for (const c of SEARCH_CENTERS) {
    const [lat, lng] = AREA_POINTS[c];
    for (let start = 1; ; start += 100) {
      const u = `https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=${HOTPEPPER_KEY}&lat=${lat}&lng=${lng}&range=5&count=100&start=${start}&format=json`;
      const r = (await (await fetch(u)).json()).results;
      if (r.error) throw Error('ホットペッパーAPIエラー: ' + JSON.stringify(r.error));
      r.shop.filter(s => s.address.includes('室蘭市')).forEach(s => found.set(s.id, s));
      if (start + 100 > r.results_available) break;
    }
  }
  return [...found.values()];
}

const H = { apikey: SUPABASE_SERVICE_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' };
if (SUPABASE_SERVICE_KEY.startsWith('eyJ')) H.Authorization = `Bearer ${SUPABASE_SERVICE_KEY}`; // 旧形式のキー
async function sb(path, method = 'GET', body) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { method, headers: H, body: body && JSON.stringify(body) });
  if (!r.ok) throw Error(`Supabase ${method} ${path}: ${r.status} ${await r.text()}`);
  return method === 'GET' ? r.json() : null;
}

(async () => {
  const hp = await fetchHotpepper();
  const existing = await sb('shops?select=id,name,lat,lng,source,source_id,status');
  const now = new Date().toISOString();
  const seen = new Set(), inserts = [];
  let updated = 0, merged = 0;

  for (const s of hp) {
    const sid = 'hp:' + s.id, p = [+s.lat, +s.lng];
    seen.add(sid);
    const data = {
      name: s.name, genre: toGenre(s), area: nearestArea(p), address: s.address.replace(/^北海道/, ''), lat: p[0], lng: p[1],
      budget: toBudget(s), hours: s.open, note: s.catch || s.genre.catch || null,
      late: s.midnight === '営業している', parking: /^あり/.test(s.parking || ''),
      photo_url: s.photo?.mobile?.l || s.photo?.pc?.l || null, url: s.urls?.pc || null, fetched_at: now,
    };
    const hit = existing.find(e => e.source_id === sid);
    if (hit) {
      // 既存の取り込み店舗：内容を更新（閉店扱いだったものは再び承認待ちへ）
      if (!DRY) await sb(`shops?id=eq.${hit.id}`, 'PATCH', { ...data, ...(hit.status === 'gone' ? { status: 'pending' } : {}) });
      updated++;
      continue;
    }
    const manual = existing.find(e => !e.source_id && dist(p, [e.lat, e.lng]) < 80 && (norm(e.name).includes(norm(s.name)) || norm(s.name).includes(norm(e.name))));
    if (manual) {
      // 手入力の店舗と同じ店：IDと写真・URLだけ紐付け（手入力の内容は残す）
      if (!DRY) await sb(`shops?id=eq.${manual.id}`, 'PATCH', { source_id: sid, photo_url: data.photo_url, url: data.url, fetched_at: now });
      merged++;
      continue;
    }
    inserts.push({ ...data, source: 'hotpepper', source_id: sid, status: 'pending' });
  }

  // 今回見つからなかった取り込み店舗は閉店の可能性 → 非表示
  const gone = existing.filter(e => e.source_id?.startsWith('hp:') && !seen.has(e.source_id) && e.status !== 'gone');

  if (!DRY) {
    for (let i = 0; i < inserts.length; i += 100) await sb('shops', 'POST', inserts.slice(i, i + 100));
    for (const e of gone) await sb(`shops?id=eq.${e.id}`, 'PATCH', { status: 'gone' });
  }
  console.log(`取得 ${hp.length}件 / 新規(承認待ち) ${inserts.length} / 更新 ${updated} / 手入力と統合 ${merged} / 非表示 ${gone.length}${DRY ? '（ドライラン）' : ''}`);
  inserts.slice(0, 10).forEach(s => console.log(`  + ${s.name}（${s.genre}・${s.area}）`));
})().catch(e => { console.error(e); process.exit(1); });
