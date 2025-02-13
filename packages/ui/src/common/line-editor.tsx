import * as React from 'react';
import { ControlPoint, Point } from './control-point';
import { colors } from '../styles';

export type Controler = {
  point: Point;
  onClick?: () => void;
};

export const LineEditor: React.FC<{ controlers: Controler[] }> = ({
  controlers
}) => {
  return (
    <g>
      <path
        stroke={colors.prime}
        fill={colors.prime}
        fillOpacity="0.10"
        d={'M' + controlers.map((x) => x.point)}
      />
      <g fillOpacity={0.8} fill="gray" stroke="#333">
        {controlers.map((c, i) =>
          c.onClick ? (
            <ControlPoint xy={c.point} key={i} onClick={c.onClick} />
          ) : null
        )}
      </g>
    </g>
  );
};
