import * as React from 'react';
import { colors } from '../../styles';
import { ControllerModule } from './module';
import { Sequence, SEQUENCE_LENGTH } from '@wdaw/engine';
import { usePreset } from '../hooks/use-preset';

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

const Matrix: React.FC<Props> = ({ stepSize, matrix, onClick }) => (
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

const toMatrix = (length: number, seq: Sequence) =>
  Array.from({ length }, (_, i) => i).map((i) =>
    [4, 3, 2, 1].map((index) => Boolean(seq[i] && seq[i].indexOf(index) !== -1))
  );

export const Sequencer: React.FC = () => {
  const { sequence, toggleARP } = usePreset();

  return (
    <ControllerModule id="sequence" label="sequencer" size={1} optional>
      <Matrix
        stepSize={8}
        matrix={toMatrix(SEQUENCE_LENGTH, sequence)}
        onClick={(column, row) => toggleARP({ column, row })}
      />
    </ControllerModule>
  );
};
