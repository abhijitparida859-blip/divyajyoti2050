import { describe, it } from 'vitest';
import { calculateOdiaCalendarDay } from '../core/panjika/odia_calendar_engine';

describe('DIAG22', () => {
  it('rich day trace', () => {
    const dump = (y: number, m: number, d1: number, d2: number) => {
      for (let d = d1; d <= d2; d++) {
        const dt = new Date(y, m, d);
        const info: any = calculateOdiaCalendarDay(dt);
        console.log(
          `X|${y}-${m + 1}-${d}|t=${info.tithiNumber}|sh=${info.isShukla}|lm=${info.lunarMonthName?.en}|sm=${info.odiaSolarMonth?.id}|rashi=${info.odiaSolarMonth?.id}` +
          `|fest=${info.festivals.map((f: any) => f.id).join(',')}`
        );
      }
    };
    dump(2026, 5, 12, 20);
    dump(2026, 8, 10, 18);
    dump(2026, 10, 5, 13);
    dump(2026, 11, 28, 5);
  });
});
