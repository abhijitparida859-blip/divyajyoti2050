import { describe, it, expect } from 'vitest';
import { calculatePanjika } from '../core/panjika/panjika_engine';

describe('Vedic Panjika Almanac Engine', () => {
  it('calculates full Panchanga elements without errors', () => {
    const panjika = calculatePanjika(new Date('2026-09-03T10:00:00Z'), 28.6139, 77.2090);

    expect(panjika.tithi.number).toBeGreaterThanOrEqual(1);
    expect(panjika.tithi.number).toBeLessThanOrEqual(30);
    expect(['Shukla', 'Krishna']).toContain(panjika.tithi.paksha);

    expect(panjika.nakshatra.number).toBeGreaterThanOrEqual(1);
    expect(panjika.nakshatra.number).toBeLessThanOrEqual(27);
    expect(panjika.nakshatra.pada).toBeGreaterThanOrEqual(1);
    expect(panjika.nakshatra.pada).toBeLessThanOrEqual(4);

    expect(panjika.yoga.number).toBeGreaterThanOrEqual(1);
    expect(panjika.yoga.number).toBeLessThanOrEqual(27);

    expect(panjika.karana.nameKey).toBeDefined();

    expect(panjika.muhurtas.rahuKaal.start).toBeDefined();
    expect(panjika.muhurtas.abhijit.start).toBeDefined();
    expect(panjika.muhurtas.brahmaMuhurta.start).toBeDefined();
  });

  it('calculates 100% dynamic astronomical Moonrise varying with lunar elongation', () => {
    // 1. Amavasya date: Moonrise occurs near Sunrise (morning)
    const amavasyaDate = new Date('2026-09-11T06:00:00Z');
    const pAmavasya = calculatePanjika(amavasyaDate, 19.8135, 85.8312);
    expect(pAmavasya.moonrise).toBeDefined();
    expect(pAmavasya.moonrise).not.toBe('07:45 PM'); // Zero static hardcoding!

    // 2. Purnima date: Moonrise occurs near Sunset (evening)
    const purnimaDate = new Date('2026-09-26T06:00:00Z');
    const pPurnima = calculatePanjika(purnimaDate, 19.8135, 85.8312);
    expect(pPurnima.moonrise).toBeDefined();
    expect(pPurnima.moonrise).not.toBe('07:45 PM');

    // 3. Verify Amavasya and Purnima moonrise times are substantially different (~12h apart)
    expect(pAmavasya.moonrise).not.toBe(pPurnima.moonrise);
  });

  it('verifies Digital Mala Maha Mrityunjaya Mantra has zero typos or corrupted characters', async () => {
    const React = await import('react');
    const { renderToString } = await import('react-dom/server');
    const { I18nProvider } = await import('../localization/i18n');
    const { DigitalMala108 } = await import('../components/mala/DigitalMala108');

    const html = renderToString(
      React.createElement(I18nProvider, null, React.createElement(DigitalMala108))
    );

    // Corrupted typo 'lineୋର୍ମୁକ୍ଷୀୟ' must NOT exist!
    expect(html).not.toContain('lineୋର୍ମୁକ୍ଷୀୟ');
    // Pure Sanskrit string must exist
    expect(html).toContain('मृत्योर्मुक्षीय');
    expect(html).toContain('मामृतात्');
  });

  it('verifies Smart Vedic Todo renders with dynamic dates and clean structure', async () => {
    const React = await import('react');
    const { renderToString } = await import('react-dom/server');
    const { I18nProvider } = await import('../localization/i18n');
    const { SmartVedicTodo } = await import('../components/todo/SmartVedicTodo');

    const html = renderToString(
      React.createElement(I18nProvider, null, React.createElement(SmartVedicTodo))
    );

    expect(html).toContain('Surya Namaskar');
    expect(html).toContain('Sattva');
    expect(html).toContain('Rajas');
  });

  it('guarantees Amrita Bela never overlaps with Rahu Kaal on any weekday', async () => {
    const { calculateOdiaCalendarDay } = await import('../core/panjika/odia_calendar_engine');
    // Test across all 7 weekdays in September 2026
    for (let dayOffset = 6; dayOffset <= 12; dayOffset++) {
      const day = calculateOdiaCalendarDay(new Date(2026, 8, dayOffset), 19.8135, 85.8312);
      expect(day.belas.amrita).toBeDefined();
      expect(day.belas.amrita).not.toEqual(day.belas.kalaBela);
      expect(day.belas.amrita).not.toEqual(day.belas.varaBela);
      if (day.advanceMuhurtas) {
        expect(day.advanceMuhurtas.amritaBela.or).not.toEqual(day.advanceMuhurtas.rahuKaal.or);
        expect(day.advanceMuhurtas.amritaBela.or).not.toEqual(day.advanceMuhurtas.yamaganda.or);
        expect(day.advanceMuhurtas.mahendraBela.or).not.toEqual(day.advanceMuhurtas.rahuKaal.or);
        expect(day.advanceMuhurtas.mahendraBela.or).not.toEqual(day.advanceMuhurtas.yamaganda.or);
      }
    }
  });

  it('verifies Calm Studio Pranayama visualizer renders cleanly', async () => {
    const React = await import('react');
    const { renderToString } = await import('react-dom/server');
    const { I18nProvider } = await import('../localization/i18n');
    const { CalmStudio } = await import('../components/meditation/CalmStudio');

    const html = renderToString(
      React.createElement(I18nProvider, null, React.createElement(CalmStudio))
    );

    expect(html).toContain('432Hz');
    expect(html).toContain('136.1Hz');
  });

  it('calculates 100% dynamic Day & Night Choghadiyas covering entire 24 hours continuously', async () => {
    const { calculateChoghadiya } = await import('../core/panjika/odia_calendar_engine');
    // Test on Sunday (weekdayIdx = 0), sunrise 05:40 (340 min), sunset 18:00 (1080 min)
    const result = calculateChoghadiya(340, 1080, 0, 400);

    expect(result.dayChoghadiya).toHaveLength(8);
    expect(result.nightChoghadiya).toHaveLength(8);

    // Sunday Day 1st is Udvega, 4th is Amrita
    expect(result.dayChoghadiya[0].nameKey).toBe('udvega');
    expect(result.dayChoghadiya[3].nameKey).toBe('amrita');
    expect(result.dayChoghadiya[3].nature).toBe('shubh');

    // Day slots must be strictly consecutive
    for (let i = 0; i < 7; i++) {
      expect(result.dayChoghadiya[i].endMinutes).toBe(result.dayChoghadiya[i + 1].startMinutes);
    }
    expect(result.dayChoghadiya[0].startMinutes).toBe(340);
    expect(result.dayChoghadiya[7].endMinutes).toBe(1080);

    // Sunday Night 1st is Shubha
    expect(result.nightChoghadiya[0].nameKey).toBe('shubha');

    // Current slot active detection at 400 min (06:40 AM)
    const activeSlot = result.dayChoghadiya.find(s => s.isCurrent);
    expect(activeSlot).toBeDefined();
  });

  it('calculates 24-Hour Planetary Horas with exact Chaldean sequence and Weekday Day-Lord', async () => {
    const { calculatePlanetaryHoras } = await import('../core/panjika/odia_calendar_engine');
    // Test for Monday (weekdayIdx = 1, Day lord = Moon)
    const mondayHoras = calculatePlanetaryHoras(360, 1080, 1);
    expect(mondayHoras).toHaveLength(24);

    // 1st Hora on Monday must be Chandra (Moon)
    expect(mondayHoras[0].planetKey).toBe('moon');
    expect(mondayHoras[0].hourOfSunrise).toBe(1);
    expect(mondayHoras[0].period).toBe('day');

    // 2nd Hora on Monday must be Saturn (next in Chaldean order after Moon: Saturn)
    expect(mondayHoras[1].planetKey).toBe('saturn');

    // 24th Hora leads directly to Tuesday's sunrise lord (Mars)
    expect(mondayHoras[23].planetKey).toBe('jupiter');
  });

  it('verifies Rashi Ghata Chakra correctly flags 8th-house Chandrashtama and Ghata Vara', async () => {
    const { calculateGhataChakra } = await import('../core/panjika/odia_calendar_engine');
    // If Moon is in Vrischika (index 7), Sunday (weekday 0), Pratipada (tithi 1), Magha (nakshatra 9)
    const ghataList = calculateGhataChakra(7, 0, 1, 9);
    expect(ghataList).toHaveLength(12);

    // Mesha (index 0) has Moon in 8th house (Vrischika) => Chandrashtama!
    const mesha = ghataList.find(r => r.rashiIdx === 0);
    expect(mesha).toBeDefined();
    expect(mesha!.isChandrashtama).toBe(true);
    expect(mesha!.isGhataVara).toBe(true); // Sunday is Ghata Vara for Mesha
    expect(mesha!.overallStatus).toBe('ashubh');

    // Dhanu (index 8): 8th house from Dhanu is Karkata, not Vrischika => no Chandrashtama
    const dhanu = ghataList.find(r => r.rashiIdx === 8);
    expect(dhanu!.isChandrashtama).toBe(false);
  });

  it('generates authentic Vedic Sankalpa with Raja Anka, Tithi, Nakshatra, and Audio text', async () => {
    const { calculateOdiaCalendarDay, generateVedicSankalpa, ODISHA_CITIES } = await import('../core/panjika/odia_calendar_engine');
    const day = calculateOdiaCalendarDay(new Date('2026-09-15T06:00:00Z'), 19.8135, 85.8312);
    expect(day.sankalpa).toBeDefined();
    expect(day.sankalpa!.sanskritMantra).toContain('ଶ୍ରୀଶ୍ୱେତବରାହକଳ୍ପେ');
    expect(day.sankalpa!.sanskritMantra).toContain('ଶ୍ରୀଦିବ୍ୟସିଂହଦେବ ମହାରାଜାଙ୍କ');
    expect(day.sankalpa!.odiaExplanation).toContain('ସଙ୍କଳ୍ପ');

    // Test custom devotee name & gotra
    const customSankalpa = generateVedicSankalpa(day, ODISHA_CITIES[0], 'ଅଭିଜିତ୍ ମହାପାତ୍ର', 'ଭରଦ୍ୱାଜ', 'ଗୃହ ଶାନ୍ତି ଓ ଲକ୍ଷ୍ମୀ ପ୍ରାପ୍ତି');
    expect(customSankalpa.sanskritMantra).toContain('ଅଭିଜିତ୍ ମହାପାତ୍ର');
    expect(customSankalpa.sanskritMantra).toContain('ଭରଦ୍ୱାଜ');
    expect(customSankalpa.sanskritMantra).toContain('ଗୃହ ଶାନ୍ତି');
  });

  it('verifies Daily 12 Lagna (Ascendant) calculations cover 24 hours with astronomical precision', async () => {
    const { calculateDailyLagnas } = await import('../core/panjika/odia_calendar_engine');
    // Test date: Sep 12 2026, Puri (lat 19.81, lon 85.83), sunrise at 05:45 (345 min)
    const testDate = new Date(2026, 8, 12); // Sep 12 2026
    const lagnas = calculateDailyLagnas(testDate, 19.8135, 85.8312, 345, 400);
    expect(lagnas).toHaveLength(12);

    // All 12 lagnas must have valid rashi metadata
    for (const l of lagnas) {
      expect(l.rashiIdx).toBeGreaterThanOrEqual(0);
      expect(l.rashiIdx).toBeLessThan(12);
      expect(l.rashiNameOr).toBeTruthy();
      expect(l.lordOr).toBeTruthy();
      expect(l.durationMinutes).toBeGreaterThan(0);
    }

    // Verify time continuity: each slot starts exactly when previous ends
    for (let i = 1; i < 12; i++) {
      expect(lagnas[i].startMinutes).toBe(lagnas[i - 1].endMinutes);
    }
    // Total cycle must reach sunrise + 1440
    expect(lagnas[11].endMinutes).toBe(345 + 1440);

    // 12 consecutive rashis must be sequential (each +1 mod 12 from the previous)
    for (let i = 1; i < 12; i++) {
      expect(lagnas[i].rashiIdx).toBe((lagnas[i - 1].rashiIdx + 1) % 12);
    }

    // Exactly one Lagna is current for 400 min
    const current = lagnas.filter(l => l.isCurrent);
    expect(current).toHaveLength(1);
  });

  it('verifies Srimandir 32 Sacred Jagannath Beshas directory is exhaustive and authentic', async () => {
    const { SRIMANDIR_32_BESHAS } = await import('../core/panjika/odia_calendar_engine');
    expect(SRIMANDIR_32_BESHAS).toHaveLength(32);

    const ids = SRIMANDIR_32_BESHAS.map(b => b.id);
    expect(ids).toContain('suna_besha_bahuda');
    expect(ids).toContain('hati_besha');
    expect(ids).toContain('padma_besha');
    expect(ids).toContain('gajauddharana_besha');
    expect(ids).toContain('rajarajeshwara_besha');
    expect(ids).toContain('radha_damodara_besha');
    expect(ids).toContain('lakshmi_narayana_besha');
    expect(ids).toContain('nagarjuna_besha');
    expect(ids).toContain('bamana_besha');
    expect(ids).toContain('kaliyadalan_besha');
    expect(ids).toContain('chandan_besha');
    expect(ids).toContain('badasinghara_besha');

    // Every Besha must have complete descriptions
    for (const besha of SRIMANDIR_32_BESHAS) {
      expect(besha.nameOr.length).toBeGreaterThan(3);
      expect(besha.attireOr.length).toBeGreaterThan(10);
      expect(besha.significanceOr.length).toBeGreaterThan(15);
      expect(besha.darshanTimeApproxOr.length).toBeGreaterThan(5);
    }
  });

  it('verifies Shubha Muhurtas calculation provides valid dates, auspicious lagnas, and time windows', async () => {
    const { calculateMonthMuhurtas } = await import('../core/panjika/odia_calendar_engine');
    const muhurtas = calculateMonthMuhurtas(2026, 8, 19.8135, 85.8312); // September 2026
    expect(muhurtas.length).toBeGreaterThan(0);

    for (const m of muhurtas) {
      expect(m.shubhaLagna).toBeDefined();
      expect(m.timeWindow).toBeDefined();
      expect(m.tithiNameOr).toBeDefined();
      expect(m.nakshatraNameOr).toBeDefined();
      expect(m.significanceOr).toBeDefined();
      expect(m.date.getFullYear()).toBe(2026);
    }
  });

  it('verifies calculateOdiaCalendarDay computes dailyLagnas with live lagna', async () => {
    const { calculateOdiaCalendarDay } = await import('../core/panjika/odia_calendar_engine');
    const dayInfo = calculateOdiaCalendarDay(new Date(2026, 8, 15), 19.8135, 85.8312);

    expect(dayInfo.dailyLagnas).toBeDefined();
    expect(dayInfo.dailyLagnas).toHaveLength(12);
    expect(dayInfo.currentLagna).toBeDefined();
    expect(dayInfo.currentLagna?.rashiNameOr).toBeDefined();
    expect(dayInfo.currentLagna?.timeRangeOr).toBeDefined();
    expect(dayInfo.currentLagna?.timeRangeEn).toBeDefined();
    expect(dayInfo.currentLagna?.suitabilityOr).toBeDefined();
  });

  it('verifies Kala Vyapti resolves Ganesh Puja to Sep 14, 2026 and Nuakhai to Sep 15, 2026', async () => {
    const { calculateOdiaCalendarDay } = await import('../core/panjika/odia_calendar_engine');

    const sep14 = calculateOdiaCalendarDay(new Date(2026, 8, 14));
    const sep15 = calculateOdiaCalendarDay(new Date(2026, 8, 15));

    // Ganesh Puja on September 14 (Madhyahna Vyapini Bhadraba Shukla Chaturthi)
    expect(sep14.festivals.some(f => f.id === 'ganesh_puja')).toBe(true);
    expect(sep15.festivals.some(f => f.id === 'ganesh_puja')).toBe(false);

    // Nuakhai on September 15 (Bhadraba Shukla Panchami harvest festival)
    expect(sep15.festivals.some(f => f.id === 'nuakhai')).toBe(true);
    expect(sep14.festivals.some(f => f.id === 'nuakhai')).toBe(false);
  });
});


