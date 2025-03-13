import { useContext } from 'react';
import { DawApiContext } from '../../context/state';
import { ValueController } from '@wdaw/engine';

const identity = () => undefined;

export const usePlayer = () => {
  const { isPlaying, bpm, currentBPM, time, engine, dispatch } =
    useContext(DawApiContext);

  const toggle = (isPlaying ? engine?.pause : engine?.play) ?? identity;
  const stop = engine?.stop ?? identity;
  const setTime = engine?.setTime ?? identity;

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
