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
  TrackState
} from '@wdaw/engine';

export type PANEL_ID = 'filter' | 'sequence' | 'wave';

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
  id: PANEL_ID;
};

type PRESET_SET_ENVELOPE = {
  type: 'PRESET_SET_ENVELOPE';
  id: ENVELOPE_ID;
  payload: Partial<EnvelopeConfig>;
};

// Keyboard

type KEY_UP = {
  type: 'KEY_UP';
  payload: number;
};

type KEY_DOWN = {
  type: 'KEY_DOWN';
  payload: number;
};

// TRACK

type TRACK_SET_TRACK = {
  type: 'TRACK_SET_TRACK';
  id: number;
  payload: Partial<TrackState>;
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

// STATE
type SAVE = {
  type: 'SAVE';
};

type RESET = {
  type: 'RESET';
};

type LOAD = {
  type: 'LOAD';
  payload: DAWState;
};

type SynthActions =
  | KEY_UP
  | KEY_DOWN
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

type StateActions = SAVE | RESET | LOAD;

export type EngineAction =
  | SynthActions
  | MidiActions
  | StateActions
  | EngineEvents;

export type DAWState = EngineState & {
  currentFragment: string;
  currentTrack: number;
  notes: number[];
};
