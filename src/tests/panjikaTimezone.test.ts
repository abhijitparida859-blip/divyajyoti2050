import { describe, it, expect } from 'vitest';
import { calculateOdiaCalendarDay } from '../core/panjika/odia_calendar_engine';
import { calculatePanjika } from '../core/panjika/panjika_engine';
import { calculateSunTimes } from '../core/astronomy/solar_lunar';
import { IST_OFFSET_MINUTES, formatIstClock, getCivilDateParts, getIstCivilDateParts, istInstantFromMinutes } from '../core/astronomy/istTime';

// Srikshetra Puri — the canonical Panjika location
const PURI_LAT = 19.8135;
const PURI_LON = 85.8312;

/**
 * Regression guard for GitHub issue #2:
 *  • Odia Panjika days must be resolved in IST (UTC+05:30), never in the host
 *    machine timezone, so a UTC CI runner produces the same calendar as an
 *    Odisha browser.
 *  • Tithi-bound festivals must be observed on a single day even when the tithi
 *    is present at sunrise on two consecutive days (udaya-vyapini).
 *
 * These assertions hold in any host timezone, so the suite can be executed with
 * TZ=UTC and TZ=Asia/Kolkata and must pass identically.
 */
describe('Odisha civil time (IST) anchoring', () => {
  it('renders sunrise/sunset clock values in IST, independent of the host timezone', () => {
    const sunTimes = calculateSunTimes(new Date(2026, 5, 15), PURI_LAT, PURI_LON, IST_OFFSET_MINUTES);
    expect(sunTimes.sunrise).toBe('05:07 AM');
    expect(sunTimes.sunset).toBe('06:26 PM');
    expect(sunTimes.dayLengthMinutes).toBeGreaterThan(700);
  });

  it('builds the sunrise instant from the IST civil date', () => {
    const sunTimes = calculateSunTimes(new Date(2026, 5, 15), PURI_LAT, PURI_LON, IST_OFFSET_MINUTES);
    const [hm, period] = sunTimes.sunrise.split(' ');
    const [h, m] = hm.split(':').map(Number);
    const minutes = (h % 12) * 60 + m + (period === 'PM' ? 720 : 0);
    // 2026-06-15 05:07 IST === 2026-06-14 23:37 UTC
    const instant = new Date(Date.UTC(2026, 5, 15) - IST_OFFSET_MINUTES * 60000 + minutes * 60000);
    const istParts = getIstCivilDateParts(instant);
    expect(istParts).toEqual({ year: 2026, month: 5, day: 15 });
    expect(formatIstClock(instant)).toBe('05:07 AM');
  });

  it('reports the same panjika clock values for a civil date in every host timezone', () => {
    // Probe the civil date at a deterministic instant: IST midnight of 15 June 2026
    const panjika = calculatePanjika(istInstantFromMinutes(getCivilDateParts(new Date(2026, 5, 15)), 0), PURI_LAT, PURI_LON);
    expect(panjika.sunrise).toBe('05:07 AM');
    expect(panjika.sunset).toBe('06:26 PM');
    expect(panjika.tithi.endTime).toBe('09:49 AM');
    expect(panjika.vaara).toBe('Somavara'); // 15 June 2026 is a Monday
    expect(panjika.date).toBe('2026-06-15');
  });

  it('keeps the solar-day / sankranti boundary on the IST civil day', () => {
    const june15 = calculateOdiaCalendarDay(new Date(2026, 5, 15), PURI_LAT, PURI_LON);
    const june16 = calculateOdiaCalendarDay(new Date(2026, 5, 16), PURI_LAT, PURI_LON);

    // Raja Parba: 15 June is the last Jyestha solar day, 16 June is Mithuna Sankranti
    expect(june15.odiaSolarMonth.id).toBe('jyestha');
    expect(june15.odiaSolarDay).toBe(30);
    expect(june16.odiaSolarMonth.id).toBe('asadha');
    expect(june16.odiaSolarDay).toBe(1);
    expect(june16.isSankranti).toBe(true);
    expect(june15.weekdayIdx).toBe(1); // Monday
    expect(june15.dateStr).toBe('2026-06-15');
  });
});

describe('Tithi-bound festivals are observed on a single day (udaya-vyapini)', () => {
  const scanYear = (year: number) => {
    const byId: Record<string, string[]> = {};
    for (let i = 0; i < 365; i++) {
      const date = new Date(year, 0, 1 + i);
      const info = calculateOdiaCalendarDay(date, PURI_LAT, PURI_LON);
      for (const festival of info.festivals) {
        (byId[festival.id] ||= []).push(info.dateStr);
      }
    }
    return byId;
  };

  it('emits Deva Snana Purnima only on 2026-06-30 (Purnima spans 29-30 June)', () => {
    const festivals2026 = scanYear(2026);
    expect(festivals2026['snana_purnima']).toEqual(['2026-06-30']);
  });

  it('emits Maha Saptami only on 2026-10-18 (Saptami spans 17-18 October)', () => {
    const festivals2026 = scanYear(2026);
    expect(festivals2026['maha_saptami']).toEqual(['2026-10-18']);
  });

  it('emits the whole 2026 Durga Puja cycle once, on the canonical dates', () => {
    const festivals2026 = scanYear(2026);
    expect(festivals2026['maha_sasthi']).toEqual(['2026-10-16']);
    expect(festivals2026['maha_saptami']).toEqual(['2026-10-18']);
    expect(festivals2026['durga_ashtami']).toEqual(['2026-10-19']);
    expect(festivals2026['maha_navami']).toEqual(['2026-10-20']);
    expect(festivals2026['vijaya_dashami']).toEqual(['2026-10-21']);
  });

  it('never emits the same annual festival on more than one day', () => {
    // Weekly observances legitimately repeat within a year
    const WEEKLY = new Set(['chaitra_mangalabara', 'manabasa_gurubara']);
    const festivals2026 = scanYear(2026);
    const duplicates = Object.entries(festivals2026)
      .filter(([id, dates]) => !WEEKLY.has(id) && dates.length > 1)
      .map(([id, dates]) => `${id}: ${dates.join(', ')}`);
    expect(duplicates).toEqual([]);
  });

  it('keeps Ratha Yatra on Asadha Shukla Dwitiya (2026-07-16)', () => {
    const ratha = calculateOdiaCalendarDay(new Date(2026, 6, 16), PURI_LAT, PURI_LON);
    expect(ratha.festivals.map(f => f.id)).toContain('ratha_yatra');
    expect(ratha.panjika.tithi.number).toBe(2);
    expect(ratha.panjika.tithi.paksha).toBe('Shukla');
  });
});
