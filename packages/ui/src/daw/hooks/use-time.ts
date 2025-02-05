import { useContext } from 'react';
import { DawApiContext } from '../../context/state';

export const useTime = () => {
  const [
    {
      player: { time },
      tracks
    }
  ] = useContext(DawApiContext);
  const { start, end, loop } = tracks.tracks[tracks.currentTrack].midi;
  const [loopStart, loopEnd] = loop;
  const size = loopEnd - loopStart;

  return time < start || time > end
    ? 0
    : loopStart - (start % size) + (time % size);
};
