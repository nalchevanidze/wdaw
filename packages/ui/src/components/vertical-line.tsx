import * as React from 'react';

type Props = {
  x: number;
  strength: number;
  height?: number;
};

export const VerticalLine: React.FC<Props> = ({
  x,
  strength,
  height 
}) => (
  <line
    x1={x}
    x2={x}
    y1={0}
    y2={height ?? `100%`}
    stroke="black"
    fill="none"
    strokeWidth={strength * 0.5}
  />
);
