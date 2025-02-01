import * as React from 'react';
import { colors } from '../styles';
import { VerticalLine } from './vertical-line';

type Props = {
  height: number;
  size: number;
};

export const Tapeline: React.FC<Props> = ({ height, size }) => {
  const parent = React.useId();
  const gridSize = size * 4;

  const strength = 0.4;

  return (
    <g>
      <defs>
        <pattern
          width={gridSize}
          height={height}
          patternUnits="userSpaceOnUse"
          id={parent}
        >
          <rect width={gridSize} height={height} fill={colors.background} />
          <VerticalLine x={0} strength={strength * 2} height={height} />
          <VerticalLine x={size} strength={strength} height={height / 3} />
          <VerticalLine x={size * 2} strength={strength} height={height / 2} />
          <VerticalLine x={size * 3} strength={strength} height={height / 3} />
          <VerticalLine x={gridSize} strength={strength * 2} height={height} />
        </pattern>
      </defs>
      <rect width="100%" height={height} y={-height} fill={`url(#${parent})`} />
    </g>
  );
};
