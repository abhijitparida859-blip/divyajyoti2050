import { ZodiacSign, DailyPersonalGuideData } from '../../types/jataka';
import { NAKSHATRA_NAMES } from '../panjika/panjika_engine';
import { ZODIAC_SIGNS } from './kundali_engine';

const TARABALA_TYPES = [
  {
    type: 'Janma',
    name: { en: 'Janma Tara (Physical Body & Mind)', hi: 'जन्म तारा (शरीर एवं मन)', or: 'ଜନ୍ମ ତାରା (ତନୁ ଓ ମନ)' },
    isAuspicious: false,
    guidance: {
      en: 'Mixed or sensitive influence. Pay attention to physical energy, avoid overexertion or mental agitation.',
      hi: 'शारीरिक एवं मानसिक संवेदनशीलता रह सकती है। अत्यधिक तनाव या विवाद से बचें।',
      or: 'ଶାରୀରିକ ଓ ମାନସିକ ସ୍ତରରେ ସତର୍କତା ଆବଶ୍ୟକ। ଶାନ୍ତ ରହି ନିଜ କାର୍ଯ୍ୟ କରନ୍ତୁ।'
    }
  },
  {
    type: 'Sampat',
    name: { en: 'Sampat Tara (Wealth & Prosperity)', hi: 'सम्पत तारा (धन एवं समृद्धि)', or: 'ସମ୍ପଦ ତାରା (ଧନ ଓ ସମୃଦ୍ଧି)' },
    isAuspicious: true,
    guidance: {
      en: 'Highly auspicious! Ideal for financial negotiations, lucrative investments, career milestones and joy.',
      hi: 'अत्यंत शुभ! धन लाभ, व्यापारिक लेन-देन, नए सौदे और प्रसन्नता के लिए श्रेष्ठ दिन।',
      or: 'ଅତ୍ୟନ୍ତ ଶୁଭ! ଆର୍ଥିକ ଲାଭ, ନୂତନ ବ୍ୟବସାୟ, ଚୁକ୍ତିପତ୍ର ଓ ମାଙ୍ଗଳିକ କାର୍ଯ୍ୟ ପାଇଁ ଉତ୍ତମ।'
    }
  },
  {
    type: 'Vipat',
    name: { en: 'Vipat Tara (Obstacles & Risk)', hi: 'विपत तारा (बाधा एवं संकट)', or: 'ବିପଦ ତାରା (ପ୍ରତିବନ୍ଧକ ଓ ବିପଦ)' },
    isAuspicious: false,
    guidance: {
      en: 'Challenging. Exercise extreme prudence in driving, signing contracts, and lending capital.',
      hi: 'प्रतिकूल प्रभाव। यात्रा, आर्थिक जोखिम और महत्वपूर्ण दस्तावेजों पर हस्ताक्षर से बचें।',
      or: 'ପ୍ରତିକୂଳ ପ୍ରଭାବ। ଦ୍ରୁତ ଯାନ ଚାଳନା, ଋଣ କାରବାର ଓ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ଚୁକ୍ତି ଠାରୁ ଦୂରେଇ ରୁହନ୍ତୁ।'
    }
  },
  {
    type: 'Kshema',
    name: { en: 'Kshema Tara (Well-being & Security)', hi: 'क्षेम तारा (कल्याण एवं सुरक्षा)', or: 'କ୍ଷେମ ତାରା (କଲ୍ୟାଣ ଓ ସୁରକ୍ଷା)' },
    isAuspicious: true,
    guidance: {
      en: 'Very favorable! Bestows mental serenity, domestic harmony, successful recovery, and stable progress.',
      hi: 'अति शुभ फलदायी! पारिवारिक सुख, मानसिक शांति, कार्य सिद्धि और आरोग्य लाभ होगा।',
      or: 'ଅତୀବ ଶୁଭ! ପାରିବାରିକ ସୁଖ, ସ୍ୱାସ୍ଥ୍ୟ ଉନ୍ନତି ଓ ସମସ୍ତ କାର୍ଯ୍ୟରେ ଶାନ୍ତିପୂର୍ଣ୍ଣ ସଫଳତା ମିଳିବ।'
    }
  },
  {
    type: 'Pratyari',
    name: { en: 'Pratyari Tara (Opposition & Disputes)', hi: 'प्रत्यरि तारा (शत्रुता एवं मतभेद)', or: 'ପ୍ରତ୍ୟରି ତାରା (ଶତ୍ରୁତା ଓ ବାଧା)' },
    isAuspicious: false,
    guidance: {
      en: 'Prone to misunderstandings or competition. Keep diplomatic speech and stay away from unnecessary debates.',
      hi: 'मतभेद और विवाद की संभावना। कटु वाणी से बचें और धैर्यपूर्वक कार्य संपन्न करें।',
      or: 'ଶତ୍ରୁତା କିମ୍ବା ମତଭେଦର ସମ୍ଭାବନା। କଥାବାର୍ତ୍ତାରେ ସଂଯମ ରଖନ୍ତୁ ଓ ଅଯଥା ତର୍କରୁ ବଞ୍ଚନ୍ତୁ।'
    }
  },
  {
    type: 'Sadhaka',
    name: { en: 'Sadhaka Tara (Achievement & Fulfilment)', hi: 'साधक तारा (कार्य सिद्धि एवं सफलता)', or: 'ସାଧକ ତାରା (କାର୍ଯ୍ୟସିଦ୍ଧି ଓ ବିଜୟ)' },
    isAuspicious: true,
    guidance: {
      en: 'Extraordinarily productive! Targets materialize swiftly; excellent for interviews, exams and launches.',
      hi: 'सर्वतोमुखी सफलता! साक्षात्कार, परीक्षा, नई योजनाएं और जटिल कार्य सफलतापूर्वक सिद्ध होंगे।',
      or: 'ଅଭୂତପୂର୍ବ ସଫଳତା! ପରୀକ୍ଷା, ସାକ୍ଷାତକାର, ନୂତନ ଉଦ୍ୟମ ଓ କାର୍ଯ୍ୟାରମ୍ଭ ପାଇଁ ସର୍ବୋତ୍ତମ।'
    }
  },
  {
    type: 'Vadha',
    name: { en: 'Vadha Tara (Danger & Destructive)', hi: 'वध तारा (कष्ट एवं हानि)', or: 'ବଧ ତାରା (ଅଶୁଭ ଓ କଷ୍ଟ)' },
    isAuspicious: false,
    guidance: {
      en: 'Inauspicious. Avoid confrontations, risky adventures, medical surgeries if non-urgent, and aggressive acts.',
      hi: 'अत्यंत सावधान रहें। वाद-विवाद, जोखिम भरे कार्य और जल्दबाजी के निर्णयों से बचें।',
      or: 'ଅଶୁଭ ସମୟ। ଆପଦଜନକ କାର୍ଯ୍ୟ, ବିବାଦ ଓ ନୂତନ କାର୍ଯ୍ୟାରମ୍ଭରୁ ସମ୍ପୂର୍ଣ୍ଣ ବିରତ ରୁହନ୍ତୁ।'
    }
  },
  {
    type: 'Mitra',
    name: { en: 'Mitra Tara (Friendly & Cooperative)', hi: 'मित्र तारा (सौहार्द एवं सहयोग)', or: 'ମିତ୍ର ତାରା (ସୌହାର୍ଦ୍ଦ ଓ ସହଯୋଗ)' },
    isAuspicious: true,
    guidance: {
      en: 'Delightful and beneficial. Allies extend warmth, joyful social engagements, constructive brainstorming.',
      hi: 'शुभ दिन! मित्रों और सहयोगियों से सहायता मिलेगी। सामाजिक कार्यों में प्रतिष्ठा बढ़ेगी।',
      or: 'ଆନନ୍ଦଦାୟକ ଓ ଶୁଭ! ବନ୍ଧୁମାନଙ୍କ ସହଯୋଗ, ଉତ୍ସାହ ଓ ସାମାଜିକ ପ୍ରତିଷ୍ଠା ବୃଦ୍ଧି ପାଇବ।'
    }
  },
  {
    type: 'Ati-Mitra',
    name: { en: 'Ati-Mitra Tara (Supreme Friendship & Bliss)', hi: 'अतिमित्र तारा (परम मित्रता एवं आनंद)', or: 'ଅତିମିତ୍ର ତାରା (ପରମ ଆନନ୍ଦ ଓ ସମ୍ପର୍କ)' },
    isAuspicious: true,
    guidance: {
      en: 'Supreme auspiciousness! Divine grace flows easily; deep bonds, celebratory news, and spiritual upliftment.',
      hi: 'परम शुभ एवं फलदायी! शुभ समाचार, धार्मिक अनुष्ठान और प्रगाढ़ प्रेम-सौहार्द का सुंदर योग।',
      or: 'ପରମ ଶୁଭ ଦିବସ! ଈଶ୍ୱରୀୟ କୃପା, ଆନନ୍ଦୋତ୍ସବ, ଶୁଭ ସମ୍ବାଦ ଓ ଧାର୍ମିକ କାର୍ଯ୍ୟ ପାଇଁ ଶ୍ରେଷ୍ଠ।'
    }
  }
];

export function calculateDailyPersonalGuide(
  natalMoonDegree: number,
  natalMoonSign: ZodiacSign,
  transitMoonDegree: number,
  transitMoonSign: ZodiacSign,
  currentDate: Date = new Date()
): DailyPersonalGuideData {
  const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

  const nakSpan = 360 / 27;
  const natalNakIdx = Math.min(26, Math.floor(natalMoonDegree / nakSpan));
  const transitNakIdx = Math.min(26, Math.floor(transitMoonDegree / nakSpan));
  const transitMoonNakshatra = NAKSHATRA_NAMES[transitNakIdx] || 'ଅଶ୍ୱିନୀ';

  // 1. Tarabala Calculation (1 to 9)
  const offset = (transitNakIdx - natalNakIdx + 27) % 27;
  const taraIdx = offset % 9; // 0 to 8
  const tarabala = TARABALA_TYPES[taraIdx];

  // 2. Chandrabala Calculation (House from Natal Moon, 1 to 12)
  const natalSignIdx = ZODIAC_SIGNS.indexOf(natalMoonSign);
  const transitSignIdx = ZODIAC_SIGNS.indexOf(transitMoonSign);
  const houseFromNatalMoon = ((transitSignIdx - natalSignIdx + 12) % 12) + 1;

  // Auspicious Chandra houses: 1, 3, 6, 7, 10, 11
  const isAuspiciousChandra = [1, 3, 6, 7, 10, 11].includes(houseFromNatalMoon);

  let chandraGuidance = {
    en: `Moon transits the ${houseFromNatalMoon}th house from your natal Moon, conferring auspicious strength and mental clarity.`,
    hi: `चंद्रमा आपकी जन्म राशि से ${houseFromNatalMoon}वें भाव में गोचर कर रहे हैं, जो शुभ बल और मानसिक प्रसन्नता प्रदान करेंगे।`,
    or: `ଚନ୍ଦ୍ର ଆପଣଙ୍କ ଜନ୍ମ ରାଶିରୁ ${houseFromNatalMoon}ମ ଭାବରେ ଗୋଚର କରୁଛନ୍ତି, ଯାହା ଶୁଭଫଳ ଓ ମାନସିକ ସନ୍ତୋଷ ପ୍ରଦାନ କରିବ।`
  };

  if (houseFromNatalMoon === 8) {
    chandraGuidance = {
      en: 'CAUTION: Ashtama Chandra (8th Moon transit). Keep calm, avoid major investments, risky travel, or emotional conflicts today.',
      hi: 'सावधान: अष्टम चंद्र गोचर। आज कोई बड़ा वित्तीय निर्णय न लें, यात्रा में सतर्कता बरतें और शांत रहें।',
      or: 'ସତର୍କତା: ଅଷ୍ଟମ ଚନ୍ଦ୍ର ଚଳନ! ଆଜି କୌଣସି ବଡ଼ ଆର୍ଥିକ ନିଷ୍ପତ୍ତି ନିଅନ୍ତୁ ନାହିଁ, ଯାତ୍ରାରେ ସାବଧାନ ରୁହନ୍ତୁ ଓ ଶାନ୍ତ ମନ ରଖନ୍ତୁ।'
    };
  } else if (!isAuspiciousChandra) {
    chandraGuidance = {
      en: `Moon transits the ${houseFromNatalMoon}th house (less favorable). Approach important affairs with patience and careful planning.`,
      hi: `चंद्रमा आपकी जन्म राशि से ${houseFromNatalMoon}वें भाव में हैं। कार्यों में धैर्य और अतिरिक्त सावधानी बरतें।`,
      or: `ଚନ୍ଦ୍ର ଆପଣଙ୍କ ଜନ୍ମ ରାଶିରୁ ${houseFromNatalMoon}ମ ଭାବରେ ଅବସ୍ଥିତ। ନିଷ୍ପତ୍ତି ନେବାରେ ଧୈର୍ଯ୍ୟ ରଖନ୍ତୁ ଓ ସତର୍କ ରୁହନ୍ତୁ।`
    };
  }

  // 3. Lucky Guidelines based on Day of Week and Transit Moon
  const dayOfWeek = currentDate.getDay(); // 0: Sun, 1: Mon, ...
  const luckyColors = [
    { en: 'Crimson / Orange', hi: 'लाल / नारंगी', or: 'ନାଲି / କମଳା' }, // Sun
    { en: 'Pearl White / Cream', hi: 'श्वेत / क्रीम', or: 'ଧଳା / କ୍ଷୀର ରଙ୍ଗ' }, // Mon
    { en: 'Coral Red / Vermillion', hi: 'सिंदूरी लाल', or: 'ସିନ୍ଦୂର ଲାଲ' }, // Tue
    { en: 'Emerald Green', hi: 'हरा / पन्ना', or: 'ଶାଗୁଆ / ସବୁଜ' }, // Wed
    { en: 'Golden Yellow', hi: 'पीला / स्वर्णिम', or: 'ହଳଦିଆ / ସୁବର୍ଣ୍ଣ' }, // Thu
    { en: 'Silver / Bright White', hi: 'चमकदार सफेद', or: 'ଚମକଦାର ଧଳା' }, // Fri
    { en: 'Navy Blue / Black', hi: 'नीला / काला', or: 'ନୀଳ / କଳା' } // Sat
  ];

  const luckyNumbers = [1, 2, 9, 5, 3, 6, 8];
  const luckyDirections = [
    { en: 'East (Purva)', hi: 'पूर्व दिशा', or: 'ପୂର୍ବ ଦିଗ' },
    { en: 'North-West (Vayavya)', hi: 'उत्तर-पश्चिम दिशा', or: 'ବାୟବ୍ୟ କୋଣ' },
    { en: 'South (Dakshina)', hi: 'दक्षिण दिशा', or: 'ଦକ୍ଷିଣ ଦିଗ' },
    { en: 'North (Uttara)', hi: 'उत्तर दिशा', or: 'ଉତ୍ତର ଦିଗ' },
    { en: 'North-East (Ishanya)', hi: 'ईशान कोण', or: 'ଈଶାନ୍ୟ କୋଣ' },
    { en: 'South-East (Agneya)', hi: 'आग्नेय कोण', or: 'ଆଗ୍ନେୟ କୋଣ' },
    { en: 'West (Pashchima)', hi: 'पश्चिम दिशा', or: 'ପଶ୍ଚିମ ଦିଗ' }
  ];

  const mantras = [
    'ଓଁ ସୂର୍ଯ୍ୟାୟ ନମଃ | ॐ सूर्याय नमः',
    'ଓଁ ସୋମାୟ ନମଃ | ॐ सोमाय नमः',
    'ଓଁ ଭୌମାୟ ନମଃ | ॐ भौमाय नमः',
    'ଓଁ ବୁଧାୟ ନମଃ | ॐ बुधाय नमः',
    'ଓଁ ବୃହସ୍ପତୟେ ନମଃ | ॐ बृहस्पतये नमः',
    'ଓଁ ଶୁକ୍ରାୟ ନମଃ | ॐ शुक्राय नमः',
    'ଓଁ ଶନିଶ୍ଚରାୟ ନମଃ | ॐ शनैश्चराय नमः'
  ];

  return {
    dateStr,
    transitMoonSign,
    transitMoonNakshatra,
    tarabala: {
      taraType: tarabala.type,
      taraName: tarabala.name,
      isAuspicious: tarabala.isAuspicious,
      guidance: tarabala.guidance
    },
    chandrabala: {
      houseFromNatalMoon,
      isAuspicious: isAuspiciousChandra,
      guidance: chandraGuidance
    },
    luckyGuidelines: {
      color: luckyColors[dayOfWeek],
      number: luckyNumbers[dayOfWeek],
      direction: luckyDirections[dayOfWeek],
      mantra: mantras[dayOfWeek]
    }
  };
}
