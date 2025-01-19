import { Preset } from '../common/types';
import { Midi } from '../types';

import { bass, prelude } from './midi';
import { PresetName, presets } from './presets';

type PlayerState = {
  isPlaying: boolean;
  time: number;
  notes: number[];
};

export type NamedPreset = Preset & { name: PresetName };

export type DAWState = { player: PlayerState; tracks: TracksState };

export type TrackState = {
  preset: NamedPreset;
  midi: Midi;
  gain: number;
};

export type TracksState = {
  currentTrack: number;
  tracks: TrackState[];
};

export const getPreset = (name: PresetName = 'pluck'): NamedPreset => ({
  ...presets[name],
  name
});

export const dawState = (): DAWState => {
  const tracks = [
    {
      preset: getPreset('pluck'),
      midi: prelude,
      gain: 1
    },
    {
      preset: getPreset('razor'),
      midi: bass,
      gain: 0.2
    }
  ];

  return {
    player: { isPlaying: false, time: 0, notes: [] },
    tracks: {
      currentTrack: 0,
      tracks
    }
  };
};
