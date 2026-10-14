# Technical Guide: Workflows Surfaced in the @insiderforce Screen Recording

## Read this first: evidence status

| Item | Status |
|---|---|
| The MP4 (`Screen_Recording_20261012_203702_Instagram.mp4`, 193.1 s, ~65 MB) | **Not watched by me.** The Google Drive connector can't read video, and the Instagram host is blocked in this environment. |
| The source for this guide | The uploaded file `Claude_Instagram_Video_Analysis_1.md`, a **secondary storyboard summary** of the recording. It says its timestamps are approximate, audio was not transcribed, and tool names, figures and brand names are unverified. |
| What this guide is | A structured analysis of that summary, plus a general implementation playbook. Every claim is tagged. |
| What this guide is not | A verified frame-by-frame or word-for-word account of the video. |

### Evidence tags used throughout

- **[OBS-S]**: Observed per the storyboard summary (second-hand: someone or something else looked at the frames, not me).
- **[INT]**: Interpretation. A reasonable reading, not established.
- **[GEN]**: General knowledge or best practice from me, not shown in the recording.
- **[VERIFY]**: A fact, price, policy or feature that must be checked against a primary source before you rely on it.
- **[NOT ESTABLISHED]**: A step or detail the recording does not establish.

**To get a verified version:** send (a) the MP4 directly in chat (not via Drive), or 8–12 paused screenshots, and (b) the permalink of each individual Reel. Chapter 12 lists exactly what to check.

---

## Table of contents

1. How to read the recording: structure and limits
2. Segment-by-segment documentation (A–H)
3. Chapter: Instagram comment-to-DM automation
4. Chapter: AI-assisted marketing video creation
5. Chapter: Claude agent workflows (plan, verify, skills)
6. Chapter: Efficient AI model usage (RAM, model size, hosted vs local)
7. Chapter: Lead tracking and attribution
8. Chapter: Sales-moment preparation
9. Security, privacy, compliance and platform policy
10. Adaptation for the four organizations
11. Test procedure and success criteria
12. Comparison table, roadmap, reusable prompts, uncertainties

---

## 1. How to read the recording: structure and limits

**[OBS-S]** The recording is a portrait mobile screen recording of the Instagram account @insiderforce. It scrolls among *multiple* posts and Reels. It is **not** one continuous tutorial. Each topic below is a separate clip or Reel that the creator posted, so there is no single end-to-end workflow.

**[OBS-S]** The summary flags these limits itself:
- Timestamps come from sampled frames, not edit boundaries.
- Audio was not transcribed. Any voiceover content is inferred.
- The last ~88 seconds (105–193 s) were not itemized.

**Consequence:** nothing here can be reproduced as "the creator's exact method." The tutorials in this guide are **[GEN]** implementations of the *ideas* the clips advertise.

---

## 2. Segment-by-segment documentation

Timestamps are the storyboard's approximate windows. Boundaries are uncertain by several seconds.

Each segment follows the same layout: (1) timestamps, (2) shown/said (observed vs interpreted), (3) apps/models/features/UI, (4) objective, (5) actions in sequence, (6) reproducible tutorial, (7) accounts/costs/alternatives, (8) prompts/automation logic, (9) risk, (10) adaptation, (11) test. For items 6–11, segments point to the relevant chapter to avoid repeating the same material.

### Segment A: 0–6 s: "installs them for you automatically"

1. **Timestamps:** ~0–6 s (approximate).
2. **Shown/said:**
   - **[OBS-S]** An AI tool/software interface. On-screen text: "installs them for you automatically." A quick glimpse of a hardware/tech-related Reel.
   - **[INT]** A claim that an AI agent sets up software or tools without manual steps.
   - **[NOT ESTABLISHED]** What "them" refers to.
3. **Identifiable apps/features:** None named. **[NOT ESTABLISHED]**
4. **Objective:** **[INT]** Automate setup or installation. Unverified.
5. **Actions in sequence:** **[NOT ESTABLISHED]** No clicks, inputs or settings are recorded in the summary.
6. **Tutorial:** Cannot be written from this evidence. See Chapter 5 for the closest general pattern (agent-assisted setup with plan and verify).
7. **Accounts/costs:** **[NOT ESTABLISHED]**
8–11. Not applicable until the tool is identified.
- **Needed from you:** the Reel permalink, or a screenshot showing the tool name.

### Segment B: 6–12 s: Profile grid and analytics-style dashboards

1. **Timestamps:** ~6–12 s.
2. **Shown/said:**
   - **[OBS-S]** The Instagram profile @insiderforce with many thumbnails. A Reel showing "you can manage" alongside analytics-style dashboards.
   - **[INT]** The creator aggregates AI tool and growth/automation demos.
3. **Identifiable:** Instagram profile UI, Reels grid. Dashboard product **not named**.
4. **Objective:** **[INT]** Positioning, showing a catalog of automation demos.
5. **Actions:** Scrolling the profile. **[NOT ESTABLISHED]** beyond that.
6. **Tutorial:** None. This is context, not a workflow.
7–11. Not applicable. The only useful takeaway is the *content format*: many short demos on one theme, which suits a content-series strategy (Chapter 10).

### Segment C: 12–21 s: ManyChat comparison and video studio

1. **Timestamps:** ~12–21 s.
2. **Shown/said:**
   - **[OBS-S]** Text "a viral reel should be a win" and "with ManyChat it is also a big invoice." The creator opens a video-studio interface, with "Click video studio."
   - **[INT]** The pitch is that comment-to-DM tools priced per contact get expensive when a Reel goes viral. This sets up an alternative product.
3. **Identifiable:**
   - **ManyChat** (named on screen). A real commercial product. **[VERIFY]** its current pricing model.
   - A "video studio" UI. Product **not named**.
4. **Objective:** **[INT]** Argue for cost-predictable comment-to-DM automation, then pivot to video creation.
5. **Actions:** "Click video studio": one click. Nothing further is established.
6. **Tutorial:** See Chapter 3 (comment-to-DM) and Chapter 4 (video).
7. **Costs:** The claim that ManyChat costs scale with contacts is the creator's. **[VERIFY]** against ManyChat's current pricing page. I'm not stating any price.
- Segments C, D, E, F, G and H together carry the comment-to-DM theme. Details are consolidated in Chapter 3.

### Segment D: 21–30 s: RAM, workflow diagram, DM speed

1. **Timestamps:** ~21–30 s.
2. **Shown/said:**
   - **[OBS-S]** "your machine actually needs is RAM at any given moment"; "inside are AI" over an agent/workflow diagram; "No"; a DM conversation UI; "they get your link in their DMs before they even finish scrolling."
   - **[INT]** At least three separate clips are spliced: (a) memory optimization for running models, (b) AI agent workflows, (c) fast automated DM replies.
3. **Identifiable:** Instagram DM UI. Workflow diagram product **not named**.
4. **Objective:** (a) fit more model in less memory; (c) deliver a link instantly after a comment.
5. **Actions:** None established.
6. **Tutorial:** Chapter 6 (RAM), Chapter 3 (DM speed).
7–11. See chapters.
- **Caution:** "before they even finish scrolling" is a marketing claim. Real latency depends on the tool and Meta's API. **[VERIFY]** by measuring (Chapter 11).

### Segment E: 30–42 s: "372", a model discussion, COLIBRI, pricing claims

1. **Timestamps:** ~30–42 s.
2. **Shown/said:**
   - **[OBS-S]** "normally needs 372" with a software chart; "it keeps only the parts of the model"; "COLIBRI"; "No per contact pricing"; "No plan that caps out when your audience grows"; "No bill that punishes you for going viral."
   - **[INT]** Two topics: (1) a memory-efficient method that loads only part of a model; (2) a comment-automation product pitched as having no per-contact pricing.
3. **Identifiable:**
   - "COLIBRI": **spelling and identity unverified**. It might be a product, a model or a brand.
   - "372": **unit not established** (GB? billions? something else?).
4. **Objective:** (1) run big models on small hardware; (2) escape per-contact pricing.
5. **Actions:** None established.
6. **Tutorial:** None. Treat both claims as marketing until verified.
7. **Costs:** "No per contact pricing" is a claim. **[VERIFY]** by reading the vendor's pricing page and terms. Look for message caps, fair-use limits and API-rate limits that could still constrain a viral Reel.
- **Needed from you:** the permalink for the COLIBRI clip, plus a zoomed screenshot of the "372" chart.

### Segment F: 42–54 s: Comment watching, caption slides, viral-style video

1. **Timestamps:** ~42–54 s.
2. **Shown/said:**
   - **[OBS-S]** Instagram comments UI; "that watches your instagram comments 24/7"; a caption-heavy slide; "You just tell it what you're building"; "you can create viral style"; a gallery of product reels.
   - **[INT]** An agent watches comments and replies by DM, and a separate AI feature generates marketing videos from a plain-language description.
3. **Identifiable:** Instagram comments UI. Tool names **not established**.
4. **Objective:** Continuous comment monitoring; natural-language video generation.
5. **Actions:** Describing what you're building: one natural-language input. Details **[NOT ESTABLISHED]**.
6. **Tutorial:** Chapters 3 and 4.
7–11. See chapters.

### Segment G: 54–72 s: Claude plan/verify workflow, "complete AI workflow", lead detail

1. **Timestamps:** ~54–72 s.
2. **Shown/said:**
   - **[OBS-S]** "You give it a task and it forces Claude to: Slowdown. Build a proper plan. And verify its own work before touching a single line"; "each one is a complete AI workflow"; "running a frontier AI model"; a person at a coding workstation; "Not just who commented / Not just who got the DM."
   - **[INT]** A packaged Claude "skill" or prompt that imposes plan-then-verify behavior. Separately, richer lead tracking beyond comment and DM counts.
3. **Identifiable:** **Claude** (named). The packaging mechanism (skill, CLAUDE.md, custom instruction, plugin) is **[NOT ESTABLISHED]**.
4. **Objective:** More reliable AI coding output; better lead attribution.
5. **Actions:** Give Claude a task. The constraints (slow down, plan, verify) are on-screen text. No settings or UI steps are shown.
6. **Tutorial:** Chapter 5 and Chapter 7.
7. **Costs:** **[VERIFY]** current Claude plan pricing at anthropic.com. No figure is stated here.

### Segment H: 72–105 s: Sales moments, product video, model hosting, tracked link, 744B

1. **Timestamps:** ~72–105 s (summary rows 72–90 and 90–105 combined).
2. **Shown/said:**
   - **[OBS-S]** "going into any high stakes sales moment"; an e-commerce product image demo; "a viral reel should be a win" (repeated); a model-website screenshot, "These models do not fit in your machine. They run in a factory"; "No per contact pricing" (repeated); "plug in a" over "Click the Link below / Tracked Link"; product assets on a tablet; "and the skill handles the entire production automatically"; "744 billion parameter" with a robot/computer visual.
   - **[INT]** Mixed Reels: sales-prep AI, automated product-video pipeline, a hosted-model service, a tracked-link attribution step, a very large model.
3. **Identifiable:** Model website and tool names **not established**. "744 billion parameter" is an on-screen figure. **[VERIFY]** which model it refers to.
4. **Objective:** See the corresponding chapters.
5. **Actions:** "Click the Link below" is a viewer CTA, not a demo step.
6. **Tutorial:** Chapters 4, 6, 7, 8.

### Segment I: 105–193 s: not itemized

**[NOT ESTABLISHED]** About 88 seconds (45% of the recording) were not described beyond "the final series of posts." Anything in this span is **unknown to this guide**. This is the largest gap, and the main reason I need the video itself.

---

## 3. Chapter: Instagram comment-to-DM automation

### 3.1 What the recording supports
- **[OBS-S]** A comparison with ManyChat; claims of "no per contact pricing," "no plan that caps out," "no bill that punishes you for going viral"; "watches your instagram comments 24/7"; "they get your link in their DMs before they even finish scrolling"; a "Tracked Link" element.
- **[NOT ESTABLISHED]** The product's name, how it is set up, its keyword rules, the exact funnel on screen.

### 3.2 The generic funnel (from the summary, labeled **[GEN]** where expanded)
Reel with a keyword CTA → viewer comments keyword → tool detects comment → tool sends a DM with a link → tracked click → opt-in / booking / donation → conversion reporting.

### 3.3 Reproducible implementation (general, **[GEN]**)
This works with any tool that supports the pattern. **[NOT ESTABLISHED]** that it matches the creator's tool.

**Prerequisites**
1. An Instagram **professional** (Business or Creator) account. **[VERIFY]** current Meta requirements.
2. Usually a linked Facebook Page. **[VERIFY]**
3. A comment-to-DM tool. Options: ManyChat (named in the recording), the tool in RobinReach (this workspace has a `comment_automations_*` toolset that does exactly this; availability depends on plan, **[VERIFY]**), or the unnamed "COLIBRI."
4. A landing page or form that accepts the click.

**Steps**
1. Choose one keyword per Reel (e.g. `GRANT`). Short, unambiguous, easy to type.
2. In the tool, connect the Instagram account through Meta's login flow and grant messaging permissions.
3. Create an automation: trigger = comment on a specific post containing the keyword (or any keyword variants).
4. Action 1: public reply to the comment (optional, varies by tool).
5. Action 2: send a DM with a short message and one link.
6. Make every link carry UTM parameters (Chapter 7).
7. Publish the Reel with an on-screen and caption CTA: "Comment GRANT and I'll send it."
8. Test with a second account before publishing (Chapter 11).

### 3.4 Example DM copy
> Hi! Thanks for commenting. Here's the nonprofit funding checklist you asked for: {tracked link}. Reply STOP anytime and we won't message you again.

### 3.5 Pricing and free alternatives
- **Costs:** **[VERIFY]**. I state no prices. Check the pricing page of each tool for how it counts contacts, messages and automations.
- **Free options, if confirmed:** many tools have a free tier with contact or feature limits **[VERIFY]**. A no-automation fallback is a pinned comment with the link in bio, which is manual and slower.

### 3.6 Reliability and policy
See Chapter 9. The key risk: automation depends on Meta's API rules and rate limits, which change.

---

## 4. Chapter: AI-assisted marketing video creation

### 4.1 What the recording supports
- **[OBS-S]** "Click video studio"; "You just tell it what you're building"; "you can create viral style"; a gallery of product reels; product assets on a tablet; "the skill handles the entire production automatically."
- **[NOT ESTABLISHED]** The tool, the underlying model, the pipeline, the quality, the time and the cost.

### 4.2 Generic pipeline **[GEN]**
1. Brief: audience, goal, one CTA.
2. Inputs: brand assets, images, script.
3. Generate storyboard or script.
4. Generate video variants.
5. Human review for accuracy, rights, tone.
6. Add captions and the CTA.
7. Publish and measure.

### 4.3 Tools available in *this* workspace **[VERIFY availability and cost per tool]**
- HeyGen (avatar videos, templates), ImagineArt (generated video and captions), Canva (design), RobinReach (scheduling).
- The Anthropic skills `script-to-reel` and `video-script-writer` are listed in this session.
- **[NOT ESTABLISHED]** That any of these is what the creator used.

### 4.4 Example prompt
> Write a 30-second vertical Reel script for {org}. Audience: {audience}. One idea only: {idea}. Hook in the first 2 seconds. Max 6 on-screen text lines, ≤7 words each. End with the CTA "Comment {KEYWORD}". Flag every factual claim that needs a source.

### 4.5 Risks
Fabricated facts, unlicensed assets, synthetic voices or likenesses without consent, and platform labeling rules for AI-generated media **[VERIFY current Instagram policy]**.

---

## 5. Chapter: Claude agent workflows

### 5.1 What the recording supports
- **[OBS-S]** On-screen text: you give a task and it makes Claude "Slowdown. Build a proper plan. And verify its own work before touching a single line." Also "each one is a complete AI workflow" and "running a frontier AI model."
- **[NOT ESTABLISHED]** What product packages this, and whether it is a Claude Code skill, a CLAUDE.md, a prompt template or a third-party tool.

### 5.2 Reproducible pattern **[GEN]**
This is a standard, well-understood practice. It needs no special product.

1. Put the rules in the repo's `CLAUDE.md` (or a Claude Code skill) so they apply every session.
2. Require a written plan before any edit.
3. Require a verification step (tests, lint, a diff review) before reporting done.
4. Keep changes small and reviewable.

### 5.3 Reusable instruction block
> Before changing any file: (1) restate the task and acceptance criteria; (2) inspect the relevant code; (3) write a numbered plan and wait for my approval if the change is risky or touches more than {N} files; (4) make small changes; (5) run the project's tests and linters; (6) report what you ran, what passed, what failed, and what you did not verify. Never claim something works without evidence.

### 5.4 Accounts and cost
Claude access (Claude Code requires an eligible plan or API key). **[VERIFY]** current plans and prices.

---

## 6. Chapter: Efficient AI model usage

### 6.1 What the recording supports
- **[OBS-S]** "your machine actually needs is RAM at any given moment"; "normally needs 372" (unit unknown); "it keeps only the parts of the model"; "These models do not fit in your machine. They run in a factory"; "744 billion parameter."
- **[INT]** One clip describes loading only the needed parts of a model to save memory. Another says the largest models must run on hosted infrastructure.
- **[NOT ESTABLISHED]** The method's name, the model, the "372" unit, and any benchmark result. Do not cite these numbers anywhere.

### 6.2 General decision guide **[GEN]**
| Need | Practical choice |
|---|---|
| Drafting, summarizing, social copy | A hosted general model, picked by cost per task |
| Sensitive donor/beneficiary data that must not leave your systems | A smaller local model, or a hosted provider with a signed data-processing agreement **[VERIFY]** |
| Heavy reasoning or coding | A frontier hosted model |
| High-volume, simple classification | The cheapest model that passes your test set |

Rule of thumb: test the cheapest model first on 20 real examples; move up only if it fails your criteria.

---

## 7. Chapter: Lead tracking and attribution

### 7.1 What the recording supports
- **[OBS-S]** "Not just who commented / Not just who got the DM"; "Click the Link below / Tracked Link."
- **[INT]** The pitch is that attribution should extend past comment and DM counts to link clicks and, presumably, downstream actions.
- **[NOT ESTABLISHED]** Which tool tracks it, which fields it stores, any dashboard layout.

### 7.2 Suggested data model **[GEN]**
| Field | Purpose |
|---|---|
| Date/time of comment | Funnel start |
| Instagram handle | Identity (see consent, Chapter 9) |
| Reel ID / keyword | Source |
| DM sent (Y/N) and time | Delivery |
| Link clicked (Y/N) and time | Intent |
| Opt-in / booking / application / donation | Conversion |
| Qualified (Y/N) and owner | Sales follow-up |

### 7.3 Implementation
1. Use one UTM-tagged link per Reel (`utm_source=instagram&utm_medium=reel&utm_campaign={reel-id}`).
2. Log events in a sheet, Airtable, monday.com or a CRM. Connectors for several of these are in this workspace **[VERIFY each is authorized]**.
3. Review weekly.

---

## 8. Chapter: Sales-moment preparation

- **[OBS-S]** Only the phrase "going into any high stakes sales moment" and an unnamed product.
- **[NOT ESTABLISHED]** Everything else. Nothing is documented here beyond this note, to avoid inventing a workflow. If you want one, the closest in-workspace tools are the `carta-crm:prepare-for-meeting` and `legal:meeting-briefing` skills, but that is my suggestion, not the recording's.

---

## 9. Security, privacy, compliance and platform policy

All **[GEN]**. **[VERIFY]** each against current primary sources before launch.

- **Meta platform rules:** automated messaging must use the official API and permissions. Messaging windows and per-comment reply limits exist and have changed over time. Read the current Instagram Messaging API docs.
- **Consent and unsolicited messaging:** the commenter initiates the exchange, which is the safer pattern. Do not DM people who did not engage. Include an easy opt-out.
- **Data protection:** handles and message content are personal data. Depending on your audience, GDPR, UK GDPR, CCPA/CPRA, Kenya's and Nigeria's data protection laws and others may apply. Get legal review.
- **Donor and beneficiary data:** do not paste it into third-party AI tools without a vetted agreement.
- **Third-party credentials:** automation tools hold OAuth tokens for your Instagram account. Use unique strong passwords, 2FA, least-privilege access, and revoke access when you stop using a tool.
- **Vendor risk:** a tool that is "cheaper than ManyChat" may be new or unproven. Check company history, data location, uptime, support and terms of service.
- **AI-generated content:** accuracy review, copyright and likeness rights, and disclosure rules.
- **Charitable-solicitation rules:** fundraising messages may carry registration and disclosure requirements by jurisdiction **[VERIFY]**.
- **Reliability:** API outages, webhook delays and permission revocations happen. Keep a manual fallback (pinned comment plus link in bio) and monitor delivery.

---

## 10. Adaptation for the four organizations

**Caveat:** I know only what the surrounding workspace shows (for example, Give to Africa has pre-loaded skills, and this repo is `claudevictoria`). I have no verified facts about YENDAA's mission or audience. Treat the YENDAA entry as a template.

### Philips Nonprofit Consulting
- **Offer:** keyword `GRANT` → funding-readiness checklist → booking page.
- **Metric:** booked consultations per Reel.
- **Note:** consultancy claims must be accurate and consistent with what the firm really delivers.

### NonprofitDaily
- **Offer:** cut each long video into short Reels, each with one idea and one CTA (`TEMPLATE`, `CHECKLIST`).
- **Metric:** newsletter or community sign-ups per Reel.
- **Note:** source-check every statistic before publishing.

### Give to Africa
- **Offer:** keyword `IMPACT` → a story, a donation page, or a partner guide.
- **Metric:** completed donations and recurring-donor sign-ups, not only clicks.
- **Note:** use the voice rules in the `give-to-africa:social-content` and `give-to-africa:impact-story` skills (warm, urgent, hopeful, centered on community agency, no savior framing). Obtain consent from anyone shown or quoted. Be careful with fundraising-compliance wording.

### YENDAA
- **Offer:** keyword-to-DM delivering the main onboarding or program resource, then a vetted application or sign-up page.
- **Metric:** completed applications or sign-ups.
- **Note:** **[NOT ESTABLISHED]** the organization's specifics. Please send a one-paragraph description so I can tailor this.

---

## 11. Test procedure and success criteria

### 11.1 Pre-launch test (comment-to-DM)
1. Create a test post (or Reel) on the real account, or on a throwaway professional account.
2. From a second account, comment the exact keyword, then each variant (case, spaces, emoji, typos).
3. Record: time from comment to DM; whether the DM arrived; whether the link works; whether the tracking parameters register.
4. Test a non-keyword comment (must not trigger).
5. Test a repeat comment from the same account (check duplicate behavior).
6. Test opt-out wording.
7. Simulate a burst: ask 5–10 people to comment within a minute; check that all are delivered.

### 11.2 Success criteria (starting thresholds; adjust to your baseline)
| Metric | Starting target |
|---|---|
| Keyword comment → DM delivered | ≥ 95% in testing |
| Median delay comment → DM | Under 60 s (measure; don't assume the "before they finish scrolling" claim) |
| False triggers on non-keyword comments | 0 in testing |
| DM link click rate | Establish a baseline in the first 5 Reels, then improve |
| Click → conversion | Baseline first, then improve |
| Complaints / blocks / opt-outs | Track; investigate any rise |
| Cost per qualified lead | Track against a manual baseline |

### 11.3 AI video test
Generate 3 variants for one script; score each on accuracy, brand fit, caption legibility and watch-through against your last 5 manual Reels.

### 11.4 Claude workflow test
Run the same small task with and without the plan/verify block (5.3). Compare defects found in review.

---

## 12. Comparison table, roadmap, reusable prompts, uncertainties

### 12.1 Comparison table

| Dimension | ManyChat (named in recording) | "COLIBRI" (unverified) | RobinReach comment automations (in this workspace) | Manual pinned comment + link in bio |
|---|---|---|---|---|
| Evidence in recording | Named, called costly at scale [OBS-S] | Name appears; identity unverified | Not in recording | Not in recording |
| Pricing | [VERIFY] | [VERIFY]; "no per contact pricing" is the claim | [VERIFY] plan limits | Free |
| Speed | [VERIFY] | [VERIFY] | [VERIFY] | Slow and manual |
| Setup effort | [VERIFY] | [VERIFY] | Tools already connected here | None |
| Lock-in risk | [VERIFY] | [VERIFY] | [VERIFY] | None |
| Best first use | Benchmark | Evaluate only after verification | Fastest pilot for this account | Fallback |

### 12.2 Prioritized roadmap

1. **Week 0: verify.** Send the MP4 or screenshots plus permalinks. Resolve the Appendix items for the clips you care about.
2. **Week 1: policy and data.** Read Meta's current messaging rules. Draft the consent and opt-out wording. Decide the data model (7.2).
3. **Week 1–2: pilot one funnel.** One org, one keyword, one Reel, one tool (start with what you already have access to). Run the test in Chapter 11.
4. **Week 3: measure.** Compare against the success criteria. Decide continue, fix or stop.
5. **Week 4–6: extend.** Roll to a second organization. Add AI-assisted video only after the funnel works.
6. **Ongoing:** adopt the Claude plan/verify block (5.3) for any code or automation changes. Re-check platform policy quarterly.

### 12.3 Reusable prompts

**A. Verify a Reel (give to me with the video or screenshots)**
> Watch this Reel. List, with timestamps: every on-screen text string verbatim, every app/site/model named, every click or setting shown, and every number. Mark anything you inferred as inferred. Do not guess names you can't read.

**B. Comment-to-DM design**
> Design a comment-to-DM funnel for {org}. Keyword: {KEYWORD}. Asset delivered: {asset}. Give: the Reel CTA wording, the DM copy (≤40 words, with opt-out), the tracked link format, the event table to log, and the test cases.

**C. Reel from long video**
> From this transcript, extract 5 candidate Reels. For each: hook (≤10 words), 3 key points, the single CTA keyword, and any claim needing a source. Preserve the speaker's meaning; do not add facts.

**D. Compliance check**
> Review this campaign for privacy, consent, Meta platform policy and charitable-solicitation risks in {jurisdictions}. List risks, severity and what I must verify with counsel. Do not give legal conclusions.

**E. Agent guardrail**: use the block in 5.3.

### 12.4 Appendix: uncertainties requiring verification

| # | Uncertainty | How to resolve |
|---|---|---|
| 1 | Whether the MP4's actual content matches the storyboard summary | Send the MP4 or paused screenshots |
| 2 | Exact timestamps for every clip | Full-speed review of the MP4 |
| 3 | Contents of 105–193 s | Same |
| 4 | Identity and spelling of "COLIBRI" | Permalink plus a zoomed screenshot |
| 5 | Name of the video studio / production "skill" | Permalink plus screenshots |
| 6 | Name of the workflow/agent diagram product (Segment D) | Screenshots |
| 7 | What "372" measures and its unit | Zoomed screenshot |
| 8 | Which model is "744 billion parameter" | Screenshot of the post |
| 9 | Whether any claim (no caps, instant delivery, "24/7") holds | Vendor docs plus the Chapter 11 test |
| 10 | Pricing of every tool named | Vendor pricing pages (not stated in this guide) |
| 11 | Current Meta messaging and automation rules | Meta developer documentation |
| 12 | What "installs them for you automatically" refers to (Segment A) | Permalink |
| 13 | How the Claude plan/verify workflow is packaged | Permalink; check whether the creator links a repo |
| 14 | YENDAA's mission, audience and constraints | Your description |
| 15 | Whether RobinReach's comment automations are enabled on your plan | Check `comment_automations_list` in the account |
| 16 | Audio and voiceover content | Not transcribed in the summary; needs the video |
| 17 | Who owns the content and whether you may reuse the ideas or assets | Review the creator's terms; reuse the ideas, not their assets |

---

*Basis: the storyboard summary `Claude_Instagram_Video_Analysis_1.md` only. The video itself has not been viewed.*
