import React from 'react';
import { useI18n } from '../../localization/i18n';
import { GocharaData } from '../../types/jataka';
import { Compass } from 'lucide-react';

interface Props {
  gochara: GocharaData;
}

export const GocharaTransitView: React.FC<Props> = ({ gochara }) => {
  const { t, formatNumber, tRashi, tGraha, language } = useI18n();

  return (
    <div className="bg-cosmic-900/70 border border-cosmic-gold/30 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 font-serif">
            <Compass className="w-5 h-5 text-cosmic-gold" />
            <span>Live Gochara Transit & Sade Sati (ଲାଇଭ୍ ଗ୍ରହ ଗୋଚର ଫଳ)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Real-time planetary transits overlaid on your natal horoscope with Ashtakavarga support.
          </p>
        </div>
        <span className="text-xs text-amber-300 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full font-mono">
          Transit Date: {gochara.transitDate}
        </span>
      </div>

      <div className={`p-4 rounded-2xl border ${
        gochara.sadeSati.isActive
          ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
          : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
      }`}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            🪐 Saturn Transit Status (ଶନି ସାଢ଼େସାତୀ ବିବରଣୀ)
          </span>
          <span className="text-xs font-black px-2 py-0.5 rounded bg-black/40">
            {gochara.sadeSati.phaseOr}
          </span>
        </div>
        <p className="text-xs leading-relaxed opacity-90">
          {gochara.sadeSati.description[language]}
        </p>
        <div className="mt-2 text-[11px] font-semibold text-amber-300 border-t border-white/10 pt-2">
          ✦ Shanti Remedy: {gochara.sadeSati.remedy[language]}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-200">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold">
              <th className="pb-3">{t('planet_col')}</th>
              <th className="pb-3">Transit Rashi</th>
              <th className="pb-3">Deg In Sign</th>
              <th className="pb-3">From Lagna</th>
              <th className="pb-3">From Janma Rashi</th>
              <th className="pb-3">SAV Bindus</th>
              <th className="pb-3">Auspiciousness</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {Object.values(gochara.planets).map(p => (
              <tr key={p.planet} className="hover:bg-white/5 transition-colors">
                <td className="py-2.5 font-bold text-slate-100 font-sans">{tGraha(p.planet)}</td>
                <td className="py-2.5 text-cosmic-celestial font-semibold font-sans">{tRashi(p.sign)}</td>
                <td className="py-2.5 text-slate-300">{formatNumber(p.degreeInSign)}°</td>
                <td className="py-2.5 font-bold text-amber-300">H{formatNumber(p.houseFromLagna)}</td>
                <td className="py-2.5 font-bold text-cosmic-gold">H{formatNumber(p.houseFromMoon)}</td>
                <td className="py-2.5 font-bold text-emerald-400">{formatNumber(p.savPointsInHouse)} pts</td>
                <td className="py-2.5 font-sans">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    p.transitEffect === 'Auspicious' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    p.transitEffect === 'Inauspicious' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {p.transitEffect}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
