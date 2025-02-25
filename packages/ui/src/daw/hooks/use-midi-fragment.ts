import * as React from 'react';
import { DawApiContext } from '../../context/state';
import { UINote } from '../utils/notes';
import { MidiFragment, Note, UIPosition } from '@wdaw/engine';

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

  const setCurrent = (payload: string) =>
    dispatch({ type: 'MIDI/SET_CURRENT_FRAGMENT', payload });

  const setFragment = (payload: Partial<MidiFragment>) =>
    dispatch({ type: 'MIDI/SET_FRAGMENT', id, payload });

  const newFragment = () => dispatch({ type: 'MIDI/NEW_FRAGMENT' });

  const syncNotes = (notes: UINote[]) =>
    dispatch({
      id,
      type: 'MIDI/SET_FRAGMENT',
      payload: { notes: toNotes(notes) }
    });

  const { notes, loop, name } = midiFragments[id];

  const uiNotes = React.useMemo<UINote[]>(() => fromNotes(notes), [notes]);

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
