import { createContext } from "react";
import { DAWState, dawState } from "../../engine";
import { DawDispatch } from "../types";

type DawApi = [DAWState, DawDispatch];

export const DawApiContext = createContext<DawApi>([
  dawState(),
  () => undefined
]);