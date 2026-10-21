import { describe, it } from 'vitest';
import { calculateOdiaCalendarDay } from '../core/panjika/odia_calendar_engine';

describe('DIAG32', () => {
  it('snana purnima 2026 + ratha 1975', () => {
    const rows: string[] = [];
    for (const d of [28, 29, 30]) {
      const i: any = calculateOdiaCalendarDay(new Date(2026, 5, d));
      rows.push(`S|2026-06-${d}|t=${i.tithiNumber}|sh=${i.isShukla}|dom=${i.dominantTithiNumber}|lm=${i.lunarMonthName?.en}|f=${i.festivals.map((x: any) => x.id).join(',')}`);
    }
    for (const m of [5, 6]) {
      for (let d = 1; d <= (m === 5 ? 30 : 31); d++) {
        const i: any = calculateOdiaCalendarDay(new Date(1975, m, d));
        if (i.festivals.some((x: any) => x.id === 'ratha_yatra')) {
          rows.push(`R|1975-${m + 1}-${d}|t=${i.tithiNumber}|sh=${i.isShukla}|lm=${i.lunarMonthName?.en}`);
        }
      }
    }
    console.log(rows.join('\n'));
  });
});
