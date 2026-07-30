#!/usr/bin/env python3
"""Fetch metadata (and auto-captions when available) for specific YouTube video IDs.

Used for competitor/reference study: title, channel, views, duration, upload
date, description, tags, and the transcript text so format/pacing can be
analyzed. Writes one JSON per video plus a combined markdown summary.
"""

import argparse
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path


def fetch(video_id, want_captions=True):
    from yt_dlp import YoutubeDL

    opts = {
        "quiet": True,
        "no_warnings": True,
        "skip_download": True,
        "writesubtitles": False,
        "writeautomaticsub": False,
    }
    with YoutubeDL(opts) as ydl:
        info = ydl.extract_info(f"https://www.youtube.com/watch?v={video_id}",
                                download=False)

    data = {
        "id": info.get("id"),
        "title": info.get("title"),
        "channel": info.get("channel") or info.get("uploader"),
        "channel_url": info.get("channel_url"),
        "views": info.get("view_count"),
        "likes": info.get("like_count"),
        "upload_date": info.get("upload_date"),
        "duration_seconds": info.get("duration"),
        "description": info.get("description"),
        "tags": info.get("tags"),
        "categories": info.get("categories"),
        "chapters": [c.get("title") for c in (info.get("chapters") or [])],
    }

    if want_captions:
        data["transcript"] = extract_transcript(info)
    return data


def extract_transcript(info):
    """Pull English auto-caption text from the json3 track if present."""
    import urllib.request

    tracks = {}
    tracks.update(info.get("automatic_captions") or {})
    tracks.update(info.get("subtitles") or {})  # manual subs win
    key = next((k for k in ("en", "en-US", "en-GB") if k in tracks), None)
    if not key:
        return None
    fmt = next((f for f in tracks[key] if f.get("ext") == "json3"), None)
    if not fmt:
        return None
    try:
        raw = urllib.request.urlopen(fmt["url"], timeout=60).read()
        events = json.loads(raw).get("events") or []
    except Exception as e:
        return f"[caption fetch failed: {e}]"

    lines = []
    for ev in events:
        seg = "".join(s.get("utf8", "") for s in (ev.get("segs") or []))
        seg = seg.replace("\n", " ").strip()
        if seg:
            lines.append(seg)
    text = re.sub(r"\s+", " ", " ".join(lines)).strip()
    return text or None


def fmt_duration(seconds):
    if not seconds:
        return "?"
    seconds = int(seconds)
    return f"{seconds // 60}:{seconds % 60:02d}"


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--ids", required=True,
                   help="comma-separated YouTube video IDs")
    p.add_argument("--out-dir", default="data/reference-videos")
    args = p.parse_args()

    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    results = []
    for vid in [v.strip() for v in args.ids.split(",") if v.strip()]:
        print(f"=== fetching {vid}", flush=True)
        try:
            data = fetch(vid)
        except Exception as e:
            print(f"[warn] {vid} failed: {e}", file=sys.stderr)
            data = {"id": vid, "error": str(e)}
        results.append(data)
        (out_dir / f"{vid}.json").write_text(json.dumps(data, indent=2))

    lines = [f"# Reference videos (fetched {datetime.now(timezone.utc):%Y-%m-%d})", ""]
    for r in results:
        if r.get("error"):
            lines += [f"## {r['id']} — FAILED", "", f"`{r['error']}`", ""]
            continue
        views = f"{r['views']:,}" if r.get("views") else "?"
        lines += [
            f"## {r.get('title')}",
            "",
            f"- Channel: **{r.get('channel')}** ({r.get('channel_url')})",
            f"- Views: {views} · Likes: {r.get('likes') or '?'}",
            f"- Uploaded: {r.get('upload_date')} · Duration: {fmt_duration(r.get('duration_seconds'))}",
            f"- Tags: {', '.join((r.get('tags') or [])[:25]) or 'none'}",
            f"- Transcript chars: {len(r.get('transcript') or '')}",
            "",
        ]
    (out_dir / "summary.md").write_text("\n".join(lines) + "\n")
    print("\n".join(lines))


if __name__ == "__main__":
    main()
