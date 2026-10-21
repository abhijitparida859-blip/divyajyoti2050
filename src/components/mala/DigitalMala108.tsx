// ============================================================================
//  DIGITAL MALA 108 — ADVANCED JAPA SADHANA SUITE
// ============================================================================
//  • 23-mantra library (Beej / Suktam / Deity / Navagraha) with category tabs
//  • Audio-driven 108× engine (segment loop) → drives the mala automatically
//  • Manual tap + SpeechSynthesis (TTS) chant fallback when no audio file
//  • Smart "Aaj Ka Mantra" recommendations from REAL same-day panchanga:
//      Vara-lord + Chandra-nakshatra lord (Vimshottari) + running Hora-lord
//  • Lifetime totals persisted (divyajyoti_chants / divyajyoti_malas)
// ============================================================================

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useI18n } from '../../localization/i18n';
import { audioSynth } from '../../core/audio/meditation_synthesizer';
import confetti from 'canvas-confetti';
import {
  RotateCcw, Volume2, Play, Pause, Sparkles, ChevronRight,
  Flame, Clock, Info, Gauge, CircleDot, VolumeX,
  Scissors, Music, CheckCircle2,
} from 'lucide-react';
import { MANTRA_LIBRARY, MANTRA_CATEGORY_ORDER, getMantrasByCategory, getMantraById } from '../../core/japa/mantra_library';
import { CATEGORY_LABELS } from '../../core/japa/mantra_types';
import type { Mantra, MantraCategory, MantraAudio } from '../../core/japa/mantra_types';
import { JapaAudioEngine } from '../../core/japa/japa_audio_engine';
import { recommendMantrasForToday } from '../../core/japa/mantra_recommender';
import type { TodayAstroSignals } from '../../core/japa/mantra_recommender';
import { calculateNavagrahaSputa } from '../../core/panjika/odia_calendar_engine';
import { getCustomAudio, type CustomAudioLoaded } from '../../core/japa/custom_audio_storage';
import { MantraAudioCutterModal } from './MantraAudioCutterModal';

// --- lifetime counters (legacy keys kept — user history preserved) ---------
function readInt(key: string, fallback: number): number {
  try {
    if (typeof localStorage !== 'undefined') {
      const v = parseInt(localStorage.getItem(key) || '', 10);
      if (!Number.isNaN(v)) return v;
    }
  } catch { /* ignore */ }
  return fallback;
}

const KIND_STYLE: Record<string, string> = {
  nakshatra: 'border-violet-400/50 bg-violet-950/30',
  vara: 'border-amber-400/50 bg-amber-950/30',
  hora: 'border-cyan-400/50 bg-cyan-950/30',
};
const KIND_EMOJI: Record<string, string> = { nakshatra: '🌙', vara: '☀️', hora: '⏳' };

export const DigitalMala108: React.FC<{ initialMantraId?: string }> = ({ initialMantraId }) => {
  const { t, language, formatNumber } = useI18n();

  // --- selection ------------------------------------------------------------
  const [activeCategory, setActiveCategory] = useState<MantraCategory>('suktam');
  const [selectedMantraId, setSelectedMantraId] = useState<string>(initialMantraId || 'suktam-mrityunjaya');
  const [detailOpen, setDetailOpen] = useState<boolean>(false);

  // --- counting -------------------------------------------------------------
  const [beadCount, setBeadCount] = useState<number>(0);
  const [completedMalas, setCompletedMalas] = useState<number>(() => readInt('divyajyoti_malas', 2));
  const [totalLifetimeChants, setTotalLifetimeChants] = useState<number>(() => readInt('divyajyoti_chants', 216));
  const [japaTarget, setJapaTarget] = useState<number>(108);
  const [celebrated, setCelebrated] = useState<boolean>(false);

  // --- audio engine ----------------------------------------------------------
  const [isEnginePlaying, setIsEnginePlaying] = useState<boolean>(false);
  const [isTtsPlaying, setIsTtsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const engineRef = useRef<JapaAudioEngine | null>(null);
  const totalRef = useRef<number>(0);
  const malasRef = useRef<number>(0);
  // live mirrors for the TTS loop + cleanup (StrictMode-safe, no stale closure)
  const beadRef = useRef<number>(0);
  const celebratedRef = useRef<boolean>(false);
  const ttsCancelRef = useRef<boolean>(false);
  useEffect(() => { beadRef.current = beadCount; }, [beadCount]);
  useEffect(() => { celebratedRef.current = celebrated; }, [celebrated]);
  useEffect(() => { totalRef.current = totalLifetimeChants; }, [totalLifetimeChants]);
  useEffect(() => { malasRef.current = completedMalas; }, [completedMalas]);

  const [customAudio, setCustomAudio] = useState<CustomAudioLoaded | null>(null);
  const [cutterOpen, setCutterOpen] = useState<boolean>(false);

  // Load custom audio whenever the selected mantra changes
  useEffect(() => {
    let active = true;
    if (typeof window !== 'undefined') {
      getCustomAudio(selectedMantraId)
        .then(res => {
          if (active) setCustomAudio(res);
        })
        .catch(() => {
          if (active) setCustomAudio(null);
        });
    }
    return () => { active = false; };
  }, [selectedMantraId]);

  const activeMantra: Mantra = useMemo(
    () => getMantraById(selectedMantraId) || MANTRA_LIBRARY[0],
    [selectedMantraId],
  );
  const categoryMantras = useMemo(
    () => getMantrasByCategory(activeCategory),
    [activeCategory],
  );

  const effectiveAudio: MantraAudio | undefined = useMemo(() => {
    if (customAudio) {
      return {
        url: customAudio.url,
        start: customAudio.start,
        end: customAudio.end,
        credit: customAudio.fileName,
      };
    }
    return activeMantra.audio;
  }, [customAudio, activeMantra.audio]);

  const hasEngineAudio = !!effectiveAudio?.url;

  // --- today's REAL astro signals → smart recommendations --------------------
  const todaySignals: TodayAstroSignals = useMemo(() => {
    const now = new Date();
    let moonNakIdx = 0;
    let moonNak = { or: 'ଅଶ୍ୱିନୀ', hi: 'अश्विनी', en: 'Ashwini' };
    try {
      const sputa = calculateNavagrahaSputa(now);
      const moon = sputa.grahas.find(g => g.id === 'moon');
      if (moon) {
        moonNakIdx = moon.nakshatraIndex;
        moonNak = { or: moon.nakshatraOr, hi: moon.nakshatraHi, en: moon.nakshatraEn };
      }
    } catch { /* fall back to defaults */ }
    return {
      weekdayIdx: now.getDay(),
      moonNakshatraIndex: moonNakIdx,
      moonNakshatraName: moonNak,
      horaPlanetKey: undefined,
      horaPlanetName: { or: '', hi: '', en: '' },
    };
  }, []);

  const recommendations = useMemo(
    () => recommendMantrasForToday(todaySignals),
    [todaySignals],
  );

  // --- helpers ---------------------------------------------------------------
  const persistTotals = useCallback((chants: number, malas: number) => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('divyajyoti_chants', chants.toString());
        localStorage.setItem('divyajyoti_malas', malas.toString());
      }
    } catch { /* ignore */ }
  }, []);

  const celebrateComplete = useCallback(() => {
    audioSynth.playTempleChime(432);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
    confetti({
      particleCount: 108,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FF6F00', '#38BDF8', '#10B981'],
    });
  }, []);

  const bumpCount = useCallback((next: number) => {
    // StrictMode-safe: pure ref math, no setState-inside-setState.
    const t = totalRef.current + 1;
    totalRef.current = t;
    setTotalLifetimeChants(t);
    let m = malasRef.current;
    if (next >= japaTarget && japaTarget === 108) {
      m += 1;
      malasRef.current = m;
      setCompletedMalas(m);
    }
    persistTotals(t, m);
    setBeadCount(next);
    if (next >= japaTarget && !celebratedRef.current) {
      setCelebrated(true);
      celebrateComplete();
    }
  }, [celebrateComplete, japaTarget, persistTotals]);

  const handleBeadClick = useCallback(() => {
    audioSynth.playBeadClick();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(25);
    }
    if (beadCount + 1 >= japaTarget) {
      bumpCount(japaTarget);
    } else {
      bumpCount(beadCount + 1);
    }
  }, [beadCount, bumpCount, japaTarget]);

  // --- audio engine control --------------------------------------------------
  // stopAllAudio is a stable function declaration (hoisted) used by handlers above
  function stopAllAudio() {
    ttsCancelRef.current = true;
    try { engineRef.current?.stop(true); } catch { /* ignore */ }
    engineRef.current = null;
    setIsEnginePlaying(false);
    try { window.speechSynthesis?.cancel(); } catch { /* ignore */ }
    setIsTtsPlaying(false);
  }

  const handleReset = () => {
    stopAllAudio();
    setBeadCount(0);
    setCelebrated(false);
  };

  const selectMantra = (id: string) => {
    const m = getMantraById(id);
    if (!m) return;
    stopAllAudio();
    setSelectedMantraId(id);
    setActiveCategory(m.category);
    setBeadCount(0);
    setCelebrated(false);
  };

  const stopTts = useCallback(() => {
    ttsCancelRef.current = true;
    try { window.speechSynthesis?.cancel(); } catch { /* ignore */ }
    setIsTtsPlaying(false);
  }, []);

  /** TTS chant loop: speaks one recitation, waits, advances the mala, repeats. */
  const startTtsLoop = useCallback(() => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    ttsCancelRef.current = false;

    const speakOnce = () => {
      if (ttsCancelRef.current) return;
      if (beadRef.current >= japaTarget) {
        stopTts();
        if (!celebratedRef.current) {
          setCelebrated(true);
          celebrateComplete();
        }
        return;
      }
      const text = `${activeMantra.text.original}. `;
      const u = new SpeechSynthesisUtterance(text);
      u.rate = Math.max(0.6, Math.min(1.4, speed));
      try {
        const voices = synth.getVoices();
        const v = voices.find(vv => /hi|sa|mr|ne|bn/i.test(vv.lang)) || voices[0];
        if (v) u.voice = v;
      } catch { /* ignore */ }
      u.onend = () => {
        if (ttsCancelRef.current) return;
        bumpCount(Math.min(beadRef.current + 1, japaTarget));
        window.setTimeout(() => {
          if (!ttsCancelRef.current) speakOnce();
        }, 350);
      };
      u.onerror = () => { stopTts(); };
      try { synth.speak(u); } catch { stopTts(); }
    };

    setIsTtsPlaying(true);
    speakOnce();
  }, [activeMantra, bumpCount, celebrateComplete, japaTarget, speed, stopTts]);

  const stopEngineOnly = useCallback(() => {
    try { engineRef.current?.stop(); } catch { /* ignore */ }
    engineRef.current = null;
    setIsEnginePlaying(false);
  }, []);

  /** Master play/pause: engine audio if a file exists, else TTS chant loop. */
  const togglePlay = useCallback(async () => {
    if (isEnginePlaying) {
      stopEngineOnly();
      return;
    }
    if (isTtsPlaying) {
      ttsCancelRef.current = true;
      stopTts();
      return;
    }
    if (hasEngineAudio && effectiveAudio) {
      const engine = new JapaAudioEngine({
        onCycle: (count) => bumpCount(Math.min(count, japaTarget)),
        onComplete: () => { setIsEnginePlaying(false); },
        onStop: () => { setIsEnginePlaying(false); },
      });
      engineRef.current = engine;
      engine.setSpeed(speed);
      const ok = await engine.start(activeMantra, beadCount, effectiveAudio, japaTarget);
      setIsEnginePlaying(ok);
      if (!ok) startTtsLoop();
    } else {
      startTtsLoop();
    }
  }, [isEnginePlaying, isTtsPlaying, hasEngineAudio, effectiveAudio, speed, activeMantra, beadCount, bumpCount, japaTarget, startTtsLoop, stopEngineOnly, stopTts]);

  // stop audio + TTS when leaving the page / unmounting
  useEffect(() => {
    return () => {
      try { engineRef.current?.stop(true); } catch { /* ignore */ }
      try { window.speechSynthesis?.cancel(); } catch { /* ignore */ }
    };
  }, []);

  // apply speed live
  useEffect(() => {
    try { engineRef.current?.setSpeed(speed); } catch { /* ignore */ }
  }, [speed]);

  // --- render helpers ----------------------------------------------------------
  const lang3 = language as 'or' | 'hi' | 'en';
  const mName = activeMantra.name[lang3] ?? activeMantra.name.en;
  const mBenefit = activeMantra.benefit[lang3] ?? activeMantra.benefit.en;
  const mBestTime = activeMantra.bestTime?.[lang3];
  const mDevata = activeMantra.devata?.[lang3];
  const mMeaning = language === 'or' ? activeMantra.text.meaningOr
    : language === 'hi' ? activeMantra.text.meaningHi : activeMantra.text.meaningEn;

  const tr = (or: string, hi: string, en: string) =>
    language === 'or' ? or : language === 'hi' ? hi : en;

  const isPlaying = isEnginePlaying || isTtsPlaying;


  return (
    <div className="space-y-5 max-w-4xl mx-auto pb-12">
      {/* Header & Stats */}
      <div className="bg-cosmic-900/80 border border-cosmic-gold/30 rounded-2xl p-5 shadow-2xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cosmic-gold text-xs font-semibold uppercase mb-1">
            <CircleDot className="w-4 h-4 text-cosmic-saffron" />
            <span>{t('mala_counter')}</span>
          </div>
          <h2 className="text-2xl font-bold font-serif text-slate-100">
            {t('mala_hero_title')}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t('mala_hero_sub')}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-center bg-cosmic-950/80 border border-slate-800 px-4 py-2 rounded-xl">
            <div className="text-[10px] text-slate-400 uppercase font-bold">{t('rounds_completed')}</div>
            <div className="text-xl font-bold text-cosmic-gold">{formatNumber(completedMalas)}</div>
          </div>
          <div className="text-center bg-cosmic-950/80 border border-slate-800 px-4 py-2 rounded-xl">
            <div className="text-[10px] text-slate-400 uppercase font-bold">{t('total_chants')}</div>
            <div className="text-xl font-bold text-emerald-400">{formatNumber(totalLifetimeChants)}</div>
          </div>
          <div className="text-center bg-cosmic-950/80 border border-emerald-500/40 px-4 py-2 rounded-xl">
            <div className="text-[10px] text-slate-400 uppercase font-bold">{language === 'or' ? 'ଆଜିର ଜପ' : language === 'hi' ? 'आज का जप' : "Today's Japa"}</div>
            <div className="text-xl font-bold text-emerald-300">{formatNumber(beadCount)}<span className="text-xs text-slate-400">/{formatNumber(japaTarget)}</span></div>
          </div>
        </div>
      </div>

      {/* Smart Recommendation — Aaj Ka Mantra (REAL panchanga) */}
      <div className="rounded-2xl border border-violet-400/40 bg-gradient-to-br from-violet-950/50 via-cosmic-950 to-cosmic-900/60 p-3.5 space-y-2.5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-300" />
          <span className="text-sm font-black text-violet-200">{language === 'or' ? 'ଆଜିର ମନ୍ତ୍ର (ପଞ୍ଚାଙ୍ଗ ଅନୁସାରେ)' : language === 'hi' ? 'आज का मंत्र (पंचांग अनुसार)' : "Today's Mantras (per Panchanga)"}</span>
        </div>
        <div className="text-[11px] text-slate-400">{language === 'or' ? `ଚନ୍ଦ୍ର ${todaySignals.moonNakshatraName.or} ନକ୍ଷତ୍ରରେ` : language === 'hi' ? `चंद्र ${todaySignals.moonNakshatraName.hi} नक्षत्र में` : `Moon in ${todaySignals.moonNakshatraName.en}`}</div>
        <div className="space-y-2">
          {recommendations.map(rec => {
            const rName = rec.mantra.name[lang3] ?? rec.mantra.name.en;
            const rReason = rec.reason[lang3] ?? rec.reason.en;
            const isSel = rec.mantra.id === selectedMantraId;
            return (
              <button key={rec.mantra.id} type="button" onClick={() => selectMantra(rec.mantra.id)} className={`w-full text-left p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer ${KIND_STYLE[rec.kind]} ${isSel ? 'ring-2 ring-amber-300/70' : ''}`}>
                <span className="text-xl shrink-0">{KIND_EMOJI[rec.kind]}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-bold text-slate-100 truncate">{rName}</span>
                  <span className="block text-[10px] text-slate-300/90 leading-snug">{rReason}</span>
                </span>
                {isSel ? <span className="text-[10px] font-bold text-amber-300">✓</span> : <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mantra Library — Category Tabs */}
      <div className="space-y-2">
        <div className="flex gap-1.5 overflow-x-auto mobile-touch-scroll no-scrollbar pb-1">
          {MANTRA_CATEGORY_ORDER.map(cat => {
            const lbl = CATEGORY_LABELS[cat][lang3] ?? CATEGORY_LABELS[cat].en;
            const cnt = getMantrasByCategory(cat).length;
            const on = activeCategory === cat;
            return (
              <button key={cat} type="button" onClick={() => setActiveCategory(cat)} className={`shrink-0 px-3.5 py-2 rounded-full text-[11px] font-bold border cursor-pointer whitespace-nowrap ${on ? 'bg-gradient-to-r from-amber-500/40 to-orange-500/30 border-amber-300 text-amber-100' : 'bg-cosmic-900/60 border-slate-800 text-slate-400'}`}>
                {CATEGORY_LABELS[cat].emoji} {lbl} <span className="opacity-70">({formatNumber(cnt)})</span>
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {categoryMantras.map(m => {
            const nm = m.name[lang3] ?? m.name.en;
            const on = m.id === selectedMantraId;
            return (
              <button key={m.id} type="button" onClick={() => selectMantra(m.id)} className={`text-left p-2.5 rounded-xl border cursor-pointer ${on ? 'bg-gradient-to-br from-amber-500/25 to-amber-700/15 border-amber-300 text-amber-100' : 'bg-cosmic-950/60 border-slate-800 text-slate-300'}`}>
                <span className="block text-xs font-bold truncate">{nm}</span>
                <span className="block text-[10px] text-slate-400 truncate mt-0.5">{m.text.translit}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sacred Mantra Display Box */}
      <div className="bg-cosmic-900/50 border border-cosmic-gold/20 rounded-2xl p-5 text-center backdrop-blur-md space-y-2">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs font-black uppercase tracking-widest text-amber-300">{mName}</span>
          <button type="button" onClick={() => setDetailOpen(v => !v)} className="p-1 rounded-lg border border-slate-700 text-slate-400 hover:text-amber-200 cursor-pointer" aria-label="details">
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-base sm:text-lg font-serif text-cosmic-gold font-medium leading-relaxed">
          {activeMantra.text.original}
        </p>
        <p className="text-[11px] text-slate-400 italic">{activeMantra.text.translit}</p>
        <p className="text-xs text-slate-400 italic max-w-xl mx-auto">
          &ldquo;{mMeaning}&rdquo;
        </p>
        {detailOpen && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-left">
            {mDevata && (
              <div className="p-2 rounded-xl bg-cosmic-950/70 border border-slate-800">
                <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">{language === 'or' ? 'ଦେବତା' : language === 'hi' ? 'देवता' : 'Deity'}</div>
                <div className="text-[11px] text-amber-200 font-semibold">{mDevata}</div>
              </div>
            )}
            {mBestTime && (
              <div className="p-2 rounded-xl bg-cosmic-950/70 border border-slate-800">
                <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1"><Clock className="w-3 h-3" />{language === 'or' ? 'ଉତ୍ତମ ସମୟ' : language === 'hi' ? 'उत्तम समय' : 'Best time'}</div>
                <div className="text-[11px] text-cyan-200 font-semibold">{mBestTime}</div>
              </div>
            )}
            <div className="p-2 rounded-xl bg-cosmic-950/70 border border-slate-800">
              <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1"><Flame className="w-3 h-3" />{language === 'or' ? 'ଫଳ' : language === 'hi' ? 'फल' : 'Benefit'}</div>
              <div className="text-[11px] text-emerald-200 font-semibold">{mBenefit}</div>
            </div>
          </div>
        )}
      </div>

      {/* Giant Interactive 108 Bead Ring / Button */}
      <div className="flex flex-col items-center justify-center py-6">
        <div className="relative group">
          <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-cosmic-saffron/30 via-cosmic-gold/20 to-cosmic-amethyst/30 blur-2xl group-hover:blur-3xl transition-all" />

          <button
            onClick={handleBeadClick}
            className="relative w-60 h-60 sm:w-72 sm:h-72 rounded-full bg-gradient-to-b from-cosmic-900 via-cosmic-950 to-cosmic-900 border-4 border-cosmic-gold/60 p-6 flex flex-col items-center justify-center shadow-2xl active:scale-95 transition-transform cursor-pointer hover:border-cosmic-gold touch-manipulation select-none"
          >
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
                stroke="#1e293b"
                strokeWidth="3"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
                stroke="#FFD700"
                strokeWidth="4"
                strokeDasharray="282.7"
                strokeDashoffset={282.7 - (282.7 * beadCount) / 108}
                strokeLinecap="round"
                className="transition-all duration-150"
              />
            </svg>

            <div className="text-3xl mb-1 filter drop-shadow-lg">📿</div>
            <div className="text-5xl font-extrabold font-serif bg-gradient-to-r from-cosmic-gold to-yellow-100 bg-clip-text text-transparent">
              {formatNumber(beadCount)}
            </div>
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">
              / {formatNumber(108)} {t('beads_count_label')}
            </div>
            <div className="text-[10px] text-cosmic-saffron mt-2 font-semibold">
              {(isEnginePlaying || isTtsPlaying)
                ? (language === 'or' ? '⏸ ବିରାମ ପାଇଁ ଦବାନ୍ତୁ' : language === 'hi' ? '⏸ रोकने हेतु दबाएँ' : '⏸ Tap to pause')
                : t('tap_to_count')}
            </div>
          </button>
        </div>

        {/* Playback Controls — auto 108× (audio file / TTS) */}
        <div className="flex flex-col items-center gap-2.5 mt-4">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <button type="button" onClick={togglePlay} className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black transition-all cursor-pointer ${(isEnginePlaying || isTtsPlaying) ? 'bg-gradient-to-r from-rose-500/40 to-orange-500/30 border border-rose-300 text-rose-100' : 'bg-gradient-to-r from-emerald-500/40 to-teal-500/30 border border-emerald-300 text-emerald-100 shadow-lg shadow-emerald-500/25'}`}>
              {(isEnginePlaying || isTtsPlaying) ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{(isEnginePlaying || isTtsPlaying) ? (language === 'or' ? 'ବିରାମ' : language === 'hi' ? 'विराम' : 'Pause') : (language === 'or' ? '▶ ସ୍ୱୟଂ ଜପ ଆରମ୍ଭ' : language === 'hi' ? '▶ स्वतः जप आरंभ' : '▶ Start Auto Japa')}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                stopAllAudio();
                setCutterOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/40 hover:border-amber-300 text-amber-200 hover:text-amber-100 shadow-lg shadow-amber-500/10"
              title="Upload MP3 & Cut 108 Loop"
            >
              <Scissors className="w-4 h-4 text-amber-400" />
              <span>
                {customAudio
                  ? (language === 'or' ? '✂️ କଷ୍ଟମ୍ ଅଡିଓ ସଂଶୋଧନ' : language === 'hi' ? '✂️ कस्टम ऑडियो कटर' : '✂️ Edit Custom Audio')
                  : (language === 'or' ? '🎵 ଅଡିଓ ଯୋଡ଼ନ୍ତୁ (MP3/Cutter)' : language === 'hi' ? '🎵 ऑडियो जोड़ें (MP3/Cutter)' : '🎵 Add Audio (MP3/Cutter)')}
              </span>
            </button>
          </div>

          {customAudio ? (
            <div className="text-[10px] text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>
                {language === 'or'
                  ? `କଷ୍ଟମ୍ ଅଡିଓ ଲୁପ୍ ସକ୍ରିୟ: ${customAudio.fileName} (${(customAudio.end - customAudio.start).toFixed(1)}s)`
                  : language === 'hi'
                  ? `कस्टम ऑडियो लूप सक्रिय: ${customAudio.fileName} (${(customAudio.end - customAudio.start).toFixed(1)}s)`
                  : `Custom Audio Loop: ${customAudio.fileName} (${(customAudio.end - customAudio.start).toFixed(1)}s)`}
              </span>
            </div>
          ) : activeMantra.audio?.url ? (
            <div className="text-[10px] text-amber-300 bg-amber-950/60 border border-amber-400/30 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
              <Music className="w-3 h-3 text-amber-400 shrink-0" />
              <span>
                {language === 'or'
                  ? `ମନ୍ତ୍ର ଧ୍ୱନି ଫାଇଲ୍ ସକ୍ରିୟ (${activeMantra.audio.credit || '432Hz Om'})`
                  : language === 'hi'
                  ? `मंत्र ध्वनि फ़ाइल सक्रिय (${activeMantra.audio.credit || '432Hz Om'})`
                  : `Mantra Audio Active (${activeMantra.audio.credit || '432Hz Om'})`}
              </span>
            </div>
          ) : (
            <div className="text-[10px] text-slate-500 flex items-center gap-1">
              <VolumeX className="w-3 h-3" />
              {language === 'or' ? 'ଅଡ଼ିଓ ଫାଇଲ୍ ନାହିଁ — ଭଏସ୍ ମୋଡ୍‌ରେ ଜପ ଶୁଣାଯିବ' : language === 'hi' ? 'ऑडियो फ़ाइल नहीं — वॉइस मोड में जप सुनाई देगा' : 'No audio file — chanting plays in voice mode'}
            </div>
          )}

          <div className="flex items-center gap-3 flex-wrap justify-center">
            <label className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <Gauge className="w-3.5 h-3.5" />
              <input type="range" min={0.6} max={1.4} step={0.1} value={speed} onChange={e => setSpeed(parseFloat(e.target.value))} className="w-24 accent-amber-400" />
              <span className="font-bold text-amber-200">{speed.toFixed(1)}×</span>
            </label>
            <label className="flex items-center gap-1.5 text-[11px] text-slate-400">
              {language === 'or' ? 'ଲକ୍ଷ୍ୟ' : language === 'hi' ? 'लक्ष्य' : 'Target'}
              <select value={japaTarget} onChange={e => { stopAllAudio(); setJapaTarget(parseInt(e.target.value, 10)); setBeadCount(0); setCelebrated(false); }} className="bg-cosmic-950 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-amber-200 font-bold cursor-pointer">
                {[27, 54, 108].map(n => <option key={n} value={n}>{formatNumber(n)}</option>)}
              </select>
            </label>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cosmic-900/80 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('reset_mala')}</span>
          </button>
          <button
            onClick={() => audioSynth.playTempleChime(432)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cosmic-900/80 border border-cosmic-gold/30 text-xs text-cosmic-gold hover:border-cosmic-gold transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{t('chime_sound')}</span>
          </button>
        </div>
      </div>

      {/* Audio Cutter & Looper Modal */}
      <MantraAudioCutterModal
        isOpen={cutterOpen}
        onClose={() => setCutterOpen(false)}
        mantra={activeMantra}
        currentCustomAudio={customAudio}
        onAudioSaved={(saved) => {
          setCustomAudio(saved);
        }}
        onAudioDeleted={() => {
          setCustomAudio(null);
        }}
      />
    </div>
  );
};