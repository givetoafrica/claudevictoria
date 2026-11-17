// ===================== GENIUSES GONE MAD EP3 (driving): scenes, camera, render =====================
const X = 540, ROAD = 1300, CXC = 640, SCK = 0.70, HS = 0.36;
const ZT = TL.zoom, endT = id => C[id].start + C[id].dur;
const BLACK_T = endT('D22') + 0.3;
const amp = t => clamp(openness('E', t) * 1.3);
const S = t => t < ZT ? 520 * t : 520 * ZT + 520 * 0.6 * (1 - Math.exp(-(t - ZT) / 0.6));
const rep = (s, f, per, w, fn) => { let o = ''; const off = mod(s * f, per), base = Math.floor(s * f / per); for (let i = -2; i * per < w + per; i++) o += fn(i * per - off, i + base); return o; };
const R = '#1b1b22';
function bldg(x, y, w, h, c, wc, seed) {
  let o = `<rect x="${f2(x)}" y="${y - h}" width="${w}" height="${h}" fill="${c}" stroke="${R}" stroke-width="4"/><rect x="${f2(x - 8)}" y="${y - h - 14}" width="${w + 16}" height="18" fill="${c}" stroke="${R}" stroke-width="4"/>`;
  for (let r = 0; r < Math.floor((h - 60) / 76); r++) for (let k = 0; k < Math.floor((w - 30) / 62); k++) o += `<rect x="${f2(x + 24 + k * 62)}" y="${y - h + 34 + r * 76}" width="36" height="46" rx="4" fill="${rnd(seed * 9 + r * 5 + k) > 0.55 ? '#ffe9a8' : wc}" stroke="${R}" stroke-width="3"/>`;
  return o;
}
const sunG = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r * 2.2}" fill="url(#glow)" opacity="0.7"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="#ffe27a"/>`;
const road = (s, y0, col) => `<rect x="-700" y="${y0}" width="2600" height="1200" fill="${col}"/><rect x="-700" y="${y0}" width="2600" height="14" fill="#f1ede2"/>` +
  rep(s, 1, 260, 2000, x => `<rect x="${f2(x - 600)}" y="${ROAD + 120 - 90 + 80}" width="140" height="16" rx="6" fill="#f2c94c" opacity="0.92"/>`) +
  `<rect x="-700" y="${ROAD + 290}" width="2600" height="10" fill="#f1ede2" opacity="0.5"/>`;
const sidewalk = (y, col) => `<rect x="-700" y="${y}" width="2600" height="${ROAD - 120 - y + 6}" fill="${col}"/>` + `<rect x="-700" y="${ROAD - 126}" width="2600" height="10" fill="#8d99a5"/>`;

// ---- five settings ----------------------------------------------------------------------------
function zoneTown(s, t) {
  let o = `<rect x="-700" y="-300" width="2600" height="1700" fill="url(#sk1)"/>` + sunG(900, 360, 70);
  o += rep(s, 0.10, 330, 1900, (x, i) => bldg(x - 500, ROAD - 250, 250 + rnd(i) * 60, 380 + rnd(i + 3) * 260, ['#a9bdd6', '#c9b8d9', '#b3cfc6', '#d6c4a8'][i & 3 & 3 ? Math.abs(i) % 4 : 0], '#7f93ad', i));
  o += sidewalk(ROAD - 235, '#cfd5dc');
  o += rep(s, 0.42, 340, 2000, (x, i) => { const c = ['#e76f51', '#2a9d8f', '#e9c46a', '#8ab6d6'][Math.abs(i) % 4]; const sx = x - 500;
    return `<rect x="${f2(sx)}" y="${ROAD - 520}" width="300" height="300" fill="#f4e9d8" stroke="${R}" stroke-width="5"/><path d="M${f2(sx - 14)} ${ROAD - 440} h328 l-20 -64 h-288z" fill="${c}" stroke="${R}" stroke-width="5"/>
      <rect x="${f2(sx + 30)}" y="${ROAD - 420}" width="120" height="110" rx="6" fill="#cdeaf7" stroke="${R}" stroke-width="5"/><rect x="${f2(sx + 190)}" y="${ROAD - 420}" width="80" height="200" rx="6" fill="#7a5a3a" stroke="${R}" stroke-width="5"/>` + (Math.abs(i) % 5 === 2 ? duck(f2(sx + 90), ROAD - 424, 0.5) : ''); });
  o += rep(s, 0.9, 520, 2000, x => `<rect x="${f2(x - 400)}" y="${ROAD - 560}" width="10" height="440" fill="#37424f"/><circle cx="${f2(x - 395)}" cy="${ROAD - 566}" r="22" fill="#ffe9a8" stroke="${R}" stroke-width="4"/>`);
  o += rep(s, 0.3, 600, 2000, (x, i) => i % 2 ? pax(x - 300, ROAD - 150, 0.62, i + 2, t, 'walk', false, -1) : '');
  return o + road(s, ROAD - 120, '#4a5360');
}
function zoneSchool(s, t) {
  let o = `<rect x="-700" y="-300" width="2600" height="1700" fill="url(#sk1)"/>` + sunG(200, 330, 60);
  o += rep(s, 0.08, 900, 2000, (x, i) => bldg(x - 400, ROAD - 250, 240, 300 + rnd(i) * 200, '#b9c6d6', '#7f93ad', i));
  o += sidewalk(ROAD - 235, '#b8d8a0');
  o += rep(s, 0.42, 1100, 2400, (x, i) => { const sx = x - 300;
    return `<rect x="${f2(sx)}" y="${ROAD - 560}" width="860" height="340" fill="#c75b4a" stroke="${R}" stroke-width="5"/><path d="M${f2(sx - 20)} ${ROAD - 560} L${f2(sx + 430)} ${ROAD - 700} L${f2(sx + 880)} ${ROAD - 560}z" fill="#7a3a30" stroke="${R}" stroke-width="5"/>
      <rect x="${f2(sx + 380)}" y="${ROAD - 440}" width="100" height="220" fill="#6b4a2f" stroke="${R}" stroke-width="5"/>${[0, 1, 2, 3].map(k => `<rect x="${f2(sx + 40 + k * 90)}" y="${ROAD - 500}" width="64" height="70" fill="#cdeaf7" stroke="${R}" stroke-width="4"/><rect x="${f2(sx + 560 + k * 70)}" y="${ROAD - 500}" width="50" height="70" fill="#cdeaf7" stroke="${R}" stroke-width="4"/>`).join('')}
      <circle cx="${f2(sx + 430)}" cy="${ROAD - 630}" r="34" fill="#fff" stroke="${R}" stroke-width="5"/><path d="M${f2(sx + 430)} ${ROAD - 630} v-22 M${f2(sx + 430)} ${ROAD - 630} l16 8" stroke="${R}" stroke-width="5"/>` + duck(f2(sx + 430 + 130), ROAD - 662, 0.5); });
  o += rep(s, 0.9, 1100, 2400, (x, i) => `<g transform="translate(${f2(x - 200)} ${ROAD - 130})"><rect x="-5" y="-300" width="10" height="300" fill="#37424f"/><path d="M0 -440 l80 80 l-80 80 l-80 -80z" fill="#ffd23f" stroke="${R}" stroke-width="6"/><circle cx="-14" cy="-372" r="11" fill="${R}"/><circle cx="18" cy="-366" r="9" fill="${R}"/><rect x="-46" y="-290" width="92" height="64" rx="6" fill="#fff" stroke="${R}" stroke-width="5"/><text x="0" y="-262" text-anchor="middle" font-size="22" fill="${R}">SPEED</text><text x="0" y="-238" text-anchor="middle" font-size="26" fill="${R}">20</text></g>`);
  o += rep(s, 0.55, 480, 2000, (x, i) => pax(x - 200, ROAD - 150, 0.5, i + 4, t, 'walk', false, i % 2 ? -1 : 1));
  o += rep(s, 0.55, 1500, 2400, (x, i) => pax(x + 300, ROAD - 140, 0.8, 93, t, 'stare', true, 0) + `<g transform="translate(${f2(x + 355)} ${ROAD - 330})"><rect x="-4" y="0" width="8" height="120" fill="#6b4a2f"/><path d="M-30 -62 h60 l30 30 v60 l-30 30 h-60 l-30 -30 v-60z" fill="#e63946" stroke="#fff" stroke-width="5"/></g>`);
  return o + road(s, ROAD - 120, '#4a5360') + rep(s, 1, 700, 2000, x => `<g>${[0, 1, 2, 3, 4].map(k => `<rect x="${f2(x - 400 + k * 50)}" y="${ROAD + 20}" width="30" height="180" fill="#f1ede2" opacity="0.8"/>`).join('')}</g>`);
}
function zoneHighway(s, t, fl) {
  let o = `<rect x="-700" y="-300" width="2600" height="1700" fill="url(#sk3)"/>`;
  o += rep(s, 0.03, 1300, 2800, (x, i) => `<ellipse cx="${f2(x)}" cy="${280 + rnd(i) * 220}" rx="200" ry="52" fill="#fff" opacity="0.85"/>`);
  o += `<path d="M-700 ${ROAD - 240} L-420 ${ROAD - 560} L-160 ${ROAD - 300} L140 ${ROAD - 660} L460 ${ROAD - 300} L760 ${ROAD - 520} L1100 ${ROAD - 260} L1500 ${ROAD - 580} L1900 ${ROAD - 240}z" fill="#8aa0b8" stroke="${R}" stroke-width="4" transform="translate(${f2(-mod(s * 0.07, 800))} 0)"/>`;
  o += `<path d="M560 0 h700 v${ROAD - 560} l-700 0z" fill="#3a3f5c" opacity="${fl ? 0.9 : 0.35}"/>` + (fl ? `<path d="M900 520 l-90 220 l70 0 l-60 220 l190 -280 l-80 0 l80 -160z" fill="#fff4a8" stroke="#fff" stroke-width="6"/>` : '');
  o += `<rect x="-700" y="${ROAD - 260}" width="2600" height="140" fill="#9fc27a"/>`;
  o += rep(s, 0.5, 1700, 2600, (x, i) => `<rect x="${f2(x - 600)}" y="${ROAD - 700}" width="520" height="70" fill="#9aa5b1" stroke="${R}" stroke-width="5"/><rect x="${f2(x - 600)}" y="${ROAD - 640}" width="60" height="520" fill="#b7bfc8" stroke="${R}" stroke-width="5"/><rect x="${f2(x - 140)}" y="${ROAD - 640}" width="60" height="520" fill="#b7bfc8" stroke="${R}" stroke-width="5"/>`);
  o += rep(s, 0.35, 1300, 2600, (x, i) => `<g transform="translate(${f2(x - 200)} ${ROAD - 150})"><rect x="-8" y="-300" width="16" height="300" fill="#555"/><rect x="-190" y="-520" width="380" height="220" fill="#2a9d8f" stroke="${R}" stroke-width="6"/><path d="M-60 -400 l60 -70 l60 70 l-60 70z" fill="#e63946" stroke="#fff" stroke-width="6"/><path d="M0 -330 v90" stroke="#fff" stroke-width="5"/>${i % 2 ? duck(80, -524, 0.5) : ''}</g>`);
  o += rep(s, -1.5, 1250, 2600, (x, i) => `<g transform="translate(${f2(x - 400)} ${ROAD - 150})"><rect x="-130" y="-190" width="260" height="160" rx="10" fill="${i % 2 ? '#e9c46a' : '#6c8ebf'}" stroke="${R}" stroke-width="5"/><rect x="120" y="-150" width="86" height="120" rx="10" fill="#cdeaf7" stroke="${R}" stroke-width="5"/><circle cx="-70" cy="-20" r="34" fill="#222" stroke="${R}" stroke-width="5"/><circle cx="140" cy="-20" r="34" fill="#222" stroke="${R}" stroke-width="5"/></g>`);
  return o + road(s, ROAD - 120, '#3d4450') + `<rect x="-700" y="${ROAD - 150}" width="2600" height="26" fill="#cfd5dc" stroke="${R}" stroke-width="4"/>` + rep(s, 1, 200, 2200, x => `<rect x="${f2(x - 500)}" y="${ROAD - 182}" width="14" height="60" fill="#6b747d"/>`);
}
function zoneGas(s, t) {
  let o = `<rect x="-700" y="-300" width="2600" height="1700" fill="url(#sk4)"/>` + sunG(180, 400, 64);
  o += rep(s, 0.1, 700, 2000, (x, i) => bldg(x - 300, ROAD - 250, 220, 300 + rnd(i) * 140, '#c4d0dc', '#8ea0b4', i));
  o += sidewalk(ROAD - 235, '#cfd5dc');
  o += rep(s, 0.6, 1700, 2600, (x, i) => { const sx = x - 400;
    return `<rect x="${f2(sx)}" y="${ROAD - 640}" width="680" height="46" fill="#e63946" stroke="${R}" stroke-width="5"/><rect x="${f2(sx)}" y="${ROAD - 600}" width="680" height="20" fill="#fff" stroke="${R}" stroke-width="4"/>
      ${[0, 1].map(k => `<rect x="${f2(sx + 80 + k * 440)}" y="${ROAD - 594}" width="22" height="470" fill="#b7bfc8" stroke="${R}" stroke-width="4"/><rect x="${f2(sx + 190 + k * 200)}" y="${ROAD - 360}" width="86" height="230" rx="10" fill="${k ? '#2a9d8f' : '#e9c46a'}" stroke="${R}" stroke-width="5"/><rect x="${f2(sx + 204 + k * 200)}" y="${ROAD - 330}" width="58" height="50" fill="#cdeaf7" stroke="${R}" stroke-width="4"/>`).join('')}
      ${duck(f2(sx + 232), ROAD - 366, 0.5)}<rect x="${f2(sx + 720)}" y="${ROAD - 440}" width="260" height="310" fill="#f4e9d8" stroke="${R}" stroke-width="5"/><rect x="${f2(sx + 750)}" y="${ROAD - 400}" width="200" height="120" rx="6" fill="#cdeaf7" stroke="${R}" stroke-width="5"/>
      <rect x="${f2(sx + 1040)}" y="${ROAD - 720}" width="14" height="590" fill="#555"/><circle cx="${f2(sx + 1047)}" cy="${ROAD - 760}" r="70" fill="#e63946" stroke="${R}" stroke-width="6"/><text x="${f2(sx + 1047)}" y="${ROAD - 740}" text-anchor="middle" font-size="52" fill="#fff">GAS</text>`; });
  const ex = 1500 - mod(s * 0.9 - 400, 3200);
  o += `<g transform="translate(${f2(ex)} ${ROAD - 150})"><rect x="-210" y="-300" width="12" height="300" fill="#555"/><rect x="198" y="-300" width="12" height="300" fill="#555"/><rect x="-230" y="-640" width="460" height="170" rx="10" fill="#1d7a46" stroke="#fff" stroke-width="8"/><text x="0" y="-545" text-anchor="middle" font-size="64" fill="#fff">EXIT 14</text><path d="M-150 -490 h300" stroke="#fff" stroke-width="6"/></g>`;
  return o + road(s, ROAD - 120, '#4a5360');
}
function zoneLake(s, t) {
  let o = `<rect x="-700" y="-300" width="2600" height="1700" fill="url(#sk5)"/>` + sunG(640, ROAD - 380, 150);
  o += `<path d="M-700 ${ROAD - 330} Q-300 ${ROAD - 520} 100 ${ROAD - 340} Q500 ${ROAD - 480} 900 ${ROAD - 340} Q1300 ${ROAD - 500} 1900 ${ROAD - 330} V${ROAD - 300} H-700z" fill="#4a3566" stroke="${R}" stroke-width="4" transform="translate(${f2(-mod(s * 0.05, 1000))} 0)"/>`;
  o += `<rect x="-700" y="${ROAD - 330}" width="2600" height="214" fill="#e0775a"/>` + rep(s, 0.02, 120, 2000, (x, i) => `<rect x="${f2(x - 500)}" y="${ROAD - 320 + (i & 7) * 26}" width="${150 - (i & 7) * 12}" height="9" rx="4" fill="#ffd9a0" opacity="${(0.45 + 0.4 * Math.sin(t * 3 + i)).toFixed(2)}"/>`);
  o += duck(f2(1000 - mod(s * 0.3, 2600) + 700), ROAD - 232, 0.6);
  o += rep(s, 0.45, 430, 2200, (x, i) => `<g transform="translate(${f2(x - 400)} ${ROAD - 130})"><rect x="-9" y="-190" width="18" height="190" fill="#2a1f3d"/><ellipse cx="0" cy="-250" rx="${56 + rnd(i) * 30}" ry="${90 + rnd(i + 2) * 40}" fill="#2a1f3d"/></g>`);
  return o + road(s, ROAD - 120, '#3b3347');
}
const ZONES = { town: zoneTown, school: zoneSchool, highway: zoneHighway, gas: zoneGas, lake: zoneLake };

// ---- the car, the scooter, the characters -----------------------------------------------------
function wheel(x, y, r, ang) { return `<g transform="translate(${x} ${y}) rotate(${f2(ang * 57.3)})"><circle r="${r}" fill="#222" stroke="${R}" stroke-width="6"/><circle r="${r * 0.55}" fill="#cfd5dc" stroke="${R}" stroke-width="4"/>${[0, 1, 2, 3, 4, 5].map(k => `<path d="M0 0 L${f2(Math.cos(k * 1.047) * r * 0.55)} ${f2(Math.sin(k * 1.047) * r * 0.55)}" stroke="${R}" stroke-width="4"/>`).join('')}</g>`; }
function carSvg(t, s, cx, bob, o) {
  const ang = s / 78, hs = HS, op = amp(t), cap = o.cap;
  const hy = -470 + Math.sin(t * 5) * 3 + (o.angry ? Math.sin(t * 70) * 3 : 0), rot = Math.sin(t * 4.3) * 2 + (o.turn || 0);
  const sh = dropShadow(0, 6, 360, 0.25);
  const seat = `<rect x="-310" y="-300" width="240" height="120" rx="30" fill="#7a4a2a" stroke="${R}" stroke-width="6"/><rect x="-310" y="-330" width="40" height="150" rx="20" fill="#8a5a3a" stroke="${R}" stroke-width="6"/>`;
  const torso = `<path d="M-190 -230 L-150 -340 Q-60 -372 30 -340 L70 -230z" fill="#2a5d9f" stroke="#111" stroke-width="7"/><rect x="-52" y="-352" width="64" height="116" fill="#f1e3b5" stroke="#111" stroke-width="4"/><path d="M-36 -350 q-6 34 2 52 l22 -30z M10 -350 q6 34 -2 52 l-22 -30z" fill="#fff" stroke="#111" stroke-width="3"/>`;
  const arms = `<path d="M-130 -330 Q-170 -270 -118 -236" fill="none" stroke="#2a5d9f" stroke-width="40" stroke-linecap="round"/><circle cx="-112" cy="-232" r="21" fill="#f6d4b4" stroke="#111" stroke-width="4"/><path d="M40 -330 Q120 -310 138 -280" fill="none" stroke="#2a5d9f" stroke-width="40" stroke-linecap="round"/><circle cx="142" cy="-276" r="21" fill="#f6d4b4" stroke="#111" stroke-width="4"/>`;
  const head = `<g transform="translate(-34 ${f2(hy)}) scale(${hs}) translate(-540 0)"><g filter="url(#stF)">${franklin(t, { cy: 0, scale: 1, rot: rot, lookX: o.lookX == null ? -20 : o.lookX, lookY: o.lookY == null ? 8 : o.lookY, sad: false, noGlasses: false })}</g>${cap ? `<g transform="translate(540 -330) rotate(${f2(rot)})"><path d="M-270 40 Q-300 -140 -120 -200 Q0 -240 120 -200 Q300 -140 270 40 Q0 -10 -270 40z" fill="#6b4a2f" stroke="#111" stroke-width="14"/><path d="M-250 30 q20 24 40 0 q20 24 40 0 q20 24 40 0 q20 24 40 0 q20 24 40 0 q20 24 40 0 q20 24 40 0 q20 24 40 0 q20 24 40 0 q20 24 40 0 q20 24 40 0 q20 24 40 0 q20 24 30 0" fill="#7d5a3a" stroke="#111" stroke-width="8"/></g>` : ''}</g>`;
  const body = `<path d="M-340 -110 Q-350 -250 -300 -250 L-70 -250 L90 -250 Q150 -250 190 -210 L330 -200 Q372 -196 372 -150 L372 -110z" fill="#2a7f62" stroke="${R}" stroke-width="7" stroke-linejoin="round"/><path d="M-70 -250 V-110" stroke="${R}" stroke-width="6"/><path d="M130 -250 V-114" stroke="${R}" stroke-width="5"/><rect x="-330" y="-122" width="710" height="22" rx="8" fill="#cfd5dc" stroke="${R}" stroke-width="5"/>`;
  const wind = `<path d="M90 -250 L132 -400 L168 -396 L176 -244z" fill="#cdeaf7" opacity="0.55" stroke="${R}" stroke-width="7" stroke-linejoin="round"/>`;
  const lamp = `<circle cx="352" cy="-170" r="26" fill="#ffe9a8" stroke="${R}" stroke-width="6"/><path d="M370 -170 L700 -130 L700 -210z" fill="#ffe9a8" opacity="0.18"/>`;
  const rack = `<path d="M-340 -250 h-30 M-370 -250 v-50 h60" fill="none" stroke="${R}" stroke-width="8"/>`;
  return `<g transform="translate(${f2(cx)} ${f2(ROAD + bob)})">${sh}${seat}${torso}${arms}${head}${body}${wind}${rack}${lamp}${wheel(-200, -66, 66, ang)}${wheel(220, -66, 66, ang)}</g>`;
}
function scooterSvg(x, y, ang, k) { return `<g transform="translate(${f2(x)} ${f2(y)}) scale(${k})">${dropShadow(10, 6, 150, 0.25)}${wheel(-100, -38, 38, ang)}${wheel(130, -38, 38, ang)}<rect x="-135" y="-88" width="290" height="20" rx="8" fill="#3b5ba5" stroke="${R}" stroke-width="6"/><path d="M130 -76 L108 -330" stroke="#9aa5b1" stroke-width="16" stroke-linecap="round"/><path d="M70 -330 H150" stroke="${R}" stroke-width="16" stroke-linecap="round"/></g>`; }
function baseP() { const P = { x: 300, y: 1872, lean: 0, phase: 0, walk: false, tilt: 0, headDy: 0, eyeX: 6, eyeY: 2, lid: 12, brow: 4, dirx: 1, stride: 42, liftAmt: 30, fh: [109, -214], mh: [92, -378], micRot: 38, juice: false, file: false, note: false, dangle: false, phone: false, tray: false, vest: false, noMic: false };
  P.mh = [92 + Math.sin(cur * 3.5) * 5, -378 + Math.sin(cur * 2.6) * 6]; return P; }
function figS(t, P, k) { return `<g filter="url(#stS)" transform="translate(${f2(P.x)} ${f2(P.y)}) scale(${f2(k)}) translate(${f2(-P.x)} ${f2(-P.y)})">${scout(t, P)}</g>`; }
const stringLine = (a, b, sag) => `<path d="M${f2(a[0])} ${f2(a[1])} Q${f2((a[0] + b[0]) / 2)} ${f2((a[1] + b[1]) / 2 + (sag == null ? 14 : sag))} ${f2(b[0])} ${f2(b[1])}" fill="none" stroke="#1b1b22" stroke-width="4"/>`;

// ---- the shot list ------------------------------------------------------------------------------
const SHOTS = [];
function shot(id, zone, opt, fn) { SHOTS.push(Object.assign({ id, zone, fn }, opt || {})); }
const HEADW = (carX) => [carX - 34 - 0, ROAD - 470 + 30];       // approx head centre in world
const carX = t => t < ZT ? CXC : CXC + 2300 * Math.pow(clamp((t - ZT) / 1.0), 2) + (t > ZT + 1.0 ? 3000 * (t - ZT - 1.0) : 0);
const capSt = t => { const q = t - (ZT + 0.05); if (q < 0) return { on: true }; return { on: false, x: CXC - 80 - 380 * q + 300 * q * q, y: ROAD - 600 - 560 * q + 1100 * q * q, rot: q * 700 }; };
function frame(t, o) {
  o = o || {}; const s = S(t), cx = carX(t), bob = Math.sin(t * 15) * (t < ZT ? 3 : 7) - (t >= ZT && t < ZT + 0.3 ? 14 * (1 - (t - ZT) / 0.3) : 0), cs = capSt(t);
  const fl = t >= C.D11.start + 8.1 && t < C.D11.start + 8.55 && Math.floor(t * 12) % 2 === 0;
  const zone = ZONES[o.zone](s, t, fl);
  // the kite flaps behind the car, tied to the rack
  const rk = [cx - 370, ROAD - 300], kk = [cx - 640 + Math.sin(t * 9) * 12, ROAD - 440 + Math.sin(t * 7) * 18];
  const kite = stringLine(rk, [kk[0] + 30, kk[1] + 40], 20) + kiteSvg(kk[0], kk[1], 0.5, 40 + Math.sin(t * 8) * 10);
  const car = carSvg(t, s, cx, bob, { cap: cs.on, angry: t > C.D19.start + 1.0, turn: (t > C.D16.start && t < endT('D17') ? Math.min(8, (t - C.D17.start) * 5) : 0), lookX: o.lookX, lookY: o.lookY });
  // Scout on the scooter
  const P = baseP(); const scx = CXC - 34 - 226 + Math.sin(t * 3) * 3 + (o.scOff || 0), gy = ROAD + 125;
  const scd = t < C.D1.start + 2.0 ? ease(clamp((t - 0.15) / 1.9)) : 1;
  P.x = lerp(scx - 760, scx, scd); P.y = gy - 53 + Math.sin(t * 13) * 2;
  P.fh = [109, -214]; P.lean = (t > ZT ? -6 * Math.exp(-(t - ZT) / 0.5) : 0) + 2; P.tilt = t > ZT + 0.2 ? 6 : 0;
  if (o.scoutBrow != null) P.brow = o.scoutBrow;
  if (t >= ZT) { P.noMic = true; P.mh = [150, -330 + Math.sin(t * 5) * 5]; P.brow = 0; P.lid = 6; }
  const sc = scooterSvg(P.x + 25, gy, s / 40, 0.85) + figS(t, P, SCK);
  const cord = t >= ZT ? `<path d="M${f2(P.x + 150 * 1.22 * SCK)} ${f2(P.y - 330 * 1.22 * SCK)} q60 -10 110 60 q-30 40 -90 60" fill="none" stroke="#222" stroke-width="5"/>` : '';
  // tiny car far down the road (D21/D22)
  let far = '';
  if (t > ZT + 2.2) { const q = clamp((t - ZT - 2.2) / 7); far = `<g transform="translate(${f2(lerp(1000, 1230, q))} ${ROAD - 8}) scale(${f2(0.1 - 0.04 * q)})"><g transform="translate(0 0)">${carSvg(t, s, 0, 0, { cap: false })}</g></g><ellipse cx="${f2(lerp(900, 1180, q))}" cy="${ROAD - 20}" rx="${f2(60 + 40 * q)}" ry="14" fill="#e8dcc8" opacity="${f2(0.7 * (1 - q))}"/>`; }
  let fx = '';
  if (t >= ZT && t < ZT + 1.6) { const q = t - ZT; for (let i = 0; i < 9; i++) { const a = q - i * 0.07; if (a < 0) continue; const px = carX(ZT + a) - 380 - i * 14; fx += `<circle cx="${f2(px)}" cy="${f2(ROAD - 40 - (i % 3) * 22)}" r="${f2(30 + i * 16)}" fill="#efe3cb" opacity="${f2(0.8 * Math.max(0, 1 - q / 1.6))}"/>`; } for (let i = 0; i < 12; i++) { const yy = ROAD - 560 + i * 85, len = 400 + rnd(i + 8) * 500, xx = mod(t * 4000 + i * 311, 2200) - 500; fx += `<rect x="${f2(xx)}" y="${yy}" width="${f2(len)}" height="7" rx="3" fill="#fff" opacity="0.55"/>`; } }
  const capSvg = !cs.on ? `<g transform="translate(${f2(cs.x)} ${f2(cs.y)}) rotate(${f2(cs.rot)}) scale(0.5)"><path d="M-270 40 Q-300 -140 -120 -200 Q0 -240 120 -200 Q300 -140 270 40 Q0 -10 -270 40z" fill="#6b4a2f" stroke="#111" stroke-width="14"/></g>` : '';
  return { zone, kite, car, sc, cord, far, fx, capSvg, cx, P };
}
const mk = (cam, o) => (t, u) => ({ cam: cam(t, u), o });
const HC = () => [CXC - 34, ROAD - 440];       // Franklin head centre (world)
const SHC = () => [CXC - 34 - 226, ROAD + 72 - 478 * 1.22 * SCK];

shot('D1', 'town', {}, (t, u) => ({ cam: { cx: lerp(560, 580, u), cy: lerp(1090, 1040, u), z: lerp(0.82, 1.0, ease(u)) }, o: {} }));
shot('D2', 'town', {}, (t, u) => ({ cam: { cx: HC()[0] - 20, cy: HC()[1] + 10, z: lerp(2.15, 2.45, u), roll: lerp(0, 2, u) }, o: { lookX: -40, lookY: 14 } }));
shot('D3', 'town', {}, (t, u) => ({ cam: { cx: SHC()[0] + 60, cy: SHC()[1] - 60, z: lerp(2.05, 2.2, u) }, o: { scoutBrow: 0 } }));
shot('D4', 'town', {}, (t, u) => ({ cam: { cx: lerp(560, 600, u), cy: 1010, z: lerp(1.45, 1.7, u), roll: lerp(-2, 3, u) }, o: { lookX: -25, lookY: 10 } }));
shot('D5', 'town', {}, (t, u) => ({ cam: { cx: SHC()[0] + 40, cy: SHC()[1] + 10, z: 2.3 }, o: { scoutBrow: 0 } }));
shot('D6', 'town', {}, (t, u) => ({ cam: { cx: lerp(640, 560, u), cy: 1000, z: lerp(1.3, 1.6, ease(u)), roll: lerp(3, -3, u) }, o: { lookX: -30 } }));
shot('D7', 'school', { whip: true }, (t, u) => ({ cam: { cx: 560, cy: 1050, z: lerp(0.95, 1.15, u) }, o: {} }));
shot('D8', 'school', {}, (t, u) => ({ cam: { cx: HC()[0] - 10, cy: HC()[1], z: lerp(2.4, 2.7, u), roll: lerp(5, 2, u) }, o: { lookX: -35 } }));
shot('D9', 'highway', { whip: true }, (t, u) => ({ cam: { cx: 520, cy: 1000, z: lerp(1.25, 1.4, u) }, o: {} }));
shot('D10', 'highway', {}, (t, u) => ({ cam: { cx: HC()[0] + 10, cy: HC()[1] - 20, z: lerp(3.3, 3.7, u) }, o: { lookX: -4, lookY: -2 } }));
shot('D11', 'highway', {}, (t, u) => ({ cam: { cx: lerp(HC()[0], 560, ease(u)), cy: lerp(HC()[1], 1020, ease(u)), z: lerp(2.5, 1.1, ease(u)), roll: lerp(-4, 2, u) }, o: { lookX: -30 } }));
shot('D12', 'highway', {}, (t, u) => ({ cam: { cx: SHC()[0] + 50, cy: SHC()[1] - 40, z: 2.1 }, o: { scoutBrow: 0 } }));
shot('D13', 'highway', {}, (t, u) => ({ cam: { cx: 620, cy: 1000, z: lerp(1.35, 1.65, u), roll: -3 }, o: { lookX: -30 } }));
shot('D14', 'gas', { whip: true }, (t, u) => ({ cam: { cx: lerp(560, 380, ease(u)), cy: lerp(1040, 960, u), z: lerp(1.0, 1.6, ease(u)) }, o: { scoutBrow: 0 } }));
shot('D15', 'gas', {}, (t, u) => ({ cam: { cx: HC()[0] - 10, cy: HC()[1] + 5, z: lerp(2.3, 2.6, u), roll: 3 }, o: { lookX: -38 } }));
shot('D16', 'gas', {}, (t, u) => ({ cam: { cx: SHC()[0] + 70, cy: SHC()[1] - 30, z: 2.1 }, o: { scoutBrow: 0 } }));
shot('D17', 'lake', { whip: true }, (t, u) => ({ cam: { cx: HC()[0] + 20, cy: HC()[1] + 20, z: lerp(2.0, 2.3, u), roll: lerp(-3, 3, u) }, o: { lookX: lerp(-30, 40, clamp(u * 2)) } }));
shot('D18', 'lake', {}, (t, u) => ({ cam: { cx: SHC()[0] + 60, cy: SHC()[1] - 20, z: 2.05 }, o: { scoutBrow: 0 } }));
shot('D19', 'lake', {}, (t, u) => ({ cam: { cx: HC()[0] - 10, cy: HC()[1], z: lerp(2.5, 3.0, u), roll: lerp(2, -4, u) }, o: { lookX: -42, lookY: 4 } }));
shot('D19z', 'lake', {}, (t, u) => ({ cam: { cx: lerp(560, 640, u), cy: 1050, z: 0.95 }, o: {}, shake: 14 * Math.exp(-(t - ZT) / 0.8) }));
shot('D21', 'lake', {}, (t, u) => ({ cam: { cx: lerp(420, 380, u), cy: 1010, z: lerp(1.1, 1.5, u) }, o: {} }));
shot('D22', 'lake', {}, (t, u) => ({ cam: { cx: lerp(560, 760, ease(u)), cy: 1080, z: lerp(0.9, 0.82, u) }, o: {} }));
SHOTS.forEach((s, i) => { s.t0 = s.id === 'D1' ? 0 : s.id === 'D19z' ? ZT - 0.05 : C[s.id].start; });
SHOTS.forEach((s, i) => { s.t1 = i < SHOTS.length - 1 ? SHOTS[i + 1].t0 : BLACK_T; });
const shotIdx = t => { let r = 0; for (let i = 0; i < SHOTS.length; i++) if (t >= SHOTS[i].t0) r = i; return r; };
const STAMPS = [['D2', 'MORON!'], ['D6', 'CONE!'], ['D11', 'MORON!'], ['D15', 'BUMP!'], ['D17', 'STICKER!']].map(([id, w]) => ({ t: wtw(id, w), word: w }));
const clampCam = c => ({ z: c.z, roll: c.roll || 0, cx: clamp(c.cx, -500 + 540 / c.z, 1700 - 540 / c.z), cy: clamp(c.cy, 960 / c.z - 300, 1920 - 960 / c.z + 200) });

window.renderFrame = function (frame) {
  const t = frame / FPS; cur = t;
  const svg = document.getElementById('stage');
  if (t >= BLACK_T) {
    const q = clamp((t - BLACK_T - 0.35) / 0.4);
    svg.innerHTML = `<rect width="1080" height="1920" fill="#000"/><g opacity="${f2(q)}"><text x="540" y="700" text-anchor="middle" font-size="34" fill="#9aa5b1" letter-spacing="6">GENIUSES GONE MAD · EPISODE 3</text>
      <text x="540" y="900" text-anchor="middle" font-size="76" fill="#ffd23f">THE WRIGHT BROTHERS</text><text x="540" y="990" text-anchor="middle" font-size="76" fill="#ffd23f">ARE NEXT.</text>
      <text x="540" y="1130" text-anchor="middle" font-size="66" fill="#fff">SHOULD SCOUT</text><text x="540" y="1210" text-anchor="middle" font-size="66" fill="#fff">LET THEM FLY?</text>
      <text x="540" y="1800" text-anchor="middle" font-size="26" fill="#9aa5b1" style="font-weight:700">AI-generated fictional historical comedy.</text></g>`;
    return;
  }
  const idx = shotIdx(t), sh = SHOTS[idx], nxt = SHOTS[idx + 1];
  const u = clamp((t - sh.t0) / (sh.t1 - sh.t0));
  const st = sh.fn(t, u), cam = clampCam(st.cam), F = frame_(t, sh, st);
  const punch = 1 + 0.07 * Math.max(0, 1 - (t - sh.t0) / 0.14), z = cam.z * punch;
  const shk = (st.shake || 0) + (t > ZT - 0.2 && t < ZT + 1.2 ? 5 : 0);
  const cx = cam.cx + Math.sin(t * 1.3) * 4 + Math.sin(t * 19) * shk, cy = cam.cy + Math.cos(t * 1.1) * 3 + Math.cos(t * 23) * shk;
  let wOff = 0, wBlur = 0;
  if (sh.whip) { const q = clamp(1 - (t - sh.t0) / 0.26); wOff = q * q * 620; wBlur = q * 34; }
  if (nxt && nxt.whip) { const q = clamp((t - (sh.t1 - 0.12)) / 0.12); wOff = -q * q * 620; wBlur = Math.max(wBlur, q * 30); }
  let s = `<defs>${stk('stF', HS * z)}${stk('stS', 1.22 * SCK * z)}<filter id="whipB" x="-20%" y="0" width="140%" height="100%"><feGaussianBlur stdDeviation="${f2(wBlur)} 0"/></filter>
    <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6d4b4"/><stop offset="1" stop-color="#e5ae86"/></linearGradient>
    <linearGradient id="red" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e63946"/><stop offset="1" stop-color="#b3202c"/></linearGradient>
    <linearGradient id="sk1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fd0f5"/><stop offset="1" stop-color="#ffeccf"/></linearGradient>
    <linearGradient id="sk3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fb0dd"/><stop offset="1" stop-color="#e8eef5"/></linearGradient>
    <linearGradient id="sk4" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b6dcee"/><stop offset="1" stop-color="#ffe9b8"/></linearGradient>
    <linearGradient id="sk5" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a2f6a"/><stop offset="0.45" stop-color="#e0605a"/><stop offset="1" stop-color="#ffc98a"/></linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffd27a" stop-opacity="0.9"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient>
    <radialGradient id="vig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.38"/></radialGradient>
    <radialGradient id="keyL" cx="0.15" cy="0.08" r="0.95"><stop offset="0" stop-color="#ffe2b0" stop-opacity="0.26"/><stop offset="1" stop-color="#ffe2b0" stop-opacity="0"/></radialGradient>
    <linearGradient id="shL" x1="0" y1="0" x2="0" y2="1"><stop offset="0.55" stop-color="#1d2a44" stop-opacity="0"/><stop offset="1" stop-color="#1d2a44" stop-opacity="0.3"/></linearGradient>
    <pattern id="grain" width="128" height="128" patternUnits="userSpaceOnUse"><image href="${GRAIN}" width="128" height="128"/></pattern></defs>`;
  const blur = clamp((z - 1.4) * 4, 0, 7);
  s += `<g transform="translate(${f2(wOff)} 0)" ${wBlur > 0.5 ? 'filter="url(#whipB)"' : ''}><g transform="translate(540 960) rotate(${f2(cam.roll)}) scale(${f2(z)}) translate(${f2(-cx)} ${f2(-cy)})">`;
  s += `<g ${blur > 0.4 ? `style="filter:blur(${f2(blur)}px)"` : ''}>${F.zone}</g>`;
  s += F.far + F.kite + F.car + F.sc + F.cord + F.capSvg + F.fx + `</g></g>`;
  const th = t - ZT; if (th >= 0 && th < 0.16) s += `<rect width="1080" height="1920" fill="#fff" opacity="${f2(0.5 * (1 - th / 0.16))}"/>`;
  s += `<rect width="1080" height="1920" fill="url(#keyL)"/><rect width="1080" height="1920" fill="url(#shL)"/><rect width="1080" height="1920" fill="#ff9d4d" opacity="0.07" style="mix-blend-mode:soft-light"/><rect width="1080" height="1920" fill="url(#vig)"/><rect width="1080" height="1920" fill="url(#grain)" opacity="0.10" style="mix-blend-mode:multiply"/>`;
  for (let i = 0; i < STAMPS.length; i++) {
    const a = t - STAMPS[i].t;
    if (a >= 0 && a < 0.65) {
      const k = Math.min(1, a / 0.1), fade = a > 0.45 ? 1 - (a - 0.45) / 0.2 : 1, sc = 1.5 - 0.5 * ease(k), fs = Math.min(150, Math.floor(980 / (STAMPS[i].word.length * 0.72)));
      s += `<g transform="translate(540 590) rotate(${i % 2 ? 5 : -5}) scale(${f2(sc)})" opacity="${f2(fade)}"><text text-anchor="middle" font-size="${fs}" fill="#e63946" stroke="#fffdf5" stroke-width="22" paint-order="stroke" stroke-linejoin="round">${STAMPS[i].word}</text><text text-anchor="middle" font-size="${fs}" fill="#e63946">${STAMPS[i].word}</text></g>`;
    }
  }
  const cap = captionFor(t);
  if (cap) {
    const sc = 1 + (1 - cap.pop) * 0.12, fs = Math.min(92, Math.floor(920 / (cap.text.length * 0.66))), wbar = Math.min(1040, cap.text.length * fs * 0.64 + 60);
    const bar = cap.spk === 'E' ? '#ffe14a' : (cap.spk === 'F' ? '#ffe14a' : '#ffffff');
    s += `<g transform="translate(540 255) scale(${f2(sc)}) rotate(${cap.spk === 'S' ? 0.8 : -1.2})"><rect x="${-wbar / 2 + 8}" y="${-fs * 0.95 + 10}" width="${wbar}" height="${fs * 1.25}" rx="10" fill="#000" opacity="0.28"/><rect x="${-wbar / 2}" y="${-fs * 0.95}" width="${wbar}" height="${fs * 1.25}" rx="10" fill="${bar}" stroke="#1b1b22" stroke-width="6"/><text x="0" y="0" text-anchor="middle" font-size="${fs}" fill="#1b1b22">${cap.text.replace(/&/g, '&amp;')}</text></g>`;
  }
  s += `<rect x="30" y="52" width="400" height="56" rx="8" fill="#111"/><text x="46" y="92" font-size="32" fill="#fff" letter-spacing="6">SURVIVAL UNTOLD</text>`;
  if (t < 3.6) s += `<text x="46" y="148" font-size="28" fill="#1b1b22" stroke="#fffdf5" stroke-width="6" paint-order="stroke" style="font-weight:800">GENIUSES GONE MAD · EPISODE 3</text><text x="46" y="1892" font-size="26" fill="#fffdf5" stroke="#1b1b22" stroke-width="6" paint-order="stroke" style="font-weight:800">AI-generated fictional historical comedy.</text>`;
  svg.innerHTML = s;
};
function frame_(t, sh, st) { return frame(t, Object.assign({ zone: sh.zone }, st.o || {})); }
renderFrame(0);
