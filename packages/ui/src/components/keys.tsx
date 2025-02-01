import * as React from 'react';

type Props = {
  opacity?: number;
  height: number;
};

export const Keys: React.FC<Props> = ({ opacity = 1, height }) => (
  <g fill="black" fillOpacity={opacity}>
    {[1, 3, 5, 8, 10].map((i) => (
      <rect key={i} y={i * height} width="100%" height={height} stroke="none" />
    ))}
  </g>
);
