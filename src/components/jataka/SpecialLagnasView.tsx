import React from 'react';
import { useI18n } from '../../localization/i18n';
import { SpecialLagnasData } from '../../types/jataka';
import { Sparkles, Coins, Crown, Zap, Flame, ShieldAlert, Award, Compass, HeartHandshake } from 'lucide-react';

interface Props {
  specialLagnas: SpecialLagnasData;
}

export const SpecialLagnasView: React.FC<Props> = ({ specialLagnas }) => {
  const { formatNumber, tRashi, tGraha, language } = useI18n();
  const { sriLagna, induLagna, horaLagna, ghatiLagna, pranapadaLagna, karakamshaLagna, mandi, gulika, upagrahas } = specialLagnas;

  const coreLagnas = [
    { item: sriLagna, icon: Coins, color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10' },
    { item: horaLagna, icon: Compass, color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' },
    { item: ghatiLagna, icon: Crown, color: 'text-yellow-400', border: 'border-yellow-500/30', bg: 'bg-yellow-500/10' },
    { item: pranapadaLagna, icon: Zap, color: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500/10' },
    { item: karakamshaLagna, icon: Award, color: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-500/10' },
    { item: mandi, icon: Flame, color: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-500/10' },
    { item: gulika, icon: ShieldAlert, color: 'text-orange-400', border: 'border-orange-500/30', bg: 'bg-orange-500/10' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-cosmic-900/80 border border-cosmic-gold/30 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2 text-cosmic-gold text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-cosmic-saffron animate-pulse" />
              <span>Special Lagnas & Upagraha Astrometry</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-100">
              ବିଶେଷ ଲଗ୍ନ, ଇନ୍ଦୁ ଲଗ୍ନ ଓ ଅପ୍ରକାଶିତ ଉପଗ୍ରହ ସ୍ଫୁଟ
            </h2>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-cosmic-950 border border-cosmic-gold/40 text-cosmic-gold font-bold">
            Classical Parashari Principles
          </span>
        </div>

        {/* 1. Indu Lagna Spotlight: Wealth Yoga & Billionaire Potential */}
        <div className="mt-5 p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-cosmic-950 to-cosmic-900 border border-amber-500/40 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300 shadow-lg">
                <Coins className="w-6 h-6 animate-bounce-slow" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-bold text-amber-300 font-serif">
                    ଇନ୍ଦୁ ଲଗ୍ନ (Indu Lagna - ଧନ ବିନ୍ଦୁ)
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide bg-amber-400 text-cosmic-950 uppercase shadow-md">
                    {induLagna.wealthTier}
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  {tRashi(induLagna.sign)} ({formatNumber(induLagna.degreeInSign)}°) • ଲଗ୍ନରୁ ଭାବ {formatNumber(induLagna.houseFromLagna)} • ଚନ୍ଦ୍ରରୁ ଭାବ {formatNumber(induLagna.houseFromMoon)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <div className="px-3 py-1.5 rounded-xl bg-cosmic-950/80 border border-slate-800 text-slate-300">
                <span className="text-slate-500">Lagna 9th ({tGraha(induLagna.lagna9thLord)}): </span>
                <strong className="text-amber-400 font-mono">{formatNumber(induLagna.lagnaRays)} Rays</strong>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-cosmic-950/80 border border-slate-800 text-slate-300">
                <span className="text-slate-500">Moon 9th ({tGraha(induLagna.moon9thLord)}): </span>
                <strong className="text-amber-400 font-mono">{formatNumber(induLagna.moonRays)} Rays</strong>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold">
                Total: {formatNumber(induLagna.totalRays)}
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-cosmic-950/60 p-3.5 rounded-xl border border-slate-800/80">
            {induLagna.wealthPrediction[language]}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span>
              ଅଧିପତି: <strong className="text-cosmic-gold">{tGraha(induLagna.signLord)}</strong>
            </span>
            <span>•</span>
            <span>
              ସ୍ଥିତ ଗ୍ରହ: {induLagna.occupants.length > 0 ? (
                induLagna.occupants.map(p => (
                  <span key={p} className="inline-block px-2 py-0.5 ml-1 rounded bg-cosmic-900 border border-slate-700 text-amber-300 font-bold">
                    {tGraha(p)}
                  </span>
                ))
              ) : (
                <span className="text-slate-500 italic">କୌଣସି ଗ୍ରହ ନାହାନ୍ତି (ଶୁଭ ଦୃଷ୍ଟି ଦ୍ୱାରା ଧନ ନିର୍ଣ୍ଣୟ)</span>
              )}
            </span>
            {induLagna.aspectingPlanets.length > 0 && (
              <>
                <span>•</span>
                <span>
                  ଦୃଷ୍ଟିଦାତା ଗ୍ରହ: {induLagna.aspectingPlanets.map(p => (
                    <span key={p} className="inline-block px-2 py-0.5 ml-1 rounded bg-cosmic-900 border border-emerald-500/40 text-emerald-300 font-bold">
                      {tGraha(p)}
                    </span>
                  ))}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. Grid of Core Parashari Special Lagnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coreLagnas.map(({ item, icon: Icon, color, border, bg }) => (
          <div
            key={item.id}
            className={`bg-cosmic-900/70 border rounded-2xl p-4 shadow-xl backdrop-blur-sm flex flex-col justify-between transition-all hover:scale-[1.01] ${border}`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${bg} ${color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100 leading-tight">
                      {item.name[language]}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {item.shortName} • House {formatNumber(item.house)}
                    </span>
                  </div>
                </div>

                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${bg} ${color}`}>
                  {formatNumber(item.degreeInSign)}°
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-cosmic-950/70 border border-slate-800/80 space-y-1 mb-2.5 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-500">Sign:</span>
                  <span className="font-bold text-cosmic-gold">{tRashi(item.sign)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-500">Lord:</span>
                  <span className="font-semibold text-slate-200">{tGraha(item.signLord)}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed">
                {item.significance[language]}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-amber-200/90 italic">
              {item.prediction[language]}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Five Invisible Combustion Upagrahas */}
      <div className="bg-cosmic-900/70 border border-cosmic-gold/30 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md">
        <h3 className="text-base font-bold text-slate-100 mb-3 flex items-center gap-2 font-serif">
          <Flame className="w-4 h-4 text-orange-400" />
          <span>୫ଟି ଅପ୍ରକାଶିତ ଉପଗ୍ରହ (The 5 Parashari Invisible Upagrahas)</span>
        </h3>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          ମହର୍ଷି ପରାଶରଙ୍କ ଅନୁଯାୟୀ ସୂର୍ଯ୍ୟଙ୍କ ଗତିରୁ ଉଦ୍ଭବ ୫ଟି ସୂକ୍ଷ୍ମ ଛାୟା ବିନ୍ଦୁ — ଯାହା ଅନ୍ତଃସ୍ଥ ପ୍ରେରଣା, ଗୂଢ଼ ରହସ୍ୟ ଓ ଆକସ୍ମିକ ପରିବର୍ତ୍ତନର ସୂଚକ।
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {upagrahas.map((u, i) => (
            <div key={i} className="p-3.5 bg-cosmic-950/80 border border-slate-800 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-200">{u.name[language]}</span>
                  <span className="text-[10px] text-amber-400 font-mono">H{formatNumber(u.house)}</span>
                </div>
                <div className="text-[11px] text-cosmic-gold font-semibold mb-2">
                  {tRashi(u.sign)} ({formatNumber(u.degreeInSign)}°)
                </div>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                {u.effect[language]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
