import React from 'react';
import {mix} from '../lib/motion';

type Variant = 'calf' | 'adult';

const PALETTE: Record<Variant, {body: string; belly: string; dark: string; stripe: string}> = {
  calf: {body: '#c29766', belly: '#dcb98a', dark: '#5a3d27', stripe: '#a87c4f'},
  adult: {body: '#6b625a', belly: '#857b70', dark: '#2a2420', stripe: '#4d4540'},
};

export type WildebeestPose = {
  /** 0 = front legs folded on the ground, 1 = fully standing. */
  standFront: number;
  /** 0 = rear legs folded on the ground, 1 = fully standing. */
  standRear: number;
  /** Leg shake in px at the hooves (wobbly newborn legs). */
  tremble: number;
  /** Head rotation in degrees; positive dips the nose toward the ground. */
  headDip: number;
  /** Tail swing in degrees. */
  tailSwing: number;
  /** Eyelid: 1 open, 0 shut. */
  eyeOpen: number;
  /** Pupil direction, -1..1 on each axis. */
  lookX: number;
  lookY: number;
  /** 1 = normal pupil, smaller = scared. */
  pupilScale: number;
  /** 0..1 sweat drop on the forehead. */
  sweat: number;
  /** Breathing / idle body bob in px. */
  bob: number;
};

export const DEFAULT_POSE: WildebeestPose = {
  standFront: 1,
  standRear: 1,
  tremble: 0,
  headDip: 0,
  tailSwing: 0,
  eyeOpen: 1,
  lookX: 0.3,
  lookY: 0,
  pupilScale: 1,
  sweat: 0,
  bob: 0,
};

/**
 * Cartoon wildebeest built from separate parts so every part can act on its own:
 * legs fold and tremble, body tilts between front and rear legs, head dips, eye blinks and looks.
 * Drawn facing right with the hooves on y = 0.
 */
export const Wildebeest: React.FC<{
  x: number;
  y: number;
  scale: number;
  variant: Variant;
  pose: Partial<WildebeestPose>;
  frame: number;
}> = ({x, y, scale, variant, pose: partialPose, frame}) => {
  const pose = {...DEFAULT_POSE, ...partialPose};
  const c = PALETTE[variant];
  const isAdult = variant === 'adult';

  const legLen = 96;
  const folded = 14;
  const frontH = mix(folded, legLen, pose.standFront);
  const rearH = mix(folded, legLen, pose.standRear);
  const bodyY = -(frontH + rearH) / 2 - 38 + pose.bob;
  const tilt = (-Math.atan2(frontH - rearH, 120) * 180) / Math.PI;

  const legs = [
    {hipX: -58, h: rearH, stand: pose.standRear, phase: 0.0, back: true},
    {hipX: -40, h: rearH, stand: pose.standRear, phase: 1.7, back: false},
    {hipX: 48, h: frontH, stand: pose.standFront, phase: 3.1, back: true},
    {hipX: 66, h: frontH, stand: pose.standFront, phase: 4.6, back: false},
  ];

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* contact shadow */}
      <ellipse cx={4} cy={2} rx={115} ry={12} fill="#2a160a" opacity={0.28} />

      {legs.map((leg, i) => {
        const shake = Math.sin(frame * 1.35 + leg.phase) * pose.tremble;
        const hipY = -leg.h + 2;
        // A folded leg bends forward at the knee; a standing leg is nearly straight.
        const bend = (1 - leg.stand) * 34;
        const kneeX = leg.hipX + bend + shake * 0.5;
        const kneeY = hipY / 2;
        const hoofX = leg.hipX + shake - bend * 0.6;
        return (
          <g key={i} opacity={leg.back ? 0.82 : 1}>
            <path
              d={`M${leg.hipX} ${hipY} L ${kneeX} ${kneeY} L ${hoofX} -4`}
              stroke={leg.back ? c.stripe : c.body}
              strokeWidth={isAdult ? 15 : 13}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <ellipse cx={hoofX} cy={-3} rx={8} ry={5} fill={c.dark} />
          </g>
        );
      })}

      <g transform={`translate(0 ${bodyY}) rotate(${tilt})`}>
        {/* tail */}
        <g transform={`translate(-96 -14) rotate(${pose.tailSwing})`}>
          <path d="M0 0 Q -22 18, -16 56" stroke={c.dark} strokeWidth={6} fill="none" strokeLinecap="round" />
          <ellipse cx={-16} cy={60} rx={7} ry={13} fill={c.dark} />
        </g>
        {/* body */}
        <ellipse cx={0} cy={0} rx={104} ry={isAdult ? 56 : 48} fill={c.body} />
        <ellipse cx={4} cy={18} rx={78} ry={24} fill={c.belly} opacity={0.75} />
        {isAdult &&
          [-50, -30, -10, 10, 30].map((sx) => (
            <path key={sx} d={`M${sx} -50 q 6 30, 0 56`} stroke={c.stripe} strokeWidth={5} fill="none" opacity={0.7} />
          ))}
        {/* neck + mane */}
        <path d="M58 -30 Q 96 -70, 122 -64 L 128 -18 Q 98 -6, 70 12 Z" fill={c.body} />
        <path
          d="M64 -40 Q 92 -82, 124 -70"
          stroke={c.dark}
          strokeWidth={isAdult ? 14 : 8}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={isAdult ? '6 5' : '4 4'}
        />

        {/* head */}
        <g transform={`translate(122 -54) rotate(${pose.headDip})`}>
          {isAdult && (
            <g stroke="#1f1b18" strokeWidth={8} fill="none" strokeLinecap="round">
              <path d="M2 -24 Q -26 -34, -18 -58" />
              <path d="M10 -26 Q 30 -48, 14 -64" />
            </g>
          )}
          <ellipse cx={-6} cy={-18} rx={10} ry={6} fill={c.dark} transform="rotate(-30 -6 -18)" />
          <path d="M-12 -22 Q 20 -36, 44 -6 Q 60 22, 52 44 Q 38 56, 24 44 Q 6 18, -14 8 Z" fill={c.body} />
          <path d="M30 6 Q 56 20, 52 44 Q 38 56, 26 44 Z" fill={c.dark} />
          {isAdult && <path d="M28 46 Q 22 74, 34 84 Q 40 70, 44 50" fill="#1f1b18" />}
          <circle cx={46} cy={40} r={3} fill="#120c08" />
          <Eye cx={18} cy={-6} r={isAdult ? 11 : 16} pose={pose} />
          {pose.sweat > 0 && (
            <path
              d={`M${2} ${-34 + (1 - pose.sweat) * 6} q -7 12, 0 16 q 7 -4, 0 -16 Z`}
              fill="#9fd6ff"
              stroke="#4e8fc2"
              strokeWidth={1.5}
              opacity={pose.sweat}
            />
          )}
        </g>
      </g>
    </g>
  );
};

const Eye: React.FC<{cx: number; cy: number; r: number; pose: WildebeestPose}> = ({cx, cy, r, pose}) => {
  const open = Math.max(0.06, pose.eyeOpen);
  const pr = r * 0.46 * pose.pupilScale;
  const px = cx + pose.lookX * (r - pr) * 0.8;
  const py = cy + pose.lookY * (r - pr) * 0.6;
  const clipId = `eye-${Math.round(cx)}-${Math.round(cy)}-${r}`;
  return (
    <g>
      <defs>
        <clipPath id={clipId}>
          <ellipse cx={cx} cy={cy} rx={r} ry={r * open} />
        </clipPath>
      </defs>
      <ellipse cx={cx} cy={cy} rx={r + 2} ry={r * open + 2} fill="#2b1c12" />
      <g clipPath={`url(#${clipId})`}>
        <circle cx={cx} cy={cy} r={r} fill="#fffdf6" />
        <circle cx={px} cy={py} r={pr} fill="#14100c" />
        <circle cx={px + pr * 0.35} cy={py - pr * 0.4} r={pr * 0.32} fill="#ffffff" />
      </g>
    </g>
  );
};

/** A lion hidden in tall grass: ear tips, brow and glowing eyes; the grass layer in front hides the rest. */
export const HiddenLion: React.FC<{
  x: number;
  y: number;
  scale: number;
  reveal: number;
  blink: number;
  lookX: number;
  dawn: number;
}> = ({x, y, scale, reveal, blink, lookX, dawn}) => {
  const rise = (1 - reveal) * 50;
  const mane = `rgb(${mix(110, 168, dawn)}, ${mix(70, 104, dawn)}, ${mix(36, 50, dawn)})`;
  const face = `rgb(${mix(150, 214, dawn)}, ${mix(110, 160, dawn)}, ${mix(60, 86, dawn)})`;
  const eyeH = Math.max(0.08, 1 - blink) * 7;
  return (
    <g transform={`translate(${x} ${y + rise}) scale(${scale})`} opacity={reveal}>
      <ellipse cx={0} cy={10} rx={66} ry={46} fill={mane} />
      <ellipse cx={-34} cy={-28} rx={12} ry={14} fill={face} />
      <ellipse cx={34} cy={-28} rx={12} ry={14} fill={face} />
      <ellipse cx={0} cy={6} rx={44} ry={38} fill={face} />
      <path d="M-30 -6 Q -16 -14, -4 -6 M4 -6 Q 16 -14, 30 -6" stroke="#5a3a1e" strokeWidth={4} fill="none" />
      {[-16, 16].map((ex) => (
        <g key={ex}>
          <ellipse cx={ex} cy={4} rx={9} ry={eyeH} fill="#ffc23a" />
          <ellipse cx={ex + lookX * 3} cy={4} rx={2.4} ry={eyeH * 0.9} fill="#1a0f05" />
          <circle cx={ex} cy={4} r={16} fill="#ffcf5a" opacity={0.18 * (1 - blink)} />
        </g>
      ))}
    </g>
  );
};
