import * as React from 'react';
import { Tapeline } from '../../components/tapeline';

type TimelineProps = {
  time: number;
  timeline: number;
  height: number;
  size: number
};

export const Timeline: React.FC<TimelineProps> = ({
  time,
  timeline,
  height,
  size
}) => (
  <g>
    <Tapeline height={timeline} size={size} />
    <line x1={time} x2={time} y1={-timeline} y2={height} stroke="red" strokeWidth={0.6}/>
  </g>
);
