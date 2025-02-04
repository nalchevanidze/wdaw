import { useContext } from 'react';
import { DawApiContext } from '../../context/state';

export const useTime = () => {
  const [{ player, tracks }] = useContext(DawApiContext);
  const { start, end, loop } = tracks.tracks[tracks.currentTrack].midi;
  const [loopStart, loopEnd] = loop;
  const size = loopEnd - loopStart;

  const offset = start % size;

  const time =
    player.time < start || player.time > end
      ? 0
      : loopStart - offset + (player.time % size);

  return time 
};
