import { SynthEngine, DAWState } from '@wdaw/engine';
import { mapPreset, mapTrack, setMidiFragment } from './utils';
import { EngineAction } from './types';

const dispatcher = (
  state: DAWState,
  action: EngineAction
): Partial<DAWState> | undefined => {
  const { currentTrack, tracks } = state;
  const track = tracks[currentTrack];
  const { presetId } = track;

  switch (action.type) {
    case 'SET_CURRENT_TRACK':
      return { currentTrack: action.payload };
    case 'SET_CURRENT_FRAGMENT':
      return { currentFragment: action.payload };
    case 'SET_BPM':
      return { bpm: action.payload };
    case 'SET_SEQUENCE':
      return mapPreset(presetId, state, () => ({ sequence: action.payload }));
    case 'TOGGLE_PANEL':
      return mapPreset(presetId, state, (preset) =>
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
      return mapTrack(action.id[0], state, ({ midi }) => ({
        midi: midi.map((m, i) =>
          i === action.id[1] ? { ...m, ...action.payload } : m
        )
      }));
    case 'SET_MIDI_FRAGMENT':
      return setMidiFragment(action.id, state, action.payload);
    case 'SET_GAIN':
      return mapTrack(action.id, state, () => ({
        gain: action.payload
      }));
    case 'SET_ENVELOPE':
      return mapPreset(presetId, state, ({ envelopes }) => ({
        envelopes: {
          ...envelopes,
          [action.id]: { ...envelopes[action.id], ...action.payload }
        }
      }));
    case 'SET_WAVE':
      return mapPreset(presetId, state, ({ wave }) => ({
        wave: { ...wave, [action.id]: action.payload }
      }));
    case 'SET_FILTER':
      return mapPreset(presetId, state, ({ filter }) => ({
        filter: { ...filter, [action.id]: action.payload }
      }));
    case 'SET_PRESET':
      return mapTrack(currentTrack, state, () => ({
        presetId: action.payload
      }));
    case 'REFRESH':
      return { player: { ...state.player, ...action.payload } };
    default:
      return;
  }
};

const engineEffects = (
  { tracks, midiFragments, currentTrack, presets }: DAWState,
  engine: SynthEngine,
  action: EngineAction
): void => {
  const track = tracks[currentTrack];
  const preset = presets[track.presetId];

  switch (action.type) {
    case 'PLAYER':
      return engine.setPlay(action.payload);
    case 'KEY_UP':
      return engine.endNote(currentTrack, action.payload);
    case 'KEY_DOWN':
      return engine.startNote(currentTrack, action.payload);
    case 'SET_TIME':
      return engine.setTime(action.payload);
    case 'SET_MIDI_FRAGMENT':
    case 'SET_TRACK_MIDI':
      return tracks.forEach(({ midi }, i) =>
        engine.setMidi(i, midi, midiFragments)
      );
    case 'SET_CURRENT_TRACK':
      return engine.setTrack(action.payload);
    case 'SET_GAIN':
      return engine.setGain(action.id, action.payload);
    case 'SET_BPM':
      return engine.setBPM(action.payload);
    case 'SET_SEQUENCE':
    case 'TOGGLE_PANEL':
    case 'SET_ENVELOPE':
    case 'SET_WAVE':
    case 'SET_FILTER':
    case 'SET_PRESET':
      return engine.setPreset(currentTrack, preset);
  }
};

export const makeReducer =
  (engine: SynthEngine) => (state: DAWState, action: EngineAction) => {
    const stateChanges = dispatcher(state, action);
    const newState = stateChanges ? { ...state, ...stateChanges } : state;

    engineEffects(newState, engine, action);

    return newState;
  };
