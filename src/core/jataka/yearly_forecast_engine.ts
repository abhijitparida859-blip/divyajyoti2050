import { PlanetName, ZodiacSign } from '../../types/jataka';
import { calculatePlanetaryPositions } from '../astronomy/ephemeris';
import { NAKSHATRA_NAMES } from '../panjika/panjika_engine';

export interface YearlyDayForecast {
  dateStr: string;
  dayIndex: number;
  weekday: number;
  tithiName: string;
  tithiNumber: number;
  paksha: 'Shukla' | 'Krishna';
  nakshatra: string;
  nakshatraPada: number;
  yoga: string;
  karana: string;
  moonSign: ZodiacSign;
  maha: PlanetName;
  antar: PlanetName;
  prat: PlanetName;
  sook: PlanetName;
  taraType: string;
  taraGood: boolean;
  chandraHouse: number;
  score: number;
  rating: 'Excellent' | 'Good' | 'Average' | 'Caution' | 'Avoid';
  headline: { en: string; hi: string; or: string };
  detail: { en: string; hi: string; or: string };
  career: { en: string; hi: string; or: string };
  wealth: { en: string; hi: string; or: string };
  health: { en: string; hi: string; or: string };
  relation: { en: string; hi: string; or: string };
  remedy: { en: string; hi: string; or: string };
}

export interface YearlyForecastSummary {
  startDate: string;
  totalDays: number;
  excellent: number;
  good: number;
  average: number;
  caution: number;
  avoid: number;
  bestMonths: { month: string; avgScore: number }[];
  bestDays: YearlyDayForecast[];
  toughDays: YearlyDayForecast[];
  days: YearlyDayForecast[];
}

const SIGN_NAMES: ZodiacSign[] = ['Mesha','Vrishabha','Mithuna','Karka','Simha','Kanya','Tula','Vrischika','Dhanu','Makara','Kumbha','Meena'];
const YOGA_NAMES = ['Vishkambha','Priti','Ayushman','Saubhagya','Shobhana','Atiganda','Sukarma','Dhriti','Shoola','Ganda','Vriddhi','Dhruva','Vyaghata','Harshana','Vajra','Siddhi','Vyatipata','Variyan','Parigha','Shiva','Siddha','Sadhya','Shubha','Shukla','Brahma','Indra','Vaidhriti'];
const TITHI_NAMES = ['Pratipada','Dwitiya','Tritiya','Chaturthi','Panchami','Shashthi','Saptami','Ashtami','Navami','Dashami','Ekadashi','Dwadashi','Trayodashi','Chaturdashi','Purnima'];
const NATURE: Record<string, number> = { Surya:-1, Chandra:1, Mangala:-1, Budha:1, Guru:1, Shukra:1, Shani:-1, Rahu:-1, Ketu:-1 };
const HEAD: Record<string, { en: string; hi: string; or: string }> = {
  Surya: { en:'Authority & father-line favour', hi:'प्रतिष्ठा एवं पितृ-पक्ष से लाभ', or:'ପ୍ରତିଷ୍ଠା ଓ ପିତୃପକ୍ଷଙ୍କ ସହଯୋଗ' },
  Chandra: { en:'Mind calm, mother blesses', hi:'मन प्रसन्न, माता का आशीर्वाद', or:'ମନ ପ୍ରସନ୍ନ, ମାତୃ ଆଶୀର୍ବାଦ' },
  Mangala: { en:'Courage high, avoid haste', hi:'साहस बढ़ेगा, जल्दबाजी से बचें', or:'ସାହସ ବଢ଼ିବ, ତତ୍ପରତା ଠାରୁ ଦୂରେଇ ରୁହନ୍ତୁ' },
  Budha: { en:'Speech, trade & exams shine', hi:'वाणी, व्यापार व परीक्षा में सफलता', or:'ବାଣୀ, ବ୍ୟବସାୟ ଓ ପରୀକ୍ଷାରେ ସଫଳତା' },
  Guru: { en:'Guru kripa, dharma protects', hi:'गुरु कृपा, धर्म रक्षा करेगा', or:'ଗୁରୁ କୃପା, ଧର୍ମ ରକ୍ଷା କରିବ' },
  Shukra: { en:'Love, art & comfort rise', hi:'प्रेम, कला व सुख बढ़ेगा', or:'ପ୍ରେମ, କଳା ଓ ସୁଖ ବଢ଼ିବ' },
  Shani: { en:'Slow steady karmic gains', hi:'धैर्य से कर्मफल मिलेगा', or:'ଧୈର୍ଯ୍ୟରେ କର୍ମଫଳ ମିଳିବ' },
  Rahu: { en:'Foreign & tech openings', hi:'विदेश व तकनीक से अवसर', or:'ବିଦେଶ ଓ ପ୍ରଯୁକ୍ତିରୁ ସୁଯୋଗ' },
  Ketu: { en:'Detachment, spiritual insight', hi:'वैराग्य, आध्यात्मिक अंतर्दृष्टि', or:'ବୈରାଗ୍ୟ, ଆଧ୍ୟାତ୍ମିକ ଅନ୍ତର୍ଦୃଷ୍ଟି' },
};
const REMEDY: Record<string, { en: string; hi: string; or: string }> = {
  Surya: { en:'Offer water to Surya, chant Om Suryaya Namah 11x', hi:'सूर्य को जल अर्पित करें, ॐ सूर्याय नमः 11 बार', or:'ସୂର୍ଯ୍ୟଙ୍କୁ ଜଳ ଅର୍ପଣ କରନ୍ତୁ, ଓଁ ସୂର୍ଯ୍ୟାୟ ନମଃ ୧୧ ଥର' },
  Chandra: { en:'Offer milk to Shivlinga, chant Om Somaya Namah', hi:'शिवलिंग पर दूध चढ़ाएं, ॐ सोमाय नमः जपें', or:'ଶିବଲିଙ୍ଗରେ କ୍ଷୀର ଅର୍ପଣ କରନ୍ତୁ, ଓଁ ସୋମାୟ ନମଃ ଜପ କରନ୍ତୁ' },
  Mangala: { en:'Chant Hanuman Chalisa, donate red lentils', hi:'हनुमान चालीसा पढ़ें, मसूर दाल दान करें', or:'ହନୁମାନ ଚାଳିଶା ପଢ଼ନ୍ତୁ, ମସୁର ଡାଲି ଦାନ କରନ୍ତୁ' },
  Budha: { en:'Chant Om Budhaya Namah, feed green fodder to cow', hi:'ॐ बुधाय नमः जपें, गाय को हरा चारा खिलाएं', or:'ଓଁ ବୁଧାୟ ନମଃ ଜପ କରନ୍ତୁ, ଗାଈକୁ ସବୁଜ ଚାରା ଖୁଆନ୍ତୁ' },
  Guru: { en:'Worship Jagannath/Vishnu, donate yellow gram', hi:'जगन्नाथ/विष्णु पूजन, चना दाल दान करें', or:'ଜଗନ୍ନାଥ/ବିଷ୍ଣୁ ପୂଜା, ବୁଟ ଡାଲି ଦାନ କରନ୍ତୁ' },
  Shukra: { en:'Offer white flowers to Lakshmi, keep clothes clean', hi:'लक्ष्मी को श्वेत पुष्प, वस्त्र स्वच्छ रखें', or:'ଲକ୍ଷ୍ମୀଙ୍କୁ ଧଳା ଫୁଲ, ବସ୍ତ୍ର ପରିଷ୍କାର ରଖନ୍ତୁ' },
  Shani: { en:'Light mustard-oil lamp, chant Om Sham Shanicharaya Namah', hi:'सरसों का दीप जलाएं, ॐ शं शनैश्चराय नमः जपें', or:'ସୋରିଷ ତେଲ ଦୀପ ଜାଳନ୍ତୁ, ଓଁ ଶଂ ଶନୈଶ୍ଚରାୟ ନମଃ ଜପ କରନ୍ତୁ' },
  Rahu: { en:'Donate black sesame, chant Om Rahave Namah', hi:'काले तिल दान करें, ॐ राहवे नमः जपें', or:'କଳା ରାଶି ଦାନ କରନ୍ତୁ, ଓଁ ରାହବେ ନମଃ ଜପ କରନ୍ତୁ' },
  Ketu: { en:'Feed dogs, chant Om Ketave Namah, meditate', hi:'कुत्तों को रोटी दें, ॐ केतवे नमः व ध्यान करें', or:'କୁକୁରଙ୍କୁ ରୁଟି ଦିଅନ୍ତୁ, ଓଁ କେତବେ ନମଃ ଓ ଧ୍ୟାନ କରନ୍ତୁ' },
};
function norm360(d: number): number { let x = d % 360; if (x < 0) x += 360; return x; }
function dsOf(d: Date): string { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }

export function findDashaOnDate(dashas: any[], date: Date): { maha: PlanetName; antar: PlanetName; prat: PlanetName; sook: PlanetName } {
  const t = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  let maha: PlanetName = dashas[0]?.planet ?? 'Guru';
  let antar: PlanetName = dashas[0]?.subDashas?.[0]?.planet ?? 'Guru';
  let prat: PlanetName = dashas[0]?.subDashas?.[0]?.subDashas?.[0]?.planet ?? 'Guru';
  let sook: PlanetName = dashas[0]?.subDashas?.[0]?.subDashas?.[0]?.subDashas?.[0]?.planet ?? 'Guru';
  for (const d of dashas) {
    const s = new Date(d.startDate + 'T00:00:00').getTime();
    const e = new Date(d.endDate + 'T00:00:00').getTime();
    if (t < s || t > e) continue;
    maha = d.planet;
    for (const a of d.subDashas ?? []) {
      const as = new Date(a.startDate + 'T00:00:00').getTime();
      const ae = new Date(a.endDate + 'T00:00:00').getTime();
      if (t < as || t > ae) continue;
      antar = a.planet;
      for (const p of a.subDashas ?? []) {
        const ps = new Date(p.startDate + 'T00:00:00').getTime();
        const pe = new Date(p.endDate + 'T00:00:00').getTime();
        if (t < ps || t > pe) continue;
        prat = p.planet;
        for (const q of p.subDashas ?? []) {
          const qs = new Date(q.startDate + 'T00:00:00').getTime();
          const qe = new Date(q.endDate + 'T00:00:00').getTime();
          if (t >= qs && t <= qe) { sook = q.planet; break; }
        }
        break;
      }
      break;
    }
    break;
  }
  return { maha, antar, prat, sook };
}

export function calculateYearlyForecast(natalMoonSignIndex: number, natalMoonNakIndex: number, dashas: any[], startDate: Date = new Date()): YearlyForecastSummary {
  const days: YearlyDayForecast[] = [];
  const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const span = 360 / 27;
  for (let i = 0; i < 365; i++) {
    const d = new Date(start.getTime() + i * 86400000);
    const pos = calculatePlanetaryPositions(new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 6, 30)));
    const sunLong = norm360(pos.sun);
    const moonLong = norm360(pos.moon);
    const diff = norm360(moonLong - sunLong);
    const tithiNumber = Math.floor(diff / 12) + 1;
    const paksha: 'Shukla' | 'Krishna' = tithiNumber <= 15 ? 'Shukla' : 'Krishna';
    const nakIdx = Math.floor(moonLong / span) % 27;
    const nakPada = Math.floor(((moonLong / span) % 1) * 4) + 1;
    const yoga = YOGA_NAMES[Math.floor(norm360(sunLong + moonLong) / span) % 27];
    const karIdx = Math.floor(diff / 6);
    const karana = karIdx === 0 ? 'Kintughna' : karIdx >= 57 ? ['Shakuni','Chatushpada','Naga','Kintughna'][karIdx-57] : ['Bava','Balava','Kaulava','Taitila','Gara','Vanija','Vishti'][(karIdx-1)%7];
    const moonSignIdx = Math.floor(moonLong / 30) % 12;
    const dd = findDashaOnDate(dashas, d);
    const taraNum = ((nakIdx - natalMoonNakIndex) % 27 + 27) % 27 + 1;
    const taraMod = taraNum % 9 === 0 ? 9 : taraNum % 9;
    const taraGood = ![1,3,5,7].includes(taraMod);
    const taraType = ['Janma','Sampat','Vipat','Kshema','Pratyari','Sadhaka','Vadha','Mitra','ParamaMitra'][(taraNum-1)%9];
    const chHouse = ((moonSignIdx - natalMoonSignIndex + 12) % 12) + 1;
    const chGood = [1,3,6,7,10,11].includes(chHouse);
    let score = 50 + NATURE[dd.maha]*8 + NATURE[dd.antar]*10 + NATURE[dd.prat]*7 + NATURE[dd.sook]*3;
    score += taraGood ? 8 : -10;
    score += chGood ? 8 : -8;
    if (chHouse === 8) score -= 8;
    if ([11,26].includes(tithiNumber)) score += 4;
    if (tithiNumber === 30) score -= 3;
    score = Math.max(2, Math.min(99, Math.round(score)));
    const rating: YearlyDayForecast['rating'] = score >= 78 ? 'Excellent' : score >= 62 ? 'Good' : score >= 45 ? 'Average' : score >= 30 ? 'Caution' : 'Avoid';
    const g = HEAD[dd.antar] ?? HEAD[dd.maha];
    const r = REMEDY[dd.prat] ?? REMEDY[dd.antar];
    const dl = `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`;
    const rl = rating==='Excellent'?{hi:'उत्तम',or:'ଉତ୍ତମ'}:rating==='Good'?{hi:'शुभ',or:'ଶୁଭ'}:rating==='Average'?{hi:'मध्यम',or:'ମଧ୍ୟମ'}:rating==='Caution'?{hi:'सावधान',or:'ସତର୍କ'}:{hi:'टालें',or:'ବର୍ଜନ'};
    const tName = TITHI_NAMES[(tithiNumber-1)%15];
    days.push({
      dateStr: dsOf(d), dayIndex: i + 1, weekday: d.getDay(), tithiName: tName, tithiNumber, paksha,
      nakshatra: NAKSHATRA_NAMES[nakIdx], nakshatraPada: nakPada, yoga, karana,
      moonSign: SIGN_NAMES[moonSignIdx], maha: dd.maha, antar: dd.antar, prat: dd.prat, sook: dd.sook,
      taraType, taraGood, chandraHouse: chHouse, score, rating,
      headline: { en:`${g.en} • ${rating} day (${score}/100)`, hi:`${g.hi} • ${rl.hi} दिन (${score}/100)`, or:`${g.or} • ${rl.or} ଦିନ (${score}/100)` },
      detail: { en:`${dl}: ${paksha} ${tName}, ${NAKSHATRA_NAMES[nakIdx]} pada-${nakPada}, Moon in ${SIGN_NAMES[moonSignIdx]} (${chHouse}th from natal Moon). Dasha ${dd.maha}/${dd.antar}/${dd.prat}. Tara ${taraType} ${taraGood?'favourable':'unfavourable'}.`, hi:`${dl}: ${paksha==='Shukla'?'शुक्ल':'कृष्ण'} ${tName}, ${NAKSHATRA_NAMES[nakIdx]} चरण-${nakPada}, चंद्रमा ${SIGN_NAMES[moonSignIdx]} में (जन्म चंद्र से ${chHouse}वां)। दशा ${dd.maha}/${dd.antar}/${dd.prat}।`, or:`${dl}: ${paksha==='Shukla'?'ଶୁକ୍ଳ':'କୃଷ୍ଣ'} ${tName}, ${NAKSHATRA_NAMES[nakIdx]} ପାଦ-${nakPada}, ଚନ୍ଦ୍ର ${SIGN_NAMES[moonSignIdx]}ରେ। ଦଶା ${dd.maha}/${dd.antar}/${dd.prat}।` },
      career: { en:(rating==='Excellent'||rating==='Good')?`Career momentum strong under ${dd.antar} antar. Push interviews and meetings.`:`Steady work under ${dd.antar} antar; patience wins.`, hi:(rating==='Excellent'||rating==='Good')?`${dd.antar} अंतर्दशा में करियर गति तेज।`:`${dd.antar} अंतर्दशा में धैर्य रखें।`, or:(rating==='Excellent'||rating==='Good')?`${dd.antar} ଅନ୍ତର୍ଦ୍ଦଶାରେ କର୍ମ ଗତି ତୀବ୍ର।`:`${dd.antar} ଅନ୍ତର୍ଦ୍ଦଶାରେ ଧୈର୍ଯ୍ୟ ରଖନ୍ତୁ।` },
      wealth: { en:(taraGood&&chGood)?'Favourable for money flow and planned purchases.':'Hold major spending; review budgets.', hi:(taraGood&&chGood)?'धन आगमन हेतु शुभ।':'बड़ा खर्च रोकें।', or:(taraGood&&chGood)?'ଧନ ଆଗମନ ପାଇଁ ଶୁଭ।':'ବଡ଼ ଖର୍ଚ୍ଚ ଅଟକାନ୍ତୁ।' },
      health: { en:chHouse===8?'Low energy: rest, hydrate, avoid night travel.':(chGood?'Good vitality: walk, pranayama, sattvic food.':'Restless mind: early sleep, light food.'), hi:chHouse===8?'ऊर्जा कम: विश्राम करें।':(chGood?'उत्तम स्फूर्ति।':'मन चंचल: जल्दी सोएं।'), or:chHouse===8?'ଶକ୍ତି କମ: ବିଶ୍ରାମ ନିଅନ୍ତୁ।':(chGood?'ଉତ୍ତମ ସ୍ଫୂର୍ତ୍ତି।':'ମନ ଚଞ୍ଚଳ: ଶୀଘ୍ର ଶୋଇବା।') },
      relation: { en:(taraType==='Mitra'||taraType==='ParamaMitra')?'Warm bonds: call elders, plan family time.':(taraGood?'Cordial day: listen more.':'Friction likely: postpone debates.'), hi:'संबंधों में मधुरता रखें।', or:'ସମ୍ପର୍କରେ ମଧୁରତା ରଖନ୍ତୁ।' },
      remedy: r,
    });
  }

  const cnt = (rt: string) => days.filter(x => x.rating === rt).length;
  const byMonth = new Map<string, { sum: number; n: number }>();
  for (const x of days) { const m = x.dateStr.slice(0,7); const c = byMonth.get(m) ?? { sum:0, n:0 }; c.sum += x.score; c.n += 1; byMonth.set(m, c); }
  const bestMonths = [...byMonth.entries()].map(([month,v]) => ({ month, avgScore: Math.round(v.sum/v.n) })).sort((a,b) => b.avgScore-a.avgScore).slice(0,3);
  return { startDate: dsOf(start), totalDays: 365, excellent: cnt('Excellent'), good: cnt('Good'), average: cnt('Average'), caution: cnt('Caution'), avoid: cnt('Avoid'), bestMonths, bestDays: [...days].sort((a,b) => b.score-a.score).slice(0,10), toughDays: [...days].sort((a,b) => a.score-b.score).slice(0,10), days };
}

export const DASHA_PHALA_TEXT: Record<string, { en: string; hi: string; or: string }> = {
  Surya: { en:'Surya lifts authority and father-line support. Keep ego soft.', hi:'सूर्य दशा में प्रतिष्ठा व पितृ सहयोग। अहंकार नरम रखें।', or:'ସୂର୍ଯ୍ୟ ଦଶାରେ ପ୍ରତିଷ୍ଠା। ଅହଂକାର ନରମ ରଖନ୍ତୁ।' },
  Chandra: { en:'Chandra blesses mind, mother, travel. Routine steadies emotions.', hi:'चंद्र दशा में मन, माता शुभ। दिनचर्या से स्थिरता।', or:'ଚନ୍ଦ୍ର ଦଶାରେ ମନ, ମାତା ଶୁଭ।' },
  Mangala: { en:'Mangala sparks courage and land wins. Control temper.', hi:'मंगल में साहस व भूमि लाभ। क्रोध से बचें।', or:'ମଙ୍ଗଳରେ ସାହସ ଓ ଭୂମି ଲାଭ।' },
  Budha: { en:'Budha favours study, trade, negotiation. Verify papers twice.', hi:'बुध में विद्या, व्यापार शुभ। कागज जांचें।', or:'ବୁଧରେ ବିଦ୍ୟା, ବାଣିଜ୍ୟ ଶୁଭ।' },
  Guru: { en:'Guru protects dharma, teachers, fortune. Best for marriage.', hi:'गुरु में धर्म, भाग्य रक्षा। विवाह हेतु सर्वोत्तम।', or:'ଗୁରୁରେ ଧର୍ମ, ଭାଗ୍ୟ ରକ୍ଷା।' },
  Shukra: { en:'Shukra gifts love, luxury, arts. Guard over-spending.', hi:'शुक्र में प्रेम, सुख। अति खर्च से बचें।', or:'ଶୁକ୍ରରେ ପ୍ରେମ, ସୁଖ।' },
  Shani: { en:'Shani tests patience, builds lasting assets. Serve elders.', hi:'शनि धैर्य मांगती है। बड़ों की सेवा करें।', or:'ଶନି ଧୈର୍ଯ୍ୟ ମାଗେ। ବଡ଼ଙ୍କ ସେବା କରନ୍ତୁ।' },
  Rahu: { en:'Rahu opens foreign/tech gates. Verify and stay ethical.', hi:'राहु में विदेश द्वार। जांचें, नीति रखें।', or:'ରାହୁରେ ବିଦେଶ ଦ୍ୱାର।' },
  Ketu: { en:'Ketu detaches and purifies. Surrender wins.', hi:'केतु विरक्ति देती है। समर्पण विजय है।', or:'କେତୁ ବୈରାଗ୍ୟ ଦିଏ।' },
};
export function getDashaPhala(planet: PlanetName): { en: string; hi: string; or: string } { return DASHA_PHALA_TEXT[planet] ?? DASHA_PHALA_TEXT.Guru; }

