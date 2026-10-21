import React from 'react';
import { useI18n } from '../../localization/i18n';
import { VimsopakaBalaData, PlanetName } from '../../types/jataka';
import { Shield, Award, Sparkles, TrendingUp, Info } from 'lucide-react';

interface Props {
  vimsopakaBala: VimsopakaBalaData;
}

export const VimsopakaBalaView: React.FC<Props> = ({ vimsopakaBala }) => {
  const { language, tGraha } = useI18n();

  const planetList: PlanetName[] = [
    'Surya', 'Chandra', 'Mangala', 'Budha', 'Guru', 'Shukra', 'Shani'
  ];

  return (
    <div className="bg-cosmic-900/70 border border-cosmic-gold/30 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 font-serif">
            <Shield className="w-5 h-5 text-cosmic-gold" />
            <span>Parashari Vimsopaka Bala & Ishta/Kashta Phala (ବିଂଶୋପକ ବଳ ଓ ଇଷ୍ଟ/କଷ୍ଟ ଫଳ)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            20-point divisional chart dignity score and the exact ratio of sweet benefic rewards (Ishta) vs karmic trials (Kashta).
          </p>
        </div>

        {/* Apex Badges */}
        <div className="flex gap-2 flex-wrap text-xs">
          <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-3 py-1 rounded-xl flex items-center gap-1.5 font-medium">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>Apex Vimsopaka: {tGraha(vimsopakaBala.highestVimsopakaPlanet)}</span>
          </div>
          <div className="bg-amber-950/80 border border-amber-500/40 text-amber-300 px-3 py-1 rounded-xl flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Apex Ishta: {tGraha(vimsopakaBala.highestIshtaPlanet)}</span>
          </div>
        </div>
      </div>

      {/* Grid of Planets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {planetList.map((pName) => {
          const p = vimsopakaBala.planets[pName];
          if (!p) return null;

          const gradeBadgeColor =
            p.vimsopakaGrade === 'Purna'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : p.vimsopakaGrade === 'Uttama'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : p.vimsopakaGrade === 'Madhyama'
              ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
              : 'bg-rose-500/20 text-rose-300 border-rose-500/40';

          const vimsopakaPct = (p.vimsopakaScore / 20) * 100;

          return (
            <div
              key={pName}
              className="bg-cosmic-950/80 border border-slate-800 hover:border-cosmic-gold/40 rounded-2xl p-4 flex flex-col justify-between transition-all space-y-3"
            >
              <div>
                {/* Planet Row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-sm font-bold text-slate-100 font-serif flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-cosmic-gold" />
                    <span>{tGraha(pName)}</span>
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${gradeBadgeColor}`}>
                    {p.gradeName[language]}
                  </span>
                </div>

                {/* Vimsopaka Score Bar */}
                <div className="space-y-1 mb-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Vimsopaka Bala:</span>
                    <span className="font-bold text-slate-200">{p.vimsopakaScore} / 20</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-cosmic-gold"
                      style={{ width: `${vimsopakaPct}%` }}
                    />
                  </div>
                </div>

                {/* Ishta vs Kashta Phala */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="bg-emerald-950/50 border border-emerald-500/30 p-2 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-0.5">
                      Ishta Phala (ଇଷ୍ଟ)
                    </span>
                    <span className="font-bold text-emerald-200 text-sm">{p.ishtaPhala}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Sweet Rewards</span>
                  </div>

                  <div className="bg-rose-950/50 border border-rose-500/30 p-2 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-rose-400 block mb-0.5">
                      Kashta Phala (କଷ୍ଟ)
                    </span>
                    <span className="font-bold text-rose-200 text-sm">{p.kashtaPhala}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Karmic Effort</span>
                  </div>
                </div>

                {/* Significance Text */}
                <p className="text-[11px] text-slate-300 leading-relaxed border-t border-slate-800/80 pt-2">
                  {p.significance[language]}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Informational Guidance */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-slate-400 leading-relaxed">
        <Info className="w-4 h-4 text-cosmic-gold shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-200">Parashari Shastra Principle: </span>
          When a planet possesses a Vimsopaka score greater than 16 and Ishta Phala exceeds Kashta Phala, its Dasha and Gochara transits operate as an effortless fountain of wealth, high status, and protection.
        </div>
      </div>
    </div>
  );
};
