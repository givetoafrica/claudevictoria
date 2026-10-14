---
name: videoagent1
description: Videoagent1 makes finished videos end to end inside Claude, reels and shorts (1080x1920) and YouTube longs (1920x1080), with calm motion graphics, word-timed captions, an ElevenLabs voiceover and a 2D cartoon mascot that lip-syncs and reacts, rendered to MP4 with no outside editor. Default brand, voice and writing style are NonprofitsDaily. Use when asked to script, voice, animate, caption or render any reel, short, explainer or YouTube video, or to add a 2D animated presenter.
---

# Videoagent1 (reels, shorts and YouTube longs: motion + voice + 2D)

Claude owns the whole job: script, voiceover, animation, render, QA. No Pictory, no outside editor. The faceless motion style replaces the older short reel and the long-video deck pipeline.

## Decisions already made by Victoria (follow these)
- **Voice:** ElevenLabs "Bella - Professional, Bright, Warm" (voice_id `hpp4J3VqNfWAUOO0d1Us`), model `eleven_v4`. She said it is perfect. It is a stock voice, not a clone of her.
- **Look:** calm, one idea per scene, large graphics (cards fill about 88% of a reel's width). She called the busy version "too busy": no drifting backgrounds, spinning shapes, bouncing words, floating cards. She loves the animation and motion of the calm version.
- **Avatar:** Victoria does NOT want her own likeness used. The on-screen presenter is **Sunny**, a generic gold-sun 2D mascot in the brand colors that fits any script. The small corner mascot appears in **long videos only**, never in reels or shorts (`avatarMode`: `cartoon` default for long, `none`). Sunny can also be a full scene (`hero.kind: cartoon`) in either format. Never add her photo or a drawing of her.
- **Reel ending:** "Follow for more nonprofit tips." Do not use a checklist or comment-keyword call to action (she found it confusing). Do not add a "Reply STOP" line.
- **Brand:** plum #3B0B45, ivory #FAF7F2, near-black #1C1421, violet #6C1FE0, gold #E8B547, lavender #D9C8F5, grey #9C92A3; Georgia-style serif headlines (Gelasio in the renderer) and Arial body. Never mention Give to Africa. Details in references/brand.md.
- **Voice of the writing:** references/voice-victoria.md (hook, three points, one principle, one question, "Follow for more nonprofit tips.").
- **Costs she accepted for testing:** about 3 to 4 US cents per 15 to 20 second voiceover and about 1.6 cents per transcription. Do not regenerate audio just to retry; ask first.

## Pipeline
1. **Brief:** topic, format (`reel` or `long`), length. Check facts. Any statistic needs a source shown on screen. Label made-up examples "Example nonprofit used for teaching" (recurring example: Second Chances Austin).
2. **Script** in Victoria's voice. Mark caption chunks with `|` and bold key words with `*word*`. Reels: about 15 to 25 seconds, 35 to 60 spoken words. Longs: scene per idea, sections and recap.
3. **Voiceover (ElevenLabs connector).** Load the tools with ToolSearch (`+ElevenLabs voice`). Then:
   - `creative_generate_speech` with `model_id: eleven_v4`, the voice id above, the spoken text, `generations_count: 1` (use `estimate_only: true` first when the script is long). Poll `creative_get_flow_run_status` until `all_completed`.
   - Download the `content_url` (signed `storage.googleapis.com` link) with curl into the scratchpad. That host is reachable from the sandbox; `api.elevenlabs.io` is not.
   - Word timings: `creative_attach_reference_file` with the same URL and the flow_id, then `creative_transcribe_audio` (`eleven_scribe_v1`) with `connect_from` the returned node, then read `transcripts[0].words` (text, start, end) from the status call.
   - Build `timing` as `[{w,start,end}]` with exactly one entry per spoken word, in order. The transcript can spell a word differently; only the count must match the script's words. Put the audio path in `audio`.
   - Long scripts: the speech tool has a per-call character limit; generate per section and concatenate with ffmpeg, adding each section's offset to its timings. (Not yet exercised on a long script.)
4. **content.json** (schema below). See examples/.
5. **Render:** `node scripts/render.cjs content.json out.mp4 --audio vo.mp3`. Single frame preview: `--frame 5.5 out.png`. Tested speed about 15 to 17 frames per second at reel size. Needs playwright chromium and ffmpeg (both present in the cloud container; set `PLAYWRIGHT_MODULE` if playwright is elsewhere).
6. **QA before sending:** pull frames at each scene, check captions land on the spoken words, text inside safe zones (bottom 14%, right 12% on reels), nothing cut off, no claims without sources, no Give to Africa, avatar rule respected, audio present (ffmpeg volumedetect). Send the MP4 with SendUserFile.
7. **Changes:** talk to the file, one change at a time ("make the card bigger", "slower"). Re-render. Do not spend credits on new audio unless the words change.

## content.json
```
{ "format": "reel" | "long", "audio": "path/to/vo.mp3", "timing": [ {"w":"Writing","start":0.08,"end":0.38}, ... ],
  "scenes": [ { "bg": "plum|dark|ivory", "say": "Hook *word*|second chunk", "pill": "short punchline",
                "series": "Fundraising Series", "react": "Aha!", "sun": "right:-17cqw;top:-17cqw", "hero": { "kind": "..." } } ] }
```
Hero kinds: `cartoon` (2D mascot Sunny: blinks, sways, mouth moves with the spoken words, brows lift on `react`), `list` {items:[{t,s,key}]} (row lights up when the `key` word is spoken), `compare` {a:{label,value}, b:{label,value,tag}}, `stat` {number,caption,source}, `myth` {myth,fact}, `quote` {text}, `phone` {keyword,notif,notifKey} (comment demo, only if she asks for one), `follow` {handle,line}.
Without `timing`, captions use estimated timing (looks fine but will not match a real voice).

## Layouts
- **reel (1080x1920):** headline top, hero card 21% to 71% of height and 88% of width, pill at 79%, watermark at 91%.
- **long (1920x1080):** text left, hero right, avatar bottom-right. Still frames of this layout were checked; a full long render and its timing were not.

## 2D animation (built in)
The engine draws **Sunny**, a flat vector mascot in code: thick outlines, solid fills, a gold sun-shaped head with big round eyes, a plum body and small gold hands. The mouth follows the word timings (closed, open, wide or round by vowel), and she blinks, sways, moves her hands and lifts her brows on a `react` word. She is generic and fits any script. Use her as the corner mascot in longs or as a full scene in a reel or long. Other routes: Victoria's manual Claude Design then Claude Animation workflow for turning a clip into a cartoon (references/2d-animation.md), and the `animation-studio` skill for other cartoon cut-ins.

## Use it for any video, not only NonprofitsDaily
The engine and pipeline are brand-neutral: swap the palette, fonts, watermark text and voice id and the same scenes, motion, captions and render work for another brand. Keep Victoria's rules above only for NonprofitsDaily. Her other brands (Philips Nonprofit Consulting, YENDAA) have not been styled yet.

## Style and motion references
references/motion-moves.md (10 moves, 4 styles, rules, from the guide she supplied), references/insiderforce-style-study.md (spacing and type measured from one @insiderforce reel), references/voice-victoria.md.

## Status (honest)
Verified here: reel render with real ElevenLabs audio and word-timed captions, brand fonts and colors, scene types, 16:9 layout stills, mascot stills in reel and long layouts (rig, blink, brows, mouth shapes drawn).
Not verified: a full long video render, ElevenLabs on a long script, cartoon lip sync against real audio as a moving video (stills only), sound effects (none made), moves other than rise/slide/underline/row-highlight/spring pop, the Claude Animation workflow.
Open inputs: her review of the mascot design (v1 is a first drawing), more scripts for the voice file, a logo file if she has one, a style for her other brands.
