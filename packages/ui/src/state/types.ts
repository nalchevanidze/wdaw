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
  type: 'PRESET/SET_WAVE';
  id: WAVE_ID;
  payload: number;
};

type PRESET_SET_FILTER = {
  type: 'PRESET/SET_FILTER';
  id: FILTER_ID;
  payload: number;
};

type PRESET_SET_SEQUENCE = {
  type: 'PRESET/SET_SEQUENCE';
  payload: Sequence;
};

type PRESET_TOGGLE_MODULE = {
  type: 'PRESET/TOGGLE_MODULE';
  id: 'filter' | 'sequence';
};

type PRESET_SET_ENVELOPE = {
  type: 'PRESET/SET_ENVELOPE';
  id: ENVELOPE_ID;
  payload: Partial<EnvelopeConfig>;
};

type PRESET_NEW_PRESET = {
  type: 'PRESET/NEW_PRESET';
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
  type: 'TRACK/SET_TRACK';
  id: number;
  payload: Partial<TrackInput>;
};

type PRESET_ASSIGN_TO_TRACK = {
  type: 'PRESET/ASSIGN_TO_TRACK';
  payload: string;
};

type TRACK_SET_CURRENT = {
  type: 'TRACK/SET_CURRENT';
  payload: number;
};

type TRACK_NEW_TRACK = { type: 'TRACK/NEW_TRACK' };

// MIDI

type MIDI_NEW_FRAGMENT = { type: 'MIDI/NEW_FRAGMENT' };

type MIDI_SET_CURRENT_FRAGMENT = {
  type: 'MIDI/SET_CURRENT_FRAGMENT';
  payload: string;
};

type MIDI_SET_MIDI_REFS = {
  type: 'MIDI/SET_MIDI_REFS';
  payload: MidiRef[];
};

type MIDI_SET_FRAGMENT = {
  type: 'MIDI/SET_FRAGMENT';
  payload: Partial<MidiFragment>;
  id: string;
};

type MIDI_SET_MIDI_REF = {
  type: 'MIDI/SET_MIDI_REF';
  id: string;
  payload: Partial<MidiRef>;
};

// PLAYER
type PLAYER_SET_TIME = {
  type: 'PLAYER/SET_TIME';
  payload: number;
};

type PLAYER_PLAY = {
  type: 'PLAYER/PLAY';
};

type PLAYER_STOP = {
  type: 'PLAYER/STOP';
};

type PLAYER_PAUSE = {
  type: 'PLAYER/PAUSE';
};

type PLAYER_SET_BPM = {
  type: 'PLAYER/SET_BPM';
  payload: number;
};

// REFRESH
type ENGINE_EVENT_TIME_CHANGED = {
  type: 'ENGINE_EVENT/TIME_CHANGED';
  payload: number;
};

type ENGINE_EVENT_IS_PLAYING_CHANGED = {
  type: 'ENGINE_EVENT/IS_PLAYING_CHANGED';
  payload: boolean;
};

// STORE

type STORE_SAVE = {
  type: 'STORE/SAVE';
};

type STORE_RESET = {
  type: 'STORE/RESET';
};

type STORE_LOAD = {
  type: 'STORE/LOAD';
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
  | PRESET_NEW_PRESET
  | PRESET_ASSIGN_TO_TRACK;

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

type EngineEvents = ENGINE_EVENT_TIME_CHANGED | ENGINE_EVENT_IS_PLAYING_CHANGED;

type StoreActions = STORE_SAVE | STORE_RESET | STORE_LOAD;

export type EngineAction =
  | SynthActions
  | MidiActions
  | StoreActions
  | EngineEvents;

type UIState = {
  currentFragment: string;
  currentTrack: number;
  notes: number[];
  time: number;
  isPlaying: boolean;
};

export type DAWState = EngineState & UIState;
