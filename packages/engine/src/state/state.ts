import { Presets, Midi, MidiFragments } from '../common/types';
import { makeId } from '../utils/id';
import { genMidiFragments } from './fragments';
import { genPresets } from './presets';

export type TrackState = {
  name: string;
  gain: number;
  presetId: string;
};

export type MidiRef = {
  id: string;
  start: number;
  end: number;
  fragmentId: string;
  trackIndex: number;
};

export type TracksState = {
  tracks: TrackState[];
  midiFragments: MidiFragments;
  presets: Presets;
  midiRefs: MidiRef[];
};

type PlayerState = {
  isPlaying: boolean;
  time: number;
  bpm: number;
};

export type EngineState = PlayerState & TracksState;

export const engineState = (): EngineState => {
  const presets = Object.fromEntries(genPresets().map((p) => [p.name, p]));

  const midiRefs: MidiRef[] = [
    { id: makeId(), trackIndex: 0, start: 512, end: 1024, fragmentId: 'piano' },
    { id: makeId(), trackIndex: 1, start: 256, end: 1024, fragmentId: 'bass' },
    { id: makeId(), trackIndex: 2, start: 0, end: 1024, fragmentId: 'kick' },
    { id: makeId(), trackIndex: 3, start: 128, end: 192, fragmentId: 'clap1' },
    {
      id: makeId(),
      trackIndex: 3,
      start: 192,
      end: 256,
      fragmentId: 'clap-fast'
    },
    { id: makeId(), trackIndex: 3, start: 384, end: 448, fragmentId: 'clap2' },
    {
      id: makeId(),
      trackIndex: 3,
      start: 448,
      end: 512,
      fragmentId: 'clap-fast'
    },
    { id: makeId(), trackIndex: 3, start: 768, end: 960, fragmentId: 'clap2' },
    {
      id: makeId(),
      trackIndex: 3,
      start: 960,
      end: 1024,
      fragmentId: 'clap-fast'
    }
  ];

  const tracks: TrackState[] = [
    { name: 'piano', presetId: 'pluck', gain: 0.4 },
    { name: 'bass', presetId: 'bass', gain: 0.3 },
    { name: 'kick', presetId: 'kick', gain: 1 },
    { name: 'clap', presetId: 'clap', gain: 0.3 }
  ];

  return {
    bpm: 120,
    midiRefs,
    midiFragments: genMidiFragments(),
    presets,
    isPlaying: false,
    time: 0,
    tracks
  };
};
