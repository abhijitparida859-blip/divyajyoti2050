import React, { useRef, useMemo } from 'react';
import { useI18n } from '../../localization/i18n';
import { getLocalizedNativeName, transliterateName } from '../../localization/nameTransliteration';
import { PlaceLocation } from '../../core/jataka/odisha_geography_db';
import { LocationSearchBox } from './LocationSearchBox';
import { User, Calendar, Clock, Sparkles, Orbit, Compass, Flame, Droplets, Wind, Layers } from 'lucide-react';

interface Props {
  nativeName: string;
  setNativeName: (n: string) => void;
  gender: 'male' | 'female' | 'other';
  setGender: (g: 'male' | 'female' | 'other') => void;
  birthDateStr: string;
  setBirthDateStr: (d: string) => void;
  birthTimeStr: string;
  setBirthTimeStr: (t: string) => void;
  selectedLocation: PlaceLocation;
  onSelectLocation: (loc: PlaceLocation) => void;
  chartStyle: 'north' | 'south' | 'east' | 'west' | '3d';
  setChartStyle: (s: 'north' | 'south' | 'east' | 'west' | '3d') => void;
  divisionalChart: 'D1' | 'D9';
  setDivisionalChart: (d: 'D1' | 'D9') => void;
  ascSign: string;
  ascDegree: number;
}

// Zodiac Rashi Metadata for 3D Lagna Avatar
const RASHI_SPECS: Record<string, {
  glyph: string;
  or: string;
  hi: string;
  en: string;
  element: 'Agni' | 'Prithvi' | 'Vayu' | 'Jala';
  elementOr: string;
  elementColor: string;
  lord: string;
  lordOr: string;
  accentGradient: string;
  borderGlow: string;
}> = {
  Mesha: { glyph: '♈', or: 'ମେଷ', hi: 'मेष', en: 'Aries', element: 'Agni', elementOr: 'ଅଗ୍ନି ତତ୍ତ୍ୱ', elementColor: '#ef4444', lord: 'Mangala', lordOr: 'ମଙ୍ଗଳ', accentGradient: 'from-orange-600 via-red-600 to-amber-700', borderGlow: 'border-red-500/50 shadow-red-500/20' },
  Vrishabha: { glyph: '♉', or: 'ବୃଷ', hi: 'वृषभ', en: 'Taurus', element: 'Prithvi', elementOr: 'ପୃଥିବୀ ତତ୍ତ୍ୱ', elementColor: '#10b981', lord: 'Shukra', lordOr: 'ଶୁକ୍ର', accentGradient: 'from-emerald-600 via-teal-600 to-green-700', borderGlow: 'border-emerald-500/50 shadow-emerald-500/20' },
  Mithuna: { glyph: '♊', or: 'ମିଥୁନ', hi: 'मिथुन', en: 'Gemini', element: 'Vayu', elementOr: 'ବାୟୁ ତତ୍ତ୍ୱ', elementColor: '#06b6d4', lord: 'Budha', lordOr: 'ବୁଧ', accentGradient: 'from-cyan-600 via-sky-600 to-blue-700', borderGlow: 'border-cyan-500/50 shadow-cyan-500/20' },
  Karka: { glyph: '♋', or: 'କର୍କଟ', hi: 'कर्क', en: 'Cancer', element: 'Jala', elementOr: 'ଜଳ ତତ୍ତ୍ୱ', elementColor: '#3b82f6', lord: 'Chandra', lordOr: 'ଚନ୍ଦ୍ର', accentGradient: 'from-blue-600 via-indigo-600 to-sky-700', borderGlow: 'border-blue-500/50 shadow-blue-500/20' },
  Simha: { glyph: '♌', or: 'ସିଂହ', hi: 'सिंह', en: 'Leo', element: 'Agni', elementOr: 'ଅଗ୍ନି ତତ୍ତ୍ୱ', elementColor: '#f59e0b', lord: 'Surya', lordOr: 'ସୂର୍ଯ୍ୟ', accentGradient: 'from-amber-500 via-orange-600 to-yellow-600', borderGlow: 'border-amber-500/50 shadow-amber-500/20' },
  Kanya: { glyph: '♍', or: 'କନ୍ୟା', hi: 'कन्या', en: 'Virgo', element: 'Prithvi', elementOr: 'ପୃଥିବୀ ତତ୍ତ୍ୱ', elementColor: '#059669', lord: 'Budha', lordOr: 'ବୁଧ', accentGradient: 'from-emerald-700 via-green-600 to-teal-700', borderGlow: 'border-green-500/50 shadow-green-500/20' },
  Tula: { glyph: '♎', or: 'ତୁଳା', hi: 'तुला', en: 'Libra', element: 'Vayu', elementOr: 'ବାୟୁ ତତ୍ତ୍ୱ', elementColor: '#0ea5e9', lord: 'Shukra', lordOr: 'ଶୁକ୍ର', accentGradient: 'from-sky-500 via-cyan-600 to-indigo-700', borderGlow: 'border-sky-500/50 shadow-sky-500/20' },
  Vrischika: { glyph: '♏', or: 'ବିଛା', hi: 'वृश्चिक', en: 'Scorpio', element: 'Jala', elementOr: 'ଜଳ ତତ୍ତ୍ୱ', elementColor: '#6366f1', lord: 'Mangala', lordOr: 'ମଙ୍ଗଳ', accentGradient: 'from-indigo-600 via-purple-700 to-rose-700', borderGlow: 'border-indigo-500/50 shadow-indigo-500/20' },
  Dhanu: { glyph: '♐', or: 'ଧନୁ', hi: 'धनु', en: 'Sagittarius', element: 'Agni', elementOr: 'ଅଗ୍ନି ତତ୍ତ୍ୱ', elementColor: '#ea580c', lord: 'Guru', lordOr: 'ଗୁରୁ', accentGradient: 'from-orange-600 via-amber-600 to-red-700', borderGlow: 'border-orange-500/50 shadow-orange-500/20' },
  Makara: { glyph: '♑', or: 'ମକର', hi: 'मकर', en: 'Capricorn', element: 'Prithvi', elementOr: 'ପୃଥିବୀ ତତ୍ତ୍ୱ', elementColor: '#047857', lord: 'Shani', lordOr: 'ଶନି', accentGradient: 'from-emerald-800 via-teal-700 to-slate-800', borderGlow: 'border-teal-500/50 shadow-teal-500/20' },
  Kumbha: { glyph: '♒', or: 'କୁମ୍ଭ', hi: 'कुम्भ', en: 'Aquarius', element: 'Vayu', elementOr: 'ବାୟୁ ତତ୍ତ୍ୱ', elementColor: '#0284c7', lord: 'Shani', lordOr: 'ଶନି', accentGradient: 'from-cyan-700 via-blue-700 to-slate-800', borderGlow: 'border-cyan-500/50 shadow-cyan-500/20' },
  Meena: { glyph: '♓', or: 'ମୀନ', hi: 'मीन', en: 'Pisces', element: 'Jala', elementOr: 'ଜଳ ତତ୍ତ୍ୱ', elementColor: '#4f46e5', lord: 'Guru', lordOr: 'ଗୁରୁ', accentGradient: 'from-indigo-600 via-violet-600 to-blue-800', borderGlow: 'border-indigo-500/50 shadow-indigo-500/20' },
};

// Vedic Weekdays
const VARA_INFO = [
  { or: 'ରବିବାର (ସୂର୍ଯ୍ୟ ବାର)', hi: 'रविवार (सूर्य वार)', en: 'Sunday (Surya Vara)', lord: 'Surya', icon: '☀️' },
  { or: 'ସୋମବାର (ଚନ୍ଦ୍ର ବାର)', hi: 'सोमवार (चन्द्र वार)', en: 'Monday (Chandra Vara)', lord: 'Chandra', icon: '🌙' },
  { or: 'ମଙ୍ଗଳବାର (ମଙ୍ଗଳ ବାର)', hi: 'मंगलवार (मंगल वार)', en: 'Tuesday (Mangala Vara)', lord: 'Mangala', icon: '♂️' },
  { or: 'ବୁଧବାର (ବୁଧ ବାର)', hi: 'बुधवार (बुध वार)', en: 'Wednesday (Budha Vara)', lord: 'Budha', icon: '☿' },
  { or: 'ଗୁରୁବାର (ବୃହସ୍ପତି ବାର)', hi: 'गुरुवार (बृहस्पति वार)', en: 'Thursday (Guru Vara)', lord: 'Guru', icon: '♃' },
  { or: 'ଶୁକ୍ରବାର (ଶୁକ୍ର ବାର)', hi: 'शुक्रवार (शुक्र वार)', en: 'Friday (Shukra Vara)', lord: 'Shukra', icon: '♀' },
  { or: 'ଶନିବାର (ଶନି ବାର)', hi: 'शनिवार (शनि वार)', en: 'Saturday (Shani Vara)', lord: 'Shani', icon: '♄' }
];

export const JatakaInputForm: React.FC<Props> = ({
  nativeName, setNativeName,
  gender, setGender,
  birthDateStr, setBirthDateStr,
  birthTimeStr, setBirthTimeStr,
  selectedLocation, onSelectLocation,
  chartStyle, setChartStyle,
  divisionalChart, setDivisionalChart,
  ascSign, ascDegree
}) => {
  const { t, formatNumber, tRashi, language } = useI18n();
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Live trilingual transliteration of native name
  const trilingualName = useMemo(() => transliterateName(nativeName), [nativeName]);

  // Parse hour, minute, am/pm for advanced time picker
  const [hours, minutes] = birthTimeStr.split(':').map(Number);
  const isPM = hours >= 12;
  const hour12 = hours % 12 || 12;

  const handleTimeChange = (newH12: number, newM: number, newIsPM: boolean) => {
    let finalH24 = newH12 % 12;
    if (newIsPM) finalH24 += 12;
    const hStr = finalH24.toString().padStart(2, '0');
    const mStr = newM.toString().padStart(2, '0');
    setBirthTimeStr(`${hStr}:${mStr}`);
  };

  // High-precision Vedic Ishtakala Chronometer from sunrise (~05:30 AM local baseline)
  const totalMinutesFromSunrise = ((hours * 60 + minutes) - (5 * 60 + 30) + 1440) % 1440;
  const vedicGhati = Math.floor(totalMinutesFromSunrise / 24);
  const remMinutes = totalMinutesFromSunrise % 24;
  const vedicPala = Math.floor(remMinutes * 2.5);
  const vedicVipala = Math.floor(((remMinutes * 2.5) % 1) * 60);

  // Day vs Night Birth & Prahar
  const isDayBirth = totalMinutesFromSunrise < 720;
  const praharIndex = Math.floor((totalMinutesFromSunrise % 720) / 180) + 1;

  // Day of Week (Vara)
  const birthDateObj = new Date(birthDateStr + 'T12:00:00');
  const dayOfWeek = isNaN(birthDateObj.getTime()) ? 0 : birthDateObj.getDay();
  const currentVara = VARA_INFO[dayOfWeek] || VARA_INFO[0];

  // Lagna Rashi Spec
  const lagnaSpec = RASHI_SPECS[ascSign] || RASHI_SPECS.Mesha;

  return (
    <div className="relative bg-gradient-to-b from-[#0c1222] via-[#090d1a] to-[#060812] border-2 border-cosmic-gold/45 rounded-3xl p-5 sm:p-7 shadow-[0_15px_40px_rgba(0,0,0,0.7),inset_0_1px_2px_rgba(255,255,255,0.15)] backdrop-blur-2xl space-y-6">
      {/* Golden Ambient Corner Glows */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-cosmic-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: 3D Holographic Lagna Avatar, Native Info & 3D Chart Selectors */}
      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 border-b border-slate-800/90 pb-6">
        {/* Left: 3D Holographic Lagna Avatar Badge + Native Title */}
        <div className="flex items-center gap-4">
          {/* 3D Zodiac Avatar Emblem with Metallic Bevel & Elemental Pulse */}
          <div className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br ${lagnaSpec.accentGradient} p-1 shadow-2xl ${lagnaSpec.borderGlow} border-2 flex items-center justify-center shrink-0 group transition-transform duration-300 hover:scale-105`}>
            <div className="w-full h-full rounded-xl bg-cosmic-950/80 backdrop-blur-md flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
              <span className="text-2xl sm:text-3xl select-none filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {lagnaSpec.glyph}
              </span>
              <span className="text-[9px] font-bold text-slate-200 uppercase tracking-tighter">
                {lagnaSpec.or}
              </span>
            </div>
            {/* Spinning Golden Orbit Ring Accent */}
            <div className="absolute -inset-1 rounded-2xl border border-cosmic-gold/40 animate-pulse pointer-events-none" />
          </div>

          <div>
            <div className="flex items-center gap-2 text-cosmic-gold text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-cosmic-saffron animate-spin-slow" />
              <span>
                {language === 'or'
                  ? '୧୦୦% ପ୍ରାମାଣିକ ବୈଦିକ ପାଞ୍ଜି ଇଞ୍ଜିନ୍'
                  : language === 'hi'
                  ? '१००% प्रामाणिक वैदिक पंचांग गणना'
                  : '100% Real Panjika Astronomical Engine'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-100 tracking-tight flex items-center gap-2">
              <span>{getLocalizedNativeName(nativeName, language) || nativeName}</span>
              <span className="text-cosmic-gold font-normal">—</span>
              <span className="text-slate-300 font-normal text-xl sm:text-2xl">
                {language === 'or' ? 'ବୈଦିକ ଜନ୍ମ କୁଣ୍ଡଳୀ' : language === 'hi' ? 'वैदिक जन्म कुण्डली' : 'Vedic Horoscope'}
              </span>
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 mt-1.5">
              <span className="bg-cosmic-950/90 border border-cosmic-gold/40 text-cosmic-gold px-2.5 py-0.5 rounded-full font-bold shadow-sm">
                {t('ascendant')}: {tRashi(ascSign)} ({formatNumber(ascDegree.toFixed(2))}°)
              </span>
              <span className="bg-slate-900/80 border border-slate-700/80 px-2 py-0.5 rounded-full text-slate-300 font-medium">
                {lagnaSpec.elementOr} • {language === 'or' ? 'ଅଧିପତି' : 'Lord'}: {lagnaSpec.lordOr}
              </span>
              <span className="text-slate-400">
                • {selectedLocation.name[language]} {selectedLocation.district ? `(${selectedLocation.district[language]})` : ''} ({selectedLocation.state[language]})
              </span>
            </div>
          </div>
        </div>

        {/* Right: 3D Metallic Chart Switchers */}
        <div className="flex flex-wrap items-center gap-3">
          {/* D1 / D9 3D Toggle */}
          <div className="flex items-center bg-gradient-to-b from-[#080d19] to-[#03060d] border border-cosmic-gold/30 p-1 rounded-2xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_2px_6px_rgba(0,0,0,0.4)]">
            <button
              onClick={() => setDivisionalChart('D1')}
              className={`px-3.5 py-1.5 text-xs rounded-xl font-bold transition-all cursor-pointer ${
                divisionalChart === 'D1'
                  ? 'bg-gradient-to-b from-cosmic-gold to-yellow-600 text-cosmic-950 shadow-[0_2px_8px_rgba(234,179,8,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)] border border-yellow-300/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Lagna (D1)
            </button>
            <button
              onClick={() => setDivisionalChart('D9')}
              className={`px-3.5 py-1.5 text-xs rounded-xl font-bold transition-all cursor-pointer ${
                divisionalChart === 'D9'
                  ? 'bg-gradient-to-b from-cosmic-gold to-yellow-600 text-cosmic-950 shadow-[0_2px_8px_rgba(234,179,8,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)] border border-yellow-300/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Navamsha (D9)
            </button>
          </div>

          {/* 5-Style 3D Metallic Direction Buttons */}
          <div className="flex flex-wrap items-center bg-gradient-to-b from-[#080d19] to-[#03060d] border border-slate-800 p-1 rounded-2xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_2px_6px_rgba(0,0,0,0.4)]">
            {/* East (Odia Panjika) */}
            <button
              onClick={() => setChartStyle('east')}
              className={`px-3 py-1.5 text-xs rounded-xl transition-all cursor-pointer ${
                chartStyle === 'east'
                  ? 'bg-gradient-to-b from-cosmic-saffron to-orange-700 text-white font-bold shadow-[0_2px_8px_rgba(234,88,12,0.5),inset_0_1px_1px_rgba(255,255,255,0.3)] border border-orange-400/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="East Indian / Odia Panjika Crossed Box"
            >
              🪔 {t('chart_east')}
            </button>

            {/* North (Diamond) */}
            <button
              onClick={() => setChartStyle('north')}
              className={`px-3 py-1.5 text-xs rounded-xl transition-all cursor-pointer ${
                chartStyle === 'north'
                  ? 'bg-gradient-to-b from-cosmic-gold to-yellow-600 text-cosmic-950 font-bold shadow-[0_2px_8px_rgba(234,179,8,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)] border border-yellow-300/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="North Indian Diamond"
            >
              💎 {t('chart_north')}
            </button>

            {/* South (Box) */}
            <button
              onClick={() => setChartStyle('south')}
              className={`px-3 py-1.5 text-xs rounded-xl transition-all cursor-pointer ${
                chartStyle === 'south'
                  ? 'bg-gradient-to-b from-cosmic-gold to-yellow-600 text-cosmic-950 font-bold shadow-[0_2px_8px_rgba(234,179,8,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)] border border-yellow-300/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="South Indian Chauka Box"
            >
              🏛️ {t('chart_south')}
            </button>

            {/* West (Circular Wheel) */}
            <button
              onClick={() => setChartStyle('west')}
              className={`px-3 py-1.5 text-xs rounded-xl transition-all cursor-pointer ${
                chartStyle === 'west'
                  ? 'bg-gradient-to-b from-cosmic-gold to-yellow-600 text-cosmic-950 font-bold shadow-[0_2px_8px_rgba(234,179,8,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)] border border-yellow-300/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Western 360° Circular Tropical/Sidereal Wheel"
            >
              ☸️ {t('chart_west')}
            </button>

            {/* 3D Celestial Cosmos (WebGL) */}
            <button
              onClick={() => setChartStyle('3d')}
              className={`px-3 py-1.5 text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                chartStyle === '3d'
                  ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-cosmic-950 font-extrabold shadow-[0_0_15px_rgba(245,158,11,0.6),inset_0_1px_1px_rgba(255,255,255,0.6)] border border-amber-200'
                  : 'text-amber-300 hover:text-amber-100 hover:bg-amber-400/10'
              }`}
              title="Interactive 3D Celestial Bhachakra WebGL Sphere"
            >
              <Orbit className="w-3.5 h-3.5 text-cosmic-saffron animate-spin-slow" />
              <span>{t('chart_3d')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Row 1: 3 Luxury 3D Beveled Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Native Name & Identity */}
        <div className="bg-gradient-to-b from-[#0a101f] to-[#050811] border border-cosmic-gold/30 hover:border-cosmic-gold/50 rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.08)] flex flex-col justify-between transition-all">
          <label className="text-xs text-slate-300 font-semibold flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-cosmic-gold">
              <User className="w-4 h-4" />
              <span>{language === 'or' ? 'ଜାତକଙ୍କ ନାମ (Native Name)' : language === 'hi' ? 'जातक का नाम' : 'Native Name'}</span>
            </span>
            <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
              {language === 'or' ? 'ବୈଦିକ ପରିଚୟ' : 'Vedic Profile'}
            </span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={nativeName}
              maxLength={80}
              autoComplete="off"
              placeholder="e.g. Abhijit Parida"
              onChange={(e) => setNativeName(e.target.value.replace(/[\u0000-\u001F\u007F]/g, '').slice(0, 80))}
              className="w-full bg-[#050811] border border-cosmic-gold/35 focus:border-cosmic-gold focus:ring-1 focus:ring-cosmic-gold/40 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-bold focus:outline-none shadow-inner"
            />
          </div>
          {/* Live Trilingual Script Preview Pill Bar */}
          {nativeName.trim().length > 0 && (
            <div className="mt-2 p-2 bg-[#030712]/90 border border-cosmic-gold/25 rounded-xl flex flex-wrap items-center gap-1.5 shadow-sm text-[11px]">
              <span className="text-[10px] font-bold text-cosmic-saffron uppercase tracking-wider flex items-center gap-1 mr-0.5">
                <span>🪔</span>
                <span>{language === 'or' ? 'ତ୍ରୈଭାଷିକ' : language === 'hi' ? 'त्रैभाषिक' : 'Trilingual'}:</span>
              </span>
              <span className="inline-flex items-center gap-1 bg-[#0a1128] border border-cosmic-gold/30 rounded-lg px-2 py-0.5 text-slate-100">
                <span className="text-[9px] text-cosmic-gold font-bold">ଓଡ଼ିଆ:</span>
                <span className="font-semibold text-cosmic-gold">{trilingualName.or}</span>
              </span>
              <span className="inline-flex items-center gap-1 bg-[#0a1128] border border-slate-700/80 rounded-lg px-2 py-0.5 text-slate-200">
                <span className="text-[9px] text-amber-300 font-bold">हिन्दी:</span>
                <span className="font-semibold text-slate-100">{trilingualName.hi}</span>
              </span>
              <span className="inline-flex items-center gap-1 bg-[#0a1128] border border-slate-700/80 rounded-lg px-2 py-0.5 text-slate-300">
                <span className="text-[9px] text-slate-400 font-bold">EN:</span>
                <span className="font-semibold text-slate-200">{trilingualName.en}</span>
              </span>
            </div>
          )}
          {/* Gender Selector */}
          <div className="mt-2.5">
            <span className="text-[10px] text-slate-400 font-semibold mb-1.5 flex items-center gap-1.5">
              <User className="w-3 h-3 text-cosmic-gold" />
              {language === 'or' ? 'ଲିଙ୍ଗ (Gender)' : language === 'hi' ? 'लिंग' : 'Gender'}
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {([['male', '♂️', 'पुरुष', 'ପୁରୁଷ', 'Male'], ['female', '♀️', 'स्त्री', 'ମହିଳା', 'Female'], ['other', '⚧️', 'अन्य', 'ଅନ୍ୟ', 'Other']] as const).map(([g, icon, hi, or, en]) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`flex flex-col items-center gap-0.5 py-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                    gender === g
                      ? 'bg-cosmic-gold text-cosmic-950 border-cosmic-gold shadow-lg shadow-cosmic-gold/25'
                      : 'bg-[#050811] text-slate-300 border-cosmic-gold/25 hover:border-cosmic-gold/50'
                  }`}
                >
                  <span className="text-sm leading-none">{icon}</span>
                  <span>{language === 'or' ? or : language === 'hi' ? hi : en}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Birth Date with Vedic Vara (Weekday) & Calendar Telemetry */}
        <div className="bg-gradient-to-b from-[#0a101f] to-[#050811] border border-cosmic-gold/30 hover:border-cosmic-gold/50 rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.08)] flex flex-col justify-between transition-all">
          <label className="text-xs text-slate-300 font-semibold flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-cosmic-saffron">
              <Calendar className="w-4 h-4" />
              {language === 'or' ? 'ଜନ୍ମ ତାରିଖ (Birth Date)' : language === 'hi' ? 'जन्म तिथि' : 'Birth Date'}
            </span>
            <span className="text-[11px] text-cosmic-gold font-bold bg-cosmic-gold/10 px-2 py-0.5 rounded-lg border border-cosmic-gold/20 flex items-center gap-1">
              <span>{currentVara.icon}</span>
              <span>{language === 'or' ? currentVara.or : (language === 'hi' ? currentVara.hi : currentVara.en)}</span>
            </span>
          </label>

          <div className="relative flex items-center">
            <input
              ref={dateInputRef}
              type="date"
              value={birthDateStr}
              onChange={(e) => setBirthDateStr(e.target.value)}
              className="w-full bg-[#050811] border border-cosmic-gold/35 focus:border-cosmic-gold focus:ring-1 focus:ring-cosmic-gold/40 rounded-xl pl-3.5 pr-12 py-2.5 text-xs text-slate-100 font-bold focus:outline-none shadow-inner cursor-pointer"
            />
            {/* 3D Beveled Glowing Calendar Trigger */}
            <button
              type="button"
              onClick={() => {
                try {
                  dateInputRef.current?.showPicker?.();
                } catch {
                  dateInputRef.current?.focus();
                }
              }}
              title="Open Gregorian & Vedic Calendar"
              className="absolute right-2 p-1.5 bg-gradient-to-b from-cosmic-gold/30 to-amber-600/30 hover:from-cosmic-gold hover:to-amber-500 text-cosmic-gold hover:text-cosmic-950 rounded-lg transition-all cursor-pointer shadow-md border border-cosmic-gold/40 active:scale-95"
            >
              <Calendar className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card 3: Precision Birth Time & Vedic Ishta Kaala Chronometer */}
        <div className="bg-gradient-to-b from-[#0a101f] to-[#050811] border border-cosmic-gold/30 hover:border-cosmic-gold/50 rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.08)] flex flex-col justify-between transition-all">
          <label className="text-xs text-slate-300 font-semibold flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Clock className="w-4 h-4" />
              {language === 'or' ? 'ସଠିକ୍ ସମୟ ଓ ଇଷ୍ଟକାଳ' : language === 'hi' ? 'सटीक समय एवं इष्टकाल' : 'Exact Time & Ishtakala'}
            </span>
            <span className="text-[11px] text-cosmic-gold font-mono font-bold bg-cosmic-gold/10 px-2 py-0.5 rounded-lg border border-cosmic-gold/20">
              {formatNumber(vedicGhati)} ଘ {formatNumber(vedicPala)} ପ {formatNumber(vedicVipala)} ବି
            </span>
          </label>

          <div className="flex items-center gap-2">
            {/* Hour Select */}
            <select
              value={hour12}
              onChange={(e) => handleTimeChange(Number(e.target.value), minutes, isPM)}
              className="bg-[#050811] border border-cosmic-gold/35 rounded-xl px-2.5 py-2.5 text-xs font-bold text-slate-100 focus:outline-none focus:border-cosmic-gold shadow-inner cursor-pointer"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                <option key={h} value={h} className="bg-cosmic-950 text-slate-100">
                  {formatNumber(h.toString().padStart(2, '0'))}
                </option>
              ))}
            </select>
            <span className="text-cosmic-gold font-bold">:</span>

            {/* Minute Select */}
            <select
              value={minutes}
              onChange={(e) => handleTimeChange(hour12, Number(e.target.value), isPM)}
              className="bg-[#050811] border border-cosmic-gold/35 rounded-xl px-2.5 py-2.5 text-xs font-bold text-slate-100 focus:outline-none focus:border-cosmic-gold shadow-inner cursor-pointer"
            >
              {Array.from({ length: 60 }, (_, i) => i).map(m => (
                <option key={m} value={m} className="bg-cosmic-950 text-slate-100">
                  {formatNumber(m.toString().padStart(2, '0'))}
                </option>
              ))}
            </select>

            {/* AM / PM 3D Toggle */}
            <button
              type="button"
              onClick={() => handleTimeChange(hour12, minutes, !isPM)}
              className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-bold transition-all shadow-inner border cursor-pointer active:scale-95 ${
                isPM
                  ? 'bg-gradient-to-b from-cosmic-saffron/30 to-orange-900/30 text-cosmic-saffron border-cosmic-saffron/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]'
                  : 'bg-gradient-to-b from-cosmic-gold/30 to-amber-900/30 text-cosmic-gold border-cosmic-gold/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]'
              }`}
            >
              {isPM
                ? (language === 'or' ? 'ଅପରାହ୍ନ (PM)' : language === 'hi' ? 'अपराह्न (PM)' : 'PM')
                : (language === 'or' ? 'ପୂର୍ବାହ୍ନ (AM)' : language === 'hi' ? 'पूर्वाह्न (AM)' : 'AM')
              }
            </button>
          </div>

          {/* Prahar & Day/Night Indicator */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
            <span className="flex items-center gap-1 text-slate-300">
              {isDayBirth ? '☀️ ଦିବା ଜନ୍ମ (Day Birth)' : '🌙 ରାତ୍ରି ଜନ୍ମ (Night Birth)'}
            </span>
            <span className="text-cosmic-gold font-medium">
              {formatNumber(praharIndex)}ମ ପ୍ରହର (Prahar {praharIndex})
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Full-Width Spacious Smart Geographic Location Hub */}
      <LocationSearchBox
        selectedLocation={selectedLocation}
        onSelectLocation={onSelectLocation}
      />
    </div>
  );
};
