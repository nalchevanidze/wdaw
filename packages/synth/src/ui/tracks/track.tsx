import * as React from 'react';
import { SvgStage } from '@wdaw/svg';
import { Midi } from '../../engine';
import { colors } from '../styles';
import { MidiLoop, STAGE_HEIGHT } from './midi-loop';
import { useDragging } from '../hooks/use-dragging';
import { distanceX } from '../utils/area';
import { NOTE } from '../common/defs';
import { PANEL } from './defs';
import { useTrackEditor } from '../hooks/use-track-editor';

type Props = { midi: Midi; name: string; id: number; width: number };

const TrackNotes: React.FC<Props> = ({ id, name, midi }) => {
  const { start, end, active, clear, setTrack, move, scale } = useTrackEditor(
    midi,
    id
  );

  const dragging = useDragging({
    onMove: {
      select: () => {},
      move: (area) => (area ? move(distanceX(area, NOTE)) : undefined),
      scale: (area) => (area ? scale(distanceX(area, NOTE)) : undefined)
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
