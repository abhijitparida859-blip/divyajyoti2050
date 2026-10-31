// ============================================================================
//  UPCOMING FESTIVALS — scans the next 30 days with live countdown badges.
//  Real panchang engine data, respects selected location.
// ============================================================================
import React, { useMemo } from 'react';
import { useI18n } from '../../localization/i18n';
import { calculatePanjika } from '../../core/panjika/panjika_engine';
import { getCivilDateParts, istInstantFromMinutes } from '../../core/astronomy/istTime';
import { Sparkles } from 'lucide-react';

interface Props {
  latitude: number;
  longitude: number;
}

interface Fest {
  date: Date;
  names: string[];
  daysAway: number;
}

/** Engine emits festival names in English — trilingual display names for the front page. */
const FEST_NAMES: Record<string, { or: string; hi: string; en: string }> = {
  'Ekadashi Vrata': { or: 'ଏକାଦଶୀ ବ୍ରତ', hi: 'एकादशी व्रत', en: 'Ekadashi Vrata' },
  'Pradosha Vrata': { or: 'ପ୍ରଦୋଷ ବ୍ରତ', hi: 'प्रदोष व्रत', en: 'Pradosha Vrata' },
  'Maha Shivaratri / Masik Shivaratri': { or: 'ମହାଶିବରାତ୍ରୀ / ମାସିକ ଶିବରାତ୍ରୀ', hi: 'महाशिवरात्रि / मासिक शिवरात्रि', en: 'Maha Shivaratri / Masik Shivaratri' },
  'Satyanarayan Purnima': { or: 'ସତ୍ୟନାରାୟଣ ପୂର୍ଣ୍ଣିମା', hi: 'सत्यनारायण पूर्णिमा', en: 'Satyanarayan Purnima' },
  'Darsha Amavasya': { or: 'ଦର୍ଶା ଅମାବାସ୍ୟା', hi: 'दर्शा अमावस्या', en: 'Darsha Amavasya' },
};

export const UpcomingFestivals: React.FC<Props> = ({ latitude, longitude }) => {
  const { language, formatNumber } = useI18n();
  const L = (or: string, hi: string, en: string) => (language === 'or' ? or : language === 'hi' ? hi : en);
  const festLabel = (name: string) => {
    const e = FEST_NAMES[name];
    if (!e) return name;
    return language === 'or' ? e.or : language === 'hi' ? e.hi : e.en;
  };

  const upcoming = useMemo<Fest[]>(() => {
    const out: Fest[] = [];
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const lastSeen: Record<string, number> = {};
    for (let i = 0; i <= 30 && out.length < 6; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      try {
        // Probe at IST noon of the civil day so the festival labels do not shift
        // with the host timezone (Odisha panjika is always resolved in IST).
        const p = calculatePanjika(istInstantFromMinutes(getCivilDateParts(d), 720), latitude, longitude);
        // A long tithi can mark the same vrata on two civil days — show it once.
        const names = (p.festivals ?? []).filter((n) => lastSeen[n] === undefined || i - lastSeen[n] >= 3);
        if (names.length > 0) {
          names.forEach((n) => { lastSeen[n] = i; });
          out.push({ date: d, names, daysAway: i });
        }
      } catch {
        // Skip days the engine can't compute — never break the front page.
      }
    }
    return out;
  }, [latitude, longitude]);

  if (!upcoming.length) return null;
  const dateLocale = language === 'or' ? 'or-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';

  return (
    <section className="relative overflow-hidden rounded-3xl border border-rose-300/25 bg-[#0b0d21]/85 backdrop-blur-xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-rose-200">
          <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
          {L('ଆଗାମୀ ପର୍ବଗୁଡ଼ିକ', 'आगामी पर्व', 'Upcoming Festivals')}
        </span>
        <span className="rounded-full border border-rose-400/40 bg-rose-500/15 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-rose-200">
          {L(`ପରବର୍ତ୍ତୀ ${formatNumber(upcoming.length)} ଦିନ`, `अगले ${formatNumber(upcoming.length)}`, `Next ${formatNumber(upcoming.length)}`)}
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {upcoming.map((f) => (
          <div
            key={f.date.toISOString()}
            className="rounded-2xl border border-slate-700/60 bg-gradient-to-b from-slate-900/80 to-[#0b0d21] p-3 hover:-translate-y-1.5 hover:border-amber-400/50 hover:shadow-[0_16px_40px_-18px_rgba(255,190,0,0.5)] transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-lg leading-none">{f.daysAway === 0 ? '🎉' : '📅'}</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[9px] font-black uppercase ${
                  f.daysAway === 0
                    ? 'border border-amber-400/50 bg-amber-500/25 text-amber-100 animate-pulse'
                    : 'bg-slate-700/60 text-slate-300'
                }`}
              >
                {f.daysAway === 0
                  ? L('ଆଜି', 'आज', 'Today')
                  : `${formatNumber(f.daysAway)} ${L('ଦିନ', 'दिन', 'days')}`}
              </span>
            </div>
            <div className="mt-1.5 text-[10px] font-bold text-amber-300/90">
              {formatNumber(f.date.getDate())} {f.date.toLocaleDateString(dateLocale, { month: 'short' })}
            </div>
            <div className="mt-0.5 max-h-[2.7em] overflow-hidden text-[11px] font-semibold leading-snug text-slate-200">
              {f.names.map(festLabel).join(', ')}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
