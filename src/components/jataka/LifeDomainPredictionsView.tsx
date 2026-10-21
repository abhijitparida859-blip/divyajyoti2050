import React, { useState } from 'react';
import { useI18n } from '../../localization/i18n';
import { ComprehensiveLifeDomainsData } from '../../types/jataka';
import {
  Briefcase, Coins, Heart, Activity, GraduationCap,
  Compass, Star, Clock, Sparkles
} from 'lucide-react';

interface Props {
  lifeDomains: ComprehensiveLifeDomainsData;
}

export const LifeDomainPredictionsView: React.FC<Props> = ({ lifeDomains }) => {
  const { language, tGraha } = useI18n();
  const [selectedDomain, setSelectedDomain] = useState<string>('career');

  const getDomainIcon = (id: string) => {
    switch (id) {
      case 'career': return Briefcase;
      case 'wealth': return Coins;
      case 'marriage': return Heart;
      case 'health': return Activity;
      case 'education': return GraduationCap;
      case 'spirituality':
      default:
        return Compass;
    }
  };

  const activeItem = lifeDomains.domains.find(d => d.domainId === selectedDomain) || lifeDomains.domains[0];
  const ActiveIcon = getDomainIcon(activeItem.domainId);

  return (
    <div className="bg-cosmic-900/70 border border-cosmic-gold/30 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 font-serif">
          <Briefcase className="w-5 h-5 text-cosmic-gold" />
          <span>Exhaustive Multi-Domain Life Chapters (ବିସ୍ତୃତ ଜୀବନ କ୍ଷେତ୍ର ବିଶ୍ଳେଷଣ)</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          In-depth synthesis of natal houses, ruling lords, divisional charts, and Mahadasha promises across major life milestones.
        </p>
      </div>

      {/* Domain Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {lifeDomains.domains.map((dom) => {
          const Icon = getDomainIcon(dom.domainId);
          const isSelected = selectedDomain === dom.domainId;
          return (
            <button
              key={dom.domainId}
              type="button"
              onClick={() => setSelectedDomain(dom.domainId)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[72px] ${
                isSelected
                  ? 'bg-gradient-to-br from-cosmic-gold/20 via-slate-900 to-cosmic-950 border-cosmic-gold shadow-lg shadow-cosmic-gold/10'
                  : 'bg-cosmic-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-1 w-full mb-1">
                <Icon className={`w-4 h-4 ${isSelected ? 'text-cosmic-gold' : 'text-slate-400'}`} />
                <div className="flex text-amber-400 text-[10px]">
                  {Array.from({ length: dom.rating }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
              </div>
              <span className={`text-xs font-bold truncate ${isSelected ? 'text-amber-200' : 'text-slate-300'}`}>
                {dom.title[language]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Domain Detailed Presentation */}
      <div className="bg-cosmic-950/90 border border-cosmic-gold/40 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl">
        {/* Title & Key Influences */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cosmic-gold/15 border border-cosmic-gold/40 flex items-center justify-center text-cosmic-gold">
              <ActiveIcon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-100 font-serif">
                {activeItem.title[language]}
              </h4>
              <div className="text-xs text-slate-400 flex items-center gap-2 flex-wrap">
                <span>Key Grahas: <b className="text-cosmic-gold">{activeItem.keyPlanets.map(p => tGraha(p)).join(', ')}</b></span>
                <span>•</span>
                <span>Houses: <b className="text-indigo-300">H{activeItem.auspiciousHouses.join(', H')}</b></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Potency:</span>
            <div className="flex text-amber-400 text-xs">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < activeItem.rating ? 'text-amber-400' : 'text-slate-700'}>
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Analysis Paragraph */}
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/90">
          <span className="text-xs uppercase font-bold text-cosmic-gold block mb-2 tracking-wider">
            Shastric Synthesis & Life Prediction (ଜୀବନ ଭବିଷ୍ୟବାଣୀ)
          </span>
          <p className="text-xs text-slate-200 leading-relaxed font-serif text-justify sm:text-left">
            {activeItem.analysis[language]}
          </p>
        </div>

        {/* Milestone Years Timeline */}
        <div className="space-y-1.5">
          <span className="text-xs uppercase font-bold text-slate-400 flex items-center gap-1.5 tracking-wider">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Favorable Milestone & Activation Years (ଶୁଭ ସମୟ)</span>
          </span>
          <div className="flex gap-2 flex-wrap pt-1">
            {activeItem.milestoneYears.map((yr) => (
              <span
                key={yr}
                className="text-xs font-bold px-3 py-1 rounded-xl bg-slate-900 border border-cosmic-gold/30 text-amber-300"
              >
                Age {yr}
              </span>
            ))}
          </div>
        </div>

        {/* Strategic Remedy */}
        <div className="bg-gradient-to-r from-slate-900 via-cosmic-950 to-slate-900 border border-cosmic-gold/30 rounded-xl p-3.5 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-cosmic-gold shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-cosmic-gold block mb-0.5">Recommended Remedy (ଶାସ୍ତ୍ରୀୟ ଉପଚାର):</span>
            <span className="text-slate-300 leading-relaxed">{activeItem.strategicRemedy[language]}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
