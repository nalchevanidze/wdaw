import { toArea } from '../utils/notes';
import { Point, Area } from '@wdaw/svg';
import { useSelection } from './use-selection';
import { useMidiFragment } from './use-midi-fragment';

type Ops = {
  size: number;
  accuracyX(i: number): number;
  accuracyY(i: number): number;
  scaleY(i: number): number;
  scaleX(i: number): number;
};

export const useNoteEditor = (ops: Ops) => {
  const { notes, syncNotes } = useMidiFragment();
  const { all, add, clear, edit, remove, sync, select, selectIn } =
    useSelection(notes, syncNotes);

  const scale = (moveX: number) =>
    edit(({ length }) => ({
      length: length + ops.accuracyX(ops.scaleX(moveX))
    }));

  const move = (moveX: number, moveY: number) =>
    edit(({ x, y }) => ({
      x: x + ops.accuracyX(ops.scaleX(moveX)),
      y: y - ops.accuracyY(ops.scaleY(moveY))
    }));

  const to = ({ x, y }: Point): Point => ({
    x: ops.scaleX(x),
    y: ops.size - ops.scaleY(y)
  });

  const addAt = (p: Point) => {
    const { x, y } = to(p);
    add({
      id: crypto.randomUUID(),
      length: 1,
      x: ops.accuracyX(x),
      y: ops.accuracyY(y)
    });
  };

  return {
    selectIn: (area?: Area) => selectIn(toArea)(area?.map(to)),
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
