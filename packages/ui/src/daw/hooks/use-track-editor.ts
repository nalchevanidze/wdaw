import { useSelection } from './use-selection';
import { Area, IArea, Point } from '@wdaw/svg';
import { useTracks } from './use-tracks';
import { makeMidiRef, MidiRef } from '@wdaw/engine';
import { idString } from '../../common/utils';

const toId = (t: MidiRef) =>
  idString([t.trackId, t.start, t.end, t.fragmentId ?? 'undefined']);

export type UITrack = MidiRef & { origin?: MidiRef };

export const useTrackEditor = () => {
  const { midiRefs, setMidis, setCurrent, tracks } = useTracks();
  const { all, edit, add, clear, sync, select, selectIn, remove } =
    useSelection<UITrack>(midiRefs, toId, setMidis);

  const move = (moveX: number, moveY: number) =>
    edit(({ start, end, trackId }) => ({
      start: Math.max(start + moveX, 0),
      end: end + moveX,
      trackId: Math.min(tracks.length - 1, Math.max(trackId + moveY, 0))
    }));

  const scale = (time: number) =>
    edit(({ start, end }) => ({
      start: start,
      end: end + time
    }));

  const addAt = ({ x, y }: Point) =>
    add(makeMidiRef({ trackId: y, start: x, end: x + 64 }));

  return {
    tracks: all,
    clear,
    sync,
    move,
    scale,
    select,
    setCurrent,
    selectIn,
    remove,
    addAt
  };
};
