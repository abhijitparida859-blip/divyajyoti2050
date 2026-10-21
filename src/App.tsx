import React, { useState } from 'react';
import { I18nProvider, useI18n } from './localization/i18n';
import { Header } from './components/layout/Header';
import { NavigationBar, NavTab } from './components/layout/NavigationBar';
import { PanjikaView } from './components/panjika/PanjikaView';
import { OdiaCalendarView } from './components/calendar/OdiaCalendarView';
import { KundaliRenderer } from './components/jataka/KundaliRenderer';
import { CosmosView } from './components/3d/CosmosView';
import { MilanMatchView } from './components/milan/MilanMatchView';
import { DigitalMala108 } from './components/mala/DigitalMala108';
import { CalmStudio } from './components/meditation/CalmStudio';
import { SmartVedicTodo } from './components/todo/SmartVedicTodo';
import { AdvancePalmReader } from './components/palm/AdvancePalmReader';
import { calculatePanjika } from './core/panjika/panjika_engine';
import { getSavedUserLocation } from './core/geo/mobileLocationService';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-cosmic-950/90 border border-rose-500/40 rounded-3xl text-center space-y-4 my-8 max-w-2xl mx-auto">
          <div className="text-4xl">⚠️</div>
          <h2 className="text-xl font-bold text-rose-300 font-serif">ପ୍ରଦର୍ଶନରେ ତ୍ରୁଟି ଦେଖାଦେଇଛି (Rendering Error)</h2>
          <p className="text-xs text-slate-300 font-mono bg-black/50 p-3 rounded-xl max-w-xl mx-auto overflow-x-auto text-left">
            {this.state.error?.message || 'Unknown error occurred'}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-5 py-2.5 bg-gradient-to-r from-cosmic-gold to-amber-500 text-cosmic-950 font-bold text-xs rounded-xl cursor-pointer hover:shadow-lg transition-all"
          >
            🔄 ପୁନର୍ବାର ଚେଷ୍ଟା କରନ୍ତୁ (Retry)
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const MainAppContent: React.FC = () => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<NavTab>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const validTabs: NavTab[] = ['panjika', 'calendar', 'jataka', 'cosmos', 'milan', 'mala', 'meditation', 'todo', 'palm'];
      if (validTabs.includes(hash as NavTab)) {
        return hash as NavTab;
      }
    }
    return 'calendar';
  });

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.location.hash = tab;
    }
  };

  // Deep-link support: SevaMandala cards & any hash navigation switch tabs live.
  React.useEffect(() => {
    const VALID_TABS: NavTab[] = ['panjika', 'calendar', 'jataka', 'cosmos', 'milan', 'mala', 'meditation', 'todo', 'palm'];
    const onHashChange = () => {
      const h = window.location.hash.replace('#', '').toLowerCase();
      if (VALID_TABS.includes(h as NavTab)) {
        setActiveTab(h as NavTab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const todayPanjika = React.useMemo(() => {
    const savedLoc = getSavedUserLocation();
    const lat = savedLoc?.lat ?? 19.8135; // Default: Srikshetra Puri
    const lon = savedLoc?.lon ?? 85.8312;
    return calculatePanjika(new Date(), lat, lon);
  }, []);

  return (
    <div className="min-h-screen bg-cosmic-950 text-slate-100 flex flex-col font-sans selection:bg-cosmic-gold selection:text-cosmic-950">
      {/* Background Cosmic Star Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cosmic-saffron/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-cosmic-gold/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-cosmic-amethyst/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <Header currentTithi={todayPanjika.tithi.nameKey} />

      {/* Navigation */}
      <NavigationBar activeTab={activeTab} setActiveTab={handleTabChange} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 md:p-8 pb-28 md:pb-12">
        <ErrorBoundary key={activeTab}>
          {activeTab === 'panjika' && <PanjikaView />}
          {activeTab === 'calendar' && <OdiaCalendarView />}
          {activeTab === 'jataka' && <KundaliRenderer />}
          {activeTab === 'cosmos' && <CosmosView />}
          {activeTab === 'milan' && <MilanMatchView />}
          {activeTab === 'mala' && <DigitalMala108 />}
          {activeTab === 'meditation' && <CalmStudio />}
          {activeTab === 'todo' && <SmartVedicTodo />}
          {activeTab === 'palm' && <AdvancePalmReader />}
        </ErrorBoundary>
      </main>

      {/* 2050 Futuristic Footer */}
      <footer className="border-t border-cosmic-gold/15 bg-cosmic-950/80 backdrop-blur-md py-4 px-6 text-center text-[11px] text-slate-400 z-10">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>✨ <strong>{t('app_name')}</strong> • {t('footer_credit')}</span>
          <span className="text-slate-400">{t('footer_sub')}</span>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <I18nProvider>
      <MainAppContent />
    </I18nProvider>
  );
}

export default App;