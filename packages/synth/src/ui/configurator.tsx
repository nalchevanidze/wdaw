import * as React from 'react';
import { createContext } from 'react';
import { dawState, SynthEngine, EngineAction } from '../engine';
import { getPreset } from '../engine';
import { DAWState } from '../engine/state';
import { NamedPreset, TrackState } from '../engine/state/state';
import { useEngine } from './hooks/use-engine';
import { DawDispatch } from './types';

const mapCurrentTrack = (state: DAWState, f: (a: TrackState) => TrackState) =>
  mapTrack(state.tracks.currentTrack, state, f);

const mapTrack = (
  target: number,
  { tracks: { tracks, currentTrack } }: DAWState,
  f: (a: TrackState) => TrackState
) => ({
  tracks: {
    currentTrack: currentTrack,
    tracks: tracks.map((t, i) => (target === i ? f(t) : t))
  }
});

const mapPreset = (
  state: DAWState,
  f: (a: NamedPreset) => Partial<NamedPreset>
) =>
  mapCurrentTrack(state, ({ preset, ...rest }) => ({
    ...rest,
    preset: { ...preset, ...f(preset) }
  }));

const dispatcher = (
  state: DAWState,
  action: EngineAction
): Partial<DAWState> | undefined => {
  switch (action.type) {
    case 'SET_TRACK':
      return {
        tracks: { ...state.tracks, currentTrack: action.payload }
      };
    case 'SET_BPM':
      return {
        bpm: action.payload
      };
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
    case 'SET_MIDI':
      return mapTrack(action.id, state, ({ midi, ...rest }) => ({
        ...rest,
        midi: { ...midi, ...action.payload }
      }));
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
      return mapPreset(state, () => getPreset(action.payload));
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
  switch (action.type) {
    case 'PLAYER':
      return engine.setPlay(action.payload);
    case 'KEY_UP':
      return engine.endNote(action.payload);
    case 'KEY_DOWN':
      return engine.startNote(action.payload);
    case 'SET_TIME':
      return engine.setTime(action.payload);
    case 'SET_MIDI':
      return engine.setMidi(action.id, state.tracks.tracks[action.id].midi);
    case 'SET_TRACK':
      return engine.setTrack(action.payload);
    case 'SET_GAIN':
      return engine.setGain(action.id, action.payload);
    case 'SET_BPM':
      return engine.setBPM(action.payload);
    default:
      return;
  }
};

const makeReducer =
  (engine: SynthEngine) => (state: DAWState, action: EngineAction) => {
    const stateChanges = dispatcher(state, action);

    if (stateChanges) {
      const track = state.tracks.tracks[state.tracks.currentTrack];
      engine.setPreset(track.preset);
    }

    const newState = stateChanges ? { ...state, ...stateChanges } : state;

    engineEffects(newState, engine, action);

    return stateChanges ? { ...state, ...stateChanges } : state;
  };

type ConfiguratorAPI = [DAWState, DawDispatch];

export const ConfiguratorContext = createContext<ConfiguratorAPI>([
  dawState(),
  () => undefined
]);

const Configurator: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [state, dispatch] = useEngine(makeReducer);

  return (
    <ConfiguratorContext.Provider value={[state, dispatch]}>
      {children}
    </ConfiguratorContext.Provider>
  );
};

export { Configurator };
