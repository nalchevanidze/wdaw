import * as React from 'react';
import { colors } from '../../styles';
import { UINote } from '../utils/notes';
import { MEvent } from '../types';

type Props = {
  notes: UINote[];
  mouseDown?(event: MEvent, note?: UINote): void;
  scale?(event: MEvent): void;
  color?: string;
  height: number;
  noteHeight: number;
};

const scaleWidth = 1;

const Notes: React.FC<Props> = ({
  notes,
  color = colors.notes,
  mouseDown,
  scale,
  height,
  noteHeight
}) => (
  <g fill={color}>
    {notes.map((note, noteIndex) => {
      const start = note.at;
      const width = note.length;
      const y = height - note.y * noteHeight;

      return (
        <g key={noteIndex}>
          <rect
            x={start}
            y={y}
            width={width}
            height={noteHeight}
            onMouseDown={(event) => mouseDown && mouseDown(event, note)}
            stroke="#000"
            strokeWidth={0.25}
          />
          <rect
            width={scaleWidth}
            height={noteHeight}
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
