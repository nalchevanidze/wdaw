import { useEffect } from 'react';
import { toArea, UINote } from '../utils/notes';
import { Point, Area } from '@wdaw/svg';
import { toMidiFragment, fromMidiFragment } from '../utils/midi';
import { useSelection } from './use-selection';
import { useMidiFragment } from './use-midi-fragment';

const noteId = (note: UINote) => [note.x, note.y, note.length].join(':');

export const useNoteEditor = () => {
  const [fragment, dispatch] = useMidiFragment();
  const { all, add, clear, edit, selectWith, removeWith, sync, setState } =
    useSelection<UINote>(fromMidiFragment(fragment), noteId);

  useEffect(() => sync(fromMidiFragment(fragment)), [fragment.notes]);

  const remove = (note: UINote) => removeWith((n) => n === note);

  const select = (note: UINote) => selectWith((n) => n == note);

  const scale = (moveX: number) =>
    edit(({ length }) => ({ length: length + moveX }));

  const move = (moveX: number, moveY: number) =>
    edit(({ x, y }) => ({ x: x + moveX, y: y - moveY }));

  const addAt = ({ x, y }: Point) => add({ length: 1, x, y });

  const selectIn = (area?: Area) =>
    selectWith((note) => area?.isOverlaping(toArea(note)) ?? false);

  const refresh = () => {
    setState((s) => {
      const all = [s.selected, s.inactive].flat();

      requestAnimationFrame(() => {
        dispatch({
          id: fragment.id,
          type: 'SET_MIDI_FRAGMENT',
          payload: toMidiFragment(all)
        });
      });

      return s;
    });
  };

  return {
    clear,
    selectIn,
    remove,
    select,
    addAt,
    move,
    scale,
    all,
    sync: refresh
  };
};
