// THE SONG: every sound comes from an event in score.js.   node song.js   (STEMS=1 writes stems, LUFS=-14 sets loudness)
// A warm lo-fi bed under real recorded narration, a rising marimba chime for each week, and an afrobeats lift for the close.
// The narration is mixed in from assets/narration/*.mp3; its word times and mouth track go to out/voice.json.
const fs = require('fs');
const path = require('path');
const { SR, Bus, reverb, OnePole } = require('./engine/audio/dsp');
const I = require('./engine/audio/instruments');
const MIX = require('./engine/audio/mix');
const Genre = require('./engine/audio/genres');
const Voice = require('./engine/audio/voice');
const sc = require('./score');
const { T, BEAT, DURATION, m, ev, clock, chordAt } = sc;

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
const lines = sc.NARR.map((l) => {
  const audio = trim(Voice.decode(path.join(__dirname, l.file)));
  const words = Voice.fit(audio, wordsOf(l.text), null).map((w) => ({ w: w.w, t: +(l.at + w.t).toFixed(3), end: +(l.at + w.end).toFixed(3) }));
  let s = 0, c = 0; for (let i = 0; i < audio.length; i++) if (Math.abs(audio[i]) > 0.01) { s += audio[i] * audio[i]; c++; }
  const g = c ? Math.min(6, 0.12 / Math.sqrt(s / c)) : 1;
  const x = new Float32Array(audio.length);
  for (let i = 0; i < x.length; i++) x[i] = hp.hp(audio[i] * g, 90);
  vbus.addMono(x, l.at, 1, 0);
  return { t: +l.at.toFixed(3), end: +(l.at + audio.length / SR).toFixed(3), text: l.text, who: 'narrator', words };
});
const vo = { engine: 'elevenlabs', lines, mouth: Voice.mouthTrack(vbus, sc.FPS) };
fs.mkdirSync(path.join(__dirname, 'out'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'out', 'voice.json'), JSON.stringify(vo));

// ---------- the music ----------
// title: a music box plays the hook, the title stamps
[['E5', 0.5], ['G5', 1], ['C6', 1.5], ['B5', 2], ['G5', 2.5], ['E5', 3]].forEach(([n, b]) => { const x = I.musicBox(m(n)); lead.addMono(x, T(0, b), 0.22, 0.2); verb.addMono(x, T(0, b), 0.2); });
fx.addMono(I.thud(80, 0.12), ev.title, 0.5);
fx.addMono(I.woodTick(0.8), ev.title, 0.3);
Genre.play('lofi', { clock, from: 0, to: 1, chordAt, buses, drums: false, bassline: false, gain: 0.7 });
// a warm lo-fi bed for the hook and the four weeks (quiet: it is a bed under speech)
Genre.play('lofi', { clock, from: 1, to: 51, chordAt, buses, gain: 0.6 });
// the lift for the close
Genre.play('afrobeats', { clock, from: 51, to: 58, chordAt, buses, gain: 0.75 });

// every scene entrance: a paper whoosh into the cut, a wood tick on it; the weeks add a rising marimba chime
for (const k of ['hook', 'w1', 'w2', 'w3', 'w4', 'close']) {
  fx.addMono(I.paperFwip(1.2), ev[k] - 0.18, 0.18);
  fx.addMono(I.woodTick(0.9), ev[k], 0.35);
  fx.addMono(I.thud(90, 0.1), ev[k], 0.4);
  if (sc.chime[k]) {
    const root = m(sc.chime[k]);
    [0, 4, 7, 12].forEach((iv, i) => { const x = I.marimba(root + iv); lead.addMono(x, ev[k] + i * BEAT * 0.5, 0.3, (i % 2 ? 0.25 : -0.25)); verb.addMono(x, ev[k] + i * BEAT * 0.5, 0.15); });
  }
}
// the close: a crash and a bright shimmer on "tomorrow", then a held chord
fx.addMono(I.crash(3), ev.close, 0.3);
for (const n of [m('C4'), m('E4'), m('G4'), m('C5')]) { const { L, R } = I.padNote(n, 3.2, { attack: 0.05, release: 1.6 }); lead.addStereo(L, R, T(58), 0.1); }
const tomorrow = lines[5].words.filter((w) => /tomorrow/i.test(w.w)).pop();
if (tomorrow) for (const n of ['C6', 'E6', 'G6', 'C7']) { const x = I.bell(m(n), 1.6, 3, 3.5); lead.addMono(x, tomorrow.end + 0.05, 0.12, 0); }

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
console.log(`out/music.wav  ${DURATION.toFixed(1)}s  ${res.lufs.toFixed(1)} LUFS  voice: ${vo.engine}`);
