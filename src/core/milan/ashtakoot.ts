import { KootaResult, KundaliMilanResult } from '../../types/milan';
import { calculateMangalDosha } from './mangal_dosha';

// 27 Nakshatras Gana mapping (0: Deva, 1: Manushya, 2: Rakshasa)
// Ashwini(D), Bharani(M), Krittika(R), Rohini(M), Mrigashira(D), Ardra(M), Punarvasu(D), Pushya(D), Ashlesha(R)...
const NAKSHATRA_GANA = [
  0, 1, 2, 1, 0, 1, 0, 0, 2, // 1-9
  2, 1, 1, 0, 2, 0, 2, 0, 2, // 10-18
  2, 1, 1, 0, 2, 2, 1, 1, 0  // 19-27
];

// 27 Nakshatras Nadi mapping (0: Aadi, 1: Madhya, 2: Antya)
const NAKSHATRA_NADI = [
  0, 1, 2, 2, 1, 0, 0, 1, 2,
  2, 1, 0, 0, 1, 2, 2, 1, 0,
  0, 1, 2, 2, 1, 0, 0, 1, 2
];

// 27 Nakshatras Yoni mapping (14 animal types)
const NAKSHATRA_YONI = [
  0, 1, 2, 3, 3, 4, 5, 2, 5,  // Ashwini: Horse(0), Bharani: Elephant(1), Krittika: Sheep(2), Rohini: Serpent(3)...
  6, 6, 7, 8, 9, 8, 9, 10, 10,
  4, 11, 7, 11, 12, 0, 12, 7, 1
];

// Varna of 12 Zodiac signs: 0: Brahmana(Water), 1: Kshatriya(Fire), 2: Vaishya(Earth), 3: Shudra(Air)
// Mesha(1), Vrishabha(2), Mithuna(3), Karka(0), Simha(1), Kanya(2), Tula(3), Vrischika(0), Dhanu(1), Makara(2), Kumbha(3), Meena(0)
const SIGN_VARNA = [1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0];

// Moon Sign Lords: Mars, Venus, Mercury, Moon, Sun, Mercury, Venus, Mars, Jupiter, Saturn, Saturn, Jupiter
const SIGN_LORDS = ['Mangala', 'Shukra', 'Budha', 'Chandra', 'Surya', 'Budha', 'Shukra', 'Mangala', 'Guru', 'Shani', 'Shani', 'Guru'];

/**
 * 36-Guna Classical Ashtakoot Matching Engine
 */
export function calculateAshtakootMilan(
  groomNakshatraIdx: number, // 0 to 26
  groomSignIdx: number,      // 0 to 11
  brideNakshatraIdx: number,  // 0 to 26
  brideSignIdx: number,      // 0 to 11
  groomName: string = 'Varun',
  brideName: string = 'Priya'
): KundaliMilanResult {
  const kootas: KootaResult[] = [];

  // 1. Varna Koota (1 Point)
  const gVarna = SIGN_VARNA[groomSignIdx];
  const bVarna = SIGN_VARNA[brideSignIdx];
  let varnaPts = 0;
  if (gVarna <= bVarna) { // Lower or equal index means higher/equal spiritual status
    varnaPts = 1;
  }
  kootas.push({
    name: 'Varna',
    obtainedPoints: varnaPts,
    maxPoints: 1,
    description: varnaPts === 1 ? 'Excellent spiritual and ego compatibility' : 'Moderate spiritual harmony',
    status: varnaPts === 1 ? 'excellent' : 'average'
  });

  // 2. Vashya Koota (2 Points)
  let vashyaPts = 1;
  if (groomSignIdx === brideSignIdx) vashyaPts = 2;
  else if ((groomSignIdx + 6) % 12 === brideSignIdx) vashyaPts = 1;
  else vashyaPts = 2; // Harmonious pairs
  kootas.push({
    name: 'Vashya',
    obtainedPoints: vashyaPts,
    maxPoints: 2,
    description: vashyaPts === 2 ? 'Strong mutual attraction and mutual respect' : 'Balanced mutual influence',
    status: vashyaPts >= 1.5 ? 'excellent' : 'good'
  });

  // 3. Tara Koota (3 Points)
  const countBtoG = ((groomNakshatraIdx - brideNakshatraIdx + 27) % 27) + 1;
  const countGtoB = ((brideNakshatraIdx - groomNakshatraIdx + 27) % 27) + 1;
  const taraBtoG = countBtoG % 9;
  const taraGtoB = countGtoB % 9;
  const badTaras = [3, 5, 7]; // Vipat, Pratyak, Naidhana

  let taraPts = 3;
  if (badTaras.includes(taraBtoG) && badTaras.includes(taraGtoB)) {
    taraPts = 0;
  } else if (badTaras.includes(taraBtoG) || badTaras.includes(taraGtoB)) {
    taraPts = 1.5;
  }
  kootas.push({
    name: 'Tara',
    obtainedPoints: taraPts,
    maxPoints: 3,
    description: taraPts === 3 ? 'Auspicious destiny and health harmony' : (taraPts === 1.5 ? 'Average destiny balance' : 'Tara Dosha present'),
    status: taraPts === 3 ? 'excellent' : (taraPts === 1.5 ? 'average' : 'dosha')
  });

  // 4. Yoni Koota (4 Points)
  const gYoni = NAKSHATRA_YONI[groomNakshatraIdx];
  const bYoni = NAKSHATRA_YONI[brideNakshatraIdx];
  let yoniPts = 2;
  if (gYoni === bYoni) yoniPts = 4;
  else if (Math.abs(gYoni - bYoni) <= 2) yoniPts = 3;
  else if (Math.abs(gYoni - bYoni) >= 10) yoniPts = 1;
  kootas.push({
    name: 'Yoni',
    obtainedPoints: yoniPts,
    maxPoints: 4,
    description: yoniPts >= 3 ? 'High biological harmony and emotional intimacy' : 'Moderate emotional intimacy',
    status: yoniPts >= 3 ? 'excellent' : 'good'
  });

  // 5. Graha Maitri (5 Points)
  const gLord = SIGN_LORDS[groomSignIdx];
  const bLord = SIGN_LORDS[brideSignIdx];
  let maitriPts = 3;
  if (gLord === bLord) maitriPts = 5;
  else if ((gLord === 'Guru' && bLord === 'Surya') || (gLord === 'Surya' && bLord === 'Guru')) maitriPts = 5;
  else if ((gLord === 'Budha' && bLord === 'Shukra') || (gLord === 'Shukra' && bLord === 'Budha')) maitriPts = 5;
  else maitriPts = 4;
  kootas.push({
    name: 'Graha Maitri',
    obtainedPoints: maitriPts,
    maxPoints: 5,
    description: maitriPts >= 4 ? 'Deep friendship, intellectual sync and mutual trust' : 'Compatible worldview',
    status: maitriPts >= 4 ? 'excellent' : 'good'
  });

  // 6. Gana Koota (6 Points)
  const gGana = NAKSHATRA_GANA[groomNakshatraIdx];
  const bGana = NAKSHATRA_GANA[brideNakshatraIdx];
  let ganaPts = 6;
  if (gGana === bGana) {
    ganaPts = 6;
  } else if ((gGana === 0 && bGana === 1) || (gGana === 1 && bGana === 0)) {
    ganaPts = 5;
  } else {
    ganaPts = 0; // Gana Dosha (Deva/Manushya with Rakshasa)
  }
  kootas.push({
    name: 'Gana',
    obtainedPoints: ganaPts,
    maxPoints: 6,
    description: ganaPts >= 5 ? 'Excellent temperament and psychological compatibility' : 'Temperament mismatch (Gana Dosha)',
    status: ganaPts >= 5 ? 'excellent' : 'dosha'
  });

  // 7. Bhakoot Koota (7 Points)
  const relativeDistance = ((brideSignIdx - groomSignIdx + 12) % 12) + 1;
  let bhakootPts = 7;
  const inauspiciousDistances = [2, 12, 6, 8, 9, 5];
  if (inauspiciousDistances.includes(relativeDistance)) {
    // Check cancellation: same sign lord
    if (gLord === bLord) {
      bhakootPts = 7; // Cancellation
    } else {
      bhakootPts = 0; // Bhakoot Dosha
    }
  }
  kootas.push({
    name: 'Bhakoot',
    obtainedPoints: bhakootPts,
    maxPoints: 7,
    description: bhakootPts === 7 ? 'Prosperous domestic life and emotional longevity' : 'Bhakoot Dosha (emotional conflicts possible)',
    status: bhakootPts === 7 ? 'excellent' : 'dosha'
  });

  // 8. Nadi Koota (8 Points)
  const gNadi = NAKSHATRA_NADI[groomNakshatraIdx];
  const bNadi = NAKSHATRA_NADI[brideNakshatraIdx];
  let nadiPts = 8;
  if (gNadi === bNadi) {
    nadiPts = 0; // Nadi Dosha
  }
  kootas.push({
    name: 'Nadi',
    obtainedPoints: nadiPts,
    maxPoints: 8,
    description: nadiPts === 8 ? 'Exceptional genetic, physiological, and progeny health' : 'Nadi Dosha detected (same elemental constitution)',
    status: nadiPts === 8 ? 'excellent' : 'dosha'
  });

  // Summation
  const totalScore = kootas.reduce((sum, k) => sum + k.obtainedPoints, 0);
  const percentage = Math.round((totalScore / 36) * 100);

  let verdict: KundaliMilanResult['verdict'] = 'Not Recommended';
  if (totalScore >= 28) verdict = 'Excellent';
  else if (totalScore >= 21) verdict = 'Very Good';
  else if (totalScore >= 18) verdict = 'Average';

  // Mangal Dosha check for sample charts (e.g. Mars in 1, 4, 7, 8, 12)
  const groomManglik = calculateMangalDosha([1], groomSignIdx);
  const brideManglik = calculateMangalDosha([7], brideSignIdx);

  const remedies: string[] = [];
  if (nadiPts === 0) remedies.push('Perform Maha Mrityunjaya Japa and Gold donation to balance Nadi Dosha.');
  if (bhakootPts === 0) remedies.push('Chant Vishnu Sahasranama together to neutralize Bhakoot disparity.');
  if (groomManglik.hasDosha || brideManglik.hasDosha) {
    remedies.push('Kumbha Vivaha or regular Tuesday Hanuman Chalisa recitation.');
  }

  return {
    groomName,
    brideName,
    totalScore,
    maxScore: 36,
    percentage,
    verdict,
    kootas,
    groomManglik,
    brideManglik,
    remedies
  };
}
