import * as React from 'react';
import { DawApiContext } from '../../context/state';

export const useMidiFragment = () => {
  const [{ currentFragment, midiFragments }, dispatch] =
    React.useContext(DawApiContext);

  const id = currentFragment;
  const { notes, loop } = midiFragments[id];

  return [{ notes, loop, id }, dispatch] as const;
};
