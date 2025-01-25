import * as React from 'react';
import { colors } from '../styles';
import { NotePoint } from '../types';
import { flatten } from '../piano-roll/utils';
import { Midi } from '../../engine';

export const BLOCK_SIZE = 128;
export const STAGE_HEIGHT = 64;
export const STEP = 8;

type Props = {
  start: number;
  end: number;
  name: string;
  midi: Midi;
  startMove?(event: React.MouseEvent<SVGGElement, MouseEvent>): void;
  startScale?(event: React.MouseEvent<SVGGElement, MouseEvent>): void;
};

const MidiLoop: React.FC<Props> = ({
  name,
  midi,
  start,
  end,
  startMove,
  startScale
}) => {
  const notes = React.useMemo<NotePoint[]>(() => flatten(midi), [midi]);
  const [loopStart, loopEnd] = midi.loop;
  const id = `MidiLoop_B_Q_T_D_V_B_D_${name}`;

  const loopWidth = loopEnd - loopStart;
  const containerWidth = (end - start) * STEP;
  const containerStart = start * STEP;
  const containerEnd = containerStart + containerWidth;
  const scaleWidth = 5;
  const noteOffset = loopStart * STEP;
  const loopOffset = (start % loopWidth) * 8;


  return (
    <g>
      <defs>
        <pattern
          width={loopWidth * STEP}
          height={STAGE_HEIGHT}
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
                x={note.position - noteOffset}
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
        onMouseDown={(event) => startMove?.(event)}
        x={containerStart}
        width={containerWidth}
        height="100%"
        fill={'url(#' + id + ')'}
      />
      <rect
        x={containerEnd - scaleWidth}
        width={scaleWidth}
        height="100%"
        fill={'gray'}
        fillOpacity={0.1}
        onMouseDown={(event) => startScale?.(event)}
        style={{ cursor: 'e-resize' }}
      />
    </g>
  );
};

export { MidiLoop };
