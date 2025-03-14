import * as React from 'react';
import { DawApiContext } from '../../context/state';

type Panel = {
  name: string;
  index: number;
  active: boolean;
  gain: number;
  setGain(g: number): void;
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
      gain: gains[index] ?? tracks[index].gain.value,
      setTrack: () => dispatch({ type: 'TRACK/SET_CURRENT', trackId: index }),
      setGain: (gain) =>
        dispatch({
          type: 'TRACK/SET_TRACK',
          trackId: index,
          payload: { gain: { type: 'fixed', value: gain } }
        })
    })
  );

  return { panels };
};
