import { useSelection } from './use-selection';
import { Area, IArea, Point } from '@wdaw/svg';
import { toId, toUITrack, UITrack, useTracks } from './use-tracks';

export const eqID = (m1: UITrack) => (s: UITrack) => m1.id === s.id;

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

  const select = (id: UITrack) => {
    s.selectWith(eqID(id));
    setCurrent(s.all.find(eqID(id))?.fragmentId);
  };

  const remove = (id: UITrack) => s.removeWith(eqID(id));

  const addAt = ({ x, y }: Point) =>
    s.add(
      toUITrack({ trackIndex: y, start: x, end: x + 64, fragmentId: 'bass' })
    );

  return {
    tracks: s.all,
    clear: s.clear,
    sync: s.dispatcher(setMidis),
    isSelected: (id: UITrack) => Boolean(s.selected.find(eqID(id))),
    move,
    scale,
    select,
    selectIn,
    remove,
    addAt
  };
};
