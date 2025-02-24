import { engineState } from '@wdaw/engine';
import { DAWState } from './types';

export const dawState = (): DAWState => {
  const state = engineState();

  return {
    ...state,
    time: 0,
    currentTrack: 0,
    isPlaying: false,
    currentFragment: Object.keys(state.midiFragments)[0],
    notes: []
  };
};
