<!doctype html>
<html><head><meta charset="utf-8">
<style>
html,body{margin:0;background:#000;overflow:hidden}
#stage{width:1080px;height:1920px;display:block}
text{font-family:'Inter Display','Inter','DejaVu Sans',sans-serif;font-weight:900}
</style>
<script src="timeline.js"></script>
</head><body>
<svg id="stage" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920"></svg>
<script>
const TL = window.TL, FPS = TL.fps;
const C = {}; TL.clips.forEach(c => { c.end = c.start + c.dur; C[c.id] = c; });
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const ease = k => k * k * (3 - 2 * k);
const seg = (t, a, b) => ease(clamp((t - a) / (b - a)));
const f2 = x => x.toFixed(2);

// ---- audio-driven mouth openness -------------------------------------------------
function openness(spk, t) {
  for (const c of TL.clips) {
    if (c.spk === spk && t >= c.start && t < c.end) {
      const i = Math.floor((t - c.start) * FPS);
      const a = c.env[i] || 0, b = c.env[i - 1] || 0, d = c.env[i + 1] || 0;
      return clamp(Math.pow((a * 2 + b + d) / 4, 0.7) * 1.35);
    }
  }
  return 0;
}
const speaking = spk => TL.clips.some(c => c.spk === spk && cur >= c.start && cur < c.end);
let cur = 0;

// ---- lightning --------------------------------------------------------------------
function boltAge(t) { // seconds since the latest bolt, or large
  let age = 99;
  for (const b of TL.bolts) if (t >= b && t - b < age) age = t - b;
  return age;
}
function boltPath(seed) {
  let x = 640 + ((seed * 97) % 200) - 100, y = 0, d = `M${x} ${y}`;
  const tx = 330, ty = 1450;
  for (let i = 1; i <= 9; i++) {
    const k = i / 9;
    x = lerp(x, tx, 0.28) + (((seed * 31 + i * 57) % 90) - 45);
    y = lerp(0, ty, k);
    d += ` L${x.toFixed(0)} ${y.toFixed(0)}`;
  }
  return d;
}

