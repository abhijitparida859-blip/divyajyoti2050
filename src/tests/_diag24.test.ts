import { describe, it } from 'vitest';
import { calculatePlanetaryPositions, normalizeDegrees } from '../core/astronomy/ephemeris';

describe('DIAG24', () => {
  it('elongation trace', () => {
    const at = (y: number, m: number, d: number, h = 0, mi = 0) => {
      const p = calculatePlanetaryPositions(new Date(y, m, d, h, mi));
      const el = normalizeDegrees(p.moon - p.sun);
      console.log(`E|${y}-${m + 1}-${d} ${h}:${mi}|sun=${p.sun.toFixed(3)}|moon=${p.moon.toFixed(3)}|el=${el.toFixed(3)}|t=${(el / 12).toFixed(3)}`);
    };
    at(2026, 5, 12, 5, 45);
    at(2026, 5, 15, 5, 45);
    at(2026, 8, 11, 5, 45);
    at(2026, 8, 14, 5, 45);
    for (let d = 8; d <= 18; d++) at(2026, 8, d, 5, 45);
    console.log('TZoffset(min)=' + new Date().getTimezoneOffset());
  });
});
