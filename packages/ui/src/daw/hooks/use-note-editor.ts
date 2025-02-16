import { toArea, UINote } from '../utils/notes';
import { Point, Area } from '@wdaw/svg';
import { useSelection } from './use-selection';
import { useMidiFragment } from './use-midi-fragment';

const noteId = (note: UINote) => [note.x, note.y, note.length].join(':');

export const useNoteEditor = () => {
  const { notes, syncNotes } = useMidiFragment();
  const { all, add, clear, edit, selectWith, removeWith, dispatcher } =
    useSelection(notes, noteId);

  const remove = (note: UINote) => removeWith((n) => n === note);

  const select = (note: UINote) => selectWith((n) => n == note);

  const scale = (moveX: number) =>
    edit(({ length }) => ({ length: length + moveX }));

  const move = (moveX: number, moveY: number) =>
    edit(({ x, y }) => ({ x: x + moveX, y: y - moveY }));

  const addAt = ({ x, y }: Point) => add({ length: 1, x, y });

  const selectIn = (area?: Area) =>
    selectWith((note) => area?.isOverlaping(toArea(note)) ?? false);

  return {
    all,
    clear,
    selectIn,
    remove,
    select,
    addAt,
    move,
    scale,
    sync: dispatcher((s) => syncNotes([...s.selected, ...s.inactive]))
  };
};
