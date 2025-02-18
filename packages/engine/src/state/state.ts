import { Presets, Midi, MidiFragments } from '../common/types';
import { genMidiFragments } from './fragments';
import { genPresets } from './presets';

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
  bpm: number;
};

export type EngineState = PlayerState & TracksState;

export const engineState = (): EngineState => {
  const presets = Object.fromEntries(genPresets().map((p) => [p.name, p]));

  const tracks: TrackState[] = [
    {
      name: 'piano',
      presetId: 'pluck',
      midi: [{ start: 512, end: 1024,  fragmentId: 'piano' }],
      gain: 0.4
    },
    {
      name: 'bass',
      presetId: 'bass',
      gain: 0.3,
      midi: [{ start: 256, end: 1024, fragmentId: 'bass' }]
    },
    {
      name: 'kick',
      presetId: 'kick',
      midi: [{ start: 0, end: 1024, fragmentId: 'kick' }],
      gain: 1
    },
    {
      name: 'clap',
      presetId: 'clap',
      midi: [
        { start: 128, end: 192, fragmentId: 'clap1' },
        { start: 192, end: 256, fragmentId: 'clap-fast' },
        { start: 384, end: 448, fragmentId: 'clap2' },
        { start: 448, end: 512, fragmentId: 'clap-fast' },
        { start: 768, end: 960, fragmentId: 'clap2' },
        { start: 960, end: 1024, fragmentId: 'clap-fast' },
      ],
      gain: 0.3
    }
  ];

  return {
    bpm: 120,
    midiFragments: genMidiFragments(),
    presets,
    isPlaying: false,
    time: 0,
    tracks
  };
};
