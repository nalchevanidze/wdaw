import * as React from 'react';
import { Midi } from '../../engine';
import { MidiLoop } from './midi-loop';
import { useDragging } from '../hooks/use-dragging';
import { distanceX } from '../utils/area';
import { NOTE } from '../common/units';
import { TRACK_HEIGHT } from './defs';
import { useTrackEditor } from '../hooks/use-track-editor';

type Props = {
  midi: Midi;
  id: number;
  width: number;
  y: number;
};

export const Track: React.FC<Props> = ({ id, midi, y }) => {
  const { start, end, clear, move, scale } = useTrackEditor(midi, id);

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
      <rect
        y={y}
        onMouseDown={dragging.onBackground}
        height={TRACK_HEIGHT}
        width="100%"
        opacity={0}
      />
      <MidiLoop
        y={y}
        start={start}
        end={end}
        midi={midi}
        trackId={`track-${id}`}
        height={TRACK_HEIGHT}
        startMove={dragging.onSelected('move')}
        startScale={dragging.onSelected('scale')}
      />
    </g>
  );
};
