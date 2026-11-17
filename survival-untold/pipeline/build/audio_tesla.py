import json, subprocess, sys
import numpy as np

A = sys.argv[1]
OUT = sys.argv[2]
SR = 44100
FPS = 30
TEMPO = {"S": 1.14, "E": 1.30}     # Scout mild, Tesla faster (his voice runs slow and theatrical)

# (id, speaker, caption text, gap after in seconds). Tesla is speaker "E" so the scene code is shared.
SEQ = [
    ("S1", "S", "Mr. Tesla, Thomas Edison says he's smarter than you.", 0.10),
    ("T1", "E", "EDISON?! THAT MAGNIFICENT MORON?! THAT WALKING CANDLE?! THAT MUSTACHE WITH A BUSINESS LICENSE?! DON'T BRING THAT ELECTRICALLY CHALLENGED POTATO INTO MY LABORATORY!", 0.10),
    ("S2", "S", "So you two were friends?", 0.08),
    ("T2", "E", "FRIENDS?! I'D RATHER CHARGE MY TOOTHBRUSH WITH A THUNDERSTORM!", 0.12),
    ("S3", "S", "Edison preferred direct current. You championed alternating current.", 0.08),
    ("T3", "E", "EXACTLY! MY AC COULD CHANGE VOLTAGE FOR EFFICIENT LONG-DISTANCE TRANSMISSION! HIS DC SYSTEM NEEDED POWER STATIONS CLOSER TO CUSTOMERS!", 0.10),
    ("S4", "S", "So you disagreed?", 0.06),
    ("T4", "E", "DISAGREED?! THAT'S LIKE SAYING A LIGHTNING BOLT DISAGREES WITH A WET SOCK! THAT MAN LOOKED AT ELECTRICITY AND SAID, \"WHAT IF WE MADE IT INCONVENIENT?!\"", 0.12),
    ("S5", "S", "But Edison was a successful businessman.", 0.08),
    ("T5", "E", "A BUSINESSMAN?! YOU MAGNIFICENT MORON! I WAS TRYING TO ENGINEER THE FUTURE! HE WAS TRYING TO INVOICE IT!", 0.10),
    ("S6", "S", "He did help develop practical electric lighting.", 0.06),
    ("T6", "E", "AND I RESPECT THE ENGINEERING! BUT THE MAN COULD TURN A SCIENTIFIC DISAGREEMENT INTO A FULL-BLOWN CIRCUS WITH ELECTRIC TICKETS!", 0.12),
    ("S7", "S", "Speaking of money, didn't you have financial problems?", 0.08),
    ("T7", "E", "MONEY?! YOU UNDERCOOKED CIRCUIT BOARD! MONEY IS TEMPORARY! GENIUS IS ETERNAL!", 0.08),
    ("S8", "S", "Your laboratory bills weren't temporary.", 0.06),
    ("T8", "E", "THOSE WERE INVESTMENTS IN HUMANITY, YOU BATTERY-OPERATED DISAPPOINTMENT!", 0.10),
    ("S9", "S", "And you were fascinated by pigeons.", 0.06),
    ("T9", "E", "PIGEONS ARE MAGNIFICENT CREATURES! THEY LISTEN! THEY DON'T INTERRUPT! THEY DON'T WALK INTO MY LAB AND START DEFENDING THOMAS FLIPPING EDISON!", 0.12),
    ("S10", "S", "So who's the greater genius? You or Edison?", 0.06),
    ("T10", "E", "ME! OBVIOUSLY ME! I AM THE THUNDER! I AM THE CURRENT! I AM THE—", 0.05),
    ("S11", "S", "Your electricity bill is overdue.", 1.05),      # Tesla: "..." (the deflating silence)
    ("S12", "S", "Should I call Edison?", 0.10),
    ("T12", "E", "YOU CATASTROPHIC, VOLTAGE-STARVED, MAGNIFICENT MORON! I'LL POWER THIS BUILDING WITH PURE SPITE!", 1.35),  # LIGHTS GO OUT
    ("S13", "S", "Apparently spite is not a renewable energy source.", 0.20),
    ("T13", "E", "GET! OUT! OF! MY! LAB!", 0.0),
]


def load(cid, spk):
    cmd = ["ffmpeg", "-v", "error", "-i", f"{A}/{cid}.mp3",
           "-af", "silenceremove=start_periods=1:start_threshold=-42dB,areverse,"
                  "silenceremove=start_periods=1:start_threshold=-42dB,areverse,"
                  f"atempo={TEMPO[spk]}",
           "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"]
    raw = subprocess.run(cmd, capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0


t = 0.25
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

TAIL = 3.0
total = t + TAIL
track = np.concatenate([track, np.zeros(int(TAIL * SR), dtype=np.float32)])

for spk in ("E", "S"):
    peak = max(max(c["env"]) for c in clips if c["spk"] == spk)
    for c in clips:
        if c["spk"] == spk:
            c["env"] = [round(min(1.0, v / peak), 3) for v in c["env"]]

open(f"{OUT}/voice.raw", "wb").write((np.clip(track, -1, 1) * 32767).astype(np.int16).tobytes())
json.dump({"fps": FPS, "total": round(total, 3), "clips": clips}, open(f"{OUT}/timeline.json", "w"))
print("total seconds", round(total, 2))
for c in clips:
    print(c["id"], c["start"], c["dur"])
