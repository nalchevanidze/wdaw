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

export const useTrackEditor = () => {
  const { panels, tracks, setMidis, setCurrent } = useTracks();
  const s = useSelection<UITrack>(tracks, toId, toHash);

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

  const clear = () => {
    sync();
    s.clear();
  };

  const sync = s.dispatcher(({ selected }) => setMidis(selected));

  const selectIn = (f: (i: TrackedTrack) => IArea) => (area?: Area) =>
    s.selectWith((track) => area?.isOverlaping(f(track)) ?? false);

  const select = (id: MidiID) => {
    s.selectWith(eqID(id));

    const fid = s.all.find(eqID(id))?.fragmentId;

    if (fid) {
      setCurrent(fid);
    }
  };

  const isSelected = (id: MidiID) => Boolean(s.selected.find(eqID(id)));

  const tracksResult = tracks.map(({ id, fragmentId, start, end }): UITrack => {
    const state = (s.all as TrackedTrack[]).find(eqID(id)) ?? {
      id,
      fragmentId,
      start,
      end
    };

    return { selected: Boolean(state.origin), ...state };
  });

  return {
    panels,
    tracks: tracksResult,
    clear,
    move,
    scale,
    select,
    selectIn,
    isSelected,
    sync
  };
};
