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
      type: 'MIDI_SET_MIDI_REFS',
      payload: ls.map(
        ({ start, end, fragmentId, trackId, id }): MidiRef => ({
          id,
          start,
          end,
          trackId,
          fragmentId
        })
      )
    });

  const setCurrent = (id: string) =>
    dispatch({ type: 'MIDI_SET_CURRENT_FRAGMENT', payload: id });

  const newTrack = () => dispatch({ type: 'TRACK_NEW_TRACK' });

  return {
    current: tracks[currentTrack],
    tracks,
    midiRefs,
    currentTrack,
    setMidis,
    setCurrent,
    length,
    count,
    newTrack,
    dispatch
  };
};
