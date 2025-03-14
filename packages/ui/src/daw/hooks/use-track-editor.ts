import { useSelection } from './use-selection';
import { Area, IArea, Point } from '@wdaw/svg';
import { useTracks } from './use-tracks';
import { MidiRef } from '@wdaw/engine';
import { mapAdd, mapMove, mapScale, Matrix, toPoint } from '../utils/matrix';

const toArea = ({ start, end, trackId }: MidiRef): IArea => ({
  x1: start,
  x2: end,
  y1: trackId,
  y2: trackId + 1
});

export const useTrackEditor = (matrix: Matrix) => {
  const { midiRefs, setMidis, setCurrent, length } = useTracks();
  const { all, edit, add, clear, sync, select, selectIn, remove } =
    useSelection(midiRefs, setMidis);

  const move = mapMove(matrix, (mx, my) =>
    edit(({ start, end, trackId }) => ({
      start: Math.max(start + mx, 0),
      end: end + mx,
      trackId: Math.min(length - 1, Math.max(trackId + my, 0))
    }))
  );

  const scale = mapScale(matrix, (moveX) =>
    edit(({ start, end }) => ({ start, end: end + moveX }))
  );

  const addAt = mapAdd(matrix, ({ x, y }) =>
    add({ id: crypto.randomUUID(), trackId: y, start: x, end: x + 64 })
  );

  return {
    all,
    clear,
    sync,
    move,
    scale,
    select,
    setCurrent,
    selectIn: selectIn(toArea, (p) => toPoint(matrix, p)),
    remove,
    addAt
  };
};
