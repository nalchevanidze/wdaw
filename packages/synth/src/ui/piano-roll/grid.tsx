import * as React from 'react';
import { NOTE, BLOCK, QUARTER } from '../common/units';
import { Keys } from './keyboard';

const VerticalLine: React.FC<{ x: number; strength: number }> = ({
  x,
  strength
}) => (
  <line
    x1={x}
    x2={x}
    y1={0}
    y2="100%"
    stroke="black"
    fill="none"
    strokeWidth={strength * 0.5}
  />
);

type Props = { ocatveHeight: number; count: number };

export const Grid: React.FC<Props> = ({ ocatveHeight, count }) => (
  <g>
    <defs>
      <pattern
        width={NOTE}
        height="100%"
        patternUnits="userSpaceOnUse"
        id="quart"
      >
        <VerticalLine x={NOTE} strength={0.1} />
      </pattern>
      <pattern
        width={BLOCK}
        height={ocatveHeight}
        patternUnits="userSpaceOnUse"
        id="key"
      >
        <Keys width={BLOCK} opacity={0.07} />
        <rect width={BLOCK} height="100%" fill="url(#quart)" />
        <VerticalLine x={QUARTER} strength={0.2} />
        <VerticalLine x={QUARTER * 2} strength={0.4} />
        <VerticalLine x={QUARTER * 3} strength={0.2} />
        <VerticalLine x={BLOCK} strength={2} />
      </pattern>
    </defs>
    <rect
      width="100%"
      height={ocatveHeight * count}
      fill="url(#key)"
      className="grids"
    />
  </g>
);
