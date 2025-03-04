import { useSelection } from './use-selection';
import { Area, IArea, Point } from '@wdaw/svg';
import { useTracks } from './use-tracks';
import { makeMidiRef, MidiRef } from '@wdaw/engine';

type Ops = {
  accuracyX(i: number): number;
  accuracyY(i: number): number;
  to(_: Point): Point;
};

const toArea = ({ start, end, trackId }: MidiRef): IArea => ({
  x1: start,
  x2: end,
  y1: trackId,
  y2: trackId + 1
});

export const useTrackEditor = (ops: Ops) => {
  const { midiRefs, setMidis, setCurrent, tracks } = useTracks();
  const { all, edit, add, clear, sync, select, selectIn, remove } =
    useSelection(midiRefs, setMidis);

  const move = (moveX: number, moveY: number) => {
    const mx = ops.accuracyX(moveX);
    const my = ops.accuracyY(moveY);

    edit(({ start, end, trackId }) => ({
      start: Math.max(start + mx, 0),
      end: end + mx,
      trackId: Math.min(tracks.length - 1, Math.max(trackId + my, 0))
    }));
  };

  const scale = (moveX: number) =>
    edit(({ start, end }) => ({
      start: start,
      end: end + ops.accuracyX(moveX)
    }));

  const addAt = (p: Point) => {
    const { x, y } = ops.to(p);
    add(
      makeMidiRef({
        trackId: ops.accuracyY(y),
        start: ops.accuracyX(x),
        end: ops.accuracyX(x) + 64
      })
    );
  };

  return {
    tracks: all,
    clear,
    sync,
    move,
    scale,
    select,
    setCurrent,
    selectIn: (area?: Area) => selectIn(toArea)(area?.map(ops.to)),
    remove,
    addAt
  };
};
