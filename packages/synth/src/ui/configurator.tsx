import * as React from 'react';
import { createContext, useEffect, useReducer } from 'react';
import { dawState, SynthEngine, EngineAction } from '../engine';
import { getPreset } from '../engine';
import { DAWState } from '../engine/state';
import { NamedPreset, TrackState } from '../engine/state/state';
import { Preset } from '../engine/common/types';

const mapCurrentTrack = (
  { tracks: { tracks, currentTrack } }: DAWState,
  f: (a: TrackState) => TrackState
) => {
  return {
    tracks: {
      currentTrack: currentTrack,
      tracks: tracks.map((t) => f(t))
    }
  };
};

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
  const { tracks } = state;

  switch (action.type) {
    case 'SET_TRACK':
      return {
        tracks: { ...tracks, currentTrack: action.payload }
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
      return mapCurrentTrack(state, ({ midi, ...rest }) => ({
        ...rest,
        midi: action.payload
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

const engineEffects = (engine: SynthEngine, action: EngineAction): void => {
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
      return engine.setMidi(action.payload);
    case 'SET_TRACK':
      return engine.setTrack(action.payload);
    default:
      return;
  }
};

const reducer =
  (engine: SynthEngine) => (state: DAWState, action: EngineAction) => {
    const stateChanges = dispatcher(state, action);

    if (stateChanges) {
      const track = state.tracks.tracks[state.tracks.currentTrack];
      engine.setPreset(track.preset);
    }

    engineEffects(engine, action);

    return stateChanges ? { ...state, ...stateChanges } : state;
  };

type ConfiguratorAPI = [DAWState, React.Dispatch<EngineAction>];

export const ConfiguratorContext = createContext<ConfiguratorAPI>([
  dawState(),
  () => undefined
]);

export const useTrack = (): [TrackState, React.Dispatch<EngineAction>] => {
  const [
    {
      tracks: { currentTrack, tracks }
    },
    dispatch
  ] = React.useContext(ConfiguratorContext);

  const track = tracks[currentTrack];
  return [track, dispatch];
};

export const usePreset = (): [NamedPreset, React.Dispatch<EngineAction>] => {
  const [
    {
      tracks: { currentTrack, tracks }
    },
    dispatch
  ] = React.useContext(ConfiguratorContext);

  const track = tracks[currentTrack];
  return [track.preset, dispatch];
};

const Configurator: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const engine = React.useMemo(() => new SynthEngine(), []);
  const [config, dispatch] = useReducer(reducer(engine), dawState());

  useEffect(() => {
    engine.setTracks(config.tracks);
    engine.setMidiCallback((payload) => dispatch({ type: 'REFRESH', payload }));

    return () => engine.destroy();
  }, []);

  return (
    <ConfiguratorContext.Provider value={[config, dispatch]}>
      {children}
    </ConfiguratorContext.Provider>
  );
};

export { Configurator };
