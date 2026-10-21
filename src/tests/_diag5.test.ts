import { describe, it } from 'vitest';
import { calculateOdiaCalendarDay } from '../core/panjika/odia_calendar_engine';

describe('DIAG5', () => {
  it('2026 june 26-30 detail', () => {
    for (let day = 26; day <= 30; day++) {
      const info = calculateOdiaCalendarDay(new Date(2026, 5, day));
      const t = info.panjika.tithi;
      console.log('D26 ' + day + ' t=' + t.number + ' pct=' + t.percentage + ' end=' + t.endTime + ' dom=' + info.dominantTithiNumber + ' early=' + info.isEarlyTithiChange + ' lm=' + info.lunarMonthName.en + ' f=' + info.festivals.map(x => x.id).join(','));
    }
  });

  it('1975 june 30 - july 14 detail', () => {
    const dates: [number, number][] = [];
    for (let day = 30; day <= 30; day++) dates.push([5, day]);
    for (let day = 1; day <= 14; day++) dates.push([6, day]);
    dates.forEach(([m, d]) => {
      const info = calculateOdiaCalendarDay(new Date(1975, m, d));
      const t = info.panjika.tithi;
      console.log('D75 ' + (m + 1) + '-' + d + ' t=' + t.number + ' pct=' + t.percentage + ' dom=' + info.dominantTithiNumber + ' early=' + info.isEarlyTithiChange + ' lm=' + info.lunarMonthName.en + ' f=' + info.festivals.map(x => x.id).join(','));
    });
  });
});
