import { PlanetName, PlanetPosition, BhinnaAshtakavarga, FullAshtakavargaData } from '../../types/jataka';

// ─────────────────────────────────────────────────────────────
// Authentic Parāshari Bhinna-Aṣṭakavarga (BPHS Ch. 66) tables.
// For each TARGET planet (row owner), 8 contributors (Sun..Saturn + Lagna)
// each award a bindu in the listed houses counted FROM the contributor.
// Canonical unreduced totals: Surya 48, Chandra 49, Mangala 39,
// Budha 54, Guru 56, Shukra 52, Shani 39 → grand total 337.
// ─────────────────────────────────────────────────────────────
type Contributor = Exclude<PlanetName, 'Rahu' | 'Ketu'> | 'Lagna';

const CONTRIBUTORS: Contributor[] = ['Surya', 'Chandra', 'Mangala', 'Budha', 'Guru', 'Shukra', 'Shani', 'Lagna'];

// Target → contributor → benefic houses (1-12, counted from contributor)
const BAV_RULES: Record<string, Record<Contributor, number[]>> = {
  Surya: {
    Surya: [1, 2, 4, 7, 8, 9, 10, 11],
    Chandra: [3, 6, 10, 11],
    Mangala: [1, 2, 4, 7, 8, 9, 10, 11],
    Budha: [3, 5, 6, 9, 10, 11, 12],
    Guru: [5, 6, 9, 11],
    Shukra: [6, 7, 12],
    Shani: [1, 2, 4, 7, 8, 9, 10, 11],
    Lagna: [3, 4, 6, 10, 11, 12],
  },
  Chandra: {
    Surya: [3, 6, 7, 8, 10, 11],
    Chandra: [1, 3, 6, 7, 10, 11],
    Mangala: [2, 3, 5, 6, 9, 10, 11],
    Budha: [1, 3, 4, 5, 7, 8, 10, 11],
    Guru: [1, 4, 7, 8, 10, 11, 12],
    Shukra: [3, 4, 5, 7, 9, 10, 11],
    Shani: [3, 5, 6, 11],
    Lagna: [3, 6, 10, 11],
  },
  Mangala: {
    Surya: [3, 5, 6, 10, 11],
    Chandra: [3, 6, 11],
    Mangala: [1, 2, 4, 7, 8, 10, 11],
    Budha: [3, 5, 6, 11],
    Guru: [6, 10, 11, 12],
    Shukra: [6, 8, 11, 12],
    Shani: [1, 4, 7, 8, 9, 10, 11],
    Lagna: [1, 3, 6, 10, 11],
  },
  Budha: {
    Surya: [5, 6, 9, 11, 12],
    Chandra: [2, 4, 6, 8, 10, 11],
    Mangala: [1, 2, 4, 7, 8, 9, 10, 11],
    Budha: [1, 3, 5, 6, 9, 10, 11, 12],
    Guru: [6, 8, 10, 11],
    Shukra: [1, 2, 3, 4, 5, 8, 9, 11],
    Shani: [1, 2, 4, 7, 8, 9, 10, 11],
    Lagna: [1, 2, 4, 6, 8, 10, 11],
  },
  Guru: {
    Surya: [1, 2, 3, 4, 7, 8, 9, 10, 11],
    Chandra: [2, 5, 7, 9, 11],
    Mangala: [1, 2, 4, 7, 8, 10, 11],
    Budha: [1, 2, 4, 5, 6, 9, 10, 11],
    Guru: [1, 2, 3, 4, 7, 8, 10, 11],
    Shukra: [2, 5, 6, 9, 10, 11],
    Shani: [3, 5, 6, 12],
    Lagna: [1, 2, 4, 5, 6, 7, 9, 10, 11],
  },
  Shukra: {
    Surya: [8, 11, 12],
    Chandra: [1, 2, 3, 4, 5, 8, 9, 11, 12],
    Mangala: [3, 4, 6, 9, 11, 12],
    Budha: [3, 4, 6, 9, 11, 12],
    Guru: [5, 8, 9, 10, 11],
    Shukra: [1, 2, 3, 4, 5, 8, 9, 10, 11],
    Shani: [3, 4, 5, 8, 9, 10, 11],
    Lagna: [1, 2, 3, 4, 5, 8, 9],
  },
  Shani: {
    Surya: [1, 2, 4, 7, 8, 10, 11],
    Chandra: [3, 6, 11],
    Mangala: [3, 5, 6, 10, 11, 12],
    Budha: [6, 8, 9, 10, 11],
    Guru: [5, 6, 11, 12],
    Shukra: [6, 11, 12],
    Shani: [3, 4, 6, 10, 11],
    Lagna: [1, 3, 4, 6, 10, 11],
  },
};

export const BAV_CANONICAL_TOTALS: Record<string, number> = {
  Surya: 48, Chandra: 49, Mangala: 39, Budha: 54, Guru: 56, Shukra: 52, Shani: 39,
};

// Sign index (0-11, Mesha=0) of each contributor: 7 planets + Lagna.
function contributorSignIndex(c: Contributor, planets: Record<PlanetName, PlanetPosition>, lagnaSignIndex: number): number {
  if (c === 'Lagna') return lagnaSignIndex;
  return planets[c].signIndex;
}

export function calculateBhinnaForTarget(
  target: string,
  planets: Record<PlanetName, PlanetPosition>,
  lagnaSignIndex: number
): number[] {
  const rules = BAV_RULES[target];
  const bindus = new Array(12).fill(0);
  for (const c of CONTRIBUTORS) {
    const refSign = contributorSignIndex(c, planets, lagnaSignIndex);
    for (const house of rules[c]) {
      const signIdx = (refSign + house - 1) % 12;
      bindus[signIdx] += 1;
    }
  }
  return bindus;
}

export function calculateFullAshtakavarga(
  planets: Record<PlanetName, PlanetPosition>,
  lagnaSignIndex?: number
): FullAshtakavargaData {
  const mainPlanets: PlanetName[] = ['Surya', 'Chandra', 'Mangala', 'Budha', 'Guru', 'Shukra', 'Shani'];
  // Derive lagna sign from houses: house 1 sign = lagna
  let lagna = lagnaSignIndex ?? 0;
  const bavRecord: Partial<Record<PlanetName, BhinnaAshtakavarga>> = {};
  const sarvashtakavarga: number[] = new Array(12).fill(0);

  for (const p of mainPlanets) {
    const bindus = calculateBhinnaForTarget(p, planets, lagna);
    const total = bindus.reduce((s, b) => s + b, 0);
    bavRecord[p] = { planet: p, bindus, totalBindus: total };
    for (let h = 0; h < 12; h++) sarvashtakavarga[h] += bindus[h];
  }

  // Trikona Shodhana (Reduction of Triplicities: 1-5-9, 2-6-10, 3-7-11, 4-8-12)
  const trikonaShodhana = [...sarvashtakavarga];
  const trines = [[0, 4, 8], [1, 5, 9], [2, 6, 10], [3, 7, 11]];
  for (const group of trines) {
    const minVal = Math.min(...group.map(idx => trikonaShodhana[idx]));
    for (const idx of group) trikonaShodhana[idx] = Math.max(0, trikonaShodhana[idx] - minVal);
  }

  // Ekadhipatya Shodhana (Dual lordship reduction)
  const ekadhipatyaShodhana = [...trikonaShodhana];
  const dualPairs = [[0, 7], [1, 6], [2, 5], [8, 11], [9, 10]];
  for (const [s1, s2] of dualPairs) {
    const v1 = ekadhipatyaShodhana[s1];
    const v2 = ekadhipatyaShodhana[s2];
    if (v1 > 0 && v2 > 0) {
      const minVal = Math.min(v1, v2);
      ekadhipatyaShodhana[s1] = Math.max(0, v1 - minVal);
      ekadhipatyaShodhana[s2] = Math.max(0, v2 - minVal);
    }
  }

  const totalBindus = sarvashtakavarga.reduce((sum, val) => sum + val, 0);

  return {
    bav: bavRecord as Record<PlanetName, BhinnaAshtakavarga>,
    sarvashtakavarga,
    trikonaShodhana,
    ekadhipatyaShodhana,
    totalBindus
  };
}

