import { nList, noteToFrequency } from '../utils';
import { waveFunction } from './wave';
import { WaveNode } from '../types';
import { WaveConfig } from '../../../common/types';

const rescale = (value: number, deep: number): number => {
  deep = 2 / deep ** 2;
  return (value + deep) / deep;
};

export class OSC implements WaveNode<WaveConfig> {
  private phase = 0;
  private length = 0.1;
  private fmPhase = 0;
  private freq: number;

  constructor(private sampleRate: number) {}

  set(freq: number) {
    this.freq = freq;
    this.phase = Math.random();
    this.length = this.freq / this.sampleRate;
    this.fmPhase = Math.random();
  }

  next(wave: WaveConfig) {
    const { length } = this;
    const fmAmp = wave.fm;

    // generate new wavePosition
    this.phase = (this.phase + length) % 1;

    if (fmAmp === 0) {
      return waveFunction(this.phase, wave);
    }

    // new Fm Position
    const fmFreq = wave.fmFreq === 0 ? 1 / 16 : wave.fmFreq * 4;
    const fmLength = length * fmFreq;
    this.fmPhase = this.fmPhase + fmLength;

    return waveFunction(
      this.phase * rescale(Math.sin(this.fmPhase), fmAmp),
      wave
    );
  }
}

const MAX_OSCILLATORS = 12;
const MAX_OFFSET = 2;

export class Oscillators implements WaveNode<WaveConfig> {
  constructor(private sampleRate: number) {}

  private all = nList(MAX_OSCILLATORS, () => new OSC(this.sampleRate));
  private poly: OSC[] = [];

  open(wave: WaveConfig, note: number) {
    const poly = Math.min(MAX_OSCILLATORS - 1, Math.max(1, wave.voices));

    const range = Math.max(note + Math.floor(wave.octave) * 12, 0);
    const frequency = noteToFrequency(range);
    const middle = Math.floor((poly + 1) / 2);
    const offset = wave.offset * MAX_OFFSET;

    this.poly = this.all.slice(poly - 1);
    this.poly.forEach((o, i) => o.set(frequency + (i - middle) * offset));
  }

  next(wave: WaveConfig) {
    let value = 0;

    for (const osc of this.poly) {
      value += osc.next(wave);
    }

    return value / (this.poly.length + 1);
  }
}
