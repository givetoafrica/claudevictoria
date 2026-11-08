// ================= TESLA SHORT v2: FIVE SETTINGS =====================================
let STK = 'stT0';
const ACTS = [
  { id: 'stairs', a: 0, b: C.S3.start }, { id: 'car', a: C.S3.start, b: C.S5.start }, { id: 'wheel', a: C.S5.start, b: C.S7.start },
  { id: 'park', a: C.S7.start, b: C.S10.start }, { id: 'tower', a: C.S10.start, b: 1e9 }
];
const KT = [0.58, 0.40, 0.32, 0.62, 0.66], KS = [0.78, 0.80, 0.48, 0.80, 0.85];
const CARD_POS = [[900, 1560], [880, 640], [900, 560], [880, 640], [880, 640]];
function actAt(t) { let i = 0; ACTS.forEach((a, k) => { if (t >= a.a) i = k; }); return i; }
const dark = t => t >= TL.lightsOut && t < TL.freezeAt;
function stk(id, k) {
  const r1 = (9 / k).toFixed(1), r2 = (14 / k).toFixed(1), dx = (10 / k).toFixed(1), dy = (16 / k).toFixed(1), sd = (6 / k).toFixed(1);
  return `<filter id="${id}" x="-15%" y="-15%" width="130%" height="130%" color-interpolation-filters="sRGB">
  <feMorphology in="SourceAlpha" operator="dilate" radius="${r1}" result="d"/><feFlood flood-color="#fffdf5"/><feComposite in2="d" operator="in" result="w"/>
  <feMorphology in="SourceAlpha" operator="dilate" radius="${r2}" result="d2"/><feFlood flood-color="#111"/><feComposite in2="d2" operator="in" result="k"/>
  <feOffset in="k" dx="${dx}" dy="${dy}" result="sh"/><feGaussianBlur in="sh" stdDeviation="${sd}" result="shb"/>
  <feColorMatrix in="shb" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0"/>
  <feMerge><feMergeNode/><feMergeNode in="k"/><feMergeNode in="w"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
}
function placeG(px, py, k, inner, extra) { return `<g transform="translate(${f2(px)} ${f2(py)}) scale(${f2(k)}) ${extra || ''} translate(-540 -1676)">${inner}</g>`; }
function figT(t, st, ov, px, py, k, lean, act, head) {
  STK = 'stT' + act;
  return placeG(px, py, k, teslaBody(t, st, false, ov) + `<g filter="url(#${STK})">${tesla(t, st)}</g>`, `rotate(${f2(lean || 0)})`);
}
function figS(t, P, k, act) {
  return `<g filter="url(#stS${act})" transform="translate(${f2(P.x)} ${f2(P.y)}) scale(${f2(k)}) translate(${f2(-P.x)} ${f2(-P.y)})">${scout(t, P)}</g>`;
}
function rays(cx, cy, col, op, t, n) {
  let r = ''; n = n || 18;
  for (let i = 0; i < n; i++) { const a0 = (i * 360 / n + t * 4) * Math.PI / 180, a1 = a0 + Math.PI / n * 0.9;
    r += `<path d="M${cx} ${cy} L${(cx + 2400 * Math.cos(a0)).toFixed(0)} ${(cy + 2400 * Math.sin(a0)).toFixed(0)} L${(cx + 2400 * Math.cos(a1)).toFixed(0)} ${(cy + 2400 * Math.sin(a1)).toFixed(0)}z" fill="${col}"/>`; }
  return `<g opacity="${op}">${r}</g>`;
}
function cloud(x, y, sc, col) { return `<g transform="translate(${f2(x)} ${f2(y)}) scale(${sc})"><ellipse cx="0" cy="30" rx="120" ry="36" fill="${col || '#fff'}" stroke="#111" stroke-width="6"/><circle cx="-50" cy="0" r="46" fill="${col || '#fff'}" stroke="#111" stroke-width="6"/><circle cx="14" cy="-20" r="58" fill="${col || '#fff'}" stroke="#111" stroke-width="6"/><circle cx="68" cy="6" r="40" fill="${col || '#fff'}" stroke="#111" stroke-width="6"/><ellipse cx="0" cy="30" rx="118" ry="34" fill="${col || '#fff'}"/></g>`; }
function mod(a, n) { return ((a % n) + n) % n; }
function rnd(i) { return mod(Math.sin(i * 127.1 + 311.7) * 43758.5453, 1); }
function stars(t, n) { let s = ''; for (let i = 0; i < n; i++) { const tw = 0.5 + 0.5 * Math.sin(t * 3 + i); s += `<circle cx="${(rnd(i) * 1080).toFixed(0)}" cy="${(rnd(i + 99) * 1100).toFixed(0)}" r="${(2 + rnd(i + 7) * 3).toFixed(1)}" fill="#fff" opacity="${(0.3 + 0.7 * tw).toFixed(2)}"/>`; } return s; }

// ================= SETTING 1: THE GRAND STAIRCASE ===================================
const SW = 150, SH = 96;
const Lst = x => 1180 - (x - 700) * (SH / SW);
function gait(p, f, k) {   // foot offset (screen px) for a stair climb; returns local-space [dx, dy]
  const ph = mod(p + 0.5 * f, 1);
  let rx, ry;
  if (ph < 0.5) { const s = ph / 0.5; rx = SW * 0.8 * (0.5 - s); ry = SH * 0.8 * (-0.5 + s); }
  else { const s = (ph - 0.5) / 0.5; rx = SW * 0.8 * (-0.5 + s); ry = SH * 0.8 * (0.5 - s) - Math.sin(Math.PI * s) * 70; }
  return [rx / k, ry / k];
}
function sceneStairs(t) {
  const u = t - ACTS[0].a, p = u * 0.95, off = mod(p, 1);
  let s = `<rect width="1080" height="1920" fill="#5a189a"/>${rays(540, 760, '#fff', 0.08, t, 16)}<rect width="1080" height="1500" fill="url(#dots)" opacity="0.14"/>`;
  // wall portraits sliding with parallax
  for (let m = -1; m < 4; m++) {
    const x = m * 420 + 150 - mod(p * SW * 0.55, 420), y = 560 - (x - 540) * 0.26;
    s += `<g transform="translate(${f2(x)} ${f2(y)}) rotate(-9)"><rect x="-92" y="-118" width="184" height="236" rx="8" fill="#ffd166" stroke="#111" stroke-width="7"/><rect x="-72" y="-98" width="144" height="196" fill="#f1faee" stroke="#111" stroke-width="4"/><circle cx="0" cy="-26" r="34" fill="${['#e5989b', '#b5838d', '#6d6875'][mod(m, 3)]}" stroke="#111" stroke-width="4"/><path d="M-50 90 q0 -70 50 -70 q50 0 50 70z" fill="#6d6875" stroke="#111" stroke-width="4"/></g>`;
  }
  // chandelier
  const sw = Math.sin(t * 1.6) * 5;
  s += `<g transform="translate(860 0) rotate(${f2(sw)})"><line x1="0" y1="0" x2="0" y2="220" stroke="#111" stroke-width="7"/><path d="M-110 250 Q0 190 110 250 L80 296 H-80z" fill="#ffd166" stroke="#111" stroke-width="7"/>${[-80, -26, 26, 80].map(x => `<ellipse cx="${x}" cy="228" rx="14" ry="22" fill="#fff2a8" stroke="#111" stroke-width="4"/>`).join('')}${[-60, -20, 20, 60].map(x => `<path d="M${x} 296 l-8 40 l16 0z" fill="#bde0fe" stroke="#111" stroke-width="3"/>`).join('')}<circle cx="0" cy="250" r="190" fill="url(#glow)" opacity="0.35"/></g>`;
  // staircase silhouette
  const xi = i => -190 + i * SW - off * SW, Ti = i => Lst(xi(i) + SW / 2);
  let pts = '';
  for (let i = -3; i <= 11; i++) pts += ` L${xi(i).toFixed(1)} ${Ti(i).toFixed(1)} L${(xi(i) + SW).toFixed(1)} ${Ti(i).toFixed(1)}`;
  s += `<path d="M${xi(-3).toFixed(1)} 1930${pts} L${(xi(11) + SW).toFixed(1)} 1930z" fill="#3d2b1f" stroke="#111" stroke-width="8" stroke-linejoin="round"/>`;
  for (let i = -3; i <= 11; i++) s += `<rect x="${xi(i).toFixed(1)}" y="${(Ti(i) - 12).toFixed(1)}" width="${SW}" height="22" fill="#d00000" stroke="#111" stroke-width="5"/><path d="M${xi(i).toFixed(1)} ${(Ti(i) + 40).toFixed(1)} h${SW}" stroke="#5a3b27" stroke-width="5"/>`;
  // handrail + balusters
  s += `<path d="M-100 ${Lst(-100) - 320} L1200 ${Lst(1200) - 320}" stroke="#111" stroke-width="26" stroke-linecap="round"/><path d="M-100 ${Lst(-100) - 320} L1200 ${Lst(1200) - 320}" stroke="#ffd166" stroke-width="14" stroke-linecap="round"/>`;
  for (let i = -3; i <= 11; i++) { const x = xi(i) + SW / 2; s += `<line x1="${x.toFixed(1)}" y1="${(Ti(i) - 8).toFixed(1)}" x2="${x.toFixed(1)}" y2="${(Lst(x) - 314).toFixed(1)}" stroke="#111" stroke-width="12"/><line x1="${x.toFixed(1)}" y1="${(Ti(i) - 8).toFixed(1)}" x2="${x.toFixed(1)}" y2="${(Lst(x) - 314).toFixed(1)}" stroke="#ffd166" stroke-width="5"/>`; }
  // hidden duck rides the handrail
  const dxx = 1010 - u * SW * 0.95; if (dxx > -80) s += duck(dxx, Lst(dxx) - 360, 0.9, false);
  s += pigeonSprite(600, Lst(600) - 342, 1.35, Math.sin(t * 0.7) * 0.6, false);
  s += edisonPortrait(t);
  return s;
}
function charsStairs(t) {
  const u = t - ACTS[0].a, p = u * 0.95, e = speaking('E');
  const sw = seg(t, C.T1.start - 0.35, C.T1.start + 0.25), over = sw > 0.99 ? 1 : 1 + Math.sin(sw * Math.PI) * 0.06;
  const hs = lerp(0.38, 0.8, sw) * over, st = { cy: 930 - 395 * hs + 60, scale: hs, rot: Math.sin(t * 3) * 1.2, lookX: -30, lookY: 20, sad: false, pin: false };
  const k = KT[0], gl = gait(p, 0, k), gr = gait(p, 1, k);
  const ov = { fL: [540 - 70 + gl[0], 1676 + gl[1]], fR: [540 + 70 + gr[0], 1676 + gr[1]] };
  let s = figT(t, st, ov, 740, Lst(740), k, 7, 0);
  // Scout climbs behind, then stops mid-step when his head swells
  const P = baseP(); const wk = clamp(u / (C.S1.end - 0.3));
  P.x = lerp(-250, 250, ease(wk)); P.y = Lst(P.x) + 6; P.walk = true; P.phase = p * Math.PI; P.lean = 8; P.mh = [170, -330]; P.micRot = 75;
  P.y -= Math.abs(Math.sin(p * Math.PI)) * 16;
  if (t > C.T1.start && t < C.T1.start + 0.7) P.lean = -10 + 18 * seg(t, C.T1.start + 0.3, C.T1.start + 0.7);
  const a = boltAge(t); if (a < 0.25) { P.y -= 14 * (1 - a / 0.25); }
  s += figS(t, P, KS[0], 0);
  return s;
}

// ================= SETTING 2: THE CAR CHASE PAST POWER LINES =========================
function sceneCar(t) {
  const u = t - ACTS[1].a, spd = 520, dur = ACTS[1].b - ACTS[1].a;
  let s = `<rect width="1080" height="1920" fill="#ffb703"/>${rays(850, 420, '#fff', 0.16, t, 20)}<circle cx="850" cy="420" r="130" fill="#fff3b0" stroke="#111" stroke-width="8"/>`;
  for (let i = 0; i < 4; i++) s += cloud(mod(i * 430 - u * 36, 1700) - 200, 330 + (i % 3) * 120, 1 + (i % 2) * 0.3);
  // hills (parallax)
  let h1 = 'M-60 1500', h2 = 'M-60 1500';
  for (let x = -60; x <= 1200; x += 40) { h1 += ` L${x} ${(1240 + Math.sin((x + u * 70) / 190) * 90).toFixed(0)}`; h2 += ` L${x} ${(1330 + Math.sin((x + u * 170) / 120 + 2) * 60).toFixed(0)}`; }
  s += `<path d="${h1} L1200 1500z" fill="#52b788" stroke="#111" stroke-width="7"/><path d="${h2} L1200 1500z" fill="#2d6a4f" stroke="#111" stroke-width="7"/>`;
  // AC power pylons + wires with travelling pulses
  const o = mod(u * spd, 480);
  const px = m => -240 - o + m * 480;
  for (let m = 0; m < 5; m++) {
    const x = px(m);
    s += `<path d="M${x - 60} 1480 L${x - 14} 900 L${x + 14} 900 L${x + 60} 1480z" fill="none" stroke="#111" stroke-width="14" stroke-linejoin="round"/><path d="M${x - 60} 1480 L${x - 14} 900 L${x + 14} 900 L${x + 60} 1480z" fill="none" stroke="#adb5bd" stroke-width="7"/><path d="M${x - 44} 1300 L${x + 44} 1300 M${x - 30} 1120 L${x + 30} 1120 M${x - 44} 1300 L${x + 30} 1120 M${x + 44} 1300 L${x - 30} 1120" stroke="#6c757d" stroke-width="6"/>
          <rect x="${x - 150}" y="936" width="300" height="14" fill="#6c757d" stroke="#111" stroke-width="5"/><rect x="${x - 120}" y="1010" width="240" height="12" fill="#6c757d" stroke="#111" stroke-width="5"/>`;
    for (const dx of [-140, 0, 140]) s += `<rect x="${x + dx - 6}" y="950" width="12" height="34" fill="#f1faee" stroke="#111" stroke-width="4"/>`;
  }
  for (let m = 0; m < 4; m++) for (const dx of [-140, 0, 140]) {
    const x0 = px(m) + dx, x1 = px(m + 1) + dx, y0 = 984;
    s += `<path d="M${x0} ${y0} Q${(x0 + x1) / 2} ${y0 + 110} ${x1} ${y0}" fill="none" stroke="#111" stroke-width="5"/>`;
    const tp = mod(u * (C.T3.start < t && t < C.T4.start ? 1.6 : 0.7) + m * 0.31 + dx * 0.002, 1);
    const bx = (1 - tp) * (1 - tp) * x0 + 2 * (1 - tp) * tp * ((x0 + x1) / 2) + tp * tp * x1, by = (1 - tp) * (1 - tp) * y0 + 2 * (1 - tp) * tp * (y0 + 110) + tp * tp * y0;
    s += `<circle cx="${bx.toFixed(0)}" cy="${by.toFixed(0)}" r="10" fill="#fff" stroke="#00b4d8" stroke-width="5"/>`;
  }
  // roadside + road
  s += `<rect x="0" y="1480" width="1080" height="110" fill="#95d5b2" stroke="#111" stroke-width="6"/><rect x="0" y="1590" width="1080" height="190" fill="#495057" stroke="#111" stroke-width="7"/>`;
  for (let m = -1; m < 7; m++) s += `<rect x="${(mod(m * 230 - u * spd, 1610) - 260).toFixed(0)}" y="1676" width="130" height="14" rx="5" fill="#f1faee"/>`;
  s += `<rect x="0" y="1780" width="1080" height="150" fill="#40916c" stroke="#111" stroke-width="7"/>`;
  for (let m = 0; m < 9; m++) { const x = mod(m * 190 - u * spd * 1.3, 1500) - 200; s += `<path d="M${x} 1850 l-14 -50 l14 30 l14 -34 l14 54z" fill="#1b4332" stroke="#111" stroke-width="4"/>`; }
  // speed streaks
  for (let i = 0; i < 9; i++) { const L = 220 + rnd(i) * 220, x = 1200 - mod(u * (1500 + rnd(i + 3) * 700) + i * 331, 1800), y = 560 + rnd(i + 11) * 880; s += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${L.toFixed(0)}" height="8" rx="4" fill="#fff" opacity="0.5"/>`; }
  return s;
}
function charsCar(t) {
  const u = t - ACTS[1].a, dur = ACTS[1].b - ACTS[1].a, spd = 520;
  const leave = Math.max(0, u - (dur - 2.6));
  const carX = 640 + leave * leave * 150, bounce = Math.abs(Math.sin(u * 17)) * 7 + Math.sin(u * 5) * 4;
  const cy0 = 1650 - bounce;
  const hs = 0.6, o = openness('E', t), a = clamp(o * 1.3);
  const st = { cy: 930 - 395 * hs + 60, scale: hs, rot: Math.sin(t * 3) * 1.5, lookX: 25, lookY: 30, sad: false, pin: false };
  const k = KT[1], X = 540;
  const sockT = wt('T4', 'SOCK!');
  let R = [X + 170 + 30 * Math.sin(t * 13), 1230 - 320 * a * (0.5 + 0.5 * Math.sin(t * 11))];
  if (!speaking('E')) R = [X + 120, 1226];
  if (t >= sockT - 0.1 && t < sockT + 0.5) R = [X + 330, 800];
  const ov = { L: [X + 90, 1236], R, fL: [X - 30, 1676], fR: [X + 60, 1676] };
  let s = '';
  // rear wheel + exhaust smoke
  const wheel = (cx, cy) => `<g transform="translate(${cx} ${cy}) rotate(${f2(u * spd / 72 * 57.3)})"><circle r="74" fill="#111"/><circle r="52" fill="#e9c46a" stroke="#111" stroke-width="6"/>${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<line x1="0" y1="0" x2="${(52 * Math.cos(i * Math.PI / 4)).toFixed(1)}" y2="${(52 * Math.sin(i * Math.PI / 4)).toFixed(1)}" stroke="#111" stroke-width="5"/>`).join('')}<circle r="12" fill="#adb5bd" stroke="#111" stroke-width="4"/></g>`;
  for (let i = 0; i < 6; i++) { const ph = mod(u * 1.6 + i / 6, 1); s += `<circle cx="${(carX - 270 - ph * 260).toFixed(0)}" cy="${(cy0 - 110 - ph * 90).toFixed(0)}" r="${(24 + ph * 60).toFixed(0)}" fill="#e9ecef" stroke="#111" stroke-width="6" opacity="${(1 - ph).toFixed(2)}"/>`; }
  s += `<ellipse cx="${carX}" cy="1718" rx="300" ry="26" fill="#000" opacity="0.28"/>`;
  s += wheel(carX - 160, cy0 - 74 + 0);
  // Tesla seated in the car
  s += figT(t, st, ov, carX - 20, cy0 - 120, k, Math.sin(u * 5) * 2, 1);
  // car body in front of him
  s += `<g transform="translate(${f2(carX)} ${f2(cy0)})"><g filter="url(#stC1)">
    <path d="M-250 -80 L-250 -200 Q-250 -240 -210 -240 L60 -240 L100 -210 L320 -210 Q350 -210 350 -180 L350 -90 Q350 -70 330 -70 L-230 -70 Q-250 -70 -250 -80z" fill="#e63946" stroke="#111" stroke-width="9" stroke-linejoin="round"/>
    <rect x="-210" y="-196" width="260" height="30" rx="8" fill="#9d0208" opacity="0.55"/>
    <path d="M60 -240 L44 -342 L-4 -342 L12 -240z" fill="#bde0fe" stroke="#111" stroke-width="8" opacity="0.8"/>
    <rect x="-262" y="-96" width="620" height="26" rx="10" fill="#adb5bd" stroke="#111" stroke-width="7"/>
    <circle cx="352" cy="-176" r="30" fill="#fff2a8" stroke="#111" stroke-width="7"/><path d="M382 -176 L560 -240 L560 -112z" fill="#fff2a8" opacity="0.25"/>
    <path d="M-262 -130 L-300 -118 L-300 -100 L-262 -100z" fill="#6c757d" stroke="#111" stroke-width="6"/>
    <path d="M-260 -70 Q-160 -170 -60 -70" fill="none" stroke="#111" stroke-width="12"/><path d="M60 -70 Q160 -170 260 -70" fill="none" stroke="#111" stroke-width="12"/>
  </g>${duck(276, -236, 0.55, false)}</g>`;
  s += `<g transform="translate(${f2(carX)} ${f2(cy0)})"><ellipse cx="22" cy="-292" rx="46" ry="12" fill="none" stroke="#111" stroke-width="10"/></g>`;
  s += wheel(carX + 160, cy0 - 74);
  s += pigeonSprite(carX - 205, cy0 - 262, 1.45, Math.sin(u * 14) * 5, false);
  // Scout runs after the car trying to get the interview
  const P = baseP(); P.walk = true; P.phase = u * 16; P.lean = 13; P.micRot = 80; P.mh = [215, -300 + Math.sin(u * 16) * 8]; P.fh = [-150 - Math.sin(u * 16) * 40, -230 + Math.sin(u * 16 + 1) * 40];
  const catchUp = 0.5 + 0.5 * Math.sin(u * 0.8);
  P.x = lerp(210, 420, catchUp) - leave * 80; P.y = 1740 - Math.abs(Math.sin(u * 16)) * 20;
  if (u < 1.0) P.x = lerp(-200, P.x, ease(u / 1.0));
  if (t >= sockT && t < sockT + 1.1) { const q = Math.sin(clamp((t - sockT) / 1.0) * Math.PI); P.y += 60 * q; P.lean += 16 * q; }
  if (leave > 1.0) { P.walk = false; P.lean = 28; P.fh = [-60, -150]; P.mh = [70, -150]; P.micRot = 130; P.headDy = 18; }
  const ba = boltAge(t); if (ba < 0.25) P.y -= 12 * (1 - ba / 0.25);
  s += figS(t, P, KS[1], 1);
  // the wet sock
  if (t >= sockT && t < sockT + 1.1) { const q = (t - sockT) / 1.1;
    s += `<g filter="url(#stS1)" transform="translate(${lerp(carX + 160, P.x + 40, q)} ${lerp(cy0 - 300, 1560, q) - Math.sin(q * Math.PI) * 170}) rotate(${q * 720})"><path d="M-22 -60 h46 v52 q50 20 42 56 q-8 28 -58 20 q-40 -8 -46 -44z" fill="#fff" stroke="#000" stroke-width="6"/><path d="M-22 -60 h46 v18 h-46z" fill="#e63946" stroke="#000" stroke-width="4"/>${[0, 1, 2].map(i => `<circle cx="${-30 - i * 12}" cy="${-20 + i * 14}" r="5" fill="#4cc9f0"/>`).join('')}</g>`; }
  return s;
}

// ================= SETTING 3: THE 1893 WORLD'S FAIR FERRIS WHEEL ======================
function sceneWheel(t) {
  const u = t - ACTS[2].a, R = 650, phi = Math.PI / 2 + 0.2 * u, G = [540, 1270];
  const C0 = [G[0] - R * Math.cos(phi), G[1] - R * Math.sin(phi)], th = phi - Math.PI / 2;
  let s = `<defs><linearGradient id="nsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#10002b"/><stop offset="1" stop-color="#5a189a"/></linearGradient></defs><rect width="1080" height="1920" fill="url(#nsky)"/>${stars(t, 60)}`;
  s += `<circle cx="${(900 - C0[0] * 0.05).toFixed(0)}" cy="260" r="90" fill="#fff3b0" stroke="#111" stroke-width="7"/>`;
  // fair skyline (parallax) with banners
  for (let i = 0; i < 8; i++) { const x = mod(i * 260 - C0[0] * 0.25 - 100, 2100) - 300, h = 220 + rnd(i) * 260; s += `<path d="M${x} 1700 V${1700 - h} L${x + 70} ${1700 - h - 70} L${x + 140} ${1700 - h} V1700z" fill="#3c096c" stroke="#111" stroke-width="6"/>`; for (let w = 0; w < 4; w++) s += `<rect x="${x + 20 + (w % 2) * 56}" y="${1700 - h + 40 + Math.floor(w / 2) * 70}" width="36" height="44" fill="#ffd23f" opacity="${(0.55 + 0.45 * Math.sin(t * 3 + i + w)).toFixed(2)}"/>`; }
  // the wheel
  s += `<g transform="translate(${C0[0].toFixed(1)} ${C0[1].toFixed(1)})">`;
  s += `<circle r="${R}" fill="none" stroke="#111" stroke-width="30"/><circle r="${R}" fill="none" stroke="#d8dee9" stroke-width="16"/><circle r="${R - 60}" fill="none" stroke="#111" stroke-width="18"/><circle r="${R - 60}" fill="none" stroke="#adb5bd" stroke-width="8"/>`;
  for (let i = 0; i < 16; i++) { const a = th + i * Math.PI / 8; s += `<line x1="0" y1="0" x2="${(R * Math.cos(a)).toFixed(0)}" y2="${(R * Math.sin(a)).toFixed(0)}" stroke="#111" stroke-width="12"/><line x1="0" y1="0" x2="${(R * Math.cos(a)).toFixed(0)}" y2="${(R * Math.sin(a)).toFixed(0)}" stroke="#d8dee9" stroke-width="5"/>`; }
  s += `<circle r="70" fill="#e63946" stroke="#111" stroke-width="10"/>`;
  for (let j = 0; j < 56; j++) { const a = th + j * Math.PI * 2 / 56, on = (j + Math.floor(u * 9)) % 3 === 0; s += `<circle cx="${(R * Math.cos(a)).toFixed(0)}" cy="${(R * Math.sin(a)).toFixed(0)}" r="${on ? 13 : 8}" fill="${on ? '#fff3b0' : '#b08968'}" stroke="#111" stroke-width="3"/>`; }
  for (let c = 1; c < 12; c++) { const a = phi + c * Math.PI / 6, cx = R * Math.cos(a), cy = R * Math.sin(a);
    s += `<g transform="translate(${cx.toFixed(0)} ${cy.toFixed(0)})"><line x1="0" y1="0" x2="0" y2="70" stroke="#111" stroke-width="8"/><rect x="-80" y="70" width="160" height="124" rx="12" fill="${['#ff70a6', '#70d6ff', '#ffd670', '#e9ff70'][c % 4]}" stroke="#111" stroke-width="7"/><rect x="-62" y="90" width="124" height="52" fill="#fbf4e1" stroke="#111" stroke-width="4"/><circle cx="-28" cy="118" r="16" fill="#e5989b" stroke="#111" stroke-width="3"/><circle cx="26" cy="118" r="16" fill="#b5838d" stroke="#111" stroke-width="3"/></g>`; }
  s += `</g>`;
  // fireworks
  const FW = [wt('T5', 'MORON!'), wt('T6', 'TICKETS!'), wt('T5', 'INVOICE')];
  FW.forEach((tt, i) => { const ag = t - tt; if (ag >= 0 && ag < 1.1) { const cx = [180, 880, 760][i], cy = [520, 420, 640][i], r = 40 + ag * 240; let sp = ''; for (let q = 0; q < 14; q++) { const a = q * Math.PI / 7; sp += `<line x1="${(cx + Math.cos(a) * r * 0.55).toFixed(0)}" y1="${(cy + Math.sin(a) * r * 0.55).toFixed(0)}" x2="${(cx + Math.cos(a) * r).toFixed(0)}" y2="${(cy + Math.sin(a) * r).toFixed(0)}" stroke="${['#ffd23f', '#ff70a6', '#70d6ff'][q % 3]}" stroke-width="12" stroke-linecap="round" opacity="${(1 - ag / 1.1).toFixed(2)}"/>`; } s += sp; } });
  // fair-ticket confetti
  const tk = wt('T6', 'TICKETS!');
  if (t > tk - 0.3 && t < C.S7.start) for (let i = 0; i < 24; i++) { const ag = t - (tk - 0.3), x = 40 + rnd(i) * 1000 + Math.sin(ag * 3 + i) * 40, y = -80 + ag * (260 + rnd(i + 5) * 260) + (i % 4) * 30 - 40; s += `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${(ag * 300 + i * 40).toFixed(0)})"><rect x="-36" y="-18" width="72" height="36" rx="6" fill="#ffd23f" stroke="#111" stroke-width="4"/><text y="7" text-anchor="middle" font-size="16" fill="#111">ADMIT ONE</text></g>`; }
  // fair banner
  s += `<g transform="translate(540 1830) rotate(-2)"><rect x="-300" y="-46" width="600" height="82" rx="14" fill="#e63946" stroke="#111" stroke-width="8"/><text y="12" text-anchor="middle" font-size="44" fill="#fff">WORLD’S FAIR 1893 · LIT BY AC</text></g>`;
  return s;
}
function charsWheel(t) {
  const u = t - ACTS[2].a, G = [540, 1270], o = openness('E', t);
  const sway = Math.sin(u * 1.7) * 3 + (speaking('E') ? Math.sin(u * 40) * 2.5 * o : 0);
  let s = `<g transform="translate(${G[0]} ${G[1]}) rotate(${f2(sway)})">`;
  s += `<rect x="-14" y="-60" width="28" height="60" fill="#adb5bd" stroke="#111" stroke-width="7"/><circle cx="0" cy="-60" r="26" fill="#e63946" stroke="#111" stroke-width="7"/>`;
  // cabin back wall + roof
  s += `<rect x="-232" y="30" width="464" height="410" rx="18" fill="#ff70a6" stroke="#111" stroke-width="9"/><rect x="-206" y="62" width="412" height="340" rx="10" fill="#ffe5ec" stroke="#111" stroke-width="6"/>`;
  s += `<path d="M-270 40 L0 -70 L270 40z" fill="#ffd23f" stroke="#111" stroke-width="9" stroke-linejoin="round"/>${[-200, -100, 0, 100, 200].map(x => `<circle cx="${x * 0.82}" cy="${28 - Math.abs(x) * 0.13}" r="10" fill="#fff3b0" stroke="#111" stroke-width="3"/>`).join('')}`;
  s += pigeonSprite(120, -50, 1.35, 0, false);
  s += `</g>`;
  // characters inside the cabin (drawn in screen coords relative to the swaying cabin)
  const hs = 0.55, st = { cy: 930 - 395 * hs + 60, scale: hs, rot: Math.sin(t * 3) * 1.5, lookX: -25, lookY: 20, sad: false, pin: false };
  const k = KT[2], sx = G[0], baseY = G[1] + 400;
  const X = 540, sockLike = 0;
  const ov = { fL: [X - 60, 1676], fR: [X + 60, 1676] };
  s += `<g transform="translate(${G[0]} ${G[1]}) rotate(${f2(sway)}) translate(${-G[0]} ${-G[1]})">`;
  s += figT(t, st, ov, sx + 100, baseY, k, 0, 2);
  const P = baseP(); P.x = sx - 110; P.y = baseY; P.mh = [165, -330]; P.micRot = 75; P.lean = -3;
  if (t > wt('T6', 'TICKETS!') && t < wt('T6', 'TICKETS!') + 1.2) { P.fh = [90, -520]; P.file = false; P.eyeY = -10; P.tilt = -8; }
  const ba = boltAge(t); if (ba < 0.25) P.y -= 12 * (1 - ba / 0.25);
  s += figS(t, P, KS[2], 2);
  s += `</g>`;
  // cabin front wall + rail (hides legs)
  s += `<g transform="translate(${G[0]} ${G[1]}) rotate(${f2(sway)})"><path d="M-232 270 H232 V430 Q232 440 222 440 H-222 Q-232 440 -232 430z" fill="#ff70a6" stroke="#111" stroke-width="9"/><rect x="-232" y="262" width="464" height="22" rx="10" fill="#ffd23f" stroke="#111" stroke-width="7"/>${[-180, -90, 0, 90, 180].map(x => `<line x1="${x}" y1="284" x2="${x}" y2="428" stroke="#111" stroke-width="5" opacity="0.4"/>`).join('')}<g transform="translate(150 372)"><circle r="24" fill="#fff" stroke="#111" stroke-width="5"/>${duck(0, 14, 0.55, false)}</g></g>`;
  return s;
}

// ================= SETTING 4: THE PIGEON PARK ========================================
function scenePark(t) {
  const u = t - ACTS[3].a;
  let s = `<rect width="1080" height="1920" fill="#a9def9"/>${rays(260, 330, '#fff', 0.2, t, 20)}<circle cx="260" cy="330" r="100" fill="#fff3b0" stroke="#111" stroke-width="8"/>`;
  for (let i = 0; i < 3; i++) s += cloud(mod(i * 520 - u * 22, 1700) - 200, 280 + i * 130, 1.05);
  for (let i = 0; i < 9; i++) { const x = i * 130 - 20, h = 140 + rnd(i + 4) * 200; s += `<rect x="${x}" y="${1200 - h}" width="110" height="${h}" fill="#cdb4db" stroke="#111" stroke-width="5"/>${[0, 1, 2].map(r => `<rect x="${x + 14}" y="${1200 - h + 22 + r * 50}" width="26" height="30" fill="#fff"/><rect x="${x + 60}" y="${1200 - h + 22 + r * 50}" width="26" height="30" fill="#fff"/>`).join('')}`; }
  const tree = (x, sc) => `<g transform="translate(${x} 1480) scale(${sc})"><rect x="-34" y="-420" width="68" height="420" fill="#8a5a2b" stroke="#111" stroke-width="9"/><circle cx="-110" cy="-470" r="130" fill="#2d6a4f" stroke="#111" stroke-width="9"/><circle cx="110" cy="-480" r="140" fill="#2d6a4f" stroke="#111" stroke-width="9"/><circle cx="0" cy="-600" r="150" fill="#40916c" stroke="#111" stroke-width="9"/><circle cx="-40" cy="-640" r="50" fill="#95d5b2" opacity="0.5"/></g>`;
  s += tree(110, 1) + tree(980, 0.9);
  s += `<rect x="0" y="1480" width="1080" height="440" fill="#74c69d" stroke="#111" stroke-width="8"/><path d="M-40 1790 Q540 1690 1120 1790 V1920 H-40z" fill="#e9c46a" stroke="#111" stroke-width="8"/>`;
  s += `<rect x="0" y="1480" width="1080" height="440" fill="url(#dots)" opacity="0.1"/>`;
  // fountain with the hidden duck
  s += `<g transform="translate(880 1560)"><ellipse cx="0" cy="40" rx="200" ry="60" fill="#8ecae6" stroke="#111" stroke-width="9"/><ellipse cx="0" cy="22" rx="170" ry="44" fill="#b9e6ff" stroke="#111" stroke-width="5"/><rect x="-22" y="-120" width="44" height="150" fill="#adb5bd" stroke="#111" stroke-width="8"/><ellipse cx="0" cy="-130" rx="80" ry="24" fill="#adb5bd" stroke="#111" stroke-width="8"/>`;
  for (let i = 0; i < 6; i++) { const a = i * 1.05 + Math.sin(t * 4) * 0.1; s += `<path d="M0 -130 Q${(Math.cos(a) * 80).toFixed(0)} ${(-210 + Math.sin(a) * 30).toFixed(0)} ${(Math.cos(a) * 150).toFixed(0)} 10" fill="none" stroke="#caf0f8" stroke-width="9" stroke-linecap="round" opacity="0.8"/>`; }
  s += `${duck(-80 + Math.sin(t * 1.4) * 30, 36, 0.8, false)}</g>`;
  // bench
  s += `<g><rect x="500" y="1480" width="400" height="86" fill="#c58b4a" stroke="#111" stroke-width="8"/><path d="M500 1500 h400 M500 1524 h400 M500 1548 h400" stroke="#8a5a2b" stroke-width="5"/><rect x="500" y="1592" width="400" height="30" fill="#c58b4a" stroke="#111" stroke-width="8"/><rect x="520" y="1620" width="28" height="110" fill="#6c757d" stroke="#111" stroke-width="7"/><rect x="852" y="1620" width="28" height="110" fill="#6c757d" stroke="#111" stroke-width="7"/></g>`;
  // lamp post
  s += `<g><rect x="428" y="1030" width="26" height="560" fill="#343a40" stroke="#111" stroke-width="7"/><ellipse cx="441" cy="1020" rx="42" ry="52" fill="#fff2a8" stroke="#111" stroke-width="7"/></g>`;
  s += pigeonSprite(441, 958, 1.4, 0, false);
  return s;
}
function charsPark(t) {
  const u = t - ACTS[3].a, X = 540, o = openness('E', t), a = clamp(o * 1.3);
  const hs = 0.62, st = { cy: 930 - 395 * hs + 60, scale: hs, rot: Math.sin(t * 3) * 1.4, lookX: -22, lookY: 25, sad: false, pin: false };
  const k = KT[3];
  const jk = seg(t, C.S8.end, C.T8.start + 0.35);       // leap onto the bench
  const seated = jk < 0.02;
  const pyS = 1600 + 346 * k, pyUp = 1560;
  const py = lerp(pyS, pyUp, jk) - 130 * Math.sin(Math.PI * jk);
  let L, R, fL, fR;
  if (seated) { fL = [X - 230, 1650]; fR = [X - 160, 1676]; L = [X - 180, 1180 + Math.sin(u * 7) * 20]; R = [X + 150, 1250 - 120 * a]; }
  else { fL = [X - 70, 1676]; fR = [X + 70, 1676]; }
  if (t >= C.T8.start && t < C.S9.start) { L = [X - 200 - 30 * Math.sin(t * 12), 1000]; R = [X + 200 + 30 * Math.sin(t * 13), 980]; }
  if (t >= C.S9.start && t < C.T9.start) { L = [X - 160, 1200]; R = [X + 160, 1200]; }
  if (t >= C.T9.start) { L = [X - 190 + 20 * Math.sin(t * 8), 800]; R = [X + 190 + 20 * Math.sin(t * 8 + 1), 800]; }
  const ov = { fL, fR }; if (L) ov.L = L; if (R) ov.R = R;
  let s = toasterGag(t);
  // pigeons: ground flock, then orbit Tesla's head during T9
  const headC = [740, py + (st.cy - 1676) * k], orbitOn = t >= C.T9.start && t < wt('T9', 'DEFENDING') + 0.2, scatter = t >= wt('T9', 'DEFENDING');
  for (let i = 0; i < 12; i++) {
    const gx = 130 + i * 78 + (i % 2) * 20, gy = 1790 + (i % 3) * 30 + Math.sin(u * 6 + i) * 3, peck = Math.sin(u * 7 + i * 2) * 6;
    if (!orbitOn && !scatter) s += pigeonSprite(gx, gy + Math.max(0, peck), 1.05, 0);
    else if (orbitOn) { const q = t - C.T9.start, ang = q * 4.2 + i * Math.PI * 2 / 12, rr = 270 + (i % 3) * 40; s += pigeonSprite(headC[0] + Math.cos(ang) * rr, headC[1] + Math.sin(ang) * rr * 0.45, 1.05, Math.sin(t * 40 + i) * 14); }
    else { const q = t - wt('T9', 'DEFENDING'); s += pigeonSprite(gx + (i % 2 ? 1 : -1) * q * 600, gy - q * 700, 1.05, Math.sin(t * 40 + i) * 14); }
  }
  // lab bills blowing in the wind during S8/T8
  const b0 = C.S8.start, b1 = C.T8.end;
  if (t >= b0 && t < b1 + 0.6) for (let i = 0; i < 9; i++) { const q = (t - b0) * (520 + rnd(i) * 140) + i * 140, x = 1250 - mod(q, 1700), y = 600 + i * 90 + Math.sin(t * 5 + i) * 40; s += `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${(t * 120 + i * 50).toFixed(0)})"><rect x="-34" y="-44" width="68" height="88" fill="#fff" stroke="#111" stroke-width="5"/><path d="M-22 -22 h44 M-22 -6 h44 M-22 10 h30" stroke="#999" stroke-width="3"/><rect x="-26" y="22" width="52" height="14" fill="#e63946"/></g>`; }
  s += figT(t, st, ov, 740, py, k, seated ? 0 : Math.sin(t * 10) * 2, 3);
  // breadcrumbs flying while he sits
  if (seated && t < C.S8.start) for (let i = 0; i < 6; i++) { const ph = mod(u * 1.3 + i / 6, 1); s += `<circle cx="${(660 - ph * 380).toFixed(0)}" cy="${(1380 + ph * 330 - Math.sin(ph * Math.PI) * 150).toFixed(0)}" r="7" fill="#e9c46a" stroke="#111" stroke-width="3"/>`; }
  const P = baseP(); P.x = 250; P.y = 1800; P.mh = [180, -330]; P.micRot = 75; P.lean = 2;
  if (t >= C.S8.start && t < C.T8.start) { P.fh = [120, -520]; P.file = true; P.brow = 10; }
  if (t >= C.S9.start && t < C.T9.start) { const q = seg(t, C.S9.start + 0.2, C.S9.end); P.fh = [140, -690 * q + -230 * (1 - q)]; P.tilt = -8 * q; P.eyeY = -10 * q; }
  if (t >= C.T9.start) { P.tilt = -6; P.brow = 8; P.headDy = Math.sin(t * 10) * 3; }
  if (t >= C.S7.end && t < C.S8.start) { P.note = true; P.fh = [60, -260]; }
  const ba = boltAge(t); if (ba < 0.25) P.y -= 12 * (1 - ba / 0.25);
  s += figS(t, P, KS[3], 3);
  return s;
}

// ================= SETTING 5: THE TOWER ROOFTOP AT NIGHT ============================
function sceneTower(t) {
  const u = t - ACTS[4].a, off = t >= TL.lightsOut;
  let s = `<defs><linearGradient id="tsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#03045e"/><stop offset="1" stop-color="#7b2cbf"/></linearGradient></defs><rect width="1080" height="1920" fill="url(#tsky)"/>${stars(t, 70)}<circle cx="880" cy="250" r="95" fill="#fff3b0" stroke="#111" stroke-width="8"/>`;
  s += rays(540, 1000, '#fff', off ? 0.02 : 0.07, t, 14);
  // city skyline with windows that black out in a ripple
  for (let i = 0; i < 9; i++) {
    const x = i * 124 - 20, h = 360 + rnd(i + 2) * 460, base = 1700;
    s += `<rect x="${x}" y="${base - h}" width="116" height="${h}" fill="#240046" stroke="#111" stroke-width="6"/>`;
    for (let r = 0; r < Math.floor(h / 64); r++) for (let c = 0; c < 3; c++) {
      const lit0 = rnd(i * 31 + r * 7 + c) > 0.28, wx = x + 14 + c * 34, wy = base - h + 22 + r * 64, dist = Math.abs(wx - 540) / 1080;
      const lit = lit0 && !(t >= TL.lightsOut + dist * 0.9);
      s += `<rect x="${wx}" y="${wy}" width="24" height="34" fill="${lit ? '#ffd23f' : '#10002b'}"${lit ? '' : ' opacity="0.9"'}/>`;
    }
  }
  // roof Tesla coil with the hidden duck peeking out from behind it
  s += duck(486, 1664, 0.95, false);
  s += `<rect x="396" y="1650" width="110" height="52" rx="8" fill="#555c68" stroke="#111" stroke-width="7"/><rect x="418" y="1370" width="66" height="284" rx="10" fill="#b9732f" stroke="#111" stroke-width="7"/>${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(k => `<path d="M418 ${1392 + k * 26} h66" stroke="#7a4513" stroke-width="5"/>`).join('')}<ellipse cx="451" cy="1350" rx="88" ry="30" fill="#c9ced6" stroke="#111" stroke-width="7"/>`;
  if (!off || boltAge(t) < 0.3) { const fk = Math.floor(t * 14); for (let a = 0; a < 2; a++) { const ang = ((fk * 53 + a * 150) % 180 + 180) * Math.PI / 180; let d = `M451 1330`; for (let i = 1; i <= 4; i++) d += ` L${(451 + Math.cos(ang) * 90 * i / 4 + (((fk * 7 + i * 13 + a) % 20) - 10)).toFixed(0)} ${(1330 + Math.sin(ang) * 90 * i / 4 + (((fk * 11 + i * 17) % 16) - 8)).toFixed(0)}`; s += `<path d="${d}" fill="none" stroke="#fff" stroke-width="8" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#9be7ff" stroke-width="3"/>`; } }
  // Tesla tower with dome and sparks
  const tx = 190;
  s += `<path d="M${tx - 110} 1700 L${tx - 28} 640 L${tx + 28} 640 L${tx + 110} 1700z" fill="none" stroke="#111" stroke-width="16" stroke-linejoin="round"/><path d="M${tx - 110} 1700 L${tx - 28} 640 L${tx + 28} 640 L${tx + 110} 1700z" fill="none" stroke="#adb5bd" stroke-width="8"/>`;
  for (let i = 0; i < 9; i++) { const y = 700 + i * 110, w = 28 + i * 9; s += `<path d="M${tx - w} ${y} L${tx + w + 9} ${y + 110} M${tx + w} ${y} L${tx - w - 9} ${y + 110}" stroke="#6c757d" stroke-width="6"/>`; }
  s += `<ellipse cx="${tx}" cy="616" rx="130" ry="46" fill="#c9ced6" stroke="#111" stroke-width="9"/><ellipse cx="${tx}" cy="600" rx="84" ry="22" fill="#eef1f6" opacity="0.7"/>`;
  const fl = Math.floor(t * 14);
  if (!off || boltAge(t) < 0.3) for (let a = 0; a < 4; a++) { const ang = ((fl * 61 + a * 90) % 360) * Math.PI / 180, L = 220 + ((fl * 29 + a * 23) % 120); let d = `M${tx} 580`, x = tx, y = 580;
    for (let i = 1; i <= 6; i++) { x = tx + Math.cos(ang) * L * i / 6 + (((fl * 7 + i * 13 + a) % 36) - 18); y = 580 - Math.abs(Math.sin(ang)) * L * i / 6 + (((fl * 11 + i * 19) % 28) - 14); d += ` L${x.toFixed(0)} ${y.toFixed(0)}`; }
    s += `<path d="${d}" fill="none" stroke="#fff" stroke-width="10" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#9be7ff" stroke-width="4"/>`; }
  // rooftop
  s += `<rect x="0" y="1700" width="1080" height="220" fill="#6c757d" stroke="#111" stroke-width="9"/><rect x="0" y="1690" width="1080" height="26" fill="#adb5bd" stroke="#111" stroke-width="7"/>`;
  s += `<path d="M0 1790 H1080 M0 1850 H1080" stroke="#495057" stroke-width="5"/>`;
  // control panel with big lever, gauges, and the hidden duck
  const pull = seg(t, wt('T12', 'POWER'), wt('T12', 'POWER') + 0.5), ang = lerp(-58, 42, pull);
  s += `<g transform="translate(940 1700)"><rect x="-110" y="-520" width="220" height="520" rx="14" fill="#343a40" stroke="#111" stroke-width="9"/>${[0, 1].map(i => `<g transform="translate(0 ${-440 + i * 130})"><circle r="46" fill="#f8f9fa" stroke="#111" stroke-width="7"/><line x1="0" y1="0" x2="${(36 * Math.cos(-2 + Math.sin(t * 9 + i) * 0.5 - (off ? 1 : 0))).toFixed(0)}" y2="${(36 * Math.sin(-2 + Math.sin(t * 9 + i) * 0.5 - (off ? 1 : 0))).toFixed(0)}" stroke="#e63946" stroke-width="6" stroke-linecap="round"/></g>`).join('')}<rect x="-60" y="-190" width="120" height="60" rx="10" fill="#e63946" stroke="#111" stroke-width="7"/><text y="-148" text-anchor="middle" font-size="30" fill="#fff">POWER</text><g transform="translate(0 -60) rotate(${f2(ang)})"><rect x="-12" y="-170" width="24" height="170" rx="10" fill="#adb5bd" stroke="#111" stroke-width="7"/><circle cy="-176" r="30" fill="#e63946" stroke="#111" stroke-width="7"/></g><circle cy="-60" r="26" fill="#111"/></g>`;
  s += pigeonSprite(880, 1148, 1.35, 0, true);
  return s;
}
function charsTower(t) {
  const u = t - ACTS[4].a, X = 540, o = openness('E', t), a = clamp(o * 1.3);
  const hs = 0.8, st = { cy: 930 - 395 * hs + 60, scale: hs, rot: Math.sin(t * 3) * 1.4, lookX: -25, lookY: 25, sad: false, pin: false };
  const k = KT[4];
  let L, R, fL = [X - 70, 1676], fR = [X + 70, 1676], px = 640, py = 1700, lean = 0;
  const lim = t >= C.S11.start && t < C.S12.start;
  if (lim && t > C.S11.end) { st.sad = true; st.cy += 26; st.rot = -4; st.pin = true; }
  if (t >= C.T10.start && t < C.S11.start) { L = [X - 340, 860 + Math.sin(t * 9) * 10]; R = [X + 340, 860 + Math.sin(t * 9 + 1) * 10]; }
  if (lim) { L = [X - 120, 1330]; R = [X + 120, 1330]; }
  if (t >= C.T12.start) { L = [X - 175 + Math.sin(t * 30) * 10, 900]; R = [X + 175 + Math.sin(t * 28) * 10, 900]; }
  const pullT = wt('T12', 'POWER');
  if (t >= pullT - 0.3 && t < pullT + 0.8) { const q = seg(t, pullT, pullT + 0.5); R = [X + 330, lerp(960, 1200, q)]; L = [X - 175, 900]; px = lerp(640, 700, q); }
  if (t >= TL.lightsOut && t < C.T13.start) { L = [X - 140, 1260]; R = [X + 140, 1260]; px = 700; }
  // T13: he chases her off the roof
  if (t >= C.T13.start) {
    const q = clamp((t - C.T13.start) / (C.T13.dur + 0.4)), ph = t * 13;
    px = lerp(700, -260, q * q); lean = 10;
    fL = [X - 70 + Math.sin(ph) * 80, 1676 - Math.max(0, Math.cos(ph)) * 60]; fR = [X + 70 - Math.sin(ph) * 80, 1676 - Math.max(0, -Math.cos(ph)) * 60];
    L = [X - 175 + Math.sin(t * 30) * 8, 1000]; R = [X - 420, 960 + Math.sin(t * 22) * 30];
  }
  const ov = { fL, fR }; if (L) ov.L = L; if (R) ov.R = R;
  let s = figT(t, st, ov, px, py, k, lean, 4);
  const P = baseP(); P.x = 250; P.y = 1740; P.mh = [180, -330]; P.micRot = 75;
  if (t >= C.S10.start && t < C.S11.start) P.brow = 8;
  if (t >= C.S11.start && t < C.S12.start) { const q = seg(t, C.S11.start, C.S11.start + 0.25); P.fh = [lerp(P.fh[0], 120, q), lerp(P.fh[1], -600, q)]; P.file = q > 0.4; P.brow = 14; P.lid = 6; }
  if (t >= C.S12.start) { const q = seg(t, C.S12.start, C.S12.start + 0.3); P.fh = [lerp(P.fh[0], 62, q), lerp(P.fh[1], -475, q)]; P.phone = q > 0.3; P.tilt = lerp(0, 8, q); P.brow = 10; }
  if (t >= C.S13.start && t < C.T13.start) { P.brow = 12; P.lid = 6; }
  if (t >= C.T13.start + 0.1) { const q = clamp((t - C.T13.start - 0.1) / 1.7); P.walk = true; P.phase = t * 15; P.x = lerp(250, -330, q * q); P.lean = 12; P.y -= Math.abs(Math.sin(t * 15)) * 14; }
  const ba = boltAge(t); if (ba < 0.25) { P.x += Math.sin(ba * 120) * 10 * (1 - ba / 0.25); P.y -= 12 * (1 - ba / 0.25); }
  window.__phone = P;
  s += figS(t, P, KS[4], 4);
  return s;
}

function baseP() {
  const P = { x: 300, y: 1872, lean: 0, phase: 0, walk: false, tilt: 0, headDy: 0, eyeX: 6, eyeY: 2, lid: 14, brow: 0,
              fh: [-95, -230], mh: [150, -380], micRot: 70, juice: false, file: false, note: false, dangle: false, phone: false };
  P.fh = [-95 + Math.sin(cur * 4) * 6, -230 + Math.sin(cur * 3) * 6]; P.mh = [150 + Math.sin(cur * 3.5) * 5, -380 + Math.sin(cur * 2.6) * 6];
  return P;
}
const SCENES = [t => sceneStairs(t) + charsStairs(t), t => sceneCar(t) + charsCar(t), t => sceneWheel(t) + charsWheel(t), t => scenePark(t) + charsPark(t), t => sceneTower(t) + charsTower(t)];

window.renderFrame = function (frame) {
  const t = frame / FPS; cur = t;
  const svg = document.getElementById('stage');
  const act = actAt(t), dk = dark(t), freeze = t >= TL.freezeAt, endcard = t >= TL.freezeAt + 0.55;
  const jit = Math.floor(t * 8), jx = Math.sin(jit * 12.9898) * 2, jy = Math.cos(jit * 78.233) * 2;
  const ba = boltAge(t), shake = ba < 0.22 ? Math.sin(ba * 200) * 9 * (1 - ba / 0.22) : 0;

  let s = `<defs>${[0, 1, 2, 3, 4].map(i => stk('stT' + i, KT[i]) + stk('stS' + i, KS[i])).join('')}${stk('stC1', 1)}
    <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="13" cy="13" r="5" fill="#000"/></pattern>
    <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6d4b4"/><stop offset="1" stop-color="#e5ae86"/></linearGradient>
    <linearGradient id="red" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f0443a"/><stop offset="1" stop-color="#b3201c"/></linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffd27a" stop-opacity="0.9"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient></defs>`;
  s += `<g transform="translate(${f2(shake)} 0)">`;
  const u0 = t - ACTS[act].a;
  if (freeze) {
    s += `<rect width="1080" height="1920" fill="#e63946"/>${rays(540, 780, '#fff', 0.25, t, 18)}`;
    const st = { cy: 780, scale: 1.4, rot: 0, lookX: -20, lookY: 20, sad: false, pin: false };
    STK = 'stT4'; s += `<g filter="url(#stT4)" transform="translate(0 0)">${tesla(t, st)}</g>`;
  } else if (act > 0 && u0 < 0.55) {
    const r = ease(u0 / 0.55) * 1500;
    s += SCENES[act - 1](t) + `<clipPath id="iris"><circle cx="540" cy="1000" r="${r.toFixed(0)}"/></clipPath><g clip-path="url(#iris)">${SCENES[act](t)}</g><circle cx="540" cy="1000" r="${r.toFixed(0)}" fill="none" stroke="#111" stroke-width="26"/><circle cx="540" cy="1000" r="${r.toFixed(0)}" fill="none" stroke="#ffd23f" stroke-width="12"/>`;
  } else s += SCENES[act](t);

  // card (position depends on the setting)
  const cd = cardAt(t);
  if (cd && !freeze) {
    const k = ease(clamp((t - cd.a) / 0.3)) * (1 - ease(clamp((t - (cd.b - 0.2)) / 0.2)));
    s += paperCard(CARD_POS[act][0] + jx, CARD_POS[act][1] + jy, 400, 410, 3 + Math.sin(jit) * 1.5, ICON[cd.k](t), k);
  }
  // silence bubble
  const lim = t >= C.S11.start && t < C.S12.start;
  if (lim && t > C.S11.end) {
    s += `<g transform="translate(850 880)"><ellipse rx="110" ry="64" fill="#fff" stroke="#111" stroke-width="7"/><path d="M-50 56 l-30 56 l76 -40z" fill="#fff" stroke="#111" stroke-width="7"/><path d="M-48 52 l-4 0" stroke="#fff" stroke-width="10"/><circle cx="-44" cy="0" r="12" fill="#111"/><circle cx="0" cy="0" r="12" fill="#111"/><circle cx="44" cy="0" r="12" fill="#111"/></g>`;
  }
  // stamps
  for (let i = 0; i < STAMPS.length; i++) {
    const a = t - STAMPS[i].t;
    if (a >= 0 && a < 0.6 && !freeze) {
      const k = Math.min(1, a / 0.1), fade = a > 0.42 ? 1 - (a - 0.42) / 0.18 : 1;
      const sc = 1.6 - 0.6 * ease(k), col = STAMP_COL[i % STAMP_COL.length];
      const fs = Math.min(150, Math.floor(980 / (STAMPS[i].word.length * 0.7)));
      s += `<g transform="translate(${540 + ((i * 97) % 160) - 80} ${840 + (i % 3) * 46}) rotate(${i % 2 ? 7 : -7}) scale(${f2(sc)})" opacity="${f2(fade)}">
        <text text-anchor="middle" y="0" font-size="${fs}" fill="${col}" stroke="#fffdf5" stroke-width="22" paint-order="stroke" stroke-linejoin="round">${STAMPS[i].word}</text>
        <text text-anchor="middle" y="0" font-size="${fs}" fill="${col}">${STAMPS[i].word}</text></g>`;
    }
  }
  // an absurd doodle for every insult
  for (let i = 0; i < STAMPS.length; i++) {
    const q = t - STAMPS[i].t, wd = STAMPS[i].word;
    if (q >= 0 && q < 0.95 && !freeze && ['GET', 'OUT', 'OF', 'MY', 'LAB'].indexOf(wd) < 0) s += doodle(wd, q, i % 2 ? 905 : 175, 960 + (i % 3) * 36);
  }
  // darkness + phone spotlight + flashes
  if (dk) {
    const Pp = window.__phone || { x: 250, y: 1700, fh: [62, -475] };
    const px = Pp.x + Pp.fh[0] * KS[4] * 1.22 / 1.0, py = Pp.y + Pp.fh[1] * KS[4] * 1.22 - 30;
    const flash = ba < 0.28 ? (1 - ba / 0.28) : 0;
    s += `<defs><radialGradient id="darkHole" gradientUnits="userSpaceOnUse" cx="${f2(px)}" cy="${f2(py)}" r="560"><stop offset="0" stop-color="#02030a" stop-opacity="0.2"/><stop offset="0.5" stop-color="#02030a" stop-opacity="0.88"/><stop offset="1" stop-color="#02030a" stop-opacity="0.96"/></radialGradient></defs>
      <rect width="1080" height="1920" fill="url(#darkHole)" opacity="${f2(1 - flash * 0.93)}"/>`;
    if (Pp.phone) s += `<circle cx="${f2(px)}" cy="${f2(py)}" r="90" fill="#bdeeff" opacity="0.28"/>`;
  }
  if (ba < 0.2 && !freeze) {
    const seed = Math.floor(t * 10), op = (1 - ba / 0.2), bp = boltPath(seed);
    s += `<path d="${bp}" fill="none" stroke="#fff" stroke-width="${22 * op + 6}" stroke-linejoin="round" opacity="${f2(op)}"/><path d="${bp}" fill="none" stroke="#ffd23f" stroke-width="${10 * op + 3}" stroke-linejoin="round" opacity="${f2(op)}"/><rect width="1080" height="1920" fill="#fff" opacity="${f2(op * 0.3)}"/>`;
  }
  if (freeze && !endcard) s += `<rect width="1080" height="1920" fill="#fff" opacity="${f2(Math.max(0, 0.5 - (t - TL.freezeAt) * 1.2))}"/>`;
  if (endcard) {
    const k = seg(t, TL.freezeAt + 0.55, TL.freezeAt + 0.85);
    s += `<rect width="1080" height="1920" fill="#ffd23f" opacity="${f2(k)}"/><rect width="1080" height="1920" fill="url(#dots)" opacity="${f2(0.12 * k)}"/><g opacity="${f2(k)}">${duck(540, 760, 3.2, true)}</g>`;
    s += `<g opacity="${f2(k)}" transform="rotate(-2 540 1300)"><text x="540" y="1100" text-anchor="middle" font-size="76" fill="#111">WHO WON THE</text><text x="540" y="1190" text-anchor="middle" font-size="76" fill="#111">ELECTRICITY WAR?</text>
          <rect x="120" y="1250" width="840" height="140" rx="20" fill="#e63946" stroke="#111" stroke-width="8"/><text x="540" y="1350" text-anchor="middle" font-size="86" fill="#fff">TESLA OR EDISON?</text><text x="540" y="1480" text-anchor="middle" font-size="64" fill="#111">COMMENT BELOW!</text></g>`;
    s += `<text x="540" y="1780" text-anchor="middle" font-size="26" fill="#111" opacity="${f2(k * 0.8)}" style="font-weight:800">AI-generated fictional comedy inspired by real historical figures.</text>`;
  }
  const cap = !freeze ? captionFor(t) : null;
  if (cap) {
    const sc = 1 + (1 - cap.pop) * 0.14, fs = Math.min(100, Math.floor(920 / (cap.text.length * 0.66))), wbar = Math.min(1040, cap.text.length * fs * 0.64 + 60), bar = cap.spk === 'E' ? '#ffe14a' : '#ffffff';
    s += `<g transform="translate(540 255) scale(${f2(sc)}) rotate(${cap.spk === 'E' ? -1.5 : 1.2})"><rect x="${-wbar / 2 + 8}" y="${-fs * 0.95 + 10}" width="${wbar}" height="${fs * 1.25}" rx="10" fill="#000" opacity="0.3"/><rect x="${-wbar / 2}" y="${-fs * 0.95}" width="${wbar}" height="${fs * 1.25}" rx="10" fill="${bar}" stroke="#111" stroke-width="6"/><text x="0" y="0" text-anchor="middle" font-size="${fs}" fill="#111">${cap.text.replace(/&/g, '&amp;')}</text></g>`;
  }
  s += `</g>`;
  s += `<rect x="30" y="52" width="420" height="58" rx="8" fill="#111"/><text x="46" y="94" font-size="34" fill="#fff" letter-spacing="6">SURVIVAL UNTOLD</text>`;
  if (t < 4.0) s += `<text x="46" y="1896" font-size="26" fill="#fff" stroke="#111" stroke-width="5" paint-order="stroke" style="font-weight:800">AI-generated fictional comedy inspired by real historical figures.</text>`;
  svg.innerHTML = s;
};
renderFrame(0);
