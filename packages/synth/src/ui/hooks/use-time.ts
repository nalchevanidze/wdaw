import { useContext } from 'react';
import { ConfiguratorContext } from '../configurator';
import { NOTE_SIZE } from '../common/defs';

export const TIME_SIZE = 8;

export const useTime = () => {
  const [{ player, tracks }] = useContext(ConfiguratorContext);

  const midi = tracks.tracks[tracks.currentTrack].midi;
  const loopSize = (midi.loop[1] - midi.loop[0]) * TIME_SIZE;
  const time =
    ((player.time < midi.start * TIME_SIZE
      ? 0
      : midi.loop[0] * TIME_SIZE + (player.time % loopSize)) *
      NOTE_SIZE) /
    2;
  return { time, loop: midi.loop, end: midi.end * NOTE_SIZE };
};
