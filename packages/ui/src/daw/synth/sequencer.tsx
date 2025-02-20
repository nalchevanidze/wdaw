import * as React from 'react';
import { colors } from '../../styles';
import { Panel } from './panel';
import { SEQUENCE_LENGTH } from '@wdaw/engine';
import { toggleARPNote } from '../utils/arp';
import { usePreset } from '../hooks/use-preset';

const STEP_SIZE = 8;
const range = Array.from({ length: SEQUENCE_LENGTH }, (_, i) => i);
const OCTAVES = [4, 3, 2, 1];

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
  element: (active: boolean) => ({
    width: STEP_SIZE + 'px',
    border: '0.1px solid #BBB',
    height: STEP_SIZE + 'px',
    background: active ? colors.secondary : '#2220'
  }),
  container: {
    display: 'flex',
    margin: '0px',
    padding: '0px'
  }
} as const;

const Chord: React.FC<Props> = ({ chord, onClick }) => (
  <li style={styles.li}>
    {OCTAVES.map((index) => (
      <div
        style={styles.element(chord.indexOf(index) !== -1)}
        key={index}
        onClick={() => onClick(index)}
      />
    ))}
  </li>
);

export const Sequencer: React.FC = () => {
  const { sequence, setSequence } = usePreset();

  return (
    <Panel label="sequencer" size={1} optional id="sequence">
      <ul style={styles.container}>
        {range.map((row) => (
          <Chord
            key={row}
            chord={sequence[row] ?? []}
            onClick={ (column: number) =>
              setSequence(toggleARPNote(sequence, { row, column }))
            }
          />
        ))}
      </ul>
    </Panel>
  );
};
