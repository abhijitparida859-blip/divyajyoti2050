import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  DynamicOdiaDayInfo,
  OdiaPanjikaEdition,
  OdishaCityLocation,
  OdiaSolarMonthInfo,
  ShubhaMuhurta,
  formatOdiaNum,
  formatTimeInOdia,
  getOdiaTithiOnly,
  DIGASHULA_DATA,
  NAKSHATRA_OR_MAP
} from '../../core/panjika/odia_calendar_engine';
import {
  Printer,
  X,
  Compass,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface OdiaPrintableWallCalendarProps {
  currentYear: number;
  currentMonth: number; // 0-11
  selectedCity: OdishaCityLocation;
  selectedPanjika: OdiaPanjikaEdition;
  monthDays: DynamicOdiaDayInfo[];
  monthMuhurtas: ShubhaMuhurta[];
  primaryOdiaSolarMonth: OdiaSolarMonthInfo;
  onClose?: () => void;
  isPreviewModal?: boolean;
}

const GREGORIAN_MONTH_NAMES_OR = [
  'ଜାନୁଆରୀ', 'ଫେବୃଆରୀ', 'ମାର୍ଚ୍ଚ', 'ଏପ୍ରିଲ', 'ମେ', 'ଜୁନ୍',
  'ଜୁଲାଇ', 'ଅଗଷ୍ଟ', 'ସେପ୍ଟେମ୍ବର', 'ଅକ୍ଟୋବର', 'ନଭେମ୍ବର', 'ଡିସେମ୍ବର'
];

const GREGORIAN_MONTH_NAMES_EN = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
];

const WEEKDAY_HEADERS = [
  { or: 'ରବିବାର', en: 'SUNDAY', isRed: true },
  { or: 'ସୋମବାର', en: 'MONDAY', isRed: false },
  { or: 'ମଙ୍ଗଳବାର', en: 'TUESDAY', isRed: false },
  { or: 'ବୁଧବାର', en: 'WEDNESDAY', isRed: false },
  { or: 'ଗୁରୁବାର', en: 'THURSDAY', isRed: false },
  { or: 'ଶୁକ୍ରବାର', en: 'FRIDAY', isRed: false },
  { or: 'ଶନିବାର', en: 'SATURDAY', isRed: false }
];

const VAARA_NAMES_OR = ['ରବିବାର', 'ସୋମବାର', 'ମଙ୍ଗଳବାର', 'ବୁଧବାର', 'ଗୁରୁବାର', 'ଶୁକ୍ରବାର', 'ଶନିବାର'];

export const OdiaPrintableWallCalendar: React.FC<OdiaPrintableWallCalendarProps> = ({
  currentYear,
  currentMonth,
  selectedCity,
  selectedPanjika,
  monthDays,
  monthMuhurtas,
  primaryOdiaSolarMonth,
  onClose,
  isPreviewModal = false
}) => {
  // Advance Print Studio Settings
  const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('landscape');
  const [colorMode, setColorMode] = useState<'color' | 'bw'>('color');
  const [showAstroBoxes, setShowAstroBoxes] = useState<boolean>(true);
  const [showBottomTables, setShowBottomTables] = useState<boolean>(true);
  const [showFoodRestrictions, setShowFoodRestrictions] = useState<boolean>(true);
  const [showBesha, setShowBesha] = useState<boolean>(true);
  const [zoomScale, setZoomScale] = useState<number>(100);

  const firstDayWeekday = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun
  const totalCells = firstDayWeekday + monthDays.length;
  const rowCount = Math.ceil(totalCells / 7); // usually 5, occasionally 6

  // Quarterly Sunrise / Sunset Table (1st, 10th, 20th, Last Day)
  const quarterSunTimes = [
    { dayNum: 1, info: monthDays[0] },
    { dayNum: Math.min(10, monthDays.length), info: monthDays[Math.min(9, monthDays.length - 1)] },
    { dayNum: Math.min(20, monthDays.length), info: monthDays[Math.min(19, monthDays.length - 1)] },
    { dayNum: monthDays.length, info: monthDays[monthDays.length - 1] }
  ];

  // Sankranti in this month
  const sankrantiDay = monthDays.find(d => d.isSankranti);

  // Ekadashis in this month
  const ekadashis = monthDays.filter(d => d.isEkadashi);

  // Amavasya and Purnima
  const amavasyaDay = monthDays.find(d => d.isAmavasya);
  const purnimaDay = monthDays.find(d => d.isPurnima);

  // Filter Muhurtas for bottom table
  const vivahaMuhurtas = monthMuhurtas.filter(m => m.type === 'vivaha');
  const bratopanayanaMuhurtas = monthMuhurtas.filter(m => m.type === 'bratopanayana');
  const gruhapraveshaMuhurtas = monthMuhurtas.filter(m => m.type === 'gruhapravesha');
  const vahanaMuhurtas = monthMuhurtas.filter(m => m.type === 'vahana');

  // Helper for pure Odia tithi label
  const getTithiDisplay = (day: DynamicOdiaDayInfo) => {
    if (day.isAmavasya) return 'ଅମାବାସ୍ୟା';
    if (day.isPurnima) return 'ପୂର୍ଣ୍ଣିମା';
    const prefix = day.isShukla ? 'ଶୁ.' : 'କୃ.';
    if (day.isEarlyTithiChange && day.dominantTithiNameOr) {
      return `${prefix} ${getOdiaTithiOnly(day.tithiNumber)}/${day.dominantTithiNameOr}`;
    }
    return `${prefix} ${getOdiaTithiOnly(day.tithiNumber)}`;
  };

  // Dynamic cell height class to guarantee single-page fit
  const cellHeightClass = useMemo(() => {
    if (orientation === 'landscape') {
      return rowCount === 6
        ? 'h-[46px] print:h-[42px] min-h-0'
        : 'h-[56px] print:h-[50px] min-h-0';
    } else {
      return rowCount === 6
        ? 'h-[64px] print:h-[58px] min-h-0'
        : 'h-[74px] print:h-[68px] min-h-0';
    }
  }, [orientation, rowCount]);

  // Print execution handler
  const handlePrint = () => {
    window.print();
  };

  const sheetContent = (
    <div
      className={`odia-print-sheet bg-white text-slate-900 mx-auto border border-slate-800 print:border-none print:shadow-none print:max-w-none print:w-full leading-tight font-sans select-none flex flex-col justify-between ${
        colorMode === 'bw' ? 'bw-mode grayscale' : 'color-mode'
      } ${
        orientation === 'landscape'
          ? 'p-2 print:p-1 max-w-[1240px] text-[10px] print:text-[8px]'
          : 'p-3 print:p-1.5 max-w-[850px] text-[10.5px] print:text-[8.5px]'
      }`}
      style={{
        transform: zoomScale !== 100 ? `scale(${zoomScale / 100})` : undefined,
        transformOrigin: 'top center'
      }}
    >
      {/* 1. TOP SACRED MANGLACHARANA & INVOCATIONS */}
      <div className="border-b border-red-800/80 pb-1 mb-1">
        <div
          className={`text-[9px] print:text-[8px] font-bold tracking-widest flex items-center justify-center gap-2 sm:gap-4 ${
            colorMode === 'bw' ? 'text-black' : 'text-red-700'
          }`}
        >
          <span>॥ ଶ୍ରୀ ଗଣେଶାୟ ନମଃ ॥</span>
          <span>•</span>
          <span>॥ ନୀଳାଦ୍ରୌ ଶଙ୍ଖମଧ୍ୟେ ଶତଦଳକମଳେ ରତ୍ନସିଂହାସନସ୍ଥମ୍ ॥</span>
          <span>•</span>
          <span>॥ ଶ୍ରୀ ଜଗନ୍ନାଥ ସ୍ୱାମୀ ନୟନ ପଥଗାମୀ ଭବତୁ ମେ ॥</span>
        </div>

        <div className="flex items-center justify-between mt-1 px-1">
          {/* Left Metadata: Odia Solar Month & Season */}
          <div className="text-left">
            <div
              className={`text-xs sm:text-sm print:text-xs font-black font-serif ${
                colorMode === 'bw' ? 'text-black' : 'text-red-900'
              }`}
            >
              {primaryOdiaSolarMonth.nameOr} ମାସ
            </div>
            <div className="text-[8.5px] print:text-[7.5px] font-bold text-slate-700">
              ଋତୁ: {primaryOdiaSolarMonth.seasonOr} ଋତୁ • ମାନମନ୍ଦିର: {selectedCity.nameOr}
            </div>
          </div>

          {/* Center Masthead: Canonical Panjika Brand */}
          <div className="text-center">
            <h1
              className={`text-base sm:text-lg print:text-sm font-black font-serif tracking-wide uppercase leading-tight ${
                colorMode === 'bw' ? 'text-black' : 'text-red-800'
              }`}
            >
              {selectedPanjika.nameOr}
            </h1>
            <div className="text-[9.5px] print:text-[8px] font-bold text-slate-800 tracking-wider leading-tight">
              ପ୍ରାମାଣିକ ଓଡ଼ିଆ କାନ୍ଥ କ୍ୟାଲେଣ୍ଡର ({formatOdiaNum(currentYear)})
            </div>
            <div className="text-[8px] print:text-[7px] text-slate-600 font-medium">
              {selectedPanjika.authorityOr} • {selectedPanjika.traditionOr}
            </div>
          </div>

          {/* Right Metadata: Gregorian Month & Eras */}
          <div className="text-right">
            <div className="text-xs sm:text-sm print:text-xs font-black text-slate-900">
              {GREGORIAN_MONTH_NAMES_OR[currentMonth]} - {formatOdiaNum(currentYear)}
            </div>
            <div className="text-[8.5px] print:text-[7.5px] font-bold text-slate-600 font-mono">
              {GREGORIAN_MONTH_NAMES_EN[currentMonth]} {currentYear}
            </div>
          </div>
        </div>

        {/* Triple Eras Bar */}
        <div
          className={`mt-1 py-0.5 px-2 text-[8.5px] print:text-[7.5px] font-bold flex flex-wrap items-center justify-around gap-1 border-y ${
            colorMode === 'bw' ? 'bg-slate-100 border-slate-300 text-black' : 'bg-red-50/80 border-red-200 text-red-950'
          }`}
        >
          <span>ରାଜାଙ୍କ ଅଙ୍କ: ଶ୍ରୀଦିବ୍ୟସିଂହଦେବ ମହାରାଜାଙ୍କ {formatOdiaNum(currentYear - 2000)} ଅଙ୍କ</span>
          <span>•</span>
          <span>ସାଲ୍: {formatOdiaNum(currentYear - 616)} ସାଲ</span>
          <span>•</span>
          <span>ବିକ୍ରମାବ୍ଦ: {formatOdiaNum(currentMonth < 3 ? currentYear + 56 : currentYear + 57)} ସମ୍ବତ୍</span>
          <span>•</span>
          <span>ଶକାବ୍ଦ: {formatOdiaNum(currentYear - 78)} ଶକାବ୍ଦ</span>
          <span>•</span>
          <span>ସିଦ୍ଧାନ୍ତ ଦର୍ପଣ ଓ ନିରୟନ ସ୍ଫୁଟ ଗଣନା</span>
        </div>
      </div>

      {/* 2. TOP ASTRONOMICAL TABLES (4 Real Summary Boxes) */}
      {showAstroBoxes && (
        <div className="grid grid-cols-4 gap-1 mb-1 text-[8.5px] print:text-[7.5px]">
          {/* Box A: Sunrise & Sunset Table */}
          <div className="border border-slate-300 rounded p-1 bg-slate-50">
            <div
              className={`font-bold border-b border-slate-300 pb-0.5 mb-0.5 flex items-center justify-between ${
                colorMode === 'bw' ? 'text-black' : 'text-red-800'
              }`}
            >
              <span>☀️ ସୂର୍ଯ୍ୟୋଦୟ ଓ ଅସ୍ତ</span>
              <span className="text-[7.5px] text-slate-500 font-normal">{selectedCity.nameOr}</span>
            </div>
            <div className="space-y-0.2">
              {quarterSunTimes.map((item, idx) => {
                const sr = item.info ? formatTimeInOdia(item.info.panjika.sunrise) : '';
                const ss = item.info ? formatTimeInOdia(item.info.panjika.sunset) : '';
                return (
                  <div key={idx} className="flex justify-between text-[8px] print:text-[7px]">
                    <span className="font-bold text-slate-700">{formatOdiaNum(item.dayNum)} ତାରିଖ:</span>
                    <span className="text-slate-800 font-medium">
                      ଉ: {sr} | ଅ: {ss}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Box B: Sankranti Ingress */}
          <div className="border border-slate-300 rounded p-1 bg-amber-50/40">
            <div
              className={`font-bold border-b border-amber-200 pb-0.5 mb-0.5 ${
                colorMode === 'bw' ? 'text-black' : 'text-amber-900'
              }`}
            >
              <span>🔄 ସଂକ୍ରାନ୍ତି ବିବରଣୀ</span>
            </div>
            {sankrantiDay ? (
              <div className="space-y-0.2 text-[8px] print:text-[7px]">
                <div className={`font-bold ${colorMode === 'bw' ? 'text-black' : 'text-red-800'}`}>
                  {sankrantiDay.odiaSolarMonth.nameOr} ସଂକ୍ରାନ୍ତି
                </div>
                <div className="text-slate-700">
                  ଇଂ {formatOdiaNum(sankrantiDay.dayOfMonth)} ତାରିଖ ({VAARA_NAMES_OR[sankrantiDay.date.getDay()]})
                </div>
                <div className="text-slate-600">
                  ପୁଣ୍ୟକାଳ: ସୂର୍ଯ୍ୟୋଦୟ ରୁ ଦିବା ୧୨:୦୦
                </div>
              </div>
            ) : (
              <div className="text-[8px] print:text-[7px] text-slate-600 pt-0.5">
                ଏହି ମାସ ସାରା {primaryOdiaSolarMonth.nameOr} ପ୍ରଚଳିତ ରହିବ।
              </div>
            )}
          </div>

          {/* Box C: Ekadashi & Parana */}
          <div className="border border-slate-300 rounded p-1 bg-emerald-50/40">
            <div
              className={`font-bold border-b border-emerald-200 pb-0.5 mb-0.5 ${
                colorMode === 'bw' ? 'text-black' : 'text-emerald-900'
              }`}
            >
              <span>🕉️ ମାସିକ ଏକାଦଶୀ ଓ ପାରଣା</span>
            </div>
            {ekadashis.length > 0 ? (
              <div className="space-y-0.5 text-[8px] print:text-[7px]">
                {ekadashis.map((ek, idx) => {
                  const vaaraStr = VAARA_NAMES_OR[ek.date.getDay()];
                  const festName = ek.festivals.find(f => f.nameOr.includes('ଏକାଦଶୀ'))?.nameOr || 'ଏକାଦଶୀ ବ୍ରତ';
                  return (
                    <div key={idx} className="border-b border-emerald-100 pb-0.2 last:border-none">
                      <span className={`font-bold ${colorMode === 'bw' ? 'text-black' : 'text-emerald-800'}`}>
                        {formatOdiaNum(ek.dayOfMonth)} ତାରିଖ ({vaaraStr}):
                      </span>{' '}
                      <span className="text-slate-800 font-semibold">{festName}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-[8px] print:text-[7px] text-slate-600 pt-0.5">ପରବର୍ତ୍ତୀ ପତ୍ରରେ ଦ୍ରଷ୍ଟବ୍ୟ।</div>
            )}
          </div>

          {/* Box D: Amavasya & Purnima */}
          <div className="border border-slate-300 rounded p-1 bg-indigo-50/40">
            <div
              className={`font-bold border-b border-indigo-200 pb-0.5 mb-0.5 ${
                colorMode === 'bw' ? 'text-black' : 'text-indigo-900'
              }`}
            >
              <span>🌑 ଅମାବାସ୍ୟା ଓ 🌕 ପୂର୍ଣ୍ଣିମା</span>
            </div>
            <div className="space-y-0.5 text-[8px] print:text-[7px]">
              {amavasyaDay && (
                <div>
                  <span className="font-bold text-slate-800">🌑 ଅମାବାସ୍ୟା:</span>{' '}
                  <span>{formatOdiaNum(amavasyaDay.dayOfMonth)} ତା ({VAARA_NAMES_OR[amavasyaDay.date.getDay()]})</span>
                </div>
              )}
              {purnimaDay && (
                <div>
                  <span className={`font-bold ${colorMode === 'bw' ? 'text-black' : 'text-amber-800'}`}>🌕 ପୂର୍ଣ୍ଣିମା:</span>{' '}
                  <span>{formatOdiaNum(purnimaDay.dayOfMonth)} ତା ({VAARA_NAMES_OR[purnimaDay.date.getDay()]})</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. AUTHENTIC 7-COLUMN MONTHLY CALENDAR GRID */}
      <div className="border border-slate-400 overflow-hidden mb-1">
        {/* Table Header Row */}
        <div className="grid grid-cols-7 border-b border-slate-400 text-center font-bold text-[10px] print:text-[8.5px]">
          {WEEKDAY_HEADERS.map((w, idx) => (
            <div
              key={idx}
              className={`py-1 border-r border-slate-400 last:border-r-0 ${
                colorMode === 'bw'
                  ? (w.isRed ? 'bg-slate-900 text-white font-black' : 'bg-slate-700 text-white')
                  : (w.isRed ? 'bg-red-700 text-white' : 'bg-slate-800 text-white')
              }`}
            >
              <div className="font-serif leading-tight">{w.or}</div>
              <div className="text-[7.5px] print:text-[6.5px] font-mono tracking-widest text-slate-200">{w.en}</div>
            </div>
          ))}
        </div>

        {/* Day Cells Grid */}
        <div className="grid grid-cols-7 border-collapse">
          {/* Empty cells before the 1st of the month */}
          {Array.from({ length: firstDayWeekday }).map((_, idx) => (
            <div
              key={`empty-${idx}`}
              className={`${cellHeightClass} border-r border-b border-slate-300 last:border-r-0 bg-slate-100/50 p-0.5`}
            />
          ))}

          {/* Month Day Cells */}
          {monthDays.map((day) => {
            const isSunday = new Date(currentYear, currentMonth, day.dayOfMonth).getDay() === 0;
            const isHoliday = isSunday || day.festivals.some(f => f.isGovernmentHoliday);
            const majorFest = day.festivals.find(f =>
              f.type === 'major' ||
              f.nameOr.includes('ପୂଜା') ||
              f.nameOr.includes('ଯାତ୍ରା') ||
              f.nameOr.includes('ଜୟନ୍ତୀ') ||
              f.nameOr.includes('ଏକାଦଶୀ') ||
              f.nameOr.includes('ସଂକ୍ରାନ୍ତି') ||
              f.nameOr.includes('ଅମାବାସ୍ୟା') ||
              f.nameOr.includes('ପୂର୍ଣ୍ଣିମା')
            );

            return (
              <div
                key={day.dayOfMonth}
                className={`${cellHeightClass} border-r border-b border-slate-300 p-0.5 sm:p-1 flex flex-col justify-between transition-colors overflow-hidden ${
                  colorMode === 'bw'
                    ? 'bg-white'
                    : isSunday
                    ? 'bg-red-50/40'
                    : isHoliday
                    ? 'bg-amber-50/40'
                    : 'bg-white'
                }`}
              >
                {/* Cell Header: English Date, Odia Date & Solar Day */}
                <div className="flex items-start justify-between leading-none">
                  <div className="flex items-baseline gap-0.5">
                    <span
                      className={`text-xs sm:text-sm print:text-xs font-black font-sans ${
                        colorMode === 'bw'
                          ? (isHoliday ? 'text-black font-black underline' : 'text-black')
                          : (isHoliday ? 'text-red-700' : 'text-slate-900')
                      }`}
                    >
                      {day.dayOfMonth}
                    </span>
                    <span className="text-[8.5px] print:text-[7px] font-bold text-slate-500">
                      ({formatOdiaNum(day.dayOfMonth)})
                    </span>
                  </div>

                  {/* Odia Solar Day Badge */}
                  <span
                    className={`text-[7.5px] print:text-[6.5px] font-bold px-1 py-0.2 rounded ${
                      colorMode === 'bw'
                        ? 'bg-slate-100 text-black border border-slate-400'
                        : 'bg-amber-100 text-amber-900 border border-amber-300/80'
                    }`}
                  >
                    {formatOdiaNum(day.odiaSolarDay)} ତା
                  </span>
                </div>

                {/* Tithi with Duration */}
                <div className="my-0.2 text-[8px] print:text-[7px]">
                  <div className="font-bold text-slate-900 leading-tight truncate">
                    {getTithiDisplay(day)}
                  </div>
                  {day.tithiTiming?.durationStrOr && (
                    <div className="text-[7px] print:text-[6px] text-slate-600 leading-tight truncate">
                      {day.tithiTiming.durationStrOr.replace('ପର୍ଯ୍ୟନ୍ତ', 'ଯାଏ').replace('ତଦନ୍ତେ', 'ପରେ')}
                    </div>
                  )}
                </div>

                {/* Nakshatra & Chandra Rashi */}
                <div className="text-[7px] print:text-[6px] text-slate-700 leading-tight flex items-center justify-between">
                  <span className="truncate">
                    {NAKSHATRA_OR_MAP[day.panjika.nakshatra.nameKey] || day.panjika.nakshatra.nameKey} ({formatOdiaNum(day.nakshatraTiming?.pada || 1)})
                  </span>
                  <span className="text-slate-500 font-medium shrink-0 ml-0.5">
                    {day.chandraRashiInfo?.rashiOr.replace(' ରାଶି', '')}
                  </span>
                </div>

                {/* Badges / Festivals / Besha */}
                <div className="space-y-0.2">
                  {showBesha && day.jagannathBesha && (
                    <div
                      className={`text-[7px] print:text-[6px] font-bold px-0.5 py-0.1 rounded border truncate ${
                        colorMode === 'bw'
                          ? 'bg-slate-100 text-black border-slate-400'
                          : 'bg-amber-100/80 text-amber-900 border-amber-300'
                      }`}
                    >
                      👑 {day.jagannathBesha.or}
                    </div>
                  )}

                  {majorFest && (
                    <div
                      className={`text-[7px] print:text-[6px] font-black leading-tight truncate ${
                        colorMode === 'bw' ? 'text-black underline' : 'text-red-800'
                      }`}
                    >
                      🚩 {majorFest.nameOr}
                    </div>
                  )}

                  {showFoodRestrictions && day.foodRestrictionOr && (
                    <div className="text-[6.5px] print:text-[5.5px] text-slate-500 leading-tight truncate">
                      ନିଷେଧ: {day.foodRestrictionOr.replace('ଭକ୍ଷଣ ନିଷେଧ', '').replace('ନିଷେଧ', '').trim()}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. BOTTOM SUTRAS & SHUBHA MUHURTA REFERENCE TABLES */}
      {showBottomTables && (
        <div className="grid grid-cols-3 gap-1 border border-slate-400 p-1 bg-slate-50 text-[8px] print:text-[7px]">
          {/* Table 1: Shubha Muhurtas */}
          <div className="border-r border-slate-300 pr-1 last:border-r-0">
            <div
              className={`font-bold border-b border-slate-300 pb-0.2 mb-0.5 flex items-center gap-1 ${
                colorMode === 'bw' ? 'text-black' : 'text-red-900'
              }`}
            >
              <Sparkles className="w-2.5 h-2.5" />
              <span>ମାସର ପ୍ରମୁଖ ଶୁଭ ମୁହୂର୍ତ୍ତ</span>
            </div>

            <div className="space-y-0.5">
              <div>
                <span className={`font-bold ${colorMode === 'bw' ? 'text-black' : 'text-red-800'}`}>💍 ଶୁଭ ବିବାହ: </span>
                <span className="text-slate-800">
                  {vivahaMuhurtas.length > 0
                    ? vivahaMuhurtas.map(m => `${formatOdiaNum(m.date.getDate())} (${VAARA_NAMES_OR[m.date.getDay()]})`).join(', ')
                    : 'ଏହି ମାସରେ ବିବାହ ମୁହୂର୍ତ୍ତ ନାହିଁ'}
                </span>
              </div>

              <div>
                <span className={`font-bold ${colorMode === 'bw' ? 'text-black' : 'text-emerald-800'}`}>🪢 ବ୍ରତୋପନୟନ: </span>
                <span className="text-slate-800">
                  {bratopanayanaMuhurtas.length > 0
                    ? bratopanayanaMuhurtas.map(m => `${formatOdiaNum(m.date.getDate())} (${VAARA_NAMES_OR[m.date.getDay()]})`).join(', ')
                    : 'ଏହି ମାସରେ ବ୍ରତ ନାହିଁ'}
                </span>
              </div>

              <div>
                <span className={`font-bold ${colorMode === 'bw' ? 'text-black' : 'text-amber-800'}`}>🏡 ଗୃହପ୍ରବେଶ: </span>
                <span className="text-slate-800">
                  {gruhapraveshaMuhurtas.length > 0
                    ? gruhapraveshaMuhurtas.map(m => `${formatOdiaNum(m.date.getDate())} (${VAARA_NAMES_OR[m.date.getDay()]})`).join(', ')
                    : 'ଏହି ମାସରେ ଗୃହପ୍ରବେଶ ନାହିଁ'}
                </span>
              </div>

              <div>
                <span className={`font-bold ${colorMode === 'bw' ? 'text-black' : 'text-indigo-800'}`}>🚗 ଯାନବାହନ: </span>
                <span className="text-slate-800">
                  {vahanaMuhurtas.length > 0
                    ? vahanaMuhurtas.map(m => `${formatOdiaNum(m.date.getDate())}`).join(', ')
                    : 'ଶୁକ୍ଳ ପକ୍ଷ ଶୁଭ ଦିନ ମାନଙ୍କରେ ପ୍ରଶସ୍ତ'}
                </span>
              </div>
            </div>
          </div>

          {/* Table 2: Weekly Digashula & Remedies */}
          <div className="border-r border-slate-300 pr-1 last:border-r-0">
            <div
              className={`font-bold border-b border-slate-300 pb-0.2 mb-0.5 flex items-center gap-1 ${
                colorMode === 'bw' ? 'text-black' : 'text-red-900'
              }`}
            >
              <Compass className="w-2.5 h-2.5" />
              <span>ସାପ୍ତାହିକ ଦିଗଶୂଳ ଓ ଯାତ୍ରା ପ୍ରତିକାର</span>
            </div>

            <div className="grid grid-cols-2 gap-x-1 gap-y-0.2 text-[7.5px] print:text-[6.5px]">
              <div><span className="font-bold text-slate-800">ରବି:</span> {DIGASHULA_DATA[0].directionOr} ({DIGASHULA_DATA[0].remedyOr})</div>
              <div><span className="font-bold text-slate-800">ସୋମ:</span> {DIGASHULA_DATA[1].directionOr} ({DIGASHULA_DATA[1].remedyOr})</div>
              <div><span className="font-bold text-slate-800">ମଙ୍ଗଳ:</span> {DIGASHULA_DATA[2].directionOr} ({DIGASHULA_DATA[2].remedyOr})</div>
              <div><span className="font-bold text-slate-800">ବୁଧ:</span> {DIGASHULA_DATA[3].directionOr} ({DIGASHULA_DATA[3].remedyOr})</div>
              <div><span className="font-bold text-slate-800">ଗୁରୁ:</span> {DIGASHULA_DATA[4].directionOr} ({DIGASHULA_DATA[4].remedyOr})</div>
              <div><span className="font-bold text-slate-800">ଶୁକ୍ର:</span> {DIGASHULA_DATA[5].directionOr} ({DIGASHULA_DATA[5].remedyOr})</div>
              <div className="col-span-2"><span className="font-bold text-slate-800">ଶନି:</span> {DIGASHULA_DATA[6].directionOr} ({DIGASHULA_DATA[6].remedyOr})</div>
            </div>
          </div>

          {/* Table 3: Panjika Shastric Notes */}
          <div>
            <div
              className={`font-bold border-b border-slate-300 pb-0.2 mb-0.5 ${
                colorMode === 'bw' ? 'text-black' : 'text-red-900'
              }`}
            >
              <span>📜 ପାଞ୍ଜିକା ବିଶେଷ ଶାସ୍ତ୍ର ବିଧି</span>
            </div>

            <p className="text-[7.5px] print:text-[6.5px] text-slate-700 leading-normal mb-0.5">
              ମହାପ୍ରଭୁ ଶ୍ରୀଜଗନ୍ନାଥଙ୍କ ନୀତି, ଏକାଦଶୀ ବ୍ରତ, ପୂର୍ଣ୍ଣିମା ଓ ଅମାବାସ୍ୟା ଉଦୟ ତିଥି ଓ ଶାସ୍ତ୍ରୀୟ ବିଦ୍ଧା ନିୟମାନୁସାରେ ନିର୍ଣ୍ଣୀତ।
            </p>
            <div className="text-[7px] print:text-[6px] text-slate-500 font-mono">
              ମୁକ୍ତିମଣ୍ଡପ ପଣ୍ଡିତ ସଭା ସ୍ୱୀକୃତ • ୨୦୨୬-{formatOdiaNum(currentYear)}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Injected dynamic @page style for active orientation
  const dynamicPageStyle = (
    <style>{`
      @media print {
        @page {
          size: A4 ${orientation};
          margin: ${orientation === 'landscape' ? '3mm 4mm' : '4mm 4mm'};
        }
      }
    `}</style>
  );

  // If rendering inside an on-screen preview modal
  if (isPreviewModal) {
    if (typeof document === 'undefined') return null;

    return createPortal(
      <div className="odia-print-modal-overlay fixed inset-0 z-[99999] overflow-y-auto bg-black/95 backdrop-blur-md flex flex-col items-center justify-start p-2 sm:p-4 mobile-touch-scroll-y touch-pan-y cosmic-visible-scrollbar">
        {dynamicPageStyle}

        {/* Advance Print Control Toolbar (Hidden during actual print) */}
        <div className="sticky top-2 z-50 mb-3 bg-slate-900/95 border-2 border-amber-500/70 shadow-2xl rounded-2xl p-3 sm:p-4 max-w-6xl w-full text-white print:hidden backdrop-blur-xl space-y-3">
          {/* Toolbar Header Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-amber-300 font-serif flex items-center gap-2">
                  <span>ଅଗ୍ରଣୀ ଓଡ଼ିଆ କାନ୍ଥ କ୍ୟାଲେଣ୍ଡର ପ୍ରିଣ୍ଟ ଷ୍ଟୁଡିଓ</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>୧-ପୃଷ୍ଠା ଗ୍ୟାରେଣ୍ଟି</span>
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  କୌଣସି ଅଂଶ କଟିବ ନାହିଁ କିମ୍ବା ୨ୟ ପୃଷ୍ଠାକୁ ଯିବ ନାହିଁ • A4 ସାଇଜ୍ ୧୦୦% ଫିଟ୍
                </p>
              </div>
            </div>

            {/* Print & Close Action Buttons */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 text-xs font-black transition-all cursor-pointer shadow-xl shadow-amber-500/30 active:scale-95 touch-manipulation"
              >
                <Printer className="w-4 h-4 text-slate-950" />
                <span>ଏବେ ପ୍ରିଣ୍ଟ / PDF ଡାଉନଲୋଡ୍ କରନ୍ତୁ</span>
              </button>

              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="flex items-center gap-1 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-900/80 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                  title="Close Preview"
                >
                  <X className="w-4 h-4" />
                  <span>ବନ୍ଦ</span>
                </button>
              )}
            </div>
          </div>

          {/* Advance Settings Row (Orientation, Color Mode, Scale, Toggles) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 text-xs">
            {/* Orientation */}
            <div className="flex items-center bg-cosmic-950/80 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setOrientation('landscape')}
                className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-center transition-all cursor-pointer ${
                  orientation === 'landscape'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🖼️ ଆଡ଼ୁଆ (Landscape)
              </button>
              <button
                type="button"
                onClick={() => setOrientation('portrait')}
                className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-center transition-all cursor-pointer ${
                  orientation === 'portrait'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                📄 ସଳଖ (Portrait)
              </button>
            </div>

            {/* Color Mode */}
            <div className="flex items-center bg-cosmic-950/80 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setColorMode('color')}
                className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-center transition-all cursor-pointer ${
                  colorMode === 'color'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🎨 ରଙ୍ଗୀନ
              </button>
              <button
                type="button"
                onClick={() => setColorMode('bw')}
                className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-center transition-all cursor-pointer ${
                  colorMode === 'bw'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🖤 ଇଙ୍କ-ସେଭର୍ (B&W)
              </button>
            </div>

            {/* Zoom / Scale Preset */}
            <div className="flex items-center bg-cosmic-950/80 p-1 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 px-1.5 font-bold">ଜୁମ୍:</span>
              {[100, 95, 90].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setZoomScale(s)}
                  className={`flex-1 py-1.5 px-1 rounded-lg font-mono font-bold text-center transition-all cursor-pointer ${
                    zoomScale === s
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {s}%
                </button>
              ))}
            </div>

            {/* Toggles: Astro Boxes & Bottom Tables */}
            <div className="col-span-2 sm:col-span-1 lg:col-span-2 flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowAstroBoxes(!showAstroBoxes)}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                  showAstroBoxes
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-white/5 text-slate-500 border-slate-800'
                }`}
              >
                <span>{showAstroBoxes ? '✓' : '✗'} ସୂର୍ଯ୍ୟୋଦୟ ଟେବୁଲ୍</span>
              </button>

              <button
                type="button"
                onClick={() => setShowBottomTables(!showBottomTables)}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                  showBottomTables
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-white/5 text-slate-500 border-slate-800'
                }`}
              >
                <span>{showBottomTables ? '✓' : '✗'} ଶୁଭ ମୁହୂର୍ତ୍ତ ଓ ଦିଗଶୂଳ</span>
              </button>

              <button
                type="button"
                onClick={() => setShowFoodRestrictions(!showFoodRestrictions)}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                  showFoodRestrictions
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-white/5 text-slate-500 border-slate-800'
                }`}
              >
                <span>{showFoodRestrictions ? '✓' : '✗'} ଖାଦ୍ୟ ନିଷେଧ</span>
              </button>
            </div>
          </div>
        </div>

        {/* Printable Sheet Viewport (Modal card container) */}
        <div className="odia-print-viewport-wrapper bg-white rounded-2xl shadow-2xl max-w-6xl w-full overflow-hidden border border-slate-400">
          <div className="odia-print-inner-scroll overflow-x-auto p-2 sm:p-4 bg-slate-200/50 flex justify-center">
            {sheetContent}
          </div>
        </div>
      </div>,
      document.body
    );
  }

  // Standalone print sheet for @media print when modal is not active
  return (
    <div className="hidden print:block odia-print-sheet w-full">
      {dynamicPageStyle}
      {sheetContent}
    </div>
  );
};
