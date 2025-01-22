import * as React from 'react';
import { StageContext, SvgStage } from '@wdaw/svg';
import { Tapeline } from '../common/tapeline';
import { TIMELINE_HEIGHT } from '../common/defs';
import { viewBox, WIDTH } from './track';
import { STAGE_HEIGHT } from './midi-loop';
import { ConfiguratorContext } from '../configurator';

const HEIGHT = 20;

const TimelineContent: React.FC = () => {
  const getCoordinates = React.useContext(StageContext);
  const [{ player }, dispatch] = React.useContext(ConfiguratorContext);

  const time = player.time;

  const setTime = (payload: number) => dispatch({ type: 'SET_TIME', payload });

  return (
    <g>
      <Tapeline />
      <line
        x1={time}
        x2={time}
        y1={-TIMELINE_HEIGHT}
        y2={HEIGHT}
        stroke="red"
      />
      <rect
        fillOpacity="0"
        y={-TIMELINE_HEIGHT}
        height={TIMELINE_HEIGHT}
        width={WIDTH}
        onMouseDown={(event) =>
          setTime(Math.floor(getCoordinates(event).x / 5))
        }
      />
    </g>
  );
};

const Timeline: React.FC = () => (
  <SvgStage
    viewBox={viewBox}
    width={WIDTH}
    height={HEIGHT}
    style={{ background: '#FFF', border: '1px solid #BBB', display: 'block' }}
  >
    <TimelineContent />
  </SvgStage>
);

export { Timeline };
