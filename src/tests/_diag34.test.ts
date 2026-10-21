import { describe, it } from 'vitest';
import { calculateOdiaCalendarDay } from '../core/panjika/odia_calendar_engine';

describe('DIAG34', () => {
  it('ratha yatra scan', () => {
    const rows: string[] = [];
    for (const year of [1975, 2026]) {
      for (let m = 5; m <= 7; m++) {
        const dim = new Date(year, m, 0).getDate();
        for (let d = 1; d <= dim; d++) {
          const i: any = calculateOdiaCalendarDay(new Date(year, m, d));
          const lm: string = (i.lunarMonthName?.en || '').split(' ')[0];
          const ids: string = i.festivals.map((x: any) => x.id).join(',');
          if (i.tithiNumber === 1 || i.tithiNumber === 2 || i.tithiNumber === 3 || ids.includes('ratha')) {
            rows.push(`R|${year}-${m + 1}-${d}|t=${i.tithiNumber}|sh=${i.isShukla}|lm=${lm}|f=${ids}`);
          }
        }
      }
    }
    console.log(rows.join('\n'));
  });
});
