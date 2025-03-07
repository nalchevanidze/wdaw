import { useContext } from 'react';
import { DawApiContext } from '../../context/state';

export const usePlayer = () => {
  const { isPlaying, bpm, time, engine, dispatch } = useContext(DawApiContext);

  const toggle = () => (isPlaying ? engine.pause() : engine.play());
  const stop = engine.stop;
  const setTime = engine.setTime;

  const save = () => dispatch({ type: 'STORE/SAVE' });

  const reset = () => dispatch({ type: 'STORE/RESET' });

  const setBPM = (value: number) =>
    dispatch({ type: 'PLAYER/SET_BPM', payload: value });

  return { isPlaying, bpm, time, setBPM, setTime, toggle, stop, save, reset };
};
