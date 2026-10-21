import React from 'react';
import { useI18n } from '../../localization/i18n';
import { ShadbalaSummary } from '../../types/jataka';
import { Award, Zap, Shield, CheckCircle, AlertTriangle } from 'lucide-react';

interface Props {
  shadbala: ShadbalaSummary;
}

export const ShadbalaView: React.FC<Props> = ({ shadbala }) => {
  const { t, formatNumber, tGraha, language } = useI18n();

  return (
    <div className="bg-cosmic-900/70 border border-cosmic-gold/30 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 font-serif">
            <Award className="w-5 h-5 text-cosmic-gold" />
            <span>Maharishi Parashara Shadbala (ଷଡ଼ବଳ - ୬ ଗୁଣ ଗ୍ରହବଳ ବିଶ୍ଳେଷଣ)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Six-fold planetary strength computed in Virupas and Rupas (60 Virupas = 1 Rupa).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-full font-bold">
            👑 Best: {tGraha(shadbala.strongestPlanet)}
          </span>
          <span className="text-[11px] bg-rose-500/15 border border-rose-500/30 text-rose-300 px-3 py-1 rounded-full font-bold">
            ⚠️ Low: {tGraha(shadbala.weakestPlanet)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.values(shadbala.planets).map(p => {
          const isExceeding = p.isStrong;
          return (
            <div
              key={p.planet}
              className="bg-cosmic-950/80 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-amber-400/40 transition-all shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-cosmic-gold/15 border border-cosmic-gold/30 text-amber-300 text-xs font-bold flex items-center justify-center font-mono">
                      #{p.rank}
                    </span>
                    <span className="font-bold text-slate-100 text-sm">{tGraha(p.planet)}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                    isExceeding
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {isExceeding ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    <span>{formatNumber(p.strengthPercentage)}%</span>
                  </span>
                </div>

                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-xl font-black text-amber-300 font-mono">
                    {formatNumber(p.totalRupas)} <span className="text-xs text-slate-400 font-normal">Rupas</span>
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Req: {formatNumber(p.requiredRupas)} Rupas ({formatNumber(p.totalVirupas)} Virupas)
                  </span>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-3">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      isExceeding
                        ? 'bg-gradient-to-r from-emerald-400 to-amber-300'
                        : 'bg-gradient-to-r from-amber-500 to-rose-400'
                    }`}
                    style={{ width: `${Math.min(100, (p.totalRupas / (p.requiredRupas * 1.5)) * 100)}%` }}
                  />
                </div>

                {/* 6 Bala Breakdown Badges */}
                <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono text-slate-300">
                  <div className="bg-cosmic-900/60 p-1 rounded border border-slate-800/60">
                    <span className="text-slate-500 block">Sthana</span>
                    {formatNumber(p.sthanaBala)}
                  </div>
                  <div className="bg-cosmic-900/60 p-1 rounded border border-slate-800/60">
                    <span className="text-slate-500 block">Dig</span>
                    {formatNumber(p.digBala)}
                  </div>
                  <div className="bg-cosmic-900/60 p-1 rounded border border-slate-800/60">
                    <span className="text-slate-500 block">Kaala</span>
                    {formatNumber(p.kaalaBala)}
                  </div>
                  <div className="bg-cosmic-900/60 p-1 rounded border border-slate-800/60">
                    <span className="text-slate-500 block">Chesta</span>
                    {formatNumber(p.chestaBala)}
                  </div>
                  <div className="bg-cosmic-900/60 p-1 rounded border border-slate-800/60">
                    <span className="text-slate-500 block">Naisarg</span>
                    {formatNumber(p.naisargikaBala)}
                  </div>
                  <div className="bg-cosmic-900/60 p-1 rounded border border-slate-800/60">
                    <span className="text-slate-500 block">Drik</span>
                    {p.drikBala >= 0 ? `+${formatNumber(p.drikBala)}` : formatNumber(p.drikBala)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
