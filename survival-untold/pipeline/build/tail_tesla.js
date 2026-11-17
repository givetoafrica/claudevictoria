// ================= TESLA SHORT: VOX-STYLE LAYER =====================================
const PAL = {
  S1: '#3a86ff', T1: '#3a86ff', S2: '#ffd23f', T2: '#ffd23f', S3: '#2ec4b6', T3: '#2ec4b6', S4: '#ff6b6b', T4: '#ff6b6b',
  S5: '#f9a03f', T5: '#f9a03f', S6: '#9b5de5', T6: '#9b5de5', S7: '#8ac926', T7: '#8ac926', S8: '#ff70a6', T8: '#ff70a6',
  S9: '#4cc9f0', T9: '#4cc9f0', S10: '#e63946', T10: '#e63946', S11: '#e63946', S12: '#c1121f', T12: '#c1121f', S13: '#05060d', T13: '#05060d'
};
const ORDER = TL.clips.map(c => c.id);
const dark = t => t >= TL.lightsOut && t < TL.freezeAt;
function panelAt(t) {
  let idx = 0;
  for (let i = 0; i < TL.clips.length; i++) if (t >= TL.clips[i].start - 0.05) idx = i;
  const cur = PAL[TL.clips[idx].id];
  const prev = idx > 0 ? PAL[TL.clips[idx - 1].id] : cur;
  const t0 = TL.clips[idx].start - 0.05;
  return { cur, prev, k: ease(clamp((t - t0) / 0.3)) };
}
function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const m = v => Math.max(0, Math.min(255, Math.round(v * f)));
  return `rgb(${m(r)},${m(g)},${m(b)})`;
}
function panel(t) {
  const p = panelAt(t);
  const dk = dark(t);
  let s = `<rect width="1080" height="1920" fill="${p.prev}"/>`;
  s += `<circle cx="540" cy="760" r="${f2(p.k * 1800)}" fill="${p.cur}"/>`;
  let rays = '';
  for (let i = 0; i < 18; i++) {
    const a0 = (i * 20 + t * 4) * Math.PI / 180, a1 = a0 + 0.17;
    rays += `<path d="M540 760 L${(540 + 2000 * Math.cos(a0)).toFixed(0)} ${(760 + 2000 * Math.sin(a0)).toFixed(0)} L${(540 + 2000 * Math.cos(a1)).toFixed(0)} ${(760 + 2000 * Math.sin(a1)).toFixed(0)}z" fill="#fff"/>`;
  }
  s += `<g opacity="${dk ? 0.03 : 0.16}">${rays}</g>`;
  s += `<rect x="0" y="1180" width="1080" height="740" fill="url(#dots)" opacity="0.25"/>`;
  s += lab(t);
  return s;
}

function lab(t) {
  const off = t >= TL.lightsOut;
  const wood = '#c58b4a', woodD = '#a56d33';
  let s = '';
  // Tesla coil (left)
  const cx = 150, flick = Math.floor(t * 14);
  s += `<rect x="${cx - 80}" y="930" width="160" height="60" rx="8" fill="#555c68" stroke="#111" stroke-width="7"/>
        <rect x="${cx - 36}" y="640" width="72" height="290" rx="10" fill="#b9732f" stroke="#111" stroke-width="7"/>`;
  for (let k = 0; k < 11; k++) s += `<path d="M${cx - 36} ${665 + k * 24} h72" stroke="#7a4513" stroke-width="5"/>`;
  s += `<ellipse cx="${cx}" cy="612" rx="96" ry="34" fill="#c9ced6" stroke="#111" stroke-width="7"/><ellipse cx="${cx}" cy="604" rx="64" ry="18" fill="#eef1f6" opacity="0.7"/>`;
  if (!off) {
    for (let a = 0; a < 3; a++) {
      const ang = ((flick * 53 + a * 120) % 360) * Math.PI / 180, L = 150 + ((flick * 31 + a * 17) % 80);
      let d = `M${cx} 590`, x = cx, y = 590;
      for (let i = 1; i <= 5; i++) { x = cx + Math.cos(ang) * L * i / 5 + (((flick * 7 + i * 13 + a) % 30) - 15); y = 590 - Math.abs(Math.sin(ang)) * L * i / 5 + (((flick * 11 + i * 19) % 24) - 12); d += ` L${x.toFixed(0)} ${y.toFixed(0)}`; }
      s += `<path d="${d}" fill="none" stroke="#fff" stroke-width="9" stroke-linejoin="round" opacity="0.9"/><path d="${d}" fill="none" stroke="#9be7ff" stroke-width="4" opacity="0.9"/>`;
    }
  }
  // workbench with flasks (right, under the duck shelf side)
  s += `<rect x="760" y="960" width="320" height="20" fill="${wood}" stroke="#111" stroke-width="6"/><rect x="780" y="980" width="22" height="130" fill="${woodD}" stroke="#111" stroke-width="5"/><rect x="1040" y="980" width="22" height="130" fill="${woodD}" stroke="#111" stroke-width="5"/>`;
  [['#e63946', 800], ['#2ec4b6', 870], ['#ffd23f', 940], ['#9b5de5', 1010]].forEach(([c, x], i) => {
    s += `<path d="M${x - 14} 900 h28 v26 l22 34 h-72 l22 -34z" fill="${c}" opacity="0.85" stroke="#111" stroke-width="5"/>`;
  });
  // framed pigeon portrait
  s += `<g transform="translate(905 440) rotate(3)"><rect x="-96" y="-76" width="192" height="152" fill="#fff6d6" stroke="#111" stroke-width="7"/><ellipse cx="-4" cy="14" rx="46" ry="30" fill="#9aa5b1" stroke="#111" stroke-width="4"/><circle cx="34" cy="-14" r="20" fill="#9aa5b1" stroke="#111" stroke-width="4"/><path d="M52 -14 l20 6 l-20 6z" fill="#ff8a1f" stroke="#111" stroke-width="3"/><circle cx="40" cy="-18" r="4" fill="#111"/><text x="0" y="-84" text-anchor="middle" font-size="22" fill="#111">PIGEON</text></g>`;
  // hanging bulb
  s += `<line x1="470" y1="0" x2="470" y2="300" stroke="#111" stroke-width="6"/><rect x="452" y="296" width="36" height="34" fill="#888" stroke="#111" stroke-width="5"/>
        <ellipse cx="470" cy="364" rx="38" ry="46" fill="${off ? '#7a8a90' : '#fff2a8'}" stroke="#111" stroke-width="6"/>`;
  if (!off) s += `<circle cx="470" cy="364" r="${130 + Math.sin(t * 40) * 4}" fill="#fff2a8" opacity="0.28"/>`;
  // desk + floor
  s += `<path d="M0 1700 L1080 1700 L1080 1920 L0 1920z" fill="#b97a3c" stroke="#111" stroke-width="7"/>`;
  for (let k = 0; k < 6; k++) s += `<path d="M0 ${1740 + k * 38} L1080 ${1740 + k * 38}" stroke="#8a5a2b" stroke-width="3"/>`;
  s += `<ellipse cx="560" cy="1700" rx="360" ry="34" fill="#000" opacity="0.2"/>`;
  s += `<rect x="0" y="1560" width="470" height="34" fill="${wood}" stroke="#111" stroke-width="7"/><rect x="26" y="1594" width="30" height="108" fill="${woodD}" stroke="#111" stroke-width="6"/><rect x="414" y="1594" width="30" height="108" fill="${woodD}" stroke="#111" stroke-width="6"/>
        <rect x="150" y="1496" width="210" height="64" fill="#fff6d6" stroke="#111" stroke-width="6"/><path d="M168 1518 h174 M168 1536 h130" stroke="#111" stroke-width="4"/>`;
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
const BOLT = (sc, fill) => `<path d="M30 -150 L-50 10 H0 L-30 150 L70 -30 H10z" transform="scale(${sc})" fill="${fill || '#ffd23f'}" stroke="#111" stroke-width="7" stroke-linejoin="round"/>`;

const ICON = {
  title: t => `${lbl('INTERVIEWING', -60, 44)}${lbl('HISTORY’S', 0, 44)}${lbl('BIGGEST EGOS', 66, 46, '#d62828')}<path d="M-150 120 h300" stroke="#111" stroke-width="6"/>${lbl('EP. 2: THE CURRENT WAR', 165, 24)}`,
  toothbrush: t => `<g transform="rotate(-30)"><rect x="-110" y="-10" width="170" height="22" rx="10" fill="#4cc9f0" stroke="#111" stroke-width="6"/><rect x="50" y="-26" width="64" height="52" rx="8" fill="#fff" stroke="#111" stroke-width="6"/>${[0, 1, 2, 3].map(i => `<path d="M${62 + i * 14} -26 v-24" stroke="#e63946" stroke-width="7"/>`).join('')}</g><g transform="translate(-60 -90)"><ellipse rx="70" ry="38" fill="#9aa5b1" stroke="#111" stroke-width="6"/>${BOLT(0.5)}</g>${lbl('CHARGING: THUNDERSTORM', 160, 28)}`,
  acdc: t => { let a = 'M-130 -20'; for (let i = 0; i <= 40; i++) { const x = -130 + i * 6.5; a += ` L${x.toFixed(0)} ${(-20 + Math.sin(i / 3 + t * 5) * 46).toFixed(0)}`; } return `<path d="${a}" fill="none" stroke="#e63946" stroke-width="9" stroke-linecap="round"/>${lbl('AC', -90, 34, '#e63946')}<path d="M-130 90 H130" stroke="#2457a6" stroke-width="9" stroke-linecap="round"/>${lbl('DC', 150, 34, '#2457a6')}`; },
  sock: t => `<path d="M-30 -110 h70 v80 q70 30 60 80 q-10 40 -80 30 q-60 -10 -70 -60z" fill="#fff" stroke="#111" stroke-width="7"/><path d="M-30 -110 h70 v26 h-70z" fill="#e63946" stroke="#111" stroke-width="5"/>${[0, 1, 2].map(i => `<path d="M${-10 + i * 40} ${70 + (i % 2) * 16} q8 18 0 26 q-8 -8 0 -26z" fill="#4cc9f0" stroke="#111" stroke-width="3"/>`).join('')}<g transform="translate(90 -90)">${BOLT(0.5)}</g>${lbl('WET SOCK vs BOLT', 165, 30)}`,
  invoice: t => `<rect x="-100" y="-130" width="200" height="250" fill="#fff" stroke="#111" stroke-width="6"/>${lbl('INVOICE', -90, 34)}<path d="M-70 -60 h140 M-70 -28 h140 M-70 4 h140 M-70 36 h100" stroke="#999" stroke-width="5"/>${lbl('$$$', 100, 44, '#2b9348')}${lbl('HE INVOICED THE FUTURE', 165, 24)}`,
  tickets: t => `<g transform="rotate(-8) translate(-20 -40)"><rect x="-120" y="-50" width="240" height="100" rx="12" fill="#ffd23f" stroke="#111" stroke-width="6"/><circle cx="-120" cy="0" r="14" fill="#fbf4e1"/><circle cx="120" cy="0" r="14" fill="#fbf4e1"/>${lbl('ADMIT ONE', 12, 40)}</g><g transform="rotate(6) translate(30 60)"><rect x="-120" y="-50" width="240" height="100" rx="12" fill="#ff6b6b" stroke="#111" stroke-width="6"/>${lbl('ELECTRIC CIRCUS', 12, 30)}</g>`,
  coins: t => `${[0, 1, 2, 3].map(i => `<ellipse cx="${-40 + (i % 2) * 40}" cy="${60 - i * 30}" rx="70" ry="22" fill="#ffd23f" stroke="#111" stroke-width="6" opacity="${1 - i * 0.18}"/>`).join('')}${lbl('MONEY: TEMPORARY', 150, 30)}`,
  eternal: t => `<path d="M-80 0 C-80 -70 0 -70 0 0 C0 70 80 70 80 0 C80 -70 0 -70 0 0 C0 70 -80 70 -80 0z" fill="none" stroke="#9b5de5" stroke-width="16" transform="scale(1.3)"/>${lbl('GENIUS: ETERNAL', 150, 32)}`,
  bills: t => `${[0, 1, 2].map(i => `<g transform="rotate(${-8 + i * 8}) translate(${i * 10} ${-i * 6})"><rect x="-90" y="-100" width="180" height="210" fill="#fff" stroke="#111" stroke-width="6"/><path d="M-60 -50 h120 M-60 -16 h120 M-60 18 h90" stroke="#999" stroke-width="5"/></g>`).join('')}<g transform="rotate(-14) translate(10 20)"><rect x="-96" y="-30" width="192" height="60" fill="none" stroke="#e63946" stroke-width="8"/>${lbl('UNPAID', 16, 44, '#e63946')}</g>${lbl('LAB BILLS', 160, 34)}`,
  pigeon: t => `<ellipse cx="0" cy="20" rx="90" ry="62" fill="#9aa5b1" stroke="#111" stroke-width="7"/><circle cx="70" cy="-44" r="40" fill="#9aa5b1" stroke="#111" stroke-width="7"/><path d="M108 -44 l44 12 l-44 12z" fill="#ff8a1f" stroke="#111" stroke-width="5"/><circle cx="82" cy="-54" r="8" fill="#111"/><path d="M-70 0 q-50 -10 -60 40 q50 20 80 -10z" fill="#7d8896" stroke="#111" stroke-width="5"/><path d="M40 -4 q20 20 0 28" fill="none" stroke="#2ec4b6" stroke-width="10"/><g transform="translate(-70 -80)"><path d="M0 0 c-30 -40 -60 10 0 50 c60 -40 30 -90 0 -50z" fill="#e63946" stroke="#111" stroke-width="5"/></g>${lbl('TESLA’S FAVORITE', 160, 30)}`,
  thunder: t => `${BOLT(1.0)}${lbl('THUNDER · CURRENT', 190, 30)}`,
  overdue: t => `<rect x="-100" y="-120" width="200" height="240" fill="#fff" stroke="#111" stroke-width="6"/>${lbl('ELECTRIC', -80, 30)}${lbl('BILL', -46, 30)}<path d="M-70 -10 h140 M-70 24 h140" stroke="#999" stroke-width="5"/><g transform="rotate(-16) translate(0 40)"><rect x="-110" y="-34" width="220" height="68" fill="none" stroke="#e63946" stroke-width="9"/>${lbl('OVERDUE', 18, 46, '#e63946')}</g>`,
  phone: t => `<rect x="-60" y="-140" width="120" height="230" rx="20" fill="#111" stroke="#111" stroke-width="6"/><rect x="-50" y="-120" width="100" height="190" rx="10" fill="#bdeeff"/>${lbl('CALLING', -50, 22)}${lbl('EDISON', -18, 28, '#d62828')}<circle cx="0" cy="30" r="20" fill="#2b9348"/>${lbl('SHOULD I?', 150, 34)}`,
  spite: t => `<rect x="-80" y="-70" width="160" height="150" rx="14" fill="#c9ced6" stroke="#111" stroke-width="7"/><rect x="-26" y="-92" width="52" height="24" rx="6" fill="#555" stroke="#111" stroke-width="5"/>${lbl('SPITE', 24, 48)}<path d="M-100 -90 L100 100 M100 -90 L-100 100" stroke="#e63946" stroke-width="14" stroke-linecap="round"/>${lbl('NOT RENEWABLE', 160, 30)}`
};
function wt(id, word) {
  const c = C[id]; const words = c.text.split(' '), w = words.map(x => x.length + 2), tot = w.reduce((a, b) => a + b, 0);
  let acc = 0; for (let i = 0; i < words.length; i++) { if (words[i] === word) return c.start + c.dur * acc / tot; acc += w[i]; }
  return c.start;
}
const CARDS = [
  ['title', C.S1.start, C.S1.end + 0.3],
  ['toothbrush', C.S2.start, C.S3.start - 0.1],
  ['acdc', C.S3.start, C.S4.start - 0.1],
  ['sock', C.S4.start, C.T4.end],
  ['invoice', C.S5.start, C.S6.start],
  ['tickets', C.S6.start, C.S7.start],
  ['coins', C.S7.start, wt('T7', 'GENIUS')], ['eternal', wt('T7', 'GENIUS'), C.S8.start],
  ['bills', C.S8.start, C.S9.start],
  ['pigeon', C.S9.start, C.T9.end],
  ['thunder', C.S10.start, C.S11.start],
  ['overdue', C.S11.start, C.S12.start],
  ['phone', C.S12.start, C.T12.end],
  ['spite', C.S13.start, C.T13.start]
];
function cardAt(t) { for (const [k, a, b] of CARDS) if (t >= a && t < b) return { k, a, b }; return null; }

const MARK = {
  T1: ['CANDLE?!', 'LICENSE?!', 'POTATO', 'LABORATORY!'], T2: ['THUNDERSTORM!'], T3: ['TRANSMISSION!', 'CUSTOMERS!'], T4: ['SOCK!', 'INCONVENIENT?!'],
  T5: ['MORON!', 'INVOICE'], T6: ['TICKETS!'], T7: ['CIRCUIT', 'ETERNAL!'], T8: ['DISAPPOINTMENT!'], T9: ['EDISON!'], T10: ['THUNDER!', 'CURRENT!'],
  T12: ['CATASTROPHIC,', 'VOLTAGE-STARVED,', 'MORON!', 'SPITE!'], T13: ['GET!', 'OUT!', 'OF!', 'MY!', 'LAB!']
};
const STAMPS = [];
for (const id in MARK) for (const m of MARK[id]) STAMPS.push({ t: wt(id, m), word: m.replace(/[^A-Za-z-]/g, '').toUpperCase() });
STAMPS.sort((a, b) => a.t - b.t);
const STAMP_COL = ['#e63946', '#1d3557', '#6a040f', '#2b9348'];

const STICKER = `<filter id="sticker" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">
  <feMorphology in="SourceAlpha" operator="dilate" radius="9" result="d"/>
  <feFlood flood-color="#fffdf5"/><feComposite in2="d" operator="in" result="w"/>
  <feMorphology in="SourceAlpha" operator="dilate" radius="14" result="d2"/>
  <feFlood flood-color="#111"/><feComposite in2="d2" operator="in" result="k"/>
  <feOffset in="k" dx="10" dy="16" result="sh"/>
  <feGaussianBlur in="sh" stdDeviation="6" result="shb"/>
  <feColorMatrix in="shb" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0"/>
  <feMerge><feMergeNode/><feMergeNode in="k"/><feMergeNode in="w"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;

// ---- Tesla (gaunt, slicked hair, pencil moustache) --------------------------------------
function tesla(t, st) {
  const o = openness('E', t), shout = clamp(o * 1.5), sp = speaking('E');
  const shake = sp ? (Math.sin(t * 80) * 5 * shout) : 0;
  const sc = st.scale * (1 + 0.03 * o);
  const lx = st.lookX, ly = st.lookY;
  const browA = 8 + shout * 24 + (st.sad ? -18 : 0);
  const mh = 10 + o * 205, mw = 120 + o * 95;
  let s = `<g transform="translate(${540 + shake} ${st.cy + (sp ? Math.sin(t * 61) * 3 * shout : 0)}) scale(${f2(sc)}) rotate(${f2(st.rot)})">`;
  s += `<ellipse cx="-285" cy="20" rx="42" ry="72" fill="#e3ad84" stroke="#000" stroke-width="14"/><ellipse cx="285" cy="20" rx="42" ry="72" fill="#e3ad84" stroke="#000" stroke-width="14"/>`;
  s += `<ellipse cx="0" cy="0" rx="285" ry="395" fill="url(#skin)" stroke="#000" stroke-width="18"/>`;
  // slicked hair + electrified strands when shouting
  s += `<path d="M-290 -100 Q-310 -330 -120 -392 Q0 -430 130 -392 Q310 -330 292 -100 Q250 -250 120 -285 Q0 -310 -120 -272 Q-250 -240 -290 -100z" fill="#17171c" stroke="#000" stroke-width="12" stroke-linejoin="round"/>
        <path d="M-210 -300 Q-60 -350 80 -330" fill="none" stroke="#4a4a58" stroke-width="10" stroke-linecap="round"/>`;
  const up = 30 + shout * 90;
  s += `<path d="M-90 -385 L-110 ${-385 - up} L-60 -392 M0 -410 L-8 ${-410 - up * 1.2} L36 -408 M110 -385 L135 ${-385 - up} L84 -392" fill="#17171c" stroke="#000" stroke-width="9" stroke-linejoin="round"/>`;
  // cheekbone shadows
  s += `<path d="M-250 40 Q-170 90 -110 150" fill="none" stroke="#b9805c" stroke-width="26" stroke-linecap="round" opacity="0.5"/><path d="M250 40 Q170 90 110 150" fill="none" stroke="#b9805c" stroke-width="26" stroke-linecap="round" opacity="0.5"/>`;
  // eyes with bags
  for (const sx of [-108, 108]) {
    s += `<path d="M${sx - 70} 18 Q${sx} 62 ${sx + 70} 18" fill="none" stroke="#8a5f8c" stroke-width="18" stroke-linecap="round" opacity="0.55"/>`;
    s += `<ellipse cx="${sx}" cy="-80" rx="84" ry="100" fill="#fff" stroke="#000" stroke-width="14"/>`;
    if (shout > 0.55) s += `<path d="M${sx - 66} -80 q26 10 44 -18 M${sx + 66} -80 q-26 10 -44 -18" fill="none" stroke="#e44" stroke-width="3" opacity="0.75"/>`;
    s += `<circle cx="${sx + lx * 0.9}" cy="${-72 + ly * 0.9}" r="${st.pin ? 14 : 34}" fill="#1c1c1c"/><circle cx="${sx + lx * 0.9 - 11}" cy="${-88 + ly * 0.9}" r="${st.pin ? 5 : 12}" fill="#fff"/>`;
  }
  s += `<path d="M-205 ${-200 + browA} Q-105 ${-236} -20 ${-172 - browA * 0.3}" fill="none" stroke="#111" stroke-width="26" stroke-linecap="round"/>
        <path d="M205 ${-200 + browA} Q105 ${-236} 20 ${-172 - browA * 0.3}" fill="none" stroke="#111" stroke-width="26" stroke-linecap="round"/>`;
  // long narrow nose
  s += `<path d="M-14 -40 Q-30 60 -52 96 Q0 122 52 96 Q30 60 14 -40" fill="#e0a07a" stroke="#000" stroke-width="11" stroke-linejoin="round"/>`;
  // mouth
  s += `<g transform="translate(0 ${170 + o * 18})"><ellipse cx="0" cy="${mh / 2}" rx="${mw}" ry="${mh / 2 + 8}" fill="#4a0a10" stroke="#000" stroke-width="12"/>
        <rect x="${-mw * 0.62}" y="0" width="${mw * 1.24}" height="${Math.min(34, mh * 0.35)}" rx="8" fill="#fff" opacity="${o > 0.12 ? 1 : 0}"/>
        <ellipse cx="0" cy="${mh * 0.82}" rx="${mw * 0.55}" ry="${Math.max(6, mh * 0.2)}" fill="#e0606c" opacity="${o > 0.25 ? 1 : 0}"/></g>`;
  // pencil moustache with curled tips
  s += `<path d="M-170 150 Q-90 118 -8 142 M8 142 Q90 118 170 150" fill="none" stroke="#111" stroke-width="16" stroke-linecap="round"/><path d="M-170 150 q-26 6 -22 -30 M170 150 q26 6 22 -30" fill="none" stroke="#111" stroke-width="12" stroke-linecap="round"/>`;
  s += `</g>`;
  return s;
}

function pigeonSprite(x, y, sc, flap) {
  return `<g transform="translate(${x} ${y}) scale(${sc})"><ellipse cx="0" cy="0" rx="34" ry="24" fill="#9aa5b1" stroke="#111" stroke-width="4"/><circle cx="26" cy="-20" r="15" fill="#9aa5b1" stroke="#111" stroke-width="4"/><path d="M38 -20 l16 5 l-16 5z" fill="#ff8a1f" stroke="#111" stroke-width="3"/><circle cx="31" cy="-24" r="3.4" fill="#111"/><path d="M14 -8 q10 12 0 18" fill="none" stroke="#2ec4b6" stroke-width="6"/><path d="M-20 -6 q-${22 + flap} -${8 + flap} -${26 + flap} 14 q22 4 36 -6z" fill="#7d8896" stroke="#111" stroke-width="3"/></g>`;
}

function teslaBody(t, st, freeze) {
  if (freeze) return '';
  const o = openness('E', t), a = clamp(o * 1.3), sp = speaking('E');
  const X = 540, by = sp ? Math.sin(t * 28) * 4 * a : 0;
  const l1 = sp ? Math.max(0, Math.sin(t * 10)) * 26 * a : 0, l2 = sp ? Math.max(0, Math.sin(t * 10 + 3)) * 26 * a : 0;
  let L = [X - 165, 1230 + Math.sin(t * 3) * 8], R = [X + 165, 1230 + Math.sin(t * 3 + 1) * 8];
  if (sp) {
    L = [X - 150 - 40 * a * Math.sin(t * 14), 1230 - 250 * a * (0.5 + 0.5 * Math.sin(t * 11 + 1))];
    R = [X + 150 + 40 * a * Math.sin(t * 13 + 2), 1230 - 250 * a * (0.5 + 0.5 * Math.sin(t * 12))];
  }
  const inC = (id) => t >= C[id].start && t < C[id].end;
  if (inC('T3')) { L = [X - 330, 1010 + Math.sin(t * 7) * 80]; R = [X + 330, 1010 + Math.sin(t * 7 + Math.PI) * 80]; }
  const sockT = wt('T4', 'SOCK!');
  if (t >= sockT - 0.1 && t < sockT + 0.5) R = [X + 270, 880 - (t - sockT) * 80];
  if (inC('T5')) { L = [X - 60, 1190 + Math.sin(t * 16) * 14]; R = [X + 90, 1160 + Math.sin(t * 18) * 20]; }
  if (inC('T6') && t > wt('T6', 'TICKETS!') - 0.3) { L = [X - 330, 900]; R = [X + 330, 900]; }
  const pig = t >= C.S9.start && t < C.T9.end;
  if (pig && t < wt('T9', 'DON\'T') - 0.2) { R = [X + 210, 700 + Math.sin(t * 6) * 14]; L = [X - 165, 1230]; }
  if (inC('T10')) { L = [X - 340, 860 + Math.sin(t * 9) * 10]; R = [X + 340, 860 + Math.sin(t * 9 + 1) * 10]; }
  const limp = t >= C.S11.start && t < C.T12.start;
  if (limp) { L = [X - 120, 1330]; R = [X + 120, 1330]; }
  if (inC('T12')) { L = [X - 175 + Math.sin(t * 30) * 10, 900]; R = [X + 175 + Math.sin(t * 28) * 10, 900]; }
  if (t >= TL.lightsOut && t < C.T13.start) { L = [X - 140, 1260]; R = [X + 140, 1260]; }
  if (inC('T13')) { L = [X - 175 + Math.sin(t * 30) * 8, 1000]; R = [X + 400, 980 + Math.sin(t * 22) * 30]; }   // points at the door
  const fL = [X - 70, 1676 - l1], fR = [X + 70, 1676 - l2];
  const arm = (sx, h) => { const ex = (sx + h[0]) / 2 + (sx < X ? -26 : 26), ey = (1010 + h[1]) / 2 + 60;
    return `<path d="M${sx} 1010 Q${ex} ${ey} ${h[0]} ${h[1]}" fill="none" stroke="#1f2b4d" stroke-width="34" stroke-linecap="round"/><circle cx="${h[0]}" cy="${h[1]}" r="26" fill="#f1c9a5" stroke="#111" stroke-width="6"/>`; };
  let s = `<g filter="url(#sticker)"><g transform="translate(0 ${f2(by)})">`;
  s += `<path d="M${X - 36} 1330 L${fL[0]} ${fL[1] - 14}" stroke="#1f2b4d" stroke-width="30" stroke-linecap="round"/><path d="M${X + 36} 1330 L${fR[0]} ${fR[1] - 14}" stroke="#1f2b4d" stroke-width="30" stroke-linecap="round"/>
        <ellipse cx="${fL[0] - 14}" cy="${fL[1] + 6}" rx="52" ry="21" fill="#111"/><ellipse cx="${fR[0] + 14}" cy="${fR[1] + 6}" rx="52" ry="21" fill="#111"/>`;
  s += `<path d="M${X - 100} 975 L${X + 100} 975 L${X + 76} 1340 L${X - 76} 1340z" fill="#1f2b4d" stroke="#111" stroke-width="9" stroke-linejoin="round"/>
        <path d="M${X - 40} 975 L${X} 1100 L${X + 40} 975z" fill="#f6f6f6" stroke="#111" stroke-width="6"/>
        <path d="M${X - 46} 1030 L${X} 1052 L${X - 46} 1076z M${X + 46} 1030 L${X} 1052 L${X + 46} 1076z" fill="#111" stroke="#111" stroke-width="4"/><circle cx="${X}" cy="1052" r="10" fill="#111"/>
        <path d="M${X - 30} 1200 h4 M${X - 30} 1250 h4" stroke="#999" stroke-width="10" stroke-linecap="round"/>`;
  s += arm(X - 96, L) + arm(X + 96, R);
  s += `</g></g>`;
  return s;
}

// ---- Scout pose for the Tesla beats -------------------------------------------------------
function scoutPoseT(t) {
  const P = { x: 300, y: 1872, lean: 0, phase: 0, walk: false, tilt: 0, headDy: 0, eyeX: 6, eyeY: 2, lid: 14, brow: 0,
              fh: [-95, -230], mh: [150, -380], micRot: 70, juice: false, file: false, note: false, dangle: false, phone: false };
  P.y += Math.sin(t * 5.5) * 4; P.lean += Math.sin(t * 2.2) * 1.5;
  P.fh = [-95 + Math.sin(t * 4) * 6, -230 + Math.sin(t * 3) * 6];
  P.mh = [150 + Math.sin(t * 3.5) * 5, -380 + Math.sin(t * 2.6) * 6];
  const walkEnd = C.S1.end + 0.1;
  if (t < walkEnd) { const k = clamp(t / walkEnd); P.x = lerp(-300, 300, ease(k)); P.walk = true; P.phase = t * 11; P.lean = 4; }
  const t1 = C.T1;
  if (t >= t1.start && t < C.S2.start) {
    const k = seg(t, t1.start + t1.dur * 0.3, t1.start + t1.dur * 0.6);
    P.lean += -16 * k; P.x -= 50 * k;
    const w = seg(t, t1.start + t1.dur * 0.65, t1.start + t1.dur * 0.78) * (1 - seg(t, t1.start + t1.dur * 0.92, t1.end));
    P.fh = [lerp(P.fh[0], 18, w), lerp(P.fh[1], -440, w)];
  }
  // T2 shrug
  if (t >= C.S2.end && t < C.S3.start) { const k = seg(t, C.S2.end, C.S2.end + 0.25) * (1 - seg(t, C.T2.end - 0.4, C.T2.end)); P.fh = [lerp(P.fh[0], -110, k), lerp(P.fh[1], -330, k)]; P.headDy -= 14 * k; }
  // S3/T3 nod
  if (t >= C.S3.start && t < C.S4.start) { P.headDy += Math.sin((t - C.S3.start) * 7) * 5; }
  // T4: dodge the flying wet sock
  const sockT = wt('T4', 'SOCK!');
  if (t >= sockT && t < sockT + 1.1) { const k = Math.sin(clamp((t - sockT) / 1.0) * Math.PI); P.y += 70 * k; P.lean += 14 * k; P.eyeY = 4; P.tilt = 6 * k; }
  // S5..T6: sits on the desk flipping through the invoice file
  const sit = seg(t, C.S5.start - 0.5, C.S5.start) * (1 - seg(t, C.S7.start - 0.4, C.S7.start));
  if (sit > 0) { P.x = lerp(P.x, 250, sit); P.y -= 300 * sit; P.dangle = sit > 0.6; P.file = sit > 0.6; P.fh = [lerp(P.fh[0], -120, sit), lerp(P.fh[1], -300, sit)]; P.tilt += 8 * sit; P.eyeY = 12; }
  // T7 note on hand
  if (t >= C.S7.end && t < C.S9.start) { const nw = seg(t, C.S7.end, C.T7.start + 0.4); P.fh = [lerp(P.fh[0], 60, nw), lerp(P.fh[1], -260, nw)]; P.note = nw > 0.5; P.headDy += Math.sin((t - C.S7.start) * 8) * 4; }
  // S9: spots the pigeon and points
  if (t >= C.S9.start && t < C.S10.start) { const k = seg(t, C.S9.start + 0.3, C.S9.end) * (1 - seg(t, C.T9.end - 0.3, C.T9.end)); P.fh = [lerp(P.fh[0], 120, k), lerp(P.fh[1], -690, k)]; P.tilt += -9 * k; P.eyeY = -10 * k; P.eyeX = 10 * k; }
  // S10/T10: deadpan, eyebrow
  if (t >= C.S10.start && t < C.S11.start) { P.brow = 8; }
  // S11/silence: holds up the electric bill
  if (t >= C.S11.start && t < C.S12.start) { const k = seg(t, C.S11.start, C.S11.start + 0.25); P.fh = [lerp(P.fh[0], 120, k), lerp(P.fh[1], -600, k)]; P.file = k > 0.4; P.brow = 14; P.lid = 6; }
  // S12 + T12: phone to ear
  if (t >= C.S12.start && t < C.T13.start) { const k = seg(t, C.S12.start, C.S12.start + 0.3); P.fh = [lerp(P.fh[0], 62, k), lerp(P.fh[1], -475, k)]; P.phone = k > 0.3; P.tilt = lerp(0, 8, k); P.brow = 10; }
  if (t >= C.S13.start && t < C.T13.start) { P.brow = 12; P.lid = 6; }
  // T13: walks off, still holding the phone
  if (t >= C.T13.start + 0.3) { const k = clamp((t - C.T13.start - 0.3) / 1.8); P.walk = true; P.phase = t * 11; P.x = lerp(P.x, -360, k * k); P.lean = 4; }
  const a = boltAge(t);
  if (a < 0.25) { P.x += Math.sin(a * 120) * 10 * (1 - a / 0.25); P.y -= 12 * (1 - a / 0.25); }
  return P;
}

function captionForT(t) { return captionFor(t); }

window.renderFrame = function (frame) {
  const t = frame / FPS; cur = t;
  const svg = document.getElementById('stage');
  const dk = dark(t);
  const freeze = t >= TL.freezeAt;
  const endcard = t >= TL.freezeAt + 0.55;
  const jit = Math.floor(t * 8);
  const jx = Math.sin(jit * 12.9898) * 3, jy = Math.cos(jit * 78.233) * 3, jr = Math.sin(jit * 3.1) * 0.7;

  const T1 = C.T1;
  const swell = seg(t, T1.start - 0.35, T1.start + 0.25);
  const over = swell > 0.99 ? 1 : 1 + Math.sin(swell * Math.PI) * 0.06;
  const hs = lerp(0.38, 0.85, swell) * over;
  const st = { cy: 930 - 395 * hs + 60, scale: hs, rot: Math.sin(t * 3) * 1.2 + jr, lookX: 0, lookY: 0, sad: false, pin: false };
  const P = scoutPoseT(t);
  st.lookX = clamp((P.x - 540) / 540, -1, 1) * 40; st.lookY = 30;
  const sockT = wt('T4', 'SOCK!');
  if (t >= sockT && t < sockT + 0.6) st.lookY = 10;
  const limp = t >= C.S11.start && t < C.S12.start;
  if (limp && t > C.S11.end) { st.sad = true; st.cy += 26; st.rot = -4; st.pin = true; }
  if (t >= C.S6.start && t < C.T6.end) st.sad = true;
  if (freeze) { st.scale = 1.4; st.cy = 780; st.rot = 0; st.pin = false; st.sad = false; }

  const ba = boltAge(t);
  const shake = ba < 0.22 ? Math.sin(ba * 200) * 9 * (1 - ba / 0.22) : 0;

  let s = `<defs>${STICKER}<pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="13" cy="13" r="5" fill="#000"/></pattern>
    <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6d4b4"/><stop offset="1" stop-color="#e5ae86"/></linearGradient>
    <linearGradient id="red" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f0443a"/><stop offset="1" stop-color="#b3201c"/></linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffd27a" stop-opacity="0.9"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient></defs>`;
  s += `<g transform="translate(${f2(shake)} 0)">`;
  s += panel(t);
  s += `<rect x="905" y="668" width="175" height="20" fill="#c58b4a" stroke="#111" stroke-width="6"/>${duck(985, 650, 0.95, endcard)}`;
  const cd = cardAt(t);
  if (cd && !freeze) {
    const k = ease(clamp((t - cd.a) / 0.3)) * (1 - ease(clamp((t - (cd.b - 0.2)) / 0.2)));
    s += paperCard(880 + jx, 1110 + jy, 400, 410, 3 + Math.sin(jit) * 1.5, ICON[cd.k](t), k);
  }
  s += teslaBody(t, st, freeze);
  s += `<g filter="url(#sticker)" transform="translate(${f2(jx)} ${f2(jy)})">${tesla(t, st)}</g>`;

  // pigeon perched on Tesla's head, flies off after T9
  const pTop = st.cy - 395 * st.scale - 22;
  if (t >= C.S9.start && t < C.T9.end && !freeze) s += pigeonSprite(540 + 70, pTop + 6, 1.5, Math.sin(t * 9) * 3);
  if (t >= C.T9.end && t < C.T9.end + 1.0) { const k = t - C.T9.end; s += pigeonSprite(540 + 70 + k * 700, pTop + 6 - k * 520, 1.5, Math.sin(t * 40) * 14); }
  // flying wet sock
  if (t >= sockT && t < sockT + 1.1) {
    const k = (t - sockT) / 1.1;
    s += `<g filter="url(#sticker)" transform="translate(${lerp(810, -140, k)} ${lerp(880, 1330, k) - Math.sin(k * Math.PI) * 170}) rotate(${k * 720})"><path d="M-22 -60 h46 v52 q50 20 42 56 q-8 28 -58 20 q-40 -8 -46 -44z" fill="#fff" stroke="#000" stroke-width="6"/><path d="M-22 -60 h46 v18 h-46z" fill="#e63946" stroke="#000" stroke-width="4"/>${[0, 1, 2].map(i => `<circle cx="${-30 - i * 12}" cy="${-20 + i * 14}" r="5" fill="#4cc9f0"/>`).join('')}</g>`;
  }
  if (!freeze) s += `<g filter="url(#sticker)" transform="translate(${f2(jx * 0.6)} ${f2(jy * 0.6)})">${scout(t, P)}</g>`;

  // silence bubble: Tesla: "..."
  if (limp && t > C.S11.end) {
    s += `<g transform="translate(840 540)"><ellipse rx="110" ry="64" fill="#fff" stroke="#111" stroke-width="7"/><path d="M-50 56 l-30 56 l76 -40z" fill="#fff" stroke="#111" stroke-width="7"/><path d="M-48 52 l-4 0" stroke="#fff" stroke-width="10"/>
      <circle cx="-44" cy="0" r="12" fill="#111"/><circle cx="0" cy="0" r="12" fill="#111"/><circle cx="44" cy="0" r="12" fill="#111"/></g>`;
    const sweat = (t - C.S11.end) * 140 % 70;
    s += `<path d="M${540 + 250} ${600 + sweat} q-14 24 0 36 q14 -12 0 -36z" fill="#4cc9f0" stroke="#111" stroke-width="4"/>`;
  }

  // insult stamps
  for (let i = 0; i < STAMPS.length; i++) {
    const a = t - STAMPS[i].t;
    if (a >= 0 && a < 0.6 && !freeze) {
      const k = Math.min(1, a / 0.1), fade = a > 0.42 ? 1 - (a - 0.42) / 0.18 : 1;
      const sc = 1.6 - 0.6 * ease(k), col = STAMP_COL[i % STAMP_COL.length];
      const fs = Math.min(150, Math.floor(980 / (STAMPS[i].word.length * 0.7)));
      s += `<g transform="translate(${540 + ((i * 97) % 160) - 80} ${1010 + (i % 3) * 40}) rotate(${i % 2 ? 7 : -7}) scale(${f2(sc)})" opacity="${f2(fade)}">
        <text text-anchor="middle" y="0" font-size="${fs}" fill="${col}" stroke="#fffdf5" stroke-width="22" paint-order="stroke" stroke-linejoin="round">${STAMPS[i].word}</text>
        <text text-anchor="middle" y="0" font-size="${fs}" fill="${col}">${STAMPS[i].word}</text></g>`;
    }
  }

  // darkness after the lights go out: spotlight from Scout's phone, flashes reveal the lab
  if (dk) {
    const px = P.x + P.fh[0] * 1.22, py = P.y + P.fh[1] * 1.22 - 40;
    const flash = ba < 0.28 ? (1 - ba / 0.28) : 0;
    s += `<defs><radialGradient id="darkHole" gradientUnits="userSpaceOnUse" cx="${f2(px)}" cy="${f2(py)}" r="520"><stop offset="0" stop-color="#02030a" stop-opacity="0.25"/><stop offset="0.5" stop-color="#02030a" stop-opacity="0.9"/><stop offset="1" stop-color="#02030a" stop-opacity="0.97"/></radialGradient></defs>
      <rect width="1080" height="1920" fill="url(#darkHole)" opacity="${f2(1 - flash * 0.93)}"/>`;
    if (P.phone) s += `<circle cx="${f2(px)}" cy="${f2(py)}" r="90" fill="#bdeeff" opacity="0.28"/>`;
  }
  if (ba < 0.2 && !freeze) {
    const seed = Math.floor(t * 10), op = (1 - ba / 0.2), bp = boltPath(seed);
    s += `<path d="${bp}" fill="none" stroke="#fff" stroke-width="${22 * op + 6}" stroke-linejoin="round" opacity="${f2(op)}"/>
          <path d="${bp}" fill="none" stroke="#ffd23f" stroke-width="${10 * op + 3}" stroke-linejoin="round" opacity="${f2(op)}"/>
          <rect width="1080" height="1920" fill="#fff" opacity="${f2(op * 0.3)}"/>`;
  }
  // freeze-frame flash on Tesla's face
  if (freeze && !endcard) s += `<rect width="1080" height="1920" fill="#fff" opacity="${f2(Math.max(0, 0.5 - (t - TL.freezeAt) * 1.2))}"/>`;

  if (endcard) {
    const k = seg(t, TL.freezeAt + 0.55, TL.freezeAt + 0.85);
    s += `<rect width="1080" height="1920" fill="#ffd23f" opacity="${f2(k)}"/><rect width="1080" height="1920" fill="url(#dots)" opacity="${f2(0.12 * k)}"/>`;
    s += `<g opacity="${f2(k)}">${duck(540, 760, 3.2, true)}</g>`;
    s += `<g opacity="${f2(k)}" transform="rotate(-2 540 1300)"><text x="540" y="1100" text-anchor="middle" font-size="76" fill="#111">WHO WON THE</text>
          <text x="540" y="1190" text-anchor="middle" font-size="76" fill="#111">ELECTRICITY WAR?</text>
          <rect x="120" y="1250" width="840" height="140" rx="20" fill="#e63946" stroke="#111" stroke-width="8"/>
          <text x="540" y="1350" text-anchor="middle" font-size="86" fill="#fff">TESLA OR EDISON?</text>
          <text x="540" y="1480" text-anchor="middle" font-size="64" fill="#111">COMMENT BELOW!</text></g>`;
    s += `<text x="540" y="1780" text-anchor="middle" font-size="26" fill="#111" opacity="${f2(k * 0.8)}" style="font-weight:800">AI-generated fictional comedy inspired by real historical figures.</text>`;
  }

  const cap = !freeze ? captionForT(t) : null;
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

  s += `<rect x="30" y="52" width="420" height="58" rx="8" fill="#111"/><text x="46" y="94" font-size="34" fill="#fff" letter-spacing="6">SURVIVAL UNTOLD</text>`;
  if (t < 4.0) s += `<text x="46" y="1896" font-size="26" fill="#111" opacity="0.85" style="font-weight:800">AI-generated fictional comedy inspired by real historical figures.</text>`;

  svg.innerHTML = s;
};
renderFrame(0);
