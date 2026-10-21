import { describe, it, expect } from 'vitest';
import { decodeWmoWeatherCode, formatOsrmManeuver } from '../services/globalGeoService';
import {
  calculateHaversineKm,
  calculateBearingDegrees,
  getCompassDirection,
  getVedicDishaShula
} from '../components/3d/PilgrimageRouteNavigator';

describe('Global Geographic Geocoding & Weather Telemetry Engine', () => {
  it('correctly decodes WMO weather codes into descriptive Odia, English, and iconography', () => {
    // Clear Sky
    const clear = decodeWmoWeatherCode(0);
    expect(clear.icon).toBe('☀️');
    expect(clear.en).toBe('Clear Sky');
    expect(clear.or).toContain('ନିର୍ମଳ');

    // Overcast
    const overcast = decodeWmoWeatherCode(3);
    expect(overcast.icon).toBe('☁️');
    expect(overcast.en).toBe('Overcast');

    // Rainy
    const rain = decodeWmoWeatherCode(61);
    expect(rain.icon).toBe('🌧️');
    expect(rain.en).toBe('Rainy');

    // Thunderstorm
    const storm = decodeWmoWeatherCode(95);
    expect(storm.icon).toBe('⚡');
    expect(storm.en).toBe('Thunderstorm');
  });

  it('accurately calculates global distances across continents', () => {
    // New Delhi (28.6139, 77.2090) to London (51.5074, -0.1278)
    const distDelhiLondon = calculateHaversineKm(28.6139, 77.2090, 51.5074, -0.1278);
    // Great circle distance is ~6710 km
    expect(distDelhiLondon).toBeGreaterThan(6600);
    expect(distDelhiLondon).toBeLessThan(6850);

    // Initial bearing from Delhi to London is North-West (~310°)
    const bearing = calculateBearingDegrees(28.6139, 77.2090, 51.5074, -0.1278);
    expect(bearing).toBeGreaterThan(300);
    expect(bearing).toBeLessThan(325);

    const compDir = getCompassDirection(bearing);
    expect(compDir.en).toBe('North-West');
    expect(compDir.or).toContain('ବାୟବ୍ୟ');
  });

  it('accurately evaluates Disha Shula for worldwide travel', () => {
    const tuesday = new Date('2026-09-08T10:00:00Z'); // Tuesday
    const nwBearing = 315;
    const tuesdayShula = getVedicDishaShula(tuesday, nwBearing);
    expect(tuesdayShula.isShula).toBe(true);
    expect(tuesdayShula.adviceOr).toContain('ଦିଗଶୂଳ');
  });

  it('formats turn-by-turn road maneuvers into authentic instructions in Odia and English', () => {
    // Turn right on NH16
    const turnRightOr = formatOsrmManeuver({ type: 'turn', modifier: 'right' }, 'NH 16', 'or');
    expect(turnRightOr).toContain('NH 16');
    expect(turnRightOr).toContain('ଡାହାଣକୁ ବୁଲନ୍ତୁ');

    const turnRightEn = formatOsrmManeuver({ type: 'turn', modifier: 'right' }, 'NH 16', 'en');
    expect(turnRightEn).toContain('Turn right onto NH 16');

    // Roundabout
    const roundaboutOr = formatOsrmManeuver({ type: 'roundabout' }, 'Grand Road', 'or');
    expect(roundaboutOr).toContain('ଗୋଲଚକ୍କର');

    // Arrive
    const arriveOr = formatOsrmManeuver({ type: 'arrive' }, '', 'or');
    expect(arriveOr).toContain('ପହଞ୍ଚିଗଲେ');
  });
});
