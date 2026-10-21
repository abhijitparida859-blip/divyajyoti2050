import React from 'react';
import { useI18n } from '../../localization/i18n';
import { Calendar, CalendarDays, Compass, Globe2, HeartHandshake, CircleDot, Music, CheckSquare, Hand } from 'lucide-react';

export type NavTab = 'panjika' | 'calendar' | 'jataka' | 'cosmos' | 'milan' | 'mala' | 'meditation' | 'todo' | 'palm';

interface NavigationBarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useI18n();

  const navItems: { id: NavTab; labelKey: string; icon: React.ReactNode }[] = [
    { id: 'panjika', labelKey: 'nav_panjika', icon: <Calendar className="w-4 h-4" /> },
    { id: 'calendar', labelKey: 'nav_calendar', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'jataka', labelKey: 'nav_jataka', icon: <Compass className="w-4 h-4" /> },
    { id: 'cosmos', labelKey: 'nav_cosmos', icon: <Globe2 className="w-4 h-4" /> },
    { id: 'milan', labelKey: 'nav_milan', icon: <HeartHandshake className="w-4 h-4" /> },
    { id: 'mala', labelKey: 'nav_mala', icon: <CircleDot className="w-4 h-4" /> },
    { id: 'meditation', labelKey: 'nav_meditation', icon: <Music className="w-4 h-4" /> },
    { id: 'todo', labelKey: 'nav_todo', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'palm', labelKey: 'nav_palm', icon: <Hand className="w-4 h-4" /> },
  ];

  return (
    <nav className="w-full bg-cosmic-950/95 backdrop-blur-xl border-t md:border-t-0 md:border-b border-cosmic-gold/20 py-2 px-2 sm:px-3 sticky bottom-0 md:top-[65px] z-40 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-2xl">
      <div className="max-w-6xl mx-auto overflow-x-auto mobile-touch-scroll no-scrollbar py-0.5 px-1">
        <div className="flex w-max items-center justify-start md:justify-center gap-1 sm:gap-2 px-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl transition-all duration-200 text-xs font-medium whitespace-nowrap active:scale-95 shrink-0 touch-manipulation min-h-[44px] justify-center cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-cosmic-gold/20 to-cosmic-saffron/20 border border-cosmic-gold/50 text-cosmic-gold shadow-lg shadow-cosmic-gold/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              <span className={isActive ? 'text-cosmic-gold' : 'text-slate-400'}>{item.icon}</span>
              <span className="text-[10px] sm:text-xs tracking-tight">{t(item.labelKey)}</span>
            </button>
          );
        })}
        </div>
      </div>
    </nav>
  );
};