import { Presets, Midi, MidiFragments } from '../common/types';
import { genMidiFragments } from './fragments';
import { genPresets, newPreset } from './presets';

type PlayerState = {
  isPlaying: boolean;
  time: number;
  notes: number[];
};

export type TracksState = {
  currentTrack: number;
  tracks: TrackState[];
  midiFragments: MidiFragments;
};

export type DAWState = TracksState & {
  currentFragment: string;
  player: PlayerState;
  bpm: number;
  presets: Presets;
};

export type TrackState = {
  name: string;
  gain: number;
  presetId: string;
  midi: Midi[];
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
        { start: 128, end: 256, fragmentId: 'clap1' },
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
    player: {
      isPlaying: false,
      time: 0,
      notes: []
    },
    tracks
  };
};
