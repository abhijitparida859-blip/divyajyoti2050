import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '../../localization/i18n';
import { audioSynth } from '../../core/audio/meditation_synthesizer';
import { BREATH_PROGRAMS } from '../../core/meditation/sadhanaCatalog';
import type { BreathProgram, BreathPhaseKind } from '../../core/meditation/sadhanaCatalog';
import { MORE_BREATH, SOUND_PROGRAMS, PHASE_LABEL, PHASE_ACTION_HINT, totalProgramSeconds } from '../../core/meditation/sadhanaCatalog2';
import { BreathOrb3D } from './BreathOrb3D';
import { calculatePanjika } from '../../core/panjika/panjika_engine';
import { getSavedUserLocation } from '../../core/geo/mobileLocationService';
import { Music, Wind, Play, Pause, Square, RotateCcw, Volume2, VolumeX, Sparkles, Sunrise, Sunset, Sun, Moon, MoonStar, Timer, Trophy, Headphones, Bell, Clock, Flame, BookOpen, CheckCircle2, Compass } from 'lucide-react';

const ALL_PROGRAMS: BreathProgram[] = [...BREATH_PROGRAMS, ...MORE_BREATH];
const TIMER_PRESETS = [3, 5, 10, 15, 20, 30];
const STATS_KEY = 'dj_sadhana_v1';

const SOUND_METADATA: Record<string, { category: 'cosmic' | 'chakra' | 'healing'; chakra: Record<'or' | 'hi' | 'en', string>; color: string; icon: string }> = {
  'om-136': {
    category: 'cosmic',
    chakra: { or: 'ଓଁକାର • ପୃଥିବୀ ଅଷ୍ଟକ', hi: 'ओंकार • पृथ्वी अष्टक', en: 'Cosmic Om • Earth Orbit' },
    color: '#EAB308',
    icon: '🕉️',
  },
  'schumann': {
    category: 'cosmic',
    chakra: { or: 'ଆଲଫା ମସ୍ତିଷ୍କ ତରଙ୍ଗ (୭.୮୩ Hz)', hi: 'अल्फा मस्तिष्क तरंग (७.८३ Hz)', en: 'Alpha Brainwave (7.83 Hz)' },
    color: '#38BDF8',
    icon: '🌍',
  },
  's396': {
    category: 'chakra',
    chakra: { or: '୧ମ ଚକ୍ର: ମୂଳାଧାର (Root)', hi: '१म चक्र: मूलाधार (Root)', en: '1st Chakra: Muladhara' },
    color: '#EF4444',
    icon: '🔴',
  },
  's417': {
    category: 'chakra',
    chakra: { or: '୨ୟ ଚକ୍ର: ସ୍ୱାଧିଷ୍ଠାନ (Sacral)', hi: '२य चक्र: स्वाधिष्ठान (Sacral)', en: '2nd Chakra: Swadhisthana' },
    color: '#F97316',
    icon: '🟠',
  },
  's528': {
    category: 'chakra',
    chakra: { or: 'ମିରାକଲ୍ ତରଙ୍ଗ (Miracle Tone)', hi: 'मिरेकल टोन (Miracle Tone)', en: 'Transformation Miracle Tone' },
    color: '#FACC15',
    icon: '✨',
  },
  's639': {
    category: 'chakra',
    chakra: { or: '୪ର୍ଥ ଚକ୍ର: ଅନାହତ (Heart)', hi: '४र्थ चक्र: अनाहत (Heart)', en: '4th Chakra: Anahata' },
    color: '#10B981',
    icon: '💚',
  },
  's741': {
    category: 'chakra',
    chakra: { or: '୫ମ ଚକ୍ର: ବିଶୁଦ୍ଧ (Throat)', hi: '५म चक्र: विशुद्ध (Throat)', en: '5th Chakra: Vishuddha' },
    color: '#0EA5E9',
    icon: '🔷',
  },
  's852': {
    category: 'chakra',
    chakra: { or: '୬ଷ୍ଠ ଚକ୍ର: ଆଜ୍ଞା (Third Eye)', hi: '६ष्ठ चक्र: आज्ञा (Third Eye)', en: '6th Chakra: Ajna' },
    color: '#6366F1',
    icon: '👁️',
  },
  's963': {
    category: 'chakra',
    chakra: { or: '୭ମ ଚକ୍ର: ସହସ୍ରାର (Crown)', hi: '७म चक्र: सहस्रार (Crown)', en: '7th Chakra: Sahasrara' },
    color: '#A855F7',
    icon: '👑',
  },
  's174': {
    category: 'healing',
    chakra: { or: 'ପ୍ରାକୃତିକ ନିରାମୟ (Anesthetic)', hi: 'प्राकृतिक पीड़ा मुक्ति', en: 'Natural Anesthetic' },
    color: '#14B8A6',
    icon: '🌿',
  },
  's285': {
    category: 'healing',
    chakra: { or: 'କୋଷୀୟ ପୁନର୍ଜୀବନ (Restoration)', hi: 'कोशिकीय पुनर्जीवन', en: 'Cellular Restoration' },
    color: '#06B6D4',
    icon: '💎',
  },
  'gayatri-108': {
    category: 'cosmic',
    chakra: { or: 'ବୈଦିକ ଜପ ତରଙ୍ଗ (Sacred Japa)', hi: 'वैदिक जप तरंग', en: 'Sacred 108 Japa' },
    color: '#F59E0B',
    icon: '📿',
  },
};

interface SadhanaStats { sessions: number; days: Record<string, number>; }

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function loadStats(): SadhanaStats {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(STATS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<SadhanaStats>;
        if (parsed && typeof parsed.sessions === 'number' && parsed.days) {
          return { sessions: parsed.sessions, days: parsed.days };
        }
      }
    }
  } catch { /* SSR or private mode */ }
  return { sessions: 0, days: {} };
}

function saveStats(s: SadhanaStats) {
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(STATS_KEY, JSON.stringify(s));
  } catch { /* ignore */ }
}

const SectionHead: React.FC<{ icon: React.ReactNode; title: string; sub?: string }> = ({ icon, title, sub }) => (
  <div className="flex items-start gap-3 mb-5">
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cosmic-gold to-cosmic-saffron text-cosmic-950 grid place-items-center shadow-lg shadow-cosmic-gold/20 shrink-0">{icon}</div>
    <div className="min-w-0">
      <h3 className="text-lg sm:text-xl font-bold font-serif bg-gradient-to-r from-cosmic-gold via-yellow-200 to-cosmic-saffron bg-clip-text text-transparent">{title}</h3>
      {sub && <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{sub}</p>}
    </div>
  </div>
);

const Tile: React.FC<{ icon: React.ReactNode; label: string; value: string; sub?: string }> = ({ icon, label, value, sub }) => (
  <div className="rounded-2xl border border-white/10 p-3 sm:p-3.5 bg-cosmic-950/50 hover:border-cosmic-gold/40 transition-colors">
    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-slate-400">{icon}{label}</div>
    <div className="mt-1 text-sm sm:text-base font-bold text-slate-100 leading-tight">{value}</div>
    {sub && <div className="text-[10px] text-slate-500 mt-0.5 truncate">{sub}</div>}
  </div>
);

export const CalmStudio: React.FC = () => {
  const { t, language, formatNumber, formatTime, tTithiFromKey, tNakshatra, tVaara, tYoga } = useI18n();

  // ── 100% real data: today's Panchanga from the Vedic engine (saved GPS → default Srikshetra Puri) ──
  const today = useMemo(() => {
    try {
      const loc = getSavedUserLocation();
      return calculatePanjika(new Date(), loc?.lat ?? 19.8135, loc?.lon ?? 85.8312);
    } catch {
      return calculatePanjika(new Date());
    }
  }, []);

  const recKey = useMemo(() => {
    const nk = today.tithi.nameKey;
    if (nk.includes('Ekadashi')) return 'ms_rec_ekadashi';
    if (nk.includes('Purnima')) return 'ms_rec_purnima';
    if (nk.includes('Amavasya')) return 'ms_rec_amavasya';
    return today.tithi.paksha === 'Shukla' ? 'ms_rec_shukla' : 'ms_rec_krishna';
  }, [today]);

  // ── Sadhana stats (local-first, offline) ──
  const [stats, setStats] = useState<SadhanaStats>(loadStats);
  const logSession = (sec: number) => {
    setStats(prev => {
      const next: SadhanaStats = { sessions: prev.sessions + 1, days: { ...prev.days } };
      const k = dayKey(new Date());
      next.days[k] = (next.days[k] || 0) + sec;
      saveStats(next);
      return next;
    });
  };

  const streak = useMemo(() => {
    let count = 0;
    const d = new Date();
    if (!((stats.days[dayKey(d)] || 0) > 0)) d.setDate(d.getDate() - 1);
    for (let i = 0; i < 3660; i++) {
      if ((stats.days[dayKey(d)] || 0) > 0) { count++; d.setDate(d.getDate() - 1); } else break;
    }
    return count;
  }, [stats]);

  const todayMin = Math.round((stats.days[dayKey(new Date())] || 0) / 60);
  const totalMin = Math.round(Object.values(stats.days).reduce((a, b) => a + b, 0) / 60);

  const last7 = useMemo(() => {
    const out: { label: string; min: number; isToday: boolean }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      out.push({ label: String(d.getDate()), min: Math.round((stats.days[dayKey(d)] || 0) / 60), isToday: i === 0 });
    }
    return out;
  }, [stats]);
  const barMax = Math.max(1, ...last7.map(x => x.min));

  // ── Pranayama engine: rounds → phases → rest at 100ms precision ──
  const [selId, setSelId] = useState('p478');
  const program = ALL_PROGRAMS.find(p => p.id === selId) || ALL_PROGRAMS[0];
  const [running, setRunning] = useState(false);
  const [cues, setCues] = useState(true);
  const [doneMsg, setDoneMsg] = useState(false);
  const [runSt, setRunSt] = useState({ round: 1, idx: 0, elapsed: 0, completed: 0 });
  const [activeGuideTab, setActiveGuideTab] = useState<'steps' | 'benefits' | 'posture' | 'orbGuide'>('steps');

  useEffect(() => {
    if (!running) return;
    const iv = window.setInterval(() => {
      setRunSt(prev => {
        const phases = program.phases;
        const seqLen = prev.round < program.rounds ? phases.length + 1 : phases.length;
        let round = prev.round;
        let idx = prev.idx;
        let elapsed = Math.round((prev.elapsed + 0.1) * 100) / 100;
        const curSec = idx < phases.length ? phases[idx].seconds : program.restSec;
        if (elapsed >= curSec) {
          elapsed = 0;
          idx += 1;
          if (idx >= seqLen) {
            if (round >= program.rounds) return { round: 1, idx: 0, elapsed: 0, completed: prev.completed + 1 };
            round += 1;
            idx = 0;
          }
        }
        return { round, idx, elapsed, completed: prev.completed };
      });
    }, 100);
    return () => window.clearInterval(iv);
  }, [running, program]);

  const lastCompleted = useRef(0);
  useEffect(() => {
    if (runSt.completed === lastCompleted.current) return;
    lastCompleted.current = runSt.completed;
    if (runSt.completed === 0) return;
    setRunning(false);
    setDoneMsg(true);
    audioSynth.playPhaseCue('done');
    logSession(Math.round(totalProgramSeconds(program)));
  }, [runSt.completed, program]);

  const curKind: BreathPhaseKind = runSt.idx < program.phases.length ? program.phases[runSt.idx].kind : 'rest';
  const curSec = runSt.idx < program.phases.length ? program.phases[runSt.idx].seconds : Math.max(1, program.restSec);
  const phasePct = Math.max(0, Math.min(1, runSt.elapsed / curSec));

  const lastCue = useRef('');
  useEffect(() => {
    if (!running) return;
    const sig = `${program.id}:${runSt.round}:${runSt.idx}`;
    if (sig === lastCue.current) return;
    lastCue.current = sig;
    if (!cues) return;
    const cue = curKind === 'inhale' ? 'inhale' : curKind === 'exhale' ? 'exhale' : 'hold';
    audioSynth.playPhaseCue(cue);
  }, [running, runSt.round, runSt.idx, program.id, cues, curKind]);

  const pickProgram = (id: string) => {
    setSelId(id);
    setRunning(false);
    setDoneMsg(false);
    setRunSt(prev => ({ round: 1, idx: 0, elapsed: 0, completed: prev.completed }));
  };
  const resetRun = () => {
    setRunning(false);
    setDoneMsg(false);
    setRunSt(prev => ({ round: 1, idx: 0, elapsed: 0, completed: prev.completed }));
  };

  // ── Dhyana timer ──
  const [timerMin, setTimerMin] = useState(10);
  const [tLeft, setTLeft] = useState(10 * 60);
  const [tRun, setTRun] = useState(false);
  const [tDone, setTDone] = useState(false);

  useEffect(() => {
    if (!tRun) return;
    const iv = window.setInterval(() => setTLeft(l => Math.max(0, l - 1)), 1000);
    return () => window.clearInterval(iv);
  }, [tRun]);

  const loggedTimer = useRef(0);
  useEffect(() => {
    if (tRun && tLeft === 0) {
      setTRun(false);
      setTDone(true);
      const total = timerMin * 60;
      if (loggedTimer.current !== total) {
        loggedTimer.current = total;
        audioSynth.playTempleChime(528);
        window.setTimeout(() => audioSynth.playTempleChime(396), 950);
        logSession(total);
      }
    }
  }, [tLeft, tRun, timerMin]);

  const pickTimer = (m: number) => {
    setTimerMin(m);
    setTLeft(m * 60);
    setTRun(false);
    setTDone(false);
    loggedTimer.current = 0;
  };
  const resetTimer = () => {
    setTLeft(timerMin * 60);
    setTRun(false);
    setTDone(false);
    loggedTimer.current = 0;
  };

  // ── Sacred sound lab ──
  const [activeTone, setActiveTone] = useState<string | null>(null);
  const [volume, setVolume] = useState(30);
  const [omOn, setOmOn] = useState(false);
  const [soundFilter, setSoundFilter] = useState<'all' | 'cosmic' | 'chakra' | 'healing'>('all');

  const toggleTone = (id: string) => {
    const sp = SOUND_PROGRAMS.find(s => s.id === id);
    if (!sp) return;
    if (activeTone === id) {
      audioSynth.stopTone();
      setActiveTone(null);
      return;
    }
    audioSynth.playTone(sp.id, sp.carrierHz, sp.beatHz, Math.max(0.02, volume / 100));
    setActiveTone(id);
  };
  const changeVolume = (v: number) => {
    setVolume(v);
    if (activeTone) {
      const sp = SOUND_PROGRAMS.find(s => s.id === activeTone);
      if (sp) {
        audioSynth.stopTone();
        audioSynth.playTone(sp.id, sp.carrierHz, sp.beatHz, Math.max(0.02, v / 100));
      }
    }
  };
  const stopEverything = () => {
    audioSynth.stopAll();
    audioSynth.stopTone();
    setOmOn(false);
    setActiveTone(null);
  };

  const timerTotal = timerMin * 60;
  const tPct = timerTotal > 0 ? tLeft / timerTotal : 0;
  const mm = Math.floor(tLeft / 60);
  const ss = tLeft % 60;
  const RING_R = 52;
  const RING_C = 2 * Math.PI * RING_R;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* ═══ HERO ═══ */}
      <div className="relative overflow-hidden bg-gradient-to-r from-cosmic-900/90 via-cosmic-800/80 to-cosmic-900/90 border border-cosmic-gold/30 rounded-3xl p-6 shadow-2xl backdrop-blur-md animate-cosmic-rise">
        <div className="absolute -top-20 -right-16 w-64 h-64 bg-cosmic-gold/10 rounded-full blur-3xl animate-cosmic-drift pointer-events-none" />
        <div className="absolute -bottom-24 -left-16 w-64 h-64 bg-cosmic-amethyst/10 rounded-full blur-3xl animate-cosmic-drift-slow pointer-events-none" />
        <div className="relative flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cosmic-gold text-xs font-semibold uppercase tracking-[0.25em] mb-1.5">
              <Music className="w-4 h-4 text-cosmic-saffron" />
              <span>{t('meditation_studio')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif bg-gradient-to-r from-white via-cosmic-gold to-cosmic-saffron bg-clip-text text-transparent">
              {t('meditation_hero_title')}
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-md">{t('meditation_hero_sub')}</p>
          </div>
          <div className="hidden sm:grid w-16 h-16 rounded-2xl place-items-center bg-gradient-to-br from-cosmic-gold/20 to-cosmic-saffron/20 border border-cosmic-gold/40 animate-float shadow-lg shadow-cosmic-gold/10 shrink-0">
            <span className="text-3xl text-cosmic-gold">ॐ</span>
          </div>
        </div>
      </div>

      {/* ═══ TODAY: 100% REAL PANCHANGA ═══ */}
      <section className="bg-cosmic-900/60 border border-cosmic-gold/20 rounded-3xl p-5 sm:p-6 backdrop-blur-md shadow-xl animate-cosmic-rise" style={{ animationDelay: '60ms' }}>
        <SectionHead icon={<Sparkles className="w-5 h-5" />} title={t('ms_today_title')} sub={`${t('tithi')} • ${t('nakshatra')} • ${t('vaara')}`} />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Tile icon={<MoonStar className="w-3.5 h-3.5" />} label={t('tithi')} value={tTithiFromKey(today.tithi.nameKey)} sub={`${formatNumber(today.tithi.percentage)}%`} />
          <Tile icon={<Sparkles className="w-3.5 h-3.5" />} label={t('nakshatra')} value={tNakshatra(today.nakshatra.nameKey)} sub={`${t('pada_label')} ${formatNumber(today.nakshatra.pada)} • ${t('ruler_label')} ${today.nakshatra.ruler}`} />
          <Tile icon={<Sun className="w-3.5 h-3.5" />} label={t('vaara')} value={tVaara(today.vaara)} sub={tYoga(today.yoga.nameKey)} />
          <Tile icon={<Sunrise className="w-3.5 h-3.5" />} label={t('sunrise')} value={formatTime(today.sunrise)} />
          <Tile icon={<Sunset className="w-3.5 h-3.5" />} label={t('sunset')} value={formatTime(today.sunset)} />
          <Tile icon={<Moon className="w-3.5 h-3.5" />} label={t('moon_phase')} value={`${formatNumber(Math.round(today.moonPhase * 100))}%`} sub={`${t('paksha_label')}: ${today.tithi.paksha}`} />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full bg-cosmic-celestial/10 border border-cosmic-celestial/30 text-sky-200">
            <Clock className="w-3.5 h-3.5" /> {t('brahma_muhurta')}: {formatTime(today.muhurtas.brahmaMuhurta.start)} – {formatTime(today.muhurtas.brahmaMuhurta.end)}
          </span>
          {today.festivals.map(f => (
            <span key={f} className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full bg-cosmic-gold/10 border border-cosmic-gold/30 text-cosmic-gold">
              <Flame className="w-3.5 h-3.5" /> {f}
            </span>
          ))}
        </div>
        <div className="mt-4 flex gap-3 items-start bg-gradient-to-r from-cosmic-gold/10 via-cosmic-gold/5 to-transparent border border-cosmic-gold/25 rounded-2xl p-4">
          <div className="w-9 h-9 rounded-xl bg-cosmic-gold/15 border border-cosmic-gold/40 grid place-items-center text-cosmic-gold shrink-0 mt-0.5">🪔</div>
          <div className="min-w-0">
            <b className="text-[11px] uppercase tracking-[0.2em] text-cosmic-gold">{t('ms_rec_label')}</b>
            <p className="text-sm text-slate-200 mt-1 leading-relaxed">{t(recKey)}</p>
          </div>
        </div>
      </section>

      {/* ═══ PRANAYAMA 3D ═══ */}
      <section className="bg-cosmic-900/60 border border-cosmic-gold/20 rounded-3xl p-5 sm:p-6 backdrop-blur-md shadow-xl animate-cosmic-rise" style={{ animationDelay: '120ms' }}>
        <SectionHead icon={<Wind className="w-5 h-5" />} title={t('ms_pranayama_title')} sub={t('ms_pranayama_sub')} />
        <div className="grid lg:grid-cols-2 gap-6 items-start">
          {/* programs + controls */}
          <div className="space-y-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2">{t('ms_programs_label')} ({formatNumber(ALL_PROGRAMS.length)})</div>
              <div className="flex flex-wrap gap-2">
                {ALL_PROGRAMS.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => pickProgram(p.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 ${selId === p.id ? 'bg-gradient-to-r from-cosmic-gold to-cosmic-saffron text-cosmic-950 shadow-lg shadow-cosmic-gold/20' : 'bg-white/5 border border-white/10 text-slate-300 hover:border-cosmic-gold/40 hover:text-cosmic-gold'}`}
                  >
                    {p.name[language]}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-cosmic-950/60 border border-cosmic-gold/15 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <b className="text-cosmic-gold font-serif text-base">{program.name[language]}</b>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cosmic-amethyst/20 text-purple-200 border border-cosmic-amethyst/40 whitespace-nowrap">
                  {t('ms_round_label')} {formatNumber(runSt.round)}/{formatNumber(program.rounds)}
                </span>
              </div>
              <p className="text-xs text-slate-300">{program.goal[language]}</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                <span className="text-slate-500">{t('ms_phases_label')}: </span>
                {program.phases.map(ph => `${PHASE_LABEL[ph.kind][language]} ${formatNumber(ph.seconds)} ${t('ms_sec')}`).join(' • ')}
                {' — '}{PHASE_LABEL.rest[language]} {formatNumber(program.restSec)} {t('ms_sec')}
              </p>
              <p className="text-[10px] italic text-slate-500">{t('ms_source_label')}: {program.source}</p>
              {program.caution && (
                <p className="text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg px-2.5 py-1.5">
                  ⚠️ {t('ms_caution_label')}: {program.caution[language]}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  if (doneMsg) setDoneMsg(false);
                  setRunning(r => !r);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all active:scale-95 bg-gradient-to-r from-cosmic-gold to-cosmic-saffron text-cosmic-950 shadow-lg shadow-cosmic-gold/20"
              >
                {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />} {running ? t('ms_pause') : t('ms_start')}
              </button>
              <button
                type="button"
                onClick={resetRun}
                className="px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 bg-white/5 border border-white/15 text-slate-300 hover:border-cosmic-gold/40 transition-all active:scale-95"
              >
                <RotateCcw className="w-4 h-4" /> {t('ms_reset')}
              </button>
              <button
                type="button"
                onClick={() => setCues(c => !c)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all active:scale-95 ${cues ? 'bg-cosmic-celestial/10 border-cosmic-celestial/40 text-sky-300' : 'bg-white/5 border-white/15 text-slate-500'}`}
              >
                {cues ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />} {t('ms_cues_label')}
              </button>
            </div>
            {doneMsg && (
              <div className="text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3 animate-cosmic-rise">✅ {t('ms_done')}</div>
            )}
          </div>
          {/* 3D breath orb */}
          <div className="relative">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full bg-cosmic-gold/10 blur-3xl pointer-events-none" />
            <div className="relative">
              <BreathOrb3D phase={curKind} progress={phasePct} running={running} />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="flex flex-col items-center justify-center w-36 h-36 rounded-full bg-cosmic-950/65 backdrop-blur-[3px] border border-cosmic-gold/30 shadow-2xl p-2 text-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-cosmic-gold leading-tight">
                    {PHASE_LABEL[curKind][language]}
                  </span>
                  <span className="text-4xl sm:text-5xl font-black font-serif leading-none my-1 bg-gradient-to-b from-white via-amber-100 to-cosmic-gold bg-clip-text text-transparent drop-shadow-md">
                    {formatNumber(Math.max(1, Math.ceil(curSec - runSt.elapsed)))}
                  </span>
                  <span className="text-[10px] text-amber-200 font-semibold leading-tight line-clamp-1 px-1">
                    {PHASE_ACTION_HINT[curKind][language]}
                  </span>
                  <span className="text-[9px] text-slate-400 mt-0.5">
                    {t('ms_round_label')} {formatNumber(runSt.round)}/{formatNumber(program.rounds)}
                  </span>
                </div>
              </div>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mx-4 mt-2">
              <div className="h-full bg-gradient-to-r from-cosmic-gold to-cosmic-saffron transition-[width] duration-100 ease-linear rounded-full" style={{ width: `${phasePct * 100}%` }} />
            </div>

            {/* Live action guidance callout banner */}
            <div className="mt-3.5 mx-auto max-w-xs text-center">
              <div className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all shadow-md flex items-center justify-center gap-1.5 ${
                curKind === 'inhale' ? 'bg-amber-500/20 border-amber-400/50 text-amber-200 shadow-amber-500/10' :
                curKind === 'hold' || curKind === 'holdEmpty' ? 'bg-indigo-500/20 border-indigo-400/50 text-indigo-200 shadow-indigo-500/10' :
                curKind === 'exhale' ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-200 shadow-cyan-500/10' :
                'bg-emerald-500/20 border-emerald-400/50 text-emerald-200 shadow-emerald-500/10'
              }`}>
                <span>{running ? '🌀' : '🧘'}</span>
                <span>{PHASE_ACTION_HINT[curKind][language]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ INTERACTIVE DETAILED PRANAYAMA MASTER GUIDE ═══ */}
        <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2.5">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cosmic-gold" />
              <h4 className="text-sm sm:text-base font-bold text-slate-100 font-serif">
                {language === 'or' ? `"${program.name.or}" — ଅଭ୍ୟାସ ବିଧି ଓ ଶାସ୍ତ୍ରୋକ୍ତ ଲାଭ` :
                 language === 'hi' ? `"${program.name.hi}" — अभ्यास विधि एवं स्वास्थ्य लाभ` :
                 `How to Practice "${program.name.en}" & Proven Benefits`}
              </h4>
            </div>
            {/* Guide tabs */}
            <div className="flex flex-wrap gap-1 bg-cosmic-950/80 p-1 rounded-xl border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setActiveGuideTab('steps')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  activeGuideTab === 'steps' ? 'bg-cosmic-gold text-cosmic-950 shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {language === 'or' ? '📋 ପ୍ରଣାଳୀ ଓ ବିଧି' : language === 'hi' ? '📋 अभ्यास विधि' : '📋 How-To Steps'}
              </button>
              <button
                type="button"
                onClick={() => setActiveGuideTab('benefits')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  activeGuideTab === 'benefits' ? 'bg-cosmic-gold text-cosmic-950 shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {language === 'or' ? '✨ ଶାସ୍ତ୍ରୋକ୍ତ ଲାଭ' : language === 'hi' ? '✨ स्वास्थ्य लाभ' : '✨ Benefits'}
              </button>
              <button
                type="button"
                onClick={() => setActiveGuideTab('posture')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  activeGuideTab === 'posture' ? 'bg-cosmic-gold text-cosmic-950 shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {language === 'or' ? '🧘 ଆସନ ଓ ସମୟ' : language === 'hi' ? '🧘 आसन व समय' : '🧘 Posture & Time'}
              </button>
              <button
                type="button"
                onClick={() => setActiveGuideTab('orbGuide')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  activeGuideTab === 'orbGuide' ? 'bg-cosmic-gold text-cosmic-950 shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {language === 'or' ? '🔮 ୩D ମଣ୍ଡଳ ଗାଇଡ୍' : language === 'hi' ? '🔮 ३D मंडल गाइड' : '🔮 3D Orb Guide'}
              </button>
            </div>
          </div>

          {/* Tab Content Display */}
          <div className="bg-cosmic-950/70 border border-cosmic-gold/15 rounded-2xl p-4 sm:p-5">
            {activeGuideTab === 'steps' && (
              <div className="space-y-3">
                <div className="text-xs font-bold text-cosmic-gold uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {language === 'or' ? 'ପର୍ଯ୍ୟାୟକ୍ରମେ ଅଭ୍ୟାସ ବିଧି:' : language === 'hi' ? 'क्रमबद्ध अभ्यास विधि:' : 'Step-by-Step Instructions:'}
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {program.steps ? (
                    program.steps[language].map((st, i) => (
                      <div key={i} className="flex gap-2.5 items-start p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-slate-200 leading-relaxed">
                        <span className="w-5 h-5 rounded-full bg-cosmic-gold/20 text-cosmic-gold font-bold grid place-items-center shrink-0 text-[11px]">
                          {formatNumber(i + 1)}
                        </span>
                        <span>{st}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-400 col-span-2">
                      {program.goal[language]}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeGuideTab === 'benefits' && (
              <div className="space-y-3">
                <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {language === 'or' ? 'ଚିକିତ୍ସା ଓ ଆଧ୍ୟାତ୍ମିକ ଲାଭ:' : language === 'hi' ? 'चिकित्सीय एवं आध्यात्मिक लाभ:' : 'Therapeutic & Spiritual Benefits:'}
                </div>
                <div className="grid gap-2.5 sm:grid-cols-3">
                  {program.benefits ? (
                    program.benefits[language].map((bf, i) => (
                      <div key={i} className="flex gap-2.5 items-start p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-emerald-100 leading-relaxed">
                        <span className="text-emerald-400 font-bold shrink-0">✦</span>
                        <span>{bf}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-400 col-span-3">
                      {program.goal[language]}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeGuideTab === 'posture' && (
              <div className="grid gap-3 sm:grid-cols-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-cosmic-gold" />
                    {language === 'or' ? 'ଉପଯୁକ୍ତ ଆସନ ଓ ମୁଦ୍ରା' : language === 'hi' ? 'उपयुक्त आसन व मुद्रा' : 'Recommended Posture'}
                  </span>
                  <p className="text-slate-200 mt-1 leading-relaxed">
                    {program.posture ? program.posture[language] : (language === 'or' ? 'ସୁଖାସନରେ ସଳଖ ବସନ୍ତୁ।' : 'Sit tall in Sukhasana.')}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-cosmic-celestial" />
                    {language === 'or' ? 'ସର୍ବୋତ୍ତମ ସମୟ' : language === 'hi' ? 'सर्वोत्तम समय' : 'Best Time to Practice'}
                  </span>
                  <p className="text-slate-200 mt-1 leading-relaxed">
                    {program.bestTime ? program.bestTime[language] : (language === 'or' ? 'ପ୍ରାତଃକାଳ ଖାଲି ପେଟରେ।' : 'Morning on an empty stomach.')}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    {language === 'or' ? 'ମୂଳ ଶାସ୍ତ୍ରୀୟ ଉତ୍ସ' : language === 'hi' ? 'मूल शास्त्रीय स्रोत' : 'Classical Scriptural Reference'}
                  </span>
                  <p className="text-cosmic-gold font-medium mt-1 leading-relaxed">
                    📜 {program.source}
                  </p>
                  {program.caution && (
                    <div className="mt-2 pt-2 border-t border-amber-500/20 text-amber-300 text-[11px]">
                      ⚠️ {program.caution[language]}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeGuideTab === 'orbGuide' && (
              <div className="grid gap-3 sm:grid-cols-4 text-xs">
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
                  <div className="font-bold flex items-center gap-1.5 text-xs text-amber-300">
                    <span>🟡</span> {language === 'or' ? 'ମଣ୍ଡଳ ବୃଦ୍ଧି (Inhale)' : language === 'hi' ? 'मंडल फैलाव (पूरक)' : 'Orb Expands (Inhale)'}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-200 leading-relaxed">
                    {language === 'or' ? 'ମଣ୍ଡଳ ବଡ଼ ହେବା ସହ ଫୁସଫୁସ ପ୍ରସାରିତ କରି ଶ୍ୱାସ ଧୀରେ ଭିତରକୁ ନିଅନ୍ତୁ।' :
                     language === 'hi' ? 'जैसे ही मंडल बड़ा हो, फेफड़ों को फुलाते हुए शांत भाव से सांस अंदर भरें।' :
                     'As the orb expands, steadily inhale through your nose filling your lungs.'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-200">
                  <div className="font-bold flex items-center gap-1.5 text-xs text-indigo-300">
                    <span>🔵</span> {language === 'or' ? 'ମଣ୍ଡଳ ସ୍ଥିରତା (Hold)' : language === 'hi' ? 'मंडल ठहराव (कुंभक)' : 'Orb Glows (Hold)'}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-200 leading-relaxed">
                    {language === 'or' ? 'ମଣ୍ଡଳ ସ୍ଥିର ରହିବା ସମୟରେ ଶ୍ୱାସକୁ ଶାନ୍ତ ଭାବେ ଧରି ରଖନ୍ତୁ।' :
                     language === 'hi' ? 'जब तक मंडल चमके व स्थिर रहे, सांस को भीतर बिना तनाव रोककर रखें।' :
                     'While the orb maintains its luminous hold, calmly retain your breath.'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-200">
                  <div className="font-bold flex items-center gap-1.5 text-xs text-cyan-300">
                    <span>🟣</span> {language === 'or' ? 'ମଣ୍ଡଳ ସଙ୍କୋଚନ (Exhale)' : language === 'hi' ? 'मंडल सिकुड़ना (रेचक)' : 'Orb Shrinks (Exhale)'}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-200 leading-relaxed">
                    {language === 'or' ? 'ମଣ୍ଡଳ ଛୋଟ ହେବା ସହ ଧୀରେ ଧୀରେ ସମ୍ପୂର୍ଣ୍ଣ ଶ୍ୱାସ ବାହାରକୁ ଛାଡ଼ନ୍ତୁ।' :
                     language === 'hi' ? 'जैसे ही मंडल छोटा हो, नियंत्रित गति से पूरी सांस बाहर निकालें।' :
                     'As the orb shrinks, exhale completely and smoothly.'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200">
                  <div className="font-bold flex items-center gap-1.5 text-xs text-emerald-300">
                    <span>🔔</span> {language === 'or' ? 'ଧ୍ୱନି ସଙ୍କେତ (Audio Cue)' : language === 'hi' ? 'ध्वनि संकेत (ऑडियो)' : 'Audio Bell Chime'}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-200 leading-relaxed">
                    {language === 'or' ? 'ପ୍ରତି ପର୍ଯ୍ୟାୟ ପରିବର୍ତ୍ତନରେ ଏକ ସୁମଧୁର ଘଣ୍ଟି ବାଜିବ, ଯାହାଫଳରେ ଆଖି ବନ୍ଦ କରି ସାଧନା କରିହେବ।' :
                     language === 'hi' ? 'प्रत्येक चरण बदलने पर मधुर घंटी बजेगी, जिससे आंखें बंद रखकर भी साधना कर सकते हैं।' :
                     'A gentle temple chime rings at each transition so you can practice with closed eyes.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* TIMER + STATS */}
      <div className="grid lg:grid-cols-2 gap-6">
        <section className="bg-cosmic-900/60 border border-cosmic-gold/20 rounded-3xl p-5 sm:p-6 backdrop-blur-md shadow-xl animate-cosmic-rise" style={{ animationDelay: '180ms' }}>
          <SectionHead icon={<Timer className="w-5 h-5" />} title={t('ms_timer_title')} sub={t('ms_timer_sub')} />
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {TIMER_PRESETS.map(m => (
              <button
                key={m}
                type="button"
                onClick={() => pickTimer(m)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 ${timerMin === m ? 'bg-gradient-to-r from-cosmic-gold to-cosmic-saffron text-cosmic-950' : 'bg-white/5 border border-white/10 text-slate-300 hover:border-cosmic-gold/40'}`}
              >
                {formatNumber(m)} {t('ms_min_label')}
              </button>
            ))}
          </div>
          <div className="relative w-44 h-44 mx-auto">
            <svg viewBox="0 0 120 120" className="w-44 h-44 -rotate-90">
              <defs>
                <linearGradient id="msTimerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFD700" />
                  <stop offset="100%" stopColor="#FF6F00" />
                </linearGradient>
              </defs>
              <circle cx="60" cy="60" r={RING_R} fill="none" stroke="rgba(255,215,0,0.14)" strokeWidth="7" />
              <circle
                cx="60" cy="60" r={RING_R} fill="none" stroke="url(#msTimerGrad)" strokeWidth="7"
                strokeDasharray={RING_C} strokeDashoffset={RING_C * (1 - tPct)}
                className="transition-[stroke-dashoffset] duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold font-serif bg-gradient-to-b from-white to-cosmic-gold bg-clip-text text-transparent">
                {formatNumber(mm)}:{formatNumber(String(ss).padStart(2, '0'))}
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-slate-400 mt-1">{t('ms_timer_title')}</span>
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-4">
            <button
              type="button"
              onClick={() => {
                if (tLeft === 0) resetTimer();
                if (tDone) setTDone(false);
                if (!tRun) audioSynth.playBeadClick();
                setTRun(r => !r);
              }}
              className="px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all active:scale-95 bg-gradient-to-r from-cosmic-gold to-cosmic-saffron text-cosmic-950 shadow-lg shadow-cosmic-gold/20"
            >
              {tRun ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />} {tRun ? t('ms_pause') : t('ms_start')}
            </button>
            <button
              type="button"
              onClick={resetTimer}
              className="px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 bg-white/5 border border-white/15 text-slate-300 hover:border-cosmic-gold/40 transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" /> {t('ms_reset')}
            </button>
          </div>
          {tDone && (
            <div className="mt-4 text-center text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3 animate-cosmic-rise">{t('ms_timer_done')}</div>
          )}
        </section>

        <section className="bg-cosmic-900/60 border border-cosmic-gold/20 rounded-3xl p-5 sm:p-6 backdrop-blur-md shadow-xl animate-cosmic-rise" style={{ animationDelay: '240ms' }}>
          <SectionHead icon={<Trophy className="w-5 h-5" />} title={t('ms_stats_title')} />
          <div className="grid grid-cols-2 gap-3">
            <Tile icon={<Sparkles className="w-3.5 h-3.5" />} label={t('ms_sessions')} value={formatNumber(stats.sessions)} />
            <Tile icon={<Flame className="w-3.5 h-3.5" />} label={t('ms_total_min')} value={formatNumber(totalMin)} />
            <Tile icon={<Flame className="w-3.5 h-3.5" />} label={t('ms_streak')} value={formatNumber(streak)} />
            <Tile icon={<Timer className="w-3.5 h-3.5" />} label={t('ms_today_min')} value={formatNumber(todayMin)} />
          </div>
          <div className="mt-5">
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2">{t('ms_last7')}</div>
            <div className="flex items-end justify-between gap-2 h-24">
              {last7.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <span className="text-[9px] text-slate-400">{formatNumber(d.min)}</span>
                  <div
                    className={`w-full rounded-t-md transition-all duration-500 ${d.isToday ? 'bg-gradient-to-t from-cosmic-saffron to-cosmic-gold' : 'bg-gradient-to-t from-cosmic-700 to-cosmic-celestial/60'}`}
                    style={{ height: `${Math.max(4, (d.min / barMax) * 100)}%` }}
                  />
                  <span className={`text-[9px] ${d.isToday ? 'text-cosmic-gold font-bold' : 'text-slate-500'}`}>{formatNumber(d.label)}</span>
                </div>
              ))}
            </div>
            {stats.sessions === 0 && <p className="text-xs text-slate-500 text-center mt-3">{t('ms_no_sessions')}</p>}
          </div>
        </section>
      </div>

      {/* SOUND LAB */}
      <section className="bg-cosmic-900/60 border border-cosmic-gold/20 rounded-3xl p-5 sm:p-6 backdrop-blur-md shadow-xl animate-cosmic-rise" style={{ animationDelay: '300ms' }}>
        <SectionHead icon={<Headphones className="w-5 h-5" />} title={t('ms_sound_title')} sub={t('ms_sound_sub')} />

        {/* Master Audio Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-cosmic-950/60 border border-white/10 rounded-2xl p-3.5 shadow-inner">
          <div className="flex items-center gap-3 flex-1 min-w-[200px]">
            <Volume2 className="w-4 h-4 text-cosmic-gold shrink-0" />
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">{t('ms_volume')}</span>
            <input
              type="range"
              min={5}
              max={100}
              value={volume}
              onChange={e => changeVolume(Number(e.target.value))}
              className="flex-1 min-w-[120px] accent-amber-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
              aria-label={t('ms_volume')}
            />
            <span className="text-xs font-mono font-bold text-cosmic-gold w-9 text-right">{formatNumber(volume)}%</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
              <Headphones className="w-3.5 h-3.5 text-cosmic-celestial" />
              <span>{language === 'or' ? 'ହେଡ୍‌ଫୋନ୍ ଅନୁକୂଳ' : language === 'hi' ? 'हेडफ़ोन अनुशंसित' : 'Headphones Recommended'}</span>
            </span>
            <button
              type="button"
              onClick={stopEverything}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-rose-500/15 border border-rose-500/40 text-rose-300 hover:bg-rose-500/25 transition-all active:scale-95 shadow-sm"
            >
              <Square className="w-3.5 h-3.5" />
              <span>{t('ms_stop_all')}</span>
            </button>
          </div>
        </div>

        {/* Live Playing Studio HUD (Shows when any frequency is actively resonating) */}
        {activeTone && (
          <div className="mb-5 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-cosmic-gold/10 to-cosmic-celestial/15 border border-cosmic-gold/50 shadow-[0_0_30px_rgba(255,215,0,0.15)] flex flex-wrap items-center justify-between gap-3 animate-cosmic-rise">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cosmic-gold/20 border border-cosmic-gold/40 flex items-center justify-center text-cosmic-gold shadow-inner shrink-0">
                <Music className="w-5 h-5 animate-spin-slow" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-cosmic-gold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  <span>{language === 'or' ? 'ଲାଇଭ୍ ବାଜୁଛି (Now Resonating)' : language === 'hi' ? 'लाइव ध्वनि प्रवाह' : 'Now Resonating Live'}</span>
                </div>
                <div className="text-sm font-bold text-white flex items-center gap-2 mt-0.5">
                  <span>{SOUND_PROGRAMS.find(s => s.id === activeTone)?.name[language]}</span>
                  <span className="text-xs text-amber-300 font-mono">({SOUND_PROGRAMS.find(s => s.id === activeTone)?.carrierHz}Hz)</span>
                </div>
              </div>
            </div>

            {/* Animated Equalizer Waveform */}
            <div className="flex items-center gap-3">
              <div className="flex items-end gap-1 h-6 px-2.5 py-1 rounded-lg bg-black/40 border border-white/10">
                <span className="w-1 bg-amber-400 rounded-full animate-pulse h-3" />
                <span className="w-1 bg-amber-300 rounded-full animate-pulse h-6" style={{ animationDelay: '150ms' }} />
                <span className="w-1 bg-cosmic-saffron rounded-full animate-pulse h-4" style={{ animationDelay: '300ms' }} />
                <span className="w-1 bg-amber-200 rounded-full animate-pulse h-5" style={{ animationDelay: '450ms' }} />
                <span className="w-1 bg-emerald-400 rounded-full animate-pulse h-3" style={{ animationDelay: '200ms' }} />
              </div>
              <button
                type="button"
                onClick={() => {
                  audioSynth.stopTone();
                  setActiveTone(null);
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-500/20 border border-rose-500/50 text-rose-300 hover:bg-rose-500/30 transition-all active:scale-95"
              >
                {t('ms_stop')}
              </button>
            </div>
          </div>
        )}

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5 mb-5 bg-cosmic-950/70 p-1.5 rounded-2xl border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setSoundFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              soundFilter === 'all'
                ? 'bg-gradient-to-r from-cosmic-gold to-cosmic-saffron text-cosmic-950 shadow-md shadow-cosmic-gold/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            {language === 'or' ? `ସମସ୍ତ ତରଙ୍ଗ (${formatNumber(SOUND_PROGRAMS.length)})` :
             language === 'hi' ? `सभी तरंगें (${formatNumber(SOUND_PROGRAMS.length)})` :
             `All Frequencies (${formatNumber(SOUND_PROGRAMS.length)})`}
          </button>
          <button
            type="button"
            onClick={() => setSoundFilter('chakra')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              soundFilter === 'chakra'
                ? 'bg-gradient-to-r from-cosmic-gold to-cosmic-saffron text-cosmic-950 shadow-md shadow-cosmic-gold/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            {language === 'or' ? '🌈 ସପ୍ତ ଚକ୍ର ତରଙ୍ଗ (Chakras)' :
             language === 'hi' ? '🌈 सप्त चक्र तरंगें (Chakras)' :
             '🌈 7 Chakra Frequencies'}
          </button>
          <button
            type="button"
            onClick={() => setSoundFilter('cosmic')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              soundFilter === 'cosmic'
                ? 'bg-gradient-to-r from-cosmic-gold to-cosmic-saffron text-cosmic-950 shadow-md shadow-cosmic-gold/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            {language === 'or' ? '🕉️ ଓଁକାର ଓ ପୃଥିବୀ ନାଦ' :
             language === 'hi' ? '🕉️ ओंकार एवं पृथ्वी नाद' :
             '🕉️ Cosmic Om & Schumann'}
          </button>
          <button
            type="button"
            onClick={() => setSoundFilter('healing')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              soundFilter === 'healing'
                ? 'bg-gradient-to-r from-cosmic-gold to-cosmic-saffron text-cosmic-950 shadow-md shadow-cosmic-gold/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            {language === 'or' ? '🌿 ଗଭୀର ନିରାମୟ ଓ ବିଶ୍ରାମ' :
             language === 'hi' ? '🌿 गहन हीलिंग व विश्राम' :
             '🌿 Deep Rest & Healing'}
          </button>
        </div>

        {/* 12 Sacred Frequency Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {SOUND_PROGRAMS.filter(sp => {
            if (soundFilter === 'all') return true;
            const meta = SOUND_METADATA[sp.id];
            return meta?.category === soundFilter;
          }).map(sp => {
            const active = activeTone === sp.id;
            const meta = SOUND_METADATA[sp.id] || {
              category: 'chakra',
              chakra: { or: 'ଚକ୍ର ତରଙ୍ଗ', hi: 'चक्र तरंग', en: 'Chakra Wave' },
              color: '#FFD700',
              icon: '✦',
            };

            return (
              <div
                key={sp.id}
                className={`relative rounded-2xl border p-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${
                  active
                    ? 'border-amber-400 bg-gradient-to-b from-amber-500/15 via-cosmic-950/80 to-cosmic-950 shadow-[0_0_25px_rgba(255,215,0,0.2)] ring-1 ring-amber-400/50'
                    : 'border-white/10 bg-cosmic-950/50 hover:border-cosmic-gold/40 hover:bg-cosmic-950/70 hover:shadow-lg'
                }`}
              >
                {/* Chakra Glow Accent Line */}
                <div
                  className="absolute top-0 left-4 right-4 h-0.5 rounded-full opacity-60"
                  style={{ backgroundColor: meta.color }}
                />

                <div>
                  {/* Top Bar: Chakra Badge + Frequency Pill */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full border truncate"
                      style={{
                        backgroundColor: `${meta.color}15`,
                        color: meta.color,
                        borderColor: `${meta.color}40`,
                      }}
                    >
                      <span>{meta.icon}</span>
                      <span className="truncate">{meta.chakra[language]}</span>
                    </span>

                    <span
                      className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-slate-200 shrink-0"
                      data-freq={`${sp.carrierHz}Hz`}
                    >
                      {`${sp.carrierHz}Hz${sp.beatHz ? `+${sp.beatHz}` : ''}`}
                    </span>
                  </div>

                  {/* Program Title */}
                  <h4 className="text-sm sm:text-base font-bold text-slate-100 flex items-center justify-between gap-2">
                    <span className="truncate">{sp.name[language]}</span>
                    {active && (
                      <span className="flex items-end gap-0.5 h-3 shrink-0">
                        <span className="w-0.5 bg-emerald-400 rounded-full animate-pulse h-2" />
                        <span className="w-0.5 bg-emerald-300 rounded-full animate-pulse h-3" style={{ animationDelay: '100ms' }} />
                        <span className="w-0.5 bg-emerald-400 rounded-full animate-pulse h-1.5" style={{ animationDelay: '200ms' }} />
                      </span>
                    )}
                  </h4>

                  {/* Core Benefit / Purpose */}
                  <p className="text-xs text-slate-300 mt-1 leading-snug">
                    {sp.desc[language]}
                  </p>

                  {/* Source */}
                  <p className="text-[10px] text-slate-500 mt-1.5 flex items-center gap-1 italic">
                    <span>📜</span>
                    <span className="truncate">{sp.source}</span>
                  </p>
                </div>

                {/* Modern Play / Stop Button */}
                <button
                  type="button"
                  onClick={() => toggleTone(sp.id)}
                  className={`mt-4 w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm ${
                    active
                      ? 'bg-rose-500/25 border border-rose-500/60 text-rose-200 hover:bg-rose-500/35 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                      : 'bg-gradient-to-r from-cosmic-gold/20 via-cosmic-gold/15 to-cosmic-saffron/20 hover:from-cosmic-gold/30 hover:to-cosmic-saffron/35 border border-cosmic-gold/40 text-amber-100 hover:text-white hover:border-cosmic-gold'
                  }`}
                >
                  {active ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>{t('ms_stop')}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current text-cosmic-gold" />
                      <span>{t('ms_play')}</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Sacred Drone & Bell Shortcuts */}
        <div className="grid sm:grid-cols-2 gap-3 mt-5 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={() => setOmOn(audioSynth.toggleOmDrone(0.35))}
            className={`py-3 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2.5 border transition-all active:scale-95 shadow-md ${
              omOn
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-200 shadow-rose-500/10'
                : 'bg-cosmic-950/70 border-cosmic-gold/40 text-cosmic-gold hover:border-cosmic-gold hover:bg-cosmic-gold/10'
            }`}
          >
            {omOn ? <Square className="w-4 h-4" /> : <Music className="w-4 h-4 text-cosmic-saffron" />}
            <span>{omOn ? t('stop_om') : t('resonate_om')}</span>
          </button>
          <button
            type="button"
            onClick={() => audioSynth.playTempleChime(432)}
            className="py-3 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2.5 bg-cosmic-950/70 border border-cosmic-gold/40 text-cosmic-gold hover:border-cosmic-gold hover:bg-cosmic-gold/10 transition-all active:scale-95 shadow-md"
          >
            <Bell className="w-4 h-4 text-amber-300" />
            <span>{t('ring_bell')}</span>
          </button>
        </div>
      </section>
    </div>
  );
};







