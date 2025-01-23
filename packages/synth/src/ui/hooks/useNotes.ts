import * as React from 'react';
import { flatten, deepen, Selected } from '../piano-roll/utils';
import { useContext, useState } from 'react';
import { NotePoint } from '../types';
import { ConfiguratorContext } from '../configurator';

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

  const updateNotes = (ns: Selected<NotePoint>) => {
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
    updateNotes({
      selected: [],
      inactive: allNotes.map(dropOrigin)
    });

  const removeNote = (note: NotePoint) =>
    updateNotes({
      selected: [],
      inactive: allNotes.filter((n) => n !== note).map(dropOrigin)
    });

  const selectNote = (note: NotePoint) =>
    updateNotes({
      selected: [note].map(addOrigin),
      inactive: allNotes.filter((n) => n !== note)
    });

  const addNote = (note: NotePoint) =>
    updateNotes({
      selected: [note].map(addOrigin),
      inactive: allNotes.map(dropOrigin)
    });

  const trackOrigin = () =>
    updateNotes({
      selected: notes.selected.map(addOrigin),
      inactive: notes.inactive
    });

  return {
    trackOrigin,
    notes,
    updateNotes,
    clearSelection,
    removeNote,
    selectNote,
    addNote
  };
};
