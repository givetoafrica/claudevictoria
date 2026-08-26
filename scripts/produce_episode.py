#!/usr/bin/env python3
"""
Produce one upload-ready ambience episode from a spec file.

An episode is three artefacts that have to agree with each other: the audio
bed, the video rendered from it, and the packaging (title, description,
tags) that ships with it. Producing them from a single spec is what keeps
them in agreement -- a thumbnail badge reading "90 MIN" over a three-hour
render is the failure this exists to prevent.

The spec drives scripts that already exist:
    synthesize_rain_bed.py  -> the audio bed
    render_ambient_video.py -> the black-screen video
    make_thumbnail.py       -> the 1280x720 thumbnail

Provenance is enforced, not documented. A spec with
`audio_provenance: synthesized` must carry a description that discloses it,
because the audio is modelled rather than recorded and presenting it as a
recording of a real place would be a false claim about the work.

Usage:
    python scripts/produce_episode.py \
        --spec channels/african-natural-ambience/episodes/001-tin-roof-rain.json \
        --out out/
"""

import argparse
import json
import os
import subprocess
import sys

SCRIPTS = os.path.dirname(os.path.abspath(__file__))

# YouTube's recommended thumbnail size. The video is 1080p; the thumbnail is
# not, and assuming they match is a common way to ship a wrong-sized image.
THUMBNAIL_SIZE = (1280, 720)
VIDEO_SIZE = (1920, 1080)

# Rendered duration is allowed to drift this far from the spec before it
# counts as a truncated render rather than rounding.
DURATION_TOLERANCE_SECONDS = 10

# Phrases that would have to appear for a synthesized bed to be disclosed.
# Any one of them is enough.
DISCLOSURE_MARKERS = ("synthesized", "synthesised", "not a field recording",
                      "modelled", "modeled")

# A YouTube title is truncated in search and on mobile past roughly here.
TITLE_SOFT_LIMIT = 100


class ProductionError(RuntimeError):
    pass


def _run(cmd):
    print("+ " + " ".join(cmd), file=sys.stderr)
    result = subprocess.run(cmd)
    if result.returncode != 0:
        raise ProductionError(f"{cmd[1]} failed with exit code {result.returncode}")


def _ffprobe(path, entries):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", entries,
         "-of", "json", path],
        capture_output=True, text=True,
    )
    if out.returncode != 0:
        raise ProductionError(f"ffprobe could not read {path}")
    return json.loads(out.stdout)


def check_disclosure(spec, description):
    """A synthesized bed must say so in the description it ships with."""
    if spec.get("audio_provenance") != "synthesized":
        return
    lowered = description.lower()
    if not any(marker in lowered for marker in DISCLOSURE_MARKERS):
        raise ProductionError(
            "audio_provenance is 'synthesized' but the description does not "
            "disclose it. The bed is modelled, not recorded -- shipping it as "
            f"a recording is a false claim. Add one of: {DISCLOSURE_MARKERS}"
        )


def validate_video(path, expected_seconds):
    probe = _ffprobe(path, "format=duration:stream=width,height")
    actual = float(probe["format"]["duration"])
    if abs(actual - expected_seconds) > DURATION_TOLERANCE_SECONDS:
        raise ProductionError(
            f"{path} is {actual:.1f}s, not the requested {expected_seconds}s. "
            "A short render here means ffmpeg truncated silently."
        )

    video_streams = [s for s in probe.get("streams", []) if s.get("width")]
    if not video_streams:
        raise ProductionError(f"{path} has no video stream")
    size = (video_streams[0]["width"], video_streams[0]["height"])
    if size != VIDEO_SIZE:
        raise ProductionError(f"{path} is {size[0]}x{size[1]}, expected "
                              f"{VIDEO_SIZE[0]}x{VIDEO_SIZE[1]}")
    return actual


def validate_thumbnail(path):
    from PIL import Image
    with Image.open(path) as img:
        if img.size != THUMBNAIL_SIZE:
            raise ProductionError(
                f"{path} is {img.size[0]}x{img.size[1]}, expected "
                f"{THUMBNAIL_SIZE[0]}x{THUMBNAIL_SIZE[1]}"
            )
        if img.format != "PNG":
            raise ProductionError(f"{path} is {img.format}, expected PNG")


def check_packaging(packaging, thumbnail):
    """Warn on the packaging mistakes that cost views, without failing the run.

    These are judgement calls, not correctness bugs -- a title over the soft
    limit still uploads. They are surfaced because nobody re-reads a title
    after the render succeeds.
    """
    warnings = []
    title = packaging["title"]
    if len(title) > TITLE_SOFT_LIMIT:
        warnings.append(
            f"title is {len(title)} characters; YouTube truncates around "
            f"{TITLE_SOFT_LIMIT} in search and on mobile"
        )

    # Thumbnail text is not indexed, so repeating the title in it wastes the
    # highest-leverage surface on the video.
    thumb_words = {w.lower().strip(".,|") for w in
                   f"{thumbnail['line1']} {thumbnail['line2']}".split()}
    title_words = {w.lower().strip(".,|") for w in title.split()}
    shared = thumb_words & title_words
    if len(shared) >= 3:
        warnings.append(
            f"thumbnail text and title share {sorted(shared)} -- the "
            "thumbnail is not indexed, so duplicating the title in it buys "
            "nothing"
        )
    return warnings


def produce(spec_path, out_dir):
    with open(spec_path) as handle:
        spec = json.load(handle)

    slug = spec["slug"]
    hours = float(spec["hours"])
    target_seconds = int(round(hours * 3600))

    description_path = os.path.join(
        os.path.dirname(spec_path), f"{slug}-description.md"
    )
    with open(description_path) as handle:
        description = handle.read()
    check_disclosure(spec, description)

    os.makedirs(out_dir, exist_ok=True)
    bed = os.path.join(out_dir, f"{slug}-bed.wav")
    video = os.path.join(out_dir, f"{slug}.mp4")
    thumbnail = os.path.join(out_dir, f"{slug}-thumbnail.png")

    bed_spec = spec["bed"]
    _run([sys.executable, os.path.join(SCRIPTS, "synthesize_rain_bed.py"),
          "--seconds", str(bed_spec["seconds"]),
          "--intensity", str(bed_spec["intensity"]),
          "--seed", str(bed_spec["seed"]),
          "--out", bed])

    _run([sys.executable, os.path.join(SCRIPTS, "render_ambient_video.py"),
          "--audio", bed, "--hours", str(hours),
          "--title", spec["working_title"], "--out", video])

    thumb_spec = spec["thumbnail"]
    _run([sys.executable, os.path.join(SCRIPTS, "make_thumbnail.py"),
          "--line1", thumb_spec["line1"], "--line2", thumb_spec["line2"],
          "--badge", thumb_spec["badge"], "--seed", str(thumb_spec["seed"]),
          "--out", thumbnail])

    actual_seconds = validate_video(video, target_seconds)
    validate_thumbnail(thumbnail)
    warnings = check_packaging(spec["packaging"], thumb_spec)

    packaging = spec["packaging"]
    sheet = os.path.join(out_dir, f"{slug}-packaging.md")
    with open(sheet, "w") as handle:
        handle.write(f"# {slug} — paste-ready packaging\n\n")
        handle.write(f"## Title\n\n{packaging['title']}\n\n")
        handle.write(f"## Description\n\n{description}\n")
        handle.write("## Tags\n\n" + ", ".join(packaging["tags"]) + "\n\n")
        handle.write("## Hashtags\n\n" + " ".join(packaging["hashtags"]) + "\n\n")
        handle.write(
            "## Upload settings\n\n"
            f"- Duration rendered: {actual_seconds / 60:.1f} minutes\n"
            "- Made for kids: No\n"
            "- Monetisation: mid-roll ads OFF (the description promises this)\n"
            "- Altered content disclosure: not required — no realistic "
            "synthetic footage of a real place or person. The audio is "
            "modelled and is disclosed as such in the description.\n"
        )

    # The wav is an intermediate, and a 5-minute 48kHz bed is larger than the
    # 90-minute video it produced. Keeping it in the artifact wastes upload.
    os.remove(bed)

    print(f"\nepisode {slug} ready in {out_dir}/", file=sys.stderr)
    for name in sorted(os.listdir(out_dir)):
        size_mb = os.path.getsize(os.path.join(out_dir, name)) / (1024 * 1024)
        print(f"  {name}  ({size_mb:.1f} MB)", file=sys.stderr)
    for warning in warnings:
        print(f"\nWARNING: {warning}", file=sys.stderr)
    return warnings


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--spec", required=True, help="episode spec JSON")
    parser.add_argument("--out", default="out", help="output directory")
    args = parser.parse_args()
    try:
        produce(args.spec, args.out)
    except ProductionError as exc:
        sys.exit(f"error: {exc}")


if __name__ == "__main__":
    main()
