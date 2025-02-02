import * as React from 'react';
import { StageContext } from '@wdaw/svg';
import { DawApiContext } from '../../context/state';
import { Tapeline } from '../../components/tapeline';

type Height = { height: number; size: number };

export const Timeline: React.FC<Height> = ({ height, size }) => {
  const { toPoint } = React.useContext(StageContext);
  const [_, dispatch] = React.useContext(DawApiContext);

  const setTime: React.MouseEventHandler<SVGRectElement> = (event) =>
    dispatch({
      type: 'SET_TIME',
      payload: Math.floor(toPoint(event).x)
    });

  return (
    <g>
      <Tapeline height={height} size={size} />
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
