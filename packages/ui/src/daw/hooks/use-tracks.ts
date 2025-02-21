import * as React from 'react';
import { MidiRef } from '@wdaw/engine';
import { DawApiContext } from '../../context/state';

export type MidiID = [number, number];

export type UITrack = {
  id: MidiID;
  start: number;
  end: number;
  fragmentId: string;
  selected?: boolean;
};

export const useTracks = () => {
  const [{ currentTrack, tracks, midiRefs }, dispatch] =
    React.useContext(DawApiContext);

  const length = Math.max(...midiRefs.map(({ end }) => end));
  const count = tracks.length;

  const setMidis = (ls: UITrack[]) =>
    dispatch({
      type: 'SET_MIDI_REFS',
      payload: ls.map(
        ({ start, end, id, fragmentId }): MidiRef => ({
          start,
          end,
          trackIndex: id[0],
          fragmentId
        })
      )
    });

  const setCurrent = (id?: string) =>
    id ? dispatch({ type: 'SET_CURRENT_FRAGMENT', payload: id }) : undefined;

  const newTrack = () => dispatch({ type: 'NEW_TRACK' });

  return {
    tracks: midiRefs.map((m): UITrack => ({ ...m, id: [m.trackIndex, m.end] })),
    currentTrack,
    setMidis,
    setCurrent,
    length,
    count,
    newTrack
  };
};
