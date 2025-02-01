import * as React from 'react';
import { colors } from '../styles';
import { LinePattern } from './vertical-line';

type Props = {
  height: number;
  size: number;
  strength?: number;
};

export const Tapeline: React.FC<Props> = ({ height, size, strength = 0.8 }) => {
  const id = React.useId();
  const gridSize = size * 8;

  return (
    <g>
      <defs>
        <pattern
          width={gridSize}
          height={height}
          patternUnits="userSpaceOnUse"
          id={id}
        >
          <rect width={gridSize} height={height} fill={colors.background} />
          <LinePattern size={size} strength={strength} height={height} />
        </pattern>
      </defs>
      <rect width="100%" height={height} y={-height} fill={`url(#${id})`} />
    </g>
  );
};
