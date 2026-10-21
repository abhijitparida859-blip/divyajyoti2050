import { describe, it } from 'vitest';
import { calculateOdiaCalendarDay } from '../core/panjika/odia_calendar_engine';
import { calculatePlanetaryPositions, normalizeDegrees } from '../core/astronomy/ephemeris';

describe('DIAG9', () => {
  it('1975 June/July ratha yatra trace', () => {
    for (let month = 5; month <= 6; month++) {
      const maxDays = month === 5 ? 30 : 25;
      for (let day = month === 5 ? 15 : 1; day <= maxDays; day++) {
        const d = new Date(1975, month, day);
        const info = calculateOdiaCalendarDay(d);
        const t = info.panjika.tithi;
        const p = calculatePlanetaryPositions(new Date(1975, month, day, 5, 30));
        const elong = normalizeDegrees(p.moon - p.sun);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        if (t.number === 1 || t.number === 2 || t.number === 3) {
          console.log(`RY75 ${key} t=${t.number} ${t.paksha} elong=${elong.toFixed(3)} lm=${(info as any).lunarMonthId} f=${info.festivals.map(x => x.id).join(',')}`);
        }
      }
    }
  });

  it('2026 june purnima + asadha trace', () => {
    for (let day = 26; day <= 30; day++) {
      const d = new Date(2026, 5, day);
      const info = calculateOdiaCalendarDay(d);
      const t = info.panjika.tithi;
      const p = calculatePlanetaryPositions(new Date(2026, 5, day, 5, 30));
      const elong = normalizeDegrees(p.moon - p.sun);
      console.log(`PN26 2026-06-${day} t=${t.number} ${t.paksha} elong=${elong.toFixed(3)} sun=${p.sun.toFixed(3)} lm=${(info as any).lunarMonthId} f=${info.festivals.map(x => x.id).join(',')}`);
    }
    for (let day = 1; day <= 20; day++) {
      const d = new Date(2026, 6, day);
      const info = calculateOdiaCalendarDay(d);
      const t = info.panjika.tithi;
      console.log(`AD26 2026-07-${day} t=${t.number} ${t.paksha} f=${info.festivals.map(x => x.id).join(',')}`);
    }
  });

  it('1975 elongation ramp detail', () => {
    for (let day = 1; day <= 20; day++) {
      const p = calculatePlanetaryPositions(new Date(1975, 6, day, 5, 30));
      const p2 = calculatePlanetaryPositions(new Date(1975, 6, day, 18, 0));
      const e1 = normalizeDegrees(p.moon - p.sun);
      const e2 = normalizeDegrees(p2.moon - p2.sun);
      console.log(`E75 1975-07-${String(day).padStart(2, '0')} sunriseEl=${e1.toFixed(3)} t=${Math.floor(e1 / 12) + 1} sunsetEl=${e2.toFixed(3)} t=${Math.floor(e2 / 12) + 1}`);
    }
  });
});
