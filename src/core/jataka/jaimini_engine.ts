import { PlanetName, PlanetPosition, ZodiacSign, CharaKaraka, JaiminiData } from '../../types/jataka';
import { ZODIAC_SIGNS, RASHI_LORDS } from './kundali_engine';
import { calculateNavamshaSign } from './kundali_engine';

export function calculateJaiminiAstrology(
  planets: Record<PlanetName, PlanetPosition>,
  ascSignIndex: number
): JaiminiData {
  // 7 Chara Karakas: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn (Rahu/Ketu excluded)
  const mainPlanets: PlanetName[] = ['Surya', 'Chandra', 'Mangala', 'Budha', 'Guru', 'Shukra', 'Shani'];

  // Sort by degree in sign (descending)
  const sortedPlanets = [...mainPlanets].sort((a, b) => planets[b].degreeInSign - planets[a].degreeInSign);

  const KARAKA_ROLES: {
    karaka: CharaKaraka['karaka'];
    name: { en: string; hi: string; or: string };
    signification: { en: string; hi: string; or: string };
  }[] = [
    { karaka: 'AK', name: { en: 'Atmakaraka', hi: 'आत्मकारक', or: 'ଆତ୍ମକାରକ' }, signification: { en: 'Soul, self, spiritual destiny, life mission', hi: 'आत्मा, आत्म-उन्नति एवं जीवन का मूल उद्देश्य', or: 'ଆତ୍ମା, ଆତ୍ମୋନ୍ନତି ଓ ଜୀବନର ମୁଖ୍ୟ ଲକ୍ଷ୍ୟ' } },
    { karaka: 'AmK', name: { en: 'Amatyakaraka', hi: 'अमात्यकारक', or: 'ଅମାତ୍ୟକାରକ' }, signification: { en: 'Career, profession, intellectual advisor, status', hi: 'आजीविका, कर्मक्षेत्र एवं प्रशासनिक प्रभाव', or: 'କର୍ମକ୍ଷେତ୍ର, ବ୍ୟବସାୟ ଓ ପ୍ରଶାସନିକ ପ୍ରଭାବ' } },
    { karaka: 'BK', name: { en: 'Bhratrikaraka', hi: 'भ्रातृकारक', or: 'ଭ୍ରାତୃକାରକ' }, signification: { en: 'Siblings, guru, courage, fatherly guidance', hi: 'भाई-बहन, गुरु एवं पथ-प्रदर्शक', or: 'ଭାଇ-ଭଉଣୀ, ଗୁରୁ ଓ ମାର୍ଗଦର୍ଶକ' } },
    { karaka: 'MK', name: { en: 'Matrikaraka', hi: 'मातृकारक', or: 'ମାତୃକାରକ' }, signification: { en: 'Mother, home, inner contentment, nurturing', hi: 'माता, सुख-शांति एवं गृह-संसार', or: 'ମାତା, ସୁଖଶାନ୍ତି ଓ ଘରୋଇ ଜୀବନ' } },
    { karaka: 'PK', name: { en: 'Putrakaraka', hi: 'पुत्रकारक', or: 'ପୁତ୍ରକାରକ' }, signification: { en: 'Children, intellect, higher learning, creativity', hi: 'संतान, बुद्धि एवं ज्ञानार्जन', or: 'ସନ୍ତାନ, ବୁଦ୍ଧି ଓ ଉଚ୍ଚ ଶିକ୍ଷା' } },
    { karaka: 'GK', name: { en: 'Gnatikaraka', hi: 'ज्ञातिकारक', or: 'ଜ୍ଞାତିକାରକ' }, signification: { en: 'Obstacles, rivals, struggles, relatives, tests', hi: 'बाधाएं, शत्रु एवं जीवन की चुनौतियाँ', or: 'ବାଧାବିଘ୍ନ, ଶତ୍ରୁ ଓ ଜୀବନର ପରୀକ୍ଷା' } },
    { karaka: 'DK', name: { en: 'Darakaraka', hi: 'दाराकारक', or: 'ଦାରାକାରକ' }, signification: { en: 'Spouse, marriage partner, business alliances', hi: 'जीवनसाथी, दांपत्य एवं साझेदारी', or: 'ଜୀବନସାଥୀ, ଦାମ୍ପତ୍ୟ ଓ ସହଭାଗିତା' } }
  ];

  const charaKarakas: CharaKaraka[] = sortedPlanets.map((p, idx) => {
    const role = KARAKA_ROLES[idx];
    const pos = planets[p];
    return {
      karaka: role.karaka,
      karakaName: role.name,
      planet: p,
      degreeInSign: pos.degreeInSign,
      sign: pos.sign,
      signification: role.signification
    };
  });

  // Arudha Lagna (AL): Distance from Lagna Lord to Lagna
  const lagnaLord = RASHI_LORDS[ZODIAC_SIGNS[ascSignIndex]];
  const lagnaLordHouse = planets[lagnaLord].house; // 1 to 12
  const distance = lagnaLordHouse - 1; // steps forward
  let alHouse = ((lagnaLordHouse + distance - 1) % 12) + 1;
  // Parashari exception: if AL falls in 1st or 7th, take 10th from it
  if (alHouse === 1 || alHouse === 7) {
    alHouse = ((alHouse + 9 - 1) % 12) + 1;
  }
  const alSignIndex = (ascSignIndex + alHouse - 1) % 12;

  // Upapada Lagna (UL): Distance from 12th Lord to 12th House
  const h12SignIdx = (ascSignIndex + 11) % 12;
  const h12Lord = RASHI_LORDS[ZODIAC_SIGNS[h12SignIdx]];
  const h12LordHouse = planets[h12Lord].house;
  const h12Distance = ((h12LordHouse - 12 + 12) % 12);
  let ulHouse = ((h12LordHouse + h12Distance - 1) % 12) + 1;
  if (ulHouse === 12 || ulHouse === 6) {
    ulHouse = ((ulHouse + 9 - 1) % 12) + 1;
  }
  const ulSignIndex = (ascSignIndex + ulHouse - 1) % 12;

  // Karakamsha Lagna: Navamsha sign of Atmakaraka
  const atmakarakaPlanet = charaKarakas[0].planet;
  const akLong = planets[atmakarakaPlanet].longitude;
  const akNavamsha = calculateNavamshaSign(akLong);

  return {
    charaKarakas,
    arudhaLagna: {
      sign: ZODIAC_SIGNS[alSignIndex],
      signIndex: alSignIndex,
      house: alHouse
    },
    upapadaLagna: {
      sign: ZODIAC_SIGNS[ulSignIndex],
      signIndex: ulSignIndex,
      house: ulHouse
    },
    karakamsha: {
      sign: akNavamsha.sign,
      signIndex: akNavamsha.signIndex,
      navamshaSign: akNavamsha.sign
    }
  };
}
