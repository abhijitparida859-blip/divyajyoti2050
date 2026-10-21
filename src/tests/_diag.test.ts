import { describe, it } from 'vitest';
import { calculateOdiaCalendarDay } from '../core/panjika/odia_calendar_engine';

describe('DIAG', () => {
  it('dumps ratha yatra / snana purnima occurrences', () => {
    for (const year of [1975, 2026]) {
      const ratha: string[] = [];
      const snana: string[] = [];
      for (let i = 0; i < 365; i++) {
        const d = new Date(year, 0, 1 + i);
        const info = calculateOdiaCalendarDay(d);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        info.festivals.forEach(f => {
          if (f.id === 'ratha_yatra') ratha.push(key + ' tithi=' + info.panjika.tithi.number + ' ' + info.panjika.tithi.paksha);
          if (f.id === 'snana_purnima') snana.push(key + ' tithi=' + info.panjika.tithi.number);
        });
      }
      console.log('YEAR ' + year + ' RATHA=' + JSON.stringify(ratha) + ' SNANA=' + JSON.stringify(snana));
    }
  });

  it('dumps june-july shukla dwitiya + lunar month for 1975', () => {
    for (let month = 5; month <= 6; month++) {
      const maxDays = month === 5 ? 30 : 31;
      for (let day = 1; day <= maxDays; day++) {
        const d = new Date(1975, month, day);
        const info = calculateOdiaCalendarDay(d);
        const t = info.panjika.tithi;
        if (t.number === 2 && t.paksha === 'Shukla') {
          console.log('1975-' + (month + 1) + '-' + day + ' tithi=2 Shukla lunarMonth=' + (info as any).lunarMonthId + ' solarRashi=' + (info as any).solarRashiIdx + ' festivals=' + info.festivals.map(f => f.id).join(','));
        }
      }
    }
  });

  it('dumps day-after-purnima transition for 2026 june', () => {
    for (let day = 26; day <= 35; day++) {
      const d = new Date(2026, 5, day);
      const info = calculateOdiaCalendarDay(d);
      console.log('2026-06-' + day + ' tithi=' + info.panjika.tithi.number + ' ' + info.panjika.tithi.paksha + ' festivals=' + info.festivals.map(f => f.id).join(','));
    }
  });
});
