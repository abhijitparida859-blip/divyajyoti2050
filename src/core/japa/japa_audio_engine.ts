import { Mantra, MantraAudio } from './mantra_types';

/**
 * ============================================================================
 *  JAPA AUDIO ENGINE — 108× precise auto-repeat that drives the mala counter
 * ============================================================================
 *  Uses the Web Audio API (HTMLAudioElement) with segment-looping:
 *   - Plays the mantra from `start` to `end` (one full recitation cycle).
 *   - When currentTime reaches `end`, it jumps back to `start` and fires a
 *     tick (→ mala counter +1). Repeats until the target is reached.
 *
 *  Pure, framework-agnostic. The React component wraps this.
 * ============================================================================
 */

export interface JapaEngineCallbacks {
  /** Called once per completed recitation cycle (→ increment mala). */
  onCycle: (count: number) => void;
  /** Called when the target repetition count is reached. */
  onComplete: () => void;
  /** Called when playback stops for any reason. */
  onStop?: () => void;
}

export class JapaAudioEngine {
  private audio: HTMLAudioElement | null = null;
  private seg: MantraAudio | null = null;
  private cb: JapaEngineCallbacks;
  private target = 108;
  private count = 0;
  private playing = false;

  constructor(cb: JapaEngineCallbacks) {
    this.cb = cb;
  }

  /** Is an audio file attached to this mantra? (else manual/TTS mode) */
  static hasAudio(mantra: Mantra): boolean {
    return !!mantra.audio?.url;
  }

  /**
   * Load + start looping the mantra audio.
   * Returns false if the mantra has no audio (caller should use manual mode).
   */
  async start(
    mantra: Mantra,
    startCount = 0,
    customAudio?: MantraAudio,
    targetOverride?: number
  ): Promise<boolean> {
    const seg = customAudio?.url ? customAudio : mantra.audio;
    if (!seg?.url) return false;

    this.stop(true);
    this.seg = seg;
    this.count = startCount;
    this.target = targetOverride ?? (mantra.recommendedCount >= 108 ? Math.max(mantra.recommendedCount, 108) : 108);

    const audio = new Audio(seg.url);
    audio.preload = 'auto';
    this.audio = audio;

    // Jump to the start of the first cycle
    const begin = () => {
      if (seg.start != null) {
        try { audio.currentTime = seg.start; } catch (_) { /* metadata not ready */ }
      }
      if (seg.end == null || seg.end <= 0) {
        if (!Number.isNaN(audio.duration) && audio.duration > 0) {
          seg.end = audio.duration;
        }
      }
    };
    if (audio.readyState >= 1) begin();
    else audio.addEventListener('loadedmetadata', begin, { once: true });

    audio.addEventListener('timeupdate', this.handleTimeUpdate);
    audio.addEventListener('ended', this.handleEnded);

    try {
      await audio.play();
      this.playing = true;
      return true;
    } catch (err) {
      console.warn('Japa audio play() failed:', err);
      this.playing = false;
      return false;
    }
  }

  private handleTimeUpdate = () => {
    const audio = this.audio;
    const seg = this.seg;
    if (!audio || !seg || !this.playing) return;
    const end = (seg.end != null && seg.end > 0) ? seg.end : audio.duration;
    if (end != null && !Number.isNaN(end) && audio.currentTime >= end) {
      // loop one cycle
      try { audio.currentTime = seg.start ?? 0; } catch (_) { /* ignore */ }
      this.count += 1;
      this.cb.onCycle(this.count);
      if (this.count >= this.target) {
        this.stop();
        this.cb.onComplete();
      }
    }
  };

  private handleEnded = () => {
    const audio = this.audio;
    const seg = this.seg;
    if (!audio || !seg || !this.playing) return;
    try {
      audio.currentTime = seg.start ?? 0;
      audio.play().catch(() => {});
    } catch (_) { /* ignore */ }
    this.count += 1;
    this.cb.onCycle(this.count);
    if (this.count >= this.target) {
      this.stop();
      this.cb.onComplete();
    }
  };

  /** Pause playback (keeps position). */
  pause() {
    this.playing = false;
    this.audio?.pause();
  }

  /** Resume playback. */
  resume() {
    if (this.audio) {
      this.audio.play().then(() => { this.playing = true; }).catch(() => { /* ignore */ });
    }
  }

  /** Set playback speed (0.5× – 2×). */
  setSpeed(rate: number) {
    if (this.audio) this.audio.playbackRate = Math.max(0.5, Math.min(2, rate));
  }

  get isPlaying(): boolean {
    return this.playing;
  }

  get currentCount(): number {
    return this.count;
  }

  /** Stop + cleanup (silent=true keeps from firing onStop). */
  stop(silent = false) {
    this.playing = false;
    if (this.audio) {
      this.audio.removeEventListener('timeupdate', this.handleTimeUpdate);
      this.audio.removeEventListener('ended', this.handleEnded);
      try { this.audio.pause(); } catch (_) { /* ignore */ }
      this.audio.src = '';
      this.audio = null;
    }
    if (!silent) this.cb.onStop?.();
  }
}
