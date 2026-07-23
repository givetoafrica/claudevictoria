#!/usr/bin/env python3
"""Better Than Fiction — YouTube banner, 2560x1440.
Philosophy: Measured Wonder. Rendered at 2x and downsampled for crispness."""

import math, random
from PIL import Image, ImageDraw, ImageFont, ImageFilter

S = 2  # supersample
W, H = 2560 * S, 1440 * S
NAVY = (14, 27, 51)
NAVY_DEEP = (8, 16, 33)
ORANGE = (255, 122, 0)
BLUE_PLANET = (36, 84, 160)
FONTS = "/root/.claude/skills/canvas-design/canvas-fonts"
rng = random.Random(64)  # 64 light-years

img = Image.new("RGB", (W, H), NAVY)
d = ImageDraw.Draw(img, "RGBA")

# ---------- deep-space field: long vertical gradient, subtle ----------
for y in range(H):
    t = y / H
    r = int(NAVY_DEEP[0] + (NAVY[0] - NAVY_DEEP[0]) * (1 - abs(t - 0.5) * 1.4))
    g = int(NAVY_DEEP[1] + (NAVY[1] - NAVY_DEEP[1]) * (1 - abs(t - 0.5) * 1.4))
    b = int(NAVY_DEEP[2] + (NAVY[2] - NAVY_DEEP[2]) * (1 - abs(t - 0.5) * 1.4))
    d.line([(0, y), (W, y)], fill=(max(r, 0), max(g, 0), max(b, 0)))

# faint warm glow lower-right (planet light spilling)
glow = Image.new("RGB", (W, H), (0, 0, 0))
gd = ImageDraw.Draw(glow)
gd.ellipse([W * 0.62, H * 0.25, W * 1.25, H * 1.15], fill=(30, 16, 4))
glow = glow.filter(ImageFilter.GaussianBlur(220 * S))
img = Image.blend(img, Image.new("RGB", (W, H), NAVY_DEEP), 0.0)
img = Image.composite(img, img, Image.new("L", (W, H), 0))
img = Image.blend(img, glow, 0.0)  # keep structure; add via add-mode below
from PIL import ImageChops
img = ImageChops.add(img, glow)
d = ImageDraw.Draw(img, "RGBA")

# ---------- starfield: dense, hand-weighted ----------
for _ in range(1500):
    x, y = rng.uniform(0, W), rng.uniform(0, H)
    r = rng.choice([0.6, 0.8, 1.0, 1.0, 1.3, 1.8, 2.4]) * S
    a = rng.randint(28, 150)
    warm = rng.random() < 0.06
    c = (255, 200, 150, a) if warm else (200, 220, 255, a)
    d.ellipse([x - r, y - r, x + r, y + r], fill=c)
# a few bright stars with cross glints
for _ in range(14):
    x, y = rng.uniform(0, W), rng.uniform(0, H * 0.9)
    r = rng.uniform(2.2, 3.4) * S
    d.ellipse([x - r, y - r, x + r, y + r], fill=(235, 242, 255, 220))
    for dx, dy in [(1, 0), (0, 1)]:
        d.line([x - dx * r * 5, y - dy * r * 5, x + dx * r * 5, y + dy * r * 5],
               fill=(235, 242, 255, 70), width=S)

# ---------- observation apparatus: orbital arcs + ticks ----------
cx, cy = W * 0.86, H * 0.52   # planet center
pr = H * 0.46                  # planet radius
for k, rad in enumerate([pr * 1.45, pr * 1.75]):
    steps = 700
    for i in range(steps):
        a0 = math.pi * 0.55 + (math.pi * 0.9) * i / steps
        if i % 9 < 5:  # dashed by hand
            x0 = cx + rad * math.cos(a0); y0 = cy + rad * math.sin(a0) * 0.92
            d.ellipse([x0 - 0.9 * S, y0 - 0.9 * S, x0 + 0.9 * S, y0 + 0.9 * S],
                      fill=(150, 180, 220, 26))
# tick ruler along bottom, chart-like
for i in range(0, 129):
    x = W * i / 128
    h = 14 * S if i % 8 == 0 else (9 * S if i % 4 == 0 else 5 * S)
    d.line([(x, H - 30 * S), (x, H - 30 * S - h)], fill=(150, 180, 220, 40), width=S)

# ---------- the planet: cobalt sphere, limb-lit ----------
planet = Image.new("RGBA", (W, H), (0, 0, 0, 0))
pd = ImageDraw.Draw(planet)
pd.ellipse([cx - pr, cy - pr, cx + pr, cy + pr], fill=(*BLUE_PLANET, 255))
# radial shading: darker toward lower-left, light from upper-right (star off-frame right)
shade = Image.new("L", (W, H), 0)
sd = ImageDraw.Draw(shade)
for i in range(60):
    t = i / 59
    rr = pr * (1 - 0.016 * i)
    off = pr * 0.34 * t
    sd.ellipse([cx - rr - off * 0.7, cy - rr + off * 0.35,
                cx + rr - off * 0.7, cy + rr + off * 0.35], fill=int(30 + 170 * t))
dark = Image.new("RGBA", (W, H), (6, 12, 28, 255))
planet = Image.composite(dark, planet, shade.filter(ImageFilter.GaussianBlur(30 * S)))
# keep only the disc
mask = Image.new("L", (W, H), 0)
md = ImageDraw.Draw(mask)
md.ellipse([cx - pr, cy - pr, cx + pr, cy + pr], fill=255)
# cloud bands: horizontal, subtle, hand-laid
bands = Image.new("RGBA", (W, H), (0, 0, 0, 0))
bd = ImageDraw.Draw(bands)
for i in range(26):
    y = cy - pr + pr * 2 * (i + rng.uniform(0, .6)) / 26
    wdt = rng.uniform(6, 26) * S
    a = rng.randint(10, 34)
    tone = rng.choice([(90, 150, 220), (60, 110, 190), (140, 190, 240)])
    bd.line([(cx - pr, y), (cx + pr, y)], fill=(*tone, a), width=int(wdt))
bands = bands.filter(ImageFilter.GaussianBlur(8 * S))
planet = Image.alpha_composite(planet, Image.composite(bands, Image.new("RGBA", (W, H), (0,0,0,0)), mask))
# limb glow on lit side
limb = Image.new("RGBA", (W, H), (0, 0, 0, 0))
ld = ImageDraw.Draw(limb)
ld.arc([cx - pr, cy - pr, cx + pr, cy + pr], start=-105, end=25,
       fill=(200, 228, 255, 200), width=int(5 * S))
limb = limb.filter(ImageFilter.GaussianBlur(6 * S))
planet = Image.alpha_composite(planet, limb)
img.paste(planet, (0, 0), mask.filter(ImageFilter.GaussianBlur(S)))
d = ImageDraw.Draw(img, "RGBA")

# ---------- sideways glass streaks: the wind, left-flowing ----------
streaks = Image.new("RGBA", (W, H), (0, 0, 0, 0))
st = ImageDraw.Draw(streaks)
for _ in range(120):
    # originate near the planet's LEFT LIMB, fly left off the disc
    y = rng.gauss(cy, pr * 0.5)
    if not (cy - pr * 0.96 < y < cy + pr * 0.96):
        continue
    limb_x = cx - math.sqrt(max(pr ** 2 - (y - cy) ** 2, 0))
    x_start = limb_x + rng.uniform(-10, 140) * S  # hug the limb
    ln = rng.uniform(120, 700) * S * (0.45 + 1.1 * (1 - abs(y - cy) / pr))
    wdt = rng.uniform(1.2, 4.2) * S
    a = rng.randint(60, 190)
    warm = rng.random() < 0.78
    c = (255, 140, 30, a) if warm else (255, 205, 120, a)
    drop = ln * rng.uniform(0.00, 0.025)  # nearly horizontal
    st.line([(x_start, y), (x_start - ln, y + drop)], fill=c, width=int(wdt))
    # bright head only when off the disc (keeps the planet face clean)
    if x_start <= limb_x + 8 * S:
        st.ellipse([x_start - wdt, y - wdt, x_start + wdt, y + wdt],
                   fill=(255, 220, 170, min(255, a + 40)))
streaks = streaks.filter(ImageFilter.GaussianBlur(1.2 * S))
img = Image.alpha_composite(img.convert("RGBA"), streaks).convert("RGB")
d = ImageDraw.Draw(img, "RGBA")

# ---------- the witnesses: explorer + robot, small, lower-left ----------
bx, by = W * 0.115, H * 0.845   # ground point
# ground: subtle arc of a dark foreground ridge
ridge = Image.new("RGBA", (W, H), (0, 0, 0, 0))
rd = ImageDraw.Draw(ridge)
rd.ellipse([-W * 0.35, H * 0.86, W * 0.62, H * 1.55], fill=(6, 11, 24, 255))
ridge = ridge.filter(ImageFilter.GaussianBlur(3 * S))
img = Image.alpha_composite(img.convert("RGBA"), ridge).convert("RGB")
d = ImageDraw.Draw(img, "RGBA")

def rim(x0, y0, x1, y1, rad, body, edge):
    d.rounded_rectangle([x0, y0, x1, y1], radius=rad, fill=body)
    d.rounded_rectangle([x0, y0, x1, y1], radius=rad, outline=edge, width=S)

# explorer: ~86px tall silhouette w/ teal-white suit, rim-lit from planet side
eh = 86 * S
ex, ey = bx, by
suit = (208, 220, 228); teal = (52, 130, 138); rimc = (255, 170, 90)
# legs
rim(ex - 12*S, ey - eh*0.42, ex - 4*S, ey, 4*S, suit, (170,185,196))
rim(ex + 4*S, ey - eh*0.42, ex + 12*S, ey, 4*S, suit, (170,185,196))
# torso
rim(ex - 16*S, ey - eh*0.78, ex + 16*S, ey - eh*0.38, 8*S, suit, (170,185,196))
d.rounded_rectangle([ex - 16*S, ey - eh*0.62, ex + 16*S, ey - eh*0.5], radius=4*S, fill=teal)
# arm raised toward planet (pointing)
d.line([(ex + 14*S, ey - eh*0.66), (ex + 34*S, ey - eh*0.82)], fill=suit, width=int(7*S))
d.ellipse([ex + 31*S, ey - eh*0.86, ex + 39*S, ey - eh*0.78], fill=suit)
# helmet
d.ellipse([ex - 13*S, ey - eh*1.06, ex + 13*S, ey - eh*0.76], fill=suit)
d.ellipse([ex - 9*S, ey - eh*1.02, ex + 9*S, ey - eh*0.80], fill=(30, 46, 70))
d.arc([ex - 13*S, ey - eh*1.06, ex + 13*S, ey - eh*0.76], start=-70, end=40,
      fill=rimc, width=int(2*S))
# visor glint: tiny planet reflection
d.ellipse([ex + 1*S, ey - eh*0.97, ex + 6*S, ey - eh*0.92], fill=(120, 170, 230))

# robot: boxy, one large round blue eye, antenna bent by wind
rx, ry = bx + 74 * S, by + 2 * S
rh = 56 * S
silver = (176, 186, 198); silver_dk = (120, 132, 148)
# tracks/feet
rim(rx - 20*S, ry - 10*S, rx + 20*S, ry, 5*S, silver_dk, (90, 100, 115))
# body
rim(rx - 24*S, ry - rh, rx + 24*S, ry - 8*S, 7*S, silver, (130, 142, 158))
# side arm stubs
rim(rx - 32*S, ry - rh*0.62, rx - 24*S, ry - rh*0.34, 4*S, silver_dk, (90,100,115))
rim(rx + 24*S, ry - rh*0.62, rx + 32*S, ry - rh*0.34, 4*S, silver_dk, (90,100,115))
# eye: large round blue, glowing
eyer = 13 * S
eg = Image.new("RGBA", (W, H), (0, 0, 0, 0))
egd = ImageDraw.Draw(eg)
egd.ellipse([rx - eyer*1.9, ry - rh*0.72 - eyer*1.9, rx + eyer*1.9, ry - rh*0.72 + eyer*1.9],
            fill=(80, 170, 255, 90))
eg = eg.filter(ImageFilter.GaussianBlur(6 * S))
img = Image.alpha_composite(img.convert("RGBA"), eg).convert("RGB")
d = ImageDraw.Draw(img, "RGBA")
d.ellipse([rx - eyer, ry - rh*0.72 - eyer, rx + eyer, ry - rh*0.72 + eyer], fill=(16, 30, 52))
d.ellipse([rx - eyer*0.72, ry - rh*0.72 - eyer*0.72, rx + eyer*0.72, ry - rh*0.72 + eyer*0.72],
          fill=(90, 180, 255))
d.ellipse([rx - eyer*0.3, ry - rh*0.72 - eyer*0.55, rx + eyer*0.05, ry - rh*0.72 - eyer*0.2],
          fill=(210, 235, 255))
# antenna, bent leftward by the wind
d.line([(rx + 10*S, ry - rh), (rx + 6*S, ry - rh - 16*S), (rx - 8*S, ry - rh - 22*S)],
       fill=silver_dk, width=int(2.6*S), joint="curve")
d.ellipse([rx - 12*S, ry - rh - 26*S, rx - 4*S, ry - rh - 18*S], fill=ORANGE)
# rim light on the pair from planet side
d.arc([rx - 24*S, ry - rh, rx + 24*S, ry - 8*S], start=-80, end=60, fill=(255,170,90,150), width=int(2*S))

# long soft shadows cast leftward
sh = Image.new("RGBA", (W, H), (0,0,0,0))
shd = ImageDraw.Draw(sh)
shd.ellipse([ex - 60*S, ey - 6*S, ex + 20*S, ey + 8*S], fill=(0, 0, 0, 110))
shd.ellipse([rx - 70*S, ry - 6*S, rx + 24*S, ry + 8*S], fill=(0, 0, 0, 110))
sh = sh.filter(ImageFilter.GaussianBlur(8 * S))
img = Image.alpha_composite(img.convert("RGBA"), sh).convert("RGB")
d = ImageDraw.Draw(img, "RGBA")

# ---------- typography: protected center (safe area 1546x423 centered) ----------
safe_x0, safe_y0 = (2560 - 1546) / 2 * S, (1440 - 423) / 2 * S
safe_x1, safe_y1 = safe_x0 + 1546 * S, safe_y0 + 423 * S
big = ImageFont.truetype(f"{FONTS}/BigShoulders-Bold.ttf", int(150 * S))
tag = ImageFont.truetype(f"{FONTS}/WorkSans-Regular.ttf", int(34 * S))
mono = ImageFont.truetype(f"{FONTS}/GeistMono-Regular.ttf", int(19 * S))

def tracked(draw, xy, text, font, fill, tracking, anchor_center_x=None):
    widths = [draw.textlength(ch, font=font) for ch in text]
    total = sum(widths) + tracking * (len(text) - 1)
    x = (anchor_center_x - total / 2) if anchor_center_x else xy[0]
    y = xy[1]
    for ch, w in zip(text, widths):
        draw.text((x, y), ch, font=font, fill=fill)
        x += w + tracking
    return total

CXC = W / 2
title = "BETTER THAN FICTION"
# soft dark stage behind text for legibility (very subtle, wide)
stage = Image.new("RGBA", (W, H), (0, 0, 0, 0))
sgd = ImageDraw.Draw(stage)
sgd.ellipse([W*0.22, H*0.30, W*0.78, H*0.72], fill=(5, 10, 22, 150))
stage = stage.filter(ImageFilter.GaussianBlur(90 * S))
img = Image.alpha_composite(img.convert("RGBA"), stage).convert("RGB")
d = ImageDraw.Draw(img, "RGBA")

ty = H * 0.415
tw = tracked(d, (0, ty), title, big, (240, 246, 255), 14 * S, anchor_center_x=CXC)
# small-caps tagline flanked by short orange rules, vertically centered on it
tag_y = ty + 192 * S
tagline = "REAL PLANETS.  TRUE STORIES.  WILDER THAN ANYTHING MADE UP."
tgw = sum(d.textlength(ch, font=tag) for ch in tagline) + 6 * S * (len(tagline) - 1)
mid_y = tag_y + 22 * S
d.line([(CXC - tgw/2 - 120*S, mid_y), (CXC - tgw/2 - 36*S, mid_y)], fill=ORANGE, width=int(3*S))
d.line([(CXC + tgw/2 + 36*S, mid_y), (CXC + tgw/2 + 120*S, mid_y)], fill=ORANGE, width=int(3*S))
tracked(d, (0, tag_y), tagline, tag, (168, 190, 220), 6 * S, anchor_center_x=CXC)

# clinical annotations (outside safe area, quiet)
d.text((W * 0.855, H * 0.075), "HD 189733 b", font=mono, fill=(150, 180, 220, 200))
d.text((W * 0.855, H * 0.075 + 30 * S), "64 ly · wind 8,700 km/h", font=mono,
       fill=(120, 150, 190, 170))
d.text((30 * S, H - 72 * S), "OBS. 2026 — EP. 01", font=mono, fill=(120, 150, 190, 140))

# ---------- grain + vignette ----------
noise = Image.effect_noise((W // 2, H // 2), 22).resize((W, H)).convert("L")
img = Image.composite(ImageChops.add(img, Image.new("RGB", (W, H), (6, 6, 8))),
                      ImageChops.subtract(img, Image.new("RGB", (W, H), (6, 6, 8))),
                      noise)
vig = Image.new("L", (W, H), 0)
vd = ImageDraw.Draw(vig)
vd.rounded_rectangle([int(-W*0.1), int(-H*0.18), int(W*1.1), int(H*1.18)],
                     radius=int(H*0.5), fill=255)
vig = vig.filter(ImageFilter.GaussianBlur(180 * S)).point(lambda p: 255 - int((255 - p) * 0.5))
img = Image.composite(img, ImageChops.multiply(img, Image.new("RGB", (W, H), (200, 205, 215))), vig)

img = img.resize((2560, 1440), Image.LANCZOS)
img.save("/tmp/claude-0/-home-user-claudevictoria/d73b54bd-a85e-5929-b992-4ebc5098ae6e/scratchpad/banner.png")
print("saved", img.size)
