import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useI18n } from '../../localization/i18n';
import { createPortal } from 'react-dom';
import {
  ODIA_SOLAR_MONTHS,
  ODISHA_CITIES,
  OdishaCityLocation,
  DynamicOdiaDayInfo,
  calculateOdiaCalendarDay,
  calculateMonthMuhurtas,
  ShubhaMuhurta,
  SRIMANDIR_DAILY_NITI,
  CHHAPANA_BHOGA_LIST,
  ODISHA_ECLIPSES,
  ODIA_PANJIKA_EDITIONS,
  OdiaPanjikaEdition,
  calculatePanjikaComparison,
  PanjikaComparisonEntry,
  calculateNavagrahaSputa,
  NavagrahaSputa,
  GrahaPositionInfo,
  generateVedicSankalpa,
  calculateGhataChakra,
  calculateChoghadiya,
  calculatePlanetaryHoras,
  ChoghadiyaSlot,
  PlanetaryHoraSlot,
  RashiGhataInfo,
  VedicSankalpaData,
  DailyLagnaInfo,
  calculateDailyLagnas,
  SRIMANDIR_32_BESHAS,
  SrimandirBeshaInfo,
  PANJIKA_MIN_YEAR,
  PANJIKA_YEAR_COUNT
} from '../../core/panjika/odia_calendar_engine';

const VEDIC_STOTRA_LIST = [
  {
    id: 'ashtakam',
    nameOr: 'ଶ୍ରୀ ଜଗନ୍ନାଥ ଅଷ୍ଟକମ୍',
    nameHi: 'श्री जगन्नाथ अष्टकम्',
    nameEn: 'Sri Jagannath Ashtakam',
    composerOr: 'ଆଦି ଶଙ୍କରାଚାର୍ଯ୍ୟ କୃତ',
    summaryOr: 'ଶ୍ରୀଜଗନ୍ନାଥଙ୍କ ନୟନପଥଗାମୀ ପ୍ରାର୍ଥନାର ୮ଟି ପରମ କଲ୍ୟାଣକାରୀ ଶ୍ଳୋକ।',
    verses: [
      { num: 1, textOr: 'କଦାଚିତ୍ କାଳିନ୍ଦୀ ତଟ ବିପିନ ସଙ୍ଗୀତ କରବୋ,\nମୁଦାଭୀରୀ ନାରୀ ବଦନ କମଳା ସ୍ୱାଦ ମଧୁପଃ।\nରମାଶମ୍ଭୁ ବ୍ରହ୍ମାମରପତି ଗଣେଶାର୍ଚ୍ଚିତ ପଦୋ,\nଜଗନ୍ନାଥଃ ସ୍ୱାମୀ ନୟନ ପଥଗାମୀ ଭବତୁ ମେ॥' },
      { num: 2, textOr: 'ଭୁଜେ ସବ୍ୟେ ବେଣୁଂ ଶିରସି ଶିଖିପିଞ୍ଛଂ କଟିତଟେ,\nଦୁକୂଳଂ ନେତ୍ରାନ୍ତେ ସହଚର କଟାକ୍ଷଂ ବିଦଧତେ।\nସଦା ଶ୍ରୀମଦ୍ ବୃନ୍ଦାବନ ବସତି ଲୀଳା ପରିଚୟୋ,\nଜଗନ୍ନାଥଃ ସ୍ୱାମୀ ନୟନ ପଥଗାମୀ ଭବତୁ ମେ॥' },
      { num: 3, textOr: 'ମହାମ୍ଭୋଧେସ୍ତୀରେ କନକ ରୁଚିରେ ନୀଳଶିଖରେ,\nବସନ୍ ପ୍ରାସାଦାନ୍ତଃ ସହଜ ବଳଭଦ୍ରେଣ ବଳିନା।\nସୁଭଦ୍ରା ମଧ୍ୟସ୍ଥଃ ସକଳସୁର ସେବାବସରଦୋ,\nଜଗନ୍ନାଥଃ ସ୍ୱାମୀ ନୟନ ପଥଗାମୀ ଭବତୁ ମେ॥' },
      { num: 4, textOr: 'କୃପାପାରାବାରଃ ସଜଳ ଜଳଦ ଶ୍ରେଣୀ ରୁଚିରୋ,\nରମାବାଣୀ ରାମଃ ସ୍ଫୁରଦମଳ ପଙ୍କେରୁହ ମୁଖଃ।\nସୁରେନ୍ଦ୍ରୈରାରାଧ୍ୟଃ ଶ୍ରୁତିଗଣ ଶିଖାଗୀତ ଚରିତୋ,\nଜଗନ୍ନାଥଃ ସ୍ୱାମୀ ନୟନ ପଥଗାମୀ ଭବତୁ ମେ॥' },
      { num: 5, textOr: 'ରଥାରୂଢ଼ୋ ଗଚ୍ଛନ୍ ପଥି ମିଳିତ ଭୂଦେବ ପଟଳୈଃ,\nସ୍ତୁତି ପ୍ରାଦୁର୍ଭାବଂ ପ୍ରତିପଦମୁପାକର୍ଣ୍ଣ୍ୟ ସଦୟଃ।\nଦୟାସିନ୍ଧୁର୍ବନ୍ଧୁଃ ସକଳ ଜଗତାଂ ସିନ୍ଧୁସୁତୟା,\nଜଗନ୍ନାଥଃ ସ୍ୱାମୀ ନୟନ ପଥଗାମୀ ଭବତୁ ମେ॥' },
      { num: 6, textOr: 'ପରଂବ୍ରହ୍ମାପୀଡ଼ଃ କୁବଳୟ ଦଳୋତ୍ଫୁଲ୍ଲ ନୟନୋ,\nନିବାସୀ ନୀଳାଦ୍ରୌ ନିହିତ ଚରଣୋଽନନ୍ତ ଶିରସି।\nରସାନନ୍ଦୋ ରାଧା ସରସ ବପୁରାଲିଙ୍ଗନ ସୁଖୋ,\nଜଗନ୍ନାଥଃ ସ୍ୱାମୀ ନୟନ ପଥଗାମୀ ଭବତୁ ମେ॥' },
      { num: 7, textOr: 'ନ ବୈ ୟାଚେ ରାଜ୍ୟଂ ନ ଚ କନକ ମାଣିକ୍ୟ ବିଭବଂ,\nନ ୟାଚେଽହଂ ରମ୍ୟାଂ ସକଳଜନ କାମ୍ୟାଂ ବରବଧୂମ୍।\nସଦା କାଳେ କାଳେ ପ୍ରମଥପତିନା ଗୀତଚରିତୋ,\nଜଗନ୍ନାଥଃ ସ୍ୱାମୀ ନୟନ ପଥଗାମୀ ଭବତୁ ମେ॥' },
      { num: 8, textOr: 'ହର ତ୍ୱଂ ସଂସାରଂ ଦ୍ରୁତତରମସାରଂ ସୁରପତେ,\nହର ତ୍ୱଂ ପାପାନାଂ ବିତତିମପରାଂ ୟାଦୁପତେ।\nଅହୋ ଦୀନେଽନାଥେ ନିହିତଚରଣୋ ନିଶ୍ଚିତମିଦଂ,\nଜଗନ୍ନାଥଃ ସ୍ୱାମୀ ନୟନ ପଥଗାମୀ ଭବତୁ ମେ॥' }
    ]
  },
  {
    id: 'mrityunjaya',
    nameOr: 'ମହାମୃତ୍ୟୁଞ୍ଜୟ ମନ୍ତ୍ର',
    nameHi: 'महामृत्युंजय मंत्र',
    nameEn: 'Maha Mrityunjaya Mantra',
    composerOr: 'ଋଗ୍ବେଦ ସଂହିତା',
    summaryOr: 'ସର୍ବବିଧ ରୋଗ, ଅକାଳ ମୃତ୍ୟୁ ଭୟ ନିବାରକ ଓ ଆୟୁର୍ବର୍ଦ୍ଧକ ସିଦ୍ଧ ଶୈବ ମନ୍ତ୍ର।',
    verses: [
      {
        num: 1,
        textOr: 'ଓଁ ତ୍ର୍ୟମ୍ବକଂ ୟଜାମହେ ସୁଗନ୍ଧିଂ ପୁଷ୍ଟିବର୍ଦ୍ଧନମ୍।\nଉର୍ବାରୁକମିବ ବନ୍ଧନାନ୍ମୃତ୍ୟୋର୍ମୁକ୍ଷୀୟ ମାମୃତାତ୍॥'
      }
    ]
  },
  {
    id: 'gayatri',
    nameOr: 'ଗାୟତ୍ରୀ ମହାମନ୍ତ୍ର',
    nameHi: 'गायत्री महामंत्र',
    nameEn: 'Gayatri Maha Mantra',
    composerOr: 'ବିଶ୍ୱାମିତ୍ର ଋଷି ପ୍ରୋକ୍ତ',
    summaryOr: 'ସମସ୍ତ ବେଦର ସାର, ବୁଦ୍ଧି ଓ ଆତ୍ମବିଜ୍ଞାନ ଜାଗ୍ରତକାରୀ ଦିବ୍ୟ ସୂର୍ଯ୍ୟ ମନ୍ତ୍ର।',
    verses: [
      {
        num: 1,
        textOr: 'ଓଁ ଭୂର୍ଭୁବଃ ସ୍ୱଃ ତତ୍ସବିତୁର୍ବରେଣ୍ୟଂ\nଭର୍ଗୋ ଦେବସ୍ୟ ଧୀମହି ଧିୟୋ ୟୋ ନଃ ପ୍ରଚୋଦୟାତ୍॥'
      }
    ]
  },
  {
    id: 'navagraha',
    nameOr: 'ନବଗ୍ରହ ଶାନ୍ତି ସ୍ତୋତ୍ର',
    nameHi: 'नवग्रह स्तोत्र',
    nameEn: 'Navagraha Stotram',
    composerOr: 'ବ୍ୟାସଦେବ ପ୍ରଣୀତ',
    summaryOr: 'ରବି, ଚନ୍ଦ୍ର, ମଙ୍ଗଳାଦି ନବଗ୍ରହଙ୍କ ପ୍ରସନ୍ନତା ଓ ଗ୍ରହଦୋଷ ନିବାରଣ ପାଇଁ ନିତ୍ୟ ପଠନୀୟ।',
    verses: [
      {
        num: 1,
        textOr: 'ନମଃ ସୂର୍ଯ୍ୟାୟ ଚନ୍ଦ୍ରାୟ ମଙ୍ଗଳାୟ ବୁଧାୟ ଚ।\nଗୁରୁ ଶୁକ୍ର ଶନିଭ୍ୟଶ୍ଚ ରାହବେ କେତବେ ନମଃ॥'
      }
    ]
  }
];

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Sun,
  Moon,
  Clock,
  Compass,
  MapPin,
  Search,
  Filter,
  Share2,
  CalendarPlus,
  Printer,
  Calendar as CalendarIcon,
  Layers,
  CheckCircle,
  AlertCircle,
  Flame,
  Award,
  BookOpen,
  Scale,
  X,
  ExternalLink,
  Eye,
  SlidersHorizontal,
  Zap,
  MessageCircle,
  Navigation,
  Volume2,
  VolumeX,
  Copy,
  ShieldAlert,
  Hourglass,
  RotateCcw
} from 'lucide-react';
import { OdiaPrintableWallCalendar } from './OdiaPrintableWallCalendar';
import { OdiaAdvancedDailyGuidance } from './OdiaAdvancedDailyGuidance';
import { CosmicBackground3D } from '../home/CosmicBackground3D';
import { DivineHeroSection } from '../home/DivineHeroSection';
import { SevaMandala } from '../home/SevaMandala';
import { MuhurtaMarquee } from '../home/MuhurtaMarquee';
import { DailyShlokaCard } from '../home/DailyShlokaCard';
import {
  ALL_30_ODISHA_DISTRICTS,
  requestMobileGPSLocation,
  getSavedUserLocation,
  saveUserLocation
} from '../../core/geo/mobileLocationService';

type CalendarViewMode = 'month' | 'week' | 'daily' | 'festivals' | 'muhurta' | 'srimandir' | 'eclipses';

const GREGORIAN_MONTH_NAMES = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  hi: ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'],
  or: ['ଜାନୁଆରୀ', 'ଫେବୃଆରୀ', 'ମାର୍ଚ୍ଚ', 'ଏପ୍ରିଲ', 'ମେ', 'ଜୁନ୍', 'ଜୁଲାଇ', 'ଅଗଷ୍ଟ', 'ସେପ୍ଟେମ୍ବର', 'ଅକ୍ଟୋବର', 'ନଭେମ୍ବର', 'ଡିସେମ୍ବର']
};

export const OdiaCalendarView: React.FC = () => {
  const { t, language, formatNumber, tTithiFromKey, tVaara, formatTime, tNakshatra, tYoga, tKarana } = useI18n();

  const today = useMemo(() => new Date(), []);
  const [currentYear, setCurrentYear] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const y = params.get('year');
      if (y && !isNaN(Number(y))) return Number(y);
    }
    return today.getFullYear();
  });
  const [currentMonth, setCurrentMonth] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const m = params.get('month');
      if (m && !isNaN(Number(m))) return Number(m);
    }
    return today.getMonth();
  });
  const [selectedDay, setSelectedDay] = useState<number>(today.getDate());
  const [selectedCity, setSelectedCity] = useState<OdishaCityLocation>(() => getSavedUserLocation() || ODISHA_CITIES[0]); // Saved or Default Puri
  const [isLocatingGPS, setIsLocatingGPS] = useState<boolean>(false);
  const [selectedPanjika, setSelectedPanjika] = useState<OdiaPanjikaEdition>(ODIA_PANJIKA_EDITIONS[0]); // Default Kohinoor
  const [viewMode, setViewMode] = useState<CalendarViewMode>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const v = params.get('view');
      if (v && ['month', 'week', 'daily', 'festivals', 'muhurta', 'srimandir', 'eclipses'].includes(v)) {
        return v as CalendarViewMode;
      }
    }
    return 'month';
  });
  const [inspectorTab, setInspectorTab] = useState<'panchanga' | 'choghadiya' | 'lagna' | 'ghata' | 'sankalpa' | 'astrology' | 'navagraha'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam && ['panchanga', 'choghadiya', 'lagna', 'ghata', 'sankalpa', 'astrology', 'navagraha'].includes(tabParam)) {
        return tabParam as 'panchanga' | 'choghadiya' | 'lagna' | 'ghata' | 'sankalpa' | 'astrology' | 'navagraha';
      }
    }
    return 'panchanga';
  });

  // Advanced Vedic Features States: Choghadiya, Ghata Chakra & Sankalpa
  const [choghadiyaViewPeriod, setChoghadiyaViewPeriod] = useState<'day' | 'night' | 'hora'>('day');
  const [selectedGhataRashiIdx, setSelectedGhataRashiIdx] = useState<number>(0); // 0 = Mesha
  const [sankalpaDevoteeName, setSankalpaDevoteeName] = useState<string>('');
  const [sankalpaGotra, setSankalpaGotra] = useState<string>('');
  const [sankalpaPurpose, setSankalpaPurpose] = useState<string>('ଦୈନିକ ନିତ୍ୟପୂଜା ଓ ଶ୍ରୀଜଗନ୍ନାଥ ପ୍ରୀତି');
  const [isPlayingSankalpaAudio, setIsPlayingSankalpaAudio] = useState<boolean>(false);
  const [sankalpaMode, setSankalpaMode] = useState<'sankalpa' | 'stotras'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const sm = params.get('sankalpaMode');
      if (sm && ['sankalpa', 'stotras'].includes(sm)) return sm as 'sankalpa' | 'stotras';
    }
    return 'sankalpa';
  });
  const [selectedStotraId, setSelectedStotraId] = useState<string>('ashtakam');
  const [japaTarget, setJapaTarget] = useState<number>(1);
  const [currentJapaCount, setCurrentJapaCount] = useState<number>(0);

  // Interactive Month Grid Filter & Tithi Search
  const [gridFilter, setGridFilter] = useState<'all' | 'ekadashi' | 'purnima_amavasya' | 'sankranti' | 'besha' | 'muhurta' | 'holiday'>('all');
  const [gridSearchQuery, setGridSearchQuery] = useState<string>('');

  // 6 Panjikas Comparison Matrix Modal
  const [isPanjikaCompareOpen, setIsPanjikaCompareOpen] = useState<boolean>(false);

  // Festival search & filter states
  const [festivalSearchQuery, setFestivalSearchQuery] = useState<string>('');
  const [festivalFilterType, setFestivalFilterType] = useState<'all' | 'major' | 'ekadashi' | 'sankranti' | 'jagannath' | 'holiday'>('all');
  const [copiedToast, setCopiedToast] = useState<string | null>(null);
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState<boolean>(false);

  // Muhurta, Srimandir & 3D state hooks
  const [muhurtaFilterType, setMuhurtaFilterType] = useState<'all' | 'vivaha' | 'bratopanayana' | 'gruhapravesha' | 'vahana' | 'vyavasaya' | 'namakarana' | 'bhoomipuja'>('all');
  const [srimandirTab, setSrimandirTab] = useState<'niti' | 'bhoga' | 'besha'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const s = params.get('srimandirTab');
      if (s && ['niti', 'bhoga', 'besha'].includes(s)) return s as 'niti' | 'bhoga' | 'besha';
    }
    return 'niti';
  });
  const [bhogaSearchQuery, setBhogaSearchQuery] = useState<string>('');
  const [bhogaCategoryFilter, setBhogaCategoryFilter] = useState<'all' | 'sukhila' | 'sankhudi' | 'dugdhajata'>('all');
  const [beshaSearchQuery, setBeshaSearchQuery] = useState<string>('');
  const [eclipseFilterYear, setEclipseFilterYear] = useState<number>(currentYear);

  // Calculate Shubha Muhurtas for the currently selected year and month
  const monthMuhurtas = useMemo(() => {
    return calculateMonthMuhurtas(currentYear, currentMonth, selectedCity.lat, selectedCity.lon, selectedPanjika.id);
  }, [currentYear, currentMonth, selectedCity, selectedPanjika]);

  // Filtered Muhurtas
  const filteredMuhurtas = useMemo(() => {
    if (muhurtaFilterType === 'all') return monthMuhurtas;
    return monthMuhurtas.filter(m => m.type === muhurtaFilterType);
  }, [monthMuhurtas, muhurtaFilterType]);

  // Filtered 56 Bhogas
  const filteredBhogas = useMemo(() => {
    return CHHAPANA_BHOGA_LIST.filter(b => {
      const matchCat = bhogaCategoryFilter === 'all' || b.category === bhogaCategoryFilter;
      const q = bhogaSearchQuery.toLowerCase().trim();
      const matchQ = !q || b.nameOr.toLowerCase().includes(q) || b.nameHi.toLowerCase().includes(q) || b.nameEn.toLowerCase().includes(q) || b.mainIngredients.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [bhogaSearchQuery, bhogaCategoryFilter]);

  // Filtered 32 Sacred Beshas
  const filteredBeshas = useMemo(() => {
    return SRIMANDIR_32_BESHAS.filter(b => {
      const q = beshaSearchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        b.nameOr.toLowerCase().includes(q) ||
        b.nameHi.toLowerCase().includes(q) ||
        b.nameEn.toLowerCase().includes(q) ||
        b.occasionOr.toLowerCase().includes(q) ||
        b.monthNameOr.toLowerCase().includes(q) ||
        b.attireOr.toLowerCase().includes(q) ||
        b.significanceOr.toLowerCase().includes(q)
      );
    });
  }, [beshaSearchQuery]);

  // Swipe navigation ref
  const touchStartX = useRef<number>(0);

  // Month metadata
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayWeekday = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun

  // Ensure selectedDay stays within month bounds
  useEffect(() => {
    if (selectedDay > daysInMonth) {
      setSelectedDay(daysInMonth);
    }
  }, [daysInMonth, selectedDay]);

  // Compute all day panjika infos for the current month
  const monthDays = useMemo(() => {
    const list: DynamicOdiaDayInfo[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(currentYear, currentMonth, d);
      list.push(calculateOdiaCalendarDay(dt, selectedCity.lat, selectedCity.lon, selectedPanjika.id));
    }
    return list;
  }, [currentYear, currentMonth, daysInMonth, selectedCity, selectedPanjika]);

  // Selected day full details
  const selectedDayInfo = useMemo(() => {
    const target = monthDays.find(d => d.dayOfMonth === selectedDay);
    if (target) return target;
    const dt = new Date(currentYear, currentMonth, selectedDay || 1);
    return calculateOdiaCalendarDay(dt, selectedCity.lat, selectedCity.lon, selectedPanjika.id);
  }, [monthDays, selectedDay, currentYear, currentMonth, selectedCity, selectedPanjika]);

  // 6 Canonical Panjikas Comparison Data for selected day
  const panjikaComparisonList = useMemo(() => {
    return calculatePanjikaComparison(selectedDayInfo.date, selectedCity.lat, selectedCity.lon);
  }, [selectedDayInfo, selectedCity]);

  // Upcoming Festivals of the Month for the Countdown Carousel
  const upcomingMonthFestivals = useMemo(() => {
    const list: Array<{
      dayOfMonth: number;
      festival: DynamicOdiaDayInfo['festivals'][0];
      date: Date;
      dayInfo: DynamicOdiaDayInfo;
      daysDiff: number;
    }> = [];

    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    for (const day of monthDays) {
      for (const fest of day.festivals) {
        const targetDate = new Date(currentYear, currentMonth, day.dayOfMonth);
        const diffTime = targetDate.getTime() - todayMidnight.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        list.push({
          dayOfMonth: day.dayOfMonth,
          festival: fest,
          date: targetDate,
          dayInfo: day,
          daysDiff: diffDays
        });
      }
    }
    return list.sort((a, b) => a.dayOfMonth - b.dayOfMonth);
  }, [monthDays, currentYear, currentMonth, today]);

  // Horizontal scroll ref & state for Month Festivals Quick Carousel
  const festivalCarouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);
  const isDraggingFestivals = useRef<boolean>(false);
  const dragStartX = useRef<number>(0);
  const dragScrollLeft = useRef<number>(0);

  // Category filter toolbar ref
  const filterPillsRef = useRef<HTMLDivElement>(null);

  const checkCarouselScroll = () => {
    const el = festivalCarouselRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 5);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
    }
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    const el = festivalCarouselRef.current;
    if (el) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkCarouselScroll, 350);
    }
  };

  useEffect(() => {
    checkCarouselScroll();
    const el = festivalCarouselRef.current;
    if (!el) return;
    const handleScroll = () => checkCarouselScroll();
    el.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      el.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [upcomingMonthFestivals]);

  const handleCarouselMouseDown = (e: React.MouseEvent) => {
    const el = festivalCarouselRef.current;
    if (!el) return;
    isDraggingFestivals.current = true;
    dragStartX.current = e.pageX - el.offsetLeft;
    dragScrollLeft.current = el.scrollLeft;
  };

  const handleCarouselMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingFestivals.current) return;
    const el = festivalCarouselRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - dragStartX.current) * 1.5;
    el.scrollLeft = dragScrollLeft.current - walk;
    checkCarouselScroll();
  };

  const handleCarouselMouseUp = () => {
    isDraggingFestivals.current = false;
  };

  const handleCarouselWheel = (e: React.WheelEvent) => {
    const el = festivalCarouselRef.current;
    if (!el) return;
    if (e.deltaY !== 0) {
      e.currentTarget.scrollLeft += e.deltaY;
      checkCarouselScroll();
    }
  };

  // Mobile GPS Live Location Detection Handler
  const handleDetectGPS = async () => {
    setIsLocatingGPS(true);
    try {
      const result = await requestMobileGPSLocation();
      setSelectedCity(result.location);
      saveUserLocation(result.location);
      setCopiedToast(result.message[language]);
      setTimeout(() => setCopiedToast(null), 4500);
    } catch {
      setCopiedToast(language === 'or' ? 'GPS ସ୍ଥାନ ସନ୍ଧାନ ବିଫଳ ହେଲା' : 'GPS detection failed');
      setTimeout(() => setCopiedToast(null), 3000);
    } finally {
      setIsLocatingGPS(false);
    }
  };

  // Dynamic Vedic Sankalpa Text Generation
  const currentSankalpa = useMemo(() => {
    return generateVedicSankalpa(
      selectedDayInfo,
      selectedCity,
      sankalpaDevoteeName.trim() || 'ଭକ୍ତ',
      sankalpaGotra.trim() || 'କାଶ୍ୟପ',
      sankalpaPurpose.trim() || 'ଦୈନିକ ନିତ୍ୟପୂଜା ଓ ଶ୍ରୀଜଗନ୍ନାଥ ପ୍ରୀତି'
    );
  }, [selectedDayInfo, selectedCity, sankalpaDevoteeName, sankalpaGotra, sankalpaPurpose]);

  // Audio Recitation Toggle
  const toggleSankalpaAudio = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setCopiedToast(language === 'or' ? 'ଆପଣଙ୍କ ବ୍ରାଉଜରରେ Speech ସୁବିଧା ଉପଲବ୍ଧ ନାହିଁ' : 'Audio speech not supported');
      setTimeout(() => setCopiedToast(null), 3000);
      return;
    }
    if (isPlayingSankalpaAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingSankalpaAudio(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    utterance.lang = 'hi-IN';
    utterance.onend = () => setIsPlayingSankalpaAudio(false);
    utterance.onerror = () => setIsPlayingSankalpaAudio(false);
    window.speechSynthesis.speak(utterance);
    setIsPlayingSankalpaAudio(true);
  };

  // Cancel audio speech when changing days or views
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [selectedDay, currentMonth, currentYear, inspectorTab]);

  // Matching check for Grid Filter & Search
  const isDayMatchingFilter = (dayInfo: DynamicOdiaDayInfo): boolean => {
    if (gridSearchQuery.trim()) {
      const q = gridSearchQuery.trim().toLowerCase();
      const matchFest = dayInfo.festivals.some(f =>
        f.nameOr.toLowerCase().includes(q) ||
        f.nameHi.toLowerCase().includes(q) ||
        f.nameEn.toLowerCase().includes(q) ||
        f.descriptionOr.toLowerCase().includes(q)
      );
      const matchTithi = tTithiFromKey(dayInfo.panjika.tithi.nameKey).toLowerCase().includes(q);
      const matchVaara = tVaara(dayInfo.panjika.vaara).toLowerCase().includes(q);
      const matchBesha = dayInfo.jagannathBesha && (
        dayInfo.jagannathBesha.or.toLowerCase().includes(q) ||
        dayInfo.jagannathBesha.en.toLowerCase().includes(q)
      );
      if (!matchFest && !matchTithi && !matchVaara && !matchBesha) return false;
    }

    if (gridFilter === 'all') return true;
    if (gridFilter === 'ekadashi') return dayInfo.isEkadashi;
    if (gridFilter === 'purnima_amavasya') return dayInfo.isPurnima || dayInfo.isAmavasya;
    if (gridFilter === 'sankranti') return dayInfo.isSankranti;
    if (gridFilter === 'besha') return !!dayInfo.jagannathBesha;
    if (gridFilter === 'muhurta') {
      return monthMuhurtas.some(m => m.date.getDate() === dayInfo.dayOfMonth);
    }
    if (gridFilter === 'holiday') {
      return dayInfo.festivals.some(f => f.isGovernmentHoliday);
    }
    return true;
  };

  const matchingDaysCount = useMemo(() => {
    return monthDays.filter(d => isDayMatchingFilter(d)).length;
  }, [monthDays, gridFilter, gridSearchQuery]);

  // 1-Click Google Calendar Sync
  const handleGoogleCalendarSync = (info: DynamicOdiaDayInfo) => {
    const d = info.date;
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const dateFormatted = `${y}${m}${day}`;
    
    const nextDay = new Date(info.date);
    nextDay.setDate(nextDay.getDate() + 1);
    const endDateFormatted = `${nextDay.getFullYear()}${String(nextDay.getMonth() + 1).padStart(2, '0')}${String(nextDay.getDate()).padStart(2, '0')}`;
    
    const fest = info.festivals[0];
    const title = fest
      ? `${fest[language === 'or' ? 'nameOr' : 'nameEn']} - ଓଡ଼ିଆ କ୍ୟାଲେଣ୍ଡର ${formatNumber(currentYear)}`
      : `${tTithiFromKey(info.panjika.tithi.nameKey)} - ଓଡ଼ିଆ ପାଞ୍ଜି`;
    const details = `ଓଡ଼ିଆ ସୌର ଦିବସ: ${formatNumber(info.odiaSolarDay)} ${info.odiaSolarMonth[language === 'or' ? 'nameOr' : 'nameEn']}\n` +
      `ତିଥି: ${tTithiFromKey(info.panjika.tithi.nameKey)} (${info.tithiTiming?.durationStrOr || ''})\n` +
      `ନକ୍ଷତ୍ର: ${tNakshatra(info.panjika.nakshatra.nameKey)}\n` +
      `ଶୁଭ ଅଭିଜିତ୍: ${formatTimeRange(info.panjika.muhurtas.abhijit.start, info.panjika.muhurtas.abhijit.end)}\n` +
      `ଖାଦ୍ୟ ନିଷେଧ: ${info.foodRestrictionOr}\n` +
      `ପାଞ୍ଜିକା: ${selectedPanjika.nameOr} (${selectedPanjika.authorityOr})`;
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${dateFormatted}/${endDateFormatted}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(selectedCity.nameOr)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // 1-Click WhatsApp Share
  const handleWhatsAppShare = (info: DynamicOdiaDayInfo) => {
    const abhijitRange = formatTimeRange(info.panjika.muhurtas.abhijit.start, info.panjika.muhurtas.abhijit.end);
    const dateFormatted = `${formatNumber(info.dayOfMonth)} ${GREGORIAN_MONTH_NAMES[language][info.gregorianMonth]} ${formatNumber(info.gregorianYear)}`;
    const solarDayFormatted = `${formatNumber(info.odiaSolarDay)} ${info.odiaSolarMonth[language === 'or' ? 'nameOr' : 'nameEn']}`;

    const text = language === 'or'
      ? `🌟 ଦିବ୍ୟଜ୍ୟୋତି କାଳିଆ ପାଞ୍ଜି ${formatNumber(currentYear)} (${selectedPanjika.nameOr}) 🌟\n` +
        `📅 ତାରିଖ: ${dateFormatted} (${tVaara(info.panjika.vaara)})\n` +
        `🕉️ ସୌର ଦିବସ: ${solarDayFormatted}\n` +
        `🌙 ତିଥି: ${tTithiFromKey(info.panjika.tithi.nameKey)} ${info.tithiTiming?.durationStrOr ? `(${info.tithiTiming.durationStrOr})` : ''}\n` +
        `⭐ ନକ୍ଷତ୍ର: ${tNakshatra(info.panjika.nakshatra.nameKey)} ${info.nakshatraTiming?.durationStrOr ? `(${info.nakshatraTiming.durationStrOr})` : ''}\n` +
        `☀️ ସୂର୍ଯ୍ୟୋଦୟ: ${formatTime(info.panjika.sunrise)} | ସୂର୍ଯ୍ୟାସ୍ତ: ${formatTime(info.panjika.sunset)}\n` +
        `✨ ଶୁଭ ଅଭିଜିତ୍: ${abhijitRange}\n` +
        `🧭 ଦିଗଶୂଳ: ${info.digashula?.directionOr || 'କିଛି ନାହିଁ'} (${info.digashula?.remedyOr || ''})\n` +
        `🚫 ଖାଦ୍ୟ ନିଷେଧ: ${info.foodRestrictionOr}\n` +
        (info.festivals.length > 0 ? `🚩 ପର୍ବ: ${info.festivals[0].nameOr}\n` : '') +
        (info.jagannathBesha ? `👑 ଶ୍ରୀମନ୍ଦିର ବେଶ: ${info.jagannathBesha.or}\n` : '') +
        `📍 ସ୍ଥାନ: ${selectedCity.nameOr}`
      : `🌟 DivyaJyoti Kalia Panjika ${currentYear} (${selectedPanjika.nameEn}) 🌟\n` +
        `📅 Date: ${dateFormatted} (${tVaara(info.panjika.vaara)})\n` +
        `🕉️ Odia Solar: ${solarDayFormatted}\n` +
        `🌙 Tithi: ${tTithiFromKey(info.panjika.tithi.nameKey)}\n` +
        `⭐ Nakshatra: ${tNakshatra(info.panjika.nakshatra.nameKey)}\n` +
        `☀️ Sunrise: ${formatTime(info.panjika.sunrise)} | Sunset: ${formatTime(info.panjika.sunset)}\n` +
        `✨ Abhijit: ${abhijitRange}\n` +
        `📍 City: ${selectedCity.nameEn}`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };


  // Current primary Odia Solar month for the month view
  const primaryOdiaSolarMonth = monthDays[Math.floor(monthDays.length / 2)]?.odiaSolarMonth || ODIA_SOLAR_MONTHS[0];

  // Month Navigation
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const jumpToToday = () => {
    const now = new Date();
    const isAlreadyToday = currentYear === now.getFullYear() && currentMonth === now.getMonth() && selectedDay === now.getDate();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
    setSelectedDay(now.getDate());

    const dayName = `${formatNumber(now.getDate())} ${GREGORIAN_MONTH_NAMES[language][now.getMonth()]}`;
    setCopiedToast(
      isAlreadyToday
        ? (language === 'or' ? `ଆପଣ ବର୍ତ୍ତମାନ ଆଜିର ତାରିଖରେ ହିଁ ଅଛନ୍ତି (${dayName})` : language === 'hi' ? `आप आज की तारीख पर ही हैं (${dayName})` : `Already on today (${dayName})`)
        : (language === 'or' ? `ଆଜିର ତାରିଖକୁ ଫେରିଲେ (${dayName})` : language === 'hi' ? `आज की तारीख पर लौटे (${dayName})` : `Jumped to today (${dayName})`)
    );
    setTimeout(() => setCopiedToast(null), 2500);
  };

  // Touch Swipe handlers for mobile calendar
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX.current;
    if (diff > 60) {
      prevMonth();
    } else if (diff < -60) {
      nextMonth();
    }
  };

  // All festivals in the current year
  const allYearFestivals = useMemo(() => {
    const map = new Map<string, { festival: DynamicOdiaDayInfo['festivals'][0]; date: Date; odiaInfo: DynamicOdiaDayInfo }>();
    for (let m = 0; m < 12; m++) {
      const daysCount = new Date(currentYear, m + 1, 0).getDate();
      for (let d = 1; d <= daysCount; d++) {
        const dt = new Date(currentYear, m, d);
        const info = calculateOdiaCalendarDay(dt, selectedCity.lat, selectedCity.lon, selectedPanjika.id);
        for (const fest of info.festivals) {
          const key = `${fest.id}_${fest.nameOr}_${dt.getMonth()}_${dt.getDate()}`;
          if (!map.has(key)) {
            map.set(key, { festival: fest, date: dt, odiaInfo: info });
          }
        }
      }
    }
    return Array.from(map.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [currentYear, selectedCity, selectedPanjika]);

  // Filtered festivals for search & category pills
  const filteredYearFestivals = useMemo(() => {
    return allYearFestivals.filter(item => {
      const q = festivalSearchQuery.trim().toLowerCase();
      const matchesSearch = !q ||
        item.festival.nameOr.toLowerCase().includes(q) ||
        item.festival.nameHi.toLowerCase().includes(q) ||
        item.festival.nameEn.toLowerCase().includes(q) ||
        item.festival.descriptionOr.toLowerCase().includes(q) ||
        item.festival.descriptionEn.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (festivalFilterType === 'all') return true;
      if (festivalFilterType === 'major') return item.festival.type === 'major';
      if (festivalFilterType === 'ekadashi') return item.odiaInfo.isEkadashi;
      if (festivalFilterType === 'sankranti') return item.festival.type === 'sankranti' || item.odiaInfo.isSankranti;
      if (festivalFilterType === 'jagannath') return item.festival.nameOr.includes('ରଥ') || item.festival.nameOr.includes('ବେଶ') || item.odiaInfo.jagannathBesha;
      if (festivalFilterType === 'holiday') return !!item.festival.isGovernmentHoliday;

      return true;
    });
  }, [allYearFestivals, festivalSearchQuery, festivalFilterType]);

  // Share Day Summary with Web Share API and Clipboard Fallback
  const handleShareDay = async (info: DynamicOdiaDayInfo) => {
    const abhijitRange = formatTimeRange(info.panjika.muhurtas.abhijit.start, info.panjika.muhurtas.abhijit.end);
    const dateFormatted = `${formatNumber(info.dayOfMonth)} ${GREGORIAN_MONTH_NAMES[language][info.gregorianMonth]} ${formatNumber(info.gregorianYear)}`;
    const solarDayFormatted = `${formatNumber(info.odiaSolarDay)} ${info.odiaSolarMonth[language === 'or' ? 'nameOr' : language === 'hi' ? 'nameHi' : 'nameEn']}`;

    const text = language === 'or'
      ? `🌟 ଦିବ୍ୟଜ୍ୟୋତି କାଳିଆ ପାଞ୍ଜି ${formatNumber(currentYear)} (${selectedPanjika.nameOr}) 🌟\n` +
        `📅 ତାରିଖ: ${dateFormatted} (${tVaara(info.panjika.vaara)})\n` +
        `🕉️ ଓଡ଼ିଆ ସୌର: ${solarDayFormatted}\n` +
        `🌙 ତିଥି: ${tTithiFromKey(info.panjika.tithi.nameKey)} ${info.tithiTiming?.durationStrOr ? `(${info.tithiTiming.durationStrOr})` : ''}\n` +
        `⭐ ନକ୍ଷତ୍ର: ${tNakshatra(info.panjika.nakshatra.nameKey)} ${info.nakshatraTiming?.durationStrOr ? `(${info.nakshatraTiming.durationStrOr})` : ''}\n` +
        `☀️ ସୂର୍ଯ୍ୟୋଦୟ: ${info.panjika.sunrise} | ସୂର୍ଯ୍ୟାସ୍ତ: ${info.panjika.sunset}\n` +
        `✨ ଶୁଭ ଅଭିଜିତ୍: ${abhijitRange}\n` +
        `🧭 ଦିଗଶୂଳ: ${info.digashula?.directionOr || 'କିଛି ନାହିଁ'} (${info.digashula?.remedyOr || ''})\n` +
        `🚫 ଖାଦ୍ୟ ନିଷେଧ: ${info.foodRestrictionOr}\n` +
        `📍 ସ୍ଥାନ: ${selectedCity.nameOr}`
      : `🌟 DivyaJyoti Kalia Panjika ${currentYear} (${selectedPanjika.nameEn}) 🌟\n` +
        `📅 Date: ${dateFormatted} (${tVaara(info.panjika.vaara)})\n` +
        `🕉️ Odia Solar: ${solarDayFormatted}\n` +
        `🌙 Tithi: ${tTithiFromKey(info.panjika.tithi.nameKey)}\n` +
        `⭐ Nakshatra: ${tNakshatra(info.panjika.nakshatra.nameKey)}\n` +
        `☀️ Sunrise: ${info.panjika.sunrise} | Sunset: ${info.panjika.sunset}\n` +
        `✨ Abhijit Muhurta: ${abhijitRange}\n` +
        `🧭 Digashula: ${info.digashula?.directionEn || ''}\n` +
        `🚫 Food Restriction: ${info.foodRestrictionOr}\n` +
        `📍 City: ${selectedCity.nameEn}`;

    // Try Web Share API (WhatsApp / Telegram / Native Share on Mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: `ଓଡ଼ିଆ ପାଞ୍ଜି - ${dateFormatted}`,
          text: text
        });
        return;
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
      }
    }

    // Fallback to Clipboard copy
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedToast(language === 'or' ? 'ପାଞ୍ଜି ବିବରଣୀ କପି ହୋଇଛି! (WhatsApp ରେ ସେୟାର୍ କରନ୍ତୁ)' : language === 'hi' ? 'पंचांग विवरण कॉपी हुआ!' : 'Panjika details copied to clipboard!');
    } catch {
      setCopiedToast(language === 'or' ? 'କପି କରିବାରେ ତ୍ରୁଟି ହେଲା' : 'Failed to copy');
    }
    setTimeout(() => setCopiedToast(null), 2500);
  };

  // Download iCal (.ics) for Google/Apple Calendar
  const downloadIcsEvent = (eventName: string, date: Date, description: string) => {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    const dateStr = `${y}${m}${d}`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      `PRODID:-//DivyaJyoti Kalia Panjika//Odia Calendar ${currentYear}//EN`,
      'BEGIN:VEVENT',
      `UID:event-${Date.now()}@divyajyoti.panjika`,
      `DTSTAMP:${dateStr}T000000Z`,
      `DTSTART;VALUE=DATE:${dateStr}`,
      `DTEND;VALUE=DATE:${dateStr}`,
      `SUMMARY:${eventName}`,
      `DESCRIPTION:${description}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${eventName.replace(/\s+/g, '_')}_${dateStr}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const WEEKDAY_NAMES = {
    en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    hi: ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'],
    or: ['ରବି', 'ସୋମ', 'ମଙ୍ଗଳ', 'ବୁଧ', 'ଗୁରୁ', 'ଶୁକ୍ର', 'ଶନି']
  };

  // Smart Odia Time Range Formatter (Eliminating repetitive AM/PM and ensuring pure Odia)
  const formatTimeRange = (startStr: string, endStr: string): string => {
    if (!startStr || !endStr) return '';
    if (language === 'or') {
      const parseH = (s: string) => {
        const parts = s.trim().split(/[:\s]/);
        let h = parseInt(parts[0], 10) || 0;
        const m = parseInt(parts[1], 10) || 0;
        const isPM = s.toUpperCase().includes('PM');
        if (isPM && h !== 12) h += 12;
        if (!isPM && h === 12) h = 0;
        return { h, m, total: h * 60 + m };
      };
      const p1 = parseH(startStr);
      const p2 = parseH(endStr);
      let period = 'ଦିବା';
      if (p1.h >= 4 && p1.h < 8) period = 'ପ୍ରାତଃ';
      else if (p1.h >= 8 && p1.h < 12) period = 'ପୂର୍ବାହ୍ନ';
      else if (p1.h >= 12 && p1.h < 16) period = 'ଦିବା';
      else if (p1.h >= 16 && p1.h < 19) period = 'ଅପରାହ୍ନ';
      else if (p1.h >= 19 && p1.h < 23) period = 'ସନ୍ଧ୍ୟା/ରାତ୍ର';
      else period = 'ନିଶୀଥ';

      const d1H = p1.h % 12 === 0 ? 12 : p1.h % 12;
      const d2H = p2.h % 12 === 0 ? 12 : p2.h % 12;
      const s1 = `${formatNumber(d1H.toString().padStart(2, '0'))}:${formatNumber(p1.m.toString().padStart(2, '0'))}`;
      const s2 = `${formatNumber(d2H.toString().padStart(2, '0'))}:${formatNumber(p2.m.toString().padStart(2, '0'))}`;
      return `${period} ${s1} ରୁ ${s2}`;
    }
    return `${formatTime(startStr)} – ${formatTime(endStr)}`;
  };


  // Check if a time range is currently active (e.g. Abhijit Muhurta, Rahu Kaal)
  const isTimeActiveNow = (startStr: string, endStr: string, isTodayDay: boolean): boolean => {
    if (!isTodayDay || !startStr || !endStr) return false;
    try {
      const parseM = (s: string) => {
        const parts = s.trim().split(/[:\s]/);
        let h = parseInt(parts[0], 10) || 0;
        const m = parseInt(parts[1], 10) || 0;
        const isPM = s.toUpperCase().includes('PM');
        if (isPM && h !== 12) h += 12;
        if (!isPM && h === 12) h = 0;
        return h * 60 + m;
      };
      const now = new Date();
      const curM = now.getHours() * 60 + now.getMinutes();
      const startM = parseM(startStr);
      const endM = parseM(endStr);
      if (endM >= startM) {
        return curM >= startM && curM <= endM;
      } else {
        return curM >= startM || curM <= endM;
      }
    } catch {
      return false;
    }
  };

  // Moon Phase Icon helper
  const getMoonIcon = (tithiNum: number, isPurnima: boolean, isAmavasya: boolean) => {
    if (isPurnima) return '🌕';
    if (isAmavasya) return '🌑';
    if (tithiNum === 8) return '🌓';
    if (tithiNum === 23) return '🌗';
    if (tithiNum < 8) return '🌒';
    if (tithiNum < 15) return '🌔';
    if (tithiNum < 23) return '🌖';
    return '🌘';
  };

  return (
    <>
      {/* 1. Dedicated Authentic Odia Wall Calendar Sheet for Printing (when preview modal is not active) */}
      {!isPrintPreviewOpen && (
        <OdiaPrintableWallCalendar
          currentYear={currentYear}
          currentMonth={currentMonth}
          selectedCity={selectedCity}
          selectedPanjika={selectedPanjika}
          monthDays={monthDays}
          monthMuhurtas={monthMuhurtas}
          primaryOdiaSolarMonth={primaryOdiaSolarMonth}
        />
      )}

      {/* 2. On-screen Print Preview Modal */}
      {isPrintPreviewOpen && (
        <OdiaPrintableWallCalendar
          currentYear={currentYear}
          currentMonth={currentMonth}
          selectedCity={selectedCity}
          selectedPanjika={selectedPanjika}
          monthDays={monthDays}
          monthMuhurtas={monthMuhurtas}
          primaryOdiaSolarMonth={primaryOdiaSolarMonth}
          isPreviewModal={true}
          onClose={() => setIsPrintPreviewOpen(false)}
        />
      )}

      {/* 2.5. 6 Panjikas Comparison Matrix Modal */}
      {isPanjikaCompareOpen && createPortal(
        <div className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-xl p-2 sm:p-6 flex items-center justify-center animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl bg-gradient-to-b from-cosmic-950 via-[#0d1b33] to-cosmic-950 border-2 border-cosmic-gold/50 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            {/* Decorative Gold Glows */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Modal Sticky Header */}
            <div className="sticky top-0 z-20 bg-cosmic-950/95 backdrop-blur-md p-3.5 sm:p-5 border-b border-cosmic-gold/30 flex items-center justify-between gap-3 shrink-0">
              <div className="min-w-0">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cosmic-gold/15 border border-cosmic-gold/30 text-[10px] sm:text-xs font-bold text-cosmic-gold mb-1">
                  <Scale className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="truncate">ଓଡ଼ିଶାର ୬ଟି ମୁଖ୍ୟ ପ୍ରାମାଣିକ ପାଞ୍ଜିକା ତୁଳନା ସାରଣୀ</span>
                </div>
                <h2 className="text-sm sm:text-xl font-black text-white font-serif truncate">
                  {formatNumber(selectedDayInfo.dayOfMonth)} {GREGORIAN_MONTH_NAMES[language][currentMonth]} {formatNumber(currentYear)} • {formatNumber(selectedDayInfo.odiaSolarDay)} {selectedDayInfo.odiaSolarMonth.nameOr} ({tVaara(selectedDayInfo.panjika.vaara)})
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 line-clamp-1 sm:line-clamp-none">
                  କୋହିନୂର, ଖଡ଼ିରତ୍ନ, ରାଧାରମଣ, ଭାଗ୍ୟଜ୍ୟୋତି, ବିରଜା ଓ ଶ୍ରୀମନ୍ଦିର ମୁକ୍ତିମଣ୍ଡପ ଶାସନ ପାଞ୍ଜିକାର ସୂକ୍ଷ୍ମ ତିଥି-ନକ୍ଷତ୍ର ଗଣନା ଓ ଶାସ୍ତ୍ରୀୟ ବିଧି।
                </p>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] sm:text-xs font-semibold text-amber-300 mt-1.5 w-fit">
                  <span>👆👇</span>
                  <span>{language === 'or' ? 'ମୋବାଇଲ୍ ସ୍କ୍ରିନ୍‌ରେ ଛୁଇଁ ସ୍କ୍ରୋଲ୍ କରନ୍ତୁ କିମ୍ବା ଡାହାଣ ପଟ ସ୍କ୍ରୋଲ୍ ବାର୍ ବ୍ୟବହାର କରନ୍ତୁ' : language === 'hi' ? 'स्क्रीन को टच करके स्क्रॉल करें या साइड स्क्रोल बार यूज़ करें' : 'Swipe anywhere or use the scrollbar to scroll'}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPanjikaCompareOpen(false)}
                className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white/10 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-white/10 hover:border-rose-500/40 transition-all cursor-pointer shadow-lg shrink-0 touch-manipulation active:scale-95"
                title="ବନ୍ଦ କରନ୍ତୁ"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Modal Body: 6 Comparison Cards */}
            <div className="p-3 sm:p-6 space-y-3 sm:space-y-4 overflow-y-auto overscroll-contain mobile-touch-scroll-y touch-pan-y cosmic-visible-scrollbar flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {panjikaComparisonList.map((entry) => {
                  const isCurrentlySelected = selectedPanjika.id === entry.edition.id;
                  return (
                    <div
                      key={entry.edition.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                        isCurrentlySelected
                          ? 'bg-gradient-to-b from-amber-500/20 via-cosmic-900 to-cosmic-950 border-amber-400 shadow-xl ring-2 ring-amber-400/40'
                          : 'bg-cosmic-950/75 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Edition Header */}
                        <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                          <div>
                            <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                              <span>📜</span>
                              <span>{language === 'or' ? entry.edition.nameOr : entry.edition.nameEn}</span>
                            </h4>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              {entry.edition.foundedOr}
                            </span>
                          </div>
                          {isCurrentlySelected && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black">
                              ସକ୍ରିୟ
                            </span>
                          )}
                        </div>

                        {/* Timings Box */}
                        <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5 text-xs">
                          <div>
                            <span className="text-slate-400 text-[10px] block">ତିଥି ସମାପ୍ତି ସମୟ:</span>
                            <span className="font-bold text-amber-300 text-[11px] leading-tight block">
                              {entry.tithiDurationStrOr || 'ଉଦୟ ତିଥି ମାନ୍ୟ'}
                            </span>
                          </div>
                          <div className="pt-1 border-t border-white/5">
                            <span className="text-slate-400 text-[10px] block">ନକ୍ଷତ୍ର ଓ ପାଦ:</span>
                            <span className="font-semibold text-cyan-300 text-[11px] block">
                              {entry.nakshatraDurationStrOr}
                            </span>
                          </div>
                          <div className="pt-1 border-t border-white/5 flex justify-between text-[10px]">
                            <span className="text-emerald-400">ଅମୃତ: {entry.amritaBelaOr}</span>
                            <span className="text-rose-400">ରାହୁ: {entry.rahuKaalOr}</span>
                          </div>
                        </div>

                        {/* Vrata & Tradition Rules */}
                        <div className="space-y-1 text-xs">
                          <div className="text-[11px] text-slate-200">
                            <span className="text-amber-400 font-bold">ଶାସ୍ତ୍ର ବିଧି: </span>
                            <span className="leading-relaxed">{entry.vrataRuleOr}</span>
                          </div>
                          <div className="text-[11px] text-purple-200 mt-1">
                            <span className="text-purple-400 font-bold">ଶ୍ରୀମନ୍ଦିର ନୀତି: </span>
                            <span>{entry.srimandirNitiOr}</span>
                          </div>
                        </div>
                      </div>

                      {/* Switch Button */}
                      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">{entry.authorityEndorsementOr}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPanjika(entry.edition);
                            setIsPanjikaCompareOpen(false);
                            setCopiedToast(language === 'or' ? `${entry.edition.nameOr} କୁ ସଫଳତାର ସହ ପରିବର୍ତ୍ତନ କରାଗଲା` : `Switched to ${entry.edition.nameEn}`);
                            setTimeout(() => setCopiedToast(null), 2500);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                            isCurrentlySelected
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 pointer-events-none'
                              : 'bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/40 font-bold shadow-sm'
                          }`}
                        >
                          {isCurrentlySelected ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>ଚୟନିତ ଅଛି</span>
                            </>
                          ) : (
                            <>
                              <span>ଏହି ପାଞ୍ଜି ଚୟନ କରନ୍ତୁ</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 3. Interactive Web Calendar UI (Hidden during window.print) */}
      <div className="space-y-4 sm:space-y-6 max-w-6xl mx-auto pb-28 md:pb-16 animate-in fade-in duration-300 print:hidden no-print relative">
        {/* Immersive cosmic sky behind the whole front page */}
        <CosmicBackground3D />
        <div className="relative z-10 space-y-4 sm:space-y-6">
        {/* Divine Hero — tithi, nakshatra, sunrise/sunset */}
        {(() => {
          const hr = new Date().getHours();
          const greet = language === 'or'
            ? (hr < 5 ? '🌙 ଶୁଭ ରାତ୍ରି' : hr < 12 ? '🌅 ସୁପ୍ରଭାତ' : hr < 17 ? '☀️ ଶୁଭ ଅପରାହ୍ଣ' : hr < 20 ? '🌇 ଶୁଭ ସନ୍ଧ୍ୟା' : '🌙 ଶୁଭ ରାତ୍ରି')
            : language === 'hi'
              ? (hr < 5 ? '🌙 शुभ रात्रि' : hr < 12 ? '🌅 सुप्रभात' : hr < 17 ? '☀️ शुभ अपराह्न' : hr < 20 ? '🌇 शुभ संध्या' : '🌙 शुभ रात्रि')
              : (hr < 5 ? '🌙 Blessed Night' : hr < 12 ? '🌅 Good Morning' : hr < 17 ? '☀️ Good Afternoon' : hr < 20 ? '🌇 Blessed Evening' : '🌙 Blessed Night');
          const shlokaTxt = language === 'or'
            ? 'ଯଥା ଦୀପୋ ନିବାତସ୍ଥୋ ନେଙ୍ଗତେ ସୋପମା ସ୍ମୃତା — ବାୟୁହୀନ ସ୍ଥାନରେ ଦୀପ ଯେପରି ସ୍ଥିର ଜଳେ, ଯୋଗୀର ମନ ସେପରି ସ୍ଥିର ରହେ (ଗୀତା ୬.୧୯)'
            : language === 'hi'
              ? 'यथा दीपो निवातस्थो नेङ्गते सोपमा स्मृता — वायुरहित स्थान में दीप जैसे स्थिर जलता है, योगी का मन वैसे स्थिर रहता है (गीता 6.19)'
              : 'As a lamp in a windless place burns steady — so is the disciplined mind of the yogi (Gita 6.19)';
          const mu = selectedDayInfo.panjika.muhurtas;
          return (
            <>
              <div className="animate-cosmic-rise">
                <DivineHeroSection
                  day={selectedDayInfo}
                  language={language}
                  formatNumber={formatNumber}
                  formatTime={formatTime}
                  tithiLabel={tTithiFromKey(selectedDayInfo.panjika.tithi.nameKey)}
                  nakshatraLabel={tNakshatra(selectedDayInfo.panjika.nakshatra.nameKey)}
                  vaaraLabel={tVaara(selectedDayInfo.panjika.vaara)}
                  greeting={greet}
                  shloka={shlokaTxt}
                  tithiDurationStr={language === 'or' ? selectedDayInfo.tithiTiming?.durationStrOr : language === 'hi' ? selectedDayInfo.tithiTiming?.durationStrHi : selectedDayInfo.tithiTiming?.durationStrEn}
                />
              </div>
              <div className="animate-cosmic-rise" style={{ animationDelay: '0.08s' }}>
                <MuhurtaMarquee
                  title={language === 'or' ? 'ଆଜିର ମୁହୂର୍ତ୍ତ' : language === 'hi' ? 'आज के मुहूर्त' : "Today's Muhurtas"}
                  items={[
                    { emoji: '✨', label: language === 'or' ? 'ଅଭିଜିତ୍' : 'Abhijit', time: `${formatTime(mu.abhijit.start)}–${formatTime(mu.abhijit.end)}`, good: true },
                    { emoji: '🌅', label: language === 'or' ? 'ବ୍ରହ୍ମ ମୁହୂର୍ତ୍ତ' : 'Brahma', time: `${formatTime(mu.brahmaMuhurta.start)}–${formatTime(mu.brahmaMuhurta.end)}`, good: true },
                    { emoji: '⚠️', label: language === 'or' ? 'ରାହୁ କାଳ' : 'Rahu Kaal', time: `${formatTime(mu.rahuKaal.start)}–${formatTime(mu.rahuKaal.end)}`, good: false },
                    { emoji: '🟡', label: language === 'or' ? 'ଯମଗଣ୍ଡ' : 'Yamaganda', time: `${formatTime(mu.yamaganda.start)}–${formatTime(mu.yamaganda.end)}`, good: false },
                  ]}
                />
              </div>
              <div className="animate-cosmic-rise" style={{ animationDelay: '0.16s' }}>
                <SevaMandala language={language} />
              </div>
              <div className="animate-cosmic-rise" style={{ animationDelay: '0.22s' }}>
                <DailyShlokaCard language={language} />
              </div>
            </>
          );
        })()}
        {/* Toast alert */}
        {copiedToast && (
          <div className="fixed top-20 right-6 z-50 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle className="w-4 h-4 text-white" />
            <span>{copiedToast}</span>
          </div>
        )}

        {/* Month Command Center (existing hero — kept below the new divine hero) */}
      <div className="relative rounded-2xl sm:rounded-3xl p-3 sm:p-7 bg-gradient-to-r from-cosmic-950 via-[#0d1b33] to-cosmic-950 border-2 border-cosmic-gold/40 shadow-2xl backdrop-blur-2xl overflow-hidden print:border-none print:shadow-none">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cosmic-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 sm:gap-5">
          {/* Main Title & Odia Almanac Details */}
          <div className="space-y-1.5 sm:space-y-2 w-full lg:w-auto">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-cosmic-gold/15 border border-cosmic-gold/30 text-[10px] sm:text-xs font-bold text-cosmic-gold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
              <span className="truncate">
                {language === 'or'
                  ? `ଓଡ଼ିଆ ସୌର ପାଞ୍ଜି ${formatNumber(currentYear)} • ${primaryOdiaSolarMonth.nameOr} ମାସ (${primaryOdiaSolarMonth.seasonOr} ଋତୁ)`
                  : language === 'hi'
                  ? `ओड़िया सौर पंचांग ${currentYear} • ${primaryOdiaSolarMonth.nameHi} मास (${primaryOdiaSolarMonth.seasonHi} ऋतु)`
                  : `Odia Solar Almanac ${currentYear} • ${primaryOdiaSolarMonth.nameEn} (${primaryOdiaSolarMonth.seasonEn} Season)`}
              </span>
            </div>

            <h1 className="text-lg sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-amber-300 via-cosmic-gold to-yellow-100 bg-clip-text text-transparent font-serif leading-tight">
              {primaryOdiaSolarMonth[language === 'or' ? 'nameOr' : language === 'hi' ? 'nameHi' : 'nameEn']} • {GREGORIAN_MONTH_NAMES[language][currentMonth]} {formatNumber(currentYear)}
            </h1>

            <p className="hidden sm:block text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {language === 'or'
                ? `${selectedPanjika.authorityOr} ଅନୁମୋଦିତ ${selectedPanjika.nameOr} (${selectedPanjika.traditionOr}) ଏବଂ ସୂର୍ଯ୍ୟ-ଚନ୍ଦ୍ର ନିରାୟଣ ସ୍ଫୁଟ ଉପରେ ଆଧାରିତ ପ୍ରାମାଣିକ ଓଡ଼ିଆ କ୍ୟାଲେଣ୍ଡର।`
                : language === 'hi'
                ? `${selectedPanjika.nameHi} (${selectedPanjika.authorityOr}) एवं श्रीमंदिर पंचांग परंपरा पर आधारित प्रामाणिक ओड़िया कैलेंडर।`
                : `Authoritative Odia Calendar verified with ${selectedPanjika.nameEn} and Srimandir Nirayana ephemeris.`}
            </p>

            {/* Active Panjika Tradition & Season Badges */}
            <div className="mt-2.5 inline-flex flex-wrap items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-[11px] sm:text-xs">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <span>📜</span>
                <span>{language === 'or' ? selectedPanjika.nameOr : language === 'hi' ? selectedPanjika.nameHi : selectedPanjika.nameEn}</span>
              </span>
              <span className="text-slate-500 hidden sm:inline">•</span>
              <span className="text-slate-300 text-[10px] sm:text-[11px]">{selectedPanjika.authorityOr}</span>
              {selectedDayInfo.rituInfo && (
                <>
                  <span className="text-slate-500 hidden sm:inline">•</span>
                  <span className="text-emerald-400 text-[10px] sm:text-[11px] font-bold">
                    🍂 {language === 'or' ? selectedDayInfo.rituInfo.or : language === 'hi' ? selectedDayInfo.rituInfo.hi : selectedDayInfo.rituInfo.en}
                  </span>
                </>
              )}
              <span className="text-slate-500 hidden sm:inline">•</span>
              <span className="text-cyan-300 text-[10px] sm:text-[11px] font-mono">
                📍 {selectedCity[language === 'or' ? 'nameOr' : language === 'hi' ? 'nameHi' : 'nameEn']}
              </span>
            </div>
          </div>

          {/* Right Action Widgets, Panjika Edition & Multi-City Selector */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-2.5 w-full lg:w-auto print:hidden">
            {/* Panjika Edition Selector */}
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-950/60 via-cosmic-950 to-amber-950/60 border border-amber-500/50 text-xs shadow-inner min-h-[38px]">
              <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <select
                value={selectedPanjika.id}
                onChange={(e) => {
                  const ed = ODIA_PANJIKA_EDITIONS.find(p => p.id === e.target.value);
                  if (ed) setSelectedPanjika(ed);
                }}
                className="bg-transparent text-xs font-bold text-amber-300 focus:outline-none cursor-pointer w-full truncate pr-1"
                title={t('select_panjika')}
              >
                {ODIA_PANJIKA_EDITIONS.map(p => (
                  <option key={p.id} value={p.id} className="bg-cosmic-950 text-slate-200">
                    📜 {language === 'or' ? p.nameOr : language === 'hi' ? p.nameHi : p.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* City Selector with Live GPS Trigger */}
            <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl bg-cosmic-900/90 border border-slate-700/80 text-xs shadow-inner min-h-[38px]">
              <button
                type="button"
                onClick={handleDetectGPS}
                disabled={isLocatingGPS}
                className={`p-1 rounded-lg transition-all cursor-pointer touch-manipulation active:scale-95 shrink-0 ${
                  isLocatingGPS
                    ? 'animate-spin text-amber-400'
                    : selectedCity.id.startsWith('gps_')
                    ? 'text-emerald-400 hover:text-emerald-300'
                    : 'text-cyan-400 hover:text-cyan-300'
                }`}
                title={language === 'or' ? 'ମୋବାଇଲ୍ GPS ରୁ ପ୍ରକୃତ ସ୍ଥାନ ସନ୍ଧାନ କରନ୍ତୁ' : 'Detect Live Location via GPS'}
              >
                <Navigation className={`w-3.5 h-3.5 ${isLocatingGPS ? 'animate-pulse' : ''}`} />
              </button>
              <select
                value={selectedCity.id}
                onChange={(e) => {
                  const c = ALL_30_ODISHA_DISTRICTS.find(ci => ci.id === e.target.value) || ODISHA_CITIES.find(ci => ci.id === e.target.value);
                  if (c) {
                    setSelectedCity(c);
                    saveUserLocation(c);
                  }
                }}
                className="bg-transparent text-xs font-bold text-slate-200 focus:outline-none cursor-pointer w-full truncate pr-1"
              >
                {selectedCity.id.startsWith('gps_') && (
                  <option value={selectedCity.id} className="bg-emerald-950 text-emerald-300 font-bold py-1">
                    📍 {selectedCity[language === 'or' ? 'nameOr' : language === 'hi' ? 'nameHi' : 'nameEn']} (Live GPS)
                  </option>
                )}
                <option disabled value="" className="bg-slate-900 text-amber-400 font-bold py-1">
                  ── 🏛️ {language === 'or' ? 'ଓଡ଼ିଶାର ସମସ୍ତ ୩୦ ଜିଲ୍ଲା' : language === 'hi' ? 'ओडिशा के सभी ३० जिले' : 'All 30 Odisha Districts'} ──
                </option>
                {ALL_30_ODISHA_DISTRICTS.filter(c => !['delhi', 'kolkata', 'mumbai', 'bengaluru', 'hyderabad', 'chennai', 'surat'].includes(c.id)).map(c => (
                  <option key={c.id} value={c.id} className="bg-cosmic-950 text-slate-200">
                    {language === 'or' ? c.nameOr : language === 'hi' ? c.nameHi : c.nameEn}
                  </option>
                ))}
                <option disabled value="" className="bg-slate-900 text-amber-400 font-bold py-1">
                  ── 🇮🇳 {language === 'or' ? 'ପ୍ରବାସୀ ଓଡ଼ିଆ ହବ୍' : language === 'hi' ? 'प्रवासी ओड़िया महानगर' : 'Odia Diaspora Metros'} ──
                </option>
                {ALL_30_ODISHA_DISTRICTS.filter(c => ['delhi', 'kolkata', 'mumbai', 'bengaluru', 'hyderabad', 'chennai', 'surat'].includes(c.id)).map(c => (
                  <option key={c.id} value={c.id} className="bg-cosmic-950 text-slate-200">
                    {language === 'or' ? c.nameOr : language === 'hi' ? c.nameHi : c.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Today Jump Button */}
            <button
              type="button"
              onClick={jumpToToday}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-cosmic-gold/20 hover:bg-cosmic-gold/30 text-cosmic-gold border border-cosmic-gold/50 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 touch-manipulation min-h-[38px]"
              title={language === 'or' ? 'ଆଜିର ତାରିଖକୁ ଯାଆନ୍ତୁ' : language === 'hi' ? 'आज की तारीख पर जाएं' : 'Jump to Today'}
            >
              <CalendarIcon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{t('today_btn')}</span>
            </button>

            {/* Print Preview Button */}
            <button
              type="button"
              onClick={() => setIsPrintPreviewOpen(true)}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-cosmic-gold/20 hover:bg-cosmic-gold/30 text-cosmic-gold border border-cosmic-gold/50 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 touch-manipulation min-h-[38px]"
              title={language === 'or' ? 'ଓଡ଼ିଆ କାନ୍ଥ କ୍ୟାଲେଣ୍ଡର ପ୍ରାକ୍‌ଦର୍ଶନ ଓ PDF ଡାଉନଲୋଡ୍' : 'Print Wall Calendar / Save as PDF'}
            >
              <Printer className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{language === 'or' ? 'ପ୍ରିଣ୍ଟ କ୍ୟାଲେଣ୍ଡର' : language === 'hi' ? 'प्रिंट कैलेंडर' : 'Print'}</span>
            </button>

            {/* Direct Quick Print Button (Desktop only) */}
            <button
              type="button"
              onClick={() => window.print()}
              className="hidden sm:flex items-center justify-center p-2 rounded-xl bg-cosmic-900/80 hover:bg-cosmic-800 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer active:scale-95 touch-manipulation min-h-[38px]"
              title={language === 'or' ? 'ସିଧାସଳଖ ମୁଦ୍ରଣ କରନ୍ତୁ (Direct Print)' : 'Direct Print'}
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Year, Month Stepper & Mode Switcher Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5 print:hidden">
          {/* Month & Year Stepper Controls */}
          <div className="flex items-center justify-between sm:justify-start gap-1.5 sm:gap-2 bg-cosmic-950/90 border border-slate-800 rounded-2xl p-1.5 shadow-xl w-full sm:w-auto">
            <button
              type="button"
              onClick={prevMonth}
              className="p-2 rounded-xl text-slate-300 hover:text-cosmic-gold hover:bg-white/5 transition-colors cursor-pointer touch-manipulation active:scale-95 shrink-0"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Month Dropdown */}
            <select
              value={currentMonth}
              onChange={(e) => setCurrentMonth(parseInt(e.target.value, 10))}
              className="bg-transparent text-xs font-bold text-cosmic-gold focus:outline-none cursor-pointer px-2 py-1 text-center flex-1 sm:flex-none"
            >
              {GREGORIAN_MONTH_NAMES[language].map((mName, idx) => (
                <option key={idx} value={idx} className="bg-cosmic-950 text-slate-200">
                  {mName}
                </option>
              ))}
            </select>

            {/* Year Dropdown from 1950 to 2050 */}
            <select
              value={currentYear}
              onChange={(e) => setCurrentYear(parseInt(e.target.value, 10))}
              className="bg-transparent text-xs font-bold text-amber-300 focus:outline-none cursor-pointer px-2 py-1 border-l border-slate-800 text-center flex-1 sm:flex-none"
            >
              {Array.from({ length: PANJIKA_YEAR_COUNT }, (_, i) => PANJIKA_MIN_YEAR + i).map(yr => (
                <option key={yr} value={yr} className="bg-cosmic-950 text-slate-200">
                  {formatNumber(yr)}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={nextMonth}
              className="p-2 rounded-xl text-slate-300 hover:text-cosmic-gold hover:bg-white/5 transition-colors cursor-pointer touch-manipulation active:scale-95 shrink-0"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* View Mode Switcher Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-cosmic-950/90 border border-slate-800 rounded-2xl shadow-xl w-full md:w-auto">
            {[
              { id: 'month', label: t('view_month'), icon: <CalendarDays className="w-3.5 h-3.5" /> },
              { id: 'week', label: t('view_week'), icon: <Clock className="w-3.5 h-3.5" /> },
              { id: 'daily', label: t('view_daily'), icon: <BookOpen className="w-3.5 h-3.5" /> },
              { id: 'festivals', label: t('view_festivals'), icon: <Award className="w-3.5 h-3.5" /> },
              { id: 'muhurta', label: language === 'or' ? 'ଶୁଭ ମୁହୂର୍ତ୍ତ' : language === 'hi' ? 'शुभ मुहूर्त' : 'Shubha Muhurta', icon: <Sparkles className="w-3.5 h-3.5" /> },
              { id: 'srimandir', label: language === 'or' ? 'ଶ୍ରୀମନ୍ଦିର ନୀତି ଓ ଭୋଗ' : language === 'hi' ? 'श्रीमंदिर नीति व भोग' : 'Srimandir Niti & Bhoga', icon: <Flame className="w-3.5 h-3.5" /> },
              { id: 'eclipses', label: language === 'or' ? 'ଗ୍ରହଣ ସୂଚୀ' : language === 'hi' ? 'ग्रहण सूची' : 'Eclipses', icon: <Moon className="w-3.5 h-3.5" /> }
            ].map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => setViewMode(m.id as CalendarViewMode)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border whitespace-nowrap shrink-0 touch-manipulation active:scale-95 ${
                  viewMode === m.id
                    ? 'bg-gradient-to-r from-cosmic-gold to-yellow-400 text-cosmic-950 border-white shadow-md'
                    : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {m.icon}
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Month Festivals & Events Quick-Carousel with Advanced Scrolling System */}
      {upcomingMonthFestivals.length > 0 && viewMode === 'month' && (
        <div className="relative bg-gradient-to-r from-cosmic-950 via-[#0e1c36] to-cosmic-950 border border-cosmic-gold/30 rounded-3xl p-4 shadow-xl backdrop-blur-md">
          {/* Header with Title and Scroll Controls */}
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
              <h3 className="text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wider">
                {language === 'or' ? `ଏହି ମାସର ପର୍ବପର୍ବାଣି (${formatNumber(upcomingMonthFestivals.length)})` : `Festivals in this Month (${upcomingMonthFestivals.length})`}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 hidden md:inline">
                {language === 'or' ? 'ସ୍କ୍ରୋଲ୍ ବଟନ୍ ବା ମାଉସ୍ ହ୍ୱିଲ୍ ବ୍ୟବହାର କରନ୍ତୁ' : 'Use arrow buttons or mouse wheel to scroll'}
              </span>

              {/* Navigation Left / Right Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scrollCarousel('left')}
                  disabled={!canScrollLeft}
                  className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                    canScrollLeft
                      ? 'bg-cosmic-900 text-amber-400 border-cosmic-gold/40 hover:bg-amber-500 hover:text-slate-950 active:scale-95 shadow-sm'
                      : 'bg-slate-900/50 text-slate-600 border-slate-800 cursor-not-allowed opacity-40'
                  }`}
                  title={language === 'or' ? 'ପୂର୍ବ ପର୍ବ ଦେଖନ୍ତୁ' : 'Scroll left'}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollCarousel('right')}
                  disabled={!canScrollRight}
                  className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                    canScrollRight
                      ? 'bg-cosmic-900 text-amber-400 border-cosmic-gold/40 hover:bg-amber-500 hover:text-slate-950 active:scale-95 shadow-sm'
                      : 'bg-slate-900/50 text-slate-600 border-slate-800 cursor-not-allowed opacity-40'
                  }`}
                  title={language === 'or' ? 'ପରବର୍ତ୍ତୀ ପର୍ବ ଦେଖନ୍ତୁ' : 'Scroll right'}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Carousel Container with Scroll Shadows & Wheel/Drag Handlers */}
          <div className="relative group">
            {/* Left Edge Fade Indicator */}
            {canScrollLeft && (
              <div className="absolute left-0 top-0 bottom-2 w-8 bg-gradient-to-r from-cosmic-950 to-transparent pointer-events-none z-10" />
            )}

            {/* Right Edge Fade Indicator */}
            {canScrollRight && (
              <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-cosmic-950 to-transparent pointer-events-none z-10" />
            )}

            {/* Horizontal Scroll Cards Track */}
            <div
              ref={festivalCarouselRef}
              onWheel={handleCarouselWheel}
              onMouseDown={handleCarouselMouseDown}
              onMouseMove={handleCarouselMouseMove}
              onMouseUp={handleCarouselMouseUp}
              onMouseLeave={handleCarouselMouseUp}
              className="flex items-stretch gap-3 overflow-x-auto pb-3 pt-1 cosmic-scrollbar scroll-smooth cursor-grab active:cursor-grabbing select-none"
            >
              {upcomingMonthFestivals.map((item, idx) => {
                const isSelected = selectedDay === item.dayOfMonth;
                const diff = item.daysDiff;
                let badgeBg = 'bg-slate-800 text-slate-300 border-slate-700';
                let badgeLabel = '';

                if (diff === 0) {
                  badgeBg = 'bg-rose-500 text-white border-rose-400 font-black animate-pulse';
                  badgeLabel = language === 'or' ? '🔥 ଆଜି' : '🔥 Today';
                } else if (diff === 1) {
                  badgeBg = 'bg-amber-500 text-slate-950 border-amber-300 font-bold';
                  badgeLabel = language === 'or' ? '⚡ କାଲି' : '⚡ Tomorrow';
                } else if (diff > 1 && diff <= 30) {
                  badgeBg = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold';
                  badgeLabel = language === 'or' ? `${formatNumber(diff)} ଦିନ ପରେ` : `In ${diff} days`;
                } else if (diff < 0) {
                  badgeBg = 'bg-slate-800/80 text-slate-500 border-slate-700';
                  badgeLabel = language === 'or' ? 'ଅତୀତ' : 'Past';
                }

                const weekdayFull = tVaara(item.dayInfo.panjika.vaara);

                return (
                  <button
                    key={`${item.dayOfMonth}-${idx}`}
                    type="button"
                    onClick={() => {
                      setSelectedDay(item.dayOfMonth);
                      const el = document.getElementById(`calendar-day-${item.dayOfMonth}`);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }}
                    className={`min-w-[220px] sm:min-w-[240px] max-w-[260px] p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer group shrink-0 ${
                      isSelected
                        ? 'bg-gradient-to-b from-amber-500/25 via-cosmic-900 to-cosmic-950 border-amber-400 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/50 scale-[1.02]'
                        : 'bg-cosmic-950/70 border-slate-800 hover:border-amber-500/50 hover:bg-cosmic-900/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-white/5 text-amber-300 border-white/10">
                          {formatNumber(item.dayOfMonth)} {GREGORIAN_MONTH_NAMES[language][currentMonth]}
                        </span>
                        {badgeLabel && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${badgeBg}`}>
                            {badgeLabel}
                          </span>
                        )}
                      </div>

                      <div className="font-bold text-xs text-white group-hover:text-amber-300 transition-colors line-clamp-2 min-h-[32px] leading-snug">
                        🚩 {item.festival[language === 'or' ? 'nameOr' : language === 'hi' ? 'nameHi' : 'nameEn']}
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="text-slate-300 font-medium">
                        {formatNumber(item.dayInfo.odiaSolarDay)} {item.dayInfo.odiaSolarMonth.nameOr}
                      </span>
                      <span className="text-cyan-300 font-bold">{weekdayFull}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 1: MONTHLY GRID */}
      {viewMode === 'month' && (
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {/* Left: 2-Cols Calendar Grid */}
          <div className="lg:col-span-2 bg-cosmic-900/70 border border-cosmic-gold/25 rounded-2xl sm:rounded-3xl p-2 sm:p-6 shadow-2xl backdrop-blur-md">
            {/* Grid Controls: Fast-Filter Pills & Quick Tithi Search */}
            <div className="space-y-2.5 mb-2.5 sm:mb-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-2.5">
                {/* Quick Tithi / Festival Search Input */}
                <div className="relative flex-1 w-full sm:max-w-sm">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={gridSearchQuery}
                    onChange={(e) => setGridSearchQuery(e.target.value)}
                    placeholder={language === 'or' ? 'ମାସ ଭିତରେ ତିଥି ବା ପର୍ବ ଖୋଜନ୍ତୁ (ଯଥା: ଏକାଦଶୀ, ସୋମବାର...)' : 'Search tithi or festival in this month...'}
                    className="w-full bg-cosmic-950/80 border border-slate-800 rounded-2xl pl-9 pr-8 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cosmic-gold/80 touch-manipulation"
                  />
                  {gridSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setGridSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Result Counter / Filter Summary */}
                <div className="text-[11px] font-bold text-amber-300/90 flex items-center gap-1.5 self-end sm:self-center">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {matchingDaysCount === daysInMonth
                      ? (language === 'or' ? `ସମସ୍ତ ${formatNumber(daysInMonth)} ଦିନ ପ୍ରଦର୍ଶିତ` : `Showing all ${daysInMonth} days`)
                      : (language === 'or' ? `${formatNumber(matchingDaysCount)} ଟି ଦିନ ମିଳିଲା` : `${matchingDaysCount} days matched`)}
                  </span>
                </div>
              </div>

              {/* Category Filter Pills with Mouse Wheel & Cosmic Scrollbar */}
              <div
                ref={filterPillsRef}
                onWheel={(e) => {
                  if (e.deltaY !== 0) {
                    e.currentTarget.scrollLeft += e.deltaY;
                  }
                }}
                className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 cosmic-scrollbar mobile-touch-scroll pr-4 touch-pan-x"
              >
                {[
                  { id: 'all', label: language === 'or' ? '🌟 ସବୁ ଦିନ' : 'All Days', count: daysInMonth },
                  { id: 'ekadashi', label: language === 'or' ? '🌿 ଏକାଦଶୀ' : 'Ekadashi', count: monthDays.filter(d => d.isEkadashi).length },
                  { id: 'purnima_amavasya', label: language === 'or' ? '🌕/🌑 ପୂର୍ଣ୍ଣିମା ଓ ଅମାବାସ୍ୟା' : 'Purnima / Amavasya', count: monthDays.filter(d => d.isPurnima || d.isAmavasya).length },
                  { id: 'sankranti', label: language === 'or' ? '☀️ ସଂକ୍ରାନ୍ତି' : 'Sankranti', count: monthDays.filter(d => d.isSankranti).length },
                  { id: 'besha', label: language === 'or' ? '👑 ଶ୍ରୀମନ୍ଦିର ବେଶ' : 'Jagannath Besha', count: monthDays.filter(d => !!d.jagannathBesha).length },
                  { id: 'muhurta', label: language === 'or' ? '💍 ଶୁଭ ମୁହୂର୍ତ୍ତ' : 'Auspicious Muhurtas', count: monthDays.filter(d => monthMuhurtas.some(m => m.date.getDate() === d.dayOfMonth)).length },
                  { id: 'holiday', label: language === 'or' ? '🚩 ସରକାରୀ ଛୁଟି' : 'Govt Holidays', count: monthDays.filter(d => d.festivals.some(f => f.isGovernmentHoliday)).length }
                ].map(pill => (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => setGridFilter(pill.id as typeof gridFilter)}
                    className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all border flex items-center gap-1.5 shrink-0 touch-manipulation active:scale-95 shadow-xs ${
                      gridFilter === pill.id
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border-amber-300 shadow-md shadow-amber-500/25 font-black scale-[1.02]'
                        : 'bg-cosmic-950/75 text-slate-300 border-slate-800 hover:text-white hover:border-slate-700 hover:bg-cosmic-900/60'
                    }`}
                  >
                    <span>{pill.label}</span>
                    {pill.count > 0 && pill.id !== 'all' && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                        gridFilter === pill.id ? 'bg-black/25 text-slate-950' : 'bg-white/10 text-amber-300'
                      }`}>
                        {formatNumber(pill.count)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* MOBILE-FIRST QUICK DAY SUMMARY CARD (Visible directly above grid on phone screens < 1024px) */}
            <div className="lg:hidden mb-3 p-3 rounded-2xl bg-gradient-to-br from-cosmic-950 via-[#0a162b] to-cosmic-950 border border-amber-500/40 shadow-xl space-y-2.5">
              {/* Row 1: Selected Date & Vaara Header */}
              <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-black text-amber-300 font-mono">
                      {formatNumber(selectedDayInfo.dayOfMonth)} {GREGORIAN_MONTH_NAMES[language][currentMonth]} {formatNumber(currentYear)}
                    </span>
                    <span className="text-[10px] bg-amber-500/15 text-amber-300 font-bold px-1.5 py-0.2 rounded-md border border-amber-500/30">
                      {formatNumber(selectedDayInfo.odiaSolarDay)} {selectedDayInfo.odiaSolarMonth[language === 'or' ? 'nameOr' : language === 'hi' ? 'nameHi' : 'nameEn']} ତା
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-sm font-black text-white font-serif flex items-center gap-1">
                      <span>{tTithiFromKey(selectedDayInfo.panjika.tithi.nameKey)}</span>
                      <span className="text-xs">{getMoonIcon(selectedDayInfo.tithiNumber, selectedDayInfo.isPurnima, selectedDayInfo.isAmavasya)}</span>
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ({selectedDayInfo.lunarMonthName[language === 'or' ? 'or' : language === 'hi' ? 'hi' : 'en']})
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs">
                    {tVaara(selectedDayInfo.panjika.vaara)}
                  </span>
                  <span className="text-[9px] text-cyan-300 font-mono flex items-center gap-0.5">
                    <MapPin className="w-2.5 h-2.5" />
                    <span>{selectedCity[language === 'or' ? 'nameOr' : 'nameEn']}</span>
                  </span>
                </div>
              </div>

              {/* Row 2: Tithi Duration & Nakshatra */}
              <div className="flex flex-wrap items-center justify-between gap-1.5 text-[11px] bg-white/5 p-2 rounded-xl border border-white/5">
                {selectedDayInfo.tithiTiming?.durationStrOr && (
                  <div className="flex items-center gap-1 text-amber-300 font-medium">
                    <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="truncate">{selectedDayInfo.tithiTiming.durationStrOr}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-cyan-300 font-medium ml-auto">
                  <Compass className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span>{tNakshatra(selectedDayInfo.panjika.nakshatra.nameKey)} (ପାଦ {formatNumber(selectedDayInfo.nakshatraTiming?.pada || selectedDayInfo.panjika.nakshatra.pada)})</span>
                </div>
              </div>

              {/* Row 3: Key Muhurtas & Sun Times Matrix */}
              <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                <div className="p-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
                  <span className="block text-[8.5px] text-emerald-400/80 font-bold">✨ ଅଭିଜିତ୍ ମୁହୂର୍ତ୍ତ</span>
                  <span className="font-mono font-bold truncate block">{formatTimeRange(selectedDayInfo.panjika.muhurtas.abhijit.start, selectedDayInfo.panjika.muhurtas.abhijit.end)}</span>
                </div>
                <div className="p-1.5 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300">
                  <span className="block text-[8.5px] text-rose-400/80 font-bold">⚠️ ରାହୁ କାଳ (ବର୍ଜିତ)</span>
                  <span className="font-mono font-bold truncate block">{formatTimeRange(selectedDayInfo.panjika.muhurtas.rahuKaal.start, selectedDayInfo.panjika.muhurtas.rahuKaal.end)}</span>
                </div>
                <div className="p-1.5 rounded-lg bg-cosmic-950 border border-slate-800 text-slate-300">
                  <span className="block text-[8.5px] text-amber-400/80 font-bold">🌅 ସୂର୍ଯ୍ୟୋଦୟ / ଅସ୍ତ</span>
                  <span className="font-mono font-bold truncate block">{formatTime(selectedDayInfo.panjika.sunrise)} / {formatTime(selectedDayInfo.panjika.sunset)}</span>
                </div>
              </div>

              {/* Digashula & Remedy if present */}
              {selectedDayInfo.digashula && (
                <div className="flex items-center justify-between text-[10px] px-2 py-1 rounded-lg bg-amber-950/30 border border-amber-500/25 text-amber-200">
                  <span>🧭 ଶୂଳ: <strong className="text-amber-300">{selectedDayInfo.digashula.directionOr}</strong></span>
                  <span className="text-emerald-300 truncate max-w-[60%]">{selectedDayInfo.digashula.remedyOr}</span>
                </div>
              )}

              {/* Festival or Besha Banner if active */}
              {selectedDayInfo.jagannathBesha ? (
                <div className="text-[11px] p-2 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-200 flex items-center justify-between gap-2">
                  <span className="font-bold flex items-center gap-1 truncate">
                    <span>👑 ଶ୍ରୀମନ୍ଦିର ବେଶ:</span>
                    <span className="truncate">{selectedDayInfo.jagannathBesha[language === 'or' ? 'or' : language === 'hi' ? 'hi' : 'en']}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setViewMode('srimandir')}
                    className="text-[10px] text-purple-300 underline shrink-0 cursor-pointer"
                  >
                    ଦେଖନ୍ତୁ →
                  </button>
                </div>
              ) : selectedDayInfo.festivals.length > 0 ? (
                <div className="text-[11px] p-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-500/40 text-amber-200 flex items-center justify-between gap-2">
                  <span className="font-bold flex items-center gap-1 truncate">
                    <span>{selectedDayInfo.festivals[0].isGovernmentHoliday ? '🚩' : '🪔'}</span>
                    <span className="truncate">{selectedDayInfo.festivals[0][language === 'or' ? 'nameOr' : language === 'hi' ? 'nameHi' : 'nameEn']}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => downloadIcsEvent(
                      selectedDayInfo.festivals[0].nameEn,
                      selectedDayInfo.date,
                      selectedDayInfo.festivals[0].descriptionEn
                    )}
                    className="text-[10px] text-cyan-300 hover:underline shrink-0 flex items-center gap-0.5 cursor-pointer"
                  >
                    <CalendarPlus className="w-3 h-3" />
                    <span>କ୍ୟାଲେଣ୍ଡର</span>
                  </button>
                </div>
              ) : null}

              {/* 4 Quick Actions for Mobile (2x2 Royal Matrix) */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleWhatsAppShare(selectedDayInfo)}
                  className="flex items-center gap-2 p-2 rounded-xl bg-gradient-to-br from-emerald-900/60 to-[#032e18] border border-emerald-500/40 text-emerald-300 text-xs font-bold active:scale-95 touch-manipulation cursor-pointer min-h-[44px] shadow-sm"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-left min-w-0">
                    <span className="block truncate font-black">WhatsApp</span>
                    <span className="block text-[9px] text-emerald-400/80 font-medium truncate">
                      {language === 'or' ? 'ପାଞ୍ଜି ସେୟାର୍' : 'Share'}
                    </span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleGoogleCalendarSync(selectedDayInfo)}
                  className="flex items-center gap-2 p-2 rounded-xl bg-gradient-to-br from-cyan-900/60 to-[#042838] border border-cyan-500/40 text-cyan-300 text-xs font-bold active:scale-95 touch-manipulation cursor-pointer min-h-[44px] shadow-sm"
                >
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
                    <CalendarPlus className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div className="text-left min-w-0">
                    <span className="block truncate font-black">
                      {language === 'or' ? 'କ୍ୟାଲେଣ୍ଡର' : 'Google Cal'}
                    </span>
                    <span className="block text-[9px] text-cyan-400/80 font-medium truncate">
                      {language === 'or' ? 'ଇଭେଣ୍ଟ ସିଙ୍କ୍' : 'Sync Event'}
                    </span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPanjikaCompareOpen(true)}
                  className="flex items-center gap-2 p-2 rounded-xl bg-gradient-to-br from-amber-900/60 to-[#2e1d05] border border-amber-500/40 text-amber-300 text-xs font-bold active:scale-95 touch-manipulation cursor-pointer min-h-[44px] shadow-sm"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
                    <Scale className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="text-left min-w-0">
                    <span className="block truncate font-black">
                      {language === 'or' ? '୬ ପାଞ୍ଜି' : '6 Panjikas'}
                    </span>
                    <span className="block text-[9px] text-amber-400/80 font-medium truncate">
                      {language === 'or' ? 'ତୁଳନା ସାରଣୀ' : 'Compare'}
                    </span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('daily')}
                  className="flex items-center gap-2 p-2 rounded-xl bg-gradient-to-br from-amber-500/25 to-cosmic-950 border border-cosmic-gold/50 text-amber-300 text-xs font-bold active:scale-95 touch-manipulation cursor-pointer min-h-[44px] shadow-sm"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="text-left min-w-0">
                    <span className="block truncate font-black">
                      {language === 'or' ? 'ଦୈନିକ ପତ୍ରିକା' : 'Daily Sheet'}
                    </span>
                    <span className="block text-[9px] text-amber-400/80 font-medium truncate">
                      {language === 'or' ? 'ପୂର୍ଣ୍ଣ ପତ୍ରିକା' : 'Full Sheet'}
                    </span>
                  </div>
                </button>
              </div>

              {/* Deep Inspector Reveal Button */}
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('day-inspector-panel');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="w-full pt-1 text-center text-[10px] text-amber-400/80 hover:text-amber-300 font-semibold cursor-pointer flex items-center justify-center gap-1"
              >
                <span>ସମ୍ପୂର୍ଣ୍ଣ ଜ୍ୟୋତିଷ ବିବରଣୀ ଓ ନବଗ୍ରହ ସ୍ଫୁଟ ଦେଖନ୍ତୁ</span>
                <span>↓</span>
              </button>
            </div>

            {/* Advance Weekday Headers */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center mb-1.5 sm:mb-3 border-b border-slate-800/80 pb-2">
              {WEEKDAY_NAMES[language].map((w, idx) => (
                <div
                  key={idx}
                  className={`py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-center font-bold text-[9px] sm:text-xs transition-all shadow-xs ${
                    idx === 0
                      ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30 font-black'
                      : idx === 1
                      ? 'bg-sky-500/10 text-sky-300 border border-sky-500/25'
                      : idx === 4
                      ? 'bg-amber-500/10 text-amber-300 border border-amber-500/25'
                      : 'bg-white/5 text-slate-300 border border-white/5'
                  }`}
                >
                  {w}
                </div>
              ))}
            </div>

            {/* Day Cells Grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {/* Empty leading cells for month offset */}
              {Array.from({ length: firstDayWeekday }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[72px] sm:min-h-[105px] h-[74px] sm:h-auto rounded-xl sm:rounded-2xl bg-cosmic-950/20 border border-slate-800/30 border-dashed" />
              ))}

              {/* Day Cells */}
              {monthDays.map((dayInfo) => {
                const day = dayInfo.dayOfMonth;
                const isSelected = selectedDay === day;
                const isToday =
                  today.getDate() === day &&
                  today.getMonth() === currentMonth &&
                  today.getFullYear() === currentYear;

                const primaryFest = dayInfo.festivals[0];
                const isMatching = isDayMatchingFilter(dayInfo);

                // Aura & Border Accents based on day sacredness
                let cellStyle = 'bg-cosmic-950/65 border-slate-800/80 hover:border-amber-400/50 hover:bg-cosmic-900/60';
                let topAccentBar = null;

                if (isSelected) {
                  cellStyle = 'bg-gradient-to-b from-amber-500/30 via-cosmic-900/95 to-cosmic-950 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.35)] ring-2 ring-amber-400 z-20 scale-[1.02]';
                  topAccentBar = <div className="absolute top-0 left-0 right-0 h-1 bg-amber-400 shadow-[0_0_8px_#fbbf24]" />;
                } else if (isToday) {
                  cellStyle = 'bg-gradient-to-br from-cyan-950/60 via-cosmic-900/90 to-teal-950/60 border-cyan-400 shadow-[0_0_24px_rgba(34,211,238,0.4),inset_0_0_20px_rgba(34,211,238,0.08)] ring-2 ring-cyan-400/80 z-10 animate-[todayPulse_3s_ease-in-out_infinite]';
                  topAccentBar = <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 shadow-[0_0_12px_#22d3ee,0_2px_8px_#22d3ee] animate-[shimmer_2s_ease-in-out_infinite]" />;
                } else if (!isMatching && (gridFilter !== 'all' || gridSearchQuery)) {
                  cellStyle = 'bg-cosmic-950/20 border-slate-900/60 opacity-30 hover:opacity-80';
                } else if (isMatching && (gridFilter !== 'all' || gridSearchQuery)) {
                  cellStyle = 'bg-emerald-950/35 border-emerald-500/60 ring-1 ring-emerald-400/40 shadow-sm';
                } else if (dayInfo.isPurnima) {
                  cellStyle = 'bg-gradient-to-b from-amber-950/35 via-cosmic-950 to-cosmic-950 border-amber-400/70 ring-1 ring-amber-400/30 shadow-[0_0_12px_rgba(251,191,36,0.2)]';
                  topAccentBar = <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 shadow-[0_0_8px_#fbbf24]" />;
                } else if (dayInfo.isAmavasya) {
                  cellStyle = 'bg-gradient-to-b from-indigo-950/40 via-cosmic-950 to-cosmic-950 border-indigo-500/70 ring-1 ring-indigo-400/30 shadow-[0_0_12px_rgba(99,102,241,0.2)]';
                  topAccentBar = <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 to-purple-500 shadow-[0_0_8px_#6366f1]" />;
                } else if (dayInfo.isEkadashi) {
                  cellStyle = 'bg-gradient-to-b from-emerald-950/30 via-cosmic-950 to-cosmic-950 border-emerald-500/60 ring-1 ring-emerald-400/30 shadow-xs';
                  topAccentBar = <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-400" />;
                } else if (dayInfo.isSankranti) {
                  cellStyle = 'bg-gradient-to-b from-orange-950/30 via-cosmic-950 to-cosmic-950 border-orange-500/60 ring-1 ring-orange-400/30 shadow-xs';
                  topAccentBar = <div className="absolute top-0 left-0 right-0 h-0.5 bg-orange-400" />;
                }

                return (
                  <button
                    key={day}
                    id={`calendar-day-${day}`}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={`min-h-[72px] sm:min-h-[105px] h-[74px] sm:h-auto p-1 sm:p-2 rounded-xl sm:rounded-2xl border flex flex-col justify-between text-left transition-all relative overflow-hidden group cursor-pointer touch-manipulation active:scale-[0.97] ${cellStyle}`}
                  >
                    {topAccentBar}

                    {/* Top Row: Date & Odia Solar Date Badge & Moon Phase */}
                    <div className="flex w-full flex-wrap items-center justify-between gap-x-1 gap-y-0.5">
                      {/* Gregorian Date */}
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        <span className={`text-xs sm:text-base font-black tracking-tight leading-none ${
                          isSelected ? 'text-amber-300 scale-105' : isToday ? 'text-cyan-200 text-sm sm:text-lg drop-shadow-[0_0_6px_rgba(34,211,238,0.6)]' : 'text-slate-100'
                        }`}>
                          {day}
                        </span>
                        {isToday && (
                          <span className="flex items-center gap-0.5">
                            <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-cyan-400 shadow-[0_0_6px_#22d3ee]"></span>
                            </span>
                            <span className="hidden sm:inline-flex items-center text-[8px] font-black px-1.5 py-0.5 rounded-full bg-cyan-500/25 border border-cyan-400/50 text-cyan-300 tracking-wider uppercase animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.3)]">
                              {language === 'or' ? 'ଆଜି' : language === 'hi' ? 'आज' : 'TODAY'}
                            </span>
                          </span>
                        )}
                      </div>

                      {/* Odia Solar Day Badge + Moon Icon */}
                      <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                        <span
                          title={`ଓଡ଼ିଆ ସୌର ${dayInfo.odiaSolarMonth.nameOr} ${formatNumber(dayInfo.odiaSolarDay)} ତାରିଖ`}
                          className="inline-flex items-center text-[7.5px] sm:text-[10px] font-bold px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono leading-none shadow-xs"
                        >
                          {formatNumber(dayInfo.odiaSolarDay)}<span className="hidden sm:inline text-[8px] ml-0.5 text-amber-400/80">ତା</span>
                        </span>
                        <span className="text-[9px] sm:text-xs shrink-0 drop-shadow" title={tTithiFromKey(dayInfo.panjika.tithi.nameKey)}>
                          {getMoonIcon(dayInfo.tithiNumber, dayInfo.isPurnima, dayInfo.isAmavasya)}
                        </span>
                      </div>
                    </div>

                    {/* Middle: Paksha & Tithi Name */}
                    <div className="my-0.5 sm:my-1 flex items-center gap-0.5 sm:gap-1 w-full overflow-hidden">
                      <span className={`text-[7px] sm:text-[10px] px-0.5 sm:px-1 py-0.2 rounded font-bold shrink-0 ${
                        dayInfo.isShukla
                          ? 'bg-amber-400/15 text-amber-300 border border-amber-400/25'
                          : 'bg-sky-400/15 text-sky-300 border border-sky-400/25'
                      }`}>
                        {dayInfo.isShukla ? (language === 'or' ? 'ଶୁ' : 'शु') : (language === 'or' ? 'କୃ' : 'कृ')}
                      </span>
                      <span 
                        title={dayInfo.tithiTiming?.durationStrOr || tTithiFromKey(dayInfo.panjika.tithi.nameKey)}
                        className="text-[8px] sm:text-[11px] font-semibold text-slate-200 truncate leading-tight"
                      >
                        {dayInfo.isEarlyTithiChange && dayInfo.dominantTithiNameOr && language === 'or'
                          ? `${tTithiFromKey(dayInfo.panjika.tithi.nameKey).split(' ').pop()}/${dayInfo.dominantTithiNameOr}`
                          : tTithiFromKey(dayInfo.panjika.tithi.nameKey).split(' ').pop()}
                      </span>
                    </div>

                    {/* Bottom: Festival or Special Badge */}
                    <div className="w-full truncate h-3.5 sm:h-4 flex items-center leading-none">
                      {dayInfo.jagannathBesha ? (
                        <div
                          title={`ଶ୍ରୀମନ୍ଦିର ବେଶ: ${dayInfo.jagannathBesha[language === 'or' ? 'or' : language === 'hi' ? 'hi' : 'en']}`}
                          className="w-full text-[7px] sm:text-[9px] bg-purple-950/80 text-purple-200 border border-purple-500/40 px-0.5 sm:px-1 py-0.2 sm:py-0.5 rounded font-bold truncate flex items-center gap-0.5 leading-none"
                        >
                          <span>👑</span>
                          <span className="truncate">{dayInfo.jagannathBesha[language === 'or' ? 'or' : language === 'hi' ? 'hi' : 'en']}</span>
                        </div>
                      ) : primaryFest ? (
                        <div
                          title={primaryFest[language === 'or' ? 'nameOr' : language === 'hi' ? 'nameHi' : 'nameEn']}
                          className="w-full text-[7px] sm:text-[9px] bg-gradient-to-r from-amber-500/25 to-rose-500/20 text-amber-200 border border-amber-500/35 px-0.5 sm:px-1 py-0.2 sm:py-0.5 rounded font-bold truncate flex items-center justify-between gap-0.5 leading-none"
                        >
                          <span className="truncate flex items-center gap-0.5">
                            <span>{primaryFest.isGovernmentHoliday ? '🚩' : '🪔'}</span>
                            <span className="truncate">{primaryFest[language === 'or' ? 'nameOr' : language === 'hi' ? 'nameHi' : 'nameEn']}</span>
                          </span>
                          {dayInfo.festivals.length > 1 && (
                            <span className="hidden sm:inline text-[7px] sm:text-[8px] px-1 py-0.2 rounded-full bg-amber-400/30 text-amber-200 shrink-0 font-mono">
                              +{dayInfo.festivals.length - 1}
                            </span>
                          )}
                        </div>
                      ) : dayInfo.isSankranti ? (
                        <div className="w-full text-[7px] sm:text-[9px] bg-orange-500/20 text-orange-200 border border-orange-500/30 px-0.5 sm:px-1 py-0.2 sm:py-0.5 rounded font-bold truncate flex items-center gap-0.5 leading-none">
                          <span>☀️</span>
                          <span className="truncate">{language === 'or' ? 'ସଂକ୍ରାନ୍ତି' : 'संक्रांति'}</span>
                        </div>
                      ) : dayInfo.isEkadashi ? (
                        <div className="w-full text-[7px] sm:text-[9px] bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 px-0.5 sm:px-1 py-0.2 sm:py-0.5 rounded font-bold truncate flex items-center gap-0.5 leading-none">
                          <span>🌿</span>
                          <span className="truncate">{language === 'or' ? 'ଏକାଦଶୀ' : 'एकादशी'}</span>
                        </div>
                      ) : dayInfo.isPurnima ? (
                        <div className="w-full text-[7px] sm:text-[9px] bg-amber-500/20 text-amber-200 border border-amber-500/30 px-0.5 sm:px-1 py-0.2 sm:py-0.5 rounded font-bold truncate flex items-center gap-0.5 leading-none">
                          <span>🌕</span>
                          <span className="truncate">{language === 'or' ? 'ପୂର୍ଣ୍ଣିମା' : 'पूर्णिमा'}</span>
                        </div>
                      ) : dayInfo.isAmavasya ? (
                        <div className="w-full text-[7px] sm:text-[9px] bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 px-0.5 sm:px-1 py-0.2 sm:py-0.5 rounded font-bold truncate flex items-center gap-0.5 leading-none">
                          <span>🌑</span>
                          <span className="truncate">{language === 'or' ? 'ଅମାବାସ୍ୟା' : 'अमावस्या'}</span>
                        </div>
                      ) : (
                        <div className="h-3 sm:h-3.5 w-full" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Legend */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span>{language === 'or' ? 'ଏକାଦଶୀ' : 'Ekadashi'}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span>🌕</span>
                  <span>{language === 'or' ? 'ପୂର୍ଣ୍ଣିମା' : 'Purnima'}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span>🌑</span>
                  <span>{language === 'or' ? 'ଅମାବାସ୍ୟା' : 'Amavasya'}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  <span>{language === 'or' ? 'ସଂକ୍ରାନ୍ତି' : 'Sankranti'}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span>👑</span>
                  <span>{language === 'or' ? 'ବେଶ' : 'Besha'}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>{language === 'or' ? 'ଛୁଟି' : 'Holiday'}</span>
                </span>
              </div>
              <span className="text-slate-400 text-[10px] sm:text-[11px] flex items-center gap-1">
                <span>📜</span>
                <span>{language === 'or' ? 'ଶ୍ରୀମନ୍ଦିର ଓ କୋହିନୂର ପାଞ୍ଜି ଗଣନା' : 'Srimandir & Kohinoor Panjika'}</span>
              </span>
            </div>

            {/* ADVANCED SHASTRIC & LIFE GUIDANCE DASHBOARD (Dynamic by Selected Day) */}
            <OdiaAdvancedDailyGuidance
              dayInfo={selectedDayInfo}
              language={language}
              selectedPanjika={selectedPanjika}
              selectedCity={selectedCity}
              currentYear={currentYear}
              currentMonth={currentMonth}
            />
          </div>

          {/* Right: Selected Day Inspector & Traditional Almanac Card */}
          <div id="day-inspector-panel" className="bg-gradient-to-br from-cosmic-900/95 via-cosmic-950/95 to-cosmic-900/95 border border-amber-500/35 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl flex flex-col justify-between space-y-4 scroll-mt-20">
            <div>
              {/* Day Header - Royal Temple Masthead */}
              <div className="border-b border-amber-500/25 pb-3.5 mb-3.5 space-y-2">
                {/* Top Badges Row */}
                <div className="flex items-center justify-between gap-1.5 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                      <CalendarIcon className="w-3 h-3 text-amber-400" />
                      <span>{formatNumber(selectedDayInfo.dayOfMonth)} {GREGORIAN_MONTH_NAMES[language][currentMonth]} {formatNumber(currentYear)}</span>
                    </span>
                    <span className="text-[10px] font-bold text-amber-200 bg-gradient-to-r from-amber-500/20 to-amber-600/20 px-2 py-0.5 rounded-lg border border-amber-500/30 flex items-center gap-1">
                      <span>☀️</span>
                      <span>{formatNumber(selectedDayInfo.odiaSolarDay)} {selectedDayInfo.odiaSolarMonth[language === 'or' ? 'nameOr' : language === 'hi' ? 'nameHi' : 'nameEn']} ତା</span>
                    </span>
                    <span className="text-[10px] font-bold text-sky-300 bg-sky-500/15 px-2 py-0.5 rounded-lg border border-sky-500/30">
                      {selectedDayInfo.lunarMonthName[language === 'or' ? 'or' : language === 'hi' ? 'hi' : 'en']}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[11px] bg-gradient-to-r from-amber-500/25 to-cosmic-gold/25 text-amber-300 border border-amber-400/40 px-2.5 py-0.5 rounded-full font-black shadow-xs">
                      {tVaara(selectedDayInfo.panjika.vaara)}
                    </span>
                    <button
                      type="button"
                      onClick={handleDetectGPS}
                      className="inline-flex items-center gap-1 text-[10px] text-cyan-300 hover:text-cyan-200 bg-cyan-950/60 px-2 py-0.5 rounded-lg border border-cyan-500/30 cursor-pointer touch-manipulation active:scale-95"
                      title={language === 'or' ? 'GPS ମାଧ୍ୟମରେ ସ୍ଥାନ ବଦଳାନ୍ତୁ' : 'Detect GPS location'}
                    >
                      <MapPin className="w-2.5 h-2.5 text-cyan-400" />
                      <span className="truncate max-w-[110px]">{selectedCity[language === 'or' ? 'nameOr' : 'nameEn']}</span>
                    </button>
                  </div>
                </div>

                {/* Large Tithi Title with Radiant Moon Icon */}
                <div className="flex items-center justify-between gap-2 pt-0.5">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black font-serif text-slate-100 flex items-center gap-2">
                      <span>{tTithiFromKey(selectedDayInfo.panjika.tithi.nameKey)}</span>
                      <span className="text-xl drop-shadow-md">{getMoonIcon(selectedDayInfo.tithiNumber, selectedDayInfo.isPurnima, selectedDayInfo.isAmavasya)}</span>
                    </h2>
                    {selectedDayInfo.tithiTiming?.durationStrOr && (
                      <div className="text-xs text-amber-300 font-semibold flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{selectedDayInfo.tithiTiming.durationStrOr}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Digashula & Remedy Banner */}
                {selectedDayInfo.digashula && (
                  <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-500/35 text-[10.5px] sm:text-[11px] text-slate-200 flex items-center justify-between gap-2 shadow-xs">
                    <span className="text-amber-300 font-bold flex items-center gap-1 shrink-0">
                      <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>ଦିଗଶୂଳ: {selectedDayInfo.digashula.directionOr}</span>
                    </span>
                    <span className="text-emerald-300 text-right truncate max-w-[60%]">
                      {selectedDayInfo.digashula.remedyOr}
                    </span>
                  </div>
                )}
              </div>

              {/* Royal 4-Action Command Matrix (Guaranteed 2x2 Grid - Never Squished) */}
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5 mb-3.5">
                {/* WhatsApp Action */}
                <button
                  type="button"
                  onClick={() => handleWhatsAppShare(selectedDayInfo)}
                  className="group relative overflow-hidden flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-900/60 via-emerald-950/80 to-[#032e18]/90 hover:from-emerald-800/80 hover:to-emerald-900/90 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 transition-all shadow-md active:scale-95 touch-manipulation cursor-pointer min-h-[48px]"
                  title={language === 'or' ? 'WhatsApp ରେ ପାଞ୍ଜି ସେୟାର୍ କରନ୍ତୁ' : 'Share on WhatsApp'}
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <div className="text-xs font-black text-emerald-200 truncate whitespace-nowrap">WhatsApp</div>
                    <div className="text-[9.5px] text-emerald-400/80 font-medium truncate whitespace-nowrap">
                      {language === 'or' ? 'ପାଞ୍ଜି ସେୟାର୍' : language === 'hi' ? 'शेयर करें' : 'Share Almanac'}
                    </div>
                  </div>
                </button>

                {/* Google Calendar Action */}
                <button
                  type="button"
                  onClick={() => handleGoogleCalendarSync(selectedDayInfo)}
                  className="group relative overflow-hidden flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-cyan-900/60 via-cyan-950/80 to-[#042838]/90 hover:from-cyan-800/80 hover:to-cyan-900/90 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 transition-all shadow-md active:scale-95 touch-manipulation cursor-pointer min-h-[48px]"
                  title={language === 'or' ? 'Google Calendar ରେ ଯୋଡ଼ନ୍ତୁ' : 'Add to Google Calendar'}
                >
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <CalendarPlus className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <div className="text-xs font-black text-cyan-200 truncate whitespace-nowrap">
                      {language === 'or' ? 'କ୍ୟାଲେଣ୍ଡର' : language === 'hi' ? 'कैलेंडर' : 'Google Cal'}
                    </div>
                    <div className="text-[9.5px] text-cyan-400/80 font-medium truncate whitespace-nowrap">
                      {language === 'or' ? 'ଇଭେଣ୍ଟ ସିଙ୍କ୍' : language === 'hi' ? 'सिंक करें' : 'Sync Event'}
                    </div>
                  </div>
                </button>

                {/* 6 Panjika Comparison Action */}
                <button
                  type="button"
                  onClick={() => setIsPanjikaCompareOpen(true)}
                  className="group relative overflow-hidden flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-900/60 via-amber-950/80 to-[#2e1d05]/90 hover:from-amber-800/80 hover:to-amber-900/90 border border-amber-500/40 hover:border-amber-400 text-amber-300 transition-all shadow-md active:scale-95 touch-manipulation cursor-pointer min-h-[48px]"
                  title={language === 'or' ? '୬ଟି ମୁଖ୍ୟ ପାଞ୍ଜିକା ତୁଳନା ସାରଣୀ' : 'Compare 6 Canonical Panjikas'}
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Scale className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <div className="text-xs font-black text-amber-200 truncate whitespace-nowrap">
                      {language === 'or' ? '୬ ପାଞ୍ଜି ତୁଳନା' : language === 'hi' ? '६ पंचांग तुलना' : '6 Panjikas'}
                    </div>
                    <div className="text-[9.5px] text-amber-400/80 font-medium truncate whitespace-nowrap">
                      {language === 'or' ? 'ମତଭେଦ ସାରଣୀ' : language === 'hi' ? 'तुलना देखें' : 'Compare All'}
                    </div>
                  </div>
                </button>

                {/* Daily Patrika Action */}
                <button
                  type="button"
                  onClick={() => setViewMode('daily')}
                  className="group relative overflow-hidden flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-500/25 via-cosmic-950/90 to-amber-900/40 hover:from-amber-500/35 hover:to-amber-900/50 border border-cosmic-gold/50 hover:border-cosmic-gold text-amber-300 transition-all shadow-md active:scale-95 touch-manipulation cursor-pointer min-h-[48px]"
                  title={language === 'or' ? 'ଦୈନିକ ପୂର୍ଣ୍ଣାଙ୍ଗ ପତ୍ରିକା ଖୋଲନ୍ତୁ' : 'Open Daily Panjika Sheet'}
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <div className="text-xs font-black text-amber-200 truncate whitespace-nowrap">
                      {language === 'or' ? 'ଦୈନିକ ପତ୍ରିକା' : language === 'hi' ? 'दैनिक पत्रिका' : 'Daily Sheet'}
                    </div>
                    <div className="text-[9.5px] text-amber-400/80 font-medium truncate whitespace-nowrap">
                      {language === 'or' ? 'ପୂର୍ଣ୍ଣ ପତ୍ରିକା' : language === 'hi' ? 'पूर्ण विवरण' : 'Full Sheet'}
                    </div>
                  </div>
                </button>
              </div>

              {/* Special Festival Card */}
              {selectedDayInfo.festivals.length > 0 && (
                <div className="mb-3 p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-cosmic-gold/10 to-amber-500/20 border border-amber-500/40 shadow-sm">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>{selectedDayInfo.festivals[0][language === 'or' ? 'nameOr' : language === 'hi' ? 'nameHi' : 'nameEn']}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => downloadIcsEvent(
                        selectedDayInfo.festivals[0].nameEn,
                        selectedDayInfo.date,
                        selectedDayInfo.festivals[0].descriptionEn
                      )}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-cyan-300 hover:text-cyan-200 cursor-pointer"
                    >
                      <CalendarPlus className="w-3 h-3" />
                      <span>{t('add_to_calendar')}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-200 leading-relaxed">
                    {selectedDayInfo.festivals[0][language === 'or' ? 'descriptionOr' : 'descriptionEn']}
                  </p>
                </div>
              )}

              {/* Jagannath Besha Announcement */}
              {selectedDayInfo.jagannathBesha && (
                <div className="mb-3 p-3 rounded-2xl bg-purple-950/40 border border-purple-500/40 text-purple-200 shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-purple-300 tracking-wider flex items-center gap-1">
                    <span>👑</span>
                    <span>{language === 'or' ? 'ଶ୍ରୀମନ୍ଦିର ବିଶେଷ ବେଶ' : 'श्रीमंदिर विशेष वेश'}</span>
                  </span>
                  <div className="font-bold text-sm text-purple-100 mt-0.5">
                    {selectedDayInfo.jagannathBesha[language === 'or' ? 'or' : language === 'hi' ? 'hi' : 'en']}
                  </div>
                  <p className="text-[11px] text-purple-300/90 mt-1 leading-relaxed">
                    {selectedDayInfo.jagannathBesha.descriptionOr}
                  </p>
                </div>
              )}

              {/* Smart Segmented Inspector Tabs: Panchanga, Choghadiya, Ghata Chakra, Sankalpa, Shastra, Navagraha */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-cosmic-950/90 border border-slate-800 rounded-2xl mb-3 text-xs shadow-inner">
                <button
                  type="button"
                  onClick={() => setInspectorTab('panchanga')}
                  className={`px-3 py-2 rounded-xl font-bold transition-all text-center whitespace-nowrap cursor-pointer touch-manipulation flex-shrink-0 active:scale-95 flex items-center gap-1 ${
                    inspectorTab === 'panchanga'
                      ? 'bg-gradient-to-r from-amber-500/30 via-amber-400/20 to-amber-500/30 text-amber-300 border border-amber-400/60 shadow-lg shadow-amber-500/15 font-black'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>🌙</span>
                  <span>{language === 'or' ? 'ପଞ୍ଚାଙ୍ଗ' : 'Panchanga'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInspectorTab('choghadiya')}
                  className={`px-3 py-2 rounded-xl font-bold transition-all text-center whitespace-nowrap cursor-pointer touch-manipulation flex-shrink-0 active:scale-95 flex items-center gap-1 ${
                    inspectorTab === 'choghadiya'
                      ? 'bg-gradient-to-r from-amber-500/30 via-amber-400/20 to-amber-500/30 text-amber-300 border border-amber-400/60 shadow-lg shadow-amber-500/15 font-black'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>⏰</span>
                  <span>{language === 'or' ? 'ଚୌଘଡ଼ିଆ ଓ ହୋରା' : 'Choghadiya & Hora'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInspectorTab('lagna')}
                  className={`px-3 py-2 rounded-xl font-bold transition-all text-center whitespace-nowrap cursor-pointer touch-manipulation flex-shrink-0 active:scale-95 flex items-center gap-1 ${
                    inspectorTab === 'lagna'
                      ? 'bg-gradient-to-r from-amber-500/30 via-amber-400/20 to-amber-500/30 text-amber-300 border border-amber-400/60 shadow-lg shadow-amber-500/15 font-black'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>🌅</span>
                  <span>{language === 'or' ? 'ଲଗ୍ନ ଚକ୍ର' : 'Lagna'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInspectorTab('ghata')}
                  className={`px-3 py-2 rounded-xl font-bold transition-all text-center whitespace-nowrap cursor-pointer touch-manipulation flex-shrink-0 active:scale-95 flex items-center gap-1 ${
                    inspectorTab === 'ghata'
                      ? 'bg-gradient-to-r from-amber-500/30 via-amber-400/20 to-amber-500/30 text-amber-300 border border-amber-400/60 shadow-lg shadow-amber-500/15 font-black'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>🛡️</span>
                  <span>{language === 'or' ? 'ଘାତ ଚକ୍ର' : 'Ghata Chakra'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInspectorTab('sankalpa')}
                  className={`px-3 py-2 rounded-xl font-bold transition-all text-center whitespace-nowrap cursor-pointer touch-manipulation flex-shrink-0 active:scale-95 flex items-center gap-1 ${
                    inspectorTab === 'sankalpa'
                      ? 'bg-gradient-to-r from-amber-500/30 via-amber-400/20 to-amber-500/30 text-amber-300 border border-amber-400/60 shadow-lg shadow-amber-500/15 font-black'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>📜</span>
                  <span>{language === 'or' ? 'ପବିତ୍ର ସଙ୍କଳ୍ପ' : 'Vedic Sankalpa'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInspectorTab('astrology')}
                  className={`px-3 py-2 rounded-xl font-bold transition-all text-center whitespace-nowrap cursor-pointer touch-manipulation flex-shrink-0 active:scale-95 flex items-center gap-1 ${
                    inspectorTab === 'astrology'
                      ? 'bg-gradient-to-r from-amber-500/30 via-amber-400/20 to-amber-500/30 text-amber-300 border border-amber-400/60 shadow-lg shadow-amber-500/15 font-black'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>🪐</span>
                  <span>{language === 'or' ? 'ବିଧି ଓ ଶାସ୍ତ୍ର' : 'Shastra'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInspectorTab('navagraha')}
                  className={`px-3 py-2 rounded-xl font-bold transition-all text-center whitespace-nowrap cursor-pointer touch-manipulation flex-shrink-0 active:scale-95 flex items-center gap-1 ${
                    inspectorTab === 'navagraha'
                      ? 'bg-gradient-to-r from-amber-500/30 via-amber-400/20 to-amber-500/30 text-amber-300 border border-amber-400/60 shadow-lg shadow-amber-500/15 font-black'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>⭐</span>
                  <span>{language === 'or' ? 'ନବଗ୍ରହ ସ୍ଫୁଟ' : 'Navagraha'}</span>
                </button>
              </div>

              {/* TAB 1: ADVANCE PANCHANGA & AUTHENTIC BELAS */}
              {inspectorTab === 'panchanga' && (
                <div className="space-y-2.5 text-xs text-slate-300 animate-in fade-in duration-200">
                  {/* 5 Core Limbs (Panchanga Angas) Matrix */}
                  <div className="p-3 rounded-2xl bg-cosmic-950/80 border border-slate-800 space-y-2.5 shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                      <span className="text-amber-300 font-bold text-xs flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>ପଞ୍ଚାଙ୍ଗର ପଞ୍ଚ ମୁଖ୍ୟ ଅଙ୍ଗ (Panchanga 5 Limbs)</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {selectedDayInfo.panjika.ayanamsa.toFixed(2)}° ଲାହିଡ଼ୀ
                      </span>
                    </div>

                    {/* Nakshatra Full Detail */}
                    <div className="flex items-start justify-between gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-400 flex items-center gap-1 font-medium">
                          <Compass className="w-3 h-3 text-amber-400" />
                          <span>ନକ୍ଷତ୍ର:</span>
                          <strong className="text-slate-100">{tNakshatra(selectedDayInfo.panjika.nakshatra.nameKey)}</strong>
                          <span className="px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 text-[9.5px] border border-amber-500/25 font-mono">
                            ପାଦ {formatNumber(selectedDayInfo.nakshatraTiming?.pada || selectedDayInfo.panjika.nakshatra.pada)}
                          </span>
                        </span>
                      </div>
                      {selectedDayInfo.nakshatraTiming?.durationStrOr && (
                        <div className="text-[10.5px] text-cyan-300 text-right font-medium max-w-[60%]">
                          {selectedDayInfo.nakshatraTiming.durationStrOr}
                        </div>
                      )}
                    </div>

                    {/* Yoga & Karana */}
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/60 text-[11px]">
                      <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-slate-400 block text-[9.5px] font-medium">ଯୋଗ (Yoga)</span>
                        <span className="font-bold text-slate-100 block mt-0.5">{tYoga(selectedDayInfo.panjika.yoga.nameKey)}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-slate-400 block text-[9.5px] font-medium">କରଣ (Karana)</span>
                        <span className="font-bold text-slate-100 block mt-0.5">{tKarana(selectedDayInfo.panjika.karana.nameKey)}</span>
                      </div>
                    </div>

                    {/* Sun Times, Moonrise & Day Length (Dinamana) */}
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Sun className="w-3.5 h-3.5 text-amber-400" />
                          <span>ସୂର୍ଯ୍ୟୋଦୟ / ସୂର୍ଯ୍ୟାସ୍ତ:</span>
                        </span>
                        <span className="font-bold text-slate-100 font-mono">
                          {formatTime(selectedDayInfo.panjika.sunrise)} / {formatTime(selectedDayInfo.panjika.sunset)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-800/60 pt-1">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Moon className="w-3.5 h-3.5 text-cyan-400" />
                          <span>ଚନ୍ଦ୍ରୋଦୟ:</span>
                        </span>
                        <span className="font-bold text-cyan-300 font-mono">
                          {selectedDayInfo.panjika.moonrise ? formatTime(selectedDayInfo.panjika.moonrise) : '—'}
                        </span>
                      </div>
                      {selectedDayInfo.dinamana && (
                        <div className="flex items-center justify-between border-t border-slate-800/60 pt-1 text-[10px]">
                          <span className="text-slate-400">ଦିନମାନ / ରାତ୍ରିମାନ:</span>
                          <span className="font-mono text-amber-300 font-bold">
                            {selectedDayInfo.dinamana.strOr.split('(')[1]?.replace(')', '') || selectedDayInfo.dinamana.strOr}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ✨ SHUBHA BELA & AUSPICIOUS MUHURTAS (Emerald Radiant Card) */}
                  {(() => {
                    const isTodayDay = today.getDate() === selectedDay && today.getMonth() === currentMonth && today.getFullYear() === currentYear;
                    const isAbhijitActive = isTimeActiveNow(selectedDayInfo.panjika.muhurtas.abhijit.start, selectedDayInfo.panjika.muhurtas.abhijit.end, isTodayDay);

                    return (
                      <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-emerald-950/20 to-cosmic-950 border border-emerald-500/40 space-y-2 text-[11px] shadow-sm">
                        <div className="flex items-center justify-between text-emerald-300 font-bold border-b border-emerald-500/25 pb-1.5">
                          <span className="flex items-center gap-1.5 text-xs font-black">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                            <span>ଶୁଭ ବେଳା ଓ ପବିତ୍ର ମୁହୂର୍ତ୍ତ (Auspicious)</span>
                          </span>
                          <span className="flex items-center gap-1">
                            {isAbhijitActive && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500 text-slate-950 animate-pulse">
                                🔴 ଏବେ ଚାଲୁଅଛି
                              </span>
                            )}
                            <span className="text-[10px] text-emerald-400 font-bold">ଅମୃତ ଯୋଗ</span>
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-300 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              <span>ଅଭିଜିତ୍ ମୁହୂର୍ତ୍ତ:</span>
                            </span>
                            <span className={`font-bold font-mono ${isAbhijitActive ? 'text-emerald-300 font-black underline' : 'text-emerald-300'}`}>
                              {selectedDayInfo.advanceMuhurtas?.abhijit[language === 'or' ? 'or' : language === 'hi' ? 'hi' : 'en'] || formatTimeRange(selectedDayInfo.panjika.muhurtas.abhijit.start, selectedDayInfo.panjika.muhurtas.abhijit.end)}
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-slate-300 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              <span>ଅମୃତ ବେଳା:</span>
                            </span>
                            <span className="font-bold text-emerald-300 font-mono">
                              {selectedDayInfo.advanceMuhurtas?.amritaBela[language === 'or' ? 'or' : language === 'hi' ? 'hi' : 'en'] || selectedDayInfo.belas.amrita}
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-slate-300 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              <span>ମାହେନ୍ଦ୍ର ବେଳା:</span>
                            </span>
                            <span className="font-bold text-emerald-300 font-mono">
                              {selectedDayInfo.advanceMuhurtas?.mahendraBela[language === 'or' ? 'or' : language === 'hi' ? 'hi' : 'en'] || selectedDayInfo.belas.mahendra}
                            </span>
                          </div>

                          {selectedDayInfo.advanceMuhurtas?.brahmaMuhurta && (
                            <div className="flex justify-between items-center">
                              <span className="text-slate-300 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                <span>ବ୍ରହ୍ମ ମୁହୂର୍ତ୍ତ:</span>
                              </span>
                              <span className="font-bold text-cyan-300 font-mono">
                                {selectedDayInfo.advanceMuhurtas.brahmaMuhurta[language === 'or' ? 'or' : language === 'hi' ? 'hi' : 'en']}
                              </span>
                            </div>
                          )}

                          {selectedDayInfo.advanceMuhurtas?.vijaya && (
                            <div className="flex justify-between items-center">
                              <span className="text-slate-300 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                <span>ବିଜୟ ମୁହୂର୍ତ୍ତ:</span>
                              </span>
                              <span className="font-bold text-emerald-300 font-mono">
                                {selectedDayInfo.advanceMuhurtas.vijaya[language === 'or' ? 'or' : language === 'hi' ? 'hi' : 'en']}
                              </span>
                            </div>
                          )}

                          {selectedDayInfo.advanceMuhurtas?.godhuli && (
                            <div className="flex justify-between items-center">
                              <span className="text-slate-300 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                <span>ଗୋଧୂଳି ମୁହୂର୍ତ୍ତ:</span>
                              </span>
                              <span className="font-bold text-amber-300 font-mono">
                                {selectedDayInfo.advanceMuhurtas.godhuli[language === 'or' ? 'or' : language === 'hi' ? 'hi' : 'en']}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* 🕒 BARJITA SAMAYA & ASHUBHA KAALA (Ruby Warning Card) */}
                  {(() => {
                    const isTodayDay = today.getDate() === selectedDay && today.getMonth() === currentMonth && today.getFullYear() === currentYear;
                    const isRahuActive = isTimeActiveNow(selectedDayInfo.panjika.muhurtas.rahuKaal.start, selectedDayInfo.panjika.muhurtas.rahuKaal.end, isTodayDay);

                    return (
                      <div className="p-3 rounded-2xl bg-gradient-to-br from-rose-950/40 via-rose-950/20 to-cosmic-950 border border-rose-500/40 space-y-2 text-[11px] shadow-sm">
                        <div className="flex items-center justify-between text-rose-300 font-bold border-b border-rose-500/25 pb-1.5">
                          <span className="flex items-center gap-1.5 text-xs font-black">
                            <Clock className="w-3.5 h-3.5 text-rose-400" />
                            <span>ବର୍ଜିତ ସମୟ ଓ ଅଶୁଭ କାଳ (Inauspicious)</span>
                          </span>
                          <span className="flex items-center gap-1">
                            {isRahuActive && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-rose-500 text-white animate-pulse">
                                ⚠️ ରାହୁ କାଳ ଚାଲୁଅଛି
                              </span>
                            )}
                            <span className="text-[10px] text-rose-400 font-bold">ଯାତ୍ରା-କର୍ମ ବର୍ଜନୀୟ</span>
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-300 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                              <span>ରାହୁ କାଳ (Rahu Kaal):</span>
                            </span>
                            <span className={`font-bold font-mono ${isRahuActive ? 'text-rose-300 font-black underline' : 'text-rose-300'}`}>
                              {selectedDayInfo.advanceMuhurtas?.rahuKaal[language === 'or' ? 'or' : language === 'hi' ? 'hi' : 'en'] || formatTimeRange(selectedDayInfo.panjika.muhurtas.rahuKaal.start, selectedDayInfo.panjika.muhurtas.rahuKaal.end)}
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-slate-300 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                              <span>ଯମଗଣ୍ଡ:</span>
                            </span>
                            <span className="font-bold text-rose-300 font-mono">
                              {selectedDayInfo.advanceMuhurtas?.yamaganda[language === 'or' ? 'or' : language === 'hi' ? 'hi' : 'en'] || formatTimeRange(selectedDayInfo.panjika.muhurtas.yamaganda.start, selectedDayInfo.panjika.muhurtas.yamaganda.end)}
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-slate-300 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                              <span>କାଳ ବେଳା:</span>
                            </span>
                            <span className="font-bold text-rose-300 font-mono">
                              {selectedDayInfo.advanceMuhurtas?.kalaBela[language === 'or' ? 'or' : language === 'hi' ? 'hi' : 'en'] || selectedDayInfo.belas.kalaBela}
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-slate-300 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                              <span>ବାର ବେଳା:</span>
                            </span>
                            <span className="font-bold text-rose-300 font-mono">
                              {selectedDayInfo.advanceMuhurtas?.varaBela[language === 'or' ? 'or' : language === 'hi' ? 'hi' : 'en'] || selectedDayInfo.belas.varaBela}
                            </span>
                          </div>

                          {selectedDayInfo.advanceMuhurtas?.gulikaKaal && (
                            <div className="flex justify-between items-center">
                              <span className="text-slate-300 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                <span>ଗୁଳିକ କାଳ:</span>
                              </span>
                              <span className="font-bold text-amber-300 font-mono">
                                {selectedDayInfo.advanceMuhurtas.gulikaKaal[language === 'or' ? 'or' : language === 'hi' ? 'hi' : 'en']}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* TAB 2: ASTROLOGY, SPUTA & SHASTRA */}
              {inspectorTab === 'astrology' && (
                <div className="space-y-2 text-xs text-slate-300 animate-in fade-in duration-200">
                  {/* Surya & Chandra Rashi */}
                  <div className="p-2.5 rounded-xl bg-cosmic-950/70 border border-slate-800 space-y-1.5 text-[11px] shadow-xs">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-1">
                      <span className="text-slate-400 flex items-center gap-1 font-medium">☀️ {t('surya_rashi_label') || 'ରବି ରାଶି ସ୍ଫୁଟ'}</span>
                      <span className="font-bold text-amber-300">{selectedDayInfo.suryaRashiInfo?.rashiOr} ({selectedDayInfo.suryaRashiInfo?.degreesStrOr})</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-800 pb-1">
                      <span className="text-slate-400 flex items-center gap-1 font-medium">🌙 {t('chandra_rashi_label') || 'ଚନ୍ଦ୍ର ରାଶି ସ୍ଫୁଟ'}</span>
                      <span className="font-bold text-cyan-300">{selectedDayInfo.chandraRashiInfo?.rashiOr} ({selectedDayInfo.chandraRashiInfo?.degreesStrOr})</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 pt-0.5">
                      <span>ନିରାୟଣ ଲାହିଡ଼ୀ ଅୟନାଂଶ:</span>
                      <span className="font-mono text-slate-200">{formatNumber(selectedDayInfo.panjika.ayanamsa.toFixed(2))}°</span>
                    </div>
                  </div>

                  {/* Dinamana & Ratrimana Traditional Card */}
                  {selectedDayInfo.dinamana && (
                    <div className="p-2.5 rounded-xl bg-amber-950/25 border border-amber-500/30 text-[11px] shadow-xs space-y-1">
                      <div className="text-amber-300 font-bold flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                        <span>ଦିନମାନ ଓ ରାତ୍ରିମାନ ବିଚାର (Day & Night Duration)</span>
                      </div>
                      <div className="flex justify-between text-slate-200 text-[10.5px]">
                        <span className="text-slate-400">ଦିନମାନ (Daylight):</span>
                        <span className="font-bold font-mono text-amber-300">{selectedDayInfo.dinamana.strOr}</span>
                      </div>
                      {selectedDayInfo.ratrimana && (
                        <div className="flex justify-between text-slate-200 text-[10.5px] border-t border-amber-500/20 pt-1">
                          <span className="text-slate-400">ରାତ୍ରିମାନ (Night):</span>
                          <span className="font-bold font-mono text-cyan-300">{selectedDayInfo.ratrimana.strOr}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Digashula & Remedy */}
                  {selectedDayInfo.digashula && (
                    <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/35 space-y-1 text-[11px] shadow-xs">
                      <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                        <Compass className="w-3.5 h-3.5 text-amber-400" />
                        <span>{t('digashula_label') || 'ଦିଗଶୂଳ ଓ ଯାତ୍ରା ପ୍ରତିକାର'}</span>
                      </div>
                      <div className="text-slate-200">
                        <span className="text-rose-400 font-bold">ଶୂଳ ଦିଗ: </span>
                        <span>{selectedDayInfo.digashula.directionOr}</span>
                      </div>
                      <div className="text-emerald-300 font-medium text-[10px]">
                        <span>{selectedDayInfo.digashula.remedyOr}</span>
                      </div>
                    </div>
                  )}

                  {/* Tarabala & Chandrabala */}
                  <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/35 space-y-1 text-[11px] shadow-xs">
                    <div className="text-indigo-300 font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      <span>ତାରାବଳ ଓ ଚନ୍ଦ୍ରବଳ ବିଚାର</span>
                    </div>
                    <div className="text-[10px] text-slate-300 leading-relaxed">
                      <span className="text-amber-400 font-bold">ତାରାବଳ: </span>
                      <span>{selectedDayInfo.tarabalaSummaryOr}</span>
                    </div>
                    <div className="text-[10px] text-slate-300 leading-relaxed">
                      <span className="text-cyan-400 font-bold">ଚନ୍ଦ୍ରବଳ: </span>
                      <span>{selectedDayInfo.chandrabalaSummaryOr}</span>
                    </div>
                  </div>

                  {/* Food Injunction (ଖାଦ୍ୟ ନିଷେଧ) */}
                  <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-500/35 text-rose-200 text-[11px] shadow-xs">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                      <AlertCircle className="w-3 h-3" />
                      <span>{t('food_restriction_label')}</span>
                    </div>
                    <div className="text-xs mt-1 font-medium text-slate-200 leading-relaxed">
                      {selectedDayInfo.foodRestrictionOr}
                    </div>
                  </div>

                  {/* Panjika Comparative Notes */}
                  {selectedDayInfo.panjikaNotes && (
                    <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-[11px] shadow-xs">
                      <span className="font-bold text-amber-300 block mb-0.5">
                        📜 {selectedPanjika.nameOr} ବିଶେଷତା:
                      </span>
                      <p className="text-slate-300 text-[10px] leading-relaxed">
                        {language === 'or' ? selectedDayInfo.panjikaNotes.or : language === 'hi' ? selectedDayInfo.panjikaNotes.hi : selectedDayInfo.panjikaNotes.en}
                      </p>
                    </div>
                  )}

                  {/* Open Full Daily Sheet Button */}
                  <button
                    type="button"
                    onClick={() => setViewMode('daily')}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500/25 via-cosmic-gold/20 to-amber-500/25 hover:bg-cosmic-gold/35 border border-cosmic-gold/50 text-amber-300 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>ସମ୍ପୂର୍ଣ୍ଣ ଦୈନିକ ପାଞ୍ଜି ପତ୍ରିକା ଖୋଲନ୍ତୁ</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* TAB 3: NAVAGRAHA REAL ASTRONOMICAL SPUTA */}
              {inspectorTab === 'navagraha' && selectedDayInfo.navagrahaSputa && (
                <div className="space-y-2.5 text-xs text-slate-300 animate-in fade-in duration-200">
                  {/* Ayanamsa Banner */}
                  <div className="p-2.5 rounded-xl bg-cosmic-950/80 border border-slate-800 flex items-center justify-between text-[11px] shadow-xs">
                    <span className="text-slate-400 flex items-center gap-1 font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>ନିରାୟଣ ଲାହିଡ଼ୀ ଅୟନାଂଶ:</span>
                    </span>
                    <span className="font-bold font-mono text-amber-300">
                      {selectedDayInfo.navagrahaSputa.ayanamsaStrOr}
                    </span>
                  </div>

                  {/* 9 Planets Sputa Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedDayInfo.navagrahaSputa.grahas.map((graha) => (
                      <div
                        key={graha.id}
                        className="p-2.5 rounded-xl bg-cosmic-950/70 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between shadow-xs"
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-bold text-white flex items-center gap-1.5 text-xs">
                            <span>{graha.icon}</span>
                            <span>{graha.nameOr}</span>
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold border ${
                            graha.isRetrograde
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          }`}>
                            {graha.retrogradeLabelOr}
                          </span>
                        </div>

                        <div className="space-y-0.5 text-[11px]">
                          <div className="flex justify-between">
                            <span className="text-slate-400">ରାଶି:</span>
                            <span className="font-bold text-amber-300">{graha.rashiOr} ({graha.degMinSecOr})</span>
                          </div>
                          <div className="flex justify-between text-[10px]">
                            <span className="text-slate-400">ନକ୍ଷତ୍ର:</span>
                            <span className="text-cyan-300 font-medium">{graha.nakshatraOr} (ପାଦ {formatNumber(graha.pada)})</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Panjika Comparison Quick Trigger */}
                  <button
                    type="button"
                    onClick={() => setIsPanjikaCompareOpen(true)}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-cosmic-gold/20 to-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md mt-1"
                  >
                    <Scale className="w-3.5 h-3.5 text-amber-400" />
                    <span>୬ଟି ମୁଖ୍ୟ ପାଞ୍ଜିକା ତୁଳନା ସାରଣୀ ଖୋଲନ୍ତୁ</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* TAB 4: CHOGHADIYA & PLANETARY HORAS */}
              {inspectorTab === 'choghadiya' && (
                <div className="space-y-3 text-xs text-slate-300 animate-in fade-in duration-200">
                  {/* Sub-period toggle: Day / Night / Hora */}
                  <div className="grid grid-cols-3 gap-1 p-1 bg-cosmic-950/90 border border-slate-800 rounded-xl shadow-inner text-[11px]">
                    <button
                      type="button"
                      onClick={() => setChoghadiyaViewPeriod('day')}
                      className={`py-1.5 px-2 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1 cursor-pointer active:scale-95 ${
                        choghadiyaViewPeriod === 'day'
                          ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>☀️</span>
                      <span>{language === 'or' ? 'ଦିବା ଚୌଘଡ଼ିଆ' : 'Day'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setChoghadiyaViewPeriod('night')}
                      className={`py-1.5 px-2 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1 cursor-pointer active:scale-95 ${
                        choghadiyaViewPeriod === 'night'
                          ? 'bg-purple-500/25 text-purple-300 border border-purple-500/50 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>🌙</span>
                      <span>{language === 'or' ? 'ରାତ୍ରି ଚୌଘଡ଼ିଆ' : 'Night'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setChoghadiyaViewPeriod('hora')}
                      className={`py-1.5 px-2 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1 cursor-pointer active:scale-95 ${
                        choghadiyaViewPeriod === 'hora'
                          ? 'bg-sky-500/25 text-sky-300 border border-sky-500/50 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>🪐</span>
                      <span>{language === 'or' ? 'ଗ୍ରହ ହୋରା' : 'Hora'}</span>
                    </button>
                  </div>

                  {/* Day / Night Choghadiya List */}
                  {(choghadiyaViewPeriod === 'day' || choghadiyaViewPeriod === 'night') && (
                    <div className="space-y-2">
                      <div className="text-[11px] text-slate-400 flex items-center justify-between px-1">
                        <span>
                          {choghadiyaViewPeriod === 'day'
                            ? '☀️ ସୂର୍ଯ୍ୟୋଦୟରୁ ସୂର୍ଯ୍ୟାସ୍ତ ମଧ୍ୟରେ ୮ଟି ମୁହୂର୍ତ୍ତ:'
                            : '🌙 ସୂର୍ଯ୍ୟାସ୍ତରୁ ପରଦିନ ସୂର୍ଯ୍ୟୋଦୟ ମଧ୍ୟରେ ୮ଟି ମୁହୂର୍ତ୍ତ:'}
                        </span>
                        <span className="text-amber-400/90 font-medium">୮ ଘଟୀ ବିଭାଜନ</span>
                      </div>

                      {((choghadiyaViewPeriod === 'day'
                        ? selectedDayInfo.choghadiya?.dayChoghadiya
                        : selectedDayInfo.choghadiya?.nightChoghadiya) || []
                      ).map((slot) => {
                        const isAuspicious = slot.nature === 'shubh';
                        const isNeutral = slot.nature === 'char';
                        return (
                          <div
                            key={`${slot.period}-${slot.index}`}
                            className={`p-2.5 rounded-xl border transition-all ${
                              slot.isCurrent
                                ? 'bg-amber-500/15 border-amber-400 shadow-md ring-1 ring-amber-400/50'
                                : isAuspicious
                                ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/50'
                                : isNeutral
                                ? 'bg-sky-950/20 border-sky-500/30 hover:border-sky-500/50'
                                : 'bg-rose-950/20 border-rose-500/30 hover:border-rose-500/50'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="font-bold text-sm text-white">
                                  {slot.nameOr}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  ({slot.rulerOr})
                                </span>
                                {slot.isCurrent && (
                                  <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-cosmic-950 font-black text-[9px] uppercase tracking-wider animate-pulse">
                                    🔴 Live Now
                                  </span>
                                )}
                              </div>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-bold border flex-shrink-0 whitespace-nowrap ${
                                  isAuspicious
                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                    : isNeutral
                                    ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                                    : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                }`}
                              >
                                {slot.natureOr}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-300">
                              <span className="font-mono text-amber-200/90 font-medium">
                                ⏰ {slot.timeRangeOr}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                              {slot.significanceOr}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* 24-Hour Planetary Horas */}
                  {choghadiyaViewPeriod === 'hora' && (
                    <div className="space-y-2">
                      <div className="p-2.5 rounded-xl bg-sky-950/30 border border-sky-500/30 text-[11px] text-sky-200 leading-relaxed">
                        🪐 ସୂର୍ଯ୍ୟୋଦୟରୁ ଆରମ୍ଭ କରି ପ୍ରତ୍ୟେକ ଘଣ୍ଟା ଗୋଟିଏ ଗ୍ରହଙ୍କ ହୋରା ଅଧୀନରେ ଥାଏ। ଆଜି ପ୍ରଥମ ହୋରା: <strong className="text-amber-300">{selectedDayInfo.planetaryHoras?.[0]?.planetNameOr}</strong>।
                      </div>

                      <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
                        {(selectedDayInfo.planetaryHoras || []).map((hora) => (
                          <div
                            key={hora.index}
                            className={`p-2 rounded-xl border flex items-center justify-between gap-2 text-[11px] transition-all ${
                              hora.isCurrent
                                ? 'bg-amber-500/20 border-amber-400 shadow-md ring-1 ring-amber-400/40'
                                : 'bg-cosmic-950/70 border-slate-800/80 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="font-mono text-[10px] text-slate-400 w-5">
                                #{hora.hourOfSunrise}
                              </span>
                              <span className="font-bold text-white text-xs">
                                {hora.planetNameOr} ହୋରା
                              </span>
                              {hora.isCurrent && (
                                <span className="text-[9px] px-1.5 py-0.2 bg-amber-500 text-cosmic-950 font-bold rounded-full">
                                  Live
                                </span>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="font-mono text-amber-300 text-[10px]">
                                {hora.timeRangeOr}
                              </div>
                              <div className="text-[9px] text-slate-400 truncate max-w-[140px]">
                                {hora.recommendationOr}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: DAILY 12 LAGNAS (ASCENDANTS) & LIVE TRACKER */}
              {inspectorTab === 'lagna' && (
                <div className="space-y-3 text-xs text-slate-300 animate-in fade-in duration-200">
                  {/* Active Lagna Hero Banner */}
                  {selectedDayInfo.currentLagna ? (
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 via-amber-950/30 to-cosmic-950 border border-amber-400/60 shadow-lg space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs font-black text-amber-300">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                          <span>🔴 ବର୍ତ୍ତମାନ ଉଦିତ ଲଗ୍ନ:</span>
                          <span className="text-white text-sm underline decoration-amber-400 font-bold">
                            {selectedDayInfo.currentLagna.rashiNameOr} ଲଗ୍ନ
                          </span>
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                          selectedDayInfo.currentLagna.nature === 'sthira'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : selectedDayInfo.currentLagna.nature === 'chara'
                            ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        }`}>
                          {selectedDayInfo.currentLagna.natureOr} • {selectedDayInfo.currentLagna.elementOr}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-300 pt-0.5">
                        <span>
                          ଲଗ୍ନାଧିପତି: <strong className="text-amber-200">{selectedDayInfo.currentLagna.lordOr}</strong>
                        </span>
                        <span className="font-mono text-amber-300 font-bold">
                          ⏰ {selectedDayInfo.currentLagna.timeRangeOr}
                        </span>
                      </div>

                      <p className="text-[10px] text-amber-100/90 leading-relaxed bg-black/30 p-2 rounded-xl border border-amber-500/20">
                        ✨ {selectedDayInfo.currentLagna.suitabilityOr}
                      </p>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-cosmic-950/70 border border-slate-800 text-slate-400 text-center text-xs">
                      ପ୍ରତ୍ୟେକ ଦିନ ସୂର୍ଯ୍ୟୋଦୟରୁ ୨୪ ଘଣ୍ଟା ମଧ୍ୟରେ ୧୨ଟି ଲଗ୍ନ ଉଦିତ ହୁଅନ୍ତି।
                    </div>
                  )}

                  {/* 12 Lagnas Chronological Matrix */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 font-medium">
                      <span>🌅 ଦୈନିକ ୧୨ ଲଗ୍ନ ଭୋଗ ସମୟ:</span>
                      <span className="text-amber-400/90 text-[10px]">ସୂର୍ଯ୍ୟୋଦୟରୁ ପରଦିନ ସୂର୍ଯ୍ୟୋଦୟ</span>
                    </div>

                    <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1 cosmic-scrollbar">
                      {(selectedDayInfo.dailyLagnas || []).map((lagna) => {
                        const isSthira = lagna.nature === 'sthira';
                        const isChara = lagna.nature === 'chara';

                        return (
                          <div
                            key={lagna.index}
                            className={`p-2.5 rounded-xl border transition-all ${
                              lagna.isCurrent
                                ? 'bg-amber-500/20 border-amber-400 shadow-md ring-1 ring-amber-400/50'
                                : 'bg-cosmic-950/70 border-slate-800/80 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="font-mono text-[10px] text-slate-400 w-5">
                                  #{lagna.index + 1}
                                </span>
                                <span className="font-bold text-xs text-white">
                                  {lagna.rashiNameOr} ଲଗ୍ନ
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  ({lagna.lordOr})
                                </span>
                                {lagna.isCurrent && (
                                  <span className="text-[9px] px-1.5 py-0.2 bg-amber-500 text-cosmic-950 font-black rounded-full uppercase tracking-wider animate-pulse">
                                    Live
                                  </span>
                                )}
                              </div>

                              <span
                                className={`text-[9px] px-2 py-0.5 rounded-full font-bold border flex-shrink-0 ${
                                  isSthira
                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                    : isChara
                                    ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                }`}
                              >
                                {lagna.natureOr} • {lagna.elementOr}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[10.5px] text-slate-300">
                              <span className="font-mono text-amber-300">
                                ⏰ {lagna.timeRangeOr}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                ଅବଧି: {lagna.durationMinutes} ମିନିଟ୍
                              </span>
                            </div>

                            <div className="text-[9.5px] text-slate-400 mt-1 truncate">
                              {lagna.suitabilityOr}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Traditional Shastra Guideline Card */}
                  <div className="p-2.5 rounded-2xl bg-amber-950/25 border border-amber-500/30 text-[10.5px] text-amber-200/90 leading-relaxed space-y-1">
                    <span className="font-bold text-amber-300 block">
                      📜 ଜ୍ୟୋତିଷ ଶାସ୍ତ୍ର ନିୟମ:
                    </span>
                    <p>
                      ବିବାହ, ଗୃହପ୍ରବେଶ ଓ ସ୍ଥାୟୀ ପ୍ରତିଷ୍ଠା ପାଇଁ <strong className="text-emerald-300">ସ୍ଥିର ଲଗ୍ନ (ବୃଷ, ସିଂହ, ବିଛା, କୁମ୍ଭ)</strong> ସର୍ବୋତ୍ତମ। ଯାତ୍ରା ଓ ବାହନ ପାଇଁ <strong className="text-sky-300">ଚର ଲଗ୍ନ</strong> ତଥା ବ୍ରତଘର ଓ ବିଦ୍ୟାରମ୍ଭ ପାଇଁ <strong className="text-amber-300">ଦ୍ୱିସ୍ୱଭାବ ଲଗ୍ନ</strong> ଶୁଭ।
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 5: RASHI GHATA CHAKRA & CHANDRASHTAMA */}
              {inspectorTab === 'ghata' && (
                <div className="space-y-3 text-xs text-slate-300 animate-in fade-in duration-200">
                  <div>
                    <label className="text-[11px] text-amber-300 font-bold block mb-1.5">
                      👉 ଆପଣଙ୍କ ଜନ୍ମ ରାଶି ଚୟନ କରନ୍ତୁ:
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1.5">
                      {(selectedDayInfo.ghataChakra || []).map((r) => (
                        <button
                          key={r.rashiIdx}
                          type="button"
                          onClick={() => setSelectedGhataRashiIdx(r.rashiIdx)}
                          className={`py-1.5 px-1 rounded-xl text-center font-bold text-xs transition-all cursor-pointer touch-manipulation active:scale-95 ${
                            selectedGhataRashiIdx === r.rashiIdx
                              ? 'bg-gradient-to-r from-amber-500/30 to-amber-600/30 text-amber-300 border border-amber-400/80 shadow-md font-black'
                              : 'bg-cosmic-950/80 border border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <span>{r.rashiNameOr}</span>
                          {r.isChandrashtama && (
                            <span className="block text-[8px] text-rose-400 font-normal">ଚନ୍ଦ୍ରାଷ୍ଟମ</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Rashi Verdict Banner */}
                  {(() => {
                    const rashiInfo = selectedDayInfo.ghataChakra?.[selectedGhataRashiIdx];
                    if (!rashiInfo) return null;

                    const isChandra = rashiInfo.isChandrashtama;
                    const isVara = rashiInfo.isGhataVara;

                    return (
                      <div className="space-y-2.5">
                        <div
                          className={`p-3 rounded-2xl border space-y-2 shadow-lg ${
                            isChandra && isVara
                              ? 'bg-rose-950/40 border-rose-500/60 text-rose-200'
                              : isChandra
                              ? 'bg-rose-950/30 border-rose-500/50 text-rose-200'
                              : isVara
                              ? 'bg-amber-950/30 border-amber-500/50 text-amber-200'
                              : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                          }`}
                        >
                          <div className="flex items-center gap-2 font-bold text-sm">
                            {isChandra ? (
                              <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0 animate-pulse" />
                            ) : isVara ? (
                              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                            ) : (
                              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                            )}
                            <span>
                              {rashiInfo.rashiNameOr} ରାଶି: {rashiInfo.overallStatusOr}
                            </span>
                          </div>

                          <p className="text-[11px] leading-relaxed opacity-90">
                            {isChandra
                              ? `ଆଜି ଚନ୍ଦ୍ର ଆପଣଙ୍କ ରାଶିରୁ ଅଷ୍ଟମ ଭାବରେ ସ୍ଥିତ। ମାନସିକ ଅଶାନ୍ତି, କାର୍ଯ୍ୟରେ ବାଧା ଓ ଦୁର୍ଘଟଣାର ଆଶଙ୍କା ଥାଏ। ନୂତନ ଚୁକ୍ତି କିମ୍ବା ବଡ଼ ଆର୍ଥିକ ନିବେଶରୁ ବିରତ ରୁହନ୍ତୁ।`
                              : isVara
                              ? `ଆଜି ଆପଣଙ୍କ ରାଶି ପାଇଁ ଘାତବାର (${rashiInfo.ghataVaraNameOr})। ଯାତ୍ରା ଓ ମହତ୍ତ୍ୱପୂର୍ଣ୍ଣ କାର୍ଯ୍ୟରେ ସାବଧାନତା ଅବଲମ୍ବନ କରନ୍ତୁ।`
                              : `ଆଜି କୌଣସି ଚନ୍ଦ୍ରାଷ୍ଟମ କିମ୍ବା ଘାତବାର ଦୋଷ ନାହିଁ। ଆପଣ ଶୁଦ୍ଧ ମନରେ ଶୁଭ କାର୍ଯ୍ୟ, ଯାତ୍ରା ଓ ବ୍ୟବସାୟିକ କାରବାର କରିପାରିବେ।`}
                          </p>

                          <div className="p-2 rounded-xl bg-black/40 border border-white/10 text-[11px] space-y-0.5">
                            <span className="font-bold text-amber-300">🕉️ ଶାସ୍ତ୍ରୋକ୍ତ ପ୍ରତିକାର: </span>
                            <span className="text-slate-200">{rashiInfo.remedyOr}</span>
                          </div>
                        </div>

                        {/* Detailed Injunctions Checklist */}
                        <div className="p-3 rounded-2xl bg-cosmic-950/80 border border-slate-800 space-y-2">
                          <div className="font-bold text-slate-200 text-xs border-b border-slate-800/80 pb-1.5 flex items-center justify-between">
                            <span>{rashiInfo.rashiNameOr} ରାଶିର ଶାସ୍ତ୍ରୀୟ ଘାତ ନିର୍ଣ୍ଣୟ:</span>
                            <span className="text-[10px] text-amber-400">କୋହିନୂର / ମୁକ୍ତିମଣ୍ଡପ ମତ</span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div className="p-2 rounded-xl bg-black/30 border border-slate-800/60">
                              <span className="text-slate-400 block text-[10px]">ଘାତ ବାର:</span>
                              <span className="font-semibold text-slate-200">{rashiInfo.ghataVaraNameOr}</span>
                              <span className="block text-[9px] mt-0.5 font-bold">
                                {rashiInfo.isGhataVara ? '⚠️ ଆଜି ପଡ଼ିଛି' : '✅ ଆଜି ନାହିଁ'}
                              </span>
                            </div>
                            <div className="p-2 rounded-xl bg-black/30 border border-slate-800/60">
                              <span className="text-slate-400 block text-[10px]">ଚନ୍ଦ୍ରାଷ୍ଟମ (୮ମ ଚନ୍ଦ୍ର):</span>
                              <span className="font-semibold text-slate-200">
                                {rashiInfo.isChandrashtama ? 'ଅଷ୍ଟମ ସ୍ଥିତି' : 'ଶୁଭ ସ୍ଥିତି'}
                              </span>
                              <span className="block text-[9px] mt-0.5 font-bold">
                                {rashiInfo.isChandrashtama ? '⚠️ ଆଜି ଚନ୍ଦ୍ରାଷ୍ଟମ' : '✅ ନାହିଁ'}
                              </span>
                            </div>
                            <div className="p-2 rounded-xl bg-black/30 border border-slate-800/60">
                              <span className="text-slate-400 block text-[10px]">ଘାତ ତିଥି:</span>
                              <span className="font-semibold text-slate-200">{rashiInfo.ghataTithiNameOr}</span>
                              <span className="block text-[9px] mt-0.5 font-bold">
                                {rashiInfo.isGhataTithi ? '⚠️ ଆଜି ଘାତ ତିଥି' : '✅ ନାହିଁ'}
                              </span>
                            </div>
                            <div className="p-2 rounded-xl bg-black/30 border border-slate-800/60">
                              <span className="text-slate-400 block text-[10px]">ଘାତ ନକ୍ଷତ୍ର:</span>
                              <span className="font-semibold text-slate-200">{rashiInfo.ghataNakshatraNameOr}</span>
                              <span className="block text-[9px] mt-0.5 font-bold">
                                {rashiInfo.isGhataNakshatra ? '⚠️ ଆଜି ଘାତ ନକ୍ଷତ୍ର' : '✅ ନାହିଁ'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* TAB 6: VEDIC SANKALPA & SACRED STOTRAS */}
              {inspectorTab === 'sankalpa' && (
                <div className="space-y-3.5 text-xs text-slate-300 animate-in fade-in duration-200">
                  {/* Mode Toggle: Sankalpa vs Stotras & Japa */}
                  <div className="flex items-center gap-1.5 p-1 bg-black/40 border border-slate-800 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setSankalpaMode('sankalpa')}
                      className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        sankalpaMode === 'sankalpa'
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-cosmic-950 shadow-md font-black'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>📜</span>
                      <span>{language === 'or' ? 'ବୈଦିକ ସଙ୍କଳ୍ପ ପାଠ' : language === 'hi' ? 'वैदिक संकल्प' : 'Vedic Sankalpa'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSankalpaMode('stotras')}
                      className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        sankalpaMode === 'stotras'
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-cosmic-950 shadow-md font-black'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>🕉️</span>
                      <span>{language === 'or' ? 'ସ୍ତୋତ୍ର ଓ ମନ୍ତ୍ର ଜପ' : language === 'hi' ? 'स्तोत्र एवं जप' : 'Stotra & Japa'}</span>
                    </button>
                  </div>

                  {sankalpaMode === 'sankalpa' ? (
                    <>
                      {/* Devotee Customization Inputs */}
                      <div className="p-3 rounded-2xl bg-cosmic-950/80 border border-slate-800 space-y-2.5">
                        <div className="flex items-center justify-between text-xs font-bold text-amber-300 border-b border-slate-800 pb-1.5">
                          <span>🕉️ ଶ୍ରଦ୍ଧାଳୁ ତଥ୍ୟ (Customizer)</span>
                          <span className="text-[10px] text-slate-400 font-normal">ସଙ୍କଳ୍ପ ପାଇଁ</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-0.5">ଆପଣଙ୍କ ନାମ:</label>
                            <input
                              type="text"
                              value={sankalpaDevoteeName}
                              onChange={(e) => setSankalpaDevoteeName(e.target.value)}
                              placeholder="ନାମ ଲେଖନ୍ତୁ"
                              className="w-full bg-black/50 border border-slate-700/80 rounded-lg px-2 py-1.5 text-xs text-white placeholder:text-slate-500 focus:border-amber-400 outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-0.5">ଆପଣଙ୍କ ଗୋତ୍ର:</label>
                            <input
                              type="text"
                              value={sankalpaGotra}
                              onChange={(e) => setSankalpaGotra(e.target.value)}
                              placeholder="ଗୋତ୍ର ଲେଖନ୍ତୁ"
                              className="w-full bg-black/50 border border-slate-700/80 rounded-lg px-2 py-1.5 text-xs text-white placeholder:text-slate-500 focus:border-amber-400 outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">ସଙ୍କଳ୍ପ ଉଦ୍ଦେଶ୍ୟ:</label>
                          <select
                            value={sankalpaPurpose}
                            onChange={(e) => setSankalpaPurpose(e.target.value)}
                            className="w-full bg-black/50 border border-slate-700/80 rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-amber-400"
                          >
                            <option value="ଦୈନିକ ନିତ୍ୟପୂଜା ଓ ଶ୍ରୀଜଗନ୍ନାଥ ପ୍ରୀତି">ଦୈନିକ ନିତ୍ୟପୂଜା ଓ ଶ୍ରୀଜଗନ୍ନାଥ ପ୍ରୀତି</option>
                            <option value="ବ୍ରତ-ଉପବାସ ଉଦ୍ୟାପନ କର୍ମଣି">ବ୍ରତ-ଉପବାସ ଉଦ୍ୟାପନ କର୍ମଣି</option>
                            <option value="ଗୃହ ଶାନ୍ତି, ସ୍ୱାସ୍ଥ୍ୟ ଓ ଐଶ୍ୱର୍ଯ୍ୟ ପ୍ରାପ୍ତି">ଗୃହ ଶାନ୍ତି, ସ୍ୱାସ୍ଥ୍ୟ ଓ ଐଶ୍ୱର୍ଯ୍ୟ ପ୍ରାପ୍ତି</option>
                            <option value="ଦାନ-ଧର୍ମ ଓ ପୂଣ୍ୟ ଲାଭାର୍ଥେ">ଦାନ-ଧର୍ମ ଓ ପୂଣ୍ୟ ଲାଭାର୍ଥେ</option>
                            <option value="ସର୍ବକାର୍ଯ୍ୟ ସିଦ୍ଧି ଓ ସଙ୍କଟ ମୋଚନ">ସର୍ବକାର୍ଯ୍ୟ ସିଦ୍ଧି ଓ ସଙ୍କଟ ମୋଚନ</option>
                          </select>
                        </div>
                      </div>

                      {/* Sacred Sanskrit Sankalpa Box */}
                      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-950/30 via-cosmic-950 to-amber-950/20 border border-amber-500/40 space-y-2.5 shadow-xl">
                        <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
                          <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                            <span>📜</span>
                            <span>ଶାସ୍ତ୍ରୋକ୍ତ ବୈଦିକ ସଙ୍କଳ୍ପ ମନ୍ତ୍ର</span>
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono border border-amber-500/40">
                            {currentSankalpa.gajapatiAnka}
                          </span>
                        </div>

                        {/* Sanskrit Ritual Text */}
                        <div className="p-3 rounded-xl bg-black/60 border border-amber-500/20 font-serif text-[11px] text-amber-100 leading-relaxed max-h-48 overflow-y-auto">
                          {currentSankalpa.sanskritMantra}
                        </div>

                        {/* Odia Meaning */}
                        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] text-slate-300 leading-relaxed">
                          <strong className="text-amber-300 block mb-1">ଭାବାର୍ଥ:</strong>
                          {currentSankalpa.odiaExplanation}
                        </div>

                        {/* Action Buttons: Play Audio, Copy, Share */}
                        <div className="grid grid-cols-3 gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => toggleSankalpaAudio(currentSankalpa.sanskritMantra)}
                            className={`py-2 px-2 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-md ${
                              isPlayingSankalpaAudio
                                ? 'bg-rose-500 text-white animate-pulse'
                                : 'bg-gradient-to-r from-amber-500 to-amber-600 text-cosmic-950 hover:brightness-110'
                            }`}
                          >
                            {isPlayingSankalpaAudio ? (
                              <>
                                <VolumeX className="w-3.5 h-3.5" />
                                <span>ବନ୍ଦ (Stop)</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3.5 h-3.5" />
                                <span>ଶୁଣନ୍ତୁ (Audio)</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(currentSankalpa.sanskritMantra);
                              setCopiedToast('ସଙ୍କଳ୍ପ ମନ୍ତ୍ର କପି ହୋଇଛି');
                              setTimeout(() => setCopiedToast(null), 3000);
                            }}
                            className="py-2 px-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                          >
                            <Copy className="w-3.5 h-3.5 text-amber-300" />
                            <span>କପି (Copy)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const shareText = `🌟 ପବିତ୍ର ବୈଦିକ ସଙ୍କଳ୍ପ 🌟\n\n${currentSankalpa.sanskritMantra}\n\n📍 ଦିବ୍ୟଜ୍ୟୋତି କାଳିଆ ପାଞ୍ଜି ${formatNumber(currentYear)}`;
                              window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank', 'noopener,noreferrer');
                            }}
                            className="py-2 px-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 border border-emerald-500/50 text-emerald-300 font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* STOTRAS & JAPA MALA SUITE */
                    <div className="space-y-3.5">
                      {/* Stotra Selector Pills — 3D */}
                      <div className="grid grid-cols-2 gap-2">
                        {VEDIC_STOTRA_LIST.map(stotra => (
                          <button
                            key={stotra.id}
                            type="button"
                            onClick={() => {
                              setSelectedStotraId(stotra.id);
                              setCurrentJapaCount(0);
                              if (isPlayingSankalpaAudio) {
                                window.speechSynthesis?.cancel();
                                setIsPlayingSankalpaAudio(false);
                              }
                            }}
                            style={{ transformStyle: 'preserve-3d', transition: 'transform .2s, box-shadow .2s, border-color .2s' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'perspective(500px) translateZ(5px)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'perspective(500px)'; }}
                            className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-0.5 ${
                              selectedStotraId === stotra.id
                                ? 'bg-gradient-to-br from-amber-500/30 to-amber-700/20 border-amber-300 text-amber-100 shadow-lg shadow-amber-500/20 font-bold'
                                : 'bg-cosmic-950/60 border-slate-800 text-slate-400 hover:text-amber-100 hover:border-amber-500/40'
                            }`}
                          >
                            <span className="text-xs font-bold truncate w-full">
                              {language === 'or' ? stotra.nameOr : language === 'hi' ? stotra.nameHi : stotra.nameEn}
                            </span>
                            <span className="text-[9px] text-slate-400 truncate w-full">
                              {stotra.composerOr}
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* Selected Stotra Details & Japa Mala Counter */}
                      {(() => {
                        const activeStotra = VEDIC_STOTRA_LIST.find(s => s.id === selectedStotraId) || VEDIC_STOTRA_LIST[0];
                        const fullTextToRecite = activeStotra.verses.map(v => v.textOr).join('\n\n');
                        const isTargetReached = currentJapaCount >= japaTarget && currentJapaCount > 0;

                        return (
                          <div className="space-y-3">
                            {/* Japa Mala Counter Card — Premium 3D */}
                            <div className="relative p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-amber-950/50 via-cosmic-950 to-amber-900/25 border border-amber-400/50 shadow-[0_20px_50px_-12px_rgba(245,158,11,0.35)] space-y-4 overflow-hidden">
                              {/* ambient glow */}
                              <div className="pointer-events-none absolute -top-16 -right-10 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl" />
                              <div className="pointer-events-none absolute -bottom-16 -left-10 w-48 h-48 rounded-full bg-orange-500/10 blur-3xl" />
                              {/* Header */}
                              <div className="relative flex items-center justify-between border-b border-amber-500/20 pb-3">
                                <div className="flex items-center gap-2.5">
                                  <span className="text-2xl drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]">📿</span>
                                  <div>
                                    <span className="font-black text-sm bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent tracking-wide">
                                      {language === 'or' ? 'ଜପ ମାଳା ଓ ସଂଖ୍ୟା ଗଣନା' : language === 'hi' ? 'जाप माला एवं संख्या गणना' : 'Japa Mala Counter'}
                                    </span>
                                    <span className="block text-[10px] text-slate-400">
                                      {language === 'or' ? 'ମନୋନୀତ ଲକ୍ଷ୍ୟ ଅନୁସାରେ ନିତ୍ୟ ଜପ କରନ୍ତୁ' : language === 'hi' ? 'चुने लक्ष्य अनुसार नित्य जाप करें' : 'Chant along with mala beads'}
                                    </span>
                                  </div>
                                </div>

                                {/* Reset Button */}
                                <button
                                  type="button"
                                  onClick={() => setCurrentJapaCount(0)}
                                  className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-[10px] text-slate-300 hover:text-rose-200 border border-white/10 hover:border-rose-400/40 flex items-center gap-1 cursor-pointer transition-all"
                                >
                                  <RotateCcw className="w-3 h-3" />
                                  <span>{language === 'or' ? 'ପୁନଃ ସେଟ୍' : language === 'hi' ? 'रीसेट' : 'Reset'}</span>
                                </button>
                              </div>

                              {/* Target Selector Pills — 3D */}
                              <div className="relative space-y-1.5">
                                <span className="text-[10px] text-amber-200/70 block font-bold tracking-wide uppercase">
                                  {language === 'or' ? 'ଜପ ଲକ୍ଷ୍ୟ ନିର୍ଦ୍ଧାରଣ କରନ୍ତୁ:' : language === 'hi' ? 'जाप लक्ष्य निर्धारित करें:' : 'Select Target Repetitions:'}
                                </span>
                                <div className="flex items-center gap-2 flex-wrap">
                                  {[1, 3, 11, 21, 108].map(target => (
                                    <button
                                      key={target}
                                      type="button"
                                      onClick={() => setJapaTarget(target)}
                                      style={{ transformStyle: 'preserve-3d', transition: 'transform .2s, box-shadow .2s, background .2s' }}
                                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'perspective(400px) translateZ(6px)'; }}
                                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'perspective(400px)'; }}
                                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                        japaTarget === target
                                          ? 'bg-gradient-to-b from-amber-300 to-amber-500 text-cosmic-950 border-amber-200 shadow-lg shadow-amber-500/40 font-black'
                                          : 'bg-black/40 text-slate-300 border-slate-700/80 hover:border-amber-400/60 hover:text-amber-200'
                                      }`}
                                    >
                                      {target === 108 ? `📿 ${formatNumber(target)} (${language === 'or' ? 'ମହାଜପ' : language === 'hi' ? 'महाजप' : 'Mahajap'})` : `${formatNumber(target)}×`}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* ===== 3D Mala Bead Ring + Counter ===== */}
                              <div className="flex flex-col items-center gap-3 py-1">
                                <div className="relative" style={{ perspective: '700px' }}>
                                  <div className="relative" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(10deg)' }}>
                                    <svg width="230" height="230" viewBox="0 0 230 230" className="drop-shadow-[0_12px_32px_rgba(217,119,6,0.35)]">
                                      <defs>
                                        <linearGradient id="malaRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                          <stop offset="0%" stopColor="#f59e0b" /><stop offset="50%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#f97316" />
                                        </linearGradient>
                                        <radialGradient id="malaCenterGlow" cx="50%" cy="50%" r="50%">
                                          <stop offset="0%" stopColor="rgba(251,191,36,0.28)" /><stop offset="100%" stopColor="rgba(0,0,0,0)" />
                                        </radialGradient>
                                        <filter id="malaBeadGlow" x="-60%" y="-60%" width="220%" height="220%">
                                          <feGaussianBlur stdDeviation="2.2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                                        </filter>
                                      </defs>
                                      <circle cx="115" cy="115" r="66" fill="url(#malaCenterGlow)" />
                                      <circle cx="115" cy="115" r="96" fill="none" stroke="#1e293b" strokeWidth="6" />
                                      <circle cx="115" cy="115" r="96" fill="none" stroke="url(#malaRingGrad)" strokeWidth="6" strokeLinecap="round"
                                        strokeDasharray={2 * Math.PI * 96}
                                        strokeDashoffset={2 * Math.PI * 96 * (1 - Math.min(1, currentJapaCount / japaTarget))}
                                        transform="rotate(-90 115 115)"
                                        style={{ transition: 'stroke-dashoffset .6s ease' }} />
                                      {Array.from({ length: Math.min(japaTarget, 108) }).map((_, i) => {
                                        const ang = (-90 + (i / japaTarget) * 360) * Math.PI / 180;
                                        const filled = i < currentJapaCount;
                                        return <circle key={i} cx={115 + 80 * Math.cos(ang)} cy={115 + 80 * Math.sin(ang)}
                                          r={filled ? 4.2 : 2.6} fill={filled ? '#fbbf24' : '#334155'}
                                          filter={filled ? 'url(#malaBeadGlow)' : undefined}
                                          style={{ transition: 'r .25s ease, fill .25s ease' }} />;
                                      })}
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                      <span className="text-5xl font-black text-amber-300 font-mono leading-none"
                                        style={{ textShadow: '0 2px 0 #78350f, 0 6px 16px rgba(0,0,0,0.7)' }}>
                                        {formatNumber(currentJapaCount)}
                                      </span>
                                      <span className="text-xs text-slate-400 font-mono mt-1">/ {formatNumber(japaTarget)}</span>
                                      {isTargetReached && (
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 mt-1.5 animate-bounce">🎉 ସମ୍ପୂର୍ଣ୍ଣ!</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCurrentJapaCount(prev => prev + 1);
                                    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
                                      try { (navigator as any).vibrate(30); } catch (_) {}
                                    }
                                  }}
                                  className="w-full px-4 py-3 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-600 text-cosmic-950 font-black text-sm shadow-lg shadow-amber-500/30 active:scale-95 hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-2 border-t border-amber-300/60"
                                >
                                  <span className="text-lg">📿</span>
                                  <span>{language === 'or' ? '+୧ ଜପ କରନ୍ତୁ' : language === 'hi' ? '+1 जाप करें' : '+1 Chant'}</span>
                                </button>
                              </div>
                            </div>

                            {/* Sacred Stotra Verses Content — Premium */}
                            <div className="relative p-4 rounded-3xl bg-gradient-to-b from-cosmic-900/80 to-cosmic-950/90 border border-amber-500/20 shadow-xl space-y-3">
                              <div className="border-b border-amber-500/20 pb-2.5">
                                <div className="flex items-center justify-between gap-2">
                                  <h4 className="font-black text-sm bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                                    {language === 'or' ? activeStotra.nameOr : language === 'hi' ? activeStotra.nameHi : activeStotra.nameEn}
                                  </h4>
                                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold whitespace-nowrap">
                                    {activeStotra.composerOr}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-400 mt-1">
                                  {activeStotra.summaryOr}
                                </p>
                              </div>

                              {/* Verses List — 3D hover */}
                              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                                {activeStotra.verses.map(v => (
                                  <div
                                    key={v.num}
                                    style={{ transformStyle: 'preserve-3d', transition: 'transform .2s, box-shadow .2s, border-color .2s' }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'perspective(600px) translateZ(4px)'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'perspective(600px)'; }}
                                    className="p-3 rounded-2xl bg-black/50 border border-slate-800/80 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10 font-serif text-xs text-amber-100 leading-relaxed space-y-1"
                                  >
                                    <div className="flex items-center justify-between text-[10px] text-amber-500/70 border-b border-slate-800/60 pb-1 font-sans font-bold">
                                      <span>ଶ୍ଳୋକ {formatNumber(v.num)}</span>
                                    </div>
                                    <div className="whitespace-pre-line pt-1 text-[11px]">
                                      {v.textOr}
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Action Buttons: Audio recitation, Copy, WhatsApp */}
                              <div className="grid grid-cols-3 gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() => toggleSankalpaAudio(fullTextToRecite)}
                                  className={`py-2 px-2 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-md ${
                                    isPlayingSankalpaAudio
                                      ? 'bg-rose-500 text-white animate-pulse'
                                      : 'bg-gradient-to-r from-amber-500 to-amber-600 text-cosmic-950 hover:brightness-110'
                                  }`}
                                >
                                  {isPlayingSankalpaAudio ? (
                                    <>
                                      <VolumeX className="w-3.5 h-3.5" />
                                      <span>ବନ୍ଦ (Stop)</span>
                                    </>
                                  ) : (
                                    <>
                                      <Volume2 className="w-3.5 h-3.5" />
                                      <span>ପାଠ ଶୁଣନ୍ତୁ</span>
                                    </>
                                  )}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(fullTextToRecite);
                                    setCopiedToast(language === 'or' ? 'ସ୍ତୋତ୍ର କପି ହୋଇଛି' : 'Stotra copied');
                                    setTimeout(() => setCopiedToast(null), 3000);
                                  }}
                                  className="py-2 px-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                                >
                                  <Copy className="w-3.5 h-3.5 text-amber-300" />
                                  <span>କପି (Copy)</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    const shareText = `🕉️ ${activeStotra.nameOr} 🕉️\n\n${fullTextToRecite}\n\n📍 ଦିବ୍ୟଜ୍ୟୋତି କାଳିଆ ପାଞ୍ଜି ${formatNumber(currentYear)}`;
                                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank', 'noopener,noreferrer');
                                  }}
                                  className="py-2 px-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 border border-emerald-500/50 text-emerald-300 font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  <span>WhatsApp</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Card Footer */}
            <div className="pt-2.5 border-t border-slate-800/90 flex items-center justify-between text-[11px] text-slate-400">
              <span className="text-amber-300/90 font-medium flex items-center gap-1">
                <span>📜</span>
                <span>{language === 'or' ? selectedPanjika.nameOr : selectedPanjika.nameEn}</span>
              </span>
              <span>{selectedCity.nameOr} • ଲାହିଡ଼ୀ {formatNumber(selectedDayInfo.panjika.ayanamsa.toFixed(2))}°</span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: WEEKLY TIMELINE */}
      {viewMode === 'week' && (() => {
        const selectedDayIndex = Math.max(0, monthDays.findIndex(d => d.dayOfMonth === selectedDay));
        const weekStartIndex = Math.floor(selectedDayIndex / 7) * 7;
        const weekDays = monthDays.slice(weekStartIndex, Math.min(monthDays.length, weekStartIndex + 7));

        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-cosmic-950/80 border border-slate-800 shadow-xl">
              <div>
                <h3 className="text-sm font-bold text-cosmic-gold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>
                    {language === 'or' ? 'ସାପ୍ତାହିକ ପଞ୍ଚାଙ୍ଗ ସାରଣୀ' : language === 'hi' ? 'साप्ताहिक पंचांग' : 'Weekly Panchanga Schedule'}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {weekDays.length > 0 && (
                    <span>
                      {formatNumber(weekDays[0].dayOfMonth)} – {formatNumber(weekDays[weekDays.length - 1].dayOfMonth)} {GREGORIAN_MONTH_NAMES[language][currentMonth]} {formatNumber(currentYear)}
                    </span>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={weekStartIndex === 0}
                  onClick={() => {
                    const prevIdx = Math.max(0, weekStartIndex - 7);
                    if (monthDays[prevIdx]) setSelectedDay(monthDays[prevIdx].dayOfMonth);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                    weekStartIndex === 0
                      ? 'opacity-40 cursor-not-allowed border-slate-800 text-slate-500'
                      : 'bg-cosmic-900 border-slate-700 text-slate-200 hover:border-amber-400'
                  }`}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>{language === 'or' ? 'ପୂର୍ବ ସପ୍ତାହ' : 'Prev Week'}</span>
                </button>

                <button
                  type="button"
                  disabled={weekStartIndex + 7 >= monthDays.length}
                  onClick={() => {
                    const nextIdx = Math.min(monthDays.length - 1, weekStartIndex + 7);
                    if (monthDays[nextIdx]) setSelectedDay(monthDays[nextIdx].dayOfMonth);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                    weekStartIndex + 7 >= monthDays.length
                      ? 'opacity-40 cursor-not-allowed border-slate-800 text-slate-500'
                      : 'bg-cosmic-900 border-slate-700 text-slate-200 hover:border-amber-400'
                  }`}
                >
                  <span>{language === 'or' ? 'ପର ସପ୍ତାହ' : 'Next Week'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {weekDays.map((dInfo) => (
                <div
                  key={dInfo.dayOfMonth}
                  onClick={() => {
                    setSelectedDay(dInfo.dayOfMonth);
                    setViewMode('daily');
                  }}
                  className={`p-4 rounded-3xl border transition-all cursor-pointer ${
                    selectedDay === dInfo.dayOfMonth
                      ? 'bg-cosmic-900 border-cosmic-gold shadow-lg shadow-cosmic-gold/20 scale-[1.01]'
                      : 'bg-cosmic-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2.5">
                    <div>
                      <span className="text-xs font-bold text-cosmic-gold">
                        {formatNumber(dInfo.dayOfMonth)} {GREGORIAN_MONTH_NAMES[language][currentMonth]}
                      </span>
                      <div className="text-[11px] text-slate-300 font-serif">
                        {formatNumber(dInfo.odiaSolarDay)} {dInfo.odiaSolarMonth[language === 'or' ? 'nameOr' : 'nameEn']}
                      </div>
                    </div>
                    <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-lg text-slate-200 font-bold">
                      {tVaara(dInfo.panjika.vaara)}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="text-amber-300 font-bold">
                      {tTithiFromKey(dInfo.panjika.tithi.nameKey)}
                    </div>
                    {dInfo.tithiTiming?.durationStrOr && (
                      <div className="text-[10px] text-amber-400/90 font-medium">
                        {dInfo.tithiTiming.durationStrOr}
                      </div>
                    )}
                    <div className="text-slate-400 text-[11px]">
                      ⭐ {tNakshatra(dInfo.panjika.nakshatra.nameKey)}
                    </div>
                    <div className="text-[11px] text-cyan-300">
                      ☀️ {dInfo.suryaRashiInfo?.rashiOr} • 🌙 {dInfo.chandraRashiInfo?.rashiOr}
                    </div>
                    <div className="text-emerald-400 text-[11px]">
                      ✨ ଅଭିଜିତ୍: {formatTimeRange(dInfo.panjika.muhurtas.abhijit.start, dInfo.panjika.muhurtas.abhijit.end)}
                    </div>
                    <div className="text-rose-400 text-[11px]">
                      ⚠️ ରାହୁକାଳ: {formatTimeRange(dInfo.panjika.muhurtas.rahuKaal.start, dInfo.panjika.muhurtas.rahuKaal.end)}
                    </div>
                    {dInfo.digashula && (
                      <div className="text-amber-200/90 text-[10px]">
                        🧭 ଶୂଳ: {dInfo.digashula.directionOr} ({dInfo.digashula.remedyOr})
                      </div>
                    )}
                  </div>

                  {dInfo.festivals.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] font-bold text-amber-300 truncate">
                      🚩 {dInfo.festivals[0][language === 'or' ? 'nameOr' : 'nameEn']}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* VIEW MODE 3: DAILY TRADITIONAL PANJIKA SHEET */}
      {viewMode === 'daily' && (
        <div className="bg-gradient-to-b from-cosmic-900/90 to-cosmic-950 border-2 border-cosmic-gold/40 rounded-2xl sm:rounded-3xl p-3.5 sm:p-8 shadow-2xl backdrop-blur-2xl space-y-4 sm:space-y-6">
          {/* Day Navigation */}
          <div className="flex items-center justify-between gap-2 mb-2 sm:mb-4">
            <button
              onClick={() => {
                const prevDay = new Date(selectedDayInfo.date);
                prevDay.setDate(prevDay.getDate() - 1);
                if (prevDay.getMonth() !== currentMonth) {
                  setCurrentMonth(prevDay.getMonth());
                  setCurrentYear(prevDay.getFullYear());
                }
                setSelectedDay(prevDay.getDate());
              }}
              className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-amber-300 text-xs sm:text-sm flex items-center gap-1 min-h-[40px] active:scale-95 touch-manipulation cursor-pointer"
            >
              <ChevronLeft size={16} /> <span className="hidden xs:inline">{language === 'or' ? 'ପୂର୍ବ ଦିନ' : language === 'hi' ? 'पिछला दिन' : 'Previous Day'}</span>
            </button>
            <span className="text-amber-200 font-semibold text-xs sm:text-base text-center truncate">
              {formatNumber(selectedDayInfo.dayOfMonth)} {GREGORIAN_MONTH_NAMES[language][selectedDayInfo.gregorianMonth]} {formatNumber(selectedDayInfo.gregorianYear)}
            </span>
            <button
              onClick={() => {
                const nextDay = new Date(selectedDayInfo.date);
                nextDay.setDate(nextDay.getDate() + 1);
                if (nextDay.getMonth() !== currentMonth) {
                  setCurrentMonth(nextDay.getMonth());
                  setCurrentYear(nextDay.getFullYear());
                }
                setSelectedDay(nextDay.getDate());
              }}
              className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-amber-300 text-xs sm:text-sm flex items-center gap-1 min-h-[40px] active:scale-95 touch-manipulation cursor-pointer"
            >
              <span className="hidden xs:inline">{language === 'or' ? 'ପର ଦିନ' : language === 'hi' ? 'अगला दिन' : 'Next Day'}</span> <ChevronRight size={16} />
            </button>
          </div>

          {/* Traditional Palm-leaf Style Header */}
          <div className="text-center border-b border-cosmic-gold/30 pb-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cosmic-gold/15 text-cosmic-gold font-bold text-xs mb-2 border border-cosmic-gold/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'or' ? selectedPanjika.nameOr : language === 'hi' ? selectedPanjika.nameHi : selectedPanjika.nameEn} • {selectedPanjika.authorityOr}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-serif text-slate-100">
              {tTithiFromKey(selectedDayInfo.panjika.tithi.nameKey)}
            </h2>
            <div className="text-sm text-cosmic-gold font-bold mt-1">
              {formatNumber(selectedDayInfo.dayOfMonth)} {GREGORIAN_MONTH_NAMES[language][currentMonth]} {formatNumber(currentYear)} • {formatNumber(selectedDayInfo.odiaSolarDay)} {selectedDayInfo.odiaSolarMonth[language === 'or' ? 'nameOr' : language === 'hi' ? 'nameHi' : 'nameEn']} • {tVaara(selectedDayInfo.panjika.vaara)}
            </div>
          </div>

          {/* Full Traditional Panchanga Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Tithi */}
            <div className="p-4 rounded-2xl bg-cosmic-950/70 border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-bold block mb-1">ତିଥି (Tithi)</span>
              <span className="text-base font-bold text-slate-100 block">{tTithiFromKey(selectedDayInfo.panjika.tithi.nameKey)}</span>
              <span className="text-[11px] text-amber-400 font-medium block mt-1">
                {selectedDayInfo.tithiTiming?.durationStrOr || 'ଭୋଗ: ରାତ୍ରି ଶେଷ ପର୍ଯ୍ୟନ୍ତ'}
              </span>
            </div>

            {/* Nakshatra */}
            <div className="p-4 rounded-2xl bg-cosmic-950/70 border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-bold block mb-1">ନକ୍ଷତ୍ର (Nakshatra)</span>
              <span className="text-base font-bold text-slate-100 block">{tNakshatra(selectedDayInfo.panjika.nakshatra.nameKey)}</span>
              <span className="text-[11px] text-cyan-400 font-medium block mt-1">
                {selectedDayInfo.nakshatraTiming?.durationStrOr}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">
                {t('pada_label')} {formatNumber(selectedDayInfo.nakshatraTiming?.pada || selectedDayInfo.panjika.nakshatra.pada)} • ଅଧିପତି: {selectedDayInfo.panjika.nakshatra.ruler}
              </span>
            </div>

            {/* Yoga & Karana */}
            <div className="p-4 rounded-2xl bg-cosmic-950/70 border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-bold block mb-1">ଯୋଗ ଓ କରଣ</span>
              <span className="text-base font-bold text-slate-100 block">{tYoga(selectedDayInfo.panjika.yoga.nameKey)}</span>
              <span className="text-[11px] text-slate-300 block mt-1">କରଣ: {tKarana(selectedDayInfo.panjika.karana.nameKey)}</span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">ପକ୍ଷ: {selectedDayInfo.isShukla ? (language === 'or' ? 'ଶୁକ୍ଳପକ୍ଷ' : 'शुक्ल पक्ष') : (language === 'or' ? 'କୃଷ୍ଣପକ୍ଷ' : 'कृष्ण पक्ष')}</span>
            </div>

            {/* Surya & Chandra Rashi */}
            <div className="p-4 rounded-2xl bg-cosmic-950/70 border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-bold block mb-1">ସୂର୍ଯ୍ୟ ଓ ଚନ୍ଦ୍ର ରାଶି (ସ୍ଫୁଟ)</span>
              <div className="text-xs font-bold text-amber-300">
                ☀️ ରବି: {selectedDayInfo.suryaRashiInfo?.rashiOr || ''} ({selectedDayInfo.suryaRashiInfo?.degreesStrOr || ''})
              </div>
              <div className="text-xs font-bold text-cyan-300 mt-1">
                🌙 ଚନ୍ଦ୍ର: {selectedDayInfo.chandraRashiInfo?.rashiOr || ''} ({selectedDayInfo.chandraRashiInfo?.degreesStrOr || ''})
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                ଅୟନାଂଶ: {formatNumber(selectedDayInfo.panjika.ayanamsa.toFixed(2))}°
              </div>
            </div>
          </div>

          {/* Astronomical Horizons & Solar Day Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-cosmic-950/60 border border-slate-800/80 text-xs">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-slate-400 block text-[10px]">{t('sunrise')}</span>
                <span className="font-bold font-mono text-slate-100">{formatTime(selectedDayInfo.panjika.sunrise)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-orange-400" />
              <div>
                <span className="text-slate-400 block text-[10px]">{t('sunset')}</span>
                <span className="font-bold font-mono text-slate-100">{formatTime(selectedDayInfo.panjika.sunset)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-slate-400 block text-[10px]">ସୌର ଦିବସ</span>
                <span className="font-bold text-amber-300">{formatNumber(selectedDayInfo.odiaSolarDay)} {selectedDayInfo.odiaSolarMonth.nameOr}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-slate-400 block text-[10px]">ନିରକ୍ଷ ସ୍ଥାନ</span>
                <span className="font-bold text-slate-200">{selectedCity.nameOr}</span>
              </div>
            </div>
          </div>

          {/* Timings: Shubh vs Ashubh */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Auspicious Timings */}
            <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-300">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>ଶୁଭ ବେଳା ଓ ଅମୃତ ମୁହୂର୍ତ୍ତ</span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-400">ଅଭିଜିତ୍ ମୁହୂର୍ତ୍ତ:</span>
                  <span className="font-bold font-mono text-emerald-300">{formatTimeRange(selectedDayInfo.panjika.muhurtas.abhijit.start, selectedDayInfo.panjika.muhurtas.abhijit.end)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ଅମୃତ ବେଳା:</span>
                  <span className="font-bold font-mono text-emerald-300">{selectedDayInfo.belas.amrita}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ମାହେନ୍ଦ୍ର ବେଳା:</span>
                  <span className="font-bold font-mono text-emerald-300">{selectedDayInfo.belas.mahendra}</span>
                </div>
              </div>
            </div>

            {/* Inauspicious Timings */}
            <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-rose-300">
                <Clock className="w-4 h-4 text-rose-400" />
                <span>ଅଶୁଭ ସମୟ (ବର୍ଜିତ କାଳ)</span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-400">ରାହୁ କାଳ:</span>
                  <span className="font-bold font-mono text-rose-300">{formatTimeRange(selectedDayInfo.panjika.muhurtas.rahuKaal.start, selectedDayInfo.panjika.muhurtas.rahuKaal.end)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ଯମଗଣ୍ଡ:</span>
                  <span className="font-bold font-mono text-rose-300">{formatTimeRange(selectedDayInfo.panjika.muhurtas.yamaganda.start, selectedDayInfo.panjika.muhurtas.yamaganda.end)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">କାଳ ବେଳା:</span>
                  <span className="font-bold font-mono text-rose-300">{selectedDayInfo.belas.kalaBela}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shastric Travel, Tarabala, Chandrabala & Khadya Nishedha */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Digashula & Remedy */}
            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <Compass className="w-4 h-4 text-amber-400" />
                <span>{t('digashula_label') || 'ଦିଗଶୂଳ ଓ ଯାତ୍ରା ପ୍ରତିକାର'}</span>
              </div>
              <div className="text-xs text-slate-200">
                <span className="text-rose-400 font-bold">ଶୂଳ ଦିଗ: </span>
                <span>{selectedDayInfo.digashula?.directionOr}</span>
              </div>
              <div className="text-xs text-emerald-300 font-medium">
                <span className="text-slate-400 font-bold">ଯାତ୍ରା ପ୍ରତିକାର: </span>
                <span>{selectedDayInfo.digashula?.remedyOr}</span>
              </div>
            </div>

            {/* Tarabala & Chandrabala */}
            <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>{language === 'or' ? 'ତାରାବଳ ଓ ଚନ୍ଦ୍ରବଳ ବିଚାର' : 'Tarabala & Chandrabala'}</span>
              </div>
              <div className="text-xs text-slate-300">
                <span className="text-amber-400 font-bold">ତାରାବଳ: </span>
                <span>{selectedDayInfo.tarabalaSummaryOr}</span>
              </div>
              <div className="text-xs text-slate-300">
                <span className="text-cyan-400 font-bold">ଚନ୍ଦ୍ରବଳ: </span>
                <span>{selectedDayInfo.chandrabalaSummaryOr}</span>
              </div>
            </div>

            {/* Food Injunction (Khadya Nishedha) */}
            <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-300">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>{t('food_restriction_label')}</span>
              </div>
              <div className="text-xs text-slate-200 font-medium leading-relaxed">
                {selectedDayInfo.foodRestrictionOr}
              </div>
            </div>
          </div>

          {/* Panjika Comparative Tradition Notes */}
          {selectedDayInfo.panjikaNotes && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-cosmic-950 to-amber-950/40 border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>{t('panjika_comparative_notes') || 'ପାଞ୍ଜି ପରମ୍ପରା ଓ ଗଣନା ବିଶେଷତା'} ({language === 'or' ? selectedPanjika.nameOr : selectedPanjika.nameEn})</span>
              </div>
              <div className="text-xs text-slate-300 leading-relaxed">
                {language === 'or' ? selectedDayInfo.panjikaNotes.or : language === 'hi' ? selectedDayInfo.panjikaNotes.hi : selectedDayInfo.panjikaNotes.en}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE 4: YEARLY FESTIVAL EXPLORER */}
      {viewMode === 'festivals' && (
        <div className="space-y-5">
          {/* Search & Category Filter Header */}
          <div className="bg-cosmic-900/80 border border-cosmic-gold/30 rounded-3xl p-5 shadow-2xl backdrop-blur-md space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-cosmic-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={festivalSearchQuery}
                  onChange={(e) => setFestivalSearchQuery(e.target.value)}
                  placeholder={t('search_festival_placeholder')}
                  className="w-full bg-cosmic-950/80 border border-slate-700 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cosmic-gold/80"
                />
              </div>

              {/* Total Count */}
              <span className="text-xs font-bold text-cosmic-gold">
                {formatNumber(filteredYearFestivals.length)} {t('all_festivals_title')} ({formatNumber(currentYear)})
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
              {[
                { id: 'all', label: t('filter_all') },
                { id: 'major', label: 'ପ୍ରମୁଖ ପର୍ବ' },
                { id: 'ekadashi', label: t('filter_ekadashi') },
                { id: 'sankranti', label: t('filter_sankranti') },
                { id: 'jagannath', label: t('filter_jagannath') },
                { id: 'holiday', label: t('filter_holidays') }
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFestivalFilterType(f.id as typeof festivalFilterType)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all border ${
                    festivalFilterType === f.id
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow'
                      : 'bg-cosmic-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Festival Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredYearFestivals.map((item, idx) => {
              const fest = item.festival;
              const festDate = item.date;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-cosmic-950/70 border border-slate-800/80 hover:border-cosmic-gold/50 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-black text-cosmic-gold">
                        {fest[language === 'or' ? 'nameOr' : language === 'hi' ? 'nameHi' : 'nameEn']}
                      </span>
                      <span className="text-[10px] bg-cosmic-gold/20 text-cosmic-gold font-bold px-2 py-0.5 rounded-full border border-cosmic-gold/30 whitespace-nowrap">
                        {formatNumber(festDate.getDate())} {GREGORIAN_MONTH_NAMES[language][festDate.getMonth()].slice(0, 3)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      {fest[language === 'or' ? 'descriptionOr' : 'descriptionEn']}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 font-semibold">
                      ଓଡ଼ିଆ: {formatNumber(item.odiaInfo.odiaSolarDay)} {item.odiaInfo.odiaSolarMonth[language === 'or' ? 'nameOr' : language === 'hi' ? 'nameHi' : 'nameEn']}
                    </span>

                    <button
                      type="button"
                      onClick={() => downloadIcsEvent(fest.nameEn, festDate, fest.descriptionEn)}
                      className="inline-flex items-center gap-1 text-cyan-300 hover:text-cyan-200 cursor-pointer font-bold"
                    >
                      <CalendarPlus className="w-3 h-3" />
                      <span>{t('add_to_calendar')}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}


      {/* VIEW MODE 6: SHUBHA MUHURTA CALCULATOR */}
      {viewMode === 'muhurta' && (
        <div className="space-y-5 animate-in fade-in duration-300">
          {/* Header Bar with Category Filter Pills */}
          <div className="p-5 rounded-3xl bg-cosmic-950/80 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-cosmic-gold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>
                    {language === 'or'
                      ? `ଶୁଭ ମୁହୂର୍ତ୍ତ ସାରଣୀ • ${primaryOdiaSolarMonth.nameOr} / ${GREGORIAN_MONTH_NAMES[language][currentMonth]} ${formatNumber(currentYear)}`
                      : language === 'hi'
                      ? `शुभ मुहूर्त सारणी • ${primaryOdiaSolarMonth.nameHi} / ${GREGORIAN_MONTH_NAMES[language][currentMonth]} ${formatNumber(currentYear)}`
                      : `Auspicious Muhurtas • ${primaryOdiaSolarMonth.nameEn} / ${GREGORIAN_MONTH_NAMES[language][currentMonth]} ${formatNumber(currentYear)}`}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {language === 'or'
                    ? 'ବିବାହ, ବ୍ରତଘର, ଗୃହପ୍ରବେଶ, ଯାନବାହନ ଓ ବ୍ୟବସାୟ ଶୁଭାରମ୍ଭ ପାଇଁ ପ୍ରଶସ୍ତ ଲଗ୍ନ ଓ ବେଳା ନିର୍ଣ୍ଣୟ।'
                    : language === 'hi'
                    ? 'विवाह, उपनयन, गृह प्रवेश, वाहन एवं व्यापार शुभारंभ हेतु प्रामाणिक मुहूर्त।'
                    : 'Auspicious celestial timing windows calculated for weddings, housewarming, thread ceremony, and commerce.'}
                </p>
              </div>

              <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {filteredMuhurtas.length} {language === 'or' ? 'ଶୁଭ ମୁହୂର୍ତ୍ତ ଉପଲବ୍ଧ' : 'Muhurtas Available'}
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
              {[
                { id: 'all', label: language === 'or' ? 'ସମସ୍ତ ଶୁଭ କାର୍ଯ୍ୟ' : language === 'hi' ? 'सभी मुहूर्त' : 'All Muhurtas' },
                { id: 'vivaha', label: language === 'or' ? 'ବିବାହ (ପାଣିଗ୍ରହଣ)' : language === 'hi' ? 'विवाह' : 'Marriage' },
                { id: 'bratopanayana', label: language === 'or' ? 'ବ୍ରତୋପନୟନ (ବ୍ରତଘର)' : language === 'hi' ? 'उपनयन' : 'Sacred Thread' },
                { id: 'gruhapravesha', label: language === 'or' ? 'ଗୃହପ୍ରବେଶ' : language === 'hi' ? 'गृह प्रवेश' : 'Housewarming' },
                { id: 'vahana', label: language === 'or' ? 'ଯାନବାହନ କ୍ରୟ' : language === 'hi' ? 'वाहन क्रय' : 'Vehicle Purchase' },
                { id: 'vyavasaya', label: language === 'or' ? 'ବ୍ୟବସାୟ ଶୁଭାରମ୍ଭ' : language === 'hi' ? 'व्यापार शुभारंभ' : 'Business Launch' },
                { id: 'namakarana', label: language === 'or' ? 'ନାମକରଣ ଓ ଅନ୍ନପ୍ରାଶନ' : language === 'hi' ? 'नामकरण संस्कार' : 'Naming Ceremony' },
                { id: 'bhoomipuja', label: language === 'or' ? 'ଭୂମିପୂଜା ଓ ଗୃହାରମ୍ଭ' : language === 'hi' ? 'भूमि पूजन' : 'Foundation Laying' }
              ].map(pill => (
                <button
                  key={pill.id}
                  onClick={() => setMuhurtaFilterType(pill.id as typeof muhurtaFilterType)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    muhurtaFilterType === pill.id
                      ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md font-black'
                      : 'bg-cosmic-900/60 text-slate-300 border-white/10 hover:border-amber-500/40 hover:bg-cosmic-800'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Muhurta Cards Grid */}
          {filteredMuhurtas.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-cosmic-950/40 border border-slate-800">
              <Sparkles className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">
                {language === 'or'
                  ? 'ଏହି ମାସରେ ମନୋନୀତ ବିଭାଗ ପାଇଁ କୌଣସି ଶୁଭ ମୁହୂର୍ତ୍ତ ଉପଲବ୍ଧ ନାହିଁ (ମଳମାସ କିମ୍ବା ଚାତୁର୍ମାସ୍ୟା ନିୟମ କାରଣରୁ)।'
                  : 'No auspicious muhurtas found for this category in the selected month.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMuhurtas.map(m => (
                <div
                  key={m.id}
                  className="p-4 rounded-2xl bg-gradient-to-br from-cosmic-950 via-[#101c36] to-cosmic-950 border border-amber-500/30 hover:border-amber-500/60 transition-all shadow-lg flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        {language === 'or' ? m.typeOr : language === 'hi' ? m.typeHi : m.typeEn}
                      </span>
                      <span className="text-xs text-cosmic-gold font-bold">
                        {formatNumber(m.date.getDate())} {GREGORIAN_MONTH_NAMES[language][m.date.getMonth()]}
                      </span>
                    </div>

                    <div className="text-sm font-bold text-white">
                      {m.dayOfWeekOr} • {m.odiaSolarDate}
                    </div>

                    <div className="text-xs text-slate-300 space-y-1.5 bg-black/40 p-3 rounded-2xl border border-white/5">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">{language === 'or' ? 'ତିଥି:' : language === 'hi' ? 'तिथि:' : 'Tithi:'}</span>
                        <span className="text-amber-200 font-semibold">{language === 'or' ? m.tithiNameOr : language === 'hi' ? m.tithiNameOr : m.tithiNameEn}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">{language === 'or' ? 'ନକ୍ଷତ୍ର:' : language === 'hi' ? 'नक्षत्र:' : 'Nakshatra:'}</span>
                        <span className="text-amber-200 font-semibold">{language === 'or' ? m.nakshatraNameOr : m.nakshatraNameEn}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">{language === 'or' ? 'ଶୁଭ ଲଗ୍ନ:' : language === 'hi' ? 'शुभ लग्न:' : 'Shubha Lagna:'}</span>
                        <span className="text-cyan-300 font-semibold">{m.shubhaLagna}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">{language === 'or' ? 'ସମୟ ବେଳା:' : language === 'hi' ? 'समय वेला:' : 'Time Window:'}</span>
                        <span className="text-emerald-300 font-bold">{m.timeWindow}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {language === 'or' ? m.significanceOr : language === 'hi' ? m.significanceHi : m.significanceEn}
                    </p>
                  </div>

                  {/* Actions: 1-Touch Date Jumper & .ics Export */}
                  <div className="grid grid-cols-2 gap-2 pt-2.5 mt-2.5 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentYear(m.date.getFullYear());
                        setCurrentMonth(m.date.getMonth());
                        setSelectedDay(m.date.getDate());
                        setViewMode('month');
                        setTimeout(() => {
                          document.getElementById('day-inspector')?.scrollIntoView({ behavior: 'smooth' });
                        }, 150);
                      }}
                      className="py-2 px-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-300 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <CalendarIcon className="w-3.5 h-3.5" />
                      <span>{language === 'or' ? 'ଏହି ଦିନ ଦେଖନ୍ତୁ' : 'Go to Day'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        downloadIcsEvent(
                          `${m.typeEn} Muhurta`,
                          m.date,
                          `${m.typeOr} (${m.shubhaLagna})\nସମୟ ବେଳା: ${m.timeWindow}\nତିଥି: ${m.tithiNameOr}\nନକ୍ଷତ୍ର: ${m.nakshatraNameOr}\n${m.significanceOr}`
                        );
                        setCopiedToast(language === 'or' ? 'ମୁହୂର୍ତ୍ତ କ୍ୟାଲେଣ୍ଡର ଇଭେଣ୍ଟ ଡାଉନଲୋଡ଼ ହେଲା' : 'Calendar event downloaded');
                        setTimeout(() => setCopiedToast(null), 3000);
                      }}
                      className="py-2 px-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                      title="Download .ics Calendar Event"
                    >
                      <CalendarPlus className="w-3.5 h-3.5" />
                      <span>{language === 'or' ? '+ କ୍ୟାଲେଣ୍ଡର' : '+ Calendar'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE 7: SRIMANDIR SACRED NITI & 56 BHOGA */}
      {viewMode === 'srimandir' && (
        <div className="space-y-5 animate-in fade-in duration-300">
          {/* Subtabs Selector */}
          <div className="flex items-center gap-1.5 p-1.5 bg-cosmic-950/80 border border-slate-800 rounded-2xl max-w-xl shadow-xl overflow-x-auto">
            <button
              onClick={() => setSrimandirTab('niti')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                srimandirTab === 'niti'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'or' ? 'ଦୈନିକ ୧୪ ନୀତି' : language === 'hi' ? 'दैनिक 14 नीति' : '14 Daily Rituals'}
            </button>
            <button
              onClick={() => setSrimandirTab('bhoga')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                srimandirTab === 'bhoga'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'or' ? 'ଛପନ ଭୋଗ (୫୬)' : language === 'hi' ? 'छप्पन भोग (56)' : '56 Bhogas'}
            </button>
            <button
              onClick={() => setSrimandirTab('besha')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                srimandirTab === 'besha'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'or' ? '୩୨ ଦିବ୍ୟ ବେଶ' : language === 'hi' ? '32 दिव्य वेश' : '32 Sacred Beshas'}
            </button>
          </div>

          {/* Subtab 1: Srimandir 14 Daily Nitis */}
          {srimandirTab === 'niti' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-cosmic-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                {language === 'or'
                  ? 'ଶ୍ରୀମନ୍ଦିରରେ ପ୍ରତିଦିନ ପ୍ରଭୁ ଶ୍ରୀଜଗନ୍ନାଥ, ବଳଭଦ୍ର ଓ ସୁଭଦ୍ରାଙ୍କର ପ୍ରାତଃ ୫ଟା ଦ୍ୱାରଫିଟାରୁ ଆରମ୍ଭ କରି ରାତ୍ର ୧୧:୩୦ ପହୁଡ଼ ପର୍ଯ୍ୟନ୍ତ ୧୪ଟି ପ୍ରଧାନ ନୀତି ଶାସ୍ତ୍ରୋକ୍ତ ବିଧିରେ ଅନୁଷ୍ଠିତ ହୁଏ।'
                  : 'Lord Jagannath Temple follows an unbroken lineage of 14 canonical daily rites from 05:00 AM Dwaraphita to 11:30 PM Ratri Pahuda.'}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {SRIMANDIR_DAILY_NITI.map(niti => (
                  <div
                    key={niti.id}
                    className="p-4 rounded-2xl bg-cosmic-950/80 border border-slate-800/90 hover:border-amber-500/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px] font-bold">
                            {niti.order}
                          </span>
                          <span className="font-bold text-sm text-cosmic-gold">
                            {language === 'or' ? niti.nameOr : language === 'hi' ? niti.nameHi : niti.nameEn}
                          </span>
                        </div>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-white/5 text-cyan-300 border border-white/5">
                          {niti.timeApprox}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed mt-2 mb-2">
                        {language === 'or' ? niti.descriptionOr : language === 'hi' ? niti.descriptionHi : niti.descriptionEn}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-300">ନିୟୋଜିତ ସେବକ:</span> {niti.sevakaOr}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subtab 2: Chhapana Bhoga (56 Bhoga) */}
          {srimandirTab === 'bhoga' && (
            <div className="space-y-4">
              {/* Search and Category Filter Bar */}
              <div className="p-4 rounded-2xl bg-cosmic-950/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={bhogaSearchQuery}
                    onChange={(e) => setBhogaSearchQuery(e.target.value)}
                    placeholder={language === 'or' ? 'ଭୋଗ ନାମ ଖୋଜନ୍ତୁ (ଯଥା: ଖଜା, କାନିକା...)' : 'Search 56 Bhogas...'}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-cosmic-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'all', label: language === 'or' ? 'ସମସ୍ତ (୫୬)' : 'All' },
                    { id: 'sukhila', label: language === 'or' ? 'ଶୁଖିଲା ଭୋଗ' : 'Dry Sweets' },
                    { id: 'sankhudi', label: language === 'or' ? 'ସଙ୍ଖୁଡ଼ି (ଅନ୍ନ-ଡାଲି-ତରକାରୀ)' : 'Cooked Feast' },
                    { id: 'dugdhajata', label: language === 'or' ? 'ଦୁଗ୍ଧଜାତ ଭୋଗ' : 'Milk Sweets' }
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setBhogaCategoryFilter(cat.id as typeof bhogaCategoryFilter)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        bhogaCategoryFilter === cat.id
                          ? 'bg-amber-500 text-slate-950 border-amber-300 font-bold'
                          : 'bg-cosmic-900/60 text-slate-300 border-white/10 hover:border-amber-500/40'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 56 Bhoga Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredBhogas.map(bhoga => (
                  <div
                    key={bhoga.id}
                    className="p-3.5 rounded-2xl bg-cosmic-950/80 border border-slate-800/80 hover:border-amber-500/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="font-bold text-sm text-cosmic-gold">
                          {language === 'or' ? bhoga.nameOr : language === 'hi' ? bhoga.nameHi : bhoga.nameEn}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-amber-300 border border-white/5 whitespace-nowrap">
                          {bhoga.categoryOr}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-300 space-y-1 mb-2">
                        <div>
                          <span className="text-slate-400">ଉପାଦାନ: </span>
                          <span>{bhoga.mainIngredients}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-400 italic pt-2 border-t border-slate-800/60">
                      {bhoga.significanceOr}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subtab 3: Srimandir 32 Sacred Jagannath Beshas Directory */}
          {srimandirTab === 'besha' && (
            <div className="space-y-4">
              {/* Search Bar & Summary Banner */}
              <div className="p-4 rounded-2xl bg-cosmic-950/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={beshaSearchQuery}
                    onChange={(e) => setBeshaSearchQuery(e.target.value)}
                    placeholder={language === 'or' ? 'ବେଶ ନାମ, ଋତୁ କିମ୍ବା ତିଥି ଖୋଜନ୍ତୁ (ଯଥା: ନାଗାର୍ଜୁନ, ସୁନା...)' : 'Search 32 Jagannath Beshas...'}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-cosmic-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold">
                    {language === 'or' ? `ସମୁଦାୟ ${formatNumber(filteredBeshas.length)}ଟି ବେଶ` : `Total ${filteredBeshas.length} Beshas`}
                  </span>
                </div>
              </div>

              {/* 32 Beshas Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBeshas.map(besha => (
                  <div
                    key={besha.id}
                    className="p-4 rounded-2xl bg-gradient-to-br from-cosmic-950 via-[#121c32] to-cosmic-950 border border-amber-500/25 hover:border-amber-500/60 transition-all shadow-xl flex flex-col justify-between group"
                  >
                    <div className="space-y-2.5">
                      {/* Card Header: Order badge + Name + Season */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center text-[10px] font-black shrink-0 shadow-sm">
                            {formatNumber(besha.order)}
                          </span>
                          <div>
                            <h4 className="font-bold text-sm text-cosmic-gold group-hover:text-amber-300 transition-colors">
                              {language === 'or' ? besha.nameOr : language === 'hi' ? besha.nameHi : besha.nameEn}
                            </h4>
                            <span className="text-[10px] text-slate-400 block">
                              {besha.nameEn}
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 shrink-0 font-medium">
                          {besha.seasonOr}
                        </span>
                      </div>

                      {/* Occasion & Darshan Time */}
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-xs space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">ଅବସର / ତିଥି:</span>
                          <span className="text-amber-200 font-semibold text-right">{besha.occasionOr}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">ଦର୍ଶନ ବେଳା:</span>
                          <span className="text-cyan-300 font-medium">{besha.darshanTimeApproxOr}</span>
                        </div>
                      </div>

                      {/* Sacred Attire & Ornaments */}
                      <div className="text-xs text-slate-300 space-y-1">
                        <span className="text-[11px] font-bold text-amber-400 block">ଦିବ୍ୟ ବସ୍ତ୍ର ଓ ଅଳଙ୍କାର:</span>
                        <p className="text-[11px] text-slate-300 leading-relaxed bg-white/5 p-2 rounded-lg border border-white/5">
                          {besha.attireOr}
                        </p>
                      </div>

                      {/* Puranic Significance */}
                      <div className="text-[11px] text-slate-400 leading-relaxed pt-1">
                        <span className="text-slate-500 font-semibold">ପୌରାଣିକ ମାହାତ୍ମ୍ୟ: </span>
                        <span>{besha.significanceOr}</span>
                      </div>
                    </div>

                    {/* 1-Click Date Jumper Button */}
                    <div className="pt-3 mt-3 border-t border-slate-800/80">
                      <button
                        type="button"
                        onClick={() => {
                          const SOLAR_MONTH_TO_GREGORIAN_APPROX: Record<string, number> = {
                            baisakha: 3,
                            jyestha: 4,
                            asadha: 5,
                            sravana: 6,
                            bhadraba: 7,
                            aswina: 8,
                            kartika: 9,
                            margasira: 10,
                            pausha: 11,
                            magha: 0,
                            phalguna: 1,
                            chaitra: 2
                          };
                          const targetMonth = SOLAR_MONTH_TO_GREGORIAN_APPROX[besha.monthId] ?? currentMonth;
                          setCurrentMonth(targetMonth);
                          setSelectedDay(15);
                          setViewMode('month');
                          setCopiedToast(language === 'or' ? `${besha.nameOr} ମାସ କ୍ୟାଲେଣ୍ଡର ଖୋଲାଗଲା` : `Opened ${besha.nameEn} in calendar`);
                          setTimeout(() => setCopiedToast(null), 3000);
                        }}
                        className="w-full py-1.5 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-300 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <CalendarIcon className="w-3.5 h-3.5" />
                        <span>{language === 'or' ? '📅 ଏହି ମାସ କ୍ୟାଲେଣ୍ଡରରେ ଦେଖନ୍ତୁ' : 'View in Calendar'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE 8: ECLIPSES (ସୂର୍ଯ୍ୟ ପରାଗ ଓ ଚନ୍ଦ୍ର ଗ୍ରହଣ ୨୦୨୪-୨୦୫୦) */}
      {viewMode === 'eclipses' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="p-5 rounded-3xl bg-cosmic-950/80 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-cosmic-gold flex items-center gap-2">
                <Moon className="w-5 h-5 text-cyan-400" />
                <span>
                  {language === 'or'
                    ? 'ସୂର୍ଯ୍ୟ ପରାଗ ଓ ଚନ୍ଦ୍ର ଗ୍ରହଣ ସାରଣୀ (୨୦୨୪ ରୁ ୨୦୫୦)'
                    : language === 'hi'
                    ? 'सूर्य ग्रहण एवं चंद्र ग्रहण सारणी (2024 से 2050)'
                    : 'Solar & Lunar Eclipse Timetable (2024 - 2050)'}
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {language === 'or'
                  ? 'ଶ୍ରୀକ୍ଷେତ୍ର ଓ ଓଡ଼ିଶାରେ ଗ୍ରହଣ ସ୍ପର୍ଶ, ମଧ୍ୟ, ମୋକ୍ଷ ଏବଂ ପାକତ୍ୟାଗ (ସୂତକ) ନିୟମ।'
                  : 'Canonical eclipse timings for Odisha including Sparsha, Madhya, Moksha, and fasting rules.'}
              </p>
            </div>
          </div>

          {/* Year Filter */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-amber-300 text-sm">{language === 'or' ? 'ବର୍ଷ ଫିଲ୍ଟର:' : 'Year Filter:'}</span>
            <select
              value={eclipseFilterYear}
              onChange={(e) => setEclipseFilterYear(Number(e.target.value))}
              className="bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-sm"
            >
              <option value={0}>{language === 'or' ? 'ସମସ୍ତ ବର୍ଷ' : 'All Years'}</option>
              {Array.from(new Set(ODISHA_ECLIPSES.map(e => e.year))).sort().map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(eclipseFilterYear === 0 ? ODISHA_ECLIPSES : ODISHA_ECLIPSES.filter(e => e.year === eclipseFilterYear)).map(eclipse => (
              <div
                key={eclipse.id}
                className={`p-4 rounded-2xl border transition-all shadow-lg flex flex-col justify-between ${
                  eclipse.visibleInOdisha
                    ? 'bg-gradient-to-br from-cosmic-950 via-[#13223f] to-cosmic-950 border-amber-500/40'
                    : 'bg-cosmic-950/60 border-slate-800/80 opacity-80'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                        eclipse.type === 'solar'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      }`}>
                        {language === 'or' ? eclipse.typeOr : language === 'hi' ? eclipse.typeHi : eclipse.typeEn}
                      </span>
                      <span className="text-xs text-slate-300 font-semibold">
                        {eclipse.subTypeOr}
                      </span>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      eclipse.visibleInOdisha
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {eclipse.visibleInOdisha ? 'ଓଡ଼ିଶାରେ ଦୃଶ୍ୟ' : 'ଅଦୃଶ୍ୟ'}
                    </span>
                  </div>

                  <div className="text-sm font-bold text-white">
                    {eclipse.dateStr} • {eclipse.tithiOr}
                  </div>

                  <div className="text-xs text-slate-300 space-y-1.5 bg-black/40 p-3 rounded-xl border border-white/5">
                    <div className="flex justify-between">
                      <span className="text-slate-400">ସ୍ପର୍ଶ କାଳ:</span>
                      <span className="text-amber-300 font-semibold">{eclipse.sparshaTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">ଗ୍ରହଣ ମଧ୍ୟ:</span>
                      <span className="text-amber-300 font-semibold">{eclipse.madhyaTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">ମୋକ୍ଷ କାଳ:</span>
                      <span className="text-emerald-300 font-semibold">{eclipse.mokshaTime}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-white/10">
                      <span className="text-red-400 font-bold">ପାକତ୍ୟାଗ:</span>
                      <span className="text-red-300 font-bold">{eclipse.pakatyagaTime}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {language === 'or' ? eclipse.guidelinesOr : language === 'hi' ? eclipse.guidelinesHi : eclipse.guidelinesEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
    </>
  );
};
