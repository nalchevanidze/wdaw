import * as React from 'react';
import { FILTER_ID, WAVE_ID } from '@wdaw/engine';
import { DawApiContext } from '../../context/state';

export const usePreset = () => {
  const [{ presets, currentTrack, tracks }, dispatch] =
    React.useContext(DawApiContext);
  const { presetId } = tracks[currentTrack];

  const setWave = (id: WAVE_ID, payload: number) =>
    dispatch({ type: 'SET_WAVE', id, payload });

  const setFilter = (id: FILTER_ID, payload: number) =>
    dispatch({ type: 'SET_FILTER', id, payload });

  const options = Object.keys(presets).map((id) => ({
    id,
    onclick: () => dispatch({ type: 'SET_PRESET', payload: id })
  }));

  return {
    ...presets[presetId],
    options,
    setWave,
    setFilter,
    dispatch
  };
};
