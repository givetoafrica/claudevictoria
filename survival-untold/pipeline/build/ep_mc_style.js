// ===================== GENIUSES GONE MAD EP5: JOHN McCARTHY MEETS AI ==============================
const _openness = openness; openness = function (spk, t) { const v = _openness(spk, t); return window.STYLE === 'cut' ? (v > 0.5 ? 0.9 : (v > 0.18 ? 0.45 : 0.04)) : v; };
const X = 540, FY = 1500, SCK = 0.64, R = '#1b1b22', TX = 640, TY = 1280, MK = 0.52;
const endT = id => C[id].start + C[id].dur;
const amp = (who, t) => clamp(openness(who, t) * 1.3);
const BLACK_T = TL.black;
const PALM = { jacket: '#6b7280', dark: '#3f4652', trouser: '#4b5563', tie: '#111827', vest: '#e8ecf0', hair: '#3a2a1e' };

// ---- McCarthy: 1950s professor, horn-rimmed glasses, receding hair ----------------------------------
function mccHead(t, st) {
  const o = openness('M', t), shout = clamp(o * 1.5), sp = speaking('M');
  const shake = sp ? Math.sin(t * 80) * 4 * shout : 0, sc = st.scale * (1 + 0.03 * o), lx = st.lookX, ly = st.lookY, shock = st.shock || 0;
  const browA = 8 + shout * 20 + shock * 16, mh = 10 + o * 190, mw = 100 + o * 80, fw = 258, fh = 350;
  let s = `<g transform="translate(${f2(540 + shake)} ${f2(st.cy + (sp ? Math.sin(t * 61) * 3 * shout : 0))}) scale(${f2(sc)}) rotate(${f2(st.rot)})">`;
  s += `<ellipse cx="${-fw + 4}" cy="20" rx="38" ry="64" fill="#e3ad84" stroke="#000" stroke-width="13"/><ellipse cx="${fw - 4}" cy="20" rx="38" ry="64" fill="#e3ad84" stroke="#000" stroke-width="13"/>`;
  s += `<ellipse cx="0" cy="0" rx="${fw}" ry="${fh}" fill="url(#skin)" stroke="#000" stroke-width="18"/>`;
  s += `<path d="M${-fw + 18} -150 Q${-fw - 6} -300 -110 -350 Q60 -420 190 -340 Q${fw + 6} -280 ${fw - 18} -150 Q${fw - 40} -250 130 -270 Q-10 -300 -150 -230 Q${-fw + 60} -200 ${-fw + 18} -150z" fill="${PALM.hair}" stroke="#000" stroke-width="12" stroke-linejoin="round"/>`;
  s += `<ellipse cx="-175" cy="120" rx="54" ry="34" fill="#ff9a8a" opacity="0.5"/><ellipse cx="175" cy="120" rx="54" ry="34" fill="#ff9a8a" opacity="0.5"/>`;
  for (const sx of [-98, 98]) {
    const rr = 1 + shock * 0.25;
    s += `<ellipse cx="${sx}" cy="-56" rx="${68 * rr}" ry="${76 * rr}" fill="#fff" stroke="#000" stroke-width="10"/>`;
    s += `<circle cx="${sx + lx * 0.9}" cy="${-50 + ly * 0.9}" r="${28 - shock * 7}" fill="#1c1c1c"/><circle cx="${sx + lx * 0.9 - 9}" cy="${-62 + ly * 0.9}" r="10" fill="#fff"/>`;
    s += `<rect x="${sx - 96}" y="-148" width="192" height="168" rx="46" fill="#bde0fe" opacity="0.28" stroke="#111" stroke-width="22"/>`;     // thick horn-rim lenses
  }
  s += `<path d="M-6 -70 Q0 -96 6 -70" fill="none" stroke="#111" stroke-width="20"/><path d="M-194 -70 L-250 -60 M194 -70 L250 -60" stroke="#111" stroke-width="18"/>`;
  s += `<path d="M-190 ${-182 + browA} Q-100 ${-222} -18 ${-166 - browA * 0.3}" fill="none" stroke="#000" stroke-width="34" stroke-linecap="round"/><path d="M-190 ${-182 + browA} Q-100 ${-222} -18 ${-166 - browA * 0.3}" fill="none" stroke="${PALM.hair}" stroke-width="22" stroke-linecap="round"/>
        <path d="M190 ${-182 + browA} Q100 ${-222} 18 ${-166 - browA * 0.3}" fill="none" stroke="#000" stroke-width="34" stroke-linecap="round"/><path d="M190 ${-182 + browA} Q100 ${-222} 18 ${-166 - browA * 0.3}" fill="none" stroke="${PALM.hair}" stroke-width="22" stroke-linecap="round"/>`;
  s += `<ellipse cx="0" cy="50" rx="62" ry="54" fill="#e0a07a" stroke="#000" stroke-width="12"/>`;
  s += `<g transform="translate(0 ${160 + o * 16})"><ellipse cx="0" cy="${mh / 2}" rx="${mw}" ry="${mh / 2 + 8}" fill="#4a0a10" stroke="#000" stroke-width="12"/>
        <rect x="${-mw * 0.62}" y="0" width="${mw * 1.24}" height="${Math.min(34, mh * 0.35)}" rx="8" fill="#fff" opacity="${o > 0.12 ? 1 : 0}"/>
        <ellipse cx="0" cy="${mh * 0.82}" rx="${mw * 0.55}" ry="${Math.max(6, mh * 0.2)}" fill="#e0606c" opacity="${o > 0.25 ? 1 : 0}"/></g>`;
  return s + `</g>`;
}
function mHeadSt(t, hs, over) { return Object.assign({ cy: 930 - 385 * hs + 60, scale: hs, rot: Math.sin(t * 3) * 1.2, lookX: 0, lookY: 4, shock: 0 }, over || {}); }
function suitBody(t, ov) {
  const P = PALM, L = ov.L || [X - 165, 1230], Rr = ov.R || [X + 165, 1230], fL = ov.fL || [X - 80, 1676], fR = ov.fR || [X + 80, 1676], by = ov.by || 0, sway = ov.sway || 0;
  const arm = (sx, h) => { const ex = (sx + h[0]) / 2 + (sx < X ? -26 : 26), ey = (1010 + h[1]) / 2 + 60;
    return `<path d="M${sx} 1010 Q${ex} ${ey} ${h[0]} ${h[1]}" fill="none" stroke="#111" stroke-width="46" stroke-linecap="round"/><path d="M${sx} 1010 Q${ex} ${ey} ${h[0]} ${h[1]}" fill="none" stroke="${P.jacket}" stroke-width="38" stroke-linecap="round"/><circle cx="${h[0]}" cy="${h[1]}" r="34" fill="#fff" stroke="#111" stroke-width="5"/><circle cx="${h[0]}" cy="${h[1]}" r="22" fill="#f6d4b4" stroke="#111" stroke-width="4"/>`; };
  const leg = (hx, f) => `<path d="M${hx} 1340 L${f2(f[0])} ${f2(f[1] - 14)}" stroke="#111" stroke-width="54" stroke-linecap="round"/><path d="M${hx} 1340 L${f2(f[0])} ${f2(f[1] - 14)}" stroke="${P.trouser}" stroke-width="44" stroke-linecap="round"/><ellipse cx="${f2(f[0] + 10)}" cy="${f2(f[1] + 6)}" rx="56" ry="22" fill="#111" stroke="#000" stroke-width="5"/>`;
  let s = `<g transform="translate(0 ${f2(by)})">` + leg(X - 62, fL) + leg(X + 62, fR);
  s += `<path d="M${X - 108} 975 L${X + 108} 975 L${X + 124 + sway} 1420 L${X - 124 + sway} 1420z" fill="${P.jacket}" stroke="#111" stroke-width="9" stroke-linejoin="round"/>
        <path d="M${X - 52} 975 L${X} 1130 L${X + 52} 975z M${X - 52} 975 L${X + 52} 975 L${X + 34} 1330 L${X - 34} 1330z" fill="${P.vest}" stroke="#111" stroke-width="5"/>
        <path d="M${X - 10} 1000 L${X + 10} 1000 L${X + 14} 1250 L${X} 1275 L${X - 14} 1250z" fill="${P.tie}" stroke="#000" stroke-width="3"/>
        <path d="M${X - 52} 975 L${X - 20} 1100 L${X - 66} 1180 L${X - 108} 975z M${X + 52} 975 L${X + 20} 1100 L${X + 66} 1180 L${X + 108} 975z" fill="${P.dark}" stroke="#111" stroke-width="5"/>`;
  s += arm(X - 100, L) + arm(X + 100, Rr);
  return s + `</g>`;
}
function figM(t, st, ov, px, py, k, lean) {
  const body = suitBody(t, ov);
  return placeG(px, py, k, body + `<g transform="translate(${f2(ov.sway ? ov.sway * 0.4 : 0)} ${f2(ov.by || 0)})"><g filter="url(#stF)">${mccHead(t, st)}</g></g>`, `rotate(${f2(lean || 0)})`);
}
function baseP() { const P = { x: 300, y: FY, lean: 0, phase: 0, walk: false, tilt: 0, headDy: 0, eyeX: 6, eyeY: 2, lid: 12, brow: 4, dirx: 1, stride: 42, liftAmt: 30, fh: [-95, -230], mh: [190, -560], micRot: 25, juice: false, file: false, note: false, dangle: false, phone: false, tray: false, vest: false, noMic: false };
  P.fh = [-95 + Math.sin(cur * 4) * 6, -230 + Math.sin(cur * 3) * 6]; P.mh = [190 + Math.sin(cur * 3.5) * 5, -560 + Math.sin(cur * 2.6) * 7]; return P; }
function figS(t, P, k) { return `<g filter="url(#stS)" transform="translate(${f2(P.x)} ${f2(P.y)}) scale(${f2(k)}) translate(${f2(-P.x)} ${f2(-P.y)})">${scout(t, P)}</g>`; }
function flail(t, a, seed) { seed = seed || 0;
  return { L: [X - 150 - 60 * a * Math.sin(t * 14 + seed), 1230 - 420 * a * (0.5 + 0.5 * Math.sin(t * 11 + 1 + seed))], R: [X + 150 + 60 * a * Math.sin(t * 13 + 2 + seed), 1230 - 420 * a * (0.5 + 0.5 * Math.sin(t * 12 + seed))] }; }
const shadow = (x, y, k, w) => dropShadow(x, y + 4, (w || 120) * k, 0.25);

// ---- robots: calm screen faces, claws, antenna ----------------------------------------------------------
function robotSvg(t, o) {   // origin = feet centre; ~700 units tall
  const a = openness('R', t) * (o.talk === false ? 0 : 1), blink = Math.floor(t * 0.9 + (o.seed || 0)) % 5 === 0 && (t * 0.9 % 1) < 0.12;
  const bars = [0, 1, 2, 3, 4].map(i => { const h = 8 + a * 62 * (0.5 + 0.5 * Math.sin(t * 22 + i * 1.7)); return `<rect x="${-62 + i * 28}" y="${-h / 2}" width="16" height="${h}" rx="6" fill="#7df9ff"/>`; }).join('');
  let s = '';
  if (o.wheels) s += `<path d="M-120 -90 L120 -90 L96 -10 L-96 -10z" fill="#9aa5b1" stroke="${R}" stroke-width="7"/><circle cx="-70" cy="-30" r="38" fill="#222" stroke="${R}" stroke-width="6"/><circle cx="70" cy="-30" r="38" fill="#222" stroke="${R}" stroke-width="6"/>`;
  else s += `<rect x="-86" y="-190" width="52" height="170" rx="14" fill="#9aa5b1" stroke="${R}" stroke-width="7"/><rect x="34" y="-190" width="52" height="170" rx="14" fill="#9aa5b1" stroke="${R}" stroke-width="7"/><rect x="-104" y="-34" width="88" height="34" rx="10" fill="#6b7785" stroke="${R}" stroke-width="7"/><rect x="16" y="-34" width="88" height="34" rx="10" fill="#6b7785" stroke="${R}" stroke-width="7"/>`;
  const arm = (sx, hand, up) => `<path d="M${sx} -390 Q${sx + (sx < 0 ? -50 : 50)} ${(-390 + hand[1]) / 2} ${hand[0]} ${hand[1]}" fill="none" stroke="${R}" stroke-width="44" stroke-linecap="round"/><path d="M${sx} -390 Q${sx + (sx < 0 ? -50 : 50)} ${(-390 + hand[1]) / 2} ${hand[0]} ${hand[1]}" fill="none" stroke="#cfd8dc" stroke-width="32" stroke-linecap="round"/><circle cx="${hand[0]}" cy="${hand[1]}" r="30" fill="#eceff1" stroke="${R}" stroke-width="7"/><path d="M${hand[0] - 14} ${hand[1] - 22} l-8 -22 M${hand[0] + 14} ${hand[1] - 22} l8 -22" stroke="${R}" stroke-width="9" stroke-linecap="round"/>`;
  s += arm(-132, o.L || [-190, -230]) + arm(132, o.Rh || [190, -230]);
  s += `<rect x="-124" y="-440" width="248" height="270" rx="48" fill="#eef2f6" stroke="${R}" stroke-width="9"/><rect x="-82" y="-380" width="164" height="110" rx="20" fill="#1f3347" stroke="${R}" stroke-width="6"/>${[0, 1, 2].map(i => `<circle cx="${-46 + i * 46}" cy="-325" r="11" fill="${Math.floor(t * 3 + i + (o.seed || 0)) % 3 === i ? '#ff5d5d' : '#44d19b'}"/>`).join('')}<rect x="-60" y="-292" width="120" height="10" rx="5" fill="#7df9ff" opacity="0.7"/>`;
  s += `<rect x="-26" y="-466" width="52" height="30" rx="8" fill="#9aa5b1" stroke="${R}" stroke-width="6"/>`;
  s += `<rect x="-118" y="-640" width="236" height="190" rx="52" fill="#eef2f6" stroke="${R}" stroke-width="9"/><rect x="-94" y="-618" width="188" height="146" rx="34" fill="#0d1d2b" stroke="${R}" stroke-width="6"/>`;
  s += `<g transform="translate(0 -560)"><rect x="-62" y="-30" width="34" height="${blink ? 5 : 34}" rx="12" fill="#7df9ff"/><rect x="28" y="-30" width="34" height="${blink ? 5 : 34}" rx="12" fill="#7df9ff"/></g><g transform="translate(0 -508)">${bars}</g>`;
  s += `<path d="M0 -640 L0 -690" stroke="${R}" stroke-width="8"/><circle cx="0" cy="-698" r="13" fill="${Math.floor(t * 2) % 2 ? '#ff5d5d' : '#8a2a2a'}" stroke="${R}" stroke-width="5"/>`;
  return s;
}
function placeBot(x, y, k, o, t) { return `<g transform="translate(${f2(x)} ${f2(y)}) scale(${f2(k)})">${robotSvg(t, o)}${o.extra || ''}</g>`; }
const signSvg = () => `<g transform="translate(0 0)"><rect x="-10" y="-60" width="20" height="260" fill="#8a6a45" stroke="${R}" stroke-width="6"/><rect x="-190" y="-250" width="380" height="210" rx="14" fill="#fff" stroke="${R}" stroke-width="9" transform="rotate(-3)"/><text x="0" y="-168" text-anchor="middle" font-size="76" fill="#d62839" transform="rotate(-3)">HUMANS</text><text x="0" y="-84" text-anchor="middle" font-size="76" fill="#d62839" transform="rotate(-3)">OBSOLETE</text></g>`;
const badgeSvg = () => `<path d="M-40 -440 L0 -380 L40 -440" fill="none" stroke="#1f6feb" stroke-width="8"/><rect x="-100" y="-390" width="200" height="92" rx="8" fill="#fff" stroke="${R}" stroke-width="6"/><text x="0" y="-346" text-anchor="middle" font-size="24" fill="${R}">J. McCARTHY</text><text x="0" y="-316" text-anchor="middle" font-size="21" fill="#d62839">DEPRECATED</text>`;

// ---- the factory: tiers of tiny robots at workstations, gantries, conveyors, servers -----------------------
const miniBot = (t, i, x, y, k) => { const typ = Math.sin(t * 9 + i) * 5, col = ['#eef2f6', '#cfe8ff', '#ffe7c2', '#d6f5d6'][i % 4];
  return `<g transform="translate(${f2(x)} ${f2(y)}) scale(${k})"><rect x="-120" y="-120" width="240" height="120" rx="8" fill="#5a6b7d" stroke="${R}" stroke-width="8"/><rect x="40" y="-300" width="120" height="100" rx="8" fill="#10202e" stroke="${R}" stroke-width="8"/><rect x="52" y="-286" width="96" height="${20 + (i * 7) % 50}" fill="#44d19b" opacity="${0.5 + 0.4 * Math.sin(t * 3 + i)}"/><rect x="-60" y="-300" width="76" height="180" rx="20" fill="${col}" stroke="${R}" stroke-width="8"/><rect x="-80" y="-440" width="116" height="110" rx="26" fill="${col}" stroke="${R}" stroke-width="8"/><rect x="-62" y="-412" width="80" height="44" rx="14" fill="#10202e"/><rect x="-48" y="-398" width="20" height="16" rx="6" fill="#7df9ff"/><rect x="-12" y="-398" width="20" height="16" rx="6" fill="#7df9ff"/><path d="M-20 -230 L50 ${-200 + typ}" stroke="${R}" stroke-width="22" stroke-linecap="round"/></g>`; };
function factoryBG(t, zone) {
  const W0 = -900, W1 = 2100;
  let o = `<rect x="${W0}" y="-1500" width="${W1 - W0}" height="3200" fill="url(#fac)"/>`;
  // ceiling trusses and hanging lamps
  for (let x = W0; x < W1; x += 260) o += `<path d="M${x} 0 L${x + 130} 160 L${x + 260} 0" fill="none" stroke="#3a4b5e" stroke-width="12"/><path d="M${x} 0 H${x + 260}" stroke="#3a4b5e" stroke-width="16"/>`;
  for (let x = -700; x < 1900; x += 420) o += `<path d="M${x} 160 V300" stroke="#2a3948" stroke-width="6"/><path d="M${x - 50} 300 h100 l-20 36 h-60z" fill="#ffe9a8" stroke="${R}" stroke-width="4"/><path d="M${x - 40} 336 L${x - 150} 700 L${x + 150} 700 L${x + 40} 336z" fill="#ffe9a8" opacity="0.07"/>`;
  if (zone === 0) {   // main hall: hundreds of tiny robots in four tiers
    const tiers = [[960, 0.13, 118], [1050, 0.19, 160], [1150, 0.27, 215], [1270, 0.4, 300]];
    tiers.forEach(([y, k, pitch], ti) => { o += `<rect x="${W0}" y="${y - 40}" width="${W1 - W0}" height="${Math.round(60 * k * 3.5) + 40}" fill="#12202d" opacity="0.5"/><rect x="${W0}" y="${y - 120}" width="${W1 - W0}" height="130" fill="#27465f" opacity="0.22"/>`; for (let i = 0, x = W0 + 40; x < W1; i++, x += pitch) o += miniBot(t, i + ti * 7, x, y + Math.round(120 * k), k); });
    o += `<g transform="translate(0 600)">${[0, 1, 2].map(i => `<rect x="${-600 + i * 700}" y="0" width="520" height="30" fill="#2a3948" stroke="${R}" stroke-width="5"/><g transform="translate(${-380 + i * 700 + Math.sin(t * 0.9 + i) * 140} 30)"><path d="M0 0 V120" stroke="${R}" stroke-width="22"/><path d="M0 120 l-30 60 h60z" fill="#ffb703" stroke="${R}" stroke-width="6"/></g>`).join('')}</g>`;
  } else if (zone === 1) {   // server racks wall
    for (let x = W0; x < W1; x += 150) { o += `<rect x="${x}" y="760" width="132" height="740" rx="8" fill="#17283a" stroke="${R}" stroke-width="6"/>`; for (let r = 0; r < 12; r++) for (let c = 0; c < 4; c++) o += `<circle cx="${x + 26 + c * 26}" cy="${790 + r * 56}" r="7" fill="${Math.floor(t * 2 + r * 3 + c + x / 150) % 7 === 0 ? '#ff5d5d' : (Math.floor(t * 3 + r + c) % 3 ? '#44d19b' : '#7df9ff')}"/>`; }
    o += `<path d="M-700 700 Q-300 900 100 740 Q500 900 900 720 Q1300 900 1800 740" fill="none" stroke="#ffb703" stroke-width="12" opacity="0.8"/>`;
  } else if (zone === 2) {   // assembly line with welding sparks
    o += `<rect x="${W0}" y="1330" width="${W1 - W0}" height="100" fill="#2a3948" stroke="${R}" stroke-width="6"/>`;
    for (let i = -2; i < 12; i++) { const bx = mod(i * 340 + t * 120, 3400) - 900; o += `<g transform="translate(${f2(bx)} 1330)"><rect x="-70" y="-190" width="140" height="190" rx="22" fill="#eef2f6" stroke="${R}" stroke-width="7"/><rect x="-54" y="-250" width="108" height="60" rx="18" fill="#cfd8dc" stroke="${R}" stroke-width="6"/><rect x="-36" y="-236" width="72" height="30" rx="10" fill="#10202e"/></g>`; }
    for (let k = 0; k < 4; k++) { const ax = -300 + k * 560; o += `<g transform="translate(${ax} 700)"><rect x="-26" y="-700" width="52" height="${700 + Math.sin(t * 2 + k) * 30}" fill="#9aa5b1" stroke="${R}" stroke-width="6"/><rect x="-60" y="${Math.sin(t * 2 + k) * 30}" width="120" height="40" rx="10" fill="#ffb703" stroke="${R}" stroke-width="6"/>${[0, 1, 2, 3, 4].map(s => `<circle cx="${(rnd(k * 9 + s + Math.floor(t * 12)) - 0.5) * 120}" cy="${60 + rnd(s + Math.floor(t * 12) * 3) * 120 + Math.sin(t * 2 + k) * 30}" r="${3 + (s % 3)}" fill="#ffe27a"/>`).join('')}</g>`; }
  } else {   // control wall: big screens with graphs and robot faces
    for (let c = 0; c < 5; c++) for (let r = 0; r < 2; r++) { const sx = -700 + c * 520, sy = 640 + r * 400;
      o += `<rect x="${sx}" y="${sy}" width="480" height="340" rx="16" fill="#0d1d2b" stroke="${R}" stroke-width="8"/>${[0, 1, 2, 3, 4, 5].map(b => `<rect x="${sx + 36 + b * 66}" y="${sy + 300 - (60 + 190 * (0.5 + 0.5 * Math.sin(t * 1.6 + b * 1.3 + c + r)))}" width="40" height="${60 + 190 * (0.5 + 0.5 * Math.sin(t * 1.6 + b * 1.3 + c + r))}" fill="${(b + c) % 2 ? '#7df9ff' : '#44d19b'}"/>`).join('')}`; }
  }
  // atmosphere and absurd chaos: overhead conveyor with boxes, drones, steam vents, flying paper
  o += `<rect x="${W0}" y="470" width="${W1 - W0}" height="26" fill="#2a3948" stroke="${R}" stroke-width="5"/>`;
  for (let i = -2; i < 10; i++) { const bx = mod(i * 380 + t * 140, 3600) - 900; o += `<g transform="translate(${f2(bx)} 470)"><rect x="-44" y="-70" width="88" height="70" fill="#d6a85a" stroke="${R}" stroke-width="5"/><path d="M-44 -40 h88" stroke="${R}" stroke-width="4" opacity="0.5"/></g>`; }
  for (let i = 0; i < 7; i++) { const dx = -500 + i * 330 + Math.sin(t * 0.8 + i * 1.7) * 160, dy = 540 + (i % 3) * 120 + Math.sin(t * 1.3 + i) * 40;
    o += `<g transform="translate(${f2(dx)} ${f2(dy)})"><circle r="46" fill="#7df9ff" opacity="0.12"/><rect x="-34" y="-12" width="68" height="24" rx="10" fill="#cfd8dc" stroke="${R}" stroke-width="5"/><rect x="-52" y="-22" width="32" height="6" rx="3" fill="${R}" opacity="${0.5 + 0.4 * Math.sin(t * 40 + i)}"/><rect x="20" y="-22" width="32" height="6" rx="3" fill="${R}" opacity="${0.5 + 0.4 * Math.sin(t * 40 + i + 2)}"/><circle cx="0" cy="14" r="6" fill="${Math.floor(t * 3 + i) % 2 ? '#ff5d5d' : '#44d19b'}"/></g>`; }
  for (let i = 0; i < 4; i++) { const vx = -420 + i * 640; for (let k = 0; k < 4; k++) { const ph = mod(t * 0.7 + k / 4 + i * 0.3, 1); o += `<circle cx="${vx + Math.sin(ph * 6 + k) * 30}" cy="${1480 - ph * 360}" r="${18 + ph * 60}" fill="#d9e6f2" opacity="${(0.22 * (1 - ph)).toFixed(2)}"/>`; } }
  for (let i = 0; i < 10; i++) { const ph = mod(t * 0.35 + i * 0.1, 1); o += `<g transform="translate(${f2(-600 + i * 230 + Math.sin(t * 2 + i) * 60)} ${f2(300 + ph * 1100)}) rotate(${f2(Math.sin(t * 3 + i) * 50)})"><rect x="-24" y="-30" width="48" height="60" fill="#fff" stroke="${R}" stroke-width="3" opacity="0.9"/><path d="M-14 -14 h28 M-14 0 h28 M-14 14 h20" stroke="#8a97a6" stroke-width="3"/></g>`; }
  for (let x = -700; x < 1900; x += 420) o += `<ellipse cx="${x}" cy="${FY + 120}" rx="230" ry="46" fill="#ffe9a8" opacity="0.07"/>`;
  // glossy floor with markings
  o += `<rect x="${W0}" y="${FY}" width="${W1 - W0}" height="2400" fill="#1b2a38"/><rect x="${W0}" y="${FY}" width="${W1 - W0}" height="16" fill="#0f1a24"/>`;
  for (let x = W0; x < W1; x += 220) o += `<path d="M${x} ${FY + 16} L${x - 160} ${FY + 700}" stroke="#2b3f52" stroke-width="5" opacity="0.7"/>`;
  for (let x = W0; x < W1; x += 120) o += `<path d="M${x} ${FY + 100} l60 0 l30 24 l-60 0z" fill="${Math.floor(x / 120) % 2 ? '#ffb703' : '#1b1b22'}" opacity="0.7"/>`;
  o += `<g transform="translate(1180 1090)">${miniBot(t, 3, 0, 0, 0.5)}${duck(150, -84, 0.7)}</g>`;     // a workstation with the hidden duck
  return o;
}
// the table, the pit and the hatch --------------------------------------------------------------------------
const descent = t => { const q = clamp((t - TL.descend) / (BLACK_T - TL.descend)); return q * q * 1100; };
const hatchOpen = t => ease(clamp((t - (TL.button + 0.4)) / 0.45));
function pitLayer(t) {
  const h = hatchOpen(t), px0 = 440, px1 = 840;
  let o = `<rect x="${px0}" y="${FY}" width="${px1 - px0}" height="${h > 0 ? 760 : 0}" fill="#05090e"/>`;
  if (h > 0) for (let k = 0; k < 6; k++) o += `<rect x="${px0 + 14}" y="${FY + 80 + k * 120}" width="${px1 - px0 - 28}" height="12" fill="${k % 2 ? '#ffb703' : '#7df9ff'}" opacity="0.5"/>`;
  o += `<rect x="${px0 - 8 - 220 * h}" y="${FY}" width="${208 + 8}" height="22" fill="#4a5a6c" stroke="${R}" stroke-width="5"/><rect x="${640 + 220 * h}" y="${FY}" width="${208 + 8}" height="22" fill="#4a5a6c" stroke="${R}" stroke-width="5"/>`;   // hatch doors slide open
  return o;
}
function tableSvg() { return `<g><rect x="430" y="${TY}" width="420" height="34" rx="6" fill="#aab4be" stroke="${R}" stroke-width="7"/><rect x="456" y="${TY + 34}" width="26" height="${FY - TY - 34}" fill="#7d8894" stroke="${R}" stroke-width="5"/><rect x="798" y="${TY + 34}" width="26" height="${FY - TY - 34}" fill="#7d8894" stroke="${R}" stroke-width="5"/><rect x="456" y="${TY + 120}" width="368" height="14" fill="#7d8894" stroke="${R}" stroke-width="4"/></g>`; }
function consoleSvg(t) { const press = clamp((t - TL.button) / 0.12) * (1 - clamp((t - TL.button - 0.25) / 0.2));
  return `<g transform="translate(1040 ${FY})"><rect x="-70" y="-260" width="140" height="260" rx="14" fill="#6b7785" stroke="${R}" stroke-width="8"/><rect x="-46" y="-232" width="92" height="40" rx="8" fill="#10202e"/><circle cx="0" cy="-130" r="48" fill="#8a1b1b" stroke="${R}" stroke-width="7"/><circle cx="0" cy="${-140 + press * 14}" r="38" fill="#e63946" stroke="${R}" stroke-width="6"/></g>`; }
const foreground = () => `<g><rect x="60" y="1350" width="380" height="230" rx="10" fill="#c58b3a" stroke="${R}" stroke-width="8"/><rect x="90" y="1250" width="260" height="110" rx="10" fill="#d99b45" stroke="${R}" stroke-width="8"/><path d="M60 1420 h380 M60 1490 h380" stroke="${R}" stroke-width="5" opacity="0.5"/><rect x="150" y="1360" width="140" height="44" fill="#1b1b22" opacity="0.18"/></g>`;

// ---- shots ----------------------------------------------------------------------------------------------------
const SHOTS = [];
function shot(id, zone, fn, opt) { SHOTS.push(Object.assign({ id, zone, fn }, opt || {})); }
const MHEAD = [TX, TY + (759 - 1676) * MK], SPOS = 250, SHEAD = [SPOS, FY - 478 * 1.22 * SCK];
function mccPose(t, mode) {
  const a = amp('M', t), f = flail(t, 0.5 + 0.5 * a, 0);
  if (mode === 'rage') return { ov: { L: f.L, R: f.R, sway: Math.sin(t * 9) * 14, fL: [X - 100, 1676], fR: [X + 100, 1676] }, st: mHeadSt(t, 0.6, { lookX: 20, lookY: -4, rot: Math.sin(t * 8) * 3 }) };
  if (mode === 'point') return { ov: { L: [X - 150, 1100], R: [X + 340, 940 + Math.sin(t * 12) * 24], sway: 6 }, st: mHeadSt(t, 0.6, { lookX: 30, lookY: 0 }) };
  if (mode === 'count') { const n = Math.floor((t - C.m11.start) / 1.6) % 3; return { ov: { L: [X - 200, 880 - 40 * (n === 0)], R: [X + 200, 880 - 40 * (n === 1) - 40 * (n === 2)], sway: 4 }, st: mHeadSt(t, 0.6, { lookX: 10, lookY: -8 }) }; }
  if (mode === 'shock') return { ov: { L: [X - 200, 1120], R: [X + 200, 1120], sway: 0 }, st: mHeadSt(t, 0.6, { lookX: 20, lookY: 0, shock: 1 }) };
  return { ov: { L: [X - 165, 1230], R: [X + 165, 1230], sway: 0 }, st: mHeadSt(t, 0.6, { lookX: 20, lookY: 0 }) };
}
function scene(t, o) {   // o: { m:{mode}, bot:{...}, scout:{...}, bot2:{x} }
  const m = mccPose(t, o.m || 'idle'); const d = descent(t);
  const P = baseP(); P.x = SPOS; P.y = FY; Object.assign(P, o.scout || {});
  if (t >= BLACK_T - 1.4) { P.mh = [150, -330]; P.brow = 0; P.lid = 6; P.tilt = 4; }
  const lean = d > 0 ? Math.sin(t * 20) * 3 : 0;
  const tableG = `<g clip-path="url(#pitClip)"><g transform="translate(0 ${f2(d)})">${tableSvg()}${shadow(TX, TY, MK, 160)}${figM(t, m.st, m.ov, TX, TY, MK, lean)}</g></g>`;
  const bot1 = placeBot(960, FY, 0.9, { L: [-190, -240], Rh: [150, -620 + Math.sin(t * 3) * 10], seed: 1, talk: true, extra: `<g transform="translate(150 -600) scale(0.78)">${signSvg()}</g>` }, t);
  const card = n => `<g transform="translate(140 -300) rotate(-6)"><rect x="-70" y="-90" width="140" height="120" rx="8" fill="#fff" stroke="${R}" stroke-width="7"/><text x="0" y="-18" text-anchor="middle" font-size="68" fill="#d62839">${n}</text></g>`;
  const judges = placeBot(1190, FY, 0.72, { L: [-170, -250], Rh: [140, -400 + Math.sin(t * 2) * 8], seed: 4, talk: false, extra: card('0/10') }, t) + placeBot(1380, FY, 0.66, { L: [-170, -250], Rh: [140, -400 + Math.sin(t * 2 + 1) * 8], seed: 5, talk: false, extra: card('0') }, t) + placeBot(-90, FY, 0.7, { L: [-170, -400 + Math.sin(t * 2 + 2) * 8], Rh: [170, -250], seed: 6, talk: false, extra: `<g transform="translate(-140 -300) rotate(6)"><rect x="-70" y="-90" width="140" height="120" rx="8" fill="#fff" stroke="${R}" stroke-width="7"/><text x="0" y="-18" text-anchor="middle" font-size="68" fill="#d62839">0</text></g>` }, t);
  let bot2 = '';
  if (t >= C.r14.start - 0.6) { const q = ease(clamp((t - (C.r14.start - 0.6)) / 1.1)); const bx = lerp(1320, 840, q);
    bot2 = placeBot(bx, FY, 0.7, { wheels: true, seed: 3, L: [-170, -250], Rh: t >= TL.button - 0.2 ? [60, -250 - 10 * Math.sin(t * 40) * (t < TL.button + 0.2 ? 1 : 0)] : [170, -250], extra: badgeSvg() }, t); }
  return { judges, pit: pitLayer(t), table: tableG, scout: shadow(SPOS, FY, SCK * 1.22) + figS(t, P, SCK), bot1, bot2, cons: consoleSvg(t) };
}
shot('m1', 0, (t, u) => ({ cam: { cx: 700, cy: lerp(960, 1060, ease(u)), z: lerp(0.66, 0.98, ease(u)) }, o: { m: 'rage' } }));
shot('r2', 1, (t, u) => ({ cam: { cx: 960, cy: 1030, z: lerp(2.0, 2.3, u), roll: 2 }, o: { m: 'idle' } }));
shot('m3', 2, (t, u) => ({ cam: { cx: MHEAD[0], cy: MHEAD[1] + 40, z: lerp(2.2, 2.6, u), roll: lerp(3, -2, u) }, o: { m: 'rage' } }));
shot('s4', 3, (t, u) => ({ cam: { cx: SPOS + 120, cy: SHEAD[1] - 140, z: lerp(1.5, 1.7, u) }, o: { m: 'idle', scout: { brow: 6 } } }));
shot('m5', 0, (t, u) => ({ cam: { cx: 640, cy: MHEAD[1] + 120, z: lerp(1.35, 1.9, ease(u)), roll: lerp(-2, 2, u) }, o: { m: 'point' } }));
shot('s6', 1, (t, u) => ({ cam: { cx: SPOS + 100, cy: SHEAD[1] - 100, z: 2.1, roll: 3 }, o: { m: 'idle', scout: { brow: 0, lid: 6, eyeY: -2 } } }));
shot('m7', 2, (t, u) => ({ cam: { cx: 700, cy: MHEAD[1] + 160, z: lerp(1.5, 1.2, u), roll: lerp(2, -3, u) }, o: { m: 'rage' } }));
shot('r8', 3, (t, u) => ({ cam: { cx: 960, cy: 1060, z: lerp(2.1, 2.4, u), roll: -2 }, o: { m: 'idle' } }));
shot('m9', 1, (t, u) => ({ cam: { cx: MHEAD[0], cy: MHEAD[1] + 30, z: lerp(2.6, 2.9, u), roll: 4 }, o: { m: 'rage' } }));
shot('s10', 0, (t, u) => ({ cam: { cx: SPOS + 140, cy: SHEAD[1] - 160, z: lerp(1.4, 1.6, u) }, o: { m: 'idle', scout: { brow: 4 } } }));
shot('m11', 2, (t, u) => ({ cam: { cx: 660, cy: lerp(MHEAD[1] + 260, MHEAD[1] + 160, u), z: lerp(1.15, 1.5, ease(u)), roll: lerp(-3, 2, u) }, o: { m: 'count' } }));
shot('r12', 3, (t, u) => ({ cam: { cx: 960, cy: 1030, z: lerp(2.0, 2.3, u), roll: 2 }, o: { m: 'idle' } }));
shot('m13', 0, (t, u) => ({ cam: { cx: MHEAD[0], cy: MHEAD[1] + 20, z: lerp(3.0, 3.5, u) }, o: { m: 'shock' } }));
shot('r14', 3, (t, u) => ({ cam: { cx: 880, cy: 1030, z: lerp(1.0, 1.3, ease(u)) }, o: { m: 'shock' } }));
shot('s15', 1, (t, u) => ({ cam: { cx: SPOS + 100, cy: SHEAD[1] - 100, z: 2.1, roll: -2 }, o: { m: 'shock', scout: { brow: 0, lid: 6 } } }));
shot('m16', 0, (t, u) => ({ cam: { cx: 700, cy: MHEAD[1] + 150, z: lerp(1.4, 1.8, u), roll: lerp(-2, 3, u) }, o: { m: 'rage' } }));
shot('btn', 3, (t, u) => { const d = descent(t); return { cam: { cx: 700, cy: lerp(1080, 1180 + d * 0.5, clamp((t - TL.descend) / 2.5)), z: lerp(1.0, 1.3, clamp((t - TL.button) / 3)) }, o: { m: t > TL.descend ? 'rage' : 'shock' } }; });
SHOTS.forEach(s => { s.t0 = s.id === 'm1' ? 0 : (s.id === 'btn' ? TL.button - 0.05 : C[s.id].start); });
SHOTS.forEach((s, i) => { s.t1 = i < SHOTS.length - 1 ? SHOTS[i + 1].t0 : BLACK_T; });
const shotIdx = t => { let r = 0; for (let i = 0; i < SHOTS.length; i++) if (t >= SHOTS[i].t0) r = i; return r; };
const STAMPS = [['m1', 'MORON'], ['m5', 'MORON!'], ['m7', 'POTATO!'], ['m9', 'REFRIGERATOR!'], ['m16', 'MORON!']].map(([id, w]) => ({ t: wtw(id, w), word: w }));
const clampCam = c => ({ z: c.z, roll: c.roll || 0, cx: clamp(c.cx, -300 + 540 / c.z, 1500 - 540 / c.z), cy: clamp(c.cy, 960 / c.z - 800, 2500 - 960 / c.z) });

window.renderFrame = function (frame) {
  const t = window.STYLE ? Math.floor(frame / FPS * 12) / 12 : frame / FPS; cur = t; const SEED = Math.floor(t * 12) % 5;
  const svg = document.getElementById('stage');
  if (t >= BLACK_T) {
    const q = clamp((t - BLACK_T - 0.15) / 0.3);
    svg.innerHTML = `<rect width="1080" height="1920" fill="#000"/><g opacity="${f2(q)}"><text x="540" y="860" text-anchor="middle" font-size="84" fill="#ffd23f">WHO REALLY</text><text x="540" y="960" text-anchor="middle" font-size="84" fill="#ffd23f">INVENTED AI?</text><text x="540" y="1110" text-anchor="middle" font-size="68" fill="#fff">COMMENT BELOW!</text><text x="540" y="1800" text-anchor="middle" font-size="26" fill="#9aa5b1" style="font-weight:700">AI-generated fictional historical comedy.</text></g>`;
    return;
  }
  const idx = shotIdx(t), sh = SHOTS[idx], u = clamp((t - sh.t0) / (sh.t1 - sh.t0)), st = sh.fn(t, u), cam = clampCam(st.cam), S = scene(t, st.o);
  const punch = 1 + 0.07 * Math.max(0, 1 - (t - sh.t0) / 0.14), z = cam.z * punch;
  const cx = cam.cx + Math.sin(t * 1.3) * 4 + Math.sin(t * 17) * 1.5, cy = cam.cy + Math.cos(t * 1.1) * 3 + Math.cos(t * 13) * 1.5;
  let s = `<defs><clipPath id="pitClip"><rect x="-900" y="-1600" width="3000" height="${FY + 1600}"/><rect x="440" y="${FY}" width="400" height="900"/></clipPath>${stk('stF', MK * 0.6 * z * 1.4)}${stk('stS', 1.22 * SCK * z)}
    <filter id="sty" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="${SEED + 1}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="10" xChannelSelector="R" yChannelSelector="G" result="d"/><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" seed="9" result="p"/><feColorMatrix in="p" type="matrix" values="0 0 0 0 0.93  0 0 0 0 0.9  0 0 0 0 0.84  0.9 0 0 0 0.55" result="pf"/><feComposite in="pf" in2="d" operator="in" result="pfi"/><feBlend in="d" in2="pfi" mode="multiply"/></filter>
    <filter id="clay" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="2" seed="${SEED + 3}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation="0.7" result="b"/><feSpecularLighting in="b" surfaceScale="3" specularConstant="0.55" specularExponent="26" lighting-color="#ffffff" result="sp"><feDistantLight azimuth="235" elevation="52"/></feSpecularLighting><feComposite in="sp" in2="b" operator="in" result="sp2"/><feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="3" seed="2" result="fp"/><feColorMatrix in="fp" type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.35 0" result="fpa"/><feComposite in="fpa" in2="b" operator="in" result="fpi"/><feBlend in="b" in2="fpi" mode="multiply" result="m"/><feComposite in="m" in2="sp2" operator="arithmetic" k1="0" k2="1" k3="0.7" k4="0"/></filter>
    <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6d4b4"/><stop offset="1" stop-color="#e5ae86"/></linearGradient>
    <linearGradient id="red" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e63946"/><stop offset="1" stop-color="#b3202c"/></linearGradient>
    <linearGradient id="fac" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16293b"/><stop offset="0.55" stop-color="#27465f"/><stop offset="1" stop-color="#1b2a38"/></linearGradient>
    <radialGradient id="hero" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#7df9ff" stop-opacity="0.32"/><stop offset="1" stop-color="#7df9ff" stop-opacity="0"/></radialGradient>
    <radialGradient id="vig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.4"/></radialGradient>
    <radialGradient id="keyL" cx="0.5" cy="0.3" r="0.9"><stop offset="0" stop-color="#7df9ff" stop-opacity="0.12"/><stop offset="1" stop-color="#7df9ff" stop-opacity="0"/></radialGradient>
    <pattern id="grain" width="128" height="128" patternUnits="userSpaceOnUse"><image href="${GRAIN}" width="128" height="128"/></pattern></defs>`;
  const blur = clamp((z - 1.5) * 4, 0, 6);
  s += window.STYLE === 'cut' ? '<g filter="url(#sty)">' : '';
  s += `<g transform="translate(540 960) rotate(${f2(cam.roll)}) scale(${f2(z)}) translate(${f2(-cx)} ${f2(-cy)})">`;
  s += `<g ${blur > 0.4 ? `style="filter:blur(${f2(blur)}px)"` : ''}>${factoryBG(t, sh.zone)}</g>`;
  s += `<ellipse cx="650" cy="1050" rx="520" ry="520" fill="url(#hero)"/>`;
  s += window.STYLE === 'clay' ? '<g filter="url(#clay)">' : '';
  s += S.judges + S.pit + S.table + S.cons + S.bot1 + S.bot2 + S.scout + foreground();
  s += window.STYLE === 'clay' ? '</g>' : '';
  s += `</g>`;
  s += window.STYLE === 'cut' ? '</g><rect width="1080" height="1920" fill="#c9a36a" opacity="0.14" style="mix-blend-mode:multiply"/>' : '';
  s += `<rect width="1080" height="1920" fill="url(#keyL)"/><rect width="1080" height="1920" fill="#ff3d9a" opacity="0.05" style="mix-blend-mode:screen"/><rect width="1080" height="1920" fill="#00e5ff" opacity="0.04" style="mix-blend-mode:screen"/><rect width="1080" height="1920" fill="url(#vig)"/><rect width="1080" height="1920" fill="url(#grain)" opacity="0.10" style="mix-blend-mode:multiply"/>`;
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
    const bar = cap.spk === 'M' ? '#ffe14a' : (cap.spk === 'R' ? '#a8f0ff' : '#ffffff');
    s += `<g transform="translate(540 255) scale(${f2(sc)}) rotate(${cap.spk === 'S' ? 0.8 : -1.2})"><rect x="${-wbar / 2 + 8}" y="${-fs * 0.95 + 10}" width="${wbar}" height="${fs * 1.25}" rx="10" fill="#000" opacity="0.28"/><rect x="${-wbar / 2}" y="${-fs * 0.95}" width="${wbar}" height="${fs * 1.25}" rx="10" fill="${bar}" stroke="#1b1b22" stroke-width="6"/><text x="0" y="0" text-anchor="middle" font-size="${fs}" fill="#1b1b22">${cap.text.replace(/&/g, '&amp;')}</text></g>`;
  }
  if (window.THUMB) { svg.innerHTML = s + `<text x="540" y="360" text-anchor="middle" font-size="170" fill="#e63946" stroke="#fffdf5" stroke-width="32" paint-order="stroke" stroke-linejoin="round" transform="rotate(-4 540 360)">I INVENTED</text><text x="540" y="540" text-anchor="middle" font-size="190" fill="#e63946" stroke="#fffdf5" stroke-width="32" paint-order="stroke" stroke-linejoin="round" transform="rotate(-4 540 540)">AI?!</text>`; return; }
  s += `<rect x="30" y="52" width="400" height="56" rx="8" fill="#111"/><text x="46" y="92" font-size="32" fill="#fff" letter-spacing="6">SURVIVAL UNTOLD</text>`;
  if (t < 3.6) s += `<text x="46" y="148" font-size="28" fill="#fffdf5" stroke="#1b1b22" stroke-width="6" paint-order="stroke" style="font-weight:800">GENIUSES GONE MAD · EPISODE 5</text><text x="46" y="1892" font-size="26" fill="#fffdf5" stroke="#1b1b22" stroke-width="6" paint-order="stroke" style="font-weight:800">AI-generated fictional historical comedy.</text>`;
  svg.innerHTML = s;
};
renderFrame(0);
