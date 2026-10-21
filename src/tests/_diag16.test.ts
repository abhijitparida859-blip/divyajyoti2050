import { describe, it } from 'vitest';
import { calculatePlanetaryPositions, normalizeDegrees } from '../core/astronomy/ephemeris';
import { getJulianDay, getJulianCenturies } from '../core/astronomy/julian';
import { getLahiriAyanamsha } from '../core/astronomy/ayanamsha';

describe('DIAG17', () => {
  it('Meeus validation', () => {
    // Meeus Example 25.b : 1992 October 13.0 TD  -> apparent solar longitude 199.90895
    // Meeus Example 47.a : 1992 April 12.0 TD   -> Moon lambda 133.162655, beta -3.229126
    const cases: Array<[string, number, number, number]> = [
      // label, jdUT, dtSeconds, expectedTropicalLon
      ['Sun 1992-10-13', 2448908.5, 59, 199.90988],
      ['Moon 1992-04-12', 2448724.5, 59, 133.162655],
      ['Sun 2026-07-16', 2461242.5, 69, 0],
      ['Moon 2026-07-16', 2461242.5, 69, 0]
    ];
    for (const [label, jd, dt, expected] of cases) {
      const d = new Date((jd + dt / 86400 - 2440587.5) * 86400000);
      const p = calculatePlanetaryPositions(d);
      const ay = getLahiriAyanamsha(getJulianDay(d));
      const sunTrop = normalizeDegrees(p.sun + ay);
      const moonTrop = normalizeDegrees(p.moon + ay);
      console.log(label, 'sunTrop=', sunTrop.toFixed(5), 'moonTrop=', moonTrop.toFixed(5), expected ? 'expected=' + expected : '');
    }
  });
});
