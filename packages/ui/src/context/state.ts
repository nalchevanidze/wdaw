import { createContext } from 'react';
import { DawDispatch } from '../daw/types';
import { DAWState } from '../state/types';
import { dawState } from '../state/defs';

type DawApi = DAWState & {
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
