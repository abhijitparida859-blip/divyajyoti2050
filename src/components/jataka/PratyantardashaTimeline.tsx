import React, { useState } from 'react';
import { useI18n } from '../../localization/i18n';
import { DashaPeriod, PlanetName } from '../../types/jataka';
import { getDashaPhala } from '../../core/jataka/yearly_forecast_engine';
import { Clock, ChevronDown, ChevronRight, Sparkles, BookOpen } from 'lucide-react';

interface Props {
  dashas: DashaPeriod[];
  currentDasha: {
    mahadasha: PlanetName;
    antardasha: PlanetName;
    pratyantardasha?: PlanetName;
    sookshmasha?: PlanetName;
    pranadasha?: PlanetName;
    startDate: string;
    endDate: string;
    progressPercentage: number;
  };
}

export const PratyantardashaTimeline: React.FC<Props> = ({ dashas, currentDasha }) => {
  const { formatNumber, tGraha, language } = useI18n();
  const [expandedMaha, setExpandedMaha] = useState<string | null>(currentDasha.mahadasha);
  const [expandedAntar, setExpandedAntar] = useState<string | null>(currentDasha.antardasha);

  const now = new Date().getTime();

  return (
    <div className="bg-cosmic-900/70 border border-cosmic-gold/30 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 font-serif">
          <Clock className="w-5 h-5 text-cosmic-gold" />
          <span>5-Tier Vimshottari Dasha Explorer (ପଞ୍ଚସ୍ତରୀୟ ବିଂଶୋତ୍ତରୀ ଦଶା କ୍ରମ)</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Complete 120-Year Natural Lifecycle: Mahadasha ➔ Antardasha ➔ Pratyantardasha ➔ Sookshmasha ➔ Pranadasha.
        </p>
      </div>

      {/* Active Current Dasha Live Card */}
      <div className="bg-gradient-to-r from-amber-500/20 via-cosmic-950 to-cosmic-950 border border-amber-400/40 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-cosmic-gold uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Active Planetary Period Right Now (ବର୍ତ୍ତମାନ ଚଳିତ ଦଶା)</span>
          </span>
          <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full font-black animate-pulse">
            LIVE CURRENT
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-lg font-black text-slate-100 mb-2">
          <span className="text-amber-300">{tGraha(currentDasha.mahadasha)} (Maha)</span>
          <span className="text-slate-500">➔</span>
          <span className="text-cyan-300">{tGraha(currentDasha.antardasha)} (Antar)</span>
          {currentDasha.pratyantardasha && (
            <>
              <span className="text-slate-500">➔</span>
              <span className="text-emerald-300">{tGraha(currentDasha.pratyantardasha)} (Pratyantar)</span>
            </>
          )}
          {currentDasha.sookshmasha && (
            <>
              <span className="text-slate-500">➔</span>
              <span className="text-violet-300">{tGraha(currentDasha.sookshmasha)} (Sookshma)</span>
            </>
          )}
          {currentDasha.pranadasha && (
            <>
              <span className="text-slate-500">➔</span>
              <span className="text-rose-300">{tGraha(currentDasha.pranadasha)} (Prana)</span>
            </>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>{currentDasha.startDate} to {currentDasha.endDate}</span>
        </div>
      </div>

      {/* Dasha Phala: Maha + Antar lord predictions (tri-lingual) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-3">
          <div className="text-[11px] font-black text-amber-300 flex items-center gap-1.5 mb-1"><BookOpen className="w-3.5 h-3.5" /> {tGraha(currentDasha.mahadasha)} Mahadasha Phala</div>
          <div className="text-xs text-slate-200 leading-relaxed">{getDashaPhala(currentDasha.mahadasha)[language]}</div>
        </div>
        <div className="rounded-2xl border border-cyan-400/30 bg-cyan-500/10 p-3">
          <div className="text-[11px] font-black text-cyan-300 flex items-center gap-1.5 mb-1"><BookOpen className="w-3.5 h-3.5" /> {tGraha(currentDasha.antardasha)} Antardasha Phala</div>
          <div className="text-xs text-slate-200 leading-relaxed">{getDashaPhala(currentDasha.antardasha)[language]}</div>
        </div>
      </div>

      {/* 3-Level Expandable Dasha Tree */}
      <div className="space-y-2">
        {dashas.map(maha => {
          const isMahaActive = maha.planet === currentDasha.mahadasha;
          const isMahaOpen = expandedMaha === maha.planet;

          return (
            <div
              key={maha.planet}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isMahaActive
                  ? 'border-amber-400/60 bg-cosmic-950/90 shadow-md ring-1 ring-amber-400/30'
                  : 'border-slate-800/80 bg-cosmic-950/60'
              }`}
            >
              {/* Mahadasha Header Row */}
              <button
                type="button"
                onClick={() => setExpandedMaha(isMahaOpen ? null : maha.planet)}
                className="w-full p-3.5 flex items-center justify-between text-left hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  {isMahaOpen ? (
                    <ChevronDown className="w-4 h-4 text-amber-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  )}
                  <span className={`text-sm font-black ${isMahaActive ? 'text-amber-300' : 'text-slate-100'}`}>
                    {tGraha(maha.planet)} Mahadasha
                  </span>
                  {isMahaActive && (
                    <span className="text-[9px] bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded font-black uppercase">
                      ACTIVE
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                  <span>{formatNumber(maha.durationYears)} yrs</span>
                  <span className="hidden sm:inline text-slate-500">{maha.startDate} ~ {maha.endDate}</span>
                </div>
              </button>

              {/* Antardashas List (Level 2) */}
              {isMahaOpen && maha.subDashas && (
                <div className="border-t border-slate-800/80 bg-cosmic-900/40 p-2 sm:p-3 space-y-2">
                  {maha.subDashas.map(antar => {
                    const isAntarActive = isMahaActive && antar.planet === currentDasha.antardasha;
                    const isAntarOpen = expandedAntar === `${maha.planet}_${antar.planet}`;

                    return (
                      <div
                        key={antar.planet}
                        className={`rounded-xl border transition-all ${
                          isAntarActive
                            ? 'border-cyan-400/60 bg-cyan-950/20'
                            : 'border-slate-800/60 bg-cosmic-950/40'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setExpandedAntar(isAntarOpen ? null : `${maha.planet}_${antar.planet}`)}
                          className="w-full p-2.5 flex items-center justify-between text-left hover:bg-white/5 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2 pl-2">
                            {isAntarOpen ? (
                              <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                            )}
                            <span className={`text-xs font-bold ${isAntarActive ? 'text-cyan-300' : 'text-slate-200'}`}>
                              {tGraha(antar.planet)} Antardasha
                            </span>
                            {isAntarActive && (
                              <span className="text-[8px] bg-cyan-500 text-slate-950 px-1.5 py-0.2 rounded font-black uppercase">
                                ACTIVE SUB
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                            <span>{formatNumber(antar.durationYears)} yrs</span>
                            <span className="text-slate-500">{antar.startDate} to {antar.endDate}</span>
                          </div>
                        </button>

                        {/* Pratyantardashas (Level 3) */}
                        {isAntarOpen && antar.subDashas && (
                          <div className="border-t border-slate-800/60 bg-cosmic-950/70 p-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 font-mono text-xs">
                            {antar.subDashas.map(prat => {
                              const s = new Date(prat.startDate).getTime();
                              const e = new Date(prat.endDate).getTime();
                              const isPratActive = isAntarActive && now >= s && now <= e;

                              return (
                                <div
                                  key={prat.planet}
                                  className={`p-2 rounded-lg border flex items-center justify-between ${
                                    isPratActive
                                      ? 'border-emerald-400/60 bg-emerald-950/30 text-emerald-300 font-black ring-1 ring-emerald-400/40'
                                      : 'border-slate-800/60 bg-cosmic-900/40 text-slate-300'
                                  }`}
                                >
                                  <div>
                                    <span className="font-bold font-sans">{tGraha(prat.planet)}</span>
                                    <span className="text-[10px] text-slate-400 block">{prat.startDate}</span>
                                    {prat.subDashas && (
                                      <span className="text-[9px] text-violet-300/80 block">
                                        +{prat.subDashas.length} Sookshma • +{prat.subDashas.length * 9} Prana
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <span className="text-[10px] text-slate-400 block">{prat.endDate}</span>
                                    {isPratActive && (
                                      <span className="text-[8px] bg-emerald-500 text-slate-950 px-1 rounded font-black">
                                        TODAY
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
