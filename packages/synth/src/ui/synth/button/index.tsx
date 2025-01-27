import * as React from 'react';
import lib from './icons';
import { SvgStage } from '@wdaw/svg';
import { Level, Props } from './level';

const styles = {
  p: {
    width: '100%',
    textAlign: 'center',
    margin: '0',
    userSelect: 'none'
  }
} as const;

type WaveButtonProps = Props & { id: string };

const WaveButton: React.FC<WaveButtonProps> = ({
  id,
  range,
  color,
  value,
  steps,
  onChange
}) => (
  <div>
    <SvgStage
      viewBox="0 0 100 100"
      width="50px"
      height="50px"
      style={{
        margin: '5px',
        flexShrink: 0,
        cursor: 'grab'
      }}
    >
      {range ? (
        <text
          x="50"
          y="65"
          fontSize="40px"
          textAnchor="middle"
          fill={color}
          style={{ userSelect: 'none' }}
        >
          {value}
        </text>
      ) : (
        <path fill="none" d={lib[id]} strokeWidth={2} stroke={color} />
      )}
      <Level
        range={range}
        onChange={onChange}
        value={value}
        steps={steps}
        color={color}
      />
    </SvgStage>
    <p style={{ ...styles.p, color }}>{id}</p>
  </div>
);

export { WaveButtonProps, WaveButton };
