import * as React from 'react';
import { Tapeline } from '../common/tapeline';
import { TIMELINE_HEIGHT } from '../common/defs';

type TimelineProps = {
  time: number;
  height: number;
};

const Timeline: React.FC<TimelineProps> = ({ time, height }) => {
  return (
    <g>
      <Tapeline />
      <line
        x1={time}
        x2={time}
        y1={-TIMELINE_HEIGHT}
        y2={height}
        stroke="red"
      />
    </g>
  );
};

export { Timeline };
