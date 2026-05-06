// frontend/src/pages/Games/CricketCards/services/soundService.ts

class SoundService {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    // Initialize on first user interaction
    document.addEventListener('click', () => this.init(), { once: true });
  }

  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  async playPackShake() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioContext) return;
    
    const ctx = this.audioContext;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    
    oscillator.type = 'sine';
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    
    oscillator.frequency.value = 120;
    gain.gain.value = 0.15;
    
    oscillator.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.4);
    oscillator.stop(ctx.currentTime + 0.4);
  }

  async playPackOpen() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioContext) return;
    
    const ctx = this.audioContext;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    
    oscillator.type = 'sawtooth';
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(150, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.5);
    
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.5);
  }

  async playCardFlip() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioContext) return;
    
    const ctx = this.audioContext;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    
    oscillator.type = 'triangle';
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    
    oscillator.frequency.value = 880;
    gain.gain.value = 0.08;
    
    oscillator.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.1);
    oscillator.stop(ctx.currentTime + 0.1);
  }

  async playRaritySound(rarity: string) {
    if (!this.enabled) return;
    this.init();
    if (!this.audioContext) return;
    
    switch(rarity) {
      case 'mythic':
        await this.playFanfare([261.63, 329.63, 392.00, 523.25, 659.25]);
        break;
      case 'legendary':
        await this.playFanfare([261.63, 329.63, 392.00, 523.25]);
        break;
      case 'epic':
        await this.playArpeggio([523.25, 659.25, 783.99]);
        break;
      case 'rare':
        await this.playArpeggio([440, 523.25]);
        break;
      default:
        await this.playPluck();
    }
  }

  private async playFanfare(notes: number[]) {
    if (!this.audioContext) return;
    const ctx = this.audioContext;
    
    for(let i = 0; i < notes.length; i++) {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = 'sine';
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      
      oscillator.frequency.value = notes[i];
      gain.gain.value = 0.12;
      
      const startTime = ctx.currentTime + i * 0.2;
      oscillator.start(startTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, startTime + 0.3);
      oscillator.stop(startTime + 0.3);
    }
  }

  private async playArpeggio(notes: number[]) {
    if (!this.audioContext) return;
    const ctx = this.audioContext;
    
    notes.forEach((note, i) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = 'sine';
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      
      oscillator.frequency.value = note;
      gain.gain.value = 0.1;
      
      const startTime = ctx.currentTime + i * 0.12;
      oscillator.start(startTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, startTime + 0.2);
      oscillator.stop(startTime + 0.2);
    });
  }

  private async playPluck() {
    if (!this.audioContext) return;
    const ctx = this.audioContext;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    
    oscillator.type = 'sine';
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    
    oscillator.frequency.value = 440;
    gain.gain.value = 0.08;
    
    oscillator.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.15);
    oscillator.stop(ctx.currentTime + 0.15);
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (enabled && this.audioContext) {
      this.audioContext.resume();
    }
  }

  getEnabled() {
    return this.enabled;
  }
}

export const soundService = new SoundService();