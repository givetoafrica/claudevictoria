# Survival Untold: motion pipeline

Remotion project that draws Survival Untold episodes entirely in code: layered savanna scenes,
cartoon characters built from separate parts, and on-screen labels. Each composition renders as
16:9 (YouTube) and 9:16 (TikTok / Shorts) from the same scene.

## Layers

| File | What it draws |
|---|---|
| `src/components/Savanna.tsx` | Dawn sky, rising sun and god-rays, hills with acacias, distant herd, birds, swaying grass fields, dust motes, and the screen-space haze/vignette/grain |
| `src/components/Characters.tsx` | `Wildebeest` (calf/adult) with folding, trembling legs, tilting body, dipping head, blinking/looking eye and sweat drop; `HiddenLion` peeking out of the grass |
| `src/components/Overlay.tsx` | Captions and fades in screen space |
| `src/scenes/WildebeestProof.tsx` | 15 s proof scene: newborn calf tries to stand, succeeds, notices the lions |
| `src/lib/motion.ts` | Deterministic random, idle wobble, eased ramps |

## Run

```bash
npm install
npm run studio          # live preview in the browser
npm run render:proof    # out/wildebeest-proof.mp4
npm run render:proof-vertical
```

In environments with a preinstalled Chromium, set `REMOTION_BROWSER` to its headless shell to skip
Remotion's browser download, e.g.
`REMOTION_BROWSER=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`.
