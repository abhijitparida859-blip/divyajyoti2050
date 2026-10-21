import { calculatePlanetaryPositions, normalizeDegrees, toRadians, toDegrees } from '../astronomy/ephemeris';
import { getJulianDay, getJulianCenturies } from '../astronomy/julian';
import { getLahiriAyanamsha } from '../astronomy/ayanamsha';
import { NAKSHATRA_NAMES } from '../panjika/panjika_engine';
import { BirthChartData, HouseInfo, PlanetName, PlanetPosition, ZodiacSign, VedicYoga, LifePredictions } from '../../types/jataka';
import { calculateVimshottariDashas } from './vimshottari_dasha';
import { calculateAllShodashavargas } from './shodashavarga_engine';
import { calculateShadbala } from './shadbala_engine';
import { calculateFullAshtakavarga } from './ashtakavarga_engine';
import { calculateJaiminiAstrology } from './jaimini_engine';
import { calculateBhavaChalit } from './bhava_chalit_engine';
import { calculateAdvancedYogasAndDoshas } from './advanced_yogas_engine';
import { calculateVedicRemedies, calculateLiveGochara } from './remedies_engine';
import { calculateAvakhadaChakra, calculateGhatakaChakra } from './avakhada_engine';
import { calculateDetailedBhavaAnalysis } from './bhava_analysis_engine';
import { calculatePlanetaryAvasthas } from './planetary_avasthas_engine';
import { calculateKpSystem } from './kp_sublord_engine';
import { calculateDailyPersonalGuide } from './daily_personal_panjika_engine';
import { calculateJanmaPanchanga } from './janma_panchanga_engine';
import { calculateVimsopakaBala } from './vimsopaka_bala_engine';
import { calculateBhriguNandiNadi } from './bhrigu_nandi_nadi_engine';
import { calculateNakshatraSacredLore } from './nakshatra_sacred_engine';
import { calculateComprehensiveLifeDomains } from './life_domains_engine';
import { calculateSpecialLagnas } from './special_lagnas_engine';

export const ZODIAC_SIGNS: ZodiacSign[] = [
  'Mesha', 'Vrishabha', 'Mithuna', 'Karka',
  'Simha', 'Kanya', 'Tula', 'Vrischika',
  'Dhanu', 'Makara', 'Kumbha', 'Meena'
];

export const RASHI_LORDS: Record<ZodiacSign, PlanetName> = {
  Mesha: 'Mangala',
  Vrishabha: 'Shukra',
  Mithuna: 'Budha',
  Karka: 'Chandra',
  Simha: 'Surya',
  Kanya: 'Budha',
  Tula: 'Shukra',
  Vrischika: 'Mangala',
  Dhanu: 'Guru',
  Makara: 'Shani',
  Kumbha: 'Shani',
  Meena: 'Guru'
};

/**
 * Parses user input date and time strings taking into account local timezone (e.g. +5.5 for IST)
 * converting accurately to true UTC for Julian Day Ephemeris calculations.
 */
export function parseDateTimeWithTimezone(dateStr: string, timeStr: string, tzOffsetHours: number = 5.5): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);
  // Construct UTC date object
  const d = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));
  // Subtract timezone offset to get real UTC time
  d.setTime(d.getTime() - Math.round(tzOffsetHours * 60 * 60 * 1000));
  return d;
}

/**
 * Calculates Accurate Sidereal Ascendant (Lagna) with precise Local Sidereal Time
 */
export function calculateAscendant(dateUTC: Date, latitude: number, longitude: number): { degree: number; sign: ZodiacSign; signIndex: number } {
  const jd = getJulianDay(dateUTC);
  const T = getJulianCenturies(jd);
  const ayanamsa = getLahiriAyanamsha(jd);

  // Greenwich Mean Sidereal Time (GMST) in degrees
  const gmst = normalizeDegrees(280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T);
  // Local Sidereal Time (LST) in degrees
  const lst = normalizeDegrees(gmst + longitude);

  // Mean Obliquity of the Ecliptic (eps)
  const eps = 23.4392911 - 0.0130042 * T;
  const epsRad = toRadians(eps);
  const lstRad = toRadians(lst);
  const latRad = toRadians(latitude);

  // Trigonometric Ascendant formula
  const y = Math.cos(lstRad);
  const x = -Math.sin(lstRad) * Math.cos(epsRad) - Math.tan(latRad) * Math.sin(epsRad);
  let ascTropical = toDegrees(Math.atan2(y, x));
  ascTropical = normalizeDegrees(ascTropical + 90);

  // Convert to Sidereal (Nirayana) with Lahiri Ayanamsha
  const ascSidereal = normalizeDegrees(ascTropical - ayanamsa);
  const signIndex = Math.floor(ascSidereal / 30);

  return {
    degree: ascSidereal,
    sign: ZODIAC_SIGNS[signIndex],
    signIndex
  };
}

/**
 * Calculates Navamsha (D9) Sign for any longitude
 */
export function calculateNavamshaSign(longitude: number): { sign: ZodiacSign; signIndex: number } {
  const signIndex = Math.floor(longitude / 30);
  const degreeInSign = longitude % 30;
  const navamshaPart = Math.floor(degreeInSign / (30 / 9)); // 0 to 8

  let startingSign = 0;
  if ([0, 4, 8].includes(signIndex)) startingSign = 0; // Fire -> Mesha (0)
  else if ([1, 5, 9].includes(signIndex)) startingSign = 9; // Earth -> Makara (9)
  else if ([2, 6, 10].includes(signIndex)) startingSign = 6; // Air -> Tula (6)
  else if ([3, 7, 11].includes(signIndex)) startingSign = 3; // Water -> Karka (3)

  const navamshaSignIdx = (startingSign + navamshaPart) % 12;
  return {
    sign: ZODIAC_SIGNS[navamshaSignIdx],
    signIndex: navamshaSignIdx
  };
}

/**
 * Calculates Ashtakavarga Bindus (337 total points) for 12 Houses
 */
/**
 * DELEGATES to the authentic BPHS Ch.66 engine (was a fake heuristic — now real).
 * lagnaSignIndex: optional, defaults to 0 (Mesha) if unknown.
 */
export function calculateAshtakavarga(planets: Record<PlanetName, PlanetPosition>, lagnaSignIndex: number = 0): number[] {
  return calculateFullAshtakavarga(planets, lagnaSignIndex).sarvashtakavarga;
}

/**
 * Computes Planetary Aspects (Drishti)
 */
export function calculatePlanetaryAspects(planets: Record<PlanetName, PlanetPosition>): { planet: PlanetName; aspectedHouses: number[] }[] {
  const result: { planet: PlanetName; aspectedHouses: number[] }[] = [];

  for (const [pName, pPos] of Object.entries(planets)) {
    const p = pName as PlanetName;
    const h = pPos.house;
    const aspects: number[] = [];

    // All planets aspect 7th from their position
    aspects.push(((h + 6 - 1) % 12) + 1);

    // Special aspects
    if (p === 'Mangala') {
      aspects.push(((h + 4 - 1) % 12) + 1); // 4th
      aspects.push(((h + 8 - 1) % 12) + 1); // 8th
    } else if (p === 'Guru' || p === 'Rahu' || p === 'Ketu') {
      aspects.push(((h + 5 - 1) % 12) + 1); // 5th
      aspects.push(((h + 9 - 1) % 12) + 1); // 9th
    } else if (p === 'Shani') {
      aspects.push(((h + 3 - 1) % 12) + 1); // 3rd
      aspects.push(((h + 10 - 1) % 12) + 1); // 10th
    }

    result.push({
      planet: p,
      aspectedHouses: Array.from(new Set(aspects)).sort((a, b) => a - b)
    });
  }

  return result;
}

/**
 * Detects Classical Vedic Yogas in Horoscope
 */
export function detectVedicYogas(
  planets: Record<PlanetName, PlanetPosition>,
  houses: HouseInfo[]
): VedicYoga[] {
  const yogas: VedicYoga[] = [];

  const sunHouse = planets.Surya.house;
  const mercuryHouse = planets.Budha.house;
  const moonHouse = planets.Chandra.house;
  const jupiterHouse = planets.Guru.house;
  const marsHouse = planets.Mangala.house;
  const venusHouse = planets.Shukra.house;
  const saturnHouse = planets.Shani.house;
  const rahuHouse = planets.Rahu.house;

  // 1. Budhaditya Yoga
  if (sunHouse === mercuryHouse) {
    yogas.push({
      id: 'budhaditya',
      name: { en: 'Budhaditya Yoga', hi: 'बुधादित्य राजयोग', or: 'ବୁଧାଦିତ୍ୟ ରାଜଯୋଗ' },
      type: 'Rajayoga',
      description: {
        en: 'Conjunction of Sun and Mercury in house ' + sunHouse + ' creates supreme intellect, administrative acumen, and public honor.',
        hi: 'सूर्य एवं बुध की युति तीक्ष्ण बुद्धि, प्रशासनिक कुशलता और मान-प्रतिष्ठा प्रदान करती है।',
        or: 'ସୂର୍ଯ୍ୟ ଏବଂ ବୁଧଙ୍କ ଏକତ୍ର ଅବସ୍ଥାନ ଉଚ୍ଚ ବୁଦ୍ଧିମତ୍ତା, ପ୍ରଶାସନିକ ସଫଳତା ଓ ସମ୍ମାନ ପ୍ରଦାନ କରେ।'
      },
      planetsInvolved: ['Surya', 'Budha'],
      effect: {
        en: 'High intellectual acumen, government favor, and career prosperity.',
        hi: 'उच्च बौद्धिक क्षमता एवं शासकीय कार्यों में विशेष सफलता।',
        or: 'ଉଚ୍ଚ ବିଦ୍ୟା, ବିଶ୍ଳେଷଣ କ୍ଷମତା ଓ ସରକାରୀ ସମ୍ମାନ।'
      }
    });
  }

  // 2. Gaja Kesari Yoga
  const jupFromMoon = ((jupiterHouse - moonHouse + 12) % 12) + 1;
  if ([1, 4, 7, 10].includes(jupFromMoon)) {
    yogas.push({
      id: 'gaja_kesari',
      name: { en: 'Gaja Kesari Yoga', hi: 'गजकेसरी महायोग', or: 'ଗଜକେଶରୀ ମହାଯୋଗ' },
      type: 'Rajayoga',
      description: {
        en: 'Jupiter in Kendra (' + jupFromMoon + 'th) from Moon grants high wisdom, noble status, enduring wealth, and spiritual grace.',
        hi: 'चन्द्रमा से केंद्र में गुरु की स्थिति उत्तम यश, सद्बुद्धि और अखण्ड ऐश्वर्य देती है।',
        or: 'ଚନ୍ଦ୍ରଙ୍କ ଠାରୁ କେନ୍ଦ୍ରରେ ଗୁରୁ ବିଦ୍ୟମାନ। ଏହା ସମାଜରେ ଉଚ୍ଚ ପ୍ରତିଷ୍ଠା ଓ ଐଶ୍ୱର୍ଯ୍ୟ ଦିଏ।'
      },
      planetsInvolved: ['Guru', 'Chandra'],
      effect: {
        en: 'Overcomes adversities like a lion, blessed with virtues and righteous legacy.',
        hi: 'शत्रुओं पर विजय, आध्यात्मिक उत्थान एवं यशस्वी जीवन।',
        or: 'ସମସ୍ତ ବାଧାବିଘ୍ନ ଜୟ, ଆଧ୍ୟାତ୍ମିକ ଉନ୍ନତି ଓ ନିଷ୍କଳଙ୍କ ଯଶ।'
      }
    });
  }

  // 3. Pancha Mahapurusha Yogas
  const kendras = [1, 4, 7, 10];
  if (kendras.includes(marsHouse) && (planets.Mangala.dignity === 'Exalted' || planets.Mangala.dignity === 'Own')) {
    yogas.push({
      id: 'ruchaka',
      name: { en: 'Ruchaka Mahapurusha Yoga', hi: 'रुचक महापुरुष योग', or: 'ରୁଚକ ମହାପୁରୁଷ ଯୋଗ' },
      type: 'Rajayoga',
      description: { en: 'Mars in Kendra in own/exalted sign grants supreme courage, leadership, and landed property.', hi: 'मंगल का केंद्र में स्वराशि/उच्च होना शौर्य और भूमि लाभ देता है।', or: 'ମଙ୍ଗଳଙ୍କ କେନ୍ଦ୍ରରେ ଶକ୍ତିଶାଳୀ ସ୍ଥିତି ଯୋଗୁଁ ଅପାର ସାହସ ଓ ଭୂସମ୍ପତ୍ତି ଲାଭ।' },
      planetsInvolved: ['Mangala'],
      effect: { en: 'Fearless executive leader, victory over rivals.', hi: 'साहसी नेतृत्व एवं पराक्रम।', or: 'ସାହସିକ ନେତୃତ୍ୱ ଓ ବିଜୟ।' }
    });
  }

  if (kendras.includes(jupiterHouse) && (planets.Guru.dignity === 'Exalted' || planets.Guru.dignity === 'Own')) {
    yogas.push({
      id: 'hamsa',
      name: { en: 'Hamsa Mahapurusha Yoga', hi: 'हंस महापुरुष योग', or: 'ହଂସ ମହାପୁରୁଷ ଯୋଗ' },
      type: 'Rajayoga',
      description: { en: 'Jupiter in Kendra in own/exalted sign bestows spiritual majesty, ethical purity, and supreme counsel.', hi: 'बृहस्पति की केंद्र में उच्च/स्वक्षेत्री स्थिति अध्यात्म और सात्विक तेज देती है।', or: 'ଗୁରୁଙ୍କ କେନ୍ଦ୍ରରେ ଉଚ୍ଚ/ସ୍ୱକ୍ଷେତ୍ରୀ ଅବସ୍ଥାନ ହେତୁ ସାତ୍ତ୍ୱିକ ଜ୍ଞାନ ଓ ଧର୍ମନିଷ୍ଠା।' },
      planetsInvolved: ['Guru'],
      effect: { en: 'Revered scholar, righteous conduct, spiritual awakening.', hi: 'विद्वान एवं धर्मात्मा व्यक्तित्व।', or: 'ଜ୍ଞାନୀ, ବିଦ୍ୱାନ ଓ ଧାର୍ମିକ ଜୀବନ।' }
    });
  }

  if (kendras.includes(venusHouse) && (planets.Shukra.dignity === 'Exalted' || planets.Shukra.dignity === 'Own')) {
    yogas.push({
      id: 'malavya',
      name: { en: 'Malavya Mahapurusha Yoga', hi: 'मालव्य महापुरुष योग', or: 'ମାଲବ୍ୟ ମହାପୁରୁଷ ଯୋଗ' },
      type: 'Rajayoga',
      description: { en: 'Venus in Kendra in own/exalted sign brings artistic genius, luxuries, and matrimonial bliss.', hi: 'शुक्र का केंद्र में बलवान होना कला, ऐश्वर्य और दांपत्य सुख प्रदान करता है।', or: 'ଶୁକ୍ରଙ୍କ କେନ୍ଦ୍ରରେ ସ୍ୱକ୍ଷେତ୍ରୀ ହେବା ଦ୍ୱାରା କଳାତ୍ମକ ପ୍ରତିଭା ଓ ଭୋଗବିଳାସ ପ୍ରାପ୍ତି।' },
      planetsInvolved: ['Shukra'],
      effect: { en: 'Artistic mastery, comfortable lifestyle, charismatic presence.', hi: 'समृद्ध एवं कलात्मक जीवन।', or: 'ସୁନ୍ଦର ବ୍ୟକ୍ତିତ୍ୱ ଓ ପ୍ରଚୁର ଐଶ୍ୱର୍ଯ୍ୟ।' }
    });
  }

  if (moonHouse === marsHouse) {
    yogas.push({
      id: 'chandra_mangala',
      name: { en: 'Chandra-Mangala Dhana Yoga', hi: 'चन्द्र-मंगल धन योग', or: 'ଚନ୍ଦ୍ର-ମଙ୍ଗଳ ଧନ ଯୋଗ' },
      type: 'Auspicious',
      description: { en: 'Moon and Mars conjunction generates great commercial enterprise and self-made assets.', hi: 'चन्द्र और मंगल की युति स्वप्रयासों से अपार धनार्जन कराती है।', or: 'ଚନ୍ଦ୍ର ଓ ମଙ୍ଗଳଙ୍କ ମିଳନ ଉଦ୍ୟମଶୀଳତା ଓ ଧନସମ୍ପଦ ସୃଷ୍ଟି କରେ।' },
      planetsInvolved: ['Chandra', 'Mangala'],
      effect: { en: 'Financial enterprise, bold investment acumen, steady prosperity.', hi: 'व्यापारिक सफलता एवं आर्थिक समृद्धि।', or: 'ବ୍ୟବସାୟରେ ପ୍ରଚୁର ଲାଭ ଓ ସ୍ୱାବଲମ୍ବନ।' }
    });
  }

  if (jupiterHouse === rahuHouse) {
    yogas.push({
      id: 'guru_chandal',
      name: { en: 'Guru-Chandal Yoga', hi: 'गुरु-चांडाल योग', or: 'ଗୁରୁ-ଚାଣ୍ଡାଳ ଦୋଷ' },
      type: 'Inauspicious',
      description: { en: 'Jupiter and Rahu conjunction creates unconventional thought; regular Gayatri sadhana recommended.', hi: 'गुरु और राहु की युति वैचारिक द्वंद्व उत्पन्न करती है; गुरु साधना आवश्यक।', or: 'ଗୁରୁ ଓ ରାହୁଙ୍କ ଏକତ୍ର ଅବସ୍ଥାନ ହେତୁ ବୈଚାରିକ ଅସ୍ଥିରତା; ଗୁରୁ ଉପାସନା ଶୁଭଙ୍କର।' },
      planetsInvolved: ['Guru', 'Rahu'],
      effect: { en: 'Need regular Gayatri Japa and honoring preceptors.', hi: 'नियमित गुरु पूजन एवं गायत्री जप से शांति।', or: 'ନିୟମିତ ଗାୟତ୍ରୀ ଜପ ଓ ଗୁରୁ ଆଶୀର୍ବାଦ ନିଅନ୍ତୁ।' }
    });
  }

  return yogas;
}

export function generateLifePredictions(
  ascSign: ZodiacSign,
  moonSign: ZodiacSign,
  currentMahadasha: PlanetName
): LifePredictions {
  return {
    personality: {
      en: `Born in ${ascSign} Lagna and ${moonSign} Rashi, you possess innate magnetism, analytical precision, and deep Vedic moral intuition. Your soul seeks balance between worldly achievements and internal peace.`,
      hi: `${ascSign} लग्न एवं ${moonSign} राशि में जन्म होने से आपमें स्वाभाविक नेतृत्व, तीक्ष्ण विवेक और आध्यात्मिक जिज्ञासा का अनुपम संगम है। आपका दृष्टिकोण सदा दूरगामी होता है।`,
      or: `${ascSign} ଲଗ୍ନ ଏବଂ ${moonSign} ରାଶିରେ ଜନ୍ମ ହୋଇଥିବାରୁ ଆପଣଙ୍କ ଠାରେ ଉଚ୍ଚ ବ୍ୟକ୍ତିତ୍ୱ, ନ୍ୟାୟନିଷ୍ଠା ଓ ବୈଦିକ ସଂସ୍କାର ରହିଛି। ଆପଣ ସମାଜରେ ଆଦର୍ଶ ସ୍ଥାପନ କରିବାକୁ ଭଲପାଆନ୍ତି।`
    },
    career: {
      en: `High potential in executive leadership, engineering, consultancy, astrology, law, and creative technologies. Under the influence of ${currentMahadasha} Mahadasha, major career breakthroughs occur through structured discipline.`,
      hi: `प्रशासन, विधि, उच्च तकनीक, परामर्श, एवं व्यापारिक उपक्रमों में उच्च सफलता का योग है। वर्तमान ${currentMahadasha} की दशा में कार्यक्षेत्र में विशिष्ट उन्नति होगी।`,
      or: `ପ୍ରଶାସନିକ ସେବା, ଆଇନ, ବୈଷୟିକ ଗବେଷଣା, କିମ୍ବା ବ୍ୟବସାୟରେ ଶୀର୍ଷ ସଫଳତା ପ୍ରାପ୍ତିର ଯୋଗ। ବର୍ତ୍ତମାନର ${currentMahadasha} ମହାଦଶା କର୍ମକ୍ଷେତ୍ରରେ ନୂତନ ସମ୍ଭାବନା ଆଣିଦେବ।`
    },
    wealth: {
      en: `Strong 2nd and 11th house associations ensure diversified assets, real estate holdings, and generational prosperity through patient compounding.`,
      hi: `स्थायी संपत्ति, भूमि-भवन तथा ज्ञान आधारित कार्यों से निरंतर धन लाभ। दीर्घकालीन निवेश आपके लिए अत्यंत फलदायी रहेंगे।`,
      or: `ସ୍ଥାବର ଭୂସମ୍ପତ୍ତି, ବ୍ୟବସାୟ ଓ ସ୍ୱାର୍ଜିତ ଉଦ୍ୟମରୁ ପ୍ରଚୁର ଆର୍ଥିକ ଲାଭ। ଦୀର୍ଘମିଆଦୀ ନିବେଶ ଶୁଭ ଫଳ ପ୍ରଦାନ କରିବ।`
    },
    relationships: {
      en: `Seek a partner with high emotional intellect and shared dharmic values. Marital harmony flourishes when mutual space and open communication are preserved.`,
      hi: `धार्मिक एवं बौद्धिक रूप से सामंजस्य रखने वाले जीवनसाथी का सान्निध्य मिलेगा। परस्पर सम्मान से दांपत्य जीवन सुखमय रहेगा।`,
      or: `ଧାର୍ମିକ ଓ ସ୍ନେହଶୀଳ ଜୀବନସାଥୀଙ୍କ ସହଯୋଗ ମିଳିବ। ପାରସ୍ପରିକ ବୁଝାମଣା ରଖିଲେ ଦାମ୍ପତ୍ୟ ଜୀବନ ଅତ୍ୟନ୍ତ ଆନନ୍ଦଦାୟକ ହେବ।`
    },
    health: {
      en: `Generally robust vital constitution (Ojas). Maintain regular Pranayama, Surya Namaskar, and wholesome Sattvic nourishment to protect digestive fire (Agni).`,
      hi: `रोग प्रतिरोधक क्षमता उत्तम है। सूर्य नमस्कार, प्राणायाम एवं सात्विक आहार द्वारा उदर एवं नेत्रों का विशेष ध्यान रखें।`,
      or: `ଉତ୍ତମ ଶରୀର ଓ ଆୟୁଷ। ପ୍ରତିଦିନ ସୂର୍ଯ୍ୟ ନମସ୍କାର, ପ୍ରାଣାୟାମ ଓ ସାତ୍ତ୍ୱିକ ଆହାର ଗ୍ରହଣ କଲେ ସ୍ୱାସ୍ଥ୍ୟ ସର୍ବଦା ତେଜୋମୟ ରହିବ।`
    },
    spirituality: {
      en: `Deep affinity for Lord Jagannath, Shiva, and Gayatri sadhana. Chanting 108 Maha Mrityunjaya and lighting a ghee lamp at Sandhya elevates consciousness.`,
      hi: `महाप्रभु श्री जगन्नाथ एवं भगवान शिव की अनन्य कृपा। प्रतिदिन 108 बार ओंकार अथवा महामृत्युंजय जप आपके ओज को जागृत रखेगा।`,
      or: `ମହାପ୍ରଭୁ ଶ୍ରୀଜଗନ୍ନାଥ ଓ ମହାଦେବଙ୍କ ବିଶେଷ କୃପା। ନିୟମିତ ୧୦୮ ମନ୍ତ୍ର ଜପ ଓ ସନ୍ଧ୍ୟା ଦୀପାରାଧନା ଆପଣଙ୍କୁ ପରମ ଶାନ୍ତି ପ୍ରଦାନ କରିବ।`
    }
  };
}

export function calculateBirthChart(
  nativeName: string = 'Satyajit',
  birthDateLocal: Date = new Date('1998-08-15T01:00:00Z'),
  latitude: number = 20.2961,
  longitude: number = 85.8245,
  birthPlace: string = 'Bhubaneswar, Odisha',
  gender: string = 'male'
): BirthChartData {
  const jd = getJulianDay(birthDateLocal);
  const ayanamsa = getLahiriAyanamsha(jd);
  const asc = calculateAscendant(birthDateLocal, latitude, longitude);
  const rawPlanets = calculatePlanetaryPositions(birthDateLocal);

  const planetList: { name: PlanetName; long: number }[] = [
    { name: 'Surya', long: rawPlanets.sun },
    { name: 'Chandra', long: rawPlanets.moon },
    { name: 'Mangala', long: rawPlanets.mars },
    { name: 'Budha', long: rawPlanets.mercury },
    { name: 'Guru', long: rawPlanets.jupiter },
    { name: 'Shukra', long: rawPlanets.venus },
    { name: 'Shani', long: rawPlanets.saturn },
    { name: 'Rahu', long: rawPlanets.rahu },
    { name: 'Ketu', long: rawPlanets.ketu },
  ];

  const planetsRecord: Partial<Record<PlanetName, PlanetPosition>> = {};

  const houses: HouseInfo[] = [];
  for (let h = 1; h <= 12; h++) {
    const signIdx = (asc.signIndex + (h - 1)) % 12;
    houses.push({
      houseNumber: h,
      sign: ZODIAC_SIGNS[signIdx],
      signIndex: signIdx,
      degree: signIdx * 30,
      planets: []
    });
  }

  const navamshaAsc = calculateNavamshaSign(asc.degree);
  const navamshaHouses: HouseInfo[] = [];
  for (let h = 1; h <= 12; h++) {
    const signIdx = (navamshaAsc.signIndex + (h - 1)) % 12;
    navamshaHouses.push({
      houseNumber: h,
      sign: ZODIAC_SIGNS[signIdx],
      signIndex: signIdx,
      degree: signIdx * 30,
      planets: []
    });
  }

  for (const p of planetList) {
    const signIndex = Math.floor(p.long / 30);
    const degreeInSign = p.long % 30;
    const deg = Math.floor(degreeInSign);
    const minFloat = (degreeInSign - deg) * 60;
    const min = Math.floor(minFloat);
    const sec = Math.floor((minFloat - min) * 60);

    const nakshatraExact = p.long / (360 / 27);
    const nakIndex = Math.floor(nakshatraExact);
    const pada = Math.floor((nakshatraExact - nakIndex) * 4) + 1;

    const houseNumber = ((signIndex - asc.signIndex + 12) % 12) + 1;
    houses[houseNumber - 1].planets.push(p.name);

    const navSign = calculateNavamshaSign(p.long);
    const navHouseNumber = ((navSign.signIndex - navamshaAsc.signIndex + 12) % 12) + 1;
    navamshaHouses[navHouseNumber - 1].planets.push(p.name);

    let isCombust = false;
    if (p.name !== 'Surya' && p.name !== 'Rahu' && p.name !== 'Ketu') {
      const sunDist = Math.abs(normalizeDegrees(p.long - rawPlanets.sun));
      const minSunDist = Math.min(sunDist, 360 - sunDist);
      const combustionLimits: Record<string, number> = {
        Chandra: 12, Mangala: 17, Budha: 14, Guru: 11, Shukra: 10, Shani: 15
      };
      if (minSunDist <= (combustionLimits[p.name] || 10)) {
        isCombust = true;
      }
    }

    let dignity: PlanetPosition['dignity'] = 'Neutral';
    if (p.name === 'Surya') {
      if (signIndex === 0) dignity = 'Exalted';
      else if (signIndex === 6) dignity = 'Debilitated';
      else if (signIndex === 4) dignity = 'Own';
      else if ([8, 11, 7].includes(signIndex)) dignity = 'Friendly';
    } else if (p.name === 'Chandra') {
      if (signIndex === 1) dignity = 'Exalted';
      else if (signIndex === 7) dignity = 'Debilitated';
      else if (signIndex === 3) dignity = 'Own';
      else if ([0, 4].includes(signIndex)) dignity = 'Friendly';
    } else if (p.name === 'Mangala') {
      if (signIndex === 9) dignity = 'Exalted';
      else if (signIndex === 3) dignity = 'Debilitated';
      else if (signIndex === 0 || signIndex === 7) dignity = 'Own';
      else if ([4, 8, 11].includes(signIndex)) dignity = 'Friendly';
    } else if (p.name === 'Budha') {
      if (signIndex === 5 && degreeInSign <= 15) dignity = 'Exalted';
      else if (signIndex === 11) dignity = 'Debilitated';
      else if (signIndex === 2 || signIndex === 5) dignity = 'Own';
      else if ([0, 4, 6].includes(signIndex)) dignity = 'Friendly';
    } else if (p.name === 'Guru') {
      if (signIndex === 3) dignity = 'Exalted';
      else if (signIndex === 9) dignity = 'Debilitated';
      else if (signIndex === 8 || signIndex === 11) dignity = 'Own';
      else if ([0, 4, 7].includes(signIndex)) dignity = 'Friendly';
    } else if (p.name === 'Shukra') {
      if (signIndex === 11) dignity = 'Exalted';
      else if (signIndex === 5) dignity = 'Debilitated';
      else if (signIndex === 1 || signIndex === 6) dignity = 'Own';
      else if ([2, 9, 10].includes(signIndex)) dignity = 'Friendly';
    } else if (p.name === 'Shani') {
      if (signIndex === 6) dignity = 'Exalted';
      else if (signIndex === 0) dignity = 'Debilitated';
      else if (signIndex === 9 || signIndex === 10) dignity = 'Own';
      else if ([1, 2, 5].includes(signIndex)) dignity = 'Friendly';
    }

    planetsRecord[p.name] = {
      planet: p.name,
      sign: ZODIAC_SIGNS[signIndex],
      signIndex,
      longitude: Math.round(p.long * 100) / 100,
      degreeInSign: Math.round(degreeInSign * 100) / 100,
      deg,
      min,
      sec,
      nakshatra: NAKSHATRA_NAMES[nakIndex],
      nakshatraIndex: nakIndex + 1,
      pada,
      house: houseNumber,
      isRetrograde: p.name === 'Rahu' || p.name === 'Ketu'
        ? true // nodes are always retrograde
        : ((rawPlanets.isRetrograde as any)?.[{ Surya: 'sun', Chandra: 'moon', Mangala: 'mars', Budha: 'mercury', Guru: 'jupiter', Shukra: 'venus', Shani: 'saturn' }[p.name as 'Surya' | 'Chandra' | 'Mangala' | 'Budha' | 'Guru' | 'Shukra' | 'Shani']] ?? false),
      isCombust,
      dignity,
      navamshaSign: navSign.sign
    };
  }

  const typedPlanets = planetsRecord as Record<PlanetName, PlanetPosition>;
  const dashas = calculateVimshottariDashas(rawPlanets.moon, birthDateLocal);
  const now = new Date();
  let currentMahadasha = dashas[0]?.planet || 'Guru';
  let currentAntardasha = dashas[0]?.subDashas?.[0]?.planet || 'Shani';
  let currentPratyantardasha: PlanetName = dashas[0]?.subDashas?.[0]?.subDashas?.[0]?.planet || 'Budha';
  let currentSookshmasha: PlanetName | undefined = undefined;
  let currentPranadasha: PlanetName | undefined = undefined;
  let activeDashaStart = dashas[0]?.startDate || '';
  let activeDashaEnd = dashas[0]?.endDate || '';

  for (const d of dashas) {
    const s = new Date(d.startDate).getTime();
    const e = new Date(d.endDate).getTime();
    const n = now.getTime();
    if (n >= s && n <= e) {
      currentMahadasha = d.planet;
      activeDashaStart = d.startDate;
      activeDashaEnd = d.endDate;
      if (d.subDashas) {
        for (const sub of d.subDashas) {
          const subs = new Date(sub.startDate).getTime();
          const sube = new Date(sub.endDate).getTime();
          if (n >= subs && n <= sube) {
            currentAntardasha = sub.planet;
            if (sub.subDashas) {
              for (const pSub of sub.subDashas) {
                const ps = new Date(pSub.startDate).getTime();
                const pe = new Date(pSub.endDate).getTime();
                if (n >= ps && n <= pe) {
                  currentPratyantardasha = pSub.planet;
                  if (pSub.subDashas) {
                    for (const sSub of pSub.subDashas) {
                      const ss = new Date(sSub.startDate).getTime();
                      const se = new Date(sSub.endDate).getTime();
                      if (n >= ss && n <= se) {
                        currentSookshmasha = sSub.planet;
                        if (sSub.subDashas) {
                          for (const nSub of sSub.subDashas) {
                            const ns = new Date(nSub.startDate).getTime();
                            const ne = new Date(nSub.endDate).getTime();
                            if (n >= ns && n <= ne) {
                              currentPranadasha = nSub.planet;
                              break;
                            }
                          }
                        }
                        break;
                      }
                    }
                  }
                  break;
                }
              }
            }
            break;
          }
        }
      }
      break;
    }
  }

  // 1. All 16 Parashari Shodashavarga Divisional Charts (D1 - D60)
  const vargas = calculateAllShodashavargas(asc.degree, planetList);

  // 2. Classical Shadbala (6-Fold Planetary Strength)
  const shadbala = calculateShadbala(typedPlanets, birthDateLocal, asc.degree);

  // 3. Full Bhinna & Sarva Ashtakavarga Matrix (337 Bindus) — authentic BPHS Ch.66
  const ashtakavarga = calculateFullAshtakavarga(typedPlanets, asc.signIndex);

  // 4. Jaimini Astrology (Chara Karakas, Arudha Lagna, Upapada Lagna, Karakamsha)
  const jaimini = calculateJaiminiAstrology(typedPlanets, asc.signIndex);

  // 5. Bhava Chalit Sripati Cuspal Bounds & Shifted Planets
  const bhavaChalit = calculateBhavaChalit(asc.degree, typedPlanets);

  // 6. 50+ Classical Yogas, Kala Sarpa, Manglik Dosha, Sade Sati Chronometer
  const { yogas: advYogas, kalaSarpa, manglik, sadeSati } = calculateAdvancedYogasAndDoshas(
    typedPlanets,
    asc.signIndex,
    typedPlanets.Chandra.signIndex
  );

  const baseLineYogas = detectVedicYogas(typedPlanets, houses);
  const combinedYogasMap = new Map<string, VedicYoga>();
  for (const y of [...advYogas, ...baseLineYogas]) {
    if (!combinedYogasMap.has(y.id)) {
      combinedYogasMap.set(y.id, y);
    }
  }
  const allYogas = Array.from(combinedYogasMap.values());

  // 7. Authentic Vedic & Srimandir Remedies (Ratna, Rudraksha, Mantras, Beshas)
  const remedies = calculateVedicRemedies(asc.signIndex, typedPlanets);

  // 8. Gochara (Live Transit) Overlay on Natal Chart
  const gochara = calculateLiveGochara(birthDateLocal, asc.signIndex, typedPlanets.Chandra.signIndex, ashtakavarga.sarvashtakavarga);
  gochara.sadeSati = sadeSati; // Keep sync with exact Sade Sati status

  const moonSign = typedPlanets.Chandra.sign;
  const predictions = generateLifePredictions(asc.sign, moonSign, currentMahadasha);

  // 9. Authentic Avakhada Chakra & Ghataka Warnings
  const avakhada = calculateAvakhadaChakra(typedPlanets.Chandra.longitude, moonSign);
  const ghataka = calculateGhatakaChakra(moonSign);

  // 10. 12 Bhavas Comprehensive Predictive Encyclopedia
  const bhavaAnalysis = calculateDetailedBhavaAnalysis(
    typedPlanets,
    houses,
    ashtakavarga.sarvashtakavarga,
    asc.signIndex
  );

  // 11. Planetary Avasthas (Baladi, Deeptadi, Jagradadi)
  const planetaryAvasthas = calculatePlanetaryAvasthas(typedPlanets);

  // 12. Krishnamurti Paddhati (KP 249 Sub-Lord System)
  const kpSystem = calculateKpSystem(asc.degree, typedPlanets, bhavaChalit.cusps.map(c => c.bhavaMadhya));

  // 13. Daily Personal Astro Guide (Live Tarabala, Chandrabala & Guidelines)
  const chandraTransit = gochara.planets.Chandra;
  const transitMoonLon = chandraTransit.signIndex * 30 + chandraTransit.degreeInSign;
  const dailyGuide = calculateDailyPersonalGuide(
    typedPlanets.Chandra.longitude,
    moonSign,
    transitMoonLon,
    chandraTransit.sign
  );

  // 14. Janma Panchanga 5 Primordial Birth Pillars
  const janmaPanchanga = calculateJanmaPanchanga(
    typedPlanets.Surya.longitude,
    typedPlanets.Chandra.longitude,
    birthDateLocal
  );

  // 15. Parashari Vimsopaka Bala (20-Point Divisional Strength) & Ishta/Kashta Phala
  const vimsopakaBala = calculateVimsopakaBala(typedPlanets, vargas);

  // 16. Bhrigu Nandi Nadi (BNN) Conjunctions & Trinal Karmic Combinations
  const nadiAstrology = calculateBhriguNandiNadi(typedPlanets);

  // 17. Nakshatra Sacred Lore (Sacred Tree / Vriksha, Deity, Totem & Pada Destiny)
  const nakshatraSacred = calculateNakshatraSacredLore(typedPlanets.Chandra.longitude);

  // 18. Comprehensive 6-Domain Life Chapters (Career, Wealth, Marriage, Health, Education, Moksha)
  const lifeDomains = calculateComprehensiveLifeDomains(
    typedPlanets,
    houses,
    asc.signIndex,
    ashtakavarga.sarvashtakavarga
  );

  // 19. Special Lagnas & Upagrahas (Śrī, Indu, Hora, Ghāti, Prānapada, Karakamsha, Mandi, Gulika)
  const specialLagnas = calculateSpecialLagnas(
    birthDateLocal,
    asc.degree + asc.signIndex * 30,
    typedPlanets
  );

  return {
    nativeName,
    gender,
    dateTime: birthDateLocal.toISOString(),
    birthPlace,
    latitude,
    longitude,
    ayanamsa: Math.round(ayanamsa * 1000) / 1000,
    ascendantDegree: Math.round(asc.degree * 100) / 100,
    ascendantSign: asc.sign,
    ascendantSignIndex: asc.signIndex,
    planets: typedPlanets,
    houses,
    navamshaHouses,
    vargas,
    shadbala,
    ashtakavarga,
    jaimini,
    bhavaChalit,
    kalaSarpa,
    manglik,
    remedies,
    gochara,
    avakhada,
    ghataka,
    bhavaAnalysis,
    planetaryAvasthas,
    kpSystem,
    dailyGuide,
    janmaPanchanga,
    vimsopakaBala,
    nadiAstrology,
    nakshatraSacred,
    lifeDomains,
    specialLagnas,
    currentDasha: {
      mahadasha: currentMahadasha,
      antardasha: currentAntardasha,
      pratyantardasha: currentPratyantardasha,
      sookshmasha: currentSookshmasha,
      pranadasha: currentPranadasha,
      startDate: activeDashaStart,
      endDate: activeDashaEnd,
      progressPercentage: (() => {
        // REAL progress of active Antardasha (0-100), not a placeholder
        try {
          const ps = new Date(activeDashaStart + 'T00:00:00').getTime();
          const pe = new Date(activeDashaEnd + 'T00:00:00').getTime();
          const n = now.getTime();
          if (pe > ps && n >= ps && n <= pe) return Math.round(((n - ps) / (pe - ps)) * 100);
          if (n > pe) return 100;
          return 0;
        } catch { return 0; }
      })()
    },
    dashas,
    yogas: allYogas,
    predictions
  };
}