import json, sys
import numpy as np
OUT = sys.argv[1]
SR = 44100
tl = json.load(open(f"{OUT}/timeline.json"))
voice = np.frombuffer(open(f"{OUT}/voice.raw", "rb").read(), dtype=np.int16).astype(np.float32) / 32768.0
C = {c["id"]: c for c in tl["clips"]}
n = len(voice)
rng = np.random.default_rng(5)
sfx = np.zeros(n, dtype=np.float32)
def put(sig, t, gain=1.0):
    i = int(t * SR)
    if i < 0 or i >= n: return
    j = min(n, i + len(sig)); sfx[i:j] += gain * sig[: j - i]
def lp(x, k): return np.convolve(x, np.ones(k) / k, mode="same")
end = lambda cid: C[cid]["start"] + C[cid]["dur"]
tbtn = end("m16") + 0.28                       # the robot presses the button
tdesc = C["m17"]["start"]                      # the table starts to descend
tblack = end("m17") + 0.3                      # cut to black
x = np.arange(n) / SR
# soft factory drone + distant machinery thumps; everything stops at the cut to black
hum = lp(rng.standard_normal(n).astype(np.float32), 120) * 1.0 + 0.3 * np.sin(2 * np.pi * 52 * x) * 0.2
env = np.ones(n, dtype=np.float32); env[int(tblack * SR):] = 0
thump = np.zeros(n, dtype=np.float32)
for tt in np.arange(0.3, tblack, 0.62):
    L = int(0.12 * SR); xt = np.arange(L) / SR
    put((np.sin(2 * np.pi * 70 * xt) * np.exp(-xt * 35)).astype(np.float32), tt, 0.05)
sfx += hum.astype(np.float32) * env * 0.075
# robot speech gets a tiny servo blip at the start of each robot line
for cid in ("r2", "r8", "r12", "r14"):
    for k, f in enumerate((1320.0, 1760.0)):
        L = int(0.06 * SR); xc = np.arange(L) / SR
        put((np.sin(2 * np.pi * f * xc) * np.minimum(1, (0.06 - xc) / 0.02)).astype(np.float32), C[cid]["start"] - 0.12 + k * 0.07, 0.05)
# sting on 'You have been replaced'
def sting(t, gain, length=1.0):
    Ls = int(length * SR); xs = np.arange(Ls) / SR; sig = np.zeros(Ls, dtype=np.float32)
    for f in (110.0, 164.8, 220.0, 261.6):
        saw = 2 * ((xs * f) % 1.0) - 1; sig += (0.5 * saw + 0.5 * np.sin(2 * np.pi * f * xs)).astype(np.float32)
    sig *= np.minimum(1, xs / 0.03) * np.exp(-xs * 3.0) / 4; put(sig, t, gain)
sting(C["r14"]["start"] + 0.02, 0.35)
# button click + trapdoor clunk, then a long descending mechanical whine under his scream
Lb = int(0.12 * SR); xb = np.arange(Lb) / SR
put((np.sin(2 * np.pi * 1800 * xb) * np.exp(-xb * 60)).astype(np.float32), tbtn, 0.4)
Lc = int(0.5 * SR); xc = np.arange(Lc) / SR
put((np.sin(2 * np.pi * 60 * xc) * np.exp(-xc * 9) + lp(rng.standard_normal(Lc).astype(np.float32), 30) * np.exp(-xc * 14) * 0.9).astype(np.float32), tbtn + 0.45, 0.55)
Ld = int((tblack - tdesc + 0.2) * SR); xd = np.arange(Ld) / SR
f = 420 * np.exp(-xd * 0.35)
put((np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.3).astype(np.float32), tdesc, 0.08)
tl["button"] = round(tbtn, 3); tl["descend"] = round(tdesc, 3); tl["black"] = round(tblack, 3)
mix = np.clip(voice + sfx, -1, 1)
open(f"{OUT}/audio.raw", "wb").write((mix * 32767).astype(np.int16).tobytes())
json.dump(tl, open(f"{OUT}/timeline.json", "w"))
open(f"{OUT}/timeline.js", "w").write("window.TL=" + json.dumps(tl) + ";")
print("button", tl["button"], "descend", tl["descend"], "black", tl["black"], "total", tl["total"])
