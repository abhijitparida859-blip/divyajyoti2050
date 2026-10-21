import React from 'react';
import { useI18n } from '../../localization/i18n';
import { BhavaChalitData } from '../../types/jataka';
import { Compass, AlertCircle } from 'lucide-react';

interface Props {
  bhavaChalit: BhavaChalitData;
}

export const BhavaChalitView: React.FC<Props> = ({ bhavaChalit }) => {
  const { t, formatNumber, tRashi, tGraha } = useI18n();

  return (
    <div className="bg-cosmic-900/70 border border-cosmic-gold/30 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 font-serif">
          <Compass className="w-5 h-5 text-cosmic-gold" />
          <span>Sripati Bhava Chalit Cusps & Shifts (ଭାବ ଚଳିତ ଚକ୍ର)</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Exact Bhava Arambha (Beginning), Bhava Madhya (Peak Cusp), and Bhava Anta (Ending) degrees.
        </p>
      </div>

      {bhavaChalit.shiftedPlanets.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          <div className="text-xs text-amber-200">
            <span className="font-bold">Shifted Planets Detected: </span>
            {bhavaChalit.shiftedPlanets.map(sp => (
              <span key={sp.planet} className="mr-2 font-semibold">
                {tGraha(sp.planet)} (Rashi: H{formatNumber(sp.rashiHouse)} ➔ Chalit: H{formatNumber(sp.chalitHouse)})
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-200">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold font-mono">
              <th className="pb-3">{t('house_col')}</th>
              <th className="pb-3">Cusp Sign</th>
              <th className="pb-3">Arambha (Start)</th>
              <th className="pb-3">Madhya (Cusp Peak)</th>
              <th className="pb-3">Anta (End)</th>
              <th className="pb-3">Planets In Chalit Bhava</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {bhavaChalit.cusps.map(c => (
              <tr key={c.houseNumber} className="hover:bg-white/5 transition-colors">
                <td className="py-2.5 font-bold text-cosmic-gold font-sans">
                  Bhava {formatNumber(c.houseNumber)}
                </td>
                <td className="py-2.5 text-cosmic-celestial font-semibold font-sans">{tRashi(c.sign)}</td>
                <td className="py-2.5 text-slate-400">{formatNumber(c.bhavaArambha)}°</td>
                <td className="py-2.5 text-amber-300 font-bold">{formatNumber(c.bhavaMadhya)}°</td>
                <td className="py-2.5 text-slate-400">{formatNumber(c.bhavaAnta)}°</td>
                <td className="py-2.5 text-slate-200 font-sans">
                  {c.planetsInBhava.length > 0 ? (
                    <span className="font-bold text-amber-300">
                      {c.planetsInBhava.map(p => tGraha(p)).join(', ')}
                    </span>
                  ) : (
                    <span className="text-slate-600">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
