import * as React from 'react';
import { DawApiContext } from '../../context/state';
import { useSelection } from './use-selection';
import { TrackState } from '@wdaw/engine';
import { Area, IArea } from '@wdaw/svg';
import { idString } from '../../common/utils';

export type MidiID = [number, number];

export const eqID = (m1: MidiID) => (s: State) =>
  idString(m1) === idString(s.id);

type State = {
  id: MidiID;
  start: number;
  end: number;
  fragmentId: string;
};

export type TState = State & { origin?: State };
const toState = (tracks: TrackState[]): State[] =>
  tracks.flatMap((t, ti) => t.midi.map((m, mi) => ({ ...m, id: [ti, mi] })));

export const useTrackEditor = (tracks: TrackState[]) => {
  const [_, dispatch] = React.useContext(DawApiContext);

  const s = useSelection<State>(toState(tracks), (t) => idString(t.id));

  React.useEffect(() => s.sync(toState(tracks)), [tracks]);

  const move = (time: number) =>
    s.edit(({ start, end }) => ({
      start: start + time,
      end: end + time
    }));

  const scale = (time: number) =>
    s.edit(({ start, end }) => ({
      start: start,
      end: end + time
    }));

  const clear = () => {
    sync();
    s.clear();
  };

  const sync = () => {
    dispatch({
      type: 'SET_TRACK_MIDI',
      payload: new Map(
        s.selected.map(({ id, start, end }) => [idString(id), { start, end }])
      )
    });
  };

  const selectIn = (f: (i: TState) => IArea) => (area?: Area) =>
    s.selectWith((track) => area?.isOverlaping(f(track)) ?? false);

  const select = (id: MidiID) => {
    s.selectWith(eqID(id));

    const fid = s.all.find(eqID(id))?.fragmentId;

    if (fid) {
      dispatch({ type: 'SET_CURRENT_FRAGMENT', payload: fid });
    }
  };

  const isSelected = (id: MidiID) => Boolean(s.selected.find(eqID(id)));

  return {
    all: s.all as TState[],
    clear,
    move,
    scale,
    select,
    selectIn,
    isSelected,
    sync
  };
};
