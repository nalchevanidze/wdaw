import { TrackInput, TracksInput } from '../common/types';
import { DynamicValueInput } from '../player';
import { Scalar } from '../player/';
import { genMidiFragments } from './fragments';
import { genMidiRefs } from './midi-refs';
import { genPresets, pid } from './presets';
import { makeLib } from './utils';

type PlayerState = { bpm: DynamicValueInput };

export type EngineState = PlayerState & TracksInput;

const genTracks = (): TrackInput[] => [
  { name: 'Piano', presetId: pid.pluck, gain: Scalar.fixed(0.4) },
  { name: 'Bass', presetId: pid.bass, gain: Scalar.fixed(0.3) },
  { name: 'Kick', presetId: pid.kick, gain: Scalar.fixed(0.5) },
  {
    name: 'Clap',
    presetId: pid.clap,
    gain: Scalar.dynamic(
      { time: 128, value: 0.2 },
      { time: 256, value: 1 },
      { time: 256, value: 0.2 },
      { time: 384, value: 0.2 },
      { time: 512, value: 1 }
    )
  }
];

export const engineState = (): EngineState => ({
  midiRefs: genMidiRefs(),
  tracks: genTracks(),
  midiFragments: makeLib(genMidiFragments()),
  presets: makeLib(genPresets()),
  bpm: Scalar.dynamic(
    { time: 32, value: 60 },
    { time: 128, value: 160 },
    { time: 256, value: 180 },
    { time: 256, value: 120 },
    { time: 512, value: 120 }
  )
});
