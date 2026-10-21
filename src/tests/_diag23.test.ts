import { describe, it } from 'vitest';
import { calculatePlanetaryPositions, normalizeDegrees } from '../core/astronomy/ephemeris';
import { getJulianDay, getJulianCenturies } from '../core/astronomy/julian';
import { getLahiriAyanamsha } from '../core/astronomy/ayanamsha';

const R = Math.PI / 180;

describe('DIAG23', () => {
  it('meeus 47.A term isolation', () => {
    // 1992 April 12.0 TD -> JD 2448724.5
    const jd = 2448724.5;
    const T = getJulianCenturies(jd);
    const d = new Date((jd + 59 / 86400 - 2440587.5) * 86400000);
    const ay = getLahiriAyanamsha(getJulianDay(d));

    const L = normalizeDegrees(218.3164477 + 481267.88123421 * T - 0.0015786 * T * T);
    const D = normalizeDegrees(297.8501921 + 445267.1114034 * T - 0.0018819 * T * T);
    const M = normalizeDegrees(134.9633964 + 477198.8675055 * T + 0.0087414 * T * T);
    const Mp = normalizeDegrees(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
    const F = normalizeDegrees(93.2720950 + 483202.0175233 * T - 0.0036539 * T * T);
    const E = 1 - 0.002516 * T - 0.0000074 * T * T;
    const A1 = 119.75 + 131.849 * T;
    const A2 = 53.09 + 479264.290 * T;
    const A3 = 313.45 + 481266.484 * T;

    // canonical Meeus 47.A (M = moon anomaly, M' = sun anomaly)
    const correct =
      6.288774 * E * Math.sin(R * Mp) +
      1.274027 * E * E * Math.sin(R * (2 * D - Mp)) +
      0.658314 * E * Math.sin(R * (2 * D)) +
      0.213618 * E * E * Math.sin(R * (2 * M)) -
      0.185116 * E * Math.sin(R * M) -
      0.114332 * Math.sin(R * (2 * F)) +
      0.058793 * E * E * Math.sin(R * (2 * D - 2 * M)) +
      0.057066 * E * E * Math.sin(R * (2 * D - M - Mp)) +
      0.053322 * E * Math.sin(R * (2 * D + Mp)) +
      0.045758 * E * E * Math.sin(R * (2 * D - M)) -
      0.040923 * E * Math.sin(R * (M - Mp)) -
      0.034720 * E * Math.sin(R * D) -
      0.030383 * E * Math.sin(R * (M + Mp)) +
      0.015327 * Math.sin(R * (2 * D - 2 * F)) -
      0.012528 * E * Math.sin(R * (Mp + 2 * F)) +
      0.010980 * E * Math.sin(R * (Mp - 2 * F)) +
      0.010675 * E * Math.sin(R * (4 * D - Mp)) +
      0.010034 * E * Math.sin(R * (3 * Mp)) +
      0.008548 * E * Math.sin(R * (4 * D - 2 * Mp)) +
      0.000325 * Math.sin(R * A1) +
      0.000165 * Math.sin(R * A2) +
      0.000164 * Math.sin(R * A3);

    // repo variant: 1.274027 term driven by MOON anomaly instead of SUN anomaly
    const repoVariant = correct - 1.274027 * E * E * Math.sin(R * (2 * D - Mp)) + 1.274027 * E * E * Math.sin(R * (2 * D - M));

    const p = calculatePlanetaryPositions(d);
    const repoTrop = normalizeDegrees(p.moon + ay);

    console.log('T=', T.toFixed(6), 'E=', E.toFixed(8));
    console.log('L=', L.toFixed(6), 'D=', D.toFixed(4), 'M=', M.toFixed(4), 'Mp=', Mp.toFixed(4), 'F=', F.toFixed(4));
    console.log('correctPert=', correct.toFixed(6), '-> lambda=', normalizeDegrees(L + correct).toFixed(6));
    console.log('repoVariantPert=', repoVariant.toFixed(6), '-> lambda=', normalizeDegrees(L + repoVariant).toFixed(6));
    console.log('repoEngine lambda=', repoTrop.toFixed(6), 'expected=', 133.162655);
  });
});
