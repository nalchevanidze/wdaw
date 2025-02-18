import * as React from 'react';
import { TrackState } from '@wdaw/engine';
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

const unfold = (tracks: TrackState[]): UITrack[] =>
  tracks.flatMap((t, ti) => t.midi.map((m, mi) => ({ ...m, id: [ti, mi] })));

export const useTracks = () => {
  const [{ currentTrack, tracks }, dispatch] = React.useContext(DawApiContext);

  const length = Math.max(...tracks.flatMap((t) => t.midi.map((x) => x.end)));
  const count = tracks.length;

  const setMidis = (ls: UITrack[]) =>
    dispatch({
      type: 'SET_TRACK_MIDI',
      payload: new Map(
        ls.map(({ id, start, end }) => [idString(id), { start, end }])
      )
    });

  const setCurrent = (id?: string) =>
    id ? dispatch({ type: 'SET_CURRENT_FRAGMENT', payload: id }) : unfold;

  return {
    tracks: unfold(tracks),
    currentTrack,
    setMidis,
    setCurrent,
    length,
    count
  };
};
