import * as React from 'react';
import { colors } from '../styles';
import { NotePoint } from '../types';
import { flatten } from '../piano-roll/utils';
import { Midi } from '../../engine';

export const BLOCK_SIZE = 128;
export const STAGE_HEIGHT = 64;
export const STEP = 8;

type Props = {
  name: string;
  midi: Midi;
};

const MidiLoop: React.FC<Props> = ({ name, midi }) => {
  const notes = React.useMemo<NotePoint[]>(() => flatten(midi), [midi]);
  const [loopStart, loopEnd] = midi.loop;
  const id = `MidiLoop_B_Q_T_D_V_B_D_${name}`;
  const size = loopEnd - loopStart;
  const width = (midi.end - midi.start) * STEP;
  const offset = loopStart * STEP;

  return (
    <g>
      <defs>
        <pattern
          width={size * STEP}
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
                x={note.position - offset}
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
        x={midi.start * STEP}
        width={width}
        height="100%"
        fill={'url(#' + id + ')'}
      />
    </g>
  );
};

export { MidiLoop };
