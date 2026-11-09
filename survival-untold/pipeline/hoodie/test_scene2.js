const SC = 1920 / 1376, IW = 768 * SC, OX = (1080 - IW) / 2;   // images are 768x1376, cover-fit to 1080x1920
const SHOTS = [{ t0: 0, t1: 4.2, env: 'env1.jpg', sx: 300, mode: 'a' }, { t0: 4.2, t1: 8.3, env: 'env2.jpg', sx: 760, mode: 'b' }, { t0: 8.3, t1: 99, env: 'env1.jpg', sx: 330, mode: 'c' }];
const WORDS = (() => { const w = TL.clips[0].text.split(/\s+/), tot = w.reduce((a, b) => a + b.length + 2, 0); let acc = 0; return w.map(x => { const o = { w: x.toUpperCase().replace(/[.,]/g, ''), a: acc / tot * TL.total, b: (acc + x.length + 2) / tot * TL.total }; acc += x.length + 2; return o; }); })();
function baseP() { const P = { x: 300, y: 1900, lean: 0, phase: 0, walk: false, tilt: 0, headDy: 0, eyeX: 6, eyeY: 2, lid: 12, brow: 4, dirx: 1, stride: 42, liftAmt: 30, fh: [-95, -230], mh: [190, -420], micRot: 40, juice: false, file: false, note: false, dangle: false, phone: false, tray: false, vest: false, noMic: false };
  P.fh = [-95 + Math.sin(cur * 4) * 8, -230 + Math.sin(cur * 3) * 8]; P.mh = [185 + Math.sin(cur * 3.5) * 6, -420 + Math.sin(cur * 2.6) * 8]; return P; }
function googly(x, y, r, t, i, panic) { const a = t * (panic ? 18 : 6) + i * 2, px = Math.sin(a) * r * 0.34, py = Math.abs(Math.cos(a * 1.3)) * r * 0.36 - r * 0.05;
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="#111" stroke-width="6"/><circle cx="${x + px}" cy="${y + py}" r="${r * 0.46}" fill="#111"/>`; }
const mapX = x => OX + x * SC, mapY = y => y * SC;
function snakeLayer(t, u, big) {   // rises out of the water, sways, googly eyes
  const rise = Math.min(1, u * 3) , dy = (1 - rise * rise) * 900 + Math.sin(t * 2) * 14, rot = Math.sin(t * 1.6) * 3, sc = big ? 1.55 : 1.05;
  const cx = 540, cy = 1920;
  return `<g transform="translate(${cx} ${cy + dy}) rotate(${rot}) scale(${sc}) translate(${-cx} ${-cy})"><image href="snakeG.png" x="${OX}" y="0" width="${IW}" height="1920" preserveAspectRatio="xMidYMid slice"/>${googly(mapX(316), mapY(214), 40, t, 0, false)}${googly(mapX(465), mapY(215), 40, t, 1, false)}</g>`;
}
function animalLayer(t, u) {   // nervous little animal: trembling, tears, googly eyes
  const sh = Math.sin(t * 38) * 4, pop = Math.min(1, u * 5), dy = (1 - pop) * 700 + Math.abs(Math.sin(t * 7)) * -14, sx = 0.78;
  const eye = (x, y, i) => googly(mapX(x), mapY(y), 36, t, i, true);
  const tear = i => { const ph = (t * 2 + i * 0.5) % 1; return `<ellipse cx="${mapX(i ? 520 : 252)}" cy="${mapY(420) + ph * 160}" rx="9" ry="16" fill="#7ec8ff" opacity="${1 - ph}"/>`; };
  return `<g transform="translate(${540 + sh} ${1960 + dy}) scale(${sx}) translate(-540 -1960)"><image href="animG.png" x="${OX}" y="0" width="${IW}" height="1920" preserveAspectRatio="xMidYMid slice"/>${eye(294, 380, 0)}${eye(478, 383, 1)}${tear(0)}${tear(1)}<path d="M${mapX(335)} ${mapY(470)} q${mapX(400) - mapX(335) + 10} -34 ${mapX(445) - mapX(335)} 0" fill="none" stroke="#111" stroke-width="8" stroke-linecap="round"/></g>`;
}
window.renderFrame = function (frame) {
  const t = frame / TL.fps; cur = t; const svg = document.getElementById('stage');
  const sh = SHOTS.find(s => t >= s.t0 && t < s.t1) || SHOTS[2], u = (t - sh.t0) / 1.0, uu = (t - sh.t0) / Math.min(3.5, sh.t1 - sh.t0), z = 1.04 + 0.1 * Math.min(1, uu);
  let s = `<defs><linearGradient id="skin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6d4b4"/><stop offset="1" stop-color="#e5ae86"/></linearGradient><linearGradient id="red" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e63946"/><stop offset="1" stop-color="#b3202c"/></linearGradient>${stk('stS', 1.22 * 1.2)}<radialGradient id="vig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.45"/></radialGradient></defs>`;
  s += `<g transform="translate(540 960) scale(${z}) translate(-540 -960)"><image href="${sh.env}" x="${OX}" y="0" width="${IW}" height="1920" preserveAspectRatio="xMidYMid slice"/>`;
  if (sh.mode === 'a') s += snakeLayer(t, u, false);
  if (sh.mode === 'b') s += animalLayer(t, u);
  if (sh.mode === 'c') { const hz = 1.75, hx = mapX(390), hy = mapY(250), sway = Math.sin(t * 1.6) * 2;
    s += `<g transform="translate(540 930) rotate(${sway}) scale(${hz}) translate(${-hx} ${-hy})"><image href="snakeG.png" x="${OX}" y="0" width="${IW}" height="1920" preserveAspectRatio="xMidYMid slice"/>${googly(mapX(316), mapY(214), 42, t, 0, false)}${googly(mapX(465), mapY(215), 42, t, 1, false)}</g>`;
    s += `<g transform="translate(150 1620) scale(0.34) translate(-540 -1960)">${animalLayer(t, 9)}</g>`; }
  s += `</g>`;
  const pop = Math.min(1, (t - sh.t0) / 0.18), k = 1.2 * (0.55 + 0.45 * (1 - Math.pow(1 - pop, 3)));
  const P = baseP(); P.x = sh.sx; P.y = 2300 + (1 - pop) * 400; P.tilt = sh.mode === 'b' ? -4 : 3;
  s += `<g filter="url(#stS)" transform="translate(${P.x} ${P.y}) scale(${k}) translate(${-P.x} ${-P.y})">${scout(t, P)}</g><rect width="1080" height="1920" fill="url(#vig)"/>`;
  const wd = WORDS.find(w => t >= w.a && t < w.b);
  if (wd) { const q = Math.min(1, (t - wd.a) / 0.08), fs = Math.min(190, Math.floor(980 / (wd.w.length * 0.62))), sc2 = 1.18 - 0.18 * q;
    s += `<g transform="translate(540 330) scale(${sc2})"><text text-anchor="middle" font-size="${fs}" fill="#000" stroke="#000" stroke-width="30" stroke-linejoin="round" style="font-weight:900">${wd.w}</text><text text-anchor="middle" font-size="${fs}" fill="#fff" style="font-weight:900">${wd.w}</text></g>`; }
  s += `<rect x="30" y="52" width="400" height="56" rx="8" fill="#111"/><text x="46" y="92" font-size="32" fill="#fff" letter-spacing="6">SURVIVAL UNTOLD</text>`;
  svg.innerHTML = s;
};
renderFrame(0);
