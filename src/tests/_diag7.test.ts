import { describe, it } from 'vitest';
import { getJulianDay, getJulianCenturies } from '../core/astronomy/julian';
import { getLahiriAyanamsha } from '../core/astronomy/ayanamsha';

const norm = (d: number) => ((d % 360) + 360) % 360;
const rad = (d: number) => (d * Math.PI) / 180;

describe('DIAG7', () => {
  it('moon mean longitude components', () => {
    const rows: string[] = [];
    for (const day of [27, 28, 29, 30]) {
      const date = new Date(Date.UTC(2026, 5, day, 0, 0, 0));
      const jd = getJulianDay(date);
      const T = getJulianCenturies(jd);
      const ayan = getLahiriAyanamsha(jd);
      const L = norm(218.3164477 + 481267.88123421 * T);
      const D = norm(297.8501921 + 445267.1114034 * T);
      const M = norm(134.9633964 + 477198.8675055 * T);
      const F = norm(93.2720950 + 483202.0175233 * T);
      const p1 = 6.288774 * Math.sin(rad(M));
      const p2 = 1.274027 * Math.sin(rad(2 * D - M));
      const p3 = 0.213618 * Math.sin(rad(2 * M));
      const p4 = -0.185116 * Math.sin(rad(0));
      const p5 = -0.114332 * Math.sin(rad(2 * F));
      rows.push(`d${day} jd=${jd.toFixed(4)} T=${T.toFixed(8)} ayan=${ayan.toFixed(5)} L=${L.toFixed(4)} D=${D.toFixed(4)} M=${M.toFixed(4)} F=${F.toFixed(4)} p1=${p1.toFixed(4)} p2=${p2.toFixed(4)} p3=${p3.toFixed(4)} p5=${p5.toFixed(4)} trop=${norm(L + p1 + p2 + p3 + p4 + p5).toFixed(4)}`);
    }
    console.log(rows.join('\n'));
  });
});
