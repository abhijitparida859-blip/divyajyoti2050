import { describe, it } from 'vitest';
import { calculatePlanetaryPositions, normalizeDegrees } from '../core/astronomy/ephemeris';
import { getJulianDay } from '../core/astronomy/julian';

describe('DIAG14', () => {
  it('sun/moon sidereal rates', () => {
    const a = new Date(Date.UTC(2026, 5, 25, 0, 0, 0));
    const b = new Date(Date.UTC(2026, 5, 26, 0, 0, 0));
    const pa = calculatePlanetaryPositions(a);
    const pb = calculatePlanetaryPositions(b);
    const dSun = normalizeDegrees(pb.sun - pa.sun);
    const dMoon = normalizeDegrees(pb.moon - pa.moon);
    console.log(`jd a=${getJulianDay(a)} b=${getJulianDay(b)} djd=${getJulianDay(b) - getJulianDay(a)}`);
    console.log(`sun ${pa.sun.toFixed(5)} -> ${pb.sun.toFixed(5)} rate=${dSun.toFixed(5)}`);
    console.log(`moon ${pa.moon.toFixed(5)} -> ${pb.moon.toFixed(5)} rate=${dMoon.toFixed(5)}`);
    console.log(`elongation rate=${(dMoon - dSun).toFixed(5)} (expected ~12.19)`);
  });
});
