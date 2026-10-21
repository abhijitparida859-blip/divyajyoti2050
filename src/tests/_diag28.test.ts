import { describe, it } from 'vitest';
import { calculatePlanetaryPositions } from '../core/astronomy/ephemeris';
import { calculateSunTimes } from '../core/astronomy/solar_lunar';

const tithiAt = (d: Date) => {
  const p = calculatePlanetaryPositions(d);
  const el = ((p.moon - p.sun) % 360 + 360) % 360;
  return { el, n: Math.floor(el / 12) + 1 };
};

const sunriseDate = (y: number, m: number, d: number) => {
  const st = calculateSunTimes(new Date(y, m, d), 19.8135, 85.8312);
  const [hm, p] = st.sunrise.split(' ');
  let [h, mi] = hm.split(':').map(Number);
  if (p === 'PM' && h !== 12) h += 12;
  if (p === 'AM' && h === 12) h = 0;
  return new Date(y, m, d, h, mi, 0);
};

describe('DIAG28', () => {
  it('two day tithis 2026', () => {
    for (let m = 0; m < 12; m++) {
      const days = new Date(2026, m + 1, 0).getDate();
      for (let d = 1; d <= days; d++) {
        const cur = tithiAt(sunriseDate(2026, m, d));
        const prev = tithiAt(sunriseDate(2026, m, d - 1));
        if (cur.n === prev.n && (cur.n === 15 || cur.n === 30)) {
          console.log(`TWO|2026-${m + 1}-${d}|t=${cur.n}|el=${cur.el.toFixed(3)}`);
        }
      }
    }
  });
});
