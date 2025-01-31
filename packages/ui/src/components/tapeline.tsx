import * as React from 'react';
import { colors } from '../styles';

type Props = {
  height: number;
  size: number;
};

export const Tapeline: React.FC<Props> = ({ height, size }) => {
  const id = `TimelinePattern_B_Q_T_D_V_B_D_${height}_${size}`;
  const parent = `${id}_PARENT`;
  const child = `${id}_CHILD`;
  const gridSize = size * 4;

  return (
    <g>
      <defs>
        <pattern
          width={size}
          height={height}
          patternUnits="userSpaceOnUse"
          id={child}
        >
          <line
            x1={0}
            x2={0}
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
            x1={0}
            x2={0}
            y1={0}
            y2={size}
            stroke={colors.secondary}
            strokeWidth={2}
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
};
