import React from 'react';
import { ShieldAlert, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class SafeErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('[SafeErrorBoundary] Shielded error caught safely:', error.message, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-cosmic-950/95 border-2 border-amber-500/40 rounded-3xl text-center space-y-4 my-4 max-w-xl mx-auto shadow-2xl backdrop-blur-xl">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-amber-300 font-serif">
              {this.props.fallbackTitle || 'ସୁରକ୍ଷା କବଚ ସକ୍ରିୟ (Safe Component Shield Active)'}
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto leading-relaxed">
              {this.props.fallbackMessage ||
                'ଏହି 3D ମଡ୍ୟୁଲ୍‌ରେ ଏକ ସାମୟିକ ବୈଷୟିକ ସମସ୍ୟା ଦେଖାଦେଇଥିଲା, କିନ୍ତୁ ସୁରକ୍ଷା କବଚ ଏହାକୁ ସୁରକ୍ଷିତ ଭାବେ ନିୟନ୍ତ୍ରଣ କରିଛି।'}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={this.handleReset}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cosmic-gold to-amber-500 text-cosmic-950 hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ପୁନଃଚାଳନ (Safe Reset)</span>
            </button>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-cosmic-900 border border-slate-700 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>ରିଲୋଡ୍ (Reload)</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
