import * as React from 'react';
import { DawDispatch } from '../types';
import { DawApiContext } from '../../context/state';
import { MidiFragment } from '@wdaw/engine';

export const useMidiFragment = (): [
  MidiFragment & { id: string },
  DawDispatch
] => {
  const [{ currentFragment, midiFragments }, dispatch] =
    React.useContext(DawApiContext);

  const id = currentFragment;
  const { notes, loop } = midiFragments[id];

  return [{ notes, loop, id }, dispatch];
};
