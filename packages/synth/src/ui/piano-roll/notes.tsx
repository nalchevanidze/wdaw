import * as React from 'react';
import { colors } from '../styles';
import { CANVAS_HEIGHT } from './utils';
import { NOTE, STEP } from '../common/defs';
import { UINote } from '../common/notes';

type Props = {
  notes: UINote[];
  mouseDown?(
    event: React.MouseEvent<SVGGElement, MouseEvent>,
    note?: UINote
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
      const y = CANVAS_HEIGHT - note.positionY * NOTE;
      const scaleWidth = STEP;

      return (
        <g key={noteIndex}>
          <rect
            onMouseDown={(event) => mouseDown && mouseDown(event, note)}
            width={STEP * note.length}
            height={NOTE}
            stroke="#000"
            strokeWidth={0.25}
            x={note.at * STEP}
            y={y}
          />
          <rect
            width={scaleWidth}
            height={NOTE}
            fill={'gray'}
            fillOpacity={0.1}
            onMouseDown={(event) => scale?.(event)}
            style={{ cursor: 'e-resize' }}
            key={'s' + noteIndex}
            x={(note.at + note.length - 1) * scaleWidth}
            y={y}
          />
        </g>
      );
    })}
  </g>
);

export { Notes };
