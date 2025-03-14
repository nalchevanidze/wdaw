import * as React from 'react';
import { DawApiContext } from '../../context/state';
import { DynamicValueInput } from '@wdaw/engine';

type Panel = {
  name: string;
  index: number;
  active: boolean;
  gain: number;
  gainController: DynamicValueInput;
  setGain(g: DynamicValueInput): void;
  setTrack(): void;
};

export const usePanels = () => {
  const { currentTrack, tracks, gains, dispatch } =
    React.useContext(DawApiContext);

  const panels = tracks.map(
    ({ name }, index): Panel => ({
      index,
      active: index === currentTrack,
      name,
      gain: gains[index] ?? 0,
      gainController: tracks[index].gain,
      setTrack: () => dispatch({ type: 'TRACK/SET_CURRENT', trackId: index }),
      setGain: (gain:DynamicValueInput) =>
        dispatch({
          type: 'TRACK/SET_TRACK',
          trackId: index,
          payload: { gain }
        })
    })
  );

  return { panels };
};
