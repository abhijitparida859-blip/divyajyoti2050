import { describe, it, expect } from 'vitest';
import { calculateOdiaCalendarDay, calculateDailyLagnas } from '../core/panjika/odia_calendar_engine';
import { calculatePlanetaryPositions } from '../core/astronomy/ephemeris';

describe('Multi-Year Panjika & Shastric Engine Dynamic Audit (1950 - 2050)', () => {
  const testYears = [1950, 1975, 1980, 2000, 2015, 2024, 2025, 2026, 2027, 2035, 2050];

  it('validates mathematical ephemeris dynamically computes coordinates across all test years', () => {
    testYears.forEach(year => {
      const testDate = new Date(year, 5, 15, 6, 0, 0); // June 15 of each year
      const positions = calculatePlanetaryPositions(testDate);

      // Verify all celestial bodies have valid non-NaN positions within [0, 360)
      expect(positions.sun).toBeGreaterThanOrEqual(0);
      expect(positions.sun).toBeLessThan(360);
      expect(isNaN(positions.sun)).toBe(false);

      expect(positions.moon).toBeGreaterThanOrEqual(0);
      expect(positions.moon).toBeLessThan(360);
      expect(isNaN(positions.moon)).toBe(false);

      expect(positions.mars).toBeGreaterThanOrEqual(0);
      expect(positions.mars).toBeLessThan(360);

      expect(positions.mercury).toBeGreaterThanOrEqual(0);
      expect(positions.mercury).toBeLessThan(360);

      expect(positions.jupiter).toBeGreaterThanOrEqual(0);
      expect(positions.jupiter).toBeLessThan(360);

      expect(positions.venus).toBeGreaterThanOrEqual(0);
      expect(positions.venus).toBeLessThan(360);

      expect(positions.saturn).toBeGreaterThanOrEqual(0);
      expect(positions.saturn).toBeLessThan(360);

      expect(positions.rahu).toBeGreaterThanOrEqual(0);
      expect(positions.rahu).toBeLessThan(360);

      // Ketu is strictly 180 degrees opposite Rahu
      const expectedKetu = (positions.rahu + 180) % 360;
      expect(Math.abs(positions.ketu - expectedKetu)).toBeLessThan(0.001);

      // Ayanamsha must be dynamic and realistic (approx 23° to 24.5° between 1950 and 2050)
      expect(positions.ayanamsa).toBeGreaterThan(23.0);
      expect(positions.ayanamsa).toBeLessThan(25.0);
    });
  });

  it('validates complete Panjika elements for sampled dates across 1950-2050 with 0 nulls or NaNs', () => {
    testYears.forEach(year => {
      // Test January 1st and August 15th of each year
      [new Date(year, 0, 1), new Date(year, 7, 15)].forEach(date => {
        const dayInfo = calculateOdiaCalendarDay(date);

        // Core calendar attributes
        expect(dayInfo).toBeDefined();
        expect(dayInfo.gregorianYear).toBe(year);

        // Tithi (1 to 30)
        expect(dayInfo.panjika.tithi.number).toBeGreaterThanOrEqual(1);
        expect(dayInfo.panjika.tithi.number).toBeLessThanOrEqual(30);
        expect(['Shukla', 'Krishna']).toContain(dayInfo.panjika.tithi.paksha);
        expect(dayInfo.dominantTithiNameOr).toBeTruthy();

        // Nakshatra (1 to 27)
        expect(dayInfo.panjika.nakshatra.number).toBeGreaterThanOrEqual(1);
        expect(dayInfo.panjika.nakshatra.number).toBeLessThanOrEqual(27);
        expect(dayInfo.panjika.nakshatra.nameKey).toBeTruthy();
        expect(dayInfo.nakshatraTiming.durationStrOr).toBeTruthy();

        // Yoga (1 to 27)
        expect(dayInfo.panjika.yoga.number).toBeGreaterThanOrEqual(1);
        expect(dayInfo.panjika.yoga.number).toBeLessThanOrEqual(27);

        // Karana (60 karanas in lunar month)
        expect(dayInfo.panjika.karana.number).toBeGreaterThanOrEqual(1);
        expect(dayInfo.panjika.karana.number).toBeLessThanOrEqual(60);
        expect(dayInfo.panjika.karana.nameKey).toBeTruthy();

        // Solar month & day
        expect(dayInfo.odiaSolarMonth).toBeDefined();
        expect(dayInfo.odiaSolarMonth.rashiOr).toBeTruthy();
        expect(dayInfo.odiaSolarDay).toBeGreaterThanOrEqual(1);
        expect(dayInfo.odiaSolarDay).toBeLessThanOrEqual(32);

        // Dinamana and Ratrimana check (~60 danda/ghatikas total for 24 hours, exactly 1440 minutes)
        expect(dayInfo.dinamana).toBeDefined();
        expect(dayInfo.ratrimana).toBeDefined();
        if (dayInfo.dinamana && dayInfo.ratrimana) {
          expect(dayInfo.dinamana.danda).toBeGreaterThan(20);
          expect(dayInfo.dinamana.danda).toBeLessThan(40);
          expect(dayInfo.ratrimana.danda).toBeGreaterThan(20);
          expect(dayInfo.ratrimana.danda).toBeLessThan(40);
          expect(dayInfo.dinamana.totalMinutes + dayInfo.ratrimana.totalMinutes).toBe(1440);
        }

        // Advance Muhurtas & Auspicious intervals
        expect(dayInfo.advanceMuhurtas).toBeDefined();
        if (dayInfo.advanceMuhurtas) {
          expect(dayInfo.advanceMuhurtas.rahuKaal.or).toBeTruthy();
          expect(dayInfo.advanceMuhurtas.amritaBela.or).toBeTruthy();
          expect(dayInfo.advanceMuhurtas.gulikaKaal.or).toBeTruthy();
          expect(dayInfo.advanceMuhurtas.yamaganda.or).toBeTruthy();
        }

        // Shastric Food Restrictions
        expect(dayInfo.foodRestrictionOr).toBeTruthy();

        // Directional Travel Prohibition (Digashula)
        expect(dayInfo.digashula).toBeDefined();
        expect(dayInfo.digashula.directionOr).toBeTruthy();
        expect(dayInfo.digashula.remedyOr).toBeTruthy();

        // Tarabala & Chandrabala
        expect(dayInfo.tarabalaSummaryOr).toBeTruthy();
        expect(dayInfo.chandrabalaSummaryOr).toBeTruthy();
      });
    });
  });

  it('validates canonical solar festivals occur at correct solar transit windows across decades', () => {
    testYears.forEach(year => {
      // 1. Pana Sankranti (Mesha Sankranti / Odia New Year) - strictly April 12 to 16
      let panaSankrantiFound = false;
      for (let day = 12; day <= 16; day++) {
        const d = new Date(year, 3, day); // Month 3 is April
        const dayInfo = calculateOdiaCalendarDay(d);
        if (dayInfo.festivals.some(f => f.id === 'pana_sankranti' || f.id === 'sankranti_baisakha')) {
          panaSankrantiFound = true;
          break;
        }
      }
      expect(panaSankrantiFound, 'Pana Sankranti must be found in April for ' + year).toBe(true);

      // 2. Raja Parba / Mithuna Sankranti - strictly June 13 to 18
      let rajaFound = false;
      for (let day = 13; day <= 18; day++) {
        const d = new Date(year, 5, day); // Month 5 is June
        const dayInfo = calculateOdiaCalendarDay(d);
        if (dayInfo.festivals.some(f => f.id === 'pahili_raja' || f.id === 'raja_sankranti')) {
          rajaFound = true;
          break;
        }
      }
      expect(rajaFound, 'Raja festival must be found in mid-June for ' + year).toBe(true);

      // 3. Makara Sankranti - strictly January 12 to 17
      let makaraFound = false;
      for (let day = 12; day <= 17; day++) {
        const d = new Date(year, 0, day); // Month 0 is January
        const dayInfo = calculateOdiaCalendarDay(d);
        if (dayInfo.festivals.some(f => f.id === 'makara_sankranti' || f.id === 'sankranti_makara')) {
          makaraFound = true;
          break;
        }
      }
      expect(makaraFound, 'Makara Sankranti must be found in mid-January for ' + year).toBe(true);
    });
  });

  it('validates canonical lunar festival Ratha Yatra occurs dynamically in June/July across multiple years', () => {
    // Ratha Yatra occurs on Asadha Shukla Dwitiya (June-July)
    testYears.forEach(year => {
      let rathaYatraFound = false;
      // Scan June 15 to July 25
      for (let month = 5; month <= 6; month++) {
        const maxDays = month === 5 ? 30 : 25;
        const startDay = month === 5 ? 15 : 1;
        for (let day = startDay; day <= maxDays; day++) {
          const d = new Date(year, month, day);
          const dayInfo = calculateOdiaCalendarDay(d);
          if (dayInfo.festivals.some(f => f.id === 'ratha_yatra')) {
            rathaYatraFound = true;
            // Ratha Yatra = Asadha Shukla Dwitiya (tithi 2). In a kshaya-Dwitiya
            // year (no sunrise falls within Dwitiya, e.g. 1975) no sunrise day
            // has tithi 2; the festival is observed on the first Shukla sunrise
            // after the gap (tithi 3). Always Shukla paksha, June/July.
            const rathaTithi = dayInfo.panjika.tithi.number;
            expect([2, 3]).toContain(rathaTithi);
            expect(dayInfo.isShukla).toBe(true);
            break;
          }
        }
        if (rathaYatraFound) break;
      }
      expect(rathaYatraFound, 'Ratha Yatra must be found dynamically in June/July for ' + year).toBe(true);
    });
  });

  it('validates 12 daily Lagnas have unequal, astronomically calculated Rasimanas for Puri/Odisha', () => {
    testYears.forEach(year => {
      const d = new Date(year, 2, 21); // Vernal equinox
      const lagnas = calculateDailyLagnas(d, 20.2961, 85.8245);

      expect(lagnas).toHaveLength(12);

      // Verify all 12 lagnas are ordered and non-null
      lagnas.forEach((lagna) => {
        expect(lagna.rashiNameOr).toBeTruthy();
        expect(lagna.rashiNameEn).toBeTruthy();
        expect(lagna.rashiIdx).toBeGreaterThanOrEqual(0);
        expect(lagna.rashiIdx).toBeLessThanOrEqual(11);
        expect(lagna.startMinutes).toBeGreaterThanOrEqual(0);
        expect(lagna.endMinutes).toBeGreaterThanOrEqual(0);
        expect(lagna.durationMinutes).toBeGreaterThan(60);
        expect(lagna.durationMinutes).toBeLessThan(180);
      });

      // Assert durations are NOT artificially equal (not 120 mins each)
      const durations = lagnas.map(l => l.durationMinutes);
      const uniqueDurations = new Set(durations);
      expect(uniqueDurations.size).toBeGreaterThan(3);
    });
  });
});
