import { calculatePlanetaryPositions, normalizeDegrees } from '../astronomy/ephemeris';
import { calculateSunTimes } from '../astronomy/solar_lunar';
import { DayPanjika, TithiInfo, NakshatraInfo, YogaInfo, KaranaInfo } from '../../types/panjika';
import { calculateMuhurtas } from './muhurta';

export const NAKSHATRA_NAMES = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

export const NAKSHATRA_RULERS = [
  'Ketu', 'Shukra', 'Surya', 'Chandra', 'Mangala', 'Rahu',
  'Guru', 'Shani', 'Budha', 'Ketu', 'Shukra', 'Surya',
  'Chandra', 'Mangala', 'Rahu', 'Guru', 'Shani', 'Budha',
  'Ketu', 'Shukra', 'Surya', 'Chandra', 'Mangala', 'Rahu',
  'Guru', 'Shani', 'Budha'
];

export const NAKSHATRA_DEITIES = [
  'Ashwini Kumaras', 'Yama', 'Agni', 'Brahma', 'Soma',
  'Rudra', 'Aditi', 'Brihaspati', 'Sarpa (Naga)',
  'Pitris', 'Bhaga', 'Aryaman', 'Savitar (Surya)',
  'Tvashtar (Vishwakarma)', 'Vayu', 'Indragni', 'Mitra',
  'Indra', 'Nirrti', 'Apas (Varuna)', 'Vishvedeva',
  'Vishnu', 'Vasu', 'Varuna', 'Ajaikapada',
  'Ahirbudhnya', 'Pushan'
];

export const YOGA_NAMES = [
  'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda',
  'Sukarma', 'Dhriti', 'Shoola', 'Ganda', 'Vriddhi', 'Dhruva',
  'Vyaghata', 'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyan',
  'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla',
  'Brahma', 'Indra', 'Vaidhriti'
];

export const CHARA_KARANAS = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti'];

export const TITHI_NAMES = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima'
];

export const WEEKDAYS = ['Ravivara', 'Somavara', 'Mangalavara', 'Budhavara', 'Guruvara', 'Shukravara', 'Shanivara'];

export function calculatePanjika(date: Date = new Date(), latitude: number = 28.6139, longitude: number = 77.2090): DayPanjika {
  const planets = calculatePlanetaryPositions(date);
  const sunTimes = calculateSunTimes(date, latitude, longitude);

  // 1. Tithi Calculation
  const moonSunDiff = normalizeDegrees(planets.moon - planets.sun);
  const tithiIndexExact = moonSunDiff / 12; // 0 to 30
  const tithiNumber = Math.floor(tithiIndexExact) + 1;
  const isShukla = tithiNumber <= 15;
  const paksha = isShukla ? 'Shukla' : 'Krishna';
  const tithiNameIndex = (tithiNumber - 1) % 15;
  let tithiName = TITHI_NAMES[tithiNameIndex];
  if (!isShukla && tithiNumber === 30) {
    tithiName = 'Amavasya';
  }

  const tithiPercentage = Math.round((1 - (tithiIndexExact - Math.floor(tithiIndexExact))) * 100);

  // Compute approximate tithi end time:
  // Moon-Sun elongation rate ≈ 12.19° / day, each tithi = 12°
  // Remaining fraction → hours until next tithi boundary
  const tithiFraction = tithiIndexExact - Math.floor(tithiIndexExact);
  const remainingFraction = 1 - tithiFraction;
  const hoursUntilEnd = remainingFraction * (12 / 12.19) * 24; // ~23.6h per tithi
  const endDate = new Date(date.getTime() + hoursUntilEnd * 3600000);
  const eH = endDate.getHours();
  const eM = endDate.getMinutes();
  const ePeriod = eH >= 12 ? 'PM' : 'AM';
  const eDispH = eH % 12 === 0 ? 12 : eH % 12;
  const tithiEndTime = `${eDispH.toString().padStart(2, '0')}:${eM.toString().padStart(2, '0')} ${ePeriod}`;

  const tithi: TithiInfo = {
    number: tithiNumber,
    nameKey: `${paksha} ${tithiName}`,
    paksha,
    percentage: tithiPercentage,
    endTime: tithiEndTime
  };

  // 2. Nakshatra Calculation (13° 20' = 13.333333°)
  const nakshatraSpan = 360 / 27; // 13.333333
  const nakshatraExact = planets.moon / nakshatraSpan;
  const nakshatraIndex = Math.floor(nakshatraExact); // 0 to 26
  const nakshatraNumber = nakshatraIndex + 1;
  const pada = Math.floor((nakshatraExact - nakshatraIndex) * 4) + 1;
  const nakshatraPercentage = Math.round((1 - (nakshatraExact - nakshatraIndex)) * 100);

  const nakshatra: NakshatraInfo = {
    number: nakshatraNumber,
    nameKey: NAKSHATRA_NAMES[nakshatraIndex],
    pada,
    ruler: NAKSHATRA_RULERS[nakshatraIndex],
    deity: NAKSHATRA_DEITIES[nakshatraIndex],
    percentage: nakshatraPercentage
  };

  // 3. Yoga Calculation
  const sunMoonSum = normalizeDegrees(planets.sun + planets.moon);
  const yogaIndex = Math.floor(sunMoonSum / nakshatraSpan);
  const yoga: YogaInfo = {
    number: yogaIndex + 1,
    nameKey: YOGA_NAMES[yogaIndex % 27]
  };

  // 4. Karana Calculation (half Tithi = 6°)
  const karanaIndex = Math.floor(moonSunDiff / 6);
  let karanaName = '';
  let karanaType: 'chara' | 'sthira' = 'chara';

  if (karanaIndex === 0) {
    karanaName = 'Kintughna';
    karanaType = 'sthira';
  } else if (karanaIndex >= 57) {
    const sthiraKaranas = ['Shakuni', 'Chatushpada', 'Naga', 'Kintughna'];
    karanaName = sthiraKaranas[karanaIndex - 57];
    karanaType = 'sthira';
  } else {
    karanaName = CHARA_KARANAS[(karanaIndex - 1) % 7];
  }

  const karana: KaranaInfo = {
    number: karanaIndex + 1,
    nameKey: karanaName,
    type: karanaType
  };

  // 5. Muhurtas
  const muhurtas = calculateMuhurtas(date, sunTimes.sunrise, sunTimes.sunset);

  // 6. Moon Phase (0 = Amavasya, 0.5 = Ashtami, 1 = Purnima)
  const moonPhase = Math.abs(1 - Math.abs((moonSunDiff - 180) / 180));

  // 7. Notable Vedic Festivals & Tithis
  const festivals: string[] = [];
  if (tithiNumber === 11 || tithiNumber === 26) festivals.push('Ekadashi Vrata');
  if (tithiNumber === 13 || tithiNumber === 28) festivals.push('Pradosha Vrata');
  if (tithiNumber === 14 && !isShukla) festivals.push('Maha Shivaratri / Masik Shivaratri');
  if (tithiNumber === 15) festivals.push('Satyanarayan Purnima');
  if (tithiNumber === 30) festivals.push('Darsha Amavasya');

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');

  // Dynamic Astronomical Moonrise Calculation from Moon-Sun Elongation
  const [sunriseHM, sunrisePeriod] = sunTimes.sunrise.split(' ');
  const [sH, sM] = sunriseHM.split(':').map(Number);
  let sunriseTotalMinutes = (sH % 12) * 60 + sM;
  if (sunrisePeriod === 'PM') sunriseTotalMinutes += 720;

  const moonriseTotalMinutes = Math.round((sunriseTotalMinutes + (moonSunDiff / 360) * 1440) % 1440);
  const mH = Math.floor(moonriseTotalMinutes / 60);
  const mM = moonriseTotalMinutes % 60;
  const moonrisePeriod = mH >= 12 ? 'PM' : 'AM';
  const moonriseDisplayHours = mH % 12 === 0 ? 12 : mH % 12;
  const calculatedMoonrise = `${moonriseDisplayHours.toString().padStart(2, '0')}:${mM.toString().padStart(2, '0')} ${moonrisePeriod}`;

  return {
    date: `${y}-${m}-${d}`,
    tithi,
    nakshatra,
    yoga,
    karana,
    vaara: WEEKDAYS[date.getDay()],
    sunrise: sunTimes.sunrise,
    sunset: sunTimes.sunset,
    moonrise: calculatedMoonrise,
    moonPhase,
    ayanamsa: planets.ayanamsa,
    muhurtas,
    festivals
  };
}
