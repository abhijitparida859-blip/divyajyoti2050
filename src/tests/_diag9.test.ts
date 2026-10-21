import { describe, it } from 'vitest';
import { calculateOdiaCalendarDay } from '../core/panjika/odia_calendar_engine';

function dump(from: Date, days: number, tag: string) {
  console.log(`===== ${tag} =====`);
  for (let i = 0; i < days; i++) {
    const d = new Date(from.getTime() + i * 86400000);
    const di = calculateOdiaCalendarDay(d);
    const p = di.panjika.tithi;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const fests = di.festivals.map(f => f.id).join(',');
    console.log(
      `D ${key} tithi=${di.tithiNumber} paksha=${p.paksha} pct=${p.percentage} end=${p.endTime}` +
        ` early=${di.isEarlyTithiChange} dom=${di.dominantTithiNumber}` +
        ` lmonth=${di.lunarMonthName.en} f=[${fests}]`
    );
  }
}

describe('DIAG9', () => {
  it('2026 June-July window', () => {
    dump(new Date(2026, 5, 26), 12, '2026-06-26 .. 07-07');
    dump(new Date(2026, 6, 12), 16, '2026-07-12 .. 07-27');
  });

  it('1975 June-August window', () => {
    dump(new Date(1975, 5, 20), 40, '1975-06-20 .. 07-29');
  });
});
