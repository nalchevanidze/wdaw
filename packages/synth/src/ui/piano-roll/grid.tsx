import * as React from 'react';
import { CANVAS_HEIGHT } from './utils';
import { NOTE, BLOCK, QUARTER } from '../common/units';
import { Keys } from './keyboard';

type Props = { height: number };

const VerticalLine: React.FC<{ x: number; strength: number } & Props> = ({
  x,
  strength,
  height
}) => (
  <line
    x1={x}
    x2={x}
    y1={0}
    y2={height}
    stroke="black"
    fill="none"
    strokeWidth={strength * 0.5}
  />
);

export const Grid: React.FC<Props> = ({ height }) => (
  <g>
    <defs>
      <pattern
        width={NOTE}
        height={height}
        patternUnits="userSpaceOnUse"
        id="quart"
      >
        <VerticalLine x={NOTE} strength={0.1} height={height} />
      </pattern>
      <pattern
        width={BLOCK}
        height={height}
        patternUnits="userSpaceOnUse"
        id="key"
      >
        <Keys width={BLOCK} opacity={0.07} />
        <rect width={BLOCK} height={height} fill="url(#quart)" />
        <VerticalLine height={height} x={QUARTER} strength={0.2} />
        <VerticalLine height={height} x={QUARTER * 2} strength={0.4} />
        <VerticalLine height={height} x={QUARTER * 3} strength={0.2} />
        <VerticalLine height={height} x={BLOCK} strength={2} />
      </pattern>
    </defs>
    <rect
      width="100%"
      height={CANVAS_HEIGHT}
      fill="url(#key)"
      className="grids"
    />
  </g>
);
