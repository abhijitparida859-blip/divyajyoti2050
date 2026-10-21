export interface KootaResult {
  name: 'Varna' | 'Vashya' | 'Tara' | 'Yoni' | 'Graha Maitri' | 'Gana' | 'Bhakoot' | 'Nadi';
  obtainedPoints: number;
  maxPoints: number;
  description: string;
  status: 'excellent' | 'good' | 'average' | 'dosha';
}

export interface MangalDoshaResult {
  hasDosha: boolean;
  intensity: 'None' | 'Low' | 'Medium' | 'High';
  affectedHouses: number[];
  isCancelled: boolean;
  cancellationReason?: string;
}

export interface KundaliMilanResult {
  groomName: string;
  brideName: string;
  totalScore: number; // 0 to 36
  maxScore: 36;
  percentage: number;
  verdict: 'Excellent' | 'Very Good' | 'Average' | 'Not Recommended';
  kootas: KootaResult[];
  groomManglik: MangalDoshaResult;
  brideManglik: MangalDoshaResult;
  remedies: string[];
}

// ==================== ADVANCED MILAN (real-chart based) ====================

export type MatchSeverity = 'auspicious' | 'good' | 'mixed' | 'dosha';

export interface ExtendedKootaDetail {
  key: 'varna' | 'vashya' | 'tara' | 'yoni' | 'grahaMaitri' | 'gana' | 'bhakoot' | 'nadi';
  name: { en: string; hi: string; or: string };
  points: number;
  maxPoints: number;
  status: MatchSeverity;
  headline: { en: string; hi: string; or: string };
  detail: { en: string; hi: string; or: string };
  remedy?: { en: string; hi: string; or: string };
}

export interface RajjuVedhaInfo {
  rajjuGroom: { en: string; hi: string; or: string };
  rajjuBride: { en: string; hi: string; or: string };
  rajjuClash: boolean;
  vedhaClash: boolean;
  note: { en: string; hi: string; or: string };
}

export interface GotraInfo {
  gotraGroom: string;
  gotraBride: string;
  sameGotra: boolean;
  note: { en: string; hi: string; or: string };
}

export interface TaraTimingDetail {
  taraGroomFromBride: string;
  taraBrideFromGroom: string;
  note: { en: string; hi: string; or: string };
}

export interface LifeDomainScore {
  key: 'love' | 'marriage' | 'health' | 'wealth' | 'progeny' | 'family' | 'career' | 'spiritual';
  label: { en: string; hi: string; or: string };
  score: number; // 0-100
  note: { en: string; hi: string; or: string };
}

export interface DashaSyncInfo {
  groomDasha: string;
  brideDasha: string;
  friendship: MatchSeverity;
  note: { en: string; hi: string; or: string };
  nextTransitions: { who: 'groom' | 'bride'; date: string; to: string }[];
}

export interface DoshaCheck {
  key: 'mangal' | 'nadi' | 'bhakoot' | 'gana' | 'rajju' | 'vedha' | 'gotra';
  label: { en: string; hi: string; or: string };
  active: boolean;
  cancelled: boolean;
  note: { en: string; hi: string; or: string };
  remedy?: { en: string; hi: string; or: string };
}

export interface MuhurtaGuidance {
  seasonNote: { en: string; hi: string; or: string };
  dashaSandhiWarnings: { en: string; hi: string; or: string }[];
  classicalDates: { en: string; hi: string; or: string };
}

export interface AdvancedMilanResult {
  groomName: string;
  brideName: string;
  groomMoon: { nakshatra: string; nakshatraIndex: number; sign: string; pada: number };
  brideMoon: { nakshatra: string; nakshatraIndex: number; sign: string; pada: number };
  totalScore: number;
  maxScore: 36;
  percentage: number;
  verdict: 'Excellent' | 'Very Good' | 'Average' | 'Not Recommended';
  kootas: ExtendedKootaDetail[];
  rajjuVedha: RajjuVedhaInfo;
  gotra: GotraInfo;
  taraTiming: TaraTimingDetail;
  lifeDomains: LifeDomainScore[];
  dashaSync: DashaSyncInfo;
  doshaChecks: DoshaCheck[];
  compatibilityIndex: number; // 0-100 composite
  remedies: { en: string; hi: string; or: string }[];
  muhurta: MuhurtaGuidance;
}

