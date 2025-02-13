import * as React from 'react';
import { ControlPoint, Point } from './control-point';
import { colors } from '../styles';

export type Controler = {
  point: Point;
  onClick?: () => void;
  emphasize?: boolean;
};

type Props = { controlers: Controler[]; height: number };

export const LineEditor: React.FC<Props> = ({ controlers, height }) => {
  return (
    <g>
      <path
        stroke={colors.prime}
        fill={colors.prime}
        fillOpacity="0.10"
        d={'M' + controlers.map((x) => x.point)}
      />
      <g
        stroke={colors.prime}
        fill="none"
        strokeWidth="0.75"
        strokeOpacity={0.2}
      >
        {controlers.map((c, i) =>
          c.emphasize ? (
            <path key={i} d={'M' + [c.point[0], height, ...c.point]} />
          ) : null
        )}
      </g>
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
