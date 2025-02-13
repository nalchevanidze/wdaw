import * as React from 'react';
import { ControlPoint, Point } from './control-point';
import { colors } from '../styles';
import { usePoint, Point as SVGPoint } from '@wdaw/svg';

export type Controler = {
  point: Point;
  id?: string;
  emphasize?: boolean;
};

type Props = {
  controlers: Controler[];
  height: number;
  children: React.ReactNode;
  onMove(target: string, point: SVGPoint): void;
};

type EnvelopeHandler = React.MouseEventHandler<SVGGElement>;

export const LineEditor: React.FC<Props> = ({
  controlers,
  height,
  children,
  onMove
}) => {
  const [target, setCurrent] = React.useState<string | undefined>();
  const clear = () => setCurrent(undefined);
  const setTarget = (name: string) => () => setCurrent(name);
  const toPoint = usePoint();

  const localOnMove: EnvelopeHandler = (event) =>
    target ? onMove(target, toPoint(event)) : undefined;

  return (
    <g
      onMouseMove={localOnMove}
      onMouseLeave={clear}
      onTouchEnd={clear}
      onMouseUp={clear}
    >
      {children}
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
          c.id ? (
            <ControlPoint xy={c.point} key={i} onClick={setTarget(c.id)} />
          ) : null
        )}
      </g>
    </g>
  );
};
