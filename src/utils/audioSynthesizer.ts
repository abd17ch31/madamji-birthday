/**
 * Gentle Music-Box Web Audio Synthesizer for "Happy Birthday to You"
 * Plays a warm, soft chime-like acoustic melody if an external audio file is not found.
 */

class BirthdayMelodyPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private currentTimeout: any = null;
  private listeners: ((playing: boolean) => void)[] = [];
  private audioElement: HTMLAudioElement | null = null;
  private useLocalAudio = false;

  constructor() {
    // Try to attach a local audio element if hosted
    if (typeof window !== 'undefined') {
      const audio = new Audio('/audio/happy-birthday.mp3');
      audio.preload = 'none';
      audio.onended = () => this.setPlaying(false);
      audio.onerror = () => {
        // Fallback to synthesizer
        this.useLocalAudio = false;
      };
      this.audioElement = audio;
    }
  }

  public subscribe(callback: (playing: boolean) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private setPlaying(state: boolean) {
    this.isPlaying = state;
    this.listeners.forEach(cb => cb(state));
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private initAudioContext() {
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

  private playTone(freq: number, startTime: number, duration: number) {
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Soft chime harmonics (sine + slight triangle warmth)
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    // Warm bell envelope
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.18, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  public async toggle(): Promise<boolean> {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      await this.play();
      return true;
    }
  }

  public async play(): Promise<void> {
    if (this.isPlaying) return;

    this.initAudioContext();

    // Attempt local MP3 first if valid
    if (this.audioElement && this.useLocalAudio) {
      try {
        await this.audioElement.play();
        this.setPlaying(true);
        return;
      } catch {
        this.useLocalAudio = false;
      }
    }

    // Play synthesized melody
    if (!this.ctx) return;
    this.setPlaying(true);

    // Notes for "Happy Birthday to You" (Key of C / F)
    // C4=261.63, D4=293.66, E4=329.63, F4=349.23, G4=392.00, A4=440.00, B4=493.88, C5=523.25, D5=587.33
    const notes: [number, number][] = [
      // Happy birthday to you
      [261.63, 0.4], [261.63, 0.4], [293.66, 0.8], [261.63, 0.8], [349.23, 0.8], [329.63, 1.4],
      // Happy birthday to you
      [261.63, 0.4], [261.63, 0.4], [293.66, 0.8], [261.63, 0.8], [392.00, 0.8], [349.23, 1.4],
      // Happy birthday dear Jyoti
      [261.63, 0.4], [261.63, 0.4], [523.25, 0.8], [440.00, 0.8], [349.23, 0.8], [329.63, 0.8], [293.66, 1.2],
      // Happy birthday to you
      [466.16, 0.4], [466.16, 0.4], [440.00, 0.8], [349.23, 0.8], [392.00, 0.8], [349.23, 1.6]
    ];

    let now = this.ctx.currentTime + 0.1;
    let totalTimeMs = 0;

    for (const [freq, dur] of notes) {
      this.playTone(freq, now, dur * 1.1);
      now += dur * 0.7;
      totalTimeMs += dur * 0.7 * 1000;
    }

    this.currentTimeout = setTimeout(() => {
      this.setPlaying(false);
    }, totalTimeMs + 500);
  }

  public stop(): void {
    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
      } catch {
        // safe
      }
    }
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
    this.setPlaying(false);
  }
}

export const birthdayMusic = new BirthdayMelodyPlayer();
