import * as React from 'react';
import { selectNotesIn, UINote } from '../utils/notes';
import { Point, Area } from '@wdaw/svg';
import { useOnDelete } from '../utils/key-actions';
import { addTracking, dropTracking, mapTracked } from '../utils/tracking';
import { deepen, flatten } from '../utils/midi';
import { useTrack } from './use-track';
import { useSelection } from './use-selection';

export const useNoteEditor = () => {
  const [{ midi, id }, dispatch] = useTrack();
  const { all, add, set, removeSelected, track, clear, selected, inactive } =
    useSelection<UINote>(flatten(midi));

  const sync = () => dispatch({ id, type: 'SET_MIDI', payload: deepen(all) });

  React.useEffect(() => set({ selected: [], inactive: flatten(midi) }), [midi]);

  const remove = (note: UINote) =>
    set({
      selected: [],
      inactive: all.filter((n) => n !== note).map(dropTracking)
    });

  const select = (note: UINote) =>
    set({
      selected: [note].map(addTracking),
      inactive: all.filter((n) => n !== note)
    });

  const addAt = ({ x, y }: Point) => add({ length: 1, x, y });

  const selectIn = (zone?: Area) => set(selectNotesIn(all, zone));

  const scale = (moveX: number) =>
    set({
      selected: mapTracked(selected, ({ length }) => ({
        length: length + moveX
      })),
      inactive
    });

  const move = (moveX: number, moveY: number) =>
    set({
      selected: mapTracked(selected, ({ x, y }) => ({
        x: x + moveX,
        y: y - moveY
      })),
      inactive
    });

  useOnDelete(removeSelected, [selected, inactive]);

  return {
    selected,
    inactive,
    track,
    clear,
    selectIn,
    remove,
    select,
    addAt,
    move,
    scale,
    sync
  };
};
