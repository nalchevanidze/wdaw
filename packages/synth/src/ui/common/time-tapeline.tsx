import * as React from 'react';
import { colors } from '../styles';
import { NOTE_SIZE, NOTE_STEP, TIMELINE_HEIGHT } from './defs';

const gridSize = 40;
const id = 'TimelinePattern_B_Q_T_D_V_B_D';
const parent = `${id}_PARENT`;
const child = `${id}_CHILD`;

const TimeTapeline = () => (
  <g>
    <defs>
      <pattern
        width={NOTE_SIZE}
        height={TIMELINE_HEIGHT}
        patternUnits="userSpaceOnUse"
        id={child}
      >
        <line
          x1={1}
          x2={1}
          y1={0}
          y2={NOTE_STEP}
          stroke={colors.secondary}
          strokeWidth={0.5}
        />
      </pattern>

      <pattern
        width={gridSize}
        height={TIMELINE_HEIGHT}
        patternUnits="userSpaceOnUse"
        id={parent}
      >
        <rect
          width={gridSize}
          height={TIMELINE_HEIGHT}
          fill={colors.background}
        />
        <rect
          width={gridSize}
          height={TIMELINE_HEIGHT}
          fill={'url(#' + child + ')'}
        />
        <line
          x1={1}
          x2={1}
          y1={0}
          y2={NOTE_SIZE}
          stroke={colors.secondary}
          strokeWidth={1}
        />
      </pattern>
    </defs>
    <rect
      width="100%"
      height={TIMELINE_HEIGHT}
      y={-TIMELINE_HEIGHT}
      fill={'url(#' + parent + ')'}
    />
  </g>
);

type TimelineProps = {
  time: number;
  height: number;
  width: number;
  setTime: (e: number) => void;
};

export { TimeTapeline };
