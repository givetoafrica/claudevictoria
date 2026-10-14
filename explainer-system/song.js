// THE SONG: narration + a soft music bed + sound on every cut and every reveal.   node song.js   (STEMS=1, LUFS=-14)
// The narration clips come from videos/<name>/narration; their word times and mouth track go to out/voice.json.
const fs = require('fs');
const path = require('path');
const { SR, Bus, reverb, OnePole } = require('./engine/audio/dsp');
const I = require('./engine/audio/instruments');
const MIX = require('./engine/audio/mix');
const Genre = require('./engine/audio/genres');
const Voice = require('./engine/audio/voice');
const THEMES = require('./themes');
const sc = require('./score');
const { T, BEAT, DURATION, m, clock, scenes } = sc;
const theme = THEMES[sc.A.script.theme || 'fun'];

const N = Math.ceil(DURATION * SR);
const bus = () => new Bus(N);
const buses = { drums: bus(), bass: bus(), pad: bus(), keys: bus() };
const lead = bus(), fx = bus(), verb = bus();

// ---------- the narration: decode, trim, level, time the words, track the mouth ----------
const wordsOf = (s) => s.replace(/\s+/g, ' ').trim().split(' ').filter((w) => /[\p{L}\p{N}]/u.test(w));
function trim(x) {
  const hop = SR / 100, n = Math.floor(x.length / hop), e = new Float32Array(n);
  for (let i = 0; i < n; i++) { let s = 0; for (let j = 0; j < hop; j++) { const v = x[i * hop + j]; s += v * v; } e[i] = Math.sqrt(s / hop); }
  const pk = e.reduce((a, v) => Math.max(a, v), 0);
  let a = 0, b = n;
  while (a < b && e[a] < pk * 0.02) a++;
  while (b > a && e[b - 1] < pk * 0.02) b--;
  return x.slice(Math.max(0, (a - 3) * hop), Math.min(x.length, (b + 3) * hop));
}
const vbus = new Bus(N);
const hp = new OnePole();
const lines = [];
for (const s of scenes) {
  for (const c of s.clips) {
    const f = path.join(__dirname, c.file);
    if (!fs.existsSync(f)) { console.warn(`missing narration: ${c.file}`); continue; }
    const audio = trim(Voice.decode(f));
    const words = Voice.fit(audio, wordsOf(c.text), null).map((w) => ({ w: w.w, t: +(c.at + w.t).toFixed(3), end: +(c.at + w.end).toFixed(3) }));
    let sum = 0, cnt = 0; for (let i = 0; i < audio.length; i++) if (Math.abs(audio[i]) > 0.01) { sum += audio[i] * audio[i]; cnt++; }
    const g = cnt ? Math.min(6, 0.12 / Math.sqrt(sum / cnt)) : 1;
    const x = new Float32Array(audio.length);
    for (let i = 0; i < x.length; i++) x[i] = hp.hp(audio[i] * g, 90);
    vbus.addMono(x, c.at, 1, 0);
    lines.push({ t: +c.at.toFixed(3), end: +(c.at + audio.length / SR).toFixed(3), text: c.text, who: 'narrator', scene: s.id, words });
  }
}
const vo = { engine: 'elevenlabs', lines, mouth: Voice.mouthTrack(vbus, sc.FPS) };
fs.mkdirSync(path.join(__dirname, 'out'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'out', 'voice.json'), JSON.stringify(vo));

// ---------- the music: a quiet bed, with a rising chime at every scene change ----------
// chords: a four-chord loop across the whole film (the engine's own chord builder, so notes are MIDI numbers)
const { makeChords } = require('./engine/music');
const bars = Math.ceil(DURATION / (BEAT * 4)) + 1;
const loop = ['C', 'G', 'Am', 'F'];
const { chordAt } = makeChords(clock, {
  C: { notes: ['E3', 'G3', 'C4'], bass: 'C2' }, G: { notes: ['D3', 'G3', 'B3'], bass: 'G1' }, Am: { notes: ['E3', 'A3', 'C4'], bass: 'A1' }, F: { notes: ['F3', 'A3', 'C4'], bass: 'F1' },
}, Array.from({ length: bars }, (_, b) => [b, 0, 4, loop[b % 4]]));
Genre.play(theme.music.genre, { clock, from: 0, to: bars, chordAt, buses, gain: theme.music.gain });

const pent = ['C5', 'D5', 'E5', 'G5', 'A5', 'C6'];
scenes.forEach((s, i) => {
  fx.addMono(I.paperFwip(1.2), s.t0 - 0.18, 0.16);
  fx.addMono(I.woodTick(0.9), s.t0, 0.32);
  fx.addMono(I.thud(90, 0.1), s.t0, 0.38);
  const root = m(pent[i % pent.length]);
  [0, 4, 7, 12].forEach((iv, k) => { const x = I.marimba(root + iv); lead.addMono(x, s.t0 + k * BEAT * 0.5, 0.26, k % 2 ? 0.25 : -0.25); verb.addMono(x, s.t0 + k * BEAT * 0.5, 0.14); });
  // a soft pop on every reveal, rising a little as the scene builds
  const specs = sc.reveals(s);
  if (specs.length) {
    const ts = sc.cueTimes(lines, s, specs);
    ts.forEach((t, k) => { if (t > s.t0) fx.addMono(I.pop(1500 + k * 90), t, 0.16, (k % 2 ? 0.2 : -0.2)); });
  }
});
// the close: a held chord
const lastT = scenes[scenes.length - 1].t0;
for (const n of [m('C4'), m('E4'), m('G4'), m('C5')]) { const { L, R } = I.padNote(n, 4, { attack: 0.05, release: 2 }); lead.addStereo(L, R, DURATION - 4.2, 0.08); }

// the music ducks under the voice
const music = [buses.drums, buses.bass, buses.pad, buses.keys, lead];
MIX.duck(music, vbus, { depth: 0.6 });
const room = reverb(verb, { room: 0.7, damp: 0.4 });
const stems = { ...buses, lead, fx, voice: vbus, verb: room };
const GAIN = { drums: 0.9, bass: 0.8, pad: 1, keys: 1, lead: 1, fx: 1, voice: 1.25, verb: 0.4 };
const mix = MIX.mixdown(stems, GAIN, { stemDir: process.env.STEMS ? path.join(__dirname, 'out') : null });
MIX.highpass(mix, 28);
MIX.fadeOut(mix, DURATION - 1.5, DURATION);
const res = MIX.master(mix, 0.8, undefined, { lufs: process.env.LUFS ? +process.env.LUFS : -14 });
MIX.writeWav(path.join(__dirname, 'out', 'music.wav'), mix);
console.log(`out/music.wav  ${DURATION.toFixed(1)}s  ${res.lufs.toFixed(1)} LUFS  voice: ${vo.engine}  lines: ${lines.length}`);
