export class AudioManager {
  constructor() {
    this.ctx = null;
    this.started = false;
    this.sfxVolume = 0.02; // lower default starting volume
  }

  bindForAutoStart(element = document.body) {
    const start = () => this.ensureStarted();
    ['mousedown','keydown','touchstart'].forEach((evt) => {
      element.addEventListener(evt, start, { once: true });
    });
  }

  ensureStarted() {
    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch {}
    }
    if (this.ctx && this.ctx.state !== 'running') {
      this.ctx.resume?.();
    }
    this.started = true;
  }

  playShoot() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    osc.type = 'square';
    osc.frequency.setValueAtTime(660, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.08);
    gain.gain.setValueAtTime(Math.max(0.0001, this.sfxVolume), now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.11);
  }
}


