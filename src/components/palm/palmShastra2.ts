// PART-2: trilingual Parvat + Hasta/Anguli
import { ParvatKey, ParvatObs, ShastraVerdict, HastaType, AnguliTip, PalmLang } from './palmShastra1';
export type { ParvatKey, ParvatObs, ShastraVerdict, HastaType, AnguliTip, PalmLang };
const T = (lang: PalmLang, or: string, hi: string, en: string) => (lang === 'or' ? or : lang === 'hi' ? hi : en);
export const PARVAT_T: Record<ParvatKey, Record<PalmLang, string>> = {
  guru: { or: 'ଗୁରୁ ପର୍ବତ (ତର୍ଜନୀ ତଳେ)', hi: 'गुरु पर्वत (तर्जनी नीचे)', en: 'Jupiter mount (under index)' },
  shani: { or: 'ଶନି ପର୍ବତ (ମଧ୍ୟମା ତଳେ)', hi: 'शनि पर्वत (मध्यमा नीचे)', en: 'Saturn mount (under middle)' },
  surya: { or: 'ସୂର୍ଯ୍ୟ ପର୍ବତ (ଅନାମିକା ତଳେ)', hi: 'सूर्य पर्वत (अनामिका नीचे)', en: 'Sun mount (under ring)' },
  budha: { or: 'ବୁଧ ପର୍ବତ (କନିଷ୍ଠ ତଳେ)', hi: 'बुध पर्वत (कनिष्ठा नीचे)', en: 'Mercury mount (under little)' },
  mangalPos: { or: 'ମଙ୍ଗଳ + (ଉପର)', hi: 'मंगल + (ऊपर)', en: 'Mars + (upper)' },
  mangalNeg: { or: 'ମଙ୍ଗଳ − (ମଧ୍ୟ)', hi: 'मंगल − (मध्य)', en: 'Mars − (middle)' },
  chandra: { or: 'ଚନ୍ଦ୍ର ପର୍ବତ (କଡ)', hi: 'चंद्र पर्वत (किनारा)', en: 'Moon mount (edge)' },
  shukra: { or: 'ଶୁକ୍ର ପର୍ବତ (ବୃଦ୍ଧାଙ୍ଗୁଳି ତଳେ)', hi: 'शुक्र पर्वत (अंगूठा नीचे)', en: 'Venus mount (under thumb)' },
  ketuRahu: { or: 'କେତୁ-ରାହୁ କ୍ଷେତ୍ର', hi: 'केतु-राहु क्षेत्र', en: 'Ketu-Rahu zone' },
};
export function judgeParvat(key: ParvatKey, o: ParvatObs, lang: PalmLang): ShastraVerdict {
  const KAR: Record<ParvatKey, Record<PalmLang, string>> = {
    guru: { or: 'ଧର୍ମ-ନେତୃତ୍ୱ; ଉନ୍ନତ=ସମ୍ମାନ, ଦବା=ଆତ୍ମବିଶ୍ୱାସ କ୍ଷୀଣ।', hi: 'धर्म-नेतृत्व; उन्नत=सम्मान, दबा=आत्मविश्वास क्षीण।', en: 'Dharma-leadership; raised=honour, low=weak confidence.' },
    shani: { or: 'କର୍ମ-ଧୈର୍ଯ୍ୟ; ଉନ୍ନତ=ଗମ୍ଭୀରତା।', hi: 'कर्म-धैर्य; उन्नत=गंभीरता।', en: 'Karma-patience; raised=depth.' },
    surya: { or: 'ଯଶ-କଳା; ଉନ୍ନତ=ଖ୍ୟାତି ଯୋଗ।', hi: 'यश-कला; उन्नत=ख्याति योग।', en: 'Fame-art; raised=renown.' },
    budha: { or: 'ବାଣୀ-ବ୍ୟାପାର; ଉନ୍ନତ=ବାକପଟୁତା।', hi: 'वाणी-व्यापार; उन्नत=वाक्पटुता।', en: 'Speech-trade; raised=eloquence.' },
    mangalPos: { or: 'ସାହସ-ଊର୍ଜା; ଉନ୍ନତ=ପରାକ୍ରମ।', hi: 'साहस-ऊर्जा; उन्नत=पराक्रम।', en: 'Courage-energy; raised=valour.' },
    mangalNeg: { or: 'ଧୈର୍ଯ୍ୟ-ସଂଯମ; ଦବା=ଉତାବଳାପଣ।', hi: 'धैर्य-संयम; दबा=उतावलापन।', en: 'Patience-restraint; low=haste.' },
    chandra: { or: 'କଳ୍ପନା-ମନ; ଉନ୍ନତ=ସର୍ଜନାତ୍ମକତା।', hi: 'कल्पना-मन; उन्नत=सृजनात्मकता।', en: 'Imagination-mind; raised=creativity.' },
    shukra: { or: 'ପ୍ରେମ-ସୁଖ; ଉନ୍ନତ=ସ୍ନେହ।', hi: 'प्रेम-सुख; उन्नत=स्नेह।', en: 'Love-comfort; raised=affection.' },
    ketuRahu: { or: 'ଭାଗ୍ୟ-ମୂଳ; ରେଖା ଉଦଗମ ସ୍ଥଳ।', hi: 'भाग्य-मूल; रेखा उद्गम स्थल।', en: 'Fate-root; lines origin zone.' },
  };
  const SRC: Record<ParvatKey, string> = {
    guru: 'Samudrika-tilaka', shani: 'Samudrika parvat-adhyaya', surya: 'Samudrika yash-vichara',
    budha: 'Samudrika parvat-lakshana', mangalPos: 'Sen mounts', mangalNeg: 'Sen mounts',
    chandra: 'Samudrika chandra-lakshana', shukra: 'Samudrika shukra-vichara', ketuRahu: 'Paramparik hast-chitra',
  };
  const lvl = T(lang, o.level === 'raised' ? 'ଉନ୍ନତ' : o.level === 'depressed' ? 'ଦବା' : o.level === 'flat' ? 'ଚପଟା' : 'ସାମାନ୍ୟ', o.level === 'raised' ? 'उन्नत' : o.level === 'depressed' ? 'दबा' : o.level === 'flat' ? 'चपटा' : 'सामान्य', o.level);
  return { key, title: PARVAT_T[key][lang], lakshana: T(lang, 'ସ୍ଥିତି: ', 'स्थिति: ', 'State: ') + lvl, phala: KAR[key][lang], source: SRC[key], upay: T(lang, 'ଅସନ୍ତୁଳନ ହେତୁ ଗ୍ରହ-ମନ୍ତ୍ର + ଦାନ।', 'असंतुलन हेतु ग्रह-मंत्र + दान।', 'Mantra + daan for imbalance.') };
}
export function judgeHasta(h: HastaType, flex: string, tip: AnguliTip, knots: string, lang: PalmLang): ShastraVerdict[] {
  const H: Record<HastaType, string> = {
    vayu: T(lang, 'ବାୟୁ-ହସ୍ତ — ବିଚାର-ପ୍ରଧାନ।', 'वायु-हस्त — विचार-प्रधान।', 'Air hand — intellectual.'),
    agni: T(lang, 'ଅଗ୍ନି-ହସ୍ତ — ଊର୍ଜାବାନ ନେତା।', 'अग्नि-हस्त — ऊर्जावान नेता।', 'Fire hand — energetic leader.'),
    jala: T(lang, 'ଜଳ-ହସ୍ତ — ଭାବୁକ ଅନ୍ତର୍ଦୃଷ୍ଟି।', 'जल-हस्त — भावुक अंतर्दृष्टि।', 'Water hand — emotional insight.'),
    prithvi: T(lang, 'ପୃଥ୍ୱୀ-ହସ୍ତ — ବ୍ୟାବହାରିକ ପରିଶ୍ରମୀ।', 'पृथ्वी-हस्त — व्यावहारिक परिश्रमी।', 'Earth hand — practical worker.'),
    akasha: T(lang, 'ମିଶ୍ର-ହସ୍ତ — ବହୁମୁଖୀ।', 'मिश्र-हस्त — बहुमुखी।', 'Mixed hand — versatile.'),
  };
  return [
    { key: 'hasta', title: T(lang, 'ହସ୍ତ ପ୍ରକୃତି', 'हस्त प्रकृति', 'Hand type'), lakshana: H[h], phala: T(lang, 'ପଞ୍ଚଭୂତ ସ୍ୱଭାବ ସଙ୍କେତ।', 'पंचभूत स्वभाव संकेत।', 'Elemental nature sign.'), source: 'Samudrika hasta-prakarana; Sen', upay: T(lang, 'ପ୍ରକୃତି-ଅନୁସାରେ କର୍ମ।', 'प्रकृति-अनुसार कर्म।', 'Work per nature.') },
    { key: 'thumb', title: T(lang, 'ବୃଦ୍ଧାଙ୍ଗୁଳି (ସଂକଳ୍ପ)', 'अंगूठा (संकल्प)', 'Thumb (will)'), lakshana: flex === 'flexible' ? T(lang, 'ନମନୀୟ — ଅନୁକୂଳନ।', 'लचीला — अनुकूलन।', 'Flexible — adaptable.') : flex === 'stiff' ? T(lang, 'କଠିନ — ଦୃଢ, ଜିଦ୍ ବର୍ଜନ।', 'कड़ा — दृढ़, जिद वर्जन।', 'Stiff — firm, avoid stubbornness.') : T(lang, 'ମଧ୍ୟମ — ସନ୍ତୁଳିତ।', 'मध्यम — संतुलित।', 'Medium — balanced.'), phala: T(lang, 'ଅଙ୍ଗୁଠି ବଳ = ସଂକଳ୍ପ ବଳ।', 'अंगूठा बल = संकल्प बल।', 'Thumb = will power.'), source: 'Benham/Sen', upay: T(lang, 'ସୂର୍ଯ୍ୟ-ନମସ୍କାର + ଧ୍ୟାନ।', 'सूर्य-नमस्कार + ध्यान।', 'Sun salutation + meditation.') },
    { key: 'fingers', title: T(lang, 'ଅଙ୍ଗୁଳି ଅଗ୍ର + ଗ୍ରନ୍ଥି', 'अंगुली अग्र + ग्रंथि', 'Fingertips + knots'), lakshana: tip + ' / ' + knots, phala: T(lang, 'ସ୍ୱଭାବ ସଙ୍କେତ।', 'स्वभाव संकेत।', 'Nature sign.'), source: 'Sen Fingers ch.', upay: T(lang, 'ଦୁର୍ବଳ ଗ୍ରହ-ବୀଜ ମନ୍ତ୍ର।', 'दुर्बल ग्रह-बीज मंत्र।', 'Weak planet seed mantra.') },
  ];
}
export function overallNirnaya(rekhaV: ShastraVerdict[], lang: PalmLang): string {
  const broken = rekhaV.filter((v) => v.lakshana.includes('ଖଣ୍ଡିତ') || v.lakshana.includes('खंडित') || v.lakshana.includes('Broken')).length;
  if (broken >= 3) return T(lang, 'ଅନେକ ରେଖା ଖଣ୍ଡିତ — ଜୀବନ ମୋଡ ଯୋଗ; ଉପାୟରୁ ସନ୍ତୁଳନ। କର୍ମ ପ୍ରଧାନ।', 'कई रेखा खंडित — जीवन मोड़ योग; उपाय से संतुलन। कर्म प्रधान।', 'Several lines broken — life turns; balance via remedy. Karma rules.');
  return T(lang, 'ସ୍ପଷ୍ଟ ରେଖା ଶୁଭ; କ୍ଷୀଣ କ୍ଷେତ୍ରରେ ନିୟମିତ ଉପାୟ।', 'स्पष्ट रेखा शुभ; क्षीण क्षेत्र में नियमित उपाय।', 'Clear lines good; remedy for weak zones.');
}
