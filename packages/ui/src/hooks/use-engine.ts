import { useEffect, useReducer, useRef, useState } from 'react';
import { SynthEngine } from '@wdaw/engine';
import { State, EngineAction, KeyboardAPI } from '../state/types';
import { dawState } from '../state/defs';
import { loadState } from '../state/utils';
import { reducer } from '../state';
import { engineEffects } from '../state/engine-effects';

export const useEngine = () => {
  const ref = useRef<(s: State, a: EngineAction) => State>((a) => a);

  const keyboard = useRef<KeyboardAPI>({ startNote() {}, endNote() {} });

  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const engine = new SynthEngine();
    engine.addEventListener('isPlayingChanged', setIsPlaying);
    engine.addEventListener('timeChanged', setTime);

    keyboard.current = engine;

    ref.current = (state, action) => {
      const newState = reducer(state, action);
      engineEffects(newState, engine, action);
      return newState;
    };

    dispatch({ type: 'STORE/LOAD', payload: loadState() ?? state });

    return engine.destroy;
  }, []);

  const [state, dispatch] = useReducer(ref.current, dawState());

  return { ...state, time, isPlaying, dispatch, keyboard: keyboard.current };
};
