import * as React from 'react';

import { ConfiguratorContext } from '../configurator';

type State = { start: number; end: number };

type TrackedState = State & { origin?: State };

export const useTrackEditor = (input: State, id: number) => {
  const [_, dispatch] = React.useContext(ConfiguratorContext);
  const [state, setState] = React.useState<TrackedState>({
    start: input.start,
    end: input.end
  });

  React.useEffect(() => {
    setState({ start: input.start, end: input.end });
  }, [input.start, input.end]);

  const transform = (f: (s: State) => State) => {
    const origin = state.origin ?? state;

    setState({
      ...f(origin),
      origin
    });
  };

  const clear = () => {
    setState({
      start: state.start,
      end: state.end
    });

    if (input.start == state.start && input.end == state.end) {
      return;
    }

    dispatch({ type: 'SET_MIDI', id, payload: { ...state } });
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

  return { start, end, clear, move, scale };
};
