import * as React from 'react';
import { usePoint, useSvgBoundaries } from '@wdaw/svg';
import { DawApiContext } from '../../context/state';
import { Tapeline } from '../../components/tapeline';
import { colors } from '../../styles';

type Height = { height: number; size: number };

export const Timeline: React.FC<Height> = ({ height, size }) => {
  const toPoint = usePoint();
  const [_, dispatch] = React.useContext(DawApiContext);
  const [{ time }] = React.useContext(DawApiContext);

  const setTime: React.MouseEventHandler<SVGRectElement> = (event) =>
    dispatch({
      type: 'SET_TIME',
      payload: Math.floor(toPoint(event).x)
    });

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
        onMouseDown={setTime}
      />
    </g>
  );
};
