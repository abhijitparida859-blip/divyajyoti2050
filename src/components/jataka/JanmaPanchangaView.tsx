import React from 'react';
import { useI18n } from '../../localization/i18n';
import { JanmaPanchangaData } from '../../types/jataka';
import { BookOpen, Flame, Droplets, Wind, Sparkles, Mountain } from 'lucide-react';

interface Props {
  janmaPanchanga: JanmaPanchangaData;
}

export const JanmaPanchangaView: React.FC<Props> = ({ janmaPanchanga }) => {
  const { language, tGraha } = useI18n();

  const pillars = [
    {
      pillar: janmaPanchanga.tithi,
      icon: Droplets,
      color: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40',
      badge: 'Jala Tatwa (ଜଳ ତତ୍ତ୍ୱ)'
    },
    {
      pillar: janmaPanchanga.vara,
      icon: Flame,
      color: 'text-amber-400 border-amber-500/30 bg-amber-950/40',
      badge: 'Agni Tatwa (ଅଗ୍ନି ତତ୍ତ୍ୱ)'
    },
    {
      pillar: janmaPanchanga.nakshatra,
      icon: Wind,
      color: 'text-indigo-400 border-indigo-500/30 bg-indigo-950/40',
      badge: 'Vayu Tatwa (ବାୟୁ ତତ୍ତ୍ୱ)'
    },
    {
      pillar: janmaPanchanga.yoga,
      icon: Sparkles,
      color: 'text-purple-400 border-purple-500/30 bg-purple-950/40',
      badge: 'Akasha Tatwa (ଆକାଶ ତତ୍ତ୍ୱ)'
    },
    {
      pillar: janmaPanchanga.karana,
      icon: Mountain,
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40',
      badge: 'Prithvi Tatwa (ପୃଥିବୀ ତତ୍ତ୍ୱ)'
    }
  ];

  return (
    <div className="bg-cosmic-900/70 border border-cosmic-gold/30 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 font-serif">
          <BookOpen className="w-5 h-5 text-cosmic-gold" />
          <span>Janma Panchanga: 5 Primordial Birth Pillars (ଜନ୍ମ ପଞ୍ଚାଙ୍ଗ ପଞ୍ଚତତ୍ତ୍ୱ)</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          The 5 Shastric pillars of time at your moment of birth shaping your vitality, mental wavelength, and destiny.
        </p>
      </div>

      {/* 5 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pillars.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`border rounded-2xl p-4 flex flex-col justify-between transition-all ${item.color}`}
            >
              <div>
                {/* Pillar Header */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span className="text-xs uppercase font-bold tracking-wider text-slate-300">
                      {item.pillar.name[language]}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700/60 text-slate-300">
                    {item.badge}
                  </span>
                </div>

                {/* Pillar Value */}
                <div className="text-base font-bold text-slate-100 mb-1 font-serif">
                  {item.pillar.value[language]}
                </div>

                {/* Ruling Lord */}
                <div className="text-xs text-slate-300 mb-2">
                  Ruler: <b className="text-cosmic-gold">{tGraha(item.pillar.rulingLord as any)}</b>
                </div>

                {/* Significance */}
                <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-2">
                  {item.pillar.significance[language]}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Elemental Harmony Card */}
      <div className="bg-gradient-to-r from-cosmic-950/90 via-slate-900 to-cosmic-950/90 border border-cosmic-gold/30 rounded-2xl p-4 sm:p-5 space-y-2">
        <h4 className="text-xs font-bold text-cosmic-gold uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cosmic-gold" />
          <span>Pancha-Mahabhuta Elemental Balance (ପଞ୍ଚମହାଭୂତ ସନ୍ତୁଳନ)</span>
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          {janmaPanchanga.elementalBalance.summary[language]}
        </p>
      </div>
    </div>
  );
};
