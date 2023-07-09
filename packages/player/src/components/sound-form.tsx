import * as React from 'react';
import { flatStripes } from '@wdaw/svg';
import { useWaveform } from '../utils/waveform-service';

type SoundFormProps = {
  stepSize: number;
  height?: number;
  width?: number;
  color?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
  src: string;
};

const Sound: React.FC<SoundFormProps> = ({
  color = '#777',
  strokeWidth = 1,
  height = 50,
  width = 500,
  stepSize = 2,
  style,
  src
}) => (
  <svg viewBox={[0, -height / 2, width, height].join(' ')} style={style}>
    <path
      stroke={color}
      d={flatStripes(useWaveform(src), {
        width,
        height,
        resolution: width / Math.max(1, stepSize)
      })}
      strokeWidth={strokeWidth}
    />
  </svg>
);

export { Sound };
