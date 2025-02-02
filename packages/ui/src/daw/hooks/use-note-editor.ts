import * as React from 'react';
import { useState } from 'react';
import { Area } from '../types';
import { selectNotesIn, UINote, Selected, mapNotes } from '../utils/notes';
import { Point } from '@wdaw/svg';
import { useOnDelete } from '../utils/key-actions';
import { addTracking, dropTracking } from '../utils/tracking';
import { deepen, flatten } from '../utils/midi';
import { useTrack } from './use-track';

export const useNoteEditor = () => {
  const [{ midi, id }, dispatch] = useTrack();

  const [notes, setNotes] = useState<Selected<UINote>>({
    selected: [],
    inactive: flatten(midi)
  });

  const allNotes = [...notes.selected, ...notes.inactive];

  const dispatchMidi = (ns: Selected<UINote>) =>
    dispatch({
      id,
      type: 'SET_MIDI',
      payload: deepen([...ns.selected, ...ns.inactive])
    });

  const update = (ns: Selected<UINote>) => setNotes(ns);

  React.useEffect(() => {
    setNotes({
      selected: [],
      inactive: flatten(midi)
    });
  }, [midi]);

  const clear = () =>
    update({
      selected: [],
      inactive: allNotes.map(dropTracking)
    });

  const remove = (note: UINote) =>
    update({
      selected: [],
      inactive: allNotes.filter((n) => n !== note).map(dropTracking)
    });

  const select = (note: UINote) =>
    update({
      selected: [note].map(addTracking),
      inactive: allNotes.filter((n) => n !== note)
    });

  const addAt = ({ x, y }: Point) =>
    update({
      selected: [addTracking({ length: 1, x, y })],
      inactive: allNotes.map(dropTracking)
    });

  const track = () =>
    update({
      selected: notes.selected.map(addTracking),
      inactive: notes.inactive
    });

  const selectIn = (area?: Area) => update(selectNotesIn(allNotes, area));

  const removeSelected = () =>
    update({ selected: [], inactive: notes.inactive });

  const scale = (moveX: number) =>
    update({
      selected: mapNotes(notes.selected, ({ length }) => ({
        length: length + moveX
      })),
      inactive: notes.inactive
    });

  const move = (moveX: number, moveY: number) =>
    update({
      selected: mapNotes(notes.selected, ({ x, y }) => ({
        x: x + moveX,
        y: y - moveY
      })),
      inactive: notes.inactive
    });

  useOnDelete(removeSelected, [notes.selected, notes.inactive]);

  const sync = () => dispatchMidi(notes);

  return {
    selected: notes.selected,
    inactive: notes.inactive,
    selectIn,
    track,
    clear,
    remove,
    select,
    addAt,
    move,
    scale,
    sync
  };
};
