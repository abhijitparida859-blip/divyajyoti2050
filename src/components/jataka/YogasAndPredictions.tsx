import React from 'react';
import { useI18n } from '../../localization/i18n';
import { VedicYoga, LifePredictions, KalaSarpaInfo, ManglikInfo, SadeSatiInfo } from '../../types/jataka';
import { ShieldCheck, BookOpen, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';

interface Props {
  viewType: 'yogas' | 'predictions';
  yogas: VedicYoga[];
  predictions: LifePredictions;
  kalaSarpa?: KalaSarpaInfo;
  manglik?: ManglikInfo;
  sadeSati?: SadeSatiInfo;
}

export const YogasAndPredictions: React.FC<Props> = ({
  viewType,
  yogas,
  predictions,
  kalaSarpa,
  manglik,
  sadeSati
}) => {
  const { language } = useI18n();

  if (viewType === 'yogas') {
    return (
      <div className="space-y-6">
        {/* Critical Doshas & Astrological Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. Kala Sarpa Dosha */}
          {kalaSarpa && (
            <div className={`p-4 rounded-2xl border ${
              kalaSarpa.hasDosha
                ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Kala Sarpa Analysis</span>
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  kalaSarpa.hasDosha ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {kalaSarpa.hasDosha ? (kalaSarpa.isCancelled ? 'Cancelled' : 'Present') : 'Free'}
                </span>
              </div>
              <h4 className="text-sm font-bold mb-1">{kalaSarpa.name[language]}</h4>
              <p className="text-xs leading-relaxed opacity-90 mb-2">
                {kalaSarpa.description[language]}
              </p>
              {kalaSarpa.hasDosha && (
                <div className="text-[11px] font-medium text-amber-300 border-t border-white/10 pt-2">
                  ✦ Remedy: {kalaSarpa.remedy[language]}
                </div>
              )}
            </div>
          )}

          {/* 2. Manglik / Kuja Dosha */}
          {manglik && (
            <div className={`p-4 rounded-2xl border ${
              manglik.isManglik
                ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Manglik (Kuja) Check</span>
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  manglik.isManglik ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {manglik.isManglik ? `${manglik.severity} Manglik` : 'Non-Manglik'}
                </span>
              </div>
              <h4 className="text-sm font-bold mb-1">
                {manglik.isManglik ? 'Kuja Dosha Active' : 'Shuddha Kundali (Non-Manglik)'}
              </h4>
              <p className="text-xs leading-relaxed opacity-90 mb-2">
                {manglik.description[language]}
              </p>
              {manglik.cancellationReasons.length > 0 && (
                <div className="text-[11px] font-medium text-emerald-300 border-t border-white/10 pt-2">
                  ✦ Cancelled: {manglik.cancellationReasons[0][language]}
                </div>
              )}
            </div>
          )}

          {/* 3. Sade Sati Status */}
          {sadeSati && (
            <div className={`p-4 rounded-2xl border ${
              sadeSati.isActive
                ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-200'
                : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Shani Sade Sati</span>
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  sadeSati.isActive ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {sadeSati.isActive ? 'Running' : 'Inactive'}
                </span>
              </div>
              <h4 className="text-sm font-bold mb-1">{sadeSati.phaseOr}</h4>
              <p className="text-xs leading-relaxed opacity-90 mb-2">
                {sadeSati.description[language]}
              </p>
              {sadeSati.isActive && (
                <div className="text-[11px] font-medium text-amber-300 border-t border-white/10 pt-2">
                  ✦ Upachara: {sadeSati.remedy[language]}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 50+ Classical Yogas Cards */}
        <div className="bg-cosmic-900/70 border border-cosmic-gold/30 rounded-3xl p-6 shadow-2xl backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 font-serif">
              <ShieldCheck className="w-4 h-4 text-cosmic-gold" />
              <span>Classical Vedic Yogas in Natal Horoscope (ରାଜଯୋଗ ଓ ଯୋଗ ବିଶ୍ଳେଷଣ)</span>
            </h3>
            <span className="text-xs bg-amber-500/15 border border-amber-500/30 text-amber-300 px-3 py-1 rounded-full font-bold">
              Total {yogas.length} Yogas Detected
            </span>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {yogas.map((yoga) => (
            <div key={yoga.id} className="p-4 rounded-2xl bg-cosmic-950/70 border border-cosmic-gold/30 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-cosmic-gold">{yoga.name[language]}</h4>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                    yoga.type === 'Rajayoga' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                    yoga.type === 'Auspicious' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' :
                    'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {yoga.type}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-2">
                  {yoga.description[language]}
                </p>
              </div>
              <div className="text-[11px] text-cosmic-saffron font-medium border-t border-slate-800/80 pt-2">
                ✦ {yoga.effect[language]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="bg-cosmic-900/70 border border-cosmic-gold/30 rounded-3xl p-6 shadow-2xl backdrop-blur-md space-y-4">
      <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 font-serif">
        <BookOpen className="w-4 h-4 text-cosmic-gold" />
        <span>Classical Vedic Life Predictions (ଜୀବନ ଭବିଷ୍ୟତ ଫଳ)</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-cosmic-950/60 border border-slate-800 space-y-1.5">
          <span className="text-xs font-bold text-cosmic-gold flex items-center gap-1.5">
            👑 Personality & Life Force (ସ୍ୱଭାବ ଓ ବ୍ୟକ୍ତିତ୍ୱ)
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            {predictions.personality[language]}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-cosmic-950/60 border border-slate-800 space-y-1.5">
          <span className="text-xs font-bold text-cosmic-saffron flex items-center gap-1.5">
            💼 Career & Status (କର୍ମକ୍ଷେତ୍ର ଓ ପ୍ରତିଷ୍ଠା)
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            {predictions.career[language]}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-cosmic-950/60 border border-slate-800 space-y-1.5">
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            💰 Wealth & Assets (ଧନ ଓ ସମ୍ପତ୍ତି ଯୋଗ)
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            {predictions.wealth[language]}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-cosmic-950/60 border border-slate-800 space-y-1.5">
          <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
            ❤️ Relationships & Marriage (ଦାମ୍ପତ୍ୟ ଜୀବନ)
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            {predictions.relationships[language]}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-cosmic-950/60 border border-slate-800 space-y-1.5">
          <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
            🌿 Health & Vitality (ସ୍ୱାସ୍ଥ୍ୟ ଓ ଆୟୁଷ)
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            {predictions.health[language]}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-cosmic-950/60 border border-slate-800 space-y-1.5">
          <span className="text-xs font-bold text-cosmic-amethyst flex items-center gap-1.5">
            🛕 Spiritual Sadhana & Moksha (ଆଧ୍ୟାତ୍ମିକ ସାଧନା)
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            {predictions.spirituality[language]}
          </p>
        </div>
      </div>
    </div>
  );
};