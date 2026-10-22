import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { BirthChartData, PlanetName } from '../../types/jataka';
import { useI18n } from '../../localization/i18n';
import { NASA_SOLAR_PHYSICS } from './nasaPhysicsData';
import { LiveBigBangSimulator } from './LiveBigBangSimulator';
import { SafeErrorBoundary } from '../common/SafeErrorBoundary';
import {
  createSaturnRingTexture,
  loadRealPlanetTexture
} from './planetTextures';
import {
  Sparkles,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
  Flame,
  Layers,
  Compass,
  Atom,
  Radio,
  Activity,
  Crosshair,
  Maximize2,
  ChevronRight,
  ChevronLeft,
  Minus
} from 'lucide-react';

interface Props {
  chartData: BirthChartData;
  onExploreEncyclopedia?: () => void;
}

const ZODIAC_SIGNS = [
  { or: 'ମେଷ', en: 'Aries', glyph: '♈', color: '#f97316' },
  { or: 'ବୃଷ', en: 'Taurus', glyph: '♉', color: '#10b981' },
  { or: 'ମିଥୁନ', en: 'Gemini', glyph: '♊', color: '#06b6d4' },
  { or: 'କର୍କଟ', en: 'Cancer', glyph: '♋', color: '#3b82f6' },
  { or: 'ସିଂହ', en: 'Leo', glyph: '♌', color: '#f59e0b' },
  { or: 'କନ୍ୟା', en: 'Virgo', glyph: '♍', color: '#059669' },
  { or: 'ତୁଳା', en: 'Libra', glyph: '♎', color: '#0ea5e9' },
  { or: 'ବିଛା', en: 'Scorpio', glyph: '♏', color: '#6366f1' },
  { or: 'ଧନୁ', en: 'Sagittarius', glyph: '♐', color: '#ea580c' },
  { or: 'ମକର', en: 'Capricorn', glyph: '♑', color: '#047857' },
  { or: 'କୁମ୍ଭ', en: 'Aquarius', glyph: '♒', color: '#0284c7' },
  { or: 'ମୀନ', en: 'Pisces', glyph: '♓', color: '#4f46e5' },
];

const displayOrbitRadius = (semiMajorAxisAU: number) =>
  2.5 + Math.sqrt(Math.max(semiMajorAxisAU, 0)) * 5;

const orbitPosition = (
  angle: number,
  semiMajorAxis: number,
  eccentricity: number,
  inclinationRad: number
) => {
  const radius = (semiMajorAxis * (1 - eccentricity * eccentricity)) /
    (1 + eccentricity * Math.cos(angle));
  return new THREE.Vector3(
    Math.cos(angle) * radius,
    Math.sin(angle) * Math.sin(inclinationRad) * radius,
    Math.sin(angle) * radius
  );
};

const PLANET_DATA: Record<PlanetName, { or: string; en: string; symbol: string; radius: number; size: number; speed: number; rotSpeed: number; inclinationDeg: number }> = {
  Surya: { or: 'ସୂର୍ଯ୍ୟ (Sun)', en: 'Sun', symbol: '☀️', radius: 0, size: 2.2, speed: 0, rotSpeed: 0.004, inclinationDeg: 7.25 },
  Budha: { or: 'ବୁଧ (Mercury)', en: 'Mercury', symbol: '☿', radius: 4.5, size: 0.38, speed: 0.024, rotSpeed: 0.01, inclinationDeg: 7.00 },
  Shukra: { or: 'ଶୁକ୍ର (Venus)', en: 'Venus', symbol: '♀', radius: 6.2, size: 0.52, speed: 0.016, rotSpeed: -0.006, inclinationDeg: 3.39 },
  Chandra: { or: 'ଚନ୍ଦ୍ର (Moon)', en: 'Moon', symbol: '🌙', radius: 8.0, size: 0.34, speed: 0.012, rotSpeed: 0.02, inclinationDeg: 5.14 },
  Mangala: { or: 'ମଙ୍ଗଳ (Mars)', en: 'Mars', symbol: '♂', radius: 10.0, size: 0.45, speed: 0.009, rotSpeed: 0.015, inclinationDeg: 1.85 },
  Guru: { or: 'ବୃହସ୍ପତି (Jupiter)', en: 'Jupiter', symbol: '♃', radius: 13.5, size: 1.15, speed: 0.005, rotSpeed: 0.03, inclinationDeg: 1.30 },
  Shani: { or: 'ଶନି (Saturn)', en: 'Saturn', symbol: '♄', radius: 17.0, size: 0.95, speed: 0.003, rotSpeed: 0.025, inclinationDeg: 2.49 },
  Rahu: { or: 'ରାହୁ (North Node)', en: 'Rahu', symbol: '☊', radius: 19.5, size: 0.42, speed: -0.002, rotSpeed: 0.01, inclinationDeg: 5.14 },
  Ketu: { or: 'କେତୁ (South Node)', en: 'Ketu', symbol: '☋', radius: 19.5, size: 0.42, speed: -0.002, rotSpeed: 0.01, inclinationDeg: 5.14 }
};

export const CosmicOrbChart3D: React.FC<Props> = ({ chartData, onExploreEncyclopedia }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const chartDataRef = useRef(chartData);
  chartDataRef.current = chartData;
  const { t, tGraha, tRashi, formatNumber, language } = useI18n();

  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetName | null>(null);
  const [activeHudTool, setActiveHudTool] = useState<'none' | 'radar' | 'asteroids' | 'zodiac'>('none');
  const [showTelemetryCoords, setShowTelemetryCoords] = useState(false);
  const [showBigBangLive, setShowBigBangLive] = useState<boolean>(false);
  const [measureTargetA, setMeasureTargetA] = useState<string>('Prithvi');
  const [measureTargetB, setMeasureTargetB] = useState<string>('Mangala');
  const [isMacroZoomActive, setIsMacroZoomActive] = useState<boolean>(false);
  const [isDrawerMinimized, setIsDrawerMinimized] = useState<boolean>(false);

  // Refs to avoid WebGL context thrashing on play/pause/speed changes
  const isPlayingRef = useRef(isPlaying);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  const speedMultRef = useRef(speedMultiplier);
  useEffect(() => { speedMultRef.current = speedMultiplier; }, [speedMultiplier]);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Horizontal dock scrolling ref & states
  const dockScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollDockLeft, setCanScrollDockLeft] = useState<boolean>(false);
  const [canScrollDockRight, setCanScrollDockRight] = useState<boolean>(true);
  const isDockDragging = useRef<boolean>(false);
  const dockStartX = useRef<number>(0);
  const dockScrollStart = useRef<number>(0);

  const updateDockScrollStatus = () => {
    const el = dockScrollRef.current;
    if (!el) return;
    setCanScrollDockLeft(el.scrollLeft > 6);
    setCanScrollDockRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 6);
  };

  useEffect(() => {
    updateDockScrollStatus();
    const handleResize = () => updateDockScrollStatus();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, []);

  // Smooth scroll left/right by direction
  const handleScrollDock = (direction: 'left' | 'right') => {
    const el = dockScrollRef.current;
    if (!el) return;
    const offset = direction === 'left' ? -220 : 220;
    el.scrollBy({ left: offset, behavior: 'smooth' });
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(updateDockScrollStatus, 250);
  };

  // Mouse drag-to-scroll handlers
  const handleDockMouseDown = (e: React.MouseEvent) => {
    isDockDragging.current = true;
    dockStartX.current = e.pageX;
    if (dockScrollRef.current) {
      dockScrollStart.current = dockScrollRef.current.scrollLeft;
    }
  };

  const handleDockMouseMove = (e: React.MouseEvent) => {
    if (!isDockDragging.current || !dockScrollRef.current) return;
    const dx = e.pageX - dockStartX.current;
    dockScrollRef.current.scrollLeft = dockScrollStart.current - dx;
    updateDockScrollStatus();
  };

  const handleDockMouseUp = () => {
    isDockDragging.current = false;
  };

  // Auto-scroll to selected planet on change
  useEffect(() => {
    if (!selectedPlanet || !dockScrollRef.current) return;
    const activeBtn = dockScrollRef.current.querySelector(`[data-planet="${selectedPlanet}"]`);
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(updateDockScrollStatus, 300);
    }
  }, [selectedPlanet]);

  // Real-time telemetry coordinates (X, Y, Z)
  const [telemetryPos, setTelemetryPos] = useState<Record<string, { x: number; y: number; z: number; speedKmS: number }>>({});

  // Communication refs with Three.js engine
  const controlsRef = useRef<{
    focusOn: (pName: PlanetName | null, macro?: boolean) => void;
    zoom: (factor: number) => void;
    resetCamera: () => void;
  } | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 400;
    const height = mount.clientHeight || 560;

    // 1. Three.js Scene, Camera, & High-Performance Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 2500);
    camera.position.set(0, 28, 40);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    mount.appendChild(renderer.domElement);

    // 2. The Blazing Central Sun (Surya) - Brilliant Light Source
    const sunTex = loadRealPlanetTexture('Sun');
    const sunGeo = new THREE.SphereGeometry(2.2, 48, 48);
    const sunMat = new THREE.MeshBasicMaterial({ map: sunTex });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    scene.add(sunMesh);

    // Pulsating Solar Coronal Glow Halo
    const haloGeo = new THREE.SphereGeometry(2.8, 32, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xffa500,
      transparent: true,
      opacity: 0.35,
      side: THREE.BackSide
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    scene.add(haloMesh);

    // Outer Solar Flare Bloom
    const flareGeo = new THREE.SphereGeometry(3.6, 32, 32);
    const flareMat = new THREE.MeshBasicMaterial({
      color: 0xff7700,
      transparent: true,
      opacity: 0.14,
      side: THREE.BackSide
    });
    const flareMesh = new THREE.Mesh(flareGeo, flareMat);
    scene.add(flareMesh);

    // Primary Solar Light Source
    const sunPointLight = new THREE.PointLight(0xfff8ee, 6.0, 140, 0.5);
    sunPointLight.position.set(0, 0, 0);
    scene.add(sunPointLight);

    // Subtle Ambient Cosmic Glow
    const ambientLight = new THREE.AmbientLight(0x1e293b, 0.5);
    scene.add(ambientLight);

    // 3. MAIN ASTEROID BELT (3,000 Realistic Particles between Mars & Jupiter)
    const asteroidCount = 3000;
    const asteroidGeo = new THREE.BufferGeometry();
    const asteroidPos = new Float32Array(asteroidCount * 3);
    const asteroidColors = new Float32Array(asteroidCount * 3);

    for (let i = 0; i < asteroidCount; i++) {
      const radius = 11.2 + Math.random() * 1.8;
      const angle = Math.random() * Math.PI * 2;
      const heightSpread = (Math.random() - 0.5) * 0.7;

      asteroidPos[i * 3] = Math.cos(angle) * radius;
      asteroidPos[i * 3 + 1] = heightSpread;
      asteroidPos[i * 3 + 2] = Math.sin(angle) * radius;

      const c = 0.5 + Math.random() * 0.3;
      asteroidColors[i * 3] = c;
      asteroidColors[i * 3 + 1] = c * 0.9;
      asteroidColors[i * 3 + 2] = c * 0.8;
    }

    asteroidGeo.setAttribute('position', new THREE.BufferAttribute(asteroidPos, 3));
    asteroidGeo.setAttribute('color', new THREE.BufferAttribute(asteroidColors, 3));
    const asteroidMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.65
    });
    const asteroidBelt = new THREE.Points(asteroidGeo, asteroidMat);
    scene.add(asteroidBelt);

    // 4. Planets Setup with True NASA 3D Orbital Inclinations
    const moonTex = loadRealPlanetTexture('Moon');
    const TEXTURES: Partial<Record<PlanetName, THREE.Texture>> = {
      Surya: sunTex,
      Chandra: moonTex,
      Mangala: loadRealPlanetTexture('Mars'),
      Budha: loadRealPlanetTexture('Mercury'),
      Guru: loadRealPlanetTexture('Jupiter'),
      Shukra: loadRealPlanetTexture('Venus'),
      Shani: loadRealPlanetTexture('Saturn'),
    };

    interface PlanetNode {
      name: PlanetName;
      group: THREE.Group;
      mesh: THREE.Mesh;
      angle: number;
      speed: number;
      radius: number;
      rotSpeed: number;
      inclinationRad: number;
      eccentricity: number;
    }

    const planetNodes: PlanetNode[] = [];
    const earthOrbitGroup = new THREE.Group();
    scene.add(earthOrbitGroup);

    // Earth Sphere
    const earthTex = loadRealPlanetTexture('Earth');
    const earthGeo = new THREE.SphereGeometry(0.55, 32, 32);
    const earthMat = new THREE.MeshStandardMaterial({ map: earthTex, roughness: 0.45, metalness: 0.1 });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthMesh.name = 'Prithvi';
    earthMesh.rotation.z = (23.44 * Math.PI) / 180;
    earthOrbitGroup.add(earthMesh);

    // Moon orbiting Earth
    const moonGeo = new THREE.SphereGeometry(0.24, 24, 24);
    const moonMat = new THREE.MeshStandardMaterial({ map: moonTex, roughness: 0.8 });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.name = 'Chandra';
    earthOrbitGroup.add(moonMesh);

    // ISRO Aditya-L1 Spacecraft Model
    const adityaGeo = new THREE.BoxGeometry(0.08, 0.08, 0.12);
    const adityaMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    const adityaMesh = new THREE.Mesh(adityaGeo, adityaMat);
    adityaMesh.position.set(-0.8, 0.05, 0);
    earthOrbitGroup.add(adityaMesh);

    // NASA James Webb Space Telescope (JWST at L2 point)
    const jwstGeo = new THREE.OctahedronGeometry(0.09, 0);
    const jwstMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const jwstMesh = new THREE.Mesh(jwstGeo, jwstMat);
    jwstMesh.position.set(0.9, 0.05, 0);
    earthOrbitGroup.add(jwstMesh);

    const earthPhysics = NASA_SOLAR_PHYSICS.Prithvi;
    const earthOrbitRadius = displayOrbitRadius(earthPhysics.semiMajorAxisAU);
    const earthInclinationRad = THREE.MathUtils.degToRad(earthPhysics.inclinationDeg);
    const earthOrbitPoints: THREE.Vector3[] = [];
    for (let theta = 0; theta <= Math.PI * 2; theta += 0.025) {
      earthOrbitPoints.push(orbitPosition(
        theta,
        earthOrbitRadius,
        earthPhysics.eccentricity,
        earthInclinationRad
      ));
    }
    const earthOrbitGeometry = new THREE.BufferGeometry().setFromPoints(earthOrbitPoints);
    const earthOrbitMaterial = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.28
    });
    scene.add(new THREE.LineLoop(earthOrbitGeometry, earthOrbitMaterial));

    const moonOrbitRadius = 0.9;
    const moonOrbitPoints: THREE.Vector3[] = [];
    for (let theta = 0; theta <= Math.PI * 2; theta += 0.08) {
      const radius = moonOrbitRadius * (1 - earthPhysics.eccentricity * earthPhysics.eccentricity) /
        (1 + earthPhysics.eccentricity * Math.cos(theta));
      moonOrbitPoints.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
    }
    const moonOrbitGeometry = new THREE.BufferGeometry().setFromPoints(moonOrbitPoints);
    const moonOrbitMaterial = new THREE.LineBasicMaterial({
      color: 0xcbd5e1,
      transparent: true,
      opacity: 0.38
    });
    earthOrbitGroup.add(new THREE.LineLoop(moonOrbitGeometry, moonOrbitMaterial));

    for (const [pName, pPos] of Object.entries(chartDataRef.current.planets)) {
      const p = pName as PlanetName;
      const cfg = PLANET_DATA[p];

      if (p === 'Surya' || p === 'Chandra') continue;

      const physics = NASA_SOLAR_PHYSICS[p];
      const semiMajorAxisAU = p === 'Rahu' || p === 'Ketu' ? 1 : physics.semiMajorAxisAU;
      const orbitRadius = displayOrbitRadius(semiMajorAxisAU);
      const eccentricity = physics.eccentricity;
      const inclinationRad = THREE.MathUtils.degToRad(physics.inclinationDeg);

      const group = new THREE.Group();
      const trackPoints: THREE.Vector3[] = [];
      for (let theta = 0; theta <= Math.PI * 2; theta += 0.025) {
        trackPoints.push(orbitPosition(theta, orbitRadius, eccentricity, inclinationRad));
      }
      const trackGeo = new THREE.BufferGeometry().setFromPoints(trackPoints);
      const isLunarNode = p === 'Rahu' || p === 'Ketu';
      const trackMat = new THREE.LineBasicMaterial({
        color: isLunarNode ? 0xa78bfa : 0x64748b,
        transparent: true,
        opacity: isLunarNode ? 0.22 : 0.2
      });
      const trackLine = new THREE.LineLoop(trackGeo, trackMat);
      scene.add(trackLine);

      const pGeo = new THREE.SphereGeometry(cfg.size, 32, 32);
      let pMat: THREE.Material;

      const tex = TEXTURES[p];
      if (tex) {
        pMat = new THREE.MeshStandardMaterial({
          map: tex,
          roughness: 0.5,
          metalness: 0.1
        });
      } else if (p === 'Rahu') {
        pMat = new THREE.MeshStandardMaterial({
          color: 0x8b5cf6,
          emissive: 0x4c1d95,
          emissiveIntensity: 0.6,
          roughness: 0.3
        });
      } else {
        pMat = new THREE.MeshStandardMaterial({
          color: 0x64748b,
          emissive: 0x334155,
          emissiveIntensity: 0.4,
          roughness: 0.5
        });
      }

      const mesh = new THREE.Mesh(pGeo, pMat);
      mesh.name = p;
      mesh.rotation.z = THREE.MathUtils.degToRad(physics.axialTiltDeg);
      mesh.userData = { planetName: p };
      group.add(mesh);

      if (p === 'Shani') {
        const ringTex = createSaturnRingTexture();
        const ringGeo = new THREE.RingGeometry(1.3, 2.5, 96);
        const ringMat = new THREE.MeshStandardMaterial({
          map: ringTex,
          side: THREE.DoubleSide,
          transparent: true,
          roughness: 0.4,
          depthWrite: false
        });
        const satRing = new THREE.Mesh(ringGeo, ringMat);
        satRing.rotation.x = (26.73 * Math.PI) / 180;
        group.add(satRing);
      }

      const startAngle = THREE.MathUtils.degToRad(pPos.longitude);
      group.position.copy(orbitPosition(startAngle, orbitRadius, eccentricity, inclinationRad));

      scene.add(group);

      planetNodes.push({
        name: p,
        group,
        mesh,
        angle: startAngle,
        speed: (isLunarNode ? -1 : 1) * 0.003 * (365.256 / physics.orbitalPeriodDays),
        radius: orbitRadius,
        rotSpeed: cfg.rotSpeed,
        inclinationRad,
        eccentricity
      });
    }

    // 5. Far Outer Celestial Constellation Ring (Only on the very edge of space, far away!)
    const OUTER_RING_RADIUS = 21.5;

    // Outer Zodiac Sphere Frame
    const starGeo = new THREE.BufferGeometry();
    const starPos = [];
    for (let i = 0; i < 2000; i++) {
      const r = 40 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      starPos.push(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
    }
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.15, transparent: true, opacity: 0.8 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Raycaster for interacting with planets
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Camera interaction state
    let isDragging = false;
    let isPanning = false;
    let prevX = 0;
    let prevY = 0;
    let camTheta = 0.68; // Elevational angle
    let camPhi = 0;      // Azimuthal angle
    let camDistance = 54.0;
    let focusedTarget: PlanetName | null = null;
    let panOffset = new THREE.Vector3(0, 0, 0);

    const getFocusedWorldPos = () => {
      if (!focusedTarget) return panOffset;
      if (focusedTarget === 'Surya') return new THREE.Vector3(0, 0, 0);
      const targetNode = planetNodes.find(n => n.name === focusedTarget);
      if (targetNode) {
        if (focusedTarget === 'Chandra') return earthMesh.getWorldPosition(new THREE.Vector3());
        return targetNode.mesh.getWorldPosition(new THREE.Vector3());
      }
      return panOffset;
    };

    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 0) isDragging = true;
      if (e.button === 2) isPanning = true;
      prevX = e.clientX;
      prevY = e.clientY;

      const rect = mount.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(scene.children, true);
      const clickedPlanet = intersects.find(hit => hit.object.name && PLANET_DATA[hit.object.name as PlanetName]);

      if (clickedPlanet && e.button === 0) {
        const pName = clickedPlanet.object.name as PlanetName;
        setSelectedPlanet(pName);
        controlsRef.current?.focusOn(pName, false);
      }
    };

    const onContextMenu = (e: MouseEvent) => e.preventDefault();

    const onMouseMove = (e: MouseEvent) => {
      if (isPanning) {
        const dx = e.clientX - prevX;
        const dy = e.clientY - prevY;
        const panSpeed = camDistance * 0.0016;
        panOffset.x -= (dx * Math.cos(camPhi) - dy * Math.sin(camPhi) * Math.sin(camTheta)) * panSpeed;
        panOffset.z -= (-dx * Math.sin(camPhi) - dy * Math.cos(camPhi) * Math.sin(camTheta)) * panSpeed;
        prevX = e.clientX;
        prevY = e.clientY;
        return;
      }

      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;

      camPhi -= dx * 0.006;
      camTheta = THREE.MathUtils.clamp(camTheta - dy * 0.006, 0.04, Math.PI * 0.48);

      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
      isPanning = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 1.08 : 0.92;
      const minD = focusedTarget ? 0.65 : 24.0;
      const maxD = focusedTarget ? 45.0 : 160.0;
      camDistance = THREE.MathUtils.clamp(camDistance * zoomFactor, minD, maxD);
    };

    mount.addEventListener('mousedown', onMouseDown);
    mount.addEventListener('contextmenu', onContextMenu);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    mount.addEventListener('wheel', onWheel, { passive: false });

    const updateViewportOffset = (hasDrawer: boolean) => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (hasDrawer && w >= 1024) {
        camera.setViewOffset(w, h, 140, 0, w, h);
      } else {
        camera.clearViewOffset();
      }
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
    };

    controlsRef.current = {
      focusOn: (pName: PlanetName | null, macro = false) => {
        focusedTarget = pName;
        panOffset.set(0, 0, 0);
        updateViewportOffset(Boolean(pName));
        if (!pName) {
          camDistance = 54.0;
          camTheta = 0.68;
          return;
        }
        camDistance = macro ? 1.0 : 2.5;
      },
      zoom: (factor: number) => {
        const minD = focusedTarget ? 0.65 : 24.0;
        const maxD = focusedTarget ? 45.0 : 160.0;
        camDistance = THREE.MathUtils.clamp(camDistance * factor, minD, maxD);
      },
      resetCamera: () => {
        focusedTarget = null;
        panOffset.set(0, 0, 0);
        updateViewportOffset(false);
        camDistance = 54.0;
        camTheta = 0.68;
        camPhi = 0;
      }
    };

    // Animation Loop
    let animId: number;
    const clock = new THREE.Clock();
    let telemetryElapsed = 0;
    let targetLookAt = new THREE.Vector3(0, 0, 0);
    let earthAngle = THREE.MathUtils.degToRad(chartDataRef.current.planets.Surya.longitude + 180);
    let moonAngle = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const deltaSeconds = Math.min(clock.getDelta(), 0.1);
      const frameScale = deltaSeconds * 60;
      telemetryElapsed += deltaSeconds;

      sunMesh.rotation.y += 0.003 * frameScale;
      haloMesh.rotation.y -= 0.001 * frameScale;
      stars.rotation.y += 0.00004 * frameScale;
      asteroidBelt.rotation.y += 0.0006 * frameScale;

      const liveTarget = getFocusedWorldPos();
      const cameraSmoothing = 1 - Math.exp(-8 * deltaSeconds);
      targetLookAt.lerp(liveTarget, cameraSmoothing);

      const desiredCamPos = new THREE.Vector3(
        targetLookAt.x + camDistance * Math.sin(camTheta) * Math.sin(camPhi),
        targetLookAt.y + camDistance * Math.cos(camTheta),
        targetLookAt.z + camDistance * Math.sin(camTheta) * Math.cos(camPhi)
      );
      camera.position.lerp(desiredCamPos, cameraSmoothing);
      camera.lookAt(targetLookAt);

      if (isPlayingRef.current) {
        const mult = speedMultRef.current;
        earthAngle += 0.003 * frameScale * mult;
        earthOrbitGroup.position.copy(orbitPosition(
          earthAngle,
          earthOrbitRadius,
          earthPhysics.eccentricity,
          earthInclinationRad
        ));
        moonAngle += 0.003 * (365.256 / NASA_SOLAR_PHYSICS.Chandra.orbitalPeriodDays) * frameScale * mult;
        const moonRadius = moonOrbitRadius * (1 - NASA_SOLAR_PHYSICS.Chandra.eccentricity ** 2) /
          (1 + NASA_SOLAR_PHYSICS.Chandra.eccentricity * Math.cos(moonAngle));
        moonMesh.position.set(Math.cos(moonAngle) * moonRadius, 0, Math.sin(moonAngle) * moonRadius);
        earthMesh.rotation.y += 0.02 * frameScale * mult;

        for (const node of planetNodes) {
          node.angle += node.speed * frameScale * mult;
          node.group.position.copy(orbitPosition(
            node.angle,
            node.radius,
            node.eccentricity,
            node.inclinationRad
          ));
          node.mesh.rotation.y += node.rotSpeed * frameScale * mult;
        }
      }

      if (telemetryElapsed >= 0.5) {
        telemetryElapsed = 0;
        const telemetryMap: Record<string, { x: number; y: number; z: number; speedKmS: number }> = {};
        for (const node of planetNodes) {
          const phys = NASA_SOLAR_PHYSICS[node.name];
          const angle = Math.atan2(node.group.position.z, node.group.position.x);
          const realAU = node.name === 'Rahu' || node.name === 'Ketu' ? 1 : phys.semiMajorAxisAU;
          telemetryMap[node.name] = {
            x: Number((realAU * Math.cos(angle)).toFixed(3)),
            y: Number((realAU * Math.sin(angle) * Math.sin(node.inclinationRad)).toFixed(3)),
            z: Number((realAU * Math.sin(angle)).toFixed(3)),
            speedKmS: phys ? phys.orbitalSpeedKmS : 30.0
          };
        }
        const earthX = earthPhysics.semiMajorAxisAU * Math.cos(earthAngle);
        const earthZ = earthPhysics.semiMajorAxisAU * Math.sin(earthAngle);
        telemetryMap.Prithvi = {
          x: Number(earthX.toFixed(3)),
          y: Number((earthPhysics.semiMajorAxisAU * Math.sin(earthAngle) * Math.sin(earthInclinationRad)).toFixed(3)),
          z: Number(earthZ.toFixed(3)),
          speedKmS: earthPhysics.orbitalSpeedKmS
        };
        telemetryMap.Chandra = {
          x: Number((earthX + NASA_SOLAR_PHYSICS.Chandra.semiMajorAxisAU * Math.cos(moonAngle)).toFixed(3)),
          y: Number((earthPhysics.semiMajorAxisAU * Math.sin(earthAngle) * Math.sin(earthInclinationRad)).toFixed(3)),
          z: Number((earthZ + NASA_SOLAR_PHYSICS.Chandra.semiMajorAxisAU * Math.sin(moonAngle)).toFixed(3)),
          speedKmS: NASA_SOLAR_PHYSICS.Chandra.orbitalSpeedKmS
        };
        setTelemetryPos(telemetryMap);
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      updateViewportOffset(Boolean(focusedTarget));
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mount.removeEventListener('mousedown', onMouseDown);
      mount.removeEventListener('contextmenu', onContextMenu);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      mount.removeEventListener('wheel', onWheel);
      cancelAnimationFrame(animId);
      
      scene.traverse((obj: any) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m: any) => { if (m.map) m.map.dispose(); m.dispose(); });
          else { if (obj.material.map) obj.material.map.dispose(); obj.material.dispose(); }
        }
      });
      scene.clear();
      
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, []);

  const handlePlanetSelect = (p: PlanetName) => {
    setSelectedPlanet(p);
    setIsMacroZoomActive(false);
    setIsDrawerMinimized(false);
    setActiveHudTool('none');
    controlsRef.current?.focusOn(p, false);
  };

  const handleMacroToggle = () => {
    if (!selectedPlanet) return;
    const nextState = !isMacroZoomActive;
    setIsMacroZoomActive(nextState);
    controlsRef.current?.focusOn(selectedPlanet, nextState);
  };

  const handleReset = () => {
    setSelectedPlanet(null);
    setIsMacroZoomActive(false);
    setIsDrawerMinimized(false);
    setActiveHudTool('none');
    controlsRef.current?.resetCamera();
  };

  const activePlanetInfo = selectedPlanet ? chartData.planets[selectedPlanet] : null;
  const activeNasaData = selectedPlanet ? NASA_SOLAR_PHYSICS[selectedPlanet] : null;

  // Real-time live distance measurement calculation
  const liveDistanceMetric = useMemo(() => {
    const posA = telemetryPos[measureTargetA];
    const posB = telemetryPos[measureTargetB];
    if (!posA || !posB) return null;

    const dx = posA.x - posB.x;
    const dy = posA.y - posB.y;
    const dz = posA.z - posB.z;
    const distAU = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const distKm = distAU * 149597870.7; // 1 AU = 149.6M km
    const lightTravelSeconds = distKm / 299792.458; // c in km/s

    return {
      distAU: distAU.toFixed(3),
      distMlnKm: (distKm / 1e6).toFixed(2),
      lightTravelMin: (lightTravelSeconds / 60).toFixed(1)
    };
  }, [measureTargetA, measureTargetB, telemetryPos]);

  return (
    <div className="relative w-full h-[580px] sm:h-[660px] md:h-[720px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#010409] via-[#050b18] to-[#02040a] border-2 border-cosmic-gold/40 shadow-2xl backdrop-blur-2xl select-none group">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Header Bar: Clean, Zero-Overlap Controls */}
      <div className="absolute top-3 left-3 right-3 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-2 z-20 pointer-events-none">
        {/* Left: Motion badge & speed */}
        <div
          className="flex w-full lg:max-w-[40%] flex-wrap items-center gap-1.5 pointer-events-auto"
        >
          <div className="flex-shrink-0 flex items-center gap-2 whitespace-nowrap bg-cosmic-950/90 border border-cosmic-gold/40 px-3 py-1.5 rounded-2xl backdrop-blur-md shadow-xl text-xs font-bold text-cosmic-gold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>NASA Data • Accelerated</span>
          </div>

          <div className="flex flex-shrink-0 items-center bg-cosmic-950/90 border border-slate-800 p-1 rounded-2xl backdrop-blur-md shadow-lg">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                isPlaying ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}
              title={isPlaying ? 'Pause Motion' : 'Play Live Motion'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => setSpeedMultiplier(speedMultiplier === 1 ? 2 : speedMultiplier === 2 ? 5 : 1)}
              className="px-2.5 py-1 text-xs font-bold text-cosmic-gold hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              {speedMultiplier}x
            </button>
          </div>

          {/* Always Visible "Show All Planets" button */}
          <button
            type="button"
            onClick={handleReset}
            className={`flex-shrink-0 whitespace-nowrap px-3 py-1.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border shadow-lg ${
              !selectedPlanet
                ? 'bg-gradient-to-r from-cosmic-gold to-yellow-400 text-cosmic-950 border-white shadow-cosmic-gold/20'
                : 'bg-cosmic-950/80 text-cosmic-gold border-cosmic-gold/50 hover:bg-cosmic-900'
            }`}
            title="Overview: Show all planets in perspective"
          >
            <span>🪐</span>
            <span>{language === 'or' ? 'ସମସ୍ତ ଗ୍ରହ ଏକତ୍ର' : 'All Planets'}</span>
          </button>

          {/* Targeted Planet Indicator */}
          {selectedPlanet && (
            <div className="flex flex-shrink-0 items-center gap-1.5 whitespace-nowrap bg-cosmic-900/90 border border-cosmic-gold/50 px-2.5 py-1 rounded-xl text-xs text-cosmic-gold font-bold">
              <span>🎯 {PLANET_DATA[selectedPlanet].symbol} {tGraha(selectedPlanet)}</span>
              {isMacroZoomActive && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-md border border-emerald-500/40">
                  Macro 100%
                </span>
              )}
            </div>
          )}
        </div>

        {/* Center / Right: Non-Overlapping Tool Bar */}
        <div
          className="flex w-full lg:max-w-[58%] flex-wrap items-center gap-1.5 pointer-events-auto lg:justify-end"
        >
          {/* Radar Distance Tool Toggle */}
          <button
            type="button"
            onClick={() => setActiveHudTool(prev => prev === 'radar' ? 'none' : 'radar')}
            className={`flex-shrink-0 whitespace-nowrap px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
              activeHudTool === 'radar'
                ? 'bg-sky-600 text-white border-sky-300 shadow-lg shadow-sky-500/30'
                : 'bg-cosmic-950/80 text-slate-300 border-slate-800 hover:border-slate-600'
            }`}
            title="Radar Distance Measurer"
          >
            <Radio className="w-3.5 h-3.5 text-sky-400" />
            <span>{language === 'or' ? 'ରାଡାର୍' : 'Radar'}</span>
          </button>

          {/* Asteroid Belt Info Toggle */}
          <button
            type="button"
            onClick={() => setActiveHudTool(prev => prev === 'asteroids' ? 'none' : 'asteroids')}
            className={`flex-shrink-0 whitespace-nowrap px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
              activeHudTool === 'asteroids'
                ? 'bg-amber-600 text-white border-amber-300 shadow-lg shadow-amber-500/30'
                : 'bg-cosmic-950/80 text-slate-300 border-slate-800 hover:border-slate-600'
            }`}
            title="Main Asteroid Belt Info"
          >
            <Crosshair className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'or' ? 'ଗ୍ରହାଣୁ ବଳୟ' : 'Asteroids'}</span>
          </button>

          {/* 12 Zodiac Constellations Toggle */}
          <button
            type="button"
            onClick={() => setActiveHudTool(prev => prev === 'zodiac' ? 'none' : 'zodiac')}
            className={`flex-shrink-0 whitespace-nowrap px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
              activeHudTool === 'zodiac'
                ? 'bg-indigo-600 text-white border-indigo-300 shadow-lg shadow-indigo-500/30'
                : 'bg-cosmic-950/80 text-slate-300 border-slate-800 hover:border-slate-600'
            }`}
            title="12 Zodiac Constellations"
          >
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            <span>{language === 'or' ? '୧୨ ରାଶି' : 'Zodiac'}</span>
          </button>

          {/* Telemetry Coordinates Toggle */}
          <button
            type="button"
            onClick={() => setShowTelemetryCoords(prev => !prev)}
            className={`p-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              showTelemetryCoords
                ? 'bg-emerald-600 text-white border-emerald-300'
                : 'bg-cosmic-950/80 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title="Toggle (X, Y, Z) Coordinates"
          >
            <Activity className="w-3.5 h-3.5" />
          </button>

          {/* Zoom In/Out & Reset */}
          <div           className="flex flex-shrink-0 items-center bg-cosmic-950/90 border border-slate-800 p-1 rounded-2xl backdrop-blur-md shadow-lg">
            <button
              type="button"
              onClick={() => controlsRef.current?.zoom(0.85)}
              title="Zoom In"
              className="p-1.5 text-slate-300 hover:text-cosmic-gold cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => controlsRef.current?.zoom(1.15)}
              title="Zoom Out"
              className="p-1.5 text-slate-300 hover:text-cosmic-gold cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleReset}
              title="Reset System View"
              className="p-1.5 text-slate-300 hover:text-cosmic-gold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* LIVE BIG BANG SIMULATOR TRIGGER */}
          <button
            type="button"
            onClick={() => setShowBigBangLive(true)}
            className="flex-shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-2xl text-xs font-bold bg-gradient-to-r from-amber-500 to-cosmic-gold text-cosmic-950 shadow-lg shadow-amber-500/25 border border-white hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5 animate-pulse"
          >
            <span>💥</span>
            <span>{language === 'or' ? 'ବିଗ୍ ବ୍ୟାଙ୍ଗ୍ ଲାଇଭ୍' : 'Big Bang Live'}</span>
          </button>
        </div>
      </div>

      {/* DISMISSIBLE TOOL POPUP 1: RADAR DISTANCE TOOL (Top-Left, Clean & Non-Overlapping) */}
      {activeHudTool === 'radar' && (
        <div className="absolute top-16 left-3 w-72 sm:w-80 bg-cosmic-950/95 border border-sky-500/50 p-3 rounded-2xl backdrop-blur-2xl shadow-2xl z-30 animate-in fade-in space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="font-bold text-sky-300 flex items-center gap-1.5 text-xs">
              <Radio className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
              <span>ଲାଇଭ୍ ରାଡାର୍ ଦୂରତା (Radar Distance)</span>
            </span>
            <button
              type="button"
              onClick={() => setActiveHudTool('none')}
              className="p-1 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={measureTargetA}
              onChange={(e) => setMeasureTargetA(e.target.value)}
              className="flex-1 bg-cosmic-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 text-xs font-bold outline-none"
            >
              <option value="Surya">☀️ Sun (Surya)</option>
              <option value="Budha">☿ Mercury</option>
              <option value="Shukra">♀ Venus</option>
              <option value="Prithvi">🌍 Earth</option>
              <option value="Chandra">🌙 Moon</option>
              <option value="Mangala">♂ Mars</option>
              <option value="Guru">♃ Jupiter</option>
              <option value="Shani">♄ Saturn</option>
            </select>

            <span className="text-slate-400 font-bold">↔</span>

            <select
              value={measureTargetB}
              onChange={(e) => setMeasureTargetB(e.target.value)}
              className="flex-1 bg-cosmic-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 text-xs font-bold outline-none"
            >
              <option value="Surya">☀️ Sun (Surya)</option>
              <option value="Budha">☿ Mercury</option>
              <option value="Shukra">♀ Venus</option>
              <option value="Prithvi">🌍 Earth</option>
              <option value="Chandra">🌙 Moon</option>
              <option value="Mangala">♂ Mars</option>
              <option value="Guru">♃ Jupiter</option>
              <option value="Shani">♄ Saturn</option>
            </select>
          </div>

          {liveDistanceMetric && (
            <div className="space-y-1 pt-1 border-t border-slate-800 font-mono text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Real-Time Distance:</span>
                <span className="text-cosmic-gold font-bold">{liveDistanceMetric.distAU} AU ({liveDistanceMetric.distMlnKm} M km)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Light / Radio Travel:</span>
                <span className="text-cyan-300 font-bold">{liveDistanceMetric.lightTravelMin} Light Minutes</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DISMISSIBLE TOOL POPUP 2: MAIN ASTEROID BELT (Top-Left, Clean) */}
      {activeHudTool === 'asteroids' && (
        <div className="absolute top-16 left-3 max-w-xs bg-cosmic-950/95 border border-amber-500/50 p-3 rounded-2xl backdrop-blur-2xl shadow-2xl z-30 animate-in fade-in space-y-1.5 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1">
            <span className="font-bold text-amber-400 flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5 text-amber-400" />
              <span>ମୁଖ୍ୟ ଗ୍ରହାଣୁ ବଳୟ (Asteroid Belt)</span>
            </span>
            <button
              type="button"
              onClick={() => setActiveHudTool('none')}
              className="p-1 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            ମଙ୍ଗଳ (Mars) ଏବଂ ବୃହସ୍ପତି (Jupiter) ମଧ୍ୟରେ ୩,୦୦୦+ ସକ୍ରିୟ ଗ୍ରହାଣୁ କ୍ଷେତ୍ର (Ceres, Vesta, Pallas) ବାସ୍ତବ କେପଲରୀୟ କକ୍ଷପଥରେ ସୂର୍ଯ୍ୟଙ୍କ ଚାରିପାଖରେ ପରିକ୍ରମଣ କରୁଛି।
          </p>
        </div>
      )}

      {/* DISMISSIBLE TOOL POPUP 3: 12 ZODIAC BELT (Top-Right, Clean) */}
      {activeHudTool === 'zodiac' && (
        <div className="absolute top-16 right-3 max-w-xs bg-cosmic-950/95 border border-indigo-500/50 p-3 rounded-2xl backdrop-blur-2xl shadow-2xl z-30 animate-in fade-in space-y-2 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1">
            <span className="font-bold text-indigo-300 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              <span>୧୨ ରାଶି ବଳୟ (Outer Zodiac Belt)</span>
            </span>
            <button
              type="button"
              onClick={() => setActiveHudTool('none')}
              className="p-1 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-1 text-[10px]">
            {ZODIAC_SIGNS.map((s, idx) => (
              <div key={idx} className="flex items-center gap-1 px-1.5 py-1 rounded bg-cosmic-900/80 border border-slate-800">
                <span style={{ color: s.color }}>{s.glyph}</span>
                <span className="text-slate-200">{s.or}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FLOATING SUBTLE TELEMETRY CHIP (Bottom-Left, Above Dock) */}
      {showTelemetryCoords && selectedPlanet && telemetryPos[selectedPlanet] && (
        <div className="absolute bottom-20 left-3 bg-cosmic-950/80 border border-slate-800 px-3 py-1.5 rounded-xl font-mono text-[10px] text-slate-300 z-20">
          <span className="text-emerald-400 font-bold block">{selectedPlanet} Telemetry:</span>
          <span>X: {telemetryPos[selectedPlanet].x} AU • Y: {telemetryPos[selectedPlanet].y} AU • Z: {telemetryPos[selectedPlanet].z} AU</span>
        </div>
      )}

      {/* SCIENTIST PLANETARY DOSSIER DRAWER (Docked Right, ZERO OVERLAP WITH 3D CENTER & ZERO OVERLAP WITH BOTTOM DOCK!) */}
      {activePlanetInfo && (
        <>
          {isDrawerMinimized ? (
            /* Minimized Sleek Pill (Top-Right, Unobtrusive) */
            <div className="absolute top-16 right-3 bg-cosmic-950/95 border-2 border-cosmic-gold/50 rounded-2xl p-2 px-3.5 flex items-center gap-3 backdrop-blur-2xl shadow-2xl z-30 animate-in fade-in">
              <span className="text-xl">{PLANET_DATA[activePlanetInfo.planet].symbol}</span>
              <div>
                <span className="text-xs font-bold text-cosmic-gold block">{tGraha(activePlanetInfo.planet)}</span>
                <span className="text-[10px] font-mono text-slate-400">{PLANET_DATA[activePlanetInfo.planet].en} • H{formatNumber(activePlanetInfo.house)}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsDrawerMinimized(false)}
                className="px-2.5 py-1 bg-gradient-to-r from-cosmic-gold to-amber-500 text-cosmic-950 text-[10px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-md hover:scale-105"
                title="Expand Scientific Dossier"
              >
                <Maximize2 className="w-3 h-3" />
                <span>ବିସ୍ତାର (Dossier)</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
                title="Close Inspector"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Full Scientific Dossier (Stops before dock on desktop; floats above dock on mobile) */
            <div className="absolute top-16 right-3 bottom-3 lg:bottom-3 max-lg:bottom-[76px] w-80 sm:w-96 bg-cosmic-950/95 border-2 border-cosmic-gold/50 rounded-3xl p-4 sm:p-5 text-xs backdrop-blur-2xl shadow-2xl z-30 overflow-y-auto space-y-4 animate-in slide-in-from-right no-scrollbar">
              {/* Header with Name, Symbol & Close */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{PLANET_DATA[activePlanetInfo.planet].symbol}</span>
                  <div>
                    <h4 className="text-base font-bold text-cosmic-gold font-serif">
                      {tGraha(activePlanetInfo.planet)}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">
                      {PLANET_DATA[activePlanetInfo.planet].en} • House {formatNumber(activePlanetInfo.house)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activePlanetInfo.dignity === 'Exalted' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                    activePlanetInfo.dignity === 'Own' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' :
                    activePlanetInfo.dignity === 'Debilitated' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {activePlanetInfo.dignity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsDrawerMinimized(true)}
                    className="p-1 text-slate-400 hover:text-cosmic-gold cursor-pointer"
                    title="Minimize Panel"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="p-1 text-slate-400 hover:text-white cursor-pointer"
                    title="Close Inspector"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Control: Macro Surface Zoom / Reset Orbit */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleMacroToggle}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 border text-xs ${
                    isMacroZoomActive
                      ? 'bg-emerald-600 text-white border-emerald-300 shadow-lg shadow-emerald-500/20'
                      : 'bg-gradient-to-r from-amber-500 to-cosmic-gold text-cosmic-950 border-white'
                  }`}
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>{isMacroZoomActive ? '🪐 Orbit View' : '🔍 Macro Surface Zoom (୧୦୦% ଜୁମ୍)'}</span>
                </button>
              </div>

              {/* NASA JPL Scientific Telemetry Grid */}
              {activeNasaData && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 block font-mono">
                    NASA JPL Physical & Orbital Constants:
                  </span>
                  <div className="grid grid-cols-2 gap-2 bg-cosmic-900/80 p-3 rounded-xl border border-slate-800 text-[11px] font-mono">
                    <div>
                      <span className="text-slate-400 block text-[9px]">Mass:</span>
                      <span className="text-slate-100 font-bold">{activeNasaData.massKg}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">Surface Gravity:</span>
                      <span className="text-amber-300 font-bold">{activeNasaData.surfaceGravityMs2} m/s²</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">Escape Velocity:</span>
                      <span className="text-cyan-300 font-bold">{activeNasaData.escapeVelocityKmS} km/s</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">Orbital Velocity:</span>
                      <span className="text-emerald-400 font-bold">{activeNasaData.orbitalSpeedKmS} km/s</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">Equatorial Radius:</span>
                      <span className="text-slate-200 font-bold">{activeNasaData.equatorialRadiusKm.toLocaleString()} km</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">Mean Temperature:</span>
                      <span className="text-rose-300 font-bold">{activeNasaData.meanTempC}°C</span>
                    </div>
                  </div>

                  {/* Atmospheric Composition */}
                  <div className="bg-cosmic-900/60 p-2.5 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 block font-mono">Atmospheric Chemistry:</span>
                    <p className="text-[11px] text-slate-200 leading-normal font-sans">
                      {activeNasaData.atmosphereComposition}
                    </p>
                  </div>

                  {/* Space Missions */}
                  <div className="bg-cosmic-900/60 p-2.5 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-emerald-400 block font-mono">Space Exploration Missions:</span>
                    <p className="text-[11px] text-slate-300 leading-normal font-sans">
                      {activeNasaData.isroNasaMissions}
                    </p>
                  </div>
                </div>
              )}

              {/* Vedic Astrological Positions */}
              <div className="space-y-1.5 bg-cosmic-900/70 p-3 rounded-xl border border-slate-800 text-[11px]">
                <span className="text-[10px] font-bold uppercase tracking-widest text-cosmic-gold block font-mono mb-1">
                  Vedic Kundali Ephemeris:
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Rashi (Sign):</span>
                  <span className="font-bold text-slate-100">{tRashi(activePlanetInfo.sign)} ({formatNumber(activePlanetInfo.degreeInSign.toFixed(2))}°)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Bhava (House):</span>
                  <span className="font-bold text-cosmic-gold">{formatNumber(activePlanetInfo.house)} {language === 'or' ? 'ଭାବ' : 'भाव'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Nakshatra:</span>
                  <span className="font-bold text-emerald-400">{activePlanetInfo.nakshatra} (Pada {formatNumber(activePlanetInfo.pada)})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Sidereal Longitude:</span>
                  <span className="font-mono text-slate-300">{formatNumber(activePlanetInfo.longitude.toFixed(3))}°</span>
                </div>
                {activePlanetInfo.isCombust && (
                  <div className="flex items-center gap-1.5 text-rose-400 font-bold text-[10px] bg-rose-950/60 p-2 rounded-xl border border-rose-500/30 mt-2">
                    <Flame className="w-4 h-4" />
                    <span>Astangata (Combust with Surya)</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* FULL-SCREEN IMMERSIVE LIVE BIG BANG SIMULATOR OVERLAY */}
      {showBigBangLive && (
        <div className="absolute inset-0 z-50 bg-black/95 p-3 sm:p-5 overflow-y-auto backdrop-blur-3xl animate-in zoom-in-95 duration-200">
          <SafeErrorBoundary
            fallbackTitle="ବିଗ୍ ବ୍ୟାଙ୍ଗ୍ 3D ଲାବ୍ (Big Bang 3D Lab)"
            onReset={() => setShowBigBangLive(false)}
          >
            <LiveBigBangSimulator onClose={() => setShowBigBangLive(false)} />
          </SafeErrorBoundary>
        </div>
      )}

      {/* Bottom Planet Selection Dock (With Interactive Left/Right Scroll Buttons & Mouse Wheel Scroll) */}
      <div className={`absolute bottom-2.5 left-3 transition-all duration-300 z-20 ${
        activePlanetInfo && !isDrawerMinimized
          ? 'right-3 lg:right-[410px]'
          : 'right-3'
      }`}>
        <div className="relative flex items-center bg-cosmic-950/95 backdrop-blur-2xl border-2 border-cosmic-gold/40 rounded-2xl shadow-2xl p-1 sm:p-1.5 gap-1 group/dock">
          {/* Scroll Left Button */}
          <button
            type="button"
            onClick={() => handleScrollDock('left')}
            disabled={!canScrollDockLeft}
            className={`flex-shrink-0 p-1.5 sm:p-2 rounded-xl transition-all border flex items-center justify-center ${
              canScrollDockLeft
                ? 'bg-cosmic-900/90 text-cosmic-gold border-cosmic-gold/50 hover:bg-cosmic-gold hover:text-cosmic-950 cursor-pointer shadow-md hover:scale-105 active:scale-95'
                : 'opacity-25 text-slate-600 border-transparent cursor-not-allowed pointer-events-none'
            }`}
            title="Scroll Left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Scrollable Planets Track with Visible Custom Cosmic Scrollbar */}
          <div
            ref={dockScrollRef}
            onScroll={updateDockScrollStatus}
            onWheel={(e) => {
              if (e.deltaY !== 0 && dockScrollRef.current) {
                e.stopPropagation();
                dockScrollRef.current.scrollLeft += e.deltaY;
                updateDockScrollStatus();
              }
            }}
            onMouseDown={handleDockMouseDown}
            onMouseMove={handleDockMouseMove}
            onMouseUp={handleDockMouseUp}
            onMouseLeave={handleDockMouseUp}
            className="flex-1 flex items-center gap-1.5 sm:gap-2 px-2 py-1 overflow-x-auto select-none flex-nowrap scroll-smooth cursor-grab active:cursor-grabbing pb-2"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#eab308 rgba(15, 23, 42, 0.6)'
            }}
          >
            {Object.values(chartData.planets).map((p) => {
              const isSelected = selectedPlanet === p.planet;
              const cfg = PLANET_DATA[p.planet];
              return (
                <button
                  key={p.planet}
                  data-planet={p.planet}
                  type="button"
                  onClick={() => handlePlanetSelect(p.planet)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-gradient-to-r from-cosmic-gold to-yellow-400 text-cosmic-950 font-bold border-white shadow-lg shadow-cosmic-gold/30 scale-105 ring-2 ring-amber-300'
                      : 'bg-cosmic-900/80 text-slate-200 border-slate-800 hover:border-cosmic-gold/60 hover:text-cosmic-gold hover:bg-cosmic-900'
                  }`}
                >
                  <span className="text-sm">{cfg.symbol}</span>
                  <span>{tGraha(p.planet)}</span>
                  <span className="text-[10px] font-mono text-cosmic-saffron font-bold">
                    {formatNumber(p.degreeInSign.toFixed(1))}°
                  </span>
                  <span className="text-[9px] font-mono opacity-80 px-1 py-0.5 rounded bg-black/40">
                    H{formatNumber(p.house)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          <button
            type="button"
            onClick={() => handleScrollDock('right')}
            disabled={!canScrollDockRight}
            className={`flex-shrink-0 p-1.5 sm:p-2 rounded-xl transition-all border flex items-center justify-center ${
              canScrollDockRight
                ? 'bg-cosmic-900/90 text-cosmic-gold border-cosmic-gold/50 hover:bg-cosmic-gold hover:text-cosmic-950 cursor-pointer shadow-md hover:scale-105 active:scale-95'
                : 'opacity-25 text-slate-600 border-transparent cursor-not-allowed pointer-events-none'
            }`}
            title="Scroll Right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};