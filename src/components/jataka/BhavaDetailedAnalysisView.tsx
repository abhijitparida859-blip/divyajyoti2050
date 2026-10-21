import React, { useState } from 'react';
import { useI18n } from '../../localization/i18n';
import { BhavaDetailedAnalysis } from '../../types/jataka';
import { Building2, Trophy, AlertCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface Props {
  bhavaAnalysis: BhavaDetailedAnalysis;
}

export const BhavaDetailedAnalysisView: React.FC<Props> = ({ bhavaAnalysis }) => {
  const { language, tGraha, tRashi } = useI18n();
  const [expandedHouse, setExpandedHouse] = useState<number | null>(1); // 1st house expanded by default

  const toggleHouse = (num: number) => {
    setExpandedHouse(expandedHouse === num ? null : num);
  };

  return (
    <div className="bg-cosmic-900/70 border border-cosmic-gold/30 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 font-serif">
            <Building2 className="w-5 h-5 text-cosmic-gold" />
            <span>12 Bhavas Comprehensive Predictive Analysis (ଦ୍ୱାଦଶ ଭାବ ଫଳାଫଳ)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Exhaustive analysis of all 12 houses integrating Lord dignity, occupancy, and Sarvashtakavarga strength.
          </p>
        </div>

        {/* Quick Highlights */}
        <div className="flex gap-2 flex-wrap text-xs">
          <div className="bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 px-3 py-1 rounded-xl flex items-center gap-1.5 font-medium">
            <Trophy className="w-3.5 h-3.5 text-emerald-400" />
            <span>Strongest: {bhavaAnalysis.strongestHouse}th House</span>
          </div>
          <div className="bg-amber-950/70 border border-amber-500/40 text-amber-300 px-3 py-1 rounded-xl flex items-center gap-1.5 font-medium">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Challenging: {bhavaAnalysis.challengingHouse}th House</span>
          </div>
        </div>
      </div>

      {/* Houses Accordion / List */}
      <div className="space-y-3">
        {bhavaAnalysis.bhavas.map((bhava) => {
          const isExpanded = expandedHouse === bhava.houseNumber;
          const scoreColor =
            bhava.strengthScore >= 70
              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
              : bhava.strengthScore >= 48
              ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
              : 'text-rose-400 bg-rose-500/10 border-rose-500/30';

          const progressBarColor =
            bhava.strengthScore >= 70
              ? 'bg-emerald-500'
              : bhava.strengthScore >= 48
              ? 'bg-amber-500'
              : 'bg-rose-500';

          return (
            <div
              key={bhava.houseNumber}
              className={`border rounded-2xl transition-all ${
                isExpanded
                  ? 'bg-cosmic-950/90 border-cosmic-gold/50 shadow-xl'
                  : 'bg-cosmic-950/50 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Accordion Header */}
              <button
                type="button"
                onClick={() => toggleHouse(bhava.houseNumber)}
                className="w-full p-3.5 sm:p-4 text-left flex items-center justify-between gap-3 select-none"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-sm font-bold text-slate-200 shrink-0">
                    {bhava.houseNumber}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      <span className="truncate">{bhava.houseName[language]}</span>
                      {bhava.houseNumber === bhavaAnalysis.strongestHouse && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded font-semibold shrink-0">
                          Apex House
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-2 flex-wrap">
                      <span>Sign: <b className="text-slate-300">{tRashi(bhava.sign)}</b></span>
                      <span>•</span>
                      <span>Lord: <b className="text-amber-300">{tGraha(bhava.lord)}</b> in House {bhava.lordPlacementHouse}</span>
                      {bhava.occupants.length > 0 && (
                        <>
                          <span>•</span>
                          <span>Occupants: <b className="text-indigo-300">{bhava.occupants.map(o => tGraha(o)).join(', ')}</b></span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className={`text-xs font-bold px-2.5 py-1 rounded-xl border flex items-center gap-1.5 ${scoreColor}`}>
                    <span>SAV: {bhava.savBindus}</span>
                    <span className="text-[10px] opacity-75">|</span>
                    <span>{bhava.strengthScore}%</span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Accordion Details */}
              {isExpanded && (
                <div className="px-3.5 pb-4 sm:px-4 sm:pb-5 pt-1 border-t border-slate-800/80 space-y-3">
                  {/* Strength Bar */}
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Bhava Potency Score</span>
                      <span className="font-bold text-slate-200">{bhava.strengthScore} / 100</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${progressBarColor}`}
                        style={{ width: `${bhava.strengthScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Themes */}
                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-cosmic-gold block mb-1">
                      Key Life Domains (ମୁଖ୍ୟ କ୍ଷେତ୍ର)
                    </span>
                    <p className="text-xs text-slate-300">{bhava.keyThemes[language]}</p>
                  </div>

                  {/* Detailed Shastric Prediction */}
                  <div className="bg-gradient-to-r from-slate-900/90 to-cosmic-950/80 p-3.5 rounded-xl border border-cosmic-gold/20">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cosmic-gold" />
                      <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                        Predictive Astrological Synthesis (ଭାବ ଫଳାଫଳ ବିଶ୍ଳେଷଣ)
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {bhava.detailedPrediction[language]}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
