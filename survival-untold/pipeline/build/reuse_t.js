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

function pigeonSprite(x, y, sc, flap, flip) {
  return `<g transform="translate(${x} ${y}) scale(${flip ? -sc : sc} ${sc})"><ellipse cx="0" cy="0" rx="34" ry="24" fill="#9aa5b1" stroke="#111" stroke-width="4"/><circle cx="26" cy="-20" r="15" fill="#9aa5b1" stroke="#111" stroke-width="4"/><path d="M38 -20 l16 5 l-16 5z" fill="#ff8a1f" stroke="#111" stroke-width="3"/><circle cx="31" cy="-24" r="3.4" fill="#111"/><path d="M14 -8 q10 12 0 18" fill="none" stroke="#2ec4b6" stroke-width="6"/><path d="M-20 -6 q-${22 + flap} -${8 + flap} -${26 + flap} 14 q22 4 36 -6z" fill="#7d8896" stroke="#111" stroke-width="3"/></g>`;
}

function teslaBody(t, st, freeze, ov) {
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
  let fL = [X - 70, 1676 - l1], fR = [X + 70, 1676 - l2];
  if (ov) { if (ov.L) L = ov.L; if (ov.R) R = ov.R; if (ov.fL) fL = ov.fL; if (ov.fR) fR = ov.fR; }
  const arm = (sx, h) => { const ex = (sx + h[0]) / 2 + (sx < X ? -26 : 26), ey = (1010 + h[1]) / 2 + 60;
    return `<path d="M${sx} 1010 Q${ex} ${ey} ${h[0]} ${h[1]}" fill="none" stroke="#1f2b4d" stroke-width="34" stroke-linecap="round"/><circle cx="${h[0]}" cy="${h[1]}" r="26" fill="#f1c9a5" stroke="#111" stroke-width="6"/>`; };
  let s = `<g filter="url(#${STK})"><g transform="translate(0 ${f2(by)})">`;
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

