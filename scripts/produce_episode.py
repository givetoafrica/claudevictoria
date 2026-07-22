#!/usr/bin/env python3
"""Produce a full episode video from a segments.json file via Gathos.

Pipeline per segment: TTS each line -> stitch with pauses -> generate one
illustration -> ken-burns the image for the audio duration -> concat all
segments into one 1920x1080 mp4. Then generate the thumbnail (1280x720 with
baked text via ffmpeg drawtext).

Outputs into <episode-dir>/output/:
  episode.mp4, thumbnail.png, production_log.json
If episode.mp4 exceeds --max-commit-mb, it is split into episode.mp4.part-*
chunks (reassemble with `cat episode.mp4.part-* > episode.mp4`).
"""

import argparse
import json
import math
import os
import subprocess
import sys
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import gathos_client as gathos

FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
LINE_GAP_SECONDS = 0.35


def run(cmd, **kw):
    print("+", " ".join(str(c) for c in cmd), flush=True)
    subprocess.run([str(c) for c in cmd], check=True, **kw)


def download(url, dest):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=120) as r, open(dest, "wb") as f:
        f.write(r.read())
    return dest


def audio_duration(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", str(path)],
        capture_output=True, text=True, check=True)
    return float(out.stdout.strip())


def upload_reference_voice(name, path):
    """POST /tts/voices with a local sample for zero-shot cloning.

    Field names unconfirmed — sends multipart {file} + {name} and parses the
    voice id defensively, raising with the full response on a miss.
    """
    import requests
    key = os.environ["GATHOS_TTS_KEY"]
    with open(path, "rb") as f:
        resp = requests.post(
            f"{gathos.BASE_URL}/tts/voices",
            headers={"Authorization": f"Bearer {key}"},
            data={"name": name},
            files={"file": (os.path.basename(path), f)},
            timeout=180,
        )
    resp.raise_for_status()
    data = resp.json()
    for k in ("voice_id", "id", "voiceId", "name"):
        if isinstance(data, dict) and data.get(k):
            return str(data[k])
    raise gathos.GathosError(
        f"Voice upload for {name!r} returned no recognizable voice id: {data}")


def resolve_voices(repo_root, hints, warnings):
    """Prefer cloned reference voices from assets/voices/voices.json;
    fall back to picking from the provider's catalog, then to default."""
    refs_file = repo_root / "assets" / "voices" / "voices.json"
    if refs_file.exists():
        refs = json.loads(refs_file.read_text())
        picks = {}
        try:
            for character, rel_path in refs.items():
                picks[character] = upload_reference_voice(
                    f"btf-{character}", repo_root / rel_path)
            return picks
        except Exception as e:
            warnings.append(f"reference voice upload failed ({e}); "
                            f"falling back to catalog voices")
    voices = list_voices()
    if not voices:
        warnings.append("no voices available; default voice used for all lines")
        return {}
    return pick_voices(voices, hints)


def list_voices():
    """GET /tts/voices — shape unconfirmed; normalize defensively."""
    import requests
    key = os.environ.get("GATHOS_TTS_KEY")
    if not key:
        return []
    try:
        resp = requests.get(f"{gathos.BASE_URL}/tts/voices",
                            headers=gathos._headers(key), timeout=60)
        resp.raise_for_status()
        data = resp.json()
    except Exception as e:
        print(f"[voices] listing failed ({e}); falling back to default voice")
        return []
    raw = data.get("voices", data) if isinstance(data, dict) else data
    voices = []
    if isinstance(raw, list):
        for v in raw:
            if isinstance(v, dict):
                vid = v.get("voice_id") or v.get("id") or v.get("name")
                text = " ".join(str(v.get(k, "")) for k in
                                ("name", "description", "labels", "tags", "gender"))
                if vid:
                    voices.append({"id": str(vid), "text": text.lower(), "raw": v})
    return voices


def pick_voices(voices, hints):
    """Score each available voice against per-character keyword hints."""
    picks, used = {}, set()
    for character, keywords in hints.items():
        best, best_score = None, -1
        for v in voices:
            score = sum(1 for k in keywords if k in v["text"])
            if v["id"] in used:
                score -= 0.5  # prefer distinct voices per character
            if score > best_score:
                best, best_score = v, score
        if best:
            picks[character] = best["id"]
            used.add(best["id"])
        else:
            picks[character] = None
    return picks


def tts_line(text, voice_id, dest_dir, name):
    job = gathos.generate_tts(text, voice_id=voice_id,
                              extra_fields=None)
    url = gathos.extract_output(job)
    ext = os.path.splitext(str(url).split("?")[0])[1] or ".mp3"
    raw = dest_dir / f"{name}{ext}"
    download(url, raw)
    wav = dest_dir / f"{name}.norm.wav"
    run(["ffmpeg", "-y", "-v", "error", "-i", raw, "-ar", "44100", "-ac", "2", wav])
    return wav


def stitch_segment_audio(wavs, silence, dest):
    concat_list = dest.with_suffix(".txt")
    parts = []
    for i, w in enumerate(wavs):
        if i > 0:
            parts.append(silence)
        parts.append(w)
    concat_list.write_text("".join(f"file '{p.resolve()}'\n" for p in parts))
    run(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0",
         "-i", concat_list, "-c", "copy", dest])
    return dest


def segment_video(image, seg_audio, dest, duration):
    frames = max(24, math.ceil(duration * 24))
    zoom = f"zoompan=z='min(zoom+0.00035,1.18)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={frames}:s=1920x1080:fps=24"
    run(["ffmpeg", "-y", "-v", "error", "-loop", "1", "-framerate", "24",
         "-i", image, "-i", seg_audio,
         "-filter_complex",
         f"[0:v]scale=3840:2160:force_original_aspect_ratio=increase,crop=3840:2160,{zoom}[v]",
         "-map", "[v]", "-map", "1:a",
         "-c:v", "libx264", "-crf", "25", "-preset", "medium",
         "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k",
         "-t", f"{duration:.3f}", dest])
    return dest


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--episode-dir", required=True)
    p.add_argument("--max-commit-mb", type=int, default=85)
    args = p.parse_args()

    ep_dir = Path(args.episode_dir)
    spec = json.loads((ep_dir / "segments.json").read_text())
    out_dir = ep_dir / "output"
    work = ep_dir / "work"
    out_dir.mkdir(exist_ok=True)
    work.mkdir(exist_ok=True)

    missing = [v for v in ("GATHOS_TTS_KEY", "GATHOS_IMAGE_KEY") if not os.environ.get(v)]
    if missing:
        sys.exit(f"Missing required secrets: {', '.join(missing)} — add them to the "
                 f"repository's Actions secrets and re-run.")

    # Guard: character names must never reach a visual prompt.
    forbidden = spec.get("forbidden_names_in_visuals", [])
    for seg in spec["segments"]:
        for name in forbidden:
            if name.lower() in seg["visual"].lower():
                sys.exit(f"visual_rules violation: character name {name!r} found "
                         f"in visual prompt of segment {seg['id']}")

    log = {"episode": spec["episode"], "voices": {}, "segments": [], "warnings": []}

    repo_root = Path(__file__).resolve().parent.parent
    picks = resolve_voices(repo_root, spec.get("voice_hints", {}), log["warnings"])
    log["voices"] = picks
    print(f"[voices] picks: {picks}")

    silence = work / "silence.wav"
    run(["ffmpeg", "-y", "-v", "error", "-f", "lavfi",
         "-i", f"anullsrc=r=44100:cl=stereo", "-t", str(LINE_GAP_SECONDS), silence])

    style_suffix = spec.get("style_suffix", "")
    seg_videos = []
    for seg in spec["segments"]:
        sid = seg["id"]
        print(f"=== segment {sid}", flush=True)
        wavs = []
        for i, line in enumerate(seg["lines"]):
            voice = picks.get(line["speaker"])
            wavs.append(tts_line(line["text"], voice, work, f"{sid}_line{i}"))
        seg_audio = stitch_segment_audio(wavs, silence, work / f"{sid}.wav")
        dur = audio_duration(seg_audio)

        prompt = f"{seg['visual']}, {style_suffix}"
        job = gathos.generate_image(prompt)
        img = download(gathos.extract_output(job), work / f"{sid}.png")

        sv = segment_video(img, seg_audio, work / f"{sid}.mp4", dur)
        seg_videos.append(sv)
        log["segments"].append({"id": sid, "seconds": round(dur, 2), "image_prompt": prompt})

    concat_list = work / "episode_concat.txt"
    concat_list.write_text("".join(f"file '{v.resolve()}'\n" for v in seg_videos))
    episode = out_dir / "episode.mp4"
    run(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0",
         "-i", concat_list, "-c", "copy", episode])
    log["total_seconds"] = round(sum(s["seconds"] for s in log["segments"]), 2)

    # Thumbnail: generate art, crop to 1280x720, bake title text.
    thumb_spec = spec["thumbnail"]
    job = gathos.generate_image(thumb_spec["prompt"])
    thumb_raw = download(gathos.extract_output(job), work / "thumb_raw.png")
    thumbnail = out_dir / "thumbnail.png"
    drawtext = (f"drawtext=fontfile={FONT}:text='{thumb_spec['text']}':"
                f"fontcolor=white:fontsize=92:x=w-tw-56:y=72:"
                f"shadowcolor=0xFF7A00:shadowx=5:shadowy=5")
    run(["ffmpeg", "-y", "-v", "error", "-i", thumb_raw,
         "-vf", f"scale=1280:720:force_original_aspect_ratio=increase,"
                f"crop=1280:720,{drawtext}", thumbnail])

    size_mb = episode.stat().st_size / 1e6
    log["episode_mb"] = round(size_mb, 1)
    if size_mb > args.max_commit_mb:
        run(["split", "-b", f"{args.max_commit_mb - 5}m", "-a", "2", episode,
             f"{episode}.part-"])
        episode.unlink()
        log["warnings"].append(
            "episode.mp4 split for commit; reassemble: cat episode.mp4.part-* > episode.mp4")

    (out_dir / "production_log.json").write_text(json.dumps(log, indent=2))
    print(json.dumps(log, indent=2))


if __name__ == "__main__":
    main()
