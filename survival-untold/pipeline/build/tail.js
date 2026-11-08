// ================= VOX-STYLE LAYER ==================================================
const PAL = {
  S1: '#ffd23f', E1: '#ffd23f', S2: '#4cc9f0', E2: '#4cc9f0', S3: '#2ec4b6', E3: '#2ec4b6', E4: '#2ec4b6',
  S4: '#ff6b6b', E5: '#ff6b6b', S5: '#f9a03f', E6: '#f9a03f', S6: '#9b5de5', E7: '#9b5de5',
  S7: '#8ac926', E8: '#8ac926', S8: '#4d9de0', E9: '#4d9de0', S9: '#0e1a40', E10: '#0e1a40', S10: '#e63946', E11: '#e63946'
};
const ORDER = TL.clips.map(c => c.id);
function panelAt(t) {
  let idx = 0;
  for (let i = 0; i < TL.clips.length; i++) if (t >= TL.clips[i].start - 0.05) idx = i;
  // the bulb dying switches to navy immediately
  const col = id => (t >= TL.bulbDies && ORDER.indexOf(id) < ORDER.indexOf('S9')) ? '#0e1a40' : PAL[id];
  const cur = col(TL.clips[idx].id);
  let prev = idx > 0 ? col(TL.clips[idx - 1].id) : cur;
  let t0 = TL.clips[idx].start - 0.05;
  if (t >= TL.bulbDies && t < TL.bulbDies + 0.35) { prev = PAL.E9; t0 = TL.bulbDies; return { cur: '#0e1a40', prev, k: ease((t - t0) / 0.35) }; }
  return { cur, prev, k: ease(clamp((t - t0) / 0.3)) };
}
function shade(hex, f) { // multiply rgb by f
  const n = parseInt(hex.slice(1), 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const m = v => Math.max(0, Math.min(255, Math.round(v * f)));
  return `rgb(${m(r)},${m(g)},${m(b)})`;
}
function panel(t) {
  const p = panelAt(t);
  const dark = p.cur === '#0e1a40';
  let s = `<rect width="1080" height="1920" fill="${p.prev}"/>`;
  s += `<circle cx="540" cy="760" r="${f2(p.k * 1800)}" fill="${p.cur}"/>`;
  // sunburst rays behind Edison
  let rays = '';
  for (let i = 0; i < 18; i++) {
    const a0 = (i * 20 + t * 4) * Math.PI / 180, a1 = a0 + 0.17;
    rays += `<path d="M540 760 L${(540 + 2000 * Math.cos(a0)).toFixed(0)} ${(760 + 2000 * Math.sin(a0)).toFixed(0)} L${(540 + 2000 * Math.cos(a1)).toFixed(0)} ${(760 + 2000 * Math.sin(a1)).toFixed(0)}z" fill="#fff"/>`;
  }
  s += `<g opacity="${dark ? 0.05 : 0.16}">${rays}</g>`;
  // halftone dots, bottom half
  s += `<rect x="0" y="1180" width="1080" height="740" fill="url(#dots)" opacity="${dark ? 0.2 : 0.3}"/>`;
  s += office(t, p);
  return s;
}


function office(t, p) {
  const dead = t >= TL.bulbDies;
  const wood = '#c58b4a', woodD = '#a56d33';
  let s = '';
  // bookshelf (left)
  s += `<rect x="24" y="430" width="236" height="540" fill="${woodD}" stroke="#111" stroke-width="7"/>`;
  [430, 610, 790].forEach((y, r) => {
    s += `<rect x="36" y="${y + 150}" width="212" height="14" fill="${wood}" stroke="#111" stroke-width="4"/>`;
    const cols = ['#e63946', '#4d9de0', '#ffd23f', '#2ec4b6', '#9b5de5', '#f9a03f', '#fff6d6'];
    let x = 44;
    for (let b = 0; b < 8; b++) { const w = 18 + ((b * 7 + r * 3) % 4) * 6, h = 90 + ((b * 13 + r * 5) % 4) * 14; s += `<rect x="${x}" y="${y + 150 - h}" width="${w}" height="${h}" fill="${cols[(b + r) % cols.length]}" stroke="#111" stroke-width="3.5"/>`; x += w + 2; if (x > 226) break; }
  });
  // framed patent (right wall)
  s += `<g transform="translate(900 470) rotate(3)"><rect x="-96" y="-76" width="192" height="152" fill="#fff6d6" stroke="#111" stroke-width="7"/><rect x="-80" y="-60" width="160" height="120" fill="none" stroke="#111" stroke-width="2"/><ellipse cx="-20" cy="-8" rx="26" ry="32" fill="none" stroke="#111" stroke-width="4"/><path d="M-4 24 h16 v16 h-16z M30 -30 h40 M30 -10 h40 M30 10 h40" fill="none" stroke="#111" stroke-width="4"/><text x="0" y="-84" text-anchor="middle" font-size="22" fill="#111">PATENT</text></g>`;
  // hanging bulb (dies after E9)
  s += `<line x1="150" y1="0" x2="150" y2="300" stroke="#111" stroke-width="6"/><rect x="132" y="296" width="36" height="34" fill="#888" stroke="#111" stroke-width="5"/>
        <ellipse cx="150" cy="364" rx="38" ry="46" fill="${dead ? '#7a8a90' : '#fff2a8'}" stroke="#111" stroke-width="6"/>`;
  if (!dead) s += `<circle cx="150" cy="364" r="${130 + Math.sin(t * 40) * 4}" fill="#fff2a8" opacity="0.28"/>`;
  // floor, rug
  s += `<path d="M0 1700 L1080 1700 L1080 1920 L0 1920z" fill="#b97a3c" stroke="#111" stroke-width="7"/>`;
  for (let k = 0; k < 6; k++) s += `<path d="M0 ${1740 + k * 38} L1080 ${1740 + k * 38}" stroke="#8a5a2b" stroke-width="3"/>`;
  s += `<ellipse cx="560" cy="1700" rx="360" ry="34" fill="#000" opacity="0.2"/>`;
  return s;
}

function paperCard(x, y, w, h, rot, inner, k) {
  const sc = (0.2 + 0.8 * k + Math.sin(k * Math.PI) * 0.12) * 0.8;
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${f2(sc)})" opacity="${f2(clamp(k * 2))}">
    <rect x="${-w / 2 + 10}" y="${-h / 2 + 14}" width="${w}" height="${h}" rx="14" fill="#000" opacity="0.28"/>
    <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="14" fill="#fbf4e1" stroke="#111" stroke-width="7"/>
    <rect x="${-30}" y="${-h / 2 - 16}" width="60" height="30" fill="#ffe08a" opacity="0.85" transform="rotate(-6)"/>
    ${inner}</g>`;
}
function lbl(txt, y, size, fill) { return `<text x="0" y="${y}" text-anchor="middle" font-size="${size}" fill="${fill || '#111'}">${txt}</text>`; }

const ICON = {
  title: t => `${lbl('INTERVIEWING', -60, 42)}${lbl('HISTORY’S', 0, 42)}${lbl('BIGGEST EGOS', 66, 44, '#d62828')}<path d="M-150 120 h300" stroke="#111" stroke-width="6"/>${lbl('EP. 1: THE LIGHT BULB', 165, 26)}`,
  bulb: t => `<g transform="scale(1)"><circle cx="0" cy="-30" r="${120 + Math.sin(t * 9) * 6}" fill="#ffe88a" opacity="0.5"/><ellipse cx="0" cy="-40" rx="74" ry="88" fill="#fff2a8" stroke="#111" stroke-width="7"/><rect x="-34" y="40" width="68" height="48" rx="6" fill="#999" stroke="#111" stroke-width="6"/><path d="M-20 60 h40 M-20 76 h40" stroke="#111" stroke-width="5"/><path d="M-30 -30 q15 -40 30 0 q15 40 30 0" fill="none" stroke="#d62828" stroke-width="7"/></g>${lbl('WHO INVENTED IT?', 150, 38)}`,
  sun: t => `<g transform="rotate(${t * 40})">${Array.from({ length: 12 }, (_, i) => `<rect x="-8" y="-150" width="16" height="44" rx="6" fill="#ff9f1c" stroke="#111" stroke-width="4" transform="rotate(${i * 30})"/>`).join('')}</g><circle r="86" fill="#ffd23f" stroke="#111" stroke-width="7"/><path d="M-34 10 q34 34 68 0" fill="none" stroke="#111" stroke-width="7"/><circle cx="-28" cy="-14" r="8" fill="#111"/><circle cx="28" cy="-14" r="8" fill="#111"/>${lbl('THE SUN', 190, 40)}`,
  moon: t => `<circle r="90" fill="#dfe7ff" stroke="#111" stroke-width="7"/><circle cx="46" cy="-26" r="78" fill="#fbf4e1"/><path d="M-66 -70 l8 18 l18 8 l-18 8 l-8 18 l-8 -18 l-18 -8 l18 -8z" fill="#ffd23f" stroke="#111" stroke-width="3" transform="translate(70 -10)"/>${lbl('CLOCKED OUT', 190, 40)}`,
  overtime: t => `<circle r="100" fill="#fff" stroke="#111" stroke-width="8"/><path d="M0 -70 V0 L${50 * Math.cos(t * 6)} ${50 * Math.sin(t * 6)}" fill="none" stroke="#111" stroke-width="8"/><circle r="9" fill="#d62828"/>${lbl('OVERTIME', 190, 42, '#d62828')}`,
  swan: t => `<path d="M-120 -90 h240 v190 h-240z" fill="#e9eef7" stroke="#2457a6" stroke-width="4"/><path d="M-90 -50 h180 M-90 -20 h180 M-90 10 h180" stroke="#9fb4d6" stroke-width="2"/><ellipse cx="0" cy="-30" rx="38" ry="48" fill="none" stroke="#2457a6" stroke-width="5"/><path d="M-14 18 h28 v28 h-28z" fill="none" stroke="#2457a6" stroke-width="5"/><path d="M-14 -30 q14 20 28 0" fill="none" stroke="#2457a6" stroke-width="4"/>${lbl('JOSEPH SWAN', 150, 36)}${lbl('BRITISH · c. 1878–79', 190, 26, '#2457a6')}`,
  waterfowl: t => `<g transform="translate(-70 0)"><path d="M-70 40 q0 -60 60 -50 q-10 -60 20 -80 q30 -10 20 30 q40 10 40 60 q-10 50 -80 50z" fill="#fff" stroke="#111" stroke-width="6"/><path d="M40 -70 l36 8 l-36 10z" fill="#ff8a1f" stroke="#111" stroke-width="4"/><circle cx="26" cy="-60" r="5" fill="#111"/></g><g transform="translate(80 40)"><ellipse rx="40" ry="30" fill="#9aa5b1" stroke="#111" stroke-width="5"/><circle cx="34" cy="-22" r="18" fill="#9aa5b1" stroke="#111" stroke-width="5"/><rect x="-6" y="-60" width="26" height="46" rx="5" fill="#222" transform="rotate(30 0 0)"/></g>${lbl('SWAN ... PIGEON?', 160, 34)}`,
  team: t => `${[-150, -75, 0, 75, 150].map((x, i) => `<g transform="translate(${x} ${Math.sin(t * 6 + i) * 6})"><circle cy="-30" r="26" fill="#ffd0a8" stroke="#111" stroke-width="5"/><path d="M-30 60 q0 -70 30 -70 q30 0 30 70z" fill="${['#e63946', '#4d9de0', '#2ec4b6', '#f9a03f', '#9b5de5'][i]}" stroke="#111" stroke-width="5"/></g>`).join('')}${lbl('THE TEAM', 150, 44)}`,
  toaster: t => `<rect x="-90" y="-60" width="180" height="110" rx="26" fill="#c9ced6" stroke="#111" stroke-width="7"/><rect x="-60" y="-70" width="42" height="16" rx="6" fill="#111"/><rect x="18" y="-70" width="42" height="16" rx="6" fill="#111"/><path d="M90 0 q60 0 60 50 q0 60 -50 60" fill="none" stroke="#111" stroke-width="6"/><path d="M100 110 l24 -10 l8 14 l-24 10z" fill="#555" stroke="#111" stroke-width="3"/>${lbl('UNPLUGGED', 170, 40)}`,
  ediswan: t => `<g transform="rotate(-6)"><rect x="-150" y="-70" width="300" height="140" rx="14" fill="none" stroke="#d62828" stroke-width="9"/>${lbl('EDISWAN', 24, 66, '#d62828')}${lbl('MERGED 1883', 62, 26, '#d62828')}</g>${lbl('A BUSINESS DECISION', 150, 32)}`,
  pancake: t => `<ellipse cx="0" cy="40" rx="120" ry="30" fill="#e0a25a" stroke="#111" stroke-width="6"/><ellipse cx="0" cy="14" rx="116" ry="28" fill="#f2bf7a" stroke="#111" stroke-width="6"/><ellipse cx="0" cy="-12" rx="110" ry="27" fill="#e0a25a" stroke="#111" stroke-width="6" transform="rotate(${Math.sin(t * 4) * 2})"/><ellipse cx="0" cy="-40" rx="64" ry="20" fill="#ffe08a" stroke="#111" stroke-width="5"/>${lbl('THE FIRST PANCAKE', 150, 36)}`,
  dead: t => `<ellipse cx="0" cy="-40" rx="74" ry="88" fill="#7a8a90" stroke="#111" stroke-width="7"/><rect x="-34" y="40" width="68" height="48" rx="6" fill="#999" stroke="#111" stroke-width="6"/><path d="M-60 -90 l120 120 M60 -90 l-120 120" stroke="#d62828" stroke-width="12" stroke-linecap="round"/>${lbl('BULB: OFFLINE', 160, 38)}`,
  potato: t => `<ellipse cx="0" cy="0" rx="120" ry="80" fill="#c99a5b" stroke="#111" stroke-width="7" transform="rotate(-10)"/><circle cx="-40" cy="-14" r="8" fill="#8a6430"/><circle cx="30" cy="16" r="7" fill="#8a6430"/><circle r="150" fill="#ffe88a" opacity="${0.25 + Math.sin(t * 10) * 0.1}"/>${lbl('GLOWING POTATO', 160, 36)}`,
  tesla: t => `<path d="M30 -150 L-50 10 H0 L-30 150 L70 -30 H10z" fill="#ffd23f" stroke="#111" stroke-width="7" stroke-linejoin="round"/>${lbl('?', 30, 110, '#111')}`
};
const CARDS = [
  ['title', C.S1.start, C.S1.end + 0.3],
  ['bulb', C.E1.start + 0.4, C.E1.end],
  ['sun', C.S2.start, C.E2.start + C.E2.dur * 0.5], ['moon', C.E2.start + C.E2.dur * 0.5, C.E2.start + C.E2.dur * 0.78], ['overtime', C.E2.start + C.E2.dur * 0.78, C.S3.start],
  ['swan', C.S3.start, C.E3.end],
  ['waterfowl', C.E4.start, C.S4.start],
  ['team', C.S4.start, C.E5.end],
  ['toaster', C.E6.start, C.S6.start],
  ['ediswan', C.S6.start, C.E7.end],
  ['pancake', C.E8.start - 0.1, C.S8.start],
  ['dead', TL.bulbDies, C.E10.start + C.E10.dur * 0.55], ['potato', C.E10.start + C.E10.dur * 0.55, C.S10.start],
  ['tesla', C.S10.start, C.E11.end]
];
function cardAt(t) {
  for (const [k, a, b] of CARDS) if (t >= a && t < b) return { k, a, b };
  return null;
}

// insult stamps (same timing as the lightning)
const MARK = { E1: ['MORON!', 'outage!', 'cord', 'darkness?!'], E2: ['disappointment!', 'OVERTIME!'], E4: ['WATERFOWL?!'], E5: ['waffle!'], E6: ['toaster!'], E7: ['lamp!'], E10: ['potato!'], E11: ['CATASTROPHIC,', 'MORON!'] };
const STAMP = {};
const STAMPS = [];
for (const c of TL.clips) {
  if (!MARK[c.id]) continue;
  const words = c.text.split(' '), w = words.map(x => x.length + 2), tot = w.reduce((a, b) => a + b, 0);
  let acc = 0; const tm = {};
  words.forEach((wd, i) => { tm[wd] = tm[wd] || (c.start + c.dur * acc / tot); acc += w[i]; });
  for (const m of MARK[c.id]) if (tm[m] !== undefined) STAMPS.push({ t: tm[m], word: m.replace(/[^A-Za-z-]/g, '').toUpperCase() });
}
const STAMP_COL = ['#e63946', '#1d3557', '#6a040f', '#2b9348'];

// sticker look for cut-out characters
const STICKER = `<filter id="sticker" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">
  <feMorphology in="SourceAlpha" operator="dilate" radius="9" result="d"/>
  <feFlood flood-color="#fffdf5"/><feComposite in2="d" operator="in" result="w"/>
  <feMorphology in="SourceAlpha" operator="dilate" radius="14" result="d2"/>
  <feFlood flood-color="#111"/><feComposite in2="d2" operator="in" result="k"/>
  <feOffset in="k" dx="10" dy="16" result="sh"/>
  <feGaussianBlur in="sh" stdDeviation="6" result="shb"/>
  <feColorMatrix in="shb" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0"/>
  <feMerge><feMergeNode/><feMergeNode in="k"/><feMergeNode in="w"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;

function deskFlat() {
  return `<g><rect x="0" y="1560" width="470" height="34" fill="#c58b4a" stroke="#111" stroke-width="7"/><rect x="26" y="1594" width="30" height="108" fill="#a56d33" stroke="#111" stroke-width="6"/><rect x="414" y="1594" width="30" height="108" fill="#a56d33" stroke="#111" stroke-width="6"/>
  <rect x="150" y="1496" width="210" height="64" fill="#fff6d6" stroke="#111" stroke-width="6"/><path d="M168 1518 h174 M168 1536 h130" stroke="#111" stroke-width="4"/></g>`;
}
function shelfFlat(t, endcard) {
  return `<rect x="905" y="668" width="175" height="20" fill="#c58b4a" stroke="#111" stroke-width="6"/>${duck(985, 650, 0.95, endcard)}`;
}


function edisonBody(t, st, freeze) {
  if (freeze) return '';
  const o = openness('E', t), a = clamp(o * 1.3), sp = speaking('E');
  const X = 540, by = sp ? Math.sin(t * 28) * 4 * a : 0;
  const l1 = sp ? Math.max(0, Math.sin(t * 10)) * 30 * a : 0, l2 = sp ? Math.max(0, Math.sin(t * 10 + 3)) * 30 * a : 0;
  let L = [X - 165, 1230 + Math.sin(t * 3) * 8], R = [X + 165, 1230 + Math.sin(t * 3 + 1) * 8];
  if (sp) {
    L = [X - 150 - 40 * a * Math.sin(t * 14), 1230 - 250 * a * (0.5 + 0.5 * Math.sin(t * 11 + 1))];
    R = [X + 150 + 40 * a * Math.sin(t * 13 + 2), 1230 - 250 * a * (0.5 + 0.5 * Math.sin(t * 12))];
  }
  if (t >= C.E2.start && t < C.E2.start + 1.3) R = [X + 340, 940 + Math.sin(t * 20) * 10];
  const pet = t >= C.E6.start && t < C.E6.end;
  const cradle = t >= TL.bulbDies && t < C.E11.start;
  if (pet) { L = [X - 170, 1180]; R = [X - 110, 1110 + Math.sin(t * 12) * 24]; }
  if (cradle) { L = [X - 78 + Math.sin(t * 25) * 4, 1320]; R = [X + 78 + Math.sin(t * 27) * 4, 1320]; }
  if (t >= C.E11.start + 0.9) { L = [X - 175 + Math.sin(t * 30) * 10, 900]; R = [X + 175 + Math.sin(t * 28) * 10, 900]; }
  const fL = [X - 78, 1676 - l1], fR = [X + 78, 1676 - l2];
  const arm = (sx, h) => { const ex = (sx + h[0]) / 2 + (sx < X ? -26 : 26), ey = (1010 + h[1]) / 2 + 60;
    return `<path d="M${sx} 1010 Q${ex} ${ey} ${h[0]} ${h[1]}" fill="none" stroke="#2b2b36" stroke-width="36" stroke-linecap="round"/><circle cx="${h[0]}" cy="${h[1]}" r="27" fill="#ffc79c" stroke="#111" stroke-width="6"/>`; };
  let s = `<g filter="url(#sticker)"><g transform="translate(0 ${f2(by)})">`;
  // legs (stick-thin trousers) and shoes
  s += `<path d="M${X - 40} 1330 L${fL[0]} ${fL[1] - 14}" stroke="#2b2b36" stroke-width="34" stroke-linecap="round"/><path d="M${X + 40} 1330 L${fR[0]} ${fR[1] - 14}" stroke="#2b2b36" stroke-width="34" stroke-linecap="round"/>
        <ellipse cx="${fL[0] - 14}" cy="${fL[1] + 6}" rx="54" ry="22" fill="#111"/><ellipse cx="${fR[0] + 14}" cy="${fR[1] + 6}" rx="54" ry="22" fill="#111"/>`;
  // suit torso
  s += `<path d="M${X - 112} 975 L${X + 112} 975 L${X + 86} 1340 L${X - 86} 1340z" fill="#2b2b36" stroke="#111" stroke-width="9" stroke-linejoin="round"/>
        <path d="M${X - 44} 975 L${X} 1110 L${X + 44} 975z" fill="#f6f6f6" stroke="#111" stroke-width="6"/>
        <path d="M${X - 18} 1010 h36 l10 120 l-28 34 l-28 -34z" fill="#c1121f" stroke="#111" stroke-width="5"/>
        <path d="M${X - 30} 1200 h4 M${X - 30} 1250 h4" stroke="#999" stroke-width="10" stroke-linecap="round"/>`;
  s += arm(X - 105, L) + arm(X + 105, R);
  if (pet) s += `<ellipse cx="${X - 185}" cy="1130" rx="30" ry="38" fill="#fff2a8" stroke="#111" stroke-width="5"/><rect x="${X - 199}" y="1163" width="28" height="22" fill="#999" stroke="#111" stroke-width="4"/>`;
  if (cradle) s += `<ellipse cx="${X}" cy="1262" rx="42" ry="52" fill="#7a8a90" stroke="#111" stroke-width="6"/><rect x="${X - 14}" y="1308" width="28" height="26" fill="#999" stroke="#111" stroke-width="5"/>`;
  s += `</g></g>`;
  return s;
}

// ---- master render -------------------------------------------------------------------
window.renderFrame = function (frame) {
  const t = frame / FPS; cur = t;
  const svg = document.getElementById('stage');
  const dead = t >= TL.bulbDies;
  const freeze = t >= TL.freezeAt;
  const endcard = t >= TL.freezeAt + 0.55;
  const jit = Math.floor(t * 8);              // paper cut-out "boil" at 8 fps
  const jx = Math.sin(jit * 12.9898) * 3, jy = Math.cos(jit * 78.233) * 3, jr = Math.sin(jit * 3.1) * 0.7;

  const E1 = C.E1;
  const swell = seg(t, E1.start - 0.35, E1.start + 0.25);
  const over = swell > 0.99 ? 1 : 1 + Math.sin(swell * Math.PI) * 0.06;
  const hs = lerp(0.38, 0.85, swell) * over;
  const st = { cy: 930 - 380 * hs + 60, scale: hs, rot: Math.sin(t * 3) * 1.2 + jr, lookX: 0, lookY: 0, sad: false };
  const P = scoutPose(t);
  st.lookX = clamp((P.x - 540) / 540, -1, 1) * 40; st.lookY = 30;
  if (t >= C.E3.start && t < C.E3.start + 0.6) st.lookY = 10;
  if (t >= C.E2.start && t < C.E2.start + 1.2) { st.lookX = -55; st.lookY = -35; }
  if (t >= C.S6.start && t < C.E7.end) st.sad = true;
  if (freeze) { st.scale = 1.45; st.cy = 780; st.rot = 0; }
  const hsc = st.scale;

  const ba = boltAge(t);
  const shake = ba < 0.22 ? Math.sin(ba * 200) * 9 * (1 - ba / 0.22) : 0;

  let s = `<defs>${STICKER}<pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="13" cy="13" r="5" fill="#000"/></pattern>
    <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffc79c"/><stop offset="1" stop-color="#eaa174"/></linearGradient>
    <linearGradient id="red" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f0443a"/><stop offset="1" stop-color="#b3201c"/></linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffd27a" stop-opacity="0.9"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient></defs>`;
  s += `<g transform="translate(${f2(shake)} 0)">`;
  s += panel(t);
  s += shelfFlat(t, endcard);
  s += deskFlat();
  const stoolOn = t >= C.S4.start - 0.4 && t < C.S6.start - 0.2;
  if (stoolOn) s += `<g><rect x="215" y="1770" width="170" height="28" fill="#c58b4a" stroke="#111" stroke-width="6"/><rect x="235" y="1798" width="16" height="84" fill="#a56d33" stroke="#111" stroke-width="5"/><rect x="349" y="1798" width="16" height="84" fill="#a56d33" stroke="#111" stroke-width="5"/></g>`;

  // infographic card (bottom-right, beside Scout)
  const cd = cardAt(t);
  if (cd && !freeze) {
    const k = ease(clamp((t - cd.a) / 0.3)) * (1 - ease(clamp((t - (cd.b - 0.2)) / 0.2)));
    s += paperCard(880 + jx, 1110 + jy, 400, 410, 3 + Math.sin(jit) * 1.5, ICON[cd.k](t), k);
  }

  // Edison: stickman in a suit with a big head (sticker cut-outs)
  s += edisonBody(t, st, freeze);
  s += `<g filter="url(#sticker)" transform="translate(${f2(jx)} ${f2(jy)})">${edison(t, st)}</g>`;

  // flying clipboard in E3
  if (t >= C.E3.start && t < C.E3.start + 1.1) {
    const k = (t - C.E3.start) / 1.1;
    s += `<g filter="url(#sticker)" transform="translate(${lerp(760, -140, k)} ${lerp(900, 1280, k) - Math.sin(k * Math.PI) * 160}) rotate(${k * 900})"><rect x="-60" y="-80" width="120" height="160" fill="#c9a36a" stroke="#000" stroke-width="6"/><rect x="-46" y="-60" width="92" height="120" fill="#fff"/><rect x="-24" y="-92" width="48" height="24" fill="#888"/></g>`;
  }
  // Scout (sticker cut-out)
  if (!freeze) s += `<g filter="url(#sticker)" transform="translate(${f2(jx * 0.6)} ${f2(jy * 0.6)})">${scout(t, P)}</g>`;

  // insult stamp
  for (let i = 0; i < STAMPS.length; i++) {
    const a = t - STAMPS[i].t;
    if (a >= 0 && a < 0.7 && !freeze) {
      const k = Math.min(1, a / 0.1), fade = a > 0.5 ? 1 - (a - 0.5) / 0.2 : 1;
      const sc = 1.6 - 0.6 * ease(k);
      const col = STAMP_COL[i % STAMP_COL.length];
      const fs = Math.min(150, Math.floor(980 / (STAMPS[i].word.length * 0.7)));
      const rot = (i % 2 ? 7 : -7);
      s += `<g transform="translate(${540 + ((i * 97) % 160) - 80} ${1010 + (i % 3) * 40}) rotate(${rot}) scale(${f2(sc)})" opacity="${f2(fade)}">
        <text text-anchor="middle" y="0" font-size="${fs}" fill="${col}" stroke="#fffdf5" stroke-width="22" paint-order="stroke" stroke-linejoin="round">${STAMPS[i].word}</text>
        <text text-anchor="middle" y="0" font-size="${fs}" fill="${col}">${STAMPS[i].word}</text></g>`;
    }
  }

  // darkness vignette after the bulb dies + flat lightning
  if (dead && !endcard) s += `<rect width="1080" height="1920" fill="#000" opacity="0.18"/>`;
  if (ba < 0.2 && !freeze) {
    const seed = Math.floor(t * 10), op = (1 - ba / 0.2);
    const bp = boltPath(seed).replace(/^M/, 'M');
    s += `<path d="${bp}" fill="none" stroke="#fff" stroke-width="${22 * op + 6}" stroke-linejoin="round" opacity="${f2(op)}"/>
          <path d="${bp}" fill="none" stroke="#ffd23f" stroke-width="${10 * op + 3}" stroke-linejoin="round" opacity="${f2(op)}"/>
          <rect width="1080" height="1920" fill="#fff" opacity="${f2(op * 0.3)}"/>`;
  }

  // end card
  if (endcard) {
    const k = seg(t, TL.freezeAt + 0.55, TL.freezeAt + 0.85);
    s += `<rect width="1080" height="1920" fill="#ffd23f" opacity="${f2(k)}"/><rect width="1080" height="1920" fill="url(#dots)" opacity="${f2(0.12 * k)}"/>`;
    s += `<g opacity="${f2(k)}">${duck(540, 1000, 3.6, true)}</g>`;
    s += `<g opacity="${f2(k)}" transform="rotate(-3 540 1500)"><text x="540" y="1380" text-anchor="middle" font-size="112" fill="#111">TESLA NEXT?</text>
          <rect x="190" y="1430" width="700" height="140" rx="20" fill="#e63946" stroke="#111" stroke-width="8"/>
          <text x="540" y="1530" text-anchor="middle" font-size="96" fill="#fff">YES OR NO?</text></g>`;
  }

  // caption: highlighter bar
  const cap = !freeze ? captionFor(t) : null;
  if (cap) {
    const sc = 1 + (1 - cap.pop) * 0.14;
    const fs = Math.min(100, Math.floor(920 / (cap.text.length * 0.66)));
    const wbar = Math.min(1040, cap.text.length * fs * 0.64 + 60);
    const bar = cap.spk === 'E' ? '#ffe14a' : '#ffffff';
    s += `<g transform="translate(540 255) scale(${f2(sc)}) rotate(${cap.spk === 'E' ? -1.5 : 1.2})">
      <rect x="${-wbar / 2 + 8}" y="${-fs * 0.95 + 10}" width="${wbar}" height="${fs * 1.25}" rx="10" fill="#000" opacity="0.3"/>
      <rect x="${-wbar / 2}" y="${-fs * 0.95}" width="${wbar}" height="${fs * 1.25}" rx="10" fill="${bar}" stroke="#111" stroke-width="6"/>
      <text x="0" y="0" text-anchor="middle" font-size="${fs}" fill="#111">${cap.text.replace(/&/g, '&amp;')}</text></g>`;
  }
  s += `</g>`;

  // watermark + AI note
  s += `<rect x="30" y="52" width="420" height="58" rx="8" fill="#111"/><text x="46" y="94" font-size="34" fill="#fff" letter-spacing="6">SURVIVAL UNTOLD</text>`;
  if (t < 4.0) s += `<text x="46" y="1896" font-size="26" fill="#111" opacity="0.85" style="font-weight:800">AI-generated · jokes are invented, facts are real</text>`;

  svg.innerHTML = s;
};
renderFrame(0);
