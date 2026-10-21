import React, { useState } from 'react';
import { useI18n } from '../../localization/i18n';
import { BirthChartData } from '../../types/jataka';
import { FileText, BookOpen, CalendarDays, MessageCircle, Send, Mail, Link2, Share2, Printer, Check, Globe, Download } from 'lucide-react';

export type PrintMode = 'short' | 'full' | 'year';

interface Props {
  chartData: BirthChartData;
  mode: PrintMode;
  year: number;
  onModeChange: (m: PrintMode) => void;
  onYearChange: (y: number) => void;
  onPrint: () => void;
}

/**
 * PrintControls — 3 print editions (Short / Full Life / Selected Year) + full share suite
 * (WhatsApp, Telegram, Gmail, Facebook, X, LinkedIn, Copy Link, Native Share, Print/PDF).
 * All share links carry the real page URL + summary text — no fake data.
 */
export const PrintControls: React.FC<Props> = ({ chartData, mode, year, onModeChange, onYearChange, onPrint }) => {
  const { language, tRashi } = useI18n();
  const [copied, setCopied] = useState(false);
  const [pdfBusy, setPdfBusy] = useState<'none' | 'download' | 'share'>('none');

  const url = typeof window !== 'undefined' ? window.location.href : '';
  const title = `🛕 DivyaJyoti Kundali — ${chartData.nativeName}`;
  const summary = `${title} • ${tRashi(chartData.ascendantSign)} Lagna • ${tRashi(chartData.planets.Chandra.sign)} Rashi • Vedic Kundali Grantha (PDF-ready)`;
  const enc = encodeURIComponent;
  const open = (u: string) => window.open(u, '_blank', 'noopener,noreferrer');

  const birthYear = Number(chartData.dateTime.slice(0, 4)) || 1990;
  const thisYear = new Date().getFullYear();
  const years: number[] = [];
  const endYear = Math.max(birthYear + 120, thisYear);
  for (let y = birthYear; y <= endYear; y++) years.push(y);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${summary}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = `${summary}\n${url}`;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const nativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try { await navigator.share({ title, text: summary, url }); } catch { /* user cancelled */ }
    } else {
      copyLink();
    }
  };

  // ---------- Direct PDF (html2pdf, lazy-loaded so first paint stays fast) ----------
  const findBookEl = (): HTMLElement | null => {
    // Prefer the book inside the open print-preview modal, else the inline one
    const inModal = document.querySelector<HTMLElement>('.odia-print-modal-overlay .vedic-book');
    if (inModal) return inModal;
    const inRoot = document.querySelector<HTMLElement>('#root .vedic-book');
    return inRoot;
  };

  const pdfFileName = () =>
    `DivyaJyoti-Kundali-${chartData.nativeName.replace(/[^\p{L}\p{N} _-]/gu, '').trim().slice(0, 40) || 'Kundali'}-${mode === 'year' ? year : mode}.pdf`;

  const generatePdfBlob = async (): Promise<Blob | null> => {
    const el = findBookEl();
    if (!el) return null;
    // Dynamic import = separate chunk; app bundle stays lean (no lag on load)
    const { default: html2pdf } = await import('html2pdf.js');
    const worker = html2pdf().set({
      margin: [8, 6, 8, 6],
      filename: pdfFileName(),
      image: { type: 'jpeg', quality: 0.94 },
      enableLinks: true,
      html2canvas: { scale: 1.6, useCORS: true, backgroundColor: '#ffffff', scrollY: 0, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'], avoid: ['tr', '.print-avoid-break', '.book-chart-box'] },
    } as never).from(el);
    const blob: Blob = await worker.output('blob');
    return blob;
  };

  const downloadPdf = async () => {
    if (pdfBusy !== 'none') return;
    setPdfBusy('download');
    try {
      const blob = await generatePdfBlob();
      if (!blob) return;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = pdfFileName();
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 15000);
    } catch {
      /* handled by busy reset */
    } finally {
      setPdfBusy('none');
    }
  };

  const sharePdf = async () => {
    if (pdfBusy !== 'none') return;
    setPdfBusy('share');
    try {
      const blob = await generatePdfBlob();
      if (!blob) return;
      const file = new File([blob], pdfFileName(), { type: 'application/pdf' });
      const nav = navigator as Navigator & { canShare?: (d: unknown) => boolean };
      // Web Share Level 2 — opens native sheet (WhatsApp/Telegram/Gmail…) WITH the PDF attached
      if (typeof navigator !== 'undefined' && navigator.share && nav.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title, text: summary });
          return;
        } catch { /* user cancelled — fall back to download */ }
      }
      // Fallback (desktop / no file-share support): direct download
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = pdfFileName();
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 15000);
    } catch {
      /* handled by busy reset */
    } finally {
      setPdfBusy('none');
    }
  };

  const T = {
    short: language === 'or' ? 'ସଂକ୍ଷିପ୍ତ' : language === 'hi' ? 'संक्षिप्त' : 'Short',
    full: language === 'or' ? 'ସମ୍ପୂର୍ଣ୍ଣ ଜୀବନ' : language === 'hi' ? 'संपूर्ण जीवन' : 'Full Life',
    year: language === 'or' ? 'ବର୍ଷ' : language === 'hi' ? 'वर्ष' : 'Year',
    shortHint: language === 'or' ? 'କେବଳ ଜରୁରୀ ବିଷୟ: ଜନ୍ମ, କୁଣ୍ଡଳୀ, ଦଶା, ଯୋଗ, ବଳ, ଭବିଷ୍ୟବାଣୀ' : language === 'hi' ? 'केवल आवश्यक: जन्म, कुंडली, दशा, योग, बल, भविष्यवाणी' : 'Essentials only: Birth, Chart, Dasha, Yogas, Strength, Predictions',
    fullHint: language === 'or' ? 'ସମସ୍ତ ୧୮ ଅଧ୍ୟାୟ + ୩୬୫ ଦିନ' : language === 'hi' ? 'सभी 18 अध्याय + 365 दिन' : 'All 18 chapters + 365 days',
    yearHint: (y: number) => (language === 'or' ? `ସନ୍ ${y}ର ପ୍ରତିଟି ଦିନର ଡାଟା` : language === 'hi' ? `सन् ${y} का हर एक दिन का डेटा` : `Every single day of ${y}`),
    wa: 'WhatsApp', tg: 'Telegram', gm: 'Gmail', fb: 'Facebook', x: 'X', li: 'LinkedIn',
    copy: language === 'or' ? 'ଲିଙ୍କ କପି' : language === 'hi' ? 'लिंक कॉपी' : 'Copy Link',
    copied: language === 'or' ? 'କପି ହେଲା!' : language === 'hi' ? 'कॉपी हो गया!' : 'Copied!',
    more: language === 'or' ? 'ଅଧିକ ସେୟାର' : language === 'hi' ? 'अधिक शेयर' : 'More',
    pdfDl: language === 'or' ? 'PDF ଡାଉନଲୋଡ୍' : language === 'hi' ? 'PDF डाउनलोड' : 'Download PDF',
    pdfShare: language === 'or' ? 'PDF ସେୟାର' : language === 'hi' ? 'PDF शेयर' : 'Share PDF',
    pdfBusy: language === 'or' ? 'PDF ତିଆରି ହେଉଛି…' : language === 'hi' ? 'PDF बन रहा है…' : 'Building PDF…',
    print: language === 'or' ? 'ପ୍ରିଣ୍ଟ / PDF' : language === 'hi' ? 'प्रिंट / PDF' : 'Print / PDF',
    printHint: language === 'or' ? 'ପ୍ରିଣ୍ଟ ଡାଇଲଗରେ "Save as PDF" ବାଛନ୍ତୁ, ତାପରେ WhatsApp/Telegram ରେ ପଠାନ୍ତୁ' : language === 'hi' ? 'प्रिंट डायलॉग में "Save as PDF" चुनें, फिर WhatsApp/Telegram पर भेजें' : 'Pick "Save as PDF" in the print dialog, then send it on WhatsApp/Telegram',
    fy: language === 'or' ? 'ବର୍ଷ ବାଛନ୍ତୁ' : language === 'hi' ? 'वर्ष चुनें' : 'Select year',
  };

  const modes: { id: PrintMode; icon: React.FC<{ className?: string }>; label: string; hint: string }[] = [
    { id: 'short', icon: FileText, label: T.short, hint: T.shortHint },
    { id: 'full', icon: BookOpen, label: T.full, hint: T.fullHint },
    { id: 'year', icon: CalendarDays, label: T.year, hint: T.yearHint(year) },
  ];

  const pill = (active: boolean) =>
    `flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-black transition-colors cursor-pointer ${
      active ? 'bg-gradient-to-r from-cosmic-gold to-yellow-400 text-cosmic-950' : 'bg-cosmic-950 text-slate-300 hover:bg-cosmic-900'
    }`;

  const shareBtn = 'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-cosmic-gold/50 hover:bg-white/10 text-slate-200 text-[11px] font-bold transition-all cursor-pointer';

  return (
    <div className="space-y-2.5">
      {/* 3 Print Editions */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-cosmic-gold mr-1">
          {language === 'or' ? 'ସଂସ୍କରଣ' : language === 'hi' ? 'संस्करण' : 'Edition'}
        </span>
        <div className="flex rounded-xl overflow-hidden border border-cosmic-gold/40">
          {modes.map(m => (
            <button
              key={m.id}
              onClick={() => onModeChange(m.id)}
              title={m.hint}
              className={`${pill(mode === m.id)} border-r border-cosmic-gold/20 last:border-r-0`}
            >
              <m.icon className="w-3.5 h-3.5" />
              <span>{m.label}</span>
            </button>
          ))}
        </div>
        {mode === 'year' && (
          <select
            value={year}
            onChange={e => onYearChange(Number(e.target.value))}
            aria-label={T.fy}
            className="bg-cosmic-950 border border-cosmic-gold/40 rounded-xl px-2.5 py-1.5 text-xs font-black text-cosmic-gold cursor-pointer focus:outline-none focus:border-cosmic-gold"
          >
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        )}
      </div>

      {/* Share Suite */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-1">
          {language === 'or' ? 'ସେୟାର' : language === 'hi' ? 'शेयर' : 'Share'}
        </span>
        <button className={shareBtn} title={`WhatsApp: ${T.printHint}`} onClick={() => open(`https://wa.me/?text=${enc(`${summary}\n${url}`)}`)}>
          <MessageCircle className="w-3.5 h-3.5 text-green-400" /><span className="hidden sm:inline">WhatsApp</span>
        </button>
        <button className={shareBtn} title="Telegram" onClick={() => open(`https://t.me/share/url?url=${enc(url)}&text=${enc(summary)}`)}>
          <Send className="w-3.5 h-3.5 text-sky-400" /><span className="hidden sm:inline">Telegram</span>
        </button>
        <button className={shareBtn} title="Gmail" onClick={() => open(`mailto:?subject=${enc(title)}&body=${enc(`${summary}\n\n${url}`)}`)}>
          <Mail className="w-3.5 h-3.5 text-red-400" /><span className="hidden sm:inline">Gmail</span>
        </button>
        <button className={shareBtn} title="Facebook" onClick={() => open(`https://www.facebook.com/sharer/sharer.php?u=${enc(url)}&quote=${enc(summary)}`)}>
          <Globe className="w-3.5 h-3.5 text-blue-400" /><span className="hidden sm:inline">Facebook</span>
        </button>
        <button className={shareBtn} title="X (Twitter)" onClick={() => open(`https://twitter.com/intent/tweet?text=${enc(summary)}&url=${enc(url)}`)}>
          <span className="text-slate-200 font-black text-[11px]">𝕏</span><span className="hidden sm:inline">X</span>
        </button>
        <button className={shareBtn} title="LinkedIn" onClick={() => open(`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`)}>
          <span className="text-sky-300 font-black text-[11px]">in</span><span className="hidden sm:inline">LinkedIn</span>
        </button>
        <button className={shareBtn} title={`${T.copy} — ${T.printHint}`} onClick={copyLink}>
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Link2 className="w-3.5 h-3.5 text-cosmic-gold" />}
          <span className="hidden sm:inline">{copied ? T.copied : T.copy}</span>
        </button>
        <button className={shareBtn} title={T.more} onClick={nativeShare}>
          <Share2 className="w-3.5 h-3.5 text-indigo-400" /><span className="hidden sm:inline">{T.more}</span>
        </button>
        <button
          className={`${shareBtn} ${pdfBusy !== 'none' ? 'opacity-60 pointer-events-none' : ''}`}
          title={language === 'or' ? 'A4 PDF ସିଧାସଳଖ ଡାଉନଲୋଡ୍ କରନ୍ତୁ' : language === 'hi' ? 'A4 PDF सीधा डाउनलोड करें' : 'Download A4 PDF directly'}
          onClick={downloadPdf}
        >
          <Download className={`w-3.5 h-3.5 text-amber-400 ${pdfBusy === 'download' ? 'animate-pulse' : ''}`} />
          <span className="hidden sm:inline">{pdfBusy === 'download' ? T.pdfBusy : T.pdfDl}</span>
        </button>
        <button
          className={`${shareBtn} ${pdfBusy !== 'none' ? 'opacity-60 pointer-events-none' : ''} border-emerald-500/40`}
          title={language === 'or' ? 'PDF ଫାଇଲ୍ ସହିତ WhatsApp/Telegram/Gmail ସେୟାର' : language === 'hi' ? 'PDF फ़ाइल के साथ WhatsApp/Telegram/Gmail शेयर' : 'Share the PDF file itself on WhatsApp/Telegram/Gmail'}
          onClick={sharePdf}
        >
          <Send className={`w-3.5 h-3.5 text-emerald-400 ${pdfBusy === 'share' ? 'animate-pulse' : ''}`} />
          <span className="hidden sm:inline">{pdfBusy === 'share' ? T.pdfBusy : T.pdfShare}</span>
        </button>
        <button
          onClick={onPrint}
          title={T.printHint}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-cosmic-gold to-yellow-400 text-cosmic-950 font-black text-[11px] sm:text-xs cursor-pointer shadow-lg hover:scale-[1.03] transition-all ml-auto"
        >
          <Printer className="w-3.5 h-3.5" /><span>{T.print}</span>
        </button>
      </div>

      {/* Active edition hint */}
      <p className="text-[10.5px] text-slate-400 leading-snug">
        📌 {modes.find(m => m.id === mode)?.hint}
        {mode === 'year' ? '' : ''} • {T.printHint}
      </p>
    </div>
  );
};

