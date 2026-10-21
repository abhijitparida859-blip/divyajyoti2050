import { describe, it, expect } from 'vitest';
import { calculateAdvancedMilan } from '../core/milan/milan_engine';
import { calculateBirthChart, parseDateTimeWithTimezone } from '../core/jataka/kundali_engine';

describe('Advanced Milan Engine (real charts)', () => {
  const groom = calculateBirthChart('Arjun', parseDateTimeWithTimezone('1996-03-12', '07:45', 5.5), 20.2961, 85.8245, 'Bhubaneswar', 'male');
  const bride = calculateBirthChart('Priyanka', parseDateTimeWithTimezone('1998-09-21', '14:20', 5.5), 19.8135, 85.8312, 'Puri', 'female');
  const r = calculateAdvancedMilan(groom, bride);

  it('produces 8 extended kootas with total within 0-36', () => {
    expect(r.kootas.length).toBe(8);
    expect(r.totalScore).toBeGreaterThanOrEqual(0);
    expect(r.totalScore).toBeLessThanOrEqual(36);
    expect(r.percentage).toBe(Math.round((r.totalScore / 36) * 100));
  });

  it('derives real moon data from charts (no fabrication)', () => {
    expect(r.groomMoon.nakshatraIndex).toBe(groom.planets.Chandra.nakshatraIndex);
    expect(r.brideMoon.nakshatraIndex).toBe(bride.planets.Chandra.nakshatraIndex);
    expect(r.groomMoon.pada).toBe(groom.planets.Chandra.pada);
  });

  it('computes 8 life domains, 7 dosha checks, composite index in 0-100', () => {
    expect(r.lifeDomains.length).toBe(8);
    expect(r.doshaChecks.length).toBe(7);
    r.lifeDomains.forEach(d => {
      expect(d.score).toBeGreaterThanOrEqual(0);
      expect(d.score).toBeLessThanOrEqual(100);
    });
    expect(r.compatibilityIndex).toBeGreaterThanOrEqual(0);
    expect(r.compatibilityIndex).toBeLessThanOrEqual(100);
  });

  it('includes real Rajju/Vedha/Gotra and at least one remedy', () => {
    expect(r.rajjuVedha.rajjuGroom.en).toBeTruthy();
    expect(r.gotra.gotraGroom.length).toBeGreaterThan(0);
    expect(r.remedies.length).toBeGreaterThanOrEqual(1);
    expect(r.muhurta.seasonNote.en).toBeTruthy();
  });
});
