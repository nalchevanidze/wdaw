import * as React from 'react';
import { flatten, deepen, Selected } from '../piano-roll/utils';
import { useContext, useState } from 'react';
import { Area } from '../types';
import { ConfiguratorContext } from '../configurator';
import {
  genNoteAt,
  scaleNotes,
  moveNotes,
  selectNotesIn,
  NotePoint
} from '../utils/notes';
import { Point } from '@wdaw/svg';
import { useOnDelete } from '../utils';
import { addTracking, dropTracking } from '../utils/tracking';

export const useNoteEditor = () => {
  const [
    {
      tracks: { currentTrack, tracks }
    },
    dispatch
  ] = useContext(ConfiguratorContext);

  const [notes, setNotes] = useState<Selected<NotePoint>>({
    selected: [],
    inactive: flatten(tracks[currentTrack].midi)
  });

  const allNotes = [...notes.selected, ...notes.inactive];

  const dispatchMidi = (ns: Selected<NotePoint>) =>
    dispatch({
      id: currentTrack,
      type: 'SET_MIDI',
      payload: deepen([...ns.selected, ...ns.inactive])
    });

  const update = (ns: Selected<NotePoint>) => setNotes(ns);

  React.useEffect(() => {
    setNotes({
      selected: [],
      inactive: flatten(tracks[currentTrack].midi)
    });
  }, [tracks[currentTrack].midi]);

  const clear = () =>
    update({
      selected: [],
      inactive: allNotes.map(dropTracking)
    });

  const remove = (note: NotePoint) =>
    update({
      selected: [],
      inactive: allNotes.filter((n) => n !== note).map(dropTracking)
    });

  const select = (note: NotePoint) =>
    update({
      selected: [note].map(addTracking),
      inactive: allNotes.filter((n) => n !== note)
    });

  const addAt = (point: Point) =>
    update({
      selected: [genNoteAt(point)].map(addTracking),
      inactive: allNotes.map(dropTracking)
    });

  const track = () =>
    update({
      selected: notes.selected.map(addTracking),
      inactive: notes.inactive
    });

  const selectIn = (area?: Area) => update(selectNotesIn(notes, area));

  const removeSelected = () =>
    update({ selected: [], inactive: notes.inactive });

  const scale = (area: Area) =>
    update({
      selected: scaleNotes(notes.selected, area),
      inactive: notes.inactive
    });

  const move = (area: Area) =>
    update({
      selected: moveNotes(notes.selected, area),
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
