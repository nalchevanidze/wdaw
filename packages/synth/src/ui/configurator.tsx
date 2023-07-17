import * as React from 'react';
import { createContext, useEffect, useReducer } from 'react';
import { DAWState, initialState, SynthEngine, EngineAction } from '../engine';

const reducer =
  (engine: SynthEngine) => (state: DAWState, action: EngineAction) => {
    const changes = engine.dispatch(action);

    return changes ? { ...state, ...changes } : state;
  };

type ConfiguratorAPI = [DAWState, React.Dispatch<EngineAction>];

export const ConfiguratorContext = createContext<ConfiguratorAPI>([
  initialState,
  () => undefined
]);

const Configurator: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const engine = React.useMemo(() => new SynthEngine(initialState), []);
  const [config, dispatch] = useReducer(reducer(engine), initialState);

  useEffect(() => {
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
