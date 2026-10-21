/**
 * Authentic Devanagari → Odia transliterator.
 *
 * Odia panjikas and Sanskrit texts in Odisha are written in the Odia script, so
 * every Devanagari (Sanskrit) word has a one-to-one Odia representation. This
 * module converts any Devanagari string into that canonical Odia form using the
 * same orthographic conventions already used across `or.json` (verified against
 * words like पञ्चाङ्ग → ପଞ୍ଚାଙ୍ଗ, अध्याय → ଅଧ୍ୟାୟ, विंशोत्तरी → ବିଂଶୋତ୍ତରୀ).
 *
 * It is used as a safety net by the i18n layer so that hard-coded Devanagari
 * strings render in the Odia script whenever the user picks Odia.
 */

// Independent vowels
const VOWELS: Record<string, string> = {
  'अ': 'ଅ', 'आ': 'ଆ', 'इ': 'ଇ', 'ई': 'ଈ', 'उ': 'ଉ', 'ऊ': 'ଊ',
  'ऋ': 'ଋ', 'ॠ': 'ୠ', 'ऌ': 'ଌ', 'ए': 'ଏ', 'ऐ': 'ଐ', 'ओ': 'ଓ', 'औ': 'ଔ',
};

// Consonants
const CONSONANTS: Record<string, string> = {
  'क': 'କ', 'ख': 'ଖ', 'ग': 'ଗ', 'घ': 'ଘ', 'ङ': 'ଙ',
  'च': 'ଚ', 'छ': 'ଛ', 'ज': 'ଜ', 'झ': 'ଝ', 'ञ': 'ଞ',
  'ट': 'ଟ', 'ठ': 'ଠ', 'ड': 'ଡ', 'ढ': 'ଢ', 'ण': 'ଣ',
  'त': 'ତ', 'थ': 'ଥ', 'द': 'ଦ', 'ध': 'ଧ', 'न': 'ନ',
  'प': 'ପ', 'फ': 'ଫ', 'ब': 'ବ', 'भ': 'ଭ', 'म': 'ମ',
  'य': 'ଯ', 'र': 'ର', 'ल': 'ଲ', 'ळ': 'ଳ',
  'श': 'ଶ', 'ष': 'ଷ', 'स': 'ସ', 'ह': 'ହ',
  // व handled separately (conjunct → ୱ, otherwise ବ)
};

// Vowel signs (matras)
const MATRAS: Record<string, string> = {
  'ा': 'ା', 'ि': 'ି', 'ी': 'ୀ', 'ु': 'ୁ', 'ू': 'ୂ', 'ृ': 'ୃ', 'ॄ': 'ୄ',
  'े': 'େ', 'ै': 'ୈ', 'ो': 'ୋ', 'ौ': 'ୌ',
};

const VIRAMA = '्';
const ODIA_VIRAMA = '୍';
const ODIA_NUKTA = '଼';

// Devanagari code-point ranges
function isDevanagari(ch: string): boolean {
  const c = ch.charCodeAt(0);
  return c >= 0x0900 && c <= 0x097f;
}

function containsDevanagari(s: string): boolean {
  for (const ch of s) if (isDevanagari(ch)) return true;
  return false;
}

/**
 * Transliterate a single Devanagari run into Odia script.
 * Non-Devanagari characters (English, Odia, digits, punctuation) pass through.
 */
export function devanagariToOdia(input: string): string {
  if (!input || !containsDevanagari(input)) return input;

  let out = '';
  const chars = Array.from(input);

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];

    // Vowels
    if (VOWELS[ch]) { out += VOWELS[ch]; continue; }

    // Matras (dependent vowel signs)
    if (MATRAS[ch]) { out += MATRAS[ch]; continue; }

    // Virama (halant)
    if (ch === VIRAMA) { out += ODIA_VIRAMA; continue; }

    // Anusvara / chandrabindu / visarga / avagraha / nukta
    if (ch === 'ं') { out += 'ଂ'; continue; }
    if (ch === 'ँ') { out += 'ଁ'; continue; }
    if (ch === 'ः') { out += 'ଃ'; continue; }
    if (ch === 'ऽ') { out += 'ଽ'; continue; }
    if (ch === '़') { out += ODIA_NUKTA; continue; }

    // Devanagari digits → Odia digits
    const d = ch.charCodeAt(0);
    if (d >= 0x0966 && d <= 0x096f) {
      out += String.fromCharCode(0x0b66 + (d - 0x0966));
      continue;
    }

    // य (ya): at word-start (or after a space / independent vowel) it is the base
    // letter ଯ (U+0B2F, e.g. योग→ଯୋଗ); mid-word — after a consonant, matra,
    // virama or anusvara — it is the ya-phala ୟ (U+0B5F, e.g. अध्याय→ଅଧ୍ୟାୟ,
    // सूर्य→ସୂର୍ଯ୍ୟ). Mirrors the convention used across or.json.
    if (ch === 'य') {
      const prev = i > 0 ? chars[i - 1] : '';
      const midWord =
        !!prev &&
        (!!CONSONANTS[prev] || !!MATRAS[prev] || prev === VIRAMA ||
          prev === 'ं' || prev === 'ँ' || prev === 'ः' || prev === '़');
      out += midWord ? 'ୟ' : 'ଯ';
      continue;
    }

    // व (va): after a virama (conjunct) it is the "wa" ୱ, otherwise it is ବ.
    if (ch === 'व') {
      out += out.endsWith(ODIA_VIRAMA) ? 'ୱ' : 'ବ';
      continue;
    }

    // Consonants
    if (CONSONANTS[ch]) { out += CONSONANTS[ch]; continue; }

    // Danda / double danda → Odia punctuation
    if (ch === '।') { out += '।'; continue; }
    if (ch === '॥') { out += '॥'; continue; }

    // Anything else (Latin, Odia, spaces, punctuation) passes through unchanged
    out += ch;
  }

  return out;
}

/**
 * Convenience: transliterate only when Odia is the active language, otherwise
 * return the string untouched. Used as a render-time safety net.
 */
export function toOdiaScript(text: string, language: 'en' | 'hi' | 'or'): string {
  if (language !== 'or') return text;
  return devanagariToOdia(text);
}
