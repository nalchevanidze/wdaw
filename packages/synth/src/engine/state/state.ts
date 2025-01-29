import { Preset } from '../common/types';
import { Midi } from '../types';

import { PresetName, presets } from './presets';

type PlayerState = {
  isPlaying: boolean;
  time: number;
  notes: number[];
};

export type NamedPreset = Preset & { name: PresetName };

export type DAWState = {
  player: PlayerState;
  tracks: TracksState;
  bpm: number;
};

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
  const tracks: TrackState[] = [
    {
      name: 'piano',
      preset: getPreset('pluck'),
      midi: {
        start: 32,
        end: 64,
        loop: [0, 32],
        notes: [
          { length: 32, id: 'F#2', at: 0 },
          { length: 32, id: 'A#1', at: 0 },
          { length: 32, id: 'F#2', at: 32 },
          { length: 32, id: 'A#1', at: 32 },
          { length: 32, id: 'D#2', at: 64 },
          { length: 32, id: 'C#1', at: 64 },
          { length: 32, id: 'D#2', at: 96 },
          { length: 32, id: 'F#1', at: 96 },
          { length: 32, id: 'F#3', at: 128 },
          { length: 32, id: 'A#2', at: 128 },
          { length: 32, id: 'F#3', at: 160 },
          { length: 32, id: 'A#2', at: 160 },
          { length: 32, id: 'D#3', at: 192 },
          { length: 32, id: 'C#2', at: 192 },
          { length: 32, id: 'D#3', at: 224 },
          { length: 32, id: 'F#2', at: 224 }
        ]
      },
      gain: 0.4
    },
    {
      name: 'bass',
      preset: getPreset('bass'),
      gain: 0.3,
      midi: {
        start: 0,
        end: 64,
        loop: [0, 16],
        notes: [
          { length: 4, id: 'A#1', at: 4 },
          { length: 4, id: 'A#1', at: 12 },
          { length: 4, id: 'A#1', at: 20 },
          { length: 4, id: 'A#1', at: 36 },
          { length: 4, id: 'A#1', at: 44 },
          { length: 4, id: 'A#1', at: 52 },
          { length: 4, id: 'C#2', at: 68 },
          { length: 4, id: 'C#2', at: 76 },
          { length: 4, id: 'C#2', at: 84 },
          { length: 4, id: 'G#1', at: 92 },
          { length: 4, id: 'F#2', at: 100 },
          { length: 4, id: 'F#2', at: 108 },
          { length: 4, id: 'F#2', at: 116 },
          { length: 4, id: 'D#2', at: 124 }
        ]
      }
    },
    {
      name: 'kick',
      preset: getPreset('kick'),
      midi: {
        loop: [0, 4],
        start: 0,
        end: 64,
        notes: [
          { length: 4, id: 'C#1', at: 0 },
          { length: 4, id: 'C#1', at: 8 },
          { length: 4, id: 'C#1', at: 16 },
          { length: 4, id: 'C#1', at: 24 }
        ]
      },
      gain: 1
    },
    {
      name: 'clap',
      preset: getPreset('clap'),
      midi: {
        loop: [4, 8],
        start: 16,
        end: 64,
        notes: [
          { length: 4, id: 'C#1', at: 44 },
          { length: 4, id: 'C#1', at: 56 }
        ]
      },
      gain: 0.3
    }
  ];

  return {
    player: {
      isPlaying: false,
      time: 0,
      notes: []
    },
    bpm: 120,
    tracks: {
      currentTrack: 0,
      tracks
    }
  };
};
