import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Navigation,
  Compass,
  Volume2,
  VolumeX,
  Gauge,
  Milestone,
  Clock,
  LocateFixed,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  AlertCircle,
  Flag,
  CornerUpRight,
  CornerUpLeft,
  ArrowUp,
  FastForward,
  X,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useI18n } from '../../localization/i18n';
import { RouteResult, calculateHaversineKm, calculateBearingDegrees } from './PilgrimageRouteNavigator';
import { formatDurationHuman } from '../../services/routeEngineService';

export interface SacredHighwayPoi {
  nameOr: string;
  nameEn: string;
  lat: number;
  lon: number;
  radiusKm: number;
  significanceOr: string;
}

export const SACRED_HIGHWAY_POIS: SacredHighwayPoi[] = [
  {
    nameOr: 'ପବିତ୍ର ଦୟା ନଦୀ ଓ ଧଉଳି ଶାନ୍ତି ସ୍ତୂପ',
    nameEn: 'Sacred Daya River & Dhauli Shanti Stupa',
    lat: 20.1923,
    lon: 85.8394,
    radiusKm: 2.0,
    significanceOr: 'କଳିଙ୍ଗ ଯୁଦ୍ଧ ପରେ ସମ୍ରାଟ ଅଶୋକ ଏହି ଦୟା ନଦୀ କୂଳରେ ବୌଦ୍ଧ ଧର୍ମ ଓ ଶାନ୍ତି ଅହିଂସା ଗ୍ରହଣ କରିଥିଲେ।'
  },
  {
    nameOr: 'ପିପିଲି ପ୍ରସିଦ୍ଧ ଚାନ୍ଦୁଆ ଶିଳ୍ପ ନଗରୀ',
    nameEn: 'Pipli Historic Applique Craft Town',
    lat: 20.1172,
    lon: 85.8331,
    radiusKm: 2.5,
    significanceOr: 'ଶ୍ରୀଜଗନ୍ନାଥ ମହାପ୍ରଭୁଙ୍କ ରଥର ପବିତ୍ର ଚାନ୍ଦୁଆ, ଚିତ୍ର ଓ ଧ୍ୱଜା ଏହି ପିପିଲି ଗ୍ରାମରେ ପ୍ରସ୍ତୁତ ହୋଇଥାଏ।'
  },
  {
    nameOr: 'ସାକ୍ଷୀଗୋପାଳ ମନ୍ଦିର (ସତ୍ୟବାଦୀ)',
    nameEn: 'Sakhigopal Temple, Satyabadi',
    lat: 19.9535,
    lon: 85.8196,
    radiusKm: 2.5,
    significanceOr: 'ଶ୍ରୀକ୍ଷେତ୍ର ଯାତ୍ରାରେ ସାକ୍ଷୀଗୋପାଳ ଦର୍ଶନ ବିନା ପୁରୀ ଜଗନ୍ନାଥ ଯାତ୍ରା ଅସମ୍ପୂର୍ଣ୍ଣ ବୋଲି ବିଶ୍ୱାସ କରାଯାଏ।'
  },
  {
    nameOr: 'ଚନ୍ଦନପୁର ପବିତ୍ର ଭାର୍ଗବୀ ନଦୀ ସେତୁ',
    nameEn: 'Chandanpur Bhargabi River Crossing',
    lat: 19.8978,
    lon: 85.8184,
    radiusKm: 1.8,
    significanceOr: 'ଶ୍ରୀକ୍ଷେତ୍ର ପୁରୀର ପବିତ୍ର ସୀମା ଓ ପୁରାତନ ଅଠରନଳା ପ୍ରବେଶ ପଥ ନିକଟସ୍ଥ ଭାର୍ଗବୀ ନଦୀ।'
  },
  {
    nameOr: 'ଐତିହାସିକ ଅଠରନଳା ପ୍ରବେଶ ଦ୍ୱାର (ପୁରୀ)',
    nameEn: 'Historic Atharanala Bridge Entrance',
    lat: 19.8277,
    lon: 85.8288,
    radiusKm: 1.5,
    significanceOr: 'ପୁରୀ ଶ୍ରୀକ୍ଷେତ୍ର ଧାମର ୧୩ଶ ଶତାବ୍ଦୀର ପ୍ରାଚୀନ ୧୮ ନାଳ ଯୁକ୍ତ ପ୍ରବେଶ ଦ୍ୱାର।'
  },
  {
    nameOr: 'କାଠଯୋଡ଼ି ନଦୀ ଓ ବାରବାଟୀ କଟକ ପ୍ରବେଶ',
    nameEn: 'Kathajodi River, Historic Cuttack',
    lat: 20.4485,
    lon: 85.8722,
    radiusKm: 2.0,
    significanceOr: 'ମହାନଦୀର ମୁଖ୍ୟ ଶାଖା କାଠଯୋଡ଼ି ଏବଂ ପ୍ରାଚୀନ କଟକ ନଗରୀର ସୀମା।'
  }
];

interface Props {
  route: RouteResult;
  isSimulated: boolean;
  onVehiclePositionUpdate: (pos: { lat: number; lon: number; heading: number }) => void;
  onClose: () => void;
}

export const LiveNavigationCockpit: React.FC<Props> = ({
  route,
  isSimulated,
  onVehiclePositionUpdate,
  onClose
}) => {
  const { language } = useI18n();

  // Navigation settings & audio states
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(true);
  const [isFollowCamera, setIsFollowCamera] = useState<boolean>(true);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1); // 1x, 2x, 4x
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Live Vehicle Telemetry
  const [currentCoordIndex, setCurrentCoordIndex] = useState<number>(0);
  const [vehiclePos, setVehiclePos] = useState<{ lat: number; lon: number; heading: number }>({
    lat: route.coordinates[0]?.[0] || 20.2668,
    lon: route.coordinates[0]?.[1] || 85.8436,
    heading: route.bearingDegrees || 180
  });
  const [currentSpeedKmh, setCurrentSpeedKmh] = useState<number>(isSimulated ? 56 : 0);
  const [remainingDistKm, setRemainingDistKm] = useState<number>(route.distanceKm);
  const [remainingDurationMin, setRemainingDurationMin] = useState<number>(route.durationMinutes);

  // Active Maneuver & Alert States
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [activeSacredAlert, setActiveSacredAlert] = useState<SacredHighwayPoi | null>(null);
  const lastSpokenAnnouncementRef = useRef<string>('');

  // Audio Speech Utterance
  const speakVoice = (text: string) => {
    if (!isVoiceEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    if (lastSpokenAnnouncementRef.current === text) return;
    lastSpokenAnnouncementRef.current = text;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = language === 'or' ? 'hi-IN' : 'en-IN';
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => v.lang.includes('hi') || v.lang.includes('en-IN') || v.lang.includes('en'));
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('TTS voice warning:', e);
    }
  };

  // Welcome Announcement on Start
  useEffect(() => {
    const welcome =
      language === 'or'
        ? `ନେଭିଗେସନ୍ ଆରମ୍ଭ ହେଲା। ଗନ୍ତବ୍ୟ ସ୍ଥଳ ଦୂରତା ${route.distanceKm} କିଲୋମିଟର। ଶୁଭ ଯାତ୍ରା!`
        : language === 'hi'
        ? `नेविगेशन शुरू हुआ। गंतव्य की दूरी ${route.distanceKm} किलोमीटर है। आपकी यात्रा शुभ हो!`
        : `Navigation started. Distance to destination is ${route.distanceKm} kilometers. Have an auspicious journey!`;
    speakVoice(welcome);
  }, []);

  // 1. REAL LIVE GPS TRACKING (when not in simulation mode)
  useEffect(() => {
    if (isSimulated || typeof navigator === 'undefined' || !navigator.geolocation) return;

    let lastTime = Date.now();
    let lastLat = vehiclePos.lat;
    let lastLon = vehiclePos.lon;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const curLat = pos.coords.latitude;
        const curLon = pos.coords.longitude;
        const heading = pos.coords.heading || calculateBearingDegrees(lastLat, lastLon, curLat, curLon);

        // Speed from GPS or delta
        let speed = pos.coords.speed ? pos.coords.speed * 3.6 : 0;
        if (!speed) {
          const dtHours = (Date.now() - lastTime) / 3600000;
          const dKm = calculateHaversineKm(lastLat, lastLon, curLat, curLon);
          if (dtHours > 0) speed = Math.min(140, Math.round(dKm / dtHours));
        }

        lastTime = Date.now();
        lastLat = curLat;
        lastLon = curLon;

        const newPos = { lat: curLat, lon: curLon, heading };
        setVehiclePos(newPos);
        setCurrentSpeedKmh(Math.round(speed));
        onVehiclePositionUpdate(newPos);

        // Calculate remaining distance to destination
        const destCoord = route.coordinates[route.coordinates.length - 1];
        if (destCoord) {
          const remKm = Number(calculateHaversineKm(curLat, curLon, destCoord[0], destCoord[1]).toFixed(1));
          setRemainingDistKm(remKm);
          const estMins = Math.round((remKm / Math.max(speed || 45, 30)) * 60);
          setRemainingDurationMin(estMins);
        }

        // Check Sacred POIs along the way
        checkSacredPois(curLat, curLon);
      },
      (err) => {
        console.warn('GPS watch error:', err);
      },
      { enableHighAccuracy: false, maximumAge: 10000, timeout: 20000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [isSimulated, route]);

  // 2. SIMULATED TEST-DRIVE ENGINE (smooth animation along actual road coordinates)
  useEffect(() => {
    if (!isSimulated || isPaused) return;
    const coords = route.coordinates;
    if (!coords || coords.length < 2) return;

    const intervalMs = Math.max(120, Math.round(400 / simulationSpeed));

    const timer = setInterval(() => {
      setCurrentCoordIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= coords.length) {
          clearInterval(timer);
          speakVoice(
            language === 'or'
              ? 'ଆପଣ ନିଜ ପବିତ୍ର ଗନ୍ତବ୍ୟ ସ୍ଥଳରେ ପହଞ୍ଚିଗଲେ!'
              : language === 'hi'
              ? 'आप अपने पवित्र गंतव्य पर पहुंच गए हैं!'
              : 'You have arrived at your sacred destination!'
          );
          return prevIndex;
        }

        const p1 = coords[prevIndex];
        const p2 = coords[nextIndex];
        const heading = calculateBearingDegrees(p1[0], p1[1], p2[0], p2[1]);

        // Simulated highway speed variation between 45 and 75 km/h
        const dynamicSpeed = Math.round(52 + Math.sin(nextIndex * 0.4) * 16);
        setCurrentSpeedKmh(dynamicSpeed);

        const newPos = { lat: p2[0], lon: p2[1], heading };
        setVehiclePos(newPos);
        onVehiclePositionUpdate(newPos);

        // Update remaining distance and ETA
        const progressFrac = nextIndex / coords.length;
        const remKm = Number((route.distanceKm * (1 - progressFrac)).toFixed(1));
        const remMins = Math.round(route.durationMinutes * (1 - progressFrac));
        setRemainingDistKm(remKm);
        setRemainingDurationMin(remMins);

        // Update step instructions
        const totalSteps = route.steps.length || 1;
        const currentStep = Math.min(totalSteps - 1, Math.floor(progressFrac * totalSteps));
        if (currentStep !== activeStepIndex) {
          setActiveStepIndex(currentStep);
          const stepText = route.steps[currentStep]?.instruction;
          if (stepText) {
            speakVoice(stepText);
          }
        }

        // Check for passing Sacred POIs
        checkSacredPois(p2[0], p2[1]);

        return nextIndex;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isSimulated, isPaused, simulationSpeed, route]);

  // Sacred POI Proximity Detection
  const checkSacredPois = (lat: number, lon: number) => {
    for (const poi of SACRED_HIGHWAY_POIS) {
      const dist = calculateHaversineKm(lat, lon, poi.lat, poi.lon);
      if (dist <= poi.radiusKm) {
        if (!activeSacredAlert || activeSacredAlert.nameOr !== poi.nameOr) {
          setActiveSacredAlert(poi);
          const alertVoice =
            language === 'or'
              ? `ଆପଣ ${poi.nameOr} ଅତିକ୍ରମ କରୁଛନ୍ତି।`
              : `Passing ${poi.nameEn}.`;
          speakVoice(alertVoice);
        }
        return;
      }
    }
  };

  // ETA Clock Time (e.g. 11:45 AM)
  const etaClockTime = useMemo(() => {
    const arrivalDate = new Date(Date.now() + remainingDurationMin * 60000);
    return arrivalDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, [remainingDurationMin]);

  // Current Maneuver Instruction
  const currentInstruction =
    route.steps[activeStepIndex]?.instruction ||
    (language === 'or'
      ? 'ରାଜପଥ ଦେଇ ସିଧା ଆଗକୁ ବଢ଼ନ୍ତୁ'
      : language === 'hi'
      ? 'राजमार्ग पर सीधे आगे बढ़ें'
      : 'Continue on Highway');

  return (
    <div className="pointer-events-none absolute inset-0 z-[1001] flex flex-col justify-between p-3 sm:p-4 select-none">
      {/* ================= TOP MANEUVER HUD BANNER ================= */}
      <div className="pointer-events-auto flex flex-col items-center gap-2">
        <div className="w-full max-w-xl bg-cosmic-950/95 border-2 border-emerald-500/60 rounded-3xl p-3 sm:p-4 shadow-2xl backdrop-blur-2xl text-white animate-in slide-in-from-top duration-300">
          <div className="flex items-center justify-between gap-3">
            {/* Maneuver Arrow & Distance Badge */}
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-2xl text-slate-950 shadow-lg shadow-emerald-500/30 flex items-center justify-center">
                {currentInstruction.includes('ବାମ') || currentInstruction.includes('बाएं') || currentInstruction.toLowerCase().includes('left') ? (
                  <CornerUpLeft className="w-6 h-6 stroke-[2.5]" />
                ) : currentInstruction.includes('ଡାହାଣ') || currentInstruction.includes('दाएं') || currentInstruction.toLowerCase().includes('right') ? (
                  <CornerUpRight className="w-6 h-6 stroke-[2.5]" />
                ) : (
                  <ArrowUp className="w-6 h-6 stroke-[2.5]" />
                )}
              </div>

              <div>
                <span className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white block">
                  {remainingDistKm > 1
                    ? `${Math.min(remainingDistKm, 2.4)} km`
                    : language === 'or'
                    ? '୨୦୦ ମିଟର'
                    : language === 'hi'
                    ? '२०० मीटर'
                    : '200 meters'}
                </span>
                <span className="text-xs sm:text-sm font-bold text-emerald-300 block line-clamp-1">
                  {currentInstruction}
                </span>
              </div>
            </div>

            {/* Live Navigation Mode Badge & Controls */}
            <div className="flex items-center gap-1.5">
              {isSimulated && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  🎮 {language === 'or' ? 'ସିମୁଲେସନ୍ ଡେମୋ' : language === 'hi' ? 'सिमुलेशन डेमो' : 'Simulation Demo'}
                </span>
              )}
              <button
                type="button"
                onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isVoiceEnabled
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700'
                }`}
                title={isVoiceEnabled ? 'Voice Muted' : 'Voice Enabled'}
              >
                {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-rose-950/80 text-rose-300 border border-rose-500/40 hover:bg-rose-900 cursor-pointer transition-all"
                title="Exit Navigation"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sacred Highway Waypoint Alert Notification */}
          {activeSacredAlert && (
            <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center gap-2 text-xs bg-amber-950/40 p-2 rounded-xl border border-amber-500/30 animate-in fade-in">
              <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 animate-pulse" />
              <div>
                <span className="font-bold text-amber-300 block font-serif">
                  🚩 {activeSacredAlert.nameOr}
                </span>
                <span className="text-[10px] text-slate-300 block">
                  {activeSacredAlert.significanceOr}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= BOTTOM DASHBOARD (Speedometer, ETA & Controls) ================= */}
      <div className="pointer-events-auto flex flex-col items-center gap-2">
        <div className="w-full max-w-xl bg-cosmic-950/95 border-2 border-cosmic-gold/50 rounded-3xl p-3 sm:p-4 shadow-2xl backdrop-blur-2xl text-white">
          <div className="grid grid-cols-3 gap-2 items-center text-center">
            {/* 1. Live Speedometer */}
            <div className="bg-cosmic-900/80 p-2.5 rounded-2xl border border-slate-800">
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block flex items-center justify-center gap-1">
                <Gauge className="w-3 h-3 text-cyan-400" />
                <span>{language === 'or' ? 'ବେଗ (Speed)' : language === 'hi' ? 'गति (Speed)' : 'Speed'}</span>
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono text-cyan-300 block mt-0.5">
                {currentSpeedKmh} <span className="text-[10px] font-normal text-slate-400">km/h</span>
              </span>
            </div>

            {/* 2. Remaining Distance */}
            <div className="bg-cosmic-900/80 p-2.5 rounded-2xl border border-cosmic-gold/40">
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block flex items-center justify-center gap-1">
                <Milestone className="w-3 h-3 text-cosmic-gold" />
                <span>{language === 'or' ? 'ବାକି ଦୂରତା' : language === 'hi' ? 'शेष दूरी' : 'Distance Left'}</span>
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono text-cosmic-gold block mt-0.5">
                {remainingDistKm} <span className="text-[10px] font-normal text-slate-400">KM</span>
              </span>
            </div>

            {/* 3. Live ETA Clock */}
            <div className="bg-cosmic-900/80 p-2.5 rounded-2xl border border-emerald-500/40">
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block flex items-center justify-center gap-1">
                <Clock className="w-3 h-3 text-emerald-400" />
                <span>{language === 'or' ? 'ପହଞ୍ଚିବା ସମୟ' : language === 'hi' ? 'पहुंचने का समय' : 'Arrival Time'}</span>
              </span>
              <span className="text-base sm:text-lg font-black font-sans text-emerald-300 block mt-0.5">
                {etaClockTime}
              </span>
              <span className="text-[9px] text-slate-400 block font-mono">
                {formatDurationHuman(remainingDurationMin, language)[language === 'or' ? 'or' : language === 'hi' ? 'hi' : 'en']}
              </span>
            </div>
          </div>

          {/* Navigation Action Buttons (Simulation controls / Exit) */}
          <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-800">
            {isSimulated ? (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsPaused(!isPaused)}
                  className="px-2.5 py-1.5 rounded-xl bg-cosmic-900 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{isPaused ? (language === 'or' ? 'ଆଗକୁ ଚଲାନ୍ତୁ' : language === 'hi' ? 'चलाएं' : 'Resume') : (language === 'or' ? 'ରଖନ୍ତୁ' : language === 'hi' ? 'रोकें' : 'Pause')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSimulationSpeed(simulationSpeed === 1 ? 2 : simulationSpeed === 2 ? 4 : 1)}
                  className="px-2.5 py-1.5 rounded-xl bg-cosmic-900 border border-slate-700 text-xs font-bold text-cosmic-gold hover:text-white flex items-center gap-1 cursor-pointer"
                  title="Change simulation speed"
                >
                  <FastForward className="w-3.5 h-3.5" />
                  <span>{simulationSpeed}x {language === 'or' ? 'ବେଗ' : language === 'hi' ? 'गति' : 'Speed'}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{language === 'or' ? '୧୦୦% ଲାଇଭ୍ GPS ନେଭିଗେସନ୍ ସକ୍ରିୟ' : language === 'hi' ? '१००% लाइव जीपीएस सक्रिय' : '100% Live GPS Active'}</span>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/30 transition-all cursor-pointer flex items-center gap-1"
            >
              <span>🛑 {language === 'or' ? 'ଯାତ୍ରା ସମାପ୍ତ (End)' : language === 'hi' ? 'यात्रा समाप्त (End)' : 'End Navigation'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
