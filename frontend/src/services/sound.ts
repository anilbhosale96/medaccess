// Web Audio API Synthesizer for Hospital-grade Audio Feedback
class SoundEffects {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Hospital vital scanner beep
  public playBeep(freq: number = 880, type: OscillatorType = 'sine', duration: number = 0.12) {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // Positive verified match chime
  public playMatchSuccess() {
    this.playBeep(587.33, 'triangle', 0.1); // D5
    setTimeout(() => this.playBeep(880, 'triangle', 0.18), 110); // A5
  }

  // Emergency Alert Siren Chime
  public playEmergencyAlert() {
    this.playBeep(440, 'sawtooth', 0.15);
    setTimeout(() => this.playBeep(660, 'sawtooth', 0.2), 150);
  }
}

export const soundFx = new SoundEffects();
