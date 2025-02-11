import { Presets, Midi, MidiFragments } from '../common/types';
import { genMidiFragments } from './fragments';
import { genPresets, newPreset } from './presets';

export type TrackState = {
  name: string;
  gain: number;
  presetId: string;
  midi: Midi[];
};

export type TracksState = {
  tracks: TrackState[];
  midiFragments: MidiFragments;
  presets: Presets;
};

type PlayerState = {
  isPlaying: boolean;
  time: number;
  notes: number[];
};

export type DAWState = PlayerState &
  TracksState & {
    currentTrack: number;
    currentFragment: string;
    bpm: number;
  };

export const dawState = (): DAWState => {
  const presets = Object.fromEntries(genPresets().map((p) => [p.name, p]));

  const tracks: TrackState[] = [
    {
      name: 'piano',
      presetId: 'pluck',
      midi: [{ start: 256, end: 512, fragmentId: 'piano' }],
      gain: 0.4
    },
    {
      name: 'bass',
      presetId: 'bass',
      gain: 0.3,
      midi: [{ start: 0, end: 512, fragmentId: 'bass' }]
    },
    {
      name: 'kick',
      presetId: 'kick',
      midi: [{ start: 0, end: 512, fragmentId: 'kick' }],
      gain: 1
    },
    {
      name: 'clap',
      presetId: 'clap',
      midi: [
        { start: 128, end: 192, fragmentId: 'clap1' },
        { start: 192, end: 256, fragmentId: 'clap-fast' },
        { start: 384, end: 512, fragmentId: 'clap2' }
      ],
      gain: 0.3
    }
  ];

  return {
    currentFragment: 'bass',
    currentTrack: 0,
    bpm: 120,
    midiFragments: genMidiFragments(),
    presets,

    isPlaying: false,
    time: 0,
    notes: [],

    tracks
  };
};
