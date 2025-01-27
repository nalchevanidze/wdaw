import * as React from 'react';
import { colors } from '../styles';
import { CANVAS_HEIGHT } from './utils';
import { QUARTER } from '../common/units';

type Props = {
  loop: [number, number];
};

export const Loop: React.FC<Props> = ({ loop: [loopStart, loopEnd] }) => {
  const start = loopStart * QUARTER;
  const end = (loopEnd - loopStart) * QUARTER;

  const lineSize = 1;
  const width = 8;
  const up = 16;

  return (
    <>
      <rect x={start} width={end} height={lineSize} fill={colors.critical} />
      <rect
        fillOpacity={0.6}
        y={-up}
        x={start}
        width={width}
        height={lineSize + up}
        fill={colors.critical}
      />
      <rect
        fillOpacity={0.6}
        y={-up}
        x={end - width + lineSize}
        width={width}
        height={lineSize + up}
        fill={colors.critical}
      />
      <rect
        fillOpacity={0.3}
        x={start + end}
        width={1}
        height={CANVAS_HEIGHT}
        fill={colors.critical}
      />
      <rect
        fillOpacity={0.3}
        x={start}
        width={lineSize}
        height={CANVAS_HEIGHT}
        fill={colors.critical}
      />
    </>
  );
};
