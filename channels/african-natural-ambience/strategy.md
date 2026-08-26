# African Natural Ambience — competitive read and opening slate

## What I could and could not verify

`youtube.com`, `socialblade.com` and Google's suggest endpoint are all blocked
by this environment's egress policy, and the Firecrawl key attached to this
session is revoked. **I have no view counts, subscriber counts or upload
cadence for any of the five channels below.** Everything here is read from
public search descriptions — positioning, not performance.

That gap is what `scripts/competitor_tracker.py` closes. Once `YOUTUBE_API_KEY`
is set as a repository secret, the weekly workflow pulls real numbers and flags
outliers automatically. Until then, treat every judgement in this document as a
hypothesis with a date on it.

## The five channels are not one competitive set

| Channel | What it actually is | Relationship to us |
|---|---|---|
| **BlueReef4K** | Long-form 4K underwater/reef ambience | **The real competitor.** Same job, different biome. This is the one to beat. |
| **Screenbience** | Aesthetic screensavers, motion wallpapers, background animation. Reuse allowed with credit | **Format reference.** Utility positioning — "leave this on your screen" — and a distribution trick: letting others reuse the work seeds links back. |
| **AsmrCreate00** | AI-generated ASMR | **Adjacent, not rival.** AI ASMR and nature ambience share a shelf and nothing else. Unverified. |
| **Dynasty Electrik** | Human sound-healer duo (Jenny Deveau + Seth Misterka), crystal sound baths, weekly live streams, celebrity collabs | **Cannot and should not be copied.** Their moat is being two specific people. A faceless channel has no route to it. |
| `NTKxaeale4c` | Unidentified — blocked, and the URL was a radio/autoplay link | Needs identifying. |

**The finding that matters:** copying all five produces a channel with no
identity. Four different businesses are represented here. The strategy below
picks one lane — BlueReef4K's — and takes the interesting parts of Screenbience's
positioning into it.

## The MusicSesame problem

MusicSesame is a **stock music library** with channel-level Content ID
clearance. That clearance is genuinely valuable and worth having. But the
top-performing long-form ambience videos in this niche routinely put
**"No Music"** in the title, because that is what the sleep audience is
searching for. Music is often the thing they are trying to escape.

So MusicSesame solves a problem this channel only partly has, and does not
solve the one it does have: **authentic African nature audio.** That is the
single unresolved production dependency, and it needs a decision — licensed
field recordings, generated soundscapes, or original recording — before the
first upload, with the licence written down.

## Five opening videos

Chosen so that no two share a mechanic. Five skins on one format is exactly
what YouTube's July 2026 inauthentic-content rule penalises, and it penalises
at the channel level.

### 1. One Waterhole, Dusk to Dawn — 8 hours
A fixed camera on a single Okavango waterhole through a full night. Elephants
at dusk, hyena and lion through the small hours, birds at first light. No cuts,
no narration.

- **Why it's an outlier bet:** it has an *arc*. BlueReef4K's aquarium is the
  same at hour six as at minute one. A night that progresses gives a reason to
  keep it running and a reason to come back for the next waterhole.
- **Not repetitive because:** each subsequent video is a different waterhole
  and a different animal sequence.
- **Growth mechanic:** timestamped chapters in the description. Chapters on an
  8-hour video are watch-time infrastructure.

### 2. Rain on a Tin Roof — Accra
Corrugated iron in heavy rain, a compound courtyard, distant thunder, a market
winding down several streets away.

- **Why it's an outlier bet:** this is the one I would bet the channel on.
  Rain ambience is one of the largest categories on YouTube and almost all of
  it is placeless. Rain on a tin roof in a named African city is *memory* for
  millions of diaspora listeners. That converts to subscriptions and comments
  in a way generic rain never does.
- **Not repetitive because:** the series is cities — Accra, Lagos, Nairobi,
  Kampala — and every one of them sounds different.
- **Risk:** this is my inference about an audience, not measured demand. It is
  the highest-upside and least-evidenced idea on the list. Test it early and
  cheaply.

### 3. Which African Night Would You Sleep In? — Shorts
Four environments, roughly 15 seconds each: savanna thunderstorm, rainforest
canopy, highland night, coastal mangrove. Viewer picks one in the comments.

- **Why it's an outlier bet:** forced choice manufactures comments, and
  comments manufacture reach. This mechanic is what powered the "dream bed"
  format's breakout, and nobody has pointed it at real ecosystems.
- **Role:** this is the discovery engine. Attach a Related Video link routing
  to the matching long-form. Shorts alone do not produce subscribers — the
  route to long-form is the whole point.

### 4. The Congo Basin at Night — What's Actually Making That Sound
Long-form ambience with a difference: on-screen text identifies each animal as
it calls, appearing and fading without breaking the calm.

- **Why it's an outlier bet:** it adds a second reason to watch — curiosity —
  to a format that normally offers only one. It is also the clearest possible
  demonstration of the "real author input" the inauthentic-content policy asks
  for, which protects channel-wide monetisation.
- **Hard requirement:** the identifications must be correct. Wrong species is
  the fastest way to lose the exact audience most likely to subscribe.

### 5. The Storm That Builds — 3 hours
A single Sahel storm across three hours: dry wind and distant thunder, the
first heavy drops, the full downpour, the tapering, then the insect chorus
that follows rain.

- **Why it's an outlier bet:** it is explicitly *not a loop*. A three-hour
  structure that develops is something a looped file cannot do and a
  competitor working from stock cannot easily match. It is the strongest
  possible answer to "is this channel mass-produced?"
- **Not repetitive because:** the format is one storm, one arc — the next one
  is a different biome and a different storm behaviour.

## Sequencing

Test **#2** and **#3** first — they are the cheapest and carry the most
information. #2 tells you whether the diaspora thesis is real. #3 tells you
whether the channel can generate discovery at all. Both answers arrive within
about two weeks, and both change what #1, #4 and #5 should be.

## Open production questions

1. **Nature audio source and licence** — unresolved, and blocking.
2. **Visual length** — AI generation produces short clips; multi-hour visuals
   are built by extending and crossfading a modest number of them. Acceptable
   for sleep content, but it must be decided deliberately rather than
   discovered at upload time.
3. **Disclosure** — YouTube's altered-content disclosure applies to realistic
   synthetic footage of real places. Plan for it rather than being caught by it.

---

# What the first tracking run changed — 2026-08-21

The first run produced real numbers, and they revise several judgements above.
Full data: `tracking/report-2026-08-21.md`.

## The channel already exists and is publishing

7 subscribers, 10 uploads in roughly five days, all long-form, median 23
views. Several of the ideas proposed above were already in production before
this document was written. What follows replaces the slate, it does not add
to it.

| Channel | Subs | Median views | Median length | Uploads/30d |
|---|---:|---:|---:|---:|
| African Natural Ambience | 7 | 23 | 7h00m | 10 |
| Blue Reef 4K | 2,690 | **10,000** | **1h38m** | **36** |
| Dynasty Electrik | 103,000 | 34,500 | 1h12m | 7 |
| Screenbience | 17,100 | 530 | 11h04m | 9 |
| Asmr Create | 377 | 362 | 1m41s | 1 |

## Three findings that change what to do

### 1. Stop making 8-hour videos

Blue Reef 4K — the nearest competitor, and the one to beat — has a median
video length of **1h38m** and publishes **36 times a month**. It earns a
median 10,000 views on 2,690 subscribers, meaning almost all its traffic is
algorithmic rather than subscriber-driven.

That is the opposite of this channel's shape: 8-hour videos at 10 a month.
The 8-hour format costs roughly five times the render for one upload slot,
and the competitor's revealed strategy says the length is not what is
winning. Earlier advice in this document to target 4–8 hours came from
general web guidance; the direct competitor's own data contradicts it.

**Move to ~1.5 hours and raise cadence.**

### 2. Title for intent, not for place

Dynasty Electrik has 103,000 subscribers, and every one of its top outliers
is titled for a *state the viewer wants* rather than a location: "Nervous
System Healing", "528Hz", "Heart Awakening". Blue Reef 4K's two biggest
outliers (298,000 and 179,000 views) both carry "8K HDR | Dolby Vision™" —
a technical-spec claim, not a place.

This channel's titles lead with places: "Zambezi River Sounds", "Namibia
Village at Sunset". Places are good branding and weak search intent. Nobody
searches "Zambezi".

The same split shows up internally — "Fall Asleep Faster / Dark Screen"
is running at 30 views/day against "Zambezi River Sounds" at 1.3 — but at
4 to 60 views per video that internal comparison is noise on its own. It is
worth acting on because two much larger channels show the same pattern at
scale, not because of the difference between 30 views and 4.

**Formula: intent first, texture second, spec third, place last.**

### 3. Cut the off-lane uploads

"2 Hour Focus Timer Progress Ring", "Funny Countdown for Meditation",
"4 Hours Underwater Sea & Sky" are not African ambience. The underwater one
competes directly with Blue Reef 4K, whose median is 10,000 views — an
unwinnable fight on this channel's terms, and one that costs the channel the
single thing distinguishing it.

The "Sleep Session 01 / Focus Session 02" numbering is also dead title
space: it means nothing to a searcher and consumes characters that intent
keywords need.

## Revised priority

1. **Rain is the validated vein.** The two best organic performers are both
   African rain. The tin-roof/named-city version proposed above is the
   differentiated form of a thing already working — build that next.
2. **Re-title the existing ten.** Cheapest possible experiment: no new
   render, and it tests the intent-first hypothesis directly on videos that
   already exist.
3. **Drop to ~1.5 hours, raise cadence toward daily.**
4. Hold the forced-choice Shorts idea until the long-form titling is fixed —
   discovery pointed at weak titles wastes the traffic.

---

# The reference channel is not in this business — 2026-08-26

Victoria named the channel she wants to model: **Rainlit Village**. It was added
to the tracker along with **Rainy Village**, a second channel in the same
apparent lane, so that one channel's quirks would not be read as the format's
rules. Full data: `tracking/report-2026-08-26.md`.

The run changed the picture more than any previous one, because Rainlit Village
turns out not to do what this channel does.

## What the numbers actually say

| Channel | Subs | Median views | Median length | Uploads/30d |
|---|---:|---:|---:|---:|
| **African Village Ambience (ours)** | 19 | 21 | 8h00m | 13 |
| **Rainlit Village** | **498,000** | 7,550 | **6m33s** | 2 |
| Rainy Village | 865 | 278 | 1h00m | 0 |
| Blue Reef 4K | 2,950 | 10,000 | 1h37m | 41 |
| Dynasty Electrik | 103,000 | 33,000 | 1h12m | 6 |
| Screenbience | 17,200 | 536 | 11h04m | 9 |
| Asmr Create | 378 | 372 | 1m41s | 1 |

Two incidental findings first, both settled by measurement rather than argument:

- **`@AfricanNaturalAmbience` and `@AfricanVillageAmbienceASMR` are one
  channel.** Both handles resolve to channel id `UCZuABrnuUKp42i2VsgocmtA`,
  titled "African Village Ambience". It was renamed, not duplicated. The
  tracker now collapses aliases into one row.
- **The channel is growing**, slowly: 7 subscribers to 19 in five days, on 13
  uploads. Median views did not move (23 → 21).

## Rainlit Village is a different product

498,000 subscribers, and a **median video length of six and a half minutes**.
Its most recent upload is *"Cooking Baingan Fry & Drumstick Sambhar in the Rain
| ASMR Anime Village Life"* — 4,100 views in about two days, 7m30s long.

That is an **animated short-story channel**: stylised village life, food being
cooked, rain as atmosphere, in roughly the length of a music video. Only two
long-form videos exist on the channel at all, which means a 498,000-subscriber
base was not built on them — it was built on Shorts.

So the honest read is:

> Rainlit Village and African Village Ambience share a *mood* and nothing else.
> One sells seven minutes of watching someone cook in the rain. The other sells
> eight hours of not looking at the screen. The audiences overlap barely, the
> production pipelines not at all, and the growth mechanics not remotely —
> Shorts-driven discovery versus algorithmic long-form suggestion.

**Being inspired by it is fine. Copying its vibe into 8-hour dark-screen
ambience cannot reproduce its results,** because the vibe is not what produced
them. This is the single most important thing this run established.

## Rainy Village is the real like-for-like — and it is instructive

865 subscribers, 60 videos, median length exactly 1h00m, **0 uploads in the last
30 days**. Dormant, which is useful: its back catalogue shows what the format
earns with no publishing schedule propping it up.

Its top video, *"Heavy rain for deep sleep"*, has **13,000 views — 47x its own
median**. The rest of its outliers are the same shape:

- "Heavy rain for deep sleep"
- "The noise of nature for meditation. Heavy rain"
- "Sound of rain for deep sleep to relax"
- "Rain on the roof, relaxing noises"
- "ONLY THE SOUNDS OF RAIN/SOUNDS FOR SLEEP"

No emoji. No place names. No session numbers. No hours in the title. Every one
of them is **a plain description of a sound plus the state the listener wants.**
Compare ours: "Namibia Village at Sunset for Deep Sleep | 8 HOURS — Sleep
Session 03", "8 Hour Beautiful Africa Nature Equilibrium", "10 Hours of
Waterfall Sounds | Wli Village, Ghana".

This corroborates the intent-first finding from the previous run with a channel
in exactly our format, rather than by analogy from a reef channel and a sound
healer.

## The choice this forces

There are two coherent strategies here and they need different pipelines. The
mistake to avoid is running one channel that half-does both.

### Lane A — long-form ambience (what the channel is now)

Model **Blue Reef 4K**, not Rainlit Village. Blue Reef earns a median 10,000
views on 2,950 subscribers by publishing **41 times in 30 days at ~1h37m**.
That is the shape that works: near-daily, ~90 minutes, titled for intent and
spec.

Concretely, and unchanged from the last revision except that it is now
corroborated by a same-format channel:

1. **Drop from 8–10 hours to ~90 minutes.** An 8-hour render costs five upload
   slots and buys nothing the data supports. Rainy Village's 47x outlier is
   one hour long.
2. **Retitle the existing catalogue** in Rainy Village's register: sound +
   desired state, nothing else. Delete "Sleep Session 03", the hour counts, and
   the place names from the front of titles. This costs nothing — no re-render
   — and is the fastest test available.
3. **Publish daily.** At 90 minutes this is achievable from a synthesized bed;
   at 8 hours it is not.
4. **Keep rain as the spine.** Both of our best organic performers are rain,
   and the like-for-like channel's single biggest video is rain. The waterfall
   uploads (25, 5 and 4 views) are not the vein.
5. **Cut the off-lane uploads** — the focus timer, the countdown, the
   underwater video. The underwater one competes directly with Blue Reef 4K's
   10,000-view median, which is unwinnable, and costs the channel the only
   thing distinguishing it.

### Lane B — animated African village life (what Rainlit Village actually does)

This is the "same format, set in Africa" idea, and it is a genuinely strong
one: the format is proven at 498,000 subscribers, and nobody is running it for
African village life. Cooking jollof over a coal pot while rain hammers a tin
roof is exactly the same emotional product as cooking sambhar in the rain, and
it is unclaimed.

But be clear about what it costs:

- It is a **different channel**, or at minimum a different upload slate. Seven
  minutes of animated narrative and eight hours of black screen cannot share a
  subscriber base without confusing the algorithm about who to show either to.
- It is **Shorts-first**. Rainlit Village has two long-form videos. The 498,000
  subscribers came from Shorts, and any plan that skips Shorts is not modelling
  this channel.
- It needs **video generation**, which this repo cannot currently do. Both
  Gathos runs failed on `Missing GATHOS_VIDEO_KEY` — the repository secret has
  never been set. That is a five-minute fix and it is the gate on this entire
  lane.
- The **style boundary holds**: format, pacing and subject matter are fair to
  learn from; their scripts, artwork and specific characters are not, and
  nothing produced here may reuse them.

### The recommendation

**Run Lane A now and open Lane B as a separate channel.**

Lane A is producible today, end to end, with no missing credentials — the first
90-minute episode is built and waiting. Its remaining problem is titling, which
costs nothing to fix and is testable within a week.

Lane B is the bigger prize and the bigger build. Start it by setting
`GATHOS_VIDEO_KEY` and producing one 30-second Short, not by re-pointing the
existing channel at it.

## What still is not known

- **Rainlit Village's Shorts are invisible to the tracker.** It scans
  `/videos`, which is why only 2 uploads showed for a channel that clearly
  publishes far more. Reading `/shorts` is the highest-value next change to
  `competitor_tracker.py`, and without it the most important channel in the
  list is the one we can see least of.
- **Victoria named a second inspiration channel and the message was cut off
  before the link.** Nothing here accounts for it.
- **Nobody has listened to the synthesized rain bed yet.** It is verified by
  measurement only.

---

# The Shorts data, and what it overturns — 2026-08-26 (second run)

The first run of the day could only read `/videos`. That made Rainlit Village
look like a channel with two uploads and 498,000 subscribers, which was true
and useless. The tracker now reads `/shorts` as well, and the numbers are not
close.

## Rainlit Village is a Ghibli-style cooking channel

| Channel | Shorts scanned | Median views per Short |
|---|---:|---:|
| **Rainlit Village** | 45 | **472,000** |
| Dynasty Electrik | 54 | 3,000 |
| Asmr Create | 60 | 1,900 |
| **African Village Ambience (ours)** | 18 | **1,100** |
| Rainy Village | 60 | 894 |

Its top five Shorts:

| Views | Title |
|---:|---|
| **153,000,000** | Fresh Paneer Butter Masala & Naan on a Rainy Day 🌧️🍛 \| Village Cooking #ghiblistyle #asmr |
| 36,000,000 | Cooking Rajma Chawal on a Rainy Day 🌧️ \| #ghiblistyle #asmr #shorts |
| 25,000,000 | Cozy Rainy Day & Homemade Butter Chicken 🌧️🍛❤️ #ghiblistyle #asmr #shorts |
| 18,000,000 | A Cozy Rainy Morning in an Indian Village 🌧️ \| Idli & Filter Coffee #ghiblistyle #shorts |
| 13,000,000 | 🌧️Cooking Traditional Pulihora (tamarind rice) on a monsoon rainy day #ghiblistyle #asmr |

One video has **153 million views**. The formula does not vary: *one named
regional dish, cooked, on a rainy day, in an animated village, tagged
`#ghiblistyle #asmr #shorts`.* The rain is the atmosphere. **The food is the
subject.** That is the whole channel, and it is what 498,000 subscribers were
built on.

## Our own Shorts already outperform our long-form by 52x

This is the finding that should change what gets made this week.

| Format | Median views |
|---|---:|
| Long-form (13 uploads, median 8h00m) | **21** |
| Shorts (18 uploads) | **1,100** |

Top Shorts on the channel: "unboxing relaxing sound" (16,000), "Coconut
counting ASMR satisfying" (3,900), "unboxing relaxing part 2" (2,400),
"Satisfying Avocado Cutting 🥑" (1,800).

Two things follow, and they point the same way:

1. **The channel can already reach people. It is doing it on Shorts, and
   almost all of the production effort is going somewhere else.** An 8-hour
   render earns 4–25 views. A Short earns a median of 1,100 and has earned
   16,000.
2. **The Shorts that work are generic.** Unboxing, coconut counting, avocado
   cutting — satisfying-content filler that any channel could post. They pull
   views and give nobody a reason to subscribe to *this* channel. That is why
   16,000 views converted into a channel with 19 subscribers.

Rainlit Village solves exactly that problem: its Shorts are unmistakably one
channel, because every one of them is the same specific thing.

## The plan, revised

### Do this first: African village cooking Shorts

This is the "same format, in Africa" idea, it is now the best-evidenced move
available, and **it needs no new tooling to start** — it needs a decision about
what to film or generate, not a credential.

The formula, transposed honestly rather than copied:

- **One named dish per Short.** Jollof rice, egusi soup, injera and shiro,
  ugali and sukuma wiki, waakye, suya, chapati and beans, fufu and light soup.
  The specificity is the point — "Paneer Butter Masala" does the work that
  "Indian food" would not.
- **Rain as the setting, not the subject.** Rain on a tin roof over a coal pot.
- **A named place**, the way theirs says "an Indian Village": a Ghanaian
  compound, a Kenyan highland kitchen, a Lagos courtyard.
- **Consistent visual treatment**, so 45 Shorts read as one channel.
- **Cooking sounds, no narration.**

What must not be taken: their scripts, their artwork, their characters, or
their channel name. `#ghiblistyle` is also somebody's studio — describe the
look, don't invoke the brand.

The gate is real and small: video generation in this repo has never once
succeeded, because `GATHOS_VIDEO_KEY` has never been set as a repository
secret. Both attempts failed on exactly that. Setting it is the first task.

### Keep long-form, but stop over-investing in it

The 90-minute rain episode is built and is worth publishing — rain is the one
long-form vein with any pull, and 90 minutes costs a fifth of an 8-hour render.
But the data says long-form is not currently where this channel's audience is,
and it should stop consuming the bulk of the effort until Shorts have built a
subscriber base to send somewhere.

Retitling the existing catalogue in Rainy Village's register — sound plus
desired state, no emoji, no place, no hour count, no "Session 03" — remains the
cheapest experiment available and still costs nothing.

### What changed from the first revision, and why

The earlier conclusion — "model Blue Reef 4K, go to 90 minutes, publish daily"
— was right about long-form and wrong about priority. It was drawn from
long-form channels only, because Shorts were invisible to the tracker. Blue
Reef 4K is still the right model *for the long-form slate*. It is no longer the
right model for the channel.

## Limits of this data

- The Shorts tab returns no duration and no upload date under flat extraction,
  so Shorts cadence is unknown. View counts are real.
- 45 Shorts were scanned for Rainlit Village against a 60 cap, so this is most
  of what it has posted, not a sample of a much larger back catalogue.
- Nobody has listened to the synthesized rain bed.
- Victoria named a second inspiration channel and the message was cut off
  before the link. Nothing here accounts for it.
