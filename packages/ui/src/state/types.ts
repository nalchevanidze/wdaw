import {
  FILTER_ID,
  Sequence,
  WAVE_ID,
  ENVELOPE_ID,
  EnvelopeConfig,
  MidiFragment,
  EngineState,
  MidiRef,
  TrackInput
} from '@wdaw/engine';

type ADT<K extends string, T extends string, P = {}> = {
  type: `${K}/${T}`;
} & P;

type ADTS<
  K extends string,
  T extends string,
  P = undefined
> = P extends undefined ? ADT<K, T> : ADT<K, T, { payload: P }>;

type PRESET =
  | {
      type: 'PRESET/SET_WAVE';
      id: WAVE_ID;
      payload: number;
    }
  | {
      type: 'PRESET/SET_ENVELOPE';
      id: ENVELOPE_ID;
      payload: Partial<EnvelopeConfig>;
    }
  | {
      type: 'PRESET/SET_FILTER';
      id: FILTER_ID;
      payload: number;
    }
  | {
      type: 'PRESET/SET_SEQUENCE';
      payload: Sequence;
    }
  | {
      type: 'PRESET/TOGGLE_MODULE';
      id: 'filter' | 'sequence';
    }
  | {
      type: 'PRESET/NEW_PRESET';
      trackId: number;
    }
  | {
      type: 'PRESET/ASSIGN_TO_TRACK';
      trackId: number;
      presetId: string;
    };

type TRACK =
  | {
      type: 'TRACK/SET_TRACK';
      id: number;
      payload: Partial<TrackInput>;
    }
  | {
      type: 'TRACK/SET_CURRENT';
      payload: number;
    }
  | {
      type: 'TRACK/NEW_TRACK';
    };

type Midi<T extends string, P = {}> = ADT<'MIDI', T, P>;
type Player<T extends string, P = undefined> = ADTS<'PLAYER', T, P>;
type Store<T extends string, P = undefined> = ADTS<'STORE', T, P>;
type Keyboard<T extends string, P = undefined> = ADTS<'KEYBOARD', T, P>;

type MIDI =
  | Midi<'NEW_FRAGMENT'>
  | Midi<'SET_CURRENT_FRAGMENT', { payload: string }>
  | Midi<'SET_MIDI_REFS', { payload: MidiRef[] }>
  | Midi<'SET_FRAGMENT', { payload: Partial<MidiFragment>; id: string }>
  | Midi<'SET_MIDI_REF', { id: string; payload: Partial<MidiRef> }>;

type PLAYER =
  | Player<'SET_TIME', number>
  | Player<'SET_BPM', number>
  | Player<'PLAY'>
  | Player<'STOP'>
  | Player<'PAUSE'>;

type KEYBOARD = Keyboard<'KEY_UP', number> | Keyboard<'KEY_DOWN', number>;

type STORE = Store<'SAVE'> | Store<'RESET'> | Store<'LOAD', DAWState>;

export type EngineAction = KEYBOARD | PRESET | TRACK | MIDI | PLAYER | STORE;

type UIState = {
  currentFragment: string;
  currentTrack: number;
  notes: number[];
};

export type DAWState = EngineState & UIState;
