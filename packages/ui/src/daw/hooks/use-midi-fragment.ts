import * as React from 'react';
import { useMemo } from 'react';
import { DawApiContext } from '../../context/state';
import { UINote } from '../utils/notes';
import { MidiFragment, Note, NoteUnit } from '@wdaw/engine';

const fromNotes = (notes: Note[]): UINote[] =>
  notes.map(
    ({ id, note, at, length }: Note): UINote => ({
      id,
      x: at,
      y: NoteUnit.fromString(note) + 1,
      length
    })
  );

const toNotes = (notes: UINote[]): Note[] =>
  notes.map(({ id, length, x, y }: UINote) => ({
    id,
    at: x,
    note: NoteUnit.toString(y - 1),
    length
  }));

export const useMidiFragment = (targetId?: string) => {
  const { currentFragment, midiFragments, dispatch } =
    React.useContext(DawApiContext);

  const id = targetId ?? currentFragment;

  const setCurrent = (fragmentId: string) =>
    dispatch({ type: 'MIDI/SET_CURRENT_FRAGMENT', fragmentId });

  const setFragment = (payload: Partial<MidiFragment>) =>
    dispatch({ type: 'MIDI/SET_FRAGMENT', fragment: { ...payload, id } });

  const newFragment = () =>
    dispatch({
      type: 'MIDI/NEW_FRAGMENT',
      fragment: {
        id: crypto.randomUUID(),
        name: `Fragment ${Object.keys(midiFragments).length + 1}`,
        notes: [],
        loop: [0, 64]
      }
    });

  const syncNotes = (notes: UINote[]) =>
    dispatch({
      type: 'MIDI/SET_FRAGMENT',
      fragment: { id, notes: toNotes(notes) }
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
