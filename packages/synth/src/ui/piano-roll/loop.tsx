import * as React from 'react';
import { colors } from '../styles';
import { CANVAS_HEIGHT } from './utils';
import { QUARTER } from '../common/units';

type Props = {
  loop: [number, number];
};

export const Loop: React.FC<Props> = ({ loop: [loopStart, loopEnd] }) => {
  const start = loopStart * QUARTER;
  const size = (loopEnd - loopStart) * QUARTER;

  return (
    <>
      <rect
        fillOpacity={0.5}
        x={start}
        width={size}
        height={4}
        fill={colors.critical}
      />
      <rect
        fillOpacity={0.3}
        x={start + size}
        width={1}
        height={CANVAS_HEIGHT}
        fill={colors.critical}
      />
      <rect
        fillOpacity={0.3}
        x={start}
        width={1}
        height={CANVAS_HEIGHT}
        fill={colors.critical}
      />
    </>
  );
};
