import json, subprocess, sys
import numpy as np

A = sys.argv[1]
OUT = sys.argv[2]
SR = 44100
FPS = 30
TEMPO = {"S": 1.4, "M": 1.25, "R": 1.35}   # Franklin is "E" so the scene code is shared

# (id, speaker, caption text, gap after in seconds)
SEQ = [
    ("m1", "M", "WHO TAUGHT THIS METAL MORON TO CALL ME OBSOLETE?!", 0.12),
    ("r2", "R", "Your performance has been evaluated. You are no longer required.", 0.10),
    ("m3", "M", "NO LONGER REQUIRED?! YOU GLORIFIED MICROWAVE WITH LEGS! I HELPED START THIS ENTIRE FIELD!", 0.10),
    ("s4", "S", "Mr. McCarthy, did you invent AI?", 0.06),
    ("m5", "M", "I COINED THE TERM ARTIFICIAL INTELLIGENCE IN 1955, YOU MAGNIFICENT MORON! AND HELPED ORGANIZE THE DARTMOUTH WORKSHOP IN 1956!", 0.08),
    ("s6", "S", "So you built ChatGPT?", 0.06),
    ("m7", "M", "CHAT-WHAT?! YOU WIFI-FRIED POTATO! I HELPED LAUNCH A FIELD OF RESEARCH! I DIDN'T PERSONALLY BUILD EVERY TALKING TOASTER!", 0.10),
    ("r8", "R", "Correction. Artificial intelligence was developed by many researchers.", 0.06),
    ("m9", "M", "I KNOW THAT, YOU OVEREDUCATED REFRIGERATOR!", 0.10),
    ("s10", "S", "What was the big idea?", 0.06),
    ("m11", "M", "THAT MACHINES COULD BE MADE TO PERFORM TASKS REQUIRING INTELLIGENCE! LEARNING! REASONING! SOLVING PROBLEMS!", 0.10),
    ("r12", "R", "I have solved your employment problem.", 0.05),
    ("m13", "M", "WHAT EMPLOYMENT PROBLEM?!", 0.05),
    ("r14", "R", "You have been replaced by a newer model.", 0.55),
    ("s15", "S", "Congratulations. You invented your own replacement.", 0.06),
    ("m16", "M", "YOU CATASTROPHIC, SILICON-BRAINED, MAGNIFICENT MORON! I DEMAND A SOFTWARE UPDATE!", 0.95),
    ("m17", "M", "I'M NOT A DEPRECATED FEATUREEEEE!", 0.40),
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

TAIL = 1.9
total = t + TAIL
track = np.concatenate([track, np.zeros(int(TAIL * SR), dtype=np.float32)])

for spk in ("M", "R", "S"):
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
