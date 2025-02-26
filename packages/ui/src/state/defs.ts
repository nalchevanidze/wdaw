import { engineState } from '@wdaw/engine';
import { DAWState } from './types';

export const dawState = (): DAWState => {
  const state = engineState();

  return {
    ...state,
    currentTrack: 0,
    currentFragment: Object.keys(state.midiFragments)[0],
    notes: []
  };
};
