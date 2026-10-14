// THE FILM: "Your Year-End Appeal in 30 Days" for Nonprofits Daily.
// A host lip-syncs the real narration; each scene's pictures land on the narrator's own words (cue times come from
// out/voice.json), and the four week scenes share one rising chime with the music.
(function () {
  const U = globalThis.U, G = globalThis.G, Ch = globalThis.Ch, UI = globalThis.UI, Data = globalThis.Data, Subs = globalThis.Subs, S = globalThis.SCORE, Studio = globalThis.Studio;
  const { clamp, ease } = U;
  const { ev } = S;
  const W = G.W, H = G.H;
  let VO = null, SUBS = [];

  const C = { bg: '#F6EEDC', ink: '#2A2320', terra: '#D9663B', teal: '#1F7A74', gold: '#F2B84B', rose: '#E0708A', sky: '#8FC1D4', card: '#FFFBF2', soft: '#EADBB9', grey: '#B8A98F', ok: '#2E9E6B' };
  UI.setTheme({ accent: C.terra, accent2: C.teal, ok: C.ok, ink: C.ink, muted: '#7A6F66', onAccent: '#FFFFFF', app: C.card, card: '#FFFFFF', line: '#E6D9C0', shadow: 'rgba(0,0,0,0.12)' });

  const sectionOf = (t) => Object.entries(S.S).find(([, [a, b]]) => t >= a && t < b)?.[0] || 'close';
  const talk = (t) => { const m = Subs.mouth(VO, t, 'narrator'); return m.talking ? m : 'smile'; };

  // the time of a spoken word: line li, first word matching re (the nth match), else a fallback inside the line
  function cue(li, re, nth = 0, fallback = 0.3) {
    const L = VO.lines[li];
    const ws = L.words.filter((w) => re.test(w.w));
    if (ws[nth]) return ws[nth].t;
    return L.t + (L.end - L.t) * fallback;
  }
  const pop = (t, t0, dur = 0.3) => (t < t0 ? 0 : UI.pop(t, t0, dur, 2.2));
  const fade = (t, t0, d = 0.3) => (t < t0 ? 0 : clamp((t - t0) / d));
  const withPop = (ctx, t, t0, cx, cy, fn) => { const k = pop(t, t0); if (k <= 0) return; ctx.save(); ctx.translate(cx, cy); ctx.scale(k, k); ctx.translate(-cx, -cy); fn(); ctx.restore(); };
  const stamp = (t, t0) => (t < t0 ? 0 : 1 + 0.35 * (1 - ease.outCubic(clamp((t - t0) / 0.2))));
  const box = (ctx, x, y, w, h, seed, fill = C.card, r = 22) => G.rrect(ctx, x, y, w, h, r, { fill, lw: 5, seed });
  const label = (ctx, str, x, y, o = {}) => G.text(ctx, str, x, y, { size: 34, fam: 'Bungee', weight: 400, color: C.terra, ...o });
  const body = (ctx, str, x, y, o = {}) => G.text(ctx, str, x, y, { size: 34, fam: 'Patrick Hand', weight: 400, color: C.ink, ...o });
  const check = (ctx, x, y, r, p) => UI.check(ctx, x, y, r, p);

  // the host: stands at the right, lip-syncs the narration, gestures on cue
  const HOST = { outfit: 'hoodie', shirt: '#1F7A74', hairStyle: 'curly', hair: '#2A1E1A', skin: '#A86E4B', bottoms: 'pants', pants: '#27305C', glasses: 'round', build: 'regular' };
  function host(ctx, t, gesture) {
    const hop = 6 * Math.abs(Math.sin(Math.PI * S.clock.phase(t)));
    Ch.person(ctx, { x: 1650, y: 1040 - hop, s: 0.8, pose: 'stand', style: HOST, gesture: gesture || null, mouth: talk(t), eyes: 'happy', seed: 900 });
  }
  const gestureAt = (t, seq) => { let g = null; for (const [t0, name] of seq) if (t >= t0) g = name; return g; };

  function floor(ctx) {
    G.bg(ctx, C.bg);
    G.poly(ctx, [[-20, 985], [W + 20, 985], [W + 20, H + 20], [-20, H + 20]], { fill: C.soft, lw: 5, seed: 5, hatch: { color: 'rgba(120,80,40,0.12)', gap: 10 } });
  }
  // the week tabs along the top; the current week is filled and pops when the scene opens
  function weekBar(ctx, t, wk, name) {
    const t0 = ev['w' + wk];
    for (let i = 1; i <= 4; i++) {
      const on = i === wk;
      const x = 80 + (i - 1) * 190;
      ctx.save();
      if (on) { const k = 1 + 0.18 * Math.max(0, 1 - (t - t0) * 4); ctx.translate(x + 80, 60); ctx.scale(k, k); ctx.translate(-(x + 80), -60); }
      UI.pill(ctx, x, 32, 'WEEK ' + i, { size: 28, h: 56, bg: on ? C.terra : (i < wk ? C.teal : '#E4D6B6'), fg: on || i < wk ? '#FFFFFF' : '#8A7C66', weight: 800 });
      ctx.restore();
    }
    const k = stamp(t, t0);
    ctx.save(); ctx.translate(80, 165); ctx.scale(k, k);
    G.text(ctx, name, 0, 0, { size: 84, fam: 'Bungee', weight: 400, color: C.terra, stroke: C.ink, strokeW: 9, align: 'left' });
    ctx.restore();
  }

  // ---------- title ----------
  function title(ctx, t) {
    floor(ctx);
    for (let i = 0; i < 5; i++) G.star(ctx, 160 + i * 330, 120 + (i % 2) * 40, 26 + (i % 3) * 8, { seed: i + 3 });
    const k = stamp(t, ev.title);
    if (k > 0) {
      ctx.save(); ctx.translate(820, 470); ctx.scale(k, k); ctx.rotate(-0.025);
      G.text(ctx, 'YOUR YEAR-END', 0, -70, { size: 120, align: 'center', fam: 'Bungee', weight: 400, color: C.terra, stroke: C.ink, strokeW: 10 });
      G.text(ctx, 'APPEAL IN 30 DAYS', 0, 70, { size: 120, align: 'center', fam: 'Bungee', weight: 400, color: C.teal, stroke: C.ink, strokeW: 10 });
      ctx.restore();
      G.text(ctx, 'a Nonprofits Daily explainer', 820, 640, { size: 56, align: 'center', fam: 'Patrick Hand', weight: 400, alpha: fade(t, ev.title + 0.5) });
    }
    host(ctx, t, 'wave');
  }

  // ---------- hook: a third of giving is in December -> it is October 14th -> 30 days, 4 weeks ----------
  function hook(ctx, t) {
    floor(ctx);
    const tThird = cue(0, /^third/i), tOct = cue(0, /^October/i), tBehind = cue(0, /^behind/i), tPlan = cue(0, /^plan/i), t30 = cue(0, /^30$/), tWeek = cue(0, /^week/i);
    const out = 1 - fade(t, t30 - 0.1, 0.4); // the first beats clear away for the countdown
    ctx.save(); ctx.globalAlpha = out;
    withPop(ctx, t, tThird, 420, 470, () => {
      box(ctx, 90, 200, 660, 560, 11);
      Data.donut(ctx, { x: 420, y: 470, r: 190, thickness: 70, data: [{ value: 33, color: C.gold }, { value: 67, color: '#CFE3DF' }], t, t0: tThird, t1: tThird + 1.2, center: '~1/3', centerSub: 'of the year' });
      body(ctx, 'December', 420, 740, { align: 'center', size: 38, color: '#B07A12' });
    });
    withPop(ctx, t, tOct, 1020, 470, () => {
      box(ctx, 800, 200, 460, 560, 12);
      G.rrect(ctx, 800, 200, 460, 130, 22, { fill: C.terra, lw: 5, seed: 13 });
      G.text(ctx, 'OCTOBER', 1030, 290, { size: 70, align: 'center', fam: 'Bungee', weight: 400, color: '#FFFFFF' });
      G.text(ctx, '14', 1030, 560, { size: 260, align: 'center', fam: 'Bungee', weight: 400, color: C.ink });
      body(ctx, 'today', 1030, 690, { align: 'center', size: 44, color: '#7A6F66' });
    });
    if (t >= tBehind) { const k = stamp(t, tBehind); ctx.save(); ctx.translate(780, 825); ctx.rotate(-0.06); ctx.scale(k, k); G.text(ctx, 'NOT BEHIND', 0, 0, { size: 96, align: 'center', fam: 'Bungee', weight: 400, color: C.ok, stroke: C.ink, strokeW: 9 }); ctx.restore(); }
    ctx.restore();
    if (t >= t30 - 0.1) {
      const k = pop(t, t30 - 0.1);
      ctx.save(); ctx.translate(640, 440); ctx.scale(k, k);
      UI.ring(ctx, 0, 0, 230, clamp((t - t30) / 1.2), { color: C.terra, track: '#E4D6B6', lw: 26 });
      G.text(ctx, '30', 0, 70, { size: 230, align: 'center', fam: 'Bungee', weight: 400, color: C.ink });
      G.text(ctx, 'DAYS', 0, 140, { size: 56, align: 'center', fam: 'Bungee', weight: 400, color: C.terra });
      ctx.restore();
    }
    const names = ['Plan', 'Write', 'Launch', 'Follow up'];
    names.forEach((n, i) => {
      const t0 = tWeek + i * 0.45;
      withPop(ctx, t, t0, 1010 + (i % 2) * 0, 330 + i * 120, () => {
        box(ctx, 900, 290 + i * 125, 460, 100, 20 + i, i % 2 ? '#FFFFFF' : C.card);
        UI.pill(ctx, 920, 312 + i * 125, 'WEEK ' + (i + 1), { size: 26, h: 52, bg: [C.terra, C.teal, C.gold, C.rose][i], fg: i === 2 ? C.ink : '#FFFFFF', weight: 800 });
        label(ctx, n.toUpperCase(), 1130, 355 + i * 125, { size: 42, color: C.ink });
      });
    });
    host(ctx, t, gestureAt(t, [[S.S.hook[0], null], [tBehind, 'shrug'], [tPlan, 'pointUp'], [tWeek, 'point']]));
  }

  // ---------- week 1: plan ----------
  const DOTS = Array.from({ length: 60 }, (_, i) => ({ cat: i < 26 ? 0 : i < 40 ? 1 : 2, k: i < 26 ? i : i < 40 ? i - 26 : i - 40 }));
  function w1(ctx, t) {
    floor(ctx);
    weekBar(ctx, t, 1, 'PLAN');
    const L = 1;
    const tGoal = cue(L, /^goal/i), tStory = cue(L, /^story/i), tNeed = cue(L, /^need/i), tAsk = cue(L, /^ask/i), tSplit = cue(L, /^split/i);
    const tCur = cue(L, /^current/i), tLap = cue(L, /^lapsed/i), tWarm = cue(L, /^warm/i), tCh = cue(L, /^channels/i);
    const tLet = cue(L, /^letter/i), tEm = cue(L, /^email/i), tSoc = cue(L, /^social/i), tCall = cue(L, /^call/i), tFin = cue(L, /^finish/i);
    // goal + story
    withPop(ctx, t, tGoal, 325, 370, () => {
      box(ctx, 90, 220, 470, 300, 31);
      label(ctx, 'GOAL', 130, 275);
      Data.counter(ctx, { x: 130, y: 380, from: 0, to: 25000, t, t0: tGoal, t1: tGoal + 1.4, size: 84, color: C.ink, prefix: '$', align: 'left', fam: 'Bungee' });
      Data.counter(ctx, { x: 130, y: 460, from: 0, to: 250, t, t0: tGoal + 0.3, t1: tGoal + 1.6, size: 48, color: C.teal, suffix: ' donors', align: 'left', fam: 'Bungee' });
      body(ctx, '(example)', 470, 275, { size: 26, color: '#8A7C66', align: 'right' });
    });
    withPop(ctx, t, tStory, 835, 370, () => {
      box(ctx, 600, 220, 470, 300, 32);
      label(ctx, 'STORY', 640, 275, { color: C.teal });
      G.heart(ctx, 700, 420, 3.5);
    });
    [['1 story', tStory, 0], ['1 need', tNeed, 1], ['1 ask', tAsk, 2]].forEach(([s, t0, i]) => {
      if (t >= t0) UI.pill(ctx, 800, 330 + i * 56, s, { size: 30, h: 46, bg: [C.teal, C.gold, C.terra][i], fg: i === 1 ? C.ink : '#FFFFFF', weight: 800 });
    });
    // the list, split three ways
    const bins = [{ x: 90, name: 'Current donors', color: C.teal, t0: tCur }, { x: 410, name: 'Lapsed donors', color: C.gold, t0: tLap }, { x: 730, name: 'Warm prospects', color: C.terra, t0: tWarm }];
    if (t >= tSplit - 0.6) {
      bins.forEach((b, i) => {
        const a = fade(t, tSplit - 0.6, 0.4);
        ctx.save(); ctx.globalAlpha = a;
        G.rrect(ctx, b.x, 585, 300, 255, 18, { fill: 'rgba(255,255,255,0.55)', lw: 4, seed: 40 + i });
        G.text(ctx, b.name, b.x + 150, 575, { size: 32, align: 'center', fam: 'Patrick Hand', weight: 400, color: b.color === C.gold ? '#B07A12' : b.color });
        ctx.restore();
      });
    }
    DOTS.forEach((d, i) => {
      const home = [330 + G.rnd(i, 1) * 480, 535 + G.rnd(i, 2) * 40]; // the jumbled list
      const b = bins[d.cat];
      const dest = [b.x + 32 + (d.k % 6) * 47, 625 + Math.floor(d.k / 6) * 44];
      const p = ease.inOutCubic(clamp((t - b.t0 - d.k * 0.025) / 0.8));
      const x = home[0] + (dest[0] - home[0]) * p, y = home[1] + (dest[1] - home[1]) * p - Math.sin(Math.PI * p) * 60;
      const show = t >= tSplit - 0.9;
      if (!show) return;
      G.ellipse(ctx, x, y, 14, 14, { fill: p > 0.02 ? b.color : C.grey, lw: 3, seed: 100 + i });
    });
    // channels
    const chips = [{ n: 'Letter', t0: tLet }, { n: 'Email', t0: tEm }, { n: 'Social', t0: tSoc }, { n: 'Calls', t0: tCall }];
    if (t >= tCh) body(ctx, 'channels', 1250, 215, { align: 'center', size: 36, color: C.teal });
    chips.forEach((c, i) => {
      const y = 245 + i * 135;
      withPop(ctx, t, c.t0, 1250, y + 50, () => {
        box(ctx, 1110, y, 280, 105, 50 + i);
        const ix = 1160, iy = y + 52;
        if (i === 0) { G.rrect(ctx, ix - 30, iy - 20, 60, 40, 6, { fill: '#FFFFFF', lw: 4, seed: 60 }); G.line(ctx, [[ix - 30, iy - 20], [ix, iy + 4], [ix + 30, iy - 20]], { color: C.ink, lw: 4, seed: 61 }); }
        if (i === 1) G.text(ctx, '@', ix, iy + 18, { size: 56, align: 'center', fam: 'Bungee', weight: 400, color: C.terra });
        if (i === 2) G.text(ctx, '#', ix, iy + 18, { size: 56, align: 'center', fam: 'Bungee', weight: 400, color: C.teal });
        if (i === 3) { G.rrect(ctx, ix - 18, iy - 28, 36, 56, 8, { fill: '#FFFFFF', lw: 4, seed: 62 }); G.ellipse(ctx, ix, iy + 18, 4, 4, { fill: C.ink, lw: 2, seed: 63 }); }
        body(ctx, c.n, 1215, y + 66, { size: 40 });
      });
      if (t >= tFin) check(ctx, 1355, y + 52, 20, clamp((t - tFin - i * 0.15) / 0.3));
    });
    if (t >= tFin) body(ctx, 'pick what your team can finish', 1250, 800, { align: 'center', size: 30, color: C.terra, alpha: fade(t, tFin, 0.4) });
    host(ctx, t, gestureAt(t, [[S.S.w1[0], null], [tGoal, 'point'], [tSplit, 'pointUp'], [tFin, 'thumbsUp']]));
  }

  // ---------- week 2: write ----------
  function w2(ctx, t) {
    floor(ctx);
    weekBar(ctx, t, 2, 'WRITE');
    const L = 2;
    const tPerson = cue(L, /^person/i), tOutcome = cue(L, /^outcome/i), tGift = cue(L, /^gift/i), tAsk = cue(L, /^ask$/i), tLink = cue(L, /^link/i), tThank = cue(L, /^Thank/i);
    const tLetter = cue(L, /^letter/i), tEm = cue(L, /^email/i), tSoc = cue(L, /^social/i), tCall = cue(L, /^call/i), tRead = cue(L, /^read/i);
    const t0 = S.S.w2[0] + 0.6;
    ctx.save(); ctx.translate(380, 520); ctx.rotate(-0.015); ctx.translate(-380, -520);
    box(ctx, 90, 215, 580, 640, 70, '#FFFFFF', 14);
    body(ctx, 'Dear friend,', 130, 290, { size: 38 });
    // the letter's lines draw themselves, line by line
    const rows = [350, 395, 440, 485, 530, 575, 620, 665, 710, 755];
    rows.forEach((y, i) => { const u = clamp((t - t0 - i * 0.28) / 0.5); if (u > 0) G.line(ctx, [[130, y], [130 + (i % 3 === 2 ? 300 : 460) * u, y]], { color: '#CFC3AC', lw: 5, seed: 80 + i }); });
    if (t >= tOutcome) { ctx.save(); ctx.globalAlpha = 0.55 * fade(t, tOutcome, 0.3); G.rrect(ctx, 122, 466, 470, 36, 8, { fill: C.gold, lw: 0, seed: 90 }); ctx.restore(); }
    ctx.restore();
    withPop(ctx, t, tPerson, 600, 300, () => { G.ellipse(ctx, 600, 300, 44, 44, { fill: '#E8C6A6', lw: 5, seed: 91 }); G.ellipse(ctx, 586, 294, 5, 5, { fill: C.ink, lw: 2, seed: 92 }); G.ellipse(ctx, 614, 294, 5, 5, { fill: C.ink, lw: 2, seed: 93 }); G.line(ctx, [[586, 314], [600, 322], [614, 314]], { color: C.ink, lw: 4, seed: 94 }); });
    if (t >= tPerson) body(ctx, 'a person', 600, 372, { align: 'center', size: 28, color: C.terra, alpha: fade(t, tPerson, 0.3) });
    if (t >= tOutcome) body(ctx, '1 real outcome', 140, 494, { size: 28, color: C.ink, align: 'left', alpha: fade(t, tOutcome, 0.3) });
    if (t >= tGift) withPop(ctx, t, tGift, 160, 800, () => { UI.pill(ctx, 112, 780, 'what a gift does', { size: 28, h: 46, bg: C.teal, fg: '#FFFFFF', weight: 800 }); });
    if (t >= tAsk) UI.button(ctx, 520, 800, 220, 62, 'Give today', t, { tTap: tLink + 0.2, done: false, bg: C.terra });
    if (t >= tLink) UI.tap(ctx, 520, 800, t, tLink + 0.2, { color: C.terra });
    withPop(ctx, t, tThank, 700, 240, () => G.heart(ctx, 700, 250, 2.2));
    // write once, adapt everywhere
    const outs = [{ n: 'Email', t0: tEm, y: 225, c: C.terra }, { n: 'Social post', t0: tSoc, y: 425, c: C.teal }, { n: 'Call script', t0: tCall, y: 625, c: C.gold }];
    outs.forEach((o, i) => {
      const u = ease.outCubic(clamp((t - o.t0) / 0.6));
      if (u <= 0) return;
      G.line(ctx, [[680, 500], [680 + 90 * u, 500 + (o.y + 80 - 500) * u]], { color: C.ink, lw: 4, seed: 110 + i });
      withPop(ctx, t, o.t0 + 0.2, 950, o.y + 80, () => {
        box(ctx, 770, o.y, 440, 165, 120 + i);
        label(ctx, o.n.toUpperCase(), 800, o.y + 52, { size: 30, color: o.c === C.gold ? '#B07A12' : o.c });
        for (let j = 0; j < 3; j++) G.line(ctx, [[800, o.y + 85 + j * 26], [800 + (j === 2 ? 190 : 330), o.y + 85 + j * 26]], { color: '#CFC3AC', lw: 5, seed: 130 + i * 3 + j });
      });
    });
    if (t >= tRead) {
      const k = pop(t, tRead);
      ctx.save(); ctx.translate(1290, 560); ctx.scale(k, k);
      UI.pill(ctx, -70, -26, 'fresh eyes', { size: 26, h: 52, bg: C.sky, fg: C.ink, weight: 800 });
      check(ctx, 105, 0, 22, clamp((t - tRead) / 0.4));
      ctx.restore();
    }
    host(ctx, t, gestureAt(t, [[S.S.w2[0], null], [tPerson, 'pointUp'], [tAsk, 'point'], [tThank, 'thumbsUp'], [tLetter, 'point'], [tRead, 'clap']]));
  }

  // ---------- week 3: launch ----------
  function w3(ctx, t) {
    floor(ctx);
    weekBar(ctx, t, 3, 'LAUNCH');
    const L = 3;
    const tMail = cue(L, /^Mail/i), tLands = cue(L, /^lands/i), tGiving = cue(L, /^Giving/i), tEm = cue(L, /^email/i), tCalls = cue(L, /^calls/i), tNotes = cue(L, /^notes/i), tPost = cue(L, /^Post/i), tPhone = cue(L, /^phone/i), tReceipts = cue(L, /^receipts/i);
    // december, with Giving Tuesday circled
    box(ctx, 90, 215, 520, 520, 140);
    G.rrect(ctx, 90, 215, 520, 80, 22, { fill: C.terra, lw: 5, seed: 141 });
    G.text(ctx, 'DECEMBER', 350, 272, { size: 46, align: 'center', fam: 'Bungee', weight: 400, color: '#FFFFFF' });
    'SMTWTFS'.split('').forEach((d, i) => body(ctx, d, 135 + i * 66, 335, { size: 26, color: '#8A7C66', align: 'center' }));
    for (let d = 1; d <= 31; d++) { const idx = d + 1; const cx = 135 + (idx % 7) * 66, cy = 395 + Math.floor(idx / 7) * 62; body(ctx, String(d), cx, cy, { size: 30, align: 'center' }); }
    if (t >= tGiving) {
      const cx = 135 + 2 * 66, cy = 395 - 8 + 0;
      const k = stamp(t, tGiving);
      ctx.save(); ctx.translate(cx, cy + 8); ctx.scale(k, k);
      G.ellipse(ctx, 0, -8, 34, 30, { fill: 'rgba(217,102,59,0.25)', stroke: C.terra, lw: 5, seed: 142 });
      ctx.restore();
      label(ctx, 'GIVING TUESDAY', 350, 770, { size: 36, align: 'center' });
    }
    // the letter flies to the calendar
    const pm = clamp((t - tMail) / Math.max(0.5, tLands - tMail)), ex = 90 + (267 - 90) * ease.inOutCubic(pm), ey = 880 + (390 - 880) * ease.inOutCubic(pm) - Math.sin(Math.PI * pm) * 140;
    if (t >= tMail && t < tLands + 0.6) {
      const a = t < tLands ? 1 : 1 - (t - tLands) / 0.6;
      ctx.save(); ctx.globalAlpha = a; ctx.translate(ex, ey); ctx.rotate(-0.3 * (1 - pm));
      G.rrect(ctx, -40, -28, 80, 56, 6, { fill: '#FFFFFF', lw: 4, seed: 150 }); G.line(ctx, [[-40, -28], [0, 4], [40, -28]], { color: C.ink, lw: 4, seed: 151 });
      ctx.restore();
    }
    // send cards
    const cards = [{ n: 'EMAIL', s: 'first email, same week', t0: tEm, y: 215, c: C.terra }, { n: 'CALLS + NOTES', s: 'top donors, by hand', t0: tCalls, y: 380, c: C.teal }, { n: 'SOCIAL', s: 'your story + the link', t0: tPost, y: 545, c: C.gold }];
    cards.forEach((c, i) => withPop(ctx, t, c.t0, 860, c.y + 70, () => {
      box(ctx, 660, c.y, 400, 140, 160 + i);
      label(ctx, c.n, 690, c.y + 54, { size: 32, color: c.c === C.gold ? '#B07A12' : c.c });
      body(ctx, c.s, 690, c.y + 100, { size: 30 });
      check(ctx, 1020, c.y + 70, 18, clamp((t - c.t0 - 0.4) / 0.3));
    }));
    if (t >= tNotes) { ctx.save(); ctx.globalAlpha = fade(t, tNotes, 0.3); G.line(ctx, [[692, 490], [730, 484], [770, 492], [810, 484], [850, 492], [892, 486]], { color: C.rose, lw: 5, seed: 170 }); ctx.restore(); }
    // the donation page on a phone
    const tTap = tPhone + 0.5;
    UI.phone(ctx, 1235, 520, 560, (c2, w, h, tt) => {
      c2.fillStyle = C.card; c2.fillRect(0, 0, w, h);
      UI.text(c2, 'Give today', w / 2, 150, { size: 38, weight: 800, align: 'center', color: C.ink });
      ['$25', '$50', '$100'].forEach((a, i) => UI.pill(c2, 40 + i * 120, 220, a, { size: 28, h: 64, bg: i === 1 ? C.terra : '#EFE6D2', fg: i === 1 ? '#FFFFFF' : C.ink, weight: 800 }));
      UI.button(c2, w / 2, 430, 320, 84, 'Donate', tt, { tTap, done: tt > tTap + 0.5 ? 'Thank you!' : false, bg: C.terra });
      if (tt > tTap + 0.5) { check(c2, w / 2 - 110, 540, 22, clamp((tt - tTap - 0.5) / 0.4)); UI.text(c2, 'Receipt sent', w / 2 + 10, 548, { size: 30, weight: 800, align: 'center', color: C.ok, alpha: fade(tt, tReceipts, 0.3) }); }
    }, t, { time: '9:41' });
    if (t >= tPhone) { ctx.save(); ctx.globalAlpha = fade(t, tPhone, 0.3); body(ctx, 'works on a phone', 1235, 850, { align: 'center', size: 30, color: C.teal }); ctx.restore(); }
    host(ctx, t, gestureAt(t, [[S.S.w3[0], null], [tMail, 'point'], [tCalls, 'phone'], [tPost, 'point'], [tPhone, 'thumbsUp']]));
  }

  // ---------- week 4: follow up ----------
  function w4(ctx, t) {
    floor(ctx);
    weekBar(ctx, t, 4, 'FOLLOW UP');
    const L = 4;
    const tWon = cue(L, /^won/i), tRemind = cue(L, /^reminder/i), tDiff = cue(L, /^different/i), tThank = cue(L, /^Thank/i), t48 = cue(L, /^48/), tDead = cue(L, /^deadline/i), tTrack = cue(L, /^track/i);
    // two kinds of message
    const env = (x, y, color, seed) => { G.rrect(ctx, x - 55, y - 36, 110, 72, 8, { fill: color, lw: 5, seed }); G.line(ctx, [[x - 55, y - 36], [x, y + 6], [x + 55, y - 36]], { color: C.ink, lw: 5, seed: seed + 1 }); };
    withPop(ctx, t, tRemind, 330, 335, () => { box(ctx, 90, 215, 480, 240, 180); env(210, 330, '#FFFFFF', 181); label(ctx, 'REMINDER', 400, 310, { size: 34, align: 'center' }); body(ctx, "hasn't responded", 400, 365, { size: 30, align: 'center', color: '#7A6F66' }); });
    withPop(ctx, t, tDiff, 850, 335, () => { box(ctx, 610, 215, 480, 240, 185); env(730, 330, C.gold, 186); label(ctx, 'NEW MESSAGE', 920, 310, { size: 34, align: 'center', color: C.teal }); body(ctx, 'has responded', 920, 365, { size: 30, align: 'center', color: '#7A6F66' }); });
    // the 48-hour thank-you
    withPop(ctx, t, tThank, 230, 640, () => {
      box(ctx, 90, 490, 360, 340, 190);
      UI.ring(ctx, 270, 650, 100, clamp((t - t48) / 1.6), { color: C.teal, track: '#E4D6B6', lw: 18 });
      G.text(ctx, '48h', 270, 672, { size: 60, align: 'center', fam: 'Bungee', weight: 400, color: C.ink });
      label(ctx, 'THANK EVERY DONOR', 270, 530, { size: 28, align: 'center', color: C.teal });
    });
    // the year-end deadline
    withPop(ctx, t, tDead, 625, 660, () => {
      box(ctx, 480, 490, 290, 340, 195);
      label(ctx, 'DEADLINE', 625, 535, { size: 30, align: 'center' });
      ['DEC 30', 'DEC 31'].forEach((d, i) => { const flash = 0.5 + 0.5 * Math.sin((t - tDead) * 6 + i * 1.6); UI.pill(ctx, 520, 570 + i * 110, d, { size: 38, h: 80, bg: i ? C.terra : C.rose, fg: '#FFFFFF', weight: 800 }); G.ellipse(ctx, 740, 610 + i * 110, 8, 8, { fill: `rgba(217,102,59,${0.3 + 0.7 * flash})`, lw: 0, seed: 196 + i }); });
    });
    // track results + progress to goal
    withPop(ctx, t, tTrack, 1000, 660, () => {
      box(ctx, 800, 490, 560, 340, 200);
      label(ctx, 'TRACK RESULTS', 830, 535, { size: 28, color: C.teal });
      Data.bars(ctx, { x: 830, y: 565, w: 500, h: 205, data: [{ label: 'gifts', value: 62, color: C.terra }, { label: 'donors', value: 48, color: C.teal }, { label: 'best channel', value: 80, color: C.gold }], t, t0: tTrack + 0.3, stagger: 0.25, labelSize: 24, valueSize: 24 });
    });
    const pg = ease.inOutQuad(clamp((t - tWon) / (S.S.w4[1] - 3 - tWon)));
    box(ctx, 1110, 215, 280, 240, 205);
    label(ctx, 'TO GOAL', 1250, 262, { size: 28, align: 'center', color: C.teal });
    body(ctx, '(example)', 1250, 445, { size: 22, align: 'center', color: '#8A7C66' });
    G.rrect(ctx, 1140, 310, 220, 44, 22, { fill: '#EFE6D2', lw: 4, seed: 206 });
    if (pg > 0.02) G.rrect(ctx, 1140, 310, Math.max(30, 220 * pg), 44, 22, { fill: C.ok, lw: 4, seed: 207 });
    Data.counter(ctx, { x: 1250, y: 420, from: 0, to: 100, t, t0: tWon, t1: S.S.w4[1] - 3, size: 54, color: C.ink, suffix: '%', align: 'center', fam: 'Bungee' });
    host(ctx, t, gestureAt(t, [[S.S.w4[0], null], [tWon, 'pointUp'], [tRemind, 'point'], [tThank, 'thumbsUp'], [tDead, 'point'], [tTrack, 'clap']]));
  }

  // ---------- close ----------
  function close(ctx, t) {
    floor(ctx);
    const L = 5;
    const tPlan = cue(L, /^plan/i), tToday = cue(L, /^Today/i), tDesc = cue(L, /^description/i), tComm = cue(L, /^comments/i), tNP = cue(L, /^Nonprofits/i), tTom = cue(L, /^tomorrow/i);
    const wordmark = fade(t, tNP - 0.1, 0.4);
    ctx.save(); ctx.globalAlpha = 1 - wordmark;
    withPop(ctx, t, S.S.close[0] + 0.2, 520, 400, () => {
      box(ctx, 90, 200, 860, 440, 210);
      label(ctx, 'YOUR 30 DAYS', 130, 262, { size: 40, color: C.teal });
      ['Plan', 'Write', 'Launch', 'Follow up'].forEach((n, i) => {
        const y = 330 + i * 76;
        UI.pill(ctx, 140, y - 30, 'WEEK ' + (i + 1), { size: 24, h: 48, bg: [C.terra, C.teal, C.gold, C.rose][i], fg: i === 2 ? C.ink : '#FFFFFF', weight: 800 });
        body(ctx, n, 320, y + 8, { size: 40 });
        G.rrect(ctx, 780, y - 30, 56, 56, 12, { fill: '#FFFFFF', lw: 4, seed: 215 + i });
        check(ctx, 808, y - 2, 22, clamp((t - tPlan - 0.2 - i * 0.35) / 0.35));
      });
    });
    withPop(ctx, t, tToday, 520, 745, () => {
      box(ctx, 90, 670, 860, 150, 220, C.gold);
      G.text(ctx, 'TODAY: write your goal + your story', 520, 755, { size: 34, align: 'center', fam: 'Bungee', weight: 400, color: C.ink });
      body(ctx, 'one small step', 520, 800, { size: 30, align: 'center', color: '#6B4E10' });
    });
    if (t >= tDesc) { const k = pop(t, tDesc); ctx.save(); ctx.translate(1180, 300); ctx.scale(k, k); UI.pill(ctx, -150, -30, 'checklist: description', { size: 26, h: 60, bg: C.sky, fg: C.ink, weight: 800 }); ctx.restore(); }
    if (t >= tComm) { const k = pop(t, tComm); ctx.save(); ctx.translate(1180, 400); ctx.scale(k, k); UI.pill(ctx, -150, -30, 'comment: how far along?', { size: 26, h: 60, bg: C.rose, fg: '#FFFFFF', weight: 800 }); ctx.restore(); }
    ctx.restore();
    if (wordmark > 0) {
      const k = stamp(t, tNP);
      ctx.save(); ctx.globalAlpha = wordmark; ctx.translate(780, 430); ctx.scale(k, k); ctx.rotate(-0.02);
      G.text(ctx, 'NONPROFITS', 0, -40, { size: 150, align: 'center', fam: 'Bungee', weight: 400, color: C.terra, stroke: C.ink, strokeW: 10 });
      G.text(ctx, 'DAILY', 0, 110, { size: 150, align: 'center', fam: 'Bungee', weight: 400, color: C.teal, stroke: C.ink, strokeW: 10 });
      ctx.restore();
      body(ctx, 'see you tomorrow', 780, 640, { align: 'center', size: 58, alpha: fade(t, tTom - 0.2, 0.4) });
    }
    if (t >= tTom) G.confetti(ctx, t, tTom, { n: 160, seed: 6 });
    host(ctx, t, gestureAt(t, [[S.S.close[0], 'wave'], [tToday, 'point'], [tNP, 'cheer']]));
  }

  const SECTIONS = { title, hook, w1, w2, w3, w4, close };
  Studio.film({
    fadeOut: 1.4,
    async init() { VO = await Studio.loadJSON('out/voice.json'); SUBS = Subs.fromVoice(VO, { maxWords: 6 }); },
    draw(ctx, t) {
      const sec = sectionOf(t);
      G.setStyle('paper');
      const cut = [ev.hook, ev.w1, ev.w2, ev.w3, ev.w4, ev.close].filter((c) => t >= c).pop();
      const shake = cut !== undefined ? 10 * Math.exp(-(t - cut) * 9) : 0;
      ctx.save(); ctx.translate(U.noise1(t * 30, 1) * shake, U.noise1(t * 30, 2) * shake);
      SECTIONS[sec](ctx, t);
      ctx.restore();
      if (cut !== undefined && t - cut < 0.18) { ctx.fillStyle = `rgba(255,255,255,${0.75 * (1 - (t - cut) / 0.18)})`; ctx.fillRect(0, 0, W, H); }
      Subs.draw(ctx, t, SUBS, { style: 'box', size: 44, x: 780, y: 940, maxW: 1400 });
    },
  });
})();
