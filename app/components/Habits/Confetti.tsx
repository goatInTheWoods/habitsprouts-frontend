import React, { useCallback, useEffect, useRef } from 'react';

// @ts-expect-error TS(2307) FIXME: Cannot find module 'react-canvas-confetti' or its ... Remove this comment to see the full error message
import ReactCanvasConfetti from 'react-canvas-confetti';

export default function Confetti() {
  const refAnimationInstance = useRef(null);

  const getInstance = useCallback((instance: $TSFixMe) => {
    refAnimationInstance.current = instance;
  }, []);

  const makeShot = useCallback((particleRatio: $TSFixMe, opts: $TSFixMe) => {
    refAnimationInstance.current &&
      // @ts-expect-error TS(2349) FIXME: This expression is not callable.
      refAnimationInstance.current({
        ...opts,
        origin: { y: 0.7 },
        particleCount: Math.floor(200 * particleRatio),
      });
  }, []);

  useEffect(() => fire(), []);

  const fire = useCallback(() => {
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    makeShot(0.2, {
      spread: 60,
    });

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, [makeShot]);

  return (
    <ReactCanvasConfetti
      refConfetti={getInstance}
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
      }}
    />
  );
}
