import React from 'react';
import { useI18n } from '../../localization/i18n';
import { BhriguNandiNadiData } from '../../types/jataka';
import { Compass, Sparkles, Orbit, Clock, Target } from 'lucide-react';

interface Props {
  nadiAstrology: BhriguNandiNadiData;
}

export const BhriguNandiNadiView: React.FC<Props> = ({ nadiAstrology }) => {
  const { language, tGraha } = useI18n();

  return (
    <div className="bg-cosmic-900/70 border border-cosmic-gold/30 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 font-serif">
          <Orbit className="w-5 h-5 text-cosmic-gold" />
          <span>Bhrigu Nandi Nadi (BNN) Karmic Confluences (ଭୃଗୁ ନନ୍ଦୀ ନାଡ଼ୀ ଯୋଗ)</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Ancient Nadi principles analyzing planetary confluence in the same sign and 1-5-9 trines to uncover your soul's karmic mission.
        </p>
      </div>

      {/* Soul Mission Summary Banner */}
      <div className="bg-gradient-to-r from-cosmic-950/90 via-slate-900 to-cosmic-950/90 border border-cosmic-gold/40 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
        <Target className="w-5 h-5 text-cosmic-gold shrink-0 mt-0.5" />
        <div>
          <span className="text-xs uppercase font-bold text-cosmic-gold tracking-wider block mb-1">
            Karmic Soul Blueprint (କାର୍ମିକ ଜୀବନ ଉଦ୍ଦେଶ୍ୟ)
          </span>
          <p className="text-xs text-slate-200 leading-relaxed font-serif">
            {nadiAstrology.karmicMissionSummary[language]}
          </p>
        </div>
      </div>

      {/* Combinations List */}
      <div className="space-y-4">
        {nadiAstrology.combinations.map((comb) => {
          return (
            <div
              key={comb.id}
              className="bg-cosmic-950/80 border border-slate-800 hover:border-cosmic-gold/40 rounded-2xl p-4 sm:p-5 transition-all space-y-3"
            >
              {/* Top row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="w-2.5 h-2.5 rounded-full bg-cosmic-gold" />
                  <span className="text-sm font-bold text-amber-300 font-serif">
                    {comb.title[language]}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                    {comb.type} Confluence
                  </span>
                  <div className="flex gap-1">
                    {comb.planets.map((p) => (
                      <span
                        key={p}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700"
                      >
                        {tGraha(p)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Karmic Manifestation */}
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Karmic Manifestation & Talents (କର୍ମ ଫଳାଫଳ)
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {comb.karmicManifestation[language]}
                </p>
              </div>

              {/* Destiny Pattern */}
              <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400 block mb-0.5">
                    Destiny Pattern & Milestone Timeline (ଭାଗ୍ୟୋଦୟ ସମୟ)
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {comb.destinyPattern[language]}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
