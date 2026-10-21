export type ZodiacSign = 
  | 'Mesha' | 'Vrishabha' | 'Mithuna' | 'Karka' 
  | 'Simha' | 'Kanya' | 'Tula' | 'Vrischika' 
  | 'Dhanu' | 'Makara' | 'Kumbha' | 'Meena';

export type PlanetName = 
  | 'Surya' | 'Chandra' | 'Mangala' | 'Budha' 
  | 'Guru' | 'Shukra' | 'Shani' | 'Rahu' | 'Ketu';

export interface PlanetPosition {
  planet: PlanetName;
  sign: ZodiacSign;
  signIndex: number; // 0 to 11
  longitude: number; // 0 to 360
  degreeInSign: number; // 0 to 30
  deg: number; // Whole degrees
  min: number; // Minutes
  sec: number; // Seconds
  nakshatra: string;
  nakshatraIndex: number; // 1 to 27
  pada: number;
  house: number; // 1 to 12
  isRetrograde: boolean;
  isCombust: boolean;
  dignity: 'Exalted' | 'Moolatrikona' | 'Own' | 'Friendly' | 'Neutral' | 'Enemy' | 'Debilitated';
  navamshaSign: ZodiacSign;
}

export interface HouseInfo {
  houseNumber: number; // 1 to 12
  sign: ZodiacSign;
  signIndex: number;
  degree: number;
  planets: PlanetName[];
}

export interface DashaPeriod {
  planet: PlanetName;
  startDate: string;
  endDate: string;
  durationYears: number;
  level: 'Mahadasha' | 'Antardasha' | 'Pratyantardasha' | 'Sookshmasha' | 'Pranadasha';
  subDashas?: DashaPeriod[];
}

export interface VedicYoga {
  id: string;
  name: {
    en: string;
    hi: string;
    or: string;
  };
  type: 'Auspicious' | 'Inauspicious' | 'Rajayoga';
  description: {
    en: string;
    hi: string;
    or: string;
  };
  planetsInvolved: PlanetName[];
  effect: {
    en: string;
    hi: string;
    or: string;
  };
}

export interface LifePredictions {
  personality: { en: string; hi: string; or: string };
  career: { en: string; hi: string; or: string };
  wealth: { en: string; hi: string; or: string };
  relationships: { en: string; hi: string; or: string };
  health: { en: string; hi: string; or: string };
  spirituality: { en: string; hi: string; or: string };
}

export type VargaType =
  | 'D1' | 'D2' | 'D3' | 'D4' | 'D7' | 'D9' | 'D10'
  | 'D12' | 'D16' | 'D20' | 'D24' | 'D27' | 'D30' | 'D40' | 'D45' | 'D60';

export interface VargaInfo {
  code: VargaType;
  name: { en: string; hi: string; or: string };
  division: number;
  purpose: { en: string; hi: string; or: string };
  houses: HouseInfo[];
  ascendantSign: ZodiacSign;
  ascendantSignIndex: number;
}

export interface PlanetShadbala {
  planet: PlanetName;
  sthanaBala: number; // Positional
  digBala: number;    // Directional
  kaalaBala: number;  // Temporal
  chestaBala: number; // Motional
  naisargikaBala: number; // Natural
  drikBala: number;   // Aspectual
  totalVirupas: number;
  totalRupas: number;
  requiredRupas: number;
  strengthPercentage: number;
  isStrong: boolean;
  rank: number;
}

export interface ShadbalaSummary {
  planets: Record<PlanetName, PlanetShadbala>;
  strongestPlanet: PlanetName;
  weakestPlanet: PlanetName;
}

export interface BhinnaAshtakavarga {
  planet: PlanetName;
  bindus: number[]; // 12 houses (0 to 11)
  totalBindus: number;
}

export interface FullAshtakavargaData {
  bav: Record<PlanetName, BhinnaAshtakavarga>;
  sarvashtakavarga: number[]; // 12 houses
  trikonaShodhana: number[];
  ekadhipatyaShodhana: number[];
  totalBindus: number; // 337
}

export interface CharaKaraka {
  karaka: 'AK' | 'AmK' | 'BK' | 'MK' | 'PK' | 'GK' | 'DK';
  karakaName: { en: string; hi: string; or: string };
  planet: PlanetName;
  degreeInSign: number;
  sign: ZodiacSign;
  signification: { en: string; hi: string; or: string };
}

export interface JaiminiData {
  charaKarakas: CharaKaraka[];
  arudhaLagna: { sign: ZodiacSign; signIndex: number; house: number };
  upapadaLagna: { sign: ZodiacSign; signIndex: number; house: number };
  karakamsha: { sign: ZodiacSign; signIndex: number; navamshaSign: ZodiacSign };
}

export interface BhavaCuspInfo {
  houseNumber: number;
  bhavaArambha: number; // degree 0-360
  bhavaMadhya: number;  // peak cusp degree 0-360
  bhavaAnta: number;    // degree 0-360
  sign: ZodiacSign;
  signIndex: number;
  planetsInBhava: PlanetName[];
}

export interface BhavaChalitData {
  cusps: BhavaCuspInfo[];
  shiftedPlanets: { planet: PlanetName; rashiHouse: number; chalitHouse: number }[];
}

export interface KalaSarpaInfo {
  hasDosha: boolean;
  type?: string;
  name: { en: string; hi: string; or: string };
  direction: 'Udit' | 'Anudit' | 'None';
  description: { en: string; hi: string; or: string };
  isCancelled: boolean;
  remedy: { en: string; hi: string; or: string };
}

export interface ManglikInfo {
  isManglik: boolean;
  fromLagna: boolean;
  fromMoon: boolean;
  fromVenus: boolean;
  severity: 'None' | 'Mild' | 'Moderate' | 'High';
  cancellationReasons: { en: string; hi: string; or: string }[];
  description: { en: string; hi: string; or: string };
}

export interface SadeSatiInfo {
  isActive: boolean;
  phase: 'Not Active' | 'Rising (12th)' | 'Peak (Janma)' | 'Setting (2nd)';
  phaseOr: string;
  saturnCurrentSign: ZodiacSign;
  saturnDegree: number;
  moonSign: ZodiacSign;
  isKantakaShani: boolean;
  isAshtamaShani: boolean;
  description: { en: string; hi: string; or: string };
  remedy: { en: string; hi: string; or: string };
}

export interface GemstoneRecommendation {
  type: 'Life' | 'Lucky' | 'Benefic';
  typeName: { en: string; hi: string; or: string };
  gemstone: { en: string; hi: string; or: string };
  rulingPlanet: PlanetName;
  metal: { en: string; hi: string; or: string };
  finger: { en: string; hi: string; or: string };
  mantra: string;
  dayToWear: { en: string; hi: string; or: string };
  benefits: { en: string; hi: string; or: string };
}

export interface RudrakshaRecommendation {
  mukhi: number;
  name: { en: string; hi: string; or: string };
  deity: { en: string; hi: string; or: string };
  rulingPlanet: PlanetName;
  benefits: { en: string; hi: string; or: string };
  mantra: string;
}

export interface VedicRemediesData {
  gemstones: GemstoneRecommendation[];
  rudrakshas: RudrakshaRecommendation[];
  jagannathRemedy: {
    besha: string;
    stotra: string;
    prasad: string;
    guidance: { en: string; hi: string; or: string };
  };
  daanaRemedies: {
    item: { en: string; hi: string; or: string };
    day: { en: string; hi: string; or: string };
    target: { en: string; hi: string; or: string };
  }[];
}

export interface GocharaTransitPlanet {
  planet: PlanetName;
  sign: ZodiacSign;
  signIndex: number;
  degreeInSign: number;
  houseFromLagna: number;
  houseFromMoon: number;
  isRetrograde: boolean;
  savPointsInHouse: number;
  transitEffect: 'Auspicious' | 'Neutral' | 'Inauspicious';
  description: { en: string; hi: string; or: string };
}

export interface GocharaData {
  transitDate: string;
  planets: Record<PlanetName, GocharaTransitPlanet>;
  sadeSati: SadeSatiInfo;
}

export interface AvakhadaData {
  varna: { en: string; hi: string; or: string };
  vashya: { en: string; hi: string; or: string };
  yoni: { en: string; hi: string; or: string; animal: string; enemyYoni: string };
  gana: { en: string; hi: string; or: string; trait: { en: string; hi: string; or: string } };
  nadi: { en: string; hi: string; or: string; dosha: string; ayurvedicGuidance: { en: string; hi: string; or: string } };
  tatwa: { en: string; hi: string; or: string };
  namaAksharas: string[];
  pada: number;
}

export interface GhatakaData {
  ghatakaRashi: ZodiacSign;
  ghatakaMasa: string;
  ghatakaTithi: string;
  ghatakaVara: string;
  ghatakaNakshatra: string;
  ghatakaLagna: ZodiacSign;
  ghatakaPrahar: string;
  cautionGuidance: { en: string; hi: string; or: string };
}

export interface BhavaAnalysisItem {
  houseNumber: number;
  houseName: { en: string; hi: string; or: string };
  sign: ZodiacSign;
  lord: PlanetName;
  lordPlacementHouse: number;
  lordDignity: string;
  occupants: PlanetName[];
  savBindus: number;
  strengthScore: number; // 0 to 100
  keyThemes: { en: string; hi: string; or: string };
  detailedPrediction: { en: string; hi: string; or: string };
}

export interface BhavaDetailedAnalysis {
  bhavas: BhavaAnalysisItem[];
  strongestHouse: number;
  challengingHouse: number;
}

export interface PlanetAvastha {
  planet: PlanetName;
  baladiAvastha: 'Bala' | 'Kumara' | 'Yuva' | 'Vriddha' | 'Mrita';
  baladiName: { en: string; hi: string; or: string };
  fruitPercentage: number;
  deeptadiAvastha: 'Deepta' | 'Swastha' | 'Mudita' | 'Shanta' | 'Dina' | 'Vikala' | 'Khala';
  deeptadiName: { en: string; hi: string; or: string };
  jagradadiAvastha: 'Jagrata' | 'Swapna' | 'Sushupti';
  jagradadiName: { en: string; hi: string; or: string };
  interpretation: { en: string; hi: string; or: string };
}

export interface PlanetaryAvasthasData {
  avasthas: Record<PlanetName, PlanetAvastha>;
}

export interface KpEntityInfo {
  name: string;
  longitude: number;
  sign: ZodiacSign;
  signLord: PlanetName;
  starLord: PlanetName;
  subLord: PlanetName;
}

export interface KpSystemData {
  planets: Record<PlanetName, KpEntityInfo>;
  cusps: KpEntityInfo[];
}

export interface DailyPersonalGuideData {
  dateStr: string;
  transitMoonSign: ZodiacSign;
  transitMoonNakshatra: string;
  tarabala: {
    taraType: string;
    taraName: { en: string; hi: string; or: string };
    isAuspicious: boolean;
    guidance: { en: string; hi: string; or: string };
  };
  chandrabala: {
    houseFromNatalMoon: number;
    isAuspicious: boolean;
    guidance: { en: string; hi: string; or: string };
  };
  luckyGuidelines: {
    color: { en: string; hi: string; or: string };
    number: number;
    direction: { en: string; hi: string; or: string };
    mantra: string;
  };
}

export interface JanmaPanchangaPillar {
  name: { en: string; hi: string; or: string };
  value: { en: string; hi: string; or: string };
  rulingLord: PlanetName | string;
  deity?: { en: string; hi: string; or: string };
  element: { en: string; hi: string; or: string };
  significance: { en: string; hi: string; or: string };
}

export interface JanmaPanchangaData {
  tithi: JanmaPanchangaPillar;
  vara: JanmaPanchangaPillar;
  nakshatra: JanmaPanchangaPillar;
  yoga: JanmaPanchangaPillar;
  karana: JanmaPanchangaPillar;
  elementalBalance: {
    dominantElement: { en: string; hi: string; or: string };
    summary: { en: string; hi: string; or: string };
  };
}

export interface PlanetVimsopaka {
  planet: PlanetName;
  vimsopakaScore: number; // 0 to 20
  vimsopakaGrade: 'Purna' | 'Uttama' | 'Madhyama' | 'Heena';
  gradeName: { en: string; hi: string; or: string };
  ishtaPhala: number; // 0 to 60
  kashtaPhala: number; // 0 to 60
  significance: { en: string; hi: string; or: string };
}

export interface VimsopakaBalaData {
  planets: Record<PlanetName, PlanetVimsopaka>;
  highestVimsopakaPlanet: PlanetName;
  highestIshtaPlanet: PlanetName;
}

export interface NadiCombination {
  id: string;
  title: { en: string; hi: string; or: string };
  planets: PlanetName[];
  type: 'Conjunction' | 'Trinal' | 'Opposition';
  karmicManifestation: { en: string; hi: string; or: string };
  destinyPattern: { en: string; hi: string; or: string };
}

export interface BhriguNandiNadiData {
  combinations: NadiCombination[];
  karmicMissionSummary: { en: string; hi: string; or: string };
}

export interface NakshatraSacredData {
  nakshatraName: { en: string; hi: string; or: string };
  pada: number;
  sacredTree: {
    odiaName: string;
    botanicalName: string;
    englishName: string;
    spiritualSignificance: { en: string; hi: string; or: string };
  };
  deity: {
    name: { en: string; hi: string; or: string };
    mantra: string;
    blessing: { en: string; hi: string; or: string };
  };
  symbol: { en: string; hi: string; or: string };
  bird: { en: string; hi: string; or: string };
  animal: { en: string; hi: string; or: string };
  padaDestiny: { en: string; hi: string; or: string };
}

export interface DomainPredictionItem {
  domainId: 'career' | 'wealth' | 'marriage' | 'health' | 'education' | 'spirituality';
  title: { en: string; hi: string; or: string };
  keyPlanets: PlanetName[];
  auspiciousHouses: number[];
  rating: number; // 1 to 5 stars
  analysis: { en: string; hi: string; or: string };
  milestoneYears: number[];
  strategicRemedy: { en: string; hi: string; or: string };
}

export interface ComprehensiveLifeDomainsData {
  domains: DomainPredictionItem[];
  primeFocusDomain: string;
}


export interface SpecialLagnaItem {
  id: string;
  name: { en: string; hi: string; or: string };
  shortName: string;
  sign: ZodiacSign;
  degreeInSign: number;
  house: number;
  signLord: PlanetName;
  significance: { en: string; hi: string; or: string };
  prediction: { en: string; hi: string; or: string };
}

export interface InduLagnaDetails {
  sign: ZodiacSign;
  degreeInSign: number;
  houseFromLagna: number;
  houseFromMoon: number;
  signLord: PlanetName;
  lagna9thLord: PlanetName;
  moon9thLord: PlanetName;
  lagnaRays: number;
  moonRays: number;
  totalRays: number;
  occupants: PlanetName[];
  aspectingPlanets: PlanetName[];
  wealthTier: 'Koti Yoga (Billionaire)' | 'Maha Dhana (High Wealth)' | 'Madhyama Dhana (Comfortable)' | 'Alpa Dhana (Ordinary)';
  wealthPrediction: { en: string; hi: string; or: string };
}

export interface UpagrahaItem {
  name: { en: string; hi: string; or: string };
  sign: ZodiacSign;
  degreeInSign: number;
  house: number;
  isShadowNode: boolean;
  effect: { en: string; hi: string; or: string };
}

export interface SpecialLagnasData {
  sriLagna: SpecialLagnaItem;
  induLagna: InduLagnaDetails;
  horaLagna: SpecialLagnaItem;
  ghatiLagna: SpecialLagnaItem;
  pranapadaLagna: SpecialLagnaItem;
  karakamshaLagna: SpecialLagnaItem;
  mandi: SpecialLagnaItem;
  gulika: SpecialLagnaItem;
  upagrahas: UpagrahaItem[];
}

export interface BirthChartData {
  nativeName: string;
  gender: string;
  dateTime: string;
  birthPlace: string;
  latitude: number;
  longitude: number;
  ayanamsa: number;
  ascendantDegree: number;
  ascendantSign: ZodiacSign;
  ascendantSignIndex: number;
  planets: Record<PlanetName, PlanetPosition>;
  houses: HouseInfo[];
  navamshaHouses: HouseInfo[];
  vargas: Record<VargaType, VargaInfo>;
  shadbala: ShadbalaSummary;
  ashtakavarga: FullAshtakavargaData;
  jaimini: JaiminiData;
  bhavaChalit: BhavaChalitData;
  kalaSarpa: KalaSarpaInfo;
  manglik: ManglikInfo;
  remedies: VedicRemediesData;
  gochara: GocharaData;
  avakhada: AvakhadaData;
  ghataka: GhatakaData;
  bhavaAnalysis: BhavaDetailedAnalysis;
  planetaryAvasthas: PlanetaryAvasthasData;
  kpSystem: KpSystemData;
  dailyGuide: DailyPersonalGuideData;
  janmaPanchanga: JanmaPanchangaData;
  vimsopakaBala: VimsopakaBalaData;
  nadiAstrology: BhriguNandiNadiData;
  nakshatraSacred: NakshatraSacredData;
  lifeDomains: ComprehensiveLifeDomainsData;
  specialLagnas: SpecialLagnasData;
  currentDasha: {
    mahadasha: PlanetName;
    antardasha: PlanetName;
    pratyantardasha?: PlanetName;
    sookshmasha?: PlanetName;
    pranadasha?: PlanetName;
    startDate: string;
    endDate: string;
    progressPercentage: number;
  };
  dashas: DashaPeriod[];
  yogas: VedicYoga[];
  predictions: LifePredictions;
}