import { Envelope } from './envelope';
import { Oscillators } from './osc/osc';
import { MoogFilter } from './filter';
import { WaveNode } from './types';
import { Preset } from '../../common/types';

export class SoundEvent implements WaveNode<Preset> {
  private gainEnvelope = new Envelope();
  private filterEnvelope = new Envelope();
  private oscillators = new Oscillators();
  private filter = new MoogFilter();

  public open = (config: Preset, note: number): void => {
    this.oscillators.open(config.wave, note);
    this.gainEnvelope.open(config.envelopes.gain);
    this.filterEnvelope.open(config.envelopes.filter);
  };

  public next = ({ filter, wave, envelopes }: Preset) =>
    this.gainEnvelope.next(envelopes.gain) *
    this.filter.next(
      filter,
      this.oscillators.next(wave),
      this.filterEnvelope.next(envelopes.filter) ** 4
    );

  public close = (config: Preset) => {
    this.gainEnvelope.close(config.envelopes.gain);
    this.filterEnvelope.close(config.envelopes.filter);
  };

  public kill = () => {
    this.gainEnvelope.kill();
    this.filterEnvelope.kill();
  };

  public isLive = () => this.gainEnvelope.live;
}
