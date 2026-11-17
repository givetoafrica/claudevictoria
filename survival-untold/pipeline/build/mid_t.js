function duck(x, y, sc, bulb) {
  return `<g transform="translate(${x} ${y}) scale(${sc})">
    <ellipse cx="0" cy="0" rx="34" ry="24" fill="#ffd21f" stroke="#7a5a00" stroke-width="3"/>
    <circle cx="18" cy="-26" r="19" fill="#ffd21f" stroke="#7a5a00" stroke-width="3"/>
    <path d="M34 -26 l20 6 l-20 8z" fill="#ff8a1f" stroke="#7a4000" stroke-width="2"/>
    <circle cx="22" cy="-32" r="3.5" fill="#111"/>
    <path d="M-10 0 q12 -14 28 0" fill="none" stroke="#e5ad00" stroke-width="3"/>
    ${bulb ? `<ellipse cx="14" cy="-58" rx="12" ry="15" fill="#fff0b8" stroke="#6b5a45" stroke-width="3"/><rect x="9" y="-46" width="10" height="9" fill="#7d6a52"/><circle cx="14" cy="-58" r="34" fill="url(#glow)" opacity="0.8"/>` : ''}
  </g>`;
}

// ---- Edison -----------------------------------------------------------------------
function edison(t, st) {
  const o = openness('E', t), shout = clamp(o * 1.5);
  const sp = speaking('E');
  const shake = sp ? (Math.sin(t * 80) * 5 * shout) : 0;
  const sc = st.scale * (1 + 0.035 * o);
  const lx = st.lookX, ly = st.lookY;
  const browA = 10 + shout * 22 + (st.sad ? -15 : 0);
  const mh = 10 + o * 210, mw = 150 + o * 100;
  let s = `<g transform="translate(${540 + shake} ${st.cy + (sp ? Math.sin(t * 61) * 3 * shout : 0)}) scale(${f2(sc)}) rotate(${f2(st.rot)})">`;
  // ears
  s += `<ellipse cx="-325" cy="20" rx="46" ry="70" fill="#eaa174" stroke="#000" stroke-width="14"/><ellipse cx="325" cy="20" rx="46" ry="70" fill="#eaa174" stroke="#000" stroke-width="14"/>`;
  // head
  s += `<ellipse cx="0" cy="0" rx="330" ry="380" fill="url(#skin)" stroke="#000" stroke-width="18"/>`;
  // hair (gray, wild)
  s += `<path d="M-300 -150 q-30 -120 60 -190 l20 40 l40 -90 l40 70 l50 -110 l50 90 l50 -100 l40 90 l60 -70 l10 80 q90 60 60 180 q-60 -150 -210 -170 q-140 -10 -270 160z" fill="#d9d9de" stroke="#000" stroke-width="12" stroke-linejoin="round"/>`;
  // cheeks
  s += `<ellipse cx="-210" cy="130" rx="60" ry="40" fill="#ff9a8a" opacity="0.6"/><ellipse cx="210" cy="130" rx="60" ry="40" fill="#ff9a8a" opacity="0.6"/>`;
  // eyes
  for (const sx of [-125, 125]) {
    s += `<ellipse cx="${sx}" cy="-90" rx="98" ry="112" fill="#fff" stroke="#000" stroke-width="14"/>`;
    if (shout > 0.6) s += `<path d="M${sx - 80} -90 q30 10 50 -20 M${sx + 80} -90 q-30 10 -50 -20 M${sx - 40} 0 q10 -20 30 -30" fill="none" stroke="#e44" stroke-width="3" opacity="0.7"/>`;
    s += `<circle cx="${sx + lx}" cy="${-80 + ly}" r="40" fill="#1c1c1c"/><circle cx="${sx + lx - 12}" cy="${-96 + ly}" r="13" fill="#fff"/>`;
  }
  // brows
  s += `<path d="M-230 ${-215 + browA} Q-125 ${-250} -30 ${-185 - browA * 0.3}" fill="none" stroke="#222" stroke-width="26" stroke-linecap="round"/>
        <path d="M230 ${-215 + browA} Q125 ${-250} 30 ${-185 - browA * 0.3}" fill="none" stroke="#222" stroke-width="26" stroke-linecap="round"/>`;
  // nose
  s += `<ellipse cx="0" cy="40" rx="62" ry="52" fill="#df8e63" stroke="#000" stroke-width="12"/>`;
  // mouth (under the moustache)
  s += `<g transform="translate(0 ${150 + o * 20})">
        <ellipse cx="0" cy="${mh / 2}" rx="${mw}" ry="${mh / 2 + 8}" fill="#4a0a10" stroke="#000" stroke-width="12"/>
        <rect x="${-mw * 0.62}" y="${0}" width="${mw * 1.24}" height="${Math.min(34, mh * 0.35)}" rx="8" fill="#fff" opacity="${o > 0.12 ? 1 : 0}"/>
        <ellipse cx="0" cy="${mh * 0.82}" rx="${mw * 0.55}" ry="${Math.max(6, mh * 0.2)}" fill="#e0606c" opacity="${o > 0.25 ? 1 : 0}"/>
      </g>`;
  // moustache
  s += `<path d="M-260 150 Q-250 70 -120 80 Q-40 60 0 100 Q40 60 120 80 Q250 70 260 150 Q240 190 170 150 Q100 130 0 150 Q-100 130 -170 150 Q-240 190 -260 150z" fill="#e8e8ec" stroke="#000" stroke-width="12" stroke-linejoin="round"/>`;
  s += `</g>`;
  return s;
}

// ---- Scout ------------------------------------------------------------------------
function scout(t, P) {
  const o = openness('S', t) * 0.55;
  const x = P.x, y = P.y, sc = 1.22;
  const w = P.walk ? Math.sin(P.phase) : 0;
  let s = `<g transform="translate(${f2(x)} ${f2(y)}) scale(${sc}) rotate(${f2(P.lean)} 0 -200)">`;
  // legs
  const lk = P.dangle ? 1 : 0;
  const legs = [[-26, 1], [26, -1]].map(([hx, d]) => {
    const fx = hx + (P.walk ? w * 40 * d : 0) + (lk ? Math.sin(t * 5 + d) * 14 + 20 : 0);
    const fy = (P.walk ? -Math.max(0, w * d) * 28 : 0) - (lk ? 0 : 10) + (lk ? 40 : 0);
    return `<line x1="${hx}" y1="-200" x2="${fx}" y2="${fy - 20}" stroke="#3f5f9a" stroke-width="48" stroke-linecap="round"/>
            <ellipse cx="${fx + 8}" cy="${fy - 8}" rx="40" ry="20" fill="#fff" stroke="#c9c9c9" stroke-width="3"/>`;
  }).join('');
  s += legs;
  // ponytail (behind)
  const pt = Math.sin(t * 7) * 10 + (P.walk ? Math.sin(P.phase * 2) * 16 : 0) - P.lean;
  s += `<g transform="translate(-60 ${-515 + P.headDy}) rotate(${f2(pt)})"><path d="M0 0 q-70 20 -60 110 q30 -30 60 -30z" fill="#4a2a18" stroke="#2a150a" stroke-width="4"/></g>`;
  // torso
  s += `<rect x="-78" y="-404" width="156" height="214" rx="52" fill="url(#red)" stroke="#6d100e" stroke-width="5"/>
        <path d="M-76 -340 h152 M-78 -290 h156 M-76 -240 h152" stroke="#8a1612" stroke-width="5" opacity="0.7"/>
        <path d="M-52 -400 q52 34 104 0" fill="none" stroke="#2b2b2b" stroke-width="14"/>
        <circle cx="-62" cy="-362" r="26" fill="#2b2b2b"/><circle cx="-62" cy="-362" r="14" fill="#555"/>
        <circle cx="62" cy="-362" r="26" fill="#2b2b2b"/><circle cx="62" cy="-362" r="14" fill="#555"/>`;
  // arms
  const arm = (sx, hx, hy) => `<polyline points="${sx},-370 ${(sx + hx) / 2},${Math.max(hy, -370) + 40} ${hx},${hy}" fill="none" stroke="url(#red)" stroke-width="40" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="${hx}" cy="${hy}" r="21" fill="#e5a97e" stroke="#9a6a45" stroke-width="3"/>`;
  s += arm(-64, P.fh[0], P.fh[1]);
  // head
  s += `<g transform="translate(0 ${P.headDy}) rotate(${f2(P.tilt)} 0 -440)">
        <circle cx="0" cy="-478" r="84" fill="url(#skin)" stroke="#8b5a36" stroke-width="4"/>
        <path d="M-88 -480 q-6 -104 90 -100 q92 -4 90 100 q-30 -60 -70 -62 q-40 24 -110 22 q-0 16 0 40z" fill="#4a2a18" stroke="#2a150a" stroke-width="4"/>
        <ellipse cx="-31" cy="-478" rx="23" ry="27" fill="#fff"/><ellipse cx="31" cy="-478" rx="23" ry="27" fill="#fff"/>
        <circle cx="${-31 + P.eyeX}" cy="${-476 + P.eyeY}" r="15" fill="#3b2415"/><circle cx="${31 + P.eyeX}" cy="${-476 + P.eyeY}" r="15" fill="#3b2415"/>
        <circle cx="${-35 + P.eyeX}" cy="${-483 + P.eyeY}" r="5" fill="#fff"/><circle cx="${27 + P.eyeX}" cy="${-483 + P.eyeY}" r="5" fill="#fff"/>
        <rect x="-58" y="-508" width="52" height="${P.lid}" fill="#e9b189"/><rect x="6" y="-508" width="52" height="${P.lid}" fill="#e9b189"/>
        <path d="M-58 ${-515 - P.brow} q26 -10 52 0 M6 ${-515 - P.brow * 1.6} q26 -10 52 0" stroke="#2a150a" stroke-width="7" fill="none" stroke-linecap="round"/>
        <ellipse cx="0" cy="-432" rx="${12 + o * 6}" ry="${3 + o * 14}" fill="#5a1f1c" stroke="#7a3a30" stroke-width="3"/>
        </g>`;
  // mic arm + mic (toward Edison, to the right)
  s += arm(64, P.mh[0], P.mh[1]);
  s += `<g transform="translate(${P.mh[0]} ${P.mh[1]}) rotate(${P.micRot}) scale(1.45)"><rect x="-11" y="-84" width="22" height="84" rx="10" fill="#9aa0a6" stroke="#222" stroke-width="4"/><rect x="-24" y="-62" width="48" height="30" rx="5" fill="#ffd23f" stroke="#222" stroke-width="4"/><text x="0" y="-40" text-anchor="middle" font-size="19" fill="#111">SU</text><circle cx="0" cy="-100" r="30" fill="#2a2a2a" stroke="#777" stroke-width="4"/><path d="M-24 -106 h48 M-20 -94 h40 M-12 -122 v44 M0 -128 v56 M12 -122 v44" stroke="#666" stroke-width="3"/></g>`;
  // props in free hand
  if (P.juice) s += `<g transform="translate(${P.fh[0]} ${P.fh[1]})"><rect x="-18" y="-46" width="36" height="52" rx="5" fill="#ffd34a" stroke="#a37a00" stroke-width="3"/><rect x="-6" y="-70" width="5" height="26" fill="#fff"/></g>`;
  if (P.file) s += `<g transform="translate(${P.fh[0]} ${P.fh[1]}) rotate(-10)"><rect x="-44" y="-70" width="88" height="70" fill="#f3e9c9" stroke="#8a7a55" stroke-width="3"/><rect x="${-44 + (Math.sin(t * 9) + 1) * 8}" y="-70" width="${34 - Math.abs(Math.sin(t * 9)) * 10}" height="70" fill="#fffdf2" stroke="#8a7a55" stroke-width="2"/></g>`;
  if (P.note) s += `<g transform="translate(${P.fh[0]} ${P.fh[1]})"><rect x="-22" y="-8" width="44" height="14" rx="4" fill="#e5a97e" stroke="#9a6a45" stroke-width="2"/><path d="M-14 -2 l${(Math.sin(t * 20)) * 8 + 6} 0" stroke="#1b4fff" stroke-width="3"/></g>`;
  if (P.phone) s += `<g transform="translate(${P.fh[0]} ${P.fh[1]}) rotate(-12)"><rect x="-17" y="-58" width="34" height="62" rx="7" fill="#111" stroke="#555" stroke-width="3"/><rect x="-13" y="-52" width="26" height="50" rx="4" fill="#bdeeff"/></g>`;
  s += `</g>`;
  return s;
}

function scoutPose(t) {
  const P = { x: 300, y: 1872, lean: 0, phase: 0, walk: false, tilt: 0, headDy: 0, eyeX: 6, eyeY: 2, lid: 14, brow: 0,
              fh: [-95, -230], mh: [150, -380], micRot: 70, juice: false, file: false, note: false, dangle: false };
  // idle bob/sway
  P.y += Math.sin(t * 5.5) * 4;
  P.lean += Math.sin(t * 2.2) * 1.5;
  P.fh = [-95 + Math.sin(t * 4) * 6, -230 + Math.sin(t * 3) * 6];
  P.mh = [150 + Math.sin(t * 3.5) * 5, -380 + Math.sin(t * 2.6) * 6];
  // 1. walk in during S1
  const walkEnd = C.S1.end + 0.1;
  if (t < walkEnd) {
    const k = clamp(t / walkEnd);
    P.x = lerp(-300, 300, ease(k)); P.walk = true; P.phase = t * 11;
    P.lean = 4;
  }
  // E1: lean back + wipe sleeve
  const e1 = C.E1;
  if (t >= e1.start && t < C.S2.start) {
    const k = seg(t, e1.start + e1.dur * 0.3, e1.start + e1.dur * 0.6);
    P.lean += -16 * k; P.x -= 50 * k;
    const w = seg(t, e1.start + e1.dur * 0.65, e1.start + e1.dur * 0.78) * (1 - seg(t, e1.start + e1.dur * 0.92, e1.end));
    P.fh = [lerp(P.fh[0], 18, w), lerp(P.fh[1], -440, w)];
    P.x = lerp(P.x, 300, 0.0);
  }
  // S2: glance up + shrug, E2: juice box
  if (t >= C.S2.start && t < C.S3.start) {
    const k = seg(t, C.S2.start, C.S2.start + 0.25);
    P.tilt = -8 * k; P.eyeY = -8 * k; P.eyeX = 0;
    const shrug = seg(t, C.S2.end, C.S2.end + 0.3) * (1 - seg(t, C.E2.start + 0.5, C.E2.start + 0.9));
    P.fh = [lerp(P.fh[0], -110, shrug), lerp(P.fh[1], -330, shrug)];
    P.headDy = 14 * shrug * -1;
    const sip = seg(t, C.E2.start + 0.8, C.E2.start + 1.5) * (1 - seg(t, C.E2.end - 0.8, C.E2.end - 0.2));
    P.juice = sip > 0.05;
    P.fh = [lerp(P.fh[0], -8, sip), lerp(P.fh[1], -430, sip)];
    P.lean += -4 * seg(t, C.E1.end, C.S2.start + 0.2) ;
  }
  // S3 -> E3: dodge flying clipboard without looking up
  if (t >= C.E3.start && t < C.E3.start + 1.4) {
    const k = Math.sin(clamp((t - C.E3.start) / 1.1) * Math.PI);
    P.y += 70 * k; P.lean += 14 * k; P.eyeY = 4; P.tilt = 6 * k;
  }
  // E4: Scout notices the duck first and points at the shelf
  if (t >= C.E4.start && t < C.S4.start) {
    const k = seg(t, C.E4.start + 0.3, C.E4.start + 0.8) * (1 - seg(t, C.E4.end - 0.3, C.E4.end));
    P.fh = [lerp(P.fh[0], 120, k), lerp(P.fh[1], -690, k)];
    P.tilt += -9 * k; P.eyeY = -10 * k; P.eyeX = 10 * k;
  }
  // S4..E6: stool, mic up to his face
  const stoolOn = t >= C.S4.start - 0.4 && t < C.S6.start;
  const up = seg(t, C.S4.start - 0.3, C.S4.start + 0.1) * (1 - seg(t, C.E6.end, C.E6.end + 0.4));
  if (stoolOn || up > 0) {
    P.y -= 110 * up;
    P.mh = [lerp(P.mh[0], 120, up), lerp(P.mh[1], -520, up)]; P.micRot = lerp(P.micRot, 90, up);
  }
  // S6..E7: sit on desk flipping through his patent file
  const sit = seg(t, C.S6.start - 0.5, C.S6.start) * (1 - seg(t, C.S7.start - 0.3, C.S7.start + 0.2));
  if (sit > 0) {
    P.x = lerp(P.x, 250, sit); P.y -= 300 * sit; P.dangle = sit > 0.6;
    P.file = sit > 0.6; P.fh = [lerp(P.fh[0], -120, sit), lerp(P.fh[1], -300, sit)];
    P.tilt += 8 * sit; P.eyeY = 12;
  }
  // S8..E9: nod and write note on hand
  if (t >= C.S8.start && t < C.S9.start) {
    P.headDy += Math.sin((t - C.S8.start) * 9) * 7;
    const nw = seg(t, C.S8.end, C.E9.start + 0.3);
    P.fh = [lerp(P.fh[0], 60, nw), lerp(P.fh[1], -260, nw)]; P.note = nw > 0.5;
  }
  // S9: eyebrow raise, mic held toward the dead bulb
  if (t >= C.S9.start - 0.5 && t < C.E10.start + 1) {
    P.brow = 12; P.lid = 6;
    const mk = seg(t, TL.bulbDies, C.S9.start + 0.2);
    P.mh = [lerp(P.mh[0], 200, mk), lerp(P.mh[1], -520, mk)]; P.micRot = lerp(P.micRot, 40, mk);
    P.tilt = -6; P.eyeY = -9;
  }
  // E11: walk off camera mid-scream
  if (t >= C.E11.start + 0.3) {
    const k = clamp((t - C.E11.start - 0.3) / 2.2);
    P.walk = true; P.phase = t * 11; P.x = lerp(P.x, -360, k * k); P.lean = 4;
  }
  // flinch when a bolt lands
  const a = boltAge(t);
  if (a < 0.25) { P.x += (Math.random() - 0.5) * 0 + Math.sin(a * 120) * 10 * (1 - a / 0.25); P.y -= 12 * (1 - a / 0.25); }
  return P;
}

// ---- captions ---------------------------------------------------------------------
function captionFor(t) {
  for (const c of TL.clips) {
    if (t >= c.start && t < c.end) {
      const words = c.text.split(/\s+/);
      const wt = words.map(w => w.length + 2), tot = wt.reduce((a, b) => a + b, 0);
      // chunk into groups of up to 3 words
      const chunks = [];
      for (let i = 0; i < words.length; i += 3) chunks.push(words.slice(i, i + 3));
      let acc = 0, idx = 0;
      const bounds = chunks.map(ch => { const wsum = ch.reduce((a, w) => a + w.length + 2, 0); const r = [acc / tot, (acc + wsum) / tot]; acc += wsum; return r; });
      const frac = (t - c.start) / c.dur;
      idx = bounds.findIndex(b => frac < b[1]); if (idx < 0) idx = chunks.length - 1;
      return { text: chunks[idx].join(' ').toUpperCase(), spk: c.spk, pop: clamp((frac - bounds[idx][0]) * c.dur / 0.12) };
    }
  }
  return null;
}

