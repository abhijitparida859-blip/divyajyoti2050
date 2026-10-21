import React, { useMemo, useState } from 'react';
import { useI18n } from '../../localization/i18n';
import { BirthChartData } from '../../types/jataka';
import { calculateYearlyForecast } from '../../core/jataka/yearly_forecast_engine';
import { CalendarDays, Search, Star, TrendingUp, AlertTriangle, Sparkles } from 'lucide-react';

interface Props { chartData: BirthChartData; }


export const YearlyForecastView: React.FC<Props> = ({ chartData }) => {
  const { language, tGraha, formatNumber } = useI18n();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'Excellent' | 'Good' | 'Average' | 'Caution' | 'Avoid'>('all');
  const [openDate, setOpenDate] = useState<string | null>(null);
  const data = useMemo(() => calculateYearlyForecast(
    chartData.planets.Chandra.signIndex,
    chartData.planets.Chandra.nakshatraIndex - 1,
    chartData.dashas as any[],
    new Date()
  ), [chartData]);
  const list = data.days.filter(d =>
    (filter === 'all' || d.rating === filter) &&
    (query.trim() === '' || d.dateStr.includes(query.trim()) || d.nakshatra.toLowerCase().includes(query.trim().toLowerCase()))
  );
  const colorOf = (r: string) => r === 'Excellent' ? 'text-emerald-300 border-emerald-400/50 bg-emerald-500/10' : r === 'Good' ? 'text-cyan-300 border-cyan-400/40 bg-cyan-500/10' : r === 'Average' ? 'text-amber-300 border-amber-400/40 bg-amber-500/10' : r === 'Caution' ? 'text-orange-300 border-orange-400/50 bg-orange-500/10' : 'text-rose-300 border-rose-400/50 bg-rose-500/10';
  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-amber-500/15 via-cosmic-950 to-cosmic-950 border border-amber-400/40 rounded-3xl p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-black text-slate-100 flex items-center gap-2 font-serif">
          <CalendarDays className="w-5 h-5 text-cosmic-gold" />
          <span>{language === 'or' ? '୩୬୫-ଦିନ ବାର୍ଷିକ ଭବିଷ୍ୟଫଳ' : language === 'hi' ? '३६५-दिन वार्षिक भविष्यफल' : '365-Day Annual Forecast'}</span>
        </h3>
        <div className="grid grid-cols-5 gap-2 mt-4">
          {[['Excellent', data.excellent, 'text-emerald-300'], ['Good', data.good, 'text-cyan-300'], ['Average', data.average, 'text-amber-300'], ['Caution', data.caution, 'text-orange-300'], ['Avoid', data.avoid, 'text-rose-300']].map(([k, v, c]) => (
            <button key={k as string} onClick={() => setFilter(filter === k ? 'all' : k as any)} className={`rounded-2xl border border-slate-700/70 bg-cosmic-950/70 p-2.5 text-center cursor-pointer hover:border-cosmic-gold/50 ${filter === k ? 'ring-2 ring-cosmic-gold/60' : ''}`}>
              <div className={`text-lg font-black ${c}`}>{formatNumber(Number(v))}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">{k as string}</div>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mt-3 text-[11px]">
          <span className="px-2.5 py-1 rounded-full bg-cosmic-900 border border-slate-700 text-slate-300 flex items-center gap-1"><TrendingUp className="w-3 h-3 text-emerald-400" /> Best: {data.bestMonths.map(m => m.month).join(' • ')}</span>
          <span className="px-2.5 py-1 rounded-full bg-cosmic-900 border border-slate-700 text-slate-300 flex items-center gap-1"><Star className="w-3 h-3 text-amber-400" /> Today: {data.days[0]?.score}/100</span>
        </div>
      </div>
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search date / nakshatra…" className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-cosmic-950 border border-slate-700 text-sm text-slate-100 outline-none focus:border-cosmic-gold/60" />
      </div>

      <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1 cosmic-scrollbar">
        {list.slice(0, 120).map(d => (
          <div key={d.dateStr} className="rounded-2xl border border-slate-800 bg-cosmic-950/70 overflow-hidden">
            <button onClick={() => setOpenDate(openDate === d.dateStr ? null : d.dateStr)} className="w-full p-3 flex items-center justify-between gap-2 text-left cursor-pointer hover:bg-white/5">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${colorOf(d.rating)}`}>{d.rating}</span>
                <span className="font-mono text-xs text-slate-200 font-bold">{d.dateStr}</span>
                <span className="text-xs text-slate-300 truncate hidden sm:inline">{d.headline[language]}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 shrink-0">
                <span className="font-black text-cosmic-gold">{d.score}</span>
                <span>{openDate === d.dateStr ? '▲' : '▼'}</span>
              </div>
            </button>
            {openDate === d.dateStr && (
              <div className="border-t border-slate-800/70 p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-cosmic-900/60 border border-slate-800 p-2.5"><div className="font-bold text-slate-100 mb-1">📜 Detail</div><div className="text-slate-300">{d.detail[language]}</div></div>
                <div className="rounded-xl bg-cosmic-900/60 border border-slate-800 p-2.5"><div className="font-bold text-slate-100 mb-1">💼 Career</div><div className="text-slate-300">{d.career[language]}</div></div>
                <div className="rounded-xl bg-cosmic-900/60 border border-slate-800 p-2.5"><div className="font-bold text-slate-100 mb-1">💰 Wealth</div><div className="text-slate-300">{d.wealth[language]}</div></div>
                <div className="rounded-xl bg-cosmic-900/60 border border-slate-800 p-2.5"><div className="font-bold text-slate-100 mb-1">🧘 Health</div><div className="text-slate-300">{d.health[language]}</div></div>
                <div className="rounded-xl bg-cosmic-900/60 border border-slate-800 p-2.5"><div className="font-bold text-slate-100 mb-1">❤️ Relation</div><div className="text-slate-300">{d.relation[language]}</div></div>
                <div className="rounded-xl bg-amber-500/10 border border-amber-400/30 p-2.5"><div className="font-bold text-amber-200 mb-1 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> Remedy</div><div className="text-slate-200">{d.remedy[language]}</div></div>
                <div className="sm:col-span-2 text-[11px] font-mono text-slate-400">Dasha: {tGraha(d.maha)} / {tGraha(d.antar)} / {tGraha(d.prat)} • Tara: {d.taraType} • Moon {d.chandraHouse}th from natal</div>
              </div>
            )}
          </div>
        ))}
        {list.length > 120 && <div className="text-center text-[11px] text-slate-500 py-2">Showing first 120 of {list.length} — refine search / filter. Full 365 in print.</div>}
        {list.length === 0 && <div className="text-center text-sm text-slate-400 py-8 flex items-center justify-center gap-2"><AlertTriangle className="w-4 h-4" /> No days match</div>}
      </div>
    </div>
  );
};
