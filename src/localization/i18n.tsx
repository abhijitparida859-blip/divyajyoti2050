import React, { createContext, useContext, useState, useEffect } from 'react';
import en from './en.json';
import hi from './hi.json';
import or from './or.json';
import { devanagariToOdia } from './odiaTranslit';

export type Language = 'en' | 'hi' | 'or';

const translations: Record<Language, Record<string, string>> = {
  en,
  hi,
  or
};

/**
 * Safety net: whenever the active language is Odia, guarantee that no Devanagari
 * codepoint survives in the output. Any hard-coded Devanagari (Sanskrit) string
 * that reaches this helper is transliterated into its canonical Odia form so the
 * user never sees a Hindi/Devanagari fragment while browsing in Odia.
 */
export function ensureOdiaScript(lang: Language, text: string): string {
  if (lang !== 'or' || !text) return text;
  return devanagariToOdia(text);
}

export function localize(
  lang: Language,
  texts: { or: string; hi?: string; en: string }
): string {
  let result: string;
  if (lang === 'or') result = texts.or;
  else if (lang === 'hi') result = texts.hi || texts.en;
  else result = texts.en;
  return ensureOdiaScript(lang, result);
}

const DEV_NUMERALS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
const ODIA_NUMERALS = ['୦', '୧', '୨', '୩', '୪', '୫', '୬', '୭', '୮', '୯'];

export const RASHI_MAP: Record<string, Record<Language, string>> = {
  'Mesha': { en: 'Mesha (Aries)', hi: 'मेष राशि', or: 'ମେଷ ରାଶି' },
  'Vrishabha': { en: 'Vrishabha (Taurus)', hi: 'वृषभ राशि', or: 'ବୃଷ ରାଶି' },
  'Mithuna': { en: 'Mithuna (Gemini)', hi: 'मिथुन राशि', or: 'ମିଥୁନ ରାଶି' },
  'Karka': { en: 'Karka (Cancer)', hi: 'कर्क राशि', or: 'କର୍କଟ ରାଶି' },
  'Simha': { en: 'Simha (Leo)', hi: 'सिंह राशि', or: 'ସିଂହ ରାଶି' },
  'Kanya': { en: 'Kanya (Virgo)', hi: 'कन्या राशि', or: 'କନ୍ୟା ରାଶି' },
  'Tula': { en: 'Tula (Libra)', hi: 'तुला राशि', or: 'ତୁଳା ରାଶି' },
  'Vrischika': { en: 'Vrischika (Scorpio)', hi: 'वृश्चिक राशि', or: 'ବିଛା ରାଶି' },
  'Dhanu': { en: 'Dhanu (Sagittarius)', hi: 'धनु राशि', or: 'ଧନୁ ରାଶି' },
  'Makara': { en: 'Makara (Capricorn)', hi: 'मकर राशि', or: 'ମକର ରାଶି' },
  'Kumbha': { en: 'Kumbha (Aquarius)', hi: 'कुम्भ राशि', or: 'କୁମ୍ଭ ରାଶି' },
  'Meena': { en: 'Meena (Pisces)', hi: 'मीन राशि', or: 'ମୀନ ରାଶି' },
};

export const GRAHA_MAP: Record<string, Record<Language, string>> = {
  'Surya': { en: 'Sun (Surya)', hi: 'सूर्य देव', or: 'ସୂର୍ଯ୍ୟ ଦେବ' },
  'Chandra': { en: 'Moon (Chandra)', hi: 'चन्द्र देव', or: 'ଚନ୍ଦ୍ର ଦେବ' },
  'Mangala': { en: 'Mars (Mangala)', hi: 'मंगल ग्रह', or: 'ମଙ୍ଗଳ ଗ୍ରହ' },
  'Budha': { en: 'Mercury (Budha)', hi: 'बुध ग्रह', or: 'ବୁଧ ଗ୍ରହ' },
  'Guru': { en: 'Jupiter (Guru)', hi: 'बृहस्पति (गुरु)', or: 'ଗୁରୁ ଦେବ' },
  'Shukra': { en: 'Venus (Shukra)', hi: 'शुक्र ग्रह', or: 'ଶୁକ୍ର ଗ୍ରହ' },
  'Shani': { en: 'Saturn (Shani)', hi: 'शनि देव', or: 'ଶନି ଦେବ' },
  'Rahu': { en: 'Rahu (North Node)', hi: 'राहु', or: 'ରାହୁ' },
  'Ketu': { en: 'Ketu (South Node)', hi: 'केतु', or: 'କେତୁ' },
};

export const NAKSHATRA_MAP: Record<string, Record<Language, string>> = {
  'Ashwini': { en: 'Ashwini', hi: 'अश्विनी', or: 'ଅଶ୍ୱିନୀ' },
  'Bharani': { en: 'Bharani', hi: 'भरणी', or: 'ଭରଣୀ' },
  'Krittika': { en: 'Krittika', hi: 'कृत्तिका', or: 'କୃତ୍ତିକା' },
  'Rohini': { en: 'Rohini', hi: 'रोहिणी', or: 'ରୋହିଣୀ' },
  'Mrigashira': { en: 'Mrigashira', hi: 'मृगशिरा', or: 'ମୃଗଶିରା' },
  'Ardra': { en: 'Ardra', hi: 'आर्द्रा', or: 'ଆର୍ଦ୍ରା' },
  'Punarvasu': { en: 'Punarvasu', hi: 'पुनर्वसु', or: 'ପୁନର୍ବସୁ' },
  'Pushya': { en: 'Pushya', hi: 'पुष्य', or: 'ପୁଷ୍ୟା' },
  'Ashlesha': { en: 'Ashlesha', hi: 'अश्लेषा', or: 'ଅଶ୍ଳେଷା' },
  'Magha': { en: 'Magha', hi: 'मघा', or: 'ମଘା' },
  'Purva Phalguni': { en: 'Purva Phalguni', hi: 'पूर्वाफाल्गुनी', or: 'ପୂର୍ବ ଫାଲ୍ଗୁନୀ' },
  'Uttara Phalguni': { en: 'Uttara Phalguni', hi: 'उत्तराफाल्गुनी', or: 'ଉତ୍ତର ଫାଲ୍ଗୁନୀ' },
  'Hasta': { en: 'Hasta', hi: 'हस्त', or: 'ହସ୍ତା' },
  'Chitra': { en: 'Chitra', hi: 'चित्रा', or: 'ଚିତ୍ରା' },
  'Swati': { en: 'Swati', hi: 'स्वाती', or: 'ସ୍ୱାତୀ' },
  'Vishakha': { en: 'Vishakha', hi: 'विशाखा', or: 'ବିଶାଖା' },
  'Anuradha': { en: 'Anuradha', hi: 'अनुराधा', or: 'ଅନୁରାଧା' },
  'Jyeshtha': { en: 'Jyeshtha', hi: 'ज्येष्ठा', or: 'ଜ୍ୟେଷ୍ଠା' },
  'Mula': { en: 'Mula', hi: 'मूल', or: 'ମୂଳା' },
  'Purva Ashadha': { en: 'Purva Ashadha', hi: 'पूर्वाषाढ़ा', or: 'ପୂର୍ବାଷାଢ଼ା' },
  'Uttara Ashadha': { en: 'Uttara Ashadha', hi: 'उत्तराषाढ़ा', or: 'ଉତ୍ତରାଷାଢ଼ା' },
  'Shravana': { en: 'Shravana', hi: 'श्रवण', or: 'ଶ୍ରବଣା' },
  'Dhanishta': { en: 'Dhanishta', hi: 'धनिष्ठा', or: 'ଧନିଷ୍ଠା' },
  'Shatabhisha': { en: 'Shatabhisha', hi: 'शतभिषा', or: 'ଶତଭିଷା' },
  'Purva Bhadrapada': { en: 'Purva Bhadrapada', hi: 'पूर्वभाद्रपद', or: 'ପୂର୍ବଭାଦ୍ରପଦ' },
  'Uttara Bhadrapada': { en: 'Uttara Bhadrapada', hi: 'उत्तरभाद्रपद', or: 'ଉତ୍ତରଭାଦ୍ରପଦ' },
  'Revati': { en: 'Revati', hi: 'रेवती', or: 'ରେବତୀ' },
};

export const YOGA_MAP: Record<string, Record<Language, string>> = {
  'Vishkambha': { en: 'Vishkambha', hi: 'विष्कम्भ योग', or: 'ବିଷ୍କମ୍ଭ ଯୋଗ' },
  'Priti': { en: 'Priti', hi: 'प्रीति योग', or: 'ପ୍ରୀତି ଯୋଗ' },
  'Ayushman': { en: 'Ayushman', hi: 'आयुष्मान योग', or: 'ଆୟୁଷ୍ମାନ ଯୋଗ' },
  'Saubhagya': { en: 'Saubhagya', hi: 'सौभाग्य योग', or: 'ସୌଭାଗ୍ୟ ଯୋଗ' },
  'Shobhana': { en: 'Shobhana', hi: 'शोभन योग', or: 'ଶୋଭନ ଯୋଗ' },
  'Atiganda': { en: 'Atiganda', hi: 'अतिगण्ड योग', or: 'ଅତିଗଣ୍ଡ ଯୋଗ' },
  'Sukarma': { en: 'Sukarma', hi: 'सुकर्मा योग', or: 'ସୁକର୍ମା ଯୋଗ' },
  'Dhriti': { en: 'Dhriti', hi: 'धृति योग', or: 'ଧୃତି ଯୋଗ' },
  'Shoola': { en: 'Shoola', hi: 'शूल योग', or: 'ଶୂଳ ଯୋଗ' },
  'Ganda': { en: 'Ganda', hi: 'गण्ड योग', or: 'ଗଣ୍ଡ ଯୋଗ' },
  'Vriddhi': { en: 'Vriddhi', hi: 'वृद्धि योग', or: 'ବୃଦ୍ଧି ଯୋଗ' },
  'Dhruva': { en: 'Dhruva', hi: 'ध्रुव योग', or: 'ଧ୍ରୁବ ଯୋଗ' },
  'Vyaghata': { en: 'Vyaghata', hi: 'व्याघात योग', or: 'ବ୍ୟାଘାତ ଯୋଗ' },
  'Harshana': { en: 'Harshana', hi: 'हर्षण योग', or: 'ହର୍ଷଣ ଯୋଗ' },
  'Vajra': { en: 'Vajra', hi: 'वज्र योग', or: 'ବଜ୍ର ଯୋଗ' },
  'Siddhi': { en: 'Siddhi', hi: 'सिद्धि योग', or: 'ସିଦ୍ଧି ଯୋଗ' },
  'Vyatipata': { en: 'Vyatipata', hi: 'व्यतीपात योग', or: 'ବ୍ୟତୀପାତ ଯୋଗ' },
  'Variyan': { en: 'Variyan', hi: 'वरीयान योग', or: 'ବରୀୟାନ ଯୋଗ' },
  'Parigha': { en: 'Parigha', hi: 'परिघ योग', or: 'ପରିଘ ଯୋଗ' },
  'Shiva': { en: 'Shiva', hi: 'शिव योग', or: 'ଶିବ ଯୋଗ' },
  'Siddha': { en: 'Siddha', hi: 'सिद्ध योग', or: 'ସିଦ୍ଧ ଯୋଗ' },
  'Sadhya': { en: 'Sadhya', hi: 'साध्य योग', or: 'ସାଧ୍ୟ ଯୋଗ' },
  'Shubha': { en: 'Shubha', hi: 'शुभ योग', or: 'ଶୁଭ ଯୋଗ' },
  'Shukla': { en: 'Shukla', hi: 'शुक्ल योग', or: 'ଶୁକ୍ଳ ଯୋଗ' },
  'Brahma': { en: 'Brahma', hi: 'ब्रह्म योग', or: 'ବ୍ରହ୍ମ ଯୋଗ' },
  'Indra': { en: 'Indra', hi: 'इन्द्र योग', or: 'ଇନ୍ଦ୍ର ଯୋଗ' },
  'Vaidhriti': { en: 'Vaidhriti', hi: 'वैधृति योग', or: 'ବୈଧୃତି ଯୋଗ' },
};

export const KARANA_MAP: Record<string, Record<Language, string>> = {
  'Bava': { en: 'Bava', hi: 'बव', or: 'ବବ' },
  'Balava': { en: 'Balava', hi: 'बालव', or: 'ବାଳବ' },
  'Kaulava': { en: 'Kaulava', hi: 'कौलव', or: 'କୌଳବ' },
  'Taitila': { en: 'Taitila', hi: 'तैतिल', or: 'ତୈତିଳ' },
  'Gara': { en: 'Gara', hi: 'गर', or: 'ଗର' },
  'Vanija': { en: 'Vanija', hi: 'वणिज', or: 'ବଣିଜ' },
  'Vishti': { en: 'Vishti (Bhadra)', hi: 'विष्टि (भद्रा)', or: 'ବିଷ୍ଟି (ଭଦ୍ରା)' },
  'Shakuni': { en: 'Shakuni', hi: 'शकुनि', or: 'ଶକୁନି' },
  'Chatushpada': { en: 'Chatushpada', hi: 'चतुष्पद', or: 'ଚତୁଷ୍ପଦ' },
  'Naga': { en: 'Naga', hi: 'नाग', or: 'ନାଗ' },
  'Kintughna': { en: 'Kintughna', hi: 'किंस्तुघ्न', or: 'କିଂସ୍ତୁଘ୍ନ' },
};

export const VAARA_MAP: Record<string, Record<Language, string>> = {
  'Ravivara': { en: 'Sunday (Ravivara)', hi: 'रविवार', or: 'ରବିବାର' },
  'Somavara': { en: 'Monday (Somavara)', hi: 'सोमवार', or: 'ସୋମବାର' },
  'Mangalavara': { en: 'Tuesday (Mangalavara)', hi: 'मंगलवार', or: 'ମଙ୍ଗଳବାର' },
  'Budhavara': { en: 'Wednesday (Budhavara)', hi: 'बुधवार', or: 'ବୁଧବାର' },
  'Guruvara': { en: 'Thursday (Guruvara)', hi: 'गुरुवार', or: 'ଗୁରୁବାର' },
  'Shukravara': { en: 'Friday (Shukravara)', hi: 'शुक्रवार', or: 'ଶୁକ୍ରବାର' },
  'Shanivara': { en: 'Saturday (Shanivara)', hi: 'शनिवार', or: 'ଶନିବାର' },
};

export const TITHI_NAME_MAP: Record<string, Record<Language, string>> = {
  'Pratipada': { en: 'Pratipada', hi: 'प्रतिपदा', or: 'ପ୍ରତିପଦା' },
  'Dwitiya': { en: 'Dwitiya', hi: 'द्वितीया', or: 'ଦ୍ୱିତୀୟା' },
  'Tritiya': { en: 'Tritiya', hi: 'तृतीया', or: 'ତୃତୀୟା' },
  'Chaturthi': { en: 'Chaturthi', hi: 'चतुर्थी', or: 'ଚତୁର୍ଥୀ' },
  'Panchami': { en: 'Panchami', hi: 'पञ्चमी', or: 'ପଞ୍ଚମୀ' },
  'Shashthi': { en: 'Shashthi', hi: 'षष्ठी', or: 'ଷଷ୍ଠୀ' },
  'Saptami': { en: 'Saptami', hi: 'सप्तमी', or: 'ସପ୍ତମୀ' },
  'Ashtami': { en: 'Ashtami', hi: 'अष्टमी', or: 'ଅଷ୍ଟମୀ' },
  'Navami': { en: 'Navami', hi: 'नवमी', or: 'ନବମୀ' },
  'Dashami': { en: 'Dashami', hi: 'दशमी', or: 'ଦଶମୀ' },
  'Ekadashi': { en: 'Ekadashi', hi: 'एकादशी', or: 'ଏକାଦଶୀ' },
  'Dwadashi': { en: 'Dwadashi', hi: 'द्वादशी', or: 'ଦ୍ୱାଦଶୀ' },
  'Trayodashi': { en: 'Trayodashi', hi: 'त्रयोदशी', or: 'ତ୍ରୟୋଦଶୀ' },
  'Chaturdashi': { en: 'Chaturdashi', hi: 'चतुर्दशी', or: 'ଚତୁର୍ଦ୍ଦଶୀ' },
  'Purnima': { en: 'Purnima', hi: 'पूर्णिमा', or: 'ପୂର୍ଣ୍ଣିମା' },
  'Amavasya': { en: 'Amavasya', hi: 'अमावस्या', or: 'ଅମାବାସ୍ୟା' },
};

export const DIGNITY_MAP: Record<string, Record<Language, string>> = {
  'Exalted': { en: 'Exalted (Uccha)', hi: 'उच्च', or: 'ଉଚ୍ଚ' },
  'Own': { en: 'Own Sign (Swakshetra)', hi: 'स्वक्षेत्री', or: 'ସ୍ୱକ୍ଷେତ୍ରୀ' },
  'Friendly': { en: 'Friendly (Mitra)', hi: 'मित्र', or: 'ମିତ୍ର' },
  'Neutral': { en: 'Neutral (Sama)', hi: 'सम', or: 'ସମ' },
  'Enemy': { en: 'Enemy (Shatru)', hi: 'शत्रु', or: 'ଶତ୍ରୁ' },
  'Debilitated': { en: 'Debilitated (Neecha)', hi: 'नीच', or: 'ନୀଚ' },
};

export const KOOTA_MAP: Record<string, Record<Language, string>> = {
  'Varna': { en: 'Varna (Spiritual Ego)', hi: 'वर्ण (आध्यात्मिक स्तर)', or: 'ବର୍ଣ୍ଣ (ଅହଂ ସନ୍ତୁଳନ)' },
  'Vashya': { en: 'Vashya (Mutual Attraction)', hi: 'वश्य (परस्पर आकर्षण)', or: 'ବଶ୍ୟ (ପାରସ୍ପରିକ ଆକର୍ଷଣ)' },
  'Tara': { en: 'Tara (Health & Destiny)', hi: 'तारा (भाग्य एवं स्वास्थ्य)', or: 'ତାରା (ସ୍ୱାସ୍ଥ୍ୟ ଓ ଭାଗ୍ୟ)' },
  'Yoni': { en: 'Yoni (Intimacy & Biology)', hi: 'योनि (जैविक सामंजस्य)', or: 'ଯୋନି (ଦାମ୍ପତ୍ୟ ସୁଖ)' },
  'Graha Maitri': { en: 'Graha Maitri (Psychological Sync)', hi: 'ग्रह मैत्री (मानसिक मित्रता)', or: 'ଗ୍ରହ ମୈତ୍ରୀ (ମାନସିକ ମେଳ)' },
  'Gana': { en: 'Gana (Temperament)', hi: 'गण (स्वभाव)', or: 'ଗଣ (ସ୍ୱଭାବ ମେଳ)' },
  'Bhakoot': { en: 'Bhakoot (Emotional Wealth)', hi: 'भकूट (पारिवारिक सुख)', or: 'ଭକୂଟ (ପାରିବାରିକ ସମୃଦ୍ଧି)' },
  'Nadi': { en: 'Nadi (Genetic Harmony)', hi: 'नाड़ी (अनुवांशिक संतुलन)', or: 'ନାଡ଼ି (ବଂଶ ବୃଦ୍ଧି ଓ ସ୍ୱାସ୍ଥ୍ୟ)' },
};

export const VERDICT_MAP: Record<string, Record<Language, string>> = {
  'Excellent': { en: 'Excellent', hi: 'अति उत्तम', or: 'ଅତି ଉତ୍ତମ' },
  'Very Good': { en: 'Very Good', hi: 'उत्तम', or: 'ଉତ୍ତମ' },
  'Average': { en: 'Average', hi: 'मध्यम', or: 'ମଧ୍ୟମ' },
  'Not Recommended': { en: 'Not Recommended', hi: 'अशुभ / वर्जित', or: 'ଅଶୁଭ / ଅନୁପଯୁକ୍ତ' },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  tRashi: (rashi: string) => string;
  tGraha: (graha: string) => string;
  tNakshatra: (nak: string) => string;
  tYoga: (yoga: string) => string;
  tKarana: (karana: string) => string;
  tKaranaType: (type: 'chara' | 'sthira') => string;
  tVaara: (vaara: string) => string;
  tTithiFromKey: (tithiRawKey: string) => string;
  tDignity: (dignity: string) => string;
  tKoota: (koota: string) => string;
  tVerdict: (verdict: string) => string;
  tO: (text: string) => string;
  formatNumber: (num: number | string) => string;
  formatTime: (timeStr: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

/**
 * Global render-time safety net for Odia mode.
 *
 * Many views embed sacred Sanskrit terms directly in JSX as Devanagari
 * literals (e.g. अध्याय, षड्बल, तिथि). Rather than editing thousands of
 * hard-coded characters across ~30 components — which is error-prone and
 * would not cover future strings — this guard walks the live DOM whenever the
 * Odia language is active and transliterates any surviving Devanagari text
 * node into its canonical Odia script. It uses a MutationObserver so that
 * dynamically rendered content (dasha timelines, 365-day tables, charts) is
 * converted too. It is a no-op in English/Hindi mode.
 */
const OdiaScriptGuard: React.FC<{ language: Language }> = ({ language }) => {
  useEffect(() => {
    if (language !== 'or') return;
    if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') return;

    const isSkippable = (el: Element | null): boolean => {
      if (!el) return true;
      const tag = el.tagName.toLowerCase();
      return tag === 'script' || tag === 'style' || tag === 'textarea' || tag === 'code';
    };

    const convertTextNode = (node: Text) => {
      if (!node.nodeValue) return;
      // Skip nodes inside inputs/scripts/styles.
      if (isSkippable(node.parentElement)) return;
      const converted = devanagariToOdia(node.nodeValue);
      if (converted !== node.nodeValue) {
        node.nodeValue = converted;
      }
    };

    const walk = (root: Node) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: (n) =>
          isSkippable((n as Text).parentElement) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
      });
      let current = walker.nextNode();
      while (current) {
        convertTextNode(current as Text);
        current = walker.nextNode();
      }
    };

    // Initial pass over the current document.
    walk(document.body);

    // Observe future DOM mutations and convert any newly-inserted Devanagari.
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'childList') {
          m.addedNodes.forEach((n) => {
            if (n.nodeType === Node.TEXT_NODE) {
              convertTextNode(n as Text);
            } else if (n.nodeType === Node.ELEMENT_NODE && !isSkippable(n as Element)) {
              walk(n);
            }
          });
        } else if (m.type === 'characterData') {
          convertTextNode(m.target as Text);
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, [language]);

  return null;
};

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLangState] = useState<Language>(() => {
    try {
      if (typeof localStorage !== 'undefined') {
        return (localStorage.getItem('divyajyoti_lang') as Language) || 'en';
      }
    } catch {
      // sandbox or SSR fallback
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLangState(lang);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('divyajyoti_lang', lang);
      }
    } catch {
      // sandbox or SSR fallback
    }
  };

  const t = (key: string): string => {
    const raw = translations[language][key] || translations['en'][key] || key;
    return ensureOdiaScript(language, raw);
  };

  // Safety-net for any hard-coded Devanagari string rendered directly in JSX.
  // In Odia mode it transliterates Devanagari → Odia; otherwise returns as-is.
  const tO = (text: string): string => ensureOdiaScript(language, text);

  const tRashi = (rashi: string): string => {
    return RASHI_MAP[rashi]?.[language] || rashi;
  };

  const tGraha = (graha: string): string => {
    return GRAHA_MAP[graha]?.[language] || graha;
  };

  const tNakshatra = (nak: string): string => {
    return NAKSHATRA_MAP[nak]?.[language] || nak;
  };

  const tYoga = (yoga: string): string => {
    return YOGA_MAP[yoga]?.[language] || yoga;
  };

  const tKarana = (karana: string): string => {
    return KARANA_MAP[karana]?.[language] || karana;
  };

  const tKaranaType = (type: 'chara' | 'sthira'): string => {
    if (type === 'chara') {
      return language === 'hi' ? 'चर करण' : language === 'or' ? 'ଚର କରଣ' : 'Chara Karana';
    }
    return language === 'hi' ? 'स्थिर करण' : language === 'or' ? 'ସ୍ଥିର କରଣ' : 'Sthira Karana';
  };

  const tVaara = (vaara: string): string => {
    return VAARA_MAP[vaara]?.[language] || vaara;
  };

  const tTithiFromKey = (tithiRawKey: string): string => {
    // E.g. "Krishna Saptami" or "Shukla Pratipada"
    const parts = tithiRawKey.split(' ');
    if (parts.length < 2) return tithiRawKey;
    const paksha = parts[0];
    const name = parts[1];

    const localizedPaksha = paksha === 'Shukla'
      ? (language === 'hi' ? 'शुक्ल पक्ष' : language === 'or' ? 'ଶୁକ୍ଳ ପକ୍ଷ' : 'Shukla Paksha')
      : (language === 'hi' ? 'कृष्ण पक्ष' : language === 'or' ? 'କୃଷ୍ଣ ପକ୍ଷ' : 'Krishna Paksha');
    const localizedTithi = TITHI_NAME_MAP[name]?.[language] || name;

    if (language === 'en') return `${paksha} ${name}`;
    return `${localizedPaksha} ${localizedTithi}`;
  };

  const tDignity = (dignity: string): string => {
    return DIGNITY_MAP[dignity]?.[language] || dignity;
  };

  const tKoota = (koota: string): string => {
    return KOOTA_MAP[koota]?.[language] || koota;
  };

  const tVerdict = (verdict: string): string => {
    return VERDICT_MAP[verdict]?.[language] || verdict;
  };

  const formatNumber = (num: number | string): string => {
    const s = num.toString();
    if (language === 'hi') {
      return s.replace(/\d/g, d => DEV_NUMERALS[parseInt(d, 10)]);
    }
    if (language === 'or') {
      return s.replace(/\d/g, d => ODIA_NUMERALS[parseInt(d, 10)]);
    }
    return s;
  };

  const formatTime = (timeStr: string): string => {
    if (!timeStr) return '';
    let res = timeStr;
    if (language === 'hi') {
      res = res.replace(/AM/gi, 'पूर्वाह्न').replace(/PM/gi, 'अपराह्न');
      return res.replace(/\d/g, d => DEV_NUMERALS[parseInt(d, 10)]);
    }
    if (language === 'or') {
      res = res.replace(/AM/gi, 'ପୂର୍ବାହ୍ନ').replace(/PM/gi, 'ଅପରାହ୍ନ');
      return res.replace(/\d/g, d => ODIA_NUMERALS[parseInt(d, 10)]);
    }
    return res;
  };

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        t,
        tRashi,
        tGraha,
        tNakshatra,
        tYoga,
        tKarana,
        tKaranaType,
        tVaara,
        tTithiFromKey,
        tDignity,
        tKoota,
        tVerdict,
        tO,
        formatNumber,
        formatTime
      }}
    >
      <OdiaScriptGuard language={language} />
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};