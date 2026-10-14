# Explainer system

Script in, finished explainer video out. A fun, animated, narrated video where a host walks the viewer through a topic, one
diagram at a time. Built for the Nonprofitsdaily long videos and reusable for IT training and any how-to. It is not tied to
any one topic: a new video is a new `script.json` and its narration clips.

Everything is drawn and mixed in code (the engine in `engine/`), so there is no editor, no stock footage and no per-render fee.
Pictory is not part of this workflow.

## Make a video

```bash
# 1. write videos/<name>/script.json  (format below)
# 2. generate one narration clip per scene (see "Narration"), save as videos/<name>/narration/<scene-id>.mp3
node prep.js <name>        # timeline from the real clip lengths; lists any clip still missing
node song.js               # narration + music + sounds -> out/music.wav, out/voice.json
node engine/render.js stills 30 120 250   # look at frames (out/stills/*.png) and fix the layout
node engine/render.js video                # all frames (about 5 fps: a 7-minute video takes ~40 min; run in the background)
node engine/render.js mux                  # out/<folder>.mp4 with sound
```

`./build.sh <name>` runs prep, song, video, mux and check in order.

## script.json

```json
{
  "title": "Form 990 for Beginners",
  "theme": "nonprofitsdaily",          // fun | nonprofitsdaily (see themes.js; add your own)
  "wordmark": "NONPROFITSDAILY",       // small mark bottom-left, optional
  "host": true,                        // the narrator character, optional
  "voice": { "provider": "elevenlabs", "voice_id": "...", "model": "eleven_v4" },
  "scenes": [ { "id": "cold-open", "type": "kinetic", "voiceover": "text the narrator says", ... } ]
}
```

Every scene has an `id` (also its narration file name), a `type`, and `voiceover` (a string, or an array of strings when a
scene has more than one clip, e.g. a quiz question and its answer; those clips are named `<id>-1.mp3`, `<id>-2.mp3`).
Optional per scene: `bg` (`dark` or `light`), `lead` and `tail` (seconds of picture before and after the voice), `gaps`
(seconds of silence between clips of one scene).

### When things appear: quote the narrator

Anything that appears on screen has an `at` field holding a few words the narrator says. It appears the moment they say it.
`"at": "gross receipts"` finds that phrase in this scene's narration; `"at": "five#2"` means its second occurrence.
Leave `at` out and it is spread evenly between its neighbours. Because timing comes from the real narration, changing the
narration re-times the whole video with no hand editing.

### Scene types

| type | use it for | fields |
|---|---|---|
| `kinetic` | opening, big statements (words spring in) | `kicker`, `lines: [{text, color, at}]`, `lower: {text, sub, at}` (name card) |
| `stat` | one big number | `big {text, at}`, `label`, `sub`, `stamp` (each `{text, at}`) |
| `mythfact` | myth vs fact | `myth`, `fact`, `note`, `mythAt`, `strikeAt`, `factAt`, `noteAt` |
| `steps` | a step, a list, a template (cards revealed one by one) | `title`, `items: [{badge, text, sub, at}]`, `numbered`, `ownerColumn`, `ownersAt`, `footnote`, `footAt` |
| `flow` | a process or timeline (rows of boxes joined by arrows) | `title`, `rows: [{at, nodes: [{label, sub, tone}]}]`, `note`, `noteAt` |
| `compare` | before and after (stacked bars) | `title`, `left/right: {label, segments: [{label, pct, color}]}`, `quote`, `leftAt`, `rightAt`, `quoteAt`, `illustrative` |
| `alert` | mistakes, warnings | `stamp`, `stampAt`, `items: [{text, at}]` |
| `quiz` | pause and check with a countdown | `kicker`, `facts`, `question`, `answer: [{text, color, at}]`, `voiceover: [question, answer]`, `gaps: [seconds]` |
| `recap` | recap, next-episode teaser, closing line | `title`, `points: [{text, at}]`, `teaser: {label, title}`, `teaserAt`, `closer`, `closerAt` |

Colors are theme keys: `onDark`, `ink`, `a1` to `a4`, `ok`, `muted` (or any hex). `tone` on a flow node is also a theme key.
A new scene type is one function in `film.js` plus its reveal list in `score.js` (`reveals()`).

## Themes

`themes.js`. `fun` is the hand-drawn cream/terracotta/teal look. `nonprofitsdaily` is the brand: plum `#3B0B45`, ivory `#FAF7F2`,
violet `#6C1FE0`, gold `#E8B547`, lavender `#D9C8F5`, Georgia headlines (Liberation Serif in the render sandbox) and Arial body.
A theme sets palette, fonts, engine look (`paper`, `flat`, `chalk`, `neon`, `watercolor`, `pixel`), host outfit and music.

## Narration

Narration is generated with the ElevenLabs connector (voice and speech only). One clip per scene keeps timing exact and lets you
re-do one scene without touching the rest. Cost is about 1 credit per character (a 7-minute video is about $2). Download each clip
into `videos/<name>/narration/`. The text in `voiceover` must match the audio, because the word timing and captions come from it.

## Rules of the house

- Check every fact, threshold and date before it goes into a script (for tax and legal material, against the official source).
- Nonprofitsdaily content never mentions Give to Africa. Closing line: "Subscribe to my YouTube channel for more nonprofit tips."
- Examples with made-up numbers say so on screen ("composite", "illustrative", "example").
- Disclose AI-generated narration where the platform asks for it.
