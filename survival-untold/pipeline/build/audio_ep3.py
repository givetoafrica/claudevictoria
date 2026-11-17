import json, subprocess, sys
import numpy as np

A = sys.argv[1]
OUT = sys.argv[2]
SR = 44100
FPS = 30
TEMPO = {"S": 1.30, "E": 1.50, "A": 1.20}   # Franklin is "E" so the scene code is shared

# (id, speaker, caption text, gap after in seconds)
SEQ = [
    ("L1", "S", "SIR! GET OFF THE BAGGAGE SCANNER!", 0.06),
    ("L2", "E", "I AM BENJAMIN FRANKLIN, YOU MAGNIFICENT MORON! I HELPED FOUND A NATION! I WILL NOT BE MANHANDLED BY A WOMAN HOLDING A PLASTIC TRAY!", 0.06),
    ("L3", "S", "Sir. Your kite is stuck in the X-ray machine.", 0.06),
    ("L4", "E", "THAT IS NOT A KITE, YOU WALKING BAGGAGE CAROUSEL! THAT IS A SCIENTIFIC INSTRUMENT OF ELECTRICAL DISCOVERY!", 0.06),
    ("L5", "S", "It's literally a kite.", 0.06),
    ("L6", "E", "AND YOU'RE LITERALLY A HUMAN SPEED BUMP! YET HERE WE BOTH ARE, DISAPPOINTING EACH OTHER!", 0.95),
    ("L7", "S", "Why is there a key attached?", 0.06),
    ("L8", "E", "BECAUSE I STUDIED THE ELECTRICAL NATURE OF LIGHTNING, YOU UNSEASONED THUNDER BISCUIT! WHAT HAVE YOU DISCOVERED?! THAT WATER BOTTLES ARE DANGEROUS?!", 0.10),
    ("L9", "S", "Wait. You're the guy who invented electricity?", 0.80),
    ("L10", "E", "INVENTED ELECTRICITY?!", 0.55),
    ("L11", "E", "YOU ABSOLUTE, CATASTROPHIC, DOUBLE-BAKED, MAGNIFICENT MORON! ELECTRICITY EXISTED BEFORE ME! I HELPED DEMONSTRATE THAT LIGHTNING WAS ELECTRICAL! I DID NOT WAKE UP ONE TUESDAY AND SWITCH ON THE UNIVERSE!", 0.06),
    ("L12", "S", "So you didn't invent it.", 0.06),
    ("L13", "E", "NEITHER DID YOUR AIRPORT, YET HERE YOU ARE CHARGING FOURTEEN DOLLARS FOR A SANDWICH!", 0.35),
    ("L14", "S", "Sir, this liquid is over the limit.", 0.06),
    ("L15", "E", "THAT IS MY EXPERIMENTAL INK, YOU GLORIFIED LUGGAGE STICKER!", 0.06),
    ("L16", "S", "You can't take it through security.", 0.06),
    ("L17", "E", "I SIGNED THE DECLARATION OF INDEPENDENCE!", 0.06),
    ("L18", "S", "Congratulations. The liquid limit still applies.", 0.06),
    ("L19", "E", "I HELPED CREATE A COUNTRY JUST TO BE BULLIED BY ITS SHAMPOO POLICY?!", 0.75),   # a passenger starts clapping
    ("L20", "E", "DON'T CLAP, YOU CONFUSED SUITCASE! THIS IS A NATIONAL EMERGENCY!", 1.15),    # PA chime
    ("L21", "A", "Attention passengers. An unattended kite has been reported at security checkpoint four.", 0.30),
    ("L22", "E", "UNATTENDED?! I AM STANDING RIGHT HERE, YOU DISEMBODIED CEILING MORON!", 0.06),
    ("L23", "S", "Sir, you're holding up three hundred passengers.", 0.06),
    ("L24", "E", "THREE HUNDRED?! EXCELLENT! FINALLY, AN AUDIENCE EDUCATED ENOUGH TO WITNESS MY SUFFERING!", 0.10),
    ("L25", "S", "You're not getting on that plane with the kite.", 0.10),
    ("L26", "E", "THEN I SHALL FLY MYSELF TO PHILADELPHIA!", 0.10),
    ("L27", "S", "Sir, that's not how aviation works!", 0.04),
    ("L28", "E", "I REFUSE TO TAKE FLIGHT ADVICE FROM A WOMAN WHO THINKS A KITE IS A LIQUID!", 1.55),   # THUD, then complete silence
    ("L29", "S", "Should we call the Wright brothers?", 0.30),
    ("L30", "E", "THE WHO?!", 0.65),                                                                   # smash cut to black
]


def load(cid, spk):
    af = ("silenceremove=start_periods=1:start_threshold=-42dB,areverse,"
          "silenceremove=start_periods=1:start_threshold=-42dB,areverse,")
    if spk == "A":   # make the announcement sound like a ceiling speaker
        af += "highpass=f=450,lowpass=f=3000,aecho=0.7:0.6:90|180:0.35|0.2,"
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

TAIL = 2.6
total = t + TAIL
track = np.concatenate([track, np.zeros(int(TAIL * SR), dtype=np.float32)])

for spk in ("E", "S"):
    peak = max(max(c["env"]) for c in clips if c["spk"] == spk)
    for c in clips:
        if c["spk"] == spk:
            c["env"] = [round(min(1.0, v / peak), 3) for v in c["env"]]
for c in clips:
    if c["spk"] == "A":
        c["env"] = [0.0 for _ in c["env"]]

open(f"{OUT}/voice.raw", "wb").write((np.clip(track, -1, 1) * 32767).astype(np.int16).tobytes())
json.dump({"fps": FPS, "total": round(total, 3), "clips": clips}, open(f"{OUT}/timeline.json", "w"))
print("total seconds", round(total, 2), "speech ends", round(t, 2))
for c in clips:
    print(c["id"], c["spk"], c["start"], c["dur"])
