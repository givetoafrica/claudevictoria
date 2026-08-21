# Gathos scripts

Wraps the [Gathos](https://gathos.com) media-generation API. Runs from
GitHub Actions (`.github/workflows/gathos-generate-video.yml` and
`gathos-generate-image.yml`), which have normal outbound internet access,
unlike some sandboxed dev environments.

## One-time setup

Add these as **repository secrets** (Settings -> Secrets and variables ->
Actions -> New repository secret) — never commit them or paste them into
chat/issues:

- `GATHOS_VIDEO_KEY` (`vid_live_...`) — required for video generation
- `GATHOS_IMAGE_KEY` (`img_live_...`) — required for image generation
- `GATHOS_API_URL` — optional, only if you're pointing at a non-default
  Gathos host

## Running

From the repo's **Actions** tab, pick a workflow and click **Run workflow**:

- **Gathos - Generate Video** — inputs: `prompt`, `duration_seconds`
  (default 60), `style` (optional), `generate_audio`. Splits anything
  over ~20s into multiple clips (Gathos caps a single clip at ~513
  frames, ~21s at 24fps) generated from the same prompt and concatenates
  them with ffmpeg. Each clip is generated independently, so motion isn't
  perfectly continuous across clip boundaries.
- **Gathos - Generate Image** — input: `prompt`.

Output is uploaded as a workflow artifact (`gathos-video` / `gathos-image`)
on the run's summary page, kept for 14 days.

## Local use

The scripts also run locally/anywhere with network access to
`gathos.com` and the relevant env var(s) set:

```
GATHOS_VIDEO_KEY=vid_live_... python scripts/gathos_generate_video.py \
  --prompt "A young boy running after his mom in a sunny park" \
  --duration 60 --style Cinematic --out output.mp4
```

## Status

Video generation (`gathos_client.py`'s `generate_video`) is implemented
against Gathos's confirmed published API spec. Image generation, TTS, and
image-to-image are only partially confirmed (only `{"prompt": ...}` is
documented) — see the module docstring in `gathos_client.py`. If a call
fails, `GathosError` prints the full raw response so a wrong field-name
guess is a one-line fix, not a mystery.

# Competitor tracker

`competitor_tracker.py` snapshots the ambience/ASMR competitors listed in
`channels/african-natural-ambience/competitors.json` via the YouTube Data
API v3, and flags **outliers** — videos beating their own channel's median
view count by 3x or more. Raw views tell you a channel is big; the
multiplier against its own median tells you a specific hook or format broke
out, which is the part worth copying.

## Setup

Add one repository secret:

- `YOUTUBE_API_KEY` — free from console.cloud.google.com (enable "YouTube
  Data API v3", then create an API key)

Quota cost is a few units per channel per run against a default daily quota
of 10,000, so the weekly schedule is nowhere near the limit.

## Running

Runs automatically Mondays at 07:00 UTC, or from the **Actions** tab via
**Competitor Tracker → Run workflow**. Each run writes two files into
`channels/african-natural-ambience/tracking/` — a full JSON snapshot and a
readable markdown report — commits them, and also uploads them as a
workflow artifact (90 days).

Locally, with the key set:

```
YOUTUBE_API_KEY=... python scripts/competitor_tracker.py \
    --config channels/african-natural-ambience/competitors.json \
    --out channels/african-natural-ambience/tracking
```

Note that this needs outbound access to `googleapis.com`, which some
sandboxed dev environments block — the GitHub Actions runner does not.
