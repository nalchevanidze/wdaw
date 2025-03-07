import { State, EngineAction } from './types';
import { engineReducer } from './engine-reducer';
import { uiReducer } from './ui-reducer';

export const reducer = (state: State, action: EngineAction) => {
  const engineChanges = engineReducer(state, action);
  const newState = engineChanges ? { ...state, ...engineChanges } : state;

  const uiState = uiReducer(action);

  return uiState ? { ...newState, ...uiState } : newState;
};
