import React from 'react';
import { useI18n } from '../../localization/i18n';
import { AdvancedMilanResult } from '../../types/milan';

interface Props {
  result: AdvancedMilanResult;
  printMode?: boolean;
  compactPrint?: boolean;
}

const KOOTA_COLORS = ['#f59e0b', '#f97316', '#ef4444', '#ec4899', '#a855f7', '#8b5cf6', '#3b82f6', '#10b981'];

/** Milan Graphs — pure SVG, renders identically on screen and in the print book. */
export const MilanChartsView: React.FC<Props> = ({ result, printMode = false, compactPrint = false }) => {
  const { language, formatNumber, tVerdict } = useI18n();

  const ink = printMode ? '#78350f' : '#f8fafc';
  const axis = printMode ? '#78716c' : '#94a3b8';
  const gold = printMode ? '#b45309' : '#f59e0b';
  const grid = printMode ? '#e7e5e4' : '#334155';
  const boxCls = printMode ? 'book-chart-box' : 'rounded-2xl border border-cosmic-gold/30 bg-cosmic-900/60 p-4';
  const titleCls = printMode ? 'book-chart-title' : 'text-sm font-black text-slate-100 mb-1';
  const subCls = printMode ? 'book-chart-sub' : 'text-[11px] text-slate-400 mb-2';

  const pick = (o: { en: string; hi: string; or: string }) => o[language as 'or'] || o.en;

  // ---- 1. Radar of 8 life domains ----
  const radar = (() => {
    const cx = 130, cy = 120, R = 82, n = result.lifeDomains.length;
    const pt = (i: number, frac: number) => {
      const ang = (Math.PI * 2 * i) / n - Math.PI / 2;
      return { x: cx + R * frac * Math.cos(ang), y: cy + R * frac * Math.sin(ang) };
    };
    const poly = result.lifeDomains.map((d, i) => { const p = pt(i, d.score / 100); return `${p.x.toFixed(1)},${p.y.toFixed(1)}`; }).join(' ');
    return { cx, cy, R, poly, pt };
  })();

  // ---- 2. Donut of 36-guna distribution ----
  const donut = (() => {
    const cx = 130, cy = 105, R = 74, r = 44;
    let acc = 0;
    const segs = result.kootas.map((k, i) => {
      const frac = k.points / k.maxPoints;
      const a0 = acc * Math.PI * 2 - Math.PI / 2;
      acc += frac;
      const a1 = acc * Math.PI * 2 - Math.PI / 2;
      const large = (a1 - a0) > Math.PI ? 1 : 0;
      const p = (rad: number) => `${(cx + R * Math.cos(rad)).toFixed(1)},${(cy + R * Math.sin(rad)).toFixed(1)}`;
      const q = (rad: number) => `${(cx + r * Math.cos(rad)).toFixed(1)},${(cy + r * Math.sin(rad)).toFixed(1)}`;
      return { k, i, d: `M ${p(a0)} A ${R} ${R} 0 ${large} 1 ${p(a1)} L ${q(a1)} A ${r} ${r} 0 ${large} 0 ${q(a0)} Z`, col: KOOTA_COLORS[i % KOOTA_COLORS.length] };
    });
    return { cx, cy, segs };
  })();

  // ---- 3. Koota horizontal bars ----
  const kootaBars = result.kootas.map((k, i) => ({ ...k, pct: Math.round((k.points / k.maxPoints) * 100), col: KOOTA_COLORS[i % KOOTA_COLORS.length] }));

  // ---- 4. Compatibility gauge ----
  const gR = 80, gC = 2 * Math.PI * gR;
  const gOff = gC * (1 - Math.max(0, Math.min(100, result.compatibilityIndex)) / 100);

  const statusCol = (s: string) => {
    if (printMode) {
      return s === 'auspicious' ? '#047857' : s === 'good' ? '#b45309' : s === 'mixed' ? '#c2410c' : '#b91c1c';
    }
    return s === 'auspicious' ? '#10b981' : s === 'good' ? '#f59e0b' : s === 'mixed' ? '#f97316' : '#ef4444';
  };

  const statusText = (s: string) => {
    if (language === 'or') {
      return s === 'auspicious' ? 'ଶୁଭ' : s === 'good' ? 'ଉତ୍ତମ' : s === 'mixed' ? 'ମଧ୍ୟମ' : 'ଦୋଷ';
    }
    if (language === 'hi') {
      return s === 'auspicious' ? 'शुभ' : s === 'good' ? 'उत्तम' : s === 'mixed' ? 'मध्यम' : 'दोष';
    }
    return s;
  };

  if (compactPrint) {
    return (
      <div className="milan-charts-print-grid">
        {/* ROW 1: Radar + Donut */}
        <div className="milan-charts-row">
          <div className="milan-chart-card">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[10px] font-black text-amber-950">
                {language === 'or' ? 'ଜୀବନ କ୍ଷେତ୍ର ରଡାର' : language === 'hi' ? 'जीवन क्षेत्र रडार' : 'Life-Domain Radar'}
              </span>
              <span className="text-[8.5px] font-bold text-amber-900">
                {language === 'or' ? '୮ କ୍ଷେତ୍ର' : '8 Domains'}
              </span>
            </div>
            <svg viewBox="0 0 260 250" className="w-full max-h-[96px]">
              {[0.25, 0.5, 0.75, 1].map(f => (
                <polygon key={f} points={result.lifeDomains.map((_, i) => { const p = radar.pt(i, f); return `${p.x.toFixed(1)},${p.y.toFixed(1)}`; }).join(' ')} fill="none" stroke={grid} />
              ))}
              {result.lifeDomains.map((_, i) => { const p = radar.pt(i, 1); return <line key={i} x1={radar.cx} y1={radar.cy} x2={p.x} y2={p.y} stroke={grid} />; })}
              <polygon points={radar.poly} fill={gold} fillOpacity="0.28" stroke={gold} strokeWidth="2" />
              {result.lifeDomains.map((d, i) => { const p = radar.pt(i, d.score / 100); return <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={gold} />; })}
              {result.lifeDomains.map((d, i) => {
                const p = radar.pt(i, 1.24);
                const anch = Math.abs(p.x - radar.cx) < 12 ? 'middle' : p.x > radar.cx ? 'start' : 'end';
                return <text key={i} x={p.x} y={p.y + 3} fontSize="8.5" fill={ink} fontWeight="700" textAnchor={anch}>{pick(d.label).split(' ')[0]}</text>;
              })}
            </svg>
          </div>

          <div className="milan-chart-card">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[10px] font-black text-amber-950">
                {language === 'or' ? '୩୬ ଗୁଣ ବିତରଣ ଡୋନଟ' : language === 'hi' ? 'ଅଷ୍ଟକୂଟ ଡୋନଟ' : 'Ashtakoot Donut'}
              </span>
              <span className="text-[8.5px] font-bold text-amber-900">
                {formatNumber(result.totalScore)} / {formatNumber(36)}
              </span>
            </div>
            <svg viewBox="0 0 260 210" className="w-full max-h-[96px]">
              {donut.segs.map(s => (
                <path key={s.k.key} d={s.d} fill={s.col} fillOpacity="0.88" stroke="#fff" strokeWidth="1.5" />
              ))}
              <text x={donut.cx} y={donut.cy - 2} fontSize="26" fill={gold} fontWeight="900" textAnchor="middle">{formatNumber(result.totalScore)}</text>
              <text x={donut.cx} y={donut.cy + 14} fontSize="9" fill={axis} textAnchor="middle">/ {formatNumber(36)} • {formatNumber(result.percentage)}%</text>
            </svg>
          </div>
        </div>

        {/* ROW 2: Koota Strength Bars + Compatibility Gauge */}
        <div className="milan-charts-row">
          <div className="milan-chart-card">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[10px] font-black text-amber-950">
                {language === 'or' ? 'କୂଟ ଗ୍ରାଫ' : language === 'hi' ? 'कूट ग्राफ' : 'Koota Strength Bars'}
              </span>
              <span className="text-[8.5px] font-bold text-amber-900">
                {language === 'or' ? 'ଅଧିକୃତ ପଏଣ୍ଟ' : 'Obtained Points'}
              </span>
            </div>
            <svg viewBox="0 0 340 220" className="w-full max-h-[96px]">
              {kootaBars.map((k, i) => {
                const y = 6 + i * 26;
                const w = Math.max(3, (k.pct / 100) * 190);
                const isZeroOrSmall = w < 32;
                return (
                  <g key={k.key}>
                    <text x={55} y={y + 12} fontSize="9" fill={ink} fontWeight="700" textAnchor="end">
                      {pick(k.name).split(' ')[0]}
                    </text>
                    <rect x={60} y={y} width={190} height={17} fill="#fafaf9" stroke={grid} rx="3" />
                    <rect x={60} y={y} width={w} height={17} fill={k.col} opacity="0.9" rx="3" />
                    <text
                      x={isZeroOrSmall ? 60 + w + 5 : 65}
                      y={y + 12}
                      fontSize="8.5"
                      fill={isZeroOrSmall ? ink : '#ffffff'}
                      fontWeight="800"
                    >
                      {formatNumber(k.points)}/{formatNumber(k.maxPoints)}
                    </text>
                    <text x={332} y={y + 12} fontSize="8.5" fill={statusCol(k.status)} fontWeight="800" textAnchor="end">
                      {statusText(k.status)}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="milan-chart-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[10px] font-black text-amber-950">
                  {language === 'or' ? 'ସମନ୍ୱୟ ସୂଚକ' : language === 'hi' ? 'संयोग सूचक' : 'Compatibility Index Gauge'}
                </span>
                <span className="text-[8.5px] font-bold text-amber-900">
                  {formatNumber(result.compatibilityIndex)}%
                </span>
              </div>
              <div className="text-[8px] text-stone-500 mb-0.5">
                {language === 'or' ? '୩୬ ଗୁଣ (୬୦%) + କ୍ଷେତ୍ର (୪୦%) − ଦୋଷ' : language === 'hi' ? '36 गुण (60%) + क्षेत्र (40%) − दोष' : '36-Guna (60%) + Domains (40%) − Dosha'}
              </div>
            </div>
            <div className="flex items-center justify-center my-auto">
              <svg viewBox="0 0 200 150" className="w-full max-h-[85px]">
                <circle cx="100" cy="75" r="56" fill="none" stroke="#fde68a" strokeWidth="13" />
                <circle
                  cx="100"
                  cy="75"
                  r="56"
                  fill="none"
                  stroke={gold}
                  strokeWidth="13"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 56}
                  strokeDashoffset={2 * Math.PI * 56 * (1 - Math.max(0, Math.min(100, result.compatibilityIndex)) / 100)}
                  transform="rotate(-90 100 75)"
                />
                <text x="100" y="73" fontSize="28" fill={gold} fontWeight="900" textAnchor="middle">
                  {formatNumber(result.compatibilityIndex)}
                </text>
                <text x="100" y="90" fontSize="9.5" fill={axis} textAnchor="middle">/ 100</text>
              </svg>
            </div>
            <div className="text-center text-[9.5px] font-black text-amber-950 mt-0.5 truncate">
              {tVerdict(result.verdict)} • {formatNumber(result.totalScore)}/{formatNumber(36)} {language === 'or' ? 'ଗୁଣ' : 'Guna'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={printMode ? 'book-charts-grid' : 'grid grid-cols-1 xl:grid-cols-2 gap-4'}>

      {/* ===== 1. LIFE DOMAIN RADAR ===== */}
      <div className={boxCls}>
        <div className={titleCls}>{language === 'or' ? 'ଜୀବନ କ୍ଷେତ୍ର ରଡାର' : language === 'hi' ? 'जीवन क्षेत्र रडार' : 'Life-Domain Radar'}</div>
        <div className={subCls}>{language === 'or' ? '୮ କ୍ଷେତ୍ରର ମେଳକ (୦-୧୦୦)' : language === 'hi' ? '8 क्षेत्रों की अनुकूलता (0-100)' : '8-domain compatibility (0-100)'}</div>
        <svg viewBox="0 0 260 250" className="w-full h-auto">
          {[0.25, 0.5, 0.75, 1].map(f => (
            <polygon key={f} points={result.lifeDomains.map((_, i) => { const p = radar.pt(i, f); return `${p.x.toFixed(1)},${p.y.toFixed(1)}`; }).join(' ')} fill="none" stroke={grid} />
          ))}
          {result.lifeDomains.map((_, i) => { const p = radar.pt(i, 1); return <line key={i} x1={radar.cx} y1={radar.cy} x2={p.x} y2={p.y} stroke={grid} />; })}
          <polygon points={radar.poly} fill={gold} fillOpacity="0.28" stroke={gold} strokeWidth="2" />
          {result.lifeDomains.map((d, i) => { const p = radar.pt(i, d.score / 100); return <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={gold} />; })}
          {result.lifeDomains.map((d, i) => {
            const p = radar.pt(i, 1.24);
            const anch = Math.abs(p.x - radar.cx) < 12 ? 'middle' : p.x > radar.cx ? 'start' : 'end';
            return <text key={i} x={p.x} y={p.y + 3} fontSize="8.5" fill={ink} fontWeight="700" textAnchor={anch}>{pick(d.label).split(' ')[0]}</text>;
          })}
        </svg>
      </div>

      {/* ===== 2. 36-GUNA DONUT ===== */}
      <div className={boxCls}>
        <div className={titleCls}>{language === 'or' ? 'ଅଷ୍ଟକୂଟ ଡୋନଟ' : language === 'hi' ? 'अष्टकूट डोनट' : 'Ashtakoot Donut'}</div>
        <div className={subCls}>{language === 'or' ? 'ମୋଟ ୩୬ ଗୁଣର ବିତରଣ' : language === 'hi' ? 'कुल 36 गुण का वितरण' : `Distribution of ${formatNumber(result.totalScore)}/${formatNumber(36)} Guna`}</div>
        <svg viewBox="0 0 260 210" className="w-full h-auto">
          {donut.segs.map(s => (
            <path key={s.k.key} d={s.d} fill={s.col} fillOpacity="0.85" stroke={printMode ? '#fff' : '#0f172a'} strokeWidth="1.5" />
          ))}
          <text x={donut.cx} y={donut.cy - 2} fontSize="26" fill={gold} fontWeight="900" textAnchor="middle">{formatNumber(result.totalScore)}</text>
          <text x={donut.cx} y={donut.cy + 14} fontSize="9" fill={axis} textAnchor="middle">/ {formatNumber(36)} • {formatNumber(result.percentage)}%</text>
        </svg>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
          {result.kootas.map((k, i) => (
            <span key={k.key} className="flex items-center gap-1 text-[9px]" style={{ color: ink }}>
              <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: KOOTA_COLORS[i % KOOTA_COLORS.length] }} />
              {pick(k.name).split(' ')[0]} {formatNumber(k.points)}/{formatNumber(k.maxPoints)}
            </span>
          ))}
        </div>
      </div>
      {/* ===== 3. KOOTA BARS ===== */}
      <div className={boxCls}>
        <div className={titleCls}>{language === 'or' ? 'କୂଟ ଗ୍ରାଫ' : language === 'hi' ? 'कूट ग्राफ' : 'Koota Strength Bars'}</div>
        <div className={subCls}>{language === 'or' ? 'ପ୍ରତ୍ୟେକ କୂଟର ଅଧିକୃତ ପଏଣ୍ଟ' : language === 'hi' ? 'प्रत्येक कूट के प्राप्त अंक' : 'Obtained points per koota'}</div>
        <svg viewBox="0 0 340 230" className="w-full h-auto">
          {kootaBars.map((k, i) => {
            const y = 14 + i * 27;
            const w = Math.max(2, (k.pct / 100) * 200);
            return (
              <g key={k.key}>
                <text x={62} y={y + 13} fontSize="9" fill={ink} fontWeight="700" textAnchor="end">{pick(k.name).split(' ')[0]}</text>
                <rect x={68} y={y} width={200} height={18} fill={printMode ? '#fafaf9' : '#0f172a'} stroke={grid} rx="2" />
                <rect x={68} y={y} width={w} height={18} fill={k.col} opacity="0.88" rx="2" />
                <text x={72 + Math.min(w, 165)} y={y + 12.5} fontSize="8.5" fill="#ffffff" fontWeight="800">{formatNumber(k.points)}/{formatNumber(k.maxPoints)}</text>
                <text x={332} y={y + 12.5} fontSize="8" fill={statusCol(k.status)} fontWeight="800" textAnchor="end">{statusText(k.status)}</text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* ===== 4. COMPATIBILITY GAUGE ===== */}
      <div className={boxCls}>
        <div className={titleCls}>{language === 'or' ? 'ସମନ୍ୱୟ ସୂଚକ' : language === 'hi' ? 'संयोग सूचक' : 'Compatibility Index Gauge'}</div>
        <div className={subCls}>{language === 'or' ? '୩୬ ଗୁଣ (୬୦%) + କ୍ଷେତ୍ର (୪୦%) − ଦୋଷ' : language === 'hi' ? '36 गुण (60%) + क्षेत्र (40%) − दोष' : '36-Guna (60%) + Domains (40%) − Dosha'}</div>
        <div className="flex items-center justify-center">
          <svg width="200" height="200" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r={gR} fill="none" stroke={grid} strokeWidth="16" />
            <circle cx="100" cy="100" r={gR} fill="none" stroke={gold} strokeWidth="16" strokeLinecap="round"
              strokeDasharray={gC} strokeDashoffset={gOff} transform="rotate(-90 100 100)" />
            <text x="100" y="96" fontSize="38" fill={gold} fontWeight="900" textAnchor="middle">{formatNumber(result.compatibilityIndex)}</text>
            <text x="100" y="118" fontSize="11" fill={axis} textAnchor="middle">/ 100</text>
          </svg>
        </div>
        <div className="text-center text-[11px] font-bold" style={{ color: ink }}>
          {tVerdict(result.verdict)} • {formatNumber(result.totalScore)}/{formatNumber(36)} {language === 'or' ? 'ଗୁଣ' : 'Guna'}
        </div>
      </div>
    </div>
  );
};


