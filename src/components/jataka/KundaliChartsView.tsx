import React, { useMemo } from 'react';
import { useI18n } from '../../localization/i18n';
import { BirthChartData, PlanetName } from '../../types/jataka';
import { calculateYearlyForecast } from '../../core/jataka/yearly_forecast_engine';

interface Props { chartData: BirthChartData; printMode?: boolean; }

const PLANETS: PlanetName[] = ['Surya', 'Chandra', 'Mangala', 'Budha', 'Guru', 'Shukra', 'Shani'];
const PS: Record<string, string> = { Surya: 'सू', Chandra: 'च', Mangala: 'म', Budha: 'बु', Guru: 'गु', Shukra: 'श', Shani: 'श' };
const RATING_COLOR: Record<string, string> = { Excellent: '#15803d', Good: '#65a30d', Average: '#ca8a04', Caution: '#ea580c', Avoid: '#b91c1c' };
const RATING_HI: Record<string, string> = { Excellent: 'उत्तम', Good: 'शुभ', Average: 'मध्यम', Caution: 'सावधान', Avoid: 'टालें' };

/** Pure-SVG chart gallery — renders identically on screen and in print. */
export const KundaliChartsView: React.FC<Props> = ({ chartData, printMode = false }) => {
  const { language, formatNumber } = useI18n();
  const year = useMemo(
    () => calculateYearlyForecast(
      chartData.planets.Chandra.signIndex,
      chartData.planets.Chandra.nakshatraIndex - 1,
      chartData.dashas as any[],
      new Date(),
    ),
    [chartData],
  );

  const ink = printMode ? '#78350f' : '#f8fafc';
  const axis = printMode ? '#78716c' : '#94a3b8';
  const gold = printMode ? '#b45309' : '#f59e0b';
  const grid = printMode ? '#e7e5e4' : '#334155';
  const boxCls = printMode ? 'book-chart-box' : 'rounded-2xl border border-cosmic-gold/30 bg-cosmic-900/60 p-4';
  const titleCls = printMode ? 'book-chart-title' : 'text-sm font-black text-slate-100 mb-1';
  const subCls = printMode ? 'book-chart-sub' : 'text-[11px] text-slate-400 mb-2';

  const shadbalaRows = PLANETS.map((p) => ({
    p,
    pct: Math.min(100, Math.round(chartData.shadbala.planets[p].strengthPercentage)),
    rupas: Math.round(chartData.shadbala.planets[p].totalRupas * 100) / 100,
    rank: chartData.shadbala.planets[p].rank,
  })).sort((a, b) => a.rank - b.rank);

  const sav = chartData.ashtakavarga.sarvashtakavarga;

  const vimRows = PLANETS.map((p) => ({
    p,
    score: chartData.vimsopakaBala.planets[p].vimsopakaScore,
    grade: chartData.vimsopakaBala.planets[p].vimsopakaGrade,
  })).sort((a, b) => b.score - a.score);

  const scores = year.days.map((d) => d.score);

  const monthAvg = useMemo(() => {
    const m = new Map<string, { sum: number; n: number }>();
    for (const d of year.days) {
      const k = d.dateStr.slice(0, 7);
      const c = m.get(k) ?? { sum: 0, n: 0 };
      c.sum += d.score; c.n += 1; m.set(k, c);
    }
    return [...m.entries()].map(([month, v]) => ({ month, avg: Math.round(v.sum / v.n) }));
  }, [year.days]);

  const domains = chartData.lifeDomains.domains;
  const radarPts = useMemo(() => {
    const cx = 100, cy = 100, R = 68, n = domains.length;
    return domains.map((d, i) => {
      const ang = (Math.PI * 2 * i) / n - Math.PI / 2;
      const rr = (Math.max(1, Math.min(5, d.rating)) / 5) * R;
      return { x: cx + rr * Math.cos(ang), y: cy + rr * Math.sin(ang), d, ang, cx, cy, R };
    });
  }, [domains]);

  const ratingCounts = [
    { r: 'Excellent', v: year.excellent }, { r: 'Good', v: year.good },
    { r: 'Average', v: year.average }, { r: 'Caution', v: year.caution }, { r: 'Avoid', v: year.avoid },
  ].filter((x) => x.v > 0);
  const donutTotal = ratingCounts.reduce((s, x) => s + x.v, 0) || 1;

  const barCol = (pct: number) => (pct >= 100 ? '#15803d' : pct >= 70 ? '#65a30d' : pct >= 40 ? '#ca8a04' : '#b91c1c');
  const gradeCol = (g: string) => (g === 'Purna' ? '#15803d' : g === 'Uttama' ? '#65a30d' : g === 'Madhyama' ? '#ca8a04' : '#b91c1c');

  return (
    <div className={printMode ? 'book-charts-grid' : 'grid grid-cols-1 xl:grid-cols-2 gap-4'}>

      {/* ===== 1. SHADBALA BAR CHART ===== */}
      <div className={boxCls}>
        <div className={titleCls}>षड्बल ग्राफ — Planetary Strength</div>
        <div className={subCls}>Strength % vs required rupas • rank 1 = strongest</div>
        <svg viewBox="0 0 340 200" className="w-full h-auto">
          {[0, 25, 50, 75, 100].map((g) => (
            <g key={g}>
              <line x1={42} y1={16 + g * 1.7} x2={330} y2={16 + g * 1.7} stroke={grid} />
              <text x={38} y={20 + g * 1.7} fontSize="8" fill={axis} textAnchor="end">{g}</text>
            </g>
          ))}
          {shadbalaRows.map((r, i) => {
            const y = 16 + i * 25;
            const w = Math.max(2, (r.pct / 100) * 280);
            return (
              <g key={r.p}>
                <text x={38} y={y + 13} fontSize="9" fill={ink} fontWeight="700" textAnchor="end">{PS[r.p]}</text>
                <rect x={42} y={y} width={280} height={17} fill={printMode ? '#fafaf9' : '#0f172a'} stroke={grid} />
                <rect x={42} y={y} width={w} height={17} fill={barCol(r.pct)} opacity="0.88" rx="2" />
                <text x={46 + Math.min(w, 232)} y={y + 12} fontSize="8" fill="#ffffff" fontWeight="700">{r.pct}%</text>
                <text x={330} y={y + 12} fontSize="7" fill={axis} textAnchor="end">#{r.rank} • {formatNumber(r.rupas)}Ṛ</text>
              </g>
            );
          })}
        </svg>
      </div>
      {/* ===== 2. SAV COLUMN CHART ===== */}
      <div className={boxCls}>
        <div className={titleCls}>सर्वाष्टकवर्ग ग्राफ — House Bindus</div>
        <div className={subCls}>12-house bindu columns • total 337 • green ≥30 • red ≤24</div>
        <svg viewBox="0 0 340 210" className="w-full h-auto">
          {[0, 25, 50].map((g) => {
            const y = 175 - (g / 50) * 155;
            return <g key={g}>
              <line x1={30} y1={y} x2={335} y2={y} stroke={grid} />
              <text x={26} y={y + 3} fontSize="8" fill={axis} textAnchor="end">{g}</text>
            </g>;
          })}
          <line x1={30} y1={175} x2={335} y2={175} stroke={axis} strokeWidth="1.5" />
          {sav.map((v, i) => {
            const x = 34 + i * 25;
            const h = Math.max(2, (v / 50) * 155);
            const col = v >= 30 ? '#15803d' : v >= 25 ? '#65a30d' : '#b91c1c';
            return (
              <g key={i}>
                <rect x={x} y={175 - h} width={19} height={h} fill={col} opacity="0.85" rx="2" />
                <text x={x + 9.5} y={171 - h} fontSize="8.5" fill={ink} fontWeight="800" textAnchor="middle">{v}</text>
                <text x={x + 9.5} y={186} fontSize="8" fill={axis} textAnchor="middle">{i + 1}</text>
              </g>
            );
          })}
          <text x={182} y={201} fontSize="8" fill={axis} textAnchor="middle">भाव / House →</text>
        </svg>
      </div>

      {/* ===== 3. VIMSHOPAK BAR CHART ===== */}
      <div className={boxCls}>
        <div className={titleCls}>विंशोपक बल ग्राफ — Composite Strength</div>
        <div className={subCls}>Out of 20 rupas • sorted highest first</div>
        <svg viewBox="0 0 340 190" className="w-full h-auto">
          {[0, 5, 10, 15, 20].map((g) => {
            const x = 42 + (g / 20) * 280;
            return <g key={g}>
              <line x1={x} y1={12} x2={x} y2={158} stroke={grid} />
              <text x={x} y={168} fontSize="8" fill={axis} textAnchor="middle">{g}</text>
            </g>;
          })}
          {vimRows.map((r, i) => {
            const y = 12 + i * 21;
            const w = Math.max(2, (r.score / 20) * 280);
            return (
              <g key={r.p}>
                <text x={38} y={y + 12} fontSize="8.5" fill={ink} fontWeight="700" textAnchor="end">{PS[r.p]}</text>
                <rect x={42} y={y} width={w} height={16} fill={gradeCol(r.grade)} opacity="0.85" rx="2" />
                <text x={46 + Math.min(w, 250)} y={y + 12} fontSize="8" fill="#ffffff" fontWeight="700">{r.score}</text>
                <text x={330} y={y + 12} fontSize="7" fill={axis} textAnchor="end">{r.grade}</text>
              </g>
            );
          })}
        </svg>
      </div>
      {/* ===== 4. 365-DAY SCORE LINE CHART ===== */}
      <div className={boxCls}>
        <div className={titleCls}>३६५-दिन स्कोर रेखा — Yearly Trend</div>
        <div className={subCls}>Daily luck score 0-100 from today • ● best days • ● tough days</div>
        <svg viewBox="0 0 340 190" className="w-full h-auto">
          <rect x={30} y={12} width={305} height={41} fill="#15803d" opacity="0.10" />
          <rect x={30} y={53} width={305} height={41} fill="#65a30d" opacity="0.08" />
          <rect x={30} y={130} width={305} height={26} fill="#b91c1c" opacity="0.10" />
          {[0, 50, 100].map((g) => {
            const y = 156 - (g / 100) * 144;
            return <g key={g}>
              <line x1={30} y1={y} x2={335} y2={y} stroke={grid} strokeWidth="0.8" />
              <text x={26} y={y + 3} fontSize="8" fill={axis} textAnchor="end">{g}</text>
            </g>;
          })}
          <polyline
            fill="none" stroke={gold} strokeWidth="1.6"
            points={scores.map((s, i) => `${30 + (i / Math.max(1, scores.length - 1)) * 305},${156 - (s / 100) * 144}`).join(' ')}
          />
          {year.bestDays.slice(0, 4).map((d) => (
            <circle key={`b${d.dateStr}`} cx={30 + ((d.dayIndex - 1) / Math.max(1, scores.length - 1)) * 305} cy={156 - (d.score / 100) * 144} r="2.6" fill="#15803d" />
          ))}
          {year.toughDays.slice(0, 4).map((d) => (
            <circle key={`t${d.dateStr}`} cx={30 + ((d.dayIndex - 1) / Math.max(1, scores.length - 1)) * 305} cy={156 - (d.score / 100) * 144} r="2.6" fill="#b91c1c" />
          ))}
          <text x={182} y={184} fontSize="8" fill={axis} textAnchor="middle">● श्रेष्ठ दिवस / Best days • ● कठिन दिवस / Tough days</text>
        </svg>
      </div>

      {/* ===== 5. MONTHLY AVG BAR CHART ===== */}
      <div className={boxCls}>
        <div className={titleCls}>मासिक औसत स्कोर — Monthly Average</div>
        <div className={subCls}>Average daily score for each of the 12 months</div>
        <svg viewBox="0 0 340 180" className="w-full h-auto">
          <line x1={30} y1={150} x2={335} y2={150} stroke={axis} strokeWidth="1.5" />
          {[50, 100].map((g) => {
            const y = 150 - (g / 100) * 138;
            return <g key={g}>
              <line x1={30} y1={y} x2={335} y2={y} stroke={grid} />
              <text x={26} y={y + 3} fontSize="8" fill={axis} textAnchor="end">{g}</text>
            </g>;
          })}
          {monthAvg.map((m, i) => {
            const x = 34 + i * 25;
            const h = Math.max(2, (m.avg / 100) * 138);
            const col = m.avg >= 78 ? '#15803d' : m.avg >= 62 ? '#65a30d' : m.avg >= 45 ? '#ca8a04' : m.avg >= 30 ? '#ea580c' : '#b91c1c';
            const lbl = ['जन', 'फर', 'मा', 'अ', 'मा', 'जू', 'जु', 'अ', 'सि', 'अ', 'न', 'द'][i] ?? String(i + 1);
            return (
              <g key={m.month}>
                <rect x={x} y={150 - h} width={19} height={h} fill={col} opacity="0.85" rx="2" />
                <text x={x + 9.5} y={146 - h} fontSize="8" fill={ink} fontWeight="700" textAnchor="middle">{m.avg}</text>
                <text x={x + 9.5} y={161} fontSize="7" fill={axis} textAnchor="middle">{lbl}</text>
              </g>
            );
          })}
        </svg>
      </div>
      {/* ===== 6. LIFE DOMAIN RADAR ===== */}
      <div className={boxCls}>
        <div className={titleCls}>जीवन क्षेत्र रडार — Life Domain Radar</div>
        <div className={subCls}>{formatNumber(domains.length)} domains rated 1-5★ from natal chart lords</div>
        <svg viewBox="0 0 200 210" className="w-full h-auto max-h-[260px]">
          {[1, 2, 3, 4, 5].map((lv) => {
            const R = (lv / 5) * 68;
            const pts = radarPts.map((p) => `${p.cx + R * Math.cos(p.ang)},${p.cy + R * Math.sin(p.ang)}`).join(' ');
            return <polygon key={lv} points={pts} fill="none" stroke={grid} strokeWidth="0.8" />;
          })}
          {radarPts.map((p) => (
            <line key={`a${p.d.domainId}`} x1={p.cx} y1={p.cy} x2={p.cx + p.R * Math.cos(p.ang)} y2={p.cy + p.R * Math.sin(p.ang)} stroke={grid} strokeWidth="0.8" />
          ))}
          <polygon points={radarPts.map((p) => `${p.x},${p.y}`).join(' ')} fill={gold} fillOpacity="0.3" stroke={gold} strokeWidth="2" />
          {radarPts.map((p) => (
            <g key={`p${p.d.domainId}`}>
              <circle cx={p.x} cy={p.y} r="3" fill={gold} />
              <text
                x={p.cx + 84 * Math.cos(p.ang)} y={p.cy + 84 * Math.sin(p.ang)}
                fontSize="7.5" fill={ink} fontWeight="700"
                textAnchor={Math.abs(Math.cos(p.ang)) < 0.3 ? 'middle' : Math.cos(p.ang) > 0 ? 'start' : 'end'}
                dominantBaseline="middle"
              >{p.d.title[language]} {p.d.rating}★</text>
            </g>
          ))}
        </svg>
      </div>

      {/* ===== 7. RATING DONUT ===== */}
      <div className={boxCls}>
        <div className={titleCls}>३६५-दिन रेटिंग वितरण — Rating Distribution</div>
        <div className={subCls}>Days falling in each rating band out of {formatNumber(donutTotal)}</div>
        <svg viewBox="0 0 340 180" className="w-full h-auto">
          <g transform="translate(85,90)">
            {(() => {
              let acc = 0;
              const R = 60, r = 32;
              return ratingCounts.map((rc) => {
                const frac = rc.v / donutTotal;
                const a0 = acc * 2 * Math.PI - Math.PI / 2;
                acc += frac;
                const a1 = acc * 2 * Math.PI - Math.PI / 2;
                const large = frac > 0.5 ? 1 : 0;
                const x0o = R * Math.cos(a0), y0o = R * Math.sin(a0);
                const x1o = R * Math.cos(a1), y1o = R * Math.sin(a1);
                const x1i = r * Math.cos(a1), y1i = r * Math.sin(a1);
                const x0i = r * Math.cos(a0), y0i = r * Math.sin(a0);
                return (
                  <path key={rc.r}
                    d={`M ${x0o} ${y0o} A ${R} ${R} 0 ${large} 1 ${x1o} ${y1o} L ${x1i} ${y1i} A ${r} ${r} 0 ${large} 0 ${x0i} ${y0i} Z`}
                    fill={RATING_COLOR[rc.r]} opacity="0.9" stroke={printMode ? '#ffffff' : '#0f172a'} strokeWidth="1" />
                );
              });
            })()}
            <text x={0} y={-2} fontSize="13" fill={ink} fontWeight="900" textAnchor="middle">{formatNumber(donutTotal)}</text>
            <text x={0} y={12} fontSize="8" fill={axis} textAnchor="middle">days</text>
          </g>
          <g transform="translate(165,32)">
            {ratingCounts.map((rc, i) => (
              <g key={`l${rc.r}`} transform={`translate(0,${i * 24})`}>
                <rect width="12" height="12" fill={RATING_COLOR[rc.r]} rx="2" />
                <text x={18} y={10} fontSize="9" fill={ink} fontWeight="700">
                  {language === 'hi' || language === 'or' ? RATING_HI[rc.r] : rc.r}
                </text>
                <text x={165} y={10} fontSize="9" fill={axis} textAnchor="end">{formatNumber(rc.v)} • {Math.round((rc.v / donutTotal) * 100)}%</text>
              </g>
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
};
