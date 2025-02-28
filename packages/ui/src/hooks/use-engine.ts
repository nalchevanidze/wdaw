import { useEffect, useReducer, useRef, useState } from 'react';
import { SynthEngine } from '@wdaw/engine';
import { State, EngineAction } from '../state/types';
import { dawState } from '../state/defs';
import { loadState } from '../state/utils';

type Reducer = (state: State, action: EngineAction) => State;

export const useEngine = (makeReducer: (e: SynthEngine) => Reducer) => {
  const ref = useRef<Reducer>((a) => a);

  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const engine = new SynthEngine();
    engine.addEventListener('isPlayingChanged', setIsPlaying);
    engine.addEventListener('timeChanged', setTime);

    ref.current = makeReducer(engine);

    dispatch({ type: 'STORE/LOAD', payload: loadState() ?? state });

    return engine.destroy;
  }, [makeReducer]);

  const [state, dispatch] = useReducer(ref.current, dawState());

  return [{ ...state, time, isPlaying }, dispatch] as const;
};
