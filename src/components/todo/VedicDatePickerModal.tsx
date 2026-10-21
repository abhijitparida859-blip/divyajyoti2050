import React, { useState } from 'react';
import { useI18n } from '../../localization/i18n';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Check, X, Sparkles } from 'lucide-react';
import { WEEKDAY_METADATA, dayKey } from '../../core/todo/todoPlanner';

interface VedicDatePickerModalProps {
  initialDate?: string; // YYYY-MM-DD
  onConfirm: (dateStr: string) => void;
  onClose: () => void;
}

export const VedicDatePickerModal: React.FC<VedicDatePickerModalProps> = ({
  initialDate,
  onConfirm,
  onClose,
}) => {
  const { language, formatNumber } = useI18n();

  const parseInitial = () => {
    if (initialDate && /^\d{4}-\d{2}-\d{2}$/.test(initialDate)) {
      const [y, m, d] = initialDate.split('-').map(Number);
      return new Date(y, m - 1, d);
    }
    return new Date();
  };

  const [currentMonth, setCurrentMonth] = useState<Date>(parseInitial);
  const [selectedDate, setSelectedDate] = useState<Date>(parseInitial);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth(); // 0-indexed

  // Month navigation
  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  // Compute calendar grid
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: Array<Date | null> = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(new Date(year, month, d));
  }

  const today = new Date();
  const isSameDay = (d1: Date, d2: Date) => dayKey(d1) === dayKey(d2);

  const handleConfirm = () => {
    onConfirm(dayKey(selectedDate));
    onClose();
  };

  const MONTH_NAMES_OR = [
    'ଜାନୁଆରୀ', 'ଫେବୃଆରୀ', 'ମାର୍ଚ୍ଚ', 'ଏପ୍ରିଲ', 'ମେ', 'ଜୁନ',
    'ଜୁଲାଇ', 'ଅଗଷ୍ଟ', 'ସେପ୍ଟେମ୍ବର', 'ଅକ୍ଟୋବର', 'ନଭେମ୍ବର', 'ଡିସେମ୍ବର'
  ];
  const MONTH_NAMES_HI = [
    'जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
    'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
  ];
  const monthLabel = language === 'or' ? MONTH_NAMES_OR[month] : language === 'hi' ? MONTH_NAMES_HI[month] : currentMonth.toLocaleString('default', { month: 'long' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-cosmic-950 via-cosmic-900 to-black border-2 border-cosmic-gold p-6 shadow-2xl text-center">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2 text-cosmic-gold font-bold text-sm">
            <CalendarIcon className="w-4 h-4 text-cosmic-saffron" />
            <span>{language === 'or' ? 'ତାରିଖ ବାଛନ୍ତୁ (Visual Calendar)' : language === 'hi' ? 'तारीख चुनें (Visual Calendar)' : 'Choose Date'}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4 bg-black/50 border border-white/10 rounded-2xl px-3 py-2">
          <button
            type="button"
            onClick={prevMonth}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="text-sm font-bold font-serif text-cosmic-gold">
            {monthLabel} {formatNumber(year)}
          </div>
          <button
            type="button"
            onClick={nextMonth}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Weekday Header */}
        <div className="grid grid-cols-7 gap-1 text-[11px] font-bold text-slate-400 mb-2">
          {WEEKDAY_METADATA.map(w => (
            <div key={w.index} className="py-1">
              {w.short[language] || w.short.or}
            </div>
          ))}
        </div>

        {/* Calendar Days Grid */}
        <div className="grid grid-cols-7 gap-1 mb-5">
          {days.map((d, idx) => {
            if (!d) {
              return <div key={`empty-${idx}`} className="h-9" />;
            }

            const isToday = isSameDay(d, today);
            const isSelected = isSameDay(d, selectedDate);

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedDate(d)}
                className={`h-9 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center active:scale-90 ${
                  isSelected
                    ? 'bg-cosmic-gold text-cosmic-950 shadow-md shadow-cosmic-gold/30 font-black'
                    : isToday
                      ? 'border border-cosmic-gold text-cosmic-gold bg-cosmic-gold/10'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {formatNumber(d.getDate())}
              </button>
            );
          })}
        </div>

        {/* Quick Date Shortcuts */}
        <div className="flex gap-2 mb-5">
          <button
            type="button"
            onClick={() => {
              setSelectedDate(today);
              setCurrentMonth(new Date());
            }}
            className="flex-1 py-1.5 rounded-xl bg-cosmic-950 border border-white/10 text-slate-300 hover:border-cosmic-gold text-xs font-medium transition-colors"
          >
            {language === 'or' ? 'ଆଜି (Today)' : 'Today'}
          </button>
          <button
            type="button"
            onClick={() => {
              const tom = new Date();
              tom.setDate(tom.getDate() + 1);
              setSelectedDate(tom);
              setCurrentMonth(new Date(tom.getFullYear(), tom.getMonth(), 1));
            }}
            className="flex-1 py-1.5 rounded-xl bg-cosmic-950 border border-white/10 text-slate-300 hover:border-cosmic-gold text-xs font-medium transition-colors"
          >
            {language === 'or' ? 'ଆସନ୍ତାକାଲି (Tomorrow)' : 'Tomorrow'}
          </button>
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
            {language === 'or' ? 'ନିଶ୍ଚିତ କରନ୍ତୁ' : language === 'hi' ? 'तारीख तय करें' : 'Confirm Date'}
          </button>
        </div>
      </div>
    </div>
  );
};
