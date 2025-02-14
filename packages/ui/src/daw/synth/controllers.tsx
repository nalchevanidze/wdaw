import * as React from 'react';
import { getWaveIcon } from '../../components/icons';
import { Svg } from '@wdaw/svg';
import { Level, Props as LevelProps } from '../../components/level';
import { Range } from '@wdaw/svg';

const styles = {
  label: {
    color: '#555',
    width: '100%',
    textAlign: 'center',
    margin: '0',
    userSelect: 'none'
  }
} as const;

const Controller: React.FC<LevelProps & { id: string }> = ({
  id,
  range,
  color,
  value,
  steps,
  onChange
}) => (
  <div>
    <Svg width={100} height={100} zoom={0.4} style={{ margin: '2px' }}>
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
        <path fill="none" d={getWaveIcon(id)} strokeWidth={2} stroke={color} />
      )}
      <Level
        range={range}
        onChange={onChange}
        value={value}
        steps={steps}
        color={color}
      />
    </Svg>
    <p style={styles.label}>{id}</p>
  </div>
);

type Item<K extends string> = {
  id: K;
  steps?: number;
  range?: Range;
};

type Props<K extends string> = {
  items: Item<K>[];
  values: Record<K, number>;
  onChange(id: K, v: number): void;
};

export const Controllers = <K extends string>({
  items,
  values,
  onChange
}: Props<K>) => (
  <>
    {items.map(({ id, range, steps }) => (
      <Controller
        id={id}
        key={id}
        color='#555'
        range={range}
        steps={steps}
        value={values[id]}
        onChange={(v) => onChange(id, v)}
      />
    ))}
  </>
);
