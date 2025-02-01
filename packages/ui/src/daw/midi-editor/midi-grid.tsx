import * as React from 'react';
import { BLOCK } from '../../common/units';
import { Keys } from './keyboard';
import { NoteGrid } from '../../components/note-grid';

type Props = { ocatveHeight: number; count: number; strength?: number };

export const MidiGrid: React.FC<Props> = ({
  ocatveHeight,
  count,
  strength = 0.8
}) => (
  <NoteGrid
    strength={strength}
    patternHeight={ocatveHeight}
    height={ocatveHeight * count}
  >
    <Keys width={BLOCK} opacity={0.07} />
  </NoteGrid>
);
