import * as React from 'react';
import { colors } from '../../styles';
import { Panel } from './panel';
import { SEQUENCE_LENGTH } from '@wdaw/engine';
import { toggleARPNote } from '../utils/arp';
import { usePreset } from '../hooks/use-preset';

const STEP_SIZE = 10;

type Props = {
  chord: number[];
  onClick: (i: number) => void;
};

const styles = {
  li: {
    listStyle: 'none',
    border: 'none',
    outline: 'none'
  },
  element: {
    width: STEP_SIZE + 'px',
    border: '0.025em solid #BBB',
    height: STEP_SIZE + 'px'
  },
  container: {
    display: 'flex',
    margin: '0px',
    padding: '0px'
  }
} as const;

const Sequence: React.FC<Props> = ({ chord, onClick }) => (
  <li style={styles.li}>
    {[1, 2, 3, 4].reverse().map((index) => (
      <div
        style={{
          ...styles.element,
          background: chord.indexOf(index) !== -1 ? colors.secondary : '#2220'
        }}
        key={index}
        onClick={() => onClick(index)}
      />
    ))}
  </li>
);

const range = Array.from({ length: SEQUENCE_LENGTH }, (_, i) => i);

export const Sequencer: React.FC = () => {
  const [{ sequence }, dispatch] = usePreset();

  const setNote = (row: number) => (column: number) =>
    dispatch({
      type: 'SET_SEQUENCE',
      payload: toggleARPNote(sequence, { row, column })
    });

  return (
    <Panel label="sequencer" size={3} optional id="sequence">
      <ul style={styles.container}>
        {range.map((i) => (
          <Sequence key={i} chord={sequence[i] ?? []} onClick={setNote(i)} />
        ))}
      </ul>
    </Panel>
  );
};
