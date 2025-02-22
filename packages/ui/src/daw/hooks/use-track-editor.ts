import { useSelection } from './use-selection';
import { Area, IArea, Point } from '@wdaw/svg';
import { UITrack, useTracks } from './use-tracks';
import { MidiRef } from '@wdaw/engine';
import { eq, idString } from '../../common/utils';

const toId = (t: MidiRef) =>
  idString([t.trackIndex, t.start, t.end, t.fragmentId]);

export type TrackedTrack = UITrack & { origin?: UITrack };

export const useTrackEditor = () => {
  const { tracks, setMidis, setCurrent } = useTracks();
  const s = useSelection<TrackedTrack>(tracks, toId);

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

  const selectIn = (f: (i: TrackedTrack) => IArea) => (area?: Area) =>
    s.selectWith((t) => area?.isOverlaping(f(t)) ?? false);

  const select = (t: UITrack) => {
    s.selectWith(eq(t));
    setCurrent(s.all.find(eq(t))?.fragmentId);
  };

  const remove = (t: UITrack) => s.removeWith(eq(t));

  const addAt = ({ x, y }: Point) =>
    s.add({ trackIndex: y, start: x, end: x + 64, fragmentId: 'bass' });

  return {
    tracks: s.all,
    clear: s.clear,
    sync: s.dispatcher(setMidis),
    isSelected: (t: UITrack) => Boolean(s.selected.find(eq(t))),
    move,
    scale,
    select,
    selectIn,
    remove,
    addAt
  };
};
