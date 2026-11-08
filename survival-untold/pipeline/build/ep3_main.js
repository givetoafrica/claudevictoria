// ===================== EPISODE 3: SHOTS, CAMERA, RENDER (cinematic pass) =====================
const X = 540;
const endT = id => C[id].start + C[id].dur;
const BLACK_T = endT('L30') + 0.06;
const amp = t => clamp(openness('E', t) * 1.3);
const ZP = { hall: 0.55, scan: 0.6, table: 0.65, doors: 1 };

function baseP() {
  const P = { x: 300, y: 1872, lean: 0, phase: 0, walk: false, tilt: 0, headDy: 0, eyeX: 6, eyeY: 2, lid: 12, brow: 4, dirx: 1, stride: 42, liftAmt: 30,
              fh: [-95, -230], mh: [150, -380], micRot: 70, juice: false, file: false, note: false, dangle: false, phone: false, tray: true, vest: true };
  P.fh = [-95 + Math.sin(cur * 4) * 6, -230 + Math.sin(cur * 3) * 6]; P.mh = [150 + Math.sin(cur * 3.5) * 5, -380 + Math.sin(cur * 2.6) * 6];
  return P;
}
function flail(t, a) {
  return { L: [X - 150 - 40 * a * Math.sin(t * 14), 1230 - 250 * a * (0.5 + 0.5 * Math.sin(t * 11 + 1))], R: [X + 150 + 40 * a * Math.sin(t * 13 + 2), 1230 - 250 * a * (0.5 + 0.5 * Math.sin(t * 12))] };
}
function headSt(t, hs, over) { return Object.assign({ cy: 930 - 385 * hs + 60, scale: hs, rot: Math.sin(t * 3) * 1.2, lookX: -18, lookY: 18, sad: false, noGlasses: false }, over || {}); }
function figF(t, st, ov, px, py, k, lean, sy) {
  STK = 'stF'; sy = sy == null ? 1 : sy;
  const body = franklinBody(t, st, ov);
  const bodyG = sy === 1 ? body : `<g transform="translate(0 1676) scale(1 ${f2(sy)}) translate(0 -1676)">${body}</g>`;
  const headShift = (1 - sy) * (1676 - st.cy) + (ov.by || 0);
  return placeG(px, py, k, bodyG + `<g transform="translate(${f2(ov.sway ? ov.sway * 0.4 : 0)} ${f2(headShift)})"><g filter="url(#stF)">${franklin(t, st)}</g></g>`, `rotate(${f2(lean || 0)})`);
}
function figS(t, P, k) { return `<g filter="url(#stS)" transform="translate(${f2(P.x)} ${f2(P.y)}) scale(${f2(k)}) translate(${f2(-P.x)} ${f2(-P.y)})">${scout(t, P)}</g>`; }
const shadow = (x, y, k) => dropShadow(x, y + 4, 120 * k, 0.22);
const stringLine = (a, b, sag) => `<path d="M${f2(a[0])} ${f2(a[1])} Q${f2((a[0] + b[0]) / 2)} ${f2((a[1] + b[1]) / 2 + (sag == null ? 14 : sag))} ${f2(b[0])} ${f2(b[1])}" fill="none" stroke="#1b1b22" stroke-width="4"/>`;

// ---- walking: phase comes from the DISTANCE travelled, so planted feet never slide ----------------
function pathDist(fn, t0, t) { let d = 0, prev = fn(t0); const n = 50; for (let i = 1; i <= n; i++) { const x = fn(lerp(t0, t, i / n)); d += Math.abs(x - prev); prev = x; } return d; }
function gaitF(ph, dir, run) {
  const stride = run ? 150 : 95, lift = run ? 130 : 60, arm = run ? 170 : 70, bob = run ? 24 : 12;
  const s1 = Math.sin(ph), s2 = Math.sin(ph + Math.PI), c1 = Math.cos(ph), c2 = Math.cos(ph + Math.PI), ay = run ? 1130 : 1240;
  return { dir, fL: [X - 112 + dir * stride * s1, 1676 - lift * Math.max(0, c1)], fR: [X + 112 + dir * stride * s2, 1676 - lift * Math.max(0, c2)],
    L: [X - 165 + dir * arm * s2, ay + (run ? -70 * Math.max(0, c2) : 25 * Math.abs(s1))], R: [X + 165 + dir * arm * s1, ay + (run ? -70 * Math.max(0, c1) : 25 * Math.abs(s2))],
    by: -bob * Math.abs(c1), sway: dir * (run ? 40 : 26) * s1 };
}
const phF = (dist, k, run) => Math.PI * dist / (2 * (run ? 150 : 95) * k);
function frOv(t, ph, dir, run, a) { const g = gaitF(ph, dir, run); if (a > 0.15) { const f = flail(t, a); g.L = [lerp(g.L[0], f.L[0], a), lerp(g.L[1], f.L[1], a)]; g.R = [lerp(g.R[0], f.R[0], a), lerp(g.R[1], f.R[1], a)]; } return g; }
function scoutGait(P, ph, dir, run) {
  P.walk = true; P.phase = ph; P.dirx = dir; P.stride = run ? 58 : 42; P.liftAmt = run ? 48 : 30;
  P.fh = [-95 + dir * (run ? 70 : 30) * Math.sin(ph + Math.PI), run ? -250 : -230]; P.mh = [150 + (run ? 14 : 0), -380 + Math.abs(Math.sin(ph)) * (run ? 16 : 6)];
  P.lean = (run ? 11 : 3) * dir; P.headDy = -Math.abs(Math.cos(ph)) * (run ? 12 : 4);
}
const phS = (dist, k, run) => Math.PI * dist / (2 * (run ? 58 : 42) * 1.22 * k);
const mv = (t, t0, t1, x0, x1) => lerp(x0, x1, ease(clamp((t - t0) / (t1 - t0))));
const sgn = v => (v >= 0 ? 1 : -1);

// ---- kite / key / worker (scanner scenes) ----------------------------------------------------------
function kiteScan(t) {
  const pullT = endT('L6') + 0.15;
  if (t < pullT) return { x: 636 + Math.sin(t * 9) * 3, y: 1290, rot: -20 + Math.sin(t * 7) * 2, sc: 0.85, stuck: true };
  const q = clamp((t - pullT) / 0.55);
  if (q < 1) return { x: lerp(636, 330, ease(q)), y: lerp(1290, 1400, ease(q)), rot: lerp(-20, 78, ease(q)), sc: 0.85, stuck: false };
  return { x: 330, y: 1396, rot: 78, sc: 0.85, stuck: false };
}
function keyScan(t) {
  const t0 = endT('L6') + 0.5; if (t < t0) return null;
  const q = t - t0, floorY = 1716; let y;
  if (q > 0.35) { const b = q - 0.35; y = floorY - Math.abs(Math.sin(b * 11)) * 60 * Math.exp(-b * 3.4); } else y = lerp(1420, floorY, (q / 0.35) * (q / 0.35));
  return { x: lerp(430, 540, clamp(q / 0.6)), y: Math.min(y, floorY), rot: q * 540 };
}
function workerPull(t) {
  const pullT = endT('L6') + 0.15; if (t < pullT - 0.45 || t > pullT + 1.4) return '';
  const k = kiteScan(t);
  const wx = lerp(1010, 760, ease(clamp((t - (pullT - 0.45)) / 0.4))) + (t > pullT ? lerp(0, -40, clamp((t - pullT) / 0.5)) : 0);
  const wph = phS(0, 1, false) + t * 9, wm = t < pullT - 0.05;
  return pax(wx, 1560, 0.78, 93, t, wm ? 'walk' : 'stare', true, -1) + `<path d="M${f2(wx - 12)} ${f2(1560 - 80)} L${f2(k.x + 60)} ${f2(k.y - 20)}" stroke="#33415c" stroke-width="12" stroke-linecap="round"/>`;
}
function scanBase(t) {
  const k = kiteScan(t); let mid = '';
  const hw0 = hand(...SCAN.franklin, 0.72, X + 110, 790);
  if (k.stuck) mid += stringLine(hw0, [k.x - 30, k.y - 40], 30);
  mid += kiteSvg(k.x, k.y, k.sc, k.rot) + workerPull(t);
  const ky = keyScan(t); if (ky) mid += keySvg(ky.x, ky.y, 1.1, ky.rot);
  return { bg: zoneScanner(t, { alarm: t < endT('L3') }), mid, k };
}

const SHOTS = [];
function shot(id, opt, fn) { SHOTS.push(Object.assign({ id, fn }, opt || {})); }
const hallF = (t, ov, o) => { o = o || {}; return { st: headSt(t, 0.6, o.st), ov, px: o.px == null ? HALL.franklin[0] : o.px, py: o.py == null ? HALL.franklin[1] : o.py, k: o.k || 0.30, lean: o.lean || 0 }; };
function kiteInHall(t, hw) { const kx = HALL.kite[0] + Math.sin(t * 9) * 2, ky = HALL.kite[1]; return kiteSvg(kx, ky, 0.5, -24 + Math.sin(t * 7) * 2) + stringLine(hw, [kx - 4, ky + 20], 10); }
// Franklin marches on the moving belt like a treadmill so he stays right where he is
const treadmill = (t, a, extra) => { const ov = frOv(t, t * 5.4, -1, false, a); delete ov.sway; if (extra) Object.assign(ov, extra); return ov; };

// ===== COLD OPEN: the extreme-wide hall ===================================================================
shot('L1', { zone: 'hall' }, (t, u) => {
  const P = baseP(); const kS = 0.36, x = mv(t, 0.15, 2.3, -230, HALL.scout[0]); P.y = HALL.scout[1] - 0; P.x = x;
  if (t < 2.35) scoutGait(P, phS(Math.abs(x + 230), kS, true), 1, true); else { P.fh = [110, -560]; P.brow = 8; }
  const ov = treadmill(t, 0, {}); const hw = hand(...HALL.franklin, 0.30, X + 95, 740); ov.R = [X + 95, 740]; ov.hw = hw;
  return { cam: { cx: lerp(560, 430, ease(u)), cy: 1050, z: lerp(1.0, 1.2, ease(u)) }, bg: zoneHall(t, { alarm: true }), mid: kiteInHall(t, hw), F: hallF(t, ov), S: { P, k: kS }, front: '', alarm: true };
});
shot('L2', { zone: 'hall' }, (t, u) => {
  const a = amp(t), P = baseP(); P.x = HALL.scout[0]; P.y = HALL.scout[1]; P.fh = [110, -560]; P.brow = 8;
  const ov = treadmill(t, a, {}); ov.R = [X + 95, 740]; const hw = hand(...HALL.franklin, 0.30, X + 95, 740);
  return { cam: { cx: 470, cy: 1150, z: lerp(1.75, 1.95, u) }, bg: zoneHall(t, { alarm: true }), mid: kiteInHall(t, hw), F: hallF(t, ov), S: { P, k: 0.36 }, front: '', alarm: true };
});

// ===== THE SCANNER: Scout walks in, Franklin marches on the belt ==============================================
function scanF(t, ov, o) { const st = headSt(t, 0.6, Object.assign({ lookX: 18, lookY: 12 }, (o && o.st) || {})); return { st, ov, px: o && o.px != null ? o.px : SCAN.franklin[0], py: SCAN.franklin[1], k: 0.72, lean: (o && o.lean) || 0 }; }
function scanS(t, o) { const P = baseP(); P.x = SCAN.scout[0]; P.y = SCAN.scout[1]; Object.assign(P, o || {}); return { P, k: 0.85 }; }
const hs790 = t => ({ R: [X + 110, 790 + Math.sin(t * 9) * 6] });
shot('L3', { zone: 'scan', whip: true }, (t, u) => { const b = scanBase(t), a = amp(t);
  const sx = mv(t, C.L3.start, C.L3.start + 2.1, 1260, SCAN.scout[0]), P = baseP(); P.x = sx; P.y = SCAN.scout[1];
  if (t < C.L3.start + 2.1) scoutGait(P, phS(Math.abs(sx - 1260), 0.85, false), -1, false);
  const ov = treadmill(t, 0, hs790(t));
  return { cam: { cx: lerp(760, 600, ease(u)), cy: 1110, z: lerp(1.28, 1.34, u) }, bg: b.bg, mid: b.mid, F: scanF(t, ov), S: { P, k: 0.85 }, front: '', alarm: true }; });
shot('L4', { zone: 'scan' }, (t, u) => { const a = amp(t), b = scanBase(t); const ov = treadmill(t, a, { R: [X + 110, 790] }); ov.L = flail(t, a).L;
  return { cam: { cx: 520, cy: 1110, z: lerp(1.25, 1.5, u), roll: lerp(0, 2.5, u) }, bg: b.bg, mid: b.mid, F: scanF(t, ov), S: scanS(t), front: '' }; });
shot('L5', { zone: 'scan' }, (t, u) => { const b = scanBase(t); const ov = treadmill(t, 0, hs790(t));
  return { cam: { cx: 790, cy: 1230, z: lerp(1.95, 2.1, u) }, bg: b.bg, mid: b.mid, F: scanF(t, ov), S: scanS(t, { brow: 0, lid: 6 }), front: '' }; });
shot('L6', { zone: 'scan' }, (t, u) => { const a = amp(t), b = scanBase(t); const ov = treadmill(t, a, {}); if (b.k.stuck) ov.R = [X + 110, 790]; else ov.R = [X + 40, 1130];
  return { cam: { cx: 540, cy: 1110, z: lerp(1.25, 1.18, u) }, bg: b.bg, mid: b.mid, F: scanF(t, ov), S: scanS(t), front: '' }; });
shot('L7', { zone: 'scan' }, (t, u) => { const b = scanBase(t); const ov = treadmill(t, 0, { R: [X + 60, 1200] });
  return { cam: { cx: lerp(700, 620, u), cy: 1420, z: 1.55 }, bg: b.bg, mid: b.mid, F: scanF(t, ov), S: scanS(t, { eyeY: 10, tilt: 5 }), front: '' }; });
shot('L8', { zone: 'scan' }, (t, u) => { const a = amp(t), b = scanBase(t); const ov = treadmill(t, a, {}); const f = flail(t, a); ov.L = f.L; ov.R = f.R;
  return { cam: { cx: lerp(400, 330, u), cy: 930, z: lerp(2.0, 1.5, u), roll: 3 }, bg: b.bg, mid: b.mid, F: scanF(t, ov, { st: { lookX: 20, lookY: 15 } }), S: scanS(t), front: '' }; });
shot('L9', { zone: 'scan' }, (t, u) => { const b = scanBase(t); const gl = t > endT('L9') + 0.15; const ov = frOv(t, 0, 1, false, 0); ov.fL = [X - 112, 1676]; ov.fR = [X + 112, 1676]; ov.L = gl ? [X - 235, 900] : [X - 165, 1230]; ov.R = [X + 165, 1230]; delete ov.sway; ov.by = 0;
  return { cam: { cx: 540, cy: 1110, z: lerp(1.2, 1.4, u) }, bg: b.bg, mid: b.mid, F: scanF(t, ov, { st: { noGlasses: gl, lookX: 0, lookY: 0 } }), S: scanS(t, { eyeY: -4 }), front: '', glasses: gl }; });
shot('L10', { zone: 'scan' }, (t, u) => { const b = scanBase(t); const ov = { L: [X - 235, 900], R: [X + 165, 1230], fL: [X - 112, 1676], fR: [X + 112, 1676] };
  return { cam: { cx: 345, cy: 880, z: lerp(2.5, 2.75, u) }, bg: b.bg, mid: b.mid, F: scanF(t, ov, { st: { noGlasses: true, lookX: 0, lookY: 0, rot: 0 } }), S: scanS(t), front: '', glasses: true }; });
// L11: he paces the belt and the camera tracks him while pulling back
const pacePx = t => 340 + 105 * Math.sin((t - C.L11.start) * 1.35);
shot('L11', { zone: 'scan' }, (t, u) => { const a = amp(t), b = scanBase(t); const px = pacePx(t), dir = sgn(Math.cos((t - C.L11.start) * 1.35)), ph = phF(pathDist(pacePx, C.L11.start, t), 0.72, false);
  const ov = frOv(t, ph, dir, false, a);
  return { cam: { cx: lerp(px + 20, 540, ease(u)), cy: lerp(900, 1100, u), z: lerp(2.3, 1.25, ease(u)), roll: lerp(-4, 0, u) }, bg: b.bg, mid: b.mid, F: scanF(t, ov, { px, st: { noGlasses: true, lookX: dir * 12, lookY: 0 } }), S: scanS(t, { brow: 6 }), front: '', glasses: false }; });
shot('L12', { zone: 'scan' }, (t, u) => { const b = scanBase(t); const ov = { L: [X - 165, 1230], R: [X + 165, 1230], fL: [X - 112, 1676], fR: [X + 112, 1676] };
  return { cam: { cx: 790, cy: 1230, z: 1.95 }, bg: b.bg, mid: b.mid, F: scanF(t, ov, { px: pacePx(endT('L11')), st: { noGlasses: true } }), S: scanS(t, { brow: 0, lid: 6 }), front: '' }; });

// ===== BACK IN THE HALL: he storms through the crowd, she hurries after him ====================================
const stormX = t => lerp(380, 600, ease(clamp((t - C.L13.start) / C.L13.dur)));
shot('L13', { zone: 'hall', whip: true, pov: true }, (t, u) => {
  const a = amp(t), x = stormX(t), kF = 0.44, kS = 0.48, sxx = x - 190, dist = Math.abs(x - 380), P = baseP(); P.x = sxx; P.y = 1330;
  scoutGait(P, phS(Math.abs(sxx - 190), kS, false), 1, false);
  const ov = frOv(t, phF(dist, kF, false), 1, false, a);
  return { cam: { cx: lerp(470, 600, ease(u)), cy: 1150, z: lerp(1.2, 1.35, u) }, bg: zoneHall(t, {}), mid: '', F: hallF(t, ov, { px: x, py: 1236, k: kF }), S: { P, k: kS }, front: '' }; });

// ===== THE LIQUIDS COUNTER =============================================================================
function tableF(t, ov, o) { const st = headSt(t, 0.6, o && o.st); ov.by = (ov.by || 0) + Math.sin(t * 3.5) * 5; return { st, ov, px: 800, py: 1560, k: 0.72, lean: Math.sin(t * 2.4) * 1.6 }; }
function tableS(t, o) { const P = baseP(); P.x = 280; P.y = 1566 + Math.sin(t * 3.1) * 4; Object.assign(P, o || {}); return { P, k: 0.85 }; }
const tableBase = (t, clapT) => zoneTableBack(t, { clapT });
const clapT = () => endT('L19') + 0.1;
const idleOv = () => ({ L: [X - 165, 1230], R: [X + 165, 1230] });
shot('L14', { zone: 'table', whip: true }, (t, u) => { const wx = mv(t, C.L14.start, C.L14.start + 0.9, 60, 280), P = tableS(t, { fh: [110, -520], brow: 6 }).P; P.x = wx; P.headDy = -Math.abs(Math.sin(t * 9)) * (u < 0.4 ? 8 : 0);
  const bx = P.x + P.fh[0] * 0.85 * 1.22, by = P.y + P.fh[1] * 0.85 * 1.22 - 20;
  return { cam: { cx: lerp(380, 540, u), cy: 1100, z: lerp(1.35, 1.3, u) }, bg: tableBase(t), mid: '', F: tableF(t, idleOv()), S: { P, k: 0.85 }, front: zoneTableFront(t) + bottleSvg(bx, by, 1.2) }; });
shot('L15', { zone: 'table' }, (t, u) => { const a = amp(t), f = flail(t, a); return { cam: { cx: 796, cy: 980, z: lerp(1.7, 1.95, u), roll: -3 }, bg: tableBase(t), mid: '', F: tableF(t, { L: f.L, R: f.R }), S: tableS(t), front: zoneTableFront(t) }; });
shot('L16', { zone: 'table' }, (t, u) => ({ cam: { cx: 540, cy: 1100, z: lerp(1.3, 1.38, u) }, bg: tableBase(t), mid: '', F: tableF(t, idleOv()), S: tableS(t), front: zoneTableFront(t) }));
shot('L17', { zone: 'table' }, (t, u) => ({ cam: { cx: 796, cy: 1040, z: lerp(1.5, 1.75, u) }, bg: tableBase(t), mid: '', F: tableF(t, { L: [X - 60, 1100], R: [X + 40, 1080 + Math.sin(t * 10) * 8] }, { st: { rot: -3 } }), S: tableS(t), front: zoneTableFront(t) }));
shot('L18', { zone: 'table' }, (t, u) => ({ cam: { cx: 284, cy: 1200, z: 1.9 }, bg: tableBase(t), mid: '', F: tableF(t, idleOv()), S: tableS(t, { brow: 0, lid: 6 }), front: zoneTableFront(t) }));
shot('L19', { zone: 'table', pov: true }, (t, u) => { const a = amp(t); return { cam: { cx: 540, cy: 1100, z: lerp(1.25, 1.1, u) }, bg: tableBase(t, clapT()), mid: '', F: tableF(t, { L: [X - 280, 820 + Math.sin(t * 12) * 20 * a], R: [X + 280, 820 + Math.sin(t * 12 + 1) * 20 * a] }, { st: { lookY: -20 } }), S: tableS(t), front: zoneTableFront(t) }; });
shot('L20', { zone: 'table' }, (t, u) => { const a = amp(t), f = flail(t, a); return { cam: { cx: 640, cy: 1080, z: lerp(1.25, 1.45, u), roll: 2.5 }, bg: tableBase(t, clapT()), mid: '', F: tableF(t, { L: f.L, R: [X + 120, 980] }, { st: { lookX: -30, lookY: 0 } }), S: tableS(t), front: zoneTableFront(t) }; });

// ===== PA ANNOUNCEMENT, then the meltdown under the speaker ==================================================
const HALL2 = { f: [470, 1232], s: [300, 1318] };
const paceHall = t => 470 + 90 * Math.sin((t - C.L22.start) * 1.5);
shot('L21', { zone: 'hall', whip: true }, (t, u) => { let w = '';
  if (t >= C.L21.start - 0.2) for (let i = 0; i < 3; i++) { const ph = mod(t * 1.4 + i / 3, 1); w += `<path d="M${830 - 80 - ph * 150} ${380 + ph * 40} Q${830} ${470 + ph * 120} ${830 + 80 + ph * 150} ${380 + ph * 40}" fill="none" stroke="#1d3557" stroke-width="10" opacity="${(1 - ph).toFixed(2)}" stroke-linecap="round"/>`; }
  const P = baseP(); P.x = HALL2.s[0]; P.y = HALL2.s[1];
  return { cam: { cx: 780, cy: 533 + u * 120, z: lerp(1.7, 1.45, u) }, bg: zoneHall(t, {}), mid: w, F: hallF(t, idleOv(), { px: HALL2.f[0], py: HALL2.f[1], k: 0.44, st: { lookY: -50 } }), S: { P, k: 0.48 }, front: '' }; });
shot('L22', { zone: 'hall' }, (t, u) => { const a = amp(t), px = paceHall(t), dir = sgn(Math.cos((t - C.L22.start) * 1.5)), ph = phF(pathDist(paceHall, C.L22.start, t), 0.44, false), P = baseP(); P.x = px - 170; P.y = 1318;
  scoutGait(P, ph * 0.9, dir, false);
  const ov = frOv(t, ph, dir, false, a); ov.L = [X - 250, 760 + Math.sin(t * 10) * 14 * a]; ov.R = [X + 250, 760 + Math.sin(t * 10 + 1) * 14 * a];
  return { cam: { cx: px + 10, cy: lerp(1100, 960, u), z: lerp(1.3, 1.5, u), roll: -3 }, bg: zoneHall(t, {}), mid: '', F: hallF(t, ov, { px, py: 1232, k: 0.44, st: { lookY: -50, rot: -6 } }), S: { P, k: 0.48 }, front: '' }; });
shot('L23', { zone: 'hall' }, (t, u) => { const px0 = paceHall(endT('L22')), sx = mv(t, C.L23.start, C.L23.start + 1.6, 140, 330), P = baseP(); P.x = sx; P.y = 1318;
  if (t < C.L23.start + 1.6) scoutGait(P, phS(Math.abs(sx - 140), 0.48, false), 1, false); else { P.brow = 0; P.lid = 6; }
  return { cam: { cx: lerp(380, 520, u), cy: 1000, z: lerp(1.05, 1.2, u) }, bg: zoneHall(t, {}), mid: '', F: hallF(t, idleOv(), { px: px0, py: 1232, k: 0.44 }), S: { P, k: 0.48 }, front: '' }; });
shot('L24', { zone: 'hall', pov: true }, (t, u) => { const a = amp(t), k = lerp(0.44, 0.56, ease(u)), py = lerp(1232, 1290, ease(u)), P = baseP(); P.x = 330; P.y = 1330;
  const ph = t * 8; const ov = frOv(t, ph, 1, false, a); ov.L = [X - 340, 960 + Math.sin(t * 7) * 30 * a]; ov.R = [X + 340, 960 + Math.sin(t * 7 + 1) * 30 * a]; delete ov.sway;
  return { cam: { cx: 500, cy: lerp(1120, 1180, u), z: lerp(1.15, 1.5, ease(u)), roll: 3 }, bg: zoneHall(t, {}), mid: '', F: hallF(t, ov, { px: lerp(paceHall(endT('L22')), 520, ease(u)), py, k, st: { lookX: 0, lookY: -5 } }), S: { P, k: 0.48 }, front: '' }; });
function kiteHeld(t, px, py, k, R, high) { const hw = hand(px, py, k, R[0], R[1]); const kx = hw[0] + 20, ky = hw[1] - (high ? 300 : 210) * k * 1.5; return kiteSvg(kx, ky, 0.5 * (k / 0.44), -8 + Math.sin(t * 8) * 4) + stringLine(hw, [kx, ky + 30 * k]); }
shot('L25', { zone: 'hall' }, (t, u) => { const P = baseP(); P.x = 330; P.y = 1330; P.brow = 0; P.lid = 6; const R = [X + 60, 1100]; const px = lerp(520, 500, u);
  return { cam: { cx: 500, cy: 1100, z: 1.35 }, bg: zoneHall(t, {}), mid: '', F: hallF(t, { L: [X - 70, 1120], R }, { px, py: 1290, k: 0.56, st: { sad: true } }), S: { P, k: 0.48 }, front: kiteHeld(t, px, 1290, 0.56, R, false) }; });
shot('L26', { zone: 'hall' }, (t, u) => { const P = baseP(); P.x = 330; P.y = 1330; const R = [X + 90, 610], px = lerp(500, 470, u), ov = { L: [X - 200, 880], R, fL: [X - 150, 1676], fR: [X + 120, 1676 - 30 * Math.sin(u * 6)] };
  return { cam: { cx: 480, cy: 1130, z: lerp(1.55, 1.95, u) }, bg: zoneHall(t, {}), mid: '', F: hallF(t, ov, { px, py: 1290, k: 0.56, lean: -4, st: { lookX: 20, lookY: -12 } }), S: { P, k: 0.48 }, front: kiteHeld(t, px, 1290, 0.56, R, true) }; });

// ===== THE FINALE: a proper run, a proper chase, a proper THUD =============================================
const DOOR = { floor: 1600, hitX: 540, k: 0.58 };
function runX(t) { const a = C.L27.start + 0.4, b = TL.thud; return lerp(-140, DOOR.hitX, Math.pow(clamp((t - a) / (b - a)), 1.7)); }
function doorsOpen(t) { return ease(clamp((t - TL.doorsOpen) / 0.5)); }
function chaseX(t) { return mv(t, C.L28.start - 0.3, TL.thud + 0.15, 200, 430); }
function chaseS(t) { const P = baseP(); P.y = 1632; P.x = t < C.L28.start - 0.3 ? 200 : chaseX(t); P.brow = 10;
  if (t >= C.L28.start - 0.3 && t < TL.thud + 0.15) scoutGait(P, phS(Math.abs(P.x - 200), 0.85, true), 1, true);
  else if (t >= TL.thud + 0.15) { P.brow = 0; P.lid = 6; P.lean = -3; }
  else P.fh = [130, -540];
  return P; }
function doorsF(t) {
  const x = runX(t), running = t < TL.thud, q = clamp((t - TL.thud) / 0.7);
  let ov;
  if (running) { const moving = t > C.L27.start + 0.4; ov = moving ? gaitF(phF(Math.abs(x + 140), DOOR.k, true), 1, true) : { fL: [X - 112, 1676], fR: [X + 112, 1676], L: [X - 165, 1230], R: [X + 165, 1230] }; ov.R = [X - 120 + (moving ? Math.sin(t * 15) * 20 : 0), 690]; }
  else ov = { fL: [X - 112, 1676], fR: [X + 112, 1676], L: [X - 130, 1330], R: [X + 130, 1330], by: 0 };
  const sy = running ? 1 : lerp(0.82, 0.5, ease(clamp((t - TL.thud - 0.35) / 0.6)));
  const st = headSt(t, 0.6, { lookX: 0, lookY: 0, rot: running ? 0 : lerp(0, -14, ease(q)), sad: !running });
  const hit = !running && t < TL.thud + 0.35;
  return { st, ov, px: x, py: DOOR.floor, k: DOOR.k, lean: running ? 9 : 0, sy: hit ? 0.82 : sy };
}
function doorsKite(t) {
  const x = runX(t);
  if (t < TL.thud) return kiteSvg(x - 260 * DOOR.k, DOOR.floor - 170 - Math.abs(Math.sin(t * 15)) * 14, 0.4, 70 + Math.sin(t * 20) * 6) + stringLine([x - 80 * DOOR.k, DOOR.floor - 330], [x - 250 * DOOR.k, DOOR.floor - 190], 20);
  return kiteSvg(x - 300, DOOR.floor - 70, 0.4, 84);
}
shot('L27', { zone: 'doors', whip: true }, (t, u) => ({ cam: { cx: lerp(380, 540, u), cy: 1000, z: lerp(1.0, 1.12, u) }, bg: zoneDoors(t, { open: doorsOpen(t) }), mid: doorsKite(t), F: doorsF(t), S: { P: chaseS(t), k: 0.85 }, front: '', sFirst: true }));
shot('L28', { zone: 'doors' }, (t, u) => ({ cam: { cx: lerp(380, 540, ease(u)), cy: 1080, z: lerp(1.1, 1.5, ease(u)) }, bg: zoneDoors(t, { open: doorsOpen(t) }), mid: doorsKite(t), F: doorsF(t), S: { P: chaseS(t), k: 0.85 }, front: '', sFirst: true }));
shot('L29', { zone: 'doors' }, (t, u) => { const P = chaseS(t); P.x = lerp(430, 330, ease(clamp((t - C.L29.start) / 1.0))); return { cam: { cx: 430, cy: 1280, z: 1.45 }, bg: zoneDoors(t, { open: doorsOpen(t) }), mid: doorsKite(t), F: doorsF(t), S: { P, k: 0.85 }, front: '', sFirst: true }; });
shot('L30', { zone: 'doors' }, (t, u) => { const F = doorsF(t); const ph = DOOR.floor + (F.st.cy - 1676) * DOOR.k * F.sy; const stars = [0, 1, 2, 3].map(i => { const ang = t * 5 + i * 1.57; return `<path d="M${f2(540 + Math.cos(ang) * 150)} ${f2(ph - 160 + Math.sin(ang) * 40)} l6 14 l15 2 l-11 10 l3 15 l-13 -8 l-13 8 l3 -15 l-11 -10 l15 -2z" fill="#ffd23f" stroke="#1b1b22" stroke-width="3"/>`; }).join('');
  return { cam: { cx: 540, cy: ph - 40, z: lerp(2.4, 2.7, u) }, bg: zoneDoors(t, { open: doorsOpen(t) }), mid: doorsKite(t), F, S: null, front: stars }; });

SHOTS.forEach((s, i) => { s.t0 = i === 0 ? 0 : C[s.id].start; s.t1 = i < SHOTS.length - 1 ? C[SHOTS[i + 1].id].start : BLACK_T; });
const shotIdx = t => { let r = 0; for (let i = 0; i < SHOTS.length; i++) if (t >= SHOTS[i].t0) r = i; return r; };
const STAMPS = [['L2', 'MORON!'], ['L4', 'CAROUSEL!'], ['L8', 'BISCUIT!'], ['L11', 'MORON!'], ['L15', 'STICKER!'], ['L22', 'MORON!']].map(([id, w]) => ({ t: wtw(id, w), word: w }));
function reactAt(t) { let r = 0; const pts = STAMPS.map(s => s.t).concat([C.L10.start, C.L30.start]); pts.forEach(p => { const a = t - p; if (a > 0 && a < 1.2) r = Math.max(r, Math.exp(-a * 4) * Math.abs(Math.cos(a * 13))); }); return r; }
const clampCam = c => { const z = c.z; return { z, roll: c.roll || 0, cx: clamp(c.cx, -300 + 540 / z, 1380 - 540 / z), cy: clamp(c.cy, 960 / z, 1920 - 960 / z) }; };

function povOverlay(t) {
  const on = Math.floor(t * 1.7) % 2 === 0, sec = Math.floor(t);
  const br = (x, y, sx, sy) => `<path d="M${x} ${y + 70 * sy} V${y} H${x + 70 * sx}" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity="0.92"/>`;
  return `<g>${br(50, 330, 1, 1)}${br(1030, 330, -1, 1)}${br(50, 1830, 1, -1)}${br(1030, 1830, -1, -1)}
    <circle cx="470" cy="945" r="3" fill="#fff" opacity="0.7"/><path d="M440 945 h20 M480 945 h20 M470 915 v20 M470 955 v20" stroke="#fff" stroke-width="3" opacity="0.7"/>
    <circle cx="96" cy="1786" r="15" fill="${on ? '#ff2d2d' : '#5a1212'}"/><text x="124" y="1796" font-size="30" fill="#fff" stroke="#000" stroke-width="4" paint-order="stroke">REC 00:${String(sec % 60).padStart(2, '0')}</text>
    <g transform="translate(930 1768)"><rect width="76" height="34" rx="6" fill="none" stroke="#fff" stroke-width="5"/><rect x="6" y="6" width="44" height="22" fill="#fff"/><rect x="76" y="10" width="7" height="14" fill="#fff"/></g></g>`;
}

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
  REACT = reactAt(t);
  const idx = shotIdx(t), sh = SHOTS[idx], nxt = SHOTS[idx + 1];
  const u = clamp((t - sh.t0) / (sh.t1 - sh.t0));
  const st = sh.fn(t, u);
  const cam = clampCam(st.cam);
  const punch = 1 + 0.07 * Math.max(0, 1 - (t - sh.t0) / 0.14);
  const z = cam.z * punch;
  const shk = sh.pov ? 5 : 0;
  const cx = cam.cx + Math.sin(t * 1.3) * 5 + Math.sin(t * 17) * shk, cy = cam.cy + Math.cos(t * 1.1) * 4 + Math.cos(t * 13) * shk;
  // whip pans in and out of the cuts that change location
  let wOff = 0, wBlur = 0;
  if (sh.whip) { const q = clamp(1 - (t - sh.t0) / 0.26); wOff = q * q * 620; wBlur = q * 34; }
  if (nxt && nxt.whip) { const q = clamp((t - (sh.t1 - 0.12)) / 0.12); wOff = -q * q * 620; wBlur = Math.max(wBlur, q * 30); }
  const kF = st.F ? st.F.k * z : 1, kS = st.S ? st.S.k * z : 1;
  let s = `<defs>${stk('stF', kF)}${stk('stS', kS)}<filter id="whipB" x="-20%" y="0" width="140%" height="100%"><feGaussianBlur stdDeviation="${f2(wBlur)} 0"/></filter>
    <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6d4b4"/><stop offset="1" stop-color="#e5ae86"/></linearGradient>
    <linearGradient id="red" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4a7bb5"/><stop offset="1" stop-color="#2c5282"/></linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffd27a" stop-opacity="0.9"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient>
    <radialGradient id="vig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.38"/></radialGradient>
    <radialGradient id="keyL" cx="0.15" cy="0.08" r="0.95"><stop offset="0" stop-color="#ffe2b0" stop-opacity="0.26"/><stop offset="1" stop-color="#ffe2b0" stop-opacity="0"/></radialGradient>
    <linearGradient id="shL" x1="0" y1="0" x2="0" y2="1"><stop offset="0.55" stop-color="#1d2a44" stop-opacity="0"/><stop offset="1" stop-color="#1d2a44" stop-opacity="0.3"/></linearGradient>
    <pattern id="grain" width="128" height="128" patternUnits="userSpaceOnUse"><image href="${GRAIN}" width="128" height="128"/></pattern></defs>`;
  s += `<g transform="translate(${f2(wOff)} 0)" ${wBlur > 0.5 ? 'filter="url(#whipB)"' : ''}><g transform="translate(540 960) rotate(${f2(cam.roll)}) scale(${f2(z)}) translate(${f2(-cx)} ${f2(-cy)})">`;
  const parts = st.bg.split('@@MID@@'), far = parts[0], mid = parts[1] || '';
  const f = ZP[sh.zone] == null ? 1 : ZP[sh.zone], pxs = (cx - 540) * (1 - f), pys = (cy - 960) * (1 - f), blur = clamp((z - 1.3) * 4, 0, 7);
  s += `<g transform="translate(${f2(pxs)} ${f2(pys)})" ${blur > 0.4 ? `style="filter:blur(${f2(blur)}px)"` : ''}>${far}</g>` + mid + (st.mid || '');
  const drawF = () => { if (st.F) { const F = st.F; s += shadow(F.px, F.py, F.k) + figF(t, F.st, F.ov, F.px, F.py, F.k, F.lean, F.sy); } };
  const drawS = () => { if (st.S) { s += shadow(st.S.P.x, st.S.P.y, st.S.k) + figS(t, st.S.P, st.S.k); } };
  if (st.sFirst) { drawS(); drawF(); } else { drawF(); drawS(); }
  if (st.glasses && st.F) { const g = hand(st.F.px, st.F.py, st.F.k, X - 235, 880); s += `<g transform="translate(${f2(g[0])} ${f2(g[1] - 20)}) scale(${f2(st.F.k * 1.4)})"><circle cx="-30" r="26" fill="#bde0fe" opacity="0.5" stroke="#d4a017" stroke-width="7"/><circle cx="30" r="26" fill="#bde0fe" opacity="0.5" stroke="#d4a017" stroke-width="7"/><path d="M-6 0 h12" stroke="#d4a017" stroke-width="6"/></g>`; }
  s += (st.front || '') + `</g></g>`;
  const th = t - TL.thud; if (th >= 0 && th < 0.18) s += `<rect width="1080" height="1920" fill="#fff" opacity="${f2(0.55 * (1 - th / 0.18))}"/>`;
  if (st.alarm && Math.floor(t * 4) % 2 === 0) s += `<rect width="1080" height="1920" fill="#ff1e1e" opacity="0.07"/>`;
  // cinematic grade: warm key light, cool shadows, soft teal/orange, vignette and film grain
  s += `<rect width="1080" height="1920" fill="url(#keyL)"/><rect width="1080" height="1920" fill="url(#shL)"/><rect width="1080" height="1920" fill="#ff9d4d" opacity="0.07" style="mix-blend-mode:soft-light"/><rect width="1080" height="1920" fill="url(#vig)"/><rect width="1080" height="1920" fill="url(#grain)" opacity="0.10" style="mix-blend-mode:multiply"/>`;
  if (sh.pov) s += povOverlay(t);
  for (let i = 0; i < STAMPS.length; i++) {
    const a = t - STAMPS[i].t;
    if (a >= 0 && a < 0.65) {
      const k = Math.min(1, a / 0.1), fade = a > 0.45 ? 1 - (a - 0.45) / 0.2 : 1, sc = 1.5 - 0.5 * ease(k);
      const fs = Math.min(150, Math.floor(980 / (STAMPS[i].word.length * 0.72)));
      s += `<g transform="translate(540 590) rotate(${i % 2 ? 5 : -5}) scale(${f2(sc)})" opacity="${f2(fade)}"><text text-anchor="middle" font-size="${fs}" fill="#e63946" stroke="#fffdf5" stroke-width="22" paint-order="stroke" stroke-linejoin="round">${STAMPS[i].word}</text><text text-anchor="middle" font-size="${fs}" fill="#e63946">${STAMPS[i].word}</text></g>`;
    }
  }
  const cap = captionFor(t);
  if (cap) {
    const sc = 1 + (1 - cap.pop) * 0.12, fs = Math.min(92, Math.floor(920 / (cap.text.length * 0.66))), wbar = Math.min(1040, cap.text.length * fs * 0.64 + 60);
    const bar = cap.spk === 'E' ? '#ffe14a' : (cap.spk === 'A' ? '#bde0fe' : '#ffffff');
    s += `<g transform="translate(540 255) scale(${f2(sc)}) rotate(${cap.spk === 'E' ? -1.2 : 0.8})"><rect x="${-wbar / 2 + 8}" y="${-fs * 0.95 + 10}" width="${wbar}" height="${fs * 1.25}" rx="10" fill="#000" opacity="0.28"/><rect x="${-wbar / 2}" y="${-fs * 0.95}" width="${wbar}" height="${fs * 1.25}" rx="10" fill="${bar}" stroke="#1b1b22" stroke-width="6"/><text x="0" y="0" text-anchor="middle" font-size="${fs}" fill="#1b1b22">${cap.text.replace(/&/g, '&amp;')}</text></g>`;
  }
  s += `<rect x="30" y="52" width="400" height="56" rx="8" fill="#111"/><text x="46" y="92" font-size="32" fill="#fff" letter-spacing="6">SURVIVAL UNTOLD</text>`;
  if (t < 3.6) s += `<text x="46" y="148" font-size="28" fill="#1b1b22" stroke="#fffdf5" stroke-width="6" paint-order="stroke" style="font-weight:800">GENIUSES GONE MAD · EPISODE 3</text><text x="46" y="1892" font-size="26" fill="#fffdf5" stroke="#1b1b22" stroke-width="6" paint-order="stroke" style="font-weight:800">AI-generated fictional historical comedy.</text>`;
  svg.innerHTML = s;
};
renderFrame(0);
