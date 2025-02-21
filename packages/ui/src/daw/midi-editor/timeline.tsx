import * as React from 'react';
import { Tapeline } from '../../components/tapeline';

type TimelineProps = {
  timeline: number;
  size: number
};

export const Timeline: React.FC<TimelineProps> = ({
  timeline,
  size
}) => (<Tapeline height={timeline} size={size} />);
