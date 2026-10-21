import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/** Karma Chakra — 3D completion mandala. Gold arc fill = completion fraction,
 *  12 orbiting orbs = rashi wheel, ember core. SSR-safe with glow fallback. */
export const KarmaChakra3D: React.FC<{ progress: number; pulse?: boolean }> = ({ progress, pulse }) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const progressRef = useRef(progress);
  progressRef.current = progress;
  const pulseRef = useRef(!!pulse);
  pulseRef.current = !!pulse;

  useEffect(() => {
    const host = hostRef.current;
    if (!host || typeof window === 'undefined') return;
    let renderer: THREE.WebGLRenderer | null = null;
    let raf = 0;
    let ro: ResizeObserver | null = null;
    let group: THREE.Group | null = null;
    const disposables: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const track = (g: THREE.BufferGeometry) => { disposables.push(g); return g; };
    const trackMat = <M extends THREE.Material>(m: M): M => { materials.push(m); return m; };
    let arc: THREE.Mesh | null = null;
    let core: THREE.Mesh | null = null;
    let shell: THREE.Mesh | null = null;
    let orbs: THREE.Mesh[] = [];
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      const w0 = host.clientWidth || 220;
      const h0 = host.clientHeight || 220;
      renderer.setSize(w0, h0, false);
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.display = 'block';
      host.appendChild(renderer.domElement);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, w0 / h0, 0.1, 50);
      camera.position.set(0, 0, 6.2);
      group = new THREE.Group();
      scene.add(group);
      // Completion arc — torus sweep rebuilt as progress changes
      arc = new THREE.Mesh(
        track(new THREE.TorusGeometry(1.7, 0.09, 12, 96, Math.max(0.02, progressRef.current * Math.PI * 2))),
        trackMat(new THREE.MeshBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.95 }))
      );
      group.add(arc);
      // Faint full-circle track behind the arc
      const trackRing = new THREE.Mesh(
        track(new THREE.TorusGeometry(1.7, 0.02, 8, 96)),
        trackMat(new THREE.MeshBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.14 }))
      );
      group.add(trackRing);
      // 12 rashi orbs on the wheel
      const orbGeo = track(new THREE.SphereGeometry(0.07, 12, 12));
      for (let i = 0; i < 12; i++) {
        const orb = new THREE.Mesh(
          orbGeo,
          trackMat(new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85 }))
        );
        group.add(orb);
        orbs.push(orb);
      }
      // Ember core — completion glows through opacity
      core = new THREE.Mesh(
        track(new THREE.SphereGeometry(0.55, 32, 32)),
        trackMat(new THREE.MeshStandardMaterial({ color: 0xff6f00, emissive: 0xcc4400, emissiveIntensity: 0.8, roughness: 0.4, metalness: 0.2, transparent: true, opacity: 0.9 }))
      );
      group.add(core);
      // Inner wire shell
      shell = new THREE.Mesh(
        track(new THREE.SphereGeometry(0.95, 20, 20)),
        trackMat(new THREE.MeshBasicMaterial({ color: 0xa855f7, wireframe: true, transparent: true, opacity: 0.2 }))
      );
      group.add(shell);
      scene.add(new THREE.AmbientLight(0x33405c, 1.0));
      const key = new THREE.DirectionalLight(0xfff2cc, 2.0);
      key.position.set(2.5, 2, 4);
      scene.add(key);
      const clock = new THREE.Clock();
      const tmp = new THREE.Vector3();
      const arcMesh = arc;
      const coreMesh = core;
      const shellMesh = shell;
      const orbMeshes = orbs;
      const render = () => {
        raf = requestAnimationFrame(render);
        if (!group) return;
        const t = clock.getElapsedTime();
        const p = Math.max(0, Math.min(1, progressRef.current));
        const beat = pulseRef.current ? 1 + Math.sin(t * 6) * 0.02 : 1;
        group.scale.setScalar(beat);
        group.rotation.z += 0.0016;
        // Rebuild arc sweep only when it changed materially
        const want = Math.max(0.02, p * Math.PI * 2);
        const arcGeo = arcMesh.geometry as THREE.TorusGeometry;
        const cur = (arcGeo.parameters as { arc?: number }).arc ?? 0;
        if (Math.abs(cur - want) > 0.01) {
          const old = arcMesh.geometry;
          arcMesh.geometry = new THREE.TorusGeometry(1.7, 0.09, 12, 96, want);
          old.dispose();
        }
        (arcMesh.material as THREE.MeshBasicMaterial).opacity = 0.55 + p * 0.45;
        for (let i = 0; i < 12; i++) {
          const a = (i / 12) * Math.PI * 2 + t * 0.12;
          tmp.set(Math.cos(a) * 2.15, Math.sin(a) * 2.15, 0);
          orbMeshes[i].position.copy(tmp);
          const lit = (i / 12) <= p;
          (orbMeshes[i].material as THREE.MeshBasicMaterial).color.setHex(lit ? 0xffd700 : 0x38bdf8);
        }
        (coreMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5 + p * 1.1 + Math.sin(t * 2.4) * 0.15;
        shellMesh.rotation.x = t * 0.15;
        shellMesh.rotation.y = t * 0.22;
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
      disposables.forEach(g => g.dispose());
      materials.forEach(m => m.dispose());
      // Current arc sweep geometry is rebuilt on the fly, so dispose it directly.
      if (arc) arc.geometry.dispose();
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement.parentElement === host) host.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={hostRef} className="relative h-[190px] w-full sm:h-[220px]">
      {failed && (
        <div className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_50%_40%,rgba(255,215,0,0.5),rgba(56,189,248,0.18)_55%,transparent_75%)] blur-[1px]" />
      )}
    </div>
  );
};

