import React, { useState } from 'react';
import { useI18n } from '../../localization/i18n';
import { PlanetName, PlanetPosition, KpSystemData, JaiminiData, VimsopakaBalaData } from '../../types/jataka';
import { Award, Sparkles, Flame, Orbit, Filter, ShieldCheck } from 'lucide-react';

interface Props {
  planets: Record<string, PlanetPosition>;
  kpSystem?: KpSystemData;
  jaimini?: JaiminiData;
  vimsopakaBala?: VimsopakaBalaData;
}

const PLANET_DEITIES: Record<string, { en: string; hi: string; or: string; element: string; gender: string }> = {
  Surya: { en: 'Lord Shiva / Agni', hi: 'शिव / अग्नि देव', or: 'ଶିବ ଓ ଅଗ୍ନି ଦେବ', element: 'Fire (ତେଜ)', gender: 'Male (ପୁରୁଷ)' },
  Chandra: { en: 'Goddess Parvati / Varuna', hi: 'पार्वती / वरुण देव', or: 'ମା’ ପାର୍ବତୀ ଓ ବରୁଣ', element: 'Water (ଜଳ)', gender: 'Female (ସ୍ତ୍ରୀ)' },
  Mangala: { en: 'Lord Kartikeya / Narasimha', hi: 'कार्तिकेय / नरसिंह', or: 'କାର୍ତ୍ତିକେୟ ଓ ନୃସିଂହ', element: 'Fire (ତେଜ)', gender: 'Male (ପୁରୁଷ)' },
  Budha: { en: 'Lord Vishnu / Narayana', hi: 'विष्णु / नारायण', or: 'ଭଗବାନ ବିଷ୍ଣୁ', element: 'Earth (ପୃଥିବୀ)', gender: 'Neuter (କ୍ଲୀବ)' },
  Guru: { en: 'Lord Indra / Dakshinamurthy', hi: 'इन्द्र / दक्षिणामूर्ति', or: 'ଇନ୍ଦ୍ର ଓ ଦକ୍ଷିଣାମୂର୍ତ୍ତି', element: 'Ether (ଆକାଶ)', gender: 'Male (ପୁରୁଷ)' },
  Shukra: { en: 'Goddess Lakshmi / Indrani', hi: 'महालक्ष्मी / इन्द्राणी', or: 'ମା’ ମହାଲକ୍ଷ୍ମୀ', element: 'Water (ଜଳ)', gender: 'Female (ସ୍ତ୍ରୀ)' },
  Shani: { en: 'Lord Yama / Prajapati', hi: 'यमराज / प्रजापति', or: 'ଯମରାଜ ଓ ପ୍ରଜାପତି', element: 'Air (ବାୟୁ)', gender: 'Neuter (କ୍ଲୀବ)' },
  Rahu: { en: 'Goddess Durga / Sarpa', hi: 'दुर्गा / सर्प देव', or: 'ମା’ ଦୁର୍ଗା ଓ ସର୍ପ', element: 'Air (ବାୟୁ)', gender: 'Female (ସ୍ତ୍ରୀ)' },
  Ketu: { en: 'Lord Ganesha / Chitragupta', hi: 'गणेश / चित्रगुप्त', or: 'ଭଗବାନ ଗଣେଶ', element: 'Fire (ତେଜ)', gender: 'Neuter (କ୍ଲୀବ)' }
};

const NATURAL_BENEFICS = ['Guru', 'Shukra', 'Budha', 'Chandra'];

export const NavagrahaTable: React.FC<Props> = ({ planets, kpSystem, jaimini, vimsopakaBala }) => {
  const { t, formatNumber, tRashi, tGraha, tNakshatra, tDignity, language } = useI18n();
  const [filterType, setFilterType] = useState<'all' | 'benefics' | 'malefics' | 'retrograde' | 'combust'>('all');

  const sunLong = planets.Surya ? planets.Surya.longitude : 0;

  // Jaimini Karaka map
  const karakaMap: Record<string, string> = {};
  if (jaimini && jaimini.charaKarakas) {
    jaimini.charaKarakas.forEach(k => {
      karakaMap[k.planet] = k.karaka;
    });
  }

  const planetList = Object.values(planets).filter(p => {
    if (filterType === 'benefics') return NATURAL_BENEFICS.includes(p.planet);
    if (filterType === 'malefics') return !NATURAL_BENEFICS.includes(p.planet);
    if (filterType === 'retrograde') return p.isRetrograde;
    if (filterType === 'combust') return p.isCombust;
    return true;
  });

  return (
    <div className="bg-cosmic-900/80 border border-cosmic-gold/30 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md space-y-4">
      {/* Header and Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2 font-serif">
            <Award className="w-5 h-5 text-cosmic-gold" />
            <span>Navagraha Real Planetary Sphutas & Astrometric Ledger (ଗ୍ରହ ସ୍ଫୁଟ ବିସ୍ତୃତ ତଥ୍ୟ)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            DMS Precision (ଡିଗ୍ରୀ-କଳା-ବିକଳା) • KP Sub-Lord • Combustion Orb • Chara Karaka • Tatwa
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 text-xs rounded-xl font-bold transition-all ${
              filterType === 'all' ? 'bg-cosmic-gold text-cosmic-950 shadow-md' : 'bg-cosmic-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            All (9)
          </button>
          <button
            onClick={() => setFilterType('benefics')}
            className={`px-2.5 py-1 text-xs rounded-xl font-bold transition-all ${
              filterType === 'benefics' ? 'bg-emerald-400 text-cosmic-950 shadow-md' : 'bg-cosmic-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Benefics (ଶୁଭ)
          </button>
          <button
            onClick={() => setFilterType('malefics')}
            className={`px-2.5 py-1 text-xs rounded-xl font-bold transition-all ${
              filterType === 'malefics' ? 'bg-rose-500 text-white shadow-md' : 'bg-cosmic-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Malefics (ପାପ)
          </button>
          <button
            onClick={() => setFilterType('retrograde')}
            className={`px-2.5 py-1 text-xs rounded-xl font-bold transition-all ${
              filterType === 'retrograde' ? 'bg-amber-400 text-cosmic-950 shadow-md' : 'bg-cosmic-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Retrograde (ବକ୍ରୀ)
          </button>
          <button
            onClick={() => setFilterType('combust')}
            className={`px-2.5 py-1 text-xs rounded-xl font-bold transition-all ${
              filterType === 'combust' ? 'bg-orange-500 text-white shadow-md' : 'bg-cosmic-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Combust (ଅସ୍ତ)
          </button>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto mobile-touch-scroll">
        <table className="w-full text-left text-xs text-slate-200 min-w-[760px]">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
              <th className="pb-3">{t('planet_col')}</th>
              <th className="pb-3">{t('rashi_col')}</th>
              <th className="pb-3">DMS (Deg° Min' Sec")</th>
              <th className="pb-3">{t('nakshatra_col')} & Pada</th>
              <th className="pb-3">Star / Sub-Lord (KP)</th>
              <th className="pb-3">Karaka (Jaimini)</th>
              <th className="pb-3">House & D9</th>
              <th className="pb-3">{t('dignity_col')}</th>
              <th className="pb-3">Asta / Motion</th>
              <th className="pb-3">Deity & Element</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {planetList.map((p) => {
              const kpInfo = kpSystem?.planets[p.planet as PlanetName];
              const karaka = karakaMap[p.planet];
              const vb = vimsopakaBala?.planets[p.planet as PlanetName];
              const deityInfo = PLANET_DEITIES[p.planet];

              // Angular distance from Sun
              let sunDist = Math.abs(p.longitude - sunLong);
              if (sunDist > 180) sunDist = 360 - sunDist;

              return (
                <tr key={p.planet} className="hover:bg-white/5 transition-colors">
                  {/* Planet */}
                  <td className="py-3 font-bold text-slate-100">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${
                        p.dignity === 'Exalted' ? 'bg-emerald-400' :
                        p.dignity === 'Own' ? 'bg-indigo-400' :
                        p.dignity === 'Debilitated' ? 'bg-rose-500' : 'bg-cosmic-gold'
                      }`} />
                      <div>
                        <div className="font-bold text-slate-100">{tGraha(p.planet)}</div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {p.planet === 'Surya' || p.planet === 'Chandra' ? 'Luminary' : 'Planet'}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Rashi */}
                  <td className="py-3">
                    <div className="font-semibold text-cosmic-celestial">{tRashi(p.sign)}</div>
                    <span className="text-[10px] text-slate-500 font-mono">Sign #{formatNumber(p.signIndex + 1)}</span>
                  </td>

                  {/* DMS Exact Longitude */}
                  <td className="py-3 font-mono">
                    <div className="text-amber-300 font-bold">
                      {formatNumber(p.deg)}° {formatNumber(p.min)}' {formatNumber(p.sec)}"
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Abs: {formatNumber(p.longitude.toFixed(2))}°
                    </span>
                  </td>

                  {/* Nakshatra & Pada */}
                  <td className="py-3">
                    <div className="text-slate-200 font-medium">
                      {tNakshatra(p.nakshatra)}
                    </div>
                    <span className="text-[10px] text-cosmic-gold font-bold">
                      {t('pada_label')} {formatNumber(p.pada)}
                    </span>
                  </td>

                  {/* Star / Sub-Lord */}
                  <td className="py-3 font-mono text-[11px]">
                    {kpInfo ? (
                      <div>
                        <div className="text-slate-300">
                          <span className="text-slate-500">St: </span>
                          <strong className="text-cosmic-gold">{tGraha(kpInfo.starLord)}</strong>
                        </div>
                        <div className="text-slate-400">
                          <span className="text-slate-500">Sub: </span>
                          <strong className="text-cosmic-celestial">{tGraha(kpInfo.subLord)}</strong>
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>

                  {/* Jaimini Chara Karaka */}
                  <td className="py-3">
                    {karaka ? (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        karaka === 'AK' ? 'bg-amber-400 text-cosmic-950 shadow' :
                        karaka === 'AmK' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' :
                        karaka === 'DK' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {karaka} {karaka === 'AK' && '👑'}
                      </span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>

                  {/* House & Navamsha */}
                  <td className="py-3 text-[11px]">
                    <div className="font-bold text-cosmic-gold">H{formatNumber(p.house)}</div>
                    <div className="text-cosmic-saffron text-[10px]">D9: {tRashi(p.navamshaSign)}</div>
                  </td>

                  {/* Dignity */}
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold block w-fit ${
                      p.dignity === 'Exalted' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      p.dignity === 'Own' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                      p.dignity === 'Debilitated' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      p.dignity === 'Friendly' ? 'bg-cyan-500/20 text-cyan-300' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {tDignity(p.dignity)}
                    </span>
                    {vb && (
                      <span className="text-[9px] text-slate-400 font-mono block mt-0.5">
                        Vim: {formatNumber(vb.vimsopakaScore)}/20
                      </span>
                    )}
                  </td>

                  {/* Asta / Motion */}
                  <td className="py-3">
                    <div className="flex flex-col gap-1">
                      {p.isRetrograde ? (
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-bold w-fit">
                          Ⓡ ବକ୍ରୀ (Retro)
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono">
                          ମାର୍ଗୀ (Direct)
                        </span>
                      )}

                      {p.isCombust ? (
                        <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.5 rounded font-bold w-fit flex items-center gap-1">
                          <Flame className="w-2.5 h-2.5" />
                          <span>ଅସ୍ତ ({formatNumber(sunDist.toFixed(1))}°)</span>
                        </span>
                      ) : (
                        p.planet !== 'Surya' && (
                          <span className="text-[9px] text-slate-500 font-mono">
                            Orb: {formatNumber(sunDist.toFixed(1))}°
                          </span>
                        )
                      )}
                    </div>
                  </td>

                  {/* Deity & Element */}
                  <td className="py-3 text-[10px]">
                    <div className="text-slate-300 font-medium">
                      {deityInfo ? deityInfo[language] : '—'}
                    </div>
                    <span className="text-slate-500">
                      {deityInfo ? `${deityInfo.element} • ${deityInfo.gender}` : ''}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
