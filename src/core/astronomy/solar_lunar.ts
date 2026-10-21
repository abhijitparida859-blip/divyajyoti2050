import { toRadians, toDegrees, normalizeDegrees } from './ephemeris';

export interface SunTimes {
  sunrise: string;
  sunset: string;
  solarNoon: string;
  dayLengthMinutes: number;
}

/**
 * Accurate Sunrise / Sunset Calculation using NOAA Solar Formulas
 */
export function calculateSunTimes(date: Date, latitude: number, longitude: number): SunTimes {
  const startOfYear = new Date(Date.UTC(date.getFullYear(), 0, 1));
  const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / 86400000) + 1;

  // Fractional year in radians
  const gamma = (2 * Math.PI / 365) * (dayOfYear - 1 + (date.getHours() - 12) / 24);

  // Equation of time in minutes
  const eqtime = 229.18 * (0.000075 + 0.001868 * Math.cos(gamma) - 0.032077 * Math.sin(gamma)
    - 0.014615 * Math.cos(2 * gamma) - 0.040849 * Math.sin(2 * gamma));

  // Solar declination angle in radians
  const decl = 0.006918 - 0.399912 * Math.cos(gamma) + 0.070257 * Math.sin(gamma)
    - 0.006758 * Math.cos(2 * gamma) + 0.000907 * Math.sin(2 * gamma);

  // Hour angle for sunrise/sunset (solar zenith = 90.833° for atmospheric refraction)
  const zenithRad = toRadians(90.833);
  const latRad = toRadians(latitude);

  const cosHA = (Math.cos(zenithRad) / (Math.cos(latRad) * Math.cos(decl))) - (Math.tan(latRad) * Math.tan(decl));

  let haDeg = 90;
  if (cosHA >= 1) {
    haDeg = 0; // Polar night
  } else if (cosHA <= -1) {
    haDeg = 180; // Midnight sun
  } else {
    haDeg = toDegrees(Math.acos(cosHA));
  }

  // Solar noon in UTC minutes
  const solarNoonUTC = 720 - 4 * longitude - eqtime;
  const timezoneOffsetMinutes = -date.getTimezoneOffset(); // local offset

  const sunriseMinutes = solarNoonUTC - haDeg * 4 + timezoneOffsetMinutes;
  const sunsetMinutes = solarNoonUTC + haDeg * 4 + timezoneOffsetMinutes;
  const noonMinutes = solarNoonUTC + timezoneOffsetMinutes;

  function minutesToTimeString(totalMinutes: number): string {
    let m = Math.round(totalMinutes) % 1440;
    if (m < 0) m += 1440;
    const hours = Math.floor(m / 60);
    const mins = m % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${displayHours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${period}`;
  }

  return {
    sunrise: minutesToTimeString(sunriseMinutes),
    sunset: minutesToTimeString(sunsetMinutes),
    solarNoon: minutesToTimeString(noonMinutes),
    dayLengthMinutes: Math.round(haDeg * 8)
  };
}
