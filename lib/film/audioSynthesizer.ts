// Ambient Zen Soundscape Synthesizer for Immersive Garden
class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private masterGain: GainNode | null = null;
  private intervalId: number | null = null;

  public init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  public toggle(): boolean {
    this.init();
    if (!this.ctx || !this.masterGain) return false;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isPlaying) {
      this.stop();
      this.isPlaying = false;
    } else {
      this.start();
      this.isPlaying = true;
    }
    return this.isPlaying;
  }

  private start() {
    if (!this.ctx || !this.masterGain) return;

    // Harmonic pentatonic frequencies for high-end zen meditative atmosphere
    const frequencies = [220, 261.63, 293.66, 329.63, 392.0, 440, 523.25];

    const playHarmonic = () => {
      if (!this.ctx || !this.masterGain || !this.isPlaying) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const freq = frequencies[Math.floor(Math.random() * frequencies.length)];
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      const duration = 4.5 + Math.random() * 3.5;

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.03, now + 1.8);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration);
    };

    playHarmonic();
    this.intervalId = window.setInterval(() => {
      playHarmonic();
      if (Math.random() > 0.4) {
        setTimeout(playHarmonic, 800);
      }
    }, 3800);
  }

  private stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public playHoverChime() {
    if (!this.ctx || !this.masterGain || !this.isPlaying) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.12);

      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // safe fallback
    }
  }

  public getStatus() {
    return this.isPlaying;
  }
}

export const soundscape = new SoundscapeEngine();
