import { describe, it, expect } from 'vitest';
import { devanagariToOdia } from '../localization/odiaTranslit';

/**
 * The OdiaScriptGuard walks every rendered text node and runs devanagariToOdia
 * on it when the active language is Odia. These tests assert the exact contract
 * the guard relies on: any hard-coded Devanagari fragment that survives in JSX
 * is converted to Odia script, while English/Odia/digits are untouched.
 */
describe('OdiaScriptGuard — DOM text-node conversion contract', () => {
  it('converts the sacred book headings embedded directly in JSX', () => {
    // Verbatim literals from KundaliPrintView.tsx chapter headings.
    expect(devanagariToOdia('अध्याय')).toBe('ଅଧ୍ୟାୟ');
    expect(devanagariToOdia('सूचीपत्रं')).toBe('ସୂଚୀପତ୍ରଂ');
    expect(devanagariToOdia('जन्म पञ्चाङ्ग')).toBe('ଜନ୍ମ ପଞ୍ଚାଙ୍ଗ');
    expect(devanagariToOdia('ग्रह बल')).toBe('ଗ୍ରହ ବଲ');
    expect(devanagariToOdia('वार्षिक भविष्यफल')).toBe('ବାର୍ଷିକ ଭବିଷ୍ୟଫଲ');
  });

  it('leaves a pure-Odia node unchanged (idempotent — no double conversion)', () => {
    const once = devanagariToOdia('अध्याय');
    expect(devanagariToOdia(once)).toBe(once); // re-running on Odia is a no-op
  });

  it('converts mixed Devanagari + English, preserving the English part', () => {
    // e.g. "अध्याय ५ — Chapter 5" style JSX fragments.
    expect(devanagariToOdia('अध्याय — Chapter')).toBe('ଅଧ୍ୟାୟ — Chapter');
    expect(devanagariToOdia('तिथि 5 — Tithi')).toBe('ତିଥି 5 — Tithi');
  });

  it('converts Devanagari digits to Odia digits (so numbers stay in-script)', () => {
    expect(devanagariToOdia('३३७')).toBe('୩୩୭');
    expect(devanagariToOdia('३६५')).toBe('୩୬୫');
  });

  it('never emits a Devanagari codepoint for any Devanagari input (guard guarantee)', () => {
    const samples = [
      'षड्बल', 'विंशोत्तरी', 'कुण्डली', 'योग', 'दोष', 'उपचार', 'मुहूर्त्त',
      'राशि', 'ग्रह', 'नक्षत्र', 'लग्न', 'भाव', 'दशा', 'अष्टकवर्ग',
    ];
    const DEV = /[\u0900-\u097F]/;
    for (const s of samples) {
      expect(DEV.test(devanagariToOdia(s))).toBe(false);
    }
  });
});
