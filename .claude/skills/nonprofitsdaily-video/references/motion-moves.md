# Motion vocabulary and styles

Source for the vocabulary and the four style ideas: the "Motion Graphics with Claude Code" PDF guide by Damiano Caudullo (@damianodesu), which Victoria supplied. This file paraphrases it as a checklist and does not copy its text. That guide builds videos as a web page rendered by HyperFrames; this skill uses its own engine (scripts/engine.html + render.cjs) with the same idea: the video is a page, edits are plain-language changes, rendering is a separate step.

## The 10 moves (name the move when asking for a change)
| Move | What it does | In this engine |
|---|---|---|
| Rise | fade in while moving up a little | yes: hero, pill |
| Pop | scale up from small with a small overshoot | partly (removed for calm look; easy to re-enable) |
| Count-up | a number rolls to its value | not yet |
| Checklist tick | lines get a green tick one by one | partly: list rows light up on the spoken word |
| Typewriter | text types itself | not yet |
| Slide-in | comes in from the side | yes: scene transition (small) |
| Blur-in | blurry to sharp | not yet |
| Punch-in | whole frame zooms in fast for the line to remember | not yet |
| Reframe | footage shrinks into a card and something new appears | not yet (needs footage input) |
| Bar fill | progress bar fills | not yet |

## Four styles (swap one block, keep the script)
1. **Kinetic type**: huge all-caps words on black, one accent color, words slam in on the beat.
2. **Liquid glass**: frosted white cards, soft pastel blobs, calm motion, nothing bounces.
3. **Editorial grain**: serif on paper, film grain, cut-out paper shapes, imperfect timing.
4. **Pop bold**: flat neon, chunky type, black outlines, bouncy.

The NonprofitsDaily look so far is closest to **liquid glass with a plum/gold brand**. Victoria said the first versions were "too busy" and the later calm version had the right idea, so default to calm: few moving parts, one idea per scene.

## Working rules taken from the guide
- Get a base version you like first, then change one moment at a time.
- Say the moment in words ("when I say three"), not seconds. Word timings come from the voiceover transcription.
- No graphic in the first 3 seconds when graphics go over real footage. Keep graphics off the face and out of the caption area.
- Sound effects: small clicks only (tick, counter, chime); no whooshes; keep them about 20 dB under the voice. This skill has no sound-effect files yet.
- Export: reels 1080x1920 at 30 fps; if a file is huge, raise the CRF (render.cjs uses CRF 18).
