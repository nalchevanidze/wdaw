import { createContext } from 'react';
import { DawDispatch } from '../daw/types';
import { KeyboardAPI, State } from '../state/types';
import { dawState } from '../state/defs';

export const keyboardMock: KeyboardAPI = {
  startNote() {},
  endNote() {}
};

type DawApi = State & {
  time: number;
  isPlaying: boolean;
  dispatch: DawDispatch;
  keyboard: KeyboardAPI;
};

export const DawApiContext = createContext<DawApi>({
  ...dawState(),
  time: 0,
  isPlaying: false,
  dispatch() {},
  keyboard: keyboardMock
});
