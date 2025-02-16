import * as React from 'react';
import { TrackState } from '@wdaw/engine';
import { DawDispatch } from '../types';
import { DawApiContext } from '../../context/state';

export const useTracks = () => {
  const [{ currentTrack, tracks }, dispatch] = React.useContext(DawApiContext);

  // const track = tracks[currentTrack];

  return { tracks, currentTrack, dispatch };
};
