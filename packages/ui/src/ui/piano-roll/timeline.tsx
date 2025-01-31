import * as React from 'react';
import { Tapeline } from '../common/tapeline';
import { NOTE } from '../common/units';

type TimelineProps = {
  time: number;
  timeline: number;
  height: number;
};

export const Timeline: React.FC<TimelineProps> = ({
  time,
  timeline,
  height
}) => (
  <g>
    <Tapeline height={timeline} size={NOTE} />
    <line x1={time} x2={time} y1={-timeline} y2={height} stroke="red" />
  </g>
);
