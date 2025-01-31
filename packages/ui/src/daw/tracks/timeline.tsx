import * as React from 'react';
import { StageContext } from '@wdaw/svg';
import { DawApiContext } from '../context/daw-state';
import { Tapeline } from '../../components/tapeline';

type Height = { height: number };

export const Timeline: React.FC<Height> = ({ height }) => {
  const getCoordinates = React.useContext(StageContext);
  const [_, dispatch] = React.useContext(DawApiContext);

  const setTime: React.MouseEventHandler<SVGRectElement> = (event) =>
    dispatch({
      type: 'SET_TIME',
      payload: Math.floor(getCoordinates(event).x)
    });

  return (
    <g>
      <Tapeline height={height} size={16} />
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
