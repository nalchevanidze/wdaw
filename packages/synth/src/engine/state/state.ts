import { Preset } from '../common/types';
import { Midi } from '../types';

import { bass, prelude, midiLoop } from './midi';
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
      name: 'piano',
      preset: getPreset('pluck'),
      midi: prelude,
      gain: 0.4
    },
    {
      name: 'bass',
      preset: getPreset('bass'),
      midi: bass,
      gain: 0.2
    },
    {
      name: 'kick',
      preset: getPreset('kick'),
      midi: midiLoop(() => [
        { at: 0, id: 'C#1', length: 4 },
        { at: 8, id: 'C#1', length: 4 },
        { at: 16, id: 'C#1', length: 4 },
        { at: 24, id: 'C#1', length: 4 }
      ]),
      gain: 1
    },
    {
      name: 'clap',
      preset: getPreset('clap'),
      midi: midiLoop(() => [
        { at: 8, id: 'C#1', length: 4 },
        { at: 24, id: 'C#1', length: 4 }
      ]),
      gain: 0.5
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
