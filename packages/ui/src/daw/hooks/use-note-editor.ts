import { toArea } from '../utils/notes';
import { Point, Area } from '@wdaw/svg';
import { useSelection } from './use-selection';
import { useMidiFragment } from './use-midi-fragment';
import {
  mapAdd,
  mapMove,
  mapScale,
  Matrix,
  toPoint,
  toPointRaw
} from '../utils/matrix';

export const useNoteEditor = (matrix: Matrix) => {
  const { notes, syncNotes } = useMidiFragment();
  const { all, add, clear, edit, remove, sync, select, selectIn } =
    useSelection(notes, syncNotes);

  const scale = mapScale(matrix, (moveX) =>
    edit(({ length }) => ({ length: length + moveX }))
  );

  const move = mapMove(matrix, (moveX, moveY) =>
    edit(({ x, y }) => ({ x: x + moveX, y: y - moveY }))
  );

  const addAt = mapAdd(matrix, ({ x, y }: Point) =>
    add({ id: crypto.randomUUID(), length: 1, x, y })
  );

  return {
    selectIn: selectIn(toArea, (p) => toPointRaw(matrix, p)),
    all,
    clear,
    sync,
    remove,
    select,
    addAt,
    move,
    scale
  };
};
