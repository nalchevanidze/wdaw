import { State, EngineAction } from './types';
import { dispatcher } from './engine-state';
import { dispatchUIState } from './ui-state';

export const reducerFun = (state: State, action: EngineAction) => {
  const engineChanges = dispatcher(state, action);
  const newState = engineChanges ? { ...state, ...engineChanges } : state;

  const uiState = dispatchUIState(action);

  return uiState ? { ...newState, ...uiState } : newState;
};

