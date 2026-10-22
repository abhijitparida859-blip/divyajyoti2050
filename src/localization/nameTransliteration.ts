/**
 * Authentic Trilingual Name Transliteration Engine (English ↔ Odia ↔ Hindi)
 *
 * Supports:
 * 1. Comprehensive bidirectional dictionary of 200+ Odia & Indian surnames, first names, and honorifics.
 * 2. Rule-based phonetic transliteration fallback for arbitrary names.
 * 3. Script detection & bidirectional conversion (English, Hindi/Devanagari, and Odia).
 * 4. Odia-specific orthographic conventions (e.g. Parida → ପରିଡ଼ା, Swain → ସ୍ୱାଇଁ, Mohanty → ମହାନ୍ତି).
 */

import { devanagariToOdia } from './odiaTranslit';

export interface TrilingualName {
  en: string;
  hi: string;
  or: string;
}

// Canonical dictionary for common Odia and Indian names/surnames
const NAME_DICTIONARY: Record<string, { hi: string; or: string; enCanonical?: string }> = {
  // --- Honorifics & Titles ---
  shri: { hi: 'श्री', or: 'ଶ୍ରୀ', enCanonical: 'Shri' },
  sri: { hi: 'श्री', or: 'ଶ୍ରୀ', enCanonical: 'Sri' },
  smt: { hi: 'श्रीमती', or: 'ଶ୍ରୀମତୀ', enCanonical: 'Smt.' },
  shrimati: { hi: 'श्रीमती', or: 'ଶ୍ରୀମତୀ', enCanonical: 'Shrimati' },
  srimati: { hi: 'श्रीमती', or: 'ଶ୍ରୀମତୀ', enCanonical: 'Srimati' },
  kumari: { hi: 'कुमारी', or: 'କୁମାରୀ', enCanonical: 'Kumari' },
  dr: { hi: 'डॉ.', or: 'ଡା.', enCanonical: 'Dr.' },

  // --- Surnames (Odisha & Pan-India) ---
  parida: { hi: 'परिडा', or: 'ପରିଡ଼ା', enCanonical: 'Parida' },
  mohanty: { hi: 'मोहंती', or: 'ମହାନ୍ତି', enCanonical: 'Mohanty' },
  mahanty: { hi: 'मोहंती', or: 'ମହାନ୍ତି', enCanonical: 'Mahanty' },
  sahoo: { hi: 'साहू', or: 'ସାହୁ', enCanonical: 'Sahoo' },
  sahu: { hi: 'साहू', or: 'ସାହୁ', enCanonical: 'Sahu' },
  nayak: { hi: 'नायक', or: 'ନାୟକ', enCanonical: 'Nayak' },
  naik: { hi: 'नायक', or: 'ନାୟକ', enCanonical: 'Naik' },
  das: { hi: 'दास', or: 'ଦାସ', enCanonical: 'Das' },
  dash: { hi: 'दाश', or: 'ଦାଶ', enCanonical: 'Dash' },
  mishra: { hi: 'मिश्रा', or: 'ମିଶ୍ର', enCanonical: 'Mishra' },
  misra: { hi: 'मिश्रा', or: 'ମିଶ୍ର', enCanonical: 'Misra' },
  patnaik: { hi: 'पट्टनायक', or: 'ପଟ୍ଟନାୟକ', enCanonical: 'Patnaik' },
  pattnaik: { hi: 'पट्टनायक', or: 'ପଟ୍ଟନାୟକ', enCanonical: 'Pattnaik' },
  tripathy: { hi: 'त्रिपाठी', or: 'ତ୍ରିପାଠୀ', enCanonical: 'Tripathy' },
  tripathi: { hi: 'त्रिपाठी', or: 'ତ୍ରିପାଠୀ', enCanonical: 'Tripathi' },
  rout: { hi: 'राउत', or: 'ରାଉତ', enCanonical: 'Rout' },
  raut: { hi: 'राउत', or: 'ରାଉତ', enCanonical: 'Raut' },
  behera: { hi: 'बेहेरा', or: 'ବେହେରା', enCanonical: 'Behera' },
  pradhan: { hi: 'प्रधान', or: 'ପ୍ରଧାନ', enCanonical: 'Pradhan' },
  panda: { hi: 'पंडा', or: 'ପଣ୍ଡା', enCanonical: 'Panda' },
  panigrahi: { hi: 'पाणिग्राही', or: 'ପାଣିଗ୍ରାହୀ', enCanonical: 'Panigrahi' },
  mohapatra: { hi: 'महापात्र', or: 'ମହାପାତ୍ର', enCanonical: 'Mohapatra' },
  mahapatra: { hi: 'महापात्र', or: 'ମହାପାତ୍ର', enCanonical: 'Mahapatra' },
  senapati: { hi: 'सेनापति', or: 'ସେନାପତି', enCanonical: 'Senapati' },
  samal: { hi: 'सामल', or: 'ସାମଲ', enCanonical: 'Samal' },
  jena: { hi: 'जेना', or: 'ଜେନା', enCanonical: 'Jena' },
  swain: { hi: 'स्वांई', or: 'ସ୍ୱାଇଁ', enCanonical: 'Swain' },
  barik: { hi: 'बारिक', or: 'ବାରିକ', enCanonical: 'Barik' },
  biswal: { hi: 'बिश्वाल', or: 'ବିଶ୍ୱାଳ', enCanonical: 'Biswal' },
  majhi: { hi: 'माझी', or: 'ମାଝି', enCanonical: 'Majhi' },
  mallik: { hi: 'मल्लिक', or: 'ମଲ୍ଲିକ', enCanonical: 'Mallik' },
  malik: { hi: 'मलिक', or: 'ମଲିକ', enCanonical: 'Malik' },
  sethi: { hi: 'सेठी', or: 'ସେଠୀ', enCanonical: 'Sethi' },
  sethy: { hi: 'सेठी', or: 'ସେଠୀ', enCanonical: 'Sethy' },
  singh: { hi: 'सिंह', or: 'ସିଂହ', enCanonical: 'Singh' },
  singha: { hi: 'सिंघा', or: 'ସିଂହ', enCanonical: 'Singha' },
  padhi: { hi: 'पाढ़ी', or: 'ପାଢ଼ୀ', enCanonical: 'Padhi' },
  padhy: { hi: 'पाढ़ी', or: 'ପାଢ଼ୀ', enCanonical: 'Padhy' },
  acharya: { hi: 'आचार्य', or: 'ଆଚାର୍ଯ୍ୟ', enCanonical: 'Acharya' },
  lenka: { hi: 'लेंका', or: 'ଲେଙ୍କା', enCanonical: 'Lenka' },
  kar: { hi: 'कर', or: 'କର', enCanonical: 'Kar' },
  khuntia: { hi: 'खुंटिया', or: 'ଖୁଣ୍ଟିଆ', enCanonical: 'Khuntia' },
  khatua: { hi: 'खटुआ', or: 'ଖଟୁଆ', enCanonical: 'Khatua' },
  choudhury: { hi: 'चौधरी', or: 'ଚୌଧୁରୀ', enCanonical: 'Choudhury' },
  chowdhury: { hi: 'चौधरी', or: 'ଚୌଧୁରୀ', enCanonical: 'Chowdhury' },
  chhotray: { hi: 'छोटराय', or: 'ଛୋଟରାୟ', enCanonical: 'Chhotray' },
  chhotaray: { hi: 'छोटराय', or: 'ଛୋଟରାୟ', enCanonical: 'Chhotaray' },
  muduli: { hi: 'मुदुलि', or: 'ମୁଦୁଲି', enCanonical: 'Muduli' },
  nanda: { hi: 'नंद', or: 'ନନ୍ଦ', enCanonical: 'Nanda' },
  rath: { hi: 'रथ', or: 'ରଥ', enCanonical: 'Rath' },
  ratha: { hi: 'रथ', or: 'ରଥ', enCanonical: 'Ratha' },
  ray: { hi: 'राय', or: 'ରାୟ', enCanonical: 'Ray' },
  roy: { hi: 'राय', or: 'ରାୟ', enCanonical: 'Roy' },
  satapathy: { hi: 'शतपथी', or: 'ଶତପଥୀ', enCanonical: 'Satapathy' },
  satpathy: { hi: 'शतपथी', or: 'ଶତପଥୀ', enCanonical: 'Satpathy' },
  sharma: { hi: 'शर्मा', or: 'ଶର୍ମା', enCanonical: 'Sharma' },
  verma: { hi: 'वर्मा', or: 'ବର୍ମା', enCanonical: 'Verma' },
  gupta: { hi: 'गुप्त', or: 'ଗୁପ୍ତ', enCanonical: 'Gupta' },
  yadav: { hi: 'यादव', or: 'ଯାଦବ', enCanonical: 'Yadav' },
  ghosh: { hi: 'घोष', or: 'ଘୋଷ', enCanonical: 'Ghosh' },
  bhowmik: { hi: 'भौमिक', or: 'ଭୌମିକ', enCanonical: 'Bhowmik' },
  bhowmick: { hi: 'भौमिक', or: 'ଭୌମିକ', enCanonical: 'Bhowmick' },
  bhattacharya: { hi: 'भट्टाचार्य', or: 'ଭଟ୍ଟାଚାର୍ଯ୍ୟ', enCanonical: 'Bhattacharya' },
  samantaray: { hi: 'सामंतराय', or: 'ସାମନ୍ତରାୟ', enCanonical: 'Samantaray' },
  mansingh: { hi: 'मानसिंह', or: 'ମାନସିଂହ', enCanonical: 'Mansingh' },
  dalai: { hi: 'दलाई', or: 'ଦଳାଇ', enCanonical: 'Dalai' },
  tarai: { hi: 'तराई', or: 'ତରାଇ', enCanonical: 'Tarai' },
  pal: { hi: 'पाल', or: 'ପାଲ', enCanonical: 'Pal' },
  giri: { hi: 'गिरी', or: 'ଗିରି', enCanonical: 'Giri' },
  dhal: { hi: 'धल', or: 'ଧଳ', enCanonical: 'Dhal' },
  dhir: { hi: 'धीर', or: 'ଧୀର', enCanonical: 'Dhir' },
  bal: { hi: 'बल', or: 'ବଳ', enCanonical: 'Bal' },
  routray: { hi: 'राउतराय', or: 'ରାଉତରାୟ', enCanonical: 'Routray' },
  paikray: { hi: 'पाइकराय', or: 'ପାଇକରାୟ', enCanonical: 'Paikray' },
  harichandan: { hi: 'हरिचंदन', or: 'ହରିଚନ୍ଦନ', enCanonical: 'Harichandan' },
  mardaraj: { hi: 'मर्दराज', or: 'ମର୍ଦ୍ଦରାଜ', enCanonical: 'Mardaraj' },
  bahinipati: { hi: 'वाहिनीपति', or: 'ବାହିନୀପତି', enCanonical: 'Bahinipati' },
  pati: { hi: 'पति', or: 'ପତି', enCanonical: 'Pati' },
  dani: { hi: 'दानी', or: 'ଦାନୀ', enCanonical: 'Dani' },
  brahma: { hi: 'ब्रह्मा', or: 'ବ୍ରହ୍ମା', enCanonical: 'Brahma' },
  sarangi: { hi: 'षडंगी', or: 'ଷଡ଼ଙ୍ଗୀ', enCanonical: 'Sarangi' },
  upadhyay: { hi: 'उपाध्याय', or: 'ଉପାଧ୍ୟାୟ', enCanonical: 'Upadhyay' },
  upadhyaya: { hi: 'उपाध्याय', or: 'ଉପାଧ୍ୟାୟ', enCanonical: 'Upadhyaya' },
  hota: { hi: 'होता', or: 'ହୋତା', enCanonical: 'Hota' },
  joshi: { hi: 'जोशी', or: 'ଯୋଶୀ', enCanonical: 'Joshi' },
  praharaj: { hi: 'प्रहराज', or: 'ପ୍ରହରାଜ', enCanonical: 'Praharaj' },
  dixit: { hi: 'दीक्षित', or: 'ଦୀକ୍ଷିତ', enCanonical: 'Dixit' },
  dikshit: { hi: 'दीक्षित', or: 'ଦୀକ୍ଷିତ', enCanonical: 'Dikshit' },
  dwivedi: { hi: 'द्विवेदी', or: 'ଦ୍ୱିବେଦୀ', enCanonical: 'Dwivedi' },
  tiwari: { hi: 'तिवारी', or: 'ତିୱାରୀ', enCanonical: 'Tiwari' },
  tewari: { hi: 'तिवारी', or: 'ତିୱାରୀ', enCanonical: 'Tewari' },
  dube: { hi: 'दुबे', or: 'ଦୁବେ', enCanonical: 'Dube' },
  dubey: { hi: 'दुबे', or: 'ଦୁବେ', enCanonical: 'Dubey' },
  shukla: { hi: 'शुक्ल', or: 'ଶୁକ୍ଳ', enCanonical: 'Shukla' },
  pandey: { hi: 'पांडे', or: 'ପାଣ୍ଡେ', enCanonical: 'Pandey' },
  agrawal: { hi: 'अग्रवाल', or: 'ଅଗ୍ରୱାଲ', enCanonical: 'Agrawal' },
  agarwal: { hi: 'अग्रवाल', or: 'ଅଗ୍ରୱାଲ', enCanonical: 'Agarwal' },
  agarwalla: { hi: 'अग्रवाल', or: 'ଅଗ୍ରୱାଲ', enCanonical: 'Agarwalla' },
  meher: { hi: 'मेहेर', or: 'ମେହେର', enCanonical: 'Meher' },
  suna: { hi: 'सुना', or: 'ସୁନା', enCanonical: 'Suna' },
  bag: { hi: 'बाग', or: 'ବାଗ', enCanonical: 'Bag' },
  kumbhar: { hi: 'कुम्हार', or: 'କୁମ୍ଭାର', enCanonical: 'Kumbhar' },
  kamila: { hi: 'कामीला', or: 'କାମିଳା', enCanonical: 'Kamila' },
  saraf: { hi: 'सराफ', or: 'ସରାଫ', enCanonical: 'Saraf' },
  subudhi: { hi: 'सुबुद्धि', or: 'ସୁବୁଦ୍ଧି', enCanonical: 'Subudhi' },
  maharana: { hi: 'महाराणा', or: 'ମହାରଣା', enCanonical: 'Maharana' },
  bindhani: { hi: 'बिंधाणी', or: 'ବିନ୍ଧାଣୀ', enCanonical: 'Bindhani' },
  ojha: { hi: 'ओझा', or: 'ଓଝା', enCanonical: 'Ojha' },
  maharatha: { hi: 'महारथा', or: 'ମହାରଥା', enCanonical: 'Maharatha' },
  prusti: { hi: 'पृष्टि', or: 'ପୃଷ୍ଟି', enCanonical: 'Prusti' },
  srichandan: { hi: 'श्रीचंदन', or: 'ଶ୍ରୀଚନ୍ଦନ', enCanonical: 'Srichandan' },
  sundaray: { hi: 'सुंदराय', or: 'ସୁନ୍ଦରାୟ', enCanonical: 'Sundaray' },
  jagadev: { hi: 'जगदेव', or: 'ଜଗଦେବ', enCanonical: 'Jagadev' },
  gajapati: { hi: 'गजपति', or: 'ଗଜପତି', enCanonical: 'Gajapati' },

  // --- Given Names (First & Middle) ---
  abhijit: { hi: 'अभिजीत', or: 'ଅଭିଜିତ୍', enCanonical: 'Abhijit' },
  abhijith: { hi: 'अभिजीत', or: 'ଅଭିଜିତ୍', enCanonical: 'Abhijith' },
  satyajit: { hi: 'सत्यजीत', or: 'ସତ୍ୟଜିତ୍', enCanonical: 'Satyajit' },
  soumya: { hi: 'सौम्य', or: 'ସୌମ୍ୟ', enCanonical: 'Soumya' },
  saumya: { hi: 'सौम्य', or: 'ସୌମ୍ୟ', enCanonical: 'Saumya' },
  ranjan: { hi: 'रंजन', or: 'ରଞ୍ଜନ', enCanonical: 'Ranjan' },
  rashmi: { hi: 'रश्मि', or: 'ରଶ୍ମି', enCanonical: 'Rashmi' },
  rekha: { hi: 'रेखा', or: 'ରେଖା', enCanonical: 'Rekha' },
  priyanka: { hi: 'प्रियंका', or: 'ପ୍ରିୟଙ୍କା', enCanonical: 'Priyanka' },
  priyabrata: { hi: 'प्रियव्रत', or: 'ପ୍ରିୟବ୍ରତ', enCanonical: 'Priyabrata' },
  deepak: { hi: 'दीपक', or: 'ଦୀପକ', enCanonical: 'Deepak' },
  dipak: { hi: 'दीपक', or: 'ଦୀପକ', enCanonical: 'Dipak' },
  rajesh: { hi: 'राजेश', or: 'ରାଜେଶ', enCanonical: 'Rajesh' },
  rakesh: { hi: 'राकेश', or: 'ରାକେଶ', enCanonical: 'Rakesh' },
  suresh: { hi: 'सुरेश', or: 'ସୁରେଶ', enCanonical: 'Suresh' },
  ramesh: { hi: 'रमेश', or: 'ରମେଶ', enCanonical: 'Ramesh' },
  mahesh: { hi: 'महेश', or: 'ମହେଶ', enCanonical: 'Mahesh' },
  dinesh: { hi: 'दिनेश', or: 'ଦିନେଶ', enCanonical: 'Dinesh' },
  manoj: { hi: 'मनोज', or: 'ମନୋଜ', enCanonical: 'Manoj' },
  saroj: { hi: 'सरोज', or: 'ସରୋଜ', enCanonical: 'Saroj' },
  santosh: { hi: 'संतोष', or: 'ସନ୍ତୋଷ', enCanonical: 'Santosh' },
  subhash: { hi: 'सुभाष', or: 'ସୁଭାଷ', enCanonical: 'Subhash' },
  alok: { hi: 'आलोक', or: 'ଆଲୋକ', enCanonical: 'Alok' },
  ashok: { hi: 'अशोक', or: 'ଅଶୋକ', enCanonical: 'Ashok' },
  anil: { hi: 'अनिल', or: 'ଅନିଲ', enCanonical: 'Anil' },
  sunil: { hi: 'सुनील', or: 'ସୁନିଲ', enCanonical: 'Sunil' },
  amit: { hi: 'अमित', or: 'ଅମିତ', enCanonical: 'Amit' },
  sumit: { hi: 'सुमित', or: 'ସୁମିତ', enCanonical: 'Sumit' },
  aniket: { hi: 'अनिकेत', or: 'ଅନିକେତ', enCanonical: 'Aniket' },
  biswajit: { hi: 'विश्वजीत', or: 'ବିଶ୍ୱଜିତ୍', enCanonical: 'Biswajit' },
  vishwajit: { hi: 'विश्वजीत', or: 'ବିଶ୍ୱଜିତ୍', enCanonical: 'Vishwajit' },
  jagannath: { hi: 'जगन्नाथ', or: 'ଜଗନ୍ନାଥ', enCanonical: 'Jagannath' },
  balabhadra: { hi: 'बलभद्र', or: 'ବଳଭଦ୍ର', enCanonical: 'Balabhadra' },
  subhadra: { hi: 'सुभद्रा', or: 'ସୁଭଦ୍ରା', enCanonical: 'Subhadra' },
  madhab: { hi: 'माधव', or: 'ମାଧବ', enCanonical: 'Madhab' },
  madhav: { hi: 'माधव', or: 'ମାଧବ', enCanonical: 'Madhav' },
  keshab: { hi: 'केशव', or: 'କେଶବ', enCanonical: 'Keshab' },
  keshav: { hi: 'केशव', or: 'କେଶବ', enCanonical: 'Keshav' },
  govind: { hi: 'गोविंद', or: 'ଗୋବିନ୍ଦ', enCanonical: 'Govind' },
  gobinda: { hi: 'गोविंद', or: 'ଗୋବିନ୍ଦ', enCanonical: 'Gobinda' },
  krishna: { hi: 'कृष्ण', or: 'କୃଷ୍ଣ', enCanonical: 'Krishna' },
  krushna: { hi: 'कृष्ण', or: 'କୃଷ୍ଣ', enCanonical: 'Krushna' },
  ram: { hi: 'राम', or: 'ରାମ', enCanonical: 'Ram' },
  rama: { hi: 'राम', or: 'ରାମ', enCanonical: 'Rama' },
  laxman: { hi: 'लक्ष्मण', or: 'ଲକ୍ଷ୍ମଣ', enCanonical: 'Laxman' },
  lakshman: { hi: 'लक्ष्मण', or: 'ଲକ୍ଷ୍ମଣ', enCanonical: 'Lakshman' },
  bharat: { hi: 'भरत', or: 'ଭରତ', enCanonical: 'Bharat' },
  bharata: { hi: 'भरत', or: 'ଭରତ', enCanonical: 'Bharata' },
  shatrughan: { hi: 'शत्रुघ्न', or: 'ଶତ୍ରୁଘ୍ନ', enCanonical: 'Shatrughan' },
  satrughna: { hi: 'शत्रुघ्न', or: 'ଶତ୍ରୁଘ୍ନ', enCanonical: 'Satrughna' },
  hanuman: { hi: 'हनुमान', or: 'ହନୁମାନ', enCanonical: 'Hanuman' },
  shiva: { hi: 'शिव', or: 'ଶିବ', enCanonical: 'Shiva' },
  siba: { hi: 'शिव', or: 'ଶିବ', enCanonical: 'Siba' },
  ganesh: { hi: 'गणेश', or: 'ଗଣେଶ', enCanonical: 'Ganesh' },
  ganesha: { hi: 'गणेश', or: 'ଗଣେଶ', enCanonical: 'Ganesha' },
  kartik: { hi: 'कार्तिक', or: 'କାର୍ତ୍ତିକ', enCanonical: 'Kartik' },
  kartikeya: { hi: 'कार्तिकेय', or: 'କାର୍ତ୍ତିକେୟ', enCanonical: 'Kartikeya' },
  saraswati: { hi: 'सरस्वती', or: 'ସରସ୍ୱତୀ', enCanonical: 'Saraswati' },
  laxmi: { hi: 'लक्ष्मी', or: 'ଲକ୍ଷ୍ମୀ', enCanonical: 'Laxmi' },
  lakshmi: { hi: 'लक्ष्मी', or: 'ଲକ୍ଷ୍ମୀ', enCanonical: 'Lakshmi' },
  parvati: { hi: 'पार्वती', or: 'ପାର୍ବତୀ', enCanonical: 'Parvati' },
  durga: { hi: 'दुर्गा', or: 'ଦୁର୍ଗା', enCanonical: 'Durga' },
  kali: { hi: 'काली', or: 'କାଳୀ', enCanonical: 'Kali' },
  radha: { hi: 'राधा', or: 'ରାଧା', enCanonical: 'Radha' },
  sita: { hi: 'सीता', or: 'ସୀତା', enCanonical: 'Sita' },
  gita: { hi: 'गीता', or: 'ଗୀତା', enCanonical: 'Gita' },
  geeta: { hi: 'गीता', or: 'ଗୀତା', enCanonical: 'Geeta' },
  sunita: { hi: 'सुनीता', or: 'ସୁନୀତା', enCanonical: 'Sunita' },
  anita: { hi: 'अनीता', or: 'ଅନୀତା', enCanonical: 'Anita' },
  mamata: { hi: 'ममता', or: 'ମମତା', enCanonical: 'Mamata' },
  mamta: { hi: 'ममता', or: 'ମମତା', enCanonical: 'Mamta' },
  puja: { hi: 'पूजा', or: 'ପୂଜା', enCanonical: 'Puja' },
  pooja: { hi: 'पूजा', or: 'ପୂଜା', enCanonical: 'Pooja' },
  smruti: { hi: 'स्मृति', or: 'ସ୍ମୃତି', enCanonical: 'Smruti' },
  smriti: { hi: 'स्मृति', or: 'ସ୍ମୃତି', enCanonical: 'Smriti' },
  shruti: { hi: 'श्रुति', or: 'ଶ୍ରୁତି', enCanonical: 'Shruti' },
  lipsa: { hi: 'लिप्सा', or: 'ଲିପ୍ସା', enCanonical: 'Lipsa' },
  swagatika: { hi: 'स्वागतिका', or: 'ସ୍ୱାଗତିକା', enCanonical: 'Swagatika' },
  monalisa: { hi: 'मोनालिसा', or: 'ମୋନାଲିସା', enCanonical: 'Monalisa' },
  tapaswini: { hi: 'तपस्विनी', or: 'ତପସ୍ୱିନୀ', enCanonical: 'Tapaswini' },
  tapas: { hi: 'तपस', or: 'ତପସ', enCanonical: 'Tapas' },
  jayashree: { hi: 'जयश्री', or: 'ଜୟଶ୍ରୀ', enCanonical: 'Jayashree' },
  subhashree: { hi: 'शुभश्री', or: 'ଶୁଭଶ୍ରୀ', enCanonical: 'Subhashree' },
  debashree: { hi: 'देवश्री', or: 'ଦେବଶ୍ରୀ', enCanonical: 'Debashree' },
  rajashree: { hi: 'राजश्री', or: 'ରାଜଶ୍ରୀ', enCanonical: 'Rajashree' },
  manas: { hi: 'मानस', or: 'ମାନସ', enCanonical: 'Manas' },
  prakash: { hi: 'प्रकाश', or: 'ପ୍ରକାଶ', enCanonical: 'Prakash' },
  bikash: { hi: 'विकास', or: 'ବିକାଶ', enCanonical: 'Bikash' },
  vikas: { hi: 'विकास', or: 'ବିକାଶ', enCanonical: 'Vikas' },
  akash: { hi: 'आकाश', or: 'ଆକାଶ', enCanonical: 'Akash' },
  sagar: { hi: 'सागर', or: 'ସାଗର', enCanonical: 'Sagar' },
  milan: { hi: 'मिलन', or: 'ମିଳନ', enCanonical: 'Milan' },
  pradeep: { hi: 'प्रदीप', or: 'ପ୍ରଦୀପ', enCanonical: 'Pradeep' },
  pradip: { hi: 'प्रदीप', or: 'ପ୍ରଦୀପ', enCanonical: 'Pradip' },
  sandeep: { hi: 'संदीप', or: 'ସନ୍ଦୀପ', enCanonical: 'Sandeep' },
  sandip: { hi: 'संदीप', or: 'ସନ୍ଦୀପ', enCanonical: 'Sandip' },
  dilip: { hi: 'दिलीप', or: 'ଦିଲୀପ', enCanonical: 'Dilip' },
  kulamani: { hi: 'कुलमणि', or: 'କୁଳମଣି', enCanonical: 'Kulamani' },
  chintamani: { hi: 'चिंतामणि', or: 'ଚିନ୍ତାମଣି', enCanonical: 'Chintamani' },
  lingaraj: { hi: 'लिंगराज', or: 'ଲିଙ୍ଗରାଜ', enCanonical: 'Lingaraj' },
  debasis: { hi: 'देवाशीष', or: 'ଦେବାଶିଷ', enCanonical: 'Debasis' },
  debasish: { hi: 'देवाशीष', or: 'ଦେବାଶିଷ', enCanonical: 'Debasish' },
  ashutosh: { hi: 'आशुतोष', or: 'ଆଶୁତୋଷ', enCanonical: 'Ashutosh' },
  bhabani: { hi: 'भवानी', or: 'ଭବାନୀ', enCanonical: 'Bhabani' },
  shankar: { hi: 'शंकर', or: 'ଶଙ୍କର', enCanonical: 'Shankar' },
  sankara: { hi: 'शंकर', or: 'ଶଙ୍କର', enCanonical: 'Sankara' },
  sambit: { hi: 'संबित', or: 'ସମ୍ବିତ', enCanonical: 'Sambit' },
  sangram: { hi: 'संग्राम', or: 'ସଂଗ୍ରାମ', enCanonical: 'Sangram' },
  chinmay: { hi: 'चिन्मय', or: 'ଚିନ୍ମୟ', enCanonical: 'Chinmay' },
  tanmay: { hi: 'तन्मय', or: 'ତନ୍ମୟ', enCanonical: 'Tanmay' },
  jyoti: { hi: 'ज्योति', or: 'ଜ୍ୟୋତି', enCanonical: 'Jyoti' },
  dipti: { hi: 'दीप्ति', or: 'ଦୀପ୍ତି', enCanonical: 'Dipti' },
  trupti: { hi: 'तृप्ति', or: 'ତୃପ୍ତି', enCanonical: 'Trupti' },
  nibedita: { hi: 'निवेदिता', or: 'ନିବେଦିତା', enCanonical: 'Nibedita' },
  pragyan: { hi: 'प्रज्ञा', or: 'ପ୍ରଜ୍ଞା', enCanonical: 'Pragyan' },
  prangya: { hi: 'प्रज्ञा', or: 'ପ୍ରଜ୍ଞା', enCanonical: 'Prangya' },
  gitanjali: { hi: 'गीतांजलि', or: 'ଗୀତାଞ୍ଜଳି', enCanonical: 'Gitanjali' },
  tapati: { hi: 'तपती', or: 'ତପତୀ', enCanonical: 'Tapati' },
  kalyani: { hi: 'कल्याणी', or: 'କଲ୍ୟାଣୀ', enCanonical: 'Kalyani' },
  binod: { hi: 'विनोद', or: 'ବିନୋଦ', enCanonical: 'Binod' },
  pramod: { hi: 'प्रमोद', or: 'ପ୍ରମୋଦ', enCanonical: 'Pramod' },
  subodh: { hi: 'सुबोध', or: 'ସୁବୋଧ', enCanonical: 'Subodh' },
  prabodh: { hi: 'प्रबोध', or: 'ପ୍ରବୋଧ', enCanonical: 'Prabodh' },
  anshuman: { hi: 'अंशुमान', or: 'ଅଂଶୁମାନ', enCanonical: 'Anshuman' },
  himanshu: { hi: 'हिमांशु', or: 'ହିମାଂଶୁ', enCanonical: 'Himanshu' },
  sudhanshu: { hi: 'सुधांशु', or: 'ସୁଧାଂଶୁ', enCanonical: 'Sudhanshu' },
  priyadarshi: { hi: 'प्रियदर्शी', or: 'ପ୍ରିୟଦର୍ଶୀ', enCanonical: 'Priyadarshi' },
  sukanta: { hi: 'सुकान्त', or: 'ସୁକାନ୍ତ', enCanonical: 'Sukanta' },
  prasant: { hi: 'प्रशांत', or: 'ପ୍ରଶାନ୍ତ', enCanonical: 'Prasant' },
  prashant: { hi: 'प्रशांत', or: 'ପ୍ରଶାନ୍ତ', enCanonical: 'Prashant' },
  sushant: { hi: 'सुशांत', or: 'ସୁଶାନ୍ତ', enCanonical: 'Sushant' },
  basant: { hi: 'बसंत', or: 'ବସନ୍ତ', enCanonical: 'Basant' },
  basanta: { hi: 'बसंत', or: 'ବସନ୍ତ', enCanonical: 'Basanta' },
  hemant: { hi: 'हेमंत', or: 'ହେମନ୍ତ', enCanonical: 'Hemant' },
  hemanta: { hi: 'हेमंत', or: 'ହେମନ୍ତ', enCanonical: 'Hemanta' },
  jayant: { hi: 'जयंत', or: 'ଜୟନ୍ତ', enCanonical: 'Jayant' },
  dhirendra: { hi: 'धीरेन्द्र', or: 'ଧୀରେନ୍ଦ୍ର', enCanonical: 'Dhirendra' },
  narendra: { hi: 'नरेन्द्र', or: 'ନରେନ୍ଦ୍ର', enCanonical: 'Narendra' },
  surendra: { hi: 'सुरेन्द्र', or: 'ସୁରେନ୍ଦ୍ର', enCanonical: 'Surendra' },
  jitendra: { hi: 'जितेन्द्र', or: 'ଜିତେନ୍ଦ୍ର', enCanonical: 'Jitendra' },
  dharmendra: { hi: 'धर्मेन्द्र', or: 'ଧର୍ମେନ୍ଦ୍ର', enCanonical: 'Dharmendra' },
  upendra: { hi: 'उपेन्द्र', or: 'ଉପେନ୍ଦ୍ର', enCanonical: 'Upendra' },
  rajendra: { hi: 'राजेन्द्र', or: 'ରାଜେନ୍ଦ୍ର', enCanonical: 'Rajendra' },
  gajendra: { hi: 'गजेन्द्र', or: 'ଗଜେନ୍ଦ୍ର', enCanonical: 'Gajendra' },
  mahendra: { hi: 'महेंद्र', or: 'ମହେନ୍ଦ୍ର', enCanonical: 'Mahendra' },
  rabindra: { hi: 'रवींद्र', or: 'ରବୀନ୍ଦ୍ର', enCanonical: 'Rabindra' },
  devendra: { hi: 'देवेन्द्र', or: 'ଦେବେନ୍ଦ୍ର', enCanonical: 'Devendra' },
  bipin: { hi: 'बिपिन', or: 'ବିପିନ', enCanonical: 'Bipin' },
  nabin: { hi: 'नवीन', or: 'ନବୀନ', enCanonical: 'Nabin' },
  pravin: { hi: 'प्रवीण', or: 'ପ୍ରବୀଣ', enCanonical: 'Pravin' },
  kumar: { hi: 'कुमार', or: 'କୁମାର', enCanonical: 'Kumar' },
  chandra: { hi: 'चंद्र', or: 'ଚନ୍ଦ୍ର', enCanonical: 'Chandra' },
  prasad: { hi: 'प्रसाद', or: 'ପ୍ରସାଦ', enCanonical: 'Prasad' },
  nath: { hi: 'नाथ', or: 'ନାଥ', enCanonical: 'Nath' },
  lal: { hi: 'लाल', or: 'ଲାଲ', enCanonical: 'Lal' },
  mani: { hi: 'मणि', or: 'ମଣି', enCanonical: 'Mani' },
  mohan: { hi: 'मोहन', or: 'ମୋହନ', enCanonical: 'Mohan' },
  sundar: { hi: 'सुंदर', or: 'ସୁନ୍ଦର', enCanonical: 'Sundar' },
  kanta: { hi: 'कांत', or: 'କାନ୍ତ', enCanonical: 'Kanta' },
  charan: { hi: 'चरण', or: 'ଚରଣ', enCanonical: 'Charan' },
  bhushan: { hi: 'भूषण', or: 'ଭୂଷଣ', enCanonical: 'Bhushan' },
  sekhar: { hi: 'शेखर', or: 'ଶେଖର', enCanonical: 'Sekhar' },
  shekhar: { hi: 'शेखर', or: 'ଶେଖର', enCanonical: 'Shekhar' },
  bandhu: { hi: 'बंधु', or: 'ବନ୍ଧୁ', enCanonical: 'Bandhu' },
  gour: { hi: 'गौर', or: 'ଗୌର', enCanonical: 'Gour' },
  goura: { hi: 'गौर', or: 'ଗୌର', enCanonical: 'Goura' },
  hari: { hi: 'हरि', or: 'ହରି', enCanonical: 'Hari' },
  harish: { hi: 'हरीश', or: 'ହରୀଶ', enCanonical: 'Harish' },
  jagat: { hi: 'जगत', or: 'ଜଗତ', enCanonical: 'Jagat' },
  narayan: { hi: 'नारायण', or: 'ନାରାୟଣ', enCanonical: 'Narayan' },
  padmanav: { hi: 'पद्मनाभ', or: 'ପଦ୍ମନାଭ', enCanonical: 'Padmanav' },
  padmanabha: { hi: 'पद्मनाभ', or: 'ପଦ୍ମନାଭ', enCanonical: 'Padmanabha' },
  srinivas: { hi: 'श्रीनिवास', or: 'ଶ୍ରୀନିବାସ', enCanonical: 'Srinivas' },
  srinibas: { hi: 'श्रीनिवास', or: 'ଶ୍ରୀନିବାସ', enCanonical: 'Srinibas' },
  biswaranjan: { hi: 'विश्वारंजन', or: 'ବିଶ୍ୱରଞ୍ଜନ', enCanonical: 'Biswaranjan' },
  manoranjan: { hi: 'मनोरंजन', or: 'ମନୋରଞ୍ଜନ', enCanonical: 'Manoranjan' },
  priyaranjan: { hi: 'प्रियरंजन', or: 'ପ୍ରିୟରଞ୍ଜନ', enCanonical: 'Priyaranjan' },
  soumyaranjan: { hi: 'सौम्यरंजन', or: 'ସୌମ୍ୟରଞ୍ଜନ', enCanonical: 'Soumyaranjan' },
  chittaranjan: { hi: 'चित्तरंजन', or: 'ଚିତ୍ତରଞ୍ଜନ', enCanonical: 'Chittaranjan' },
  kanhu: { hi: 'कान्हू', or: 'କାହ୍ନୁ', enCanonical: 'Kanhu' },
  kanhucharan: { hi: 'कान्हूचरण', or: 'କାହ୍ନୁଚରଣ', enCanonical: 'Kanhucharan' },
  dinabandhu: { hi: 'दीनबंधु', or: 'ଦୀନବନ୍ଧୁ', enCanonical: 'Dinabandhu' },
  gopinath: { hi: 'गोपीनाथ', or: 'ଗୋପୀନାଥ', enCanonical: 'Gopinath' },
  radhanath: { hi: 'राधानाथ', or: 'ରାଧାନାଥ', enCanonical: 'Radhanath' },
  lokanath: { hi: 'लोकनाथ', or: 'ଲୋକନାଥ', enCanonical: 'Lokanath' },
  baidyanath: { hi: 'वैद्यनाथ', or: 'ବୈଦ୍ୟନାଥ', enCanonical: 'Baidyanath' },
  somnath: { hi: 'सोमनाथ', or: 'ସୋମନାଥ', enCanonical: 'Somnath' },
  kashinath: { hi: 'काशीनाथ', or: 'କାଶୀନାଥ', enCanonical: 'Kashinath' },
  balaram: { hi: 'बलराम', or: 'ବଳରାମ', enCanonical: 'Balaram' },
  abhimanyu: { hi: 'अभिमन्यु', or: 'ଅଭିମନ୍ୟୁ', enCanonical: 'Abhimanyu' },
  duryodhan: { hi: 'दुर्योधन', or: 'ଦୁର୍ଯ୍ୟୋଧନ', enCanonical: 'Duryodhan' },
  yudhisthir: { hi: 'युधिष्ठिर', or: 'ଯୁଧିଷ୍ଠିର', enCanonical: 'Yudhisthir' },
  bhima: { hi: 'भीम', or: 'ଭୀମ', enCanonical: 'Bhima' },
  arjun: { hi: 'अर्जुन', or: 'ଅର୍ଜୁନ', enCanonical: 'Arjun' },
  nakula: { hi: 'नकुल', or: 'ନକୁଳ', enCanonical: 'Nakula' },
  sahadev: { hi: 'सहदेव', or: 'ସହଦେବ', enCanonical: 'Sahadev' },
  karna: { hi: 'कर्ण', or: 'କର୍ଣ୍ଣ', enCanonical: 'Karna' },
  bhisma: { hi: 'भीष्म', or: 'ଭୀଷ୍ମ', enCanonical: 'Bhisma' },
  drona: { hi: 'द्रोण', or: 'ଦ୍ରୋଣ', enCanonical: 'Drona' },
  kripa: { hi: 'कृपा', or: 'କୃପା', enCanonical: 'Kripa' },
  vidura: { hi: 'विदुर', or: 'ବିଦୁର', enCanonical: 'Vidura' },
  sanjaya: { hi: 'संजय', or: 'ସଞ୍ଜୟ', enCanonical: 'Sanjaya' },
  sanjay: { hi: 'संजय', or: 'ସଞ୍ଜୟ', enCanonical: 'Sanjay' },
  dhritarastra: { hi: 'धृतराष्ट्र', or: 'ଧୃତରାଷ୍ଟ୍ର', enCanonical: 'Dhritarastra' },
  gandhari: { hi: 'गांधारी', or: 'ଗାନ୍ଧାରୀ', enCanonical: 'Gandhari' },
  kunti: { hi: 'कुंती', or: 'କୁନ୍ତୀ', enCanonical: 'Kunti' },
  draupadi: { hi: 'द्रौपदी', or: 'ଦ୍ରୌପଦୀ', enCanonical: 'Draupadi' },
};

// Build reverse indexes for Hindi and Odia lookup
const HINDI_MAP = new Map<string, { en: string; hi: string; or: string }>();
const ODIA_MAP = new Map<string, { en: string; hi: string; or: string }>();

for (const [key, val] of Object.entries(NAME_DICTIONARY)) {
  const en = val.enCanonical || (key.charAt(0).toUpperCase() + key.slice(1));
  const entry = { en, hi: val.hi, or: val.or };
  HINDI_MAP.set(val.hi, entry);
  ODIA_MAP.set(val.or, entry);
}

// Check if string contains Devanagari script
function isDevanagariStr(s: string): boolean {
  for (const ch of s) {
    const c = ch.charCodeAt(0);
    if (c >= 0x0900 && c <= 0x097f) return true;
  }
  return false;
}

// Check if string contains Odia script
function isOdiaStr(s: string): boolean {
  for (const ch of s) {
    const c = ch.charCodeAt(0);
    if (c >= 0x0b00 && c <= 0x0b7f) return true;
  }
  return false;
}

/**
 * Phonetic transliterator from Roman script (English) to Devanagari
 * Used as fallback when a name is not present in the canonical dictionary.
 */
function phoneticEnglishToDevanagari(text: string): string {
  const s = text.toLowerCase().trim();
  if (!s) return '';

  const CONSONANT_MAP: Record<string, string> = {
    ksh: 'क्ष',
    gny: 'ज्ञ',
    dny: 'ज्ञ',
    gya: 'ज्ञ',
    shh: 'ष',
    chh: 'छ',
    kh: 'ख',
    gh: 'घ',
    ch: 'च',
    jh: 'झ',
    th: 'थ',
    dh: 'ध',
    ph: 'फ',
    bh: 'भ',
    sh: 'श',
    wh: 'व',
    ng: 'ङ',
    ny: 'ञ',
    k: 'क',
    g: 'ग',
    c: 'क',
    j: 'ज',
    z: 'ज़',
    t: 'त',
    d: 'द',
    n: 'न',
    p: 'प',
    f: 'फ',
    b: 'ब',
    m: 'म',
    y: 'य',
    r: 'र',
    l: 'ल',
    v: 'व',
    w: 'व',
    s: 'स',
    h: 'ह',
    q: 'क',
  };

  const VOWEL_INDEP: Record<string, string> = {
    aai: 'आई',
    aau: 'आऊ',
    aa: 'आ',
    ee: 'ई',
    oo: 'ऊ',
    ai: 'ऐ',
    au: 'औ',
    ou: 'औ',
    ae: 'ए',
    a: 'अ',
    i: 'इ',
    u: 'उ',
    e: 'ए',
    o: 'ओ',
  };

  const VOWEL_MATRA: Record<string, string> = {
    aai: 'ाई',
    aau: 'ाऊ',
    aa: 'ा',
    ee: 'ी',
    oo: 'ू',
    ai: 'ै',
    au: 'ौ',
    ou: 'ौ',
    ae: 'े',
    a: '', // Inherent vowel
    i: 'ि',
    u: 'ु',
    e: 'े',
    o: 'ो',
  };

  let out = '';
  let i = 0;
  let prevWasConsonant = false;

  while (i < s.length) {
    let matchedVowel = '';
    for (const v of ['aai', 'aau', 'aa', 'ee', 'oo', 'ai', 'au', 'ou', 'ae', 'a', 'i', 'u', 'e', 'o']) {
      if (s.startsWith(v, i)) {
        matchedVowel = v;
        break;
      }
    }

    if (matchedVowel) {
      if (prevWasConsonant) {
        out += VOWEL_MATRA[matchedVowel];
      } else {
        out += VOWEL_INDEP[matchedVowel];
      }
      prevWasConsonant = false;
      i += matchedVowel.length;
      continue;
    }

    let matchedConsonant = '';
    for (const c of ['ksh', 'gny', 'dny', 'gya', 'shh', 'chh', 'kh', 'gh', 'ch', 'jh', 'th', 'dh', 'ph', 'bh', 'sh', 'wh', 'ng', 'ny', 'k', 'g', 'c', 'j', 'z', 't', 'd', 'n', 'p', 'f', 'b', 'm', 'y', 'r', 'l', 'v', 'w', 's', 'h', 'q']) {
      if (s.startsWith(c, i)) {
        matchedConsonant = c;
        break;
      }
    }

    if (matchedConsonant) {
      if (prevWasConsonant) {
        out += '्';
      }
      out += CONSONANT_MAP[matchedConsonant];
      prevWasConsonant = true;
      i += matchedConsonant.length;
      continue;
    }

    const ch = s[i];
    if (ch === ' ' || ch === '-' || ch === '.') {
      out += ch;
      prevWasConsonant = false;
    } else {
      out += ch;
      prevWasConsonant = false;
    }
    i++;
  }

  return out;
}

/**
 * Transliterates a single name token (e.g. "Abhijit" or "Parida")
 */
function transliterateToken(rawToken: string): { hi: string; or: string; en: string } {
  const token = rawToken.trim();
  if (!token) return { en: '', hi: '', or: '' };

  // 1. If token is in Odia script
  if (isOdiaStr(token)) {
    if (ODIA_MAP.has(token)) {
      return ODIA_MAP.get(token)!;
    }
    return { en: token, hi: token, or: token };
  }

  // 2. If token is in Devanagari script
  if (isDevanagariStr(token)) {
    if (HINDI_MAP.has(token)) {
      return HINDI_MAP.get(token)!;
    }
    return { en: token, hi: token, or: devanagariToOdia(token) };
  }

  const cleanKey = token.toLowerCase().replace(/[^a-z]/g, '');

  // 3. Check exact English dictionary match
  if (NAME_DICTIONARY[cleanKey]) {
    const dict = NAME_DICTIONARY[cleanKey];
    return {
      en: token,
      hi: dict.hi,
      or: dict.or,
    };
  }

  // 4. Phonetic fallback
  const devanagari = phoneticEnglishToDevanagari(token);
  let odia = devanagariToOdia(devanagari);

  // Odia refinement: surnames ending in 'da' like 'pada' often use 'ଡ଼ା'
  if (cleanKey.endsWith('da') && odia.endsWith('ଦା')) {
    odia = odia.slice(0, -2) + 'ଡ଼ା';
  }

  return {
    en: token,
    hi: devanagari,
    or: odia,
  };
}

/**
 * Main Trilingual Name Transliteration Engine
 *
 * Takes any user input (e.g. "Abhijit Parida" or "Dr. Soumya Ranjan Patnaik")
 * and returns perfectly mapped representations in English, Hindi, and Odia.
 */
export function transliterateName(fullName: string): TrilingualName {
  if (!fullName || !fullName.trim()) {
    return { en: '', hi: '', or: '' };
  }

  const trimmed = fullName.trim();

  // Tokenize by spaces while preserving whitespace
  const tokens = trimmed.split(/(\s+)/);
  const enParts: string[] = [];
  const hiParts: string[] = [];
  const orParts: string[] = [];

  for (const part of tokens) {
    if (/^\s+$/.test(part)) {
      enParts.push(part);
      hiParts.push(part);
      orParts.push(part);
      continue;
    }

    const { en, hi, or } = transliterateToken(part);
    enParts.push(en);
    hiParts.push(hi);
    orParts.push(or);
  }

  return {
    en: enParts.join(''),
    hi: hiParts.join(''),
    or: orParts.join(''),
  };
}

/**
 * Returns the localized native name for the active app language ('en' | 'hi' | 'or').
 *
 * Example:
 * getLocalizedNativeName('Abhijit Parida', 'or') => 'ଅଭିଜିତ୍ ପରିଡ଼ା'
 * getLocalizedNativeName('Abhijit Parida', 'hi') => 'अभिजीत परिडा'
 * getLocalizedNativeName('Abhijit Parida', 'en') => 'Abhijit Parida'
 */
export function getLocalizedNativeName(rawName: string, lang: 'en' | 'hi' | 'or'): string {
  if (!rawName) return '';
  const translit = transliterateName(rawName);
  if (lang === 'or') return translit.or || rawName;
  if (lang === 'hi') return translit.hi || rawName;
  return translit.en || rawName;
}
