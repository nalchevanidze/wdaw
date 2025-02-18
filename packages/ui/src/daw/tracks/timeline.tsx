import * as React from 'react';
import { usePoint, useSvgBoundaries } from '@wdaw/svg';
import { DawApiContext } from '../../context/state';
import { Tapeline } from '../../components/tapeline';
import { colors } from '../../styles';
import { usePlayer } from '../hooks/use-player';

type Height = { height: number; size: number };

export const Timeline: React.FC<Height> = ({ height, size }) => {
  const toPoint = usePoint();
  const { time, setTime } = usePlayer();

  return (
    <g>
      <Tapeline height={height} size={size} />
      <rect
        y={-height}
        height={useSvgBoundaries().height + height}
        width={1}
        x={time}
        fill={colors.critical}
      />
      <rect
        fillOpacity="0"
        y={-height}
        height={height}
        width="100%"
        onMouseDown={(e) => setTime(Math.floor(toPoint(e).x))}
      />
    </g>
  );
};
