import * as React from 'react';
import { NamedPreset } from '../../engine/state/state';
import { DawDispatch } from '../types';
import { DawApiContext } from '../context/daw-state';

export const usePreset = (): [NamedPreset, DawDispatch] => {
  const [
    {
      tracks: { currentTrack, tracks }
    },
    dispatch
  ] = React.useContext(DawApiContext);

  const track = tracks[currentTrack];
  return [track.preset, dispatch];
};
