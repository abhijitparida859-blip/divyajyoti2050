import React from 'react';
import { useI18n } from '../../localization/i18n';
import { HouseInfo, PlanetName, PlanetPosition, VargaType } from '../../types/jataka';
import { Kundali3DView } from './Kundali3DView';

interface Props {
  chartStyle: 'north' | 'south' | 'east' | 'west' | '3d';
  houses: HouseInfo[];
  vargaCode?: VargaType;
  planetsRecord?: Record<PlanetName, PlanetPosition>;
  ascendantDegree?: number;
}

const ZODIAC_GLYPHS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
const ZODIAC_OR = ['ମେଷ', 'ବୃଷ', 'ମିଥୁ', 'କର୍କ', 'ସିଂହ', 'କନ୍ୟା', 'ତୁଳା', 'ବିଛା', 'ଧନୁ', 'ମକର', 'କୁମ୍ଭ', 'ମୀନ'];

export const KundaliCharts: React.FC<Props> = ({
  chartStyle,
  houses,
  vargaCode = 'D1',
  planetsRecord,
  ascendantDegree = 0
}) => {
  const { t, formatNumber, language } = useI18n();

  const getPlanetLabel = (p: PlanetName): string => {
    let glyph = p.substring(0, 2);
    if (language === 'or') {
      const orMap: Record<PlanetName, string> = {
        Surya: 'ସୂ', Chandra: 'ଚଂ', Mangala: 'ମଂ', Budha: 'ବୁ',
        Guru: 'ଗୁ', Shukra: 'ଶୁ', Shani: 'ଶ', Rahu: 'ରା', Ketu: 'କେ'
      };
      glyph = orMap[p] || p;
    } else if (language === 'hi') {
      const hiMap: Record<PlanetName, string> = {
        Surya: 'सू', Chandra: 'चं', Mangala: 'मं', Budha: 'बु',
        Guru: 'गु', Shukra: 'शु', Shani: 'श', Rahu: 'रा', Ketu: 'के'
      };
      glyph = hiMap[p] || p;
    }

    if (planetsRecord && planetsRecord[p] && vargaCode === 'D1') {
      const pos = planetsRecord[p];
      const degStr = `${formatNumber(Math.floor(pos.degreeInSign))}°`;
      const retro = pos.isRetrograde ? 'Ⓡ' : '';
      const combust = pos.isCombust ? '🔥' : '';
      return `${glyph}${degStr}${retro}${combust}`;
    }

    return glyph;
  };

  return (
    <div className="flex flex-col items-center justify-center p-2">
      {/* 1. East Indian / Odia Panjika Crossed-Box Format */}
      {chartStyle === 'east' && (
        <div className="relative w-80 h-80 sm:w-96 sm:h-96 border-2 border-cosmic-gold/90 bg-cosmic-950 rounded-3xl shadow-2xl p-2 flex items-center justify-center overflow-hidden">
          <svg className="absolute inset-0 w-full h-full stroke-cosmic-gold/50 stroke-[1.5]" viewBox="0 0 400 400">
            <rect x="0" y="0" width="400" height="400" fill="none" />
            <line x1="0" y1="0" x2="400" y2="400" />
            <line x1="400" y1="0" x2="0" y2="400" />
            <polygon points="200,0 400,200 200,400 0,200" fill="none" />
            <polygon points="200,100 300,200 200,300 100,200" fill="none" strokeDasharray="3 3" />
          </svg>

          {/* House 1 (Lagna - Top Center) */}
          <div className="absolute top-4 inset-x-0 mx-auto text-center w-24">
            <span className="text-[9px] text-cosmic-gold font-bold">1 ({t('ascendant')}) • R{formatNumber(houses[0]?.signIndex + 1)}</span>
            <div className="text-[11px] text-amber-300 font-bold leading-tight mt-0.5">
              {houses[0]?.planets.map(p => getPlanetLabel(p)).join(' ') || '—'}
            </div>
          </div>

          {/* House 12 (Top Left) */}
          <div className="absolute top-6 left-6 text-center w-16">
            <span className="text-[9px] text-slate-400 font-bold">12 • R{formatNumber(houses[11]?.signIndex + 1)}</span>
            <div className="text-[10px] text-amber-300 font-bold">{houses[11]?.planets.map(p => getPlanetLabel(p)).join(' ') || '—'}</div>
          </div>

          {/* House 2 (Top Right) */}
          <div className="absolute top-6 right-6 text-center w-16">
            <span className="text-[9px] text-slate-400 font-bold">2 • R{formatNumber(houses[1]?.signIndex + 1)}</span>
            <div className="text-[10px] text-amber-300 font-bold">{houses[1]?.planets.map(p => getPlanetLabel(p)).join(' ') || '—'}</div>
          </div>

          {/* House 11 (Upper Left) */}
          <div className="absolute top-24 left-4 text-center w-16">
            <span className="text-[9px] text-slate-400 font-bold">11</span>
            <div className="text-[10px] text-amber-300 font-bold">{houses[10]?.planets.map(p => getPlanetLabel(p)).join(' ') || '—'}</div>
          </div>

          {/* House 3 (Upper Right) */}
          <div className="absolute top-24 right-4 text-center w-16">
            <span className="text-[9px] text-slate-400 font-bold">3</span>
            <div className="text-[10px] text-amber-300 font-bold">{houses[2]?.planets.map(p => getPlanetLabel(p)).join(' ') || '—'}</div>
          </div>

          {/* House 10 (Left Center) */}
          <div className="absolute inset-y-0 left-2 my-auto h-12 text-center w-16">
            <span className="text-[9px] text-cosmic-gold font-bold">10 (Karma)</span>
            <div className="text-[10px] text-amber-300 font-bold">{houses[9]?.planets.map(p => getPlanetLabel(p)).join(' ') || '—'}</div>
          </div>

          {/* House 4 (Right Center) */}
          <div className="absolute inset-y-0 right-2 my-auto h-12 text-center w-16">
            <span className="text-[9px] text-cosmic-gold font-bold">4 (Sukha)</span>
            <div className="text-[10px] text-amber-300 font-bold">{houses[3]?.planets.map(p => getPlanetLabel(p)).join(' ') || '—'}</div>
          </div>

          {/* House 9 (Lower Left) */}
          <div className="absolute bottom-24 left-4 text-center w-16">
            <span className="text-[9px] text-slate-400 font-bold">9 (Bhagya)</span>
            <div className="text-[10px] text-amber-300 font-bold">{houses[8]?.planets.map(p => getPlanetLabel(p)).join(' ') || '—'}</div>
          </div>

          {/* House 5 (Lower Right) */}
          <div className="absolute bottom-24 right-4 text-center w-16">
            <span className="text-[9px] text-slate-400 font-bold">5 (Putra)</span>
            <div className="text-[10px] text-amber-300 font-bold">{houses[4]?.planets.map(p => getPlanetLabel(p)).join(' ') || '—'}</div>
          </div>

          {/* House 8 (Bottom Left) */}
          <div className="absolute bottom-6 left-6 text-center w-16">
            <span className="text-[9px] text-slate-400 font-bold">8</span>
            <div className="text-[10px] text-amber-300 font-bold">{houses[7]?.planets.map(p => getPlanetLabel(p)).join(' ') || '—'}</div>
          </div>

          {/* House 6 (Bottom Right) */}
          <div className="absolute bottom-6 right-6 text-center w-16">
            <span className="text-[9px] text-slate-400 font-bold">6</span>
            <div className="text-[10px] text-amber-300 font-bold">{houses[5]?.planets.map(p => getPlanetLabel(p)).join(' ') || '—'}</div>
          </div>

          {/* House 7 (Bottom Center) */}
          <div className="absolute bottom-4 inset-x-0 mx-auto text-center w-24">
            <span className="text-[9px] text-cosmic-gold font-bold">7 (Kalatra)</span>
            <div className="text-[11px] text-amber-300 font-bold leading-tight mt-0.5">
              {houses[6]?.planets.map(p => getPlanetLabel(p)).join(' ') || '—'}
            </div>
          </div>

          {/* Center Brand */}
          <div className="text-center z-10 pointer-events-none">
            <span className="text-xl">🛕</span>
            <div className="text-[10px] text-cosmic-gold font-bold font-serif">ଦିବ୍ୟଜ୍ୟୋତି କାଳିଆ ପାଞ୍ଜି</div>
          </div>
        </div>
      )}

      {/* 2. North Indian Diamond Format */}
      {chartStyle === 'north' && (
        <div className="relative w-80 h-80 sm:w-96 sm:h-96 border-2 border-cosmic-gold/90 bg-cosmic-950 rounded-3xl shadow-2xl p-2 flex items-center justify-center overflow-hidden">
          <svg className="absolute inset-0 w-full h-full stroke-cosmic-gold/50 stroke-[1.5]" viewBox="0 0 400 400">
            <line x1="0" y1="0" x2="400" y2="400" />
            <line x1="400" y1="0" x2="0" y2="400" />
            <line x1="200" y1="0" x2="0" y2="200" />
            <line x1="0" y1="200" x2="200" y2="400" />
            <line x1="200" y1="400" x2="400" y2="200" />
            <line x1="400" y1="200" x2="200" y2="0" />
          </svg>

          {/* H1 */}
          <div className="absolute top-12 inset-x-0 mx-auto text-center w-24">
            <span className="text-[10px] text-cosmic-gold font-bold">1 • R{formatNumber(houses[0]?.signIndex + 1)}</span>
            <div className="text-xs font-bold text-amber-300">{houses[0]?.planets.map(p => getPlanetLabel(p)).join(' ') || '—'}</div>
          </div>

          {/* H2 */}
          <div className="absolute top-8 left-12 text-center w-16">
            <span className="text-[9px] text-slate-400 font-bold">2</span>
            <div className="text-[10px] text-amber-300 font-bold">{houses[1]?.planets.map(p => getPlanetLabel(p)).join(' ') || '—'}</div>
          </div>

          {/* H12 */}
          <div className="absolute top-8 right-12 text-center w-16">
            <span className="text-[9px] text-slate-400 font-bold">12</span>
            <div className="text-[10px] text-amber-300 font-bold">{houses[11]?.planets.map(p => getPlanetLabel(p)).join(' ') || '—'}</div>
          </div>

          {/* H3 */}
          <div className="absolute top-24 left-4 text-center w-16">
            <span className="text-[9px] text-slate-400 font-bold">3</span>
            <div className="text-[10px] text-amber-300 font-bold">{houses[2]?.planets.map(p => getPlanetLabel(p)).join(' ') || '—'}</div>
          </div>

          {/* H4 */}
          <div className="absolute inset-y-0 left-8 my-auto h-12 text-center w-16">
            <span className="text-[10px] text-cosmic-gold font-bold">4</span>
            <div className="text-xs font-bold text-amber-300">{houses[3]?.planets.map(p => getPlanetLabel(p)).join(' ') || '—'}</div>
          </div>

          {/* H5 */}
          <div className="absolute bottom-24 left-4 text-center w-16">
            <span className="text-[9px] text-slate-400 font-bold">5</span>
            <div className="text-[10px] text-amber-300 font-bold">{houses[4]?.planets.map(p => getPlanetLabel(p)).join(' ') || '—'}</div>
          </div>

          {/* H6 */}
          <div className="absolute bottom-8 left-12 text-center w-16">
            <span className="text-[9px] text-slate-400 font-bold">6</span>
            <div className="text-[10px] text-amber-300 font-bold">{houses[5]?.planets.map(p => getPlanetLabel(p)).join(' ') || '—'}</div>
          </div>

          {/* H7 */}
          <div className="absolute bottom-12 inset-x-0 mx-auto text-center w-24">
            <span className="text-[10px] text-cosmic-gold font-bold">7</span>
            <div className="text-xs font-bold text-amber-300">{houses[6]?.planets.map(p => getPlanetLabel(p)).join(' ') || '—'}</div>
          </div>

          {/* H8 */}
          <div className="absolute bottom-8 right-12 text-center w-16">
            <span className="text-[9px] text-slate-400 font-bold">8</span>
            <div className="text-[10px] text-amber-300 font-bold">{houses[7]?.planets.map(p => getPlanetLabel(p)).join(' ') || '—'}</div>
          </div>

          {/* H9 */}
          <div className="absolute bottom-24 right-4 text-center w-16">
            <span className="text-[9px] text-slate-400 font-bold">9</span>
            <div className="text-[10px] text-amber-300 font-bold">{houses[8]?.planets.map(p => getPlanetLabel(p)).join(' ') || '—'}</div>
          </div>

          {/* H10 */}
          <div className="absolute inset-y-0 right-8 my-auto h-12 text-center w-16">
            <span className="text-[10px] text-cosmic-gold font-bold">10</span>
            <div className="text-xs font-bold text-amber-300">{houses[9]?.planets.map(p => getPlanetLabel(p)).join(' ') || '—'}</div>
          </div>

          {/* H11 */}
          <div className="absolute top-24 right-4 text-center w-16">
            <span className="text-[9px] text-slate-400 font-bold">11</span>
            <div className="text-[10px] text-amber-300 font-bold">{houses[10]?.planets.map(p => getPlanetLabel(p)).join(' ') || '—'}</div>
          </div>
        </div>
      )}

      {/* 3. South Indian Box Format */}
      {chartStyle === 'south' && (
        <div className="grid grid-cols-4 grid-rows-4 w-80 h-80 sm:w-96 sm:h-96 border-2 border-cosmic-gold/90 bg-cosmic-950 rounded-3xl shadow-2xl p-1 gap-1">
          {Array.from({ length: 16 }).map((_, i) => {
            const isCenter = [5, 6, 9, 10].includes(i);
            if (isCenter) {
              if (i === 5) {
                return (
                  <div key={i} className="col-span-2 row-span-2 flex flex-col items-center justify-center border border-cosmic-gold/30 bg-cosmic-900/60 rounded-2xl text-center">
                    <span className="text-2xl">🕉️</span>
                    <span className="text-xs font-bold text-cosmic-gold font-serif">SOUTH INDIAN</span>
                  </div>
                );
              }
              return null;
            }

            // Fixed zodiac sign index for south indian layout
            const southSignMap = [11, 0, 1, 2, 10, -1, -1, 3, 9, -1, -1, 4, 8, 7, 6, 5];
            const signIdx = southSignMap[i];
            const houseObj = houses.find(h => h.signIndex === signIdx);
            const isLagna = houseObj?.houseNumber === 1;

            return (
              <div
                key={i}
                className={`border rounded-xl p-1.5 text-[10px] flex flex-col justify-between transition-colors ${
                  isLagna ? 'border-cosmic-gold bg-cosmic-gold/15' : 'border-slate-800 hover:border-cosmic-gold/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-bold">{formatNumber(signIdx + 1)}</span>
                  {isLagna && <span className="text-[9px] bg-cosmic-gold text-cosmic-950 px-1 rounded font-bold">LAG</span>}
                </div>
                <div className="text-amber-300 font-bold text-center leading-tight">
                  {houseObj?.planets.map(p => getPlanetLabel(p)).join(' ') || ''}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Western / West Indian 360° Circular Bhachakra Wheel */}
      {chartStyle === 'west' && (
        <div className="relative w-80 h-80 sm:w-96 sm:h-96 border-2 border-cosmic-gold/90 bg-cosmic-950 rounded-3xl shadow-2xl p-2 flex items-center justify-center overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 400 400">
            <defs>
              <radialGradient id="cosmicHub" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#030712" stopOpacity="0.95" />
              </radialGradient>
            </defs>

            {/* Concentric Cosmic Circles */}
            <circle cx="200" cy="200" r="185" fill="none" stroke="#eab308" strokeWidth="2" strokeOpacity="0.8" />
            <circle cx="200" cy="200" r="150" fill="none" stroke="#eab308" strokeWidth="1" strokeOpacity="0.4" />
            <circle cx="200" cy="200" r="55" fill="url(#cosmicHub)" stroke="#eab308" strokeWidth="1.5" strokeOpacity="0.7" />

            {/* 12 House Radial Spokes */}
            {Array.from({ length: 12 }).map((_, i) => {
              // 1st house begins at 180 deg (East Horizon / left) and proceeds counter-clockwise
              const angleDeg = 180 + i * 30;
              const angleRad = (angleDeg * Math.PI) / 180;
              const x1 = 200 + 55 * Math.cos(angleRad);
              const y1 = 200 + 55 * Math.sin(angleRad);
              const x2 = 200 + 185 * Math.cos(angleRad);
              const y2 = 200 + 185 * Math.sin(angleRad);

              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={i === 0 ? '#f59e0b' : '#64748b'}
                  strokeWidth={i === 0 ? '2' : '0.8'}
                  strokeOpacity={i === 0 ? '0.9' : '0.4'}
                  strokeDasharray={i === 0 ? undefined : '2 2'}
                />
              );
            })}

            {/* 12 Zodiac Ring Glyphs in Outer Band */}
            {Array.from({ length: 12 }).map((_, i) => {
              // Align with signs from ascendant sign
              const signIdx = (houses[0]?.signIndex + i) % 12;
              const midAngleDeg = 180 + i * 30 + 15;
              const midRad = (midAngleDeg * Math.PI) / 180;
              const x = 200 + 167 * Math.cos(midRad);
              const y = 200 + 167 * Math.sin(midRad);

              return (
                <text
                  key={i}
                  x={x}
                  y={y + 4}
                  textAnchor="middle"
                  fill="#fcd34d"
                  fontSize="12"
                  fontWeight="bold"
                  className="select-none font-sans"
                >
                  {ZODIAC_GLYPHS[signIdx]}
                </text>
              );
            })}

            {/* House Numbers & Occupant Planets inside the 12 Sectors */}
            {houses.map((h, i) => {
              const startAngle = 180 + i * 30;
              const midAngle = startAngle + 15;
              const midRad = (midAngle * Math.PI) / 180;

              // House number placement (near inner hub)
              const hNumX = 200 + 72 * Math.cos(midRad);
              const hNumY = 200 + 72 * Math.sin(midRad);

              // House planets placement (midway)
              const pX = 200 + 112 * Math.cos(midRad);
              const pY = 200 + 112 * Math.sin(midRad);

              return (
                <g key={i}>
                  {/* House Number */}
                  <text
                    x={hNumX}
                    y={hNumY + 3}
                    textAnchor="middle"
                    fill={i === 0 ? '#fbbf24' : '#94a3b8'}
                    fontSize="9"
                    fontWeight="bold"
                    className="select-none font-mono"
                  >
                    H{formatNumber(h.houseNumber)}
                  </text>

                  {/* Planets text in this sector */}
                  {h.planets.length > 0 && (
                    <text
                      x={pX}
                      y={pY + 3}
                      textAnchor="middle"
                      fill="#fde047"
                      fontSize="10"
                      fontWeight="bold"
                      className="select-none"
                    >
                      {h.planets.map(p => getPlanetLabel(p)).join(' ')}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Ascendant Marker Arrow on the Left Horizon */}
            <g>
              <line x1="10" y1="200" x2="45" y2="200" stroke="#f59e0b" strokeWidth="2.5" />
              <polygon points="45,196 55,200 45,204" fill="#f59e0b" />
              <text x="32" y="192" fill="#fbbf24" fontSize="9" fontWeight="black" textAnchor="middle">
                ASC
              </text>
            </g>

            {/* Center Cosmic Emblem */}
            <circle cx="200" cy="200" r="50" fill="#090d16" stroke="#ca8a04" strokeWidth="1" />
            <text x="200" y="196" textAnchor="middle" fontSize="18" className="select-none">
              ☸️
            </text>
            <text x="200" y="214" textAnchor="middle" fill="#fcd34d" fontSize="8" fontWeight="bold" className="font-serif">
              ପଶ୍ଚିମାତ୍ୟ ଭାଚକ୍ର
            </text>
          </svg>
        </div>
      )}

      {/* 5. 3D Celestial Bhachakra Orbit View */}
      {chartStyle === '3d' && (
        <div className="w-full">
          <Kundali3DView
            planetsRecord={planetsRecord}
            houses={houses}
            ascendantDegree={ascendantDegree}
            vargaCode={vargaCode}
          />
        </div>
      )}
    </div>
  );
};
