import { describe, it } from 'vitest';
import { calculatePlanetaryPositions, normalizeDegrees } from '../core/astronomy/ephemeris';

describe('DIAG33', () => {
  it('raw elongations', () => {
    const rows: string[] = [];
    for (const d of [28, 29, 30]) {
      for (const h of [5, 9, 12, 15, 18]) {
        const p = calculatePlanetaryPositions(new Date(2026, 5, d, h, 0, 0));
        rows.push(`E|2026-06-${d} ${h}h|moon=${p.moon.toFixed(3)}|sun=${p.sun.toFixed(3)}|raw=${(p.moon - p.sun).toFixed(3)}|norm=${normalizeDegrees(p.moon - p.sun).toFixed(3)}`);
      }
    }
    console.log(rows.join('\n'));
  });
});
