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

type KEYBOARD =
  | {
      type: 'KEYBOARD_KEY_UP';
      payload: number;
    }
  | {
      type: 'KEYBOARD_KEY_DOWN';
      payload: number;
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

type MIDI =
  | { type: 'MIDI/NEW_FRAGMENT' }
  | {
      type: 'MIDI/SET_CURRENT_FRAGMENT';
      payload: string;
    }
  | {
      type: 'MIDI/SET_MIDI_REFS';
      payload: MidiRef[];
    }
  | {
      type: 'MIDI/SET_FRAGMENT';
      payload: Partial<MidiFragment>;
      id: string;
    }
  | {
      type: 'MIDI/SET_MIDI_REF';
      id: string;
      payload: Partial<MidiRef>;
    };

type PLAYER =
  | { type: 'PLAYER/SET_TIME'; payload: number }
  | { type: 'PLAYER/SET_BPM'; payload: number }
  | { type: 'PLAYER/PLAY' }
  | { type: 'PLAYER/STOP' }
  | { type: 'PLAYER/PAUSE' };

type ENGINE_EVENT =
  | { type: 'ENGINE_EVENT/TIME_CHANGED'; payload: number }
  | { type: 'ENGINE_EVENT/IS_PLAYING_CHANGED'; payload: boolean };

type STORE =
  | { type: 'STORE/SAVE' }
  | { type: 'STORE/RESET' }
  | { type: 'STORE/LOAD'; payload: DAWState };

export type EngineAction =
  | KEYBOARD
  | PRESET
  | TRACK
  | MIDI
  | PLAYER
  | ENGINE_EVENT
  | STORE;

type UIState = {
  currentFragment: string;
  currentTrack: number;
  notes: number[];
  time: number;
  isPlaying: boolean;
};

export type DAWState = EngineState & UIState;
