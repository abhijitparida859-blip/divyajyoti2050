import { describe, it } from 'vitest';
import { calculateOdiaCalendarDay } from '../core/panjika/odia_calendar_engine';

describe('DIAG3', () => {
  it('1975 july window', () => {
    for (let day = 5; day <= 20; day++) {
      const d = new Date(1975, 6, day);
      const info = calculateOdiaCalendarDay(d);
      const t = info.panjika.tithi;
      console.log('J75-' + day + ' t=' + t.number + ' ' + t.paksha + ' lm=' + info.lunarMonthName.en + ' f=' + info.festivals.map(f => f.id).join(','));
    }
  });
});
