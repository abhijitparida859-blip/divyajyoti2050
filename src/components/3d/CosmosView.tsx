import React, { useState, useEffect, useMemo } from 'react';
import { useI18n } from '../../localization/i18n';
import { CosmicOrbChart3D } from './CosmicOrbChart3D';
import { GoogleEarthGlobeExplorer } from './GoogleEarthGlobeExplorer';
import { LiveBigBangSimulator } from './LiveBigBangSimulator';
import { CosmicEncyclopedia } from './CosmicEncyclopedia';
import { SafeErrorBoundary } from '../common/SafeErrorBoundary';
import { calculateBirthChart } from '../../core/jataka/kundali_engine';
import {
  Globe2,
  Sparkles,
  Orbit,
  Atom,
  Microscope,
  Compass,
  Layers,
  Activity,
  Flame
} from 'lucide-react';

export const CosmosView: React.FC = () => {
  const { language } = useI18n();
  const [activeSubTab, setActiveSubTab] = useState<'solar' | 'globe' | 'bigbang' | 'encyclopedia'>('solar');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000); // update every minute
    return () => clearInterval(interval);
  }, []);

  // Real-time planetary positions for Puri (19.8135°N, 85.8312°E)
  const currentChartData = useMemo(() => {
    return calculateBirthChart(
      'Live Space Telemetry',
      now,
      19.8135,
      85.8312,
      'Puri Jagannath Dham',
      'neutral'
    );
  }, [now]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Top Hero Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-cosmic-950 via-[#071329] to-cosmic-950 border-2 border-cosmic-gold/40 shadow-2xl overflow-hidden backdrop-blur-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cosmic-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-stretch gap-5">
          <div className="w-full min-w-0 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cosmic-gold/15 border border-cosmic-gold/30 text-xs font-bold text-cosmic-gold">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-400" />
              <span>{language === 'or' ? 'ଦିବ୍ୟଜ୍ୟୋତି କାଳିଆ ପାଞ୍ଜି • ବ୍ରହ୍ମାଣ୍ଡ ଦର୍ଶନ' : language === 'hi' ? 'दिव्यज्योति कालिया पंचांग • ब्रह्माण्ड दर्शन' : 'DivyaJyoti Kalia Panjika • Brahmanda 3D'}</span>
            </div>
            <h1
              className="text-2xl sm:text-3xl md:text-4xl font-black leading-[1.45] break-words bg-gradient-to-r from-amber-300 via-cosmic-gold to-yellow-100 bg-clip-text text-transparent font-serif"
              style={language === 'or'
                ? {
                    fontFamily: "'Noto Sans Oriya', sans-serif",
                    fontWeight: 700,
                    lineHeight: 1.5
                  }
                : undefined}
            >
              {language === 'or' ? 'ବ୍ରହ୍ମାଣ୍ଡ ଦର୍ଶନ ୩D — ସୌରମଣ୍ଡଳ, ଗୁଗୁଲ୍ ଆର୍ଥ୍ ଓ ବିଗ୍ ବ୍ୟାଙ୍ଗ୍' : language === 'hi' ? 'ब्रह्माण्ड दर्शन 3D — सौर मंडल, गूगल अर्थ और बिग बैंग' : 'Brahmanda 3D — Solar System, Google Earth & Big Bang'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              {language === 'or'
                ? 'NASA JPL ଗ୍ରହ ତଥ୍ୟ, ଉପବୃତ୍ତାକାର କକ୍ଷପଥ, ଅକ୍ଷୀୟ ଝୁକାଣ ଓ ଗତିଶୀଳ ସୌରମଣ୍ଡଳ ଅନୁସନ୍ଧାନ। ସ୍ପଷ୍ଟ ଦେଖିବା ପାଇଁ ଦୂରତା ଓ ଗ୍ରହର ଆକାର ଶିକ୍ଷାମୂଳକ ଭାବେ ସଂକୁଚିତ; କକ୍ଷପଥର ଗତି ବଢ଼ାଯାଇଛି।'
                : language === 'hi'
                ? 'NASA JPL ग्रह डेटा, दीर्घवृत्ताकार कक्षाएँ, अक्षीय झुकाव और गतिशील सौरमंडल का अन्वेषण। स्पष्ट दृश्य के लिए दूरियाँ और ग्रहों के आकार शैक्षिक रूप से संकुचित हैं; कक्षीय गति तेज़ की गई है।'
                : 'Explore NASA JPL planetary data, elliptical orbits, axial inclinations, and a dynamic solar system. Distances and planet sizes are educationally compressed for visibility; orbital motion is accelerated.'}
            </p>
          </div>

          {/* Sub-Tabs Pill Navigation */}
          <div className="grid w-full grid-cols-2 sm:grid-cols-4 items-stretch gap-2 p-2 bg-cosmic-950/90 border border-slate-800 rounded-2xl shadow-xl">
            <button
              type="button"
              onClick={() => setActiveSubTab('solar')}
              className={`min-w-0 justify-center px-2.5 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                activeSubTab === 'solar'
                  ? 'bg-gradient-to-r from-cosmic-gold to-yellow-400 text-cosmic-950 border-white shadow-lg'
                  : 'bg-cosmic-900/60 text-slate-300 border-transparent hover:border-slate-700 hover:text-white'
              }`}
            >
              <Orbit className="w-4 h-4" />
              <span>{language === 'or' ? '🪐 ୩D ସୌରମଣ୍ଡଳ' : language === 'hi' ? '🪐 3D सौर मंडल' : '🪐 3D Solar'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('globe')}
              className={`min-w-0 justify-center px-2.5 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                activeSubTab === 'globe'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-white shadow-lg shadow-cyan-500/25'
                  : 'bg-cosmic-900/60 text-slate-300 border-transparent hover:border-slate-700 hover:text-white'
              }`}
            >
              <Globe2 className="w-4 h-4" />
              <span>{language === 'or' ? '🌍 ଗୁଗୁଲ୍ ଆର୍ଥ୍' : language === 'hi' ? '🌍 गूगल अर्थ' : '🌍 Google Earth'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('bigbang')}
              className={`min-w-0 justify-center px-2.5 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                activeSubTab === 'bigbang'
                  ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white border-white shadow-lg shadow-rose-500/25'
                  : 'bg-cosmic-900/60 text-slate-300 border-transparent hover:border-slate-700 hover:text-white'
              }`}
            >
              <Atom className="w-4 h-4" />
              <span>{language === 'or' ? '💥 ବିଗ୍ ବ୍ୟାଙ୍ଗ୍' : language === 'hi' ? '💥 बिग बैंग' : '💥 Big Bang'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('encyclopedia')}
              className={`min-w-0 justify-center px-2.5 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                activeSubTab === 'encyclopedia'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-cosmic-950 border-white shadow-lg shadow-emerald-500/25'
                  : 'bg-cosmic-900/60 text-slate-300 border-transparent hover:border-slate-700 hover:text-white'
              }`}
            >
              <Microscope className="w-4 h-4" />
              <span>{language === 'or' ? '🔬 ଏନସାଇକ୍ଲୋପିଡିଆ' : language === 'hi' ? '🔬 विश्वकोश' : '🔬 Encyclopedia'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* SUB-VIEW 1: 3D REAL LIVE SOLAR SYSTEM */}
      {activeSubTab === 'solar' && (
        <SafeErrorBoundary fallbackTitle={language === 'or' ? 'ସୌରମଣ୍ଡଳ 3D ପ୍ରଦର୍ଶନ' : language === 'hi' ? 'सौर मंडल 3D दृश्य' : '3D Solar System View'}>
          <div className="space-y-6 animate-in fade-in duration-300">
            <CosmicOrbChart3D
              chartData={currentChartData}
              onExploreEncyclopedia={() => setActiveSubTab('encyclopedia')}
            />
          </div>
        </SafeErrorBoundary>
      )}

      {/* SUB-VIEW 2: GOOGLE EARTH & PLANETARY GLOBE EXPLORER */}
      {activeSubTab === 'globe' && (
        <SafeErrorBoundary fallbackTitle={language === 'or' ? 'ଗୁଗୁଲ୍ ଆର୍ଥ୍ ଓ ପ୍ଲାନେଟାରୀ ଗ୍ଲୋବ୍' : language === 'hi' ? 'गूगल अर्थ और ग्रहीय ग्लोब' : 'Google Earth & Globe View'}>
          <div className="space-y-6 animate-in fade-in duration-300">
            <GoogleEarthGlobeExplorer />
          </div>
        </SafeErrorBoundary>
      )}

      {/* SUB-VIEW 3: LIVE BIG BANG LABORATORY */}
      {activeSubTab === 'bigbang' && (
        <SafeErrorBoundary fallbackTitle={language === 'or' ? 'ବିଗ୍ ବ୍ୟାଙ୍ଗ୍ 3D ଲାବୋରେଟୋରୀ' : language === 'hi' ? 'बिग बैंग 3D प्रयोगशाला' : 'Big Bang 3D Laboratory'}>
          <div className="space-y-6 animate-in fade-in duration-300">
            <LiveBigBangSimulator />
          </div>
        </SafeErrorBoundary>
      )}

      {/* SUB-VIEW 4: COSMIC ENCYCLOPEDIA & ASTROPHYSICS LAB */}
      {activeSubTab === 'encyclopedia' && (
        <SafeErrorBoundary fallbackTitle={language === 'or' ? 'ମହାଜାଗତିକ ଏନସାଇକ୍ଲୋପିଡିଆ' : language === 'hi' ? 'ब्रह्मांडीय विश्वकोश' : 'Cosmic Encyclopedia'}>
          <div className="space-y-6 animate-in fade-in duration-300">
            <CosmicEncyclopedia />
          </div>
        </SafeErrorBoundary>
      )}
    </div>
  );
};
