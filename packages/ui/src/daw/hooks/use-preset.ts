import * as React from 'react';
import { FILTER_ID, Sequence, WAVE_ID } from '@wdaw/engine';
import { DawApiContext } from '../../context/state';
import { toggleARPNote, Location } from '../utils/arp';
import { PANEL_ID } from '../../state/types';

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
    active: id === presetId,
    onclick: () => dispatch({ type: 'SET_PRESET', payload: id })
  }));

  const toggleARP = (l: Location) =>
    dispatch({
      type: 'SET_SEQUENCE',
      payload: toggleARPNote(presets.sequence, l)
    });

  const togglePanel = (id: PANEL_ID) => dispatch({ type: 'TOGGLE_PANEL', id });


  const isModuleEnabled = (id: PANEL_ID) => {
    const target = id ? presets[presetId][id] : undefined;
  
    return Boolean(target && 'enabled' in target && target.enabled)
  }

  return {
    ...presets[presetId],
    options,
    setWave,
    setFilter,
    toggleARP,
    dispatch,
    togglePanel,
    isModuleEnabled
  };
};
