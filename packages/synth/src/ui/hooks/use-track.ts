import * as React from 'react';
import { TrackState } from '../../engine/state/state';
import { ConfiguratorContext } from '../configurator';
import { DawDispatch } from '../types';

export const useTrack = (): [TrackState & { id: number }, DawDispatch] => {
  const [
    {
      tracks: { currentTrack, tracks }
    },
    dispatch
  ] = React.useContext(ConfiguratorContext);

  const track = tracks[currentTrack];
  return [{ id: currentTrack, ...track }, dispatch];
};
