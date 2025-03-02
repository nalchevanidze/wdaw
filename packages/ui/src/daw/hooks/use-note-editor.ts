import { toArea } from '../utils/notes';
import { Point, Area } from '@wdaw/svg';
import { useSelection } from './use-selection';
import { useMidiFragment } from './use-midi-fragment';

export const useNoteEditor = () => {
  const { notes, syncNotes } = useMidiFragment();
  const { all, add, clear, edit, remove, sync, select, selectIn } =
    useSelection(notes, syncNotes);

  const scale = (moveX: number) =>
    edit(({ length }) => ({ length: length + moveX }));

  const move = (moveX: number, moveY: number) =>
    edit(({ x, y }) => ({ x: x + moveX, y: y - moveY }));

  const addAt = ({ x, y }: Point) =>
    add({ id: crypto.randomUUID(), length: 1, x, y });

  return {
    selectIn: selectIn(toArea),
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
