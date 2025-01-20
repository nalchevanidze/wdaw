import * as React from 'react';
import { Notes } from '../piano-roll/notes';
import {
  flatten,
  STAGE_WIDTH,
  STAGE_HEIGHT,
  CANVAS_HEIGHT,
  NOTE_SIZE,
  NOTE_STEP
} from '../piano-roll/utils';
import { SvgStage } from '@wdaw/svg';
import { useState } from 'react';
import { NotePoint } from '../types';
import { Midi } from '../../engine';
import { colors } from '../styles';

const viewBox = [0, 60, STAGE_WIDTH - 20, STAGE_HEIGHT - 60].join(' ');

type Props = { midi: Midi };

const TrackNotes: React.FC<Props> = ({ midi }) => {
  const [notes, setNotes] = useState<NotePoint[]>(flatten(midi));

  React.useEffect(() => setNotes(flatten(midi)), [midi]);

  return (
    <g fill={colors.notes}>
      {notes.map((note, noteIndex) => (
        <g key={noteIndex}>
          <rect
            width={NOTE_STEP * note.length}
            height={NOTE_SIZE}
            stroke="#000"
            strokeWidth={0.25}
            x={note.position * 5}
            y={CANVAS_HEIGHT - note.i * NOTE_SIZE}
          />
        </g>
      ))}
    </g>
  );
};

const Track: React.FC<Props> = (props) => (
  <SvgStage
    viewBox={viewBox}
    width="50px"
    height="40px"
    style={{ background: '#FFF' }}
  >
    <TrackNotes {...props} />
  </SvgStage>
);

export default Track;
