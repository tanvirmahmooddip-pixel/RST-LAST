/**
 * Web Audio API Sound Synthesizer for POS, Scans, and Emergency Siren Alerts
 */
class SoundEngineClass {
  private ctx: AudioContext | null = null;
  public enabled = true;
  public volume = 0.5;
  private sirenInterval: any = null;
  public isSirenActive = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq: number, duration: number, type: OscillatorType = 'sine', volumeScale = 0.08) {
    if (!this.enabled || this.volume <= 0) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      const effectiveVol = volumeScale * this.volume;
      gain.gain.setValueAtTime(effectiveVol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // AudioContext policy suppression fallback
    }
  }

  click() {
    this.playTone(600, 0.04, 'sine', 0.05);
  }

  beep() {
    this.playTone(950, 0.08, 'sine', 0.09);
  }

  scan() {
    this.playTone(1200, 0.06, 'triangle', 0.12);
    setTimeout(() => this.playTone(1600, 0.08, 'triangle', 0.12), 70);
  }

  cash() {
    this.playTone(987.77, 0.08, 'sine', 0.14); // B5
    setTimeout(() => this.playTone(1318.51, 0.18, 'sine', 0.16), 70); // E6
    setTimeout(() => this.playTone(1567.98, 0.22, 'sine', 0.14), 160); // G6
  }

  success() {
    this.playTone(880, 0.12, 'sine', 0.1);
    setTimeout(() => this.playTone(1320, 0.18, 'sine', 0.1), 90);
  }

  warning() {
    this.playTone(450, 0.15, 'square', 0.08);
  }

  error() {
    this.playTone(220, 0.25, 'sawtooth', 0.12);
  }

  notify() {
    this.playTone(660, 0.12, 'sine', 0.08);
    setTimeout(() => this.playTone(990, 0.16, 'sine', 0.08), 100);
  }

  // 6-Beep Emergency Siren Alert Pattern
  playEmergencySiren(repeat = true) {
    if (!this.enabled) return;
    this.stopEmergencySiren();
    this.isSirenActive = true;

    const playSequence = () => {
      const freqs = [800, 1100, 800, 1100, 800, 1200];
      freqs.forEach((f, idx) => {
        setTimeout(() => {
          if (this.isSirenActive) {
            this.playTone(f, 0.15, 'sawtooth', 0.18);
          }
        }, idx * 180);
      });
    };

    playSequence();
    if (repeat) {
      this.sirenInterval = setInterval(() => {
        if (this.isSirenActive) {
          playSequence();
        } else {
          this.stopEmergencySiren();
        }
      }, 1500);
    }
  }

  stopEmergencySiren() {
    this.isSirenActive = false;
    if (this.sirenInterval) {
      clearInterval(this.sirenInterval);
      this.sirenInterval = null;
    }
  }
}

export const SoundEngine = new SoundEngineClass();
