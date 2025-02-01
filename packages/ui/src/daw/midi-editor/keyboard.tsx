import * as React from 'react';
import { Keys } from '../../components/keys';

type Props = { 
  width: number; 
  ocatveHeight: number; 
  count: number 
  noteHeight: number
};

export const Keyboard: React.FC<Props> = ({
  width,
  ocatveHeight,
  count,
  noteHeight
}) => (
  <g>
    <defs>
      <pattern
        width="100%"
        height={ocatveHeight}
        patternUnits="userSpaceOnUse"
        id="start_keys"
      >
        <Keys height={noteHeight} />
      </pattern>
    </defs>
    <rect
      x={-width}
      width={width}
      height={ocatveHeight * count}
      fill="url(#start_keys)"
      stroke="none"
    />
  </g>
);
