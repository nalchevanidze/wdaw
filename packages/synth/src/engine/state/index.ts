import { getDAWState } from "./state";

export type { PresetName } from "./presets";
export type { DAWState } from "./state";

export const initialState = getDAWState();
