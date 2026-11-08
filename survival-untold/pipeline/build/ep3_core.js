// ===================== EPISODE 3: CORE (helpers, characters, props) ==========================
let STK = 'stF';
function mod(a, n) { return ((a % n) + n) % n; }
function rnd(i) { return mod(Math.sin(i * 127.1 + 311.7) * 43758.5453, 1); }
function wtw(id, word) {
  const c = C[id], words = c.text.split(' '), w = words.map(x => x.length + 2), tot = w.reduce((a, b) => a + b, 0);
  let acc = 0; for (let i = 0; i < words.length; i++) { if (words[i] === word) return c.start + c.dur * acc / tot; acc += w[i]; }
  return c.start;
}
function stk(id, k) {
  const r1 = (6 / k).toFixed(1), r2 = (10 / k).toFixed(1), dx = (6 / k).toFixed(1), dy = (10 / k).toFixed(1), sd = (6 / k).toFixed(1);
  return `<filter id="${id}" x="-15%" y="-15%" width="130%" height="130%" color-interpolation-filters="sRGB">
  <feMorphology in="SourceAlpha" operator="dilate" radius="${r1}" result="d"/><feFlood flood-color="#fffdf5"/><feComposite in2="d" operator="in" result="w"/>
  <feMorphology in="SourceAlpha" operator="dilate" radius="${r2}" result="d2"/><feFlood flood-color="#1b1b22"/><feComposite in2="d2" operator="in" result="k"/>
  <feOffset in="k" dx="${dx}" dy="${dy}" result="sh"/><feGaussianBlur in="sh" stdDeviation="${sd}" result="shb"/>
  <feColorMatrix in="shb" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.3 0"/>
  <feMerge><feMergeNode/><feMergeNode in="k"/><feMergeNode in="w"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
}
function placeG(px, py, k, inner, extra) { return `<g transform="translate(${f2(px)} ${f2(py)}) scale(${f2(k)}) ${extra || ''} translate(-540 -1676)">${inner}</g>`; }
const hand = (px, py, k, hx, hy) => [px + (hx - 540) * k, py + (hy - 1676) * k];   // figure-local point -> world

// ---- Franklin's head: bald dome, long gray hair, round spectacles ---------------------------
function franklin(t, st) {
  const o = openness('E', t), shout = clamp(o * 1.5), sp = speaking('E');
  const shake = sp ? Math.sin(t * 80) * 4 * shout : 0;
  const sc = st.scale * (1 + 0.03 * o);
  const lx = st.lookX, ly = st.lookY;
  const browA = 8 + shout * 18 + (st.sad ? -14 : 0);
  const mh = 10 + o * 205, mw = 125 + o * 95;
  let s = `<g transform="translate(${540 + shake} ${st.cy + (sp ? Math.sin(t * 61) * 3 * shout : 0)}) scale(${f2(sc)}) rotate(${f2(st.rot)})">`;
  s += `<path d="M-250 -150 Q-345 60 -312 335 Q-250 305 -240 200 Q-200 20 -210 -120z M250 -150 Q345 60 312 335 Q250 305 240 200 Q200 20 210 -120z" fill="#dcdce2" stroke="#000" stroke-width="12" stroke-linejoin="round"/>`;
  s += `<ellipse cx="-288" cy="10" rx="40" ry="68" fill="#e3ad84" stroke="#000" stroke-width="13"/><ellipse cx="288" cy="10" rx="40" ry="68" fill="#e3ad84" stroke="#000" stroke-width="13"/>`;
  s += `<ellipse cx="0" cy="0" rx="292" ry="385" fill="url(#skin)" stroke="#000" stroke-width="18"/>`;
  s += `<ellipse cx="-80" cy="-250" rx="112" ry="44" fill="#fff" opacity="0.24" transform="rotate(-16 -80 -250)"/>`;
  s += `<path d="M-286 -110 Q-304 -20 -272 100 M286 -110 Q304 -20 272 100" fill="none" stroke="#c9c9d1" stroke-width="24" stroke-linecap="round"/>`;
  s += `<path d="M-120 -300 Q0 -332 120 -300 M-100 -262 Q0 -288 100 -262" fill="none" stroke="#c28a68" stroke-width="7" stroke-linecap="round" opacity="0.7"/>`;
  s += `<ellipse cx="-200" cy="110" rx="62" ry="40" fill="#ff9a8a" opacity="0.55"/><ellipse cx="200" cy="110" rx="62" ry="40" fill="#ff9a8a" opacity="0.55"/>`;
  for (const sx of [-108, 108]) {
    s += `<ellipse cx="${sx}" cy="-60" rx="76" ry="88" fill="#fff" stroke="#000" stroke-width="12"/>`;
    if (shout > 0.55) s += `<path d="M${sx - 60} -60 q24 10 40 -16 M${sx + 60} -60 q-24 10 -40 -16" fill="none" stroke="#e44" stroke-width="3" opacity="0.75"/>`;
    s += `<circle cx="${sx + lx * 0.9}" cy="${-52 + ly * 0.9}" r="32" fill="#1c1c1c"/><circle cx="${sx + lx * 0.9 - 10}" cy="${-66 + ly * 0.9}" r="11" fill="#fff"/>`;
    if (!st.noGlasses) s += `<circle cx="${sx}" cy="-60" r="100" fill="#bde0fe" opacity="0.3" stroke="#d4a017" stroke-width="13"/>`;
  }
  if (!st.noGlasses) s += `<path d="M-8 -68 Q0 -88 8 -68" fill="none" stroke="#d4a017" stroke-width="12"/><path d="M-208 -70 L-286 -58 M208 -70 L286 -58" stroke="#d4a017" stroke-width="10"/>`;
  s += `<path d="M-200 ${-190 + browA} Q-105 ${-236} -20 ${-170 - browA * 0.3}" fill="none" stroke="#000" stroke-width="40" stroke-linecap="round"/><path d="M-200 ${-190 + browA} Q-105 ${-236} -20 ${-170 - browA * 0.3}" fill="none" stroke="#f1f1f4" stroke-width="26" stroke-linecap="round"/>
        <path d="M200 ${-190 + browA} Q105 ${-236} 20 ${-170 - browA * 0.3}" fill="none" stroke="#000" stroke-width="40" stroke-linecap="round"/><path d="M200 ${-190 + browA} Q105 ${-236} 20 ${-170 - browA * 0.3}" fill="none" stroke="#f1f1f4" stroke-width="26" stroke-linecap="round"/>`;
  s += `<ellipse cx="0" cy="52" rx="62" ry="56" fill="#e0a07a" stroke="#000" stroke-width="12"/>`;
  s += `<g transform="translate(0 ${165 + o * 18})"><ellipse cx="0" cy="${mh / 2}" rx="${mw}" ry="${mh / 2 + 8}" fill="#4a0a10" stroke="#000" stroke-width="12"/>
        <rect x="${-mw * 0.62}" y="0" width="${mw * 1.24}" height="${Math.min(34, mh * 0.35)}" rx="8" fill="#fff" opacity="${o > 0.12 ? 1 : 0}"/>
        <ellipse cx="0" cy="${mh * 0.82}" rx="${mw * 0.55}" ry="${Math.max(6, mh * 0.2)}" fill="#e0606c" opacity="${o > 0.25 ? 1 : 0}"/></g>`;
  s += `<path d="M-170 335 Q0 408 170 335" fill="none" stroke="#c28a68" stroke-width="9" stroke-linecap="round"/>`;
  return s + `</g>`;
}

// ---- Franklin's body: colonial coat, jabot, white stockings, buckled shoes -----------------
function franklinBody(t, st, ov) {
  const X = 540, L = ov.L || [X - 165, 1230], R = ov.R || [X + 165, 1230], fL = ov.fL || [X - 112, 1676], fR = ov.fR || [X + 112, 1676], by = ov.by || 0;
  const arm = (sx, h) => { const ex = (sx + h[0]) / 2 + (sx < X ? -26 : 26), ey = (1010 + h[1]) / 2 + 60;
    return `<path d="M${sx} 1010 Q${ex} ${ey} ${h[0]} ${h[1]}" fill="none" stroke="#2a5d9f" stroke-width="40" stroke-linecap="round"/><circle cx="${h[0]}" cy="${h[1]}" r="34" fill="#fff" stroke="#111" stroke-width="5"/><circle cx="${h[0]}" cy="${h[1]}" r="22" fill="#f6d4b4" stroke="#111" stroke-width="4"/>`; };
  let s = `<g filter="url(#${STK})"><g transform="translate(0 ${f2(by)})">`;
  const dirx = ov.dir || 1, sway = ov.sway || 0;
  const leg = (hx, f) => {
    const hy = 1340, dx = f[0] - hx, dy = (f[1] - 14) - hy, dl = Math.max(1, Math.hypot(dx, dy)), dd = Math.min(dl, 352), L1 = 178;
    const hh = Math.sqrt(Math.max(0, L1 * L1 - (dd / 2) * (dd / 2))), ux = dx / dl, uy = dy / dl; let nx = -uy, ny = ux; if (nx * dirx < 0) { nx = -nx; ny = -ny; }
    const kx = hx + ux * dd / 2 + nx * hh, ky = hy + uy * dd / 2 + ny * hh;
    return `<path d="M${hx} ${hy} L${f2(kx)} ${f2(ky)} L${f2(f[0])} ${f2(f[1] - 14)}" fill="none" stroke="#111" stroke-width="46" stroke-linecap="round" stroke-linejoin="round"/><path d="M${hx} ${hy} L${f2(kx)} ${f2(ky)}" stroke="#7b5a3a" stroke-width="38" stroke-linecap="round"/><path d="M${f2(kx)} ${f2(ky)} L${f2(f[0])} ${f2(f[1] - 14)}" stroke="#f8f9fa" stroke-width="32" stroke-linecap="round"/><circle cx="${f2(kx)}" cy="${f2(ky)}" r="19" fill="#e9d8a6"/>
      <ellipse cx="${f2(f[0] + 14 * dirx)}" cy="${f2(f[1] + 6)}" rx="52" ry="21" fill="#111"/><rect x="${f2(f[0] + 14 * dirx + (dirx > 0 ? 10 : -26))}" y="${f2(f[1] - 6)}" width="16" height="18" rx="3" fill="#ffd23f" stroke="#111" stroke-width="3"/>`;
  };
  s += leg(X - 62, fL) + leg(X + 62, fR);
  s += `<path d="M${X - 108} 975 L${X + 108} 975 L${X + 128 + sway} 1400 L${X - 128 + sway} 1400z" fill="#2a5d9f" stroke="#111" stroke-width="9" stroke-linejoin="round"/>
        <rect x="${X - 44}" y="1010" width="88" height="370" fill="#f1e3b5" stroke="#111" stroke-width="5"/>${[0, 1, 2, 3, 4].map(i => `<circle cx="${X}" cy="${1070 + i * 80}" r="9" fill="#ffd23f" stroke="#111" stroke-width="3"/>`).join('')}
        <path d="M${X - 56} 975 q-10 60 4 100 l34 -64z M${X + 56} 975 q10 60 -4 100 l-34 -64z" fill="#fff" stroke="#111" stroke-width="5"/><path d="M${X - 40} 992 l-8 22 l14 -2 l-4 24 l16 -14 l6 20 l8 -22 l10 18 l2 -26 l16 10 l-2 -22 l12 4z" fill="#fff" stroke="#111" stroke-width="3"/>`;
  s += arm(X - 100, L) + arm(X + 100, R);
  return s + `</g></g>`;
}

// ---- passengers -----------------------------------------------------------------------------
const PAXC = ['#e63946', '#ffb703', '#2a9d8f', '#8ecae6', '#9b5de5', '#f4a261', '#06d6a0', '#ef476f', '#118ab2'];
let REACT = 0;
function pax(x, y, k, i, t, mode, vest, wdir) {
  const col = vest ? '#33415c' : PAXC[i % PAXC.length], skin = ['#f1c27d', '#e0ac69', '#a9744f', '#c68642', '#ffdbac'][i % 5], hair = ['#2b2118', '#5a3825', '#111', '#c9a227', '#7a4b2a'][(i * 3) % 5];
  const bob = Math.sin(t * 3 + i) * 2 - REACT * (10 + (i % 3) * 5);
  let s = `<g transform="translate(${f2(x)} ${f2(y + bob)}) scale(${f2(k)}) rotate(${f2(REACT * (i % 2 ? 7 : -7))})">`;
  s += `<ellipse cx="0" cy="2" rx="30" ry="8" fill="#000" opacity="0.16"/>${mode === 'walk' ? `<g transform="translate(-8 -46) rotate(${f2(Math.sin(t * 7 + i) * 26)})"><rect x="-5" y="0" width="11" height="46" fill="#33415c"/></g><g transform="translate(8 -46) rotate(${f2(-Math.sin(t * 7 + i) * 26)})"><rect x="-5" y="0" width="11" height="46" fill="#33415c"/></g>` : `<rect x="-14" y="-46" width="11" height="46" fill="#33415c"/><rect x="3" y="-46" width="11" height="46" fill="#33415c"/>`}`;
  s += `<rect x="-20" y="-112" width="40" height="70" rx="14" fill="${col}" stroke="#1b1b22" stroke-width="3"/>`;
  if (vest) s += `<path d="M-18 -108 L-6 -108 L-10 -48 L-20 -48z M18 -108 L6 -108 L10 -48 L20 -48z" fill="#ff9f1c"/>`;
  if (mode === 'film') s += `<path d="M14 -100 L34 -146" stroke="${col}" stroke-width="9" stroke-linecap="round"/><rect x="26" y="-170" width="16" height="26" rx="3" fill="#222" stroke="#111" stroke-width="2"/><rect x="28" y="-167" width="12" height="20" fill="#9fe7ff"/>${mod(t * 0.63 + i * 0.37, 1) < 0.07 ? `<circle cx="34" cy="-160" r="34" fill="#fff" opacity="0.85"/>` : ''}`;
  else if (mode === 'clap') { const c = Math.abs(Math.sin(t * 16 + i)) * 12; s += `<path d="M-16 -100 L${-4 - c * 0.3} -86" stroke="${col}" stroke-width="9" stroke-linecap="round"/><path d="M16 -100 L${4 + c * 0.3} -86" stroke="${col}" stroke-width="9" stroke-linecap="round"/><circle cx="0" cy="${-90 - c * 0.2}" r="7" fill="${skin}"/>`; }
  else s += `<path d="M-19 -100 L-24 -66 M19 -100 L24 -66" stroke="${col}" stroke-width="9" stroke-linecap="round"/>`;
  s += `<circle cx="0" cy="-130" r="19" fill="${skin}" stroke="#1b1b22" stroke-width="3"/><path d="M-19 -132 a19 19 0 0 1 38 0z" fill="${hair}"/>`;
  if (i % 2 === 0 && mode !== 'clap') s += `<rect x="26" y="-38" width="30" height="38" rx="5" fill="${['#264653', '#e76f51', '#6d597a'][i % 3]}" stroke="#1b1b22" stroke-width="3"/><path d="M34 -38 v-8 h14 v8" fill="none" stroke="#1b1b22" stroke-width="3"/>`;
  return s + `</g>`;
}

// ---- the kite, the key, the ink bottle ------------------------------------------------------
function kiteSvg(x, y, sc, rot) {
  let bows = '';
  for (let i = 0; i < 3; i++) bows += `<path d="M0 ${190 + i * 62} l-24 -14 l0 28z M0 ${190 + i * 62} l24 -14 l0 28z" fill="${i % 2 ? '#ffd23f' : '#fff'}" stroke="#111" stroke-width="5"/>`;
  return `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(rot)}) scale(${f2(sc)})"><path d="M0 130 q30 30 0 60 q-30 30 0 62 q30 30 0 62 q-30 30 0 60" fill="none" stroke="#111" stroke-width="6"/>${bows}
    <path d="M0 -170 L112 -12 L0 140 L-112 -12 Z" fill="#e63946" stroke="#111" stroke-width="9" stroke-linejoin="round"/><path d="M0 -170 L0 140 M-112 -12 L112 -12" stroke="#111" stroke-width="6"/>
    <path d="M0 -170 L56 -91 L0 -12z M0 -12 L-56 64 L0 140z" fill="#a4161a" opacity="0.5"/></g>`;
}
function keySvg(x, y, sc, rot) {
  return `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(rot)}) scale(${f2(sc)})"><circle r="16" fill="none" stroke="#111" stroke-width="12"/><circle r="16" fill="none" stroke="#ffd23f" stroke-width="6"/><rect x="14" y="-5" width="58" height="10" fill="#ffd23f" stroke="#111" stroke-width="3"/><rect x="50" y="4" width="8" height="16" fill="#ffd23f" stroke="#111" stroke-width="3"/><rect x="62" y="4" width="8" height="12" fill="#ffd23f" stroke="#111" stroke-width="3"/></g>`;
}
function bottleSvg(x, y, sc) {
  return `<g transform="translate(${f2(x)} ${f2(y)}) scale(${f2(sc)})"><rect x="-22" y="-94" width="44" height="22" rx="5" fill="#d4a017" stroke="#111" stroke-width="5"/><path d="M-26 -72 h52 v90 q0 14 -14 14 h-24 q-14 0 -14 -14z" fill="#3b2a7a" stroke="#111" stroke-width="5"/><rect x="-22" y="-40" width="44" height="40" rx="4" fill="#fbf4e1" stroke="#111" stroke-width="3"/><text y="-22" text-anchor="middle" font-size="12" fill="#111">EXPERI-</text><text y="-8" text-anchor="middle" font-size="12" fill="#111">MENTAL</text><text y="6" text-anchor="middle" font-size="12" fill="#e63946">INK</text></g>`;
}
function dropShadow(x, y, w, op) { return `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="${f2(w)}" ry="${f2(w * 0.14)}" fill="#000" opacity="${op || 0.2}"/>`; }
