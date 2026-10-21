import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiProps { onFinish: () => void; }
export const Confetti: React.FC<ConfettiProps> = ({ onFinish }) => {
  useEffect(() => {
    const duration = 2000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#ffd700', '#ef5350', '#4caf50', '#4fc3f7', '#ffab40', '#ce93d8'] });
      confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#ffd700', '#ef5350', '#4caf50', '#4fc3f7', '#ffab40', '#ce93d8'] });
      if (Date.now() < end) requestAnimationFrame(frame); else onFinish();
    };
    requestAnimationFrame(frame);
  }, [onFinish]);
  return null;
};