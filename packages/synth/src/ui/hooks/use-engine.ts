import { useEffect, useReducer, useState } from 'react';
import { dawState, DAWState, EngineAction, SynthEngine } from '../../engine';

type Reducer = (state: DAWState, action: EngineAction) => DAWState;

export const useEngine = (makeReducer: (e: SynthEngine) => Reducer) => {
  const [state, setState] = useState<{ reducer: Reducer }>({
    reducer: (a, _) => a
  });


  useEffect(() => {
    const engine = new SynthEngine();
    engine.setTracks(config.tracks);
    engine.setMidiCallback((payload) => dispatch({ type: 'REFRESH', payload }));
    setState({ reducer: makeReducer(engine) });

    return () => engine.destroy();
  }, [makeReducer]);

  const [config, dispatch] = useReducer(state.reducer, dawState());

  return [config, dispatch] as const;
};
