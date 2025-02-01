import * as React from 'react';
import { useState } from 'react';
import { Area } from '../types';
import {
  genNoteAt,
  scaleNotes,
  moveNotes,
  selectNotesIn,
  UINote,
  Selected,
  Dimentions
} from '../utils/notes';
import { Point } from '@wdaw/svg';
import { useOnDelete } from '../utils/key-actions';
import { addTracking, dropTracking } from '../utils/tracking';
import { deepen, flatten } from '../utils/midi';
import { useTrack } from './use-track';

export const useNoteEditor = (dimentions: Dimentions) => {
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

  const addAt = (point: Point) =>
    update({
      selected: [genNoteAt(dimentions, point)].map(addTracking),
      inactive: allNotes.map(dropTracking)
    });

  const track = () =>
    update({
      selected: notes.selected.map(addTracking),
      inactive: notes.inactive
    });

  const selectIn = (area?: Area) =>
    update(selectNotesIn(dimentions, notes, area));

  const removeSelected = () =>
    update({ selected: [], inactive: notes.inactive });

  const scale = (area: Area) =>
    update({
      selected: scaleNotes(notes.selected, area),
      inactive: notes.inactive
    });

  const move = (area: Area) =>
    update({
      selected: moveNotes(dimentions, notes.selected, area),
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
