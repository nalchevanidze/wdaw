import * as React from 'react';
import { DawApiContext } from '../../context/state';
import { UINote } from '../utils/notes';
import { Note, UIPosition } from '@wdaw/engine';

const fromNotes = (notes: Note[]): UINote[] =>
  notes.map(
    ({ id, at, length }: Note): UINote => ({
      x: at,
      y: UIPosition.fromNote(id),
      length
    })
  );

const toNotes = (notes: UINote[]): Note[] =>
  notes.map(({ length, x, y }: UINote) => ({
    at: x,
    id: UIPosition.toNote(y),
    length
  }));

export const useMidiFragment = (targetId?: string) => {
  const [{ currentFragment, midiFragments }, dispatch] =
    React.useContext(DawApiContext);

  const id = targetId ?? currentFragment;

  const syncNotes = (notes: UINote[]) =>
    dispatch({
      id,
      type: 'SET_MIDI_FRAGMENT',
      payload: { notes: toNotes(notes) }
    });

  const syncLoop = (loop: [number, number]) =>
    dispatch({ id, type: 'SET_MIDI_FRAGMENT', payload: { loop } });

  const { notes, loop, name } = midiFragments[id];

  const uiNotes = React.useMemo<UINote[]>(() => fromNotes(notes), [notes]);

  const [loopStart, loopEnd] = loop;

  const loopWidth = loopEnd - loopStart;

  const options = Object.entries(midiFragments).map(([id, { name }]) => ({
    id,
    name
  }));

  return {
    options,
    name,
    loopStart,
    loopEnd,
    loopWidth,
    notes: uiNotes,
    loop,
    id,
    syncNotes,
    syncLoop,
    dispatch
  };
};
