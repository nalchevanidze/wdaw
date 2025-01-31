import * as React from 'react';
import { NamedPreset } from '@wdaw/engine';
import { DawDispatch } from '../types';
import { DawApiContext } from '../../context/state';

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
