import * as React from 'react';
import { lib } from './icons';
import { Svg } from '@wdaw/svg';
import { Level, Props } from '../../../components/level';

const styles = {
  p: {
    width: '100%',
    textAlign: 'center',
    margin: '0',
    userSelect: 'none'
  }
} as const;

export const WaveButton: React.FC<Props & { id: string }> = ({
  id,
  range,
  color,
  value,
  steps,
  onChange
}) => (
  <div>
    <Svg
      width={100}
      height={100}
      zoom={0.5}
      style={{ margin: '5px', flexShrink: 0 }}
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
    </Svg>
    <p style={{ ...styles.p, color }}>{id}</p>
  </div>
);
