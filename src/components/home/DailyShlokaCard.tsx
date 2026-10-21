// ============================================================================
//  DAILY SHLOKA CARD — Gita verse of the day (rotates by day-of-year)
//  Real verses, trilingual essence. Keeps users coming back daily.
// ============================================================================
import React, { useMemo } from 'react';
import { BookOpen } from 'lucide-react';

interface Verse {
  chap: number; verse: number;
  sa: string;
  or: string; hi: string; en: string;
}

const VERSES: Verse[] = [
  { chap: 2, verse: 47, sa: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।', or: 'କର୍ମରେ ତୁମର ଅଧିକାର, ଫଳରେ କେବେ ନୁହେଁ।', hi: 'कर्म में तुम्हारा अधिकार है, फल में कभी नहीं।', en: 'You have a right to action alone, never to its fruits.' },
  { chap: 2, verse: 48, sa: 'योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय।', or: 'ଆସକ୍ତି ଛାଡ଼ି ଯୋଗସ୍ଥ ହୋଇ କର୍ମ କର।', hi: 'आसक्ति छोड़कर योगस्थ होकर कर्म करो।', en: 'Abandon attachment; act established in equanimity.' },
  { chap: 4, verse: 7, sa: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।', or: 'ଯେବେ ଯେବେ ଧର୍ମର ହାନି ହୁଏ, ମୁଁ ଅବତରଣ କରେ।', hi: 'जब-जब धर्म की हानि होती है, मैं अवतरण करता हूँ।', en: 'Whenever righteousness declines, I manifest Myself.' },
  { chap: 6, verse: 5, sa: 'उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।', or: 'ନିଜେ ନିଜକୁ ଉଦ୍ଧାର କର, ଅଧୋଗତି କର ନାହିଁ।', hi: 'स्वयं अपना उद्धार करो, अधोगति मत करो।', en: 'Uplift yourself — never degrade yourself.' },
  { chap: 18, verse: 66, sa: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।', or: 'ସମସ୍ତ ଧର୍ମ ଛାଡ଼ି କେବଳ ମୋର ଶରଣ ନିଅ।', hi: 'सब धर्म छोड़कर केवल मेरी शरण लो।', en: 'Abandon all duties; take refuge in Me alone.' },
  { chap: 3, verse: 21, sa: 'यद्यदाचरति श्रेष्ठस्तत्तदेवेतरो जनः।', or: 'ଶ୍ରେଷ୍ଠ ଯାହା କରନ୍ତି, ଅନ୍ୟେ ତାହା ଅନୁସରଣ କରନ୍ତି।', hi: 'श्रेष्ठ जो करता है, अन्य वही अनुसरण करते हैं।', en: 'What the great do, others follow.' },
  { chap: 2, verse: 20, sa: 'न जायते म्रियते वा कदाचिन्नायं भूत्वा भविता वा न भूयः।', or: 'ଆତ୍ମା କେବେ ଜନ୍ମେ ନାହିଁ କି ମରେ ନାହିଁ।', hi: 'आत्मा न कभी जन्मती है न मरती है।', en: 'The soul is never born, nor does it ever die.' },
];

export const DailyShlokaCard: React.FC<{ language: 'or' | 'hi' | 'en' }> = ({ language }) => {
  const v = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const doy = Math.floor((now.getTime() - start.getTime()) / 86400000);
    return VERSES[doy % VERSES.length];
  }, []);
  const essence = language === 'or' ? v.or : language === 'hi' ? v.hi : v.en;
  return (
    <section className="relative overflow-hidden rounded-2xl border border-fuchsia-400/25 bg-gradient-to-br from-[#1c1030]/90 to-[#0b0d21]/90 p-4">
      <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-fuchsia-600/20 blur-3xl" />
      <div className="flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-fuchsia-300" />
        <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-fuchsia-200">
          {language === 'or' ? 'ଆଜିର ଶ୍ଳୋକ' : language === 'hi' ? 'आज का श्लोक' : 'Verse of the Day'}
        </h3>
        <span className="ml-auto rounded-full border border-fuchsia-400/30 px-2 py-0.5 text-[10px] font-bold text-fuchsia-200">
          ଗୀତା {v.chap}.{v.verse}
        </span>
      </div>
      <p className="mt-2 font-serif text-base sm:text-lg leading-relaxed text-amber-100">{v.sa}</p>
      <p className="mt-1 text-xs sm:text-sm text-slate-300">“{essence}”</p>
    </section>
  );
};
