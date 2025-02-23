import { useSelection } from './use-selection';
import { Area, IArea, Point } from '@wdaw/svg';
import { useTracks } from './use-tracks';
import { makeId, MidiRef } from '@wdaw/engine';
import { idString } from '../../common/utils';

const toId = (t: MidiRef) =>
  idString([t.trackIndex, t.start, t.end, t.fragmentId]);

export type UITrack = MidiRef & { origin?: MidiRef };

export const useTrackEditor = () => {
  const { midiRefs, setMidis, setCurrent, tracks } = useTracks();
  const { all, edit, add, clear, sync, select, selectIn, remove } =
    useSelection<UITrack>(midiRefs, toId, setMidis);

  const move = (moveX: number, moveY: number) =>
    edit(({ start, end, trackIndex }) => ({
      start: Math.max(start + moveX, 0),
      end: end + moveX,
      trackIndex: Math.min(tracks.length - 1, Math.max(trackIndex + moveY, 0))
    }));

  const scale = (time: number) =>
    edit(({ start, end }) => ({
      start: start,
      end: end + time
    }));

  const addAt = ({ x, y }: Point) =>
    add({
      id: makeId(),
      trackIndex: y,
      start: x,
      end: x + 64,
      fragmentId: 'bass'
    });

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
