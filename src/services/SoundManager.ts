class SoundManager {
    private audioContext: AudioContext | null = null;
    private volume: number = 0.5;

    constructor() {
        try {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        } catch (e) {
            console.error('Web Audio API not supported');
        }
    }

    private initContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    playTone(frequency: number, type: OscillatorType, duration: number, startTime = 0) {
        if (!this.audioContext) return;
        this.initContext();

        const osc = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, this.audioContext.currentTime + startTime);

        gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime + startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + startTime + duration);

        osc.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        osc.start(this.audioContext.currentTime + startTime);
        osc.stop(this.audioContext.currentTime + startTime + duration);
    }

    playComplete() {
        this.playTone(600, 'sine', 0.1);
        this.playTone(800, 'sine', 0.2, 0.1);
    }

    playBossDamage() {
        this.playTone(150, 'sawtooth', 0.2);
        this.playTone(100, 'sawtooth', 0.3, 0.1);
    }

    playBossDefeat() {
        this.playTone(400, 'square', 0.1);
        this.playTone(500, 'square', 0.1, 0.1);
        this.playTone(600, 'square', 0.1, 0.2);
        this.playTone(800, 'square', 0.4, 0.3);
    }

    playAchievement() {
        this.playTone(500, 'sine', 0.2);
        this.playTone(1000, 'sine', 0.4, 0.2);
    }

    playClick() {
        // Very short click
        this.playTone(800, 'triangle', 0.05);
    }
}

export const soundManager = new SoundManager();
