# 2D animation (cartoon Victoria)

**Built in (v1):** `hero.kind: "cartoon"` and `avatarMode: "cartoon"` in scripts/engine.html draw a flat vector Victoria (outfit `blue`, `green` or `plum`) with lip sync from word timings, blinks, brow lift on `react`, head sway and hands. Reference photos: assets/victoria/ (in the packaged skill only). Tune the look by asking in plain words (bigger eyes, different hair, other outfit colors).

Avatar rule (Victoria, Oct 2026): the avatar appears in **long YouTube videos only**, not in reels or shorts.

## Two ways to get 2D
**A. Claude Design, then Claude Animation (manual, Victoria does this in her own account).** Victoria's notes describe: open Claude Design, choose Claude Animation, upload the raw clip, paste the universal prompt below, add changes, generate, review. I cannot operate that product from here and have not tested it. Tip from her notes: check audio timing, lip sync, character consistency and any text or logos that should stay.

Use her own talking clip (the HeyGen talking avatar or a real recording). Her rights to her own likeness are clear. Do not run another person's clip through it without permission.

Universal prompt (from her notes, trimmed for 9:16 reaction clips; edit as needed):
> Turn this raw clip into a full 2D cartoon animation. Preserve the original audio as closely as the tool allows, including every word and its timing. Rebuild the visuals as animation. Flat 2D vector cartoon: thick dark outlines, solid colour fills, minimal shading, simple puppet-rig characters with big round expressive eyes. Keep the character's hairstyle, skin tone, glasses, outfit colours and accessories consistent in every shot. Sync the mouth to the voice; keep it closed when not speaking; add natural blinks and idle movement. Remove subtitles. Keep logos and scene text that are physically present. Match the original pacing and keep the same duration. Do not create a separate character sheet or stop for approval.

Fix-up lines that were in her notes: improve lip sync; keep faces, hairstyles, clothing and colours consistent; preserve dialogue and timing and do not rewrite any spoken words; remove subtitles but keep signs and logos; match pacing and shot changes more closely.

**B. Code-drawn 2D (inside Claude).** The `animation-studio` skill draws every frame in code and can output 9:16 or 16:9 MP4. Good for short cartoon cut-ins. Not verified for matching Victoria's likeness.

## Putting the 2D avatar into a long video
1. Get a short transparent or plain-background clip of the cartoon Victoria reacting (a few seconds each: surprised, nodding, pointing).
2. Overlay it bottom-right in a gold ring at about 22% of the frame height during the matching scenes (engine slot `#av`; photo version works now, clip version not built yet).
3. Reaction words ("Wow!", "Aha!") come from the scene's `react` field.

## Not established
- Whether Claude Animation accepts the brand colors, or exports with a transparent background.
- Lip sync quality on a 15 to 20 second clip. Test on one clip before using it in a series.
