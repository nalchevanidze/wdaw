import * as React from 'react';
import { useContext, useState } from 'react';
import { Area } from '../types';
import { ConfiguratorContext } from '../configurator';
import {
  genNoteAt,
  scaleNotes,
  moveNotes,
  selectNotesIn,
  UINote,
  Selected
} from '../common/notes';
import { Point } from '@wdaw/svg';
import { useOnDelete } from '../utils';
import { addTracking, dropTracking } from '../utils/tracking';
import { deepen, flatten } from '../common/midi';

export const useNoteEditor = (height: number) => {
  const [
    {
      tracks: { currentTrack, tracks }
    },
    dispatch
  ] = useContext(ConfiguratorContext);

  const [notes, setNotes] = useState<Selected<UINote>>({
    selected: [],
    inactive: flatten(tracks[currentTrack].midi)
  });

  const allNotes = [...notes.selected, ...notes.inactive];

  const dispatchMidi = (ns: Selected<UINote>) =>
    dispatch({
      id: currentTrack,
      type: 'SET_MIDI',
      payload: deepen([...ns.selected, ...ns.inactive])
    });

  const update = (ns: Selected<UINote>) => setNotes(ns);

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
      selected: [genNoteAt(height, point)].map(addTracking),
      inactive: allNotes.map(dropTracking)
    });

  const track = () =>
    update({
      selected: notes.selected.map(addTracking),
      inactive: notes.inactive
    });

  const selectIn = (area?: Area) => update(selectNotesIn(height, notes, area));

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
