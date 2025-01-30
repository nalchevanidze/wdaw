import * as React from 'react';
import { TrackState } from '../../engine/state/state';
import { DawDispatch } from '../types';
import { DawApiContext } from '../context/daw-state';

export const useTrack = (): [TrackState & { id: number }, DawDispatch] => {
  const [
    {
      tracks: { currentTrack, tracks }
    },
    dispatch
  ] = React.useContext(DawApiContext);

  const track = tracks[currentTrack];
  return [{ id: currentTrack, ...track }, dispatch];
};
