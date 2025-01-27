import * as React from 'react';
import { StageContext, SvgStage } from '@wdaw/svg';
import { intRange, unitInterval, Range } from '../../../utils/math';
import { MHandler } from '../../types';

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
};

export const Level: React.FC<Props> = ({
  value,
  color,
  steps = 16,
  range,
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

  return (
    <>
      <g fill="none" stroke={color}>
        <circle
          strokeWidth={10}
          cx={50}
          cy={50}
          r={45}
          strokeDasharray={dashes(steps)}
          opacity={0.5}
        />
        <circle strokeWidth={1} cx={50} cy={50} r={50} strokeOpacity={0.1} />
        <circle
          strokeWidth={10}
          strokeOpacity={0.2}
          cx={50}
          cy={50}
          r={45}
          strokeDasharray={285}
          strokeDashoffset={285 * (1 - roundLevel(value, range))}
        />
      </g>
      <circle
        cx={50}
        cy={50}
        r={50}
        fillOpacity={0}
        onMouseLeave={mouseUp}
        onMouseUp={mouseUp}
        onMouseDown={mouseDown}
        onMouseMove={onMove}
      />
    </>
  );
};
