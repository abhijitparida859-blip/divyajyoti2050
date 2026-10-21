import { describe, it } from 'vitest';
import { calculateOdiaCalendarDay } from '../core/panjika/odia_calendar_engine';

describe('DIAG2', () => {
  it('2026 purnima spans', () => {
    for (let i = 0; i < 365; i++) {
      const d = new Date(2026, 0, 1 + i);
      const info = calculateOdiaCalendarDay(d);
      if (info.panjika.tithi.number === 15) {
        const key = `${d.getMonth() + 1}-${String(d.getDate()).padStart(2, '0')}`;
        console.log('P26 ' + key + ' ' + info.lunarMonthName.en + ' fest=' + info.festivals.map(f => f.id).join(','));
      }
    }
  });

  it('1975 june-july shukla days', () => {
    for (let i = 0; i < 61; i++) {
      const d = new Date(1975, 5, 1 + i);
      const info = calculateOdiaCalendarDay(d);
      const t = info.panjika.tithi;
      if (t.number <= 2 || t.number === 15) {
        const key = `${d.getMonth() + 1}-${String(d.getDate()).padStart(2, '0')}`;
        console.log('S75 ' + key + ' t=' + t.number + ' ' + t.paksha + ' lm=' + info.lunarMonthName.en + ' fest=' + info.festivals.map(f => f.id).join(','));
      }
    }
  });
});
