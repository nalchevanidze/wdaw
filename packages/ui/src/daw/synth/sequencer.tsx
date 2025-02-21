import * as React from 'react';
import { ControllerModule } from './module';
import { Sequence, SEQUENCE_LENGTH } from '@wdaw/engine';
import { usePreset } from '../hooks/use-preset';
import { Matrix } from '../../components/matrix';

const toMatrix = (length: number, seq: Sequence): boolean[][] =>
  Array.from({ length }, (_, i) => i).map((i) =>
    [4, 3, 2, 1].map((index) => Boolean(seq[i] && seq[i].indexOf(index) !== -1))
  );

export const Sequencer: React.FC = () => {
  const { sequence, toggleARP } = usePreset();

  return (
    <ControllerModule id="sequence" label="sequencer" size={1} optional>
      <Matrix
        stepSize={7}
        matrix={toMatrix(SEQUENCE_LENGTH, sequence)}
        onClick={(column, row) => toggleARP({ column, row })}
      />
    </ControllerModule>
  );
};
