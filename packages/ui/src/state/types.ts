import {
  FILTER_ID,
  Midi,
  Sequence,
  WAVE_ID,
  ENVELOPE_ID,
  EnvelopeConfig,
  MidiFragment,
  EngineState,
  MidiRef,
  TrackInput
} from '@wdaw/engine';

type PRESET_SET_WAVE = {
  type: 'PRESET_SET_WAVE';
  id: WAVE_ID;
  payload: number;
};

type PRESET_SET_FILTER = {
  type: 'PRESET_SET_FILTER';
  id: FILTER_ID;
  payload: number;
};

type PRESET_SET_SEQUENCE = {
  type: 'PRESET_SET_SEQUENCE';
  payload: Sequence;
};

type PRESET_TOGGLE_MODULE = {
  type: 'PRESET_TOGGLE_MODULE';
  id: 'filter' | 'sequence';
};

type PRESET_SET_ENVELOPE = {
  type: 'PRESET_SET_ENVELOPE';
  id: ENVELOPE_ID;
  payload: Partial<EnvelopeConfig>;
};

// Keyboard

type KEYBOARD_KEY_UP = {
  type: 'KEYBOARD_KEY_UP';
  payload: number;
};

type KEYBOARD_KEY_DOWN = {
  type: 'KEYBOARD_KEY_DOWN';
  payload: number;
};

// TRACK

type TRACK_SET_TRACK = {
  type: 'TRACK_SET_TRACK';
  id: number;
  payload: Partial<TrackInput>;
};

type TRACK_SET_PRESET = {
  type: 'TRACK_SET_PRESET';
  payload: string;
};

type TRACK_SET_CURRENT = {
  type: 'TRACK_SET_CURRENT';
  payload: number;
};

type TRACK_NEW_TRACK = { type: 'TRACK_NEW_TRACK' };

// MIDI

type MIDI_NEW_FRAGMENT = { type: 'MIDI_NEW_FRAGMENT' };

type MIDI_SET_CURRENT_FRAGMENT = {
  type: 'MIDI_SET_CURRENT_FRAGMENT';
  payload: string;
};

type MIDI_SET_MIDI_REFS = {
  type: 'MIDI_SET_MIDI_REFS';
  payload: MidiRef[];
};

type MIDI_SET_FRAGMENT = {
  type: 'MIDI_SET_FRAGMENT';
  payload: Partial<MidiFragment>;
  id: string;
};

type MIDI_SET_MIDI_REF = {
  type: 'MIDI_SET_MIDI_REF';
  id: string;
  payload: Partial<MidiRef>;
};

// PLAYER
type PLAYER_SET_TIME = {
  type: 'PLAYER_SET_TIME';
  payload: number;
};

type PLAYER_PLAY = {
  type: 'PLAYER_PLAY';
};

type PLAYER_STOP = {
  type: 'PLAYER_STOP';
};

type PLAYER_PAUSE = {
  type: 'PLAYER_PAUSE';
};

type PLAYER_SET_BPM = {
  type: 'PLAYER_SET_BPM';
  payload: number;
};

// REFRESH
type REFRESH_TIME = {
  type: 'REFRESH_TIME';
  payload: number;
};

type REFRESH_IS_PLAYING = {
  type: 'REFRESH_IS_PLAYING';
  payload: boolean;
};

// STORE 

type STORE_SAVE = {
  type: 'STORE_SAVE';
};

type STORE_RESET = {
  type: 'STORE_RESET';
};

type STORE_LOAD = {
  type: 'STORE_LOAD';
  payload: DAWState;
};

// COMBINATIONS

type SynthActions =
  | KEYBOARD_KEY_UP
  | KEYBOARD_KEY_DOWN
  | PRESET_SET_SEQUENCE
  | PRESET_TOGGLE_MODULE
  | PRESET_SET_ENVELOPE
  | PRESET_SET_WAVE
  | PRESET_SET_FILTER
  | TRACK_SET_PRESET;

type MidiActions =
  | TRACK_SET_CURRENT
  | TRACK_SET_TRACK
  | TRACK_NEW_TRACK
  | MIDI_SET_FRAGMENT
  | MIDI_SET_MIDI_REFS
  | MIDI_SET_MIDI_REF
  | MIDI_NEW_FRAGMENT
  | MIDI_SET_CURRENT_FRAGMENT
  | PLAYER_SET_TIME
  | PLAYER_PLAY
  | PLAYER_PAUSE
  | PLAYER_STOP
  | PLAYER_SET_BPM;

type EngineEvents = REFRESH_TIME | REFRESH_IS_PLAYING;

type StoreActions = STORE_SAVE | STORE_RESET | STORE_LOAD;

export type EngineAction =
  | SynthActions
  | MidiActions
  | StoreActions
  | EngineEvents;

export type DAWState = EngineState & {
  currentFragment: string;
  currentTrack: number;
  notes: number[];
  isPlaying: boolean;
};
