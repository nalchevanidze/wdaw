import { engineState } from '@wdaw/engine';
import { DAWState } from './types';

export const dawState = (): DAWState => ({
  ...engineState(),
  currentTrack: 0,
  currentFragment: 'bass',
  notes: []
});
