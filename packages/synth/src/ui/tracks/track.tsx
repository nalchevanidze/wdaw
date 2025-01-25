import * as React from 'react';
import { SvgStage } from '@wdaw/svg';
import { Midi } from '../../engine';
import { colors } from '../styles';
import { ConfiguratorContext } from '../configurator';
import { MidiLoop, STAGE_HEIGHT } from './midi-loop';
import { useDragging } from '../hooks/use-dragging';
import { distanceX } from '../utils/area';
import { NOTE_SIZE, QUARTER } from '../common/defs';
import { PANEL } from './defs';
import { Area } from '../types';

type Props = { midi: Midi; name: string; id: number; width: number };

type State = { start: number; end: number };
type TrackedState = State & { origin?: State };

const useTrackEditor = (midi: Midi, id: number) => {
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

const TrackNotes: React.FC<Props> = ({ id, name, midi }) => {
  const { start, end, active, clear, setTrack, move, scale } = useTrackEditor(
    midi,
    id
  );

  const dragging = useDragging({
    onMove: {
      select: () => {},
      move: (area) => (area ? move(distanceX(area, NOTE_SIZE)) : undefined),
      scale: (area) => (area ? scale(distanceX(area, NOTE_SIZE)) : undefined)
    },
    onEnd: clear
  });

  return (
    <g
      onMouseMove={dragging.onMove}
      onMouseLeave={dragging.end}
      onMouseUp={dragging.end}
    >
      <text x={5 - PANEL} y={32} fill={active ? colors.notes : 'gray'}>
        {name}
      </text>
      <rect
        fill="black"
        opacity={active ? 0.03 : 0.1}
        y={0}
        x={-PANEL}
        width={PANEL}
        height={STAGE_HEIGHT}
        onClick={setTrack}
        style={{ border: 'none', cursor: 'pointer' }}
      />
      <rect
        onMouseDown={dragging.onBackground}
        height={STAGE_HEIGHT}
        width="100%"
        opacity={0}
      />
      <MidiLoop
        start={start}
        end={end}
        midi={midi}
        name={name}
        startMove={dragging.onSelected('move')}
        startScale={dragging.onSelected('scale')}
      />
    </g>
  );
};

const Track: React.FC<Props> = (props) => (
  <SvgStage
    viewBox={[-PANEL, 0, props.width, STAGE_HEIGHT].join(' ')}
    width={props.width}
    height={STAGE_HEIGHT}
    style={{ background: '#FFF', border: '1px solid #BBB', display: 'block' }}
  >
    <TrackNotes {...props} />
  </SvgStage>
);

export default Track;
