// Cute romantic Web Audio synthesizer for background chime & celebration sounds

class WeddingAudioController {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timerId: number | null = null;
  private currentNoteIndex = 0;

  // Romantic gentle melody (frequencies in Hz: C5, E5, G5, B4, A4, C5, F5, etc.)
  private notes = [
    523.25, 659.25, 783.99, 987.77,
    880.00, 783.99, 659.25, 587.33,
    523.25, 587.33, 659.25, 783.99,
    880.00, 987.77, 1046.50, 783.99,
    659.25, 698.46, 783.99, 880.00,
    783.99, 659.25, 587.33, 523.25
  ];

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public toggleMusic(onStateChange?: (playing: boolean) => void) {
    if (this.isPlaying) {
      this.stop();
      onStateChange?.(false);
    } else {
      this.start();
      onStateChange?.(true);
    }
  }

  public start() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    const playNext = () => {
      if (!this.isPlaying) return;
      const freq = this.notes[this.currentNoteIndex];
      this.playPluck(freq, 0.45);
      this.currentNoteIndex = (this.currentNoteIndex + 1) % this.notes.length;
      this.timerId = window.setTimeout(playNext, 600);
    };
    playNext();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public playPluck(freq: number, duration = 0.5) {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy handled silently
    }
  }

  public playChime() {
    try {
      const ctx = this.getContext();
      const chord = [523.25, 659.25, 783.99, 1046.50];
      chord.forEach((freq, idx) => {
        window.setTimeout(() => {
          this.playPluck(freq, 0.9);
        }, idx * 100);
      });
    } catch {
      // ignore
    }
  }

  public playScratchSound() {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200 + Math.random() * 300, ctx.currentTime);
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // ignore
    }
  }
}

export const weddingAudio = new WeddingAudioController();
