import * as React from 'react';
import { colors } from '../styles';

const styles = {
  button: {
    fontSize: '10px',
    outline: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textTransform: 'capitalize',
    display: 'block',
    color: 'white',
    padding: '2px',
    userSelect: 'none'
  }
} as const;

type Props = {
  name: string;
  active: boolean;
  onClick(): void;
};

export const TextButton = ({ name, active, onClick }: Props) => (
  <button
    style={{
      ...styles.button,
      color: colors.button(active)
    }}
    onClick={onClick}
  >
    {name}
  </button>
);
