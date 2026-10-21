import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import {
  RotateCw,
  Sparkles,
  Flame,
  Atom,
  Compass,
  Layers,
  Eye,
  Info,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';

export interface CosmicEvolution3DViewerProps {
  epochIndex: number;
  timeLabel: string;
  tempKelvin: string;
  scaleFactor: number;
  redshiftZ: string;
  onSelectEpoch?: (index: number) => void;
}

// Verified Astronomical Superclusters & Voids for Cosmic Web Mode
interface CosmicStructure {
  name: string;
  nameOr: string;
  type: 'supercluster' | 'void' | 'wall';
  pos: [number, number, number];
  distanceMpc: number;
  redshiftZ: number;
  massSolar: string;
  description: string;
  color: number;
  size: number;
}

const REAL_COSMIC_STRUCTURES: CosmicStructure[] = [
  {
    name: 'Laniakea Supercluster',
    nameOr: 'ଲାନିଆକିଆ ମହାକ୍ଲଷ୍ଟର୍ (ଆମ ଘର)',
    type: 'supercluster',
    pos: [0, 0, 0],
    distanceMpc: 0,
    redshiftZ: 0.0,
    massSolar: '10¹⁷ M☉',
    description: 'Our home supercluster containing the Milky Way, Virgo Cluster, and 100,000+ galaxies flowing toward the Great Attractor.',
    color: 0x38bdf8,
    size: 0.65
  },
  {
    name: 'Shapley Concentration',
    nameOr: 'ସାପ୍ଲେ ସୁପରକ୍ଲଷ୍ଟର୍',
    type: 'supercluster',
    pos: [9.5, 3.2, -4.5],
    distanceMpc: 200,
    redshiftZ: 0.046,
    massSolar: '10¹⁶ M☉',
    description: 'The most massive gravitational basin of attraction in our local universe, exerting enormous pull on Laniakea.',
    color: 0xf59e0b,
    size: 0.85
  },
  {
    name: 'Sloan Great Wall',
    nameOr: 'ସ୍ଲୋଆନ୍ ଗ୍ରେଟ୍ ୱାଲ୍ (ବୃହତ୍ କାନ୍ଥ)',
    type: 'wall',
    pos: [-11.2, 5.8, 6.4],
    distanceMpc: 310,
    redshiftZ: 0.073,
    massSolar: '2.5 × 10¹⁶ M☉',
    description: 'A colossal cosmic wall of galaxies extending 1.37 billion light years across spacetime.',
    color: 0xa855f7,
    size: 0.75
  },
  {
    name: 'Perseus-Pisces Supercluster',
    nameOr: 'ପର୍ସିୟସ୍-ପିସେସ୍ ମହାକ୍ଲଷ୍ଟର୍',
    type: 'supercluster',
    pos: [-7.8, -4.2, -7.5],
    distanceMpc: 77,
    redshiftZ: 0.018,
    massSolar: '5 × 10¹⁵ M☉',
    description: 'A dense chain of galaxy clusters spanning 300 million light years, bounding the local void.',
    color: 0x34d399,
    size: 0.6
  },
  {
    name: 'Coma Supercluster',
    nameOr: 'କୋମା ମହାକ୍ଲଷ୍ଟର୍ (Abell 1656)',
    type: 'supercluster',
    pos: [2.5, 8.4, -2.1],
    distanceMpc: 100,
    redshiftZ: 0.023,
    massSolar: '4 × 10¹⁵ M☉',
    description: 'Famous cluster where Fritz Zwicky first deduced the existence of Dark Matter in 1933 from galaxy velocity dispersions.',
    color: 0xf43f5e,
    size: 0.55
  },
  {
    name: 'Hercules Supercluster',
    nameOr: 'ହରକ୍ୟୁଲିସ୍ ମହାକ୍ଲଷ୍ଟର୍',
    type: 'supercluster',
    pos: [8.2, -6.5, 7.8],
    distanceMpc: 215,
    redshiftZ: 0.05,
    massSolar: '8 × 10¹⁵ M☉',
    description: 'Enormous pair of connected superclusters connected to the Great Wall filamentary network.',
    color: 0xeab308,
    size: 0.6
  },
  {
    name: 'Boötes Void (Great Nothing)',
    nameOr: 'ବୋଓଟିସ୍ ମହାଶୂନ୍ୟ (Boötes Void)',
    type: 'void',
    pos: [4.5, -2.5, 11.2],
    distanceMpc: 215,
    redshiftZ: 0.052,
    massSolar: '< 10¹³ M☉ (Empty)',
    description: 'A colossal spherical void 330 million light-years in diameter with virtually zero galaxies—the loneliest place in the cosmos.',
    color: 0x6366f1,
    size: 0.95
  }
];

export const CosmicEvolution3DViewer: React.FC<CosmicEvolution3DViewerProps> = ({
  epochIndex,
  timeLabel,
  tempKelvin,
  scaleFactor,
  redshiftZ,
  onSelectEpoch
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'explosion' | 'funnel' | 'cosmic_web'>('funnel');
  const [autoRotate, setAutoRotate] = useState(true);
  const [selectedStructure, setSelectedStructure] = useState<CosmicStructure | null>(null);

  const autoRotateRef = useRef(autoRotate);
  useEffect(() => { autoRotateRef.current = autoRotate; }, [autoRotate]);
  const scaleFactorRef = useRef(scaleFactor);
  useEffect(() => { scaleFactorRef.current = scaleFactor; }, [scaleFactor]);

  // References for animation and interaction
  const animStateRef = useRef({
    rotY: 0.45,
    rotX: 0.25,
    camDist: 22,
    isDragging: false,
    prevMouse: { x: 0, y: 0 },
    clock: 0
  });

  const safeEpoch = Math.max(0, Math.min(7, epochIndex || 0));

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 480;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x02040a, 0.015);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 6, 24);
    camera.lookAt(0, 0, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (err) {
      console.error('WebGL not available:', err);
      return;
    }
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    while (container.firstChild) container.removeChild(container.firstChild);
    container.appendChild(renderer.domElement);

    // 2. Dynamic Astrophysical Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const centerLight = new THREE.PointLight(0xffffff, 3.5, 80);
    centerLight.position.set(0, 0, 0);
    scene.add(centerLight);

    const blueBackLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    blueBackLight.position.set(-15, 10, -10);
    scene.add(blueBackLight);

    const warmFillLight = new THREE.DirectionalLight(0xf59e0b, 0.9);
    warmFillLight.position.set(15, -10, 10);
    scene.add(warmFillLight);

    // Master container group for rotation
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // Arrays to track elements for cleanup
    const disposables: { dispose: () => void }[] = [];

    // Helper to generate procedural glowing soft radial canvas texture
    const createGlowTexture = (
      stop0 = 'rgba(255,255,255,1)',
      stop1 = 'rgba(56,189,248,0.8)',
      stop2 = 'rgba(129,140,248,0.2)'
    ) => {
      const c = document.createElement('canvas');
      c.width = 128;
      c.height = 128;
      const ctx = c.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        grad.addColorStop(0, stop0);
        grad.addColorStop(0.25, stop1);
        grad.addColorStop(0.65, stop2);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 128, 128);
      }
      const tex = new THREE.CanvasTexture(c);
      disposables.push(tex);
      return tex;
    };

    // Helper: Generate Mini 3D Spiral Galaxy Mesh with glowing core & arms
    const createMiniGalaxy = (radius = 1.2, armColor = 0x38bdf8, coreColor = 0xfef08a) => {
      const galGroup = new THREE.Group();

      // Galaxy core
      const coreGeo = new THREE.SphereGeometry(radius * 0.22, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({ color: coreColor });
      galGroup.add(new THREE.Mesh(coreGeo, coreMat));
      disposables.push(coreGeo, coreMat);

      // Two spiral arms of particles
      const starCount = 350;
      const starGeo = new THREE.BufferGeometry();
      const starPos = new Float32Array(starCount * 3);
      for (let s = 0; s < starCount; s++) {
        const sIdx = s * 3;
        const arm = s % 2 === 0 ? 0 : Math.PI;
        const rDist = Math.pow(Math.random(), 0.7) * radius;
        const theta = arm + rDist * 3.5 + (Math.random() - 0.5) * 0.4;
        starPos[sIdx] = Math.cos(theta) * rDist;
        starPos[sIdx + 1] = (Math.random() - 0.5) * (radius * 0.1);
        starPos[sIdx + 2] = Math.sin(theta) * rDist;
      }
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
      const starMat = new THREE.PointsMaterial({
        size: 0.12,
        color: armColor,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
      });
      galGroup.add(new THREE.Points(starGeo, starMat));
      disposables.push(starGeo, starMat);

      return galGroup;
    };

    // =========================================================================
    // MODE 1: 🎺 3D SPACETIME FUNNEL (NASA WMAP / ESA PLANCK LIGHTCONE HORN)
    // =========================================================================
    if (viewMode === 'funnel') {
      const funnelGroup = new THREE.Group();

      // 1. Mathematically Accurate Curvature Spacetime Horn Geometry
      // X-axis: Time (-12 to +11)
      // Radius R(x) reflects Inflation -> Matter era -> Accelerated Dark Energy expansion
      const length = 23;
      const radialSegments = 96;
      const heightSegments = 64;

      const hornGeo = new THREE.CylinderGeometry(
        7.8, // Flare at modern era (z = 0, accelerated by Dark Energy)
        0.35, // Tip at Big Bang singularity (t = 0)
        length,
        radialSegments,
        heightSegments,
        true
      );
      hornGeo.rotateZ(Math.PI * 0.5);

      // Displace vertices along cylinder to match exact cosmological scale factor a(t)
      const posAttr = hornGeo.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i); // ranges from -11.5 to +11.5
        const normX = (x + 11.5) / 23.0; // 0 (Big Bang) to 1 (Today)

        // Non-linear cosmological Friedmann expansion curve:
        // rapid initial inflation + decelerated matter growth + exponential dark energy flare
        let aFactor = 0.05;
        if (normX < 0.05) {
          // Inflation phase
          aFactor = 0.05 + Math.pow(normX / 0.05, 0.4) * 0.35;
        } else if (normX < 0.7) {
          // Radiation & Matter Dominated Expansion
          const frac = (normX - 0.05) / 0.65;
          aFactor = 0.4 + Math.pow(frac, 0.68) * 1.5;
        } else {
          // Dark Energy Accelerated Expansion
          const frac = (normX - 0.7) / 0.3;
          aFactor = 1.9 + Math.pow(frac, 1.7) * 2.1;
        }

        const y = posAttr.getY(i);
        const z = posAttr.getZ(i);
        const curRadius = Math.sqrt(y * y + z * z);
        if (curRadius > 0.0001) {
          const targetRadius = aFactor * 1.85;
          const ratio = targetRadius / curRadius;
          posAttr.setY(i, y * ratio);
          posAttr.setZ(i, z * ratio);
        }
      }
      hornGeo.computeVertexNormals();

      // 2. High-Resolution Photorealistic 2048x512 Procedural Texture of Cosmic Epochs
      const texCanvas = document.createElement('canvas');
      texCanvas.width = 2048;
      texCanvas.height = 512;
      const ctx = texCanvas.getContext('2d');
      if (ctx) {
        // Multi-stop cosmological epoch gradient along horn surface
        const grad = ctx.createLinearGradient(0, 0, 2048, 0);
        grad.addColorStop(0.0, '#ffffff'); // Singularity (Pure white Planck radiance)
        grad.addColorStop(0.03, '#f59e0b'); // Cosmic Inflation (Golden inflaton glow)
        grad.addColorStop(0.08, '#38bdf8'); // Quark-Gluon Plasma (Relativistic blue)
        grad.addColorStop(0.14, '#ef4444'); // CMB Decoupling at 380,000 yr (Orange-red flash)
        grad.addColorStop(0.26, '#020617'); // Cosmic Dark Ages (Deep navy absorption)
        grad.addColorStop(0.42, '#3b82f6'); // Pop III Stars / Reionization (Azure brilliance)
        grad.addColorStop(0.68, '#eab308'); // Galactic Assembly & Solar System (Golden nebulae)
        grad.addColorStop(1.0, '#a855f7'); // Accelerated Dark Energy Horizon (Ultraviolet purple)
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 2048, 512);

        // Draw authentic Cosmic Microwave Background (CMB) acoustic ripples at x ~ 280
        for (let i = 0; i < 600; i++) {
          const rx = 240 + Math.random() * 90;
          const ry = Math.random() * 512;
          const rRad = 2 + Math.random() * 6;
          ctx.beginPath();
          ctx.arc(rx, ry, rRad, 0, Math.PI * 2);
          ctx.fillStyle = Math.random() > 0.5 ? 'rgba(239,68,68,0.45)' : 'rgba(56,189,248,0.45)';
          ctx.fill();
        }

        // Draw sparkling first stars (Pop III) at x ~ 700 to 900
        for (let i = 0; i < 400; i++) {
          const sx = 650 + Math.random() * 300;
          const sy = Math.random() * 512;
          ctx.fillStyle = 'rgba(255,255,255,0.85)';
          ctx.fillRect(sx, sy, 2, 2);
        }

        // Draw miniature spiral swirls for galaxy clustering at x ~ 1200 to 1950
        for (let i = 0; i < 120; i++) {
          const gx = 1200 + Math.random() * 800;
          const gy = Math.random() * 512;
          ctx.fillStyle = 'rgba(250,204,21,0.6)';
          ctx.beginPath();
          ctx.arc(gx, gy, 4 + Math.random() * 5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Add longitudinal spacetime coordinate grid lines
        ctx.strokeStyle = 'rgba(255,255,255,0.12)';
        ctx.lineWidth = 1;
        for (let y = 0; y < 512; y += 32) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(2048, y);
          ctx.stroke();
        }
      }
      const hornTex = new THREE.CanvasTexture(texCanvas);
      disposables.push(hornTex);

      const hornMat = new THREE.MeshStandardMaterial({
        map: hornTex,
        side: THREE.DoubleSide,
        roughness: 0.35,
        metalness: 0.15,
        transparent: true,
        opacity: 0.92
      });
      const hornMesh = new THREE.Mesh(hornGeo, hornMat);
      funnelGroup.add(hornMesh);
      disposables.push(hornGeo, hornMat);

      // Fine holographic coordinate wireframe
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.12
      });
      const wireMesh = new THREE.Mesh(hornGeo, wireMat);
      funnelGroup.add(wireMesh);
      disposables.push(wireMat);

      // 3. 3D Mini Galaxies and Stellar Objects INSIDE the Spacetime Funnel
      // Suspended along the time axis from t = First Stars to Modern Era
      const galaxyConfigs = [
        { x: 1.5, y: 0.6, z: 0.4, r: 0.7, color: 0x60a5fa },
        { x: 3.8, y: -0.8, z: -0.5, r: 0.9, color: 0xfacc15 },
        { x: 5.5, y: 1.2, z: -0.9, r: 1.1, color: 0x38bdf8 },
        { x: 7.2, y: -1.4, z: 1.1, r: 1.3, color: 0xf43f5e },
        { x: 9.0, y: 1.8, z: 0.8, r: 1.4, color: 0x34d399 },
        { x: 10.2, y: -2.1, z: -1.2, r: 1.5, color: 0xc084fc }
      ];
      galaxyConfigs.forEach((gc) => {
        const gal = createMiniGalaxy(gc.r, gc.color, 0xffffff);
        gal.position.set(gc.x, gc.y, gc.z);
        gal.rotation.x = Math.random() * Math.PI;
        gal.rotation.y = Math.random() * Math.PI;
        funnelGroup.add(gal);
      });

      // 4. Glowing 3D Translucent Epoch Divider Discs inside the Horn
      // 8 Epoch Positions mapped along X-axis (-11.5 to +11.5)
      const epochXPositions = [-11.2, -8.5, -5.5, -2.5, 0.5, 3.8, 7.5, 11.2];
      epochXPositions.forEach((posX, idx) => {
        const norm = (posX + 11.5) / 23.0;
        let rVal = 0.5;
        if (norm < 0.05) rVal = 0.3 + (norm / 0.05) * 0.6;
        else if (norm < 0.7) rVal = 0.9 + ((norm - 0.05) / 0.65) * 2.6;
        else rVal = 3.5 + ((norm - 0.7) / 0.3) * 3.8;

        const discGeo = new THREE.CircleGeometry(rVal * 0.95, 48);
        const isCurrent = idx === safeEpoch;
        const discMat = new THREE.MeshBasicMaterial({
          color: isCurrent ? 0xf59e0b : 0x38bdf8,
          transparent: true,
          opacity: isCurrent ? 0.45 : 0.08,
          side: THREE.DoubleSide
        });
        const discMesh = new THREE.Mesh(discGeo, discMat);
        discMesh.position.set(posX, 0, 0);
        discMesh.rotation.y = Math.PI * 0.5;
        funnelGroup.add(discMesh);
        disposables.push(discGeo, discMat);
      });

      // 5. Active Golden Laser Ring and Vertical Beacon at CURRENT EPOCH
      const currentX = epochXPositions[safeEpoch];
      const normCur = (currentX + 11.5) / 23.0;
      let curRadius = 0.5;
      if (normCur < 0.05) curRadius = 0.3 + (normCur / 0.05) * 0.6;
      else if (normCur < 0.7) curRadius = 0.9 + ((normCur - 0.05) / 0.65) * 2.6;
      else curRadius = 3.5 + ((normCur - 0.7) / 0.3) * 3.8;

      const ringGeo = new THREE.TorusGeometry(curRadius * 0.98, 0.12, 16, 64);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xf59e0b,
        emissiveIntensity: 2.2,
        roughness: 0.1
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.set(currentX, 0, 0);
      ringMesh.rotation.y = Math.PI * 0.5;
      funnelGroup.add(ringMesh);
      disposables.push(ringGeo, ringMat);

      // Vertical beacon ray piercing through active epoch
      const rayGeo = new THREE.CylinderGeometry(0.04, 0.04, curRadius * 2.8, 16);
      const rayMat = new THREE.MeshBasicMaterial({
        color: 0xfef08a,
        transparent: true,
        opacity: 0.75
      });
      const rayMesh = new THREE.Mesh(rayGeo, rayMat);
      rayMesh.position.set(currentX, 0, 0);
      funnelGroup.add(rayMesh);
      disposables.push(rayGeo, rayMat);

      masterGroup.add(funnelGroup);
    }

    // =========================================================================
    // MODE 2: 🕸️ 3D COSMIC WEB & DARK MATTER FILAMENTS (MILLENNIUM SIMULATION)
    // =========================================================================
    if (viewMode === 'cosmic_web') {
      const webGroup = new THREE.Group();

      // Soft glowing texture for filament particles
      const filamentGlowTex = createGlowTexture(
        'rgba(255,255,255,1)',
        'rgba(129,140,248,0.7)',
        'rgba(56,189,248,0.15)'
      );

      // 1. Create Supercluster Nodes with Halo Spheres and Mini Orbiting Galaxies
      REAL_COSMIC_STRUCTURES.forEach((struct) => {
        const nodeGroup = new THREE.Group();
        nodeGroup.position.set(...struct.pos);

        // Core Glowing Supercluster Body
        const coreGeo = new THREE.SphereGeometry(struct.size * 0.6, 24, 24);
        const coreMat = new THREE.MeshStandardMaterial({
          color: struct.color,
          emissive: struct.color,
          emissiveIntensity: 1.8,
          roughness: 0.2
        });
        const coreMesh = new THREE.Mesh(coreGeo, coreMat);
        nodeGroup.add(coreMesh);
        disposables.push(coreGeo, coreMat);

        // Gravitational Dark Matter Halo Atmosphere
        const haloGeo = new THREE.SphereGeometry(struct.size * 1.8, 24, 24);
        const haloMat = new THREE.MeshBasicMaterial({
          color: struct.color,
          transparent: true,
          opacity: 0.18,
          blending: THREE.AdditiveBlending
        });
        const haloMesh = new THREE.Mesh(haloGeo, haloMat);
        nodeGroup.add(haloMesh);
        disposables.push(haloGeo, haloMat);

        // Add 2-3 miniature orbiting spiral galaxies inside each supercluster!
        if (struct.type !== 'void') {
          for (let g = 0; g < 3; g++) {
            const miniG = createMiniGalaxy(0.45, struct.color, 0xffffff);
            const angle = (Math.PI * 2 * g) / 3;
            const dist = struct.size * 1.2;
            miniG.position.set(Math.cos(angle) * dist, (Math.random() - 0.5) * 0.3, Math.sin(angle) * dist);
            nodeGroup.add(miniG);
          }
        }

        webGroup.add(nodeGroup);
      });

      // 2. Curved Organic Catmull-Rom Dark Matter Filaments (NOT Plain Straight Lines!)
      // Interconnect neighbor superclusters using natural gravitational curved splines
      const connections: [number, number][] = [
        [0, 1], // Laniakea <-> Shapley
        [0, 3], // Laniakea <-> Perseus-Pisces
        [0, 4], // Laniakea <-> Coma
        [1, 5], // Shapley <-> Hercules
        [2, 4], // Sloan Great Wall <-> Coma
        [2, 5], // Sloan Great Wall <-> Hercules
        [3, 4], // Perseus-Pisces <-> Coma
        [4, 5], // Coma <-> Hercules
        [0, 6], // Laniakea <-> Boötes Void boundary
        [1, 6]  // Shapley <-> Boötes Void boundary
      ];

      // Generate 12,000 dense volumetric particles distributed along curved splines
      const totalFilamentParticles = 12000;
      const partPerConnection = Math.floor(totalFilamentParticles / connections.length);
      const filPositions = new Float32Array(totalFilamentParticles * 3);
      const filColors = new Float32Array(totalFilamentParticles * 3);

      let pCounter = 0;
      connections.forEach(([i, j]) => {
        const pA = new THREE.Vector3(...REAL_COSMIC_STRUCTURES[i].pos);
        const pB = new THREE.Vector3(...REAL_COSMIC_STRUCTURES[j].pos);

        // Gravitational midpoint curvature (sagging / bending toward cosmic center)
        const mid = new THREE.Vector3().addVectors(pA, pB).multiplyScalar(0.5);
        mid.x += (Math.random() - 0.5) * 2.0;
        mid.y += (Math.random() - 0.5) * 2.0;
        mid.z += (Math.random() - 0.5) * 2.0;

        const spline = new THREE.CatmullRomCurve3([pA, mid, pB]);

        // Draw soft glowing translucent spine tube
        const tubeGeo = new THREE.TubeGeometry(spline, 32, 0.18, 8, false);
        const tubeMat = new THREE.MeshBasicMaterial({
          color: 0x818cf8,
          transparent: true,
          opacity: 0.25,
          blending: THREE.AdditiveBlending
        });
        webGroup.add(new THREE.Mesh(tubeGeo, tubeMat));
        disposables.push(tubeGeo, tubeMat);

        // Scatter flowing dark matter wisp particles along the spline
        for (let k = 0; k < partPerConnection && pCounter < totalFilamentParticles; k++) {
          const t = Math.random();
          const ptOnCurve = spline.getPoint(t);

          // Particles are denser in center, tapering outwards
          const spread = 0.8 * (1 - Math.abs(t - 0.5) * 0.5);
          const idx = pCounter * 3;
          filPositions[idx] = ptOnCurve.x + (Math.random() - 0.5) * spread;
          filPositions[idx + 1] = ptOnCurve.y + (Math.random() - 0.5) * spread;
          filPositions[idx + 2] = ptOnCurve.z + (Math.random() - 0.5) * spread;

          // Color gradient: cyan to purple
          if (k % 2 === 0) {
            filColors[idx] = 0.22; filColors[idx + 1] = 0.74; filColors[idx + 2] = 0.97; // Cyan
          } else {
            filColors[idx] = 0.65; filColors[idx + 1] = 0.54; filColors[idx + 2] = 0.98; // Violet
          }
          pCounter++;
        }
      });

      const filPartGeo = new THREE.BufferGeometry();
      filPartGeo.setAttribute('position', new THREE.BufferAttribute(filPositions, 3));
      filPartGeo.setAttribute('color', new THREE.BufferAttribute(filColors, 3));

      const filPartMat = new THREE.PointsMaterial({
        size: 0.28,
        map: filamentGlowTex,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const filPoints = new THREE.Points(filPartGeo, filPartMat);
      webGroup.add(filPoints);
      disposables.push(filPartGeo, filPartMat);

      masterGroup.add(webGroup);
    }

    // =========================================================================
    // MODE 3: 💥 3D VOLUMETRIC EXPANDING SPACETIME EXPLOSION
    // =========================================================================
    if (viewMode === 'explosion') {
      const explosionGroup = new THREE.Group();

      // 1. Primordial Singularity Core with Multi-layered Solar Corona Glow
      const coreRadius = Math.max(0.25, (1 - safeEpoch * 0.11) * 1.6);
      const coreGeo = new THREE.SphereGeometry(coreRadius, 32, 32);
      const coreColor =
        safeEpoch === 0
          ? 0xffffff
          : safeEpoch <= 2
          ? 0x60a5fa
          : safeEpoch <= 4
          ? 0xf59e0b
          : 0xef4444;
      const coreMat = new THREE.MeshStandardMaterial({
        color: coreColor,
        emissive: coreColor,
        emissiveIntensity: safeEpoch <= 3 ? 3.0 : 1.2,
        roughness: 0.1
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      explosionGroup.add(coreMesh);
      disposables.push(coreGeo, coreMat);

      // Core Corona Glow Sprite
      const coronaTex = createGlowTexture(
        'rgba(255,255,255,1)',
        'rgba(245,158,11,0.85)',
        'rgba(239,68,68,0.2)'
      );
      const coronaMat = new THREE.SpriteMaterial({
        map: coronaTex,
        color: 0xffffff,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.85
      });
      const coronaSprite = new THREE.Sprite(coronaMat);
      coronaSprite.scale.set(coreRadius * 4.5, coreRadius * 4.5, 1);
      explosionGroup.add(coronaSprite);
      disposables.push(coronaMat);

      // 2. Relativistic Expanding Spherical Shockwave Wavefront Rings
      const ringCount = 5;
      for (let rIdx = 0; rIdx < ringCount; rIdx++) {
        const ringRadius = 2.0 + rIdx * 2.4 * (scaleFactorRef.current + 0.25);
        const ringGeo = new THREE.TorusGeometry(ringRadius, 0.08, 16, 64);
        const ringMat = new THREE.MeshBasicMaterial({
          color: rIdx % 2 === 0 ? 0x38bdf8 : 0xf59e0b,
          transparent: true,
          opacity: Math.max(0.12, 0.7 - rIdx * 0.12)
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = (Math.PI / 5) * rIdx;
        ringMesh.rotation.y = (Math.PI / 4) * rIdx;
        explosionGroup.add(ringMesh);
        disposables.push(ringGeo, ringMat);
      }

      // 3. Authentic Planck 2018 Cosmic Microwave Background (CMB) Decoupling Shell
      if (safeEpoch >= 4) {
        const cmbRadius = 8.8 * (scaleFactorRef.current + 0.35);
        const cmbGeo = new THREE.SphereGeometry(cmbRadius, 64, 64);

        const cmbCanvas = document.createElement('canvas');
        cmbCanvas.width = 1024;
        cmbCanvas.height = 512;
        const cmbCtx = cmbCanvas.getContext('2d');
        if (cmbCtx) {
          cmbCtx.fillStyle = '#0a0f1d';
          cmbCtx.fillRect(0, 0, 1024, 512);

          // Authentic acoustic fluctuations (dipole & multipole angular power spectrum)
          for (let p = 0; p < 1800; p++) {
            const px = Math.random() * 1024;
            const py = Math.random() * 512;
            const pr = 4 + Math.random() * 18;
            const isWarm = Math.random() > 0.52;
            cmbCtx.beginPath();
            cmbCtx.arc(px, py, pr, 0, Math.PI * 2);
            cmbCtx.fillStyle = isWarm
              ? 'rgba(239, 68, 68, 0.28)'
              : 'rgba(56, 189, 248, 0.28)';
            cmbCtx.fill();
          }
        }
        const cmbTex = new THREE.CanvasTexture(cmbCanvas);
        disposables.push(cmbTex);

        const cmbMat = new THREE.MeshBasicMaterial({
          map: cmbTex,
          transparent: true,
          opacity: safeEpoch === 4 ? 0.72 : 0.35,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending
        });
        const cmbMesh = new THREE.Mesh(cmbGeo, cmbMat);
        explosionGroup.add(cmbMesh);
        disposables.push(cmbGeo, cmbMat);
      }

      // 4. 8,000 High-Density Primordial Matter Particles
      const particleCount = 8000;
      const partGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      const partTex = createGlowTexture(
        'rgba(255,255,255,1)',
        'rgba(56,189,248,0.9)',
        'rgba(245,158,11,0.25)'
      );

      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        const spread = 2.0 + scaleFactorRef.current * 15.0;

        if (safeEpoch === 0) {
          // Planck Singularity: intensely packed inside subatomic radius
          const r = Math.pow(Math.random(), 3.5) * 0.7;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          positions[idx] = r * Math.sin(phi) * Math.cos(theta);
          positions[idx + 1] = r * Math.sin(phi) * Math.sin(theta);
          positions[idx + 2] = r * Math.cos(phi);

          colors[idx] = 1.0; colors[idx + 1] = 1.0; colors[idx + 2] = 1.0;
        } else if (safeEpoch <= 3) {
          // Primordial Plasma (Quarks & BBN Nuclei): Expanding radial blast
          const r = Math.pow(Math.random(), 0.65) * spread;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          positions[idx] = r * Math.sin(phi) * Math.cos(theta);
          positions[idx + 1] = r * Math.sin(phi) * Math.sin(theta);
          positions[idx + 2] = r * Math.cos(phi);

          if (i % 3 === 0) {
            colors[idx] = 0.95; colors[idx + 1] = 0.25; colors[idx + 2] = 0.2; // Red Quark
          } else if (i % 3 === 1) {
            colors[idx] = 0.2; colors[idx + 1] = 0.75; colors[idx + 2] = 0.95; // Blue Lepton
          } else {
            colors[idx] = 0.98; colors[idx + 1] = 0.85; colors[idx + 2] = 0.2; // Photon
          }
        } else if (safeEpoch <= 5) {
          // Cosmic Dawn & Pop III Stars: Gravitational clustering along dark matter filaments
          const filamentId = i % 20;
          const tFil = (Math.random() - 0.5) * spread * 1.6;
          const fx = Math.sin(filamentId * 1.3) * tFil;
          const fy = Math.cos(filamentId * 1.7) * tFil;
          const fz = Math.sin(filamentId * 2.3) * tFil;
          positions[idx] = fx + (Math.random() - 0.5) * 1.4;
          positions[idx + 1] = fy + (Math.random() - 0.5) * 1.4;
          positions[idx + 2] = fz + (Math.random() - 0.5) * 1.4;

          colors[idx] = 0.65; colors[idx + 1] = 0.85; colors[idx + 2] = 1.0; // Pop III blue-white
        } else {
          // Modern Universe: Galactic Clusters with Spiral Arm Kinematics
          const clusterId = i % 28;
          const cx = Math.sin(clusterId * 1.9) * spread * 0.85;
          const cy = Math.cos(clusterId * 2.5) * spread * 0.85;
          const cz = Math.sin(clusterId * 3.1) * spread * 0.85;

          const rArm = Math.pow(Math.random(), 1.8) * 2.6;
          const thetaArm = Math.random() * Math.PI * 2;
          positions[idx] = cx + Math.cos(thetaArm) * rArm;
          positions[idx + 1] = cy + (Math.random() - 0.5) * 0.4;
          positions[idx + 2] = cz + Math.sin(thetaArm) * rArm;

          colors[idx] = 1.0; colors[idx + 1] = 0.85; colors[idx + 2] = 0.35; // Mature stars
        }
      }

      partGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      partGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const partMat = new THREE.PointsMaterial({
        size: 0.38,
        map: partTex,
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const points = new THREE.Points(partGeo, partMat);
      explosionGroup.add(points);
      disposables.push(partGeo, partMat);

      masterGroup.add(explosionGroup);
    }

    // =========================================================================
    // 4. Interactive Drag, Orbit, Touch & Zoom Handlers
    // =========================================================================
    const state = animStateRef.current;

    const onMouseDown = (e: MouseEvent) => {
      state.isDragging = true;
      state.prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!state.isDragging) return;
      const dx = e.clientX - state.prevMouse.x;
      const dy = e.clientY - state.prevMouse.y;
      state.rotY += dx * 0.008;
      state.rotX = THREE.MathUtils.clamp(state.rotX + dy * 0.008, -Math.PI * 0.45, Math.PI * 0.45);
      state.prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      state.isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      state.camDist = THREE.MathUtils.clamp(state.camDist + e.deltaY * 0.025, 6, 60);
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domEl.addEventListener('wheel', onWheel, { passive: false });

    // Touch Support
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        state.isDragging = true;
        state.prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!state.isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - state.prevMouse.x;
      const dy = e.touches[0].clientY - state.prevMouse.y;
      state.rotY += dx * 0.008;
      state.rotX = THREE.MathUtils.clamp(state.rotX + dy * 0.008, -Math.PI * 0.45, Math.PI * 0.45);
      state.prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = () => {
      state.isDragging = false;
    };
    domEl.addEventListener('touchstart', onTouchStart, { passive: true });
    domEl.addEventListener('touchmove', onTouchMove, { passive: true });
    domEl.addEventListener('touchend', onTouchEnd);
    domEl.addEventListener('touchcancel', onTouchEnd);

    // =========================================================================
    // 5. Continuous 60 FPS Render Loop
    // =========================================================================
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      state.clock += 0.015;

      if (autoRotateRef.current && !state.isDragging) {
        state.rotY += 0.0025;
      }

      camera.position.x = state.camDist * Math.sin(state.rotY) * Math.cos(state.rotX);
      camera.position.y = state.camDist * Math.sin(state.rotX);
      camera.position.z = state.camDist * Math.cos(state.rotY) * Math.cos(state.rotX);
      camera.lookAt(0, 0, 0);

      // Subtle atmospheric pulsation
      if (viewMode === 'funnel') {
        masterGroup.rotation.x = Math.sin(state.clock * 0.5) * 0.02;
      } else if (viewMode === 'cosmic_web') {
        masterGroup.rotation.y += 0.0008;
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
      domEl.removeEventListener('wheel', onWheel);
      domEl.removeEventListener('touchstart', onTouchStart);
      domEl.removeEventListener('touchmove', onTouchMove);
      domEl.removeEventListener('touchend', onTouchEnd);
      domEl.removeEventListener('touchcancel', onTouchEnd);
      window.removeEventListener('resize', handleResize);
      
      scene.traverse((obj: any) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m: any) => { if (m.map) m.map.dispose(); m.dispose(); });
          else { if (obj.material.map) obj.material.map.dispose(); obj.material.dispose(); }
        }
      });
      scene.clear();
      renderer.dispose();
      renderer.forceContextLoss();

      disposables.forEach((d) => d.dispose());
      if (container.contains(domEl)) {
        container.removeChild(domEl);
      }
    };
  }, [viewMode, safeEpoch]);

  // Camera presets
  const setCameraPreset = (preset: 'side' | 'top' | 'isometric') => {
    if (preset === 'side') {
      animStateRef.current.rotX = 0;
      animStateRef.current.rotY = Math.PI * 0.5;
    } else if (preset === 'top') {
      animStateRef.current.rotX = Math.PI * 0.44;
      animStateRef.current.rotY = 0;
    } else {
      animStateRef.current.rotX = 0.35;
      animStateRef.current.rotY = 0.65;
    }
  };

  return (
    <div className="relative w-full h-[420px] sm:h-[500px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#01040a] via-[#020714] to-[#01040a] border-2 border-cosmic-gold/50 shadow-2xl flex flex-col justify-between group">
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Top Header HUD: Mode Switcher & Camera Tools */}
      <div className="relative z-10 flex flex-wrap items-center justify-between p-3 sm:p-4 gap-2 pointer-events-none">
        {/* Left: Mode Title */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold px-3 py-1.5 rounded-full bg-cosmic-gold/20 border border-cosmic-gold/40 text-amber-300 backdrop-blur-md flex items-center gap-1.5 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-cosmic-gold animate-pulse" />
            3D Cosmic Evolution Laboratory
          </span>

          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 backdrop-blur-md hidden md:inline-flex items-center gap-1">
            <Atom className="w-3 h-3 text-cyan-400" />
            Planck 2018 ΛCDM • Photorealistic
          </span>
        </div>

        {/* Right: 3D Visualization Modes & Camera Controls */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Mode 1: Spacetime Funnel */}
          <button
            type="button"
            onClick={() => setViewMode('funnel')}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold border backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
              viewMode === 'funnel'
                ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white border-white scale-105 shadow-cyan-500/25'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
            title="NASA WMAP / ESA Planck Spacetime Lightcone Horn"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Spacetime Funnel</span>
          </button>

          {/* Mode 2: Cosmic Web */}
          <button
            type="button"
            onClick={() => setViewMode('cosmic_web')}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold border backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
              viewMode === 'cosmic_web'
                ? 'bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 text-white border-white scale-105 shadow-purple-500/25'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
            title="Millennium Simulation Dark Matter Filaments & Superclusters"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Cosmic Web</span>
          </button>

          {/* Mode 3: Explosion */}
          <button
            type="button"
            onClick={() => setViewMode('explosion')}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold border backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
              viewMode === 'explosion'
                ? 'bg-gradient-to-r from-rose-500 via-amber-500 to-yellow-500 text-cosmic-950 font-black border-white scale-105 shadow-rose-500/25'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
            title="3D Volumetric Spacetime Explosion & Relativistic Blast"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>3D Explosion</span>
          </button>

          {/* Auto Spin Toggle */}
          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            className="p-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 backdrop-blur-md transition-all cursor-pointer"
            title="Toggle 360° Orbit Rotation"
          >
            <RotateCw className={`w-3.5 h-3.5 text-emerald-400 ${autoRotate ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Floating Telemetry Box (Top Left) */}
      <div className="relative z-10 mx-3 sm:mx-4 bg-cosmic-950/90 border border-cosmic-gold/40 p-3.5 rounded-2xl font-mono text-xs backdrop-blur-md shadow-2xl space-y-1.5 pointer-events-none max-w-xs">
        <div className="flex items-center justify-between text-[10px] text-slate-400">
          <span>COSMIC TIME (ବ୍ରହ୍ମାଣ୍ଡ ସମୟ)</span>
          <span className="text-cyan-400 font-bold">{redshiftZ}</span>
        </div>
        <div className="text-lg font-black text-cosmic-gold flex items-center gap-2">
          <span>{timeLabel}</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Temperature (T):</span>
          <span className="font-bold text-rose-400">{tempKelvin}</span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400">
          <span>Scale Factor a(t):</span>
          <span className="text-emerald-400 font-bold">{(scaleFactor * 100).toFixed(1)}%</span>
        </div>
      </div>

      {/* Floating Supercluster Detail Box for Cosmic Web Mode */}
      {viewMode === 'cosmic_web' && (
        <div className="relative z-10 mx-3 sm:mx-4 p-2.5 bg-slate-950/85 border border-purple-500/40 rounded-2xl backdrop-blur-md shadow-xl text-xs font-mono max-w-sm pointer-events-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
            <span className="text-purple-300 font-bold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>Real Astronomical Superclusters:</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {REAL_COSMIC_STRUCTURES.map((struct) => (
              <button
                key={struct.name}
                type="button"
                onClick={() => setSelectedStructure(struct)}
                className={`px-2 py-0.5 rounded-md text-[10px] border transition-all cursor-pointer ${
                  selectedStructure?.name === struct.name
                    ? 'bg-purple-500 text-white border-white font-bold'
                    : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:border-purple-400'
                }`}
              >
                {struct.name.split(' ')[0]}
              </button>
            ))}
          </div>
          {selectedStructure && (
            <div className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] space-y-1">
              <div className="text-cosmic-gold font-bold">{selectedStructure.nameOr}</div>
              <div className="text-slate-300 text-[10px]">{selectedStructure.description}</div>
              <div className="flex justify-between text-[9px] text-cyan-300">
                <span>Dist: {selectedStructure.distanceMpc} Mpc</span>
                <span>Mass: {selectedStructure.massSolar}</span>
                <span>z = {selectedStructure.redshiftZ}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom Camera Angle Presets & Navigation Aid */}
      <div className="relative z-10 p-3 sm:p-4 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-1.5 pointer-events-auto text-[10px] font-mono">
          <span className="text-slate-400 hidden sm:inline mr-1">Camera:</span>
          <button
            type="button"
            onClick={() => setCameraPreset('isometric')}
            className="px-2 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer"
          >
            3D Orbit
          </button>
          <button
            type="button"
            onClick={() => setCameraPreset('side')}
            className="px-2 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer"
          >
            Side Profile
          </button>
          <button
            type="button"
            onClick={() => setCameraPreset('top')}
            className="px-2 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer"
          >
            Top View
          </button>
        </div>

        <span className="text-[10px] text-slate-400 font-mono hidden md:inline">
          🖱️ Drag mouse to orbit 3D • Scroll to zoom
        </span>
      </div>
    </div>
  );
};
