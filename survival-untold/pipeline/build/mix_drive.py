import json, sys
import numpy as np
OUT = sys.argv[1]
SR = 44100
tl = json.load(open(f"{OUT}/timeline.json"))
voice = np.frombuffer(open(f"{OUT}/voice.raw", "rb").read(), dtype=np.int16).astype(np.float32) / 32768.0
C = {c["id"]: c for c in tl["clips"]}
n = len(voice)
rng = np.random.default_rng(7)
sfx = np.zeros(n, dtype=np.float32)
def put(sig, t, gain=1.0):
    i = int(t * SR)
    if i < 0 or i >= n: return
    j = min(n, i + len(sig)); sfx[i:j] += gain * sig[: j - i]
def lp(x, k): return np.convolve(x, np.ones(k) / k, mode="same")
end = lambda cid: C[cid]["start"] + C[cid]["dur"]
zoomT = C["D19"]["start"] + C["D19"]["dur"] * 0.70
# quiet engine hum until he floors it (very soft, no crowd noise)
L = int((zoomT + 0.05) * SR); x = np.arange(L) / SR
hum = (np.sin(2*np.pi*58*x) + 0.5*np.sin(2*np.pi*116*x + 1) + 0.25*np.sin(2*np.pi*174*x)) * (0.7 + 0.3*np.sin(2*np.pi*3.2*x))
wind = lp(rng.standard_normal(L).astype(np.float32), 30) - lp(rng.standard_normal(L).astype(np.float32), 300)
put((hum * 0.05 + wind * 0.05).astype(np.float32), 0, 1.0)
# sting on INVENTED ELECTRICITY?!
def sting(t, gain, length=1.2):
    Ls = int(length * SR); x = np.arange(Ls) / SR; sig = np.zeros(Ls, dtype=np.float32)
    for f in (130.8, 196.0, 261.6, 311.1, 392.0):
        saw = 2 * ((x * f) % 1.0) - 1
        sig += (0.5 * saw + 0.5 * np.sin(2 * np.pi * f * x)).astype(np.float32)
    sig *= np.minimum(1, x / 0.03) * np.exp(-x * 2.4) / 5
    put(sig, t, gain)
    xt = x[: int(0.5 * SR)]; put((np.sin(2 * np.pi * 70 * xt) * np.exp(-xt * 7)).astype(np.float32), t, gain * 1.2)
sting(C["D10"]["start"] - 0.10, 0.45)
# polite horn honk after "missed your exit"
th = end("D16") + 0.05
Lh = int(0.28 * SR); xh = np.arange(Lh) / SR
horn = (np.sign(np.sin(2*np.pi*392*xh)) * 0.4 + np.sign(np.sin(2*np.pi*494*xh)) * 0.4) * np.minimum(1, np.minimum(xh/0.01, (0.28-xh)/0.03))
put(horn.astype(np.float32), th, 0.12)
# the zoom: tyre squeal, engine rev, whoosh, doppler fade
Lz = int(3.0 * SR); xz = np.arange(Lz) / SR
sq = lp(rng.standard_normal(Lz).astype(np.float32), 6) - lp(rng.standard_normal(Lz).astype(np.float32), 40)
put((sq * np.exp(-xz * 3.0) * (xz < 0.9)).astype(np.float32), zoomT, 0.5)
f = 70 + 520 * (1 - np.exp(-xz * 1.6))
rev = (np.sin(2*np.pi*np.cumsum(f)/SR) * 0.6 + np.sin(2*np.pi*np.cumsum(f*2)/SR) * 0.3) * np.exp(-xz * 0.9)
put(rev.astype(np.float32), zoomT + 0.05, 0.18)
who = (lp(rng.standard_normal(Lz).astype(np.float32), 50) * np.sin(np.pi * np.clip(xz / 1.6, 0, 1)) * (xz < 1.6))
put(who.astype(np.float32), zoomT + 0.15, 0.7)
tl["zoom"] = round(zoomT, 3)
mix = np.clip(voice + sfx, -1, 1)
open(f"{OUT}/audio.raw", "wb").write((mix * 32767).astype(np.int16).tobytes())
json.dump(tl, open(f"{OUT}/timeline.json", "w"))
open(f"{OUT}/timeline.js", "w").write("window.TL=" + json.dumps(tl) + ";")
print("zoom", tl["zoom"], "total", tl["total"])
