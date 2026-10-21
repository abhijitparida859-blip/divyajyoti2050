/**
 * ============================================================================
 *  MANTRA JAPA LIBRARY — DivyaJyoti (Advance Sadhana Engine)
 * ============================================================================
 *  Scalable data model for the world-class Japa Mala feature.
 *
 *  Each mantra carries:
 *   - identity (name in 3 languages, category)
 *   - spiritual metadata (devata / deity, graha / ruling planet)
 *   - practice guidance (best time, recommended repetitions, benefit)
 *   - full text (Sanskrit, transliteration, meaning)
 *   - AUDIO metadata for the 108× auto-repeat engine (audioUrl + trim points)
 *
 *  AUDIO STRATEGY (real & legal):
 *   - Bundle public-domain / CC / self-recorded mantra audio as .mp3 in /public.
 *   - `audioUrl` points to that file; `audioStart`/`audioEnd` are the exact
 *     seconds of ONE mantra cycle so the engine can loop it N times precisely
 *     and drive the mala counter automatically.
 *   - If `audioUrl` is omitted, the UI falls back to manual tap + TTS.
 * ============================================================================
 */

export type MantraCategory = 'beej' | 'suktam' | 'deity' | 'navagraha' | 'stotra';

export interface MantraAudio {
  /** Path under /public (e.g. '/audio/gayatri.mp3'). Omit → manual/TTS mode. */
  url?: string;
  /** Seconds where ONE recitation cycle begins (for precise 108× loop). */
  start?: number;
  /** Seconds where ONE recitation cycle ends (jump back to `start`). */
  end?: number;
  /** Attribution for legal/ethical sourcing. */
  credit?: string;
}

export interface MantraText {
  /** Sanskrit / Odia-script original. */
  original: string;
  /** Roman transliteration (IAST-ish). */
  translit: string;
  /** Meaning (Odia). */
  meaningOr: string;
  /** Meaning (Hindi). */
  meaningHi: string;
  /** Meaning (English). */
  meaningEn: string;
}

export interface Mantra {
  id: string;
  category: MantraCategory;
  name: { or: string; hi: string; en: string };
  /** Presiding deity / devata. */
  devata: { or: string; hi: string; en: string };
  /** Ruling planet (for astrology-based recommendation). Empty for non-graha. */
  graha?: string;
  /** Best time / muhurta to chant (localized). */
  bestTime: { or: string; hi: string; en: string };
  /** Recommended total repetitions for the practice. */
  recommendedCount: number;
  /** Primary benefit / phala (localized). */
  benefit: { or: string; hi: string; en: string };
  /** The actual mantra line(s). */
  text: MantraText;
  /** Audio metadata for the 108× auto-repeat engine. */
  audio?: MantraAudio;
}

/** Human category labels (localized). */
export const CATEGORY_LABELS: Record<MantraCategory, { or: string; hi: string; en: string; emoji: string }> = {
  beej:      { or: 'ବୀଜ ମନ୍ତ୍ର',   hi: 'बीज मंत्र',   en: 'Beej Mantra',   emoji: '🔱' },
  suktam:    { or: 'ସୂକ୍ତଂ',        hi: 'सूक्त',       en: 'Suktam',        emoji: '🕉️' },
  deity:     { or: 'ଦେବତା ମନ୍ତ୍ର', hi: 'देवता मंत्र', en: 'Deity Mantra',  emoji: '🙏' },
  navagraha: { or: 'ନବଗ୍ରହ',       hi: 'नवग्रह',      en: 'Navagraha',     emoji: '🪐' },
  stotra:    { or: 'ସ୍ତୋତ୍ର',       hi: 'स्तोत्र',     en: 'Stotra',        emoji: '📜' },
};
