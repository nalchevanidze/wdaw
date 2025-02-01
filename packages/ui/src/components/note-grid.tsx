import * as React from 'react';
import { NOTE, BLOCK, QUARTER } from '../common/units';
import { VerticalLine } from './vertical-line';

type Props = {
  strength?: number;
  children?: React.ReactNode;
  patternHeight?: number | string;
  height?: number | string;
};

export const NoteGrid: React.FC<Props> = ({
  strength = 0.8,
  children,
  patternHeight= "100%",
  height = "100%"
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
          <VerticalLine at={0} strength={0.1} />
          <VerticalLine at={NOTE} strength={0.1} />
        </pattern>
        <pattern
          width={BLOCK}
          height={patternHeight}
          patternUnits="userSpaceOnUse"
          id={id}
        >
          {children}
          <rect width={BLOCK} height="100%" fill={`url(#${noteId})`} />
          <VerticalLine at={0} strength={strength} />
          <VerticalLine at={QUARTER} strength={strength / 4} />
          <VerticalLine at={QUARTER * 2} strength={strength / 2} />
          <VerticalLine at={QUARTER * 3} strength={strength / 4} />
          <VerticalLine at={BLOCK} strength={strength} />
        </pattern>
      </defs>
      <rect width="100%" height={height} fill={`url(#${id})`} />
    </g>
  );
};