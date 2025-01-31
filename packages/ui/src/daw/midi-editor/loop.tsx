import * as React from 'react';
import { colors } from '../../styles';
import { QUARTER } from '../../common/units';
import { MHandler } from '../types';

type Props = {
  loop: [number, number];
  height: number;
  moveStart: MHandler;
  moveEnd: MHandler;
};

const width = 8;
const up = 16;

export const Loop: React.FC<Props> = ({
  loop: [loopStart, loopEnd],
  height,
  moveStart,
  moveEnd
}) => {
  const start = loopStart * QUARTER;
  const end = start + (loopEnd - loopStart) * QUARTER;

  return (
    <>
      <line x1={start} y1={0} x2={end} y2={0} stroke={colors.critical} />
      <rect
        fillOpacity={0.4}
        y={-up}
        height={up}
        x={start - width / 2}
        width={width}
        fill={colors.critical}
        stroke={colors.critical}
        strokeWidth={0.4}
        onMouseDown={moveStart}
      />
      <rect
        fillOpacity={0.4}
        y={-up}
        height={up}
        x={end - width / 2}
        width={width}
        fill={colors.critical}
        stroke={colors.critical}
        strokeWidth={0.4}
        onMouseDown={moveEnd}
      />
      <line x1={end} y1={0} x2={end} y2={height} stroke={colors.critical} />
      <line x1={start} y1={0} x2={start} y2={height} stroke={colors.critical} />
    </>
  );
};
