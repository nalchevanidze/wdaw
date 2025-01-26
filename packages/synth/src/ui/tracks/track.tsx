import * as React from 'react';
import { Midi } from '../../engine';
import { colors } from '../styles';
import { MidiLoop, STAGE_HEIGHT } from './midi-loop';
import { useDragging } from '../hooks/use-dragging';
import { distanceX } from '../utils/area';
import { NOTE } from '../common/units';
import { PANEL } from './defs';
import { useTrackEditor } from '../hooks/use-track-editor';

type Props = { midi: Midi; name: string; id: number; width: number };

export const Track: React.FC<Props> = ({ id, name, midi }) => {
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

  const y = id * STAGE_HEIGHT;

  return (
    <g
      onMouseMove={dragging.onMove}
      onMouseLeave={dragging.end}
      onMouseUp={dragging.end}
    >
      <text x={5 - PANEL} y={y + 32} fill={active ? colors.notes : 'gray'}>
        {name}
      </text>
      <rect
        fill="black"
        opacity={active ? 0.03 : 0.1}
        y={y}
        x={-PANEL}
        width={PANEL}
        height={STAGE_HEIGHT}
        onClick={setTrack}
        style={{ border: 'none', cursor: 'pointer' }}
      />
      <rect
        y={y}
        onMouseDown={dragging.onBackground}
        height={STAGE_HEIGHT}
        width={STAGE_HEIGHT}
        opacity={0}
      />
      <MidiLoop
        y={y}
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
