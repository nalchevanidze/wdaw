import * as React from 'react';

type Props = {
  at: number;
  strength: number;
  height?: number;
  div?: number;
};

export const VerticalLine: React.FC<Props> = ({
  at,
  strength,
  height,
  div = 1
}) => (
  <line
    x1={at}
    x2={at}
    y1={0}
    y2={height ? height / div : `100%`}
    stroke="black"
    fill="none"
    strokeWidth={(strength / div) * 0.5}
  />
);

export const LinePattern: React.FC<{
  size: number;
  strength: number;
  height?: number;
}> = ({ size, strength, height }) => (
  <>
    <VerticalLine div={1} at={0} strength={strength} height={height} />
    <VerticalLine div={4} at={size} strength={strength} height={height} />
    <VerticalLine div={6} at={size * 2} strength={strength} height={height} />
    <VerticalLine div={4} at={size * 3} strength={strength} height={height} />
    <VerticalLine div={2} at={size * 4} strength={strength} height={height} />
    <VerticalLine div={4} at={size * 5} strength={strength} height={height} />
    <VerticalLine div={6} at={size * 6} strength={strength} height={height} />
    <VerticalLine div={4} at={size * 7} strength={strength} height={height} />
    <VerticalLine div={1} at={size * 8} strength={strength} height={height} />
  </>
);
