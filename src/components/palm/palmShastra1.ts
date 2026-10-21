// PART-1: types + trilingual Rekha shastra (Samudrika-tilaka, Garuda P.65, Sen)
export type PalmLang = 'or' | 'hi' | 'en';
export type RekhaKey = 'ayu' | 'buddhi' | 'hridaya' | 'bhagya' | 'surya' | 'vivaha' | 'swasthya';
export type ParvatKey = 'guru' | 'shani' | 'surya' | 'budha' | 'mangalPos' | 'mangalNeg' | 'chandra' | 'shukra' | 'ketuRahu';
export type HastaType = 'vayu' | 'agni' | 'jala' | 'prithvi' | 'akasha';
export type AnguliTip = 'pointed' | 'conic' | 'square' | 'spatulate' | 'mixed';
export interface RekhaObs { visible: 'clear' | 'faint' | 'broken' | 'absent'; length: 'long' | 'medium' | 'short'; depth: 'deep' | 'medium' | 'shallow'; marks: string[]; conf: number; }
export interface ParvatObs { level: 'raised' | 'normal' | 'flat' | 'depressed'; marks: string[]; }
export interface ShastraVerdict { key: string; title: string; lakshana: string; phala: string; source: string; upay: string; }
const T = (lang: PalmLang, or: string, hi: string, en: string) => (lang === 'or' ? or : lang === 'hi' ? hi : en);
export const REKHA_TITLES: Record<RekhaKey, Record<PalmLang, string>> = {
  ayu: { or: 'ଆୟୁ ରେଖା (ଶୁକ୍ର ପର୍ବତକୁ ଘେରି ଥିବା)', hi: 'आयु रेखा (शुक्र पर्वत को घेरने वाली)', en: 'Life Line (around Venus mount)' },
  buddhi: { or: 'ବୁଦ୍ଧି ରେଖା (ଶିର୍ଷ ରେଖା)', hi: 'बुद्धि रेखा (शीर्ष रेखा)', en: 'Head Line' },
  hridaya: { or: 'ହୃଦୟ ରେଖା (ବୁଧଠୁ ଗୁରୁ ପର୍ଯ୍ୟନ୍ତ)', hi: 'हृदय रेखा (बुध से गुरु तक)', en: 'Heart Line (Mercury to Jupiter)' },
  bhagya: { or: 'ଭାଗ୍ୟ ରେଖା (ମଣିବନ୍ଧରୁ ଶନି)', hi: 'भाग्य रेखा (मणिबंध से शनि)', en: 'Fate Line (bracelet to Saturn)' },
  surya: { or: 'ସୂର୍ଯ୍ୟ ରେଖା (ଯଶ ରେଖା)', hi: 'सूर्य रेखा (यश रेखा)', en: 'Sun Line (fame line)' },
  vivaha: { or: 'ବିବାହ ରେଖା (ବୁଧ ପର୍ବତ)', hi: 'विवाह रेखा (बुध पर्वत)', en: 'Marriage Lines (Mercury mount)' },
  swasthya: { or: 'ସ୍ୱାସ୍ଥ୍ୟ ରେଖା', hi: 'स्वास्थ्य रेखा', en: 'Health Line' },
};
const REKHA_UPAY: Record<RekhaKey, Record<PalmLang, string>> = {
  ayu: { or: 'ପ୍ରାଣାୟାମ, ସୂର୍ଯ୍ୟ ନମସ୍କାର; ହନୁମାନ ଚାଳିସା।', hi: 'प्राणायाम, सूर्य नमस्कार; हनुमान चालीसा।', en: 'Pranayama, Surya Namaskar; Hanuman Chalisa.' },
  buddhi: { or: 'ବ୍ରାହ୍ମ ମୁହୂର୍ତ୍ତରେ ୧୦୮ ଗାୟତ୍ରୀ।', hi: 'ब्राह्म मुहूर्त में १०८ गायत्री।', en: 'Gayatri 108 at Brahma-muhurta.' },
  hridaya: { or: 'ଶୁକ୍ରବାର ଲକ୍ଷ୍ମୀ ମନ୍ତ୍ର।', hi: 'शुक्रवार लक्ष्मी मंत्र।', en: 'Friday Lakshmi mantra.' },
  bhagya: { or: 'ଶନିବାର ତେଲ ଦୀପ, ଅସ୍ଥ ଜଳ।', hi: 'शनिवार तेल दीप, पीपल जल।', en: 'Saturday oil lamp, peepal water.' },
  surya: { or: 'ଆଦିତ୍ୟ ହୃଦୟ; ତମ୍ବା ଅର୍ଘ୍ୟ।', hi: 'आदित्य हृदय; ताम्र अर्घ्य।', en: 'Aditya Hridaya; copper arghya.' },
  vivaha: { or: 'ସୋମବାର ଗୌରୀ-ଶଙ୍କର ପୂଜା।', hi: 'सोमवार गौरी-शंकर पूजा।', en: 'Monday Gauri-Shankar puja.' },
  swasthya: { or: 'ଦିନଚର୍ଯ୍ୟା + ବୈଦ୍ୟ ପରାମର୍ଶ।', hi: 'दिनचर्या + वैद्य परामर्श।', en: 'Routine + physician advice.' },
};
const REKHA_SRC: Record<RekhaKey, string> = {
  ayu: 'Samudrika Tilaka / Garuda Purana (Samudrika Adhyaya)', buddhi: 'K.C.Sen lines ch.; Benham',
  hridaya: 'Samudrika lakshana grantha', bhagya: 'Hast-samudrika fate adhyaya',
  surya: 'Samudrika-tilaka yash-vichara', vivaha: 'Samudrika vivaha-lakshana', swasthya: 'Sen health-line chapter',
};
export function judgeRekha(key: RekhaKey, o: RekhaObs, lang: PalmLang): ShastraVerdict {
  const title = REKHA_TITLES[key][lang]; const upay = REKHA_UPAY[key][lang];
  if (o.visible === 'absent') return { key, title, lakshana: T(lang, 'ରେଖା ଅନୁପସ୍ଥିତ — ପର୍ବତ-ଅଙ୍ଗୁଳିରୁ ଫଳ ଦେଖନ୍ତୁ', 'रेखा अनुपस्थित — पर्वत-अंगुली से फल देखें', 'Line absent — read from mounts/fingers'), phala: T(lang, 'ରେଖା ଅଭାବ ଦୋଷ ନୁହେଁ।', 'रेखा अभाव दोष नहीं।', 'Absence is not a defect.'), source: REKHA_SRC[key], upay };
  const marks = o.marks.join(', ') || T(lang, 'କୌଣସି ବିଶେଷ ଚିହ୍ନ ନାହିଁ', 'कोई विशेष चिह्न नहीं', 'no special marks');
  let phala = '';
  if (o.visible === 'broken') phala += T(lang, 'ଖଣ୍ଡିତ — ସେ ଅବଧିରେ ବାଧା/ପରିବର୍ତ୍ତନ; ରକ୍ଷା ଚିହ୍ନ + ଉପାୟରୁ ରକ୍ଷା। ', 'खंडित — उस अवधि बाधा/परिवर्तन; रक्षा चिह्न + उपाय से रक्षा। ', 'Broken — obstacle/change in that period; protection marks + remedy help. ');
  if (o.visible === 'faint' || o.depth === 'shallow') phala += T(lang, 'କ୍ଷୀଣ — ଶକ୍ତି ମଧ୍ୟମ; ସାଧନାରୁ ପୁଷ୍ଟି। ', 'क्षीण — शक्ति मध्यम; साधना से पुष्टि। ', 'Faint — medium strength; sadhana strengthens. ');
  if (o.visible === 'clear' && o.depth === 'deep') phala += T(lang, 'ସ୍ପଷ୍ଟ-ଗଭୀର-ଦୀର୍ଘ — ଶାସ୍ତ୍ରୋକ୍ତ ଶୁଭ ଲକ୍ଷଣ। ', 'स्पष्ट-गंभीर-दीर्घ — शास्त्रोक्त शुभ लक्षण। ', 'Clear-deep-long — classical auspicious mark. ');
  if (o.length === 'long') phala += T(lang, 'ଦୀର୍ଘତା ସ୍ଥିରତା। ', 'दीर्घता स्थिरता। ', 'Length gives stability. ');
  if (o.length === 'short') phala += T(lang, 'ହ୍ରସ୍ୱ — ସୀମିତ କ୍ଷେତ୍ର। ', 'ह्रस्व — सीमित क्षेत्र। ', 'Short — limited zone. ');
  if (o.marks.includes('cross')) phala += T(lang, 'କ୍ରସ୍: ସଂଘର୍ଷ ସଙ୍କେତ — ଶାନ୍ତି ଉପାୟ। ', 'क्रॉस: संघर्ष संकेत — शांति उपाय। ', 'Cross: struggle sign — pacifying remedy. ');
  if (o.marks.includes('star')) phala += T(lang, 'ତାରା: ବିଶେଷ ଘଟଣା/ଶୁଭ ଚମକ। ', 'तारा: विशेष घटना/शुभ चमक। ', 'Star: special event/fame spark. ');
  if (o.marks.includes('island')) phala += T(lang, 'ଦ୍ୱୀପ: ସ୍ୱାସ୍ଥ୍ୟ ସଂଯମ। ', 'द्वीप: स्वास्थ्य संयम। ', 'Island: guard health. ');
  if (o.marks.includes('triangle')) phala += T(lang, 'ତ୍ରିକୋଣ: ବୁଦ୍ଧି-ସିଦ୍ଧି ଶୁଭ। ', 'त्रिकोण: बुद्धि-सिद्धि शुभ। ', 'Triangle: intellect success. ');
  if (o.marks.includes('square')) phala += T(lang, 'ଚତୁର୍ଭୁଜ: ରକ୍ଷା-କବଚ। ', 'चतुर्भुज: रक्षा-कवच। ', 'Square: protective shield. ');
  return { key, title, lakshana: T(lang, 'ସ୍ଥିତି ', 'स्थिति ', 'State ') + o.visible + ', ' + o.length + ', ' + o.depth + '; ' + T(lang, 'ଚିହ୍ନ: ', 'चिह्न: ', 'marks: ') + marks, phala: phala.trim(), source: REKHA_SRC[key], upay };
}

