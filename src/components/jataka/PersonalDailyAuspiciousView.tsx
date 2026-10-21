import React from 'react';
import { useI18n } from '../../localization/i18n';
import { DailyPersonalGuideData } from '../../types/jataka';
import { Sparkles, Moon, Star, Compass, Award, AlertTriangle, ShieldCheck } from 'lucide-react';

interface Props {
  dailyGuide: DailyPersonalGuideData;
}

export const PersonalDailyAuspiciousView: React.FC<Props> = ({ dailyGuide }) => {
  const { language, tRashi } = useI18n();

  return (
    <div className="bg-cosmic-900/70 border border-cosmic-gold/30 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 font-serif">
            <Sparkles className="w-5 h-5 text-cosmic-gold" />
            <span>Personalized Daily Astro-Guide & Transit Timing (ଆଜିର ବ୍ୟକ୍ତିଗତ ଶୁଭାଶୁଭ ଗାଇଡ୍)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Real-time personalized Gochara assessment calculated from your natal Moon degree.
          </p>
        </div>

        {/* Live Moon Info Badge */}
        <div className="bg-cosmic-950/90 border border-cosmic-gold/40 px-3.5 py-1.5 rounded-2xl flex items-center gap-2.5 text-xs self-start sm:self-auto">
          <Moon className="w-4 h-4 text-amber-300" />
          <div>
            <span className="text-slate-400">Transit Moon: </span>
            <span className="font-bold text-slate-100">{tRashi(dailyGuide.transitMoonSign)}</span>
            <span className="text-cosmic-gold ml-1.5 font-medium">({dailyGuide.transitMoonNakshatra})</span>
          </div>
        </div>
      </div>

      {/* Grid: Tarabala & Chandrabala */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tarabala Card */}
        <div className="bg-cosmic-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs uppercase font-bold text-indigo-400 flex items-center gap-1.5 tracking-wider">
                <Star className="w-4 h-4" />
                <span>Today's Tarabala (ତାରାବଳ)</span>
              </span>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                  dailyGuide.tarabala.isAuspicious
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                    : 'bg-rose-500/15 text-rose-300 border-rose-500/40'
                }`}
              >
                {dailyGuide.tarabala.isAuspicious ? '✓ Auspicious (ଶୁଭ)' : '⚠ Caution (ଅଶୁଭ)'}
              </span>
            </div>

            <div className="text-base font-bold text-slate-100 mb-1">
              {dailyGuide.tarabala.taraName[language]}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {dailyGuide.tarabala.guidance[language]}
            </p>
          </div>
        </div>

        {/* Chandrabala Card */}
        <div className="bg-cosmic-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs uppercase font-bold text-amber-400 flex items-center gap-1.5 tracking-wider">
                <Moon className="w-4 h-4" />
                <span>Today's Chandrabala (ଚନ୍ଦ୍ରବଳ)</span>
              </span>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                  dailyGuide.chandrabala.houseFromNatalMoon === 8
                    ? 'bg-rose-600/20 text-rose-300 border-rose-500'
                    : dailyGuide.chandrabala.isAuspicious
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                }`}
              >
                {dailyGuide.chandrabala.houseFromNatalMoon === 8
                  ? '⚡ Ashtama Chandra (ଅଷ୍ଟମ ଚନ୍ଦ୍ର)'
                  : dailyGuide.chandrabala.isAuspicious
                  ? '✓ Auspicious (ଶୁଭ ଚନ୍ଦ୍ର)'
                  : '⚠ Moderate (ମଧ୍ୟମ)'}
              </span>
            </div>

            <div className="text-base font-bold text-slate-100 mb-1">
              {dailyGuide.chandrabala.houseFromNatalMoon}th House from Natal Moon (ଜନ୍ମ ରାଶିରୁ {dailyGuide.chandrabala.houseFromNatalMoon}ମ)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {dailyGuide.chandrabala.guidance[language]}
            </p>
          </div>
        </div>
      </div>

      {/* Lucky Guidelines Card */}
      <div className="bg-gradient-to-r from-cosmic-950/90 via-slate-900 to-cosmic-950/90 border border-cosmic-gold/30 rounded-2xl p-4 sm:p-5 space-y-4">
        <h4 className="text-xs font-bold text-cosmic-gold uppercase tracking-wider flex items-center gap-2">
          <Award className="w-4 h-4 text-cosmic-gold" />
          <span>Today's Personal Lucky Guidelines (ଆଜିର ଶୁଭ ନିର୍ଦ୍ଦେଶିକା)</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Lucky Color</span>
            <span className="font-bold text-amber-300">{dailyGuide.luckyGuidelines.color[language]}</span>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Lucky Number</span>
            <span className="font-bold text-emerald-300 text-sm">{dailyGuide.luckyGuidelines.number}</span>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Auspicious Direction</span>
            <span className="font-bold text-cyan-300">{dailyGuide.luckyGuidelines.direction[language]}</span>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Daily Protection</span>
            <span className="font-bold text-indigo-300">Shiva/Jagannath Smarana</span>
          </div>
        </div>

        {/* Daily Mantra */}
        <div className="bg-slate-950/80 border border-cosmic-gold/20 p-3 rounded-xl flex items-center justify-between gap-3 text-xs">
          <span className="text-[11px] text-slate-400 font-medium">Daily Chanting Mantra:</span>
          <span className="font-bold text-cosmic-gold font-serif">{dailyGuide.luckyGuidelines.mantra}</span>
        </div>
      </div>
    </div>
  );
};
