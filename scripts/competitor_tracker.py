#!/usr/bin/env python3
"""
Competitor tracker for the ambience/ASMR channel.

Snapshots each competitor channel's recent uploads and flags *outliers* --
videos that dramatically overperform that channel's own median. Raw view
count tells you a channel is big; the multiplier against its own median
tells you a specific topic, hook, or format broke out. The second one is
the signal worth copying.

Data comes from yt-dlp, matching scripts/fetch_channel_videos.py -- no API
key, no quota. Flat extraction gives title, view count, upload timestamp
and duration for a whole tab in one pass, which is everything the outlier
maths needs.

Both /videos and /shorts are read, and kept apart. A channel running both
formats has two view distributions, and a single median across them
describes neither -- which is how a Shorts-driven channel first reads as a
channel with two uploads.

Two caveats worth knowing when reading a report:
  - Flat-extraction upload timestamps are approximate (yt-dlp derives them
    from YouTube's relative "3 weeks ago" labels), so age-based figures are
    directional, not exact.
  - Subscriber counts are as YouTube displays them, i.e. rounded.

Usage:
    python scripts/competitor_tracker.py \
        --config channels/african-natural-ambience/competitors.json \
        --out channels/african-natural-ambience/tracking
"""

import argparse
import json
import os
import statistics
import sys
from datetime import datetime, timezone

# A video is called an outlier when it beats its own channel's median view
# count by this factor. 3x is deliberately conservative -- it filters out
# ordinary variance and leaves things that actually broke out.
OUTLIER_MULTIPLIER = 3.0

# How many recent uploads to scan per channel. Enough for a stable median
# without pulling a decade of back catalogue.
UPLOADS_PER_CHANNEL = 60


class TrackerError(RuntimeError):
    pass


def _extract_tab(handle, tab, max_scan):
    """Read one channel tab (/videos or /shorts) via yt-dlp flat extraction."""
    try:
        from yt_dlp import YoutubeDL
        from yt_dlp.utils import DownloadError
    except ImportError as exc:
        raise TrackerError(
            "yt-dlp is not installed. Run `pip install yt-dlp` "
            "(the workflow does this automatically)."
        ) from exc

    url = f"https://www.youtube.com/@{handle}/{tab}"
    opts = {
        "quiet": True,
        "no_warnings": True,
        "extract_flat": True,
        "playlistend": max_scan,
        # Ask for timestamps rather than the relative date strings that
        # flat extraction returns by default.
        "extractor_args": {"youtubetab": {"approximate_date": ["timestamp"]}},
    }
    try:
        with YoutubeDL(opts) as ydl:
            info = ydl.extract_info(url, download=False)
    except DownloadError as exc:
        raise TrackerError(f"yt-dlp could not read @{handle}/{tab}: {exc}") from exc

    now = datetime.now(timezone.utc)
    videos = []
    for entry in info.get("entries") or []:
        if not entry:
            continue
        timestamp = entry.get("timestamp")
        uploaded = (
            datetime.fromtimestamp(timestamp, tz=timezone.utc) if timestamp else None
        )
        # A missing view count means the entry is a premiere or upcoming
        # stream. Those have no performance to measure, so they are dropped
        # rather than counted as zero, which would drag the median down.
        views = entry.get("view_count")
        if views is None:
            continue
        age_days = max((now - uploaded).days, 1) if uploaded else None
        videos.append({
            "video_id": entry.get("id"),
            "title": entry.get("title"),
            "uploaded": uploaded.strftime("%Y-%m-%d") if uploaded else None,
            "age_days": age_days,
            "views": views,
            "views_per_day": round(views / age_days, 1) if age_days else None,
            "duration_seconds": entry.get("duration") or 0,
        })

    channel = {
        "channel_id": info.get("channel_id"),
        "title": info.get("channel") or info.get("title") or handle,
        "handle": handle,
        "subscribers": info.get("channel_follower_count"),
    }
    return channel, videos


def fetch_channel(handle, max_scan=UPLOADS_PER_CHANNEL):
    """Handle -> (channel metadata, long-form videos, shorts).

    Both tabs are read, and they are kept apart rather than merged. A channel
    running both formats has two completely different view distributions, and
    averaging them produces a median that describes neither -- which is how
    Rainlit Village first read as a channel with two uploads when the
    subscriber base had in fact been built on Shorts.
    """
    clean = handle.lstrip("@").rstrip(".")
    channel, videos = _extract_tab(clean, "videos", max_scan)

    # A channel with no Shorts has no /shorts tab, which is a fact about the
    # channel rather than a failure to record.
    try:
        _, shorts = _extract_tab(clean, "shorts", max_scan)
    except TrackerError as exc:
        print(f"no readable /shorts for @{clean}: {exc}", file=sys.stderr)
        shorts = []

    return channel, videos, shorts


def analyse(channel, videos, shorts=()):
    """Attach outlier multipliers and summarise the channel's shape.

    Shorts are summarised separately and deliberately excluded from the
    long-form medians: a channel publishing both has two audiences and two
    view distributions, and one median across them describes neither.
    """
    view_counts = [v["views"] for v in videos] or [0]
    median_views = statistics.median(view_counts)

    for video in videos:
        # Guard the zero-median case: a brand-new channel where most uploads
        # still have no views would otherwise divide by zero.
        video["outlier_multiplier"] = (
            round(video["views"] / median_views, 2) if median_views else 0.0
        )
        video["is_outlier"] = (
            median_views > 0 and video["outlier_multiplier"] >= OUTLIER_MULTIPLIER
        )

    durations = [v["duration_seconds"] for v in videos] or [0]
    dated = [v for v in videos if v["age_days"] is not None]
    recent = [v for v in dated if v["age_days"] <= 30]
    # Short uploads that sit on the /videos tab, which is not the same set as
    # the /shorts tab -- hence a distinct name from the `shorts` parameter.
    brief_uploads = [
        v for v in videos if v["duration_seconds"] and v["duration_seconds"] <= 60
    ]

    record = dict(channel)
    record.update({
        "median_views_recent": median_views,
        "median_duration_seconds": statistics.median(durations),
        # None rather than 0 when no upload carried a date -- an unknown
        # cadence and a cadence of zero are very different findings.
        "uploads_last_30_days": len(recent) if dated else None,
        "shorts_share": round(len(brief_uploads) / len(videos), 2) if videos else 0.0,
        "videos_scanned": len(videos),
        "videos": sorted(videos, key=lambda v: v["views"], reverse=True),
    })

    if shorts:
        short_views = [v["views"] for v in shorts]
        short_dated = [v for v in shorts if v["age_days"] is not None]
        record["shorts"] = {
            "scanned": len(shorts),
            "median_views": statistics.median(short_views),
            "median_duration_seconds": statistics.median(
                [v["duration_seconds"] for v in shorts]),
            "published_last_30_days": (
                len([v for v in short_dated if v["age_days"] <= 30])
                if short_dated else None
            ),
            "top": sorted(shorts, key=lambda v: v["views"], reverse=True)[:5],
        }
    return record


def _fmt_duration(seconds):
    """Format a duration, distinguishing 'no data' from 'zero seconds'.

    Flat extraction of the /shorts tab returns no duration at all, and
    rendering that as "0m00s" reads as a measured fact about the videos
    rather than a gap in what YouTube handed back.
    """
    if not seconds:
        return "—"
    seconds = int(seconds)
    if seconds >= 3600:
        return f"{seconds // 3600}h{(seconds % 3600) // 60:02d}m"
    return f"{seconds // 60}m{seconds % 60:02d}s"


def _fmt_int(value):
    return f"{value:,}" if isinstance(value, (int, float)) else "?"


def render_report(snapshot):
    date = snapshot["generated_at"][:10]
    tracked = [c for c in snapshot["channels"] if "error" not in c]
    lines = [
        f"# Competitor tracking — {date}",
        "",
        "Outlier = a video beating its own channel's median view count by "
        f"{OUTLIER_MULTIPLIER}x or more. That ratio, not raw views, is what "
        "identifies a hook or format that broke out.",
        "",
        "Upload dates come from yt-dlp flat extraction and are approximate, "
        "so age-based figures are directional.",
        "",
        "## Channel shape",
        "",
        "| Channel | Subs | Scanned | Median views | Median length | Uploads/30d | Shorts share |",
        "|---|---:|---:|---:|---:|---:|---:|",
    ]
    for channel in tracked:
        lines.append(
            f"| {channel['title']} | {_fmt_int(channel['subscribers'])} "
            f"| {channel['videos_scanned']} "
            f"| {channel['median_views_recent']:,.0f} "
            f"| {_fmt_duration(channel['median_duration_seconds'])} "
            f"| {_fmt_int(channel['uploads_last_30_days'])} "
            f"| {channel['shorts_share']:.0%} |"
        )

    lines += ["", "## Outliers", ""]
    outliers = [
        (c["title"], v) for c in tracked for v in c["videos"] if v["is_outlier"]
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
            title = (video["title"] or "").replace("|", "\\|")[:80]
            per_day = video["views_per_day"]
            lines.append(
                f"| {name} | [{title}](https://youtu.be/{video['video_id']}) "
                f"| {video['views']:,} | {video['outlier_multiplier']}x "
                f"| {f'{per_day:,.0f}' if per_day else '?'} "
                f"| {_fmt_duration(video['duration_seconds'])} |"
            )

    lines += ["", "## Published in the last 7 days", ""]
    fresh = [
        (c["title"], v) for c in tracked for v in c["videos"]
        if v["age_days"] is not None and v["age_days"] <= 7
    ]
    if not fresh:
        lines.append("_Nothing published in the last 7 days._")
    else:
        for name, video in sorted(
            fresh, key=lambda pair: pair[1]["uploaded"] or "", reverse=True
        ):
            lines.append(
                f"- **{name}** — [{video['title']}](https://youtu.be/{video['video_id']}) "
                f"({video['views']:,} views in ~{video['age_days']}d, "
                f"{_fmt_duration(video['duration_seconds'])})"
            )

    with_shorts = [c for c in tracked if c.get("shorts")]
    if with_shorts:
        lines += [
            "", "## Shorts", "",
            "Kept apart from the long-form numbers above on purpose. A channel "
            "running both has two view distributions, and one median across "
            "them describes neither.",
            "",
            "YouTube's Shorts tab returns no duration and no upload date under "
            "flat extraction, so median length reads `—` and cadence reads "
            "`?`. Neither is a measurement of zero. View counts are real.",
            "",
            "| Channel | Scanned | Median views | Median length | Posted/30d |",
            "|---|---:|---:|---:|---:|",
        ]
        for channel in with_shorts:
            short = channel["shorts"]
            lines.append(
                f"| {channel['title']} | {short['scanned']} "
                f"| {short['median_views']:,.0f} "
                f"| {_fmt_duration(short['median_duration_seconds'])} "
                f"| {_fmt_int(short['published_last_30_days'])} |"
            )
        lines += ["", "### Best-performing Shorts", ""]
        for channel in with_shorts:
            for video in channel["shorts"]["top"]:
                title = (video["title"] or "").replace("|", "\\|")[:90]
                lines.append(
                    f"- **{channel['title']}** — [{title}]"
                    f"(https://youtu.be/{video['video_id']}) "
                    f"({video['views']:,} views, "
                    f"{_fmt_duration(video['duration_seconds'])})"
                )

    aliased = [c for c in tracked if c.get("also_reachable_as")]
    if aliased:
        lines += ["", "## Handles pointing at the same channel", ""]
        for channel in aliased:
            others = ", ".join(f"`@{h}`" for h in channel["also_reachable_as"])
            lines.append(
                f"- **{channel['title']}** is tracked as `@{channel['handle']}` "
                f"and is also reachable as {others} — one channel, counted "
                "once."
            )

    errors = [c for c in snapshot["channels"] if "error" in c]
    if errors:
        lines += ["", "## Could not be tracked", ""]
        for channel in errors:
            lines.append(f"- `@{channel['handle']}` — {channel['error']}")

    return "\n".join(lines) + "\n"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--config", required=True,
                        help="JSON file with a 'competitors' list of handles")
    parser.add_argument("--out", required=True, help="output directory")
    args = parser.parse_args()

    with open(args.config) as fh:
        config = json.load(fh)

    snapshot = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "outlier_multiplier": OUTLIER_MULTIPLIER,
        "channels": [],
    }

    # A channel can be reachable under more than one handle -- an old handle
    # kept alive after a rename resolves to the same channel as the new one.
    # Tracking both would double every row it appears in and, worse, count
    # its uploads twice in the recency list, so the first handle to resolve
    # wins and later aliases are recorded as aliases instead.
    seen_channel_ids = {}

    for entry in config["competitors"]:
        handle = entry["handle"]
        try:
            channel, videos, shorts = fetch_channel(handle)
            channel_id = channel.get("channel_id")
            if channel_id and channel_id in seen_channel_ids:
                first = seen_channel_ids[channel_id]
                first.setdefault("also_reachable_as", []).append(handle)
                print(f"@{handle} is the same channel as @{first['handle']} "
                      f"({channel_id}) -- recorded as an alias, not tracked "
                      f"twice", file=sys.stderr)
                continue
            record = analyse(channel, videos, shorts)
            record["tracked_because"] = entry.get("note", "")
            if channel_id:
                seen_channel_ids[channel_id] = record
            snapshot["channels"].append(record)
            print(f"tracked @{handle}: {len(videos)} uploads, "
                  f"{len(shorts)} shorts", file=sys.stderr)
        except TrackerError as exc:
            # One unreadable channel must not lose the whole run's data.
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
        raise TrackerError(
            "every channel failed — YouTube may be blocking the runner, "
            "or every handle in the config is wrong"
        )


if __name__ == "__main__":
    try:
        main()
    except TrackerError as exc:
        print(f"error: {exc}", file=sys.stderr)
        sys.exit(1)
