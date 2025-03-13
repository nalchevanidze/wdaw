import { EngineAction, UIState } from "./types";

export const uiReducer = (
  action: EngineAction
): Partial<UIState> | undefined => {
  switch (action.type) {
    case 'MIDI/SET_CURRENT_FRAGMENT':
      return { currentFragment: action.payload };
    case 'MIDI/NEW_FRAGMENT':
      return { currentFragment: action.payload.id };
    case 'TRACK/SET_CURRENT':
      return { currentTrack: action.trackId };
    default:
      return;
  }
};
