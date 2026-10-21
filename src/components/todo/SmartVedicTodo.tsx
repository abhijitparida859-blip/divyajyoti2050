import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '../../localization/i18n';
import type { MuhurtaKey, PriorityLevel, TaskFrequency, VedicTask } from '../../types/todo';
import { KarmaChakra3D } from './KarmaChakra3D';
import { VedicWatch3D } from './VedicWatch3D';
import { VedicTimePickerModal } from './VedicTimePickerModal';
import { VedicDatePickerModal } from './VedicDatePickerModal';
import {
  dayKey,
  computeStreak,
  getTodayWindows,
  nextAuspicious,
  nowStatus,
  sortTasks,
  suggestMuhurtaKey,
  timeStrToMinutes,
  isTaskScheduledForDate,
  isTaskAlarmDue,
  WEEKDAY_METADATA,
  SADHANA_PRESETS,
  type DayWindows,
  type NowStatus,
  type SadhanaPreset,
} from '../../core/todo/todoPlanner';
import {
  BUILTIN_RINGTONES,
  vedicAlarmAudio,
} from '../../core/todo/vedicAlarmAudio';
import {
  CheckSquare, Plus, Clock, Trash2, CheckCircle2, Circle, Flame, Trophy, Sunrise, Sunset,
  Sparkles, Bell, BellOff, CalendarDays, Tag, ChevronDown, RotateCcw, Filter, Timer, Play, Pause,
  Volume2, VolumeX, Upload, Calendar as CalendarIcon, Sun, Moon, AlertTriangle, ShieldCheck, Check,
} from 'lucide-react';

const STORAGE_KEY = 'divyajyoti_vedic_tasks';
const CUSTOM_AUDIO_KEY = 'divyajyoti_custom_ringtones';

type EnergyFilter = 'All' | VedicTask['energyAlignment'];
type StatusFilter = 'open' | 'done' | 'all';
type CalendarFilter = 'today' | 'tomorrow' | 'this_week' | 'all' | 'custom_date';

function todayStr(d: Date = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function loadTasks(): VedicTask[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as unknown;
      if (Array.isArray(parsed) && parsed.length > 0) {
        return (parsed as VedicTask[]).map(t => ({
          id: String(t.id ?? Date.now()),
          title: String(t.title ?? ''),
          completed: !!t.completed,
          priority: (['high', 'medium', 'low'] as PriorityLevel[]).includes(t.priority) ? t.priority : 'medium',
          energyAlignment: (['Sattva', 'Rajas', 'Tamas'] as Array<VedicTask['energyAlignment']>).includes(t.energyAlignment) ? t.energyAlignment : 'Sattva',
          tags: Array.isArray(t.tags) ? t.tags.map(String) : [],
          createdAt: typeof t.createdAt === 'string' ? t.createdAt : todayStr(),
          description: typeof t.description === 'string' ? t.description : undefined,
          completedAt: typeof t.completedAt === 'string' ? t.completedAt : undefined,
          dueDate: typeof t.dueDate === 'string' ? t.dueDate : undefined,
          dueTime: typeof t.dueTime === 'string' ? t.dueTime : undefined,
          muhurtaKey: (['brahma', 'abhijit', 'any'] as string[]).includes(t.muhurtaKey ?? '') ? (t.muhurtaKey as MuhurtaKey) : undefined,
          auspiciousMuhurtaSuggested: typeof t.auspiciousMuhurtaSuggested === 'string' ? t.auspiciousMuhurtaSuggested : undefined,
          frequency: (['daily', 'weekly', 'specific_date', 'muhurta_sync'] as TaskFrequency[]).includes(t.frequency as TaskFrequency) ? t.frequency : 'daily',
          weekdays: Array.isArray(t.weekdays) ? t.weekdays.filter((w): w is number => typeof w === 'number') : undefined,
          alarmEnabled: t.alarmEnabled !== undefined ? !!t.alarmEnabled : true,
          ringtoneId: typeof t.ringtoneId === 'string' ? t.ringtoneId : 'bell',
          customAudioName: typeof t.customAudioName === 'string' ? t.customAudioName : undefined,
          customAudioData: typeof t.customAudioData === 'string' ? t.customAudioData : undefined,
          snoozeUntil: typeof t.snoozeUntil === 'number' ? t.snoozeUntil : undefined,
        }));
      }
    }
  } catch { /* fallback */ }

  const t = todayStr();
  return [
    {
      id: '1',
      title: 'Surya Namaskar & Gayatri Japa',
      completed: true,
      completedAt: t,
      priority: 'high',
      energyAlignment: 'Sattva',
      muhurtaKey: 'brahma',
      auspiciousMuhurtaSuggested: 'Brahma Muhurta',
      frequency: 'daily',
      dueTime: '06:00 AM',
      alarmEnabled: true,
      ringtoneId: 'bell',
      tags: ['Sadhana', 'Surya', 'Daily'],
      createdAt: t,
    },
    {
      id: '2',
      title: 'Review Project Contract & Planning',
      completed: false,
      priority: 'high',
      energyAlignment: 'Rajas',
      muhurtaKey: 'abhijit',
      auspiciousMuhurtaSuggested: 'Abhijit Muhurta',
      frequency: 'daily',
      dueTime: '11:45 AM',
      alarmEnabled: true,
      ringtoneId: 'chime',
      tags: ['Satkarma', 'Abhijit'],
      createdAt: t,
    },
    {
      id: '3',
      title: 'Evening Dhyana & Sandhya Vandanam',
      completed: false,
      priority: 'medium',
      energyAlignment: 'Sattva',
      muhurtaKey: 'any',
      frequency: 'daily',
      dueTime: '06:30 PM',
      alarmEnabled: true,
      ringtoneId: 'om',
      tags: ['Sandhya', 'Meditation'],
      createdAt: t,
    },
    {
      id: '4',
      title: 'Monday Shiva Linga Abhisheka',
      completed: false,
      priority: 'high',
      energyAlignment: 'Sattva',
      muhurtaKey: 'any',
      frequency: 'weekly',
      weekdays: [1], // Monday
      dueTime: '07:30 AM',
      alarmEnabled: true,
      ringtoneId: 'damaru',
      tags: ['Shiva', 'Somavara'],
      createdAt: t,
    },
    {
      id: '5',
      title: 'Thursday Mahalakshmi Purana & Deepa',
      completed: false,
      priority: 'high',
      energyAlignment: 'Sattva',
      muhurtaKey: 'any',
      frequency: 'weekly',
      weekdays: [4], // Thursday
      dueTime: '06:00 PM',
      alarmEnabled: true,
      ringtoneId: 'chime',
      tags: ['Lakshmi', 'Guruvara'],
      createdAt: t,
    },
  ];
}

function useLocalizers() {
  const { formatNumber, formatTime } = useI18n();
  const fmtT = (s?: string) => (s ? formatTime(s) : '');
  const fmtN = (n: number | string) => formatNumber(n);
  return { fmtT, fmtN };
}

export const SmartVedicTodo: React.FC = () => {
  const { t, language, formatNumber } = useI18n();
  const { fmtT, fmtN } = useLocalizers();

  const [tasks, setTasks] = useState<VedicTask[]>(loadTasks);
  const [now, setNow] = useState(() => new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date>(() => new Date());
  const [calendarFilter, setCalendarFilter] = useState<CalendarFilter>('all'); // default to 'all' so tasks are never hidden!
  const [justAddedToast, setJustAddedToast] = useState<string | null>(null);

  // Time & Date picker modals
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Live 1-second clock
  useEffect(() => {
    const iv = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(iv);
  }, []);

  // ── Astronomical Day Windows ──
  const winKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
  const windows: DayWindows = useMemo(() => getTodayWindows(now), [winKey]);
  const status: NowStatus = useMemo(() => nowStatus(windows, now), [windows, now]);
  const upcoming = useMemo(() => nextAuspicious(windows, now), [windows, now]);

  // Persist tasks
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); } catch { /* ignore */ }
  }, [tasks]);

  // ── Alarm Engine ──
  const [activeAlarmTask, setActiveAlarmTask] = useState<VedicTask | null>(null);
  const triggeredAlarmsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const currentMinKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}_${now.getHours()}:${now.getMinutes()}`;
    for (const task of tasks) {
      const taskAlarmKey = `${task.id}_${currentMinKey}`;
      if (isTaskAlarmDue(task, now) && !triggeredAlarmsRef.current.has(taskAlarmKey)) {
        triggeredAlarmsRef.current.add(taskAlarmKey);
        setActiveAlarmTask(task);
        vedicAlarmAudio.startAlarmLoop(task.ringtoneId || 'bell', task.customAudioData);
        break;
      }
    }
  }, [now, tasks]);

  const dismissAlarm = () => {
    vedicAlarmAudio.stop();
    setActiveAlarmTask(null);
  };

  const snoozeAlarm = (minutes = 5) => {
    if (!activeAlarmTask) return;
    const snoozeUntil = Date.now() + minutes * 60 * 1000;
    setTasks(prev => prev.map(t => t.id === activeAlarmTask.id ? { ...t, snoozeUntil } : t));
    vedicAlarmAudio.stop();
    setActiveAlarmTask(null);
  };

  const completeAlarmTask = () => {
    if (!activeAlarmTask) return;
    setTasks(prev => prev.map(t => t.id === activeAlarmTask.id ? { ...t, completed: true, completedAt: todayStr() } : t));
    vedicAlarmAudio.stop();
    setActiveAlarmTask(null);
  };

  // ── Custom Ringtone Audio Upload ──
  const [customAudio, setCustomAudio] = useState<{ name: string; dataUri: string } | null>(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_AUDIO_KEY);
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return null;
  });

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUri = event.target?.result as string;
      if (dataUri) {
        const item = { name: file.name, dataUri };
        setCustomAudio(item);
        try { localStorage.setItem(CUSTOM_AUDIO_KEY, JSON.stringify(item)); } catch { /* ignore */ }
        setRingtoneSel('custom');
        vedicAlarmAudio.playRingtoneOnce('custom', dataUri);
      }
    };
    reader.readAsDataURL(file);
  };

  // ── Form State ──
  const [newTitle, setNewTitle] = useState('');
  const [energy, setEnergy] = useState<VedicTask['energyAlignment']>('Sattva');
  const [prioritySel, setPrioritySel] = useState<PriorityLevel>('medium');
  const [frequencySel, setFrequencySel] = useState<TaskFrequency>('daily');
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([1, 2, 3, 4, 5, 6]); // default Mon-Sat
  const [muhurtaSel, setMuhurtaSel] = useState<MuhurtaKey>('any');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('06:00 AM');
  const [alarmEnabledSel, setAlarmEnabledSel] = useState(true);
  const [ringtoneSel, setRingtoneSel] = useState('bell');
  const [tagInput, setTagInput] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [previewingRingtone, setPreviewingRingtone] = useState<string | null>(null);

  const toggleWeekday = (dayIndex: number) => {
    setSelectedWeekdays(prev =>
      prev.includes(dayIndex)
        ? (prev.length > 1 ? prev.filter(d => d !== dayIndex) : prev)
        : [...prev, dayIndex].sort()
    );
  };

  const testRingtone = (ringId: string) => {
    if (previewingRingtone === ringId) {
      vedicAlarmAudio.stop();
      setPreviewingRingtone(null);
    } else {
      setPreviewingRingtone(ringId);
      vedicAlarmAudio.playRingtoneOnce(ringId, ringId === 'custom' ? customAudio?.dataUri : undefined);
      setTimeout(() => setPreviewingRingtone(null), 3500);
    }
  };

  const addTask = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const titleToUse = newTitle.trim() || (language === 'or' ? 'ନୂତନ ସାଧନା ସଂକଳ୍ପ' : 'नया साधना संकल्प');

    const key = muhurtaSel === 'any' ? suggestMuhurtaKey(energy) : muhurtaSel;
    const label = key === 'brahma' ? `Brahma Muhurta (${windows.brahma.start})` : key === 'abhijit' ? `Abhijit Muhurta (${windows.abhijit.start})` : undefined;
    const tags = [...new Set([...tagInput.split(',').map(s => s.trim()).filter(Boolean), energy])];

    const newTask: VedicTask = {
      id: Date.now().toString(),
      title: titleToUse,
      completed: false,
      priority: prioritySel,
      energyAlignment: energy,
      frequency: frequencySel,
      weekdays: frequencySel === 'weekly' ? selectedWeekdays : undefined,
      dueDate: frequencySel === 'specific_date' ? (dueDate || todayStr()) : undefined,
      dueTime: dueTime.trim() || undefined,
      muhurtaKey: muhurtaSel,
      auspiciousMuhurtaSuggested: label,
      alarmEnabled: alarmEnabledSel,
      ringtoneId: ringtoneSel,
      customAudioName: ringtoneSel === 'custom' ? customAudio?.name : undefined,
      customAudioData: ringtoneSel === 'custom' ? customAudio?.dataUri : undefined,
      tags,
      createdAt: todayStr(),
    };

    setTasks([newTask, ...tasks]);
    setNewTitle('');
    setTagInput('');
    setCalendarFilter('all'); // Switch to 'all' so the new task is ALWAYS immediately visible!

    // Success toast feedback
    setJustAddedToast(titleToUse);
    setTimeout(() => setJustAddedToast(null), 4500);
  };

  const addPreset = (p: SadhanaPreset) => {
    const title = p.title[language] || p.title.or || p.title.en;
    let actualDueTime = p.dueTime;
    if (p.id === 'p-surya' && windows.sunrise) {
      actualDueTime = windows.sunrise;
    } else if (p.muhurtaKey === 'brahma' && windows.brahma.start) {
      actualDueTime = windows.brahma.start;
    } else if (p.muhurtaKey === 'abhijit' && windows.abhijit.start) {
      actualDueTime = windows.abhijit.start;
    }

    const newTask: VedicTask = {
      id: Date.now().toString(),
      title,
      completed: false,
      priority: p.priority,
      energyAlignment: p.energy,
      frequency: p.frequency,
      weekdays: p.weekdays,
      dueTime: actualDueTime,
      muhurtaKey: p.muhurtaKey,
      alarmEnabled: true,
      ringtoneId: p.ringtoneId,
      tags: [...p.tags],
      createdAt: todayStr(),
    };
    setTasks([newTask, ...tasks]);
    setCalendarFilter('all');
    setJustAddedToast(title);
    setTimeout(() => setJustAddedToast(null), 4500);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(x => (x.id === id ? { ...x, completed: !x.completed, completedAt: !x.completed ? todayStr() : x.completedAt } : x)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(x => x.id !== id));
  };

  // ── Filtered Tasks based on Calendar & Status ──
  const [energyFilter, setEnergyFilter] = useState<EnergyFilter>('All');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const visibleTasks = useMemo(() => {
    let list = tasks;

    if (calendarFilter === 'today') {
      list = list.filter(t => isTaskScheduledForDate(t, now));
    } else if (calendarFilter === 'tomorrow') {
      const tom = new Date(now);
      tom.setDate(tom.getDate() + 1);
      list = list.filter(t => isTaskScheduledForDate(t, tom));
    } else if (calendarFilter === 'this_week') {
      list = list.filter(t => t.frequency === 'daily' || t.frequency === 'weekly' || t.frequency === 'muhurta_sync' || isTaskScheduledForDate(t, now));
    } else if (calendarFilter === 'custom_date') {
      list = list.filter(t => isTaskScheduledForDate(t, selectedCalendarDate));
    }

    if (statusFilter !== 'all') list = list.filter(x => (statusFilter === 'done') === x.completed);
    if (energyFilter !== 'All') list = list.filter(x => x.energyAlignment === energyFilter);

    return sortTasks(list);
  }, [tasks, calendarFilter, statusFilter, energyFilter, now, selectedCalendarDate]);

  // ── Stats ──
  const doneCount = tasks.filter(x => x.completed).length;
  const totalCount = tasks.length;
  const pct = totalCount === 0 ? 0 : doneCount / totalCount;
  const streak = useMemo(() => {
    const doneDays = tasks.filter(x => x.completed && x.completedAt).map(x => (x.completedAt as string).slice(0, 10));
    return computeStreak(doneDays, now);
  }, [tasks, now]);

  const energyCounts = useMemo(() => ({
    Sattva: tasks.filter(x => x.energyAlignment === 'Sattva' && !x.completed).length,
    Rajas: tasks.filter(x => x.energyAlignment === 'Rajas' && !x.completed).length,
    Tamas: tasks.filter(x => x.energyAlignment === 'Tamas' && !x.completed).length,
  }), [tasks]);

  // 7 Days for Calendar Strip
  const next7Days = useMemo(() => {
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  }, [now]);

  const formatCountdown = (mins: number): string => {
    if (mins < 60) return `${fmtN(mins)} ${t('ms_td_min_short')}`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m === 0 ? `${fmtN(h)} ${t('ms_td_hr_short')}` : `${fmtN(h)} ${t('ms_td_hr_short')} ${fmtN(m)} ${t('ms_td_min_short')}`;
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-16">
      {/* ═══ INTERACTIVE ANALOG WATCH TIME PICKER MODAL ═══ */}
      {showTimePicker && (
        <VedicTimePickerModal
          initialTime={dueTime}
          onConfirm={(tStr) => setDueTime(tStr)}
          onClose={() => setShowTimePicker(false)}
        />
      )}

      {/* ═══ INTERACTIVE VISUAL CALENDAR DATE PICKER MODAL ═══ */}
      {showDatePicker && (
        <VedicDatePickerModal
          initialDate={dueDate || todayStr()}
          onConfirm={(dStr) => {
            setDueDate(dStr);
            setFrequencySel('specific_date');
          }}
          onClose={() => setShowDatePicker(false)}
        />
      )}

      {/* ═══ 3D RINGING ALARM ALERT MODAL ═══ */}
      {activeAlarmTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-cosmic-900 via-cosmic-950 to-black border-2 border-cosmic-gold p-6 sm:p-8 shadow-[0_0_80px_rgba(245,158,11,0.45)] text-center animate-bounce-subtle">
            <div className="absolute inset-0 rounded-3xl border border-cosmic-gold/40 animate-ping pointer-events-none" />

            <div className="relative mx-auto w-24 h-24 mb-4 grid place-items-center">
              <div className="absolute inset-0 rounded-full bg-cosmic-gold/20 blur-xl animate-pulse" />
              <div className="relative text-6xl animate-wiggle">🔔</div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cosmic-gold/20 border border-cosmic-gold/40 text-cosmic-gold text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('alarm_ringing')}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold font-serif text-white mb-1">
              {activeAlarmTask.title}
            </h3>

            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-300 mt-2 mb-6">
              <span className="flex items-center gap-1 text-cosmic-gold font-mono"><Clock className="w-3.5 h-3.5" /> {activeAlarmTask.dueTime}</span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">{activeAlarmTask.energyAlignment}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={completeAlarmTask}
                className="col-span-1 sm:col-span-3 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                {t('alarm_done')}
              </button>

              <button
                type="button"
                onClick={() => snoozeAlarm(5)}
                className="py-2.5 rounded-2xl bg-cosmic-800/80 hover:bg-cosmic-800 border border-cosmic-gold/40 text-cosmic-gold font-bold text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <Timer className="w-3.5 h-3.5" />
                {t('alarm_snooze')}
              </button>

              <button
                type="button"
                onClick={dismissAlarm}
                className="sm:col-span-2 py-2.5 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 font-bold text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <BellOff className="w-3.5 h-3.5" />
                {t('alarm_dismiss')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ SUCCESS BANNER TOAST ON TASK ADDITION ═══ */}
      {justAddedToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500 text-emerald-200 text-sm font-bold flex items-center justify-between gap-3 shadow-lg shadow-emerald-500/20 animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              {language === 'or' ? 'କାର୍ଯ୍ୟ ସଫଳତାର ସହ ଯୋଡ଼ାଗଲା:' : language === 'hi' ? 'कार्य सफलतापूर्वक जोड़ा गया:' : 'Task added successfully:'}{' '}
              <b className="text-white underline">{justAddedToast}</b>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setJustAddedToast(null)}
            className="text-xs text-emerald-400 hover:text-white underline"
          >
            OK
          </button>
        </div>
      )}

      {/* ═══ 1. 3D VEDIC WATCH & LIVE ASTRO TIME ═══ */}
      <VedicWatch3D now={now} windows={windows} status={status} />

      {/* ═══ 2. REAL ASTRONOMICAL MUHURTA RADAR ═══ */}
      <section className="bg-cosmic-900/60 border border-cosmic-gold/20 rounded-3xl p-5 sm:p-6 backdrop-blur-md shadow-xl animate-cosmic-rise">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cosmic-gold to-cosmic-saffron text-cosmic-950 grid place-items-center shadow-lg shadow-cosmic-gold/20 shrink-0">
              <Sunrise className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-serif bg-gradient-to-r from-cosmic-gold via-yellow-200 to-cosmic-saffron bg-clip-text text-transparent">
                {t('ms_td_schedule')}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">{t('ms_td_schedule_sub')}</p>
            </div>
          </div>

          {upcoming && (
            <div className="hidden lg:flex items-center gap-2 bg-cosmic-gold/10 border border-cosmic-gold/30 rounded-2xl px-3.5 py-1.5 text-xs text-cosmic-gold">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>{t('ms_td_next')} <b>{upcoming.name === 'brahma' ? t('brahma_muhurta') : t('abhijit')}</b> ({fmtT(upcoming.start)}) · {t('ms_td_in')} {formatCountdown(upcoming.startsInMin)}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {([
            { icon: <Sunrise className="w-3.5 h-3.5" />, label: t('sunrise'), time: windows.sunrise, tone: 'text-amber-300' },
            { icon: <Sparkles className="w-3.5 h-3.5" />, label: t('brahma_muhurta'), time: `${windows.brahma.start}–${windows.brahma.end}`, tone: 'text-emerald-300' },
            { icon: <CheckCircle2 className="w-3.5 h-3.5" />, label: t('abhijit'), time: windows.abhijit.isAuspicious ? `${windows.abhijit.start}–${windows.abhijit.end}` : t('ms_td_avoid'), tone: windows.abhijit.isAuspicious ? 'text-emerald-300' : 'text-slate-500' },
            { icon: <BellOff className="w-3.5 h-3.5" />, label: t('rahu_kaal'), time: `${windows.rahu.start}–${windows.rahu.end}`, tone: 'text-rose-300' },
            { icon: <Timer className="w-3.5 h-3.5" />, label: t('yamaganda'), time: `${windows.yamaganda.start}–${windows.yamaganda.end}`, tone: 'text-rose-300' },
            { icon: <Clock className="w-3.5 h-3.5" />, label: t('gulika'), time: `${windows.gulika.start}–${windows.gulika.end}`, tone: 'text-slate-300' },
            { icon: <Sunset className="w-3.5 h-3.5" />, label: t('sunset'), time: windows.sunset, tone: 'text-amber-300' },
          ] as Array<{ icon: React.ReactNode; label: string; time: string; tone: string }>).map((w, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-cosmic-950/60 p-3 hover:border-cosmic-gold/40 transition-colors">
              <div className={`flex items-center gap-1.5 text-[10px] uppercase tracking-wider ${w.tone}`}>{w.icon}{w.label}</div>
              <div className="mt-1 text-[12px] font-bold text-slate-100 leading-tight">{fmtT(w.time.split('–')[0])}{w.time.includes('–') ? `–${fmtT(w.time.split('–')[1])}` : ''}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 3. INTERACTIVE CALENDAR STRIP & DAY NAVIGATOR ═══ */}
      <section className="bg-cosmic-900/60 border border-cosmic-gold/20 rounded-3xl p-5 sm:p-6 backdrop-blur-md shadow-xl animate-cosmic-rise">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <CalendarDays className="w-5 h-5 text-cosmic-gold" />
            <h3 className="text-base sm:text-lg font-bold font-serif text-slate-100">
              {language === 'or' ? 'ଦିନ ଓ ତାରିଖ ଯୋଜନାକାରୀ (Calendar Strip)' : language === 'hi' ? 'दिन व तारीख योजना (Calendar Strip)' : 'Day & Date Navigator'}
            </h3>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-cosmic-950/80 p-1 rounded-2xl border border-white/10 text-xs">
            {([
              { key: 'all' as const, label: t('cal_all') },
              { key: 'today' as const, label: t('cal_today') },
              { key: 'tomorrow' as const, label: t('cal_tomorrow') },
              { key: 'this_week' as const, label: t('cal_this_week') },
            ]).map(f => (
              <button
                key={f.key}
                type="button"
                onClick={() => setCalendarFilter(f.key)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  calendarFilter === f.key
                    ? 'bg-cosmic-gold text-cosmic-950 shadow-md shadow-cosmic-gold/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* 7-Day Pill Carousel */}
        <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
          {next7Days.map((d, idx) => {
            const isToday = idx === 0;
            const isSelected = calendarFilter === 'custom_date' && dayKey(d) === dayKey(selectedCalendarDate);
            const weekday = WEEKDAY_METADATA[d.getDay()];
            const dayNum = d.getDate();

            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSelectedCalendarDate(d);
                  setCalendarFilter(isToday ? 'today' : 'custom_date');
                }}
                className={`relative rounded-2xl p-3 text-center border transition-all active:scale-95 ${
                  (isToday && calendarFilter === 'today') || isSelected
                    ? 'bg-gradient-to-b from-cosmic-gold/20 to-cosmic-gold/5 border-cosmic-gold text-cosmic-gold shadow-lg shadow-cosmic-gold/15'
                    : 'bg-cosmic-950/50 border-white/10 text-slate-300 hover:border-cosmic-gold/30'
                }`}
              >
                {isToday && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-cosmic-gold text-cosmic-950 text-[9px] font-black uppercase tracking-wider">
                    {t('cal_today')}
                  </span>
                )}
                <div className="text-[11px] font-medium text-slate-400 mt-1">
                  {weekday.short[language] || weekday.short.or}
                </div>
                <div className="text-xl font-extrabold font-serif mt-0.5">
                  {formatNumber(dayNum)}
                </div>
                <div className="text-[9px] text-cosmic-gold/80 truncate mt-1">
                  {weekday.deity[language] || weekday.deity.or}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ═══ 4. 1-CLICK SACRED SADHANA PRESETS ═══ */}
      <section className="bg-cosmic-900/60 border border-cosmic-gold/20 rounded-3xl p-5 sm:p-6 backdrop-blur-md shadow-xl animate-cosmic-rise">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-cosmic-950 grid place-items-center shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold font-serif text-slate-100">
              {t('presets_title')}
            </h3>
            <p className="text-[11px] text-slate-400">{t('presets_sub')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-3">
          {SADHANA_PRESETS.map((p) => {
            const title = p.title[language] || p.title.or || p.title.en;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => addPreset(p)}
                className="group p-3 rounded-2xl bg-cosmic-950/60 border border-white/10 hover:border-cosmic-gold/50 text-left transition-all active:scale-95 flex items-start gap-2.5"
              >
                <div className="w-7 h-7 rounded-lg bg-cosmic-gold/15 text-cosmic-gold grid place-items-center shrink-0 mt-0.5 group-hover:bg-cosmic-gold group-hover:text-cosmic-950 transition-colors">
                  <Plus className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-100 group-hover:text-cosmic-gold truncate transition-colors">
                    {title}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1">
                    <Clock className="w-3 h-3 text-cosmic-gold" />
                    <span>{p.dueTime}</span>
                    <span>•</span>
                    <span className="capitalize">{p.frequency}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ═══ 5. ADVANCED TASK CREATION FORM ═══ */}
      <section className="bg-cosmic-900/60 border border-cosmic-gold/20 rounded-3xl p-5 sm:p-6 backdrop-blur-md shadow-xl animate-cosmic-rise">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cosmic-gold to-cosmic-saffron text-cosmic-950 grid place-items-center shadow-lg shadow-cosmic-gold/20 shrink-0">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold font-serif bg-gradient-to-r from-cosmic-gold via-yellow-200 to-cosmic-saffron bg-clip-text text-transparent">
              {t('add_task')}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">{t('ms_td_form_sub')}</p>
          </div>
        </div>

        <form onSubmit={addTask} className="space-y-4">
          {/* Main Title Input */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder={t('task_placeholder')}
              className="flex-1 bg-cosmic-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-cosmic-gold transition-colors"
            />
            <div className="flex gap-2.5">
              <select
                value={energy}
                onChange={e => setEnergy(e.target.value as VedicTask['energyAlignment'])}
                className="bg-cosmic-950 border border-slate-800 rounded-xl px-3 py-3 text-xs text-cosmic-gold focus:outline-none focus:border-cosmic-gold cursor-pointer"
              >
                <option value="Sattva">Sattva (ସତ୍ତ୍ୱ - ଶାନ୍ତି)</option>
                <option value="Rajas">Rajas (ରଜଃ - କର୍ମ)</option>
                <option value="Tamas">Tamas (ତମଃ - ବିଶ୍ରାମ)</option>
              </select>
              <button
                type="submit"
                className="bg-gradient-to-r from-cosmic-gold to-cosmic-saffron text-cosmic-950 font-bold px-6 py-3 rounded-xl text-xs hover:brightness-110 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-cosmic-gold/20 active:scale-95 shrink-0"
              >
                <Plus className="w-4 h-4" />
                {t('add_task')}
              </button>
            </div>
          </div>

          {/* Recurrence Frequency Selector */}
          <div className="bg-cosmic-950/70 border border-white/10 rounded-2xl p-4 space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-cosmic-gold flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>{language === 'or' ? 'କାର୍ଯ୍ୟର ଆବୃତ୍ତି ଓ ସମୟ (Frequency & Schedule)' : language === 'hi' ? 'कार्य की पुनरावृत्ति व समय' : 'Task Frequency & Timing'}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {([
                { key: 'daily' as const, label: t('freq_daily'), desc: 'Every day' },
                { key: 'weekly' as const, label: t('freq_weekly'), desc: 'Specific days' },
                { key: 'specific_date' as const, label: t('freq_specific_date'), desc: 'One-time date' },
                { key: 'muhurta_sync' as const, label: t('freq_muhurta_sync'), desc: 'Auspicious sync' },
              ]).map(f => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFrequencySel(f.key)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    frequencySel === f.key
                      ? 'bg-cosmic-gold/15 border-cosmic-gold text-cosmic-gold font-bold shadow-md shadow-cosmic-gold/10'
                      : 'bg-cosmic-900/40 border-white/10 text-slate-300 hover:border-cosmic-gold/30'
                  }`}
                >
                  <div className="text-xs font-bold">{f.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{f.desc}</div>
                </button>
              ))}
            </div>

            {/* Weekday Selection for Weekly Tasks */}
            {frequencySel === 'weekly' && (
              <div className="pt-2 border-t border-white/5 animate-fade-in">
                <div className="text-[11px] text-slate-400 mb-2">
                  {language === 'or' ? 'ସପ୍ତାହର ବାର ଚୟନ କରନ୍ତୁ (Select Weekdays):' : language === 'hi' ? 'सप्ताह के वार चुनें:' : 'Select Weekdays:'}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {WEEKDAY_METADATA.map(w => {
                    const active = selectedWeekdays.includes(w.index);
                    return (
                      <button
                        key={w.index}
                        type="button"
                        onClick={() => toggleWeekday(w.index)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          active
                            ? 'bg-cosmic-gold text-cosmic-950 shadow-md shadow-cosmic-gold/20'
                            : 'bg-cosmic-900 border border-white/10 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {w.short[language] || w.short.or}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Specific Date Trigger */}
            {frequencySel === 'specific_date' && (
              <div className="pt-2 border-t border-white/5 animate-fade-in flex flex-col sm:flex-row gap-3 items-center">
                <label className="text-[11px] text-slate-400 flex items-center gap-2">
                  <CalendarIcon className="w-3.5 h-3.5 text-cosmic-gold" />
                  <span>{t('cal_select_date')}:</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowDatePicker(true)}
                  className="px-4 py-2 rounded-xl bg-cosmic-900 hover:bg-cosmic-800 border border-cosmic-gold/50 text-xs font-bold text-cosmic-gold flex items-center gap-2 transition-all shadow-sm"
                >
                  <CalendarIcon className="w-4 h-4" />
                  <span>{dueDate || todayStr()} (Click to open Calendar)</span>
                </button>
              </div>
            )}

            {/* Interactive Time Picker & Ringtone Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t border-white/5 items-center">
              {/* Interactive Watch Time Picker Button (User Request) */}
              <div className="sm:col-span-4 flex items-center gap-2">
                <label className="text-[11px] text-slate-400 flex items-center gap-1.5 shrink-0">
                  <Clock className="w-3.5 h-3.5 text-cosmic-gold" />
                  <span>Time:</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowTimePicker(true)}
                  className="w-full bg-cosmic-900 hover:bg-cosmic-800 border border-cosmic-gold/50 rounded-xl px-3 py-2 text-xs font-bold text-cosmic-gold flex items-center justify-between shadow-sm active:scale-95 transition-all"
                  title="Click to open interactive analog clock dial"
                >
                  <div className="flex items-center gap-1.5 font-mono">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{dueTime}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">⌚ Watch</span>
                </button>
              </div>

              {/* Ringtone Selector */}
              <div className="sm:col-span-5 flex items-center gap-2">
                <label className="text-[11px] text-slate-400 flex items-center gap-1 shrink-0">
                  <Bell className="w-3.5 h-3.5 text-cosmic-gold" />
                  <span>Tone:</span>
                </label>
                <select
                  value={ringtoneSel}
                  onChange={e => setRingtoneSel(e.target.value)}
                  className="w-full bg-cosmic-900 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-cosmic-gold focus:outline-none focus:border-cosmic-gold cursor-pointer"
                >
                  {BUILTIN_RINGTONES.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.icon} {r.name[language] || r.name.or}
                    </option>
                  ))}
                  {customAudio && (
                    <option value="custom">🎵 {customAudio.name} (Custom)</option>
                  )}
                </select>
                {/* Preview Button */}
                <button
                  type="button"
                  onClick={() => testRingtone(ringtoneSel)}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all shrink-0 ${
                    previewingRingtone === ringtoneSel
                      ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                      : 'bg-cosmic-900 border-cosmic-gold/40 text-cosmic-gold hover:bg-cosmic-800'
                  }`}
                  title={t('ringtone_preview')}
                >
                  {previewingRingtone === ringtoneSel ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Custom Upload Button */}
              <div className="sm:col-span-3 flex items-center justify-end">
                <label className="cursor-pointer px-3 py-2 rounded-xl bg-cosmic-900 hover:bg-cosmic-800 border border-white/10 hover:border-cosmic-gold/40 text-slate-300 hover:text-cosmic-gold text-[11px] font-bold flex items-center gap-1.5 transition-all w-full justify-center">
                  <Upload className="w-3.5 h-3.5 text-cosmic-gold" />
                  <span className="truncate">{customAudio ? 'Replace Audio' : t('ringtone_upload')}</span>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAdvanced(v => !v)}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-cosmic-gold/90 hover:text-cosmic-gold transition-colors"
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            {t('ms_td_more')}
          </button>

          {showAdvanced && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-cosmic-950/50 border border-white/10 rounded-2xl p-4 animate-cosmic-rise">
              <label className="text-[11px] text-slate-400 space-y-1">
                {t('ms_td_muhurta')}
                <select
                  value={muhurtaSel}
                  onChange={e => setMuhurtaSel(e.target.value as MuhurtaKey)}
                  className="block w-full bg-cosmic-950 border border-slate-800 rounded-lg px-2 py-2 text-xs text-slate-100 focus:outline-none focus:border-cosmic-gold cursor-pointer"
                >
                  <option value="any">{t('ms_td_any')}</option>
                  <option value="brahma">{t('brahma_muhurta')}</option>
                  <option value="abhijit">{t('abhijit')}</option>
                </select>
              </label>

              <label className="text-[11px] text-slate-400 space-y-1">
                {t('ms_td_priority')}
                <select
                  value={prioritySel}
                  onChange={e => setPrioritySel(e.target.value as PriorityLevel)}
                  className="block w-full bg-cosmic-950 border border-slate-800 rounded-lg px-2 py-2 text-xs text-slate-100 focus:outline-none focus:border-cosmic-gold cursor-pointer"
                >
                  <option value="high">{t('ms_td_high')}</option>
                  <option value="medium">{t('ms_td_med')}</option>
                  <option value="low">{t('ms_td_low')}</option>
                </select>
              </label>

              <label className="text-[11px] text-slate-400 space-y-1 col-span-2 sm:col-span-1">
                {t('ms_td_tags')}
                <input
                  type="text"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  placeholder={t('ms_td_tags_hint')}
                  className="block w-full bg-cosmic-950 border border-slate-800 rounded-lg px-2 py-2 text-xs text-slate-100 focus:outline-none focus:border-cosmic-gold"
                />
              </label>
            </div>
          )}
        </form>
      </section>

      {/* ═══ 6. KARMA PROGRESS + GUNA BALANCE + STATS ═══ */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Karma Progress 3D */}
        <section className="bg-cosmic-900/60 border border-cosmic-gold/20 rounded-3xl p-5 sm:p-6 backdrop-blur-md shadow-xl animate-cosmic-rise relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cosmic-gold to-cosmic-saffron text-cosmic-950 grid place-items-center shadow-lg">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-serif text-slate-100">
                {t('ms_td_progress')}
              </h3>
              <p className="text-[11px] text-slate-400">3D Mandala Completion Ring</p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 rounded-full bg-cosmic-gold/10 blur-3xl pointer-events-none" />
            <KarmaChakra3D progress={pct} pulse={totalCount > 0 && doneCount === totalCount} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-bold font-serif bg-gradient-to-b from-white to-cosmic-gold bg-clip-text text-transparent drop-shadow-lg">
                {fmtN(Math.round(pct * 100))}%
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mt-1">
                {fmtN(doneCount)} / {fmtN(totalCount)} {t('ms_td_done')}
              </span>
            </div>
          </div>

          {totalCount > 0 && doneCount === totalCount && (
            <div className="mt-2 text-center text-sm font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-2.5 animate-cosmic-rise">
              🎉 {t('ms_td_all_done')}
            </div>
          )}

          <div className="grid grid-cols-3 gap-2.5 mt-4">
            {[
              { icon: <Flame className="w-3.5 h-3.5" />, label: t('ms_td_streak'), value: `${fmtN(streak)} ${t('palm_day')}` },
              { icon: <CheckCircle2 className="w-3.5 h-3.5" />, label: t('ms_td_done'), value: fmtN(doneCount) },
              { icon: <Circle className="w-3.5 h-3.5" />, label: t('ms_td_open'), value: fmtN(totalCount - doneCount) },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-cosmic-950/50 p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-[10px] uppercase tracking-wider text-slate-400">
                  {s.icon}{s.label}
                </div>
                <div className="mt-1 text-lg font-bold text-slate-100">{s.value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Guna Balance (Sattva, Rajas, Tamas) */}
        <section className="bg-cosmic-900/60 border border-cosmic-gold/20 rounded-3xl p-5 sm:p-6 backdrop-blur-md shadow-xl animate-cosmic-rise">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 text-white grid place-items-center shadow-lg">
              <Filter className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-serif text-slate-100">
                {t('ms_td_energy')}
              </h3>
              <p className="text-[11px] text-slate-400">{t('ms_td_energy_sub')}</p>
            </div>
          </div>

          <div className="space-y-4">
            {([
              { key: 'Sattva' as const, label: 'Sattva (ସତ୍ତ୍ୱ - ଶୁଦ୍ଧତା ଓ ଧ୍ୟାନ)', color: 'from-indigo-400 to-sky-500', chip: 'bg-indigo-500/20 text-indigo-300' },
              { key: 'Rajas' as const, label: 'Rajas (ରଜଃ - ସକ୍ରିୟ କର୍ମ ଓ କ୍ୟାରିୟର)', color: 'from-amber-400 to-orange-500', chip: 'bg-amber-500/20 text-amber-300' },
              { key: 'Tamas' as const, label: 'Tamas (ତମଃ - ବିଶ୍ରାମ ଓ ନିଦ୍ରା)', color: 'from-slate-400 to-slate-600', chip: 'bg-slate-600/30 text-slate-300' },
            ]).map(g => {
              const max = Math.max(1, energyCounts.Sattva, energyCounts.Rajas, energyCounts.Tamas);
              const pctW = (energyCounts[g.key] / max) * 100;
              return (
                <div key={g.key} className="bg-cosmic-950/40 p-3 rounded-2xl border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${g.chip}`}>{g.label}</span>
                    <span className="text-xs font-bold text-slate-300">{fmtN(energyCounts[g.key])} {t('ms_td_open')}</span>
                  </div>
                  <div className="h-2 bg-white/8 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${g.color} transition-all duration-700`} style={{ width: `${pctW}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex items-start gap-2.5 bg-cosmic-950/60 border border-white/10 rounded-2xl p-3.5">
            <Bell className="w-4 h-4 text-cosmic-gold shrink-0 mt-0.5" />
            <div className="min-w-0">
              <b className="text-[11px] uppercase tracking-[0.18em] text-cosmic-gold">
                {language === 'or' ? 'ସ୍ୱୟଂକ୍ରିୟ ବୈଦିକ ଆଲାର୍ମ ସକ୍ରିୟ' : language === 'hi' ? 'स्वचालित वैदिक अलार्म सक्रिय' : 'Automated Vedic Alarm Active'}
              </b>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                {language === 'or' ? 'ପ୍ରତ୍ୟେକ କାର୍ଯ୍ୟର ସମୟ ହେବା ମାତ୍ରେ ନିର୍ବାଚିତ ଶଙ୍ଖ/ଘଣ୍ଟି ଧ୍ୱନି ବାଜି ଉଠିବ।' : language === 'hi' ? 'निर्धारित समय आने पर पवित्र शंख अथवा घंटी नाद के साथ अलार्म बजेगा।' : 'Alarms will trigger automatically with selected sacred ringtone or custom audio.'}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* ═══ 7. FILTERS & SCHEDULED TASK LIST ═══ */}
      <section className="bg-cosmic-900/60 border border-cosmic-gold/20 rounded-3xl p-5 sm:p-6 backdrop-blur-md shadow-xl animate-cosmic-rise">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-cosmic-gold" />
            <h3 className="text-lg font-bold font-serif text-slate-100">
              {language === 'or' ? 'ସାଧନା ଓ କର୍ତ୍ତବ୍ୟ ସୂଚୀ' : language === 'hi' ? 'साधना व कर्तव्य सूची' : 'Scheduled Tasks'}
              <span className="ml-2 text-xs font-normal text-cosmic-gold">({fmtN(visibleTasks.length)})</span>
            </h3>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-cosmic-950 p-1 rounded-xl border border-white/10 text-xs">
              {(['all', 'open', 'done'] as StatusFilter[]).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1 rounded-lg capitalize font-bold transition-all ${
                    statusFilter === s ? 'bg-cosmic-gold text-cosmic-950' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Energy Filter */}
            <div className="flex items-center gap-1 bg-cosmic-950 p-1 rounded-xl border border-white/10 text-xs">
              {(['All', 'Sattva', 'Rajas', 'Tamas'] as EnergyFilter[]).map(e => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEnergyFilter(e)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    energyFilter === e ? 'bg-cosmic-gold text-cosmic-950' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Task Cards List */}
        {visibleTasks.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-cosmic-950/40 border border-white/5">
            <Sparkles className="w-10 h-10 text-cosmic-gold/40 mx-auto mb-2 animate-pulse" />
            <p className="text-sm text-slate-400 font-medium">
              {language === 'or' ? 'ଏହି ଦିନରେ କୌଣସି କାର୍ଯ୍ୟ ନାହିଁ। ନୂତନ ସାଧନା କାର୍ଯ୍ୟ ଯୋଡ଼ନ୍ତୁ।' : language === 'hi' ? 'इस दिन कोई कार्य निर्धारित नहीं है। नया कार्य जोड़ें।' : 'No tasks scheduled for this selection. Add a sacred task above!'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {visibleTasks.map(task => {
              const ringtone = BUILTIN_RINGTONES.find(r => r.id === task.ringtoneId) || BUILTIN_RINGTONES[0];
              const isCustom = task.ringtoneId === 'custom';

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    task.completed
                      ? 'bg-cosmic-950/40 border-white/5 opacity-60'
                      : 'bg-cosmic-950/70 border-white/10 hover:border-cosmic-gold/40 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={() => toggleTask(task.id)}
                      className={`w-6 h-6 rounded-lg border grid place-items-center mt-0.5 transition-colors shrink-0 ${
                        task.completed
                          ? 'bg-emerald-500 border-emerald-400 text-cosmic-950'
                          : 'border-slate-700 hover:border-cosmic-gold text-transparent'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-sm font-bold ${task.completed ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                          {task.title}
                        </span>

                        {/* Frequency Tag */}
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/5 border border-white/10 text-slate-300">
                          {task.frequency === 'daily'
                            ? '🔄 Daily'
                            : task.frequency === 'weekly'
                              ? `📅 ${task.weekdays?.map(w => WEEKDAY_METADATA[w]?.short[language] || WEEKDAY_METADATA[w]?.short.or).join(', ') || 'Weekly'}`
                              : task.frequency === 'specific_date'
                                ? `🗓️ ${task.dueDate || 'One-Time'}`
                                : '☀️ Muhurta-Sync'}
                        </span>

                        {/* Guna Tag */}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          task.energyAlignment === 'Sattva' ? 'bg-indigo-500/20 text-indigo-300' : task.energyAlignment === 'Rajas' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-700/30 text-slate-400'
                        }`}>
                          {task.energyAlignment}
                        </span>
                      </div>

                      {/* Details row: Time, Alarm Tone, Muhurta */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1.5">
                        {task.dueTime && (
                          <div className="flex items-center gap-1 text-cosmic-gold font-mono">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{task.dueTime}</span>
                          </div>
                        )}

                        {task.alarmEnabled && (
                          <div className="flex items-center gap-1 text-slate-300 bg-cosmic-900/80 px-2 py-0.5 rounded-md border border-white/5">
                            <Bell className="w-3 h-3 text-cosmic-gold" />
                            <span>{isCustom ? `🎵 ${task.customAudioName || 'Custom'}` : `${ringtone.icon} ${ringtone.name[language] || ringtone.name.or}`}</span>
                          </div>
                        )}

                        {task.auspiciousMuhurtaSuggested && (
                          <div className="text-[11px] text-emerald-400/90 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            <span>{task.auspiciousMuhurtaSuggested}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {task.alarmEnabled && (
                      <button
                        type="button"
                        onClick={() => testRingtone(task.ringtoneId || 'bell')}
                        className="p-2 rounded-xl bg-cosmic-900 hover:bg-cosmic-800 border border-white/10 text-slate-300 hover:text-cosmic-gold transition-colors"
                        title={t('ringtone_preview')}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteTask(task.id)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
