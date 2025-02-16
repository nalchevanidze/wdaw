import * as React from 'react';
import { DawApiContext } from '../../context/state';
import { fromNotes } from '../utils/midi';

export const useMidiFragment = () => {
  const [{ currentFragment, midiFragments }, dispatch] =
    React.useContext(DawApiContext);

  const id = currentFragment;
  const { notes, loop } = midiFragments[id];

  return [{ notes: fromNotes(notes), loop, id }, dispatch] as const;
};
