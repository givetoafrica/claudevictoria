#!/usr/bin/env python3
"""Fetch recent uploads for a YouTube channel: title, views, upload date, duration.

Primary source is yt-dlp (no API key needed). If YouTube blocks the runner,
falls back to the channel RSS feed (latest ~15 videos only).

Writes a JSON dump of all videos found in the window plus a Markdown table
of the top-N most-viewed videos uploaded in the last N months.
"""

import argparse
import json
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone


def fetch_via_ytdlp(channel_url, max_scan):
    from yt_dlp import YoutubeDL

    opts = {
        "quiet": True,
        "no_warnings": True,
        "extract_flat": True,
        "playlistend": max_scan,
        "extractor_args": {"youtubetab": {"approximate_date": ["timestamp"]}},
    }
    url = channel_url.rstrip("/") + "/videos"
    with YoutubeDL(opts) as ydl:
        info = ydl.extract_info(url, download=False)

    videos = []
    for e in info.get("entries") or []:
        if not e:
            continue
        ts = e.get("timestamp")
        videos.append(
            {
                "id": e.get("id"),
                "title": e.get("title"),
                "views": e.get("view_count"),
                "uploaded": datetime.fromtimestamp(ts, tz=timezone.utc).strftime("%Y-%m-%d")
                if ts
                else None,
                "duration_seconds": e.get("duration"),
                "url": f"https://www.youtube.com/watch?v={e.get('id')}",
            }
        )
    return videos


def fetch_via_rss(channel_url):
    # Resolve the channel page to find the UC id, then read the RSS feed.
    req = urllib.request.Request(channel_url, headers={"User-Agent": "Mozilla/5.0"})
    html = urllib.request.urlopen(req, timeout=30).read().decode("utf-8", "replace")
    m = re.search(r'"channelId":"(UC[\w-]+)"', html) or re.search(r"channel_id=(UC[\w-]+)", html)
    if not m:
        raise RuntimeError("could not resolve channel id for RSS fallback")
    feed_url = f"https://www.youtube.com/feeds/videos.xml?channel_id={m.group(1)}"
    req = urllib.request.Request(feed_url, headers={"User-Agent": "Mozilla/5.0"})
    xml = urllib.request.urlopen(req, timeout=30).read()
    ns = {
        "a": "http://www.w3.org/2005/Atom",
        "m": "http://search.yahoo.com/mrss/",
        "yt": "http://www.youtube.com/xml/schemas/2015",
    }
    videos = []
    for entry in ET.fromstring(xml).findall("a:entry", ns):
        vid = entry.findtext("yt:videoId", None, ns)
        stats = entry.find(".//m:community/m:statistics", ns)
        published = entry.findtext("a:published", None, ns)
        videos.append(
            {
                "id": vid,
                "title": entry.findtext("a:title", None, ns),
                "views": int(stats.get("views")) if stats is not None else None,
                "uploaded": published[:10] if published else None,
                "duration_seconds": None,
                "url": f"https://www.youtube.com/watch?v={vid}",
            }
        )
    return videos


def fmt_duration(seconds):
    if not seconds:
        return ""
    seconds = int(seconds)
    return f"{seconds // 60}:{seconds % 60:02d}"


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--channel", default="https://www.youtube.com/@AumSum")
    p.add_argument("--months", type=int, default=6)
    p.add_argument("--top", type=int, default=40)
    p.add_argument("--max-scan", type=int, default=120)
    p.add_argument("--out-json", default="data/channel_videos.json")
    p.add_argument("--out-md", default="data/channel_videos.md")
    args = p.parse_args()

    source = "yt-dlp"
    try:
        videos = fetch_via_ytdlp(args.channel, args.max_scan)
    except Exception as e:
        print(f"yt-dlp failed ({e}); falling back to RSS", file=sys.stderr)
        source = "rss"
        videos = fetch_via_rss(args.channel)

    cutoff = (datetime.now(timezone.utc) - timedelta(days=args.months * 30)).strftime("%Y-%m-%d")
    in_window = [v for v in videos if v["uploaded"] is None or v["uploaded"] >= cutoff]
    ranked = sorted(in_window, key=lambda v: v["views"] or 0, reverse=True)[: args.top]

    result = {
        "channel": args.channel,
        "fetched_at": datetime.now(timezone.utc).isoformat(),
        "source": source,
        "months": args.months,
        "cutoff_date": cutoff,
        "videos_scanned": len(videos),
        "videos_in_window": len(in_window),
        "top_videos": ranked,
    }

    with open(args.out_json, "w") as f:
        json.dump(result, f, indent=2)

    lines = [
        f"# Top {len(ranked)} videos — {args.channel} (last {args.months} months)",
        "",
        f"Source: {source}. Scanned {len(videos)} uploads, {len(in_window)} within window (cutoff {cutoff}).",
        "",
        "| # | Title | Views | Uploaded | Duration |",
        "|---|-------|-------|----------|----------|",
    ]
    for i, v in enumerate(ranked, 1):
        views = f"{v['views']:,}" if v["views"] is not None else "?"
        lines.append(
            f"| {i} | [{v['title']}]({v['url']}) | {views} | {v['uploaded'] or '?'} | {fmt_duration(v['duration_seconds'])} |"
        )
    with open(args.out_md, "w") as f:
        f.write("\n".join(lines) + "\n")

    print(f"Wrote {len(ranked)} videos to {args.out_json} and {args.out_md} (source: {source})")


if __name__ == "__main__":
    main()
