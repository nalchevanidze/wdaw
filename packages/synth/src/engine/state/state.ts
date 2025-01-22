import { Preset } from '../common/types';
import { Midi } from '../types';

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
  const tracks: TrackState[] = [
    {
      name: 'piano',
      preset: getPreset('pluck'),
      midi: {
        start: 32,
        end: 64,
        loop: [0, 16],
        notes: {
          '0': [
            { at: 0, id: 'F#2', length: 32 },
            { at: 0, id: 'A#1', length: 32 }
          ],
          '4': [
            { at: 0, id: 'F#2', length: 32 },
            { at: 0, id: 'A#1', length: 32 }
          ],
          '8': [
            { at: 0, id: 'D#2', length: 32 },
            { at: 0, id: 'C#1', length: 32 }
          ],
          '12': [
            { at: 0, id: 'D#2', length: 32 },
            { at: 0, id: 'F#1', length: 32 }
          ]
        }
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
        notes: {
          0: [{ at: 4, id: 'A#1', length: 4 }],
          1: [{ at: 4, id: 'A#1', length: 4 }],
          2: [{ at: 4, id: 'A#1', length: 4 }],
          4: [{ at: 4, id: 'A#1', length: 4 }],
          5: [{ at: 4, id: 'A#1', length: 4 }],
          6: [{ at: 4, id: 'A#1', length: 4 }],
          8: [{ at: 4, id: 'C#2', length: 4 }],
          9: [{ at: 4, id: 'C#2', length: 4 }],
          10: [{ at: 4, id: 'C#2', length: 4 }],
          11: [{ at: 4, id: 'G#1', length: 4 }],
          12: [{ at: 4, id: 'F#2', length: 4 }],
          13: [{ at: 4, id: 'F#2', length: 4 }],
          14: [{ at: 4, id: 'F#2', length: 4 }],
          15: [{ at: 4, id: 'D#2', length: 4 }]
        }
      }
    },
    {
      name: 'kick',
      preset: getPreset('kick'),
      midi: {
        loop: [0, 4],
        start: 0,
        end: 64,
        notes: {
          0: [
            { at: 0, id: 'C#1', length: 4 },
            { at: 8, id: 'C#1', length: 4 },
            { at: 16, id: 'C#1', length: 4 },
            { at: 24, id: 'C#1', length: 4 }
          ]
        }
      },
      gain: 1
    },
    {
      name: 'clap',
      preset: getPreset('clap'),
      midi: {
        loop: [4, 8],
        start: 0,
        end: 64,
        notes: {
          4: [
            { at: 12, id: 'C#1', length: 4 },
            { at: 24, id: 'C#1', length: 4 }
          ]
        }
      },
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
