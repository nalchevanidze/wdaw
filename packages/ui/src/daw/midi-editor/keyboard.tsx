import * as React from 'react';

import { NOTE, NOTE_HEIGHT } from '../../common/units';
import { colors } from '../../styles';

type KeysProps = {
  opacity?: number;
};

export const Keys: React.FC<KeysProps> = ({ opacity = 1 }) => (
  <g fill="black" fillOpacity={opacity}>
    {[1, 3, 5, 8, 10].map((i) => (
      <rect key={i} y={i * NOTE_HEIGHT} width="100%" height={NOTE_HEIGHT} />
    ))}
  </g>
);

type Props = { width: number; ocatveHeight: number; count: number };

export const Keyboard: React.FC<Props> = ({
  width,
  ocatveHeight,
  count = 4
}) => (
  <g>
    <defs>
      <pattern
        width="100%"
        height={ocatveHeight}
        patternUnits="userSpaceOnUse"
        id="start_keys"
      >
        <Keys />
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
