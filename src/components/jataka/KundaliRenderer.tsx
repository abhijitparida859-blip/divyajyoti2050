import { createPortal } from 'react-dom';
import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '../../localization/i18n';
import { getLocalizedNativeName } from '../../localization/nameTransliteration';
import { calculateBirthChart, parseDateTimeWithTimezone } from '../../core/jataka/kundali_engine';
import { ODISHA_COMPREHENSIVE_LOCATIONS, PlaceLocation } from '../../core/jataka/odisha_geography_db';
import { BirthChartData, VargaType } from '../../types/jataka';
import { JatakaInputForm } from './JatakaInputForm';
import { KundaliCharts } from './KundaliCharts';
import { NavagrahaTable } from './NavagrahaTable';
import { ShodashavargaSelector } from './ShodashavargaSelector';
import { ShadbalaView } from './ShadbalaView';
import { AshtakavargaMatrixView } from './AshtakavargaMatrixView';
import { PratyantardashaTimeline } from './PratyantardashaTimeline';
import { JaiminiAstrologyView } from './JaiminiAstrologyView';
import { BhavaChalitView } from './BhavaChalitView';
import { GocharaTransitView } from './GocharaTransitView';
import { VedicRemediesView } from './VedicRemediesView';
import { YogasAndPredictions } from './YogasAndPredictions';
import { AvakhadaChakraView } from './AvakhadaChakraView';
import { BhavaDetailedAnalysisView } from './BhavaDetailedAnalysisView';
import { PlanetaryAvasthasView } from './PlanetaryAvasthasView';
import { KpSystemView } from './KpSystemView';
import { PersonalDailyAuspiciousView } from './PersonalDailyAuspiciousView';
import { JanmaPanchangaView } from './JanmaPanchangaView';
import { VimsopakaBalaView } from './VimsopakaBalaView';
import { BhriguNandiNadiView } from './BhriguNandiNadiView';
import { NakshatraSacredView } from './NakshatraSacredView';
import { LifeDomainPredictionsView } from './LifeDomainPredictionsView';
import { SpecialLagnasView } from './SpecialLagnasView';
import { YearlyForecastView } from './YearlyForecastView';
import { KundaliOverviewDashboard } from './KundaliOverviewDashboard';
import { KundaliPrintView } from './KundaliPrintView';
import { PrintControls, PrintMode } from './PrintControls';
import { KundaliChartsView } from './KundaliChartsView';
import { VargottamaPowerMatrixView } from './VargottamaPowerMatrixView';
import {
  Compass, Sparkles, Award, Clock, ShieldCheck,
  BookOpen, Layers, Zap, Eye, Printer, HeartHandshake,
  Building2, Star, TreePine, Orbit, Shield, Briefcase,
  ChevronLeft, ChevronRight, Grid, Coins, X, CalendarDays, BarChart3, Gem
} from 'lucide-react';

export type KundaliTab =
  | 'overview'
  | 'chart'
  | 'planets'
  | 'specialLagnas'
  | 'panchanga'
  | 'vimsopaka'
  | 'nadi'
  | 'sacredNakshatra'
  | 'lifeDomains'
  | 'avakhada'
  | 'bhavas'
  | 'avasthas'
  | 'kp'
  | 'dailyGuide'
  | 'yearly'
  | 'shadbala'
  | 'vargottama'
  | 'ashtakavarga'
  | 'dashas'
  | 'yogas'
  | 'jaimini'
  | 'chalit'
  | 'gochara'
  | 'remedies'
  | 'predictions'
  | 'charts'
  | 'print';

interface TabCategory {
  categoryName: { en: string; hi: string; or: string };
  tabs: { id: KundaliTab; label: { en: string; hi: string; or: string }; icon: React.FC<{ className?: string }> }[];
}

export const KundaliRenderer: React.FC = () => {
  const { t, formatNumber, tRashi, tGraha, tNakshatra, language } = useI18n();

  const [nativeName, setNativeName] = useState('Abhijit Parida');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [birthDateStr, setBirthDateStr] = useState('1998-08-15');
  const [birthTimeStr, setBirthTimeStr] = useState('06:30');
  const [selectedLocation, setSelectedLocation] = useState<PlaceLocation>(() => ODISHA_COMPREHENSIVE_LOCATIONS[1]); // Default to Puri
  const [chartStyle, setChartStyle] = useState<'north' | 'south' | 'east' | 'west' | '3d'>('east');
  const [selectedVarga, setSelectedVarga] = useState<VargaType>('D1');
  const [activeTab, setActiveTab] = useState<KundaliTab>('overview');
  const [isQuickJumpOpen, setIsQuickJumpOpen] = useState(false);
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);
  // 3 print editions: short (essentials) • full (whole life book) • year (chosen year, day-by-day)
  const [printMode, setPrintMode] = useState<PrintMode>('full');
  const [printYear, setPrintYear] = useState<number>(new Date().getFullYear());

  const tabScrollRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement | null>(null);

  // Real 100% dynamic calculation with exact local timezone conversion
  const chartData: BirthChartData = React.useMemo(() => {
    const trueUTC = parseDateTimeWithTimezone(birthDateStr, birthTimeStr, selectedLocation.timezone);
    const localizedName = getLocalizedNativeName(nativeName, language) || nativeName;
    return calculateBirthChart(
      localizedName,
      trueUTC,
      selectedLocation.latitude,
      selectedLocation.longitude,
      selectedLocation.name[language],
      gender
    );
  }, [nativeName, birthDateStr, birthTimeStr, selectedLocation, language, gender]);

  // Prevent body scroll and handle Escape key when modal is open
  useEffect(() => {
    if (!isQuickJumpOpen && !isPrintPreviewOpen) return;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsQuickJumpOpen(false);
        setIsPrintPreviewOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isQuickJumpOpen, isPrintPreviewOpen]);

  const activeHouses = chartData.vargas[selectedVarga]?.houses || chartData.houses;

  const handlePrint = () => {
    // Open the modern full-screen Print Preview modal instead of raw window.print()
    setIsPrintPreviewOpen(true);
  };

  const executePrint = () => {
    window.print();
  };

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabScrollRef.current) {
      const offset = direction === 'left' ? -280 : 280;
      tabScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Auto-scroll active tab into view
  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeTab]);

  const TAB_CATEGORIES: TabCategory[] = [
    {
      categoryName: {
        en: '1. Core Horoscope & Sphutas',
        hi: '१. मुख्य जन्म चक्र एवं ग्रह स्फुट',
        or: '୧. ମୁଖ୍ୟ କୁଣ୍ଡଳୀ ଓ ଗ୍ରହ ସ୍ଫୁଟ'
      },
      tabs: [
        { id: 'overview', label: { en: 'Horoscope Summary (AstroSage style)', hi: 'कुंडली सारांश', or: 'କୁଣ୍ଡଳୀ ସାରାଂଶ' }, icon: Star },
        { id: 'chart', label: { en: 'Kundali (D1-D60)', hi: 'कुंडली चक्र', or: 'କୁଣ୍ଡଳୀ ଚକ୍ର' }, icon: Compass },
        { id: 'planets', label: { en: 'Planetary Sphutas (DMS)', hi: 'ग्रह स्फुट (DMS)', or: 'ଗ୍ରହ ସ୍ଫୁଟ (DMS)' }, icon: Award },
        { id: 'specialLagnas', label: { en: 'Special & Indu Lagna', hi: 'विशेष एवं इन्दु लग्न', or: 'ବିଶେଷ ଓ ଇନ୍ଦୁ ଲଗ୍ନ' }, icon: Coins },
      ]
    },
    {
      categoryName: {
        en: '2. Panchanga & Nature',
        hi: '२. पंचांग एवं व्यक्तित्व',
        or: '୨. ପଞ୍ଚାଙ୍ଗ ତତ୍ତ୍ୱ ଓ ସ୍ୱଭାବ'
      },
      tabs: [
        { id: 'panchanga', label: { en: 'Janma Panchanga 5 Pillars', hi: 'जन्म पंचांग ५ स्तम्भ', or: 'ଜନ୍ମ ପଞ୍ଚାଙ୍ଗ ୫ ସ୍ତମ୍ଭ' }, icon: Sparkles },
        { id: 'avakhada', label: { en: 'Avakhada & Ghataka Chakra', hi: 'अवकहड़ा एवं घातक चक्र', or: 'ଅବକହଡ଼ା ଓ ଘାତକ ଚକ୍ର' }, icon: Compass },
      ]
    },
    {
      categoryName: {
        en: '3. Strength, Dignity & Periods',
        hi: '३. ग्रह बल, अवस्था एवं दशाएं',
        or: '୩. ଗ୍ରହ ବଳ, ଅବସ୍ଥା ଓ ଦଶା'
      },
      tabs: [
        { id: 'vimsopaka', label: { en: 'Vimsopaka Bala (20-Pt)', hi: 'विंशोपक बल एवं इष्ट/कष्ट', or: 'ବିଂଶୋପକ ବଳ ଓ ଇଷ୍ଟ/କଷ୍ଟ' }, icon: Shield },
        { id: 'shadbala', label: { en: 'Shadbala 6-Fold Strength', hi: 'षड्बल शक्ति', or: 'ଷଡ଼ବଳ ଶକ୍ତି' }, icon: Zap },
        { id: 'vargottama', label: { en: 'Vargottama & Power Matrix', hi: 'वर्गोत्तम एवं शक्ति मैट्रिक्स', or: 'ବର୍ଗୋତ୍ତମ ଓ ଶକ୍ତି ମାଟ୍ରିକ୍ସ' }, icon: Gem },
        { id: 'ashtakavarga', label: { en: 'Ashtakavarga (337 Bindus)', hi: 'अष्टकवर्ग (३३७ बिंदु)', or: 'ଅଷ୍ଟକବର୍ଗ (୩୩୭ ବିନ୍ଦୁ)' }, icon: Layers },
        { id: 'avasthas', label: { en: 'Planetary Avasthas (3-Fold)', hi: 'ग्रह अवस्थाएं', or: 'ଗ୍ରହ ଅବସ୍ଥା (୩ ସ୍ତର)' }, icon: Zap },
        { id: 'dashas', label: { en: 'Vimshottari Dasha 5-Tier', hi: 'विंशोत्तरी महादशा', or: 'ବିଂଶୋତ୍ତରୀ ମହାଦଶା' }, icon: Clock },
      ]
    },
    {
      categoryName: {
        en: '4. Astrological Systems & Transits',
        hi: '४. ज्योतिष पद्धतियां एवं गोचर',
        or: '୪. ଗୂଢ଼ ଜ୍ୟୋତିଷ ପଦ୍ଧତି ଓ ଗୋଚର'
      },
      tabs: [
        { id: 'nadi', label: { en: 'Bhrigu Nandi Nadi (BNN)', hi: 'भृगु नन्दी नाड़ी', or: 'ଭୃଗୁ ନନ୍ଦୀ ନାଡ଼ୀ' }, icon: Orbit },
        { id: 'kp', label: { en: 'KP Sub-Lords (249)', hi: 'केपी सब-लॉर्ड प्रणाली', or: 'କୃଷ୍ଣମୂର୍ତ୍ତି ସବ୍-ଲର୍ଡ୍' }, icon: Compass },
        { id: 'jaimini', label: { en: 'Jaimini Chara Karakas', hi: 'जैमिनी चर कारक', or: 'ଜୈମିନି ଚର କାରକ' }, icon: Compass },
        { id: 'chalit', label: { en: 'Bhava Chalit (Sripati)', hi: 'भाव चलित चक्र', or: 'ଭାବ ଚଳିତ (ଶ୍ରୀପତି)' }, icon: Compass },
        { id: 'gochara', label: { en: 'Live Gochara & Sade Sati', hi: 'लाइव गोचर एवं साढ़ेसाती', or: 'ଲାଇଭ୍ ଗୋଚର ଓ ସାଢ଼େସାତୀ' }, icon: Eye },
      ]
    },
    {
      categoryName: {
        en: '5. Predictions, Life Chapters & Remedies',
        hi: '५. फलकथन, जीवन क्षेत्र एवं उपाय',
        or: '୫. ଭବିଷ୍ୟଫଳ, ଜୀବନ କ୍ଷେତ୍ର ଓ ଉପଚାର'
      },
      tabs: [
        { id: 'bhavas', label: { en: '12 Bhavas Detailed Analysis', hi: '१२ भाव विस्तृत फलादेश', or: '୧୨ ଭାବ ବିସ୍ତୃତ ଫଳ' }, icon: Building2 },
        { id: 'lifeDomains', label: { en: 'Life Domains (Career & Wealth)', hi: 'जीवन क्षेत्र (कर्म-धन-विवाह)', or: 'ଜୀବନ କ୍ଷେତ୍ର (କର୍ମ-ଧନ-ବିବାହ)' }, icon: Briefcase },
        { id: 'yogas', label: { en: 'Yogas & Doshas (50+)', hi: 'योग एवं दोष (५०+)', or: 'ଯୋଗ ଓ ଦୋଷ (୫୦+)' }, icon: ShieldCheck },
        { id: 'sacredNakshatra', label: { en: '27 Sacred Trees & Nakshatra', hi: '२७ पवित्र नक्षत्र वृक्ष', or: '୨୭ ପବିତ୍ର ବୃକ୍ଷ ଓ ମନ୍ତ୍ର' }, icon: TreePine },
        { id: 'dailyGuide', label: { en: 'Daily Personal Astro-Guide', hi: 'दैनिक राशिफल एवं ताराबल', or: 'ଦୈନିକ ରାଶିଫଳ ଓ ତାରାବଳ' }, icon: Star },
        { id: 'yearly', label: { en: '365-Day Yearly Forecast', hi: '३६५-दिन वार्षिक फल', or: '୩୬୫-ଦିନ ବାର୍ଷିକ ଫଳ' }, icon: CalendarDays },
        { id: 'charts', label: { en: 'Advance Charts & Graphs', hi: 'एडवान्स चार्ट एवं ग्राफ', or: 'ଆଧୁନିକ ଚାର୍ଟ ଓ ଗ୍ରାଫ' }, icon: BarChart3 },
        { id: 'print', label: { en: 'Print Full Kundali (1-Click)', hi: 'संपूर्ण कुंडली प्रिंट', or: 'ସମ୍ପୂର୍ଣ୍ଣ କୁଣ୍ଡଳୀ ପ୍ରିଣ୍ଟ' }, icon: Printer },
        { id: 'remedies', label: { en: 'Vedic Remedies & Seva', hi: 'वैदिक उपाय एवं रत्न', or: 'ବୈଦିକ ଉପଚାର ଓ ରତ୍ନ' }, icon: HeartHandshake },
        { id: 'predictions', label: { en: 'Classical Life Predictions', hi: 'शास्त्रीय जीवन भविष्यवाणी', or: 'ଶାସ୍ତ୍ରୀୟ ଭବିଷ୍ୟବାଣୀ' }, icon: BookOpen },
      ]
    }
  ];

  // Accurate, always-in-sync section count — never hardcode; reflects every tab so nothing is missing
  const toOdiaDigits = (n: number): string =>
    String(n).replace(/[0-9]/g, (d) => '୦୧୨୩୪୫୬୭୮୯'[Number(d)]);
  const TOTAL_SECTIONS = TAB_CATEGORIES.reduce((sum, cat) => sum + cat.tabs.length, 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 print:p-0 print:max-w-none">
      {/* ★ ADVANCE v2.0 Update Badge — 5-Tier Dasha + Authentic BPHS Ashtakavarga */}
      <div className="print:hidden flex flex-wrap items-center justify-center gap-2 text-center">
        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-gradient-to-r from-cosmic-gold via-yellow-400 to-cosmic-gold text-cosmic-950 shadow-lg shadow-cosmic-gold/30 animate-pulse">
          ✦ Advance v4.0 • REAL Ephemeris (no fake data) + Book-Style Kundali Grantha Print ✦
        </span>
      </div>
      {/* 1. Advanced Interactive Profile Form */}
      <div className="print:hidden">
        <JatakaInputForm
          nativeName={nativeName} setNativeName={setNativeName}
          gender={gender} setGender={setGender}
          birthDateStr={birthDateStr} setBirthDateStr={setBirthDateStr}
          birthTimeStr={birthTimeStr} setBirthTimeStr={setBirthTimeStr}
          selectedLocation={selectedLocation} onSelectLocation={setSelectedLocation}
          chartStyle={chartStyle} setChartStyle={setChartStyle}
          divisionalChart={selectedVarga === 'D9' ? 'D9' : 'D1'}
          setDivisionalChart={(c) => setSelectedVarga(c)}
          ascSign={chartData.ascendantSign}
          ascDegree={chartData.ascendantDegree}
        />
      </div>

      {/* 2. World-Class Tab Navigation Bar with Smooth Scroll Arrows and Quick Jump Drawer */}
      <div className="relative bg-cosmic-950/80 border border-cosmic-gold/30 rounded-2xl p-1.5 shadow-xl backdrop-blur-md print:hidden">
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Scroll Left Button */}
          <button
            onClick={() => scrollTabs('left')}
            className="p-2 rounded-xl bg-cosmic-900 border border-slate-700/80 text-amber-300 hover:bg-cosmic-800 hover:border-amber-400 active:scale-95 transition-all shrink-0 cursor-pointer shadow-md"
            title="Scroll Left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Horizontally Scrollable Tabs Container */}
          <div
            ref={tabScrollRef}
            className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scroll-smooth mobile-touch-scroll no-scrollbar py-1 flex-1 relative"
          >
            {TAB_CATEGORIES.flatMap(cat => cat.tabs).map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  ref={isActive ? activeTabRef : null}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 touch-manipulation min-h-[36px] active:scale-95 ${
                    isActive
                      ? 'bg-gradient-to-r from-cosmic-gold to-yellow-400 text-cosmic-950 shadow-lg shadow-cosmic-gold/25 font-black ring-1 ring-yellow-300'
                      : 'bg-cosmic-900/70 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{tab.label[language]}</span>
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          <button
            onClick={() => scrollTabs('right')}
            className="p-2 rounded-xl bg-cosmic-900 border border-slate-700/80 text-amber-300 hover:bg-cosmic-800 hover:border-amber-400 active:scale-95 transition-all shrink-0 cursor-pointer shadow-md"
            title="Scroll Right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Quick Jump Modal / Popover Button */}
          <button
            onClick={() => setIsQuickJumpOpen(!isQuickJumpOpen)}
            className={`flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 cursor-pointer ${
              isQuickJumpOpen
                ? 'bg-cosmic-gold text-cosmic-950 border-amber-300 shadow-md'
                : 'bg-cosmic-900 text-amber-300 border-slate-700 hover:border-amber-400'
            }`}
            title={`Quick Jump to any of ${TOTAL_SECTIONS} Advance Sections`}
          >
            <Grid className="w-4 h-4" />
            <span className="hidden sm:inline">
              {language === 'or'
                ? `${toOdiaDigits(TOTAL_SECTIONS)} ଆଡଭାନ୍ସ`
                : language === 'hi'
                ? `${TOTAL_SECTIONS} एडवांस`
                : `${TOTAL_SECTIONS} Advance`}
            </span>
          </button>

          {/* Print / PDF Button */}
          <button
            onClick={handlePrint}
            className="p-2 rounded-xl bg-cosmic-900 text-slate-300 border border-slate-700 hover:text-amber-300 hover:border-amber-400 transition-all shrink-0 cursor-pointer shadow-md"
            title="Print Complete Kundali Report"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Quick Jump Categorized Modal Dialog rendered at document.body via Portal */}
      {isQuickJumpOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsQuickJumpOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-gradient-to-b from-cosmic-900 via-cosmic-950 to-cosmic-900 border-2 border-cosmic-gold/70 rounded-3xl p-5 sm:p-6 shadow-2xl max-h-[85vh] flex flex-col justify-between overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-cosmic-gold/30 pb-4 mb-4 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-cosmic-gold/20 border border-cosmic-gold/50 flex items-center justify-center text-cosmic-gold shadow-lg shadow-cosmic-gold/10">
                  <Grid className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-slate-100 font-serif flex items-center gap-2">
                    <span>
                      {language === 'or'
                        ? `ସମସ୍ତ ${toOdiaDigits(TOTAL_SECTIONS)}ଟି ଆଡଭାନ୍ସ ଜ୍ୟୋତିଷ ବିଭାଗ`
                        : language === 'hi'
                        ? `सभी ${TOTAL_SECTIONS} एडवांस ज्योतिष अनुभाग`
                        : `All ${TOTAL_SECTIONS} Advance Astro Sections`}
                    </span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cosmic-gold text-cosmic-950 font-sans font-black uppercase tracking-wider">
                      {TOTAL_SECTIONS} Advance Sections
                    </span>
                  </h4>
                  <p className="text-xs text-slate-300">
                    {language === 'or'
                      ? 'ଯେକୌଣସି ବିଭାଗ ଉପରେ କ୍ଲିକ୍ କରି ତୁରନ୍ତ ସେହି ବିଶ୍ଳେଷଣ ଦେଖନ୍ତୁ'
                      : language === 'hi'
                      ? 'किसी भी अनुभाग पर क्लिक करके तुरंत विश्लेषण देखें'
                      : 'Click any section below to navigate directly'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsQuickJumpOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border border-slate-700/60"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Categories Body */}
            <div className="space-y-4 overflow-y-auto pr-1.5 custom-scrollbar flex-1">
              {TAB_CATEGORIES.map((cat, catIdx) => (
                <div key={catIdx} className="bg-cosmic-950/80 border border-slate-800/90 rounded-2xl p-3.5 space-y-2.5 shadow-inner">
                  <div className="text-[11px] font-bold text-cosmic-gold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cosmic-gold animate-pulse" />
                    <span>{cat.categoryName[language]}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {cat.tabs.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setActiveTab(tab.id);
                            setIsQuickJumpOpen(false);
                          }}
                          className={`flex items-center gap-2.5 p-2.5 rounded-xl text-left text-xs font-semibold transition-all cursor-pointer ${
                            isActive
                              ? 'bg-gradient-to-r from-cosmic-gold to-yellow-400 text-cosmic-950 font-bold shadow-lg shadow-cosmic-gold/25 scale-[1.02]'
                              : 'bg-cosmic-900/90 text-slate-200 hover:bg-cosmic-800 hover:text-white border border-slate-800/90 hover:border-cosmic-gold/40'
                          }`}
                        >
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cosmic-950' : 'text-cosmic-gold'}`} />
                          <span className="truncate">{tab.label[language]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 shrink-0">
              <span className="flex items-center gap-1.5 text-cosmic-gold font-medium">
                <Sparkles className="w-3.5 h-3.5 text-cosmic-saffron" />
                <span>୧୦୦% ପ୍ରାମାଣିକ ବୈଦିକ ଜ୍ୟୋତିଷ ଗଣନା</span>
              </span>
              <button
                onClick={() => setIsQuickJumpOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all cursor-pointer border border-slate-700"
              >
                ବନ୍ଦ କରନ୍ତୁ (Close)
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Modern Full-Screen Print Preview Modal (portal) */}
      {isPrintPreviewOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="odia-print-modal-overlay fixed inset-0 z-[9999] flex flex-col bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => { if (e.target === e.currentTarget) setIsPrintPreviewOpen(false); }}
        >
          {/* Floating Action Toolbar (hidden on print) */}
          <div className="print:hidden shrink-0 flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-cosmic-gold/30 bg-gradient-to-r from-cosmic-950 via-cosmic-900 to-cosmic-950 shadow-2xl">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-cosmic-gold/20 border border-cosmic-gold/50 flex items-center justify-center text-cosmic-gold shadow-lg shrink-0">
                <Printer className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm sm:text-base font-black text-slate-100 font-serif truncate flex items-center gap-2">
                  {language === 'or' ? 'ପ୍ରିଣ୍ଟ ପୂର୍ବାବଲୋକନ' : language === 'hi' ? 'प्रिंट पूर्वावलोकन' : 'Print Preview'}
                  <span className="hidden sm:inline text-[10px] px-2 py-0.5 rounded-full bg-cosmic-gold text-cosmic-950 font-sans font-black uppercase tracking-wider">A4 Book</span>
                </h4>
                <p className="text-[11px] text-slate-400 truncate">
                  {printMode === 'short'
                    ? (language === 'or' ? 'ସଂକ୍ଷିପ୍ତ ସଂସ୍କରଣ — ଜରୁରୀ ଅଧ୍ୟାୟ' : language === 'hi' ? 'संक्षिप्त संस्करण — आवश्यक अध्याय' : 'Short edition — essential chapters')
                    : printMode === 'year'
                    ? (language === 'or' ? `ସନ୍ ${printYear} — ପ୍ରତିଟି ଦିନ` : language === 'hi' ? `सन् ${printYear} — हर एक दिन` : `Year ${printYear} — every single day`)
                    : (language === 'or' ? '୧୮ ଅଧ୍ୟାୟ + ୩୬୫ ଦିନ • ନିଚରୁ ସ୍କ୍ରୋଲ୍ କରି ଦେଖନ୍ତୁ' : language === 'hi' ? '18 अध्याय + 365 दिन • नीचे स्क्रॉल करके देखें' : '18 Chapters + 365 Days • Scroll down to review')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={executePrint}
                className="flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-cosmic-gold to-yellow-400 text-cosmic-950 font-black text-xs sm:text-sm cursor-pointer shadow-lg hover:shadow-cosmic-gold/30 hover:scale-[1.03] transition-all"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">{language === 'or' ? 'ପ୍ରିଣ୍ଟ / PDF' : language === 'hi' ? 'प्रिंट / PDF' : 'Print / Save PDF'}</span>
              </button>
              <button
                onClick={() => setIsPrintPreviewOpen(false)}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border border-slate-700/60"
                title={language === 'or' ? 'ବନ୍ଦ କରନ୍ତୁ' : language === 'hi' ? 'बंद करें' : 'Close'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Edition Selector + Share Suite (3 editions • WhatsApp/Telegram/Gmail/...) */}
          <div className="print:hidden shrink-0 px-4 sm:px-6 py-2.5 border-b border-slate-700/60 bg-cosmic-950/80">
            <PrintControls
              chartData={chartData}
              mode={printMode}
              year={printYear}
              onModeChange={setPrintMode}
              onYearChange={setPrintYear}
              onPrint={executePrint}
            />
          </div>

          {/* Scrollable Grantha Preview Body */}
          <div className="odia-print-inner-scroll odia-print-viewport-wrapper flex-1 overflow-y-auto custom-scrollbar bg-slate-800/40 px-2 sm:px-6 py-4">
            <div className="mx-auto w-full max-w-[210mm]">
              <KundaliPrintView chartData={chartData} onPrint={executePrint} hideHeader mode={printMode} year={printYear} />
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Tab 0: AstroSage-style Horoscope Summary Dashboard */}
      {activeTab === 'overview' && (
        <KundaliOverviewDashboard chartData={chartData} onGo={(tb) => setActiveTab(tb as KundaliTab)} />
      )}

      {/* Tab 1: Visual Chart with Shodashavarga 16 Divisional Charts Selector */}
      {activeTab === 'chart' && (
        <div className="space-y-6">
          <ShodashavargaSelector
            selectedVarga={selectedVarga}
            onSelectVarga={setSelectedVarga}
          />

          {/* Conditional Layout: Full-Width Cinema Mode for 3D, Balanced 2-Column for 2D Charts */}
          {chartStyle === '3d' ? (
            <div className="space-y-6">
              {/* Full-Width 3D Cosmos Card */}
              <div className="bg-cosmic-900/70 border border-cosmic-gold/30 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between w-full mb-3">
                  <span className="text-xs font-bold text-cosmic-gold uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cosmic-saffron animate-spin-slow" />
                    <span>{chartData.vargas[selectedVarga]?.name[language]} ({selectedVarga})</span>
                  </span>
                  <span className="text-[11px] text-amber-300 font-bold bg-amber-500/15 px-3 py-1 rounded-full border border-amber-500/30">
                    ୩D ଭାଚକ୍ର ଗୋଳକ (3D Celestial Orbit)
                  </span>
                </div>

                <KundaliCharts
                  chartStyle={chartStyle}
                  houses={activeHouses}
                  vargaCode={selectedVarga}
                  planetsRecord={chartData.planets}
                  ascendantDegree={chartData.ascendantDegree}
                />

                <div className="mt-3 text-center text-xs text-slate-400 italic">
                  {chartData.vargas[selectedVarga]?.purpose[language]}
                </div>
              </div>

              {/* Full-Width 6-Column Astrometric Ledger Strip */}
              <div className="bg-cosmic-900/70 border border-cosmic-gold/30 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 font-serif">
                    <Sparkles className="w-4 h-4 text-cosmic-gold" />
                    <span>
                      {language === 'or' ? 'ଜନ୍ମ କୁଣ୍ଡଳୀ ମୁଖ୍ୟ ଜ୍ୟୋତିଷ ତତ୍ତ୍ୱ' : language === 'hi' ? 'जन्म कुण्डली मुख्य ज्योतिषीय तत्त्व' : 'Horoscope Core Astrological Elements'}
                    </span>
                  </h3>
                  <span className="text-xs text-cosmic-gold font-medium bg-cosmic-gold/10 px-3 py-1 rounded-full border border-cosmic-gold/25">
                    {selectedLocation.name[language]} ({formatNumber(selectedLocation.latitude.toFixed(2))}°N, {formatNumber(selectedLocation.longitude.toFixed(2))}°E) • 100% Real Ephemeris
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 text-xs">
                  {/* Item 1: Lagna */}
                  <div className="p-3.5 bg-cosmic-950/80 border border-slate-800/90 rounded-2xl flex flex-col justify-between shadow-inner">
                    <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
                      <span>🚩</span> {language === 'or' ? 'ଜନ୍ମ ଲଗ୍ନ' : language === 'hi' ? 'जन्म लग्न' : 'Ascendant'}
                    </span>
                    <span className="font-bold text-cosmic-gold text-sm mt-1">
                      {tRashi(chartData.ascendantSign)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {formatNumber(chartData.ascendantDegree.toFixed(2))}°
                    </span>
                  </div>

                  {/* Item 2: Janma Rashi */}
                  <div className="p-3.5 bg-cosmic-950/80 border border-slate-800/90 rounded-2xl flex flex-col justify-between shadow-inner">
                    <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
                      <span>🌙</span> {language === 'or' ? 'ଚନ୍ଦ୍ର ରାଶି' : language === 'hi' ? 'चन्द्र राशि' : 'Moon Sign'}
                    </span>
                    <span className="font-bold text-cyan-300 text-sm mt-1">
                      {tRashi(chartData.planets.Chandra.sign)}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      {language === 'or' ? `${formatNumber(chartData.planets.Chandra.signIndex + 1)}ମ ରାଶି` : `Sign ${chartData.planets.Chandra.signIndex + 1}`}
                    </span>
                  </div>

                  {/* Item 3: Janma Nakshatra */}
                  <div className="p-3.5 bg-cosmic-950/80 border border-slate-800/90 rounded-2xl flex flex-col justify-between shadow-inner">
                    <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
                      <span>⭐</span> {language === 'or' ? 'ଜନ୍ମ ନକ୍ଷତ୍ର' : language === 'hi' ? 'जन्म नक्षत्र' : 'Nakshatra'}
                    </span>
                    <span className="font-bold text-emerald-400 text-sm mt-1 truncate">
                      {tNakshatra(chartData.planets.Chandra.nakshatra)}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      {t('pada_label')} {formatNumber(chartData.planets.Chandra.pada)}
                    </span>
                  </div>

                  {/* Item 4: Current Dasha */}
                  <div className="p-3.5 bg-cosmic-950/80 border border-slate-800/90 rounded-2xl flex flex-col justify-between shadow-inner">
                    <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
                      <span>⏳</span> {language === 'or' ? 'ସାମ୍ପ୍ରତିକ ଦଶା' : language === 'hi' ? 'वर्तमान दशा' : 'Current Dasha'}
                    </span>
                    <span className="font-bold text-cosmic-saffron text-sm mt-1 truncate">
                      {tGraha(chartData.currentDasha.mahadasha)}
                    </span>
                    <span className="text-[10px] text-slate-300 truncate mt-0.5">
                      {tGraha(chartData.currentDasha.antardasha)}{chartData.currentDasha.pratyantardasha ? ` / ${tGraha(chartData.currentDasha.pratyantardasha)}` : ''}
                    </span>
                  </div>

                  {/* Item 5: Atmakaraka */}
                  <div className="p-3.5 bg-cosmic-950/80 border border-slate-800/90 rounded-2xl flex flex-col justify-between shadow-inner">
                    <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
                      <span>👑</span> {language === 'or' ? 'ଆତ୍ମକାରକ' : language === 'hi' ? 'आत्मकारक' : 'Atmakaraka'}
                    </span>
                    <span className="font-bold text-amber-300 text-sm mt-1">
                      {tGraha(chartData.jaimini.charaKarakas[0].planet)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {formatNumber(chartData.jaimini.charaKarakas[0].degreeInSign)}°
                    </span>
                  </div>

                  {/* Item 6: Ayanamsha */}
                  <div className="p-3.5 bg-cosmic-950/80 border border-slate-800/90 rounded-2xl flex flex-col justify-between shadow-inner">
                    <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
                      <span>📐</span> {t('lahiri_ayanamsa')}
                    </span>
                    <span className="font-bold text-slate-200 text-sm mt-1">
                      {formatNumber(chartData.ayanamsa.toFixed(3))}°
                    </span>
                    <span className="text-[10px] text-cosmic-gold mt-0.5">
                      Chitra-Paksha
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 2D Chart View */}
              <div className="bg-cosmic-900/70 border border-cosmic-gold/30 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="text-xs font-bold text-cosmic-gold uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cosmic-saffron" />
                    <span>{chartData.vargas[selectedVarga]?.name[language]} ({selectedVarga})</span>
                  </span>
                  <span className="text-[11px] text-slate-400 bg-cosmic-950 px-2.5 py-1 rounded-full border border-slate-800">
                    {chartStyle === 'east'
                      ? (language === 'or' ? 'ପୂର୍ବ / ଓଡ଼ିଆ ପାଞ୍ଜି' : 'East / Odia Panjika')
                      : chartStyle === 'north'
                      ? (language === 'or' ? 'ଉତ୍ତର ହୀରା ଚକ୍ର' : 'North Diamond')
                      : chartStyle === 'south'
                      ? (language === 'or' ? 'ଦକ୍ଷିଣ ଚୌକା ଚକ୍ର' : 'South Box')
                      : (language === 'or' ? 'ପଶ୍ଚିମାତ୍ୟ ୩୬୦° ଚକ୍ର' : 'Western 360° Wheel')}
                  </span>
                </div>

                <KundaliCharts
                  chartStyle={chartStyle}
                  houses={activeHouses}
                  vargaCode={selectedVarga}
                  planetsRecord={chartData.planets}
                  ascendantDegree={chartData.ascendantDegree}
                />

                <div className="mt-2 text-center text-xs text-slate-400 italic">
                  {chartData.vargas[selectedVarga]?.purpose[language]}
                </div>
              </div>

              {/* Core Astrological Elements in 2D Mode */}
              <div className="bg-cosmic-900/70 border border-cosmic-gold/30 rounded-3xl p-6 shadow-2xl backdrop-blur-md flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-100 mb-4 flex items-center gap-2 font-serif">
                    <Sparkles className="w-4 h-4 text-cosmic-gold" />
                    <span>
                      {language === 'or' ? 'ଜନ୍ମ କୁଣ୍ଡଳୀ ମୁଖ୍ୟ ଜ୍ୟୋତିଷ ତତ୍ତ୍ୱ' : language === 'hi' ? 'जन्म कुण्डली मुख्य ज्योतिषीय तत्त्व' : 'Horoscope Core Astrological Elements'}
                    </span>
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-cosmic-950/70 border border-slate-800 rounded-2xl flex items-center justify-between">
                      <span className="text-slate-400">{t('ascendant')} (Lagna)</span>
                      <span className="font-bold text-cosmic-gold">{tRashi(chartData.ascendantSign)} ({formatNumber(chartData.ascendantDegree.toFixed(2))}°)</span>
                    </div>

                    <div className="p-3 bg-cosmic-950/70 border border-slate-800 rounded-2xl flex items-center justify-between">
                      <span className="text-slate-400">{language === 'or' ? 'ଜନ୍ମ ରାଶି (ଚନ୍ଦ୍ର ରାଶି)' : language === 'hi' ? 'जन्म राशि (चन्द्र राशि)' : 'Janma Rashi (Moon Sign)'}</span>
                      <span className="font-bold text-cyan-300">{tRashi(chartData.planets.Chandra.sign)}</span>
                    </div>

                    <div className="p-3 bg-cosmic-950/70 border border-slate-800 rounded-2xl flex items-center justify-between">
                      <span className="text-slate-400">{language === 'or' ? 'ଜନ୍ମ ନକ୍ଷତ୍ର ଓ ଚରଣ' : language === 'hi' ? 'जन्म नक्षत्र एवं चरण' : 'Janma Nakshatra'}</span>
                      <span className="font-bold text-emerald-400">{tNakshatra(chartData.planets.Chandra.nakshatra)} ({t('pada_label')} {formatNumber(chartData.planets.Chandra.pada)})</span>
                    </div>

                    <div className="p-3 bg-cosmic-950/70 border border-slate-800 rounded-2xl flex items-center justify-between">
                      <span className="text-slate-400">{language === 'or' ? 'ସାମ୍ପ୍ରତିକ ବିଂଶୋତ୍ତରୀ ଦଶା' : language === 'hi' ? 'वर्तमान विंशोत्तरी दशा' : 'Current Vimshottari Period'}</span>
                      <span className="font-bold text-cosmic-saffron">
                        {tGraha(chartData.currentDasha.mahadasha)} / {tGraha(chartData.currentDasha.antardasha)}
                        {chartData.currentDasha.pratyantardasha && ` / ${tGraha(chartData.currentDasha.pratyantardasha)}`}
                      </span>
                    </div>

                    <div className="p-3 bg-cosmic-950/70 border border-slate-800 rounded-2xl flex items-center justify-between">
                      <span className="text-slate-400">{language === 'or' ? 'ଆତ୍ମକାରକ ଗ୍ରହ (ଜୈମିନି)' : language === 'hi' ? 'आत्मकारक ग्रह (जैमिनी)' : 'Atmakaraka (Soul Planet)'}</span>
                      <span className="font-bold text-amber-300">
                        {tGraha(chartData.jaimini.charaKarakas[0].planet)} ({formatNumber(chartData.jaimini.charaKarakas[0].degreeInSign)}°)
                      </span>
                    </div>

                    <div className="p-3 bg-cosmic-950/70 border border-slate-800 rounded-2xl flex items-center justify-between">
                      <span className="text-slate-400">{t('lahiri_ayanamsa')}</span>
                      <span className="font-semibold text-slate-200">{formatNumber(chartData.ayanamsa.toFixed(3))}° (Chitra-Paksha)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>{selectedLocation.name[language]} ({formatNumber(selectedLocation.latitude.toFixed(2))}°N, {formatNumber(selectedLocation.longitude.toFixed(2))}°E)</span>
                  <span className="text-cosmic-gold font-semibold">{language === 'or' ? '୧୦୦% ସଠିକ୍ ଜ୍ୟୋତିର୍ବୈଜ୍ଞାନିକ ସ୍ଥିତି' : '100% Real Coordinates'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Navagraha Sphutas Table with Rich Micro-Data */}
      {activeTab === 'planets' && (
        <NavagrahaTable
          planets={chartData.planets}
          kpSystem={chartData.kpSystem}
          jaimini={chartData.jaimini}
          vimsopakaBala={chartData.vimsopakaBala}
        />
      )}

      {/* Tab 3: Special Lagnas & Upagrahas (Śrī, Indu, Hora, Ghāti, Mandi, Gulika) */}
      {activeTab === 'specialLagnas' && (
        <SpecialLagnasView specialLagnas={chartData.specialLagnas} />
      )}

      {/* Tab: Janma Panchanga 5 Pillars */}
      {activeTab === 'panchanga' && (
        <JanmaPanchangaView janmaPanchanga={chartData.janmaPanchanga} />
      )}

      {/* Tab: Vimsopaka Bala & Ishta/Kashta Phala */}
      {activeTab === 'vimsopaka' && (
        <VimsopakaBalaView vimsopakaBala={chartData.vimsopakaBala} />
      )}

      {/* Tab: Bhrigu Nandi Nadi Conjunctions */}
      {activeTab === 'nadi' && (
        <BhriguNandiNadiView nadiAstrology={chartData.nadiAstrology} />
      )}

      {/* Tab: Sacred Nakshatra Lore & Trees */}
      {activeTab === 'sacredNakshatra' && (
        <NakshatraSacredView nakshatraSacred={chartData.nakshatraSacred} />
      )}

      {/* Tab: Comprehensive Life Domains Predictions */}
      {activeTab === 'lifeDomains' && (
        <LifeDomainPredictionsView lifeDomains={chartData.lifeDomains} />
      )}

      {/* Tab: Avakhada Chakra & Ghataka Warnings */}
      {activeTab === 'avakhada' && (
        <AvakhadaChakraView avakhada={chartData.avakhada} ghataka={chartData.ghataka} />
      )}

      {/* Tab: 12 Bhavas Detailed Predictive Analysis */}
      {activeTab === 'bhavas' && (
        <BhavaDetailedAnalysisView bhavaAnalysis={chartData.bhavaAnalysis} />
      )}

      {/* Tab: Planetary Avasthas (3-Fold) */}
      {activeTab === 'avasthas' && (
        <PlanetaryAvasthasView planetaryAvasthas={chartData.planetaryAvasthas} />
      )}

      {/* Tab: KP System 249 Sub-Lords */}
      {activeTab === 'kp' && (
        <KpSystemView kpSystem={chartData.kpSystem} />
      )}

      {/* Tab: Daily Personal Astro-Guide */}
      {activeTab === 'dailyGuide' && (
        <PersonalDailyAuspiciousView dailyGuide={chartData.dailyGuide} />
      )}

      {/* Tab: 365-Day Yearly Forecast (every single day) */}
      {activeTab === 'yearly' && (
        <YearlyForecastView chartData={chartData} />
      )}

      {/* Tab: Advance Charts & Graphs */}
      {activeTab === 'charts' && (
        <div className="space-y-4">
          <div className="rounded-3xl border border-cosmic-gold/40 bg-gradient-to-r from-cosmic-gold/10 to-transparent p-4">
            <h3 className="text-base font-black text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cosmic-gold" />
              {language === 'or' ? 'ଆଧୁନିକ ଚାର୍ଟ ଓ ଗ୍ରାଫ' : language === 'hi' ? 'एडवान्स चार्ट एवं ग्राफ' : 'Advance Charts & Graphs'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {language === 'or'
                ? 'ଷଡ଼ବଳ, ଅଷ୍ଟକବର୍ଗ, ବିଂଶୋପକ, ୩୬୫-ଦିନ ଟ୍ରେଣ୍ଡ, ଜୀବନ କ୍ଷେତ୍ର ରଡାର — ସବୁ ଏଠାରେ ଗ୍ରାଫ୍ ରୂପେ।'
                : language === 'hi'
                ? 'षड्बल, अष्टकवर्ग, विंशोपक, 365-दिन ट्रेंड, जीवन क्षेत्र रडार — सब यहाँ ग्राफ रूप में।'
                : 'Shadbala, Ashtakavarga, Vimsopaka, 365-day trend, Life-domain radar — all as visual graphs.'}
            </p>
          </div>
          <KundaliChartsView chartData={chartData} />
        </div>
      )}

      {/* Tab: 1-Click Full Kundali Print */}
      {activeTab === 'print' && (
        <div className="space-y-4">
          <div className="rounded-3xl border border-cosmic-gold/40 bg-cosmic-900/60 p-4 sm:p-6 print:hidden">
            <h3 className="text-base font-black text-slate-100 flex items-center gap-2">
              🖨 {language === 'or' ? 'କୁଣ୍ଡଳୀ ପ୍ରିଣ୍ଟ — ୩ଟି ସଂସ୍କରଣ' : language === 'hi' ? 'कुंडली प्रिंट — 3 संस्करण' : 'Kundali Print — 3 Editions'}
            </h3>
            <p className="text-xs text-slate-400 mt-1 mb-3">
              {language === 'or' ? 'ସଂକ୍ଷିପ୍ତ (ଜରୁରୀ) • ସମ୍ପୂର୍ଣ୍ଣ ଜୀବନ (୧୮ ଅଧ୍ୟାୟ) • ବର୍ଷ (ଚୟନିତ ବର୍ଷର ପ୍ରତିଟି ଦିନ) — ସହ ସେୟାର: WhatsApp, Telegram, Gmail, Facebook, X, LinkedIn, ଲିଙ୍କ କପି' : language === 'hi' ? 'संक्षिप्त (आवश्यक) • संपूर्ण जीवन (18 अध्याय) • वर्ष (चयनित वर्ष का हर दिन) — साथ शेयर: WhatsApp, Telegram, Gmail, Facebook, X, LinkedIn, लिंक कॉपी' : 'Short (essentials) • Full Life (18 chapters) • Year (every day of chosen year) — plus Share: WhatsApp, Telegram, Gmail, Facebook, X, LinkedIn, Copy Link'}
            </p>
            <PrintControls
              chartData={chartData}
              mode={printMode}
              year={printYear}
              onModeChange={setPrintMode}
              onYearChange={setPrintYear}
              onPrint={handlePrint}
            />
          </div>
          <KundaliPrintView chartData={chartData} onPrint={handlePrint} mode={printMode} year={printYear} />
        </div>
      )}

      {/* Tab: Shadbala 6-Fold Strength */}
      {activeTab === 'shadbala' && <ShadbalaView shadbala={chartData.shadbala} />}
      {activeTab === 'vargottama' && <VargottamaPowerMatrixView chartData={chartData} />}

      {/* Tab: Ashtakavarga 8x12 Matrix */}
      {activeTab === 'ashtakavarga' && <AshtakavargaMatrixView ashtakavarga={chartData.ashtakavarga} />}

      {/* Tab: 3-Tier Vimshottari Dashas Timeline */}
      {activeTab === 'dashas' && (
        <PratyantardashaTimeline
          dashas={chartData.dashas}
          currentDasha={chartData.currentDasha}
        />
      )}

      {/* Tab: Yogas & Critical Doshas (Kala Sarpa, Manglik, Sade Sati) */}
      {activeTab === 'yogas' && (
        <YogasAndPredictions
          viewType="yogas"
          yogas={chartData.yogas}
          predictions={chartData.predictions}
          kalaSarpa={chartData.kalaSarpa}
          manglik={chartData.manglik}
          sadeSati={chartData.gochara.sadeSati}
        />
      )}

      {/* Tab: Jaimini Chara Karakas */}
      {activeTab === 'jaimini' && <JaiminiAstrologyView jaimini={chartData.jaimini} />}

      {/* Tab: Bhava Chalit Sripati Cusps */}
      {activeTab === 'chalit' && <BhavaChalitView bhavaChalit={chartData.bhavaChalit} />}

      {/* Tab: Live Gochara Transits */}
      {activeTab === 'gochara' && <GocharaTransitView gochara={chartData.gochara} />}

      {/* Tab: Vedic Remedies & Srimandir Seva */}
      {activeTab === 'remedies' && <VedicRemediesView remedies={chartData.remedies} />}

      {/* Tab: Classical Life Predictions */}
      {activeTab === 'predictions' && (
        <YogasAndPredictions
          viewType="predictions"
          yogas={chartData.yogas}
          predictions={chartData.predictions}
        />
      )}
    </div>
  );
};
