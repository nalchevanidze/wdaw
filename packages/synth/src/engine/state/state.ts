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

export type DAWState = { player: PlayerState } & TracksState;

export type UIState = PlayerState & NamedPreset & { midi: Midi };

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

export const toUIState = ({
  player,
  currentTrack,
  tracks
}: DAWState): UIState => {
  const track = tracks[currentTrack];

  return {
    ...player,
    ...track.preset,
    midi: track.midi
  };
};

export const getDAWState = (): DAWState => ({
  player: { isPlaying: false, time: 0, notes: [] },
  currentTrack: 1,
  tracks: [
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
  ]
});
