import { ZodiacSign, PlanetName, HouseInfo, VargaType, VargaInfo } from '../../types/jataka';
import { ZODIAC_SIGNS } from './kundali_engine';

export interface VargaSignResult {
  sign: ZodiacSign;
  signIndex: number;
}

/**
 * Classical Brihat Parashara Hora Shastra (BPHS) Shodashavarga (16 Divisional Charts) Engine
 */
export function calculateVargaSign(longitude: number, varga: VargaType): VargaSignResult {
  const normLong = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normLong / 30); // 0 to 11
  const degreeInSign = normLong % 30; // 0 to 30
  const isOddSign = signIndex % 2 === 0; // 0-indexed: 0=Mesha (Odd), 1=Vrishabha (Even)

  let resultSignIndex = signIndex;

  switch (varga) {
    case 'D1': // Rashi
      resultSignIndex = signIndex;
      break;

    case 'D2': { // Hora (15 deg each)
      // Odd signs: 1st half Sun (Simha - 4), 2nd half Moon (Karka - 3)
      // Even signs: 1st half Moon (Karka - 3), 2nd half Sun (Simha - 4)
      const isFirstHalf = degreeInSign < 15;
      if (isOddSign) {
        resultSignIndex = isFirstHalf ? 4 : 3;
      } else {
        resultSignIndex = isFirstHalf ? 3 : 4;
      }
      break;
    }

    case 'D3': { // Drekkana (10 deg each)
      const part = Math.floor(degreeInSign / 10);
      const offset = part === 0 ? 0 : part === 1 ? 4 : 8;
      resultSignIndex = (signIndex + offset) % 12;
      break;
    }

    case 'D4': { // Chaturthamsha (7 deg 30 min each)
      const part = Math.floor(degreeInSign / 7.5);
      resultSignIndex = (signIndex + part * 3) % 12;
      break;
    }

    case 'D7': { // Saptamsha (30/7 deg each)
      const part = Math.floor(degreeInSign / (30 / 7));
      const startSign = isOddSign ? signIndex : (signIndex + 6) % 12;
      resultSignIndex = (startSign + part) % 12;
      break;
    }

    case 'D9': { // Navamsha (3 deg 20 min each)
      const part = Math.floor(degreeInSign / (30 / 9));
      let startingSign = 0;
      if ([0, 4, 8].includes(signIndex)) startingSign = 0; // Fire -> Mesha
      else if ([1, 5, 9].includes(signIndex)) startingSign = 9; // Earth -> Makara
      else if ([2, 6, 10].includes(signIndex)) startingSign = 6; // Air -> Tula
      else if ([3, 7, 11].includes(signIndex)) startingSign = 3; // Water -> Karka
      resultSignIndex = (startingSign + part) % 12;
      break;
    }

    case 'D10': { // Dashamsha (3 deg each)
      const part = Math.floor(degreeInSign / 3);
      const startSign = isOddSign ? signIndex : (signIndex + 8) % 12;
      resultSignIndex = (startSign + part) % 12;
      break;
    }

    case 'D12': { // Dwadashamsha (2 deg 30 min each)
      const part = Math.floor(degreeInSign / 2.5);
      resultSignIndex = (signIndex + part) % 12;
      break;
    }

    case 'D16': { // Shodashamsha (1 deg 52.5 min each)
      const part = Math.floor(degreeInSign / (30 / 16));
      const modality = signIndex % 3; // 0=Movable, 1=Fixed, 2=Dual
      const startSign = modality === 0 ? 0 : modality === 1 ? 4 : 8;
      resultSignIndex = (startSign + part) % 12;
      break;
    }

    case 'D20': { // Vimshamsha (1 deg 30 min each)
      const part = Math.floor(degreeInSign / 1.5);
      const modality = signIndex % 3;
      const startSign = modality === 0 ? 0 : modality === 1 ? 8 : 4;
      resultSignIndex = (startSign + part) % 12;
      break;
    }

    case 'D24': { // Chaturvimshamsha / Siddhamsa (1 deg 15 min each)
      const part = Math.floor(degreeInSign / 1.25);
      const startSign = isOddSign ? 4 : 3;
      resultSignIndex = (startSign + part) % 12;
      break;
    }

    case 'D27': { // Saptavimshamsha / Bhamsha (30/27 deg each)
      const part = Math.floor(degreeInSign / (30 / 27));
      const element = signIndex % 4; // 0=Fire, 1=Earth, 2=Air, 3=Water
      const startSign = element === 0 ? 0 : element === 1 ? 3 : element === 2 ? 6 : 9;
      resultSignIndex = (startSign + part) % 12;
      break;
    }

    case 'D30': { // Trimshamsha (Unequal divisions by planets)
      if (isOddSign) {
        if (degreeInSign < 5) resultSignIndex = 0;
        else if (degreeInSign < 10) resultSignIndex = 10;
        else if (degreeInSign < 18) resultSignIndex = 8;
        else if (degreeInSign < 25) resultSignIndex = 2;
        else resultSignIndex = 6;
      } else {
        if (degreeInSign < 5) resultSignIndex = 1;
        else if (degreeInSign < 12) resultSignIndex = 5;
        else if (degreeInSign < 20) resultSignIndex = 11;
        else if (degreeInSign < 25) resultSignIndex = 9;
        else resultSignIndex = 7;
      }
      break;
    }

    case 'D40': { // Khavedamsha (45 min = 0.75 deg each)
      const part = Math.floor(degreeInSign / 0.75);
      const startSign = isOddSign ? 0 : 6;
      resultSignIndex = (startSign + part) % 12;
      break;
    }

    case 'D45': { // Akshavedamsha (40 min = 2/3 deg each)
      const part = Math.floor(degreeInSign / (2 / 3));
      const modality = signIndex % 3;
      const startSign = modality === 0 ? 0 : modality === 1 ? 4 : 8;
      resultSignIndex = (startSign + part) % 12;
      break;
    }

    case 'D60': { // Shashtiamsha (30 min = 0.5 deg each)
      const part = Math.floor(degreeInSign / 0.5);
      resultSignIndex = (signIndex + part) % 12;
      break;
    }
  }

  const safeIdx = ((resultSignIndex % 12) + 12) % 12;
  return {
    sign: ZODIAC_SIGNS[safeIdx],
    signIndex: safeIdx
  };
}

export const VARGA_METADATA: Record<VargaType, { division: number; name: { en: string; hi: string; or: string }; purpose: { en: string; hi: string; or: string } }> = {
  D1: { division: 1, name: { en: 'Rashi', hi: 'राशि चक्र', or: 'ରାଶି ଚକ୍ର' }, purpose: { en: 'Physical body, general life, overall destiny', hi: 'शरीर, स्वास्थ्य एवं समग्र जीवन', or: 'ଶରୀର, ସ୍ୱାସ୍ଥ୍ୟ ଓ ସମଗ୍ର ଜୀବନ' } },
  D2: { division: 2, name: { en: 'Hora', hi: 'होरा चक्र', or: 'ହୋରା ଚକ୍ର' }, purpose: { en: 'Wealth, financial assets, speech, family treasury', hi: 'धन-संपत्ति, कोष एवं वाणी', or: 'ଧନ-ସମ୍ପତ୍ତି, କୋଷ ଓ ବାଣୀ' } },
  D3: { division: 3, name: { en: 'Drekkana', hi: 'द्रेष्काण चक्र', or: 'ଦ୍ରେକ୍କାଣ ଚକ୍ର' }, purpose: { en: 'Siblings, courage, vitality, karma motivation', hi: 'भाई-बहन, पराक्रम एवं ऊर्जा', or: 'ଭ୍ରାତା-ଭଗିନୀ, ପରାକ୍ରମ ଓ ଶକ୍ତି' } },
  D4: { division: 4, name: { en: 'Chaturthamsha', hi: 'चतुर्थांश चक्र', or: 'ଚତୁର୍ଥାଂଶ ଚକ୍ର' }, purpose: { en: 'Fixed assets, house, lands, conveyances, fortune', hi: 'भूमि-भवन, वाहन एवं अचल संपत्ति', or: 'ଭୂମି-ଭବନ, ଯାନବାହନ ଓ ଭାଗ୍ୟ' } },
  D7: { division: 7, name: { en: 'Saptamsha', hi: 'सप्तांश चक्र', or: 'ସପ୍ତାଂଶ ଚକ୍ର' }, purpose: { en: 'Children, progeny, creativity, creative legacy', hi: 'संतान सुख, वंश वृद्धि एवं सृजन', or: 'ସନ୍ତାନ ସୁଖ, ବଂଶ ବୃଦ୍ଧି ଓ ସୃଜନ' } },
  D9: { division: 9, name: { en: 'Navamsha', hi: 'नवांश चक्र', or: 'ନବାଂଶ ଚକ୍ର' }, purpose: { en: 'Spouse, marriage, inner dharma, soul purpose', hi: 'विवाह, जीवनसाथी एवं आत्मिक धर्म', or: 'ବିବାହ, ଜୀବନସାଥୀ ଓ ଆତ୍ମିକ ଧର୍ମ' } },
  D10: { division: 10, name: { en: 'Dashamsha', hi: 'दशांश चक्र', or: 'ଦଶାଂଶ ଚକ୍ର' }, purpose: { en: 'Profession, career, public status, executive leadership', hi: 'कर्मक्षेत्र, पद-प्रतिष्ठा एवं नेतृत्व', or: 'କର୍ମକ୍ଷେତ୍ର, ପଦ-ପ୍ରତିଷ୍ଠା ଓ ନେତୃତ୍ୱ' } },
  D12: { division: 12, name: { en: 'Dwadashamsha', hi: 'द्वादशांश चक्र', or: 'ଦ୍ୱାଦଶାଂଶ ଚକ୍ର' }, purpose: { en: 'Parents, lineage, ancestral heritage, DNA karma', hi: 'माता-पिता, पितृ ऋण एवं पूर्वज', or: 'ମାତା-ପିତା, ପିତୃଋଣ ଓ ପୂର୍ବଜ' } },
  D16: { division: 16, name: { en: 'Shodashamsha', hi: 'षोडशांश चक्र', or: 'ଷୋଡ଼ଶାଂଶ ଚକ୍ର' }, purpose: { en: 'Vehicles, luxuries, happiness, mental contentment', hi: 'सुख-साधन, वाहन एवं मानसिक शांति', or: 'ସୁଖ-ସାଧନ, ଯାନବାହନ ଓ ମାନସିକ ଶାନ୍ତି' } },
  D20: { division: 20, name: { en: 'Vimshamsha', hi: 'विंशांश चक्र', or: 'ବିଂଶାଂଶ ଚକ୍ର' }, purpose: { en: 'Spiritual progress, religious upasana, divine grace', hi: 'आध्यात्मिक साधना, गुरु कृपा एवं मोक्ष', or: 'ଆଧ୍ୟାତ୍ମିକ ସାଧନା, ଗୁରୁକୃପା ଓ ଉପାସନା' } },
  D24: { division: 24, name: { en: 'Chaturvimshamsha', hi: 'चतुर्विंशांश (सिद्धांश)', or: 'ସିଦ୍ଧାଂଶ ଚକ୍ର' }, purpose: { en: 'Higher learning, intellect, academic genius, research', hi: 'उच्च शिक्षा, बुद्धि एवं विद्या सिद्धि', or: 'ଉଚ୍ଚ ଶିକ୍ଷା, ବୁଦ୍ଧି ଓ ବିଦ୍ୟା ସିଦ୍ଧି' } },
  D27: { division: 27, name: { en: 'Saptavimshamsha', hi: 'सप्तविंशांश (भांश)', or: 'ଭାଂଶ ଚକ୍ର' }, purpose: { en: 'Inherent strength, physical stamina, hidden virtues', hi: 'शारीरिक बल, सहनशक्ति एवं गुप्त सामर्थ्य', or: 'ଶାରୀରିକ ବଳ, ସହନଶକ୍ତି ଓ ଗୁପ୍ତ ସାମର୍ଥ୍ୟ' } },
  D30: { division: 30, name: { en: 'Trimshamsha', hi: 'त्रिंशांश चक्र', or: 'ତ୍ରିଂଶାଂଶ ଚକ୍ର' }, purpose: { en: 'Misfortunes, evils, chronic health risks, challenges', hi: 'अरिष्ट, व्याधि एवं आकस्मिक संकट', or: 'ଅରିଷ୍ଟ, ରୋଗବ୍ୟାଧି ଓ ବିପତ୍ତି' } },
  D40: { division: 40, name: { en: 'Khavedamsha', hi: 'खवेदांश चक्र', or: 'ଖବେଦାଂଶ ଚକ୍ର' }, purpose: { en: 'Auspicious vs inauspicious karmic impacts, general fortune', hi: 'शुभ-अशुभ फल एवं भाग्य विस्तार', or: 'ଶୁଭ-ଅଶୁଭ ଫଳ ଓ ଭାଗ୍ୟ ବିସ୍ତାର' } },
  D45: { division: 45, name: { en: 'Akshavedamsha', hi: 'अक्षवेदांश चक्र', or: 'ଅକ୍ଷବେଦାଂଶ ଚକ୍ର' }, purpose: { en: 'Character integrity, moral purity, all-round well-being', hi: 'चरित्र, आचरण शुद्धि एवं संपूर्ण कल्याण', or: 'ଚରିତ୍ର, ସଦାଚାର ଓ ସର୍ବାଙ୍ଗୀଣ କଲ୍ୟାଣ' } },
  D60: { division: 60, name: { en: 'Shashtiamsha', hi: 'षष्ट्यंश चक्र', or: 'ଷଷ୍ଟ୍ୟଂଶ ଚକ୍ର' }, purpose: { en: 'Past-life karma, deepest esoteric roots, root cause', hi: 'पूर्वजन्म संचित कर्म एवं सूक्ष्म प्रारब्ध', or: 'ପୂର୍ବଜନ୍ମ ସଞ୍ଚିତ କର୍ମ ଓ ସୂକ୍ଷ୍ମ ପ୍ରାରବ୍ଧ' } }
};

export function calculateAllShodashavargas(
  ascendantLongitude: number,
  planets: { name: PlanetName; long: number }[]
): Record<VargaType, VargaInfo> {
  const vargasList: VargaType[] = [
    'D1', 'D2', 'D3', 'D4', 'D7', 'D9', 'D10',
    'D12', 'D16', 'D20', 'D24', 'D27', 'D30', 'D40', 'D45', 'D60'
  ];

  const result: Partial<Record<VargaType, VargaInfo>> = {};

  for (const v of vargasList) {
    const ascVarga = calculateVargaSign(ascendantLongitude, v);
    const meta = VARGA_METADATA[v];

    const houses: HouseInfo[] = [];
    for (let h = 1; h <= 12; h++) {
      const signIdx = (ascVarga.signIndex + (h - 1)) % 12;
      houses.push({
        houseNumber: h,
        sign: ZODIAC_SIGNS[signIdx],
        signIndex: signIdx,
        degree: signIdx * 30,
        planets: []
      });
    }

    for (const p of planets) {
      const pVarga = calculateVargaSign(p.long, v);
      const houseNumber = ((pVarga.signIndex - ascVarga.signIndex + 12) % 12) + 1;
      houses[houseNumber - 1].planets.push(p.name);
    }

    result[v] = {
      code: v,
      name: meta.name,
      division: meta.division,
      purpose: meta.purpose,
      houses,
      ascendantSign: ascVarga.sign,
      ascendantSignIndex: ascVarga.signIndex
    };
  }

  return result as Record<VargaType, VargaInfo>;
}
