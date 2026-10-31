// ============================================================================
//  ODISHA CIVIL TIME (IST) ANCHORING
//  ---------------------------------------------------------------------------
//  An Odia Panjika day must always be resolved in Indian Standard Time
//  (UTC + 05:30) — the civil time of Odisha / Srikshetra Puri — never in the
//  timezone of the host machine. Browsers, CI runners and containers often run
//  in UTC (or any other zone), and relying on the host offset shifts sunrise,
//  the solar day, sankranti and even the weekday by one civil day.
//
//  Rules used throughout the Panjika engines:
//   • The *civil date* the caller asks about is read with the local Date
//     getters, so `new Date(2026, 5, 15)` always means 15 June 2026 in every
//     timezone.
//   • Every astronomical instant (sunrise, purvahna, nishitha, …) is built
//     from that civil date plus an IST wall-clock minute offset.
//   • Every clock string shown to the user is formatted in IST.
//  Astronomical formulas themselves are untouched — only the civil-time
//  anchoring lives here.
// ============================================================================

export const IST_OFFSET_MINUTES = 330; // UTC + 05:30
export const IST_OFFSET_MS = IST_OFFSET_MINUTES * 60 * 1000;
export const MINUTES_PER_DAY = 1440;

export interface CivilDateParts {
  year: number;  // full year, e.g. 2026
  month: number; // 0-indexed month (0 = January)
  day: number;   // day of month (1-based)
}

/** Civil (calendar) date the caller is asking about — host timezone independent. */
export function getCivilDateParts(date: Date): CivilDateParts {
  return { year: date.getFullYear(), month: date.getMonth(), day: date.getDate() };
}

/** Date-only carrier (local midnight) for a civil date. */
export function civilDate(year: number, month: number, day: number): Date {
  return new Date(year, month, day);
}

/** Shifts a civil date by whole days (rollover safe, no DST arithmetic). */
export function addCivilDays(base: CivilDateParts, deltaDays: number): CivilDateParts {
  const shifted = new Date(Date.UTC(base.year, base.month, base.day + deltaDays));
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth(),
    day: shifted.getUTCDate()
  };
}

/** Weekday of a civil date: 0 = Sunday … 6 = Saturday (timezone independent). */
export function getCivilWeekday(parts: CivilDateParts): number {
  return new Date(Date.UTC(parts.year, parts.month, parts.day)).getUTCDay();
}

/**
 * Absolute instant of an IST wall-clock time on the given civil date.
 * `minutesFromMidnight` is IST minutes (may exceed 1440 or be negative; it is
 * wrapped into the same civil day so Vedic night boundaries stay consistent).
 */
export function istInstantFromMinutes(parts: CivilDateParts, minutesFromMidnight: number = 0): Date {
  const wrapped = ((minutesFromMidnight % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  return new Date(Date.UTC(parts.year, parts.month, parts.day) - IST_OFFSET_MS + wrapped * 60000);
}

/** IST wall-clock minutes (0..1439) of an absolute instant. */
export function getIstClockMinutes(instant: Date): number {
  const shifted = new Date(instant.getTime() + IST_OFFSET_MS);
  return shifted.getUTCHours() * 60 + shifted.getUTCMinutes();
}

/** Civil date of an absolute instant as observed in IST. */
export function getIstCivilDateParts(instant: Date): CivilDateParts {
  const shifted = new Date(instant.getTime() + IST_OFFSET_MS);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth(),
    day: shifted.getUTCDate()
  };
}

/** Civil date of an absolute instant as observed in an arbitrary timezone offset. */
export function getCivilDatePartsIn(instant: Date, timezoneOffsetMinutes: number): CivilDateParts {
  const shifted = new Date(instant.getTime() + timezoneOffsetMinutes * 60000);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth(),
    day: shifted.getUTCDate()
  };
}

/** Formats an absolute instant as an IST 12-hour clock string, e.g. "05:12 AM". */
export function formatIstClock(instant: Date): string {
  const shifted = new Date(instant.getTime() + IST_OFFSET_MS);
  const hours = shifted.getUTCHours();
  const minutes = shifted.getUTCMinutes();
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * True when the Date sits exactly on a local midnight, i.e. it was created as a
 * pure date carrier such as `new Date(2026, 5, 15)` rather than a real instant.
 * Carriers mean "this civil date", so they are resolved to IST midnight of that
 * date instead of the host's midnight.
 */
export function isDateCarrier(date: Date): boolean {
  return date.getHours() === 0
    && date.getMinutes() === 0
    && date.getSeconds() === 0
    && date.getMilliseconds() === 0;
}

/** Wall-clock minutes (0..1439) of an instant in the given timezone offset. */
export function getClockMinutesIn(instant: Date, timezoneOffsetMinutes: number): number {
  const shiftedMs = instant.getTime() + timezoneOffsetMinutes * 60000;
  const withinDay = ((shiftedMs % 86400000) + 86400000) % 86400000;
  return withinDay / 60000;
}
