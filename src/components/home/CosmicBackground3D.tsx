// ============================================================================
//  COSMIC 3D BACKGROUND — world-class immersive sky for the front page
//  Pure CSS/SVG: twinkling stars, orbiting grahas, floating mandala glow,
//  drifting clouds of nebula light. Zero dependencies, GPU-cheap.
// ============================================================================
import React, { useMemo } from 'react';

interface Star { left: number; top: number; size: number; delay: number; dur: number; }

export const CosmicBackground3D: React.FC = () => {
  const stars = useMemo<Star[]>(() => {
    const arr: Star[] = [];
    let seed = 42;
    const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
    for (let i = 0; i < 90; i++) {
      arr.push({
        left: rnd() * 100, top: rnd() * 100,
        size: rnd() < 0.85 ? 1 + rnd() * 1.5 : 2 + rnd() * 2,
        delay: rnd() * 6, dur: 2.5 + rnd() * 4,
      });
    }
    return arr;
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* deep space base */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-20%,#1a1440_0%,#060714_55%,#02030a_100%)]" />

      {/* twinkling stars */}
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white animate-cosmic-twinkle"
          style={{
            left: `${s.left}%`, top: `${s.top}%`,
            width: s.size, height: s.size,
            animationDelay: `${s.delay}s`, animationDuration: `${s.dur}s`,
            boxShadow: s.size > 2 ? '0 0 6px 1px rgba(255,215,0,0.7)' : '0 0 3px rgba(180,200,255,0.8)',
          }}
        />
      ))}

      {/* nebula washes */}
      <div className="absolute -top-32 -left-32 w-[30rem] h-[30rem] rounded-full bg-fuchsia-700/15 blur-[110px] animate-cosmic-drift" />
      <div className="absolute top-1/3 -right-32 w-[28rem] h-[28rem] rounded-full bg-amber-500/12 blur-[110px] animate-cosmic-drift-slow" />
      <div className="absolute -bottom-40 left-1/4 w-[32rem] h-[32rem] rounded-full bg-indigo-700/15 blur-[120px] animate-cosmic-drift" />

      {/* giant rotating mandala aura behind content */}
      <div className="absolute left-1/2 top-[-26rem] -translate-x-1/2 w-[52rem] h-[52rem] opacity-[0.16] animate-spin-slower">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="96" fill="none" stroke="#FFD700" strokeWidth="0.6" strokeDasharray="4 6" />
          <circle cx="100" cy="100" r="78" fill="none" stroke="#FF6F00" strokeWidth="0.5" strokeDasharray="2 5" />
          <circle cx="100" cy="100" r="60" fill="none" stroke="#A855F7" strokeWidth="0.5" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * Math.PI) / 6;
            return (
              <line key={i}
                x1={100 + 60 * Math.cos(a)} y1={100 + 60 * Math.sin(a)}
                x2={100 + 96 * Math.cos(a)} y2={100 + 96 * Math.sin(a)}
                stroke="#FFD700" strokeWidth="0.4" opacity="0.7" />
            );
          })}
        </svg>
      </div>

      {/* orbiting graha dots */}
      <div className="absolute left-1/2 top-[-26rem] -translate-x-1/2 w-[52rem] h-[52rem] animate-spin-slower">
        <span className="absolute left-1/2 top-[6%] w-2.5 h-2.5 -ml-1 rounded-full bg-amber-300 shadow-[0_0_12px_4px_rgba(251,191,36,0.6)]" />
        <span className="absolute left-[88%] top-1/2 w-2 h-2 rounded-full bg-sky-300 shadow-[0_0_10px_3px_rgba(56,189,248,0.6)]" />
      </div>

      {/* horizon glow */}
      <div className="absolute bottom-0 inset-x-0 h-56 bg-[radial-gradient(ellipse_at_50%_120%,rgba(255,111,0,0.16),transparent_70%)]" />
    </div>
  );
};
