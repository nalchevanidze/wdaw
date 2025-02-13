import { Point } from '@wdaw/svg';
import * as React from 'react';

type Props = {
  point: Point;
  onClick: () => void;
};

const ControlPoint: React.FC<Props> = ({ onClick, point: { x, y } }) => (
  <circle
    cx={x}
    cy={y}
    onTouchStart={onClick}
    onMouseDown={onClick}
    r={5}
    style={{ cursor: 'grabbing' }}
  />
);

export { ControlPoint };
