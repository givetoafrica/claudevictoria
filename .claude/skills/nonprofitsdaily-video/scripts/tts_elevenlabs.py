#!/usr/bin/env python3
"""Voice a NonprofitsDaily content.json with ElevenLabs and write real word timings into it.
Needs env ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID (Victoria's cloned voice) and network access to api.elevenlabs.io.
Usage: python3 tts_elevenlabs.py content.json vo.mp3
Endpoint and response shape follow ElevenLabs' text-to-speech "with-timestamps" API; UNTESTED here (no key / host blocked). VERIFY first run.
"""
import base64, json, os, re, subprocess, sys, urllib.request

key, voice = os.environ.get("ELEVENLABS_API_KEY"), os.environ.get("ELEVENLABS_VOICE_ID")
if not key or not voice:
    sys.exit("Set ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID in the environment.")
content_path, out = sys.argv[1], sys.argv[2]
content = json.load(open(content_path))
model = content.get("tts_model", "eleven_multilingual_v2")
parts, timing, offset = [], [], 0.0
for i, sc in enumerate(content["scenes"]):
    text = re.sub(r"\s+", " ", sc["say"].replace("|", " ").replace("*", "")).strip()
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice}/with-timestamps",
        data=json.dumps({"text": text, "model_id": model}).encode(),
        headers={"xi-api-key": key, "Content-Type": "application/json"})
    r = json.load(urllib.request.urlopen(req, timeout=120))
    f = f"/tmp/_vo_{i}.mp3"; open(f, "wb").write(base64.b64decode(r["audio_base64"])); parts.append(f)
    al = r["alignment"]; chars, st, en = al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]
    w, ws, we = "", None, None
    for c, s, e in list(zip(chars, st, en)) + [(" ", 0, 0)]:
        if c.strip():
            if not w: ws = s
            w += c; we = e
        elif w:
            timing.append({"w": w, "start": round(offset + ws, 3), "end": round(offset + we, 3)}); w = ""
    dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]))
    offset += dur + 0.45  # pause between scenes
lst = "/tmp/_vo_list.txt"
with open(lst, "w") as fh:
    for p in parts: fh.write(f"file '{p}'\n")
# insert a 0.45 s silence between scenes
sil = "/tmp/_sil.mp3"; subprocess.run(["ffmpeg", "-y", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono", "-t", "0.45", "-q:a", "9", sil], check=True, capture_output=True)
with open(lst, "w") as fh:
    for p in parts: fh.write(f"file '{p}'\nfile '{sil}'\n")
subprocess.run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-c:a", "libmp3lame", "-q:a", "2", out], check=True, capture_output=True)
content["timing"] = timing; content["audio"] = os.path.abspath(out)
json.dump(content, open(content_path, "w"), indent=2)
print(f"voiced {len(parts)} scenes, {len(timing)} words -> {out}")
