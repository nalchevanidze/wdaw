import * as React from 'react';
import {
  ENVELOPE_ID,
  EnvelopeConfig,
  FILTER_ID,
  Sequence,
  WAVE_ID
} from '@wdaw/engine';
import { DawApiContext } from '../../context/state';
import { toggleARPNote, Location } from '../utils/arp';
import { PANEL_ID } from '../../state/types';

export const usePreset = () => {
  const [{ presets, currentTrack, tracks }, dispatch] =
    React.useContext(DawApiContext);
  const { presetId } = tracks[currentTrack];
  const current = presets[presetId];

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
      payload: toggleARPNote(current.sequence, l)
    });

  const setEnvelope = (id: ENVELOPE_ID) => (payload: Partial<EnvelopeConfig>) =>
    dispatch({ type: 'SET_ENVELOPE', id, payload });

  const getModule = (id: 'filter' | 'sequence') => ({
    disabled: !current[id].enabled,
    toggle: () => dispatch({ type: 'TOGGLE_PANEL', id })
  });

  return {
    ...current,
    options,
    setWave,
    setFilter,
    toggleARP,
    setEnvelope,
    getModule
  };
};
