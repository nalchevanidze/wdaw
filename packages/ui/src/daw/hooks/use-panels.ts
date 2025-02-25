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
  const [{ currentTrack, tracks }, dispatch] = React.useContext(DawApiContext);

  const panels = tracks.map(
    ({ name }, index): Panel => ({
      index,
      active: index === currentTrack,
      name,
      gain: tracks[index].gain,
      setTrack: () => dispatch({ type: 'TRACK/SET_CURRENT', payload: index }),
      setGain: (gain) =>
        dispatch({ type: 'TRACK/SET_TRACK', id: index, payload: { gain } })
    })
  );

  return { panels };
};
