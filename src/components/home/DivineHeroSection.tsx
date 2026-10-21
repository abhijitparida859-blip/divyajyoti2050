// ============================================================================
//  DIVINE HERO SECTION — the emotional heart of the front page
//  3D chakra emblem, live tithi/nakshatra, sunrise/sunset, greeting.
// ============================================================================
import React, { useMemo, useRef } from 'react';
import { Sunrise, Sunset, MoonStar, Sparkles } from 'lucide-react';
import { DayPanjika } from '../../types/panjika';

/** Minimal structural shape so any view holding a DayPanjika + day-of-month
 *  (calendar engine OR classic panjika view) can reuse this hero. */
export interface HeroDayInfo {
  panjika: DayPanjika;
  dayOfMonth: number;
}

/** Deterministic star field for the hero depth layer (SSR-safe, no randomness). */
const HERO_STARS: Array<{ x: string; y: string; s: number; d: string }> = [
  { x: '7%', y: '18%', s: 3, d: '0s' },
  { x: '16%', y: '64%', s: 2, d: '0.9s' },
  { x: '24%', y: '32%', s: 2, d: '1.6s' },
  { x: '33%', y: '12%', s: 3, d: '2.2s' },
  { x: '44%', y: '76%', s: 2, d: '0.4s' },
  { x: '56%', y: '20%', s: 2, d: '1.2s' },
  { x: '66%', y: '58%', s: 3, d: '2.8s' },
  { x: '74%', y: '26%', s: 2, d: '1.9s' },
  { x: '83%', y: '70%', s: 2, d: '0.6s' },
  { x: '91%', y: '36%', s: 3, d: '2.5s' },
  { x: '12%', y: '86%', s: 2, d: '1.4s' },
  { x: '88%', y: '10%', s: 2, d: '3s' },
];

interface Props {
  day: HeroDayInfo | null;
  language: 'or' | 'hi' | 'en';
  formatNumber: (n: number | string) => string;
  formatTime: (timeStr: string) => string;
  tithiLabel: string;
  nakshatraLabel: string;
  vaaraLabel: string;
  greeting: string;
  shloka: string;
  /** Today's festivals — rendered as golden pills under the shloka. */
  festivals?: string[];
  /** Ending time duration string, e.g. "ଅହୋରାତ୍ର ଭୋଗ" or "ଦିବା ୦୪:୧୫ ପର୍ଯ୍ୟନ୍ତ" */
  tithiDurationStr?: string;
}

export const DivineHeroSection: React.FC<Props> = (p) => {
  const { day, language, formatNumber, formatTime } = p;
  const emblemRef = useRef<HTMLDivElement | null>(null);
  const sunTimes = useMemo(() => {
    if (!day) return null;
    return { rise: formatTime(day.panjika.sunrise), set: formatTime(day.panjika.sunset) };
  }, [day, formatTime]);

  // REAL data: daylight duration derived from today's computed sunrise/sunset.
  const dayLength = useMemo(() => {
    if (!sunTimes) return null;
    const toMin = (t: string) => {
      const m = t.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (!m) return null;
      let h = parseInt(m[1], 10) % 12;
      if (m[3].toUpperCase() === 'PM') h += 12;
      return h * 60 + parseInt(m[2], 10);
    };
    const rise = toMin(sunTimes.rise);
    const set = toMin(sunTimes.set);
    if (rise === null || set === null || set <= rise) return null;
    const mins = set - rise;
    return { h: Math.floor(mins / 60), m: mins % 60 };
  }, [sunTimes]);

  return (
    <section className="relative overflow-hidden rounded-[1.75rem] border border-amber-400/30 bg-gradient-to-b from-[#171034]/90 via-[#0b0d21]/95 to-[#060714]/95 shadow-[0_20px_80px_-20px_rgba(255,180,0,0.35)]">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] rounded-full bg-amber-500/10 blur-[100px]" />
        <div className="absolute -bottom-32 -left-24 w-80 h-80 rounded-full bg-purple-500/10 blur-[90px]" />
        <div className="absolute -bottom-28 -right-20 w-72 h-72 rounded-full bg-cyan-500/10 blur-[90px]" />
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/70 to-transparent" />
        {HERO_STARS.map((st, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-amber-100 animate-cosmic-twinkle"
            style={{ left: st.x, top: st.y, width: st.s, height: st.s, animationDelay: st.d }}
          />
        ))}
      </div>
      <div className="relative px-5 sm:px-8 pt-7 pb-6 text-center">
        <div className="mx-auto w-fit [perspective:900px]">
          <div
            ref={emblemRef}
            className="relative transition-transform duration-300 ease-out will-change-transform"
            onMouseMove={(e) => {
              const el = emblemRef.current;
              if (!el) return;
              const r = el.getBoundingClientRect();
              const rx = ((e.clientY - (r.top + r.height / 2)) / r.height) * -18;
              const ry = ((e.clientX - (r.left + r.width / 2)) / r.width) * 18;
              el.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
            }}
            onMouseLeave={() => {
              const el = emblemRef.current;
              if (el) el.style.transform = 'rotateX(0deg) rotateY(0deg)';
            }}
          >
            {/* outer dashed orbit + counter-rotating glow dots */}
            <div className="absolute -inset-5 rounded-full border border-dashed border-amber-300/25 animate-spin-slower pointer-events-none" />
            <div className="absolute -inset-5 animate-spin-slower pointer-events-none">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={`g${i}`}
                  className="absolute h-1.5 w-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_2px_rgba(255,215,0,0.55)]"
                  style={{ left: `${50 + 50 * Math.cos((i * Math.PI) / 2)}%`, top: `${50 + 50 * Math.sin((i * Math.PI) / 2)}%`, transform: 'translate(-50%,-50%)' }}
                />
              ))}
            </div>
            <div className="absolute -inset-5 animate-spin-slower [animation-direction:reverse] pointer-events-none">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={`c${i}`}
                  className="absolute h-1 w-1 rounded-full bg-cyan-300 shadow-[0_0_8px_2px_rgba(56,189,248,0.55)]"
                  style={{ left: `${50 + 50 * Math.cos((i * Math.PI) / 2 + Math.PI / 4)}%`, top: `${50 + 50 * Math.sin((i * Math.PI) / 2 + Math.PI / 4)}%`, transform: 'translate(-50%,-50%)' }}
                />
              ))}
            </div>
            {/* pulsing halo behind the emblem */}
            <div className="absolute -inset-3 rounded-full bg-amber-400/10 blur-xl animate-pulse-subtle pointer-events-none" />
            {/* faint yantra mandala backdrop — counter-rotating depth layer */}
            <svg viewBox="0 0 100 100" className="absolute -inset-12 opacity-40 animate-spin-slower [animation-direction:reverse] pointer-events-none" aria-hidden="true">
              <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(168,85,247,0.25)" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="34" fill="none" stroke="rgba(56,189,248,0.20)" strokeWidth="0.4" strokeDasharray="2 3" />
              {Array.from({ length: 8 }, (_, i) => {
                const a = (i * 45 * Math.PI) / 180;
                return (
                  <line
                    key={`m${i}`}
                    x1={50 + 34 * Math.cos(a)}
                    y1={50 + 34 * Math.sin(a)}
                    x2={50 + 48 * Math.cos(a)}
                    y2={50 + 48 * Math.sin(a)}
                    stroke="rgba(168,85,247,0.28)"
                    strokeWidth="0.4"
                  />
                );
              })}
            </svg>
            {/* rotating zodiac ring — 12 rashi ticks + 4 cardinal gems */}
            <svg viewBox="0 0 100 100" className="absolute -inset-7 animate-spin-slower pointer-events-none" aria-hidden="true">
              <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,215,0,0.22)" strokeWidth="0.6" />
              {Array.from({ length: 12 }, (_, i) => {
                const a = (i * 30 * Math.PI) / 180;
                return (
                  <line
                    key={`t${i}`}
                    x1={50 + 41 * Math.cos(a)}
                    y1={50 + 41 * Math.sin(a)}
                    x2={50 + 46 * Math.cos(a)}
                    y2={50 + 46 * Math.sin(a)}
                    stroke="rgba(255,215,0,0.6)"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                  />
                );
              })}
              {Array.from({ length: 4 }, (_, i) => {
                const a = ((i * 90 + 45) * Math.PI) / 180;
                return <circle key={`k${i}`} cx={50 + 44 * Math.cos(a)} cy={50 + 44 * Math.sin(a)} r="1.7" fill="#38bdf8" opacity="0.95" />;
              })}
            </svg>
            {/* multi-layer aura pulses (gold + cyan, offset) */}
            <div className="absolute -inset-8 rounded-full bg-[radial-gradient(circle,rgba(255,215,0,0.18),transparent_70%)] animate-pulse pointer-events-none" />
            <div className="absolute -inset-8 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.10),transparent_68%)] animate-pulse pointer-events-none" style={{ animationDelay: '1.5s' }} />
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 animate-cosmic-float">
              <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#ff6f00,#ffd700,#fff7cc,#ffd700,#ff6f00)] blur-[2px] opacity-95" />
              {/* rotating light sheen — glint sweeping around the rim */}
              <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0%,rgba(255,255,255,0.5)_10%,transparent_26%)] animate-[spin_4.5s_linear_infinite] mix-blend-screen pointer-events-none" />
              <div className="absolute inset-[6px] rounded-full bg-[#0b0d21] flex items-center justify-center border border-amber-200/40 shadow-[inset_0_2px_14px_rgba(0,0,0,0.85),0_0_30px_rgba(255,180,0,0.25)] overflow-hidden">
                {/* layered 3D Jagannath temple emblem — kalash, shikhar, mandapa, doorway light */}
                <div className="relative flex flex-col items-center leading-none pb-1">
                  <div className="h-2 w-2 rounded-full bg-gradient-to-b from-yellow-100 to-amber-600 shadow-[0_0_10px_rgba(255,215,0,0.9)]" />
                  <div className="h-2 w-[3px] bg-gradient-to-b from-amber-300 to-amber-700" />
                  <div className="-mt-px h-7 w-9 [clip-path:polygon(50%_0%,100%_100%,0%_100%)] bg-gradient-to-b from-orange-200 via-amber-500 to-amber-800 shadow-[0_2px_12px_rgba(255,150,0,0.45)]" />
                  <div className="relative -mt-px flex h-5 w-12 items-end justify-center border-x border-t border-amber-300/50 bg-gradient-to-b from-amber-600/95 to-amber-900/95">
                    <div className="h-3.5 w-3.5 rounded-t-full bg-[#140b28] border border-amber-300/60 border-b-0 shadow-[inset_0_2px_6px_rgba(255,180,0,0.35)]" />
                  </div>
                  <div className="h-[6px] w-14 rounded-b-[3px] bg-gradient-to-b from-amber-400 to-amber-800 shadow-[0_3px_10px_rgba(255,150,0,0.35)]" />
                  <div className="absolute bottom-[6px] left-1/2 h-2 w-5 -translate-x-1/2 rounded-full bg-orange-400/40 blur-[3px]" />
                </div>
              </div>
              <div className="absolute inset-[-10px] animate-spin-slower">
                <span className="absolute left-1/2 -top-1 -ml-1 text-sm drop-shadow-[0_0_6px_rgba(255,180,0,0.8)]">🪔</span>
              </div>
              <div className="absolute inset-[-10px] animate-spin-slower [animation-direction:reverse]">
                <span className="absolute left-1/2 -bottom-1 -ml-1 text-sm opacity-85">✨</span>
              </div>
              {/* twinkling sparkles around the emblem */}
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={`sp${i}`}
                  className="pointer-events-none absolute text-[10px] text-amber-200 animate-cosmic-twinkle"
                  style={{ left: `${8 + i * 28}%`, top: i % 2 === 0 ? '-6%' : '96%', animationDelay: `${i * 0.7}s` }}
                >
                  ✦
                </span>
              ))}
              {/* soft ground reflection */}
              <div className="absolute -bottom-3 left-1/2 h-3 w-20 -translate-x-1/2 rounded-full bg-amber-500/25 blur-md" />
            </div>
          </div>
        </div>
        <p className={`mt-4 text-[11px] sm:text-xs font-bold uppercase text-amber-200/80 ${language === 'or' ? 'tracking-[0.1em]' : 'tracking-[0.3em]'}`}>{p.greeting}</p>
        <h2 className="mx-auto mt-2 max-w-[90%] px-2 font-serif text-[clamp(1.35rem,4.2vw,2.4rem)] font-black leading-[1.45] text-balance break-words dj-shine">{p.tithiLabel}</h2>
        {p.tithiDurationStr && (
          <div className="mx-auto mt-1.5 flex w-fit items-center gap-1.5 rounded-full border border-amber-400/35 bg-amber-500/15 px-3 py-0.5 text-[11px] font-semibold text-amber-200 shadow-sm shadow-amber-500/10">
            <Sparkles className="h-3 w-3 text-amber-300" />
            <span>{p.tithiDurationStr}</span>
          </div>
        )}
        <p className="mt-1.5 text-xs sm:text-sm text-slate-300">
          <span className="text-cyan-300 font-semibold">✦ {p.nakshatraLabel}</span>
          <span className="mx-2 text-slate-600">•</span>
          <span className="text-amber-200 font-semibold">{p.vaaraLabel}</span>
        </p>
        <p className="mx-auto mt-3 max-w-xl text-xs sm:text-[13px] italic leading-relaxed text-slate-300">“{p.shloka}”</p>
        {p.festivals && p.festivals.length > 0 && (
          <div className="mx-auto mt-3 flex w-fit max-w-xl flex-wrap justify-center gap-1.5">
            {p.festivals.slice(0, 2).map((f) => (
              <span key={f} className="rounded-full border border-amber-300/40 bg-amber-500/15 px-3 py-1 text-[10px] font-bold text-amber-100">
                🎉 {f}
              </span>
            ))}
          </div>
        )}
        {sunTimes && (
          <div className="mx-auto mt-5 grid max-w-lg grid-cols-3 items-center gap-2">
            <div className="rounded-2xl border border-orange-400/30 bg-orange-950/40 px-2 py-2.5 min-w-0">
              <Sunrise className="mx-auto h-4 w-4 text-orange-300" />
              <div className="mt-1 text-[10px] uppercase tracking-normal text-orange-200/70 font-bold">{language === 'or' ? 'ସୂର୍ଯ୍ୟୋଦୟ' : language === 'hi' ? 'सूर्योदय' : 'Sunrise'}</div>
              <div className="font-sans text-[12px] sm:text-[13px] font-black text-orange-200 whitespace-nowrap">{sunTimes.rise}</div>
            </div>
            <div className="rounded-2xl border border-amber-300/40 bg-amber-500/10 px-2 py-2.5 min-w-0">
              <MoonStar className="mx-auto h-4 w-4 text-amber-200" />
              <div className="mt-1 text-[10px] uppercase tracking-normal text-amber-200/80 font-bold">{language === 'or' ? 'ଆଜି' : language === 'hi' ? 'आज' : 'Today'}</div>
              <div className="font-serif text-sm font-black text-amber-100">{day ? formatNumber(day.dayOfMonth) : ''}</div>
            </div>
            <div className="rounded-2xl border border-indigo-400/30 bg-indigo-950/40 px-2 py-2.5 min-w-0">
              <Sunset className="mx-auto h-4 w-4 text-indigo-300" />
              <div className="mt-1 text-[10px] uppercase tracking-normal text-indigo-200/70 font-bold">{language === 'or' ? 'ସୂର୍ଯ୍ୟାସ୍ତ' : language === 'hi' ? 'सूर्यास्त' : 'Sunset'}</div>
              <div className="font-sans text-[12px] sm:text-[13px] font-black text-indigo-200 whitespace-nowrap">{sunTimes.set}</div>
            </div>
          </div>
        )}
        {dayLength && (
          <div className="mx-auto mt-5 flex max-w-md items-center gap-2 text-[10px] font-bold text-emerald-300">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-emerald-400/60" />
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span className="uppercase tracking-[0.2em]">
              {language === 'or'
                ? `ଦିନର ଦୈର୍ଘ୍ୟ ${formatNumber(dayLength.h)}ଘ ${formatNumber(dayLength.m)}ମି`
                : language === 'hi'
                  ? `दिन की लंबाई ${formatNumber(dayLength.h)}घं ${formatNumber(dayLength.m)}मि`
                  : `Day Length ${formatNumber(dayLength.h)}h ${formatNumber(dayLength.m)}m`}
            </span>
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-emerald-400/60" />
          </div>
        )}
      </div>
    </section>
  );
};
