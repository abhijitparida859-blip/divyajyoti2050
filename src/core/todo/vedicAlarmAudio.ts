/**
 * ============================================================================
 *  HIGH-FIDELITY REALISTIC VEDIC ALARM AUDIO ENGINE
 * ============================================================================
 *  Physical acoustic modeling for sacred temple instruments via Web Audio API:
 *   1. Temple Brass Bell (୪୩୨ Hz with 5 authentic harmonic partials & hammer strike)
 *   2. Sacred Conch / Shankha (Spiral shell formant acoustic resonance & breath flutter)
 *   3. Cosmic Om Tanpura (4-string authentic Pa-Sa-Sa-Sa drone with jawari shimmer)
 *   4. Shiva's Damaru (Dual leather membrane strike with pitch glide)
 *   5. Krishna Divine Flute (Bamboo chiff attack & devotional swaras)
 *   6. 528 Hz Crystal Singing Bowl (Dual acoustic interference beating)
 *   7. Golden Vedic Chime (Celestial tubular bells)
 *   + Custom audio playback
 * ============================================================================
 */

export interface RingtoneOption {
  id: string;
  name: { or: string; hi: string; en: string };
  icon: string;
  description: { or: string; hi: string; en: string };
  color: string;
}

export const BUILTIN_RINGTONES: RingtoneOption[] = [
  {
    id: 'bell',
    name: { or: 'ପିତ୍ତଳ ମନ୍ଦିର ଘଣ୍ଟି (୪୩୨ Hz)', hi: 'पीतल मंदिर घंटी (४३२ Hz)', en: 'Temple Brass Bell (432 Hz)' },
    icon: '🔔',
    description: { or: 'ଶ୍ରୀମନ୍ଦିର ପିତ୍ତଳ ଘଣ୍ଟିର ଶୁଦ୍ଧ ଗଭୀର ଝଙ୍କାର', hi: 'मंदिर घंटी की शुद्ध गहरी गूंज', en: 'Deep resonant bronze bell with authentic non-harmonic partials' },
    color: '#F59E0B',
  },
  {
    id: 'shankha',
    name: { or: 'ପବିତ୍ର ମଙ୍ଗଳ ଶଙ୍ଖ ନାଦ', hi: 'पवित्र मंगल शंख नाद', en: 'Sacred Conch (Shankha)' },
    icon: '🐚',
    description: { or: 'ପ୍ରାଣବାୟୁ ସ୍ପନ୍ଦିତ ପବିତ୍ର ଶଙ୍ଖ ଧ୍ୱନି', hi: 'प्राणवायु स्पंदित पवित्र शंख ध्वनि', en: 'Spiral acoustic horn resonance with breath flutter' },
    color: '#06B6D4',
  },
  {
    id: 'om',
    name: { or: 'ତାନପୁରା ଓଁକାର ନାଦ (୧୩୬.୧ Hz)', hi: 'तानपुरा ओंकार नाद (१३६.१ Hz)', en: 'Tanpura Om Drone (136.1 Hz)' },
    icon: '🕉️',
    description: { or: 'ଚତୁଃ-ତନ୍ତ୍ରୀ ତାନପୁରା ଓଁକାର ସଙ୍ଗୀତ', hi: 'तानपुरा तारों का शांत ओंकार स्पंदन', en: '4-string devotional Tanpura drone with rich jawari shimmer' },
    color: '#EAB308',
  },
  {
    id: 'damaru',
    name: { or: 'ଶିବ ଡମରୁ ତାଳ', hi: 'शिव डमरू ताल', en: "Shiva's Damaru Rhythm" },
    icon: '🪘',
    description: { or: 'ଚର୍ମ ଡମରୁର ଡମ୍-ଡମ୍ ପ୍ରାଣଶକ୍ତି ନାଦ', hi: 'डमरू की प्राणमयी द्वि-ध्वनि', en: 'Dual-strike leather membrane pulse with dynamic pitch glide' },
    color: '#EC4899',
  },
  {
    id: 'flute',
    name: { or: 'କୃଷ୍ଣ ବେଣୁ ମଧୁର ସ୍ୱର', hi: 'कृष्ण वेणु मधुर स्वर', en: 'Krishna Divine Flute' },
    icon: '🪈',
    description: { or: 'ପ୍ରଭାତି ବାଉଁଶ ବଂଶୀର ଶାନ୍ତିଦାୟକ ସୁର', hi: 'बांसुरी का प्रभाती शांत स्वर', en: 'Gentle bamboo wind chiff & devotional ascending melody' },
    color: '#10B981',
  },
  {
    id: 'bowl',
    name: { or: '୫୨୮ Hz କ୍ରିଷ୍ଟାଲ୍ ସିଙ୍ଗିଙ୍ଗ୍ ବୋଲ୍', hi: '५२८ Hz क्रिस्टल सिंगिंग बाउल', en: '528 Hz Singing Bowl' },
    icon: '🥣',
    description: { or: 'ହୃଦୟ ଚକ୍ରର ପ୍ରଶାନ୍ତ ତରଙ୍ଗ ସ୍ପନ୍ଦନ', hi: 'हृदय चक्र शांत स्पंदन व हीलिंग', en: 'Binaural acoustic shimmer inducing peaceful meditation' },
    color: '#8B5CF6',
  },
  {
    id: 'chime',
    name: { or: 'ସ୍ୱର୍ଣ୍ଣିମ ବୈଦିକ ଚାଇମ୍', hi: 'स्वर्णिम वैदिक चाइम', en: 'Golden Celestial Chime' },
    icon: '✨',
    description: { or: 'ପଞ୍ଚ-ସ୍ୱର ଆକାଶୀୟ ପବିତ୍ର ଝଙ୍କାର', hi: 'पंच-स्वर आकाशीय पवित्र झंकार', en: 'Ascending 5-bell harmonic celestial sequence' },
    color: '#F97316',
  },
];

class RealisticVedicAlarmEngine {
  private ctx: AudioContext | null = null;
  private activeGainNodes: GainNode[] = [];
  private activeOscillators: OscillatorNode[] = [];
  private customAudioEl: HTMLAudioElement | null = null;
  private loopInterval: number | null = null;

  private initCtx(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public stop() {
    if (this.loopInterval !== null) {
      window.clearInterval(this.loopInterval);
      this.loopInterval = null;
    }
    for (const osc of this.activeOscillators) {
      try { osc.stop(); osc.disconnect(); } catch { /* ignore */ }
    }
    this.activeOscillators = [];
    for (const g of this.activeGainNodes) {
      try { g.disconnect(); } catch { /* ignore */ }
    }
    this.activeGainNodes = [];

    if (this.customAudioEl) {
      try {
        this.customAudioEl.pause();
        this.customAudioEl.currentTime = 0;
      } catch { /* ignore */ }
      this.customAudioEl = null;
    }
  }

  // ── 1. Realistic Temple Brass Bell (Acoustic 5-Partial Physical Model) ──
  public playTempleBell() {
    const ctx = this.initCtx();
    const now = ctx.currentTime;
    const baseFreq = 432;

    // Authentic bell partial ratios
    const partials = [
      { ratio: 0.5, gain: 0.35, decay: 3.5, type: 'sine' as OscillatorType },    // Hum tone
      { ratio: 1.0, gain: 0.65, decay: 3.0, type: 'sine' as OscillatorType },    // Prime tone
      { ratio: 1.189, gain: 0.35, decay: 2.2, type: 'sine' as OscillatorType },  // Tierce (minor 3rd)
      { ratio: 1.5, gain: 0.28, decay: 1.6, type: 'triangle' as OscillatorType },// Quint
      { ratio: 2.0, gain: 0.22, decay: 1.2, type: 'sine' as OscillatorType },    // Nominal octave
      { ratio: 2.76, gain: 0.15, decay: 0.8, type: 'triangle' as OscillatorType },// Clapper strike
    ];

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.75, now);
    masterGain.connect(ctx.destination);
    this.activeGainNodes.push(masterGain);

    partials.forEach(p => {
      const osc = ctx.createOscillator();
      const pGain = ctx.createGain();

      osc.type = p.type;
      osc.frequency.setValueAtTime(baseFreq * p.ratio, now);

      pGain.gain.setValueAtTime(p.gain, now);
      pGain.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);

      osc.connect(pGain);
      pGain.connect(masterGain);

      osc.start(now);
      osc.stop(now + p.decay + 0.1);

      this.activeOscillators.push(osc);
      this.activeGainNodes.push(pGain);
    });

    // Metallic hammer clapper transient (50ms burst)
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.01));
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(1800, now);
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.2, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);
    noiseSource.start(now);
  }

  // ── 2. Realistic Sacred Shankha (Conch Shell Acoustic Formants & Breath) ──
  public playShankha() {
    const ctx = this.initCtx();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const flutterLfo = ctx.createOscillator();
    const flutterGain = ctx.createGain();

    // Dual formant filters mimicking the spiral shell cavity
    const formant1 = ctx.createBiquadFilter();
    formant1.type = 'bandpass';
    formant1.frequency.setValueAtTime(460, now);
    formant1.Q.setValueAtTime(4.5, now);

    const formant2 = ctx.createBiquadFilter();
    formant2.type = 'bandpass';
    formant2.frequency.setValueAtTime(920, now);
    formant2.Q.setValueAtTime(5.0, now);

    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'triangle';

    // Natural human horn blowing pitch curve: rises smoothly on attack
    osc1.frequency.setValueAtTime(215, now);
    osc1.frequency.linearRampToValueAtTime(238, now + 0.5);
    osc1.frequency.setValueAtTime(236, now + 1.8);
    osc1.frequency.exponentialRampToValueAtTime(210, now + 2.8);

    osc2.frequency.setValueAtTime(216.5, now);
    osc2.frequency.linearRampToValueAtTime(239.5, now + 0.5);
    osc2.frequency.setValueAtTime(237.5, now + 1.8);
    osc2.frequency.exponentialRampToValueAtTime(211.5, now + 2.8);

    // Natural lip flutter (5.4 Hz vibrato)
    flutterLfo.frequency.setValueAtTime(5.4, now);
    flutterGain.gain.setValueAtTime(5.5, now);
    flutterLfo.connect(flutterGain);
    flutterGain.connect(osc1.frequency);
    flutterGain.connect(osc2.frequency);

    // Dynamic wind swell envelope
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.65, now + 0.45);
    gain.gain.setValueAtTime(0.62, now + 1.8);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);

    osc1.connect(formant1);
    osc2.connect(formant1);
    osc1.connect(formant2);
    osc2.connect(formant2);

    formant1.connect(gain);
    formant2.connect(gain);
    gain.connect(ctx.destination);

    flutterLfo.start(now);
    osc1.start(now);
    osc2.start(now);

    flutterLfo.stop(now + 3.1);
    osc1.stop(now + 3.1);
    osc2.stop(now + 3.1);

    this.activeOscillators.push(osc1, osc2, flutterLfo);
    this.activeGainNodes.push(gain, flutterGain);
  }

  // ── 3. Realistic Cosmic Om Tanpura (4-String Devotional Drone) ──
  public playOmDrone() {
    const ctx = this.initCtx();
    const now = ctx.currentTime;

    // Tanpura 4 strings: Pa (204.15Hz), Sa (136.1Hz), Sa (136.1Hz), Kharja Sa (68.05Hz)
    const strings = [
      { freq: 204.15, offset: 0.0, gain: 0.35, dur: 3.8 },
      { freq: 136.10, offset: 0.35, gain: 0.50, dur: 4.2 },
      { freq: 136.10, offset: 0.70, gain: 0.48, dur: 4.2 },
      { freq: 68.05, offset: 1.05, gain: 0.55, dur: 4.5 },
    ];

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.7, now);
    masterGain.connect(ctx.destination);
    this.activeGainNodes.push(masterGain);

    strings.forEach(s => {
      const t = now + s.offset;
      const osc = ctx.createOscillator();
      const jawariOsc = ctx.createOscillator(); // Buzzing overtone of tanpura bridge
      const sGain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(s.freq, t);

      jawariOsc.type = 'sawtooth';
      jawariOsc.frequency.setValueAtTime(s.freq * 2, t);

      // Warm lowpass filter
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(950, t);

      sGain.gain.setValueAtTime(0.001, t);
      sGain.gain.linearRampToValueAtTime(s.gain, t + 0.15);
      sGain.gain.exponentialRampToValueAtTime(0.0001, t + s.dur);

      osc.connect(filter);
      jawariOsc.connect(filter);
      filter.connect(sGain);
      sGain.connect(masterGain);

      osc.start(t);
      jawariOsc.start(t);
      osc.stop(t + s.dur + 0.1);
      jawariOsc.stop(t + s.dur + 0.1);

      this.activeOscillators.push(osc, jawariOsc);
      this.activeGainNodes.push(sGain);
    });
  }

  // ── 4. Realistic Shiva's Damaru (Dual Leather Membrane Pulse) ──
  public playDamaru() {
    const ctx = this.initCtx();
    const strike = (delaySec: number, pitch: number) => {
      const now = ctx.currentTime + delaySec;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Pitch glide mimicking squeezed leather drum body
      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, now);
      osc.frequency.exponentialRampToValueAtTime(pitch * 0.42, now + 0.14);

      gain.gain.setValueAtTime(0.85, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.24);

      this.activeOscillators.push(osc);
      this.activeGainNodes.push(gain);
    };

    // Realistic "Dhak-Dhak... Dhak-Dhak" sequence
    strike(0.0, 310);
    strike(0.18, 270);
    strike(0.42, 310);
    strike(0.60, 270);
  }

  // ── 5. Realistic Krishna Flute (Devotional Ascending Phrase) ──
  public playFlute() {
    const ctx = this.initCtx();
    const now = ctx.currentTime;

    // Ascending devotional swaras: Pa -> Sa -> Re -> Ga
    const notes = [
      { freq: 392.00, start: 0.0, dur: 0.45 }, // Pa (G4)
      { freq: 523.25, start: 0.4, dur: 0.50 }, // Sa (C5)
      { freq: 587.33, start: 0.85, dur: 0.55 },// Re (D5)
      { freq: 659.25, start: 1.35, dur: 1.10 },// Ga (E5 - sustained)
    ];

    notes.forEach(n => {
      const t = now + n.start;
      const osc = ctx.createOscillator();
      const vib = ctx.createOscillator();
      const vibGain = ctx.createGain();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(n.freq, t);

      // Breath vibrato (5.5 Hz)
      vib.frequency.setValueAtTime(5.5, t);
      vibGain.gain.setValueAtTime(n.freq * 0.022, t);
      vib.connect(vibGain);
      vibGain.connect(osc.frequency);

      // Gentle breath swell
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.5, t + 0.08);
      gain.gain.setValueAtTime(0.45, t + n.dur - 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + n.dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      vib.start(t);
      osc.start(t);
      vib.stop(t + n.dur + 0.05);
      osc.stop(t + n.dur + 0.05);

      this.activeOscillators.push(osc, vib);
      this.activeGainNodes.push(gain, vibGain);
    });
  }

  // ── 6. Realistic 528 Hz Crystal Singing Bowl (Binaural Acoustic Interference) ──
  public playSingingBowl() {
    const ctx = this.initCtx();
    const now = ctx.currentTime;

    // Dual frequency producing slow 2.2 Hz acoustic shimmer beating
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const overtone = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(528, now);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(530.2, now); // 2.2 Hz acoustic beat

    overtone.type = 'sine';
    overtone.frequency.setValueAtTime(528 * 2.765, now); // ~1460 Hz crystal shimmer

    const overtoneGain = ctx.createGain();
    overtoneGain.gain.setValueAtTime(0.18, now);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);
    overtone.connect(overtoneGain);
    overtoneGain.connect(gain);

    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    overtone.start(now);

    osc1.stop(now + 4.6);
    osc2.stop(now + 4.6);
    overtone.stop(now + 2.6);

    this.activeOscillators.push(osc1, osc2, overtone);
    this.activeGainNodes.push(gain, overtoneGain);
  }

  // ── 7. Realistic Golden Celestial Chime (Tubular Harmonic Bells) ──
  public playGoldenChime() {
    const ctx = this.initCtx();
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.5]; // C5, E5, G5, B5, C6

    notes.forEach((freq, idx) => {
      const t = now + idx * 0.16;
      const osc = ctx.createOscillator();
      const overtone = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      overtone.type = 'triangle';
      overtone.frequency.setValueAtTime(freq * 2.76, t);

      gain.gain.setValueAtTime(0.48, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);

      osc.connect(gain);
      overtone.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      overtone.start(t);
      osc.stop(t + 1.9);
      overtone.stop(t + 1.9);

      this.activeOscillators.push(osc, overtone);
      this.activeGainNodes.push(gain);
    });
  }

  // ── Play Single Ringtone Hit / Preview ──
  public playRingtoneOnce(ringtoneId: string, customAudioData?: string) {
    this.stop();
    if (ringtoneId === 'custom' && customAudioData) {
      try {
        const audio = new Audio(customAudioData);
        audio.volume = 0.85;
        audio.play().catch(() => {});
        this.customAudioEl = audio;
      } catch {
        this.playTempleBell();
      }
      return;
    }

    switch (ringtoneId) {
      case 'shankha':
        this.playShankha();
        break;
      case 'om':
        this.playOmDrone();
        break;
      case 'damaru':
        this.playDamaru();
        break;
      case 'flute':
        this.playFlute();
        break;
      case 'bowl':
        this.playSingingBowl();
        break;
      case 'chime':
        this.playGoldenChime();
        break;
      case 'bell':
      default:
        this.playTempleBell();
        break;
    }
  }

  /**
   * Starts a continuous alarm loop until dismissed or snoozed.
   */
  public startAlarmLoop(ringtoneId: string, customAudioData?: string) {
    this.stop();
    this.playRingtoneOnce(ringtoneId, customAudioData);
    if (ringtoneId === 'custom' && customAudioData) {
      if (this.customAudioEl) {
        this.customAudioEl.loop = true;
      }
      return;
    }
    const intervalMs = ringtoneId === 'om' ? 4400 : ringtoneId === 'flute' ? 3200 : ringtoneId === 'shankha' ? 3400 : 3300;
    this.loopInterval = window.setInterval(() => {
      this.playRingtoneOnce(ringtoneId);
    }, intervalMs);
  }
}

export const vedicAlarmAudio = new RealisticVedicAlarmEngine();
