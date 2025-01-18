import { getDAWState } from './state';

export { presetNames } from './presets';
export type { PresetName } from './presets';
export type { DAWState , UIState} from './state';
export { getPreset, toUIState } from './state';

export const initialState = getDAWState();

export { prelude as initialMidi } from './midi';
