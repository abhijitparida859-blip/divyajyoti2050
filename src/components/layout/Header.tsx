import React from 'react';
import { useI18n, Language } from '../../localization/i18n';
import { Sparkles, Globe } from 'lucide-react';
import { audioSynth } from '../../core/audio/meditation_synthesizer';

interface HeaderProps {
  currentTithi: string;
}

export const Header: React.FC<HeaderProps> = ({ currentTithi }) => {
  const { language, setLanguage, t, tTithiFromKey } = useI18n();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-cosmic-950/80 border-b border-cosmic-gold/20 px-4 py-3 sm:px-8 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-cosmic-saffron to-cosmic-gold flex items-center justify-center shadow-lg shadow-cosmic-saffron/20 group cursor-pointer">
            <Sparkles className="w-5 h-5 text-cosmic-950 animate-spin-slow" />
            <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif tracking-wide bg-gradient-to-r from-cosmic-gold via-yellow-200 to-cosmic-saffron bg-clip-text text-transparent">
              {t('app_name')}
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-400 font-medium tracking-wider">
              {t('tagline')}
            </p>
          </div>
        </div>

        {/* Live Tithi Badge & Global Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-cosmic-900/90 border border-cosmic-gold/30 px-3.5 py-1.5 rounded-full text-xs text-cosmic-gold shadow-inner">
            <span className="w-2 h-2 rounded-full bg-cosmic-saffron animate-ping" />
            <span className="font-semibold">{tTithiFromKey(currentTithi)}</span>
          </div>

          {/* Quick Sound Bell */}
          <button
            onClick={() => audioSynth.playTempleChime(432)}
            title="Temple Chime (432Hz)"
            className="p-2 rounded-xl bg-cosmic-900/80 border border-cosmic-gold/25 hover:border-cosmic-gold/60 text-cosmic-gold transition-colors shadow-sm active:scale-95"
          >
            🔔
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative flex items-center bg-cosmic-900/80 border border-cosmic-gold/30 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 hover:border-cosmic-gold/60 transition-colors">
            <Globe className="w-3.5 h-3.5 mr-1.5 text-cosmic-gold" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent text-xs text-slate-100 focus:outline-none cursor-pointer pr-1"
            >
              <option value="en" className="bg-cosmic-950 text-slate-200">English</option>
              <option value="hi" className="bg-cosmic-950 text-slate-200">हिन्दी (Devanagari)</option>
              <option value="or" className="bg-cosmic-950 text-slate-200">ଓଡ଼ିଆ (Odia)</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};