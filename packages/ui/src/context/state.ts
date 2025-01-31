import { createContext } from 'react';
import { DAWState, dawState } from '@wdaw/engine';
import { DawDispatch } from '../daw/types';

type DawApi = [DAWState, DawDispatch];

export const DawApiContext = createContext<DawApi>([
  dawState(),
  () => undefined
]);
