import * as React from 'react';
import { StageContext, SvgStage } from '@wdaw/svg';
import { Tapeline } from '../common/tapeline';
import { TIMELINE_HEIGHT } from '../common/defs';
import { PANEL, viewBox, WIDTH } from './track';
import { STAGE_HEIGHT } from './midi-loop';
import { ConfiguratorContext } from '../configurator';

const HEIGHT = 20;

const TimelineContent: React.FC = () => {
  const getCoordinates = React.useContext(StageContext);
  const [_, dispatch] = React.useContext(ConfiguratorContext);

  const setTime = (payload: number) => dispatch({ type: 'SET_TIME', payload });

  return (
    <g>
      <Tapeline />
      <rect
        fillOpacity="0"
        y={-HEIGHT}
        height={HEIGHT}
        width={WIDTH}
        onMouseDown={(event) => setTime(Math.floor(getCoordinates(event).x))}
      />
    </g>
  );
};

const Timeline: React.FC = () => (
  <SvgStage
    viewBox={[-PANEL, -HEIGHT, WIDTH, HEIGHT].join(' ')}
    width={WIDTH}
    height={HEIGHT}
    style={{ background: '#FFF', border: '1px solid #BBB', display: 'block' }}
  >
    <TimelineContent />
  </SvgStage>
);

export { Timeline };
