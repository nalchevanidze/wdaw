import {
  FILTER_ID,
  Midi,
  Sequence,
  WAVE_ID,
  ENVELOPE_ID,
  EnvelopeConfig,
  PLAYER_ACTION,
  MidiFragment
} from '@wdaw/engine';

export type PANEL_ID = 'filter' | 'sequence' | 'wave';

type SET_WAVE = {
  type: 'SET_WAVE';
  id: WAVE_ID;
  payload: number;
};

type SET_FILTER = {
  type: 'SET_FILTER';
  id: FILTER_ID;
  payload: number;
};

type REFRESH = {
  type: 'REFRESH';
  payload: {
    time: number;
    notes: number[];
  };
};

type SET_BPM = {
  type: 'SET_BPM';
  payload: number;
};

type SET_SEQUENCE = {
  type: 'SET_SEQUENCE';
  payload: Sequence;
};

type TOGGLE_PANEL = {
  type: 'TOGGLE_PANEL';
  id: PANEL_ID;
};

type SET_GAIN = {
  type: 'SET_GAIN';
  payload: number;
  id: number;
};

type SET_ENVELOPE = {
  type: 'SET_ENVELOPE';
  id: ENVELOPE_ID;
  payload: Partial<EnvelopeConfig>;
};

type SET_PRESET = {
  type: 'SET_PRESET';
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

type SynthActions = KEY_UP | KEY_DOWN;

// Midi Actions

type SET_TIME = {
  type: 'SET_TIME';
  payload: number;
};

type SET_CURRENT_TRACK = {
  type: 'SET_CURRENT_TRACK';
  payload: number;
};

type SET_TRACK_MIDI = {
  type: 'SET_TRACK_MIDI';
  payload: Partial<Midi>;
  id: [number, number];
};

type SET_MIDI_FRAGMENT = {
  type: 'SET_MIDI_FRAGMENT';
  payload: Partial<MidiFragment>;
  id: string;
};

type PLAYER = {
  type: 'PLAYER';
  payload: PLAYER_ACTION;
};

type MidiActions =
  | SET_TIME
  | SET_CURRENT_TRACK
  | SET_MIDI_FRAGMENT
  | SET_TRACK_MIDI
  | PLAYER;

export type EngineAction =
  | SynthActions
  | SET_SEQUENCE
  | TOGGLE_PANEL
  | MidiActions
  | SET_ENVELOPE
  | SET_WAVE
  | SET_FILTER
  | SET_PRESET
  | REFRESH
  | SET_GAIN
  | SET_BPM;
