import { useContext } from 'react';
import { DawApiContext } from '../../context/state';

export const usePlayer = () => {
  const [{ isPlaying, bpm, time }, dispatch] = useContext(DawApiContext);

  const setBPM = (value: number) =>
    dispatch({ type: 'PLAYER_SET_BPM', payload: value });

  const toggle = () => dispatch({ type: isPlaying ? 'PLAYER_PAUSE' : 'PLAYER_PLAY' });
  const stop = () => dispatch({ type: 'PLAYER_STOP' });
  const save = () => dispatch({ type: 'STORE_SAVE' });
  const reset = () => dispatch({ type: 'STORE_RESET' });

  const setTime = (t: number) => dispatch({ type: 'PLAYER_SET_TIME', payload: t });

  return { isPlaying, bpm, time, setBPM, setTime, toggle, stop, save, reset };
};
