import * as React from 'react';
import { MidiRef } from '@wdaw/engine';
import { DawApiContext } from '../../context/state';
import { idString } from '../../common/utils';

const toId = (t: MidiRef) => idString([t.trackIndex, t.start]);

export const toUITrack = (m: MidiRef): UITrack => ({ ...m, id: toId(m) });

export type UITrack = MidiRef & {
  id: string;
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
        ({ start, end, fragmentId, trackIndex }): MidiRef => ({
          start,
          end,
          trackIndex,
          fragmentId
        })
      )
    });

  const setCurrent = (id?: string) =>
    id ? dispatch({ type: 'SET_CURRENT_FRAGMENT', payload: id }) : undefined;

  const newTrack = () => dispatch({ type: 'NEW_TRACK' });

  return {
    tracks: midiRefs.map(toUITrack),
    currentTrack,
    setMidis,
    setCurrent,
    length,
    count,
    newTrack
  };
};
