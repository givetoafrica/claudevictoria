# THE COOK — a quiet cooking Short

Assets for redoing the village cooking Short so it feels **calm and relaxing,
not scary**.

- `character-reference.md` — the locked look for the cook. Generate her once
  (front, three-quarter, behind), then reuse the character block in every shot.
- `storyboard.md` — six ready-to-run shot prompts for the Gathos video workflow.

## Why this replaces the ALWAYS/NEVER block
The old prompt leaned on a rigid ALWAYS/NEVER constraint list, which read as tense
and produced a scary tone. Instead:

- **Consistency** comes from one locked character block, prepended to every shot.
- **Calm tone** comes from a shared mood block on every shot — soft daylight, warm
  firelight, gentle rain, slow camera, and no eerie/horror cues.

## How to generate
Run the **Gathos - Generate Video** GitHub Action
(`.github/workflows/gathos-generate-video.yml`) once per shot, pasting that
shot's prompt from `storyboard.md` into the `prompt` input. Keep the style calm
and let each clip breathe.
