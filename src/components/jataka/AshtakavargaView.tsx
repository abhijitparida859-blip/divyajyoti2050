import React from 'react';
import { useI18n } from '../../localization/i18n';
import { HouseInfo, PlanetPosition, PlanetName } from '../../types/jataka';
import { calculateAshtakavarga, calculatePlanetaryAspects, RASHI_LORDS } from '../../core/jataka/kundali_engine';
import { Layers, Eye, Sparkles } from 'lucide-react';

interface Props {
  houses: HouseInfo[];
  planets: Record<PlanetName, PlanetPosition>;
}

export const AshtakavargaView: React.FC<Props> = ({ houses, planets }) => {
  const { t, formatNumber, tRashi, tGraha, language } = useI18n();

  const savPoints = React.useMemo(() => {
    return calculateAshtakavarga(planets);
  }, [planets]);

  const aspects = React.useMemo(() => {
    return calculatePlanetaryAspects(planets);
  }, [planets]);

  const BHAVA_NAMES = {
    en: ['Tanu (Self)', 'Dhana (Wealth)', 'Sahaja (Courage)', 'Sukha (Property)', 'Putra (Intellect)', 'Ripu (Obstacles)', 'Kalatra (Spouse)', 'Ayur (Longevity)', 'Bhagya (Fortune)', 'Karma (Career)', 'Labha (Gains)', 'Vyaya (Moksha)'],
    hi: ['तनु (देह/व्यक्तित्व)', 'धन (संपत्ति/वाणी)', 'सहज (पराक्रम/भाई)', 'सुख (मातृ/भवन)', 'पुत्र (संतान/बुद्धि)', 'रिपु (रोग/शत्रु)', 'कलत्र (दांपत्य/साझेदारी)', 'आयु (आयुष्य/गूढ़)', 'भाग्य (धर्म/तीर्थ)', 'कर्म (व्यवसाय/कीर्ति)', 'लाभ (आय/सिद्धि)', 'व्यय (मोक्ष/विदेश)'],
    or: ['ତନୁ (ବ୍ୟକ୍ତିତ୍ୱ/ଶରୀର)', 'ଧନ (ସମ୍ପତ୍ତି/ବାଣୀ)', 'ସହଜ (ପରାକ୍ରମ/ଭ୍ରାତା)', 'ସୁଖ (ମାତୃ/ଭୂମି)', 'ପୁତ୍ର (ସନ୍ତାନ/ବୁଦ୍ଧି)', 'ରିପୁ (ରୋଗ/ଶତ୍ରୁ)', 'କଳତ୍ର (ଦାମ୍ପତ୍ୟ/ସୁଖ)', 'ଆୟୁ (ଆୟୁଷ/ନିଗୂଢ଼)', 'ଭାଗ୍ୟ (ଧର୍ମ/ଭାଗ୍ୟୋଦୟ)', 'କର୍ମ (ବ୍ୟବସାୟ/ପ୍ରତିଷ୍ଠା)', 'ଲାଭ (ପ୍ରଚୁର ଲାଭ)', 'ବ୍ୟୟ (ମୋକ୍ଷ/ସାଧନା)']
  };

  return (
    <div className="space-y-6">
      {/* Ashtakavarga 12 Bhavas Grid */}
      <div className="bg-cosmic-900/70 border border-cosmic-gold/30 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 font-serif">
              <Layers className="w-4 h-4 text-cosmic-gold" />
              <span>Sarvashtakavarga Strength (ସର୍ବାଷ୍ଟକବର୍ଗ ବିନ୍ଦୁ)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              337 Total Bindus distributed across 12 Bhavas (≥28 indicates strong positive energy)
            </p>
          </div>
          <span className="text-xs font-bold text-cosmic-gold bg-cosmic-gold/20 border border-cosmic-gold/40 px-3 py-1 rounded-full">
            Total 337 Bindus
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {houses.map((h, idx) => {
            const pts = savPoints[idx];
            const isHigh = pts >= 30;
            const isMid = pts >= 26 && pts < 30;

            return (
              <div
                key={h.houseNumber}
                className="bg-cosmic-950/70 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col justify-between hover:border-cosmic-gold/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-cosmic-gold">H{formatNumber(h.houseNumber)}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isHigh ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      isMid ? 'bg-cyan-500/20 text-cyan-300' :
                      'bg-rose-500/20 text-rose-300'
                    }`}>
                      {formatNumber(pts)} pts
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-200">{BHAVA_NAMES[language][idx]}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {tRashi(h.sign)} • Lord: {tGraha(RASHI_LORDS[h.sign])}
                  </div>
                </div>

                <div className="mt-3">
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${
                        isHigh ? 'bg-gradient-to-r from-emerald-400 to-cosmic-gold' :
                        isMid ? 'bg-cyan-400' : 'bg-rose-400'
                      }`}
                      style={{ width: `${Math.min(100, (pts / 40) * 100)}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {h.planets.length > 0 ? (
                      <span className="text-amber-300 font-semibold">{h.planets.map(p => tGraha(p)).join(', ')}</span>
                    ) : (
                      'No planet'
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Planetary Aspects (Graha Drishti) Matrix */}
      <div className="bg-cosmic-900/70 border border-cosmic-gold/30 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-4 font-serif">
          <Eye className="w-4 h-4 text-cosmic-saffron" />
          <span>Planetary Aspects & Special Visions (ଗ୍ରହ ଦୃଷ୍ଟି)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {aspects.map(a => (
            <div key={a.planet} className="p-3.5 rounded-xl bg-cosmic-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cosmic-gold" />
                  {tGraha(a.planet)}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  In House {formatNumber(planets[a.planet].house)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Aspects Houses</div>
                <div className="text-xs font-bold text-cosmic-gold">
                  {a.aspectedHouses.map(h => `H${formatNumber(h)}`).join(', ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};