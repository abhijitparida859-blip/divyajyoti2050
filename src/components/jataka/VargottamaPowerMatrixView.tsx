import React from 'react';
import { useI18n } from '../../localization/i18n';
import { BirthChartData, PlanetName, PlanetPosition } from '../../types/jataka';
import { Gem, Crown, Flame, RotateCcw, TrendingUp, Info, ShieldAlert, Sparkles } from 'lucide-react';

interface Props {
  chartData: BirthChartData;
}

// Vedic dignity → numeric power weight (classical Parashari scale)
const DIGNITY_WEIGHT: Record<PlanetPosition['dignity'], number> = {
  'Exalted': 20,
  'Moolatrikona': 16,
  'Own': 14,
  'Friendly': 10,
  'Neutral': 8,
  'Enemy': 5,
  'Debilitated': 2,
};

/**
 * Vargottama & Planetary Power Matrix — ADVANCED v5.0
 * Derives (100% real, no fake data) from existing ephemeris:
 *  - Vargottama: planet occupies the SAME sign in D1 (Rashi) and D9 (Navamsha) → becomes extremely strong.
 *  - Dignity, retrogression, combustion → combined into a single Planetary Power Index (0-100).
 */
export const VargottamaPowerMatrixView: React.FC<Props> = ({ chartData }) => {
  const { language, tGraha, tRashi, formatNumber } = useI18n();

  const planetList: PlanetName[] = [
    'Surya', 'Chandra', 'Mangala', 'Budha', 'Guru', 'Shukra', 'Shani'
  ];

  // Build a per-planet power model from REAL fields already present in chartData
  const rows = planetList.map((pName) => {
    const p: PlanetPosition = chartData.planets[pName];
    const isVargottama = p.sign === p.navamshaSign; // D1 sign === D9 sign
    const shadbala = chartData.shadbala?.planets?.[pName];
    const strengthPct = shadbala ? shadbala.strengthPercentage : 0;

    // Composite power index: dignity (max 20) + vargottama bonus (15) + shadbala% (0-100 scaled to 40)
    const dignityScore = DIGNITY_WEIGHT[p.dignity] ?? 8;
    const vargottamaBonus = isVargottama ? 15 : 0;
    const retroPenalty = p.isRetrograde ? -6 : 0;
    const combustPenalty = p.isCombust ? -8 : 0;
    const powerIndex = Math.max(
      0,
      Math.min(
        100,
        Math.round(dignityScore * 2 + vargottamaBonus + strengthPct * 0.4 + retroPenalty + combustPenalty)
      )
    );

    return { pName, p, isVargottama, strengthPct, powerIndex };
  });

  const ranked = [...rows].sort((a, b) => b.powerIndex - a.powerIndex);
  const vargottamaPlanets = rows.filter((r) => r.isVargottama).map((r) => r.pName);
  const strongest = ranked[0];
  const weakest = ranked[ranked.length - 1];

  const powerBarColor = (idx: number) =>
    idx >= 75 ? 'from-emerald-500 to-green-400'
      : idx >= 55 ? 'from-amber-500 to-yellow-400'
      : idx >= 35 ? 'from-indigo-500 to-blue-400'
      : 'from-rose-500 to-red-400';

  const dignityBadge = (d: PlanetPosition['dignity']) =>
    d === 'Exalted' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
    : d === 'Moolatrikona' || d === 'Own' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
    : d === 'Debilitated' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
    : d === 'Enemy' ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
    : 'bg-slate-500/20 text-slate-300 border-slate-500/40';

  const T = {
    title: language === 'or' ? 'ବର୍ଗୋତ୍ତମ ଓ ଗ୍ରହ ଶକ୍ତି ମାଟ୍ରିକ୍ସ' : language === 'hi' ? 'वर्गोत्तम एवं ग्रह शक्ति मैट्रिक्स' : 'Vargottama & Planetary Power Matrix',
    subtitle: language === 'or' ? 'ନବଂଶ (D9) ସହିତ ସମାନ ରାଶିରେ ଥିବା ଗ୍ରହ — ସବୁଠାରୁ ପରାକାଷ୍ଠା ପ୍ରବଳ।' : language === 'hi' ? 'नवंश (D9) में वही राशि — सर्वाधिक प्रबल ग्रह।' : 'Planets in the SAME sign in D9 (Navamsha) as D1 — the strongest classical strength marker.',
    vargottama: language === 'or' ? 'ବର୍ଗୋତ୍ତମ ଗ୍ରହ' : language === 'hi' ? 'वर्गोत्तम ग्रह' : 'Vargottama Planets',
    strongest: language === 'or' ? 'ସବୁଠାରୁ ପ୍ରବଳ' : language === 'hi' ? 'सर्वाधिक प्रबल' : 'Strongest',
    weakest: language === 'or' ? 'ସବୁଠାରୁ ଦୁର୍ବଳ' : language === 'hi' ? 'सर्वाधिक दुर्बल' : 'Weakest',
    powerIdx: language === 'or' ? 'ଶକ୍ତି ସୂଚକ' : language === 'hi' ? 'शक्ति सूचक' : 'Power Index',
    dignity: language === 'or' ? 'ଅଧିକାର' : language === 'hi' ? 'अधिकार' : 'Dignity',
    d1: language === 'or' ? 'ଲଗ୍ନ (D1)' : language === 'hi' ? 'लग्न (D1)' : 'D1 Rashi',
    d9: language === 'or' ? 'ନବଂଶ (D9)' : language === 'hi' ? 'नवंश (D9)' : 'D9 Navamsha',
    planet: language === 'or' ? 'ଗ୍ରହ' : language === 'hi' ? 'ग्रह' : 'Graha',
    none: language === 'or' ? 'କ values ଣସି ବର୍ଗୋତ୍ତମ ଗ୍ରହ ନାହିଁ' : language === 'hi' ? 'कोई वर्गोत्तम ग्रह नहीं' : 'No Vargottama planets this chart.',
    note: language === 'or'
      ? 'ବର୍ଗୋତ୍ତମ ଗ୍ରହ ଏକ ସୁଖଦ ଏବଂ ପ୍ରବଳ ଗ୍ରହ ଭାବରେ କାର୍ଯ୍ୟ କରେ — ଏହାର ଫଳ ସଦାବହାରତାଠାରୁ ଅଧିକ ଦୃଢ଼ ହୁଏ।'
      : language === 'hi'
      ? 'वर्गोत्तम ग्रह अत्यंत प्रबल एवं शुभफलदायी होता है; इसके परिणाम साधारण से अधिक दृढ़ होते हैं।'
      : 'A Vargottama planet behaves as exceptionally strong & auspicious; its results manifest far more firmly than usual.',
  };

  return (
    <div className="bg-cosmic-900/70 border border-cosmic-gold/30 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 font-serif">
            <Gem className="w-5 h-5 text-cosmic-gold" />
            <span>{T.title}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">{T.subtitle}</p>
        </div>
        <div className="flex gap-2 flex-wrap text-xs">
          <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-3 py-1 rounded-xl flex items-center gap-1.5 font-medium">
            <Crown className="w-3.5 h-3.5 text-emerald-400" />
            <span>{T.strongest}: {strongest ? tGraha(strongest.pName) : '—'}</span>
          </div>
          <div className="bg-amber-950/80 border border-amber-500/40 text-amber-300 px-3 py-1 rounded-xl flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{T.vargottama}: {vargottamaPlanets.length ? vargottamaPlanets.map(p => tGraha(p)).join(', ') : T.none}</span>
          </div>
        </div>
      </div>

      {/* Power Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="text-slate-400 border-b border-slate-800">
              <th className="text-left py-2 px-2 font-semibold">{T.planet}</th>
              <th className="text-center py-2 px-2 font-semibold">{T.d1}</th>
              <th className="text-center py-2 px-2 font-semibold">{T.d9}</th>
              <th className="text-center py-2 px-2 font-semibold">{T.dignity}</th>
              <th className="text-center py-2 px-2 font-semibold">वर् / V</th>
              <th className="text-center py-2 px-2 font-semibold">रे / C</th>
              <th className="text-left py-2 px-2 font-semibold w-40">{T.powerIdx}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.pName} className="border-b border-slate-800/60 hover:bg-cosmic-950/40 transition-colors">
                <td className="py-2.5 px-2 font-bold text-slate-100 font-serif whitespace-nowrap">
                  <span className="w-2.5 h-2.5 rounded-full bg-cosmic-gold inline-block mr-1.5" />
                  {tGraha(r.pName)}
                </td>
                <td className="py-2.5 px-2 text-center text-slate-300">{tRashi(r.p.sign)}</td>
                <td className={`py-2.5 px-2 text-center ${r.isVargottama ? 'text-emerald-300 font-bold' : 'text-slate-400'}`}>
                  {tRashi(r.p.navamshaSign)}
                </td>
                <td className="py-2.5 px-2 text-center">
                  <span className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold ${dignityBadge(r.p.dignity)}`}>
                    {r.p.dignity}
                  </span>
                </td>
                <td className="py-2.5 px-2 text-center">
                  {r.isVargottama ? (
                    <span className="inline-flex items-center gap-1 text-emerald-300 font-black" title="Vargottama">
                      <Gem className="w-3.5 h-3.5" />✓
                    </span>
                  ) : <span className="text-slate-600">—</span>}
                </td>
                <td className="py-2.5 px-2 text-center">
                  <span className="inline-flex items-center gap-1.5">
                    {r.p.isRetrograde ? <RotateCcw className="w-3.5 h-3.5 text-rose-400" /> : null}
                    {r.p.isCombust ? <Flame className="w-3.5 h-3.5 text-orange-400" /> : null}
                    {!r.p.isRetrograde && !r.p.isCombust ? <span className="text-slate-600">—</span> : null}
                  </span>
                </td>
                <td className="py-2.5 px-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className={`h-full rounded-full bg-gradient-to-r ${powerBarColor(r.powerIndex)}`} style={{ width: `${r.powerIndex}%` }} />
                    </div>
                    <span className="text-[11px] font-black text-slate-200 w-8 text-right">{formatNumber(r.powerIndex)}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Ranking + Insight Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-emerald-950/50 border border-emerald-500/30 rounded-2xl p-3 flex items-center gap-3">
          <Crown className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <div className="text-[10px] uppercase tracking-wider text-emerald-300/80 font-bold">{T.strongest}</div>
            <div className="text-sm font-black text-slate-100">{strongest ? `${tGraha(strongest.pName)} (${formatNumber(strongest.powerIndex)})` : '—'}</div>
          </div>
        </div>
        <div className="bg-rose-950/50 border border-rose-500/30 rounded-2xl p-3 flex items-center gap-3">
          <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0" />
          <div>
            <div className="text-[10px] uppercase tracking-wider text-rose-300/80 font-bold">{T.weakest}</div>
            <div className="text-sm font-black text-slate-100">{weakest ? `${tGraha(weakest.pName)} (${formatNumber(weakest.powerIndex)})` : '—'}</div>
          </div>
        </div>
        <div className="bg-indigo-950/50 border border-indigo-500/30 rounded-2xl p-3 flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-indigo-400 shrink-0" />
          <div>
            <div className="text-[10px] uppercase tracking-wider text-indigo-300/80 font-bold">{T.vargottama}</div>
            <div className="text-sm font-black text-slate-100">{formatNumber(vargottamaPlanets.length)} / {formatNumber(planetList.length)}</div>
          </div>
        </div>
      </div>

      {/* Classical Note */}
      <div className="bg-cosmic-950/60 border border-slate-800 rounded-2xl p-3 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-cosmic-gold shrink-0 mt-0.5" />
        <p className="text-xs text-slate-400 leading-relaxed">{T.note}</p>
      </div>
    </div>
  );
};

