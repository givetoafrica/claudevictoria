# Pictory → YouTube pipeline

Turns a narration script into a finished video via the Pictory API and
optionally publishes it to a YouTube channel.

## The thing to know first

**Your `app.pictory.ai` subscription and Pictory API access are two different
products.** A Starter / Professional / Teams membership logs you into the web
app; it does not come with API credentials. The API is sold separately (a
self-serve API tier, or enterprise), and the `client_id` / `client_secret` pair
is issued by Pictory — you request it from them, you don't generate it in the
app's settings.

So before any of this code runs, someone has to get those credentials. Until
then, the app itself is still fully usable by hand, and everything below in
"Route 3" works without touching code.

## Three ways to drive Pictory

**Route 1 — MCP server (least work, if you have API credentials).**
Pictory publishes an MCP server (`@pictory/pictory-mcp-server` on npm) exposing
tools like `create-storyboard`, `poll-storyboard-job-status`,
`get-storyboard-preview`, `render-video`, and `get-rendered-video-url`. Point
Claude Code or Claude Desktop at it and you can ask for a video in plain
language; the client chains the tools itself. Needs the same `client_id` /
`client_secret` as the REST API.

**Route 2 — REST API (what this directory implements).** Scriptable,
repeatable, runs in CI. Use it when you want the same video format produced on
a schedule, or a batch of videos from a spreadsheet of scripts.

**Route 3 — no code at all.** Pictory has Zapier and Make connectors, and the
web app does script-to-video, article-to-video, video-to-shorts, and
transcript-based editing directly. For a handful of videos a month this is
genuinely the right answer, and it costs nothing beyond the membership you
already have.

## Setup for Route 2

Add these as **repository secrets** (Settings → Secrets and variables →
Actions → New repository secret). Never commit them or paste them into
chat, issues, or PR descriptions:

| Secret | Needed for | Notes |
| --- | --- | --- |
| `PICTORY_CLIENT_ID` | Pictory | Issued by Pictory, not self-serve in the app |
| `PICTORY_CLIENT_SECRET` | Pictory | " |
| `PICTORY_USER_ID` | Pictory | Sent as the `X-Pictory-User-Id` header |
| `PICTORY_API_URL` | optional | Only to point at a non-default host |
| `YOUTUBE_CLIENT_ID` | publishing | Google Cloud OAuth client (Desktop app) |
| `YOUTUBE_CLIENT_SECRET` | publishing | " |
| `YOUTUBE_REFRESH_TOKEN` | publishing | Minted once locally, see below |

### Minting the YouTube refresh token

One-time, on your own machine — it needs a browser, which CI doesn't have.

1. In [Google Cloud Console](https://console.cloud.google.com/), create a
   project, enable **YouTube Data API v3**, and create an **OAuth client ID**
   of type *Desktop app*. Save the client ID and secret.
2. Add your Google account as a test user on the OAuth consent screen (or
   publish the app) so consent doesn't fail.
3. Run a one-off local flow with scope
   `https://www.googleapis.com/auth/youtube.upload`, sign in **as the account
   that owns the channel**, and copy the `refresh_token` out of the result.
4. Store all three values as repository secrets.

The default upload quota is 6 uploads/day worth of API cost — fine for a
nonprofit channel, worth knowing before you plan a bulk backfill.

## Running it

From the repo's **Actions** tab → **Pictory - Generate Video** → *Run workflow*:

- `video_name` — also the YouTube title unless you change it after upload.
- `script_path` *or* `script_text` — the narration. **Separate scenes with a
  blank line.** One paragraph = one scene = one visual. Paste the whole thing
  as a single block and you get one visual for the entire video, which looks
  exactly as flat as it sounds. Use `script_path` for anything long; workflow
  inputs are size-limited.
- `voice` — a Pictory AI voice name, as listed in the app.
- `dry_run` — prints the request body and stops. **Use this first.** It spends
  no Pictory credits, and it's how you check your scene splits before paying
  for a render.
- `publish_to_youtube` + `youtube_privacy` — uploads the render. Defaults to
  `private` deliberately; watch it before it goes public.

The MP4 is attached to the run summary as the `pictory-video` artifact for
14 days either way.

Locally, with the env vars set:

```
python scripts/pictory_make_video.py --script-file script.txt \
  --name "Clean Water Update" --voice Jackson --dry-run
```

## Status / honesty notes

Confirmed against Pictory's published docs:

- Base host `https://api.pictory.ai/pictoryapis`.
- Auth is `POST /v1/oauth2/token` with `client_id` + `client_secret`, returning
  a token that expires in ~1 hour. `pictory_client.py` refreshes it
  automatically so a long render doesn't die mid-poll.
- Every other call needs **both** an `Authorization` header carrying the raw
  token (**no** `Bearer ` prefix — this trips people up) and an
  `X-Pictory-User-Id` header.
- Video creation is two async phases — storyboard, then render — each
  returning a job id you poll at `GET /v1/jobs/{jobId}`. Poll every 10–30s;
  faster gets you rate-limited.

Not yet verified against a live account: the exact JSON key names inside job
payloads (`renderParams`, `videoURL`, and friends) and the precise storyboard
body schema. This code has never been run against the real API — the
development sandbox blocks outbound traffic to `pictory.ai`, and no
credentials existed at the time it was written.

That's handled the same way `gathos_client.py` handles it: every extraction
goes through a candidate-key list and raises `PictoryError` with the **full
raw response** when nothing matches. So the first real run either works or
tells you exactly which key name to add to which list — a one-line fix, not a
debugging session. Expect to make one or two of those on the first run.
