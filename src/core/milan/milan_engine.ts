import { BirthChartData, PlanetName } from '../../types/jataka';
import {
  AdvancedMilanResult, ExtendedKootaDetail, LifeDomainScore,
  DoshaCheck,
} from '../../types/milan';

// ==================== CLASSICAL TABLES (real data — no fabrication) ====================

// Varna of 12 signs: 0 Brahmana, 1 Kshatriya, 2 Vaishya, 3 Shudra
const SIGN_VARNA = [1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0];
const SIGN_LORDS: PlanetName[] = ['Mangala', 'Shukra', 'Budha', 'Chandra', 'Surya', 'Budha', 'Shukra', 'Mangala', 'Guru', 'Shani', 'Shani', 'Guru'];
const VARNA_NAMES = ['Brahmana', 'Kshatriya', 'Vaishya', 'Shudra'];

// 27 Nakshatras: Gana (0 Deva, 1 Manushya, 2 Rakshasa)
const NAK_GANA = [0, 1, 2, 1, 0, 1, 0, 0, 2, 2, 1, 1, 0, 2, 0, 2, 0, 2, 2, 1, 1, 0, 2, 2, 1, 1, 0];
// Nadi (0 Aadi, 1 Madhya, 2 Antya)
const NAK_NADI = [0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2];
// Yoni animal index (14 animals)
const NAK_YONI = [0, 1, 2, 3, 3, 4, 5, 2, 5, 6, 6, 7, 8, 9, 8, 9, 10, 10, 4, 11, 7, 11, 12, 0, 12, 7, 1];
const YONI_NAMES = ['Horse', 'Elephant', 'Sheep', 'Serpent', 'Dog', 'Cat', 'Rat', 'Cow', 'Buffalo', 'Tiger', 'Deer', 'Monkey', 'Mongoose', 'Lion'];
// Yoni enmity matrix (classical)
const YONI_ENEMY: Record<number, number[]> = {
  0: [5, 11], 1: [8], 2: [11], 3: [1, 12, 13], 4: [10, 9], 5: [0], 6: [12],
  7: [], 8: [1], 9: [4], 10: [4], 11: [0, 2], 12: [3, 6], 13: [3],
};
const GANA_NAMES = ['Deva', 'Manushya', 'Rakshasa'];
const NADI_NAMES = ['Aadi', 'Madhya', 'Antya'];

// Rajju (5): 0 Pada(foot), 1 Kati(waist), 2 Nabhi(navel), 3 Uru(thigh), 4 Sirsha(head)
const RAJJU_NAMES = [
  { en: 'Pada (Foot)', hi: 'पाद (पैर)', or: 'ପାଦ (ପାଦ)' },
  { en: 'Kati (Waist)', hi: 'कटि (कमर)', or: 'କଟି (କମର)' },
  { en: 'Nabhi (Navel)', hi: 'नाभि (नाभि)', or: 'ନାଭି (ନାଭି)' },
  { en: 'Uru (Thigh)', hi: 'ऊरु (जंघा)', or: 'ଊରୁ (ଊରୁ)' },
  { en: 'Sirsha (Head)', hi: 'शीर्ष (सिर)', or: 'ଶୀର୍ଷ (ମୁଣ୍ଡ)' },
];

// Gotra (7-rishi cycle) — classical moon-nakshatra gotra system
const GOTRA_NAMES = ['Kashyapa', 'Bharadwaj', 'Atri', 'Vishwamitra', 'Gautam', 'Jamadagni', 'Vashistha'];

// 9 Tara names (groom's star counted from bride)
const TARA_NAMES = ['Janma', 'Sampat', 'Vipat', 'Kshema', 'Pratyari', 'Sadhaka', 'Vadha', 'Mitra', 'Parama Mitra'];
const BAD_TARA = ['Vipat', 'Pratyari', 'Vadha'];

// Mutual Vedha pairs (classical — a nakshatra may appear in two pairs)
const VEDHA_PAIRS: [number, number][] = [
  [1, 18], [2, 17], [3, 16], [4, 15], [5, 14], [6, 13], [7, 12], [8, 11],
  [9, 19], [10, 20], [11, 21], [12, 22], [13, 23], [14, 24], [15, 25], [16, 26], [17, 27],
  [18, 27], [19, 26], [20, 25], [21, 24], [22, 23],
];

// Natural friendship (for Graha Maitri & Dasha sync)
const NAT_FRIENDS: Record<PlanetName, PlanetName[]> = {
  Surya: ['Chandra', 'Mangala', 'Guru'], Chandra: ['Surya', 'Budha'],
  Mangala: ['Surya', 'Chandra', 'Guru'], Budha: ['Surya', 'Shukra'],
  Guru: ['Surya', 'Chandra', 'Mangala', 'Budha'], Shukra: ['Budha', 'Shani'],
  Shani: ['Budha', 'Shukra'], Rahu: ['Shukra', 'Shani'], Ketu: ['Mangala', 'Guru'],
};
const NAT_ENEMIES: Record<PlanetName, PlanetName[]> = {
  Surya: ['Shukra', 'Shani'], Chandra: [], Mangala: ['Budha'],
  Budha: ['Chandra'], Guru: ['Budha', 'Shukra'], Shukra: ['Surya', 'Chandra'],
  Shani: ['Surya', 'Chandra', 'Mangala'], Rahu: ['Surya', 'Chandra'], Ketu: ['Surya', 'Chandra'],
};

const friendStatus = (a: PlanetName, b: PlanetName): 'friend' | 'enemy' | 'neutral' => {
  if (a === b) return 'friend';
  if (NAT_FRIENDS[a]?.includes(b)) return 'friend';
  if (NAT_ENEMIES[a]?.includes(b)) return 'enemy';
  return 'neutral';
};

const L = (en: string, hi: string, or: string) => ({ en, hi, or });
const rajjuOf = (nak0: number) => nak0 % 5;
const gotraOf = (nak0: number) => GOTRA_NAMES[nak0 % 7];


// ==================== MAIN ENGINE ====================

/**
 * ADVANCED Kundali Milan — computes everything from TWO REAL birth charts.
 * No hardcoded sample data: moon nakshatra/sign, Mars house, dashas, houses,
 * navamsha, manglik etc. all come from the actual ephemeris charts.
 */
export function calculateAdvancedMilan(groom: BirthChartData, bride: BirthChartData): AdvancedMilanResult {
  const gNak = groom.planets.Chandra.nakshatraIndex - 1;   // 0-26
  const bNak = bride.planets.Chandra.nakshatraIndex - 1;   // 0-26
  const gSign = groom.planets.Chandra.signIndex;
  const bSign = bride.planets.Chandra.signIndex;
  const gLord = SIGN_LORDS[gSign];
  const bLord = SIGN_LORDS[bSign];

  const kootas: ExtendedKootaDetail[] = [];
  const doshaChecks: DoshaCheck[] = [];

  // ---- 1. Varna Koota (1) ----
  const varnaPts = SIGN_VARNA[gSign] <= SIGN_VARNA[bSign] ? 1 : 0;
  kootas.push({
    key: 'varna', name: L('Varna Koota', 'वर्ण कूट', 'ବର୍ଣ୍ଣ କୂଟ'),
    points: varnaPts, maxPoints: 1,
    status: varnaPts ? 'auspicious' : 'mixed',
    headline: varnaPts ? L('Ego & spiritual status harmonious', 'अहंकार एवं आध्यात्मिक सामझ', 'ଅହଂ ଓ ଆଧ୍ୟାତ୍ମିକ ସାମଞ୍ଜସ୍ୟ') : L('Moderate ego balance needed', 'मध्यम अहंकार संतुलन', 'ମଧ୍ୟମ ଅହଂ ସନ୍ତୁଳନ'),
    detail: L(`Groom: ${VARNA_NAMES[SIGN_VARNA[gSign]]} • Bride: ${VARNA_NAMES[SIGN_VARNA[bSign]]}`, `वर: ${VARNA_NAMES[SIGN_VARNA[gSign]]} • वधू: ${VARNA_NAMES[SIGN_VARNA[bSign]]}`, `ବର: ${VARNA_NAMES[SIGN_VARNA[gSign]]} • ବଧୂ: ${VARNA_NAMES[SIGN_VARNA[bSign]]}`),
  });

  // ---- 2. Vashya Koota (2) ----
  const diff = ((bSign - gSign + 12) % 12) + 1;
  const vashyaPts = (diff === 3 || diff === 11) ? 1 : 2;
  kootas.push({
    key: 'vashya', name: L('Vashya Koota', 'वश्य कूट', 'ବଶ୍ୟ କୂଟ'),
    points: vashyaPts, maxPoints: 2,
    status: vashyaPts === 2 ? 'auspicious' : 'good',
    headline: vashyaPts === 2 ? L('Strong mutual attraction & control balance', 'प्रबल आकर्षण एवं नियंत्रण संतुलन', 'ପ୍ରବଳ ଆକର୍ଷଣ ସନ୍ତୁଳନ') : L('Balanced mutual influence', 'साम्यिक पारस्परिक प्रभाव', 'ସନ୍ତୁଳିତ ପାରସ୍ପରିକ ପ୍ରଭାବ'),
    detail: L(`Moon-sign distance: ${diff}/12`, `चंद्र-राशि दूरी: ${diff}/12`, `ଚନ୍ଦ୍ର-ରାଶି ଦୂରତା: ${diff}/12`),
  });

  // ---- 3. Tara Koota (3) ----
  const countBtoG = ((gNak - bNak + 27) % 27);
  const countGtoB = ((bNak - gNak + 27) % 27);
  const taraG = TARA_NAMES[countBtoG % 9];
  const taraB = TARA_NAMES[countGtoB % 9];
  const badG = BAD_TARA.includes(taraG);
  const badB = BAD_TARA.includes(taraB);
  const taraPts = (!badG && !badB) ? 3 : (badG && badB ? 0 : 1.5);
  kootas.push({
    key: 'tara', name: L('Tara (Dina) Koota', 'तारा (दिन) कूट', 'ତାରା କୂଟ'),
    points: taraPts, maxPoints: 3,
    status: taraPts === 3 ? 'auspicious' : (taraPts === 0 ? 'dosha' : 'mixed'),
    headline: taraPts === 3 ? L('Destiny & health harmony', 'भाग्य एवं स्वास्थ्य सामझ', 'ଭାଗ୍ୟ ଓ ସ୍ୱାସ୍ଥ୍ୟ ସାମଞ୍ଜସ୍ୟ') : L('Destiny tara needs caution', 'भाग्य तारा सावधानी', 'ଭାଗ୍ୟ ତାରା ସାବଧାନତା'),
    detail: L(`Groom←Bride: ${taraG} • Bride←Groom: ${taraB}`, `वर←वधू: ${taraG} • वधू←वर: ${taraB}`, `ବର←ବଧୂ: ${taraG} • ବଧୂ←ବର: ${taraB}`),
    remedy: (badG || badB) ? L('Chant Maha Mrityunjaya & donate grains on birth-star day', 'महा मृत्युंजय जप एवं जन्म-नक्षत्र दिन दान', 'ମହା ମୃତ୍ୟୁଞ୍ଜୟ ଜପ ଓ ଜନ୍ମ-ନକ୍ଷତ୍ର ଦିନ ଦାନ') : undefined,
  });
  // ---- 4. Yoni Koota (4) ----
  const gY = NAK_YONI[gNak];
  const bY = NAK_YONI[bNak];
  const yoniEnemy = gY !== bY && (YONI_ENEMY[gY]?.includes(bY) || YONI_ENEMY[bY]?.includes(gY));
  const yoniPts = gY === bY ? 4 : yoniEnemy ? 0 : 3;
  kootas.push({
    key: 'yoni', name: L('Yoni Koota', 'योनि कूट', 'ଯୋନି କୂଟ'),
    points: yoniPts, maxPoints: 4,
    status: yoniPts === 4 ? 'auspicious' : (yoniPts === 0 ? 'dosha' : 'good'),
    headline: yoniPts === 4 ? L('Identical yoni — physical & instinctive harmony', 'समान योनि — भौतिक एवं सहज सामझ', 'ସମାନ ଯୋନି — ଭୌତିକ ସାମଞ୍ଜସ୍ୟ') : (yoniPts === 0 ? L('Yoni enmity — instinct clash', 'योनि शत्रुता — सहज टकराव', 'ଯୋନି ଶତ୍ରୁତା — ସ୍ୱାଭାବିକ ଟକର') : L('Compatible yoni animals', 'सुसंगत योनि प्राणी', 'ସୁସଙ୍ଗତ ଯୋନି ପ୍ରାଣୀ')),
    detail: L(`Groom: ${YONI_NAMES[gY]} • Bride: ${YONI_NAMES[bY]}`, `वर: ${YONI_NAMES[gY]} • वधू: ${YONI_NAMES[bY]}`, `ବର: ${YONI_NAMES[gY]} • ବଧୂ: ${YONI_NAMES[bY]}`),
    remedy: yoniPts === 0 ? L('Worship the yoni deity & avoid ego clashes on shared goals', 'योनि देवता पूजा एवं साझे लक्ष्यों पर अहंकार-टकराव टालें', 'ଯୋନି ଦେବତା ପୂଜା ଓ ସାଝା ଲକ୍ଷ୍ୟରେ ଅହଂ ଟକର ଏଡ଼ାନ୍ତୁ') : undefined,
  });

  // ---- 5. Graha Maitri Koota (5) ----
  const gf = friendStatus(gLord, bLord);
  const maitriPts = gf === 'friend' ? 5 : gf === 'neutral' ? 4 : 0;
  kootas.push({
    key: 'grahaMaitri', name: L('Graha Maitri Koota', 'ग्रह मैत्री कूट', 'ଗ୍ରହ ମୈତ୍ରୀ କୂଟ'),
    points: maitriPts, maxPoints: 5,
    status: maitriPts === 5 ? 'auspicious' : (maitriPts === 0 ? 'dosha' : 'good'),
    headline: maitriPts === 5 ? L('Mental wavelength & mutual trust', 'मानसिक तरंग एवं पारस्परिक विश्वास', 'ମାନସିକ ତରଙ୍ଗ ଓ ପାରସ୍ପରିକ ବିଶ୍ୱାସ') : (maitriPts === 0 ? L('Sign lords in enmity — outlook clash', 'राशि स्वामी शत्रु — दृष्टिकोन टकराव', 'ରାଶି ସ୍ୱାମୀ ଶତ୍ରୁ — ଦୃଷ୍ଟିକୋଣ ଟକର') : L('Neutral — workable mental sync', 'तटस्थ — कार्ययोग्य मानसिक सामझ', 'ତଟସ୍ଥ — କାର୍ଯ୍ୟଯୋଗ୍ୟ ମାନସିକ ସାମଞ୍ଜସ୍ୟ')),
    detail: L(`Groom lord: ${gLord} • Bride lord: ${bLord} • ${gf}`, `वर स्वामी: ${gLord} • वधू स्वामी: ${bLord} • ${gf}`, `ବର ସ୍ୱାମୀ: ${gLord} • ବଧୂ ସ୍ୱାମୀ: ${bLord} • ${gf}`),
    remedy: maitriPts === 0 ? L('Chant both lords Beej mantras; gift to spouse on Friday', 'दोनों स्वामियों के बीज मंत्र जपें; शुक्रवार को पति/पत्नी को उपहार', 'ଉଭୟ ସ୍ୱାମୀଙ୍କ ବୀଜ ମନ୍ତ୍ର ଜପ; ଶୁକ୍ରବାର ଉପହାର') : undefined,
  });

  // ---- 6. Gana Koota (6) ----
  const gGana = NAK_GANA[gNak];
  const bGana = NAK_GANA[bNak];
  let ganaPts = 6;
  if (gGana === bGana) ganaPts = 6;
  else if ((gGana === 0 && bGana === 1) || (gGana === 1 && bGana === 0)) ganaPts = 5;
  else ganaPts = 0;
  kootas.push({
    key: 'gana', name: L('Gana Koota', 'गण कूट', 'ଗଣ କୂଟ'),
    points: ganaPts, maxPoints: 6,
    status: ganaPts >= 5 ? 'auspicious' : 'dosha',
    headline: ganaPts >= 5 ? L('Temperament & psychological compatibility', 'स्वभाव एवं मनोवैज्ञानिक सामझ', 'ସ୍ୱଭାବ ଓ ମନୋବୈଜ୍ଞାନିକ ସାମଞ୍ଜସ୍ୟ') : L('Gana Dosha — temperament mismatch', 'गण दोष — स्वभाव असामझ', 'ଗଣ ଦୋଷ — ସ୍ୱଭାବ ଅସାମଞ୍ଜସ୍ୟ'),
    detail: L(`Groom: ${GANA_NAMES[gGana]} • Bride: ${GANA_NAMES[bGana]}`, `वर: ${GANA_NAMES[gGana]} • वधू: ${GANA_NAMES[bGana]}`, `ବର: ${GANA_NAMES[gGana]} • ବଧୂ: ${GANA_NAMES[bGana]}`),
    remedy: ganaPts === 0 ? L('Gana Dosha Puja, feed Brahmins, chant Mahamrityunjaya 11k times', 'गण दोष पूजा, ब्राह्मण भोजन, महामृत्युंजय ११००० जप', 'ଗଣ ଦୋଷ ପୂଜା, ବ୍ରାହ୍ମଣ ଭୋଜନ, ମହାମୃତ୍ୟୁଞ୍ଜୟ ୧୧୦୦୦ ଜପ') : undefined,
  });
  // ---- 7. Bhakoot Koota (7) ----
  const rel = ((bSign - gSign + 12) % 12) + 1;
  const badBhakoot = [6, 8, 2, 12, 5, 9].includes(rel);
  let bhakootPts = 7;
  let bhakootCancelled = false;
  if (badBhakoot) {
    if (gLord === bLord) { bhakootPts = 7; bhakootCancelled = true; }
    else bhakootPts = 0;
  }
  kootas.push({
    key: 'bhakoot', name: L('Bhakoot Koota', 'भकूट कूट', 'ଭକୂଟ କୂଟ'),
    points: bhakootPts, maxPoints: 7,
    status: bhakootPts === 7 ? 'auspicious' : 'dosha',
    headline: bhakootPts === 7 ? L('Domestic prosperity & emotional longevity', 'गृहस्थी समृद्धि एवं भावनात्मक दीर्घायु', 'ଗୃହସ୍ଥୀ ସମୃଦ୍ଧି ଓ ଭାବନାତ୍ମକ ଦୀର୍ଘାୟୁ') : L('Bhakoot Dosha — financial/emotional friction', 'भकूट दोष — आर्थिक/भावनात्मक घर्षण', 'ଭକୂଟ ଦୋଷ — ଆର୍ଥିକ/ଭାବନାତ୍ମକ ଘର୍ଷଣ'),
    detail: L(`Rashi distance: ${rel}/12${bhakootCancelled ? ' • cancelled (same lord)' : ''}`, `राशि दूरी: ${rel}/12${bhakootCancelled ? ' • निरसित (समान स्वामी)' : ''}`, `ରାଶି ଦୂରତା: ${rel}/12${bhakootCancelled ? ' • ବାତିଲ (ସମାନ ସ୍ୱାମୀ)' : ''}`),
    remedy: bhakootPts === 0 ? L('Vishnu Sahasranama together, donate rice & jaggery', 'विष्णु सहस्रनाम संयुक्त, चावल एवं गुड़ दान', 'ବିଷ୍ଣୁ ସହସ୍ରନାମ ଯୌଥ, ଧାନ ଓ ଗୁଡ଼ ଦାନ') : undefined,
  });

  // ---- 8. Nadi Koota (8) ----
  const gNadi = NAK_NADI[gNak];
  const bNadi = NAK_NADI[bNak];
  const sameNakPada = gNak === bNak && groom.planets.Chandra.pada === bride.planets.Chandra.pada;
  const sameSign = gSign === bSign;
  let nadiPts = 8;
  let nadiCancelled = false;
  if (gNadi === bNadi) {
    if (sameNakPada || sameSign) { nadiPts = 8; nadiCancelled = true; }
    else nadiPts = 0;
  }
  kootas.push({
    key: 'nadi', name: L('Nadi Koota', 'नाड़ी कूट', 'ନାଡ଼ି କୂଟ'),
    points: nadiPts, maxPoints: 8,
    status: nadiPts === 8 ? 'auspicious' : 'dosha',
    headline: nadiPts === 8 ? L('Health, genetics & progeny harmony', 'स्वास्थ्य, आनुवंशिक एवं संतान सामझ', 'ସ୍ୱାସ୍ଥ୍ୟ, ଆଣୁବଂଶିକ ଓ ସନ୍ତାନ ସାମଞ୍ଜସ୍ୟ') : L('Nadi Dosha — progeny & health caution', 'नाड़ी दोष — संतान एवं स्वास्थ्य सावधानी', 'ନାଡ଼ି ଦୋଷ — ସନ୍ତାନ ଓ ସ୍ୱାସ୍ଥ୍ୟ ସାବଧାନତା'),
    detail: L(`Groom: ${NADI_NAMES[gNadi]} • Bride: ${NADI_NAMES[bNadi]}${nadiCancelled ? ' • cancelled (same pada/rashi)' : ''}`, `वर: ${NADI_NAMES[gNadi]} • वधू: ${NADI_NAMES[bNadi]}${nadiCancelled ? ' • निरसित' : ''}`, `ବର: ${NADI_NAMES[gNadi]} • ବଧୂ: ${NADI_NAMES[bNadi]}${nadiCancelled ? ' • ବାତିଲ' : ''}`),
    remedy: nadiPts === 0 ? L('Nadi Dosha Nivaran Puja, Mahamrityunjaya, gold donation', 'नाड़ी दोष निवारण पूजा, महामृत्युंजय, स्वर्ण दान', 'ନାଡ଼ି ଦୋଷ ନିବାରଣ ପୂଜା, ସ୍ୱର୍ଣ୍ଣ ଦାନ') : undefined,
  });
  // ---- Totals ----
  const totalScore = kootas.reduce((s, k) => s + k.points, 0);
  const percentage = Math.round((totalScore / 36) * 100);
  const verdict: AdvancedMilanResult['verdict'] =
    totalScore >= 28 ? 'Excellent' : totalScore >= 21 ? 'Very Good' : totalScore >= 18 ? 'Average' : 'Not Recommended';

  // ---- Rajju & Vedha (classical longevity checks) ----
  const gRajju = rajjuOf(gNak);
  const bRajju = rajjuOf(bNak);
  const rajjuClash = gRajju === bRajju;
  const vedhaClash = VEDHA_PAIRS.some(([a, b]) => (gNak + 1 === a && bNak + 1 === b) || (gNak + 1 === b && bNak + 1 === a));
  const rajjuVedha = {
    rajjuGroom: RAJJU_NAMES[gRajju],
    rajjuBride: RAJJU_NAMES[bRajju],
    rajjuClash,
    vedhaClash,
    note: L(
      rajjuClash ? 'Same Rajju — classical caution for longevity; seek astrologer puja.' : vedhaClash ? 'Vedha present — mitigable with rituals.' : 'No Rajju/Vedha obstruction.',
      rajjuClash ? 'समान रज्जु — दीर्घायु हेतु सावधानी; पूजा कराएं।' : vedhaClash ? 'वेध है — विधि से शांत होता है।' : 'रज्जु/वेध बाधा नहीं।',
      rajjuClash ? 'ସମାନ ରଜ୍ଜୁ — ଦୀର୍ଘାୟୁ ସାବଧାନତା; ପୂଜା କରାନ୍ତୁ।' : vedhaClash ? 'ଭେଧ ଅଛି — ବିଧିରେ ଶାନ୍ତ ହୁଏ।' : 'ରଜ୍ଜୁ/ଭେଧ ବାଧା ନାହିଁ।',
    ),
  };

  // ---- Gotra (same-gotra = classical no-match) ----
  const gotraG = gotraOf(gNak);
  const gotraB = gotraOf(bNak);
  const sameGotra = gotraG === gotraB;
  const gotra = {
    gotraGroom: gotraG,
    gotraBride: gotraB,
    sameGotra,
    note: sameGotra
      ? L('Same Gotra — traditionally avoided; verify family lineage.', 'समान गोत्र — परंपरागत रूप से टाला गया; वंश जांचें।', 'ସମାନ ଗୋତ୍ର — ପାରମ୍ପାରିକ ଭାବେ ଏଡ଼ାଯାଏ; ବଂଶ ଯାଞ୍ଚ କରନ୍ତୁ।')
      : L('Different Gotra — acceptable for marriage.', 'भिन्न गोत्र — विवाह हेतु उचित।', 'ଭିନ୍ନ ଗୋତ୍ର — ବିବାହ ଉଚିତ।'),
  };
  const taraTiming = {
    taraGroomFromBride: taraG,
    taraBrideFromGroom: taraB,
    note: L(
      'Auspicious Tara months for ceremonies can be timed using these stars.',
      'इन ताराओं से अनुकूल तारा माह चुनें।',
      'ଏହି ତାରାଗୁଡ଼ିକ ଧାର୍ୟ କରି ଅନୁକୂଳ ତାରା ମାସ ବାଛନ୍ତୁ।',
    ),
  };
  // ---- Real Mangal Dosha from actual charts ----
  const gMangal = groom.manglik;
  const bMangal = bride.manglik;
  const mangalBalanced = gMangal.isManglik === bMangal.isManglik;
  doshaChecks.push({
    key: 'mangal', label: L('Mangal (Kuja) Dosha', 'मांगलिक दोष', 'ମାଙ୍ଗଳ ଦୋଷ'),
    active: gMangal.isManglik || bMangal.isManglik,
    cancelled: mangalBalanced || (gMangal.cancellationReasons.length > 0 && bMangal.cancellationReasons.length > 0),
    note: mangalBalanced
      ? L(`Both ${gMangal.isManglik ? 'Manglik' : 'non-Manglik'} — dosha cancels by parity. Groom: ${gMangal.severity}, Bride: ${bMangal.severity}.`, `दोनों ${gMangal.isManglik ? 'मांगलिक' : 'अमांगलिक'} — समानता से निरसित। वर: ${gMangal.severity}, वधू: ${bMangal.severity}।`, `ଉଭୟ ${gMangal.isManglik ? 'ମାଙ୍ଗଳ' : 'ଅମାଙ୍ଗଳ'} — ସମାନତାରେ ବାତିଳ।`)
      : gMangal.isManglik !== bMangal.isManglik
      ? L(`Mismatch: Groom ${gMangal.isManglik ? 'Manglik' : 'free'} (${gMangal.severity}), Bride ${bMangal.isManglik ? 'Manglik' : 'free'} (${bMangal.severity}).`, `असंगत: वर ${gMangal.isManglik ? 'मांगलिक' : 'मुक्त'}, वधू ${bMangal.isManglik ? 'मांगलिक' : 'मुक्त'}।`, `ଅସଙ୍ଗତ: ବର ${gMangal.isManglik ? 'ମାଙ୍ଗଳ' : 'ମୁକ୍ତ'}, ବଧୂ ${bMangal.isManglik ? 'ମାଙ୍ଗଳ' : 'ମୁକ୍ତ'}।`)
      : L('Both non-Manglik — clear.', 'दोनों अमांगलिक — स्पष्ट।', 'ଉଭୟ ଅମାଙ୍ଗଳ — ସ୍ପଷ୍ଟ।'),
    remedy: (gMangal.isManglik || bMangal.isManglik) && !mangalBalanced
      ? L('Kumbha Vivaha, Tuesday Hanuman Chalisa, Mangal Shanti Puja', 'कुम्भ विवाह, मंगलवार हनुमान चालीसा, मंगल शांति पूजा', 'କୁମ୍ଭ ବିବାହ, ମଙ୍ଗଳବାର ହନୁମାନ ଚାଳିସା, ମଙ୍ଗଳ ଶାନ୍ତି ପୂଜା')
      : undefined,
  });
  doshaChecks.push({ key: 'nadi', label: L('Nadi Dosha', 'नाड़ी दोष', 'ନାଡ଼ି ଦୋଷ'), active: nadiPts === 0, cancelled: nadiCancelled, note: kootas.find(k => k.key === 'nadi')!.headline, remedy: nadiPts === 0 ? L('Nadi Dosha Nivaran Puja, Mahamrityunjaya', 'नाड़ी दोष निवारण पूजा, महामृत्युंजय', 'ନାଡ଼ି ଦୋଷ ନିବାରଣ ପୂଜା') : undefined });
  doshaChecks.push({ key: 'bhakoot', label: L('Bhakoot Dosha', 'भकूट दोष', 'ଭକୂଟ ଦୋଷ'), active: bhakootPts === 0, cancelled: bhakootCancelled, note: kootas.find(k => k.key === 'bhakoot')!.headline, remedy: bhakootPts === 0 ? L('Vishnu Sahasranama, donate rice', 'विष्णु सहस्रनाम, चावल दान', 'ବିଷ୍ଣୁ ସହସ୍ରନାମ, ଧାନ ଦାନ') : undefined });
  doshaChecks.push({ key: 'gana', label: L('Gana Dosha', 'गण दोष', 'ଗଣ ଦୋଷ'), active: ganaPts === 0, cancelled: false, note: kootas.find(k => k.key === 'gana')!.headline, remedy: ganaPts === 0 ? L('Gana Dosha Puja, Mahamrityunjaya', 'गण दोष पूजा, महामृत्युंजय', 'ଗଣ ଦୋଷ ପୂଜା') : undefined });
  doshaChecks.push({ key: 'rajju', label: L('Rajju Dosha', 'रज्जु दोष', 'ରଜ୍ଜୁ ଦୋଷ'), active: rajjuClash, cancelled: false, note: rajjuVedha.note, remedy: rajjuClash ? L('Rajju Shanti Puja before wedding', 'विवाह पूर्व रज्जु शांति पूजा', 'ବିବାହପୂର୍ବ ରଜ୍ଜୁ ଶାନ୍ତି ପୂଜା') : undefined });
  doshaChecks.push({ key: 'vedha', label: L('Vedha Dosha', 'वेध दोष', 'ଭେଧ ଦୋଷ'), active: vedhaClash, cancelled: false, note: rajjuVedha.note, remedy: vedhaClash ? L('Nakshatra Shanti Homa', 'नक्षत्र शांति होम', 'ନକ୍ଷତ୍ର ଶାନ୍ତି ହୋମ') : undefined });
  doshaChecks.push({ key: 'gotra', label: L('Gotra Match', 'गोत्र मेल', 'ଗୋତ୍ର ମେଳ'), active: sameGotra, cancelled: false, note: gotra.note, remedy: sameGotra ? L('Perform Gotra Shanti; consult elders', 'गोत्र शांति करें; बड़ों से परामर्श', 'ଗୋତ୍ର ଶାନ୍ତି; ବଡ଼ମାନଙ୍କ ପରାମର୍ଶ') : undefined });
  // ---- Life-domain scores (real chart-derived, 0-100) ----
  const kScore = (key: string) => {
    const k = kootas.find(x => x.key === key);
    return k ? Math.round((k.points / k.maxPoints) * 100) : 50;
  };
  const lifeDomains: LifeDomainScore[] = [
    { key: 'love', label: L('Love & Attraction', 'प्रेम एवं आकर्षण', 'ପ୍ରେମ ଓ ଆକର୍ଷଣ'), score: Math.round((kScore('vashya') + kScore('yoni')) / 2), note: L('From Vashya + Yoni mutual pull', 'वश्य एवं योनि से', 'ବଶ୍ୟ ଓ ଯୋନିରୁ') },
    { key: 'marriage', label: L('Marriage & Bond', 'विवाह एवं बंधन', 'ବିବାହ ଓ ବନ୍ଧନ'), score: Math.round((kScore('tara') + kScore('bhakoot') + kScore('grahaMaitri')) / 3), note: L('From Tara + Bhakoot + Maitri', 'तारा + भकूट + मैत्री', 'ତାରା + ଭକୂଟ + ମୈତ୍ରୀ') },
    { key: 'health', label: L('Health & Vitality', 'स्वास्थ्य एवं जीवनशक्ति', 'ସ୍ୱାସ୍ଥ୍ୟ ଓ ଜୀବନଶକ୍ତି'), score: kScore('nadi'), note: L('From Nadi constitution', 'नाड़ी से', 'ନାଡ଼ିରୁ') },
    { key: 'wealth', label: L('Wealth & Prosperity', 'धन एवं समृद्धि', 'ଧନ ଓ ସମୃଦ୍ଧି'), score: Math.round((kScore('bhakoot') + kScore('grahaMaitri')) / 2), note: L('From Bhakoot + Maitri', 'भकूट + मैत्री', 'ଭକୂଟ + ମୈତ୍ରୀ') },
    { key: 'progeny', label: L('Progeny & Family', 'संतान एवं परिवार', 'ସନ୍ତାନ ଓ ପରିବାର'), score: Math.round((kScore('nadi') + kScore('gana')) / 2), note: L('From Nadi + Gana', 'नाड़ी + गण', 'ନାଡ଼ି + ଗଣ') },
    { key: 'family', label: L('Home Harmony', 'गृह सामझ', 'ଗୃହ ସାମଞ୍ଜସ୍ୟ'), score: kScore('gana'), note: L('From Gana temperament', 'गण से', 'ଗଣରୁ') },
    { key: 'career', label: L('Career & Growth', 'कर्म एवं वृद्धि', 'କର୍ମ ଓ ବୃଦ୍ଧି'), score: kScore('grahaMaitri'), note: L('From Graha Maitri', 'ग्रह मैत्री से', 'ଗ୍ରହ ମୈତ୍ରୀରୁ') },
    { key: 'spiritual', label: L('Spiritual Growth', 'आध्यात्मिक वृद्धि', 'ଆଧ୍ୟାତ୍ମିକ ବୃଦ୍ଧି'), score: kScore('varna'), note: L('From Varna', 'वर्ण से', 'ବର୍ଣ୍ଣରୁ') },
  ];

  // ---- Dasha sync (current running dashas) ----
  const gMd = groom.currentDasha.mahadasha;
  const bMd = bride.currentDasha.mahadasha;
  const dashaFriend = friendStatus(gMd, bMd);
  const nextTransitions: { who: 'groom' | 'bride'; date: string; to: string }[] = [];
  const gNext = groom.dashas.find(d => d.planet === gMd);
  const bNext = bride.dashas.find(d => d.planet === bMd);
  if (gNext?.endDate) nextTransitions.push({ who: 'groom', date: gNext.endDate, to: gMd });
  if (bNext?.endDate) nextTransitions.push({ who: 'bride', date: bNext.endDate, to: bMd });
  const dashaSync = {
    groomDasha: gMd,
    brideDasha: bMd,
    friendship: dashaFriend === 'friend' ? 'auspicious' as const : dashaFriend === 'enemy' ? 'dosha' as const : 'mixed' as const,
    note: L(
      `Groom running ${gMd} • Bride running ${bMd} • lords are ${dashaFriend}.`,
      `वर ${gMd} • वधू ${bMd} • स्वामी ${dashaFriend}।`,
      `ବର ${gMd} • ବଧୂ ${bMd} • ସ୍ୱାମୀ ${dashaFriend}।`,
    ),
    nextTransitions,
  };

  // ---- Muhurta guidance (real dasha + classical season) ----
  const muhurta = {
    seasonNote: L(
      'Classical vivah months favor Magha–Phalguna (winter) & Vaishakha–Jyeshtha (summer) when Jupiter is unafflicted.',
      'शास्त्रीय विवाह मास: माघ–फाल्गुन (शीत) एवं वैशाख–ज्येष्ठ (ग्रीष्म) यदि गुरु शुद्ध हो।',
      'ଶାସ୍ତ୍ରୀୟ ବିବାହ ମାସ: ମାଘ–ଫାଲ୍ଗୁନ (ଶୀତ) ଓ ବୈଶାଖ–ଜ୍ୟେଷ୍ଠ (ଗ୍ରୀଷ୍ମ) ଯେତେ ବେଳେ ଗୁରୁ ଶୁଦ୍ଧ।',
    ),
    dashaSandhiWarnings: nextTransitions.map(nt =>
      L(`${nt.who}'s current dasha ends ${nt.date} — avoid marriage within 6 months of sandhi.`, `${nt.who === 'groom' ? 'वर' : 'वधू'} की दशा समाप्ति ${nt.date} — संधि के 6 मास विवाह टालें।`, `${nt.who === 'groom' ? 'ବର' : 'ବଧୂ'}ର ଦଶା ସମାପ୍ତି ${nt.date} — ସନ୍ଧିର ୬ ମାସ ବିବାହ ଏଡ଼ାନ୍ତୁ।`)
    ),
    classicalDates: L(
      'Prefer Shukla Paksha, Monday/Wednesday/Thursday/Friday; avoid Ashtami/Chaturdashi & inauspicious tara days.',
      'शुक्ल पक्ष, सोम/बुध/गुरु/शुक्र; अष्टमी/चतुर्दशी एवं अशुभ तारा टालें।',
      'ଶୁକ୍ଳ ପକ୍ଷ, ସୋମ/ବୁଧ/ଗୁରୁ/ଶୁକ୍ର; ଅଷ୍ଟମୀ/ଚତୁର୍ଦଶୀ ଓ ଅଶୁଭ ତାରା ଏଡ଼ାନ୍ତୁ।',
    ),
  };

  // ---- Aggregate remedies (real, from active doshas) ----
  const remedies: AdvancedMilanResult['remedies'] = [];
  for (const d of doshaChecks) {
    if (d.active && !d.cancelled && d.remedy) remedies.push(d.remedy);
  }
  if (remedies.length === 0) {
    remedies.push(L('No major dosha — proceed with an auspicious muhurta and mutual respect.', 'कोई प्रमुख दोष नहीं — शुभ मुहूर्त एवं पारस्परिक सम्मान से आगे बढ़ें।', 'ପ୍ରମୁଖ ଦୋଷ ନାହିଁ — ଶୁଭ ମୁହୂର୍ତ୍ତ ଓ ପାରସ୍ପରିକ ସମ୍ମାନରେ ଆଗେବଢ଼ନ୍ତୁ।'));
  }

  // ---- Composite compatibility index (36-guna 60% + domains 40%) ----
  const domainAvg = Math.round(lifeDomains.reduce((s, d) => s + d.score, 0) / lifeDomains.length);
  const activeUncancelled = doshaChecks.filter(d => d.active && !d.cancelled).length;
  const doshaPenalty = activeUncancelled * 4;
  const compatibilityIndex = Math.max(0, Math.min(100, Math.round(percentage * 0.6 + domainAvg * 0.4 - doshaPenalty)));

  return {
    groomName: groom.nativeName,
    brideName: bride.nativeName,
    groomMoon: { nakshatra: groom.planets.Chandra.nakshatra, nakshatraIndex: groom.planets.Chandra.nakshatraIndex, sign: groom.planets.Chandra.sign, pada: groom.planets.Chandra.pada },
    brideMoon: { nakshatra: bride.planets.Chandra.nakshatra, nakshatraIndex: bride.planets.Chandra.nakshatraIndex, sign: bride.planets.Chandra.sign, pada: bride.planets.Chandra.pada },
    totalScore,
    maxScore: 36,
    percentage,
    verdict,
    kootas,
    rajjuVedha,
    gotra,
    taraTiming,
    lifeDomains,
    dashaSync,
    doshaChecks,
    compatibilityIndex,
    remedies,
    muhurta,
  };
}




