import { getJulianDay, getJulianCenturies } from './julian';
import { getLahiriAyanamsha } from './ayanamsha';

export function normalizeDegrees(deg: number): number {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

export function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function toDegrees(rad: number): number {
  return (rad * 180) / Math.PI;
}

export interface PlanetaryPositionsRaw {
  sun: number;
  moon: number;
  mars: number;
  mercury: number;
  jupiter: number;
  venus: number;
  saturn: number;
  rahu: number;
  ketu: number;
  ayanamsa: number;
  isRetrograde?: {
    mars: boolean;
    mercury: boolean;
    jupiter: boolean;
    venus: boolean;
    saturn: boolean;
  };
}

/**
 * Solves Kepler's equation M = E - e*sin(E) iteratively
 */
function solveKepler(M_rad: number, e: number): number {
  let E = M_rad;
  for (let i = 0; i < 15; i++) {
    const delta = (E - e * Math.sin(E) - M_rad) / (1 - e * Math.cos(E));
    E -= delta;
    if (Math.abs(delta) < 1e-7) break;
  }
  return E;
}

/**
 * Calculates geocentric ecliptic longitude for an exterior or interior planet
 * using standard Keplerian orbital elements (Standish & Meeus / JPL)
 */
function calculateGeocentricLongitude(
  T: number,
  a0: number, da: number,
  e0: number, de: number,
  I0: number, dI: number,
  L0: number, dL: number,
  w0: number, dw: number,
  O0: number, dO: number,
  xEarth: number, yEarth: number
): { longitude: number; x: number; y: number; z: number } {
  const a = a0 + da * T;
  const e = e0 + de * T;
  const I = toRadians(I0 + dI * T);
  const L = normalizeDegrees(L0 + dL * T);
  const w = normalizeDegrees(w0 + dw * T); // longitude of perihelion
  const O = toRadians(O0 + dO * T); // longitude of ascending node

  const M = normalizeDegrees(L - w);
  const E = solveKepler(toRadians(M), e);

  // Position in orbital plane
  const xPrime = a * (Math.cos(E) - e);
  const yPrime = a * Math.sqrt(1 - e * e) * Math.sin(E);

  // Argument of periapsis
  const wArg = toRadians(w - toDegrees(O));

  // Heliocentric coordinates (J2000 ecliptic)
  const xHelio = (Math.cos(wArg) * Math.cos(O) - Math.sin(wArg) * Math.sin(O) * Math.cos(I)) * xPrime
               + (-Math.sin(wArg) * Math.cos(O) - Math.cos(wArg) * Math.sin(O) * Math.cos(I)) * yPrime;
  const yHelio = (Math.cos(wArg) * Math.sin(O) + Math.sin(wArg) * Math.cos(O) * Math.cos(I)) * xPrime
               + (-Math.sin(wArg) * Math.sin(O) + Math.cos(wArg) * Math.cos(O) * Math.cos(I)) * yPrime;
  const zHelio = (Math.sin(wArg) * Math.sin(I)) * xPrime
               + (Math.cos(wArg) * Math.sin(I)) * yPrime;

  // Geocentric coordinates (Earth-centered)
  const xGeo = xHelio - xEarth;
  const yGeo = yHelio - yEarth;

  let lonGeo = toDegrees(Math.atan2(yGeo, xGeo));
  return {
    longitude: normalizeDegrees(lonGeo),
    x: xGeo,
    y: yGeo,
    z: zHelio
  };
}

/**
 * Astronomical Ephemeris Engine (Chapront-Touzé & Keplerian Geocentric VSOP)
 * Converts Tropical Coordinates to Sidereal (Nirayana) with Lahiri Ayanamsha
 */
function _calculateBasePositions(date: Date): Omit<PlanetaryPositionsRaw, 'isRetrograde'> {
  const jd = getJulianDay(date);
  const T = getJulianCenturies(jd);
  const ayanamsa = getLahiriAyanamsha(jd);

  // 1. Sun Geometric Mean Longitude & Earth Heliocentric Position
  const L0_sun = normalizeDegrees(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  const M_sun = normalizeDegrees(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const C_sun = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(toRadians(M_sun))
              + (0.019993 - 0.000101 * T) * Math.sin(toRadians(2 * M_sun))
              + 0.000289 * Math.sin(toRadians(3 * M_sun));
  const sunTropical = normalizeDegrees(L0_sun + C_sun);
  const sunSidereal = normalizeDegrees(sunTropical - ayanamsa);

  // Earth heliocentric position (opposite of Sun's apparent geocentric direction)
  const earthSunDist = 1.000001018 * (1 - 0.016708634 * Math.cos(toRadians(M_sun)));
  const earthHelioLon = normalizeDegrees(sunTropical + 180);
  const xEarth = earthSunDist * Math.cos(toRadians(earthHelioLon));
  const yEarth = earthSunDist * Math.sin(toRadians(earthHelioLon));

  // 2. Moon Mean Longitude & Periodic Perturbations
  // Reference: Jean Meeus, "Astronomical Algorithms" 2nd Ed., Chapter 47 (Lunar Theory).
  //
  // NOTATION (Meeus) -> (this engine):
  //   L'  = Moon's mean longitude        -> L_moon
  //   D   = mean elongation of the Moon  -> D_moon
  //   M   = Moon's mean anomaly          -> M_moon
  //   M'  = SUN's mean anomaly           -> M_sun (reused from section 1 above)
  //   F   = Moon's argument of latitude  -> F_moon
  //
  // CRITICAL: the dominant 6.288774 deg periodic term is driven by the SUN's mean
  // anomaly M' (~0.9856 deg/day), NOT the Moon's anomaly M (~13.176 deg/day).
  // Using M there injects a spurious rate error of up to +/-1.4 deg/day into the
  // Moon-Sun elongation, which makes sunrises skip whole tithis and corrupts
  // every festival date derived from tithi boundaries.
  const L_moon = normalizeDegrees(218.3164477 + 481267.88123421 * T - 0.0015786 * T * T);
  const D_moon = normalizeDegrees(297.8501921 + 445267.1114034 * T - 0.0018819 * T * T);
  const M_moon = normalizeDegrees(134.9633964 + 477198.8675055 * T + 0.0087414 * T * T);
  const F_moon = normalizeDegrees(93.2720950 + 483202.0175233 * T - 0.0036539 * T * T);

  // Eccentricity correction factor for terms involving M and M' (Meeus 47.10)
  const E = 1 - 0.002516 * T - 0.0000074 * T * T;

  // Additive arguments (Meeus 47.12)
  const A1 = 119.75 + 131.849 * T;
  const A2 = 53.09 + 479264.290 * T;
  const A3 = 313.45 + 481266.484 * T;

  // Meeus Table 47.A (principal terms).
  // NOTE the anomaly roles: the 6.288774 deg term is driven by the MOON's mean
  // anomaly M' (13.176 deg/day) and the 0.185116 deg term by the SUN's mean
  // anomaly M (0.9856 deg/day). Swapping them mis-states the elongation rate
  // and injects a spurious annual error of up to ~13 deg in elongation
  // (roughly one day of tithi drift).
  const moonPerturbations =
      6.288774 * E * Math.sin(toRadians(M_moon))
    + 1.274027 * E * E * Math.sin(toRadians(2 * D_moon - M_moon))
    + 0.658314 * E * Math.sin(toRadians(2 * D_moon))
    + 0.213618 * E * E * Math.sin(toRadians(2 * M_moon))
    - 0.185116 * E * Math.sin(toRadians(M_sun))
    - 0.114332 * Math.sin(toRadians(2 * F_moon))
    + 0.058793 * E * E * Math.sin(toRadians(2 * D_moon - 2 * M_moon))
    + 0.057066 * E * E * Math.sin(toRadians(2 * D_moon - M_moon - M_sun))
    + 0.053322 * E * Math.sin(toRadians(2 * D_moon + M_sun))
    + 0.045758 * E * E * Math.sin(toRadians(2 * D_moon - M_moon))
    - 0.040923 * E * Math.sin(toRadians(M_moon - M_sun))
    - 0.034720 * E * Math.sin(toRadians(D_moon))
    - 0.030383 * E * Math.sin(toRadians(M_moon + M_sun))
    + 0.015327 * Math.sin(toRadians(2 * D_moon - 2 * F_moon))
    - 0.012528 * E * Math.sin(toRadians(M_sun + 2 * F_moon))
    + 0.010980 * E * Math.sin(toRadians(M_sun - 2 * F_moon))
    + 0.010675 * E * Math.sin(toRadians(4 * D_moon - M_sun))
    + 0.010034 * E * Math.sin(toRadians(3 * M_sun))
    + 0.008548 * E * Math.sin(toRadians(4 * D_moon - 2 * M_sun))
    + 0.000325 * Math.sin(toRadians(A1))
    + 0.000165 * Math.sin(toRadians(A2))
    + 0.000164 * Math.sin(toRadians(A3));
  const moonTropical = normalizeDegrees(L_moon + moonPerturbations);
  const moonSidereal = normalizeDegrees(moonTropical - ayanamsa);

  // 3. True Geocentric Coordinates for All Planets (NASA JPL Table of Orbital Elements)
  // Mercury
  const merc = calculateGeocentricLongitude(
    T,
    0.38709927, 0.00000037,
    0.20563593, 0.00001906,
    7.00497902, -0.00594749,
    252.25032350, 149472.67411175,
    77.45779628, 0.16047689,
    48.33076593, -0.12534081,
    xEarth, yEarth
  );

  // Venus
  const ven = calculateGeocentricLongitude(
    T,
    0.72333566, 0.00000390,
    0.00677672, -0.00004107,
    3.39467605, -0.00078890,
    181.97909950, 58517.81538729,
    131.60246718, 0.00268329,
    76.67984255, -0.27769418,
    xEarth, yEarth
  );

  // Mars
  const mars = calculateGeocentricLongitude(
    T,
    1.52371034, 0.00001847,
    0.09339410, 0.00007882,
    1.84969142, -0.00813131,
    -4.55343205, 19140.30268499,
    -23.94362959, 0.44441088,
    49.55953891, -0.29257343,
    xEarth, yEarth
  );

  // Jupiter
  const jup = calculateGeocentricLongitude(
    T,
    5.20288700, -0.00011607,
    0.04838624, -0.00013253,
    1.30439695, -0.00183714,
    34.39644051, 3034.74612775,
    14.72847983, 0.21252668,
    100.47390909, 0.20469106,
    xEarth, yEarth
  );

  // Saturn
  const sat = calculateGeocentricLongitude(
    T,
    9.53667594, -0.00125060,
    0.05386179, -0.00050991,
    2.48599187, 0.00193609,
    49.95424423, 1222.49362201,
    92.59887831, -0.41897216,
    113.66242448, -0.28867794,
    xEarth, yEarth
  );

  // Convert to Sidereal (Nirayana) with Lahiri Ayanamsha
  const mercurySidereal = normalizeDegrees(merc.longitude - ayanamsa);
  const venusSidereal = normalizeDegrees(ven.longitude - ayanamsa);
  const marsSidereal = normalizeDegrees(mars.longitude - ayanamsa);
  const jupiterSidereal = normalizeDegrees(jup.longitude - ayanamsa);
  const saturnSidereal = normalizeDegrees(sat.longitude - ayanamsa);

  // 4. Rahu & Ketu (True Mean Node)
  const omega = normalizeDegrees(125.04452 - 1934.136261 * T + 0.0020708 * T * T);
  const rahuSidereal = normalizeDegrees(omega - ayanamsa);
  const ketuSidereal = normalizeDegrees(rahuSidereal + 180);

  return {
    sun: sunSidereal,
    moon: moonSidereal,
    mars: marsSidereal,
    mercury: mercurySidereal,
    jupiter: jupiterSidereal,
    venus: venusSidereal,
    saturn: saturnSidereal,
    rahu: rahuSidereal,
    ketu: ketuSidereal,
    ayanamsa: ayanamsa
  };
}

export function calculatePlanetaryPositions(date: Date): PlanetaryPositionsRaw {
  const current = _calculateBasePositions(date);
  const prevDate = new Date(date.getTime() - 86400000);
  const prev = _calculateBasePositions(prevDate);
  
  return {
    ...current,
    isRetrograde: {
      mars: normalizeDegrees(current.mars - prev.mars) > 180,
      mercury: normalizeDegrees(current.mercury - prev.mercury) > 180,
      jupiter: normalizeDegrees(current.jupiter - prev.jupiter) > 180,
      venus: normalizeDegrees(current.venus - prev.venus) > 180,
      saturn: normalizeDegrees(current.saturn - prev.saturn) > 180
    }
  };
}