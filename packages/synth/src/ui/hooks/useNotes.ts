import * as React from 'react';
import { flatten, deepen, Selected } from '../piano-roll/utils';
import { useContext, useState } from 'react';
import { Area, NotePoint } from '../types';
import { ConfiguratorContext } from '../configurator';
import { selectNotesIn } from '../utils/select-notes';
import { editNotes, genNoteAt } from '../utils/edit-notes';
import { Point } from '@wdaw/svg';

const addOrigin = ({ old, ...note }: NotePoint): NotePoint => ({
  ...note,
  old: { ...note }
});

const dropOrigin = ({ old, ...n }: NotePoint): NotePoint => n;

export const useNotes = () => {
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

  const update = (ns: Selected<NotePoint>) => {
    setNotes(ns);
    if (ns.selected.length === 0) {
      dispatch({
        type: 'SET_MIDI',
        payload: deepen(
          [...ns.selected, ...ns.inactive],
          tracks[currentTrack].midi
        )
      });
    }
  };

  React.useEffect(() => {
    setNotes({
      selected: [],
      inactive: flatten(tracks[currentTrack].midi)
    });
  }, [tracks[currentTrack].midi]);

  const clearSelection = () =>
    update({
      selected: [],
      inactive: allNotes.map(dropOrigin)
    });

  const remove = (note: NotePoint) =>
    update({
      selected: [],
      inactive: allNotes.filter((n) => n !== note).map(dropOrigin)
    });

  const select = (note: NotePoint) =>
    update({
      selected: [note].map(addOrigin),
      inactive: allNotes.filter((n) => n !== note)
    });

  const add = (point: Point) =>
    update({
      selected: [genNoteAt(point)].map(addOrigin),
      inactive: allNotes.map(dropOrigin)
    });

  const track = () =>
    update({
      selected: notes.selected.map(addOrigin),
      inactive: notes.inactive
    });

  const selectIn = (area?: Area) => update(selectNotesIn(notes, area));

  const removeSelected = () =>
    update({ selected: [], inactive: notes.inactive });

  const edit = (mode: 'MOVE' | 'SCALE', area: Area) =>
    update({
      selected: editNotes(mode, notes.selected, area),
      inactive: notes.inactive
    });

  return {
    selected: notes.selected,
    inactive: notes.inactive,
    removeSelected,
    selectIn,
    track,
    clearSelection,
    remove,
    select,
    add,
    edit
  };
};
