import { SynthEngine } from '@wdaw/engine';
import { State, EngineAction } from './types';
import { dispatcher } from './engine-state';
import { dispatchUIState } from './ui-state';
import { engineEffects } from './engine-effects';

export const makeReducer =
  (engine: SynthEngine) => (state: State, action: EngineAction) => {
    const engineChanges = dispatcher(state, action);
    const newState = engineChanges ? { ...state, ...engineChanges } : state;

    engineEffects(newState, engine, action);

    const uiState = dispatchUIState(action);

    return uiState ? { ...newState, ...uiState } : newState;
  };
