import * as React from 'react';
import { Envelope, Filter, Sequence, Wave } from '@wdaw/engine';
import { DawApiContext } from '../../context/state';
import { toggleARPNote, Location } from '../utils/arp';
import { ENVELOPE } from '../../state/types';

export const usePreset = () => {
  const { presets, currentTrack, tracks, dispatch } =
    React.useContext(DawApiContext);
  const { presetId } = tracks[currentTrack];
  const current = presets[presetId];
  const trackId = currentTrack;

  const setWave = (id: keyof Wave, value: number) =>
    dispatch({
      trackId,
      presetId,
      type: 'PRESET/SET_WAVE',
      wave: { [id]: value }
    });

  const setFilter = (id: keyof Filter, value: number) =>
    dispatch({
      trackId,
      presetId,
      type: 'PRESET/SET_FILTER',
      filter: { [id]: value }
    });

  const options = Object.values(presets).map(({ id, name }) => ({
    id,
    name,
    active: id === presetId,
    onclick: () =>
      dispatch({ type: 'PRESET/ASSIGN_TO_TRACK', trackId, presetId: id })
  }));

  const toggleARP = (l: Location) =>
    dispatch({
      trackId,
      presetId,
      type: 'PRESET/SET_SEQUENCE',
      payload: toggleARPNote(current.sequence, l)
    });

  const setEnvelope = (id: ENVELOPE) => (payload: Partial<Envelope>) =>
    dispatch({ trackId, presetId, type: 'PRESET/SET_ENVELOPE', id, payload });

  const getModule = (id: 'filter' | 'sequence') => ({
    disabled: !current[id].enabled,
    toggle: () =>
      dispatch({ trackId, presetId, type: 'PRESET/TOGGLE_MODULE', id })
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
