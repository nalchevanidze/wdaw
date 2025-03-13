import { useEffect, useReducer, useRef, useState } from 'react';
import { SynthEngine } from '@wdaw/engine';
import { dawState } from '../state/defs';
import { loadState } from '../state/utils';
import { reducer } from '../state';
import { engineEffects } from '../state/engine-effects';
import { engineAPIMock } from '../context/state';

export const useEngine = () => {
  const ref = useRef<SynthEngine | undefined>(undefined);

  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBPM, setCurrentBPM] = useState(0);

  useEffect(() => {
    const engine = new SynthEngine();
    ref.current?.destroy();
    ref.current = engine;

    engine.addEventListener('isPlayingChanged', setIsPlaying);
    engine.addEventListener('timeChanged', setTime);
    engine.addEventListener('bpmChanged', setCurrentBPM);

    dispatch({ type: 'STORE/LOAD', payload: loadState() ?? state });

    return engine.destroy;
  }, []);

  const [state, dispatch] = useReducer((state, action) => {
    const newState = reducer(state, action);
    if (ref.current) {
      engineEffects(newState, ref.current, action);
    }
    return newState;
  }, dawState());

  return {
    ...state,
    time,
    currentBPM,
    isPlaying,
    dispatch,
    engine: ref.current  ?? engineAPIMock
  };
};
