import * as React from 'react';
import { Preset } from '@wdaw/engine';
import { DawDispatch } from '../types';
import { DawApiContext } from '../../context/state';

export const usePreset = (): [Preset & { names: string[] }, DawDispatch] => {
  const [{ presets, currentTrack, tracks }, dispatch] =
    React.useContext(DawApiContext);

  const track = tracks[currentTrack];
  return [{ ...track.preset, names: presets.map((p) => p.name) }, dispatch];
};
