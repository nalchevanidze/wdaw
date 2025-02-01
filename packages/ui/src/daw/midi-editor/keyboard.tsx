import * as React from 'react';

import { BLOCK, NOTE } from '../../common/units';
import { colors } from '../../styles';

type KeysProps = {
  width: number;
  opacity?: number;
};

export const Keys: React.FC<KeysProps> = ({ width, opacity = 1 }) => (
  <g fill="black" fillOpacity={opacity}>
    {[1, 3, 5, 8, 10].map((i) => (
      <rect key={i} y={i * NOTE} width={width} height={NOTE} />
    ))}
  </g>
);

type Props = { width: number; ocatveHeight: number; count: number };

export const Keyboard: React.FC<Props> = ({ width, ocatveHeight, count = 4 }) => (
  <g>
    <defs>
      <pattern
        width={BLOCK}
        height={ocatveHeight}
        patternUnits="userSpaceOnUse"
        id="start_keys"
      >
        <Keys width={BLOCK} />
      </pattern>
    </defs>
    <rect
      x={-width}
      width={width}
      height={ocatveHeight * count}
      fill="url(#start_keys)"
      stroke={colors.black}
    />
  </g>
);
