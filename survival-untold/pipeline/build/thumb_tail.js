// ===== THUMBNAIL: "EDISON?! THAT MORON?!" =====
let STK = 'stK';
function mod(a, n) { return ((a % n) + n) % n; }
function stk(id, k) {
  const r1 = (9 / k).toFixed(1), r2 = (14 / k).toFixed(1), dx = (10 / k).toFixed(1), dy = (16 / k).toFixed(1), sd = (6 / k).toFixed(1);
  return `<filter id="${id}" x="-15%" y="-15%" width="130%" height="130%" color-interpolation-filters="sRGB">
  <feMorphology in="SourceAlpha" operator="dilate" radius="${r1}" result="d"/><feFlood flood-color="#fffdf5"/><feComposite in2="d" operator="in" result="w"/>
  <feMorphology in="SourceAlpha" operator="dilate" radius="${r2}" result="d2"/><feFlood flood-color="#111"/><feComposite in2="d2" operator="in" result="k"/>
  <feOffset in="k" dx="${dx}" dy="${dy}" result="sh"/><feGaussianBlur in="sh" stdDeviation="${sd}" result="shb"/>
  <feColorMatrix in="shb" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0"/>
  <feMerge><feMergeNode/><feMergeNode in="k"/><feMergeNode in="w"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
}
function rays(cx, cy, col, op, t, n) {
  let r = ''; n = n || 18;
  for (let i = 0; i < n; i++) { const a0 = (i * 360 / n + t * 4) * Math.PI / 180, a1 = a0 + Math.PI / n * 0.9;
    r += `<path d="M${cx} ${cy} L${(cx + 2400 * Math.cos(a0)).toFixed(0)} ${(cy + 2400 * Math.sin(a0)).toFixed(0)} L${(cx + 2400 * Math.cos(a1)).toFixed(0)} ${(cy + 2400 * Math.sin(a1)).toFixed(0)}z" fill="${col}"/>`; }
  return `<g opacity="${op}">${r}</g>`;
}
window.renderFrame = function () {
  const tL = wt('T1', 'LICENSE?!') + 0.05, tB = wt('T1', 'POTATO') + 0.9;
  cur = tL;
  const st = { cy: 1010, scale: 1.5, rot: -3, lookX: -18, lookY: 22, sad: false, pin: false };
  let s = `<defs>${stk('stK', 1)}${stk('stP', 1)}${stk('stS', 0.85)}<pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="13" cy="13" r="5" fill="#000"/></pattern>
    <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6d4b4"/><stop offset="1" stop-color="#e5ae86"/></linearGradient>
    <linearGradient id="red" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f0443a"/><stop offset="1" stop-color="#b3201c"/></linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffd27a" stop-opacity="0.9"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient></defs>`;
  s += `<rect width="1080" height="1920" fill="#e63946"/>${rays(540, 1000, '#fff', 0.22, 0, 22)}<rect width="1080" height="1920" fill="url(#dots)" opacity="0.1"/>`;
  // lightning behind the head
  s += `<path d="M120 0 L240 300 L160 320 L300 700" fill="none" stroke="#fff" stroke-width="18" stroke-linejoin="round"/><path d="M120 0 L240 300 L160 320 L300 700" fill="none" stroke="#ffd23f" stroke-width="8" stroke-linejoin="round"/><path d="M980 0 L860 340 L930 350 L800 760" fill="none" stroke="#fff" stroke-width="18" stroke-linejoin="round"/><path d="M980 0 L860 340 L930 350 L800 760" fill="none" stroke="#ffd23f" stroke-width="8" stroke-linejoin="round"/>`;
  // Tesla, screaming
  s += `<g filter="url(#stK)">${tesla(tL, st)}</g>`;
  // burnt Edison portrait
  s += `<g filter="url(#stP)"><g transform="translate(20 760) scale(1.25)">${edisonPortrait(tB)}</g></g>`;
  // Scout with the mic, bottom right
  const P = baseP(); P.x = 880; P.y = 1900; P.lean = -4; P.micRot = 40; P.mh = [-150, -330]; P.fh = [110, -220]; P.eyeX = -8; P.lid = 6; P.brow = 8;
  s += `<g filter="url(#stS)" transform="translate(${P.x} ${P.y}) scale(0.85) translate(${-P.x} ${-P.y})">${scout(tL, P)}</g>`;
  s += duck(120, 1860, 1.1, false);
  // text
  s += `<text x="540" y="318" text-anchor="middle" font-size="200" fill="#fff" stroke="#111" stroke-width="34" paint-order="stroke" stroke-linejoin="round" transform="rotate(-3 540 318)">EDISON?!</text>`;
  s += `<g transform="rotate(2 540 1760)"><rect x="40" y="1640" width="1000" height="190" rx="26" fill="#ffd23f" stroke="#111" stroke-width="12"/><text x="540" y="1782" text-anchor="middle" font-size="118" fill="#111">THAT MORON?!</text></g>`;
  s += `<rect x="30" y="52" width="1020" height="62" rx="10" fill="#111"/><text x="540" y="96" text-anchor="middle" font-size="32" fill="#fff" letter-spacing="3">INTERVIEWING HISTORY’S BIGGEST EGOS · EP. 2</text>`;
  document.getElementById('stage').innerHTML = s;
};
renderFrame();
function baseP() {
  return { x: 300, y: 1872, lean: 0, phase: 0, walk: false, tilt: 0, headDy: 0, eyeX: 6, eyeY: 2, lid: 14, brow: 0,
           fh: [-95, -230], mh: [150, -380], micRot: 70, juice: false, file: false, note: false, dangle: false, phone: false };
}
