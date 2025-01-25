import * as React from 'react';
import { StageContext, SvgStage } from '@wdaw/svg';
import { Tapeline } from '../common/tapeline';
import { PANEL, WIDTH } from './track';
import { ConfiguratorContext } from '../configurator';
import { TIMELINE_HEIGHT } from '../common/defs';

const TimelineContent: React.FC = () => {
  const getCoordinates = React.useContext(StageContext);
  const [_, dispatch] = React.useContext(ConfiguratorContext);

  const setTime = (payload: number) => dispatch({ type: 'SET_TIME', payload });

  return (
    <g>
      <Tapeline height={TIMELINE_HEIGHT} size={8} />
      <rect
        fillOpacity="0"
        y={-TIMELINE_HEIGHT}
        height={TIMELINE_HEIGHT}
        width={WIDTH}
        onMouseDown={(event) => setTime(Math.floor(getCoordinates(event).x))}
      />
    </g>
  );
};

const Timeline: React.FC = () => (
  <SvgStage
    viewBox={[-PANEL, -TIMELINE_HEIGHT, WIDTH, TIMELINE_HEIGHT].join(' ')}
    width={WIDTH}
    height={TIMELINE_HEIGHT}
    style={{ background: '#FFF', border: '1px solid #BBB', display: 'block' }}
  >
    <TimelineContent />
  </SvgStage>
);

export { Timeline };
