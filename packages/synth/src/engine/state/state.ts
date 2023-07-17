import { Midi } from '../../core/types';
import { SynthConfig } from '../oscillator/types';

import { prelude } from './midi';
import { PresetName, presets } from './presets';

export type DAWState = SynthConfig & {
  name: PresetName;
  midi: Midi;
  isPlaying: boolean;
  time: number;
  notes: number[];
};

export const getDAWState = (name: PresetName = 'pluck'): DAWState => ({
  ...presets[name],
  name,
  midi: prelude,
  isPlaying: false,
  time: 0,
  notes: []
});
