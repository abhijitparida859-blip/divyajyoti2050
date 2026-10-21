import React from 'react';
import { useI18n } from '../../localization/i18n';
import { VedicRemediesData } from '../../types/jataka';
import { Sparkles } from 'lucide-react';

interface Props {
  remedies: VedicRemediesData;
}

export const VedicRemediesView: React.FC<Props> = ({ remedies }) => {
  const { tGraha, language } = useI18n();

  return (
    <div className="bg-cosmic-900/70 border border-cosmic-gold/30 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 font-serif">
          <Sparkles className="w-5 h-5 text-cosmic-gold" />
          <span>Shastric Gemstone, Rudraksha & Jagannath Upachara (ବୈଦିକ ଉପଚାର ଓ ରତ୍ନ ବିଶ୍ଳେଷଣ)</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Authentic gemstones, consecrated Rudrakshas, and Srimandir Jagannath seva remedies.
        </p>
      </div>

      <div>
        <h4 className="text-xs font-bold text-cosmic-gold uppercase tracking-wider mb-3">
          💎 Prescribed Auspicious Gemstones (ଶୁଭ ରତ୍ନ ସୁପାରିଶ)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {remedies.gemstones.map(g => (
            <div
              key={g.type}
              className="bg-cosmic-950/80 border border-cosmic-gold/30 rounded-2xl p-4 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cosmic-gold bg-cosmic-gold/15 px-2 py-0.5 rounded-full inline-block mb-2">
                  {g.typeName[language]}
                </span>
                <div className="text-base font-black text-amber-300 mb-1">
                  {g.gemstone[language]}
                </div>
                <div className="text-xs text-slate-300 font-medium mb-3">
                  Ruling: {tGraha(g.rulingPlanet)} • Metal: {g.metal[language]}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  {g.benefits[language]}
                </p>
              </div>

              <div className="border-t border-slate-800 pt-2.5 text-[11px] text-amber-300 space-y-1">
                <div>✦ Wear: {g.finger[language]} on {g.dayToWear[language]}</div>
                <div className="font-mono text-[10px] text-slate-400">Mantra: {g.mantra}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
          📿 Divine Rudraksha Recommendations (ରୁଦ୍ରାକ୍ଷ ଧାରଣ)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {remedies.rudrakshas.map(r => (
            <div
              key={r.mukhi}
              className="bg-cosmic-950/80 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between"
            >
              <div>
                <div className="text-sm font-bold text-amber-300 mb-1">
                  {r.name[language]}
                </div>
                <div className="text-xs text-slate-400 mb-2">
                  Deity: {r.deity[language]} • Planet: {tGraha(r.rulingPlanet)}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {r.benefits[language]}
                </p>
              </div>
              <div className="text-[11px] text-cosmic-gold font-mono border-t border-slate-800 pt-2">
                Mantra: {r.mantra}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-amber-500/15 via-cosmic-950 to-amber-500/15 border border-amber-400/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-300 block mb-1">
            🛕 Srimandir Jagannath Divine Remedial Seva (ଶ୍ରୀମନ୍ଦିର ସେବା ଓ ଉପଚାର)
          </span>
          <div className="text-sm font-bold text-slate-100">
            Recommended Besha: <span className="text-amber-300">{remedies.jagannathRemedy.besha}</span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            {remedies.jagannathRemedy.guidance[language]}
          </p>
          <div className="text-[11px] text-cosmic-gold font-medium mt-1">
            ✦ Recommended Stotra: {remedies.jagannathRemedy.stotra}
          </div>
        </div>
      </div>
    </div>
  );
};
