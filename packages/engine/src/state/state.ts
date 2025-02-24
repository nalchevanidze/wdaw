import {
  MidiFragment,
  MidiRef,
  TrackInput,
  TracksInput
} from '../common/types';
import { genMidiFragments } from './fragments';
import { genMidiRefs } from './midi-refs';
import { genPresets, pid } from './presets';
import { makeLib } from './utils';

type PlayerState = {
  time: number;
  bpm: number;
};

export type EngineState = PlayerState & TracksInput;

const genTracks = (): TrackInput[] => [
  { name: 'Piano', presetId: pid.pluck, gain: 0.4 },
  { name: 'Bass', presetId: pid.bass, gain: 0.3 },
  { name: 'Kick', presetId: pid.kick, gain: 1 },
  { name: 'Clap', presetId: pid.clap, gain: 0.3 }
];

export const engineState = (): EngineState => ({
  midiRefs: genMidiRefs(),
  midiFragments: makeLib(genMidiFragments()),
  tracks: genTracks(),
  presets: makeLib(genPresets()),
  bpm: 120,
  time: 0
});

export const makeMidiRef = ({
  trackId,
  start,
  end
}: Omit<MidiRef, 'id'>): MidiRef => ({
  id: crypto.randomUUID(),
  trackId,
  start,
  end
});

export const makeFragment = (name: string): MidiFragment & { id: string } => ({
  id: crypto.randomUUID(),
  name,
  notes: [],
  loop: [0, 64]
});
