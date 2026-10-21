import React, { useState } from 'react';
import { useI18n } from '../../localization/i18n';
import { KpSystemData, PlanetName } from '../../types/jataka';
import { Table, Compass, Info } from 'lucide-react';

interface Props {
  kpSystem: KpSystemData;
}

export const KpSystemView: React.FC<Props> = ({ kpSystem }) => {
  const { language, tGraha, tRashi } = useI18n();
  const [activeTab, setActiveTab] = useState<'planets' | 'cusps'>('planets');

  const planetKeys: PlanetName[] = [
    'Surya', 'Chandra', 'Mangala', 'Budha', 'Guru', 'Shukra', 'Shani', 'Rahu', 'Ketu'
  ];

  const formatDegMinSec = (deg: number) => {
    const d = Math.floor(deg % 30);
    const m = Math.floor(((deg % 30) - d) * 60);
    const s = Math.round(((((deg % 30) - d) * 60) - m) * 60);
    return `${d}° ${String(m).padStart(2, '0')}' ${String(s).padStart(2, '0')}"`;
  };

  return (
    <div className="bg-cosmic-900/70 border border-cosmic-gold/30 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 font-serif">
            <Compass className="w-5 h-5 text-cosmic-gold" />
            <span>Krishnamurti Paddhati (KP System) Sub-Lords (କୃଷ୍ଣମୂର୍ତ୍ତି ପଦ୍ଧତି ଉପ-ପତି)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Authentic 249-based sub-divisions: Sign Lord, Star (Nakshatra) Lord, and event-deciding Sub-Lord.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('planets')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'planets'
                ? 'bg-cosmic-gold text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Planets (ଗ୍ରହ)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cusps')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'cusps'
                ? 'bg-cosmic-gold text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            12 Cusps (ଭାବ ସନ୍ଧି)
          </button>
        </div>
      </div>

      {/* KP Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <th className="p-3">Entity</th>
              <th className="p-3">Longitude</th>
              <th className="p-3">Sign (ରାଶି)</th>
              <th className="p-3">Sign Lord (ରାଶିପତି)</th>
              <th className="p-3">Star Lord (ନକ୍ଷତ୍ରପତି)</th>
              <th className="p-3 text-amber-300">Sub-Lord (ଉପ-ପତି)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 bg-cosmic-950/60">
            {activeTab === 'planets' ? (
              planetKeys.map((pName) => {
                const kp = kpSystem.planets[pName];
                if (!kp) return null;
                return (
                  <tr key={pName} className="hover:bg-slate-900/60 transition-colors">
                    <td className="p-3 font-bold text-slate-200 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cosmic-gold/80" />
                      <span>{tGraha(pName)}</span>
                    </td>
                    <td className="p-3 font-mono text-slate-300">
                      {formatDegMinSec(kp.longitude)}
                    </td>
                    <td className="p-3 text-slate-300">
                      {tRashi(kp.sign)}
                    </td>
                    <td className="p-3 text-slate-300">
                      {tGraha(kp.signLord)}
                    </td>
                    <td className="p-3 text-indigo-300 font-medium">
                      {tGraha(kp.starLord)}
                    </td>
                    <td className="p-3 font-bold text-amber-300 bg-amber-500/10">
                      {tGraha(kp.subLord)}
                    </td>
                  </tr>
                );
              })
            ) : (
              kpSystem.cusps.map((c, idx) => (
                <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                  <td className="p-3 font-bold text-slate-200">
                    House {idx + 1}
                  </td>
                  <td className="p-3 font-mono text-slate-300">
                    {formatDegMinSec(c.longitude)}
                  </td>
                  <td className="p-3 text-slate-300">
                    {tRashi(c.sign)}
                  </td>
                  <td className="p-3 text-slate-300">
                    {tGraha(c.signLord)}
                  </td>
                  <td className="p-3 text-indigo-300 font-medium">
                    {tGraha(c.starLord)}
                  </td>
                  <td className="p-3 font-bold text-amber-300 bg-amber-500/10">
                    {tGraha(c.subLord)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* KP Rule Info */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-slate-400 leading-relaxed">
        <Info className="w-4 h-4 text-cosmic-gold shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-200">KP Rule of Fruition: </span>
          A planet signifies matters governed by its Star Lord, while the ultimate success, denial, or fruition quality is definitively dictated by its Sub-Lord.
        </div>
      </div>
    </div>
  );
};
