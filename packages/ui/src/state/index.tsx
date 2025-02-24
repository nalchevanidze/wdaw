import { makeFragment, SynthEngine } from '@wdaw/engine';
import {
  deleteState,
  mapPreset,
  mapTrack,
  saveState,
  setMidiFragment
} from './utils';
import { DAWState, EngineAction } from './types';
import { dawState } from './defs';

const dispatcher = (
  state: DAWState,
  action: EngineAction
): Partial<DAWState> | undefined => {
  const { currentTrack, tracks, notes, midiRefs, midiFragments, presets } =
    state;
  const track = tracks[currentTrack];
  const { presetId } = track;
  const fragmentCount = Object.keys(midiFragments).length;

  switch (action.type) {
    // PRESETS
    case 'PRESET_SET_SEQUENCE':
      return mapPreset(presetId, state, () => ({ sequence: action.payload }));
    case 'PRESET_TOGGLE_MODULE':
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
    case 'PRESET_SET_ENVELOPE':
      return mapPreset(presetId, state, ({ envelopes }) => ({
        envelopes: {
          ...envelopes,
          [action.id]: { ...envelopes[action.id], ...action.payload }
        }
      }));
    case 'PRESET_SET_WAVE':
      return mapPreset(presetId, state, ({ wave }) => ({
        wave: { ...wave, [action.id]: action.payload }
      }));
    case 'PRESET_SET_FILTER':
      return mapPreset(presetId, state, ({ filter }) => ({
        filter: { ...filter, [action.id]: action.payload }
      }));
    // MidiRef/Fragments
    case 'SET_CURRENT_FRAGMENT':
      return { currentFragment: action.payload };
    case 'SET_MIDI_REFS':
      return { midiRefs: action.payload };
    case 'SET_MIDI_REF':
      return {
        midiRefs: midiRefs.map((m) =>
          m.id === action.id ? { ...m, ...action.payload } : m
        )
      };
    case 'SET_MIDI_FRAGMENT':
      return setMidiFragment(action.id, state, action.payload);
    case 'NEW_FRAGMENT': {
      const { id, ...fragment } = makeFragment(`Fragment ${fragmentCount + 1}`);
      return {
        currentFragment: id,
        midiFragments: { ...midiFragments, [id]: fragment }
      };
    }
    // Tracks
    case 'SET_CURRENT_TRACK':
      return { currentTrack: action.payload };
    case 'SET_TRACK':
      return mapTrack(action.id, state, (t) => ({ ...t, ...action.payload }));
    case 'SET_PRESET':
      return mapTrack(currentTrack, state, () => ({
        presetId: action.payload
      }));
    case 'NEW_TRACK':
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
    case 'SET_BPM':
      return { bpm: action.payload };
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
    case 'SET_TRACK':
      return action.payload.gain
        ? engine.setGain(action.id, action.payload.gain)
        : undefined;
    case 'SET_BPM':
      return engine.setBPM(action.payload);
    case 'PRESET_SET_SEQUENCE':
    case 'PRESET_TOGGLE_MODULE':
    case 'PRESET_SET_ENVELOPE':
    case 'PRESET_SET_WAVE':
    case 'PRESET_SET_FILTER':
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
