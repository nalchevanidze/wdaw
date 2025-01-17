import { EnvelopeConfig, WaveConfig } from '../../../core/types';
import { Sequence } from '../arp/arpeggiator';

export type FilterConfig = {
  cutoff: number;
  resonance: number;
  envelope: number;
  enabled: boolean;
};

export type Preset = {
  wave: WaveConfig;
  envelopes: Record<'filter' | 'gain', EnvelopeConfig>;
  filter: FilterConfig;
  sequence: Sequence;
};

export type WaveNode<S> = {
  next(s: S): number;
};
