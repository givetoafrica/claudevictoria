# Survival Untold: hand-off note (written Sun Nov 8, 2026)

## What this is
Victoria runs the YouTube Shorts channel **Survival Untold** (@survivaluntoldtv) and schedules through **RobinReach**.
This session built the comedy series **GENIUSES GONE MAD**: Scout (deadpan interviewer, red top, yellow SU microphone) interviews a famous genius who goes into an extreme "yap" rant and uses the signature insult **MAGNIFICENT MORON**.
Scripts she approves are LOCKED: never reword, keep every "MORON". Scout stays the interviewer in every episode.

## Episodes and schedule (all 9:00 AM PT, label "Shorts lane")
| Ep | Video | Style | Status |
|---|---|---|---|
| 1 | Edison ("We Asked Thomas Edison ONE Question") | Vox | Scheduled Tue Nov 10, RobinReach post 1152789 |
| 2 | Tesla roasts Edison | Vox | Scheduled Thu Nov 12, post 1152842 |
| 3 | Franklin gives an interview from his driving car | Vox | LIVE Nov 8: https://www.youtube.com/watch?v=7PUWIomjmKY (add to playlist by hand) |
| 4 | Wright brothers lose it on a plane | Vox | Scheduled Sat Nov 14, post 1154176 (Victoria rated the cabin setting about 65%) |
| 5 | John McCarthy meets AI | Paper cutout | Scheduled Sun Nov 15, post 1154901 |
Other scheduled "Thank These Men" posts (not in the series): School Mon Nov 9, Singles Day Wed Nov 11, Electricity Fri Nov 13.
Episodes 1, 2, 4 and 5 are in the playlist `GENIUSES GONE MAD”` (id PLROprNOc1jDA; it has a stray closing quote in its name). Ep3 is not, because RobinReach cannot edit a published post.
Victoria already moved the posting time up from 10:00 to 9:00 AM PT (inside the best block in her own data, 9:00-12:00 PT).

## Key ids
- RobinReach brand: `815cca97e74ff1e1` ("money making videos"), YouTube profile **Survival Untold** = `24585`. Do not use the other brands.
- ElevenLabs flow used for all voices: `agcFBHyvFVAqJUPIwjmH`.
- ElevenLabs voices: Scout `013RUoHuuxLHdDYBqZol`; Franklin `R83oOrMWOfRld3y7P2wj`; Tesla `dG7SBJDxDoZkQUrwvqrD`; Orville `JS8l7lQwh35gDnA8DTXd`; Wilbur `5OSluWlAJntR1KG2pWaB`; McCarthy `SDARFhQygpPvpLh7Ad1B`; Robots `VukfMVtvHInVUWoMNPiQ`.
- PR: draft PR #12 on branch `claude/funny-franklin-wo36bb` (rules, episode log and this note).

## House rules (full list in VIDEO-RULES.md)
- Vertical 9:16, under 60 seconds, ends with a physical gag plus a hook or question.
- Guest voice about 1.15-1.25x at most (1.5x was too fast). Background sound very quiet; sound effects under the voices.
- A different setting every episode, at least 4 visible cuts, hidden yellow rubber duck in every setting (never acknowledged), clean screen (captions plus at most one other graphic), AI disclosure on screen.
- NO WALKING. Victoria found walk cycles awkward. Hide legs with foreground objects (seat backs, counters, tables) or use a vehicle; change location with cuts and whip pans.
- Moving vehicles beat static interiors (the driving episode was loved; the plane cabin scored about 65%).
- House styles (Victoria's correction): BOTH **Vox animation** (flat vector) AND **paper cutout** (wobbling edges redrawn each frame, about 12 fps stepped motion, flapping mouths, cardboard tint) are house styles. Use either, and compare their analytics. Claymation was tested and rejected.
- Packaging: title, description with an accuracy note (one real fact), hashtags, pinned comment carrying the meta description ("Did you spot the duck? ..."), thumbnail text per brief. Each description ends "AI-generated fictional comedy inspired by real historical figures."

## How the videos are made (all code, no AI video generator)
Everything is in `survival-untold/pipeline/`.
1. Voices: ElevenLabs `creative_generate_speech` (model `eleven_v4`, one line per call with an emotion tag), downloaded as mp3 into `pipeline/voices/<episode>/`. Signed URLs expire after a few hours, so the mp3 files saved here are the only copy.
2. Audio: `build/audio_<ep>.py` trims silence, applies per-speaker tempo, builds `timeline.json` (clip start times and loudness for lip sync). `build/mix_<ep>.py` adds quiet sound effects and writes `audio.mp3`.
3. Picture: SVG scenes driven by JavaScript (`head.js`, `mid_a.js`, `ep3_core.js`, `grain.js`, then the episode file such as `ep_mc.js`) joined with `cat` into `scene.html` next to `timeline.js`. Characters: `scout()` in `mid_a.js`; suit figures and heads in each episode file.
4. Render: `build/shard.js` (4 parallel processes) or `build/style_shard.js` (cutout: set `window.STYLE='cut'`; `ep_mc_style.js` is the cutout variant) with Playwright/Chromium, then `ffmpeg -framerate 30 -i frames/%05d.jpg -i audio.mp3 -c:v libx264 -crf 20 -pix_fmt yuv420p -c:a aac -shortest out.mp4`.
5. Upload and schedule: RobinReach `media_direct_upload_create`, PUT the file with the `X-Upload-Token` header, `media_direct_upload_finalize`, `posts_validate`, then `posts_create` (YouTube title, tags, pinned `comment`, `thumbnail_url`, `playlist_ids`).
Videos and frames are not stored in the repo (too large). Rebuild from the scripts if a video is needed again.

## Open items for Victoria / next session
1. DONE: Victoria added Ep3 (Franklin) to the playlist herself. Optional: rename the playlist to remove the stray quote.
2. Thumbnails: Ep4 (AUTO-WHAT?!) and Ep5 (I INVENTED AI?!) are attached; Ep1, Ep2 have none (YouTube auto frame); custom thumbnails only work on verified channels.
3. PLAN (Victoria): start the next batch of videos on Mon Nov 16 (prepare over the weekend of Nov 14-15 if needed). By Nov 16 review the analytics for the five Geniuses Gone Mad episodes (RobinReach analytics, YouTube Studio). Then decide: continue the series, compare Vox vs paper cutout, or go back to the original "yap" format (the earlier Survival Untold Shorts with the Scout interviews, such as the Edison yap). Keep scripts locked once approved.
4. Weekend Nov 14-15 is filled; the next open slot is Mon Nov 16 at 9:00 AM PT.
5. The Tesla title says "90 Seconds" while the video is about 108 seconds; Victoria said the titles are fine as they are.

---
# Addendum (Mon Nov 9): the original "hoodie guy" format

## What Victoria wants
Her original plan for Survival Untold copies the FORMAT of the viral @HoodieGuyStories Shorts (example she uploaded: "Why You Couldn't Survive The Titanoboa", 84 s). Her instruction: Scout (female) is the host/interviewer instead of the hoodie guy, and the video is a "clone of the format but with a contrast". She said the look and the voice were never perfected, and she wants the real tools used (she mentioned Fal; see below). Do NOT recreate that creator's real face or voice; build our own original host.

## The reference format (analysed from her video)
- A young man in a gray hoodie with a tiny mic is a live-action performer, cut out and dropped into hyper-realistic AI scenes (he stands in the flooded yard, appears small in a corner, etc.).
- The scenes show giant animals with cartoon googly eyes, tears and fake cartoon blood.
- A new shot every 2-3 seconds with a slow zoom on each; huge one-word-at-a-time captions at the top (white, black outline).
- Voice: young adult male, median pitch about 137 Hz, speaks about 94% of the time with almost no pauses, very fast and punchy.

## What was proven in this session (layered compositing, all code)
Test video "layered-test" (10.9 s), rebuilt by the scripts in `pipeline/hoodie/`:
1. Environments: empty photoreal scenes from RobinReach `media_generate_ai_image` (model `nano_banana_pro`, 9:16, 768x1376 output, saved in the RobinPixel folder; use `image_prompt` that says "no animals, no people").
2. Animals: generate the animal "isolated on a flat solid pure bright green (#00FF00) background, no shadows, studio cutout style", then `ffmpeg -vf "colorkey=0x00FF00:0.32:0.12,format=rgba"` gives a clean PNG cutout.
3. Animate each layer in SVG/JS (`pipeline/hoodie/test_scene2.js`): rise from the water, sway, tremble, googly eyes with wobbling pupils, tears, slow zoom per shot. Eye positions must be picked per image (measured by eye in the image's pixel coordinates).
4. Scout is the existing 2D cartoon (`scout()` in `pipeline/build/mid_a.js`) popping in at a different spot each shot, in front of the layers: a deliberate cartoon-versus-photoreal contrast.
5. Narration: ElevenLabs voice Scout `013RUoHuuxLHdDYBqZol` with the prompt tag `[fast-talking, breathless, excited storyteller, no pauses]`, silence trimmed and `atempo` about 1.12. Captions: one word at a time, timed by word length (no true word timings; `creative_transcribe_audio` needs an asset-upload tool that was not available).
6. Render with `pipeline/hoodie/render_frames.js` (Playwright) and `ffmpeg`, as for the other episodes.
Known gaps: animal mouths do not move; googly eyes are placed by hand; one generated image came out rotated 90 degrees and had to be fixed with `ffmpeg -vf transpose=2`; Scout is not "in" the water.
Sample test assets (public URLs): river with snake https://d2zf8b1xpl1udp.cloudfront.net/fxq3hce2utqjt48l5ipju9hmmdpg.jpg ; coiled snake and croc https://d2zf8b1xpl1udp.cloudfront.net/dl2p33jtr5j4z30rj42hl3mcjixv.jpg ; empty river https://d2zf8b1xpl1udp.cloudfront.net/gcd98mclrnc705uyf4w4ktymmg7k.jpg ; snake cutout source https://d2zf8b1xpl1udp.cloudfront.net/t91ecaevh32d2751wpqdv4varv35.jpg ; animal cutout source https://d2zf8b1xpl1udp.cloudfront.net/sc1k80fcntuft9rs9kelbdk7eb5n.jpg

## Voices tried and rejected
Three designed male narrator voices (ElevenLabs `creative_design_voice`, previews not saved) were rejected: Victoria said the host should be SCOUT (female), not a male narrator. Use Scout's voice.

## Photoreal Scout (started, unfinished)
HeyGen `create_prompt_avatar` created "Scout Host (realistic)", id `204c44cf9a2fc59f449a659e8997f050`, still `processing` when last checked. Plan: when ready, `create_video_from_avatar` with `outputFormat: "webm"` (transparent) or a green background plus `audioUrl` set to the ElevenLabs line, so she lip-syncs to Scout's own voice, then composite her into the scenes. Victoria's HeyGen plan: Creator, 27 premium credits left (resets Nov 18). Only spend credits on a short test.

## Fal
Victoria asked to use Fal and enabled the connector, but in this session only `get_submission` and `send_feedback` were loaded (no `recommend_model` / `run_model` / `submit_job` / `check_job`). A new session should load them. Intended use: image-to-video animation for the cutouts (moving mouths and reactions), and a moving photoreal Scout.

## Next steps
1. In a fresh session, confirm the Fal tools exist; if so, test Fal image-to-video on the snake and animal cutouts, and a photoreal Scout.
2. Decide the Scout look with Victoria: cartoon Scout over realistic scenes (proven), photoreal HeyGen Scout, or both.
3. Pick the first full topic, write the script with her, lock it, then build the video the same way as the other episodes.
4. Starting Mon Nov 16: review analytics for episodes 1-5, then decide between Geniuses Gone Mad, this hoodie-guy-style format, or both (house styles are Vox and paper cutout; this format is the "original yap" direction).
