// ============================================================================
//  CHOGHADIYA HUD — the classic 8-fold auspicious clock, day AND night.
//  Real math: sunrise/sunset drive the standard weekday choghadiya cycle.
//  The running slot glows LIVE — data world-class panchang apps ship.
// ============================================================================
import React, { useEffect, useState } from 'react';
import { useI18n } from '../../localization/i18n';
import { DayPanjika } from '../../types/panjika';
import { WEEKDAYS } from '../../core/panjika/panjika_engine';
import { Moon, Sparkles, Sun } from 'lucide-react';
import { clockToDate, toClockLabel } from './divineTime';

interface Props {
  panjika: DayPanjika;
  tomorrowSunrise: string;
  yesterdaySunset: string;
}

// Standard cycles (7 names; each weekday starts at a rotating index)
const DAY_CYCLE = ['Udveg', 'Chal', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog'];
const DAY_START = [0, 3, 6, 2, 5, 1, 4]; // Ravivara..Shanivara
const NIGHT_CYCLE = ['Shubh', 'Amrit', 'Chal', 'Rog', 'Kaal', 'Labh', 'Udveg'];
const NIGHT_START = [0, 2, 4, 6, 1, 3, 5];

const QUALITY: Record<string, 'good' | 'travel' | 'bad'> = {
  Amrit: 'good', Shubh: 'good', Labh: 'good', Chal: 'travel', Udveg: 'bad', Rog: 'bad', Kaal: 'bad',
};
const DOT: Record<string, string> = {
  good: 'bg-emerald-400', travel: 'bg-sky-400', bad: 'bg-rose-500',
};

interface Slot { name: string; start: Date; end: Date; live: boolean; }

export const ChoghadiyaHUD: React.FC<Props> = ({ panjika, tomorrowSunrise, yesterdaySunset }) => {
  const { language, formatNumber, formatTime } = useI18n();
  const L = (or: string, hi: string, en: string) => (language === 'or' ? or : language === 'hi' ? hi : en);
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const NAME_TR: Record<string, Record<'or' | 'hi' | 'en', string>> = {
    Amrit: { or: 'ଅମୃତ', hi: 'अमृत', en: 'Amrit' },
    Shubh: { or: 'ଶୁଭ', hi: 'शुभ', en: 'Shubh' },
    Labh: { or: 'ଲାଭ', hi: 'लाभ', en: 'Labh' },
    Chal: { or: 'ଚଳ', hi: 'चल', en: 'Chal' },
    Udveg: { or: 'ଉଦ୍ବେଗ', hi: 'उद्वेग', en: 'Udveg' },
    Rog: { or: 'ରୋଗ', hi: 'रोग', en: 'Rog' },
    Kaal: { or: 'କାଳ', hi: 'काल', en: 'Kaal' },
  };

  const sunrise = clockToDate(now, panjika.sunrise);
  const sunset = clockToDate(now, panjika.sunset);
  let nextRise = clockToDate(now, tomorrowSunrise);
  if (nextRise && nextRise <= now) nextRise = new Date(nextRise.getTime() + 86400000);
  let prevSet = clockToDate(now, yesterdaySunset);
  if (prevSet && prevSet >= now) prevSet = new Date(prevSet.getTime() - 86400000);

  const wdIdx = Math.max(0, WEEKDAYS.indexOf(panjika.vaara));
  const inDay = !!(sunrise && sunset && now >= sunrise && now < sunset);
  const morningNight = !!(sunrise && now < sunrise);
  const nightFrom = morningNight ? (prevSet ?? (sunrise ? new Date(sunrise.getTime() - 86400000) : null)) : sunset;
  const nightTo = morningNight ? sunrise : nextRise;
  const inNight = !!(nightFrom && nightTo && now >= nightFrom && now < nightTo);

  const build = (from: Date | null, to: Date | null, cycle: string[], startIdx: number, liveNow: boolean): Slot[] => {
    if (!from || !to || to <= from) return [];
    const slotLen = (to.getTime() - from.getTime()) / 8;
    return Array.from({ length: 8 }, (_, i) => {
      const start = new Date(from.getTime() + i * slotLen);
      const end = new Date(from.getTime() + (i + 1) * slotLen);
      return {
        name: cycle[(startIdx + i) % cycle.length],
        start, end,
        live: liveNow && now >= start && now < end,
      };
    });
  };

  const daySlots = build(sunrise, sunset, DAY_CYCLE, DAY_START[wdIdx], inDay);
  const nightSlots = build(nightFrom, nightTo, NIGHT_CYCLE, NIGHT_START[wdIdx], inNight);

  const Column: React.FC<{ title: string; icon: React.ReactNode; slots: Slot[]; accent: string }> = ({ title, icon, slots, accent }) => (
    <div className="rounded-2xl border border-slate-700/60 bg-black/25 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className={`flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest ${accent}`}>{icon}{title}</span>
        {slots.some((s) => s.live) && (
          <span className="animate-pulse rounded-full bg-emerald-500/20 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-emerald-300">
            {L('ଚାଲୁଛି', 'चालू', 'Running')}
          </span>
        )}
      </div>
      <div className="space-y-1.5">
        {slots.map((s, i) => (
          <div
            key={i}
            className={`flex items-center justify-between rounded-xl border px-2.5 py-1.5 transition-all duration-300 ${
              s.live
                ? 'scale-[1.03] border-amber-400/70 bg-amber-500/15 shadow-[0_0_22px_-6px_rgba(255,190,0,0.7)]'
                : 'border-slate-700/40 bg-slate-900/50 hover:border-amber-400/40'
            }`}
          >
            <span className="flex min-w-0 items-center gap-2">
              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${DOT[QUALITY[s.name]] ?? 'bg-slate-500'} ${s.live ? 'animate-pulse' : ''}`} />
              <span className={`truncate text-xs font-black ${s.live ? 'text-amber-100' : 'text-slate-200'}`}>{NAME_TR[s.name]?.[language] ?? s.name}</span>
              {s.live && <span className="shrink-0 rounded bg-amber-500/25 px-1 text-[8px] font-black text-amber-200">NOW</span>}
            </span>
            <span className="shrink-0 font-mono text-[10px] text-slate-400">
              {formatTime(toClockLabel(s.start))}–{formatTime(toClockLabel(s.end))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="relative overflow-hidden rounded-3xl border border-amber-400/30 bg-[#0b0d21]/85 p-4 backdrop-blur-xl sm:p-5">
      <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-[80px]" />
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-amber-200">
          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          {L('ଚୋଘଡ଼ିଆ — ଶୁଭ ସମୟ ଘଡ଼ି', 'चौघड़िया — शुभ समय घड़ी', 'Choghadiya — Auspicious Clock')}
        </span>
        <span className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-slate-400">
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />{L('ଶୁଭ', 'शुभ', 'Good')}</span>
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-sky-400" />{L('ଚଳ', 'चल', 'Travel')}</span>
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-rose-500" />{L('ଅଶୁଭ', 'अशुभ', 'Avoid')}</span>
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Column
          title={L('ଦିନ ଚୋଘଡ଼ିଆ', 'दिन चौघड़िया', 'Day Choghadiya')}
          icon={<Sun className="h-3.5 w-3.5" />}
          slots={daySlots}
          accent="text-amber-300"
        />
        <Column
          title={morningNight ? L('ଚାଲୁଥିବା ରାତ୍ରି', 'चल रही रात्रि', 'Current Night') : L('ଆଜିର ରାତ୍ରି', 'आज रात्रि', 'Tonight')}
          icon={<Moon className="h-3.5 w-3.5" />}
          slots={nightSlots}
          accent="text-indigo-300"
        />
      </div>
    </section>
  );
};
