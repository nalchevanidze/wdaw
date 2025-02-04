import * as React from 'react';
import { DawApiContext } from '../../context/state';
import { useSelection } from './use-selection';
import { TrackState } from '@wdaw/engine';
import { Area, IArea } from '@wdaw/svg';

type State = { id: number; start: number; end: number };

export type TState = State & { origin?: State };

export const useTrackEditor = (tracks: TrackState[]) => {
  const [_, dispatch] = React.useContext(DawApiContext);

  const s = useSelection(tracks.map((t, i) => ({ ...t.midi, id: i })));

  React.useEffect(
    () => s.reset(tracks.map((t, i) => ({ ...t.midi, id: i }))),
    [tracks]
  );

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
    s.selected.forEach(({ start, end, id }) => {
      dispatch({ type: 'SET_MIDI', id, payload: { start, end } });
    });
    s.clear();
  };

  const selectIn = (f: (i: TState) => IArea) => (area?: Area) => 
    s.selectWith((track) => area?.isOverlaping(f(track)) ?? false);

  const select = (i: number) => s.selectWith((x) => x.id === i);

  return { all: s.all, clear, move, scale, select, selectIn };
};
