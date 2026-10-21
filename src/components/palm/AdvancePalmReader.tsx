import React, { useRef, useState, useEffect } from 'react';
import { useI18n } from '../../localization/i18n';
import { Confetti } from './Confetti';
import { judgeRekha, RekhaKey, RekhaObs, PalmLang, REKHA_TITLES } from './palmShastra1';
import { judgeParvat, judgeHasta, overallNirnaya, ParvatKey, ParvatObs, HastaType, AnguliTip, PARVAT_T } from './palmShastra2';
import { analyzePalmImage, toRekhaObs, AutoPalm } from './palmAutoScan';
import { usePalmStorage } from './usePalmStorage';
import { useToast } from '../../components/ui/useToast';
import {
  Camera,
  Upload,
  Sparkles,
  Share2,
  Download,
  CheckCircle2,
  Shield,
  Scroll,
  Eye,
  Info,
  Sliders,
  History,
  Flame,
  Layers,
  Hand
} from 'lucide-react';

const MARK_T: Record<string, Record<PalmLang, string>> = {
  cross: { or: 'କ୍ରସ୍ (+)', hi: 'क्रॉस (+)', en: 'Cross (+)' },
  star: { or: 'ତାରା (★)', hi: 'तारा (★)', en: 'Star (★)' },
  island: { or: 'ଦ୍ୱୀପ (⬭)', hi: 'द्वीप (⬭)', en: 'Island (⬭)' },
  triangle: { or: 'ତ୍ରିକୋଣ (▲)', hi: 'त्रिकोण (▲)', en: 'Triangle (▲)' },
  square: { or: 'ଚତୁର୍ଭୁଜ (■)', hi: 'चतुर्भुज (■)', en: 'Square (■)' },
  dot: { or: 'ବିନ୍ଦୁ (•)', hi: 'बिंदु (•)', en: 'Dot (•)' },
  chain: { or: 'ଶୃଙ୍ଖଳ (☍)', hi: 'शृंखला (☍)', en: 'Chain (☍)' },
  fork: { or: 'ଶାଖା (⑂)', hi: 'शाखा (⑂)', en: 'Fork (⑂)' },
};

const REKHA_KEYS: RekhaKey[] = ['ayu', 'buddhi', 'hridaya', 'bhagya', 'surya', 'vivaha', 'swasthya'];
const PARVAT_KEYS: ParvatKey[] = ['guru', 'shani', 'surya', 'budha', 'mangalPos', 'mangalNeg', 'chandra', 'shukra', 'ketuRahu'];
const MARKS = ['cross', 'star', 'island', 'triangle', 'square', 'dot', 'chain', 'fork'];

// Sacred Planetary Colors & Glyphs
const PLANET_META: Record<ParvatKey, { symbol: string; color: string; labelOr: string; labelHi: string; labelEn: string }> = {
  guru: { symbol: '♃', color: '#eab308', labelOr: 'ବୃହସ୍ପତି (ଗୁରୁ)', labelHi: 'बृहस्पति (गुरु)', labelEn: 'Jupiter' },
  shani: { symbol: '♄', color: '#38bdf8', labelOr: 'ଶନି ଦେବ', labelHi: 'शनि देव', labelEn: 'Saturn' },
  surya: { symbol: '☉', color: '#f59e0b', labelOr: 'ସୂର୍ଯ୍ୟ ଦେବ', labelHi: 'सूर्य देव', labelEn: 'Sun' },
  budha: { symbol: '☿', color: '#10b981', labelOr: 'ବୁଧ ଗ୍ରହ', labelHi: 'बुध ग्रह', labelEn: 'Mercury' },
  mangalPos: { symbol: '♂', color: '#ef4444', labelOr: 'ଉଚ୍ଚ ମଙ୍ଗଳ', labelHi: 'उच्च मंगल', labelEn: 'Upper Mars' },
  mangalNeg: { symbol: '♂', color: '#f97316', labelOr: 'ନୀଚ ମଙ୍ଗଳ', labelHi: 'निम्न मंगल', labelEn: 'Lower Mars' },
  chandra: { symbol: '☽', color: '#c084fc', labelOr: 'ଚନ୍ଦ୍ର ଦେବ', labelHi: 'चन्द्र देव', labelEn: 'Moon' },
  shukra: { symbol: '♀', color: '#f43f5e', labelOr: 'ଶୁକ୍ର ଗ୍ରହ', labelHi: 'शुक्र ग्रह', labelEn: 'Venus' },
  ketuRahu: { symbol: '☊☋', color: '#94a3b8', labelOr: 'ରାହୁ-କେତୁ', labelHi: 'राहु-केतु', labelEn: 'Rahu-Ketu' },
};

// Line Meta & Colors
const REKHA_META: Record<RekhaKey, { color: string; shortOr: string; shortHi: string; shortEn: string }> = {
  ayu: { color: '#f59e0b', shortOr: 'ଆୟୁ ରେଖା', shortHi: 'आयु रेखा', shortEn: 'Life Line' },
  buddhi: { color: '#10b981', shortOr: 'ବୁଦ୍ଧି ରେଖା', shortHi: 'मस्तिष्क रेखा', shortEn: 'Head Line' },
  hridaya: { color: '#f43f5e', shortOr: 'ହୃଦୟ ରେଖା', shortHi: 'हृदय रेखा', shortEn: 'Heart Line' },
  bhagya: { color: '#3b82f6', shortOr: 'ଭାଗ୍ୟ ରେଖା', shortHi: 'भाग्य रेखा', shortEn: 'Fate Line' },
  surya: { color: '#fbbf24', shortOr: 'ସୂର୍ଯ୍ୟ ରେଖା', shortHi: 'सूर्य रेखा', shortEn: 'Sun Line' },
  vivaha: { color: '#fb7185', shortOr: 'ବିବାହ ରେଖା', shortHi: 'विवाह रेखा', shortEn: 'Marriage Line' },
  swasthya: { color: '#06b6d4', shortOr: 'ସ୍ୱାସ୍ଥ୍ୟ ରେଖା', shortHi: 'स्वास्थ्य रेखा', shortEn: 'Health Line' },
};

export const AdvancePalmReader: React.FC = () => {
  const { language } = useI18n();
  const L = (language === 'or' || language === 'hi' ? language : 'en') as PalmLang;
  const tx = (or: string, hi: string, en: string) => (L === 'or' ? or : L === 'hi' ? hi : en);
  const { show: showToast } = useToast();
  const { history, favorites, addReading, toggleFav } = usePalmStorage();

  // Mode Selection
  const [activeMode, setActiveMode] = useState<'camera' | 'chakra' | 'manual'>('camera');
  const [showHistory, setShowHistory] = useState(false);

  // Camera & Image state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [camOn, setCamOn] = useState(false);
  const [camErr, setCamErr] = useState('');
  const [photo, setPhoto] = useState('');
  const [scan, setScan] = useState(0);
  const scanning = scan > 0 && scan < 100;
  const [scanPhaseText, setScanPhaseText] = useState('');

  // Interactive Chakra map selection
  const [selectedElement, setSelectedElement] = useState<{ type: 'rekha' | 'parvat'; key: string } | null>({
    type: 'rekha',
    key: 'ayu',
  });

  // Manual/Customizer Inputs
  const [hasta, setHasta] = useState<HastaType>('akasha');
  const [flex, setFlex] = useState('medium');
  const [tip, setTip] = useState<AnguliTip>('mixed');
  const [knots, setKnots] = useState('mixed');
  const [rekha, setRekha] = useState<Record<RekhaKey, RekhaObs>>({
    ayu: { visible: 'clear', length: 'long', depth: 'deep', marks: [], conf: 1 },
    buddhi: { visible: 'clear', length: 'medium', depth: 'medium', marks: [], conf: 1 },
    hridaya: { visible: 'clear', length: 'long', depth: 'medium', marks: [], conf: 1 },
    bhagya: { visible: 'clear', length: 'long', depth: 'medium', marks: [], conf: 0.8 },
    surya: { visible: 'faint', length: 'medium', depth: 'shallow', marks: [], conf: 0.6 },
    vivaha: { visible: 'clear', length: 'short', depth: 'medium', marks: [], conf: 0.8 },
    swasthya: { visible: 'faint', length: 'short', depth: 'shallow', marks: [], conf: 0.5 },
  });
  const [parvat, setParvat] = useState<Record<ParvatKey, ParvatObs>>({
    guru: { level: 'raised', marks: [] },
    shani: { level: 'normal', marks: [] },
    surya: { level: 'normal', marks: [] },
    budha: { level: 'normal', marks: [] },
    mangalPos: { level: 'normal', marks: [] },
    mangalNeg: { level: 'normal', marks: [] },
    chandra: { level: 'normal', marks: [] },
    shukra: { level: 'raised', marks: [] },
    ketuRahu: { level: 'normal', marks: [] },
  });

  // Output & Results
  const [out, setOut] = useState<{ r: any[]; p: any[]; h: any[]; sum: string } | null>(null);
  const [auto, setAuto] = useState<AutoPalm | null>(null);
  const [autoErr, setAutoErr] = useState('');
  const [celebrate, setCelebrate] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Camera Management
  const startCamera = async () => {
    try {
      setCamErr('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCamOn(true);
      }
    } catch {
      setCamErr(
        tx(
          'କ୍ୟାମେରା ଅନୁମତି ମିଳିଲା ନାହିଁ — ଦୟାକରି ଫଟୋ ଅପଲୋଡ୍ ବଟନ୍ ବ୍ୟବହାର କରନ୍ତୁ।',
          'कैमरा अनुमति नहीं मिली — कृपया फोटो अपलोड बटन का उपयोग करें।',
          'Camera permission denied — please use the Photo Upload button.'
        )
      );
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCamOn(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const capturePhoto = () => {
    const v = videoRef.current;
    if (!v || !v.videoWidth) return;
    const canvas = document.createElement('canvas');
    canvas.width = v.videoWidth;
    canvas.height = v.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(v, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.94);
    setPhoto(dataUrl);
    stopCamera();
    executeScan(dataUrl);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result);
      setPhoto(url);
      executeScan(url);
    };
    reader.readAsDataURL(file);
  };

  const loadImg = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = src;
    });

  // Run AI Scan
  const executeScan = async (srcUrl?: string) => {
    const targetSrc = srcUrl || photo;
    setAutoErr('');
    setOut(null);
    setAuto(null);

    if (!targetSrc) {
      setAutoErr(tx('ପ୍ରଥମେ ହାତର ଫଟୋ ଉଠାନ୍ତୁ ବା ଅପଲୋଡ୍ କରନ୍ତୁ।', 'पहले हाथ का फोटो लें या अपलोड करें।', 'Please capture or upload a palm photo first.'));
      return;
    }

    setScan(1);
    setScanPhaseText(tx('ହାତର ଚର୍ମ ଓ ବାହ୍ୟରେଖା ଚିହ୍ନଟ ହେଉଛି...', 'त्वचा व हाथ की रूपरेखा पहचानी जा रही है...', 'Detecting skin contours & palm outline...'));

    let pending: { r: any[]; p: any[]; h: any[]; sum: string } | null = null;
    let detectedAuto: AutoPalm | null = null;

    try {
      const img = await loadImg(targetSrc);
      const canvas = document.createElement('canvas');
      const scale = Math.min(1, 640 / Math.max(1, img.width));
      canvas.width = Math.max(2, Math.round(img.width * scale));
      canvas.height = Math.max(2, Math.round(img.height * scale));
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) throw new Error('Canvas context failed');

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      const ap = analyzePalmImage({ data: imgData.data, width: canvas.width, height: canvas.height });
      detectedAuto = ap;
      setAuto(ap);

      if (ap.quality === 'poor') {
        setAutoErr(
          tx(
            'ହାତ ଠିକ୍ ଭାବେ ଚିହ୍ନଟ ହୋଇପାରିଲା ନାହିଁ। ଦୟାକରି ସିଧା ଆଲୋକରେ ପୁରା ହାତ ସ୍ପଷ୍ଟ ଦେଖାଯିବା ଭଳି ଫଟୋ ନିଅନ୍ତୁ।',
            'हाथ ठीक से पहचाना नहीं जा सका। कृपया अच्छी रोशनी में पूरा हाथ रखकर दोबारा फोटो लें।',
            'Hand not clearly detected. Please ensure even lighting and full palm visibility.'
          )
        );
        setScan(0);
        return;
      }

      const robs = {} as Record<RekhaKey, RekhaObs>;
      for (const k of REKHA_KEYS) {
        robs[k] = ap.lines[k] ? toRekhaObs(ap.lines[k]) : { visible: 'absent', length: 'short', depth: 'shallow', marks: [], conf: 0 };
      }
      const r = REKHA_KEYS.map((k) => judgeRekha(k, robs[k], L));
      const p = PARVAT_KEYS.map((k) => judgeParvat(k, ap.mounts[k] || { level: 'normal', marks: [] }, L));
      const h = judgeHasta(ap.hasta, 'medium', 'mixed', 'mixed', L);
      pending = { r, p, h, sum: overallNirnaya(r, L) };
    } catch {
      setAutoErr(tx('ଫଟୋ ପଢ଼ିବାରେ ତ୍ରୁଟି ଘଟିଲା — ଦୟାକରି ପୁନର୍ବାର ଚେଷ୍ଟା କରନ୍ତୁ।', 'फोटो पढ़ने में त्रुटि हुई — कृपया पुनः प्रयास करें।', 'Failed to read photo — please try again.'));
      setScan(0);
      return;
    }

    // Animated progress phases
    const interval = setInterval(() => {
      setScan((s) => {
        if (s === 30) {
          setScanPhaseText(tx('୭ ମୁଖ୍ୟ ରେଖା ଓ ୯ ଗ୍ରହ ପର୍ବତ ମନ୍ଥନ...', '७ मुख्य रेखा व ९ ग्रह पर्वतों का मंथन...', 'Analyzing 7 Core Lines & 9 Planetary Mounts...'));
        } else if (s === 70) {
          setScanPhaseText(tx('ସାମୁଦ୍ରିକ ଶାସ୍ତ୍ର ନିର୍ଣ୍ଣୟ ପ୍ରସ୍ତୁତ ହେଉଛି...', 'सामुद्रिक शास्त्र निर्णय तैयार हो रहा है...', 'Synthesizing authentic Samudrika Shastra verdict...'));
        }

        if (s >= 100) {
          clearInterval(interval);
          if (pending) {
            setOut(pending);
            addReading({ lang: L, auto: detectedAuto, out: pending, photo: targetSrc });
            setCelebrate(true);
            showToast(tx('ଶାସ୍ତ୍ରୀୟ ହସ୍ତରେଖା ନିର୍ଣ୍ଣୟ ପ୍ରସ୍ତୁତ!', 'सामुद्रिक हस्तरेखा निर्णय तैयार!', 'Vedic Palmistry Verdict Ready!'));
            setTimeout(() => {
              reportRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 300);
          }
          return 100;
        }
        return s + 5;
      });
    }, 45);
  };

  // Run Manual Astrological Customizer
  const executeManualAssessment = () => {
    setOut(null);
    setAuto(null);
    setAutoErr('');
    setScan(1);
    setScanPhaseText(tx('ଜ୍ୟୋତିଷୀୟ ନିୟମାନୁସାରେ ଫଳାଫଳ ପ୍ରସ୍ତୁତ ହେଉଛି...', 'ज्योतिषीय नियमानुसार फल तैयार हो रहा है...', 'Calculating Shastric findings...'));

    const interval = setInterval(() => {
      setScan((s) => {
        if (s >= 100) {
          clearInterval(interval);
          const r = REKHA_KEYS.map((k) => judgeRekha(k, rekha[k], L));
          const p = PARVAT_KEYS.map((k) => judgeParvat(k, parvat[k], L));
          const h = judgeHasta(hasta, flex, tip, knots, L);
          const verdict = { r, p, h, sum: overallNirnaya(r, L) };
          setOut(verdict);
          addReading({ lang: L, auto: null, out: verdict });
          setCelebrate(true);
          showToast(tx('ଶାସ୍ତ୍ରୀୟ ବିଚାର ପ୍ରସ୍ତୁତ!', 'शास्त्रीय विचार तैयार!', 'Shastric Assessment Ready!'));
          setTimeout(() => {
            reportRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 300);
          return 100;
        }
        return s + 10;
      });
    }, 40);
  };

  const toggleRekhaMark = (key: RekhaKey, mark: string) => {
    setRekha((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        marks: prev[key].marks.includes(mark)
          ? prev[key].marks.filter((m) => m !== mark)
          : [...prev[key].marks, mark],
      },
    }));
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* 1. Divine Royal Header - Ultra High Contrast & Crisp Typography */}
      <div className="relative overflow-hidden rounded-3xl border border-cosmic-gold/40 bg-gradient-to-b from-[#1c1233] via-[#0d0f26] to-[#040612] p-6 sm:p-9 shadow-2xl backdrop-blur-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-400/50 bg-amber-500/15 text-xs font-bold text-amber-300 tracking-wider uppercase shadow-inner">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>{tx('ବୈଦିକ ସାମୁଦ୍ରିକ ଶାସ୍ତ୍ର AI', 'वैदिक सामुद्रिक शास्त्र AI', 'Vedic Samudrika Shastra AI')}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-normal leading-tight">
            <span className="text-amber-400">{tx('ହସ୍ତରେଖା ବିଚାର', 'हस्तरेखा विचार', 'Vedic Palmistry')}</span>{' '}
            <span className="text-slate-300">•</span>{' '}
            <span className="text-amber-200">{tx('ସାମୁଦ୍ରିକ ଶାସ୍ତ୍ର', 'सामुद्रिक शास्त्र', 'Samudrika Shastra')}</span>
          </h1>

          {/* Sacred Shloka Card - Clean Box, High Readability, No Italic */}
          <div className="px-5 py-3 rounded-2xl bg-amber-500/10 border border-amber-400/40 shadow-inner max-w-2xl mx-auto">
            <p className="text-xs sm:text-sm md:text-base font-bold text-amber-200 tracking-wide text-center leading-relaxed">
              " କରାଗ୍ରେ ବସତେ ଲକ୍ଷ୍ମୀଃ କରମଧ୍ୟେ ସରସ୍ୱତୀ । କରମୂଳେ ତୁ ଗୋବିନ୍ଦଃ ପ୍ରଭାତେ କରଦର୍ଶନମ୍ ॥ "
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 max-w-2xl mx-auto leading-relaxed font-medium">
            {tx(
              'ପ୍ରାଚୀନ ଗରୁଡ଼ ପୁରାଣ ଓ ସାମୁଦ୍ରିକ ତିଳକ ଅନୁସାରେ ୭ଟି ମୁଖ୍ୟ ରେଖା, ୯ଟି ଗ୍ରହ ପର୍ବତ ଏବଂ ହସ୍ତ ତତ୍ତ୍ୱର ଶାସ୍ତ୍ରୀୟ ବିଶ୍ଳେଷଣ ।',
              'प्राचीन गरुड़ पुराण एवं सामुद्रिक तिलक अनुसार ७ मुख्य रेखा, ९ ग्रह पर्वत व हस्त तत्त्व का शास्त्रीय विश्लेषण।',
              'Authentic Shastric analysis of 7 core lines, 9 planetary mounts, and elemental hand constitution per Garuda Purana & Samudrika Tilaka.'
            )}
          </p>

          {/* Trust & Scriptural Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/15 text-xs font-semibold text-emerald-300">
              <Scroll className="w-3.5 h-3.5" />
              <span>{tx('ଗରୁଡ଼ ପୁରାଣ (ସାମୁଦ୍ରିକ ଅଧ୍ୟାୟ)', 'गरुड़ पुराण (सामुद्रिक अध्याय)', 'Garuda Purana (Samudrika Adhyaya)')}</span>
            </span>
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-amber-400/40 bg-amber-500/15 text-xs font-semibold text-amber-300">
              <Shield className="w-3.5 h-3.5" />
              <span>{tx('୭ ରେଖା • ୯ ଗ୍ରହ ପର୍ବତ', '७ रेखा • ९ ग्रह पर्वत', '7 Lines • 9 Mounts')}</span>
            </span>
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-sky-400/40 bg-sky-500/15 text-xs font-semibold text-sky-300">
              <Eye className="w-3.5 h-3.5" />
              <span>{tx('୧୦୦% ସୁରକ୍ଷିତ ଡିଭାଇସ୍ ସ୍କାନ୍', '१००% सुरक्षित डिवाइस स्कैन', '100% Device-Only Privacy')}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Professional Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-black/50 border border-white/15 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveMode('camera')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeMode === 'camera'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>{tx('📷 କ୍ୟାମେରା ସ୍କାନ୍', '📷 कैमरा स्कैन', '📷 Camera Scan')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('chakra')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeMode === 'chakra'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Hand className="w-4 h-4" />
            <span>{tx('🖐️ ହସ୍ତରେଖା ଚକ୍ର', '🖐️ हस्तरेखा चक्र', '🖐️ Palm Map')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('manual')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeMode === 'manual'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>{tx('✍️ ବିସ୍ତୃତ ପରୀକ୍ଷା', '✍️ विस्तृत परीक्षा', '✍️ Detailed View')}</span>
          </button>
        </div>

        {/* Past Readings Button */}
        <button
          type="button"
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs sm:text-sm font-bold text-amber-200 transition"
        >
          <History className="w-4 h-4 text-amber-400" />
          <span>{showHistory ? tx('ଇତିହାସ ବନ୍ଦ', 'इतिहास बंद', 'Hide History') : tx('ପୂର୍ବ ପଠନ (ଇତିହାସ)', 'पूर्व पठन (इतिहास)', 'Past Readings')}</span>
          {history.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black">
              {history.length}
            </span>
          )}
        </button>
      </div>

      {/* History Drawer */}
      {showHistory && (
        <div className="rounded-2xl border border-cosmic-gold/30 bg-cosmic-950/95 p-5 backdrop-blur-xl animate-in fade-in duration-200 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-amber-200 flex items-center gap-2">
              <History className="w-4 h-4 text-amber-400" />
              <span>{tx('ସାଇତା ଯାଇଥିବା ହସ୍ତରେଖା ପଠନ', 'सुरक्षित हस्तरेखा पठन', 'Saved Palm Readings')}</span>
            </h3>
            {history.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem('palm_history');
                  window.location.reload();
                }}
                className="text-xs text-rose-400 hover:underline"
              >
                {tx('ସମସ୍ତ ସଫା କରନ୍ତୁ', 'सब साफ करें', 'Clear all')}
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">
              {tx('ଏଯାବତ୍ କୌଣସି ପୂର୍ବ ପଠନ ସାଇତା ହୋଇନାହିଁ।', 'अभी तक कोई पठन सुरक्षित नहीं है।', 'No saved readings yet.')}
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {history.slice(0, 9).map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.out) setOut(item.out);
                    if (item.photo) setPhoto(item.photo);
                    setShowHistory(false);
                    setTimeout(() => reportRef.current?.scrollIntoView({ behavior: 'smooth' }), 200);
                  }}
                  className="p-3.5 rounded-xl border border-white/10 bg-black/40 hover:border-cosmic-gold/40 cursor-pointer transition space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">{item.date}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFav(item.id);
                      }}
                      className="text-amber-400 text-sm"
                    >
                      {favorites.includes(item.id) ? '★' : '☆'}
                    </button>
                  </div>
                  <div className="text-xs font-bold text-amber-100 truncate">
                    {item.out?.sum || tx('ହସ୍ତରେଖା ପରୀକ୍ଷା', 'हस्तरेखा परीक्षा', 'Palm Assessment')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. MODE 1: Camera & Photo AI Scanner */}
      {activeMode === 'camera' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-12 gap-6 items-stretch">
            {/* Viewfinder Card */}
            <div className="md:col-span-7 rounded-3xl border border-cosmic-gold/30 bg-gradient-to-b from-[#130f26]/90 to-[#070916]/90 p-5 flex flex-col justify-between relative overflow-hidden shadow-2xl">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs sm:text-sm font-bold text-amber-200 uppercase tracking-wider">
                      {tx('କ୍ୟାମେରା ଓ ଫଟୋ ସ୍କାନର୍', 'कैमरा व फोटो स्कैनर', 'AI Camera & Photo Scanner')}
                    </span>
                  </div>
                  <span className="text-xs text-slate-300 font-medium">
                    {camOn ? tx('କ୍ୟାମେରା ସକ୍ରିୟ', 'कैमरा चालू', 'Camera Live') : tx('ପ୍ରସ୍ତୁତ', 'तैयार', 'Ready')}
                  </span>
                </div>

                {/* Video / Photo Container */}
                <div className="relative w-full h-[320px] sm:h-[380px] rounded-2xl bg-black/85 border border-white/10 overflow-hidden flex items-center justify-center">
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${camOn ? 'block' : 'hidden'}`}
                  />

                  {!camOn && photo && (
                    <img src={photo} alt="Palm Capture" className="w-full h-full object-cover" />
                  )}

                  {!camOn && !photo && (
                    <div className="text-center p-6 space-y-3">
                      <div className="w-16 h-16 rounded-full bg-amber-400/20 border-2 border-amber-400/50 flex items-center justify-center mx-auto text-amber-300">
                        <Hand className="w-8 h-8" />
                      </div>
                      <p className="text-sm sm:text-base font-bold text-white max-w-sm mx-auto leading-snug">
                        {tx(
                          'ହାତ ପାପୁଲିର ସ୍ପଷ୍ଟ ଫଟୋ ନିଅନ୍ତୁ କିମ୍ବା ଅପଲୋଡ୍ କରନ୍ତୁ',
                          'हथेली का स्पष्ट फोटो लें या अपलोड करें',
                          'Capture or upload a clear photo of your palm'
                        )}
                      </p>
                      <p className="text-xs text-amber-200/80">
                        {tx(
                          '(ସିଧା ଆଲୋକରେ ପାପୁଲିକୁ କ୍ୟାମେରା ଆଗରେ ସିଧା ରଖନ୍ତୁ)',
                          '(सीधी रोशनी में हथेली को कैमरे के सामने रखें)',
                          '(Position palm flat facing the camera under good light)'
                        )}
                      </p>
                    </div>
                  )}

                  {/* Golden Palm Silhouette Overlay Guide */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40">
                    <svg className="w-64 h-80 stroke-cosmic-gold fill-none" viewBox="0 0 200 260" strokeDasharray="4 4" strokeWidth="1.5">
                      <path d="M 60,230 C 50,190 35,160 40,140 C 45,120 60,125 65,145 C 75,170 85,185 90,195 M 90,195 L 90,65 C 90,50 105,50 105,65 L 105,150 M 105,150 L 110,45 C 110,30 125,30 125,45 L 125,150 M 125,150 L 130,55 C 130,40 145,40 145,55 L 145,155 M 145,155 L 150,85 C 150,70 165,70 165,85 L 165,175 C 165,220 150,240 120,245 Z" />
                    </svg>
                  </div>

                  {/* Corner Target Brackets */}
                  <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-amber-400 pointer-events-none" />
                  <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-400 pointer-events-none" />
                  <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-400 pointer-events-none" />
                  <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-amber-400 pointer-events-none" />

                  {/* Holographic Laser Scanning Line */}
                  {scanning && (
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-bounce pointer-events-none" />
                  )}
                </div>
              </div>

              {/* Viewfinder Controls */}
              <div className="mt-4 pt-3 border-t border-white/10 space-y-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  {!camOn ? (
                    <button
                      type="button"
                      onClick={startCamera}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs sm:text-sm transition shadow-lg"
                    >
                      <Camera className="w-4 h-4" />
                      <span>{tx('କ୍ୟାମେରା ଚାଲୁ କରନ୍ତୁ', 'कैमरा चालू करें', 'Start Camera')}</span>
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs sm:text-sm transition shadow-lg"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>{tx('ଫଟୋ ଉଠାନ୍ତୁ ଓ ସ୍କାନ୍ କରନ୍ତୁ', 'फोटो लें व स्कैन करें', 'Snap & Scan')}</span>
                      </button>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="px-4 py-3 rounded-xl border border-rose-400/50 hover:bg-rose-500/10 text-rose-300 font-bold text-xs sm:text-sm transition"
                      >
                        {tx('ବନ୍ଦ', 'बंद', 'Stop')}
                      </button>
                    </>
                  )}

                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-cosmic-gold/40 hover:bg-cosmic-gold/10 text-amber-200 font-bold text-xs sm:text-sm cursor-pointer transition">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>{tx('ଗ୍ୟାଲେରୀରୁ ଫଟୋ ବାଛନ୍ତୁ', 'गैलरी से फोटो चुनें', 'Upload Photo')}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  </label>

                  {photo && !camOn && (
                    <button
                      type="button"
                      onClick={() => executeScan()}
                      className="px-4 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm transition shadow-lg"
                    >
                      {tx('ପୁଣି ସ୍କାନ୍', 'पुनः स्कैन', 'Re-Scan')}
                    </button>
                  )}
                </div>

                {camErr && <p className="text-xs text-rose-300 font-semibold">{camErr}</p>}
                {autoErr && <p className="text-xs text-rose-300 font-semibold">{autoErr}</p>}
              </div>
            </div>

            {/* Scanning Guidance & Status Panel */}
            <div className="md:col-span-5 rounded-3xl border border-white/10 bg-cosmic-950/80 p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <h3 className="text-sm sm:text-base font-bold text-amber-200 flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-400" />
                  <span>{tx('ସଠିକ୍ ସ୍କାନିଂ ପାଇଁ ମାର୍ଗଦର୍ଶକ', 'सटीक स्कैनिंग हेतु निर्देश', 'Scanning Best Practices')}</span>
                </h3>

                <ul className="space-y-3 text-xs sm:text-sm text-slate-200">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{tx('ହାତ ପାପୁଲିକୁ କ୍ୟାମେରା ଆଗରେ ସିଧା ଓ ସମ୍ପୂର୍ଣ୍ଣ ସମତଳ ରଖନ୍ତୁ।', 'हथेली को कैमरे के सामने सीधा और पूरी तरह सपाट रखें।', 'Keep palm flat and facing straight towards the camera.')}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{tx('ହାତ ପଛରେ କୌଣସି ସାଦା ବା ଏକରଙ୍ଗୀ ପୃଷ୍ଠଭୂମି ରଖନ୍ତୁ।', 'हाथ के पीछे एक सादा या एकरंगी बैकग्राउंड रखें।', 'Place hand against a plain, contrasting background.')}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{tx('ସ୍ପଷ୍ଟ ଆଲୋକରେ ଫଟୋ ଉଠାନ୍ତୁ ଯେପରି କୌଣସି ଛାୟା ନ ପଡ଼େ।', 'पर्याप्त रोशनी में फोटो लें ताकि रेखाओं पर कोई छाया न पड़े।', 'Ensure even, clear lighting with zero dark shadows on lines.')}</span>
                  </li>
                </ul>

                {/* Progress Card when Scanning */}
                {scan > 0 && (
                  <div className="p-4 rounded-2xl border border-cosmic-gold/30 bg-cosmic-900/90 space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-amber-200">
                      <span>{scanPhaseText}</span>
                      <span>{scan}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 via-rose-400 to-emerald-400 transition-all duration-150"
                        style={{ width: `${scan}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Auto Detection Telemetry chips */}
                {auto && auto.quality !== 'poor' && (
                  <div className="p-4 rounded-2xl border border-emerald-400/30 bg-emerald-950/20 space-y-3">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="font-bold text-emerald-200">{tx('ଚିହ୍ନଟ ଗୁଣବତ୍ତା', 'पहचान गुणवत्ता', 'Detection Quality')}:</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 font-black text-xs">
                        {auto.quality === 'good' ? tx('ଉତ୍କୃଷ୍ଟ (Good)', 'उत्कृष्ट (Good)', 'Good') : tx('ମଧ୍ୟମ (Fair)', 'मध्यम (Fair)', 'Fair')}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-200 pt-1">
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                        <span className="text-slate-400 block text-xs">{tx('ଚର୍ମ କ୍ଷେତ୍ର', 'त्वचा क्षेत्र', 'Skin Coverage')}</span>
                        <span className="font-bold text-amber-200 text-sm">{Math.round(auto.skinPct * 100)}%</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                        <span className="text-slate-400 block text-xs">{tx('ହସ୍ତ ତତ୍ତ୍ୱ', 'हस्त तत्त्व', 'Hand Element')}</span>
                        <span className="font-bold text-sky-200 text-sm">
                          {auto.hasta === 'vayu'
                            ? tx('ବାୟୁ (Air)', 'वायु (Air)', 'Air')
                            : auto.hasta === 'agni'
                            ? tx('ଅଗ୍ନି (Fire)', 'अग्नि (Fire)', 'Fire')
                            : auto.hasta === 'jala'
                            ? tx('ଜଳ (Water)', 'जल (Water)', 'Water')
                            : auto.hasta === 'prithvi'
                            ? tx('ପୃଥ୍ୱୀ (Earth)', 'पृथ्वी (Earth)', 'Earth')
                            : tx('ମିଶ୍ର (Mixed)', 'मिश्र (Mixed)', 'Mixed')}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-white/10 text-xs text-slate-300 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{tx('ଫଟୋ ଆପଣଙ୍କ ଫୋନ୍/କମ୍ପ୍ୟୁଟର ବାହାରକୁ କଦାପି ପଠାଯାଏ ନାହିଁ।', 'फोटो आपके फ़ोन/कंप्यूटर से कभी बाहर नहीं भेजा जाता।', 'Photos are processed locally and never leave your device.')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODE 2: Interactive Sacred Palm Chakra Map */}
      {activeMode === 'chakra' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-12 gap-6 items-start">
            {/* SVG Interactive Palm Diagram */}
            <div className="lg:col-span-7 rounded-3xl border border-cosmic-gold/30 bg-gradient-to-b from-[#140e24] via-[#090b1c] to-[#04060f] p-6 shadow-2xl relative overflow-hidden flex flex-col items-center">
              <div className="text-center mb-4 space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-amber-200 flex items-center justify-center gap-2">
                  <Hand className="w-4 h-4 text-amber-400" />
                  <span>{tx('ଇଣ୍ଟରାକ୍ଟିଭ୍ ବୈଦିକ ହସ୍ତରେଖା ଚକ୍ର', 'इंटरैक्टिव वैदिक हस्त चक्र', 'Interactive Vedic Palm Chakra')}</span>
                </h3>
                <p className="text-xs text-slate-300">
                  {tx('ଯେକୌଣସି ରେଖା ବା ପର୍ବତ ଉପରେ କ୍ଲିକ୍ କରି ତାର ଶାସ୍ତ୍ରୀୟ ରହସ୍ୟ ଜାଣନ୍ତୁ', 'किसी भी रेखा या पर्वत पर क्लिक कर उसका शास्त्रीय रहस्य जानें', 'Click any line or mount to inspect its sacred meaning')}
                </p>
              </div>

              {/* Vector Palm Graphic */}
              <div className="relative w-full max-w-[360px] aspect-[400/460]">
                <svg viewBox="0 0 400 460" className="w-full h-full select-none">
                  {/* Defs for Glows */}
                  <defs>
                    <radialGradient id="mountGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ffd700" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#ffd700" stopOpacity="0" />
                    </radialGradient>
                    <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Hand Outline */}
                  <path
                    d="M 120,410 C 80,380 50,330 60,250 C 65,210 95,200 110,230 C 120,250 130,270 135,280 L 140,110 C 140,80 165,80 165,110 L 165,210 L 175,70 C 175,40 205,40 205,70 L 205,210 L 215,90 C 215,60 245,60 245,90 L 245,215 L 255,140 C 255,110 280,110 280,140 L 280,250 C 285,320 300,360 270,410 Z"
                    className="fill-[#101428] stroke-cosmic-gold/50 stroke-[2] transition-colors"
                  />

                  {/* Wrist Bracelets (ମଣିବନ୍ଧ ରେଖା) */}
                  <path d="M 130,420 Q 195,435 260,420" stroke="#ffd700" strokeWidth="2" fill="none" opacity="0.6" />
                  <path d="M 135,428 Q 195,443 255,428" stroke="#ffd700" strokeWidth="1.5" fill="none" opacity="0.4" />

                  {/* 1. Ayu Rekha (Life Line) */}
                  <path
                    d="M 138,255 Q 150,330 190,410"
                    stroke={REKHA_META.ayu.color}
                    strokeWidth={selectedElement?.key === 'ayu' ? 5 : 3}
                    fill="none"
                    filter={selectedElement?.key === 'ayu' ? 'url(#glowEffect)' : undefined}
                    className="cursor-pointer hover:opacity-100 transition-all opacity-85"
                    onClick={() => setSelectedElement({ type: 'rekha', key: 'ayu' })}
                  />

                  {/* 2. Buddhi Rekha (Head Line) */}
                  <path
                    d="M 138,255 Q 210,290 270,330"
                    stroke={REKHA_META.buddhi.color}
                    strokeWidth={selectedElement?.key === 'buddhi' ? 5 : 3}
                    fill="none"
                    filter={selectedElement?.key === 'buddhi' ? 'url(#glowEffect)' : undefined}
                    className="cursor-pointer hover:opacity-100 transition-all opacity-85"
                    onClick={() => setSelectedElement({ type: 'rekha', key: 'buddhi' })}
                  />

                  {/* 3. Hridaya Rekha (Heart Line) */}
                  <path
                    d="M 275,260 Q 220,240 160,225"
                    stroke={REKHA_META.hridaya.color}
                    strokeWidth={selectedElement?.key === 'hridaya' ? 5 : 3}
                    fill="none"
                    filter={selectedElement?.key === 'hridaya' ? 'url(#glowEffect)' : undefined}
                    className="cursor-pointer hover:opacity-100 transition-all opacity-85"
                    onClick={() => setSelectedElement({ type: 'rekha', key: 'hridaya' })}
                  />

                  {/* 4. Bhagya Rekha (Fate Line) */}
                  <path
                    d="M 195,410 L 195,220"
                    stroke={REKHA_META.bhagya.color}
                    strokeWidth={selectedElement?.key === 'bhagya' ? 5 : 2.5}
                    fill="none"
                    filter={selectedElement?.key === 'bhagya' ? 'url(#glowEffect)' : undefined}
                    className="cursor-pointer hover:opacity-100 transition-all opacity-85"
                    onClick={() => setSelectedElement({ type: 'rekha', key: 'bhagya' })}
                  />

                  {/* 5. Surya Rekha (Sun Line) */}
                  <path
                    d="M 230,310 L 230,225"
                    stroke={REKHA_META.surya.color}
                    strokeWidth={selectedElement?.key === 'surya' ? 5 : 2.5}
                    fill="none"
                    filter={selectedElement?.key === 'surya' ? 'url(#glowEffect)' : undefined}
                    className="cursor-pointer hover:opacity-100 transition-all opacity-85"
                    onClick={() => setSelectedElement({ type: 'rekha', key: 'surya' })}
                  />

                  {/* 6. Vivaha Rekha (Marriage Line) */}
                  <path
                    d="M 280,245 L 265,245"
                    stroke={REKHA_META.vivaha.color}
                    strokeWidth={selectedElement?.key === 'vivaha' ? 5 : 3}
                    fill="none"
                    filter={selectedElement?.key === 'vivaha' ? 'url(#glowEffect)' : undefined}
                    className="cursor-pointer hover:opacity-100 transition-all opacity-85"
                    onClick={() => setSelectedElement({ type: 'rekha', key: 'vivaha' })}
                  />

                  {/* 7. Swasthya Rekha (Health Line) */}
                  <path
                    d="M 190,390 L 255,270"
                    stroke={REKHA_META.swasthya.color}
                    strokeWidth={selectedElement?.key === 'swasthya' ? 4 : 2}
                    fill="none"
                    filter={selectedElement?.key === 'swasthya' ? 'url(#glowEffect)' : undefined}
                    className="cursor-pointer hover:opacity-100 transition-all opacity-80"
                    onClick={() => setSelectedElement({ type: 'rekha', key: 'swasthya' })}
                  />

                  {/* 9 Mount Nodes (ପର୍ବତ) */}
                  {/* Guru (Jupiter) */}
                  <g className="cursor-pointer" onClick={() => setSelectedElement({ type: 'parvat', key: 'guru' })}>
                    <circle cx="152" cy="218" r="14" fill={PLANET_META.guru.color} fillOpacity={selectedElement?.key === 'guru' ? 0.4 : 0.2} stroke={PLANET_META.guru.color} strokeWidth="1.5" />
                    <text x="152" y="222" textAnchor="middle" fontSize="11" fill="#fff" fontWeight="bold">♃</text>
                  </g>

                  {/* Shani (Saturn) */}
                  <g className="cursor-pointer" onClick={() => setSelectedElement({ type: 'parvat', key: 'shani' })}>
                    <circle cx="190" cy="210" r="14" fill={PLANET_META.shani.color} fillOpacity={selectedElement?.key === 'shani' ? 0.4 : 0.2} stroke={PLANET_META.shani.color} strokeWidth="1.5" />
                    <text x="190" y="214" textAnchor="middle" fontSize="11" fill="#fff" fontWeight="bold">♄</text>
                  </g>

                  {/* Surya (Sun) */}
                  <g className="cursor-pointer" onClick={() => setSelectedElement({ type: 'parvat', key: 'surya' })}>
                    <circle cx="230" cy="215" r="14" fill={PLANET_META.surya.color} fillOpacity={selectedElement?.key === 'surya' ? 0.4 : 0.2} stroke={PLANET_META.surya.color} strokeWidth="1.5" />
                    <text x="230" y="219" textAnchor="middle" fontSize="11" fill="#fff" fontWeight="bold">☉</text>
                  </g>

                  {/* Budha (Mercury) */}
                  <g className="cursor-pointer" onClick={() => setSelectedElement({ type: 'parvat', key: 'budha' })}>
                    <circle cx="268" cy="235" r="13" fill={PLANET_META.budha.color} fillOpacity={selectedElement?.key === 'budha' ? 0.4 : 0.2} stroke={PLANET_META.budha.color} strokeWidth="1.5" />
                    <text x="268" y="239" textAnchor="middle" fontSize="11" fill="#fff" fontWeight="bold">☿</text>
                  </g>

                  {/* Shukra (Venus) */}
                  <g className="cursor-pointer" onClick={() => setSelectedElement({ type: 'parvat', key: 'shukra' })}>
                    <circle cx="115" cy="310" r="18" fill={PLANET_META.shukra.color} fillOpacity={selectedElement?.key === 'shukra' ? 0.4 : 0.2} stroke={PLANET_META.shukra.color} strokeWidth="1.5" />
                    <text x="115" y="315" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">♀</text>
                  </g>

                  {/* Chandra (Moon) */}
                  <g className="cursor-pointer" onClick={() => setSelectedElement({ type: 'parvat', key: 'chandra' })}>
                    <circle cx="255" cy="360" r="17" fill={PLANET_META.chandra.color} fillOpacity={selectedElement?.key === 'chandra' ? 0.4 : 0.2} stroke={PLANET_META.chandra.color} strokeWidth="1.5" />
                    <text x="255" y="365" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">☽</text>
                  </g>

                  {/* Upper Mars (ମଙ୍ଗଳ +) */}
                  <g className="cursor-pointer" onClick={() => setSelectedElement({ type: 'parvat', key: 'mangalPos' })}>
                    <circle cx="265" cy="285" r="12" fill={PLANET_META.mangalPos.color} fillOpacity={selectedElement?.key === 'mangalPos' ? 0.4 : 0.2} stroke={PLANET_META.mangalPos.color} strokeWidth="1.5" />
                    <text x="265" y="289" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="bold">♂+</text>
                  </g>

                  {/* Lower Mars (ମଙ୍ଗଳ -) */}
                  <g className="cursor-pointer" onClick={() => setSelectedElement({ type: 'parvat', key: 'mangalNeg' })}>
                    <circle cx="138" cy="275" r="12" fill={PLANET_META.mangalNeg.color} fillOpacity={selectedElement?.key === 'mangalNeg' ? 0.4 : 0.2} stroke={PLANET_META.mangalNeg.color} strokeWidth="1.5" />
                    <text x="138" y="279" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="bold">♂-</text>
                  </g>

                  {/* Rahu-Ketu */}
                  <g className="cursor-pointer" onClick={() => setSelectedElement({ type: 'parvat', key: 'ketuRahu' })}>
                    <circle cx="195" cy="330" r="13" fill={PLANET_META.ketuRahu.color} fillOpacity={selectedElement?.key === 'ketuRahu' ? 0.4 : 0.2} stroke={PLANET_META.ketuRahu.color} strokeWidth="1.5" />
                    <text x="195" y="334" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="bold">☊</text>
                  </g>
                </svg>
              </div>

              {/* Quick Select Pill Buttons */}
              <div className="mt-4 flex flex-wrap justify-center gap-1.5 max-w-lg">
                {REKHA_KEYS.map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setSelectedElement({ type: 'rekha', key: k })}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                      selectedElement?.key === k
                        ? 'border border-amber-400 bg-amber-400/25 text-amber-200'
                        : 'border border-white/10 bg-white/5 text-slate-300 hover:text-white'
                    }`}
                  >
                    {REKHA_META[k][L === 'or' ? 'shortOr' : L === 'hi' ? 'shortHi' : 'shortEn']}
                  </button>
                ))}
                {PARVAT_KEYS.map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setSelectedElement({ type: 'parvat', key: k })}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold transition ${
                      selectedElement?.key === k
                        ? 'border border-amber-400 bg-amber-400/25 text-amber-200'
                        : 'border border-white/10 bg-white/5 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {PLANET_META[k].symbol} {PLANET_META[k][L === 'or' ? 'labelOr' : L === 'hi' ? 'labelHi' : 'labelEn']}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Element Insight Card */}
            <div className="lg:col-span-5 rounded-3xl border border-cosmic-gold/30 bg-cosmic-950/85 p-6 space-y-4 backdrop-blur-xl">
              {selectedElement?.type === 'rekha' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full shadow-lg"
                      style={{ backgroundColor: REKHA_META[selectedElement.key as RekhaKey].color }}
                    />
                    <h4 className="text-base sm:text-lg font-extrabold text-amber-200">
                      {REKHA_TITLES[selectedElement.key as RekhaKey][L]}
                    </h4>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                      {tx('ଶାସ୍ତ୍ରୀୟ ଲକ୍ଷଣ ଓ ପ୍ରଭାବ', 'शास्त्रीय लक्षण व प्रभाव', 'Shastric Rule & Significance')}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                      {judgeRekha(selectedElement.key as RekhaKey, rekha[selectedElement.key as RekhaKey], L).phala}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-400/30 space-y-1">
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                      {tx('ବୈଦିକ ପ୍ରତିକାର ଓ ଉପାୟ', 'वैदिक उपाय', 'Vedic Remedy')}
                    </span>
                    <p className="text-xs sm:text-sm text-amber-100 font-medium">
                      {judgeRekha(selectedElement.key as RekhaKey, rekha[selectedElement.key as RekhaKey], L).upay}
                    </p>
                  </div>

                  <div className="text-xs text-slate-400 font-medium">
                    {tx('ପ୍ରମାଣ ଗ୍ରନ୍ଥ: ', 'प्रमाण ग्रन्थ: ', 'Source Scripture: ')}
                    <span className="text-slate-300">{judgeRekha(selectedElement.key as RekhaKey, rekha[selectedElement.key as RekhaKey], L).source}</span>
                  </div>
                </div>
              )}

              {selectedElement?.type === 'parvat' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{PLANET_META[selectedElement.key as ParvatKey].symbol}</span>
                    <h4 className="text-base sm:text-lg font-extrabold text-amber-200">
                      {PARVAT_T[selectedElement.key as ParvatKey][L]}
                    </h4>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2">
                    <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block">
                      {tx('ଗ୍ରହ କାରକତ୍ୱ ଓ ଫଳ', 'ग्रह कारकत्व व फल', 'Planetary Influence')}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                      {judgeParvat(selectedElement.key as ParvatKey, parvat[selectedElement.key as ParvatKey], L).phala}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-400/30 space-y-1">
                    <span className="text-xs font-bold text-sky-300 uppercase tracking-wider block">
                      {tx('ଗ୍ରହ ଶାନ୍ତି ଓ ଦାନ', 'ग्रह शांति व दान', 'Planetary Harmonization')}
                    </span>
                    <p className="text-xs sm:text-sm text-sky-100 font-medium">
                      {judgeParvat(selectedElement.key as ParvatKey, parvat[selectedElement.key as ParvatKey], L).upay}
                    </p>
                  </div>

                  <div className="text-xs text-slate-400 font-medium">
                    {tx('ପ୍ରମାଣ ଗ୍ରନ୍ଥ: ', 'प्रमाण ग्रन्थ: ', 'Source Scripture: ')}
                    <span className="text-slate-300">{judgeParvat(selectedElement.key as ParvatKey, parvat[selectedElement.key as ParvatKey], L).source}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. MODE 3: Detailed Astrological Customizer */}
      {activeMode === 'manual' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-cosmic-gold/30 bg-cosmic-950/85 p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-amber-200 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span>{tx('ଜ୍ୟୋତିଷୀୟ ନିର୍ଦ୍ଦିଷ୍ଟ ପରୀକ୍ଷା ଫର୍ମ', 'विस्तृत ज्योतिषीय हस्त परीक्षा', 'Astrological Line & Mount Evaluator')}</span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  {tx('ପ୍ରତ୍ୟେକ ରେଖାର ଗଭୀରତା, ଦୈର୍ଘ୍ୟ ଓ ଚିହ୍ନ ଚୟନ କରି ନିର୍ଦ୍ଦିଷ୍ଟ ଫଳାଫଳ ପ୍ରସ୍ତୁତ କରନ୍ତୁ', 'प्रत्येक रेखा की गहराई, लंबाई व चिह्न चुनकर सटीक फल प्राप्त करें', 'Customize line length, depth, and auspicious marks')}
                </p>
              </div>
            </div>

            {/* Pancha Bhuta Hand Type & Thumb */}
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
              <label className="text-xs sm:text-sm text-slate-200 space-y-1.5 block">
                <span className="font-bold text-amber-200">{tx('ହସ୍ତ ପ୍ରକୃତି (ପଞ୍ଚଭୂତ)', 'हस्त प्रकृति (पंचभूत)', 'Hand Element')}</span>
                <select
                  value={hasta}
                  onChange={(e) => setHasta(e.target.value as HastaType)}
                  className="w-full rounded-xl bg-black/60 border border-white/15 px-3 py-2 text-xs sm:text-sm text-slate-100"
                >
                  <option value="vayu">{tx('ବାୟୁ ହସ୍ତ (ବିଚାରଶୀଳ)', 'वायु हस्त (विचारशील)', 'Air (Intellectual)')}</option>
                  <option value="agni">{tx('ଅଗ୍ନି ହସ୍ତ (ଊର୍ଜାବାନ)', 'अग्नि हस्त (ऊर्जावान)', 'Fire (Dynamic)')}</option>
                  <option value="jala">{tx('ଜଳ ହସ୍ତ (ଭାବପ୍ରବଣ)', 'जल हस्त (भावुक)', 'Water (Intuitive)')}</option>
                  <option value="prithvi">{tx('ପୃଥ୍ୱୀ ହସ୍ତ (କର୍ମଠ)', 'पृथ्वी हस्त (कर्मठ)', 'Earth (Practical)')}</option>
                  <option value="akasha">{tx('ମିଶ୍ର ହସ୍ତ (ସନ୍ତୁଳିତ)', 'मिश्र हस्त (संतुलित)', 'Mixed (Versatile)')}</option>
                </select>
              </label>

              <label className="text-xs sm:text-sm text-slate-200 space-y-1.5 block">
                <span className="font-bold text-amber-200">{tx('ବୃଦ୍ଧାଙ୍ଗୁଳି (ସଂକଳ୍ପ ବଳ)', 'अंगूठा (संकल्प)', 'Thumb Flexibility')}</span>
                <select
                  value={flex}
                  onChange={(e) => setFlex(e.target.value)}
                  className="w-full rounded-xl bg-black/60 border border-white/15 px-3 py-2 text-xs sm:text-sm text-slate-100"
                >
                  <option value="flexible">{tx('ନମନୀୟ (ଅନୁକୂଳନଶୀଳ)', 'लचीला (अनुकूलनशील)', 'Flexible (Adaptable)')}</option>
                  <option value="medium">{tx('ମଧ୍ୟମ (ସନ୍ତୁଳିତ)', 'मध्यम (संतुलित)', 'Medium (Balanced)')}</option>
                  <option value="stiff">{tx('କଠିନ (ଦୃଢ଼ ସଂକଳ୍ପ)', 'कड़ा (दृढ़ संकल्पी)', 'Stiff (Firm Will)')}</option>
                </select>
              </label>

              <label className="text-xs sm:text-sm text-slate-200 space-y-1.5 block">
                <span className="font-bold text-amber-200">{tx('ଅଙ୍ଗୁଳି ଅଗ୍ର (Tip)', 'अंगुली अग्र', 'Fingertip Type')}</span>
                <select
                  value={tip}
                  onChange={(e) => setTip(e.target.value as AnguliTip)}
                  className="w-full rounded-xl bg-black/60 border border-white/15 px-3 py-2 text-xs sm:text-sm text-slate-100"
                >
                  <option value="conic">{tx('ଶଙ୍ଖାକାର (କଳାପ୍ରେମୀ)', 'शंखाकार (कलाप्रेमी)', 'Conic (Artistic)')}</option>
                  <option value="pointed">{tx('ନୁକିଲା (ଅଧ୍ୟାତ୍ମିକ)', 'नुकीला (आध्यात्मिक)', 'Pointed (Spiritual)')}</option>
                  <option value="square">{tx('ଚତୁଃସ୍କନ୍ଧ (ବ୍ୟବସ୍ଥିତ)', 'चौकोर (व्यवस्थित)', 'Square (Systematic)')}</option>
                  <option value="spatulate">{tx('ଚାପଟା (କାର୍ଯ୍ୟଦକ୍ଷ)', 'चपटा (कार्यदक्ष)', 'Spatulate (Active)')}</option>
                  <option value="mixed">{tx('ମିଶ୍ର (ସାଧାରଣ)', 'मिश्र (सामान्य)', 'Mixed')}</option>
                </select>
              </label>

              <label className="text-xs sm:text-sm text-slate-200 space-y-1.5 block">
                <span className="font-bold text-amber-200">{tx('ଅଙ୍ଗୁଳି ଗ୍ରନ୍ଥି (Knots)', 'ग्रंथि', 'Finger Knots')}</span>
                <select
                  value={knots}
                  onChange={(e) => setKnots(e.target.value)}
                  className="w-full rounded-xl bg-black/60 border border-white/15 px-3 py-2 text-xs sm:text-sm text-slate-100"
                >
                  <option value="smooth">{tx('ମସୃଣ (ତ୍ୱରିତ ନିର୍ଣ୍ଣୟ)', 'मुलायम (त्वरित निर्णय)', 'Smooth (Intuitive)')}</option>
                  <option value="knotted">{tx('ଗ୍ରନ୍ଥିଯୁକ୍ତ (ତାର୍କିକ)', 'ग्रंथियुक्त (तार्किक)', 'Knotted (Analytical)')}</option>
                  <option value="mixed">{tx('ମିଶ୍ର', 'मिश्र', 'Mixed')}</option>
                </select>
              </label>
            </div>

            {/* 7 Core Lines Customizer */}
            <div className="space-y-3">
              <h4 className="text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wider">
                {tx('୭ ମୁଖ୍ୟ ରେଖା ବିଶ୍ଳେଷଣ ନିର୍ଣ୍ଣୟ', '७ मुख्य रेखा लक्षण', '7 Core Lines Signs')}
              </h4>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {REKHA_KEYS.map((k) => (
                  <div key={k} className="p-4 rounded-2xl border border-white/10 bg-black/40 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-bold text-amber-100">{REKHA_TITLES[k][L]}</span>
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: REKHA_META[k].color }}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 text-xs">
                      <select
                        value={rekha[k].visible}
                        onChange={(e) =>
                          setRekha((prev) => ({
                            ...prev,
                            [k]: { ...prev[k], visible: e.target.value as any },
                          }))
                        }
                        className="rounded-lg bg-cosmic-950 border border-white/15 px-2 py-1.5 text-slate-200"
                      >
                        <option value="clear">{tx('ସ୍ପଷ୍ଟ', 'स्पष्ट', 'Clear')}</option>
                        <option value="faint">{tx('କ୍ଷୀଣ', 'क्षीण', 'Faint')}</option>
                        <option value="broken">{tx('ଖଣ୍ଡିତ', 'खंडित', 'Broken')}</option>
                        <option value="absent">{tx('ଅଭାବ', 'अभाव', 'Absent')}</option>
                      </select>

                      <select
                        value={rekha[k].length}
                        onChange={(e) =>
                          setRekha((prev) => ({
                            ...prev,
                            [k]: { ...prev[k], length: e.target.value as any },
                          }))
                        }
                        className="rounded-lg bg-cosmic-950 border border-white/15 px-2 py-1.5 text-slate-200"
                      >
                        <option value="long">{tx('ଦୀର୍ଘ', 'दीर्घ', 'Long')}</option>
                        <option value="medium">{tx('ମଧ୍ୟମ', 'मध्यम', 'Medium')}</option>
                        <option value="short">{tx('ହ୍ରସ୍ୱ', 'ह्रस्व', 'Short')}</option>
                      </select>

                      <select
                        value={rekha[k].depth}
                        onChange={(e) =>
                          setRekha((prev) => ({
                            ...prev,
                            [k]: { ...prev[k], depth: e.target.value as any },
                          }))
                        }
                        className="rounded-lg bg-cosmic-950 border border-white/15 px-2 py-1.5 text-slate-200"
                      >
                        <option value="deep">{tx('ଗଭୀର', 'गंभीर', 'Deep')}</option>
                        <option value="medium">{tx('ମଧ୍ୟମ', 'मध्यम', 'Medium')}</option>
                        <option value="shallow">{tx('ଉଥିଲା', 'उथला', 'Shallow')}</option>
                      </select>
                    </div>

                    {/* Auspicious Marks */}
                    <div className="pt-1 flex flex-wrap gap-1">
                      {MARKS.slice(0, 5).map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => toggleRekhaMark(k, m)}
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold transition ${
                            rekha[k].marks.includes(m)
                              ? 'border border-emerald-400 bg-emerald-500/20 text-emerald-200'
                              : 'border border-white/10 bg-white/5 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {MARK_T[m][L]}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 9 Mounts Customizer */}
            <div className="space-y-3">
              <h4 className="text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wider">
                {tx('୯ ଗ୍ରହ ପର୍ବତ ଉନ୍ନତି ସ୍ଥିତି', '९ ग्रह पर्वत स्थिति', '9 Planetary Mount Levels')}
              </h4>
              <div className="grid sm:grid-cols-3 gap-2.5">
                {PARVAT_KEYS.map((k) => (
                  <label key={k} className="p-3 rounded-xl border border-white/10 bg-black/30 block text-xs sm:text-sm space-y-1">
                    <span className="font-bold text-slate-200 flex items-center gap-1.5">
                      <span>{PLANET_META[k].symbol}</span>
                      <span>{PARVAT_T[k][L]}</span>
                    </span>
                    <select
                      value={parvat[k].level}
                      onChange={(e) =>
                        setParvat((prev) => ({
                          ...prev,
                          [k]: { ...prev[k], level: e.target.value as any },
                        }))
                      }
                      className="w-full rounded-lg bg-cosmic-950 border border-white/15 px-3 py-1.5 text-slate-200"
                    >
                      <option value="raised">{tx('ଉନ୍ନତ (Raised)', 'उन्नत (Raised)', 'Raised')}</option>
                      <option value="normal">{tx('ସାମାନ୍ୟ (Normal)', 'सामान्य (Normal)', 'Normal')}</option>
                      <option value="flat">{tx('ଚପଟା (Flat)', 'चपटा (Flat)', 'Flat')}</option>
                      <option value="depressed">{tx('ଦବା (Depressed)', 'दबा (Depressed)', 'Depressed')}</option>
                    </select>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Assessment */}
            <button
              type="button"
              onClick={executeManualAssessment}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-black text-sm sm:text-base hover:shadow-xl transition-all shadow-amber-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>{tx('ଶାସ୍ତ୍ରୀୟ ନିର୍ଣ୍ଣୟ ପ୍ରସ୍ତୁତ କରନ୍ତୁ', 'शास्त्रीय निर्णय तैयार करें', 'Generate Shastric Report')}</span>
            </button>
          </div>
        </div>
      )}

      {/* 6. Comprehensive Shastric Report Card */}
      {out && (
        <div ref={reportRef} className="space-y-6 pt-4 animate-in fade-in duration-300">
          {/* Report Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-cosmic-900/70 border border-cosmic-gold/30">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📜</span>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-amber-200">
                  {tx('ପ୍ରାମାଣିକ ସାମୁଦ୍ରିକ ଶାସ୍ତ୍ର ପତ୍ରିକା', 'प्रमाणिक सामुद्रिक शास्त्र पत्रिका', 'Authentic Samudrika Shastra Report')}
                </h3>
                <span className="text-xs text-slate-300">
                  {tx('ଗରୁଡ଼ ପୁରାଣ ଓ ସାମୁଦ୍ରିକ ତିଳକ ଆଧାରିତ ନିର୍ଣ୍ଣୟ', 'गरुड़ पुराण व सामुद्रिक तिलक आधारित', 'Based on Garuda Purana & Samudrika Tilaka')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  try {
                    navigator.share?.({
                      title: 'ଦିବ୍ୟଜ୍ୟୋତି କାଳିଆ ପାଞ୍ଜି • ହସ୍ତରେଖା ରିପୋର୍ଟ',
                      text: `${out.sum}\n\nଦିବ୍ୟଜ୍ୟୋତି କାଳିଆ ପାଞ୍ଜି (DivyaJyoti Kalia Panjika)`,
                    });
                  } catch {
                    showToast(tx('ଲିଙ୍କ୍ କପି ହୋଇଛି', 'लिंक कॉपी हो गया', 'Report copied to clipboard'));
                  }
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs sm:text-sm font-bold text-amber-200 transition"
              >
                <Share2 className="w-4 h-4" />
                <span>{tx('ବାଣ୍ଟନ୍ତୁ', 'बांटें', 'Share')}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-black transition shadow-lg"
              >
                <Download className="w-4 h-4" />
                <span>{tx('ପ୍ରିଣ୍ଟ୍ / PDF', 'प्रिंट / PDF', 'Print / PDF')}</span>
              </button>
            </div>
          </div>

          {/* Grand Shastric Holistic Verdict */}
          <div className="p-6 sm:p-7 rounded-3xl border-2 border-cosmic-gold/50 bg-gradient-to-br from-amber-500/20 via-[#181329] to-[#0a0c1a] shadow-2xl relative overflow-hidden space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🛕</span>
              <span className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-widest">
                {tx('ସମଗ୍ର ଶାସ୍ତ୍ରୀୟ ମହା-ନିର୍ଣ୍ଣୟ', 'समग्र शास्त्रीय महा-निर्णय', 'Grand Shastric Synthesis')}
              </span>
            </div>

            <p className="text-base sm:text-lg md:text-xl font-bold text-amber-100 leading-relaxed">
              {out.sum}
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs text-slate-200">
              <span className="px-3 py-1 rounded-full bg-black/50 border border-white/15">
                {tx('୭ ରେଖା ବିଶ୍ଳେଷିତ', '७ रेखा विश्लेषित', '7 Lines Analyzed')}
              </span>
              <span className="px-3 py-1 rounded-full bg-black/50 border border-white/15">
                {tx('୯ ଗ୍ରହ ପର୍ବତ ପ୍ରମାଣିତ', '९ ग्रह पर्वत प्रमाणित', '9 Mounts Evaluated')}
              </span>
              <span className="px-3 py-1 rounded-full bg-black/50 border border-white/15">
                {tx('କର୍ମ ପ୍ରଧାନ ବିଚାର', 'कर्म प्रधान विचार', 'Karma-Centered Guidance')}
              </span>
            </div>
          </div>

          {/* 7 Core Lines Breakdown */}
          <div className="space-y-3">
            <h4 className="text-sm sm:text-base font-bold text-amber-200 flex items-center gap-2">
              <Scroll className="w-4 h-4 text-amber-400" />
              <span>{tx('୭ ମହା ରେଖାର ଶାସ୍ତ୍ରୋକ୍ତ ବିବରଣୀ', '७ महा रेखाओं का शास्त्रीय विवरण', '7 Core Lines Detailed Analysis')}</span>
            </h4>

            <div className="grid md:grid-cols-2 gap-4">
              {out.r.map((item: any) => (
                <div
                  key={item.key}
                  className="p-4 sm:p-5 rounded-2xl border border-white/15 bg-cosmic-950/80 hover:border-cosmic-gold/40 transition space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-amber-100 flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: REKHA_META[item.key as RekhaKey]?.color || '#ffd700' }}
                      />
                      <span>{item.title}</span>
                    </span>
                    <span className="text-xs text-slate-300 font-medium">{item.source}</span>
                  </div>

                  <div className="text-xs sm:text-sm text-slate-200 leading-relaxed space-y-1.5 font-normal">
                    <p><strong className="text-amber-300 font-semibold">{tx('ଲକ୍ଷଣ: ', 'लक्षण: ', 'Signs: ')}</strong>{item.lakshana}</p>
                    <p><strong className="text-emerald-300 font-semibold">{tx('ଫଳ: ', 'फल: ', 'Verdict: ')}</strong>{item.phala}</p>
                  </div>

                  {item.upay && (
                    <div className="pt-2.5 border-t border-white/10 text-xs sm:text-sm text-amber-200 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span><strong className="font-semibold">{tx('ଉପାୟ: ', 'उपाय: ', 'Remedy: ')}</strong>{item.upay}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 9 Mounts & Elemental Nature */}
          <div className="grid lg:grid-cols-12 gap-6">
            {/* 9 Mounts Potency */}
            <div className="lg:col-span-7 space-y-3">
              <h4 className="text-sm sm:text-base font-bold text-amber-200 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>{tx('୯ ଗ୍ରହ ପର୍ବତ ଶକ୍ତି', '९ ग्रह पर्वत शक्ति', '9 Planetary Mount Potency')}</span>
              </h4>

              <div className="grid sm:grid-cols-2 gap-3">
                {out.p.map((item: any) => (
                  <div key={item.key} className="p-3.5 rounded-xl border border-white/15 bg-black/50 space-y-1.5 text-xs sm:text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sky-200 flex items-center gap-1.5">
                        <span className="text-base">{PLANET_META[item.key as ParvatKey]?.symbol}</span>
                        <span>{item.title}</span>
                      </span>
                      <span className="text-xs text-slate-300 font-medium">{item.lakshana}</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">{item.phala}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hand & Finger Elements */}
            <div className="lg:col-span-5 space-y-3">
              <h4 className="text-sm sm:text-base font-bold text-amber-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>{tx('ପଞ୍ଚଭୂତ ହସ୍ତ ଓ ସଂକଳ୍ପ ତତ୍ତ୍ୱ', 'पंचभूत हस्त व संकल्प तत्त्व', 'Pancha-Bhuta & Willpower')}</span>
              </h4>

              <div className="space-y-3">
                {out.h.map((item: any) => (
                  <div key={item.key} className="p-4 rounded-2xl border border-white/15 bg-black/50 space-y-1.5 text-xs sm:text-sm">
                    <div className="flex items-center justify-between">
                      <b className="text-rose-200 text-sm">{item.title}</b>
                      <span className="text-xs text-slate-400">{item.source}</span>
                    </div>
                    <p className="text-slate-100">{item.lakshana}</p>
                    <p className="text-xs text-amber-200 pt-1">
                      <strong className="text-amber-300">{tx('ଉପାୟ: ', 'उपाय: ', 'Remedy: ')}</strong>{item.upay}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Shastric Disclaimer Footer */}
          <div className="p-4 sm:p-5 rounded-2xl border border-white/10 bg-black/50 text-center space-y-1 text-xs text-slate-300">
            <p className="text-amber-100/90 font-medium leading-relaxed">
              {tx(
                'ଶ୍ରଦ୍ଧା-ମୂଳକ ବୈଦିକ ମାର୍ଗଦର୍ଶନ — "କର୍ମଣ୍ୟେବାଧିକାରସ୍ତେ ମା ଫଲେଷୁ କଦାଚନ" । କର୍ମ ହିଁ ଭାଗ୍ୟର ସର୍ବୋତ୍ତମ ନିର୍ମାତା।',
                'श्रद्धा-मूलक वैदिक मार्गदर्शन — "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन"। कर्म ही भाग्य का सर्वोच्च निर्माता है।',
                'Faith-rooted Vedic guidance — Karma is the supreme architect of destiny.'
              )}
            </p>
          </div>
        </div>
      )}

      {celebrate && <Confetti onFinish={() => setCelebrate(false)} />}
    </div>
  );
};

export default AdvancePalmReader;
