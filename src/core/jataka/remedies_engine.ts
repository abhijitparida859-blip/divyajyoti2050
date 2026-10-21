import { PlanetName, PlanetPosition, ZodiacSign, GemstoneRecommendation, RudrakshaRecommendation, VedicRemediesData, GocharaData, GocharaTransitPlanet, SadeSatiInfo } from '../../types/jataka';
import { RASHI_LORDS, ZODIAC_SIGNS } from './kundali_engine';
import { calculatePlanetaryPositions } from '../astronomy/ephemeris';

const GEMSTONE_CATALOG: Record<PlanetName, { gem: { en: string; hi: string; or: string }; metal: { en: string; hi: string; or: string }; finger: { en: string; hi: string; or: string }; mantra: string; day: { en: string; hi: string; or: string } }> = {
  Surya:   { gem: { en: 'Ruby (Manikya)', hi: 'माणिक्य', or: 'ମାଣିକ୍ୟ' }, metal: { en: 'Gold or Copper', hi: 'स्वर्ण या तांबा', or: 'ସୁନା ବା ତମ୍ବା' }, finger: { en: 'Ring Finger', hi: 'अनामिका', or: 'ଅନାମିକା' }, mantra: 'ॐ घृणिः सूर्याय नमः', day: { en: 'Sunday Morning', hi: 'रविवार प्रातः', or: 'ରବିବାର ସକାଳ' } },
  Chandra: { gem: { en: 'Pearl (Moti)', hi: 'मोती', or: 'ମୋତି' }, metal: { en: 'Silver', hi: 'चांदी', or: 'ରୂପା' }, finger: { en: 'Little Finger', hi: 'कनिष्ठिका', or: 'କନିଷ୍ଠିକା' }, mantra: 'ॐ सों सोमाय नमः', day: { en: 'Monday Evening', hi: 'सोमवार सायं', or: 'ସୋମବାର ସନ୍ଧ୍ୟା' } },
  Mangala: { gem: { en: 'Red Coral (Moonga)', hi: 'मूँगा', or: 'ପୋହଳା' }, metal: { en: 'Gold or Copper', hi: 'स्वर्ण या तांबा', or: 'ସୁନା ବା ତମ୍ବା' }, finger: { en: 'Ring Finger', hi: 'अनामिका', or: 'ଅନାମିକା' }, mantra: 'ॐ अं अंगारकाय नमः', day: { en: 'Tuesday Morning', hi: 'मंगलवार प्रातः', or: 'ମଙ୍ଗଳବାର ସକାଳ' } },
  Budha:   { gem: { en: 'Emerald (Panna)', hi: 'पन्ना', or: 'ମରକତ / ପାନ୍ନା' }, metal: { en: 'Gold or Bronze', hi: 'स्वर्ण या कांसा', or: 'ସୁନା ବା କଂସା' }, finger: { en: 'Little Finger', hi: 'कनिष्ठिका', or: 'କନିଷ୍ଠିକା' }, mantra: 'ॐ बुं बुधाय नमः', day: { en: 'Wednesday Morning', hi: 'बुधवार प्रातः', or: 'ବୁଧବାର ସକାଳ' } },
  Guru:    { gem: { en: 'Yellow Sapphire (Pukhraj)', hi: 'पुखराज', or: 'ପୋଖରାଜ' }, metal: { en: 'Pure Gold', hi: 'स्वर्ण', or: 'ଶୁଦ୍ଧ ସୁବର୍ଣ୍ଣ' }, finger: { en: 'Index Finger', hi: 'तर्जनी', or: 'ତର୍ଜନୀ' }, mantra: 'ॐ बृं बृहस्पतये नमः', day: { en: 'Thursday Morning', hi: 'गुरुवार प्रातः', or: 'ଗୁରୁବାର ସକାଳ' } },
  Shukra:  { gem: { en: 'Diamond or White Zircon', hi: 'हीरा / श्वेत जरकन', or: 'ହୀରା / ଧଳା ଜରକନ୍' }, metal: { en: 'Platinum or Silver', hi: 'चांदी या प्लैटिनम', or: 'ରୂପା ବା ପ୍ଲାଟିନମ୍' }, finger: { en: 'Middle or Little Finger', hi: 'मध्यमा या कनिष्ठिका', or: 'ମଧ୍ୟମା ବା କନିଷ୍ଠିକା' }, mantra: 'ॐ शुं शुक्राय नमः', day: { en: 'Friday Morning', hi: 'शुक्रवार प्रातः', or: 'ଶୁକ୍ରବାର ସକାଳ' } },
  Shani:   { gem: { en: 'Blue Sapphire (Neelam) or Amethyst', hi: 'नीलम / कटैला', or: 'ନୀଳା / କଟେଲା' }, metal: { en: 'Iron or Panchadhatu', hi: 'पंचधातु या लोहा', or: 'ପଞ୍ଚଧାତୁ ବା ଲୁହା' }, finger: { en: 'Middle Finger', hi: 'मध्यमा', or: 'ମଧ୍ୟମା' }, mantra: 'ॐ शं शनैश्चराय नमः', day: { en: 'Saturday Evening', hi: 'शनिवार सायं', or: 'ଶନିବାର ସନ୍ଧ୍ୟା' } },
  Rahu:    { gem: { en: 'Hessonite Garnet (Gomed)', hi: 'गोमेद', or: 'ଗୋମେଦ' }, metal: { en: 'Silver or Ashtadhatu', hi: 'चांदी या अष्टधातु', or: 'ରୂପା ବା ଅଷ୍ଟଧାତୁ' }, finger: { en: 'Middle Finger', hi: 'मध्यमा', or: 'ମଧ୍ୟମା' }, mantra: 'ॐ रां राहवे नमः', day: { en: 'Saturday Night', hi: 'शनिवार रात्रि', or: 'ଶନିବାର ରାତ୍ରି' } },
  Ketu:    { gem: { en: 'Cat\'s Eye (Lehsuniya)', hi: 'लहसुनिया', or: 'ବୈଦୂର୍ଯ୍ୟ / ଲହସୁଣିଆ' }, metal: { en: 'Panchadhatu', hi: 'पंचधातु', or: 'ପଞ୍ଚଧାତୁ' }, finger: { en: 'Middle or Ring Finger', hi: 'मध्यमा या अनामिका', or: 'ମଧ୍ୟମା ବା ଅନାମିକା' }, mantra: 'ॐ कें केतवे नमः', day: { en: 'Tuesday Night', hi: 'मंगलवार रात्रि', or: 'ମଙ୍ଗଳବାର ରାତ୍ରି' } }
};

export function calculateVedicRemedies(
  ascSignIndex: number,
  planets: Record<PlanetName, PlanetPosition>
): VedicRemediesData {
  const lagnaLord = RASHI_LORDS[ZODIAC_SIGNS[ascSignIndex]]; // Life Gem
  const h9SignIdx = (ascSignIndex + 8) % 12;
  const h9Lord = RASHI_LORDS[ZODIAC_SIGNS[h9SignIdx]]; // Lucky Gem
  const h5SignIdx = (ascSignIndex + 4) % 12;
  const h5Lord = RASHI_LORDS[ZODIAC_SIGNS[h5SignIdx]]; // Benefic Gem

  const gemstones: GemstoneRecommendation[] = [
    {
      type: 'Life',
      typeName: { en: 'Life Stone (Jivana Ratna)', hi: 'जीवन रत्न (आरोग्य व ओज)', or: 'ଜୀବନ ରତ୍ନ (ଆରୋଗ୍ୟ ଓ ତେଜ)' },
      gemstone: GEMSTONE_CATALOG[lagnaLord].gem,
      rulingPlanet: lagnaLord,
      metal: GEMSTONE_CATALOG[lagnaLord].metal,
      finger: GEMSTONE_CATALOG[lagnaLord].finger,
      mantra: GEMSTONE_CATALOG[lagnaLord].mantra,
      dayToWear: GEMSTONE_CATALOG[lagnaLord].day,
      benefits: { en: 'Protects vitality, immunizes physical body, and strengthens personal aura.', hi: 'शारीरिक ओज, स्वास्थ्य एवं संपूर्ण जीवन में आत्मबल की वृद्धि।', or: 'ଶରୀରର ଆରୋଗ୍ୟ, ରୋଗ ପ୍ରତିରୋଧକ ଶକ୍ତି ଓ ବ୍ୟକ୍ତିତ୍ୱର ବିକାଶ।' }
    },
    {
      type: 'Lucky',
      typeName: { en: 'Lucky Stone (Bhagya Ratna)', hi: 'भाग्य रत्न (भाग्य व प्रतिष्ठा)', or: 'ଭାଗ୍ୟ ରତ୍ନ (ଭାଗ୍ୟୋଦୟ ଓ ପ୍ରତିଷ୍ଠା)' },
      gemstone: GEMSTONE_CATALOG[h9Lord].gem,
      rulingPlanet: h9Lord,
      metal: GEMSTONE_CATALOG[h9Lord].metal,
      finger: GEMSTONE_CATALOG[h9Lord].finger,
      mantra: GEMSTONE_CATALOG[h9Lord].mantra,
      dayToWear: GEMSTONE_CATALOG[h9Lord].day,
      benefits: { en: 'Activates 9th house bhagya, clears hurdles, and attracts divine coincidences.', hi: 'भाग्य का पूर्ण सहयोग, उच्च सम्मान एवं ईश्वरीय कृपा का आकर्षण।', or: 'ନବମ ଭାବ ଜାଗ୍ରତ କରି ଭାଗ୍ୟୋଦୟ, ବାଧାମୁକ୍ତି ଓ ସୌଭାଗ୍ୟ ପ୍ରଦାନ।' }
    },
    {
      type: 'Benefic',
      typeName: { en: 'Benefic Stone (Punya Ratna)', hi: 'पुण्य रत्न (बुद्धि व विद्या)', or: 'ପୁଣ୍ୟ ରତ୍ନ (ବୁଦ୍ଧି ଓ ବିଦ୍ୟା)' },
      gemstone: GEMSTONE_CATALOG[h5Lord].gem,
      rulingPlanet: h5Lord,
      metal: GEMSTONE_CATALOG[h5Lord].metal,
      finger: GEMSTONE_CATALOG[h5Lord].finger,
      mantra: GEMSTONE_CATALOG[h5Lord].mantra,
      dayToWear: GEMSTONE_CATALOG[h5Lord].day,
      benefits: { en: 'Enhances cognitive sharpness, artistic instincts, and progeny blessings.', hi: 'तीक्ष्ण प्रज्ञा, पूर्वजन्म पुण्य जागृति एवं संतान सुख।', or: 'ପ୍ରଖର ମେଧାଶକ୍ତି, ଉଚ୍ଚ ବିଦ୍ୟା ଓ ସନ୍ତାନ ସୁଖ ସମୃଦ୍ଧି।' }
    }
  ];

  const rudrakshas: RudrakshaRecommendation[] = [
    {
      mukhi: 5,
      name: { en: '5 Mukhi Rudraksha (Pancha Brahma)', hi: 'पंचमुखी रुद्राक्ष', or: 'ପଞ୍ଚମୁଖୀ ରୁଦ୍ରାକ୍ଷ' },
      deity: { en: 'Lord Shiva (Kalagni Rudra)', hi: 'कालाग्नि रुद्र', or: 'କାଳାଗ୍ନି ରୁଦ୍ର' },
      rulingPlanet: 'Guru',
      benefits: { en: 'Purifies sins, brings supreme mental peace, normalizes blood pressure, and awakens intellect.', hi: 'मानसिक शांति, ज्ञान वृद्धि एवं पापों का शमन।', or: 'ପରମ ଶାନ୍ତି, ବୁଦ୍ଧି ବୃଦ୍ଧି ଓ ସର୍ବଦୋଷ ଶାନ୍ତି।' },
      mantra: 'ॐ ह्रीं नमः'
    },
    {
      mukhi: 7,
      name: { en: '7 Mukhi Rudraksha (Mahalakshmi)', hi: 'सप्तमुखी रुद्राक्ष', or: 'ସପ୍ତମୁଖୀ ରୁଦ୍ରାକ୍ଷ' },
      deity: { en: 'Goddess Mahalakshmi', hi: 'माँ महालक्ष्मी', or: 'ମା’ ମହାଲକ୍ଷ୍ମୀ' },
      rulingPlanet: 'Shani',
      benefits: { en: 'Dissolves financial distress, grants sustained business prosperity, and pacifies Shani afflictions.', hi: 'धन-धान्य, व्यापारिक समृद्धि एवं शनि दोष निवारण।', or: 'ଅର୍ଥାଭାବ ଦୂରୀକରଣ, ବ୍ୟବସାୟରେ ଲାଭ ଓ ଶନି ଦୋଷ ଖଣ୍ଡନ।' },
      mantra: 'ॐ हुं नमः'
    },
    {
      mukhi: 8,
      name: { en: '8 Mukhi Rudraksha (Ashtamurti Ganesha)', hi: 'अष्टमुखी रुद्राक्ष', or: 'ଅଷ୍ଟମୁଖୀ ରୁଦ୍ରାକ୍ଷ' },
      deity: { en: 'Lord Ganesha & Eight Vasus', hi: 'भगवान श्री गणेश', or: 'ଶ୍ରୀ ସିଦ୍ଧିଦାତା ଗଣେଶ' },
      rulingPlanet: 'Rahu',
      benefits: { en: 'Overcomes impossible obstacles, eliminates fear of sudden accidents, and pacifies Rahu.', hi: 'विघ्न नाश, अज्ञात भय से मुक्ति एवं राहु शांति।', or: 'ସର୍ବ ବିଘ୍ନ ବିନାଶ, ଅଜ୍ଞାତ ଭୟ ଦୂର ଓ ରାହୁ ପ୍ରଶମନ।' },
      mantra: 'ॐ हुं नमः'
    }
  ];

  return {
    gemstones,
    rudrakshas,
    jagannathRemedy: {
      besha: 'ସୁନା ବେଶ ଓ ପଦ୍ମ ବେଶ',
      stotra: 'ଶ୍ରୀ ଜଗନ୍ନାଥାଷ୍ଟକମ୍ ଓ ଶ୍ରୀ ବିଷ୍ଣୁ ସହସ୍ରନାମ',
      prasad: 'ନିର୍ମାଲ୍ୟ ଓ କୈବଲ୍ୟ ସେବନ',
      guidance: {
        en: 'Light a ghee lamp in the evening facing the Northeast and chant Jagannathashtakam to harmonize planetary forces.',
        hi: 'संध्या समय ईशान कोण में शुद्ध घी का दीपक जलाकर श्री जगन्नाथाष्टकम् का पाठ करें।',
        or: 'ସନ୍ଧ୍ୟାରେ ଐଶାନ୍ୟ କୋଣରେ ଶୁଦ୍ଧ ଘୃତର ଦୀପ ପ୍ରଜ୍ଜ୍ୱଳନ କରି ଶ୍ରୀଜଗନ୍ନାଥାଷ୍ଟକମ୍ ପାଠ କରନ୍ତୁ।'
      }
    },
    daanaRemedies: [
      { item: { en: 'Feed green grass or spinach to cows', hi: 'गौमाता को हरा चारा / पालक खिलाएं', or: 'ଗୋମାତାଙ୍କୁ ସବୁଜ ଘାସ ବା ପାଳଙ୍ଗ ଖୁଆନ୍ତୁ' }, day: { en: 'Wednesday', hi: 'बुधवार', or: 'ବୁଧବାର' }, target: { en: 'Pacifies Mercury & enhances intellect', hi: 'बुध ग्रह की शांति', or: 'ବୁଧ ଗ୍ରହ ଶାନ୍ତି' } },
      { item: { en: 'Offer sesame seeds and oil lamp to Shani dev', hi: 'काले तिल व सरसों का तेल दान', or: 'କଳା ରାଶି ଓ ତେଲ ଦୀପ ଦାନ' }, day: { en: 'Saturday', hi: 'शनिवार', or: 'ଶନିବାର' }, target: { en: 'Removes delays and overcomes struggle', hi: 'शनि की कृपा प्राप्ति', or: 'ଶନି କୃପା ପ୍ରାପ୍ତି' } }
    ]
  };
}

export function calculateLiveGochara(
  birthDateUTC: Date,
  ascendantSignIndex: number,
  natalMoonSignIndex: number,
  sarvashtakavarga: number[]
): GocharaData {
  const now = new Date();
  const rawTransit = calculatePlanetaryPositions(now);

  const transitPlanetsList: { name: PlanetName; long: number }[] = [
    { name: 'Surya', long: rawTransit.sun },
    { name: 'Chandra', long: rawTransit.moon },
    { name: 'Mangala', long: rawTransit.mars },
    { name: 'Budha', long: rawTransit.mercury },
    { name: 'Guru', long: rawTransit.jupiter },
    { name: 'Shukra', long: rawTransit.venus },
    { name: 'Shani', long: rawTransit.saturn },
    { name: 'Rahu', long: rawTransit.rahu },
    { name: 'Ketu', long: rawTransit.ketu }
  ];

  const planetsRecord: Partial<Record<PlanetName, GocharaTransitPlanet>> = {};

  for (const p of transitPlanetsList) {
    const signIndex = Math.floor(p.long / 30);
    const degreeInSign = Math.round((p.long % 30) * 100) / 100;
    const houseFromLagna = ((signIndex - ascendantSignIndex + 12) % 12) + 1;
    const houseFromMoon = ((signIndex - natalMoonSignIndex + 12) % 12) + 1;
    const savPoints = sarvashtakavarga[houseFromLagna - 1] || 28;

    let transitEffect: 'Auspicious' | 'Neutral' | 'Inauspicious' = 'Neutral';
    if (savPoints >= 30) transitEffect = 'Auspicious';
    else if (savPoints < 25) transitEffect = 'Inauspicious';

    planetsRecord[p.name] = {
      planet: p.name,
      sign: ZODIAC_SIGNS[signIndex],
      signIndex,
      degreeInSign,
      houseFromLagna,
      houseFromMoon,
      isRetrograde: p.name === 'Rahu' || p.name === 'Ketu'
        ? true
        : ((rawTransit.isRetrograde as any)?.[{ Surya: 'sun', Chandra: 'moon', Mangala: 'mars', Budha: 'mercury', Guru: 'jupiter', Shukra: 'venus', Shani: 'saturn' }[p.name as 'Surya' | 'Chandra' | 'Mangala' | 'Budha' | 'Guru' | 'Shukra' | 'Shani']] ?? false),
      savPointsInHouse: savPoints,
      transitEffect,
      description: {
        en: `Transiting ${ZODIAC_SIGNS[signIndex]} (${degreeInSign}°): house ${houseFromLagna} from Lagna, ${houseFromMoon} from Moon, ${savPoints} SAV bindus → ${transitEffect}.`,
        hi: `${ZODIAC_SIGNS[signIndex]} में गोचर (${degreeInSign}°): लग्न से ${houseFromLagna}वां, चंद्र से ${houseFromMoon}वां, ${savPoints} बिंदु → ${transitEffect}।`,
        or: `${ZODIAC_SIGNS[signIndex]}ରେ ଗୋଚର (${degreeInSign}°): ଲଗ୍ନରୁ ${houseFromLagna}ମ, ଚନ୍ଦ୍ରରୁ ${houseFromMoon}ମ, ${savPoints} ବିନ୍ଦୁ → ${transitEffect}।`
      }
    };
  }

  // REAL Sade Sati from true transit Saturn (same calculation as yoga engine)
  const saturnNow = ((rawTransit.saturn % 360) + 360) % 360;
  const saturnSignIdx = Math.floor(saturnNow / 30) % 12;
  const diffSat = ((saturnSignIdx - natalMoonSignIndex + 12) % 12);
  const phase = diffSat === 11 ? 'Rising (12th)' : diffSat === 0 ? 'Peak (Janma)' : diffSat === 1 ? 'Setting (2nd)' : 'Not Active';
  const sadeSati: SadeSatiInfo = {
    isActive: phase !== 'Not Active',
    phase: phase as SadeSatiInfo['phase'],
    phaseOr: phase === 'Not Active' ? 'ବର୍ତ୍ତମାନ ସାଢ଼େସାତୀ ଚାଲୁନାହିଁ' : phase,
    saturnCurrentSign: ZODIAC_SIGNS[saturnSignIdx],
    saturnDegree: Math.round((saturnNow % 30) * 100) / 100,
    moonSign: ZODIAC_SIGNS[natalMoonSignIndex],
    isKantakaShani: [3, 7].includes(diffSat),
    isAshtamaShani: diffSat === 7,
    description: phase !== 'Not Active'
      ? { en: `Active Sade Sati ${phase}: Saturn transits ${ZODIAC_SIGNS[saturnSignIdx]}. Discipline and seva protect.`, hi: `साढ़ेसाती ${phase} सक्रिय: शनि ${ZODIAC_SIGNS[saturnSignIdx]} में। संयम व सेवा रक्षा करेंगे।`, or: `ସାଢ଼େସାତୀ ${phase} ସକ୍ରିୟ: ଶନି ${ZODIAC_SIGNS[saturnSignIdx]}ରେ। ଧୈର୍ଯ୍ୟ ଓ ସେବା ରକ୍ଷା କରିବ।` }
      : { en: 'No Sade Sati: Saturn transit is clear of your Moon. Steady growth period.', hi: 'साढ़ेसाती नहीं है। प्रगति का उत्तम काल।', or: 'ସାଢ଼େସାତୀ ନାହିଁ। ଉନ୍ନତିର ଅନୁକୂଳ ସମୟ।' },
    remedy: { en: 'Light mustard-oil lamp on Saturdays; recite Dasharatha Shani Stotra.', hi: 'शनिवार दीप जलाएं; दशरथ शनि स्तोत्र पढ़ें।', or: 'ଶନିବାର ଦୀପ ଦିଅନ୍ତୁ; ଦଶରଥ ଶନି ସ୍ତୋତ୍ର ପଢ଼ନ୍ତୁ।' }
  };

  return {
    transitDate: now.toISOString().split('T')[0],
    planets: planetsRecord as Record<PlanetName, GocharaTransitPlanet>,
    sadeSati
  };
}
