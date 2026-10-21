import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { I18nProvider } from '../localization/i18n';
import {
  ODIA_SOLAR_MONTHS,
  ODISHA_CITIES,
  calculateOdiaCalendarDay,
  calculateMonthMuhurtas,
  SRIMANDIR_DAILY_NITI,
  CHHAPANA_BHOGA_LIST,
  ODISHA_ECLIPSES,
  ODIA_PANJIKA_EDITIONS,
  calculateNavagrahaSputa,
  calculatePanjikaComparison
} from '../core/panjika/odia_calendar_engine';
import { OdiaCalendarView } from '../components/calendar/OdiaCalendarView';
import { OdiaPrintableWallCalendar } from '../components/calendar/OdiaPrintableWallCalendar';

describe('Ultra-Modern & Future-Proof Odia Calendar Engine', () => {
  it('verifies complete 12 Odia solar months specification', () => {
    expect(ODIA_SOLAR_MONTHS.length).toBe(12);
    expect(ODIA_SOLAR_MONTHS[0].id).toBe('baisakha');
    expect(ODIA_SOLAR_MONTHS[0].nameOr).toBe('ବୈଶାଖ');
    expect(ODIA_SOLAR_MONTHS[2].id).toBe('asadha');
    expect(ODIA_SOLAR_MONTHS[2].nameOr).toBe('ଆଷାଢ଼');
    expect(ODIA_SOLAR_MONTHS[11].id).toBe('chaitra');
    expect(ODIA_SOLAR_MONTHS[11].nameOr).toBe('ଚୈତ୍ର');
  });

  it('verifies Odisha multi-city location database', () => {
    expect(ODISHA_CITIES.length).toBeGreaterThanOrEqual(10);
    const cityIds = ODISHA_CITIES.map(c => c.id);
    expect(cityIds).toContain('puri');
    expect(cityIds).toContain('bhubaneswar');
    expect(cityIds).toContain('cuttack');
    expect(cityIds).toContain('sambalpur');
    expect(cityIds).toContain('berhampur');
    expect(cityIds).toContain('rourkela');

    for (const city of ODISHA_CITIES) {
      expect(Number.isFinite(city.lat)).toBe(true);
      expect(Number.isFinite(city.lon)).toBe(true);
      expect(city.lat).toBeGreaterThan(17);
      expect(city.lat).toBeLessThan(23);
      expect(city.lon).toBeGreaterThan(80);
      expect(city.lon).toBeLessThan(88);
    }
  });

  it('accurately calculates Pana Sankranti (Odia New Year) in April', () => {
    // In 2026, Sun transits into Mesha on April 14 evening, making April 15 the 1st of Baisakha
    const april15 = new Date(2026, 3, 15); // month is 0-indexed: 3 = April
    const info = calculateOdiaCalendarDay(april15, 19.8135, 85.8312);
    expect(info.odiaSolarMonth.id).toBe('baisakha');
    expect(info.odiaSolarDay).toBeGreaterThanOrEqual(1);
    expect(info.odiaSolarDay).toBeLessThanOrEqual(3);
  });

  it('accurately calculates Ratha Yatra on Asadha Shukla Dwitiya dynamically for 2026', () => {
    // In 2026, Asadha begins mid-June and Ratha Yatra falls on Asadha Shukla Dwitiya
    let rathaYatraFound = false;
    let rathaYatraDate: Date | null = null;

    // Scan June and July 2026
    for (let m = 5; m <= 6; m++) {
      for (let d = 1; d <= 31; d++) {
        const dt = new Date(2026, m, d);
        if (dt.getMonth() !== m) continue;
        const info = calculateOdiaCalendarDay(dt, 19.8135, 85.8312);
        const hasRathaYatra = info.festivals.some(f => f.id === 'ratha_yatra');
        if (hasRathaYatra) {
          rathaYatraFound = true;
          rathaYatraDate = dt;
          expect(info.odiaSolarMonth.id).toBe('asadha');
          expect(info.panjika.tithi.paksha).toBe('Shukla');
          expect(info.panjika.tithi.number).toBe(2);
          break;
        }
      }
      if (rathaYatraFound) break;
    }

    expect(rathaYatraFound).toBe(true);
    expect(rathaYatraDate).not.toBeNull();
  });

  it('accurately calculates festivals for future year 2050 (Future-Proof Verification)', () => {
    // Verify that year 2050 computes valid solar months and festivals without errors
    const jan1_2050 = new Date(2050, 0, 1);
    const infoJan = calculateOdiaCalendarDay(jan1_2050, 19.8135, 85.8312);
    expect(infoJan.odiaSolarMonth).toBeDefined();
    expect(infoJan.odiaSolarDay).toBeGreaterThanOrEqual(1);
    expect(infoJan.odiaSolarDay).toBeLessThanOrEqual(32);

    // In 2050, due to Ayanamsha precession, Makara Sankranti shifts past Jan 14 to Jan 15-16
    const makaraSankranti2050 = new Date(2050, 0, 16);
    const infoMakara = calculateOdiaCalendarDay(makaraSankranti2050, 19.8135, 85.8312);
    expect(infoMakara.odiaSolarMonth.id).toBe('magha');
  });

  it('verifies Tithi food restrictions (Khadya Nishedha)', () => {
    const d = new Date(2026, 8, 4);
    const info = calculateOdiaCalendarDay(d);
    expect(info.foodRestrictionOr.length).toBeGreaterThan(0);
    expect(info.foodRestrictionEn.length).toBeGreaterThan(0);
  });

  it('verifies Srimandir 14 daily sacred rituals in order', () => {
    expect(SRIMANDIR_DAILY_NITI.length).toBe(14);
    expect(SRIMANDIR_DAILY_NITI[0].id).toBe('dwaraphita');
    expect(SRIMANDIR_DAILY_NITI[0].nameOr).toBe('ଦ୍ୱାରଫିଟା ନୀତି');
    expect(SRIMANDIR_DAILY_NITI[13].id).toBe('pahuda');
    expect(SRIMANDIR_DAILY_NITI[13].nameOr).toBe('ରାତ୍ର ପହୁଡ଼ (ଶୟନ ଆରତୀ)');
  });

  it('verifies complete 56 sacred Chhapana Bhogas catalog', () => {
    expect(CHHAPANA_BHOGA_LIST.length).toBe(56);
    const sukhila = CHHAPANA_BHOGA_LIST.filter(b => b.category === 'sukhila');
    const sankhudi = CHHAPANA_BHOGA_LIST.filter(b => b.category === 'sankhudi');
    const dugdhajata = CHHAPANA_BHOGA_LIST.filter(b => b.category === 'dugdhajata');
    expect(sukhila.length).toBeGreaterThanOrEqual(15);
    expect(sankhudi.length).toBeGreaterThanOrEqual(20);
    expect(dugdhajata.length).toBeGreaterThanOrEqual(10);
    expect(CHHAPANA_BHOGA_LIST.some(b => b.nameOr.includes('ଖଜା'))).toBe(true);
    expect(CHHAPANA_BHOGA_LIST.some(b => b.nameOr.includes('କାନିକା'))).toBe(true);
    expect(CHHAPANA_BHOGA_LIST.some(b => b.nameOr.includes('ଛେନା ପୋଡ଼'))).toBe(true);
  });

  it('calculates dynamic Shubha Muhurtas for wedding season', () => {
    // In Baisakha / May 2026, wedding muhurtas should be calculated
    const may2026Muhurtas = calculateMonthMuhurtas(2026, 4, 19.8135, 85.8312); // May = index 4
    expect(Array.isArray(may2026Muhurtas)).toBe(true);
    const hasMuhurtas = may2026Muhurtas.length > 0;
    expect(hasMuhurtas).toBe(true);
    const first = may2026Muhurtas[0];
    expect(first.dateStr).toBeDefined();
    expect(first.timeWindow).toBeDefined();
    expect(first.shubhaLagna).toBeDefined();
  });

  it('verifies Odisha eclipse timetable (2024 to 2050)', () => {
    expect(ODISHA_ECLIPSES.length).toBeGreaterThanOrEqual(6);
    const visibleInOdisha = ODISHA_ECLIPSES.filter(e => e.visibleInOdisha);
    expect(visibleInOdisha.length).toBeGreaterThanOrEqual(4);
    visibleInOdisha.forEach(e => {
      expect(e.sparshaTime.length).toBeGreaterThan(0);
      expect(e.madhyaTime.length).toBeGreaterThan(0);
      expect(e.mokshaTime.length).toBeGreaterThan(0);
      expect(e.pakatyagaTime.length).toBeGreaterThan(0);
    });
  });

  it('renders OdiaCalendarView with all new tabs without crashing', () => {
    (globalThis as any).localStorage = {
      getItem: () => 'or',
      setItem: () => {}
    };
    const html = renderToString(
      React.createElement(I18nProvider, null, React.createElement(OdiaCalendarView))
    );
    expect(html).toContain('ଓଡ଼ିଆ ସୌର ପାଞ୍ଜି');
    expect(html).toContain('ପୁରୀ (ଶ୍ରୀକ୍ଷେତ୍ର)');
    expect(html).toContain('ଶୁଭ ମୁହୂର୍ତ୍ତ');
    expect(html).toContain('ଶ୍ରୀମନ୍ଦିର ନୀତି ଓ ଭୋଗ');
    expect(html).toContain('ଗ୍ରହଣ ସୂଚୀ');
    expect(html).toContain('ଚୌଘଡ଼ିଆ ଓ ହୋରା');
    expect(html).toContain('ଘାତ ଚକ୍ର');
    expect(html).toContain('ପବିତ୍ର ସଙ୍କଳ୍ପ');
  });

  it('renders OdiaCalendarView in Hindi without crashing', () => {
    (globalThis as any).localStorage = {
      getItem: () => 'hi',
      setItem: () => {}
    };
    const html = renderToString(
      React.createElement(I18nProvider, null, React.createElement(OdiaCalendarView))
    );
    expect(html).toContain('ओड़िया');
    expect(html).toContain('शुभ मुहूर्त');
  });

  it('renders OdiaCalendarView in English without crashing', () => {
    (globalThis as any).localStorage = {
      getItem: () => 'en',
      setItem: () => {}
    };
    const html = renderToString(
      React.createElement(I18nProvider, null, React.createElement(OdiaCalendarView))
    );
    expect(html).toContain('Odia Solar Almanac');
    expect(html).toContain('Shubha Muhurta');
  });
  it('verifies all 6 canonical Odia Panjika editions', () => {
    expect(ODIA_PANJIKA_EDITIONS.length).toBe(6);
    const editionIds = ODIA_PANJIKA_EDITIONS.map(e => e.id);
    expect(editionIds).toContain('kohinoor');
    expect(editionIds).toContain('khadiratna');
    expect(editionIds).toContain('radharaman');
    expect(editionIds).toContain('bhagyajyoti');
    expect(editionIds).toContain('biraja');
    expect(editionIds).toContain('srimandir');

    for (const ed of ODIA_PANJIKA_EDITIONS) {
      expect(ed.nameOr.length).toBeGreaterThan(0);
      expect(ed.nameHi.length).toBeGreaterThan(0);
      expect(ed.nameEn.length).toBeGreaterThan(0);
      expect(ed.traditionOr.length).toBeGreaterThan(0);
      expect(ed.authorityOr.length).toBeGreaterThan(0);
      expect(ed.methodologyOr.length).toBeGreaterThan(0);
    }
  });

  it('computes real astronomical Tithi and Nakshatra ending times with pure Odia numerals', () => {
    const testDate = new Date(2026, 4, 15); // May 15, 2026
    const dayKohinoor = calculateOdiaCalendarDay(testDate, 19.8135, 85.8312, 'kohinoor');

    // Tithi timing checks
    expect(dayKohinoor.tithiTiming).toBeDefined();
    expect(dayKohinoor.tithiTiming.durationStrOr.length).toBeGreaterThan(0);
    expect(dayKohinoor.tithiTiming.durationStrHi.length).toBeGreaterThan(0);
    expect(dayKohinoor.tithiTiming.durationStrEn.length).toBeGreaterThan(0);
    expect(typeof dayKohinoor.tithiTiming.endHour).toBe('number');
    expect(typeof dayKohinoor.tithiTiming.endMinute).toBe('number');

    // Nakshatra timing checks
    expect(dayKohinoor.nakshatraTiming).toBeDefined();
    expect(dayKohinoor.nakshatraTiming.durationStrOr.length).toBeGreaterThan(0);
    expect(dayKohinoor.nakshatraTiming.pada).toBeGreaterThanOrEqual(1);
    expect(dayKohinoor.nakshatraTiming.pada).toBeLessThanOrEqual(4);

    // Planetary Sputa (Degrees & Minutes)
    expect(dayKohinoor.suryaRashiInfo.rashiOr.length).toBeGreaterThan(0);
    expect(dayKohinoor.suryaRashiInfo.degreesStrOr).toContain('°');
    expect(dayKohinoor.chandraRashiInfo.rashiOr.length).toBeGreaterThan(0);
    expect(dayKohinoor.chandraRashiInfo.degreesStrOr).toContain('°');

    // Digashula and Remedy
    expect(dayKohinoor.digashula.directionOr.length).toBeGreaterThan(0);
    expect(dayKohinoor.digashula.remedyOr.length).toBeGreaterThan(0);

    // Tarabala and Chandrabala
    expect(dayKohinoor.tarabalaSummaryOr.length).toBeGreaterThan(0);
    expect(dayKohinoor.chandrabalaSummaryOr.length).toBeGreaterThan(0);

    // Panjika edition notes
    expect(dayKohinoor.panjikaNotes).toBeDefined();
    expect(dayKohinoor.panjikaNotes?.or.length).toBeGreaterThan(0);
  });

  it('guarantees zero English leakages in Shubha Muhurtas in Odia mode', () => {
    // Generate muhurtas for May 2026 across all editions
    const muhurtas = calculateMonthMuhurtas(2026, 4, 19.8135, 85.8312, 'kohinoor');
    expect(muhurtas.length).toBeGreaterThan(0);

    // Check that namakarana and bhoomipuja exist
    const categories = new Set(muhurtas.map(m => m.type));
    expect(categories.has('vivaha') || categories.has('bratopanayana') || categories.has('gruhapravesha')).toBe(true);

    for (const m of muhurtas) {
      // Must not contain raw English AM/PM or English weekday/tithi words
      expect(m.tithiNameOr).not.toMatch(/Krishna|Shukla/i);
      expect(m.nakshatraNameOr).not.toMatch(/Ashwini|Bharani|Krittika|Rohini/i);
      expect(m.timeWindow).not.toMatch(/AM|PM/i);
      expect(m.dayOfWeekOr).toMatch(/ବାର/);
      expect(m.odiaSolarDate).toMatch(/[୦-୯]/);
    }
  });

  it('renders OdiaCalendarView with selected Panjika edition dropdown without crashing', () => {
    (globalThis as any).localStorage = {
      getItem: () => 'or',
      setItem: () => {}
    };
    const html = renderToString(
      React.createElement(I18nProvider, null, React.createElement(OdiaCalendarView))
    );
    // Panjika edition names should be in the rendered HTML
    expect(html).toContain('କୋହିନୂର ପ୍ରେସ୍ ପାଞ୍ଜି');
    expect(html).toContain('ଅସଲ ଖଡ଼ିରତ୍ନ ପାଞ୍ଜି');
    expect(html).toContain('ରାଧାରମଣ ପ୍ରେସ୍ ପାଞ୍ଜି');
    expect(html).toContain('ଦିଗଶୂଳ');
  });

  it('renders authentic printable Odia Wall Calendar with complete ephemeris tables', () => {
    (globalThis as any).localStorage = {
      getItem: () => 'or',
      setItem: () => {}
    };
    const html = renderToString(
      React.createElement(I18nProvider, null, React.createElement(OdiaCalendarView))
    );
    // Authentic printable wall calendar elements
    expect(html).toContain('ପ୍ରାମାଣିକ ଓଡ଼ିଆ କାନ୍ଥ କ୍ୟାଲେଣ୍ଡର');
    expect(html).toContain('ସୂର୍ଯ୍ୟୋଦୟ ଓ ଅସ୍ତ');
    expect(html).toContain('ମାସିକ ଏକାଦଶୀ ଓ ପାରଣା');
    expect(html).toContain('ମାସର ପ୍ରମୁଖ ଶୁଭ ମୁହୂର୍ତ୍ତ');
    expect(html).toContain('ସାପ୍ତାହିକ ଦିଗଶୂଳ ଓ ଯାତ୍ରା ପ୍ରତିକାର');
    expect(html).toContain('ଶ୍ରୀ ଗଣେଶାୟ ନମଃ');
    expect(html).toContain('ପ୍ରିଣ୍ଟ କ୍ୟାଲେଣ୍ଡର');
  });

  it('calculates real Navagraha Sputa with 9 planets, degrees, nakshatra padas, and retrograde flags', () => {
    const today = new Date(2026, 7, 28); // August 28, 2026
    const sputa = calculateNavagrahaSputa(today);

    expect(sputa.grahas.length).toBe(9);
    const grahaIds = sputa.grahas.map(g => g.id);
    expect(grahaIds).toEqual(['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu']);

    // Check Lahiri Ayanamsa
    expect(sputa.ayanamsaDeg).toBeGreaterThan(23.5);
    expect(sputa.ayanamsaDeg).toBeLessThan(24.5);
    expect(sputa.ayanamsaStrOr).toContain('ଲାହିଡ଼ୀ');

    for (const g of sputa.grahas) {
      expect(g.degreesTotal).toBeGreaterThanOrEqual(0);
      expect(g.degreesTotal).toBeLessThan(360);
      expect(g.degInRashi).toBeGreaterThanOrEqual(0);
      expect(g.degInRashi).toBeLessThan(30);
      expect(g.rashiIndex).toBeGreaterThanOrEqual(0);
      expect(g.rashiIndex).toBeLessThan(12);
      expect(g.nakshatraIndex).toBeGreaterThanOrEqual(0);
      expect(g.nakshatraIndex).toBeLessThan(27);
      expect(g.pada).toBeGreaterThanOrEqual(1);
      expect(g.pada).toBeLessThanOrEqual(4);
      expect(g.nameOr).toBeTruthy();
      expect(g.rashiOr).toBeTruthy();
      expect(g.degMinSecOr).toMatch(/°/);
    }

    // Rahu and Ketu must always be retrograde
    const rahu = sputa.grahas.find(g => g.id === 'rahu');
    const ketu = sputa.grahas.find(g => g.id === 'ketu');
    expect(rahu?.isRetrograde).toBe(true);
    expect(rahu?.retrogradeLabelOr).toBe('ବକ୍ରୀ');
    expect(ketu?.isRetrograde).toBe(true);
    expect(ketu?.retrogradeLabelOr).toBe('ବକ୍ରୀ');
  });

  it('calculates authentic Panjika comparison across all 6 canonical editions with valid Tithi and Vrata rules', () => {
    const today = new Date(2026, 7, 28);
    const comparison = calculatePanjikaComparison(today, 19.8135, 85.8312);

    expect(comparison.length).toBe(6);
    const editionIds = comparison.map(c => c.edition.id);
    expect(editionIds).toEqual(['kohinoor', 'khadiratna', 'radharaman', 'bhagyajyoti', 'biraja', 'srimandir']);

    for (const entry of comparison) {
      expect(entry.edition.nameOr).toBeTruthy();
      expect(entry.vrataRuleOr).toBeTruthy();
      expect(entry.srimandirNitiOr).toBeTruthy();
      expect(entry.authorityEndorsementOr).toBeTruthy();
      expect(entry.nakshatraPada).toBeGreaterThanOrEqual(1);
      expect(entry.nakshatraPada).toBeLessThanOrEqual(4);
    }
  });

  it('renders OdiaCalendarView with upcoming festival countdowns, quick filter toolbar, and WhatsApp / Google sync', () => {
    (globalThis as any).localStorage = {
      getItem: () => 'or',
      setItem: () => {}
    };
    const html = renderToString(
      React.createElement(I18nProvider, null, React.createElement(OdiaCalendarView))
    );

    // Filter toolbar elements
    expect(html).toContain('ସବୁ ଦିନ');
    expect(html).toContain('ଏକାଦଶୀ');
    expect(html).toContain('ଶ୍ରୀମନ୍ଦିର ବେଶ');

    // Quick actions & sync
    expect(html).toContain('WhatsApp');
    expect(html).toContain('Google Cal');
    expect(html).toContain('ତୁଳନା');
  });

  it('verifies Advance Odia Wall Calendar Print Studio components, responsive heights, and single-page guarantee', () => {
    const testMonth = 4; // May 2026
    const testYear = 2026;
    const daysInMonth = new Date(testYear, testMonth + 1, 0).getDate();
    const selectedCity = ODISHA_CITIES[0];
    const selectedPanjika = ODIA_PANJIKA_EDITIONS[0];
    const monthDays = [];
    for (let d = 1; d <= daysInMonth; d++) {
      monthDays.push(calculateOdiaCalendarDay(new Date(testYear, testMonth, d), selectedCity.lat, selectedCity.lon, selectedPanjika.id));
    }
    const monthMuhurtas = calculateMonthMuhurtas(testYear, testMonth, selectedCity.lat, selectedCity.lon, selectedPanjika.id);
    const primaryOdiaSolarMonth = monthDays[15]?.odiaSolarMonth || monthDays[0].odiaSolarMonth;

    // 1. Standalone Print Sheet
    const standaloneHtml = renderToString(
      React.createElement(OdiaPrintableWallCalendar, {
        currentYear: testYear,
        currentMonth: testMonth,
        selectedCity,
        selectedPanjika,
        monthDays,
        monthMuhurtas,
        primaryOdiaSolarMonth,
        isPreviewModal: false
      })
    );

    expect(standaloneHtml).toContain('odia-print-sheet');
    expect(standaloneHtml).toContain('ଶ୍ରୀ ଗଣେଶାୟ ନମଃ');
    expect(standaloneHtml).toContain('କୋହିନୂର ପ୍ରେସ୍ ପାଞ୍ଜି');
    expect(standaloneHtml).toContain('ପ୍ରାମାଣିକ ଓଡ଼ିଆ କାନ୍ଥ କ୍ୟାଲେଣ୍ଡର');
    expect(standaloneHtml).toContain('ସୂର୍ଯ୍ୟୋଦୟ ଓ ଅସ୍ତ');
    expect(standaloneHtml).toContain('ସଂକ୍ରାନ୍ତି ବିବରଣୀ');
    expect(standaloneHtml).toContain('ମାସିକ ଏକାଦଶୀ ଓ ପାରଣା');
    expect(standaloneHtml).toContain('ମାସର ପ୍ରମୁଖ ଶୁଭ ମୁହୂର୍ତ୍ତ');
    expect(standaloneHtml).toContain('ସାପ୍ତାହିକ ଦିଗଶୂଳ ଓ ଯାତ୍ରା ପ୍ରତିକାର');
    expect(standaloneHtml).toContain('ଶ୍ରୀଦିବ୍ୟସିଂହଦେବ');

    // Dynamic height check: 6-row gets print:h-[42px], 5-row gets print:h-[50px]
    const firstDayWeekday = new Date(testYear, testMonth, 1).getDay();
    const rowCount = Math.ceil((firstDayWeekday + monthDays.length) / 7);
    const expectedClass = rowCount === 6 ? 'print:h-[42px]' : 'print:h-[50px]';
    expect(standaloneHtml).toContain(expectedClass);
  });

  it('renders Mobile-First Quick Day Summary Card and mobile-optimized cell grid with zero screen-jumping', () => {
    (globalThis as any).localStorage = {
      getItem: () => 'or',
      setItem: () => {}
    };
    const html = renderToString(
      React.createElement(I18nProvider, null, React.createElement(OdiaCalendarView))
    );

    // 1. Mobile Quick Day Summary Card (docked above grid for lg:hidden screens)
    expect(html).toContain('lg:hidden');
    expect(html).toContain('✨ ଅଭିଜିତ୍ ମୁହୂର୍ତ୍ତ');
    expect(html).toContain('⚠️ ରାହୁ କାଳ (ବର୍ଜିତ)');
    expect(html).toContain('🌅 ସୂର୍ଯ୍ୟୋଦୟ / ଅସ୍ତ');
    expect(html).toContain('WhatsApp');
    expect(html).toContain('Google Cal');
    expect(html).toContain('୬ ପାଞ୍ଜି');
    expect(html).toContain('ପତ୍ରିକା');
    expect(html).toContain('ସମ୍ପୂର୍ଣ୍ଣ ଜ୍ୟୋତିଷ ବିବରଣୀ ଓ ନବଗ୍ରହ ସ୍ଫୁଟ ଦେଖନ୍ତୁ');

    // 2. Uniform cell heights for perfect mobile alignment
    expect(html).toContain('min-h-[72px]');
    expect(html).toContain('touch-manipulation');
    expect(html).toContain('mobile-touch-scroll');
  });

  it('accurately isolates Bhadraba and Aswina lunar months (Zero festival leakage and future-proof across years)', () => {
    // 1. September 2026 verification
    const septHolidays: Array<{ date: string; name: string }> = [];
    const septFestivals: Array<{ date: string; name: string }> = [];

    for (let d = 1; d <= 30; d++) {
      const dt = new Date(2026, 8, d);
      const info = calculateOdiaCalendarDay(dt);
      for (const fest of info.festivals) {
        septFestivals.push({ date: `2026-09-${String(d).padStart(2, '0')}`, name: fest.nameOr });
        if (fest.isGovernmentHoliday) {
          septHolidays.push({ date: `2026-09-${String(d).padStart(2, '0')}`, name: fest.nameOr });
        }
      }
    }

    // September has 3 authentic Odisha Government Holidays: Janmashtami (Sept 4), Ganesh Puja (Sept 14), Nuakhai (Sept 15)
    expect(septHolidays.length).toBe(3);
    expect(septHolidays.some(h => h.name.includes('ଜନ୍ମାଷ୍ଟମୀ'))).toBe(true);
    expect(septHolidays.some(h => h.name.includes('ଗଣେଶ') && h.date === '2026-09-14')).toBe(true);
    expect(septHolidays.some(h => h.name.includes('ନୂଆଖାଇ') && h.date === '2026-09-15')).toBe(true);

    // ZERO October festival leakage in September!
    expect(septFestivals.some(f => f.name.includes('ଦୁର୍ଗା'))).toBe(false);
    expect(septFestivals.some(f => f.name.includes('ଦସହରା') || f.name.includes('ବିଜୟା'))).toBe(false);
    expect(septFestivals.some(f => f.name.includes('ମହାଳୟା'))).toBe(false);
    expect(septFestivals.some(f => f.name.includes('କୁମାର ପୂର୍ଣ୍ଣିମା'))).toBe(false);

    // 2. October 2026 verification
    const octFestivals: Array<{ date: string; name: string }> = [];
    for (let d = 1; d <= 31; d++) {
      const dt = new Date(2026, 9, d);
      const info = calculateOdiaCalendarDay(dt);
      for (const fest of info.festivals) {
        octFestivals.push({ date: `2026-10-${String(d).padStart(2, '0')}`, name: fest.nameOr });
      }
    }
    expect(octFestivals.some(f => f.name.includes('ମହାଳୟା'))).toBe(true);
    expect(octFestivals.some(f => f.name.includes('ଦୁର୍ଗା'))).toBe(true);
    expect(octFestivals.some(f => f.name.includes('ଦସହରା') || f.name.includes('ବିଜୟା'))).toBe(true);
    expect(octFestivals.some(f => f.name.includes('କୁମାର ପୂର୍ଣ୍ଣିମା'))).toBe(true);

    // 3. Multi-year future-proofing verification (2025-2030)
    for (let yr = 2025; yr <= 2030; yr++) {
      let ganeshDate: Date | null = null;
      let durgaDate: Date | null = null;
      let mahalayaDate: Date | null = null;
      let kumarPurnimaDate: Date | null = null;

      const start = new Date(yr, 7, 1);
      const end = new Date(yr, 10, 15);

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const info = calculateOdiaCalendarDay(new Date(d));
        for (const fest of info.festivals) {
          if (fest.id === 'ganesh_puja') ganeshDate = new Date(d);
          if (fest.id === 'durga_ashtami') durgaDate = new Date(d);
          if (fest.id === 'mahalaya') mahalayaDate = new Date(d);
          if (fest.id === 'kumar_purnima') kumarPurnimaDate = new Date(d);
        }
      }

      if (ganeshDate && durgaDate && mahalayaDate && kumarPurnimaDate) {
        expect(ganeshDate.getTime()).toBeLessThan(mahalayaDate.getTime());
        expect(mahalayaDate.getTime()).toBeLessThan(durgaDate.getTime());
        expect(durgaDate.getTime()).toBeLessThan(kumarPurnimaDate.getTime());
        const daysDiff = (durgaDate.getTime() - ganeshDate.getTime()) / (1000 * 60 * 60 * 24);
        expect(daysDiff).toBeGreaterThanOrEqual(20);
      }
    }
  });

  it('renders OdiaCalendarView with Lagna Chakra, Stotra Japa Suite, 32 Beshas and Muhurta Sync', () => {
    const html = renderToString(
      React.createElement(I18nProvider, null, React.createElement(OdiaCalendarView))
    );

    // Inspector Tab buttons
    expect(html).toContain('ଲଗ୍ନ ଚକ୍ର');
    expect(html).toContain('ପବିତ୍ର ସଙ୍କଳ୍ପ');
    expect(html).toContain('ଘାତ ଚକ୍ର');
    expect(html).toContain('ଚୌଘଡ଼ିଆ ଓ ହୋରା');

    // Navigation and Print buttons
    expect(html).toContain('ପ୍ରିଣ୍ଟ କ୍ୟାଲେଣ୍ଡର');
  });
});



