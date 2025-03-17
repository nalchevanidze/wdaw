import * as React from 'react';
import { Scalar } from '@wdaw/engine';
import { colors } from '../styles';

const styles = {
  input: {
    userSelect: 'none',
    outline: 'none',
    border: '0',
    background: colors.secondary,
    fontSize: '14px',
    marginLeft: '4px',
    borderRadius: '3px'
  }
} as const;

type Props = {
  input: Scalar.Input;
  value: number;
  max: number;
  min: number;
  onChange(i: Scalar.Input): void;
};

export const DynamicValueInput: React.FC<Props> = ({
  input,
  onChange,
  value,
  min,
  max
}) => {
  const isDynamic = input.type === 'dynamic';

  return (
    <>
      <input
        id="bpm-input"
        type="number"
        value={value}
        disabled={isDynamic}
        onChange={({ target }) =>
          onChange(
            Scalar.fixed(Math.min(Math.max(min, Number(target.value)), max))
          )
        }
        min={min}
        max={max}
        style={styles.input}
      />
      {isDynamic ? (
        <button onClick={() => onChange(Scalar.fixed(value))}>fixed</button>
      ) : (
        <button onClick={() => onChange(Scalar.initDynamic(value))}>
          dynamic
        </button>
      )}
    </>
  );
};
