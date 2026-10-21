import React from 'react';
import { useI18n } from '../../localization/i18n';
import { NakshatraSacredData } from '../../types/jataka';
import { TreePine, Sparkles, Compass, Bird, Shield, Flame } from 'lucide-react';

interface Props {
  nakshatraSacred: NakshatraSacredData;
}

export const NakshatraSacredView: React.FC<Props> = ({ nakshatraSacred }) => {
  const { language } = useI18n();

  return (
    <div className="bg-cosmic-900/70 border border-cosmic-gold/30 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 font-serif">
            <TreePine className="w-5 h-5 text-emerald-400" />
            <span>Sacred Nakshatra Lore, Trees & Pada Destiny (ନକ୍ଷତ୍ର ବୃକ୍ଷ, ଦେବତା ଓ ପାଦ ବିଚାର)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Astrological bio-resonance through your birth star's sacred tree, presiding Vedic deity, and quarter destiny.
          </p>
        </div>

        <div className="bg-cosmic-950/90 border border-cosmic-gold/40 px-3 py-1 rounded-xl text-xs font-bold text-amber-300 self-start sm:self-auto">
          {nakshatraSacred.nakshatraName[language]} • Pada {nakshatraSacred.pada}
        </div>
      </div>

      {/* Grid: Sacred Tree & Deity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sacred Tree Card */}
        <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-cosmic-950 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs uppercase font-bold tracking-wider mb-2">
              <TreePine className="w-4 h-4" />
              <span>Sacred Astrological Tree (ନକ୍ଷତ୍ର ବୃକ୍ଷ)</span>
            </div>
            <div className="text-lg font-bold text-emerald-200 mb-0.5 font-serif">
              {nakshatraSacred.sacredTree.odiaName}
            </div>
            <div className="text-xs text-slate-400 font-mono italic mb-2">
              {nakshatraSacred.sacredTree.botanicalName} ({nakshatraSacred.sacredTree.englishName})
            </div>
            <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-2.5">
              {nakshatraSacred.sacredTree.spiritualSignificance[language]}
            </p>
          </div>
          <div className="bg-emerald-950/60 border border-emerald-500/20 rounded-xl p-2.5 text-[11px] text-emerald-300">
            🌱 <b>Shastric Recommendation:</b> Planting, caring for, or touching this sacred tree on your birth nakshatra dispels planetary afflictions.
          </div>
        </div>

        {/* Presiding Deity Card */}
        <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-cosmic-950 border border-amber-500/40 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs uppercase font-bold tracking-wider mb-2">
              <Flame className="w-4 h-4" />
              <span>Presiding Vedic Deity (ଆରାଧ୍ୟ ଦେବତା)</span>
            </div>
            <div className="text-lg font-bold text-amber-200 mb-1 font-serif">
              {nakshatraSacred.deity.name[language]}
            </div>
            <div className="bg-slate-950/80 border border-amber-500/30 rounded-xl p-2.5 my-2 text-xs text-amber-300 font-serif">
              Mantra: <b className="font-bold">{nakshatraSacred.deity.mantra}</b>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-2">
              {nakshatraSacred.deity.blessing[language]}
            </p>
          </div>
        </div>
      </div>

      {/* Totems & Pada Destiny */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Symbol */}
        <div className="bg-cosmic-950/80 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Cosmic Symbol (ପ୍ରତୀକ)</span>
          <span className="text-sm font-bold text-slate-100 block font-serif">{nakshatraSacred.symbol[language]}</span>
          <p className="text-[11px] text-slate-400">Esoteric gateway of the asterism</p>
        </div>

        {/* Sacred Bird */}
        <div className="bg-cosmic-950/80 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Sacred Bird (ନକ୍ଷତ୍ର ପକ୍ଷୀ)</span>
          <span className="text-sm font-bold text-slate-100 block font-serif">{nakshatraSacred.bird[language]}</span>
          <p className="text-[11px] text-slate-400">Air totem & instinctive grace</p>
        </div>

        {/* Pada Destiny Quarter */}
        <div className="bg-cosmic-950/80 border border-cosmic-gold/30 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] uppercase font-bold text-cosmic-gold block">
            Pada {nakshatraSacred.pada} Soul Path (ପାଦ ବିଚାର)
          </span>
          <p className="text-xs text-slate-200 leading-relaxed">
            {nakshatraSacred.padaDestiny[language]}
          </p>
        </div>
      </div>
    </div>
  );
};
