import * as React from 'react';
import { DawApiContext } from '../../context/state';
import { useSelection } from './use-selection';
import { TrackState } from '@wdaw/engine';
import { Area, IArea } from '@wdaw/svg';
import { idString } from '../../common/utils';
import { useTracks } from './use-tracks';

export type MidiID = [number, number];

export const eqID = (m1: MidiID) => (s: State) =>
  idString(m1) === idString(s.id);

type State = {
  id: MidiID;
  start: number;
  end: number;
  fragmentId: string;
};

const toId = (t: State) => idString(t.id);
const toHash = (t: State) => idString([...t.id, t.start, t.end, t.fragmentId]);

export type TState = State & { origin?: State };
const toState = (tracks: TrackState[]): State[] =>
  tracks.flatMap((t, ti) => t.midi.map((m, mi) => ({ ...m, id: [ti, mi] })));

type TrackResult = {
  name: string;
  index: number;
  active: boolean;
  midi: (State & { selected: boolean })[];
};

export const useTrackEditor = () => {
  const { tracks, currentTrack, dispatch } = useTracks();

  const s = useSelection<State>(toState(tracks), toId, toHash);

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

  const sync = s.dispatcher(({ selected }) =>
    dispatch({
      type: 'SET_TRACK_MIDI',
      payload: new Map(
        selected.map(({ id, start, end }) => [idString(id), { start, end }])
      )
    })
  );

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

  const result = tracks.map(
    ({ midi, name }, trackIndex): TrackResult => ({
      index: trackIndex,
      active: trackIndex === currentTrack,
      name,
      midi: midi.map(({ fragmentId, start, end }, midiIndex) => {
        const id: MidiID = [trackIndex, midiIndex];
        const { origin, ...state } = (s.all as TState[]).find(eqID(id)) ?? {
          start,
          end,
          fragmentId,
          id
        };
        const selected = Boolean(origin);

        return { selected, ...state };
      })
    })
  );

  return {
    tracks: result,
    clear,
    move,
    scale,
    select,
    selectIn,
    isSelected,
    sync
  };
};
