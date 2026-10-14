---
name: nonprofitsdaily-video
description: Make finished NonprofitsDaily explainer videos, vertical reels (1080x1920) and YouTube longs (1920x1080), with brand motion graphics, word-by-word captions, a reacting Victoria avatar and an ElevenLabs voiceover, rendered to MP4 here with no outside editor. Use when asked to make, script, voice or render a NonprofitsDaily reel, short or YouTube video.
---

# NonprofitsDaily video (faceless motion explainer)

Replaces the older faceless reel and the long-form deck pipeline. Claude writes the script, voices it, and renders the final MP4.

## Pipeline
1. **Script** in Victoria's voice (see references/voice.md once it exists). One idea per scene. Source-check every statistic and put the source on screen.
2. **content.json**: `format` ("reel" or "long"), `scenes[]` each with `say` (voiceover; `|` splits caption chunks, `*word*` = bold key word), `bg` (plum|dark|ivory), optional `pill`, `react`, `series`, and a `hero`: list, compare, stat, myth, quote, phone. See examples/reel-need-statement.json.
3. **Voice**: `python3 scripts/tts_elevenlabs.py content.json vo.mp3` (needs ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID, and api.elevenlabs.io allowed). It writes real word timings into content.json. Without it, captions use estimated timing and the video is silent.
4. **Render**: `node scripts/render.cjs content.json out.mp4 --audio vo.mp3`. Preview one moment: `--frame 5.5 out.png`. Needs playwright (chromium) and ffmpeg. Tested speed: about 14 frames/s at reel size.
5. **QA**: view frames at each scene (use `?safe` in engine.html to check safe zones: bottom 14%, right 12% for reels), check captions match audio, confirm no unverified claims, no Give to Africa mention, disclaimer on fictional examples.

## Status (v1)
- Verified: reel render to MP4 with brand fonts and colors, scene types above, avatar placeholder.
- NOT verified: ElevenLabs script (no key or network yet), long (16:9) layout render, 2D animated Victoria avatar (needs her image), YouTube-length render time.
- Open inputs: Victoria's headshot / chosen HeyGen look, voice clone id, past scripts for the voice file, logo.
