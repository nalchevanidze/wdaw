import * as React from 'react';
import { flatten } from '../piano-roll/utils';
import { SvgStage } from '@wdaw/svg';
import { useState } from 'react';
import { NotePoint } from '../types';
import { Midi } from '../../engine';
import { colors } from '../styles';
import { ConfiguratorContext } from '../configurator';

type Props = { midi: Midi; name: string; i: number };

const PANEL = 50 as const;

const BLOCK_SIZE = 128;
const STAGE_WIDTH = BLOCK_SIZE * 3;
const STAGE_HEIGHT = 64;

const WIDTH = STAGE_WIDTH + PANEL;

const viewBox = [-PANEL, 0, WIDTH, STAGE_HEIGHT].join(' ');

const TrackNotes: React.FC<Props> = ({ midi, name, i }) => {
  const [notes, setNotes] = useState<NotePoint[]>(flatten(midi));
  const [{ tracks }, dispatch] = React.useContext(ConfiguratorContext);

  React.useEffect(() => setNotes(flatten(midi)), [midi]);

  const active = i === tracks.currentTrack;

  return (
    <>
      <text x={5 - PANEL} y={32} fill={active ? colors.notes : 'gray'}>
        {name}
      </text>
      <rect
        fill="black"
        opacity={active ? 0.03 : 0.1}
        y={0}
        x={-PANEL}
        width={PANEL}
        height={STAGE_HEIGHT}
        onClick={() => dispatch({ type: 'SET_TRACK', payload: i })}
        style={{ border: 'none', cursor: 'pointer' }}
      />
      <rect
        fill={colors.notesBackground}
        opacity={0.3}
        x={0}
        y={0}
        width={midi.size * 8}
        height={STAGE_HEIGHT}
      />
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
    </>
  );
};

const Track: React.FC<Props> = (props) => (
  <SvgStage
    viewBox={viewBox}
    width={WIDTH}
    height={STAGE_HEIGHT}
    style={{ background: '#FFF', border: '1px solid #BBB', display: 'block' }}
  >
    <TrackNotes {...props} />
  </SvgStage>
);

export default Track;
