import * as React from 'react';
import { colors } from '../styles';
import { NOTE, STEP } from '../common/units';
import { UINote } from '../common/notes';

type Props = {
  notes: UINote[];
  mouseDown?(
    event: React.MouseEvent<SVGGElement, MouseEvent>,
    note?: UINote
  ): void;
  scale?(event: React.MouseEvent<SVGGElement, MouseEvent>): void;
  color?: string;
  height: number;
};

const scaleWidth = 4;

const Notes: React.FC<Props> = ({
  notes,
  color = colors.notes,
  mouseDown,
  scale,
  height
}) => (
  <g fill={color}>
    {notes.map((note, noteIndex) => {
      const start = note.at * STEP;
      const width = note.length * STEP;
      const y = height - note.positionY * NOTE;

      return (
        <g key={noteIndex}>
          <rect
            x={start}
            y={y}
            width={width}
            height={NOTE}
            onMouseDown={(event) => mouseDown && mouseDown(event, note)}
            stroke="#000"
            strokeWidth={0.25}
          />
          <rect
            width={scaleWidth}
            height={NOTE}
            fill={'gray'}
            fillOpacity={0.1}
            onMouseDown={(event) => scale?.(event)}
            style={{ cursor: 'e-resize' }}
            key={'s' + noteIndex}
            x={start + width - scaleWidth}
            y={y}
          />
        </g>
      );
    })}
  </g>
);

export { Notes };
