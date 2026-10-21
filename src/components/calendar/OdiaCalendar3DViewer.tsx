import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useI18n } from '../../localization/i18n';
import { DynamicOdiaDayInfo } from '../../core/panjika/odia_calendar_engine';
import {
  Sparkles,
  Sun,
  Moon,
  Info,
  Flag,
  Sunrise,
  Sunset,
  Heart,
  Play,
  Pause,
  Clock,
  Compass,
  Move,
  Eye,
  Camera,
  Layers,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

export type ChariotId = 'nandighosha' | 'taladhwaja' | 'debadalana';
export type TimeOfDay = 'dawn' | 'noon' | 'dusk' | 'night';

export interface RathaDetails {
  id: ChariotId;
  nameOr: string;
  nameHi: string;
  nameEn: string;
  deityOr: string;
  wheelsCount: number;
  axlesCount: number;
  heightFt: number;
  canopyColors: [number, number]; // primary, secondary hex
  horseColor: number;
  flagNameOr: string;
  sarathiOr: string;
  ropeOr: string;
  horsesOr: string[];
  logsCount: number;
  descriptionOr: string;
}

const CHARIOTS: RathaDetails[] = [
  {
    id: 'nandighosha',
    nameOr: 'ନନ୍ଦିଘୋଷ ରଥ (କପିଧ୍ୱଜ)',
    nameHi: 'नंदिघोष रथ (कपिलध्वज)',
    nameEn: 'Nandighosha Chariot (Lord Jagannath)',
    deityOr: 'ମହାପ୍ରଭୁ ଶ୍ରୀ ଜଗନ୍ନାଥ',
    wheelsCount: 16,
    axlesCount: 8,
    heightFt: 44.2,
    canopyColors: [0xffd700, 0xb71c1c], // Yellow & Red
    horseColor: 0xffffff, // 4 White horses
    flagNameOr: 'ତ୍ରୈଲୋକ୍ୟମୋହିନୀ (ଗରୁଡ଼ ଲାଞ୍ଛନ)',
    sarathiOr: 'ମାତଳି',
    ropeOr: 'ଶଙ୍ଖଚୂଡ଼',
    horsesOr: ['ଶଙ୍ଖ', 'ବଳାହକ', 'ଶ୍ୱେତ', 'ହରିଦାଶ୍ୱ'],
    logsCount: 832,
    descriptionOr: '୧୬ଟି ବିଶାଳ କାଠ ଚକ ଓ ୮ଟି ଅଖ ବିଶିଷ୍ଟ ମହାପ୍ରଭୁ ଶ୍ରୀଜଗନ୍ନାଥଙ୍କ ରଥ। ହଳଦିଆ ଓ ନାଲି ପିପିଲି ଚାନ୍ଦୁଆ, ଚାରୋଟି ଶ୍ୱେତ ଅଶ୍ୱ, ଗରୁଡ଼ ଧ୍ୱଜ ଓ ଶଙ୍ଖଚୂଡ଼ ଦଉଡ଼ି।'
  },
  {
    id: 'taladhwaja',
    nameOr: 'ତାଳଧ୍ୱଜ ରଥ',
    nameHi: 'तालध्वज रथ',
    nameEn: 'Taladhwaja Chariot (Lord Balabhadra)',
    deityOr: 'ପ୍ରଭୁ ଶ୍ରୀ ବଳଭଦ୍ର',
    wheelsCount: 14,
    axlesCount: 7,
    heightFt: 43.3,
    canopyColors: [0x1b5e20, 0xb71c1c], // Green & Red
    horseColor: 0x111111, // 4 Black horses
    flagNameOr: 'ଉନ୍ନନୀ (ତାଳ ଲାଞ୍ଛନ)',
    sarathiOr: 'ଦାରୁକ',
    ropeOr: 'ବାସୁକୀ ନାଗ',
    horsesOr: ['ତୀବ୍ର', 'ଘୋର', 'ଦୀର୍ଘଶ୍ରମ', 'ସ୍ୱର୍ଣ୍ଣନାଭ'],
    logsCount: 763,
    descriptionOr: '୧୪ଟି ଚକ ଓ ୭ଟି ଅଖ ବିଶିଷ୍ଟ ବଡ଼ଠାକୁର ବଳଭଦ୍ରଙ୍କ ରଥ। ସବୁଜ ଓ ଲାଲ୍ ପିପିଲି ଚାନ୍ଦୁଆ, ଚାରୋଟି କୃଷ୍ଣବର୍ଣ୍ଣ ଅଶ୍ୱ, ତାଳ ଧ୍ୱଜ ଓ ବାସୁକୀ ଦଉଡ଼ି।'
  },
  {
    id: 'debadalana',
    nameOr: 'ଦେବଦଳନ / ଦର୍ପଦଳନ ରଥ',
    nameHi: 'देवदलन / दर्पदलन रथ',
    nameEn: 'Debadalana Chariot (Devi Subhadra)',
    deityOr: 'ଦେବୀ ମା’ ସୁଭଦ୍ରା',
    wheelsCount: 12,
    axlesCount: 6,
    heightFt: 42.3,
    canopyColors: [0x111111, 0xb71c1c], // Black & Red
    horseColor: 0x8d3c1b, // 4 Red chestnut horses
    flagNameOr: 'ନାଦାମ୍ବିକା (ପଦ୍ମ ଲାଞ୍ଛନ)',
    sarathiOr: 'ଅର୍ଜୁନ',
    ropeOr: 'ସ୍ୱର୍ଣ୍ଣଚୂଡ଼',
    horsesOr: ['ରୋଚିକା', 'ମୋଚିକା', 'ଜିତା', 'ଅପରାଜିତା'],
    logsCount: 593,
    descriptionOr: '୧୨ଟି ଚକ ଓ ୬ଟି ଅଖ ବିଶିଷ୍ଟ ମା’ ସୁଭଦ୍ରାଙ୍କ ରଥ। କଳା ଓ ଲାଲ୍ ପିପିଲି ଚାନ୍ଦୁଆ, ଚାରୋଟି ଲୋହିତ ଅଶ୍ୱ, ପଦ୍ମ ଧ୍ୱଜ ଓ ସ୍ୱର୍ଣ୍ଣଚୂଡ଼ ଦଉଡ଼ି।'
  }
];

interface CameraPreset {
  id: string;
  nameOr: string;
  pos: [number, number, number];
  target: [number, number, number];
}

const CAMERA_PRESETS: CameraPreset[] = [
  { id: 'overview', nameOr: '🚩 ସମଗ୍ର ରଥ ଦର୍ଶନ', pos: [0, 16, 36], target: [0, 8, 0] },
  { id: 'deity', nameOr: '👁️ ଚକା ଡୋଳା ଓ ଗର୍ଭଗୃହ', pos: [0, 8.5, 14], target: [0, 8.2, 0] },
  { id: 'horses', nameOr: '🐎 ୪ଟି ଦିବ୍ୟ ଅଶ୍ୱ', pos: [0, 4.5, 22], target: [0, 3.5, 12] },
  { id: 'wheels', nameOr: '⚙️ ୧୬ଟି ରଥ ଚକ ଓ ଅଖ', pos: [-16, 3.5, 2], target: [0, 3, 0] },
  { id: 'kalasa', nameOr: '👑 ସୁବର୍ଣ୍ଣ କଳସ ଓ ବାନା', pos: [0, 24, 18], target: [0, 20, 0] },
  { id: 'rope', nameOr: '🪢 ଭକ୍ତଙ୍କ ଦଉଡ଼ି ଟଣା POV', pos: [0, 2.5, 34], target: [0, 6, 4] }
];

interface OdiaCalendar3DViewerProps {
  dayInfo: DynamicOdiaDayInfo;
  onClose?: () => void;
}

export const OdiaCalendar3DViewer: React.FC<OdiaCalendar3DViewerProps> = ({
  dayInfo
}) => {
  const { language } = useI18n();

  // Active Chariot & View Settings
  const [activeChariotId, setActiveChariotId] = useState<ChariotId>('nandighosha');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('noon');
  const [isRolling, setIsRolling] = useState<boolean>(true);
  const [isFlowerShower, setIsFlowerShower] = useState<boolean>(true);
  const [cameraPresetId, setCameraPresetId] = useState<string>('overview');
  const [distanceMeters, setDistanceMeters] = useState<number>(145);
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);

  // References for Three.js
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const reqAnimRef = useRef<number | null>(null);

  // References to animated 3D meshes
  const wheelsListRef = useRef<THREE.Group[]>([]);
  const flagMeshRef = useRef<THREE.Mesh | null>(null);
  const groundMeshRef = useRef<THREE.Mesh | null>(null);
  const ropesMeshRef = useRef<THREE.Mesh | null>(null);
  const chariotRootRef = useRef<THREE.Group | null>(null);
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const torchLightsRef = useRef<THREE.PointLight[]>([]);

  // State refs for animation loop
  const isRollingRef = useRef<boolean>(true);
  isRollingRef.current = isRolling;

  const currentRatha = CHARIOTS.find((c) => c.id === activeChariotId) || CHARIOTS[0];

  // Distance progression
  useEffect(() => {
    if (!isRolling) return;
    const interval = setInterval(() => {
      setDistanceMeters((d) => (d >= 2800 ? 50 : Math.round((d + 0.8) * 10) / 10));
    }, 1000);
    return () => clearInterval(interval);
  }, [isRolling]);

  // Smooth Camera transition
  const applyCameraPreset = (preset: CameraPreset) => {
    setCameraPresetId(preset.id);
    if (!cameraRef.current || !controlsRef.current) return;

    const camera = cameraRef.current;
    const controls = controlsRef.current;

    const startPos = camera.position.clone();
    const targetPos = new THREE.Vector3(...preset.pos);
    const startTarget = controls.target.clone();
    const targetTarget = new THREE.Vector3(...preset.target);

    let progress = 0;
    const duration = 1200; // ms
    const startTime = performance.now();

    const glideCamera = (now: number) => {
      progress = Math.min((now - startTime) / duration, 1.0);
      const ease = 0.5 - Math.cos(progress * Math.PI) / 2; // smooth cosine ease

      camera.position.lerpVectors(startPos, targetPos, ease);
      controls.target.lerpVectors(startTarget, targetTarget, ease);
      controls.update();

      if (progress < 1.0) {
        requestAnimationFrame(glideCamera);
      }
    };
    requestAnimationFrame(glideCamera);
  };

  // -------------------------------------------------------------
  // BUILD HIGH-FIDELITY CHARIOT 3D SCENE
  // -------------------------------------------------------------
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 580;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 600);
    camera.position.set(0, 16, 36);
    cameraRef.current = camera;

    // Renderer with ACES Tone Mapping & Shadows
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    } catch (_) {
      return;
    }
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // do not clip below ground
    controls.minDistance = 6;
    controls.maxDistance = 110;
    controls.target.set(0, 8, 0);
    controlsRef.current = controls;

    // Texture Loader
    const texLoader = new THREE.TextureLoader();
    const chakaTex = texLoader.load('/ratha/ratha_chaka.jpg');
    const deityTex = texLoader.load('/ratha/chaka_dola.jpg');
    const appliqueTex = texLoader.load(
      activeChariotId === 'nandighosha'
        ? '/ratha/nandighosha.jpg'
        : activeChariotId === 'taladhwaja'
        ? '/ratha/taladhwaja.jpg'
        : '/ratha/debadalana.jpg'
    );
    const templeTex = texLoader.load('/ratha/srimandir_grand.jpg');

    // Sky Background Color according to Time of Day
    const skyColors: Record<TimeOfDay, number> = {
      dawn: 0xf59e0b,
      noon: 0x38bdf8,
      dusk: 0x991b1b,
      night: 0x020617
    };
    scene.background = new THREE.Color(skyColors[timeOfDay]);
    scene.fog = new THREE.FogExp2(skyColors[timeOfDay], 0.012);

    // Ambient Lighting
    const ambientColor = timeOfDay === 'night' ? 0x1e1b4b : timeOfDay === 'dawn' ? 0xfef08a : 0xffffff;
    const ambientLight = new THREE.AmbientLight(ambientColor, timeOfDay === 'night' ? 0.35 : 0.85);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    // Sunlight
    const sunLight = new THREE.DirectionalLight(
      timeOfDay === 'night' ? 0x38bdf8 : timeOfDay === 'dusk' ? 0xf97316 : 0xfffae0,
      timeOfDay === 'night' ? 0.2 : timeOfDay === 'noon' ? 2.2 : 1.6
    );
    sunLight.position.set(30, 48, 30);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 150;
    const d = 30;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // Torchlights for Night mode
    torchLightsRef.current = [];
    if (timeOfDay === 'night' || timeOfDay === 'dusk') {
      const torchPos = [
        [-5.5, 5, -8],
        [5.5, 5, -8],
        [-5.5, 5, 8],
        [5.5, 5, 8],
        [0, 8.5, 2]
      ];
      torchPos.forEach(([tx, ty, tz]) => {
        const torchLight = new THREE.PointLight(0xff7700, 3.5, 18, 1.5);
        torchLight.position.set(tx, ty, tz);
        torchLight.castShadow = true;
        scene.add(torchLight);
        torchLightsRef.current.push(torchLight);

        // Torch flame particle sphere
        const flameGeo = new THREE.SphereGeometry(0.2, 8, 8);
        const flameMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
        const flame = new THREE.Mesh(flameGeo, flameMat);
        flame.position.set(tx, ty, tz);
        scene.add(flame);
      });
    }

    // -----------------------------------------------------------
    // GROUND: PURI BADADANDA (Grand Road)
    // -----------------------------------------------------------
    const groundGeo = new THREE.PlaneGeometry(160, 220);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xa3714c,
      roughness: 0.9,
      metalness: 0.05
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);
    groundMeshRef.current = ground;

    // White Jhoti Rice-Paste Borders on Badadanda
    for (const z of [-3, 3]) {
      const stripeGeo = new THREE.PlaneGeometry(0.5, 220);
      const stripeMat = new THREE.MeshBasicMaterial({ color: 0xfef3c7, opacity: 0.7, transparent: true });
      const stripe = new THREE.Mesh(stripeGeo, stripeMat);
      stripe.rotation.x = -Math.PI / 2;
      stripe.position.set(z * 3.5, 0.02, 0);
      scene.add(stripe);
    }

    // -----------------------------------------------------------
    // BACKGROUND: SRIMANDIR 214-FT TEMPLE HORIZON
    // -----------------------------------------------------------
    const templeBackdropGeo = new THREE.PlaneGeometry(60, 85);
    const templeBackdropMat = new THREE.MeshBasicMaterial({
      map: templeTex,
      transparent: true,
      opacity: 0.92,
      side: THREE.DoubleSide
    });
    const templeBackdrop = new THREE.Mesh(templeBackdropGeo, templeBackdropMat);
    templeBackdrop.position.set(0, 42, -75);
    scene.add(templeBackdrop);

    // -----------------------------------------------------------
    // MAIN CHARIOT ASSEMBLY (Chariot Root Group)
    // -----------------------------------------------------------
    const chariotGroup = new THREE.Group();
    scene.add(chariotGroup);
    chariotRootRef.current = chariotGroup;

    // Master Chariot Dimensions
    const wheelRadius = 2.4; // 7 feet real scale
    const deckHeight = wheelRadius + 0.8;
    const numWheels = currentRatha.wheelsCount;
    const wheelsPerSide = numWheels / 2;
    const chassisLength = 18.0;
    const wheelSpacing = chassisLength / (wheelsPerSide - 1);
    const wheelTrackWidth = 11.6;

    // 1. SCULPTED WHEELS WITH 16 REAL SPOKES & AXLES
    wheelsListRef.current = [];

    // Heavy Timber Cross-Axles (Akha)
    for (let i = 0; i < wheelsPerSide; i++) {
      const axleZ = -chassisLength / 2 + i * wheelSpacing;
      const axleGeo = new THREE.CylinderGeometry(0.3, 0.3, wheelTrackWidth + 1.2, 16);
      const axleMat = new THREE.MeshStandardMaterial({ color: 0x4a2810, roughness: 0.8 });
      const axle = new THREE.Mesh(axleGeo, axleMat);
      axle.rotation.z = Math.PI / 2;
      axle.position.set(0, wheelRadius, axleZ);
      axle.castShadow = true;
      chariotGroup.add(axle);
    }

    // 16 Real Spokes per Wheel
    for (let side = -1; side <= 1; side += 2) {
      for (let i = 0; i < wheelsPerSide; i++) {
        const wheelAssembly = new THREE.Group();
        const axleZ = -chassisLength / 2 + i * wheelSpacing;
        wheelAssembly.position.set(side * (wheelTrackWidth / 2 + 0.3), wheelRadius, axleZ);

        // Central Tumba Hub
        const hubGeo = new THREE.CylinderGeometry(0.72, 0.72, 0.6, 24);
        const hubMat = new THREE.MeshStandardMaterial({
          map: chakaTex,
          color: 0x6e3d1a,
          roughness: 0.7,
          metalness: 0.2
        });
        const hub = new THREE.Mesh(hubGeo, hubMat);
        hub.rotation.z = Math.PI / 2;
        hub.castShadow = true;
        wheelAssembly.add(hub);

        // Iron Axle Pin (Gada)
        const pinGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.9, 12);
        const pinMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, metalness: 0.8, roughness: 0.3 });
        const pin = new THREE.Mesh(pinGeo, pinMat);
        pin.rotation.x = Math.PI / 2;
        wheelAssembly.add(pin);

        // Exactly 16 Radial Carved Wooden Spokes (Ara)
        for (let sp = 0; sp < 16; sp++) {
          const spokeAngle = (sp * Math.PI * 2) / 16;
          const spokeGeo = new THREE.BoxGeometry(0.16, 1.7, 0.22);
          const spokeMat = new THREE.MeshStandardMaterial({
            color: 0x8b4513,
            roughness: 0.8
          });
          const spoke = new THREE.Mesh(spokeGeo, spokeMat);
          spoke.position.set(0, Math.cos(spokeAngle) * 1.35, Math.sin(spokeAngle) * 1.35);
          spoke.rotation.x = -spokeAngle;
          spoke.castShadow = true;
          wheelAssembly.add(spoke);
        }

        // Outer Wooden Rim (Pahi)
        const rimGeo = new THREE.TorusGeometry(wheelRadius - 0.15, 0.24, 16, 36);
        const rimMat = new THREE.MeshStandardMaterial({
          map: chakaTex,
          color: 0x5c3317,
          roughness: 0.75
        });
        const rim = new THREE.Mesh(rimGeo, rimMat);
        rim.rotation.y = Math.PI / 2;
        rim.castShadow = true;
        wheelAssembly.add(rim);

        // Outer Forged Iron Band (Tyre)
        const tyreGeo = new THREE.TorusGeometry(wheelRadius, 0.06, 12, 36);
        const tyreMat = new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.85, roughness: 0.3 });
        const tyre = new THREE.Mesh(tyreGeo, tyreMat);
        tyre.rotation.y = Math.PI / 2;
        wheelAssembly.add(tyre);

        chariotGroup.add(wheelAssembly);
        wheelsListRef.current.push(wheelAssembly);
      }
    }

    // 2. TIMBER UNDERCARRIAGE DECK (Charachara & Pata)
    const deckGeo = new THREE.BoxGeometry(wheelTrackWidth + 0.6, 1.4, chassisLength + 2.0);
    const deckMat = new THREE.MeshStandardMaterial({
      color: 0x542c10,
      roughness: 0.85
    });
    const deck = new THREE.Mesh(deckGeo, deckMat);
    deck.position.set(0, deckHeight, 0);
    deck.castShadow = true;
    deck.receiveShadow = true;
    chariotGroup.add(deck);

    // Front Driver Rostrum (Dahuka & Sarathi Platform)
    const rostrumGeo = new THREE.BoxGeometry(7.0, 1.0, 5.0);
    const rostrum = new THREE.Mesh(rostrumGeo, deckMat);
    rostrum.position.set(0, deckHeight + 0.3, chassisLength / 2 + 2.2);
    rostrum.castShadow = true;
    chariotGroup.add(rostrum);

    // Decorative Red Balustrade Railing around the deck
    const railingMat = new THREE.MeshStandardMaterial({ color: 0xb71c1c, roughness: 0.6 });
    for (const side of [-1, 1]) {
      const railGeo = new THREE.BoxGeometry(0.3, 1.2, chassisLength);
      const rail = new THREE.Mesh(railGeo, railingMat);
      rail.position.set(side * (wheelTrackWidth / 2 + 0.1), deckHeight + 1.2, 0);
      rail.castShadow = true;
      chariotGroup.add(rail);
    }

    // 3. 4 CORNER PILLARS & ORNATE TORANA ARCH
    const pillarHeight = 7.5;
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.7 });
    for (const px of [-4.2, 4.2]) {
      for (const pz of [-6.0, 6.0]) {
        const pGeo = new THREE.CylinderGeometry(0.38, 0.45, pillarHeight, 16);
        const pillar = new THREE.Mesh(pGeo, pillarMat);
        pillar.position.set(px, deckHeight + 0.7 + pillarHeight / 2, pz);
        pillar.castShadow = true;
        chariotGroup.add(pillar);
      }
    }

    // Scalloped Front Torana Arch
    const toranaGeo = new THREE.BoxGeometry(9.0, 1.8, 0.4);
    const toranaMat = new THREE.MeshStandardMaterial({
      color: currentRatha.canopyColors[1],
      roughness: 0.5
    });
    const torana = new THREE.Mesh(toranaGeo, toranaMat);
    torana.position.set(0, deckHeight + 0.7 + pillarHeight - 0.2, 6.0);
    torana.castShadow = true;
    chariotGroup.add(torana);

    // 4. SANCTUM RATNAVEDI & MAHAPRABHU JAGANNATH IDOL
    const altarGeo = new THREE.BoxGeometry(5.2, 1.6, 5.2);
    const altarMat = new THREE.MeshStandardMaterial({ color: 0x800000, roughness: 0.6 });
    const altar = new THREE.Mesh(altarGeo, altarMat);
    altar.position.set(0, deckHeight + 0.7 + 0.8, 0);
    altar.castShadow = true;
    chariotGroup.add(altar);

    // Sculpted Idol Screen of Mahaprabhu Jagannath with Chaka Dola & Tahia
    const idolGeo = new THREE.PlaneGeometry(4.2, 5.4);
    const idolMat = new THREE.MeshStandardMaterial({
      map: deityTex,
      side: THREE.DoubleSide,
      roughness: 0.4
    });
    const idol = new THREE.Mesh(idolGeo, idolMat);
    idol.position.set(0, deckHeight + 0.7 + 1.6 + 2.7, 0.2);
    idol.castShadow = true;
    chariotGroup.add(idol);

    // 5. CURVILINEAR PYRAMIDAL CANOPY (Potola Dome with Pipili Applique)
    const canopyBaseY = deckHeight + 0.7 + pillarHeight;
    const canopyHeight = 14.5;

    // 3 Tiered Concave Pyramidal Applique Roof
    const canopyGeo = new THREE.ConeGeometry(8.6, canopyHeight, 4);
    const canopyMat = new THREE.MeshStandardMaterial({
      map: appliqueTex,
      color: currentRatha.canopyColors[0],
      roughness: 0.5,
      metalness: 0.1
    });
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.set(0, canopyBaseY + canopyHeight / 2, 0);
    canopy.rotation.y = Math.PI / 4;
    canopy.castShadow = true;
    chariotGroup.add(canopy);

    // Hanging Pipili Fringe Tassels (Jhalara)
    const fringeMat = new THREE.MeshStandardMaterial({ color: currentRatha.canopyColors[1] });
    for (let f = 0; f < 28; f++) {
      const angle = (f * Math.PI * 2) / 28;
      const fGeo = new THREE.ConeGeometry(0.12, 0.6, 8);
      const tassel = new THREE.Mesh(fGeo, fringeMat);
      tassel.position.set(Math.cos(angle) * 6.5, canopyBaseY - 0.2, Math.sin(angle) * 6.5);
      tassel.rotation.x = Math.PI;
      chariotGroup.add(tassel);
    }

    // 6. AMALAKA, GOLDEN KALASA FINIAL & WAVING PATITAPABANA FLAG
    // 36-rib Amalaka Stone Wheel
    const amalakaGeo = new THREE.TorusGeometry(1.6, 0.45, 16, 36);
    const amalakaMat = new THREE.MeshStandardMaterial({ color: 0xca8a04, roughness: 0.4, metalness: 0.7 });
    const amalaka = new THREE.Mesh(amalakaGeo, amalakaMat);
    amalaka.position.set(0, canopyBaseY + canopyHeight + 0.4, 0);
    amalaka.rotation.x = Math.PI / 2;
    chariotGroup.add(amalaka);

    // Polished Golden Kalasa
    const kalasaGeo = new THREE.SphereGeometry(1.2, 24, 24);
    const kalasaMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.9,
      roughness: 0.15
    });
    const kalasa = new THREE.Mesh(kalasaGeo, kalasaMat);
    kalasa.position.set(0, canopyBaseY + canopyHeight + 1.8, 0);
    kalasa.castShadow = true;
    chariotGroup.add(kalasa);

    // Mast Pole & Waving Patitapabana Flag
    const mastGeo = new THREE.CylinderGeometry(0.08, 0.1, 4.5, 12);
    const mastMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.6 });
    const mast = new THREE.Mesh(mastGeo, mastMat);
    mast.position.set(0, canopyBaseY + canopyHeight + 3.8, 0);
    chariotGroup.add(mast);

    const flagGeo = new THREE.PlaneGeometry(3.6, 1.8, 12, 6);
    const flagMat = new THREE.MeshStandardMaterial({
      color: 0xe65100,
      side: THREE.DoubleSide,
      roughness: 0.4
    });
    const flagMesh = new THREE.Mesh(flagGeo, flagMat);
    flagMesh.position.set(1.9, canopyBaseY + canopyHeight + 4.8, 0);
    chariotGroup.add(flagMesh);
    flagMeshRef.current = flagMesh;

    // 7. FOUR TROTTING SCULPTED WOODEN HORSES (Aswa)
    const horseMat = new THREE.MeshStandardMaterial({
      color: currentRatha.horseColor,
      roughness: 0.6
    });
    const harnessMat = new THREE.MeshStandardMaterial({ color: 0xb71c1c });

    const horseSpacing = 2.2;
    for (let h = 0; h < 4; h++) {
      const horseGroup = new THREE.Group();
      const hx = (h - 1.5) * horseSpacing;
      horseGroup.position.set(hx, deckHeight + 0.2, chassisLength / 2 + 5.8);

      // Barrel Torso
      const bodyGeo = new THREE.CylinderGeometry(0.55, 0.65, 2.2, 16);
      const body = new THREE.Mesh(bodyGeo, horseMat);
      body.rotation.x = Math.PI / 2;
      body.position.set(0, 1.2, 0);
      body.castShadow = true;
      horseGroup.add(body);

      // Rearing Muscular Chest
      const chestGeo = new THREE.SphereGeometry(0.7, 16, 16);
      const chest = new THREE.Mesh(chestGeo, horseMat);
      chest.position.set(0, 1.35, 1.1);
      horseGroup.add(chest);

      // Arched Neck
      const neckGeo = new THREE.CylinderGeometry(0.35, 0.5, 1.5, 12);
      const neck = new THREE.Mesh(neckGeo, horseMat);
      neck.position.set(0, 2.3, 1.5);
      neck.rotation.x = -Math.PI / 4;
      horseGroup.add(neck);

      // Equine Head
      const headGeo = new THREE.ConeGeometry(0.4, 1.2, 12);
      const head = new THREE.Mesh(headGeo, horseMat);
      head.position.set(0, 2.9, 2.1);
      head.rotation.x = Math.PI / 3;
      horseGroup.add(head);

      // Head Plumage Crest (Chula)
      const crestGeo = new THREE.ConeGeometry(0.2, 0.7, 8);
      const crest = new THREE.Mesh(crestGeo, harnessMat);
      crest.position.set(0, 3.4, 1.8);
      horseGroup.add(crest);

      // 4 Trotting Legs
      for (const lx of [-0.4, 0.4]) {
        for (const lz of [-0.7, 0.8]) {
          const legGeo = new THREE.CylinderGeometry(0.12, 0.1, 1.6, 8);
          const leg = new THREE.Mesh(legGeo, horseMat);
          leg.position.set(lx, 0.4, lz);
          leg.castShadow = true;
          horseGroup.add(leg);
        }
      }

      chariotGroup.add(horseGroup);
    }

    // 8. SACRED PULLING ROPES (Ratha Daudi)
    const curvePointsLeft = [
      new THREE.Vector3(-1.8, deckHeight + 0.2, chassisLength / 2 + 5.0),
      new THREE.Vector3(-2.8, 1.2, chassisLength / 2 + 15.0),
      new THREE.Vector3(-3.8, 0.4, chassisLength / 2 + 32.0)
    ];
    const curvePointsRight = [
      new THREE.Vector3(1.8, deckHeight + 0.2, chassisLength / 2 + 5.0),
      new THREE.Vector3(2.8, 1.2, chassisLength / 2 + 15.0),
      new THREE.Vector3(3.8, 0.4, chassisLength / 2 + 32.0)
    ];

    [curvePointsLeft, curvePointsRight].forEach((pts) => {
      const curve = new THREE.CatmullRomCurve3(pts);
      const ropeGeo = new THREE.TubeGeometry(curve, 32, 0.18, 8, false);
      const ropeMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.9 });
      const rope = new THREE.Mesh(ropeGeo, ropeMat);
      rope.castShadow = true;
      chariotGroup.add(rope);
      ropesMeshRef.current = rope;
    });

    // -----------------------------------------------------------
    // ANIMATION LOOP (Live 4D Kinematics & Physics)
    // -----------------------------------------------------------
    let lastTime = performance.now();
    const animate = () => {
      reqAnimRef.current = requestAnimationFrame(animate);
      const currentTime = performance.now();
      const delta = (currentTime - lastTime) * 0.001;
      lastTime = currentTime;

      // Rotate all 16 wheels realistically when rolling
      if (isRollingRef.current) {
        wheelsListRef.current.forEach((w) => {
          w.rotation.x += delta * 1.8;
        });

        // Gentle physical heave & pitch vibration on timber axles
        if (chariotRootRef.current) {
          chariotRootRef.current.position.y = Math.sin(currentTime * 0.008) * 0.08;
          chariotRootRef.current.rotation.z = Math.sin(currentTime * 0.004) * 0.005;
        }
      }

      // Waving Patitapabana Flag vertex oscillation
      if (flagMeshRef.current) {
        const flag = flagMeshRef.current;
        const pos = flag.geometry.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i);
          const wave = Math.sin(currentTime * 0.008 + x * 2.0) * 0.25 * (x / 3.6);
          pos.setZ(i, wave);
        }
        pos.needsUpdate = true;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Window Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup on unmount or re-render
    return () => {
      window.removeEventListener('resize', handleResize);
      if (reqAnimRef.current) cancelAnimationFrame(reqAnimRef.current);
      controls.dispose();

      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else if (mesh.material) {
            mesh.material.dispose();
          }
        }
      });
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [activeChariotId, timeOfDay]);

  return (
    <div className="relative w-full h-[640px] bg-slate-950 rounded-3xl overflow-hidden border-2 border-amber-500/40 shadow-2xl flex flex-col font-sans select-none">
      {/* Top Header Bar */}
      <div className="relative z-30 flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-slate-950/95 backdrop-blur-xl border-b border-amber-500/30">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-black text-amber-300 tracking-wide flex items-center gap-2">
              <span>ପୁରୀ ରଥଯାତ୍ରା ପ୍ରତ୍ୟକ୍ଷ ୪D ଲାଇଭ୍ ସ୍ଥାପତ୍ୟ</span>
              <span className="px-2 py-0.5 rounded-full bg-red-600 text-[9px] font-black text-white uppercase tracking-wider animate-pulse flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                ୪D LIVE 360°
              </span>
            </h3>
            <p className="text-[10px] text-slate-400">
              {dayInfo.odiaSolarMonth.nameOr} {dayInfo.odiaSolarDay} • {currentRatha.nameOr}
            </p>
          </div>
        </div>

        {/* Action Controls (Procession Toggle, Time of Day & Puspabristi) */}
        <div className="flex items-center gap-2">
          {/* Chariot Rolling Motion Toggle */}
          <button
            onClick={() => setIsRolling(!isRolling)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md ${
              isRolling
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-500/20'
                : 'bg-white/10 text-slate-300 hover:bg-white/15'
            }`}
            title="ରଥ ଚଳନ କିନେମାଟିକ୍ସ"
          >
            {isRolling ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isRolling ? 'ରଥ ଗତିଶୀଳ (ଚାଲୁ)' : 'ରଥ ସ୍ଥିର (ରହିଛି)'}</span>
          </button>

          {/* Time of Day Switcher */}
          <div className="flex bg-black/60 p-0.5 rounded-xl border border-white/10">
            {[
              { id: 'dawn', icon: Sunrise, label: 'ପାହାନ୍ତି' },
              { id: 'noon', icon: Sun, label: 'ମଧ୍ୟାହ୍ନ' },
              { id: 'dusk', icon: Sunset, label: 'ସନ୍ଧ୍ୟା' },
              { id: 'night', icon: Moon, label: 'ରାତ୍ରି' }
            ].map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTimeOfDay(t.id as TimeOfDay)}
                  className={`p-1.5 rounded-lg text-xs transition-all ${
                    timeOfDay === t.id
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title={t.label}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              );
            })}
          </div>

          {/* Flower Shower Toggle */}
          <button
            onClick={() => setIsFlowerShower(!isFlowerShower)}
            className={`p-2 rounded-xl transition-all ${
              isFlowerShower ? 'bg-pink-500/20 text-pink-400 border border-pink-500/40' : 'bg-white/5 text-slate-400'
            }`}
            title="ପୁଷ୍ପବୃଷ୍ଟି (Flower Shower)"
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>
      </div>

      {/* Chariots Selector Tab Bar */}
      <div className="relative z-20 flex items-center gap-1.5 px-3 py-2 bg-slate-900/90 backdrop-blur-md border-b border-white/5 overflow-x-auto scrollbar-none">
        {CHARIOTS.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setActiveChariotId(c.id);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
              activeChariotId === c.id
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 font-black scale-102'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span>{c.id === 'nandighosha' ? '🚩' : c.id === 'taladhwaja' ? '🌿' : '🌸'}</span>
            <span>{language === 'hi' ? c.nameHi : language === 'en' ? c.nameEn : c.nameOr}</span>
            <span className="text-[10px] opacity-80">({c.wheelsCount} ଚକ)</span>
          </button>
        ))}
      </div>

      {/* Center 3D WebGL Canvas Viewport */}
      <div className="relative flex-1 w-full h-full overflow-hidden bg-black flex items-center justify-center">
        {/* Three.js Canvas Container */}
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Live Flower Petals Shower (4D Puspabristi) */}
        {isFlowerShower && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
            {[...Array(24)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full opacity-80"
                style={{
                  width: `${6 + (i % 6) * 2}px`,
                  height: `${10 + (i % 5) * 3}px`,
                  backgroundColor: i % 3 === 0 ? '#ffb300' : i % 3 === 1 ? '#ff5722' : '#f06292',
                  left: `${(i * 4.2) % 100}%`,
                  top: '-20px',
                  animation: `fallPetal ${4 + (i % 5)}s linear infinite`,
                  animationDelay: `${(i * 0.3) % 4}s`,
                  transform: `rotate(${i * 35}deg)`
                }}
              />
            ))}
          </div>
        )}

        {/* Camera Quick-Focus Preset Bar (Top Right) */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-1 p-1 bg-slate-950/90 backdrop-blur-md rounded-2xl border border-white/15 shadow-xl pointer-events-auto">
          <div className="text-[9px] font-bold text-slate-400 px-2 pt-1 text-center">
            କ୍ୟାମେରା ଫୋକସ୍
          </div>
          {CAMERA_PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => applyCameraPreset(p)}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all text-left ${
                cameraPresetId === p.id
                  ? 'bg-amber-500 text-slate-950 font-black'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {p.nameOr}
            </button>
          ))}
        </div>

        {/* Live Distance Telemetry Pill (Top Left) */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2 px-3 py-1.5 bg-slate-950/90 backdrop-blur-md rounded-full border border-amber-500/30 text-[11px] shadow-xl pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300">ବଡ଼ଦାଣ୍ଡ ଅଗ୍ରଗତି:</span>
          <span className="font-mono font-bold text-amber-300">{distanceMeters} ମିଟର</span>
          <span className="text-slate-400 text-[9px]">| ଶ୍ରୀଗୁଣ୍ଡିଚା ଅଭିମୁଖେ</span>
        </div>

        {/* Floating Bottom Left Telemetry HUD */}
        <div className="absolute bottom-3 left-3 z-20 max-w-sm md:max-w-md p-3.5 bg-slate-950/92 backdrop-blur-2xl rounded-2xl border border-amber-500/50 shadow-2xl text-xs pointer-events-auto">
          <div className="flex items-center justify-between mb-1.5">
            <h4 className="font-black text-amber-300 text-sm flex items-center gap-1.5">
              <Flag className="w-4 h-4 text-amber-400" />
              <span>{currentRatha.nameOr}</span>
            </h4>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
              {currentRatha.wheelsCount} ଚକ • {currentRatha.axlesCount} ଅଖ
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-2 text-[11px] text-slate-300">
            <span className="px-2 py-0.5 rounded-md bg-white/10 text-amber-200 font-semibold">
              ବିଜେ: {currentRatha.deityOr}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-300 font-medium">ଉଚ୍ଚତା: {currentRatha.heightFt} ଫୁଟ୍</span>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
            {currentRatha.descriptionOr}
          </p>

          <button
            onClick={() => setShowInfoModal(true)}
            className="mt-2 text-[10px] text-amber-400 font-bold hover:underline flex items-center gap-1"
          >
            <Info className="w-3 h-3" />
            <span>ଶିଳ୍ପଶାସ୍ତ୍ର ଓ ସମ୍ପୂର୍ଣ୍ଣ ବିବରଣୀ ପଢ଼ନ୍ତୁ</span>
          </button>
        </div>

        {/* Full Specifications Overlay Modal */}
        {showInfoModal && (
          <div className="absolute inset-4 z-40 bg-slate-950/98 backdrop-blur-3xl border-2 border-amber-500/70 rounded-3xl p-6 overflow-y-auto text-xs shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black">
                  ☸️
                </div>
                <div>
                  <h3 className="font-black text-amber-300 text-base">
                    {currentRatha.nameOr} — ଶିଳ୍ପଶାସ୍ତ୍ର ଓ ଆଧ୍ୟାତ୍ମିକ ସ୍ଥାପତ୍ୟ
                  </h3>
                  <p className="text-slate-400 text-[11px]">
                    {currentRatha.wheelsCount} ଚକ • {currentRatha.axlesCount} ଅଖ • {currentRatha.logsCount} ଖଣ୍ଡ ପବିତ୍ର କାଠ
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
              >
                ✕ ବନ୍ଦ କରନ୍ତୁ
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-200 text-xs">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                <div className="font-bold text-amber-300 text-sm">ପ୍ରମୁଖ ପରିଚୟ ଓ ତଥ୍ୟ:</div>
                <p className="leading-relaxed text-[11px]">{currentRatha.descriptionOr}</p>
                <div className="pt-2">
                  <span className="text-amber-400 font-bold block mb-1">ବିଜେ ଠାକୁର:</span>
                  <p>{currentRatha.deityOr}</p>
                </div>
                <div className="pt-2">
                  <span className="text-amber-400 font-bold block mb-1">ସାରଥି ଓ ରଥ ଦଉଡ଼ି:</span>
                  <p>ସାରଥି: {currentRatha.sarathiOr} • ଦଉଡ଼ି: {currentRatha.ropeOr}</p>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                <div className="font-bold text-amber-300 text-sm">୪ ଦିବ୍ୟ ଅଶ୍ୱ (ଘୋଡ଼ା):</div>
                <div className="grid grid-cols-2 gap-2 text-[11px] mt-2">
                  {currentRatha.horsesOr.map((h, i) => (
                    <div key={i} className="p-2 bg-black/60 rounded-xl border border-white/10 text-amber-200 font-bold text-center">
                      🐎 {h}
                    </div>
                  ))}
                </div>
                <div className="pt-3">
                  <span className="text-amber-400 font-bold block mb-1">ରଥ ପତାକା (ଧ୍ୱଜ):</span>
                  <p>{currentRatha.flagNameOr}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 360° Drag Hint */}
        <div className="absolute bottom-3 right-3 z-20 pointer-events-none text-right">
          <span className="px-3 py-1.5 bg-black/85 backdrop-blur-md rounded-full text-[10px] text-amber-300 font-bold border border-amber-500/40 shadow-xl">
            ୩୬୦° ଘୂରାଇବାକୁ ଟାଣନ୍ତୁ • ଜୁମ୍ ପାଇଁ ସ୍କ୍ରୋଲ କରନ୍ତୁ
          </span>
        </div>
      </div>

      {/* Global CSS for Falling Petals */}
      <style>{`
        @keyframes fallPetal {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(660px) rotate(360deg);
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
};
