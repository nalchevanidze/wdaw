import { Preset } from '../common/types';
import { Midi } from '../types';

import { bass, prelude } from './midi';
import { PresetName, presets } from './presets';

type PlayerState = {
  isPlaying: boolean;
  time: number;
  notes: number[];
};

type NamedPreset = Preset & { name: PresetName };

export type DAWState = PlayerState & TracksState;

export type UIState = PlayerState & NamedPreset & { midi: Midi };

export type TrackState = {
  preset: NamedPreset;
  midi: Midi;
};

export type TracksState = {
  currentTrack: number;
  tracks: TrackState[];
};

export const getPreset = (name: PresetName = 'pluck'): NamedPreset => ({
  ...presets[name],
  name
});

export const toUIState = ({
  isPlaying,
  time,
  notes,
  currentTrack,
  tracks
}: DAWState): UIState => {
  const track = tracks[currentTrack];

  return {
    isPlaying,
    time,
    notes,
    ...track.preset,
    midi: track.midi
  };
};

export const getDAWState = (): DAWState => ({
  isPlaying: false,
  time: 0,
  notes: [],
  currentTrack: 1,
  tracks: [
    {
      preset: getPreset('pluck'),
      midi: prelude
    },
    {
      preset: getPreset('wind'),
      midi: bass
    }
  ]
});
