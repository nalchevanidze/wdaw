import { useContext } from 'react';
import { DawApiContext } from '../../context/state';

export const usePlayer = () => {
  const [{ isPlaying, bpm, time }, dispatch] = useContext(DawApiContext);

  const setBPM = (value: number) =>
    dispatch({ type: 'SET_BPM', payload: value });

  const toggle = () => dispatch({ type: isPlaying ? 'PAUSE' : 'PLAY' });
  const stop = () => dispatch({ type: 'STOP' });
  const save = () => dispatch({ type: 'SAVE' });

  const setTime = (t: number) => dispatch({ type: 'SET_TIME', payload: t });

  return { isPlaying, bpm, time, setBPM, setTime, toggle, stop, save };
};
