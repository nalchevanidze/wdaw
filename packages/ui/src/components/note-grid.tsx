import * as React from 'react';
import { LinePattern } from './vertical-line';

type Props = {
  strength?: number;
  children?: React.ReactNode;
  patternHeight?: number | string;
  height?: number | string;
  size: number
};

export const NoteGrid: React.FC<Props> = ({
  strength = 0.8,
  children,
  patternHeight = '100%',
  height = '100%',
  size
}) => {
  const id = React.useId();

  return (
    <g>
      <defs>
        <pattern
          width={size}
          height={patternHeight}
          patternUnits="userSpaceOnUse"
          id={id}
        >
          {children}
          <LinePattern size={size/ 8} strength={strength} />
        </pattern>
      </defs>
      <rect width="100%" height={height} fill={`url(#${id})`} />
    </g>
  );
};
