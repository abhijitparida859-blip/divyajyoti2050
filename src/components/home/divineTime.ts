// Shared clock helpers for the advanced front-page widgets
// (command center + choghadiya). Solar engine emits "05:40 AM" strings.

/** Parses "05:40 AM" style strings into 24h parts. */
export function parseClock(timeStr: string): { h: number; m: number } | null {
  const match = /(\d{1,2}):(\d{2})\s*(AM|PM)/i.exec(timeStr || '');
  if (!match) return null;
  let h = parseInt(match[1], 10) % 12;
  if (match[3].toUpperCase() === 'PM') h += 12;
  return { h, m: parseInt(match[2], 10) };
}

/** Converts a same-day "hh:mm AM" string into a Date on the given base day. */
export function clockToDate(base: Date, timeStr: string): Date | null {
  const c = parseClock(timeStr);
  if (!c) return null;
  const d = new Date(base);
  d.setHours(c.h, c.m, 0, 0);
  return d;
}

/** Formats a Date back into "hh:mm AM" (for choghadiya slot labels). */
export function toClockLabel(d: Date): string {
  const h24 = d.getHours();
  const period = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${String(h12).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} ${period}`;
}

export function pad2(n: number): string {
  return String(Math.max(0, Math.floor(n))).padStart(2, '0');
}
