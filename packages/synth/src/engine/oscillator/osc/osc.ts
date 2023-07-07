import { WaveConfig } from "../types";
import { SAMPLE_RATE } from "../utils";

const rescale = (value: number, deep: number): number => {
  deep = 2 / deep ** 2;
  return (value + deep) / deep;
};

type PhysicWave = {
  phase: number;
};


export class OSC {
  private phase: number;
  private length: number;
  private freq: number;
  private fm: PhysicWave;
  private config: { fm: number; fmFreq: number } = { fm: 0, fmFreq: 0 };

  constructor() {
    this.next = this.next.bind(this);
    this.phase = 0;
    this.length = 0.1;
    this.fm = {phase: 0};
  }

  setup = (config: WaveConfig) => {
    this.config = config;
  };

  set(freq: number) {
    this.freq = freq;
    this.phase = Math.random();
    this.length = this.freq / SAMPLE_RATE;
    this.fm.phase = Math.random();
  }

  next() {
    let { phase, length, fm } = this;
    const fmAmp = this.config.fm;
    const fmFreq = this.config.fmFreq === 0 ? 1 / 16 : this.config.fmFreq * 4;
    const fmLength = this.length * fmFreq;

    // generate new wavePosition
    phase += length;
    this.phase = phase % 1;
    // new Fm Position
    if (fmAmp === 0) {
      return phase;
    }
    fm.phase = fm.phase + fmLength;
    const FMWaveFormPosition = Math.sin(fm.phase);

    return this.phase * rescale(FMWaveFormPosition, fmAmp);
  }
}
