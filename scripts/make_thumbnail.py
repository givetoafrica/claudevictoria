#!/usr/bin/env python3
"""
Thumbnail generator for the rain/night ambience series.

Composes a dark rain scene — corrugated roof, one lit window, rain, mist —
entirely procedurally, so the whole series shares one visual identity and
no two thumbnails are the same file with different text on top.

The design decisions are deliberate and worth keeping if this is edited:

  * Dark, because the thumbnail is a promise. A bright thumbnail on a video
    someone opens at midnight to fall asleep is a mismatch, and mismatched
    promises are what kill session watch time.
  * One warm window as the only saturated thing in frame. Competitors in
    this niche lean vivid — a near-black frame with a single amber point
    stands out in that feed precisely by not competing on brightness.
  * Very few words, set large. At sidebar size on a phone the title is
    ~120px wide; anything smaller than this is decoration, not information.

Usage:
    python scripts/make_thumbnail.py \
        --line1 "RAIN ON A" --line2 "TIN ROOF" \
        --badge "3 HOURS  ·  DARK SCREEN" \
        --out out/thumb-tin-roof.png
"""

import argparse
import os
import random

from PIL import Image, ImageDraw, ImageFilter, ImageFont

WIDTH, HEIGHT = 1280, 720
FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

SKY_TOP = (8, 16, 28)
SKY_BOTTOM = (26, 44, 62)
WINDOW_WARM = (255, 176, 74)


def vertical_gradient(size, top, bottom):
    width, height = size
    base = Image.new("RGB", (1, height))
    pixels = base.load()
    for y in range(height):
        t = y / max(height - 1, 1)
        pixels[0, y] = tuple(
            int(top[i] + (bottom[i] - top[i]) * t) for i in range(3)
        )
    return base.resize((width, height), Image.BILINEAR)


def draw_treeline(img, rng, horizon):
    """Ragged silhouette standing in for a far tree line."""
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    x = -40
    while x < WIDTH + 40:
        crown = rng.randint(38, 104)
        spread = rng.randint(34, 76)
        draw.polygon(
            [
                (x, horizon + 30),
                (x + spread // 2, horizon - crown),
                (x + spread, horizon + 30),
            ],
            fill=(6, 12, 20, 235),
        )
        x += rng.randint(18, 40)
    draw.rectangle([0, horizon + 20, WIDTH, HEIGHT], fill=(6, 12, 20, 235))
    # Softened so the trees read as distance rather than as cut-out shapes.
    layer = layer.filter(ImageFilter.GaussianBlur(3))
    img.alpha_composite(layer)


def draw_roof(img, rng, roof_top_left, roof_top_right, band=92):
    """Corrugated iron band, with the wall of the house below it.

    The roof is a band rather than a filled lower half so there is a wall
    underneath for the window to sit in — a lit window on the roof plane
    itself reads as a mistake even when nobody can say why.
    """
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)

    # Wall first, so the roof band overlaps its top edge cleanly.
    draw.polygon(
        [(0, roof_top_left + band), (WIDTH, roof_top_right + band),
         (WIDTH, HEIGHT), (0, HEIGHT)],
        fill=(13, 20, 29, 255),
    )

    draw.polygon(
        [(0, roof_top_left), (WIDTH, roof_top_right),
         (WIDTH, roof_top_right + band), (0, roof_top_left + band)],
        fill=(19, 29, 40, 255),
    )

    # Ridges run down the slope; their brightness is what says "wet metal".
    for x in range(-20, WIDTH + 20, 24):
        t = (x + 20) / (WIDTH + 40)
        top_y = int(roof_top_left + (roof_top_right - roof_top_left) * t)
        shade = rng.randint(34, 62)
        draw.line([(x, top_y), (x + 5, top_y + band)],
                  fill=(shade, shade + 10, shade + 20, 200), width=6)
        draw.line([(x + 8, top_y), (x + 13, top_y + band)],
                  fill=(8, 14, 21, 225), width=5)

    # Ridge line on top, and the shadowed eave where roof meets wall.
    draw.line([(0, roof_top_left), (WIDTH, roof_top_right)],
              fill=(104, 126, 148, 255), width=5)
    draw.line([(0, roof_top_left + band), (WIDTH, roof_top_right + band)],
              fill=(4, 8, 13, 255), width=7)
    img.alpha_composite(layer)


def draw_window(img, cx, cy):
    """One lit window plus its glow — the emotional anchor of the frame."""
    glow = Image.new("RGBA", img.size, (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    for radius, alpha in ((190, 26), (130, 34), (80, 46)):
        gdraw.ellipse(
            [cx - radius, cy - radius, cx + radius, cy + radius],
            fill=WINDOW_WARM + (alpha,),
        )
    glow = glow.filter(ImageFilter.GaussianBlur(42))
    img.alpha_composite(glow)

    pane = Image.new("RGBA", img.size, (0, 0, 0, 0))
    pdraw = ImageDraw.Draw(pane)
    w, h = 64, 74
    pdraw.rectangle([cx - w // 2, cy - h // 2, cx + w // 2, cy + h // 2],
                    fill=WINDOW_WARM + (232,))
    pdraw.line([(cx, cy - h // 2), (cx, cy + h // 2)], fill=(40, 26, 12, 220), width=4)
    pane = pane.filter(ImageFilter.GaussianBlur(1.4))
    img.alpha_composite(pane)


def draw_rain(img, rng, count=1500):
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    for _ in range(count):
        x = rng.randint(-60, WIDTH)
        y = rng.randint(-40, HEIGHT)
        length = rng.randint(16, 54)
        # A slight, consistent lean reads as wind; vertical reads as static.
        drift = length * 0.16
        alpha = rng.randint(28, 118)
        draw.line([(x, y), (x + drift, y + length)],
                  fill=(198, 216, 236, alpha), width=1)
    img.alpha_composite(layer)


def draw_mist(img, rng, horizon):
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    for _ in range(16):
        cx = rng.randint(0, WIDTH)
        cy = rng.randint(horizon - 70, horizon + 70)
        rx, ry = rng.randint(120, 300), rng.randint(28, 70)
        draw.ellipse([cx - rx, cy - ry, cx + rx, cy + ry],
                     fill=(150, 172, 196, rng.randint(14, 30)))
    layer = layer.filter(ImageFilter.GaussianBlur(48))
    img.alpha_composite(layer)


def draw_vignette(img):
    mask = Image.new("L", img.size, 0)
    ImageDraw.Draw(mask).ellipse(
        [-int(WIDTH * 0.22), -int(HEIGHT * 0.3),
         int(WIDTH * 1.22), int(HEIGHT * 1.3)],
        fill=255,
    )
    mask = mask.filter(ImageFilter.GaussianBlur(150))
    shade = Image.new("RGBA", img.size, (0, 0, 0, 190))
    shade.putalpha(Image.eval(mask, lambda v: 190 - int(v * 0.74)))
    img.alpha_composite(shade)


def _shadowed_text(draw, xy, text, font, fill):
    x, y = xy
    # Plain drop shadow; the scene behind the text is busy with rain.
    draw.text((x + 4, y + 5), text, font=font, fill=(0, 0, 0, 210))
    draw.text((x, y), text, font=font, fill=fill)


def draw_text(img, line1, line2, badge):
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    big = ImageFont.truetype(FONT_BOLD, 108)
    small = ImageFont.truetype(FONT_BOLD, 34)

    x, y = 72, 212
    _shadowed_text(draw, (x, y), line1, big, (238, 244, 252, 255))
    _shadowed_text(draw, (x, y + 112), line2, big, (238, 244, 252, 255))

    if badge:
        by = y + 240
        bw = draw.textlength(badge, font=small)
        draw.rounded_rectangle([x - 14, by - 12, x + bw + 22, by + 48],
                               radius=8, fill=(233, 148, 46, 236))
        draw.text((x + 4, by + 2), badge, font=small, fill=(22, 14, 6, 255))

    img.alpha_composite(layer)


def build(line1, line2, badge, seed, out_path):
    rng = random.Random(seed)
    img = vertical_gradient((WIDTH, HEIGHT), SKY_TOP, SKY_BOTTOM).convert("RGBA")

    horizon = 292
    draw_treeline(img, rng, horizon)
    draw_mist(img, rng, horizon)

    # The roof leans slightly so the frame has a diagonal; the wall below
    # gives the window somewhere to belong.
    roof_top_left, roof_top_right, band = 508, 446, 92
    draw_roof(img, rng, roof_top_left, roof_top_right, band)
    draw_window(img, int(WIDTH * 0.80), roof_top_right + band + 96)

    draw_rain(img, rng)
    draw_vignette(img)
    draw_text(img, line1, line2, badge)

    os.makedirs(os.path.dirname(os.path.abspath(out_path)) or ".", exist_ok=True)
    img.convert("RGB").save(out_path, "PNG", optimize=True)
    return out_path


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--line1", default="RAIN ON A")
    parser.add_argument("--line2", default="TIN ROOF")
    parser.add_argument("--badge", default="3 HOURS  ·  DARK SCREEN")
    # Seed is exposed so a given thumbnail is reproducible, and so sibling
    # videos in the series can be visually varied on purpose.
    parser.add_argument("--seed", type=int, default=7)
    parser.add_argument("--out", default="out/thumbnail.png")
    args = parser.parse_args()

    path = build(args.line1, args.line2, args.badge, args.seed, args.out)
    print(f"wrote {path}")


if __name__ == "__main__":
    main()
