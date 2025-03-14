import { TrackInput, TracksInput } from '../common/types';
import { DynamicValueInput } from '../player';
import { genMidiFragments } from './fragments';
import { genMidiRefs } from './midi-refs';
import { genPresets, pid } from './presets';
import { makeLib } from './utils';

type PlayerState = { bpm: DynamicValueInput };

export type EngineState = PlayerState & TracksInput;

const genTracks = (): TrackInput[] => [
  { name: 'Piano', presetId: pid.pluck, gain: { type: 'fixed', value: 0.4 } },
  { name: 'Bass', presetId: pid.bass, gain: { type: 'fixed', value: 0.3 } },
  {
    name: 'Kick',
    presetId: pid.kick,
    gain: {
      type: 'dynamic',
      value: [
        { time: 32, value: 0.2 },
        { time: 256, value: 1 },
        { time: 256, value: 0.5 },
      ]
    }
  },
  { name: 'Clap', presetId: pid.clap, gain: { type: 'fixed', value: 0.3 } }
];

export const engineState = (): EngineState => ({
  midiRefs: genMidiRefs(),
  tracks: genTracks(),
  midiFragments: makeLib(genMidiFragments()),
  presets: makeLib(genPresets()),
  bpm: {
    type: 'dynamic',
    value: [
      { time: 32, value: 60 },
      { time: 128, value: 160 },
      { time: 256, value: 180 },
      { time: 256, value: 120 },
      { time: 512, value: 120 }
    ]
  }
});
