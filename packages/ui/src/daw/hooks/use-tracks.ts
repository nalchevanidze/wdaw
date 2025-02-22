import * as React from 'react';
import { MidiRef } from '@wdaw/engine';
import { DawApiContext } from '../../context/state';

export const useTracks = () => {
  const [{ currentTrack, tracks, midiRefs }, dispatch] =
    React.useContext(DawApiContext);

  const length = Math.max(...midiRefs.map(({ end }) => end));
  const count = tracks.length;

  const setMidis = (ls: MidiRef[]) =>
    dispatch({
      type: 'SET_MIDI_REFS',
      payload: ls.map(
        ({ start, end, fragmentId, trackIndex }): MidiRef => ({
          start,
          end,
          trackIndex,
          fragmentId
        })
      )
    });

  const setCurrent = (id: string) =>
    dispatch({ type: 'SET_CURRENT_FRAGMENT', payload: id });

  const newTrack = () => dispatch({ type: 'NEW_TRACK' });

  return {
    tracks,
    midiRefs,
    currentTrack,
    setMidis,
    setCurrent,
    length,
    count,
    newTrack
  };
};
