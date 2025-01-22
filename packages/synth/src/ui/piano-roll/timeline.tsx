import * as React from 'react';
import { StageContext } from '@wdaw/svg';
import { Tapeline } from '../common/tapeline';
import { TIMELINE_HEIGHT } from '../common/defs';

type TimelineProps = {
  time: number;
  height: number;
  width: number;
  setTime: (e: number) => void;
};

const Timeline: React.FC<TimelineProps> = ({
  time,
  height,
  width,
  setTime
}) => {
  const getCoordinates = React.useContext(StageContext);

  return (
    <g>
      <Tapeline />
      <line
        x1={time}
        x2={time}
        y1={-TIMELINE_HEIGHT}
        y2={height}
        stroke="red"
      />
      <rect
        fillOpacity="0"
        y={-TIMELINE_HEIGHT}
        height={TIMELINE_HEIGHT}
        width={width}
        onMouseDown={(event) =>
          setTime(Math.floor(getCoordinates(event).x / 5))
        }
      />
    </g>
  );
};

export { Timeline };
