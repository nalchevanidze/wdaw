import { State, EngineAction } from './types';
import { engineReducer } from './engine-reducer';
import { uiReducer } from './ui-reducer';

export const reducer = (state: State, action: EngineAction) => {
  const engineChanges = engineReducer(state, action);
  const uiState = uiReducer(action);
  
  const engineState = engineChanges ? { ...state, ...engineChanges } : state;
  return uiState ? { ...engineState, ...uiState } : engineState;
};
