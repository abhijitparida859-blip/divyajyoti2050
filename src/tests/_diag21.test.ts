import { describe, it } from 'vitest';
import { calculatePlanetaryPositions, normalizeDegrees } from '../core/astronomy/ephemeris';
import { calculateSunTimes } from '../core/astronomy/solar_lunar';

const LAT = 19.8135, LON = 85.8312;

describe('DIAG21', () => {
  it('vyapini window tithi for key 2026 dates', () => {
    const days: Array<[number, number, number]> = [
      [2026, 8, 12], [2026, 8, 13], [2026, 8, 14], [2026, 8, 15], [2026, 8, 16],
      [2026, 5, 14], [2026, 5, 15], [2026, 5, 16], [2026, 5, 28], [2026, 5, 29],
      [2026, 6, 15], [2026, 6, 16],
    ];
    const tAt = (d: Date) => {
      const p = calculatePlanetaryPositions(d);
      const diff = normalizeDegrees(p.moon - p.sun);
      return { diff, num: Math.floor(diff / 12) + 1, shukla: Math.floor(diff / 12) + 1 <= 15 };
    };
    const parse = (s: string) => { const [hm, p] = s.split(' '); let [h, mi] = hm.split(':').map(Number); if (p === 'PM' && h !== 12) h += 12; if (p === 'AM' && h === 12) h = 0; return h * 60 + mi; };
    for (const [y, m, d] of days) {
      const st = calculateSunTimes(new Date(y, m, d), LAT, LON);
      const sr = parse(st.sunrise), ss = parse(st.sunset);
      const dl = ss - sr;
      const win = { purvahna: sr + dl / 4, madhyahna: sr + dl / 2, aparahna: sr + (3 * dl) / 4 };
      const at = (mins: number) => {
        const h = Math.floor(mins / 60), mi = Math.floor(mins % 60);
        return tAt(new Date(y, m, d, h, mi, 0));
      };
      const out: Record<string, string> = {};
      out.sr = st.sunrise; out.ss = st.sunset;
      out.up = `${at(sr).num}`;
      out.pu = `${at(win.purvahna).num}`;
      out.ma = `${at(win.madhyahna).num}`;
      out.ap = `${at(win.aparahna).num}`;
      out.maDiff = at(win.madhyahna).diff.toFixed(3);
      out.upDiff = at(sr).diff.toFixed(3);
      console.log(`W|${y}-${m + 1}-${d}|${JSON.stringify(out)}`);
    }
  });
});
