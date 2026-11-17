import json, sys
import numpy as np

OUT = sys.argv[1]
SR = 44100
tl = json.load(open(f"{OUT}/timeline.json"))
voice = np.frombuffer(open(f"{OUT}/voice.raw", "rb").read(), dtype=np.int16).astype(np.float32) / 32768.0

# words where an insult / punchline lands (lightning + stamp)
MARK = {
    "T1": ["CANDLE?!", "LICENSE?!", "POTATO", "LABORATORY!"],
    "T2": ["THUNDERSTORM!"],
    "T3": ["TRANSMISSION!", "CUSTOMERS!"],
    "T4": ["SOCK!", "INCONVENIENT?!"],
    "T5": ["MORON!", "INVOICE"],
    "T6": ["TICKETS!"],
    "T7": ["CIRCUIT", "ETERNAL!"],
    "T8": ["DISAPPOINTMENT!"],
    "T9": ["EDISON!"],
    "T10": ["THUNDER!", "CURRENT!"],
    "T12": ["CATASTROPHIC,", "VOLTAGE-STARVED,", "MORON!", "SPITE!"],
    "T13": ["GET!", "OUT!", "OF!", "MY!", "LAB!"],
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


C = {c["id"]: c for c in tl["clips"]}
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
tl["lightsOut"] = round(C["T12"]["start"] + C["T12"]["dur"], 3)
tl["freezeAt"] = round(C["T13"]["start"] + C["T13"]["dur"], 3)

rng = np.random.default_rng(11)
n = len(voice)
sfx = np.zeros(n, dtype=np.float32)


def crack(t):
    L = int(0.9 * SR)
    x = np.arange(L) / SR
    noise = rng.standard_normal(L).astype(np.float32)
    hi = noise * np.exp(-x * 45)
    lo = np.convolve(noise, np.ones(200) / 200, mode="same") * np.exp(-x * 6) * 4
    sig = 0.5 * hi + 0.55 * lo
    i = int(t * SR)
    j = min(n, i + L)
    sfx[i:j] += sig[: j - i]


for t in bolts:
    crack(t)


def powerdown(t):
    L = int(1.0 * SR)
    x = np.arange(L) / SR
    f = 900 * np.exp(-x * 4.5) + 40            # falling whine
    ph = 2 * np.pi * np.cumsum(f) / SR
    sig = (np.sin(ph) * np.exp(-x * 3.2) * 0.35).astype(np.float32)
    click = (rng.standard_normal(L) * np.exp(-x * 120) * 0.6).astype(np.float32)
    i = int(t * SR)
    j = min(n, i + L)
    sfx[i:j] += (sig + click)[: j - i]


powerdown(tl["lightsOut"])

mix = np.clip(voice + 0.75 * sfx, -1, 1)
open(f"{OUT}/audio.raw", "wb").write((mix * 32767).astype(np.int16).tobytes())
json.dump(tl, open(f"{OUT}/timeline.json", "w"))
open(f"{OUT}/timeline.js", "w").write("window.TL=" + json.dumps(tl) + ";")
print("bolts", len(bolts), "lightsOut", tl["lightsOut"], "freezeAt", tl["freezeAt"], "total", tl["total"])
