import { TrackInput, TracksInput } from '../common/types';
import { DynamicValueInput } from '../player';
import { genMidiFragments } from './fragments';
import { genMidiRefs } from './midi-refs';
import { genPresets, pid } from './presets';
import { makeLib } from './utils';

type PlayerState = { bpm: DynamicValueInput };

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
      { index: 32, value: 60 },
      { index: 128, value: 160 },
      { index: 256, value: 180 },
      { index: 256, value: 120 },
      { index: 512, value: 120 }
    ]
  }
});
