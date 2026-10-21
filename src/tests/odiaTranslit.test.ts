import { describe, it, expect } from 'vitest';
import { devanagariToOdia, toOdiaScript } from '../localization/odiaTranslit';

describe('devanagariToOdia — authentic Devanagari → Odia transliteration', () => {
  it('converts core Sanskrit/Vedic terms to the canonical Odia forms used in or.json', () => {
    // Each expected value is the exact spelling already present in or.json / Odia panjikas.
    expect(devanagariToOdia('अध्याय')).toBe('ଅଧ୍ୟାୟ');
    expect(devanagariToOdia('सूचीपत्रं')).toBe('ସୂଚୀପତ୍ରଂ');
    expect(devanagariToOdia('पञ्चाङ्ग')).toBe('ପଞ୍ଚାଙ୍ଗ');
    expect(devanagariToOdia('विंशोत्तरी')).toBe('ବିଂଶୋତ୍ତରୀ');
    expect(devanagariToOdia('कुण्डली')).toBe('କୁଣ୍ଡଲୀ');
    expect(devanagariToOdia('लग्न')).toBe('ଲଗ୍ନ');
    expect(devanagariToOdia('जन्मविवरण')).toBe('ଜନ୍ମବିବରଣ');
    expect(devanagariToOdia('ग्रह')).toBe('ଗ୍ରହ');
    expect(devanagariToOdia('राशि')).toBe('ରାଶି');
    expect(devanagariToOdia('योग')).toBe('ଯୋଗ');
    expect(devanagariToOdia('उपचार')).toBe('ଉପଚାର');
    expect(devanagariToOdia('मुहूर्त्त')).toBe('ମୁହୂର୍ତ୍ତ');
    expect(devanagariToOdia('भविष्यफल')).toBe('ଭବିଷ୍ୟଫଲ');
  });

  it('preserves vaktra/conjunct forms (virama → Odia halant)', () => {
    // षड्बल → ଷଡ଼ବଳ (shadbala) — halant before ब becomes ଡ଼୍‌ବ as written in panjikas
    expect(devanagariToOdia('शुभ')).toBe('ଶୁଭ');
    expect(devanagariToOdia('अशुभ')).toBe('ଅଶୁଭ');
    // visarga / anusvara
    expect(devanagariToOdia('नमः')).toBe('ନମଃ');
    expect(devanagariToOdia('अं')).toBe('ଅଂ');
  });

  it('passes through non-Devanagari text (English, Odia, digits, punctuation) unchanged', () => {
    expect(devanagariToOdia('Chapter 5 — Shadbala')).toBe('Chapter 5 — Shadbala');
    expect(devanagariToOdia('ଓଡ଼ିଆ')).toBe('ଓଡ଼ିଆ');
    expect(devanagariToOdia('')).toBe('');
    expect(devanagariToOdia('abc 123 !?')).toBe('abc 123 !?');
  });

  it('handles mixed Devanagari + English strings, converting only the Devanagari run', () => {
    const mixed = devanagariToOdia('अध्याय 1 — Chapter');
    expect(mixed).toBe('ଅଧ୍ୟାୟ 1 — Chapter');
    expect(mixed).not.toMatch(/[\u0900-\u097F]/); // no Devanagari remains
  });

  it('converts Devanagari digits to Odia digits', () => {
    expect(devanagariToOdia('३६५')).toBe('୩୬୫');
    expect(devanagariToOdia('१२०')).toBe('୧୨୦');
  });

  it('toOdiaScript only transliterates when the active language is Odia', () => {
    expect(toOdiaScript('अध्याय', 'hi')).toBe('अध्याय');
    expect(toOdiaScript('अध्याय', 'en')).toBe('अध्याय');
    expect(toOdiaScript('अध्याय', 'or')).toBe('ଅଧ୍ୟାୟ');
  });

  it('never leaves any Devanagari codepoint in the Odia output for a full Vedic sentence', () => {
    const sentence = 'पञ्चस्तरीय विंशोत्तरी दशा एवं फल ३६५ दिन';
    const out = devanagariToOdia(sentence);
    expect(out).not.toMatch(/[\u0900-\u097F]/);
    expect(out.length).toBeGreaterThan(0);
  });
});
