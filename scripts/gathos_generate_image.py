#!/usr/bin/env python3
"""
Generate a single image via Gathos.

Usage:
  python scripts/gathos_generate_image.py --prompt "A sunset over mountains" --out output.png
"""

import argparse
import os
import sys

import requests

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gathos_client import generate_image, extract_output, GathosError


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--prompt", required=True)
    parser.add_argument("--out", default="output.png")
    args = parser.parse_args()

    job = generate_image(args.prompt)
    url = extract_output(job)

    resp = requests.get(url, timeout=60)
    resp.raise_for_status()
    with open(args.out, "wb") as f:
        f.write(resp.content)

    print(f"Wrote {args.out}")


if __name__ == "__main__":
    try:
        main()
    except GathosError as e:
        print(f"Gathos error: {e}", file=sys.stderr)
        sys.exit(1)
