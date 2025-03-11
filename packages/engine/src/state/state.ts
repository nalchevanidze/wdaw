import { TrackInput, TracksInput } from '../common/types';
import { genMidiFragments } from './fragments';
import { genMidiRefs } from './midi-refs';
import { genPresets, pid } from './presets';
import { makeLib } from './utils';

export type ControlPoint = { index: number; value: number };

export type ValueController =
  | { type: 'fixed'; value: number }
  | { type: 'dynamic'; value: ControlPoint[] };

type PlayerState = { bpm: ValueController };

export type EngineState = PlayerState & TracksInput;

const genTracks = (): TrackInput[] => [
  { name: 'Piano', presetId: pid.pluck, gain: 0.4 },
  { name: 'Bass', presetId: pid.bass, gain: 0.3 },
  { name: 'Kick', presetId: pid.kick, gain: 1 },
  { name: 'Clap', presetId: pid.clap, gain: 0.3 }
];

export const engineState = (): EngineState => ({
  midiRefs: genMidiRefs(),
  tracks: genTracks(),
  midiFragments: makeLib(genMidiFragments()),
  presets: makeLib(genPresets()),
  bpm: {
    type: 'dynamic',
    value: [
      { index: 0, value: 80 },
      { index: 512, value: 200 },
      { index: 1024, value: 120 }
    ]
  }
});
