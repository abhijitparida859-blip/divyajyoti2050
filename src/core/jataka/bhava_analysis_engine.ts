import { ZodiacSign, PlanetName, PlanetPosition, HouseInfo, BhavaDetailedAnalysis, BhavaAnalysisItem } from '../../types/jataka';
import { RASHI_LORDS, ZODIAC_SIGNS } from './kundali_engine';

const BHAVA_METADATA = [
  {
    num: 1,
    name: { en: '1st House (Tanu Bhava)', hi: 'प्रथम भाव (तनु भाव / लग्न)', or: '୧ମ ଭାବ (ତନୁ ଭାବ / ଲଗ୍ନ)' },
    themes: {
      en: 'Self, Physical vitality, Appearance, Outlook on life, Longevity and General well-being.',
      hi: 'स्वयं, शारीरिक स्वास्थ्य, रूप-रंग, जीवन दृष्टिकोण, आत्मबल और आयु।',
      or: 'ନିଜର ବ୍ୟକ୍ତିତ୍ୱ, ଶାରୀରିକ ସ୍ୱାସ୍ଥ୍ୟ, ରୂପ-ସ୍ୱଭାବ, ଜୀବନ ଦୃଷ୍ଟିକୋଣ ଓ ଆତ୍ମବିଶ୍ୱାସ।'
    }
  },
  {
    num: 2,
    name: { en: '2nd House (Dhana Bhava)', hi: 'द्वितीय भाव (धन एवं कुटुंब भाव)', or: '୨ୟ ଭାବ (ଧନ ଓ କୁଟୁମ୍ବ ଭାବ)' },
    themes: {
      en: 'Accumulated wealth, Family lineage, Speech eloquence, Food habits, Face and Right eye.',
      hi: 'संचित धन, पैतृक संपत्ति, वाणी प्रभाव, खानपान, कुटुंब और मुख।',
      or: 'ସଞ୍ଚିତ ଧନ, ପୈତୃକ ସମ୍ପତ୍ତି, ବାଣୀର ପ୍ରଭାବ, କୁଟୁମ୍ବ ସମ୍ପର୍କ ଓ ମୁଖଶ୍ରୀ।'
    }
  },
  {
    num: 3,
    name: { en: '3rd House (Sahaja Bhava)', hi: 'तृतीय भाव (सहज एवं पराक्रम भाव)', or: '୩ୟ ଭାବ (ସହଜ ଓ ପରାକ୍ରମ ଭାବ)' },
    themes: {
      en: 'Courage, Younger siblings, Initiative, Communications, Short journeys, Arms and Artistic talents.',
      hi: 'पराक्रम, छोटे भाई-बहन, उद्यम, संवाद कौशल, लघु यात्राएं और कलात्मक रुचि।',
      or: 'ସାହସ, ସାନ ଭାଇଭଉଣୀ, ଉଦ୍ୟମ, କଥୋପକଥନ, କ୍ଷୁଦ୍ର ଯାତ୍ରା ଓ କଳାତ୍ମକ ପ୍ରତିଭା।'
    }
  },
  {
    num: 4,
    name: { en: '4th House (Sukha Bhava)', hi: 'चतुर्थ भाव (सुख एवं मातृ भाव)', or: '୪ର୍ଥ ଭାବ (ସୁଖ ଓ ମାତୃ ଭାବ)' },
    themes: {
      en: 'Mother, Inner emotional peace, Residential properties, Real estate, Vehicles and Formal education.',
      hi: 'माता, मानसिक शांति, भूमि-भवन, वाहन सुख, गृहस्थ सुख और प्रारंभिक शिक्षा।',
      or: 'ମାତୃସ୍ନେହ, ମାନସିକ ଶାନ୍ତି, ଗୃହ-ଜମିବାଡ଼ି, ଯାନବାହନ ସୁଖ ଓ ଆବାସିକ ପରିବେଶ।'
    }
  },
  {
    num: 5,
    name: { en: '5th House (Putra & Buddhi Bhava)', hi: 'पंचम भाव (संतान एवं विद्या भाव)', or: '୫ମ ଭାବ (ବିଦ୍ୟା ଓ ସନ୍ତାନ ଭାବ)' },
    themes: {
      en: 'Higher intelligence, Children, Creativity, Purva Punya (past life credit), Romance and Mantras.',
      hi: 'संतान, तीव्र बुद्धि, उच्च विद्या, पूर्व पुण्य, रचनात्मक प्रतिभा और मंत्र साधना।',
      or: 'ସନ୍ତାନ ସୁଖ, ପ୍ରଖର ବୁଦ୍ଧି, ଉଚ୍ଚ ଶିକ୍ଷା, ପୂର୍ବପୁଣ୍ୟ, ସୃଜନଶୀଳତା ଓ ଇଷ୍ଟକୃପା।'
    }
  },
  {
    num: 6,
    name: { en: '6th House (Ripu & Roga Bhava)', hi: 'षष्ठ भाव (शत्रु, रोग एवं ऋण भाव)', or: '୬ଷ୍ଠ ଭାବ (ରିପୁ, ରୋଗ ଓ ଋଣ ଭାବ)' },
    themes: {
      en: 'Litigation, Overcoming competition, Daily service, Debts, Digestive health and Maternal relatives.',
      hi: 'प्रतिस्पर्धा, रोग प्रतिरोधक क्षमता, ऋण मुक्ति, सेवा कार्य और मामा पक्ष।',
      or: 'ଶତ୍ରୁ ଦମନ, ପ୍ରତିଦ୍ୱନ୍ଦ୍ୱିତା, ସ୍ୱାସ୍ଥ୍ୟ ପ୍ରତିରୋଧକ ଶକ୍ତି, ଋଣ ଓ ନିଷ୍ଠାପର କର୍ତ୍ତବ୍ୟ।'
    }
  },
  {
    num: 7,
    name: { en: '7th House (Kalatra Bhava)', hi: 'सप्तम भाव (कलत्र एवं साझेदारी भाव)', or: '୭ମ ଭାବ (କଳତ୍ର ଓ ସହଭାଗିତା ଭାବ)' },
    themes: {
      en: 'Spouse, Marital harmony, Business partnerships, Public dealings and Diplomatic alliances.',
      hi: 'जीवनसाथी, वैवाहिक सामंजस्य, व्यापारिक साझेदारी और जनसंपर्क।',
      or: 'ଜୀବନସାଥୀ, ବୈବାହିକ ସୁଖ, ବ୍ୟବସାୟିକ ସହଭାଗିତା ଓ ସାମାଜିକ ପ୍ରତିଷ୍ଠା।'
    }
  },
  {
    num: 8,
    name: { en: '8th House (Ayu & Randhra Bhava)', hi: 'अष्टम भाव (आयु एवं गूढ़ विज्ञान भाव)', or: '୮ମ ଭାବ (ଆୟୁ ଓ ଗୂଢ଼ ରହସ୍ୟ ଭାବ)' },
    themes: {
      en: 'Longevity, Sudden unearned windfalls, Occult wisdom, Transformation, Research and Surgeries.',
      hi: 'दीर्घायु, गुप्त ज्ञान, आकस्मिक परिवर्तन, पैतृक लाभ, शोध और रहस्यान्वेषण।',
      or: 'ଆୟୁ, ଆକସ୍ମିକ ପରିବର୍ତ୍ତନ, ଗୂଢ଼ ଜ୍ୟୋତିଷ-ଅଧ୍ୟାତ୍ମ, ଗବେଷଣା ଓ ପୈତୃକ ଉତ୍ତରାଧିକାର।'
    }
  },
  {
    num: 9,
    name: { en: '9th House (Dharma & Bhagya Bhava)', hi: 'नवम भाव (धर्म एवं भाग्य भाव)', or: '୯ମ ଭାବ (ଧର୍ମ ଓ ଭାଗ୍ୟ ଭାବ)' },
    themes: {
      en: 'Divine fortune, Father, Gurus, Pilgrimages, Higher philosophy, Morality and Long-distance travel.',
      hi: 'भाग्य, धर्म, पिता, गुरु कृपा, तीर्थाटन, उच्च दर्शन और सदाचार।',
      or: 'ଭାଗ୍ୟୋଦୟ, ଧାର୍ମିକ ବିଶ୍ୱାସ, ପିତାଙ୍କ ଆଶୀର୍ବାଦ, ଗୁରୁକୃପା, ତୀର୍ଥାଟନ ଓ ନୈତିକତା।'
    }
  },
  {
    num: 10,
    name: { en: '10th House (Karma Bhava)', hi: 'दशम भाव (कर्म एवं यश भाव)', or: '୧୦ମ ଭାବ (କର୍ମ ଓ ଯଶ ଭାବ)' },
    themes: {
      en: 'Profession, Social status, Leadership, Authority, Government recognition and Public legacy.',
      hi: 'आजीविका, पद-प्रतिष्ठा, प्रशासनिक अधिकार, राजकृपा और सामाजिक नेतृत्व।',
      or: 'କର୍ମକ୍ଷେତ୍ର, ସରକାରୀ ସମ୍ମାନ, ପ୍ରତିଷ୍ଠା, ପଦବୀ, ନେତୃତ୍ୱ ଓ କାର୍ଯ୍ୟସିଦ୍ଧି।'
    }
  },
  {
    num: 11,
    name: { en: '11th House (Labha Bhava)', hi: 'एकादश भाव (लाभ एवं आय भाव)', or: '୧୧ଶ ଭାବ (ଲାଭ ଓ ଆୟ ଭାବ)' },
    themes: {
      en: 'Regular incoming cash flow, Wish fulfillment, Elder siblings, Influential social networks and Aspirations.',
      hi: 'आय, नियमित लाभ, मनोकामना पूर्ति, बड़े भाई-बहन और प्रभावशाली मित्र मंडली।',
      or: 'ଆୟ ଓ ଲାଭ, ମନୋସ୍କାମନା ପୂରଣ, ବଡ଼ ଭାଇଭଉଣୀ, ଉଚ୍ଚ ସାମାଜିକ ସମ୍ପର୍କ ଓ ସଫଳତା।'
    }
  },
  {
    num: 12,
    name: { en: '12th House (Vyaya Bhava)', hi: 'द्वादश भाव (व्यय, विदेश एवं मोक्ष भाव)', or: '୧୨ଶ ଭାବ (ବ୍ୟୟ, ବିଦେଶ ଓ ମୋକ୍ଷ ଭାବ)' },
    themes: {
      en: 'Foreign settlements, Spiritual liberation (Moksha), Philanthropy, Subconscious mind, Sleep and Expenses.',
      hi: 'विदेश प्रवास, मोक्ष, दान-पुण्य, शयन सुख, अंतर्मन और व्यय।',
      or: 'ବିଦେଶ ଯାତ୍ରା, ମୋକ୍ଷ ସାଧନା, ଧାର୍ମିକ ଦାନ, ନିଦ୍ରା ସୁଖ, ଅନ୍ତର୍ନିହିତ ଚିନ୍ତନ ଓ ଖର୍ଚ୍ଚ।'
    }
  }
];

export function calculateDetailedBhavaAnalysis(
  typedPlanets: Record<PlanetName, PlanetPosition>,
  houses: HouseInfo[],
  sarvashtakavarga: number[],
  ascSignIndex: number
): BhavaDetailedAnalysis {
  const bhavas: BhavaAnalysisItem[] = [];

  for (let h = 1; h <= 12; h++) {
    const houseIndex = h - 1;
    const signIndex = (ascSignIndex + houseIndex) % 12;
    const sign = ZODIAC_SIGNS[signIndex];
    const lord = RASHI_LORDS[sign];
    const lordPos = typedPlanets[lord];
    const lordPlacementHouse = ((lordPos.signIndex - ascSignIndex + 12) % 12) + 1;
    const lordDignity = lordPos.dignity || 'Neutral';

    // Occupants in this house
    const occupants: PlanetName[] = [];
    (Object.keys(typedPlanets) as PlanetName[]).forEach((pName) => {
      const p = typedPlanets[pName];
      const planetHouse = ((p.signIndex - ascSignIndex + 12) % 12) + 1;
      if (planetHouse === h) {
        occupants.push(pName);
      }
    });

    const savBindus = sarvashtakavarga[signIndex] ?? 28;

    // Calculate Composite Strength Score (0 to 100)
    let score = 50; // base

    // Lord dignity boost
    if (lordDignity === 'Exalted') score += 25;
    else if (lordDignity === 'Own' || lordDignity === 'Moolatrikona') score += 20;
    else if (lordDignity === 'Friendly') score += 10;
    else if (lordDignity === 'Debilitated') score -= 22;
    else if (lordDignity === 'Enemy') score -= 10;

    // Lord placement: Kendra (1,4,7,10) or Trikona (1,5,9) is auspicious
    if ([1, 4, 7, 10].includes(lordPlacementHouse)) score += 12;
    else if ([5, 9].includes(lordPlacementHouse)) score += 15;
    else if ([6, 8, 12].includes(lordPlacementHouse)) score -= 14;

    // Occupants benefic / malefic effect
    occupants.forEach((p) => {
      if (['Guru', 'Shukra', 'Budha'].includes(p)) score += 6;
      else if (['Shani', 'Rahu', 'Ketu', 'Mangala'].includes(p)) {
        // Upachaya houses (3, 6, 10, 11) welcome malefics!
        if ([3, 6, 10, 11].includes(h)) score += 8;
        else score -= 6;
      }
    });

    // SAV bindus impact (Avg is 28)
    const savDiff = savBindus - 28;
    score += savDiff * 1.5;

    score = Math.max(15, Math.min(98, Math.round(score)));

    const meta = BHAVA_METADATA[houseIndex];

    // Build multilingual detailed predictions
    let predEn = `${meta.name.en} is ruled by ${lord} placed in the ${lordPlacementHouse}th house in a ${lordDignity.toLowerCase()} state. `;
    let predHi = `${meta.name.hi} के स्वामी ${lord} ${lordPlacementHouse}वें भाव में ${lordDignity} स्थिति में विराजमान हैं। `;
    let predOr = `${meta.name.or}ର ଅଧିପତି ${lord} ${lordPlacementHouse}ମ ଭାବରେ ${lordDignity} ସ୍ଥିତିରେ ଅବସ୍ଥାନ କରୁଛନ୍ତି। `;

    if (occupants.length > 0) {
      predEn += `Influenced by occupying planets: ${occupants.join(', ')}. `;
      predHi += `इस भाव में ${occupants.join(', ')} का प्रभाव स्थित है। `;
      predOr += `ଏହି ଭାବରେ ${occupants.join(', ')} ଉପସ୍ଥିତ ଅଛନ୍ତି। `;
    }

    if (score >= 70) {
      predEn += `With ${savBindus} Ashtakavarga bindus (Score: ${score}/100), this house is profoundly fortified, bestowing remarkable accomplishments in its key domains.`;
      predHi += `अष्टकवर्ग में ${savBindus} बिंदुओं और ${score}/100 शक्ति के साथ यह भाव अत्यंत प्रबल है, जो इस क्षेत्र में अप्रत्याशित सफलता और समृद्धि प्रदान करेगा।`;
      predOr += `ଅଷ୍ଟକବର୍ଗରେ ${savBindus} ବିନ୍ଦୁ ଏବଂ ${score}/100 ଶକ୍ତି ସହ ଏହି ଭାବ ଅତ୍ୟନ୍ତ ବଳବାନ, ଯାହା ଏହି କ୍ଷେତ୍ରରେ ଉତ୍ତମ ସଫଳତା ପ୍ରଦାନ କରିବ।`;
    } else if (score >= 48) {
      predEn += `With ${savBindus} Ashtakavarga bindus (Score: ${score}/100), this house exhibits stable, dependable results through steady efforts.`;
      predHi += `अष्टकवर्ग में ${savBindus} बिंदुओं और ${score}/100 शक्ति के साथ यह भाव संतुलित फल देगा। नियमित प्रयासों से निरंतर प्रगति होगी।`;
      predOr += `ଅଷ୍ଟକବର୍ଗରେ ${savBindus} ବିନ୍ଦୁ ଓ ${score}/100 ସହ ଏହି ଭାବ ସନ୍ତୁଳିତ ଫଳ ପ୍ରଦାନ କରିବ। ନିରନ୍ତର ଚେଷ୍ଟାରେ ଉନ୍ନତି ହେବ।`;
    } else {
      predEn += `With ${savBindus} Ashtakavarga bindus (Score: ${score}/100), this domain encounters occasional tests; applying remedial discipline and mindfulness yields gradual mastery.`;
      predHi += `अष्टकवर्ग में ${savBindus} बिंदुओं और ${score}/100 शक्ति के साथ यह भाव चुनौतियों का संकेत देता है; संयम और उपायों से शुभता प्राप्त होगी।`;
      predOr += `ଅଷ୍ଟକବର୍ଗରେ ${savBindus} ବିନ୍ଦୁ ଓ ${score}/100 ଶକ୍ତି ଥିବାରୁ ଏହି କ୍ଷେତ୍ରରେ ଧୈର୍ଯ୍ୟ ଓ ଉପାୟ ଆବଶ୍ୟକ। ସତର୍କତା ଅବଲମ୍ବନ କଲେ ଶୁଭଫଳ ମିଳିବ।`;
    }

    bhavas.push({
      houseNumber: h,
      houseName: meta.name,
      sign,
      lord,
      lordPlacementHouse,
      lordDignity,
      occupants,
      savBindus,
      strengthScore: score,
      keyThemes: meta.themes,
      detailedPrediction: {
        en: predEn,
        hi: predHi,
        or: predOr
      }
    });
  }

  // Find strongest and most challenging houses
  let highestScore = -1;
  let lowestScore = 999;
  let strongestHouse = 1;
  let challengingHouse = 6;

  bhavas.forEach((b) => {
    if (b.strengthScore > highestScore) {
      highestScore = b.strengthScore;
      strongestHouse = b.houseNumber;
    }
    if (b.strengthScore < lowestScore) {
      lowestScore = b.strengthScore;
      challengingHouse = b.houseNumber;
    }
  });

  return {
    bhavas,
    strongestHouse,
    challengingHouse
  };
}
