import { createContext } from 'react';
import { DawDispatch } from '../daw/types';
import { EngineApi, State } from '../state/types';
import { dawState } from '../state/defs';

export const engineMock: EngineApi = {
  startNote() {},
  endNote() {}
};

type DawApi = State & {
  time: number;
  isPlaying: boolean;
  dispatch: DawDispatch;
  engine: EngineApi;
};

export const DawApiContext = createContext<DawApi>({
  ...dawState(),
  time: 0,
  isPlaying: false,
  dispatch() {},
  engine: engineMock
});
