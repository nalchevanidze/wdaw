import * as React from 'react';
import { useMemo } from 'react';
import { DawApiContext } from '../../context/state';
import { UINote } from '../utils/notes';
import { MidiFragment, Note, UIPosition } from '@wdaw/engine';

const fromNotes = (notes: Note[]): UINote[] =>
  notes.map(
    ({ id, note, at, length }: Note): UINote => ({
      id,
      x: at,
      y: UIPosition.fromNote(note),
      length
    })
  );

const toNotes = (notes: UINote[]): Note[] =>
  notes.map(({ id, length, x, y }: UINote) => ({
    id,
    at: x,
    note: UIPosition.toNote(y),
    length
  }));

export const useMidiFragment = (targetId?: string) => {
  const { currentFragment, midiFragments, dispatch } =
    React.useContext(DawApiContext);

  const id = targetId ?? currentFragment;

  const setCurrent = (fragmentId: string) =>
    dispatch({ type: 'MIDI/SET_CURRENT_FRAGMENT', fragmentId });

  const setFragment = (payload: Partial<MidiFragment>) =>
    dispatch({ type: 'MIDI/SET_FRAGMENT', payload: { ...payload, id } });

  const newFragment = () =>
    dispatch({
      type: 'MIDI/NEW_FRAGMENT',
      payload: {
        id: crypto.randomUUID(),
        name: `Fragment ${Object.keys(midiFragments).length + 1}`,
        notes: [],
        loop: [0, 64]
      }
    });

  const syncNotes = (notes: UINote[]) =>
    dispatch({
      type: 'MIDI/SET_FRAGMENT',
      payload: { id, notes: toNotes(notes) }
    });

  const { notes, loop, name } = midiFragments[id];

  const uiNotes = useMemo<UINote[]>(() => fromNotes(notes), [notes]);

  const [loopStart, loopEnd] = loop;

  const loopWidth = loopEnd - loopStart;

  return {
    options: Object.values(midiFragments),
    name,
    loopStart,
    loopEnd,
    loopWidth,
    notes: uiNotes,
    loop,
    id,
    setFragment,
    syncNotes,
    setCurrent,
    newFragment
  };
};
