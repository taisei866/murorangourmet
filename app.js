// ===== 共通 =====
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const go = p => (location.hash = '#/' + p);
const GENRES = [
  { k: 'ラーメン', e: '🍜', c: '#E8590C' },
  { k: 'カレー・定食屋', e: '🍛', c: '#F59F00' },
  { k: 'やきとり・居酒屋', e: '🍢', c: '#C92A2A' },
  { k: 'カフェ・スイーツ・洋食', e: '☕', c: '#8D6E63' },
  { k: 'ワンコイン・激安大盛り', e: '💰', c: '#2F9E44' },
  { k: '和食・中華・その他', e: '🍱', c: '#5C7CFA' },
];
const AREAS = ['室蘭駅', '母恋', '輪西', '中島', '東室蘭', '水元', '鷲別', '白鳥台'];
const TAGS = [['solo', '一人OK'], ['late', '夜遅くまで営業'], ['parking', '駐車場あり'], ['takeout', 'テイクアウト可']];
const STATUS = { fav: '#fa5252', visit: '#2f9e44', none: '#1c7ed6' };
const gm = s => GENRES.find(g => s.genre.startsWith(g.k)) || GENRES[0];
const genres = s => s.genre.split('／');

// アイコン（Feather Icons 風）
const P = {
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  map: '<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>',
  award: '<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',
  heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  bus: '<rect x="4" y="3" width="16" height="16" rx="3"/><line x1="4" y1="11" x2="20" y2="11"/><circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/><line x1="7" y1="19" x2="7" y2="22"/><line x1="17" y1="19" x2="17" y2="22"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>',
  back: '<polyline points="15 18 9 12 15 6"/>',
  chev: '<polyline points="9 18 15 12 9 6"/>',
  search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  filter: '<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',
  list: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
  ext: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
};
const I = (n, s = 22) => `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${P[n]}</svg>`;

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
  async shops() { return ok(await sb.from('shops').select('*').eq('status', 'public').order('id')); },
  async reviews(id) { return ok(await sb.from('reviews').select('*, profiles(username, avatar_url)').eq('shop_id', id).order('created_at', { ascending: false })); },
  async profile() { const u = (await sb.auth.getUser()).data.user; return ok(await sb.from('profiles').select('*').eq('id', u.id).maybeSingle()) || { username: u.user_metadata?.username }; },
  async saveProfile(p) {
    const u = (await sb.auth.getUser()).data.user;
    ok(await sb.from('profiles').update({ ...p, updated_at: new Date().toISOString() }).eq('id', u.id));
    await sb.auth.updateUser({ data: { username: p.username } });
  },
  async upload(blob) {
    const u = (await sb.auth.getUser()).data.user, path = `${u.id}/${Date.now()}.jpg`;
    ok(await sb.storage.from('images').upload(path, blob, { contentType: 'image/jpeg' }));
    return sb.storage.from('images').getPublicUrl(path).data.publicUrl;
  },
  async pending() { return ok(await sb.from('shops').select('*').eq('status', 'pending').order('fetched_at', { ascending: false })); },
  async setStatus(id, status) { ok(await sb.from('shops').update({ status }).eq('id', id)); },
  async addReview(r) { ok(await sb.from('reviews').insert(r)); },
  async ratings() { return ok(await sb.from('reviews').select('shop_id,rating')); },
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
  async reviews(id) {
    const us = LS.get('users') || [];
    return (LS.get('reviews') || []).filter(r => r.shop_id === id).reverse()
      .map(r => { const u = us.find(x => x.id === r.user_id); return { ...r, profiles: u && { username: u.name, avatar_url: u.avatar_url } }; });
  },
  async addReview(r) { LS.set('reviews', [...(LS.get('reviews') || []), { ...r, user_id: myId() }]); },
  async profile() { const u = (LS.get('users') || []).find(x => x.id === myId()) || {}; return { username: u.name, bio: u.bio, avatar_url: u.avatar_url, is_admin: false }; },
  async saveProfile(p) {
    const us = LS.get('users') || [], u = us.find(x => x.id === myId());
    Object.assign(u, { name: p.username, bio: p.bio, avatar_url: p.avatar_url });
    LS.set('users', us); LS.set('session', { id: u.id, name: p.username });
  },
  async upload(blob) { return new Promise(r => { const f = new FileReader(); f.onload = () => r(f.result); f.readAsDataURL(blob); }); },
  async pending() { return []; },
  async setStatus() {},
  async ratings() { return LS.get('reviews') || []; },
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
const rates = async () => {
  const m = {};
  (await DB.ratings()).forEach(r => { const x = (m[r.shop_id] ??= { n: 0, sum: 0 }); x.n++; x.sum += r.rating; });
  return m;
};
const rate = r => r ? `<span class="rate">★${(r.sum / r.n).toFixed(1)}<small>(${r.n})</small></span>` : '<span class="rate none">★ -</span>';
const stars = n => '★'.repeat(n) + '☆'.repeat(5 - n);
const thumb = s => { const g = gm(s); return s.photo_url ? `<div class="thumb ph" style="--c:${g.c};background-image:url('${esc(s.photo_url)}')"></div>` : `<div class="thumb" style="--c:${g.c}">${g.e}</div>`; };
const av = (name, url, cls = '') => url ? `<img class="avatar ${cls}" src="${esc(url)}" alt="">` : `<span class="avatar ${cls}">${esc((name || '?')[0])}</span>`;
const CREDIT = '<p class="credit"><a href="http://webservice.recruit.co.jp/" target="_blank">Powered by ホットペッパーグルメ Webサービス</a></p>';
// 画像：選択 → 縮小 → プレビュー（アップロードは送信時）
const PICK = {};
const resize = (file, max) => new Promise((res, rej) => {
  const img = new Image();
  img.onload = () => {
    const k = Math.min(1, max / Math.max(img.width, img.height)), c = document.createElement('canvas');
    c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(img.src); c.toBlob(res, 'image/jpeg', 0.8);
  };
  img.onerror = () => rej(Error('画像を読み込めませんでした'));
  img.src = URL.createObjectURL(file);
});
window.pickImg = async (input, key, max) => {
  const f = input.files[0]; if (!f) return;
  PICK[key] = await resize(f, useSB ? max : Math.min(max, 600));
  const el = $('#' + key); el.style.backgroundImage = `url(${URL.createObjectURL(PICK[key])})`; el.classList.add('has');
};
const upPick = async key => { const b = PICK[key]; delete PICK[key]; return b ? DB.upload(b) : null; };
const yen = n => `¥${Number(n || 0).toLocaleString()}`;
const empty = (t, p) => `<div class="empty"><div>🍽️</div><b>${t}</b><p>${p}</p></div>`;
const toast = m => { const t = document.createElement('div'); t.className = 'toast'; t.textContent = m; document.body.append(t); setTimeout(() => t.remove(), 1900); };

const card = (s, favs, R) => `<div class="card" onclick="go('shop/${s.id}')">${thumb(s)}
  <div class="cbody"><div class="cname">${esc(s.name)}</div>
  <div class="cmeta">${rate(R[s.id])}<span>${esc(genres(s)[0])}</span><span>${I('pin', 12)} ${esc(s.area)}</span></div>
  <div class="cmeta"><span>〜${yen(s.budget)}</span>${TAGS.filter(([k]) => s[k]).slice(0, 2).map(([, t]) => `<span class="tag">${t}</span>`).join('')}</div></div>
  <button class="heart ${favs.includes(s.id) ? 'on' : ''}" onclick="event.stopPropagation();fav(${s.id})" aria-label="お気に入り">${I('heart')}</button></div>`;
const mini = (s, R) => `<div class="mini" onclick="go('shop/${s.id}')">${thumb(s)}<b>${esc(s.name)}</b><small>${rate(R[s.id])} ${esc(s.area)}</small></div>`;
const rowi = s => `<div class="rowi" onclick="go('shop/${s.id}')">${thumb(s)}<b>${esc(s.name)}</b>${I('chev', 18)}</div>`;
const gtiles = () => GENRES.map(g => `<a class="gtile" style="--c:${g.c}" href="#/list?genre=${encodeURIComponent(g.k)}"><span>${g.e}</span>${g.k}</a>`).join('');
const radios = (name, vals, cur, fmt = v => v) =>
  [['', '指定なし'], ...vals.map(v => [v, fmt(v)])].map(([v, t]) =>
    `<label class="chip"><input type="radio" name="${name}" value="${v}" ${String(cur ?? '') === String(v) ? 'checked' : ''}>${t}</label>`).join('');

function mkMap(list, R = {}, colorOf = s => gm(s).c) {
  const m = L.map('map', { zoomControl: false }).setView([42.335, 141.0], 12);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap' }).addTo(m);
  const pts = list.map(s => {
    const icon = L.divIcon({ className: '', html: `<div class="mpin" style="--c:${colorOf(s)}"><span>${gm(s).e}</span></div>`, iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -34] });
    L.marker([s.lat, s.lng], { icon }).addTo(m)
      .bindPopup(`<div class="pop"><b>${esc(s.name)}</b><small>${rate(R[s.id])} ${esc(genres(s)[0])}・${esc(s.area)}</small><a href="#/shop/${s.id}">店舗詳細を見る</a></div>`);
    return [s.lat, s.lng];
  });
  if (pts.length > 1) m.fitBounds(pts, { padding: [50, 50] }); else if (pts.length) m.setView(pts[0], 16);
}

// ===== 操作 =====
const errOut = (f, e) => (f.querySelector('.err').textContent = e.message);
window.doLogin = async f => { try { await DB.signIn(f.email.value, f.pw.value); go('search'); } catch (e) { errOut(f, e); } };
window.doSignup = async f => {
  try { (await DB.signUp(f.name.value, f.email.value, f.pw.value)) ? go('search') : (f.querySelector('.err').textContent = '確認メールを送信しました。メール内のリンクから登録を完了してください。'); }
  catch (e) { errOut(f, e); }
};
window.doLogout = async () => { await DB.signOut(); go(''); };
window.fav = async id => {
  const on = (await DB.ids('favorites')).includes(id);
  on ? await DB.del('favorites', id) : await DB.add('favorites', id);
  toast(on ? 'お気に入りから外しました' : 'お気に入りに追加しました'); render();
};
window.visit = async id => { await DB.add('visits', id); toast('スタンプを獲得しました！ +50pt'); go('mymap'); };
window.doFilter = f => go('list?' + new URLSearchParams([...new FormData(f)].filter(([, v]) => v)));
window.setFrom = v => ($('#from').value = v);
window.openBus = (lat, lng) => open(`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent($('#from').value)}&destination=${lat},${lng}&travelmode=transit`, '_blank');
window.doReview = async (f, id) => {
  try {
    const name = (await DB.user()).name;
    f.querySelector('button').disabled = true;
    const image_url = await upPick('rvimg');
    await DB.addReview({ shop_id: id, rating: +f.rating.value, body: f.body.value, username: name, image_url, created_at: new Date().toISOString() });
    toast('口コミを投稿しました'); go('shop/' + id);
  } catch (e) { errOut(f, e); f.querySelector('button').disabled = false; }
};
window.doProfile = async f => {
  try {
    f.querySelector('button').disabled = true;
    const p = await DB.profile(), avatar_url = (await upPick('avimg')) || p.avatar_url;
    await DB.saveProfile({ username: f.username.value.trim(), bio: f.bio.value.trim(), avatar_url });
    toast('プロフィールを保存しました'); go('mypage');
  } catch (e) { errOut(f, e); f.querySelector('button').disabled = false; }
};
window.setStatus = async (id, st) => { await DB.setStatus(id, st); SHOPS = null; toast(st === 'public' ? '公開しました' : '却下しました'); render(); };

// ===== 画面（番号は画面遷移図に対応） =====
const V = {
  // 01 トップ
  '': () => ({ cls: 'p0', h: `<div class="hero"><div class="emojis">🍜🍢🍛☕</div>
    <h1 class="logo">むろらん<br>グルメマップ</h1><p>食べて、歩いて、<br>もっと室蘭が好きになる。</p>
    <div class="hero-btns"><a class="btn white" href="#/login">ログイン</a><a class="btn ghost" href="#/signup">はじめての方（新規登録）</a></div>
    ${useSB ? '' : '<p class="muted">デモモード：データはこの端末にのみ保存されます</p>'}</div>` }),
  // 02 ログイン
  login: () => ({ t: 'ログイン', h: `<div class="auth"><div class="brand">🍜 むろらんグルメマップ</div><h1>おかえりなさい</h1>
    <form onsubmit="doLogin(this);return false"><label class="f">メールアドレス<input name="email" type="email" autocomplete="email" required></label>
    <label class="f">パスワード<input name="pw" type="password" autocomplete="current-password" required></label>
    <p class="err"></p><button class="btn">ログイン</button></form>
    <p class="center muted">アカウントをお持ちでない方は <a href="#/signup">新規登録</a></p></div>` }),
  // 03 新規登録
  signup: () => ({ t: '新規登録', h: `<div class="auth"><div class="brand">🍜 むろらんグルメマップ</div><h1>アカウントを作成</h1>
    <form onsubmit="doSignup(this);return false"><label class="f">ユーザー名（口コミに表示）<input name="name" required></label>
    <label class="f">メールアドレス<input name="email" type="email" autocomplete="email" required></label>
    <label class="f">パスワード（6文字以上）<input name="pw" type="password" minlength="6" autocomplete="new-password" required></label>
    <p class="err"></p><button class="btn">登録する</button></form>
    <p class="center muted">登録済みの方は <a href="#/login">ログイン</a></p></div>` }),
  // 04 探し方の選択（ホーム）
  async search({ me }) {
    const [all, R] = await Promise.all([shops(), rates()]);
    return { h: `<div class="home-head"><p>こんにちは、${esc(me.name)}さん</p><h1>今日はなに食べる？</h1>
      <a class="searchbox" href="#/filter">${I('search', 18)}<span>エリア・予算・こだわりで探す</span></a></div>
      <section><div class="sec-head"><h2>ジャンルから探す</h2><a href="#/list">すべてのお店 ›</a></div><div class="ggrid">${gtiles()}</div></section>
      <section><h2>エリアから探す</h2><div class="chips">${AREAS.map(a => `<a class="chip" href="#/list?area=${encodeURIComponent(a)}">${a}</a>`).join('')}</div></section>
      <a class="mapbanner" href="#/map"><div><b>地図から探す</b><small>ピンをタップしてお店をチェック</small></div>${I('map', 30)}</a>
      <section><h2>室蘭の名店</h2><div class="hscroll">${all.map(s => mini(s, R)).join('')}</div></section>${all.some(s => s.url) ? CREDIT : ''}` };
  },
  // 05 ジャンル選択
  genre: () => ({ t: 'ジャンル選択', h: `<h1>食べたいジャンルは？</h1><p class="muted">タップするとお店の一覧を表示します</p>
    <div class="ggrid lg">${gtiles()}<a class="gtile" href="#/list"><span>🍽️</span>すべてのお店</a></div>` }),
  // 06 店舗一覧
  async list({ q, qs }) {
    const [all, favs, R] = await Promise.all([shops(), DB.ids('favorites'), rates()]);
    const list = filt(all, q);
    const act = [q.genre, q.area, q.budget && `〜${yen(q.budget)}`, ...TAGS.filter(([k]) => q[k]).map(([, t]) => t)].filter(Boolean);
    return { t: q.genre || q.area || '店舗一覧', h: `<div class="toolbar"><span class="count"><b>${list.length}</b>件</span>
      <a class="tbtn" href="#/filter?${qs}">${I('filter', 16)}絞り込み</a><a class="tbtn" href="#/map?${qs}">${I('map', 16)}地図</a></div>
      ${act.length ? `<div class="chips small">${act.map(a => `<span class="chip on">${esc(a)}</span>`).join('')}<a class="chip clear" href="#/list">クリア</a></div>` : ''}
      ${list.map(s => card(s, favs, R)).join('') || empty('条件に合うお店がありません', '条件を変えて探してみてください')}` };
  },
  // 07 条件検索
  filter: ({ q }) => ({ t: '条件検索', h: `<form class="fform" onsubmit="doFilter(this);return false">
    <h3>ジャンル</h3><div class="chips">${radios('genre', GENRES.map(g => g.k), q.genre)}</div>
    <h3>エリア</h3><div class="chips">${radios('area', AREAS, q.area)}</div>
    <h3>予算（1人あたり）</h3><div class="chips">${radios('budget', [1000, 2000, 3000], q.budget, v => `〜${yen(v)}`)}</div>
    <h3>こだわり</h3><div class="chips">${TAGS.map(([k, t]) => `<label class="chip"><input type="checkbox" name="${k}" value="1" ${q[k] ? 'checked' : ''}>${t}</label>`).join('')}</div>
    <div class="sticky-bottom"><a class="btn sub" href="#/filter">クリア</a><button class="btn">${I('search', 18)}この条件で検索</button></div></form>` }),
  // 08 マップ検索
  async map({ q, qs }) {
    const [list, R] = [filt(await shops(), q), await rates()];
    return { t: 'マップ検索', cls: 'p0', h: `<div id="map" class="full"></div><a class="fab" href="#/list?${qs}">${I('list', 18)}一覧で見る（${list.length}件）</a>`, a: () => mkMap(list, R) };
  },
  // 09 店舗詳細
  async shop({ id }) {
    const s = await shopById(id), g = gm(s);
    const [rv, favs, vis] = await Promise.all([DB.reviews(id), DB.ids('favorites'), DB.ids('visits')]);
    const avg = rv.length ? rv.reduce((a, r) => a + r.rating, 0) / rv.length : 0, isF = favs.includes(id), isV = vis.includes(id);
    return { t: '店舗詳細', h: `${s.photo_url ? `<div class="dhero ph" style="background-image:url('${esc(s.photo_url)}')"></div>` : `<div class="dhero" style="--c:${g.c}">${g.e}</div>`}<div class="sheet">
      <div>${genres(s).map(x => `<span class="tag">${esc(x)}</span> `).join('')}</div>
      <h1 class="dname">${esc(s.name)}</h1>
      <div class="drate"><span class="stars">${stars(Math.round(avg))}</span><b>${avg ? avg.toFixed(1) : '-'}</b><small>口コミ${rv.length}件</small>${isV ? '<span class="badge">✓ 訪問済み</span>' : ''}</div>
      <div class="actions"><a href="#/shopmap/${id}">${I('map')}地図</a><a href="#/bus/${id}">${I('bus')}バスで行く</a>
        <a href="#/review/${id}">${I('edit')}口コミ</a><button class="${isF ? 'on' : ''}" onclick="fav(${id})">${I('heart')}${isF ? '保存済み' : 'お気に入り'}</button></div>
      <ul class="info"><li>${I('pin', 18)}<div><small>住所</small>${esc(s.address)}</div></li>
        <li>${I('clock', 18)}<div><small>営業時間</small>${esc(s.hours)}</div></li>
        <li><i class="yen">¥</i><div><small>予算（1人あたり）</small>〜${yen(s.budget)}</div></li></ul>
      <div class="chips small">${TAGS.filter(([k]) => s[k]).map(([, t]) => `<span class="chip">${t}</span>`).join('')}</div>
      ${s.note ? `<div class="memo">💬 ${esc(s.note)}</div>` : ''}
      ${s.url ? `<a class="btn sub" href="${esc(s.url)}" target="_blank">${I('ext', 18)}ホットペッパーで詳細・予約</a>` : ''}
      <button class="btn" onclick="visit(${id})" ${isV ? 'disabled' : ''}>${isV ? '✓ 訪問済み（スタンプ獲得済み）' : '訪問済みとして登録してスタンプGET'}</button>
      <div class="sec-head"><h2>口コミ</h2><a href="#/review/${id}">${I('edit', 16)} 書く</a></div>
      ${rv.map(r => { const nm = r.profiles?.username || r.username; return `<div class="rv"><div class="rvh">${av(nm, r.profiles?.avatar_url)}<b>${esc(nm)}</b>
        <span class="stars">${stars(r.rating)}</span><small>${new Date(r.created_at).toLocaleDateString('ja-JP')}</small></div><p>${esc(r.body)}</p>
        ${r.image_url ? `<img class="rvimg" src="${esc(r.image_url)}" loading="lazy" alt="" onclick="open(this.src)">` : ''}</div>`; }).join('')
        || empty('まだ口コミはありません', '最初の口コミを書いてみませんか？')}${s.url ? CREDIT : ''}</div>` };
  },
  // 10 店舗の地図
  async shopmap({ id }) {
    const s = await shopById(id);
    return { t: '店舗の地図', h: `<div id="map"></div><div class="addr"><b>${esc(s.name)}</b><div class="muted">${I('pin', 14)} ${esc(s.address)}</div></div>
      <a class="btn" target="_blank" href="https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lng}">${I('ext', 18)}Googleマップで開く</a>`, a: () => mkMap([s]) };
  },
  // 11 バス経路
  async bus({ id }) {
    const s = await shopById(id);
    return { t: 'バス経路', h: `<div class="rhead">${thumb(s)}<div><small class="muted">目的地</small><h2 style="margin:0">${esc(s.name)}</h2></div></div>
      <div class="route"><div><span>🚶</span>徒歩</div><i>›</i><div><span>🚌</span>バス</div><i>›</i><div><span>🚶</span>徒歩</div><i>›</i><div><span>${gm(s).e}</span>到着</div></div>
      <label class="f">出発地<input id="from" value="室蘭工業大学"></label>
      <div class="chips small" style="margin-top:10px">${['室蘭工業大学', '室蘭駅', '東室蘭駅'].map(v => `<span class="chip" onclick="setFrom('${v}')">${v}</span>`).join('')}</div>
      <button class="btn" onclick="openBus(${s.lat},${s.lng})">${I('bus', 18)}Googleマップで経路を見る</button>
      <p class="muted center">停留所・路線・時刻・料金はGoogleマップで表示されます</p>` };
  },
  // 12 口コミ投稿
  async review({ id }) {
    const s = await shopById(id);
    return { t: '口コミ投稿', h: `<div class="rhead">${thumb(s)}<h2 style="margin:0">${esc(s.name)}</h2></div>
      <form onsubmit="doReview(this,${id});return false"><label class="f">評価</label>
      <div class="starin">${[5, 4, 3, 2, 1].map(n => `<input type="radio" name="rating" id="r${n}" value="${n}" ${n === 5 ? 'checked' : ''}><label for="r${n}">★</label>`).join('')}</div>
      <label class="f">口コミ<textarea name="body" rows="6" placeholder="料理の味、雰囲気、おすすめメニューなど" required></textarea></label>
      <label class="f">写真（任意）</label><label class="imgpick"><input type="file" accept="image/*" onchange="pickImg(this,'rvimg',1280)"><div id="rvimg">${I('edit', 20)}<span>タップして写真を追加</span></div></label>
      <p class="err"></p><button class="btn">投稿する</button></form>` };
  },
  // 13 スタンプ（10店で1枚、1店50pt）
  async stamp() {
    const [vis, all] = await Promise.all([DB.ids('visits'), shops()]);
    const seq = vis.map(id => all.find(s => s.id === id)).filter(Boolean), n = seq.length, cur = n % 10;
    return { t: 'スタンプラリー', h: `<div class="stampcard"><small>STAMP RALLY</small><b>室蘭グルメ探検隊</b>
      <div class="stamps">${Array.from({ length: 10 }, (_, i) => { const s = i < cur && seq[n - cur + i]; return s ? `<span class="on">${gm(s).e}</span>` : `<span>${i + 1}</span>`; }).join('')}</div>
      <div class="prog"><i style="width:${cur * 10}%"></i></div><p>あと<b>${10 - cur}</b>店舗で特典ゲット！</p></div>
      <div class="stats"><div><b>${n * 50}</b><small>ポイント</small></div><div><b>${n}</b><small>訪問店舗</small></div><div><b>${Math.floor(n / 10)}</b><small>達成カード</small></div></div>
      <h2>訪問履歴</h2>${seq.slice().reverse().map(rowi).join('') || empty('まだ訪問記録がありません', 'お店の詳細画面から「訪問済み」を登録しよう')}` };
  },
  // 14 お気に入り
  async fav() {
    const [all, favs, R] = await Promise.all([shops(), DB.ids('favorites'), rates()]);
    const list = all.filter(s => favs.includes(s.id));
    return { t: 'お気に入り', h: list.length
      ? `<p class="muted">${list.length}件のお店を保存中（♥で解除）</p>${list.map(s => card(s, favs, R)).join('')}<a class="btn sub" href="#/mymap">${I('map', 18)}自分のマップで見る</a>`
      : empty('お気に入りはまだありません', 'お店の ♡ をタップして保存しよう') };
  },
  // 15 マイページ
  async mypage({ me }) {
    const [vis, favs, p] = await Promise.all([DB.ids('visits'), DB.ids('favorites'), DB.profile()]);
    const pend = p.is_admin ? (await DB.pending()).length : 0;
    return { t: 'マイページ', h: `<div class="profile">${av(p.username || me.name, p.avatar_url, 'lg')}<h1>${esc(p.username || me.name)}</h1>
      ${p.bio ? `<p class="bio">${esc(p.bio)}</p>` : ''}<a class="tbtn" href="#/profile">${I('edit', 14)}プロフィールを編集</a></div>
      <div class="stats"><div><b>${vis.length}</b><small>訪問</small></div><div><b>${favs.length}</b><small>お気に入り</small></div><div><b>${vis.length * 50}</b><small>ポイント</small></div></div>
      <div class="menu"><a href="#/mymap">${I('map')}<span>自分のマップ<br><small>訪問記録・お気に入りを地図で</small></span>${I('chev', 18)}</a>
        <a href="#/fav">${I('heart')}<span>お気に入りのお店</span>${I('chev', 18)}</a>
        <a href="#/stamp">${I('award')}<span>スタンプラリー達成状況</span>${I('chev', 18)}</a>
        ${p.is_admin ? `<a href="#/admin">${I('list')}<span>店舗の承認（管理者）<br><small>承認待ち ${pend}件</small></span>${I('chev', 18)}</a>` : ''}
        <button class="danger" onclick="doLogout()">${I('logout')}<span>ログアウト</span></button></div>` };
  },
  // プロフィール編集
  async profile({ me }) {
    const p = await DB.profile();
    return { t: 'プロフィール編集', h: `<form onsubmit="doProfile(this);return false">
      <label class="avpick"><input type="file" accept="image/*" onchange="pickImg(this,'avimg',400)">
        <div id="avimg" class="${p.avatar_url ? 'has' : ''}" style="${p.avatar_url ? `background-image:url('${esc(p.avatar_url)}')` : ''}"><span>${esc((p.username || me.name)[0])}</span></div><small>${I('edit', 14)} 画像を変更</small></label>
      <label class="f">ユーザー名<input name="username" value="${esc(p.username || me.name)}" maxlength="20" required></label>
      <label class="f">自己紹介<textarea name="bio" rows="4" maxlength="160" placeholder="好きなジャンルや推しのお店など">${esc(p.bio)}</textarea></label>
      <p class="err"></p><button class="btn">保存する</button></form>` };
  },
  // 店舗の承認（管理者）
  async admin() {
    if (!(await DB.profile()).is_admin) throw Error('管理者のみ利用できます');
    const list = await DB.pending();
    return { t: '店舗の承認', h: `<p class="muted">自動取り込みで見つかった店舗です。公開すると一覧・地図に表示されます。</p>
      ${list.map(s => `<div class="adm">${thumb(s)}<div class="cbody"><div class="cname">${esc(s.name)}</div>
        <div class="cmeta"><span>${esc(s.genre)}</span><span>${esc(s.area)}</span>${s.budget ? `<span>〜${yen(s.budget)}</span>` : ''}</div>
        <div class="cmeta">${esc(s.address)}</div>${s.url ? `<a class="cmeta" href="${esc(s.url)}" target="_blank">掲載ページを確認 ›</a>` : ''}
        <div class="admbtn"><button class="btn" onclick="setStatus(${s.id},'public')">公開</button><button class="btn sub" onclick="setStatus(${s.id},'rejected')">却下</button></div></div></div>`).join('')
        || empty('承認待ちの店舗はありません', '次回の自動取り込みをお待ちください')}${list.length ? CREDIT : ''}` };
  },
  // 16 自分のマップ
  async mymap() {
    const [all, favs, vis, R] = await Promise.all([shops(), DB.ids('favorites'), DB.ids('visits'), rates()]);
    const colorOf = s => favs.includes(s.id) ? STATUS.fav : vis.includes(s.id) ? STATUS.visit : STATUS.none;
    return { t: '自分のマップ', cls: 'p0', h: `<div class="legend"><span><i class="dot" style="background:${STATUS.none}"></i>未訪問</span>
      <span><i class="dot" style="background:${STATUS.visit}"></i>訪問済み</span><span><i class="dot" style="background:${STATUS.fav}"></i>お気に入り</span></div>
      <div id="map" class="full"></div>`, a: () => mkMap(all, R, colorOf) };
  },
};

const TABS = [['search', 'home', 'ホーム'], ['map', 'map', '地図'], ['stamp', 'award', 'スタンプ'], ['fav', 'heart', 'お気に入り'], ['mypage', 'user', 'マイページ']];
const PARENT = { list: 'search', genre: 'search', filter: 'search', shop: 'search', shopmap: 'search', bus: 'search', review: 'search', mymap: 'mypage', profile: 'mypage', admin: 'mypage' };
const nav = cur => `<nav>${TABS.map(([k, ic, t]) => `<a class="${k === cur ? 'on' : ''}" href="#/${k}">${I(ic, 22)}${t}</a>`).join('')}</nav>`;

// ===== ルーター =====
async function render() {
  // メール確認リンクから戻った直後（#access_token=… / #error=…）
  if (/access_token=|error=/.test(location.hash)) { const u = await DB.user(); history.replaceState(null, '', location.pathname); return go(u ? 'search' : 'login'); }
  const [path, qs = ''] = location.hash.slice(2).split('?');
  const [name = '', arg] = path.split('/');
  const me = await DB.user(), pub = ['', 'login', 'signup'].includes(name);
  if (!me && !pub) return go('');
  if (me && pub) return go('search');
  const root = TABS.some(([k]) => k === name);
  try {
    const v = await (V[name] || V[''])({ id: Number(arg), q: Object.fromEntries(new URLSearchParams(qs)), qs, me });
    $('#app').className = me ? 'nav' : '';
    $('#app').innerHTML = (v.t ? `<header>${root ? '<span class="hsp"></span>' : `<button class="back" onclick="history.length>1?history.back():go('search')" aria-label="戻る">${I('back')}</button>`}<h2>${v.t}</h2><span class="hsp"></span></header>` : '')
      + `<main class="${v.cls || ''}">${v.h}</main>` + (me ? nav(PARENT[name] || name) : '');
    v.a?.(); scrollTo(0, 0);
  } catch (e) { $('#app').innerHTML = `<main>${empty('エラーが発生しました', esc(e.message))}<a class="btn" href="#/search">ホームへ</a></main>` + (me ? nav('search') : ''); }
}
addEventListener('hashchange', render);
render();
