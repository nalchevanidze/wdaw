import { useEffect, useReducer, useRef, useState } from 'react';
import { SynthEngine } from '@wdaw/engine';
import { dawState } from '../state/defs';
import { loadState } from '../state/utils';
import { reducer } from '../state';
import { engineEffects } from '../state/engine-effects';

export const useEngine = () => {
  const ref = useRef<SynthEngine>(new SynthEngine());

  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBPM] = useState(0);

  useEffect(() => {
    const engine = new SynthEngine();
    ref.current.destroy();
    ref.current = engine;

    engine.addEventListener('isPlayingChanged', setIsPlaying);
    engine.addEventListener('timeChanged', setTime);
    engine.addEventListener('bpmChanged', setBPM);

    dispatch({ type: 'STORE/LOAD', payload: loadState() ?? state });

    return engine.destroy;
  }, []);

  const [state, dispatch] = useReducer((state, action) => {
    const newState = reducer(state, action);
    engineEffects(newState, ref.current, action);
    return newState;
  }, dawState());

  return { ...state, time, isPlaying, bpm, dispatch, engine: ref.current };
};
