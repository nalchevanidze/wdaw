import * as React from 'react';
import { colors } from '../styles';

const styles = {
  li: {
    listStyle: 'none',
    border: 'none',
    outline: 'none'
  },
  element: (stepSize: number, active: boolean) => ({
    width: stepSize + 'px',
    border: '0.1px solid #BBB',
    height: stepSize + 'px',
    background: active ? colors.secondary : '#2220'
  }),
  container: {
    display: 'flex',
    margin: '0px',
    padding: '0px'
  }
} as const;

type Props = {
  stepSize: number;
  matrix: boolean[][];
  onClick(column: number, row: number): void;
};

export const Matrix: React.FC<Props> = ({ stepSize, matrix, onClick }) => (
  <ul style={styles.container}>
    {matrix.map((row, columnIndex) => (
      <li style={styles.li} key={columnIndex}>
        {row.map((active, rowIndex) => (
          <div
            style={styles.element(stepSize, active)}
            key={rowIndex}
            onClick={() => onClick(columnIndex, row.length - rowIndex)}
          />
        ))}
      </li>
    ))}
  </ul>
);
