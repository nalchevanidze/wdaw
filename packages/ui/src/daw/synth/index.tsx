import * as React from 'react';
import { Envelopes } from './envelopes';
import { Presets } from './presets';
import { ControllerModule } from './module';
import { Controllers } from '../../components/controllers';
import { usePreset } from '../hooks/use-preset';
import { Sequence, SEQUENCE_LENGTH } from '@wdaw/engine';
import { Matrix } from '../../components/matrix';

const styles = {
  main: {
    display: 'flex',
    fontSize: '10px',
    alignItems: 'flex-start',
    padding: '5px'
  }
};

const toMatrix = (length: number, seq: Sequence): boolean[][] =>
  Array.from({ length }, (_, i) => i).map((i) =>
    [4, 3, 2, 1].map((index) => Boolean(seq[i] && seq[i].indexOf(index) !== -1))
  );
export const Synth: React.FC = () => {
  const { wave, filter, setWave, setFilter, sequence, toggleARP } = usePreset();

  return (
    <div style={styles.main}>
      <Presets />
      <ControllerModule id="wave" label="Oscillators" size={4}>
        <Controllers
          values={wave}
          items={[
            { id: 'sine' },
            { id: 'square' },
            { id: 'saw' },
            { id: 'saw2' },
            { id: 'tech' },
            { id: 'noise' },
            { id: 'offset' },
            { id: 'fm' },
            { id: 'fmFreq' },
            { id: 'voices', range: [1, 12], steps: 11 },
            { id: 'octave', range: [-4, 4], steps: 8 }
          ]}
          onChange={setWave}
        />
      </ControllerModule>
      <ControllerModule id="filter" label="Filter" optional>
        <Controllers
          items={[{ id: 'cutoff' }, { id: 'resonance' }, { id: 'envelope' }]}
          values={filter}
          onChange={setFilter}
        />
      </ControllerModule>
      <div>
        <Envelopes />
        <ControllerModule id="sequence" label="sequencer" size={1} optional>
          <Matrix
            stepSize={7}
            matrix={toMatrix(SEQUENCE_LENGTH, sequence)}
            onClick={(column, row) => toggleARP({ column, row })}
          />
        </ControllerModule>
      </div>
    </div>
  );
};
