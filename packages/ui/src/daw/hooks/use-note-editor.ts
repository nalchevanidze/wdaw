import * as React from 'react';
import { selectNotesIn, UINote } from '../utils/notes';
import { Point, Area } from '@wdaw/svg';
import { useOnDelete } from '../utils/key-actions';
import { addTracking, dropTracking, mapTracked } from '../utils/tracking';
import { deepen, flatten } from '../utils/midi';
import { useTrack } from './use-track';
import { Selected } from '../utils/selection';
import { useSelection } from './use-selection';

export const useNoteEditor = () => {
  const [{ midi, id }, dispatch] = useTrack();
  const notes = useSelection<UINote>(flatten(midi));

  const dispatchMidi = (ns: Selected<UINote>) =>
    dispatch({
      id,
      type: 'SET_MIDI',
      payload: deepen([...ns.selected, ...ns.inactive])
    });

  React.useEffect(() => {
    notes.set({
      selected: [],
      inactive: flatten(midi)
    });
  }, [midi]);

  const remove = (note: UINote) =>
    notes.set({
      selected: [],
      inactive: notes.all.filter((n) => n !== note).map(dropTracking)
    });

  const select = (note: UINote) =>
    notes.set({
      selected: [note].map(addTracking),
      inactive: notes.all.filter((n) => n !== note)
    });

  const addAt = ({ x, y }: Point) =>
    notes.set({
      selected: [addTracking({ length: 1, x, y })],
      inactive: notes.all.map(dropTracking)
    });

  const selectIn = (zone?: Area) => notes.set(selectNotesIn(notes.all, zone));

  const scale = (moveX: number) =>
    notes.set({
      selected: mapTracked(notes.selected, ({ length }) => ({
        length: length + moveX
      })),
      inactive: notes.inactive
    });

  const move = (moveX: number, moveY: number) =>
    notes.set({
      selected: mapTracked(notes.selected, ({ x, y }) => ({
        x: x + moveX,
        y: y - moveY
      })),
      inactive: notes.inactive
    });

  useOnDelete(notes.removeSelected, [notes.selected, notes.inactive]);

  const sync = () => dispatchMidi(notes);

  return {
    selected: notes.selected,
    inactive: notes.inactive,
    track: notes.track,
    clear: notes.clear,
    selectIn,
    remove,
    select,
    addAt,
    move,
    scale,
    sync
  };
};
