// ===================== GENIUSES GONE MAD EP4 (Wright brothers on a plane) =====================
const X = 540, FY = 1500, SCK = 0.64, R = '#1b1b22';
const endT = id => C[id].start + C[id].dur;
const amp = (who, t) => clamp(openness(who, t) * 1.3);
const mv = (t, t0, t1, x0, x1) => lerp(x0, x1, ease(clamp((t - t0) / (t1 - t0))));
const PAL = { O: { jacket: '#4a4f57', dark: '#2c3036', trouser: '#3a3f47', tie: '#d62839', vest: '#8b6b4a', cap: '#8a6a45', capD: '#5e4529', hair: '#2b2118' },
              W: { jacket: '#2f4b73', dark: '#1d3250', trouser: '#2b3a52', tie: '#2a9d8f', vest: '#c9b78a', cap: '#7d8794', capD: '#4f5762', hair: '#4a3b30' } };

// ---- heads: flat cap, big moustache, lip-synced mouth -------------------------------------------
function wrightHead(t, who, st) {
  const o = openness(who, t), shout = clamp(o * 1.5), sp = speaking(who), P = PAL[who];
  const shake = sp ? Math.sin(t * 80 + (who === 'W' ? 2 : 0)) * 4 * shout : 0;
  const sc = st.scale * (1 + 0.03 * o), lx = st.lookX, ly = st.lookY, shock = st.shock || 0;
  const browA = 8 + shout * 18 + shock * 14;
  const mh = 10 + o * 190, mw = 100 + o * 80;
  const fw = who === 'W' ? 238 : 268, fh = who === 'W' ? 368 : 338;
  let s = `<g transform="translate(${f2(540 + shake)} ${f2(st.cy + (sp ? Math.sin(t * 61) * 3 * shout : 0))}) scale(${f2(sc)}) rotate(${f2(st.rot)})">`;
  s += `<path d="M${-fw + 12} -90 Q${-fw - 60} 40 ${-fw + 10} 190 Q${-fw + 40} 60 ${-fw + 60} -40z M${fw - 12} -90 Q${fw + 60} 40 ${fw - 10} 190 Q${fw - 40} 60 ${fw - 60} -40z" fill="${P.hair}" stroke="#000" stroke-width="10"/>`;
  s += `<ellipse cx="${-fw + 4}" cy="20" rx="38" ry="64" fill="#e3ad84" stroke="#000" stroke-width="13"/><ellipse cx="${fw - 4}" cy="20" rx="38" ry="64" fill="#e3ad84" stroke="#000" stroke-width="13"/>`;
  s += `<ellipse cx="0" cy="0" rx="${fw}" ry="${fh}" fill="url(#skin)" stroke="#000" stroke-width="18"/>`;
  if (who === 'W') s += `<path d="M-150 120 Q-120 210 -60 250 M150 120 Q120 210 60 250" fill="none" stroke="#c28a68" stroke-width="9" stroke-linecap="round" opacity="0.7"/>`;
  s += `<ellipse cx="-175" cy="118" rx="54" ry="34" fill="#ff9a8a" opacity="0.5"/><ellipse cx="175" cy="118" rx="54" ry="34" fill="#ff9a8a" opacity="0.5"/>`;
  for (const sx of [-98, 98]) {
    const rr = 1 + shock * 0.25;
    s += `<ellipse cx="${sx}" cy="-56" rx="${70 * rr}" ry="${80 * rr}" fill="#fff" stroke="#000" stroke-width="12"/>`;
    if (shout > 0.55) s += `<path d="M${sx - 54} -56 q22 10 36 -14 M${sx + 54} -56 q-22 10 -36 -14" fill="none" stroke="#e44" stroke-width="3" opacity="0.75"/>`;
    s += `<circle cx="${sx + lx * 0.9}" cy="${-50 + ly * 0.9}" r="${30 - shock * 8}" fill="#1c1c1c"/><circle cx="${sx + lx * 0.9 - 9}" cy="${-62 + ly * 0.9}" r="10" fill="#fff"/>`;
  }
  s += `<path d="M-188 ${-176 + browA} Q-100 ${-224} -18 ${-158 - browA * 0.3}" fill="none" stroke="#000" stroke-width="38" stroke-linecap="round"/><path d="M-188 ${-176 + browA} Q-100 ${-224} -18 ${-158 - browA * 0.3}" fill="none" stroke="${P.hair}" stroke-width="24" stroke-linecap="round"/>
        <path d="M188 ${-176 + browA} Q100 ${-224} 18 ${-158 - browA * 0.3}" fill="none" stroke="#000" stroke-width="38" stroke-linecap="round"/><path d="M188 ${-176 + browA} Q100 ${-224} 18 ${-158 - browA * 0.3}" fill="none" stroke="${P.hair}" stroke-width="24" stroke-linecap="round"/>`;
  s += `<ellipse cx="0" cy="46" rx="${who === 'W' ? 74 : 62}" ry="${who === 'W' ? 66 : 54}" fill="#e0a07a" stroke="#000" stroke-width="12"/>`;
  s += `<g transform="translate(0 ${166 + o * 16})"><ellipse cx="0" cy="${mh / 2}" rx="${mw}" ry="${mh / 2 + 8}" fill="#4a0a10" stroke="#000" stroke-width="12"/>
        <rect x="${-mw * 0.62}" y="0" width="${mw * 1.24}" height="${Math.min(34, mh * 0.35)}" rx="8" fill="#fff" opacity="${o > 0.12 ? 1 : 0}"/>
        <ellipse cx="0" cy="${mh * 0.82}" rx="${mw * 0.55}" ry="${Math.max(6, mh * 0.2)}" fill="#e0606c" opacity="${o > 0.25 ? 1 : 0}"/></g>`;
  // moustache sits over the top lip
  if (who === 'O') s += `<path d="M0 138 Q-80 108 -150 146 Q-210 118 -224 70 Q-196 186 -120 190 Q-50 190 0 164 Q50 190 120 190 Q196 186 224 70 Q210 118 150 146 Q80 108 0 138z" fill="${P.hair}" stroke="#000" stroke-width="9" stroke-linejoin="round"/>`;
  else s += `<path d="M0 134 Q-90 112 -170 150 Q-190 200 -120 208 Q-50 200 0 172 Q50 200 120 208 Q190 200 170 150 Q90 112 0 134z" fill="${P.hair}" stroke="#000" stroke-width="9" stroke-linejoin="round"/>`;
  // flat cap
  s += `<path d="M${-fw - 8} -150 Q${-fw - 20} -330 -90 -372 Q70 -402 ${fw - 30} -336 Q${fw + 30} -290 ${fw + 6} -150 Q0 -210 ${-fw - 8} -150z" fill="${P.cap}" stroke="#000" stroke-width="14" stroke-linejoin="round"/>
        <path d="M-210 -190 Q-120 -150 -20 -172 M40 -176 Q150 -190 230 -170" fill="none" stroke="${P.capD}" stroke-width="7" opacity="0.6"/>
        <path d="M${-fw - 20} -168 Q-120 -128 120 -150 Q${fw + 40} -170 ${fw + 100} -128 Q${fw + 20} -92 20 -108 Q-150 -96 ${-fw - 20} -168z" fill="${P.capD}" stroke="#000" stroke-width="12" stroke-linejoin="round"/><circle cx="-10" cy="-385" r="16" fill="${P.capD}" stroke="#000" stroke-width="8"/>`;
  return s + `</g>`;
}
function wHeadSt(t, hs, over) { return Object.assign({ cy: 930 - 385 * hs + 60, scale: hs, rot: Math.sin(t * 3) * 1.2, lookX: 0, lookY: 4, shock: 0 }, over || {}); }

// ---- bodies: 1903 suit, vest, tie, knee-bending legs ----------------------------------------------
function suitBody(t, who, ov) {
  const P = PAL[who], L = ov.L || [X - 165, 1230], Rr = ov.R || [X + 165, 1230], fL = ov.fL || [X - 112, 1676], fR = ov.fR || [X + 112, 1676], by = ov.by || 0;
  const dirx = ov.dir || 1, sway = ov.sway || 0;
  const arm = (sx, h) => { const ex = (sx + h[0]) / 2 + (sx < X ? -26 : 26), ey = (1010 + h[1]) / 2 + 60;
    return `<path d="M${sx} 1010 Q${ex} ${ey} ${h[0]} ${h[1]}" fill="none" stroke="#111" stroke-width="46" stroke-linecap="round"/><path d="M${sx} 1010 Q${ex} ${ey} ${h[0]} ${h[1]}" fill="none" stroke="${P.jacket}" stroke-width="38" stroke-linecap="round"/><circle cx="${h[0]}" cy="${h[1]}" r="34" fill="#fff" stroke="#111" stroke-width="5"/><circle cx="${h[0]}" cy="${h[1]}" r="22" fill="#f6d4b4" stroke="#111" stroke-width="4"/>`; };
  const leg = (hx, f) => {
    const hy = 1340, dx = f[0] - hx, dy = (f[1] - 14) - hy, dl = Math.max(1, Math.hypot(dx, dy)), dd = Math.min(dl, 352), L1 = 178;
    const hh = Math.sqrt(Math.max(0, L1 * L1 - (dd / 2) * (dd / 2))), ux = dx / dl, uy = dy / dl; let nx = -uy, ny = ux; if (nx * dirx < 0) { nx = -nx; ny = -ny; }
    const kx = hx + ux * dd / 2 + nx * hh, ky = hy + uy * dd / 2 + ny * hh;
    return `<path d="M${hx} ${hy} L${f2(kx)} ${f2(ky)} L${f2(f[0])} ${f2(f[1] - 14)}" fill="none" stroke="#111" stroke-width="54" stroke-linecap="round" stroke-linejoin="round"/><path d="M${hx} ${hy} L${f2(kx)} ${f2(ky)} L${f2(f[0])} ${f2(f[1] - 14)}" fill="none" stroke="${P.trouser}" stroke-width="44" stroke-linecap="round" stroke-linejoin="round"/>
      <ellipse cx="${f2(f[0] + 16 * dirx)}" cy="${f2(f[1] + 6)}" rx="56" ry="22" fill="#2a1b12" stroke="#000" stroke-width="5"/>`;
  };
  let s = `<g transform="translate(0 ${f2(by)})">` + leg(X - 62, fL) + leg(X + 62, fR);
  s += `<path d="M${X - 108} 975 L${X + 108} 975 L${X + 124 + sway} 1420 L${X - 124 + sway} 1420z" fill="${P.jacket}" stroke="#111" stroke-width="9" stroke-linejoin="round"/>
        <path d="M${X - 52} 975 L${X + 52} 975 L${X + 34} 1330 L${X - 34} 1330z" fill="${P.vest}" stroke="#111" stroke-width="5"/>
        <path d="M${X - 52} 975 L${X} 1130 L${X + 52} 975z" fill="#fff" stroke="#111" stroke-width="5"/><path d="M${X - 12} 1010 L${X + 12} 1010 L${X + 20} 1180 L${X} 1210 L${X - 20} 1180z" fill="${P.tie}" stroke="#111" stroke-width="4"/>
        <path d="M${X - 52} 975 L${X - 20} 1100 L${X - 66} 1180 L${X - 108} 975z M${X + 52} 975 L${X + 20} 1100 L${X + 66} 1180 L${X + 108} 975z" fill="${P.dark}" stroke="#111" stroke-width="5"/>
        ${[0, 1, 2].map(i => `<circle cx="${X}" cy="${1240 + i * 36}" r="7" fill="#e9d8a6" stroke="#111" stroke-width="2"/>`).join('')}`;
  s += arm(X - 100, L) + arm(X + 100, Rr);
  return s + `</g>`;
}
function figW(t, who, st, ov, px, py, k, lean) {
  const body = suitBody(t, who, ov), hs = (ov.by || 0);
  return placeG(px, py, k, body + `<g transform="translate(${f2(ov.sway ? ov.sway * 0.4 : 0)} ${f2(hs)})"><g filter="url(#stF)">${wrightHead(t, who, st)}</g></g>`, `rotate(${f2(lean || 0)})`);
}
function baseP() { const P = { x: 300, y: FY, lean: 0, phase: 0, walk: false, tilt: 0, headDy: 0, eyeX: 6, eyeY: 2, lid: 12, brow: 4, dirx: 1, stride: 42, liftAmt: 30, fh: [-95, -230], mh: [150, -400], micRot: 70, juice: false, file: false, note: false, dangle: false, phone: false, tray: false, vest: false, noMic: false };
  P.fh = [-95 + Math.sin(cur * 4) * 6, -230 + Math.sin(cur * 3) * 6]; P.mh = [150 + Math.sin(cur * 3.5) * 5, -400 + Math.sin(cur * 2.6) * 6]; return P; }
function figS(t, P, k, flip) { const f = flip ? `translate(${f2(P.x)} 0) scale(-1 1) translate(${f2(-P.x)} 0)` : ''; return `<g transform="${f}"><g filter="url(#stS)" transform="translate(${f2(P.x)} ${f2(P.y)}) scale(${f2(k)}) translate(${f2(-P.x)} ${f2(-P.y)})">${scout(t, P)}</g></g>`; }
const shadow = (x, y, k) => dropShadow(x, y + 4, 120 * k, 0.22);

// ---- walking: phase from the distance travelled so feet never slide -------------------------------
function gaitF(ph, dir, run) {
  const stride = run ? 150 : 95, lift = run ? 130 : 60, arm = run ? 170 : 70, bob = run ? 24 : 12;
  const s1 = Math.sin(ph), s2 = Math.sin(ph + Math.PI), c1 = Math.cos(ph), c2 = Math.cos(ph + Math.PI), ay = run ? 1130 : 1240;
  return { dir, fL: [X - 62 + dir * stride * s1, 1676 - lift * Math.max(0, c1)], fR: [X + 62 + dir * stride * s2, 1676 - lift * Math.max(0, c2)],
    L: [X - 165 + dir * arm * s2, ay + 25 * Math.abs(s1)], R: [X + 165 + dir * arm * s1, ay + 25 * Math.abs(s2)], by: -bob * Math.abs(c1), sway: dir * (run ? 40 : 26) * s1 };
}
const phF = (dist, k) => Math.PI * dist / (2 * 95 * k);
function scoutGait(P, ph, dir) { P.walk = true; P.phase = ph; P.dirx = dir; P.stride = 42; P.liftAmt = 30; P.lean = 3 * dir; P.headDy = -Math.abs(Math.cos(ph)) * 4; }
const phS = (dist, k) => Math.PI * dist / (2 * 42 * 1.22 * k);
function flail(t, a, seed) { seed = seed || 0;
  return { L: [X - 150 - 60 * a * Math.sin(t * 14 + seed), 1230 - 420 * a * (0.5 + 0.5 * Math.sin(t * 11 + 1 + seed))], R: [X + 150 + 60 * a * Math.sin(t * 13 + 2 + seed), 1230 - 420 * a * (0.5 + 0.5 * Math.sin(t * 12 + seed))] }; }
function modelPlane(x, y, sc, rot) { return `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(rot)}) scale(${f2(sc)})"><rect x="-110" y="-34" width="220" height="16" rx="5" fill="#d9b17a" stroke="${R}" stroke-width="5"/><rect x="-110" y="10" width="220" height="16" rx="5" fill="#d9b17a" stroke="${R}" stroke-width="5"/><path d="M-60 -18 V10 M0 -18 V10 M60 -18 V10" stroke="${R}" stroke-width="5"/><path d="M-70 -4 H110 L130 6 H-70z" fill="#c68b4a" stroke="${R}" stroke-width="5"/><path d="M-150 -22 V32 M-150 4 H-70" stroke="${R}" stroke-width="7"/><ellipse cx="124" cy="2" rx="8" ry="34" fill="#fff" opacity="0.5"/></g>`; }

// ---- the cabin ------------------------------------------------------------------------------------
const ROWS = 11, PITCH = 200, X0 = 60;
function seatPax(x, i, t, mode) {
  const react = REACT * (6 + (i % 3) * 4), jump = -react;
  const skin = ['#f1c27d', '#e0ac69', '#a9744f', '#c68642', '#ffdbac'][i % 5], hair = ['#2b2118', '#5a3825', '#111', '#c9a227', '#7a4b2a'][(i * 3) % 5];
  const col = ['#e63946', '#ffb703', '#2a9d8f', '#8ecae6', '#9b5de5', '#f4a261', '#06d6a0', '#ef476f', '#118ab2'][i % 9];
  let s = `<g transform="translate(${x} ${jump})">`;
  s += `<rect x="-6" y="1070" width="64" height="380" rx="26" fill="#2f5d9f" stroke="${R}" stroke-width="5"/><rect x="-14" y="1034" width="86" height="64" rx="22" fill="#3d73c0" stroke="${R}" stroke-width="5"/>`;   // seat back + headrest
  s += `<rect x="18" y="1140" width="104" height="250" rx="40" fill="${col}" stroke="${R}" stroke-width="5"/>`;                                                                                     // torso
  s += `<circle cx="78" cy="1090" r="48" fill="${skin}" stroke="${R}" stroke-width="5"/><path d="M32 1084 q4 -52 50 -50 q46 2 44 50 q-30 -34 -94 0z" fill="${hair}" stroke="${R}" stroke-width="4"/>`;
  const m = mode % 5;
  if (m === 2) s += `<rect x="46" y="1078" width="64" height="22" rx="8" fill="#222"/><path d="M60 1112 q18 8 36 0" stroke="${R}" stroke-width="4" fill="none"/>`;
  else {
    s += `<circle cx="64" cy="1086" r="8" fill="#fff"/><circle cx="96" cy="1086" r="8" fill="#fff"/><circle cx="${58 - react * 0.2}" cy="1087" r="4" fill="${R}"/><circle cx="${90 - react * 0.2}" cy="1087" r="4" fill="${R}"/>`;
    s += m === 1 ? `<ellipse cx="80" cy="1118" rx="11" ry="${8 + react}" fill="#5a1f1c"/>` : `<path d="M66 1116 q14 6 26 0" stroke="${R}" stroke-width="4" fill="none"/>`;
  }
  if (m === 3) s += `<path d="M30 1086 q-6 -64 54 -62 q56 0 50 62" stroke="#222" stroke-width="9" fill="none"/><rect x="24" y="1070" width="14" height="34" rx="6" fill="#222"/><rect x="126" y="1070" width="14" height="34" rx="6" fill="#222"/>`;
  if (m === 0 || m === 4) {   // filming with a phone held up high
    const fl = Math.floor(t * 3 + i) % 4 === 0 || REACT > 0.3;
    s += `<path d="M104 1170 Q150 1160 148 1100" fill="none" stroke="${col}" stroke-width="30" stroke-linecap="round"/><g transform="translate(150 1070) rotate(-8)"><rect x="-17" y="-50" width="34" height="60" rx="7" fill="#111" stroke="#555" stroke-width="3"/><rect x="-13" y="-45" width="26" height="50" rx="4" fill="${fl ? '#fff' : '#bdeeff'}"/></g>`;
  } else s += `<path d="M100 1190 Q132 1250 100 1300" fill="none" stroke="${col}" stroke-width="30" stroke-linecap="round"/>`;
  s += `<rect x="-4" y="1380" width="176" height="64" rx="22" fill="#2a4f8a" stroke="${R}" stroke-width="5"/>`;     // cushion
  return s + `</g>`;
}
function cabinBG(t) {
  const W0 = -1400, W1 = 5200;
  let o = `<rect x="${W0}" y="-3000" width="${W1 - W0}" height="3700" fill="#a9b4bf"/><rect x="${W0}" y="380" width="${W1 - W0}" height="40" fill="#f4f7fa" opacity="0.9"/><rect x="${W0}" y="440" width="${W1 - W0}" height="6" fill="#8a96a3"/>`;
  for (let x = -1300; x < 5000; x += 300) o += `<rect x="${x}" y="150" width="6" height="400" fill="#8a96a3" opacity="0.5"/>`;                                       // ceiling mass
  o += `<rect x="${W0}" y="560" width="${W1 - W0}" height="160" fill="#a6b0ba"/>`;
  o += `<rect x="${W0}" y="700" width="${W1 - W0}" height="190" rx="30" fill="#eceff1" stroke="${R}" stroke-width="6"/>`;      // overhead bins
  for (let x = -800; x < 4800; x += 420) o += `<path d="M${x} 704 V886" stroke="#b7c0c8" stroke-width="5"/><rect x="${x + 150}" y="840" width="120" height="22" rx="11" fill="#cfd8dc" stroke="${R}" stroke-width="3"/>`;
  o += `<rect x="${W0}" y="890" width="${W1 - W0}" height="84" fill="#d9dfe5"/><rect x="${W0}" y="968" width="${W1 - W0}" height="8" fill="#9aa5b1"/>`;
  o += `<rect x="${W0}" y="976" width="${W1 - W0}" height="560" fill="#e8edf1"/>`;                                          // side wall
  o += `<rect x="${W0}" y="1470" width="${W1 - W0}" height="30" fill="#aab4be" stroke="${R}" stroke-width="4"/>`;
  // windows with scrolling clouds
  for (let i = 0; i < ROWS; i++) {
    const wx = X0 + i * PITCH + 70;
    o += `<g transform="translate(${wx} 1130)"><rect x="-62" y="-122" width="124" height="214" rx="56" fill="#cfd8dc" stroke="${R}" stroke-width="6"/><clipPath id="wc${i}"><rect x="-48" y="-108" width="96" height="186" rx="44"/></clipPath><g clip-path="url(#wc${i})"><rect x="-60" y="-120" width="120" height="210" fill="url(#skW)"/>
      <ellipse cx="${f2(mod(-t * 70 + i * 90, 260) - 100)}" cy="${-20 + (i % 3) * 26}" rx="50" ry="16" fill="#fff" opacity="0.85"/><ellipse cx="${f2(mod(-t * 40 + i * 140, 240) - 90)}" cy="${40 - (i % 2) * 24}" rx="38" ry="12" fill="#fff" opacity="0.7"/></g>
      <rect x="-48" y="-108" width="96" height="${i % 2 ? 70 : 34}" rx="30" fill="#f4f6f8" opacity="0.9"/></g>`;
  }
  // vents (gaspers) with air streaming out
  for (let i = 0; i < ROWS + 6; i++) {
    const vx = X0 + i * PITCH + 70 - 400;
    o += `<g transform="translate(${vx} 932)"><circle r="22" fill="#9aa5b1" stroke="${R}" stroke-width="5"/><circle r="9" fill="#3b4452"/>${[0, 1, 2].map(k => { const ph = mod(t * 1.6 + k / 3 + i * 0.2, 1); return `<path d="M${-12 + k * 12} ${24 + ph * 30} q4 12 -2 24" fill="none" stroke="#bfe3f5" stroke-width="5" stroke-linecap="round" opacity="${f2(0.7 * (1 - ph))}"/>`; }).join('')}</g>`;
  }
  o += duck(560, 700, 0.55);
  // floor (carpet + aisle lights)
  o += `<rect x="${W0}" y="1500" width="${W1 - W0}" height="2400" fill="#3a4a66"/><rect x="${W0}" y="1500" width="${W1 - W0}" height="22" fill="#2a3750"/>`;
  for (let x = W0; x < W1; x += 120) o += `<path d="M${x} 1560 l60 40 l-60 40 l-60 -40z" fill="none" stroke="#4d6286" stroke-width="5" opacity="0.8"/>`;
  for (let x = W0; x < W1; x += 150) o += `<rect x="${x}" y="1494" width="46" height="8" rx="4" fill="#ffd27a" opacity="0.9"/>`;
  return o;
}
function seatsLayer(t) { let o = ''; for (let i = 0; i < ROWS; i++) o += seatPax(X0 + i * PITCH, i, t, i * 2 + (i % 3)); return o; }
function galleyLayer(t) {
  const gx = 2180; let o = `<rect x="${gx}" y="976" width="880" height="526" fill="#cfd6dd" stroke="${R}" stroke-width="6"/>`;
  for (let k = 0; k < 4; k++) for (let r = 0; r < 2; r++) o += `<rect x="${gx + 30 + k * 205}" y="${1010 + r * 230}" width="180" height="200" rx="8" fill="#e2e8ed" stroke="${R}" stroke-width="4"/><rect x="${gx + 90 + k * 205}" y="${1090 + r * 230}" width="60" height="12" rx="6" fill="#8d99a5"/>`;
  o += `<rect x="${gx + 640}" y="1140" width="180" height="160" rx="10" fill="#3b4452" stroke="${R}" stroke-width="5"/><circle cx="${gx + 730}" cy="1220" r="46" fill="#9aa5b1" stroke="${R}" stroke-width="5"/><rect x="${gx + 700}" y="1118" width="60" height="24" fill="#e63946" stroke="${R}" stroke-width="4"/>`;     // coffee machine
  o += `<g transform="translate(${gx + 330} 1500)"><rect x="-120" y="-250" width="240" height="220" rx="10" fill="#aeb8c2" stroke="${R}" stroke-width="6"/>${[0, 1, 2].map(r => `<rect x="-100" y="${-232 + r * 64}" width="200" height="50" rx="6" fill="#c9d1d9" stroke="${R}" stroke-width="3"/>`).join('')}<circle cx="-80" cy="-14" r="20" fill="#222" stroke="${R}" stroke-width="4"/><circle cx="80" cy="-14" r="20" fill="#222" stroke="${R}" stroke-width="4"/>${duck(40, -256, 0.5)}</g>`;     // trolley
  o += `<path d="M${gx + 870} 976 V1500" stroke="#7c6bd0" stroke-width="40" opacity="0.9"/><path d="M${gx + 850} 976 q40 260 0 524 M${gx + 890} 976 q30 260 -10 524" fill="none" stroke="#5a49b0" stroke-width="10"/>`;   // curtain
  return o;
}
function cockpitLayer(t) {
  const cx0 = 3160; let o = `<rect x="${cx0 - 140}" y="976" width="700" height="526" fill="#d9dfe5"/>`;
  o += `<rect x="${cx0}" y="1000" width="260" height="500" rx="10" fill="#b9a68a" stroke="${R}" stroke-width="8"/><rect x="${cx0 + 22}" y="1022" width="216" height="456" rx="6" fill="#c9b79b" stroke="${R}" stroke-width="4"/>
        <circle cx="${cx0 + 130}" cy="1130" r="26" fill="#3b4452" stroke="${R}" stroke-width="6"/><circle cx="${cx0 + 130}" cy="1130" r="10" fill="#bde0fe"/>
        <rect x="${cx0 - 70}" y="1190" width="52" height="80" rx="8" fill="#3b4452" stroke="${R}" stroke-width="5"/>${[0, 1, 2].map(r => [0, 1].map(c => `<circle cx="${cx0 - 56 + c * 22}" cy="${1208 + r * 22}" r="6" fill="#9ad1a0"/>`).join('')).join('')}
        <rect x="${cx0 + 40}" y="1260" width="180" height="48" rx="6" fill="#e63946" stroke="${R}" stroke-width="4"/><path d="M${cx0 + 62} 1284 h136" stroke="#fff" stroke-width="8" stroke-linecap="round"/>`;
  o += `<g transform="translate(${cx0 + 130} 884)"><rect x="-120" y="-30" width="240" height="60" rx="10" fill="#fff" stroke="${R}" stroke-width="5"/><circle cx="-60" cy="0" r="16" fill="${Math.floor(t * 1.5) % 2 ? '#ffb703' : '#c98a0a'}"/><path d="M-20 0 h80 M20 -12 v24" stroke="${R}" stroke-width="6"/></g>`;     // fasten seatbelt light
  o += duck(cx0 + 232, 994, 0.5);
  return o;
}

// ---- foreground: seat backs with passengers filming over the shoulders, galley counter, crew panel -------------
function fgPax(x, i, t) {
  const k = i % 4, hair = ['#2b2118', '#5a3825', '#111', '#c9a227', '#7a4b2a'][(i * 3) % 5], col = ['#2f5d9f', '#2a4f8a'][i % 2];
  const bob = REACT * (8 + (i % 3) * 5), fl = Math.floor(t * 3 + i) % 4 === 0 || REACT > 0.3;
  let o = `<g transform="translate(${x} ${-bob})"><rect x="6" y="1290" width="170" height="360" rx="30" fill="${col}" stroke="${R}" stroke-width="6"/><rect x="26" y="1232" width="130" height="90" rx="30" fill="#3d73c0" stroke="${R}" stroke-width="6"/>`;
  o += `<ellipse cx="91" cy="1226" rx="52" ry="58" fill="${hair}" stroke="${R}" stroke-width="5"/>`;
  if (k === 0 || k === 2) o += `<path d="M150 1330 Q190 1290 184 1200" fill="none" stroke="#111" stroke-width="40" stroke-linecap="round"/><path d="M150 1330 Q190 1290 184 1200" fill="none" stroke="${col}" stroke-width="32" stroke-linecap="round"/><circle cx="184" cy="1190" r="19" fill="#c68642" stroke="${R}" stroke-width="4"/><g transform="translate(186 1140) rotate(8)"><rect x="-22" y="-62" width="44" height="76" rx="8" fill="#111" stroke="#555" stroke-width="3"/><rect x="-17" y="-56" width="34" height="64" rx="5" fill="${fl ? '#fff' : '#bdeeff'}"/></g>`;   // phone up, filming
  if (k === 1) o += `<path d="M44 1226 q-4 -66 48 -64 q50 -2 46 64" fill="none" stroke="#222" stroke-width="10"/><rect x="34" y="1206" width="18" height="40" rx="7" fill="#222"/><rect x="132" y="1206" width="18" height="40" rx="7" fill="#222"/>`;
  if (k === 3) o += `<path d="M30 1330 Q-10 1290 -4 1210" fill="none" stroke="#111" stroke-width="40" stroke-linecap="round"/><path d="M30 1330 Q-10 1290 -4 1210" fill="none" stroke="${col}" stroke-width="32" stroke-linecap="round"/><circle cx="-4" cy="1196" r="22" fill="#e0ac69" stroke="${R}" stroke-width="4"/>`;   // waving / pointing
  return o + `</g>`;
}
function fgLayer(t) {
  let o = ''; for (let i = 0; i < ROWS; i++) o += fgPax(X0 + i * 190 - 20, i, t);
  // galley counter
  o += `<g><rect x="2100" y="1290" width="980" height="360" rx="14" fill="#c9d1d9" stroke="${R}" stroke-width="7"/><rect x="2100" y="1270" width="980" height="36" rx="10" fill="#e8edf1" stroke="${R}" stroke-width="6"/>${[0, 1, 2, 3].map(k => `<rect x="${2140 + k * 235}" y="1340" width="200" height="130" rx="8" fill="#aeb8c2" stroke="${R}" stroke-width="4"/><rect x="${2200 + k * 235}" y="1390" width="80" height="14" rx="7" fill="#7d8894"/>`).join('')}
        <g transform="translate(2300 1270)"><rect x="-18" y="-52" width="36" height="52" rx="6" fill="#fff" stroke="${R}" stroke-width="4"/><rect x="-14" y="-42" width="28" height="8" fill="#e63946"/></g><g transform="translate(2420 1270)"><path d="M-30 0 l8 -70 h44 l8 70z" fill="#9aa5b1" stroke="${R}" stroke-width="5"/><path d="M30 -50 q34 8 0 30" fill="none" stroke="${R}" stroke-width="6"/></g></g>`;
  // crew locker / jump-seat panel by the cockpit door
  o += `<g><rect x="3080" y="1290" width="800" height="360" rx="14" fill="#9fa9b3" stroke="${R}" stroke-width="7"/><rect x="3110" y="1250" width="180" height="130" rx="20" fill="#c14a4a" stroke="${R}" stroke-width="6"/><path d="M3130 1290 Q3200 1330 3270 1290" fill="none" stroke="#f1f1f1" stroke-width="10" stroke-linecap="round"/><rect x="3330" y="1340" width="480" height="150" rx="8" fill="#b7c0c9" stroke="${R}" stroke-width="4"/></g>`;
  return o;
}
function reactAt(t) { let r = 0; const pts = STAMPS.map(s => s.t).concat([C.W12.start, endT('W16') + 0.2]); pts.forEach(p => { const a = t - p; if (a > 0 && a < 1.2) r = Math.max(r, Math.exp(-a * 4) * Math.abs(Math.cos(a * 13))); }); return r; }

// ---- shot table -----------------------------------------------------------------------------------
const SHOTS = [];
function shot(id, opt, fn) { SHOTS.push(Object.assign({ id, fn }, opt || {})); }
const GX = { O: 980, S: 1160, W: 1340 };
function chars(t, o) {   // o: { O:{x,ov,st,lean,k}, W:{...}, S:{P,flip}, plane:{who,hand,rot} }
  let s = ''; const out = [];
  const order = o.order || ['O', 'W'];
  const hk = 0.52;
  for (const who of ['O', 'W']) { const c = o[who]; if (!c) continue; out.push(shadow(c.x, FY, hk) + figW(t, who, c.st, c.ov, c.x, FY, hk, c.lean || 0)); }
  if (o.S) out.push(shadow(o.S.P.x, o.S.P.y, SCK * 1.22) + figS(t, o.S.P, SCK, o.S.flip));
  return out.join('') + (o.plane ? (() => { const c = o[o.plane.who], h = hand(c.x, FY, hk, o.plane.local[0], o.plane.local[1]); return modelPlane(h[0], h[1] - 30, 0.9, o.plane.rot); })() : '');
}
const idleOv = () => ({ L: [X - 165, 1230], R: [X + 165, 1230] });
function openingPose(t) {
  const aO = amp('O', t), aW = amp('W', t);
  const fO = flail(t, 0.4 + aO * 0.6, 0), fW = flail(t, 0.3 + aW * 0.6, 2);
  const ovO = { L: fO.L, R: [X + 190, 480 + Math.sin(t * 9) * 30], sway: Math.sin(t * 8) * 12 };         // model plane raised at the vents
  const ovW = { L: [X - 120, 700 + Math.sin(t * 10) * 30], R: fW.R, sway: Math.sin(t * 9) * 12 };          // pointing furiously at the cockpit
  ovW.L = [X + 330, 880 + Math.sin(t * 10) * 24];                                                          // arm out toward the cockpit (screen right)
  return { O: { x: GX.O, ov: ovO, st: wHeadSt(t, 0.6, { lookX: -10, lookY: -40, rot: -3 }) }, W: { x: GX.W, ov: ovW, st: wHeadSt(t, 0.6, { lookX: 24, lookY: -4, rot: 3 }) },
    plane: { who: 'O', local: ovO.R, rot: -12 + Math.sin(t * 9) * 10 } };
}
function scoutAt(t, x, extra) { const P = baseP(); P.x = x; P.y = FY; Object.assign(P, extra || {}); return { P }; }
const TOP = { cy: 1050 };

shot('W1', {}, (t, u) => { const o = openingPose(t); o.S = scoutAt(t, GX.S, { brow: 8, lid: 6 });
  return { cam: { cx: lerp(1160, 1160, u), cy: lerp(1120, 1090, u), z: lerp(0.62, 1.0, ease(u)) }, o }; });
shot('W2', {}, (t, u) => { const o = openingPose(t); o.S = scoutAt(t, GX.S, { micRot: 80 }); o.S.flip = true;
  return { cam: { cx: 1150, cy: 1060, z: lerp(1.35, 1.5, u), roll: lerp(0, -2, u) }, o }; });
shot('W3', {}, (t, u) => { const o = openingPose(t); o.W.st = wHeadSt(t, 0.6, { lookX: -26, lookY: 4, rot: 4 }); o.S = scoutAt(t, GX.S);
  return { cam: { cx: GX.W - 10, cy: 840, z: lerp(2.0, 2.3, u), roll: lerp(2, 4, u) }, o }; });
shot('W4', {}, (t, u) => { const o = openingPose(t); o.S = scoutAt(t, GX.S);
  return { cam: { cx: GX.O + 10, cy: 840, z: lerp(2.3, 2.5, u), roll: -3 }, o }; });
shot('W5', {}, (t, u) => { const o = openingPose(t), a = amp('W', t);
  o.W.x = GX.W - 120 + Math.sin(t * 7) * 14; o.W.ov = { L: [X - 220, 930], R: [X - 60, 800 + Math.sin(t * 16) * 40], sway: 14 };   // Wilbur's finger in Orville's face
  o.O.x = GX.O - 40 - 30 * Math.sin(t * 5); o.O.ov = { L: [X - 200, 1040], R: [X + 190, 760], sway: -10 };
  o.plane = { who: 'O', local: o.O.ov.R, rot: -16 }; o.S = scoutAt(t, GX.S);
  return { cam: { cx: 1120, cy: 1050, z: lerp(1.25, 1.4, u), roll: lerp(-2, 2, u) }, o }; });
shot('W6', {}, (t, u) => { const o = openingPose(t); o.S = scoutAt(t, GX.S, { brow: 0, lid: 6, eyeY: -2, tilt: 3 });
  return { cam: { cx: GX.S + 30, cy: 1010, z: lerp(1.8, 2.0, u), roll: 3 }, o }; });
// W7: no walking; Orville measures 120 feet with his arms spread wide while the others lean in
shot('W7', {}, (t, u) => { const a = amp('O', t), q = (t - C.W7.start), span = 240 + 140 * Math.abs(Math.sin(q * 1.6));
  const ovO = { L: [X - span - 60, 1010 - 60 * Math.sin(q * 3.2)], R: [X + span + 60, 1010 + 60 * Math.sin(q * 3.2)], sway: Math.sin(q * 6) * 10 };
  const ovW = { L: [X + 300, 900 + Math.sin(t * 10) * 30], R: [X + 170, 1120], sway: 6 };
  const o = { O: { x: 1280, ov: ovO, st: wHeadSt(t, 0.6, { lookX: 20, lookY: -10, rot: Math.sin(q * 3) * 3 }) }, W: { x: 1560, ov: ovW, st: wHeadSt(t, 0.6, { lookX: -18, lookY: 0, rot: 2 }) }, S: scoutAt(t, 1070, { brow: 6 }) };
  o.plane = { who: 'O', local: ovO.R, rot: -8 + Math.sin(q * 3) * 8 };
  return { cam: { cx: lerp(1300, 1360, u), cy: 1010, z: lerp(1.2, 1.5, ease(u)), roll: lerp(-2, 2, u) }, o }; });
shot('W8', {}, (t, u) => { const aW = amp('W', t), tilt = Math.sin((t - C.W8.start) * 4) * 26;
  const o = { W: { x: 1780, ov: { L: [X - 90, 760], R: [X + 130, 720 + Math.sin(t * 6) * 18], sway: Math.sin(t * 6) * 8 }, st: wHeadSt(t, 0.6, { lookX: 16, lookY: -24, rot: 3 }) },
              O: { x: 1990 + Math.sin(t * 5) * 14, ov: { L: [X - 250, 840 + Math.sin(t * 12) * 40], R: [X - 150, 1000], sway: 8 }, st: wHeadSt(t, 0.6, { lookX: -20, lookY: -10, rot: -3 }) } };
  o.plane = { who: 'W', local: o.W.ov.R, rot: tilt }; o.S = scoutAt(t, 1560);
  return { cam: { cx: 1800, cy: 1020, z: lerp(1.45, 1.6, u), roll: lerp(0, 3, u) }, o }; });
shot('W9', {}, (t, u) => { const aO = amp('O', t);
  const o = { O: { x: 1990, ov: { L: [X - 250, 1060], R: [X - 330, 900 + Math.sin(t * 14) * 20], sway: 10 }, st: wHeadSt(t, 0.6, { lookX: -34, lookY: 6, rot: -4 }) },
              W: { x: 1780, ov: idleOv(), st: wHeadSt(t, 0.6, { lookX: 20, lookY: 4, rot: 2, shock: 0.6 }) } };
  o.S = scoutAt(t, 1560);
  return { cam: { cx: 1950, cy: 850, z: lerp(2.1, 2.35, u), roll: lerp(-3, 1, u) }, o }; });
// W10: we cut to the galley; everyone is already there (no walking)
shot('W10', { whip: true }, (t, u) => { const aW = amp('W', t), aO = amp('O', t);
  const fW = flail(t, 0.6, 1), fO = flail(t, 0.6, 3);
  const o = { S: scoutAt(t, 2650, { brow: 4 }), W: { x: 2420, ov: { L: fW.L, R: [X + 180, 1000], sway: Math.sin(t * 8) * 10 }, st: wHeadSt(t, 0.6, { lookX: 20, lookY: 0, rot: 2 }) }, O: { x: 2180, ov: { L: [X - 180, 980], R: fO.R, sway: Math.sin(t * 7) * 10 }, st: wHeadSt(t, 0.6, { lookX: 20, lookY: -4, rot: -2 }) } };
  return { cam: { cx: lerp(2380, 2450, u), cy: 1050, z: lerp(1.4, 1.2, u), roll: 1 }, o, att: true }; });
// W11: at the cockpit door; Scout points; both brothers freeze mid-rant
shot('W11', { whip: true }, (t, u) => { const P = baseP(); P.x = 3040; P.fh = [-95, -230]; P.mh = [320, -420]; P.micRot = 85;
  const frz = { L: [X - 200, 760], R: [X + 190, 700], sway: 0 };
  const o = { S: { P }, W: { x: 2830, ov: { L: [X - 150, 760], R: [X + 230, 880] }, st: wHeadSt(t, 0.6, { lookX: 20, lookY: 0, rot: 0, shock: 0.4 }) }, O: { x: 2600, ov: frz, st: wHeadSt(t, 0.6, { lookX: 20, lookY: -4, rot: 0, shock: 0.4 }) } };
  return { cam: { cx: 2960, cy: 1060, z: lerp(1.05, 1.18, u) }, o }; });
shot('W12', {}, (t, u) => { const o = { W: { x: 2830, ov: { L: [X - 150, 760], R: [X + 230, 880] }, st: wHeadSt(t, 0.6, { lookX: 0, lookY: 0, shock: 1 }) } , O: { x: 2600, ov: { L: [X - 200, 760], R: [X + 190, 700] }, st: wHeadSt(t, 0.6, { lookX: 20 }) } };
  o.S = scoutAt(t, 3040);
  return { cam: { cx: 2830, cy: 1010, z: lerp(2.5, 2.9, u) }, o }; });
shot('W13', {}, (t, u) => { const aO = amp('O', t), x = 3330;
  const ovO = { R: [X + 250, 880 + Math.sin(t * 12) * 14], L: [X + 120, 760 + Math.sin(t * 16) * 18], sway: 6 };
  const o = { O: { x, ov: ovO, st: wHeadSt(t, 0.6, { lookX: 30, lookY: 0, rot: 6, shock: 0.6 }), lean: 8 }, W: { x: 3130, ov: { L: [X - 150, 940], R: [X + 150, 940] }, st: wHeadSt(t, 0.6, { lookX: 20, shock: 0.5 }) } };
  o.S = scoutAt(t, 2940);
  return { cam: { cx: 3200, cy: 1000, z: lerp(1.5, 1.8, u), roll: -2 }, o }; });
shot('W14', {}, (t, u) => { const squat = ease(clamp((t - C.W14.start) / 0.6)), a = amp('W', t), fl = flail(t, 0.8, 4);
  const ovW = { L: fl.L, R: fl.R, fL: [X - 150, 1676], fR: [X + 150, 1676], by: 120 * squat, sway: 0 };
  const o = { W: { x: 3060, ov: ovW, st: wHeadSt(t, 0.6, { lookX: -10, lookY: 4, rot: Math.sin(t * 9) * 4, shock: 0.3 }) }, O: { x: 3350, ov: { L: [X - 150, 1100], R: [X + 150, 1100] }, st: wHeadSt(t, 0.6, { lookX: -20 }) } };
  o.S = scoutAt(t, 2860);
  return { cam: { cx: 3060, cy: 1080, z: lerp(1.4, 1.6, u), roll: 2 }, o }; });
shot('W15', {}, (t, u) => { const o = { W: { x: 3060, ov: idleOv(), st: wHeadSt(t, 0.6, { lookX: -20 }) }, O: { x: 3350, ov: idleOv(), st: wHeadSt(t, 0.6, { lookX: -20 }) } };
  o.S = scoutAt(t, 3190, { brow: 0, lid: 6, tilt: 3 });
  return { cam: { cx: 3200, cy: 1010, z: lerp(1.95, 2.1, u) }, o }; });
shot('W16', {}, (t, u) => { const a = amp('O', t), fl = flail(t, 0.9, 5);
  const o = { O: { x: 3150, ov: { L: fl.L, R: fl.R, sway: Math.sin(t * 9) * 12 }, st: wHeadSt(t, 0.6, { lookX: 0, lookY: -10, rot: Math.sin(t * 5) * 3 }) }, W: { x: 3350, ov: idleOv(), st: wHeadSt(t, 0.6, { lookX: -20, shock: 0.6 }) } };
  o.S = scoutAt(t, 3500);
  return { cam: { cx: 3150, cy: 830, z: lerp(2.0, 2.4, u), roll: lerp(3, -2, u) }, o }; });
// final pull-back: both brothers bicker while the camera reveals the whole cabin
shot('W17', {}, (t, u) => { const q = clamp((t - endT('W16') - 0.05) / 3.0), a = 0.8;
  const f1 = flail(t, 0.9, 1), f2_ = flail(t, 0.9, 4);
  const o = { O: { x: 3110 + Math.sin(t * 4) * 18, ov: { L: f1.L, R: f1.R, sway: Math.sin(t * 8) * 12 }, st: wHeadSt(t, 0.6, { lookX: 20, lookY: -4, rot: -3 }) }, W: { x: 3010 + 150 - Math.sin(t * 4) * 18, ov: { L: f2_.L, R: f2_.R, sway: Math.sin(t * 8 + 2) * 12 }, st: wHeadSt(t, 0.6, { lookX: -20, lookY: -4, rot: 3 }) } };
  o.O.x = 3220 + Math.sin(t * 4) * 16; o.W.x = 3000 - Math.sin(t * 4) * 16; o.S = scoutAt(t, 3110, { brow: 0, lid: 6 });
  return { cam: { cx: lerp(3100, 2900, ease(q)), cy: lerp(1050, 1150, ease(q)), z: lerp(1.7, 0.55, ease(q)), roll: 0 }, o }; });

SHOTS.forEach((s, i) => { s.t0 = i === 0 ? 0 : (s.id === 'W17' ? endT('W16') + 0.05 : C[s.id].start); });
SHOTS.forEach((s, i) => { s.t1 = i < SHOTS.length - 1 ? SHOTS[i + 1].t0 : TL.total; });
const shotIdx = t => { let r = 0; for (let i = 0; i < SHOTS.length; i++) if (t >= SHOTS[i].t0) r = i; return r; };
const STAMPS = [['W3', 'MORON!'], ['W5', 'PIGEON!'], ['W9', 'CHICKEN!'], ['W12', 'AUTO-WHAT?!'], ['W16', 'MORON!']].map(([id, w]) => ({ t: id === 'W12' ? C.W12.start + 0.05 : wtw(id, w), word: w }));
const clampCam = c => ({ z: c.z, roll: c.roll || 0, cx: clamp(c.cx, -500 + 540 / c.z, 3900 - 540 / c.z), cy: clamp(c.cy, 960 / c.z - 900, 2400 - 960 / c.z) });

window.renderFrame = function (frame) {
  const t = frame / FPS; cur = t;
  const svg = document.getElementById('stage');
  REACT = reactAt(t);
  const idx = shotIdx(t), sh = SHOTS[idx], nxt = SHOTS[idx + 1];
  const u = clamp((t - sh.t0) / (sh.t1 - sh.t0)), st = sh.fn(t, u), cam = clampCam(st.cam);
  const punch = 1 + 0.07 * Math.max(0, 1 - (t - sh.t0) / 0.14), z = cam.z * punch;
  const cx = cam.cx + Math.sin(t * 1.3) * 4 + Math.sin(t * 17) * 1.5, cy = cam.cy + Math.cos(t * 1.1) * 3 + Math.cos(t * 13) * 1.5;
  let wOff = 0, wBlur = 0;
  if (sh.whip) { const q = clamp(1 - (t - sh.t0) / 0.26); wOff = q * q * 620; wBlur = q * 34; }
  if (nxt && nxt.whip) { const q = clamp((t - (sh.t1 - 0.12)) / 0.12); wOff = -q * q * 620; wBlur = Math.max(wBlur, q * 30); }
  let s = `<defs>${stk('stF', 0.52 * 0.6 * z * 1.4)}${stk('stS', 1.22 * SCK * z)}<filter id="whipB" x="-20%" y="0" width="140%" height="100%"><feGaussianBlur stdDeviation="${f2(wBlur)} 0"/></filter>
    <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6d4b4"/><stop offset="1" stop-color="#e5ae86"/></linearGradient>
    <linearGradient id="red" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e63946"/><stop offset="1" stop-color="#b3202c"/></linearGradient>
    <linearGradient id="skW" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6fb5ee"/><stop offset="1" stop-color="#cfe9fb"/></linearGradient>
    <radialGradient id="vig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.38"/></radialGradient>
    <radialGradient id="keyL" cx="0.15" cy="0.08" r="0.95"><stop offset="0" stop-color="#ffe2b0" stop-opacity="0.2"/><stop offset="1" stop-color="#ffe2b0" stop-opacity="0"/></radialGradient>
    <linearGradient id="shL" x1="0" y1="0" x2="0" y2="1"><stop offset="0.55" stop-color="#1d2a44" stop-opacity="0"/><stop offset="1" stop-color="#1d2a44" stop-opacity="0.3"/></linearGradient>
    <pattern id="grain" width="128" height="128" patternUnits="userSpaceOnUse"><image href="${GRAIN}" width="128" height="128"/></pattern></defs>`;
  const blur = clamp((z - 1.5) * 4, 0, 6);
  s += `<g transform="translate(${f2(wOff)} 0)" ${wBlur > 0.5 ? 'filter="url(#whipB)"' : ''}><g transform="translate(540 960) rotate(${f2(cam.roll)}) scale(${f2(z)}) translate(${f2(-cx)} ${f2(-cy)})">`;
  s += `<g ${blur > 0.4 ? `style="filter:blur(${f2(blur)}px)"` : ''}>${cabinBG(t)}${seatsLayer(t)}${galleyLayer(t)}${cockpitLayer(t)}</g>`;
  s += chars(t, st.o);
  s += fgLayer(t);
  s += `</g></g>`;
  const th = t - C.W12.start; if (th >= 0 && th < 0.16) s += `<rect width="1080" height="1920" fill="#fff" opacity="${f2(0.45 * (1 - th / 0.16))}"/>`;
  s += `<rect width="1080" height="1920" fill="url(#keyL)"/><rect width="1080" height="1920" fill="url(#shL)"/><rect width="1080" height="1920" fill="#ff9d4d" opacity="0.06" style="mix-blend-mode:soft-light"/><rect width="1080" height="1920" fill="url(#vig)"/><rect width="1080" height="1920" fill="url(#grain)" opacity="0.10" style="mix-blend-mode:multiply"/>`;
  for (let i = 0; i < (window.THUMB ? 0 : STAMPS.length); i++) {
    const a = t - STAMPS[i].t;
    if (a >= 0 && a < 0.65) {
      const k = Math.min(1, a / 0.1), fade = a > 0.45 ? 1 - (a - 0.45) / 0.2 : 1, sc = 1.5 - 0.5 * ease(k), fs = Math.min(150, Math.floor(980 / (STAMPS[i].word.length * 0.72)));
      s += `<g transform="translate(540 590) rotate(${i % 2 ? 5 : -5}) scale(${f2(sc)})" opacity="${f2(fade)}"><text text-anchor="middle" font-size="${fs}" fill="#e63946" stroke="#fffdf5" stroke-width="22" paint-order="stroke" stroke-linejoin="round">${STAMPS[i].word}</text><text text-anchor="middle" font-size="${fs}" fill="#e63946">${STAMPS[i].word}</text></g>`;
    }
  }
  const cap = window.THUMB ? null : captionFor(t);
  if (cap) {
    const sc = 1 + (1 - cap.pop) * 0.12, fs = Math.min(92, Math.floor(920 / (cap.text.length * 0.66))), wbar = Math.min(1040, cap.text.length * fs * 0.64 + 60);
    const bar = cap.spk === 'O' ? '#ffe14a' : (cap.spk === 'W' ? '#ffb3a7' : '#ffffff');
    s += `<g transform="translate(540 255) scale(${f2(sc)}) rotate(${cap.spk === 'S' ? 0.8 : -1.2})"><rect x="${-wbar / 2 + 8}" y="${-fs * 0.95 + 10}" width="${wbar}" height="${fs * 1.25}" rx="10" fill="#000" opacity="0.28"/><rect x="${-wbar / 2}" y="${-fs * 0.95}" width="${wbar}" height="${fs * 1.25}" rx="10" fill="${bar}" stroke="#1b1b22" stroke-width="6"/><text x="0" y="0" text-anchor="middle" font-size="${fs}" fill="#1b1b22">${cap.text.replace(/&/g, '&amp;')}</text></g>`;
  }
  if (window.THUMB) { svg.innerHTML = s + `<text x="540" y="330" text-anchor="middle" font-size="190" fill="#e63946" stroke="#fffdf5" stroke-width="34" paint-order="stroke" stroke-linejoin="round" transform="rotate(-5 540 330)">AUTO-</text><text x="540" y="520" text-anchor="middle" font-size="190" fill="#e63946" stroke="#fffdf5" stroke-width="34" paint-order="stroke" stroke-linejoin="round" transform="rotate(-5 540 520)">WHAT?!</text>`; return; }
  s += `<rect x="30" y="52" width="400" height="56" rx="8" fill="#111"/><text x="46" y="92" font-size="32" fill="#fff" letter-spacing="6">SURVIVAL UNTOLD</text>`;
  if (t < 3.6) s += `<text x="46" y="148" font-size="28" fill="#1b1b22" stroke="#fffdf5" stroke-width="6" paint-order="stroke" style="font-weight:800">GENIUSES GONE MAD · EPISODE 4</text>`;
  const qe = clamp((t - endT('W16') - 0.7) / 0.4);
  if (qe > 0) s += `<g opacity="${f2(qe)}"><rect x="110" y="1530" width="860" height="210" rx="16" fill="#111" opacity="0.84"/><text x="540" y="1612" text-anchor="middle" font-size="70" fill="#ffd23f">WHO SHOULD SCOUT</text><text x="540" y="1696" text-anchor="middle" font-size="70" fill="#ffd23f">INTERVIEW NEXT?</text></g>`;
  s += `<text x="46" y="1892" font-size="26" fill="#fffdf5" stroke="#1b1b22" stroke-width="6" paint-order="stroke" style="font-weight:800" opacity="${(t < 3.6 || qe > 0) ? 1 : 0}">AI-generated fictional historical comedy.</text>`;
  svg.innerHTML = s;
};
renderFrame(0);
