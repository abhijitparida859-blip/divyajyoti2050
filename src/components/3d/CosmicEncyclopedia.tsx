import React, { useState, useMemo, useRef } from 'react';
import { useI18n } from '../../localization/i18n';
import {
  Sparkles,
  Flame,
  Globe2,
  Rocket,
  BookOpen,
  Award,
  Atom,
  Clock,
  Compass,
  ChevronRight,
  ChevronLeft,
  Info,
  Calculator,
  Gauge,
  Activity,
  Microscope,
  Scale,
  Orbit,
  Layers,
  Copy,
  Check,
  ShieldAlert,
  Zap,
  RotateCw,
  Radio
} from 'lucide-react';
import { PlanetName } from '../../types/jataka';
import { NASA_SOLAR_PHYSICS } from './nasaPhysicsData';
import { LiveBigBangSimulator } from './LiveBigBangSimulator';
import { PLANETARY_SCIENCE_DATA, PlanetaryDossier } from '../../data/planetaryScienceData';
import { Planet3DViewer } from './Planet3DViewer';
import { SPACE_MISSIONS_DATA, SpaceMission } from '../../data/spaceMissionsData';
import { Mission3DViewer } from './Mission3DViewer';
import { SafeErrorBoundary } from '../common/SafeErrorBoundary';

export const CosmicEncyclopedia: React.FC = () => {
  const { language, formatNumber } = useI18n();
  const [activeSection, setActiveSection] = useState<'bigbang' | 'solarsystem' | 'missions' | 'astrophysics'>('missions');
  const [selectedPlanetKey, setSelectedPlanetKey] = useState<string>('Guru');

  // Interactive Planetary Science Explorer states
  const [planetSubTab, setPlanetSubTab] = useState<'physics' | 'vedic' | 'missions' | 'moons'>('physics');
  const [userWeight, setUserWeight] = useState<number>(70);
  const [copiedMantra, setCopiedMantra] = useState<boolean>(false);
  const [planetFilter, setPlanetFilter] = useState<'all' | 'navagraha' | 'giants' | 'rocky'>('all');
  const planetChipsRef = useRef<HTMLDivElement>(null);

  // Interactive Space Missions Explorer states
  const [selectedMissionId, setSelectedMissionId] = useState<string>('Chandrayaan3');
  const [missionFilter, setMissionFilter] = useState<'all' | 'isro' | 'nasa' | 'moon' | 'mars' | 'deepspace'>('all');
  const [missionSubTab, setMissionSubTab] = useState<'overview' | 'payloads' | 'timeline' | 'specs'>('overview');
  const missionChipsRef = useRef<HTMLDivElement>(null);

  // Interactive Kepler's 3rd Law state
  const [keplerAU, setKeplerAU] = useState<number>(1.0);

  // Interactive Gravity & Escape Velocity state
  const [calcMass, setCalcMass] = useState<number>(1.0); // in Earth masses
  const [calcRadius, setCalcRadius] = useState<number>(1.0); // in Earth radii

  const activeDossier = PLANETARY_SCIENCE_DATA[selectedPlanetKey] || PLANETARY_SCIENCE_DATA['Guru'];
  const activeMission = SPACE_MISSIONS_DATA[selectedMissionId] || SPACE_MISSIONS_DATA['Chandrayaan3'];

  // Filtered mission list
  const filteredMissions = useMemo(() => {
    return Object.values(SPACE_MISSIONS_DATA).filter((m) => {
      if (missionFilter === 'all') return true;
      if (missionFilter === 'isro') return m.agency === 'ISRO' || m.agency === 'ISRO-NASA';
      if (missionFilter === 'nasa') return m.agency === 'NASA' || m.agency === 'NASA-ESA' || m.agency === 'ISRO-NASA';
      if (missionFilter === 'moon') return m.target === 'Moon';
      if (missionFilter === 'mars') return m.target === 'Mars';
      if (missionFilter === 'deepspace') return m.target === 'Deep Space' || m.target === 'Sun' || m.target === 'Jupiter' || m.target === 'Saturn';
      return true;
    });
  }, [missionFilter]);

  const scrollMissionChips = (direction: 'left' | 'right') => {
    if (missionChipsRef.current) {
      const offset = direction === 'left' ? -260 : 260;
      missionChipsRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };


  // Filtered planet list
  const filteredPlanetKeys = useMemo(() => {
    return Object.keys(PLANETARY_SCIENCE_DATA).filter((key) => {
      const d = PLANETARY_SCIENCE_DATA[key];
      if (planetFilter === 'all') return true;
      if (planetFilter === 'navagraha') {
        return ['Surya', 'Chandra', 'Mangala', 'Budha', 'Guru', 'Shukra', 'Shani', 'Rahu', 'Ketu', 'PrithviChandra'].includes(key);
      }
      if (planetFilter === 'giants') {
        return d.category === 'gas_giant' || d.category === 'ice_giant';
      }
      if (planetFilter === 'rocky') {
        return d.category === 'rocky' || d.category === 'star' || d.category === 'lunar_node';
      }
      return true;
    });
  }, [planetFilter]);

  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  const handleCopyMantra = async (mantraText: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(mantraText);
        setCopiedMantra(true);
        if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
        copyTimerRef.current = setTimeout(() => setCopiedMantra(false), 2000);
      }
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
  };

  const scrollPlanetChips = (direction: 'left' | 'right') => {
    if (planetChipsRef.current) {
      const offset = direction === 'left' ? -260 : 260;
      planetChipsRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };


  return (
    <div className="bg-gradient-to-b from-cosmic-950 via-cosmic-900 to-cosmic-950 border-2 border-cosmic-gold/30 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-2xl space-y-6 text-slate-100">
      {/* Header: Cosmic Encyclopedia Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cosmic-gold/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Atom className="w-6 h-6 text-cosmic-saffron animate-spin-slow" />
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cosmic-gold via-yellow-200 to-amber-400 bg-clip-text text-transparent font-serif">
              {language === 'or' ? 'ବ୍ରହ୍ମାଣ୍ଡ ବିଜ୍ଞାନ ଓ ବୈଦିକ ସୃଷ୍ଟି ଜ୍ଞାନକୋଷ' : 'Cosmic Science & Vedic Universe Encyclopedia'}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'or'
              ? 'ଗୁଗୁଲ୍ ସୋଲାର୍ ସିଷ୍ଟମ୍, ବିଗ୍ ବ୍ୟାଙ୍ଗ୍ ଥିଓରୀ, ଋଗ୍‌ବେଦ ନାସଦୀୟ ସୂକ୍ତ ଏବଂ ଇସ୍ରୋ/ନାସା ମହାକାଶ ଗବେଷଣା'
              : 'NASA Astrophysics, Big Bang Theory, Rigvedic Hiranyagarbha Cosmology, & ISRO Space Exploration'}
          </p>
        </div>

        {/* 4 Main Section Navigation Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-cosmic-950/90 border border-slate-800 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveSection('bigbang')}
            className={`px-3 py-1.5 text-xs rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'bigbang'
                ? 'bg-gradient-to-r from-cosmic-saffron to-amber-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'or' ? '💥 ବିଗ୍ ବ୍ୟାଙ୍ଗ୍ ଓ ବ୍ରହ୍ମାଣ୍ଡ' : '💥 Big Bang Theory'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('solarsystem')}
            className={`px-3 py-1.5 text-xs rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'solarsystem'
                ? 'bg-gradient-to-r from-cosmic-gold to-yellow-400 text-cosmic-950 shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>{language === 'or' ? '🪐 ଗ୍ରହମଣ୍ଡଳ ବିଜ୍ଞାନ' : '🪐 Solar Planets'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('missions')}
            className={`px-3 py-1.5 text-xs rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'missions'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-cosmic-950 shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>{language === 'or' ? '🚀 ISRO / NASA ମିଶନ୍' : '🚀 Space Missions'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('astrophysics')}
            className={`px-3 py-1.5 text-xs rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'astrophysics'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Microscope className="w-3.5 h-3.5" />
            <span>{language === 'or' ? '🔬 ମହାକାଶ ପଦାର୍ଥ ବିଜ୍ଞାନ ଲାବୋରେଟୋରୀ' : '🔬 Astrophysics Lab'}</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: BIG BANG THEORY & VEDIC COSMOLOGY */}
      {activeSection === 'bigbang' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Live Interactive Big Bang Simulator */}
          <SafeErrorBoundary fallbackTitle={language === 'or' ? 'ବିଗ୍ ବ୍ୟାଙ୍ଗ୍ ସିମୁଲେଟର' : language === 'hi' ? 'बिग बैंग सिम्युलेटर' : 'Big Bang Simulator'}>
            <LiveBigBangSimulator />
          </SafeErrorBoundary>

          {/* Hero Banner: Science meets Sanskrit Shastra */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-cosmic-950/70 border border-cosmic-gold/25 rounded-2xl p-5 shadow-xl">
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cosmic-saffron" />
                ଆଧୁନିକ ମହାକାଶ ପଦାର୍ଥ ବିଜ୍ଞାନ (Modern Astrophysics)
              </span>
              <h3 className="text-lg font-bold text-white font-serif">
                {language === 'or' ? '୧୩.୮ ବିଲିୟନ ବର୍ଷ ପୂର୍ବେ: ମହା ବିସ୍ଫୋରଣ (The Big Bang)' : '13.8 Billion Years Ago: The Big Bang'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'or'
                  ? 'ଆଧୁନିକ ପଦାର୍ଥ ବିଜ୍ଞାନ ଅନୁସାରେ, ସମୟ ଏବଂ ସ୍ଥାନ (Space-Time) ର ଆରମ୍ଭ ଏକ ଅସୀମ ଘନତ୍ୱ ଓ ଶକ୍ତି ବିଶିଷ୍ଟ ବିନ୍ଦୁ (Singularity) ରୁ ହୋଇଥିଲା। ୧୦⁻³² ସେକେଣ୍ଡରେ ପ୍ରଚଣ୍ଡ କସ୍ମିକ୍ ଇନଫ୍ଲେସନ୍ (Cosmic Inflation) ହୋଇ ବ୍ରହ୍ମାଣ୍ଡ ସୃଷ୍ଟି ହେଲା। ପରେ ହାଇଡ୍ରୋଜେନ୍ ଓ ହିଲିୟମ୍ ମିଶି ପ୍ରଥମ ତାରକା, ଗାଲାକ୍ସି ଏବଂ ୪.୬ ବିଲିୟନ ବର୍ଷ ପୂର୍ବେ ଆମ ସୌରମଣ୍ଡଳ ଗଠନ କଲେ।'
                  : 'According to modern astrophysics, the universe emerged 13.8 billion years ago from an infinitely dense singularity. Rapid cosmic inflation forged fundamental particles, leading to stars, galaxies, and the formation of our solar system 4.6 billion years ago.'}
              </p>
            </div>

            <div className="space-y-3 bg-cosmic-900/60 p-4 rounded-xl border border-cosmic-gold/20">
              <span className="text-[11px] font-bold text-cosmic-gold uppercase tracking-widest flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-cosmic-gold" />
                ଋଗ୍‌ବେଦ ନାସଦୀୟ ସୂକ୍ତ ଓ ହିରଣ୍ୟଗର୍ଭ (Ancient Vedic Insight)
              </span>
              <div className="text-xs font-serif italic text-yellow-200/90 border-l-2 border-cosmic-gold pl-3 py-1">
                "ନାସଦାସୀନ୍ନୋ ସଦାସୀତ୍ ତଦାନୀମ୍ ନାସୀଦ୍ରଜୋ ନୋ ବ୍ୟୋମା ପରୋ ୟତ୍..."<br />
                — ଋଗ୍‌ବେଦ ମଣ୍ଡଳ ୧୦, ସୂକ୍ତ ୧୨୯ (Nasadiya Sukta)
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'or'
                  ? 'ଋଗ୍‌ବେଦର ଋଷିମାନେ ଲେଖିଥିଲେ ଯେ ସୃଷ୍ଟି ପୂର୍ବରୁ ନା ଥିଲା ସତ୍ ନା ଥିଲା ଅସତ୍, ନା ଥିଲା ମୃତ୍ୟୁ ନା ଥିଲା ଅମରତ୍ୱ! ଏକମାତ୍ର ସୁପ୍ରିମ୍ କସ୍ମିକ୍ ଏନର୍ଜି (ହିରଣ୍ୟଗର୍ଭ - Golden Seed) ବିନ୍ଦୁ ନାଦରୁ ସ୍ଫୋରଣ ହୋଇ ବ୍ରହ୍ମାଣ୍ଡର ଉତ୍ପତ୍ତି ଘଟିଲା। ବୈଦିକ କାଳଗଣନାରେ ୧ କଳ୍ପ = ୪.୩୨ ବିଲିୟନ ବର୍ଷ, ଯାହା ପୃଥିବୀର ବୈଜ୍ଞାନିକ ଆୟୁଷ ସହିତ ଆଶ୍ଚର୍ଯ୍ୟଜନକ ଭାବେ ନିକଟତମ!'
                  : language === 'hi'
                  ? 'ऋग्वेद के ऋषियों ने लिखा था कि सृष्टि से पहले न सत् था न असत्, न मृत्यु थी न अमरत्व! एकमात्र सुप्रीम कॉस्मिक एनर्जी (हिरण्यगर्भ) बिंदु से विस्फोट होकर ब्रह्मांड की उत्पत्ति हुई। वैदिक कालगणना में 1 कल्प = 4.32 बिलियन वर्ष, जो पृथ्वी की वैज्ञानिक आयु के आश्चर्यजनक रूप से निकटतम है!'
                  : 'Thousands of years before modern telescopes, Vedic sages discovered that existence arose from a primordial cosmic golden egg (Hiranyagarbha). The Vedic cosmic day (Kalpa = 4.32 billion years) astonishingly aligns with modern geological estimates!'}
              </p>
            </div>
          </div>

          {/* Timeline of the Cosmos (4 Epochs) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-cosmic-950/80 border border-slate-800 p-4 rounded-2xl space-y-2">
              <span className="text-[10px] font-mono text-cosmic-gold">t = 0 sec</span>
              <h4 className="text-sm font-bold text-white">୧. ସିଙ୍ଗୁଲାରିଟି (Singularity)</h4>
              <p className="text-[11px] text-slate-400">ଅସୀମ ଶକ୍ତିର ଏକକ ବିନ୍ଦୁରୁ ସମୟ, ସ୍ଥାନ ଓ ପଦାର୍ଥର ଜନ୍ମ। ବୈଦିକ ଦର୍ଶନରେ ଏହାକୁ 'ମହା ବିନ୍ଦୁ ନାଦ' କୁହାଯାଏ।</p>
            </div>

            <div className="bg-cosmic-950/80 border border-slate-800 p-4 rounded-2xl space-y-2">
              <span className="text-[10px] font-mono text-cosmic-gold">t = 380,000 Years</span>
              <h4 className="text-sm font-bold text-white">୨. ପ୍ରଥମ ଆଲୋକ (CMBR)</h4>
              <p className="text-[11px] text-slate-400">ବ୍ରହ୍ମାଣ୍ଡ ଶୀତଳ ହୋଇ ପ୍ରଥମ ଥର ଫୋଟୋନ୍ ମୁକ୍ତ ହେଲେ। ଏହି ପ୍ରାଚୀନ ଆଲୋକ ଆଜି ମାଇକ୍ରୋୱେଭ୍ ବ୍ୟାକଗ୍ରାଉଣ୍ଡ୍ ଭାବେ ବିଦ୍ୟମାନ।</p>
            </div>

            <div className="bg-cosmic-950/80 border border-slate-800 p-4 rounded-2xl space-y-2">
              <span className="text-[10px] font-mono text-cosmic-gold">t = 400M - 1B Years</span>
              <h4 className="text-sm font-bold text-white">୩. ପ୍ରଥମ ଗାଲାକ୍ସି ଓ ତାରକା</h4>
              <p className="text-[11px] text-slate-400">ମାଧ୍ୟାକର୍ଷଣ ଶକ୍ତି ଦ୍ୱାରା ନକ୍ଷତ୍ରମଣ୍ଡଳ, ଆକାଶଗଙ୍ଗା (Milky Way) ଓ ବ୍ରହ୍ମାଣ୍ଡୀୟ କସ୍ମିକ୍ ୱେବ୍ ଗଠିତ ହେଲା।</p>
            </div>

            <div className="bg-cosmic-950/80 border border-slate-800 p-4 rounded-2xl space-y-2">
              <span className="text-[10px] font-mono text-cosmic-gold">t = 4.6 Billion Years Ago</span>
              <h4 className="text-sm font-bold text-white">୪. ଆମ ସୌରମଣ୍ଡଳ ସୃଷ୍ଟି</h4>
              <p className="text-[11px] text-slate-400">ସୌର ନେବୁଲା (Solar Nebula) ର ଧୂଳି ଓ ଗ୍ୟାସ୍ ଘନୀଭୂତ ହୋଇ ସୂର୍ଯ୍ୟ, ପୃଥିବୀ ଏବଂ ସମସ୍ତ ଗ୍ରହମଣ୍ଡଳ ଜନ୍ମ ନେଲେ।</p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: GOOGLE SOLAR SYSTEM & VEDIC PLANETARY SCIENCE DOSSIER */}
      {activeSection === 'solarsystem' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Planet Category Filter Bar & Scrolling Chips */}
          <div className="space-y-3 bg-cosmic-950/80 border border-slate-800/80 p-3.5 rounded-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-cosmic-gold animate-spin-slow" />
                <span className="text-xs font-bold text-slate-200">
                  {language === 'or' ? 'ସୌରମଣ୍ଡଳ ଗ୍ରହ ଓ ନବଗ୍ରହ ଚୟନ କରନ୍ତୁ:' : 'Select Celestial World & Planetary Dossier:'}
                </span>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-medium">
                {[
                  { id: 'all', labelOr: 'ସମସ୍ତ (12)', labelEn: 'All Worlds (12)' },
                  { id: 'navagraha', labelOr: 'ନବଗ୍ରହ (9)', labelEn: 'Navagraha (9)' },
                  { id: 'giants', labelOr: 'ଜାଏଣ୍ଟ ଗ୍ରହ', labelEn: 'Gas & Ice Giants' },
                  { id: 'rocky', labelOr: 'ଶିଳା ଗ୍ରହ', labelEn: 'Rocky Planets' }
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setPlanetFilter(f.id as any)}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      planetFilter === f.id
                        ? 'bg-cosmic-gold text-cosmic-950 font-bold shadow-md'
                        : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {language === 'or' ? f.labelOr : f.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrolling Planet Selector Row with Navigation Arrows */}
            <div className="relative flex items-center group">
              <button
                type="button"
                onClick={() => scrollPlanetChips('left')}
                className="absolute -left-2 z-10 w-7 h-7 rounded-full bg-cosmic-900/90 border border-cosmic-gold/40 text-cosmic-gold hover:bg-cosmic-gold hover:text-cosmic-950 flex items-center justify-center shadow-lg transition-all cursor-pointer opacity-80 hover:opacity-100"
                title="Scroll Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div
                ref={planetChipsRef}
                className="flex items-center gap-2 overflow-x-auto scroll-smooth no-scrollbar py-1 px-4 w-full"
              >
                {filteredPlanetKeys.map((key) => {
                  const data = PLANETARY_SCIENCE_DATA[key];
                  const isSelected = selectedPlanetKey === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedPlanetKey(key)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border flex-shrink-0 shadow-md ${
                        isSelected
                          ? 'bg-gradient-to-r from-cosmic-gold to-yellow-400 text-cosmic-950 border-white shadow-xl shadow-cosmic-gold/25 scale-[1.02]'
                          : 'bg-cosmic-950/80 text-slate-300 border-slate-800 hover:border-cosmic-gold/50 hover:text-cosmic-gold'
                      }`}
                    >
                      <span className="text-base">{data.symbol.split(' ')[0]}</span>
                      <span>{data.nameOr}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                          isSelected ? 'bg-cosmic-950/20 text-cosmic-950' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {data.category === 'gas_giant' ? 'Gas' : data.category === 'ice_giant' ? 'Ice' : data.category === 'star' ? 'Star' : data.category === 'lunar_node' ? 'Node' : 'Rocky'}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => scrollPlanetChips('right')}
                className="absolute -right-2 z-10 w-7 h-7 rounded-full bg-cosmic-900/90 border border-cosmic-gold/40 text-cosmic-gold hover:bg-cosmic-gold hover:text-cosmic-950 flex items-center justify-center shadow-lg transition-all cursor-pointer opacity-80 hover:opacity-100"
                title="Scroll Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Planet Grand Dossier */}
          <div
            className={`bg-gradient-to-b ${activeDossier.gradientBg} border-2 ${activeDossier.borderColor} rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-2xl space-y-6 transition-all duration-300`}
          >
            {/* Header: Title, Sanskrit Name, Category Badge & Quick Key Stats */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-widest font-mono px-2.5 py-1 rounded-full border ${activeDossier.badgeBg}`}>
                    {activeDossier.category === 'gas_giant'
                      ? 'NASA & ESA Gas Giant'
                      : activeDossier.category === 'ice_giant'
                      ? 'NASA & ESA Ice Giant'
                      : activeDossier.category === 'star'
                      ? 'Yellow Dwarf Central Star'
                      : activeDossier.category === 'lunar_node'
                      ? 'Astronomical Lunar Intersection Node'
                      : 'Terrestrial Habitable / Rocky Body'}
                  </span>
                  <span className="text-xs text-cosmic-gold font-serif italic">
                    {activeDossier.sanskritName}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3 font-serif">
                  <span className="text-3xl sm:text-4xl" style={{ color: activeDossier.themeColor }}>
                    {activeDossier.symbol}
                  </span>
                  <span>{activeDossier.nameOr}</span>
                </h3>

                <p className="text-xs text-slate-300 font-mono">
                  {activeDossier.nameEn}
                </p>
              </div>

              {/* Quick Key Metric Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="bg-cosmic-950/80 border border-slate-800 px-3 py-1.5 rounded-xl text-center">
                  <span className="text-[9px] text-slate-400 block font-mono">Mass</span>
                  <span className="text-xs font-bold text-amber-300 font-mono">{activeDossier.massEarthRel}</span>
                </div>
                <div className="bg-cosmic-950/80 border border-slate-800 px-3 py-1.5 rounded-xl text-center">
                  <span className="text-[9px] text-slate-400 block font-mono">Gravity (g)</span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">{activeDossier.gravityG} g</span>
                </div>
                <div className="bg-cosmic-950/80 border border-slate-800 px-3 py-1.5 rounded-xl text-center">
                  <span className="text-[9px] text-slate-400 block font-mono">Distance</span>
                  <span className="text-xs font-bold text-cyan-300 font-mono">{activeDossier.semiMajorAxisAU}</span>
                </div>
                <div className="bg-cosmic-950/80 border border-slate-800 px-3 py-1.5 rounded-xl text-center">
                  <span className="text-[9px] text-slate-400 block font-mono">Moons</span>
                  <span className="text-xs font-bold text-violet-300 font-mono">{activeDossier.knownMoonsCount} Moons</span>
                </div>
              </div>
            </div>

            {/* 4 Interactive Sub-Tabs */}
            <div className="flex flex-wrap items-center gap-2 bg-cosmic-950/90 border border-slate-800 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => setPlanetSubTab('physics')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  planetSubTab === 'physics'
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Microscope className="w-4 h-4" />
                <span>{language === 'or' ? '🔬 ନାସା ମହାକାଶ ପଦାର୍ଥ ବିଜ୍ଞାନ' : '🔬 NASA Astrophysics Profile'}</span>
              </button>

              <button
                type="button"
                onClick={() => setPlanetSubTab('vedic')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  planetSubTab === 'vedic'
                    ? 'bg-gradient-to-r from-cosmic-gold to-amber-500 text-cosmic-950 shadow-lg shadow-cosmic-gold/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>{language === 'or' ? '📜 ବୈଦିକ ଜ୍ୟୋତିଷ ଓ ଋଷି ସିଦ୍ଧାନ୍ତ' : '📜 Vedic Astrological Heritage'}</span>
              </button>

              <button
                type="button"
                onClick={() => setPlanetSubTab('missions')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  planetSubTab === 'missions'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-cosmic-950 shadow-lg shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Rocket className="w-4 h-4" />
                <span>
                  {language === 'or' ? `🚀 ମହାକାଶ ଅଭିଯାନ (${activeDossier.spaceMissions.length})` : `🚀 Space Missions (${activeDossier.spaceMissions.length})`}
                </span>
              </button>

              {activeDossier.majorMoons && activeDossier.majorMoons.length > 0 && (
                <button
                  type="button"
                  onClick={() => setPlanetSubTab('moons')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    planetSubTab === 'moons'
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Orbit className="w-4 h-4" />
                  <span>
                    {language === 'or' ? `🪐 ଉପଗ୍ରହ ଓ ସାଗର ମଣ୍ଡଳ (${activeDossier.majorMoons.length})` : `🪐 Ocean Worlds (${activeDossier.majorMoons.length})`}
                  </span>
                </button>
              )}
            </div>

            {/* TAB 1: NASA ASTROPHYSICAL PROFILE & 3D VIEWER */}
            {planetSubTab === 'physics' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: 3D WebGL Model & Weight Calculator */}
                  <div className="lg:col-span-5 space-y-4">
                    {/* 3D WebGL Viewer */}
                    <SafeErrorBoundary fallbackTitle={language === 'or' ? '3D ଗ୍ରହ ଦର୍ଶକ' : language === 'hi' ? '3D ग्रह दर्शक' : '3D Planet Viewer'}>
                      <Planet3DViewer
                        planetKey={selectedPlanetKey}
                        name={activeDossier.nameOr}
                        axialTilt={activeDossier.axialTiltDeg}
                        rotationPeriod={activeDossier.dayLength}
                        themeColor={activeDossier.themeColor}
                      />
                    </SafeErrorBoundary>

                    {/* Interactive Weight on this Planet Calculator */}
                    <div className="bg-cosmic-950/90 border border-slate-800 p-4 rounded-2xl space-y-3 shadow-xl">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <Scale className="w-4 h-4 text-cosmic-gold" />
                          {language === 'or' ? 'ଏହି ଗ୍ରହରେ ଆପଣଙ୍କ ଓଜନ କେତେ ହେବ?' : 'Your Weight on this Celestial World:'}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400">
                          g = {activeDossier.surfaceGravityMs2}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <label className="text-slate-400">ପୃଥିବୀରେ ଆପଣଙ୍କ ଓଜନ (Earth Weight):</label>
                          <span className="font-mono font-bold text-white">{userWeight} kg</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min="20"
                            max="150"
                            step="1"
                            value={userWeight}
                            onChange={(e) => setUserWeight(parseFloat(e.target.value))}
                            className="flex-1 accent-cosmic-gold cursor-pointer"
                          />
                          <input
                            type="number"
                            min="5"
                            max="300"
                            value={userWeight}
                            onChange={(e) => setUserWeight(parseFloat(e.target.value) || 1)}
                            className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-center font-mono text-xs text-white outline-none"
                          />
                        </div>
                      </div>

                      {/* Weight Result Banner */}
                      {(() => {
                        const planetWeight = (userWeight * activeDossier.gravityG).toFixed(1);
                        const diffRatio = activeDossier.gravityG;
                        return (
                          <div className="bg-gradient-to-r from-slate-900 via-cosmic-900 to-slate-900 border border-cosmic-gold/30 p-3 rounded-xl flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-slate-400 block">
                                {activeDossier.nameOr} ରେ ଆପଣଙ୍କ ଓଜନ:
                              </span>
                              <span className="text-xl font-extrabold font-mono text-cosmic-gold">
                                {planetWeight} kg
                              </span>
                            </div>
                            <div className="text-right">
                              <span
                                className={`text-[11px] font-bold px-2 py-1 rounded-md ${
                                  diffRatio > 1.2
                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                    : diffRatio < 0.8
                                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                }`}
                              >
                                {diffRatio === 0
                                  ? 'ଭାରହୀନ (0g Zero Gravity)'
                                  : diffRatio > 1
                                  ? `${diffRatio.toFixed(2)}x ଅଧିକ ଭାରୀ`
                                  : `${(1 / (diffRatio || 0.001)).toFixed(2)}x ହାଲୁକା`}
                              </span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Right Column: 8-Metric Scientific Grid & Atmospheric Stack Bar */}
                  <div className="lg:col-span-7 space-y-4">
                    {/* 100% Real NASA JPL & Surya Siddhanta Verification Badge */}
                    <div className="bg-gradient-to-r from-cyan-950/40 via-cosmic-950/80 to-blue-950/40 border border-cyan-500/30 px-3.5 py-2 rounded-xl flex items-center justify-between text-[11px] font-mono">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span className="text-emerald-300 font-bold">୧୦୦% ପ୍ରମାଣିତ ପ୍ରକୃତ ତଥ୍ୟ (100% Verified Real Data)</span>
                      </div>
                      <span className="text-slate-400 hidden sm:inline text-[10px]">
                        NASA JPL Planetary Factsheet • IAU 2015 Standards
                      </span>
                    </div>

                    {/* 8-Grid Scientific NASA Values (No Ellipsis, Full Precision) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                      <div className="bg-cosmic-950/80 p-3 rounded-xl border border-slate-800/80 space-y-1 hover:border-cyan-500/30 transition-all">
                        <span className="text-slate-400 block text-[10px]">ସୂର୍ଯ୍ୟଙ୍କ ଠାରୁ ଦୂରତା:</span>
                        <span className="font-bold text-white font-mono block text-xs leading-snug">{activeDossier.semiMajorAxisKm}</span>
                        <span className="text-[10px] text-amber-300 font-mono block">{activeDossier.semiMajorAxisAU}</span>
                      </div>

                      <div className="bg-cosmic-950/80 p-3 rounded-xl border border-slate-800/80 space-y-1 hover:border-cyan-500/30 transition-all">
                        <span className="text-slate-400 block text-[10px]">ବ୍ୟାସ (Diameter):</span>
                        <span className="font-bold text-white font-mono block text-xs leading-snug">{activeDossier.equatorialDiameterKm}</span>
                        <span className="text-[10px] text-slate-400 font-mono block">Polar: {activeDossier.polarDiameterKm || 'N/A'}</span>
                      </div>

                      <div className="bg-cosmic-950/80 p-3 rounded-xl border border-slate-800/80 space-y-1 hover:border-cyan-500/30 transition-all">
                        <span className="text-slate-400 block text-[10px]">ପ୍ରକୃତ ବସ୍ତୁତ୍ୱ (Mass):</span>
                        <span className="font-bold text-cyan-300 font-mono block text-xs leading-snug">{activeDossier.massKg}</span>
                        <span className="text-[10px] text-slate-400 font-mono block">{activeDossier.massEarthRel}</span>
                      </div>

                      <div className="bg-cosmic-950/80 p-3 rounded-xl border border-slate-800/80 space-y-1 hover:border-cyan-500/30 transition-all">
                        <span className="text-slate-400 block text-[10px]">ପଳାୟନ ବେଗ (v_esc):</span>
                        <span className="font-bold text-emerald-400 font-mono block text-xs leading-snug">{activeDossier.escapeVelocityKms}</span>
                        <span className="text-[10px] text-slate-400 font-mono block">Gravity: {activeDossier.surfaceGravityMs2}</span>
                      </div>

                      <div className="bg-cosmic-950/80 p-3 rounded-xl border border-slate-800/80 space-y-1 hover:border-cyan-500/30 transition-all">
                        <span className="text-slate-400 block text-[10px]">କକ୍ଷୀୟ ସମୟ (Year):</span>
                        <span className="font-bold text-cosmic-gold font-mono block text-xs leading-snug">{activeDossier.orbitalPeriodYears}</span>
                        <span className="text-[10px] text-slate-400 font-mono block">{activeDossier.orbitalPeriodDays}</span>
                      </div>

                      <div className="bg-cosmic-950/80 p-3 rounded-xl border border-slate-800/80 space-y-1 hover:border-cyan-500/30 transition-all">
                        <span className="text-slate-400 block text-[10px]">ଦିନର ଅବଧି (Day):</span>
                        <span className="font-bold text-yellow-300 font-mono block text-xs leading-snug">{activeDossier.dayLength}</span>
                        <span className="text-[10px] text-slate-400 font-mono block">Speed: {activeDossier.meanOrbitalSpeedKms}</span>
                      </div>

                      <div className="bg-cosmic-950/80 p-3 rounded-xl border border-slate-800/80 space-y-1 hover:border-cyan-500/30 transition-all">
                        <span className="text-slate-400 block text-[10px]">ହାରାହାରି ତାପମାତ୍ରା:</span>
                        <span className="font-bold text-rose-400 font-mono block text-xs leading-snug">{activeDossier.surfaceTempC}</span>
                        <span className="text-[10px] text-slate-400 font-mono block">Density: {activeDossier.meanDensityGcm3}</span>
                      </div>

                      <div className="bg-cosmic-950/80 p-3 rounded-xl border border-slate-800/80 space-y-1 hover:border-cyan-500/30 transition-all">
                        <span className="text-slate-400 block text-[10px]">ଅକ୍ଷୀୟ ଢଳାଣ (Tilt):</span>
                        <span className="font-bold text-violet-300 font-mono block text-xs leading-snug">{activeDossier.axialTiltDeg}</span>
                        <span className="text-[10px] text-slate-400 font-mono block">e = {activeDossier.eccentricity}</span>
                      </div>
                    </div>

                    {/* Atmospheric Composition Stack Bar */}
                    <div className="bg-cosmic-950/85 border border-slate-800 p-4 rounded-2xl space-y-3 shadow-xl">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <Layers className="w-4 h-4 text-cyan-400" />
                          ବାୟୁମଣ୍ଡଳୀୟ ରାସାୟନିକ ଅନୁପାତ (Atmospheric Composition Breakdown):
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {activeDossier.surfacePressureBar || '1 bar level'}
                        </span>
                      </div>

                      {/* Visual Stacked Bar */}
                      <div className="h-4 w-full bg-slate-900 rounded-full overflow-hidden flex border border-slate-700/60 shadow-inner">
                        {activeDossier.atmosphereBreakdown.map((gas, idx) => {
                          const colors = [
                            'bg-sky-500',
                            'bg-amber-400',
                            'bg-emerald-400',
                            'bg-rose-400',
                            'bg-purple-400',
                            'bg-teal-400'
                          ];
                          return (
                            <div
                              key={gas.gas}
                              style={{ width: `${Math.max(gas.percentage, 2)}%` }}
                              className={`${colors[idx % colors.length]} h-full transition-all`}
                              title={`${gas.gas} (${gas.formula}): ${gas.percentage}%`}
                            />
                          );
                        })}
                      </div>

                      {/* Gas Badges */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {activeDossier.atmosphereBreakdown.map((gas, idx) => {
                          const dotColors = [
                            'bg-sky-500',
                            'bg-amber-400',
                            'bg-emerald-400',
                            'bg-rose-400',
                            'bg-purple-400',
                            'bg-teal-400'
                          ];
                          return (
                            <div
                              key={gas.gas}
                              className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-lg text-[11px] font-mono"
                            >
                              <span className={`w-2 h-2 rounded-full ${dotColors[idx % dotColors.length]}`} />
                              <span className="text-slate-300">{gas.gas} ({gas.formula}):</span>
                              <span className="font-bold text-white">{gas.percentage}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Astrophysical Deep Narrative */}
                    <div className="bg-sky-950/30 border border-sky-500/30 p-4 rounded-2xl text-xs space-y-2">
                      <span className="text-sky-300 font-bold flex items-center gap-1.5 text-xs">
                        <Globe2 className="w-4 h-4 text-sky-400" />
                        ନାସା ମହାକାଶ ପଦାର୍ଥ ବିଜ୍ଞାନ ଗବେଷଣା ବିବରଣୀ (NASA Scientific Insight):
                      </span>
                      <p className="text-slate-200 leading-relaxed text-[11px]">
                        {language === 'or' ? activeDossier.astrophysicalNarrativeOr : activeDossier.astrophysicalNarrativeEn}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: VEDIC ASTROLOGICAL HERITAGE & SURYA SIDDHANTA */}
            {planetSubTab === 'vedic' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Sacred Mantra & Remedial Upayas */}
                  <div className="lg:col-span-6 space-y-4">
                    {/* Sacred Beeja Mantra Card */}
                    <div className="bg-gradient-to-br from-amber-950/60 via-cosmic-950 to-amber-950/40 border-2 border-cosmic-gold/40 p-5 rounded-2xl shadow-xl space-y-3">
                      <div className="flex items-center justify-between border-b border-cosmic-gold/20 pb-2">
                        <span className="text-[11px] font-bold text-cosmic-gold uppercase tracking-widest flex items-center gap-1.5 font-mono">
                          <Sparkles className="w-4 h-4 text-cosmic-saffron" />
                          ପବିତ୍ର ବୀଜ ମନ୍ତ୍ର (Sacred Beeja Mantra)
                        </span>

                        <button
                          type="button"
                          onClick={() => handleCopyMantra(activeDossier.vedic.beejaMantra)}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-cosmic-900 border border-cosmic-gold/40 text-cosmic-gold hover:bg-cosmic-gold hover:text-cosmic-950 flex items-center gap-1 cursor-pointer transition-all"
                        >
                          {copiedMantra ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedMantra ? 'କପି ହେଲା!' : 'କପି କରନ୍ତୁ'}</span>
                        </button>
                      </div>

                      <div className="bg-cosmic-950/90 border border-cosmic-gold/30 p-4 rounded-xl text-center space-y-1.5">
                        <span className="text-base sm:text-lg font-extrabold text-cosmic-gold font-serif block tracking-wider">
                          {activeDossier.vedic.beejaMantra}
                        </span>
                        <span className="text-[11px] text-yellow-200/80 font-serif italic block">
                          {activeDossier.vedic.gayatriMantra}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        <strong className="text-cosmic-gold">ଫଳାଫଳ (Significance): </strong>
                        {activeDossier.vedic.karakatwaOr}
                      </p>
                    </div>

                    {/* Remedial Upayas & Charity */}
                    <div className="bg-cosmic-950/80 border border-slate-800 p-5 rounded-2xl space-y-2.5">
                      <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-amber-400" />
                        ବୈଦିକ ଶୁଭ ଉପାୟ, ଦାନ ଓ ପ୍ରତିକାର (Remedial Measures & Upayas):
                      </span>
                      <p className="text-xs text-slate-200 leading-relaxed bg-cosmic-900/70 p-3 rounded-xl border border-slate-800">
                        {activeDossier.vedic.charitableUpayasOr}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Astrological Dignities & Surya Siddhanta */}
                  <div className="lg:col-span-6 space-y-4">
                    {/* Astrological Attributes Grid */}
                    <div className="bg-cosmic-900/60 p-5 rounded-2xl border border-cosmic-gold/25 space-y-3 text-xs">
                      <div className="flex items-center justify-between border-b border-cosmic-gold/20 pb-2">
                        <h4 className="text-sm font-bold text-cosmic-gold font-serif">
                          ଜ୍ୟୋତିଷୀୟ ସ୍ଥିତି ଓ ଶକ୍ତି ମାତୃକା (Astrological Dignities)
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400">
                          ମହାଦଶା: {activeDossier.vedic.vimshottariYears} ବର୍ଷ
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-cosmic-950/70 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">ଉପାସ୍ୟ ଦେବତା:</span>
                          <span className="font-bold text-slate-100">{activeDossier.vedic.rulingDeity}</span>
                        </div>

                        <div className="bg-cosmic-950/70 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">ଶୁଭ ରତ୍ନ (Gemstone):</span>
                          <span className="font-bold text-emerald-400">{activeDossier.vedic.gemstone}</span>
                        </div>

                        <div className="bg-cosmic-950/70 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">ପବିତ୍ର ଧାତୁ (Metal):</span>
                          <span className="font-bold text-amber-300">{activeDossier.vedic.metal}</span>
                        </div>

                        <div className="bg-cosmic-950/70 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">ପଞ୍ଚ ମହାଭୂତ ତତ୍ତ୍ୱ:</span>
                          <span className="font-bold text-cyan-300">{activeDossier.vedic.element}</span>
                        </div>

                        <div className="bg-cosmic-950/70 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">ସ୍ୱ-କ୍ଷେତ୍ର (Own Signs):</span>
                          <span className="font-bold text-slate-100">{activeDossier.vedic.ownSigns}</span>
                        </div>

                        <div className="bg-cosmic-950/70 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">ବିଶେଷ ଦୃଷ୍ଟି (Aspects):</span>
                          <span className="font-bold text-rose-300">{activeDossier.vedic.specialAspects}</span>
                        </div>

                        <div className="bg-cosmic-950/70 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">ପରମ ଉଚ୍ଚ (Exaltation):</span>
                          <span className="font-bold text-emerald-400">{activeDossier.vedic.exaltationSign}</span>
                        </div>

                        <div className="bg-cosmic-950/70 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">ପରମ ନୀଚ (Debilitation):</span>
                          <span className="font-bold text-rose-400">{activeDossier.vedic.debilitationSign}</span>
                        </div>
                      </div>

                      {/* Planetary Friendship Matrix */}
                      <div className="bg-cosmic-950/80 p-3 rounded-xl border border-slate-800 text-[11px] space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-emerald-400 font-bold">ମିତ୍ର ଗ୍ରହ:</span>
                          <span className="text-slate-200">{activeDossier.vedic.friendPlanets}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-rose-400 font-bold">ଶତ୍ରୁ ଗ୍ରହ:</span>
                          <span className="text-slate-200">{activeDossier.vedic.enemyPlanets}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-bold">ସମ ଗ୍ରହ:</span>
                          <span className="text-slate-200">{activeDossier.vedic.neutralPlanets}</span>
                        </div>
                      </div>

                      {/* Surya Siddhanta Astronomical Constants */}
                      <div className="bg-amber-950/30 border border-amber-500/30 p-3.5 rounded-xl space-y-1">
                        <span className="text-amber-300 font-bold block text-[11px] font-mono">
                          ସୂର୍ଯ୍ୟ ସିଦ୍ଧାନ୍ତ ପ୍ରାଚୀନ ଖଗୋଳ ଗଣନା (Surya Siddhanta Astronomical Constants):
                        </span>
                        <div className="flex items-center justify-between text-[11px] text-slate-300">
                          <span>ମହାଯୁଗ ପରିଭ୍ରମଣ:</span>
                          <span className="font-mono text-cosmic-gold">{activeDossier.vedic.suryaSiddhantaMotion}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-300">
                          <span>ଗ୍ରହ ବ୍ୟାସ (ଯୋଜନ):</span>
                          <span className="font-mono text-cyan-300">{activeDossier.vedic.suryaSiddhantaDiameterYojanas}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SPACE EXPLORATION MISSIONS TIMELINE */}
            {planetSubTab === 'missions' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="text-xs text-slate-300 flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Rocket className="w-4 h-4 text-emerald-400" />
                    {activeDossier.nameOr} ଅନ୍ୱେଷଣରେ ଐତିହାସିକ ମହାକାଶ ଅଭିଯାନ
                  </span>
                  <span className="font-mono text-slate-400">Total: {activeDossier.spaceMissions.length} Historic Missions</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeDossier.spaceMissions.map((m) => (
                    <div
                      key={m.name}
                      className="bg-cosmic-950/80 border border-slate-800 p-4 rounded-2xl space-y-2 hover:border-cosmic-gold/40 transition-all shadow-lg"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {m.agency}
                        </span>
                        <span className="text-[10px] font-mono text-amber-300 font-bold">{m.year}</span>
                      </div>

                      <h4 className="text-sm font-bold text-white">{m.name}</h4>
                      <span className="text-[10px] font-mono text-slate-400 block">{m.type}</span>

                      <p className="text-[11px] text-slate-300 leading-relaxed border-t border-slate-800/80 pt-2">
                        {language === 'or' ? m.discoveryOr : m.discoveryEn}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: MAJOR MOONS & OCEAN WORLDS */}
            {planetSubTab === 'moons' && activeDossier.majorMoons && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="text-xs text-slate-300 flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Orbit className="w-4 h-4 text-purple-400" />
                    {activeDossier.nameOr} ର ପ୍ରମୁଖ ଉପଗ୍ରହ ଓ ମହାସାଗର ମଣ୍ଡଳ
                  </span>
                  <span className="font-mono text-purple-300">{activeDossier.knownMoonsCount} Total Known Moons</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeDossier.majorMoons.map((moon) => (
                    <div
                      key={moon.name}
                      className="bg-cosmic-950/80 border border-purple-500/30 p-4 rounded-2xl space-y-2.5 shadow-xl hover:border-purple-500/60 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-purple-400" />
                          <span>{moon.name}</span>
                        </h4>
                        <span className="text-[10px] font-mono text-cyan-300 font-bold">Ø {moon.diameterKm}</span>
                      </div>

                      <div className="text-[10px] font-mono text-slate-400">
                        କକ୍ଷପଥ ଦୂରତା (Orbital Radius): <span className="text-white font-bold">{moon.distKm}</span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                        {language === 'or' ? moon.featureOr : moon.featureEn}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}


      {/* SECTION 3: ISRO & NASA SPACE MISSIONS EXPLORATION HUB */}
      {activeSection === 'missions' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Mission Category Filter Bar & Scrolling Mission Selector */}
          <div className="space-y-3 bg-cosmic-950/80 border border-slate-800/80 p-3.5 rounded-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Rocket className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-slate-200">
                  {language === 'or' ? 'ମହାକାଶ ଅଭିଯାନ ଚୟନ କରନ୍ତୁ (ISRO & NASA Missions):' : 'Select Historic Space Exploration Mission:'}
                </span>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-medium">
                {[
                  { id: 'all', labelOr: 'ସମସ୍ତ (6)', labelEn: 'All Missions (6)' },
                  { id: 'isro', labelOr: '🇮🇳 ISRO ଭାରତ', labelEn: 'ISRO India' },
                  { id: 'nasa', labelOr: '🇺🇸 NASA ଆମେରିକା', labelEn: 'NASA / Global' },
                  { id: 'moon', labelOr: '🌙 ଚନ୍ଦ୍ର', labelEn: 'Lunar' },
                  { id: 'mars', labelOr: '♂ ମଙ୍ଗଳ', labelEn: 'Mars' },
                  { id: 'deepspace', labelOr: '🔭 ଗଭୀର ମହାକାଶ', labelEn: 'Deep Space' }
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setMissionFilter(f.id as any)}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      missionFilter === f.id
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-cosmic-950 font-bold shadow-md'
                        : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {language === 'or' ? f.labelOr : f.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrolling Missions Chips with Navigation Arrows */}
            <div className="relative flex items-center group">
              <button
                type="button"
                onClick={() => scrollMissionChips('left')}
                className="absolute -left-2 z-10 w-7 h-7 rounded-full bg-cosmic-900/90 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-cosmic-950 flex items-center justify-center shadow-lg transition-all cursor-pointer opacity-80 hover:opacity-100"
                title="Scroll Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div
                ref={missionChipsRef}
                className="flex items-center gap-2.5 overflow-x-auto scroll-smooth no-scrollbar py-1 px-4 w-full"
              >
                {filteredMissions.map((m) => {
                  const isSelected = selectedMissionId === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMissionId(m.id)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border flex-shrink-0 shadow-md ${
                        isSelected
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-cosmic-950 border-white shadow-xl shadow-emerald-500/25 scale-[1.02]'
                          : 'bg-cosmic-950/80 text-slate-300 border-slate-800 hover:border-emerald-500/50 hover:text-emerald-300'
                      }`}
                    >
                      <span className="text-base">{m.icon}</span>
                      <span>{m.nameOr}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                          isSelected ? 'bg-cosmic-950/20 text-cosmic-950' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {m.agency}
                      </span>
                      <span
                        className={`text-[8px] px-1.5 py-0.5 rounded-full font-mono ${
                          m.status === 'Operational / Active'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : m.status === 'Upcoming'
                            ? 'bg-amber-500/20 text-amber-300'
                            : m.status === 'En Route'
                            ? 'bg-sky-500/20 text-sky-300'
                            : 'bg-slate-700/50 text-slate-300'
                        }`}
                      >
                        {m.status.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => scrollMissionChips('right')}
                className="absolute -right-2 z-10 w-7 h-7 rounded-full bg-cosmic-900/90 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-cosmic-950 flex items-center justify-center shadow-lg transition-all cursor-pointer opacity-80 hover:opacity-100"
                title="Scroll Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Mission Grand Dashboard */}
          <div
            className={`bg-gradient-to-b ${activeMission.gradientBg} border-2 border-emerald-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-2xl space-y-6 transition-all duration-300`}
          >
            {/* Mission Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-widest font-mono px-2.5 py-1 rounded-full border ${activeMission.badgeBg}`}>
                    {activeMission.agency} Flagship Exploration
                  </span>

                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-700 text-slate-300">
                    Target: <strong className="text-white">{activeMission.target}</strong>
                  </span>

                  <span
                    className={`text-[10px] font-mono px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                      activeMission.status === 'Operational / Active'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : activeMission.status === 'En Route'
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                        : activeMission.status === 'Upcoming'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                    <span>{activeMission.status}</span>
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3 font-serif">
                  <span className="text-3xl sm:text-4xl">{activeMission.icon}</span>
                  <span>{activeMission.nameOr}</span>
                </h3>

                <p className="text-xs text-slate-300 font-mono">
                  {activeMission.nameEn}
                </p>
              </div>

              {/* Quick Key Mission Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="bg-cosmic-950/80 border border-slate-800 px-3 py-1.5 rounded-xl text-center">
                  <span className="text-[9px] text-slate-400 block font-mono">Launch Vehicle</span>
                  <span className="text-xs font-bold text-amber-300 font-mono">{activeMission.launchVehicle.split(' ')[0]}</span>
                </div>
                <div className="bg-cosmic-950/80 border border-slate-800 px-3 py-1.5 rounded-xl text-center">
                  <span className="text-[9px] text-slate-400 block font-mono">Earth Distance</span>
                  <span className="text-xs font-bold text-cyan-300 font-mono">{activeMission.distanceFromEarth.split(' ')[0]}</span>
                </div>
                <div className="bg-cosmic-950/80 border border-slate-800 px-3 py-1.5 rounded-xl text-center">
                  <span className="text-[9px] text-slate-400 block font-mono">Signal Delay</span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">{activeMission.signalDelay}</span>
                </div>
                <div className="bg-cosmic-950/80 border border-slate-800 px-3 py-1.5 rounded-xl text-center">
                  <span className="text-[9px] text-slate-400 block font-mono">Budget</span>
                  <span className="text-xs font-bold text-violet-300 font-mono">{activeMission.costINR || activeMission.costUSD}</span>
                </div>
              </div>
            </div>

            {/* Sub-Navigation Tabs within Active Mission */}
            <div className="flex flex-wrap items-center gap-2 bg-cosmic-950/90 border border-slate-800 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => setMissionSubTab('overview')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  missionSubTab === 'overview'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-cosmic-950 shadow-lg shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Radio className="w-4 h-4" />
                <span>{language === 'or' ? '🛰️ 3D କକ୍ଷପଥ ଓ ଫ୍ଲାଇଟ୍ ସିମୁଲେସନ୍' : '🛰️ 3D Orbit Flight Simulation'}</span>
              </button>

              <button
                type="button"
                onClick={() => setMissionSubTab('payloads')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  missionSubTab === 'payloads'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Microscope className="w-4 h-4" />
                <span>
                  {language === 'or' ? `🔬 ବୈଜ୍ଞାନିକ ପେଲୋଡ୍ସ (${activeMission.payloads.length})` : `🔬 Scientific Payloads (${activeMission.payloads.length})`}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setMissionSubTab('timeline')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  missionSubTab === 'timeline'
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-cosmic-950 shadow-lg shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>
                  {language === 'or' ? `📅 ଉଡ଼ାଣ ଟାଇମଲାଇନ୍ (${activeMission.timeline.length})` : `📅 Flight Milestones (${activeMission.timeline.length})`}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setMissionSubTab('specs')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  missionSubTab === 'specs'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Gauge className="w-4 h-4" />
                <span>{language === 'or' ? '📋 ଟେକ୍ନିକାଲ୍ ସ୍ପେକ୍ସ ଓ ଆବିଷ୍କାର' : '📋 Technical Specs & Science'}</span>
              </button>
            </div>

            {/* SUBTAB 1: 3D FLIGHT SIMULATION & OVERVIEW */}
            {missionSubTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: 3D Mission Orbit Viewer */}
                  <div className="lg:col-span-6 space-y-4">
                    <SafeErrorBoundary fallbackTitle={language === 'or' ? 'ମିଶନ ଫ୍ଲାଇଟ ସିମୁଲେଟର' : language === 'hi' ? 'मिशन फ्लाइट सिम्युलेटर' : 'Mission Flight Simulator'}>
                      <Mission3DViewer
                        missionId={activeMission.id}
                        missionName={activeMission.nameOr}
                        target={activeMission.target}
                        distanceFromEarth={activeMission.distanceFromEarth}
                        signalDelay={activeMission.signalDelay}
                        themeColor={activeMission.themeColor}
                      />
                    </SafeErrorBoundary>

                    {/* Launch Vehicle & Spacecraft Hardware Specs */}
                    <div className="grid grid-cols-2 gap-3 bg-cosmic-950/80 border border-slate-800 p-4 rounded-2xl text-xs">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-400 block">ଉତକ୍ଷେପଣ ରକେଟ୍ (Launch Vehicle):</span>
                        <span className="font-bold text-amber-300 font-mono text-sm">{activeMission.launchVehicle}</span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-400 block">ଉତକ୍ଷେପଣ ସ୍ଥାନ (Launch Site):</span>
                        <span className="font-bold text-slate-100 text-xs">{activeMission.launchSite}</span>
                      </div>
                      <div className="space-y-0.5 pt-2 border-t border-slate-800">
                        <span className="text-[10px] text-slate-400 block">ମହାକାଶଯାନ ଓଜନ (Mass):</span>
                        <span className="font-bold text-cyan-300 font-mono">{activeMission.specs.spacecraftMassKg}</span>
                      </div>
                      <div className="space-y-0.5 pt-2 border-t border-slate-800">
                        <span className="text-[10px] text-slate-400 block">ଶକ୍ତି ଉତ୍ପାଦନ (Power Output):</span>
                        <span className="font-bold text-emerald-400 font-mono">{activeMission.specs.powerOutputWatts}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Mission Headline & Scientific Narrative */}
                  <div className="lg:col-span-6 space-y-4">
                    {/* Headline Banner */}
                    <div className="bg-gradient-to-r from-emerald-950/40 via-cosmic-950/80 to-teal-950/40 border border-emerald-500/30 p-4 rounded-2xl space-y-1.5 shadow-xl">
                      <span className="text-[11px] font-bold text-emerald-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-emerald-400" />
                        ମୁଖ୍ୟ ଐତିହାସିକ ସଫଳତା (Key Historic Milestone):
                      </span>
                      <h4 className="text-base font-bold text-white font-serif leading-snug">
                        {language === 'or' ? activeMission.headlineOr : activeMission.headlineEn}
                      </h4>
                    </div>

                    {/* Detailed Summary Narrative */}
                    <div className="bg-cosmic-950/80 border border-slate-800 p-4 rounded-2xl space-y-3 shadow-xl text-xs">
                      <span className="text-cosmic-gold font-bold flex items-center gap-1.5 text-xs">
                        <BookOpen className="w-4 h-4" />
                        ଅଭିଯାନ ସମ୍ପୂର୍ଣ୍ଣ ବିବରଣୀ (Mission Comprehensive Narrative):
                      </span>
                      <p className="text-slate-200 leading-relaxed text-xs">
                        {language === 'or' ? activeMission.summaryOr : activeMission.summaryEn}
                      </p>
                    </div>

                    {/* Orbit and Trajectory Highlights */}
                    <div className="bg-sky-950/30 border border-sky-500/30 p-4 rounded-2xl space-y-2 text-xs">
                      <span className="text-sky-300 font-bold flex items-center gap-1.5 text-xs">
                        <Orbit className="w-4 h-4" />
                        କକ୍ଷପଥ ଜ୍ୟାମିତି (Orbit & Trajectory Profile):
                      </span>
                      <p className="text-slate-300 font-mono text-[11px] leading-relaxed">
                        {activeMission.orbitType}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB 2: SCIENTIFIC PAYLOADS */}
            {missionSubTab === 'payloads' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="text-xs text-slate-300 flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Microscope className="w-4 h-4 text-cyan-400" />
                    {activeMission.nameOr} ରେ ଥିବା ବୈଜ୍ଞାନିକ ଯନ୍ତ୍ରପାତି (Scientific Instruments)
                  </span>
                  <span className="font-mono text-cyan-300">Total: {activeMission.payloads.length} Advanced Instruments</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeMission.payloads.map((p) => (
                    <div
                      key={p.name}
                      className="bg-cosmic-950/80 border border-slate-800 p-4 rounded-2xl space-y-2 hover:border-cyan-500/40 transition-all shadow-xl"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-cyan-300 font-mono px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                          {p.name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">Calibrated Payload</span>
                      </div>

                      <h4 className="text-xs font-bold text-white font-serif">{p.fullName}</h4>

                      <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                        {language === 'or' ? p.objectiveOr : p.objectiveEn}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUBTAB 3: FLIGHT MILESTONES TIMELINE */}
            {missionSubTab === 'timeline' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="text-xs text-slate-300 flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-400" />
                    ମହାକାଶ ଅଭିଯାନର ଐତିହାସିକ ଉଡ଼ାଣ ଟାଇମଲାଇନ୍
                  </span>
                  <span className="font-mono text-amber-300">{activeMission.timeline.length} Key Flight Steps</span>
                </div>

                <div className="relative border-l-2 border-amber-500/40 ml-4 space-y-6 py-2">
                  {activeMission.timeline.map((item, idx) => (
                    <div key={item.date} className="relative pl-6 space-y-1 group">
                      {/* Timeline Dot */}
                      <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-cosmic-950 border-2 border-amber-400 flex items-center justify-center group-hover:scale-125 transition-all">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      </span>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          {item.date}
                        </span>
                      </div>

                      <p className="text-xs text-slate-200 leading-relaxed font-medium">
                        {language === 'or' ? item.eventOr : item.eventEn}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUBTAB 4: TECHNICAL SPECS & SCIENCE */}
            {missionSubTab === 'specs' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-cosmic-950/80 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-xl">
                    <span className="text-xs font-bold text-purple-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Gauge className="w-4 h-4 text-purple-400" />
                      ମହାକାଶଯାନ ଇଞ୍ଜିନିୟରିଂ ସ୍ପେସିଫିକେସନ୍ (Spacecraft Hardware)
                    </span>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                        <span className="text-slate-400">ମୋଟ ବସ୍ତୁତ୍ୱ (Total Mass):</span>
                        <span className="font-bold text-white font-mono">{activeMission.specs.spacecraftMassKg}</span>
                      </div>
                      <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                        <span className="text-slate-400">ବିଦ୍ୟୁତ୍ ଶକ୍ତି (Power System):</span>
                        <span className="font-bold text-emerald-400 font-mono">{activeMission.specs.powerOutputWatts}</span>
                      </div>
                      <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                        <span className="text-slate-400">ମିଶନ୍ ଅବଧି (Mission Lifetime):</span>
                        <span className="font-bold text-amber-300 font-mono">{activeMission.specs.missionDuration}</span>
                      </div>
                      <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                        <span className="text-slate-400">ରେଡିଓ ସିଗ୍ନାଲ୍ ସମୟ (Light Travel):</span>
                        <span className="font-bold text-cyan-300 font-mono">{activeMission.signalDelay}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-cosmic-950/80 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-xl">
                    <span className="text-xs font-bold text-cosmic-gold uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-cosmic-saffron" />
                      ପ୍ରମୁଖ ବୈଜ୍ଞାନିକ ଆବିଷ୍କାର (Key Scientific Discoveries)
                    </span>

                    <div className="bg-cosmic-900/80 border border-cosmic-gold/30 p-4 rounded-xl text-xs text-slate-200 leading-relaxed">
                      {language === 'or' ? activeMission.specs.primaryDiscoveryOr : activeMission.specs.primaryDiscoveryEn}
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2">
                      <span>Agency: <strong className="text-white">{activeMission.agency}</strong></span>
                      <span>Target: <strong className="text-white">{activeMission.target}</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}


      {/* SECTION 4: ASTROPHYSICS LABORATORY & SCIENTIFIC RESEARCH HUB */}
      {activeSection === 'astrophysics' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-cyan-950/60 via-cosmic-950/80 to-blue-950/60 border border-cyan-500/30 p-5 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                <Microscope className="w-4 h-4 text-cyan-400" />
                NASA JPL & Vedic Science Research Engine
              </span>
              <h3 className="text-xl font-bold text-white font-serif">
                {language === 'or' ? 'ମହାକାଶ ପଦାର୍ଥ ବିଜ୍ଞାନ ଲାବୋରେଟୋରୀ (Astrophysics Lab)' : 'Astrophysics & Orbital Mechanics Laboratory'}
              </h3>
              <p className="text-xs text-slate-300">
                କେପଲରଙ୍କ ନିୟମ, ନ୍ୟୁଟନୀୟ ମାଧ୍ୟାକର୍ଷଣ, ପଳାୟନ ବେଗ (Escape Velocity) ଏବଂ ପ୍ରାଚୀନ ଭାରତୀୟ ଖଗୋଳ ବିଜ୍ଞାନର ତୁଳନାତ୍ମକ ବିଶ୍ଳେଷଣ।
              </p>
            </div>
            <div className="flex items-center gap-2 bg-cosmic-900/80 border border-slate-700 px-3 py-2 rounded-xl text-xs font-mono text-cyan-300">
              <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>G = 6.67430 × 10⁻¹¹ m³ kg⁻¹ s⁻²</span>
            </div>
          </div>

          {/* Interactive Calculator 1: Kepler's 3rd Law */}
          <div className="bg-cosmic-950/80 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-cosmic-gold" />
                  <span>କେପଲରଙ୍କ ତୃତୀୟ ନିୟମ ଗଣକ (Kepler’s 3rd Law Harmonic Calculator)</span>
                </h4>
                <p className="text-xs text-slate-400">
                  ସୂର୍ଯ୍ୟଙ୍କ ଚାରିପାଖରେ କକ୍ଷୀୟ ପରିଭ୍ରମଣ କାଳ: <span className="font-mono text-cosmic-gold">T² = a³</span>
                </p>
              </div>
              <div className="text-xs font-mono text-slate-400 bg-cosmic-900 px-3 py-1 rounded-lg border border-slate-800">
                Formula: T (years) = a^(1.5)
              </div>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-bold">ତ୍ୱରିତ ପରୀକ୍ଷଣ:</span>
              {[
                { name: 'Mercury', au: 0.387 },
                { name: 'Venus', au: 0.723 },
                { name: 'Earth', au: 1.000 },
                { name: 'Mars', au: 1.524 },
                { name: 'Jupiter', au: 5.204 },
                { name: 'Saturn', au: 9.582 },
                { name: 'Uranus', au: 19.20 },
                { name: 'Neptune', au: 30.05 },
                { name: 'Halley Comet', au: 17.8 }
              ].map(item => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setKeplerAU(item.au)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer border ${
                    keplerAU === item.au
                      ? 'bg-cosmic-gold text-cosmic-950 font-bold border-white'
                      : 'bg-cosmic-900 text-slate-300 border-slate-800 hover:border-slate-600'
                  }`}
                >
                  {item.name} ({item.au} AU)
                </button>
              ))}
            </div>

            {/* Input Slider & Direct Field */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-2">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">
                  କକ୍ଷପଥର ଅର୍ଦ୍ଧ-ଦୀର୍ଘ ଅକ୍ଷ (Semi-Major Axis, a in AU):
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0.1"
                    max="35"
                    step="0.05"
                    value={keplerAU}
                    onChange={(e) => setKeplerAU(parseFloat(e.target.value))}
                    className="flex-1 accent-cosmic-gold cursor-pointer"
                  />
                  <input
                    type="number"
                    min="0.01"
                    max="100"
                    step="0.01"
                    value={keplerAU}
                    onChange={(e) => setKeplerAU(parseFloat(e.target.value) || 0.1)}
                    className="w-24 bg-cosmic-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-100 font-mono text-sm outline-none"
                  />
                </div>
              </div>

              {/* Dynamic Kepler Output Display */}
              {(() => {
                const rawA = Number(keplerAU);
                const a = Number.isFinite(rawA) && rawA > 0.0001 ? rawA : 1.0;
                const periodYears = Math.pow(a, 1.5);
                const periodDays = periodYears * 365.256363;
                const orbVelocity = 29.78 / Math.sqrt(a);
                return (
                  <div className="grid grid-cols-3 gap-3 bg-cosmic-900/80 p-4 rounded-xl border border-slate-800 text-center font-mono">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Orbital Period:</span>
                      <span className="text-base font-bold text-cosmic-gold">
                        {periodYears < 0.1 ? periodYears.toFixed(3) : periodYears.toFixed(2)} Yrs
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Earth Days:</span>
                      <span className="text-base font-bold text-cyan-300">{periodDays.toFixed(1)} Days</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Orbital Speed:</span>
                      <span className="text-base font-bold text-emerald-400">{orbVelocity.toFixed(2)} km/s</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Interactive Calculator 2: Surface Gravity (g) & Escape Velocity (v_esc) */}
          <div className="bg-cosmic-950/80 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-emerald-400" />
                  <span>ମାଧ୍ୟାକର୍ଷଣ ଓ ପଳାୟନ ବେଗ ଗଣକ (Surface Gravity & Escape Velocity Calculator)</span>
                </h4>
                <p className="text-xs text-slate-400">
                  ନ୍ୟୁଟନ୍ ମାଧ୍ୟାକର୍ଷଣ ସୂତ୍ର: <span className="font-mono text-emerald-400">g = GM/R²</span>, <span className="font-mono text-cyan-400">v_esc = √(2GM/R)</span>
                </p>
              </div>
              <div className="text-xs font-mono text-slate-400 bg-cosmic-900 px-3 py-1 rounded-lg border border-slate-800">
                Earth Normalized: M⊕ = 1, R⊕ = 1
              </div>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-bold">ଜଣାଶୁଣା ଗ୍ରହ ପ୍ରିସେଟ୍:</span>
              {[
                { name: 'Mercury', m: 0.055, r: 0.383 },
                { name: 'Venus', m: 0.815, r: 0.949 },
                { name: 'Earth', m: 1.000, r: 1.000 },
                { name: 'Moon', m: 0.0123, r: 0.2724 },
                { name: 'Mars', m: 0.107, r: 0.532 },
                { name: 'Jupiter', m: 317.8, r: 11.21 },
                { name: 'Saturn', m: 95.2, r: 9.45 },
                { name: 'Sun', m: 333000, r: 109.2 }
              ].map(item => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => {
                    setCalcMass(item.m);
                    setCalcRadius(item.r);
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono bg-cosmic-900 text-slate-300 border border-slate-800 hover:border-slate-600 cursor-pointer"
                >
                  {item.name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-2">
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-bold">ଗ୍ରହର ବସ୍ତୁତ୍ୱ (Mass, M/M⊕):</span>
                    <span className="font-mono text-cosmic-gold font-bold">{calcMass} Earth Masses</span>
                  </div>
                  <input
                    type="number"
                    min="0.001"
                    max="1000000"
                    step="0.01"
                    value={calcMass}
                    onChange={(e) => setCalcMass(parseFloat(e.target.value) || 0.01)}
                    className="w-full bg-cosmic-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100 font-mono text-sm outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-bold">ଗ୍ରହର ବ୍ୟାସାର୍ଦ୍ଧ (Radius, R/R⊕):</span>
                    <span className="font-mono text-cyan-400 font-bold">{calcRadius} Earth Radii</span>
                  </div>
                  <input
                    type="number"
                    min="0.01"
                    max="500"
                    step="0.01"
                    value={calcRadius}
                    onChange={(e) => setCalcRadius(parseFloat(e.target.value) || 0.01)}
                    className="w-full bg-cosmic-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100 font-mono text-sm outline-none"
                  />
                </div>
              </div>

              {/* Dynamic Results Display */}
              {(() => {
                const safeM = Number.isFinite(calcMass) && calcMass > 0 ? calcMass : 1.0;
                const safeR = Number.isFinite(calcRadius) && calcRadius > 0 ? calcRadius : 1.0;
                const gEarth = safeM / (safeR * safeR);
                const gMs2 = gEarth * 9.80665;
                const vEscKmS = 11.186 * Math.sqrt(safeM / safeR);
                const weight70kg = (70 * gEarth).toFixed(1);

                return (
                  <div className="grid grid-cols-2 gap-3 bg-cosmic-900/80 p-4 rounded-xl border border-slate-800 font-mono text-xs">
                    <div className="p-3 bg-cosmic-950/60 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Surface Gravity (g):</span>
                      <span className="text-lg font-bold text-amber-300">{gMs2.toFixed(2)} m/s²</span>
                      <span className="text-[10px] text-slate-500 block">({gEarth.toFixed(2)}g Earth)</span>
                    </div>

                    <div className="p-3 bg-cosmic-950/60 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Escape Velocity:</span>
                      <span className="text-lg font-bold text-cyan-300">{vEscKmS.toFixed(2)} km/s</span>
                      <span className="text-[10px] text-slate-500 block">{(vEscKmS * 3600).toLocaleString()} km/h</span>
                    </div>

                    <div className="col-span-2 p-2.5 bg-emerald-950/30 rounded-lg border border-emerald-500/30 text-slate-300 text-[11px]">
                      💡 <span className="font-bold text-emerald-400">୭୦ କେଜି ଓଜନର ମଣିଷ</span> ଏହି ଗ୍ରହରେ ଓଜନ ଅନୁଭବ କରିବ: <span className="font-bold text-white">{weight70kg} kg</span>!
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Table: Ancient Vedic Indian Astronomy vs Modern NASA Observations */}
          <div className="bg-cosmic-950/80 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cosmic-saffron" />
                <span>ପ୍ରାଚୀନ ଭାରତୀୟ ସିଦ୍ଧାନ୍ତ ଓ ନାସା (Surya Siddhanta & Aryabhata vs NASA)</span>
              </h4>
              <p className="text-xs text-slate-400">
                ୧,୫୦୦ ବର୍ଷ ପୂର୍ବେ ଆର୍ଯ୍ୟଭଟ୍ଟ (୪୯୯ ଖ୍ରୀଷ୍ଟାବ୍ଦ) ଏବଂ ସୂର୍ଯ୍ୟ ସିଦ୍ଧାନ୍ତର ଗଣନା ଆଧୁନିକ ନାସା ସହ ୯୯.୯% ସଠିକ୍!
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] bg-cosmic-900/60">
                    <th className="p-3">ପରିମାପ (Parameter)</th>
                    <th className="p-3 text-amber-400">ସୂର୍ଯ୍ୟ ସିଦ୍ଧାନ୍ତ / ଆର୍ଯ୍ୟଭଟ୍ଟ (Vedic)</th>
                    <th className="p-3 text-cyan-400">ଆଧୁନିକ ନାସା (Modern NASA)</th>
                    <th className="p-3 text-emerald-400">ନିର୍ଭୁଲତା (Accuracy)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                  <tr>
                    <td className="p-3 font-bold text-slate-200">Sidereal Year Length (ନକ୍ଷତ୍ର ବର୍ଷ)</td>
                    <td className="p-3 text-amber-300">365.258756 Days</td>
                    <td className="p-3 text-cyan-300">365.256363 Days</td>
                    <td className="p-3 text-emerald-400 font-bold">99.999% (+3.4 min/yr)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-200">Earth Circumference (ପୃଥିବୀର ପରିଧି)</td>
                    <td className="p-3 text-amber-300">39,968 km (4,967 Yojanas)</td>
                    <td className="p-3 text-cyan-300">40,075 km (Equatorial)</td>
                    <td className="p-3 text-emerald-400 font-bold">99.73% Accurate!</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-200">Earth Diameter (ପୃଥିବୀର ବ୍ୟାସ)</td>
                    <td className="p-3 text-amber-300">12,725 km (1,050 Yojanas)</td>
                    <td className="p-3 text-cyan-300">12,742 km (Mean)</td>
                    <td className="p-3 text-emerald-400 font-bold">99.87% Accurate!</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-200">Moon Synodic Month (ଚନ୍ଦ୍ରମାସ)</td>
                    <td className="p-3 text-amber-300">29.530582 Days</td>
                    <td className="p-3 text-cyan-300">29.530588 Days</td>
                    <td className="p-3 text-emerald-400 font-bold">99.99998% (0.5 sec error)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-200">Calculus of Instantaneous Velocity</td>
                    <td className="p-3 text-amber-300">ଭାସ୍କରାଚାର୍ଯ୍ୟ (୧୧୫୦ ଖ୍ରୀଷ୍ଟାବ୍ଦ - ତତ୍କାଳିକୀ ଗତି)</td>
                    <td className="p-3 text-cyan-300">Newton & Leibniz (1687 CE)</td>
                    <td className="p-3 text-emerald-400 font-bold">500 Years Ahead!</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-200">Heliocentric Planetary Motion</td>
                    <td className="p-3 text-amber-300">ଆର୍ଯ୍ୟଭଟ୍ଟ ୧ମ (ପୃଥିବୀ ସ୍ୱୟଂ ଘୂର୍ଣ୍ଣନଶୀଳା)</td>
                    <td className="p-3 text-cyan-300">Copernicus (1543 CE)</td>
                    <td className="p-3 text-emerald-400 font-bold">1,000 Years Ahead!</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* NASA JPL Master Planetary Constants Table */}
          <div className="bg-cosmic-950/80 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Atom className="w-4 h-4 text-cyan-400" />
                <span>ସୌରମଣ୍ଡଳୀୟ ଭୌତିକ ତଥ୍ୟ କୋଷ (NASA Planetary Physical Constants Matrix)</span>
              </h4>
              <p className="text-xs text-slate-400">
                ଛାତ୍ରଛାତ୍ରୀ ଏବଂ ବୈଜ୍ଞାନିକମାନଙ୍କ ପାଇଁ ସମସ୍ତ ୮ଟି ମୁଖ୍ୟ ଗ୍ରହ ଓ ସୂର୍ଯ୍ୟଙ୍କ ପ୍ରାମାଣିକ ନାସା ଡାଟାସେଟ୍।
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] bg-cosmic-900/80">
                    <th className="p-2.5">Body</th>
                    <th className="p-2.5">Semi-Major Axis (AU)</th>
                    <th className="p-2.5">Mass (kg)</th>
                    <th className="p-2.5">Radius (km)</th>
                    <th className="p-2.5">Gravity (m/s²)</th>
                    <th className="p-2.5">v_esc (km/s)</th>
                    <th className="p-2.5">Inclination (°)</th>
                    <th className="p-2.5">Temp (°C)</th>
                    <th className="p-2.5">Moons</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono text-[10px]">
                  {Object.entries(NASA_SOLAR_PHYSICS).map(([key, data]) => (
                    <tr key={key} className="hover:bg-cosmic-900/40 transition-colors">
                      <td className="p-2.5 font-bold text-cosmic-gold flex items-center gap-1">
                        <span>{data.name}</span>
                      </td>
                      <td className="p-2.5">{data.semiMajorAxisAU}</td>
                      <td className="p-2.5 text-slate-400">{data.massKg}</td>
                      <td className="p-2.5">{data.equatorialRadiusKm.toLocaleString()}</td>
                      <td className="p-2.5 text-amber-300">{data.surfaceGravityMs2}</td>
                      <td className="p-2.5 text-cyan-300">{data.escapeVelocityKmS}</td>
                      <td className="p-2.5">{data.inclinationDeg}°</td>
                      <td className="p-2.5">{data.meanTempC}°C</td>
                      <td className="p-2.5 font-bold text-emerald-400">{data.moonsCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};