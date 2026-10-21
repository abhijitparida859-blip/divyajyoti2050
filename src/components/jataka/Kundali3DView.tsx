import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { PlanetName, PlanetPosition, HouseInfo, VargaType } from '../../types/jataka';
import { useI18n } from '../../localization/i18n';
import {
  Sparkles, RotateCcw, Play, Pause,
  Compass, Flame, X, Check
} from 'lucide-react';

interface Props {
  planetsRecord?: Record<PlanetName, PlanetPosition>;
  houses: HouseInfo[];
  ascendantDegree?: number;
  vargaCode?: VargaType;
}

// 12 Zodiac signs with element styling & colors
const ZODIAC_METADATA = [
  { or: 'ମେଷ', hi: 'मेष', en: 'Aries', glyph: '♈', element: 'fire', color: '#f97316' },
  { or: 'ବୃଷ', hi: 'वृषभ', en: 'Taurus', glyph: '♉', element: 'earth', color: '#10b981' },
  { or: 'ମିଥୁନ', hi: 'मिथुन', en: 'Gemini', glyph: '♊', element: 'air', color: '#06b6d4' },
  { or: 'କର୍କଟ', hi: 'कर्क', en: 'Cancer', glyph: '♋', element: 'water', color: '#3b82f6' },
  { or: 'ସିଂହ', hi: 'सिंह', en: 'Leo', glyph: '♌', element: 'fire', color: '#f59e0b' },
  { or: 'କନ୍ୟା', hi: 'कन्या', en: 'Virgo', glyph: '♍', element: 'earth', color: '#059669' },
  { or: 'ତୁଳା', hi: 'तुला', en: 'Libra', glyph: '♎', element: 'air', color: '#0ea5e9' },
  { or: 'ବିଛା', hi: 'वृश्चिक', en: 'Scorpio', glyph: '♏', element: 'water', color: '#6366f1' },
  { or: 'ଧନୁ', hi: 'धनु', en: 'Sagittarius', glyph: '♐', element: 'fire', color: '#ea580c' },
  { or: 'ମକର', hi: 'मकर', en: 'Capricorn', glyph: '♑', element: 'earth', color: '#047857' },
  { or: 'କୁମ୍ଭ', hi: 'कुम्भ', en: 'Aquarius', glyph: '♒', element: 'air', color: '#0284c7' },
  { or: 'ମୀନ', hi: 'मीन', en: 'Pisces', glyph: '♓', element: 'water', color: '#4f46e5' },
];

// Planet Visual Specs
const PLANET_SPECS: Record<PlanetName, {
  color: number;
  glowColor: string;
  size: number;
  or: string;
  hi: string;
  symbol: string;
  baseRadius: number;
}> = {
  Surya: { color: 0xffaa00, glowColor: '#f59e0b', size: 1.1, or: 'ସୂର୍ଯ୍ୟ', hi: 'सूर्य', symbol: '☀️', baseRadius: 6.8 },
  Chandra: { color: 0xeeeeee, glowColor: '#cbd5e1', size: 0.75, or: 'ଚନ୍ଦ୍ର', hi: 'चन्द्र', symbol: '🌙', baseRadius: 7.4 },
  Mangala: { color: 0xef4444, glowColor: '#dc2626', size: 0.7, or: 'ମଙ୍ଗଳ', hi: 'मंगल', symbol: '♂', baseRadius: 8.0 },
  Budha: { color: 0x10b981, glowColor: '#059669', size: 0.65, or: 'ବୁଧ', hi: 'बुध', symbol: '☿', baseRadius: 8.6 },
  Guru: { color: 0xfbbf24, glowColor: '#d97706', size: 1.25, or: 'ବୃହସ୍ପତି', hi: 'गुरु', symbol: '♃', baseRadius: 9.2 },
  Shukra: { color: 0xf8fafc, glowColor: '#f1f5f9', size: 0.8, or: 'ଶୁକ୍ର', hi: 'शुक्र', symbol: '♀', baseRadius: 9.8 },
  Shani: { color: 0x818cf8, glowColor: '#6366f1', size: 1.1, or: 'ଶନି', hi: 'शनि', symbol: '♄', baseRadius: 10.4 },
  Rahu: { color: 0x475569, glowColor: '#334155', size: 0.7, or: 'ରାହୁ', hi: 'राहु', symbol: '☊', baseRadius: 11.0 },
  Ketu: { color: 0x9a3412, glowColor: '#7c2d12', size: 0.7, or: 'କେତୁ', hi: 'केतु', symbol: '☋', baseRadius: 11.0 },
};

// Procedural texture generators
function createPlanetTexture(type: PlanetName): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const grad = ctx.createLinearGradient(0, 0, 256, 128);

  switch (type) {
    case 'Surya':
      grad.addColorStop(0, '#ff4500');
      grad.addColorStop(0.5, '#ffa500');
      grad.addColorStop(1, '#ffeb3b');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 128);
      for (let i = 0; i < 25; i++) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(Math.random() * 256, Math.random() * 128, Math.random() * 8 + 2, 0, Math.PI * 2);
        ctx.fill();
      }
      break;

    case 'Chandra':
      grad.addColorStop(0, '#94a3b8');
      grad.addColorStop(0.5, '#f1f5f9');
      grad.addColorStop(1, '#cbd5e1');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 128);
      for (let i = 0; i < 30; i++) {
        ctx.fillStyle = 'rgba(100, 116, 139, 0.4)';
        ctx.beginPath();
        ctx.arc(Math.random() * 256, Math.random() * 128, Math.random() * 6 + 1, 0, Math.PI * 2);
        ctx.fill();
      }
      break;

    case 'Mangala':
      grad.addColorStop(0, '#7f1d1d');
      grad.addColorStop(0.5, '#dc2626');
      grad.addColorStop(1, '#f87171');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 128);
      for (let i = 0; i < 20; i++) {
        ctx.fillStyle = 'rgba(69, 10, 10, 0.5)';
        ctx.beginPath();
        ctx.arc(Math.random() * 256, Math.random() * 128, Math.random() * 7 + 2, 0, Math.PI * 2);
        ctx.fill();
      }
      break;

    case 'Guru':
      for (let y = 0; y < 128; y += 8) {
        ctx.fillStyle = y % 16 === 0 ? '#b45309' : (y % 24 === 0 ? '#f59e0b' : '#fef3c7');
        ctx.fillRect(0, y, 256, 8);
      }
      ctx.fillStyle = '#b91c1c';
      ctx.beginPath();
      ctx.ellipse(140, 70, 20, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 'Shani':
      for (let y = 0; y < 128; y += 6) {
        ctx.fillStyle = y % 12 === 0 ? '#d97706' : '#fde68a';
        ctx.fillRect(0, y, 256, 6);
      }
      break;

    case 'Budha':
      grad.addColorStop(0, '#047857');
      grad.addColorStop(0.5, '#10b981');
      grad.addColorStop(1, '#6ee7b7');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 128);
      break;

    case 'Shukra':
      grad.addColorStop(0, '#e2e8f0');
      grad.addColorStop(0.5, '#ffffff');
      grad.addColorStop(1, '#cbd5e1');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 128);
      break;

    case 'Rahu':
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(0.5, '#334155');
      grad.addColorStop(1, '#1e293b');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 128);
      break;

    case 'Ketu':
      grad.addColorStop(0, '#451a03');
      grad.addColorStop(0.5, '#9a3412');
      grad.addColorStop(1, '#c2410c');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 128);
      break;

    default:
      ctx.fillStyle = '#64748b';
      ctx.fillRect(0, 0, 256, 128);
      break;
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Procedural Saturn Ring Texture
function createRingTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const grad = ctx.createLinearGradient(0, 0, 256, 0);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  grad.addColorStop(0.15, 'rgba(217, 119, 6, 0.4)');
  grad.addColorStop(0.4, 'rgba(253, 230, 138, 0.8)');
  grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.1)');
  grad.addColorStop(0.65, 'rgba(245, 158, 11, 0.7)');
  grad.addColorStop(0.9, 'rgba(217, 119, 6, 0.3)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 32);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// High-DPI Billboard text sprite with depth handling
function createTextSprite(text: string, subText: string, color: string): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Sprite();

  // Background pill with subtle border
  ctx.fillStyle = 'rgba(6, 10, 22, 0.88)';
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(16, 16, 480, 128, 30);
  } else {
    ctx.rect(16, 16, 480, 128);
  }
  ctx.fill();
  ctx.stroke();

  // Main text
  ctx.fillStyle = color;
  ctx.font = 'bold 44px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(text, 256, 75);

  // Subtext
  ctx.fillStyle = '#f1f5f9';
  ctx.font = 'bold 32px monospace';
  ctx.fillText(subText, 256, 120);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({
    map: texture,
    depthTest: true,
    depthWrite: false,
    transparent: true
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(2.4, 0.8, 1);
  return sprite;
}

export const Kundali3DView: React.FC<Props> = ({
  planetsRecord,
  houses,
  ascendantDegree = 0,
  vargaCode = 'D1'
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { t, formatNumber, tRashi, language } = useI18n();

  const [isRotating, setIsRotating] = useState(true);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetName | null>(null);
  const [cameraView, setCameraView] = useState<'perspective' | 'topdown' | 'lagna'>('perspective');

  const isRotatingRef = useRef(isRotating);
  useEffect(() => { isRotatingRef.current = isRotating; }, [isRotating]);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const celestialGroupRef = useRef<THREE.Group | null>(null);
  const planetMeshesRef = useRef<Map<PlanetName, THREE.Mesh>>(new Map());

  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });

  const switchCameraView = (view: 'perspective' | 'topdown' | 'lagna') => {
    setCameraView(view);
    if (!cameraRef.current) return;
    const cam = cameraRef.current;

    if (view === 'perspective') {
      cam.position.set(0, 16, 22);
      cam.lookAt(0, 0, 0);
    } else if (view === 'topdown') {
      cam.position.set(0, 28, 0.01);
      cam.lookAt(0, 0, 0);
    } else if (view === 'lagna') {
      const ascRad = (ascendantDegree * Math.PI) / 180;
      cam.position.set(Math.cos(ascRad) * 20, 4, Math.sin(ascRad) * 20);
      cam.lookAt(0, 0, 0);
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = Math.max(container.clientHeight || 580, 580);

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 16, 22);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffeedd, 1.7);
    dirLight.position.set(10, 20, 15);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xfcd34d, 2.5, 50);
    pointLight.position.set(0, 2, 0);
    scene.add(pointLight);

    // 5. Starfield Particles Background
    const starCount = 1400;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      const radius = 60 + Math.random() * 35;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i + 2] = radius * Math.cos(phi);

      const tone = Math.random();
      if (tone > 0.8) {
        starColors[i] = 0.98; starColors[i + 1] = 0.85; starColors[i + 2] = 0.5;
      } else if (tone > 0.4) {
        starColors[i] = 0.7; starColors[i + 1] = 0.85; starColors[i + 2] = 1.0;
      } else {
        starColors[i] = 0.9; starColors[i + 1] = 0.9; starColors[i + 2] = 0.95;
      }
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    const starMat = new THREE.PointsMaterial({ size: 0.8, vertexColors: true, transparent: true, opacity: 0.85 });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 6. Master Celestial Group
    const celestialGroup = new THREE.Group();
    scene.add(celestialGroup);
    celestialGroupRef.current = celestialGroup;

    // Center Prithvi (Earth / Observer)
    const earthGeo = new THREE.SphereGeometry(1.3, 32, 32);
    const earthMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      roughness: 0.6,
      metalness: 0.2,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.35
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    celestialGroup.add(earthMesh);

    // Atmosphere halo
    const atmosphereGeo = new THREE.SphereGeometry(1.55, 32, 32);
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.22,
      wireframe: true
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    celestialGroup.add(atmosphereMesh);

    // Outer 360° Ecliptic Golden Bhachakra Ring (Radius 12.5)
    const ringGeo = new THREE.RingGeometry(12.2, 12.6, 128);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    celestialGroup.add(ringMesh);

    // 12 Zodiac Arcs and Boundaries
    const zodiacRadius = 12.4;
    for (let i = 0; i < 12; i++) {
      const startAngle = (i * 30 * Math.PI) / 180;
      const midAngle = startAngle + (15 * Math.PI) / 180;

      const linePoints = [
        new THREE.Vector3(Math.cos(startAngle) * 4.5, 0, Math.sin(startAngle) * 4.5),
        new THREE.Vector3(Math.cos(startAngle) * zodiacRadius, 0, Math.sin(startAngle) * zodiacRadius)
      ];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
      const lineMat = new THREE.LineBasicMaterial({ color: 0x475569, transparent: true, opacity: 0.45 });
      const line = new THREE.Line(lineGeo, lineMat);
      celestialGroup.add(line);

      const meta = ZODIAC_METADATA[i];
      const glyphX = Math.cos(midAngle) * (zodiacRadius + 1.25);
      const glyphZ = Math.sin(midAngle) * (zodiacRadius + 1.25);
      const labelText = language === 'or' ? meta.or : (language === 'hi' ? meta.hi : meta.en);
      const glyphSprite = createTextSprite(
        `${meta.glyph} ${labelText}`,
        `${i * 30}° - ${(i + 1) * 30}°`,
        meta.color
      );
      glyphSprite.position.set(glyphX, 0.35, glyphZ);
      glyphSprite.scale.set(2.0, 0.7, 1);
      celestialGroup.add(glyphSprite);
    }

    // 7. Ascendant (Lagna) Horizon Ray
    const ascRad = (ascendantDegree * Math.PI) / 180;
    const lagnaPoints = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(Math.cos(ascRad) * (zodiacRadius + 2.5), 0, Math.sin(ascRad) * (zodiacRadius + 2.5))
    ];
    const lagnaGeo = new THREE.BufferGeometry().setFromPoints(lagnaPoints);
    const lagnaMat = new THREE.LineBasicMaterial({ color: 0xf59e0b });
    const lagnaLine = new THREE.Line(lagnaGeo, lagnaMat);
    celestialGroup.add(lagnaLine);

    const lagnaSprite = createTextSprite('🚩 ଲଗ୍ନ (ASC)', `${formatNumber(ascendantDegree.toFixed(2))}°`, '#fbbf24');
    lagnaSprite.position.set(
      Math.cos(ascRad) * (zodiacRadius + 2.6),
      0.5,
      Math.sin(ascRad) * (zodiacRadius + 2.6)
    );
    lagnaSprite.scale.set(2.4, 0.8, 1);
    celestialGroup.add(lagnaSprite);

    // 8. 9 Navagraha Spheres
    const planetMeshes = new Map<PlanetName, THREE.Mesh>();

    if (planetsRecord) {
      const signGroups: Record<number, PlanetName[]> = {};
      Object.entries(planetsRecord).forEach(([pName, pPos]) => {
        const sIdx = pPos.signIndex;
        if (!signGroups[sIdx]) signGroups[sIdx] = [];
        signGroups[sIdx].push(pName as PlanetName);
      });

      Object.entries(planetsRecord).forEach(([pName, pPos]) => {
        const spec = PLANET_SPECS[pName as PlanetName] || PLANET_SPECS.Surya;
        const signGroup = signGroups[pPos.signIndex] || [];
        const indexInSign = signGroup.indexOf(pName as PlanetName);

        const orbitRadius = spec.baseRadius + (indexInSign * 0.7);
        const rad = (pPos.longitude * Math.PI) / 180;
        const x = Math.cos(rad) * orbitRadius;
        const z = Math.sin(rad) * orbitRadius;
        const y = 0.08 * Math.sin(rad * 3);

        const orbitRingGeo = new THREE.RingGeometry(orbitRadius - 0.03, orbitRadius + 0.03, 96);
        const orbitRingMat = new THREE.MeshBasicMaterial({
          color: spec.color,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.16
        });
        const orbitRing = new THREE.Mesh(orbitRingGeo, orbitRingMat);
        orbitRing.rotation.x = Math.PI / 2;
        celestialGroup.add(orbitRing);

        const planetGeo = new THREE.SphereGeometry(spec.size, 32, 32);
        const planetTex = createPlanetTexture(pName as PlanetName);
        const planetMat = new THREE.MeshStandardMaterial({
          map: planetTex,
          roughness: 0.4,
          metalness: 0.3,
          emissive: spec.color,
          emissiveIntensity: pName === 'Surya' ? 0.75 : 0.15
        });

        const mesh = new THREE.Mesh(planetGeo, planetMat);
        mesh.position.set(x, y, z);
        mesh.userData = { planetName: pName, planetData: pPos };
        celestialGroup.add(mesh);
        planetMeshes.set(pName as PlanetName, mesh);

        const rayPts = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, y, z)];
        const rayGeo = new THREE.BufferGeometry().setFromPoints(rayPts);
        const rayMat = new THREE.LineBasicMaterial({ color: spec.color, transparent: true, opacity: 0.32 });
        const rayLine = new THREE.Line(rayGeo, rayMat);
        celestialGroup.add(rayLine);

        if (pName === 'Shani') {
          const sRingGeo = new THREE.RingGeometry(spec.size * 1.4, spec.size * 2.4, 64);
          const sRingTex = createRingTexture();
          const sRingMat = new THREE.MeshBasicMaterial({
            map: sRingTex,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.95
          });
          const sRingMesh = new THREE.Mesh(sRingGeo, sRingMat);
          sRingMesh.rotation.x = (Math.PI / 180) * 65;
          mesh.add(sRingMesh);
        }

        const retroStr = pPos.isRetrograde ? ' (Ⓡ)' : '';
        const combustStr = pPos.isCombust ? ' (🔥)' : '';
        const displayName = language === 'or' ? spec.or : (language === 'hi' ? spec.hi : pName);
        const labelSprite = createTextSprite(
          `${spec.symbol} ${displayName}${retroStr}${combustStr}`,
          `${formatNumber(pPos.degreeInSign.toFixed(1))}° (${tRashi(pPos.sign)})`,
          spec.glowColor
        );
        labelSprite.position.set(x, y + spec.size + 0.85, z);
        celestialGroup.add(labelSprite);
      });
    }

    planetMeshesRef.current = planetMeshes;

    // 9. Interactive Drag to Rotate & Touch Handling
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !celestialGroupRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      celestialGroupRef.current.rotation.y += deltaX * 0.007;
      celestialGroupRef.current.rotation.x += deltaY * 0.004;
      celestialGroupRef.current.rotation.x = Math.max(-0.6, Math.min(1.2, celestialGroupRef.current.rotation.x));

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      const zoomFactor = e.deltaY * 0.02;
      const currentDist = cameraRef.current.position.length();
      const newDist = Math.max(8, Math.min(45, currentDist + zoomFactor));
      cameraRef.current.position.setLength(newDist);
    };

    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const handleClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVector.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseVector, camera);
      const meshesArray = Array.from(planetMeshes.values());
      const intersects = raycaster.intersectObjects(meshesArray, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const pName = hit.userData.planetName as PlanetName;
        if (pName) {
          setSelectedPlanet(prev => prev === pName ? null : pName);
        }
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    domElement.addEventListener('wheel', handleWheel, { passive: false });
    domElement.addEventListener('click', handleClick);

    // 10. Animation Loop
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (isRotatingRef.current && !isDraggingRef.current && celestialGroupRef.current) {
        celestialGroupRef.current.rotation.y += delta * 0.08;
      }

      atmosphereMesh.rotation.y += delta * 0.2;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = Math.max(container.clientHeight || 580, 580);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domElement.removeEventListener('wheel', handleWheel);
      domElement.removeEventListener('click', handleClick);
      renderer.dispose();
      starGeo.dispose();
      starMat.dispose();
      earthGeo.dispose();
      earthMat.dispose();
    };
  }, [planetsRecord, ascendantDegree, language]);

  const selectedData = selectedPlanet && planetsRecord ? planetsRecord[selectedPlanet] : null;
  const selectedSpec = selectedPlanet ? PLANET_SPECS[selectedPlanet] : null;

  return (
    <div className="relative w-full h-[580px] sm:h-[620px] bg-gradient-to-b from-[#060913] via-[#090d1c] to-[#04060c] border-2 border-cosmic-gold/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between select-none">
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Floating Glass HUD Bar: Uncrowded & Spacious */}
      <div className="relative z-10 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Title & Varga Badge */}
        <div className="flex items-center gap-2 bg-cosmic-950/90 backdrop-blur-md border border-cosmic-gold/40 px-3.5 py-1.5 rounded-2xl shadow-xl pointer-events-auto">
          <Sparkles className="w-4 h-4 text-cosmic-saffron animate-spin-slow" />
          <span className="text-xs font-bold text-slate-100 font-serif tracking-wide">
            {language === 'or' ? '୩D ଭାଚକ୍ର ଗୋଳକ' : language === 'hi' ? '3D खगोल चक्र' : '3D Celestial Orbit'}
          </span>
          <span className="text-[10px] font-bold text-cosmic-gold bg-cosmic-gold/15 px-2 py-0.5 rounded-full border border-cosmic-gold/30">
            {vargaCode}
          </span>
        </div>

        {/* Center: 9 Navagraha Quick Access Bar */}
        <div className="hidden md:flex items-center gap-1 bg-cosmic-950/90 backdrop-blur-md border border-slate-800 p-1 rounded-2xl shadow-xl pointer-events-auto">
          {(['Surya', 'Chandra', 'Mangala', 'Budha', 'Guru', 'Shukra', 'Shani', 'Rahu', 'Ketu'] as PlanetName[]).map(p => {
            const spec = PLANET_SPECS[p];
            const isSel = selectedPlanet === p;
            return (
              <button
                key={p}
                onClick={() => setSelectedPlanet(prev => prev === p ? null : p)}
                className={`px-2 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  isSel
                    ? 'bg-cosmic-gold text-cosmic-950 shadow-md ring-1 ring-yellow-300'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
                title={`${spec.symbol} ${language === 'or' ? spec.or : (language === 'hi' ? spec.hi : p)}`}
              >
                <span>{spec.symbol}</span>
                <span className="text-[10px]">{language === 'or' ? spec.or.substring(0, 2) : (language === 'hi' ? spec.hi.substring(0, 2) : p.substring(0, 2))}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Camera Presets & Controls */}
        <div className="flex items-center gap-1 bg-cosmic-950/90 backdrop-blur-md border border-slate-800 p-1 rounded-2xl shadow-xl pointer-events-auto">
          <button
            onClick={() => switchCameraView('perspective')}
            className={`px-2.5 py-1 text-xs rounded-xl font-bold transition-all ${
              cameraView === 'perspective' ? 'bg-cosmic-gold text-cosmic-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="3D Angled Perspective View"
          >
            3D Orbit
          </button>
          <button
            onClick={() => switchCameraView('topdown')}
            className={`px-2.5 py-1 text-xs rounded-xl font-bold transition-all ${
              cameraView === 'topdown' ? 'bg-cosmic-gold text-cosmic-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Top-down 2D/3D Projection"
          >
            Top-Down
          </button>
          <button
            onClick={() => switchCameraView('lagna')}
            className={`px-2.5 py-1 text-xs rounded-xl font-bold transition-all ${
              cameraView === 'lagna' ? 'bg-cosmic-gold text-cosmic-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Face the Rising Ascendant Sign"
          >
            Lagna View
          </button>

          <div className="w-[1px] h-4 bg-slate-800 mx-0.5" />

          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`p-1.5 rounded-xl transition-all cursor-pointer ${
              isRotating ? 'bg-cosmic-saffron text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
            title={isRotating ? 'Pause Orbit' : 'Play Orbit'}
          >
            {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => switchCameraView('perspective')}
            className="p-1.5 text-slate-400 hover:text-cosmic-gold transition-all cursor-pointer"
            title="Reset Camera Orientation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Center Guidance Hint (Only when no planet is selected) */}
      {!selectedPlanet && (
        <div className="pointer-events-none self-center bg-cosmic-950/70 backdrop-blur-md border border-slate-800/80 px-4 py-1.5 rounded-full text-xs text-slate-300 shadow-lg flex items-center gap-2 animate-pulse">
          <Compass className="w-3.5 h-3.5 text-cosmic-gold" />
          <span>{language === 'or' ? 'ମହାକାଶ ଘୂରାନ୍ତୁ କିମ୍ବା ଯେକୌଣସି ଗ୍ରହ ଉପରେ କ୍ଲିକ୍ କରନ୍ତୁ' : language === 'hi' ? 'खगोल घुमाएं अथवा किसी भी ग्रह पर क्लिक करें' : 'Drag to rotate orbit or tap any Graha to view astrometry'}</span>
        </div>
      )}

      {/* Bottom Floating Telemetry Card for Selected Planet (Cleanly docked with Close Button) */}
      {selectedData && selectedSpec && (
        <div className="relative z-20 m-3 sm:m-4 p-4 bg-cosmic-950/95 backdrop-blur-2xl border-2 border-cosmic-gold/50 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.85)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pointer-events-auto transition-all animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg border border-white/20 shrink-0"
              style={{ backgroundColor: selectedSpec.glowColor + '33', color: selectedSpec.glowColor }}
            >
              {selectedSpec.symbol}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-slate-100 font-serif">
                  {language === 'or' ? selectedSpec.or : (language === 'hi' ? selectedSpec.hi : selectedPlanet)}
                </h4>
                <span className="text-xs text-cosmic-gold font-bold">
                  ({selectedPlanet})
                </span>
                {selectedData.isRetrograde && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full">
                    Ⓡ Vakri
                  </span>
                )}
                {selectedData.isCombust && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/40 rounded-full flex items-center gap-1">
                    <Flame className="w-3 h-3 text-red-400" /> Asta
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {t('house_col')}: <strong className="text-slate-200">H{formatNumber(selectedData.house)}</strong> • {tRashi(selectedData.sign)} ({formatNumber(selectedData.deg)}° {formatNumber(selectedData.min)}' {formatNumber(selectedData.sec)}")
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="bg-cosmic-900/90 border border-slate-800 px-3 py-1.5 rounded-xl">
              <span className="text-slate-400 text-[10px] uppercase block">{t('nakshatra_col')}</span>
              <span className="font-bold text-cosmic-gold">{selectedData.nakshatra} (P{formatNumber(selectedData.pada)})</span>
            </div>

            <div className="bg-cosmic-900/90 border border-slate-800 px-3 py-1.5 rounded-xl">
              <span className="text-slate-400 text-[10px] uppercase block">{t('dignity_col')}</span>
              <span className={`font-bold ${
                selectedData.dignity === 'Exalted' ? 'text-emerald-400' :
                selectedData.dignity === 'Moolatrikona' || selectedData.dignity === 'Own' ? 'text-blue-400' :
                selectedData.dignity === 'Debilitated' ? 'text-red-400' : 'text-slate-300'
              }`}>
                {selectedData.dignity}
              </span>
            </div>

            <div className="bg-cosmic-900/90 border border-slate-800 px-3 py-1.5 rounded-xl">
              <span className="text-slate-400 text-[10px] uppercase block">Navamsha (D9)</span>
              <span className="font-bold text-indigo-300">{tRashi(selectedData.navamshaSign)}</span>
            </div>

            {/* Explicit Close Button */}
            <button
              onClick={() => setSelectedPlanet(null)}
              className="p-2 ml-1 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer border border-slate-700 shadow-md"
              title="Close Telemetry Card"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom Sub-Bar Telemetry & Footer Instructions */}
      <div className="relative z-10 px-4 pb-2.5 text-[10px] text-slate-400 flex items-center justify-between pointer-events-none">
        <span className="flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-cosmic-gold" />
          <span>🖱️ Click & Drag to Orbit • Scroll / Pinch to Zoom</span>
        </span>
        <span className="text-cosmic-gold font-mono">
          Ecliptic Obliquity: 23°26' • Sidereal Lahiri Ayanamsha
        </span>
      </div>
    </div>
  );
};
