// Pure planning helpers for the Vedic Tasks page.
// All time windows derive from the real astronomical engines —
// NOAA sun times (calculateSunTimes) + classical weekday muhurta segments
// (calculateMuhurtas). No hardcoded times anywhere.
import { calculateSunTimes } from '../astronomy/solar_lunar';
import { calculateMuhurtas } from '../panjika/muhurta';
import type { MuhurtaKey, TaskFrequency, VedicTask } from '../../types/todo';

export interface DayWindows {
  sunrise: string;
  sunset: string;
  brahma: { start: string; end: string };
  abhijit: { start: string; end: string; isAuspicious: boolean };
  rahu: { start: string; end: string };
  yamaganda: { start: string; end: string };
  gulika: { start: string; end: string };
}

export function getDefaultLocation(): { lat: number; lon: number } {
  try {
    const raw = localStorage.getItem('divyajyoti_user_location');
    if (raw) {
      const p = JSON.parse(raw) as { lat?: number; lon?: number; latitude?: number; longitude?: number };
      const lat = p.lat ?? p.latitude;
      const lon = p.lon ?? p.longitude;
      if (typeof lat === 'number' && typeof lon === 'number') return { lat, lon };
    }
  } catch { /* SSR / private mode */ }
  // Srikshetra Puri — sacred default
  return { lat: 19.8135, lon: 85.8312 };
}

export function getTodayWindows(date: Date = new Date()): DayWindows {
  const { lat, lon } = getDefaultLocation();
  const sun = calculateSunTimes(date, lat, lon);
  const m = calculateMuhurtas(date, sun.sunrise, sun.sunset);
  return {
    sunrise: sun.sunrise,
    sunset: sun.sunset,
    brahma: { start: m.brahmaMuhurta.start, end: m.brahmaMuhurta.end },
    abhijit: { start: m.abhijit.start, end: m.abhijit.end, isAuspicious: m.abhijit.isAuspicious },
    rahu: { start: m.rahuKaal.start, end: m.rahuKaal.end },
    yamaganda: { start: m.yamaganda.start, end: m.yamaganda.end },
    gulika: { start: m.gulika.start, end: m.gulika.end },
  };
}

/** "04:30 AM" or "04:30" -> minutes since midnight. Returns -1 on bad input. */
export function timeStrToMinutes(timeStr: string): number {
  if (!timeStr) return -1;
  const parts = timeStr.trim().split(/[:\s]/);
  if (parts.length < 2) return -1;
  let hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return -1;
  const period = (parts[2] || '').toUpperCase();
  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

export type NowKind = 'auspicious' | 'inauspicious' | 'neutral';

export interface NowStatus {
  kind: NowKind;
  windowName: 'brahma' | 'abhijit' | 'rahu' | 'yamaganda' | 'gulika' | null;
  endsInMin: number;
}

/** Classify the current moment against today's real windows. */
export function nowStatus(w: DayWindows, now: Date = new Date()): NowStatus {
  const n = now.getHours() * 60 + now.getMinutes();
  const inWin = (s: string, e: string) => {
    const a = timeStrToMinutes(s);
    const b = timeStrToMinutes(e);
    if (a < 0 || b < 0) return -1;
    if (a <= b) return n >= a && n < b ? b - n : -1;
    // Overnight wrap (rare for these windows, handled anyway)
    return n >= a || n < b ? (n >= a ? 1440 - n + b : b - n) : -1;
  };
  const checks: Array<[NowStatus['windowName'], string, string, NowKind]> = [
    ['brahma', w.brahma.start, w.brahma.end, 'auspicious'],
    ['abhijit', w.abhijit.start, w.abhijit.end, w.abhijit.isAuspicious ? 'auspicious' : 'neutral'],
    ['rahu', w.rahu.start, w.rahu.end, 'inauspicious'],
    ['yamaganda', w.yamaganda.start, w.yamaganda.end, 'inauspicious'],
    ['gulika', w.gulika.start, w.gulika.end, 'neutral'],
  ];
  for (const [name, s, e, kind] of checks) {
    const left = inWin(s, e);
    if (left >= 0) return { kind, windowName: name, endsInMin: left };
  }
  return { kind: 'neutral', windowName: null, endsInMin: 0 };
}

export interface NextWindow {
  name: 'brahma' | 'abhijit';
  startsInMin: number;
  start: string;
}

/** Next upcoming auspicious window start after `now` (null if none left today). */
export function nextAuspicious(w: DayWindows, now: Date = new Date()): NextWindow | null {
  const n = now.getHours() * 60 + now.getMinutes();
  const cands: NextWindow[] = [];
  const b = timeStrToMinutes(w.brahma.start);
  const a = timeStrToMinutes(w.abhijit.start);
  if (b >= 0 && b > n) cands.push({ name: 'brahma', startsInMin: b - n, start: w.brahma.start });
  if (a >= 0 && w.abhijit.isAuspicious && a > n) cands.push({ name: 'abhijit', startsInMin: a - n, start: w.abhijit.start });
  cands.sort((x, y) => x.startsInMin - y.startsInMin);
  return cands[0] || null;
}

export function suggestMuhurtaKey(energy: VedicTask['energyAlignment']): MuhurtaKey {
  if (energy === 'Sattva') return 'brahma';
  if (energy === 'Rajas') return 'abhijit';
  return 'any';
}

/** YYYY-MM-DD in local time. */
export function dayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Consecutive-day streak ending today (or yesterday if today has no
 * completion yet). `dayKeys` = YYYY-MM-DD strings with ≥1 completion.
 */
export function computeStreak(dayKeys: string[], today: Date = new Date()): number {
  const set = new Set(dayKeys);
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (!set.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let count = 0;
  for (let i = 0; i < 3660; i++) {
    if (set.has(dayKey(cursor))) {
      count++;
      cursor.setDate(cursor.getDate() - 1);
    } else break;
  }
  return count;
}

const PRIORITY_RANK: Record<VedicTask['priority'], number> = { high: 0, medium: 1, low: 2 };

/** Incomplete first (priority → due date → created), completed last. Pure + stable. */
export function sortTasks(tasks: VedicTask[]): VedicTask[] {
  return [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const pr = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
    if (pr !== 0) return pr;
    const da = a.dueDate || '9999-99-99';
    const db = b.dueDate || '9999-99-99';
    if (da !== db) return da < db ? -1 : 1;
    return a.createdAt < b.createdAt ? -1 : a.createdAt > b.createdAt ? 1 : 0;
  });
}

// ── 7 Weekdays Metadata ──
export const WEEKDAY_METADATA: Array<{ index: number; name: { or: string; hi: string; en: string }; short: { or: string; hi: string; en: string }; deity: { or: string; hi: string; en: string } }> = [
  { index: 0, name: { or: 'ରବିବାର', hi: 'रविवार', en: 'Sunday' }, short: { or: 'ରବି', hi: 'रवि', en: 'Sun' }, deity: { or: 'ସୂର୍ଯ୍ୟଦେବ', hi: 'सूर्य देव', en: 'Surya Deva' } },
  { index: 1, name: { or: 'ସୋମବାର', hi: 'सोमवार', en: 'Monday' }, short: { or: 'ସୋମ', hi: 'सोम', en: 'Mon' }, deity: { or: 'ଭଗବାନ ଶିବ', hi: 'भगवान शिव', en: 'Lord Shiva' } },
  { index: 2, name: { or: 'ମଙ୍ଗଳବାର', hi: 'मंगलवार', en: 'Tuesday' }, short: { or: 'ମଙ୍ଗଳ', hi: 'मंगल', en: 'Tue' }, deity: { or: 'ହନୁମାନଜୀ / ମଙ୍ଗଳ', hi: 'हनुमान जी', en: 'Lord Hanuman' } },
  { index: 3, name: { or: 'ବୁଧବାର', hi: 'बुधवार', en: 'Wednesday' }, short: { or: 'ବୁଧ', hi: 'बुध', en: 'Wed' }, deity: { or: 'ଗଣେଶ ଦେବ', hi: 'गणेश देव', en: 'Lord Ganesha' } },
  { index: 4, name: { or: 'ଗୁରୁବାର', hi: 'गुरुवार', en: 'Thursday' }, short: { or: 'ଗୁରୁ', hi: 'गुरु', en: 'Thu' }, deity: { or: 'ମହାଲକ୍ଷ୍ମୀ / ବୃହସ୍ପତି', hi: 'महालक्ष्मी / बृहस्पति', en: 'Goddess Mahalakshmi' } },
  { index: 5, name: { or: 'ଶୁକ୍ରବାର', hi: 'शुक्रवार', en: 'Friday' }, short: { or: 'ଶୁକ୍ର', hi: 'शुक्र', en: 'Fri' }, deity: { or: 'ସନ୍ତୋଷୀ ମାତା / ଦେବୀ', hi: 'संतोषी माता / देवी', en: 'Divine Mother Durga' } },
  { index: 6, name: { or: 'ଶନିବାର', hi: 'शनिवार', en: 'Saturday' }, short: { or: 'ଶନି', hi: 'शनि', en: 'Sat' }, deity: { or: 'ଶନିଦେବ / ହନୁମାନ', hi: 'शनिदेव / हनुमान', en: 'Lord Shani / Hanuman' } },
];

/** Check if a task is scheduled to run on a specific target date. */
export function isTaskScheduledForDate(task: VedicTask, targetDate: Date): boolean {
  const freq: TaskFrequency = task.frequency ?? (task.dueDate ? 'specific_date' : 'daily');
  const targetKey = dayKey(targetDate);

  if (freq === 'daily' || freq === 'muhurta_sync') {
    return true;
  }

  if (freq === 'weekly') {
    const dayOfWeek = targetDate.getDay();
    if (Array.isArray(task.weekdays) && task.weekdays.length > 0) {
      return task.weekdays.includes(dayOfWeek);
    }
    // Default to the day it was created if weekdays not specified
    const createdDate = new Date(task.createdAt || targetKey);
    return createdDate.getDay() === dayOfWeek;
  }

  if (freq === 'specific_date') {
    if (!task.dueDate) return true;
    return task.dueDate === targetKey;
  }

  return true;
}

/** Check if an alarm should fire right now for this task. */
export function isTaskAlarmDue(task: VedicTask, now: Date): boolean {
  if (!task.alarmEnabled || task.completed) return false;
  if (!task.dueTime) return false;

  // Check snooze
  if (task.snoozeUntil && Date.now() < task.snoozeUntil) return false;

  // Check if scheduled for today
  if (!isTaskScheduledForDate(task, now)) return false;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const taskMinutes = timeStrToMinutes(task.dueTime);
  if (taskMinutes < 0) return false;

  // Fire if within the current minute
  return currentMinutes === taskMinutes;
}

/** Classical Vedic Ghati & Vighati elapsed from sunrise. */
export function getVedicGhatiVighati(now: Date, sunriseStr: string): { ghati: number; vighati: number; elapsedMin: number } {
  const sunriseMin = timeStrToMinutes(sunriseStr);
  const nowMin = now.getHours() * 60 + now.getMinutes();
  if (sunriseMin < 0) return { ghati: 0, vighati: 0, elapsedMin: 0 };

  let elapsedMin = nowMin - sunriseMin;
  if (elapsedMin < 0) elapsedMin += 1440; // overnight prior day

  // 1 Ghati = 24 minutes, 1 Vighati = 24 seconds = 1/2.5 of a minute (2.5 vighati per minute)
  const ghati = Math.floor(elapsedMin / 24);
  const remMinutes = elapsedMin % 24;
  const vighati = Math.floor(remMinutes * 2.5 + (now.getSeconds() / 24));

  return { ghati: ghati % 60, vighati: vighati % 60, elapsedMin };
}

// ── Authentic Shastric Presets ──
export interface SadhanaPreset {
  id: string;
  title: { or: string; hi: string; en: string };
  energy: VedicTask['energyAlignment'];
  priority: VedicTask['priority'];
  frequency: TaskFrequency;
  weekdays?: number[];
  dueTime: string;
  muhurtaKey: MuhurtaKey;
  ringtoneId: string;
  tags: string[];
}

export const SADHANA_PRESETS: SadhanaPreset[] = [
  {
    id: 'p-surya',
    title: { or: 'ସୂର୍ଯ୍ୟ ନମସ୍କାର ଓ ଗାୟତ୍ରୀ ଜପ', hi: 'सूर्य नमस्कार एवं गायत्री जप', en: 'Surya Namaskar & Gayatri Japa' },
    energy: 'Sattva',
    priority: 'high',
    frequency: 'daily',
    dueTime: '06:00 AM',
    muhurtaKey: 'brahma',
    ringtoneId: 'bell',
    tags: ['Sadhana', 'Surya', 'Daily'],
  },
  {
    id: 'p-brahma',
    title: { or: 'ବ୍ରାହ୍ମ ମୁହୂର୍ତ୍ତ ପ୍ରାଣାୟାମ ଓ ଧ୍ୟାନ', hi: 'ब्राह्म मुहूर्त प्राणायाम व ध्यान', en: 'Brahma Muhurta Dhyana & Pranayama' },
    energy: 'Sattva',
    priority: 'high',
    frequency: 'daily',
    dueTime: '04:30 AM',
    muhurtaKey: 'brahma',
    ringtoneId: 'om',
    tags: ['BrahmaMuhurta', 'Dhyana'],
  },
  {
    id: 'p-tulasi',
    title: { or: 'ପ୍ରାତଃ ସ୍ନାନ ଓ ତୁଳସୀ ଜଳଦାନ ପରିକ୍ରମା', hi: 'प्रातः स्नान व तुलसी जलदान परिक्रमा', en: 'Pratah Snana & Tulasi Seva' },
    energy: 'Sattva',
    priority: 'medium',
    frequency: 'daily',
    dueTime: '07:00 AM',
    muhurtaKey: 'any',
    ringtoneId: 'shankha',
    tags: ['Tulasi', 'NityaKarma'],
  },
  {
    id: 'p-shiva-mon',
    title: { or: 'ସୋମବାର ଶିବ ଲିଙ୍ଗ ଜଳାଭିଷେକ ଓ ସ୍ତୋତ୍ର', hi: 'सोमवार शिव अभिषेक व स्तोत्र पाठ', en: 'Monday Shiva Abhisheka & Stotra' },
    energy: 'Sattva',
    priority: 'high',
    frequency: 'weekly',
    weekdays: [1], // Monday
    dueTime: '07:30 AM',
    muhurtaKey: 'any',
    ringtoneId: 'damaru',
    tags: ['Shiva', 'Somavara'],
  },
  {
    id: 'p-lakshmi-thu',
    title: { or: 'ଗୁରୁବାର ମହାଲକ୍ଷ୍ମୀ ପୁରାଣ ଓ ଦୀପାରାଧନା', hi: 'गुरुवार महालक्ष्मी पूजन व दीप आराधना', en: 'Thursday Mahalakshmi Purana & Deepa' },
    energy: 'Sattva',
    priority: 'high',
    frequency: 'weekly',
    weekdays: [4], // Thursday
    dueTime: '06:00 PM',
    muhurtaKey: 'any',
    ringtoneId: 'chime',
    tags: ['Lakshmi', 'Guruvara'],
  },
  {
    id: 'p-hanuman-sat',
    title: { or: 'ଶନିବାର ଶ୍ରୀ ହନୁମାନ ଚାଳିଶା ଓ ସିନ୍ଦୂର ପୂଜା', hi: 'शनिवार श्री हनुमान चालीसा पाठ', en: 'Saturday Hanuman Chalisa Recitation' },
    energy: 'Sattva',
    priority: 'high',
    frequency: 'weekly',
    weekdays: [6], // Saturday
    dueTime: '08:00 AM',
    muhurtaKey: 'any',
    ringtoneId: 'shankha',
    tags: ['Hanuman', 'Sanivara'],
  },
  {
    id: 'p-abhijit-satkarma',
    title: { or: 'ମାଧ୍ୟାହ୍ନିକ ଅଭିଜିତ୍ ମୁହୂର୍ତ୍ତ ସତ୍‌କର୍ମ ଓ ସମୀକ୍ଷା', hi: 'मध्याह्न अभिजित मुहूर्त सत्कर्म व समीक्षा', en: 'Review Project Contract & Planning' },
    energy: 'Rajas',
    priority: 'high',
    frequency: 'daily',
    dueTime: '11:45 AM',
    muhurtaKey: 'abhijit',
    ringtoneId: 'chime',
    tags: ['Career', 'Abhijit', 'Satkarma'],
  },
  {
    id: 'p-sandhya-deepa',
    title: { or: 'ସାୟଂ ସନ୍ଧ୍ୟା ଆରତୀ ଓ ଦୀପ ପ୍ରଜ୍ୱଳନ', hi: 'सायं संध्या आरती व दीप प्रज्वलन', en: 'Evening Dhyana & Sandhya Vandanam' },
    energy: 'Sattva',
    priority: 'medium',
    frequency: 'daily',
    dueTime: '06:30 PM',
    muhurtaKey: 'any',
    ringtoneId: 'bell',
    tags: ['Sandhya', 'Aarti'],
  },
];
