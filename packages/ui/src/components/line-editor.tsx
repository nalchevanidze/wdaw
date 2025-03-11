import * as React from 'react';
import { ControlPoint } from './control-point';
import { colors } from '../styles';
import { Point, usePoint } from '@wdaw/svg';
import { unitInterval } from '../daw/utils/math';
import { useMouseEvent } from '../hooks/use-mouse-event';

type Controler = Point & {
  id?: string;
};

type Props = {
  top?: number;
  height: number;
  width: number;
  controlers: Controler[];
  children?: React.ReactNode;
  onMove(target: string, point: Point): void;
  insert?(point: Point): void;
  onEnd?(): void;
};

export const LineEditor: React.FC<Props> = ({
  top = 0,
  height,
  width,
  controlers,
  children,
  onMove,
  insert,
  onEnd
}) => {
  const toPoint = usePoint();

  const downscale = ({ x, y }: Point) => ({
    x: unitInterval(x / width),
    y: unitInterval(1 - (y - top) / height)
  });

  const upscale = ({ x, y, ...props }: Controler): Controler => ({
    x: x * width,
    y: top + (1 - y) * height,
    ...props
  });

  const setCurrent = useMouseEvent<string>({
    move: (p, t) => onMove(t, downscale(p)),
    end: onEnd
  });

  const upscaled = controlers.map(upscale);

  return (
    <g>
      {children}
      <g stroke={colors.prime} fill="none" strokeOpacity={0.7}>
        {upscaled.map((c, i) => (
          <path key={i} d={'M' + [c.x, top + height, c.x, c.y]} />
        ))}
      </g>
      <path
        stroke={colors.prime}
        fill={colors.prime}
        fillOpacity={0.1}
        d={'M' + upscaled.flatMap(({ x, y }) => [x, y])}
        onClick={(e) => insert?.(downscale(toPoint(e)))}
        style={insert ? { cursor: 'cell' } : undefined}
      />
      <g fillOpacity={0.8} fill="gray" stroke="#333">
        {upscaled.map((c, i) =>
          c.id ? (
            <ControlPoint point={c} key={i} onClick={() => setCurrent(c.id)} />
          ) : null
        )}
      </g>
    </g>
  );
};
