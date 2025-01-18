import * as React from 'react';
import { createContext, useEffect, useReducer } from 'react';
import { dawState, SynthEngine, EngineAction } from '../engine';
import { getPreset } from '../engine';
import { DAWState } from '../engine/state';

const dispatcher = (
  state: DAWState,
  action: EngineAction
): Partial<DAWState> | undefined => {
  const { tracks } = state;
  const track = tracks.tracks[tracks.currentTrack];

  switch (action.type) {
    case 'SET_TRACK':
      return {
        tracks: { ...tracks, currentTrack: action.payload }
      };
    case 'SET_SEQUENCE':
      track.preset.sequence = action.payload;
      return { tracks: tracks };
    case 'TOGGLE_PANEL':
      return action.id === 'wave'
        ? undefined
        : {
            [action.id]: {
              ...state[action.id],
              enabled: !state[action.id].enabled
            }
          };
    case 'SET_MIDI':
      return { midi: action.payload };
    case 'SET_ENVELOPE':
      return {
        envelopes: {
          ...envelopes,
          [action.id]: { ...envelopes[action.id], ...action.payload }
        }
      };
    case 'SET_WAVE':
      return { wave: { ...wave, [action.id]: action.payload } };
    case 'SET_FILTER':
      return { filter: { ...filter, [action.id]: action.payload } };
    case 'SET_PRESET':
      return getPreset(action.payload);
    case 'REFRESH':
      return { ...action.payload };
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
      engine.setPreset({ ...state, ...stateChanges });
    }

    engineEffects(engine, action);

    return stateChanges ? { ...state, ...stateChanges } : state;
  };

type ConfiguratorAPI = [DAWState, React.Dispatch<EngineAction>];

export const ConfiguratorContext = createContext<ConfiguratorAPI>([
  dawState(),
  () => undefined
]);

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
