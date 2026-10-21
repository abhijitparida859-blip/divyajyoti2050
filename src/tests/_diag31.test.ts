import { describe, it } from 'vitest';
import { calculatePlanetaryPositions, normalizeDegrees } from '../core/astronomy/ephemeris';
import { calculateSunTimes } from '../core/astronomy/solar_lunar';
import { calculateOdiaCalendarDay } from '../core/panjika/odia_calendar_engine';

const LAT = 19.8135, LON = 85.8312;

describe('DIAG31', () => {
  it('edge tithi spans', () => {
    const rows: string[] = [];
    for (const [m1, m2, d1, d2] of [[6, 6, 27, 30], [12, 12, 7, 10]] as any) {
      for (let d = d1; d <= d2; d++) {
        const y = 2026;
        const dt = new Date(y, m1 - 1, d);
        const st = calculateSunTimes(dt, LAT, LON);
        const parse = (s: string) => { const [hm, p] = s.split(' '); let [h, mi] = hm.split(':').map(Number); if (p === 'PM' && h !== 12) h += 12; if (p === 'AM' && h === 12) h = 0; return h * 60 + mi; };
        const sr = parse(st.sunrise), ss = parse(st.sunset);
        const at = (mins: number) => { const h = Math.floor(mins / 60), mi = Math.floor(mins % 60); const p = calculatePlanetaryPositions(new Date(y, m1 - 1, d, h, mi, 0)); const diff = normalizeDegrees(p.moon - p.sun); return { diff, num: Math.floor(diff / 12) + 1 }; };
        const info = calculateOdiaCalendarDay(dt);
        const s = at(sr), m = at(Math.floor(sr + (ss - sr) / 2));
        rows.push(
          `E|2026-${m1}-${d}|sr=${st.sunrise} ss=${st.sunset} up=${s.num} upEl=${s.diff.toFixed(2)} mad=${m.num} madEl=${m.diff.toFixed(2)}` +
          ` tEnd=${info.panjika?.tithi?.endTime ?? '?'} tN=${info.tithiNumber} dom=${info.dominantTithiNumber} f=${info.festivals.map(x => x.id).join(',')}`
        );
      }
    }
    console.log(rows.join('\n'));
  });
});
