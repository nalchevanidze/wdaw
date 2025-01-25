import { useContext } from 'react';
import { ConfiguratorContext } from '../configurator';
import { NOTE_SIZE, NOTE_STEP } from '../common/defs';


export const useTime = () => {
  const [{ player, tracks }] = useContext(ConfiguratorContext);
  const midi = tracks.tracks[tracks.currentTrack].midi;
  const loopSize = (midi.loop[1] - midi.loop[0]) * NOTE_SIZE;
  const start = midi.start * NOTE_SIZE;
  const end = midi.end * NOTE_SIZE;
  const t = player.time;
  const loopStart = midi.loop[0] * NOTE_SIZE;
  const offset = start % loopSize;

  const time =
    t < start || t > end
      ? 0
      : (loopStart - offset + (t % loopSize)) * NOTE_STEP;

  return { time, loop: midi.loop, end: midi.end * NOTE_SIZE };
};
