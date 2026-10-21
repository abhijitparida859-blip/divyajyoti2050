import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  createSaturnRingTexture,
  loadRealPlanetTexture
} from './planetTextures';
import { RotateCw, Eye, Sparkles } from 'lucide-react';

interface Planet3DViewerProps {
  planetKey: string;
  name: string;
  axialTilt?: string;
  rotationPeriod?: string;
  themeColor?: string;
}

export const Planet3DViewer: React.FC<Planet3DViewerProps> = ({
  planetKey,
  name,
  axialTilt = '3.13°',
  rotationPeriod = '9h 55m',
  themeColor = '#eab308'
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const autoRotateRef = useRef(autoRotate);
  autoRotateRef.current = autoRotate;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 3.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    while (container.firstChild) container.removeChild(container.firstChild);
    container.appendChild(renderer.domElement);

    // Ambient and Directional Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, planetKey === 'Surya' ? 1.8 : 0.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, planetKey === 'Surya' ? 2.5 : 1.4);
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.4);
    fillLight.position.set(-5, -2, -3);
    scene.add(fillLight);

    // Planet Texture & Material
    let texture: THREE.Texture;
    let isEmissive = false;

    switch (planetKey) {
      case 'Surya':
        texture = loadRealPlanetTexture('Sun');
        isEmissive = true;
        break;
      case 'Budha':
        texture = loadRealPlanetTexture('Mercury');
        break;
      case 'Shukra':
        texture = loadRealPlanetTexture('Venus');
        break;
      case 'PrithviChandra':
      case 'Prithvi':
        texture = loadRealPlanetTexture('Earth');
        break;
      case 'Chandra':
        texture = loadRealPlanetTexture('Moon');
        break;
      case 'Mangala':
        texture = loadRealPlanetTexture('Mars');
        break;
      case 'Guru':
        texture = loadRealPlanetTexture('Jupiter');
        break;
      case 'Shani':
        texture = loadRealPlanetTexture('Saturn');
        break;
      case 'Aruna':
        texture = loadRealPlanetTexture('Uranus');
        break;
      case 'Varuna':
        texture = loadRealPlanetTexture('Neptune');
        break;
      case 'Rahu':
      case 'Ketu':
      case 'RahuKetu': {
        // Quantum celestial shadow node texture
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const grad = ctx.createRadialGradient(256, 128, 10, 256, 128, 250);
          grad.addColorStop(0, planetKey === 'Rahu' ? '#a855f7' : '#c084fc');
          grad.addColorStop(0.5, '#4c1d95');
          grad.addColorStop(1, '#02040a');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 512, 256);
        }
        texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        break;
      }
      default:
        texture = loadRealPlanetTexture(planetKey);
        break;
    }

    const planetRadius = planetKey === 'Surya' ? 1.3 : 1.15;
    const geometry = new THREE.SphereGeometry(planetRadius, 64, 64);
    const material = isEmissive
      ? new THREE.MeshBasicMaterial({ map: texture })
      : new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.8,
          metalness: 0.1
        });

    const planetMesh = new THREE.Mesh(geometry, material);

    // Parse tilt angle
    const tiltFloat = parseFloat(axialTilt) || 0;
    planetMesh.rotation.z = THREE.MathUtils.degToRad(tiltFloat);
    scene.add(planetMesh);

    // Add Saturn / Uranus Rings if applicable
    let ringMesh: THREE.Mesh | null = null;
    if (planetKey === 'Shani') {
      const ringGeo = new THREE.RingGeometry(1.4, 2.4, 64);
      const ringTex = createSaturnRingTexture();
      const ringMat = new THREE.MeshStandardMaterial({
        map: ringTex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.95
      });
      ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2 + 0.1;
      ringMesh.rotation.y = THREE.MathUtils.degToRad(26.7);
      planetMesh.add(ringMesh);
    } else if (planetKey === 'Aruna') {
      const ringGeo = new THREE.RingGeometry(1.35, 1.6, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x67e8f9,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4
      });
      ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.rotation.z = THREE.MathUtils.degToRad(97.77);
      planetMesh.add(ringMesh);
    } else if (planetKey === 'Rahu' || planetKey === 'Ketu' || planetKey === 'RahuKetu') {
      // Ethereal glowing intersection nodal rings
      const ringGeo = new THREE.TorusGeometry(1.5, 0.03, 16, 100);
      const ringMat = new THREE.MeshBasicMaterial({
        color: planetKey === 'Rahu' ? 0xa855f7 : 0xe879f9,
        transparent: true,
        opacity: 0.85
      });
      ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 3;
      planetMesh.add(ringMesh);
    }

    // Interactive Drag to Rotate
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      planetMesh.rotation.y += deltaX * 0.01;
      planetMesh.rotation.x += deltaY * 0.01;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch support for mobile/tablets
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;
      planetMesh.rotation.y += deltaX * 0.01;
      planetMesh.rotation.x += deltaY * 0.01;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = () => {
      isDragging = false;
    };
    domEl.addEventListener('touchstart', onTouchStart, { passive: true });
    domEl.addEventListener('touchmove', onTouchMove, { passive: true });
    domEl.addEventListener('touchend', onTouchEnd);

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (autoRotateRef.current && !isDragging) {
        planetMesh.rotation.y += 0.004;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize observer
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domEl.removeEventListener('touchstart', onTouchStart);
      domEl.removeEventListener('touchmove', onTouchMove);
      domEl.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', handleResize);
      scene.traverse((obj: any) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m: any) => { if (m.map) m.map.dispose(); m.dispose(); });
          else { if (obj.material.map) obj.material.map.dispose(); obj.material.dispose(); }
        }
      });
      renderer.dispose();
      renderer.forceContextLoss();
      if (container.contains(domEl)) {
        container.removeChild(domEl);
      }
    };
  }, [planetKey, axialTilt]);

  return (
    <div
      className="relative w-full h-[290px] sm:h-[320px] rounded-2xl overflow-hidden bg-gradient-to-b from-slate-950 via-[#030712] to-slate-950 border border-slate-800 shadow-inner group flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D WebGL Canvas Viewport */}
      <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Top Overlay Badges */}
      <div className="relative z-10 flex items-center justify-between p-3 pointer-events-none">
        <div className="flex items-center gap-2">
          <span
            className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full border backdrop-blur-md flex items-center gap-1.5 shadow-md"
            style={{ borderColor: `${themeColor}60`, color: themeColor, backgroundColor: `${themeColor}15` }}
          >
            <Sparkles className="w-3 h-3 animate-spin-slow" />
            3D WebGL Realtime Model
          </span>
        </div>

        <button
          type="button"
          onClick={() => setAutoRotate(!autoRotate)}
          className="pointer-events-auto px-2 py-1 rounded-lg text-[10px] font-mono font-semibold bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 backdrop-blur-md transition-all flex items-center gap-1 cursor-pointer"
          title="Toggle Auto Rotation"
        >
          <RotateCw className={`w-3 h-3 ${autoRotate ? 'animate-spin-slow text-emerald-400' : 'text-slate-400'}`} />
          <span>{autoRotate ? 'Auto-Spin' : 'Paused'}</span>
        </button>
      </div>

      {/* Bottom Overlay Info & Interaction Hint */}
      <div className="relative z-10 p-3 bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-transparent flex items-end justify-between pointer-events-none">
        <div className="space-y-0.5">
          <span className="text-[10px] text-slate-400 font-mono block">
            Axial Tilt: <span className="text-amber-300 font-bold">{axialTilt}</span> • Rotation: <span className="text-cyan-300 font-bold">{rotationPeriod}</span>
          </span>
          <p className="text-[11px] text-slate-200 font-medium">
            {name}
          </p>
        </div>

        <div className="text-[10px] text-slate-400 font-mono bg-slate-900/80 px-2 py-1 rounded-md border border-slate-800 flex items-center gap-1">
          <Eye className="w-3 h-3 text-sky-400" />
          <span>ମାଉସ୍ ଡ୍ରାଗ୍ କରି 360° ଘୁରାନ୍ତୁ</span>
        </div>
      </div>
    </div>
  );
};
