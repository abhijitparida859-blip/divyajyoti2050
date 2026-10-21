import React, { useState } from 'react';
import { useI18n } from '../../localization/i18n';
import { FullAshtakavargaData, PlanetName } from '../../types/jataka';
import { Layers } from 'lucide-react';

interface Props {
  ashtakavarga: FullAshtakavargaData;
}

export const AshtakavargaMatrixView: React.FC<Props> = ({ ashtakavarga }) => {
  const { t, formatNumber, tGraha } = useI18n();
  const [activeReduction, setActiveReduction] = useState<'none' | 'trikona' | 'ekadhipatya'>('none');

  const planets: PlanetName[] = ['Surya', 'Chandra', 'Mangala', 'Budha', 'Guru', 'Shukra', 'Shani'];
  const activeRow = activeReduction === 'none'
    ? ashtakavarga.sarvashtakavarga
    : activeReduction === 'trikona'
    ? ashtakavarga.trikonaShodhana
    : ashtakavarga.ekadhipatyaShodhana;

  return (
    <div className="bg-cosmic-900/70 border border-cosmic-gold/30 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 font-serif">
            <Layers className="w-5 h-5 text-cosmic-gold" />
            <span>Parashari Ashtakavarga 8×12 Matrix & Shodhana (ଅଷ୍ଟକବର୍ଗ ବିନ୍ଦୁ ଚକ୍ର)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Canonical 337 Total Sarvashtakavarga Bindus across 12 houses with Trikona & Ekadhipatya Shodhana.
          </p>
        </div>

        {/* Reduction Switcher */}
        <div className="flex items-center gap-1.5 bg-cosmic-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveReduction('none')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeReduction === 'none' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Raw SAV (337)
          </button>
          <button
            onClick={() => setActiveReduction('trikona')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeReduction === 'trikona' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Trikona Shodhana
          </button>
          <button
            onClick={() => setActiveReduction('ekadhipatya')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeReduction === 'ekadhipatya' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Ekadhipatya
          </button>
        </div>
      </div>

      {/* 8x12 Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-center text-xs text-slate-200 border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-cosmic-950/80 text-slate-400 font-semibold">
              <th className="py-2.5 px-3 text-left">Graha</th>
              {Array.from({ length: 12 }, (_, i) => (
                <th key={i} className="py-2.5 px-2 text-cosmic-gold font-mono">
                  H{formatNumber(i + 1)}
                </th>
              ))}
              <th className="py-2.5 px-3 text-amber-300 font-mono">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {planets.map(p => {
              const bav = ashtakavarga.bav[p];
              return (
                <tr key={p} className="hover:bg-white/5 transition-colors">
                  <td className="py-2.5 px-3 text-left font-bold text-slate-200 font-sans">
                    {tGraha(p)}
                  </td>
                  {bav.bindus.map((b, hIdx) => (
                    <td key={hIdx} className={`py-2.5 px-2 font-bold ${
                      b >= 5 ? 'text-emerald-400' : b <= 2 ? 'text-rose-400' : 'text-slate-300'
                    }`}>
                      {formatNumber(b)}
                    </td>
                  ))}
                  <td className="py-2.5 px-3 font-black text-amber-300 bg-amber-500/10">
                    {formatNumber(bav.totalBindus)}
                  </td>
                </tr>
              );
            })}

            {/* Sum / Active Row */}
            <tr className="bg-cosmic-950 font-black text-sm border-t-2 border-amber-400/60">
              <td className="py-3 px-3 text-left text-amber-300 font-sans">
                {activeReduction === 'none' ? 'SARVASHTAKAVARGA' : activeReduction === 'trikona' ? 'TRIKONA SHODHITA' : 'EKADHIPATYA SHODHITA'}
              </td>
              {activeRow.map((pts, idx) => (
                <td key={idx} className={`py-3 px-2 ${
                  pts >= 30 ? 'text-emerald-400 font-black' : pts <= 25 ? 'text-rose-400' : 'text-amber-300'
                }`}>
                  {formatNumber(pts)}
                </td>
              ))}
              <td className="py-3 px-3 text-amber-300 bg-amber-500/20 font-black text-base">
                {formatNumber(activeRow.reduce((a, b) => a + b, 0))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
