import json, re, sys
import numpy as np

OUT = sys.argv[1]
SR = 44100
tl = json.load(open(f"{OUT}/timeline.json"))
voice = np.frombuffer(open(f"{OUT}/voice.raw", "rb").read(), dtype=np.int16).astype(np.float32) / 32768.0

# words in each Edison clip whose delivery is an insult landing on Scout
MARK = {
    "E1": ["MORON!", "outage!", "cord", "darkness?!"],
    "E2": ["disappointment!", "OVERTIME!"],
    "E4": ["WATERFOWL?!"],
    "E5": ["waffle!"],
    "E6": ["toaster!"],
    "E7": ["lamp!"],
    "E10": ["potato!"],
    "E11": ["CATASTROPHIC,", "MORON!"],
}


def word_times(c):
    words = c["text"].split()
    w = [len(x) + 2 for x in words]
    tot = sum(w)
    acc = 0
    out = []
    for word, ww in zip(words, w):
        out.append((word, c["start"] + c["dur"] * acc / tot))
        acc += ww
    return out


bolts = []
for c in tl["clips"]:
    if c["id"] in MARK:
        wt = word_times(c)
        for m in MARK[c["id"]]:
            for word, t in wt:
                if word == m:
                    bolts.append(round(t, 3))
                    break
tl["bolts"] = bolts

# bulb dies right after E9 ends
e9 = next(c for c in tl["clips"] if c["id"] == "E9")
tl["bulbDies"] = round(e9["start"] + e9["dur"], 3)
s10 = next(c for c in tl["clips"] if c["id"] == "S10")
e11 = next(c for c in tl["clips"] if c["id"] == "E11")
tl["freezeAt"] = round(e11["start"] + e11["dur"], 3)

rng = np.random.default_rng(7)
n = len(voice)
sfx = np.zeros(n, dtype=np.float32)


def crack(t):
    L = int(0.9 * SR)
    x = np.arange(L) / SR
    noise = rng.standard_normal(L).astype(np.float32)
    # crack: bright noise, very fast decay
    hi = noise * np.exp(-x * 45)
    # rumble: low-passed noise, slower decay
    k = np.ones(200) / 200
    lo = np.convolve(noise, k, mode="same") * np.exp(-x * 6) * 4
    sig = 0.5 * hi + 0.55 * lo
    i = int(t * SR)
    j = min(n, i + L)
    sfx[i:j] += sig[: j - i]


for t in bolts:
    crack(t)

# bulb pop + dim "tink" when the light dies
def pop(t):
    L = int(0.25 * SR)
    x = np.arange(L) / SR
    sig = (rng.standard_normal(L) * np.exp(-x * 60) * 0.5 + np.sin(2 * np.pi * 1800 * x) * np.exp(-x * 40) * 0.25).astype(np.float32)
    i = int(t * SR)
    sfx[i:i + L] += sig[: n - i][:L]

pop(tl["bulbDies"])

mix = np.clip(voice + 0.75 * sfx, -1, 1)
open(f"{OUT}/audio.raw", "wb").write((mix * 32767).astype(np.int16).tobytes())
json.dump(tl, open(f"{OUT}/timeline.json", "w"))
open(f"{OUT}/timeline.js", "w").write("window.TL=" + json.dumps(tl) + ";")
print("bolts", bolts, "bulbDies", tl["bulbDies"], "freezeAt", tl["freezeAt"], "total", tl["total"])
