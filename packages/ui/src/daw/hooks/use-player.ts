import { useContext } from 'react';
import { DawApiContext } from '../../context/state';
import { ValueController } from '@wdaw/engine';

export const usePlayer = () => {
  const { isPlaying, bpm, currentBPM, time, engine, dispatch } =
    useContext(DawApiContext);

  const toggle = () => (isPlaying ? engine.pause() : engine.play());
  const stop = engine.stop;
  const setTime = engine.setTime;

  const save = () => dispatch({ type: 'STORE/SAVE' });

  const reset = () => dispatch({ type: 'STORE/RESET' });

  const setBPM = (value: ValueController) =>
    dispatch({ type: 'PLAYER/SET_BPM', payload: value });


  return {
    isPlaying,
    currentBPM,
    bpm,
    time,
    setBPM,
    setTime,
    toggle,
    stop,
    save,
    reset
  };
};
