import { Preset, Midi, MidiFragments } from '../common/types';
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
  presets: Preset[];
};

export type TrackState = {
  name: string;
  preset: Preset;
  midi: Midi[];
  gain: number;
};

export type TracksState = {
  currentTrack: number;
  tracks: TrackState[];
};

export const dawState = (): DAWState => {
  const presets = genPresets();

  const getPreset = (name: string) =>
    presets.find((p) => p.name === name) ?? newPreset(name);

  const tracks: TrackState[] = [
    {
      name: 'piano',
      preset: getPreset('pluck'),
      midi: [{ start: 256, end: 512, fragmentId: 'piano' }],
      gain: 0.4
    },
    {
      name: 'bass',
      preset: getPreset('bass'),
      gain: 0.3,
      midi: [{ start: 0, end: 512, fragmentId: 'bass' }]
    },
    {
      name: 'kick',
      preset: getPreset('kick'),
      midi: [{ start: 0, end: 512, fragmentId: 'kick' }],
      gain: 1
    },
    {
      name: 'clap',
      preset: getPreset('clap'),
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
