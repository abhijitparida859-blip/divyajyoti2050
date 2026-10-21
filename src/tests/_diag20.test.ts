import { describe, it } from 'vitest';
import { calculateOdiaCalendarDay } from '../core/panjika/odia_calendar_engine';

describe('DIAG20', () => {
  it('2026 festival map', () => {
    const map: Record<string, string[]> = {};
    for (let i = 0; i < 365; i++) {
      const d = new Date(2026, 0, 1 + i);
      const info = calculateOdiaCalendarDay(d);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      for (const f of info.festivals) {
        (map[f.id] ||= []).push(key);
      }
    }
    const want = ['saraswati_puja','pahili_raja','raja_sankranti','shesa_raja','basumati_snana','sabitri_amavasya','snana_purnima','ratha_yatra','bahuda_yatra','janmashtami','ganesh_puja','nuakhai','maha_saptami','durga_ashtami','maha_navami','vijaya_dashami','deepavali','kartika_purnima','prathamastami'];
    for (const w of want) console.log(`F|${w}|${JSON.stringify(map[w])}`);
  });

  it('june/sept tithi trace', () => {
    const dump = (y: number, m: number, d1: number, d2: number) => {
      for (let d = d1; d <= d2; d++) {
        const dt = new Date(y, m, d);
        const info = calculateOdiaCalendarDay(dt);
        const t = (info as any).tithi;
        console.log(`T|${y}-${m + 1}-${d}|num=${t?.number}|paksha=${t?.paksha}|pct=${t?.percentage}|month=${(info as any).lunarMonthName?.en}|ends=${t?.endTime}|fest=${info.festivals.map((f: any) => f.id).join(',')}`);
      }
    };
    dump(2026, 5, 12, 20);
    dump(2026, 5, 27, 30);
    dump(2026, 6, 13, 18);
    dump(2026, 8, 1, 20);
  });
});
