import { describe, it } from 'vitest';
import { calculatePlanetaryPositions, normalizeDegrees } from '../core/astronomy/ephemeris';

describe('DIAG15', () => {
  it('mean elongation rate over 1 and 5 years', () => {
    for (const span of [365, 1826]) {
      const a = new Date(Date.UTC(2020, 0, 1, 0, 0, 0));
      const b = new Date(Date.UTC(2020, 0, 1, 0, 0, 0));
      b.setUTCDate(b.getUTCDate() + span);
      const pa = calculatePlanetaryPositions(a);
      const pb = calculatePlanetaryPositions(b);
      const dMoon = normalizeDegrees(pb.moon - pa.moon);
      const dSun = normalizeDegrees(pb.sun - pa.sun);
      console.log(
        `span=${span}d dMoon=${dMoon.toFixed(3)} dSun=${dSun.toFixed(3)} elong/day=${((dMoon - dSun) / span).toFixed(5)} (expect 12.1907)`
      );
    }
  });
});
