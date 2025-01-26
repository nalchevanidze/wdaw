import * as React from 'react';

import { ConfiguratorContext } from '../configurator';

type State = { start: number; end: number };

type TrackedState = State & { origin?: State };

export const useTrackEditor = (
  inputStart: number,
  inputEnd: number,
  id: number
) => {
  const [_, dispatch] = React.useContext(ConfiguratorContext);
  const [state, setState] = React.useState<TrackedState>({
    start: inputStart,
    end: inputEnd
  });

  React.useEffect(
    () => setState({ start: inputStart, end: inputEnd }),
    [inputStart, inputEnd]
  );

  const transform = (f: (s: State) => State) => {
    const origin = state.origin ?? state;

    setState({
      ...f(origin),
      origin
    });
  };

  const move = (time: number) =>
    transform(({ start, end }) => ({
      start: start + time,
      end: end + time
    }));

  const scale = (time: number) =>
    transform(({ start, end }) => ({
      start: start,
      end: end + time
    }));

  const { start, end } = state;

  const clear = () => {
    setState({ start, end });

    if (inputStart == start && inputEnd == end) {
      return;
    }

    dispatch({ type: 'SET_MIDI', id, payload: { start, end } });
  };

  return { start, end, clear, move, scale };
};
