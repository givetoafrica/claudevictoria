import json, sys
import numpy as np

OUT = sys.argv[1]
SR = 44100
tl = json.load(open(f"{OUT}/timeline.json"))
voice = np.frombuffer(open(f"{OUT}/voice.raw", "rb").read(), dtype=np.int16).astype(np.float32) / 32768.0
C = {c["id"]: c for c in tl["clips"]}
n = len(voice)
rng = np.random.default_rng(23)
sfx = np.zeros(n, dtype=np.float32)


def put(sig, t, gain=1.0):
    i = int(t * SR)
    if i < 0 or i >= n:
        return
    j = min(n, i + len(sig))
    sfx[i:j] += gain * sig[: j - i]


def lp(x, k):
    return np.convolve(x, np.ones(k) / k, mode="same")


def env_exp(L, rate):
    return np.exp(-np.arange(L) / SR * rate)


end = lambda cid: C[cid]["start"] + C[cid]["dur"]

# --- crowd ambience: soft filtered noise with slow swells, until the door thud -----------
amb_end = end("L28") + 0.05
L = int(amb_end * SR)
noise = rng.standard_normal(L).astype(np.float32)
murmur = lp(noise, 40) - lp(noise, 400)
swell = 0.6 + 0.4 * np.sin(np.arange(L) / SR * 0.9) * np.sin(np.arange(L) / SR * 0.37 + 1)
put(murmur * swell * 0.9, 0, 0.55)
# luggage belt rumble around the scanner scenes
a, b = C["L3"]["start"], end("L13")
Lr = int((b - a) * SR)
rum = lp(rng.standard_normal(Lr).astype(np.float32), 160) * (0.7 + 0.3 * np.sin(np.arange(Lr) / SR * 7))
put(rum * 1.3, a, 0.25)

# --- security alarm: loud on L1, tucked under the voices after ---------------------------
a_end = end("L3")
t0 = 0.0
while t0 < a_end:
    Lb = int(0.16 * SR)
    x = np.arange(Lb) / SR
    f = 880 if int(t0 / 0.32) % 2 == 0 else 660
    beep = np.sign(np.sin(2 * np.pi * f * x)) * 0.5 + np.sin(2 * np.pi * f * 2 * x) * 0.2
    beep *= np.minimum(1, np.minimum(x / 0.01, (0.16 - x) / 0.02))
    put(beep.astype(np.float32), t0, 0.22 if t0 < end("L1") else 0.07)
    t0 += 0.32

# --- cartoon boing + key clatter when the kite comes out ---------------------------------
tb = end("L6") + 0.08
Lb = int(0.5 * SR)
x = np.arange(Lb) / SR
boing = np.sin(2 * np.pi * np.cumsum(180 + 420 * np.sin(x * 20) * np.exp(-x * 4)) / SR) * np.exp(-x * 5)
put(boing.astype(np.float32), tb, 0.5)
for k, dt in enumerate([0.32, 0.46, 0.58, 0.66, 0.72]):
    Lk = int(0.12 * SR)
    xk = np.arange(Lk) / SR
    tick = np.sin(2 * np.pi * (2400 - k * 250) * xk) * np.exp(-xk * 45)
    put(tick.astype(np.float32), end("L6") + dt, 0.35 * (1 - k * 0.12))

# --- orchestral sting on "INVENTED ELECTRICITY?!" and a bigger one at the smash cut -------
def sting(t, gain, length=1.4):
    Ls = int(length * SR)
    x = np.arange(Ls) / SR
    sig = np.zeros(Ls, dtype=np.float32)
    for f in (130.8, 196.0, 261.6, 311.1, 392.0, 523.3):
        saw = 2 * ((x * f) % 1.0) - 1
        sig += (0.5 * saw + 0.5 * np.sin(2 * np.pi * f * x)).astype(np.float32)
    sig *= np.minimum(1, x / 0.03) * np.exp(-x * 2.2) / 6
    put(sig, t, gain)
    # timpani hit
    xt = x[: int(0.6 * SR)]
    put((np.sin(2 * np.pi * 70 * xt) * np.exp(-xt * 7)).astype(np.float32), t, gain * 1.6)


sting(C["L10"]["start"] - 0.10, 0.7)
sting(end("L30") + 0.03, 1.0, 2.0)

# --- applause that spreads from one passenger ---------------------------------------------
a0 = end("L19") + 0.12
dur = (C["L20"]["start"] - a0) + 2.4
La = int(dur * SR)
claps = np.zeros(La, dtype=np.float32)
rate = 7.5
for i in range(int(dur * rate * 3)):
    tt = rng.random() * dur
    gain = min(1.0, tt / 1.0) * 0.9
    Lc = int(0.03 * SR)
    c = (rng.standard_normal(Lc) * np.exp(-np.arange(Lc) / SR * 160)).astype(np.float32)
    j = int(tt * SR)
    if j + Lc < La:
        claps[j:j + Lc] += c * gain
put(claps, a0, 0.35)

# --- PA chime two-tone, then the announcement ---------------------------------------------
tc = end("L20") + 0.14
for k, f in enumerate((659.3, 523.3)):
    Lc = int(0.5 * SR)
    xc = np.arange(Lc) / SR
    tone = (np.sin(2 * np.pi * f * xc) + 0.3 * np.sin(2 * np.pi * 2 * f * xc)) * np.exp(-xc * 4.5)
    put(tone.astype(np.float32), tc + k * 0.34, 0.35)

# --- door THUD then complete silence -------------------------------------------------------
td = end("L28") + 0.10
Lt = int(0.9 * SR)
xt = np.arange(Lt) / SR
thud = np.sin(2 * np.pi * 55 * xt) * np.exp(-xt * 6) * 1.0 + lp(rng.standard_normal(Lt).astype(np.float32), 30) * np.exp(-xt * 10) * 1.2
put(thud.astype(np.float32), td, 1.0)
glass = (rng.standard_normal(int(0.25 * SR)) * np.exp(-np.arange(int(0.25 * SR)) / SR * 25) * 0.25).astype(np.float32)
put(glass, td, 0.6)
tl["thud"] = round(td, 3)
tl["doorsOpen"] = round(C["L29"]["start"] - 0.35, 3)

mix = np.clip(voice + sfx, -1, 1)
open(f"{OUT}/audio.raw", "wb").write((mix * 32767).astype(np.int16).tobytes())
json.dump(tl, open(f"{OUT}/timeline.json", "w"))
open(f"{OUT}/timeline.js", "w").write("window.TL=" + json.dumps(tl) + ";")
print("thud", tl["thud"], "total", tl["total"])
