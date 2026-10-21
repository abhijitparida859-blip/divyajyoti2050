import React from 'react';
import { useI18n } from '../../localization/i18n';
import { VargaType } from '../../types/jataka';
import { VARGA_METADATA } from '../../core/jataka/shodashavarga_engine';
import { Layers } from 'lucide-react';

interface Props {
  selectedVarga: VargaType;
  onSelectVarga: (v: VargaType) => void;
}

export const ShodashavargaSelector: React.FC<Props> = ({ selectedVarga, onSelectVarga }) => {
  const { language } = useI18n();
  const vargas: VargaType[] = [
    'D1', 'D2', 'D3', 'D4', 'D7', 'D9', 'D10',
    'D12', 'D16', 'D20', 'D24', 'D27', 'D30', 'D40', 'D45', 'D60'
  ];

  return (
    <div className="bg-cosmic-950/80 border border-slate-800 rounded-2xl p-2.5 sm:p-3 mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold text-cosmic-gold uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span>Shodashavarga 16 Divisional Charts (ଷୋଡ଼ଶବର୍ଗ ଚକ୍ର)</span>
        </span>
        <span className="text-[10px] text-slate-400 font-mono">BPHS Canonical Math</span>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
        {vargas.map(v => {
          const meta = VARGA_METADATA[v];
          const isSelected = selectedVarga === v;
          return (
            <button
              key={v}
              onClick={() => onSelectVarga(v)}
              className={`p-1.5 rounded-xl text-center border transition-all cursor-pointer touch-manipulation ${
                isSelected
                  ? 'bg-gradient-to-b from-amber-500/30 to-amber-600/20 border-amber-400 text-amber-300 font-black shadow-[0_0_12px_rgba(245,158,11,0.3)] ring-1 ring-amber-400'
                  : 'bg-cosmic-900/50 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:text-slate-100'
              }`}
              title={meta.purpose[language]}
            >
              <div className="text-xs font-black tracking-tight">{v}</div>
              <div className="text-[9px] truncate opacity-90">{meta.name[language]}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
