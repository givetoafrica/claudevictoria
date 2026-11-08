import json, subprocess, sys
import numpy as np

A = sys.argv[1]
OUT = sys.argv[2]
SR = 44100
FPS = 30
TEMPO = {"S": 1.25, "O": 1.2, "W": 1.2}   # Franklin is "E" so the scene code is shared

# (id, speaker, caption text, gap after in seconds)
SEQ = [
    ("W1", "O", "WHO THE HELL IS FLYING THIS THING?! WE INVENTED THE AIRPLANE!", 0.05),
    ("W2", "S", "Gentlemen, Scout here. What was your greatest invention?", 0.05),
    ("W3", "W", "THE AIRPLANE, YOU MAGNIFICENT MORON! WHAT DID YOU THINK?! A FLYING TOASTER?!", 0.04),
    ("W4", "O", "AND I FLEW IT FIRST!", 0.03),
    ("W5", "W", "FOR TWELVE SECONDS, YOU UNDERCOOKED PIGEON!", 0.06),
    ("W6", "S", "Twelve seconds?", 0.06),
    ("W7", "O", "DECEMBER 17, 1903! ONE HUNDRED AND TWENTY FEET! CONTROLLED, POWERED FLIGHT!", 0.03),
    ("W8", "W", "AND OUR BIG BREAKTHROUGH WAS CONTROL! MAKING THE PLANE BALANCE AND TURN!", 0.02),
    ("W9", "O", "UNLIKE YOUR BRAIN, YOU MUSTACHE-POWERED CHICKEN!", 0.12),
    ("W10", "S", "So what do you think of modern airplanes?", 0.10),
    ("W11", "S", "They have autopilot now.", 0.90),
    ("W12", "W", "AUTO-WHAT?!", 0.06),
    ("W13", "O", "YOU MEAN A METAL BOX FLIES ITSELF?!", 0.03),
    ("W14", "W", "WE RISKED OUR NECKS IN A FLYING LAWN CHAIR FOR THIS?!", 0.12),
    ("W15", "S", "You could always take the train.", 0.08),
    ("W16", "O", "YOU MAGNIFICENT MORON! WE DIDN'T INVENT THE SKY TO RIDE A TRAIN!", 0.10),
]


def load(cid, spk):
    af = ("silenceremove=start_periods=1:start_threshold=-42dB,areverse,"
          "silenceremove=start_periods=1:start_threshold=-42dB,areverse,")
    af += f"atempo={TEMPO[spk]}"
    cmd = ["ffmpeg", "-v", "error", "-i", f"{A}/{cid}.mp3", "-af", af, "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"]
    raw = subprocess.run(cmd, capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0


t = 0.15
track = np.zeros(int(t * SR), dtype=np.float32)
clips = []
for cid, spk, text, gap in SEQ:
    x = load(cid, spk)
    dur = len(x) / SR
    n = int(np.ceil(dur * FPS))
    env = []
    for i in range(n):
        seg = x[int(i / FPS * SR): int((i + 1) / FPS * SR)]
        env.append(float(np.sqrt(np.mean(seg ** 2))) if len(seg) else 0.0)
    clips.append({"id": cid, "spk": spk, "text": text, "start": round(t, 3), "dur": round(dur, 3), "env": env})
    track = np.concatenate([track, x, np.zeros(int(gap * SR), dtype=np.float32)])
    t += dur + gap

TAIL = 3.4
total = t + TAIL
track = np.concatenate([track, np.zeros(int(TAIL * SR), dtype=np.float32)])

for spk in ("O", "W", "S"):
    if not any(c["spk"] == spk for c in clips): continue
    peak = max(max(c["env"]) for c in clips if c["spk"] == spk)
    for c in clips:
        if c["spk"] == spk:
            c["env"] = [round(min(1.0, v / peak), 3) for v in c["env"]]

open(f"{OUT}/voice.raw", "wb").write((np.clip(track, -1, 1) * 32767).astype(np.int16).tobytes())
json.dump({"fps": FPS, "total": round(total, 3), "clips": clips}, open(f"{OUT}/timeline.json", "w"))
print("total seconds", round(total, 2), "speech ends", round(t, 2))
for c in clips:
    print(c["id"], c["spk"], c["start"], c["dur"])
