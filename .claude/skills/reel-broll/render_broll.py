"""Composite B-roll cards over an avatar video for a 9:16 reel.

Layout (1080x1920), the same for the whole video:
- Top zone (0-760 px): plum background, a small label and title, and an ivory
  card that shows one visual per segment.
- Bottom: the presenter scaled to 62% and anchored to the bottom edge, so her
  face stays visible.

The card runs from the first word to the last. Segments in the spec change the
label, title and visual. Timings come from the spec, taken from speech pauses
in the presenter's audio.

Usage:
    python3 render_broll.py spec.json
"""
import json
import subprocess
import sys
from PIL import Image, ImageDraw, ImageFont

W, H, FPS = 1080, 1920, 30
PLUM = (59, 11, 69)
IVORY = (250, 247, 242)
GOLD = (232, 181, 71)
VIOLET = (108, 31, 224)
LAVENDER = (217, 200, 245)
GREY = (156, 146, 163)
INK = (28, 20, 33)

FONT_DIR = "/usr/share/fonts/truetype/liberation/"
WM_FONT = ImageFont.truetype(FONT_DIR + "LiberationSans-Bold.ttf", 26)
WM_COLOUR = (217, 200, 245)
TITLE = ImageFont.truetype(FONT_DIR + "LiberationSerif-Bold.ttf", 58)
LABEL = ImageFont.truetype(FONT_DIR + "LiberationSans-Bold.ttf", 34)
SMALL = ImageFont.truetype(FONT_DIR + "LiberationSans-Bold.ttf", 40)
BODY = ImageFont.truetype(FONT_DIR + "LiberationSans-Regular.ttf", 40)
BIG = ImageFont.truetype(FONT_DIR + "LiberationSans-Bold.ttf", 300)

CARD = (60, 230, 1020, 740)
TOP_ZONE = 760
VIC_SCALE = 0.62
VIC_W, VIC_H = int(W * VIC_SCALE), int(H * VIC_SCALE)
VIC_POS = ((W - VIC_W) // 2, H - VIC_H)


def ease(x):
    x = min(1.0, max(0.0, x))
    return 1 - (1 - x) ** 3


def draw_visual(d, kind, e):
    """Draw one visual inside CARD. e is seconds since the segment started."""
    if kind == "heart":
        k = ease(e / 0.5)
        if k > 0:
            r = int(55 * k)
            d.ellipse((270 - r, 400 - r, 270 + r, 400 + r), fill=VIOLET)
            d.ellipse((330 - r, 400 - r, 330 + r, 400 + r), fill=VIOLET)
        if k > 0.7:
            d.polygon([(218, 410), (382, 410), (300, 520)], fill=VIOLET)
        d.text((520, 330), "Verified update", font=SMALL, fill=INK)
        d.text((520, 390), "The work they", font=BODY, fill=INK)
        d.text((520, 440), "helped fund", font=BODY, fill=INK)
        ck = ease((e - 0.6) / 0.4)
        if ck > 0:
            d.ellipse((520, 500, 572, 552), fill=GOLD)
            d.line((534, 526, 544, 538, 560, 514), fill=INK, width=6)
    elif kind == "bubbles":
        k = ease(e / 0.5)
        if k > 0:
            d.rounded_rectangle((120, 320, 560, 470), radius=36, fill=VIOLET)
            d.text((160, 360), "What keeps you", font=SMALL, fill=IVORY)
            d.text((160, 410), "involved?", font=SMALL, fill=IVORY)
        k2 = ease((e - 0.5) / 0.5)
        if k2 > 0:
            d.rounded_rectangle((480, 460, 920, 610), radius=36, fill=GOLD)
            d.text((520, 500), "Longtime supporter", font=SMALL, fill=INK)
            d.text((520, 550), "in their own words", font=BODY, fill=INK)
    elif kind == "avatars":
        k = ease(e / 0.5)
        if k > 0:
            r = int(90 * k)
            d.ellipse((260 - r, 470 - r, 260 + r, 470 + r), fill=VIOLET)
            d.ellipse((820 - r, 470 - r, 820 + r, 470 + r), fill=GOLD)
            for x in range(340, 740, 30):
                d.ellipse((x, 300, x + 10, 310), fill=GREY)
        k2 = ease((e - 0.5) / 0.4)
        if k2 > 0:
            d.rounded_rectangle((300, 580, 780, 680), radius=40, fill=INK)
            d.text((340, 610), "How are you doing?", font=SMALL, fill=IVORY)
    elif kind == "network":
        pts = [(540, 330, GOLD, "Board"), (290, 560, VIOLET, "You"), (790, 560, INK, "New contact")]
        for i, (px, py, col, lab) in enumerate(pts):
            pk = ease((e - 0.2 * i) / 0.4)
            if pk > 0:
                rr = int(70 * pk)
                d.ellipse((px - rr, py - rr, px + rr, py + rr), fill=col)
            if pk > 0.8:
                lw = SMALL.getlength(lab)
                d.text((px - lw / 2, py + 90), lab, font=SMALL, fill=INK)
        if e > 0.5:
            d.line((540, 330, 290, 560), fill=LAVENDER, width=8)
            d.line((540, 330, 790, 560), fill=LAVENDER, width=8)
    elif kind == "checklist":
        rows = ["Budget", "Program update", "Visit details"]
        for i, label in enumerate(rows):
            rk = ease((e - 0.5 * i) / 0.4)
            y = 330 + i * 110
            if rk > 0:
                d.rounded_rectangle((150, y, 210, y + 60), radius=10, fill=VIOLET)
                if rk > 0.6:
                    d.line((164, y + 30, 180, y + 46, 200, y + 14), fill=IVORY, width=7)
                d.text((250, y + 6), label, font=SMALL, fill=INK)
    elif kind == "number":
        k = ease(e / 0.5)
        if k > 0:
            txt = "5"
            tw = BIG.getlength(txt)
            d.text((W / 2 - tw / 2, 300 + (1 - k) * 60), txt, font=BIG, fill=VIOLET)
    elif kind == "bookmark":
        k = ease(e / 0.5)
        if k > 0:
            top = int(330 + (1 - k) * 80)
            d.polygon([(400, top), (680, top), (680, top + 300), (540, top + 230), (400, top + 300)], fill=VIOLET)
    else:
        raise ValueError(f"unknown visual: {kind}")


def top_zone(t, segment):
    """Top-zone image for segment at time t."""
    img = Image.new("RGB", (W, TOP_ZONE), PLUM)
    d = ImageDraw.Draw(img)
    e = t - segment["start"]
    if ease(e / 0.4) > 0:
        d.text((60, 70), segment["label"], font=LABEL, fill=GOLD)
        d.text((60, 110), segment["title"], font=TITLE, fill=IVORY)
    d.rounded_rectangle(CARD, radius=40, fill=IVORY)
    draw_visual(d, segment["visual"], e)
    return img


def draw_watermark(img, lines):
    """Brand mark in the left margin, beside the presenter, so it never covers her or the card."""
    d = ImageDraw.Draw(img)
    x, y = 24, H - 200
    for i, line in enumerate(lines):
        d.text((x, y + i * 34), line, font=WM_FONT, fill=WM_COLOUR)


def segment_at(t, segments):
    for seg in segments:
        if seg["start"] <= t < seg["end"]:
            return seg
    return segments[-1] if t >= segments[-1]["start"] else segments[0]


def main(spec_path):
    spec = json.load(open(spec_path))
    src, out = spec["source"], spec["output"]
    dur = spec["duration"]
    segments = spec["segments"]
    watermark = spec.get("watermark")
    total = int(round(dur * FPS))

    dec = subprocess.Popen(
        ["ffmpeg", "-v", "error", "-i", src, "-f", "rawvideo", "-pix_fmt", "rgb24",
         "-s", f"{W}x{H}", "-r", str(FPS), "-"],
        stdout=subprocess.PIPE,
    )
    enc = subprocess.Popen(
        ["ffmpeg", "-y", "-v", "error",
         "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
         "-i", src, "-map", "0:v", "-map", "1:a?",
         "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-preset", "medium",
         "-c:a", "aac", "-b:a", "160k", "-shortest", out],
        stdin=subprocess.PIPE,
    )
    frame_bytes = W * H * 3
    n = -1
    for n in range(total):
        raw = dec.stdout.read(frame_bytes)
        if len(raw) < frame_bytes:
            break
        t = n / FPS
        frame = Image.frombytes("RGB", (W, H), raw)
        canvas = Image.new("RGB", (W, H), PLUM)
        canvas.paste(frame.resize((VIC_W, VIC_H), Image.LANCZOS), VIC_POS)
        canvas.paste(top_zone(t, segment_at(t, segments)), (0, 0))
        if watermark:
            draw_watermark(canvas, watermark)
        enc.stdin.write(canvas.tobytes())
    enc.stdin.close()
    enc.wait()
    dec.wait()
    print("wrote", out, "frames", n + 1)


if __name__ == "__main__":
    main(sys.argv[1])
