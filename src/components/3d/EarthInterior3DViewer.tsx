import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { loadRealPlanetTexture } from './planetTextures';
import { RotateCw, Eye, Layers, Maximize2, Zap, ArrowDown } from 'lucide-react';

interface EarthInterior3DViewerProps {
  currentDepthKm?: number;
  selectedLayerId?: string;
  onSelectLayer?: (layerId: string) => void;
}

export const EarthInterior3DViewer: React.FC<EarthInterior3DViewerProps> = ({
  currentDepthKm = 0,
  selectedLayerId = 'crust',
  onSelectLayer
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [cutawayMode, setCutawayMode] = useState<'wedge90' | 'half180' | 'full'>('wedge90');
  const [exploded, setExploded] = useState(false);
  const [showMagneticLines, setShowMagneticLines] = useState(true);

  // References to meshes for dynamic updates without re-creating scene
  const meshesRef = useRef<{
    innerCore?: THREE.Mesh;
    outerCore?: THREE.Mesh;
    mantle?: THREE.Mesh;
    crust?: THREE.Mesh;
    depthRing?: THREE.Mesh;
    earthGroup?: THREE.Group;
  }>({});

  const currentDepthRef = useRef(currentDepthKm);
  currentDepthRef.current = currentDepthKm;
  
  const selectedLayerRef = useRef(selectedLayerId);
  selectedLayerRef.current = selectedLayerId;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 340;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.4, 4.0);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    while (container.firstChild) container.removeChild(container.firstChild);
    container.appendChild(renderer.domElement);

    // Dynamic cutaway theta
    const thetaLength =
      cutawayMode === 'wedge90'
        ? Math.PI * 1.5
        : cutawayMode === 'half180'
        ? Math.PI * 1.0
        : Math.PI * 2.0;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.6);
    dirLight.position.set(5, 4, 5);
    scene.add(dirLight);

    const coreLight = new THREE.PointLight(0xffeedd, 2.2, 8);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    // Earth Master Group with 23.44° Real Axial Tilt
    const earthGroup = new THREE.Group();
    earthGroup.rotation.z = (23.44 * Math.PI) / 180;
    meshesRef.current.earthGroup = earthGroup;

    // 1. Inner Core (Solid HCP Crystal Iron-Nickel, r = 0.32)
    // Real radius: 1,221 km out of 6,371 km = ~0.191 to 0.32 scaled
    const innerCoreGeo = new THREE.SphereGeometry(0.32, 32, 32);
    const isInnerSelected = selectedLayerId === 'inner_core';
    const innerCoreMat = new THREE.MeshStandardMaterial({
      color: isInnerSelected ? 0xffffff : 0xfef08a,
      emissive: 0xf59e0b,
      emissiveIntensity: isInnerSelected ? 1.4 : 0.75,
      metalness: 0.9,
      roughness: 0.1
    });
    const innerCoreMesh = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    innerCoreMesh.position.set(0, 0, 0);
    earthGroup.add(innerCoreMesh);
    meshesRef.current.innerCore = innerCoreMesh;

    // 2. Outer Core (Liquid Churning Molten Fe-Ni, r = 0.68)
    const isOuterSelected = selectedLayerId === 'outer_core';
    const outerCoreGeo = new THREE.SphereGeometry(
      0.68,
      48,
      48,
      0,
      thetaLength,
      0,
      Math.PI
    );
    const outerCoreMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      emissive: 0xef4444,
      emissiveIntensity: isOuterSelected ? 1.2 : 0.45,
      metalness: 0.8,
      roughness: 0.25,
      side: THREE.DoubleSide
    });
    const outerCoreMesh = new THREE.Mesh(outerCoreGeo, outerCoreMat);
    if (exploded) outerCoreMesh.position.set(0.18, 0.15, 0.18);
    earthGroup.add(outerCoreMesh);
    meshesRef.current.outerCore = outerCoreMesh;

    // 3. Mantle (Lower Mantle, Transition Zone, Upper Mantle, r = 1.14)
    const isMantleSelected =
      selectedLayerId === 'lower_mantle' ||
      selectedLayerId === 'transition_zone' ||
      selectedLayerId === 'upper_mantle';
    const mantleGeo = new THREE.SphereGeometry(
      1.14,
      64,
      64,
      0,
      thetaLength,
      0,
      Math.PI
    );
    const mantleMat = new THREE.MeshStandardMaterial({
      color: isMantleSelected ? 0xf59e0b : 0xea580c,
      emissive: 0x7c2d12,
      emissiveIntensity: isMantleSelected ? 0.9 : 0.3,
      metalness: 0.2,
      roughness: 0.75,
      side: THREE.DoubleSide
    });
    const mantleMesh = new THREE.Mesh(mantleGeo, mantleMat);
    if (exploded) mantleMesh.position.set(0.38, 0.3, 0.38);
    earthGroup.add(mantleMesh);
    meshesRef.current.mantle = mantleMesh;

    // 4. Outer Crust with 4K NASA Texture (r = 1.18)
    const isCrustSelected = selectedLayerId === 'crust';
    const earthTexture = loadRealPlanetTexture('Earth');
    const crustGeo = new THREE.SphereGeometry(
      1.18,
      64,
      64,
      0,
      thetaLength,
      0,
      Math.PI
    );
    const crustMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.6,
      metalness: 0.1,
      emissive: isCrustSelected ? 0x10b981 : 0x000000,
      emissiveIntensity: isCrustSelected ? 0.4 : 0.0,
      side: THREE.DoubleSide
    });
    const crustMesh = new THREE.Mesh(crustGeo, crustMat);
    if (exploded) crustMesh.position.set(0.65, 0.5, 0.65);
    earthGroup.add(crustMesh);
    meshesRef.current.crust = crustMesh;

    // 5. Flat Wedge Face Caps showing layered colors if cutaway
    if (cutawayMode !== 'full' && !exploded) {
      const capGeo = new THREE.CircleGeometry(1.18, 48, 0, Math.PI);
      const capMat = new THREE.MeshBasicMaterial({
        color: 0x090d16,
        side: THREE.DoubleSide
      });
      const capMesh1 = new THREE.Mesh(capGeo, capMat);
      capMesh1.rotation.y = Math.PI * 0.5;
      earthGroup.add(capMesh1);
    }

    // 6. Real-time Depth Laser Disc (Shows exact drill penetration in 3D!)
    // Earth Radius = 6,371 km mapped to radius = 1.18
    const safeDepth = Math.max(0, Math.min(6371, Number.isFinite(currentDepthKm) ? currentDepthKm : 0));
    const rDepth = 1.18 * (1 - safeDepth / 6371);
    const depthDiscGeo = new THREE.RingGeometry(
      Math.max(0.01, rDepth - 0.02),
      Math.max(0.03, rDepth + 0.02),
      64
    );
    const depthDiscMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });
    const depthDiscMesh = new THREE.Mesh(depthDiscGeo, depthDiscMat);
    depthDiscMesh.rotation.x = Math.PI * 0.5;
    earthGroup.add(depthDiscMesh);
    meshesRef.current.depthRing = depthDiscMesh;

    // 7. Geomagnetic Field Lines (Dipole Arcs)
    if (showMagneticLines && !exploded) {
      const fieldLinesGroup = new THREE.Group();
      const arcPoints: THREE.Vector3[] = [];
      const rArc = 1.65;
      for (let i = 0; i <= 64; i++) {
        const theta = (i / 64) * Math.PI;
        arcPoints.push(new THREE.Vector3(Math.sin(theta) * rArc, Math.cos(theta) * 1.45, 0));
      }
      const arcGeo = new THREE.BufferGeometry().setFromPoints(arcPoints);
      const arcMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.3
      });

      for (let rot = 0; rot < Math.PI * 2; rot += Math.PI / 4) {
        const line = new THREE.Line(arcGeo, arcMat);
        line.rotation.y = rot;
        fieldLinesGroup.add(line);
      }
      earthGroup.add(fieldLinesGroup);
    }

    scene.add(earthGroup);

    // Interactive Drag to Rotate
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let rotY = 0.5;
    let rotX = 0.25;

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
      rotX = Math.max(-1.1, Math.min(1.1, rotX));
      prevMouse = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch events
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
      rotX = Math.max(-1.1, Math.min(1.1, rotX));
      prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = () => {
      isDragging = false;
    };
    domEl.addEventListener('touchstart', onTouchStart, { passive: true });
    domEl.addEventListener('touchmove', onTouchMove, { passive: true });
    domEl.addEventListener('touchend', onTouchEnd);

    // Animation Loop
    let animId: number;
    let lastDepth = -1;
    let lastLayer = '';

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const currentDepth = currentDepthRef.current || 0;
      if (currentDepth !== lastDepth && meshesRef.current.depthRing) {
        const safeDepth = Math.max(0, Math.min(6371, Number.isFinite(currentDepth) ? currentDepth : 0));
        const rD = 1.18 * (1 - safeDepth / 6371);
        meshesRef.current.depthRing.geometry.dispose();
        meshesRef.current.depthRing.geometry = new THREE.RingGeometry(
          Math.max(0.01, rD - 0.02),
          Math.max(0.03, rD + 0.02),
          64
        );
        lastDepth = currentDepth;
      }

      const currentLayer = selectedLayerRef.current || '';
      if (currentLayer !== lastLayer) {
        if (meshesRef.current.innerCore) {
          const isInner = currentLayer === 'inner_core';
          const mat = meshesRef.current.innerCore.material as THREE.MeshStandardMaterial;
          mat.color.setHex(isInner ? 0xffffff : 0xfef08a);
          mat.emissiveIntensity = isInner ? 1.4 : 0.75;
        }
        if (meshesRef.current.outerCore) {
          const isOuter = currentLayer === 'outer_core';
          const mat = meshesRef.current.outerCore.material as THREE.MeshStandardMaterial;
          mat.emissiveIntensity = isOuter ? 1.2 : 0.45;
        }
        if (meshesRef.current.mantle) {
          const isMantle = currentLayer === 'lower_mantle' || currentLayer === 'transition_zone' || currentLayer === 'upper_mantle';
          const mat = meshesRef.current.mantle.material as THREE.MeshStandardMaterial;
          mat.color.setHex(isMantle ? 0xf59e0b : 0xea580c);
          mat.emissiveIntensity = isMantle ? 0.9 : 0.3;
        }
        if (meshesRef.current.crust) {
          const isCrust = currentLayer === 'crust';
          const mat = meshesRef.current.crust.material as THREE.MeshStandardMaterial;
          mat.emissive.setHex(isCrust ? 0x10b981 : 0x000000);
          mat.emissiveIntensity = isCrust ? 0.4 : 0.0;
        }
        lastLayer = currentLayer;
      }

      if (autoRotate && !isDragging) {
        rotY += 0.0035;
      }

      const radius = 4.0;
      camera.position.x = radius * Math.sin(rotY) * Math.cos(rotX);
      camera.position.y = radius * Math.sin(rotX);
      camera.position.z = radius * Math.cos(rotY) * Math.cos(rotX);
      camera.lookAt(0, 0, 0);

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
  }, [autoRotate, cutawayMode, exploded, showMagneticLines]);

  return (
    <div className="relative w-full h-[360px] sm:h-[400px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#020617] via-[#050b1a] to-[#020617] border-2 border-slate-800/90 shadow-2xl flex flex-col justify-between group">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Top Overlay: 3D Mode Switcher & Tools */}
      <div className="relative z-10 flex flex-wrap items-center justify-between p-3 sm:p-4 gap-2 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 backdrop-blur-md flex items-center gap-1.5 shadow-lg">
            <Layers className="w-3.5 h-3.5 text-rose-400" />
            3D Cutaway Geodynamics Lab
          </span>

          {currentDepthKm > 0 && (
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 backdrop-blur-md flex items-center gap-1 animate-pulse">
              <ArrowDown className="w-3 h-3 text-cyan-400" />
              Laser Slice: {currentDepthKm.toLocaleString()} km
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Exploded 3D Toggle */}
          <button
            type="button"
            onClick={() => setExploded(!exploded)}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold border backdrop-blur-md transition-all flex items-center gap-1 cursor-pointer ${
              exploded
                ? 'bg-amber-500 text-cosmic-950 border-white shadow-lg'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-slate-700'
            }`}
            title="Explode/Peel Concentric Layers in 3D"
          >
            <Maximize2 className="w-3 h-3" />
            <span>{exploded ? 'Collapse' : 'Explode 3D'}</span>
          </button>

          {/* Cutaway Mode */}
          <button
            type="button"
            onClick={() => {
              if (cutawayMode === 'wedge90') setCutawayMode('half180');
              else if (cutawayMode === 'half180') setCutawayMode('full');
              else setCutawayMode('wedge90');
            }}
            className="px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 backdrop-blur-md transition-all flex items-center gap-1 cursor-pointer"
            title="Cycle Cutaway: 90° Wedge -> 180° Half -> Full Sphere"
          >
            <Eye className="w-3 h-3 text-cyan-400" />
            <span>
              {cutawayMode === 'wedge90'
                ? '90° Wedge'
                : cutawayMode === 'half180'
                ? '180° Half'
                : 'Full Globe'}
            </span>
          </button>

          {/* Magnetic Field Toggle */}
          <button
            type="button"
            onClick={() => setShowMagneticLines(!showMagneticLines)}
            className={`px-2 py-1 rounded-xl text-[10px] font-mono font-bold border backdrop-blur-md transition-all flex items-center gap-1 cursor-pointer ${
              showMagneticLines
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-900/80 text-slate-400 border-slate-700'
            }`}
            title="Toggle Geomagnetic Field Lines"
          >
            <Zap className="w-3 h-3 text-cyan-400" />
          </button>

          {/* Auto Spin */}
          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            className="px-2 py-1 rounded-xl text-[10px] font-mono font-bold bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 backdrop-blur-md transition-all flex items-center gap-1 cursor-pointer"
            title="Toggle Auto Spin"
          >
            <RotateCw className={`w-3 h-3 text-emerald-400 ${autoRotate ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Bottom Overlay: Layer Pin Buttons */}
      <div className="relative z-10 p-3 sm:p-4 bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-transparent flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono pointer-events-auto">
          <button
            type="button"
            onClick={() => onSelectLayer && onSelectLayer('crust')}
            className={`px-2 py-1 rounded-lg border transition-all cursor-pointer ${
              selectedLayerId === 'crust'
                ? 'bg-emerald-500 text-white border-white font-bold shadow-md'
                : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30 hover:border-emerald-400'
            }`}
          >
            🟢 Crust (0-35 km)
          </button>

          <button
            type="button"
            onClick={() => onSelectLayer && onSelectLayer('upper_mantle')}
            className={`px-2 py-1 rounded-lg border transition-all cursor-pointer ${
              selectedLayerId === 'upper_mantle' || selectedLayerId === 'lower_mantle' || selectedLayerId === 'transition_zone'
                ? 'bg-amber-500 text-cosmic-950 border-white font-bold shadow-md'
                : 'bg-amber-950/60 text-amber-300 border-amber-500/30 hover:border-amber-400'
            }`}
          >
            🟡 Mantle (35-2,891 km)
          </button>

          <button
            type="button"
            onClick={() => onSelectLayer && onSelectLayer('outer_core')}
            className={`px-2 py-1 rounded-lg border transition-all cursor-pointer ${
              selectedLayerId === 'outer_core'
                ? 'bg-rose-500 text-white border-white font-bold shadow-md'
                : 'bg-rose-950/60 text-rose-300 border-rose-500/30 hover:border-rose-400'
            }`}
          >
            🔴 Outer Core (2,891-5,150 km)
          </button>

          <button
            type="button"
            onClick={() => onSelectLayer && onSelectLayer('inner_core')}
            className={`px-2 py-1 rounded-lg border transition-all cursor-pointer ${
              selectedLayerId === 'inner_core'
                ? 'bg-yellow-400 text-cosmic-950 border-white font-bold shadow-md'
                : 'bg-yellow-950/60 text-yellow-300 border-yellow-500/30 hover:border-yellow-400'
            }`}
          >
            ⭐ Inner Core (5,150-6,371 km)
          </button>
        </div>

        <span className="text-[10px] text-slate-400 font-mono hidden md:inline">
          Drag to orbit 360°
        </span>
      </div>
    </div>
  );
};
