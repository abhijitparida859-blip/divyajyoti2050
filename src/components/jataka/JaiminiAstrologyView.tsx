import React from 'react';
import { useI18n } from '../../localization/i18n';
import { JaiminiData } from '../../types/jataka';
import { Compass } from 'lucide-react';

interface Props {
  jaimini: JaiminiData;
}

export const JaiminiAstrologyView: React.FC<Props> = ({ jaimini }) => {
  const { t, formatNumber, tRashi, tGraha, language } = useI18n();

  return (
    <div className="bg-cosmic-900/70 border border-cosmic-gold/30 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 font-serif">
          <Compass className="w-5 h-5 text-cosmic-gold" />
          <span>Maharishi Jaimini Sutra Astrology (ଜୈମିନି ଚର କାରକ ଓ ଆରୁଢ଼ ଲଗ୍ନ)</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          7 Chara Karakas, Arudha Lagna (AL), Upapada Lagna (UL), and Karakamsha analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-cosmic-950/80 border border-cosmic-gold/30 rounded-2xl p-4">
          <span className="text-xs font-bold text-cosmic-gold block mb-1">
            🏛️ Arudha Lagna (AL) • ପଦ ଲଗ୍ନ
          </span>
          <div className="text-base font-black text-amber-300">
            {tRashi(jaimini.arudhaLagna.sign)} (H{formatNumber(jaimini.arudhaLagna.house)})
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Governs societal perception, career reputation, public image, and material wealth.
          </p>
        </div>

        <div className="bg-cosmic-950/80 border border-cosmic-gold/30 rounded-2xl p-4">
          <span className="text-xs font-bold text-rose-400 block mb-1">
            💍 Upapada Lagna (UL) • ଉପପଦ ଲଗ୍ନ
          </span>
          <div className="text-base font-black text-rose-300">
            {tRashi(jaimini.upapadaLagna.sign)} (H{formatNumber(jaimini.upapadaLagna.house)})
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Reveals matrimonial sanctity, marital longevity, and character of spouse.
          </p>
        </div>

        <div className="bg-cosmic-950/80 border border-cosmic-gold/30 rounded-2xl p-4">
          <span className="text-xs font-bold text-cyan-400 block mb-1">
            ✨ Karakamsha Lagna • କାରକାଂଶ
          </span>
          <div className="text-base font-black text-cyan-300">
            {tRashi(jaimini.karakamsha.sign)} (in D9)
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Highest spiritual mission of the soul and devotion to Ishta Devata.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-200">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold">
              <th className="pb-3">Karaka Role</th>
              <th className="pb-3">{t('planet_col')}</th>
              <th className="pb-3">{t('rashi_col')}</th>
              <th className="pb-3">Degree In Sign</th>
              <th className="pb-3">Core Signification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {jaimini.charaKarakas.map(k => (
              <tr key={k.karaka} className="hover:bg-white/5 transition-colors">
                <td className="py-2.5 font-bold text-amber-300 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-bold flex items-center justify-center font-mono">
                    {k.karaka}
                  </span>
                  <span>{k.karakaName[language]}</span>
                </td>
                <td className="py-2.5 font-bold text-slate-100">{tGraha(k.planet)}</td>
                <td className="py-2.5 text-cosmic-celestial font-semibold">{tRashi(k.sign)}</td>
                <td className="py-2.5 font-mono text-slate-300">{formatNumber(k.degreeInSign)}°</td>
                <td className="py-2.5 text-slate-300 text-xs">{k.signification[language]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
