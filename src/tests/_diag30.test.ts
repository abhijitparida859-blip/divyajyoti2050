import { describe, it } from 'vitest';
import { calculatePlanetaryPositions } from '../core/astronomy/ephemeris';
import { calculateSunTimes } from '../core/astronomy/solar_lunar';

const norm = (d: number) => ((d % 360) + 360) % 360;

describe('DIAG30', () => {
  it('june 29/30 detail', () => {
    for (const d of [28, 29, 30, 31]) {
      const st = calculateSunTimes(new Date(2026, 5, d), 19.8135, 85.8312);
      console.log(`SUN|2026-06-${d}|rise=${st.sunrise}|set=${st.sunset}`);
    }
    // find purnima boundaries by scanning hours
    for (let h = 0; h < 24 * 4; h++) {
      const t = new Date(2026, 5, 28, 0, 0, 0);
      t.setTime(t.getTime() + h * 3600000);
      const p = calculatePlanetaryPositions(t);
      const el = norm(p.moon - p.sun);
      const idx = Math.floor(el / 12);
      if (idx === 14) {
        console.log(`P15|${t.toString().slice(0, 21)}|el=${el.toFixed(4)}`);
      }
    }
  });
});
