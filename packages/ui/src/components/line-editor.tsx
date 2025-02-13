import * as React from 'react';
import { ControlPoint } from './control-point';
import { colors } from '../styles';
import { usePoint, Point } from '@wdaw/svg';
import { unitInterval } from '../daw/utils/math';

type Controler = Point & {
  id?: string;
};

type Props = {
  height: number;
  width: number;
  controlers: Controler[];
  children: React.ReactNode;
  onMove(target: string, point: Point): void;
};

type EnvelopeHandler = React.MouseEventHandler<SVGGElement>;

export const LineEditor: React.FC<Props> = ({
  height,
  width,
  controlers,
  children,
  onMove
}) => {
  const [target, setCurrent] = React.useState<string | undefined>();
  const clear = () => setCurrent(undefined);
  const setTarget = (name: string) => () => setCurrent(name);
  const toPoint = usePoint();

  const upscale = ({ x, y, ...props }: Controler): Controler => ({
    x: x * width,
    y: (1 - y) * height,
    ...props
  });

  const normalize = ({ x, y }: Point): Point => ({
    x: unitInterval(x / width),
    y: unitInterval(1 - y / height)
  });

  const upscaled = controlers.map(upscale);

  const localOnMove: EnvelopeHandler = (event) =>
    target ? onMove(target, normalize(toPoint(event))) : undefined;

  return (
    <g
      onMouseMove={localOnMove}
      onMouseLeave={clear}
      onTouchEnd={clear}
      onMouseUp={clear}
    >
      {children}
      <g stroke={colors.prime} fill="none" strokeOpacity={0.7}>
        {upscaled.map((c, i) => (
          <path key={i} d={'M' + [c.x, height, c.x, c.y]} />
        ))}
      </g>
      <path
        stroke={colors.prime}
        fill={colors.prime}
        fillOpacity={0.1}
        d={'M' + upscaled.flatMap(({ x, y }) => [x, y])}
      />
      <g fillOpacity={0.8} fill="gray" stroke="#333">
        {upscaled.map((c, i) =>
          c.id ? (
            <ControlPoint point={c} key={i} onClick={setTarget(c.id)} />
          ) : null
        )}
      </g>
    </g>
  );
};
