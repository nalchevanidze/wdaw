import { toArea } from '../utils/notes';
import { Point, Area } from '@wdaw/svg';
import { useSelection } from './use-selection';
import { useMidiFragment } from './use-midi-fragment';

type Normalizer = (_: Point) => Point;

export const useNoteEditor = (normalize: Normalizer) => {
  const { notes, syncNotes } = useMidiFragment();
  const { all, add, clear, edit, remove, sync, select, selectIn } =
    useSelection(notes, syncNotes);

  const scale = (moveX: number) =>
    edit(({ length }) => ({ length: length + moveX }));

  const move = (moveX: number, moveY: number) =>
    edit(({ x, y }) => ({ x: x + moveX, y: y - moveY }));

  const addAt = (p: Point) => {
    const { x, y } = normalize(p);
    add({ id: crypto.randomUUID(), length: 1, x, y });
  };
  
  return {
    selectIn: (area?: Area)=> selectIn(toArea) (area?.map(normalize)),
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
