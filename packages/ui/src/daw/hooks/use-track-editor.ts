import { useSelection } from './use-selection';
import { Area, IArea } from '@wdaw/svg';
import { idString } from '../../common/utils';
import { MidiID, UITrack, useTracks } from './use-tracks';

export const eqID = (m1: MidiID) => (s: UITrack) =>
  idString(m1) === idString(s.id);

const toId = (t: UITrack) => idString(t.id);
const toHash = (t: UITrack) =>
  idString([...t.id, t.start, t.end, t.fragmentId]);

export type TrackedTrack = UITrack & { origin?: UITrack };

const resolveTrack =
  (ls: TrackedTrack[]) =>
  ({ id, fragmentId, start, end }: TrackedTrack): UITrack => {
    const state = ls.find(eqID(id));

    return state
      ? { ...state, selected: Boolean(state.origin) }
      : { id, fragmentId, start, end };
  };

export const useTrackEditor = () => {
  const { tracks, setMidis, setCurrent } = useTracks();
  const s = useSelection<TrackedTrack>(tracks, toId, toHash);

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

  const select = (id: MidiID) => {
    s.selectWith(eqID(id));
    setCurrent(s.all.find(eqID(id))?.fragmentId);
  };

  const remove = (id: MidiID) => s.removeWith(eqID(id));

  return {
    tracks: tracks.map(resolveTrack(s.all)),
    clear: s.clear,
    sync: s.dispatcher(({ selected }) => setMidis(selected)),
    isSelected: (id: MidiID) => Boolean(s.selected.find(eqID(id))),
    move,
    scale,
    select,
    selectIn,
    remove
  };
};
