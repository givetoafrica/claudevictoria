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
- New default style: **paper cutout** (wobbling edges redrawn each frame, about 12 fps stepped motion, flapping mouths, cardboard tint). Claymation was tested and rejected. Victoria said "you are right" to the cutout recommendation, so use it from now on.
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
1. Add Ep3 (Franklin) to the playlist by hand on YouTube; optionally rename the playlist to remove the stray quote.
2. Thumbnails: Ep4 (AUTO-WHAT?!) and Ep5 (I INVENTED AI?!) are attached; Ep1, Ep2 have none (YouTube auto frame); custom thumbnails only work on verified channels.
3. Next episode ideas: Scout meets a new genius (no walking, cutout style, moving setting such as a vehicle). Keep the script locked once approved.
4. Weekend Nov 14-15 is filled; the next open slot is Mon Nov 16 at 9:00 AM PT.
5. The Tesla title says "90 Seconds" while the video is about 108 seconds; Victoria said the titles are fine as they are.
