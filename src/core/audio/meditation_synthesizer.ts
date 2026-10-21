/**
 * Zero-Dependency 100% Offline Vedic Audio Synthesizer
 * Uses Web Audio API to create authentic soundscapes without requiring MP3 downloads
 */
class MeditationSynthesizer {
  private ctx: AudioContext | null = null;
  private omOsc: OscillatorNode | null = null;
  private omGain: GainNode | null = null;
  private binauralLeft: OscillatorNode | null = null;
  private binauralRight: OscillatorNode | null = null;
  private binauralGain: GainNode | null = null;
  private isPlayingOm: boolean = false;
  private isPlayingBinaural: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Plays a resonant Temple Bell / Singing Bowl Chime (e.g. for Mala 108 or ending timer)
   */
  public playTempleChime(freq: number = 432) {
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    // Subtle natural overtone
    const overtone = this.ctx.createOscillator();
    const overtoneGain = this.ctx.createGain();
    overtone.type = 'triangle';
    overtone.frequency.setValueAtTime(freq * 2.76, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 3.5);

    overtoneGain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.0);

    osc.connect(gain);
    overtone.connect(overtoneGain);
    gain.connect(this.ctx.destination);
    overtoneGain.connect(this.ctx.destination);

    osc.start();
    overtone.start();
    osc.stop(this.ctx.currentTime + 3.6);
    overtone.stop(this.ctx.currentTime + 2.1);
  }

  /**
   * Subtle mala bead clicking sound for tactile feedback
   */
  public playBeadClick() {
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  /**
   * Cosmic 136.1 Hz Vedic Om Drone with rich undertones
   */
  public toggleOmDrone(volume: number = 0.3): boolean {
    this.initContext();
    if (!this.ctx) return false;

    if (this.isPlayingOm) {
      if (this.omGain) {
        this.omGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
      }
      setTimeout(() => {
        this.omOsc?.stop();
        this.omOsc?.disconnect();
        this.omOsc = null;
        this.omGain = null;
      }, 850);
      this.isPlayingOm = false;
      return false;
    } else {
      this.omOsc = this.ctx.createOscillator();
      this.omGain = this.ctx.createGain();
      this.omOsc.type = 'triangle';
      this.omOsc.frequency.setValueAtTime(136.1, this.ctx.currentTime); // C# / Cosmic Octave OM

      this.omGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      this.omGain.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + 1.5);

      this.omOsc.connect(this.omGain);
      this.omGain.connect(this.ctx.destination);
      this.omOsc.start();
      this.isPlayingOm = true;
      return true;
    }
  }

  /**
   * 432 Hz Binaural Beat with 7.83 Hz Earth Schumann Resonance
   */
  public toggleBinauralBeats(volume: number = 0.25): boolean {
    this.initContext();
    if (!this.ctx) return false;

    if (this.isPlayingBinaural) {
      if (this.binauralGain) {
        this.binauralGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
      }
      setTimeout(() => {
        this.binauralLeft?.stop();
        this.binauralRight?.stop();
        this.binauralLeft?.disconnect();
        this.binauralRight?.disconnect();
        this.binauralLeft = null;
        this.binauralRight = null;
        this.binauralGain = null;
      }, 850);
      this.isPlayingBinaural = false;
      return false;
    } else {
      const merger = this.ctx.createChannelMerger(2);
      this.binauralGain = this.ctx.createGain();

      this.binauralLeft = this.ctx.createOscillator();
      this.binauralRight = this.ctx.createOscillator();

      const baseFreq = 432;
      const beatFreq = 7.83; // Theta / Schumann

      this.binauralLeft.type = 'sine';
      this.binauralLeft.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);

      this.binauralRight.type = 'sine';
      this.binauralRight.frequency.setValueAtTime(baseFreq + beatFreq, this.ctx.currentTime);

      this.binauralLeft.connect(merger, 0, 0);
      this.binauralRight.connect(merger, 0, 1);

      this.binauralGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      this.binauralGain.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + 1.5);

      merger.connect(this.binauralGain);
      this.binauralGain.connect(this.ctx.destination);

      this.binauralLeft.start();
      this.binauralRight.start();
      this.isPlayingBinaural = true;
      return true;
    }
  }

  public stopAll() {
    if (this.isPlayingOm) this.toggleOmDrone();
    if (this.isPlayingBinaural) this.toggleBinauralBeats();
    this.stopTone();
  }

  private toneOsc: OscillatorNode[] = [];
  private toneGain: GainNode | null = null;
  private activeToneId: string | null = null;
  public isToneActive(id?: string): boolean {
    return this.toneGain !== null && (id === undefined || this.activeToneId === id);
  }

  public playTone(id: string, carrierHz: number, beatHz?: number, volume: number = 0.3): boolean {
    this.initContext();
    if (!this.ctx) return false;
    if (this.activeToneId === id) { this.stopTone(); return false; }
    this.stopTone();
    const t = this.ctx.currentTime;
    this.toneGain = this.ctx.createGain();
    this.toneGain.gain.setValueAtTime(0.0001, t);
    this.toneGain.gain.linearRampToValueAtTime(volume, t + 1.5);
    this.toneGain.connect(this.ctx.destination);
    if (beatHz && beatHz > 0) {
      const merger = this.ctx.createChannelMerger(2);
      merger.connect(this.toneGain);
      const l = this.ctx.createOscillator();
      const r = this.ctx.createOscillator();
      l.type = 'sine'; r.type = 'sine';
      l.frequency.setValueAtTime(carrierHz, t);
      r.frequency.setValueAtTime(carrierHz + beatHz, t);
      l.connect(merger, 0, 0); r.connect(merger, 0, 1);
      l.start(); r.start();
      this.toneOsc.push(l, r);
    } else {
      const o = this.ctx.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(carrierHz, t);
      o.connect(this.toneGain);
      o.start();
      this.toneOsc.push(o);
    }
    this.activeToneId = id;
    return true;
  }
  public stopTone() {
    if (!this.ctx || this.toneOsc.length === 0) {
      this.toneOsc = []; this.toneGain = null; this.activeToneId = null; return;
    }
    const t = this.ctx.currentTime;
    try { this.toneGain?.gain.linearRampToValueAtTime(0.0001, t + 0.6); } catch { /* ignore */ }
    const oscs = [...this.toneOsc];
    const g = this.toneGain;
    setTimeout(() => {
      oscs.forEach((o) => { try { o.stop(); } catch { /* ignore */ } try { o.disconnect(); } catch { /* ignore */ } });
      try { g?.disconnect(); } catch { /* ignore */ }
    }, 700);
    this.toneOsc = []; this.toneGain = null; this.activeToneId = null;
  }
  public playPhaseCue(kind: 'inhale' | 'exhale' | 'hold' | 'done') {
    const base = kind === 'inhale' ? 528 : kind === 'exhale' ? 396 : kind === 'done' ? 639 : 471;
    this.playTempleChime(base);
  }

  public playAudioCue(kind: 'inhale' | 'exhale' | 'hold' | 'done') {
    this.playPhaseCue(kind);
  }
}

export const audioSynth = new MeditationSynthesizer();
