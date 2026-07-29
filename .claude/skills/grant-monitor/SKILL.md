---
name: grant-monitor
description: "Daily monitoring of open grant opportunities for Give to Africa. Runs a rotating set of funder searches, dedupes against the existing pipeline, re-bands opportunities as deadlines approach or pass, and reports only what changed. Use when the user asks to check for new grants, run the daily grant check, update the grant tracker, asks 'any new grants?', or when a scheduled daily grant-monitoring run fires. For a broad one-off prospect search (donors, consulting clients, first-time grant research) use nonprofit-prospect-search instead -- this skill maintains an existing pipeline rather than building one from scratch."
---

# Grant Monitor (Give to Africa)

Keeps `Give-to-Africa-Grant-Pipeline-2026.xlsx` current. The job each run is to
answer one question: **what changed since yesterday?**

A run that finds nothing new is a success, and should say so in two lines.
Do not pad a quiet day with restated context.

## Files

| Path | Role |
|---|---|
| `grant-data/grants.json` | Source of truth. Edit via `tracker.py`, not by hand. |
| `build_grant_tracker.py` | Renders the JSON into the .xlsx. Run after every change. |
| `.claude/skills/grant-monitor/scripts/tracker.py` | Dedupe, re-banding, alerts, search roster. |
| `Give-to-Africa-Grant-Pipeline-2026.xlsx` | The deliverable Victoria opens. Generated - never edit directly. |

Give to Africa's programs and eligibility are in
`references/give-to-africa-context.md`. Read it before judging fit.

## Run sequence

```bash
cd <repo root>
python3 .claude/skills/grant-monitor/scripts/tracker.py reband    # dates -> bands
python3 .claude/skills/grant-monitor/scripts/tracker.py summary   # what needs attention
python3 .claude/skills/grant-monitor/scripts/tracker.py roster    # today's searches
```

**1. Re-band and review.** `reband` moves opportunities between bands as deadlines
approach and pass. `summary` prints upcoming deadlines and flags entries whose
deadline is still `unknown` — those are worth a confirming search even if nothing
new turns up.

**2. Search today's roster.** `roster` gives 2-4 queries chosen by weekday, so
consecutive days cover different funder families instead of repeating. Run all of
them. Add one or two of your own if something in `summary` needs chasing — for
example, an `unknown` deadline on a promising funder.

**3. Triage each hit.** Before adding anything:

```bash
python3 .claude/skills/grant-monitor/scripts/tracker.py check "Funder Name"
```

Add it only if it is **all** of: genuinely new (not just a new article about a
tracked call), plausibly a fit for one of the four programs, and open or
recurring. A closed one-off that Give to Africa could never have applied for is
noise — leave it out.

**4. Add what survives.** Write the rows to a temp file and add them:

```bash
python3 .claude/skills/grant-monitor/scripts/tracker.py add --file /tmp/new-grants.json
```

Every object needs all of: `name`, `funder_type`, `status`, `amount`, `deadline`,
`deadline_iso`, `eligibility`, `fit`, `website`, `email`, `phone`,
`how_to_apply`, `link`, `next_step`, `verification`. The script sets `priority`
and `first_seen`, and refuses near-duplicate names.

**`how_to_apply` is the field Victoria actually uses, and it must answer one
question: what do I click or email, right now?** A source article is not an
application route. Before writing it, find the funder's real submission page and
say which of these applies:

- `APPLY HERE: <url>` — a live form or portal she can open today.
- `APPLY ON GRANTS.GOV` — with the opportunity number, plus a warning if SAM.gov
  registration is needed and the deadline is too close to complete it.
- `EMAIL <address>` — when submission is by email, or when no form is posted
  between cycles and the address is how you get the pack.
- `NO OPEN CALL` / `NO APPLICATION ROUTE` / `NOT A GRANT` — say so plainly and
  give the real alternative (who to contact, what to watch). Never imply a portal
  exists when it does not.

Also note portal prerequisites that take time — SAM.gov and grants.gov
registration, a Government of Canada GCKey, a UNDEF OPPS org profile, an IFE
SmartME account. These take days to weeks and are the usual reason a real
deadline becomes unreachable. Flag them before the deadline, not after.

**Verify the domain.** Confirm the funder's live website rather than trusting an
address that appears in an aggregator summary — an email domain is often not the
website domain.

`deadline_iso` must be `YYYY-MM-DD`, or one of `rolling`, `none`, `unknown`.
For a recurring call that just closed, use **next year's expected date** so it
resurfaces at the right time — that is how closed-but-recurring opportunities
earn their place in the tracker.

**5. Rebuild and commit.**

```bash
python3 build_grant_tracker.py
git add -A && git commit -m "Grant monitor: <what changed>" && git push -u origin <branch>
```

Commit only when something actually changed. No change, no commit.

## Research discipline

Non-negotiable, and the reason this tracker is trustworthy:

- **Never invent a contact.** Not a name, not an email, not a phone number, and
  never a plausible-looking pattern like `grants@funder.org`. If it is not
  published on the funder's own site or an official listing, write
  `not publicly listed`. A guessed address that bounces costs Victoria a deadline.
- **Mark uncertainty as uncertainty.** If sources conflict or the funder's page
  cannot be reached, start `verification` with `NEEDS VERIFICATION` and say what
  is in doubt. The builder renders those in red.
- **Watch for grant scams.** Fake pages impersonating IFC, USAID and similar
  bodies are common. If a call is only visible on aggregator sites and never on
  the funder's own domain, flag it and say so. Never surface anything asking an
  applicant to pay a fee.
- **Prove a call is LIVE before listing it as open.** This is the failure mode
  that has actually bitten this tracker. Aggregator sites host undated archived
  calls that read exactly like current ones, and a closed call presented as open
  sends Victoria hunting for an application portal that does not exist. Before
  writing `status: OPEN`, confirm at least one of:
  - a stated deadline in the future, or
  - the call appearing on the funder's own domain with a current date, or
  - explicit "applications open" language tied to the current cycle.

  And actively look for evidence the door already closed: a parent project with a
  fixed multi-year term, named implementing partners already selected, or progress
  reports describing delivery rather than recruitment. A big multi-year programme
  in mid-delivery is almost never still recruiting partners. When the route is a
  relationship rather than an application, say `NO OPEN CALL` in the status and put
  the real next step — who to contact and why — in `next_step`.
- **Fit means a specific program.** Write which of the four programs it matches
  and why, not "good fit for Give to Africa." If the fit is weak, say it is weak —
  band 4 exists for that, and an honest "skip this" saves more time than a
  hopeful listing.
- **Eligibility is the first filter.** Give to Africa is a US 501(c)(3). Many
  Ghana-focused funders require a locally registered applicant, which means MDF
  Ghana applies and Give to Africa supports. Say which arrangement applies.
- Paraphrase what you find. Do not copy funder site text.

## Reporting

**Always write opportunities out in the chat reply. Never deliver them only as an
attached file, and do not call SendUserFile for the workbook.** Victoria reads
these in the conversation. The .xlsx is committed to the repo as a working record
she can open when she wants it — it is not the delivery mechanism.

End with a short digest, written out in full:

- **Urgent first:** any deadline inside 14 days, before anything else.
- **New:** each addition — name, amount, deadline, why it fits, next step.
- **Deadlines approaching:** anything inside 30 days, soonest first.
- **Changed:** re-bands and status changes worth knowing about.
- **Nothing new:** say exactly that, name the searches run, and stop.

When the user asks to see the pipeline, list the opportunities in the reply —
grouped by band, with amount, deadline and contact inline. A quiet day is still
two lines of text, not a file.

## Tool notes

Some environments block `WebFetch` (403 on every host) and direct API calls to
`grants.gov`. When that happens, `WebSearch` alone is enough — cross-reference two
or three independent listings before treating a detail as confirmed, and mark
anything you could not corroborate. Do not report a funder as unreachable without
trying search first.
