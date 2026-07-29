#!/usr/bin/env python3
"""State management for the Give to Africa grant tracker.

The monitor uses this instead of hand-editing JSON, so dedupe, re-banding and
date maths stay consistent between runs.

    python3 tracker.py summary              # counts + what needs attention today
    python3 tracker.py alerts [--days 45]   # deadlines inside the window
    python3 tracker.py names                # every tracked name (for dedupe)
    python3 tracker.py check "<name>"       # is this already tracked?
    python3 tracker.py add --file new.json  # append (list or single object)
    python3 tracker.py reband               # re-derive priority bands from dates
    python3 tracker.py roster               # which searches to run today
"""

import argparse
import json
import os
import sys
from datetime import date, datetime, timedelta

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", "..", "..", ".."))
DATA = os.path.join(REPO, "grant-data", "grants.json")

REQUIRED = [
    "name", "funder_type", "status", "amount", "deadline", "deadline_iso",
    "eligibility", "fit", "website", "email", "phone", "link", "next_step",
    "verification",
]

URGENT_DAYS = 75  # band 1 threshold

# Rotating search themes so a daily run does not repeat yesterday's queries.
ROSTER = {
    0: ("Monday - U.S. federal & embassy",
        ["grants.gov Africa nonprofit new funding opportunity",
         "US embassy Ghana grants notice of funding opportunity",
         "State Department NOFO Africa civil society open",
         "USADF call for proposals Ghana"]),
    1: ("Tuesday - multilateral (UN, World Bank, AfDB)",
        ["UNDP Ghana call for proposals",
         "UN Women Africa call for proposals civil society",
         "GEF small grants programme Ghana call",
         "African Development Bank grant call NGO"]),
    2: ("Wednesday - bilateral & European donors",
        ["Canada Fund for Local Initiatives Ghana call",
         "GIZ KfW Ghana call for proposals",
         "FCDO funder finder Ghana civil society",
         "EU delegation Ghana call for proposals civil society"]),
    3: ("Thursday - climate, shea & agriculture",
        ["climate resilience grants West Africa open call",
         "shea value chain funding women cooperatives Ghana",
         "agriculture grant Sub-Saharan Africa cooperatives deadline",
         "women's economic empowerment Africa grant open"]),
    4: ("Friday - foundations, diaspora & corporate",
        ["African-led organizations foundation grant open application",
         "African diaspora fund grants apply",
         "corporate CSR Africa community grants application",
         "community philanthropy fund grant apply"]),
    5: ("Saturday - aggregators sweep",
        ["African NGO funding opportunities this month",
         "new grants for NGOs Africa deadline"]),
    6: ("Sunday - aggregators sweep",
        ["grants for nonprofits international development open deadline",
         "call for proposals Africa nonprofit new"]),
}


def load():
    with open(DATA, encoding="utf-8") as fh:
        return json.load(fh)


def save(grants):
    with open(DATA, "w", encoding="utf-8") as fh:
        json.dump(grants, fh, indent=2, ensure_ascii=False)


def parse_iso(value):
    try:
        return datetime.strptime(value, "%Y-%m-%d").date()
    except (ValueError, TypeError):
        return None


def days_out(g, today):
    d = parse_iso(g.get("deadline_iso", ""))
    return (d - today).days if d else None


def normalize(name):
    return "".join(ch for ch in name.lower() if ch.isalnum() or ch == " ").split()


def derive_band(g, today):
    """Bands 1-3 follow the calendar; band 4 is a human judgement we never override."""
    if g.get("priority") == 4:
        return 4
    n = days_out(g, today)
    if n is None:
        return g.get("priority", 2)
    if n < 0:
        return 3        # passed, but recurring -> calendar
    if n <= URGENT_DAYS:
        return 1
    return 2 if g.get("deadline_iso") in ("rolling", "none") else 3


def cmd_summary(args):
    today = date.today()
    grants = load()
    print(f"Grant tracker - {today:%A %B %d, %Y}")
    print(f"  {len(grants)} opportunities tracked\n")
    for pri in (1, 2, 3, 4):
        n = sum(1 for g in grants if g["priority"] == pri)
        print(f"  band {pri}: {n}")
    print()
    upcoming = []
    for g in grants:
        n = days_out(g, today)
        if n is not None and 0 <= n <= URGENT_DAYS:
            upcoming.append((n, g))
    if upcoming:
        print("Deadlines inside the next %d days:" % URGENT_DAYS)
        for n, g in sorted(upcoming):
            flag = "  <-- URGENT" if n <= 14 else ""
            print(f"  {n:4d}d  {g['deadline_iso']}  {g['name'][:64]}{flag}")
    else:
        print("No deadlines inside the alert window.")
    stale = [g for g in grants if g.get("deadline_iso") == "unknown"]
    if stale:
        print(f"\n{len(stale)} opportunities have an unknown deadline (worth confirming):")
        for g in stale:
            print(f"  - {g['name'][:70]}")


def cmd_alerts(args):
    today = date.today()
    out = []
    for g in load():
        n = days_out(g, today)
        if n is not None and 0 <= n <= args.days:
            out.append({"days": n, "deadline": g["deadline_iso"], "name": g["name"],
                        "next_step": g["next_step"]})
    print(json.dumps(sorted(out, key=lambda x: x["days"]), indent=2))


def cmd_names(args):
    for g in load():
        print(f"[{g['priority']}] {g['name']}")


def cmd_check(args):
    target = set(normalize(args.name))
    hits = []
    for g in load():
        words = set(normalize(g["name"]))
        if not target or not words:
            continue
        overlap = len(target & words) / min(len(target), len(words))
        if overlap >= 0.5:
            hits.append((round(overlap, 2), g["name"]))
    if hits:
        print("LIKELY ALREADY TRACKED:")
        for score, name in sorted(hits, reverse=True):
            print(f"  {score}  {name}")
    else:
        print("NOT TRACKED - safe to add")


def cmd_add(args):
    with open(args.file, encoding="utf-8") as fh:
        incoming = json.load(fh)
    if isinstance(incoming, dict):
        incoming = [incoming]

    grants = load()
    existing = [set(normalize(g["name"])) for g in grants]
    today = date.today()
    added, skipped = [], []

    for item in incoming:
        missing = [k for k in REQUIRED if k not in item]
        if missing:
            sys.exit(f"ERROR: '{item.get('name', '?')}' is missing fields: {missing}")

        words = set(normalize(item["name"]))
        if any(words and e and len(words & e) / min(len(words), len(e)) >= 0.5 for e in existing):
            skipped.append(item["name"])
            continue

        item.setdefault("first_seen", today.isoformat())
        item["priority"] = derive_band(item, today)
        grants.append(item)
        existing.append(words)
        added.append(f"[band {item['priority']}] {item['name']}")

    save(grants)
    for a in added:
        print(f"ADDED    {a}")
    for s in skipped:
        print(f"SKIPPED  already tracked: {s}")
    print(f"\n{len(added)} added, {len(skipped)} skipped. {len(grants)} total.")


def cmd_reband(args):
    today = date.today()
    grants = load()
    moves = []
    for g in grants:
        old = g["priority"]
        new = derive_band(g, today)
        if new != old:
            g["priority"] = new
            moves.append(f"  {g['name'][:60]}: band {old} -> {new}")
    save(grants)
    if moves:
        print("Re-banded:")
        print("\n".join(moves))
    else:
        print("No band changes.")


def cmd_roster(args):
    idx = date.today().weekday()
    label, queries = ROSTER[idx]
    print(label)
    for q in queries:
        print(f"  - {q}")


def main():
    p = argparse.ArgumentParser(description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)

    sub.add_parser("summary").set_defaults(fn=cmd_summary)
    sub.add_parser("names").set_defaults(fn=cmd_names)
    sub.add_parser("reband").set_defaults(fn=cmd_reband)
    sub.add_parser("roster").set_defaults(fn=cmd_roster)

    a = sub.add_parser("alerts")
    a.add_argument("--days", type=int, default=URGENT_DAYS)
    a.set_defaults(fn=cmd_alerts)

    c = sub.add_parser("check")
    c.add_argument("name")
    c.set_defaults(fn=cmd_check)

    d = sub.add_parser("add")
    d.add_argument("--file", required=True)
    d.set_defaults(fn=cmd_add)

    args = p.parse_args()
    args.fn(args)


if __name__ == "__main__":
    main()
