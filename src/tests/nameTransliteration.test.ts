import { describe, it, expect } from 'vitest';
import { transliterateName, getLocalizedNativeName } from '../localization/nameTransliteration';

describe('transliterateName — Trilingual Name Transliteration Engine', () => {
  it('correctly transliterates Abhijit Parida to authentic Odia & Hindi', () => {
    const res = transliterateName('Abhijit Parida');
    expect(res.en).toBe('Abhijit Parida');
    expect(res.hi).toBe('अभिजीत परिडा');
    expect(res.or).toBe('ଅଭିଜିତ୍ ପରିଡ଼ା');
  });

  it('correctly transliterates classic Odia names and surnames', () => {
    expect(transliterateName('Soumya Ranjan Patnaik')).toEqual({
      en: 'Soumya Ranjan Patnaik',
      hi: 'सौम्य रंजन पट्टनायक',
      or: 'ସୌମ୍ୟ ରଞ୍ଜନ ପଟ୍ଟନାୟକ',
    });

    expect(transliterateName('Priyanka Mishra')).toEqual({
      en: 'Priyanka Mishra',
      hi: 'प्रियंका मिश्रा',
      or: 'ପ୍ରିୟଙ୍କା ମିଶ୍ର',
    });

    expect(transliterateName('Satyajit Mohapatra')).toEqual({
      en: 'Satyajit Mohapatra',
      hi: 'सत्यजीत महापात्र',
      or: 'ସତ୍ୟଜିତ୍ ମହାପାତ୍ର',
    });

    expect(transliterateName('Rashmi Rekha Sahoo')).toEqual({
      en: 'Rashmi Rekha Sahoo',
      hi: 'रश्मि रेखा साहू',
      or: 'ରଶ୍ମି ରେଖା ସାହୁ',
    });

    expect(transliterateName('Subhashree Swain')).toEqual({
      en: 'Subhashree Swain',
      hi: 'शुभश्री स्वांई',
      or: 'ଶୁଭଶ୍ରୀ ସ୍ୱାଇଁ',
    });

    expect(transliterateName('Alok Kumar Dash')).toEqual({
      en: 'Alok Kumar Dash',
      hi: 'आलोक कुमार दाश',
      or: 'ଆଲୋକ କୁମାର ଦାଶ',
    });

    expect(transliterateName('Debasis Rout')).toEqual({
      en: 'Debasis Rout',
      hi: 'देवाशीष राउत',
      or: 'ଦେବାଶିଷ ରାଉତ',
    });
  });

  it('handles titles and honorifics', () => {
    const res = transliterateName('Dr. Subhash Chandra Behera');
    expect(res.or).toContain('ସୁଭାଷ');
    expect(res.or).toContain('ଚନ୍ଦ୍ର');
    expect(res.or).toContain('ବେହେରା');
    expect(res.hi).toContain('सुभाष');
    expect(res.hi).toContain('चंद्र');
    expect(res.hi).toContain('बेहेरा');
  });

  it('passes through if already in Odia or Devanagari script', () => {
    const odiaInput = transliterateName('ଅଭିଜିତ୍ ପରିଡ଼ା');
    expect(odiaInput.or).toBe('ଅଭିଜିତ୍ ପରିଡ଼ା');

    const hindiInput = transliterateName('अभिजीत परिडा');
    expect(hindiInput.hi).toBe('अभिजीत परिडा');
    expect(hindiInput.or).toBe('ଅଭିଜିତ୍ ପରିଡ଼ା');
  });

  it('provides phonetic fallback for unlisted names', () => {
    const res = transliterateName('Tanushree');
    expect(res.hi).toBeTruthy();
    expect(res.or).toBeTruthy();
    expect(res.or).not.toMatch(/[a-zA-Z]/); // Fully converted to Indic script
  });

  it('getLocalizedNativeName delivers exact script according to app language', () => {
    expect(getLocalizedNativeName('Abhijit Parida', 'or')).toBe('ଅଭିଜିତ୍ ପରିଡ଼ା');
    expect(getLocalizedNativeName('Abhijit Parida', 'hi')).toBe('अभिजीत परिडा');
    expect(getLocalizedNativeName('Abhijit Parida', 'en')).toBe('Abhijit Parida');
  });
});
