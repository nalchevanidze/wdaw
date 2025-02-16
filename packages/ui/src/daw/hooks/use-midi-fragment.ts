import * as React from 'react';
import { DawApiContext } from '../../context/state';
import { UINote } from '../utils/notes';
import { Note, UIPosition } from '@wdaw/engine';

export const fromNotes = (notes: Note[]): UINote[] =>
  notes.map(
    ({ id, at, length }: Note): UINote => ({
      x: at,
      y: UIPosition.fromNote(id),
      length
    })
  );

export const useMidiFragment = (targetId?: string) => {
  const [{ currentFragment, midiFragments }, dispatch] =
    React.useContext(DawApiContext);

  const id = targetId ?? currentFragment;

  const { notes, loop } = midiFragments[id];

  const uiNotes = React.useMemo<UINote[]>(() => fromNotes(notes), [notes]);

  return [{ notes: uiNotes, loop, id }, dispatch] as const;
};
