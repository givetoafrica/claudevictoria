import json, sys
import numpy as np
OUT = sys.argv[1]
SR = 44100
tl = json.load(open(f"{OUT}/timeline.json"))
voice = np.frombuffer(open(f"{OUT}/voice.raw", "rb").read(), dtype=np.int16).astype(np.float32) / 32768.0
C = {c["id"]: c for c in tl["clips"]}
n = len(voice)
rng = np.random.default_rng(11)
sfx = np.zeros(n, dtype=np.float32)
def put(sig, t, gain=1.0):
    i = int(t * SR)
    if i < 0 or i >= n: return
    j = min(n, i + len(sig)); sfx[i:j] += gain * sig[: j - i]
def lp(x, k): return np.convolve(x, np.ones(k) / k, mode="same")
end = lambda cid: C[cid]["start"] + C[cid]["dur"]
fa, fb = end("W11") + 0.05, C["W12"]["start"] - 0.02          # the freeze: dead silence
# soft jet-cabin drone with a slow swell; it drops out completely during the freeze
x = np.arange(n) / SR
drone = lp(rng.standard_normal(n).astype(np.float32), 90) * (0.8 + 0.2 * np.sin(2 * np.pi * 0.23 * x))
drone += 0.35 * np.sin(2 * np.pi * 96 * x) * 0.2
env = np.ones(n, dtype=np.float32)
env[int(fa * SR):int(fb * SR)] = 0.0
sfx += drone.astype(np.float32) * env * 0.11
# cabin chime at the very start
for k, f in enumerate((880.0, 1175.0)):
    L = int(0.45 * SR); xc = np.arange(L) / SR
    put((np.sin(2 * np.pi * f * xc) * np.exp(-xc * 6)).astype(np.float32), 0.02 + k * 0.28, 0.12)
# air vents hiss under the opening yelling
Lh = int(3.0 * SR); hiss = lp(rng.standard_normal(Lh).astype(np.float32), 3) - lp(rng.standard_normal(Lh).astype(np.float32), 12)
put((hiss * np.minimum(1, np.arange(Lh) / (0.4 * SR))).astype(np.float32), 0.0, 0.05)
# sting hit on AUTO-WHAT?! (after the silence)
t0 = C["W12"]["start"] - 0.06; Ls = int(1.0 * SR); xs = np.arange(Ls) / SR
sig = (np.sin(2 * np.pi * 65 * xs) * np.exp(-xs * 8) * 1.1 + lp(rng.standard_normal(Ls).astype(np.float32), 20) * np.exp(-xs * 12) * 0.8).astype(np.float32)
put(sig, t0, 0.55)
# muffled bickering under the final pull-back (indistinct, from slices of the brothers' own takes)
tb = end("W16") + 0.25
for src, off, gain in (("W9", 0.00, 0.5), ("W5", 0.55, 0.45), ("W3", 1.0, 0.45), ("W13", 1.7, 0.4)):
    c = C[src]; a = int(c["start"] * SR); b = int(end(src) * SR)
    seg = lp(voice[a:b].copy(), 14) * 1.5
    put(seg, tb + off, gain)
mix = np.clip(voice + sfx, -1, 1)
open(f"{OUT}/audio.raw", "wb").write((mix * 32767).astype(np.int16).tobytes())
tl["freeze"] = [round(fa, 3), round(fb, 3)]
json.dump(tl, open(f"{OUT}/timeline.json", "w"))
open(f"{OUT}/timeline.js", "w").write("window.TL=" + json.dumps(tl) + ";")
print("freeze", tl["freeze"], "total", tl["total"])
