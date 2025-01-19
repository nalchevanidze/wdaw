import { Preset } from '../common/types';
import { Midi } from '../types';

import { bass, drum, prelude } from './midi';
import { PresetName, presets } from './presets';

type PlayerState = {
  isPlaying: boolean;
  time: number;
  notes: number[];
};

export type NamedPreset = Preset & { name: PresetName };

export type DAWState = { player: PlayerState; tracks: TracksState };

export type TrackState = {
  name: string;
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
      name: "piano",
      preset: getPreset('pluck'),
      midi: prelude,
      gain: 0.4
    },
    {
      name: "bass",
      preset: getPreset('razor'),
      midi: bass,
      gain: 0.1
    },
    {
      name: "drum",
      preset: getPreset('kick'),
      midi: drum,
      gain: 1
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
