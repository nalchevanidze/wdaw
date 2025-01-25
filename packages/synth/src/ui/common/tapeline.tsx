import * as React from 'react';
import { colors } from '../styles';

const gridSize = 40;
const id = 'TimelinePattern_B_Q_T_D_V_B_D';
const parent = `${id}_PARENT`;
const child = `${id}_CHILD`;

type Props = {
  height: number;
  size: number;
};

export const Tapeline: React.FC<Props> = ({ height, size }) => (
  <g>
    <defs>
      <pattern
        width={size}
        height={height}
        patternUnits="userSpaceOnUse"
        id={child}
      >
        <line
          x1={1}
          x2={1}
          y1={0}
          y2={size / 2}
          stroke={colors.secondary}
          strokeWidth={0.5}
        />
      </pattern>

      <pattern
        width={gridSize}
        height={height}
        patternUnits="userSpaceOnUse"
        id={parent}
      >
        <rect width={gridSize} height={height} fill={colors.background} />
        <rect width={gridSize} height={height} fill={'url(#' + child + ')'} />
        <line
          x1={1}
          x2={1}
          y1={0}
          y2={size}
          stroke={colors.secondary}
          strokeWidth={1}
        />
      </pattern>
    </defs>
    <rect
      width="100%"
      height={height}
      y={-height}
      fill={'url(#' + parent + ')'}
    />
  </g>
);
