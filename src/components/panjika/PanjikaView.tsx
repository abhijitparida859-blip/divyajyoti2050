import React, { useState } from 'react';
import { useI18n } from '../../localization/i18n';
import { DayPanjika } from '../../types/panjika';
import { calculatePanjika } from '../../core/panjika/panjika_engine';
import { ODIA_PANJIKA_SOURCES, PanjikaSource } from '../../core/panjika/odisha_data';
import { ODISHA_COMPREHENSIVE_LOCATIONS, PlaceLocation } from '../../core/jataka/odisha_geography_db';
import { LocationSearchBox } from '../jataka/LocationSearchBox';
import { Sun, Moon, Clock, ShieldAlert, Sparkles, Compass, Award, BookOpen, MapPin, Calendar as CalendarIcon } from 'lucide-react';
import { CosmicBackground3D } from '../home/CosmicBackground3D';
import { DivineHeroSection } from '../home/DivineHeroSection';
import { MuhurtaMarquee } from '../home/MuhurtaMarquee';
import { DivineCommandCenter } from '../home/DivineCommandCenter';
import { ChoghadiyaHUD } from '../home/ChoghadiyaHUD';
import { GrahaTransitStrip } from '../home/GrahaTransitStrip';
import { MoonOrb3D } from '../home/MoonOrb3D';
import { UpcomingFestivals } from '../home/UpcomingFestivals';
import { DailyShlokaCard } from '../home/DailyShlokaCard';
import { calculateOdiaCalendarDay } from '../../core/panjika/odia_calendar_engine';

const SOURCE_TO_EDITION: Record<string, string> = {
  mukti_mandap: 'srimandir',
  kohinoor: 'kohinoor',
  biraja: 'biraja',
  radharaman: 'radharaman',
  khadiratna: 'khadiratna',
  drik_lahiri: 'bhagyajyoti',
};

export const PanjikaView: React.FC = () => {
  const { t, language, formatNumber, tVaara, tNakshatra, tGraha, tYoga, tKarana, tKaranaType, tTithiFromKey, formatTime } = useI18n();

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [selectedSourceId, setSelectedSourceId] = useState<string>('mukti_mandap');
  const [currentLocation, setCurrentLocation] = useState<PlaceLocation>(() => ODISHA_COMPREHENSIVE_LOCATIONS[1]); // Puri default

  const activeSource: PanjikaSource = React.useMemo(() => {
    return ODIA_PANJIKA_SOURCES.find(s => s.id === selectedSourceId) || ODIA_PANJIKA_SOURCES[0];
  }, [selectedSourceId]);

  // Selected Panjika Authority genuinely changes the page: the same calendar engine
  // that powers the Odia Calendar applies this source's siddhanta to tithi/nakshatra
  // end timings (see calculateOdiaCalendarDay). Calculation = REAL, canonical astronomical math.
  const odiaDayInfo = React.useMemo(() => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    return calculateOdiaCalendarDay(
      dateObj,
      currentLocation.latitude,
      currentLocation.longitude,
      SOURCE_TO_EDITION[selectedSourceId] || 'kohinoor',
    );
  }, [selectedDate, currentLocation, selectedSourceId]);

  // 100% Unified: Derived directly from the single canonical source of truth
  const panjika: DayPanjika = odiaDayInfo.panjika;

  // ---- 3D Divine Hero helpers (greeting + shloka follow language/time) ----
  const heroDay = React.useMemo(
    () => ({ panjika, dayOfMonth: Number(selectedDate.split('-')[2]) }),
    [panjika, selectedDate]
  );

  // Adjacent-day anchors: tomorrow's sunrise + yesterday's sunset feed the
  // command-center countdown and the live choghadiya night window.
  const astroBounds = React.useMemo(() => {
    const tomorrowSunrise = calculatePanjika(
      new Date(Date.now() + 86400000),
      currentLocation.latitude,
      currentLocation.longitude,
    ).sunrise;
    const yesterdaySunset = calculatePanjika(
      new Date(Date.now() - 86400000),
      currentLocation.latitude,
      currentLocation.longitude,
    ).sunset;
    return { tomorrowSunrise, yesterdaySunset };
  }, [currentLocation]);
  const heroHour = new Date().getHours();
  const greeting = language === 'or'
    ? (heroHour < 5 ? '🌙 ଶୁଭ ରାତ୍ରି' : heroHour < 12 ? '🌅 ସୁପ୍ରଭାତ' : heroHour < 17 ? '☀️ ଶୁଭ ଅପରାହ୍ଣ' : heroHour < 20 ? '🌇 ଶୁଭ ସନ୍ଧ୍ୟା' : '🌙 ଶୁଭ ରାତ୍ରି')
    : language === 'hi'
      ? (heroHour < 5 ? '🌙 शुभ रात्रि' : heroHour < 12 ? '🌅 सुप्रभात' : heroHour < 17 ? '☀️ शुभ अपराह्न' : heroHour < 20 ? '🌇 शुभ संध्या' : '🌙 शुभ रात्रि')
      : (heroHour < 5 ? '🌙 Blessed Night' : heroHour < 12 ? '🌅 Good Morning' : heroHour < 17 ? '☀️ Good Afternoon' : heroHour < 20 ? '🌇 Blessed Evening' : '🌙 Blessed Night');
  const heroShloka = language === 'or'
    ? 'ଯଥା ଦୀପୋ ନିବାତସ୍ଥୋ ନେଙ୍ଗତେ ସୋପମା ସ୍ମୃତା — ବାୟୁହୀନ ସ୍ଥାନରେ ଦୀପ ଯେପରି ସ୍ଥିର ଜଳେ, ଯୋଗୀର ମନ ସେପରି ସ୍ଥିର ରହେ (ଗୀତା ୬.୧୯)'
    : language === 'hi'
      ? 'यथा दीपो निवातस्थो नेङ्गते सोपमा स्मृता — वायुरहित स्थान में दीप जैसे स्थिर जलता है, योगी का मन वैसे स्थिर रहता है (गीता 6.19)'
      : 'As a lamp in a windless place burns steady — so is the disciplined mind of the yogi (Gita 6.19)';
  const mu = panjika.muhurtas;

  return (
    <div className="relative">
      {/* Immersive 3D cosmic sky behind the entire front page */}
      <CosmicBackground3D />
      <div className="space-y-6 max-w-5xl mx-auto pb-12 relative z-10">
      {/* 0a. 3D Divine Hero — tithi, nakshatra, sunrise/sunset */}
      <div className="animate-cosmic-rise">
        <DivineHeroSection
          day={heroDay}
          language={language}
          formatNumber={formatNumber}
          formatTime={formatTime}
          tithiLabel={tTithiFromKey(panjika.tithi.nameKey)}
          nakshatraLabel={tNakshatra(panjika.nakshatra.nameKey)}
          vaaraLabel={tVaara(panjika.vaara)}
          greeting={greeting}
          shloka={heroShloka}
          festivals={panjika.festivals}
          tithiDurationStr={language === 'or' ? odiaDayInfo.tithiTiming?.durationStrOr : language === 'hi' ? odiaDayInfo.tithiTiming?.durationStrHi : odiaDayInfo.tithiTiming?.durationStrEn}
        />
      </div>
      {/* 0b. Live scrolling muhurta strip */}
      <div className="animate-cosmic-rise" style={{ animationDelay: '0.08s' }}>
        <MuhurtaMarquee
          title={language === 'or' ? 'ଆଜିର ମୁହୂର୍ତ୍ତ' : language === 'hi' ? 'आज के मुहूर्त' : "Today's Muhurtas"}
          items={[
            { emoji: '✨', label: language === 'or' ? 'ଅଭିଜିତ୍' : 'Abhijit', time: `${formatTime(mu.abhijit.start)}–${formatTime(mu.abhijit.end)}`, good: true },
            { emoji: '🌅', label: language === 'or' ? 'ବ୍ରହ୍ମ ମୁହୂର୍ତ୍ତ' : 'Brahma', time: `${formatTime(mu.brahmaMuhurta.start)}–${formatTime(mu.brahmaMuhurta.end)}`, good: true },
            { emoji: '⚠️', label: language === 'or' ? 'ରାହୁ କାଳ' : 'Rahu Kaal', time: `${formatTime(mu.rahuKaal.start)}–${formatTime(mu.rahuKaal.end)}`, good: false },
            { emoji: '🟡', label: language === 'or' ? 'ୟମଗଣ୍ଡ' : 'Yamaganda', time: `${formatTime(mu.yamaganda.start)}–${formatTime(mu.yamaganda.end)}`, good: false },
          ]}
        />
      </div>

      {/* 0c. Live Divine Command Center + real three.js Moon Orb */}
      <div className="animate-cosmic-rise" style={{ animationDelay: '0.14s' }}>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <DivineCommandCenter panjika={panjika} tomorrowSunrise={astroBounds.tomorrowSunrise} />
          </div>
          <MoonOrb3D panjika={panjika} />
        </div>
      </div>

      {/* 0d. Choghadiya — live day/night auspicious clock */}
      <div className="animate-cosmic-rise" style={{ animationDelay: '0.18s' }}>
        <ChoghadiyaHUD
          panjika={panjika}
          tomorrowSunrise={astroBounds.tomorrowSunrise}
          yesterdaySunset={astroBounds.yesterdaySunset}
        />
      </div>

      {/* 1. Panjika Authority & Dynamic Location Selector Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tradition Selector */}
        <div className="bg-cosmic-900/90 border border-cosmic-gold/30 rounded-2xl p-4 shadow-xl backdrop-blur-md flex flex-col gap-2.5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cosmic-gold/20 border border-cosmic-gold/40 flex items-center justify-center text-cosmic-gold shadow-inner shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-cosmic-gold uppercase font-bold tracking-wider">
                {t('panjika_source_label')}
              </div>
              <div className="text-xs font-bold text-slate-100 truncate">
                {activeSource.name[language]}
              </div>
              <div className="mt-0.5 text-[10px] leading-snug text-slate-400 line-clamp-2">
                {activeSource.description[language]} • {activeSource.authority}
              </div>
            </div>
          </div>

          <select
            value={selectedSourceId}
            onChange={(e) => setSelectedSourceId(e.target.value)}
            className="w-full bg-cosmic-950 border border-cosmic-gold/40 text-cosmic-gold text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cosmic-gold cursor-pointer shadow-inner"
          >
            {ODIA_PANJIKA_SOURCES.map(source => (
              <option key={source.id} value={source.id} className="bg-cosmic-950 text-slate-200">
                {source.name[language]}
              </option>
            ))}
          </select>
        </div>

        {/* Dynamic Location Search Box (Flipkart/Amazon style) */}
        <LocationSearchBox
          selectedLocation={currentLocation}
          onSelectLocation={setCurrentLocation}
        />
      </div>

      {/* Date Bar & Hero */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-cosmic-900/95 via-cosmic-800/85 to-cosmic-900/95 border border-cosmic-gold/30 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 text-cosmic-gold text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-cosmic-saffron" />
            <span>{t('panjika_hero_tag')} • {currentLocation.name[language]} ({formatNumber(currentLocation.latitude.toFixed(2))}°N, {formatNumber(currentLocation.longitude.toFixed(2))}°E)</span>
          </div>
          <h2 className="text-2xl font-bold font-serif bg-gradient-to-r from-cosmic-gold to-slate-100 bg-clip-text text-transparent">
            {tTithiFromKey(panjika.tithi.nameKey)}
          </h2>
          <p className="text-xs text-slate-300 mt-0.5 font-medium">
            {tVaara(panjika.vaara)} • {tNakshatra(panjika.nakshatra.nameKey)} ({t('pada_label')} {formatNumber(panjika.nakshatra.pada)})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 bg-cosmic-950 border border-cosmic-gold/40 rounded-xl px-3 py-2 text-xs shadow-inner cursor-pointer hover:border-cosmic-gold transition-colors touch-manipulation min-h-[38px]"
            onClick={(e) => {
              const input = e.currentTarget.querySelector('input');
              input?.showPicker?.();
            }}
          >
            <CalendarIcon className="w-4 h-4 text-amber-400 shrink-0" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 5 Limbs of Panchanga Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Tithi */}
        <div className="bg-cosmic-900/60 border border-cosmic-gold/20 rounded-2xl p-4 backdrop-blur-md hover:border-cosmic-gold/50 transition-all shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>{t('tithi')}</span>
            <Moon className="w-4 h-4 text-cosmic-celestial" />
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-100">
            {tTithiFromKey(panjika.tithi.nameKey)}
          </div>
          <div className="text-[11px] text-cosmic-gold mt-1">
            {t('paksha_label')}: {panjika.tithi.paksha === 'Shukla' ? (language === 'or' ? 'ଶୁକ୍ଳ ପକ୍ଷ' : 'शुक्ल पक्ष') : (language === 'or' ? 'କୃଷ୍ଣ ପକ୍ଷ' : 'कृष्ण पक्ष')}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 leading-snug">
            {odiaDayInfo.tithiTiming[language === 'or' ? 'durationStrOr' : language === 'hi' ? 'durationStrHi' : 'durationStrEn']}
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-gradient-to-r from-cosmic-celestial to-cosmic-gold h-1.5 rounded-full" style={{ width: `${panjika.tithi.percentage}%` }} />
          </div>
        </div>

        {/* Nakshatra */}
        <div className="bg-cosmic-900/60 border border-cosmic-gold/20 rounded-2xl p-4 backdrop-blur-md hover:border-cosmic-gold/50 transition-all shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>{t('nakshatra')}</span>
            <Compass className="w-4 h-4 text-cosmic-saffron" />
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-100">{tNakshatra(panjika.nakshatra.nameKey)}</div>
          <div className="text-[11px] text-cosmic-gold mt-1">
            {t('pada_label')} {formatNumber(panjika.nakshatra.pada)} • {t('ruler_label')}: {tGraha(panjika.nakshatra.ruler)}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 leading-snug">
            {odiaDayInfo.nakshatraTiming[language === 'or' ? 'durationStrOr' : language === 'hi' ? 'durationStrHi' : 'durationStrEn']}
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-gradient-to-r from-cosmic-saffron to-cosmic-gold h-1.5 rounded-full" style={{ width: `${panjika.nakshatra.percentage}%` }} />
          </div>
        </div>

        {/* Yoga */}
        <div className="bg-cosmic-900/60 border border-cosmic-gold/20 rounded-2xl p-4 backdrop-blur-md hover:border-cosmic-gold/50 transition-all shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>{t('yoga')}</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-100">{tYoga(panjika.yoga.nameKey)}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            {t('index_label')}: {formatNumber(panjika.yoga.number)} {t('of_27')}
          </div>
        </div>

        {/* Karana */}
        <div className="bg-cosmic-900/60 border border-cosmic-gold/20 rounded-2xl p-4 backdrop-blur-md hover:border-cosmic-gold/50 transition-all shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>{t('karana')}</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-100">{tKarana(panjika.karana.nameKey)}</div>
          <div className="text-[11px] text-emerald-400 mt-1 uppercase font-semibold">
            {tKaranaType(panjika.karana.type)}
          </div>
        </div>
      </div>

      {/* Solar & Lunar Timings Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-cosmic-900/40 border border-slate-800 rounded-2xl p-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <Sun className="w-4 h-4 text-amber-400" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase">{t('sunrise')}</div>
            <div className="text-xs font-semibold text-slate-200">{formatTime(panjika.sunrise)}</div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Sun className="w-4 h-4 text-orange-500" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase">{t('sunset')}</div>
            <div className="text-xs font-semibold text-slate-200">{formatTime(panjika.sunset)}</div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Moon className="w-4 h-4 text-slate-200" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase">{t('moon_phase')}</div>
            <div className="text-xs font-semibold text-cosmic-gold">
              {formatNumber(Math.round(panjika.moonPhase * 100))}% {t('illuminated')}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Clock className="w-4 h-4 text-cosmic-celestial" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase">{t('lahiri_ayanamsa')}</div>
            <div className="text-xs font-semibold text-slate-200">{formatNumber(panjika.ayanamsa.toFixed(3))}°</div>
          </div>
        </div>
      </div>

      {/* 5b. Real-time graha transit (sidereal rashis from the ephemeris) */}
      <div className="animate-cosmic-rise" style={{ animationDelay: '0.24s' }}>
        <GrahaTransitStrip />
      </div>

      {/* Muhurta Clock & Timers */}
      <div className="bg-cosmic-900/70 border border-cosmic-gold/25 rounded-2xl p-5 shadow-xl">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-4 font-serif">
          <Clock className="w-4 h-4 text-cosmic-gold" />
          {t('muhurta_clock_title')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-3.5 flex items-start justify-between">
            <div>
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {t('abhijit')}
              </div>
              <div className="text-sm font-bold text-slate-100 mt-1">
                {formatTime(panjika.muhurtas.abhijit.start)} – {formatTime(panjika.muhurtas.abhijit.end)}
              </div>
              <div className="text-[11px] text-emerald-300/80 mt-1">{t('abhijit_desc')}</div>
              <div className="text-[10px] text-slate-400 mt-1 leading-snug">{language === 'or' ? 'ଅମୃତ ବେଳା' : language === 'hi' ? 'अमृत बेला' : 'Amrita Bela'}: {odiaDayInfo.belas.amrita}</div>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full uppercase font-bold">
              {t('auspicious')}
            </span>
          </div>

          <div className="bg-indigo-950/40 border border-indigo-500/40 rounded-xl p-3.5 flex items-start justify-between">
            <div>
              <div className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {t('brahma_muhurta')}
              </div>
              <div className="text-sm font-bold text-slate-100 mt-1">
                {formatTime(panjika.muhurtas.brahmaMuhurta.start)} – {formatTime(panjika.muhurtas.brahmaMuhurta.end)}
              </div>
              <div className="text-[11px] text-indigo-200/80 mt-1">{t('brahma_desc')}</div>
            </div>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full uppercase font-bold">
              {t('auspicious')}
            </span>
          </div>

          <div className="bg-rose-950/40 border border-rose-500/40 rounded-xl p-3.5 flex items-start justify-between">
            <div>
              <div className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                {t('rahu_kaal')}
              </div>
              <div className="text-sm font-bold text-slate-100 mt-1">
                {formatTime(panjika.muhurtas.rahuKaal.start)} – {formatTime(panjika.muhurtas.rahuKaal.end)}
              </div>
              <div className="text-[11px] text-rose-300/80 mt-1">{t('rahu_desc')}</div>
            </div>
            <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full uppercase font-bold">
              {t('inauspicious')}
            </span>
          </div>

          <div className="bg-amber-950/30 border border-amber-600/30 rounded-xl p-3.5 flex items-start justify-between">
            <div>
              <div className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                {t('yamaganda')}
              </div>
              <div className="text-sm font-bold text-slate-100 mt-1">
                {formatTime(panjika.muhurtas.yamaganda.start)} – {formatTime(panjika.muhurtas.yamaganda.end)}
              </div>
            </div>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full uppercase font-bold">
              {t('inauspicious')}
            </span>
          </div>

          <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-3.5 flex items-start justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cosmic-gold" />
                {t('gulika')}
              </div>
              <div className="text-sm font-bold text-slate-100 mt-1">
                {formatTime(panjika.muhurtas.gulika.start)} – {formatTime(panjika.muhurtas.gulika.end)}
              </div>
            </div>
            <span className="text-[10px] bg-slate-700/40 text-slate-300 px-2 py-0.5 rounded-full uppercase font-bold">
              {t('neutral')}
            </span>
          </div>
        </div>
      </div>

      {/* 5c. Upcoming festivals with countdown (30-day engine scan) */}
      <div className="animate-cosmic-rise" style={{ animationDelay: '0.28s' }}>
        <UpcomingFestivals latitude={currentLocation.latitude} longitude={currentLocation.longitude} />
      </div>

      {/* 6. Verse of the Day — daily Gita wisdom */}
      <div className="animate-cosmic-rise" style={{ animationDelay: '0.2s' }}>
        <DailyShlokaCard language={language} />
      </div>
      </div>
    </div>
  );
};