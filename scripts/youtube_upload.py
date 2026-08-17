#!/usr/bin/env python3
"""
Upload a finished MP4 to a YouTube channel via the YouTube Data API v3.

Pictory renders the video but does not publish it, so this is the last leg of
the pipeline. It authenticates with a long-lived refresh token, which means it
runs unattended in CI -- no browser prompt at upload time.

Reads from the environment (set these as GitHub Actions secrets):
  YOUTUBE_CLIENT_ID
  YOUTUBE_CLIENT_SECRET
  YOUTUBE_REFRESH_TOKEN

See PICTORY.md for how to mint the refresh token once, locally.

Defaults to `private` visibility on purpose: review the render before it goes
public. Pass --privacy public (or unlisted) to change that.

Usage:
  python scripts/youtube_upload.py --file output.mp4 \
      --title "Clean Water Update" --description-file desc.txt \
      --tags "nonprofit,clean water" --privacy private
"""

import argparse
import os
import sys

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

TOKEN_URI = "https://oauth2.googleapis.com/token"
SCOPES = ["https://www.googleapis.com/auth/youtube.upload"]

# 27 = Education, 29 = Nonprofits & Activism. See the YouTube videoCategories
# list for the rest; availability varies by region.
DEFAULT_CATEGORY_ID = "29"


def require_env(name: str) -> str:
    value = os.environ.get(name)
    if not value:
        print(f"Missing {name}. Set it as an environment variable or GitHub "
              f"Actions secret -- never hardcode it.", file=sys.stderr)
        sys.exit(1)
    return value


def credentials() -> Credentials:
    creds = Credentials(
        token=None,
        refresh_token=require_env("YOUTUBE_REFRESH_TOKEN"),
        client_id=require_env("YOUTUBE_CLIENT_ID"),
        client_secret=require_env("YOUTUBE_CLIENT_SECRET"),
        token_uri=TOKEN_URI,
        scopes=SCOPES,
    )
    creds.refresh(Request())
    return creds


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--file", required=True, help="Path to the MP4 to upload")
    parser.add_argument("--title", required=True)
    parser.add_argument("--description", default="")
    parser.add_argument("--description-file", default="",
                        help="Read the description from this file instead")
    parser.add_argument("--tags", default="", help="Comma-separated")
    parser.add_argument("--privacy", default="private",
                        choices=["private", "unlisted", "public"])
    parser.add_argument("--category-id", default=DEFAULT_CATEGORY_ID)
    parser.add_argument("--made-for-kids", action="store_true")
    args = parser.parse_args()

    if not os.path.isfile(args.file):
        print(f"No such file: {args.file}", file=sys.stderr)
        sys.exit(1)

    description = args.description
    if args.description_file:
        with open(args.description_file, "r", encoding="utf-8") as f:
            description = f.read()

    tags = [t.strip() for t in args.tags.split(",") if t.strip()]

    youtube = build("youtube", "v3", credentials=credentials())
    request = youtube.videos().insert(
        part="snippet,status",
        body={
            "snippet": {
                "title": args.title,
                "description": description,
                "tags": tags,
                "categoryId": args.category_id,
            },
            "status": {
                "privacyStatus": args.privacy,
                "selfDeclaredMadeForKids": args.made_for_kids,
            },
        },
        media_body=MediaFileUpload(args.file, chunksize=-1, resumable=True),
    )

    response = None
    while response is None:
        status, response = request.next_chunk()
        if status:
            print(f"[youtube] uploaded {int(status.progress() * 100)}%")

    video_id = response["id"]
    print(f"[youtube] done: https://www.youtube.com/watch?v={video_id}")
    print(f"[youtube] visibility: {args.privacy}")


if __name__ == "__main__":
    main()
