import * as React from 'react';
import { NOTE, BLOCK } from '../common/units';
import { LinePattern } from './vertical-line';

type Props = {
  strength?: number;
  children?: React.ReactNode;
  patternHeight?: number | string;
  height?: number | string;
};

export const NoteGrid: React.FC<Props> = ({
  strength = 0.8,
  children,
  patternHeight = '100%',
  height = '100%'
}) => {
  const id = React.useId();

  return (
    <g>
      <defs>
        <pattern
          width={BLOCK}
          height={patternHeight}
          patternUnits="userSpaceOnUse"
          id={id}
        >
          {children}
          <LinePattern size={NOTE * 2} strength={strength} />
        </pattern>
      </defs>
      <rect width="100%" height={height} fill={`url(#${id})`} />
    </g>
  );
};
