import { describe, it, expect } from 'vitest';
import { calculateBirthChart, parseDateTimeWithTimezone } from '../core/jataka/kundali_engine';
import { calculateYearlyForecast } from '../core/jataka/yearly_forecast_engine';
import { ODISHA_COMPREHENSIVE_LOCATIONS } from '../core/jataka/odisha_geography_db';
import { BirthChartData, PlanetName } from '../types/jataka';

// Builds a real chart once for all chart-math assertions.
const loc = ODISHA_COMPREHENSIVE_LOCATIONS[1]; // Puri
const utc = parseDateTimeWithTimezone('1998-08-15', '06:30', loc.timezone);
const chart: BirthChartData = calculateBirthChart('Abhijit Parida', utc, loc.latitude, loc.longitude, loc.name.en, 'male');
const year = calculateYearlyForecast(
  chart.planets.Chandra.signIndex,
  chart.planets.Chandra.nakshatraIndex - 1,
  chart.dashas as any[],
  new Date(),
);

const PLANETS: PlanetName[] = ['Surya', 'Chandra', 'Mangala', 'Budha', 'Guru', 'Shukra', 'Shani'];

describe('KundaliChartsView — chart math (all inputs feed directly into SVG)', () => {
  it('shadbala rows: 7 planets, unique ranks 1-7, percentages within 0-100', () => {
    const rows = PLANETS.map((p) => ({
      p,
      pct: Math.min(100, Math.round(chart.shadbala.planets[p].strengthPercentage)),
      rank: chart.shadbala.planets[p].rank,
    })).sort((a, b) => a.rank - b.rank);

    expect(rows).toHaveLength(7);
    expect(new Set(rows.map((r) => r.rank)).size).toBe(7);
    expect(Math.min(...rows.map((r) => r.rank))).toBe(1);
    expect(Math.max(...rows.map((r) => r.rank))).toBe(7);
    rows.forEach((r) => {
      expect(Number.isFinite(r.pct)).toBe(true);
      expect(r.pct).toBeGreaterThanOrEqual(0);
      expect(r.pct).toBeLessThanOrEqual(100);
    });
  });

  it('SAV column chart: 12 houses, authentic 337 total, every bindu 0-56', () => {
    const sav = chart.ashtakavarga.sarvashtakavarga;
    expect(sav).toHaveLength(12);
    sav.forEach((v) => {
      expect(Number.isInteger(v)).toBe(true);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(56);
    });
    expect(sav.reduce((a, b) => a + b, 0)).toBe(337);
    expect(chart.ashtakavarga.totalBindus).toBe(337);
  });

  it('vimsopaka bars: scores within 0-20 and sorted descending', () => {
    const rows = PLANETS.map((p) => chart.vimsopakaBala.planets[p].vimsopakaScore)
      .sort((a, b) => b - a);
    rows.forEach((s) => {
      expect(s).toBeGreaterThanOrEqual(0);
      expect(s).toBeLessThanOrEqual(20);
    });
    const sorted = [...rows].sort((a, b) => b - a);
    expect(rows).toEqual(sorted);
  });

  it('365-day line chart: exactly 365 scores, all integers within 0-100', () => {
    const scores = year.days.map((d) => d.score);
    expect(scores).toHaveLength(365);
    scores.forEach((s) => {
      expect(Number.isInteger(s)).toBe(true);
      expect(s).toBeGreaterThanOrEqual(0);
      expect(s).toBeLessThanOrEqual(100);
    });
  });

  it('monthly average chart: 12-13 month groups, each average within 0-100', () => {
    const m = new Map<string, { sum: number; n: number }>();
    for (const d of year.days) {
      const k = d.dateStr.slice(0, 7);
      const c = m.get(k) ?? { sum: 0, n: 0 };
      c.sum += d.score; c.n += 1; m.set(k, c);
    }
    const monthAvg = [...m.entries()].map(([month, v]) => ({ month, avg: Math.round(v.sum / v.n) }));
    expect(monthAvg.length).toBeGreaterThanOrEqual(12);
    expect(monthAvg.length).toBeLessThanOrEqual(13);
    monthAvg.forEach((mm) => {
      expect(Number.isFinite(mm.avg)).toBe(true);
      expect(mm.avg).toBeGreaterThanOrEqual(0);
      expect(mm.avg).toBeLessThanOrEqual(100);
    });
  });

  it('life-domain radar: 6 domains, ratings 1-5, polygon points contain no NaN', () => {
    const domains = chart.lifeDomains.domains;
    expect(domains).toHaveLength(6);

    const cx = 100, cy = 100, R = 68;
    const pts = domains.map((d, i) => {
      const ang = (Math.PI * 2 * i) / domains.length - Math.PI / 2;
      const rr = (Math.max(1, Math.min(5, d.rating)) / 5) * R;
      return { x: cx + rr * Math.cos(ang), y: cy + rr * Math.sin(ang), d };
    });

    pts.forEach((p) => {
      expect(Number.isFinite(p.x)).toBe(true);
      expect(Number.isFinite(p.y)).toBe(true);
      expect(p.d.rating).toBeGreaterThanOrEqual(1);
      expect(p.d.rating).toBeLessThanOrEqual(5);
    });
    const poly = pts.map((p) => `${p.x},${p.y}`).join(' ');
    expect(poly).not.toContain('NaN');
  });

  it('rating donut: non-empty bands, fractions sum to exactly 1, bands total 365', () => {
    const bands = [
      { r: 'Excellent', v: year.excellent }, { r: 'Good', v: year.good },
      { r: 'Average', v: year.average }, { r: 'Caution', v: year.caution }, { r: 'Avoid', v: year.avoid },
    ].filter((x) => x.v > 0);

    expect(bands.length).toBeGreaterThanOrEqual(1);
    const total = bands.reduce((s, x) => s + x.v, 0);
    expect(total).toBe(365);
    expect(bands.reduce((acc, x) => acc + x.v / total, 0)).toBeCloseTo(1, 10);
  });

  it('best/tough day markers resolve to real days inside the 365-day window', () => {
    expect(year.bestDays.length).toBeGreaterThan(0);
    expect(year.toughDays.length).toBeGreaterThan(0);
    year.bestDays.forEach((d) => {
      expect(d.dayIndex).toBeGreaterThanOrEqual(1);
      expect(d.dayIndex).toBeLessThanOrEqual(365);
    });
    year.toughDays.forEach((d) => {
      expect(d.dayIndex).toBeGreaterThanOrEqual(1);
      expect(d.dayIndex).toBeLessThanOrEqual(365);
    });
  });
});
