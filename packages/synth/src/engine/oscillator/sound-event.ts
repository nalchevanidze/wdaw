import { Envelope } from './envelope';
import { renderOSCs } from './osc/wave';
import { OSC } from './osc/osc';
import { MoogFilter } from './filter';
import { nList, noteToFrequency } from './utils';
import { SynthConfig } from './types';

const MAX_OSC = 12;
const MAX_OFFSET = 2;

export class SoundEvent {
  private poly = 0;
  private gainEnvelope = new Envelope();
  private filterEnvelope = new Envelope();
  private state: SynthConfig;
  private oscillators = nList(MAX_OSC, () => new OSC());
  private filter = new MoogFilter();

  constructor(state: SynthConfig) {
    this.setup(state);
  }

  public setup = (state: SynthConfig) => {
    this.state = state;
    this.filter.setup(state.filter);
    this.gainEnvelope.setup(state.envelopes.gain);
    this.filterEnvelope.setup(state.envelopes.filter);
    this.oscillators.forEach((osc) => osc.setup(state.wave));
  };

  public open = (note: number): void => {
    const { wave } = this.state;
    const range = Math.max(note + Math.floor(wave.octave) * 12, 0);
    const frequency = noteToFrequency(range);
    this.poly = Math.min(MAX_OSC - 1, Math.max(1, wave.voices));
    const middle = Math.floor((this.poly + 1) / 2);
    for (let i = 0; i <= this.poly; i++) {
      this.oscillators[i].set(
        frequency + (i - middle) * wave.offset * MAX_OFFSET
      );
    }
    this.gainEnvelope.open();
    this.filterEnvelope.open();
  };

  public next = () =>
    this.gainEnvelope.next() *
    this.filter.next(
      renderOSCs(this.state.wave, this.oscillators, this.poly),
      this.filterEnvelope.next() ** 4
    );

  public close = () => {
    this.gainEnvelope.close();
    this.filterEnvelope.close();
  };

  public kill = () => {
    this.gainEnvelope.kill();
    this.filterEnvelope.kill();
  };

  public isLive = () => this.gainEnvelope.live;
}
