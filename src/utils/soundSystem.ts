/**
 * Web Audio API based Sound and Music Engine
 * Zero external audio dependencies, 100% reliable, zero latency, compliant with modern browser autoplay policies.
 */

class SoundSystem {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.7; // 0 to 1
  private bgmOscillators: OscillatorNode[] = [];
  private bgmGainNode: GainNode | null = null;
  private isBgmPlaying: boolean = false;
  private currentTrack: number = 0; // 0: Informatika Santai, 1: Digital Quest, 2: Cyber Focus
  private bgmIntervalId: any = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.bgmGainNode) {
      this.bgmGainNode.gain.setValueAtTime(0, this.ctx?.currentTime || 0);
    } else if (!muted && this.bgmGainNode && this.isBgmPlaying) {
      this.bgmGainNode.gain.setValueAtTime(this.volume * 0.15, this.ctx?.currentTime || 0);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.bgmGainNode && !this.isMuted && this.isBgmPlaying) {
      this.bgmGainNode.gain.setValueAtTime(this.volume * 0.15, this.ctx?.currentTime || 0);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  // UI Sound Effects
  public playClick() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, this.ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.05); // A5

      gain.gain.setValueAtTime(this.volume * 0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch (e) {
      // Audio playback safety catch
    }
  }

  public playSuccess() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Uplifting arpeggio C5 -> E5 -> G5 -> C6
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(this.volume * 0.25, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.26);
      });
    } catch (e) {}
  }

  public playError() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Gentle double low note (220Hz -> 196Hz) - encouraging, not harsh
      [220, 196].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        gain.gain.setValueAtTime(0.001, now + idx * 0.1);
        gain.gain.linearRampToValueAtTime(this.volume * 0.15, now + idx * 0.1 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.15);

        // Low pass filter to make it gentle
        const filter = this.ctx!.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(500, now + idx * 0.1);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.16);
      });
    } catch (e) {}
  }

  public playFanfare() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C E G C E
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(this.volume * 0.25, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.42);
      });
    } catch (e) {}
  }

  public playTick() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      gain.gain.setValueAtTime(this.volume * 0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);
    } catch (e) {}
  }

  // Background Lo-Fi / Study Synth Player
  public toggleBgm(): boolean {
    if (this.isBgmPlaying) {
      this.stopBgm();
      return false;
    } else {
      this.startBgm();
      return true;
    }
  }

  public setTrack(trackIdx: number) {
    this.currentTrack = trackIdx % 3;
    if (this.isBgmPlaying) {
      this.stopBgm();
      this.startBgm();
    }
  }

  public getTrack(): number {
    return this.currentTrack;
  }

  public isMusicPlaying(): boolean {
    return this.isBgmPlaying;
  }

  public startBgm() {
    try {
      this.initContext();
      if (!this.ctx) return;
      if (this.isBgmPlaying) return;

      this.isBgmPlaying = true;
      this.bgmGainNode = this.ctx.createGain();
      const currentGain = this.isMuted ? 0 : this.volume * 0.12;
      this.bgmGainNode.gain.setValueAtTime(currentGain, this.ctx.currentTime);
      this.bgmGainNode.connect(this.ctx.destination);

      // Play looping chord sequences based on track
      let step = 0;
      const tempo = this.currentTrack === 1 ? 400 : 600; // ms per chord

      // Chords sets (frequencies in Hz)
      const tracksData = [
        // Track 0: Informatika Santai (Am7 -> Fmaj7 -> Cmaj7 -> G)
        [
          [220, 261.63, 329.63, 392],    // Am7
          [174.61, 220, 261.63, 329.63], // Fmaj7
          [261.63, 329.63, 392, 493.88], // Cmaj7
          [196, 246.94, 293.66, 392]     // G
        ],
        // Track 1: Digital Quest (Upbeat progressive)
        [
          [261.63, 329.63, 392, 523.25], // C
          [293.66, 349.23, 440, 587.33], // Dm
          [329.63, 392, 493.88, 659.25], // Em
          [349.23, 440, 523.25, 698.46]  // F
        ],
        // Track 2: Cyber Focus (Ambient deep pad)
        [
          [146.83, 220, 293.66, 440],    // Dm pad
          [164.81, 246.94, 329.63, 493.88], // Em pad
          [174.61, 261.63, 349.23, 523.25], // F pad
          [130.81, 196, 261.63, 392]     // C pad
        ]
      ];

      const currentChords = tracksData[this.currentTrack];

      const playChord = () => {
        if (!this.ctx || !this.isBgmPlaying || !this.bgmGainNode) return;
        const chord = currentChords[step % currentChords.length];
        const now = this.ctx.currentTime;

        chord.forEach((freq) => {
          const osc = this.ctx!.createOscillator();
          const noteGain = this.ctx!.createGain();
          const filter = this.ctx!.createBiquadFilter();

          osc.type = this.currentTrack === 2 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, now);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(650, now);

          noteGain.gain.setValueAtTime(0.001, now);
          noteGain.gain.linearRampToValueAtTime(0.2, now + 0.1);
          noteGain.gain.exponentialRampToValueAtTime(0.001, now + (tempo / 1000) * 1.5);

          osc.connect(filter);
          filter.connect(noteGain);
          noteGain.connect(this.bgmGainNode!);

          osc.start(now);
          osc.stop(now + (tempo / 1000) * 1.6);
        });

        step++;
      };

      playChord();
      this.bgmIntervalId = setInterval(playChord, tempo);
    } catch (e) {
      this.isBgmPlaying = false;
    }
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmIntervalId) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
    if (this.bgmGainNode && this.ctx) {
      try {
        this.bgmGainNode.gain.setValueAtTime(0, this.ctx.currentTime);
      } catch (e) {}
    }
  }
}

export const soundManager = new SoundSystem();
