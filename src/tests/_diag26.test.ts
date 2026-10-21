import { describe, it } from 'vitest';
import { calculatePlanetaryPositions, normalizeDegrees } from '../core/astronomy/ephemeris';

describe('DIAG28', () => {
  it('1975 july elongation fine scan', () => {
    const base = new Date(1975, 6, 8, 0, 0, 0).getTime();
    for (let h = 0; h <= 96; h += 3) {
      const p = calculatePlanetaryPositions(new Date(base + h * 3600000));
      const el = normalizeDegrees(p.moon - p.sun);
      const t = Math.floor(el / 12) + 1;
      console.log(`E|1975-07-${8 + Math.floor((8 + h) / 24)}|h${h}|el=${el.toFixed(3)}|t=${t}`);
    }
  });
});

