import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing} from 'remotion';
import {
  Atmosphere,
  Birds,
  DistantHerd,
  DustMotes,
  GrassField,
  Ground,
  Hills,
  Sky,
  SunAndRays,
  WORLD_H,
  WORLD_W,
} from '../components/Savanna';
import {HiddenLion, Wildebeest} from '../components/Characters';
import {Fade, Label} from '../components/Overlay';
import {fadeWindow, mix, ramp, wobble} from '../lib/motion';

export const PROOF_DURATION = 450; // 15 s at 30 fps

const CALF = {x: 930, y: 836};
const LIONS_X = 1430;

/** Blink curve: 1 = open, dips to 0 over a few frames at each blink start. */
const blinkAt = (frame: number, starts: number[]): number => {
  let open = 1;
  for (const s of starts) {
    open = Math.min(open, interpolate(frame, [s, s + 3, s + 6], [1, 0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  }
  return open;
};

/**
 * Proof scene: a newborn wildebeest calf tries to stand at dawn, finally does,
 * and immediately notices it is being watched from the grass.
 */
export const WildebeestProof: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const vertical = height > width;

  // --- world light ---
  const dawn = mix(0.15, 1, ramp(frame, 0, 320, Easing.out(Easing.quad)));
  const sunY = mix(700, 560, ramp(frame, 0, 450, Easing.out(Easing.quad)));

  // --- calf performance ---
  const rearUp = ramp(frame, 120, 165, Easing.out(Easing.back(1.4)));
  const firstTry = ramp(frame, 168, 198, Easing.out(Easing.quad));
  const collapse = ramp(frame, 200, 210, Easing.in(Easing.quad));
  const secondTry = ramp(frame, 226, 272, Easing.out(Easing.back(1.2)));
  const standRear = Math.min(1, rearUp * 0.85 + secondTry * 0.15);
  const standFront = secondTry > 0 ? mix(0.1, 1, secondTry) : mix(firstTry * 0.6, 0.1, collapse);
  const nervous = ramp(frame, 355, 370);
  const tremble =
    interpolate(frame, [120, 140, 200, 230, 280, 320], [0, 6, 9, 8, 3, 1.5], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) +
    nervous * 3;
  const pride = ramp(frame, 288, 300) * (1 - ramp(frame, 318, 330));
  const calfBob = wobble(frame, fps, 0.6, 2) - pride * 10 * Math.abs(Math.sin((frame - 288) / 4));
  const headDip = mix(28, 0, Math.max(rearUp * 0.4, secondTry)) + collapse * (1 - secondTry) * 14 - pride * 8;
  const calfEyeOpen = Math.min(
    ramp(frame, 58, 70),
    blinkAt(frame, [96, 182, 252, 330]),
    1 - ramp(frame, 202, 206) * (1 - ramp(frame, 214, 222)) * 0.85, // squeeze on the fall
  );
  const lookAround = frame < 120 ? Math.sin(frame / 14) * 0.7 : 0.25;
  const snapToLions = ramp(frame, 354, 360, Easing.out(Easing.cubic));
  const calfPose = {
    standFront,
    standRear,
    tremble,
    headDip,
    tailSwing: wobble(frame, fps, 1.1, 10) + pride * wobble(frame, fps, 4, 25),
    eyeOpen: calfEyeOpen,
    lookX: mix(lookAround, 1, snapToLions),
    lookY: mix(frame < 120 ? 0.2 : -0.1, 0, snapToLions),
    pupilScale: mix(1, 0.5, snapToLions),
    sweat: ramp(frame, 372, 388),
    bob: calfBob,
  };

  // --- mother ---
  const nuzzle = ramp(frame, 296, 326) * (1 - ramp(frame, 348, 362));
  const motherAlarm = ramp(frame, 360, 368);
  const motherPose = {
    headDip: mix(6, 38, nuzzle) - motherAlarm * 10,
    tailSwing: wobble(frame, fps, 0.8, 14, 1),
    eyeOpen: blinkAt(frame, [70, 210, 340]),
    lookX: mix(0.2, 1, motherAlarm),
    lookY: mix(0.1, 0.6, nuzzle),
    pupilScale: mix(1, 0.6, motherAlarm),
    bob: wobble(frame, fps, 0.4, 2.5, 2),
  };

  // --- lions ---
  const lionReveal = ramp(frame, 332, 362, Easing.out(Easing.cubic));
  const lionBlink = 1 - blinkAt(frame, [398, 432]);

  // --- camera: slow push-in, drift, then a nudge toward the lions when they appear ---
  const push = ramp(frame, 0, 450, Easing.inOut(Easing.sin));
  const toLions = ramp(frame, 336, 372, Easing.inOut(Easing.cubic));
  const zoom = mix(1.0, 1.1, push) + toLions * 0.03;
  const baseScale = Math.max(width / WORLD_W, height / WORLD_H);
  const scale = baseScale * zoom;
  const focusX = vertical ? mix(CALF.x + 40, LIONS_X - 150, toLions) : mix(WORLD_W / 2, 1060, push) + toLions * 90;
  const focusY = vertical ? 760 : mix(WORLD_H / 2, 600, push);
  const halfW = width / 2 / scale;
  const halfH = height / 2 / scale;
  const cx = Math.min(Math.max(focusX, halfW - 120), WORLD_W + 120 - halfW);
  const cy = Math.min(Math.max(focusY, halfH - 60), WORLD_H - halfH);
  const camera = `translate(${width / 2} ${height / 2}) scale(${scale}) translate(${-cx} ${-cy})`;
  const parallax = -frame * 0.3;

  return (
    <AbsoluteFill style={{backgroundColor: '#140a06'}}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <g transform={camera}>
          <Sky dawn={dawn} />
          <SunAndRays x={1240} y={sunY} dawn={dawn} />
          <Birds />
          <Hills parallax={parallax} dawn={dawn} />
          <DistantHerd parallax={parallax} dawn={dawn} />
          <Ground dawn={dawn} />
          <GrassField seed={11} count={420} yTop={650} yBottom={845} height={[16, 62]} dawn={dawn} shade={0.92} />
          <Wildebeest x={470} y={806} scale={1.85} variant="adult" pose={motherPose} frame={frame} />
          <Wildebeest x={CALF.x} y={CALF.y} scale={1.25} variant="calf" pose={calfPose} frame={frame} />
          <HiddenLion x={LIONS_X} y={812} scale={1.45} reveal={lionReveal} blink={lionBlink} lookX={-1} dawn={dawn} />
          <HiddenLion x={LIONS_X + 230} y={836} scale={1.2} reveal={ramp(frame, 346, 374)} blink={1 - blinkAt(frame, [412])} lookX={-1} dawn={dawn} />
          <GrassField seed={77} count={300} yTop={880} yBottom={1120} height={[70, 210]} dawn={dawn} shade={0.72} />
          <DustMotes count={90} seed={5} />
        </g>
        <Atmosphere dawn={dawn} width={width} height={height} />
      </svg>

      <Label text={'SERENGETI  ·  5:42 AM'} opacity={fadeWindow(frame, 18, 110, 15, 15)} x={0.05} y={0.07} size={40} />
      <Label text={'Age: 4 minutes'} opacity={fadeWindow(frame, 124, 214)} x={vertical ? 0.08 : 0.56} y={vertical ? 0.3 : 0.4} />
      <Label text={'Attempt #1'} opacity={fadeWindow(frame, 168, 212, 8, 8)} x={vertical ? 0.08 : 0.56} y={vertical ? 0.35 : 0.47} size={34} accent />
      <Label text={'Attempt #2'} opacity={fadeWindow(frame, 224, 292, 8, 10)} x={vertical ? 0.08 : 0.56} y={vertical ? 0.35 : 0.47} size={34} accent />
      <Label text={'Age: 7 minutes'} opacity={fadeWindow(frame, 296, 350)} x={vertical ? 0.08 : 0.56} y={vertical ? 0.3 : 0.4} />
      <Label
        text={vertical ? 'Age: 7 minutes.\nAlready on the menu.' : 'Age: 7 minutes. Already on the menu.'}
        opacity={fadeWindow(frame, 382, 452, 10, 1)}
        x={0.5}
        y={vertical ? 0.16 : 0.12}
        size={vertical ? 58 : 60}
        align="center"
        accent
      />

      <Fade opacity={interpolate(frame, [0, 22, PROOF_DURATION - 10, PROOF_DURATION], [1, 0, 0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
    </AbsoluteFill>
  );
};
