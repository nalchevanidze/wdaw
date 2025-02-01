import * as React from 'react';
import { colors } from '../styles';
import { LinePattern } from './vertical-line';

type Props = {
  height: number;
  size: number;
  strength?: number;
};

export const Tapeline: React.FC<Props> = ({ height, size, strength = 0.4 }) => {
  const id = React.useId();

  return (
    <g>
      <defs>
        <pattern
          width={size}
          height={height}
          patternUnits="userSpaceOnUse"
          id={id}
        >
          <rect width={size} height={height} fill={colors.background} />
          <LinePattern size={size / 8} strength={strength} height={height} />
        </pattern>
      </defs>
      <rect width="100%" height={height} y={-height} fill={`url(#${id})`} />
    </g>
  );
};
