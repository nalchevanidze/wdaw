import { useContext } from 'react';
import { ConfiguratorContext } from '../configurator';
import { NOTE_SIZE } from '../common/defs';

export const useTime = () => {
  const [{ player, tracks }] = useContext(ConfiguratorContext);

  const midi = tracks.tracks[tracks.currentTrack].midi;
  const loopSize = (midi.loop[1] - midi.loop[0]) * 8;
  const time =
    ((player.time < midi.start * 8
      ? 0
      : midi.loop[0] * 8 + (player.time % loopSize)) *
      NOTE_SIZE) /
    2;
  return { time, loop: midi.loop };
};
