import * as React from "react";
import { flatStripes } from "@wdaw/svg";
import { withWaveform } from "../utils/waveform-service";

type SoundformProps = {
  stepSize: number;
  height?: number;
  width?: number;
  color?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
};

const Sound = withWaveform<SoundformProps>(
  ({
    waveform,
    color = "#777",
    strokeWidth = 1,
    height = 50,
    width = 500,
    stepSize = 2,
    style,
  }) => (
    <svg viewBox={[0, -height / 2, width, height].join(" ")} style={style}>
      <path
        stroke={color}
        d={flatStripes(waveform, {
          width,
          height,
          resolution: width / Math.max(1, stepSize),
        })}
        strokeWidth={strokeWidth}
      />
    </svg>
  )
);

export { Sound };
