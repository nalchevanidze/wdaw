import { useEffect, useReducer, useState } from 'react';
import { SynthEngine } from '@wdaw/engine';
import { DAWState, EngineAction } from '../state/types';
import { dawState } from '../state/defs';

type Reducer = (state: DAWState, action: EngineAction) => DAWState;

export const useEngine = (makeReducer: (e: SynthEngine) => Reducer) => {
  const [reducerState, setReducerState] = useState<{ reducer: Reducer }>({
    reducer: (a, _) => a
  });

  const isPlayingChanged = (payload: boolean) =>
    dispatch({ type: 'REFRESH_IS_PLAYING', payload });

  const timeChanged = (payload: number) =>
    dispatch({ type: 'REFRESH_TIME', payload });

  useEffect(() => {
    const engine = new SynthEngine();
    engine.setTracks(state);
    engine.setBPM(state.bpm);

    engine.addEventListener('isPlayingChanged', isPlayingChanged);
    engine.addEventListener('timeChanged', timeChanged);

    setReducerState({ reducer: makeReducer(engine) });
    return () => engine.destroy();
  }, [makeReducer]);

  const [state, dispatch] = useReducer(reducerState.reducer, dawState());

  return [state, dispatch] as const;
};
