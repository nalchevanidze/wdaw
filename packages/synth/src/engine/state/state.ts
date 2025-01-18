import { Preset } from '../common/types';
import { Midi } from '../types';

import { prelude } from './midi';
import { PresetName, presets } from './presets';

type PlayerState = {
  isPlaying: boolean;
  time: number;
  notes: number[];
};

export type DAWState = PlayerState & Tracks;

type Tracks = {
  current: number;
  tracks: Track[];
};

type NamedPreset = Preset & { name: PresetName };

type Track = {
  preset: NamedPreset;
  midi: Midi;
};

export const getPreset = (name: PresetName = 'pluck'): NamedPreset => ({
  ...presets[name],
  name
});

export const getDAWState = (): DAWState => ({
  isPlaying: false,
  time: 0,
  notes: [],
  current: 0,
  tracks: [
    {
      preset: getPreset('pluck'),
      midi: prelude
    },
    {
      preset: getPreset('razor'),
      midi: prelude
    }
  ]
});
