import * as React from "react";
import { StageContext } from "@wdaw/svg";
import { colors } from "../styles";
import { NOTE_SIZE, NOTE_STEP, TIMELINE_HEIGHT } from "./utils";

const gridSize = 40;
const id = "TimelinePattern_B_Q_T_D_V_B_D";
const parent = `${id}_PARENT`;
const child = `${id}_CHILD`;

const TimelinePattern = () => (
  <g>
    <defs>
      <pattern width={NOTE_SIZE} height={TIMELINE_HEIGHT} patternUnits="userSpaceOnUse" id={child}>
        <line
          x1={1}
          x2={1}
          y1={0}
          y2={NOTE_STEP}
          stroke={colors.secondary}
          strokeWidth={0.5}
        />
      </pattern>

      <pattern
        width={gridSize}
        height={TIMELINE_HEIGHT}
        patternUnits="userSpaceOnUse"
        id={parent}
      >
        <rect width={gridSize} height={TIMELINE_HEIGHT} fill={colors.background} />
        <rect width={gridSize} height={TIMELINE_HEIGHT} fill={"url(#" + child + ")"} />
        <line
          x1={1}
          x2={1}
          y1={0}
          y2={NOTE_SIZE}
          stroke={colors.secondary}
          strokeWidth={1}
        />
      </pattern>
    </defs>
    <rect width="100%" height={TIMELINE_HEIGHT} y={-TIMELINE_HEIGHT} fill={"url(#" + parent + ")"} />
  </g>
);

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
  setTime,
}) => {
  const getCoordinates = React.useContext(StageContext);

  return (
    <g>
      <TimelinePattern />
      <line x1={time} x2={time} y1={-TIMELINE_HEIGHT} y2={height} stroke="red" />
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
