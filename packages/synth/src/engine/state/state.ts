import { Midi } from '../../core/types';
import { Preset } from '../oscillator/types';

import { prelude } from './midi';
import { PresetName, presets } from './presets';

export type DAWState = Preset & {
  name: PresetName;
  midi: Midi;
  isPlaying: boolean;
  time: number;
  notes: number[];
};

export const getPreset = (
  name: PresetName = 'pluck'
): Preset & { name: PresetName } => ({
  ...presets[name],
  name
});

export const getDAWState = (name: PresetName = 'pluck'): DAWState => ({
  ...getPreset(name),
  midi: prelude,
  isPlaying: false,
  time: 0,
  notes: []
});
