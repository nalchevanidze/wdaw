import { Presets, Midi, MidiFragments } from '../common/types';
import { genMidiFragments } from './fragments';
import { genPresets, newPreset } from './presets';

type PlayerState = {
  isPlaying: boolean;
  time: number;
  notes: number[];
};

export type DAWState = TracksState & {
  currentFragment: string;
  midiFragments: MidiFragments;
  player: PlayerState;
  bpm: number;
  presets: Presets;
};

export type TrackState = {
  name: string;
  preset: string;
  midi: Midi[];
  gain: number;
};

export type TracksState = {
  currentTrack: number;
  tracks: TrackState[];
};

export const dawState = (): DAWState => {
  const presets = Object.fromEntries(genPresets().map(p => [p.name,p]));
  
  const tracks: TrackState[] = [
    {
      name: 'piano',
      preset: 'pluck',
      midi: [{ start: 256, end: 512, fragmentId: 'piano' }],
      gain: 0.4
    },
    {
      name: 'bass',
      preset: 'bass',
      gain: 0.3,
      midi: [{ start: 0, end: 512, fragmentId: 'bass' }]
    },
    {
      name: 'kick',
      preset: 'kick',
      midi: [{ start: 0, end: 512, fragmentId: 'kick' }],
      gain: 1
    },
    {
      name: 'clap',
      preset: 'clap',
      midi: [
        { start: 128, end: 256, fragmentId: 'clap' },
        { start: 384, end: 512, fragmentId: 'clap' }
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
