import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {rand, wobble, mix} from '../lib/motion';

// Every layer draws in a 1920x1080 world space; the Camera maps it onto the output frame.
export const WORLD_W = 1920;
export const WORLD_H = 1080;
export const HORIZON_Y = 640;

/** Dawn sky that warms from deep blue-violet to gold as `dawn` goes 0 -> 1. */
export const Sky: React.FC<{dawn: number}> = ({dawn}) => {
  const top = `rgb(${mix(28, 92, dawn)}, ${mix(34, 112, dawn)}, ${mix(78, 168, dawn)})`;
  const mid = `rgb(${mix(140, 244, dawn)}, ${mix(84, 160, dawn)}, ${mix(96, 92, dawn)})`;
  const low = `rgb(${mix(220, 255, dawn)}, ${mix(130, 206, dawn)}, ${mix(70, 120, dawn)})`;
  return (
    <g>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="0.62" stopColor={mid} />
          <stop offset="1" stopColor={low} />
        </linearGradient>
      </defs>
      <rect x={-200} y={-200} width={WORLD_W + 400} height={HORIZON_Y + 260} fill="url(#sky)" />
    </g>
  );
};

/** Rising sun with a soft halo and slowly turning god-rays. */
export const SunAndRays: React.FC<{x: number; y: number; dawn: number}> = ({x, y, dawn}) => {
  const frame = useCurrentFrame();
  const rays = Array.from({length: 14}, (_, i) => i);
  const spin = frame * 0.04;
  return (
    <g>
      <defs>
        <radialGradient id="halo">
          <stop offset="0" stopColor="#fff6d8" stopOpacity={0.95} />
          <stop offset="0.25" stopColor="#ffd27a" stopOpacity={0.55} />
          <stop offset="1" stopColor="#ff9a4a" stopOpacity={0} />
        </radialGradient>
        <linearGradient id="ray" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff1c4" stopOpacity={0.35} />
          <stop offset="1" stopColor="#fff1c4" stopOpacity={0} />
        </linearGradient>
      </defs>
      <g transform={`translate(${x} ${y}) rotate(${spin})`} opacity={0.35 + dawn * 0.5}>
        {rays.map((i) => {
          const len = 1300 + rand(i) * 500;
          const width = 30 + rand(i + 40) * 60;
          const pulse = 0.55 + 0.45 * Math.sin(frame / 25 + i);
          return (
            <polygon
              key={i}
              points={`0,0 ${len},${-width} ${len},${width}`}
              fill="url(#ray)"
              opacity={pulse}
              transform={`rotate(${(360 / rays.length) * i + rand(i + 9) * 12})`}
            />
          );
        })}
      </g>
      <circle cx={x} cy={y} r={420} fill="url(#halo)" />
      <circle cx={x} cy={y} r={70} fill="#fff4d6" />
    </g>
  );
};

/** Layered distant hills and acacia silhouettes; `parallax` shifts each layer by depth. */
export const Hills: React.FC<{parallax: number; dawn: number}> = ({parallax, dawn}) => {
  const far = `rgba(${mix(70, 150, dawn)}, ${mix(50, 96, dawn)}, ${mix(80, 96, dawn)}, 0.85)`;
  const near = `rgb(${mix(46, 112, dawn)}, ${mix(34, 72, dawn)}, ${mix(40, 50, dawn)})`;
  return (
    <g>
      <path
        transform={`translate(${parallax * 0.2} 0)`}
        d={`M-300 ${HORIZON_Y} C 100 520, 360 560, 640 590 S 1180 500, 1500 560 S 2000 540, 2300 ${HORIZON_Y} Z`}
        fill={far}
      />
      <g transform={`translate(${parallax * 0.45} 0)`}>
        <path
          d={`M-300 ${HORIZON_Y + 10} C 200 600, 500 620, 900 615 S 1600 590, 2300 ${HORIZON_Y + 10} Z`}
          fill={near}
        />
        <Acacia x={260} y={HORIZON_Y - 6} s={1} color={near} />
        <Acacia x={1380} y={HORIZON_Y - 12} s={1.35} color={near} />
        <Acacia x={1720} y={HORIZON_Y - 2} s={0.7} color={near} />
      </g>
    </g>
  );
};

const Acacia: React.FC<{x: number; y: number; s: number; color: string}> = ({x, y, s, color}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={color} stroke={color}>
    <path d="M0 0 L4 -70 L-10 -110 M4 -70 L22 -104" strokeWidth={7} fill="none" strokeLinecap="round" />
    <ellipse cx={4} cy={-118} rx={95} ry={20} />
    <ellipse cx={-30} cy={-128} rx={50} ry={14} />
    <ellipse cx={40} cy={-126} rx={55} ry={14} />
  </g>
);

/** Distant herd walking the ridge: tiny silhouettes with a walking bob. */
export const DistantHerd: React.FC<{parallax: number; dawn: number}> = ({parallax, dawn}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const color = `rgb(${mix(40, 86, dawn)}, ${mix(30, 56, dawn)}, ${mix(36, 44, dawn)})`;
  return (
    <g transform={`translate(${parallax * 0.45} 0)`} fill={color}>
      {Array.from({length: 18}, (_, i) => {
        const baseX = 520 + i * 34 + rand(i) * 20;
        const x = baseX + frame * 0.35;
        const y = 604 + rand(i + 3) * 10 + wobble(frame, fps, 1.6, 1.4, i);
        const s = 0.8 + rand(i + 7) * 0.4;
        return (
          <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
            <ellipse cx={0} cy={0} rx={11} ry={6} />
            <rect x={8} y={-7} width={7} height={6} rx={2} />
            <rect x={-9} y={3} width={2} height={9} />
            <rect x={7} y={3} width={2} height={9} />
          </g>
        );
      })}
    </g>
  );
};

/** Birds crossing the sky with a flapping wing stroke. */
export const Birds: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <g stroke="#2c1d22" strokeWidth={3} fill="none" strokeLinecap="round">
      {Array.from({length: 5}, (_, i) => {
        const x = -100 + frame * (2.4 + rand(i) * 0.6) + i * 60;
        const y = 250 + i * 18 + Math.sin(frame / 30 + i) * 8;
        const flap = Math.sin(frame / 3 + i * 1.7) * 9;
        return <path key={i} d={`M${x - 14} ${y + flap} Q ${x - 6} ${y - 4}, ${x} ${y} Q ${x + 6} ${y - 4}, ${x + 14} ${y + flap}`} />;
      })}
    </g>
  );
};

/** Ground plane between horizon and the bottom of the frame. */
export const Ground: React.FC<{dawn: number}> = ({dawn}) => (
  <g>
    <defs>
      <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={`rgb(${mix(96, 186, dawn)}, ${mix(70, 140, dawn)}, ${mix(48, 70, dawn)})`} />
        <stop offset="1" stopColor={`rgb(${mix(54, 120, dawn)}, ${mix(40, 86, dawn)}, ${mix(30, 40, dawn)})`} />
      </linearGradient>
    </defs>
    <rect x={-300} y={HORIZON_Y - 4} width={WORLD_W + 600} height={WORLD_H - HORIZON_Y + 300} fill="url(#ground)" />
  </g>
);

/**
 * A field of swaying grass blades between yTop and yBottom. Each blade has its own phase,
 * and a slow gust wave rolls across the field so the motion never looks looped.
 */
export const GrassField: React.FC<{
  seed: number;
  count: number;
  yTop: number;
  yBottom: number;
  height: [number, number];
  dawn: number;
  shade: number;
}> = ({seed, count, yTop, yBottom, height, dawn, shade}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  return (
    <g>
      {Array.from({length: count}, (_, i) => {
        const r1 = rand(seed + i);
        const r2 = rand(seed + i * 3.1);
        const x = -150 + r1 * (WORLD_W + 300);
        const y = mix(yTop, yBottom, r2);
        const h = mix(height[0], height[1], rand(seed + i * 7.3));
        const gust = Math.sin(t * 0.9 - x / 380) * 0.6 + 0.4;
        const sway = Math.sin(t * 2.2 + r1 * 20) * 6 + gust * 9;
        const lean = (r2 - 0.5) * 10;
        const tipX = x + sway + lean;
        const light = mix(0.65, 1.1, rand(seed + i * 5.7)) * shade;
        const col = `rgb(${Math.min(255, mix(120, 214, dawn) * light)}, ${Math.min(255, mix(92, 168, dawn) * light)}, ${Math.min(255, mix(46, 78, dawn) * light)})`;
        return (
          <path
            key={i}
            d={`M${x - 3} ${y} Q ${x + sway * 0.4} ${y - h * 0.55}, ${tipX} ${y - h} Q ${x + sway * 0.45 + 2} ${y - h * 0.5}, ${x + 3} ${y} Z`}
            fill={col}
          />
        );
      })}
    </g>
  );
};

/** Dust motes catching the low sun: drift up and sideways, twinkle in and out. */
export const DustMotes: React.FC<{count: number; seed: number}> = ({count, seed}) => {
  const frame = useCurrentFrame();
  return (
    <g>
      {Array.from({length: count}, (_, i) => {
        const r = rand(seed + i);
        const speed = 0.25 + rand(seed + i * 2) * 0.6;
        const x = ((rand(seed + i * 4) * (WORLD_W + 200) + frame * speed * 1.4) % (WORLD_W + 200)) - 100;
        const y = 220 + rand(seed + i * 6) * 820 - frame * speed * 0.5 + Math.sin(frame / 40 + i) * 14;
        const size = 1.5 + r * 4;
        const twinkle = 0.25 + 0.75 * Math.abs(Math.sin(frame / (30 + r * 40) + i));
        return <circle key={i} cx={x} cy={y} r={size} fill="#fff1c9" opacity={twinkle * 0.7} />;
      })}
    </g>
  );
};

/** Warm haze, vignette and a light film grain over everything; drawn in screen space, outside the camera. */
export const Atmosphere: React.FC<{dawn: number; width: number; height: number}> = ({dawn, width, height}) => {
  const frame = useCurrentFrame();
  const grain = interpolate(Math.sin(frame * 7.1), [-1, 1], [0.025, 0.05]);
  return (
    <g pointerEvents="none">
      <defs>
        <radialGradient id="vignette" cx="0.5" cy="0.5" r="0.75">
          <stop offset="0.55" stopColor="#000" stopOpacity={0} />
          <stop offset="1" stopColor="#120806" stopOpacity={0.6} />
        </radialGradient>
        <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.45" stopColor="#ffcf8a" stopOpacity={0} />
          <stop offset="0.62" stopColor="#ffcf8a" stopOpacity={0.18 * dawn} />
          <stop offset="0.8" stopColor="#ffcf8a" stopOpacity={0} />
        </linearGradient>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={frame % 12} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
      <rect x={0} y={0} width={width} height={height} fill="url(#haze)" />
      <rect x={0} y={0} width={width} height={height} filter="url(#grain)" opacity={grain} />
      <rect x={0} y={0} width={width} height={height} fill="url(#vignette)" />
    </g>
  );
};
