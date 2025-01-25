import * as React from 'react';
import { SvgStage } from '@wdaw/svg';
import { Midi } from '../../engine';
import { colors } from '../styles';
import { ConfiguratorContext } from '../configurator';
import { MidiLoop, STAGE_HEIGHT } from './midi-loop';
import { useDragging } from '../hooks/use-dragging';
import { distanceX } from '../utils/area';
import { QUARTER } from '../common/defs';

type Props = { midi: Midi; name: string; i: number};

export const PANEL = 50 as const;

export const STAGE_WIDTH = QUARTER * 4;

export const WIDTH = STAGE_WIDTH + PANEL;

type State = { start: number; end: number };
type TrackedState = State & { origin?: State };

const TrackNotes: React.FC<Props> = ({ midi, name, i }) => {
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
    dispatch({ type: 'SET_MIDI', id: i, payload: { ...midi, ...state } });
  };

  const dragging = useDragging({
    onMove: {
      select: (area) => {
        // console.log(area);
      },
      move: (area) => {
        if (!area) return;

        const time = distanceX(area, 8);
        update(({ start, end }) => ({
          start: start + time,
          end: end + time
        }));
      },
      scale: (area) => {
        if (!area) return;
        const time = distanceX(area, 8);
        update(({ start, end }) => ({
          start: start,
          end: end + time
        }));
      }
    },
    onBackground: () => {
      console.log('background');
      // notes.addAt(point);
      return 'scale';
    },
    onInactive: () => {
      //notes.select(note);
      return 'move';
    },
    onEnd: clear
  });

  const active = i === tracks.currentTrack;

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
        onClick={() => dispatch({ type: 'SET_TRACK', payload: i })}
        style={{ border: 'none', cursor: 'pointer' }}
      />
      <rect
        onMouseDown={dragging.onBackground}
        height={STAGE_HEIGHT}
        width="100%"
        opacity={0}
      />
      <MidiLoop
        start={state.start}
        end={state.end}
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
    viewBox={[-PANEL, 0, WIDTH, STAGE_HEIGHT].join(' ')}
    width={WIDTH}
    height={STAGE_HEIGHT}
    style={{ background: '#FFF', border: '1px solid #BBB', display: 'block' }}
  >
    <TrackNotes {...props} />
  </SvgStage>
);

export default Track;
