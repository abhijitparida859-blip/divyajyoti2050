import { MuhurtaWindow } from '../../types/panjika';

function parseTimeToMinutes(timeStr: string): number {
  const parts = timeStr.trim().split(/[:\s]/);
  let hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const period = parts[2]?.toUpperCase();

  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

function formatMinutesToTime(totalMinutes: number): string {
  let m = Math.round(totalMinutes) % 1440;
  if (m < 0) m += 1440;
  const hours = Math.floor(m / 60);
  const mins = m % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${period}`;
}

export function calculateMuhurtas(date: Date, sunriseStr: string, sunsetStr: string) {
  const sunriseMin = parseTimeToMinutes(sunriseStr);
  const sunsetMin = parseTimeToMinutes(sunsetStr);
  const dayDuration = (sunsetMin - sunriseMin + 1440) % 1440;
  const eighthPart = dayDuration / 8;

  const weekday = date.getDay(); // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat

  // Classical Rahu Kaalam 1/8th Segment by Weekday
  // Sun: 8th, Mon: 2nd, Tue: 7th, Wed: 5th, Thu: 6th, Fri: 4th, Sat: 3rd
  const rahuPeriods = [8, 2, 7, 5, 6, 4, 3];
  const rahuPart = rahuPeriods[weekday] - 1;
  const rahuStart = sunriseMin + rahuPart * eighthPart;
  const rahuEnd = rahuStart + eighthPart;

  // Yamaganda Periods
  // Sun: 5th, Mon: 4th, Tue: 3rd, Wed: 2nd, Thu: 1st, Fri: 7th, Sat: 6th
  const yamaPeriods = [5, 4, 3, 2, 1, 7, 6];
  const yamaPart = yamaPeriods[weekday] - 1;
  const yamaStart = sunriseMin + yamaPart * eighthPart;
  const yamaEnd = yamaStart + eighthPart;

  // Gulika Kaal Periods
  // Sun: 7th, Mon: 6th, Tue: 5th, Wed: 4th, Thu: 3rd, Fri: 2nd, Sat: 1st
  const gulikaPeriods = [7, 6, 5, 4, 3, 2, 1];
  const gulikaPart = gulikaPeriods[weekday] - 1;
  const gulikaStart = sunriseMin + gulikaPart * eighthPart;
  const gulikaEnd = gulikaStart + eighthPart;

  // Abhijit Muhurta (8th of 15 muhurtas of daytime, ~midday)
  const fifteenthPart = dayDuration / 15;
  const abhijitStart = sunriseMin + 7 * fifteenthPart;
  const abhijitEnd = abhijitStart + fifteenthPart;

  // Brahma Muhurta (~96 min to 48 min before sunrise)
  const brahmaStart = sunriseMin - 96;
  const brahmaEnd = sunriseMin - 48;

  return {
    rahuKaal: {
      nameKey: 'Rahu Kaalam',
      start: formatMinutesToTime(rahuStart),
      end: formatMinutesToTime(rahuEnd),
      isAuspicious: false
    },
    yamaganda: {
      nameKey: 'Yamaganda',
      start: formatMinutesToTime(yamaStart),
      end: formatMinutesToTime(yamaEnd),
      isAuspicious: false
    },
    gulika: {
      nameKey: 'Gulika Kaal',
      start: formatMinutesToTime(gulikaStart),
      end: formatMinutesToTime(gulikaEnd),
      isAuspicious: true
    },
    abhijit: {
      nameKey: 'Abhijit Muhurta',
      start: formatMinutesToTime(abhijitStart),
      end: formatMinutesToTime(abhijitEnd),
      isAuspicious: weekday !== 3 // Avoided on Wednesday
    },
    brahmaMuhurta: {
      nameKey: 'Brahma Muhurta',
      start: formatMinutesToTime(brahmaStart),
      end: formatMinutesToTime(brahmaEnd),
      isAuspicious: true
    }
  };
}
