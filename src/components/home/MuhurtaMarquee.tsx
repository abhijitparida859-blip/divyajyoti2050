// ============================================================================
//  AAJ KA MUHURTA MARQUEE — live scrolling strip of today's key timings
//  Abhijit • Rahu Kaal • Amrita • Brahma Muhurta — always visible.
// ============================================================================
import React from 'react';

interface Item { emoji: string; label: string; time: string; good: boolean; }

export const MuhurtaMarquee: React.FC<{
  items: Item[];
  title: string;
}> = ({ items, title }) => {
  if (!items.length) return null;
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden rounded-2xl border border-amber-400/25 bg-[#0b0d21]/85 backdrop-blur-md">
      <div className="flex items-center gap-2 border-b border-amber-400/15 px-3 py-1.5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-200">{title}</span>
      </div>
      <div className="relative overflow-hidden py-2">
        <div className="flex w-max animate-cosmic-marquee gap-3 px-3">
          {row.map((m, i) => (
            <span
              key={i}
              className={`whitespace-nowrap rounded-full border px-3 py-1 text-[11px] font-bold ${
                m.good
                  ? 'border-emerald-400/40 bg-emerald-950/50 text-emerald-200'
                  : 'border-rose-400/40 bg-rose-950/50 text-rose-200'
              }`}
            >
              {m.emoji} {m.label} • <span className="font-mono">{m.time}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
