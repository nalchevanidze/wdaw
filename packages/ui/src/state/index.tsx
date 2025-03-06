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

const dispatcher = (
  { tracks, midiRefs, midiFragments, presets, bpm }: EngineState,
  action: EngineAction
): Partial<EngineState> | undefined => {
  switch (action.type) {
    // PRESET
    case 'PRESET/SET_SEQUENCE':
      return mapPreset(presets, action.presetId, () => ({
        sequence: action.payload
      }));
    case 'PRESET/TOGGLE_MODULE':
      return mapPreset(presets, action.presetId, (preset) => ({
        [action.id]: {
          ...preset[action.id],
          enabled: !preset[action.id].enabled
        }
      }));
    case 'PRESET/SET_ENVELOPE':
      return mapPreset(presets, action.presetId, ({ envelopes }) => ({
        envelopes: {
          ...envelopes,
          [action.id]: { ...envelopes[action.id], ...action.payload }
        }
      }));
    case 'PRESET/SET_WAVE':
      return mapPreset(presets, action.presetId, ({ wave }) => ({
        wave: { ...wave, [action.id]: action.payload }
      }));
    case 'PRESET/SET_FILTER':
      return mapPreset(presets, action.presetId, ({ filter }) => ({
        filter: { ...filter, [action.id]: action.payload }
      }));
    case 'PRESET/NEW_PRESET': {
      const p = makePreset('new preset');
      return {
        ...mapTrack(tracks, action.trackId, () => ({ presetId: p.id })),
        presets: { ...presets, [p.id]: p }
      };
    }
    case 'PRESET/ASSIGN_TO_TRACK':
      return mapTrack(tracks, action.trackId, () => ({
        presetId: action.presetId
      }));
    // MIDI
    case 'MIDI/SET_MIDI_REFS':
      return { midiRefs: action.payload };
    case 'MIDI/SET_MIDI_REF':
      return mapMidiRefs(midiRefs, action.id, () => action.payload);
    case 'MIDI/SET_FRAGMENT':
      return mapMidiFragment(midiFragments, action.id, () => action.payload);
    case 'MIDI/NEW_FRAGMENT': {
      return {
        midiFragments: { ...midiFragments, [action.payload.id]: action.payload }
      };
    }
    // TRACK
    case 'TRACK/SET_TRACK':
      return mapTrack(tracks, action.id, () => action.payload);
    case 'TRACK/NEW_TRACK':
      return {
        tracks: [
          ...tracks,
          {
            name: `track ${tracks.length + 5}`,
            gain: 1,
            presetId: Object.keys(presets)[0]
          }
        ]
      };
    // Player
    case 'PLAYER/SET_BPM':
      return { bpm: action.payload };
    // STORE
    case 'STORE/SAVE':
      return saveState({ tracks, midiRefs, midiFragments, presets, bpm });
    case 'STORE/RESET': {
      deleteState();
      return dawState();
    }
    case 'STORE/LOAD':
      return { ...action.payload };
    default:
      return;
  }
};

const dispatchUIState = (
  action: EngineAction
): Partial<UIState> | undefined => {
  switch (action.type) {
    case 'MIDI/SET_CURRENT_FRAGMENT':
      return { currentFragment: action.payload };
    case 'MIDI/NEW_FRAGMENT':
      return { currentFragment: action.payload.id };
    case 'TRACK/SET_CURRENT':
      return { currentTrack: action.payload };
    default:
      return;
  }
};

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
    const stateChanges = dispatcher(state, action);
    const uiState = dispatchUIState(action);
    const newState =
      stateChanges || uiState
        ? { ...state, ...stateChanges, ...uiState }
        : state;

    engineEffects(newState, engine, action);

    return newState;
  };
