import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

const MOUNT_POS: Record<string, [number, number, number]> = {
  guru: [-0.55, 0.42, 0.18],
  shani: [-0.18, 0.5, 0.2],
  surya: [0.18, 0.46, 0.17],
  budha: [0.55, 0.4, 0.15],
  mangalPos: [0, 0.05, 0.22],
  mangalNeg: [-0.4, -0.25, 0.12],
  chandra: [0.62, -0.35, 0.08],
  shukra: [-0.62, -0.3, 0.14],
  ketuRahu: [0, -0.6, 0.05],
};

const MOUNT_COLORS: Record<string, string> = {
  guru: '#ffd700',
  shani: '#4fc3f7',
  surya: '#ffab40',
  budha: '#a5d6a7',
  mangalPos: '#ef5350',
  mangalNeg: '#ffab40',
  chandra: '#ce93d8',
  shukra: '#f48fb1',
  ketuRahu: '#90a4ae',
};

const REKHA_COORDS: Record<string, { p1: [number, number, number]; p2: [number, number, number] }> = {
  hridaya: { p1: [-0.5, -0.15, 0.2], p2: [0.5, -0.1, 0.2] },
  buddhi: { p1: [-0.35, 0.05, 0.22], p2: [0.35, 0.0, 0.22] },
  ayu: { p1: [-0.6, -0.35, 0.15], p2: [-0.35, -0.75, 0.15] },
  bhagya: { p1: [0.05, 0.4, 0.18], p2: [0.05, -0.6, 0.18] },
  surya: { p1: [0.3, 0.1, 0.17], p2: [0.42, -0.55, 0.17] },
  vivaha: { p1: [0.5, -0.1, 0.14], p2: [0.7, -0.25, 0.14] },
  swasthya: { p1: [-0.25, -0.45, 0.12], p2: [-0.1, -0.7, 0.12] },
};

export function usePalmCamera(videoRef: React.RefObject<HTMLVideoElement>, lang?: string) {
  const [on, setOn] = useState(false);
  const [err, setErr] = useState('');
  const start = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      const v = videoRef.current;
      if (!v) return;
      v.srcObject = s;
      await v.play();
      setOn(true);
      setErr('');
    } catch {
      setErr(
        lang === 'or'
          ? 'କ୍ୟାମେରା ବନ୍ଦ — ଫଟୋ ଆପଲୋଡ୍ ବ୍ୟବହାର କରନ୍ତୁ।'
          : lang === 'hi'
          ? 'कैमरा बंद — फोटो अपलोड उपयोग करें।'
          : 'Camera blocked — use photo upload.'
      );
    }
  };
  const stop = () => {
    const v = videoRef.current as HTMLVideoElement | null;
    const s = v?.srcObject as MediaStream | undefined;
    s?.getTracks().forEach((t) => t.stop());
    if (v) v.srcObject = null;
    setOn(false);
  };
  return { on, err, start, stop };
}

interface Palm3DProps {
  mounts: Record<string, { level: string }>;
  lines: Record<string, { conf: number; visible: string }>;
  scanning: boolean;
}

const lineColor = (key: string, lines: Record<string, { conf: number; visible: string }>) => {
  const d = lines[key];
  if (!d) return '#555555';
  if (d.visible === 'broken') return '#ef5350';
  if (d.visible === 'faint') return '#ffb74d';
  if (d.conf > 0.6) return '#4caf50';
  return '#90caf9';
};

export const Palm3D: React.FC<Palm3DProps> = ({ mounts, lines, scanning }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Store live props in refs so the animation loop can access them without re-creating scene
  const mountsRef = useRef(mounts);
  mountsRef.current = mounts;
  const linesRef = useRef(lines);
  linesRef.current = lines;
  const scanningRef = useRef(scanning);
  scanningRef.current = scanning;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let width = container.clientWidth || 400;
    let height = container.clientHeight || 400;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050510, 0.08);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 3.2);

    // 2. Renderer
    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    } catch (e) {
      console.warn('WebGL init failed:', e);
      return;
    }

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const lightGold = new THREE.PointLight(0xffd700, 1.4, 20);
    lightGold.position.set(2, 4, 3);
    scene.add(lightGold);

    const lightCyan = new THREE.PointLight(0x4fc3f7, 1.0, 20);
    lightCyan.position.set(-2, -2, 3);
    scene.add(lightCyan);

    // 4. Background Stars
    const starCount = 120;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 15;
      starPositions[i + 1] = (Math.random() - 0.5) * 15;
      starPositions[i + 2] = -2 - Math.random() * 8;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffd700, size: 0.04, transparent: true, opacity: 0.7 });
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);

    // 5. Main Hand Group
    const handGroup = new THREE.Group();
    scene.add(handGroup);

    // Palm base cylinder
    const palmGeo = new THREE.CylinderGeometry(1.05, 0.75, 0.5, 32);
    const palmMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      roughness: 0.7,
      metalness: 0.25,
    });
    const palmMesh = new THREE.Mesh(palmGeo, palmMat);
    palmMesh.position.set(0, -0.35, 0);
    palmMesh.rotation.x = Math.PI / 2;
    handGroup.add(palmMesh);

    // Fingers helper
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xe0c9b8, roughness: 0.6, metalness: 0.1 });
    const tipMat = new THREE.MeshStandardMaterial({ color: 0xf5deb3, roughness: 0.5, metalness: 0.1 });

    const createFinger = (dir: [number, number, number], tip: [number, number, number]) => {
      const fGroup = new THREE.Group();
      const cylGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.85, 8);
      const cylMesh = new THREE.Mesh(cylGeo, skinMat);
      cylMesh.position.set(dir[0] * 0.55, dir[1] * 0.55 + 0.35, dir[2] * 0.55);
      fGroup.add(cylMesh);

      const sphGeo = new THREE.SphereGeometry(0.05, 8, 8);
      const sphMesh = new THREE.Mesh(sphGeo, tipMat);
      sphMesh.position.set(tip[0] * 0.75, tip[1] * 0.75 + 0.42, tip[2] * 0.75);
      fGroup.add(sphMesh);
      return fGroup;
    };

    handGroup.add(createFinger([-0.6, 1, 0], [-0.85, 1.5, 0]));
    handGroup.add(createFinger([-0.3, 1, 0], [-0.45, 1.6, 0]));
    handGroup.add(createFinger([0, 1, 0], [0, 1.75, 0]));
    handGroup.add(createFinger([0.3, 1, 0], [0.45, 1.6, 0]));
    handGroup.add(createFinger([0.6, 1, 0], [0.85, 1.5, 0]));

    // Angled Thumb
    const thumbGroup = new THREE.Group();
    thumbGroup.position.set(-0.75, 0.15, 0.1);
    thumbGroup.rotation.z = -0.3;
    const thumbCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.6, 8), skinMat);
    const thumbTip = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), tipMat);
    thumbTip.position.set(0, 0.45, 0);
    thumbGroup.add(thumbCyl);
    thumbGroup.add(thumbTip);
    handGroup.add(thumbGroup);

    // Mount Spheres
    const mountMeshes: { key: string; mesh: THREE.Mesh; mat: THREE.MeshStandardMaterial; baseScale: number }[] = [];
    Object.entries(MOUNT_POS).forEach(([key, pos]) => {
      const color = MOUNT_COLORS[key] || '#ffd700';
      const mGeo = new THREE.SphereGeometry(0.07, 16, 16);
      const mMat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.35,
        roughness: 0.2,
        metalness: 0.4,
      });
      const mMesh = new THREE.Mesh(mGeo, mMat);
      mMesh.position.set(...pos);
      handGroup.add(mMesh);
      mountMeshes.push({ key, mesh: mMesh, mat: mMat, baseScale: 1 });
    });

    // Rekha Lines
    const lineMeshes: { key: string; line: THREE.Line; mat: THREE.LineBasicMaterial }[] = [];
    Object.entries(REKHA_COORDS).forEach(([key, { p1, p2 }]) => {
      const color = lineColor(key, linesRef.current);
      const lGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(...p1),
        new THREE.Vector3(...p2),
      ]);
      const lMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity: 0.75,
        linewidth: 2,
      });
      const lMesh = new THREE.Line(lGeo, lMat);
      handGroup.add(lMesh);
      lineMeshes.push({ key, line: lMesh, mat: lMat });
    });

    // Scanning Ring
    const scanRingGeo = new THREE.RingGeometry(0.85, 1.15, 64);
    const scanRingMat = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
    });
    const scanRing = new THREE.Mesh(scanRingGeo, scanRingMat);
    scanRing.position.set(0, 0, 0.25);
    scanRing.rotation.x = Math.PI / 2;
    handGroup.add(scanRing);

    // 6. Interactive Drag & Zoom Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const dx = clientX - prevMouseX;
      const dy = clientY - prevMouseY;
      prevMouseX = clientX;
      prevMouseY = clientY;

      handGroup.rotation.y += dx * 0.008;
      handGroup.rotation.x += dy * 0.008;
      // Clamp x rotation so hand doesn't flip completely upside down
      handGroup.rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, handGroup.rotation.x));
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.max(1.8, Math.min(5.5, camera.position.z + e.deltaY * 0.002));
    };

    canvas.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    canvas.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });

    // 7. Animation Loop
    let animId = 0;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Gentle floating breathing effect when not actively dragging
      if (!isDragging) {
        handGroup.position.y = Math.sin(elapsed * 1.5) * 0.04;
        handGroup.rotation.y += 0.002;
      }

      // Update mount nodes
      const currentMounts = mountsRef.current;
      mountMeshes.forEach(({ key, mesh, mat }) => {
        const m = currentMounts[key];
        const level = m?.level || 'normal';
        const isRaised = level === 'raised';
        const isDepressed = level === 'depressed';
        const baseScale = isRaised ? 1.25 : isDepressed ? 0.75 : 1.0;
        const pulse = 1 + Math.sin(elapsed * 3 + mesh.position.x) * 0.08;
        mesh.scale.setScalar(baseScale * pulse);
        mat.emissiveIntensity = isRaised ? 0.7 + Math.sin(elapsed * 4) * 0.2 : 0.3;
      });

      // Update rekha lines
      const currentLines = linesRef.current;
      lineMeshes.forEach(({ key, mat }) => {
        const c = lineColor(key, currentLines);
        mat.color.set(c);
        const active = currentLines[key]?.visible === 'clear';
        mat.opacity = active ? 0.7 + Math.sin(elapsed * 2.5) * 0.25 : 0.4;
      });

      // Update scanning ring
      const isScanning = scanningRef.current;
      scanRing.visible = isScanning;
      if (isScanning) {
        scanRing.rotation.z += 0.04;
        scanRingMat.opacity = 0.5 + Math.sin(elapsed * 8) * 0.3;
        scanRing.scale.setScalar(1 + Math.sin(elapsed * 4) * 0.1);
      }

      renderer?.render(scene, camera);
    };

    animate();

    // 8. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer?.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    // 9. Cleanup
    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();

      canvas.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      canvas.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      canvas.removeEventListener('wheel', onWheel);

      renderer?.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[320px] sm:h-[400px] rounded-3xl overflow-hidden bg-gradient-to-b from-cosmic-950 via-slate-950 to-cosmic-900 border border-cosmic-gold/20 shadow-2xl flex items-center justify-center select-none"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing block touch-none"
      />
      <div className="absolute bottom-3 left-4 text-[10px] sm:text-xs text-cosmic-gold/70 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-cosmic-gold/20 pointer-events-none flex items-center gap-1.5">
        <span>🖐️ ୩D ହାତ ମଡେଲ୍ (ମାଉସ୍/ସ୍ପର୍ଶ ଦ୍ୱାରା ଘୁରାନ୍ତୁ • Zoom କରନ୍ତୁ)</span>
      </div>
    </div>
  );
};

export const PalmHero3D = Palm3D;
export default Palm3D;
