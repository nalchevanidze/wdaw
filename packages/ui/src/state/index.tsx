import { SynthEngine, DAWState } from '@wdaw/engine';
import { mapPreset, mapTrack, setMidiFragment } from './utils';
import { EngineAction } from './types';

const dispatcher = (
  state: DAWState,
  action: EngineAction
): Partial<DAWState> | undefined => {
  switch (action.type) {
    case 'SET_CURRENT_TRACK':
      return { tracks: { ...state.tracks, currentTrack: action.payload } };
    case 'SET_BPM':
      return { bpm: action.payload };
    case 'SET_SEQUENCE':
      return mapPreset(state, () => ({ sequence: action.payload }));
    case 'TOGGLE_PANEL':
      return mapPreset(state, (preset) =>
        action.id === 'wave'
          ? {}
          : {
              [action.id]: {
                ...preset[action.id],
                enabled: !preset[action.id].enabled
              }
            }
      );
    case 'SET_TRACK_MIDI':
      return mapTrack(action.id[0], state, ({ midi, ...rest }) => ({
        ...rest,
        midi: midi.map((m, i) =>
          i === action.id[1] ? { ...m, ...action.payload } : m
        )
      }));
    case 'SET_MIDI_FRAGMENT':
      return setMidiFragment(action.id, state, action.payload);
    case 'SET_GAIN':
      return mapTrack(action.id, state, (rest) => ({
        ...rest,
        gain: action.payload
      }));
    case 'SET_ENVELOPE':
      return mapPreset(state, ({ envelopes }) => ({
        envelopes: {
          ...envelopes,
          [action.id]: { ...envelopes[action.id], ...action.payload }
        }
      }));
    case 'SET_WAVE':
      return mapPreset(state, ({ wave }) => ({
        wave: { ...wave, [action.id]: action.payload }
      }));
    case 'SET_FILTER':
      return mapPreset(state, ({ filter }) => ({
        filter: { ...filter, [action.id]: action.payload }
      }));
    case 'SET_PRESET':
      const preset = state.presets.find((p) => p.name === action.payload);
      return preset ? mapPreset(state, () => preset) : undefined;
    case 'REFRESH':
      return { player: { ...state.player, ...action.payload } };
    default:
      return;
  }
};

const engineEffects = (
  state: DAWState,
  engine: SynthEngine,
  action: EngineAction
): void => {
  const trackId = state.tracks.currentTrack;

  switch (action.type) {
    case 'PLAYER':
      return engine.setPlay(action.payload);
    case 'KEY_UP':
      return engine.endNote(action.payload);
    case 'KEY_DOWN':
      return engine.startNote(action.payload);
    case 'SET_TIME':
      return engine.setTime(action.payload);
    case 'SET_MIDI_FRAGMENT':
    case 'SET_TRACK_MIDI':
      return engine.setMidi(
        trackId,
        state.tracks.tracks[trackId].midi,
        state.midiFragments
      );
    case 'SET_CURRENT_TRACK':
      return engine.setTrack(action.payload);
    case 'SET_GAIN':
      return engine.setGain(action.id, action.payload);
    case 'SET_BPM':
      return engine.setBPM(action.payload);
    default:
      return;
  }
};

export const makeReducer =
  (engine: SynthEngine) => (state: DAWState, action: EngineAction) => {
    const stateChanges = dispatcher(state, action);

    if (stateChanges) {
      const track = state.tracks.tracks[state.tracks.currentTrack];
      engine.setPreset(track.preset);
    }

    const newState = stateChanges ? { ...state, ...stateChanges } : state;

    engineEffects(newState, engine, action);

    return newState;
  };
