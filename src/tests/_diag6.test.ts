import { describe, it } from 'vitest';
import { calculatePlanetaryPositions } from '../core/astronomy/ephemeris';

const norm = (d: number) => ((d % 360) + 360) % 360;

describe('DIAG6', () => {
  it('2026 june 27-30 raw', () => {
    for (let day = 27; day <= 30; day++) {
      const d = new Date(2026, 5, day, 5, 30);
      const p = calculatePlanetaryPositions(d);
      console.log('R26 day=' + day + ' sun=' + p.sun.toFixed(3) + ' moon=' + p.moon.toFixed(3) + ' elong=' + norm(p.moon - p.sun).toFixed(3) + ' tithi=' + (Math.floor(norm(p.moon - p.sun) / 12) + 1));
    }
  });

  it('1975 july 8-12 raw', () => {
    for (let day = 8; day <= 12; day++) {
      const d = new Date(1975, 6, day, 5, 30);
      const p = calculatePlanetaryPositions(d);
      console.log('R75 day=' + day + ' sun=' + p.sun.toFixed(3) + ' moon=' + p.moon.toFixed(3) + ' elong=' + norm(p.moon - p.sun).toFixed(3) + ' tithi=' + (Math.floor(norm(p.moon - p.sun) / 12) + 1));
    }
  });
});
