// ============================================================================
//  DIVINE COMMAND CENTER — the live heart of the front page.
//  Ticking clock, sun-day progress bar, countdown to next sun milestone,
//  and LIVE status of the day's key muhurtas. Updates every second.
// ============================================================================
import React, { useEffect, useState } from 'react';
import { useI18n } from '../../localization/i18n';
import { DayPanjika, MuhurtaWindow } from '../../types/panjika';
import { MoonStar, Sunrise } from 'lucide-react';
import { clockToDate, pad2 } from './divineTime';

interface Props {
  panjika: DayPanjika;
  tomorrowSunrise: string;
}

type Status = 'live' | 'soon' | 'done';

interface EventRow {
  key: string;
  win: MuhurtaWindow;
  good: boolean;
  label: string;
  status: Status;
  remainingMs: number;
}

export const DivineCommandCenter: React.FC<Props> = ({ panjika, tomorrowSunrise }) => {
  const { language, formatNumber, formatTime, tVaara } = useI18n();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const L = (or: string, hi: string, en: string) => (language === 'or' ? or : language === 'hi' ? hi : en);

  const sunrise = clockToDate(now, panjika.sunrise);
  const sunset = clockToDate(now, panjika.sunset);
  const isDay = !!(sunrise && sunset && now >= sunrise && now < sunset);
  const isPreDawn = !!(sunrise && now < sunrise);

  let nextRise = isPreDawn ? sunrise : clockToDate(now, tomorrowSunrise);
  if (nextRise && nextRise <= now) nextRise = new Date(nextRise.getTime() + 86400000);

  const nextTarget = isDay ? sunset : nextRise;
  const nextLabel = isDay
    ? L('ସୂର୍ଯ୍ୟାସ୍ତ ପର୍ଯ୍ୟନ୍ତ', 'सूर्यास्त तक', 'Until sunset')
    : L('ସୂର୍ଯ୍ୟୋଦୟ ପର୍ଯ୍ୟନ୍ତ', 'सूर्योदय तक', 'Until sunrise');

  // Current sun-day (or night) progress — handles pre-dawn (yesterday sunset → today sunrise)
  const nightStart = sunset ? (isPreDawn ? new Date(sunset.getTime() - 86400000) : sunset) : null;
  const cycleStart = isDay ? sunrise : nightStart;
  const cycleEnd = isDay ? sunset : nextRise;
  const progress =
    cycleStart && cycleEnd && cycleEnd > cycleStart
      ? Math.min(1, Math.max(0, (now.getTime() - cycleStart.getTime()) / (cycleEnd.getTime() - cycleStart.getTime())))
      : 0;

  const events: EventRow[] = [
    { key: 'brahma', win: panjika.muhurtas.brahmaMuhurta, good: true, label: L('ବ୍ରହ୍ମ ମୁହୂର୍ତ୍ତ', 'ब्रह्म मुहूर्त', 'Brahma Muhurta'), status: 'done', remainingMs: 0 },
    { key: 'abhijit', win: panjika.muhurtas.abhijit, good: true, label: L('ଅଭିଜିତ୍ ମୁହୂର୍ତ୍ତ', 'अभिजित् मुहूर्त', 'Abhijit Muhurta'), status: 'done', remainingMs: 0 },
    { key: 'rahu', win: panjika.muhurtas.rahuKaal, good: false, label: L('ରାହୁ କାଳ', 'राहु काल', 'Rahu Kaal'), status: 'done', remainingMs: 0 },
    { key: 'yama', win: panjika.muhurtas.yamaganda, good: false, label: L('ୟମଗଣ୍ଡ', 'यमगण्ड', 'Yamaganda'), status: 'done', remainingMs: 0 },
  ].map((e) => {
    const start = clockToDate(now, e.win.start);
    const end = clockToDate(now, e.win.end);
    let status: Status = 'done';
    let remainingMs = 0;
    if (start && end) {
      if (now >= start && now < end) {
        status = 'live';
        remainingMs = end.getTime() - now.getTime();
      } else if (now < start) {
        status = 'soon';
        remainingMs = start.getTime() - now.getTime();
      }
    }
    return { ...e, status, remainingMs };
  });

  const fmtMs = (ms: number): string => {
    const total = Math.max(0, Math.floor(ms / 1000));
    return formatNumber(`${pad2(Math.floor(total / 3600))}:${pad2(Math.floor(total / 60) % 60)}:${pad2(total % 60)}`);
  };

  const clockH24 = now.getHours();
  const clockStr = formatNumber(`${pad2(clockH24 % 12 === 0 ? 12 : clockH24 % 12)}:${pad2(now.getMinutes())}:${pad2(now.getSeconds())}`);
  const ampm = clockH24 >= 12 ? L('ଅପରାହ୍ଣ', 'अपराह्न', 'PM') : L('ପୂର୍ବାହ୍ନ', 'पूर्वाह्न', 'AM');
  const dateLocale = language === 'or' ? 'or-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
  const dateStr = `${now.toLocaleDateString(dateLocale, { weekday: 'long', day: 'numeric', month: 'long' })} • ${tVaara(panjika.vaara)}`;

  return (
    <section className="relative h-full overflow-hidden rounded-3xl border border-amber-400/30 bg-[#0b0d21]/85 shadow-[0_20px_70px_-30px_rgba(255,190,0,0.5)] backdrop-blur-xl">
      <div className="pointer-events-none absolute -left-16 -top-24 h-72 w-72 rounded-full bg-amber-500/10 blur-[90px]" />
      <div className="flex items-center justify-between border-b border-amber-400/15 px-4 py-2.5 sm:px-5">
        <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-amber-200">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          {L('ଲାଇଭ କମାଣ୍ଡ ସେଣ୍ଟର', 'लाइव कमांड सेंटर', 'Live Command Center')}
        </span>
        <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${isDay ? 'text-amber-300' : 'text-indigo-300'}`}>
          {isDay ? <Sunrise className="h-3.5 w-3.5" /> : <MoonStar className="h-3.5 w-3.5" />}
          {isDay ? L('ଦିନ ଚାଲିଛି', 'दिन चल रहा है', 'Daytime') : L('ରାତ୍ରି ଚାଲିଛି', 'रात्रि चल रही है', 'Night')}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4 p-4 sm:p-5 lg:grid-cols-5">
        {/* Live clock + countdown + day progress */}
        <div className="flex w-full min-w-0 flex-col items-center justify-center rounded-2xl border border-slate-700/60 bg-black/30 p-4 md:col-span-2">
          <div className={`max-w-full whitespace-nowrap leading-none font-black tracking-tight text-amber-100 tabular-nums text-center ${language === 'en' ? 'font-mono text-[clamp(1.6rem,3.6vw,2.5rem)]' : 'font-sans text-[clamp(1.3rem,2.9vw,2rem)]'}`}>
            {clockStr}
            <span className={`ml-1.5 text-amber-300/80 ${language === 'en' ? 'text-sm sm:text-base' : 'text-[13px]'}`}>{ampm}</span>
          </div>
          <div className="mt-1.5 text-center text-[11px] font-semibold text-slate-400 text-balance px-1">{dateStr}</div>
          <div className="mt-3 w-full rounded-xl border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-center">
            <div className="text-[10px] font-black uppercase tracking-[0.15em] text-amber-300/80">{nextLabel}</div>
            <div className={`text-[17px] font-black text-amber-100 ${language === 'en' ? 'font-mono' : 'font-sans'}`}>
              {nextTarget ? fmtMs(nextTarget.getTime() - now.getTime()) : '--:--:--'}
            </div>
          </div>
          <div className="mt-3 w-full">
            <div className="mb-1.5 flex items-center justify-between gap-2 text-[10px] sm:text-[11px] font-bold uppercase text-slate-500">
              <span className="whitespace-nowrap">{formatTime(isDay ? panjika.sunrise : panjika.sunset)}</span>
              <span className="shrink-0 text-slate-400">
                {isDay ? L('ଦିନ', 'दिन', 'Day') : L('ରାତ୍ରି', 'रात्रि', 'Night')} {formatNumber(Math.round(progress * 100))}%
              </span>
              <span className="whitespace-nowrap text-right">{formatTime(isDay ? panjika.sunset : isPreDawn ? panjika.sunrise : tomorrowSunrise)}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full border border-slate-700/60 bg-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  isDay
                    ? 'bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-200'
                    : 'bg-gradient-to-r from-indigo-600 via-blue-400 to-cyan-300'
                }`}
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
          </div>
        </div>
        {/* Muhurta status grid */}
        <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 md:col-span-3">
          {events.map((e) => (
            <div
              key={e.key}
              className={`rounded-2xl border p-3 transition-all duration-300 ${
                e.status === 'live'
                  ? e.good
                    ? 'border-emerald-400/60 bg-emerald-950/40 shadow-[0_0_25px_-6px_rgba(16,185,129,0.6)]'
                    : 'border-rose-400/60 bg-rose-950/40 shadow-[0_0_25px_-6px_rgba(244,63,94,0.6)]'
                  : e.status === 'soon'
                    ? 'border-slate-600/60 bg-slate-900/60'
                    : 'border-slate-800/70 bg-slate-950/50 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`text-xs font-black ${e.good ? 'text-emerald-300' : 'text-rose-300'}`}>{e.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                    e.status === 'live'
                      ? e.good
                        ? 'bg-emerald-500/25 text-emerald-200'
                        : 'bg-rose-500/25 text-rose-200'
                      : 'bg-slate-700/60 text-slate-400'
                  }`}
                >
                  {e.status === 'live'
                    ? L('ଚାଲିଛି', 'चालू', 'LIVE')
                    : e.status === 'soon'
                      ? L('ଆସୁଛି', 'आ रहा है', 'SOON')
                      : L('ସରିଲା', 'समाप्त', 'DONE')}
                </span>
              </div>
              <div className={`mt-1 text-[13px] font-bold text-slate-100 break-words leading-snug ${language === 'en' ? 'font-mono' : 'font-sans'}`}>
                {formatTime(e.win.start)} – {formatTime(e.win.end)}
              </div>
              <div className="mt-0.5 text-[10px] font-semibold text-slate-400">
                {e.status === 'live'
                  ? `${L('ଶେଷ ହେବ', 'समाप्त होने में', 'Ends in')} ${fmtMs(e.remainingMs)}`
                  : e.status === 'soon'
                    ? `${L('ଆରମ୍ଭ ହେବ', 'शुरू होने में', 'Starts in')} ${fmtMs(e.remainingMs)}`
                    : L('ଆଜି ପାଇଁ ସରିଗଲା', 'आज के लिए समाप्त', 'Finished for today')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
