import * as React from 'react';
import { createContext, useEffect, useReducer } from 'react';
import { DAWState, initialState, SynthEngine, EngineAction } from '../engine';
import { getPreset } from '../engine/state/state';

const dispatcher = (
  state: DAWState,
  action: EngineAction
): Partial<DAWState> | undefined => {
  const { envelopes, wave, filter } = state;
  switch (action.type) {
    case 'PLAYER': {
      const isPlaying = action.payload === 'play';
      return action.payload === 'stop'
        ? { isPlaying, time: 0, notes: [] }
        : { isPlaying };
    }
    case 'SET_TIME':
      return { time: action.payload };
    case 'SET_APR':
      return { sequence: action.payload };
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

const reducer =
  (engine: SynthEngine) => (state: DAWState, action: EngineAction) => {
    const stateChanges = dispatcher(state, action);

    if (stateChanges) {
      engine.setPreset({ ...state, ...stateChanges });
    }

    engine.dispatch(action);

    return stateChanges ? { ...state, ...stateChanges } : state;
  };

type ConfiguratorAPI = [DAWState, React.Dispatch<EngineAction>];

export const ConfiguratorContext = createContext<ConfiguratorAPI>([
  initialState,
  () => undefined
]);

const Configurator: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const engine = React.useMemo(() => new SynthEngine(), []);
  const [config, dispatch] = useReducer(reducer(engine), initialState);

  useEffect(() => {
    dispatch({ type: 'SET_MIDI', payload: config.midi });
    engine.onChange = (payload) => dispatch({ type: 'REFRESH', payload });

    return () => engine.destroy();
  }, []);

  return (
    <ConfiguratorContext.Provider value={[config, dispatch]}>
      {children}
    </ConfiguratorContext.Provider>
  );
};

export { Configurator };
