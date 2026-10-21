import { describe, it, expect } from 'vitest';
import { getJulianDay } from '../core/astronomy/julian';
import { getLahiriAyanamsha } from '../core/astronomy/ayanamsha';
import { calculatePlanetaryPositions } from '../core/astronomy/ephemeris';
import { calculateSunTimes } from '../core/astronomy/solar_lunar';

describe('Vedic Astronomy Engine', () => {
  it('calculates correct Julian Day for J2000 epoch', () => {
    const j2000 = new Date(Date.UTC(2000, 0, 1, 12, 0, 0));
    const jd = getJulianDay(j2000);
    expect(Math.abs(jd - 2451545.0)).toBeLessThan(0.01);
  });

  it('calculates accurate Lahiri Ayanamsha (~23.85° at J2000)', () => {
    const jd2000 = 2451545.0;
    const ayan = getLahiriAyanamsha(jd2000);
    expect(ayan).toBeCloseTo(23.857, 2);
  });

  it('computes realistic planetary longitudes between 0 and 360', () => {
    const date = new Date(Date.UTC(2026, 8, 3, 4, 30, 0));
    const planets = calculatePlanetaryPositions(date);
    expect(planets.sun).toBeGreaterThanOrEqual(0);
    expect(planets.sun).toBeLessThan(360);
    expect(planets.moon).toBeGreaterThanOrEqual(0);
    expect(planets.moon).toBeLessThan(360);
    expect(planets.jupiter).toBeGreaterThanOrEqual(0);
    expect(planets.saturn).toBeGreaterThanOrEqual(0);
    // Rahu and Ketu must be opposite (180 degrees apart)
    const diff = Math.abs(planets.ketu - planets.rahu) % 360;
    expect(diff).toBeCloseTo(180, 1);
  });

  it('calculates sunrise and sunset times for Delhi (28.6°N, 77.2°E)', () => {
    const date = new Date('2026-09-03T06:00:00Z');
    const sunTimes = calculateSunTimes(date, 28.6139, 77.2090);
    expect(sunTimes.sunrise).toBeDefined();
    expect(sunTimes.sunset).toBeDefined();
    expect(sunTimes.dayLengthMinutes).toBeGreaterThan(600); // Greater than 10 hours
  });
});
