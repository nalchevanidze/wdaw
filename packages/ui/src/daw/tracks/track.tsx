import * as React from 'react';
import { Midi } from '@wdaw/engine';
import { MidiLoop } from './midi-loop';
import { useDragging } from '../hooks/use-dragging';
import { withAccuracy } from '../utils/area';
import { useTrackEditor } from '../hooks/use-track-editor';

type Props = {
  id: number;
  midi: Midi;
  y: number;
  height: number;
  accuracy: number;
};

export const Track: React.FC<Props> = ({ id, midi, y, height, accuracy }) => {
  const { start, end, clear, move, scale } = useTrackEditor(
    midi.start,
    midi.end,
    id
  );

  const dragging = useDragging({
    onMove: {
      select: () => undefined,
      move: withAccuracy(move, accuracy),
      scale: withAccuracy(scale, accuracy)
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
        height={height}
        startMove={dragging.onStart('move')}
        startScale={dragging.onStart('scale')}
      />
    </g>
  );
};
