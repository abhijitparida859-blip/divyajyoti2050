import { describe, it } from 'vitest';
import { calculatePlanetaryPositions, normalizeDegrees } from '../core/astronomy/ephemeris';
import { calculateSunTimes } from '../core/astronomy/solar_lunar';
import { calculateOdiaCalendarDay } from '../core/panjika/odia_calendar_engine';

const PURI_LAT = 20.2961;
const PURI_LON = 85.8245;

function sunriseMinutes(date: Date, lat: number, lon: number): number {
  const st = calculateSunTimes(date, lat, lon);
  const [hm, p] = st.sunrise.split(' ');
  const [h, m] = hm.split(':').map(Number);
  let total = (h % 12) * 60 + m;
  if (p === 'PM') total += 720;
  return total;
}

function tithiAt(date: Date): { tithi: number; paksha: string; el: number } {
  const p = calculatePlanetaryPositions(date);
  const el = normalizeDegrees(p.moon - p.sun);
  const tithi = Math.floor(el / 12) + 1;
  return { tithi, paksha: tithi <= 15 ? 'Shukla' : 'Krishna', el };
}

describe('DIAG37', () => {
  it('1975 July kshaya check: is any sunrise inside Shukla Dwitiya?', () => {
    // New moon (amavasya) ~ 1975-07-09 04:10 UTC per Meeus/engine
    // Shukla Dwitiya = elongation 12..24 deg
    for (let day = 8; day <= 12; day++) {
      const d = new Date(1975, 6, day); // July
      const sm = sunriseMinutes(d, PURI_LAT, PURI_LON);
      const sunriseDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(),
        Math.floor(sm / 60), sm % 60, 0);
      const { tithi, paksha, el } = tithiAt(sunriseDate);
      console.log(`K|1975-07-${day} sunrise=${sunriseDate.toISOString()} el=${el.toFixed(3)} tithi=${tithi} ${paksha}`);
    }
    console.log('K|Dwitiya span ~ 1975-07-10 03:40Z to 1975-07-11 03:10Z (el 12..24)');
  });

  it('1975 Ratha Yatra scan (June 15 - July 25) via engine', () => {
    for (let month = 5; month <= 6; month++) {
      const maxDays = month === 5 ? 30 : 25;
      const startDay = month === 5 ? 15 : 1;
      for (let day = startDay; day <= maxDays; day++) {
        const d = new Date(1975, month, day);
        const info = calculateOdiaCalendarDay(d);
        const ratha = info.festivals.some((f: any) => f.id === 'ratha_yatra');
        const p = info.panjika.tithi;
        console.log(`K|1975-0${month + 1}-${day} tithi=${p.number} ${p.paksha} ratha=${ratha} fest=${info.festivals.map((f:any)=>f.id).join(',')}`);
      }
    }
  });
});
