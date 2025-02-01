import * as React from 'react';

type Props = {
  at: number;
  strength: number;
  height?: number;
};

export const VerticalLine: React.FC<Props> = ({
  at,
  strength,
  height 
}) => (
  <line
    x1={at}
    x2={at}
    y1={0}
    y2={height ?? `100%`}
    stroke="black"
    fill="none"
    strokeWidth={strength * 0.5}
  />
);
