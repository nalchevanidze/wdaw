import { engineState } from '@wdaw/engine';
import { State } from './types';

export const dawState = (): State => {
  const state = engineState();

  return {
    ...state,
    currentTrack: 0,
    currentFragment: Object.keys(state.midiFragments)[0],
    notes: []
  };
};
