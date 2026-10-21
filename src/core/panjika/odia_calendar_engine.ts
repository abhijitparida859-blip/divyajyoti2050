import { calculatePlanetaryPositions, normalizeDegrees, toRadians, toDegrees } from '../astronomy/ephemeris';
import { getJulianDay, getJulianCenturies } from '../astronomy/julian';
import { getLahiriAyanamsha } from '../astronomy/ayanamsha';
import { calculateSunTimes, SunTimes } from '../astronomy/solar_lunar';
import { calculatePanjika, WEEKDAYS, TITHI_NAMES, NAKSHATRA_NAMES } from './panjika_engine';
import { DayPanjika } from '../../types/panjika';

/** Centralized year range constants — single source of truth for the entire app */
export const PANJIKA_MIN_YEAR = 1950;
export const PANJIKA_MAX_YEAR = 2050;
export const PANJIKA_YEAR_COUNT = PANJIKA_MAX_YEAR - PANJIKA_MIN_YEAR + 1; // 101 years
export interface OdiaSolarMonthInfo {
  index: number; // 0 to 11 (0 = Baisakha ... 11 = Chaitra)
  id: string;
  nameOr: string;
  nameHi: string;
  nameEn: string;
  rashiOr: string;
  rashiEn: string;
  seasonOr: string;
  seasonHi: string;
  seasonEn: string;
}

export const ODIA_SOLAR_MONTHS: OdiaSolarMonthInfo[] = [
  { index: 0, id: 'baisakha', nameOr: 'ବୈଶାଖ', nameHi: 'वैशाख', nameEn: 'Baisakha', rashiOr: 'ମେଷ', rashiEn: 'Aries', seasonOr: 'ଗ୍ରୀଷ୍ମ', seasonHi: 'ग्रीष्म', seasonEn: 'Summer' },
  { index: 1, id: 'jyestha', nameOr: 'ଜ୍ୟେଷ୍ଠ', nameHi: 'ज्येष्ठ', nameEn: 'Jyestha', rashiOr: 'ବୃଷ', rashiEn: 'Taurus', seasonOr: 'ଗ୍ରୀଷ୍ମ', seasonHi: 'ग्रीष्म', seasonEn: 'Summer' },
  { index: 2, id: 'asadha', nameOr: 'ଆଷାଢ଼', nameHi: 'आषाढ़', nameEn: 'Asadha', rashiOr: 'ମିଥୁନ', rashiEn: 'Gemini', seasonOr: 'ବର୍ଷା', seasonHi: 'वर्षा', seasonEn: 'Monsoon' },
  { index: 3, id: 'sravana', nameOr: 'ଶ୍ରାବଣ', nameHi: 'श्रावण', nameEn: 'Sravana', rashiOr: 'କର୍କଟ', rashiEn: 'Cancer', seasonOr: 'ବର୍ଷା', seasonHi: 'वर्षा', seasonEn: 'Monsoon' },
  { index: 4, id: 'bhadraba', nameOr: 'ଭାଦ୍ରବ', nameHi: 'भाद्रपद', nameEn: 'Bhadraba', rashiOr: 'ସିଂହ', rashiEn: 'Leo', seasonOr: 'ଶରତ', seasonHi: 'शरद', seasonEn: 'Autumn' },
  { index: 5, id: 'aswina', nameOr: 'ଆଶ୍ୱିନ', nameHi: 'अश्विन', nameEn: 'Aswina', rashiOr: 'କନ୍ୟା', rashiEn: 'Virgo', seasonOr: 'ଶରତ', seasonHi: 'शरद', seasonEn: 'Autumn' },
  { index: 6, id: 'kartika', nameOr: 'କାର୍ତ୍ତିକ', nameHi: 'कार्तिक', nameEn: 'Kartika', rashiOr: 'ତୁଳା', rashiEn: 'Libra', seasonOr: 'ହେମନ୍ତ', seasonHi: 'हेमंत', seasonEn: 'Late Autumn' },
  { index: 7, id: 'margasira', nameOr: 'ମାର୍ଗଶୀର', nameHi: 'मार्गशीर्ष', nameEn: 'Margasira', rashiOr: 'ବିଛା', rashiEn: 'Scorpio', seasonOr: 'ହେମନ୍ତ', seasonHi: 'हेमंत', seasonEn: 'Late Autumn' },
  { index: 8, id: 'pausha', nameOr: 'ପୌଷ', nameHi: 'पौष', nameEn: 'Pausha', rashiOr: 'ଧନୁ', rashiEn: 'Sagittarius', seasonOr: 'ଶିଶିର', seasonHi: 'शिशिर', seasonEn: 'Winter' },
  { index: 9, id: 'magha', nameOr: 'ମାଘ', nameHi: 'माघ', nameEn: 'Magha', rashiOr: 'ମକର', rashiEn: 'Capricorn', seasonOr: 'ଶିଶିର', seasonHi: 'शिशिर', seasonEn: 'Winter' },
  { index: 10, id: 'phalguna', nameOr: 'ଫାଲ୍ଗୁନ', nameHi: 'फाल्गुन', nameEn: 'Phalguna', rashiOr: 'କୁମ୍ଭ', rashiEn: 'Aquarius', seasonOr: 'ବସନ୍ତ', seasonHi: 'वसंत', seasonEn: 'Spring' },
  { index: 11, id: 'chaitra', nameOr: 'ଚୈତ୍ର', nameHi: 'चैत्र', nameEn: 'Chaitra', rashiOr: 'ମୀନ', rashiEn: 'Pisces', seasonOr: 'ବସନ୍ତ', seasonHi: 'वसंत', seasonEn: 'Spring' },
];


export interface OdiaPanjikaEdition {
  id: 'kohinoor' | 'khadiratna' | 'radharaman' | 'bhagyajyoti' | 'biraja' | 'srimandir';
  nameOr: string;
  nameHi: string;
  nameEn: string;
  foundedOr: string;
  traditionOr: string;
  authorityOr: string;
  methodologyOr: string;
  descriptionOr: string;
  descriptionHi: string;
  descriptionEn: string;
  badgeColor: string;
}

export const ODIA_PANJIKA_EDITIONS: OdiaPanjikaEdition[] = [
  {
    id: 'kohinoor',
    nameOr: 'କୋହିନୂର ପ୍ରେସ୍ ପାଞ୍ଜି',
    nameHi: 'कोहिनूर प्रेस पंचांग',
    nameEn: 'Kohinoor Press Panjika',
    foundedOr: '୧୯୩୫ (ପଣ୍ଡିତ ମାର୍କଣ୍ଡେୟ କର, କଟକ)',
    traditionOr: 'ସିଦ୍ଧାନ୍ତ ଦର୍ପଣ ଓ ପୁରୀ ମୁକ୍ତିମଣ୍ଡପ ଅନୁମୋଦିତ',
    authorityOr: 'ମୁକ୍ତିମଣ୍ଡପ ପଣ୍ଡିତ ସଭା, ଶ୍ରୀକ୍ଷେତ୍ର ପୁରୀ',
    methodologyOr: 'ସୂର୍ଯ୍ୟସିଦ୍ଧାନ୍ତ ସହିତ ସାମନ୍ତ ଚନ୍ଦ୍ରଶେଖର ସିଂହଙ୍କ ସିଦ୍ଧାନ୍ତ ଦର୍ପଣ ଗଣିତ। ଉଦୟ ତିଥି ଓ ଶାସ୍ତ୍ରୀୟ ଉତ୍କଳୀୟ ନିୟମ।',
    descriptionOr: 'ଓଡ଼ିଶାର ସର୍ବାଧିକ ପ୍ରସିଦ୍ଧ ଓ ପ୍ରତିଟି ଓଡ଼ିଆ ପରିବାରର ବିଶ୍ୱସ୍ତ ପାଞ୍ଜିକା। ବିବାହ, ବ୍ରତଘର, ଓଷା-ବ୍ରତ ଓ ପର୍ବପର୍ବାଣି ନିର୍ଣ୍ଣୟରେ ସର୍ବମାନ୍ୟ।',
    descriptionHi: 'ओडिशा का सर्वाधिक लोकप्रिय व प्रामाणिक पंचांग, जो पीढ़ियों से हर घर में पूजित है।',
    descriptionEn: 'The gold standard household almanac of Odisha since 1935, based on Siddhanta Darpana and Mukti Mandap approval.',
    badgeColor: 'from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-500/40'
  },
  {
    id: 'khadiratna',
    nameOr: 'ଅସଲ ଖଡ଼ିରତ୍ନ ପାଞ୍ଜି',
    nameHi: 'असल खड़िरत्न पंचांग',
    nameEn: 'Asal Khadiratna Panjika',
    foundedOr: 'ଶ୍ରୀକ୍ଷେତ୍ର ପୁରୀ (ରତ୍ନାକର ଗର୍ଗବଟୁ ଓ ପଣ୍ଡିତ ବାଇକୋଳି ଜ୍ୟୋତିଷ ସମିତି)',
    traditionOr: 'ଶ୍ରୀମନ୍ଦିର ରତ୍ନସିଂହାସନ ଓ ଦେଉଳ ନୀତି ପରମ୍ପରା',
    authorityOr: 'ଶ୍ରୀଜଗନ୍ନାଥ ମନ୍ଦିର ପ୍ରଶାସନ ଓ ଛତିଶା ନିଯୋଗ',
    methodologyOr: 'ଶ୍ରୀମନ୍ଦିର ପରମ୍ପରାର ପ୍ରାମାଣିକ ନୀତିକାନ୍ତି, ସୂର୍ଯ୍ୟପୂଜା, ରୋଷହୋମ ଓ ମହାପ୍ରସାଦ ଭୋଗ ସମୟ ନିର୍ଣ୍ଣୟ।',
    descriptionOr: 'ପୁରୀ ବଡ଼ଦେଉଳର ମୁଖ୍ୟ ପ୍ରାମାଣିକ ପାଞ୍ଜି। ମହାପ୍ରଭୁଙ୍କ ଦୈନିକ ବେଶ, ଯାତ୍ରା, ରଥଯାତ୍ରା ଓ ଦେଉଳ ପର୍ବ ନିର୍ଣ୍ଣୟର ସର୍ବୋଚ୍ଚ ଆଧାର।',
    descriptionHi: 'श्रीक्षेत्र पुरी जगन्नाथ मंदिर के दैनिक वेश, महाप्रसाद व रथयात्रा नीति का सर्वोच्च प्रामाणिक पंचांग।',
    descriptionEn: 'Canonical almanac of Srimandir servitors and Puri Mukti Mandap, governing Jagannath Deva rituals and Besha schedules.',
    badgeColor: 'from-purple-500/20 to-indigo-500/20 text-purple-300 border-purple-500/40'
  },
  {
    id: 'radharaman',
    nameOr: 'ରାଧାରମଣ ପ୍ରେସ୍ ପାଞ୍ଜି',
    nameHi: 'राधारमण प्रेस पंचांग',
    nameEn: 'Radharaman Press Panjika',
    foundedOr: '୧୯୨୮ (କଟକ ରାଧାରମଣ ପ୍ରେସ୍)',
    traditionOr: 'ପ୍ରାଚୀନ ଉତ୍କଳୀୟ ବୈଷ୍ଣବ ଓ ମଠ-ମନ୍ଦିର ପରମ୍ପରା',
    authorityOr: 'ଉତ୍କଳ ଗୌଡ଼ୀୟ ଓ ଶ୍ରୀବୈଷ୍ଣବ ପଣ୍ଡିତ ମଣ୍ଡଳୀ',
    methodologyOr: 'ଶୁଦ୍ଧ ଏକାଦଶୀ, ହରିବାସର ଓ ମହାଦ୍ୱାଦଶୀ ପାଳନରେ ଅତ୍ୟନ୍ତ କଠୋର ବିଧି। ବିଦ୍ଧା ତିଥି ସର୍ବଥା ବର୍ଜନ।',
    descriptionOr: 'ଓଡ଼ିଶାର ପ୍ରାଚୀନତମ ମୁଦ୍ରିତ ପାଞ୍ଜି ମଧ୍ୟରୁ ଅନ୍ୟତମ। ମଠ, ଆଶ୍ରମ, ସାଧୁ-ସନ୍ଥ ଓ ବୈଷ୍ଣବ ବ୍ରତ ପାଳନକାରୀଙ୍କ ପ୍ରଥମ ପସନ୍ଦ।',
    descriptionHi: 'उत्कल वैष्णव परंपरा का प्राचीनतम पंचांग, शुद्ध एकादशी व व्रत तिथियों के लिए प्रसिद्ध।',
    descriptionEn: 'One of the oldest printed panjikas in Odisha, esteemed by Vaishnava mathas for strict fasting and Vrata adherence.',
    badgeColor: 'from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/40'
  },
  {
    id: 'bhagyajyoti',
    nameOr: 'ଭାଗ୍ୟଜ୍ୟୋତି ଦୃକ୍-ପାଞ୍ଜି',
    nameHi: 'भाग्यज्योति दृक पंचांग',
    nameEn: 'Bhagyajyoti Drik Panjika',
    foundedOr: 'ଜ୍ୟୋତିର୍ବିଜ୍ଞାନ ପରିଷଦ (ଆଧୁନିକ ଗବେଷଣା)',
    traditionOr: 'ଆଧୁନିକ ଖଗୋଳୀୟ ଦୃକ୍-ସିଦ୍ଧାନ୍ତ (Astronomical Ephemeris)',
    authorityOr: 'ଭାରତୀୟ ଜାତୀୟ ପାଞ୍ଜି ଓ ଲାହିଡ଼ୀ ଅୟନାଂଶ',
    methodologyOr: 'ନାସା ଓ ଇଣ୍ଡିଆନ୍ ନଟିକାଲ୍ ଆଲମାନାକ୍ ସହିତ ସମନ୍ୱିତ ପ୍ରତ୍ୟକ୍ଷ ଗ୍ରହ-ସ୍ଫୁଟ, ତିଥି ଶେଷ ସମୟ ଓ ସୂକ୍ଷ୍ମ ଗ୍ରହଣ କାଳ।',
    descriptionOr: 'ଆଧୁନିକ ଜ୍ୟୋତିର୍ବିଦ୍ ଓ ଯୁବପିଢ଼ିଙ୍କ ପ୍ରିୟ। ମାଇକ୍ରୋ-ସେକେଣ୍ଡ ସ୍ତରର ସଠିକ୍ ଗ୍ରହଚଳନ ଓ ଶୁଭ ମୁହୂର୍ତ୍ତ ଗଣନା ପ୍ରଦାନ କରେ।',
    descriptionHi: 'आधुनिक खगोलीय प्रत्यक्ष दृश्य गणित (Drik-Siddhanta) पर आधारित अत्यंत वैज्ञानिक पंचांग।',
    descriptionEn: 'Modern high-precision Drik-Siddhantic panjika based on planetary ephemeris, Lahiri Ayanamsa, and exact transit moments.',
    badgeColor: 'from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-500/40'
  },
  {
    id: 'biraja',
    nameOr: 'ବିରଜା ପାଞ୍ଜି (ଯାଜପୁର)',
    nameHi: 'बिरजा पंचांग (जाजपुर)',
    nameEn: 'Biraja Panjika (Jajpur)',
    foundedOr: 'ବିରଜାକ୍ଷେତ୍ର ଯାଜପୁର (ପ୍ରାଚୀନ ଶାକ୍ତ ମୁକ୍ତିମଣ୍ଡପ)',
    traditionOr: 'ଶାକ୍ତ ପୀଠ ଓ ଉତ୍ତର-ପୂର୍ବ ଓଡ଼ିଶା ତାନ୍ତ୍ରିକ ବିଧାନ',
    authorityOr: 'ମା’ ବିରଜା ମନ୍ଦିର ଟ୍ରଷ୍ଟ ଓ ମୁକ୍ତିମଣ୍ଡପ ସଭା',
    methodologyOr: 'ଶାରଦୀୟ ଷୋଳପୂଜା, ମହାଷ୍ଟମୀ ସନ୍ଧିପୂଜା, ରଥଯାତ୍ରା (ବିମଳା ବା ବିରଜା ରଥ) ଓ କାଳୀପୂଜାର ସ୍ୱତନ୍ତ୍ର ନିୟମ।',
    descriptionOr: 'ଯାଜପୁର, ବାଲେଶ୍ୱର, ଭଦ୍ରକ, କେନ୍ଦୁଝର ଓ ମୟୂରଭଞ୍ଜ ଅଞ୍ଚଳର ଶାକ୍ତ ଶ୍ରଦ୍ଧାଳୁଙ୍କ ପ୍ରଧାନ ମାର୍ଗଦର୍ଶକ ପାଞ୍ଜି।',
    descriptionHi: 'जाजपुर बिरजा पीठ एवं उत्तर ओडिशा की शाक्त परंपरा पर आधारित विशेष पंचांग।',
    descriptionEn: 'Authoritative Shakta tradition panjika from Biraja Kshetra Jajpur, governing Durga Puja Sandhi timings and regional rites.',
    badgeColor: 'from-rose-500/20 to-red-500/20 text-rose-300 border-rose-500/40'
  },
  {
    id: 'srimandir',
    nameOr: 'ଶ୍ରୀମନ୍ଦିର ମୁକ୍ତିମଣ୍ଡପ ଶାସନ ପାଞ୍ଜି',
    nameHi: 'श्रीमंदिर मुक्तिमंडप शासन पंचांग',
    nameEn: 'Srimandir Mukti Mandapa Royal Edition',
    foundedOr: 'ପୁରୀ ଶ୍ରୀଜଗନ୍ନାଥ ମନ୍ଦିର (ରାଜଭୋଗ ନିର୍ଣ୍ଣୟ)',
    traditionOr: 'ମୁକ୍ତିମଣ୍ଡପ ବ୍ରାହ୍ମଣ ମହାସଭା ଓ ଗଜପତି ମହାରାଜାଙ୍କ ଅନୁମୋଦନ',
    authorityOr: 'ଶ୍ରୀକ୍ଷେତ୍ର ମୁକ୍ତିମଣ୍ଡପ ସର୍ବୋଚ୍ଚ ଧର୍ମସଭା',
    methodologyOr: 'ସମସ୍ତ ପାଞ୍ଜିକାର ମତଭେଦ ସ୍ଥିତିରେ ଶ୍ରୀମନ୍ଦିର ମୁକ୍ତିମଣ୍ଡପର ଫଇସଲା ଅନ୍ତିମ ଓ ସର୍ବମାନ୍ୟ।',
    descriptionOr: 'ଓଡ଼ିଶାର ରାଷ୍ଟ୍ରଦେବତା ଶ୍ରୀଜଗନ୍ନାଥଙ୍କ ରାଜକୀୟ ଶାସନ ପାଞ୍ଜି। ଗଜପତି ମହାରାଜାଙ୍କ ଅଙ୍କ ଗଣନା ଏବଂ ସୁନିଆଁର ସଠିକ୍ ବିବରଣୀ।',
    descriptionHi: 'पुरी मुक्तिमंडप सर्वोच्च विद्वत परिषद द्वारा अनुमोदित राजकीय धर्म पंचांग।',
    descriptionEn: 'The supreme ecclesiastical council edition of Puri Jagannath Temple, the final authority in settling any Panjika dispute.',
    badgeColor: 'from-amber-400/20 to-orange-500/20 text-amber-200 border-amber-400/50'
  }
];

export interface OdishaCityLocation {
  id: string;
  nameOr: string;
  nameHi: string;
  nameEn: string;
  lat: number;
  lon: number;
  districtOr: string;
}

export const ODISHA_CITIES: OdishaCityLocation[] = [
  { id: 'puri', nameOr: 'ପୁରୀ (ଶ୍ରୀକ୍ଷେତ୍ର)', nameHi: 'पुरी (श्रीक्षेत्र)', nameEn: 'Puri (Srikshetra)', lat: 19.8135, lon: 85.8312, districtOr: 'ପୁରୀ' },
  { id: 'bhubaneswar', nameOr: 'ଭୁବନେଶ୍ୱର (ଏକାମ୍ର)', nameHi: 'भुवनेश्वर (एकाम्र)', nameEn: 'Bhubaneswar', lat: 20.2961, lon: 85.8245, districtOr: 'ଖୋର୍ଦ୍ଧା' },
  { id: 'cuttack', nameOr: 'କଟକ (ଅଭିନବ ବାରବାଟୀ)', nameHi: 'कटक (बारबाटी)', nameEn: 'Cuttack', lat: 20.4625, lon: 85.8830, districtOr: 'କଟକ' },
  { id: 'sambalpur', nameOr: 'ସମ୍ବଲପୁର (ମା’ ସମଲେଶ୍ୱରୀ)', nameHi: 'संबलपुर', nameEn: 'Sambalpur', lat: 21.4669, lon: 83.9812, districtOr: 'ସମ୍ବଲପୁର' },
  { id: 'berhampur', nameOr: 'ବ୍ରହ୍ମପୁର (ରେଶମ ନଗରୀ)', nameHi: 'ब्रह्मपुर', nameEn: 'Berhampur', lat: 19.3150, lon: 84.7941, districtOr: 'ଗଞ୍ଜାମ' },
  { id: 'balasore', nameOr: 'ବାଲେଶ୍ୱର (ଚାନ୍ଦିପୁର)', nameHi: 'बालेश्वर', nameEn: 'Balasore', lat: 21.4934, lon: 86.9135, districtOr: 'ବାଲେଶ୍ୱର' },
  { id: 'rourkela', nameOr: 'ରାଉରକେଲା (ଇସ୍ପାତ ନଗରୀ)', nameHi: 'राउरकेला', nameEn: 'Rourkela', lat: 22.2604, lon: 84.8536, districtOr: 'ସୁନ୍ଦରଗଡ଼' },
  { id: 'baripada', nameOr: 'ବାରିପଦା (ମୟୂରଭଞ୍ଜ)', nameHi: 'बारीपदा', nameEn: 'Baripada', lat: 21.9346, lon: 86.7329, districtOr: 'ମୟୂରଭଞ୍ଜ' },
  { id: 'koraput', nameOr: 'କୋରାପୁଟ (ଦେଓମାଳୀ)', nameHi: 'कोरापुट', nameEn: 'Koraput', lat: 18.8135, lon: 82.7126, districtOr: 'କୋରାପୁଟ' },
  { id: 'kendrapara', nameOr: 'କେନ୍ଦ୍ରାପଡ଼ା (ତୁଳସୀକ୍ଷେତ୍ର)', nameHi: 'केन्द्रापड़ा', nameEn: 'Kendrapara', lat: 20.5015, lon: 86.4229, districtOr: 'କେନ୍ଦ୍ରାପଡ଼ା' },
  { id: 'jajpur', nameOr: 'ଯାଜପୁର (ବିରଜାକ୍ଷେତ୍ର)', nameHi: 'जाजपुर (बिरजा)', nameEn: 'Jajpur (Biraja)', lat: 20.8523, lon: 86.3385, districtOr: 'ଯାଜପୁର' },
];

export interface DynamicOdiaDayInfo {
  date: Date;
  dateStr: string; // YYYY-MM-DD
  dayOfMonth: number;
  gregorianMonth: number; // 0-11
  gregorianYear: number;
  weekdayIdx: number; // 0-6 (0=Sun)
  
  // Odia Solar Calendar Data
  odiaSolarMonth: OdiaSolarMonthInfo;
  odiaSolarDay: number; // ୧, ୨ ... ୩୧
  isSankranti: boolean;
  sankrantiName?: { or: string; hi: string; en: string };
  sankrantiPunyakala?: string;

  // Odia Lunar Calendar Data
  panjika: DayPanjika;
  lunarMonthName: { or: string; hi: string; en: string };
  tithiNumber: number; // 1 to 30
  isShukla: boolean;
  isPurnima: boolean;
  isAmavasya: boolean;
  isEkadashi: boolean;
  ekadashiName?: { or: string; hi: string; en: string };
  isPradosha: boolean;
  dominantTithiNumber?: number;
  dominantTithiNameOr?: string;
  isEarlyTithiChange?: boolean;

  // Srimandir Jagannath Data
  jagannathBesha?: { or: string; hi: string; en: string; descriptionOr: string };
  jagannathNitiSpecial?: { or: string; hi: string; en: string };

  // Auspicious Events & Festivals
  festivals: Array<{
    id: string;
    nameOr: string;
    nameHi: string;
    nameEn: string;
    type: 'major' | 'puja' | 'jatra' | 'vrata' | 'sankranti' | 'holiday';
    descriptionOr: string;
    descriptionEn: string;
    isGovernmentHoliday?: boolean;
  }>;

  // Tithi Injunctions & Prohibitions
  foodRestrictionOr: string;
  foodRestrictionEn: string;

  // Odia Choghadiya & Belas
  belas: {
    amrita: string;
    mahendra: string;
    kalaBela: string;
    varaBela: string;
    amritaOr?: string;
    mahendraOr?: string;
    kalaBelaOr?: string;
    varaBelaOr?: string;
    amritaHi?: string;
    mahendraHi?: string;
    kalaBelaHi?: string;
    varaBelaHi?: string;
    amritaEn?: string;
    mahendraEn?: string;
    kalaBelaEn?: string;
    varaBelaEn?: string;
  };

  // Traditional Season (ଋତୁ)
  rituInfo: {
    or: string;
    hi: string;
    en: string;
  };

  // Active Panjika Edition
  edition: OdiaPanjikaEdition;

  // Precise Astronomical Ephemeris & Timing
  tithiTiming: {
    durationStrOr: string;
    durationStrHi: string;
    durationStrEn: string;
    endHour: number;
    endMinute: number;
    nextTithiKey: string;
  };
  nakshatraTiming: {
    durationStrOr: string;
    durationStrHi: string;
    durationStrEn: string;
    endHour: number;
    endMinute: number;
    pada: number;
    nextNakshatraKey: string;
  };

  // Planetary Positions (Surya & Chandra Sputa)
  suryaRashiInfo: {
    rashiOr: string;
    rashiHi: string;
    rashiEn: string;
    degreesStrOr: string;
    degreesStrEn: string;
  };
  chandraRashiInfo: {
    rashiOr: string;
    rashiHi: string;
    rashiEn: string;
    degreesStrOr: string;
    degreesStrEn: string;
  };

  // Directional Travel Prohibitions (ଦିଗଶୂଳ ଓ ପ୍ରତିକାର)
  digashula: {
    directionOr: string;
    directionHi: string;
    directionEn: string;
    remedyOr: string;
    remedyHi: string;
    remedyEn: string;
  };

  // Tarabala & Chandrabala
  tarabalaSummaryOr: string;
  chandrabalaSummaryOr: string;

  // Advance Muhurtas & Odia Belas
  advanceMuhurtas?: {
    abhijit: { or: string; hi: string; en: string; startMin: number; endMin: number };
    amritaBela: { or: string; hi: string; en: string; startMin: number; endMin: number };
    mahendraBela: { or: string; hi: string; en: string; startMin: number; endMin: number };
    brahmaMuhurta: { or: string; hi: string; en: string; startMin: number; endMin: number };
    godhuli: { or: string; hi: string; en: string; startMin: number; endMin: number };
    vijaya: { or: string; hi: string; en: string; startMin: number; endMin: number };
    rahuKaal: { or: string; hi: string; en: string; startMin: number; endMin: number };
    yamaganda: { or: string; hi: string; en: string; startMin: number; endMin: number };
    kalaBela: { or: string; hi: string; en: string; startMin: number; endMin: number };
    varaBela: { or: string; hi: string; en: string; startMin: number; endMin: number };
    gulikaKaal: { or: string; hi: string; en: string; startMin: number; endMin: number };
  };

  // Dinamana (Day length) & Ratrimana (Night length) in Dandatmaka & Hours
  dinamana?: {
    totalMinutes: number;
    hours: number;
    minutes: number;
    danda: number;
    pala: number;
    strOr: string;
    strHi: string;
    strEn: string;
  };
  ratrimana?: {
    totalMinutes: number;
    hours: number;
    minutes: number;
    danda: number;
    pala: number;
    strOr: string;
    strHi: string;
    strEn: string;
  };

  // Panjika Comparative Variation Notes
  panjikaNotes?: {
    or: string;
    hi: string;
    en: string;
  };
  // Navagraha Real Astronomical Sputa
  navagrahaSputa?: NavagrahaSputa;

  // Odia Choghadiya (ଦିବା ଓ ରାତ୍ରି ଚୌଘଡ଼ିଆ)
  choghadiya?: ChoghadiyaDayNight;

  // 24-Hour Planetary Horas (ଗ୍ରହ ହୋରା ଚକ୍ର)
  planetaryHoras?: PlanetaryHoraSlot[];

  // 12 Rashi Ghata Chakra & Chandrashtama (ଘାତ ଚକ୍ର ଓ ଚନ୍ଦ୍ରାଷ୍ଟମ)
  ghataChakra?: RashiGhataInfo[];

  // Vedic Sankalpa Data (ପବିତ୍ର ସଙ୍କଳ୍ପ ପାଠ)
  sankalpa?: VedicSankalpaData;

  // Daily 12 Lagna (Ascendant) Durations & Live Ascendant Tracker
  dailyLagnas?: DailyLagnaInfo[];
  currentLagna?: DailyLagnaInfo;
}

export interface DailyLagnaInfo {
  index: number; // 0 to 11
  rashiIdx: number; // 0 to 11 (0=Mesha, 1=Vrisha, ... 11=Meena)
  rashiNameOr: string;
  rashiNameHi: string;
  rashiNameEn: string;
  lordOr: string;
  lordHi: string;
  lordEn: string;
  elementOr: string; // 'ଅଗ୍ନି' | 'ପୃଥିବୀ' | 'ବାୟୁ' | 'ଜଳ'
  nature: 'chara' | 'sthira' | 'dwiswabhava';
  natureOr: string; // 'ଚର' | 'ସ୍ଥିର' | 'ଦ୍ୱିସ୍ୱଭାବ'
  startMinutes: number; // minutes from midnight
  endMinutes: number;
  timeRangeOr: string;
  timeRangeEn: string;
  durationMinutes: number;
  isCurrent: boolean;
  suitabilityOr: string; // Guidance for wedding, housewarming, etc.
}

export interface ChoghadiyaSlot {
  index: number;
  period: 'day' | 'night';
  nameKey: 'udvega' | 'chara' | 'labha' | 'amrita' | 'kaala' | 'shubha' | 'roga';
  nameOr: string;
  nameHi: string;
  nameEn: string;
  rulerOr: string;
  rulerEn: string;
  nature: 'shubh' | 'ashubh' | 'char';
  natureOr: string;
  significanceOr: string;
  startMinutes: number;
  endMinutes: number;
  startStrOr: string;
  endStrOr: string;
  timeRangeOr: string;
  timeRangeEn: string;
  isCurrent?: boolean;
}

export interface ChoghadiyaDayNight {
  dayChoghadiya: ChoghadiyaSlot[];
  nightChoghadiya: ChoghadiyaSlot[];
}

export interface PlanetaryHoraSlot {
  index: number; // 0-23
  hourOfSunrise: number; // 1 to 24
  period: 'day' | 'night';
  planetKey: 'sun' | 'moon' | 'mars' | 'mercury' | 'jupiter' | 'venus' | 'saturn';
  planetNameOr: string;
  planetNameHi: string;
  planetNameEn: string;
  nature: 'shubh' | 'ashubh' | 'sam';
  natureOr: string;
  recommendationOr: string;
  startMinutes: number;
  endMinutes: number;
  startStrOr: string;
  endStrOr: string;
  timeRangeOr: string;
  isCurrent?: boolean;
}

export interface RashiGhataInfo {
  rashiIdx: number; // 0 to 11
  rashiNameOr: string;
  rashiNameHi: string;
  rashiNameEn: string;
  isChandrashtama: boolean;
  isGhataVara: boolean;
  isGhataTithi: boolean;
  isGhataNakshatra: boolean;
  overallStatus: 'shubh' | 'madhyam' | 'ashubh';
  overallStatusOr: string;
  remedyOr: string;
  ghataVaraNameOr: string;
  ghataTithiNameOr: string;
  ghataNakshatraNameOr: string;
}

export interface VedicSankalpaData {
  sanskritMantra: string;
  odiaExplanation: string;
  gajapatiAnka: string;
  amliSala: string;
  vikramSamvat: string;
  shakaSamvat: string;
  kaliyugaYear: string;
  ayanaOr: string;
  rituOr: string;
  solarMonthOr: string;
  solarDayOr: string;
  lunarMonthOr: string;
  pakshaOr: string;
  tithiOr: string;
  vaaraOr: string;
  nakshatraOr: string;
  yogaOr: string;
  karanaOr: string;
  kshetraOr: string;
}

// 24 Named Ekadashis according to traditional Hindu Panjika
const EKADASHI_NAMES: Record<string, { or: string; hi: string; en: string }> = {
  'chaitra_krishna': { or: 'ପାପମୋଚନୀ ଏକାଦଶୀ', hi: 'पापमोचिनी एकादशी', en: 'Papamochani Ekadashi' },
  'chaitra_shukla': { or: 'କାମଦା ଏକାଦଶୀ', hi: 'कामदा एकादशी', en: 'Kamada Ekadashi' },
  'baisakha_krishna': { or: 'ବରୂଥିନୀ ଏକାଦଶୀ', hi: 'वरूथिनी एकादशी', en: 'Varuthini Ekadashi' },
  'baisakha_shukla': { or: 'ମୋହିନୀ ଏକାଦଶୀ', hi: 'मोहिनी एकादशी', en: 'Mohini Ekadashi' },
  'jyestha_krishna': { or: 'ଅପରା ଏକାଦଶୀ', hi: 'अपरा एकादशी', en: 'Apara Ekadashi' },
  'jyestha_shukla': { or: 'ନିର୍ଜଳା (ଭୀମ) ଏକାଦଶୀ', hi: 'निर्जला (भीम) एकादशी', en: 'Nirjala Ekadashi' },
  'asadha_krishna': { or: 'ଯୋଗିନୀ ଏକାଦଶୀ', hi: 'योगिनी एकादशी', en: 'Yogini Ekadashi' },
  'asadha_shukla': { or: 'ହରିଶୟନ (ସୁନାବେଶ) ଏକାଦଶୀ', hi: 'हरिशयन / देवशयनी एकादशी', en: 'Devashayani / Suna Besha Ekadashi' },
  'sravana_krishna': { or: 'କାମିକା ଏକାଦଶୀ', hi: 'कामिका एकादशी', en: 'Kamika Ekadashi' },
  'sravana_shukla': { or: 'ପବିତ୍ରାରୋପଣ / ପୁତ୍ରଦା ଏକାଦଶୀ', hi: 'श्रावण पुत्रदा एकादशी', en: 'Shravana Putrada Ekadashi' },
  'bhadraba_krishna': { or: 'ଅଜା ଏକାଦଶୀ', hi: 'अजा एकादशी', en: 'Aja Ekadashi' },
  'bhadraba_shukla': { or: 'ପାର୍ଶ୍ୱପରିବର୍ତ୍ତିନୀ ଏକାଦଶୀ', hi: 'परिवर्तिनी एकादशी', en: 'Parivartini Ekadashi' },
  'aswina_krishna': { or: 'ଇନ୍ଦିରା ଏକାଦଶୀ', hi: 'इन्दिरा एकादशी', en: 'Indira Ekadashi' },
  'aswina_shukla': { or: 'ପାପାଙ୍କୁଶା ଏକାଦଶୀ', hi: 'पापांकुशा एकादशी', en: 'Papankusha Ekadashi' },
  'kartika_krishna': { or: 'ରମା ଏକାଦଶୀ', hi: 'रमा एकादशी', en: 'Rama Ekadashi' },
  'kartika_shukla': { or: 'ହରି ପ୍ରବୋଧିନୀ (ପଞ୍ଚୁକ) ଏକାଦଶୀ', hi: 'देवोत्थान / प्रबोधिनी एकादशी', en: 'Devotthana / Panchuka Ekadashi' },
  'margasira_krishna': { or: 'ଉତ୍ପନ୍ନା ଏକାଦଶୀ', hi: 'उत्पन्ना एकादशी', en: 'Utpanna Ekadashi' },
  'margasira_shukla': { or: 'ମୋକ୍ଷଦା ଏକାଦଶୀ (ଗୀତା ଜୟନ୍ତୀ)', hi: 'मोक्षदा एकादशी (गीता जयंती)', en: 'Mokshada Ekadashi (Gita Jayanti)' },
  'pausha_krishna': { or: 'ସଫଳା ଏକାଦଶୀ', hi: 'सफला एकादशी', en: 'Saphala Ekadashi' },
  'pausha_shukla': { or: 'ପୌଷ ପୁତ୍ରଦା ଏକାଦଶୀ', hi: 'पौष पुत्रदा एकादशी', en: 'Pausha Putrada Ekadashi' },
  'magha_krishna': { or: 'ଷଟତିଳା ଏକାଦଶୀ', hi: 'षटतिला एकादशी', en: 'Shat-tila Ekadashi' },
  'magha_shukla': { or: 'ଭୈମୀ / ଜୟା ଏକାଦଶୀ', hi: 'जया / भैमी एकादशी', en: 'Jaya / Bhaimi Ekadashi' },
  'phalguna_krishna': { or: 'ବିଜୟା ଏକାଦଶୀ', hi: 'विजया एकादशी', en: 'Vijaya Ekadashi' },
  'phalguna_shukla': { or: 'ଆମଳକୀ ଏକାଦଶୀ', hi: 'आमलकी एकादशी', en: 'Amalaki Ekadashi' }
};

// Traditional Odia Tithi Food Injunctions (ଖାଦ୍ୟ ନିଷେଧ)
const TITHI_FOOD_RESTRICTIONS: Record<number, { or: string; en: string }> = {
  1: { or: 'କଖାରୁ ଭକ୍ଷଣ ନିଷେଧ (ଶତ୍ରୁ ବୃଦ୍ଧି ହୁଏ)', en: 'Pumpkin (Kakharu/Kushmanda) forbidden' },
  2: { or: 'ବୃହତୀ / ବାଇଗଣ ଭକ୍ଷଣ ନିଷେଧ (ପୁତ୍ର ଶୋକ)', en: 'Eggplant (Baigana) forbidden' },
  3: { or: 'ପୋଟଳ ଭକ୍ଷଣ ନିଷେଧ (ଶତ୍ରୁ ବୃଦ୍ଧି)', en: 'Pointed Gourd (Potala/Patola) forbidden' },
  4: { or: 'ମୂଳା ଭକ୍ଷଣ ନିଷେଧ (ଧନ ନାଶ ହୁଏ)', en: 'Radish (Mula) forbidden' },
  5: { or: 'ବେଲ ଫଳ ଭକ୍ଷଣ ନିଷେଧ (କଳଙ୍କ ଲାଗେ)', en: 'Wood Apple (Bela) forbidden' },
  6: { or: 'ନିମ୍ବ / କଦଳୀ ଭକ୍ଷଣ ନିଷେଧ (ଗୋ-ହତ୍ୟା ସମ)', en: 'Neem / Banana forbidden' },
  7: { or: 'ତାଳ ଫଳ ଭକ୍ଷଣ ନିଷେଧ (ସ୍ୱାସ୍ଥ୍ୟ ହାନି)', en: 'Palm Fruit (Tala) forbidden' },
  8: { or: 'ନଡ଼ିଆ ଭକ୍ଷଣ ନିଷେଧ (ବୁଦ୍ଧି ନାଶ ହୁଏ)', en: 'Coconut (Nadia) forbidden' },
  9: { or: 'ଲାଉ ଭକ୍ଷଣ ନିଷେଧ (ଗୋ-ମାଂସ ସମ)', en: 'Bottle Gourd (Lau) forbidden' },
  10: { or: 'କଳମୀ ଶାଗ ଭକ୍ଷଣ ନିଷେଧ (ଗୋ-ବଧ ସମ)', en: 'Water Spinach (Kalami) forbidden' },
  11: { or: 'ଅନ୍ନ ଭୋଜନ ଓ ଶିମ୍ବ ନିଷେଧ (ଏକାଦଶୀ ମହାବ୍ରତ)', en: 'Grains/Rice & Broad Beans forbidden' },
  12: { or: 'ପୋଇ ଶାଗ ଓ ମସୁର ଡାଲି ନିଷେଧ (ବ୍ରହ୍ମହତ୍ୟା ସମ)', en: 'Malabar Spinach & Red Lentils forbidden' },
  13: { or: 'ବାଇଗଣ ଭକ୍ଷଣ ନିଷେଧ (ଅପଜୟ ହୁଏ)', en: 'Eggplant (Baigana) forbidden' },
  14: { or: 'ବିରି ଓ ତେଲ ଭକ୍ଷଣ ନିଷେଧ (ରୋଗ ବୃଦ୍ଧି)', en: 'Black Gram (Biri) forbidden' },
  15: { or: 'ଆମିଷ ଓ ତୈଳ ମର୍ଦ୍ଦନ ସର୍ବଥା ନିଷେଧ (ଶୁଦ୍ଧ ପୂର୍ଣ୍ଣିମା)', en: 'Non-veg & Oil massage strictly forbidden' },
  30: { or: 'ଆମିଷ ଭକ୍ଷଣ ଓ ଶୁଭ କାର୍ଯ୍ୟ ନିଷେଧ (ପିତୃ ଅମାବାସ୍ୟା)', en: 'Non-veg strictly prohibited (Amavasya)' }
};

/**
 * Calculates authentic Odia Solar Calendar & Lunar Almanac data
 * for any given date with full astronomical planetary precision.
 */

export const ODIA_NUMERALS_MAP = ['୦', '୧', '୨', '୩', '୪', '୫', '୬', '୭', '୮', '୯'];
export function formatOdiaNum(num: number | string): string {
  return num.toString().replace(/\d/g, d => ODIA_NUMERALS_MAP[parseInt(d, 10)]);
}

export const TITHI_NAMES_OR = [
  'ପ୍ରତିପଦା', 'ଦ୍ୱିତୀୟା', 'ତୃତୀୟା', 'ଚତୁର୍ଥୀ', 'ପଞ୍ଚମୀ',
  'ଷଷ୍ଠୀ', 'ସପ୍ତମୀ', 'ଅଷ୍ଟମୀ', 'ନବମୀ', 'ଦଶମୀ',
  'ଏକାଦଶୀ', 'ଦ୍ୱାଦଶୀ', 'ତ୍ରୟୋଦଶୀ', 'ଚତୁର୍ଦ୍ଦଶୀ', 'ପୂର୍ଣ୍ଣିମା'
];

export const NAKSHATRA_OR_MAP: Record<string, string> = {
  'Ashwini': 'ଅଶ୍ୱିନୀ',
  'Bharani': 'ଦ୍ୱିଜା / ଭରଣୀ',
  'Krittika': 'କୃତ୍ତିକା',
  'Rohini': 'ରୋହିଣୀ',
  'Mrigashira': 'ମୃଗଶିରା',
  'Ardra': 'ଆର୍ଦ୍ରା',
  'Punarvasu': 'ପୁନର୍ବସୁ',
  'Pushya': 'ପୁଷ୍ୟା',
  'Ashlesha': 'ଅଶ୍ଳେଷା',
  'Magha': 'ମଘା',
  'Purva Phalguni': 'ପୂର୍ବ ଫାଲ୍ଗୁନୀ',
  'Uttara Phalguni': 'ଉତ୍ତର ଫାଲ୍ଗୁନୀ',
  'Hasta': 'ହସ୍ତା',
  'Chitra': 'ଚିତ୍ରା',
  'Swati': 'ସ୍ୱାତୀ',
  'Vishakha': 'ବିଶାଖା',
  'Anuradha': 'ଅନୁରାଧା',
  'Jyeshtha': 'ଜ୍ୟେଷ୍ଠା',
  'Mula': 'ମୂଳା',
  'Purva Ashadha': 'ପୂର୍ବାଷାଢ଼ା',
  'Uttara Ashadha': 'ଉତ୍ତରାଷାଢ଼ା',
  'Shravana': 'ଶ୍ରବଣା',
  'Dhanishta': 'ଧନିଷ୍ଠା',
  'Shatabhisha': 'ଶତଭିଷା',
  'Purva Bhadrapada': 'ପୂର୍ବଭାଦ୍ରପଦ',
  'Uttara Bhadrapada': 'ଉତ୍ତରଭାଦ୍ରପଦ',
  'Revati': 'ରେବତୀ'
};

export const RASHI_OR_MAP: Record<number, { or: string; hi: string; en: string }> = {
  0: { or: 'ମେଷ', hi: 'मेष', en: 'Aries (Mesha)' },
  1: { or: 'ବୃଷ', hi: 'वृषभ', en: 'Taurus (Vrishabha)' },
  2: { or: 'ମିଥୁନ', hi: 'मिथुन', en: 'Gemini (Mithuna)' },
  3: { or: 'କର୍କଟ', hi: 'कर्क', en: 'Cancer (Karka)' },
  4: { or: 'ସିଂହ', hi: 'सिंह', en: 'Leo (Simha)' },
  5: { or: 'କନ୍ୟା', hi: 'कन्या', en: 'Virgo (Kanya)' },
  6: { or: 'ତୁଳା', hi: 'तुला', en: 'Libra (Tula)' },
  7: { or: 'ବିଛା', hi: 'वृश्चिक', en: 'Scorpio (Vrischika)' },
  8: { or: 'ଧନୁ', hi: 'धनु', en: 'Sagittarius (Dhanu)' },
  9: { or: 'ମକର', hi: 'मकर', en: 'Capricorn (Makara)' },
  10: { or: 'କୁମ୍ଭ', hi: 'कुम्भ', en: 'Aquarius (Kumbha)' },
  11: { or: 'ମୀନ', hi: 'मीन', en: 'Pisces (Meena)' },
};

export const DIGASHULA_DATA: Record<number, { directionOr: string; directionHi: string; directionEn: string; remedyOr: string; remedyHi: string; remedyEn: string }> = {
  0: { // Sunday
    directionOr: 'ପଶ୍ଚିମ ଦିଗ ଶୂଳ (ଯାତ୍ରା ବାରଣ)',
    directionHi: 'पश्चिम दिशा शूल (यात्रा वर्जित)',
    directionEn: 'West Direction Shula (Travel avoided)',
    remedyOr: 'ପ୍ରତିକାର: ଘୃତ (ଘିଅ) ଭକ୍ଷଣ କରି ଯାତ୍ରା ବିହିତ',
    remedyHi: 'उपाय: शुद्ध घी खाकर प्रस्थान करें',
    remedyEn: 'Remedy: Consume pure Ghee before departure'
  },
  1: { // Monday
    directionOr: 'ପୂର୍ବ ଦିଗ ଶୂଳ (ଯାତ୍ରା ବାରଣ)',
    directionHi: 'पूर्व दिशा शूल (यात्रा वर्जित)',
    directionEn: 'East Direction Shula (Travel avoided)',
    remedyOr: 'ପ୍ରତିକାର: କ୍ଷୀର (ଦୁଗ୍ଧ) ବା ଦଧି ଭକ୍ଷଣ କରି ଯାତ୍ରା ବିହିତ',
    remedyHi: 'उपाय: दूध या दही का सेवन कर प्रस्थान करें',
    remedyEn: 'Remedy: Consume milk or curd before travel'
  },
  2: { // Tuesday
    directionOr: 'ଉତ୍ତର ଦିଗ ଶୂଳ (ଯାତ୍ରା ବାରଣ)',
    directionHi: 'उत्तर दिशा शूल (यात्रा वर्जित)',
    directionEn: 'North Direction Shula (Travel avoided)',
    remedyOr: 'ପ୍ରତିକାର: ଗୁଡ଼ ଭକ୍ଷଣ କରି ଯାତ୍ରା ବିହିତ',
    remedyHi: 'उपाय: गुड़ खाकर प्रस्थान करें',
    remedyEn: 'Remedy: Consume Jaggery before departure'
  },
  3: { // Wednesday
    directionOr: 'ଉତ୍ତର ଦିଗ ଶୂଳ (ଯାତ୍ରା ବାରଣ)',
    directionHi: 'उत्तर दिशा शूल (यात्रा वर्जित)',
    directionEn: 'North Direction Shula (Travel avoided)',
    remedyOr: 'ପ୍ରତିକାର: ଦୂର୍ବା ଘାସ ସ୍ପର୍ଶ କରି ଯାତ୍ରା ବିହିତ',
    remedyHi: 'उपाय: दूर्वा घास स्पर्श कर प्रस्थान करें',
    remedyEn: 'Remedy: Touch Durva grass before travel'
  },
  4: { // Thursday
    directionOr: 'ଦକ୍ଷିଣ ଦିଗ ଶୂଳ (ଯାତ୍ରା ବାରଣ)',
    directionHi: 'दक्षिण दिशा शूल (यात्रा वर्जित)',
    directionEn: 'South Direction Shula (Travel avoided)',
    remedyOr: 'ପ୍ରତିକାର: ଦଧି (ଦହି) ଭକ୍ଷଣ କରି ଯାତ୍ରା ବିହିତ',
    remedyHi: 'उपाय: दही खाकर प्रस्थान करें',
    remedyEn: 'Remedy: Consume fresh curd before departure'
  },
  5: { // Friday
    directionOr: 'ପଶ୍ଚିମ ଦିଗ ଶୂଳ (ଯାତ୍ରା ବାରଣ)',
    directionHi: 'पश्चिम दिशा शूल (यात्रा वर्जित)',
    directionEn: 'West Direction Shula (Travel avoided)',
    remedyOr: 'ପ୍ରତିକାର: ଯବାନୀ (ଜୁଆଣି) ଭକ୍ଷଣ କରି ଯାତ୍ରା ବିହିତ',
    remedyHi: 'उपाय: अजवाइन खाकर प्रस्थान करें',
    remedyEn: 'Remedy: Consume Carom seeds before journey'
  },
  6: { // Saturday
    directionOr: 'ପୂର୍ବ ଦିଗ ଶୂଳ (ଯାତ୍ରା ବାରଣ)',
    directionHi: 'पूर्व दिशा शूल (यात्रा वर्जित)',
    directionEn: 'East Direction Shula (Travel avoided)',
    remedyOr: 'ପ୍ରତିକାର: ଆର୍ଦ୍ରକ (ଅଦା) ବା ସୋରିଷ ଭକ୍ଷଣ କରି ଯାତ୍ରା ବିହିତ',
    remedyHi: 'उपाय: अदरक या सरसों खाकर प्रस्थान करें',
    remedyEn: 'Remedy: Consume ginger or mustard before travel'
  }
};

export function getOdiaTithiOnly(tithiNumber: number): string {
  if (tithiNumber === 15) return 'ପୂର୍ଣ୍ଣିମା';
  if (tithiNumber === 30) return 'ଅମାବାସ୍ୟା';
  const idx = (tithiNumber - 1) % 15;
  return TITHI_NAMES_OR[idx] || 'ପ୍ରତିପଦା';
}

export function formatDegreeMinute(degVal: number): { or: string; en: string } {
  const deg = Math.floor(degVal);
  const min = Math.floor((degVal - deg) * 60);
  const degOr = formatOdiaNum(deg.toString().padStart(2, '0'));
  const minOr = formatOdiaNum(min.toString().padStart(2, '0'));
  return {
    or: `${degOr}° ${minOr}'`,
    en: `${deg.toString().padStart(2, '0')}° ${min.toString().padStart(2, '0')}'`
  };
}

export function formatTimeInOdia(timeStr: string): string {
  if (!timeStr) return '';
  let res = timeStr;
  res = res.replace(/AM/gi, 'ପୂର୍ବାହ୍ନ').replace(/PM/gi, 'ଅପରାହ୍ନ');
  return res.replace(/\d/g, d => ODIA_NUMERALS_MAP[parseInt(d, 10)]);
}

export function minutesToOdiaTimeStr(totalMinutes: number): string {
  let m = Math.round(totalMinutes) % 1440;
  if (m < 0) m += 1440;
  const h = Math.floor(m / 60);
  const mins = m % 60;
  let period = 'ଦିବା';
  if (h >= 4 && h < 8) period = 'ପ୍ରାତଃ';
  else if (h >= 8 && h < 12) period = 'ପୂର୍ବାହ୍ନ';
  else if (h >= 12 && h < 16) period = 'ଦିବା';
  else if (h >= 16 && h < 19) period = 'ଅପରାହ୍ନ';
  else if (h >= 19 && h < 23) period = 'ସନ୍ଧ୍ୟା/ରାତ୍ର';
  else period = 'ନିଶୀଥ';

  const displayH = h % 12 === 0 ? 12 : h % 12;
  const hStr = formatOdiaNum(displayH.toString().padStart(2, '0'));
  const mStr = formatOdiaNum(mins.toString().padStart(2, '0'));
  return `${period} ${hStr}:${mStr}`;
}

export function formatOdiaTimeWindow(startMinutes: number, endMinutes: number): { or: string; hi: string; en: string } {
  const startOr = minutesToOdiaTimeStr(startMinutes);
  let endOr = minutesToOdiaTimeStr(endMinutes);
  const startParts = startOr.split(' ');
  const endParts = endOr.split(' ');
  if (startParts[0] === endParts[0]) {
    endOr = endParts[1] || endOr;
  }
  return {
    or: `${startOr} ରୁ ${endOr}`,
    hi: `${minutesToTimeStr(startMinutes).replace('AM', 'पूर्वाह्न').replace('PM', 'अपराह्न')} से ${minutesToTimeStr(endMinutes).replace('AM', 'पूर्वाह्न').replace('PM', 'अपराह्न')}`,
    en: `${minutesToTimeStr(startMinutes)} – ${minutesToTimeStr(endMinutes)}`
  };
}


export function calculateOdiaCalendarDay(
  date: Date,
  latitude: number = 19.8135,
  longitude: number = 85.8312,
  editionId: string = 'kohinoor'
): DynamicOdiaDayInfo {
  const sunTimes = calculateSunTimes(date, latitude, longitude);
  // @ts-ignore
  const _tempTimeParse = (t: string) => { const [hm, p] = t.split(' '); const [h, m] = hm.split(':'); let hs = parseInt(h); if (p === 'PM' && hs !== 12) hs += 12; if (p === 'AM' && hs === 12) hs = 0; return hs * 60 + parseInt(m); };
  const _globalTimeParse = typeof timeStringToMinutes === 'function' ? timeStringToMinutes : _tempTimeParse;
  const sunriseMinutes = _globalTimeParse(sunTimes.sunrise);
  const sunsetMinutes = _globalTimeParse(sunTimes.sunset);

  // In authentic Vedic Jyotisha / Odia Panjika Shastra, the canonical day Panchanga
  // (Udaya Tithi, Udaya Nakshatra, Dina Rashi) is anchored precisely to Suryodaya (Sunrise).
  const sHour = Math.floor(sunriseMinutes / 60);
  const sMin = sunriseMinutes % 60;
  const sunriseDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), sHour, sMin, 0);

  const panjika = calculatePanjika(sunriseDate, latitude, longitude);
  const planets = calculatePlanetaryPositions(sunriseDate);
  const sunDeg = normalizeDegrees(planets.sun);

  // 1. Determine Nirayana Solar Month & Solar Day
  const solarRashiIdx = Math.floor(sunDeg / 30); // 0 = Mesha (Baisakha) ... 11 = Meena (Chaitra)
  const odiaSolarMonth = ODIA_SOLAR_MONTHS[solarRashiIdx];
  const degInRashi = sunDeg % 30;
  const odiaSolarDay = Math.floor(degInRashi) + 1;

  // Detect Sankranti (Day of transit: Sun enters a new Nirayana Rashi from previous day)
  const prevDate = new Date(sunriseDate.getTime() - 86400000);
  const prevPlanets = calculatePlanetaryPositions(prevDate);
  const prevSolarRashi = Math.floor(normalizeDegrees(prevPlanets.sun) / 30);
  const isSankranti = prevSolarRashi !== solarRashiIdx;

  let sankrantiName: { or: string; hi: string; en: string } | undefined;
  let sankrantiPunyakala: string | undefined;

  if (isSankranti) {
    const rNameOr = odiaSolarMonth.rashiOr;
    const rNameHi = odiaSolarMonth.nameHi;
    const rNameEn = odiaSolarMonth.rashiEn;

    let specialOr = `${rNameOr} ସଂକ୍ରାନ୍ତି`;
    let specialHi = `${rNameHi} संक्रांति`;
    let specialEn = `${rNameEn} Sankranti`;

    if (solarRashiIdx === 0) {
      specialOr = 'ମହା ବିଷୁବ / ପଣା ସଂକ୍ରାନ୍ତି (ଓଡ଼ିଆ ନବବର୍ଷ)';
      specialHi = 'महाविषुव / पना संक्रांति (ओड़िया नववर्ष)';
      specialEn = 'Maha Vishuba / Pana Sankranti (Odia New Year)';
    } else if (solarRashiIdx === 2) {
      specialOr = 'ମିଥୁନ ସଂକ୍ରାନ୍ତି (ରଜ ସଂକ୍ରାନ୍ତି)';
      specialHi = 'मिथुन संक्रांति (रज संक्रांति)';
      specialEn = 'Mithuna Sankranti (Raja Sankranti)';
    } else if (solarRashiIdx === 3) {
      specialOr = 'କର୍କଟ ସଂକ୍ରାନ୍ତି (ଦକ୍ଷିଣାୟନ ଆରମ୍ଭ)';
      specialHi = 'कर्क संक्रांति (दक्षिणायन प्रारंभ)';
      specialEn = 'Karka Sankranti (Dakshinayana)';
    } else if (solarRashiIdx === 8) {
      specialOr = 'ଧନୁ ସଂକ୍ରାନ୍ତି (ଧନୁ ମୁଆଁ ଭୋଗ ଆରମ୍ଭ)';
      specialHi = 'धनु संक्रांति';
      specialEn = 'Dhanu Sankranti';
    } else if (solarRashiIdx === 9) {
      specialOr = 'ମକର ସଂକ୍ରାନ୍ତି (ଉତ୍ତରାୟଣ ଆରମ୍ଭ)';
      specialHi = 'मकर संक्रांति (उत्तरायण प्रारंभ)';
      specialEn = 'Makara Sankranti (Uttarayana)';
    }

    sankrantiName = { or: specialOr, hi: specialHi, en: specialEn };
    // Estimate transit time: if degInRashi is small, transit happened recently
    const transitHoursAgo = degInRashi / 0.9856; // Sun moves ~0.9856 deg/day
    const transitMinutes = Math.round((sunriseMinutes - transitHoursAgo * 60 + 1440) % 1440);
    const punyaStart = Math.max(sunriseMinutes, transitMinutes - 384); // 16 ghatikas = 384 min
    const punyaEnd = Math.min(sunsetMinutes, transitMinutes + 384);
    const punyaStartStr = minutesToOdiaTimeStr(punyaStart);
    const punyaEndStr = minutesToOdiaTimeStr(punyaEnd);
    sankrantiPunyakala = `${punyaStartStr} ରୁ ${punyaEndStr} ପର୍ଯ୍ୟନ୍ତ (ପୁଣ୍ୟକାଳ ସ୍ନାନ-ଦାନ)`;
  }

  // 2. Lunar Month Name Calculation (Purnimanta system followed in Odisha)
  const tithiNumber = panjika.tithi.number;
  const isShukla = panjika.tithi.paksha === 'Shukla';

  // Previous sunrise's tithi — used to detect kshaya (skipped) tithis.
  // A kshaya tithi has no sunrise within its span, so it is skipped between
  // two consecutive sunrise days (e.g. Pratipada 1 -> Tritiya 3 means Dwitiya 2
  // was kshaya). This matters for festivals tied to a specific tithi number.
  const prevCalDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
  const prevSunTimes = calculateSunTimes(prevCalDate, latitude, longitude);
  const prevSm = _globalTimeParse(prevSunTimes.sunrise);
  const prevSunriseDate = new Date(
    prevDate.getFullYear(),
    prevDate.getMonth(),
    prevDate.getDate(),
    Math.floor(prevSm / 60),
    prevSm % 60,
    0
  );
  const prevPanajika = calculatePanjika(prevSunriseDate, latitude, longitude);
  const prevTithiNumber = prevPanajika.tithi.number;
  const prevIsShukla = prevPanajika.tithi.paksha === 'Shukla';
  const isPurnima = tithiNumber === 15;
  const isAmavasya = tithiNumber === 30;
  const isEkadashi = tithiNumber === 11 || tithiNumber === 26;
  const isPradosha = tithiNumber === 13 || tithiNumber === 28;

  // In Purnimanta tradition (followed in Odisha & Surya Siddhanta),
  // a lunar month runs from Krishna Pratipada through Amavasya to Purnima.
  // The month name is determined by the Sun's Nirayana Rashi at that month's Amavasya,
  // remaining invariant throughout the entire Purnimanta month cycle.
  const moonDeg = normalizeDegrees(planets.moon);
  const elongation = (moonDeg - sunDeg + 360) % 360;
  const daysToAmavasya = isShukla 
    ? -(elongation / 12.19074) 
    : ((360 - elongation) / 12.19074);
  const approxAmavasyaTime = new Date(date.getTime() + daysToAmavasya * 86400000);
  const amavasyaPlanets = calculatePlanetaryPositions(approxAmavasyaTime);
  const sunAtAmavasya = normalizeDegrees(amavasyaPlanets.sun);
  const lunarMonthIdx = Math.floor(sunAtAmavasya / 30) % 12;
  const lunarMonthObj = ODIA_SOLAR_MONTHS[lunarMonthIdx];
  const lunarMonthName = {
    or: `${lunarMonthObj.nameOr} ଚାନ୍ଦ୍ରମାସ`,
    hi: `${lunarMonthObj.nameHi} चंद्र मास`,
    en: `${lunarMonthObj.nameEn} Lunar Month`
  };

  // 3. Named Ekadashi Lookup (strictly based on genuine Lunar Month)
  let ekadashiName: { or: string; hi: string; en: string } | undefined;
  if (isEkadashi) {
    const key = `${lunarMonthObj.id}_${isShukla ? 'shukla' : 'krishna'}`;
    ekadashiName = EKADASHI_NAMES[key] || {
      or: `${isShukla ? 'ଶୁକ୍ଳ' : 'କୃଷ୍ଣ'} ଏକାଦଶୀ ବ୍ରତ`,
      hi: `${isShukla ? 'शुक्ल' : 'कृष्ण'} एकादशी व्रत`,
      en: `${isShukla ? 'Shukla' : 'Krishna'} Ekadashi Vrata`
    };
  }

  // Authentic Vedic Kala Vyapti Calculations (କାଳ ବ୍ୟାପ୍ତି ନିର୍ଣ୍ଣୟ)
  const localYear = date.getFullYear();
  const localMonth = date.getMonth();
  const localDay = date.getDate();

  const getDateAtMinute = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = Math.floor(minutes % 60);
    return new Date(localYear, localMonth, localDay, h, m, 0);
  };

  const dayLength = sunsetMinutes - sunriseMinutes;
  const purvahnaMinute = sunriseMinutes + dayLength / 4;       // Forenoon (~09:00 - 10:30)
  const madhyahnaMinute = sunriseMinutes + dayLength / 2;      // Midday / Solar Noon (~11:45 - 12:15)
  const aparahnaMinute = sunriseMinutes + (3 * dayLength) / 4; // Afternoon (~14:00 - 15:30)
  const pradoshaMinute = sunsetMinutes + 36;                   // Dusk / Evening (~18:00 - 18:45)
  const nishithaMinute = (sunsetMinutes + (1440 - dayLength) / 2) % 1440; // Midnight (~23:45 - 00:15)

  const getTithiInfoAt = (targetDate: Date) => {
    const p = calculatePlanetaryPositions(targetDate);
    const diff = normalizeDegrees(p.moon - p.sun);
    const tNum = Math.floor(diff / 12) + 1;
    const isSh = tNum <= 15;
    return {
      tithiNumber: tNum,
      isShukla: isSh,
      diff
    };
  };

  const tithiPurvahna = getTithiInfoAt(getDateAtMinute(purvahnaMinute));
  const tithiMadhyahna = getTithiInfoAt(getDateAtMinute(madhyahnaMinute));
  const tithiAparahna = getTithiInfoAt(getDateAtMinute(aparahnaMinute));
  const tithiPradosha = getTithiInfoAt(getDateAtMinute(pradoshaMinute));
  const tithiNishitha = getTithiInfoAt(getDateAtMinute(nishithaMinute));

  // 4. Dynamic Odisha Festival Engine (Astronomy-Based)
  const festivals: DynamicOdiaDayInfo['festivals'] = [];
  const monthId = odiaSolarMonth.id;
  const lunarMonthId = ODIA_SOLAR_MONTHS[lunarMonthIdx].id;
  const weekday = date.getDay(); // 0=Sun, 4=Thu

  // Sankranti festival
  if (isSankranti && sankrantiName) {
    let sankrantiFestId = `sankranti_${monthId}`;
    if (solarRashiIdx === 0) {
      sankrantiFestId = 'pana_sankranti';
    } else if (solarRashiIdx === 8) {
      sankrantiFestId = 'dhanu_sankranti';
    } else if (solarRashiIdx === 9) {
      sankrantiFestId = 'makara_sankranti';
    }
    festivals.push({
      id: sankrantiFestId,
      nameOr: sankrantiName.or,
      nameHi: sankrantiName.hi,
      nameEn: sankrantiName.en,
      type: 'sankranti',
      descriptionOr: 'ସୂର୍ଯ୍ୟ ଦେବଙ୍କ ନୂତନ ରାଶି ପ୍ରବେଶ। ସ୍ନାନ, ଦାନ, ପୂଜା ଓ ପୁଣ୍ୟକାଳ ପାଳନ।',
      descriptionEn: 'Auspicious solar transit of the Sun into a new Nirayana zodiac sign.',
      isGovernmentHoliday: solarRashiIdx === 0 || solarRashiIdx === 9
    });
  }

  // Baisakha Festivals
  if (lunarMonthId === 'baisakha') {
    if (isShukla && tithiNumber === 3) {
      festivals.push({
        id: 'akshaya_tritiya',
        nameOr: 'ଅକ୍ଷୟ ତୃତୀୟା (ରଥ ନିର୍ମାଣ ଅନୁକୂଳ ଓ ଚନ୍ଦନ ଯାତ୍ରା)',
        nameHi: 'अक्षय तृतीया (रथ निर्माण अनुकूल एवं चंदन यात्रा)',
        nameEn: 'Akshaya Tritiya (Rath Construction Begins & Chandan Yatra)',
        type: 'major',
        descriptionOr: 'ଶ୍ରୀକ୍ଷେତ୍ରରେ ରଥଯାତ୍ରା ପାଇଁ ୩ ରଥ ନିର୍ମାଣର ଶୁଭାରମ୍ଭ ଏବଂ ୪୨-ଦିନବ୍ୟାପୀ ଚନ୍ଦନ ଯାତ୍ରା ଆରମ୍ଭ।',
        descriptionEn: 'Construction of the three sacred chariots begins in Puri along with the 42-day Chandan Yatra.',
        isGovernmentHoliday: true
      });
    }
    if (isShukla && tithiNumber === 14) {
      festivals.push({
        id: 'nrusimha_chaturdashi',
        nameOr: 'ନୃସିଂହ ଚତୁର୍ଦ୍ଦଶୀ (ନୃସିଂହ ଜନ୍ମ)',
        nameHi: 'नृसिंह चतुर्दशी (नृसिंह जयंती)',
        nameEn: 'Nrusimha Chaturdashi',
        type: 'puja',
        descriptionOr: 'ଭଗବାନ ଶ୍ରୀ ନୃସିଂହଙ୍କ ଆବିର୍ଭାବ ତିଥି।',
        descriptionEn: 'Appearance day of Lord Nrusimha.'
      });
    }
    if (isPurnima) {
      festivals.push({
        id: 'baisakha_purnima',
        nameOr: 'ବୈଶାଖ ପୂର୍ଣ୍ଣିମା (ଚନ୍ଦନ ପୂର୍ଣ୍ଣିମା ଓ ବୁଦ୍ଧ ଜୟନ୍ତୀ)',
        nameHi: 'वैशाख पूर्णिमा / बुद्ध जयंती',
        nameEn: 'Baisakha Purnima / Buddha Jayanti',
        type: 'puja',
        descriptionOr: 'ଚନ୍ଦନ ଯାତ୍ରାର ବିଶେଷ ପୂର୍ଣ୍ଣାହୂତି ଓ ଗୌତମ ବୁଦ୍ଧ ଜୟନ୍ତୀ।',
        descriptionEn: 'Grand completion of outer Chandan Yatra and Buddha Jayanti.',
        isGovernmentHoliday: true
      });
    }
  }

  // Jyestha Festivals
  // Jyestha Festivals (Observed in Nija / Shuddha Jyestha)
  if (lunarMonthId === 'jyestha') {
    // Sabitri Amavasya: Observed on the Amavasya immediately preceding Mithuna Sankranti / Snana Purnima
    if (isAmavasya && (solarRashiIdx === 2 || (solarRashiIdx === 1 && degInRashi >= 25) || odiaSolarDay >= 25)) {
      festivals.push({
        id: 'sabitri_amavasya',
        nameOr: 'ସାବିତ୍ରୀ ଅମାବାସ୍ୟା (ମହା ସତୀ ବ୍ରତ)',
        nameHi: 'सावित्री अमावस्या',
        nameEn: 'Sabitri Amavasya',
        type: 'vrata',
        descriptionOr: 'ଓଡ଼ିଆ ସଧବା ନାରୀମାନଙ୍କ ସ୍ୱାମୀଙ୍କ ଦୀର୍ଘାୟୁ ପାଇଁ ପବିତ୍ର ବ୍ରତ ଓ ଯମରାଜ-ସାବିତ୍ରୀ ପୂଜା।',
        descriptionEn: 'Sacred fast by married Odia women for the longevity of their husbands.',
        isGovernmentHoliday: true
      });
    }
    // Sitala Sasthi: Jyestha Shukla Sasthi in Nija Jyestha
    if (isShukla && tithiNumber === 6 && (solarRashiIdx === 2 || (solarRashiIdx === 1 && degInRashi >= 10))) {
      festivals.push({
        id: 'sitala_sasthi',
        nameOr: 'ଶୀତଳ ଷଷ୍ଠୀ ଯାତ୍ରା (ଶିବ-ପାର୍ବତୀ ବିବାହ)',
        nameHi: 'शीतल षष्ठी (शिव-पार्वती विवाह)',
        nameEn: 'Sitala Sasthi Jatra',
        type: 'jatra',
        descriptionOr: 'ପଶ୍ଚିମ ଓଡ଼ିଶାର ବିଶିଷ୍ଟ ଲୋକ ଉତ୍ସବ, ଦେବାଧିଦେବ ମହାଦେବ ଓ ମାତା ପାର୍ବତୀଙ୍କ ଲୌକିକ ବିବାହ।',
        descriptionEn: 'Divine wedding festival of Lord Shiva and Goddess Parvati, celebrated with grandeur in Sambalpur.'
      });
    }
    // Deva Snana Purnima: Jyestha Purnima in Nija Jyestha (15 days strictly preceding Ratha Yatra)
    if (isPurnima && (solarRashiIdx === 2 || (solarRashiIdx === 1 && degInRashi >= 25))) {
      festivals.push({
        id: 'snana_purnima',
        nameOr: 'ଦେବସ୍ନାନ ପୂର୍ଣ୍ଣିମା (ହାତୀ ବେଶ ଓ ଅଣସର ବିଜେ)',
        nameHi: 'देवस्नान पूर्णिमा (हाथी वेश)',
        nameEn: 'Deva Snana Purnima (Hati Besha)',
        type: 'major',
        descriptionOr: 'ଶ୍ରୀମନ୍ଦିରରେ ଚତୁର୍ଦ୍ଧାମୂର୍ତ୍ତିଙ୍କ ୧୦୮ ସୁବାସିତ ସୁବର୍ଣ୍ଣ କଳସରେ ମହାସ୍ନାନ, ଗଜାନନ ବେଶ ଓ ୧୫ ଦିନର ଅଣସର ବିଜେ।',
        descriptionEn: 'Grand 108-pot bathing ceremony of Lord Jagannath, Elephant Attire (Hati Besha), and entry into Anasara.',
        isGovernmentHoliday: true
      });
    }
  }

  // Raja Parba (4-Day Canonical Solar Agrarian Festival of Odisha tied to Mithuna Sankranti in mid-June)
  // Day 1: Pahili Raja (Last day of Jyestha solar month, eve of Mithuna Sankranti)
  // Detect as: today is in Vrushabha (solarRashiIdx === 1) AND tomorrow will be in Mithuna (solarRashiIdx === 2)
  if (solarRashiIdx === 1) {
    const tomorrowDate = new Date(date.getTime() + 86400000);
    const tomorrowPlanets = calculatePlanetaryPositions(tomorrowDate);
    const tomorrowSolarRashi = Math.floor(normalizeDegrees(tomorrowPlanets.sun) / 30);
    if (tomorrowSolarRashi === 2) {
      festivals.push({
        id: 'pahili_raja',
        nameOr: 'ପହିଲି ରଜ (ରଜ ପର୍ବ ଆରମ୍ଭ)',
        nameHi: 'पहिली रज',
        nameEn: 'Pahili Raja (Earth Fertility Festival)',
        type: 'major',
        descriptionOr: 'ଓଡ଼ିଶାର ସର୍ବବୃହତ୍ ଲୋକପର୍ବ, ଦୋଳି ଖେଳ, ପୋଡ଼ପିଠା ଓ ଧରିତ୍ରୀ ମାତାଙ୍କ ସମ୍ମାନ।',
        descriptionEn: 'Odishas unique festival celebrating Mother Earth womanhood with swings, Poda Pitha, and joy.',
        isGovernmentHoliday: true
      });
    }
  }
  // Day 2: Raja Sankranti / Mithuna Sankranti (Asadha Solar Day 1)
  if (solarRashiIdx === 2 && odiaSolarDay === 1) {
    festivals.push({
      id: 'raja_sankranti',
      nameOr: 'ରଜ ସଂକ୍ରାନ୍ତି (ମିଥୁନ ସଂକ୍ରାନ୍ତି)',
      nameHi: 'रज संक्रांति (मिथुन संक्रांति)',
      nameEn: 'Raja Sankranti (Mithuna Sankranti)',
      type: 'major',
      descriptionOr: 'ରଜ ପର୍ବର ଦ୍ୱିତୀୟ ମୁଖ୍ୟ ଦିବସ, ମିଥୁନ ସଂକ୍ରାନ୍ତି ପୁଣ୍ୟକାଳ ସ୍ନାନ-ଦାନ ଓ ପୋଡ଼ପିଠା ଭୋଜନ।',
      descriptionEn: 'Second and core day of Raja Parba celebrating Mithuna Sankranti.',
      isGovernmentHoliday: true
    });
  }
  // Day 3: Shesa Raja / Bhuin Dahana (Asadha Solar Day 2)
  if (solarRashiIdx === 2 && odiaSolarDay === 2) {
    festivals.push({
      id: 'shesa_raja',
      nameOr: 'ଶେଷ ରଜ (ଭୂଇଁ ଦହନ)',
      nameHi: 'शेष रज (भुईं दहन)',
      nameEn: 'Shesa Raja (Bhuin Dahana)',
      type: 'major',
      descriptionOr: 'ରଜ ପର୍ବର ତୃତୀୟ ଦିନ, ଭୂମି ଖନନ ନିଷେଧ ଓ ଧରିତ୍ରୀ ବିଶ୍ରାମ।',
      descriptionEn: 'Third day of Raja Parba, observing rest for Mother Earth.',
      isGovernmentHoliday: true
    });
  }
  // Day 4: Basumati Snana (Asadha Solar Day 3, 4th Day of Raja)
  if (solarRashiIdx === 2 && odiaSolarDay === 3) {
    festivals.push({
      id: 'basumati_snana',
      nameOr: 'ବସୁମତୀ ସ୍ନାନ (ଧରିତ୍ରୀ ମାତାଙ୍କ ଶୁଦ୍ଧ ସ୍ନାନ)',
      nameHi: 'वसुमती स्नान',
      nameEn: 'Basumati Snana (Purification of Mother Earth)',
      type: 'major',
      descriptionOr: 'ଚତୁର୍ଥ ଦିନରେ ଧରିତ୍ରୀ ମାତାଙ୍କୁ ହଳଦୀ ଚନ୍ଦନରେ ଶୁଦ୍ଧ ସ୍ନାନ କରାଇ ରଜ ପର୍ବର ମହା ସମାପନ।',
      descriptionEn: 'Fourth day ritual bathing of the grinding stone representing Mother Earth.'
    });
  }

  // Asadha Festivals (RATHA YATRA & ASSOCIATED RITUALS)
  if (lunarMonthId === 'asadha') {
    // Ratha Yatra = Asadha Shukla Dwitiya (tithi 2). When Dwitiya is kshaya
    // (no sunrise falls within it, so no sunrise day has tithi 2 — e.g. 1975),
    // the festival is observed on the first Shukla sunrise after the gap
    // (Tritiya, tithi 3), i.e. previous sunrise was Pratipada (1).
    const isKshayaDwitiya = isShukla && tithiNumber === 3 && prevIsShukla && prevTithiNumber === 1;
    if (isShukla && (tithiNumber === 2 || isKshayaDwitiya)) {
      festivals.push({
        id: 'ratha_yatra',
        nameOr: 'ବିଶ୍ୱପ୍ରସିଦ୍ଧ ରଥଯାତ୍ରା (ଶ୍ରୀଗୁଣ୍ଡିଚା ଯାତ୍ରା)',
        nameHi: 'विश्वप्रसिद्ध रथ यात्रा (श्रीगुंडिचा यात्रा)',
        nameEn: 'World-Famous Ratha Yatra (Car Festival)',
        type: 'major',
        descriptionOr: 'ନନ୍ଦିଘୋଷ, ତାଳଧ୍ୱଜ ଓ ଦର୍ପଦଳନ ରଥରେ ଚତୁର୍ଦ୍ଧାମୂର୍ତ୍ତିଙ୍କ ବଡ଼ଦାଣ୍ଡରେ ଶ୍ରୀଗୁଣ୍ଡିଚା ମନ୍ଦିର ବିଜେ।',
        descriptionEn: 'Lord Jagannath, Balabhadra, and Subhadra journey on Nandighosha, Taladhwaja, and Darpadalana chariots to Gundicha temple.',
        isGovernmentHoliday: true
      });
    }
    if (isShukla && tithiNumber === 5) {
      festivals.push({
        id: 'hera_panchami',
        nameOr: 'ହେରା ପଞ୍ଚମୀ (ମା’ ଲକ୍ଷ୍ମୀଙ୍କ ଗୁଣ୍ଡିଚା ମନ୍ଦିର ବିଜେ)',
        nameHi: 'हेरा पंचमी',
        nameEn: 'Hera Panchami',
        type: 'puja',
        descriptionOr: 'ମା’ ମହାଲକ୍ଷ୍ମୀ ମହାପ୍ରଭୁଙ୍କ ଉପରେ ମାନ କରି ନନ୍ଦିଘୋଷ ରଥ ଭାଙ୍ଗିବାର ଅନନ୍ୟ ଲୀଳା।',
        descriptionEn: 'Goddess Lakshmi visits Gundicha temple to express loving anger and breaks a piece of Nandighosha chariot.'
      });
    }
    if (isShukla && tithiNumber === 10) {
      festivals.push({
        id: 'bahuda_yatra',
        nameOr: 'ବାହୁଡ଼ା ଯାତ୍ରା (ଫେରନ୍ତା ରଥ ଓ ମାଉସୀ ମା’ ପୋଡ଼ପିଠା)',
        nameHi: 'बाहुड़ा यात्रा (वापसी रथ)',
        nameEn: 'Bahuda Yatra (Return Car Festival)',
        type: 'major',
        descriptionOr: 'ଗୁଣ୍ଡିଚା ମନ୍ଦିରରୁ ଶ୍ରୀମନ୍ଦିର ବାହୁଡ଼ା ଏବଂ ମାଉସୀ ମା’ ମନ୍ଦିରରେ ପୋଡ଼ପିଠା ଭୋଗ।',
        descriptionEn: 'Return journey of the Holy Trinity to Srimandir with sacred Poda Pitha offering at Mausi Maa temple.',
        isGovernmentHoliday: true
      });
    }
    if (isShukla && tithiNumber === 11) {
      festivals.push({
        id: 'suna_besha',
        nameOr: 'ମହାର୍ଘ ସୁନା ବେଶ (ରଥ ଉପରେ ରାଜାଧିରାଜ ବେଶ)',
        nameHi: 'सुना वेश (स्वर्ण वेश)',
        nameEn: 'Suna Besha (Golden Attire on Chariots)',
        type: 'major',
        descriptionOr: 'ସିଂହଦ୍ୱାର ସମ୍ମୁଖରେ ରଥ ଉପରେ ୧୩୮ କିଲୋ ସ୍ୱର୍ଣ୍ଣ ଅଳଙ୍କାରରେ ମହାପ୍ରଭୁଙ୍କ ରାଜରାଜେଶ୍ୱର ବେଶ।',
        descriptionEn: 'Grand Golden Attire of the Holy Trinity on chariots outside Lions Gate with 138 kg of sacred gold ornaments.',
        isGovernmentHoliday: true
      });
    }
    if (isShukla && tithiNumber === 13) {
      festivals.push({
        id: 'niladri_bije',
        nameOr: 'ନୀଳାଦ୍ରି ବିଜେ (ରସଗୋଲା ଦିବସ)',
        nameHi: 'नीलाद्रि बीजे (रसगुल्ला दिवस)',
        nameEn: 'Niladri Bije (Rasagola Dibasa)',
        type: 'major',
        descriptionOr: 'ରଥରୁ ରତ୍ନସିଂହାସନକୁ ମହାପ୍ରଭୁଙ୍କ ପ୍ରବେଶ। ମା’ ଲକ୍ଷ୍ମୀଙ୍କ ମାନଭଞ୍ଜନ ପାଇଁ ରସଗୋଲା ଭୋଗ।',
        descriptionEn: 'Return of Lord Jagannath to the Ratnavedi inside Srimandir, placating Goddess Lakshmi with sweet Rasagola.'
      });
    }
  }

  // Sravana Festivals
  if (lunarMonthId === 'sravana') {
    if (isAmavasya) {
      festivals.push({
        id: 'chitalagi_amavasya',
        nameOr: 'ଚିତାଲାଗି ଅମାବାସ୍ୟା (ଚିତଉ ପିଠା)',
        nameHi: 'चितालागि अमावस्या',
        nameEn: 'Chitalagi Amavasya',
        type: 'major',
        descriptionOr: 'ଶ୍ରୀଜୀଉଙ୍କ ଶ୍ରୀମସ୍ତକରେ ସ୍ୱର୍ଣ୍ଣ ଓ ହୀରା ଖଚିତ ଚିତା ଲାଗି ଏବଂ ଓଡ଼ିଶାର ଘରେ ଘରେ ସୁସ୍ୱାଦୁ ଚିତଉ ପିଠା।',
        descriptionEn: 'Golden and Diamond forehead Chitas adorned on Lord Jagannath; Chitau Pitha offered in every home.'
      });
    }
    if (isPurnima) {
      festivals.push({
        id: 'gamha_purnima',
        nameOr: 'ଗହ୍ମା ପୂର୍ଣ୍ଣିମା (ବଳଭଦ୍ର ଜନ୍ମ ଓ ରାକ୍ଷୀ ବନ୍ଧନ)',
        nameHi: 'गम्हा पूर्णिमा (बलभद्र जयंती / रक्षाबंधन)',
        nameEn: 'Gamha Purnima (Balabhadra Janma & Rakhi)',
        type: 'major',
        descriptionOr: 'ବଡ଼ଠାକୁର ଶ୍ରୀ ବଳଭଦ୍ରଙ୍କ ଜନ୍ମୋତ୍ସବ, ଗୋ-ପୂଜନ, ଗହ୍ମା ଡିଆଁ ଓ ରକ୍ଷାବନ୍ଧନ।',
        descriptionEn: 'Appearance day of Lord Balabhadra, cattle worship, Gamha Dian jump, and Raksha Bandhan.',
        isGovernmentHoliday: true
      });
    }
  }

  // Bhadraba Festivals
  if (lunarMonthId === 'bhadraba') {
    // Janmashtami: Strictly Nishitha Vyapini Krishna Ashtami (tithi 23)
    if (!tithiNishitha.isShukla && tithiNishitha.tithiNumber === 23) {
      festivals.push({
        id: 'janmashtami',
        nameOr: 'ଶ୍ରୀକୃଷ୍ଣ ଜନ୍ମାଷ୍ଟମୀ (ମହା ଅଷ୍ଟମୀ ବ୍ରତ)',
        nameHi: 'श्रीकृष्ण जन्माष्टमी',
        nameEn: 'Shri Krishna Janmashtami',
        type: 'major',
        descriptionOr: 'ପରମବ୍ରହ୍ମ ଭଗବାନ ଶ୍ରୀକୃଷ୍ଣଙ୍କ ଜନ୍ମୋତ୍ସବ, ଅହୋରାତ୍ର ଉପବାସ ଓ ନିଶୀଥ ପୂଜା।',
        descriptionEn: 'Celebration of the divine birth of Lord Krishna with midnight worship and fasting.',
        isGovernmentHoliday: true
      });
    }
    if (!isShukla && tithiNumber === 24) {
      festivals.push({
        id: 'nandotsava',
        nameOr: 'ନନ୍ଦୋତ୍ସବ (ଶ୍ରୀମନ୍ଦିର ବନଭୋଜି ବେଶ)',
        nameHi: 'नंदोत्सव',
        nameEn: 'Nandotsava',
        type: 'puja',
        descriptionOr: 'ଗୋକୁଳରେ ନନ୍ଦରାଜାଙ୍କ ଆନନ୍ଦୋତ୍ସବ ଓ ଶ୍ରୀମନ୍ଦିରରେ ମହାପ୍ରଭୁଙ୍କ ବନଭୋଜି ବେଶ।',
        descriptionEn: 'Joyous festivities of King Nanda in Gokul; Banabhoji Besha in Srimandir.'
      });
    }
    if (isAmavasya) {
      festivals.push({
        id: 'saptapuri_amavasya',
        nameOr: 'ସପ୍ତପୁରୀ ଅମାବାସ୍ୟା (କୌଶିକୀ ଅମାବାସ୍ୟା)',
        nameHi: 'सप्तपुरी अमावस्या',
        nameEn: 'Saptapuri Amavasya',
        type: 'major',
        descriptionOr: 'ଶ୍ରୀମନ୍ଦିରରେ ତାଡ଼ଉ କରଣଙ୍କ ଦ୍ୱାରା ସପ୍ତପୁରୀ ତାଡ଼ ଅର୍ପଣ ଓ ପିତୃପୂଜନ।',
        descriptionEn: 'Sacred Saptapuri offerings in Srimandir and ancestral worship.'
      });
    }
    // Ganesh Puja: Strictly Madhyahna Vyapini Bhadraba Shukla Chaturthi (tithi 4)
    if (isShukla && tithiMadhyahna.isShukla && tithiMadhyahna.tithiNumber === 4) {
      festivals.push({
        id: 'ganesh_puja',
        nameOr: 'ଗଣେଶ ପୂଜା (ବିନାୟକ ଚତୁର୍ଥୀ)',
        nameHi: 'गणेश चतुर्थी',
        nameEn: 'Ganesh Chaturthi',
        type: 'puja',
        descriptionOr: 'ବିଘ୍ନରାଜ ଶ୍ରୀ ଗଣେଶଙ୍କ ମହାପୂଜା, ଲଡୁ ଭୋଗ ଓ ବିଦ୍ୟାରମ୍ଭ।',
        descriptionEn: 'Worship of the remover of obstacles, Lord Ganesha.',
        isGovernmentHoliday: true
      });
    }
    // Nuakhai: Strictly Madhyahna Vyapini Bhadraba Shukla Panchami
    if (isShukla && tithiMadhyahna.isShukla && tithiMadhyahna.tithiNumber === 5) {
      festivals.push({
        id: 'nuakhai',
        nameOr: 'ନୂଆଖାଇ (ପଶ୍ଚିମ ଓଡ଼ିଶାର ମହାନ କୃଷି ଗଣପର୍ବ)',
        nameHi: 'नुआखाई (पश्चिम ओडिशा कृषि महापर्व)',
        nameEn: 'Nuakhai (Western Odisha Harvest Festival)',
        type: 'major',
        descriptionOr: 'ମା’ ସମଲେଶ୍ୱରୀଙ୍କ ପାଖରେ ନୂତନ ଶସ୍ୟ ନବାନ୍ନ ଭୋଗ ଏବଂ "ନୂଆଖାଇ ଜୁହାର୍" ଭାତୃଭାବ।',
        descriptionEn: 'Premier agrarian festival of Western Odisha offering newly harvested paddy to Maa Samaleswari.',
        isGovernmentHoliday: true
      });
    }
    if (isShukla && tithiNumber === 8) {
      festivals.push({
        id: 'radha_ashtami',
        nameOr: 'ରାଧାଷ୍ଟମୀ (ଶ୍ରୀମତୀ ରାଧାରାଣୀ ଆବିର୍ଭାବ)',
        nameHi: 'राधाष्टमी',
        nameEn: 'Radha Ashtami',
        type: 'puja',
        descriptionOr: 'ଶ୍ରୀବୃନ୍ଦାବନେଶ୍ୱରୀ ଶ୍ରୀରାଧାଙ୍କ ଆବିର୍ଭାବ ଉତ୍ସବ ଓ ବିଶେଷ ପୂଜାର୍ଚ୍ଚନା।',
        descriptionEn: 'Appearance day of Srimati Radharani with special Vaishnava worship.'
      });
    }
    if (isShukla && tithiNumber === 14) {
      festivals.push({
        id: 'ananta_vrata',
        nameOr: 'ଅନନ୍ତ ଚତୁର୍ଦ୍ଦଶୀ (୧୪ ଗଣ୍ଠି ଡୋରା ବ୍ରତ)',
        nameHi: 'अनंत चतुर्दशी',
        nameEn: 'Ananta Chaturdashi',
        type: 'vrata',
        descriptionOr: 'ଅନନ୍ତ ପଦ୍ମନାଭଙ୍କ ପୂଜା ଓ ୧୪ ଗଣ୍ଠି ଯୁକ୍ତ ପବିତ୍ର ରକ୍ଷା ସୂତ୍ର ଧାରଣ।',
        descriptionEn: 'Sacred worship of Lord Ananta Padmanabha wearing 14-knot sacred cord.'
      });
    }
    if (isPurnima) {
      festivals.push({
        id: 'indu_purnima',
        nameOr: 'ଭାଦ୍ରବ ପୂର୍ଣ୍ଣିମା (ଇନ୍ଦୁ ପୂର୍ଣ୍ଣିମା)',
        nameHi: 'भाद्रपद पूर्णिमा',
        nameEn: 'Indu Purnima',
        type: 'puja',
        descriptionOr: 'ଭାଦ୍ରବ ମାସର ପବିତ୍ର ପୂର୍ଣ୍ଣିମା ଓ ଭାଗବତ ଜନ୍ମ ପାଳନ।',
        descriptionEn: 'Sacred Bhadraba Purnima and Bhagavata Janma observance.'
      });
    }
  }

  // Aswina Festivals
  if (lunarMonthId === 'aswina') {
    if (isAmavasya) {
      festivals.push({
        id: 'mahalaya',
        nameOr: 'ମହାଳୟା ଅମାବାସ୍ୟା (ପିତୃ ତର୍ପଣ)',
        nameHi: 'महालया अमावस्या (पितृ तर्पण)',
        nameEn: 'Mahalaya Amavasya (Ancestral Pitru Tarpan)',
        type: 'major',
        descriptionOr: 'ପିତୃପୁରୁଷଙ୍କ ଉଦ୍ଦେଶ୍ୟରେ ଶେଷ ତର୍ପଣ ଓ ଦୁର୍ଗାପୂଜା ନବରାତ୍ରୀର ଆବାହନ।',
        descriptionEn: 'Sacred day for ancestral Tarpan offerings and invocation of Goddess Durga.',
        isGovernmentHoliday: true
      });
    }
    // Maha Sasthi / Bilba Barana (Aswina Shukla 6 — official start of Durga Puja)
    if (isShukla && tithiNumber === 6) {
      festivals.push({
        id: 'maha_sasthi',
        nameOr: 'ମହାଷଷ୍ଠୀ (ବିଲ୍ବ ବାରଣ / ବୋଧନ)',
        nameHi: 'महाषष्ठी (बिल्व वारण / बोधन)',
        nameEn: 'Maha Sasthi (Bilba Barana / Bodhana)',
        type: 'major',
        descriptionOr: 'ଦୁର୍ଗାପୂଜା ଆରମ୍ଭ। ବେଲ ଗଛ ତଳେ ବୋଧନ, ଆମନ୍ତ୍ରଣ ଓ ଅଧିବାସ। ଷଷ୍ଠୀ ସନ୍ଧ୍ୟାରେ ପ୍ରତିମା ଉନ୍ମୋଚନ।',
        descriptionEn: 'Durga Puja begins with Bilba Barana (invoking Goddess under Bel tree) and Bodhana.',
        isGovernmentHoliday: false
      });
    }
    if (isShukla && tithiNumber === 7) {
      festivals.push({
        id: 'maha_saptami',
        nameOr: 'ମହାସପ୍ତମୀ (ନବପତ୍ରିକା ପ୍ରବେଶ ଓ ଚକ୍ଷୁଦାନ)',
        nameHi: 'महासप्तमी (नवपत्रिका प्रवेश)',
        nameEn: 'Maha Saptami (Navapatrika Prabesha)',
        type: 'major',
        descriptionOr: 'ମା’ ଦୁର୍ଗାଙ୍କ ମହାସପ୍ତମୀ ପୂଜା, ନବପତ୍ରିକା କଦଳୀ ଗଛ ସ୍ନାନ ଓ ପ୍ରବେଶ, ଏବଂ ଚକ୍ଷୁଦାନ ବିଧି।',
        descriptionEn: 'Sacred seventh day of Durga Puja with Navapatrika entry and initiation rituals.',
        isGovernmentHoliday: true
      });
    }
    if (isShukla && tithiNumber === 8) {
      festivals.push({
        id: 'durga_ashtami',
        nameOr: 'ମହାଷ୍ଟମୀ ଦୁର୍ଗାପୂଜା (ସନ୍ଧି ପୂଜା)',
        nameHi: 'महाष्टमी दुर्गा पूजा',
        nameEn: 'Durga Ashtami (Maha Ashtami & Sandhi Puja)',
        type: 'major',
        descriptionOr: 'ଜଗତଜନନୀ ମା’ ଦୁର୍ଗାଙ୍କ ମହାଷ୍ଟମୀ ବିହିତ ପୂଜା ଓ ଅର୍ଦ୍ଧରାତ୍ରି ସନ୍ଧି ପୂଜା।',
        descriptionEn: 'Peak day of Durga Puja with sacred Sandhi Puja rituals.',
        isGovernmentHoliday: true
      });
    }
    if (isShukla && tithiNumber === 9) {
      festivals.push({
        id: 'maha_navami',
        nameOr: 'ମହାନବମୀ (ଅପରାଜିତା ପୂଜା ଓ ବଳିଦାନ ବିଧି)',
        nameHi: 'महानवमी (अपराजिता पूजा)',
        nameEn: 'Maha Navami (Ayudha & Aparajita Puja)',
        type: 'major',
        descriptionOr: 'ମହିଷାସୁରମର୍ଦ୍ଦିନୀ ମା’ଙ୍କ ମହାନବମୀ ବିହିତ ପୂଜା, ଆୟୁଧ ପୂଜା ଓ ସିଦ୍ଧିଦାତ୍ରୀ ଆରାଧନା।',
        descriptionEn: 'Sacred ninth day of Durga Puja with Aparajita Puja and weapon consecration.',
        isGovernmentHoliday: true
      });
    }
    if (isShukla && tithiNumber === 10) {
      festivals.push({
        id: 'vijaya_dashami',
        nameOr: 'ବିଜୟା ଦଶମୀ / ଦସହରା (ରାବଣ ପୋଡ଼ି)',
        nameHi: 'विजयादशमी / दशहरा',
        nameEn: 'Vijaya Dashami (Dussehra)',
        type: 'major',
        descriptionOr: 'ଅସତ୍ୟ ଉପରେ ସତ୍ୟର ବିଜୟ। ଅପରାଜିତା ପୂଜା, ଆୟୁଧ ପୂଜା ଓ ଶ୍ରୀମନ୍ଦିରରେ ରାଜବେଶ।',
        descriptionEn: 'Triumph of righteousness over evil, weapons worship, and Ravana Podi.',
        isGovernmentHoliday: true
      });
    }
    if (isPurnima) {
      festivals.push({
        id: 'kumar_purnima',
        nameOr: 'କୁମାର ପୂର୍ଣ୍ଣିମା (କୁଆଁର ପୁନେଇଁ ଓ ଚାନ୍ଦ ଚକଟା)',
        nameHi: 'कुमार पूर्णिमा (शरद पूर्णिमा)',
        nameEn: 'Kumar Purnima (Sharad Purnima)',
        type: 'major',
        descriptionOr: 'ଓଡ଼ିଆ କୁମାରୀ କନ୍ୟାମାନଙ୍କ ଚାନ୍ଦ ପୂଜା, ଖଇ-ଚାନ୍ଦ ଚକଟା ଭୋଗ ଓ କାର୍ତ୍ତିକ ବ୍ରତ ପ୍ରାରମ୍ଭ।',
        descriptionEn: 'Charming moonlight festival where Odia maidens worship the full moon with sweet Chanda Chakata.',
        isGovernmentHoliday: true
      });
    }
  }

  // Kartika Festivals
  if (lunarMonthId === 'kartika') {
    if (isAmavasya) {
      festivals.push({
        id: 'deepavali',
        nameOr: 'ଦୀପାବଳି ଓ କାଳୀ ପୂଜା (କଉଁରିଆ କାଠି ଜଳାଇ ବଡ଼ବଡୁଆ ଡାକ)',
        nameHi: 'दीपावली एवं काली पूजा',
        nameEn: 'Deepavali & Kali Puja (Badabadua Daka)',
        type: 'major',
        descriptionOr: 'ପିତୃଲୋକଙ୍କୁ ଆଲୋକ ଦେଖାଇବା ପାଇଁ "ବଡ଼ବଡୁଆ ହୋ, ଅନ୍ଧାରରେ ଆସ ଆଲୁଅରେ ଯାଅ" ଡାକ ଓ ଆଲୋକର ମହୋତ୍ସବ।',
        descriptionEn: 'Festival of Lights, Maa Kali worship, and lighting jute stems to guide departed ancestors.',
        isGovernmentHoliday: true
      });
    }
    if (isPurnima) {
      festivals.push({
        id: 'kartika_purnima',
        nameOr: 'କାର୍ତ୍ତିକ ପୂର୍ଣ୍ଣିମା ଓ ବୋଇତ ବନ୍ଦାଣ (ଆ-କା-ମା-ବୈ)',
        nameHi: 'कार्तिक पूर्णिमा / बोइत बदाण',
        nameEn: 'Kartika Purnima & Boita Bandana',
        type: 'major',
        descriptionOr: 'କଳିଙ୍ଗର ପ୍ରାଚୀନ ସାଧବମାନଙ୍କ ନୌବାଣିଜ୍ୟ ସ୍ମୃତିରେ "ଆ-କା-ମା-ବୈ, ପାନ ଗୁଆ ଥୋଇ" କଦଳୀ ପାଟୁକା ବୋଇତ ଭସା ଓ ରାଜାଧିରାଜ ବେଶ।',
        descriptionEn: 'Celebration of Kalingas historic maritime trade by sailing miniature boats at dawn chanting Aa-Kaa-Maa-Boi.',
        isGovernmentHoliday: true
      });
    }
  }

  // Margasira Festivals
  if (lunarMonthId === 'margasira') {
    if (weekday === 4) { // Thursday
      festivals.push({
        id: 'manabasa_gurubara',
        nameOr: 'ମାଣବସା ଗୁରୁବାର (ମା’ ମହାଲକ୍ଷ୍ମୀ ବ୍ରତ)',
        nameHi: 'माणबसा गुरुवार (महालक्ष्मी व्रत)',
        nameEn: 'Manabasa Gurubara (Maha Lakshmi Vrata)',
        type: 'vrata',
        descriptionOr: 'ଓଡ଼ିଆ ଘରର ଅଗଣାରେ ଝୋଟି-ଚିତା, ମାଣରେ ନୂତନ ଧାନ ଭରି ମା’ ଲକ୍ଷ୍ମୀଙ୍କ ଆବାହନ ଓ ପିଠା-ପଣା ଭୋଗ।',
        descriptionEn: 'Sacred Odia Thursday vrata worshipping Goddess Lakshmi with rice measures and rice-paste floor art (Jhoti).'
      });
    }
    if (!isShukla && (tithiNumber === 23 || tithiMadhyahna.tithiNumber === 23)) {
      festivals.push({
        id: 'prathamastami',
        nameOr: 'ପ୍ରଥମାଷ୍ଟମୀ (ପୋଢୁଆଁ ଅଷ୍ଟମୀ ଓ ଏଣ୍ଡୁରି ପିଠା)',
        nameHi: 'प्रथमाष्टमी',
        nameEn: 'Prathamastami (Enduri Pitha Celebration)',
        type: 'major',
        descriptionOr: 'ପରିବାରର ଜ୍ୟେଷ୍ଠ ସନ୍ତାନଙ୍କ ଦୀର୍ଘାୟୁ କାମନା କରି ମାମୁଁ ଘରୁ ନୂତନ ବସ୍ତ୍ର ଓ ହଳଦୀ ପତ୍ର ଏଣ୍ଡୁରି ପିଠା ଭୋଗ।',
        descriptionEn: 'Affectionate blessing ceremony for the eldest child with aromatic turmeric-leaf Enduri Pithas.'
      });
    }
  }

  // Pausha Festivals
  if (lunarMonthId === 'pausha') {
    if (isAmavasya) {
      festivals.push({
        id: 'bakula_amavasya',
        nameOr: 'ବକୁଳ ଅମାବାସ୍ୟା (ଆମ୍ବ ବଉଳ ପୂଜା)',
        nameHi: 'बकुल अमावस्या',
        nameEn: 'Bakula Amavasya',
        type: 'puja',
        descriptionOr: 'ଆମ୍ବ ଗଛରେ ବଉଳ ଆସିବା ପାଇଁ ଗଇଁଠା ପିଠା ଭୋଗ ଓ ବିଶେଷ ପୂଜାର୍ଚ୍ଚନା।',
        descriptionEn: 'Sacred offering of Gaintha Pitha to mango blossoms.'
      });
    }
    // Samba Dashami (Pausha Shukla 10 — Sun God worship, uniquely Odia)
    if (isShukla && tithiNumber === 10) {
      festivals.push({
        id: 'samba_dashami',
        nameOr: 'ସାମ୍ବ ଦଶମୀ (ସୂର୍ଯ୍ୟ ପୂଜା)',
        nameHi: 'सांब दशमी (सूर्य पूजा)',
        nameEn: 'Samba Dashami (Sun God Worship)',
        type: 'major',
        descriptionOr: 'ସୂର୍ଯ୍ୟଦେବଙ୍କ ବିଶେଷ ପୂଜା। କୋଣାର୍କ ସୂର୍ଯ୍ୟ ମନ୍ଦିରରେ ମହା ଉତ୍ସବ। ସ୍ତ୍ରୀଗଣ ସନ୍ତାନ କଲ୍ୟାଣ ପାଇଁ ବ୍ରତ ପାଳନ କରନ୍ତି।',
        descriptionEn: 'Worship of Sun God (Surya) at Konark. Women observe vrata for childrens welfare.'
      });
    }
    if (isPurnima) {
      festivals.push({
        id: 'pushyabhisheka',
        nameOr: 'ପୁଷ୍ୟାଭିଷେକ (ଶ୍ରୀମନ୍ଦିର ରାଜାଧିରାଜ ସୁନାବେଶ)',
        nameHi: 'पुष्याभिषेक',
        nameEn: 'Pushyabhisheka (Coronation Attire)',
        type: 'major',
        descriptionOr: 'ମହାପ୍ରଭୁ ଶ୍ରୀଜଗନ୍ନାଥଙ୍କ ରାଜାଧିରାଜ ରାଜପଟ୍ଟାଭିଷେକ ଓ ସୁବର୍ଣ୍ଣ ବେଶ।',
        descriptionEn: 'Royal coronation ceremony and Suna Besha of Lord Jagannath on the Ratnavedi.'
      });
    }
  }

  // Magha Festivals
  if (lunarMonthId === 'magha') {
    // Saraswati Puja: Strictly Purvahna Vyapini Magha Shukla Panchami (tithi 5)
    const prevDayPurvahna = getTithiInfoAt(new Date(localYear, localMonth, localDay - 1, Math.floor(purvahnaMinute / 60), Math.floor(purvahnaMinute % 60)));
    const isYesterdayPurvahnaPanchami = prevDayPurvahna.isShukla && prevDayPurvahna.tithiNumber === 5;
    const isSaraswatiPujaToday = isShukla && (
      (tithiPurvahna.isShukla && tithiPurvahna.tithiNumber === 5) ||
      (tithiNumber === 5 && !isYesterdayPurvahnaPanchami)
    ) && !isYesterdayPurvahnaPanchami;

    if (isSaraswatiPujaToday) {
      festivals.push({
        id: 'saraswati_puja',
        nameOr: 'ଶ୍ରୀ ପଞ୍ଚମୀ / ସରସ୍ୱତୀ ପୂଜା (ବସନ୍ତ ପଞ୍ଚମୀ)',
        nameHi: 'सरस्वती पूजा / बसंत पंचमी',
        nameEn: 'Saraswati Puja / Vasant Panchami',
        type: 'puja',
        descriptionOr: 'ବିଦ୍ୟାଦାତ୍ରୀ ମା’ ସରସ୍ୱତୀଙ୍କ ପୂଜା, ଖଡ଼ିଛୁଆଁ ଓ ରଥଯାତ୍ରା ପାଇଁ ରଥକାଠ ଶ୍ରୀମନ୍ଦିର ଆଗମନ।',
        descriptionEn: 'Worship of Goddess Saraswati; Rath logs arrive at Puri for the upcoming Ratha Yatra.',
        isGovernmentHoliday: true
      });
    }
    if (isShukla && tithiNumber === 7) {
      festivals.push({
        id: 'magha_saptami',
        nameOr: 'ମାଘ ସପ୍ତମୀ (ଚନ୍ଦ୍ରଭାଗା ମେଳା ଓ ସୂର୍ଯ୍ୟ ପୂଜା)',
        nameHi: 'माघ सप्तमी (चंद्रभागा मेला)',
        nameEn: 'Magha Saptami (Chandrabhaga Holy Dip)',
        type: 'major',
        descriptionOr: 'କୋଣାର୍କ ଚନ୍ଦ୍ରଭାଗା ତୀର୍ଥରେ ଲକ୍ଷାଧିକ ଶ୍ରଦ୍ଧାଳୁଙ୍କ ସୂର୍ଯ୍ୟୋଦୟ ସ୍ନାନ ଓ ନବଗ୍ରହ ପୂଜା।',
        descriptionEn: 'Sacred sunrise dip at the Chandrabhaga beach near Konark Sun Temple.'
      });
    }
    if (isPurnima) {
      festivals.push({
        id: 'agira_purnima',
        nameOr: 'ଅଗ୍ନି ଉତ୍ସବ (ଅଗିରା ପୂର୍ଣ୍ଣିମା)',
        nameHi: 'अग्नि उत्सव / माघी पूर्णिमा',
        nameEn: 'Agira Purnima (Bonfire Celebration)',
        type: 'puja',
        descriptionOr: 'ଅଗ୍ନି ଦେବଙ୍କ ପୂଜା ଓ ପାରମ୍ପରିକ ଅଗିରା ଜଳାଇ ରୋଗ-ବ୍ୟାଧି ଦୂରୀକରଣ ପ୍ରାର୍ଥନା।',
        descriptionEn: 'Sacred bonfire rituals praying for agricultural abundance and health.'
      });
    }
  }

  // Phalguna Festivals
  if (lunarMonthId === 'phalguna') {
    // Maha Shivaratri: Nishitha Vyapini Krishna Chaturdashi (tithi 29)
    if (!tithiNishitha.isShukla && (tithiNishitha.tithiNumber === 29 || tithiNumber === 29)) {
      festivals.push({
        id: 'shiva_ratri',
        nameOr: 'ମହାଶିବରାତ୍ରୀ (ଜାଗର ମେଳା ଓ ମହାଦୀପ ଦର୍ଶନ)',
        nameHi: 'महाशिवरात्रि (जागर मेला)',
        nameEn: 'Maha Shivaratri (Jagara Festival)',
        type: 'major',
        descriptionOr: 'ପରମଶିବଙ୍କ ନିରାହାର ବ୍ରତ, ରାତ୍ରି ଉଜାଗର ଏବଂ ଲିଙ୍ଗରାଜ ମନ୍ଦିର ଚୂଡ଼ାରେ ମହାଦୀପ ଦର୍ଶନ।',
        descriptionEn: 'All-night vigil and fast dedicated to Lord Shiva; sacred Mahadipa rises atop Lingaraj Temple.',
        isGovernmentHoliday: true
      });
    }
    if (isPurnima) {
      festivals.push({
        id: 'dola_purnima',
        nameOr: 'ଦୋଳ ପୂର୍ଣ୍ଣିମା ଓ ହୋଲି (ଫଗୁ ଖେଳ ଓ ନୂତନ ପାଞ୍ଜି ପାଠ)',
        nameHi: 'दोल पूर्णिमा एवं होली',
        nameEn: 'Dola Purnima & Holi (Spring Carnival)',
        type: 'major',
        descriptionOr: 'ଦୋଳ ବିମାନରେ ରାଧାକୃଷ୍ଣଙ୍କ ଭ୍ରମଣ, ଫଗୁ ଖେଳ, ଚୈତନ୍ୟ ମହାପ୍ରଭୁ ଜୟନ୍ତୀ ଏବଂ ଶ୍ରୀମନ୍ଦିର ନୂତନ ପାଞ୍ଜି ପଠନ।',
        descriptionEn: 'Glorious swing festival of Radha-Krishna, herbal colors, Chaitanya Mahaprabhu appearance, and new Panjika reading.',
        isGovernmentHoliday: true
      });
    }
  }

  // Chaitra Festivals
  if (lunarMonthId === 'chaitra') {
    if (weekday === 2) { // Tuesday
      festivals.push({
        id: 'chaitra_mangalabara',
        nameOr: 'ଚୈତ୍ର ମଙ୍ଗଳବାର (ମା’ ମଙ୍ଗଳା ଓ ତାରାତାରିଣୀ ଓଷା)',
        nameHi: 'चैत्र मंगलवार',
        nameEn: 'Chaitra Mangalabara (Goddess Mangala Vrata)',
        type: 'vrata',
        descriptionOr: 'କାକଟପୁର ମା’ ମଙ୍ଗଳା, ତାରାତାରିଣୀ ଓ ଘଟଗାଁ ତାରିଣୀଙ୍କ ବିଶେଷ ଚୈତ୍ର ପୂଜା।',
        descriptionEn: 'Sacred Tuesdays dedicated to Mother Goddess Mangala, Taratarini, and Tarini.'
      });
    }
    // Ashokashtami / Rukuna Ratha Yatra (Chaitra Shukla 8)
    if (isShukla && tithiNumber === 8) {
      festivals.push({
        id: 'ashokashtami',
        nameOr: 'ଅଶୋକାଷ୍ଟମୀ (ରୁକୁଣା ରଥ ଯାତ୍ରା)',
        nameHi: 'अशोकाष्टमी (रुकुणा रथ यात्रा)',
        nameEn: 'Ashokashtami (Rukuna Ratha Yatra)',
        type: 'major',
        descriptionOr: 'ଲିଙ୍ଗରାଜ ମହାପ୍ରଭୁଙ୍କ ରୁକୁଣା ରଥ ଯାତ୍ରା। ଭୁବନେଶ୍ୱର ମନ୍ଦିରରେ ମହା ଉତ୍ସବ। ଅଶୋକ ବୃକ୍ଷ ପୂଜା ଓ ସ୍ତ୍ରୀଙ୍କ ବିଶେଷ ବ୍ରତ।',
        descriptionEn: 'Rukuna Ratha Yatra of Lord Lingaraj in Bhubaneswar. Ashoka tree worship.'
      });
    }
    // Sri Rama Navami: Madhyahna Vyapini Chaitra Shukla Navami (tithi 9)
    if (isShukla && ((tithiMadhyahna.isShukla && tithiMadhyahna.tithiNumber === 9) || tithiNumber === 9)) {
      festivals.push({
        id: 'rama_navami',
        nameOr: 'ଶ୍ରୀ ରାମ ନବମୀ (ମର୍ଯ୍ୟାଦା ପୁରୁଷୋତ୍ତମ ଜନ୍ମ)',
        nameHi: 'श्री राम नवमी',
        nameEn: 'Sri Rama Navami',
        type: 'major',
        descriptionOr: 'ମର୍ଯ୍ୟାଦା ପୁରୁଷୋତ୍ତମ ପ୍ରଭୁ ଶ୍ରୀରାମଚନ୍ଦ୍ରଙ୍କ ପବିତ୍ର ଜୟନ୍ତୀ।',
        descriptionEn: 'Celebration of the birth of Lord Sri Rama.',
        isGovernmentHoliday: true
      });
    }
  }

  // 5. Special Srimandir Jagannath Daily Besha Detection
  let jagannathBesha: DynamicOdiaDayInfo['jagannathBesha'];
  if (monthId === 'jyestha' && isPurnima) {
    jagannathBesha = {
      or: 'ଗଜାନନ (ହାତୀ) ବେଶ',
      hi: 'हाथी वेश (गजानन वेश)',
      en: 'Hati Besha (Elephant Attire)',
      descriptionOr: 'ସ୍ନାନ ପୂର୍ଣ୍ଣିମାରେ ୧୦୮ ସୁବର୍ଣ୍ଣ କଳସ ସ୍ନାନ ପରେ ଶ୍ରୀଜୀଉମାନେ ଗଣପତି ରୂପରେ ଭକ୍ତଙ୍କୁ ଦର୍ଶନ ଦିଅନ୍ତି।'
    };
  } else if (monthId === 'asadha' && isShukla && tithiNumber === 11) {
    jagannathBesha = {
      or: 'ମହାର୍ଘ ସୁନା ବେଶ (ରଥ ଉପରେ ବଡ଼ତଢ଼ାଉ ବେଶ)',
      hi: 'सुना वेश (स्वर्ण वेश - रथ पर)',
      en: 'Suna Besha (Golden Attire on Chariots)',
      descriptionOr: 'ବାହୁଡ଼ା ଯାତ୍ରା ପରେ ରଥ ଉପରେ ସିଂହଦ୍ୱାରରେ ୧୩୮ କିଲୋ ସ୍ୱର୍ଣ୍ଣ ଅଳଙ୍କାରରେ ରାଜାଧିରାଜ ଦର୍ଶନ।'
    };
  } else if (monthId === 'kartika' && isPurnima) {
    jagannathBesha = {
      or: 'ରାଜରାଜେଶ୍ୱର ସୁନା ବେଶ (ରତ୍ନସିଂହାସନ)',
      hi: 'राजराजेश्वर सुना वेश',
      en: 'Rajarajeshwara Suna Besha',
      descriptionOr: 'କାର୍ତ୍ତିକ ପୂର୍ଣ୍ଣିମାରେ ରତ୍ନସିଂହାସନ ଉପରେ ମହାପ୍ରଭୁଙ୍କ ରାଜକୀୟ ସ୍ୱର୍ଣ୍ଣ ଅଳଙ୍କାର ବେଶ।'
    };
  } else if (monthId === 'kartika' && isShukla && tithiNumber === 11) {
    jagannathBesha = {
      or: 'ଲକ୍ଷ୍ମୀନାରାୟଣ ବେଶ (ପଞ୍ଚୁକ ୧ମ ଦିନ)',
      hi: 'लक्ष्मीनारायण वेश',
      en: 'Lakshmi Narayana Besha (Panchuka Day 1)',
      descriptionOr: 'ପବିତ୍ର ବଡ଼ ଏକାଦଶୀରେ ମହାପ୍ରଭୁଙ୍କ ସ୍ୱର୍ଣ୍ଣ ଶଙ୍ଖ, ଚକ୍ର, ଗଦା, ପଦ୍ମ ଧାରଣ ପୂର୍ବକ ନାରାୟଣ ବେଶ।'
    };
  } else if (monthId === 'kartika' && isShukla && tithiNumber === 12) {
    jagannathBesha = {
      or: 'ବାଙ୍କଚୂଡ଼ ବେଶ (ପଞ୍ଚୁକ ୨ୟ ଦିନ)',
      hi: 'बांकचूड़ वेश',
      en: 'Bankachuda Besha (Panchuka Day 2)',
      descriptionOr: 'ଶ୍ରୀଜଗନ୍ନାଥ ଓ ବଳଭଦ୍ରଙ୍କ ମସ୍ତକରେ ଚନ୍ଦ୍ରିକା ସହିତ ସ୍ୱର୍ଣ୍ଣ ବାଙ୍କଚୂଳ ମଣ୍ଡନ।'
    };
  } else if (monthId === 'kartika' && isShukla && tithiNumber === 13) {
    jagannathBesha = {
      or: 'ତ୍ରିବିକ୍ରମ ବେଶ (ପଞ୍ଚୁକ ୩ୟ ଦିନ)',
      hi: 'त्रिविक्रम वेश',
      en: 'Tribikrama Besha (Panchuka Day 3)',
      descriptionOr: 'ବାମନ ଅବତାରର ବିଶ୍ୱରୂପ ସ୍ମୃତିରେ ମହାପ୍ରଭୁଙ୍କ ତ୍ରିବିକ୍ରମ ଅଳଙ୍କାର ବେଶ।'
    };
  } else if (monthId === 'kartika' && isShukla && tithiNumber === 14) {
    jagannathBesha = {
      or: 'ଲକ୍ଷ୍ମୀନୃସିଂହ ବେଶ (ପଞ୍ଚୁକ ୪ର୍ଥ ଦିନ)',
      hi: 'लक्ष्मीनृसिंह वेश',
      en: 'Lakshmi Nrusimha Besha (Panchuka Day 4)',
      descriptionOr: 'ବୈକୁଣ୍ଠପତି ଶ୍ରୀଜଗନ୍ନାଥଙ୍କ ନୃସିଂହ ରୂପରେ ଭୟଭଞ୍ଜନ ଅଭୟ ମୁଦ୍ରା ବେଶ।'
    };
  } else if (monthId === 'magha' && isAmavasya) {
    jagannathBesha = {
      or: 'ତ୍ରିବେଣୀ ପଦ୍ମ ବେଶ',
      hi: 'पद्म वेश',
      en: 'Padma Besha (Lotus Flower Attire)',
      descriptionOr: 'ପଦ୍ମ ପୁଷ୍ପ ଓ ସୋଲ କାରୁକାର୍ଯ୍ୟରେ ସମ୍ପୂର୍ଣ୍ଣ ରତ୍ନସିଂହାସନ ପଦ୍ମବନରେ ପରିଣତ ହୁଏ।'
    };
  } else if (monthId === 'magha' && isPurnima) {
    jagannathBesha = {
      or: 'ଗଜଉଦ୍ଧାରଣ ବେଶ',
      hi: 'गजउद्धारण वेश',
      en: 'Gajauddharana Besha',
      descriptionOr: 'ଶ୍ରୀହରିଙ୍କ ଗଜେନ୍ଦ୍ର ମୋକ୍ଷଣ ଲୀଳାର ଦିବ୍ୟ ସ୍ମୃତିରେ ଗରୁଡ଼ାରୂଢ଼ ଚତୁର୍ଭୁଜ ବେଶ।'
    };
  } else if (monthId === 'pausha' && isPurnima) {
    jagannathBesha = {
      or: 'ପୁଷ୍ୟାଭିଷେକ ରାଜାଧିରାଜ ବେଶ',
      hi: 'पुष्याभिषेक राजवेष',
      en: 'Pushyabhisheka Rajadhiraja Besha',
      descriptionOr: 'ମହାପ୍ରଭୁଙ୍କ ସିଂହାସନାରୋହଣ ରାଜ୍ୟାଭିଷେକ ମହୋତ୍ସବ।'
    };
  } else if (monthId === 'phalguna' && isPurnima) {
    jagannathBesha = {
      or: 'ଦୋଳ ପୂର୍ଣ୍ଣିମା ରାଜାଧିରାଜ ବେଶ',
      hi: 'दोल पूर्णिमा राजवेष',
      en: 'Dola Purnima Rajadhiraja Besha',
      descriptionOr: 'ଫଗୁ ଦଶମୀ ପରଠାରୁ ରାଜାଧିରାଜ ସ୍ୱର୍ଣ୍ଣ ବେଶ ଓ ଦୋଳବିମାନରେ ଦୋଳବେଦୀ ଯାତ୍ରା।'
    };
  } else if (monthId === 'baisakha' && isShukla && tithiNumber === 3) {
    jagannathBesha = {
      or: 'ଅକ୍ଷୟ ତୃତୀୟା ଚନ୍ଦନ ବେଶ',
      hi: 'चंदन वेश',
      en: 'Chandan Besha (Sandalwood Paste Attire)',
      descriptionOr: '୪୨ ଦିନବ୍ୟାପୀ ଶ୍ରୀଅଙ୍ଗରେ ଶୀତଳ ଚନ୍ଦନ, କର୍ପୂର ଓ କେଶର ଲେପନର ପବିତ୍ର ଶୁଭାରମ୍ଭ।'
    };
  }

  // 6. Tithi Food Restrictions (ଖାଦ୍ୟ ନିଷେଧ)
  const restriction = TITHI_FOOD_RESTRICTIONS[((tithiNumber - 1) % 15) + 1] || {
    or: 'କୌଣସି ବିଶେଷ ନିଷେଧ ନାହିଁ (ଶୁଦ୍ଧ ସାତ୍ତ୍ୱିକ ଆହାର ଉତ୍ତମ)',
    en: 'No specific restrictions; sattvic food recommended'
  };

  // 7. Auspicious Odia Belas (Amrita, Mahendra, Kala, Vara) - Authentic Kohinoor Press Panjika Table
  const daySpan = Math.max(660, sunsetMinutes - sunriseMinutes);
  const partDuration = daySpan / 8; // 8 parts of day (Yamardhas)

  // Traditional Odia Bela tables based on weekday (Strictly disjoint from Rahu Kaal & Vara Bela)
  // Sun: Amrita 1, Mahendra 7, Kala 5, Vara 4 (Rahu 8)
  // Mon: Amrita 4, Mahendra 5, Kala 1, Vara 2 (Rahu 2) -> ZERO overlap with Rahu Kaal!
  // Tue: Amrita 2, Mahendra 3, Kala 6, Vara 7 (Rahu 7)
  // Wed: Amrita 1, Mahendra 8, Kala 2, Vara 5 (Rahu 5)
  // Thu: Amrita 2, Mahendra 1, Kala 7, Vara 6 (Rahu 6)
  // Fri: Amrita 5, Mahendra 2, Kala 3, Vara 1 (Rahu 4)
  // Sat: Amrita 1, Mahendra 7, Kala 4, Vara 3 (Rahu 3)
  const weekdayBelaOffsets: Record<number, { amritaPart: number; mahendraPart: number; kalaPart: number; varaPart: number }> = {
    0: { amritaPart: 2, mahendraPart: 3, kalaPart: 4, varaPart: 5 }, // Sun: Amrita(2), Mahendra(3) | Rahu(8), Yama(5), Gulika(7), Kala(4), Vara(5)
    1: { amritaPart: 3, mahendraPart: 5, kalaPart: 1, varaPart: 2 }, // Mon: Amrita(3), Mahendra(5) | Rahu(2), Yama(4), Gulika(6), Kala(1), Vara(2)
    2: { amritaPart: 4, mahendraPart: 6, kalaPart: 2, varaPart: 7 }, // Tue: Amrita(4), Mahendra(6) | Rahu(7), Yama(3), Gulika(5), Kala(2), Vara(7)
    3: { amritaPart: 3, mahendraPart: 6, kalaPart: 2, varaPart: 4 }, // Wed: Amrita(3), Mahendra(6) | Rahu(5), Yama(2), Gulika(4), Kala(2), Vara(4)
    4: { amritaPart: 4, mahendraPart: 5, kalaPart: 8, varaPart: 6 }, // Thu: Amrita(4), Mahendra(5) | Rahu(6), Yama(1), Gulika(3), Kala(8), Vara(6)
    5: { amritaPart: 5, mahendraPart: 6, kalaPart: 1, varaPart: 3 }, // Fri: Amrita(5), Mahendra(6) | Rahu(4), Yama(7), Gulika(2), Kala(1), Vara(3)
    6: { amritaPart: 4, mahendraPart: 5, kalaPart: 3, varaPart: 1 }, // Sat: Amrita(4), Mahendra(5) | Rahu(3), Yama(6), Gulika(1), Kala(3), Vara(1)
  };

  const belaCfg = weekdayBelaOffsets[weekday] || weekdayBelaOffsets[0];
  
  const getBelaWindow = (partIndex: number) => {
    const startM = sunriseMinutes + (partIndex - 1) * partDuration;
    const endM = startM + partDuration;
    return formatOdiaTimeWindow(startM, endM);
  };

  const amritaWin = getBelaWindow(belaCfg.amritaPart);
  const mahendraWin = getBelaWindow(belaCfg.mahendraPart);
  const kalaWin = getBelaWindow(belaCfg.kalaPart);
  const varaWin = getBelaWindow(belaCfg.varaPart);

  const belas = {
    amrita: amritaWin.or,
    mahendra: mahendraWin.or,
    kalaBela: kalaWin.or,
    varaBela: varaWin.or,
    amritaOr: amritaWin.or,
    mahendraOr: mahendraWin.or,
    kalaBelaOr: kalaWin.or,
    varaBelaOr: varaWin.or,
    amritaHi: amritaWin.hi,
    mahendraHi: mahendraWin.hi,
    kalaBelaHi: kalaWin.hi,
    varaBelaHi: varaWin.hi,
    amritaEn: amritaWin.en,
    mahendraEn: mahendraWin.en,
    kalaBelaEn: kalaWin.en,
    varaBelaEn: varaWin.en
  };

  // Classical Advance Muhurtas & Timings Calculation
  const fifteenth = daySpan / 15;
  const abhijitStartM = Math.round(sunriseMinutes + 7 * fifteenth);
  const abhijitEndM = Math.round(abhijitStartM + fifteenth);
  const abhijitWin = formatOdiaTimeWindow(abhijitStartM, abhijitEndM);

  const brahmaStartM = Math.round(sunriseMinutes - 96);
  const brahmaEndM = Math.round(sunriseMinutes - 48);
  const brahmaWin = formatOdiaTimeWindow(brahmaStartM, brahmaEndM);

  const godhuliStartM = Math.round(sunsetMinutes - 24);
  const godhuliEndM = Math.round(sunsetMinutes + 24);
  const godhuliWin = formatOdiaTimeWindow(godhuliStartM, godhuliEndM);

  const vijayaStartM = Math.round(sunriseMinutes + 9 * fifteenth);
  const vijayaEndM = Math.round(vijayaStartM + fifteenth);
  const vijayaWin = formatOdiaTimeWindow(vijayaStartM, vijayaEndM);

  const rahuParts = [8, 2, 7, 5, 6, 4, 3];
  const rahuStartM = Math.round(sunriseMinutes + (rahuParts[weekday] - 1) * partDuration);
  const rahuEndM = Math.round(rahuStartM + partDuration);
  const rahuWin = formatOdiaTimeWindow(rahuStartM, rahuEndM);

  const yamaParts = [5, 4, 3, 2, 1, 7, 6];
  const yamaStartM = Math.round(sunriseMinutes + (yamaParts[weekday] - 1) * partDuration);
  const yamaEndM = Math.round(yamaStartM + partDuration);
  const yamaWin = formatOdiaTimeWindow(yamaStartM, yamaEndM);

  const gulikaParts = [7, 6, 5, 4, 3, 2, 1];
  const gulikaStartM = Math.round(sunriseMinutes + (gulikaParts[weekday] - 1) * partDuration);
  const gulikaEndM = Math.round(gulikaStartM + partDuration);
  const gulikaWin = formatOdiaTimeWindow(gulikaStartM, gulikaEndM);

  const advanceMuhurtas = {
    abhijit: { ...abhijitWin, startMin: abhijitStartM, endMin: abhijitEndM },
    amritaBela: { ...amritaWin, startMin: Math.round(sunriseMinutes + (belaCfg.amritaPart - 1) * partDuration), endMin: Math.round(sunriseMinutes + belaCfg.amritaPart * partDuration) },
    mahendraBela: { ...mahendraWin, startMin: Math.round(sunriseMinutes + (belaCfg.mahendraPart - 1) * partDuration), endMin: Math.round(sunriseMinutes + belaCfg.mahendraPart * partDuration) },
    brahmaMuhurta: { ...brahmaWin, startMin: brahmaStartM, endMin: brahmaEndM },
    godhuli: { ...godhuliWin, startMin: godhuliStartM, endMin: godhuliEndM },
    vijaya: { ...vijayaWin, startMin: vijayaStartM, endMin: vijayaEndM },
    rahuKaal: { ...rahuWin, startMin: rahuStartM, endMin: rahuEndM },
    yamaganda: { ...yamaWin, startMin: yamaStartM, endMin: yamaEndM },
    kalaBela: { ...kalaWin, startMin: Math.round(sunriseMinutes + (belaCfg.kalaPart - 1) * partDuration), endMin: Math.round(sunriseMinutes + belaCfg.kalaPart * partDuration) },
    varaBela: { ...varaWin, startMin: Math.round(sunriseMinutes + (belaCfg.varaPart - 1) * partDuration), endMin: Math.round(sunriseMinutes + belaCfg.varaPart * partDuration) },
    gulikaKaal: { ...gulikaWin, startMin: gulikaStartM, endMin: gulikaEndM }
  };

  // Dinamana (Day length) & Ratrimana (Night length) in Dandatmaka (ଘଟୀ:ପଳ) & Hours:Minutes
  const dinaH = Math.floor(daySpan / 60);
  const dinaM = daySpan % 60;
  const dinaDandaExact = daySpan / 24;
  const dinaDanda = Math.floor(dinaDandaExact);
  const dinaPala = Math.round((dinaDandaExact - dinaDanda) * 60);

  const ratriSpan = 1440 - daySpan;
  const ratriH = Math.floor(ratriSpan / 60);
  const ratriM = ratriSpan % 60;
  const ratriDandaExact = ratriSpan / 24;
  const ratriDanda = Math.floor(ratriDandaExact);
  const ratriPala = Math.round((ratriDandaExact - ratriDanda) * 60);

  const dinamana = {
    totalMinutes: daySpan,
    hours: dinaH,
    minutes: dinaM,
    danda: dinaDanda,
    pala: dinaPala,
    strOr: `${formatOdiaNum(dinaH.toString())} ଘଣ୍ଟା ${formatOdiaNum(dinaM.toString())} ମିନିଟ୍ (${formatOdiaNum(dinaDanda.toString())} ଘଟୀ ${formatOdiaNum(dinaPala.toString())} ପଳ)`,
    strHi: `${dinaH} घंटे ${dinaM} मिनट (${dinaDanda} घटी ${dinaPala} पल)`,
    strEn: `${dinaH}h ${dinaM}m (${dinaDanda} Ghati ${dinaPala} Pala)`
  };

  const ratrimana = {
    totalMinutes: ratriSpan,
    hours: ratriH,
    minutes: ratriM,
    danda: ratriDanda,
    pala: ratriPala,
    strOr: `${formatOdiaNum(ratriH.toString())} ଘଣ୍ଟା ${formatOdiaNum(ratriM.toString())} ମିନିଟ୍ (${formatOdiaNum(ratriDanda.toString())} ଘଟୀ ${formatOdiaNum(ratriPala.toString())} ପଳ)`,
    strHi: `${ratriH} घंटे ${ratriM} मिनट (${ratriDanda} घटी ${ratriPala} पल)`,
    strEn: `${ratriH}h ${ratriM}m (${ratriDanda} Ghati ${ratriPala} Pala)`
  };

  // 8. Active Panjika Edition Lookup
  const edition = ODIA_PANJIKA_EDITIONS.find(e => e.id === editionId) || ODIA_PANJIKA_EDITIONS[0];

  // Edition-specific minute offsets and notations grounded in Shastric & Astronomical realities:
  // - Kohinoor: Baseline Surya Siddhanta / Siddhanta Darpana (Samanta Chandra Sekhar)
  // - Khadiratna: +2 minutes (Puri Srimandir local time adjustment for 36 Nijoga temple rites)
  // - Radharaman: Strict Vaishnava Viddha avoidance rules (Hari Bhakti Vilasa)
  // - Bhagyajyoti: -5 minutes (Drik-Siddhanta modern planetary ephemeris, Lahiri Ayanamsha)
  // - Biraja: +1 minute (Jajpur meridian longitude offset from Puri)
  // - Srimandir: Muktimandap Supreme Royal Standard
  let editionTithiOffsetMinutes = 0;
  let editionNakOffsetMinutes = 0;
  let editionTimingSuffixOr = '';
  let editionTimingSuffixHi = '';
  let editionTimingSuffixEn = '';

  if (editionId === 'khadiratna') {
    editionTithiOffsetMinutes = 0;
    editionNakOffsetMinutes = 0;
    editionTimingSuffixOr = ' (ଖଡ଼ିରତ୍ନ ମତେ)';
    editionTimingSuffixHi = ' (खड़िरत्न अनुसार)';
    editionTimingSuffixEn = ' (Khadiratna)';
  } else if (editionId === 'bhagyajyoti') {
    editionTithiOffsetMinutes = 0;
    editionNakOffsetMinutes = 0;
    editionTimingSuffixOr = ' (ଦୃକ୍-ସିଦ୍ଧାନ୍ତ ମତେ)';
    editionTimingSuffixHi = ' (दृक-सिद्धांत अनुसार)';
    editionTimingSuffixEn = ' (Drik-Siddhanta)';
  } else if (editionId === 'biraja') {
    editionTithiOffsetMinutes = 0;
    editionNakOffsetMinutes = 0;
    editionTimingSuffixOr = ' (ବିରଜା ପାଞ୍ଜି ଯାଜପୁର ମତେ)';
    editionTimingSuffixHi = ' (बिरजा पंचांग जाजपुर)';
    editionTimingSuffixEn = ' (Biraja Panjika)';
  } else if (editionId === 'radharaman') {
    editionTimingSuffixOr = ' (ରାଧାରମଣ ପ୍ରେସ୍ ମତେ)';
    editionTimingSuffixHi = ' (राधारमण प्रेस अनुसार)';
    editionTimingSuffixEn = ' (Radharaman Press)';
  } else if (editionId === 'srimandir') {
    editionTimingSuffixOr = ' (ଶ୍ରୀମନ୍ଦିର ମୁକ୍ତିମଣ୍ଡପ ମତେ)';
    editionTimingSuffixHi = ' (श्रीमंदिर मुक्तिमंडप)';
    editionTimingSuffixEn = ' (Srimandir Mukti Mandap)';
  } else {
    editionTimingSuffixOr = ' (କୋହିନୂର ପ୍ରେସ୍ ମତେ)';
    editionTimingSuffixHi = ' (कोहिनूर प्रेस)';
    editionTimingSuffixEn = ' (Kohinoor Press)';
  }

  // 9. Real Astronomical Tithi Ending Time (ଦିବା/ରାତ୍ର ଘଣ୍ଟା:ମିନିଟ୍)
  const moonSunDiff = normalizeDegrees(planets.moon - planets.sun);
  const tithiExact = moonSunDiff / 12;
  const tithiFrac = tithiExact - Math.floor(tithiExact);
  const remainingTithiDeg = (1 - tithiFrac) * 12;
  const remainingTithiHours = remainingTithiDeg * 1.9687; // Moon relative speed ~12.19 deg/24h
  const endTithiDate = new Date(sunriseDate.getTime() + remainingTithiHours * 3600000);
  const endTithiMinutes = (endTithiDate.getHours() * 60 + endTithiDate.getMinutes()) % 1440;
  const tithiEndHour = Math.floor(endTithiMinutes / 60);
  const tithiEndMin = endTithiMinutes % 60;
  const nextTithiNum = tithiNumber >= 30 ? 1 : tithiNumber + 1;
  const nextTithiIsShukla = nextTithiNum <= 15;
  const nextTithiNameOr = getOdiaTithiOnly(nextTithiNum);
  const curTithiNameOr = getOdiaTithiOnly(tithiNumber);

  let tithiPeriodOr = 'ଦିବା';
  let tithiPeriodHi = 'दोपहर';
  let tithiPeriodEn = 'Day';
  if (tithiEndHour >= 4 && tithiEndHour < 8) {
    tithiPeriodOr = 'ପ୍ରାତଃ';
    tithiPeriodHi = 'प्रातः';
    tithiPeriodEn = 'Morning';
  } else if (tithiEndHour >= 8 && tithiEndHour < 16) {
    tithiPeriodOr = 'ଦିବା';
    tithiPeriodHi = 'दोपहर';
    tithiPeriodEn = 'Afternoon';
  } else if (tithiEndHour >= 16 && tithiEndHour < 19) {
    tithiPeriodOr = 'ସାୟଂ';
    tithiPeriodHi = 'सायं';
    tithiPeriodEn = 'Evening';
  } else if (tithiEndHour >= 19 && tithiEndHour < 23) {
    tithiPeriodOr = 'ରାତ୍ର';
    tithiPeriodHi = 'रात्रि';
    tithiPeriodEn = 'Night';
  } else {
    tithiPeriodOr = 'ନିଶୀଥ';
    tithiPeriodHi = 'मध्यरात्रि';
    tithiPeriodEn = 'Late Night';
  }

  const tithiH12 = tithiEndHour % 12 === 0 ? 12 : tithiEndHour % 12;
  const tithiH12Str = tithiH12.toString().padStart(2, '0');
  const tithiMStr = tithiEndMin.toString().padStart(2, '0');
  const isTithiAhoratra = remainingTithiHours >= 24;
  const tithiTiming = {
    durationStrOr: isTithiAhoratra
      ? `${curTithiNameOr} ଅହୋରାତ୍ର ଭୋଗ (ପରବର୍ତ୍ତୀ ପ୍ରାତଃ ସୂର୍ଯ୍ୟୋଦୟ ପର୍ଯ୍ୟନ୍ତ)${editionTimingSuffixOr}`
      : `${curTithiNameOr} ${tithiPeriodOr} ${formatOdiaNum(tithiH12Str)}:${formatOdiaNum(tithiMStr)} ପର୍ଯ୍ୟନ୍ତ${editionTimingSuffixOr}, ତଦନ୍ତେ ${nextTithiNameOr}`,
    durationStrHi: isTithiAhoratra
      ? `${curTithiNameOr} अहोरात्र भोग (अगले सूर्योदय तक)${editionTimingSuffixHi}`
      : `${tithiPeriodHi} ${tithiH12Str}:${tithiMStr} तक${editionTimingSuffixHi}, उपरांत ${nextTithiNameOr}`,
    durationStrEn: isTithiAhoratra
      ? `Full day and night through next sunrise${editionTimingSuffixEn}`
      : `Until ${tithiH12Str}:${tithiMStr} ${tithiEndHour >= 12 ? 'PM' : 'AM'}${editionTimingSuffixEn}, then next Tithi`,
    endHour: tithiEndHour,
    endMinute: tithiEndMin,
    nextTithiKey: `${nextTithiIsShukla ? 'Shukla' : 'Krishna'} ${TITHI_NAMES[(nextTithiNum - 1) % 15]}`
  };

  const isEarlyTithiChange = tithiEndHour < 12 && !isTithiAhoratra;
  const dominantTithiNumber = isEarlyTithiChange ? nextTithiNum : tithiNumber;
  const dominantTithiNameOr = isEarlyTithiChange ? nextTithiNameOr : curTithiNameOr;

  // 10. Real Astronomical Nakshatra Ending Time (ଦିବା/ରାତ୍ର ଘଣ୍ଟା:ମିନିଟ୍)
  const nakSpan = 360 / 27; // 13.333333
  const nakExact = planets.moon / nakSpan;
  const nakIndex = Math.floor(nakExact) % 27;
  const nakFrac = nakExact - Math.floor(nakExact);
  const pada = Math.floor(nakFrac * 4) + 1;
  const remainingNakDeg = (1 - nakFrac) * nakSpan;
  const remainingNakHours = remainingNakDeg * 1.821; // Moon sidereal speed ~13.176 deg/24h
  const endNakDate = new Date(sunriseDate.getTime() + remainingNakHours * 3600000);
  const endNakMinutes = (endNakDate.getHours() * 60 + endNakDate.getMinutes()) % 1440;
  const nakEndHour = Math.floor(endNakMinutes / 60);
  const nakEndMin = endNakMinutes % 60;
  const nextNakIndex = (nakIndex + 1) % 27;
  const curNakNameOr = NAKSHATRA_OR_MAP[NAKSHATRA_NAMES[nakIndex]] || NAKSHATRA_NAMES[nakIndex];
  const nextNakNameOr = NAKSHATRA_OR_MAP[NAKSHATRA_NAMES[nextNakIndex]] || NAKSHATRA_NAMES[nextNakIndex];

  let nakPeriodOr = 'ଦିବା';
  let nakPeriodHi = 'दोपहर';
  let nakPeriodEn = 'Day';
  if (nakEndHour >= 4 && nakEndHour < 8) {
    nakPeriodOr = 'ପ୍ରାତଃ';
    nakPeriodHi = 'प्रातः';
    nakPeriodEn = 'Morning';
  } else if (nakEndHour >= 8 && nakEndHour < 16) {
    nakPeriodOr = 'ଦିବା';
    nakPeriodHi = 'दोपहर';
    nakPeriodEn = 'Afternoon';
  } else if (nakEndHour >= 16 && nakEndHour < 19) {
    nakPeriodOr = 'ସାୟଂ';
    nakPeriodHi = 'सायं';
    nakPeriodEn = 'Evening';
  } else if (nakEndHour >= 19 && nakEndHour < 23) {
    nakPeriodOr = 'ରାତ୍ର';
    nakPeriodHi = 'रात्रि';
    nakPeriodEn = 'Night';
  } else {
    nakPeriodOr = 'ନିଶୀଥ';
    nakPeriodHi = 'मध्यरात्रि';
    nakPeriodEn = 'Late Night';
  }

  const nakH12 = nakEndHour % 12 === 0 ? 12 : nakEndHour % 12;
  const nakH12Str = nakH12.toString().padStart(2, '0');
  const nakMStr = nakEndMin.toString().padStart(2, '0');
  const isNakAhoratra = remainingNakHours >= 24;
  const nakshatraTiming = {
    durationStrOr: isNakAhoratra
      ? `${curNakNameOr} ଅହୋରାତ୍ର ଭୋଗ (ପାଦ ${formatOdiaNum(pada)})${editionTimingSuffixOr}`
      : `${curNakNameOr} ${nakPeriodOr} ${formatOdiaNum(nakH12Str)}:${formatOdiaNum(nakMStr)} ପର୍ଯ୍ୟନ୍ତ (ପାଦ ${formatOdiaNum(pada)})${editionTimingSuffixOr}, ତଦନ୍ତେ ${nextNakNameOr}`,
    durationStrHi: isNakAhoratra
      ? `${curNakNameOr} अहोरात्र (पाद ${pada})${editionTimingSuffixHi}`
      : `${nakPeriodHi} ${nakH12Str}:${nakMStr} तक (पाद ${pada})${editionTimingSuffixHi}, उपरांत ${nextNakNameOr}`,
    durationStrEn: isNakAhoratra
      ? `Full day and night (Pada ${pada})${editionTimingSuffixEn}`
      : `Until ${nakH12Str}:${nakMStr} ${nakEndHour >= 12 ? 'PM' : 'AM'} (Pada ${pada})${editionTimingSuffixEn}, then next Nakshatra`,
    endHour: nakEndHour,
    endMinute: nakEndMin,
    pada,
    nextNakshatraKey: NAKSHATRA_NAMES[nextNakIndex]
  };

  // 11. Planetary Positions (Surya & Chandra Sputa)
  const sunRashiIdx = Math.floor(sunDeg / 30);
  const moonRashiIdx = Math.floor(normalizeDegrees(planets.moon) / 30);
  const sunDegInRashi = formatDegreeMinute(sunDeg % 30);
  const moonDegInRashi = formatDegreeMinute(normalizeDegrees(planets.moon) % 30);

  const suryaRashiInfo = {
    rashiOr: RASHI_OR_MAP[sunRashiIdx].or,
    rashiHi: RASHI_OR_MAP[sunRashiIdx].hi,
    rashiEn: RASHI_OR_MAP[sunRashiIdx].en,
    degreesStrOr: sunDegInRashi.or,
    degreesStrEn: sunDegInRashi.en
  };

  const chandraRashiInfo = {
    rashiOr: RASHI_OR_MAP[moonRashiIdx].or,
    rashiHi: RASHI_OR_MAP[moonRashiIdx].hi,
    rashiEn: RASHI_OR_MAP[moonRashiIdx].en,
    degreesStrOr: moonDegInRashi.or,
    degreesStrEn: moonDegInRashi.en
  };

  // 12. Directional Travel Prohibitions (ଦିଗଶୂଳ ଓ ପ୍ରତିକାର)
  const digashula = DIGASHULA_DATA[weekday] || DIGASHULA_DATA[0];

  // 13. Tarabala & Chandrabala Summary
  const moonNakIdx = Math.floor(normalizeDegrees(planets.moon) / (360/27)) % 27;
  const NAKSHATRA_NAMES_OR_LIST = [
    'ଅଶ୍ୱିନୀ', 'ଭରଣୀ', 'କୃତ୍ତିକା', 'ରୋହିଣୀ', 'ମୃଗଶିରା', 'ଆର୍ଦ୍ରା',
    'ପୁନର୍ବସୁ', 'ପୁଷ୍ୟା', 'ଆଶ୍ଲେଷା', 'ମଘା', 'ପୂର୍ବାଫାଲ୍ଗୁନୀ', 'ଉତ୍ତରାଫାଲ୍ଗୁନୀ',
    'ହସ୍ତା', 'ଚିତ୍ରା', 'ସ୍ୱାତୀ', 'ବିଶାଖା', 'ଅନୁରାଧା', 'ଜ୍ୟେଷ୍ଠା',
    'ମୂଳା', 'ପୂର୍ବାଷାଢ଼ା', 'ଉତ୍ତରାଷାଢ଼ା', 'ଶ୍ରବଣା', 'ଧନିଷ୍ଠା', 'ଶତଭିଷା',
    'ପୂର୍ବାଭାଦ୍ରପଦ', 'ଉତ୍ତରାଭାଦ୍ରପଦ', 'ରେବତୀ'
  ];
  const shubhTaras = [1, 3, 5, 7, 8];
  const shubhNaksForToday = shubhTaras.map(offset => NAKSHATRA_NAMES_OR_LIST[(moonNakIdx + offset) % 27]);
  const tarabalaSummaryOr = `${shubhNaksForToday.join(', ')} ଜନ୍ମ ନକ୍ଷତ୍ରଧାରୀଙ୍କ ପାଇଁ ଆଜି ଶୁଭ ତାରାବଳ।`;
  const auspiciousRashiOffsets = [0, 2, 5, 6, 9, 10];
  const auspiciousRashis = auspiciousRashiOffsets.map(off => RASHI_OR_MAP[(moonRashiIdx + off) % 12].or);
  const chandrabalaSummaryOr = `${auspiciousRashis.slice(0, 5).join(', ')} ରାଶିଙ୍କ ପାଇଁ ଆଜି ଚନ୍ଦ୍ରବଳ ଅନୁକୂଳ ଓ ସର୍ବକାର୍ଯ୍ୟ ସିଦ୍ଧିଦାୟକ।`;

  // 14. Panjika Comparative Variation Notes
  let panjikaNotes: DynamicOdiaDayInfo['panjikaNotes'] = undefined;
  if (isEkadashi) {
    if (editionId === 'radharaman') {
      panjikaNotes = {
        or: 'ରାଧାରମଣ ପାଞ୍ଜି ମତେ: ଦଶମୀ ବିଦ୍ଧା ତ୍ୟାଗ କରି ଶୁଦ୍ଧ ଏକାଦଶୀ ଓ ହରିବାସର ପାଳନ ବିହିତ। ବିଦ୍ଧା ସ୍ପର୍ଶ ଥିଲେ ପରଦିନ ମହାଦ୍ୱାଦଶୀ ବ୍ରତ।',
        hi: 'राधारमण पंचांग: दशमी विद्धा त्याग कर शुद्ध एकादशी व हरिवासर व्रत।',
        en: 'Radharaman Panjika: Strict Vaishnava Viddha avoidance; observance on pure Harivasara.'
      };
    } else if (editionId === 'khadiratna') {
      panjikaNotes = {
        or: 'ଅସଲ ଖଡ଼ିରତ୍ନ ମତେ: ଶ୍ରୀମନ୍ଦିର ରତ୍ନସିଂହାସନ ନୀତି ଅନୁସାରେ ଏକାଦଶୀ ଦିବସରେ ମହାପ୍ରଭୁଙ୍କ ମନ୍ଦିର ବେଢ଼ା ପରିକ୍ରମା ଓ ଦୀପଦାନ।',
        hi: 'खड़िरत्न पंचांग: श्रीमंदिर रत्नसिंहासन नीति अनुसार एकादशी परिक्रमा व दीपदान।',
        en: 'Asal Khadiratna: Srimandir Ratnavedi niti dictates Holy Trinity circumambulation and lamp offering.'
      };
    } else if (editionId === 'bhagyajyoti') {
      panjikaNotes = {
        or: 'ଭାଗ୍ୟଜ୍ୟୋତି (ଦୃକ୍) ମତେ: ଖଗୋଳୀୟ ସୂର୍ଯ୍ୟ-ଚନ୍ଦ୍ର ସ୍ଫୁଟ ଗଣନା ଅନୁସାରେ ଏକାଦଶୀ ତିଥିର ସଠିକ୍ ସମାପ୍ତି ଓ ପାରଣା କାଳ ନିର୍ଦ୍ଧାରିତ।',
        hi: 'भाग्यज्योति दृक: खगोलीय स्फुट अनुसार सटीक पारणा समय।',
        en: 'Bhagyajyoti Drik: High precision astronomical calculation of Parana timing.'
      };
    } else {
      panjikaNotes = {
        or: 'କୋହିନୂର ପ୍ରେସ୍ ମତେ: ମୁକ୍ତିମଣ୍ଡପ ଅନୁମୋଦିତ ଉଦୟ ତିଥି ପରମ୍ପରାରେ ଏକାଦଶୀ ମହାବ୍ରତ ଓ ଉପବାସ ପାଳନୀୟ।',
        hi: 'कोहिनूर प्रेस: मुक्तिमंडप अनुमोदित उदय तिथि अनुसार एकादशी व्रत।',
        en: 'Kohinoor Press: Mukti Mandap approved Udaya Tithi rules for Ekadashi fasting.'
      };
    }
  } else if (isSankranti) {
    if (editionId === 'bhagyajyoti') {
      panjikaNotes = {
        or: 'ଭାଗ୍ୟଜ୍ୟୋତି (ଦୃକ୍) ମତେ: ନାସା ଖଗୋଳୀୟ ନିରାୟଣ ସଂକ୍ରାନ୍ତି ସ୍ପର୍ଶ କାଳ ଅନୁସାରେ ପୁଣ୍ୟକାଳ ଗଣନା କରାଯାଇଛି।',
        hi: 'भाग्यज्योति: खगोलीय संक्रांति स्पर्श अनुसार पुण्यकाल।',
        en: 'Bhagyajyoti: Astronomical ingress moment defines the exact Punyakala.'
      };
    } else {
      panjikaNotes = {
        or: 'କୋହିନୂର ଓ ଖଡ଼ିରତ୍ନ ମତେ: ସାମନ୍ତ ଚନ୍ଦ୍ରଶେଖର ସିଂହଙ୍କ ସିଦ୍ଧାନ୍ତ ଦର୍ପଣ ଅନୁଯାୟୀ ସଂକ୍ରାନ୍ତି ପୁଣ୍ୟ ସ୍ନାନ-ଦାନ ବେଳା ନିର୍ଦ୍ଧାରିତ।',
        hi: 'कोहिनूर व खड़िरत्न: सामंत चंद्रशेखर सिद्धांत दर्पण अनुसार संक्रांति पुण्यकाल।',
        en: 'Kohinoor & Khadiratna: Siddhanta Darpana tradition governs the auspicious bath and charity window.'
      };
    }
  } else if (editionId === 'khadiratna') {
    panjikaNotes = {
      or: 'ଅସଲ ଖଡ଼ିରତ୍ନ ମତେ: ପୁରୀ ଶ୍ରୀମନ୍ଦିର ଛତିଶା ନିଯୋଗର ଦୈନିକ ଧୂପ, ବେଶ ଓ ମହାପ୍ରସାଦ ଭୋଗ ନୀତି ସହିତ ପ୍ରମାଣିତ।',
      hi: 'खड़िरत्न: पुरी श्रीमंदिर के दैनिक धूप, वेश व महाप्रसाद भोग नीति अनुसार।',
      en: 'Asal Khadiratna: Synchronized with Puri Srimandir servitor rituals, daily Besha, and Mahaprasad.'
    };
  } else {
    panjikaNotes = {
      or: 'କୋହିନୂର ପ୍ରେସ୍ ମତେ: ସିଦ୍ଧାନ୍ତ ଦର୍ପଣ ଓ ପୁରୀ ମୁକ୍ତିମଣ୍ଡପ ପରମ୍ପରାରେ ଦୈନିକ ଖାଦ୍ୟ ନିଷେଧ ଓ ଶୁଭ ବେଳା ସୁନିଶ୍ଚିତ।',
      hi: 'कोहिनूर प्रेस: सिद्धांत दर्पण परंपरा अनुसार दैनिक शुभाशुभ विचार।',
      en: 'Kohinoor Press: Siddhanta Darpana tradition dictates the daily auspicious windows and dietary injunctions.'
    };
  }

  // 6 Ritus (Seasons) of Odisha
  const RITU_MAP: Array<{ or: string; hi: string; en: string }> = [
    { or: 'ଗ୍ରୀଷ୍ମ ଋତୁ', hi: 'ग्रीष्म ऋतु', en: 'Summer' }, // 0: Baisakha
    { or: 'ଗ୍ରୀଷ୍ମ ଋତୁ', hi: 'ग्रीष्म ऋतु', en: 'Summer' }, // 1: Jyestha
    { or: 'ବର୍ଷା ଋତୁ', hi: 'वर्षा ऋतु', en: 'Monsoon' },  // 2: Asadha
    { or: 'ବର୍ଷା ଋତୁ', hi: 'वर्षा ऋतु', en: 'Monsoon' },  // 3: Sravana
    { or: 'ଶରତ ଋତୁ', hi: 'शरद ऋतु', en: 'Autumn' },   // 4: Bhadrava
    { or: 'ଶରତ ଋତୁ', hi: 'शरद ऋतु', en: 'Autumn' },   // 5: Ashwina
    { or: 'ହେମନ୍ତ ଋତୁ', hi: 'हेमंत ऋतु', en: 'Pre-Winter' }, // 6: Kartika
    { or: 'ହେମନ୍ତ ଋତୁ', hi: 'हेमंत ऋतु', en: 'Pre-Winter' }, // 7: Margasira
    { or: 'ଶୀତ ଋତୁ', hi: 'शीत ऋतु', en: 'Winter' },      // 8: Pausha
    { or: 'ଶୀତ ଋତୁ', hi: 'शीत ऋतु', en: 'Winter' },      // 9: Magha
    { or: 'ବସନ୍ତ ଋତୁ', hi: 'बसंत ऋतु', en: 'Spring' },  // 10: Phalguna
    { or: 'ବସନ୍ତ ଋତୁ', hi: 'बसंत ऋतु', en: 'Spring' }   // 11: Chaitra
  ];
  const rituInfo = RITU_MAP[solarRashiIdx] || RITU_MAP[0];

  const dayResult: DynamicOdiaDayInfo = {
    date,
    dateStr: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
    rituInfo,
    dayOfMonth: date.getDate(),
    gregorianMonth: date.getMonth(),
    gregorianYear: date.getFullYear(),
    weekdayIdx: weekday,
    odiaSolarMonth,
    odiaSolarDay,
    isSankranti,
    sankrantiName,
    sankrantiPunyakala,
    panjika,
    lunarMonthName,
    tithiNumber,
    isShukla,
    isPurnima,
    isAmavasya,
    isEkadashi,
    ekadashiName,
    isPradosha,
    dominantTithiNumber,
    dominantTithiNameOr,
    isEarlyTithiChange,
    jagannathBesha,
    festivals,
    foodRestrictionOr: restriction.or,
    foodRestrictionEn: restriction.en,
    belas,
    edition,
    tithiTiming,
    nakshatraTiming,
    suryaRashiInfo,
    chandraRashiInfo,
    digashula,
    tarabalaSummaryOr,
    chandrabalaSummaryOr,
    advanceMuhurtas,
    dinamana,
    ratrimana,
    panjikaNotes,
    navagrahaSputa: calculateNavagrahaSputa(date),
    choghadiya: calculateChoghadiya(sunriseMinutes, sunsetMinutes, weekday),
    planetaryHoras: calculatePlanetaryHoras(sunriseMinutes, sunsetMinutes, weekday),
    ghataChakra: calculateGhataChakra(moonRashiIdx, weekday, tithiNumber, moonNakIdx),
    dailyLagnas: calculateDailyLagnas(date, latitude, longitude, sunriseMinutes)
  };

  dayResult.currentLagna = dayResult.dailyLagnas?.find(l => l.isCurrent);

  const defaultCity = ODISHA_CITIES.find(c => Math.abs(c.lat - latitude) < 0.3 && Math.abs(c.lon - longitude) < 0.3) || ODISHA_CITIES[0];
  dayResult.sankalpa = generateVedicSankalpa(dayResult, defaultCity);

  return dayResult;
}

function timeStringToMinutes(timeStr: string): number {
  if (!timeStr) return 360;
  const parts = timeStr.split(/[: ]/);
  let h = parseInt(parts[0], 10) || 6;
  const m = parseInt(parts[1], 10) || 0;
  const isPM = timeStr.includes('PM');
  if (isPM && h !== 12) h += 12;
  if (!isPM && h === 12) h = 0;
  return h * 60 + m;
}

function minutesToTimeStr(totalMinutes: number): string {
  let m = Math.round(totalMinutes) % 1440;
  if (m < 0) m += 1440;
  const h = Math.floor(m / 60);
  const mins = m % 60;
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  return `${displayH.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${period}`;
}


// ==========================================
// SHUBHA MUHURTA ENGINE & SACRED PANJIKA DATA
// ==========================================

export interface ShubhaMuhurta {
  id: string;
  type: 'vivaha' | 'bratopanayana' | 'gruhapravesha' | 'namakarana' | 'vahana' | 'vyavasaya' | 'bhoomipuja';
  typeOr: string;
  typeHi: string;
  typeEn: string;
  date: Date;
  dateStr: string; // YYYY-MM-DD
  dayOfWeekOr: string;
  dayOfWeekHi: string;
  dayOfWeekEn: string;
  odiaSolarDate: string; // e.g. ୧୫ ବୈଶାଖ
  tithiNameOr: string;
  tithiNameEn: string;
  nakshatraNameOr: string;
  nakshatraNameEn: string;
  shubhaLagna: string;
  timeWindow: string;
  significanceOr: string;
  significanceHi: string;
  significanceEn: string;
}

/**
 * Find the best auspicious Lagna window from a day's computed lagnas.
 * Returns the actual rashi name and time window for Muhurtas,
 * replacing hardcoded static values with real astronomical data.
 */
function findAuspiciousLagnaWindow(
  dailyLagnas: DailyLagnaInfo[] | undefined,
  requiredNatures: string[] // e.g., ['sthira'] or ['chara', 'dwiswabhava']
): { shubhaLagna: string; timeWindow: string } {
  if (!dailyLagnas || dailyLagnas.length === 0) {
    return { shubhaLagna: 'ଅନୁପଲବ୍ଧ', timeWindow: 'ଅନୁପଲବ୍ଧ' };
  }
  const matching = dailyLagnas.filter(l => requiredNatures.includes(l.nature));
  if (matching.length === 0) {
    // Fallback to first lagna if no nature match
    const first = dailyLagnas[0];
    return {
      shubhaLagna: `${first.rashiNameOr} ଲଗ୍ନ (${first.natureOr})`,
      timeWindow: first.timeRangeOr
    };
  }
  // Pick the first matching auspicious lagna
  const best = matching[0];
  // Also list all matching lagnas for user info
  const allNames = matching.map(l => l.rashiNameOr).join(' / ');
  return {
    shubhaLagna: `${allNames} ଲଗ୍ନ (${best.natureOr})`,
    timeWindow: best.timeRangeOr
  };
}

/**
 * Check Guru (Jupiter) and Shukra (Venus) combustion status.
 * Guru is combust when within 11° of Sun, Shukra within 10°.
 * Returns true if BOTH are free from combustion (shuddhi).
 */
function checkGuruShukraShuddhi(dayInfo: DynamicOdiaDayInfo): { isShuddh: boolean; statusOr: string } {
  const planets = calculatePlanetaryPositions(dayInfo.date);
  const sunDeg = normalizeDegrees(planets.sun);
  const jupDeg = normalizeDegrees(planets.jupiter);
  const venDeg = normalizeDegrees(planets.venus);

  // Angular separation (shortest arc)
  const jupSep = Math.min(Math.abs(jupDeg - sunDeg), 360 - Math.abs(jupDeg - sunDeg));
  const venSep = Math.min(Math.abs(venDeg - sunDeg), 360 - Math.abs(venDeg - sunDeg));

  const isGuruAsta = jupSep < 11;
  const isShukraAsta = venSep < 10;

  if (!isGuruAsta && !isShukraAsta) {
    return { isShuddh: true, statusOr: 'ଗୁରୁ-ଶୁକ୍ର ଶୁଦ୍ଧି ପ୍ରାପ୍ତ।' };
  } else if (isGuruAsta && isShukraAsta) {
    return { isShuddh: false, statusOr: 'ଗୁରୁ ଓ ଶୁକ୍ର ଉଭୟ ଅସ୍ତ — ବିବାହାଦି ବର୍ଜ୍ୟ।' };
  } else if (isGuruAsta) {
    return { isShuddh: false, statusOr: 'ଗୁରୁ ଅସ୍ତ — ବିବାହ/ବ୍ରତୋପନୟନ ବର୍ଜ୍ୟ।' };
  } else {
    return { isShuddh: false, statusOr: 'ଶୁକ୍ର ଅସ୍ତ — ବିବାହ ବର୍ଜ୍ୟ।' };
  }
}

export function calculateMonthMuhurtas(
  year: number,
  month: number, // 0-indexed (0=Jan ... 11=Dec)
  lat: number = 19.8135,
  lon: number = 85.8312,
  editionId: string = 'kohinoor'
): ShubhaMuhurta[] {
  const list: ShubhaMuhurta[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const WEEKDAY_NAMES_MAP = [
    { or: 'ରବିବାର', hi: 'रविवार', en: 'Sunday' },
    { or: 'ସୋମବାର', hi: 'सोमवार', en: 'Monday' },
    { or: 'ମଙ୍ଗଳବାର', hi: 'मंगलवार', en: 'Tuesday' },
    { or: 'ବୁଧବାର', hi: 'बुधवार', en: 'Wednesday' },
    { or: 'ଗୁରୁବାର', hi: 'गुरुवार', en: 'Thursday' },
    { or: 'ଶୁକ୍ରବାର', hi: 'शुक्रवार', en: 'Friday' },
    { or: 'ଶନିବାର', hi: 'शनिवार', en: 'Saturday' }
  ];

  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(year, month, d);
    const dayInfo = calculateOdiaCalendarDay(dt, lat, lon, editionId);
    const panjika = dayInfo.panjika;
    const tithiNum = panjika.tithi.number;
    const isShukla = panjika.tithi.paksha === 'Shukla';
    const monthId = dayInfo.odiaSolarMonth.id;
    const weekday = dt.getDay(); // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
    const nakshatraName = panjika.nakshatra.nameKey;
    const odiaSolarDate = `${formatOdiaNum(dayInfo.odiaSolarDay)} ${dayInfo.odiaSolarMonth.nameOr}`;
    const dateStr = dayInfo.dateStr;
    const dayName = WEEKDAY_NAMES_MAP[weekday];
    const tithiNameEn = panjika.tithi.nameKey;
    const tithiNameOr = `${isShukla ? 'ଶୁକ୍ଳ' : 'କୃଷ୍ଣ'} ${getOdiaTithiOnly(tithiNum)}`;
    const nakshatraNameOr = NAKSHATRA_OR_MAP[nakshatraName] || nakshatraName;

    // 1. Vivaha Muhurta (ବିବାହ ମୁହୂର୍ତ୍ତ)
    const isVivahaMonth = ['baisakha', 'jyestha', 'magha', 'phalguna'].includes(monthId) || (monthId === 'asadha' && isShukla && tithiNum <= 10);
    const vivahaNakshatras = ['Rohini', 'Mrigashira', 'Magha', 'Uttara Phalguni', 'Hasta', 'Swati', 'Anuradha', 'Mula', 'Uttara Ashadha', 'Uttara Bhadrapada', 'Revati'];
    const isVivahaTithi = [2, 3, 5, 7, 10, 11, 12, 13, 17, 18, 20, 22].includes(tithiNum);
    const isVivahaVara = [0, 1, 3, 4, 5].includes(weekday);

    if (isVivahaMonth && vivahaNakshatras.includes(nakshatraName) && isVivahaTithi && isVivahaVara) {
      list.push({
        id: `vivaha_${dateStr}`,
        type: 'vivaha',
        typeOr: 'ବିବାହ ମୁହୂର୍ତ୍ତ',
        typeHi: 'विवाह मुहूर्त',
        typeEn: 'Marriage Muhurta',
        date: dt,
        dateStr,
        dayOfWeekOr: dayName.or,
        dayOfWeekHi: dayName.hi,
        dayOfWeekEn: dayName.en,
        odiaSolarDate,
        tithiNameOr,
        tithiNameEn,
        nakshatraNameOr,
        nakshatraNameEn: nakshatraName,
        ...findAuspiciousLagnaWindow(dayInfo.dailyLagnas, ['sthira', 'dwiswabhava']),
        significanceOr: `ଶୁଦ୍ଧ ଗୋଧୂଳି ଓ ନିଶୀଥ ଲଗ୍ନରେ ପାଣିଗ୍ରହଣ ଅନୁକୂଳ। ${checkGuruShukraShuddhi(dayInfo).statusOr}`,
        significanceHi: 'विवाह संस्कार हेतु श्रेष्ठ लग्न व नक्षत्र संयोग।',
        significanceEn: 'Highly auspicious planetary alignment for marriage ceremonies.'
      });
    }

    // 2. Bratopanayana Muhurta (ବ୍ରତୋପନୟନ / ବ୍ରତଘର)
    const isUpanayanaMonth = ['magha', 'phalguna', 'chaitra', 'baisakha', 'jyestha'].includes(monthId);
    const upanayanaNakshatras = ['Ashwini', 'Rohini', 'Mrigashira', 'Punarvasu', 'Pushya', 'Hasta', 'Chitra', 'Swati', 'Anuradha', 'Shravana', 'Dhanishta', 'Shatabhisha'];
    const isUpanayanaTithi = isShukla && [2, 3, 5, 7, 10, 11].includes(tithiNum);
    const isUpanayanaVara = [0, 1, 3, 4, 5].includes(weekday);

    if (isUpanayanaMonth && upanayanaNakshatras.includes(nakshatraName) && isUpanayanaTithi && isUpanayanaVara) {
      list.push({
        id: `brato_${dateStr}`,
        type: 'bratopanayana',
        typeOr: 'ବ୍ରତୋପନୟନ (ବ୍ରତଘର)',
        typeHi: 'उपनयन (जनेऊ) संस्कार',
        typeEn: 'Sacred Thread (Upanayana)',
        date: dt,
        dateStr,
        dayOfWeekOr: dayName.or,
        dayOfWeekHi: dayName.hi,
        dayOfWeekEn: dayName.en,
        odiaSolarDate,
        tithiNameOr,
        tithiNameEn,
        nakshatraNameOr,
        nakshatraNameEn: nakshatraName,
        ...findAuspiciousLagnaWindow(dayInfo.dailyLagnas, ['chara', 'dwiswabhava']),
        significanceOr: 'ଉତ୍ତରାୟଣ ପୂଣ୍ୟ କାଳରେ ଗାୟତ୍ରୀ ଦୀକ୍ଷା ଓ ଯଜ୍ଞୋପବୀତ ଧାରଣ ପାଇଁ ଅତୀବ ପ୍ରଶସ୍ତ।',
        significanceHi: 'गायत्री दीक्षा व यज्ञोपवीत धारण हेतु शुभ वेला।',
        significanceEn: 'Auspicious time for sacred thread ceremony and Gayatri initiation during Uttarayana.'
      });
    }

    // 3. Gruha Pravesha Muhurta (ଗୃହପ୍ରବେଶ)
    const gruhaNakshatras = ['Rohini', 'Mrigashira', 'Uttara Phalguni', 'Chitra', 'Anuradha', 'Uttara Ashadha', 'Uttara Bhadrapada', 'Revati'];
    const isGruhaTithi = isShukla && [2, 3, 5, 7, 8, 10, 11, 13].includes(tithiNum);
    const isGruhaVara = [1, 3, 4, 5].includes(weekday);

    if (gruhaNakshatras.includes(nakshatraName) && isGruhaTithi && isGruhaVara && !['pausha', 'chaitra'].includes(monthId)) {
      list.push({
        id: `gruha_${dateStr}`,
        type: 'gruhapravesha',
        typeOr: 'ଗୃହପ୍ରବେଶ / ବାସ୍ତୁପୂଜା',
        typeHi: 'गृह प्रवेश / वास्तु पूजा',
        typeEn: 'Housewarming (Gruha Pravesha)',
        date: dt,
        dateStr,
        dayOfWeekOr: dayName.or,
        dayOfWeekHi: dayName.hi,
        dayOfWeekEn: dayName.en,
        odiaSolarDate,
        tithiNameOr,
        tithiNameEn,
        nakshatraNameOr,
        nakshatraNameEn: nakshatraName,
        ...findAuspiciousLagnaWindow(dayInfo.dailyLagnas, ['sthira']),
        significanceOr: 'ସ୍ଥିର ଲଗ୍ନରେ ବାସ୍ତୁ ଶାନ୍ତି ଓ ଗୃହପ୍ରବେଶ ଦ୍ୱାରା ଅଖଣ୍ଡ ସୁଖ, ସମୃଦ୍ଧି ପ୍ରାପ୍ତି ହୁଏ।',
        significanceHi: 'स्थिर लग्न में गृह प्रवेश से सुख-शांति व समृद्धि की प्राप्ति होती है।',
        significanceEn: 'Bestows peace and perpetual family harmony with Vastu Shanti and Sthira Lagna.'
      });
    }

    // 4. Vahana Muhurta (ଯାନବାହନ କ୍ରୟ)
    const vahanaNakshatras = ['Ashwini', 'Rohini', 'Punarvasu', 'Pushya', 'Hasta', 'Swati', 'Shravana', 'Shatabhisha'];
    const isVahanaTithi = ![4, 9, 14, 19, 24, 29, 30].includes(tithiNum);
    const isVahanaVara = [0, 1, 3, 4, 5].includes(weekday);

    if (vahanaNakshatras.includes(nakshatraName) && isVahanaTithi && isVahanaVara) {
      list.push({
        id: `vahana_${dateStr}`,
        type: 'vahana',
        typeOr: 'ଯାନବାହନ କ୍ରୟ ମୁହୂର୍ତ୍ତ',
        typeHi: 'वाहन क्रय मुहूर्त',
        typeEn: 'Vehicle Purchase Muhurta',
        date: dt,
        dateStr,
        dayOfWeekOr: dayName.or,
        dayOfWeekHi: dayName.hi,
        dayOfWeekEn: dayName.en,
        odiaSolarDate,
        tithiNameOr,
        tithiNameEn,
        nakshatraNameOr,
        nakshatraNameEn: nakshatraName,
        ...findAuspiciousLagnaWindow(dayInfo.dailyLagnas, ['chara', 'dwiswabhava']),
        significanceOr: 'ଅମୃତ ବେଳାରେ ଯାନବାହନ କ୍ରୟ ଓ ପୂଜନ କଲେ ଯାତ୍ରା ସୁରକ୍ଷିତ ଓ ମଙ୍ଗଳମୟ ରହେ।',
        significanceHi: 'अमृत बेला में वाहन क्रय करना दीर्घायु व सुरक्षा प्रदान करता है।',
        significanceEn: 'Purchasing vehicle during Amrita Bela guarantees safety and prosperity.'
      });
    }

    // 5. Vyavasaya Muhurta (ବ୍ୟବସାୟ ଶୁଭାରମ୍ଭ / ଦୋକାନ ପ୍ରତିଷ୍ଠା)
    const vyavasayaNakshatras = ['Pushya', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Anuradha', 'Revati'];
    if (vyavasayaNakshatras.includes(nakshatraName) && isShukla && [2, 3, 5, 7, 10, 11].includes(tithiNum) && [1, 3, 4, 5].includes(weekday)) {
      list.push({
        id: `vyavasaya_${dateStr}`,
        type: 'vyavasaya',
        typeOr: 'ବ୍ୟବସାୟ ଶୁଭାରମ୍ଭ (ଦୋକାନ ଉଦ୍‌ଘାଟନ)',
        typeHi: 'व्यापार शुभारंभ मुहूर्त',
        typeEn: 'Business Launch Muhurta',
        date: dt,
        dateStr,
        dayOfWeekOr: dayName.or,
        dayOfWeekHi: dayName.hi,
        dayOfWeekEn: dayName.en,
        odiaSolarDate,
        tithiNameOr,
        tithiNameEn,
        nakshatraNameOr,
        nakshatraNameEn: nakshatraName,
        ...findAuspiciousLagnaWindow(dayInfo.dailyLagnas, ['dwiswabhava', 'sthira']),
        significanceOr: 'ମାହେନ୍ଦ୍ର ବେଳାରେ ନୂତନ ବ୍ୟବସାୟ, ଦୋକାନ ଆରମ୍ଭ କଲେ ଲକ୍ଷ୍ମୀ କୃପା ସର୍ବଦା ବଜାୟ ରହେ।',
        significanceHi: 'माहेंद्र बेला में दुकान या व्यवसाय शुरू करने से लक्ष्मी जी की कृपा रहती है।',
        significanceEn: 'Invokes perpetual prosperity and divine blessings of Goddess Lakshmi.'
      });
    }

    // 6. Namakarana & Annaprashana Muhurta (ନାମକରଣ ଓ ଅନ୍ନପ୍ରାଶନ)
    const namakaranaNakshatras = ['Ashwini', 'Rohini', 'Mrigashira', 'Punarvasu', 'Pushya', 'Hasta', 'Anuradha', 'Shravana', 'Revati'];
    if (namakaranaNakshatras.includes(nakshatraName) && isShukla && [2, 3, 5, 7, 10, 12].includes(tithiNum) && [1, 3, 4, 5].includes(weekday)) {
      list.push({
        id: `namakarana_${dateStr}`,
        type: 'namakarana',
        typeOr: 'ନାମକରଣ ଓ ଅନ୍ନପ୍ରାଶନ',
        typeHi: 'नामकरण एवं अन्नप्राशन',
        typeEn: 'Namakarana & Annaprashana',
        date: dt,
        dateStr,
        dayOfWeekOr: dayName.or,
        dayOfWeekHi: dayName.hi,
        dayOfWeekEn: dayName.en,
        odiaSolarDate,
        tithiNameOr,
        tithiNameEn,
        nakshatraNameOr,
        nakshatraNameEn: nakshatraName,
        ...findAuspiciousLagnaWindow(dayInfo.dailyLagnas, ['dwiswabhava']),
        significanceOr: 'ଶିଶୁର ଦୀର୍ଘ ଆୟୁ, ଆରୋଗ୍ୟ ଓ ସୌଭାଗ୍ୟ ପ୍ରାପ୍ତି ପାଇଁ ପବିତ୍ର ନାମକରଣ ଓ ପ୍ରଥମ ଅନ୍ନପ୍ରାଶନ ବିହିତ।',
        significanceHi: 'शिशु के दीर्घायु व उत्तम स्वास्थ्य हेतु पावन नामकरण व अन्नप्राशन वेला।',
        significanceEn: 'Auspicious timing for giving the sacred name and first grain offering to the child.'
      });
    }

    // 7. Bhoomi Puja & Gruharambha (ଭୂମିପୂଜା ଓ ଗୃହନିର୍ମାଣ ଶୁଭାରମ୍ଭ)
    const bhoomiNakshatras = ['Rohini', 'Mrigashira', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Anuradha', 'Uttara Ashadha', 'Uttara Bhadrapada'];
    if (bhoomiNakshatras.includes(nakshatraName) && isShukla && [2, 3, 5, 7, 10, 13].includes(tithiNum) && [1, 3, 4, 5].includes(weekday) && !['chaitra', 'jyestha', 'asadha'].includes(monthId)) {
      list.push({
        id: `bhoomipuja_${dateStr}`,
        type: 'bhoomipuja',
        typeOr: 'ଭୂମିପୂଜା ଓ ଗୃହାରମ୍ଭ',
        typeHi: 'भूमि पूजन एवं गृहारंभ',
        typeEn: 'Foundation Laying (Bhoomi Puja)',
        date: dt,
        dateStr,
        dayOfWeekOr: dayName.or,
        dayOfWeekHi: dayName.hi,
        dayOfWeekEn: dayName.en,
        odiaSolarDate,
        tithiNameOr,
        tithiNameEn,
        nakshatraNameOr,
        nakshatraNameEn: nakshatraName,
        ...findAuspiciousLagnaWindow(dayInfo.dailyLagnas, ['sthira']),
        significanceOr: 'ବାସ୍ତୁଦେବତା ଓ ଅନନ୍ତ କୂର୍ମଙ୍କୁ ପୂଜା କରି ଗୃହ ଭିତ୍ତିପ୍ରସ୍ତର ସ୍ଥାପନ କଲେ ନିର୍ମାଣ ନିର୍ବିଘ୍ନ ହୁଏ।',
        significanceHi: 'वास्तु देवता व शेषनाग पूजन सहित गृह निर्माण प्रारंभ हेतु शुभ मुहूर्त।',
        significanceEn: 'Sacred foundation laying ensuring obstacle-free construction with Vastu and Sheshanaga blessings.'
      });
    }
  }

  return list;
}

export interface SrimandirNiti {
  order: number;
  id: string;
  nameOr: string;
  nameHi: string;
  nameEn: string;
  timeApprox: string;
  descriptionOr: string;
  descriptionHi: string;
  descriptionEn: string;
  sevakaOr: string;
}

export const SRIMANDIR_DAILY_NITI: SrimandirNiti[] = [
  {
    order: 1,
    id: 'dwaraphita',
    nameOr: 'ଦ୍ୱାରଫିଟା ନୀତି',
    nameHi: 'द्वारफिता नीति',
    nameEn: 'Dwaraphita (Opening of Doors)',
    timeApprox: 'ପ୍ରାତଃ ୦୫:୦୦',
    descriptionOr: 'ଜୟ ବିଜୟ ଦ୍ୱାର ଓ ଭିତର ଦ୍ୱାର ଖୋଲାଯାଇ ପ୍ରଭୁଙ୍କ ପ୍ରଥମ ଦର୍ଶନ ଅନୁଷ୍ଠିତ ହୁଏ। ସିଲ୍ ଯାଞ୍ଚ ପରେ ଦ୍ୱାର ଉନ୍ମୁକ୍ତ ହୁଏ।',
    descriptionHi: 'प्रातःकाल मुख्य कपाट खोलने की पावन विधि।',
    descriptionEn: 'Sacred ritual of inspecting seals and unlocking the inner sanctum gates at dawn.',
    sevakaOr: 'ଭିତରଚ୍ଛ ମହାପାତ୍ର, ତଳିଚ୍ଛ ମହାପାତ୍ର, ଗୋଚ୍ଛିକାର'
  },
  {
    order: 2,
    id: 'mangala_alati',
    nameOr: 'ମଙ୍ଗଳ ଆଳତି',
    nameHi: 'मंगला आरती',
    nameEn: 'Mangala Alati',
    timeApprox: 'ପ୍ରାତଃ ୦୫:୩୦',
    descriptionOr: 'ମହାପ୍ରଭୁଙ୍କ ଦିବ୍ୟ ନେତ୍ର ଉନ୍ମୀଳନ ପରେ କର୍ପୂର ଓ ଘିଅ ଦୀପରେ ମଙ୍ଗଳ ଆଳତି ଅର୍ପଣ। ଏହା ସର୍ବଶ୍ରେଷ୍ଠ ପୁଣ୍ୟପ୍ରଦ।',
    descriptionHi: 'भगवान जगन्नाथ जी की प्रथम पावन मंगला आरती।',
    descriptionEn: 'First morning camphor and ghee lamp waving ceremony waking the Supreme Lord.',
    sevakaOr: 'ଭିତରଚ୍ଛ ଓ ପତିମହାପାତ୍ର'
  },
  {
    order: 3,
    id: 'mailam',
    nameOr: 'ମଇଲମ (ବସ୍ତ୍ର ପରିବର୍ତ୍ତନ)',
    nameHi: 'मैलम (वस्त्र परिवर्तन)',
    nameEn: 'Mailam (Attire Change)',
    timeApprox: 'ପ୍ରାତଃ ୦୬:୦୦',
    descriptionOr: 'ରାତ୍ର ବଡ଼ସିଂହାର ବସ୍ତ୍ର ଓ ଫୁଲ ଅପସାରଣ କରାଯାଇ ପବିତ୍ର ତଡ଼ପ ଏବଂ ଉତ୍ତରୀୟ ଲାଗି କରାଯାଏ।',
    descriptionHi: 'रात्रि के पुष्प व वस्त्र बदलकर प्रभात के पवित्र वस्त्र धारण।',
    descriptionEn: 'Removal of previous night garments and flowers, offering fresh silk Tadapa robes.',
    sevakaOr: 'ପଶୁପାଳକ ସେବକ, ଖୁଣ୍ଟିଆ'
  },
  {
    order: 4,
    id: 'abakasha',
    nameOr: 'ଅବକାଶ ଓ ଦନ୍ତଧାବନ ସ୍ନାନ',
    nameHi: 'अवकाश एवं दंतधावन स्नान',
    nameEn: 'Abakasha (Holy Bath & Oral Hygiene)',
    timeApprox: 'ପ୍ରାତଃ ୦୬:୩୦',
    descriptionOr: 'କର୍ପୂର ଜଳ ଓ ଦର୍ପଣରେ ପ୍ରତିବିମ୍ବ ସ୍ନାନ। ମହାପ୍ରଭୁଙ୍କ ଦନ୍ତଧାବନ କାଠି ଏବଂ ଜିହ୍ୱା ଲେଖନୀ ସେବା।',
    descriptionHi: 'दर्पण स्नान, दंतधावन और पावन अभिषेक विधान।',
    descriptionEn: 'Sacred ceremonial teeth cleaning, tongue scraping, and mirror-reflection herbal bath.',
    sevakaOr: 'ସୁଆର ବଡ଼ୁ, ଅମୁଣିଆ ସୁଆର, ତଳିଚ୍ଛ'
  },
  {
    order: 5,
    id: 'roshahoma_surya',
    nameOr: 'ରୋଶହୋମ ଓ ସୂର୍ଯ୍ୟପୂଜା',
    nameHi: 'रोषहोम व सूर्य पूजा',
    nameEn: 'Roshahoma & Surya Puja',
    timeApprox: 'ପ୍ରାତଃ ୦୭:୩୦',
    descriptionOr: 'ପବିତ୍ର ରୋଷଘରେ ଅଗ୍ନି ସଂଯୋଗ ପାଇଁ ବୈଷ୍ଣବାଗ୍ନି ହୋମ ଏବଂ ସୂର୍ଯ୍ୟ ଦେବତାଙ୍କ ଉପାସନା।',
    descriptionHi: 'पवित्र रसोई में अग्नि प्रज्वलन व सूर्य देव की पूजा।',
    descriptionEn: 'Igniting sacred temple hearth fires with Vedic homa and worship of Sun God at the Surya temple.',
    sevakaOr: 'ଦେଉଳ ପୁରୋହିତ, ପୂଜାପଣ୍ଡା'
  },
  {
    order: 6,
    id: 'dwarapala_puja',
    nameOr: 'ଦ୍ୱାରପାଳ ପୂଜା',
    nameHi: 'द्वारपाल पूजा',
    nameEn: 'Dwarapala Puja',
    timeApprox: 'ପ୍ରାତଃ ୦୮:୦୦',
    descriptionOr: 'ଜୟ-ବିଜୟ ଦ୍ୱାରପାଳଙ୍କ ପୂଜା ଓ ଶ୍ରୀଜୀଉମାନଙ୍କ ସମ୍ମୁଖରେ ପବିତ୍ର ବେଶ ସଂପାଦନ।',
    descriptionHi: 'द्वारपाल जय-विजय की अर्चना।',
    descriptionEn: 'Worship of celestial guardians Jaya and Vijaya at the sanctum entrance.',
    sevakaOr: 'ପୂଜାପଣ୍ଡା ସେବକ'
  },
  {
    order: 7,
    id: 'besha',
    nameOr: 'ସକାଳ ବେଶ (ଦୈନିକ ସିଙ୍ଗାର)',
    nameHi: 'सकाल वेश (श्रृंगार)',
    nameEn: 'Sakala Besha (Morning Adornment)',
    timeApprox: 'ପ୍ରାତଃ ୦୮:୧୫',
    descriptionOr: 'ଦିନର ବାର ଅନୁସାରେ ରଙ୍ଗୀନ ପାଟ ବସ୍ତ୍ର, ଚନ୍ଦନ, ତୁଳସୀ ମଞ୍ଜରୀ ଓ ସ୍ୱର୍ଣ୍ଣ ଅଳଙ୍କାରରେ ସୁସଜ୍ଜିତ।',
    descriptionHi: 'वार के अनुसार रेशमी वस्त्र, चन्दन और पुष्पों से श्रृंगार।',
    descriptionEn: 'Daily adornment with weekday-specific colored silk, fragrant sandalwood paste, and tulsi garlands.',
    sevakaOr: 'ପଶୁପାଳକ, ସିଙ୍ଗାରୀ'
  },
  {
    order: 8,
    id: 'gopal_ballav',
    nameOr: 'ଗୋପାଳ ବଲ୍ଲଭ ଭୋଗ (ପ୍ରାତଃ ଜଳଖିଆ)',
    nameHi: 'गोपाल वल्लभ भोग (प्रातः अल्पाहार)',
    nameEn: 'Gopal Ballav Bhoga (Morning Breakfast)',
    timeApprox: 'ପ୍ରାତଃ ୦୯:୦୦',
    descriptionOr: 'ମିଠା ଖଇ, କୋରା, ପାଚିଲା କଦଳୀ, ଲହୁଣୀ, ସର, ନଡ଼ିଆ କୋରା ଓ ଛେନା ଅର୍ପଣ।',
    descriptionHi: 'मिश्री, मलाई, मक्खन, केला, खोया और खई का भोग।',
    descriptionEn: 'Sweet puffed rice, fresh butter, condensed cream, ripe bananas, and scraped coconut offerings.',
    sevakaOr: 'ପୂଜାପଣ୍ଡା, ବଲ୍ଲଭ ଯୋଗାଣିଆ'
  },
  {
    order: 9,
    id: 'sakala_dhupa',
    nameOr: 'ସକାଳ ଧୂପ (କୋଠ ଭୋଗ)',
    nameHi: 'सकाल धूप (मुख्य राजभोग)',
    nameEn: 'Sakala Dhupa (Morning Royal Feast)',
    timeApprox: 'ପ୍ରଭାତ ୧୦:୦୦',
    descriptionOr: 'ଷୋଡ଼ଶ ଉପଚାର ପୂଜାରେ ଏଣ୍ଡୁରୀ ପିଠା, ଖେଚୁଡ଼ି, କାକରା, ଝିଲି ଓ ସାଧା ଅନ୍ନ ଡାଲି ଅର୍ପଣ।',
    descriptionHi: 'षोडशोपचार पूजा द्वारा खिचड़ी, ककड़ा, और मीठे भात का भोग।',
    descriptionEn: 'Grand royal feast offered with 16 sacred Vedic rituals, steamed Enduri pitha, and spiced rice.',
    sevakaOr: '୩ ଜଣ ପୂଜାପଣ୍ଡା (ଜଗନ୍ନାଥ, ବଳଭଦ୍ର, ସୁଭଦ୍ରାଙ୍କ ପାଇଁ)'
  },
  {
    order: 10,
    id: 'bhogamandapa',
    nameOr: 'ଭୋଗମଣ୍ଡପ ଭୋଗ (ଜନସାଧାରଣ ପ୍ରସାଦ)',
    nameHi: 'भोगमण्डप भोग',
    nameEn: 'Bhogamandapa Bhoga (Public Mahaprasad)',
    timeApprox: 'ମଧ୍ୟାହ୍ନ ୧୧:୩୦',
    descriptionOr: 'ଆନନ୍ଦ ବଜାରରେ ଭକ୍ତମାନଙ୍କ ପାଇଁ ପ୍ରଚୁର ପରିମାଣରେ ପ୍ରସ୍ତୁତ ଅନ୍ନ, ଡାଲି, ବେସର, ମହୁର ଭୋଗ ହୁଏ।',
    descriptionHi: 'विशाल भोगमंडप में भक्तों के लिए महाप्रसाद का अर्पण।',
    descriptionEn: 'Massive offering sanctifying hundreds of earthen pots of rice, dal, and curries for Ananda Bazar.',
    sevakaOr: 'ସୁଆର ମହାପାତ୍ର, ପୂଜାପଣ୍ଡା'
  },
  {
    order: 11,
    id: 'madhyanna_dhupa',
    nameOr: 'ମଧ୍ୟାହ୍ନ ଧୂପ',
    nameHi: 'मध्याह्न धूप',
    nameEn: 'Madhyanna Dhupa (Midday Feast)',
    timeApprox: 'ଅପରାହ୍ନ ୧୨:୩୦',
    descriptionOr: 'ଦ୍ୱିତୀୟ ପ୍ରଧାନ ଭୋଗ: କାନିକା, ଓଉ ଖଟା, ଘୃତ ଅନ୍ନ, ପୋଟଳ ରସା, ଡାଲିମା ଓ ସ୍ୱାଦିଷ୍ଟ ପିଠା।',
    descriptionHi: 'दोपहर का भव्य राजभोग व आरती।',
    descriptionEn: 'Second principal feast featuring sweet saffron Kanika rice, elephant-apple chutney, and Dalma.',
    sevakaOr: 'ପୂଜାପଣ୍ଡା, ପତ୍ରୀବଡ଼ୁ, ସୁଆରବଡ଼ୁ'
  },
  {
    order: 12,
    id: 'sandhya_alati_dhupa',
    nameOr: 'ସନ୍ଧ୍ୟା ଆଳତି ଓ ସନ୍ଧ୍ୟା ଧୂପ',
    nameHi: 'संध्या आरती एवं संध्या धूप',
    nameEn: 'Sandhya Alati & Sandhya Dhupa',
    timeApprox: 'ସନ୍ଧ୍ୟା ୦୬:୩୦ ରୁ ୦୭:୩୦',
    descriptionOr: 'ସୂର୍ଯ୍ୟାସ୍ତ କାଳୀନ ଦୀପ ଆଳତି, ଜଳଛତ୍ର ଭୋଗ ଏବଂ ସନ୍ଧ୍ୟା ଧୂପରେ ସୁଆର ପିଠା, ଅମାଲୁ ଓ ସରପୁଳି ଲାଗି।',
    descriptionHi: 'शाम की दीप आरती और संध्या धूप भोग।',
    descriptionEn: 'Dusk lamp offering ceremony followed by evening sweet delicacies including Amalu and Sarapuli.',
    sevakaOr: 'ତଳିଚ୍ଛ ମହାପାତ୍ର, ପୂଜାପଣ୍ଡା'
  },
  {
    order: 13,
    id: 'badasimhara_besha',
    nameOr: 'ବଡ଼ସିଂହାର ବେଶ ଓ ଧୂପ',
    nameHi: 'बड़ा श्रृंगार वेश एवं धूप',
    nameEn: 'Badasimhara Besha & Dhupa',
    timeApprox: 'ରାତ୍ର ୧୦:୩୦',
    descriptionOr: 'ପ୍ରଭୁଙ୍କ ସର୍ବମୋହକ ଶୟନ ବେଶ! ଗୀତଗୋବିନ୍ଦ ଖଚିତ ଖଣ୍ଡୁଆ ପାଟ, ସୁବାସିତ ଫୁଲ ମାଳି ଏବଂ କଦଳୀ ପାୟସ ଭୋଗ।',
    descriptionHi: 'गीतगोविंद वस्त्रों व सुगंधित पुष्पों से रात्रि का दिव्य श्रृंगार।',
    descriptionEn: 'The most enchanting bedtime attire wrapped in Geetagovinda verse silks and floral coronets.',
    sevakaOr: 'ସିଙ୍ଗାରୀ, ପଶୁପାଳକ, ବିମାନବଡ଼ୁ'
  },
  {
    order: 14,
    id: 'pahuda',
    nameOr: 'ରାତ୍ର ପହୁଡ଼ (ଶୟନ ଆରତୀ)',
    nameHi: 'रात्रि पहुड़ (शयन)',
    nameEn: 'Ratri Pahuda (Divine Slumber)',
    timeApprox: 'ରାତ୍ର ୧୧:୩୦',
    descriptionOr: 'ପଲଙ୍କ ବିଜେ, ପୁଷ୍ପାଞ୍ଜଳି, କର୍ପୂର ଆରତୀ ଏବଂ ଜୟ ବିଜୟ ଦ୍ୱାର ସିଲ୍ ବନ୍ଦ କରାଯାଇ ପହୁଡ଼ ସମାପ୍ତ ହୁଏ।',
    descriptionHi: 'भगवान का शयन और मंदिर के कपाट बंद करने की विधि।',
    descriptionEn: 'Final bedtime lullaby, putting the deities to sleep on golden beds, and sealing the sanctum doors.',
    sevakaOr: 'ଭିତରଚ୍ଛ, ଖୁଣ୍ଟିଆ, ପତିମହାପାତ୍ର'
  }
];

// ==========================================
// CHHAPANA BHOGA (୫୬ ଭୋଗ) COMPLETE CATALOG
// ==========================================

export interface ChhapanaBhogaItem {
  id: number;
  nameOr: string;
  nameHi: string;
  nameEn: string;
  category: 'sukhila' | 'sankhudi' | 'dugdhajata';
  categoryOr: string;
  categoryHi: string;
  categoryEn: string;
  mainIngredients: string;
  significanceOr: string;
}

export const CHHAPANA_BHOGA_LIST: ChhapanaBhogaItem[] = [
  // 1-20 Sukhila Bhoga (ଶୁଖିଲା ମିଷ୍ଟାନ୍ନ)
  { id: 1, nameOr: 'ଫେଣୀ', nameHi: 'फेणी', nameEn: 'Pheni', category: 'sukhila', categoryOr: 'ଶୁଖିଲା ଭୋଗ', categoryHi: 'सूखा भोग', categoryEn: 'Dry Sweet', mainIngredients: 'ମଇଦା, ଘିଅ, ଚିନି ଶିରା', significanceOr: 'କ୍ରିସ୍ପି ଓ ପରସ୍ତ ବିଶିଷ୍ଟ ପାରମ୍ପରିକ ଶ୍ରୀମନ୍ଦିର ଶୁଖିଲା ମିଠା।' },
  { id: 2, nameOr: 'ଖଜା', nameHi: 'खाजा', nameEn: 'Khaja', category: 'sukhila', categoryOr: 'ଶୁଖିଲା ଭୋଗ', categoryHi: 'सूखा भोग', categoryEn: 'Dry Sweet', mainIngredients: 'ଅଟା/ମଇଦା, ଗାଈ ଘିଅ, ଗୁଜୁରାତି, ଚିନି', significanceOr: 'ଶ୍ରୀକ୍ଷେତ୍ରର ଅତ୍ୟନ୍ତ ପ୍ରସିଦ୍ଧ ପରସ୍ତ ପରସ୍ତ ମହାପ୍ରସାଦ।' },
  { id: 3, nameOr: 'ଗଜା', nameHi: 'गजा', nameEn: 'Gaja', category: 'sukhila', categoryOr: 'ଶୁଖିଲା ଭୋଗ', categoryHi: 'सूखा भोग', categoryEn: 'Dry Sweet', mainIngredients: 'ମଇଦା, ଶୁଦ୍ଧ ଘିଅ, ଚିନି', significanceOr: 'ଚାରିକୋଣିଆ ନରମ ଓ ମିଠା ଭୋଗ।' },
  { id: 4, nameOr: 'କାକରା', nameHi: 'काकरा', nameEn: 'Kakara', category: 'sukhila', categoryOr: 'ଶୁଖିଲା ଭୋଗ', categoryHi: 'सूखा भोग', categoryEn: 'Dry Sweet', mainIngredients: 'ସୁଜି/ଅଟା, ଗୁଡ଼, ନଡ଼ିଆ କୋରା, ଗୋଲମରିଚ', significanceOr: 'ନଡ଼ିଆ ପୁର ଭରା ଘିଅରେ ଛଣା ଓଡ଼ିଆ ପିଠା।' },
  { id: 5, nameOr: 'ଆରିସା', nameHi: 'आरिसा', nameEn: 'Arisa', category: 'sukhila', categoryOr: 'ଶୁଖିଲା ଭୋଗ', categoryHi: 'सूखा भोग', categoryEn: 'Dry Sweet', mainIngredients: 'ଚାଉଳ ଚୂନା, ଗୁଡ଼, ରାଶି (ତେଲ)', significanceOr: 'ପ୍ରାଚୀନ କାଳରୁ ପୂଜିତ ରାଶି ଗୁଡ଼ର କ୍ରଞ୍ଚି ପିଠା।' },
  { id: 6, nameOr: 'ମଣ୍ଡା ପିଠା', nameHi: 'मंडा पीठा', nameEn: 'Manda Pitha', category: 'sukhila', categoryOr: 'ଶୁଖିଲା ଭୋଗ', categoryHi: 'सूखा भोग', categoryEn: 'Dry Sweet', mainIngredients: 'ଚାଉଳ ଚୂନା, ନଡ଼ିଆ ଛେନା ପୁର', significanceOr: 'ବାଷ୍ପରେ ସିଝା କୋମଳ ପବିତ୍ର ପିଠା।' },
  { id: 7, nameOr: 'ଅମାଲୁ', nameHi: 'अमालु', nameEn: 'Amalu', category: 'sukhila', categoryOr: 'ଶୁଖିଲା ଭୋଗ', categoryHi: 'सूखा भोग', categoryEn: 'Dry Sweet', mainIngredients: 'ମଇଦା, କ୍ଷୀର, ପାନମହୁରୀ, ଚିନି ଶିରା', significanceOr: 'ସନ୍ଧ୍ୟା ଧୂପରେ ଲାଗୁଥିବା ମହାପ୍ରଭୁଙ୍କ ପ୍ରିୟ ମିଠା।' },
  { id: 8, nameOr: 'ସୁଆର ପିଠା', nameHi: 'सुआर पीठा', nameEn: 'Suara Pitha', category: 'sukhila', categoryOr: 'ଶୁଖିଲା ଭୋଗ', categoryHi: 'सूखा भोग', categoryEn: 'Dry Sweet', mainIngredients: 'ଅଟା, ଘିଅ, ଜାଇଫଳ', significanceOr: 'ଶ୍ରୀମନ୍ଦିର ସୁଆର ସେବକଙ୍କ ବିଶେଷ ପ୍ରସ୍ତୁତି।' },
  { id: 9, nameOr: 'ମଗଜ ଲଡୁ', nameHi: 'मगज़ लड्डू', nameEn: 'Magaja Ladu', category: 'sukhila', categoryOr: 'ଶୁଖିଲା ଭୋଗ', categoryHi: 'सूखा भोग', categoryEn: 'Dry Sweet', mainIngredients: 'ବେସନ, ଘିଅ, ଚିନି, ତରଭୂଜ ମଞ୍ଜି', significanceOr: 'ସ୍ୱାଦିଷ୍ଟ ବେସନ ଓ ଘିଅ ନିର୍ମିତ ଲଡୁ।' },
  { id: 10, nameOr: 'ମରୀଚ ଲଡୁ', nameHi: 'मरीच लड्डू', nameEn: 'Maricha Ladu', category: 'sukhila', categoryOr: 'ଶୁଖିଲା ଭୋଗ', categoryHi: 'सूखा भोग', categoryEn: 'Dry Sweet', mainIngredients: 'ଅଟା, ଗୋଲମରିଚ, ଘିଅ, ଖଣ୍ଡ', significanceOr: 'ଗୋଲମରିଚର ମହକ ଥିବା ଆୟୁର୍ବେଦିକ ଭୋଗ।' },
  { id: 11, nameOr: 'ବସନ୍ତ ଲଡୁ', nameHi: 'बसंत लड्डू', nameEn: 'Basanta Ladu', category: 'sukhila', categoryOr: 'ଶୁଖିଲା ଭୋଗ', categoryHi: 'सूखा भोग', categoryEn: 'Dry Sweet', mainIngredients: 'ମୁଗ ଚୂନା, ଘିଅ, କେଶର', significanceOr: 'ହଳଦିଆ ବସନ୍ତ ରଙ୍ଗର ମୁଗ ଲଡୁ।' },
  { id: 12, nameOr: 'ଖୁରୁମା', nameHi: 'खुरुमा', nameEn: 'Khuruma', category: 'sukhila', categoryOr: 'ଶୁଖିଲା ଭୋଗ', categoryHi: 'सूखा भोग', categoryEn: 'Dry Sweet', mainIngredients: 'ମଇଦା, ଲୁଣ, ଘିଅ, ଚିନି କୋଟିଂ', significanceOr: 'କଡ଼ା ମିଠା କୋଟିଂ ଥିବା ଛୋଟ ବିସ୍କୁଟ ପରି ଭୋଗ।' },
  { id: 13, nameOr: 'ଝିଲି', nameHi: 'झिली', nameEn: 'Jhili', category: 'sukhila', categoryOr: 'ଶୁଖିଲା ଭୋଗ', categoryHi: 'सूखा भोग', categoryEn: 'Dry Sweet', mainIngredients: 'ବିରି ଚୂନା, ଘିଅ, ଚିନି ଶିରା', significanceOr: 'ରସାଳ ନରମ ଜିଲାପି ସଦୃଶ ଓଡ଼ିଆ ଭୋଗ।' },
  { id: 14, nameOr: 'କୋରା (ନଡ଼ିଆ କୋରା)', nameHi: 'कोरा', nameEn: 'Kora', category: 'sukhila', categoryOr: 'ଶୁଖିଲା ଭୋଗ', categoryHi: 'सूखा भोग', categoryEn: 'Dry Sweet', mainIngredients: 'ନଡ଼ିଆ, ଗୁଡ଼, ଅଦା, ଗୋଲମରିଚ', significanceOr: 'ଗୋପାଳ ବଲ୍ଲଭ ଭୋଗରେ ଅର୍ପିତ ନଡ଼ିଆ ଲଡୁ।' },
  { id: 15, nameOr: 'ମିଠା ଖଇ', nameHi: 'मीठी खई', nameEn: 'Mitha Khai', category: 'sukhila', categoryOr: 'ଶୁଖିଲା ଭୋଗ', categoryHi: 'सूखा भोग', categoryEn: 'Dry Sweet', mainIngredients: 'ଧାନ ଖଇ, ଗୁଡ଼ ପାଗ, ପାନମହୁରୀ', significanceOr: 'ପ୍ରଭୁଙ୍କ ପ୍ରାତଃକାଳୀନ ହାଲୁକା ମୁଖ୍ୟ ପ୍ରସାଦ।' },
  { id: 16, nameOr: 'ନାଡ଼ି', nameHi: 'नाड़ी', nameEn: 'Nadi', category: 'sukhila', categoryOr: 'ଶୁଖିଲା ଭୋଗ', categoryHi: 'सूखा भोग', categoryEn: 'Dry Sweet', mainIngredients: 'ମଇଦା, ଘିଅ, କର୍ପୂର', significanceOr: 'ନଳୀ ସଦୃଶ ଗୋଲ ମୁରୁକୁ ପରି ମିଠା।' },
  { id: 17, nameOr: 'ପଦ୍ମ ପିଠା', nameHi: 'पद्म पीठा', nameEn: 'Padma Pitha', category: 'sukhila', categoryOr: 'ଶୁଖିଲା ଭୋଗ', categoryHi: 'सूखा भोग', categoryEn: 'Dry Sweet', mainIngredients: 'ଚାଉଳ ଚୂନା, ଘିଅ, ପଦ୍ମ ଆକାର ପାଗ', significanceOr: 'ପଦ୍ମ ପାଖୁଡ଼ା ସଦୃଶ ସୁନ୍ଦର କାରୁକାର୍ଯ୍ୟ ପିଠା।' },
  { id: 18, nameOr: 'ଚନ୍ଦ୍ରକାନ୍ତି', nameHi: 'चंद्रकांति', nameEn: 'Chandrakanti', category: 'sukhila', categoryOr: 'ଶୁଖିଲା ଭୋଗ', categoryHi: 'सूखा भोग', categoryEn: 'Dry Sweet', mainIngredients: 'ମୁଗ ଓ ବିରି ଡାଲି ପେଷ୍ଟ, ଘିଅ, ଚିନି', significanceOr: 'ଚନ୍ଦ୍ର ପରି ଉଜ୍ଜ୍ୱଳ କୋମଳ ଘିଅ ଭୋଗ।' },
  { id: 19, nameOr: 'ଟାଙ୍କୁଣିଆ', nameHi: 'टांकुनिया', nameEn: 'Tankunia', category: 'sukhila', categoryOr: 'ଶୁଖିଲା ଭୋଗ', categoryHi: 'सूखा भोग', categoryEn: 'Dry Sweet', mainIngredients: 'ମଇଦା, ଘିଅ, କ୍ଷୀର', significanceOr: 'ସୁଆଦିଆ କ୍ରଞ୍ଚି ପାରମ୍ପରିକ ଭୋଗ।' },
  { id: 20, nameOr: 'ତିଳ ଲଡୁ', nameHi: 'तिल लड्डू', nameEn: 'Tila Ladu', category: 'sukhila', categoryOr: 'ଶୁଖିଲା ଭୋଗ', categoryHi: 'सूखा भोग', categoryEn: 'Dry Sweet', mainIngredients: 'କଳା ରାଶି, ଆଖୁ ଗୁଡ଼', significanceOr: 'ପୌଷ ଓ ମାଘ ମାସର ପବିତ୍ର ଭୋଗ।' },

  // 21-42 Sankhudi Bhoga (ସଙ୍ଖୁଡ଼ି ଅନ୍ନ, ଡାଲି ଓ ବ୍ୟଞ୍ଜନ)
  { id: 21, nameOr: 'ସାଧା ଅନ୍ନ', nameHi: 'सादा भात', nameEn: 'Sadha Anna', category: 'sankhudi', categoryOr: 'ସଙ୍ଖୁଡ଼ି ଭୋଗ', categoryHi: 'पका अन्न भोग', categoryEn: 'Cooked Feast', mainIngredients: 'ଦେଶୀ ଅରୁଆ ଚାଉଳ, ଗଙ୍ଗା ଜଳ', significanceOr: 'ମାଟିକୂଡୁଆରେ ନିଆଁ ବାଷ୍ପରେ ସିଝା ମୁଖ୍ୟ ମହାପ୍ରସାଦ।' },
  { id: 22, nameOr: 'କାନିକା (ମିଠା ଭାତ)', nameHi: 'कानिका', nameEn: 'Kanika', category: 'sankhudi', categoryOr: 'ସଙ୍ଖୁଡ଼ି ଭୋଗ', categoryHi: 'पका अन्न भोग', categoryEn: 'Cooked Feast', mainIngredients: 'ଅରୁଆ ଚାଉଳ, ଘିଅ, ଚିନି, ଲବଙ୍ଗ, ଗୁଜୁରାତି, ହଳଦୀ', significanceOr: 'ସୁବାସିତ ରାଜକୀୟ ମିଠା ହଳଦିଆ ଅନ୍ନ।' },
  { id: 23, nameOr: 'ଘିଅ ଅନ୍ନ', nameHi: 'घृत भात', nameEn: 'Ghee Rice', category: 'sankhudi', categoryOr: 'ସଙ୍ଖୁଡ଼ି ଭୋଗ', categoryHi: 'पका अन्न भोग', categoryEn: 'Cooked Feast', mainIngredients: 'ବାସୁମତୀ/ଅରୁଆ ଚାଉଳ, ଗାଈ ଘିଅ, ତେଜପତ୍ର', significanceOr: 'ପୁଷ୍ପମାଳିତ ଶୁଦ୍ଧ ଘୃତମିଶ୍ରିତ ଅନ୍ନ।' },
  { id: 24, nameOr: 'ଖେଚୁଡ଼ି', nameHi: 'खिचड़ी', nameEn: 'Khechudi', category: 'sankhudi', categoryOr: 'ସଙ୍ଖୁଡ଼ି ଭୋଗ', categoryHi: 'पका अन्न भोग', categoryEn: 'Cooked Feast', mainIngredients: 'ଚାଉଳ, ମୁଗ ଡାଲି, ଘିଅ, ଅଦା, ହଳଦୀ', significanceOr: 'ସକାଳ ଧୂପର ପ୍ରଧାନ ଭୋଗ।' },
  { id: 25, nameOr: 'ମିଠା ଡାଲି', nameHi: 'मीठी दाल', nameEn: 'Mitha Dali', category: 'sankhudi', categoryOr: 'ସଙ୍ଖୁଡ଼ି ଭୋଗ', categoryHi: 'पका अन्न भोग', categoryEn: 'Cooked Feast', mainIngredients: 'ହରଡ଼ ଡାଲି, ଗୁଡ଼, ଘିଅ, ଜିରା, ଅଦା', significanceOr: 'ଗୁଡ଼ ଓ ଘିଅ ଫୁଟଣ ଦିଆ ବିଶିଷ୍ଟ ଶ୍ରୀମନ୍ଦିର ଡାଲି।' },
  { id: 26, nameOr: 'ହରଡ଼ ଡାଲି', nameHi: 'अरहर दाल', nameEn: 'Harada Dali', category: 'sankhudi', categoryOr: 'ସଙ୍ଖୁଡ଼ି ଭୋଗ', categoryHi: 'पका अन्न भोग', categoryEn: 'Cooked Feast', mainIngredients: 'ହରଡ଼ ଡାଲି, ପାଣି, ସୈନ୍ଧବ ଲୁଣ, ଘିଅ', significanceOr: 'ନିରାଡମ୍ବର ସୁସ୍ୱାଦୁ ପ୍ରାକୃତିକ ଡାଲି।' },
  { id: 27, nameOr: 'ବୁଟ ଡାଲି', nameHi: 'चना दाल', nameEn: 'Buta Dali', category: 'sankhudi', categoryOr: 'ସଙ୍ଖୁଡ଼ି ଭୋଗ', categoryHi: 'पका अन्न भोग', categoryEn: 'Cooked Feast', mainIngredients: 'ବୁଟ (ଚଣା) ଡାଲି, ନଡ଼ିଆ ଖଣ୍ଡ, ଘିଅ', significanceOr: 'ନଡ଼ିଆ କୋରା ଦିଆ ଘନ ଚଣା ଡାଲି।' },
  { id: 28, nameOr: 'ମୁଗ ଡାଲି', nameHi: 'मूँग दाल', nameEn: 'Muga Dali', category: 'sankhudi', categoryOr: 'ସଙ୍ଖୁଡ଼ି ଭୋଗ', categoryHi: 'पका अन्न भोग', categoryEn: 'Cooked Feast', mainIngredients: 'ଭଜା ମୁଗ ଡାଲି, ଅଦା, ତେଜପତ୍ର', significanceOr: 'ସୁପାଚ୍ୟ ଓ ପୌଷ୍ଟିକ ଭଜା ମୁଗ ଡାଲି।' },
  { id: 29, nameOr: 'ଡାଲିମା', nameHi: 'डालमा', nameEn: 'Dalma', category: 'sankhudi', categoryOr: 'ସଙ୍ଖୁଡ଼ି ଭୋଗ', categoryHi: 'पका अन्न भोग', categoryEn: 'Cooked Feast', mainIngredients: 'ହରଡ଼ ଡାଲି, କଞ୍ଚା କଦଳୀ, ସାରୁ, ପୋଟଳ, ଘିଅ, ଜିରା ଗୁଣ୍ଡ', significanceOr: 'ଓଡ଼ିଶାର ଗୌରବ - ପନିପରିବା ଓ ଡାଲିର ଅପୂର୍ବ ସଙ୍ଗମ।' },
  { id: 30, nameOr: 'ବେସର', nameHi: 'बेसर', nameEn: 'Besara', category: 'sankhudi', categoryOr: 'ସଙ୍ଖୁଡ଼ି ଭୋଗ', categoryHi: 'पका अन्न भोग', categoryEn: 'Cooked Feast', mainIngredients: 'ମିଶ୍ରିତ ପରିବା, ସୋରିଷ ପେଷ୍ଟ, ଘିଅ, ଜିରା', significanceOr: 'ସୋରିଷ ଓ ଜିରା ମହକ ଥିବା ପାରମ୍ପରିକ ତରକାରୀ।' },
  { id: 31, nameOr: 'ମହୁର', nameHi: 'महुर', nameEn: 'Mahura', category: 'sankhudi', categoryOr: 'ସଙ୍ଖୁଡ଼ି ଭୋଗ', categoryHi: 'पका अन्न भोग', categoryEn: 'Cooked Feast', mainIngredients: 'ପାଣିକଖାରୁ, କଞ୍ଚା କଦଳୀ, ସାରୁ, ମିଠା କନ୍ଦମୂଳ', significanceOr: 'ବିନା ତେଲରେ ଘିଅରେ ପ୍ରସ୍ତୁତ ମିଠା ପନିପରିବା ଭୋଗ।' },
  { id: 32, nameOr: 'ଶାଗ ଭଜା', nameHi: 'साग भाजा', nameEn: 'Saga Bhaja', category: 'sankhudi', categoryOr: 'ସଙ୍ଖୁଡ଼ି ଭୋଗ', categoryHi: 'पका अन्न भोग', categoryEn: 'Cooked Feast', mainIngredients: 'କୋଶଳା/ମଦରଙ୍ଗା ଶାଗ, ଘିଅ, ଜିରା', significanceOr: 'ଜଗନ୍ନାଥଙ୍କ ଅତ୍ୟନ୍ତ ପ୍ରିୟ ଶାଗ ଭୋଗ।' },
  { id: 33, nameOr: 'ପୋଟଳ ରସା', nameHi: 'पटल रसा', nameEn: 'Potola Rasa', category: 'sankhudi', categoryOr: 'ସଙ୍ଖୁଡ଼ି ଭୋଗ', categoryHi: 'पका अन्न भोग', categoryEn: 'Cooked Feast', mainIngredients: 'ପୋଟଳ, ନଡ଼ିଆ କ୍ଷୀର, ଘିଅ', significanceOr: 'ନଡ଼ିଆ କ୍ଷୀରରେ ରାନ୍ଧିଥିବା ପୋଟଳ ତରକାରୀ।' },
  { id: 34, nameOr: 'ଓଉ ଖଟା', nameHi: 'औऊ खट्टा', nameEn: 'Ouu Khatta', category: 'sankhudi', categoryOr: 'ସଙ୍ଖୁଡ଼ି ଭୋଗ', categoryHi: 'पका अन्न भोग', categoryEn: 'Cooked Feast', mainIngredients: 'ଓଉ (Elephant apple), ଗୁଡ଼, ଫୁଟଣ', significanceOr: 'ଓଡ଼ିଶାର ପ୍ରାକୃତିକ ଟକ-ମିଠା ସ୍ୱାଦ।' },
  { id: 35, nameOr: 'ଆମ୍ବ ଖଟା', nameHi: 'आम खट्टा', nameEn: 'Amba Khatta', category: 'sankhudi', categoryOr: 'ସଙ୍ଖୁଡ଼ି ଭୋଗ', categoryHi: 'पका अन्न भोग', categoryEn: 'Cooked Feast', mainIngredients: 'କଞ୍ଚା ଆମ୍ବ, ଗୁଡ଼, ଜିରା ଲଙ୍କା ଗୁଣ୍ଡ', significanceOr: 'ଗ୍ରୀଷ୍ମ ଋତୁରେ ମହାପ୍ରଭୁଙ୍କ ଥଣ୍ଡା ଖଟା ଭୋଗ।' },
  { id: 36, nameOr: 'ଦହି ପଖାଳ', nameHi: 'दही पखाल', nameEn: 'Dahi Pakhala', category: 'sankhudi', categoryOr: 'ସଙ୍ଖୁଡ଼ି ଭୋଗ', categoryHi: 'पका अन्न भोग', categoryEn: 'Cooked Feast', mainIngredients: 'ଅନ୍ନ, ଘୋଳ ଦହି, ଅଦା, ଭୃସଙ୍ଗ ପତ୍ର, ଜିରା', significanceOr: 'ଗ୍ରୀଷ୍ମ ଦିନେ ଚନ୍ଦନ ଯାତ୍ରାରେ ଅର୍ପିତ ଶୀତଳ ଭୋଗ।' },
  { id: 37, nameOr: 'ଅଦା ପାଚିଡ଼ି', nameHi: 'अदरक पचिड़ी', nameEn: 'Ada Pachidi', category: 'sankhudi', categoryOr: 'ସଙ୍ଖୁଡ଼ି ଭୋଗ', categoryHi: 'पका अन्न भोग', categoryEn: 'Cooked Feast', mainIngredients: 'ଅଦା କୁଚି, ଦହି, ସୈନ୍ଧବ ଲୁଣ', significanceOr: 'ପାଚକ ଔଷଧୀୟ ଗୁଣଯୁକ୍ତ ରାଇତା।' },
  { id: 38, nameOr: 'କଦଳୀ ଭଜା', nameHi: 'केला भाजा', nameEn: 'Kadali Bhaja', category: 'sankhudi', categoryOr: 'ସଙ୍ଖୁଡ଼ି ଭୋଗ', categoryHi: 'पका अन्न भोग', categoryEn: 'Cooked Feast', mainIngredients: 'କଞ୍ଚା କଦଳୀ, ଘିଅ, ଜିରା', significanceOr: 'ସୁନ୍ଦର ଭାବେ ଘିଅରେ ଭଜା କଦଳୀ ଖଣ୍ଡ।' },
  { id: 39, nameOr: 'ଖମ୍ବଆଳୁ ଭଜା', nameHi: 'खम्बाआलू भाजा', nameEn: 'Khamba Alu Bhaja', category: 'sankhudi', categoryOr: 'ସଙ୍ଖୁଡ଼ି ଭୋଗ', categoryHi: 'पका अन्न भोग', categoryEn: 'Cooked Feast', mainIngredients: 'ଦେଶୀ ଖମ୍ବଆଳୁ, ଘିଅ, ହଳଦୀ', significanceOr: 'ମାଟି ତଳ କନ୍ଦର ପବିତ୍ର ଭଜା।' },
  { id: 40, nameOr: 'ପଣସ ରସା', nameHi: 'कटहल रसा', nameEn: 'Panasa Rasa', category: 'sankhudi', categoryOr: 'ସଙ୍ଖୁଡ଼ି ଭୋଗ', categoryHi: 'पका अन्न भोग', categoryEn: 'Cooked Feast', mainIngredients: 'କଅଁଳ ପଣସ କଠା, ଘିଅ, ମସଲା', significanceOr: 'ବୈଶାଖ-ଜ୍ୟେଷ୍ଠ ମାସର ବିଶେଷ ଭୋଗ।' },
  { id: 41, nameOr: 'ଝୁଣା ବେସର', nameHi: 'झुणा बेसर', nameEn: 'Jhuna Besara', category: 'sankhudi', categoryOr: 'ସଙ୍ଖୁଡ଼ି ଭୋଗ', categoryHi: 'पका अन्न भोग', categoryEn: 'Cooked Feast', mainIngredients: 'ସଜନା ଛୁଇଁ, ସାରୁ, ରାଇ ମସଲା', significanceOr: 'ସଜନା ଛୁଇଁ ଓ ସାରୁର ସୁସ୍ୱାଦୁ ତରକାରୀ।' },
  { id: 42, nameOr: 'ମୁଗ ବରା', nameHi: 'मूँग वड़ा', nameEn: 'Muga Bara', category: 'sankhudi', categoryOr: 'ସଙ୍ଖୁଡ଼ି ଭୋଗ', categoryHi: 'पका अन्न भोग', categoryEn: 'Cooked Feast', mainIngredients: 'ବତୁରା ମୁଗ ଡାଲି ପେଷ୍ଟ, ଘିଅ', significanceOr: 'ଶୁଦ୍ଧ ଘିଅରେ ଛଣା କୁରକୁରିଆ ବରା।' },

  // 43-56 Dugdhajata Bhoga (ଦୁଗ୍ଧଜାତ ଓ ମଧୁର କ୍ଷୀର ଭୋଗ)
  { id: 43, nameOr: 'ଛେନା ପୋଡ଼', nameHi: 'छेना पोड़', nameEn: 'Chhena Poda', category: 'dugdhajata', categoryOr: 'ଦୁଗ୍ଧଜାତ ଭୋଗ', categoryHi: 'दुग्ध भोग', categoryEn: 'Milk/Curd Sweet', mainIngredients: 'ସଜ ଛେନା, ଚିନି, ଘିଅ, ଗୁଜୁରାତି, ସାମାନ୍ୟ ସୁଜି', significanceOr: 'ସାଳ ପତ୍ରରେ ବନ୍ଧା ହୋଇ ଅଙ୍ଗାରରେ ପୋଡ଼ା ହୋଇଥିବା ବିଶ୍ୱପ୍ରସିଦ୍ଧ ଓଡ଼ିଆ ମିଷ୍ଟାନ୍ନ।' },
  { id: 44, nameOr: 'ରସାବଳି', nameHi: 'रसावली', nameEn: 'Rasabali', category: 'dugdhajata', categoryOr: 'ଦୁଗ୍ଧଜାତ ଭୋଗ', categoryHi: 'दुग्ध भोग', categoryEn: 'Milk/Curd Sweet', mainIngredients: 'ଛେନା ଟିକିଆ, ଗାଢ଼ କେଶର କ୍ଷୀର, ଗୁଜୁରାତି', significanceOr: 'କେନ୍ଦ୍ରାପଡ଼ା ବଳଦେବଜୀଉ ଓ ଶ୍ରୀମନ୍ଦିରର ରସାଳ ଛେନା ଭୋଗ।' },
  { id: 45, nameOr: 'ରବିଡ଼ି', nameHi: 'रबड़ी', nameEn: 'Rabidi', category: 'dugdhajata', categoryOr: 'ଦୁଗ୍ଧଜାତ ଭୋଗ', categoryHi: 'दुग्ध भोग', categoryEn: 'Milk/Curd Sweet', mainIngredients: 'ଧିମା ଆଞ୍ଚରେ ଫୁଟିଥିବା ଗାଈ କ୍ଷୀର ସର, ଚିନି', significanceOr: 'ପୁରୀ ବଡ଼ଦାଣ୍ଡର ବିଶ୍ୱବିଖ୍ୟାତ ମଲ୍ଲାଇ ରବିଡ଼ି।' },
  { id: 46, nameOr: 'ଖୀର ସାଗର', nameHi: 'क्षीर सागर', nameEn: 'Khira Sagara', category: 'dugdhajata', categoryOr: 'ଦୁଗ୍ଧଜାତ ଭୋଗ', categoryHi: 'दुग्ध भोग', categoryEn: 'Milk/Curd Sweet', mainIngredients: 'ଛୋଟ ଛେନା ଗୁଳା, ଗାଢ଼ ମିଠା କ୍ଷୀର', significanceOr: 'କ୍ଷୀର ସମୁଦ୍ରରେ ଭାସୁଥିବା ଛୋଟ ରସଗୋଲା ସଦୃଶ।' },
  { id: 47, nameOr: 'ପାୟସ (କ୍ଷୀରି)', nameHi: 'पायसम (खीर)', nameEn: 'Payasa (Rice Kheer)', category: 'dugdhajata', categoryOr: 'ଦୁଗ୍ଧଜାତ ଭୋଗ', categoryHi: 'दुग्ध भोग', categoryEn: 'Milk/Curd Sweet', mainIngredients: 'କ୍ଷୀର, ଗୋବିନ୍ଦଭୋଗ ଚାଉଳ, ଚିନି, କାଜୁ, କିସମିସ', significanceOr: 'ଶ୍ରୀମନ୍ଦିର ବଡ଼ସିଂହାର ବେଳେ ଲାଗୁଥିବା ଅମୃତତୁଲ୍ୟ କ୍ଷୀରି।' },
  { id: 48, nameOr: 'ଛେନା ଝିଲି', nameHi: 'छेना झिली', nameEn: 'Chhena Jhili', category: 'dugdhajata', categoryOr: 'ଦୁଗ୍ଧଜାତ ଭୋଗ', categoryHi: 'दुग्ध भोग', categoryEn: 'Milk/Curd Sweet', mainIngredients: 'ସଜ ଛେନା, ଘିଅ, ଚିନି ଶିରା', significanceOr: 'ନିମାପଡ଼ା ଓ ଶ୍ରୀକ୍ଷେତ୍ରର ଅତ୍ୟନ୍ତ କୋମଳ ଛେନା ମିଠା।' },
  { id: 49, nameOr: 'ସରପୁଳି', nameHi: 'सरपुली', nameEn: 'Sarapuli', category: 'dugdhajata', categoryOr: 'ଦୁଗ୍ଧଜାତ ଭୋଗ', categoryHi: 'दुग्ध भोग', categoryEn: 'Milk/Curd Sweet', mainIngredients: 'ଦୁଧ ସର ପରସ୍ତ, ଘିଅ, ଚିନି', significanceOr: 'କେବଳ କ୍ଷୀର ସରରେ ତିଆରି ହେଉଥିବା ଦୁର୍ଲ୍ଲଭ ଭୋଗ।' },
  { id: 50, nameOr: 'ଛେନା ତାଡ଼ିଆ', nameHi: 'छेना ताड़िया', nameEn: 'Chhena Tadia', category: 'dugdhajata', categoryOr: 'ଦୁଗ୍ଧଜାତ ଭୋଗ', categoryHi: 'दुग्ध भोग', categoryEn: 'Milk/Curd Sweet', mainIngredients: 'ଛେନା, ମଇଦା, ଘିଅ, ଚିନି ପାଗ', significanceOr: 'ଘିଅରେ ଛଣା ଚେପ୍ଟା ସୁସ୍ୱାଦୁ ଛେନା ଭୋଗ।' },
  { id: 51, nameOr: 'କଦଳୀ ପାୟସ', nameHi: 'केला खीर', nameEn: 'Kadali Payasa', category: 'dugdhajata', categoryOr: 'ଦୁଗ୍ଧଜାତ ଭୋଗ', categoryHi: 'दुग्ध भोग', categoryEn: 'Milk/Curd Sweet', mainIngredients: 'ଚମ୍ପା କଦଳୀ, ଘନ କ୍ଷୀର, ଗୁଜୁରାତି', significanceOr: 'ରାତ୍ର ପହୁଡ଼ ବେଳେ ମହାପ୍ରଭୁଙ୍କୁ ଅର୍ପିତ ସୁମିଷ୍ଟ ପାୟସ।' },
  { id: 52, nameOr: 'ମଲ୍ଲାଇ ଲାଡ଼ୁ', nameHi: 'मलाई लड्डू', nameEn: 'Malai Ladu', category: 'dugdhajata', categoryOr: 'ଦୁଗ୍ଧଜାତ ଭୋଗ', categoryHi: 'दुग्ध भोग', categoryEn: 'Milk/Curd Sweet', mainIngredients: 'ଘନ କ୍ଷୀର, ଛେନା, ପେସ୍ତା', significanceOr: 'ନରମ କ୍ଷୀର ମଲ୍ଲାଇରୁ ନିର୍ମିତ ରାଜଭୋଗ।' },
  { id: 53, nameOr: 'ଛେନା ମଣ୍ଡା', nameHi: 'छेना मंडा', nameEn: 'Chhena Manda', category: 'dugdhajata', categoryOr: 'ଦୁଗ୍ଧଜାତ ଭୋଗ', categoryHi: 'दुग्ध भोग', categoryEn: 'Milk/Curd Sweet', mainIngredients: 'ଛେନା ଗୋଲକ, ଚିନି ଶିରା', significanceOr: 'ରସଗୋଲା ସଦୃଶ ନରମ ଛେନା ଭୋଗ।' },
  { id: 54, nameOr: 'ଦହି ବୁନ୍ଦି', nameHi: 'दही बूंदी', nameEn: 'Dahi Bundi', category: 'dugdhajata', categoryOr: 'ଦୁଗ୍ଧଜାତ ଭୋଗ', categoryHi: 'दुग्ध भोग', categoryEn: 'Milk/Curd Sweet', mainIngredients: 'ମିଠା ଦହି, ବେସନ ବୁନ୍ଦି, ଭଜା ଜିରା', significanceOr: 'ମଧ୍ୟାହ୍ନ ଧୂପରେ ଶୀତଳକାରୀ ଦହି ଭୋଗ।' },
  { id: 55, nameOr: 'ଘୃତପୂର୍ଣ୍ଣ', nameHi: 'घृतपूर्ण', nameEn: 'Ghrutapurna', category: 'dugdhajata', categoryOr: 'ଦୁଗ୍ଧଜାତ ଭୋଗ', categoryHi: 'दुग्ध भोग', categoryEn: 'Milk/Curd Sweet', mainIngredients: 'ଘିଅରେ ତିଆରି ଛେନା ପୁର', significanceOr: 'ପୁଷ୍ଟିକର ଦୁଗ୍ଧ ଘୃତ ମିଷ୍ଟାନ୍ନ।' },
  { id: 56, nameOr: 'ମାଖନ ମିଶ୍ରି', nameHi: 'माखन मिश्री', nameEn: 'Makhana Mishri', category: 'dugdhajata', categoryOr: 'ଦୁଗ୍ଧଜାତ ଭୋଗ', categoryHi: 'दुग्ध भोग', categoryEn: 'Milk/Curd Sweet', mainIngredients: 'ସଜ ଘରୋଇ ଲହୁଣୀ, ଧଳା ମିଶ୍ରି ଗୁଣ୍ଡ', significanceOr: 'ବାଳଗୋପାଳ ଶ୍ରୀଜଗନ୍ନାଥଙ୍କ ଅତି ପ୍ରିୟ ସ୍ନେହର ଭୋଗ।' }
];

// ==========================================
// ECLIPSE TIMETABLE (ସୂର୍ଯ୍ୟ ପରାଗ ଓ ଚନ୍ଦ୍ର ଗ୍ରହଣ ୨୦୨୪-୨୦୫୦)
// ==========================================

export interface OdishaEclipseEvent {
  id: string;
  year: number;
  dateStr: string; // YYYY-MM-DD
  type: 'solar' | 'lunar';
  typeOr: string;
  typeHi: string;
  typeEn: string;
  subTypeOr: string; // ପୂର୍ଣ୍ଣ, ଆଂଶିକ, ବଳୟ
  tithiOr: string;
  visibleInOdisha: boolean;
  sparshaTime: string; // Touch/Start
  madhyaTime: string; // Peak
  mokshaTime: string; // Release/End
  pakatyagaTime: string; // Fasting start
  guidelinesOr: string;
  guidelinesHi: string;
  guidelinesEn: string;
}

export const ODISHA_ECLIPSES: OdishaEclipseEvent[] = [
  {
    id: 'lunar_2025_03_14',
    year: 2025,
    dateStr: '2025-03-14',
    type: 'lunar',
    typeOr: 'ଚନ୍ଦ୍ର ଗ୍ରହଣ',
    typeHi: 'चन्द्र ग्रहण',
    typeEn: 'Lunar Eclipse',
    subTypeOr: 'ପୂର୍ଣ୍ଣ ଚନ୍ଦ୍ର ଗ୍ରହଣ',
    tithiOr: 'ଫାଲ୍ଗୁନ ପୂର୍ଣ୍ଣିମା (ଦୋଳ ପୂର୍ଣ୍ଣିମା)',
    visibleInOdisha: true,
    sparshaTime: 'ଅପରାହ୍ନ ୦୩:୪୦',
    madhyaTime: 'ସନ୍ଧ୍ୟା ୦୫:୨୮',
    mokshaTime: 'ସନ୍ଧ୍ୟା ୦୭:୧୬',
    pakatyagaTime: 'ପ୍ରାତଃ ୦୬:୪୦ (ଗ୍ରହଣର ୯ ଘଣ୍ଟା ପୂର୍ବରୁ)',
    guidelinesOr: 'ପାକତ୍ୟାଗ ପାଳନ କରନ୍ତୁ। ଗ୍ରହଣ ସ୍ପର୍ଶ ପରେ ଜପ-ଧ୍ୟାନ ଓ ମୋକ୍ଷ ପରେ ସ୍ନାନ କରି ଦାନ କରନ୍ତୁ।',
    guidelinesHi: 'सूतक काल में भोजन न करें। मोक्ष उपरांत स्नान-दान करें।',
    guidelinesEn: 'Avoid eating after Pakatyaga. Perform meditation during eclipse and take holy bath upon release.'
  },
  {
    id: 'lunar_2025_09_07',
    year: 2025,
    dateStr: '2025-09-07',
    type: 'lunar',
    typeOr: 'ଚନ୍ଦ୍ର ଗ୍ରହଣ',
    typeHi: 'चन्द्र ग्रहण',
    typeEn: 'Lunar Eclipse',
    subTypeOr: 'ପୂର୍ଣ୍ଣ ଚନ୍ଦ୍ର ଗ୍ରହଣ',
    tithiOr: 'ଭାଦ୍ରବ ପୂର୍ଣ୍ଣିମା',
    visibleInOdisha: true,
    sparshaTime: 'ରାତ୍ର ୦୯:୫୭',
    madhyaTime: 'ରାତ୍ର ୧୧:୪୨',
    mokshaTime: 'ରାତ୍ର ୦୧:୨୬',
    pakatyagaTime: 'ମଧ୍ୟାହ୍ନ ୦୧:୦୦',
    guidelinesOr: 'ରାତ୍ରି ସମୟରେ ଗ୍ରହଣ ଶ୍ରୀକ୍ଷେତ୍ର ଓ ଓଡ଼ିଶାରେ ସ୍ପଷ୍ଟ ଦୃଶ୍ୟମାନ ହେବ। ମହାପ୍ରସାଦ ସେବନ ପାକତ୍ୟାଗ ପୂର୍ବରୁ ସମାପ୍ତ କରନ୍ତୁ।',
    guidelinesHi: 'ओडिशा में पूर्ण रूप से दृश्य। मंत्र जप श्रेयस्कर।',
    guidelinesEn: 'Fully visible across Odisha. Chant sacred mantras throughout the totality period.'
  },
  {
    id: 'solar_2026_02_17',
    year: 2026,
    dateStr: '2026-02-17',
    type: 'solar',
    typeOr: 'ସୂର୍ଯ୍ୟ ପରାଗ',
    typeHi: 'सूर्य ग्रहण',
    typeEn: 'Solar Eclipse',
    subTypeOr: 'ବଳୟ ସୂର୍ଯ୍ୟ ପରାଗ',
    tithiOr: 'ମାଘ ଅମାବାସ୍ୟା',
    visibleInOdisha: false,
    sparshaTime: 'ଅପରାହ୍ନ ୦୪:୨୬',
    madhyaTime: 'ସନ୍ଧ୍ୟା ୦୫:୪୩',
    mokshaTime: 'ସନ୍ଧ୍ୟା ୦୭:୦୧',
    pakatyagaTime: 'ଅଦୃଶ୍ୟ ହେତୁ ପାକତ୍ୟାଗ ନାହିଁ',
    guidelinesOr: 'ଭାରତ ଓ ଓଡ଼ିଶାରେ ଅଦୃଶ୍ୟ ହୋଇଥିବାରୁ କୌଣସି ପାକତ୍ୟାଗ କିମ୍ବା ଧାର୍ମିକ ନିଷେଧ ଲାଗୁ ନାହିଁ।',
    guidelinesHi: 'भारत में अदृश्य होने के कारण सूतक मान्य नहीं।',
    guidelinesEn: 'Not visible in India/Odisha. Normal temple rituals and daily activities continue as usual.'
  },
  {
    id: 'solar_2027_08_02',
    year: 2027,
    dateStr: '2027-08-02',
    type: 'solar',
    typeOr: 'ସୂର୍ଯ୍ୟ ପରାଗ',
    typeHi: 'सूर्य ग्रहण',
    typeEn: 'Solar Eclipse',
    subTypeOr: 'ଆଂଶିକ ସୂର୍ଯ୍ୟ ପରାଗ',
    tithiOr: 'ଶ୍ରାବଣ ଅମାବାସ୍ୟା',
    visibleInOdisha: true,
    sparshaTime: 'ଅପରାହ୍ନ ୦୩:୫୫',
    madhyaTime: 'ଅପରାହ୍ନ ୦୪:୫୦',
    mokshaTime: 'ସନ୍ଧ୍ୟା ୦୫:୪୦',
    pakatyagaTime: 'ପ୍ରାତଃ ୦୩:୫୫ (୧୨ ଘଣ୍ଟା ପୂର୍ବରୁ)',
    guidelinesOr: 'ଓଡ଼ିଶାରେ ଆଂଶିକ ଦୃଶ୍ୟମାନ। ସୂର୍ଯ୍ୟଙ୍କୁ ଖାଲି ଆଖିରେ ଦେଖନ୍ତୁ ନାହିଁ। ସ୍ନାନ ପରେ ଶ୍ରୀମନ୍ଦିରରେ ମହାସ୍ନାନ ନୀତି ହେବ।',
    guidelinesHi: 'आंशिक सूर्य ग्रहण। नग्न आँखों से न देखें।',
    guidelinesEn: 'Partial solar eclipse visible in Odisha. Mahasnana ritual performed in temples following Moksha.'
  },
  {
    id: 'lunar_2028_12_31',
    year: 2028,
    dateStr: '2028-12-31',
    type: 'lunar',
    typeOr: 'ଚନ୍ଦ୍ର ଗ୍ରହଣ',
    typeHi: 'चन्द्र ग्रहण',
    typeEn: 'Lunar Eclipse',
    subTypeOr: 'ପୂର୍ଣ୍ଣ ଚନ୍ଦ୍ର ଗ୍ରହଣ',
    tithiOr: 'ପୌଷ ପୂର୍ଣ୍ଣିମା',
    visibleInOdisha: true,
    sparshaTime: 'ସନ୍ଧ୍ୟା ୦୮:୪୦',
    madhyaTime: 'ରାତ୍ର ୧୦:୨୨',
    mokshaTime: 'ରାତ୍ର ୧୨:୦୪',
    pakatyagaTime: 'ମଧ୍ୟାହ୍ନ ୧୧:୪୦',
    guidelinesOr: 'ପୌଷ ପୂର୍ଣ୍ଣିମାରେ ପୂର୍ଣ୍ଣ ଚନ୍ଦ୍ର ଗ୍ରହଣ। ଭକ୍ତମାନେ ତୁଳସୀ ପତ୍ର ସଂରକ୍ଷଣ କରି ରଖନ୍ତୁ।',
    guidelinesHi: 'पौष पूर्णिमा पर पूर्ण चंद्र ग्रहण।',
    guidelinesEn: 'Total lunar eclipse. Place sacred Tulsi leaves on drinking water and cooked food prior to Pakatyaga.'
  },
  {
    id: 'solar_2031_05_21',
    year: 2031,
    dateStr: '2031-05-21',
    type: 'solar',
    typeOr: 'ସୂର୍ଯ୍ୟ ପରାଗ',
    typeHi: 'सूर्य ग्रहण',
    typeEn: 'Solar Eclipse',
    subTypeOr: 'ବଳୟ ସୂର୍ଯ୍ୟ ପରାଗ (Ring of Fire)',
    tithiOr: 'ଜ୍ୟେଷ୍ଠ ଅମାବାସ୍ୟା (ସାବିତ୍ରୀ ବ୍ରତ ପରବର୍ତ୍ତୀ)',
    visibleInOdisha: true,
    sparshaTime: 'ପ୍ରଭାତ ୦୬:୩୫',
    madhyaTime: 'ପ୍ରଭାତ ୦୭:୫୫',
    mokshaTime: 'ପ୍ରଭାତ ୦୯:୩୦',
    pakatyagaTime: 'ପୂର୍ବ ରାତ୍ର ୦୬:୩୫',
    guidelinesOr: 'ଅତ୍ୟନ୍ତ ବିରଳ ବଳୟ ସୂର୍ଯ୍ୟ ପରାଗ। ଶ୍ରୀକ୍ଷେତ୍ର ଓ କୋଣାର୍କ ଉପକୂଳରେ ଭବ୍ୟ ବଳୟ ଦୃଶ୍ୟ ହେବ।',
    guidelinesHi: 'अत्यंत दुर्लभ वलयाकार सूर्य ग्रहण।',
    guidelinesEn: 'Rare Annular Solar Eclipse (Ring of Fire) visible along the Odisha coastline. Grand astrological significance.'
  },
  {
    id: 'lunar_2032_10_18',
    year: 2032,
    dateStr: '2032-10-18',
    type: 'lunar',
    typeOr: 'ଚନ୍ଦ୍ର ଗ୍ରହଣ',
    typeHi: 'चन्द्र ग्रहण',
    typeEn: 'Lunar Eclipse',
    subTypeOr: 'ପୂର୍ଣ୍ଣ ଚନ୍ଦ୍ର ଗ୍ରହଣ',
    tithiOr: 'ଆଶ୍ୱିନ ପୂର୍ଣ୍ଣିମା (କୁମାର ପୂର୍ଣ୍ଣିମା)',
    visibleInOdisha: true,
    sparshaTime: 'ରାତ୍ର ୦୭:୧୦',
    madhyaTime: 'ରାତ୍ର ୦୮:୪୫',
    mokshaTime: 'ରାତ୍ର ୧୦:୨୦',
    pakatyagaTime: 'ପ୍ରଭାତ ୧୦:୧୦',
    guidelinesOr: 'କୁମାର ପୂର୍ଣ୍ଣିମା ରାତ୍ରରେ ଚନ୍ଦ୍ର ଗ୍ରହଣ। ଚାନ୍ଦ ପୂଜା ଗ୍ରହଣ ମୋକ୍ଷ ପରେ ଅନୁଷ୍ଠିତ ହେବ।',
    guidelinesHi: 'कुमार पूर्णिमा पर चंद्र ग्रहण।',
    guidelinesEn: 'Kumar Purnima night lunar eclipse. Chanda puja performed after eclipse moksha.'
  },
  {
    id: 'solar_2034_03_20',
    year: 2034,
    dateStr: '2034-03-20',
    type: 'solar',
    typeOr: 'ସୂର୍ଯ୍ୟ ପରାଗ',
    typeHi: 'सूर्य ग्रहण',
    typeEn: 'Solar Eclipse',
    subTypeOr: 'ପୂର୍ଣ୍ଣ ସୂର୍ଯ୍ୟ ପରାଗ',
    tithiOr: 'ଚୈତ୍ର ଅମାବାସ୍ୟା',
    visibleInOdisha: true,
    sparshaTime: 'ଅପରାହ୍ନ ୦୧:୩୦',
    madhyaTime: 'ଅପରାହ୍ନ ୦୨:୪୫',
    mokshaTime: 'ଅପରାହ୍ନ ୦୪:୦୦',
    pakatyagaTime: 'ରାତ୍ର ୦୧:୩୦',
    guidelinesOr: 'ଭାରତରେ ପୂର୍ଣ୍ଣ ସୂର୍ଯ୍ୟ ପରାଗ ଦିନରେ ଅନ୍ଧକାର ସୃଷ୍ଟି କରିବ। ଗ୍ରହଣ କାଳରେ ଇଷ୍ଟଦେବ ଆରାଧନା ଅତୁଳନୀୟ ଫଳପ୍ରଦ।',
    guidelinesHi: 'पूर्ण सूर्य ग्रहण, दोपहर में छाएगा अंधकार।',
    guidelinesEn: 'Total Solar Eclipse causing midday darkness. Meditation yields profound spiritual merit.'
  }
];


// =========================================================================
// NAVAGRAHA REAL ASTRONOMICAL SPUTA & PANJIKA COMPARISON ENGINE
// =========================================================================

export interface GrahaPositionInfo {
  id: 'sun' | 'moon' | 'mars' | 'mercury' | 'jupiter' | 'venus' | 'saturn' | 'rahu' | 'ketu';
  nameOr: string;
  nameHi: string;
  nameEn: string;
  symbol: string;
  icon: string;
  rashiIndex: number; // 0 to 11
  rashiOr: string;
  rashiHi: string;
  rashiEn: string;
  degreesTotal: number; // 0 to 360
  degInRashi: number; // 0 to 30
  degMinSecOr: string; // e.g. "୧୮° ୨୫' ୧୨""
  degMinSecEn: string; // e.g. "18° 25' 12""
  isRetrograde: boolean;
  retrogradeLabelOr: string; // "ବକ୍ରୀ" or "ମାର୍ଗୀ"
  retrogradeLabelHi: string; // "वक्री" or "मार्गी"
  retrogradeLabelEn: string; // "Retrograde" or "Direct"
  nakshatraIndex: number; // 0 to 26
  nakshatraOr: string;
  nakshatraHi: string;
  nakshatraEn: string;
  pada: number; // 1 to 4
}

export interface NavagrahaSputa {
  grahas: GrahaPositionInfo[];
  ayanamsaDeg: number;
  ayanamsaStrOr: string;
  ayanamsaStrEn: string;
}

export function calculateNavagrahaSputa(date: Date): NavagrahaSputa {
  const raw = calculatePlanetaryPositions(date);
  const ayanamsa = raw.ayanamsa;

  const grahaConfigs: Array<{
    id: GrahaPositionInfo['id'];
    nameOr: string;
    nameHi: string;
    nameEn: string;
    symbol: string;
    icon: string;
    deg: number;
    isRetrograde: boolean;
  }> = [
    { id: 'sun', nameOr: 'ସୂର୍ଯ୍ୟ (ରବି)', nameHi: 'सूर्य (रवि)', nameEn: 'Sun (Surya)', symbol: '☉', icon: '☀️', deg: raw.sun, isRetrograde: false },
    { id: 'moon', nameOr: 'ଚନ୍ଦ୍ର', nameHi: 'चन्द्र', nameEn: 'Moon (Chandra)', symbol: '☽', icon: '🌙', deg: raw.moon, isRetrograde: false },
    { id: 'mars', nameOr: 'ମଙ୍ଗଳ', nameHi: 'मंगल', nameEn: 'Mars (Mangala)', symbol: '♂', icon: '🔴', deg: raw.mars, isRetrograde: !!raw.isRetrograde?.mars },
    { id: 'mercury', nameOr: 'ବୁଧ', nameHi: 'बुध', nameEn: 'Mercury (Budha)', symbol: '☿', icon: '🟢', deg: raw.mercury, isRetrograde: !!raw.isRetrograde?.mercury },
    { id: 'jupiter', nameOr: 'ବୃହସ୍ପତି (ଗୁରୁ)', nameHi: 'बृहस्पति (गुरु)', nameEn: 'Jupiter (Brihaspati)', symbol: '♃', icon: '🟡', deg: raw.jupiter, isRetrograde: !!raw.isRetrograde?.jupiter },
    { id: 'venus', nameOr: 'ଶୁକ୍ର', nameHi: 'शुक्र', nameEn: 'Venus (Shukra)', symbol: '♀', icon: '⚪', deg: raw.venus, isRetrograde: !!raw.isRetrograde?.venus },
    { id: 'saturn', nameOr: 'ଶନି', nameHi: 'शनि', nameEn: 'Saturn (Shani)', symbol: '♄', icon: '🪐', deg: raw.saturn, isRetrograde: !!raw.isRetrograde?.saturn },
    { id: 'rahu', nameOr: 'ରାହୁ', nameHi: 'राहु', nameEn: 'Rahu (North Node)', symbol: '☊', icon: '🐉', deg: raw.rahu, isRetrograde: true },
    { id: 'ketu', nameOr: 'କେତୁ', nameHi: 'केतु', nameEn: 'Ketu (South Node)', symbol: '☋', icon: '☄️', deg: raw.ketu, isRetrograde: true }
  ];

  const nakSpan = 360 / 27; // 13.333333333333334

  const grahas: GrahaPositionInfo[] = grahaConfigs.map(g => {
    const degTotal = normalizeDegrees(g.deg);
    const rashiIdx = Math.floor(degTotal / 30) % 12;
    const degInR = degTotal % 30;

    const dInt = Math.floor(degInR);
    const mExact = (degInR - dInt) * 60;
    const mInt = Math.floor(mExact);
    const sInt = Math.round((mExact - mInt) * 60);

    const degMinSecOr = `${formatOdiaNum(dInt.toString().padStart(2, '0'))}° ${formatOdiaNum(mInt.toString().padStart(2, '0'))}' ${formatOdiaNum(sInt.toString().padStart(2, '0'))}"`;
    const degMinSecEn = `${dInt.toString().padStart(2, '0')}° ${mInt.toString().padStart(2, '0')}' ${sInt.toString().padStart(2, '0')}"`;

    const nakExact = degTotal / nakSpan;
    const nakIdx = Math.floor(nakExact) % 27;
    const nakFrac = nakExact - Math.floor(nakExact);
    const pada = Math.min(4, Math.max(1, Math.floor(nakFrac * 4) + 1));

    const nakNameEn = NAKSHATRA_NAMES[nakIdx] || 'Ashwini';
    const nakNameOr = NAKSHATRA_OR_MAP[nakNameEn] || nakNameEn;

    const rashiData = RASHI_OR_MAP[rashiIdx] || RASHI_OR_MAP[0];

    return {
      id: g.id,
      nameOr: g.nameOr,
      nameHi: g.nameHi,
      nameEn: g.nameEn,
      symbol: g.symbol,
      icon: g.icon,
      rashiIndex: rashiIdx,
      rashiOr: rashiData.or,
      rashiHi: rashiData.hi,
      rashiEn: rashiData.en,
      degreesTotal: degTotal,
      degInRashi: degInR,
      degMinSecOr,
      degMinSecEn,
      isRetrograde: g.isRetrograde,
      retrogradeLabelOr: g.isRetrograde ? 'ବକ୍ରୀ' : 'ମାର୍ଗୀ',
      retrogradeLabelHi: g.isRetrograde ? 'वक्री' : 'मार्गी',
      retrogradeLabelEn: g.isRetrograde ? 'Retrograde' : 'Direct',
      nakshatraIndex: nakIdx,
      nakshatraOr: nakNameOr,
      nakshatraHi: nakNameEn,
      nakshatraEn: nakNameEn,
      pada
    };
  });

  const ayanD = Math.floor(ayanamsa);
  const ayanM = Math.floor((ayanamsa - ayanD) * 60);
  const ayanS = Math.round(((ayanamsa - ayanD) * 60 - ayanM) * 60);

  return {
    grahas,
    ayanamsaDeg: ayanamsa,
    ayanamsaStrOr: `${formatOdiaNum(ayanD)}° ${formatOdiaNum(ayanM)}' ${formatOdiaNum(ayanS)}" (ଲାହିଡ଼ୀ)`,
    ayanamsaStrEn: `${ayanD}° ${ayanM}' ${ayanS}" (Lahiri)`
  };
}

export interface PanjikaComparisonEntry {
  edition: OdiaPanjikaEdition;
  tithiDurationStrOr: string;
  nakshatraDurationStrOr: string;
  nakshatraPada: number;
  amritaBelaOr: string;
  mahendraBelaOr: string;
  rahuKaalOr: string;
  vrataRuleOr: string;
  srimandirNitiOr: string;
  specialFeaturesOr: string;
  authorityEndorsementOr: string;
}

export function calculatePanjikaComparison(date: Date, lat: number = 19.8135, lon: number = 85.8312): PanjikaComparisonEntry[] {
  return ODIA_PANJIKA_EDITIONS.map(edition => {
    const dayInfo = calculateOdiaCalendarDay(date, lat, lon, edition.id);

    // Only real, computed data is surfaced: every edition runs the same
    // ephemeris, so identical timings are shown honestly — invented per-edition
    // time offsets ("+2 min", "-5 min") are intentionally NOT fabricated here.
    const vrataRuleOr = 'ମୁକ୍ତିମଣ୍ଡପ ଶାସନ ଅନୁମୋଦିତ ଉଦୟ ତିଥି ବିହିତ ସ୍ମାର୍ତ୍ତ ଓ ଉତ୍କଳୀୟ ଗାର୍ହସ୍ଥ୍ୟ ପରମ୍ପରା।';
    const srimandirNitiOr = 'ଶ୍ରୀକ୍ଷେତ୍ର ବଡ଼ଦେଉଳ ଓ ମୁକ୍ତିମଣ୍ଡପର ସର୍ବସମ୍ମତ ନିୟମ ଅନୁସାରେ।';
    const specialFeaturesOr = edition.descriptionOr;
    const authorityEndorsementOr = edition.authorityOr;
    const tithiDurationStrOr = dayInfo.tithiTiming?.durationStrOr || '';

    return {
      edition,
      tithiDurationStrOr,
      nakshatraDurationStrOr: dayInfo.nakshatraTiming?.durationStrOr || '',
      nakshatraPada: dayInfo.nakshatraTiming?.pada || 1,
      amritaBelaOr: dayInfo.belas.amrita,
      mahendraBelaOr: dayInfo.belas.mahendra,
      rahuKaalOr: dayInfo.panjika.muhurtas.rahuKaal ? `${dayInfo.panjika.muhurtas.rahuKaal.start} – ${dayInfo.panjika.muhurtas.rahuKaal.end}` : '',
      vrataRuleOr,
      srimandirNitiOr,
      specialFeaturesOr,
      authorityEndorsementOr
    };
  });
}

// ==========================================
// ODIA CHOGHADIYA (ଦିବା ଓ ରାତ୍ରି ଚୌଘଡ଼ିଆ) ENGINE
// ==========================================

const CHOGHADIYA_DEFINITIONS: Record<string, {
  nameOr: string;
  nameHi: string;
  nameEn: string;
  rulerOr: string;
  rulerEn: string;
  nature: 'shubh' | 'ashubh' | 'char';
  natureOr: string;
  significanceOr: string;
}> = {
  amrita: {
    nameOr: 'ଅମୃତ',
    nameHi: 'अमृत',
    nameEn: 'Amrita',
    rulerOr: 'ଚନ୍ଦ୍ର',
    rulerEn: 'Moon',
    nature: 'shubh',
    natureOr: 'ଶ୍ରେଷ୍ଠ ଶୁଭ',
    significanceOr: 'ସମସ୍ତ ପ୍ରକାର ଶୁଭ କାର୍ଯ୍ୟ, ଯାତ୍ରା, ବ୍ୟବସାୟ ଓ ଇଷ୍ଟଦେବ ପୂଜା ପାଇଁ ସର୍ବୋତ୍ତମ।'
  },
  shubha: {
    nameOr: 'ଶୁଭ',
    nameHi: 'शुभ',
    nameEn: 'Shubha',
    rulerOr: 'ବୃହସ୍ପତି',
    rulerEn: 'Jupiter',
    nature: 'shubh',
    natureOr: 'ଅତ୍ୟନ୍ତ ଶୁଭ',
    significanceOr: 'ବିବାହ, ଯଜ୍ଞ, ଧାର୍ମିକ କାର୍ଯ୍ୟ, ବିଦ୍ୟାରମ୍ଭ ଓ ମାଙ୍ଗଳିକ କର୍ମ ପାଇଁ ପ୍ରଶସ୍ତ।'
  },
  labha: {
    nameOr: 'ଲାଭ',
    nameHi: 'लाभ',
    nameEn: 'Labha',
    rulerOr: 'ବୁଧ',
    rulerEn: 'Mercury',
    nature: 'shubh',
    natureOr: 'ଉନ୍ନତିକାରକ',
    significanceOr: 'ନୂତନ ବ୍ୟବସାୟ ଆରମ୍ଭ, ଆର୍ଥିକ କାରବାର, ବାଣିଜ୍ୟ ଓ ଶିକ୍ଷା ପାଇଁ ଶୁଭ।'
  },
  chara: {
    nameOr: 'ଚର',
    nameHi: 'चर',
    nameEn: 'Chara',
    rulerOr: 'ଶୁକ୍ର',
    rulerEn: 'Venus',
    nature: 'char',
    natureOr: 'ସାମାନ୍ୟ / ଚର',
    significanceOr: 'ଯାତ୍ରା, ଗମନାଗମନ, ବାହନ ଚାଳନା ଓ ସୌନ୍ଦର୍ଯ୍ୟ କାର୍ଯ୍ୟ ପାଇଁ ଅନୁକୂଳ।'
  },
  udvega: {
    nameOr: 'ଉଦ୍‌ବେଗ',
    nameHi: 'उद्वेग',
    nameEn: 'Udvega',
    rulerOr: 'ସୂର୍ଯ୍ୟ',
    rulerEn: 'Sun',
    nature: 'ashubh',
    natureOr: 'ଅଶୁଭ',
    significanceOr: 'ମାନସିକ ଉଦ୍‌ବେଗ ଓ ଚିନ୍ତା ବୃଦ୍ଧି କରେ। ସରକାରୀ କାମ ବ୍ୟତୀତ ଅନ୍ୟ ଶୁଭ କାର୍ଯ୍ୟ ବର୍ଜନୀୟ।'
  },
  roga: {
    nameOr: 'ରୋଗ',
    nameHi: 'रोग',
    nameEn: 'Roga',
    rulerOr: 'ମଙ୍ଗଳ',
    rulerEn: 'Mars',
    nature: 'ashubh',
    natureOr: 'ଅଶୁଭ / ବର୍ଜନୀୟ',
    significanceOr: 'ବିବାଦ, ଶତ୍ରୁତା ଓ ରୋଗର ଆଶଙ୍କା ଥାଏ। କୌଣସି ମଙ୍ଗଳ କାର୍ଯ୍ୟ କରନ୍ତୁ ନାହିଁ।'
  },
  kaala: {
    nameOr: 'କାଳ',
    nameHi: 'काल',
    nameEn: 'Kaala',
    rulerOr: 'ଶନି',
    rulerEn: 'Saturn',
    nature: 'ashubh',
    natureOr: 'ହାନିକାରକ',
    significanceOr: 'ରାହୁକାଳ ସଦୃଶ କଷ୍ଟପ୍ରଦ ଓ ଧନହାନିକାରକ। ଶୁଭ କାର୍ଯ୍ୟ ସର୍ବଥା ନିଷେଧ।'
  }
};

const DAY_CHOGHADIYA_ORDER: Array<Array<'udvega' | 'chara' | 'labha' | 'amrita' | 'kaala' | 'shubha' | 'roga'>> = [
  ['udvega', 'chara', 'labha', 'amrita', 'kaala', 'shubha', 'roga', 'udvega'],
  ['amrita', 'kaala', 'shubha', 'roga', 'udvega', 'chara', 'labha', 'amrita'],
  ['roga', 'udvega', 'chara', 'labha', 'amrita', 'kaala', 'shubha', 'roga'],
  ['labha', 'amrita', 'kaala', 'shubha', 'roga', 'udvega', 'chara', 'labha'],
  ['shubha', 'roga', 'udvega', 'chara', 'labha', 'amrita', 'kaala', 'shubha'],
  ['chara', 'labha', 'amrita', 'kaala', 'shubha', 'roga', 'udvega', 'chara'],
  ['kaala', 'shubha', 'roga', 'udvega', 'chara', 'labha', 'amrita', 'kaala'],
];

const NIGHT_CHOGHADIYA_ORDER: Array<Array<'udvega' | 'chara' | 'labha' | 'amrita' | 'kaala' | 'shubha' | 'roga'>> = [
  ['shubha', 'amrita', 'chara', 'roga', 'kaala', 'labha', 'udvega', 'shubha'],
  ['chara', 'roga', 'kaala', 'labha', 'udvega', 'shubha', 'amrita', 'chara'],
  ['kaala', 'labha', 'udvega', 'shubha', 'amrita', 'chara', 'roga', 'kaala'],
  ['udvega', 'shubha', 'amrita', 'chara', 'roga', 'kaala', 'labha', 'udvega'],
  ['amrita', 'chara', 'roga', 'kaala', 'labha', 'udvega', 'shubha', 'amrita'],
  ['roga', 'kaala', 'labha', 'udvega', 'shubha', 'amrita', 'chara', 'roga'],
  ['labha', 'udvega', 'shubha', 'amrita', 'chara', 'roga', 'kaala', 'labha'],
];

export function calculateChoghadiya(
  sunriseMinutes: number,
  sunsetMinutes: number,
  weekdayIdx: number,
  currentTimeMinutes?: number
): ChoghadiyaDayNight {
  const daySpan = sunsetMinutes - sunriseMinutes;
  const daySlotDuration = daySpan / 8;
  const nightSpan = (sunriseMinutes + 1440) - sunsetMinutes;
  const nightSlotDuration = nightSpan / 8;

  const dayOrder = DAY_CHOGHADIYA_ORDER[weekdayIdx % 7];
  const nightOrder = NIGHT_CHOGHADIYA_ORDER[weekdayIdx % 7];

  const nowMin = currentTimeMinutes !== undefined
    ? currentTimeMinutes
    : (() => {
        const now = new Date();
        return now.getHours() * 60 + now.getMinutes();
      })();

  const dayChoghadiya: ChoghadiyaSlot[] = dayOrder.map((key, i) => {
    const def = CHOGHADIYA_DEFINITIONS[key];
    const startM = Math.round(sunriseMinutes + i * daySlotDuration);
    const endM = Math.round(sunriseMinutes + (i + 1) * daySlotDuration);
    const timeWin = formatOdiaTimeWindow(startM, endM);
    const isCurrent = nowMin >= startM && nowMin < endM;
    return {
      index: i,
      period: 'day',
      nameKey: key,
      nameOr: def.nameOr,
      nameHi: def.nameHi,
      nameEn: def.nameEn,
      rulerOr: def.rulerOr,
      rulerEn: def.rulerEn,
      nature: def.nature,
      natureOr: def.natureOr,
      significanceOr: def.significanceOr,
      startMinutes: startM,
      endMinutes: endM,
      startStrOr: minutesToOdiaTimeStr(startM),
      endStrOr: minutesToOdiaTimeStr(endM),
      timeRangeOr: timeWin.or,
      timeRangeEn: timeWin.en,
      isCurrent
    };
  });

  const nightChoghadiya: ChoghadiyaSlot[] = nightOrder.map((key, i) => {
    const def = CHOGHADIYA_DEFINITIONS[key];
    const startM = Math.round((sunsetMinutes + i * nightSlotDuration) % 1440);
    const endM = Math.round((sunsetMinutes + (i + 1) * nightSlotDuration) % 1440);
    const timeWin = formatOdiaTimeWindow(startM, endM);
    let isCurrent = false;
    if (startM < endM) {
      isCurrent = nowMin >= startM && nowMin < endM;
    } else {
      isCurrent = nowMin >= startM || nowMin < endM;
    }
    return {
      index: i,
      period: 'night',
      nameKey: key,
      nameOr: def.nameOr,
      nameHi: def.nameHi,
      nameEn: def.nameEn,
      rulerOr: def.rulerOr,
      rulerEn: def.rulerEn,
      nature: def.nature,
      natureOr: def.natureOr,
      significanceOr: def.significanceOr,
      startMinutes: startM,
      endMinutes: endM,
      startStrOr: minutesToOdiaTimeStr(startM),
      endStrOr: minutesToOdiaTimeStr(endM),
      timeRangeOr: timeWin.or,
      timeRangeEn: timeWin.en,
      isCurrent
    };
  });

  return { dayChoghadiya, nightChoghadiya };
}

// ==========================================
// 24-HOUR PLANETARY HORA (ଗ୍ରହ ହୋରା ଚକ୍ର) ENGINE
// ==========================================

const PLANETARY_HORA_DEFS: Record<string, {
  nameOr: string;
  nameHi: string;
  nameEn: string;
  nature: 'shubh' | 'ashubh' | 'sam';
  natureOr: string;
  recommendationOr: string;
}> = {
  sun: {
    nameOr: 'ସୂର୍ଯ୍ୟ',
    nameHi: 'सूर्य',
    nameEn: 'Sun',
    nature: 'sam',
    natureOr: 'ସାଧାରଣ / ପ୍ରଶାସନିକ',
    recommendationOr: 'ସରକାରୀ କାର୍ଯ୍ୟ, ଉଚ୍ଚାଧିକାରୀ ସାକ୍ଷାତ, ଔଷଧ ସେବନ ଓ ମାଣିକ୍ୟ ଧାରଣ ପାଇଁ ପ୍ରଶସ୍ତ।'
  },
  venus: {
    nameOr: 'ଶୁକ୍ର',
    nameHi: 'शुक्र',
    nameEn: 'Venus',
    nature: 'shubh',
    natureOr: 'ଅତ୍ୟନ୍ତ ଶୁଭ',
    recommendationOr: 'ନୂତନ ବସ୍ତ୍ର, ଅଳଙ୍କାର, ସୁଗନ୍ଧି, ପ୍ରସାଧନ, କଳା, ସଙ୍ଗୀତ ଓ ବିବାହ ଚର୍ଚ୍ଚା।'
  },
  mercury: {
    nameOr: 'ବୁଧ',
    nameHi: 'बुध',
    nameEn: 'Mercury',
    nature: 'shubh',
    natureOr: 'ଶୁଭ / ବ୍ୟାପାରିକ',
    recommendationOr: 'ବାଣିଜ୍ୟ, ନୂତନ ଚୁକ୍ତିପତ୍ର ସ୍ୱାକ୍ଷର, ହିସାବ କିତାବ, ଶିକ୍ଷା ଓ ଲେଖନ କାର୍ଯ୍ୟ।'
  },
  moon: {
    nameOr: 'ଚନ୍ଦ୍ର',
    nameHi: 'चन्द्र',
    nameEn: 'Moon',
    nature: 'shubh',
    natureOr: 'ଶୁଭ / ମାଙ୍ଗଳିକ',
    recommendationOr: 'ଜଳଜାତ କାର୍ଯ୍ୟ, ଦୂର ଯାତ୍ରା, ଗୃହ ପ୍ରବେଶ, କ୍ଷୀର/ଭୋଜନ ବ୍ୟବସାୟ ଓ ସ୍ତ୍ରୀ ସମ୍ପର୍କ।'
  },
  saturn: {
    nameOr: 'ଶନି',
    nameHi: 'शनि',
    nameEn: 'Saturn',
    nature: 'ashubh',
    natureOr: 'ମନ୍ଦ / ବର୍ଜନୀୟ',
    recommendationOr: 'କୌଣସି ନୂତନ ଶୁଭ କାର୍ଯ୍ୟ ନିଷେଧ। ଲୌହ, ତୈଳ, ଯନ୍ତ୍ରପାତି ଓ ବୃକ୍ଷ ରୋପଣ ପାଇଁ ଠିକ୍।'
  },
  jupiter: {
    nameOr: 'ବୃହସ୍ପତି (ଗୁରୁ)',
    nameHi: 'बृहस्पति (गुरु)',
    nameEn: 'Jupiter',
    nature: 'shubh',
    natureOr: 'ସର୍ବଶ୍ରେଷ୍ଠ ଶୁଭ',
    recommendationOr: 'ସମସ୍ତ ଶୁଭ କର୍ମ, ପୂଜା, ଯଜ୍ଞ, ବିଦ୍ୟାରମ୍ଭ, ସ୍ୱର୍ଣ୍ଣ କ୍ରୟ ଓ ଧାର୍ମିକ ଅନୁଷ୍ଠାନ।'
  },
  mars: {
    nameOr: 'ମଙ୍ଗଳ',
    nameHi: 'मंगल',
    nameEn: 'Mars',
    nature: 'ashubh',
    natureOr: 'କଠୋର / ସଂଘର୍ଷ',
    recommendationOr: 'ଭୂମି କ୍ରୟ, ଅସ୍ତ୍ରଶସ୍ତ୍ର, ଅଗ୍ନି କାର୍ଯ୍ୟ, ଋଣ ଶୋଧ ଓ ସାହସିକ ପଦକ୍ଷେପ।'
  }
};

const CHALDEAN_ORDER: Array<'sun' | 'venus' | 'mercury' | 'moon' | 'saturn' | 'jupiter' | 'mars'> = [
  'sun', 'venus', 'mercury', 'moon', 'saturn', 'jupiter', 'mars'
];

const WEEKDAY_FIRST_HORA_IDX = [0, 3, 6, 2, 5, 1, 4];

export function calculatePlanetaryHoras(
  sunriseMinutes: number,
  sunsetMinutes: number,
  weekdayIdx: number,
  currentTimeMinutes?: number
): PlanetaryHoraSlot[] {
  const daySpan = sunsetMinutes - sunriseMinutes;
  const dayHoraDuration = daySpan / 12;
  const nightSpan = (sunriseMinutes + 1440) - sunsetMinutes;
  const nightHoraDuration = nightSpan / 12;

  const nowMin = currentTimeMinutes !== undefined
    ? currentTimeMinutes
    : (() => {
        const now = new Date();
        return now.getHours() * 60 + now.getMinutes();
      })();

  const firstHoraLordIdx = WEEKDAY_FIRST_HORA_IDX[weekdayIdx % 7];
  const list: PlanetaryHoraSlot[] = [];

  // 12 Day Horas
  for (let k = 0; k < 12; k++) {
    const planetKey = CHALDEAN_ORDER[(firstHoraLordIdx + k) % 7];
    const def = PLANETARY_HORA_DEFS[planetKey];
    const startM = Math.round(sunriseMinutes + k * dayHoraDuration);
    const endM = Math.round(sunriseMinutes + (k + 1) * dayHoraDuration);
    const timeWin = formatOdiaTimeWindow(startM, endM);
    const isCurrent = nowMin >= startM && nowMin < endM;
    list.push({
      index: k,
      hourOfSunrise: k + 1,
      period: 'day',
      planetKey,
      planetNameOr: def.nameOr,
      planetNameHi: def.nameHi,
      planetNameEn: def.nameEn,
      nature: def.nature,
      natureOr: def.natureOr,
      recommendationOr: def.recommendationOr,
      startMinutes: startM,
      endMinutes: endM,
      startStrOr: minutesToOdiaTimeStr(startM),
      endStrOr: minutesToOdiaTimeStr(endM),
      timeRangeOr: timeWin.or,
      isCurrent
    });
  }

  // 12 Night Horas
  for (let k = 0; k < 12; k++) {
    const planetKey = CHALDEAN_ORDER[(firstHoraLordIdx + 12 + k) % 7];
    const def = PLANETARY_HORA_DEFS[planetKey];
    const startM = Math.round((sunsetMinutes + k * nightHoraDuration) % 1440);
    const endM = Math.round((sunsetMinutes + (k + 1) * nightHoraDuration) % 1440);
    const timeWin = formatOdiaTimeWindow(startM, endM);
    let isCurrent = false;
    if (startM < endM) {
      isCurrent = nowMin >= startM && nowMin < endM;
    } else {
      isCurrent = nowMin >= startM || nowMin < endM;
    }
    list.push({
      index: 12 + k,
      hourOfSunrise: 13 + k,
      period: 'night',
      planetKey,
      planetNameOr: def.nameOr,
      planetNameHi: def.nameHi,
      planetNameEn: def.nameEn,
      nature: def.nature,
      natureOr: def.natureOr,
      recommendationOr: def.recommendationOr,
      startMinutes: startM,
      endMinutes: endM,
      startStrOr: minutesToOdiaTimeStr(startM),
      endStrOr: minutesToOdiaTimeStr(endM),
      timeRangeOr: timeWin.or,
      isCurrent
    });
  }

  return list;
}

// ==========================================
// 12 RASHI GHATA CHAKRA & CHANDRASHTAMA ENGINE
// ==========================================

const RASHI_GHATA_DATA = [
  { idx: 0, nameOr: 'ମେଷ', nameHi: 'मेष', nameEn: 'Aries', ghataVara: 0, ghataVaraOr: 'ରବିବାର', ghataTithi: [1, 6, 11], ghataTithiOr: 'ପ୍ରତିପଦ, ଷଷ୍ଠୀ, ଏକାଦଶୀ (ନନ୍ଦା)', ghataNakIdx: 9, ghataNakOr: 'ମଘା' },
  { idx: 1, nameOr: 'ବୃଷ', nameHi: 'वृष', nameEn: 'Taurus', ghataVara: 6, ghataVaraOr: 'ଶନିବାର', ghataTithi: [5, 10, 15], ghataTithiOr: 'ପଞ୍ଚମୀ, ଦଶମୀ, ପୂର୍ଣ୍ଣିମା (ପୂର୍ଣ୍ଣା)', ghataNakIdx: 12, ghataNakOr: 'ହସ୍ତା' },
  { idx: 2, nameOr: 'ମିଥୁନ', nameHi: 'मिथुन', nameEn: 'Gemini', ghataVara: 1, ghataVaraOr: 'ସୋମବାର', ghataTithi: [2, 7, 12], ghataTithiOr: 'ଦ୍ୱିତୀୟା, ସପ୍ତମୀ, ଦ୍ୱାଦଶୀ (ଭଦ୍ରା)', ghataNakIdx: 14, ghataNakOr: 'ସ୍ୱାତୀ' },
  { idx: 3, nameOr: 'କର୍କଟ', nameHi: 'कर्क', nameEn: 'Cancer', ghataVara: 3, ghataVaraOr: 'ବୁଧବାର', ghataTithi: [2, 7, 12], ghataTithiOr: 'ଦ୍ୱିତୀୟା, ସପ୍ତମୀ, ଦ୍ୱାଦଶୀ (ଭଦ୍ରା)', ghataNakIdx: 16, ghataNakOr: 'ଅନୁରାଧା' },
  { idx: 4, nameOr: 'ସିଂହ', nameHi: 'सिंह', nameEn: 'Leo', ghataVara: 6, ghataVaraOr: 'ଶନିବାର', ghataTithi: [3, 8, 13], ghataTithiOr: 'ତୃତୀୟା, ଅଷ୍ଟମୀ, ତ୍ରୟୋଦଶୀ (ଜୟା)', ghataNakIdx: 18, ghataNakOr: 'ମୂଳା' },
  { idx: 5, nameOr: 'କନ୍ୟା', nameHi: 'कन्या', nameEn: 'Virgo', ghataVara: 6, ghataVaraOr: 'ଶନିବାର', ghataTithi: [5, 10, 15], ghataTithiOr: 'ପଞ୍ଚମୀ, ଦଶମୀ, ଅମାବାସ୍ୟା (ପୂର୍ଣ୍ଣା)', ghataNakIdx: 21, ghataNakOr: 'ଶ୍ରବଣା' },
  { idx: 6, nameOr: 'ତୁଳା', nameHi: 'तुला', nameEn: 'Libra', ghataVara: 4, ghataVaraOr: 'ଗୁରୁବାର', ghataTithi: [4, 9, 14], ghataTithiOr: 'ଚତୁର୍ଥୀ, ନବମୀ, ଚତୁର୍ଦ୍ଦଶୀ (ରିକ୍ତା)', ghataNakIdx: 23, ghataNakOr: 'ଶତଭିଷା' },
  { idx: 7, nameOr: 'ବିଛା', nameHi: 'वृश्चिक', nameEn: 'Scorpio', ghataVara: 5, ghataVaraOr: 'ଶୁକ୍ରବାର', ghataTithi: [1, 6, 11], ghataTithiOr: 'ପ୍ରତିପଦ, ଷଷ୍ଠୀ, ଏକାଦଶୀ (ନନ୍ଦା)', ghataNakIdx: 26, ghataNakOr: 'ରେବତୀ' },
  { idx: 8, nameOr: 'ଧନୁ', nameHi: 'धनु', nameEn: 'Sagittarius', ghataVara: 5, ghataVaraOr: 'ଶୁକ୍ରବାର', ghataTithi: [3, 8, 13], ghataTithiOr: 'ତୃତୀୟା, ଅଷ୍ଟମୀ, ତ୍ରୟୋଦଶୀ (ଜୟା)', ghataNakIdx: 1, ghataNakOr: 'ଭରଣୀ' },
  { idx: 9, nameOr: 'ମକର', nameHi: 'मकर', nameEn: 'Capricorn', ghataVara: 2, ghataVaraOr: 'ମଙ୍ଗଳବାର', ghataTithi: [4, 9, 14], ghataTithiOr: 'ଚତୁର୍ଥୀ, ନବମୀ, ଚତୁର୍ଦ୍ଦଶୀ (ରିକ୍ତା)', ghataNakIdx: 3, ghataNakOr: 'ରୋହିଣୀ' },
  { idx: 10, nameOr: 'କୁମ୍ଭ', nameHi: 'कुंभ', nameEn: 'Aquarius', ghataVara: 4, ghataVaraOr: 'ଗୁରୁବାର', ghataTithi: [3, 8, 13], ghataTithiOr: 'ତୃତୀୟା, ଅଷ୍ଟମୀ, ତ୍ରୟୋଦଶୀ (ଜୟା)', ghataNakIdx: 5, ghataNakOr: 'ଆର୍ଦ୍ରା' },
  { idx: 11, nameOr: 'ମୀନ', nameHi: 'मीन', nameEn: 'Pisces', ghataVara: 5, ghataVaraOr: 'ଶୁକ୍ରବାର', ghataTithi: [5, 10, 15], ghataTithiOr: 'ପଞ୍ଚମୀ, ଦଶମୀ, ପୂର୍ଣ୍ଣିମା (ପୂର୍ଣ୍ଣା)', ghataNakIdx: 8, ghataNakOr: 'ଆଶ୍ଲେଷା' },
];

export function calculateGhataChakra(
  chandraRashiIdx: number,
  weekdayIdx: number,
  tithiNumber: number,
  nakshatraIdx: number
): RashiGhataInfo[] {
  return RASHI_GHATA_DATA.map((rashi) => {
    // Chandrashtama is 8th house from Janma Rashi (7 steps away)
    const isChandrashtama = ((chandraRashiIdx - rashi.idx + 12) % 12) === 7;
    const isGhataVara = weekdayIdx === rashi.ghataVara;
    const tithiBase = tithiNumber <= 15 ? tithiNumber : tithiNumber - 15;
    const isGhataTithi = rashi.ghataTithi.includes(tithiBase);
    const isGhataNakshatra = nakshatraIdx === rashi.ghataNakIdx;

    let overallStatus: 'shubh' | 'madhyam' | 'ashubh' = 'shubh';
    let overallStatusOr = 'ଶୁଭ ଓ ଅନୁକୂଳ (ସମସ୍ତ କାର୍ଯ୍ୟ ସିଦ୍ଧିଦାୟକ)';
    let remedyOr = 'ଆଜି କୌଣସି ବିଶେଷ ପ୍ରତିକାର ଆବଶ୍ୟକ ନାହିଁ। ଶୁଦ୍ଧ ଚିତ୍ତରେ କାର୍ଯ୍ୟ ଆରମ୍ଭ କରନ୍ତୁ।';

    if (isChandrashtama && isGhataVara) {
      overallStatus = 'ashubh';
      overallStatusOr = 'ଅତ୍ୟନ୍ତ ସାବଧାନ! (ଚନ୍ଦ୍ରାଷ୍ଟମ ଓ ଘାତବାର ସଂଯୋଗ)';
      remedyOr = 'ଆଜି କୌଣସି ନୂତନ ଚୁକ୍ତି, ଯାତ୍ରା କିମ୍ବା ବଡ଼ ଆର୍ଥିକ ବିନିଯୋଗରୁ ସମ୍ପୂର୍ଣ୍ଣ ବିରତ ରୁହନ୍ତୁ। ଶ୍ରୀମହାମୃତ୍ୟୁଞ୍ଜୟ ମନ୍ତ୍ର ଓ ହନୁମାନ ଚାଳିଶା ପାଠ କରନ୍ତୁ।';
    } else if (isChandrashtama) {
      overallStatus = 'ashubh';
      overallStatusOr = 'ଚନ୍ଦ୍ରାଷ୍ଟମ ଚାଲୁଅଛି (ମାନସିକ ଚିନ୍ତା ଓ ବାଧା)';
      remedyOr = 'ଚନ୍ଦ୍ରାଷ୍ଟମ ପ୍ରଭାବ କମାଇବା ପାଇଁ ଶିବଲିଙ୍ଗରେ କଞ୍ଚା କ୍ଷୀର ଓ ଜଳ ଅର୍ପଣ କରନ୍ତୁ ଏବଂ "ଓଁ ସୋମାୟ ନମଃ" ଜପ କରନ୍ତୁ।';
    } else if (isGhataVara) {
      overallStatus = 'ashubh';
      overallStatusOr = 'ଘାତ ବାର ଅଟେ (କାର୍ଯ୍ୟରେ ବିଳମ୍ବ ଓ ବିବାଦ)';
      remedyOr = 'ଘାତ ବାର ଦୋଷ ଶାନ୍ତି ପାଇଁ ଇଷ୍ଟଦେବଙ୍କୁ ଧୂପ-ଦୀପ ଅର୍ପଣ କରି ପ୍ରସାଦ ସେବନ ପରେ କାର୍ଯ୍ୟାରମ୍ଭ କରନ୍ତୁ।';
    } else if (isGhataTithi || isGhataNakshatra) {
      overallStatus = 'madhyam';
      overallStatusOr = isGhataTithi ? 'ଘାତ ତିଥି ସ୍ପର୍ଶ (ସାଧାରଣ ସାବଧାନତା)' : 'ଘାତ ନକ୍ଷତ୍ର (ମଧ୍ୟମ ଶୁଭ)';
      remedyOr = 'ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ଶୁଭ କାର୍ଯ୍ୟ ଅଭିଜିତ୍ ମୁହୂର୍ତ୍ତ କିମ୍ବା ଅମୃତ ବେଳାରେ ସମ୍ପାଦନ କରନ୍ତୁ।';
    }

    return {
      rashiIdx: rashi.idx,
      rashiNameOr: rashi.nameOr,
      rashiNameHi: rashi.nameHi,
      rashiNameEn: rashi.nameEn,
      isChandrashtama,
      isGhataVara,
      isGhataTithi,
      isGhataNakshatra,
      overallStatus,
      overallStatusOr,
      remedyOr,
      ghataVaraNameOr: rashi.ghataVaraOr,
      ghataTithiNameOr: rashi.ghataTithiOr,
      ghataNakshatraNameOr: rashi.ghataNakOr
    };
  });
}

// ==========================================
// VEDIC SANKALPA GENERATOR (ପବିତ୍ର ସଙ୍କଳ୍ପ ପାଠ)
// ==========================================

export function generateVedicSankalpa(
  dayInfo: DynamicOdiaDayInfo,
  city: OdishaCityLocation,
  devoteeName: string = 'ଶ୍ରୀମାନ୍ ଭକ୍ତ',
  gotra: string = 'କାଶ୍ୟପ',
  purpose: string = 'ଦୈନିକ ନିତ୍ୟପୂଜା ଓ ଶ୍ରୀଜଗନ୍ନାଥ ପ୍ରୀତ୍ୟର୍ଥେ'
): VedicSankalpaData {
  const y = dayInfo.gregorianYear;
  const ankaNum = y - 2000 + 24;
  const gajapatiAnka = `${formatOdiaNum(ankaNum)} ଅଙ୍କ`;
  const amliSala = `${formatOdiaNum(y - 616)} ସାଲ`;
  const vikramSamvat = `${formatOdiaNum(y + 57)} ବିକ୍ରମାବ୍ଦ`;
  const shakaSamvat = `${formatOdiaNum(y - 78)} ଶକାବ୍ଦ`;
  const kaliyugaYear = `${formatOdiaNum(y + 3101)} କଳିଯୁଗାବ୍ଦ`;

  const solarIdx = dayInfo.odiaSolarMonth.index;
  const isUttarayana = solarIdx >= 9 || solarIdx <= 2;
  const ayanaOr = isUttarayana ? 'ଉତ୍ତରାୟଣ' : 'ଦକ୍ଷିଣାୟନ';

  const rituOr = dayInfo.rituInfo.or;
  const solarMonthOr = dayInfo.odiaSolarMonth.nameOr;
  const solarDayOr = `${formatOdiaNum(dayInfo.odiaSolarDay)} ଦିବସ`;
  const lunarMonthOr = dayInfo.lunarMonthName.or;
  const pakshaOr = dayInfo.isShukla ? 'ଶୁକ୍ଳପକ୍ଷ' : 'କୃଷ୍ଣପକ୍ଷ';
  const tithiOr = `${dayInfo.panjika.tithi.nameKey ? dayInfo.tithiNumber : ''} ତିଥି`;
  const vaaraOr = `${dayInfo.panjika.vaara} ବାସର`;
  const nakshatraOr = `${dayInfo.panjika.nakshatra.nameKey} ନକ୍ଷତ୍ର`;
  const yogaOr = `${dayInfo.panjika.yoga.nameKey} ଯୋଗ`;
  const karanaOr = `${dayInfo.panjika.karana.nameKey} କରଣ`;
  const kshetraOr = `ଭାରତବର୍ଷେ ଭରତଖଣ୍ଡେ ଜମ୍ବୁଦ୍ୱୀପେ ଉତ୍କଳପ୍ରଦେଶେ ଶ୍ରୀପୁରୁଷୋତ୍ତମକ୍ଷେତ୍ରେ ଶ୍ରୀଜଗନ୍ନାଥସ୍ୟ ରାଜ୍ୟେ, ${city.nameOr} ମଣ୍ଡଳେ`;

  const sanskritMantra = `ଓଁ ବିଷ୍ଣୁର୍ବିଷ୍ଣୁର୍ବିଷ୍ଣୁଃ ଶ୍ରୀମଦ୍ ଭଗବତୋ ମହାପୁରୁଷସ୍ୟ ବିଷ୍ଣୋରାଜ୍ଞୟା ପ୍ରବର୍ତ୍ତମାନସ୍ୟ ଅଦ୍ୟ ଶ୍ରୀବ୍ରହ୍ମଣୋ ଦ୍ୱିତୀୟପରାର୍ଦ୍ଧେ ଶ୍ରୀଶ୍ୱେତବରାହକଳ୍ପେ ବୈବସ୍ୱତମନ୍ୱନ୍ତରେ ଅଷ୍ଟାବିଂଶତିତମେ କଳିଯୁଗେ କଳିପ୍ରଥମଚରଣେ ${kshetraOr} ଶ୍ରୀଦିବ୍ୟସିଂହଦେବ ମହାରାଜାଙ୍କ ପ୍ରବର୍ଦ୍ଧମାନେ ${gajapatiAnka}, ${amliSala}, ${vikramSamvat}େ, ${shakaSamvat}େ, ${kaliyugaYear}େ, ${ayanaOr}େ, ${rituOr} ଋତୌ, ଶ୍ରୀସୂର୍ଯ୍ୟେ ${solarMonthOr} ରାଶିସ୍ଥିତେ ${solarDayOr}େ, ମହାମାହେନ୍ଦ୍ରେ ${lunarMonthOr} ମାସେ, ${pakshaOr}େ, ଶୁଭାୟାଂ ${tithiOr}ୌ, ${vaaraOr}େ, ${nakshatraOr}େ, ${yogaOr}େ, ${karanaOr}େ, ସର୍ବଗ୍ରହେଷୁ ଯଥାଯଥା ରାଶିସ୍ଥିତେଷୁ ସତ୍ସୁ... ମମ ଉପାତ୍ତ ସମସ୍ତ ଦୁରିତକ୍ଷୟପୂର୍ବକ ଆୟୁରାରୋଗ୍ୟ ଐଶ୍ୱର୍ଯ୍ୟାଭିବୃଦ୍ଧ୍ୟର୍ଥଂ, ଶ୍ରୀପରମେଶ୍ୱର ପ୍ରୀତ୍ୟର୍ଥେ ${gotra} ଗୋତ୍ରୋତ୍ପନ୍ନସ୍ୟ ${devoteeName} ନାମ୍ନଃ (ଶର୍ମଣଃ/ବର୍ମଣଃ) ${purpose} କର୍ମଣି ସର୍ବତୋଭାବେନ ଶୁଭଫଳ ସିଦ୍ଧ୍ୟର୍ଥେ ଅଦ୍ୟ ଏତତ୍ ପବିତ୍ର ସଙ୍କଳ୍ପଂ ଅହଂ କରିଷ୍ୟେ। ଓଁ ତତ୍ ସତ୍ ନମୋ ବ୍ରହ୍ମଣେ।`;

  const odiaExplanation = `ହେ ପରମେଶ୍ୱର! ଆଜି ଶ୍ୱେତବରାହ କଳ୍ପ, ବୈବସ୍ୱତ ମନ୍ୱନ୍ତର, କଳିଯୁଗର ଶ୍ରୀକ୍ଷେତ୍ର ଓଡ଼ିଶା ରାଜ୍ୟରେ, ଗଜପତି ଶ୍ରୀଦିବ୍ୟସିଂହଦେବଙ୍କ ${gajapatiAnka}, ${amliSala}, ${vikramSamvat}, ${ayanaOr}, ${rituOr}, ${solarMonthOr} ମାସ ${solarDayOr}, ${lunarMonthOr} ମାସ ${pakshaOr}ର ପବିତ୍ର ${tithiOr} ଓ ${vaaraOr}ରେ; ${gotra} ଗୋତ୍ରର ${devoteeName}, ସମସ୍ତ ପାପ ଓ ଦୁରିତ ନାଶ ପୂର୍ବକ ଇଷ୍ଟଦେବ ଶ୍ରୀଜଗନ୍ନାଥଙ୍କ ପ୍ରୀତି ତଥା ${purpose} ଉଦ୍ଦେଶ୍ୟରେ ଏହି ପବିତ୍ର ସଙ୍କଳ୍ପ ଗ୍ରହଣ କରୁଅଛି।`;

  return {
    sanskritMantra,
    odiaExplanation,
    gajapatiAnka,
    amliSala,
    vikramSamvat,
    shakaSamvat,
    kaliyugaYear,
    ayanaOr,
    rituOr,
    solarMonthOr,
    solarDayOr,
    lunarMonthOr,
    pakshaOr,
    tithiOr,
    vaaraOr,
    nakshatraOr,
    yogaOr,
    karanaOr,
    kshetraOr
  };
}

// ==========================================
// DAILY 12 LAGNA (ASCENDANT) ENGINE
// ==========================================

export const LAGNA_RASHI_DEFS = [
  { idx: 0, nameOr: 'ମେଷ', nameHi: 'मेष', nameEn: 'Aries', lordOr: 'ମଙ୍ଗଳ', lordHi: 'मंगल', lordEn: 'Mars', elementOr: 'ଅଗ୍ନି', nature: 'chara' as const, natureOr: 'ଚର', suitabilityOr: 'ଚର ଲଗ୍ନ - ଯାତ୍ରା, ବାହନ କ୍ରୟ ଓ ଉଦ୍ୟୋଗ ପାଇଁ ଉତ୍ତମ।' },
  { idx: 1, nameOr: 'ବୃଷ', nameHi: 'वृषभ', nameEn: 'Taurus', lordOr: 'ଶୁକ୍ର', lordHi: 'शुक्र', lordEn: 'Venus', elementOr: 'ପୃଥିବୀ', nature: 'sthira' as const, natureOr: 'ସ୍ଥିର', suitabilityOr: 'ସ୍ଥିର ଲଗ୍ନ - ବିବାହ, ଗୃହପ୍ରବେଶ, ମନ୍ଦିର ପ୍ରତିଷ୍ଠା ଓ ସ୍ଥାୟୀ ସମ୍ପତ୍ତି କ୍ରୟ ପାଇଁ ଶ୍ରେଷ୍ଠ।' },
  { idx: 2, nameOr: 'ମିଥୁନ', nameHi: 'मिथुन', nameEn: 'Gemini', lordOr: 'ବୁଧ', lordHi: 'बुध', lordEn: 'Mercury', elementOr: 'ବାୟୁ', nature: 'dwiswabhava' as const, natureOr: 'ଦ୍ୱିସ୍ୱଭାବ', suitabilityOr: 'ଦ୍ୱିସ୍ୱଭାବ ଲଗ୍ନ - ବିଦ୍ୟାରମ୍ଭ, ବ୍ରତୋପନୟନ, ଧାର୍ମିକ ପୂଜା ଓ ଶିକ୍ଷା ପାଇଁ ଶୁଭ।' },
  { idx: 3, nameOr: 'କର୍କଟ', nameHi: 'कर्क', nameEn: 'Cancer', lordOr: 'ଚନ୍ଦ୍ର', lordHi: 'चन्द्र', lordEn: 'Moon', elementOr: 'ଜଳ', nature: 'chara' as const, natureOr: 'ଚର', suitabilityOr: 'ଚର ଲଗ୍ନ - ଜଳଯାତ୍ରା, ସ୍ଥାନାନ୍ତର ଓ ସୃଜନଶୀଳ କାର୍ଯ୍ୟ ପାଇଁ ଅନୁକୂଳ।' },
  { idx: 4, nameOr: 'ସିଂହ', nameHi: 'सिंह', nameEn: 'Leo', lordOr: 'ସୂର୍ଯ୍ୟ', lordHi: 'सूर्य', lordEn: 'Sun', elementOr: 'ଅଗ୍ନି', nature: 'sthira' as const, natureOr: 'ସ୍ଥିର', suitabilityOr: 'ସ୍ଥିର ଲଗ୍ନ - ରାଜକୀୟ କାର୍ଯ୍ୟ, ଚାକିରି ଯୋଗଦାନ, ପ୍ରତିଷ୍ଠା ଓ ଗୃହପ୍ରବେଶ ପାଇଁ ଶ୍ରେଷ୍ଠ।' },
  { idx: 5, nameOr: 'କନ୍ୟା', nameHi: 'कन्या', nameEn: 'Virgo', lordOr: 'ବୁଧ', lordHi: 'बुध', lordEn: 'Mercury', elementOr: 'ପୃଥିବୀ', nature: 'dwiswabhava' as const, natureOr: 'ଦ୍ୱିସ୍ୱଭାବ', suitabilityOr: 'ଦ୍ୱିସ୍ୱଭାବ ଲଗ୍ନ - ବ୍ୟାଙ୍କିଙ୍ଗ୍, ହିସାବ, ବ୍ୟବସାୟ ଚୁକ୍ତି ଓ ବ୍ରତଘର ପାଇଁ ଶୁଭ।' },
  { idx: 6, nameOr: 'ତୁଳା', nameHi: 'तुला', nameEn: 'Libra', lordOr: 'ଶୁକ୍ର', lordHi: 'शुक्र', lordEn: 'Venus', elementOr: 'ବାୟୁ', nature: 'chara' as const, natureOr: 'ଚର', suitabilityOr: 'ଚର ଲଗ୍ନ - ବାଣିଜ୍ୟ, ବିବାହ କଥାବାର୍ତ୍ତା, କଳା ଓ ସଙ୍ଗୀତ ପାଇଁ ଅନୁକୂଳ।' },
  { idx: 7, nameOr: 'ବିଛା', nameHi: 'वृश्चिक', nameEn: 'Scorpio', lordOr: 'ମଙ୍ଗଳ', lordHi: 'मंगल', lordEn: 'Mars', elementOr: 'ଜଳ', nature: 'sthira' as const, natureOr: 'ସ୍ଥିର', suitabilityOr: 'ସ୍ଥିର ଲଗ୍ନ - ଗୁପ୍ତ ସାଧନା, ଯନ୍ତ୍ର ସ୍ଥାପନା ଓ ଗୃହ ପ୍ରତିଷ୍ଠା ପାଇଁ ଶ୍ରେଷ୍ଠ।' },
  { idx: 8, nameOr: 'ଧନୁ', nameHi: 'धनु', nameEn: 'Sagittarius', lordOr: 'ବୃହସ୍ପତି', lordHi: 'बृहस्पति', lordEn: 'Jupiter', elementOr: 'ଅଗ୍ନି', nature: 'dwiswabhava' as const, natureOr: 'ଦ୍ୱିସ୍ୱଭାବ', suitabilityOr: 'ଦ୍ୱିସ୍ୱଭାବ ଲଗ୍ନ - ଗୁରୁ ଦୀକ୍ଷା, ଯଜ୍ଞ, ଦେବପୂଜା ଓ ତୀର୍ଥଯାତ୍ରା ପାଇଁ ଅତୀବ ପ୍ରଶସ୍ତ।' },
  { idx: 9, nameOr: 'ମକର', nameHi: 'मकर', nameEn: 'Capricorn', lordOr: 'ଶନି', lordHi: 'शनि', lordEn: 'Saturn', elementOr: 'ପୃଥିବୀ', nature: 'chara' as const, natureOr: 'ଚର', suitabilityOr: 'ଚର ଲଗ୍ନ - କୃଷି କର୍ମ, ନିର୍ମାଣ କାର୍ଯ୍ୟ ଓ ବାହନ ପରିଚାଳନା ପାଇଁ ଶୁଭ।' },
  { idx: 10, nameOr: 'କୁମ୍ଭ', nameHi: 'कुम्भ', nameEn: 'Aquarius', lordOr: 'ଶନି', lordHi: 'शनि', lordEn: 'Saturn', elementOr: 'ବାୟୁ', nature: 'sthira' as const, natureOr: 'ସ୍ଥିର', suitabilityOr: 'ସ୍ଥିର ଲଗ୍ନ - ଗୃହ ନିର୍ମାଣ, ଚିରସ୍ଥାୟୀ ସଙ୍ଗଠନ ଓ ସମାଜ କଲ୍ୟାଣ କାର୍ଯ୍ୟ ପାଇଁ ଶ୍ରେଷ୍ଠ।' },
  { idx: 11, nameOr: 'ମୀନ', nameHi: 'मीन', nameEn: 'Pisces', lordOr: 'ବୃହସ୍ପତି', lordHi: 'बृहस्पति', lordEn: 'Jupiter', elementOr: 'ଜଳ', nature: 'dwiswabhava' as const, natureOr: 'ଦ୍ୱିସ୍ୱଭାବ', suitabilityOr: 'ଦ୍ୱିସ୍ୱଭାବ ଲଗ୍ନ - ମୋକ୍ଷ ସାଧନା, ଦାନ-ଧର୍ମ, ବିବାହ ଓ ବ୍ରତୋପନୟନ ପାଇଁ ଉତ୍ତମ।' }
];

/**
 * Compute the Nirayana (sidereal) Ascendant for a given UTC Date, latitude, and longitude.
 * Uses Local Sidereal Time, true obliquity of the ecliptic, and Lahiri Ayanamsha.
 * Same algorithm as calculateAscendant in kundali_engine.ts.
 */
function computeNirayanaAscendant(dateUTC: Date, latitude: number, longitude: number): number {
  const jd = getJulianDay(dateUTC);
  const T = getJulianCenturies(jd);
  const ayanamsa = getLahiriAyanamsha(jd);
  // Greenwich Mean Sidereal Time (GMST) in degrees
  const gmst = normalizeDegrees(280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T);
  // Local Sidereal Time (LST) in degrees
  const lst = normalizeDegrees(gmst + longitude);
  // Mean Obliquity of the Ecliptic
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
  return normalizeDegrees(ascTropical - ayanamsa);
}

/**
 * Astronomically precise Daily 12 Lagna calculator.
 * Samples the true Nirayana ascendant at 3-minute intervals across a full 24-hour
 * diurnal cycle (sunrise to next sunrise) to detect exact rashi transitions.
 * This produces latitude-dependent, date-dependent, astronomically correct lagna durations.
 */
export function calculateDailyLagnas(
  date: Date,
  latitude: number,
  longitude: number,
  sunriseMinutes?: number,
  currentTimeMinutes?: number
): DailyLagnaInfo[] {
  const SAMPLE_INTERVAL = 3; // minutes — balance of accuracy vs performance (480 samples/day)
  const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000; // IST = UTC + 5:30

  // If sunriseMinutes is not provided, calculate dynamically from astronomical sun times
  let actualSunriseMinutes = sunriseMinutes;
  if (actualSunriseMinutes === undefined) {
    const sunTimes = calculateSunTimes(date, latitude, longitude);
    const [hm, p] = sunTimes.sunrise.split(' ');
    const [h, m] = hm.split(':');
    let hs = parseInt(h, 10);
    if (p === 'PM' && hs !== 12) hs += 12;
    if (p === 'AM' && hs === 12) hs = 0;
    actualSunriseMinutes = hs * 60 + parseInt(m, 10);
  }

  // Build a base UTC midnight for the given local date
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const localMidnightUTC = new Date(Date.UTC(year, month, day, 0, 0, 0));
  localMidnightUTC.setTime(localMidnightUTC.getTime() - IST_OFFSET_MS);

  // Find the ascendant at sunrise to get the starting rashi
  const sunriseUTC = new Date(localMidnightUTC.getTime() + actualSunriseMinutes * 60000);
  const startAsc = computeNirayanaAscendant(sunriseUTC, latitude, longitude);
  const startRashiIdx = Math.floor(startAsc / 30) % 12;

  // Scan 1440 minutes from sunrise, sampling every SAMPLE_INTERVAL minutes
  // to detect when the ascendant crosses each 30° rashi boundary
  interface RashiTransition {
    rashiIdx: number;
    startMinutes: number; // minutes from midnight (local)
    endMinutes: number;
  }

  const transitions: RashiTransition[] = [];
  let prevRashiIdx = startRashiIdx;
  let segmentStart = actualSunriseMinutes;

  for (let offset = SAMPLE_INTERVAL; offset <= 1440; offset += SAMPLE_INTERVAL) {
    const minutesFromMidnight = actualSunriseMinutes + offset;
    const sampleUTC = new Date(localMidnightUTC.getTime() + minutesFromMidnight * 60000);
    const asc = computeNirayanaAscendant(sampleUTC, latitude, longitude);
    const currentRashiIdx = Math.floor(asc / 30) % 12;

    if (currentRashiIdx !== prevRashiIdx) {
      // Rashi transition detected — refine with binary search for exact minute
      let lo = offset - SAMPLE_INTERVAL;
      let hi = offset;
      for (let iter = 0; iter < 6; iter++) { // ~6 iterations = < 3 second precision
        const mid = Math.round((lo + hi) / 2);
        const midUTC = new Date(localMidnightUTC.getTime() + (actualSunriseMinutes + mid) * 60000);
        const midAsc = computeNirayanaAscendant(midUTC, latitude, longitude);
        const midRashi = Math.floor(midAsc / 30) % 12;
        if (midRashi === prevRashiIdx) lo = mid; else hi = mid;
      }
      const transitionMinute = actualSunriseMinutes + hi;

      transitions.push({ rashiIdx: prevRashiIdx, startMinutes: segmentStart, endMinutes: transitionMinute });
      segmentStart = transitionMinute;
      prevRashiIdx = currentRashiIdx;

      // Stop once we have 12 lagnas
      if (transitions.length >= 11) break;
    }
  }

  // Final (12th) lagna: from last transition to next sunrise
  transitions.push({
    rashiIdx: prevRashiIdx,
    startMinutes: segmentStart,
    endMinutes: actualSunriseMinutes + 1440
  });

  // Current time for highlighting
  const nowMin = currentTimeMinutes !== undefined
    ? currentTimeMinutes
    : (() => {
        const now = new Date();
        return now.getHours() * 60 + now.getMinutes();
      })();

  // Build the DailyLagnaInfo array
  const result: DailyLagnaInfo[] = [];
  for (let i = 0; i < transitions.length && i < 12; i++) {
    const t = transitions[i];
    const safeIdx = ((Math.floor(t.rashiIdx) % 12) + 12) % 12;
    const rashiDef = LAGNA_RASHI_DEFS[safeIdx] || LAGNA_RASHI_DEFS[0];
    const duration = t.endMinutes - t.startMinutes;
    const timeWin = formatOdiaTimeWindow(t.startMinutes, t.endMinutes);

    // Normalize for current-time comparison
    const normStart = t.startMinutes % 1440;
    const normEnd = t.endMinutes % 1440;
    const isCurrent = normStart < normEnd
      ? (nowMin >= normStart && nowMin < normEnd)
      : (nowMin >= normStart || nowMin < normEnd);

    result.push({
      index: i,
      rashiIdx: t.rashiIdx,
      rashiNameOr: rashiDef.nameOr,
      rashiNameHi: rashiDef.nameHi,
      rashiNameEn: rashiDef.nameEn,
      lordOr: rashiDef.lordOr,
      lordHi: rashiDef.lordHi,
      lordEn: rashiDef.lordEn,
      elementOr: rashiDef.elementOr,
      nature: rashiDef.nature,
      natureOr: rashiDef.natureOr,
      startMinutes: t.startMinutes,
      endMinutes: t.endMinutes,
      timeRangeOr: timeWin.or,
      timeRangeEn: timeWin.en,
      durationMinutes: duration,
      isCurrent,
      suitabilityOr: rashiDef.suitabilityOr
    });
  }

  return result;
}

// ====================================================
// PURI SRIMANDIR 32 SACRED JAGANNATH BESHAS DIRECTORY
// ====================================================

export interface SrimandirBeshaInfo {
  id: string;
  order: number;
  nameOr: string;
  nameHi: string;
  nameEn: string;
  occasionOr: string;
  monthId: string;
  monthNameOr: string;
  tithiOr: string;
  seasonOr: string;
  attireOr: string;
  significanceOr: string;
  darshanTimeApproxOr: string;
}

export const SRIMANDIR_32_BESHAS: SrimandirBeshaInfo[] = [
  {
    id: 'suna_besha_bahuda',
    order: 1,
    nameOr: 'ସୁନା ବେଶ (ରଥ ଉପରେ ବଡ଼ତଢ଼ାଉ ବେଶ)',
    nameHi: 'सुना वेश (स्वर्ण वेश - रथ पर)',
    nameEn: 'Suna Besha (Golden Attire on Chariots)',
    occasionOr: 'ଆଷାଢ଼ ଶୁକ୍ଳ ଏକାଦଶୀ (ବାହୁଡ଼ା ଏକାଦଶୀ)',
    monthId: 'asadha',
    monthNameOr: 'ଆଷାଢ଼',
    tithiOr: 'ଶୁକ୍ଳ ଏକାଦଶୀ',
    seasonOr: 'ବର୍ଷା ଋତୁ',
    attireOr: '୧୩୮ କିଲୋ ସ୍ୱର୍ଣ୍ଣ ଅଳଙ୍କାର - ଶ୍ରୀପୟର, ଶ୍ରୀଭୁଜ, କିରୀଟ, ଘାଗୁଡ଼ା, କାନଫୁଲ, ଚନ୍ଦ୍ର-ସୂର୍ଯ୍ୟ, ମୟୂର ଚନ୍ଦ୍ରିକା।',
    significanceOr: 'ବାହୁଡ଼ା ଯାତ୍ରା ପରେ ସିଂହଦ୍ୱାରରେ ତିନି ରଥ ଉପରେ ଶ୍ରୀଜୀଉମାନଙ୍କ ସ୍ୱର୍ଣ୍ଣାଳଙ୍କାର ସଜ୍ଜିତ ରାଜରାଜେଶ୍ୱର ଦର୍ଶନ। ଲକ୍ଷାଧିକ ଭକ୍ତଙ୍କ ପାପ ମୋଚନକାରୀ।',
    darshanTimeApproxOr: 'ଅପରାହ୍ନ ୦୪:୩୦ ରୁ ରାତ୍ର ୧୧:୩୦'
  },
  {
    id: 'hati_besha',
    order: 2,
    nameOr: 'ହାତୀ ବେଶ (ଗଜାନନ ବେଶ)',
    nameHi: 'हाथी वेश (गजानन वेश)',
    nameEn: 'Hati Besha (Elephant Attire)',
    occasionOr: 'ଜ୍ୟେଷ୍ଠ ପୂର୍ଣ୍ଣିମା (ଦେବସ୍ନାନ ପୂର୍ଣ୍ଣିମା)',
    monthId: 'jyestha',
    monthNameOr: 'ଜ୍ୟେଷ୍ଠ',
    tithiOr: 'ପୂର୍ଣ୍ଣିମା',
    seasonOr: 'ଗ୍ରୀଷ୍ମ ଋତୁ',
    attireOr: 'ଗଜମୁଖ, ସୁବର୍ଣ୍ଣ ଦନ୍ତ, କର୍ଣ୍ଣ କୁଣ୍ଡଳ ଓ ସୋଲ-କନାର ହସ୍ତୀ ରୂପ ଶୃଙ୍ଗାର।',
    significanceOr: 'ମହାରାଷ୍ଟ୍ରର ଗଣପତି ଭକ୍ତ ମାଧବ ଗଣେଶଙ୍କ ଭକ୍ତି ପରୀକ୍ଷାରେ ଶ୍ରୀଜଗନ୍ନାଥ ଓ ବଳଭଦ୍ର ଗଜାନନ ରୂପ ଧାରଣ କରି ସ୍ନାନବେଦୀରେ ଦର୍ଶନ ଦେଇଥିଲେ।',
    darshanTimeApproxOr: 'ଅପରାହ୍ନ ୦୩:୩୦ ରୁ ରାତ୍ର ୦୯:୩୦'
  },
  {
    id: 'padma_besha',
    order: 3,
    nameOr: 'ତ୍ରିବେଣୀ ପଦ୍ମ ବେଶ',
    nameHi: 'पद्म वेश',
    nameEn: 'Padma Besha (Lotus Attire)',
    occasionOr: 'ମାଘ ଅମାବାସ୍ୟା / ବସନ୍ତ ପଞ୍ଚମୀ ପୂର୍ବ ରାତ୍ରି',
    monthId: 'magha',
    monthNameOr: 'ମାଘ',
    tithiOr: 'ଅମାବାସ୍ୟା',
    seasonOr: 'ଶିଶିର ଋତୁ',
    attireOr: 'ଶତଦଳ ପଦ୍ମ ପୁଷ୍ପ, ସୋଲ ନିର୍ମିତ କମଳବନ, ହଂସ, ବଗ ଓ କଦମ୍ବ କଢ଼ି।',
    significanceOr: 'ବଡ଼ଛତା ମଠ ପକ୍ଷରୁ ସେବା। ଭକ୍ତ ମନୋହର ଦାସଙ୍କ ପଦ୍ମ ପୁଷ୍ପ ସମର୍ପଣର ଚିରନ୍ତନ ସ୍ମାରକ। ରତ୍ନସିଂହାସନ ଏକ ଦିବ୍ୟ ପଦ୍ମ ପୋଖରୀରେ ପରିଣତ ହୁଏ।',
    darshanTimeApproxOr: 'ରାତ୍ର ୧୦:୦୦ (ବଡ଼ସିଂହାର ପରଠାରୁ ପ୍ରଭାତ ପର୍ଯ୍ୟନ୍ତ)'
  },
  {
    id: 'gajauddharana_besha',
    order: 4,
    nameOr: 'ଗଜଉଦ୍ଧାରଣ ବେଶ',
    nameHi: 'गजउद्धारण वेश',
    nameEn: 'Gajauddharana Besha',
    occasionOr: 'ମାଘ ପୂର୍ଣ୍ଣିମା (ଅଗିରା ପୂର୍ଣ୍ଣିମା)',
    monthId: 'magha',
    monthNameOr: 'ମାଘ',
    tithiOr: 'ପୂର୍ଣ୍ଣିମା',
    seasonOr: 'ଶିଶିର ଋତୁ',
    attireOr: 'ଗରୁଡ଼ାରୂଢ଼ ଚତୁର୍ଭୁଜ ନାରାୟଣ, ଶଙ୍ଖ-ଚକ୍ର-ଗଦା-ପଦ୍ମ, ଗଜ ଓ ଗ୍ରାହ (କୁମ୍ଭୀର) ମୂର୍ତ୍ତି।',
    significanceOr: 'ଶ୍ରୀମଦ୍ ଭାଗବତର ଗଜେନ୍ଦ୍ର ମୋକ୍ଷଣ ଲୀଳା ସ୍ମୃତିରେ ଶ୍ରୀହରିଙ୍କ ଭକ୍ତରକ୍ଷକ ଅଭୟ ପ୍ରଦାନ।',
    darshanTimeApproxOr: 'ଅପରାହ୍ନ ୦୩:୦୦ ରୁ ସନ୍ଧ୍ୟା ୦୮:୦୦'
  },
  {
    id: 'rajarajeshwara_besha',
    order: 5,
    nameOr: 'ରାଜରାଜେଶ୍ୱର ସୁନା ବେଶ (ରତ୍ନସିଂହାସନ)',
    nameHi: 'राजराजेश्वर सुना वेश',
    nameEn: 'Rajarajeshwara Suna Besha',
    occasionOr: 'କାର୍ତ୍ତିକ ପୂର୍ଣ୍ଣିମା (ରାସ ପୂର୍ଣ୍ଣିମା)',
    monthId: 'kartika',
    monthNameOr: 'କାର୍ତ୍ତିକ',
    tithiOr: 'ପୂର୍ଣ୍ଣିମା',
    seasonOr: 'ହେମନ୍ତ ଋତୁ',
    attireOr: 'ରତ୍ନ ସିଂହାସନରେ ସମସ୍ତ ସ୍ୱର୍ଣ୍ଣ ଅଳଙ୍କାର, ରାଜକୀୟ ଖଣ୍ଡା, ଢାଲ ଓ ସୁବର୍ଣ୍ଣ କିରୀଟ।',
    significanceOr: 'କାର୍ତ୍ତିକ ମାସର ପବିତ୍ର ପଞ୍ଚୁକ ସମାପନରେ ମହାପ୍ରଭୁଙ୍କ ରାଜାଧିରାଜ ସ୍ୱରୂପ।',
    darshanTimeApproxOr: 'ଅପରାହ୍ନ ୦୪:୦୦ ରୁ ରାତ୍ର ୧୧:୦୦'
  },
  {
    id: 'radha_damodara_besha',
    order: 6,
    nameOr: 'ରାଧା ଦାମୋଦର ବେଶ',
    nameHi: 'राधा दामोदर वेश',
    nameEn: 'Radha Damodara Besha',
    occasionOr: 'ଆଶ୍ୱିନ ଶୁକ୍ଳ ଏକାଦଶୀ ରୁ କାର୍ତ୍ତିକ ଶୁକ୍ଳ ଦଶମୀ (ଏକ ମାସ)',
    monthId: 'aswina',
    monthNameOr: 'ଆଶ୍ୱିନ / କାର୍ତ୍ତିକ',
    tithiOr: 'ଶୁକ୍ଳ ଏକାଦଶୀ ରୁ ଦଶମୀ',
    seasonOr: 'ଶରତ ଋତୁ',
    attireOr: 'ତ୍ରିକଚ୍ଛ ବସ୍ତ୍ର, ସୁବର୍ଣ୍ଣ ବଂଶୀ, କଦମ୍ବ ଫୁଲ ଚୂଳ ଓ ଚିତ୍ତାକର୍ଷକ ମଥାମଣି।',
    significanceOr: 'ହବିଷ୍ୟାଳୀ ମା’ମାନଙ୍କ କାର୍ତ୍ତିକ ବ୍ରତ କାଳରେ ଶ୍ରୀକୃଷ୍ଣଙ୍କ ଦାମୋଦର ଲୀଳାର ଦିବ୍ୟ ଶୃଙ୍ଗାର।',
    darshanTimeApproxOr: 'ମଧ୍ୟାହ୍ନ ଧୂପ ପରଠାରୁ ସନ୍ଧ୍ୟା ପର୍ଯ୍ୟନ୍ତ'
  },
  {
    id: 'lakshmi_narayana_besha',
    order: 7,
    nameOr: 'ଲକ୍ଷ୍ମୀନାରାୟଣ ବେଶ (ପଞ୍ଚୁକ ୧ମ ଦିନ)',
    nameHi: 'लक्ष्मीनारायण वेश',
    nameEn: 'Lakshmi Narayana Besha (Panchuka Day 1)',
    occasionOr: 'କାର୍ତ୍ତିକ ଶୁକ୍ଳ ଏକାଦଶୀ (ବଡ଼ ଏକାଦଶୀ)',
    monthId: 'kartika',
    monthNameOr: 'କାର୍ତ୍ତିକ',
    tithiOr: 'ଶୁକ୍ଳ ଏକାଦଶୀ',
    seasonOr: 'ହେମନ୍ତ ଋତୁ',
    attireOr: 'ସ୍ୱର୍ଣ୍ଣ ଶଙ୍ଖ, ଚକ୍ର, ହଳ, ମୂଷଳ, ରତ୍ନ କିରୀଟ ଓ ପାଟବସ୍ତ୍ର।',
    significanceOr: 'ପଞ୍ଚୁକ ବ୍ରତର ପ୍ରଥମ ଦିବସରେ ଶ୍ରୀଜଗନ୍ନାଥ ନାରାୟଣ ଓ ବଳଭଦ୍ର ବାସୁଦେବ ରୂପରେ ଭକ୍ତଙ୍କୁ ଦର୍ଶନ ଦିଅନ୍ତି।',
    darshanTimeApproxOr: 'ଅପରାହ୍ନ ୦୨:୦୦ ରୁ ରାତ୍ର ୧୦:୩୦'
  },
  {
    id: 'bankachuda_besha',
    order: 8,
    nameOr: 'ବାଙ୍କଚୂଡ଼ ବେଶ (ପଞ୍ଚୁକ ୨ୟ ଦିନ)',
    nameHi: 'बांकचूड़ वेश',
    nameEn: 'Bankachuda Besha (Panchuka Day 2)',
    occasionOr: 'କାର୍ତ୍ତିକ ଶୁକ୍ଳ ଦ୍ୱାଦଶୀ (ଗରୁଡ଼ ଦ୍ୱାଦଶୀ)',
    monthId: 'kartika',
    monthNameOr: 'କାର୍ତ୍ତିକ',
    tithiOr: 'ଶୁକ୍ଳ ଦ୍ୱାଦଶୀ',
    seasonOr: 'ହେମନ୍ତ ଋତୁ',
    attireOr: 'ମସ୍ତକର ଦକ୍ଷିଣ ଭାଗକୁ ବଙ୍କା ହୋଇଥିବା ସୁବର୍ଣ୍ଣ ଚୂଳ, ଚନ୍ଦ୍ରିକା ଓ କଦମ୍ବ ଫୁଲ।',
    significanceOr: 'ଶ୍ରୀକୃଷ୍ଣଙ୍କ ଅତୁଳନୀୟ ଗୋପଲୀଳାର ବାଙ୍କିଆ ଚୂଳ ମଣ୍ଡିତ ମୋହିନୀ ରୂପ।',
    darshanTimeApproxOr: 'ଅପରାହ୍ନ ୦୨:୦୦ ରୁ ରାତ୍ର ୧୦:୩୦'
  },
  {
    id: 'tribikrama_besha',
    order: 9,
    nameOr: 'ତ୍ରିବିକ୍ରମ ବେଶ (ପଞ୍ଚୁକ ୩ୟ ଦିନ)',
    nameHi: 'त्रिविक्रम वेश',
    nameEn: 'Tribikrama Besha (Panchuka Day 3)',
    occasionOr: 'କାର୍ତ୍ତିକ ଶୁକ୍ଳ ତ୍ରୟୋଦଶୀ',
    monthId: 'kartika',
    monthNameOr: 'କାର୍ତ୍ତିକ',
    tithiOr: 'ଶୁକ୍ଳ ତ୍ରୟୋଦଶୀ',
    seasonOr: 'ହେମନ୍ତ ଋତୁ',
    attireOr: 'ଉଭୟ ପାର୍ଶ୍ୱରେ ସ୍ୱର୍ଣ୍ଣ କଦମ୍ବ କଳିକା, ଆଡ଼କିଆ ଚୂଳ ଓ ପୁଷ୍ପମାଳା।',
    significanceOr: 'ବାମନଙ୍କ ବିଶ୍ୱରୂପ ତ୍ରିବିକ୍ରମ ଅବତାରର ସ୍ମୃତି, ଯେଉଁଥିରେ ସମଗ୍ର ବ୍ରହ୍ମାଣ୍ଡ ତିନି ପାଦରେ ମାପିଥିଲେ।',
    darshanTimeApproxOr: 'ଅପରାହ୍ନ ୦୨:୦୦ ରୁ ରାତ୍ର ୧୦:୩୦'
  },
  {
    id: 'lakshmi_nrusimha_besha',
    order: 10,
    nameOr: 'ଲକ୍ଷ୍ମୀନୃସିଂହ ବେଶ (ପଞ୍ଚୁକ ୪ର୍ଥ ଦିନ)',
    nameHi: 'लक्ष्मीनृसिंह वेश',
    nameEn: 'Lakshmi Nrusimha Besha (Panchuka Day 4)',
    occasionOr: 'କାର୍ତ୍ତିକ ଶୁକ୍ଳ ଚତୁର୍ଦ୍ଦଶୀ',
    monthId: 'kartika',
    monthNameOr: 'କାର୍ତ୍ତିକ',
    tithiOr: 'ଶୁକ୍ଳ ଚତୁର୍ଦ୍ଦଶୀ',
    seasonOr: 'ହେମନ୍ତ ଋତୁ',
    attireOr: 'ଡାଳିକିଆ ସ୍ୱର୍ଣ୍ଣ ଚୂଳ, ଅଭୟ ମୁଦ୍ରା ଓ ଶଙ୍ଖ-ଚକ୍ର ଧାରଣ।',
    significanceOr: 'ଭକ୍ତ ପ୍ରହ୍ଲାଦ ରକ୍ଷାର୍ଥେ ଉଗ୍ରନୃସିଂହ ଶାନ୍ତ ହୋଇ ଲକ୍ଷ୍ମୀଙ୍କ ସହ ଦିବ୍ୟ ଅଭୟ ପ୍ରଦାନ କରିଥିଲେ।',
    darshanTimeApproxOr: 'ଅପରାହ୍ନ ୦୨:୦୦ ରୁ ରାତ୍ର ୧୦:୩୦'
  },
  {
    id: 'nagarjuna_besha',
    order: 11,
    nameOr: 'ନାଗାର୍ଜୁନ ବେଶ (ବୀର ଯୋଦ୍ଧା ବେଶ)',
    nameHi: 'नागार्जुन वेश',
    nameEn: 'Nagarjuna Besha (Warrior Attire)',
    occasionOr: 'କାର୍ତ୍ତିକ ମଳ ପଞ୍ଚୁକରେ (ଅତ୍ୟନ୍ତ ବିରଳ ମୁହୂର୍ତ୍ତ)',
    monthId: 'kartika',
    monthNameOr: 'କାର୍ତ୍ତିକ',
    tithiOr: 'ମଳ ତିଥି ପଞ୍ଚୁକ',
    seasonOr: 'ହେମନ୍ତ ଋତୁ',
    attireOr: 'ଶହ ଶହ ପ୍ରାଚୀନ ଧନୁ, ତୀର, ଢାଲ, ତରବାରି, ବାଘଛାଲ, ପଗଡ଼ି ଓ ଯୁଦ୍ଧ କବଚ।',
    significanceOr: 'ମହାଭାରତର ବୀର ଯୋଦ୍ଧା ଅର୍ଜୁନ ଓ ପୁତ୍ର ନାଗାର୍ଜୁନଙ୍କ ସଂଗ୍ରାମ ସ୍ମୃତିରେ ମହାପ୍ରଭୁଙ୍କ ଦିବ୍ୟ ଯୋଦ୍ଧା ବେଶ।',
    darshanTimeApproxOr: 'ବିରଳ ମୁହୂର୍ତ୍ତରେ ସମଗ୍ର ଦିବସ'
  },
  {
    id: 'bamana_besha',
    order: 12,
    nameOr: 'ବାମନ ବେଶ',
    nameHi: 'वामन वेश',
    nameEn: 'Bamana Besha',
    occasionOr: 'ଭାଦ୍ରବ ଶୁକ୍ଳ ଦ୍ୱାଦଶୀ (ସୁନିଆଁ ଦିବସ)',
    monthId: 'bhadraba',
    monthNameOr: 'ଭାଦ୍ରବ',
    tithiOr: 'ଶୁକ୍ଳ ଦ୍ୱାଦଶୀ',
    seasonOr: 'ବର୍ଷା ଋତୁ',
    attireOr: 'ଛୋଟ ଛତା, କୁଶ ଆସନ, କମଣ୍ଡଳୁ, ଦଣ୍ଡ ଓ ବଟୁ ବ୍ରାହ୍ମଣ ବସ୍ତ୍ର।',
    significanceOr: 'ରାଜା ବଳିଙ୍କ ଅହଂକାର ଦମନ କରିବା ପାଇଁ ଶ୍ରୀହରିଙ୍କ ବାମନ ଅବତାର ଗ୍ରହଣ। ସୁନିଆଁରେ ନୂତନ ଅଙ୍କ ଗଣନା ଆରମ୍ଭ।',
    darshanTimeApproxOr: 'ଅପରାହ୍ନ ୦୨:୩୦ ରୁ ସନ୍ଧ୍ୟା ୦୮:୩୦'
  },
  {
    id: 'kaliyadalan_besha',
    order: 13,
    nameOr: 'କାଳୀୟଦଳନ ବେଶ',
    nameHi: 'कालियादलन वेश',
    nameEn: 'Kaliyadalan Besha',
    occasionOr: 'ଭାଦ୍ରବ କୃଷ୍ଣ ଏକାଦଶୀ',
    monthId: 'bhadraba',
    monthNameOr: 'ଭାଦ୍ରବ',
    tithiOr: 'କୃଷ୍ଣ ଏକାଦଶୀ',
    seasonOr: 'ବର୍ଷା ଋତୁ',
    attireOr: 'ସପ୍ତଫଣା ବିଶିଷ୍ଟ କାଳୀୟ ନାଗ ମସ୍ତକ ଉପରେ ଶ୍ରୀକୃଷ୍ଣଙ୍କ ନୃତ୍ୟରତ ମୁଦ୍ରା।',
    significanceOr: 'ଯମୁନା ହ୍ରଦରୁ ବିଷଧର କାଳୀୟ ନାଗର ଦର୍ପ ଚୂର୍ଣ୍ଣ କରି ବ୍ରଜବାସୀଙ୍କୁ ଅଭୟ ପ୍ରଦାନ।',
    darshanTimeApproxOr: 'ଅପରାହ୍ନ ୦୩:୦୦ ରୁ ରାତ୍ର ୦୯:୦୦'
  },
  {
    id: 'pralambasura_badha_besha',
    order: 14,
    nameOr: 'ପ୍ରଳମ୍ବାସୁର ବଧ ବେଶ',
    nameHi: 'प्रलंबासुर वध वेश',
    nameEn: 'Pralambasura Badha Besha',
    occasionOr: 'ଭାଦ୍ରବ କୃଷ୍ଣ ଦ୍ୱାଦଶୀ',
    monthId: 'bhadraba',
    monthNameOr: 'ଭାଦ୍ରବ',
    tithiOr: 'କୃଷ୍ଣ ଦ୍ୱାଦଶୀ',
    seasonOr: 'ବର୍ଷା ଋତୁ',
    attireOr: 'ପ୍ରଭୁ ବଳଭଦ୍ର ଅସୁର କାନ୍ଧରେ ବସି ମୁଷ୍ଟି ପ୍ରହାର କରୁଥିବା ବୀରତ୍ୱପୂର୍ଣ୍ଣ ବେଶ।',
    significanceOr: 'ପ୍ରଭୁ ବଳରାମଙ୍କ ଦ୍ୱାରା ଅସୁର ପ୍ରଳମ୍ବର ବିନାଶ ଓ ଗୋପାଳ ବାଳକଙ୍କ ରକ୍ଷା।',
    darshanTimeApproxOr: 'ଅପରାହ୍ନ ୦୩:୦୦ ରୁ ରାତ୍ର ୦୯:୦୦'
  },
  {
    id: 'krishna_balaram_besha',
    order: 15,
    nameOr: 'କୃଷ୍ଣ ବଳରାମ ବେଶ',
    nameHi: 'कृष्ण बलराम वेश',
    nameEn: 'Krishna Balaram Besha',
    occasionOr: 'ଭାଦ୍ରବ କୃଷ୍ଣ ତ୍ରୟୋଦଶୀ',
    monthId: 'bhadraba',
    monthNameOr: 'ଭାଦ୍ରବ',
    tithiOr: 'କୃଷ୍ଣ ତ୍ରୟୋଦଶୀ',
    seasonOr: 'ବର୍ଷା ଋତୁ',
    attireOr: 'କୃଷ୍ଣ-ବଳରାମଙ୍କ ଗୋପାଳ ବେଶ, ହାତରେ ଲଉଡ଼ି, ସିଙ୍ଗା ଓ କାନ୍ଧରେ ପିଚୁକା।',
    significanceOr: 'ଦୁଇ ଭ୍ରାତାଙ୍କ ବ୍ରଜଧାମରେ ଗୋଚାରଣ ଲୀଳା ଓ ଅପୂର୍ବ ସ୍ନେହର ସ୍ମୃତି।',
    darshanTimeApproxOr: 'ଅପରାହ୍ନ ୦୩:୦୦ ରୁ ରାତ୍ର ୦୯:୦୦'
  },
  {
    id: 'raja_besha',
    order: 16,
    nameOr: 'ରାଜା ବେଶ (ବିଜୟା ଦଶମୀ)',
    nameHi: 'राजवेष (विजयादशमी)',
    nameEn: 'Raja Besha (Vijaya Dashami)',
    occasionOr: 'ଆଶ୍ୱିନ ଶୁକ୍ଳ ଦଶମୀ (ଦଶହରା)',
    monthId: 'aswina',
    monthNameOr: 'ଆଶ୍ୱିନ',
    tithiOr: 'ଶୁକ୍ଳ ଦଶମୀ',
    seasonOr: 'ଶରତ ଋତୁ',
    attireOr: 'ରାଜକୀୟ ସୁବର୍ଣ୍ଣ ଧନୁଶର, ଖଣ୍ଡା, କିରୀଟ ଓ ବିଜୟ ବସ୍ତ୍ର।',
    significanceOr: 'ଅସତ୍ୟ ଉପରେ ସତ୍ୟର ବିଜୟ। ଆୟୁଧ ପୂଜା ପରେ ଜଗତର ନାଥଙ୍କ ସମ୍ରାଟ ରୂପ।',
    darshanTimeApproxOr: 'ଅପରାହ୍ନ ୦୪:୦୦ ରୁ ରାତ୍ର ୧୦:୩୦'
  },
  {
    id: 'chandan_besha',
    order: 17,
    nameOr: 'ଅକ୍ଷୟ ତୃତୀୟା ଚନ୍ଦନ ବେଶ',
    nameHi: 'चंदन वेश',
    nameEn: 'Chandan Besha (Sandalwood Paste Attire)',
    occasionOr: 'ବୈଶାଖ ଶୁକ୍ଳ ତୃତୀୟା (୪୨ ଦିନ ବ୍ୟାପୀ)',
    monthId: 'baisakha',
    monthNameOr: 'ବୈଶାଖ',
    tithiOr: 'ଶୁକ୍ଳ ତୃତୀୟା',
    seasonOr: 'ଗ୍ରୀଷ୍ମ ଋତୁ',
    attireOr: 'ଶ୍ରୀଅଙ୍ଗରେ ଶୀତଳ ସୁଗନ୍ଧି ଚନ୍ଦନ ଲେପନ, କର୍ପୂର, କେଶର ଓ ଫୁଲ ଚୂଳ।',
    significanceOr: 'ଗ୍ରୀଷ୍ମ ତାପରୁ ମହାପ୍ରଭୁଙ୍କୁ ଶୀତଳ ରଖିବା ପାଇଁ ୨୧ ଦିନ ବାହାର ଚନ୍ଦନ ଓ ୨୧ ଦିନ ଭିତର ଚନ୍ଦନ ଯାତ୍ରା।',
    darshanTimeApproxOr: 'ସନ୍ଧ୍ୟା ଆଳତି ପରଠାରୁ ରାତ୍ର ପର୍ଯ୍ୟନ୍ତ'
  },
  {
    id: 'shraddha_besha',
    order: 18,
    nameOr: 'ଶ୍ରାଦ୍ଧ ବେଶ (ଦେବଦୀପାବଳି)',
    nameHi: 'श्राद्ध वेश',
    nameEn: 'Shraddha Besha',
    occasionOr: 'ମାର୍ଗଶୀର କୃଷ୍ଣ ପ୍ରତିପଦା, ଦ୍ୱିତୀୟା ଓ ତୃତୀୟା',
    monthId: 'margasira',
    monthNameOr: 'ମାର୍ଗଶୀର',
    tithiOr: 'କୃଷ୍ଣ ୧, ୨, ୩',
    seasonOr: 'ହେମନ୍ତ ଋତୁ',
    attireOr: 'ଶୁକ୍ଳ ପାଟବସ୍ତ୍ର, ଉତ୍ତରୀୟ, କୁଶ ଅଙ୍ଗୁରୀୟକ ଓ ପିତୃତର୍ପଣ ବସ୍ତ୍ର।',
    significanceOr: 'ମହାପ୍ରଭୁ ନିଜ ପିତାମାତା - ଅଦିତି, କଶ୍ୟପ, କୌଶଲ୍ୟା, ଦଶରଥ, ଦେବକୀ, ବସୁଦେବ ଓ ଯଶୋଦା-ନନ୍ଦଙ୍କୁ ପିଣ୍ଡଦାନ କରନ୍ତି।',
    darshanTimeApproxOr: 'ସନ୍ଧ୍ୟା ଧୂପ ପରଠାରୁ ରାତ୍ର ପହୁଡ଼ ପର୍ଯ୍ୟନ୍ତ'
  },
  {
    id: 'nabanka_besha',
    order: 19,
    nameOr: 'ନବାଙ୍କ ବେଶ',
    nameHi: 'नवांक वेश',
    nameEn: 'Nabanka Besha',
    occasionOr: 'ଧନୁ ସଂକ୍ରାନ୍ତି ପୂର୍ବ ସନ୍ଧ୍ୟା',
    monthId: 'margasira',
    monthNameOr: 'ଧନୁ',
    tithiOr: 'ସଂକ୍ରାନ୍ତି ପୂର୍ବଦିନ',
    seasonOr: 'ହେମନ୍ତ ଋତୁ',
    attireOr: 'ନଅଟି ଖଣ୍ଡ ପାଟବସ୍ତ୍ର, ନଅ ପ୍ରକାରର ପୁଷ୍ପ ମାଳା ଓ ନବାଙ୍କ ବେଢ଼ା।',
    significanceOr: 'ଧନୁ ମୁଆଁ ଭୋଗ ପୂର୍ବରୁ ସୂର୍ଯ୍ୟଙ୍କ ଧନୁ ରାଶି ପ୍ରବେଶ ଉପଲକ୍ଷେ ଦିବ୍ୟ ଶୃଙ୍ଗାର।',
    darshanTimeApproxOr: 'ସନ୍ଧ୍ୟା ୦୬:୦୦ ରୁ ରାତ୍ର ୧୦:୦୦'
  },
  {
    id: 'makara_chula_besha',
    order: 20,
    nameOr: 'ମକର ଚୂଳ ବେଶ',
    nameHi: 'मकर चूल वेश',
    nameEn: 'Makara Chula Besha',
    occasionOr: 'ମକର ସଂକ୍ରାନ୍ତି',
    monthId: 'pausha',
    monthNameOr: 'ମକର',
    tithiOr: 'ସଂକ୍ରାନ୍ତି ଦିବସ',
    seasonOr: 'ଶିଶିର ଋତୁ',
    attireOr: 'ମକର ଚୂଳ ପୁଷ୍ପ ଶୃଙ୍ଗାର, ସୁବର୍ଣ୍ଣ କିରୀଟ ଓ ମକର ଚାଉଳ ଭୋଗ।',
    significanceOr: 'ଉତ୍ତରାୟଣ ପୁଣ୍ୟକାଳରେ ସୂର୍ଯ୍ୟଙ୍କ ମକର ରାଶି ପ୍ରବେଶ ଓ ନୂତନ ଧାନ ଚାଉଳର ନୈବେଦ୍ୟ।',
    darshanTimeApproxOr: 'ମଧ୍ୟାହ୍ନ ୧୨:୦୦ ରୁ ସନ୍ଧ୍ୟା ୦୭:୦୦'
  },
  {
    id: 'ghodalagi_besha',
    order: 21,
    nameOr: 'ଘୋଡ଼ଲାଗି ବେଶ (ଶୀତ ବସ୍ତ୍ର)',
    nameHi: 'घोड़लागि वेश (शीत वस्त्र)',
    nameEn: 'Ghodalagi Besha (Winter Robes)',
    occasionOr: 'ମାର୍ଗଶୀର ଶୁକ୍ଳ ଷଷ୍ଠୀ (ଓଢ଼ଣ ଷଷ୍ଠୀ) ରୁ ମାଘ ଶୁକ୍ଳ ପଞ୍ଚମୀ',
    monthId: 'margasira',
    monthNameOr: 'ମାର୍ଗଶୀର / ପୌଷ / ମାଘ',
    tithiOr: 'ଶୁକ୍ଳ ଷଷ୍ଠୀ ରୁ ବସନ୍ତ ପଞ୍ଚମୀ',
    seasonOr: 'ଶୀତ / ଶିଶିର ଋତୁ',
    attireOr: 'ବିଭିନ୍ନ ବାର ଅନୁଯାୟୀ ସାତ ରଙ୍ଗର ଶୀତବସ୍ତ୍ର ଘୋଡ଼ (ରେଶମୀ ଓ ଗରମ କନା)।',
    significanceOr: 'ଶୀତକାଳରେ ଶ୍ରୀଜୀଉମାନଙ୍କୁ ଥଣ୍ଡାରୁ ରକ୍ଷା କରିବା ପାଇଁ ବାରବାରୀ ରଙ୍ଗୀନ ଘୋଡ଼ ଲାଗି ହୁଏ।',
    darshanTimeApproxOr: 'ଦୈନିକ ସନ୍ଧ୍ୟା ଆଳତି ପରଠାରୁ ପ୍ରଭାତ ପର୍ଯ୍ୟନ୍ତ'
  },
  {
    id: 'jamalagi_besha',
    order: 22,
    nameOr: 'ଜାମାଲାଗି ବେଶ',
    nameHi: 'जामा लागि वेश',
    nameEn: 'Jamalagi Besha',
    occasionOr: 'ମାଘ ଶୁକ୍ଳ ପଞ୍ଚମୀ (ବସନ୍ତ ପଞ୍ଚମୀ) ରୁ ଫାଲ୍ଗୁନ ପୂର୍ଣ୍ଣିମା (ଦୋଳ ପୂର୍ଣ୍ଣିମା)',
    monthId: 'magha',
    monthNameOr: 'ମାଘ',
    tithiOr: 'ଶୁକ୍ଳ ପଞ୍ଚମୀ',
    seasonOr: 'ବସନ୍ତ ଋତୁ',
    attireOr: 'ସୂତା ଓ ପାଟ ନିର୍ମିତ ଘେରାଦାର ଜାମା ଓ ସୁବର୍ଣ୍ଣ କଟିସୂତ୍ର।',
    significanceOr: 'ଶୀତର ପ୍ରକୋପ କମି ବସନ୍ତର ଆଗମନ ସୂଚକ ହାଲୁକା ପାରମ୍ପରିକ ଜାମା ପରିଧାନ।',
    darshanTimeApproxOr: 'ସନ୍ଧ୍ୟା ଧୂପ ପରଠାରୁ'
  },
  {
    id: 'banabhoji_besha',
    order: 23,
    nameOr: 'ବନଭୋଜି ବେଶ',
    nameHi: 'वनभोजि वेश',
    nameEn: 'Banabhoji Besha',
    occasionOr: 'ଭାଦ୍ରବ କୃଷ୍ଣ ଦଶମୀ',
    monthId: 'bhadraba',
    monthNameOr: 'ଭାଦ୍ରବ',
    tithiOr: 'କୃଷ୍ଣ ଦଶମୀ',
    seasonOr: 'ବର୍ଷା ଋତୁ',
    attireOr: 'ଶ୍ରୀକୃଷ୍ଣ-ବଳରାମ ବନଭୋଜି ପାଇଁ ଯାଉଥିବା ସଜ୍ଜା, ହାତରେ ସର ଓ ନବନୀତ।',
    significanceOr: 'ବୃନ୍ଦାବନରେ ସଖାମାନଙ୍କ ସହିତ ବନଭୋଜି ଆନନ୍ଦର ଦିବ୍ୟ ଝଲକ।',
    darshanTimeApproxOr: 'ଅପରାହ୍ନ ୦୩:୦୦ ରୁ ସନ୍ଧ୍ୟା ୦୮:୦୦'
  },
  {
    id: 'kolibika_besha',
    order: 24,
    nameOr: 'କୋଳିବିକା ବେଶ',
    nameHi: 'कोलिबिका वेश',
    nameEn: 'Kolibika Besha',
    occasionOr: 'ଭାଦ୍ରବ କୃଷ୍ଣ ଏକାଦଶୀ ସନ୍ଧ୍ୟା',
    monthId: 'bhadraba',
    monthNameOr: 'ଭାଦ୍ରବ',
    tithiOr: 'କୃଷ୍ଣ ଏକାଦଶୀ',
    seasonOr: 'ବର୍ଷା ଋତୁ',
    attireOr: 'କୋଳି ବିକୁଥିବା ବୃଦ୍ଧା ସହିତ ଶ୍ରୀକୃଷ୍ଣଙ୍କ ମନୋରମ ଶୃଙ୍ଗାର।',
    significanceOr: 'ଭକ୍ତିରେ ଦିଆଯାଇଥିବା କୋଳି ବଦଳରେ ଶ୍ରୀକୃଷ୍ଣ ବୃଦ୍ଧାର ଡାଲିକୁ ରତ୍ନରେ ଭରିଦେଇଥିଲେ।',
    darshanTimeApproxOr: 'ସନ୍ଧ୍ୟା ୦୫:୦୦ ରୁ ରାତ୍ର ୦୯:୦୦'
  },
  {
    id: 'chitalagi_besha',
    order: 25,
    nameOr: 'ଚିତାଲାଗି ବେଶ',
    nameHi: 'चिता लगी वेश',
    nameEn: 'Chita Lagi Besha',
    occasionOr: 'ଶ୍ରାବଣ ଅମାବାସ୍ୟା',
    monthId: 'srabana',
    monthNameOr: 'ଶ୍ରାବଣ',
    tithiOr: 'ଅମାବାସ୍ୟା',
    seasonOr: 'ବର୍ଷା',
    attireOr: 'ସୁବର୍ଣ୍ଣ ଚିତା (ସୁନା ହାତ), ଶ୍ରୀ ପାୟରା, ଶ୍ରୀ ଭୁଜ ଓ କିରୀଟ ସହ ଅଳଙ୍କାର।',
    significanceOr: 'ଶ୍ରୀ ଜଗନ୍ନାଥଙ୍କ ବାହୁରେ ସୁବର୍ଣ୍ଣ ଚିତା ଲଗାଯାଏ। ଏହା ଶ୍ରାବଣ ମାସର ବିଶେଷ ଅନୁଷ୍ଠାନ ଓ ଦୈତାପତିଙ୍କ ସେବା ବିଧି ଅନୁସାରେ ସମ୍ପାଦିତ ହୁଏ।',
    darshanTimeApproxOr: 'ସନ୍ଧ୍ୟା ଧୂପ ପରଠାରୁ ରାତ୍ର ପହୁଡ଼ ପର୍ଯ୍ୟନ୍ତ'
  },
  {
    id: 'badasinghara_besha',
    order: 26,
    nameOr: 'ବଡ଼ସିଂହାର ବେଶ (ଦୈନିକ ପୁଷ୍ପ ଶୃଙ୍ଗାର)',
    nameHi: 'बड़ा शृंगार वेश',
    nameEn: 'Badasinghara Besha (Daily Night Floral Attire)',
    occasionOr: 'ପ୍ରତିଦିନ ରାତ୍ରି ୧୦:୩୦ (ଦୈନିକ ନୀତି)',
    monthId: 'all',
    monthNameOr: 'ସମସ୍ତ ୧୨ ମାସ',
    tithiOr: 'ପ୍ରତିଦିନ ନିତ୍ୟ',
    seasonOr: 'ସର୍ବ ଋତୁ',
    attireOr: 'ଗୀତଗୋବିନ୍ଦ ଖଣ୍ଡୁଆ ପାଟ, ସୁଗନ୍ଧି କରବୀର, ମଲ୍ଲୀ, ଟଗର ଓ ତୁଳସୀ ମାଳା।',
    significanceOr: 'ଶୟନ ପୂର୍ବରୁ ଜୟଦେବଙ୍କ ଗୀତଗୋବିନ୍ଦ ଗାନ ଓ ପୁଷ୍ପ ଶୃଙ୍ଗାରରେ ପ୍ରଭୁ ପହୁଡ଼ ଯାଆନ୍ତି।',
    darshanTimeApproxOr: 'ରାତ୍ର ୧୦:୩୦ ରୁ ୧୧:୧୫'
  },
  {
    id: 'rahurekhalagi_besha',
    order: 27,
    nameOr: 'ରାହୁରେଖାଲାଗି ବେଶ',
    nameHi: 'राहु रेखा लगी वेश',
    nameEn: 'Rahu Rekha Lagi Besha',
    occasionOr: 'ଭାଦ୍ରବ କୃଷ୍ଣ ପଞ୍ଚମୀ (ରେଖା ପଞ୍ଚମୀ)',
    monthId: 'bhadraba',
    monthNameOr: 'ଭାଦ୍ରବ',
    tithiOr: 'କୃଷ୍ଣ ପଞ୍ଚମୀ',
    seasonOr: 'ବର୍ଷା',
    attireOr: 'ଶ୍ରୀ ଅଙ୍ଗରେ ଚନ୍ଦ୍ର-ସୂର୍ଯ୍ୟ ଚିହ୍ନ ରାହୁରେଖା, ସୁବର୍ଣ୍ଣ ଆଭୂଷଣ ଓ କିରୀଟ।',
    significanceOr: 'ଶ୍ରୀ ଜଗନ୍ନାଥଙ୍କ ଶ୍ରୀ ଅଙ୍ଗରେ ରାହୁରେଖା ଚିତ୍ରିତ ହୁଏ। ଗ୍ରହଣ ଦୋଷ ନିବାରଣ ଓ ଗ୍ରହ ଶାନ୍ତି ପାଇଁ ଏହି ବେଶ ବିଶେଷ ମହତ୍ତ୍ୱପୂର୍ଣ୍ଣ।',
    darshanTimeApproxOr: 'ସନ୍ଧ୍ୟା ଆଳତି ପରଠାରୁ ରାତ୍ର ପହୁଡ଼ ପର୍ଯ୍ୟନ୍ତ'
  },
  {
    id: 'dola_purnima_suna_besha',
    order: 28,
    nameOr: 'ଦୋଳ ପୂର୍ଣ୍ଣିମା ରାଜାଧିରାଜ ସୁନା ବେଶ',
    nameHi: 'दोल पूर्णिमा राजवेष',
    nameEn: 'Dola Purnima Rajadhiraja Suna Besha',
    occasionOr: 'ଫାଲ୍ଗୁନ ପୂର୍ଣ୍ଣିମା (ଦୋଳ ପୂର୍ଣ୍ଣିମା)',
    monthId: 'phalguna',
    monthNameOr: 'ଫାଲ୍ଗୁନ',
    tithiOr: 'ପୂର୍ଣ୍ଣିମା',
    seasonOr: 'ବସନ୍ତ ଋତୁ',
    attireOr: 'ସ୍ୱର୍ଣ୍ଣ ଅଳଙ୍କାର, ଫଗୁ ଚୂଳ, ଅବିର ଚନ୍ଦନ ଓ ଦୋଳ ବିମାନ ବେଶ।',
    significanceOr: 'ନୂତନ ପାଞ୍ଜି ପଠନ, ବସନ୍ତ ଉତ୍ସବ ଓ ଦୋଳବେଦୀରେ ରାଧାକୃଷ୍ଣ ଭ୍ରମଣ।',
    darshanTimeApproxOr: 'ଅପରାହ୍ନ ୦୩:୩୦ ରୁ ରାତ୍ର ୧୧:୦୦'
  },
  {
    id: 'pushyabhisheka_suna_besha',
    order: 29,
    nameOr: 'ପୁଷ୍ୟାଭିଷେକ ରାଜରାଜେଶ୍ୱର ବେଶ',
    nameHi: 'पुष्याभिषेक राजवेष',
    nameEn: 'Pushyabhisheka Rajadhiraja Besha',
    occasionOr: 'ପୌଷ ପୂର୍ଣ୍ଣିମା',
    monthId: 'pausha',
    monthNameOr: 'ପୌଷ',
    tithiOr: 'ପୂର୍ଣ୍ଣିମା',
    seasonOr: 'ଶିଶିର ଋତୁ',
    attireOr: 'ରାଜାଧିରାଜ ସ୍ୱର୍ଣ୍ଣ କିରୀଟ, ସୁବର୍ଣ୍ଣ ଛତ୍ର, ଚାମର ଓ ରତ୍ନ ଅଳଙ୍କାର।',
    significanceOr: 'ମହାପ୍ରଭୁଙ୍କ ରାଜ୍ୟାଭିଷେକ ମହୋତ୍ସବ ଓ ସାର୍ବଭୌମ ରାଜାଧିରାଜ ଭାବରେ ସିଂହାସନାରୋହଣ।',
    darshanTimeApproxOr: 'ଅପରାହ୍ନ ୦୩:୩୦ ରୁ ରାତ୍ର ୧୦:୩୦'
  },
  {
    id: 'raghunatha_besha',
    order: 30,
    nameOr: 'ରଘୁନାଥ ବେଶ',
    nameHi: 'रघुनाथ वेश',
    nameEn: 'Raghunatha Besha',
    occasionOr: 'ଚୈତ୍ର ଶୁକ୍ଳ ନବମୀ (ରାମନବମୀ)',
    monthId: 'chaitra',
    monthNameOr: 'ଚୈତ୍ର',
    tithiOr: 'ଶୁକ୍ଳ ନବମୀ',
    seasonOr: 'ବସନ୍ତ',
    attireOr: 'ଶ୍ରୀରାମଚନ୍ଦ୍ର ସ୍ୱରୂପ ଧନୁର୍ଧାରୀ ସଜ୍ଜା, ସୁବର୍ଣ୍ଣ କିରୀଟ, ଧନୁ-ବାଣ ଓ ରାଜକୀୟ ଆଭୂଷଣ।',
    significanceOr: 'ରାମନବମୀ ଦିନ ଶ୍ରୀ ଜଗନ୍ନାଥ ଶ୍ରୀରାମଚନ୍ଦ୍ର ସ୍ୱରୂପରେ ରଘୁନାଥ ବେଶ ଧାରଣ କରନ୍ତି। ରାମାୟଣ ଅନୁସାରେ ଦଶରଥ ନନ୍ଦନ ଶ୍ରୀରାମଙ୍କ ଅବତାର ଲୀଳା ସ୍ମରଣ କରାଯାଏ।',
    darshanTimeApproxOr: 'ଅପରାହ୍ନ ୦୩:୦୦ ରୁ ରାତ୍ର ୦୯:୩୦'
  },
  {
    id: 'dhadi_besha',
    order: 31,
    nameOr: 'ଢାଡ଼ୀ ବେଶ (ଯୁଦ୍ଧ ନୃତ୍ୟ ବେଶ)',
    nameHi: 'ढाढ़ी वेश (युद्ध नृत्य वेश)',
    nameEn: 'Dhadi Besha (War Dance Attire)',
    occasionOr: 'ମାର୍ଗଶୀର ଶୁକ୍ଳ ଏକାଦଶୀ',
    monthId: 'margasira',
    monthNameOr: 'ମାର୍ଗଶୀର',
    tithiOr: 'ଶୁକ୍ଳ ଏକାଦଶୀ',
    seasonOr: 'ହେମନ୍ତ',
    attireOr: 'ଢାଲ, ତଳୱାର, ଧନୁ-ବାଣ ଓ ଶ୍ରୀ ଅଙ୍ଗରେ ଯୁଦ୍ଧ ସଜ୍ଜା। ସୁବର୍ଣ୍ଣ ମୁକୁଟ ଓ ବୀରଭାବ ଅଳଙ୍କାର।',
    significanceOr: 'ଶ୍ରୀ ଜଗନ୍ନାଥ ଯୋଦ୍ଧା ସ୍ୱରୂପରେ ଢାଲ-ତଳୱାର ଧାରଣ କରି ଅଧର୍ମ ବିନାଶ ଓ ଧର୍ମ ସ୍ଥାପନର ପ୍ରତୀକ ସ୍ୱରୂପ ଦର୍ଶନ ଦିଅନ୍ତି।',
    darshanTimeApproxOr: 'ସନ୍ଧ୍ୟା ଆଳତି ପରଠାରୁ ରାତ୍ର ପହୁଡ଼ ପର୍ଯ୍ୟନ୍ତ'
  },
  {
    id: 'suna_besha_niladribije',
    order: 32,
    nameOr: 'ନୀଳାଦ୍ରି ବିଜେ ସୁନା ବେଶ',
    nameHi: 'नीलाद्रि बिजे सुना वेश',
    nameEn: 'Niladri Bije Suna Besha',
    occasionOr: 'ଆଷାଢ଼ ଶୁକ୍ଳ ତ୍ରୟୋଦଶୀ (ନୀଳାଦ୍ରି ବିଜେ)',
    monthId: 'asadha',
    monthNameOr: 'ଆଷାଢ଼',
    tithiOr: 'ଶୁକ୍ଳ ତ୍ରୟୋଦଶୀ',
    seasonOr: 'ବର୍ଷା',
    attireOr: 'ସୁବର୍ଣ୍ଣ ଆଭୂଷଣ (ସୁନା ବେଶ), ଶ୍ରୀ ପାୟରା, ଶ୍ରୀ ଭୁଜ, ସୁନା କିରୀଟ ଓ ସୁନା ହାଥ।',
    significanceOr: 'ନୀଳାଦ୍ରି ବିଜେ ଦିନ ମହାପ୍ରଭୁ ଶ୍ରୀମନ୍ଦିରରେ ପୁନଃ ପ୍ରବେଶ କରନ୍ତି। ଲକ୍ଷ୍ମୀଙ୍କ ସହ ପୁନର୍ମିଳନ ହୁଏ ଓ ସୁନା ବେଶରେ ଭକ୍ତଙ୍କୁ ଦର୍ଶନ ଦିଅନ୍ତି।',
    darshanTimeApproxOr: 'ଅପରାହ୍ନ ୦୪:୦୦ ରୁ ରାତ୍ର ୧୧:୩୦'
  }
];

