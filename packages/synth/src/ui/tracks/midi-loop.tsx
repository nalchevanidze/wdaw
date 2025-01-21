import * as React from 'react';
import { colors } from '../styles';
import { NotePoint } from '../types';

export const BLOCK_SIZE = 128;
export const STAGE_HEIGHT = 64;
export const STEP = 8;

type Props = { start: number; end: number; notes: NotePoint[]; name: string };

const MidiLoop: React.FC<Props> = ({ start, end, notes, name }) => {
  const id = `MidiLoop_B_Q_T_D_V_B_D_${name}`;

  const width = (end - start) * STEP;

  console.log(width)

  return (
    <g>
      <defs>
        <pattern
          width={BLOCK_SIZE}
          height={STAGE_HEIGHT}
          patternUnits="userSpaceOnUse"
          id={id}
        >
          <g fill={colors.notes}>
            {notes.map((note, noteIndex) => (
              <rect
                key={noteIndex}
                width={note.length}
                height={1}
                x={note.position}
                y={STAGE_HEIGHT - note.i}
              />
            ))}
          </g>
          <rect
            fill={colors.notesBackground}
            opacity={0.3}
            width="100%"
            height="100%"
          />
        </pattern>
      </defs>
      <rect
        x={start * STEP}
        width={width}
        height="100%"
        fill={'url(#' + id + ')'}
      />
    </g>
  );
};

export { MidiLoop };
