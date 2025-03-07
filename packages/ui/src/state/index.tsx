import { EngineState, makePreset, SynthEngine } from '@wdaw/engine';
import {
  deleteState,
  mapPreset,
  mapTrack,
  saveState,
  mapMidiFragment,
  mapMidiRefs
} from './utils';
import { State, EngineAction, UIState } from './types';
import { dawState } from './defs';
import { dispatcher } from './engine-state';
import { dispatchUIState } from './ui-state';

const engineEffects = (
  { tracks, midiFragments, presets, midiRefs }: EngineState,
  engine: SynthEngine,
  action: EngineAction
): void => {
  switch (action.type) {
    // Player
    case 'PLAYER/PLAY':
      return engine.play();
    case 'PLAYER/PAUSE':
      return engine.pause();
    case 'PLAYER/STOP':
      return engine.stop();
    case 'PLAYER/SET_TIME':
      return engine.setTime(action.payload);
    case 'PLAYER/SET_BPM':
      return engine.setBPM(action.payload);
    // Midi
    case 'MIDI/SET_MIDI_REF':
    case 'MIDI/SET_FRAGMENT':
    case 'MIDI/SET_MIDI_REFS':
      return engine.setMidis(midiRefs, midiFragments);
    // Track
    case 'TRACK/SET_TRACK':
      return action.payload.gain
        ? engine.setGain(action.id, action.payload.gain)
        : undefined;
    case 'TRACK/NEW_TRACK':
      engine.setTracks({ tracks, midiFragments, presets, midiRefs });
      return;
    // Preset
    case 'PRESET/SET_SEQUENCE':
    case 'PRESET/TOGGLE_MODULE':
    case 'PRESET/SET_ENVELOPE':
    case 'PRESET/SET_WAVE':
    case 'PRESET/SET_FILTER':
    case 'PRESET/ASSIGN_TO_TRACK':
      return engine.setPreset(action.trackId, presets[action.presetId]);
    // Store
    case 'STORE/LOAD':
      engine.setTracks(action.payload);
      engine.setBPM(action.payload.bpm);
      return;
  }
};

export const makeReducer =
  (engine: SynthEngine) => (state: State, action: EngineAction) => {
    const engineChanges = dispatcher(state, action);
    const newState = engineChanges ? { ...state, ...engineChanges } : state;

    engineEffects(newState, engine, action);

    const uiState = dispatchUIState(action);

    return uiState ? { ...newState, ...uiState } : newState;
  };
