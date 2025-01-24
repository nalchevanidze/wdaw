import * as React from 'react';
import { SvgStage } from '@wdaw/svg';
import { Midi } from '../../engine';
import { colors } from '../styles';
import { ConfiguratorContext } from '../configurator';
import { BLOCK_SIZE, MidiLoop, STAGE_HEIGHT } from './midi-loop';
import { useDragging } from '../hooks/use-dragging';
import { distanceX } from '../utils/area';

type Props = { midi: Midi; name: string; i: number };

export const PANEL = 50 as const;

export const STAGE_WIDTH = BLOCK_SIZE * 4;

export const WIDTH = STAGE_WIDTH + PANEL;

export const viewBox = [-PANEL, 0, WIDTH, STAGE_HEIGHT].join(' ');

const TrackNotes: React.FC<Props> = ({ midi, name, i }) => {
  const [{ tracks }, dispatch] = React.useContext(ConfiguratorContext);
  const [state, setState] = React.useState(midi);

  const dragging = useDragging({
    onMove: {
      select: (area) => {
        // console.log(area);
      },
      move: (area) => {
        const time = area ? distanceX(area, 1) : undefined;

        console.log(time);
      },
      scale: (area) => {
        // console.log(area);
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
    }
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
        width={WIDTH}
        opacity={0}
      />
      <MidiLoop
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
    viewBox={viewBox}
    width={WIDTH}
    height={STAGE_HEIGHT}
    style={{ background: '#FFF', border: '1px solid #BBB', display: 'block' }}
  >
    <TrackNotes {...props} />
  </SvgStage>
);

export default Track;
