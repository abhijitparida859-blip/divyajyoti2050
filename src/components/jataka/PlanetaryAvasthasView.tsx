import React from 'react';
import { useI18n } from '../../localization/i18n';
import { PlanetaryAvasthasData, PlanetName } from '../../types/jataka';
import { Sparkles, Eye, Zap, Flame } from 'lucide-react';

interface Props {
  planetaryAvasthas: PlanetaryAvasthasData;
}

export const PlanetaryAvasthasView: React.FC<Props> = ({ planetaryAvasthas }) => {
  const { language, tGraha } = useI18n();

  const planetList: PlanetName[] = [
    'Surya', 'Chandra', 'Mangala', 'Budha', 'Guru', 'Shukra', 'Shani', 'Rahu', 'Ketu'
  ];

  return (
    <div className="bg-cosmic-900/70 border border-cosmic-gold/30 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 font-serif">
          <Zap className="w-5 h-5 text-cosmic-gold" />
          <span>Planetary Avasthas (ବଳାଦି, ଦୀପ୍ତାଦି ଓ ଜାଗ୍ରତାଦି ଅବସ୍ଥା)</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Classical 3-Tier maturity states: Baladi (age & fruit %), Deeptadi (radiance & dignity), and Jagradadi (consciousness level).
        </p>
      </div>

      {/* Avasthas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {planetList.map((pName) => {
          const avastha = planetaryAvasthas.avasthas[pName];
          if (!avastha) return null;

          const fruitColor =
            avastha.fruitPercentage >= 75
              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
              : avastha.fruitPercentage >= 40
              ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
              : 'text-rose-400 bg-rose-500/10 border-rose-500/30';

          const deeptadiBadge =
            avastha.deeptadiAvastha === 'Deepta' || avastha.deeptadiAvastha === 'Swastha'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : avastha.deeptadiAvastha === 'Mudita' || avastha.deeptadiAvastha === 'Shanta'
              ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
              : 'bg-rose-500/20 text-rose-300 border-rose-500/40';

          return (
            <div
              key={pName}
              className="bg-cosmic-950/80 border border-slate-800 hover:border-cosmic-gold/40 rounded-2xl p-4 flex flex-col justify-between transition-all"
            >
              <div>
                {/* Top Row: Planet & Fruit % */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cosmic-gold" />
                    <span className="text-sm font-bold text-slate-100 font-serif">
                      {tGraha(pName)}
                    </span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${fruitColor}`}>
                    {avastha.fruitPercentage}% Fruit
                  </span>
                </div>

                {/* 3 Avastha Badges */}
                <div className="space-y-2 mb-3 text-xs">
                  {/* Baladi */}
                  <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Baladi:</span>
                    <span className="font-semibold text-slate-200">{avastha.baladiName[language]}</span>
                  </div>

                  {/* Deeptadi */}
                  <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Deeptadi:</span>
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${deeptadiBadge}`}>
                      {avastha.deeptadiName[language]}
                    </span>
                  </div>

                  {/* Jagradadi */}
                  <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Consciousness:</span>
                    <span className="font-semibold text-cyan-300">{avastha.jagradadiName[language]}</span>
                  </div>
                </div>

                {/* Interpretation */}
                <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2.5">
                  {avastha.interpretation[language]}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
