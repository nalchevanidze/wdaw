import { useEffect, useReducer, useState } from 'react';
import { SynthEngine } from '@wdaw/engine';
import { DAWState, EngineAction } from '../state/types';
import { dawState } from '../state/defs';

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
