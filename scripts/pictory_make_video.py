#!/usr/bin/env python3
"""
Turn a narration script into a finished Pictory video (MP4), ready to upload
to YouTube.

Pictory's text-to-video flow does the heavy lifting: it matches stock footage
to each scene, reads the narration in an AI voice, burns in captions, and adds
background music. This script just drives the two-phase storyboard -> render
API and downloads the result.

Scenes are split on blank lines. One paragraph = one scene = one visual.
Write the script that way and you control the pacing; otherwise the whole
thing becomes a single scene with one visual behind it.

Usage:
  python scripts/pictory_make_video.py --script-file script.txt \
      --name "Clean Water Update" --voice Jackson --out output.mp4

  echo "Scene one.\\n\\nScene two." | python scripts/pictory_make_video.py \
      --script-file - --name "Quick test"
"""

import argparse
import os
import sys

import requests

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pictory_client import (  # noqa: E402
    PictoryClient,
    PictoryError,
    build_storyboard_body,
    video_url,
)


def read_script(path: str) -> str:
    if path == "-":
        return sys.stdin.read()
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def split_scenes(script: str) -> list:
    """One scene per blank-line-separated paragraph."""
    scenes = [block.strip() for block in script.split("\n\n")]
    return [s for s in scenes if s]


def download(url: str, path: str) -> None:
    resp = requests.get(url, stream=True, timeout=300)
    resp.raise_for_status()
    with open(path, "wb") as f:
        for chunk in resp.iter_content(chunk_size=1 << 16):
            f.write(chunk)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--script-file", required=True,
                        help="Path to the narration script, or '-' for stdin")
    parser.add_argument("--name", required=True, help="Video name in Pictory")
    parser.add_argument("--voice", default="Jackson",
                        help="Pictory AI voice name (see the Pictory app's voice list)")
    parser.add_argument("--background-music", default="true")
    parser.add_argument("--music-volume", type=float, default=0.5)
    parser.add_argument("--language", default="en")
    parser.add_argument("--webhook", default="",
                        help="Optional callback URL; polling still runs regardless")
    parser.add_argument("--out", default="output.mp4")
    parser.add_argument("--dry-run", action="store_true",
                        help="Print the storyboard request body and exit "
                             "without calling Pictory or spending credits")
    args = parser.parse_args()

    scenes = split_scenes(read_script(args.script_file))
    if not scenes:
        raise PictoryError("Script is empty -- nothing to turn into a video.")

    background_music = str(args.background_music).strip().lower() not in (
        "false", "0", "no", "")

    body = build_storyboard_body(
        scenes=scenes,
        video_name=args.name,
        voice=args.voice,
        background_music=background_music,
        music_volume=args.music_volume,
        language=args.language,
        webhook=args.webhook.strip() or None,
    )

    print(f"{len(scenes)} scene(s) parsed from the script.")

    if args.dry_run:
        import json
        print(json.dumps(body, indent=2))
        print("\n[dry run] No Pictory call made, no credits spent.")
        return

    client = PictoryClient()
    storyboard_job = client.create_storyboard(body)
    render_job = client.render_storyboard(storyboard_job)

    url = video_url(render_job)
    print(f"[pictory] rendered: {url}")
    download(url, args.out)
    print(f"Wrote {args.out}")


if __name__ == "__main__":
    try:
        main()
    except PictoryError as e:
        print(f"Pictory error: {e}", file=sys.stderr)
        sys.exit(1)
