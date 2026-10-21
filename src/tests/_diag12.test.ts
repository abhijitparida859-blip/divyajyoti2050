import { describe, it } from 'vitest';
import { calculatePlanetaryPositions, normalizeDegrees } from '../core/astronomy/ephemeris';

describe('DIAG13', () => {
  it('elongation at sunrise 2026-06-25..07-05', () => {
    let prevDiff: number | null = null;
    for (let i = 0; i < 11; i++) {
      const d = new Date(2026, 5, 25 + i, 5, 15, 0);
      const p = calculatePlanetaryPositions(d);
      const diff = normalizeDegrees(p.moon - p.sun);
      const rate = prevDiff === null ? NaN : diff - prevDiff;
      console.log(
        `2026-06-${25 + i} diff=${diff.toFixed(4)} exact=${(diff / 12).toFixed(4)}` +
        ` num=${Math.floor(diff / 12) + 1} rate/day=${rate.toFixed(4)}`
      );
      prevDiff = diff;
    }
  });
});
