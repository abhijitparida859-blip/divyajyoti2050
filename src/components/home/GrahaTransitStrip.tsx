// ============================================================================
//  GRAHA TRANSIT STRIP — today's real planetary positions (sidereal rashis)
//  Uses the same ephemeris as the panchang engine. Live, authentic data.
// ============================================================================
import React, { useMemo } from 'react';
import { useI18n } from '../../localization/i18n';
import { calculatePlanetaryPositions } from '../../core/astronomy/ephemeris';
import { Orbit } from 'lucide-react';

const RASHIS = ['Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya', 'Tula', 'Vrischika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'];

interface GrahaDef {
  key: string;
  field: 'sun' | 'moon' | 'mars' | 'mercury' | 'jupiter' | 'venus' | 'saturn' | 'rahu' | 'ketu';
  symbol: string;
  glow: string;
}

const GRAHAS: GrahaDef[] = [
  { key: 'Surya', field: 'sun', symbol: '☀️', glow: 'from-amber-400/40 to-orange-600/25' },
  { key: 'Chandra', field: 'moon', symbol: '🌙', glow: 'from-slate-300/40 to-blue-500/25' },
  { key: 'Mangala', field: 'mars', symbol: '🔴', glow: 'from-red-400/40 to-rose-700/25' },
  { key: 'Budha', field: 'mercury', symbol: '🟢', glow: 'from-emerald-400/40 to-green-700/25' },
  { key: 'Guru', field: 'jupiter', symbol: '🪐', glow: 'from-yellow-300/40 to-amber-600/25' },
  { key: 'Shukra', field: 'venus', symbol: '💗', glow: 'from-pink-300/40 to-rose-500/25' },
  { key: 'Shani', field: 'saturn', symbol: '🖤', glow: 'from-slate-400/40 to-indigo-600/25' },
  { key: 'Rahu', field: 'rahu', symbol: '🐉', glow: 'from-violet-400/40 to-purple-700/25' },
  { key: 'Ketu', field: 'ketu', symbol: '☄️', glow: 'from-fuchsia-400/40 to-pink-700/25' },
];

export const GrahaTransitStrip: React.FC = () => {
  const { language, formatNumber, tRashi, tGraha } = useI18n();
  const L = (or: string, hi: string, en: string) => (language === 'or' ? or : language === 'hi' ? hi : en);
  const positions = useMemo(() => calculatePlanetaryPositions(new Date()), []);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-indigo-400/25 bg-[#0b0d21]/85 backdrop-blur-xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200">
          <Orbit className="h-3.5 w-3.5 text-indigo-300 animate-spin-slower" />
          {L('ଆଜିର ଗ୍ରହ ସ୍ଥିତି', 'आज की ग्रह स्थिति', "Today's Graha Transit")}
        </span>
        <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-300/70">
          {L('ସିଦ୍ଧାନ୍ତ ଗଣନା', 'सिद्धांत गणना', 'Sidereal Math')}
        </span>
      </div>
      <div className="flex gap-2.5 overflow-x-auto pb-1.5">
        {GRAHAS.map((g) => {
          const raw = positions[g.field] ?? 0;
          const norm = ((raw % 360) + 360) % 360;
          const rashiIdx = Math.floor(norm / 30);
          const degInRashi = norm % 30;
          const retroMap = positions.isRetrograde as Record<string, boolean> | undefined;
          const retro = retroMap?.[g.field];
          return (
            <div
              key={g.key}
              className={`group shrink-0 min-w-[128px] rounded-2xl border border-slate-700/60 bg-gradient-to-br ${g.glow} p-2.5 hover:-translate-y-1.5 hover:border-amber-400/50 hover:shadow-[0_16px_40px_-18px_rgba(255,190,0,0.55)] transition-all duration-300`}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg leading-none transition-transform duration-300 group-hover:scale-125">{g.symbol}</span>
                {retro && (
                  <span className="rounded border border-rose-400/40 bg-rose-500/20 px-1 py-0.5 text-[9px] font-black text-rose-200">
                    ℞ {L('ବକ୍ରୀ', 'वक्री', 'R')}
                  </span>
                )}
              </div>
              <div className="mt-1.5 truncate text-[11px] font-black text-slate-100">{tGraha(g.key)}</div>
              <div className="truncate text-[11px] font-bold text-amber-200">{tRashi(RASHIS[rashiIdx])}</div>
              <div className="font-mono text-[10px] text-slate-400">{formatNumber(degInRashi.toFixed(1))}°</div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
