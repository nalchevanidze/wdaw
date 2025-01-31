import * as React from 'react';
import { NOTE, BLOCK, QUARTER } from '../common/units';
import { VerticalLine } from '../../common/vertical-line';

export const Grid: React.FC = () => (
  <g>
    <defs>
      <pattern
        width={NOTE}
        height="100%"
        patternUnits="userSpaceOnUse"
        id="track-quart"
      >
        <VerticalLine x={NOTE} strength={0.1} />
      </pattern>
      <pattern
        width={BLOCK}
        height="100%"
        patternUnits="userSpaceOnUse"
        id="track-key"
      >
        <rect width={BLOCK} height="100%" fill="url(#track-quart)" />
        <VerticalLine x={QUARTER} strength={0.2} />
        <VerticalLine x={QUARTER * 2} strength={0.4} />
        <VerticalLine x={QUARTER * 3} strength={0.2} />
        <VerticalLine x={BLOCK} strength={2} />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#track-key)" className="grids" />
  </g>
);
