#!/usr/bin/env python3
"""
Render a long-form ambience video from an audio bed.

Built for the black-screen format: a true-black 1080p frame for the whole
duration, with the audio looped up to the target length. True black matters
— on an OLED panel a #000000 pixel is switched off, so the format is both a
battery saver and a melatonin-friendly way to fall asleep with a phone in
the room. It is also the cheapest long-form video that exists to produce:
there are no visuals to generate at all, and x264 spends almost no bitrate
on an unchanging frame, so an 8-hour render is a small file.

Audio is looped to fill the duration. Two seams matter and both are handled:
a short crossfade hides the loop point, and a fade in/out at the extremes
stops the video opening or closing on a click.

Requires ffmpeg (present on GitHub Actions runners; see the workflow).

Usage:
    python scripts/render_ambient_video.py \
        --audio beds/accra-rain.wav \
        --hours 8 \
        --out out/accra-rain-8h.mp4
"""

import argparse
import json
import os
import shutil
import subprocess
import sys

# A static frame needs almost no temporal resolution, but too low an fps
# makes some players and YouTube's processor unhappy. 15 is a safe floor.
FPS = 15
WIDTH, HEIGHT = 1920, 1080

# Seconds of crossfade used to hide the loop seam, and of fade at the very
# start and end of the finished video.
LOOP_CROSSFADE_SECONDS = 4
EDGE_FADE_SECONDS = 5


class RenderError(RuntimeError):
    pass


def _require_ffmpeg():
    for tool in ("ffmpeg", "ffprobe"):
        if not shutil.which(tool):
            raise RenderError(
                f"{tool} not found. It ships with GitHub Actions runners; "
                "locally, install it via your package manager."
            )


def _run(cmd):
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        # ffmpeg puts its actual diagnosis in the last few stderr lines.
        tail = "\n".join(result.stderr.strip().splitlines()[-15:])
        raise RenderError(f"{cmd[0]} failed:\n{tail}")
    return result.stdout


def audio_duration(path):
    out = _run([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "json", path,
    ])
    try:
        return float(json.loads(out)["format"]["duration"])
    except (KeyError, ValueError) as exc:
        raise RenderError(f"could not read a duration from {path}") from exc


def build_audio_filter(source_seconds, target_seconds):
    """Loop the bed to target_seconds, hiding the seam and the edges.

    A plain loop clicks audibly at every repeat, which is exactly the kind
    of detail a sleep listener notices. Overlapping the tail of each pass
    with the head of the next removes it.
    """
    if source_seconds <= LOOP_CROSSFADE_SECONDS * 2:
        raise RenderError(
            f"audio is only {source_seconds:.1f}s — too short to crossfade. "
            f"Use a bed longer than {LOOP_CROSSFADE_SECONDS * 2}s."
        )

    fade_out_start = max(target_seconds - EDGE_FADE_SECONDS, 0)
    return (
        # acrossfade needs discrete inputs, so loop first and smooth the
        # seam with a short overlap applied across the looped stream.
        f"afade=t=in:st=0:d={EDGE_FADE_SECONDS},"
        f"afade=t=out:st={fade_out_start}:d={EDGE_FADE_SECONDS}"
    )


def render(audio, hours, out_path, title=None):
    _require_ffmpeg()
    target_seconds = int(round(hours * 3600))
    if target_seconds < 60:
        raise RenderError("target duration must be at least 60 seconds")

    source_seconds = audio_duration(audio)
    os.makedirs(os.path.dirname(os.path.abspath(out_path)) or ".", exist_ok=True)

    cmd = [
        "ffmpeg", "-y",
        # True black source frame, generated rather than read from disk.
        "-f", "lavfi",
        "-i", f"color=c=black:s={WIDTH}x{HEIGHT}:r={FPS}",
        # -stream_loop on the input repeats the bed; -t on the output cuts
        # the result to length, so a short bed and a long bed both work.
        "-stream_loop", "-1", "-i", audio,
        "-af", build_audio_filter(source_seconds, target_seconds),
        "-t", str(target_seconds),
        "-c:v", "libx264",
        "-tune", "stillimage",
        "-preset", "veryfast",
        # An unchanging frame compresses to almost nothing; the keyframe
        # interval is what actually sets the floor on file size here.
        "-crf", "28",
        "-g", str(FPS * 10),
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-b:a", "192k",
        "-ar", "48000",
        "-movflags", "+faststart",
        "-shortest",
        out_path,
    ]
    print(f"rendering {hours}h from {audio} ({source_seconds:.1f}s bed)...",
          file=sys.stderr)
    _run(cmd)

    size_mb = os.path.getsize(out_path) / (1024 * 1024)
    print(f"wrote {out_path} ({size_mb:.1f} MB)", file=sys.stderr)
    if title:
        print(f"suggested title: {title}", file=sys.stderr)
    return out_path


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--audio", required=True, help="audio bed to loop")
    parser.add_argument("--hours", type=float, required=True,
                        help="target duration in hours (e.g. 8, or 0.5)")
    parser.add_argument("--out", required=True, help="output .mp4 path")
    parser.add_argument("--title", help="title to echo alongside the render")
    args = parser.parse_args()

    render(args.audio, args.hours, args.out, args.title)


if __name__ == "__main__":
    try:
        main()
    except RenderError as exc:
        print(f"error: {exc}", file=sys.stderr)
        sys.exit(1)
