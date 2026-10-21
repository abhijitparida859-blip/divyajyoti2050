import { describe, it, expect } from 'vitest';
import {
  calculateHaversineKm,
  calculateBearingDegrees,
  getCompassDirection,
  getVedicDishaShula,
  PRESET_DESTINATIONS,
  PRESET_ORIGINS
} from '../components/3d/PilgrimageRouteNavigator';

describe('Pilgrimage GPS Route & Navigation Mathematical Engine', () => {
  it('accurately calculates Haversine distance between Bhubaneswar and Puri', () => {
    // Bhubaneswar (20.2668, 85.8436) to Puri Jagannath Temple (19.8135, 85.8312)
    const dist = calculateHaversineKm(20.2668, 85.8436, 19.8135, 85.8312);
    // Straight-line distance is ~50.4 km
    expect(dist).toBeGreaterThan(48);
    expect(dist).toBeLessThan(55);
  });

  it('accurately computes cardinal bearing and compass direction for Bhubaneswar to Puri (South)', () => {
    const bearing = calculateBearingDegrees(20.2668, 85.8436, 19.8135, 85.8312);
    // Puri is almost directly South of Bhubaneswar (~181 degrees)
    expect(bearing).toBeGreaterThan(170);
    expect(bearing).toBeLessThan(190);

    const dir = getCompassDirection(bearing);
    expect(dir.en).toBe('South');
    expect(dir.or).toContain('ଦକ୍ଷିଣ');
  });

  it('accurately calculates distance and bearing for Puri to Konark (East-North-East)', () => {
    // Puri (19.8135, 85.8312) to Konark (19.8876, 86.0945)
    const dist = calculateHaversineKm(19.8135, 85.8312, 19.8876, 86.0945);
    // Marine Drive straight distance ~28.8 km
    expect(dist).toBeGreaterThan(25);
    expect(dist).toBeLessThan(35);

    const bearing = calculateBearingDegrees(19.8135, 85.8312, 19.8876, 86.0945);
    // Konark is roughly East-North-East (~72°)
    expect(bearing).toBeGreaterThan(60);
    expect(bearing).toBeLessThan(85);
  });

  it('correctly evaluates Vedic Disha Shula rules', () => {
    // Sunday (Day 0): West is Shula
    const sundayDate = new Date('2026-09-06T10:00:00Z'); // Sunday
    const westBearing = 270;
    const sundayWestShula = getVedicDishaShula(sundayDate, westBearing);
    expect(sundayWestShula.isShula).toBe(true);
    expect(sundayWestShula.adviceOr).toContain('ଦିଗଶୂଳ');

    // Sunday going South (Puri): Should be auspicious!
    const southBearing = 180;
    const sundaySouthShula = getVedicDishaShula(sundayDate, southBearing);
    expect(sundaySouthShula.isShula).toBe(false);
    expect(sundaySouthShula.adviceOr).toContain('ଶୁଭ');
  });

  it('verifies sacred pilgrimage presets are valid coordinates', () => {
    expect(PRESET_DESTINATIONS.length).toBeGreaterThanOrEqual(10);
    for (const d of PRESET_DESTINATIONS) {
      expect(d.lat).toBeGreaterThan(5);
      expect(d.lat).toBeLessThan(38);
      expect(d.lon).toBeGreaterThan(68);
      expect(d.lon).toBeLessThan(98);
      expect(d.nameOr.length).toBeGreaterThan(0);
    }
  });
});
