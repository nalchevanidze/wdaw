import * as React from 'react';
import { NamedPreset } from '../../engine/state/state';
import { ConfiguratorContext } from '../configurator';
import { DawDispatch } from '../types';

export const usePreset = (): [NamedPreset, DawDispatch] => {
  const [
    {
      tracks: { currentTrack, tracks }
    },
    dispatch
  ] = React.useContext(ConfiguratorContext);

  const track = tracks[currentTrack];
  return [track.preset, dispatch];
};
