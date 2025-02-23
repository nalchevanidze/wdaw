import * as React from 'react';
import { Envelopes } from './envelopes';
import { Controllers } from '../../components/controllers';
import { usePreset } from '../hooks/use-preset';
import { Sequence, SEQUENCE_LENGTH } from '@wdaw/engine';
import { Matrix } from '../../components/matrix';
import { Module } from '../../components/module';
import { WaveForm } from '../../components/waveform';
import { TextButton } from '../../components/text-button';

const range = (length: number) => Array.from({ length }, (_, i) => i);

const styles = {
  container: {
    display: 'flex',
    fontSize: '10px',
    alignItems: 'flex-start',
    padding: '5px'
  },
  presets: {
    maxHeight: '100px',
    overflowY: 'scroll',
    width: '100%'
  }
} as const;

const toMatrix = (size: number, seq: Sequence): boolean[][] =>
  range(size).map((c) =>
    range(4).map((r) => Boolean(seq[c] && seq[c].indexOf(4 - r) !== -1))
  );

export const Synth: React.FC = () => {
  const {
    wave,
    options,
    filter,
    getModule,
    setWave,
    setFilter,
    sequence,
    toggleARP
  } = usePreset();

  return (
    <div style={styles.container}>
      <Module label="Presets">
        <WaveForm quality={200} />
        <div style={styles.presets}>
          {options.map(({ id, name, onclick, active }) => (
            <TextButton key={id} name={name} active={active} onClick={onclick} />
          ))}
        </div>
      </Module>
      <Module label="Oscillators" size={4}>
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
      </Module>
      <Module label="Filter" optional={getModule('filter')}>
        <Controllers
          items={[{ id: 'cutoff' }, { id: 'resonance' }, { id: 'envelope' }]}
          values={filter}
          onChange={setFilter}
        />
      </Module>
      <div>
        <Envelopes />
        <Module label="Sequencer" optional={getModule('sequence')}>
          <Matrix
            stepSize={7}
            matrix={toMatrix(SEQUENCE_LENGTH, sequence)}
            onClick={(column, row) => toggleARP({ column, row })}
          />
        </Module>
      </div>
    </div>
  );
};
