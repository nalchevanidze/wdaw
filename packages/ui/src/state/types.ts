import {
  Sequence,
  Envelope,
  MidiFragment,
  EngineState,
  MidiRef,
  TrackInput,
  Wave
} from '@wdaw/engine';

export type FILTER_ID = 'cutoff' | 'envelope' | 'resonance';

export type ENVELOPE_ID = 'gain' | 'filter';

export type WAVE_ID = keyof Wave;

type ADT<K extends string, T extends string, P = {}> = {
  type: `${K}/${T}`;
} & P;

type PRESET<T extends string, P = {}> = ADT<'PRESET', T, P>;
type TRACK<T extends string, P = {}> = ADT<'TRACK', T, P>;
type MIDI<T extends string, P = {}> = ADT<'MIDI', T, P>;
type PLAYER<T extends string, P = {}> = ADT<'PLAYER', T, P>;
type STORE<T extends string, P = {}> = ADT<'STORE', T, P>;
type KEYBOARD<T extends string, P = {}> = ADT<'KEYBOARD', T, P>;

export type EngineAction =
  | PRESET<'SET_WAVE', { id: WAVE_ID; payload: number }>
  | PRESET<'SET_ENVELOPE', { id: ENVELOPE_ID; payload: Partial<Envelope> }>
  | PRESET<'SET_FILTER', { id: FILTER_ID; payload: number }>
  | PRESET<'SET_SEQUENCE', { payload: Sequence }>
  | PRESET<'TOGGLE_MODULE', { id: 'filter' | 'sequence' }>
  | PRESET<'NEW_PRESET', { trackId: number }>
  | PRESET<'ASSIGN_TO_TRACK', { trackId: number; presetId: string }>
  // TRACK
  | TRACK<'SET_TRACK', { id: number; payload: Partial<TrackInput> }>
  | TRACK<'SET_CURRENT', { payload: number }>
  | TRACK<'NEW_TRACK'>
  // MIDI
  | MIDI<'NEW_FRAGMENT'>
  | MIDI<'SET_CURRENT_FRAGMENT', { payload: string }>
  | MIDI<'SET_MIDI_REFS', { payload: MidiRef[] }>
  | MIDI<'SET_FRAGMENT', { id: string; payload: Partial<MidiFragment> }>
  | MIDI<'SET_MIDI_REF', { id: string; payload: Partial<MidiRef> }>
  // PLAYER
  | PLAYER<'SET_TIME', { payload: number }>
  | PLAYER<'SET_BPM', { payload: number }>
  | PLAYER<'PLAY'>
  | PLAYER<'STOP'>
  | PLAYER<'PAUSE'>
  // KEYBOARD
  | KEYBOARD<'KEY_UP', { payload: number }>
  | KEYBOARD<'KEY_DOWN', { payload: number }>
  // STORE
  | STORE<'SAVE'>
  | STORE<'RESET'>
  | STORE<'LOAD', { payload: DAWState }>;

type UIState = {
  currentFragment: string;
  currentTrack: number;
  notes: number[];
};

export type DAWState = EngineState & UIState;
