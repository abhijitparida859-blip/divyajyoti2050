import { describe, it } from 'vitest';
import { calculatePlanetaryPositions, normalizeDegrees } from '../core/astronomy/ephemeris';
import { calculateSunTimes } from '../core/astronomy/solar_lunar';
import { calculateOdiaCalendarDay } from '../core/panjika/odia_calendar_engine';

const LAT = 19.8135, LON = 85.8312;
const parse = (s: string) => { const [hm, p] = s.split(' '); let [h, mi] = hm.split(':').map(Number); if (p === 'PM' && h !== 12) h += 12; if (p === 'AM' && h === 12) h = 0; return h * 60 + mi; };

describe('DIAG35', () => {
  it('sunrise elongations 2026 june / 1975 july', () => {
    const rows: string[] = [];
    for (const [y, m, a, b] of [[2026, 5, 27, 2], [1975, 6, 7, 13]] as any) {
      for (let d = a; d <= b; d++) {
        const dt = new Date(y, m, d);
        const st = calculateSunTimes(dt, LAT, LON);
        const sr = parse(st.sunrise);
        const hh = Math.floor(sr / 60), mm = Math.floor(sr % 60);
        const p = calculatePlanetaryPositions(new Date(y, m, d, hh, mm, 0));
        const el = normalizeDegrees(p.moon - p.sun);
        const info: any = calculateOdiaCalendarDay(dt);
        rows.push(`D|${y}-${m + 1}-${d}|sr=${st.sunrise}|el=${el.toFixed(4)}|tN=${info.tithiNumber}|dom=${info.dominantTithiNumber}|pct=${info.panjika.tithi.percentage}|lm=${info.lunarMonthName?.en}|f=${info.festivals.map((x: any) => x.id).join(',')}`);
      }
    }
    console.log(rows.join('\n'));
  });
});
