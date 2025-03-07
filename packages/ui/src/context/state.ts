import { createContext } from 'react';
import { DawDispatch } from '../daw/types';
import { EngineApi, State } from '../state/types';
import { dawState } from '../state/defs';

const engine: EngineApi = {
  startNote() {},
  endNote() {},
  play() {},
  pause() {},
  stop() {}
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
  engine
});
