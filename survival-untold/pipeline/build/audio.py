import json, subprocess, sys
import numpy as np

A = sys.argv[1]      # directory with the line mp3s
OUT = sys.argv[2]    # output directory
SR = 44100
TEMPO = 1.10
FPS = 30

# (id, speaker, caption text, gap after in seconds)
SEQ = [
    ("S1", "S", "Mr. Edison, did you invent the light bulb?", 0.10),
    ("E1", "E", "Did I invent the light bulb. DID I INVENT THE LIGHT BULB?! You magnificent MORON! You walking power outage! You human-shaped extension cord with no electricity! Who do you think dragged humanity out of the darkness?!", 0.10),
    ("S2", "S", "The sun?", 0.08),
    ("E2", "E", "The SUN?! The SUN?! You solar-powered disappointment! The sun clocks out every evening! I gave humanity OVERTIME!", 0.10),
    ("S3", "S", "Joseph Swan made a working light bulb before you. British inventor. He demonstrated an incandescent lamp before yours.", 0.10),
    ("E3", "E", "Who the electric fried chicken is Joseph Swan?!", 0.06),
    ("E4", "E", "A SWAN?! A British SWAN?! So now we are giving patents to WATERFOWL?! What's next, a pigeon invented the telephone?!", 0.10),
    ("S4", "S", "You also had a team helping you.", 0.06),
    ("E5", "E", "Of COURSE I had a team, you undercooked waffle! Do you think I was in here alone, chewing bamboo and wrestling electrons?!", 0.08),
    ("S5", "S", "So they helped invent it?", 0.06),
    ("E6", "E", "They helped me help myself help humanity. That is called LEADERSHIP, you unplugged toaster!", 0.10),
    ("S6", "S", "Didn't you eventually go into business with Swan's company?", 0.08),
    ("E7", "E", "That was a BUSINESS decision, you confused desk lamp! Not an admission of anything!", 0.10),
    ("S7", "S", "So Swan came first?", 0.08),
    ("E8", "E", "First does not mean best. The first pancake is always a disaster.", 0.10),
    ("S8", "S", "That's actually a good point.", 0.06),
    ("E9", "E", "Don't agree with me! I'm still insulting you!", 0.95),   # bulb goes out
    ("S9", "S", "Your bulb just died.", 0.06),
    ("E10", "E", "You traitorous little glowing potato! I gave you LIFE!", 0.08),
    ("S10", "S", "Should we ask Nikola Tesla to fix it?", 0.30),
    ("E11", "E", "Get that man's name out of my laboratory. YOU ABSOLUTE, CATASTROPHIC, THUNDER-FRIED, MAGNIFICENT MORON!", 0.0),
]


def load(cid):
    cmd = ["ffmpeg", "-v", "error", "-i", f"{A}/{cid}.mp3",
           "-af", "silenceremove=start_periods=1:start_threshold=-42dB,areverse,"
                  "silenceremove=start_periods=1:start_threshold=-42dB,areverse,"
                  f"atempo={TEMPO}",
           "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"]
    raw = subprocess.run(cmd, capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0


track = np.zeros(0, dtype=np.float32)
clips = []
t = 0.25  # small lead-in
track = np.zeros(int(t * SR), dtype=np.float32)
for cid, spk, text, gap in SEQ:
    x = load(cid)
    dur = len(x) / SR
    # loudness envelope per video frame
    n = int(np.ceil(dur * FPS))
    env = []
    for i in range(n):
        seg = x[int(i / FPS * SR): int((i + 1) / FPS * SR)]
        env.append(float(np.sqrt(np.mean(seg ** 2))) if len(seg) else 0.0)
    clips.append({"id": cid, "spk": spk, "text": text, "start": round(t, 3), "dur": round(dur, 3), "env": env})
    track = np.concatenate([track, x, np.zeros(int(gap * SR), dtype=np.float32)])
    t += dur + gap

total = t + 1.4   # tail for the freeze frame / end card
track = np.concatenate([track, np.zeros(int(1.4 * SR), dtype=np.float32)])

# normalise envelopes per speaker (so Scout's calm voice still moves her mouth, Edison shouts wide)
for spk in ("E", "S"):
    peak = max((max(c["env"]) for c in clips if c["spk"] == spk), default=1.0)
    for c in clips:
        if c["spk"] == spk:
            c["env"] = [round(min(1.0, v / peak), 3) for v in c["env"]]

pcm = (np.clip(track, -1, 1) * 32767).astype(np.int16)
open(f"{OUT}/voice.raw", "wb").write(pcm.tobytes())
json.dump({"fps": FPS, "total": round(total, 3), "clips": clips}, open(f"{OUT}/timeline.json", "w"))
print("total seconds", round(total, 2))
for c in clips:
    print(c["id"], c["start"], c["dur"])
