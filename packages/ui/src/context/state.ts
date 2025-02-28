import { createContext } from 'react';
import { DawDispatch } from '../daw/types';
import { State } from '../state/types';
import { dawState } from '../state/defs';

type DawApi = State & {
  time: number;
  isPlaying: boolean;
  dispatch: DawDispatch;
};

export const DawApiContext = createContext<DawApi>({
  ...dawState(),
  time: 0,
  isPlaying: false,
  dispatch() {}
});
