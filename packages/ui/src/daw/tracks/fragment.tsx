import * as React from 'react';
import { colors } from '../../styles';
import { MEvent } from '../types';
import { useMidiFragment } from '../hooks/use-midi-fragment';

type Props = {
  start: number;
  end: number;
  fragmentId: string;
  y: number;
  height: number;
  startMove?(event: MEvent): void;
  startScale?(event: MEvent): void;
  color: string;
};

export const Fragment: React.FC<Props> = ({
  fragmentId,
  start,
  end,
  startMove,
  startScale,
  y,
  color,
  height
}) => {
  const { name, notes, loopStart, loopWidth } = useMidiFragment(fragmentId);

  const id = React.useId();
  const midiWith = end - start;
  const containerEnd = start + midiWith;
  const scaleWidth = 5;
  const loopOffset = start % loopWidth;

  return (
    <g>
      <defs>
        <pattern
          width={loopWidth}
          height={height}
          patternUnits="userSpaceOnUse"
          id={id}
          x={loopOffset}
        >
          <g fill={colors.notes}>
            {notes.map((note, noteIndex) => (
              <rect
                key={noteIndex}
                width={note.length}
                height={1}
                x={note.x - loopStart}
                y={height - note.y}
              />
            ))}
          </g>
          <rect fill={color} opacity={0.4} width="100%" height="100%" />
        </pattern>
      </defs>
      <text
        color={colors.black}
        x={start + 4}
        y={y + height / 3}
        fontSize="8px"
        textAnchor="start"
        fontFamily="sans-serif"
        opacity={0.6}
        width={midiWith}
        cursor="pointer"
      >
        {name}
      </text>
      <rect
        y={y}
        onMouseDown={(event) => startMove?.(event)}
        x={start}
        width={midiWith}
        height={height}
        fill={'url(#' + id + ')'}
        stroke={colors.notesBackground}
        strokeWidth={0.3}
      />
      <rect
        x={containerEnd - scaleWidth}
        y={y}
        width={scaleWidth}
        height={height}
        fill={'gray'}
        fillOpacity={0.05}
        onMouseDown={(event) => startScale?.(event)}
        style={{ cursor: 'e-resize' }}
      />
    </g>
  );
};
