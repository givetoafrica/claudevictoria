# 2D animation (mascot Sunny, plus the manual cartoon-from-clip workflow)

**Built in (v1):** `hero.kind: "cartoon"` and `avatarMode: "cartoon"` in scripts/engine.html draw **Sunny**, a generic gold-sun mascot in the brand colors: lip sync from word timings, blinks, brow lift on `react`, sway and hands. No photo of Victoria is used or stored. Tune the look in plain words (bigger eyes, different colors, a hat for a holiday episode).

Avatar rule (Victoria, Oct 2026): she does not want her own likeness used. The mascot appears in **long videos only** (corner avatar or full scene). Reels and shorts never show an avatar or the mascot; the engine blocks it.

## Two ways to get 2D
**A. Claude Design, then Claude Animation (manual, Victoria does this in her own account).** Victoria's notes describe: open Claude Design, choose Claude Animation, upload the raw clip, paste the universal prompt below, add changes, generate, review. I cannot operate that product from here and have not tested it. Tip from her notes: check audio timing, lip sync, character consistency and any text or logos that should stay.

Only use a clip she supplies and has rights to. Do not run another person's clip through it without permission. This route is optional; the built-in mascot is the default.

Universal prompt (from her notes, trimmed for 9:16 reaction clips; edit as needed):
> Turn this raw clip into a full 2D cartoon animation. Preserve the original audio as closely as the tool allows, including every word and its timing. Rebuild the visuals as animation. Flat 2D vector cartoon: thick dark outlines, solid colour fills, minimal shading, simple puppet-rig characters with big round expressive eyes. Keep the character's hairstyle, skin tone, glasses, outfit colours and accessories consistent in every shot. Sync the mouth to the voice; keep it closed when not speaking; add natural blinks and idle movement. Remove subtitles. Keep logos and scene text that are physically present. Match the original pacing and keep the same duration. Do not create a separate character sheet or stop for approval.

Fix-up lines that were in her notes: improve lip sync; keep faces, hairstyles, clothing and colours consistent; preserve dialogue and timing and do not rewrite any spoken words; remove subtitles but keep signs and logos; match pacing and shot changes more closely.

**B. Code-drawn 2D (inside Claude).** The `animation-studio` skill draws every frame in code and can output 9:16 or 16:9 MP4. Good for short cartoon cut-ins. Not tested here.

## Putting the 2D avatar into a long video
1. The mascot is drawn in code, so no clip is needed. Set `react` on a scene ("Wow!", "Aha!") and she reacts with her brows, hands and a speech bubble.
2. For a different character, replace `toonSVG()` in scripts/engine.html (keep the ids: mouth, brows, head, hands, eyes) and the rest keeps working.

## Not established
- Whether Claude Animation accepts the brand colors, or exports with a transparent background.
- Lip sync quality on a 15 to 20 second clip. Test on one clip before using it in a series.
