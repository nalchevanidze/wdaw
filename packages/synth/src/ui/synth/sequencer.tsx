import * as React from 'react';
import { ConfiguratorContext } from '../configurator';
import { colors } from '../styles';
import { Panel } from './panel';
import { SEQUENCE_LENGTH } from '../../core/defs';

const STEP_SIZE = 10;

type Props = {
  chord: number[];
  onClick: (i: number) => void;
};

const Sequence: React.FC<Props> = ({ chord, onClick }) => (
  <li
    style={{
      listStyle: 'none',
      border: 'none',
      outline: 'none'
    }}
  >
    {[1, 2, 3, 4].reverse().map((index) => (
      <div
        style={{
          width: STEP_SIZE + 'px',
          border: '0.025em solid #BBB',
          height: STEP_SIZE + 'px',
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
  const [{ sequence }, dispatch] = React.useContext(ConfiguratorContext);

  const setNote = (row: number) => (column: number) =>
    dispatch({ type: 'TOGGLE_APR_NOTE', payload: { row, column } });

  return (
    <Panel label="sequencer" size={3} optional id="sequence">
      <ul
        style={{
          display: 'flex',
          margin: '0px',
          padding: '0px'
        }}
      >
        {range.map((i) => (
          <Sequence key={i} chord={sequence[i] ?? []} onClick={setNote(i)} />
        ))}
      </ul>
    </Panel>
  );
};
