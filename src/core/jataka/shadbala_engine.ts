import { PlanetName, PlanetPosition, PlanetShadbala, ShadbalaSummary } from '../../types/jataka';
import { normalizeDegrees } from '../astronomy/ephemeris';

const DEBILITATION_POINTS: Record<PlanetName, number> = {
  Surya: 190, Chandra: 213, Mangala: 118, Budha: 345,
  Guru: 275, Shukra: 177, Shani: 20, Rahu: 260, Ketu: 80
};

const NAISARGIKA_BALA: Record<PlanetName, number> = {
  Surya: 60.0, Chandra: 51.43, Shukra: 42.86, Guru: 34.29,
  Budha: 25.71, Mangala: 17.14, Shani: 8.57, Rahu: 15.0, Ketu: 15.0
};

const MIN_REQUIRED_RUPAS: Record<PlanetName, number> = {
  Surya: 6.5, Chandra: 6.0, Mangala: 5.0, Budha: 7.0,
  Guru: 6.5, Shukra: 5.5, Shani: 5.0, Rahu: 5.0, Ketu: 5.0
};

export function calculateShadbala(
  planets: Record<PlanetName, PlanetPosition>,
  birthDateUTC: Date,
  ascendantDegree: number
): ShadbalaSummary {
  const mainPlanets: PlanetName[] = ['Surya', 'Chandra', 'Mangala', 'Budha', 'Guru', 'Shukra', 'Shani'];
  const planetShadbalas: Partial<Record<PlanetName, PlanetShadbala>> = {};

  const hourUTC = birthDateUTC.getUTCHours() + birthDateUTC.getUTCMinutes() / 60;
  const localHour = (hourUTC + 5.5) % 24;
  const isDayTime = localHour >= 6 && localHour < 18;

  const sunLong = planets.Surya.longitude;
  const moonLong = planets.Chandra.longitude;
  const elongation = normalizeDegrees(moonLong - sunLong);
  const isShuklaPaksha = elongation < 180;
  const pakshaFactor = isShuklaPaksha ? elongation / 180 : (360 - elongation) / 180;

  for (const p of mainPlanets) {
    const pos = planets[p];
    const long = pos.longitude;

    const debLong = DEBILITATION_POINTS[p];
    let diff = Math.abs(long - debLong);
    if (diff > 180) diff = 360 - diff;
    const ucchaBala = Math.round((diff / 3) * 10) / 10;

    let kendradiBala = 15;
    if ([1, 4, 7, 10].includes(pos.house)) kendradiBala = 60;
    else if ([2, 5, 8, 11].includes(pos.house)) kendradiBala = 30;

    let saptavargajaBala = 75;
    if (pos.dignity === 'Exalted') saptavargajaBala = 120;
    else if (pos.dignity === 'Own') saptavargajaBala = 100;
    else if (pos.dignity === 'Friendly') saptavargajaBala = 85;
    else if (pos.dignity === 'Neutral') saptavargajaBala = 60;
    else if (pos.dignity === 'Enemy') saptavargajaBala = 40;
    else if (pos.dignity === 'Debilitated') saptavargajaBala = 20;

    const sthanaBala = Math.round(ucchaBala + kendradiBala + saptavargajaBala);

    let idealDigDegree = ascendantDegree;
    if (p === 'Surya' || p === 'Mangala') idealDigDegree = normalizeDegrees(ascendantDegree + 270);
    else if (p === 'Shani') idealDigDegree = normalizeDegrees(ascendantDegree + 180);
    else if (p === 'Chandra' || p === 'Shukra') idealDigDegree = normalizeDegrees(ascendantDegree + 90);

    let digDiff = Math.abs(long - idealDigDegree);
    if (digDiff > 180) digDiff = 360 - digDiff;
    const digBala = Math.round((1 - digDiff / 180) * 60 * 10) / 10;

    let natonnata = 30;
    if (p === 'Budha') natonnata = 60;
    else if (['Surya', 'Guru', 'Shukra'].includes(p)) natonnata = isDayTime ? 60 : 15;
    else if (['Chandra', 'Mangala', 'Shani'].includes(p)) natonnata = !isDayTime ? 60 : 15;

    const isBenefic = ['Chandra', 'Guru', 'Shukra', 'Budha'].includes(p);
    const pakshaBala = Math.round((isBenefic ? pakshaFactor : 1 - pakshaFactor) * 60);
    const kaalaBala = Math.round(natonnata + pakshaBala + 30);

    let chestaBala = 30;
    if (pos.isRetrograde) chestaBala = 60;
    else if (p === 'Surya' || p === 'Chandra') chestaBala = Math.round(ucchaBala * 0.8 + 20);
    else chestaBala = Math.round(30 + (pos.longitude % 15));

    const naisargikaBala = Math.round(NAISARGIKA_BALA[p] * 10) / 10;

    let drikBala = 0;
    const benefics = [planets.Guru.house, planets.Shukra.house, planets.Budha.house];
    const malefics = [planets.Shani.house, planets.Mangala.house, planets.Rahu.house];
    if (benefics.includes(pos.house)) drikBala += 15;
    if (malefics.includes(pos.house)) drikBala -= 10;

    const totalVirupas = Math.round(sthanaBala + digBala + kaalaBala + chestaBala + naisargikaBala + drikBala);
    const totalRupas = Math.round((totalVirupas / 60) * 100) / 100;
    const requiredRupas = MIN_REQUIRED_RUPAS[p];
    const strengthPercentage = Math.round((totalRupas / requiredRupas) * 100);

    planetShadbalas[p] = {
      planet: p,
      sthanaBala,
      digBala,
      kaalaBala,
      chestaBala,
      naisargikaBala,
      drikBala,
      totalVirupas,
      totalRupas,
      requiredRupas,
      strengthPercentage,
      isStrong: totalRupas >= requiredRupas,
      rank: 1
    };
  }

  const sorted = Object.values(planetShadbalas).sort((a, b) => (b?.strengthPercentage ?? 0) - (a?.strengthPercentage ?? 0));
  sorted.forEach((item, idx) => {
    if (item && planetShadbalas[item.planet]) {
      planetShadbalas[item.planet]!.rank = idx + 1;
    }
  });

  return {
    planets: planetShadbalas as Record<PlanetName, PlanetShadbala>,
    strongestPlanet: sorted[0]?.planet || 'Guru',
    weakestPlanet: sorted[sorted.length - 1]?.planet || 'Shani'
  };
}
