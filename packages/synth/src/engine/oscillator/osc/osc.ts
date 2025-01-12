import { WaveConfig } from '../../../core/types';
import { SAMPLE_RATE, nList, noteToFrequency } from '../utils';
import { waveFunction } from './wave';
import { WaveNode } from '../types';

const rescale = (value: number, deep: number): number => {
  deep = 2 / deep ** 2;
  return (value + deep) / deep;
};

type PhysicWave = {
  phase: number;
};

export class OSC implements WaveNode<WaveConfig> {
  private phase: number;
  private length: number;

  private freq: number;
  private fm: PhysicWave;

  constructor() {
    this.phase = 0;
    this.length = 0.1;
    this.fm = { phase: 0 };
  }

  set(freq: number) {
    this.freq = freq;
    this.phase = Math.random();
    this.length = this.freq / SAMPLE_RATE;
    this.fm.phase = Math.random();
  }

  next(wave: WaveConfig) {
    const { length, fm } = this;
    let { phase } = this;
    const fmAmp = wave.fm;
    const fmFreq = wave.fmFreq === 0 ? 1 / 16 : wave.fmFreq * 4;
    const fmLength = this.length * fmFreq;

    // generate new wavePosition
    phase += length;
    this.phase = phase % 1;
    // new Fm Position
    if (fmAmp === 0) {
      return waveFunction(phase, wave);
    }

    fm.phase = fm.phase + fmLength;

    return waveFunction(this.phase * rescale(Math.sin(fm.phase), fmAmp), wave);
  }
}

const MAX_OSCILLATORS = 12;
const MAX_OFFSET = 2;

export class Oscillators implements WaveNode<WaveConfig> {
  private all = nList(MAX_OSCILLATORS, () => new OSC());
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
