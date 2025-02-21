import * as React from 'react';
import { Envelopes } from './envelopes';
import { ControllerModule } from './controller-module';
import { Controllers } from '../../components/controllers';
import { usePreset } from '../hooks/use-preset';
import { Sequence, SEQUENCE_LENGTH } from '@wdaw/engine';
import { Matrix } from '../../components/matrix';
import { Module } from '../../components/module';
import { WaveForm } from '../../components/waveform';
import { TextButton } from '../../components/text-button';

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

const toMatrix = (length: number, seq: Sequence): boolean[][] =>
  Array.from({ length }, (_, i) => i).map((i) =>
    [4, 3, 2, 1].map((index) => Boolean(seq[i] && seq[i].indexOf(index) !== -1))
  );

export const Synth: React.FC = () => {
  const { wave, options, filter, setWave, setFilter, sequence, toggleARP } =
    usePreset();

  return (
    <div style={styles.container}>
      <Module label="presets" size={1}>
        <WaveForm quality={200} />
        <div style={styles.presets}>
          {options.map(({ id, onclick, active }) => (
            <TextButton key={id} name={id} active={active} onClick={onclick} />
          ))}
        </div>
      </Module>
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
