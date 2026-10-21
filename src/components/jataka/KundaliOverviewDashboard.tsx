import React from 'react';
import { useI18n } from '../../localization/i18n';
import { BirthChartData } from '../../types/jataka';
import { getDashaPhala } from '../../core/jataka/yearly_forecast_engine';
import { Crown, Sun, Moon, Star, Zap, ShieldCheck, HeartHandshake, CalendarDays } from 'lucide-react';

interface Props { chartData: BirthChartData; onGo: (tab: string) => void; }


export const KundaliOverviewDashboard: React.FC<Props> = ({ chartData, onGo }) => {
  const { language, tRashi, tGraha, tNakshatra, formatNumber } = useI18n();
  const moon = chartData.planets.Chandra;
  const maha = chartData.currentDasha.mahadasha;
  const antar = chartData.currentDasha.antardasha;
  const phala = getDashaPhala(maha);
  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-amber-500/15 via-cosmic-950 to-cosmic-950 border border-amber-400/40 rounded-3xl p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-black text-slate-100 font-serif">🪔 {chartData.nativeName} • Summary</h3>
        <p className="text-xs text-slate-400 mt-1">{chartData.birthPlace} • {chartData.dateTime.slice(0, 10)} • {tRashi(chartData.ascendantSign)} Lagna • {tRashi(moon.sign)} Rashi • {tNakshatra(moon.nakshatra)}</p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 mt-4">
          <button onClick={() => onGo('chart')} className="text-left rounded-2xl border border-slate-700/70 bg-cosmic-950/70 p-3 hover:border-cosmic-gold/60 cursor-pointer"><div className="text-[11px] text-slate-400 font-bold uppercase">Lagna</div><div className="text-sm font-black text-slate-100 mt-1">{tRashi(chartData.ascendantSign)} ({formatNumber(chartData.ascendantDegree)}°)</div></button>
          <button onClick={() => onGo('panchanga')} className="text-left rounded-2xl border border-slate-700/70 bg-cosmic-950/70 p-3 hover:border-cosmic-gold/60 cursor-pointer"><div className="text-[11px] text-slate-400 font-bold uppercase">Moon / Nakshatra</div><div className="text-sm font-black text-slate-100 mt-1">{tRashi(moon.sign)} • {tNakshatra(moon.nakshatra)}-{moon.pada}</div></button>
          <button onClick={() => onGo('dashas')} className="text-left rounded-2xl border border-slate-700/70 bg-cosmic-950/70 p-3 hover:border-cosmic-gold/60 cursor-pointer"><div className="text-[11px] text-slate-400 font-bold uppercase">Current Dasha</div><div className="text-sm font-black text-amber-300 mt-1">{tGraha(maha)} / {tGraha(antar)}</div></button>
          <button onClick={() => onGo('shadbala')} className="text-left rounded-2xl border border-slate-700/70 bg-cosmic-950/70 p-3 hover:border-cosmic-gold/60 cursor-pointer"><div className="text-[11px] text-slate-400 font-bold uppercase">Strongest Planet</div><div className="text-sm font-black text-slate-100 mt-1">{tGraha(chartData.shadbala.strongestPlanet)}</div></button>
          <button onClick={() => onGo('yogas')} className="text-left rounded-2xl border border-slate-700/70 bg-cosmic-950/70 p-3 hover:border-cosmic-gold/60 cursor-pointer"><div className="text-[11px] text-slate-400 font-bold uppercase">Yogas ({formatNumber(chartData.yogas.length)})</div><div className="text-[11px] text-slate-300 mt-1 truncate">{chartData.yogas.slice(0, 2).map(y => y.name[language]).join(' • ')}</div></button>
          <button onClick={() => onGo('gochara')} className="text-left rounded-2xl border border-slate-700/70 bg-cosmic-950/70 p-3 hover:border-cosmic-gold/60 cursor-pointer"><div className="text-[11px] text-slate-400 font-bold uppercase">Dosha / Sade Sati</div><div className="text-sm font-black text-slate-100 mt-1">{chartData.manglik.isManglik ? 'Manglik' : 'Clean'} • {chartData.gochara.sadeSati.isActive ? 'SadeSati' : 'OK'}</div></button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-3xl border border-cosmic-gold/30 bg-cosmic-900/60 p-4">
          <div className="font-bold text-slate-100 text-sm mb-1.5">🔮 {tGraha(maha)} Mahadasha Phala</div>
          <div className="text-xs text-slate-300 leading-relaxed">{phala[language]}</div>
          <button onClick={() => onGo('dashas')} className="mt-2.5 text-[11px] font-bold px-3 py-1.5 rounded-xl bg-cosmic-gold text-cosmic-950 cursor-pointer">5-Tier Dasha →</button>
        </div>
        <div className="rounded-3xl border border-cosmic-gold/30 bg-cosmic-900/60 p-4">
          <div className="font-bold text-slate-100 text-sm mb-1.5 flex items-center gap-1.5"><CalendarDays className="w-4 h-4 text-cosmic-gold" /> Today</div>
          <div className="text-xs text-slate-300 leading-relaxed">{chartData.dailyGuide.tarabala.guidance[language]}</div>
          <div className="flex flex-wrap gap-2 mt-2.5">
            <button onClick={() => onGo('yearly')} className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-cosmic-gold text-cosmic-950 cursor-pointer">365-Day Forecast →</button>
            <button onClick={() => onGo('print')} className="text-[11px] font-bold px-3 py-1.5 rounded-xl border border-cosmic-gold/50 text-cosmic-gold cursor-pointer">🖨 Print Kundali →</button>
          </div>
        </div>
      </div>
      <div className="rounded-3xl border border-slate-800 bg-cosmic-950/60 p-4">
        <div className="font-bold text-slate-100 text-sm mb-1.5 flex items-center gap-1.5"><HeartHandshake className="w-4 h-4 text-cosmic-gold" /> Remedy</div>
        <div className="text-xs text-slate-300">{chartData.dailyGuide.luckyGuidelines.mantra} • {chartData.dailyGuide.luckyGuidelines.color[language]}</div>
      </div>
    </div>
  );
};
