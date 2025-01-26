import * as React from 'react';
import { Midi } from '../../engine';
import { MidiLoop } from './midi-loop';
import { useDragging } from '../hooks/use-dragging';
import { distanceX } from '../utils/area';
import { NOTE } from '../common/units';
import { useTrackEditor } from '../hooks/use-track-editor';

type Props = {
  id: number;
  midi: Midi;
  y: number;
  height: number;
};

export const Track: React.FC<Props> = ({ id, midi, y, height }) => {
  const { start, end, clear, move, scale } = useTrackEditor(midi.start, midi.end, id);

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
        height={height}
        width="100%"
        opacity={0}
      />
      <MidiLoop
        y={y}
        start={start}
        end={end}
        midi={midi}
        trackId={`track-${id}`}
        height={height}
        startMove={dragging.onSelected('move')}
        startScale={dragging.onSelected('scale')}
      />
    </g>
  );
};
