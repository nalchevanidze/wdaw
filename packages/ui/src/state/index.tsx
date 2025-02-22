import { SynthEngine, TrackState } from '@wdaw/engine';
import {
  deleteState,
  mapPreset,
  mapTrack,
  mapTracks,
  saveState,
  setMidiFragment
} from './utils';
import { DAWState, EngineAction } from './types';
import { idString } from '../common/utils';
import { dawState } from './defs';

const dispatcher = (
  state: DAWState,
  action: EngineAction
): Partial<DAWState> | undefined => {
  const { currentTrack, tracks, notes, midiRefs, midiFragments } = state;
  const track = tracks[currentTrack];
  const { presetId } = track;

  switch (action.type) {
    case 'SET_CURRENT_TRACK':
      return { currentTrack: action.payload };
    case 'SET_CURRENT_FRAGMENT': {
      const exists = Boolean(midiFragments[action.payload]);

      return {
        currentFragment: action.payload,
        midiFragments: exists
          ? midiFragments
          : {
              ...midiFragments,
              [action.payload]: {
                notes: [],
                loop: [0, 64]
              }
            }
      };
    }
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
    case 'SET_MIDI_REFS':
      return { midiRefs: action.payload };
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
    case 'REFRESH_TIME':
      return { time: action.payload };
    case 'REFRESH_IS_PLAYING':
      return { isPlaying: action.payload };
    case 'KEY_DOWN':
      return { notes: [...notes, action.payload] };
    case 'KEY_UP':
      return { notes: [action.payload].filter((n) => n !== action.payload) };
    case 'SAVE':
      saveState({ ...state, time: 0, isPlaying: false });
      return;
    case 'NEW_TRACK':
      return {
        tracks: [
          ...tracks,
          {
            name: `track ${tracks.length + 5}`,
            gain: 1,
            presetId: 'prelude'
          }
        ]
      };
    case 'SET_MIDI_REF':
      return {
        midiRefs: midiRefs.map((ref) =>
          ref.trackIndex === action.id.trackIndex &&
          ref.start === action.id.start &&
          ref.end === action.id.end &&
          ref.fragmentId === action.id.fragmentId
            ? { ...ref, fragmentId: action.payload }
            : ref
        )
      };
    case 'RESET': {
      deleteState();
      return dawState();
    }
    case 'LOAD':
      return { ...action.payload };
    default:
      return;
  }
};

const engineEffects = (
  { tracks, midiFragments, currentTrack, presets, midiRefs }: DAWState,
  engine: SynthEngine,
  action: EngineAction
): void => {
  const track = tracks[currentTrack];
  const preset = presets[track.presetId];

  switch (action.type) {
    case 'PLAY':
      return engine.play();
    case 'PAUSE':
      return engine.pause();
    case 'STOP':
      return engine.stop();
    case 'KEY_UP':
      return engine.endNote(currentTrack, action.payload);
    case 'KEY_DOWN':
      return engine.startNote(currentTrack, action.payload);
    case 'SET_TIME':
      return engine.setTime(action.payload);
    case 'SET_MIDI_REF':
    case 'SET_MIDI_FRAGMENT':
    case 'SET_MIDI_REFS':
      return engine.setMidis(midiRefs, midiFragments);
    case 'SET_CURRENT_TRACK':
      return;
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
    case 'NEW_TRACK':
      engine.setTracks({ tracks, midiFragments, presets, midiRefs });
      return;
    case 'LOAD':
      engine.setTracks(action.payload);
      engine.setBPM(action.payload.bpm);
      return;
  }
};

export const makeReducer =
  (engine: SynthEngine) => (state: DAWState, action: EngineAction) => {
    const stateChanges = dispatcher(state, action);
    const newState = stateChanges ? { ...state, ...stateChanges } : state;

    engineEffects(newState, engine, action);

    return newState;
  };
