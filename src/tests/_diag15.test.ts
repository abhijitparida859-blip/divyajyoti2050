import { describe, it } from 'vitest';
import { calculatePlanetaryPositions, normalizeDegrees } from '../core/astronomy/ephemeris';

function elong(d: Date): number {
  const p = calculatePlanetaryPositions(d);
  return normalizeDegrees(p.moon - p.sun);
}

describe('DIAG16', () => {
  it('unwrapped elongation over 1 year', () => {
    const start = new Date(Date.UTC(2020, 0, 1, 0, 0, 0));
    let acc = 0;
    let prev = elong(start);
    for (let i = 1; i <= 365; i++) {
      const d = new Date(start.getTime() + i * 86400000);
      const e = elong(d);
      let step = e - prev;
      if (step < 0) step += 360;
      acc += step;
      prev = e;
    }
    console.log(`elong total over 365d = ${acc.toFixed(3)} (expected 4450.6 => deficit ${(4450.6 - acc).toFixed(3)})`);
    console.log(`per day = ${(acc / 365).toFixed(5)} (expected 12.1907)`);
  });
});
