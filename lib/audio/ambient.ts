/**
 * 聖域の環境音 (Ambient BGM) を生成・管理する
 * Web Audio API を使用して、合成音（Space Hum）やホワイトノイズ（Rain）をリアルタイム生成する
 */
export class AmbientManager {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private noiseNode: AudioBufferSourceNode | null = null;

  init() {
    if (this.context || typeof window === "undefined") return;
    this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.context.createGain();
    this.masterGain.gain.setValueAtTime(0, this.context.currentTime);
    this.masterGain.connect(this.context.destination);
  }

  setVolume(val: number) {
    if (!this.masterGain || !this.context) return;
    this.masterGain.gain.linearRampToValueAtTime(val, this.context.currentTime + 1);
  }

  playSpaceHum() {
    this.stopAll();
    if (!this.context || !this.masterGain) return;

    const freqs = [55, 110, 165]; // 低周波の重なり
    freqs.forEach(f => {
      const osc = this.context!.createOscillator();
      const g = this.context!.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, this.context!.currentTime);
      g.gain.setValueAtTime(0.05, this.context!.currentTime);
      osc.connect(g);
      g.connect(this.masterGain!);
      osc.start();
      this.oscillators.push(osc);
    });
  }

  playRain() {
    this.stopAll();
    if (!this.context || !this.masterGain) return;

    const bufferSize = 2 * this.context.sampleRate;
    const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1; // ホワイトノイズ
    }

    const noise = this.context.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(400, this.context.currentTime);

    noise.connect(filter);
    filter.connect(this.masterGain!);
    noise.start();
    this.noiseNode = noise;
  }

  stopAll() {
    this.oscillators.forEach(o => o.stop());
    this.oscillators = [];
    if (this.noiseNode) {
      this.noiseNode.stop();
      this.noiseNode = null;
    }
  }
}

export const ambientManager = new AmbientManager();
