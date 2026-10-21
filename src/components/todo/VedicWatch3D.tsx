import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useI18n } from '../../localization/i18n';
import { DayWindows, NowStatus, getVedicGhatiVighati, timeStrToMinutes } from '../../core/todo/todoPlanner';
import { Clock, Compass, ShieldAlert, Sparkles, Sun, Moon, Crown } from 'lucide-react';
import { VEDIC_WATCH_LOGOS, DEFAULT_WATCH_LOGO_ID, getWatchLogoById, VedicWatchLogo } from '../../core/todo/vedicWatchLogos';
import { VedicWatchLogoModal } from './VedicWatchLogoModal';

interface VedicWatch3DProps {
  now: Date;
  windows: DayWindows;
  status: NowStatus;
}

export const VedicWatch3D: React.FC<VedicWatch3DProps> = ({ now, windows, status }) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const { t, formatNumber, language } = useI18n();

  // Active Watch Logo State (persisted in localStorage)
  const [activeLogoId, setActiveLogoId] = useState<string>(() => {
    try {
      return localStorage.getItem('vedic_watch_active_logo') || DEFAULT_WATCH_LOGO_ID;
    } catch {
      return DEFAULT_WATCH_LOGO_ID;
    }
  });
  const activeLogo = getWatchLogoById(activeLogoId);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  const handleSelectLogo = (id: string) => {
    setActiveLogoId(id);
    try {
      localStorage.setItem('vedic_watch_active_logo', id);
    } catch {}
  };

  // Ref to canvas & texture for dynamic logo updates on 3D dial
  const logoTextureRef = useRef<{
    canvas?: HTMLCanvasElement;
    ctx?: CanvasRenderingContext2D | null;
    texture?: THREE.CanvasTexture;
  }>({});

  // Hands refs for smooth Three.js animation
  const handsRef = useRef<{
    hour?: THREE.Mesh;
    minute?: THREE.Mesh;
    second?: THREE.Mesh;
  }>({});

  // Real-time calculation of angles
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const ms = now.getMilliseconds();

  const hourAngle = -((hours % 12) + minutes / 60) * (Math.PI / 6); // 30 deg per hr
  const minuteAngle = -(minutes + seconds / 60) * (Math.PI / 30);  // 6 deg per min
  const secondAngle = -(seconds + ms / 1000) * (Math.PI / 30);

  // Vedic Ghati / Vighati
  const ghatiData = getVedicGhatiVighati(now, windows.sunrise);

  // Digital formatted time
  const pad2 = (n: number) => String(n).padStart(2, '0');
  const h12 = hours % 12 || 12;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const digitalTimeStr = `${pad2(h12)}:${pad2(minutes)}:${pad2(seconds)} ${ampm}`;
  const odiaDigitsTime = `${formatNumber(pad2(h12))}:${formatNumber(pad2(minutes))}:${formatNumber(pad2(seconds))} ${ampm === 'AM' ? (language === 'or' ? 'ପୂର୍ବାହ୍ନ' : language === 'hi' ? 'पूर्वाह्न' : 'AM') : (language === 'or' ? 'ଅପରାହ୍ନ' : language === 'hi' ? 'अपराह्न' : 'PM')}`;

  // Three.js 3D Clock Dial
  useEffect(() => {
    const host = hostRef.current;
    if (!host || typeof window === 'undefined') return;

    let renderer: THREE.WebGLRenderer | null = null;
    let group: THREE.Group | null = null;
    let animId = 0;
    const disposables: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const trackGeo = <G extends THREE.BufferGeometry>(g: G): G => { disposables.push(g); return g; };
    const trackMat = <M extends THREE.Material>(m: M): M => { materials.push(m); return m; };

    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      const w0 = host.clientWidth || 260;
      const h0 = host.clientHeight || 260;
      renderer.setSize(w0, h0, false);
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.display = 'block';
      host.innerHTML = '';
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, w0 / h0, 0.1, 50);
      camera.position.set(0, 0, 5.8);

      group = new THREE.Group();
      scene.add(group);

      // ── Outer Metallic Gold Bezel ──
      const bezelGeo = trackGeo(new THREE.TorusGeometry(2.1, 0.12, 16, 96));
      const bezelMat = trackMat(new THREE.MeshStandardMaterial({
        color: 0xF59E0B,
        metalness: 0.9,
        roughness: 0.2,
      }));
      const bezel = new THREE.Mesh(bezelGeo, bezelMat);
      group.add(bezel);

      // Inner Gold Ring
      const innerBezelGeo = trackGeo(new THREE.TorusGeometry(1.95, 0.03, 12, 64));
      const innerBezelMat = trackMat(new THREE.MeshBasicMaterial({ color: 0xFDE047, transparent: true, opacity: 0.6 }));
      group.add(new THREE.Mesh(innerBezelGeo, innerBezelMat));

      // ── Helper to render vector SVG with 100% full artwork onto 3D dial canvas ──
      const renderDialToCanvas = (
        logo: VedicWatchLogo,
        canvas: HTMLCanvasElement,
        ctx: CanvasRenderingContext2D,
        texture: THREE.CanvasTexture
      ) => {
        // 1. Synchronous baseline paint
        ctx.clearRect(0, 0, 512, 512);
        logo.renderCanvas(ctx, 512);
        texture.needsUpdate = true;

        // 2. High-definition vector SVG render with all intricate artwork (fringes, flutes, spokes, gems, flags)
        if (typeof window !== 'undefined' && logo.dialSvgString) {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            ctx.clearRect(0, 0, 512, 512);
            ctx.drawImage(img, 0, 0, 512, 512);
            texture.needsUpdate = true;
          };
          img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(logo.dialSvgString);
        }
      };

      // ── Full Smart Watch Wallpaper Dial Face (512x512 Canvas Texture) ──
      const logoCanvas = document.createElement('canvas');
      logoCanvas.width = 512;
      logoCanvas.height = 512;
      const logoCtx = logoCanvas.getContext('2d');
      const logoTexture = new THREE.CanvasTexture(logoCanvas);
      logoTextureRef.current = { canvas: logoCanvas, ctx: logoCtx, texture: logoTexture };

      if (logoCtx) {
        renderDialToCanvas(activeLogo, logoCanvas, logoCtx, logoTexture);
      }

      const dialGeo = trackGeo(new THREE.CircleGeometry(1.94, 64));
      const dialMat = trackMat(new THREE.MeshBasicMaterial({
        map: logoTexture,
      }));
      const dialFace = new THREE.Mesh(dialGeo, dialMat);
      dialFace.position.z = -0.01;
      group.add(dialFace);

      // ── Muhurta Colored Arcs (outer rim) ──
      // Converts time string "HH:MM AM" into 12-hour dial angle
      const timeToAngle = (tStr: string): number => {
        const mins = timeStrToMinutes(tStr);
        if (mins < 0) return 0;
        const hours12 = (mins / 60) % 12;
        return (hours12 / 12) * Math.PI * 2;
      };

      const addArc = (startStr: string, endStr: string, color: number, radius = 1.90) => {
        const a1 = timeToAngle(startStr);
        const a2 = timeToAngle(endStr);
        let span = a2 - a1;
        if (span < 0) span += Math.PI * 2;
        if (span < 0.01) return;
        const arcGeo = trackGeo(new THREE.TorusGeometry(radius, 0.035, 8, 48, span));
        const arcMat = trackMat(new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.85 }));
        const arcMesh = new THREE.Mesh(arcGeo, arcMat);
        // Three.js Torus starts at (radius, 0). Rotate so 0 rad is at 12 o'clock
        arcMesh.rotation.z = Math.PI / 2 - a1 - span;
        group?.add(arcMesh);
      };

      // Brahma Muhurta (Emerald Green)
      addArc(windows.brahma.start, windows.brahma.end, 0x10B981);
      // Abhijit (Cosmic Gold)
      addArc(windows.abhijit.start, windows.abhijit.end, 0xF59E0B);
      // Rahu Kaal (Ruby Red)
      addArc(windows.rahu.start, windows.rahu.end, 0xEF4444);

      // ── Hour Hand (Luxury Faceted Golden Sword Hand) ──
      const hourGeo = trackGeo(new THREE.BoxGeometry(0.09, 0.95, 0.04));
      hourGeo.translate(0, 0.42, 0); // pivot at base
      const hourMat = trackMat(new THREE.MeshStandardMaterial({ color: 0xFDE047, metalness: 0.95, roughness: 0.15 }));
      const hourMesh = new THREE.Mesh(hourGeo, hourMat);
      hourMesh.position.z = 0.06;
      group.add(hourMesh);
      handsRef.current.hour = hourMesh;

      // ── Minute Hand (Slender Golden Baton Hand) ──
      const minGeo = trackGeo(new THREE.BoxGeometry(0.055, 1.4, 0.04));
      minGeo.translate(0, 0.65, 0);
      const minMat = trackMat(new THREE.MeshStandardMaterial({ color: 0xFFFFFF, metalness: 0.8, roughness: 0.25 }));
      const minMesh = new THREE.Mesh(minGeo, minMat);
      minMesh.position.z = 0.08;
      group.add(minMesh);
      handsRef.current.minute = minMesh;

      // ── Second Hand (Cyan Glowing Needle - Sweeps at 60fps) ──
      const secGeo = trackGeo(new THREE.BoxGeometry(0.024, 1.62, 0.03));
      secGeo.translate(0, 0.72, 0);
      const secMat = trackMat(new THREE.MeshBasicMaterial({ color: 0x38BDF8 }));
      const secMesh = new THREE.Mesh(secGeo, secMat);
      secMesh.position.z = 0.1;
      group.add(secMesh);
      handsRef.current.second = secMesh;

      // ── Center Ruby Pivot ──
      const centerCapGeo = trackGeo(new THREE.SphereGeometry(0.12, 16, 16));
      const centerCapMat = trackMat(new THREE.MeshStandardMaterial({ color: 0xE11D48, roughness: 0.2, metalness: 0.8 }));
      const centerCap = new THREE.Mesh(centerCapGeo, centerCapMat);
      centerCap.position.z = 0.14;
      group.add(centerCap);

      // Lighting
      const ambLight = new THREE.AmbientLight(0xffffff, 0.95);
      scene.add(ambLight);
      const dirLight = new THREE.DirectionalLight(0xfff5cc, 1.6);
      dirLight.position.set(3, 4, 5);
      scene.add(dirLight);

      // The watch stays rock solid and constant — no mouse tilt/drift!
      group.rotation.set(0, 0, 0);

      // ── Render loop: Continuous Smooth Mechanical Sweep ("PURA MAKHAN KI TARHA") ──
      const render = () => {
        animId = requestAnimationFrame(render);

        // High-precision sub-second sweep calculations
        const d = new Date();
        const msLive = d.getMilliseconds();
        const secSweep = d.getSeconds() + msLive / 1000;
        const minSweep = d.getMinutes() + secSweep / 60;
        const hrSweep = (d.getHours() % 12) + minSweep / 60;

        if (handsRef.current.second) {
          handsRef.current.second.rotation.z = -secSweep * (Math.PI / 30);
        }
        if (handsRef.current.minute) {
          handsRef.current.minute.rotation.z = -minSweep * (Math.PI / 30);
        }
        if (handsRef.current.hour) {
          handsRef.current.hour.rotation.z = -hrSweep * (Math.PI / 6);
        }

        renderer?.render(scene, camera);
      };
      render();

      return () => {
        cancelAnimationFrame(animId);
        disposables.forEach(g => g.dispose());
        materials.forEach(m => m.dispose());
        renderer?.dispose();
        if (renderer?.domElement && host.contains(renderer.domElement)) {
          host.removeChild(renderer.domElement);
        }
      };
    } catch {
      setWebglSupported(false);
    }
  }, [windows]);

  // Dynamic update of Logo on 3D dial canvas
  useEffect(() => {
    const { canvas, ctx, texture } = logoTextureRef.current;
    if (canvas && ctx && texture) {
      // 1. Immediate synchronous baseline
      ctx.clearRect(0, 0, 512, 512);
      activeLogo.renderCanvas(ctx, 512);
      texture.needsUpdate = true;

      // 2. Full-fidelity vector SVG rendering
      if (typeof window !== 'undefined' && activeLogo.dialSvgString) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          ctx.clearRect(0, 0, 512, 512);
          ctx.drawImage(img, 0, 0, 512, 512);
          texture.needsUpdate = true;
        };
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(activeLogo.dialSvgString);
      }
    }
  }, [activeLogoId, activeLogo]);

  // Update hands smoothly on state tick
  useEffect(() => {
    if (handsRef.current.hour) handsRef.current.hour.rotation.z = hourAngle;
    if (handsRef.current.minute) handsRef.current.minute.rotation.z = minuteAngle;
    if (handsRef.current.second) handsRef.current.second.rotation.z = secondAngle;
  }, [hourAngle, minuteAngle, secondAngle]);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cosmic-950 via-cosmic-900/90 to-slate-950 border border-cosmic-gold/30 p-5 sm:p-7 shadow-2xl backdrop-blur-xl">
      {/* Background radial glow */}
      <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-cosmic-gold/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="relative grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* ── 3D Watch Dial Area ── */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div
            onClick={() => setIsLogoModalOpen(true)}
            className="group relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center cursor-pointer select-none"
            title={language === 'or' ? 'କ୍ଲିକ୍ କରି ୨୦ଟି ଆଧୁନିକ ସ୍ମାର୍ଟ ୱାଚ୍ ଫେସ୍ ଓ ୱାଲପେପର୍ ବାଛନ୍ତୁ' : language === 'hi' ? 'क्लिक करके २० आधुनिक स्मार्ट वॉच फेस व वॉलपेपर चुनें' : 'Click to choose from 20 modern smart watch faces & wallpapers'}
          >
            {/* Outer decorative golden bezel shadow */}
            <div className="absolute inset-0 rounded-full border border-cosmic-gold/30 shadow-[0_0_35px_rgba(245,158,11,0.25)] group-hover:border-cosmic-gold/70 group-hover:shadow-[0_0_50px_rgba(245,158,11,0.45)] transition-all pointer-events-none" />

            {/* Three.js host */}
            <div ref={hostRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

            {/* AR Sapphire Crystal Glare (anti-reflective luxury curved highlight) */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-transparent to-white/10 pointer-events-none mix-blend-overlay" />

            {/* Non-WebGL Fallback if device lacks hardware acceleration */}
            {!webglSupported && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-cosmic-950 border-4 border-cosmic-gold">
                <Clock className="w-16 h-16 text-cosmic-gold animate-spin" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-3 text-[11px] font-medium text-slate-400">
            <Compass className="w-3.5 h-3.5 text-cosmic-gold animate-pulse" />
            <span>{language === 'or' ? '୩D ବୈଦିକ କାଳ ଚକ୍ର • ସ୍ମୁଥ୍ ସ୍ୱିପ୍' : language === 'hi' ? '3D वैदिक काल चक्र • स्थिर व मक्खन चाल' : '3D Vedic Kaala Watch • Butter-Smooth Sweep'}</span>
          </div>

          {/* Smart Watch Wallpaper Selector Pill (Below watch, not covering dial) */}
          <button
            type="button"
            onClick={() => setIsLogoModalOpen(true)}
            className="flex items-center gap-2 mt-2.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-cosmic-gold/20 via-amber-500/25 to-cosmic-gold/20 hover:from-cosmic-gold/35 hover:to-amber-500/35 border border-cosmic-gold/40 text-cosmic-gold text-xs font-bold transition-all hover:scale-105 shadow-lg shadow-cosmic-gold/15"
            title={language === 'or' ? '୨୦ଟି ସ୍ମାର୍ଟ ୱାଚ୍ ଫେସ୍ ଓ ୱାଲପେପର୍ ବଦଳାନ୍ତୁ' : 'Change 20 Smart Watch Faces & Wallpapers'}
          >
            <Crown className="w-4 h-4 text-cosmic-gold animate-bounce" />
            <span>{language === 'or' ? `ୱାଚ୍ ଫେସ୍: ${activeLogo.nameOr}` : language === 'hi' ? `वाच फेस: ${activeLogo.nameHi}` : `Watch Face: ${activeLogo.nameEn}`}</span>
            <span className="text-[10px] bg-cosmic-gold text-cosmic-950 px-2 py-0.5 rounded-full font-mono font-extrabold">୨୦ ୱାଲପେପର୍</span>
          </button>
        </div>

        {/* ── Real-Time Digital & Vedic Readout ── */}
        <div className="md:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-cosmic-gold">
                {language === 'or' ? 'ପ୍ରତ୍ୟକ୍ଷ ବୈଦିକ କାଳ ମାନ' : language === 'hi' ? 'प्रत्यक्ष वैदिक काल मान' : 'LIVE VEDIC ASTRO TIME'}
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight bg-gradient-to-r from-white via-yellow-100 to-cosmic-gold bg-clip-text text-transparent">
                {digitalTimeStr}
              </div>
              <div className="text-xs font-semibold text-cosmic-gold/90 mt-0.5">
                {odiaDigitsTime}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Quick 20 Wallpapers / Dial Faces Trigger Button */}
              <button
                type="button"
                onClick={() => setIsLogoModalOpen(true)}
                className="px-3.5 py-2 rounded-2xl border border-cosmic-gold/40 bg-cosmic-gold/10 hover:bg-cosmic-gold/25 text-cosmic-gold text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-cosmic-gold/10 transition-all hover:scale-105"
                title={language === 'or' ? '୨୦ଟି ସ୍ମାର୍ଟ ୱାଚ୍ ୱାଲପେପର୍ ଦେଖନ୍ତୁ ଓ ବାଛନ୍ତୁ' : language === 'hi' ? '२० स्मार्ट वाच वॉलपेपर देखें व चुनें' : 'Browse & choose from 20 Smart Watch Wallpapers'}
              >
                <Crown className="w-3.5 h-3.5 text-cosmic-gold animate-bounce" />
                <span className="hidden sm:inline">{language === 'or' ? 'ୱାଚ୍ ୱାଲପେପର୍' : language === 'hi' ? 'वाच वॉलपेपर' : 'Watch Faces'}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-cosmic-gold/30 text-[10px] font-mono">୨୦</span>
              </button>

              {/* Active Muhurta Badge */}
              <div className={`px-4 py-2 rounded-2xl border text-xs font-bold flex items-center gap-2 shadow-lg ${
                status.kind === 'auspicious'
                  ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 shadow-emerald-500/10'
                  : status.kind === 'inauspicious'
                    ? 'bg-rose-500/15 border-rose-500/50 text-rose-300 shadow-rose-500/10'
                    : 'bg-sky-500/15 border-sky-500/50 text-sky-300 shadow-sky-500/10'
              }`}>
                <span className={`w-2.5 h-2.5 rounded-full animate-ping ${status.kind === 'auspicious' ? 'bg-emerald-400' : status.kind === 'inauspicious' ? 'bg-rose-400' : 'bg-sky-400'}`} />
                <div>
                  <div className="text-[10px] uppercase opacity-75">{t('ms_td_now')}</div>
                  <div className="text-sm font-bold">
                    {status.windowName === 'brahma' ? t('brahma_muhurta') : status.windowName === 'abhijit' ? t('abhijit') : status.windowName === 'rahu' ? t('rahu_kaal') : status.windowName === 'yamaganda' ? t('yamaganda') : status.windowName === 'gulika' ? t('gulika') : t('ms_td_now_free')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ghati & Vighati Counter */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="rounded-2xl border border-white/10 bg-cosmic-950/60 p-3">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                {language === 'or' ? 'ଘଡ଼ି (ଘାଟୀ)' : language === 'hi' ? 'घटी (२४ मि)' : 'Ghati (24 min)'}
              </div>
              <div className="mt-1 text-lg font-bold text-amber-300 font-mono">
                {formatNumber(ghatiData.ghati)} <span className="text-xs font-normal text-slate-400">{language === 'or' ? 'ଘଡ଼ି' : 'Ghati'}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-cosmic-950/60 p-3">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Moon className="w-3.5 h-3.5 text-sky-400" />
                {language === 'or' ? 'ବିପଳ (ପଳ)' : language === 'hi' ? 'विपल / पल' : 'Vighati (24 sec)'}
              </div>
              <div className="mt-1 text-lg font-bold text-sky-300 font-mono">
                {formatNumber(ghatiData.vighati)} <span className="text-xs font-normal text-slate-400">{language === 'or' ? 'ବିପଳ' : 'Vighati'}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-cosmic-950/60 p-3 col-span-2 sm:col-span-1">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-cosmic-gold" />
                {language === 'or' ? 'ସୂର୍ଯ୍ୟୋଦୟ' : language === 'hi' ? 'सूर्योदय' : 'Sunrise'}
              </div>
              <div className="mt-1 text-base font-bold text-slate-100 font-mono">
                {windows.sunrise}
              </div>
            </div>
          </div>

          {/* Color-coded Muhurta Legend Bar */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium bg-black/40 border border-white/5 rounded-2xl px-4 py-2.5">
            <span className="text-slate-400">{language === 'or' ? 'ଚକ୍ର ସଙ୍କେତ:' : language === 'hi' ? 'चक्र संकेत:' : 'Dial Arcs:'}</span>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
              <span>{t('brahma_muhurta')}</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
              <span>{t('abhijit')}</span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
              <span>{t('rahu_kaal')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 20 Stylish Watch Logos Modal ── */}
      <VedicWatchLogoModal
        isOpen={isLogoModalOpen}
        activeLogoId={activeLogoId}
        onSelectLogo={handleSelectLogo}
        onClose={() => setIsLogoModalOpen(false)}
      />
    </div>
  );
};
