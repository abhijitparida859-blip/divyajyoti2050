// ============================================================================
//  MOON ORB 3D — Advanced Photorealistic Lunar Observatory
//  - True astronomical disk illumination fraction & Paksha-aware sunlight
//  - High-resolution procedural lunar topography (Maria, Tycho rays, relief bump)
//  - Ethereal celestial limb corona (Fresnel shader) & authentic Earthshine
//  - Tidal locking with natural libration & interactive 3D drag-to-inspect
// ============================================================================
import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { useI18n } from '../../localization/i18n';
import { DayPanjika } from '../../types/panjika';
import { MoonStar, RotateCcw, Eye, Sparkles } from 'lucide-react';

interface Props { panjika: DayPanjika; }

/**
 * Generates an authentic high-resolution lunar texture (1024x512)
 * Features true lunar near-side topography:
 * Oceanus Procellarum, Mare Imbrium, Mare Serenitatis, Mare Tranquillitatis,
 * Mare Crisium, Tycho with radiating ray system, Copernicus, and crater relief.
 */
const makeRealisticMoonTextures = (): { albedo: THREE.CanvasTexture; bump: THREE.CanvasTexture } => {
  const W = 1024;
  const H = 512;

  // 1. Albedo / Color Canvas
  const cA = document.createElement('canvas');
  cA.width = W;
  cA.height = H;
  const ctxA = cA.getContext('2d')!;

  // 2. Bump / Relief Canvas
  const cB = document.createElement('canvas');
  cB.width = W;
  cB.height = H;
  const ctxB = cB.getContext('2d')!;

  // --- Base Regolith Soil ---
  ctxA.fillStyle = '#b6b9c4';
  ctxA.fillRect(0, 0, W, H);

  ctxB.fillStyle = '#7a7e8c';
  ctxB.fillRect(0, 0, W, H);

  // Subtle lunar terrae noise
  const imgDataA = ctxA.getImageData(0, 0, W, H);
  const dataA = imgDataA.data;
  const imgDataB = ctxB.getImageData(0, 0, W, H);
  const dataB = imgDataB.data;

  // Fast procedural noise
  for (let i = 0; i < dataA.length; i += 4) {
    const n = (Math.random() - 0.5) * 16;
    dataA[i] = Math.min(255, Math.max(0, dataA[i] + n));
    dataA[i + 1] = Math.min(255, Math.max(0, dataA[i + 1] + n));
    dataA[i + 2] = Math.min(255, Math.max(0, dataA[i + 2] + n));

    dataB[i] = Math.min(255, Math.max(0, dataB[i] + n * 1.5));
    dataB[i + 1] = Math.min(255, Math.max(0, dataB[i + 1] + n * 1.5));
    dataB[i + 2] = Math.min(255, Math.max(0, dataB[i + 2] + n * 1.5));
  }
  ctxA.putImageData(imgDataA, 0, 0);
  ctxB.putImageData(imgDataB, 0, 0);

  // Helper for painting authentic lunar Maria (dark basaltic volcanic plains)
  const drawMare = (cx: number, cy: number, rx: number, ry: number, rot: number, darkness: number) => {
    ctxA.save();
    ctxA.translate(cx, cy);
    ctxA.rotate(rot);
    const gradA = ctxA.createRadialGradient(0, 0, rx * 0.1, 0, 0, rx);
    gradA.addColorStop(0, `rgba(45, 48, 60, ${darkness})`);
    gradA.addColorStop(0.5, `rgba(58, 62, 75, ${darkness * 0.85})`);
    gradA.addColorStop(0.85, `rgba(82, 86, 100, ${darkness * 0.4})`);
    gradA.addColorStop(1, 'rgba(182, 185, 196, 0)');
    ctxA.fillStyle = gradA;
    ctxA.beginPath();
    ctxA.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctxA.fill();
    ctxA.restore();

    // Bump canvas: Maria are depressed lowlands
    ctxB.save();
    ctxB.translate(cx, cy);
    ctxB.rotate(rot);
    const gradB = ctxB.createRadialGradient(0, 0, rx * 0.1, 0, 0, rx);
    gradB.addColorStop(0, `rgba(30, 30, 30, ${darkness * 0.7})`);
    gradB.addColorStop(0.8, `rgba(60, 60, 60, ${darkness * 0.3})`);
    gradB.addColorStop(1, 'rgba(122, 126, 140, 0)');
    ctxB.fillStyle = gradB;
    ctxB.beginPath();
    ctxB.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctxB.fill();
    ctxB.restore();
  };

  // --- Authentic Lunar Maria (Near Side centered at X ≈ 512, Y ≈ 256) ---
  // 1. Oceanus Procellarum (Vast western plain)
  drawMare(W * 0.36, H * 0.44, W * 0.14, H * 0.22, -0.15, 0.68);
  drawMare(W * 0.32, H * 0.35, W * 0.09, H * 0.14, 0.25, 0.62);

  // 2. Mare Imbrium (Sea of Rains - prominent circular plain)
  drawMare(W * 0.43, H * 0.32, W * 0.085, H * 0.13, 0.05, 0.72);

  // 3. Mare Serenitatis (Sea of Serenity)
  drawMare(W * 0.54, H * 0.34, W * 0.058, H * 0.095, -0.1, 0.70);

  // 4. Mare Tranquillitatis (Sea of Tranquility)
  drawMare(W * 0.59, H * 0.46, W * 0.065, H * 0.09, 0.2, 0.68);

  // 5. Mare Crisium (Distinct isolated circular sea in east)
  drawMare(W * 0.70, H * 0.38, W * 0.042, H * 0.062, 0.1, 0.78);

  // 6. Mare Fecunditatis & Nectaris (Southeast)
  drawMare(W * 0.63, H * 0.58, W * 0.055, H * 0.09, -0.2, 0.64);
  drawMare(W * 0.56, H * 0.60, W * 0.04, H * 0.065, 0.15, 0.66);

  // 7. Mare Nubium & Humorum (Southwest)
  drawMare(W * 0.44, H * 0.62, W * 0.06, H * 0.095, 0.1, 0.65);
  drawMare(W * 0.35, H * 0.58, W * 0.038, H * 0.058, -0.3, 0.64);

  // Helper for drawing realistic craters with shaded rims and central peaks
  const drawCrater = (x: number, y: number, r: number, depth: number = 0.5) => {
    // Crater floor (shadowed)
    ctxA.fillStyle = `rgba(50, 54, 65, ${0.25 + depth * 0.4})`;
    ctxA.beginPath();
    ctxA.arc(x, y, r, 0, Math.PI * 2);
    ctxA.fill();

    // Bright illuminated rim (sunward side)
    ctxA.strokeStyle = `rgba(240, 244, 255, ${0.35 + depth * 0.45})`;
    ctxA.lineWidth = Math.max(1, r * 0.22);
    ctxA.beginPath();
    ctxA.arc(x, y, r * 0.95, -Math.PI * 0.7, Math.PI * 0.3);
    ctxA.stroke();

    // Bump relief
    ctxB.fillStyle = `rgba(20, 20, 20, ${0.4 + depth * 0.4})`;
    ctxB.beginPath();
    ctxB.arc(x, y, r * 0.8, 0, Math.PI * 2);
    ctxB.fill();

    ctxB.strokeStyle = `rgba(255, 255, 255, ${0.45 + depth * 0.45})`;
    ctxB.lineWidth = Math.max(1, r * 0.25);
    ctxB.beginPath();
    ctxB.arc(x, y, r, 0, Math.PI * 2);
    ctxB.stroke();
  };

  // --- Hundreds of Multi-scale Impact Craters across Terrae Highlands ---
  for (let i = 0; i < 220; i++) {
    const x = Math.random() * W;
    const y = Math.random() * H;
    const r = 1.2 + Math.random() * 4.8;
    drawCrater(x, y, r, 0.3 + Math.random() * 0.5);
  }

  // --- Prominent Major Craters with Ray Systems ---
  // 1. Tycho Crater (Southern Highlands) with glorious radiating rays
  const tychoX = W * 0.48;
  const tychoY = H * 0.74;
  const numRays = 22;
  ctxA.save();
  for (let i = 0; i < numRays; i++) {
    const angle = (i / numRays) * Math.PI * 2 + (Math.random() - 0.5) * 0.2;
    const length = 90 + Math.random() * 160;
    const grad = ctxA.createLinearGradient(tychoX, tychoY, tychoX + Math.cos(angle) * length, tychoY + Math.sin(angle) * length);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.65)');
    grad.addColorStop(0.35, 'rgba(235, 240, 255, 0.28)');
    grad.addColorStop(1, 'rgba(200, 210, 230, 0)');
    ctxA.strokeStyle = grad;
    ctxA.lineWidth = 1.2 + Math.random() * 2.2;
    ctxA.beginPath();
    ctxA.moveTo(tychoX, tychoY);
    ctxA.lineTo(tychoX + Math.cos(angle) * length, tychoY + Math.sin(angle) * length);
    ctxA.stroke();
  }
  ctxA.restore();
  drawCrater(tychoX, tychoY, 7.5, 0.95);
  // Brilliant white Tycho core
  ctxA.fillStyle = '#ffffff';
  ctxA.beginPath();
  ctxA.arc(tychoX, tychoY, 3, 0, Math.PI * 2);
  ctxA.fill();

  // 2. Copernicus Crater (In Mare Insularum/Imbrium)
  const copernicusX = W * 0.40;
  const copernicusY = H * 0.44;
  ctxA.save();
  for (let i = 0; i < 14; i++) {
    const angle = (i / 14) * Math.PI * 2;
    const len = 40 + Math.random() * 60;
    const grad = ctxA.createLinearGradient(copernicusX, copernicusY, copernicusX + Math.cos(angle) * len, copernicusY + Math.sin(angle) * len);
    grad.addColorStop(0, 'rgba(250, 252, 255, 0.45)');
    grad.addColorStop(1, 'rgba(220, 225, 240, 0)');
    ctxA.strokeStyle = grad;
    ctxA.lineWidth = 1.5;
    ctxA.beginPath();
    ctxA.moveTo(copernicusX, copernicusY);
    ctxA.lineTo(copernicusX + Math.cos(angle) * len, copernicusY + Math.sin(angle) * len);
    ctxA.stroke();
  }
  ctxA.restore();
  drawCrater(copernicusX, copernicusY, 6.5, 0.85);

  // 3. Kepler Crater
  drawCrater(W * 0.33, H * 0.43, 4.2, 0.75);

  // 4. Aristarchus (Brightest plateau on the Moon)
  const aristarchusX = W * 0.31;
  const aristarchusY = H * 0.36;
  ctxA.fillStyle = '#ffffff';
  ctxA.beginPath();
  ctxA.arc(aristarchusX, aristarchusY, 3.2, 0, Math.PI * 2);
  ctxA.fill();
  drawCrater(aristarchusX, aristarchusY, 4.5, 0.7);

  // 5. Plato Crater (Dark-floored circular crater north of Imbrium)
  drawCrater(W * 0.45, H * 0.22, 5.2, 0.8);
  ctxA.fillStyle = 'rgba(40, 42, 52, 0.75)';
  ctxA.beginPath();
  ctxA.arc(W * 0.45, H * 0.22, 3.8, 0, Math.PI * 2);
  ctxA.fill();

  // Create Three.js textures
  const albedo = new THREE.CanvasTexture(cA);
  albedo.colorSpace = THREE.SRGBColorSpace;
  albedo.wrapS = THREE.RepeatWrapping;
  albedo.wrapT = THREE.ClampToEdgeWrapping;

  const bump = new THREE.CanvasTexture(cB);
  bump.wrapS = THREE.RepeatWrapping;
  bump.wrapT = THREE.ClampToEdgeWrapping;

  return { albedo, bump };
};

/**
 * Returns authentic Sanskrit/Odia/Hindi lunar phase nomenclature
 */
function getPhaseNomenclature(illum: number, paksha: 'Shukla' | 'Krishna', tithiNumber: number, L: (orStr: string, hiStr: string, enStr: string) => string): string {
  if (tithiNumber === 15) {
    return L('ପୂର୍ଣ୍ଣିମା (ପୂର୍ଣ୍ଣଚନ୍ଦ୍ର)', 'पूर्णिमा (पूर्ण चंद्र)', 'Full Moon');
  }
  if (tithiNumber === 30 || illum < 0.015) {
    return L('ଅମାବାସ୍ୟା (ନବଚନ୍ଦ୍ର)', 'अमावस्या (नव चंद्र)', 'New Moon');
  }

  if (paksha === 'Shukla') {
    if (illum < 0.25) return L('ଶୁକ୍ଳ ବାଳଚନ୍ଦ୍ର', 'शुक्ल बालचंद्र', 'Waxing Crescent');
    if (illum < 0.65) return L('ଶୁକ୍ଳ ଅର୍ଦ୍ଧଚନ୍ଦ୍ର', 'शुक्ल अर्धचंद्र', 'First Quarter');
    return L('ଶୁକ୍ଳ କୁବ୍ଜ ଚନ୍ଦ୍ର', 'शुक्ल कुब्ज चंद्र', 'Waxing Gibbous');
  } else {
    if (illum > 0.65) return L('କୃଷ୍ଣ କୁବ୍ଜ ଚନ୍ଦ୍ର', 'कृष्ण कुब्ज चंद्र', 'Waning Gibbous');
    if (illum > 0.25) return L('କୃଷ୍ଣ ଅର୍ଦ୍ଧଚନ୍ଦ୍ର', 'कृष्ण अर्धचंद्र', 'Last Quarter');
    return L('କୃଷ୍ଣ କ୍ଷୀଣ ଚନ୍ଦ୍ର', 'कृष्ण क्षीण चंद्र', 'Waning Crescent');
  }
}

export const MoonOrb3D: React.FC<Props> = ({ panjika }) => {
  const { language, formatNumber, formatTime } = useI18n();
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const [isUserDragging, setIsUserDragging] = useState(false);
  const [userHasRotated, setUserHasRotated] = useState(false);

  // Exact astronomical illumination fraction (0.0 to 1.0)
  const illum = Math.min(1, Math.max(0, panjika.moonPhase));
  const isShukla = panjika.tithi.paksha === 'Shukla';

  // State refs for smooth drag & libration
  const rotRef = useRef<{ x: number; y: number; vx: number; vy: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    targetX: 0,
    targetY: 0,
  });

  const resetRotation = () => {
    rotRef.current.targetX = 0;
    rotRef.current.targetY = 0;
    setUserHasRotated(false);
  };

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let raf = 0;
    let ro: ResizeObserver | null = null;
    let sphere: THREE.Mesh | null = null;
    let glowMesh: THREE.Mesh | null = null;
    let starField: THREE.Points | null = null;
    let orbitRing: THREE.LineLoop | null = null;
    let textures: { albedo: THREE.CanvasTexture; bump: THREE.CanvasTexture } | null = null;

    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;

      const w0 = host.clientWidth || 280;
      const h0 = host.clientHeight || 180;
      renderer.setSize(w0, h0, false);
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.display = 'block';
      renderer.domElement.style.cursor = 'grab';
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, w0 / h0, 0.1, 50);
      camera.position.set(0, 0, 3.75);

      // 1. Generate Authentic High-Res Lunar Topography
      textures = makeRealisticMoonTextures();
      const geo = new THREE.SphereGeometry(1, 96, 96);
      const mat = new THREE.MeshStandardMaterial({
        map: textures.albedo,
        bumpMap: textures.bump,
        bumpScale: 0.032,
        roughness: 0.88,
        metalness: 0.03,
      });
      sphere = new THREE.Mesh(geo, mat);
      scene.add(sphere);

      // 2. Celestial Ethereal Limb Corona (Limb Glow Shell)
      const glowGeo = new THREE.SphereGeometry(1.022, 48, 48);
      const glowMat = new THREE.ShaderMaterial({
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vViewPosition;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
            vViewPosition = -mvPos.xyz;
            gl_Position = projectionMatrix * mvPos;
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vViewPosition;
          void main() {
            float intensity = pow(0.68 - dot(vNormal, normalize(vViewPosition)), 3.2);
            gl_FragColor = vec4(0.55, 0.65, 0.95, intensity * 0.72);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      });
      glowMesh = new THREE.Mesh(glowGeo, glowMat);
      scene.add(glowMesh);

      // 3. True Astronomical Sun & Earthshine Lighting
      // Convert true illumination to elongation angle: illum = (1 - cos(theta)) / 2  => theta = acos(1 - 2 * illum)
      const phaseAngle = Math.acos(Math.min(1, Math.max(-1, 1 - 2 * illum)));

      // In Shukla Paksha (waxing), light comes from the RIGHT (+X); in Krishna Paksha (waning), light comes from LEFT (-X)
      const sunX = (isShukla ? 1 : -1) * Math.sin(phaseAngle) * 5.5;
      const sunZ = -Math.cos(phaseAngle) * 5.5;
      const sunY = 0.45 * Math.sin(phaseAngle * 0.5);

      const sunlight = new THREE.DirectionalLight(0xfff6eb, 3.85);
      sunlight.position.set(sunX, sunY, sunZ);
      scene.add(sunlight);

      // Soft Earthshine on the lunar night side (revealing the dark maria)
      const earthshine = new THREE.DirectionalLight(0x384d7a, 0.48);
      earthshine.position.set((isShukla ? -1 : 1) * 1.5, -0.3, 3.2);
      scene.add(earthshine);

      // Deep space cosmic ambient fill
      scene.add(new THREE.HemisphereLight(0x9cb4e8, 0x090d1f, 0.32));

      // 4. Twinkling Deep-Space Starfield
      const numStars = 220;
      const starPositions = new Float32Array(numStars * 3);
      for (let i = 0; i < numStars * 3; i += 3) {
        const phi = Math.random() * Math.PI * 2;
        const rad = 1.6 + Math.random() * 2.8;
        starPositions[i] = Math.cos(phi) * rad;
        starPositions[i + 1] = Math.sin(phi) * rad * 0.62;
        starPositions[i + 2] = -0.9 - Math.random() * 1.8;
      }
      const starGeo = new THREE.BufferGeometry();
      starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
      starField = new THREE.Points(
        starGeo,
        new THREE.PointsMaterial({
          color: 0xc4d4ff,
          size: 0.024,
          transparent: true,
          opacity: 0.85,
          sizeAttenuation: true,
        })
      );
      scene.add(starField);

      // 5. Subtle Ecliptic Lunar Orbit Arc Guide
      const orbitCurve = new THREE.EllipseCurve(0, 0, 1.45, 0.55, 0, 2 * Math.PI, false, 0);
      const orbitPoints = orbitCurve.getPoints(64);
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints.map(p => new THREE.Vector3(p.x, p.y, -0.35)));
      orbitRing = new THREE.LineLoop(
        orbitGeo,
        new THREE.LineBasicMaterial({ color: 0x818cf8, transparent: true, opacity: 0.15 })
      );
      orbitRing.rotation.x = THREE.MathUtils.degToRad(68);
      orbitRing.rotation.z = THREE.MathUtils.degToRad(-15);
      scene.add(orbitRing);

      // 6. Interactive Drag Controls (Mouse & Touch)
      let isDragging = false;
      let prevMouseX = 0;
      let prevMouseY = 0;
      let idleTimer = 0;

      const onPointerDown = (e: PointerEvent) => {
        isDragging = true;
        setIsUserDragging(true);
        setUserHasRotated(true);
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
        if (renderer?.domElement) renderer.domElement.style.cursor = 'grabbing';
      };

      const onPointerMove = (e: PointerEvent) => {
        if (!isDragging) return;
        const dx = e.clientX - prevMouseX;
        const dy = e.clientY - prevMouseY;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;

        rotRef.current.targetY += dx * 0.009;
        rotRef.current.targetX += dy * 0.009;
        rotRef.current.targetX = Math.max(-Math.PI * 0.45, Math.min(Math.PI * 0.45, rotRef.current.targetX));
        idleTimer = 0;
      };

      const onPointerUp = () => {
        isDragging = false;
        setIsUserDragging(false);
        if (renderer?.domElement) renderer.domElement.style.cursor = 'grab';
      };

      const onDblClick = () => {
        resetRotation();
      };

      const dom = renderer.domElement;
      dom.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      dom.addEventListener('dblclick', onDblClick);

      // 7. Render Loop with Natural Tidal Libration
      const clock = new THREE.Clock();
      const render = () => {
        raf = requestAnimationFrame(render);
        const delta = clock.getDelta();
        const elapsed = clock.getElapsedTime();

        // If user is idle after rotating, gently glide back to canonical Earth-facing orientation after 4s
        if (!isDragging && userHasRotated) {
          idleTimer += delta;
          if (idleTimer > 4.5) {
            rotRef.current.targetX *= 0.96;
            rotRef.current.targetY *= 0.96;
            if (Math.abs(rotRef.current.targetX) < 0.005 && Math.abs(rotRef.current.targetY) < 0.005) {
              rotRef.current.targetX = 0;
              rotRef.current.targetY = 0;
              setUserHasRotated(false);
            }
          }
        }

        // Smooth damping
        rotRef.current.x += (rotRef.current.targetX - rotRef.current.x) * 0.1;
        rotRef.current.y += (rotRef.current.targetY - rotRef.current.y) * 0.1;

        if (sphere) {
          // Natural orbital libration: gentle slow oscillation of ~1.5 degrees
          const librationPitch = Math.sin(elapsed * 0.38) * 0.026;
          const librationYaw = Math.cos(elapsed * 0.28) * 0.032;

          sphere.rotation.x = rotRef.current.x + librationPitch;
          sphere.rotation.y = rotRef.current.y + librationYaw;

          if (glowMesh) {
            glowMesh.rotation.x = sphere.rotation.x;
            glowMesh.rotation.y = sphere.rotation.y;
          }
        }

        // Starfield subtle cosmic twinkle
        if (starField) {
          (starField.material as THREE.PointsMaterial).opacity = 0.72 + Math.sin(elapsed * 1.8) * 0.16;
        }

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

      return () => {
        cancelAnimationFrame(raf);
        dom.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        dom.removeEventListener('dblclick', onDblClick);
        if (ro) ro.disconnect();
        if (sphere) {
          sphere.geometry.dispose();
          (sphere.material as THREE.Material).dispose();
        }
        if (glowMesh) {
          glowMesh.geometry.dispose();
          (glowMesh.material as THREE.Material).dispose();
        }
        if (starField) {
          starField.geometry.dispose();
          (starField.material as THREE.Material).dispose();
        }
        if (orbitRing) {
          orbitRing.geometry.dispose();
          (orbitRing.material as THREE.Material).dispose();
        }
        if (textures) {
          textures.albedo.dispose();
          textures.bump.dispose();
        }
        if (renderer) {
          renderer.dispose();
          if (renderer.domElement.parentElement) renderer.domElement.parentElement.removeChild(renderer.domElement);
        }
      };
    } catch {
      setFailed(true);
    }
  }, [illum, isShukla]);

  const L = (orStr: string, hiStr: string, enStr: string) => (language === 'or' ? orStr : language === 'hi' ? hiStr : enStr);

  // Exact true percentage values
  const illumPct = Math.round(illum * 100);
  const tithiElapsedPct = Math.max(0, Math.min(100, Math.round(panjika.tithi.percentage)));

  // Detailed phase nomenclature
  const phaseName = useMemo(
    () => getPhaseNomenclature(illum, panjika.tithi.paksha, panjika.tithi.number, L),
    [illum, panjika.tithi.paksha, panjika.tithi.number, language]
  );

  return (
    <section className="group relative isolate flex h-full flex-col overflow-hidden rounded-3xl border border-indigo-300/30 bg-[linear-gradient(145deg,rgba(15,22,48,0.98),rgba(6,9,24,0.98)_55%,rgba(13,17,39,0.99))] p-4 shadow-[0_20px_50px_-25px_rgba(99,102,241,0.75),inset_0_1px_1px_rgba(255,255,255,0.12)] backdrop-blur-2xl transition-all duration-300 hover:border-indigo-300/50">
      {/* Background celestial radial ambient glow */}
      <div className="pointer-events-none absolute -right-16 -top-20 h-60 w-60 rounded-full bg-blue-500/18 blur-[75px]" />
      <div className="pointer-events-none absolute -bottom-20 -left-16 h-48 w-48 rounded-full bg-indigo-500/15 blur-[65px]" />

      {/* Header bar: Title & Moonrise badge */}
      <div className="relative z-10 mb-2 flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-indigo-100">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-indigo-300/30 bg-indigo-400/15 shadow-inner">
            <MoonStar className="h-4 w-4 text-indigo-200 animate-pulse" />
          </span>
          <span>{L('ଚନ୍ଦ୍ର ଦର୍ଶନ', 'चंद्र दर्शन', 'Moon 3D')}</span>
        </span>
        <div className="flex items-center gap-1.5">
          <span className="shrink-0 rounded-full border border-indigo-300/20 bg-slate-950/60 px-2.5 py-1 text-[10px] font-bold text-indigo-100 shadow-sm">
            {L('ଉଦୟ', 'उदय', 'Rise')} <span className="text-white font-mono">{formatTime(panjika.moonrise)}</span>
          </span>
        </div>
      </div>

      {/* 3D Lunar Viewport */}
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-indigo-300/20 bg-[radial-gradient(ellipse_at_50%_50%,rgba(99,102,241,0.15),rgba(5,8,22,0.4)_45%,transparent_75%)] shadow-inner">
        {/* Subtle decorative celestial orbital rings */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-36 w-60 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-indigo-200/[0.12]" style={{ transform: 'translate(-50%, -50%) rotateX(68deg) rotateZ(-14deg)' }} />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-28 w-52 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-violet-200/[0.10]" style={{ transform: 'translate(-50%, -50%) rotateX(72deg) rotateZ(24deg)' }} />

        {/* Three.js Canvas Container */}
        <div ref={hostRef} className="relative z-10 h-[178px] w-full">
          {failed && (
            <div
              className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background: `radial-gradient(circle at ${15 + illum * 35}% 50%, #eef0f6 0%, #c6c9d4 ${30 + illum * 20}%, #343a4e ${55 + illum * 15}%, #1a1e2e 100%)`,
                boxShadow: '0 0 45px rgba(180,200,255,0.35)',
              }}
            />
          )}
        </div>

        {/* Phase Name Tag (Bottom Left) */}
        <div className="pointer-events-none absolute bottom-2.5 left-2.5 z-20 flex items-center gap-1.5 rounded-full border border-indigo-300/30 bg-slate-950/75 px-2.5 py-1 text-[9px] font-bold tracking-wide text-indigo-100 shadow-lg backdrop-blur-md">
          <Sparkles className="w-2.5 h-2.5 text-cosmic-gold" />
          <span>{phaseName}</span>
        </div>

        {/* Interactive Mode / Reset Button (Bottom Right) */}
        <div className="absolute bottom-2.5 right-2.5 z-20 flex items-center gap-1.5">
          {userHasRotated ? (
            <button
              onClick={resetRotation}
              title={L('କକ୍ଷ ସ୍ଥିତିକୁ ଫେରନ୍ତୁ', 'कक्षा स्थिति पर रीसेट करें', 'Reset to Live Orbit')}
              className="flex items-center gap-1 rounded-full border border-cosmic-gold/50 bg-slate-950/85 px-2 py-0.5 text-[9px] font-bold text-cosmic-gold shadow-lg backdrop-blur-md hover:bg-cosmic-gold/20 transition-all cursor-pointer"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>{L('ପୁନଃସ୍ଥାପନ', 'रीसेट', 'Reset')}</span>
            </button>
          ) : (
            <div className="pointer-events-none flex items-center gap-1 rounded-full border border-white/10 bg-slate-950/50 px-2 py-0.5 text-[8px] font-medium text-slate-300 backdrop-blur-sm">
              <Eye className="w-2.5 h-2.5 text-indigo-300" />
              <span>{L('୩D ମୁକ୍ତ ଦର୍ଶନ', '3D दृश्य', '3D Drag')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Metric Cards: Accurate Percentage Telemetry */}
      <div className="relative z-10 mt-2.5 grid grid-cols-2 gap-2.5">
        {/* Card 1: Accurate Illumination % */}
        <div className="rounded-2xl border border-indigo-300/25 bg-gradient-to-br from-indigo-500/12 via-indigo-950/30 to-[#070b1e]/90 p-2.5 text-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
          <div className="text-[9px] font-black uppercase tracking-wider text-indigo-200/80">
            {L('ଆଲୋକିତ', 'प्रकाशित', 'Illuminated')}
          </div>
          <div className="mt-1 font-mono text-xl font-black leading-none text-white tracking-tight">
            {formatNumber(illumPct)}%
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-950/80 border border-indigo-300/15">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-sky-300 to-white shadow-[0_0_10px_rgba(165,180,252,0.65)] transition-all duration-500"
              style={{ width: `${illumPct}%` }}
            />
          </div>
          <div className="mt-1 text-[8px] font-medium text-slate-400">
            {isShukla ? L('ଶୁକ୍ଳ ପକ୍ଷ ବୃଦ୍ଧି', 'शुक्ल पक्ष वृद्धि', 'Waxing') : L('କୃଷ୍ଣ ପକ୍ଷ କ୍ଷୟ', 'कृष्ण पक्ष क्षय', 'Waning')}
          </div>
        </div>

        {/* Card 2: Accurate Tithi Progress % */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/50 via-slate-950/70 to-[#070b1e]/90 p-2.5 text-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
          <div className="text-[9px] font-black uppercase tracking-wider text-slate-300">
            {L('ତିଥି ଅଗ୍ରଗତି', 'तिथि प्रगति', 'Tithi Progress')}
          </div>
          <div className="mt-1 font-mono text-xl font-black leading-none text-slate-100 tracking-tight">
            {formatNumber(tithiElapsedPct)}%
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-950/80 border border-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400/80 via-indigo-300 to-sky-200 shadow-[0_0_8px_rgba(251,191,36,0.4)] transition-all duration-500"
              style={{ width: `${tithiElapsedPct}%` }}
            />
          </div>
          <div className="mt-1 text-[8px] font-medium text-slate-400 truncate">
            {L('ସମାପ୍ତ', 'समाप्त', 'Ends')}: {formatTime(panjika.tithi.endTime)}
          </div>
        </div>
      </div>
    </section>
  );
};
