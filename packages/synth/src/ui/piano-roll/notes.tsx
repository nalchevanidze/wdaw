import * as React from 'react';
import { colors } from '../styles';
import { CANVAS_HEIGHT } from './utils';
import { NOTE_SIZE, NOTE_STEP } from '../common/defs';
import { NotePoint } from '../common/notes';

type Props = {
  notes: NotePoint[];
  mouseDown?(
    event: React.MouseEvent<SVGGElement, MouseEvent>,
    note?: NotePoint
  ): void;
  scale?(event: React.MouseEvent<SVGGElement, MouseEvent>): void;
  color?: string;
};

const Notes: React.FC<Props> = ({
  notes,
  color = colors.notes,
  mouseDown,
  scale
}) => (
  <g fill={color}>
    {notes.map((note, noteIndex) => {
      const y = CANVAS_HEIGHT - note.i * NOTE_SIZE;
      const scaleWidth = NOTE_STEP;

      return (
        <g key={noteIndex}>
          <rect
            onMouseDown={(event) => mouseDown && mouseDown(event, note)}
            width={NOTE_STEP * note.length}
            height={NOTE_SIZE}
            stroke="#000"
            strokeWidth={0.25}
            x={note.position * NOTE_STEP}
            y={y}
          />
          <rect
            width={scaleWidth}
            height={NOTE_SIZE}
            fill={'gray'}
            fillOpacity={0.1}
            onMouseDown={(event) => scale?.(event)}
            style={{ cursor: 'e-resize' }}
            key={'s' + noteIndex}
            x={(note.position + note.length - 1) * scaleWidth}
            y={y}
          />
        </g>
      );
    })}
  </g>
);

export { Notes };
