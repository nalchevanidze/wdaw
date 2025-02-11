import { createContext } from 'react';
import { DawDispatch } from '../daw/types';
import { DAWState } from '../state/types';
import { dawState } from '../state/defs';

type DawApi = [DAWState, DawDispatch];

export const DawApiContext = createContext<DawApi>([
  dawState(),
  () => undefined
]);
