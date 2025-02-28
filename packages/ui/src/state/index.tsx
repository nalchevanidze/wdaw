import { makeFragment, makePreset, SynthEngine } from '@wdaw/engine';
import {
  deleteState,
  mapPreset,
  mapTrack,
  saveState,
  setMidiFragment
} from './utils';
import { State, EngineAction } from './types';
import { dawState } from './defs';

const dispatcher = (
  state: State,
  action: EngineAction
): Partial<State> | undefined => {
  const { currentTrack, tracks, midiRefs, midiFragments, presets } = state;
  const fragmentCount = Object.keys(midiFragments).length;
  const setPreset = mapPreset(tracks[currentTrack].presetId, state);
  const setPresetId = (trackId: number, presetId: string) =>
    mapTrack(trackId, state, () => ({ presetId }));

  switch (action.type) {
    // PRESET
    case 'PRESET/SET_SEQUENCE':
      return setPreset(() => ({ sequence: action.payload }));
    case 'PRESET/TOGGLE_MODULE':
      return setPreset((preset) => ({
        [action.id]: {
          ...preset[action.id],
          enabled: !preset[action.id].enabled
        }
      }));
    case 'PRESET/SET_ENVELOPE':
      return setPreset(({ envelopes }) => ({
        envelopes: {
          ...envelopes,
          [action.id]: { ...envelopes[action.id], ...action.payload }
        }
      }));
    case 'PRESET/SET_WAVE':
      return setPreset(({ wave }) => ({
        wave: { ...wave, [action.id]: action.payload }
      }));
    case 'PRESET/SET_FILTER':
      return setPreset(({ filter }) => ({
        filter: { ...filter, [action.id]: action.payload }
      }));
    case 'PRESET/NEW_PRESET': {
      const p = makePreset('new preset');
      return {
        ...setPresetId(action.trackId, p.id),
        presets: { ...presets, [p.id]: p }
      };
    }
    case 'PRESET/ASSIGN_TO_TRACK':
      return setPresetId(action.trackId, action.presetId);
    // MIDI
    case 'MIDI/SET_CURRENT_FRAGMENT':
      return { currentFragment: action.payload };
    case 'MIDI/SET_MIDI_REFS':
      return { midiRefs: action.payload };
    case 'MIDI/SET_MIDI_REF':
      return {
        midiRefs: midiRefs.map((m) =>
          m.id === action.id ? { ...m, ...action.payload } : m
        )
      };
    case 'MIDI/SET_FRAGMENT':
      return setMidiFragment(action.id, state, action.payload);
    case 'MIDI/NEW_FRAGMENT': {
      const fragment = makeFragment(`Fragment ${fragmentCount + 1}`);
      return {
        currentFragment: fragment.id,
        midiFragments: { ...midiFragments, [fragment.id]: fragment }
      };
    }
    // TRACK
    case 'TRACK/SET_CURRENT':
      return { currentTrack: action.payload };
    case 'TRACK/SET_TRACK':
      return mapTrack(action.id, state, (t) => ({ ...t, ...action.payload }));
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
      return saveState(state);
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

const engineEffects = (
  { tracks, midiFragments, currentTrack, presets, midiRefs }: State,
  engine: SynthEngine,
  action: EngineAction
): void => {
  const track = tracks[currentTrack];
  const preset = presets[track.presetId];

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
      return engine.setPreset(currentTrack, preset);
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
    const newState = stateChanges ? { ...state, ...stateChanges } : state;

    engineEffects(newState, engine, action);

    return newState;
  };
