import { Envelope } from './envelope';
import { Oscillators } from './osc/osc';
import { MoogFilter } from './filter';
import { SynthConfig } from './types';

export class SoundEvent {
  private gainEnvelope = new Envelope();
  private filterEnvelope = new Envelope();
  private state: SynthConfig;
  private oscillators = new Oscillators();
  private filter = new MoogFilter();

  constructor(state: SynthConfig) {
    this.setup(state);
  }

  public setup = (state: SynthConfig) => {
    this.state = state;
    this.filter.setup(state.filter);
    this.gainEnvelope.setup(state.envelopes.gain);
    this.filterEnvelope.setup(state.envelopes.filter);
    this.oscillators.setup(state.wave);
  };

  public open = (note: number): void => {
    this.oscillators.open(this.state.wave, note);
    this.gainEnvelope.open();
    this.filterEnvelope.open();
  };

  public next = () =>
    this.gainEnvelope.next() *
    this.filter.next(
      this.oscillators.next(this.state.wave),
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
