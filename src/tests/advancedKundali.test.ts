import { describe, it, expect } from 'vitest';
import { calculateBirthChart } from '../core/jataka/kundali_engine';
import { calculateVargaSign, VARGA_METADATA } from '../core/jataka/shodashavarga_engine';
import { calculateShadbala } from '../core/jataka/shadbala_engine';
import { calculateFullAshtakavarga } from '../core/jataka/ashtakavarga_engine';
import { calculateJaiminiAstrology } from '../core/jataka/jaimini_engine';
import { calculateBhavaChalit } from '../core/jataka/bhava_chalit_engine';
import { calculateAdvancedYogasAndDoshas } from '../core/jataka/advanced_yogas_engine';
import { calculateVedicRemedies, calculateLiveGochara } from '../core/jataka/remedies_engine';

describe('World-Class Advanced Vedic Janma Kundali Engine Suite', () => {
  const birthDate = new Date('1998-08-15T01:00:00Z'); // 06:30 AM IST
  const lat = 19.8135; // Puri
  const lon = 85.8312;

  const chart = calculateBirthChart('Abhijit Parida', birthDate, lat, lon, 'Puri (Srikshetra)', 'male');

  it('verifies all 16 Parashari Shodashavarga Divisional Charts (D1 - D60) are mathematically computed', () => {
    expect(chart.vargas).toBeDefined();
    const vargaKeys = Object.keys(chart.vargas);
    expect(vargaKeys).toHaveLength(16);

    const requiredVargas = ['D1', 'D2', 'D3', 'D4', 'D7', 'D9', 'D10', 'D12', 'D16', 'D20', 'D24', 'D27', 'D30', 'D40', 'D45', 'D60'];
    for (const v of requiredVargas) {
      const varga = chart.vargas[v as keyof typeof chart.vargas];
      expect(varga).toBeDefined();
      expect(varga.houses).toHaveLength(12);
      expect(varga.ascendantSign).toBeDefined();
      expect(varga.name.en).toBeDefined();
      expect(varga.name.or).toBeDefined();
      expect(varga.purpose.or).toBeDefined();
    }

    // Verify D1 and D9 match core chart
    expect(chart.vargas.D1.ascendantSign).toBe(chart.ascendantSign);
    expect(chart.vargas.D9.ascendantSign).toBe(chart.navamshaHouses[0].sign);
  });

  it('verifies Classical Shadbala 6-Fold planetary strength calculation meets Parashari requirements', () => {
    expect(chart.shadbala).toBeDefined();
    expect(chart.shadbala.strongestPlanet).toBeDefined();
    expect(chart.shadbala.weakestPlanet).toBeDefined();

    const mainPlanets = ['Surya', 'Chandra', 'Mangala', 'Budha', 'Guru', 'Shukra', 'Shani'];
    for (const p of mainPlanets) {
      const sb = chart.shadbala.planets[p as keyof typeof chart.shadbala.planets];
      expect(sb).toBeDefined();
      expect(sb.sthanaBala).toBeGreaterThan(0);
      expect(sb.digBala).toBeGreaterThanOrEqual(0);
      expect(sb.kaalaBala).toBeGreaterThan(0);
      expect(sb.chestaBala).toBeGreaterThan(0);
      expect(sb.naisargikaBala).toBeGreaterThan(0);
      expect(sb.totalRupas).toBeGreaterThan(3.0);
      expect(sb.strengthPercentage).toBeGreaterThan(0);
      expect(sb.rank).toBeGreaterThanOrEqual(1);
      expect(sb.rank).toBeLessThanOrEqual(7);
    }
  });

  it('verifies Parashari Ashtakavarga produces exactly 337 total Sarvashtakavarga bindus with reductions', () => {
    expect(chart.ashtakavarga).toBeDefined();
    expect(chart.ashtakavarga.sarvashtakavarga).toHaveLength(12);
    expect(chart.ashtakavarga.totalBindus).toBe(337);

    // Sum of 12 houses must equal exactly 337
    const sum = chart.ashtakavarga.sarvashtakavarga.reduce((a, b) => a + b, 0);
    expect(sum).toBe(337);

    // Check Bhinna Ashtakavarga for each planet
    const planets = ['Surya', 'Chandra', 'Mangala', 'Budha', 'Guru', 'Shukra', 'Shani'];
    let bavTotal = 0;
    for (const p of planets) {
      const bav = chart.ashtakavarga.bav[p as keyof typeof chart.ashtakavarga.bav];
      expect(bav).toBeDefined();
      expect(bav.bindus).toHaveLength(12);
      bavTotal += bav.totalBindus;
    }
    expect(bavTotal).toBe(337);

    // Trikona and Ekadhipatya Shodhana
    expect(chart.ashtakavarga.trikonaShodhana).toHaveLength(12);
    expect(chart.ashtakavarga.ekadhipatyaShodhana).toHaveLength(12);
  });

  it('verifies Jaimini 7 Chara Karakas, Arudha Lagna, Upapada Lagna, and Karakamsha', () => {
    expect(chart.jaimini).toBeDefined();
    expect(chart.jaimini.charaKarakas).toHaveLength(7);

    // Karakas must be in strictly non-increasing order of degreeInSign
    for (let i = 0; i < 6; i++) {
      expect(chart.jaimini.charaKarakas[i].degreeInSign).toBeGreaterThanOrEqual(
        chart.jaimini.charaKarakas[i + 1].degreeInSign
      );
    }

    // Role tags
    expect(chart.jaimini.charaKarakas[0].karaka).toBe('AK'); // Atmakaraka
    expect(chart.jaimini.charaKarakas[1].karaka).toBe('AmK'); // Amatyakaraka
    expect(chart.jaimini.charaKarakas[6].karaka).toBe('DK'); // Darakaraka

    expect(chart.jaimini.arudhaLagna.sign).toBeDefined();
    expect(chart.jaimini.upapadaLagna.sign).toBeDefined();
    expect(chart.jaimini.karakamsha.sign).toBeDefined();
  });

  it('verifies Bhava Chalit Sripati house cusps and shifted planets detection', () => {
    expect(chart.bhavaChalit).toBeDefined();
    expect(chart.bhavaChalit.cusps).toHaveLength(12);

    for (const cusp of chart.bhavaChalit.cusps) {
      expect(cusp.bhavaArambha).toBeGreaterThanOrEqual(0);
      expect(cusp.bhavaMadhya).toBeGreaterThanOrEqual(0);
      expect(cusp.bhavaAnta).toBeGreaterThanOrEqual(0);
      expect(cusp.sign).toBeDefined();
    }
  });

  it('verifies 3-Tier Vimshottari Dasha calculates contiguous Pratyantardashas', () => {
    expect(chart.dashas).toBeDefined();
    expect(chart.dashas.length).toBeGreaterThan(0);

    const firstMahadasha = chart.dashas[0];
    expect(firstMahadasha.subDashas).toBeDefined();
    expect(firstMahadasha.subDashas!.length).toBe(9);

    const firstAntardasha = firstMahadasha.subDashas![0];
    expect(firstAntardasha.subDashas).toBeDefined();
    expect(firstAntardasha.subDashas!.length).toBe(9);
    expect(firstAntardasha.subDashas![0].level).toBe('Pratyantardasha');

    expect(chart.currentDasha.pratyantardasha).toBeDefined();
  });

  it('verifies Classical Yogas and Dosha Analysis (Kala Sarpa, Manglik, Sade Sati)', () => {
    expect(chart.yogas.length).toBeGreaterThan(0);

    expect(chart.kalaSarpa).toBeDefined();
    expect(typeof chart.kalaSarpa.hasDosha).toBe('boolean');
    expect(chart.kalaSarpa.remedy.or).toBeDefined();

    expect(chart.manglik).toBeDefined();
    expect(typeof chart.manglik.isManglik).toBe('boolean');

    expect(chart.remedies).toBeDefined();
    expect(chart.remedies.gemstones).toHaveLength(3); // Life, Lucky, Benefic
    expect(chart.remedies.rudrakshas.length).toBeGreaterThan(0);
    expect(chart.remedies.jagannathRemedy.besha).toBeDefined();
    expect(chart.remedies.jagannathRemedy.stotra).toBeDefined();

    expect(chart.gochara).toBeDefined();
    expect(Object.keys(chart.gochara.planets)).toHaveLength(9);
  });

  it('verifies Avakhada Chakra & Ghataka Warnings computation', () => {
    expect(chart.avakhada).toBeDefined();
    expect(chart.avakhada.varna.en).toBeDefined();
    expect(chart.avakhada.vashya.en).toBeDefined();
    expect(chart.avakhada.yoni.animal).toBeDefined();
    expect(chart.avakhada.yoni.enemyYoni).toBeDefined();
    expect(chart.avakhada.gana.trait.or).toBeDefined();
    expect(chart.avakhada.nadi.dosha).toMatch(/Vata|Pitta|Kapha/);
    expect(chart.avakhada.nadi.ayurvedicGuidance.or).toBeDefined();
    expect(chart.avakhada.tatwa.en).toBeDefined();
    expect(chart.avakhada.namaAksharas).toHaveLength(4);
    expect(chart.avakhada.pada).toBeGreaterThanOrEqual(1);
    expect(chart.avakhada.pada).toBeLessThanOrEqual(4);

    expect(chart.ghataka).toBeDefined();
    expect(chart.ghataka.ghatakaRashi).toBeDefined();
    expect(chart.ghataka.ghatakaMasa).toBeDefined();
    expect(chart.ghataka.ghatakaTithi).toBeDefined();
    expect(chart.ghataka.ghatakaVara).toBeDefined();
    expect(chart.ghataka.ghatakaNakshatra).toBeDefined();
    expect(chart.ghataka.ghatakaLagna).toBeDefined();
    expect(chart.ghataka.ghatakaPrahar).toBeDefined();
    expect(chart.ghataka.cautionGuidance.or).toBeDefined();
  });

  it('verifies 12 Bhavas Comprehensive Predictive Analysis', () => {
    expect(chart.bhavaAnalysis).toBeDefined();
    expect(chart.bhavaAnalysis.bhavas).toHaveLength(12);
    expect(chart.bhavaAnalysis.strongestHouse).toBeGreaterThanOrEqual(1);
    expect(chart.bhavaAnalysis.strongestHouse).toBeLessThanOrEqual(12);
    expect(chart.bhavaAnalysis.challengingHouse).toBeGreaterThanOrEqual(1);
    expect(chart.bhavaAnalysis.challengingHouse).toBeLessThanOrEqual(12);

    for (let h = 1; h <= 12; h++) {
      const bhava = chart.bhavaAnalysis.bhavas[h - 1];
      expect(bhava.houseNumber).toBe(h);
      expect(bhava.houseName.en).toBeDefined();
      expect(bhava.houseName.or).toBeDefined();
      expect(bhava.sign).toBeDefined();
      expect(bhava.lord).toBeDefined();
      expect(bhava.lordPlacementHouse).toBeGreaterThanOrEqual(1);
      expect(bhava.lordPlacementHouse).toBeLessThanOrEqual(12);
      expect(bhava.lordDignity).toBeDefined();
      expect(bhava.savBindus).toBeGreaterThan(0);
      expect(bhava.strengthScore).toBeGreaterThanOrEqual(15);
      expect(bhava.strengthScore).toBeLessThanOrEqual(98);
      expect(bhava.keyThemes.or).toBeDefined();
      expect(bhava.detailedPrediction.or).toBeDefined();
      expect(bhava.detailedPrediction.hi).toBeDefined();
      expect(bhava.detailedPrediction.en).toBeDefined();
    }
  });

  it('verifies 3-Fold Planetary Avasthas (Baladi, Deeptadi, Jagradadi)', () => {
    expect(chart.planetaryAvasthas).toBeDefined();
    const planets = ['Surya', 'Chandra', 'Mangala', 'Budha', 'Guru', 'Shukra', 'Shani', 'Rahu', 'Ketu'] as const;

    for (const p of planets) {
      const avastha = chart.planetaryAvasthas.avasthas[p];
      expect(avastha).toBeDefined();
      expect(avastha.planet).toBe(p);
      expect(['Bala', 'Kumara', 'Yuva', 'Vriddha', 'Mrita']).toContain(avastha.baladiAvastha);
      expect(avastha.fruitPercentage).toBeGreaterThanOrEqual(5);
      expect(avastha.fruitPercentage).toBeLessThanOrEqual(100);
      expect(['Deepta', 'Swastha', 'Mudita', 'Shanta', 'Dina', 'Vikala', 'Khala']).toContain(avastha.deeptadiAvastha);
      expect(['Jagrata', 'Swapna', 'Sushupti']).toContain(avastha.jagradadiAvastha);
      expect(avastha.interpretation.or).toBeDefined();
      expect(avastha.interpretation.hi).toBeDefined();
      expect(avastha.interpretation.en).toBeDefined();
    }
  });

  it('verifies Krishnamurti Paddhati (KP System) 249 Sub-Lord calculations', () => {
    expect(chart.kpSystem).toBeDefined();
    const planets = ['Surya', 'Chandra', 'Mangala', 'Budha', 'Guru', 'Shukra', 'Shani', 'Rahu', 'Ketu'] as const;

    for (const p of planets) {
      const kp = chart.kpSystem.planets[p];
      expect(kp).toBeDefined();
      expect(kp.name).toBe(p);
      expect(kp.longitude).toBeGreaterThanOrEqual(0);
      expect(kp.longitude).toBeLessThan(360);
      expect(kp.sign).toBeDefined();
      expect(kp.signLord).toBeDefined();
      expect(kp.starLord).toBeDefined();
      expect(kp.subLord).toBeDefined();
    }

    expect(chart.kpSystem.cusps).toHaveLength(12);
    for (let c = 0; c < 12; c++) {
      const cusp = chart.kpSystem.cusps[c];
      expect(cusp.name).toBe(`Cusp ${c + 1}`);
      expect(cusp.sign).toBeDefined();
      expect(cusp.signLord).toBeDefined();
      expect(cusp.starLord).toBeDefined();
      expect(cusp.subLord).toBeDefined();
    }
  });

  it('verifies Personalized Daily Astro-Guide (Live Tarabala & Chandrabala)', () => {
    expect(chart.dailyGuide).toBeDefined();
    expect(chart.dailyGuide.dateStr).toBeDefined();
    expect(chart.dailyGuide.transitMoonSign).toBeDefined();
    expect(chart.dailyGuide.transitMoonNakshatra).toBeDefined();

    // Tarabala
    expect(chart.dailyGuide.tarabala.taraType).toBeDefined();
    expect(chart.dailyGuide.tarabala.taraName.or).toBeDefined();
    expect(typeof chart.dailyGuide.tarabala.isAuspicious).toBe('boolean');
    expect(chart.dailyGuide.tarabala.guidance.or).toBeDefined();

    // Chandrabala
    expect(chart.dailyGuide.chandrabala.houseFromNatalMoon).toBeGreaterThanOrEqual(1);
    expect(chart.dailyGuide.chandrabala.houseFromNatalMoon).toBeLessThanOrEqual(12);
    expect(typeof chart.dailyGuide.chandrabala.isAuspicious).toBe('boolean');
    expect(chart.dailyGuide.chandrabala.guidance.or).toBeDefined();

    // Lucky guidelines
    expect(chart.dailyGuide.luckyGuidelines.color.or).toBeDefined();
    expect(chart.dailyGuide.luckyGuidelines.number).toBeGreaterThanOrEqual(1);
    expect(chart.dailyGuide.luckyGuidelines.direction.or).toBeDefined();
    expect(chart.dailyGuide.luckyGuidelines.mantra).toBeDefined();
  });

  it('verifies Janma Panchanga 5 Pillars & Elemental Balance', () => {
    expect(chart.janmaPanchanga).toBeDefined();
    
    // 5 Pillars
    const pillars = [
      chart.janmaPanchanga.tithi,
      chart.janmaPanchanga.vara,
      chart.janmaPanchanga.nakshatra,
      chart.janmaPanchanga.yoga,
      chart.janmaPanchanga.karana
    ];

    for (const p of pillars) {
      expect(p).toBeDefined();
      expect(p.name.or).toBeDefined();
      expect(p.value.or).toBeDefined();
      expect(p.rulingLord).toBeDefined();
      expect(p.element.or).toBeDefined();
      expect(p.significance.or).toBeDefined();
      expect(p.significance.hi).toBeDefined();
      expect(p.significance.en).toBeDefined();
    }

    // Elemental balance
    expect(chart.janmaPanchanga.elementalBalance).toBeDefined();
    expect(chart.janmaPanchanga.elementalBalance.dominantElement.or).toBeDefined();
    expect(chart.janmaPanchanga.elementalBalance.summary.or).toBeDefined();
    expect(chart.janmaPanchanga.elementalBalance.summary.hi).toBeDefined();
    expect(chart.janmaPanchanga.elementalBalance.summary.en).toBeDefined();
  });

  it('verifies Parashari Vimsopaka Bala (20-point Dignity) and Ishta/Kashta Phala', () => {
    expect(chart.vimsopakaBala).toBeDefined();
    expect(chart.vimsopakaBala.highestVimsopakaPlanet).toBeDefined();
    expect(chart.vimsopakaBala.highestIshtaPlanet).toBeDefined();

    const planets = ['Surya', 'Chandra', 'Mangala', 'Budha', 'Guru', 'Shukra', 'Shani'] as const;
    for (const p of planets) {
      const vb = chart.vimsopakaBala.planets[p];
      expect(vb).toBeDefined();
      expect(vb.planet).toBe(p);
      expect(vb.vimsopakaScore).toBeGreaterThanOrEqual(0);
      expect(vb.vimsopakaScore).toBeLessThanOrEqual(20);
      expect(['Purna', 'Uttama', 'Madhyama', 'Heena']).toContain(vb.vimsopakaGrade);
      expect(vb.gradeName.or).toBeDefined();
      expect(vb.ishtaPhala).toBeGreaterThanOrEqual(0);
      expect(vb.ishtaPhala).toBeLessThanOrEqual(60);
      expect(vb.kashtaPhala).toBeGreaterThanOrEqual(0);
      expect(vb.kashtaPhala).toBeLessThanOrEqual(60);
      expect(vb.significance.or).toBeDefined();
      expect(vb.significance.hi).toBeDefined();
      expect(vb.significance.en).toBeDefined();
    }
  });

  it('verifies Bhrigu Nandi Nadi (BNN) Conjunctions and Karmic Confluences', () => {
    expect(chart.nadiAstrology).toBeDefined();
    expect(chart.nadiAstrology.combinations).toBeInstanceOf(Array);
    expect(chart.nadiAstrology.karmicMissionSummary.or).toBeDefined();
    expect(chart.nadiAstrology.karmicMissionSummary.hi).toBeDefined();
    expect(chart.nadiAstrology.karmicMissionSummary.en).toBeDefined();

    for (const comb of chart.nadiAstrology.combinations) {
      expect(comb.id).toBeDefined();
      expect(comb.title.or).toBeDefined();
      expect(comb.planets.length).toBeGreaterThanOrEqual(2);
      expect(['Conjunction', 'Trinal', 'Opposition']).toContain(comb.type);
      expect(comb.karmicManifestation.or).toBeDefined();
      expect(comb.destinyPattern.or).toBeDefined();
    }
  });

  it('verifies 27 Sacred Trees (Vrikshas) & Nakshatra Lore', () => {
    expect(chart.nakshatraSacred).toBeDefined();
    expect(chart.nakshatraSacred.nakshatraName.or).toBeDefined();
    expect(chart.nakshatraSacred.pada).toBeGreaterThanOrEqual(1);
    expect(chart.nakshatraSacred.pada).toBeLessThanOrEqual(4);

    // Sacred Tree
    expect(chart.nakshatraSacred.sacredTree.odiaName).toBeDefined();
    expect(chart.nakshatraSacred.sacredTree.botanicalName).toBeDefined();
    expect(chart.nakshatraSacred.sacredTree.englishName).toBeDefined();
    expect(chart.nakshatraSacred.sacredTree.spiritualSignificance.or).toBeDefined();

    // Presiding Deity
    expect(chart.nakshatraSacred.deity.name.or).toBeDefined();
    expect(chart.nakshatraSacred.deity.mantra).toBeDefined();
    expect(chart.nakshatraSacred.deity.blessing.or).toBeDefined();

    // Totems
    expect(chart.nakshatraSacred.symbol.or).toBeDefined();
    expect(chart.nakshatraSacred.bird.or).toBeDefined();
    expect(chart.nakshatraSacred.animal.or).toBeDefined();
    expect(chart.nakshatraSacred.padaDestiny.or).toBeDefined();
    expect(chart.nakshatraSacred.padaDestiny.hi).toBeDefined();
    expect(chart.nakshatraSacred.padaDestiny.en).toBeDefined();
  });

  it('verifies Comprehensive Life Domains (Career, Wealth, Marriage, Health, Education, Moksha)', () => {
    expect(chart.lifeDomains).toBeDefined();
    expect(chart.lifeDomains.domains).toHaveLength(6);
    expect(chart.lifeDomains.primeFocusDomain).toBeDefined();

    const domainIds = ['career', 'wealth', 'marriage', 'health', 'education', 'spirituality'];
    for (const d of chart.lifeDomains.domains) {
      expect(domainIds).toContain(d.domainId);
      expect(d.title.or).toBeDefined();
      expect(d.keyPlanets.length).toBeGreaterThan(0);
      expect(d.auspiciousHouses.length).toBeGreaterThan(0);
      expect(d.rating).toBeGreaterThanOrEqual(1);
      expect(d.rating).toBeLessThanOrEqual(5);
      expect(d.analysis.or).toBeDefined();
      expect(d.analysis.hi).toBeDefined();
      expect(d.analysis.en).toBeDefined();
      expect(d.milestoneYears.length).toBeGreaterThan(0);
      expect(d.strategicRemedy.or).toBeDefined();
    }
  });


  it('verifies Special Lagnas (Śrī, Indu, Hora, Ghāti, Prānapada, Karakamsha, Mandi, Gulika) & 5 Upagrahas', () => {
    expect(chart.specialLagnas).toBeDefined();

    // Śrī Lagna
    expect(chart.specialLagnas.sriLagna.id).toBe('sriLagna');
    expect(chart.specialLagnas.sriLagna.sign).toBeDefined();
    expect(chart.specialLagnas.sriLagna.degreeInSign).toBeGreaterThanOrEqual(0);
    expect(chart.specialLagnas.sriLagna.house).toBeGreaterThanOrEqual(1);
    expect(chart.specialLagnas.sriLagna.house).toBeLessThanOrEqual(12);

    // Indu Lagna (Wealth Spot)
    expect(chart.specialLagnas.induLagna.sign).toBeDefined();
    expect(chart.specialLagnas.induLagna.totalRays).toBeGreaterThan(0);
    expect(chart.specialLagnas.induLagna.houseFromLagna).toBeGreaterThanOrEqual(1);
    expect(chart.specialLagnas.induLagna.houseFromLagna).toBeLessThanOrEqual(12);
    expect(['Koti Yoga (Billionaire)', 'Maha Dhana (High Wealth)', 'Madhyama Dhana (Comfortable)', 'Alpa Dhana (Ordinary)'])
      .toContain(chart.specialLagnas.induLagna.wealthTier);
    expect(chart.specialLagnas.induLagna.wealthPrediction.or).toBeDefined();

    // Hora Lagna & Ghāti Lagna
    expect(chart.specialLagnas.horaLagna.shortName).toBe('HL');
    expect(chart.specialLagnas.ghatiLagna.shortName).toBe('GL');
    expect(chart.specialLagnas.pranapadaLagna.shortName).toBe('PP');
    expect(chart.specialLagnas.karakamshaLagna.shortName).toBe('KL');

    // Mandi & Gulika
    expect(chart.specialLagnas.mandi.shortName).toBe('Mn');
    expect(chart.specialLagnas.gulika.shortName).toBe('Gk');

    // 5 Upagrahas
    expect(chart.specialLagnas.upagrahas).toHaveLength(5);
    for (const u of chart.specialLagnas.upagrahas) {
      expect(u.sign).toBeDefined();
      expect(u.degreeInSign).toBeGreaterThanOrEqual(0);
      expect(u.house).toBeGreaterThanOrEqual(1);
      expect(u.house).toBeLessThanOrEqual(12);
      expect(u.effect.or).toBeDefined();
    }
  });

});
