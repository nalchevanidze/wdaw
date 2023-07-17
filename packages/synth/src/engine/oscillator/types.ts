import { EnvelopeConfig, WaveConfig } from '../../core/types';
import { Sequence } from '../midi/types';

export type FilterConfig = {
  cutoff: number;
  resonance: number;
  envelope: number;
  enabled: boolean;
};

export type SynthConfig = {
  wave: WaveConfig;
  envelopes: Record<'filter' | 'gain', EnvelopeConfig>;
  filter: FilterConfig;
  sequence: Sequence;
};
