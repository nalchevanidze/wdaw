import { Envelope } from './envelope';
import { Oscillators } from './osc/osc';
import { MoogFilter } from './filter';
import { SynthConfig, WaveNode } from './types';

export class SoundEvent implements WaveNode<SynthConfig> {
  private gainEnvelope = new Envelope();
  private filterEnvelope = new Envelope();
  private oscillators = new Oscillators();
  private filter = new MoogFilter();


  public open = (config: SynthConfig, note: number): void => {
    this.oscillators.open(config.wave, note);
    this.gainEnvelope.open(config.envelopes.gain);
    this.filterEnvelope.open(config.envelopes.filter);
  };

  public next = (config: SynthConfig) =>
    this.gainEnvelope.next(config.envelopes.gain) *
    this.filter.next(
      config.filter,
      this.oscillators.next(config.wave),
      this.filterEnvelope.next(config.envelopes.filter) ** 4
    );

  public close = (config: SynthConfig) => {
    this.gainEnvelope.close(config.envelopes.gain);
    this.filterEnvelope.close(config.envelopes.filter);
  };

  public kill = () => {
    this.gainEnvelope.kill();
    this.filterEnvelope.kill();
  };

  public isLive = () => this.gainEnvelope.live;
}
