// SCORE: the one timeline both the music and the picture read. Built from active.js (prep.js writes it).
// Also holds the cue helpers: a script says WHEN something appears by quoting the narrator ("at": "gross receipts"),
// and cueTimes() finds that moment in the real narration. No hand timing, so it re-times itself when narration changes.
(function () {
  const node = typeof require !== 'undefined';
  const U = node ? require('./engine/util') : globalThis.U;
  const MU = node ? require('./engine/music') : globalThis.MUSIC;
  const A = node ? require('./active') : globalThis.ACTIVE;
  const { m, makeClock } = MU;

  const FPS = 30;
  const FORMAT = (A.script.format) || '16:9';
  const [W, H] = U.formatSize(FORMAT);
  const SAFE = U.safeArea(W, H);
  const clock = makeClock({ bpm: A.timeline.bpm, offset: 0 });
  const { T, BEAT } = clock;
  const DURATION = A.timeline.duration;
  const scenes = A.timeline.scenes.map((s, i) => ({ ...s, ...A.script.scenes[i], t0: s.t0, t1: s.t1, clips: s.clips, idx: i }));
  const S = {}; scenes.forEach((s) => { S[s.id] = [s.t0, s.t1]; });
  const markers = {}; scenes.forEach((s, i) => { if (i > 0) markers[s.id] = { t: s.t0, sync: 'v' }; });

  // ---- cues ----
  const norm = (w) => String(w).toLowerCase().replace(/[^a-z0-9]/g, '');
  // the narrator's words for one scene, from voice.json lines
  function sceneWords(lines, scene) {
    const out = [];
    for (const l of lines) if (scene.clips.some((c) => Math.abs(c.at - l.t) < 0.05)) for (const w of l.words) out.push({ n: norm(w.w), t: w.t, end: w.end });
    return out.filter((w) => w.n);
  }
  // "gross receipts" -> the time the narrator starts saying it; "receipts#2" -> its second occurrence
  function findPhrase(words, spec) {
    if (!spec || typeof spec !== 'string') return null;
    const mm = /^(.*?)(?:#(\d+))?$/.exec(spec.trim());
    const toks = mm[1].split(/\s+/).map(norm).filter(Boolean);
    let nth = mm[2] ? +mm[2] - 1 : 0;
    if (!toks.length) return null;
    for (let i = 0; i + toks.length <= words.length; i++) {
      if (toks.every((tk, j) => words[i + j].n === tk)) { if (nth === 0) return words[i].t; nth--; }
    }
    return null;
  }
  // times for a list of cue specs: quoted ones are found; the rest are spread evenly between their found neighbours
  function cueTimes(lines, scene, specs) {
    const words = sceneWords(lines, scene);
    const a = (words[0] ? words[0].t : scene.t0 + 0.5), b = words.length ? words[words.length - 1].end : scene.t1 - 1;
    const t = specs.map((s) => findPhrase(words, s));
    for (let i = 0; i < t.length; i++) {
      if (t[i] != null) continue;
      let lo = i - 1; while (lo >= 0 && t[lo] == null) lo--;
      let hi = i + 1; while (hi < t.length && t[hi] == null) hi++;
      const t0 = lo >= 0 ? t[lo] : a, t1 = hi < t.length ? t[hi] : Math.max(a + 1, b - 0.8);
      const n = (hi < t.length ? hi : t.length) - lo; // slots between the two anchors
      t[i] = t0 + ((t1 - t0) * (i - lo)) / n;
    }
    return t;
  }
  // the reveal order of each scene type: the specs a scene's film and its sound effects both use
  function reveals(sc) {
    const at = (x) => (x && x.at) || undefined;
    switch (sc.type) {
      case 'kinetic': return [...(sc.lines || []).map(at), at(sc.lower)];
      case 'stat': return [at(sc.big), at(sc.label), at(sc.sub), at(sc.stamp)];
      case 'mythfact': return [sc.mythAt, sc.strikeAt, sc.factAt, sc.noteAt];
      case 'steps': return [...(sc.items || []).map(at), sc.footAt, sc.ownersAt];
      case 'flow': return [...(sc.rows || []).map(at), sc.noteAt];
      case 'compare': return [sc.leftAt, sc.rightAt, sc.quoteAt];
      case 'alert': return [sc.stampAt, ...(sc.items || []).map(at)];
      case 'quiz': return [sc.answerAt, ...(sc.answer || []).map(at)];
      case 'recap': return [...(sc.points || []).map(at), sc.teaserAt, sc.closerAt];
      case 'headlines': return (sc.items || []).map(at);
      case 'story': return [sc.headlineAt, ...(sc.facts || []).map(at), sc.statAt, sc.whyAt];
      case 'take': return [sc.labelAt, sc.quoteAt, ...(sc.actions || []).map(at)];
      default: return [];
    }
  }

  const SCORE = { FPS, FORMAT, W, H, SAFE, DURATION, clock, T, BEAT, S, m, scenes, markers, A, cueTimes, reveals, sceneWords, findPhrase };
  if (node) module.exports = SCORE; else globalThis.SCORE = SCORE;
})();
