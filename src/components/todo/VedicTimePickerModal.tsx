import React, { useState } from 'react';
import { useI18n } from '../../localization/i18n';
import { Clock, Check, X, Sparkles, Sun, Moon } from 'lucide-react';

interface VedicTimePickerModalProps {
  initialTime?: string; // e.g. "06:00 AM" or "18:00"
  onConfirm: (timeStr: string) => void;
  onClose: () => void;
}

export const VedicTimePickerModal: React.FC<VedicTimePickerModalProps> = ({
  initialTime = '06:00 AM',
  onConfirm,
  onClose,
}) => {
  const { language, formatNumber } = useI18n();

  // Parse initial time
  const parseTime = (str: string) => {
    let h = 6;
    let m = 0;
    let period: 'AM' | 'PM' = 'AM';
    const match = str.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (match) {
      h = parseInt(match[1], 10);
      m = parseInt(match[2], 10);
      if (match[3]) {
        period = match[3].toUpperCase() === 'PM' ? 'PM' : 'AM';
      } else if (h >= 12) {
        period = 'PM';
        if (h > 12) h -= 12;
      }
      if (h === 0) h = 12;
    }
    return { h: h > 12 ? h % 12 || 12 : h, m: Math.min(59, Math.max(0, m)), period };
  };

  const parsed = parseTime(initialTime);
  const [selectedHour, setSelectedHour] = useState<number>(parsed.h);
  const [selectedMinute, setSelectedMinute] = useState<number>(parsed.m);
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>(parsed.period);
  const [mode, setMode] = useState<'hour' | 'minute'>('hour');

  const hours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  const handleHourClick = (h: number) => {
    setSelectedHour(h);
    setMode('minute'); // smooth progression to minute selection
  };

  const handleMinuteClick = (m: number) => {
    setSelectedMinute(m);
  };

  const handleConfirm = () => {
    const pad = (n: number) => String(n).padStart(2, '0');
    const timeStr = `${pad(selectedHour)}:${pad(selectedMinute)} ${selectedPeriod}`;
    onConfirm(timeStr);
    onClose();
  };

  const applyPreset = (h: number, m: number, p: 'AM' | 'PM') => {
    setSelectedHour(h);
    setSelectedMinute(m);
    setSelectedPeriod(p);
  };

  // Dial rotation angles
  const hourAngle = (selectedHour % 12) * 30; // 360 / 12
  const minuteAngle = selectedMinute * 6;     // 360 / 60

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-cosmic-950 via-cosmic-900 to-black border-2 border-cosmic-gold p-6 shadow-2xl text-center">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2 text-cosmic-gold font-bold text-sm">
            <Clock className="w-4 h-4 text-cosmic-saffron" />
            <span>{language === 'or' ? 'ସମୟ ବାଛନ୍ତୁ (Time Picker)' : language === 'hi' ? 'समय चुनें (Time Picker)' : 'Select Time'}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Digital Time Display & Mode Tabs */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <div className="flex items-center bg-black/60 border border-cosmic-gold/40 rounded-2xl p-2 shadow-inner">
            <button
              type="button"
              onClick={() => setMode('hour')}
              className={`px-3 py-1.5 rounded-xl text-3xl font-bold font-mono transition-all ${
                mode === 'hour'
                  ? 'bg-cosmic-gold text-cosmic-950 shadow-md shadow-cosmic-gold/20'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {formatNumber(String(selectedHour).padStart(2, '0'))}
            </button>
            <span className="text-2xl font-bold text-cosmic-gold animate-pulse mx-1">:</span>
            <button
              type="button"
              onClick={() => setMode('minute')}
              className={`px-3 py-1.5 rounded-xl text-3xl font-bold font-mono transition-all ${
                mode === 'minute'
                  ? 'bg-cosmic-gold text-cosmic-950 shadow-md shadow-cosmic-gold/20'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {formatNumber(String(selectedMinute).padStart(2, '0'))}
            </button>
          </div>

          {/* AM / PM Toggle */}
          <div className="flex flex-col gap-1 bg-black/60 border border-white/10 rounded-2xl p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setSelectedPeriod('AM')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedPeriod === 'AM'
                  ? 'bg-amber-400 text-cosmic-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              AM
            </button>
            <button
              type="button"
              onClick={() => setSelectedPeriod('PM')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedPeriod === 'PM'
                  ? 'bg-indigo-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              PM
            </button>
          </div>
        </div>

        {/* ── Interactive Analog Clock Face ── */}
        <div className="relative mx-auto w-56 h-56 rounded-full bg-gradient-to-b from-cosmic-950 to-slate-950 border-4 border-cosmic-gold/50 shadow-[0_0_30px_rgba(245,158,11,0.2)] mb-5 flex items-center justify-center select-none">
          {/* Subtle outer tick marks */}
          <div className="absolute inset-1 rounded-full border border-white/5 pointer-events-none" />

          {/* Clock Hand Pointer */}
          <div
            className="absolute top-1/2 left-1/2 w-0.5 bg-cosmic-gold origin-bottom transition-transform duration-200"
            style={{
              height: '40%',
              transform: `translate(-50%, -100%) rotate(${mode === 'hour' ? hourAngle : minuteAngle}deg)`,
            }}
          >
            {/* Hand end orb */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-cosmic-gold text-cosmic-950 font-bold text-xs flex items-center justify-center shadow-md shadow-cosmic-gold/50">
              {formatNumber(mode === 'hour' ? selectedHour : selectedMinute)}
            </div>
          </div>

          {/* Center Hub */}
          <div className="w-3.5 h-3.5 rounded-full bg-cosmic-gold z-10 shadow-md" />

          {/* Radial Numbers */}
          {(mode === 'hour' ? hours : minutes).map((val, idx) => {
            // angle from 12 o'clock in radians
            const angleDeg = idx * 30; // 0 deg is 12, 30 deg is 1, etc.
            const angleRad = ((angleDeg - 90) * Math.PI) / 180;
            const radius = 86; // px from center
            const x = Math.cos(angleRad) * radius;
            const y = Math.sin(angleRad) * radius;
            const isSelected = mode === 'hour' ? selectedHour === val : selectedMinute === val;

            return (
              <button
                key={val}
                type="button"
                onClick={() => (mode === 'hour' ? handleHourClick(val) : handleMinuteClick(val))}
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                }}
                className={`absolute w-8 h-8 rounded-full text-xs font-bold font-mono transition-all flex items-center justify-center active:scale-90 ${
                  isSelected
                    ? 'text-cosmic-950 font-black'
                    : 'text-slate-300 hover:text-cosmic-gold hover:bg-white/10'
                }`}
              >
                {formatNumber(mode === 'minute' ? String(val).padStart(2, '0') : val)}
              </button>
            );
          })}
        </div>

        {/* Quick Vedic Muhurta Presets */}
        <div className="mb-5">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-cosmic-gold" />
            <span>{language === 'or' ? 'ଶୁଭ ମୁହୂର୍ତ୍ତ ସର୍ଟକଟ୍' : language === 'hi' ? 'शुभ मुहूर्त शॉर्टकट' : 'Vedic Muhurta Presets'}</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => applyPreset(4, 30, 'AM')}
              className="px-2.5 py-1.5 rounded-xl bg-cosmic-950 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10 text-left truncate transition-colors"
            >
              🌅 ୦୪:୩୦ AM ବ୍ରାହ୍ମ ମୁହୂର୍ତ୍ତ
            </button>
            <button
              type="button"
              onClick={() => applyPreset(6, 0, 'AM')}
              className="px-2.5 py-1.5 rounded-xl bg-cosmic-950 border border-amber-500/30 text-amber-300 hover:bg-amber-500/10 text-left truncate transition-colors"
            >
              ☀️ ୦୬:୦୦ AM ସୂର୍ଯ୍ୟୋଦୟ
            </button>
            <button
              type="button"
              onClick={() => applyPreset(11, 45, 'AM')}
              className="px-2.5 py-1.5 rounded-xl bg-cosmic-950 border border-cosmic-gold/30 text-cosmic-gold hover:bg-cosmic-gold/10 text-left truncate transition-colors"
            >
              ☀️ ୧୧:୪୫ AM ଅଭିଜିତ୍
            </button>
            <button
              type="button"
              onClick={() => applyPreset(6, 30, 'PM')}
              className="px-2.5 py-1.5 rounded-xl bg-cosmic-950 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10 text-left truncate transition-colors"
            >
              🪔 ୦୬:୩୦ PM ସାୟଂ ସନ୍ଧ୍ୟା
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 rounded-2xl bg-cosmic-950 border border-white/10 text-slate-300 font-bold text-xs hover:bg-white/5 active:scale-95 transition-all"
          >
            {language === 'or' ? 'ରଦ୍ଦ କରନ୍ତୁ' : language === 'hi' ? 'रद्द करें' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="py-2.5 rounded-2xl bg-gradient-to-r from-cosmic-gold to-cosmic-saffron text-cosmic-950 font-bold text-xs shadow-lg shadow-cosmic-gold/25 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            {language === 'or' ? 'ନିଶ୍ଚିତ କରନ୍ତୁ' : language === 'hi' ? 'समय तय करें' : 'Confirm Time'}
          </button>
        </div>
      </div>
    </div>
  );
};
