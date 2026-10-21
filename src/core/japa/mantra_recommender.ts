// ============================================================================
//  SMART MANTRA RECOMMENDATION ENGINE — v2 (calendar-native, REAL astro data)
// ============================================================================
//  Signals (all REAL, same-day panchanga data — no guessing, no placeholders):
//   1. VARA-LORD ......... today's weekday lord  (Ravivara→Surya, Shanivara→Shani…)
//   2. CHANDRA NAKSHATRA .. today's Moon nakshatra → its Vimshottari lord
//                          (same VIMSHOTTARI_LORDS sequence as janma_panchanga)
//   3. HORA-LORD ......... currently-running planetary hora lord
//
//  Each recommendation carries a human reason (trilingual) so the user knows
//  WHY this mantra is suggested today.
// ============================================================================

import { Mantra } from './mantra_types';
import { MANTRA_LIBRARY } from './mantra_library';
import { PlanetName } from '../../types/jataka';

// Vimshottari sequence — Ashwini(0)=Ketu … Revati(26) → nakIndex % 9
// (identical order to janma_panchanga_engine.ts VIMSHOTTARI_LORDS)
const VIMSHOTTARI_LORDS: PlanetName[] = [
  'Ketu', 'Shukra', 'Surya', 'Chandra', 'Mangala',
  'Rahu', 'Guru', 'Shani', 'Budha',
];

/** Ashwini(0) … Revati(26) → Vimshottari lord. */
export function nakshatraLord(nakshatraIndex: number): PlanetName {
  const i = ((Math.floor(nakshatraIndex) % 9) + 9) % 9;
  return VIMSHOTTARI_LORDS[i];
}

// JS getDay(): 0=Sun … 6=Sat → ruling graha
const VARA_LORDS: PlanetName[] = [
  'Surya', 'Chandra', 'Mangala', 'Budha', 'Guru', 'Shukra', 'Shani',
];

/** Sunday→Surya, Monday→Chandra, … Saturday→Shani. */
export function varaLord(date: Date): PlanetName {
  return VARA_LORDS[date.getDay() % 7];
}

// Hora planetKey (lowercase, 7 classical — no Rahu/Ketu in hora chakra)
const HORA_TO_GRAHA: Record<string, PlanetName> = {
  sun: 'Surya', moon: 'Chandra', mars: 'Mangala', mercury: 'Budha',
  jupiter: 'Guru', venus: 'Shukra', saturn: 'Shani',
};

export function horaLord(planetKey: string): PlanetName | undefined {
  return HORA_TO_GRAHA[planetKey?.toLowerCase()];
}

export interface TodayAstroSignals {
  /** 0=Sun … 6=Sat */
  weekdayIdx: number;
  /** 0=Ashwini … 26=Revati (already computed by panjika/navagraha sputa) */
  moonNakshatraIndex: number;
  moonNakshatraName: { or: string; hi: string; en: string };
  /** 'sun' | 'moon' | 'mars' | 'mercury' | 'jupiter' | 'venus' | 'saturn' */
  horaPlanetKey?: string;
  horaPlanetName: { or: string; hi: string; en: string };
}

export interface MantraRecommendation {
  mantra: Mantra;
  reason: { or: string; hi: string; en: string };
  kind: 'vara' | 'nakshatra' | 'hora';
  priority: number; // 1 = highest
}

const findGrahaMantra = (planet: PlanetName): Mantra | undefined =>
  MANTRA_LIBRARY.find(m => m.graha === planet);

/**
 * Recommend mantras for TODAY from live panchanga signals.
 * Default weekday = new Date().getDay() when not supplied.
 */
export function recommendMantrasForToday(sig: TodayAstroSignals): MantraRecommendation[] {
  const now = new Date();
  const vara = varaLord(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
  // (weekdayIdx override kept for server-render/day-preview use)
  const varaPlanet: PlanetName = VARA_LORDS[(sig.weekdayIdx ?? now.getDay()) % 7] ?? vara;
  const nakLord = nakshatraLord(sig.moonNakshatraIndex);
  const hora = sig.horaPlanetKey ? horaLord(sig.horaPlanetKey) : undefined;

  const recs: MantraRecommendation[] = [];
  const seen = new Set<string>();

  const push = (
    mantra: Mantra | undefined,
    reason: MantraRecommendation['reason'],
    kind: MantraRecommendation['kind'],
  ) => {
    if (!mantra || seen.has(mantra.id)) return;
    seen.add(mantra.id);
    recs.push({ mantra, reason, kind, priority: recs.length + 1 });
  };

  // 1) CHANDRA NAKSHATRA LORD — the day's strongest personal signal
  push(findGrahaMantra(nakLord), {
    or: `ଆଜି ଚନ୍ଦ୍ର ${sig.moonNakshatraName.or} ନକ୍ଷତ୍ରରେ — ସ୍ୱାମୀ ${nakLord}, ତେଣୁ ଏହାର ମନ୍ତ୍ର ଆଜି ବିଶେଷ ଫଳଦାୟୀ।`,
    hi: `आज चंद्र ${sig.moonNakshatraName.hi} नक्षत्र में — स्वामी ${nakLord}, इसलिए इसका मंत्र आज विशेष फलदायी।`,
    en: `Today the Moon is in ${sig.moonNakshatraName.en} — ruled by ${nakLord}, so its mantra is especially potent today.`,
  }, 'nakshatra');

  // 2) VARA-LORD — the day's presiding graha
  push(findGrahaMantra(varaPlanet), {
    or: `ଆଜିର ବାର-ଅଧିପତି ${varaPlanet} — ଦିନର ଶୁଭଫଳ ପାଇଁ ଏହାର ମନ୍ତ୍ର ଜପ କରନ୍ତୁ।`,
    hi: `आज के वार-अधिपति ${varaPlanet} — दिन के शुभफल हेतु इसका मंत्र जपें।`,
    en: `Today is ruled by ${varaPlanet} — chant its mantra for the day's blessings.`,
  }, 'vara');

  // 3) HORA-LORD — the currently-running planetary hour
  if (hora) {
    push(findGrahaMantra(hora), {
      or: `ବର୍ତ୍ତମାନ ${sig.horaPlanetName.or} ହୋରା ଚାଲିଛି — ଏହି ମୁହୂର୍ତ୍ତରେ ${hora} ମନ୍ତ୍ର ଉତ୍ତମ।`,
      hi: `वर्तमान ${sig.horaPlanetName.hi} होरा चल रही — इस मुहूर्त में ${hora} मंत्र उत्तम।`,
      en: `The ${sig.horaPlanetName.en} hora is running now — ${hora}'s mantra is ideal in this moment.`,
    }, 'hora');
  }

  // Fallback — should never trigger, but guarantees a non-empty list
  if (recs.length === 0) {
    const gayatri = MANTRA_LIBRARY.find(m => m.id === 'suktam-gayatri');
    if (gayatri) {
      push(gayatri, {
        or: 'ସାର୍ବଜନୀନ କଲ୍ୟାଣକାରୀ ଗାୟତ୍ରୀ ମନ୍ତ୍ର।',
        hi: 'सार्वजनिक कल्याणकारी गायत्री मंत्र।',
        en: 'The universally beneficial Gayatri mantra.',
      }, 'vara');
    }
  }

  return recs;
}
