import * as React from 'react';
import { colors } from '../styles';
import { GraphNote } from '../types';
import { CANVAS_HEIGHT, NOTE_SIZE, NOTE_STEP } from './utils';

type Props = {
  notes: GraphNote[];
  mouseDown?(event: any, note?: GraphNote): void;
  resize?(event: any): void;
  color?: string;
};

const Notes: React.FC<Props> = ({
  notes,
  color = colors.notes,
  mouseDown,
  resize
}) => (
  <g fill={color}>
    {notes.map((note, noteIndex) => {
      const y = CANVAS_HEIGHT - note.i * NOTE_SIZE;

      return (
        <g key={noteIndex}>
          <rect
            onMouseDown={(event) => mouseDown && mouseDown(event, note)}
            width={NOTE_STEP * note.length}
            height={NOTE_SIZE}
            stroke="#000"
            strokeWidth={0.25}
            x={note.position * 5}
            y={y}
          />
          <rect
            width={5}
            height={NOTE_SIZE}
            fill={'gray'}
            fillOpacity={0.1}
            onMouseDown={(event) => resize && resize(event)}
            style={{ cursor: 'e-resize' }}
            key={'s' + noteIndex}
            x={(note.position + note.length - 1) * 5}
            y={y}
          />
        </g>
      );
    })}
  </g>
);

export { Notes };
