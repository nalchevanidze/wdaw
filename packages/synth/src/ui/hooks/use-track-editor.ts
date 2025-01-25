import * as React from 'react';

import { Midi } from '../../engine';
import { ConfiguratorContext } from '../configurator';

type State = { start: number; end: number };

type TrackedState = State & { origin?: State };

export const useTrackEditor = (midi: Midi, id: number) => {
    const [{ tracks }, dispatch] = React.useContext(ConfiguratorContext);
    const [state, setState] = React.useState<TrackedState>({
      start: midi.start,
      end: midi.end
    });
  
    React.useEffect(() => {
      setState({ start: midi.start, end: midi.end });
    }, [midi.start, midi.end]);
  
    const update = (f: (s: State) => State) => {
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
      dispatch({ type: 'SET_MIDI', id, payload: { ...midi, ...state } });
    };
  
    const active = id === tracks.currentTrack;
  
    const setTrack = () => dispatch({ type: 'SET_TRACK', payload: id });
  
    const move = (time: number) =>
      update(({ start, end }) => ({
        start: start + time,
        end: end + time
      }));
  
    const scale = (time: number) =>
      update(({ start, end }) => ({
        start: start,
        end: end + time
      }));
  
    const { start, end } = state;
    return { start, end, clear, active, setTrack, move, scale };
  };
  