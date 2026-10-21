import { describe, it, expect } from 'vitest';
import {
  SACRED_HIGHWAY_POIS,
  SacredHighwayPoi
} from '../components/3d/LiveNavigationCockpit';
import { calculateHaversineKm } from '../components/3d/PilgrimageRouteNavigator';

describe('In-App Live Navigation Engine & Sacred Highway Telemetry', () => {
  it('contains verified sacred highway waypoints with valid geographic bounds', () => {
    expect(SACRED_HIGHWAY_POIS.length).toBeGreaterThanOrEqual(4);
    for (const poi of SACRED_HIGHWAY_POIS) {
      expect(poi.lat).toBeGreaterThan(19);
      expect(poi.lat).toBeLessThan(22);
      expect(poi.lon).toBeGreaterThan(84);
      expect(poi.lon).toBeLessThan(87);
      expect(poi.nameOr.length).toBeGreaterThan(0);
      expect(poi.significanceOr.length).toBeGreaterThan(0);
      expect(poi.radiusKm).toBeGreaterThan(0.5);
    }
  });

  it('accurately triggers proximity alert when passing Pipli craft town on NH316', () => {
    // Pipli coordinates: 20.1172, 85.8331
    // Vehicle driving right past on NH316 at (20.1180, 85.8335)
    const vehicleLat = 20.1180;
    const vehicleLon = 85.8335;

    const pipli = SACRED_HIGHWAY_POIS.find(p => p.nameOr.includes('ପିପିଲି'));
    expect(pipli).toBeDefined();

    if (pipli) {
      const distance = calculateHaversineKm(vehicleLat, vehicleLon, pipli.lat, pipli.lon);
      expect(distance).toBeLessThan(pipli.radiusKm);
    }
  });

  it('accurately triggers proximity alert when passing Sakshigopal Temple', () => {
    // Sakshigopal: 19.9535, 85.8196
    const vehicleLat = 19.9540;
    const vehicleLon = 85.8200;

    const sakhigopal = SACRED_HIGHWAY_POIS.find(p => p.nameOr.includes('ସାକ୍ଷୀଗୋପାଳ'));
    expect(sakhigopal).toBeDefined();

    if (sakhigopal) {
      const distance = calculateHaversineKm(vehicleLat, vehicleLon, sakhigopal.lat, sakhigopal.lon);
      expect(distance).toBeLessThan(sakhigopal.radiusKm);
    }
  });

  it('calculates realistic road speed (km/h) from GPS coordinates and delta time', () => {
    const lat1 = 20.2668;
    const lon1 = 85.8436;
    // Moved ~1 km along highway in 60 seconds (0.01667 hours) -> ~60 km/h
    const lat2 = 20.2580;
    const lon2 = 85.8420;
    const distKm = calculateHaversineKm(lat1, lon1, lat2, lon2);
    const timeHours = 60 / 3600; // 1 minute
    const speedKmh = Math.round(distKm / timeHours);

    expect(speedKmh).toBeGreaterThan(50);
    expect(speedKmh).toBeLessThan(75);
  });
});
