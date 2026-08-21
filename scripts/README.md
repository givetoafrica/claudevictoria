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
`channels/african-natural-ambience/competitors.json` and flags **outliers**
— videos beating their own channel's median view count by 3x or more. Raw
views tell you a channel is big; the multiplier against its own median tells
you a specific hook or format broke out, which is the part worth copying.

Data comes from `yt-dlp`, the same source as `fetch_channel_videos.py`, so
there is **no API key and no quota to manage**. Two caveats show up in every
report: flat-extraction upload dates are approximate, and subscriber counts
are rounded the way YouTube displays them.

## Running

Runs Mondays at 07:00 UTC, on pushes that touch the tracker itself, and on
demand from the **Actions** tab via **Competitor Tracker → Run workflow**.
(The schedule and the manual button only exist once the workflow is on
`main` — GitHub registers those from the default branch only.)

Each run writes two files into
`channels/african-natural-ambience/tracking/` — a full JSON snapshot and a
readable markdown report — commits them, and uploads them as a workflow
artifact (90 days).

Locally:

```
pip install yt-dlp
python scripts/competitor_tracker.py \
    --config channels/african-natural-ambience/competitors.json \
    --out channels/african-natural-ambience/tracking
```

Note that this needs outbound access to `youtube.com`, which some sandboxed
dev environments block — the GitHub Actions runner does not.

# Ambient video renderer

`render_ambient_video.py` turns an audio bed into a long-form black-screen
ambience video.

True black is the point: on an OLED panel a `#000000` pixel is switched
off, so the format saves the viewer's battery and avoids the blue light
that suppresses melatonin — the two reasons a sleep listener searches for
"black screen" in the first place. It is also the cheapest long-form video
that exists to make, because there are no visuals to generate and x264
spends almost no bitrate on an unchanging frame.

The audio bed is looped to fill the target duration, with a fade at the
start and end so the video never opens or closes on a click.

## Running

From the **Actions** tab, **Render Ambient Video → Run workflow**, with:

- `audio` — path to the bed in this repo (e.g. `beds/accra-rain.wav`)
- `hours` — target duration (default 8)
- `title` — optional working title, echoed in the log

The finished `.mp4` is uploaded as the `ambient-video` artifact (14 days).
Pushes that touch the renderer run a smoke test instead, rendering three
minutes from generated pink noise to prove the ffmpeg graph still works.

Locally, with ffmpeg installed:

```
python scripts/render_ambient_video.py \
    --audio beds/accra-rain.wav --hours 8 --out out/accra-rain-8h.mp4
```
