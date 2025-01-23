import * as React from 'react';
import { flatten, deepen, Selected } from '../piano-roll/utils';
import { useContext, useState } from 'react';
import { NotePoint } from '../types';
import { ConfiguratorContext } from '../configurator';

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



  const allNotes = [...notes.selected, ...notes.inactive];

  return { notes, updateNotes , allNotes };
};
