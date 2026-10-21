import { describe, it, expect } from 'vitest';
import { calculateBirthChart } from '../core/jataka/kundali_engine';
import { calculateYearlyForecast, findDashaOnDate, getDashaPhala } from '../core/jataka/yearly_forecast_engine';

describe('AstroSage-level Yearly Forecast (365-day Varshaphala)', () => {
  const birthDate = new Date('1998-08-15T01:00:00Z');
  const chart = calculateBirthChart('Abhijit Parida', birthDate, 19.8135, 85.8312, 'Puri', 'male');

  it('produces 365 tri-lingual daily forecasts with scores', () => {
    const y = calculateYearlyForecast(chart.planets.Chandra.signIndex, chart.planets.Chandra.nakshatraIndex - 1, chart.dashas as any[], new Date('2026-10-12T00:00:00'));
    expect(y.totalDays).toBe(365);
    expect(y.days).toHaveLength(365);
    expect(y.excellent + y.good + y.average + y.caution + y.avoid).toBe(365);
    const d0 = y.days[0];
    expect(d0.score).toBeGreaterThanOrEqual(2);
    expect(d0.score).toBeLessThanOrEqual(99);
    expect(d0.headline.en).toBeTruthy();
    expect(d0.headline.hi).toBeTruthy();
    expect(d0.headline.or).toBeTruthy();
    expect(d0.career.en).toBeTruthy();
    expect(d0.remedy.en).toBeTruthy();
    expect(y.bestDays).toHaveLength(10);
    expect(y.bestMonths.length).toBeGreaterThan(0);
  });

  it('finds dasha lords on any date inside the tree', () => {
    const f = findDashaOnDate(chart.dashas as any[], new Date('2026-10-12T00:00:00'));
    expect(f.maha).toBeTruthy();
    expect(f.antar).toBeTruthy();
    expect(f.prat).toBeTruthy();
  });

  it('gives tri-lingual dasha phala for all 9 grahas', () => {
    for (const g of ['Surya', 'Chandra', 'Mangala', 'Budha', 'Guru', 'Shukra', 'Shani', 'Rahu', 'Ketu']) {
      const p = getDashaPhala(g as any);
      expect(p.en.length).toBeGreaterThan(10);
      expect(p.hi.length).toBeGreaterThan(2);
      expect(p.or.length).toBeGreaterThan(2);
    }
  });
});
