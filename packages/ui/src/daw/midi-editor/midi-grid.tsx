import * as React from 'react';
import { NOTE, BLOCK, QUARTER } from '../../common/units';
import { Keys } from './keyboard';
import { VerticalLine } from '../../components/vertical-line';

type Props = { ocatveHeight: number; count: number; strength?: number };

export const MidiGrid: React.FC<Props> = ({
  ocatveHeight,
  count,
  strength = 0.8
}) => {
  const id = React.useId();
  const noteId = React.useId();

  return (
    <g>
      <defs>
        <pattern
          width={NOTE}
          height="100%"
          patternUnits="userSpaceOnUse"
          id={noteId}
        >
          <VerticalLine x={0} strength={0.1} />
          <VerticalLine x={NOTE} strength={0.1} />
        </pattern>
        <pattern
          width={BLOCK}
          height={ocatveHeight}
          patternUnits="userSpaceOnUse"
          id={id}
        >
          <Keys width={BLOCK} opacity={0.07} />
          <rect width={BLOCK} height="100%" fill={`url(#${noteId})`} />
          <VerticalLine x={0} strength={strength} />
          <VerticalLine x={QUARTER} strength={strength / 4} />
          <VerticalLine x={QUARTER * 2} strength={strength / 2} />
          <VerticalLine x={QUARTER * 3} strength={strength / 4} />
          <VerticalLine x={BLOCK} strength={strength} />
        </pattern>
      </defs>
      <rect width="100%" height={ocatveHeight * count} fill={`url(#${id})`} />
    </g>
  );
};
