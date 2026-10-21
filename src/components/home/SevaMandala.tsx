// ============================================================================
//  SEVA MANDALA — 9 sacred services as 3D tilt cards (quick access grid)
//  Each card deep-links to its tab via hash navigation.
// ============================================================================
import React from 'react';

export interface SevaItem {
  id: string;
  emoji: string;
  labelOr: string;
  labelHi: string;
  labelEn: string;
  descOr: string;
  descHi: string;
  descEn: string;
  tab: string;
  glow: string;
  border: string;
}

export const SEVA_ITEMS: SevaItem[] = [
  { id: 'jataka', emoji: '🔮', labelOr: 'ଜାତକ', labelHi: 'जातक', labelEn: 'Kundali', descOr: 'ଜନ୍ମ କୁଣ୍ଡଳୀ ଓ ଭବିଷ୍ୟ', descHi: 'जन्म कुंडली व भविष्य', descEn: 'Birth chart & future', tab: 'jataka', glow: 'rgba(168,85,247,0.35)', border: 'border-purple-400/40' },
  { id: 'milan', emoji: '❤️', labelOr: 'ମିଳନ', labelHi: 'मिलन', labelEn: 'Matching', descOr: 'ବାହାଘର ଯୋଡ଼ି ମେଳ', descHi: 'विवाह जोड़ी मेल', descEn: 'Marriage matching', tab: 'milan', glow: 'rgba(244,63,94,0.35)', border: 'border-rose-400/40' },
  { id: 'mala', emoji: '📿', labelOr: 'ଜପ ମାଳା', labelHi: 'जप माला', labelEn: 'Japa Mala', descOr: '୧୦୮ ମନ୍ତ୍ର ଜପ ଓ ଧ୍ୟାନ', descHi: '108 मंत्र जप व ध्यान', descEn: '108 mantra chanting', tab: 'mala', glow: 'rgba(251,191,36,0.35)', border: 'border-amber-300/40' },
  { id: 'meditation', emoji: '🧘', labelOr: 'ଧ୍ୟାନ', labelHi: 'ध्यान', labelEn: 'Meditation', descOr: 'ଶାନ୍ତି ଓ ଏକାଗ୍ରତା', descHi: 'शांति व एकाग्रता', descEn: 'Peace & focus', tab: 'meditation', glow: 'rgba(52,211,153,0.35)', border: 'border-emerald-400/40' },
  { id: 'cosmos', emoji: '🪐', labelOr: 'ବ୍ରହ୍ମାଣ୍ଡ', labelHi: 'ब्रह्मांड', labelEn: 'Cosmos 3D', descOr: 'ଗ୍ରହ ନକ୍ଷତ୍ର 3D ଦର୍ଶନ', descHi: 'ग्रह नक्षत्र 3D दर्शन', descEn: 'Planets in 3D view', tab: 'cosmos', glow: 'rgba(56,189,248,0.35)', border: 'border-sky-400/40' },
  { id: 'todo', emoji: '✅', labelOr: 'ଦୈନିକ କର୍ମ', labelHi: 'दैनिक कर्म', labelEn: 'Daily Karma', descOr: 'ଆଜିର ଶୁଭ କାର୍ଯ୍ୟ ତାଲିକା', descHi: 'आज के शुभ कार्य सूची', descEn: 'Today task list', tab: 'todo', glow: 'rgba(251,146,60,0.35)', border: 'border-orange-400/40' },
  { id: 'palm', emoji: '🖐️', labelOr: 'ପାମ୍ ରିଡର୍', labelHi: 'पाम रीडर', labelEn: 'Palm Reader', descOr: 'ଆଡଭାନ୍ସ ହସ୍ତ ରେଖା ସ୍କାନ', descHi: 'एडवांस हस्त रेखा स्कैन', descEn: 'Advance palm scan', tab: 'palm', glow: 'rgba(251,113,133,0.4)', border: 'border-rose-400/40' },
  { id: 'panjika', emoji: '📜', labelOr: 'ପଞ୍ଜିକା', labelHi: 'पंजिका', labelEn: 'Panjika', descOr: 'ସମ୍ପୂର୍ଣ୍ଣ ଦୈନିକ ପଞ୍ଜିକା', descHi: 'संपूर्ण दैनिक पंजिका', descEn: 'Full daily almanac', tab: 'panjika', glow: 'rgba(250,204,21,0.35)', border: 'border-yellow-400/40' },
  { id: 'calendar', emoji: '🗓️', labelOr: 'କାଳେଣ୍ଡର', labelHi: 'कैलेंडर', labelEn: 'Calendar', descOr: 'ମାସିକ ଓଡ଼ିଆ କାଳେଣ୍ଡର', descHi: 'मासिक ओड़िया कैलेंडर', descEn: 'Monthly Odia calendar', tab: 'calendar', glow: 'rgba(45,212,191,0.35)', border: 'border-teal-400/40' },
];

const tilt = (e: React.MouseEvent<HTMLButtonElement>) => {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;
  el.style.transform = `perspective(700px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateY(-4px)`;
};
const untilt = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.style.transform = '';
};

export const SevaMandala: React.FC<{ language: 'or' | 'hi' | 'en' }> = ({ language }) => {
  const go = (tab: string) => {
    try { window.location.hash = tab; } catch { /* noop */ }
    try { window.dispatchEvent(new HashChangeEvent('hashchange')); } catch { /* noop */ }
  };
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <span className="text-lg">⛩️</span>
        <h3 className="font-serif text-lg sm:text-xl font-black text-amber-100">
          {language === 'or' ? 'ସେବା ମଣ୍ଡଳ' : language === 'hi' ? 'सेवा मण्डल' : 'Seva Mandala'}
        </h3>
        <span className="h-px flex-1 bg-gradient-to-r from-amber-400/40 to-transparent" />
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {SEVA_ITEMS.map((s) => (
          <button
            key={s.id}
            type="button"
            onMouseMove={tilt}
            onMouseLeave={untilt}
            onClick={() => go(s.tab)}
            style={{ boxShadow: `0 8px 28px -10px ${s.glow}` }}
            className={`group rounded-2xl border ${s.border} bg-[#0b0d21]/85 p-3 text-center backdrop-blur-md transition-all duration-200 hover:-translate-y-1 active:scale-95 cursor-pointer`}
          >
            <div className="text-2xl sm:text-3xl transition-transform duration-200 group-hover:scale-125">{s.emoji}</div>
            <div className="mt-1 text-[11px] sm:text-xs font-black text-slate-100">
              {language === 'or' ? s.labelOr : language === 'hi' ? s.labelHi : s.labelEn}
            </div>
            <div className="mt-0.5 hidden sm:block text-[10px] text-slate-400">
              {language === 'or' ? s.descOr : language === 'hi' ? s.descHi : s.descEn}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
