import * as React from 'react';
import { colors } from '../styles';
import { CANVAS_HEIGHT } from './utils';
import { QUARTER } from '../common/units';

type Props = {
  loop: [number, number];
};

export const Loop: React.FC<Props> = ({ loop: [loopStart, loopEnd] }) => {
  const start = loopStart * QUARTER;
  const end = start + (loopEnd - loopStart) * QUARTER;

  const width = 8;
  const up = 16;

  return (
    <>
      <line x1={start} y1={0} x2={end} y2={0} stroke={colors.critical} />
      <rect
        fillOpacity={0.4}
        y={-up}
        height={up}
        x={start- width/2}
        width={width}
        fill={colors.critical}
        stroke={colors.critical}
        strokeWidth={0.4}
      />
      <rect
        fillOpacity={0.4}
        y={-up}
        height={up}
        x={end - width/2}
        width={width}
        fill={colors.critical}
        stroke={colors.critical}
        strokeWidth={0.4}
      />
      <line
        x1={end}
        y1={0}
        x2={end}
        y2={CANVAS_HEIGHT}
        stroke={colors.critical}
      />
      <line
        x1={start}
        y1={0}
        x2={start}
        y2={CANVAS_HEIGHT}
        stroke={colors.critical}
      />
    </>
  );
};
