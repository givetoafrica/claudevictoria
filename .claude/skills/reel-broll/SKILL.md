---
name: reel-broll
description: Add a persistent B-roll card above a presenter (HeyGen avatar) in a 9:16 reel. Use when the user asks for B-roll, a card over the avatar, a split-screen reel, or wants the visual to run from the first word to the end. Takes a timing spec built from the speech pauses.
---

# Reel B-roll (split layout)

Renders a 1080×1920 reel where the presenter sits in the bottom 62% and a
palette card runs across the top from the first word to the last. Each segment
of the spec sets the label, title and visual on the card.

## Inputs

1. **Presenter video**: the HeyGen raw render (1080×1920, with audio).
2. **Timing spec** (JSON), like `specs/reel1_listicle.json`:
   - `source`, `output`, `duration`
   - `segments`: each has `start`, `end`, `label`, `title`, `visual`.

## Steps

1. Find the speech pauses so the segment boundaries land between phrases:
   ```
   ffmpeg -hide_banner -i SOURCE -af "silencedetect=noise=-30dB:d=0.4" -f null - 2>&1 | grep -oE "silence_(start|end): [0-9.]+"
   ```
   Put each segment boundary in the middle of a pause. Use the script to match
   each boundary to a sentence, and check the last segment runs to the end.
2. Pick a visual for each segment (`heart`, `bubbles`, `avatars`, `network`,
   `checklist`, `number`, `bookmark`). Match the visual to the point it
   illustrates. Do not use photos of real people or programs unless the user
   supplies them.
3. Write the spec, then run:
   ```
   python3 .claude/skills/reel-broll/render_broll.py .claude/skills/reel-broll/specs/NAME.json
   ```
   About 80 seconds for a 44-second reel.
4. Check frames across the whole timeline (`ffmpeg -ss T -frames:v 1`) and
   confirm that titles fit inside the 1080 px width and text stays inside the card.
5. Send the MP4 to the user for review. Adjust the timings if a card lands off
   the phrase.

## Known limits

- Timings come from pauses in the audio, so cuts are approximate.
- Visuals are drawn shapes, not footage. Real photos or screenshots need to be
  supplied and placed as an extra visual type.
- Fonts are Liberation Sans and Liberation Serif, which stand in for Arial and
  Georgia. The Georgia title font is not installed in the container.
