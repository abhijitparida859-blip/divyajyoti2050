import { describe, it } from 'vitest';
import { calculateOdiaCalendarDay } from '../core/panjika/odia_calendar_engine';

describe('DIAG29', () => {
  it('festivals around two-day tithis', () => {
    const days: [number, number][] = [[5, 28], [5, 29], [5, 30], [11, 7], [11, 8], [11, 9]];
    for (const [m, d] of days) {
      const info: any = calculateOdiaCalendarDay(new Date(2026, m, d));
      console.log(
        `F|2026-${m + 1}-${d}|t=${info.tithiNumber}|sh=${info.isShukla}|lm=${info.lunarMonthName?.en}|fest=${info.festivals.map((f: any) => f.id).join(',')}`
      );
    }
  });
});
