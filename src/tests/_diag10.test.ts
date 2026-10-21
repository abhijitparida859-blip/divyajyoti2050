import { describe, it } from 'vitest';
import { calculatePlanetaryPositions, normalizeDegrees } from '../core/astronomy/ephemeris';

function tithiAt(d: Date) {
  const p = calculatePlanetaryPositions(d);
  const diff = normalizeDegrees(p.moon - p.sun);
  return { exact: diff / 12, num: Math.floor(diff / 12) + 1, diff };
}

describe('DIAG10', () => {
  it('1975 sunrise elongation scan', () => {
    console.log('--- 1975-07-08 .. 07-12 hourly elongation ---');
    for (const ds of ['07-08', '07-09', '07-10', '07-11', '07-12']) {
      const [m, d] = ds.split('-').map(Number);
      for (let h = 0; h < 24; h += 2) {
        const t = new Date(1975, m - 1, d, h, 0, 0);
        const ti = tithiAt(t);
        console.log(`1975-${ds} ${String(h).padStart(2, '0')}:00 exact=${ti.exact.toFixed(4)} num=${ti.num} diff=${ti.diff.toFixed(4)}`);
      }
    }
  });

  it('1975 whole-year tithi-2 occurrence count', () => {
    let t2 = 0;
    let t1 = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date(1975, 0, 1 + i);
      const ti = tithiAt(d);
      if (ti.num === 2) t2++;
      if (ti.num === 1) t1++;
    }
    console.log(`1975 sunrises with tithi1=${t1} tithi2=${t2}`);
  });
});
