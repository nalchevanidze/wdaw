import * as React from "react";
import lib from "./icons";
import { StageContext, SvgStage } from "@wdaw/svg";
import { intRange, unitInterval, Range } from "../../../utils/math";

const styles = {
  p: {
    width: "100%",
    textAlign: "center",
    margin: "0",
    userSelect: "none",
  },
} as const;

const dashes = (steps: number) =>
  [1, (45 * 2 * Math.PI) / steps - 1].toString();

const roundLevel = (level: number, range?: Range) =>
  range ? (level - range[0]) / (range[1] - range[0]) : level;

const Level: React.FC<WaveButtonProps> = ({
  onChange,
  value,
  steps = 16,
  color,
  range,
}) => {
  const [listen, setListen] = React.useState(false);
  const getCoordinates = React.useContext(StageContext);

  const mouseDown = () => setListen(true);
  const mouseUp = () => setListen(false);

  const onMove = (e: React.MouseEvent<SVGGElement, MouseEvent>): void => {
    if (!listen || !onChange) return;
    const value = 1 - unitInterval((getCoordinates(e).y - 5) / 80);
    onChange(range ? intRange(value, range) : value);
  };

  return (
    <>
      <g fill="none" stroke={color}>
        <circle
          strokeWidth={10}
          cx={50}
          cy={50}
          r={45}
          strokeDasharray={dashes(steps)}
          opacity={0.5}
        />
        <circle strokeWidth={1} cx={50} cy={50} r={50} strokeOpacity={0.1} />
        <circle
          strokeWidth={10}
          strokeOpacity={0.2}
          cx={50}
          cy={50}
          r={45}
          strokeDasharray={285}
          strokeDashoffset={285 * (1 - roundLevel(value, range))}
        />
      </g>
      <circle
        cx={50}
        cy={50}
        r={50}
        fillOpacity={0}
        onMouseLeave={mouseUp}
        onMouseUp={mouseUp}
        onMouseDown={mouseDown}
        onMouseMove={onMove}
      />
    </>
  );
};

type WaveButtonProps = {
  id: string;
  value: number;
  color: string;
  steps?: number;
  range?: Range;
  onChange?(v: number): void;
};

const WaveButton: React.FC<WaveButtonProps> = ({
  id,
  range,
  color,
  value,
  steps,
  onChange,
}) => (
  <div>
    <SvgStage
      viewBox="0 0 100 100"
      width="50px"
      height="50px"
      style={{
        margin: "5px",
        flexShrink: 0,
        cursor: "grab",
      }}
    >
      {range ? (
        <text
          x="50"
          y="65"
          fontSize="40px"
          textAnchor="middle"
          fill={color}
          style={{ userSelect: "none" }}
        >
          {value}
        </text>
      ) : (
        <path fill="none" d={lib[id]} strokeWidth={2} stroke={color} />
      )}
      <Level
        range={range}
        onChange={onChange}
        id={id}
        value={value}
        steps={steps}
        color={color}
      />
    </SvgStage>
    <p style={{ ...styles.p, color }}>{id}</p>
  </div>
);

export { WaveButtonProps, WaveButton };
