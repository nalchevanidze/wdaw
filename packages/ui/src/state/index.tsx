import { makeFragment, makePreset, SynthEngine } from '@wdaw/engine';
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
  const fragmentCount = Object.keys(midiFragments).length;
  const setPreset = mapPreset(track.presetId, state);
  const setPresetId = (id: string) =>
    mapTrack(currentTrack, state, () => ({ presetId: id }));

  switch (action.type) {
    // PRESET
    case 'PRESET_SET_SEQUENCE':
      return setPreset(() => ({ sequence: action.payload }));
    case 'PRESET_TOGGLE_MODULE':
      return setPreset((preset) => ({
        [action.id]: {
          ...preset[action.id],
          enabled: !preset[action.id].enabled
        }
      }));
    case 'PRESET_SET_ENVELOPE':
      return setPreset(({ envelopes }) => ({
        envelopes: {
          ...envelopes,
          [action.id]: { ...envelopes[action.id], ...action.payload }
        }
      }));
    case 'PRESET_SET_WAVE':
      return setPreset(({ wave }) => ({
        wave: { ...wave, [action.id]: action.payload }
      }));
    case 'PRESET_SET_FILTER':
      return setPreset(({ filter }) => ({
        filter: { ...filter, [action.id]: action.payload }
      }));
    case 'PRESET_NEW_PRESET': {
      const preset = makePreset('new preset');
      return {
        ...setPresetId(preset.id),
        presets: { ...presets, [preset.id]: preset }
      };
    }
    // MIDI
    case 'MIDI_SET_CURRENT_FRAGMENT':
      return { currentFragment: action.payload };
    case 'MIDI_SET_MIDI_REFS':
      return { midiRefs: action.payload };
    case 'MIDI_SET_MIDI_REF':
      return {
        midiRefs: midiRefs.map((m) =>
          m.id === action.id ? { ...m, ...action.payload } : m
        )
      };
    case 'MIDI_SET_FRAGMENT':
      return setMidiFragment(action.id, state, action.payload);
    case 'MIDI_NEW_FRAGMENT': {
      const fragment = makeFragment(`Fragment ${fragmentCount + 1}`);
      return {
        currentFragment: fragment.id,
        midiFragments: { ...midiFragments, [fragment.id]: fragment }
      };
    }
    // TRACK
    case 'TRACK_SET_CURRENT':
      return { currentTrack: action.payload };
    case 'TRACK_SET_TRACK':
      return mapTrack(action.id, state, (t) => ({ ...t, ...action.payload }));
    case 'TRACK_SET_PRESET':
      return setPresetId(action.payload);
    case 'TRACK_NEW_TRACK':
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
    case 'PLAYER_SET_BPM':
      return { bpm: action.payload };
    case 'ENGINE_EVENT_TIME_CHANGED':
      return { time: action.payload };
    case 'ENGINE_EVENT_IS_PLAYING_CHANGED':
      return { isPlaying: action.payload };
    // Keyboard
    case 'KEYBOARD_KEY_DOWN':
      return { notes: [...notes, action.payload] };
    case 'KEYBOARD_KEY_UP':
      return { notes: [action.payload].filter((n) => n !== action.payload) };
    // STORE
    case 'STORE_SAVE':
      return saveState({ ...state, time: 0, isPlaying: false });
    case 'STORE_RESET': {
      deleteState();
      return dawState();
    }
    case 'STORE_LOAD':
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
    // Player
    case 'PLAYER_PLAY':
      return engine.play();
    case 'PLAYER_PAUSE':
      return engine.pause();
    case 'PLAYER_STOP':
      return engine.stop();
    case 'PLAYER_SET_TIME':
      return engine.setTime(action.payload);
    case 'PLAYER_SET_BPM':
      return engine.setBPM(action.payload);
    // Keyboard
    case 'KEYBOARD_KEY_UP':
      return engine.endNote(currentTrack, action.payload);
    case 'KEYBOARD_KEY_DOWN':
      return engine.startNote(currentTrack, action.payload);
    // Midi
    case 'MIDI_SET_MIDI_REF':
    case 'MIDI_SET_FRAGMENT':
    case 'MIDI_SET_MIDI_REFS':
      return engine.setMidis(midiRefs, midiFragments);
    // Track
    case 'TRACK_SET_TRACK':
      return action.payload.gain
        ? engine.setGain(action.id, action.payload.gain)
        : undefined;
    case 'TRACK_NEW_TRACK':
      engine.setTracks({ tracks, midiFragments, presets, midiRefs });
      return;
    // Preset
    case 'PRESET_SET_SEQUENCE':
    case 'PRESET_TOGGLE_MODULE':
    case 'PRESET_SET_ENVELOPE':
    case 'PRESET_SET_WAVE':
    case 'PRESET_SET_FILTER':
    case 'TRACK_SET_PRESET':
      return engine.setPreset(currentTrack, preset);
    // Store
    case 'STORE_LOAD':
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
