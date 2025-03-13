import {
  Sequence,
  Envelope,
  MidiFragment,
  EngineState,
  MidiRef,
  TrackInput,
  Wave,
  Filter,
  Preset,
  DynamicValueInput
} from '@wdaw/engine';

export type ENVELOPE = keyof Preset['envelopes'];

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

type PartialWithKey<I extends keyof T, T extends object> = Partial<
  Omit<T, I>
> & {
  [K in I]: T[K];
};

export type EngineAction =
  | PRESET_BASE<'NEW_PRESET'>
  | PRESET<'SET_WAVE', { wave: Partial<Wave> }>
  | PRESET<'SET_FILTER', { filter: Partial<Filter> }>
  | PRESET<'SET_SEQUENCE', { sequence: Sequence }>
  | PRESET<'SET_ENVELOPE', { id: ENVELOPE; payload: Partial<Envelope> }>
  | PRESET<'TOGGLE_MODULE', { id: 'filter' | 'sequence' }>
  | PRESET<'ASSIGN_TO_TRACK'>
  // TRACK
  | TRACK<'SET_TRACK', { trackId: number; payload: Partial<TrackInput> }>
  | TRACK<'SET_CURRENT', { trackId: number }>
  | TRACK<'NEW_TRACK'>
  // MIDI
  | MIDI<'SET_CURRENT_FRAGMENT', { fragmentId: string }>
  | MIDI<'SET_MIDI_REFS', { payload: MidiRef[] }>
  | MIDI<'SET_MIDI_REF', { payload: PartialWithKey<'id', MidiRef> }>
  | MIDI<'NEW_FRAGMENT', { fragment: MidiFragment }>
  | MIDI<'SET_FRAGMENT', { fragment: PartialWithKey<'id', MidiFragment> }>
  // PLAYER
  | PLAYER<'SET_BPM', { payload: DynamicValueInput }>
  // STORE
  | STORE<'SAVE'>
  | STORE<'RESET'>
  | STORE<'LOAD', { payload: State }>;

export type UIState = {
  currentFragment: string;
  currentTrack: number;
};

export type EngineApi = {
  startNote(i: number, n: number): void;
  endNote(i: number, n: number): void;
  play(): void;
  pause(): void;
  stop(): void;
  setTime(i: number): void;
};

export type State = EngineState & UIState;
