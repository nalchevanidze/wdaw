import * as React from "react";
import { DawDispatch } from "../types";
import { DawApiContext } from "../../context/state";
import { MidiFragment } from "@wdaw/engine";

export const useTrack = (): [MidiFragment & { id: number }, DawDispatch] => {
  const [
    {
      tracks: { currentTrack, tracks }
    },
    dispatch
  ] = React.useContext(DawApiContext);

  const track = tracks[currentTrack];

  return [{ id: currentTrack, ...track }, dispatch];
};
