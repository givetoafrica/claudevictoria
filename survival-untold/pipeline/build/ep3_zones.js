// ===================== EPISODE 3: THE FOUR AIRPORT ZONES =====================================
function plane(x, y, sc, flip) {
  return `<g transform="translate(${x} ${y}) scale(${flip ? -sc : sc} ${sc})"><path d="M-170 0 Q-170 -26 -120 -28 L130 -28 Q190 -22 210 6 Q180 22 120 22 L-130 22 Q-170 22 -170 0z" fill="#fff" stroke="#1b1b22" stroke-width="6"/><path d="M-150 -26 L-210 -92 L-170 -92 L-110 -26z" fill="#e63946" stroke="#1b1b22" stroke-width="6"/><path d="M-20 18 L60 80 L20 80 L-60 18z" fill="#dfe6ee" stroke="#1b1b22" stroke-width="6"/>${[-110, -70, -30, 10, 50, 90].map(q => `<circle cx="${q}" cy="-6" r="7" fill="#8ecae6" stroke="#1b1b22" stroke-width="3"/>`).join('')}</g>`;
}
function hangSign(x, y, w, h, col, txt, tc, fs) {
  return `<g><line x1="${x - w / 2 + 40}" y1="${y - h / 2}" x2="${x - w / 2 + 40}" y2="${y - h / 2 - 140}" stroke="#6c7a89" stroke-width="6"/><line x1="${x + w / 2 - 40}" y1="${y - h / 2}" x2="${x + w / 2 - 40}" y2="${y - h / 2 - 140}" stroke="#6c7a89" stroke-width="6"/><rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="12" fill="${col}" stroke="#1b1b22" stroke-width="6"/><text x="${x}" y="${y + fs * 0.34}" text-anchor="middle" font-size="${fs}" fill="${tc}">${txt}</text></g>`;
}
function xray(cx, base, w, sc, t, alarm, label) {
  const bw = w * sc, bh = 230 * sc;
  let s = `<g>`;
  // belts either side
  s += `<rect x="${cx - bw / 2 - 340 * sc}" y="${base - 40 * sc}" width="${340 * sc}" height="${40 * sc}" fill="#3a4350" stroke="#1b1b22" stroke-width="4"/><rect x="${cx + bw / 2}" y="${base - 40 * sc}" width="${340 * sc}" height="${40 * sc}" fill="#3a4350" stroke="#1b1b22" stroke-width="4"/>`;
  for (let i = 0; i < 12; i++) { const bx = mod(i * 30 * sc + t * 50 * sc, 340 * sc); s += `<path d="M${cx - bw / 2 - 340 * sc + bx} ${base - 40 * sc} v${40 * sc}" stroke="#2b323c" stroke-width="3"/>`; }
  // suitcases on the exit belt
  for (let i = 0; i < 2; i++) { const q = mod(t * 45 * sc + i * 160 * sc, 330 * sc); s += `<rect x="${cx + bw / 2 + q}" y="${base - 40 * sc - 46 * sc}" width="${54 * sc}" height="${46 * sc}" rx="${6 * sc}" fill="${['#e76f51', '#264653'][i]}" stroke="#1b1b22" stroke-width="3"/>`; }
  s += `<rect x="${cx - bw / 2}" y="${base - bh}" width="${bw}" height="${bh}" rx="${16 * sc}" fill="#ced4da" stroke="#1b1b22" stroke-width="${6 * sc}"/>`;
  s += `<rect x="${cx - bw / 2 - 6 * sc}" y="${base - bh - 14 * sc}" width="${bw + 12 * sc}" height="${26 * sc}" rx="${8 * sc}" fill="#1d3557" stroke="#1b1b22" stroke-width="${5 * sc}"/>`;
  s += `<rect x="${cx - bw / 2 - 14 * sc}" y="${base - 150 * sc}" width="${90 * sc}" height="${110 * sc}" rx="${10 * sc}" fill="#0b1320" stroke="#1b1b22" stroke-width="${5 * sc}"/>`;
  for (let i = 0; i < 4; i++) s += `<rect x="${cx - bw / 2 - 6 * sc + i * 20 * sc}" y="${base - 150 * sc}" width="${14 * sc}" height="${110 * sc}" fill="#16202e" opacity="0.8"/>`;
  s += `<text x="${cx + 20 * sc}" y="${base - bh + 62 * sc}" text-anchor="middle" font-size="${26 * sc}" fill="#1d3557">${label}</text>`;
  const on = alarm && Math.floor(t * 4) % 2 === 0;
  s += `<circle cx="${cx + bw / 2 - 40 * sc}" cy="${base - bh - 30 * sc}" r="${16 * sc}" fill="${on ? '#ff3b30' : '#7a1f1f'}" stroke="#1b1b22" stroke-width="${4 * sc}"/>`;
  if (on) s += `<circle cx="${cx + bw / 2 - 40 * sc}" cy="${base - bh - 30 * sc}" r="${90 * sc}" fill="#ff3b30" opacity="0.25"/>`;
  return s + `</g>`;
}
function tileFloor(y0, vpx, vpy, col, line) {
  let s = `<rect x="-300" y="${y0}" width="1680" height="${1920 - y0}" fill="${col}"/>`;
  for (let i = -16; i <= 16; i++) s += `<path d="M${vpx + i * 26} ${y0} L${vpx + i * 230} 1920" stroke="${line}" stroke-width="3"/>`;
  [8, 26, 58, 112, 190, 300, 440, 610, 800, 1010].forEach(d => { const y = y0 + d; if (y < 1920) s += `<path d="M-300 ${y} H1380" stroke="${line}" stroke-width="3"/>`; });
  return s;
}

// ---- ZONE 1: the great hall (extreme-wide) ---------------------------------------------------
const HALL = { franklin: [430, 1150], scout: [250, 1262], kite: [488, 1052] };
function zoneHall(t, o) {
  o = o || {};
  let s = `<rect x="-300" width="1680" height="450" fill="#e7edf3"/>`;
  for (let i = 0; i < 6; i++) { const y = 40 + i * 62, w = 1000 - i * 120; s += `<rect x="${540 - w / 2}" y="${y}" width="${w}" height="16" rx="8" fill="#fff" opacity="${(0.95 - i * 0.1).toFixed(2)}"/>`; }
  s += `<defs><linearGradient id="skyH" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ecae6"/><stop offset="1" stop-color="#e0f4ff"/></linearGradient></defs><rect x="-300" y="450" width="1680" height="440" fill="url(#skyH)"/>`;
  s += `<circle cx="900" cy="560" r="64" fill="#fff3b0"/>`;
  s += `<rect x="-300" y="780" width="1680" height="110" fill="#8d99ae"/><path d="M0 840 H1380" stroke="#fff" stroke-width="6" stroke-dasharray="60 40"/>`;
  s += plane(300 + Math.sin(t * 0.2) * 20, 740, 0.42, false) + plane(820 + (t * 6) % 40, 696, 0.3, true);
  for (let i = -3; i < 12; i++) s += `<rect x="${i * 135 - 4}" y="450" width="12" height="440" fill="#6c7a89"/>`;
  s += `<rect x="-300" y="880" width="1680" height="14" fill="#6c7a89"/>`;
  s += hangSign(540, 330, 400, 82, '#1d3557', 'SECURITY', '#fff', 56);
  // ceiling PA speaker
  s += `<g transform="translate(830 330)"><line x1="0" y1="-60" x2="0" y2="-26" stroke="#6c7a89" stroke-width="6"/><rect x="-62" y="-26" width="124" height="62" rx="12" fill="#f8f9fa" stroke="#1b1b22" stroke-width="6"/>${[-30, -10, 10, 30].map(x => `<line x1="${x}" y1="-14" x2="${x}" y2="24" stroke="#adb5bd" stroke-width="6"/>`).join('')}</g>`;
  // light shafts from the windows (far layer)
  for (let i = 0; i < 4; i++) s += `<path d="M${120 + i * 270 + Math.sin(t * 0.3 + i) * 20} 450 L${240 + i * 270} 450 L${460 + i * 290} 1500 L${200 + i * 290} 1500z" fill="#fff6d6" opacity="0.10"/>`;
  s += '@@MID@@';
  s += tileFloor(894, 540, 894, '#f6f2e9', '#e3ded1');
  s += `<rect x="-300" y="1000" width="1680" height="360" fill="url(#skyH)" opacity="0.05"/>`;
  // side machines + hero machine (checkpoint 4)
  s += xray(100, 1130, 360, 0.5, t, o.alarm, '') + xray(1000, 1130, 360, 0.5, t, o.alarm, '');
  s += xray(650, 1190, 400, 1.0, t, o.alarm, 'CHECKPOINT 4');
  // hidden duck in a tray on the belt, never acknowledged
  s += `<rect x="318" y="1128" width="64" height="22" rx="4" fill="#9aa5b1" stroke="#1b1b22" stroke-width="3"/>${duck(350, 1126, 0.34, false)}`;
  // queue ropes, then passengers
  for (let r = 0; r < 4; r++) {
    const y = 1350 + r * 95;
    s += `<path d="M-280 ${y - 44} H1360" stroke="${r % 2 ? '#1d3557' : '#e63946'}" stroke-width="${5 + r}" opacity="0.8"/>`;
    for (let q = -2; q < 11; q++) s += `<rect x="${q * 150 + 24 - r * 4}" y="${y - 70}" width="${8 + r}" height="${70 + r * 8}" fill="#6c7a89" stroke="#1b1b22" stroke-width="2"/>`;
  }
  const list = [];
  for (let r = 0; r < 4; r++) for (let q = 0; q < 13; q++) {
    const i = r * 13 + q, x = -260 + mod(q * 117 + r * 57, 1600), y = 1345 + r * 95, k = 0.3 + r * 0.075;
    if (x < 640 && y < 1330) continue;
    list.push({ x, y, k, i, mode: i % 4 === 0 ? 'film' : 'stare' });
  }
  for (let q = 0; q < 14; q++) list.push({ x: 40 + mod(q * 97, 1000), y: 1130 + (q % 3) * 14, k: 0.2, i: 40 + q, mode: q % 3 === 0 ? 'film' : 'stare' });
  for (let w = 0; w < 5; w++) { const dir = w % 2 ? -1 : 1, v = 38 + w * 9, x = mod(w * 410 + dir * t * v, 1800) - 360; list.push({ x: dir > 0 ? x : 1440 - (x + 360), y: 1262 + (w % 3) * 18, k: 0.34, i: 60 + w, mode: 'walk', dir }); }
  list.sort((a, b) => a.y - b.y).forEach(p => { if (p.y < 1200 || o.crowd !== false) s += pax(p.x + (p.mode === 'walk' ? 0 : Math.sin(t * 0.5 + p.i) * 5), p.y, p.k, p.i, t, p.mode, false, p.dir); });
  // security officers watching
  s += pax(780, 1260, 0.42, 91, t, 'stare', true) + pax(880, 1255, 0.4, 92, t, 'stare', true);
  return s;
}

// ---- ZONE 2: the X-ray tunnel and belt (two-shot) ---------------------------------------------
const SCAN = { franklin: [330, 1456], scout: [800, 1712], tunnel: [640, 1290] };
function zoneScanner(t, o) {
  o = o || {};
  let s = `<rect x="-300" width="1680" height="1540" fill="#f1faee"/>`;
  s += `<rect x="-300" width="1680" height="520" fill="#e4eef0"/>`;
  for (let i = 0; i < 8; i++) s += `<rect x="${i * 150 + 10}" y="40" width="110" height="90" rx="10" fill="#fff" opacity="0.8"/>`;
  // faded queue in the back
  s += `<g opacity="0.5">`;
  for (let q = 0; q < 14; q++) s += pax(30 + q * 80, 1000, 0.55, q * 2 + 3, t, q % 4 === 0 ? 'film' : 'stare');
  s += `</g>`;
  s += '@@MID@@';
  s += tileFloor(1540, 540, 1540, '#dfe7ea', '#c8d3d7');
  // the X-ray machine
  s += `<rect x="560" y="740" width="640" height="700" rx="26" fill="#ced4da" stroke="#1b1b22" stroke-width="9"/><rect x="540" y="700" width="680" height="64" rx="18" fill="#1d3557" stroke="#1b1b22" stroke-width="8"/>`;
  s += `<rect x="690" y="830" width="300" height="200" rx="14" fill="#0b1320" stroke="#1b1b22" stroke-width="8"/>`;
  const sweep = mod(t * 90, 280);
  s += `<path d="M770 990 L840 860 L910 990 L840 960z" fill="none" stroke="#06d6a0" stroke-width="6" opacity="0.8"/><rect x="${700 + sweep}" y="840" width="6" height="180" fill="#06d6a0" opacity="0.7"/>`;
  s += `<rect x="560" y="1170" width="260" height="250" rx="20" fill="#0b0f16" stroke="#1b1b22" stroke-width="8"/>`;
  for (let i = 0; i < 5; i++) s += `<rect x="${562 + i * 12}" y="1172" width="9" height="246" rx="4" fill="#2b323c"/>`;
  const on = o.alarm && Math.floor(t * 4) % 2 === 0;
  s += `<circle cx="1110" cy="690" r="26" fill="${on ? '#ff3b30' : '#7a1f1f'}" stroke="#1b1b22" stroke-width="6"/>` + (on ? `<circle cx="1110" cy="690" r="150" fill="#ff3b30" opacity="0.22"/>` : '');
  // belt
  s += `<rect x="-60" y="1450" width="640" height="84" fill="#343a40" stroke="#1b1b22" stroke-width="7"/><rect x="-60" y="1450" width="640" height="14" fill="#6c757d"/>`;
  for (let i = 0; i < 24; i++) s += `<path d="M${mod(i * 30 - t * 70, 700) - 60} 1464 v70" stroke="#23282d" stroke-width="4"/>`;
  s += `<g><rect x="90" y="1432" width="150" height="22" rx="5" fill="#9aa5b1" stroke="#1b1b22" stroke-width="4"/>${duck(150, 1430, 0.5, false)}<rect x="400" y="1432" width="150" height="22" rx="5" fill="#9aa5b1" stroke="#1b1b22" stroke-width="4"/><ellipse cx="450" cy="1424" rx="28" ry="12" fill="#6d4c41" stroke="#1b1b22" stroke-width="3"/><ellipse cx="500" cy="1424" rx="28" ry="12" fill="#6d4c41" stroke="#1b1b22" stroke-width="3"/></g>`;
  return s;
}

// ---- ZONE 3: the liquids counter (two-shot) ---------------------------------------------------
function zoneTableBack(t, o) {
  o = o || {};
  let s = `<rect x="-300" width="1680" height="1500" fill="#e9f5db"/><rect x="-300" y="0" width="1680" height="360" fill="#d7e8c8"/>`;
  s += `<g transform="translate(540 380)"><rect x="-290" y="-110" width="580" height="200" rx="20" fill="#fff" stroke="#1b1b22" stroke-width="8"/><rect x="-290" y="-110" width="580" height="54" rx="20" fill="#e63946"/><text y="-68" text-anchor="middle" font-size="40" fill="#fff">LIQUIDS: 100 ML MAX</text><g transform="translate(-130 12)"><path d="M-16 -40 h32 v20 l16 20 v50 h-64 v-50 l16 -20z" fill="#8ecae6" stroke="#1b1b22" stroke-width="5"/><path d="M-50 -48 L50 62" stroke="#e63946" stroke-width="9"/></g><text x="70" y="22" text-anchor="middle" font-size="34" fill="#1b1b22">SMALL BOTTLES</text><text x="70" y="64" text-anchor="middle" font-size="34" fill="#1b1b22">IN A CLEAR BAG</text></g>`;
  s += '@@MID@@';
  s += tileFloor(1180, 540, 1180, '#d7e8c8', '#c3d9b1');
  // the people behind: one starts to clap
  const clapT = o.clapT == null ? 1e9 : o.clapT;
  const people = [[110, 1170, 0.5, 5], [250, 1175, 0.52, 8], [820, 1172, 0.52, 12], [930, 1168, 0.5, 17], [1030, 1175, 0.5, 23], [40, 1180, 0.52, 31]];
  people.forEach(([x, y, k, i]) => { s += pax(x, y, k, i, t, 'stare'); });
  [[680, 1175, 0.54, 4, 0], [570, 1172, 0.5, 14, 1.2], [760, 1170, 0.52, 19, 2.0]].forEach(([x, y, k, i, d]) => {
    s += pax(x, y, k, i, t, t > clapT + d ? 'clap' : (i === 4 ? 'film' : 'stare'));
  });
  return s;
}
function zoneTableFront(t) {
  let s = `<rect x="-30" y="1486" width="1140" height="40" rx="8" fill="#e9ecef" stroke="#1b1b22" stroke-width="7"/><rect x="-30" y="1526" width="1140" height="420" fill="#adb5bd" stroke="#1b1b22" stroke-width="7"/><rect x="-30" y="1560" width="1140" height="16" fill="#1d3557"/>`;
  s += `<g><rect x="160" y="1460" width="190" height="28" rx="6" fill="#9aa5b1" stroke="#1b1b22" stroke-width="5"/><rect x="400" y="1460" width="190" height="28" rx="6" fill="#9aa5b1" stroke="#1b1b22" stroke-width="5"/>${duck(470, 1458, 0.46, false)}</g>`;
  s += `<g transform="translate(910 1470)"><path d="M-88 0 q0 -90 88 -90 q88 0 88 90z" fill="#8a5a2b" stroke="#1b1b22" stroke-width="7"/><path d="M-60 -78 q60 -40 120 0" fill="none" stroke="#1b1b22" stroke-width="6"/><rect x="-30" y="-52" width="60" height="30" rx="6" fill="#d4a017" stroke="#1b1b22" stroke-width="5"/></g>`;
  s += `<g transform="translate(700 1480)"><rect x="-14" y="-52" width="28" height="52" rx="6" fill="#4cc9f0" stroke="#1b1b22" stroke-width="4"/><rect x="-10" y="-62" width="20" height="12" fill="#e63946"/><rect x="40" y="-44" width="24" height="44" rx="6" fill="#ffd23f" stroke="#1b1b22" stroke-width="4"/></g>`;
  return s;
}

// ---- ZONE 4: the terminal exit doors ----------------------------------------------------------
function zoneDoors(t, o) {
  o = o || {};
  const open = o.open || 0;
  let s = `<rect x="-300" width="1680" height="1920" fill="#eef3f6"/><rect x="-300" width="1680" height="640" fill="#e1eaef"/>`;
  s += hangSign(540, 560, 300, 74, '#2a9d8f', 'EXIT →', '#fff', 46);
  // outside, seen through the doors
  s += `<defs><linearGradient id="skyD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4cc9f0"/><stop offset="1" stop-color="#e0f7ff"/></linearGradient><clipPath id="doorHole"><rect x="250" y="700" width="580" height="900"/></clipPath></defs>`;
  s += `<g clip-path="url(#doorHole)"><rect x="250" y="700" width="580" height="900" fill="url(#skyD)"/><circle cx="700" cy="860" r="70" fill="#fff3b0"/><rect x="250" y="1400" width="580" height="200" fill="#9aa5b1"/><rect x="250" y="1380" width="580" height="30" fill="#e9ecef"/><rect x="300" y="1220" width="270" height="170" rx="20" fill="#ffb703" stroke="#1b1b22" stroke-width="7"/><rect x="320" y="1250" width="110" height="64" fill="#8ecae6"/><rect x="450" y="1250" width="90" height="64" fill="#8ecae6"/><circle cx="360" cy="1392" r="30" fill="#1b1b22"/><circle cx="520" cy="1392" r="30" fill="#1b1b22"/>${plane(690 + (t * 14) % 60, 1000, 0.34, false)}</g>`;
  // door panels (slide apart when open)
  const sh = open * 270;
  s += `<g clip-path="url(#doorHole)"><rect x="${250 - sh}" y="700" width="292" height="900" fill="#bde0fe" opacity="0.32" stroke="#1b1b22" stroke-width="10"/><rect x="${538 + sh}" y="700" width="292" height="900" fill="#bde0fe" opacity="0.32" stroke="#1b1b22" stroke-width="10"/>
        <path d="M${290 - sh} 760 L${360 - sh} 700 M${320 - sh} 1000 L${470 - sh} 700" stroke="#fff" stroke-width="12" opacity="0.5"/><rect x="${510 - sh}" y="1130" width="14" height="160" rx="6" fill="#adb5bd" stroke="#1b1b22" stroke-width="4"/><rect x="${556 + sh}" y="1130" width="14" height="160" rx="6" fill="#adb5bd" stroke="#1b1b22" stroke-width="4"/></g>`;
  s += `<rect x="226" y="676" width="628" height="40" fill="#1d3557" stroke="#1b1b22" stroke-width="8"/><rect x="226" y="676" width="30" height="940" fill="#1d3557" stroke="#1b1b22" stroke-width="8"/><rect x="824" y="676" width="30" height="940" fill="#1d3557" stroke="#1b1b22" stroke-width="8"/>`;
  s += `<text x="540" y="706" text-anchor="middle" font-size="26" fill="#fff">AUTOMATIC DOORS</text>`;
  s += tileFloor(1612, 540, 1612, '#e9edf0', '#d5dce1');
  s += `<rect x="-300" y="1612" width="1680" height="200" fill="url(#skyD)" opacity="0.08"/>`;
  [[90, 1560, 0.5, 7], [980, 1560, 0.5, 21]].forEach(([x, y, k, i]) => { s += pax(x, y, k, i, t, 'stare'); });
  return s;
}
