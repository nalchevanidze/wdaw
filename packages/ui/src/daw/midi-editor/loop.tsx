import * as React from 'react';
import { colors } from '../../styles';
import { MHandler } from '../types';

type Props = {
  loop: [number, number];
  height: number;
  moveStart: MHandler;
  moveEnd: MHandler;
  timelineHeight: number;
  controlerWidth: number;
};

export const Loop: React.FC<Props> = ({
  timelineHeight,
  loop: [start, end],
  height,
  moveStart,
  moveEnd,
  controlerWidth
}) => (
  <>
    <line
      x1={start}
      y1={0}
      x2={end}
      y2={0}
      stroke={colors.critical}
      strokeWidth={0.4}
    />
    <rect
      fillOpacity={0.4}
      y={-timelineHeight}
      height={timelineHeight}
      x={start - controlerWidth / 2}
      width={controlerWidth}
      fill={colors.critical}
      stroke={colors.critical}
      strokeWidth={0.1}
      onMouseDown={moveStart}
    />
    <rect
      fillOpacity={0.4}
      y={-timelineHeight}
      height={timelineHeight}
      x={end - controlerWidth / 2}
      width={controlerWidth}
      fill={colors.critical}
      stroke={colors.critical}
      strokeWidth={0.1}
      onMouseDown={moveEnd}
    />
    <line
      x1={end}
      y1={0}
      x2={end}
      y2={height}
      stroke={colors.critical}
      strokeWidth={0.4}
    />
    <line
      x1={start}
      y1={0}
      x2={start}
      y2={height}
      stroke={colors.critical}
      strokeWidth={0.4}
    />
  </>
);
