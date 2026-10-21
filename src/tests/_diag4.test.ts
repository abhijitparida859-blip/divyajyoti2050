import { describe, it } from 'vitest';
import { calculatePlanetaryPositions } from '../core/astronomy/ephemeris';

const norm = (d: number) => ((d % 360) + 360) % 360;

describe('DIAG4', () => {
  it('elongation 1975 july', () => {
    for (let day = 7; day <= 14; day++) {
      const d = new Date(1975, 6, day, 5, 30);
      const p = calculatePlanetaryPositions(d);
      const e = norm(p.moon - p.sun);
      console.log('E75-07-' + day + ' elong=' + e.toFixed(3) + ' idx=' + (e / 12).toFixed(3) + ' tithi=' + (Math.floor(e / 12) + 1));
    }
  });

  it('elongation 2026 june', () => {
    for (let day = 27; day <= 29; day++) {
      for (const day2 of [29, 30]) {
        const d = new Date(2026, 5, day2, 5, 30);
        const p = calculatePlanetaryPositions(d);
        const e = norm(p.moon - p.sun);
        console.log('E26-06-' + day2 + ' elong=' + e.toFixed(3) + ' idx=' + (e / 12).toFixed(3) + ' tithi=' + (Math.floor(e / 12) + 1) + ' (day' + day + ')');
        break;
      }
    }
  });
});
