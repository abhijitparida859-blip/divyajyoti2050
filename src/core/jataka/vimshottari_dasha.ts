import { PlanetName, DashaPeriod } from '../../types/jataka';

export const DASHA_LORDS: { planet: PlanetName; years: number }[] = [
  { planet: 'Ketu', years: 7 },
  { planet: 'Shukra', years: 20 },
  { planet: 'Surya', years: 6 },
  { planet: 'Chandra', years: 10 },
  { planet: 'Mangala', years: 7 },
  { planet: 'Rahu', years: 18 },
  { planet: 'Guru', years: 16 },
  { planet: 'Shani', years: 19 },
  { planet: 'Budha', years: 17 },
];

export type DashaLevel = 'Mahadasha' | 'Antardasha' | 'Pratyantardasha' | 'Sookshmasha' | 'Pranadasha';

const formatDateStr = (d: Date): string => {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/**
 * Vimshottari Dasha Engine (120-Year Natural Cycle)
 */
export function calculateVimshottariDashas(moonLongitude: number, birthDate: Date): DashaPeriod[] {
  const nakshatraSpan = 360 / 27; // 13° 20' = 13.333333°
  const nakshatraIndex = Math.floor(moonLongitude / nakshatraSpan); // 0 to 26
  const fractionElapsed = (moonLongitude % nakshatraSpan) / nakshatraSpan;

  // The ruler index in the 9-planet Vimshottari sequence
  const startingLordIndex = nakshatraIndex % 9;
  const initialLord = DASHA_LORDS[startingLordIndex];

  // Remaining balance of the initial Mahadasha at birth
  const remainingFraction = 1 - fractionElapsed;
  const initialRemainingYears = initialLord.years * remainingFraction;

  const result: DashaPeriod[] = [];
  let currentDate = new Date(birthDate.getTime());

  for (let i = 0; i < 9; i++) {
    const lordIdx = (startingLordIndex + i) % 9;
    const lord = DASHA_LORDS[lordIdx];
    const durationYears = i === 0 ? initialRemainingYears : lord.years;

    const startDate = new Date(currentDate.getTime());
    const endDate = new Date(currentDate.getTime() + durationYears * 365.25 * 86400000);
    currentDate = endDate;

    // Generate Antardashas within this Mahadasha
    const subDashas: DashaPeriod[] = [];
    let subCurrentDate = new Date(startDate.getTime());

    for (let j = 0; j < 9; j++) {
      const subLordIdx = (lordIdx + j) % 9;
      const subLord = DASHA_LORDS[subLordIdx];

      // Antardasha duration = (Mahadasha years * Antardasha lord years) / 120
      const subYears = (lord.years * subLord.years) / 120;
      const subStartDate = new Date(subCurrentDate.getTime());
      const subEndDate = new Date(subCurrentDate.getTime() + subYears * 365.25 * 86400000);
      subCurrentDate = subEndDate;

      // Generate Pratyantardashas within this Antardasha (each nests Sookshma → Prana)
      const pratyantarDashas: DashaPeriod[] = [];
      let pratyantarDate = new Date(subStartDate.getTime());

      for (let k = 0; k < 9; k++) {
        const pLordIdx = (subLordIdx + k) % 9;
        const pLord = DASHA_LORDS[pLordIdx];
        const pYears = (subYears * pLord.years) / 120;
        const pStartDate = new Date(pratyantarDate.getTime());
        const pEndDate = new Date(pratyantarDate.getTime() + pYears * 365.25 * 86400000);
        pratyantarDate = pEndDate;

        // Sookshmashas within this Pratyantardasha
        const sookshmaDashas: DashaPeriod[] = [];
        let sookshmaDate = new Date(pStartDate.getTime());
        for (let m = 0; m < 9; m++) {
          const sLordIdx = (pLordIdx + m) % 9;
          const sLord = DASHA_LORDS[sLordIdx];
          const sYears = (pYears * sLord.years) / 120;
          const sStartDate = new Date(sookshmaDate.getTime());
          const sEndDate = new Date(sookshmaDate.getTime() + sYears * 365.25 * 86400000);
          sookshmaDate = sEndDate;

          // Pranadashas within this Sookshmasha
          const pranaDashas: DashaPeriod[] = [];
          let pranaDate = new Date(sStartDate.getTime());
          for (let n = 0; n < 9; n++) {
            const nLordIdx = (sLordIdx + n) % 9;
            const nLord = DASHA_LORDS[nLordIdx];
            const nYears = (sYears * nLord.years) / 120;
            const nStartDate = new Date(pranaDate.getTime());
            const nEndDate = new Date(pranaDate.getTime() + nYears * 365.25 * 86400000);
            pranaDate = nEndDate;
            pranaDashas.push({
              planet: nLord.planet,
              startDate: formatDateStr(nStartDate),
              endDate: formatDateStr(nEndDate),
              durationYears: Math.round(nYears * 10000) / 10000,
              level: 'Pranadasha' as DashaPeriod['level']
            });
          }

          sookshmaDashas.push({
            planet: sLord.planet,
            startDate: formatDateStr(sStartDate),
            endDate: formatDateStr(sEndDate),
            durationYears: Math.round(sYears * 10000) / 10000,
            level: 'Sookshmasha' as DashaPeriod['level'],
            subDashas: pranaDashas
          });
        }

        pratyantarDashas.push({
          planet: pLord.planet,
          startDate: formatDateStr(pStartDate),
          endDate: formatDateStr(pEndDate),
          durationYears: Math.round(pYears * 1000) / 1000,
          level: 'Pratyantardasha',
          subDashas: sookshmaDashas
        });
      }

      subDashas.push({
        planet: subLord.planet,
        startDate: formatDateStr(subStartDate),
        endDate: formatDateStr(subEndDate),
        durationYears: Math.round(subYears * 100) / 100,
        level: 'Antardasha',
        subDashas: pratyantarDashas
      });
    }

    result.push({
      planet: lord.planet,
      startDate: formatDateStr(startDate),
      endDate: formatDateStr(endDate),
      durationYears: Math.round(durationYears * 10) / 10,
      level: 'Mahadasha',
      subDashas
    });
  }

  return result;
}
