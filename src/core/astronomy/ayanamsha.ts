import { getJulianCenturies } from './julian';

/**
 * High-Precision Lahiri (Chitra Paksha) Ayanamsha
 * Standard Indian Astronomical Reference (Indian Calendar Reform Committee 1952)
 */
export function getLahiriAyanamsha(jd: number): number {
  const T = getJulianCenturies(jd);
  // Epoch J2000.0 Lahiri ayanamsha = 23° 51' 25.53" = 23.85709167°
  // Precession rate ~ 50.290966 arcseconds per year = 1.396971° per Julian century
  const ayanamsha = 23.85709167 + 1.396971278 * T + 0.0003086 * T * T;
  return ayanamsha;
}
