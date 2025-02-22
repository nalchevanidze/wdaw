import { toArea, UINote } from '../utils/notes';
import { Point, Area } from '@wdaw/svg';
import { useSelection } from './use-selection';
import { useMidiFragment } from './use-midi-fragment';
import { idString } from '../../common/utils';

const noteId = (note: UINote) => idString([note.x, note.y, note.length]);

export const useNoteEditor = () => {
  const { notes, syncNotes } = useMidiFragment();
  const { all, add, clear, edit, remove, dispatcher, select, selectIn } =
    useSelection(notes, noteId);

  const scale = (moveX: number) =>
    edit(({ length }) => ({ length: length + moveX }));

  const move = (moveX: number, moveY: number) =>
    edit(({ x, y }) => ({ x: x + moveX, y: y - moveY }));

  const addAt = ({ x, y }: Point) => add({ length: 1, x, y });

  return {
    all,
    clear,
    selectIn: selectIn(toArea),
    remove,
    select,
    addAt,
    move,
    scale,
    sync: dispatcher(syncNotes)
  };
};
