import * as React from 'react';
import { StageContext, SvgStage } from '@wdaw/svg';
import { Tapeline } from '../common/tapeline';
import { ConfiguratorContext } from '../configurator';
import { PANEL } from './defs';

type Height = { height: number };

const TimelineContent: React.FC<Height> = ({ height }) => {
  const getCoordinates = React.useContext(StageContext);
  const [_, dispatch] = React.useContext(ConfiguratorContext);

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

type Props = { width: number } & Height;

const Timeline: React.FC<Props> = ({ width, height }) => (
  <SvgStage
    viewBox={[-PANEL, -height, width, height].join(' ')}
    width={width}
    height={height}
    style={{ background: '#FFF', border: '1px solid #BBB', display: 'block' }}
  >
    <TimelineContent height={height} />
  </SvgStage>
);

export { Timeline };
