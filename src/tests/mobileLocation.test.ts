import { describe, it, expect, beforeEach } from 'vitest';
import {
  ALL_30_ODISHA_DISTRICTS,
  calculateHaversineDistanceKm,
  findNearestOdishaCity,
  saveUserLocation,
  getSavedUserLocation,
  requestMobileGPSLocation
} from '../core/geo/mobileLocationService';

describe('Mobile Geolocation & Odisha 30 Districts Service', () => {
  let mockStore: Record<string, string> = {};

  beforeEach(() => {
    mockStore = {};
    const mockStorage = {
      getItem: (key: string) => mockStore[key] || null,
      setItem: (key: string, val: string) => { mockStore[key] = val; },
      clear: () => { mockStore = {}; },
      removeItem: (key: string) => { delete mockStore[key]; },
      key: (index: number) => Object.keys(mockStore)[index] || null,
      get length() { return Object.keys(mockStore).length; }
    };

    (globalThis as unknown as { window: { localStorage: Storage } }).window = {
      localStorage: mockStorage as unknown as Storage
    };
  });

  it('contains all 30 Odisha districts plus key Odia diaspora hubs with valid coordinates', () => {
    expect(ALL_30_ODISHA_DISTRICTS.length).toBeGreaterThanOrEqual(30);

    const districtIds = ALL_30_ODISHA_DISTRICTS.map(d => d.id);
    expect(districtIds).toContain('puri');
    expect(districtIds).toContain('bhubaneswar');
    expect(districtIds).toContain('cuttack');
    expect(districtIds).toContain('sambalpur');
    expect(districtIds).toContain('balasore');
    expect(districtIds).toContain('berhampur');
    expect(districtIds).toContain('koraput');
    expect(districtIds).toContain('rourkela');
    expect(districtIds).toContain('balangir');
    expect(districtIds).toContain('kalahandi');

    for (const loc of ALL_30_ODISHA_DISTRICTS) {
      expect(loc.lat).toBeGreaterThan(8);
      expect(loc.lat).toBeLessThan(35);
      expect(loc.lon).toBeGreaterThan(68);
      expect(loc.lon).toBeLessThan(95);
      expect(loc.nameOr).toBeTruthy();
      expect(loc.nameHi).toBeTruthy();
      expect(loc.nameEn).toBeTruthy();
      expect(loc.districtOr).toBeTruthy();
    }
  });

  it('accurately calculates Haversine distance between Bhubaneswar and Puri (~55-65 km)', () => {
    const dist = calculateHaversineDistanceKm(20.2961, 85.8245, 19.8135, 85.8312);
    expect(dist).toBeGreaterThan(50);
    expect(dist).toBeLessThan(60);
  });

  it('correctly maps arbitrary coordinates to the nearest canonical Odisha district', () => {
    const nearestPuri = findNearestOdishaCity(19.805, 85.818);
    expect(nearestPuri.id).toBe('puri');

    const nearestBbsr = findNearestOdishaCity(20.24, 85.83);
    expect(nearestBbsr.id).toBe('bhubaneswar');

    const nearestCuttack = findNearestOdishaCity(20.48, 85.87);
    expect(nearestCuttack.id).toBe('cuttack');

    const nearestSambalpur = findNearestOdishaCity(21.46, 83.97);
    expect(nearestSambalpur.id).toBe('sambalpur');
  });

  it('persists and retrieves user selected or detected location in localStorage', () => {
    expect(getSavedUserLocation()).toBeNull();

    const sample = ALL_30_ODISHA_DISTRICTS.find(d => d.id === 'sambalpur')!;
    saveUserLocation(sample);

    const retrieved = getSavedUserLocation();
    expect(retrieved).not.toBeNull();
    expect(retrieved?.id).toBe('sambalpur');
    expect(retrieved?.nameOr).toBe(sample.nameOr);
  });

  it('gracefully handles requestMobileGPSLocation when geolocation is unavailable', async () => {
    const origNav = globalThis.navigator;
    // @ts-expect-error test override
    delete globalThis.navigator;
    // @ts-expect-error test override
    globalThis.navigator = {};

    const res = await requestMobileGPSLocation();
    expect(res.success).toBe(false);
    expect(res.location.id).toBe('puri');
    expect(res.message.or).toContain('ପୁରୀ');

    globalThis.navigator = origNav;
  });
});
