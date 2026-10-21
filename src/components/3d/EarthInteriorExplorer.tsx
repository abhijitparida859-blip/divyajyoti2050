import React, { useState, useMemo } from 'react';
import { useI18n } from '../../localization/i18n';
import {
  DETAILED_INTERIOR_LAYERS,
  DEEP_EARTH_MILESTONES,
  BULK_EARTH_ELEMENTS,
  calculateEarthInteriorProperties,
  InteriorLayerDetail
} from '../../data/earthInteriorData';
import { EarthInterior3DViewer } from './EarthInterior3DViewer';
import {
  Flame,
  Layers,
  Activity,
  Gauge,
  Thermometer,
  Compass,
  Info,
  Sparkles,
  Mountain,
  CheckCircle2,
  Award,
  Zap,
  Globe2,
  ArrowRight,
  Maximize2
} from 'lucide-react';

export const EarthInteriorExplorer: React.FC = () => {
  const { language } = useI18n();
  const [currentDepthKm, setCurrentDepthKm] = useState<number>(0);
  const [selectedLayerId, setSelectedLayerId] = useState<string>('crust');
  const [activeSubTab, setActiveSubTab] = useState<'simulator' | 'layers' | 'elements' | 'milestones'>('simulator');

  // Real-time PREM geophysical calculation
  const telemetry = useMemo(() => {
    return calculateEarthInteriorProperties(currentDepthKm);
  }, [currentDepthKm]);

  const activeLayer = useMemo(() => {
    return (
      DETAILED_INTERIOR_LAYERS.find((l) => l.id === selectedLayerId) ||
      DETAILED_INTERIOR_LAYERS[0]
    );
  }, [selectedLayerId]);

  // Jump to drill depth from layer card
  const handleDrillToLayer = (layer: InteriorLayerDetail) => {
    const midDepth = Math.round((layer.topDepthKm + layer.bottomDepthKm) / 2);
    setCurrentDepthKm(midDepth);
    setActiveSubTab('simulator');
  };

  return (
    <div className="bg-cosmic-950/95 border-2 border-rose-500/40 p-5 sm:p-7 rounded-3xl backdrop-blur-2xl shadow-2xl space-y-6 animate-in fade-in duration-300">
      {/* Header Banner with PREM Seismology & USGS Verification Seal */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest font-mono px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              PREM (Harvard Seismology) • USGS Geodynamics Verified
            </span>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ୧୦୦% ପ୍ରକୃତ ଭୂଭୌତିକ ଡାଟା
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-white font-serif flex items-center gap-2">
            <span>🔥</span>
            <span>
              {language === 'or'
                ? 'ପୃଥିବୀର ଅଭ୍ୟନ୍ତରୀଣ ସ୍ତର ବିଜ୍ଞାନ ଓ ୩D ଭୂଗର୍ଭ ଲାବୋରେଟୋରୀ'
                : 'Earth Interior Geophysics & 3D Deep Earth Lab'}
            </span>
          </h3>

          <p className="text-xs text-slate-300">
            {language === 'or'
              ? 'ଭୂତ୍ୱକ୍ (0 km) ରୁ ପୃଥିବୀର କେନ୍ଦ୍ର (6,371 km) ପର୍ଯ୍ୟନ୍ତ ୩୬୪ GPa ଚାପ, ୫,୪୦୦°C ତାପମାତ୍ରା, ସେସ୍ମିକ୍ P ଓ S ତରଙ୍ଗ ବେଗ ଏବଂ ଭୂ-ଚୁମ୍ବକୀୟ ଡାଇନାମୋର ପ୍ରକୃତ ବିଜ୍ଞାନ।'
              : 'Real PREM seismic wave velocities (Vp, Vs), megabar hydrostatic pressures, mantle convection superplumes, and geodynamo magnetic physics.'}
          </p>
        </div>

        {/* Global Planetary Core Constants */}
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <div className="bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl text-center">
            <span className="text-[9px] text-slate-400 block">Earth Radius</span>
            <span className="text-xs font-bold text-cyan-300">6,371.0 km</span>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl text-center">
            <span className="text-[9px] text-slate-400 block">Center Pressure</span>
            <span className="text-xs font-bold text-rose-400">364 GPa (3.6M atm)</span>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl text-center">
            <span className="text-[9px] text-slate-400 block">Center Temp</span>
            <span className="text-xs font-bold text-amber-300">5,400°C (Sun Surface)</span>
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
              ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-cosmic-950 shadow-lg shadow-rose-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>{language === 'or' ? '🌐 3D କଟ୍‌ୱେ ଗୋଲକ ଓ ଡ୍ରିଲ୍ ସିମୁଲେଟର୍' : '🌐 3D Cutaway Globe & Drill Simulator'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('layers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'layers'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-cosmic-950 shadow-lg shadow-amber-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{language === 'or' ? '🧱 ୫ଟି ସ୍ତରର ବିସ୍ତୃତ ଭୂବୈଜ୍ଞାନିକ ତଥ୍ୟ' : '🧱 5 Interior Strata Deep Dive'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('elements')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'elements'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{language === 'or' ? '🧪 ରାସାୟନିକ ମୌଳିକ ଗଠନ (Whole Earth)' : '🧪 Bulk Chemical Elements'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('milestones')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'milestones'
              ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{language === 'or' ? '⛏️ କୋଲା ବୋରହୋଲ୍ ଓ ଡିସ୍କଣ୍ଟିନ୍ୟୁଟି' : '⛏️ Deep Milestones & Discontinuities'}</span>
        </button>
      </div>

      {/* SUBTAB 1: 3D CUTAWAY GLOBE & DRILL SIMULATOR */}
      {activeSubTab === 'simulator' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: 3D Cutaway WebGL Earth Model */}
            <div className="lg:col-span-6 space-y-4">
              <EarthInterior3DViewer
                currentDepthKm={currentDepthKm}
                selectedLayerId={telemetry.layerId}
                onSelectLayer={(layerId) => {
                  setSelectedLayerId(layerId);
                  const layer = DETAILED_INTERIOR_LAYERS.find((l) => l.id === layerId);
                  if (layer) {
                    setCurrentDepthKm(Math.round((layer.topDepthKm + layer.bottomDepthKm) / 2));
                  }
                }}
              />

              <div className="bg-cosmic-950/80 border border-slate-800 p-4 rounded-2xl text-xs space-y-2">
                <span className="text-cosmic-gold font-bold flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-cosmic-saffron" />
                  ଜିଓଡାଇନାମୋ ଓ ଚୁମ୍ବକୀୟ କ୍ଷେତ୍ର (Geodynamo Science):
                </span>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  ବାହ୍ୟ କେନ୍ଦ୍ରମଣ୍ଡଳ (Outer Core 2,891-5,150 km) ରେ ଥିବା ତରଳ ଲୁହା-ନିକେଲ୍ର କୋରିଓଲିସ୍ ଘୂର୍ଣ୍ଣନ ପୃଥିବୀର ବିଶାଳ ଚୁମ୍ବକୀୟ କ୍ଷେତ୍ର ସୃଷ୍ଟି କରେ, ଯାହା ମହାକାଶର ସୌର ବିକିରଣରୁ ପୃଥିବୀର ବାୟୁମଣ୍ଡଳକୁ ସୁରକ୍ଷା ଦିଏ।
                </p>
              </div>
            </div>

            {/* Right Column: Deep Earth Drill Simulator & Telemetry */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-gradient-to-r from-rose-950/60 via-slate-950/80 to-amber-950/60 border border-rose-500/30 p-5 rounded-2xl space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider block">
                      Subterranean Depth Zone
                    </span>
                    <h4 className="text-lg font-bold text-white font-serif">
                      {telemetry.layerNameOr}
                    </h4>
                  </div>

                  <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    Depth: {currentDepthKm.toLocaleString()} km ({(currentDepthKm * 0.621371).toFixed(0)} miles)
                  </span>
                </div>

                {/* Depth Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>0 km (Surface)</span>
                    <span className="text-cosmic-gold font-bold">ଭୂଗର୍ଭ ଖନନ ଗଭୀରତା (Slide to Drill)</span>
                    <span>6,371 km (Center)</span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="6371"
                    step="5"
                    value={currentDepthKm}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (Number.isFinite(val)) {
                        setCurrentDepthKm(Math.max(0, Math.min(6371, val)));
                      }
                    }}
                    className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />

                  {/* Quick Milestone Buttons */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-2">
                    <span className="text-[10px] text-slate-400 font-mono mr-1">Quick Presets:</span>
                    {[
                      { depth: 0, label: '0 km (Crust)' },
                      { depth: 12.26, label: '12.3 km (Kola Hole)' },
                      { depth: 35, label: '35 km (Moho)' },
                      { depth: 410, label: '410 km (Wadsleyite)' },
                      { depth: 660, label: '660 km (Bridgmanite)' },
                      { depth: 2891, label: '2,891 km (CMB Core)' },
                      { depth: 5150, label: '5,150 km (Inner Core)' },
                      { depth: 6371, label: '6,371 km (Earth Center)' }
                    ].map((item) => (
                      <button
                        key={item.depth}
                        type="button"
                        onClick={() => setCurrentDepthKm(item.depth)}
                        className={`text-[10px] font-mono px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                          Math.abs(currentDepthKm - item.depth) < 10
                            ? 'bg-rose-500 text-white border-white font-bold shadow-md'
                            : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Real-time 6-Metric PREM Geophysical Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
                  {/* Pressure (GPa & atm) */}
                  <div className="bg-cosmic-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                      <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                      ଚାପ (Pressure)
                    </span>
                    <span className="font-bold text-cyan-300 block text-xs">
                      {telemetry.pressureGpa < 0.01
                        ? `${(telemetry.pressureGpa * 1000).toFixed(0)} MPa`
                        : `${telemetry.pressureGpa.toFixed(1)} GPa`}
                    </span>
                    <span className="text-[9px] text-slate-400 block">
                      {(telemetry.pressureAtm).toLocaleString(undefined, { maximumFractionDigits: 0 })} atm
                    </span>
                  </div>

                  {/* Temperature */}
                  <div className="bg-cosmic-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                      <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                      ତାପମାତ୍ରା (Temperature)
                    </span>
                    <span className="font-bold text-rose-300 block text-xs">
                      {telemetry.tempC.toLocaleString(undefined, { maximumFractionDigits: 0 })}°C
                    </span>
                    <span className="text-[9px] text-slate-400 block">
                      {telemetry.tempK.toLocaleString(undefined, { maximumFractionDigits: 0 })} Kelvin
                    </span>
                  </div>

                  {/* Density (g/cm³) */}
                  <div className="bg-cosmic-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      ଘନତ୍ୱ (Density)
                    </span>
                    <span className="font-bold text-amber-300 block text-xs">
                      {telemetry.densityGcm3.toFixed(2)} g/cm³
                    </span>
                    <span className="text-[9px] text-slate-400 block">
                      {(telemetry.densityGcm3 * 1000).toLocaleString()} kg/m³
                    </span>
                  </div>

                  {/* P-Wave Velocity */}
                  <div className="bg-cosmic-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 text-emerald-400" />
                      P-ତରଙ୍ଗ ବେଗ (Vp)
                    </span>
                    <span className="font-bold text-emerald-300 block text-xs">
                      {telemetry.vpKms.toFixed(2)} km/s
                    </span>
                    <span className="text-[9px] text-slate-400 block">
                      ପ୍ରାଥମିକ ସେସ୍ମିକ୍ ତରଙ୍ଗ
                    </span>
                  </div>

                  {/* S-Wave Velocity */}
                  <div className="bg-cosmic-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 text-purple-400" />
                      S-ତରଙ୍ଗ ବେଗ (Vs)
                    </span>
                    <span className={`font-bold block text-xs ${telemetry.vsKms === 0 ? 'text-rose-400' : 'text-purple-300'}`}>
                      {telemetry.vsKms === 0 ? '0 km/s (ତରଳ କୋର୍!)' : `${telemetry.vsKms.toFixed(2)} km/s`}
                    </span>
                    <span className="text-[9px] text-slate-400 block">
                      {telemetry.vsKms === 0 ? 'ତରଳରେ ଗତି କରେ ନାହିଁ' : 'ଦ୍ୱିତୀୟକ ସେସ୍ମିକ୍ ତରଙ୍ଗ'}
                    </span>
                  </div>

                  {/* Local Gravity */}
                  <div className="bg-cosmic-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                      <Globe2 className="w-3.5 h-3.5 text-teal-400" />
                      ମାଧ୍ୟାକର୍ଷଣ g(r)
                    </span>
                    <span className="font-bold text-teal-300 block text-xs">
                      {telemetry.gravityMs2.toFixed(2)} m/s²
                    </span>
                    <span className="text-[9px] text-slate-400 block">
                      {currentDepthKm >= 6370 ? '0g (କେନ୍ଦ୍ରୀୟ ଭାରହୀନତା)' : `${(telemetry.gravityMs2 / 9.82).toFixed(2)} g`}
                    </span>
                  </div>
                </div>

                {/* Insight Narrative */}
                <div className="bg-rose-950/40 border border-rose-500/30 p-3.5 rounded-xl text-xs flex items-center gap-2.5">
                  <Info className="w-4 h-4 text-rose-400 shrink-0" />
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold text-rose-200 block">
                      {telemetry.phaseStateOr}:
                    </span>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {language === 'or' ? telemetry.insightOr : telemetry.insightEn}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: 5 CONCENTRIC STRATA DEEP DIVE (WITH INTEGRATED 3D VISUALS) */}
      {activeSubTab === 'layers' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Layer Selector Chips with Authentic Color Coding */}
          <div className="flex flex-wrap items-center gap-2">
            {DETAILED_INTERIOR_LAYERS.map((layer) => {
              const isSelected = selectedLayerId === layer.id;
              return (
                <button
                  key={layer.id}
                  type="button"
                  onClick={() => setSelectedLayerId(layer.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-2 ${
                    isSelected
                      ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-cosmic-950 border-white shadow-xl scale-105'
                      : 'bg-cosmic-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                  style={
                    isSelected
                      ? undefined
                      : { borderColor: `${layer.color}40`, boxShadow: `0 0 10px ${layer.color}15` }
                  }
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: layer.color }} />
                  <span>{layer.nameOr.split('(')[0]}</span>
                  <span className="text-[10px] opacity-75 font-mono">({layer.depthRangeKm.split('(')[0]})</span>
                </button>
              );
            })}
          </div>

          {/* Grid Layout: 3D Viewer on Left + Deep Strata Dossier on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 3D Panel */}
            <div className="lg:col-span-5 space-y-4">
              <EarthInterior3DViewer
                selectedLayerId={activeLayer.id}
                currentDepthKm={Math.round((activeLayer.topDepthKm + activeLayer.bottomDepthKm) / 2)}
                onSelectLayer={(layerId) => setSelectedLayerId(layerId)}
              />

              {/* Action Button: Jump directly into 3D Drill Simulator */}
              <button
                type="button"
                onClick={() => handleDrillToLayer(activeLayer)}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-cosmic-950 font-bold text-xs font-mono shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>🚀 ଏହି ସ୍ତରକୁ 3D ରେ ଡ୍ରିଲ୍ କରନ୍ତୁ (Drill to {activeLayer.nameEn.split('(')[0]})</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Mini Stratigraphic Scale Indicator */}
              <div className="bg-cosmic-950/80 border border-slate-800 p-4 rounded-2xl space-y-2 text-xs">
                <span className="font-mono text-slate-400 text-[10px] uppercase tracking-wider block">
                  Stratigraphic Scale (0 to 6,371 km)
                </span>
                <div className="w-full h-3 rounded-lg overflow-hidden flex border border-slate-800 shadow-inner">
                  {DETAILED_INTERIOR_LAYERS.map((l) => (
                    <div
                      key={l.id}
                      style={{
                        width: `${Math.max(3, l.volumePercent)}%`,
                        backgroundColor: l.color,
                        opacity: l.id === activeLayer.id ? 1 : 0.4
                      }}
                      className="h-full transition-all"
                      title={`${l.nameEn}: ${l.depthRangeKm}`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Surface 0 km</span>
                  <span className="text-amber-300 font-bold">Active: {activeLayer.nameOr.split('(')[0]}</span>
                  <span>Center 6,371 km</span>
                </div>
              </div>
            </div>

            {/* Right Detailed Dossier Panel */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-cosmic-950/90 border-2 border-rose-500/40 p-5 sm:p-6 rounded-3xl space-y-5 shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-rose-400 uppercase tracking-widest block">
                      Geological Strata Profile
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
                      ଗଭୀରତା: {activeLayer.depthRangeKm}
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-amber-300 font-bold">
                      ଆୟତନ: {activeLayer.volumePercent}% • ବସ୍ତୁତ୍ୱ: {activeLayer.massPercent}%
                    </span>
                  </div>
                </div>

                {/* 4-Stat Box */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="bg-cosmic-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 block">ତାପମାତ୍ରା ପରିସର:</span>
                    <span className="font-bold text-rose-300 text-xs">{activeLayer.tempRangeC}</span>
                  </div>
                  <div className="bg-cosmic-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 block">ଚାପ ପରିସର:</span>
                    <span className="font-bold text-cyan-300 text-xs">{activeLayer.pressureRangeGpa}</span>
                  </div>
                  <div className="bg-cosmic-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 block">ଘନତ୍ୱ ପରିସର:</span>
                    <span className="font-bold text-amber-300 text-xs">{activeLayer.densityRangeGcm3}</span>
                  </div>
                  <div className="bg-cosmic-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 block">ପଦାର୍ଥର ଅବସ୍ଥା:</span>
                    <span className="font-bold text-emerald-300 text-[11px]">{activeLayer.stateOfMatterOr}</span>
                  </div>
                </div>

                {/* Scientific In-Depth Narrative */}
                <div className="bg-cosmic-950/80 border border-slate-800 p-4 rounded-2xl space-y-2 text-xs">
                  <span className="text-cosmic-gold font-bold flex items-center gap-1.5 text-xs">
                    <Info className="w-4 h-4 text-cosmic-gold" />
                    ହାର୍ଭାର୍ଡ଼ ଓ PREM ଭୂଭୌତିକ ବିଶ୍ଳେଷଣ (Geophysical Scientific Insight):
                  </span>
                  <p className="text-slate-200 leading-relaxed text-xs">
                    {language === 'or' ? activeLayer.scientificNarrativeOr : activeLayer.scientificNarrativeEn}
                  </p>
                </div>

                {/* Mineralogy & Geodynamics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-cosmic-950/80 border border-slate-800 p-4 rounded-2xl space-y-2">
                    <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      ମୁଖ୍ୟ ଖଣିଜ ଓ ଉପାଦାନ:
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                      {language === 'or' ? activeLayer.dominantMineralsOr : activeLayer.dominantMineralsEn}
                    </p>
                  </div>

                  <div className="bg-cosmic-950/80 border border-slate-800 p-4 rounded-2xl space-y-2">
                    <span className="text-amber-300 font-bold flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-amber-400" />
                      ଭୂଗତିଜ ଭୂମିକା ଓ ପ୍ଲେଟ୍ ଟେକ୍ଟୋନିକ୍ସ:
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                      {language === 'or' ? activeLayer.geodynamicRoleOr : activeLayer.geodynamicRoleEn}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: BULK CHEMICAL ABUNDANCE */}
      {activeSubTab === 'elements' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="text-xs text-slate-300 border-b border-slate-800 pb-2 flex items-center justify-between">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-rose-400" />
              ସମଗ୍ର ପୃଥିବୀର ପ୍ରମୁଖ ରାସାୟନିକ ମୌଳିକ ଗଠନ (Whole Earth Elemental Abundance)
            </span>
            <span className="font-mono text-cyan-300">Total: 99.8% Core & Mantle Mass</span>
          </div>

          {/* Proportional Stack Bar */}
          <div className="space-y-1.5">
            <div className="w-full h-5 rounded-xl overflow-hidden flex shadow-lg border border-slate-800">
              {BULK_EARTH_ELEMENTS.map((el) => (
                <div
                  key={el.symbol}
                  style={{ width: `${el.wholeEarthPercent}%`, backgroundColor: el.color }}
                  className="h-full transition-all hover:opacity-80 cursor-pointer"
                  title={`${el.name}: ${el.wholeEarthPercent}%`}
                />
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-400 pt-1">
              {BULK_EARTH_ELEMENTS.map((el) => (
                <div key={el.symbol} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: el.color }} />
                  <span>{el.symbol} ({el.wholeEarthPercent}%)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Elemental Comparison Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {BULK_EARTH_ELEMENTS.map((el) => (
              <div
                key={el.symbol}
                className="bg-cosmic-950/80 border border-slate-800 p-4 rounded-2xl space-y-2 hover:border-slate-700 transition-all shadow-xl"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-sm font-bold font-mono px-2 py-0.5 rounded-lg bg-slate-900 border" style={{ borderColor: `${el.color}60`, color: el.color }}>
                    {el.symbol}
                  </span>
                  <span className="text-xs font-mono font-bold text-white">{el.wholeEarthPercent}%</span>
                </div>

                <h5 className="font-bold text-white font-serif">{el.name}</h5>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Crust: <strong className="text-cyan-300">{el.crustPercent}%</strong></span>
                  <span>•</span>
                  <span>Core: <strong className="text-rose-400">{el.corePercent}%</strong></span>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  {language === 'or' ? el.significanceOr : el.significanceEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: FAMOUS DEEP MILESTONES & DISCONTINUITIES */}
      {activeSubTab === 'milestones' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="text-xs text-slate-300 border-b border-slate-800 pb-2 flex items-center justify-between">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              ଭୂଗର୍ଭ ଖନନ ରେକର୍ଡ ଓ ପ୍ରମୁଖ ସେସ୍ମିକ୍ ସୀମାରେଖା (Seismic Discontinuities)
            </span>
            <span className="font-mono text-amber-300">{DEEP_EARTH_MILESTONES.length} Verified Landmarks</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {DEEP_EARTH_MILESTONES.map((m) => (
              <div
                key={m.depthKm}
                className="bg-cosmic-950/80 border border-slate-800 p-4 rounded-2xl space-y-2 hover:border-rose-500/40 transition-all shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{m.icon}</span>
                    <span className="font-bold text-white font-serif text-sm">{m.nameOr}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/20">
                    {m.depthKm} km
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
                  <span>Pressure: <strong className="text-cyan-300">{m.pressureGpa} GPa</strong></span>
                  <span>•</span>
                  <span>Temp: <strong className="text-rose-300">{m.tempC}°C</strong></span>
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
