import { EngineAction, UIState } from './types';

export const uiReducer = (
  action: EngineAction
): Partial<UIState> | undefined => {
  switch (action.type) {
    case 'MIDI/SET_CURRENT_FRAGMENT':
      return { currentFragment: action.fragmentId };
    case 'MIDI/NEW_FRAGMENT':
      return { currentFragment: action.fragment.id };
    case 'TRACK/SET_CURRENT':
      return { currentTrack: action.trackId };
    default:
      return;
  }
};
