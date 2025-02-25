import { useEffect, useReducer, useRef } from 'react';
import { SynthEngine } from '@wdaw/engine';
import { DAWState, EngineAction } from '../state/types';
import { dawState } from '../state/defs';
import { loadState } from '../state/utils';

type Reducer = (state: DAWState, action: EngineAction) => DAWState;

export const useEngine = (makeReducer: (e: SynthEngine) => Reducer) => {
  const ref = useRef<Reducer>((a) => a);

  const isPlayingChanged = (payload: boolean) =>
    dispatch({ type: 'ENGINE_EVENT_IS_PLAYING_CHANGED', payload });

  const timeChanged = (payload: number) =>
    dispatch({ type: 'ENGINE_EVENT_TIME_CHANGED', payload });

  useEffect(() => {
    const engine = new SynthEngine();
    engine.addEventListener('isPlayingChanged', isPlayingChanged);
    engine.addEventListener('timeChanged', timeChanged);
    
    ref.current = makeReducer(engine);

    dispatch({ type: 'STORE/LOAD', payload: loadState() ?? dawState() });

    return () => engine.destroy();
  }, [makeReducer]);

  const [state, dispatch] = useReducer(ref.current, dawState());

  return [state, dispatch] as const;
};
