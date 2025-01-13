import { PresetName } from './state';
import { ARP_NOTE_LOCATION } from './midi/types';
import {
  ENVELOPE_ID,
  EnvelopeConfig,
  FILTER_ID,
  Midi,
  PANEL_ID,
  PLAYER_ACTION,
  WAVE_ID
} from '../core/types';

export type SET_TIME = { type: 'SET_TIME'; payload: number };

export type PLAYER = { type: 'PLAYER'; payload: PLAYER_ACTION };

export type KEY_PRESS = { type: `KEY_${'UP' | 'DOWN'}`; payload: number };

export type TOGGLE_APR_NOTE = {
  type: 'TOGGLE_APR_NOTE';
  payload: ARP_NOTE_LOCATION;
};

export type TOGGLE_PANEL = {
  type: 'TOGGLE_PANEL';
  id: PANEL_ID;
};

export type SET_MIDI = {
  type: 'SET_MIDI';
  payload: Midi;
};

export type SET_ENVELOPE = {
  type: 'SET_ENVELOPE';
  id: ENVELOPE_ID;
  payload: Partial<EnvelopeConfig>;
};

export type SET_PRESET = {
  type: 'SET_PRESET';
  payload: PresetName;
};

export type SET_WAVE = {
  type: 'SET_WAVE';
  id: WAVE_ID;
  payload: number;
};

export type SET_FILTER = {
  type: 'SET_FILTER';
  id: FILTER_ID;
  payload: number;
};

export type REFRESH = {
  type: 'REFRESH';
  payload: {
    time: number;
    notes: number[];
  };
};

export type EngineAction =
  | PLAYER
  | KEY_PRESS
  | SET_TIME
  | TOGGLE_APR_NOTE
  | TOGGLE_PANEL
  | SET_MIDI
  | SET_ENVELOPE
  | SET_WAVE
  | SET_FILTER
  | SET_PRESET
  | REFRESH;
