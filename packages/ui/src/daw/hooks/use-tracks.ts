import * as React from 'react';
import { MidiRef, TrackState } from '@wdaw/engine';
import { DawDispatch } from '../types';
import { DawApiContext } from '../../context/state';
import { idString } from '../../common/utils';

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
      type: 'SET_TRACK_MIDI',
      payload: new Map(
        ls.map(({ id, start, end }) => [idString(id), { start, end }])
      )
    });

  const setCurrent = (id?: string) =>
    id ? dispatch({ type: 'SET_CURRENT_FRAGMENT', payload: id }) : undefined;

  const newTrack = () => dispatch({ type: 'NEW_TRACK' });

  return {
    tracks: midiRefs.map((m, ti): UITrack => ({ ...m, id: [ti, m.start] })),
    currentTrack,
    setMidis,
    setCurrent,
    length,
    count,
    newTrack
  };
};
