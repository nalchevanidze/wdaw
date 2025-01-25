import { useContext } from 'react';
import { ConfiguratorContext } from '../configurator';
import { NOTE_SIZE, SUB_QUARTER } from '../common/defs';

export const useTime = () => {
  const [{ player, tracks }] = useContext(ConfiguratorContext);
  const midi = tracks.tracks[tracks.currentTrack].midi;
  const loopSize = midi.loop[1] - midi.loop[0];
  const start = midi.start;
  const end = midi.end;
  const time = player.time / NOTE_SIZE;
  const loopStart = midi.loop[0];
  const offset = start % loopSize;

  const loopTime =
    time < start || time > end ? 0 : loopStart - offset + (time % loopSize);

  return {
    time: loopTime * SUB_QUARTER,
    loop: midi.loop,
    end: midi.end * NOTE_SIZE
  };
};
