// ===== 共通 =====
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const go = p => (location.hash = '#/' + p);
const GENRES = ['ラーメン', 'カレー・定食屋', 'やきとり・居酒屋', 'カフェ・スイーツ・洋食', 'ワンコイン・激安大盛り'];
const AREAS = ['室蘭駅', '輪西', '中島', '東室蘭', '水元'];
const TAGS = [['solo', '一人OK'], ['late', '夜遅くまで営業'], ['parking', '駐車場あり'], ['takeout', 'テイクアウト可']];
const COLOR = { fav: '#e4572e', visit: '#2a9d5c', none: '#1e6fd9' };

// デモ用店舗データ（2026年11月時点のWeb情報。営業時間等は要確認）
const SAMPLE = [
  {id:1, name: "味の大王 室蘭本店", genre: "ラーメン", area: "室蘭駅", address: "室蘭市中央町2-9-3", lat: 42.317649, lng: 140.970308, budget: 1000, hours: "11:00-15:00（火曜休）", solo: true, late: false, parking: true, takeout: false, note: "室蘭カレーラーメン発祥といわれる老舗"},
  {id:2, name: "清洋軒", genre: "ラーメン", area: "室蘭駅", address: "室蘭市舟見町1-6-4", lat: 42.310975, lng: 140.971253, budget: 1000, hours: "11:00-17:00（火曜休）", solo: true, late: false, parking: false, takeout: false, note: "塩ラーメンが看板の人気店"},
  {id:3, name: "鳥辰 本店", genre: "やきとり・居酒屋", area: "室蘭駅", address: "室蘭市中央町3-7-1", lat: 42.316757, lng: 140.972311, budget: 3000, hours: "17:00-23:30（月曜休）", solo: false, late: true, parking: false, takeout: true, note: "室蘭やきとりの有名店"},
  {id:4, name: "鳥よし", genre: "やきとり・居酒屋", area: "輪西", address: "室蘭市輪西町2-2-8", lat: 42.335578, lng: 141.011876, budget: 2500, hours: "17:00-20:30", solo: true, late: false, parking: false, takeout: false, note: "昭和レトロな老舗。現金のみ"},
  {id:5, name: "やきとりの一平 中島本店", genre: "やきとり・居酒屋", area: "中島", address: "室蘭市中島町1-17-3", lat: 42.352904, lng: 141.016157, budget: 3000, hours: "17:00-23:00", solo: true, late: true, parking: false, takeout: true, note: "1950年創業。予約がおすすめ"},
  {id:6, name: "ラーメン・ギョーザ 十八番 中島店", genre: "ラーメン", area: "中島", address: "室蘭市中島町1-23-7", lat: 42.354659, lng: 141.018375, budget: 1100, hours: "11:00-21:00", solo: true, late: false, parking: false, takeout: false, note: "手作りの大きな餃子が名物"},
  {id:7, name: "岩本珈琲店", genre: "カフェ・スイーツ・洋食", area: "中島", address: "室蘭市中島町1-23-15", lat: 42.354218, lng: 141.018119, budget: 1000, hours: "要確認", solo: true, late: false, parking: false, takeout: false, note: "サイフォンで淹れるコーヒーとカレー"},
  {id:8, name: "室感食堂", genre: "カレー・定食屋／ワンコイン・激安大盛り", area: "中島", address: "室蘭市中島町1-4-1", lat: 42.349862, lng: 141.011225, budget: 700, hours: "9:00-21:00（火曜休）", solo: true, late: false, parking: true, takeout: false, note: "水産加工会社直営の食堂。タブレット注文"},
  {id:9, name: "麺屋智", genre: "ラーメン／カレー・定食屋", area: "東室蘭", address: "室蘭市中島町3-25-9", lat: 42.349726, lng: 141.02447, budget: 1100, hours: "11:00-15:00, 17:00-20:30（月曜休）", solo: true, late: false, parking: false, takeout: false, note: "カレーらーめんと数量限定スープカレー"},
  {id:10, name: "やきとり一平 工大前店", genre: "やきとり・居酒屋", area: "水元", address: "室蘭市高砂町5-6", lat: 42.37651, lng: 141.034579, budget: 2500, hours: "17:00-22:00（水曜休）", solo: true, late: false, parking: false, takeout: false, note: "室蘭工大の近く"},
];

// ===== データ層（Supabase / デモの切替） =====
const useSB = !!(window.SUPABASE_URL && window.SUPABASE_ANON_KEY);
const sb = useSB ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
const ok = ({ data, error }) => { if (error) throw error; return data; };
const LS = {
  get: k => { try { return JSON.parse(localStorage.getItem('mg_' + k)); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem('mg_' + k, JSON.stringify(v)); } catch {} },
};
const myId = () => (LS.get('session') || {}).id;

const DB = useSB ? {
  async user() { const u = (await sb.auth.getSession()).data.session?.user; return u && { id: u.id, name: u.user_metadata?.username || u.email }; },
  async signUp(name, email, pw) { return !!ok(await sb.auth.signUp({ email, password: pw, options: { data: { username: name }, emailRedirectTo: location.origin + location.pathname } })).session; },
  async signIn(email, pw) { ok(await sb.auth.signInWithPassword({ email, password: pw })); },
  async signOut() { await sb.auth.signOut(); },
  async shops() { return ok(await sb.from('shops').select('*').order('id')); },
  async reviews(id) { return ok(await sb.from('reviews').select('*').eq('shop_id', id).order('created_at', { ascending: false })); },
  async addReview(r) { ok(await sb.from('reviews').insert(r)); },
  async ids(t) { return ok(await sb.from(t).select('shop_id')).map(x => x.shop_id); },
  async add(t, id) { await sb.from(t).insert({ shop_id: id }); },
  async del(t, id) { ok(await sb.from(t).delete().eq('shop_id', id)); },
} : {
  async user() { return LS.get('session'); },
  async signUp(name, email, pw) {
    const us = LS.get('users') || [];
    if (us.some(u => u.email === email)) throw Error('登録済みのメールアドレスです');
    const u = { id: 'u' + Date.now(), name, email, pw };
    LS.set('users', [...us, u]); LS.set('session', { id: u.id, name }); return true;
  },
  async signIn(email, pw) {
    const u = (LS.get('users') || []).find(u => u.email === email && u.pw === pw);
    if (!u) throw Error('メールアドレスまたはパスワードが違います');
    LS.set('session', { id: u.id, name: u.name });
  },
  async signOut() { LS.set('session', null); },
  async shops() { return SAMPLE; },
  async reviews(id) { return (LS.get('reviews') || []).filter(r => r.shop_id === id).reverse(); },
  async addReview(r) { LS.set('reviews', [...(LS.get('reviews') || []), r]); },
  async ids(t) { return (LS.get(t) || []).filter(x => x.u === myId()).map(x => x.s); },
  async add(t, id) { const a = LS.get(t) || []; if (!a.some(x => x.u === myId() && x.s === id)) LS.set(t, [...a, { u: myId(), s: id }]); },
  async del(t, id) { LS.set(t, (LS.get(t) || []).filter(x => !(x.u === myId() && x.s === id))); },
};

let SHOPS;
const shops = async () => (SHOPS ??= await DB.shops());
const shopById = async id => { const s = (await shops()).find(x => x.id === id); if (!s) throw Error('店舗が見つかりません'); return s; };
const filt = (list, q) => list.filter(s =>
  (!q.genre || s.genre.includes(q.genre)) && (!q.area || s.area === q.area) && (!q.budget || s.budget <= +q.budget) &&
  TAGS.every(([k]) => !q[k] || s[k]));

// ===== 部品 =====
const card = (s, favs) => `<div class="card"><a class="cbody" href="#/shop/${s.id}"><b>${esc(s.name)}</b>
  <small class="muted">${esc(s.genre)}｜${esc(s.area)}｜予算 〜¥${s.budget ?? '-'}</small></a>
  <button class="heart" onclick="fav(${s.id})">${favs.includes(s.id) ? '♥' : '♡'}</button></div>`;

function mkMap(list, colorOf = () => COLOR.fav) {
  const m = L.map('map').setView([42.335, 141.0], 12);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap' }).addTo(m);
  const pts = list.map(s => {
    L.circleMarker([s.lat, s.lng], { radius: 10, color: '#fff', weight: 2, fillColor: colorOf(s), fillOpacity: 1 }).addTo(m)
      .bindPopup(`<b>${esc(s.name)}</b><br>${esc(s.genre)}<br><a href="#/shop/${s.id}">店舗詳細を見る</a>`);
    return [s.lat, s.lng];
  });
  if (pts.length > 1) m.fitBounds(pts, { padding: [30, 30] }); else if (pts.length) m.setView(pts[0], 16);
}

// ===== 操作 =====
window.doLogin = async f => {
  try { await DB.signIn(f.email.value, f.pw.value); go('search'); } catch (e) { f.querySelector('.err').textContent = e.message; }
};
window.doSignup = async f => {
  try {
    const loggedIn = await DB.signUp(f.name.value, f.email.value, f.pw.value);
    loggedIn ? go('search') : (f.querySelector('.err').textContent = '確認メールを送信しました。メール内のリンクから登録を完了してください。');
  } catch (e) { f.querySelector('.err').textContent = e.message; }
};
window.doLogout = async () => { await DB.signOut(); go(''); };
window.fav = async id => { (await DB.ids('favorites')).includes(id) ? await DB.del('favorites', id) : await DB.add('favorites', id); render(); };
window.visit = async id => { await DB.add('visits', id); go('mymap'); };
window.doFilter = f => go('list?' + new URLSearchParams([...new FormData(f)].filter(([, v]) => v)));
window.openBus = (lat, lng) => {
  const o = encodeURIComponent($('#from').value);
  open(`https://www.google.com/maps/dir/?api=1&origin=${o}&destination=${lat},${lng}&travelmode=transit`, '_blank');
};
window.doReview = async (f, id) => {
  try { const name = (await DB.user()).name; await DB.addReview({ shop_id: id, rating: +f.rating.value, body: f.body.value, username: name, created_at: new Date().toISOString() }); go('shop/' + id); }
  catch (e) { f.querySelector('.err').textContent = e.message; }
};

// ===== 画面（番号は画面遷移図に対応） =====
const V = {
  // 01 トップ
  '': () => ['', `<div class="hero"><h1>むろらん<br>グルメマップ</h1><p>食べて、歩いて、<br>もっと室蘭が好きになる。</p>
    <a class="btn" href="#/login">ログイン</a><a class="btn sub" href="#/signup">新規登録</a>
    ${useSB ? '' : '<p class="note">デモモード：データはこの端末のブラウザにのみ保存されます</p>'}</div>`],
  // 02 ログイン
  login: () => ['ログイン', `<form onsubmit="doLogin(this);return false">
    <input name="email" type="email" placeholder="メールアドレス" required><input name="pw" type="password" placeholder="パスワード" required>
    <p class="err"></p><button class="btn">ログイン</button></form>`],
  // 03 新規登録
  signup: () => ['新規登録', `<h1>アカウントを作成</h1><form onsubmit="doSignup(this);return false">
    <input name="name" placeholder="ユーザー名" required><input name="email" type="email" placeholder="メールアドレス" required>
    <input name="pw" type="password" placeholder="パスワード（6文字以上）" minlength="6" required>
    <p class="err"></p><button class="btn">登録する</button></form>`],
  // 04 探し方の選択
  search: () => ['探し方の選択', `<h1>お店の探し方を選ぶ</h1><p class="muted">どちらの方法で探しますか？</p>
    <a class="btn" href="#/genre">ジャンルから探す</a><a class="btn" href="#/map">地図から探す</a>`],
  // 05 ジャンル選択
  genre: () => ['ジャンル選択', `<h1>食べたいジャンルを選択</h1>
    ${GENRES.map(g => `<a class="btn sub" href="#/list?genre=${encodeURIComponent(g)}">${g}</a>`).join('')}
    <a class="btn" href="#/list">すべてのお店</a>`],
  // 06 店舗一覧
  async list({ q, qs }) {
    const [list, favs] = [filt(await shops(), q), await DB.ids('favorites')];
    return [q.genre || '店舗一覧', `<div class="row"><b>${esc(q.genre || 'すべて')}（${list.length}件）</b>
      <span><a href="#/filter?${qs}">条件で絞り込む</a>｜<a href="#/map?${qs}">地図で見る</a></span></div>
      ${list.map(s => card(s, favs)).join('') || '<p class="muted">該当するお店がありません</p>'}`];
  },
  // 07 条件検索
  filter: ({ q }) => ['条件検索', `<h1>条件を指定して探す</h1><form onsubmit="doFilter(this);return false">
    <select name="genre"><option value="">ジャンル：指定なし</option>${GENRES.map(g => `<option ${q.genre === g ? 'selected' : ''}>${g}</option>`).join('')}</select>
    <select name="area"><option value="">エリア：指定なし</option>${AREAS.map(a => `<option ${q.area === a ? 'selected' : ''}>${a}</option>`).join('')}</select>
    <select name="budget"><option value="">予算：指定なし</option>${[500, 1000, 1500, 2000, 3000].map(b => `<option value="${b}" ${q.budget == b ? 'selected' : ''}>〜¥${b}</option>`).join('')}</select>
    ${TAGS.map(([k, t]) => `<label class="chk"><input type="checkbox" name="${k}" value="1" ${q[k] ? 'checked' : ''}>${t}</label>`).join('')}
    <button class="btn">この条件で検索</button></form>`],
  // 08 マップ検索
  async map({ q }) {
    const list = filt(await shops(), q);
    return ['マップ検索', `<p class="muted">ピンをタップすると店舗カードを表示します</p><div id="map"></div>
      <a class="btn sub" href="#/list?${new URLSearchParams(q)}">一覧で見る</a>`, () => mkMap(list)];
  },
  // 09 店舗詳細
  async shop({ id }) {
    const s = await shopById(id);
    const [rv, favs, vis] = await Promise.all([DB.reviews(id), DB.ids('favorites'), DB.ids('visits')]);
    const avg = rv.length ? (rv.reduce((a, r) => a + r.rating, 0) / rv.length).toFixed(1) : '-';
    return ['店舗詳細', `<h1>${esc(s.name)}</h1><p class="muted">${esc(s.genre)}｜${esc(s.area)}｜★${avg}（${rv.length}件）</p>
      <dl><dt>住所</dt><dd>${esc(s.address)}</dd><dt>営業時間</dt><dd>${esc(s.hours)}</dd><dt>予算</dt><dd>〜¥${s.budget ?? '-'}</dd></dl>
      <div>${TAGS.filter(([k]) => s[k]).map(([, t]) => `<span class="tag">${t}</span>`).join('')}</div>
      ${s.note ? `<p class="note">${esc(s.note)}</p>` : ''}
      <a class="btn" href="#/shopmap/${id}">地図で見る</a><a class="btn" href="#/bus/${id}">バスで行く</a>
      <a class="btn" href="#/review/${id}">口コミを書く</a>
      <button class="btn sub" onclick="fav(${id})">${favs.includes(id) ? '♥ お気に入り解除' : '♡ お気に入りに追加'}</button>
      <button class="btn sub" onclick="visit(${id})" ${vis.includes(id) ? 'disabled' : ''}>${vis.includes(id) ? '訪問済み' : '訪問済みとして登録'}</button>
      <h3>口コミ</h3>${rv.map(r => `<div class="rv"><b>${'★'.repeat(r.rating)}</b> <small>${esc(r.username)}</small><p>${esc(r.body)}</p></div>`).join('') || '<p class="muted">まだ口コミはありません</p>'}`];
  },
  // 10 店舗の地図
  async shopmap({ id }) {
    const s = await shopById(id);
    return ['店舗の地図', `<h1>${esc(s.name)}</h1><div id="map"></div><p>${esc(s.address)}</p>
      <a class="btn" target="_blank" href="https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lng}">Googleマップで開く</a>`, () => mkMap([s])];
  },
  // 11 バス経路
  async bus({ id }) {
    const s = await shopById(id);
    return ['バス経路', `<h1>${esc(s.name)}まで</h1><input id="from" value="室蘭工業大学" placeholder="出発地">
      <p class="muted">徒歩 → バス → 徒歩 の経路・時刻・料金をGoogleマップで表示します</p>
      <button class="btn" onclick="openBus(${s.lat},${s.lng})">Googleマップで開く</button>`];
  },
  // 12 口コミ投稿
  async review({ id }) {
    const s = await shopById(id);
    return ['口コミ投稿', `<h1>${esc(s.name)}</h1><form onsubmit="doReview(this,${id});return false">
      <select name="rating">${[5, 4, 3, 2, 1].map(n => `<option value="${n}">${'★'.repeat(n)}${'☆'.repeat(5 - n)}</option>`).join('')}</select>
      <textarea name="body" rows="5" placeholder="口コミを入力" required></textarea><p class="err"></p>
      <button class="btn">投稿する</button></form>`];
  },
  // 13 スタンプ（10店で1枚、1店50pt）
  async stamp() {
    const vis = await DB.ids('visits'), all = await shops(), n = vis.length, cur = n % 10;
    return ['スタンプ', `<h1>室蘭グルメ探検隊</h1><p>あと<b>${10 - cur}</b>店舗で次の特典！</p>
      <div class="stamps">${Array.from({ length: 10 }, (_, i) => `<span class="${i < cur ? 'on' : ''}"></span>`).join('')}</div>
      <p>獲得ポイント：<b>${n * 50} pt</b>｜カード達成：${Math.floor(n / 10)}枚</p>
      <h3>訪問履歴</h3>${all.filter(s => vis.includes(s.id)).map(s => `<p><a href="#/shop/${s.id}">${esc(s.name)}</a></p>`).join('') || '<p class="muted">まだ訪問記録がありません</p>'}`];
  },
  // 14 お気に入り
  async fav() {
    const favs = await DB.ids('favorites'), list = (await shops()).filter(s => favs.includes(s.id));
    return ['お気に入り', `<h1>お気に入りのお店</h1>${list.map(s => card(s, favs)).join('') || '<p class="muted">まだありません</p>'}
      <p class="muted">♥ を押すと登録解除</p><a class="btn" href="#/mymap">自分のマップで見る</a>`];
  },
  // 15 マイページ
  mypage: ({ me }) => ['マイページ', `<h1>${esc(me.name)}</h1>
    <a class="btn" href="#/mymap">自分のマップ（訪問記録）</a><a class="btn" href="#/fav">お気に入りのお店</a>
    <a class="btn" href="#/stamp">スタンプラリー達成状況</a><button class="btn sub" onclick="doLogout()">ログアウト</button>`],
  // 16 自分のマップ
  async mymap() {
    const [all, favs, vis] = await Promise.all([shops(), DB.ids('favorites'), DB.ids('visits')]);
    const colorOf = s => favs.includes(s.id) ? COLOR.fav : vis.includes(s.id) ? COLOR.visit : COLOR.none;
    return ['自分のマップ', `<h1>自分だけのグルメマップ</h1><div id="map"></div>
      <p class="legend"><span><i class="dot" style="background:${COLOR.none}"></i>未訪問</span><span><i class="dot" style="background:${COLOR.visit}"></i>訪問済み</span><span><i class="dot" style="background:${COLOR.fav}"></i>お気に入り</span></p>
      <p class="muted">ピンを選ぶと店舗カードを表示します</p>`, () => mkMap(all, colorOf)];
  },
};

const NAV = `<nav><a href="#/search">ホーム</a><a href="#/map">地図</a><a href="#/stamp">スタンプ</a><a href="#/fav">お気に入り</a><a href="#/mypage">マイページ</a></nav>`;

// ===== ルーター =====
async function render() {
  // メール確認リンクから戻った直後（#access_token=… / #error=…）
  if (/access_token=|error=/.test(location.hash)) { const u = await DB.user(); history.replaceState(null, '', location.pathname); return go(u ? 'search' : 'login'); }
  const [path, qs = ''] = location.hash.slice(2).split('?');
  const [name = '', arg] = path.split('/');
  const me = await DB.user(), pub = ['', 'login', 'signup'].includes(name);
  if (!me && !pub) return go('');
  if (me && pub) return go('search');
  try {
    const [title, html, after] = await (V[name] || V[''])({ id: Number(arg), q: Object.fromEntries(new URLSearchParams(qs)), qs, me });
    $('#app').innerHTML = (title ? `<header><button class="back" onclick="history.back()">‹</button><h2>${title}</h2></header>` : '') + `<main>${html}</main>` + (me ? NAV : '');
    after?.(); scrollTo(0, 0);
  } catch (e) { $('#app').innerHTML = `<main><p class="err">エラー：${esc(e.message)}</p><a href="#/search">ホームへ</a></main>` + (me ? NAV : ''); }
}
addEventListener('hashchange', render);
render();
