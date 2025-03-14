import { useEffect, useReducer, useRef, useState } from 'react';
import { SynthEngine } from '@wdaw/engine';
import { dawState } from '../state/defs';
import { loadState } from '../state/utils';
import { reducer } from '../state';
import { engineEffects } from '../state/engine-effects';

export const useEngine = () => {
  const ref = useRef<SynthEngine | undefined>(undefined);

  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBPM, setCurrentBPM] = useState(0);

  useEffect(() => {
    const engine = new SynthEngine();
    ref.current?.destroy();
    ref.current = engine;

    engine.addEventListener('changed/isPlaying', setIsPlaying);
    engine.addEventListener('changed/time', setTime);
    engine.addEventListener('changed/bpm', setCurrentBPM);

    dispatch({ type: 'STORE/LOAD', payload: loadState() ?? state });

    return engine.destroy;
  }, []);

  const [state, dispatch] = useReducer((state, action) => {
    const newState = reducer(state, action);
    engineEffects(newState, action, ref.current);
    return newState;
  }, dawState());

  return {
    ...state,
    time,
    currentBPM,
    isPlaying,
    dispatch,
    engine: ref.current
  };
};
