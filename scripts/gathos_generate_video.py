#!/usr/bin/env python3
"""
Generate a video of arbitrary target length via Gathos and stitch the
clips together with ffmpeg. A single Gathos clip is capped at ~513
frames (~21s at 24fps), so anything longer is built from multiple clips
generated from the same prompt and concatenated.

Note: each clip is generated independently, so motion is not perfectly
continuous across clip boundaries -- this is a sequence of same-prompt
clips, not one continuous shot.

Usage:
  python scripts/gathos_generate_video.py \
      --prompt "A young boy running after his mom in a sunny park" \
      --duration 60 --style Cinematic --out output.mp4
"""

import argparse
import os
import subprocess
import sys
import tempfile

import requests

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gathos_client import generate_video, snap_ltx_frames, GathosError

MAX_CLIP_SECONDS = 20  # stay comfortably under the ~513-frame (~21s@24fps) cap


def download(url: str, path: str) -> None:
    resp = requests.get(url, stream=True, timeout=120)
    resp.raise_for_status()
    with open(path, "wb") as f:
        for chunk in resp.iter_content(chunk_size=1 << 16):
            f.write(chunk)


def parse_bool(value: str) -> bool:
    return str(value).strip().lower() not in ("false", "0", "no", "")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--prompt", required=True, help="Scene description")
    parser.add_argument("--duration", type=float, default=60, help="Target total length in seconds")
    parser.add_argument("--style", default="", help="Gathos style name, e.g. Cinematic, Ghibli, Pixar")
    parser.add_argument("--negative-prompt", default="")
    parser.add_argument("--fps", type=float, default=24)
    parser.add_argument("--width", type=int, default=1280)
    parser.add_argument("--height", type=int, default=736)
    parser.add_argument("--generate-audio", default="true")
    parser.add_argument("--prevent-text", default="false")
    parser.add_argument("--out", default="output.mp4")
    args = parser.parse_args()

    style = args.style.strip() or None
    negative_prompt = args.negative_prompt.strip() or None
    generate_audio = parse_bool(args.generate_audio)
    prevent_text = parse_bool(args.prevent_text)

    num_clips = max(1, -(-int(round(args.duration)) // MAX_CLIP_SECONDS))  # ceil div
    clip_seconds = args.duration / num_clips
    num_frames = snap_ltx_frames(clip_seconds * args.fps)

    print(f"Target {args.duration}s -> {num_clips} clip(s) of ~{clip_seconds:.1f}s "
          f"({num_frames} frames @ {args.fps}fps) each.")

    with tempfile.TemporaryDirectory() as tmp:
        clip_paths = []
        for i in range(num_clips):
            print(f"[{i + 1}/{num_clips}] submitting clip...")
            job = generate_video(
                prompt=args.prompt,
                mode="t2av",
                num_frames=num_frames,
                fps=args.fps,
                width=args.width,
                height=args.height,
                style=style,
                negative_prompt=negative_prompt,
                generate_audio=generate_audio,
                prevent_text=prevent_text,
            )
            clip_path = os.path.join(tmp, f"clip_{i:02d}.mp4")
            download(job["video_url"], clip_path)
            clip_paths.append(clip_path)
            print(f"[{i + 1}/{num_clips}] done -> {clip_path}")

        if len(clip_paths) == 1:
            os.replace(clip_paths[0], args.out)
        else:
            list_path = os.path.join(tmp, "concat_list.txt")
            with open(list_path, "w") as f:
                for p in clip_paths:
                    f.write(f"file '{p}'\n")

            subprocess.run(
                ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", list_path,
                 "-c:v", "libx264", "-c:a", "aac", args.out],
                check=True,
            )

    print(f"Wrote {args.out}")


if __name__ == "__main__":
    try:
        main()
    except GathosError as e:
        print(f"Gathos error: {e}", file=sys.stderr)
        sys.exit(1)
