import { PlanetName, PlanetPosition, ZodiacSign, HouseInfo, ComprehensiveLifeDomainsData, DomainPredictionItem } from '../../types/jataka';
import { RASHI_LORDS } from './kundali_engine';

export function calculateComprehensiveLifeDomains(
  typedPlanets: Record<PlanetName, PlanetPosition>,
  houses: HouseInfo[],
  ascSignIndex: number,
  sarvashtakavarga: number[]
): ComprehensiveLifeDomainsData {
  const domains: DomainPredictionItem[] = [];

  // Helper to get house lord
  const getHouseLord = (hNum: number): PlanetName => {
    const sIndex = (ascSignIndex + hNum - 1) % 12;
    const sign = houses[hNum - 1]?.sign || 'Mesha';
    return RASHI_LORDS[sign];
  };

  // Helper to calculate rating (1 to 5) based on SAV and Lord placement
  const getDomainScore = (hNum: number, primaryPlanet: PlanetName): number => {
    const signIdx = (ascSignIndex + hNum - 1) % 12;
    const sav = sarvashtakavarga[signIdx] || 28;
    const lord = getHouseLord(hNum);
    const lordDignity = typedPlanets[lord]?.dignity || 'Neutral';
    const planetDignity = typedPlanets[primaryPlanet]?.dignity || 'Neutral';

    let score = 3;
    if (sav >= 32) score += 1;
    if (sav < 25) score -= 1;
    if (lordDignity === 'Exalted' || lordDignity === 'Own') score += 1;
    if (planetDignity === 'Exalted' || planetDignity === 'Own') score += 1;
    if (lordDignity === 'Debilitated' || planetDignity === 'Debilitated') score -= 1;

    return Math.max(1, Math.min(5, score));
  };

  // 1. Career & Professional Legacy
  const careerScore = getDomainScore(10, 'Surya');
  const careerLord = getHouseLord(10);
  domains.push({
    domainId: 'career',
    title: { en: 'Career & Professional Eminence', hi: 'आजीविका, पद एवं प्रतिष्ठा', or: 'କର୍ମ, ପଦବୀ ଓ ଆଜୀବିକା' },
    keyPlanets: [careerLord, 'Surya', 'Shani'],
    auspiciousHouses: [1, 10, 11],
    rating: careerScore,
    analysis: {
      en: `10th house is governed by ${careerLord}. With strong karmic configurations, you possess natural administrative resilience and leadership. Careers in governance, strategic technology, executive enterprise, or structured consulting promise high fulfillment.`,
      hi: `दशम भाव के अधिपति ${careerLord} हैं। प्रशासनिक क्षमता, नेतृत्व और उत्तरदायित्व संभालने में आप निपुण हैं। प्रबंधन, शासन, तकनीक या स्वतंत्र व्यवसाय में दीर्घकालिक ख्याति प्राप्त होगी।`,
      or: `୧୦ମ ଭାବର ଅଧିପତି ${careerLord} ଅଟନ୍ତି। ଆପଣଙ୍କ ଠାରେ ଉତ୍ତମ ନେତୃତ୍ୱ, ପ୍ରଶାସନିକ ଦକ୍ଷତା ଓ ନିଷ୍ଠା ଅଛି। ସରକାରୀ ସମ୍ମାନ, ଉଚ୍ଚ ପ୍ରବନ୍ଧନ, ଆଇଟି କିମ୍ବା ବ୍ୟବସାୟରେ ବିଶେଷ ସଫଳତା ପ୍ରାପ୍ତ ହେବ।`
    },
    milestoneYears: [24, 28, 32, 36, 42, 48],
    strategicRemedy: {
      en: 'Honor the rising Sun with Arghya and maintain uncompromising professional ethics.',
      hi: 'प्रातःकाल सूर्य को तांबे के लोटे से जल अर्पित करें और कार्यस्थल पर सत्यनिष्ठा बनाए रखें।',
      or: 'ପ୍ରାତଃ ସୂର୍ଯ୍ୟଙ୍କୁ ଜଳଦାନ କରନ୍ତୁ ଏବଂ କର୍ମକ୍ଷେତ୍ରରେ ସର୍ବଦା ନୈତିକତା ବଜାୟ ରଖନ୍ତୁ।'
    }
  });

  // 2. Wealth & Financial Prosperity
  const wealthScore = getDomainScore(2, 'Guru');
  const wealthLord = getHouseLord(2);
  const gainsLord = getHouseLord(11);
  domains.push({
    domainId: 'wealth',
    title: { en: 'Wealth, Assets & Financial Expansion', hi: 'धन, समृद्धि एवं संचित पूंजी', or: 'ଧନ, ସମ୍ପତ୍ତି ଓ ଆର୍ଥିକ ସମୃଦ୍ଧି' },
    keyPlanets: [wealthLord, gainsLord, 'Guru', 'Shukra'],
    auspiciousHouses: [2, 11, 4],
    rating: wealthScore,
    analysis: {
      en: `2nd House (accumulation) ruled by ${wealthLord} and 11th House (gains) ruled by ${gainsLord} indicate reliable avenues of revenue. Consistent capital accumulation through disciplined investments in land, diversified funds, and enterprise.`,
      hi: `द्वितीय भाव के स्वामी ${wealthLord} और एकादश भाव के स्वामी ${gainsLord} वित्तीय स्थिरता दर्शाते हैं। भूमि, दीर्घकालिक निवेश और व्यापार से स्थिर धन वृद्धि होगी।`,
      or: `୨ୟ ଭାବପତି ${wealthLord} ଓ ୧୧ଶ ଭାବପତି ${gainsLord} ଆର୍ଥିକ ଉନ୍ନତିର ସୂଚକ। ଜମିବାଡ଼ି, ସ୍ଥିର ସଞ୍ଚୟ ଓ ସୁଚିନ୍ତିତ ନିବେଶ ଦ୍ୱାରା ଧନବୃଦ୍ଧି ଘଟିବ।`
    },
    milestoneYears: [25, 29, 33, 40, 47, 54],
    strategicRemedy: {
      en: 'Chant Kanakadhara Stotra on Fridays and cultivate compassionate charity.',
      hi: 'शुक्रवार को कनकधारा स्तोत्र का पाठ करें और अन्न दान करें।',
      or: 'ଶୁକ୍ରବାର ଦିନ କନକଧାରା ସ୍ତୋତ୍ର ପାଠ କରନ୍ତୁ ଓ ଦରିଦ୍ରଙ୍କୁ ଅନ୍ନଦାନ କରନ୍ତୁ।'
    }
  });

  // 3. Marriage & Harmonious Relationships
  const marriageScore = getDomainScore(7, 'Shukra');
  const marriageLord = getHouseLord(7);
  domains.push({
    domainId: 'marriage',
    title: { en: 'Marriage, Spouse & Alliances', hi: 'विवाह, जीवनसाथी एवं सामंजस्य', or: 'ବିବାହ, ଜୀବନସାଥୀ ଓ ଦାମ୍ପତ୍ୟ' },
    keyPlanets: [marriageLord, 'Shukra', 'Guru'],
    auspiciousHouses: [7, 2, 4],
    rating: marriageScore,
    analysis: {
      en: `7th house ruled by ${marriageLord} highlights a companion of intellect, refined aesthetics, and loyal family background. Mutual transparency, emotional patience, and respect ensure deep marital contentment.`,
      hi: `सप्तम भाव के स्वामी ${marriageLord} बुद्धिमान और सुरुचिपूर्ण जीवनसाथी का संकेत देते हैं। परस्पर विश्वास और संवाद से दांपत्य जीवन सुखद रहेगा।`,
      or: `୭ମ ଭାବର ଅଧିପତି ${marriageLord} ସୁଶୀଳା, ବୁଦ୍ଧିମତୀ ଓ ସଂସ୍କାରୀ ଜୀବନସାଥୀଙ୍କ ସୂଚନା ଦିଅନ୍ତି। ପରସ୍ପର ପ୍ରତି ସମ୍ମାନ ଓ ବିଶ୍ୱାସ ଦ୍ୱାରା ଦାମ୍ପତ୍ୟ ଜୀବନ ସୁଖମୟ ହେବ।`
    },
    milestoneYears: [26, 28, 30, 32],
    strategicRemedy: {
      en: 'Worship Goddess Lakshmi and Lord Jagannath; keep peaceful mutual respect during arguments.',
      hi: 'माता लक्ष्मी और भगवान जगन्नाथ की उपासना करें तथा क्रोध से बचें।',
      or: 'ମାତା ଲକ୍ଷ୍ମୀ ଓ ମହାପ୍ରଭୁ ଶ୍ରୀଜଗନ୍ନାଥଙ୍କ ଆରାଧନା କରନ୍ତୁ ଏବଂ କ୍ରୋଧରୁ ଦୂରେଇ ରୁହନ୍ତୁ।'
    }
  });

  // 4. Health, Vitality & Longevity
  const healthScore = getDomainScore(1, 'Surya');
  const ascLord = getHouseLord(1);
  domains.push({
    domainId: 'health',
    title: { en: 'Health, Vitality & Physical Longevity', hi: 'आरोग्य, जीवन शक्ति एवं दीर्घायु', or: 'ସ୍ୱାସ୍ଥ୍ୟ, ଶାରୀରିକ ତେଜ ଓ ଆୟୁଷ' },
    keyPlanets: [ascLord, 'Surya', 'Mangala'],
    auspiciousHouses: [1, 5, 9],
    rating: healthScore,
    analysis: {
      en: `Ascendant lord ${ascLord} bestows robust recuperative endurance. Balancing digestive metabolism (Pitta) and avoiding mental strain overwork stabilizes overall stamina.`,
      hi: `लग्नेश ${ascLord} उत्तम रोग प्रतिरोधक क्षमता प्रदान करते हैं। नियमित दिनचर्या, प्राणायाम और सुपाच्य भोजन से स्वास्थ्य सदा उत्तम रहेगा।`,
      or: `ଲଗ୍ନାଧିପତି ${ascLord} ଶରୀରରେ ଉତ୍ତମ ରୋଗ ପ୍ରତିରୋଧକ ଶକ୍ତି ପ୍ରଦାନ କରନ୍ତି। ନିୟମିତ ଯୋଗ, ପ୍ରାଣାୟାମ ଓ ସ୍ନିଗ୍ଧ ଆହାର ଦ୍ୱାରା ସ୍ୱାସ୍ଥ୍ୟ ସଦା ଉତ୍ତମ ରହିବ।`
    },
    milestoneYears: [18, 36, 45, 60, 72],
    strategicRemedy: {
      en: 'Practice daily Pranayama, consume pure water, and chant Maha Mrityunjaya mantra.',
      hi: 'प्रतिदिन महामृत्युंजय मंत्र का जप करें और नियमित व्यायाम करें।',
      or: 'ନିୟମିତ ମହାମୃତ୍ୟୁଞ୍ଜୟ ମନ୍ତ୍ର ଜପ କରନ୍ତୁ ଏବଂ ଶୁଦ୍ଧ ଜୀବନଶୈଳୀ ପାଳନ କରନ୍ତୁ।'
    }
  });

  // 5. Higher Intellect & Education
  const eduScore = getDomainScore(5, 'Budha');
  const eduLord = getHouseLord(5);
  domains.push({
    domainId: 'education',
    title: { en: 'Higher Intellect, Wisdom & Learning', hi: 'उच्च विद्या, प्रज्ञा एवं अनुसंधान', or: 'ଉଚ୍ଚ ଶିକ୍ଷା, ପ୍ରଜ୍ଞା ଓ ବୌଦ୍ଧିକ ପ୍ରତିଭା' },
    keyPlanets: [eduLord, 'Budha', 'Guru'],
    auspiciousHouses: [5, 4, 9],
    rating: eduScore,
    analysis: {
      en: `5th house governed by ${eduLord} confers sharp analytical grasping power, creative insight, and scholarly depth. Strong prospects for higher degrees, certifications, and specialized mastery.`,
      hi: `पंचम भाव के स्वामी ${eduLord} तीव्र बुद्धि और शोध क्षमता प्रदान करते हैं। उच्च शिक्षा, तकनीकी डिग्री और परामर्श में विशेष सफलता मिलेगी।`,
      or: `୫ମ ଭାବପତି ${eduLord} ପ୍ରଖର ବୁଦ୍ଧି ଓ ଅନୁସନ୍ଧାନ କ୍ଷମତା ଦିଅନ୍ତି। ଉଚ୍ଚ ଡିଗ୍ରୀ, ବିଦେଶୀ ଶିକ୍ଷା ଓ ବିଶେଷଜ୍ଞ ଜ୍ଞାନ ଅର୍ଜନରେ କୃତିତ୍ୱ ହାସଲ ହେବ।`
    },
    milestoneYears: [16, 21, 25, 31],
    strategicRemedy: {
      en: 'Worship Goddess Saraswati and chant Gayatri Mantra during Brahma Muhurta.',
      hi: 'ब्रह्म मुहूर्त में गायत्री मंत्र का जप करें और मां सरस्वती की वंदना करें।',
      or: 'ବ୍ରାହ୍ମ ମୁହୂର୍ତ୍ତରେ ଗାୟତ୍ରୀ ମନ୍ତ୍ର ଜପ କରନ୍ତୁ ଓ ମାତା ସରସ୍ୱତୀଙ୍କ ଧ୍ୟାନ କରନ୍ତୁ।'
    }
  });

  // 6. Foreign Travel & Spiritual Moksha
  const spiritScore = getDomainScore(12, 'Ketu');
  const foreignLord = getHouseLord(12);
  domains.push({
    domainId: 'spirituality',
    title: { en: 'Foreign Travels, Pilgrimages & Moksha', hi: 'विदेश यात्रा, तीर्थाटन एवं मोक्ष', or: 'ବିଦେଶ ଯାତ୍ରା, ତୀର୍ଥାଟନ ଓ ମୋକ୍ଷ ସାଧନା' },
    keyPlanets: [foreignLord, 'Ketu', 'Guru'],
    auspiciousHouses: [9, 12, 8],
    rating: spiritScore,
    analysis: {
      en: `12th house governed by ${foreignLord} combined with 9th house spiritual connections confirms deep affinity for distant journeys, sacred shrines, and philosophical introspection.`,
      hi: `द्वादश भाव के स्वामी ${foreignLord} विदेश यात्राओं और आध्यात्मिक तीर्थाटन का सुंदर योग बनाते हैं। अंतर्मुखी साधना से असीम मानसिक शांति मिलेगी।`,
      or: `୧୨ଶ ଭାବପତି ${foreignLord} ବିଦେଶ ଭ୍ରମଣ, ପବିତ୍ର ତୀର୍ଥାଟନ ଓ ଗୂଢ଼ ଆଧ୍ୟାତ୍ମିକ ସାଧନାର ଯୋଗ ସୃଷ୍ଟି କରନ୍ତି। ଈଶ୍ୱର ଚିନ୍ତନ ଦ୍ୱାରା ପରମ ଶାନ୍ତି ମିଳିବ।`
    },
    milestoneYears: [27, 33, 42, 51, 63],
    strategicRemedy: {
      en: 'Visit sacred shrines (Puri Srimandir / Char Dhams) and support philanthropic educational causes.',
      hi: 'तीर्थ यात्रा करें और आध्यात्मिक ग्रंथों का स्वाध्याय करें।',
      or: 'ପୁରୀ ଶ୍ରୀମନ୍ଦିର କିମ୍ବା ପବିତ୍ର ତୀର୍ଥ ଦର୍ଶନ କରନ୍ତୁ ଏବଂ ଧାର୍ମିକ ଦାନ କରନ୍ତୁ।'
    }
  });

  return {
    domains,
    primeFocusDomain: 'Career & Professional Eminence'
  };
}
