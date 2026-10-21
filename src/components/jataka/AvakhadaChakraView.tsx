import React from 'react';
import { useI18n } from '../../localization/i18n';
import { AvakhadaData, GhatakaData } from '../../types/jataka';
import { ShieldAlert, Compass, AlertTriangle, Heart, Activity } from 'lucide-react';

interface Props {
  avakhada: AvakhadaData;
  ghataka: GhatakaData;
}

export const AvakhadaChakraView: React.FC<Props> = ({ avakhada, ghataka }) => {
  const { language } = useI18n();

  return (
    <div className="bg-cosmic-900/70 border border-cosmic-gold/30 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 font-serif">
          <Compass className="w-5 h-5 text-cosmic-gold" />
          <span>Avakhada Chakra & Ghataka Warnings (ଅବକହଡ଼ା ଚକ୍ର ଓ ଘାତକ ବିଚାର)</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Classical Parashari elemental attributes, Ayurvedic constitution, and auspicious timing warnings.
        </p>
      </div>

      {/* Avakhada Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Varna */}
        <div className="bg-cosmic-950/80 border border-slate-800 hover:border-cosmic-gold/40 rounded-2xl p-3 sm:p-4 transition-all">
          <span className="text-[10px] uppercase font-bold text-cosmic-gold tracking-wider block mb-1">
            Varna (ବର୍ଣ୍ଣ)
          </span>
          <div className="text-sm sm:text-base font-bold text-slate-100 mb-1">
            {avakhada.varna[language]}
          </div>
          <p className="text-[11px] text-slate-400">Natural soul archetype & disposition</p>
        </div>

        {/* Vashya */}
        <div className="bg-cosmic-950/80 border border-slate-800 hover:border-cosmic-gold/40 rounded-2xl p-3 sm:p-4 transition-all">
          <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block mb-1">
            Vashya (ବଶ୍ୟ)
          </span>
          <div className="text-sm sm:text-base font-bold text-slate-100 mb-1">
            {avakhada.vashya[language]}
          </div>
          <p className="text-[11px] text-slate-400">Control dynamics & compatibility nature</p>
        </div>

        {/* Yoni */}
        <div className="bg-cosmic-950/80 border border-slate-800 hover:border-cosmic-gold/40 rounded-2xl p-3 sm:p-4 transition-all">
          <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block mb-1">
            Yoni (ଯୋନି)
          </span>
          <div className="text-sm sm:text-base font-bold text-slate-100 mb-0.5">
            {avakhada.yoni[language]}
          </div>
          <div className="text-[10px] text-rose-400 font-medium">
            Enemy: {avakhada.yoni.enemyYoni}
          </div>
        </div>

        {/* Gana */}
        <div className="bg-cosmic-950/80 border border-slate-800 hover:border-cosmic-gold/40 rounded-2xl p-3 sm:p-4 transition-all">
          <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider block mb-1">
            Gana (ଗଣ)
          </span>
          <div className="text-sm sm:text-base font-bold text-slate-100 mb-0.5">
            {avakhada.gana[language]}
          </div>
          <p className="text-[10px] text-slate-400 line-clamp-1">{avakhada.gana.trait[language]}</p>
        </div>

        {/* Nadi */}
        <div className="bg-cosmic-950/80 border border-slate-800 hover:border-cosmic-gold/40 rounded-2xl p-3 sm:p-4 transition-all">
          <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider block mb-1">
            Nadi (ନାଡ଼ି)
          </span>
          <div className="text-sm sm:text-base font-bold text-slate-100 mb-0.5">
            {avakhada.nadi[language]}
          </div>
          <span className="text-[10px] text-cyan-300 font-mono">Dosha: {avakhada.nadi.dosha}</span>
        </div>

        {/* Tatwa */}
        <div className="bg-cosmic-950/80 border border-slate-800 hover:border-cosmic-gold/40 rounded-2xl p-3 sm:p-4 transition-all">
          <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider block mb-1">
            Tatwa (ତତ୍ତ୍ୱ)
          </span>
          <div className="text-sm sm:text-base font-bold text-slate-100 mb-1">
            {avakhada.tatwa[language]}
          </div>
          <p className="text-[11px] text-slate-400">Core primordial element</p>
        </div>

        {/* Pada */}
        <div className="bg-cosmic-950/80 border border-slate-800 hover:border-cosmic-gold/40 rounded-2xl p-3 sm:p-4 transition-all">
          <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider block mb-1">
            Pada (ପାଦ)
          </span>
          <div className="text-sm sm:text-base font-bold text-slate-100 mb-1">
            {avakhada.pada} / 4
          </div>
          <p className="text-[11px] text-slate-400">Nakshatra quarter division</p>
        </div>

        {/* Nama Aksharas */}
        <div className="bg-cosmic-950/80 border border-slate-800 hover:border-cosmic-gold/40 rounded-2xl p-3 sm:p-4 transition-all">
          <span className="text-[10px] uppercase font-bold text-cosmic-gold tracking-wider block mb-1">
            Nama Aksharas (ନାମାକ୍ଷର)
          </span>
          <div className="flex gap-1.5 flex-wrap">
            {avakhada.namaAksharas.map((s, idx) => (
              <span
                key={idx}
                className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
                  idx + 1 === avakhada.pada
                    ? 'bg-cosmic-gold/25 text-amber-300 border border-cosmic-gold/60 ring-1 ring-cosmic-gold/30'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {s}
              </span>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Highlighted for Pada {avakhada.pada}</p>
        </div>
      </div>

      {/* Ayurvedic Guidance */}
      <div className="bg-gradient-to-r from-cyan-950/40 to-slate-900/60 border border-cyan-500/30 rounded-2xl p-4">
        <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-2 mb-1.5 uppercase tracking-wider">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>Ayurvedic Health & Constitution Guidance ({avakhada.nadi.dosha} Dosha)</span>
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          {avakhada.nadi.ayurvedicGuidance[language]}
        </p>
      </div>

      {/* Ghataka Chakra Box */}
      <div className="bg-gradient-to-br from-rose-950/40 via-cosmic-950/90 to-slate-900 border border-rose-500/40 rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <h4 className="text-sm font-bold text-rose-300 uppercase tracking-wider font-serif">
            Authentic Ghataka Chakra Warnings (ଘାତକ ବିଚାର ସତର୍କତା)
          </h4>
        </div>
        <p className="text-xs text-slate-400">
          Inauspicious combinations according to Classical Srimandir & Parashari Jyotish. Refrain from commencing major new endeavors, high-value pacts, or invasive procedures during these times.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs pt-1">
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-rose-500/20">
            <span className="text-[10px] text-rose-400 block font-semibold">Ghataka Rashi</span>
            <span className="font-bold text-slate-200">{ghataka.ghatakaRashi}</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-rose-500/20">
            <span className="text-[10px] text-rose-400 block font-semibold">Ghataka Masa</span>
            <span className="font-bold text-slate-200">{ghataka.ghatakaMasa}</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-rose-500/20">
            <span className="text-[10px] text-rose-400 block font-semibold">Ghataka Tithi</span>
            <span className="font-bold text-slate-200">{ghataka.ghatakaTithi}</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-rose-500/20">
            <span className="text-[10px] text-rose-400 block font-semibold">Ghataka Vara</span>
            <span className="font-bold text-slate-200">{ghataka.ghatakaVara}</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-rose-500/20">
            <span className="text-[10px] text-rose-400 block font-semibold">Ghataka Nakshatra</span>
            <span className="font-bold text-slate-200">{ghataka.ghatakaNakshatra}</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-rose-500/20">
            <span className="text-[10px] text-rose-400 block font-semibold">Ghataka Lagna</span>
            <span className="font-bold text-slate-200">{ghataka.ghatakaLagna}</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-rose-500/20 sm:col-span-2">
            <span className="text-[10px] text-rose-400 block font-semibold">Ghataka Prahar</span>
            <span className="font-bold text-slate-200">{ghataka.ghatakaPrahar}</span>
          </div>
        </div>

        <div className="bg-rose-950/60 border border-rose-500/30 rounded-xl p-3 flex items-start gap-2 text-xs text-rose-200 leading-relaxed">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{ghataka.cautionGuidance[language]}</span>
        </div>
      </div>
    </div>
  );
};
