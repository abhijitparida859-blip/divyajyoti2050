import { PlanetName, PlanetPosition, PlanetAvastha, PlanetaryAvasthasData } from '../../types/jataka';

export function calculatePlanetaryAvasthas(
  typedPlanets: Record<PlanetName, PlanetPosition>
): PlanetaryAvasthasData {
  const avasthas: Record<PlanetName, PlanetAvastha> = {} as Record<PlanetName, PlanetAvastha>;

  (Object.keys(typedPlanets) as PlanetName[]).forEach((pName) => {
    const p = typedPlanets[pName];
    const degInSign = p.degreeInSign;
    const isOddSign = p.signIndex % 2 === 0; // 0-based: 0 (Mesha, odd), 2 (Mithuna, odd), etc.

    // 1. Baladi Avastha
    let baladiAvastha: 'Bala' | 'Kumara' | 'Yuva' | 'Vriddha' | 'Mrita' = 'Yuva';
    let baladiName = { en: 'Yuva (Adult / Prime)', hi: 'युवा अवस्था (पूर्ण फल)', or: 'ଯୁବା ଅବସ୍ଥା (ପୂର୍ଣ୍ଣ ଫଳ)' };
    let fruitPercentage = 100;

    const spanIdx = Math.min(4, Math.floor(degInSign / 6));

    if (isOddSign) {
      if (spanIdx === 0) {
        baladiAvastha = 'Bala';
        baladiName = { en: 'Bala (Infant State)', hi: 'बाल्यावस्था (25% फल)', or: 'ବାଲ୍ୟାବସ୍ଥା (୨୫% ଫଳ)' };
        fruitPercentage = 25;
      } else if (spanIdx === 1) {
        baladiAvastha = 'Kumara';
        baladiName = { en: 'Kumara (Adolescent State)', hi: 'कुमारावस्था (50% फल)', or: 'କୁମାରାବସ୍ଥା (୫୦% ଫଳ)' };
        fruitPercentage = 50;
      } else if (spanIdx === 2) {
        baladiAvastha = 'Yuva';
        baladiName = { en: 'Yuva (Prime Adult State)', hi: 'युवावस्था (100% पूर्ण फल)', or: 'ଯୁବାବସ୍ଥା (୧୦୦% ପୂର୍ଣ୍ଣ ଫଳ)' };
        fruitPercentage = 100;
      } else if (spanIdx === 3) {
        baladiAvastha = 'Vriddha';
        baladiName = { en: 'Vriddha (Elderly State)', hi: 'वृद्धावस्था (20% क्षीण फल)', or: 'ବୃଦ୍ଧାବସ୍ଥା (୨୦% କ୍ଷୀଣ ଫଳ)' };
        fruitPercentage = 20;
      } else {
        baladiAvastha = 'Mrita';
        baladiName = { en: 'Mrita (Dormant State)', hi: 'मृतावस्था (नगण्य फल)', or: 'ମୃତାବସ୍ଥା (ନଗଣ୍ୟ ଫଳ)' };
        fruitPercentage = 5;
      }
    } else {
      // Even Sign: reversed progression
      if (spanIdx === 0) {
        baladiAvastha = 'Mrita';
        baladiName = { en: 'Mrita (Dormant State)', hi: 'मृतावस्था (नगण्य फल)', or: 'ମୃତାବସ୍ଥା (ନଗଣ୍ୟ ଫଳ)' };
        fruitPercentage = 5;
      } else if (spanIdx === 1) {
        baladiAvastha = 'Vriddha';
        baladiName = { en: 'Vriddha (Elderly State)', hi: 'वृद्धावस्था (20% क्षीण फल)', or: 'ବୃଦ୍ଧାବସ୍ଥା (୨୦% କ୍ଷୀଣ ଫଳ)' };
        fruitPercentage = 20;
      } else if (spanIdx === 2) {
        baladiAvastha = 'Yuva';
        baladiName = { en: 'Yuva (Prime Adult State)', hi: 'युवावस्था (100% पूर्ण फल)', or: 'ଯୁବାବସ୍ଥା (୧୦୦% ପୂର୍ଣ୍ଣ ଫଳ)' };
        fruitPercentage = 100;
      } else if (spanIdx === 3) {
        baladiAvastha = 'Kumara';
        baladiName = { en: 'Kumara (Adolescent State)', hi: 'कुमारावस्था (50% फल)', or: 'କୁମାରାବସ୍ଥା (୫୦% ଫଳ)' };
        fruitPercentage = 50;
      } else {
        baladiAvastha = 'Bala';
        baladiName = { en: 'Bala (Infant State)', hi: 'बाल्यावस्था (25% फल)', or: 'ବାଲ୍ୟାବସ୍ଥା (୨୫% ଫଳ)' };
        fruitPercentage = 25;
      }
    }

    // 2. Deeptadi Avastha (Radiance & Mood)
    let deeptadiAvastha: 'Deepta' | 'Swastha' | 'Mudita' | 'Shanta' | 'Dina' | 'Vikala' | 'Khala' = 'Shanta';
    let deeptadiName = { en: 'Shanta (Peaceful / Neutral)', hi: 'शान्त (संतुलित प्रभाव)', or: 'ଶାନ୍ତ (ସନ୍ତୁଳିତ ପ୍ରଭାବ)' };

    if (p.isCombust && pName !== 'Surya') {
      deeptadiAvastha = 'Vikala';
      deeptadiName = { en: 'Vikala (Combust / Agitated)', hi: 'विकल (अस्त / व्यथित)', or: 'ବିକଳ (ଅସ୍ତ / ବ୍ୟଥିତ)' };
    } else if (p.dignity === 'Exalted') {
      deeptadiAvastha = 'Deepta';
      deeptadiName = { en: 'Deepta (Luminous / Exalted)', hi: 'दीप्त (प्रदीप्त / उच्च)', or: 'ଦୀପ୍ତ (ପ୍ରଦୀପ୍ତ / ଉଚ୍ଚ)' };
    } else if (p.dignity === 'Own' || p.dignity === 'Moolatrikona') {
      deeptadiAvastha = 'Swastha';
      deeptadiName = { en: 'Swastha (Content / In Own Sign)', hi: 'स्वस्थ (संतुष्ट / स्वगृही)', or: 'ସ୍ୱସ୍ଥ (ସନ୍ତୁଷ୍ଟ / ସ୍ୱକ୍ଷେତ୍ରୀ)' };
    } else if (p.dignity === 'Friendly') {
      deeptadiAvastha = 'Mudita';
      deeptadiName = { en: 'Mudita (Joyful / In Friendly Sign)', hi: 'मुदित (हर्षित / मित्रगृही)', or: 'ମୁଦିତ (ଆନନ୍ଦିତ / ମିତ୍ରକ୍ଷେତ୍ରୀ)' };
    } else if (p.dignity === 'Debilitated') {
      deeptadiAvastha = 'Khala';
      deeptadiName = { en: 'Khala (Distressed / Debilitated)', hi: 'खल (नीच / कष्टप्रद)', or: 'ଖଳ (ନୀଚ / କଷ୍ଟପ୍ରଦ)' };
    } else if (p.dignity === 'Enemy') {
      deeptadiAvastha = 'Dina';
      deeptadiName = { en: 'Dina (Anxious / In Enemy Sign)', hi: 'दीन (चिंतित / शत्रुगृही)', or: 'ଦୀନ (ଚିନ୍ତିତ / ଶତ୍ରୁକ୍ଷେତ୍ରୀ)' };
    }

    // 3. Jagradadi Avastha (Awakening / Consciousness)
    let jagradadiAvastha: 'Jagrata' | 'Swapna' | 'Sushupti' = 'Swapna';
    let jagradadiName = { en: 'Swapna (Dreaming / 50% Active)', hi: 'स्वप्नावस्था (50% सक्रिय)', or: 'ସ୍ୱପ୍ନାବସ୍ଥା (୫୦% ସକ୍ରିୟ)' };

    if (['Deepta', 'Swastha'].includes(deeptadiAvastha)) {
      jagradadiAvastha = 'Jagrata';
      jagradadiName = { en: 'Jagrata (Awake / 100% Fully Conscious)', hi: 'जागृत अवस्था (100% पूर्ण जाग्रत)', or: 'ଜାଗ୍ରତ ଅବସ୍ଥା (୧୦୦% ପୂର୍ଣ୍ଣ ଜାଗ୍ରତ)' };
    } else if (['Khala', 'Dina'].includes(deeptadiAvastha)) {
      jagradadiAvastha = 'Sushupti';
      jagradadiName = { en: 'Sushupti (Deep Sleep / Dormant)', hi: 'सुषुप्ति अवस्था (सुप्त / विश्रामरत)', or: 'ସୁଷୁପ୍ତି ଅବସ୍ଥା (ସୁପ୍ତ / ବିଶ୍ରାମରତ)' };
    }

    // Multilingual Interpretation
    const interpEn = `${pName} is in ${baladiName.en} conferring approximately ${fruitPercentage}% capacity. Through its ${deeptadiName.en} dignity and ${jagradadiName.en} consciousness, its planetary rays express with focused clarity.`;
    const interpHi = `${pName} ${baladiName.hi} में स्थित होकर लगभग ${fruitPercentage}% फल देने में समर्थ है। ${deeptadiName.hi} और ${jagradadiName.hi} के प्रभाव से इसके परिणामों में स्थायित्व रहेगा।`;
    const interpOr = `${pName} ${baladiName.or}ରେ ପ୍ରାୟ ${fruitPercentage}% ଫଳ ଦେବାର କ୍ଷମତା ରଖନ୍ତି। ${deeptadiName.or} ଓ ${jagradadiName.or} ଯୋଗୁଁ ଏହାର ଫଳାଫଳ ଅନୁଭୂତ ହେବ।`;

    avasthas[pName] = {
      planet: pName,
      baladiAvastha,
      baladiName,
      fruitPercentage,
      deeptadiAvastha,
      deeptadiName,
      jagradadiAvastha,
      jagradadiName,
      interpretation: {
        en: interpEn,
        hi: interpHi,
        or: interpOr
      }
    };
  });

  return { avasthas };
}
