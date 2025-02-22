import { useSelection } from './use-selection';
import { Area, IArea, Point } from '@wdaw/svg';
import { useTracks } from './use-tracks';
import { MidiRef } from '@wdaw/engine';
import { eq, idString } from '../../common/utils';

const toId = (t: MidiRef) =>
  idString([t.trackIndex, t.start, t.end, t.fragmentId]);

export type UITrack = MidiRef & { origin?: MidiRef };

export const useTrackEditor = () => {
  const { midiRefs, setMidis, setCurrent } = useTracks();
  const s = useSelection<UITrack>(midiRefs, toId);

  const move = (time: number) =>
    s.edit(({ start, end }) => ({
      start: start + time,
      end: end + time
    }));

  const scale = (time: number) =>
    s.edit(({ start, end }) => ({
      start: start,
      end: end + time
    }));

  const selectIn = (f: (i: UITrack) => IArea) => (area?: Area) =>
    s.selectWith((t) => area?.isOverlaping(f(t)) ?? false);

  const select = (t: UITrack) => {
    s.selectWith(eq(t));
    setCurrent(t.fragmentId);
  };

  const addAt = ({ x, y }: Point) =>
    s.add({ trackIndex: y, start: x, end: x + 64, fragmentId: 'bass' });

  return {
    tracks: s.all,
    clear: s.clear,
    sync: s.dispatcher(setMidis),
    move,
    scale,
    select,
    selectIn,
    remove: s.remove,
    addAt
  };
};
