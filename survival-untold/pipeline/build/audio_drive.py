import json, subprocess, sys
import numpy as np

A = sys.argv[1]
OUT = sys.argv[2]
SR = 44100
FPS = 30
TEMPO = {"S": 1.25, "E": 1.15, "F": 1.15}   # Franklin is "E" so the scene code is shared

# (id, speaker, caption text, gap after in seconds)
SEQ = [
    ("D1", "S", "MR. FRANKLIN! WHY IS YOUR HEAD OUT OF THE CAR WINDOW?", 0.15),
    ("D2", "E", "BECAUSE I AM TESTING AIRFLOW, YOU MAGNIFICENT MORON! ALSO MY SPECTACLES FOGGED UP!", 0.15),
    ("D3", "S", "Sir, you died in 1790.", 0.12),
    ("D4", "E", "A MINOR SCHEDULING CONFLICT! I DESIGNED THE ODOMETER! I AM PERFECTLY QUALIFIED TO BE LOST!", 0.12),
    ("D5", "S", "Do you have a license?", 0.10),
    ("D6", "E", "I WAS THE FIRST POSTMASTER GENERAL, YOU LICENSED PARKING CONE! I DELIVERED MAIL BEFORE YOUR GRANDPARENTS WERE A RUMOR!", 0.15),
    ("D7", "S", "You're doing sixty in a school zone.", 0.10),
    ("D8", "E", "I INVENTED THE LIGHTNING ROD, NOT THE SPEED LIMIT, YOU GLORIFIED TRAFFIC CONE!", 0.15),
    ("D9", "S", "Wait. You're the guy who invented electricity?", 0.70),
    ("D10", "E", "INVENTED ELECTRICITY?!", 0.50),
    ("D11", "E", "YOU ABSOLUTE, CATASTROPHIC, DOUBLE-BAKED, MAGNIFICENT MORON! ELECTRICITY EXISTED BEFORE ME! I HELPED DEMONSTRATE THAT LIGHTNING WAS ELECTRICAL! I DID NOT WAKE UP ONE TUESDAY AND SWITCH ON THE UNIVERSE!", 0.15),
    ("D12", "S", "So you didn't invent it.", 0.15),
    ("D13", "E", "NEITHER DID YOUR GPS, YET IT KEEPS SENDING ME INTO A LAKE!", 0.40),
    ("D14", "S", "Why is there a kite tied to your roof?", 0.10),
    ("D15", "E", "FOR EMERGENCIES, YOU WALKING SPEED BUMP!", 0.12),
    ("D16", "S", "Sir, you just missed your exit.", 0.10),
    ("D17", "E", "I DID NOT MISS IT, YOU UNSEASONED BUMPER STICKER! THE EXIT MISSED ME!", 0.15),
    ("D18", "S", "Last question. Any advice for the next genius?", 0.12),
    ("D19", "E", "YES! DO NOT TAKE QUESTIONS FROM A WOMAN ON A SCOOTER! I AM LEAVING!", 1.10),   # he zooms away
    ("D21", "S", "He took my microphone. Should we call the Wright brothers?", 0.45),
    ("D22", "F", "THE WHO?!", 0.65),                                                              # far away, fading
]


def load(cid, spk):
    af = ("silenceremove=start_periods=1:start_threshold=-42dB,areverse,"
          "silenceremove=start_periods=1:start_threshold=-42dB,areverse,")
    if spk == "F":   # far away down the road, fading out
        af += "lowpass=f=2600,aecho=0.6:0.5:140|260:0.3|0.2,afade=t=out:st=0.5:d=0.7,volume=0.8,"
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

TAIL = 2.4
total = t + TAIL
track = np.concatenate([track, np.zeros(int(TAIL * SR), dtype=np.float32)])

for spk in ("E", "S", "F"):
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
