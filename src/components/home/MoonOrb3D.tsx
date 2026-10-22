// ============================================================================
//  MOON ORB 3D — a real three.js moon, lit by the ACTUAL illuminated fraction.
//  Procedural crater texture, phase-accurate terminator, live tithi data.
// ============================================================================
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useI18n } from '../../localization/i18n';
import { DayPanjika } from '../../types/panjika';
import { MoonStar } from 'lucide-react';

interface Props { panjika: DayPanjika; }

const makeMoonTexture = (): THREE.CanvasTexture => {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 256;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#b9bcc6';
  ctx.fillRect(0, 0, 512, 256);
  // Dark maria patches
  for (let i = 0; i < 14; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 256;
    const r = 18 + Math.random() * 34;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, 'rgba(86,90,104,0.34)');
    g.addColorStop(1, 'rgba(86,90,104,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  // Craters with bright rims
  for (let i = 0; i < 110; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 256;
    const r = 1.5 + Math.random() * 5.5;
    ctx.fillStyle = `rgba(70,74,86,${0.16 + Math.random() * 0.18})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(232,234,240,0.32)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, r + 1, 0, Math.PI * 2);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};

export const MoonOrb3D: React.FC<Props> = ({ panjika }) => {
  const { language, formatNumber, formatTime } = useI18n();
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const illum = Math.min(1, Math.max(0, panjika.moonPhase));

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let renderer: THREE.WebGLRenderer | null = null;
    let raf = 0;
    let ro: ResizeObserver | null = null;
    let sphere: THREE.Mesh | null = null;
    let starField: THREE.Points | null = null;
    let texture: THREE.CanvasTexture | null = null;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      const w0 = host.clientWidth || 260;
      const h0 = host.clientHeight || 170;
      renderer.setSize(w0, h0, false);
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.display = 'block';
      host.appendChild(renderer.domElement);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(36, w0 / h0, 0.1, 50);
      camera.position.set(0, 0, 3.6);
      texture = makeMoonTexture();
      const geo = new THREE.SphereGeometry(1, 72, 72);
      const mat = new THREE.MeshStandardMaterial({
        map: texture,
        bumpMap: texture,
        bumpScale: 0.012,
        roughness: 0.96,
        metalness: 0,
      });
      sphere = new THREE.Mesh(geo, mat);
      scene.add(sphere);
      scene.add(new THREE.HemisphereLight(0x9aaed6, 0x111827, 0.38));
      // Convert illuminated fraction to the Sun–Moon phase angle.
      const phaseAngle = Math.acos(1 - 2 * illum);
      const sunlight = new THREE.DirectionalLight(0xfff1d6, 3.2);
      sunlight.position.set(Math.sin(phaseAngle) * 4, 0.55, Math.cos(phaseAngle) * 4);
      scene.add(sunlight);
      const earthshine = new THREE.DirectionalLight(0x6479b8, 0.18);
      earthshine.position.set(0, -0.4, 3);
      scene.add(earthshine);
      const stars = new Float32Array(180);
      for (let i = 0; i < stars.length; i += 3) {
        const angle = i * 2.399;
        const radius = 1.35 + ((i * 17) % 100) / 38;
        stars[i] = Math.cos(angle) * radius;
        stars[i + 1] = Math.sin(angle) * radius * 0.58;
        stars[i + 2] = -0.7 - ((i * 13) % 100) / 70;
      }
      const starGeometry = new THREE.BufferGeometry();
      starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(stars, 3));
      starField = new THREE.Points(
        starGeometry,
        new THREE.PointsMaterial({ color: 0xb9c8f5, size: 0.018, transparent: true, opacity: 0.68, sizeAttenuation: true })
      );
      scene.add(starField);
      const clock = new THREE.Clock();
      const render = () => {
        raf = requestAnimationFrame(render);
        if (sphere) sphere.rotation.y += clock.getDelta() * 0.16;
        renderer!.render(scene, camera);
      };
      render();
      ro = new ResizeObserver(() => {
        const nw = host.clientWidth;
        const nh = host.clientHeight;
        if (nw > 0 && nh > 0) {
          renderer!.setSize(nw, nh, false);
          camera.aspect = nw / nh;
          camera.updateProjectionMatrix();
        }
      });
      ro.observe(host);
    } catch {
      setFailed(true);
    }
    return () => {
      cancelAnimationFrame(raf);
      if (ro) ro.disconnect();
      if (sphere) {
        sphere.geometry.dispose();
        (sphere.material as THREE.Material).dispose();
      }
      if (starField) {
        starField.geometry.dispose();
        (starField.material as THREE.Material).dispose();
      }
      if (texture) texture.dispose();
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement.parentElement) renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, [illum]);

  const L = (or: string, hi: string, en: string) => (language === 'or' ? or : language === 'hi' ? hi : en);
  const pct = Math.round(illum * 100);

  return (
    <section className="group relative isolate flex h-full flex-col overflow-hidden rounded-3xl border border-indigo-300/25 bg-[linear-gradient(145deg,rgba(17,24,50,0.96),rgba(7,10,26,0.96)_58%,rgba(15,19,43,0.98))] p-4 shadow-[0_18px_48px_-28px_rgba(99,102,241,0.7),inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-xl transition-colors duration-300 hover:border-indigo-200/40">
      <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-blue-500/15 blur-[70px]" />
      <div className="pointer-events-none absolute -bottom-20 -left-16 h-44 w-44 rounded-full bg-violet-500/10 blur-[60px]" />
      <div className="relative z-10 mb-1 flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-100">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-indigo-300/20 bg-indigo-400/10 shadow-inner">
            <MoonStar className="h-3.5 w-3.5 text-indigo-200" />
          </span>
          {L('ଚନ୍ଦ୍ର ଦର୍ଶନ', 'चंद्र दर्शन', 'Moon 3D')}
        </span>
        <span className="shrink-0 rounded-full border border-indigo-300/15 bg-slate-950/45 px-2.5 py-1 text-[9px] font-bold text-indigo-100/75">
          {L('ଉଦୟ', 'उदय', 'Rise')} <span className="text-white">{formatTime(panjika.moonrise)}</span>
        </span>
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-white/[0.06] bg-[radial-gradient(ellipse_at_50%_55%,rgba(99,102,241,0.13),rgba(8,12,30,0.08)_45%,transparent_72%)]">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-36 w-56 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-indigo-200/[0.08]" style={{ transform: 'translate(-50%, -50%) rotateX(68deg) rotateZ(-14deg)' }} />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-28 w-48 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-violet-200/[0.07]" style={{ transform: 'translate(-50%, -50%) rotateX(72deg) rotateZ(24deg)' }} />
        <div ref={hostRef} className="relative z-10 h-[170px] w-full">
        {failed && (
          <div
            className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background: `radial-gradient(circle at ${15 + illum * 35}% 50%, #eef0f6 0%, #c6c9d4 ${30 + illum * 20}%, #343a4e ${55 + illum * 15}%, #1a1e2e 100%)`,
              boxShadow: '0 0 45px rgba(180,200,255,0.35)',
            }}
          />
        )}
        </div>
        <div className="pointer-events-none absolute bottom-2 left-3 z-20 rounded-full border border-white/[0.08] bg-slate-950/45 px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          {L('ଚନ୍ଦ୍ର ପର୍ଯ୍ୟାୟ', 'चंद्र चरण', 'Lunar phase')}
        </div>
        <div className="pointer-events-none absolute bottom-3 right-4 z-20 h-1.5 w-1.5 rounded-full bg-indigo-200 shadow-[0_0_10px_3px_rgba(165,180,252,0.55)]" />
      </div>
      <div className="relative z-10 mt-2 grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-indigo-300/20 bg-gradient-to-br from-indigo-400/10 to-indigo-950/25 px-2.5 py-2 text-center shadow-inner">
          <div className="text-[9px] font-black uppercase tracking-widest text-indigo-200/70">
            {L('ଆଲୋକିତ', 'प्रकाशित', 'Illuminated')}
          </div>
          <div className="mt-0.5 font-mono text-lg font-black leading-none text-indigo-100">{formatNumber(pct)}%</div>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-950/70">
            <div className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-sky-200 shadow-[0_0_8px_rgba(165,180,252,0.45)]" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-gradient-to-br from-slate-800/65 to-slate-950/70 px-2.5 py-2 text-center shadow-inner">
          <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">
            {L('ତିଥି ଅଗ୍ରଗତି', 'तिथि प्रगति', 'Tithi')}
          </div>
          <div className="mt-0.5 font-mono text-lg font-black leading-none text-slate-100">{formatNumber(Math.round(panjika.tithi.percentage))}%</div>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-950/70">
            <div className="h-full rounded-full bg-gradient-to-r from-slate-400 to-indigo-200" style={{ width: `${Math.max(0, Math.min(100, panjika.tithi.percentage))}%` }} />
          </div>
        </div>
      </div>
    </section>
  );
};
