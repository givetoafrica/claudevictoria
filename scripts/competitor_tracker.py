#!/usr/bin/env python3
"""
Competitor tracker for the ambience/ASMR channel.

Snapshots each competitor channel's recent uploads via the YouTube Data
API v3 and flags *outliers* -- videos that dramatically overperform that
channel's own median. Raw view count tells you a channel is big; the
multiplier against its own median tells you a specific topic, hook, or
format broke out. The second one is the signal worth copying.

Requires YOUTUBE_API_KEY in the environment. Get a free key at
console.cloud.google.com (enable "YouTube Data API v3", create an API
key). Quota cost is roughly 3-5 units per channel per run, against a
default daily quota of 10,000 -- a weekly run over a handful of channels
is nowhere near the limit.

Stdlib only, so the workflow needs no pip install.

Usage:
    python scripts/competitor_tracker.py \
        --config channels/africa-natural-ambience/competitors.json \
        --out channels/africa-natural-ambience/tracking
"""

import argparse
import json
import os
import re
import statistics
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone

API_BASE = "https://www.googleapis.com/youtube/v3"

# A video is called an outlier when it beats its own channel's median view
# count by this factor. 3x is deliberately conservative -- it filters out
# ordinary variance and leaves things that actually broke out.
OUTLIER_MULTIPLIER = 3.0

# How many recent uploads to pull per channel. 50 is the API's page limit,
# and one page is enough to establish a stable median.
UPLOADS_PER_CHANNEL = 50


class TrackerError(RuntimeError):
    pass


def _get_key():
    key = os.environ.get("YOUTUBE_API_KEY")
    if not key:
        raise TrackerError(
            "YOUTUBE_API_KEY not set. Add it as a repository secret "
            "(Settings -> Secrets and variables -> Actions) so the workflow "
            "can read it, or export it locally."
        )
    return key


def _api_get(endpoint, params):
    params = dict(params)
    params["key"] = _get_key()
    url = f"{API_BASE}/{endpoint}?{urllib.parse.urlencode(params)}"
    try:
        with urllib.request.urlopen(url, timeout=30) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        raise TrackerError(f"{endpoint} failed ({exc.code}): {body}") from exc


def resolve_channel(handle):
    """Handle -> channel record. Falls back to search if forHandle misses.

    forHandle is exact and cheap but unforgiving about punctuation, and
    some of these handles carry dots. Search costs 100 quota units, so it
    is a fallback rather than the default path.
    """
    clean = handle.lstrip("@").rstrip(".")
    data = _api_get("channels", {
        "part": "snippet,statistics,contentDetails",
        "forHandle": clean,
    })
    items = data.get("items") or []
    if items:
        return items[0]

    found = _api_get("search", {
        "part": "snippet", "type": "channel", "q": clean, "maxResults": 1,
    })
    hits = found.get("items") or []
    if not hits:
        raise TrackerError(f"could not resolve handle @{handle}")
    channel_id = hits[0]["snippet"]["channelId"]
    data = _api_get("channels", {
        "part": "snippet,statistics,contentDetails", "id": channel_id,
    })
    items = data.get("items") or []
    if not items:
        raise TrackerError(f"resolved @{handle} to {channel_id} but it has no data")
    return items[0]


def _parse_duration(iso):
    """ISO-8601 duration -> seconds. YouTube only ever emits H/M/S here."""
    match = re.fullmatch(r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", iso or "")
    if not match:
        return 0
    hours, minutes, seconds = (int(g) if g else 0 for g in match.groups())
    return hours * 3600 + minutes * 60 + seconds


def fetch_uploads(channel, limit=UPLOADS_PER_CHANNEL):
    uploads_playlist = channel["contentDetails"]["relatedPlaylists"]["uploads"]
    video_ids = []
    page_token = None
    while len(video_ids) < limit:
        params = {
            "part": "contentDetails",
            "playlistId": uploads_playlist,
            "maxResults": min(50, limit - len(video_ids)),
        }
        if page_token:
            params["pageToken"] = page_token
        page = _api_get("playlistItems", params)
        for item in page.get("items", []):
            video_ids.append(item["contentDetails"]["videoId"])
        page_token = page.get("nextPageToken")
        if not page_token:
            break

    videos = []
    for start in range(0, len(video_ids), 50):
        batch = video_ids[start:start + 50]
        data = _api_get("videos", {
            "part": "snippet,statistics,contentDetails",
            "id": ",".join(batch),
        })
        for item in data.get("items", []):
            published = item["snippet"]["publishedAt"]
            age_days = max(
                (datetime.now(timezone.utc)
                 - datetime.fromisoformat(published.replace("Z", "+00:00"))).days,
                1,
            )
            views = int(item["statistics"].get("viewCount", 0))
            videos.append({
                "video_id": item["id"],
                "title": item["snippet"]["title"],
                "published_at": published,
                "age_days": age_days,
                "views": views,
                "views_per_day": round(views / age_days, 1),
                "likes": int(item["statistics"].get("likeCount", 0)),
                "comments": int(item["statistics"].get("commentCount", 0)),
                "duration_seconds": _parse_duration(
                    item["contentDetails"].get("duration")),
            })
    return videos


def analyse(channel, videos):
    """Attach outlier multipliers and summarise the channel's shape."""
    view_counts = [v["views"] for v in videos] or [0]
    median_views = statistics.median(view_counts)

    for video in videos:
        # Guard the zero-median case: a brand-new channel where most
        # uploads still have no views would otherwise divide by zero.
        video["outlier_multiplier"] = (
            round(video["views"] / median_views, 2) if median_views else 0.0
        )
        video["is_outlier"] = (
            median_views > 0 and video["outlier_multiplier"] >= OUTLIER_MULTIPLIER
        )

    durations = [v["duration_seconds"] for v in videos] or [0]
    recent = [v for v in videos if v["age_days"] <= 30]
    shorts = [v for v in videos if v["duration_seconds"] <= 60]

    return {
        "channel_id": channel["id"],
        "title": channel["snippet"]["title"],
        "handle": channel["snippet"].get("customUrl", ""),
        "description": channel["snippet"].get("description", "")[:500],
        "subscribers": int(channel["statistics"].get("subscriberCount", 0)),
        "total_views": int(channel["statistics"].get("viewCount", 0)),
        "total_videos": int(channel["statistics"].get("videoCount", 0)),
        "median_views_recent": median_views,
        "median_duration_seconds": statistics.median(durations),
        "uploads_last_30_days": len(recent),
        "shorts_share": round(len(shorts) / len(videos), 2) if videos else 0.0,
        "videos": sorted(videos, key=lambda v: v["views"], reverse=True),
    }


def _fmt_duration(seconds):
    seconds = int(seconds)
    if seconds >= 3600:
        return f"{seconds // 3600}h{(seconds % 3600) // 60:02d}m"
    return f"{seconds // 60}m{seconds % 60:02d}s"


def render_report(snapshot):
    date = snapshot["generated_at"][:10]
    lines = [
        f"# Competitor tracking — {date}",
        "",
        "Outlier = a video beating its own channel's median view count by "
        f"{OUTLIER_MULTIPLIER}x or more. That ratio, not raw views, is what "
        "identifies a hook or format that broke out.",
        "",
        "## Channel shape",
        "",
        "| Channel | Subs | Videos | Median views | Median length | Uploads/30d | Shorts share |",
        "|---|---:|---:|---:|---:|---:|---:|",
    ]
    for channel in snapshot["channels"]:
        if "error" in channel:
            continue
        lines.append(
            f"| {channel['title']} | {channel['subscribers']:,} "
            f"| {channel['total_videos']:,} | {channel['median_views_recent']:,.0f} "
            f"| {_fmt_duration(channel['median_duration_seconds'])} "
            f"| {channel['uploads_last_30_days']} "
            f"| {channel['shorts_share']:.0%} |"
        )

    lines += ["", "## Outliers", ""]
    outliers = [
        (channel["title"], video)
        for channel in snapshot["channels"] if "error" not in channel
        for video in channel["videos"] if video["is_outlier"]
    ]
    if not outliers:
        lines.append("_No video cleared the outlier threshold this run._")
    else:
        lines += [
            "| Channel | Video | Views | vs median | Views/day | Length |",
            "|---|---|---:|---:|---:|---:|",
        ]
        for name, video in sorted(
            outliers, key=lambda pair: pair[1]["outlier_multiplier"], reverse=True
        ):
            title = video["title"].replace("|", "\\|")[:80]
            lines.append(
                f"| {name} | [{title}](https://youtu.be/{video['video_id']}) "
                f"| {video['views']:,} | {video['outlier_multiplier']}x "
                f"| {video['views_per_day']:,.0f} "
                f"| {_fmt_duration(video['duration_seconds'])} |"
            )

    lines += ["", "## New since last run", ""]
    fresh = [
        (channel["title"], video)
        for channel in snapshot["channels"] if "error" not in channel
        for video in channel["videos"] if video["age_days"] <= 7
    ]
    if not fresh:
        lines.append("_Nothing published in the last 7 days._")
    else:
        for name, video in sorted(fresh, key=lambda pair: pair[1]["published_at"], reverse=True):
            lines.append(
                f"- **{name}** — [{video['title']}](https://youtu.be/{video['video_id']}) "
                f"({video['views']:,} views in {video['age_days']}d, "
                f"{_fmt_duration(video['duration_seconds'])})"
            )

    errors = [c for c in snapshot["channels"] if "error" in c]
    if errors:
        lines += ["", "## Could not be tracked", ""]
        for channel in errors:
            lines.append(f"- `{channel['handle']}` — {channel['error']}")

    return "\n".join(lines) + "\n"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--config", required=True,
                        help="JSON file with a 'competitors' list of handles")
    parser.add_argument("--out", required=True, help="output directory")
    args = parser.parse_args()

    with open(args.config) as handle:
        config = json.load(handle)

    snapshot = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "channels": [],
    }

    for entry in config["competitors"]:
        handle = entry["handle"]
        try:
            channel = resolve_channel(handle)
            videos = fetch_uploads(channel)
            record = analyse(channel, videos)
            record["tracked_because"] = entry.get("note", "")
            snapshot["channels"].append(record)
            print(f"tracked @{handle}: {len(videos)} uploads", file=sys.stderr)
        except TrackerError as exc:
            # One unresolvable handle must not lose the whole run's data.
            snapshot["channels"].append({"handle": handle, "error": str(exc)})
            print(f"FAILED @{handle}: {exc}", file=sys.stderr)

    os.makedirs(args.out, exist_ok=True)
    date = snapshot["generated_at"][:10]
    snapshot_path = os.path.join(args.out, f"snapshot-{date}.json")
    report_path = os.path.join(args.out, f"report-{date}.md")

    with open(snapshot_path, "w") as fh:
        json.dump(snapshot, fh, indent=2)
    with open(report_path, "w") as fh:
        fh.write(render_report(snapshot))

    print(f"wrote {snapshot_path}\nwrote {report_path}", file=sys.stderr)

    if all("error" in c for c in snapshot["channels"]):
        raise TrackerError("every channel failed to resolve — check YOUTUBE_API_KEY")


if __name__ == "__main__":
    try:
        main()
    except TrackerError as exc:
        print(f"error: {exc}", file=sys.stderr)
        sys.exit(1)
