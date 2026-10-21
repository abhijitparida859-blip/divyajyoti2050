import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { BreathPhaseKind } from '../../core/meditation/sadhanaCatalog';

interface Props {
  phase: BreathPhaseKind;
  progress: number;
  running: boolean;
}

/** Breath-reactive 3D mandala orb (SSR-safe: canvas only mounts in browser). */
export const BreathOrb3D: React.FC<Props> = ({ phase, progress, running }) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const progressRef = useRef(progress);
  progressRef.current = progress;
  const runningRef = useRef(running);
  runningRef.current = running;

  useEffect(() => {
    const host = hostRef.current;
    if (!host || typeof window === 'undefined') return;
    let renderer: THREE.WebGLRenderer | null = null;
    let raf = 0;
    let ro: ResizeObserver | null = null;
    let group: THREE.Group | null = null;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      const w0 = host.clientWidth || 300;
      const h0 = host.clientHeight || 300;
      renderer.setSize(w0, h0, false);
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.display = 'block';
      host.appendChild(renderer.domElement);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, w0 / h0, 0.1, 50);
      camera.position.set(0, 0, 5);
      group = new THREE.Group();
      scene.add(group);
      const core = new THREE.Mesh(
        new THREE.SphereGeometry(0.85, 48, 48),
        new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0x8a6d00, emissiveIntensity: 0.55, roughness: 0.35, metalness: 0.15, transparent: true, opacity: 0.92 })
      );
      group.add(core);
      const shell = new THREE.Mesh(
        new THREE.SphereGeometry(1.25, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.22 })
      );
      group.add(shell);
      const ringGeo = new THREE.TorusGeometry(1.62, 0.02, 12, 96);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.65 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2.4;
      group.add(ring);
      scene.add(new THREE.AmbientLight(0x33405c, 0.9));
      const key = new THREE.DirectionalLight(0xfff2cc, 2.2);
      key.position.set(2.5, 2, 4);
      scene.add(key);
      const rim = new THREE.PointLight(0x38bdf8, 18, 20);
      rim.position.set(-3, -1.5, 2.5);
      scene.add(rim);
      const clock = new THREE.Clock();
      const render = () => {
        raf = requestAnimationFrame(render);
        if (!group) return;
        const t = clock.getElapsedTime();
        const ph = phaseRef.current;
        const pr = progressRef.current;
        const run = runningRef.current;
        const target = !run ? 1 : ph === 'inhale' ? 1 + pr * 0.34 : ph === 'exhale' ? 1.34 - pr * 0.34 : ph === 'hold' || ph === 'holdEmpty' ? 1.34 : 1;
        const s = group.scale.x + (target - group.scale.x) * 0.08;
        group.scale.setScalar(s);
        group.rotation.y += run ? 0.0035 : 0.0012;
        ring.rotation.z += 0.004;
        (core.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.45 + Math.sin(t * (ph === 'hold' || ph === 'holdEmpty' ? 5 : 2.2)) * 0.18;
        shell.rotation.x = t * 0.12;
        shell.rotation.y = t * 0.18;
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
    } catch {
      setFailed(true);
    }
    return () => {
      cancelAnimationFrame(raf);
      if (ro) ro.disconnect();
      if (group) {
        group.traverse((o) => {
          const m = o as THREE.Mesh;
          if (m.geometry) m.geometry.dispose();
          const mat = m.material as THREE.Material | THREE.Material[] | undefined;
          if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
          else if (mat) mat.dispose();
        });
      }
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement.parentElement === host) host.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={hostRef} className="relative h-[300px] w-full sm:h-[340px]">
      {failed && (
        <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_50%_40%,rgba(255,215,0,0.5),rgba(56,189,248,0.18)_55%,transparent_75%)] blur-[1px]" />
      )}
    </div>
  );
};
