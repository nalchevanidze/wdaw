import { createContext } from 'react';
import { DawDispatch } from '../daw/types';
import { EngineApi, State } from '../state/types';
import { dawState } from '../state/defs';

export const engineAPIMock: EngineApi = {
  startNote() {},
  endNote() {},
  play() {},
  pause() {},
  stop() {},
  setTime() {}
};

type DawApi = State & {
  currentBPM: number;
  time: number;
  isPlaying: boolean;
  dispatch: DawDispatch;
  engine: EngineApi;
};

export const DawApiContext = createContext<DawApi>({
  currentBPM: 0,
  ...dawState(),
  time: 0,
  isPlaying: false,
  dispatch() {},
  engine: engineAPIMock
});
