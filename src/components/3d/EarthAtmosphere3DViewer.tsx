import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { loadRealPlanetTexture, loadEarthCloudsTexture } from './planetTextures';
import { RotateCw, Compass, Eye, Sparkles, Layers, Rocket } from 'lucide-react';

interface EarthAtmosphere3DViewerProps {
  currentAltKm: number;
  selectedLayerId?: string;
  onSelectMilestone?: (altKm: number) => void;
}

export const EarthAtmosphere3DViewer: React.FC<EarthAtmosphere3DViewerProps> = ({
  currentAltKm,
  selectedLayerId = 'troposphere',
  onSelectMilestone
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [cameraMode, setCameraMode] = useState<'global' | 'vehicle'>('global');
  const [showShells, setShowShells] = useState(true);
  const [showAuroras, setShowAuroras] = useState(true);

  // References for live updates
  const sceneRef = useRef<{
    vehicleGroup?: THREE.Group;
    cloudsMesh?: THREE.Mesh;
    earthMesh?: THREE.Mesh;
    beaconLine?: THREE.Line;
    altitudeRing?: THREE.Mesh;
    camera?: THREE.PerspectiveCamera;
  }>({});

  const currentAltRef = useRef(currentAltKm);
  currentAltRef.current = currentAltKm;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 340;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 3.8);
    camera.lookAt(0, 0, 0);
    sceneRef.current.camera = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    while (container.firstChild) container.removeChild(container.firstChild);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.8);
    sunLight.position.set(6, 3, 5);
    scene.add(sunLight);

    const atmosphereLight = new THREE.PointLight(0x38bdf8, 1.5, 12);
    atmosphereLight.position.set(0, 2, 0);
    scene.add(atmosphereLight);

    // Master Globe Group with Earth 23.44° Axial Tilt
    const globeGroup = new THREE.Group();
    globeGroup.rotation.z = (23.44 * Math.PI) / 180;

    // 1. Earth Solid Surface Sphere (r = 1.0)
    const earthTexture = loadRealPlanetTexture('Earth');
    const earthGeo = new THREE.SphereGeometry(1.0, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.65,
      metalness: 0.1
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    globeGroup.add(earthMesh);
    sceneRef.current.earthMesh = earthMesh;

    // 2. Earth Realistic Cloud Layer (r = 1.012)
    const cloudsTexture = loadEarthCloudsTexture();
    const cloudsGeo = new THREE.SphereGeometry(1.012, 64, 64);
    const cloudsMat = new THREE.MeshStandardMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
    globeGroup.add(cloudsMesh);
    sceneRef.current.cloudsMesh = cloudsMesh;

    // 3. Concentric Atmospheric Layer Shells
    // Scale: Earth radius R = 6,371 km mapped to r = 1.0.
    // For educational visibility, atmospheric altitude is scaled logarithmically so 12 km, 50 km, 85 km, 100 km, 400 km are distinctly visible.
    const getScaledRadius = (altKm: number) => {
      // 0 km -> 1.0
      // 12 km -> 1.06
      // 50 km -> 1.15
      // 85 km -> 1.25
      // 100 km (Kármán) -> 1.30
      // 408 km (ISS) -> 1.55
      // 600 km -> 1.70
      const safeAlt = Math.max(0, Number.isFinite(altKm) ? altKm : 0);
      return 1.0 + Math.min(0.7, Math.pow(safeAlt / 600, 0.45) * 0.7);
    };

    if (showShells) {
      // Troposphere (0-12 km, Cyan Glow)
      const tropoGeo = new THREE.SphereGeometry(getScaledRadius(12), 48, 48);
      const tropoMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: selectedLayerId === 'troposphere' ? 0.28 : 0.08,
        side: THREE.BackSide
      });
      globeGroup.add(new THREE.Mesh(tropoGeo, tropoMat));

      // Stratosphere & Ozone Shield (12-50 km, Deep Blue)
      const stratoGeo = new THREE.SphereGeometry(getScaledRadius(50), 48, 48);
      const stratoMat = new THREE.MeshBasicMaterial({
        color: 0x6366f1,
        transparent: true,
        opacity: selectedLayerId === 'stratosphere' ? 0.25 : 0.07,
        side: THREE.BackSide
      });
      globeGroup.add(new THREE.Mesh(stratoGeo, stratoMat));

      // Mesosphere (50-85 km, Violet / Meteor Burn)
      const mesoGeo = new THREE.SphereGeometry(getScaledRadius(85), 48, 48);
      const mesoMat = new THREE.MeshBasicMaterial({
        color: 0xa855f7,
        transparent: true,
        opacity: selectedLayerId === 'mesosphere' ? 0.25 : 0.06,
        side: THREE.BackSide
      });
      globeGroup.add(new THREE.Mesh(mesoGeo, mesoMat));

      // Kármán Line 100 km Ring (Golden Space Boundary)
      const karmanR = getScaledRadius(100);
      const karmanGeo = new THREE.RingGeometry(karmanR - 0.005, karmanR + 0.005, 64);
      const karmanMat = new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
      });
      const karmanMesh = new THREE.Mesh(karmanGeo, karmanMat);
      karmanMesh.rotation.x = Math.PI * 0.5;
      globeGroup.add(karmanMesh);

      // Thermosphere (85-600 km, Aurora / Space Station Realm)
      const thermoGeo = new THREE.SphereGeometry(getScaledRadius(450), 48, 48);
      const thermoMat = new THREE.MeshBasicMaterial({
        color: 0xec4899,
        transparent: true,
        opacity: selectedLayerId === 'thermosphere' ? 0.22 : 0.04,
        side: THREE.BackSide
      });
      globeGroup.add(new THREE.Mesh(thermoGeo, thermoMat));
    }

    // 4. Polar Auroras (Northern & Southern Shimmering Rings)
    if (showAuroras) {
      const auroraGeo = new THREE.RingGeometry(0.35, 0.52, 48);
      const auroraMat = new THREE.MeshBasicMaterial({
        color: 0x34d399,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending
      });
      // North Aurora
      const northAurora = new THREE.Mesh(auroraGeo, auroraMat);
      northAurora.position.y = 0.95;
      northAurora.rotation.x = Math.PI * 0.5;
      globeGroup.add(northAurora);

      // South Aurora
      const southAurora = new THREE.Mesh(auroraGeo, auroraMat);
      southAurora.position.y = -0.95;
      southAurora.rotation.x = Math.PI * 0.5;
      globeGroup.add(southAurora);
    }

    // 5. Active Flight Vehicle / Probe Group
    const vehicleGroup = new THREE.Group();
    const vehR = getScaledRadius(currentAltKm);
    vehicleGroup.position.set(0, vehR, 0);

    // Build vehicle according to altitude regime
    if (currentAltKm <= 9) {
      // Mountain Peak Pin / Ground Station (Mt. Everest regime)
      const pinGeo = new THREE.ConeGeometry(0.04, 0.1, 8);
      const pinMat = new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x059669 });
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.rotation.x = Math.PI;
      vehicleGroup.add(pin);
    } else if (currentAltKm <= 20) {
      // Commercial Jet Airliner
      const fuselageGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.12, 12);
      const jetMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.8, roughness: 0.2 });
      const fuselage = new THREE.Mesh(fuselageGeo, jetMat);
      fuselage.rotation.z = Math.PI * 0.5;
      vehicleGroup.add(fuselage);

      const wingGeo = new THREE.BoxGeometry(0.18, 0.005, 0.04);
      const wing = new THREE.Mesh(wingGeo, jetMat);
      vehicleGroup.add(wing);
    } else if (currentAltKm <= 50) {
      // Weather Balloon / Felix Baumgartner Capsule
      const balloonGeo = new THREE.SphereGeometry(0.06, 16, 16);
      const balloonMat = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        emissive: 0xb91c1c,
        emissiveIntensity: 0.5
      });
      const balloon = new THREE.Mesh(balloonGeo, balloonMat);
      vehicleGroup.add(balloon);
    } else if (currentAltKm <= 95) {
      // Shooting Star / Burning Meteor
      const meteorGeo = new THREE.DodecahedronGeometry(0.04);
      const meteorMat = new THREE.MeshStandardMaterial({
        color: 0xf97316,
        emissive: 0xea580c,
        emissiveIntensity: 1.2
      });
      const meteor = new THREE.Mesh(meteorGeo, meteorMat);
      vehicleGroup.add(meteor);

      // Tail flame
      const tailGeo = new THREE.ConeGeometry(0.03, 0.14, 8);
      const tailMat = new THREE.MeshBasicMaterial({ color: 0xfacc15, transparent: true, opacity: 0.8 });
      const tail = new THREE.Mesh(tailGeo, tailMat);
      tail.position.y = -0.07;
      vehicleGroup.add(tail);
    } else if (currentAltKm <= 200) {
      // Rocket Capsule (Kármán Space Boundary)
      const rocketGeo = new THREE.CylinderGeometry(0.02, 0.03, 0.14, 12);
      const rocketMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.9, roughness: 0.1 });
      const rocket = new THREE.Mesh(rocketGeo, rocketMat);
      vehicleGroup.add(rocket);
    } else {
      // ISS / Satellite (Orbital space)
      const issHubGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.1, 12);
      const issMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9 });
      const issHub = new THREE.Mesh(issHubGeo, issMat);
      vehicleGroup.add(issHub);

      // Solar panels
      const panelGeo = new THREE.BoxGeometry(0.24, 0.005, 0.06);
      const panelMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        emissive: 0x0369a1,
        emissiveIntensity: 0.6,
        metalness: 0.9
      });
      const panel = new THREE.Mesh(panelGeo, panelMat);
      vehicleGroup.add(panel);
    }

    // Glowing Halo Beacon around the vehicle
    const beaconGeo = new THREE.RingGeometry(0.07, 0.09, 32);
    const beaconMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9
    });
    const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
    beaconMesh.rotation.x = Math.PI * 0.5;
    vehicleGroup.add(beaconMesh);

    globeGroup.add(vehicleGroup);
    sceneRef.current.vehicleGroup = vehicleGroup;

    // 6. Vertical Altitude Laser Line connecting Earth surface to Vehicle
    const linePoints = [new THREE.Vector3(0, 1.0, 0), new THREE.Vector3(0, vehR, 0)];
    const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
    const lineMat = new THREE.LineDashedMaterial({
      color: 0x38bdf8,
      dashSize: 0.04,
      gapSize: 0.02
    });
    const beaconLine = new THREE.Line(lineGeo, lineMat);
    beaconLine.computeLineDistances();
    globeGroup.add(beaconLine);
    sceneRef.current.beaconLine = beaconLine;

    scene.add(globeGroup);

    // Mouse / Touch Drag Orbit
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let rotY = 0.2;
    let rotX = 0.15;

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
    let clock = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      clock += 0.02;

      const currentAlt = currentAltRef.current;
      const currentVehR = getScaledRadius(currentAlt);

      if (vehicleGroup) {
        vehicleGroup.position.set(0, currentVehR, 0);
      }
      
      if (beaconLine) {
        const linePoints = [new THREE.Vector3(0, 1.0, 0), new THREE.Vector3(0, currentVehR, 0)];
        beaconLine.geometry.setFromPoints(linePoints);
        beaconLine.computeLineDistances();
      }

      if (autoRotate && !isDragging) {
        rotY += 0.003;
      }

      // Rotate clouds slightly faster than earth
      if (cloudsMesh) {
        cloudsMesh.rotation.y += 0.0008;
      }

      // Pulse beacon ring
      if (beaconMesh) {
        const s = 1.0 + Math.sin(clock * 3) * 0.15;
        beaconMesh.scale.set(s, s, s);
      }

      // Camera position
      if (cameraMode === 'vehicle' && vehicleGroup) {
        // Cockpit / Follow probe camera
        camera.position.x = 0.4;
        camera.position.y = currentVehR + 0.35;
        camera.position.z = 0.8;
        camera.lookAt(0, currentVehR, 0);
      } else {
        const radius = 3.8;
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
  }, [selectedLayerId, cameraMode, showShells, showAuroras, autoRotate]);

  return (
    <div className="relative w-full h-[360px] sm:h-[400px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#020617] via-[#050b1a] to-[#020617] border-2 border-slate-800/90 shadow-2xl flex flex-col justify-between group">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Top Overlay: Controls & Live Altitude Badge */}
      <div className="relative z-10 flex flex-wrap items-center justify-between p-3 sm:p-4 gap-2 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-sky-500/20 border border-sky-500/40 text-sky-300 backdrop-blur-md flex items-center gap-1.5 shadow-lg">
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            3D Atmospheric Flight Simulator
          </span>

          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 backdrop-blur-md flex items-center gap-1 animate-pulse">
            <Rocket className="w-3 h-3 text-emerald-400" />
            Alt: {currentAltKm.toFixed(1)} km
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Camera View Mode */}
          <button
            type="button"
            onClick={() => setCameraMode(cameraMode === 'global' ? 'vehicle' : 'global')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold border backdrop-blur-md transition-all flex items-center gap-1 cursor-pointer ${
              cameraMode === 'vehicle'
                ? 'bg-sky-500 text-cosmic-950 border-white shadow-lg'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-slate-700'
            }`}
            title="Toggle Global Orbit vs Probe Follow Camera"
          >
            <Eye className="w-3 h-3" />
            <span>{cameraMode === 'vehicle' ? 'Vehicle View' : 'Global Orbit'}</span>
          </button>

          {/* Toggle Atmosphere Shells */}
          <button
            type="button"
            onClick={() => setShowShells(!showShells)}
            className={`px-2 py-1 rounded-xl text-[10px] font-mono font-bold border backdrop-blur-md transition-all flex items-center gap-1 cursor-pointer ${
              showShells
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                : 'bg-slate-900/80 text-slate-400 border-slate-700'
            }`}
            title="Toggle Atmosphere Concentric Shells"
          >
            <Layers className="w-3 h-3" />
          </button>

          {/* Toggle Aurora Curtains */}
          <button
            type="button"
            onClick={() => setShowAuroras(!showAuroras)}
            className={`px-2 py-1 rounded-xl text-[10px] font-mono font-bold border backdrop-blur-md transition-all flex items-center gap-1 cursor-pointer ${
              showAuroras
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-900/80 text-slate-400 border-slate-700'
            }`}
            title="Toggle Polar Auroras"
          >
            <Sparkles className="w-3 h-3 text-emerald-400" />
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

      {/* Bottom Overlay: Altitude Layer Pins */}
      <div className="relative z-10 p-3 sm:p-4 bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-transparent flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono pointer-events-auto">
          <button
            type="button"
            onClick={() => onSelectMilestone && onSelectMilestone(8.849)}
            className="px-2 py-1 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 hover:border-emerald-400 transition-all cursor-pointer"
          >
            🏔️ Everest (8.85 km)
          </button>

          <button
            type="button"
            onClick={() => onSelectMilestone && onSelectMilestone(11.5)}
            className="px-2 py-1 rounded-lg bg-sky-950/60 text-sky-300 border border-sky-500/30 hover:border-sky-400 transition-all cursor-pointer"
          >
            ✈️ Jet (11.5 km)
          </button>

          <button
            type="button"
            onClick={() => onSelectMilestone && onSelectMilestone(25)}
            className="px-2 py-1 rounded-lg bg-indigo-950/60 text-indigo-300 border border-indigo-500/30 hover:border-indigo-400 transition-all cursor-pointer"
          >
            🛡️ Ozone (25 km)
          </button>

          <button
            type="button"
            onClick={() => onSelectMilestone && onSelectMilestone(80)}
            className="px-2 py-1 rounded-lg bg-purple-950/60 text-purple-300 border border-purple-500/30 hover:border-purple-400 transition-all cursor-pointer"
          >
            ☄️ Meteor (80 km)
          </button>

          <button
            type="button"
            onClick={() => onSelectMilestone && onSelectMilestone(100)}
            className="px-2 py-1 rounded-lg bg-amber-950/60 text-amber-300 border border-amber-500/30 hover:border-amber-400 transition-all cursor-pointer"
          >
            🚀 Space (100 km)
          </button>

          <button
            type="button"
            onClick={() => onSelectMilestone && onSelectMilestone(408)}
            className="px-2 py-1 rounded-lg bg-rose-950/60 text-rose-300 border border-rose-500/30 hover:border-rose-400 transition-all cursor-pointer"
          >
            🛰️ ISS (408 km)
          </button>
        </div>

        <span className="text-[10px] text-slate-400 font-mono hidden md:inline">
          Drag to orbit 360°
        </span>
      </div>
    </div>
  );
};
