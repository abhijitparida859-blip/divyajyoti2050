import { describe, it } from 'vitest';
import { calculateOdiaCalendarDay } from '../core/panjika/odia_calendar_engine';

describe('DIAG12', () => {
  it('state dump', () => {
    const days = [
      [2026, 5, 28], [2026, 5, 29], [2026, 5, 30], [2026, 5, 31],
      [1975, 6, 9], [1975, 6, 10], [1975, 6, 11], [1975, 6, 12]
    ];
    for (const [y, m, d] of days) {
      const info = calculateOdiaCalendarDay(new Date(y, m, d));
      const p = info.panjika;
      const any = info as any;
      console.log(
        `${y}-${m + 1}-${d} t=${p.tithi.number} ${p.tithi.paksha} pct=${p.tithi.percentage}` +
        ` dom=${any.dominantTithiNumber} lm=${any.lunarMonthName?.en}` +
        ` lmId=${any.lunarMonthId} sr=${any.solarRashiIdx} deg=${any.degInRashi?.toFixed?.(2)}` +
        ` end=${p.tithi.endTime} f=${info.festivals.map(x => x.id).join(',')}`
      );
    }
  });
});

