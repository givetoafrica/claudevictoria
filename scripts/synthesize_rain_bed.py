#!/usr/bin/env python3
"""
Synthesize a rain-on-corrugated-metal audio bed.

This is *modelled* rain, not a field recording, and the difference matters:
do not label output from this as a recording of a real place. It exists so
the pipeline can produce finished videos while real audio is being sourced,
and for cases where a clean synthetic bed is genuinely wanted.

What it models, and why each part is there:

  hiss    Thousands of far-off drops merge into broadband noise. Band-limited
          and tilted down at the top, because unfiltered white noise reads as
          television static rather than weather.
  body    Low brown-noise rumble. Without it rain sounds thin and "small".
  drops   Individual impacts on the panel: a short noise burst plus decaying
          resonant modes. This is the part that makes it metal rather than
          rain on grass, and it is what distinguishes a tin roof.
  gusts   Slow amplitude drift. Flat rain is the single biggest giveaway of
          a synthetic bed over long durations — real rain breathes.
  space   A couple of short reflections, suggesting a listener underneath the
          roof rather than out in the open.

The bed is built loop-safe: the tail is crossfaded into the head and the gust
envelope is exactly periodic over the duration, so repeating the file has no
seam. That matters because a 3-hour video is one short bed played many times.

Usage:
    python scripts/synthesize_rain_bed.py --seconds 300 --out beds/tin-roof.wav
"""

import argparse
import os

import numpy as np
from scipy import signal

SAMPLE_RATE = 48000
# Crossfade used to make the file loop without a seam.
LOOP_CROSSFADE_SECONDS = 3.0
# Resonant modes of a corrugated panel, in Hz. Inharmonic on purpose —
# harmonically related modes would read as a musical instrument, not metal.
PANEL_MODES = (1450.0, 2310.0, 3670.0, 5120.0, 6890.0)


def _butter(x, cutoff, btype, order=4):
    sos = signal.butter(order, np.asarray(cutoff) / (SAMPLE_RATE / 2),
                        btype=btype, output="sos")
    return signal.sosfilt(sos, x)


def _hiss(rng, n):
    """Broadband bed: the merged sound of rain at a distance."""
    x = rng.standard_normal(n)
    x = _butter(x, [180.0, 11000.0], "bandpass")
    # Gentle top-end tilt. Real rain loses high frequencies over distance;
    # without this the bed is fatiguing over hours.
    return x + 0.45 * _butter(x, 2600.0, "lowpass")


def _body(rng, n):
    """Low rumble that gives the rain weight."""
    x = rng.standard_normal(n)
    # Integrating white noise gives brown noise; the running sum drifts, so
    # it is high-passed afterwards to remove the DC wander.
    x = np.cumsum(x) / np.sqrt(n)
    # 45 Hz rather than 30: below that is rumble no phone can
    # reproduce, and it only eats headroom.
    x = _butter(x, 45.0, "highpass")
    return _butter(x, 400.0, "lowpass")


def _drop_kernels(rng, count=10):
    """A palette of single-impact sounds on the metal panel."""
    kernels = []
    for _ in range(count):
        length = int(SAMPLE_RATE * rng.uniform(0.012, 0.055))
        t = np.arange(length) / SAMPLE_RATE

        # The impact itself: a very short bright noise burst.
        click = rng.standard_normal(length) * np.exp(-t * rng.uniform(260, 700))
        click = _butter(click, 1800.0, "highpass")

        # The panel ringing afterwards. Only a subset of modes is excited by
        # any given strike, which is what stops every drop sounding identical.
        ring = np.zeros(length)
        for mode in PANEL_MODES:
            if rng.random() < 0.55:
                detune = mode * rng.uniform(0.97, 1.03)
                decay = rng.uniform(45, 150)
                ring += (rng.uniform(0.25, 1.0)
                         * np.sin(2 * np.pi * detune * t + rng.uniform(0, 6.28))
                         * np.exp(-t * decay))

        kernel = 0.75 * click + 0.55 * ring
        peak = np.max(np.abs(kernel))
        kernels.append(kernel / peak if peak else kernel)
    return kernels


def _drops(rng, n, kernels, per_second):
    """Poisson-distributed impacts convolved with the kernel palette.

    Each kernel gets its own sparse impulse train, and the trains are
    convolved in bulk. Placing a quarter of a million drops one at a time in
    Python would take minutes; this takes a moment.
    """
    out = np.zeros(n)
    total = int(n / SAMPLE_RATE * per_second)
    for kernel in kernels:
        train = np.zeros(n)
        count = total // len(kernels)
        idx = rng.integers(0, n, size=count)
        # Wide amplitude spread: a few near drops over many distant ones is
        # what gives rain its texture.
        amps = rng.gamma(shape=1.6, scale=0.5, size=count)
        np.add.at(train, idx, amps)
        out += signal.oaconvolve(train, kernel)[:n]
    return out


def _gusts(n, rng, depth=0.34):
    """Exactly-periodic slow drift, so the loop stays seamless."""
    t = np.arange(n) / n
    env = np.zeros(n)
    # Integer cycle counts keep the envelope periodic over the file.
    for cycles in (1, 2, 3, 5, 8):
        env += (rng.uniform(0.4, 1.0) / cycles) * np.sin(
            2 * np.pi * cycles * t + rng.uniform(0, 6.28))
    env /= np.max(np.abs(env))
    return 1.0 + depth * env


def _space(x):
    """Two short reflections: the listener is under the roof, not in the field."""
    out = x.copy()
    for delay_ms, gain in ((17.0, 0.22), (41.0, 0.13)):
        d = int(SAMPLE_RATE * delay_ms / 1000.0)
        out[d:] += gain * x[:-d]
    return out


def _make_channel(rng, n, per_second):
    hiss = _hiss(rng, n)
    hiss /= np.max(np.abs(hiss)) or 1.0
    body = _body(rng, n)
    body /= np.max(np.abs(body)) or 1.0
    drops = _drops(rng, n, _drop_kernels(rng), per_second)
    drops /= np.max(np.abs(drops)) or 1.0

    mixed = 0.62 * hiss * _gusts(n, rng) + 0.22 * body + 0.52 * drops
    return _space(mixed)


def _loop_safe(x, crossfade_samples):
    """Fold the tail into the head so the file repeats without a seam."""
    body, tail = x[:-crossfade_samples], x[-crossfade_samples:]
    ramp = np.linspace(0.0, 1.0, crossfade_samples)
    body[:crossfade_samples] = body[:crossfade_samples] * ramp + tail * (1 - ramp)
    return body


def synthesize(seconds, per_second, seed):
    rng = np.random.default_rng(seed)
    crossfade = int(SAMPLE_RATE * LOOP_CROSSFADE_SECONDS)
    n = int(SAMPLE_RATE * seconds) + crossfade

    # Independent noise per channel gives width; a mono bed duplicated to two
    # channels collapses in the middle of the head and sounds notably worse.
    left = _loop_safe(_make_channel(rng, n, per_second), crossfade)
    right = _loop_safe(_make_channel(rng, n, per_second), crossfade)

    stereo = np.stack([left, right], axis=1)
    peak = np.max(np.abs(stereo))
    if peak:
        # -3 dBFS. Sleep beds are played loud on small speakers; leaving
        # headroom stops the highest drops clipping.
        stereo *= (10 ** (-3 / 20)) / peak
    return stereo


def write_wav(path, stereo):
    os.makedirs(os.path.dirname(os.path.abspath(path)) or ".", exist_ok=True)
    from scipy.io import wavfile
    wavfile.write(path, SAMPLE_RATE, (stereo * 32767).astype(np.int16))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--seconds", type=float, default=300.0,
                        help="length of the loopable bed")
    parser.add_argument("--intensity", type=float, default=900.0,
                        help="drop impacts per second; ~300 light, ~1600 heavy")
    parser.add_argument("--seed", type=int, default=11)
    parser.add_argument("--out", default="beds/tin-roof.wav")
    args = parser.parse_args()

    stereo = synthesize(args.seconds, args.intensity, args.seed)
    write_wav(args.out, stereo)
    print(f"wrote {args.out} "
          f"({args.seconds:.0f}s, {os.path.getsize(args.out) / 1e6:.1f} MB)")


if __name__ == "__main__":
    main()
