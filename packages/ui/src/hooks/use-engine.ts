import { useEffect, useReducer, useState } from 'react';
import { dawState, DAWState, SynthEngine } from '@wdaw/engine';
import { EngineAction } from '../state/types';

type Reducer = (state: DAWState, action: EngineAction) => DAWState;

export const useEngine = (makeReducer: (e: SynthEngine) => Reducer) => {
  const [reducerState, setReducerState] = useState<{ reducer: Reducer }>({
    reducer: (a, _) => a
  });

  useEffect(() => {
    const engine = new SynthEngine();
    engine.setTracks(state);
    engine.setBPM(state.bpm);
    engine.setMidiCallback((payload) => dispatch({ type: 'REFRESH', payload }));
    setReducerState({ reducer: makeReducer(engine) });

    return () => engine.destroy();
  }, [makeReducer]);

  const [state, dispatch] = useReducer(reducerState.reducer, dawState());

  return [state, dispatch] as const;
};
