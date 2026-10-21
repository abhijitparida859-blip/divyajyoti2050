import React, { useState, useMemo } from 'react';
import { useI18n } from '../../localization/i18n';
import {
  DETAILED_ATMOSPHERE_LAYERS,
  ATMOSPHERIC_GASES,
  ALTITUDE_MILESTONES,
  calculateAtmosphereProperties,
  AtmosphericLayer
} from '../../data/earthAtmosphereData';
import { EarthAtmosphere3DViewer } from './EarthAtmosphere3DViewer';
import {
  Compass,
  Gauge,
  Thermometer,
  Layers,
  Wind,
  ShieldAlert,
  Rocket,
  Plane,
  Sparkles,
  Info,
  CheckCircle2,
  ChevronRight,
  Activity,
  Award,
  ArrowRight,
  Maximize2
} from 'lucide-react';

export const EarthAtmosphereExplorer: React.FC = () => {
  const { language } = useI18n();
  const [currentAltKm, setCurrentAltKm] = useState<number>(0);
  const [selectedLayerId, setSelectedLayerId] = useState<string>('troposphere');
  const [activeSubTab, setActiveSubTab] = useState<'simulator' | 'layers' | 'gases' | 'milestones'>('simulator');

  // Real-time computed atmospheric telemetry
  const telemetry = useMemo(() => {
    return calculateAtmosphereProperties(currentAltKm);
  }, [currentAltKm]);

  const activeLayer = useMemo(() => {
    return (
      DETAILED_ATMOSPHERE_LAYERS.find((l) => l.id === selectedLayerId) ||
      DETAILED_ATMOSPHERE_LAYERS[0]
    );
  }, [selectedLayerId]);

  // Jump to flight altitude from layer card
  const handleFlyToLayer = (layer: AtmosphericLayer) => {
    // Select mid altitude of layer
    const midAlt =
      layer.id === 'troposphere'
        ? 6
        : layer.id === 'stratosphere'
        ? 30
        : layer.id === 'mesosphere'
        ? 65
        : layer.id === 'thermosphere'
        ? 250
        : 500;
    setCurrentAltKm(midAlt);
    setActiveSubTab('simulator');
  };

  return (
    <div className="bg-cosmic-950/95 border-2 border-indigo-500/40 p-5 sm:p-7 rounded-3xl backdrop-blur-2xl shadow-2xl space-y-6 animate-in fade-in duration-300">
      {/* Header Banner with NASA JPL & NOAA Verification Seal */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest font-mono px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              NASA US Standard Atmosphere (1976) • NOAA Verified
            </span>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ୧୦୦% ପ୍ରକୃତ ବୈଜ୍ଞାନିକ ତଥ୍ୟ
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-white font-serif flex items-center gap-2">
            <span>🌍</span>
            <span>
              {language === 'or'
                ? 'ପୃଥିବୀ ବାୟୁମଣ୍ଡଳୀୟ ବିଜ୍ଞାନ ଓ ୩D ଉଚ୍ଚତା ଲାବୋରେଟୋରୀ'
                : 'Earth Atmospheric Physics & 3D Flight Simulator'}
            </span>
          </h3>

          <p className="text-xs text-slate-300">
            {language === 'or'
              ? 'ସମୁଦ୍ର ପତ୍ତନ (0 km) ରୁ ମହାକାଶ ସୀମା (10,000 km) ପର୍ଯ୍ୟନ୍ତ ବାୟୁ ଚାପ, ତାପମାତ୍ରା, ବସ୍ତୁତ୍ୱ ଓ ପ୍ରାଣବାୟୁର ପ୍ରକୃତ ନାସା ଗଣିତ।'
              : 'Real NASA barometric altitude profiling, thermodynamic lapse rates, molecular gas fractions, and space transition dynamics.'}
          </p>
        </div>

        {/* Real Reference Constants HUD */}
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <div className="bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl text-center">
            <span className="text-[9px] text-slate-400 block">Sea Level Pressure</span>
            <span className="text-xs font-bold text-cyan-300">1013.25 hPa</span>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl text-center">
            <span className="text-[9px] text-slate-400 block">Standard Temp</span>
            <span className="text-xs font-bold text-emerald-400">+15.0°C</span>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl text-center">
            <span className="text-[9px] text-slate-400 block">Air Density (ρ)</span>
            <span className="text-xs font-bold text-amber-300">1.225 kg/m³</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-cosmic-900/70 border border-slate-800 p-1.5 rounded-2xl">
        <button
          type="button"
          onClick={() => setActiveSubTab('simulator')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'simulator'
              ? 'bg-gradient-to-r from-indigo-500 to-sky-500 text-white shadow-lg shadow-indigo-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Rocket className="w-4 h-4" />
          <span>{language === 'or' ? '🚀 3D ଲାଇଭ୍ ଉଚ୍ଚତା ଓ ବାୟୁ ଚାପ ସିମୁଲେଟର୍' : '🚀 3D Live Flight Simulator'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('layers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'layers'
              ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-cosmic-950 shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{language === 'or' ? '📊 ୫ଟି ସ୍ତରର ବିସ୍ତୃତ ପଦାର୍ଥ ବିଜ୍ଞାନ' : '📊 5 Atmospheric Layers Deep Dive'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('gases')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'gases'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-cosmic-950 shadow-lg shadow-amber-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wind className="w-4 h-4" />
          <span>{language === 'or' ? '🧪 ବାୟୁମଣ୍ଡଳୀୟ ଗ୍ୟାସ୍ ଗଠନ (Gas Composition)' : '🧪 Chemical Gas Composition (NOAA)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('milestones')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'milestones'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{language === 'or' ? '⭐ ଉଡ଼ାଣ ରେକର୍ଡ ଓ ଲ୍ୟାଣ୍ଡମାର୍କ (Milestones)' : '⭐ Flight Altitude Milestones'}</span>
        </button>
      </div>

      {/* SUBTAB 1: LIVE 3D ALTITUDE & BAROMETRIC SIMULATOR */}
      {activeSubTab === 'simulator' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: 3D Earth Atmosphere Flight Globe */}
            <div className="lg:col-span-6 space-y-4">
              <EarthAtmosphere3DViewer
                currentAltKm={currentAltKm}
                selectedLayerId={telemetry.layerId}
                onSelectMilestone={(alt) => setCurrentAltKm(alt)}
              />

              <div className="bg-cosmic-950/80 border border-slate-800 p-4 rounded-2xl text-xs space-y-2">
                <span className="text-cosmic-gold font-bold flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-sky-400" />
                  ବାୟୁମଣ୍ଡଳୀୟ ସୀମା ଓ କାର୍ମାନ୍ ରେଖା (100 km Boundary):
                </span>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  ସମୁଦ୍ର ପତ୍ତନରୁ ୧୦୦ କିଲୋମିଟର ଉଚ୍ଚତାରେ ଥିବା ସ୍ୱର୍ଣ୍ଣିମ ଚକ୍ର ହେଉଛି ଆନ୍ତର୍ଜାତୀୟ ବୈମାନିକ ଫେଡେରେସନ୍ (FAI) ଦ୍ୱାରା ନିର୍ଦ୍ଧାରିତ ମହାକାଶ ସୀମା "କାର୍ମାନ୍ ରେଖା"। ଏହା ଉପରକୁ ବିମାନ ପବନର ଲିଫ୍ଟ୍ ପାଇପାରେ ନାହିଁ ଏବଂ କେବଳ ରକେଟ୍ ପ୍ରପଲ୍‌ସନ୍ ଚାଲିଥାଏ।
                </p>
              </div>
            </div>

            {/* Right Column: Flight Telemetry Deck & 3D Tactile Buttons */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-gradient-to-r from-indigo-950/60 via-slate-950/80 to-sky-950/60 border border-indigo-500/30 p-5 rounded-2xl space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block">
                      Current Atmospheric Altitude Zone
                    </span>
                    <h4 className="text-lg font-bold text-white font-serif">
                      {telemetry.layerNameOr}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                      Altitude: {currentAltKm.toFixed(2)} km ({(currentAltKm * 3280.84).toLocaleString(undefined, { maximumFractionDigits: 0 })} ft)
                    </span>
                  </div>
                </div>

                {/* Altitude Slider Control */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>0 km (Sea Level)</span>
                    <span className="text-cosmic-gold font-bold">କ୍ରମାଗତ ଉଚ୍ଚତା ନିୟନ୍ତ୍ରଣ (Slide Altitude)</span>
                    <span>600 km (Thermosphere / Space)</span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="600"
                    step="0.5"
                    value={currentAltKm}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (Number.isFinite(val)) {
                        setCurrentAltKm(Math.max(0, Math.min(600, val)));
                      }
                    }}
                    className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                  />
                </div>

                {/* 3D Tactile Aerospace Quick Jump Cards (Redesigned with 3D Depth) */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-300 font-bold flex items-center gap-1.5">
                      <Rocket className="w-3.5 h-3.5 text-indigo-400" />
                      ପ୍ରମୁଖ ଉଡ଼ାଣ ଲ୍ୟାଣ୍ଡମାର୍କ (Aerospace Quick Jump):
                    </span>
                    <span className="text-[10px] text-slate-400">Click to Fly</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { alt: 0, label: 'Sea Level', icon: '🌊', badge: '0 km', color: '#0ea5e9' },
                      { alt: 8.849, label: 'Mt. Everest', icon: '🏔️', badge: '8.85 km', color: '#10b981' },
                      { alt: 11.5, label: 'Jet Cruise', icon: '✈️', badge: '11.5 km', color: '#38bdf8' },
                      { alt: 25, label: 'Ozone Shield', icon: '🛡️', badge: '25 km', color: '#6366f1' },
                      { alt: 39, label: 'Felix Jump', icon: '🪂', badge: '39 km', color: '#ef4444' },
                      { alt: 80, label: 'Meteor Burn', icon: '☄️', badge: '80 km', color: '#f97316' },
                      { alt: 100, label: 'Kármán Line', icon: '🚀', badge: '100 km', color: '#f59e0b' },
                      { alt: 150, label: 'Aurora Realm', icon: '✨', badge: '150 km', color: '#a855f7' },
                      { alt: 408, label: 'ISS Orbit', icon: '🛰️', badge: '408 km', color: '#ec4899' }
                    ].map((item) => {
                      const isActive = Math.abs(currentAltKm - item.alt) < 1.5;
                      return (
                        <button
                          key={item.alt}
                          type="button"
                          onClick={() => setCurrentAltKm(item.alt)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1 shadow-md ${
                            isActive
                              ? 'bg-gradient-to-r from-indigo-500 to-sky-500 text-white border-white scale-[1.02] shadow-indigo-500/30'
                              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-slate-800 hover:border-indigo-500/50'
                          }`}
                          style={
                            isActive
                              ? undefined
                              : { borderLeftWidth: '3px', borderLeftColor: item.color }
                          }
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-base">{item.icon}</span>
                            <span
                              className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                                isActive ? 'bg-black/30 text-white font-bold' : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {item.badge}
                            </span>
                          </div>
                          <span className="text-xs font-serif font-bold truncate block">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Live 6-Metric Physics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
                  {/* Pressure (hPa) */}
                  <div className="bg-cosmic-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                      <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                      ଚାପ (Pressure)
                    </span>
                    <span className="font-bold text-cyan-300 block text-xs">
                      {telemetry.pressureHpa < 0.001
                        ? `${telemetry.pressureHpa.toExponential(2)} hPa`
                        : `${telemetry.pressureHpa.toFixed(2)} hPa`}
                    </span>
                    <span className="text-[9px] text-slate-400 block">
                      {telemetry.pressureAtm < 0.0001
                        ? `${telemetry.pressureAtm.toExponential(2)} atm`
                        : `${telemetry.pressureAtm.toFixed(4)} atm`}
                    </span>
                  </div>

                  {/* Kinetic Temperature */}
                  <div className="bg-cosmic-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                      <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                      ତାପମାତ୍ରା (Temperature)
                    </span>
                    <span className="font-bold text-rose-300 block text-xs">
                      {telemetry.tempC > 0 ? `+${telemetry.tempC.toFixed(1)}°C` : `${telemetry.tempC.toFixed(1)}°C`}
                    </span>
                    <span className="text-[9px] text-slate-400 block">
                      {telemetry.tempK.toFixed(1)} Kelvin
                    </span>
                  </div>

                  {/* Air Density */}
                  <div className="bg-cosmic-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      ଘନତ୍ୱ (Density)
                    </span>
                    <span className="font-bold text-amber-300 block text-xs">
                      {telemetry.densityKgM3 < 0.001
                        ? `${telemetry.densityKgM3.toExponential(2)} kg/m³`
                        : `${telemetry.densityKgM3.toFixed(3)} kg/m³`}
                    </span>
                    <span className="text-[9px] text-slate-400 block">
                      {((telemetry.densityKgM3 / 1.225) * 100).toFixed(1)}% of sea level
                    </span>
                  </div>

                  {/* Speed of Sound */}
                  <div className="bg-cosmic-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                      <Wind className="w-3.5 h-3.5 text-emerald-400" />
                      ଶବ୍ଦର ବେଗ (Sound)
                    </span>
                    <span className="font-bold text-emerald-300 block text-xs">
                      {telemetry.speedOfSoundMs > 0
                        ? `${telemetry.speedOfSoundMs.toFixed(1)} m/s`
                        : 'ଅପ୍ରଯୁଜ୍ୟ (Vacuum)'}
                    </span>
                    <span className="text-[9px] text-slate-400 block">
                      {telemetry.speedOfSoundMs > 0
                        ? `${(telemetry.speedOfSoundMs * 3.6).toFixed(0)} km/h (Mach 1)`
                        : 'ଶୂନ୍ୟତାରେ ଶବ୍ଦ ଗତି କରେ ନାହିଁ'}
                    </span>
                  </div>

                  {/* Available Oxygen Level */}
                  <div className="bg-cosmic-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 text-teal-400" />
                      ପ୍ରାଣବାୟୁ ସ୍ତର (Oxygen)
                    </span>
                    <span
                      className={`font-bold block text-xs ${
                        telemetry.oxygenFractionRelative > 0.6
                          ? 'text-emerald-400'
                          : telemetry.oxygenFractionRelative > 0.3
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {(telemetry.oxygenFractionRelative * 100).toFixed(1)}%
                    </span>
                    <span className="text-[9px] text-slate-400 block">
                      {telemetry.oxygenFractionRelative > 0.6
                        ? 'ନିରାପଦ ଶ୍ୱାସକ୍ରିୟା'
                        : telemetry.oxygenFractionRelative > 0.3
                        ? 'ଅମ୍ଳଜାନ ମାସ୍କ ଆବଶ୍ୟକ'
                        : 'ଅକ୍ସିଜେନ୍ ଶୂନ୍ୟ (Hypoxia)'}
                    </span>
                  </div>

                  {/* Space Boundary Status */}
                  <div className="bg-cosmic-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                      <Rocket className="w-3.5 h-3.5 text-purple-400" />
                      ମହାକାଶ ସ୍ଥିତି (Realm)
                    </span>
                    <span className="font-bold text-purple-300 block text-xs">
                      {currentAltKm < 100 ? 'ବାୟୁମଣ୍ଡଳ' : 'ବାହ୍ୟ ମହାକାଶ'}
                    </span>
                    <span className="text-[9px] text-slate-400 block">
                      {currentAltKm < 100 ? 'ବାୟୁଗତିକ ଉଡ଼ାଣ' : 'କକ୍ଷୀୟ ପଦାର୍ଥ ବିଜ୍ଞାନ'}
                    </span>
                  </div>
                </div>

                {/* Status Insight Banner */}
                <div className="bg-indigo-950/40 border border-indigo-500/30 p-3.5 rounded-xl text-xs flex items-center gap-2.5">
                  <Info className="w-4 h-4 text-indigo-400 shrink-0" />
                  <p className="text-slate-200 leading-relaxed font-medium">
                    {language === 'or' ? telemetry.statusHeadlineOr : telemetry.statusHeadlineEn}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: 5 ATMOSPHERIC LAYERS DEEP DIVE (WITH 3D GLOBE) */}
      {activeSubTab === 'layers' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Layer Selector Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {DETAILED_ATMOSPHERE_LAYERS.map((layer) => {
              const isSelected = selectedLayerId === layer.id;
              return (
                <button
                  key={layer.id}
                  type="button"
                  onClick={() => setSelectedLayerId(layer.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-2 ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-500 to-sky-500 text-white border-white shadow-xl scale-105'
                      : 'bg-cosmic-900/80 text-slate-300 border-slate-800 hover:border-indigo-500/50 hover:text-white'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                  <span>{layer.nameOr.split('(')[0]}</span>
                  <span className="text-[10px] opacity-75 font-mono">({layer.altitudeRangeKm.split('(')[0]})</span>
                </button>
              );
            })}
          </div>

          {/* Grid Layout: 3D Atmosphere Viewer on Left + Detailed Layer Dossier on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 3D Atmosphere Panel */}
            <div className="lg:col-span-5 space-y-4">
              <EarthAtmosphere3DViewer
                selectedLayerId={activeLayer.id}
                currentAltKm={
                  activeLayer.id === 'troposphere'
                    ? 6
                    : activeLayer.id === 'stratosphere'
                    ? 30
                    : activeLayer.id === 'mesosphere'
                    ? 65
                    : activeLayer.id === 'thermosphere'
                    ? 250
                    : 500
                }
              />

              {/* Action Button: Fly to this Layer in 3D */}
              <button
                type="button"
                onClick={() => handleFlyToLayer(activeLayer)}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-400 hover:to-sky-400 text-white font-bold text-xs font-mono shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>🚀 ଏହି ସ୍ତରକୁ 3D ରେ ଉଡ଼ନ୍ତୁ (Fly to {activeLayer.nameEn.split('(')[0]})</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Mini Stratospheric Altitude Scale */}
              <div className="bg-cosmic-950/80 border border-slate-800 p-4 rounded-2xl space-y-2 text-xs">
                <span className="font-mono text-slate-400 text-[10px] uppercase tracking-wider block">
                  Atmospheric Altitude Scale (0 to 600 km)
                </span>
                <div className="w-full h-3 rounded-lg overflow-hidden flex border border-slate-800 shadow-inner">
                  {DETAILED_ATMOSPHERE_LAYERS.map((l) => (
                    <div
                      key={l.id}
                      style={{
                        width:
                          l.id === 'troposphere'
                            ? '10%'
                            : l.id === 'stratosphere'
                            ? '18%'
                            : l.id === 'mesosphere'
                            ? '16%'
                            : l.id === 'thermosphere'
                            ? '36%'
                            : '20%',
                        backgroundColor:
                          l.id === 'troposphere'
                            ? '#38bdf8'
                            : l.id === 'stratosphere'
                            ? '#6366f1'
                            : l.id === 'mesosphere'
                            ? '#a855f7'
                            : l.id === 'thermosphere'
                            ? '#ec4899'
                            : '#f59e0b',
                        opacity: l.id === activeLayer.id ? 1 : 0.4
                      }}
                      className="h-full transition-all"
                      title={`${l.nameEn}: ${l.altitudeRangeKm}`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Sea Level 0 km</span>
                  <span className="text-sky-300 font-bold">Active: {activeLayer.nameOr.split('(')[0]}</span>
                  <span>Space 600 km</span>
                </div>
              </div>
            </div>

            {/* Right Detailed Dossier Panel */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-cosmic-950/90 border-2 border-indigo-500/40 p-5 sm:p-6 rounded-3xl space-y-5 shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest block">
                      Atmospheric Stratum Profile
                    </span>
                    <h4 className="text-xl sm:text-2xl font-bold text-white font-serif">
                      {activeLayer.nameOr}
                    </h4>
                    <span className="text-xs text-slate-300 font-mono">
                      {activeLayer.nameEn}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                    <span className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-cyan-300 font-bold">
                      ଉଚ୍ଚତା: {activeLayer.altitudeRangeKm}
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-amber-300 font-bold">
                      ବସ୍ତୁତ୍ୱ: {activeLayer.massPercent}
                    </span>
                  </div>
                </div>

                {/* 4-Stat Physical Spec Box */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="bg-cosmic-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 block">ତାପମାତ୍ରା ପରିସର:</span>
                    <span className="font-bold text-rose-300 text-xs">{activeLayer.tempRangeC}</span>
                  </div>
                  <div className="bg-cosmic-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 block">ବାୟୁ ଚାପ:</span>
                    <span className="font-bold text-cyan-300 text-xs">{activeLayer.pressureRangeHpa}</span>
                  </div>
                  <div className="bg-cosmic-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 block">ଉର୍ଦ୍ଧ୍ୱ ସୀମା:</span>
                    <span className="font-bold text-yellow-300 text-xs">{activeLayer.boundaryNameOr}</span>
                    <span className="text-[9px] text-slate-400 block">Temp: {activeLayer.boundaryTempC}</span>
                  </div>
                  <div className="bg-cosmic-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 block">ତାପ ପରିବର୍ତ୍ତନ ହାର:</span>
                    <span className="font-bold text-emerald-300 text-[11px]">{activeLayer.lapserateOr}</span>
                  </div>
                </div>

                {/* Scientific In-Depth Narrative */}
                <div className="bg-cosmic-950/80 border border-slate-800 p-4 rounded-2xl space-y-2 text-xs">
                  <span className="text-cosmic-gold font-bold flex items-center gap-1.5 text-xs">
                    <Info className="w-4 h-4 text-cosmic-gold" />
                    ନାସା ବାୟୁମଣ୍ଡଳୀୟ ପଦାର୍ଥ ବିଜ୍ଞାନ ବିଶ୍ଳେଷଣ (Scientific Physics Insight):
                  </span>
                  <p className="text-slate-200 leading-relaxed text-xs">
                    {language === 'or' ? activeLayer.scientificDescriptionOr : activeLayer.scientificDescriptionEn}
                  </p>
                </div>

                {/* Key Phenomena & Flight Vehicles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-cosmic-950/80 border border-slate-800 p-4 rounded-2xl space-y-2">
                    <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      ପ୍ରମୁଖ ପ୍ରାକୃତିକ ଘଟଣାବଳୀ:
                    </span>
                    <ul className="space-y-1.5 text-slate-300 text-[11px] list-disc list-inside">
                      {activeLayer.keyPhenomenaOr.map((p, idx) => (
                        <li key={idx} className="leading-relaxed">{p}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-cosmic-950/80 border border-slate-800 p-4 rounded-2xl space-y-2">
                    <span className="text-amber-300 font-bold flex items-center gap-1.5">
                      <Plane className="w-4 h-4 text-amber-400" />
                      ଏଠାରେ ଉଡ଼ୁଥିବା ବିମାନ ଓ ଯାନ:
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      {language === 'or' ? activeLayer.flightVehiclesOr : activeLayer.flightVehiclesEn}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: ATMOSPHERIC GASES (NOAA COMPOSITION) */}
      {activeSubTab === 'gases' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="text-xs text-slate-300 border-b border-slate-800 pb-2 flex items-center justify-between">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-cyan-400" />
              ପୃଥିବୀର ଶୁଷ୍କ ବାୟୁର ରାସାୟନିକ ଅନୁପାତ (NOAA Mauna Loa 2024 Standards)
            </span>
            <span className="font-mono text-cyan-300">Total: 100.00% Clean Dry Air</span>
          </div>

          {/* Proportional Stack Bar */}
          <div className="space-y-1.5">
            <div className="w-full h-5 rounded-xl overflow-hidden flex shadow-lg border border-slate-800">
              {ATMOSPHERIC_GASES.map((g) => (
                <div
                  key={g.name}
                  style={{ width: `${Math.max(1, g.percentVolume)}%`, backgroundColor: g.color }}
                  className="h-full transition-all hover:opacity-80 cursor-pointer"
                  title={`${g.name}: ${g.percentVolume}% (${g.ppm})`}
                />
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-400 pt-1">
              {ATMOSPHERIC_GASES.map((g) => (
                <div key={g.name} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: g.color }} />
                  <span>{g.chemicalFormula} ({g.percentVolume}%)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Grid of Gas Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {ATMOSPHERIC_GASES.map((gas) => (
              <div
                key={gas.chemicalFormula}
                className="bg-cosmic-950/80 border border-slate-800 p-4 rounded-2xl space-y-2 hover:border-slate-700 transition-all shadow-xl"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-sm font-bold font-mono px-2 py-0.5 rounded-lg bg-slate-900 border" style={{ borderColor: `${gas.color}60`, color: gas.color }}>
                    {gas.chemicalFormula}
                  </span>
                  <span className="text-xs font-mono font-bold text-white">{gas.percentVolume}%</span>
                </div>

                <h5 className="font-bold text-white font-serif">{gas.name}</h5>

                <div className="text-[10px] font-mono text-amber-300">
                  PPM: <strong className="text-white">{gas.ppm}</strong>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  {language === 'or' ? gas.roleOr : gas.roleEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: FAMOUS FLIGHT ALTITUDE MILESTONES */}
      {activeSubTab === 'milestones' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="text-xs text-slate-300 border-b border-slate-800 pb-2 flex items-center justify-between">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              ପୃଥିବୀ ବାୟୁମଣ୍ଡଳର ଐତିହାସିକ ଉଚ୍ଚତା ମାଇଲଖୁଣ୍ଟ ଓ ଉଡ଼ାଣ ରେକର୍ଡ
            </span>
            <span className="font-mono text-amber-300">{ALTITUDE_MILESTONES.length} Verified Landmarks</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {ALTITUDE_MILESTONES.map((m) => (
              <div
                key={m.altitudeKm}
                className="bg-cosmic-950/80 border border-slate-800 p-4 rounded-2xl space-y-2 hover:border-amber-500/40 transition-all shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{m.icon}</span>
                    <span className="font-bold text-white font-serif text-sm">{m.titleOr}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                    {m.altitudeKm} km
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
                  <span>Layer: <strong className="text-slate-200">{m.layer}</strong></span>
                  <span>•</span>
                  <span>Temp: <strong className="text-rose-300">{m.tempC}°C</strong></span>
                  <span>•</span>
                  <span>Pressure: <strong className="text-cyan-300">{m.pressureHpa} hPa</strong></span>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  {language === 'or' ? m.descOr : m.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
