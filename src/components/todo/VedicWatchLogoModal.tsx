// src/components/todo/VedicWatchLogoModal.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '../../localization/i18n';
import { VEDIC_WATCH_LOGOS, VedicWatchLogo, getWatchLogoById } from '../../core/todo/vedicWatchLogos';
import { Sparkles, Check, X, Search, Shield, Flame, Compass, Crown, Eye, ArrowUp } from 'lucide-react';

interface VedicWatchLogoModalProps {
  isOpen: boolean;
  activeLogoId: string;
  onSelectLogo: (logoId: string) => void;
  onClose: () => void;
}

export const VedicWatchLogoModal: React.FC<VedicWatchLogoModalProps> = ({
  isOpen,
  activeLogoId,
  onSelectLogo,
  onClose,
}) => {
  const { language } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [justSelectedToast, setJustSelectedToast] = useState<string | null>(null);
  
  // Highlighted preview (defaults to active or hovered)
  const [previewLogoId, setPreviewLogoId] = useState<string>(activeLogoId);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPreviewLogoId(activeLogoId);
    }
  }, [isOpen, activeLogoId]);

  if (!isOpen) return null;

  const activeLogo = getWatchLogoById(activeLogoId);
  const previewLogo = getWatchLogoById(previewLogoId) || activeLogo;

  const categories: Array<{ id: string; labelOr: string; labelHi: string; labelEn: string; icon: React.ReactNode }> = [
    { id: 'all', labelOr: 'ସମସ୍ତ (୨୦)', labelHi: 'सभी (२०)', labelEn: 'All (20)', icon: <Crown className="w-3.5 h-3.5" /> },
    { id: 'sacred_symbol', labelOr: 'ପବିତ୍ର ପ୍ରତୀକ', labelHi: 'पवित्र प्रतीक', labelEn: 'Sacred Symbols', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'divine_weapon', labelOr: 'ଦିବ୍ୟ ଆୟୁଧ', labelHi: 'दिव्य आयुध', labelEn: 'Divine Weapons', icon: <Flame className="w-3.5 h-3.5" /> },
    { id: 'celestial_astro', labelOr: 'ଜ୍ୟୋତିଷ ଓ ମଣ୍ଡଳ', labelHi: 'ज्योतिष व मंडल', labelEn: 'Celestial & Astro', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'royal_regalia', labelOr: 'ରାଜକୀୟ ଐତିହ୍ୟ', labelHi: 'राजकीय धरोहर', labelEn: 'Royal Regalia', icon: <Shield className="w-3.5 h-3.5" /> },
  ];

  const filteredLogos = VEDIC_WATCH_LOGOS.filter(logo => {
    const matchesCat = selectedCategory === 'all' || logo.category === selectedCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery = !q || (
      logo.nameOr.toLowerCase().includes(q) ||
      logo.nameHi.toLowerCase().includes(q) ||
      logo.nameEn.toLowerCase().includes(q) ||
      logo.taglineOr.toLowerCase().includes(q) ||
      logo.taglineEn.toLowerCase().includes(q)
    );
    return matchesCat && matchesQuery;
  });

  const handleApplyLogo = (logo: VedicWatchLogo) => {
    onSelectLogo(logo.id);
    setPreviewLogoId(logo.id);
    const name = language === 'or' ? logo.nameOr : language === 'hi' ? logo.nameHi : logo.nameEn;
    setJustSelectedToast(name);
    setTimeout(() => {
      setJustSelectedToast(null);
    }, 2800);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setShowScrollTop(e.currentTarget.scrollTop > 180);
  };

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl h-[92vh] flex flex-col rounded-3xl bg-gradient-to-br from-cosmic-950 via-slate-950 to-cosmic-900 border-2 border-cosmic-gold/50 shadow-[0_0_70px_rgba(245,158,11,0.35)] text-slate-100 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Decorative background glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-cosmic-gold/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-sky-500/15 blur-3xl pointer-events-none" />

        {/* ── Modal Header (Compact & High-Impact) ── */}
        <div className="relative flex items-center justify-between px-4 py-3 sm:px-6 sm:py-3.5 border-b border-white/10 shrink-0 bg-cosmic-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cosmic-gold via-yellow-400 to-amber-600 grid place-items-center text-cosmic-950 shadow-lg shadow-cosmic-gold/30">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-serif bg-gradient-to-r from-white via-yellow-100 to-cosmic-gold bg-clip-text text-transparent">
                  {language === 'or' ? '୨୦ଟି ଆଧୁନିକ ସ୍ମାର୍ଟ ୱାଚ୍ ଫେସ୍ ଓ ୱାଲପେପର୍' : language === 'hi' ? '२० आधुनिक स्मार्ट वॉच फेस व वॉलपेपर' : '20 Modern Luxury Smart Watch Faces & Wallpapers'}
                </h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-cosmic-gold text-cosmic-950 shadow-sm">
                  20 Wallpapers
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {language === 'or' ? 'ଆପଣଙ୍କ ୩D ବୈଦିକ ସ୍ମାର୍ଟ ୱାଚ୍ ପାଇଁ ଲଗ୍ଜରୀ ୱାଲପେପର୍ ବାଛନ୍ତୁ' : language === 'hi' ? 'अपनी 3D स्मार्ट वॉच के लिए मनपसंद वॉलपेपर चुनें' : 'Choose your signature luxury wallpaper for the 3D Vedic Smart Watch'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 grid place-items-center text-slate-300 hover:text-white transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Toast banner when selected ── */}
        {justSelectedToast && (
          <div className="bg-emerald-500/25 border-b border-emerald-500/40 text-emerald-300 px-5 py-2 text-xs font-bold flex items-center justify-between animate-fade-in shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>
                {language === 'or'
                  ? `✨ ୱାଚ୍ ୱାଲପେପର୍ "${justSelectedToast}" ସଫଳତାର ସହ ପ୍ରୟୋଗ କରାଗଲା!`
                  : language === 'hi'
                    ? `✨ वॉच वॉलपेपर "${justSelectedToast}" सफलतापूर्वक लागू हुआ!`
                    : `✨ Watch wallpaper "${justSelectedToast}" applied successfully!`}
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-mono font-extrabold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">LIVE APPLIED</span>
          </div>
        )}

        {/* ── Sleek Compact Preview Bar (Takes minimal height, leaves maximum for scroll) ── */}
        <div className="px-4 sm:px-6 py-2.5 bg-gradient-to-r from-cosmic-950 via-slate-900/90 to-cosmic-950 border-b border-white/10 shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Mini Watch Preview */}
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0">
                <div className="absolute right-[-2px] top-1/2 -translate-y-1/2 w-1.5 h-3.5 rounded-r bg-amber-500 border-r border-amber-300" />
                <div className="w-full h-full rounded-full p-0.5 bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 shadow-md flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-black overflow-hidden flex items-center justify-center">
                    <div
                      className="w-full h-full"
                      dangerouslySetInnerHTML={{ __html: previewLogo.svgString }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-cosmic-gold px-1.5 py-0.5 rounded bg-cosmic-gold/15 border border-cosmic-gold/30">
                    {previewLogo.categoryLabelOr}
                  </span>
                  {previewLogo.id === activeLogoId ? (
                    <span className="text-[9px] font-extrabold text-emerald-400 flex items-center gap-1 bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/40">
                      <Check className="w-2.5 h-2.5 stroke-[3]" /> ସକ୍ରିୟ (ACTIVE)
                    </span>
                  ) : (
                    <span className="text-[9px] font-medium text-slate-400 flex items-center gap-1">
                      <Eye className="w-2.5 h-2.5" /> ପ୍ରିଭ୍ୟୁ (PREVIEW)
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <h4 className="text-sm font-bold text-white font-serif">
                    {language === 'or' ? previewLogo.nameOr : language === 'hi' ? previewLogo.nameHi : previewLogo.nameEn}
                  </h4>
                  <span className="text-xs text-cosmic-gold/80 font-medium hidden sm:inline">{previewLogo.nameEn}</span>
                </div>
              </div>
            </div>

            {/* Quick Apply Button on Preview Stage */}
            {previewLogo.id !== activeLogoId && (
              <button
                type="button"
                onClick={() => handleApplyLogo(previewLogo)}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cosmic-gold via-amber-500 to-amber-600 hover:brightness-110 text-cosmic-950 font-extrabold text-xs shadow-md shadow-cosmic-gold/25 flex items-center gap-1.5 transition-all hover:scale-105 shrink-0"
              >
                <Crown className="w-3.5 h-3.5 text-cosmic-950" />
                <span>{language === 'or' ? 'ଏହାକୁ ଲଗାନ୍ତୁ' : language === 'hi' ? 'इसे लगाएं' : 'Apply Wallpaper'}</span>
              </button>
            )}
          </div>
        </div>

        {/* ── Search & Filter Tabs ── */}
        <div className="p-3 sm:px-6 sm:py-2.5 border-b border-white/10 space-y-2 bg-cosmic-950/80 shrink-0">
          <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={language === 'or' ? 'ୱାଲପେପର୍ ଖୋଜନ୍ତୁ (ନୀଳଚକ୍ର, ସୁଦର୍ଶନ, ତ୍ରିଶୂଳ, ଓଁକାର, କୋଣାର୍କ...)' : language === 'hi' ? 'वॉलपेपर खोजें...' : 'Search wallpapers by name...'}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-black/60 border border-white/15 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cosmic-gold"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {categories.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                    selectedCategory === c.id
                      ? 'bg-gradient-to-r from-cosmic-gold to-amber-500 text-cosmic-950 shadow-md shadow-cosmic-gold/25'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                  }`}
                >
                  {c.icon}
                  <span>{language === 'or' ? c.labelOr : language === 'hi' ? c.labelHi : c.labelEn}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── 20 Smart Watch Wallpapers Grid (Generous Bottom Padding for Smooth, Complete Scrolling) ── */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 sm:px-6 pt-4 pb-36 overscroll-contain cosmic-visible-scrollbar"
          style={{ scrollBehavior: 'smooth' }}
          tabIndex={0}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredLogos.map(logo => {
              const isActive = logo.id === activeLogoId;
              const isPreviewed = logo.id === previewLogoId;
              const name = language === 'or' ? logo.nameOr : language === 'hi' ? logo.nameHi : logo.nameEn;
              const tagline = language === 'or' ? logo.taglineOr : language === 'hi' ? logo.taglineHi : logo.taglineEn;
              const catLabel = language === 'or' ? logo.categoryLabelOr : language === 'hi' ? logo.categoryLabelHi : logo.categoryLabelEn;

              return (
                <div
                  key={logo.id}
                  onMouseEnter={() => setPreviewLogoId(logo.id)}
                  onClick={() => handleApplyLogo(logo)}
                  className={`group relative flex flex-col justify-between rounded-2xl p-4 transition-all duration-300 cursor-pointer text-left border ${
                    isActive
                      ? 'bg-gradient-to-b from-cosmic-gold/20 via-amber-950/40 to-cosmic-950 border-cosmic-gold ring-2 ring-cosmic-gold/60 shadow-[0_0_30px_rgba(245,158,11,0.35)] scale-[1.02]'
                      : isPreviewed
                        ? 'bg-cosmic-900/90 border-sky-400/60 shadow-[0_0_20px_rgba(56,189,248,0.2)]'
                        : 'bg-cosmic-950/80 hover:bg-cosmic-900/90 border-white/10 hover:border-cosmic-gold/50 hover:shadow-lg hover:shadow-cosmic-gold/15'
                  }`}
                >
                  {/* Top Status Indicators */}
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded border border-white/10">
                      {catLabel}
                    </span>
                    {isActive ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-extrabold flex items-center gap-1 shadow-md">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>{language === 'or' ? 'ସକ୍ରିୟ' : language === 'hi' ? 'सक्रिय' : 'ACTIVE'}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-mono">#{logo.id}</span>
                    )}
                  </div>

                  {/* ── Prominent Luxury Smart Watch Face Mockup (Centered Hero) ── */}
                  <div className="flex flex-col items-center justify-center my-2">
                    <div className="relative w-32 h-32 sm:w-36 sm:h-36 group-hover:scale-105 transition-transform duration-300">
                      {/* Physical Smart Watch Crown Knob on the right */}
                      <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-r bg-gradient-to-b from-amber-400 via-amber-600 to-amber-800 shadow-md border-r border-amber-300 pointer-events-none" />
                      
                      {/* Outer Metallic Bezel */}
                      <div className="w-full h-full rounded-full p-1.5 bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 shadow-xl group-hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] transition-shadow">
                        <div className="w-full h-full rounded-full bg-black overflow-hidden flex items-center justify-center relative">
                          {/* Vector SVG Smart Watch Wallpaper */}
                          <div
                            className="w-full h-full flex items-center justify-center"
                            dangerouslySetInnerHTML={{ __html: logo.svgString }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Info */}
                  <div className="space-y-1 text-center mt-2">
                    <h4 className="text-sm font-bold text-slate-100 group-hover:text-cosmic-gold transition-colors font-serif line-clamp-1">
                      {name}
                    </h4>

                    <div className="text-[11px] text-cosmic-gold font-medium line-clamp-1">
                      {logo.nameEn}
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed pt-0.5">
                      {tagline}
                    </p>
                  </div>

                  {/* Apply Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApplyLogo(logo);
                    }}
                    className={`mt-3 w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      isActive
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25 font-extrabold'
                        : 'bg-white/10 hover:bg-cosmic-gold hover:text-cosmic-950 text-slate-200 border border-white/15'
                    }`}
                  >
                    {isActive ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>{language === 'or' ? 'ଲାଗୁ ହୋଇଛି' : language === 'hi' ? 'लागू है' : 'Applied'}</span>
                      </>
                    ) : (
                      <>
                        <Crown className="w-3.5 h-3.5" />
                        <span>{language === 'or' ? 'ଏହି ୱାଲପେପର୍ ଲଗାନ୍ତୁ' : language === 'hi' ? 'यह वॉलपेपर लगाएं' : 'Apply Wallpaper'}</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}

            {/* Bottom Cushion Spacer to guarantee 100% full visibility of the last row without cutoff */}
            <div className="col-span-full h-20 pointer-events-none" />
          </div>

          {filteredLogos.length === 0 && (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Search className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-sm">କୌଣସି ୱାଲପେପର୍ ମିଳିଲା ନାହିଁ। ଦୟାକରି ଅନ୍ୟ ନାମରେ ଖୋଜନ୍ତୁ।</p>
            </div>
          )}
        </div>

        {/* ── Scroll to Top Floating Pill Button ── */}
        {showScrollTop && (
          <button
            type="button"
            onClick={scrollToTop}
            className="absolute bottom-20 right-6 z-10 px-3 py-1.5 rounded-full bg-cosmic-gold text-cosmic-950 font-bold text-xs shadow-xl flex items-center gap-1.5 hover:scale-105 transition-all animate-bounce"
            title="Scroll to Top"
          >
            <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>ଶୀର୍ଷକୁ ଯାଆନ୍ତୁ</span>
          </button>
        )}

        {/* ── Modal Footer ── */}
        <div className="p-3.5 sm:px-6 sm:py-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 bg-cosmic-950/95 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="w-4 h-4 text-cosmic-gold" />
            <span>
              {language === 'or'
                ? 'ବାଛିଥିବା ୱାଲପେପର୍ ସ୍ୱୟଂଚାଳିତ ଭାବେ ବ୍ରାଉଜର୍ରେ ସେଭ୍ ରହିବ'
                : language === 'hi'
                  ? 'चुना हुआ वॉलपेपर स्वचालित रूप से सेव रहेगा'
                  : 'Selected wallpaper automatically saves for future sessions'}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-cosmic-gold to-amber-500 text-cosmic-950 font-bold text-xs shadow-lg shadow-cosmic-gold/25 hover:brightness-110 transition-all"
          >
            {language === 'or' ? 'ସମ୍ପୂର୍ଣ୍ଣ ଓ ବନ୍ଦ କରନ୍ତୁ' : language === 'hi' ? 'पूर्ण व बंद करें' : 'Done & Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
