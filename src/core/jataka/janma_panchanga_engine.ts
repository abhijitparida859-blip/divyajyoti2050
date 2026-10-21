import { JanmaPanchangaData, PlanetName } from '../../types/jataka';
import { NAKSHATRA_NAMES } from '../panjika/panjika_engine';
import { normalizeDegrees } from '../astronomy/ephemeris';

const TITHI_NAMES = [
  { en: 'Shukla Pratipada', hi: 'शुक्ल प्रतिपदा', or: 'ଶୁକ୍ଳ ପ୍ରତିପଦା' },
  { en: 'Shukla Dwitiya', hi: 'शुक्ल द्वितीया', or: 'ଶୁକ୍ଳ ଦ୍ୱିତୀୟା' },
  { en: 'Shukla Tritiya', hi: 'शुक्ल तृतीया', or: 'ଶୁକ୍ଳ ତୃତୀୟା' },
  { en: 'Shukla Chaturthi', hi: 'शुक्ल चतुर्थी', or: 'ଶୁକ୍ଳ ଚତୁର୍ଥୀ' },
  { en: 'Shukla Panchami', hi: 'शुक्ल पंचमी', or: 'ଶୁକ୍ଳ ପଞ୍ଚମୀ' },
  { en: 'Shukla Shashthi', hi: 'शुक्ल षष्ठी', or: 'ଶୁକ୍ଳ ଷଷ୍ଠୀ' },
  { en: 'Shukla Saptami', hi: 'शुक्ल सप्तमी', or: 'ଶୁକ୍ଳ ସପ୍ତମୀ' },
  { en: 'Shukla Ashtami', hi: 'शुक्ल अष्टमी', or: 'ଶୁକ୍ଳ ଅଷ୍ଟମୀ' },
  { en: 'Shukla Navami', hi: 'शुक्ल नवमी', or: 'ଶୁକ୍ଳ ନବମୀ' },
  { en: 'Shukla Dashami', hi: 'शुक्ल दशमी', or: 'ଶୁକ୍ଳ ଦଶମୀ' },
  { en: 'Shukla Ekadashi', hi: 'शुक्ल एकादशी', or: 'ଶୁକ୍ଳ ଏକାଦଶୀ' },
  { en: 'Shukla Dwadashi', hi: 'शुक्ल द्वादशी', or: 'ଶୁକ୍ଳ ଦ୍ୱାଦଶୀ' },
  { en: 'Shukla Trayodashi', hi: 'शुक्ल त्रयोदशी', or: 'ଶୁକ୍ଳ ତ୍ରୟୋଦଶୀ' },
  { en: 'Shukla Chaturdashi', hi: 'शुक्ल चतुर्दशी', or: 'ଶୁକ୍ଳ ଚତୁର୍ଦ୍ଦଶୀ' },
  { en: 'Purnima', hi: 'पूर्णिमा', or: 'ପୂର୍ଣ୍ଣିମା' },
  { en: 'Krishna Pratipada', hi: 'कृष्ण प्रतिपदा', or: 'କୃଷ୍ଣ ପ୍ରତିପଦା' },
  { en: 'Krishna Dwitiya', hi: 'कृष्ण द्वितीया', or: 'କୃଷ୍ଣ ଦ୍ୱିତୀୟା' },
  { en: 'Krishna Tritiya', hi: 'कृष्ण तृतीया', or: 'କୃଷ୍ଣ ତୃତୀୟା' },
  { en: 'Krishna Chaturthi', hi: 'कृष्ण चतुर्थी', or: 'କୃଷ୍ଣ ଚତୁର୍ଥୀ' },
  { en: 'Krishna Panchami', hi: 'कृष्ण पंचमी', or: 'କୃଷ୍ଣ ପଞ୍ଚମୀ' },
  { en: 'Krishna Shashthi', hi: 'कृष्ण षष्ठी', or: 'କୃଷ୍ଣ ଷଷ୍ଠୀ' },
  { en: 'Krishna Saptami', hi: 'कृष्ण सप्तमी', or: 'କୃଷ୍ଣ ସପ୍ତମୀ' },
  { en: 'Krishna Ashtami', hi: 'कृष्ण अष्टमी', or: 'କୃଷ୍ଣ ଅଷ୍ଟମୀ' },
  { en: 'Krishna Navami', hi: 'कृष्ण नवमी', or: 'କୃଷ୍ଣ ନବମୀ' },
  { en: 'Krishna Dashami', hi: 'कृष्ण दशमी', or: 'କୃଷ୍ଣ ଦଶମୀ' },
  { en: 'Krishna Ekadashi', hi: 'कृष्ण एकादशी', or: 'କୃଷ୍ଣ ଏକାଦଶୀ' },
  { en: 'Krishna Dwadashi', hi: 'कृष्ण द्वादशी', or: 'କୃଷ୍ଣ ଦ୍ୱାଦଶୀ' },
  { en: 'Krishna Trayodashi', hi: 'कृष्ण त्रयोदशी', or: 'କୃଷ୍ଣ ତ୍ରୟୋଦଶୀ' },
  { en: 'Krishna Chaturdashi', hi: 'कृष्ण चतुर्दशी', or: 'କୃଷ୍ଣ ଚତୁର୍ଦ୍ଦଶୀ' },
  { en: 'Amavasya', hi: 'अमावस्या', or: 'ଅମାବାସ୍ୟା' }
];

const TITHI_LORDS: PlanetName[] = [
  'Surya', 'Chandra', 'Mangala', 'Budha', 'Guru', 'Shukra', 'Shani', 'Rahu',
  'Surya', 'Chandra', 'Mangala', 'Budha', 'Guru', 'Shukra', 'Shani',
  'Surya', 'Chandra', 'Mangala', 'Budha', 'Guru', 'Shukra', 'Shani', 'Rahu',
  'Surya', 'Chandra', 'Mangala', 'Budha', 'Guru', 'Shukra', 'Rahu'
];

const VARA_INFO = [
  { name: { en: 'Sunday (Ravivara)', hi: 'रविवार', or: 'ରବିବାର' }, lord: 'Surya' as PlanetName },
  { name: { en: 'Monday (Somavara)', hi: 'सोमवार', or: 'ସୋମବାର' }, lord: 'Chandra' as PlanetName },
  { name: { en: 'Tuesday (Mangalavara)', hi: 'मंगलवार', or: 'ମଙ୍ଗଳବାର' }, lord: 'Mangala' as PlanetName },
  { name: { en: 'Wednesday (Budhavara)', hi: 'बुधवार', or: 'ବୁଧବାର' }, lord: 'Budha' as PlanetName },
  { name: { en: 'Thursday (Guruvara)', hi: 'गुरुवार', or: 'ଗୁରୁବାର' }, lord: 'Guru' as PlanetName },
  { name: { en: 'Friday (Shukravara)', hi: 'शुक्रवार', or: 'ଶୁକ୍ରବାର' }, lord: 'Shukra' as PlanetName },
  { name: { en: 'Saturday (Shanivara)', hi: 'शनिवार', or: 'ଶନିବାର' }, lord: 'Shani' as PlanetName }
];

const NITYA_YOGAS = [
  { en: 'Vishkambha', hi: 'विष्कम्भ', or: 'ବିଷ୍କମ୍ଭ', lord: 'Shani' },
  { en: 'Priti', hi: 'प्रीति', or: 'ପ୍ରୀତି', lord: 'Budha' },
  { en: 'Ayushman', hi: 'आयुष्मान', or: 'ଆୟୁଷ୍ମାନ', lord: 'Ketu' },
  { en: 'Saubhagya', hi: 'सौभाग्य', or: 'ସୌଭାଗ୍ୟ', lord: 'Shukra' },
  { en: 'Shobhana', hi: 'शोभन', or: 'ଶୋଭନ', lord: 'Surya' },
  { en: 'Atiganda', hi: 'अतिगण्ड', or: 'ଅତିଗଣ୍ଡ', lord: 'Chandra' },
  { en: 'Sukarma', hi: 'सुकर्मा', or: 'ସୁକର୍ମା', lord: 'Mangala' },
  { en: 'Dhriti', hi: 'धृति', or: 'ଧୃତି', lord: 'Rahu' },
  { en: 'Shula', hi: 'शूल', or: 'ଶୂଳ', lord: 'Guru' },
  { en: 'Ganda', hi: 'गण्ड', or: 'ଗଣ୍ଡ', lord: 'Shani' },
  { en: 'Vriddhi', hi: 'वृद्धि', or: 'ବୃଦ୍ଧି', lord: 'Budha' },
  { en: 'Dhruva', hi: 'ध्रुव', or: 'ଧ୍ରୁବ', lord: 'Ketu' },
  { en: 'Vyaghata', hi: 'व्याघात', or: 'ବ୍ୟାଘାତ', lord: 'Shukra' },
  { en: 'Harshana', hi: 'हर्षण', or: 'ହର୍ଷଣ', lord: 'Surya' },
  { en: 'Vajra', hi: 'वज्र', or: 'ବଜ୍ର', lord: 'Chandra' },
  { en: 'Siddhi', hi: 'सिद्धि', or: 'ସିଦ୍ଧି', lord: 'Mangala' },
  { en: 'Vyatipata', hi: 'व्यतीपात', or: 'ବ୍ୟତୀପାତ', lord: 'Rahu' },
  { en: 'Variyana', hi: 'वरीयान', or: 'ବରୀୟାନ', lord: 'Guru' },
  { en: 'Parigha', hi: 'परिघ', or: 'ପରିଘ', lord: 'Shani' },
  { en: 'Shiva', hi: 'शिव', or: 'ଶିବ', lord: 'Budha' },
  { en: 'Siddha', hi: 'सिद्ध', or: 'ସିଦ୍ଧ', lord: 'Ketu' },
  { en: 'Sadhya', hi: 'साध्य', or: 'ସାଧ୍ୟ', lord: 'Shukra' },
  { en: 'Shubha', hi: 'शुभ', or: 'ଶୁଭ', lord: 'Surya' },
  { en: 'Shukla', hi: 'शुक्ल', or: 'ଶୁକ୍ଳ', lord: 'Chandra' },
  { en: 'Brahma', hi: 'ब्रह्म', or: 'ବ୍ରହ୍ମ', lord: 'Mangala' },
  { en: 'Indra', hi: 'इन्द्र', or: 'ଇନ୍ଦ୍ର', lord: 'Rahu' },
  { en: 'Vaidhriti', hi: 'वैधृति', or: 'ବୈଧୃତି', lord: 'Guru' }
];

const MOVABLE_KARANAS = [
  { en: 'Bava', hi: 'बव', or: 'ବବ', deity: 'Indra' },
  { en: 'Balava', hi: 'बालव', or: 'ବାଳବ', deity: 'Brahma' },
  { en: 'Kaulava', hi: 'कौलव', or: 'କୌଳବ', deity: 'Mitra' },
  { en: 'Taitila', hi: 'तैतिल', or: 'ତୈତିଳ', deity: 'Aryama' },
  { en: 'Gara', hi: 'गर', or: 'ଗର', deity: 'Bhumi' },
  { en: 'Vanija', hi: 'वणिज', or: 'ବଣିଜ', deity: 'Shri' },
  { en: 'Vishti (Bhadra)', hi: 'विष्टि (भद्रा)', or: 'ବିଷ୍ଟି (ଭଦ୍ରା)', deity: 'Yama' }
];

export function calculateJanmaPanchanga(
  sunLongitude: number,
  moonLongitude: number,
  birthDate: Date
): JanmaPanchangaData {
  // 1. Tithi
  const diffDeg = normalizeDegrees(moonLongitude - sunLongitude);
  const tithiIndex = Math.min(29, Math.floor(diffDeg / 12));
  const tithiName = TITHI_NAMES[tithiIndex];
  const tithiLord = TITHI_LORDS[tithiIndex];

  // 2. Vara
  const dayOfWeek = birthDate.getDay();
  const vara = VARA_INFO[dayOfWeek];

  // 3. Nakshatra
  const nakIndex = Math.min(26, Math.floor(normalizeDegrees(moonLongitude) / (360 / 27)));
  const nakNameOdia = NAKSHATRA_NAMES[nakIndex] || 'ଅଶ୍ୱିନୀ';
  const VIMSHOTTARI_LORDS: PlanetName[] = [
    'Ketu', 'Shukra', 'Surya', 'Chandra', 'Mangala', 'Rahu', 'Guru', 'Shani', 'Budha'
  ];
  const nakLord = VIMSHOTTARI_LORDS[nakIndex % 9];

  // 4. Nitya Yoga (Sum of Sun and Moon longitudes)
  const sumDeg = normalizeDegrees(sunLongitude + moonLongitude);
  const yogaIndex = Math.min(26, Math.floor(sumDeg / (360 / 27)));
  const yoga = NITYA_YOGAS[yogaIndex];

  // 5. Karana
  const karanaNum = Math.floor(diffDeg / 6) + 1; // 1 to 60
  let karanaObj = { en: 'Bava', hi: 'बव', or: 'ବବ', deity: 'Indra' };
  let karanaLord = 'Surya';

  if (karanaNum === 1) {
    karanaObj = { en: 'Kinstughna', hi: 'किंस्तुघ्न', or: 'କିଂସ୍ତୁଘ୍ନ', deity: 'Marut' };
    karanaLord = 'Budha';
  } else if (karanaNum >= 58) {
    if (karanaNum === 58) {
      karanaObj = { en: 'Shakuni', hi: 'शकुनि', or: 'ଶକୁନି', deity: 'Kali' };
      karanaLord = 'Shani';
    } else if (karanaNum === 59) {
      karanaObj = { en: 'Chatushpada', hi: 'चतुष्पद', or: 'ଚତୁଷ୍ପଦ', deity: 'Rudra' };
      karanaLord = 'Rahu';
    } else {
      karanaObj = { en: 'Naga', hi: 'नाग', or: 'ନାଗ', deity: 'Sarpa' };
      karanaLord = 'Ketu';
    }
  } else {
    // 7 movable karanas repeating 8 times
    const movableIdx = (karanaNum - 2) % 7;
    karanaObj = MOVABLE_KARANAS[movableIdx];
    karanaLord = ['Surya', 'Chandra', 'Mangala', 'Budha', 'Guru', 'Shukra', 'Shani'][movableIdx % 7];
  }

  return {
    tithi: {
      name: { en: 'Janma Tithi', hi: 'जन्म तिथि', or: 'ଜନ୍ମ ତିଥି' },
      value: tithiName,
      rulingLord: tithiLord,
      element: { en: 'Jala (Emotional Taste & Desire)', hi: 'जल तत्त्व', or: 'ଜଳ ତତ୍ତ୍ୱ' },
      significance: {
        en: 'Governs emotional relationships, prosperity, and relational magnetism.',
        hi: 'पारिवारिक सुख, भावनात्मक संतुलन और धन-समृद्धि का सूचक।',
        or: 'ଭାବନା, ପାରିବାରିକ ସମ୍ପର୍କ ଓ ଧନ ସମୃଦ୍ଧିର ପରିଚାୟକ।'
      }
    },
    vara: {
      name: { en: 'Janma Vara (Weekday)', hi: 'जन्म वार', or: 'ଜନ୍ମ ବାର' },
      value: vara.name,
      rulingLord: vara.lord,
      element: { en: 'Agni (Vital Energy & Longevity)', hi: 'अग्नि तत्त्व', or: 'ଅଗ୍ନି ତତ୍ତ୍ୱ' },
      significance: {
        en: 'Governs physical stamina, vitality, immune vigor, and executive drive.',
        hi: 'शारीरिक ऊर्जा, जीवन शक्ति, रोग प्रतिरोधक क्षमता और सामर्थ्य।',
        or: 'ଶାରୀରିକ ଶକ୍ତି, ତେଜସ୍ୱିତା, ରୋଗ ପ୍ରତିରୋଧକ ଶକ୍ତି ଓ ଦୀର୍ଘାୟୁ।'
      }
    },
    nakshatra: {
      name: { en: 'Janma Nakshatra', hi: 'जन्म नक्षत्र', or: 'ଜନ୍ମ ନକ୍ଷତ୍ର' },
      value: { en: nakNameOdia, hi: nakNameOdia, or: nakNameOdia },
      rulingLord: nakLord,
      element: { en: 'Vayu (Mind & Thought Currents)', hi: 'वायु तत्त्व', or: 'ବାୟୁ ତତ୍ତ୍ୱ' },
      significance: {
        en: 'Governs mental wavelength, core instincts, subconscious drives, and karmic path.',
        hi: 'मानसिक प्रकृति, स्वाभाविक प्रवृत्तियां और जीवन का मुख्य ध्येय।',
        or: 'ମାନସିକ ଚେତନା, ପ୍ରବୃତ୍ତି, ଅନ୍ତର୍ନିହିତ ବିଚାର ଓ ଭାଗ୍ୟୋଦୟ।'
      }
    },
    yoga: {
      name: { en: 'Janma Yoga', hi: 'जन्म योग', or: 'ଜନ୍ମ ଯୋଗ' },
      value: { en: yoga.en, hi: yoga.hi, or: yoga.or },
      rulingLord: yoga.lord,
      element: { en: 'Akasha (Ether & Spiritual Bond)', hi: 'आकाश तत्त्व', or: 'ଆକାଶ ତତ୍ତ୍ୱ' },
      significance: {
        en: 'Governs spiritual connection, social goodwill, integrity, and divine grace.',
        hi: 'सामाजिक प्रतिष्ठा, आत्मिक संतुलन और आध्यात्मिक उन्नति।',
        or: 'ସାମାଜିକ ପ୍ରତିଷ୍ଠା, ଚାରିତ୍ରିକ ଶୁଦ୍ଧତା ଓ ଆଧ୍ୟାତ୍ମିକ ଉନ୍ନତି।'
      }
    },
    karana: {
      name: { en: 'Janma Karana', hi: 'जन्म करण', or: 'ଜନ୍ମ କରଣ' },
      value: { en: karanaObj.en, hi: karanaObj.hi, or: karanaObj.or },
      rulingLord: karanaLord,
      element: { en: 'Prithvi (Physical Action & Material Mastery)', hi: 'पृथ्वी तत्त्व', or: 'ପୃଥିବୀ ତତ୍ତ୍ୱ' },
      significance: {
        en: 'Governs practical efficiency, professional tenacity, resource execution, and enterprise.',
        hi: 'व्यावहारिक क्षमता, कार्यकुशलता और धनोपार्जन की योग्यता।',
        or: 'କର୍ମନିଷ୍ଠା, ବ୍ୟବସାୟିକ ଦକ୍ଷତା ଓ କାର୍ଯ୍ୟ ସିଦ୍ଧିର ସାମର୍ଥ୍ୟ।'
      }
    },
    elementalBalance: {
      dominantElement: { en: 'Harmonized Vedic Pancha-Mahabhutas', hi: 'संतुलित पंचमहाभूत', or: 'ସନ୍ତୁଳିତ ପଞ୍ଚମହାଭୂତ' },
      summary: {
        en: `Birth supported by ${tithiName.en} (Jala), ${vara.name.en} (Agni), ${nakNameOdia} (Vayu), ${yoga.en} (Akasha), and ${karanaObj.en} (Prithvi), establishing holistic destiny vitality.`,
        hi: `आपकी जन्म कुंडली में ${tithiName.hi}, ${vara.name.hi}, ${nakNameOdia}, ${yoga.hi} और ${karanaObj.hi} का सुंदर समन्वय जीवन को स्थायित्व और शुभ ऊर्जा प्रदान करता है।`,
        or: `ଆପଣଙ୍କ ଜନ୍ମରେ ${tithiName.or} (ଜଳ), ${vara.name.or} (ଅଗ୍ନି), ${nakNameOdia} (ବାୟୁ), ${yoga.or} (ଆକାଶ) ଏବଂ ${karanaObj.or} (ପୃଥିବୀ) ର ପଞ୍ଚତତ୍ତ୍ୱ ସମନ୍ୱୟ ଆପଣଙ୍କ ଜୀବନକୁ ଅପୂର୍ବ ଶକ୍ତି ଓ ସ୍ଥିରତା ଦେଇଥାଏ।`
      }
    }
  };
}
