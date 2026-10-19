import React from 'react';
import {Composition} from 'remotion';
import {WildebeestProof, PROOF_DURATION} from './scenes/WildebeestProof';

export const FPS = 30;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="WildebeestProof"
      component={WildebeestProof}
      durationInFrames={PROOF_DURATION}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="WildebeestProofVertical"
      component={WildebeestProof}
      durationInFrames={PROOF_DURATION}
      fps={FPS}
      width={1080}
      height={1920}
    />
  </>
);
