const X = 540;
const SHOTS = [{ t0: 0, t1: 3.9, img: 's1.jpg', eyes: [[242, 688, 38], [542, 688, 38]], sx: 540, mode: 'c' }, { t0: 3.9, t1: 7.4, img: 's2.jpg', eyes: [[509, 1005, 26]], sx: 620, mode: 'r' }, { t0: 7.4, t1: 99, img: 's3r.jpg', eyes: [], sx: 400, mode: 'l' }];
const WORDS = (() => { const w = TL.clips[0].text.split(/\s+/), tot = w.reduce((a, b) => a + b.length + 2, 0); let acc = 0; return w.map(x => { const o = { w: x.toUpperCase().replace(/[.,]/g, ''), a: acc / tot * TL.total, b: (acc + x.length + 2) / tot * TL.total }; acc += x.length + 2; return o; }); })();
function baseP() { const P = { x: 300, y: 1900, lean: 0, phase: 0, walk: false, tilt: 0, headDy: 0, eyeX: 6, eyeY: 2, lid: 12, brow: 4, dirx: 1, stride: 42, liftAmt: 30, fh: [-95, -230], mh: [190, -420], micRot: 40, juice: false, file: false, note: false, dangle: false, phone: false, tray: false, vest: false, noMic: false };
  P.fh = [-95 + Math.sin(cur * 4) * 8, -230 + Math.sin(cur * 3) * 8]; P.mh = [185 + Math.sin(cur * 3.5) * 6, -420 + Math.sin(cur * 2.6) * 8]; return P; }
function googly(x, y, r, t, i) { const a = t * 6 + i * 2, px = Math.sin(a) * r * 0.32, py = Math.abs(Math.cos(a * 1.3)) * r * 0.34 - r * 0.05;
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="#111" stroke-width="5"/><circle cx="${x + px}" cy="${y + py}" r="${r * 0.46}" fill="#111"/>`; }
window.renderFrame = function (frame) {
  const t = frame / TL.fps; cur = t; const svg = document.getElementById('stage');
  const sh = SHOTS.find(s => t >= s.t0 && t < s.t1) || SHOTS[2], u = (t - sh.t0) / Math.min(3.5, sh.t1 - sh.t0), z = 1.04 + 0.1 * Math.min(1, u);
  const sc = 1920 / 1376, W = 768 * sc, ox = (1080 - W) / 2;
  let s = `<defs><linearGradient id="skin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6d4b4"/><stop offset="1" stop-color="#e5ae86"/></linearGradient><linearGradient id="red" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e63946"/><stop offset="1" stop-color="#b3202c"/></linearGradient>${stk('stS', 1.22 * 1.3)}
    <radialGradient id="vig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.45"/></radialGradient></defs>`;
  s += `<g transform="translate(540 960) scale(${z}) translate(-540 -960)"><image href="${sh.img}" x="${ox}" y="0" width="${W}" height="1920" preserveAspectRatio="xMidYMid slice"/>${sh.eyes.map(([ex, ey, er], i) => googly(ox + ex * sc, ey * sc, er * sc * 0.9, t, i)).join('')}</g>`;
  const pop = Math.min(1, (t - sh.t0) / 0.18), k = 1.3 * (0.55 + 0.45 * (1 - Math.pow(1 - pop, 3)));
  const P = baseP(); P.x = sh.sx; P.y = 2330 + (1 - pop) * 400; P.tilt = sh.mode === 'r' ? -4 : 3;
  s += `<g filter="url(#stS)" transform="translate(${P.x} ${P.y}) scale(${k}) translate(${-P.x} ${-P.y})">${scout(t, P)}</g>`;
  s += `<rect width="1080" height="1920" fill="url(#vig)"/>`;
  const wd = WORDS.find(w => t >= w.a && t < w.b);
  if (wd) { const q = Math.min(1, (t - wd.a) / 0.08), fs = Math.min(190, Math.floor(980 / (wd.w.length * 0.62))), sc2 = 1.18 - 0.18 * q;
    s += `<g transform="translate(540 330) scale(${sc2})"><text text-anchor="middle" font-size="${fs}" fill="#000" stroke="#000" stroke-width="30" stroke-linejoin="round" style="font-weight:900">${wd.w}</text><text text-anchor="middle" font-size="${fs}" fill="#fff" style="font-weight:900">${wd.w}</text></g>`; }
  s += `<rect x="30" y="52" width="400" height="56" rx="8" fill="#111"/><text x="46" y="92" font-size="32" fill="#fff" letter-spacing="6">SURVIVAL UNTOLD</text>`;
  svg.innerHTML = s;
};
renderFrame(0);
