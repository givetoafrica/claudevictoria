// THE FILM: draws any script. Each scene type below (kinetic, stat, mythfact, steps, flow, compare, alert, quiz, recap)
// is a pure function of the time, its script data, and the cue times found in the real narration.
(function () {
  const U = globalThis.U, G = globalThis.G, Ch = globalThis.Ch, UI = globalThis.UI, Subs = globalThis.Subs, S = globalThis.SCORE, Studio = globalThis.Studio;
  const { clamp, ease } = U;
  const W = G.W, H = G.H;
  const SCRIPT = S.A.script;
  const TH = globalThis.THEMES[SCRIPT.theme || 'fun'];
  const C = TH.colors, F = TH.fonts;
  const HOST = SCRIPT.host !== false ? TH.host : null;
  const L = 80, R = HOST ? 1400 : 1840, Wc = R - L, CX = (L + R) / 2;
  UI.setTheme({ accent: C.a1, accent2: C.a2, ok: C.ok, ink: C.ink, muted: C.muted, onAccent: '#FFFFFF', app: C.card, card: '#FFFFFF', line: C.soft, shadow: 'rgba(0,0,0,0.12)' });
  let VO = null, SUBS = [];
  const CACHE = new Map(); // cue times per scene (they never change once the voice is loaded)

  const col = (k) => C[k] || k;
  const head = (ctx, str, x, y, o = {}) => G.text(ctx, str, x, y, { fam: F.head, weight: F.headW, ...o });
  const bodyT = (ctx, str, x, y, o = {}) => G.text(ctx, str, x, y, { fam: F.body, weight: F.bodyW, ...o });
  const mw = (ctx, s, size, fam, w) => { const r = G.measure(ctx, s, size, fam, w); return typeof r === 'number' ? r : (r && (r.width || r.w)) || 0; };
  const fitSize = (ctx, s, maxW, size, fam, w) => { let z = size; while (z > 22 && mw(ctx, s, z, fam, w) > maxW) z -= 4; return z; };
  function wrap(ctx, s, maxW, size, fam, w) {
    const out = []; let cur = '';
    for (const wd of s.split(' ')) { const nx = cur ? cur + ' ' + wd : wd; if (cur && mw(ctx, nx, size, fam, w) > maxW) { out.push(cur); cur = wd; } else cur = nx; }
    if (cur) out.push(cur);
    return out;
  }
  const pop = (t, t0, dur = 0.3) => (t < t0 ? 0 : UI.pop(t, t0, dur, 2.2));
  const fade = (t, t0, d = 0.3) => (t < t0 ? 0 : clamp((t - t0) / d));
  const withPop = (ctx, t, t0, cx, cy, fn) => { const k = pop(t, t0); if (k <= 0) return; ctx.save(); ctx.translate(cx, cy); ctx.scale(k, k); ctx.translate(-cx, -cy); fn(); ctx.restore(); };
  const stamp = (t, t0) => (t < t0 ? 0 : 1 + 0.35 * (1 - ease.outCubic(clamp((t - t0) / 0.2))));
  const card = (ctx, x, y, w, h, seed, fill, r = 22) => G.rrect(ctx, x, y, w, h, r, { fill: fill || C.card, lw: 5, seed });
  // a line of kinetic type: words spring in one after another, centred on cx, baseline y
  function kLine(ctx, str, cx, y, size, color, t, t0, o = {}) {
    const fam = o.fam || F.head, wt = o.w ?? F.headW;
    const words = str.split(' ');
    const sp = mw(ctx, ' ', size, fam, wt) || size * 0.3;
    const ws = words.map((w) => mw(ctx, w, size, fam, wt));
    const total = ws.reduce((a, b) => a + b, 0) + sp * (words.length - 1);
    let x = cx - total / 2;
    words.forEach((w, i) => {
      const tw = t0 + i * 0.09, k = pop(t, tw);
      if (k > 0) { ctx.save(); ctx.translate(x + ws[i] / 2, y); ctx.scale(k, k); G.text(ctx, w, 0, 0, { size, fam, weight: wt, color, align: 'center', ...(o.stroke ? { stroke: o.stroke, strokeW: o.strokeW || 8 } : {}) }); ctx.restore(); }
      x += ws[i] + sp;
    });
  }

  const titleLine = (ctx, t, sc) => { if (sc.title) head(ctx, sc.title, L, 150, { size: fitSize(ctx, sc.title, Wc, 56, F.head, F.headW), color: C.a2, align: 'left', alpha: fade(t, sc.t0 + 0.3, 0.4) }); };
  function cues(sc) {
    if (!CACHE.has(sc.id)) CACHE.set(sc.id, S.cueTimes(VO.lines, sc, S.reveals(sc)));
    return CACHE.get(sc.id);
  }

  // ---------- backgrounds, the host, the wordmark ----------
  function newsBackdrop(ctx, t) {
    G.bg(ctx, '#FAF7F2');
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#F1EBF6'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#3B0B45'; ctx.fillRect(0, 0, W, 10); ctx.fillStyle = C.a3; ctx.fillRect(0, 10, W, 4);
    const y0 = 1000;
    ctx.fillStyle = '#3B0B45'; ctx.fillRect(0, y0, W, H - y0);
    const text = (SCRIPT.ticker || []).join('   \u2022   ') + '   \u2022   ';
    if (text.trim() !== '\u2022') {
      const tw = mw(ctx, text, 30, F.body, F.bodyW) || 1, off = (t * 95) % tw;
      ctx.save(); ctx.beginPath(); ctx.rect(440, y0, W - 440, H - y0); ctx.clip();
      for (let k = -1; k < 3; k++) bodyT(ctx, text, 460 - off + k * tw, y0 + 50, { size: 30, color: '#FAF7F2', align: 'left', alpha: 0.92 });
      ctx.restore();
    }
    ctx.fillStyle = '#E8B547'; ctx.fillRect(0, y0, 430, H - y0);
    bodyT(ctx, SCRIPT.wordmark || 'NONPROFITSDAILY NEWS', 24, y0 + 50, { size: 24, color: '#1C1421', align: 'left' });
    if (SCRIPT.watermark) UI.pill(ctx, W - 520, 36, SCRIPT.watermark, { size: 22, h: 42, bg: 'rgba(0,0,0,0)', fg: C.a4, weight: 800 });
  }
  function backdrop(ctx, sc, t) {
    if (TH.newsroom) { newsBackdrop(ctx, t); return true; }
    const dark = sc.bg ? sc.bg === 'dark' : ['kinetic', 'stat', 'alert', 'quiz', 'recap'].includes(sc.type);
    G.bg(ctx, dark ? C.bgDark : C.bg);
    G.poly(ctx, [[-20, 985], [W + 20, 985], [W + 20, H + 20], [-20, H + 20]], { fill: dark ? G.tint(C.bgDark, 0.12) : C.floor, lw: 5, seed: 5, hatch: { color: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)', gap: 10 } });
    return dark;
  }
  function host(ctx, t, gesture) {
    if (!HOST) return;
    const hop = 6 * Math.abs(Math.sin(Math.PI * S.clock.phase(t)));
    const m = Subs.mouth(VO, t, 'narrator');
    Ch.person(ctx, { x: 1650, y: 1040 - hop, s: 0.8, pose: 'stand', style: HOST, gesture: gesture || null, mouth: m.talking ? m : 'smile', eyes: 'happy', seed: 900 });
  }
  const GESTURE = { kinetic: 'pointUp', stat: 'point', mythfact: 'shrug', steps: 'point', flow: 'point', compare: 'point', alert: 'point', quiz: 'think', recap: 'thumbsUp' };
  function wordmark(ctx, dark) { if (!TH.newsroom && SCRIPT.wordmark) bodyT(ctx, SCRIPT.wordmark, L, 1030, { size: 22, color: dark ? C.a3 : C.a2, align: 'left', alpha: 0.9 }); }

  // ---------- scene types ----------
  function kinetic(ctx, t, sc, T, dark) {
    const txt = dark ? C.onDark : C.ink;
    if (sc.kicker) bodyT(ctx, sc.kicker, CX, 120, { size: 28, color: C.a3, align: 'center', alpha: fade(t, sc.t0 + 0.2, 0.5) });
    const n = sc.lines.length, size0 = n <= 2 ? 118 : n === 3 ? 96 : 76, lh = size0 * 1.28;
    sc.lines.forEach((ln, i) => {
      const size = fitSize(ctx, ln.text, Wc - 60, ln.size || size0, F.head, F.headW);
      kLine(ctx, ln.text, CX, 520 + (i - (n - 1) / 2) * lh, size, col(ln.color || (i % 2 ? 'a3' : 'onDark')), t, T[i], {});
    });
    if (sc.lower) { const tl = T[n]; withPop(ctx, t, tl, L + 330, 760, () => { G.rrect(ctx, L, 690, 660, 120, 16, { fill: C.a3, lw: 5, seed: 31 }); head(ctx, sc.lower.text, L + 28, 750, { size: 44, color: C.onA3, align: 'left' }); bodyT(ctx, sc.lower.sub, L + 28, 792, { size: 28, color: C.onA3, align: 'left' }); }); }
  }
  function stat(ctx, t, sc, T, dark) {
    const k = stamp(t, T[0]);
    if (k > 0) { ctx.save(); ctx.translate(CX - 330, 560); ctx.scale(k, k); head(ctx, sc.big.text, 0, 0, { size: 600, color: C.a3, align: 'center', stroke: C.a2 === C.bgDark ? C.a1 : C.ink, strokeW: 14 }); ctx.restore(); }
    const lx = CX + 190;
    if (sc.label) { const lines = wrap(ctx, sc.label.text, 560, 62, F.head, F.headW); lines.forEach((s, i) => head(ctx, s, lx, 380 + i * 76, { size: 62, color: C.onDark, align: 'left', alpha: fade(t, T[1], 0.4) })); }
    if (sc.sub) { const lines = wrap(ctx, sc.sub.text, 560, 40, F.body, F.bodyW); lines.forEach((s, i) => bodyT(ctx, s, lx, 560 + i * 54, { size: 40, color: C.a4, align: 'left', alpha: fade(t, T[2], 0.4) })); }
    if (sc.stamp) { const k2 = stamp(t, T[3]); if (k2 > 0) { ctx.save(); ctx.translate(lx + 120, 790); ctx.rotate(-0.08); ctx.scale(k2, k2); G.rrect(ctx, -250, -62, 500, 124, 14, { fill: 'rgba(0,0,0,0)', stroke: C.a3, lw: 10, seed: 41 }); head(ctx, sc.stamp.text, 0, 24, { size: 76, color: C.a3, align: 'center' }); ctx.restore(); } }
  }
  function mythfact(ctx, t, sc, T) {
    const w = (Wc - 60) / 2, y = 190, h = 470;
    withPop(ctx, t, T[0], L + w / 2, y + h / 2, () => {
      card(ctx, L, y, w, h, 51, C.soft);
      UI.pill(ctx, L + 28, y + 24, 'MYTH', { size: 30, h: 54, bg: C.muted, fg: '#FFFFFF', weight: 800 });
      wrap(ctx, '“' + sc.myth + '”', w - 70, 50, F.head, F.headW).forEach((s, i) => head(ctx, s, L + 36, y + 170 + i * 66, { size: 50, color: C.ink, align: 'left' }));
    });
    if (t >= T[1]) { const u = ease.outCubic(clamp((t - T[1]) / 0.5)); G.line(ctx, [[L + 20, y + 120], [L + 20 + (w - 40) * u, y + h - 130]], { color: C.a1, lw: 10, seed: 52 }); G.line(ctx, [[L + 20, y + h - 130], [L + 20 + (w - 40) * u, y + 120]], { color: C.a1, lw: 10, seed: 53 }); }
    withPop(ctx, t, T[2], L + w + 60 + w / 2, y + h / 2, () => {
      card(ctx, L + w + 60, y, w, h, 54, C.a3);
      UI.pill(ctx, L + w + 88, y + 24, 'FACT', { size: 30, h: 54, bg: C.a2, fg: '#FFFFFF', weight: 800 });
      wrap(ctx, sc.fact, w - 70, 48, F.head, F.headW).forEach((s, i) => head(ctx, s, L + w + 96, y + 170 + i * 62, { size: 48, color: C.onA3, align: 'left' }));
    });
    if (sc.note) bodyT(ctx, sc.note, CX, 760, { size: 40, color: C.a2, align: 'center', alpha: fade(t, T[3], 0.4) });
  }
  function steps(ctx, t, sc, T, dark) {
    const n = sc.items.length, top = 215, bot = sc.footnote ? 820 : 880, rowH = Math.min(150, (bot - top) / n), gap = 14;
    titleLine(ctx, t, sc);
    sc.items.forEach((it, i) => {
      const y = top + i * rowH, h = rowH - gap;
      withPop(ctx, t, T[i], CX, y + h / 2, () => {
        card(ctx, L, y, Wc, h, 60 + i);
        let x = L + 28;
        if (sc.numbered) { G.ellipse(ctx, x + 30, y + h / 2, 30, 30, { fill: [C.a1, C.a2, C.a3, C.a4, C.a1, C.a2][i % 6], lw: 4, seed: 70 + i }); head(ctx, String(i + 1), x + 30, y + h / 2 + 14, { size: 38, color: [C.a1, C.a2, C.a3, C.a4, C.a1, C.a2][i % 6] === C.a3 ? C.onA3 : [C.a1, C.a2, C.a3, C.a4, C.a1, C.a2][i % 6] === C.a4 ? C.ink : '#FFFFFF', align: 'center' }); x += 84; }
        if (it.badge) { const bw = UI.pill(ctx, x, y + h / 2 - 28, it.badge, { size: 30, h: 56, bg: [C.a1, C.a2, C.a3][i % 3], fg: i % 3 === 2 ? C.onA3 : '#FFFFFF', weight: 800 }); x += (bw || 220) + 26; }
        const tw = (sc.ownerColumn ? Wc - 300 : R - x - 30);
        const size = fitSize(ctx, it.text, tw - (x - L), it.sub ? 40 : 44, F.body, F.bodyW);
        bodyT(ctx, it.text, x, y + h / 2 + (it.sub ? -4 : 14), { size, color: C.ink, align: 'left' });
        if (it.sub) bodyT(ctx, it.sub, x, y + h / 2 + 36, { size: 28, color: 'rgba(0,0,0,0.6)', align: 'left' });
        if (sc.ownerColumn) { G.line(ctx, [[R - 270, y + h - 28], [R - 40, y + h - 28]], { color: C.muted, lw: 4, seed: 90 + i }); if (T[n + 1] != null && t >= T[n + 1] + i * 0.18) bodyT(ctx, 'Name', R - 155, y + h - 38, { size: 32, color: C.a1, align: 'center', alpha: fade(t, T[n + 1] + i * 0.18, 0.3) }); }
      });
    });
    if (sc.ownerColumn) bodyT(ctx, 'OWNER', R - 155, 200, { size: 26, color: C.a1, align: 'center' });
    if (sc.footnote) bodyT(ctx, sc.footnote, CX, 868, { size: 34, color: C.a1, align: 'center', alpha: fade(t, T[n], 0.4) });
  }
  function flow(ctx, t, sc, T) {
    const n = sc.rows.length, top = sc.title ? 230 : 190, rowH = Math.min(230, (820 - top) / n);
    titleLine(ctx, t, sc);
    sc.rows.forEach((row, i) => {
      const y = top + i * rowH, h = rowH - 24, k = row.nodes.length, nw = (Wc - (k - 1) * 70) / k;
      row.nodes.forEach((nd, j) => {
        const t0 = T[i] + j * 0.5, x = L + j * (nw + 70);
        if (j > 0) { const u = ease.outCubic(clamp((t - t0 + 0.3) / 0.3)); if (u > 0) { G.line(ctx, [[x - 62, y + h / 2], [x - 62 + 50 * u, y + h / 2]], { color: C.ink, lw: 6, seed: 100 + i * 5 + j }); if (u > 0.9) G.line(ctx, [[x - 24, y + h / 2 - 14], [x - 10, y + h / 2], [x - 24, y + h / 2 + 14]], { color: C.ink, lw: 6, seed: 110 + i }); } }
        withPop(ctx, t, t0, x + nw / 2, y + h / 2, () => {
          const tone = nd.tone ? col(nd.tone) : C.card;
          const on = tone === C.a3 ? C.onA3 : (tone === C.card || tone === C.soft || tone === C.a4) ? C.ink : '#FFFFFF';
          card(ctx, x, y, nw, h, 120 + i * 5 + j, tone);
          const lines = wrap(ctx, nd.label, nw - 40, 38, F.head, F.headW);
          const base = y + h / 2 - ((lines.length - 1) * 46) / 2 - (nd.sub ? 14 : -10);
          lines.forEach((s, q) => head(ctx, s, x + nw / 2, base + q * 46, { size: fitSize(ctx, s, nw - 40, 38, F.head, F.headW), color: on, align: 'center' }));
          if (nd.sub) bodyT(ctx, nd.sub, x + nw / 2, y + h - 26, { size: 28, color: on === '#FFFFFF' ? C.a4 : 'rgba(0,0,0,0.62)', align: 'center' });
        });
      });
    });
    if (sc.note) bodyT(ctx, sc.note, CX, 870, { size: 36, color: C.a1, align: 'center', alpha: fade(t, T[n], 0.4) });
  }
  function compare(ctx, t, sc, T) {
    titleLine(ctx, t, sc);
    const w = (Wc - 60) / 2;
    [[sc.left, 0, T[0]], [sc.right, 1, T[1]]].forEach(([side, k, t0]) => {
      const x = L + k * (w + 60), y = 230, h = 460;
      withPop(ctx, t, t0, x + w / 2, y + h / 2, () => {
        card(ctx, x, y, w, h, 150 + k);
        UI.pill(ctx, x + 24, y + 22, side.label, { size: 30, h: 54, bg: k ? C.ok : C.muted, fg: '#FFFFFF', weight: 800 });
        let yy = y + 130; const barW = w - 60;
        let xx = x + 30;
        side.segments.forEach((sg, i) => {
          const u = ease.outCubic(clamp((t - t0 - 0.3 - i * 0.25) / 0.5)), sw = barW * (sg.pct / 100) * u;
          if (sw > 2) G.rrect(ctx, xx, yy, sw, 110, 10, { fill: col(sg.color), lw: 4, seed: 160 + i + k * 5 });
          xx += barW * (sg.pct / 100);
        });
        side.segments.forEach((sg, i) => { const ly = yy + 170 + i * 56; G.rrect(ctx, x + 36, ly - 26, 30, 30, 6, { fill: col(sg.color), lw: 3, seed: 170 + i }); bodyT(ctx, `${sg.label} ${sg.pct}%`, x + 84, ly, { size: 36, color: C.ink, align: 'left', alpha: fade(t, t0 + 0.5 + i * 0.25, 0.3) }); });
      });
    });
    if (sc.illustrative) bodyT(ctx, '(illustrative)', CX, 725, { size: 26, color: C.muted, align: 'center' });
    if (sc.quote) { const k = stamp(t, T[2]); if (k > 0) { ctx.save(); ctx.translate(CX, 800); ctx.scale(k, k); head(ctx, '“' + sc.quote + '”', 0, 0, { size: fitSize(ctx, sc.quote, Wc - 40, 56, F.head, F.headW), color: C.a1, align: 'center' }); ctx.restore(); } }
  }
  function alert(ctx, t, sc, T) {
    const k = stamp(t, T[0] > sc.t0 ? T[0] : sc.t0 + 0.3);
    ctx.save(); ctx.translate(CX, 200); ctx.rotate(-0.03); ctx.scale(k, k); head(ctx, sc.stamp, 0, 0, { size: 100, color: C.a3, align: 'center', stroke: C.ink === C.bgDark ? C.a1 : C.bgDark, strokeW: 8 }); ctx.restore();
    const n = sc.items.length, top = 290, rowH = Math.min(190, (860 - top) / n);
    sc.items.forEach((it, i) => {
      const y = top + i * rowH, h = rowH - 20;
      withPop(ctx, t, T[i + 1], CX, y + h / 2, () => {
        G.rrect(ctx, L, y, Wc, h, 20, { fill: 'rgba(255,255,255,0.08)', stroke: C.a3, lw: 5, seed: 180 + i });
        G.ellipse(ctx, L + 64, y + h / 2, 38, 38, { fill: C.a1, lw: 4, seed: 190 + i });
        G.line(ctx, [[L + 48, y + h / 2 - 16], [L + 80, y + h / 2 + 16]], { color: '#FFFFFF', lw: 8, seed: 200 + i }); G.line(ctx, [[L + 80, y + h / 2 - 16], [L + 48, y + h / 2 + 16]], { color: '#FFFFFF', lw: 8, seed: 210 + i });
        const lines = wrap(ctx, it.text, Wc - 190, 44, F.head, F.headW);
        lines.forEach((s, q) => head(ctx, s, L + 130, y + h / 2 + 12 - ((lines.length - 1) * 26) + q * 52, { size: 44, color: C.onDark, align: 'left' }));
      });
    });
  }
  function quiz(ctx, t, sc, T) {
    const c0 = sc.clips[0], c1 = sc.clips[1];
    const askEnd = c0.at + c0.dur, ansAt = c1.at;
    head(ctx, sc.kicker || 'PAUSE & CHECK', CX, 160, { size: 78, color: C.a3, align: 'center', alpha: fade(t, sc.t0 + 0.1, 0.4) });
    sc.facts.forEach((f, i) => withPop(ctx, t, sc.t0 + 0.7 + i * 0.35, CX, 270 + i * 90, () => { bodyT(ctx, f, CX, 290 + i * 84, { size: 46, color: C.onDark, align: 'center' }); }));
    if (sc.question && t < ansAt) bodyT(ctx, sc.question, CX, 270 + sc.facts.length * 84 + 70, { size: 54, color: C.a3, align: 'center', alpha: fade(t, c0.at + c0.dur * 0.7, 0.4) });
    // the countdown in the pause between question and answer
    if (t >= askEnd && t < ansAt) {
      const left = ansAt - t, num = Math.ceil(left - 0.15);
      const frac = (left % 1);
      ctx.save(); ctx.translate(CX, 770);
      UI.ring(ctx, 0, 0, 120, 1 - frac, { color: C.a3, track: 'rgba(255,255,255,0.15)', lw: 20 });
      head(ctx, String(Math.max(1, num)), 0, 50, { size: 150, color: C.onDark, align: 'center' });
      ctx.restore();
    }
    if (t >= ansAt) {
      const lines = sc.answer;
      lines.forEach((ln, i) => { const size = fitSize(ctx, ln.text, Wc - 60, 78, F.head, F.headW); kLine(ctx, ln.text, CX, 640 + i * 120, size, col(ln.color || (i ? 'a3' : 'onDark')), t, T[i + 1] || ansAt, {}); });
    }
  }
  function recap(ctx, t, sc, T) {
    head(ctx, sc.title || 'RECAP', CX, 160, { size: 84, color: C.a3, align: 'center', alpha: fade(t, sc.t0 + 0.2, 0.4) });
    const n = sc.points.length;
    sc.points.forEach((p, i) => {
      const y = 240 + i * 120;
      withPop(ctx, t, T[i], CX, y + 44, () => {
        G.ellipse(ctx, L + 220, y + 44, 40, 40, { fill: [C.a1, C.a4, C.a3][i % 3], lw: 4, seed: 230 + i });
        head(ctx, String(i + 1), L + 220, y + 62, { size: 46, color: i % 3 === 2 ? C.onA3 : (i % 3 === 1 ? C.bgDark : '#FFFFFF'), align: 'center' });
        head(ctx, p.text, L + 290, y + 62, { size: 60, color: C.onDark, align: 'left' });
      });
    });
    if (sc.teaser) withPop(ctx, t, T[n], CX, 700, () => {
      G.rrect(ctx, L + 40, 610, Wc - 80, 190, 20, { fill: 'rgba(255,255,255,0.08)', stroke: C.a3, lw: 5, seed: 240 });
      bodyT(ctx, sc.teaser.label, L + 80, 662, { size: 28, color: C.a3, align: 'left' });
      wrap(ctx, sc.teaser.title, Wc - 160, 46, F.head, F.headW).forEach((s, i) => head(ctx, s, L + 80, 720 + i * 56, { size: 46, color: C.onDark, align: 'left' }));
    });
    if (sc.closer) withPop(ctx, t, T[n + 1], CX, 860, () => { bodyT(ctx, sc.closer, CX, 870, { size: fitSize(ctx, sc.closer, Wc - 40, 40, F.body, F.bodyW), color: C.a3, align: 'center' }); });
  }


  // ---------- newsroom scenes ----------
  const chip = (ctx, x, y, str, o = {}) => UI.pill(ctx, x, y, str, { size: 22, h: 40, bg: o.bg || C.a4, fg: o.fg || C.a2, weight: 800 });
  function sourceTag(ctx, x, y, f, alpha = 1) {
    ctx.save(); ctx.globalAlpha = alpha;
    G.ellipse(ctx, x + 14, y - 8, 12, 12, { fill: C.ok, lw: 0, seed: 7 });
    UI.check(ctx, x + 14, y - 8, 7, 1);
    bodyT(ctx, 'SOURCE', x + 38, y, { size: 20, color: C.a3, align: 'left' });
    bodyT(ctx, f, x + 128, y, { size: 22, color: C.a4, align: 'left' });
    ctx.restore();
  }
  function headlines(ctx, t, sc, T) {
    head(ctx, sc.title || 'THIS WEEK IN NONPROFITS', 120, 170, { size: 74, color: C.a2, align: 'left', alpha: fade(t, sc.t0 + 0.2, 0.6) });
    if (sc.date) bodyT(ctx, sc.date, 124, 225, { size: 30, color: C.a4, align: 'left', alpha: fade(t, sc.t0 + 0.5, 0.6) });
    sc.items.forEach((it, i) => {
      const y = 330 + i * 160, a = fade(t, T[i], 0.5), dx = 40 * (1 - ease.outCubic(clamp((t - T[i]) / 0.5)));
      if (t < T[i]) return;
      ctx.save(); ctx.globalAlpha = a; ctx.translate(dx, 0);
      G.rrect(ctx, 120, y - 56, 6, 110, 3, { fill: C.a3, lw: 0, seed: 20 + i });
      head(ctx, String(i + 1).padStart(2, '0'), 160, y + 14, { size: 54, color: C.a3, align: 'left' });
      const lines = wrap(ctx, it.text, 1150, 50, F.head, F.headW);
      lines.forEach((s, q) => head(ctx, s, 270, y - (lines.length - 1) * 26 + q * 56, { size: 50, color: C.onDark, align: 'left' }));
      if (it.tag) chip(ctx, W - 120 - 220, y - 28, it.tag, { bg: C.a3, fg: C.onA3 });
      ctx.restore();
    });
  }
  function story(ctx, t, sc, T) {
    const n = sc.facts.length;
    withPop(ctx, t, sc.t0 + 0.25, 220, 130, () => chip(ctx, 120, 108, sc.tag, { bg: C.a3, fg: C.onA3 }));
    const lines = wrap(ctx, sc.headline, 1060, 70, F.head, F.headW);
    lines.forEach((s, i) => head(ctx, s, 120, 230 + i * 84, { size: 70, color: C.onDark, align: 'left', alpha: fade(t, T[0], 0.6) }));
    const y0 = 230 + lines.length * 84 + 40;
    sc.facts.forEach((f, i) => {
      const y = y0 + i * 140, ti = T[i + 1];
      if (t < ti) return;
      const a = fade(t, ti, 0.4), dx = 30 * (1 - ease.outCubic(clamp((t - ti) / 0.4)));
      ctx.save(); ctx.globalAlpha = a; ctx.translate(dx, 0);
      G.rrect(ctx, 120, y - 30, 12, 12, 2, { fill: C.a3, lw: 0, seed: 40 + i });
      wrap(ctx, f.text, 1000, 36, F.body, F.bodyW).forEach((s, q) => bodyT(ctx, s, 152, y + q * 44, { size: 36, color: C.onDark, align: 'left' }));
      if (f.source) sourceTag(ctx, 152, y + 60 + (wrap(ctx, f.text, 1000, 36, F.body, F.bodyW).length - 1) * 44, f.source);
      ctx.restore();
    });
    if (sc.stat) withPop(ctx, t, T[n + 1], 1530, 470, () => {
      G.rrect(ctx, 1240, 280, 560, 400, 22, { fill: C.card, lw: 0, seed: 50 });
      bodyT(ctx, sc.stat.label, 1520, 360, { size: 28, color: C.a1, align: 'center' });
      head(ctx, sc.stat.big, 1520, 540, { size: 150, color: C.a2, align: 'center' });
      wrap(ctx, sc.stat.caption, 480, 30, F.body, F.bodyW).forEach((s, q) => bodyT(ctx, s, 1520, 600 + q * 38, { size: 30, color: C.ink, align: 'center' }));
    });
    if (sc.why) withPop(ctx, t, T[n + 2], 960, 840, () => {
      G.rrect(ctx, 120, 760, 1680, 150, 18, { fill: C.card, lw: 0, seed: 60 });
      G.rrect(ctx, 120, 760, 12, 150, 6, { fill: C.a1, lw: 0, seed: 61 });
      bodyT(ctx, 'WHY IT MATTERS', 160, 808, { size: 24, color: C.a1, align: 'left' });
      wrap(ctx, sc.why, 1560, 36, F.head, F.headW).forEach((s, q) => head(ctx, s, 160, 856 + q * 44, { size: 36, color: C.ink, align: 'left' }));
    });
  }
  function take(ctx, t, sc, T) {
    G.rrect(ctx, 120, 190, 14, 640, 7, { fill: C.a3, lw: 0, seed: 70 });
    bodyT(ctx, sc.label || "VICTORIA'S TAKE", 170, 232, { size: 30, color: C.a3, align: 'left', alpha: fade(t, T[0], 0.5) });
    const lines = wrap(ctx, '\u201C' + sc.quote + '\u201D', 1400, 66, F.head, F.headW);
    lines.forEach((s, i) => head(ctx, s, 170, 330 + i * 82, { size: 66, color: C.onDark, align: 'left', alpha: fade(t, T[1], 0.7) }));
    const y0 = 330 + lines.length * 82 + 50;
    if (sc.actions) { bodyT(ctx, "WHAT I'D DO", 170, y0, { size: 24, color: C.a4, align: 'left', alpha: fade(t, T[2], 0.4) }); }
    (sc.actions || []).forEach((a, i) => {
      const ti = T[i + 2]; if (t < ti) return;
      const al = fade(t, ti, 0.4);
      ctx.save(); ctx.globalAlpha = al;
      G.ellipse(ctx, 196, y0 + 52 + i * 62 - 10, 20, 20, { fill: C.a3, lw: 0, seed: 80 + i });
      head(ctx, String(i + 1), 196, y0 + 52 + i * 62 + 2, { size: 24, color: C.onA3, align: 'center' });
      bodyT(ctx, a.text, 236, y0 + 52 + i * 62, { size: 36, color: C.onDark, align: 'left' });
      ctx.restore();
    });
  }

  const TYPES = { headlines, story, take, kinetic, stat, mythfact, steps, flow, compare, alert, quiz, recap };
  const sceneAt = (t) => S.scenes.find((s) => t >= s.t0 && t < s.t1) || S.scenes[S.scenes.length - 1];

  Studio.film({
    fadeOut: 1.4,
    async init() { VO = await Studio.loadJSON('out/voice.json'); SUBS = Subs.fromVoice(VO, { maxWords: 6 }); },
    draw(ctx, t) {
      const sc = sceneAt(t);
      G.setStyle(TH.style || 'paper');
      const dark = backdrop(ctx, sc, t);
      const shake = 9 * Math.exp(-(t - sc.t0) * 9) * (sc.idx > 0 ? 1 : 0);
      ctx.save(); ctx.translate(U.noise1(t * 30, 1) * shake, U.noise1(t * 30, 2) * shake);
      const T = cues(sc);
      TYPES[sc.type](ctx, t, sc, T, dark);
      wordmark(ctx, dark);
      host(ctx, t, t > (T.find((x) => x != null) ?? 0) ? GESTURE[sc.type] : null);
      ctx.restore();
      if (sc.idx > 0 && t - sc.t0 < 0.18) { ctx.fillStyle = `rgba(255,255,255,${0.7 * (1 - (t - sc.t0) / 0.18)})`; ctx.fillRect(0, 0, W, H); }
      Subs.draw(ctx, t, SUBS, { style: 'box', size: 42, x: HOST ? 780 : 960, y: 945, maxW: HOST ? 1400 : 1700 });
    },
  });
})();
