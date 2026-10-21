import { describe, it } from 'vitest';
import { calculatePlanetaryPositions } from '../core/astronomy/ephemeris';

// Meeus Ch.49 new moon JDE (ground truth)
function newMoonJDE(k: number): number {
  const T = k / 1236.85, T2 = T * T, T3 = T2 * T, T4 = T3 * T;
  const E = 1 - 0.002516 * T - 0.0000074 * T2, E2 = E * E;
  const n = (d: number) => ((d % 360) + 360) % 360;
  const r = (d: number) => (d * Math.PI) / 180;
  let JDE = 2451550.09766 + 29.530588861 * k + 0.00015437 * T2 - 0.00000015 * T3 + 0.00000000073 * T4;
  const M = n(2.5534 + 29.1053567 * k - 0.0000014 * T2 - 0.00000011 * T3);
  const Mp = n(201.5643 + 385.81693528 * k + 0.0107582 * T2 + 0.00001238 * T3 - 0.000000058 * T4);
  const F = n(160.7108 + 390.67050284 * k - 0.0016118 * T2 - 0.00000227 * T3 + 0.000000011 * T4);
  const Om = n(124.7746 - 1.56375588 * k + 0.0020672 * T2 + 0.000015 * T3);
  JDE +=
    -0.4072 * Math.sin(r(Mp)) + 0.17241 * E * Math.sin(r(M)) + 0.01608 * Math.sin(r(2 * Mp)) +
    0.01039 * Math.sin(r(2 * F)) + 0.00739 * E * Math.sin(r(Mp - M)) - 0.00514 * E * Math.sin(r(Mp + M)) +
    0.00208 * E2 * Math.sin(r(2 * M)) - 0.00111 * Math.sin(r(Mp - 2 * F)) - 0.00057 * Math.sin(r(Mp + 2 * F)) +
    0.00056 * E * Math.sin(r(2 * Mp + M)) - 0.00042 * Math.sin(r(3 * Mp)) + 0.00042 * E * Math.sin(r(M + 2 * F)) +
    0.00038 * E * Math.sin(r(M - 2 * F)) - 0.00024 * E * Math.sin(r(2 * Mp - M)) - 0.00017 * Math.sin(r(Om));
  return JDE;
}
const jdToDate = (jd: number) => new Date((jd - 2440587.5) * 86400000);

describe('DIAG25', () => {
  it('engine vs meeus', () => {
    for (let k = 326; k <= 333; k++) {
      const truth = jdToDate(newMoonJDE(k));
      let prev = NaN, prevT = 0, cross = NaN;
      for (let m = -48; m <= 48; m++) {
        const t = truth.getTime() + m * 3600000;
        const p = calculatePlanetaryPositions(new Date(t));
        let el = ((p.moon - p.sun) % 360 + 360) % 360;
        if (el > 180) el -= 360;
        if (!Number.isNaN(prev) && prev < 0 && el >= 0) {
          cross = prevT + ((t - prevT) * (-prev)) / (el - prev);
        }
        prev = el; prevT = t;
      }
      const driftH = (cross - truth.getTime()) / 3600000;
      const pT = calculatePlanetaryPositions(truth);
      const elT = ((pT.moon - pT.sun) % 360 + 360) % 360;
      const pT2 = calculatePlanetaryPositions(new Date(truth.getTime() + 86400000));
      const elT2 = ((pT2.moon - pT2.sun) % 360 + 360) % 360;
      console.log(`k=${k} meeus=${truth.toISOString()} engineNM=${new Date(cross).toISOString()} driftH=${driftH.toFixed(2)} elAtTruth=${elT.toFixed(3)} rate24h=${(((elT2 - elT) + 360) % 360).toFixed(3)}`);
    }
  });
});
