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

export const usePreset = () => {
  const { presets, currentTrack, tracks, dispatch } =
    React.useContext(DawApiContext);
  const { presetId } = tracks[currentTrack];
  const current = presets[presetId];

  const setWave = (id: WAVE_ID, payload: number) =>
    dispatch({ type: 'PRESET/SET_WAVE', id, payload });

  const setFilter = (id: FILTER_ID, payload: number) =>
    dispatch({ type: 'PRESET/SET_FILTER', id, payload });

  const options = Object.values(presets).map(({ id, name }) => ({
    id,
    name,
    active: id === presetId,
    onclick: () =>
      dispatch({
        type: 'PRESET/ASSIGN_TO_TRACK',
        trackId: currentTrack,
        presetId: id
      })
  }));

  const toggleARP = (l: Location) =>
    dispatch({
      type: 'PRESET/SET_SEQUENCE',
      payload: toggleARPNote(current.sequence, l)
    });

  const setEnvelope = (id: ENVELOPE_ID) => (payload: Partial<EnvelopeConfig>) =>
    dispatch({ type: 'PRESET/SET_ENVELOPE', id, payload });

  const getModule = (id: 'filter' | 'sequence') => ({
    disabled: !current[id].enabled,
    toggle: () => dispatch({ type: 'PRESET/TOGGLE_MODULE', id })
  });

  const newPreset = () =>
    dispatch({ type: 'PRESET/NEW_PRESET', trackId: currentTrack });

  return {
    ...current,
    options,
    setWave,
    setFilter,
    toggleARP,
    setEnvelope,
    getModule,
    newPreset
  };
};
