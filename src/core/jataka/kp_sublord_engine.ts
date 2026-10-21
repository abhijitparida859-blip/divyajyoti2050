import { PlanetName, PlanetPosition, ZodiacSign, KpEntityInfo, KpSystemData } from '../../types/jataka';
import { RASHI_LORDS, ZODIAC_SIGNS } from './kundali_engine';
import { normalizeDegrees } from '../astronomy/ephemeris';

export const KP_VIMSHOTTARI_LORDS: PlanetName[] = [
  'Ketu', 'Shukra', 'Surya', 'Chandra', 'Mangala', 'Rahu', 'Guru', 'Shani', 'Budha'
];

export const KP_DASHA_YEARS: Record<PlanetName, number> = {
  Ketu: 7,
  Shukra: 20,
  Surya: 6,
  Chandra: 10,
  Mangala: 7,
  Rahu: 18,
  Guru: 16,
  Shani: 19,
  Budha: 17
};

/**
 * Calculates the exact KP Sign Lord, Star (Nakshatra) Lord, and Sub Lord (249 table)
 * for any given sidereal longitude.
 */
export function calculateKpEntity(longitude: number, name: string): KpEntityInfo {
  const normDeg = normalizeDegrees(longitude);
  const signIndex = Math.min(11, Math.floor(normDeg / 30));
  const sign = ZODIAC_SIGNS[signIndex];
  const signLord = RASHI_LORDS[sign];

  const nakSpanDeg = 360 / 27; // 13° 20' = 13.333333°
  const nakIndex = Math.min(26, Math.floor(normDeg / nakSpanDeg));
  const starLordIndex = nakIndex % 9;
  const starLord = KP_VIMSHOTTARI_LORDS[starLordIndex];

  // Minutes inside the nakshatra (0 to 800 arcminutes)
  const degInNak = normDeg % nakSpanDeg;
  const minInNak = degInNak * 60;

  // Find sub-lord proportional to 120 Vimshottari years
  let currentMin = 0;
  let subLord: PlanetName = starLord;

  for (let step = 0; step < 9; step++) {
    const currentLord = KP_VIMSHOTTARI_LORDS[(starLordIndex + step) % 9];
    const subSpanMinutes = (KP_DASHA_YEARS[currentLord] / 120) * 800; // 800' in a nakshatra
    if (minInNak <= currentMin + subSpanMinutes + 0.0001) {
      subLord = currentLord;
      break;
    }
    currentMin += subSpanMinutes;
  }

  return {
    name,
    longitude: Math.round(normDeg * 1000) / 1000,
    sign,
    signLord,
    starLord,
    subLord
  };
}

/**
 * Calculates KP System Data for all 9 planets and 12 Bhavas (cusps)
 */
export function calculateKpSystem(
  ascendantDegree: number,
  typedPlanets: Record<PlanetName, PlanetPosition>,
  cuspLongitudes?: number[]
): KpSystemData {
  const planets: Record<PlanetName, KpEntityInfo> = {} as Record<PlanetName, KpEntityInfo>;

  (Object.keys(typedPlanets) as PlanetName[]).forEach((pName) => {
    const p = typedPlanets[pName];
    planets[pName] = calculateKpEntity(p.longitude, pName);
  });

  const cusps: KpEntityInfo[] = [];

  for (let h = 1; h <= 12; h++) {
    const cuspLon = cuspLongitudes && cuspLongitudes[h - 1] !== undefined
      ? cuspLongitudes[h - 1]
      : normalizeDegrees(ascendantDegree + (h - 1) * 30);

    cusps.push(calculateKpEntity(cuspLon, `Cusp ${h}`));
  }

  return {
    planets,
    cusps
  };
}
