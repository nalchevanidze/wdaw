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
import { Track } from '@wdaw/engine/src/player';

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

type REFRESH_TIME = {
  type: 'REFRESH_TIME';
  payload: number;
};

type REFRESH_IS_PLAYING = {
  type: 'REFRESH_IS_PLAYING';
  payload: boolean;
};

type SET_BPM = {
  type: 'SET_BPM';
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

type TRACK_SET_TRACK = {
  type: 'TRACK_SET_TRACK';
  id: number;
  payload: Partial<TrackState>;
};

type PRESET_SET_ENVELOPE = {
  type: 'PRESET_SET_ENVELOPE';
  id: ENVELOPE_ID;
  payload: Partial<EnvelopeConfig>;
};

type TRACK_SET_PRESET = {
  type: 'TRACK_SET_PRESET';
  payload: string;
};

type KEY_UP = {
  type: 'KEY_UP';
  payload: number;
};

type KEY_DOWN = {
  type: 'KEY_DOWN';
  payload: number;
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

// Midi Actions
type SET_TIME = {
  type: 'SET_TIME';
  payload: number;
};

type SET_CURRENT_TRACK = {
  type: 'SET_CURRENT_TRACK';
  payload: number;
};

type TRACK_NEW_TRACK = { type: 'TRACK_NEW_TRACK' };

type NEW_FRAGMENT = { type: 'NEW_FRAGMENT' };

type SET_CURRENT_FRAGMENT = {
  type: 'SET_CURRENT_FRAGMENT';
  payload: string;
};

type SET_MIDI_REFS = {
  type: 'SET_MIDI_REFS';
  payload: MidiRef[];
};

type SET_MIDI_FRAGMENT = {
  type: 'SET_MIDI_FRAGMENT';
  payload: Partial<MidiFragment>;
  id: string;
};

type PLAY = {
  type: 'PLAY';
};

type STOP = {
  type: 'STOP';
};

type PAUSE = {
  type: 'PAUSE';
};

// GLOBAL

type SAVE = {
  type: 'SAVE';
};

type RESET = {
  type: 'RESET';
};

type SET_MIDI_REF = {
  type: 'SET_MIDI_REF';
  id: string;
  payload: Partial<MidiRef>;
};

type LOAD = {
  type: 'LOAD';
  payload: DAWState;
};

type GlobalActions = SAVE | RESET | LOAD;

type MidiActions =
  | SET_TIME
  | SET_CURRENT_TRACK
  | SET_MIDI_FRAGMENT
  | SET_MIDI_REFS
  | TRACK_NEW_TRACK
  | NEW_FRAGMENT
  | PLAY
  | PAUSE
  | STOP
  | TRACK_SET_TRACK
  | SET_MIDI_REF
  | SET_CURRENT_FRAGMENT;

export type EngineAction =
  | SynthActions
  | MidiActions
  | GlobalActions
  | REFRESH_TIME
  | REFRESH_IS_PLAYING
  | SET_BPM;

export type DAWState = EngineState & {
  currentFragment: string;
  currentTrack: number;
  notes: number[];
};
