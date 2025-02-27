import {
  FILTER_ID,
  Sequence,
  WAVE_ID,
  Envelope,
  MidiFragment,
  EngineState,
  MidiRef,
  TrackInput
} from '@wdaw/engine';

export type ENVELOPE_ID = 'gain' | 'filter';

type ADT<K extends string, T extends string, P = {}> = {
  type: `${K}/${T}`;
} & P;

type Preset<T extends string, P = {}> = ADT<'PRESET', T, P>;
type Track<T extends string, P = {}> = ADT<'TRACK', T, P>;
type Midi<T extends string, P = {}> = ADT<'MIDI', T, P>;
type Player<T extends string, P = {}> = ADT<'PLAYER', T, P>;
type Store<T extends string, P = {}> = ADT<'STORE', T, P>;
type Keyboard<T extends string, P = {}> = ADT<'KEYBOARD', T, P>;

type PRESET =
  | Preset<'SET_WAVE', { id: WAVE_ID; payload: number }>
  | Preset<'SET_ENVELOPE', { id: ENVELOPE_ID; payload: Partial<Envelope> }>
  | Preset<'SET_FILTER', { id: FILTER_ID; payload: number }>
  | Preset<'SET_SEQUENCE', { payload: Sequence }>
  | Preset<'TOGGLE_MODULE', { id: 'filter' | 'sequence' }>
  | Preset<'NEW_PRESET', { trackId: number }>
  | Preset<'ASSIGN_TO_TRACK', { trackId: number; presetId: string }>;

type TRACK =
  | Track<'SET_TRACK', { id: number; payload: Partial<TrackInput> }>
  | Track<'SET_CURRENT', { payload: number }>
  | Track<'NEW_TRACK'>;

type MIDI =
  | Midi<'NEW_FRAGMENT'>
  | Midi<'SET_CURRENT_FRAGMENT', { payload: string }>
  | Midi<'SET_MIDI_REFS', { payload: MidiRef[] }>
  | Midi<'SET_FRAGMENT', { id: string; payload: Partial<MidiFragment> }>
  | Midi<'SET_MIDI_REF', { id: string; payload: Partial<MidiRef> }>;

type PLAYER =
  | Player<'SET_TIME', { payload: number }>
  | Player<'SET_BPM', { payload: number }>
  | Player<'PLAY'>
  | Player<'STOP'>
  | Player<'PAUSE'>;

type KEYBOARD =
  | Keyboard<'KEY_UP', { payload: number }>
  | Keyboard<'KEY_DOWN', { payload: number }>;

type STORE =
  | Store<'SAVE'>
  | Store<'RESET'>
  | Store<'LOAD', { payload: DAWState }>;

export type EngineAction = KEYBOARD | PRESET | TRACK | MIDI | PLAYER | STORE;

type UIState = {
  currentFragment: string;
  currentTrack: number;
  notes: number[];
};

export type DAWState = EngineState & UIState;
