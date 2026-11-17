// ===== EXTRAS: insult-triggered gags, Edison portrait, toaster, calm pigeon =============
function edisonPortrait(t) {
  const tc = wt('T1', 'CANDLE?!'), tl = wt('T1', 'LICENSE?!'), tp = wt('T1', 'POTATO');
  const burn = seg(t, tl, tp + 0.2);
  const hit = t >= tc && t < tc + 0.45, shake = (t >= tc && t < tl + 1.5) ? Math.sin(t * 60) * 2.5 : 0;
  let s = `<g transform="translate(${f2(150 + shake)} 640) rotate(-5)">`;
  s += `<rect x="-105" y="-135" width="210" height="270" rx="10" fill="#ffd166" stroke="#111" stroke-width="8"/><rect x="-85" y="-115" width="170" height="230" fill="#f1faee" stroke="#111" stroke-width="4"/>`;
  s += `<path d="M-70 112 q0 -70 70 -70 q70 0 70 70z" fill="#33415c" stroke="#111" stroke-width="4"/>`;
  s += `<circle cx="0" cy="-22" r="62" fill="#f6d4b4" stroke="#111" stroke-width="5"/><circle cx="0" cy="-22" r="62" fill="#1b1b1b" opacity="${f2(burn)}"/>`;
  s += `<path d="M-66 -40 Q-74 -96 -26 -86 L-18 -112 L0 -88 L20 -112 L28 -86 Q76 -96 66 -40 Q40 -70 0 -66 Q-40 -70 -66 -40z" fill="#e5e5ea" stroke="#111" stroke-width="4" opacity="${f2(1 - burn * 0.8)}"/>`;
  s += `<circle cx="-22" cy="-28" r="15" fill="#fff" stroke="#111" stroke-width="3"/><circle cx="22" cy="-28" r="15" fill="#fff" stroke="#111" stroke-width="3"/><circle cx="${-22 + burn * 3}" cy="-26" r="${f2(6 - burn * 3.5)}" fill="#111"/><circle cx="${22 + burn * 3}" cy="-26" r="${f2(6 - burn * 3.5)}" fill="#111"/>`;
  s += `<path d="M-52 4 Q-30 -14 0 2 Q30 -14 52 4 Q44 24 22 12 Q0 6 -22 12 Q-44 24 -52 4z" fill="#f2f2f2" stroke="#111" stroke-width="4" opacity="${f2(1 - burn * 0.6)}"/>`;
  if (burn > 0.5) s += `<ellipse cx="0" cy="26" rx="14" ry="${f2(8 + burn * 6)}" fill="#fff" stroke="#111" stroke-width="3"/>`;
  s += `<rect x="-62" y="120" width="124" height="22" rx="4" fill="#fbf4e1" stroke="#111" stroke-width="4"/><text y="137" text-anchor="middle" font-size="15" fill="#111">T. EDISON</text>`;
  // spark zap
  if (t >= tc && t < tc + 0.5) { const op = 1 - (t - tc) / 0.5;
    s += `<path d="M-140 -190 L-90 -140 L-120 -126 L-60 -76 L-84 -64 L-20 0" fill="none" stroke="#fff" stroke-width="12" stroke-linejoin="round" opacity="${f2(op)}"/><path d="M-140 -190 L-90 -140 L-120 -126 L-60 -76 L-84 -64 L-20 0" fill="none" stroke="#ffd23f" stroke-width="5" stroke-linejoin="round" opacity="${f2(op)}"/>`; }
  // flames and smoke after the business-license burn
  if (t >= tl && t < C.T1.end + 1.2) {
    for (let i = 0; i < 3; i++) { const fx = -70 + i * 70, hh = 40 + Math.sin(t * 18 + i * 2) * 14 + burn * 20; s += `<path d="M${fx} -130 q-26 -${f2(hh * 0.5)} -6 -${f2(hh)} q-4 ${f2(hh * 0.4)} 18 ${f2(hh * 0.2)} q18 ${f2(hh * 0.3)} -12 ${f2(hh * 0.8)}z" fill="#ff7b00" stroke="#111" stroke-width="3"/><path d="M${fx} -130 q-12 -${f2(hh * 0.3)} 0 -${f2(hh * 0.6)} q10 ${f2(hh * 0.3)} 0 ${f2(hh * 0.6)}z" fill="#ffd23f"/>`; }
    for (let i = 0; i < 5; i++) { const ph = mod(t * 0.9 + i / 5, 1); s += `<circle cx="${(-50 + i * 26 + Math.sin(ph * 6 + i) * 14).toFixed(0)}" cy="${(-150 - ph * 170).toFixed(0)}" r="${(16 + ph * 26).toFixed(0)}" fill="#6c757d" stroke="#111" stroke-width="3" opacity="${f2(0.8 * (1 - ph))}"/>`; }
  }
  return s + `</g>`;
}

function toasterSprite() {
  return `<rect x="-70" y="-62" width="140" height="62" rx="20" fill="#c9ced6" stroke="#111" stroke-width="7"/><rect x="-46" y="-70" width="34" height="14" rx="5" fill="#111"/><rect x="12" y="-70" width="34" height="14" rx="5" fill="#111"/><circle cx="-48" cy="-24" r="8" fill="#e63946" stroke="#111" stroke-width="3"/><rect x="26" y="-28" width="22" height="10" rx="3" fill="#6c757d" stroke="#111" stroke-width="3"/>`;
}
function toasterGag(t) {
  const tt = wt('T7', 'UNDERCOOKED');
  let s = `<g><ellipse cx="985" cy="1795" rx="86" ry="18" fill="#000" opacity="0.2"/><rect x="975" y="1700" width="22" height="92" fill="#8a5a2b" stroke="#111" stroke-width="6"/><ellipse cx="985" cy="1698" rx="92" ry="24" fill="#c58b4a" stroke="#111" stroke-width="7"/></g>`;
  const q = t - tt;
  if (t < tt) return s + `<g transform="translate(985 1690)">${toasterSprite()}<path d="M70 -14 q40 -10 46 -40" fill="none" stroke="#111" stroke-width="5"/></g>`;
  if (q < 1.4) { const x = 985 - q * 760, y = 1690 - q * 520 + q * q * 520 * 0.9, rot = -q * 540;
    s += `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(rot)})">${toasterSprite()}<path d="M70 -14 q${f2(40 + Math.sin(q * 20) * 20)} -10 46 -40" fill="none" stroke="#111" stroke-width="5"/></g>`;
    for (let i = 0; i < 2; i++) { const x2 = 985 - q * (360 + i * 220), y2 = 1640 - q * 760 + q * q * 560, r2 = q * (300 + i * 120);
      s += `<g transform="translate(${f2(x2)} ${f2(y2)}) rotate(${f2(r2)})"><rect x="-26" y="-26" width="52" height="52" rx="8" fill="#d4a373" stroke="#111" stroke-width="5"/><rect x="-18" y="-18" width="36" height="36" rx="5" fill="#e9c46a"/></g>`; }
  }
  return s;
}

function doodle(word, q, x, y) {   // q = seconds since the insult landed
  const pop = ease(clamp(q / 0.18)), fade = q > 0.6 ? clamp(1 - (q - 0.6) / 0.35) : 1;
  const w = word;
  let g = '';
  if (w === 'CANDLE') g = `<rect x="-22" y="-10" width="44" height="${f2(80 - q * 40)}" fill="#fff6d6" stroke="#111" stroke-width="5"/><path d="M0 -14 q-22 -22 0 -52 q22 30 0 52z" fill="#ff7b00" stroke="#111" stroke-width="4"/><path d="M-30 ${f2(70 - q * 40)} q30 16 60 0" fill="#fff6d6" stroke="#111" stroke-width="4"/>`;
  else if (w === 'LICENSE') g = `<path d="M-70 10 Q-40 -20 0 4 Q40 -20 70 10 Q56 34 22 18 Q0 12 -22 18 Q-56 34 -70 10z" fill="#e8e8ec" stroke="#111" stroke-width="5"/><rect x="-44" y="30" width="88" height="46" rx="6" fill="#fff" stroke="#111" stroke-width="4"/><text y="62" text-anchor="middle" font-size="22" fill="#e63946">LICENSE</text>`;
  else if (w === 'POTATO') g = `<ellipse rx="64" ry="42" fill="#c99a5b" stroke="#111" stroke-width="5" transform="rotate(-12)"/><circle cx="-20" cy="-8" r="5" fill="#8a6430"/><circle cx="22" cy="10" r="5" fill="#8a6430"/><path d="M60 -6 l30 -10 M60 8 l30 4" stroke="#111" stroke-width="6"/><path d="M92 -22 l10 -16 l6 14 l12 -8" fill="none" stroke="#ffd23f" stroke-width="5"/>`;
  else if (w === 'LABORATORY') g = `<path d="M-18 -70 h36 v40 l44 78 h-124 l44 -78z" fill="#9be7ff" stroke="#111" stroke-width="5"/>${[0, 1, 2].map(i => `<circle cx="${-10 + i * 14}" cy="${-30 - mod(q * 90 + i * 30, 70)}" r="${6 + i * 2}" fill="#fff" stroke="#111" stroke-width="3"/>`).join('')}`;
  else if (w === 'THUNDERSTORM' || w === 'THUNDER') g = `<ellipse rx="70" ry="38" fill="#9aa5b1" stroke="#111" stroke-width="5"/><circle cx="-34" cy="-18" r="30" fill="#9aa5b1" stroke="#111" stroke-width="5"/><circle cx="20" cy="-30" r="36" fill="#9aa5b1" stroke="#111" stroke-width="5"/><path d="M6 20 l-26 46 h20 l-14 40 l44 -56 h-22 l16 -30z" fill="#ffd23f" stroke="#111" stroke-width="4"/>`;
  else if (w === 'SOCK') g = `<path d="M-24 -66 h50 v56 q54 22 46 60 q-8 30 -62 22 q-44 -8 -50 -46z" fill="#fff" stroke="#111" stroke-width="5"/>${[0, 1, 2].map(i => `<path d="M${-30 + i * 30} ${40 + mod(q * 120 + i * 30, 60)} q8 16 0 22 q-8 -6 0 -22z" fill="#4cc9f0" stroke="#111" stroke-width="3"/>`).join('')}`;
  else if (w === 'INCONVENIENT') g = `<path d="M-60 50 L-60 -30 L-20 -30 L-20 10 L20 10 L20 -50 L60 -50 L60 50z" fill="#adb5bd" stroke="#111" stroke-width="5"/><text y="-64" text-anchor="middle" font-size="28" fill="#e63946">???</text>`;
  else if (w === 'MORON') g = `<path d="M-20 -50 L0 -90 L20 -50z" fill="#e63946" stroke="#111" stroke-width="5"/><circle cx="0" cy="0" r="48" fill="#ffd0a8" stroke="#111" stroke-width="5"/><circle cx="-16" cy="-8" r="8" fill="#111"/><circle cx="16" cy="-8" r="8" fill="#111"/><path d="M-20 22 q20 -16 40 0" fill="none" stroke="#111" stroke-width="5"/><path d="M-50 -48 L50 -48" stroke="#111" stroke-width="5"/>`;
  else if (w === 'INVOICE') g = `<g transform="rotate(${f2(Math.sin(q * 14) * 8)})"><rect x="-34" y="-46" width="68" height="88" fill="#fff" stroke="#111" stroke-width="5"/><text y="-14" text-anchor="middle" font-size="18" fill="#111">$$$</text><path d="M-34 -10 q-44 -30 -52 -4 q10 20 52 14z M34 -10 q44 -30 52 -4 q-10 20 -52 14z" fill="#fff" stroke="#111" stroke-width="4"/></g>`;
  else if (w === 'TICKETS') g = `<rect x="-70" y="-30" width="140" height="60" rx="8" fill="#ffd23f" stroke="#111" stroke-width="5" transform="rotate(-10)"/><text y="8" text-anchor="middle" font-size="20" fill="#111" transform="rotate(-10)">ADMIT ONE</text>`;
  else if (w === 'CIRCUIT') g = `<rect x="-62" y="-44" width="124" height="88" rx="8" fill="#2d6a4f" stroke="#111" stroke-width="5"/><rect x="-24" y="-20" width="48" height="40" fill="#111"/><path d="M-62 -20 h38 M-62 10 h38 M24 -20 h38 M24 10 h38" stroke="#ffd23f" stroke-width="5"/>${[0, 1, 2].map(i => `<circle cx="${-20 + i * 20}" cy="${-60 - mod(q * 60 + i * 20, 40)}" r="${8 + i * 3}" fill="#6c757d" stroke="#111" stroke-width="3" opacity="0.7"/>`).join('')}`;
  else if (w === 'ETERNAL') g = `<path d="M-60 0 C-60 -50 0 -50 0 0 C0 50 60 50 60 0 C60 -50 0 -50 0 0 C0 50 -60 50 -60 0z" fill="none" stroke="#9b5de5" stroke-width="12"/>`;
  else if (w === 'DISAPPOINTMENT') g = `<rect x="-52" y="-30" width="104" height="64" rx="10" fill="#c9ced6" stroke="#111" stroke-width="5"/><rect x="-22" y="-44" width="44" height="16" rx="4" fill="#555" stroke="#111" stroke-width="4"/><path d="M-24 -10 l16 16 M-8 -10 l-16 16 M8 -10 l16 16 M24 -10 l-16 16" stroke="#e63946" stroke-width="5"/><path d="M-20 22 q20 -14 40 0" fill="none" stroke="#111" stroke-width="4"/>`;
  else if (w === 'EDISON') g = `<ellipse cx="0" cy="10" rx="50" ry="34" fill="#9aa5b1" stroke="#111" stroke-width="5"/><circle cx="34" cy="-22" r="22" fill="#9aa5b1" stroke="#111" stroke-width="5"/><path d="M54 -22 l22 6 l-22 6z" fill="#ff8a1f" stroke="#111" stroke-width="3"/><circle cx="40" cy="-27" r="4" fill="#111"/><path d="M-6 -66 q20 -20 40 -6" fill="none" stroke="#111" stroke-width="4"/>`;
  else if (w === 'CURRENT') g = `<path d="M-70 0 q17 -40 35 0 t35 0 t35 0 t35 0" fill="none" stroke="#00b4d8" stroke-width="10" stroke-linecap="round"/>`;
  else if (w === 'CATASTROPHIC') g = `<circle r="46" fill="#ff7b00" stroke="#111" stroke-width="5"/>${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<path d="M${(Math.cos(i * 0.785) * 40).toFixed(0)} ${(Math.sin(i * 0.785) * 40).toFixed(0)} L${(Math.cos(i * 0.785) * 78).toFixed(0)} ${(Math.sin(i * 0.785) * 78).toFixed(0)}" stroke="#ffd23f" stroke-width="10" stroke-linecap="round"/>`).join('')}<rect x="-24" y="-16" width="48" height="32" rx="6" fill="#c9ced6" stroke="#111" stroke-width="4"/>`;
  else if (w === 'VOLTAGE-STARVED') g = `<rect x="-50" y="-26" width="100" height="56" rx="10" fill="#c9ced6" stroke="#111" stroke-width="5"/><rect x="-30" y="-18" width="14" height="40" fill="#e63946"/><path d="M-20 -50 q20 -22 40 0" fill="none" stroke="#111" stroke-width="5"/><text y="-62" text-anchor="middle" font-size="22" fill="#e63946">LOW</text>`;
  else if (w === 'SPITE') g = `<circle r="50" fill="#9b5de5" stroke="#111" stroke-width="5"/><path d="M-30 -16 l22 10 M30 -16 l-22 10" stroke="#111" stroke-width="7" stroke-linecap="round"/><circle cx="-16" cy="-4" r="6" fill="#111"/><circle cx="16" cy="-4" r="6" fill="#111"/><path d="M-22 26 q22 -18 44 0" fill="none" stroke="#111" stroke-width="6"/><path d="M-34 -48 l-8 -26 l22 14z M34 -48 l8 -26 l-22 14z" fill="#9b5de5" stroke="#111" stroke-width="4"/>`;
  else g = `<path d="M10 -70 L-40 10 H-6 L-24 70 L46 -16 H8z" fill="#ffd23f" stroke="#111" stroke-width="5" stroke-linejoin="round"/>`;
  return `<g transform="translate(${x} ${y}) scale(${f2(0.4 + 0.8 * pop)}) rotate(${f2((1 - pop) * -25)})" opacity="${f2(fade)}">${g}</g>`;
}
