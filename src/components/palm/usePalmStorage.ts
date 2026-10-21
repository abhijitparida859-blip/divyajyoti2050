// Palm reader persistence: daily streak, history, favorites, mood — localStorage only.
const STORE = {
  STREAK: 'palm_streak',
  LAST: 'palm_last_read',
  HISTORY: 'palm_history',
  FAV: 'palm_favorites',
  MOOD: 'palm_mood',
  NOTIF: 'palm_notif',
} as const;
type Reading = {
  id: string; date: string; lang: string; auto: any | null; out: any | null;
  photo?: string; mood?: string;
};
export function usePalmStorage() {
  const today = () => new Date().toISOString().slice(0, 10);
  const get = <T>(key: string, fallback: T): T => {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
    catch { return fallback; }
  };
  const set = (key: string, value: unknown) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { } };
  const streak = get<number>(STORE.STREAK, 0);
  const lastRead = get<string>(STORE.LAST, '');
  const history = get<Reading[]>(STORE.HISTORY, []);
  const favorites = get<string[]>(STORE.FAV, []);
  const mood = get<string>(STORE.MOOD, '');
  const notif = get<boolean>(STORE.NOTIF, false);
  const streakDay = (d: string) => d === today();
  const incrementStreak = () => {
    const next = streakDay(lastRead) ? streak : (lastRead ? (today() === lastRead ? streak : streak + 1) : 1);
    set(STORE.STREAK, next); set(STORE.LAST, today()); return next;
  };
  const addReading = (r: Omit<Reading, 'id' | 'date'>) => {
    const reading: Reading = { ...r, id: crypto.randomUUID(), date: today() };
    const next = [reading, ...history].slice(0, 50);
    set(STORE.HISTORY, next);
    set(STORE.LAST, today());
    set(STORE.STREAK, streakDay(lastRead) ? streak : streak + 1);
    return reading;
  };
  const toggleFav = (id: string) => {
    const next = favorites.includes(id) ? favorites.filter((x) => x !== id) : [...favorites, id];
    set(STORE.FAV, next);
  };
  const setMood = (m: string) => { set(STORE.MOOD, m); };
  const setNotif = (v: boolean) => { set(STORE.NOTIF, v); };
  return { streak, lastRead, history, favorites, mood, notif, today, incrementStreak, addReading, toggleFav, setMood, setNotif };
}
