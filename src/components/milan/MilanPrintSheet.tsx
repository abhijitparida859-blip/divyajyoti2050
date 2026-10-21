import React from 'react';
import { useI18n } from '../../localization/i18n';
import { AdvancedMilanResult } from '../../types/milan';
import { MilanChartsView } from './MilanChartsView';

interface Props {
  result: AdvancedMilanResult;
  groomLagna: string;
  brideLagna: string;
  groomBirth: string;
  brideBirth: string;
  groomCity?: string;
  brideCity?: string;
}

/**
 * Milan Print Sheet — Authentic 2-Page Publication Layout.
 * Fits perfectly on standard A4 paper without awkward blank gaps or accidental page blowouts.
 * Page 1: Auspicious Royal Header, Score Overview, Birth Profiles (Ch 1) and 8-Kootas detailed analysis (Ch 2).
 * Page 2: Life Domains & Visual Charts (Ch 3), Comprehensive Dosha Analysis (Ch 4), Dasha Sync & Vedic Remedies (Ch 5).
 */
export const MilanPrintSheet: React.FC<Props> = ({
  result,
  groomLagna,
  brideLagna,
  groomBirth,
  brideBirth,
  groomCity,
  brideCity,
}) => {
  const { language, formatNumber, tNakshatra, tRashi, tVerdict } = useI18n();
  const pick = (o: { en: string; hi: string; or: string }) => o[language as 'or'] || o.en;
  const genDate = new Date().toLocaleDateString('en-GB');
  const pct = result.compatibilityIndex;

  const statusLabel = (s: string) => {
    if (s === 'auspicious') return language === 'or' ? 'ଶୁଭ' : language === 'hi' ? 'शुभ' : 'Auspicious';
    if (s === 'good') return language === 'or' ? 'ଉତ୍ତମ' : language === 'hi' ? 'उत्तम' : 'Good';
    if (s === 'mixed') return language === 'or' ? 'ମଧ୍ୟମ' : language === 'hi' ? 'मध्यम' : 'Average';
    return language === 'or' ? 'ଦୋଷ' : language === 'hi' ? 'दोष' : 'Dosha';
  };

  const statusBadgeClass = (s: string) => {
    if (s === 'auspicious') return 'status-badge badge-auspicious';
    if (s === 'good') return 'status-badge badge-good';
    if (s === 'mixed') return 'status-badge badge-mixed';
    return 'status-badge badge-dosha';
  };

  return (
    <div className="milan-report-sheet vedic-book kundali-print-sheet bg-white text-black">
      {/* ================= PAGE 1 ================= */}
      <div className="milan-sheet-page milan-sheet-page-1">
        <div className="milan-page-border-frame">
          <div>
            {/* Divine Royal Header */}
            <div className="milan-header-box">
              <div className="text-xl">💞</div>
              <div className="text-[10.5px] font-extrabold text-amber-900 uppercase">
                {language === 'or' ? '॥ ଶ୍ରୀ ଗଣେଶାୟ ନମଃ ॥ ॥ ଶ୍ରୀଜଗନ୍ନାଥାୟ ନମଃ ॥' : language === 'hi' ? '॥ श्री गणेशाय नमः ॥ ॥ श्री जगन्नाथाय नमः ॥' : '॥ SRI GANESHAYA NAMAH ॥ ॥ SRI JAGANNATHAYA NAMAH ॥'}
              </div>
              <h1 className="text-base sm:text-lg font-black text-amber-950 mt-0.5">
                {language === 'or' ? 'କୁଣ୍ଡଳୀ ଯୋଟକ ମେଳକ ବିବରଣୀ' : language === 'hi' ? 'कुण्डली योटक मिलान विवरण' : 'Vedic Kundali Matching Report'}
              </h1>
              <div className="text-sm sm:text-base font-black text-amber-900 mt-0.5">
                👨 {result.groomName} &amp; 👩 {result.brideName}
              </div>
            </div>

            {/* 4-Card Summary Grid */}
            <div className="milan-score-grid">
              <div className="milan-score-card">
                <div className="text-[9.5px] uppercase font-bold text-amber-900">{language === 'or' ? '୩୬ ଗୁଣ ମେଳକ' : '36-Guna Score'}</div>
                <div className="text-sm sm:text-base font-black text-amber-950">{formatNumber(result.totalScore)} / {formatNumber(36)} <span className="text-[10px] font-normal">({formatNumber(result.percentage)}%)</span></div>
              </div>
              <div className="milan-score-card">
                <div className="text-[9.5px] uppercase font-bold text-amber-900">{language === 'or' ? 'ସୁସଙ୍ଗତତା ସୂଚକାଙ୍କ' : 'Compatibility Index'}</div>
                <div className="text-sm sm:text-base font-black text-amber-950">{formatNumber(pct)}%</div>
              </div>
              <div className="milan-score-card">
                <div className="text-[9.5px] uppercase font-bold text-amber-900">{language === 'or' ? 'ଶାସ୍ତ୍ରୀୟ ନିର୍ଣ୍ଣୟ' : 'Final Verdict'}</div>
                <div className="text-xs sm:text-sm font-black text-emerald-800 truncate">{tVerdict(result.verdict)}</div>
              </div>
              <div className="milan-score-card">
                <div className="text-[9.5px] uppercase font-bold text-amber-900">{language === 'or' ? 'ତାରିଖ' : 'Report Date'}</div>
                <div className="text-xs sm:text-sm font-bold text-amber-950">{genDate}</div>
              </div>
            </div>

            {/* Chapter 1: Birth Profiles */}
            <div className="milan-sec-head">
              <span>{language === 'or' ? 'ଅଧ୍ୟାୟ ୧ — ଜନ୍ମ ବିବରଣୀ ଓ ଗ୍ରହ ସ୍ଥିତି' : language === 'hi' ? 'अध्याय १ — जन्म विवरण एवं ग्रह स्थिति' : 'Chapter 1 — Birth Profiles & Moon Positions'}</span>
              <span className="milan-sec-sub">{language === 'or' ? 'ବର ଓ କନ୍ୟା ତୁଳନା' : 'Groom & Bride Comparison'}</span>
            </div>
            <table className="milan-table">
              <thead>
                <tr>
                  <th style={{ width: '28%' }}>{language === 'or' ? 'ତଥ୍ୟ / ଲକ୍ଷଣ' : 'Parameters'}</th>
                  <th style={{ width: '36%' }}>👨 {result.groomName} ({language === 'or' ? 'ବର' : 'Groom'})</th>
                  <th style={{ width: '36%' }}>👩 {result.brideName} ({language === 'or' ? 'କନ୍ୟା' : 'Bride'})</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="font-bold bg-amber-50/50">{language === 'or' ? 'ଜନ୍ମ ତାରିଖ ଓ ସମୟ' : 'Birth Date & Time'}</td><td>{groomBirth}</td><td>{brideBirth}</td></tr>
                {(groomCity || brideCity) && (
                  <tr><td className="font-bold bg-amber-50/50">{language === 'or' ? 'ଜନ୍ମ ସ୍ଥାନ' : 'Birth Place'}</td><td>{groomCity || '—'}</td><td>{brideCity || '—'}</td></tr>
                )}
                <tr><td className="font-bold bg-amber-50/50">{language === 'or' ? 'ଲଗ୍ନ ରାଶି' : 'Lagna (Ascendant)'}</td><td>{groomLagna}</td><td>{brideLagna}</td></tr>
                <tr><td className="font-bold bg-amber-50/50">{language === 'or' ? 'ଚନ୍ଦ୍ର ରାଶି' : 'Moon Sign (Rashi)'}</td><td>{tRashi(result.groomMoon.sign)}</td><td>{tRashi(result.brideMoon.sign)}</td></tr>
                <tr><td className="font-bold bg-amber-50/50">{language === 'or' ? 'ନକ୍ଷତ୍ର ଓ ପାଦ' : 'Nakshatra & Pada'}</td><td>{tNakshatra(result.groomMoon.nakshatra)}-{formatNumber(result.groomMoon.pada)}</td><td>{tNakshatra(result.brideMoon.nakshatra)}-{formatNumber(result.brideMoon.pada)}</td></tr>
                <tr><td className="font-bold bg-amber-50/50">{language === 'or' ? 'ରଜ୍ଜୁ' : 'Rajju'}</td><td>{pick(result.rajjuVedha.rajjuGroom)}</td><td>{pick(result.rajjuVedha.rajjuBride)}</td></tr>
                <tr><td className="font-bold bg-amber-50/50">{language === 'or' ? 'ଗୋତ୍ର' : 'Gotra'}</td><td>{result.gotra.gotraGroom}</td><td>{result.gotra.gotraBride}</td></tr>
              </tbody>
            </table>
            <div className="milan-note-box">
              <b>{language === 'or' ? 'ରଜ୍ଜୁ ଓ ବେଧ ସ୍ଥିତି:' : 'Rajju & Vedha:'}</b> {pick(result.rajjuVedha.note)} &bull; <b>{language === 'or' ? 'ଗୋତ୍ର ବିଚାର:' : 'Gotra:'}</b> {pick(result.gotra.note)}
            </div>

            {/* Chapter 2: Ashtakoot 8-Kootas Table */}
            <div className="milan-sec-head">
              <span>{language === 'or' ? 'ଅଧ୍ୟାୟ ୨ — ଅଷ୍ଟକୂଟ ବିଶ୍ଳେଷଣ' : language === 'hi' ? 'अध्याय २ — अष्टकूट विवरण' : 'Chapter 2 — Ashtakoot 8-Kootas Analysis'}</span>
              <span className="milan-sec-sub">{language === 'or' ? `ମୋଟ: ${formatNumber(result.totalScore)}/${formatNumber(36)} ଗୁଣ` : `Total: ${formatNumber(result.totalScore)}/${formatNumber(36)} Guna`}</span>
            </div>
            <table className="milan-table">
              <thead>
                <tr>
                  <th style={{ width: '20%' }}>{language === 'or' ? 'କୂଟ (Koota)' : 'Koota'}</th>
                  <th style={{ width: '15%', textAlign: 'center' }}>{language === 'or' ? 'ପ୍ରାପ୍ତ ଅଙ୍କ' : 'Points'}</th>
                  <th style={{ width: '15%', textAlign: 'center' }}>{language === 'or' ? 'ସ୍ଥିତି' : 'Status'}</th>
                  <th style={{ width: '50%' }}>{language === 'or' ? 'ବିବରଣୀ ଓ ଫଳାଫଳ' : 'Analysis & Phala'}</th>
                </tr>
              </thead>
              <tbody>
                {result.kootas.map(k => (
                  <tr key={k.key}>
                    <td className="font-bold bg-amber-50/30">{pick(k.name)}</td>
                    <td className="text-center font-bold">{formatNumber(k.points)} / {formatNumber(k.maxPoints)}</td>
                    <td className="text-center">
                      <span className={statusBadgeClass(k.status)}>
                        {statusLabel(k.status)}
                      </span>
                    </td>
                    <td>{pick(k.headline)} — {pick(k.detail)}{k.remedy ? ` ✦ ${pick(k.remedy)}` : ''}</td>
                  </tr>
                ))}
                <tr style={{ background: '#fef3c7', fontWeight: 900 }}>
                  <td style={{ background: '#fef3c7', color: '#78350f' }}>{language === 'or' ? 'ସର୍ବମୋଟ ଗୁଣ' : 'Total Guna'}</td>
                  <td style={{ textAlign: 'center', color: '#78350f', fontSize: '11px' }}>{formatNumber(result.totalScore)} / {formatNumber(36)}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span className="status-badge badge-auspicious">
                      {tVerdict(result.verdict)}
                    </span>
                  </td>
                  <td style={{ color: '#78350f' }}>
                    {language === 'or' ? `ଶାସ୍ତ୍ରୋକ୍ତ ୧୮ ଗୁଣରୁ ଅଧିକ (${formatNumber(result.percentage)}%) — ବିବାହ ପାଇଁ ଅତ୍ୟନ୍ତ ପ୍ରଶସ୍ତ।` : `Above 18 Gunas (${formatNumber(result.percentage)}%) — Approved for Matrimony.`}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="milan-note-box">
              <b>{language === 'or' ? 'ତାରା ବଳ ବିଚାର:' : 'Tara Timing:'}</b> {result.taraTiming.taraGroomFromBride} / {result.taraTiming.taraBrideFromGroom} — {pick(result.taraTiming.note)}
            </div>

            {/* Vedic Blessing Callout */}
            <div className="blessing-box">
              <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#78350f' }}>
                ॥ ମାଙ୍ଗଲ୍ୟଂ ଭଗବାନ୍ ବିଷ୍ଣୁଃ ମଙ୍ଗଲଂ ଗରୁଡ଼ଧ୍ୱଜଃ । ମଙ୍ଗଲଂ ପୁଣ୍ଡରୀକାକ୍ଷୋ ମଙ୍ଗଲାୟ ତନୋ ହରିଃ ॥
              </div>
              <div style={{ fontSize: '10px', color: '#57534e', marginTop: '3px' }}>
                ✦ {language === 'or' ? 'ଶ୍ରୀଜଗନ୍ନାଥ ମହାପ୍ରଭୁଙ୍କ ଅପାର କୃପାରୁ ଉଭୟଙ୍କ ଦାମ୍ପତ୍ୟ ଜୀବନ ସୁଖ, ସମୃଦ୍ଧି ଓ ଆନନ୍ଦମୟ ହେଉ' : 'May Lord Jagannath bless the couple with abundant happiness, longevity, and marital bliss'} ✦
              </div>
            </div>
          </div>

          {/* Page 1 Footer */}
          <div className="footer-seal">
            ॥ ଯତ୍ର ଧର୍ମସ୍ତତୋ ଜୟଃ • ଶୁଭଂ ଭବତୁ କଲ୍ୟାଣମ୍ • {language === 'or' ? 'ପୃଷ୍ଠା ୧ / ୨' : 'Page 1 / 2'} ॥
          </div>
        </div>
      </div>

      {/* ================= PAGE 2 ================= */}
      <div className="milan-sheet-page milan-sheet-page-2">
        <div className="milan-page-border-frame">
          <div>
            {/* Chapter 3: Life Domains + Visual Charts */}
            <div className="milan-sec-head" style={{ marginTop: 0 }}>
              <span>{language === 'or' ? 'ଅଧ୍ୟାୟ ୩ — ଜୀବନ କ୍ଷେତ୍ର ଅନୁକୂଳତା, କୂଟ ଗ୍ରାଫ ଓ ଚିତ୍ରଲେଖ' : language === 'hi' ? 'अध्याय ३ — जीवन क्षेत्र अनुकूलता, कूट ग्राफ एवं आलेख' : 'Chapter 3 — Life Domains, Koota Bars & Visual Charts'}</span>
              <span className="milan-sec-sub">{language === 'or' ? '୪ ଗ୍ରାଫିକ୍ସ ଆଲେଖ୍ୟ' : '4 Analytical Charts'}</span>
            </div>

            {/* 4 Visual Charts (2x2 Compact Grid for Print & PDF) */}
            <MilanChartsView result={result} printMode={true} compactPrint={true} />

            {/* Life Domains Table */}
            <table className="milan-table">
              <thead>
                <tr>
                  <th style={{ width: '28%' }}>{language === 'or' ? 'କ୍ଷେତ୍ର / Domain' : 'Domain'}</th>
                  <th style={{ width: '16%', textAlign: 'center' }}>{language === 'or' ? 'ଅନୁକୂଳତା' : 'Score'}</th>
                  <th style={{ width: '56%' }}>{language === 'or' ? 'ଶାସ୍ତ୍ରୀୟ ବିଶ୍ଳେଷଣ' : 'Astrological Analysis'}</th>
                </tr>
              </thead>
              <tbody>
                {result.lifeDomains.map(d => (
                  <tr key={d.key}>
                    <td className="font-bold bg-amber-50/30">{pick(d.label)}</td>
                    <td className="text-center font-bold text-amber-950">{formatNumber(d.score)}%</td>
                    <td>{pick(d.note)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Chapter 4: Dosha Analysis & Mitigation */}
            <div className="milan-sec-head">
              <span>{language === 'or' ? 'ଅଧ୍ୟାୟ ୪ — ଦୋଷ ବିଚାର, ଖଣ୍ଡନ ଓ ଉପଚାର' : language === 'hi' ? 'अध्याय ४ — दोष जांच, परिहार एवं उपाय' : 'Chapter 4 — Dosha Analysis & Remedies'}</span>
              <span className="milan-sec-sub">{language === 'or' ? 'ମାଙ୍ଗଳିକ, ନାଡ଼ି, ଭକୂଟ, ଗଣ' : 'Major Doshas'}</span>
            </div>
            <table className="milan-table">
              <thead>
                <tr>
                  <th style={{ width: '22%' }}>{language === 'or' ? 'ଦୋଷ (Dosha)' : 'Dosha'}</th>
                  <th style={{ width: '22%', textAlign: 'center' }}>{language === 'or' ? 'ସ୍ଥିତି / Status' : 'Status'}</th>
                  <th style={{ width: '36%' }}>{language === 'or' ? 'କାରଣ / Explanation' : 'Explanation'}</th>
                  <th style={{ width: '20%' }}>{language === 'or' ? 'ପ୍ରତିକାର' : 'Remedy'}</th>
                </tr>
              </thead>
              <tbody>
                {result.doshaChecks.map(d => {
                  const ok = !d.active || d.cancelled;
                  return (
                    <tr key={d.key}>
                      <td className="font-bold bg-amber-50/30">{pick(d.label)}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={ok ? 'status-badge badge-auspicious' : 'status-badge badge-dosha'}>
                          {ok ? (d.cancelled ? (language === 'or' ? 'ଖଣ୍ଡିତ / ବାତିଲ୍' : 'Cancelled') : (language === 'or' ? 'ଶୁଭ / ଦୋଷମୁକ୍ତ' : 'Clear')) : (language === 'or' ? 'ସକ୍ରିୟ — ଉପାୟ ଆବଶ୍ୟକ' : 'Active')}
                        </span>
                      </td>
                      <td>{pick(d.note)}</td>
                      <td>{d.remedy && !ok ? pick(d.remedy) : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Chapter 5: Dasha Sync & Muhurta */}
            <div className="milan-sec-head">
              <span>{language === 'or' ? 'ଅଧ୍ୟାୟ ୫ — ଦଶା ସମନ୍ୱୟ, ବିବାହ ମୁହୂର୍ତ୍ତ ଓ ବୈଦିକ ଉପାୟ' : language === 'hi' ? 'अध्याय ५ — दशा समन्वय, मुहूर्त एवं उपाय' : 'Chapter 5 — Dasha Sync, Muhurta & Remedies'}</span>
            </div>
            <div className="milan-note-box">
              <b>{language === 'or' ? 'ଦଶା ସମନ୍ୱୟ:' : 'Dasha Sync:'}</b> {pick(result.dashaSync.note)} &bull; <b>{language === 'or' ? 'ମୁହୂର୍ତ୍ତ ବିଚାର:' : 'Muhurta:'}</b> {pick(result.muhurta.seasonNote)} — {pick(result.muhurta.classicalDates)}
            </div>

            {/* Vedic Remedies List */}
            <table className="milan-table">
              <thead>
                <tr>
                  <th style={{ width: '8%', textAlign: 'center' }}>#</th>
                  <th style={{ width: '92%' }}>{language === 'or' ? 'ଶାସ୍ତ୍ରୋକ୍ତ ଶୁଭ ଫଳପ୍ରଦ ବୈଦିକ ଉପଚାର (Vedic Remedies)' : 'Prescribed Vedic Remedies'}</th>
                </tr>
              </thead>
              <tbody>
                {result.remedies.map((r, i) => (
                  <tr key={i}>
                    <td className="text-center font-bold bg-amber-50/30">{formatNumber(i + 1)}</td>
                    <td>{pick(r)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Page 2 Authentication Seal & Footer */}
          <div className="footer-seal">
            ✦ {language === 'or' ? 'ଦିବ୍ୟଜ୍ୟୋତି କାଳିଆ ପାଞ୍ଜି' : language === 'hi' ? 'दिव्यज्योति कालिया पंचांग' : 'DivyaJyoti Kalia Panjika'} • 100% Offline Parashari Ganana • Authentic Ephemeris • {language === 'or' ? 'ପୃଷ୍ଠା ୨ / ୨' : 'Page 2 / 2'} ✦
          </div>
        </div>
      </div>
    </div>
  );
};
