import {
  Sequence,
  Envelope,
  MidiFragment,
  EngineState,
  MidiRef,
  TrackInput,
  Wave,
  Preset
} from '@wdaw/engine';

export type FILTER = 'cutoff' | 'envelope' | 'resonance';

export type ENVELOPE = keyof Preset['envelopes'];

export type WAVE = keyof Wave;

type ADT<K extends string, T extends string, P = {}> = {
  type: `${K}/${T}`;
} & P;

type PRESET_BASE<T extends string, P = {}> = ADT<'PRESET', T, P> & {
  trackId: number;
};

type PRESET<T extends string, P = {}> = PRESET_BASE<T, P> & {
  presetId: string;
};

type TRACK<T extends string, P = {}> = ADT<'TRACK', T, P>;
type MIDI<T extends string, P = {}> = ADT<'MIDI', T, P>;
type PLAYER<T extends string, P = {}> = ADT<'PLAYER', T, P>;
type STORE<T extends string, P = {}> = ADT<'STORE', T, P>;

export type EngineAction =
  | PRESET_BASE<'NEW_PRESET'>
  | PRESET<'SET_WAVE', { id: WAVE; payload: number }>
  | PRESET<'SET_ENVELOPE', { id: ENVELOPE; payload: Partial<Envelope> }>
  | PRESET<'SET_FILTER', { id: FILTER; payload: number }>
  | PRESET<'SET_SEQUENCE', { payload: Sequence }>
  | PRESET<'TOGGLE_MODULE', { id: 'filter' | 'sequence' }>
  | PRESET<'ASSIGN_TO_TRACK'>
  // TRACK
  | TRACK<'SET_TRACK', { id: number; payload: Partial<TrackInput> }>
  | TRACK<'SET_CURRENT', { payload: number }>
  | TRACK<'NEW_TRACK'>
  // MIDI
  | MIDI<'NEW_FRAGMENT', { payload: MidiFragment }>
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
  // STORE
  | STORE<'SAVE'>
  | STORE<'RESET'>
  | STORE<'LOAD', { payload: State }>;

export type UIState = {
  currentFragment: string;
  currentTrack: number;
};

export type KeyboardAPI = {
  startNote(i: number, n: number): void;
  endNote(i: number, n: number): void;
};

export type State = EngineState & UIState;
