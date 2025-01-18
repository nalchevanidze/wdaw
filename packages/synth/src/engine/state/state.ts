import { Preset } from '../common/types';
import { Midi } from '../types';

import { prelude } from './midi';
import { PresetName, presets } from './presets';

type PlayerState = {
  isPlaying: boolean;
  time: number;
  notes: number[];
};

type NamedPreset = Preset & { name: PresetName };

export type DAWState = PlayerState & Tracks;

export type UIState = PlayerState & NamedPreset & { midi: Midi };

type Track = {
  preset: NamedPreset;
  midi: Midi;
};

type Tracks = {
  currentTrack: number;
  tracks: Track[];
};

export const getPreset = (name: PresetName = 'pluck'): NamedPreset => ({
  ...presets[name],
  name
});

export const toUIState = ({ isPlaying, time, notes }: DAWState): UIState => ({
  isPlaying,
  time,
  notes
});

export const getDAWState = (): DAWState => ({
  isPlaying: false,
  time: 0,
  notes: [],
  currentTrack: 0,
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
