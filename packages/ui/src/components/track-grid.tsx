import * as React from 'react';
import { NOTE, BLOCK, QUARTER } from '../common/units';
import { VerticalLine } from './vertical-line';

type Props = {
  strength?: number;
};

export const TrackGrid: React.FC<Props> = ({ strength = 0.8 }) => {
  const id = React.useId();
  const childId = React.useId();

  return (
    <g>
      <defs>
        <pattern
          width={NOTE}
          height="100%"
          patternUnits="userSpaceOnUse"
          id={childId}
        >
          <VerticalLine x={0} strength={0.1} />
          <VerticalLine x={NOTE} strength={0.1} />
        </pattern>
        <pattern
          width={BLOCK}
          height="100%"
          patternUnits="userSpaceOnUse"
          id={id}
        >
          <rect width={BLOCK} height="100%" fill={`url(#${childId})`} />
          <VerticalLine x={0} strength={strength} />
          <VerticalLine x={QUARTER} strength={strength / 4} />
          <VerticalLine x={QUARTER * 2} strength={strength / 2} />
          <VerticalLine x={QUARTER * 3} strength={strength / 4} />
          <VerticalLine x={BLOCK} strength={strength} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </g>
  );
};
