---
name: explainer-video
description: Make a long, fun animated explainer video (narrated, step-by-step diagrams and kinetic type, with a host character) from a script, using the explainer-system in this repo. Use for Nonprofitsdaily long videos, IT training, how-tos and any "turn this script into a video" request. Not for Pictory.
---

# Explainer video

The system lives in `explainer-system/` (read its README.md for the script format and scene types). A video is
`explainer-system/videos/<name>/script.json` plus one narration mp3 per scene. Never use Pictory: we make video here.

## Workflow

1. **Script.** Turn the user's script into `script.json`: one scene per beat, a `type` for each (kinetic for the opening, big stat,
   quiz and rule; diagrams (`steps`, `flow`, `compare`) for step-by-step material), the exact `voiceover` text, and `at` phrases (words
   the narrator says) for every on-screen element. Pick a `theme` (`nonprofitsdaily` for the Nonprofitsdaily brand, `fun` otherwise).
   Do not add scenes the user removed, and keep their wording.
2. **Facts.** Verify thresholds, dates and claims against the official source before narrating (tax/legal: IRS.gov). Flag anything
   you could not verify.
3. **Narration.** One ElevenLabs clip per scene (`creative_generate_speech`, one generation each, same voice for the whole video).
   Estimate or state the cost. Poll `creative_get_flow_run_status`, download each `content_url` with curl into
   `videos/<name>/narration/<scene-id>.mp3` (quiz-style scenes: `<id>-1.mp3`, `<id>-2.mp3`). Download into a directory you `cd` into first.
4. **Build.** From `explainer-system/`: `node prep.js <name>`, `node song.js` (check `-14 LUFS`, not `-Infinity`), then render stills with
   `node engine/render.js stills <times>` and LOOK at them (every scene, late in the scene so all reveals are visible). Fix overlaps and
   contrast, then `node engine/render.js video` in the background (about 5 fps), `mux`, `check`.
5. **Environment.** Chromium here runs as root: set `CHROME_PATH` to a wrapper script that execs `/opt/pw-browsers/chromium --no-sandbox "$@"`
   (`build.sh` does this). Any outbound host that is blocked needs the user to allow it in the environment's network settings.
6. **Deliver.** Make a compressed copy under 30 MB for sharing (`ffmpeg -crf 27 -c:a aac -b:a 128k -movflags +faststart`). Report length,
   cost (narration only), what was verified, and what is still unproven. Do not commit large MP4s or `out/`.

## Nonprofitsdaily rules

Brand: plum #3B0B45, ivory #FAF7F2, violet #6C1FE0, gold #E8B547, lavender #D9C8F5; Georgia headlines, Arial body. Intro as "Victoria Philips of
Philips Nonprofit Consulting" (never "founder"). No Give to Africa content. Close with "Subscribe to my YouTube channel for more nonprofit tips."
Examples with invented numbers are labelled as such on screen.
