import * as React from 'react';
import { StageContext } from '@wdaw/svg';
import { intRange, unitInterval, Range } from '../../utils/math';
import { MHandler } from '../types';

const dashes = (steps: number) =>
  [1, (45 * 2 * Math.PI) / steps - 1].toString();

const roundLevel = (level: number, range?: Range) =>
  range ? (level - range[0]) / (range[1] - range[0]) : level;

export type Props = {
  value: number;
  color: string;
  steps?: number;
  range?: Range;
  onChange?(v: number): void;
  size?: number;
};

export const Level: React.FC<Props> = ({
  value,
  color,
  steps = 16,
  range,
  size = 50,
  onChange
}) => {
  const [listen, setListen] = React.useState(false);
  const getCoordinates = React.useContext(StageContext);

  const mouseDown = () => setListen(true);
  const mouseUp = () => setListen(false);

  const onMove: MHandler = (e) => {
    if (!listen || !onChange) return;
    const value = 1 - unitInterval((getCoordinates(e).y - 5) / 80);
    onChange(range ? intRange(value, range) : value);
  };

  const cx = size;
  const cy = size;
  const stroke = size * 0.2;
  const innerSize = size - stroke / 2;
  const offset = size * 5.7

  return (
    <>
      <g fill="none" stroke={color}>
        <circle
          strokeWidth={stroke}
          cx={cx}
          cy={cy}
          r={innerSize}
          strokeDasharray={dashes(steps)}
          opacity={0.5}
        />
        <circle strokeWidth={1} cx={cx} cy={cy} r={size} strokeOpacity={0.1} />
        <circle
          strokeWidth={stroke}
          strokeOpacity={0.2}
          cx={cx}
          cy={cy}
          r={innerSize}
          strokeDasharray={offset}
          strokeDashoffset={offset * (1 - roundLevel(value, range))}
        />
      </g>
      <circle
        cx={cx}
        cy={cy}
        r={size}
        fillOpacity={0}
        onMouseLeave={mouseUp}
        onMouseUp={mouseUp}
        onMouseDown={mouseDown}
        onMouseMove={onMove}
      />
    </>
  );
};
