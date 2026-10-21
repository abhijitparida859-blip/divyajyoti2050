import { PlanetName, PlanetPosition, VargaType, VargaInfo, VimsopakaBalaData, PlanetVimsopaka } from '../../types/jataka';
import { RASHI_LORDS } from './kundali_engine';

const VARGA_WEIGHTS: Record<VargaType, number> = {
  D1: 3.5,
  D2: 1.0,
  D3: 1.0,
  D4: 0.5,
  D7: 0.5,
  D9: 3.0,
  D10: 0.5,
  D12: 0.5,
  D16: 2.0,
  D20: 0.5,
  D24: 0.5,
  D27: 0.5,
  D30: 1.0,
  D40: 0.5,
  D45: 0.5,
  D60: 4.0
};

// Planetary Exaltation Degrees
const EXALTATION_DEGREES: Record<PlanetName, number> = {
  Surya: 10,       // Mesha 10°
  Chandra: 33,     // Vrishabha 3°
  Mangala: 298,    // Makara 28°
  Budha: 165,      // Kanya 15°
  Guru: 95,        // Karka 5°
  Shukra: 357,     // Meena 27°
  Shani: 200,      // Tula 20°
  Rahu: 45,        // Vrishabha 15°
  Ketu: 225        // Vrischika 15°
};

export function calculateVimsopakaBala(
  typedPlanets: Record<PlanetName, PlanetPosition>,
  vargas: Record<VargaType, VargaInfo>
): VimsopakaBalaData {
  const planets: Record<PlanetName, PlanetVimsopaka> = {} as Record<PlanetName, PlanetVimsopaka>;

  const planetList: PlanetName[] = [
    'Surya', 'Chandra', 'Mangala', 'Budha', 'Guru', 'Shukra', 'Shani', 'Rahu', 'Ketu'
  ];

  let highestVimScore = -1;
  let highestVimPlanet: PlanetName = 'Guru';
  let highestIshtaScore = -1;
  let highestIshtaPlanet: PlanetName = 'Guru';

  planetList.forEach((pName) => {
    const p = typedPlanets[pName];
    let weightedPoints = 0;

    // Calculate score across all 16 Shodashavargas
    (Object.keys(vargas) as VargaType[]).forEach((vType) => {
      const vInfo = vargas[vType];
      const weight = VARGA_WEIGHTS[vType] || 0.5;

      // Find which house the planet is in for this varga
      let planetSign = p.sign;
      if (vInfo && vInfo.houses) {
        for (const h of vInfo.houses) {
          if (h.planets.includes(pName)) {
            planetSign = h.sign;
            break;
          }
        }
      }

      const signLord = RASHI_LORDS[planetSign];

      // Dignity ratio (0 to 1.0)
      let dignityRatio = 0.5; // neutral
      if (signLord === pName) {
        dignityRatio = 1.0; // own sign
      } else if (p.dignity === 'Exalted') {
        dignityRatio = 1.0;
      } else if (p.dignity === 'Friendly') {
        dignityRatio = 0.75;
      } else if (p.dignity === 'Enemy') {
        dignityRatio = 0.35;
      } else if (p.dignity === 'Debilitated') {
        dignityRatio = 0.25;
      }

      weightedPoints += weight * dignityRatio;
    });

    const vimsopakaScore = Math.round(weightedPoints * 10) / 10;

    // Grade
    let vimsopakaGrade: 'Purna' | 'Uttama' | 'Madhyama' | 'Heena' = 'Madhyama';
    let gradeName = { en: 'Madhyama (Moderate 8-12)', hi: 'मध्यम बल (8-12)', or: 'ମଧ୍ୟମ ବଳ (୮-୧୨)' };

    if (vimsopakaScore >= 16) {
      vimsopakaGrade = 'Purna';
      gradeName = { en: 'Purna Bala (Exceptional 16-20)', hi: 'पूर्ण बल (अति श्रेष्ठ 16-20)', or: 'ପୂର୍ଣ୍ଣ ବଳ (ଅତି ଉତ୍କୃଷ୍ଟ ୧୬-୨୦)' };
    } else if (vimsopakaScore >= 12) {
      vimsopakaGrade = 'Uttama';
      gradeName = { en: 'Uttama Bala (Strong 12-16)', hi: 'उत्तम बल (प्रबल 12-16)', or: 'ଉତ୍ତମ ବଳ (ପ୍ରବଳ ୧୨-୧୬)' };
    } else if (vimsopakaScore < 8) {
      vimsopakaGrade = 'Heena';
      gradeName = { en: 'Heena Bala (Delicate < 8)', hi: 'हीन बल (संवेदनशील < 8)', or: 'ହୀନ ବଳ (ସମ୍ବେଦନଶୀଳ < ୮)' };
    }

    // Ishta & Kashta Phala calculation (0 to 60)
    // 1. Uchcha Bala (Exaltation distance from debilitation point)
    const exaltLon = EXALTATION_DEGREES[pName] || 0;
    const debilLon = (exaltLon + 180) % 360;
    const distFromDebil = (p.longitude - debilLon + 360) % 360;
    const effectiveDist = distFromDebil > 180 ? 360 - distFromDebil : distFromDebil;
    const uchchaBala = (effectiveDist / 180) * 60; // 0 to 60

    // 2. Chesta / Motional Bala approximation
    let chestaBala = 30; // average
    if (p.isRetrograde) chestaBala = 55;
    else if (p.dignity === 'Exalted' || p.dignity === 'Own') chestaBala = 45;
    else chestaBala = 25;

    // Parashari formula: Ishta = sqrt(Uchcha * Chesta), Kashta = sqrt((60 - Uchcha) * (60 - Chesta))
    const ishtaPhala = Math.round(Math.sqrt(Math.max(1, uchchaBala * chestaBala)) * 10) / 10;
    const kashtaPhala = Math.round(Math.sqrt(Math.max(1, (60 - uchchaBala) * (60 - chestaBala))) * 10) / 10;

    let sigEn = `Vimsopaka score is ${vimsopakaScore}/20 (${gradeName.en}). `;
    let sigHi = `विंशोपक बल ${vimsopakaScore}/20 (${gradeName.hi}) है। `;
    let sigOr = `ବିଂଶୋପକ ବଳ ${vimsopakaScore}/20 (${gradeName.or}) ଅଟେ। `;

    if (ishtaPhala >= kashtaPhala) {
      sigEn += `Ishta Phala (${ishtaPhala}) surpasses Kashta Phala (${kashtaPhala}), ensuring benevolent and dignified rewards.`;
      sigHi += `इष्ट फल (${ishtaPhala}) कष्ट फल (${kashtaPhala}) से अधिक होने के कारण यह ग्रह अपनी दशा में शुभ और सुखद परिणाम देगा।`;
      sigOr += `ଇଷ୍ଟ ଫଳ (${ishtaPhala}) କଷ୍ଟ ଫଳ (${kashtaPhala}) ଠାରୁ ଅଧିକ ଥିବାରୁ ଏହି ଗ୍ରହ ନିଜ ଦଶାରେ ଶୁଭ ଓ ସୁଖମୟ ଫଳ ପ୍ରଦାନ କରିବେ।`;
    } else {
      sigEn += `Kashta Phala (${kashtaPhala}) exceeds Ishta Phala (${ishtaPhala}), indicating fruition arrives through disciplined efforts.`;
      sigHi += `कष्ट फल (${kashtaPhala}) इष्ट फल (${ishtaPhala}) से अधिक है, अतः धैर्य और नियमित साधना से सफलता प्राप्त होगी।`;
      sigOr += `କଷ୍ଟ ଫଳ (${kashtaPhala}) ଇଷ୍ଟ ଫଳ (${ishtaPhala}) ଠାରୁ ଅଧିକ ଥିବାରୁ ନିରନ୍ତର ଧୈର୍ଯ୍ୟ ଓ ଉପାୟ ଦ୍ୱାରା କାର୍ଯ୍ୟ ସିଦ୍ଧି ହେବ।`;
    }

    planets[pName] = {
      planet: pName,
      vimsopakaScore,
      vimsopakaGrade,
      gradeName,
      ishtaPhala,
      kashtaPhala,
      significance: {
        en: sigEn,
        hi: sigHi,
        or: sigOr
      }
    };

    if (vimsopakaScore > highestVimScore) {
      highestVimScore = vimsopakaScore;
      highestVimPlanet = pName;
    }
    if (ishtaPhala > highestIshtaScore) {
      highestIshtaScore = ishtaPhala;
      highestIshtaPlanet = pName;
    }
  });

  return {
    planets,
    highestVimsopakaPlanet: highestVimPlanet,
    highestIshtaPlanet: highestIshtaPlanet
  };
}
