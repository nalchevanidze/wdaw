import * as React from "react";

export type Point = [number, number];

type Props = {
  xy: Point;
  onClick: () => void;
};

const ControlPoint: React.FC<Props> = ({ onClick, xy: [x, y] }) => (
  <circle
    cx={x}
    cy={y}
    onTouchStart={onClick}
    onMouseDown={onClick}
    r={5}
    style={{ cursor: "grabbing" }}
  />
);

export { ControlPoint };
