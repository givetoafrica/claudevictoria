import {interpolate, Easing} from 'remotion';

/** Deterministic pseudo-random in [0, 1) so every render is identical. */
export const rand = (seed: number): number => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** Gentle idle motion: a sine wave in units per second. */
export const wobble = (frame: number, fps: number, speed: number, amp: number, phase = 0): number =>
  Math.sin((frame / fps) * speed * Math.PI * 2 + phase) * amp;

/** Clamped interpolate with a smooth ease, for keyframing a 0..1 progress. */
export const ramp = (frame: number, from: number, to: number, ease = Easing.inOut(Easing.cubic)): number =>
  interpolate(frame, [from, to], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});

export const mix = (a: number, b: number, t: number): number => a + (b - a) * t;

/** Fade in over `inLen` frames from `start`, hold, then fade out over `outLen` frames ending at `end`. */
export const fadeWindow = (frame: number, start: number, end: number, inLen = 12, outLen = 12): number =>
  interpolate(frame, [start, start + inLen, end - outLen, end], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
