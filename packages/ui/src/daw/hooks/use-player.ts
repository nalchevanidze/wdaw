import { useContext } from 'react';
import { DawApiContext } from '../../context/state';

export const usePlayer = () => {
  const [{ isPlaying, bpm, time }, dispatch] = useContext(DawApiContext);

  const setBPM = (value: number) =>
    dispatch({ type: 'SET_BPM', payload: value });

  const toggle = () => dispatch({ type: isPlaying ? 'PAUSE' : 'PLAY' });
  const stop = () => dispatch({ type: 'STOP' });

  return { isPlaying, bpm, time, setBPM, toggle, stop };
};
