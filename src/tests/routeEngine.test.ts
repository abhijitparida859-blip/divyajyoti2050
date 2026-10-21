import { describe, it, expect } from 'vitest';
import {
  computeDistanceKm,
  formatDurationHuman,
  calculateMultiRoutes
} from '../services/routeEngineService';

describe('Google Maps-Grade Multi-Route Engine & Kinematics', () => {
  it('correctly calculates geodesic distance', () => {
    // Puri (19.8049, 85.8179) to Cuttack (20.4578, 85.8828)
    const dist = computeDistanceKm(19.8049, 85.8179, 20.4578, 85.8828);
    expect(dist).toBeGreaterThan(70);
    expect(dist).toBeLessThan(80);
  });

  it('correctly formats human durations including days, hours, and minutes in Odia and English', () => {
    // 45 mins
    const m45 = formatDurationHuman(45, 'or');
    expect(m45.or).toBe('45 ମିନିଟ୍');
    expect(m45.hi).toBe('45 मिनट');
    expect(m45.en).toBe('45 mins');

    // 118 mins (1 hr 58 mins)
    const h2 = formatDurationHuman(118, 'or');
    expect(h2.or).toBe('1 ଘଣ୍ଟା 58 ମିନିଟ୍');
    expect(h2.hi).toBe('1 घंटे 58 मिनट');
    expect(h2.en).toBe('1 hr 58 min');

    // 1468 mins (1 day 28 mins)
    const d1 = formatDurationHuman(1468, 'or');
    expect(d1.or).toContain('1 ଦିନ');
    expect(d1.or).toContain('28 ମିନିଟ୍');
    expect(d1.hi).toContain('1 दिन');
    expect(d1.hi).toContain('28 मिनट');
    expect(d1.en).toContain('1 d');
  });

  it('generates multi-route options with realistic driving and walking speeds and tri-lingual metadata', async () => {
    // Puri (19.8049, 85.8179) to Cuttack (20.4578, 85.8828)
    const routes = await calculateMultiRoutes(19.8049, 85.8179, 20.4578, 85.8828, 'or');

    expect(routes.length).toBe(3);

    const fastest = routes.find(r => r.id === 'fastest')!;
    const shortest = routes.find(r => r.id === 'shortest')!;
    const walking = routes.find(r => r.id === 'walking')!;

    // 1. Fastest Route
    expect(fastest.isRecommended).toBe(true);
    expect(fastest.distanceKm).toBeGreaterThan(70);
    expect(fastest.titleHi).toBe('सबसे तेज राजमार्ग');
    expect(fastest.titleEn).toBe('Fastest Highway');
    // Driving duration should be realistic (~1.5 - 2 hrs for ~80-100km, NOT 10 mins or 10 hours)
    expect(fastest.durationMinutes).toBeGreaterThan(80);
    expect(fastest.durationMinutes).toBeLessThan(180);

    // 2. Shortest Route has fewer km
    expect(shortest.distanceKm).toBeLessThan(fastest.distanceKm);
    expect(shortest.titleHi).toBe('सबसे छोटा मार्ग');

    // 3. Walking Route: Human speed (4.5 km/h)
    // ~80-100 km walking must take at least 15-25 hours, NEVER 1 hour!
    expect(walking.durationMinutes).toBeGreaterThan(900); // > 15 hours
    expect(walking.formattedDurationOr).toContain('ଘଣ୍ଟା');
    expect(walking.formattedDurationHi).toContain('घंटे');
    expect(walking.walkingStats?.caloriesKcal).toBeGreaterThan(4000);
    expect(walking.walkingStats?.stepsCount).toBeGreaterThan(80000);
  });
});
