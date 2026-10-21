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
    const r = 22 + Math.random() * 46;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, 'rgba(86,90,104,0.55)');
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
    const r = 2 + Math.random() * 9;
    ctx.fillStyle = `rgba(70,74,86,${0.25 + Math.random() * 0.35})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(232,234,240,0.5)';
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
    let texture: THREE.CanvasTexture | null = null;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
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
      const geo = new THREE.SphereGeometry(1, 48, 48);
      const mat = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.92, metalness: 0.02 });
      sphere = new THREE.Mesh(geo, mat);
      scene.add(sphere);
      scene.add(new THREE.AmbientLight(0x33405c, 0.5));
      // Phase lighting: illum=1 (full) → light from camera; illum=0 (new) → behind.
      const phi = Math.PI * (1 - illum);
      const light = new THREE.DirectionalLight(0xfff4dd, 3.0);
      light.position.set(Math.sin(phi) * 4, 0.6, Math.cos(phi) * 4);
      scene.add(light);
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
    <section className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-indigo-400/30 bg-[#0b0d21]/85 p-4 backdrop-blur-xl">
      <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-blue-500/15 blur-[70px]" />
      <div className="mb-1 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.28em] text-indigo-200">
          <MoonStar className="h-3.5 w-3.5 text-indigo-300" />
          {L('ଚନ୍ଦ୍ର ଦର୍ଶନ', 'चंद्र दर्शन', 'Moon 3D')}
        </span>
        <span className="text-[9px] font-bold text-slate-400">
          {L('ଉଦୟ', 'उदय', 'Rise')} {formatTime(panjika.moonrise)}
        </span>
      </div>
      <div ref={hostRef} className="relative h-[170px] w-full">
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
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-indigo-400/30 bg-indigo-500/10 px-2.5 py-2 text-center">
          <div className="text-[9px] font-black uppercase tracking-widest text-indigo-300/80">
            {L('ଆଲୋକିତ', 'प्रकाशित', 'Illuminated')}
          </div>
          <div className="font-mono text-lg font-black text-indigo-100">{formatNumber(pct)}%</div>
        </div>
        <div className="rounded-xl border border-slate-600/50 bg-slate-900/60 px-2.5 py-2 text-center">
          <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">
            {L('ତିଥି ଅଗ୍ରଗତି', 'तिथि प्रगति', 'Tithi')}
          </div>
          <div className="font-mono text-lg font-black text-slate-100">{formatNumber(Math.round(panjika.tithi.percentage))}%</div>
        </div>
      </div>
    </section>
  );
};
