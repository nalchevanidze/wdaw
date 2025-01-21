import * as React from 'react';
import { colors } from '../styles';
import { NotePoint } from '../types';

const BLOCK_SIZE = 128;
const STAGE_HEIGHT = 64;
const MIDI_STEP = 8;

type Props = { notes: NotePoint[]; name: string };

const MidiLoop: React.FC<Props> = ({ notes, name }) => {
  const id = `MidiLoop_B_Q_T_D_V_B_D_${name}`;

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
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={'url(#' + id + ')'} />
      <rect
        fill={colors.notesBackground}
        opacity={0.3}
        width="100%"
        height="100%"
      />
    </g>
  );
};

export { MidiLoop };
