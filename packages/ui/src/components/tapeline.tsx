import * as React from 'react';
import { colors } from '../styles';
import { VerticalLine } from './vertical-line';

type Props = {
  height: number;
  size: number;
  strength?: number;
};

export const Tapeline: React.FC<Props> = ({ height, size, strength = 0.4 }) => {
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
          <VerticalLine x={0} strength={strength * 2} height={height} />
          <VerticalLine x={size} strength={strength} height={height / 4} />
          <VerticalLine x={size * 2} strength={strength} height={height / 3} />
          <VerticalLine x={size * 3} strength={strength} height={height / 4} />
          <VerticalLine x={size * 4} strength={strength } height={height/2} />
          <VerticalLine x={size * 5} strength={strength} height={height / 4} />
          <VerticalLine x={size * 6} strength={strength} height={height / 3} />
          <VerticalLine x={size * 7} strength={strength} height={height / 4} />
          <VerticalLine x={gridSize} strength={strength * 2} height={height} />
        </pattern>
      </defs>
      <rect width="100%" height={height} y={-height} fill={`url(#${id})`} />
    </g>
  );
};
