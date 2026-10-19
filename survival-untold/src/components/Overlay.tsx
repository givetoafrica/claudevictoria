import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';

/** On-screen caption in screen space (unaffected by the camera). Rises slightly as it fades in. */
export const Label: React.FC<{
  text: string;
  opacity: number;
  /** Position as fractions of the output frame. */
  x: number;
  y: number;
  size?: number;
  align?: 'left' | 'center';
  accent?: boolean;
}> = ({text, opacity, x, y, size = 46, align = 'left', accent = false}) => {
  const {width, height} = useVideoConfig();
  const unit = Math.min(width, height) / 1080;
  if (opacity <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x * width,
        top: y * height + (1 - opacity) * 14 * unit,
        transform: align === 'center' ? 'translateX(-50%)' : undefined,
        opacity,
        fontFamily: '"DejaVu Sans", "Trebuchet MS", sans-serif',
        fontWeight: 800,
        fontSize: size * unit,
        letterSpacing: 0.5 * unit,
        color: accent ? '#ffd166' : '#fffaf0',
        textShadow: `0 ${3 * unit}px ${10 * unit}px rgba(20,8,0,0.65)`,
        whiteSpace: 'pre',
        textAlign: align,
      }}
    >
      {text}
    </div>
  );
};

/** Black fade for scene in/out. */
export const Fade: React.FC<{opacity: number}> = ({opacity}) => (
  <AbsoluteFill style={{backgroundColor: '#000', opacity, pointerEvents: 'none'}} />
);
