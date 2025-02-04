import * as React from 'react';
import { toArea, UINote } from '../utils/notes';
import { Point, Area } from '@wdaw/svg';
import { toMidi, fromMidi } from '../utils/midi';
import { useTrack } from './use-track';
import { useSelection } from './use-selection';

export const useNoteEditor = () => {
  const [{ midi, id }, dispatch] = useTrack();
  const {
    all,
    add,
    track,
    clear,
    selected,
    inactive,
    edit,
    selectWith,
    removeWith,
    refresh
  } = useSelection<UINote>(fromMidi(midi));

  React.useEffect(() => refresh(fromMidi(midi)), [midi]);

  const sync = () => dispatch({ id, type: 'SET_MIDI', payload: toMidi(all) });

  const remove = (note: UINote) => removeWith((n) => n === note);

  const select = (note: UINote) => selectWith((n) => n == note);

  const scale = (moveX: number) =>
    edit(({ length }) => ({ length: length + moveX }));

  const move = (moveX: number, moveY: number) =>
    edit(({ x, y }) => ({ x: x + moveX, y: y - moveY }));

  const addAt = ({ x, y }: Point) => add({ length: 1, x, y });

  const selectIn = (area?: Area) =>
    selectWith((note) => area?.isOverlaping(toArea(note)) ?? false);

  return {
    selected,
    inactive,
    track,
    clear,
    selectIn,
    remove,
    select,
    addAt,
    move,
    scale,
    sync
  };
};
