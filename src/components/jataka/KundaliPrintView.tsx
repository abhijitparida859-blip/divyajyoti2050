import React, { useMemo } from 'react';
import { useI18n } from '../../localization/i18n';
import { BirthChartData } from '../../types/jataka';
import { calculateYearlyForecast } from '../../core/jataka/yearly_forecast_engine';
import { getDashaPhala } from '../../core/jataka/yearly_forecast_engine';
import { KundaliChartsView } from './KundaliChartsView';
import { Printer } from 'lucide-react';
import { PrintMode } from './PrintControls';

interface Props {
  chartData: BirthChartData;
  onPrint: () => void;
  hideHeader?: boolean;
  /** short = essentials only • full = all 18 chapters • year = chosen year's complete data */
  mode?: PrintMode;
  /** chosen year (used when mode === 'year') */
  year?: number;
}

export const KundaliPrintView: React.FC<Props> = ({ chartData, hideHeader = false, mode = 'full', year: chosenYear }) => {
  const { language, tRashi, tGraha, tNakshatra, formatNumber } = useI18n();
  const selYear = chosenYear ?? new Date().getFullYear();
  // Full/short editions start from today; the "year" edition covers the chosen calendar year Jan-01 → Dec-31
  const yearData = useMemo(
    () => calculateYearlyForecast(
      chartData.planets.Chandra.signIndex,
      chartData.planets.Chandra.nakshatraIndex - 1,
      chartData.dashas as any[],
      mode === 'year' ? new Date(selYear, 0, 1) : new Date()
    ),
    [chartData, mode, selYear]
  );
  const year = yearData;
  const maha = chartData.currentDasha.mahadasha;
  const order: (keyof typeof chartData.planets)[] = ['Surya', 'Chandra', 'Mangala', 'Budha', 'Guru', 'Shukra', 'Shani', 'Rahu', 'Ketu'];
  const genDate = new Date().toLocaleDateString('en-GB');
  const rashiGlyph = { Mesha: '♈', Vrishabha: '♉', Mithuna: '♊', Karka: '♋', Simha: '♌', Kanya: '♍', Tula: '♎', Vrischika: '♏', Dhanu: '♐', Makara: '♑', Kumbha: '♒', Meena: '♓' } as Record<string, string>;
  const monthLabel = (ym: string) => { try { return new Date(ym + '-01T00:00:00').toLocaleDateString(language === 'or' ? 'or-IN' : language === 'hi' ? 'hi-IN' : 'en-GB', { month: 'long', year: 'numeric' }); } catch { return ym; } };
  const monthGroups = (() => {
    const g: Record<string, typeof year.days> = {};
    for (const d of year.days) { const k = d.dateStr.slice(0, 7); (g[k] = g[k] ?? []).push(d); }
    return Object.entries(g);
  })();
  const editionLabel =
    mode === 'short'
      ? (language === 'or' ? 'ସଂକ୍ଷିପ୍ତ ସଂସ୍କରଣ (ଜରୁରୀ ବିଷୟ)' : language === 'hi' ? 'संक्षिप्त संस्करण (आवश्यक विषय)' : 'Short Edition (Essentials)')
      : mode === 'year'
      ? (language === 'or' ? `ସନ୍ ${selYear} ସଂପୂର୍ଣ୍ଣ ବର୍ଷ ସଂସ୍କରଣ` : language === 'hi' ? `सन् ${selYear} — संपूर्ण वर्ष संस्करण` : `Year ${selYear} — Complete Year Edition`)
      : (language === 'or' ? 'ସମ୍ପୂର୍ଣ୍ଣ ଜୀବନ ସଂସ୍କରଣ' : language === 'hi' ? 'संपूर्ण जीवन संस्करण' : 'Full Life Edition');
  return (
    <div className="space-y-4">
      {!hideHeader && (
      <div className="rounded-3xl border border-cosmic-gold/40 bg-cosmic-900/60 p-4 sm:p-6 print:hidden">
        <h3 className="text-base font-black text-slate-100 flex items-center gap-2"><Printer className="w-5 h-5 text-cosmic-gold" /> 📖 {editionLabel}</h3>
        <p className="text-xs text-slate-400 mt-1">
          {mode === 'short'
            ? (language === 'or' ? 'କେବଳ ଜରୁରୀ ଅଧ୍ୟାୟ: ଜନ୍ମ, କୁଣ୍ଡଳୀ, ଦଶା, ଯୋଗ, ବଳ, ଭବିଷ୍ୟବାଣୀ — ଉପରେ ପ୍ରିଣ୍ଟ / ସେୟାର ବଟନ୍।' : language === 'hi' ? 'केवल आवश्यक अध्याय: जन्म, कुंडली, दशा, योग, बल, भविष्यवाणी — ऊपर प्रिंट / शेयर बटन।' : 'Essential chapters only: Birth, Chart, Dasha, Yogas, Strength, Predictions — use the Print / Share buttons above.')
            : mode === 'year'
            ? (language === 'or' ? `ସନ୍ ${selYear}ର ପ୍ରତିଟି ଦିନର ଡାଟା — ତିଥି, ନକ୍ଷତ୍ର, ଦଶା, ସ୍କୋର, ଫଳ।` : language === 'hi' ? `सन् ${selYear} का हर एक दिन — तिथि, नक्षत्र, दशा, स्कोर, फल।` : `Every single day of ${selYear} — Tithi, Nakshatra, Dasha, Score, Phala.`)
            : (language === 'or' ? 'କବର, ସୂଚୀ, ୧୮ ଅଧ୍ୟାୟ — ସବୁ ୨୭ ବିଭାଗ ଛପା, ପ୍ରତି ଅଧ୍ୟାୟ ନୂଆ ପୃଷ୍ଠାରୁ ଆରମ୍ଭ।' : language === 'hi' ? 'कवर, सूची, 18 अध्याय — सभी 27 विभाग छपे, हर अध्याय नए पेज से।' : 'Cover, Index, 18 chapters — all 27 sections printed, each chapter starts a new page.')}
        </p>
      </div>
      )}
      <div className="vedic-book kundali-print-sheet bg-white text-black">
        {/* ============ COVER PAGE ============ */}
        <div className="book-cover">
          <div className="book-cover-inner">
            <div className="text-3xl">🕉</div>
            <div className="text-xs tracking-[0.3em] uppercase mt-2">श्री जगन्नाथाय नमः • ଶ୍ରୀଜଗନ୍ନାଥାୟ ନମଃ</div>
            <h1 className="book-title">🛕 DivyaJyoti Kalia Panjika<br />Vedic Kundali Grantha</h1>
            <div className="text-sm mt-1">ଦିବ୍ୟଜ୍ୟୋତି କାଳିଆ ପାଞ୍ଜି • ବୈଦିକ କୁଣ୍ଡଳୀ ଗ୍ରନ୍ଥ</div>
            <div className="book-rule" />
            <div className="text-4xl font-serif font-black mt-3">{chartData.nativeName}</div>
            <div className="text-base mt-1">{rashiGlyph[chartData.ascendantSign]} {tRashi(chartData.ascendantSign)} Lagna • {rashiGlyph[chartData.planets.Chandra.sign]} {tRashi(chartData.planets.Chandra.sign)} Rashi</div>
            <div className="book-cover-grid">
              <div><b>Janma Tithi</b><br />{chartData.dateTime.slice(0, 10)}</div>
              <div><b>Sthan</b><br />{chartData.birthPlace}</div>
              <div><b>Latitude</b><br />{chartData.latitude}° N</div>
              <div><b>Longitude</b><br />{chartData.longitude}° E</div>
            </div>
            <div className="book-rule" />
            <div className="text-[11px] mt-3">Ayanamsa: Lahiri (Chitra-Paksha) {chartData.ayanamsa}°<br /><b>{editionLabel}</b> • 100% Offline Parashari Ganana • ଦିବ୍ୟଜ୍ୟୋତି କାଳିଆ ପାଞ୍ଜି (DivyaJyoti Kalia Panjika)<br />Generated: {genDate}</div>
          </div>
        </div>
        {/* ============ TABLE OF CONTENTS ============ */}
        <div className="book-chapter">
          <div className="book-chapter-head">सूचीपत्रं • ସୂଚୀପତ୍ର • Contents</div>
          <ol className="book-toc">
            <li><b>अध्याय १ — जन्मविवरण एवं जन्म पञ्चाङ्ग</b> (Birth Profile &amp; 5 Pillars)</li>
            {mode !== 'year' && (<>
            <li><b>अध्याय २ — कुण्डली चक्र एवं ग्रह स्फुट</b> (12-House Chakra + 9 Graha DMS)</li>
            <li><b>अध्याय ३ — पञ्चस्तरीय विंशोत्तरी दशा एवं फल</b> (5-Tier Dasha + Phala)</li>
            <li><b>अध्याय ४ — योग एवं दोष</b> (Yogas, Manglik, Kala-Sarpa, Sade-Sati)</li>
            <li><b>अध्याय ५ — ग्रह बल: षड्बल, विंशोपक एवं अष्टकवर्ग</b> (Shadbala, Vimsopaka, 337-Bindu)</li>
            </>)}
            {mode === 'full' && (<>
            <li><b>अध्याय ५.५ — आलेख एवं ग्राफ</b> (Advance Charts &amp; Graphs)</li>
            <li><b>अध्याय ६ — जीवन क्षेत्र एवं उपचार</b> (Life Domains, Ratna, Rudraksha, Daana)</li>
            <li><b>अध्याय ७ — विशेष लग्न एवं उपग्रह</b> (Special Lagnas, Indu Lagna, Upagrahas)</li>
            <li><b>अध्याय ८ — आवाखड़ा</b> (Avakhada: Varna, Vashya, Yoni, Gana, Nadi)</li>
            <li><b>अध्याय ९ — ग्रह अवस्था</b> (Planetary Avasthas: Bala-Adi, Deepta-Adi)</li>
            <li><b>अध्याय १० — भृगु नाडी ज्योतिष</b> (Bhrigu Nandi Nadi Combinations)</li>
            <li><b>अध्याय ११ — केपी प्रणाली</b> (KP System: Planets, Cusps, Star/Sub Lord)</li>
            <li><b>अध्याय १२ — जैमिनी दर्शन</b> (Chara Karakas, Arudha, Upapada, Karakamsha)</li>
            <li><b>अध्याय १३ — भाव चलित</b> (Bhava Chalit: Cusps &amp; Shifted Planets)</li>
            <li><b>अध्याय १४ — भाव विश्लेषण</b> (12-Bhava Detailed Analysis)</li>
            <li><b>अध्याय १५ — गोचर भ्रमण</b> (Gochara Transits &amp; Sade-Sati)</li>
            <li><b>अध्याय १६ — पवित्र नक्षत्र</b> (Sacred Nakshatra: Tree, Deity, Symbol)</li>
            </>)}
            {mode !== 'year' && <li><b>अध्याय १७ — जीवन भविष्यवाणी</b> (Life Predictions: 6 Pillars)</li>}
            {mode !== 'short' && <li><b>{mode === 'year' ? `अध्याय — सन् ${selYear} वार्षिक भविष्यफल` : 'अध्याय १८ — ३६५-दिन वार्षिक भविष्यफल'}</b> ({mode === 'year' ? `every single day of ${selYear}` : 'Daily Varshaphala, every single day'})</li>}
          </ol>
        </div>

        {/* ============ CHAPTER 1 — Birth Profile & Janma Panchanga ============ */}
        <div className="book-chapter">
          <div className="book-chapter-head">अध्याय १ — जन्मविवरण एवं जन्म पञ्चाङ्ग<br /><span className="chapter-sub">Chapter 1 — Birth Profile & Janma Panchanga (5 Pillars)</span></div>
          <table className="book-table">
            <tbody>
              <tr><td className="k">नाम / Name</td><td>{chartData.nativeName}</td><td className="k">लिंग / Gender</td><td>{chartData.gender}</td></tr>
              <tr><td className="k">जन्म तिथि / Date</td><td>{chartData.dateTime.slice(0, 10)}</td><td className="k">स्थान / Place</td><td>{chartData.birthPlace}</td></tr>
              <tr><td className="k">अक्षांश / Latitude</td><td>{chartData.latitude}°</td><td className="k">देशांतर / Longitude</td><td>{chartData.longitude}°</td></tr>
              <tr><td className="k">लग्न / Lagna</td><td>{tRashi(chartData.ascendantSign)} ({chartData.ascendantDegree}°)</td><td className="k">चन्द्र राशि / Moon</td><td>{tRashi(chartData.planets.Chandra.sign)} • {tNakshatra(chartData.planets.Chandra.nakshatra)}-{chartData.planets.Chandra.pada}</td></tr>
              <tr><td className="k">अयनांश / Ayanamsa</td><td>{chartData.ayanamsa}° (Lahiri)</td><td className="k">वर्तमान दशा / Dasha</td><td>{tGraha(maha)} / {tGraha(chartData.currentDasha.antardasha)}</td></tr>
            </tbody>
          </table>
          <div className="book-subhead">जन्म पञ्चाङ्ग — 5 Sacred Pillars</div>
          <table className="book-table">
            <tbody>
              {[chartData.janmaPanchanga.tithi, chartData.janmaPanchanga.vara, chartData.janmaPanchanga.nakshatra, chartData.janmaPanchanga.yoga, chartData.janmaPanchanga.karana].map((pl, i) => (
                <tr key={i}><td className="k">{pl.name[language]}</td><td>{pl.value[language]}</td><td className="k">Lord</td><td>{typeof pl.rulingLord === 'string' ? (['Surya','Chandra','Mangala','Budha','Guru','Shukra','Shani','Rahu','Ketu'].includes(pl.rulingLord) ? tGraha(pl.rulingLord as any) : pl.rulingLord) : '-'}</td></tr>
              ))}
            </tbody>
          </table>
          <div className="book-subhead">आज का शुभ मार्गदर्शन / Lucky Guidelines</div>
          <div className="book-note">रंग: {chartData.dailyGuide.luckyGuidelines.color[language]} • अंक: {formatNumber(chartData.dailyGuide.luckyGuidelines.number)} • दिशा: {chartData.dailyGuide.luckyGuidelines.direction[language]}<br />मन्त्र: {chartData.dailyGuide.luckyGuidelines.mantra}</div>
          <div className="book-subhead">तराबला एवं चन्द्रबल / Tarabala & Chandrabala</div>
          <table className="book-table">
            <tbody>
              <tr><td className="k">तारा / Tara</td><td>{chartData.dailyGuide.tarabala.taraName[language]} ({chartData.dailyGuide.tarabala.taraType}) — {chartData.dailyGuide.tarabala.isAuspicious ? 'शुभ ✅' : 'अशुभ ⚠️'}</td></tr>
              <tr><td className="k">मार्गदर्शन / Guidance</td><td>{chartData.dailyGuide.tarabala.guidance[language]}</td></tr>
              <tr><td className="k">चन्द्रबल / Chandrabala</td><td>H{formatNumber(chartData.dailyGuide.chandrabala.houseFromNatalMoon)} — {chartData.dailyGuide.chandrabala.isAuspicious ? 'शुभ ✅' : 'अशुभ ⚠️'}</td></tr>
              <tr><td className="k">मार्गदर्शन / Guidance</td><td>{chartData.dailyGuide.chandrabala.guidance[language]}</td></tr>
            </tbody>
          </table>
        </div>
        {mode !== 'year' && (<>
        {/* ============ CHAPTER 2 — Kundali Chakra + Graha Sphutas ============ */}
        <div className="book-chapter">
          <div className="book-chapter-head">अध्याय २ — कुण्डली चक्र एवं ग्रह स्फुट<br /><span className="chapter-sub">Chapter 2 — 12-House Chakra & 9-Graha Sphutas (DMS)</span></div>
          <div className="chouka-grid">
            {[
              { h: 1, r: 1, c: 1 }, { h: 2, r: 1, c: 2 }, { h: 3, r: 1, c: 3 }, { h: 4, r: 1, c: 4 },
              { h: 5, r: 2, c: 4 }, { h: 6, r: 3, c: 4 }, { h: 7, r: 4, c: 4 }, { h: 8, r: 4, c: 3 },
              { h: 9, r: 4, c: 2 }, { h: 10, r: 4, c: 1 }, { h: 11, r: 3, c: 1 }, { h: 12, r: 2, c: 1 },
            ].map(cell => {
              const house = chartData.houses[cell.h - 1];
              const occupants = house.planets.map(g => tGraha(g)).join(' ');
              return (
                <div key={cell.h} className="chouka-cell" style={{ gridRow: cell.r, gridColumn: cell.c }}>
                  <div className="chouka-meta">{formatNumber(cell.h)} • {tRashi(house.sign)}</div>
                  <div className="chouka-planets">{occupants || '—'}</div>
                </div>
              );
            })}
            <div className="chouka-center">
              <div className="text-sm font-black">🛕 {chartData.nativeName}</div>
              <div className="text-[10px]">{chartData.dateTime.slice(0, 10)} • {chartData.birthPlace}</div>
              <div className="text-[10px] font-bold">{tRashi(chartData.ascendantSign)} Lagna ({chartData.ascendantDegree}°)</div>
              <div className="text-[9px] mt-0.5">EAST / ODIYA CHOUKA STYLE</div>
            </div>
          </div>
          <div className="book-subhead">ग्रह स्फुट तालिका / Planetary Positions</div>
          <table className="book-table">
            <thead><tr><th>Graha</th><th>Rashi</th><th>DMS</th><th>Nakshatra-Pada</th><th>House</th><th>Dignity</th><th>Vakri</th><th>Navamsha</th></tr></thead>
            <tbody>{order.map(g => { const p = chartData.planets[g]; return (<tr key={g}><td className="font-bold">{tGraha(g)}</td><td>{tRashi(p.sign)}</td><td>{p.deg}°{p.min}'{p.sec}"</td><td>{tNakshatra(p.nakshatra)}-{p.pada}</td><td>{formatNumber(p.house)}</td><td>{p.dignity}{p.isCombust ? ' +Combust' : ''}</td><td>{p.isRetrograde ? '✓' : '—'}</td><td>{tRashi(p.navamshaSign)}</td></tr>); })}</tbody>
          </table>
        </div>


        {/* ============ CHAPTER 3 — 5-Tier Dasha ============ */}
        <div className="book-chapter">
          <div className="book-chapter-head">अध्याय ३ — पञ्चस्तरीय विंशोत्तरी दशा एवं फल<br /><span className="chapter-sub">Chapter 3 — 5-Tier Vimshottari Dasha (Maha→Antar→Pratyantar→Sookshma→Prana)</span></div>
          <div className="book-note"><b>वर्तमान श्रृंखला / Current Chain:</b> {tGraha(maha)} (Maha) → {tGraha(chartData.currentDasha.antardasha)} (Antar) → {chartData.currentDasha.pratyantardasha ? tGraha(chartData.currentDasha.pratyantardasha) : '—'} (Pratyantar) → {chartData.currentDasha.sookshmasha ? tGraha(chartData.currentDasha.sookshmasha) : '—'} (Sookshma) → {chartData.currentDasha.pranadasha ? tGraha(chartData.currentDasha.pranadasha) : '—'} (Prana) — {chartData.currentDasha.startDate} to {chartData.currentDasha.endDate} ({formatNumber(chartData.currentDasha.progressPercentage)}% पूर्ण)</div>
          <div className="book-subhead">महादशा समयरेखा / Mahadasha Timeline</div>
          <table className="book-table">
            <thead><tr><th>Mahadasha</th><th>Start</th><th>End</th><th>Varsh</th></tr></thead>
            <tbody>{chartData.dashas.map(d => (
              <tr key={d.planet} className={d.planet === maha ? 'row-active' : ''}><td className="font-bold">{tGraha(d.planet)}{d.planet === maha ? ' ◄ चालू' : ''}</td><td>{d.startDate}</td><td>{d.endDate}</td><td>{formatNumber(d.durationYears)}</td></tr>
            ))}</tbody>
          </table>
          <div className="book-subhead">दशा फलवाणी / Dasha Phala</div>
          <div className="book-note"><b>{tGraha(maha)}:</b> {getDashaPhala(maha)[language]}</div>
          <div className="book-note"><b>{tGraha(chartData.currentDasha.antardasha)}:</b> {getDashaPhala(chartData.currentDasha.antardasha)[language]}</div>
        </div>
        {/* ============ CHAPTER 4 — Yogas & Doshas ============ */}
        <div className="book-chapter">
          <div className="book-chapter-head">अध्याय ४ — योग एवं दोष<br /><span className="chapter-sub">Chapter 4 — Yogas ({formatNumber(chartData.yogas.length)}), Manglik, Kala-Sarpa, Sade-Sati</span></div>
          <table className="book-table">
            <thead><tr><th>#</th><th>Yoga</th><th>Type</th><th>Grahas</th><th>Effect</th></tr></thead>
            <tbody>{chartData.yogas.map((y, i) => (
              <tr key={y.id + i}><td>{formatNumber(i + 1)}</td><td className="font-bold">{y.name[language]}</td><td>{y.type}</td><td>{y.planetsInvolved.map(g => tGraha(g)).join(', ')}</td><td>{y.effect[language]}</td></tr>
            ))}</tbody>
          </table>
          <div className="book-subhead">विशेष दोष परीक्षा / Special Dosha Tests</div>
          <div className="book-note"><b>मांगलिक (Manglik):</b> {chartData.manglik.isManglik ? `YES (${chartData.manglik.severity})` : 'NO'} — {chartData.manglik.description[language]}</div>
          <div className="book-note"><b>कालसर्प (Kala-Sarpa):</b> {chartData.kalaSarpa.hasDosha ? chartData.kalaSarpa.name[language] : 'NO'} — {chartData.kalaSarpa.description[language]}</div>
          <div className="book-note"><b>साढ़ेसाती (Sade-Sati):</b> {chartData.gochara.sadeSati.isActive ? `${chartData.gochara.sadeSati.phase} — Saturn in ${tRashi(chartData.gochara.sadeSati.saturnCurrentSign)} (${chartData.gochara.sadeSati.saturnDegree}°)` : `NO (Saturn now in ${tRashi(chartData.gochara.sadeSati.saturnCurrentSign)} ${chartData.gochara.sadeSati.saturnDegree}°)`} — {chartData.gochara.sadeSati.remedy[language]}</div>
        </div>
        {/* ============ CHAPTER 5 — Strengths ============ */}
        <div className="book-chapter">
          <div className="book-chapter-head">अध्याय ५ — ग्रह बल: षड्बल, विंशोपक एवं अष्टकवर्ग<br /><span className="chapter-sub">Chapter 5 — Shadbala, Vimsopaka & 337-Bindu Ashtakavarga</span></div>
          <div className="book-subhead">षड्बल / Shadbala (6-Fold Strength)</div>
          <table className="book-table">
            <thead><tr><th>Graha</th><th>Sthana</th><th>Dig</th><th>Kaala</th><th>Chesta</th><th>Naisargika</th><th>Drik</th><th>Total Rupas</th><th>%</th><th>Rank</th></tr></thead>
            <tbody>{(['Surya', 'Chandra', 'Mangala', 'Budha', 'Guru', 'Shukra', 'Shani'] as const).map(g => { const s = chartData.shadbala.planets[g]; return (
              <tr key={g}><td className="font-bold">{tGraha(g)}</td><td>{formatNumber(s.sthanaBala)}</td><td>{formatNumber(s.digBala)}</td><td>{formatNumber(s.kaalaBala)}</td><td>{formatNumber(s.chestaBala)}</td><td>{formatNumber(s.naisargikaBala)}</td><td>{formatNumber(s.drikBala)}</td><td className="font-bold">{s.totalRupas}</td><td>{formatNumber(s.strengthPercentage)}%</td><td>{formatNumber(s.rank)}</td></tr>
            ); })}</tbody>
          </table>
          <div className="book-note">सर्वाधिक बलवान / Strongest: <b>{tGraha(chartData.shadbala.strongestPlanet)}</b> • सर्वाधिक दुर्बल / Weakest: <b>{tGraha(chartData.shadbala.weakestPlanet)}</b> • विंशोपक चैम्पियन: <b>{tGraha(chartData.vimsopakaBala.highestVimsopakaPlanet)}</b></div>
          <div className="book-subhead">सर्वाष्टकवर्ग (३३७ बिंदु) / Sarvashtakavarga</div>
          <table className="book-table">
            <thead><tr>{chartData.houses.map(h => <th key={h.houseNumber}>{h.houseNumber}</th>)}<th>Total</th></tr></thead>
            <tbody><tr>{chartData.ashtakavarga.sarvashtakavarga.map((b, i) => <td key={i} className={b >= 30 ? 'font-bold' : ''}>{formatNumber(b)}</td>)}<td className="font-bold">{formatNumber(chartData.ashtakavarga.totalBindus)}</td></tr></tbody>
          </table>
          <div className="book-note">त्रिकोण शोधन: {chartData.ashtakavarga.trikonaShodhana.join(', ')} • एकाधिपत्य शोधन: {chartData.ashtakavarga.ekadhipatyaShodhana.join(', ')}</div>
        </div>
        </>)}
        {mode === 'full' && (<>
        {/* ============ CHAPTER 5B — Advance Charts & Graphs ============ */}
        <div className="book-chapter">
          <div className="book-chapter-head">अध्याय ५.५ — आलेख एवं ग्राफ<br /><span className="chapter-sub">Chapter 5B — Advance Charts & Graphs (Shadbala • SAV • Vimsopaka • Yearly Trend • Radar)</span></div>
          <div className="book-note">इदं पञ्च आलेखान् दर्शयति — ग्रह बल, भाव बिंदु, संयुक्त बल, ३६५-दिन प्रवृत्ति एवं जीवन क्षेत्र रडार। / These five graphs visualise planetary strength, house bindus, composite strength, the 365-day trend and the life-domain radar.</div>
          <KundaliChartsView chartData={chartData} printMode />
        </div>
        {/* ============ CHAPTER 6 — Life Domains & Remedies ============ */}
        <div className="book-chapter">
          <div className="book-chapter-head">अध्याय ६ — जीवन क्षेत्र एवं उपचार<br /><span className="chapter-sub">Chapter 6 — Life Domains, Ratna, Rudraksha & Daana</span></div>
          <table className="book-table">
            <thead><tr><th>क्षेत्र / Domain</th><th>Stars</th><th>विश्लेषण / Analysis</th><th>रणनीति / Strategy</th></tr></thead>
            <tbody>{chartData.lifeDomains.domains.map(dm => (
              <tr key={dm.domainId}><td className="font-bold">{dm.title[language]}</td><td>{'★'.repeat(dm.rating)}{'☆'.repeat(5 - dm.rating)}</td><td>{dm.analysis[language]}</td><td>{dm.strategicRemedy[language]}</td></tr>
            ))}</tbody>
          </table>
          <div className="book-subhead">रत्न सुझाव / Gemstones</div>
          <table className="book-table">
            <thead><tr><th>Type</th><th>Stone</th><th>Planet</th><th>Metal</th><th>Finger</th><th>Day</th><th>Mantra</th></tr></thead>
            <tbody>{chartData.remedies.gemstones.map((gm, i) => (
              <tr key={i}><td>{gm.typeName[language]}</td><td className="font-bold">{gm.gemstone[language]}</td><td>{tGraha(gm.rulingPlanet)}</td><td>{gm.metal[language]}</td><td>{gm.finger[language]}</td><td>{gm.dayToWear[language]}</td><td>{gm.mantra}</td></tr>
            ))}</tbody>
          </table>
          <div className="book-subhead">रुद्राक्ष एवं दान / Rudraksha & Daana</div>
          <div className="book-note">{chartData.remedies.rudrakshas.map(r => `${r.mukhi}-mukhi (${tGraha(r.rulingPlanet)})`).join(' • ')} • जगन्नाथ: {chartData.remedies.jagannathRemedy.stotra}</div>
          <table className="book-table">
            <tbody>{chartData.remedies.daanaRemedies.map((dn, i) => (
              <tr key={i}><td className="k">{dn.day[language]}</td><td>{dn.item[language]}</td><td className="k">लाभ</td><td>{dn.target[language]}</td></tr>
            ))}</tbody>
          </table>
        </div>
        {/* ============ CHAPTER 7 — Special Lagnas & Upagrahas ============ */}
        <div className="book-chapter">
          <div className="book-chapter-head">अध्याय ७ — विशेष लग्न एवं उपग्रह<br /><span className="chapter-sub">Chapter 7 — Special Lagnas, Indu Lagna & Upagrahas (Classical Parashari)</span></div>
          <table className="book-table">
            <thead><tr><th>लग्न / Lagna</th><th>राशि / Rashi</th><th>अंश / Degree</th><th>भाव / House</th><th>स्वामी / Lord</th><th>महत्व / Significance</th></tr></thead>
            <tbody>
              {[chartData.specialLagnas.sriLagna, chartData.specialLagnas.horaLagna, chartData.specialLagnas.ghatiLagna, chartData.specialLagnas.pranapadaLagna, chartData.specialLagnas.karakamshaLagna, chartData.specialLagnas.mandi, chartData.specialLagnas.gulika].map((sl, i) => (
                <tr key={i}><td className="font-bold">{sl.name[language]}</td><td>{tRashi(sl.sign)}</td><td>{sl.degreeInSign.toFixed(2)}°</td><td>{formatNumber(sl.house)}</td><td>{tGraha(sl.signLord)}</td><td>{sl.significance[language]}</td></tr>
              ))}
            </tbody>
          </table>
          <div className="book-subhead">इंदु लग्न / Indu Lagna (Wealth Point)</div>
          <table className="book-table">
            <tbody>
              <tr><td className="k">राशि / Rashi</td><td>{tRashi(chartData.specialLagnas.induLagna.sign)} ({chartData.specialLagnas.induLagna.degreeInSign.toFixed(2)}°)</td><td className="k">लग्न से / From Lagna</td><td>{formatNumber(chartData.specialLagnas.induLagna.houseFromLagna)}</td><td className="k">चन्द्र से / From Moon</td><td>{formatNumber(chartData.specialLagnas.induLagna.houseFromMoon)}</td></tr>
              <tr><td className="k">किरणें / Rays</td><td>{formatNumber(chartData.specialLagnas.induLagna.lagnaRays)} + {formatNumber(chartData.specialLagnas.induLagna.moonRays)} = {formatNumber(chartData.specialLagnas.induLagna.totalRays)}</td><td className="k">स्वामी / Lord</td><td>{tGraha(chartData.specialLagnas.induLagna.signLord)}</td><td className="k">धन स्तर / Tier</td><td className="font-bold">{chartData.specialLagnas.induLagna.wealthTier}</td></tr>
            </tbody>
          </table>
          <div className="book-note">{chartData.specialLagnas.induLagna.wealthPrediction[language]}</div>
          <div className="book-subhead">उपग्रह / Upagrahas</div>
          <table className="book-table">
            <thead><tr><th>#</th><th>नाम / Name</th><th>राशि / Rashi</th><th>अंश / Deg</th><th>भाव / House</th><th>प्रभाव / Effect</th></tr></thead>
            <tbody>{chartData.specialLagnas.upagrahas.map((u, i) => (
              <tr key={i}><td>{formatNumber(i + 1)}</td><td className="font-bold">{u.name[language]}{u.isShadowNode ? ' (Shadow)' : ''}</td><td>{tRashi(u.sign)}</td><td>{u.degreeInSign.toFixed(2)}°</td><td>{formatNumber(u.house)}</td><td>{u.effect[language]}</td></tr>
            ))}</tbody>
          </table>
        </div>
        {/* ============ CHAPTER 8 — Avakhada ============ */}
        <div className="book-chapter">
          <div className="book-chapter-head">अध्याय ८ — आवाखड़ा<br /><span className="chapter-sub">Chapter 8 — Avakhada (Varna • Vashya • Yoni • Gana • Nadi • Tatwa)</span></div>
          <table className="book-table">
            <tbody>
              <tr><td className="k">वर्ण / Varna</td><td>{chartData.avakhada.varna[language]}</td><td className="k">वश्य / Vashya</td><td>{chartData.avakhada.vashya[language]}</td></tr>
              <tr><td className="k">योनि / Yoni</td><td>{chartData.avakhada.yoni[language]} ({chartData.avakhada.yoni.animal})</td><td className="k">शत्रु योनि / Enemy</td><td>{chartData.avakhada.yoni.enemyYoni}</td></tr>
              <tr><td className="k">गण / Gana</td><td>{chartData.avakhada.gana[language]} — {chartData.avakhada.gana.trait[language]}</td><td className="k">नाड़ी / Nadi</td><td>{chartData.avakhada.nadi[language]} ({chartData.avakhada.nadi.dosha})</td></tr>
              <tr><td className="k">तत्व / Tatwa</td><td>{chartData.avakhada.tatwa[language]}</td><td className="k">पाद / Pada</td><td>{formatNumber(chartData.avakhada.pada)}</td></tr>
              <tr><td className="k">नाम अक्षर / Name Letters</td><td colSpan={3}>{chartData.avakhada.namaAksharas.join(', ')}</td></tr>
            </tbody>
          </table>
          <div className="book-note">आयुर्वेदिक मार्गदर्शन / Ayurvedic: {chartData.avakhada.nadi.ayurvedicGuidance[language]}</div>
        </div>
        {/* ============ CHAPTER 9 — Planetary Avasthas ============ */}
        <div className="book-chapter">
          <div className="book-chapter-head">अध्याय ९ — ग्रह अवस्था<br /><span className="chapter-sub">Chapter 9 — Planetary Avasthas (Bala-Adi • Deepta-Adi • Jagrata-Adi)</span></div>
          <table className="book-table">
            <thead><tr><th>ग्रह / Graha</th><th>बालादि / Bala-Adi</th><th>फल% / Fruit</th><th>दीप्तादि / Deepta-Adi</th><th>जाग्रादि / Jagrata-Adi</th><th>व्याख्या / Interpretation</th></tr></thead>
            <tbody>{order.map(g => { const a = chartData.planetaryAvasthas.avasthas[g]; return a ? (
              <tr key={g}><td className="font-bold">{tGraha(g)}</td><td>{a.baladiName[language]} ({a.baladiAvastha})</td><td>{formatNumber(a.fruitPercentage)}%</td><td>{a.deeptadiName[language]} ({a.deeptadiAvastha})</td><td>{a.jagradadiName[language]}</td><td>{a.interpretation[language]}</td></tr>
            ) : null; })}</tbody>
          </table>
        </div>
        {/* ============ CHAPTER 10 — Bhrigu Nandi Nadi ============ */}
        <div className="book-chapter">
          <div className="book-chapter-head">अध्याय १० — भृगु नाड़ी ज्योतिष<br /><span className="chapter-sub">Chapter 10 — Bhrigu Nandi Nadi (Karmic Combinations)</span></div>
          <div className="book-note"><b>कर्म मिशन / Karmic Mission:</b> {chartData.nadiAstrology.karmicMissionSummary[language]}</div>
          <table className="book-table">
            <thead><tr><th>#</th><th>संयोग / Combination</th><th>ग्रह / Planets</th><th>प्रकार / Type</th><th>कर्म प्रकटीकरण / Karmic Manifestation</th><th>भाग्य पैटर्न / Destiny</th></tr></thead>
            <tbody>{chartData.nadiAstrology.combinations.map((c, i) => (
              <tr key={c.id}><td>{formatNumber(i + 1)}</td><td className="font-bold">{c.title[language]}</td><td>{c.planets.map(p => tGraha(p)).join(', ')}</td><td>{c.type}</td><td>{c.karmicManifestation[language]}</td><td>{c.destinyPattern[language]}</td></tr>
            ))}</tbody>
          </table>
        </div>
        {/* ============ CHAPTER 11 — KP System ============ */}
        <div className="book-chapter">
          <div className="book-chapter-head">अध्याय ११ — कृष्णमूर्ति पद्धति (केपी)<br /><span className="chapter-sub">Chapter 11 — KP System (Planets & Cusps: Star Lord / Sub Lord)</span></div>
          <table className="book-table">
            <thead><tr><th>ग्रह / Planet</th><th>राशि / Rashi</th><th>नक्षत्र स्वामी / Star Lord</th><th>उपस्थ स्वामी / Sub Lord</th><th>राशि स्वामी / Sign Lord</th></tr></thead>
            <tbody>{order.map(g => { const kp = chartData.kpSystem.planets[g]; return (
              <tr key={g}><td className="font-bold">{tGraha(kp.name)}</td><td>{tRashi(kp.sign)}</td><td>{tGraha(kp.starLord)}</td><td>{tGraha(kp.subLord)}</td><td>{tGraha(kp.signLord)}</td></tr>
            ); })}</tbody>
          </table>
          <div className="book-subhead">भाव कुस्प / Cuspal Degrees</div>
          <table className="book-table">
            <thead><tr><th>भाव / House</th><th>अंश / Degree</th><th>राशि / Rashi</th><th>उपस्थ स्वामी / Sub Lord</th></tr></thead>
            <tbody>{chartData.kpSystem.cusps.map((c, i) => (
              <tr key={i}><td className="font-bold">{formatNumber(i + 1)}</td><td>{c.longitude.toFixed(2)}°</td><td>{tRashi(c.sign)}</td><td>{tGraha(c.subLord)}</td></tr>
            ))}</tbody>
          </table>
        </div>
        {/* ============ CHAPTER 12 — Jaimini ============ */}
        <div className="book-chapter">
          <div className="book-chapter-head">अध्याय १२ — जैमिनी दर्शन<br /><span className="chapter-sub">Chapter 12 — Jaimini (Chara Karakas • Arudha • Upapada • Karakamsha)</span></div>
          <table className="book-table">
            <thead><tr><th>कारक / Karaka</th><th>नाम / Name</th><th>ग्रह / Planet</th><th>अंश / Deg</th><th>राशि / Rashi</th><th>विषय / Signification</th></tr></thead>
            <tbody>{chartData.jaimini.charaKarakas.map(k => (
              <tr key={k.karaka}><td className="font-bold">{k.karaka}</td><td>{k.karakaName[language]}</td><td>{tGraha(k.planet)}</td><td>{k.degreeInSign.toFixed(2)}°</td><td>{tRashi(k.sign)}</td><td>{k.signification[language]}</td></tr>
            ))}</tbody>
          </table>
          <table className="book-table">
            <tbody>
              <tr><td className="k">अरूढ़ लग्न / Arudha Lagna</td><td>{tRashi(chartData.jaimini.arudhaLagna.sign)} — {formatNumber(chartData.jaimini.arudhaLagna.house)}वाँ भाव</td><td className="k">उपपदा लग्न / Upapada</td><td>{tRashi(chartData.jaimini.upapadaLagna.sign)} — {formatNumber(chartData.jaimini.upapadaLagna.house)}वाँ भाव</td></tr>
              <tr><td className="k">कारकांश / Karakamsha</td><td colSpan={3}>{tRashi(chartData.jaimini.karakamsha.sign)} (Navamsha: {tRashi(chartData.jaimini.karakamsha.navamshaSign)})</td></tr>
            </tbody>
          </table>
        </div>
        {/* ============ CHAPTER 13 — Bhava Chalit ============ */}
        <div className="book-chapter">
          <div className="book-chapter-head">अध्याय १३ — भाव चलित<br /><span className="chapter-sub">Chapter 13 — Bhava Chalit (Cusps & Shifted Planets)</span></div>
          <table className="book-table">
            <thead><tr><th>भाव / House</th><th>आरम्भ / Arambha</th><th>मध्य / Madhya</th><th>अन्त / Anta</th><th>राशि / Rashi</th><th>ग्रह / Planets</th></tr></thead>
            <tbody>{chartData.bhavaChalit.cusps.map(c => (
              <tr key={c.houseNumber}><td className="font-bold">{formatNumber(c.houseNumber)}</td><td>{c.bhavaArambha.toFixed(2)}°</td><td>{c.bhavaMadhya.toFixed(2)}°</td><td>{c.bhavaAnta.toFixed(2)}°</td><td>{tRashi(c.sign)}</td><td>{c.planetsInBhava.length ? c.planetsInBhava.map(p => tGraha(p)).join(', ') : '—'}</td></tr>
            ))}</tbody>
          </table>
          <div className="book-subhead">स्थानान्तरित ग्रह / Shifted Planets (Rashi vs Chalit)</div>
          <table className="book-table">
            <thead><tr><th>ग्रह / Planet</th><th>राशि भाव / Rashi House</th><th>चलित भाव / Chalit House</th><th>बदला / Changed</th></tr></thead>
            <tbody>{chartData.bhavaChalit.shiftedPlanets.map((sp, i) => (
              <tr key={i}><td className="font-bold">{tGraha(sp.planet)}</td><td>{formatNumber(sp.rashiHouse)}</td><td>{formatNumber(sp.chalitHouse)}</td><td>{sp.rashiHouse !== sp.chalitHouse ? '✓' : '—'}</td></tr>
            ))}</tbody>
          </table>
        </div>
        {/* ============ CHAPTER 14 — Bhava Detailed Analysis ============ */}
        <div className="book-chapter">
          <div className="book-chapter-head">अध्याय १४ — भाव विश्लेषण<br /><span className="chapter-sub">Chapter 14 — Detailed 12-Bhava Analysis</span></div>
          <div className="book-note">सबसे बलवान भाव / Strongest Bhava: <b>{formatNumber(chartData.bhavaAnalysis.strongestHouse)}</b> • सबसे चुनौतीपूर्ण / Most Challenging: <b>{formatNumber(chartData.bhavaAnalysis.challengingHouse)}</b></div>
          <table className="book-table">
            <thead><tr><th>भाव / Bhava</th><th>राशि / Rashi</th><th>स्वामी / Lord</th><th>स्थिति / Placement</th><th>अधिकार / Dignity</th><th>अन्तर्जात / Occupants</th><th>बिन्दु / SAV</th><th>बल / %</th></tr></thead>
            <tbody>{chartData.bhavaAnalysis.bhavas.map(b => (
              <tr key={b.houseNumber}><td className="font-bold">{formatNumber(b.houseNumber)} — {b.houseName[language]}</td><td>{tRashi(b.sign)}</td><td>{tGraha(b.lord)}</td><td>H{formatNumber(b.lordPlacementHouse)}</td><td>{b.lordDignity}</td><td>{b.occupants.length ? b.occupants.map(o => tGraha(o)).join(', ') : '—'}</td><td>{formatNumber(b.savBindus)}</td><td className="font-bold">{formatNumber(b.strengthScore)}</td></tr>
            ))}</tbody>
          </table>
          <div className="book-subhead">विस्तृत फल / Detailed Predictions</div>
          <table className="book-table">
            <tbody>{chartData.bhavaAnalysis.bhavas.map(b => (
              <tr key={b.houseNumber}><td className="k">{formatNumber(b.houseNumber)} — {b.keyThemes[language]}</td><td>{b.detailedPrediction[language]}</td></tr>
            ))}</tbody>
          </table>
        </div>
        {/* ============ CHAPTER 15 — Gochara Transits ============ */}
        <div className="book-chapter">
          <div className="book-chapter-head">अध्याय १५ — गोचर भ्रमण<br /><span className="chapter-sub">Chapter 15 — Gochara Transits (from Lagna & Moon) with Sade-Sati</span></div>
          <div className="book-note">तिथि / Transit Date: <b>{chartData.gochara.transitDate}</b> • साढ़ेसाती: {chartData.gochara.sadeSati.isActive ? (chartData.gochara.sadeSati.phaseOr || chartData.gochara.sadeSati.phase) : 'नहीं / Not Active'} — शनि {tRashi(chartData.gochara.sadeSati.saturnCurrentSign)} ({chartData.gochara.sadeSati.saturnDegree}°)</div>
          <table className="book-table">
            <thead><tr><th>ग्रह / Planet</th><th>राशि / Rashi</th><th>अंश / Deg</th><th>लग्न से / From Lagna</th><th>चन्द्र से / From Moon</th><th>वक्री / Vakri</th><th>प्रभाव / Effect</th><th>विवरण / Description</th></tr></thead>
            <tbody>{order.map(g => { const tp = chartData.gochara.planets[g]; return (
              <tr key={g}><td className="font-bold">{tGraha(tp.planet)}</td><td>{tRashi(tp.sign)}</td><td>{tp.degreeInSign.toFixed(2)}°</td><td>{formatNumber(tp.houseFromLagna)}</td><td>{formatNumber(tp.houseFromMoon)}</td><td>{tp.isRetrograde ? '✓' : '—'}</td><td>{tp.transitEffect}</td><td>{tp.description[language]}</td></tr>
            ); })}</tbody>
          </table>
          <div className="book-note"><b>साढ़ेसाती विवरण / Sade-Sati:</b> {chartData.gochara.sadeSati.description[language]}<br />🛡 उपाय / Remedy: {chartData.gochara.sadeSati.remedy[language]}</div>
        </div>
        {/* ============ CHAPTER 16 — Sacred Nakshatra ============ */}
        <div className="book-chapter">
          <div className="book-chapter-head">अध्याय १६ — पवित्र नक्षत्र<br /><span className="chapter-sub">Chapter 16 — Sacred Nakshatra (Tree • Deity • Symbol • Bird • Animal)</span></div>
          <table className="book-table">
            <tbody>
              <tr><td className="k">नक्षत्र / Nakshatra</td><td>{chartData.nakshatraSacred.nakshatraName[language]}</td><td className="k">पाद / Pada</td><td>{formatNumber(chartData.nakshatraSacred.pada)}</td></tr>
              <tr><td className="k">वृक्ष / Sacred Tree</td><td>{chartData.nakshatraSacred.sacredTree.odiaName} ({chartData.nakshatraSacred.sacredTree.botanicalName})</td><td className="k">English</td><td>{chartData.nakshatraSacred.sacredTree.englishName}</td></tr>
              <tr><td className="k">देवता / Deity</td><td>{chartData.nakshatraSacred.deity.name[language]}</td><td className="k">मन्त्र / Mantra</td><td>{chartData.nakshatraSacred.deity.mantra}</td></tr>
              <tr><td className="k">प्रतीक / Symbol</td><td>{chartData.nakshatraSacred.symbol[language]}</td><td className="k">पक्षी / Bird</td><td>{chartData.nakshatraSacred.bird[language]}</td></tr>
              <tr><td className="k">जानवर / Animal</td><td>{chartData.nakshatraSacred.animal[language]}</td><td className="k">पाद भाग्य / Pada Destiny</td><td>{chartData.nakshatraSacred.padaDestiny[language]}</td></tr>
            </tbody>
          </table>
          <div className="book-note">आध्यात्मिक महत्व / Spiritual: {chartData.nakshatraSacred.sacredTree.spiritualSignificance[language]}<br />आशीर्वाद / Blessing: {chartData.nakshatraSacred.deity.blessing[language]}</div>
        </div>
        </>)}
        {mode !== 'year' && (<>
        {/* ============ CHAPTER 17 — Life Predictions ============ */}
        <div className="book-chapter">
          <div className="book-chapter-head">अध्याय १७ — जीवन भविष्यवाणी<br /><span className="chapter-sub">Chapter 17 — Life Predictions (Personality • Career • Wealth • Relations • Health • Spirituality)</span></div>
          <table className="book-table">
            <tbody>
              <tr><td className="k">व्यक्तित्व / Personality</td><td>{chartData.predictions.personality[language]}</td></tr>
              <tr><td className="k">करियर / Career</td><td>{chartData.predictions.career[language]}</td></tr>
              <tr><td className="k">धन / Wealth</td><td>{chartData.predictions.wealth[language]}</td></tr>
              <tr><td className="k">सम्बन्ध / Relationships</td><td>{chartData.predictions.relationships[language]}</td></tr>
              <tr><td className="k">स्वास्थ्य / Health</td><td>{chartData.predictions.health[language]}</td></tr>
              <tr><td className="k">आध्यात्म / Spirituality</td><td>{chartData.predictions.spirituality[language]}</td></tr>
            </tbody>
          </table>
        </div>
        </>)}
        {mode !== 'short' && (<>
        {/* ============ CHAPTER 18 — 365-Day Varshaphala (month-wise book pages) ============ */}
        <div className="book-chapter">
          <div className="book-chapter-head">{mode === 'year' ? `सन् ${selYear} — वार्षिक भविष्यफल (प्रतिदिन)` : 'अध्याय १८ — ३६५-दिन वार्षिक भविष्यफल'}<br /><span className="chapter-sub">{mode === 'year' ? `Year ${selYear} — Daily Varshaphala (Tithi • Nakshatra • Dasha • Score • Phala)` : 'Chapter 18 — Daily Varshaphala for all 365 days (Tithi • Nakshatra • Dasha • Score • Phala)'}</span></div>
          <div className="book-note">Excellent: <b>{formatNumber(year.excellent)}</b> • Good: <b>{formatNumber(year.good)}</b> • Average: <b>{formatNumber(year.average)}</b> • Caution: <b>{formatNumber(year.caution)}</b> • Avoid: <b>{formatNumber(year.avoid)}</b> • Best months: {year.bestMonths.map(bm => `${bm.month} (${bm.avgScore})`).join(', ')}</div>
          {monthGroups.map(([ym, days]) => (
            <div key={ym} className="print-avoid-break">
              <div className="book-month-head">◈ {monthLabel(ym)}</div>
              <table className="book-table book-days">
                <thead><tr><th>Date</th><th>Tithi</th><th>Nakshatra</th><th>Dasha (M/A/P)</th><th>Score</th><th>Phala — Career • Wealth • Health • Remedy</th></tr></thead>
                <tbody>{days.map(d => (
                  <tr key={d.dateStr}>
                    <td className="font-mono">{d.dateStr.slice(8)}/{d.dateStr.slice(5, 7)}</td>
                    <td>{d.paksha === 'Shukla' ? 'शु' : 'कृ'} {d.tithiName}</td>
                    <td>{d.nakshatra}-{d.nakshatraPada}</td>
                    <td>{tGraha(d.maha)}/{tGraha(d.antar)}/{tGraha(d.prat)}</td>
                    <td className="text-center font-bold">{d.score}<br /><span className="text-[8px]">{d.rating}</span></td>
                    <td>{d.headline[language]} • {d.career[language]} • {d.wealth[language]} • {d.health[language]} • 🛡 {d.remedy[language]}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          ))}
        </div>
        </>)}
        <div className="text-center text-[10px] pt-2 border-t border-black">✦ ଦିବ୍ୟଜ୍ୟୋତି କାଳିଆ ପାଞ୍ଜି (DivyaJyoti Kalia Panjika) • Vedic Kundali Grantha • 100% Offline Parashari Ganana • Generated {genDate} ✦</div>
      </div>
    </div>
  );
};
