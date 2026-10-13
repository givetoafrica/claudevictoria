# @insiderforce Reel Style Study (visual, spacing, motion), for NonprofitsDaily Reels

## Evidence basis

- **Viewed directly:** a profile screenshot (Reels grid + bio) and an 18.5 s screen recording (`Screen_Recording_20261012_204715_Instagram.mp4`, 1080×2340, one Reel). I extracted 1 frame per second (18 frames) and examined a contact sheet plus frames at 3, 5, 8, 14 and 16 s.
- **Not available:** audio (no transcription tool here, so voiceover is **not** documented), motion between sampled frames (I infer easing from partially revealed text), and the first 3 s of the recording, which are the profile grid before the Reel opens.
- **Measurements** are read off the screen-recording frames at 540 px width and expressed as percentages. The Instagram UI overlays and the phone's aspect ratio add error of a few percent. Treat them as ±3%, not design-file values. Colors are eyeballed, not sampled.
- **Scope:** one Reel (an open-source comment-to-DM tool pitch, "Comment HUMAN … ebook" in the caption) plus nine cover thumbnails. Claims about "the account's style" are inferences from those.

## 1. Account-level system (from the grid screenshot)

**Observed**

- **Bio:** "I study how businesses use AI to scale from 0 to 1M. Then I reverse-engineer business growth." Contact email and one link, `insiderforce.io/this-way`.
- **Grid:** 3 columns. Nine of nine visible covers share one template, so the grid reads as a single series.
- **Cover template:**
  - Off-white to light-gray background.
  - A coral/orange starburst shape, cropped off one or two corners (top-right, top-left or bottom-left, varying per cover).
  - Centered headline, mixed weights, 2–4 lines.
  - One key phrase inside a near-black rounded pill with white bold text.
  - A centered hero object: a product-UI card, a person cut-out with a thick white sticker outline (NVIDIA CEO cover), a stack of tool logos, or a 3D object.
  - A faint `insiderforce.io` watermark centered near the bottom.
- **Headline pattern (9/9):** a number, a bold claim, or an "X did not see this coming" frame. Examples: "5 free Claude Code plugins that fix the biggest claude problems forever", "Claude has over 100,000 SKILLS but you only need 5 of them", "ManyChat's most profitable feature … completely free".
- **Views visible:** 706 to 7,349 per Reel. The "100,000 SKILLS" and "5 free … plugins" covers are highest. This is a tiny sample, so it is not evidence of what works.

## 2. Reel canvas and spacing (frame at 8 s, "ManyChat's most profitable feature")

Coordinates are percent of the visible Reel area (width 540, height ≈1010 between the top status bar and the bottom comment bar). The Reel is a full-bleed vertical layout, centered on one axis.

| Element | Position / size | Notes |
|---|---|---|
| Background | Full bleed | Very light gray at the top, fading toward white mid-frame and slightly darker gray toward the bottom. A faint dot grid is visible behind the hero (clearest at 3 s and 14 s). |
| Top headline (2 lines) | Starts ≈7% from the reel top; the two lines sit ≈40 px apart at 540 px width | Line 1 is heavy, ≈54 px cap height. Line 2 is regular weight, ≈40 px. Block width ≈70% of the frame. |
| Hero object | Top edge ≈19%, bottom edge ≈67%; width ≈61% (≈105–432 px) | Centered. Gap headline→hero ≈4%. Rounded corners (≈20 px), soft diffuse shadow offset down and right (≈10–15 px blur 25+). |
| Highlight pill | ≈77–84% from top; ≈58% width in the sample | Near-black (#1f1f1f), corner radius ≈8–10 px, text white, bold, ≈40 px. Same soft shadow as hero. Gap hero→pill ≈6%. |
| Brand watermark | ≈89% from top, centered, ≈30 px | Mid-gray (≈#999), bold, low opacity. Sits just above Instagram's caption row, so it is visible but never overlapped by it. |
| Side margins | Text blocks stay inside ≈5–8% side margins | Exceptions are mid-animation words, which spill into the right-hand action buttons (heart, comment, share) at 14 s and 16 s. |
| Bottom safe zone | Bottom ≈12% left empty | Holds the Instagram author row and caption. Nothing important is placed here. |
| Right safe zone | Rightmost ≈12% | Instagram action buttons. Hero objects and pills stay clear of it, and mid-animation text does not always. |

**Takeaways on spacing**

- **Vertical rhythm:** one object per vertical band (headline → hero → pill/caption → watermark), roughly 4–6% gaps. No band overlaps another.
- **Generous white space:** the hero occupies about half the frame height and never touches the edges (≈20% margin each side).
- **Centered axis:** everything aligns to the centre line. The only off-centre elements are the corner starbursts and the 3D object that peeks in from the top-right (an eyeball at 12–15 s).
- **Safe zones respected** for the bottom caption and watermark, which is why the layout survives Instagram's UI.

## 3. Typography

- **Family:** a clean grotesque sans (looks like Inter / Söhne-style, **inferred**, not identified). Tight letter-spacing on large text.
- **Two-tier weight system:**
  - Regular or light gray-black for connecting words ("that watches your instagram", "someone", "it", "on").
  - **Heavy/bold, darker, larger** for the key noun or number ("comments", "24/7", "keyword", "5 free", "100,000 SKILLS").
- **Case:** sentence case, lowercase connectors. No all-caps except the word inside the keyword callout.
- **Highlight device:** the single most important phrase of a scene is set white-on-black in a pill ("completely free", "17 year old", "coming", "anything you want", "5 of them").
- **Size ladder (approx at 540 px width):** pill / key phrase ≈40–44 px; headline ≈54 px; supporting line ≈36–40 px; watermark ≈30 px; in-mock UI text is intentionally tiny and decorative.
- **Color:** only near-black, white and mid-gray text, plus the coral accent. No gradients on type.

## 4. Color and graphic language

- **Palette (eyeballed):** off-white `#f4f4f4`–`#ffffff` backgrounds; near-black `#1f1f1f` for pills and text; coral `#e0694f`-ish for starbursts; gray `#999` watermark. Hero objects bring their own color (dark phone UI, screenshots).
- **Accent shape:** the coral starburst recurs (corner of covers; an orange spark atop the Shopify cover). It is the main brand device.
- **Depth:** every card, pill and phone has the same soft drop shadow, which makes flat UI mockups float above the background. The phone mockup (14 s) has a realistic bezel and a floor shadow.
- **Cut-outs:** people get a thick white outline (sticker style) and a hard shadow line beneath.
- **3D props:** a photoreal eyeball appears at the top-right of the phone scene, as a literal visual for "watches". Metaphor objects are used for verbs.
- **Mock UI over real UI:** the ManyChat "pricing card" is a stylised, simplified mock, not a screenshot (it shows a "$69/mo" card that changes to "$0/mo … FREE (No billing necessary)" at 7–8 s). This is the creator's own graphic, so the figures are not verified pricing. It also shows "7500 Active Contacts per month included, then pay per contact".

## 5. Motion and caption behavior (inferred from adjacent frames)

- **Text reveals left to right as a wipe/mask:** frames show text cut mid-word ("17 year ol", "completely fr", "that watches your instagram" clipped at the right edge). That is a clip-path reveal, not a typewriter.
- **Word-by-word emphasis:** while a line reads, the current word is dark and heavy and neighboring words sit lighter gray (ghosted), e.g. "it is an **open** source", "someone **comments** it on". Previous/upcoming words fade to light gray rather than disappearing.
- **Scene = one idea per ~1–2 s:** 18 s covers roughly: profile → Reel opens (black load frame) → person at laptop with "17 year old" → ManyChat price card ($69→$0) → open-source GitHub repo screenshot ("it is an open source") → phone with comment list plus 3D eye ("that watches your Instagram comments 24/7") → a native-style notification card "Comment 'VOLT' for the direct link" with "you set a keyword" → phone comments reply thread ("someone comments it on … they get your link in their DMs").
- **Hero swaps rather than cuts:** a hero card enlarges and slides or blurs into the next object. Objects scale slightly when they enter (the ManyChat card is smaller and further up at 6 s than at 8 s).
- **Pill timing:** the pill appears after its sentence is nearly done, as a punchline.
- **Audio:** not analysed. Do not copy assumptions about voiceover or music.

## 6. Content structure of the Reel (observed)

1. **Hook (0–2 s of the Reel):** a person image plus "17 year old …" (a story/credibility hook).
2. **Problem/contrast:** ManyChat's paid feature vs a free alternative.
3. **Proof object:** an open-source GitHub repo screenshot.
4. **Mechanism demo:** a mock phone with ten identical "VOLT" comments, an eyeball, and "watches your Instagram comments 24/7".
5. **Interaction:** a keyword notification card ("Comment 'VOLT' for the direct link").
6. **Payoff:** "someone comments it on … they get your link in their DMs".
7. **CTA in the caption** (not shown on screen): "Comment 'HUMAN' and I'll send you the ebook …". Note that the on-screen keyword is `VOLT` while the caption keyword is `HUMAN`. The Reel therefore teaches the mechanism with one keyword and runs its own funnel with another.

## 7. Replication spec for NonprofitsDaily Reels

Primary target: **NonprofitsDaily**. Use the structure, not their brand. Do not reuse the coral starburst, the `insiderforce.io` watermark pattern, their wording, or their logos and people images.

| Spec | Value |
|---|---|
| Canvas | 1080x1920. Safe margins: sides 6-8%, bottom 14% (caption + watermark), right 12% (action rail) |
| Bands | Headline 7-19%, hero 19-67%, key-phrase pill 77-84%, watermark about 89% |
| Background | Light neutral with a dot grid at about 5% opacity |
| Type | One grotesque family, two weights (regular and heavy), sentence case |
| Highlight | One dark rounded pill per scene, white text, same shadow as the cards |
| Accent | One NonprofitsDaily brand shape or color, to be chosen from your own brand kit (not established here) |
| Motion | Left-to-right text mask reveal, ghosted neighbor words, hero swap every 1-2 s |
| Length | 15-20 s |
| CTA | Same keyword on screen and in the caption (the reference mismatches `VOLT` and `HUMAN`) |

**Mapping their cover formulas to NonprofitsDaily topics (my suggestions, not from the recording)**

| Reference formula | NonprofitsDaily version |
|---|---|
| "5 free [tools] that fix the biggest [problem] forever" | "5 free tools that fix the biggest nonprofit reporting problems" |
| "[Thing] has over 100,000 X but you only need 5" | "There are thousands of grant sources but you only need 5 to start" |
| "[Big name] did not see this coming" | A sector news hook, only with a source you can cite |
| "[Competitor's] most profitable feature ... completely free" | A paid-tool comparison, only after verifying the real prices |
| "17 year old ..." credibility hook | A result-led hook ("The grant section funders read first") |
| Keyword in the caption, ebook delivered in DM | `GRANT` / `TEMPLATE` keyword delivers a checklist, with consent and opt-out |

**NonprofitsDaily rules of thumb**
- One idea and one CTA keyword per Reel.
- Source-check every statistic and show the source in the caption.
- Use mock UI for tool explainers, and real, consented imagery for any people.
- Keep hero objects clear of the right-hand action rail.

**Other organizations:** this spec transfers to Philips Nonprofit Consulting, Give to Africa and YENDAA with a different accent and subject matter, but I have not tailored it for them. I was wrong to treat Give to Africa as the main target.

## 8. Quality notes and cautions

- **Legibility defects in the reference:** text spills over the right action rail at 14 s and 16 s, and the keyword shown on screen differs from the caption keyword. Avoid both.
- **Claims:** "completely free" and "$0/mo" on the ManyChat mock are the creator's claims. Verify any tool's real pricing before repeating a comparison. Do not use a competitor's logo or pricing in your own content without checking trademark and accuracy.
- **People images:** the cover with a real, named executive's likeness and the "17 year old" stock-style person raise rights and accuracy issues. Do not replicate.
- **Not observed:** audio, exact fonts, exact hex colors, exact easing and durations. Sample the original file in a design tool if you need production-accurate values.

## 9. Next steps I can do

- Build a Canva or HTML template of this layout (bands, pill, watermark, safe zones) for NonprofitsDaily.
- Draft a Reel script for NonprofitsDaily in this structure.
- Extract further frames from the recording at 4 fps for exact animation timing.
