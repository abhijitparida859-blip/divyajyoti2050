import {
  PlanetName,
  PlanetPosition,
  ZodiacSign,
  SpecialLagnasData,
  SpecialLagnaItem,
  InduLagnaDetails,
  UpagrahaItem
} from '../../types/jataka';
import { ZODIAC_SIGNS } from './kundali_engine';

const SIGN_LORDS: Record<ZodiacSign, PlanetName> = {
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

const PLANET_RAYS: Record<PlanetName, number> = {
  Surya: 30,
  Chandra: 16,
  Mangala: 6,
  Budha: 8,
  Guru: 10,
  Shukra: 12,
  Shani: 1,
  Rahu: 0,
  Ketu: 0
};

function normalizeDegrees(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

export function calculateSpecialLagnas(
  birthDate: Date,
  ascendantLongitude: number,
  planets: Record<PlanetName, PlanetPosition>,
  sunriseMinutes: number = 330 // approx 05:30 AM (330 min from midnight)
): SpecialLagnasData {
  const ascSignIndex = Math.floor(ascendantLongitude / 30);
  const ascDegreeInSign = ascendantLongitude % 30;

  const sunLong = planets.Surya ? planets.Surya.longitude : 120;
  const moonLong = planets.Chandra ? planets.Chandra.longitude : 30;
  const moonSignIndex = Math.floor(moonLong / 30);
  const moonDegreeInSign = moonLong % 30;

  // 1. Śrī Lagna (Sri Lagna - Prosperity & Lakshmi Kripa)
  // Moon nakshatra fraction multiplied by 360 added to Lagna
  const moonNakFraction = (moonLong % (360 / 27)) / (360 / 27);
  const sriLagnaLong = normalizeDegrees(ascendantLongitude + moonNakFraction * 360);
  const sriSignIndex = Math.floor(sriLagnaLong / 30);
  const sriSign = ZODIAC_SIGNS[sriSignIndex];
  const sriDegreeInSign = Number((sriLagnaLong % 30).toFixed(2));
  const sriHouse = ((sriSignIndex - ascSignIndex + 12) % 12) + 1;

  const sriLagna: SpecialLagnaItem = {
    id: 'sriLagna',
    name: {
      en: 'Śrī Lagna (Prosperity Lagna)',
      hi: 'श्री लग्न (महालक्ष्मी कृपा लग्न)',
      or: 'ଶ୍ରୀ ଲଗ୍ନ (ଧନ ଓ ମା’ ଲକ୍ଷ୍ମୀ କୃପା)'
    },
    shortName: 'SL',
    sign: sriSign,
    degreeInSign: sriDegreeInSign,
    house: sriHouse,
    signLord: SIGN_LORDS[sriSign],
    significance: {
      en: 'Points to innate prosperity, economic stability, and blessings of Goddess Mahalakshmi.',
      hi: 'जन्मजात समृद्धि, आर्थिक स्थिरता एवं माता महालक्ष्मी की विशेष कृपा का प्रतीक।',
      or: 'ଜନ୍ମଜାତ ସମୃଦ୍ଧି, ଆର୍ଥିକ ସ୍ଥିରତା ଓ ମା’ ମହାଲକ୍ଷ୍ମୀଙ୍କ ଅପାର କୃପାର ପ୍ରତୀକ।'
    },
    prediction: {
      en: `Śrī Lagna placed in ${sriSign} (House ${sriHouse}) governed by ${SIGN_LORDS[sriSign]}. Indicates strong financial fortune through perseverance.`,
      hi: `श्री लग्न ${sriSign} राशि (भाव ${sriHouse}) में स्थित है जिसके स्वामी ${SIGN_LORDS[sriSign]} हैं। निरंतर प्रयास से धन लाभ होगा।`,
      or: `ଶ୍ରୀ ଲଗ୍ନ ${sriSign} ରାଶି (${sriHouse}ର୍ଥ ଭାବ) ରେ ଅବସ୍ଥିତ ଏବଂ ଏହାର ଅଧିପତି ${SIGN_LORDS[sriSign]} ଅଟନ୍ତି। ଧୈର୍ଯ୍ୟପୂର୍ବକ କର୍ମ ଦ୍ୱାରା ଉତ୍ତମ ଧନ ପ୍ରାପ୍ତି ହେବ।`
    }
  };

  // 2. Indu Lagna (Wealth Spot / Billionaire Potential)
  const lagna9thSign = ZODIAC_SIGNS[(ascSignIndex + 8) % 12];
  const moon9thSign = ZODIAC_SIGNS[(moonSignIndex + 8) % 12];
  const lagna9thLord = SIGN_LORDS[lagna9thSign];
  const moon9thLord = SIGN_LORDS[moon9thSign];

  const lagnaRays = PLANET_RAYS[lagna9thLord] || 8;
  const moonRays = PLANET_RAYS[moon9thLord] || 8;
  const totalRays = lagnaRays + moonRays;
  const remainder = totalRays % 12 === 0 ? 12 : totalRays % 12;

  const induSignIndex = (moonSignIndex + remainder - 1) % 12;
  const induSign = ZODIAC_SIGNS[induSignIndex];
  const induDegreeInSign = Number(moonDegreeInSign.toFixed(2));
  const induHouseFromLagna = ((induSignIndex - ascSignIndex + 12) % 12) + 1;
  const induHouseFromMoon = remainder;

  // Occupants of Indu Lagna
  const occupants: PlanetName[] = [];
  const aspectingPlanets: PlanetName[] = [];
  Object.values(planets).forEach(p => {
    if (p.sign === induSign) {
      occupants.push(p.planet);
    }
    // 7th aspect check
    const oppSign = ZODIAC_SIGNS[(induSignIndex + 6) % 12];
    if (p.sign === oppSign && !aspectingPlanets.includes(p.planet)) {
      aspectingPlanets.push(p.planet);
    }
  });

  const hasBenefic = occupants.some(p => ['Guru', 'Shukra', 'Budha', 'Chandra'].includes(p)) ||
    aspectingPlanets.some(p => ['Guru', 'Shukra'].includes(p));
  const hasExalted = occupants.some(p => planets[p]?.dignity === 'Exalted');

  let wealthTier: InduLagnaDetails['wealthTier'] = 'Madhyama Dhana (Comfortable)';
  if (hasExalted || (occupants.includes('Guru') && occupants.includes('Shukra'))) {
    wealthTier = 'Koti Yoga (Billionaire)';
  } else if (hasBenefic) {
    wealthTier = 'Maha Dhana (High Wealth)';
  } else if (occupants.length === 0) {
    wealthTier = 'Madhyama Dhana (Comfortable)';
  } else {
    wealthTier = 'Alpa Dhana (Ordinary)';
  }

  const induLagna: InduLagnaDetails = {
    sign: induSign,
    degreeInSign: induDegreeInSign,
    houseFromLagna: induHouseFromLagna,
    houseFromMoon: induHouseFromMoon,
    signLord: SIGN_LORDS[induSign],
    lagna9thLord,
    moon9thLord,
    lagnaRays,
    moonRays,
    totalRays,
    occupants,
    aspectingPlanets,
    wealthTier,
    wealthPrediction: {
      en: `Indu Lagna falls in ${induSign} (House ${induHouseFromLagna} from Lagna) with total ${totalRays} rays. Status: ${wealthTier}.`,
      hi: `इन्दु लग्न ${induSign} राशि (लग्न से ${induHouseFromLagna} भाव) में कुल ${totalRays} किरणों के साथ स्थित है। योग: ${wealthTier}।`,
      or: `ଇନ୍ଦୁ ଲଗ୍ନ ${induSign} ରାଶିରେ (ଲଗ୍ନରୁ ${induHouseFromLagna}ର୍ଥ ଭାବ) ସମୁଦାୟ ${totalRays} ରଶ୍ମି ସହିତ ସ୍ଥିତ। ସ୍ଥିତି: ${wealthTier}।`
    }
  };

  // 3. Hora Lagna (HL - Financial Velocity & Liquid Assets)
  // Advances 30 deg per hour from sunrise
  const birthHours = birthDate.getUTCHours() + 5.5 + birthDate.getUTCMinutes() / 60;
  const minutesFromSunrise = ((birthHours * 60 - sunriseMinutes) + 1440) % 1440;
  const hoursFromSunrise = minutesFromSunrise / 60;
  const horaLagnaLong = normalizeDegrees(sunLong + hoursFromSunrise * 30);
  const horaSignIndex = Math.floor(horaLagnaLong / 30);
  const horaSign = ZODIAC_SIGNS[horaSignIndex];
  const horaHouse = ((horaSignIndex - ascSignIndex + 12) % 12) + 1;

  const horaLagna: SpecialLagnaItem = {
    id: 'horaLagna',
    name: {
      en: 'Hora Lagna (HL - Wealth Flow)',
      hi: 'होरा लग्न (धन एवं चल संपत्ति)',
      or: 'ହୋରା ଲଗ୍ନ (ଧନ ପ୍ରବାହ ଓ ନଗଦ ସମ୍ପଦ)'
    },
    shortName: 'HL',
    sign: horaSign,
    degreeInSign: Number((horaLagnaLong % 30).toFixed(2)),
    house: horaHouse,
    signLord: SIGN_LORDS[horaSign],
    significance: {
      en: 'Governs financial liquidity, cash flow velocity, and wealth accumulation timing.',
      hi: 'धन की तरलता, रोकड़ प्रवाह एवं संपत्ति संचय के समय का निर्धारण करता है।',
      or: 'ନଗଦ ଧନର ପ୍ରବାହ, ଆର୍ଥିକ ତରଳତା ଏବଂ ସମ୍ପତ୍ତି ସଞ୍ଚୟ କ୍ଷମତାର ସୂଚକ।'
    },
    prediction: {
      en: `Hora Lagna in ${horaSign} indicates financial growth activated through partnerships and skilled investments.`,
      hi: `होरा लग्न ${horaSign} में स्थित होने से साझेदारी एवं विवेकपूर्ण निवेश से धन लाभ होगा।`,
      or: `ହୋରା ଲଗ୍ନ ${horaSign} ରାଶିରେ ଥିବାରୁ ବ୍ୟବସାୟିକ ସହଯୋଗିତା ଓ ସଠିକ୍ ନିବେଶ ଦ୍ୱାରା ଧନ ବୃଦ୍ଧି ଘଟିବ।`
    }
  };

  // 4. Ghāti Lagna (GL - Power, Authority & Bureaucracy)
  // Advances 30 deg per ghati (24 minutes) from sunrise
  const ghatisFromSunrise = minutesFromSunrise / 24;
  const ghatiLagnaLong = normalizeDegrees(sunLong + ghatisFromSunrise * 30);
  const ghatiSignIndex = Math.floor(ghatiLagnaLong / 30);
  const ghatiSign = ZODIAC_SIGNS[ghatiSignIndex];
  const ghatiHouse = ((ghatiSignIndex - ascSignIndex + 12) % 12) + 1;

  const ghatiLagna: SpecialLagnaItem = {
    id: 'ghatiLagna',
    name: {
      en: 'Ghāti Lagna (GL - Authority & Fame)',
      hi: 'घटी लग्न (सत्ता, पद एवं प्रतिष्ठा)',
      or: 'ଘାଟୀ ଲଗ୍ନ (ରାଜସମ୍ମାନ, ପ୍ରତିଷ୍ଠା ଓ ପଦ)'
    },
    shortName: 'GL',
    sign: ghatiSign,
    degreeInSign: Number((ghatiLagnaLong % 30).toFixed(2)),
    house: ghatiHouse,
    signLord: SIGN_LORDS[ghatiSign],
    significance: {
      en: 'Determines leadership power, government honors, high status, and societal fame.',
      hi: 'प्रशासनिक सत्ता, राजपद, सामाजिक सम्मान एवं उच्च प्रतिष्ठा का निर्धारक।',
      or: 'ପ୍ରଶାସନିକ କ୍ଷମତା, ରାଜକୀୟ ସମ୍ମାନ, ସାମାଜିକ ପ୍ରଭାବ ଓ ଉଚ୍ଚ ପଦବୀର ନିର୍ଦ୍ଧାରକ।'
    },
    prediction: {
      en: `Ghāti Lagna in ${ghatiSign} grants commanding presence and career recognition from seniors.`,
      hi: `घटी लग्न ${ghatiSign} में स्थित होने से नेतृत्व क्षमता एवं उच्चाधिकारियों से सम्मान प्राप्त होगा।`,
      or: `ଘାଟୀ ଲଗ୍ନ ${ghatiSign} ରାଶିରେ ଥିବାରୁ ପ୍ରଭାବଶାଳୀ ନେତୃତ୍ୱ ଓ କର୍ମକ୍ଷେତ୍ରରେ ଉଚ୍ଚପଦସ୍ଥ ବ୍ୟକ୍ତିଙ୍କ ଠାରୁ ପ୍ରଶଂସା ମିଳିବ।`
    }
  };

  // 5. Prānapada Lagna (PP - Biological Life Force & Vitality)
  const vighatis = (minutesFromSunrise * 2.5) % 360;
  const pranapadaLong = normalizeDegrees(sunLong + vighatis);
  const pranapadaSignIndex = Math.floor(pranapadaLong / 30);
  const pranapadaSign = ZODIAC_SIGNS[pranapadaSignIndex];
  const pranapadaHouse = ((pranapadaSignIndex - ascSignIndex + 12) % 12) + 1;

  const pranapadaLagna: SpecialLagnaItem = {
    id: 'pranapadaLagna',
    name: {
      en: 'Prānapada Lagna (PP - Vitality Breath)',
      hi: 'प्राणपद लग्न (प्राण शक्ति एवं जीवन ऊर्जा)',
      or: 'ପ୍ରାଣପଦ ଲଗ୍ନ (ଜୀବନଶକ୍ତି ଓ ପ୍ରାଣ ବାୟୁ)'
    },
    shortName: 'PP',
    sign: pranapadaSign,
    degreeInSign: Number((pranapadaLong % 30).toFixed(2)),
    house: pranapadaHouse,
    signLord: SIGN_LORDS[pranapadaSign],
    significance: {
      en: 'Measures biological breath, longevity resonance, and confirms the exact birth timestamp.',
      hi: 'शारीरिक प्राण ऊर्जा, जीवन शक्ति एवं जन्म समय के सूक्ष्म सत्यापन का आधार।',
      or: 'ଶାରୀରିକ ପ୍ରାଣ ଶକ୍ତି, ଆୟୁଷର ସାମଞ୍ଜସ୍ୟ ଓ ଜନ୍ମ ସମୟର ସଠିକ୍ ପରୀକ୍ଷଣ ପଦ୍ଧତି।'
    },
    prediction: {
      en: `Prānapada in ${pranapadaSign} harmonizes with vital energy, assuring resilient health.`,
      hi: `प्राणपद ${pranapadaSign} में होने से जीवन शक्ति सशक्त बनी रहती है।`,
      or: `ପ୍ରାଣପଦ ${pranapadaSign} ରେ ଥିବାରୁ ପ୍ରାଣବାୟୁ ଓ ଶାରୀରିକ ରୋଗ ପ୍ରତିରୋଧକ ଶକ୍ତି ବଳବାନ ରହିବ।`
    }
  };

  // 6. Karakamsha Lagna (Soul Dharma Sign)
  const jaiminiPlanets = ['Surya', 'Chandra', 'Mangala', 'Budha', 'Guru', 'Shukra', 'Shani'] as const;
  let atmakarakaPlanet: PlanetName = 'Surya';
  let maxDegInSign = -1;
  jaiminiPlanets.forEach(p => {
    if (planets[p] && planets[p].degreeInSign > maxDegInSign) {
      maxDegInSign = planets[p].degreeInSign;
      atmakarakaPlanet = p;
    }
  });

  const akNavamshaSign = planets[atmakarakaPlanet]?.navamshaSign || 'Mesha';
  const akNavamshaSignIndex = ZODIAC_SIGNS.indexOf(akNavamshaSign);
  const karakamshaHouse = ((akNavamshaSignIndex - ascSignIndex + 12) % 12) + 1;

  const karakamshaLagna: SpecialLagnaItem = {
    id: 'karakamshaLagna',
    name: {
      en: 'Karakamsha Lagna (Soul Purpose)',
      hi: 'कारकांश लग्न (आत्मिक उद्देश्य एवं धर्म)',
      or: 'କାରକାଂଶ ଲଗ୍ନ (ଆତ୍ମାର ଉଦ୍ଦେଶ୍ୟ ଓ ସାଧନା)'
    },
    shortName: 'KL',
    sign: akNavamshaSign,
    degreeInSign: Number(maxDegInSign.toFixed(2)),
    house: karakamshaHouse,
    signLord: SIGN_LORDS[akNavamshaSign],
    significance: {
      en: 'The sign occupied by the Atmakaraka in Navamsha, revealing supreme inner potential and spiritual destiny.',
      hi: 'नवांश में आत्मकारक ग्रह द्वारा अधिकृत राशि, जो आत्मा के सर्वोच्च लक्ष्य एवं आध्यात्मिक धर्म को दर्शाती है।',
      or: 'ନବାଂଶ କୁଣ୍ଡଳୀରେ ଆତ୍ମକାରକ ଗ୍ରହଙ୍କ ଅବସ୍ଥିତି, ଯାହା ଆତ୍ମାର ଚରମ ଲକ୍ଷ୍ୟ ଓ ଆଧ୍ୟାତ୍ମିକ ସାଧନା ଦର୍ଶାଏ।'
    },
    prediction: {
      en: `Karakamsha in ${akNavamshaSign} reveals highest talent in research, advisory, and spiritual wisdom.`,
      hi: `कारकांश ${akNavamshaSign} में होने से मार्गदर्शन, शोध एवं दार्शनिक ज्ञान में अद्वितीय सफलता मिलेगी।`,
      or: `କାରକାଂଶ ${akNavamshaSign} ରେ ଥିବାରୁ ଗବେଷଣା, ପରାମର୍ଶ ଏବଂ ତାତ୍ତ୍ୱିକ ଜ୍ଞାନରେ ବିଶେଷ ସଫଳତା ପ୍ରାପ୍ତ ହେବ।`
    }
  };

  // 7. Mandi & Gulika (Saturn's Sons - Critical Karmic Shadow Points)
  // Day of week offsets in ghatis for day birth:
  // Sun: 26, Mon: 22, Tue: 18, Wed: 14, Thu: 10, Fri: 6, Sat: 2
  const dayOfWeek = birthDate.getUTCDay();
  const gulikaDayGhatis = [26, 22, 18, 14, 10, 6, 2][dayOfWeek];
  const mandiDayGhatis = (gulikaDayGhatis - 1.5 + 60) % 60;

  const gulikaLong = normalizeDegrees(sunLong + (gulikaDayGhatis / 60) * 360);
  const gulikaSignIndex = Math.floor(gulikaLong / 30);
  const gulikaSign = ZODIAC_SIGNS[gulikaSignIndex];
  const gulikaHouse = ((gulikaSignIndex - ascSignIndex + 12) % 12) + 1;

  const mandiLong = normalizeDegrees(sunLong + (mandiDayGhatis / 60) * 360);
  const mandiSignIndex = Math.floor(mandiLong / 30);
  const mandiSign = ZODIAC_SIGNS[mandiSignIndex];
  const mandiHouse = ((mandiSignIndex - ascSignIndex + 12) % 12) + 1;

  const gulika: SpecialLagnaItem = {
    id: 'gulika',
    name: {
      en: 'Gulika (Son of Saturn)',
      hi: 'गुलिक (शनि पुत्र उपग्रह)',
      or: 'ଗୁଳିକା (ଶନିଦେବଙ୍କ ସୂକ୍ଷ୍ମ କର୍ମ ବିନ୍ଦୁ)'
    },
    shortName: 'Gk',
    sign: gulikaSign,
    degreeInSign: Number((gulikaLong % 30).toFixed(2)),
    house: gulikaHouse,
    signLord: SIGN_LORDS[gulikaSign],
    significance: {
      en: 'Shadow entity of Saturn representing lingering karmic tests and unaddressed obstacles.',
      hi: 'शनि का छाया उपग्रह जो पूर्वजन्म के संचित कर्मों एवं अप्रत्याशित बाधाओं का प्रतीक है।',
      or: 'ଶନିଙ୍କ ଛାୟା ଉପଗ୍ରହ ଯାହା ପୂର୍ବଜନ୍ମର କର୍ମ ପରୀକ୍ଷା ଓ ଅପ୍ରତ୍ୟାଶିତ ପ୍ରତିବନ୍ଧକ ସୂଚିତ କରେ।'
    },
    prediction: {
      en: `Gulika in House ${gulikaHouse} requires disciplined karma and regular Shiva/Hanuman worship.`,
      hi: `गुलिक ${gulikaHouse} भाव में होने से नियमित शिव/हनुमान आराधना एवं संयमित आचरण श्रेयस्कर है।`,
      or: `ଗୁଳିକା ${gulikaHouse}ର୍ଥ ଭାବରେ ଥିବାରୁ ନିୟମିତ ଶିବ ଓ ହନୁମାନ ଆରାଧନା ଏବଂ ନ୍ୟାୟନିଷ୍ଠ କର୍ମ ଆବଶ୍ୟକ।`
    }
  };

  const mandi: SpecialLagnaItem = {
    id: 'mandi',
    name: {
      en: 'Mandi (Karmic Cleanser)',
      hi: 'मान्दि (कठोर कर्म शोधक)',
      or: 'ମାନ୍ଦି (କର୍ମ ଶୋଧନ ବିନ୍ଦୁ)'
    },
    shortName: 'Mn',
    sign: mandiSign,
    degreeInSign: Number((mandiLong % 30).toFixed(2)),
    house: mandiHouse,
    signLord: SIGN_LORDS[mandiSign],
    significance: {
      en: 'Sub-planet carrying deep purifying tests; auspicious when placed in upachaya houses (3, 6, 11).',
      hi: 'गहन कर्म शोधन कारक उपग्रह; उपचय भावों (३, ६, ११) में स्थित होने पर शत्रुहंता बनाता है।',
      or: 'ଗଭୀର କର୍ମ ଶୋଧକ ଉପଗ୍ରହ; ଉପଚୟ ଭାବ (୩, ୬, ୧୧) ରେ ରହିଲେ ଶତ୍ରୁ ବିଜୟୀ କରାଏ।'
    },
    prediction: {
      en: `Mandi placed in House ${mandiHouse}. Auspicious in 3, 6, 11 for annihilating competition.`,
      hi: `मान्दि ${mandiHouse} भाव में स्थित है। ३, ६, ११ भावों में यह विरोधियों पर विजय दिलाता है।`,
      or: `ମାନ୍ଦି ${mandiHouse}ର୍ଥ ଭାବରେ ଅବସ୍ଥିତ। ୩, ୬, ୧୧ ଭାବରେ ଏହା ପ୍ରତିଦ୍ୱନ୍ଦ୍ୱୀମାନଙ୍କୁ ପରାସ୍ତ କରିବାରେ ସହାୟକ ହୁଏ।`
    }
  };

  // 8. The 5 Parashari Invisible Upagrahas
  // Dhuma = Sun + 133°20'
  const dhumaLong = normalizeDegrees(sunLong + 133 + 20 / 60);
  const vyatipataLong = normalizeDegrees(360 - dhumaLong);
  const pariveshaLong = normalizeDegrees(vyatipataLong + 180);
  const indrachapaLong = normalizeDegrees(360 - pariveshaLong);
  const upaketuLong = normalizeDegrees(indrachapaLong + 16 + 40 / 60);

  const upagrahaRaw = [
    {
      name: { en: 'Dhuma (ଧୂମ)', hi: 'धूम', or: 'ଧୂମ' },
      long: dhumaLong,
      effect: {
        en: 'Induces fiery determination; caution against impatience.',
        hi: 'अग्नि तत्व प्रधान; धैर्य बनाए रखने की आवश्यकता।',
        or: 'ଅଗ୍ନି ତତ୍ତ୍ୱ ପ୍ରଧାନ ତେଜ; ଧୈର୍ଯ୍ୟ ରଖିବା ଉଚିତ।'
      }
    },
    {
      name: { en: 'Vyatipata (ବ୍ୟତୀପାତ)', hi: 'व्यतीपात', or: 'ବ୍ୟତୀପାତ' },
      long: vyatipataLong,
      effect: {
        en: 'Creates sudden reversals; mitigated by charity on New Moon.',
        hi: 'आकस्मिक परिवर्तन कारक; अमावस्या पर दान से शांति।',
        or: 'ଅପ୍ରତ୍ୟାଶିତ ପରିବର୍ତ୍ତନ କାରକ; ଅମାବାସ୍ୟାରେ ଦାନ ଦ୍ୱାରା ଶାନ୍ତି।'
      }
    },
    {
      name: { en: 'Parivesha (ପରିବେଷ)', hi: 'परिवेष', or: 'ପରିବେଷ' },
      long: pariveshaLong,
      effect: {
        en: 'Aura of protection against unseen psychological attacks.',
        hi: 'मानसिक सुरक्षा कवच का निर्माण करता है।',
        or: 'ଅଜ୍ଞାତ ମାନସିକ ଆଘାତରୁ ସୁରକ୍ଷା କବଚ ସୃଷ୍ଟି କରେ।'
      }
    },
    {
      name: { en: 'Indrachapa (ଇନ୍ଦ୍ରଚାପ)', hi: 'इन्द्रचाप', or: 'ଇନ୍ଦ୍ରଚାପ (କୋଦଣ୍ଡ)' },
      long: indrachapaLong,
      effect: {
        en: 'Celestial rainbow of artistic and spiritual synthesis.',
        hi: 'कलात्मक एवं आध्यात्मिक ऊर्जा का समन्वय।',
        or: 'କଳାତ୍ମକ ଓ ଆଧ୍ୟାତ୍ମିକ ଶକ୍ତିର ସୁନ୍ଦର ସମନ୍ୱୟ।'
      }
    },
    {
      name: { en: 'Upaketu (ଉପକେତୁ)', hi: 'उपकेतु', or: 'ଉପକେତୁ' },
      long: upaketuLong,
      effect: {
        en: 'Mystic detachment node inspiring transcendental wisdom.',
        hi: 'वैराग्य एवं गूढ़ आध्यात्मिक अंतर्दृष्टि का संवाहक।',
        or: 'ବୈରାଗ୍ୟ ଓ ଗୂଢ଼ ଆଧ୍ୟାତ୍ମିକ ଦୃଷ୍ଟିକୋଣ ପ୍ରଦାନ କରେ।'
      }
    }
  ];

  const upagrahas: UpagrahaItem[] = upagrahaRaw.map(u => {
    const sIdx = Math.floor(u.long / 30);
    const house = ((sIdx - ascSignIndex + 12) % 12) + 1;
    return {
      name: u.name,
      sign: ZODIAC_SIGNS[sIdx],
      degreeInSign: Number((u.long % 30).toFixed(2)),
      house,
      isShadowNode: true,
      effect: u.effect
    };
  });

  return {
    sriLagna,
    induLagna,
    horaLagna,
    ghatiLagna,
    pranapadaLagna,
    karakamshaLagna,
    mandi,
    gulika,
    upagrahas
  };
}
