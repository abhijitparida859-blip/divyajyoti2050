import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  createSunTexture,
  createEarthTexture,
  createMoonTexture,
  createMarsTexture,
  createJupiterTexture
} from './planetTextures';
import { Play, Pause, Eye, Radio } from 'lucide-react';

interface Mission3DViewerProps {
  missionId: string;
  missionName: string;
  target: 'Moon' | 'Sun' | 'Mars' | 'Deep Space' | 'Earth' | 'Jupiter' | 'Saturn';
  distanceFromEarth: string;
  signalDelay: string;
  themeColor: string;
}

export const Mission3DViewer: React.FC<Mission3DViewerProps> = ({
  missionId,
  missionName,
  target,
  distanceFromEarth,
  signalDelay,
  themeColor
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [viewMode, setViewMode] = useState<'trajectory' | 'spacecraft'>('trajectory');
  const [telemetrySpeed, setTelemetrySpeed] = useState<string>('7.8 km/s');

  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;
  
  const viewModeRef = useRef(viewMode);
  viewModeRef.current = viewMode;

  const speedDisplayRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 280;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2.5, 4.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    while (container.firstChild) container.removeChild(container.firstChild);
    container.appendChild(renderer.domElement);

    const safeColor = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(themeColor) ? themeColor : '#38bdf8';

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    // 3. Central Celestial Body (Earth or Target)
    let bodyTexture: THREE.Texture;
    let bodyRadius = 0.8;
    if (target === 'Moon') bodyTexture = createMoonTexture();
    else if (target === 'Mars') bodyTexture = createMarsTexture();
    else if (target === 'Sun') {
      bodyTexture = createSunTexture();
      bodyRadius = 1.0;
    } else if (target === 'Jupiter') bodyTexture = createJupiterTexture();
    else bodyTexture = createEarthTexture();

    const bodyGeo = new THREE.SphereGeometry(bodyRadius, 32, 32);
    const bodyMat = new THREE.MeshStandardMaterial({
      map: bodyTexture,
      roughness: 0.7,
      metalness: 0.1
    });
    const centralBody = new THREE.Mesh(bodyGeo, bodyMat);
    scene.add(centralBody);

    // Subtle atmospheric glow ring
    const atmosGeo = new THREE.SphereGeometry(bodyRadius * 1.03, 32, 32);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(safeColor),
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    scene.add(atmosMesh);

    // 4. Spacecraft 3D Group
    const spacecraftGroup = new THREE.Group();

    // Satellite main bus (Gold Foil Hexagonal/Cubical body)
    const busGeo = new THREE.BoxGeometry(0.2, 0.18, 0.2);
    const busMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.85,
      roughness: 0.2
    });
    const busMesh = new THREE.Mesh(busGeo, busMat);
    spacecraftGroup.add(busMesh);

    // Blue Solar Panel Wings
    const wingGeo = new THREE.BoxGeometry(0.35, 0.015, 0.14);
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      metalness: 0.9,
      roughness: 0.2
    });
    const leftWing = new THREE.Mesh(wingGeo, wingMat);
    leftWing.position.x = -0.3;
    spacecraftGroup.add(leftWing);

    const rightWing = new THREE.Mesh(wingGeo, wingMat);
    rightWing.position.x = 0.3;
    spacecraftGroup.add(rightWing);

    // High Gain Antenna Dish
    const dishGeo = new THREE.ConeGeometry(0.08, 0.04, 16, 1, true);
    const dishMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.5,
      roughness: 0.3,
      side: THREE.DoubleSide
    });
    const dishMesh = new THREE.Mesh(dishGeo, dishMat);
    dishMesh.rotation.x = Math.PI;
    dishMesh.position.y = 0.13;
    spacecraftGroup.add(dishMesh);

    scene.add(spacecraftGroup);

    // 5. 3D Orbital Trajectory Path (Glowing Curve)
    const orbitPoints: THREE.Vector3[] = [];
    const a = 1.9; // Semi-major axis
    const b = target === 'Sun' ? 1.7 : 1.35; // Semi-minor axis
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      orbitPoints.push(new THREE.Vector3(Math.cos(theta) * a, Math.sin(theta) * 0.35, Math.sin(theta) * b));
    }
    const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    const orbitMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(safeColor),
      transparent: true,
      opacity: 0.75,
      linewidth: 2
    });
    const orbitLine = new THREE.Line(orbitGeo, orbitMat);
    scene.add(orbitLine);

    // 6. Interactive Mouse Drag to Rotate Scene
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let rotX = 0.3;
    let rotY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      rotY += dx * 0.01;
      rotX += dy * 0.01;
      rotX = Math.max(-1.2, Math.min(1.2, rotX));
      prevMouse = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch support
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - prevMouse.x;
      const dy = e.touches[0].clientY - prevMouse.y;
      rotY += dx * 0.01;
      rotX += dy * 0.01;
      rotX = Math.max(-1.2, Math.min(1.2, rotX));
      prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = () => {
      isDragging = false;
    };
    domEl.addEventListener('touchstart', onTouchStart, { passive: true });
    domEl.addEventListener('touchmove', onTouchMove, { passive: true });
    domEl.addEventListener('touchend', onTouchEnd);

    // 7. Animation Loop
    let orbitProgress = 0;
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Rotate central body
      centralBody.rotation.y += 0.003;

      if (isPlayingRef.current) {
        orbitProgress += 0.008;
      }

      // Compute spacecraft position on orbit
      const curX = Math.cos(orbitProgress) * a;
      const curY = Math.sin(orbitProgress) * 0.35;
      const curZ = Math.sin(orbitProgress) * b;
      spacecraftGroup.position.set(curX, curY, curZ);

      // Point spacecraft along orbital tangent
      const nextX = Math.cos(orbitProgress + 0.01) * a;
      const nextY = Math.sin(orbitProgress + 0.01) * 0.35;
      const nextZ = Math.sin(orbitProgress + 0.01) * b;
      spacecraftGroup.lookAt(nextX, nextY, nextZ);

      // Dynamic orbital speed calculation (Vis-Viva equation approximation)
      const r = Math.sqrt(curX * curX + curZ * curZ);
      const vKms = (7.5 * Math.sqrt(2 / r - 1 / a)).toFixed(2);
      if (speedDisplayRef.current) {
        speedDisplayRef.current.textContent = `${vKms} km/s`;
      }

      // Camera view mode management
      if (viewModeRef.current === 'spacecraft') {
        camera.position.set(curX + 0.6, curY + 0.4, curZ + 0.8);
        camera.lookAt(curX, curY, curZ);
      } else {
        // Orbit mode with user drag rotation
        const radius = 4.2;
        camera.position.x = radius * Math.sin(rotY) * Math.cos(rotX);
        camera.position.y = radius * Math.sin(rotX);
        camera.position.z = radius * Math.cos(rotY) * Math.cos(rotX);
        camera.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    };
    animate();

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
      cancelAnimationFrame(animId);
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
  }, [missionId, target, themeColor]);

  return (
    <div className="relative w-full h-[300px] sm:h-[340px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#020617] via-slate-950 to-[#020617] border border-slate-800 shadow-2xl flex flex-col justify-between">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Top Overlay: Telemetry and View Toggles */}
      <div className="relative z-10 flex items-center justify-between p-3.5 pointer-events-none">
        <div className="flex items-center gap-2">
          <span
            className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full border backdrop-blur-md flex items-center gap-1.5 shadow-md"
            style={{ borderColor: `${themeColor}60`, color: themeColor, backgroundColor: `${themeColor}15` }}
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            3D Orbit Flight Telemetry
          </span>
        </div>

        {/* View Mode & Play Toggles */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'trajectory' ? 'spacecraft' : 'trajectory')}
            className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 backdrop-blur-md transition-all flex items-center gap-1 cursor-pointer"
            title="Toggle Spacecraft Close-up"
          >
            <Eye className="w-3 h-3 text-cyan-400" />
            <span>{viewMode === 'trajectory' ? 'Trajectory View' : 'Probe Cam'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-2 py-1 rounded-lg text-[10px] font-mono font-bold bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 backdrop-blur-md transition-all flex items-center gap-1 cursor-pointer"
            title={isPlaying ? 'Pause Simulation' : 'Resume Simulation'}
          >
            {isPlaying ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Bottom Overlay: Live Flight Telemetry Cards */}
      <div className="relative z-10 p-3.5 bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-transparent flex flex-col sm:flex-row sm:items-end justify-between gap-2 pointer-events-none">
        <div className="space-y-1">
          <span className="text-[10px] text-slate-400 font-mono block">
            Target: <strong className="text-white">{target}</strong> • Flight Speed: <strong ref={speedDisplayRef} className="text-emerald-400 font-mono">{telemetrySpeed}</strong>
          </span>
          <p className="text-xs text-slate-200 font-bold font-serif">
            {missionName}
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px]">
          <div className="bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-lg">
            <span className="text-slate-400 block text-[9px]">Earth Dist:</span>
            <span className="text-cyan-300 font-bold">{distanceFromEarth}</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-lg">
            <span className="text-slate-400 block text-[9px]">Signal Delay:</span>
            <span className="text-amber-300 font-bold">{signalDelay}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
