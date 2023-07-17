import { WaveConfig } from '../../core/types';
import { Sequence } from '../midi/types';

export type FilterConfig = {
  cutoff: number;
  resonance: number;
  envelope: number;
  enabled: boolean;
};

export type EnvelopeConfig = {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
};

export type SynthConfig = {
  wave: WaveConfig;
  envelopes: Record<'filter' | 'gain', EnvelopeConfig>;
  filter: FilterConfig;
  sequence: Sequence;
};
