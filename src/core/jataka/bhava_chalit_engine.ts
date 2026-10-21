import { PlanetName, PlanetPosition, ZodiacSign, BhavaCuspInfo, BhavaChalitData } from '../../types/jataka';
import { ZODIAC_SIGNS } from './kundali_engine';
import { normalizeDegrees } from '../astronomy/ephemeris';

export function calculateBhavaChalit(
  ascendantDegree: number,
  planets: Record<PlanetName, PlanetPosition>
): BhavaChalitData {
  const cusps: BhavaCuspInfo[] = [];
  const shiftedPlanets: BhavaChalitData['shiftedPlanets'] = [];

  // Sripati Bhava Sphuta system
  // Midpoints of Bhavas are 30 degrees apart starting from Ascendant
  for (let h = 1; h <= 12; h++) {
    const madhya = normalizeDegrees(ascendantDegree + (h - 1) * 30);
    const arambha = normalizeDegrees(madhya - 15);
    const anta = normalizeDegrees(madhya + 15);

    const signIdx = Math.floor(madhya / 30);

    cusps.push({
      houseNumber: h,
      bhavaArambha: Math.round(arambha * 100) / 100,
      bhavaMadhya: Math.round(madhya * 100) / 100,
      bhavaAnta: Math.round(anta * 100) / 100,
      sign: ZODIAC_SIGNS[signIdx],
      signIndex: signIdx,
      planetsInBhava: []
    });
  }

  // Assign planets to Bhava Chalit based on cusp bounds
  for (const [pName, pPos] of Object.entries(planets)) {
    const p = pName as PlanetName;
    const long = pPos.longitude;

    let assignedBhava = 1;
    for (const cusp of cusps) {
      let inBounds = false;
      if (cusp.bhavaArambha < cusp.bhavaAnta) {
        inBounds = long >= cusp.bhavaArambha && long < cusp.bhavaAnta;
      } else {
        // Crosses 360° boundary
        inBounds = long >= cusp.bhavaArambha || long < cusp.bhavaAnta;
      }

      if (inBounds) {
        assignedBhava = cusp.houseNumber;
        break;
      }
    }

    cusps[assignedBhava - 1].planetsInBhava.push(p);

    if (assignedBhava !== pPos.house) {
      shiftedPlanets.push({
        planet: p,
        rashiHouse: pPos.house,
        chalitHouse: assignedBhava
      });
    }
  }

  return {
    cusps,
    shiftedPlanets
  };
}
