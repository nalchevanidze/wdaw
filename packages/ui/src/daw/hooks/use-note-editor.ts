import { toArea } from '../utils/notes';
import { Point, Area } from '@wdaw/svg';
import { useSelection } from './use-selection';
import { useMidiFragment } from './use-midi-fragment';

type Ops = {
  accuracyX(i: number): number;
  accuracyY(i: number): number;
  scaleY(i: number): number;
  to(_: Point): Point;
};

export const useNoteEditor = (ops: Ops) => {
  const { notes, syncNotes } = useMidiFragment();
  const { all, add, clear, edit, remove, sync, select, selectIn } =
    useSelection(notes, syncNotes);

  const scale = (moveX: number) =>
    edit(({ length }) => ({ length: length + ops.accuracyX(moveX) }));

  const move = (moveX: number, moveY: number) =>
    edit(({ x, y }) => ({
      x: x + ops.accuracyX(moveX),
      y: y - ops.accuracyY(ops.scaleY(moveY))
    }));

  const addAt = (p: Point) => {
    const { x, y } = ops.to(p);
    add({
      id: crypto.randomUUID(),
      length: 1,
      x: ops.accuracyX(x),
      y: ops.accuracyY(y)
    });
  };

  return {
    selectIn: (area?: Area) => selectIn(toArea)(area?.map(ops.to)),
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
