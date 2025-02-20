import * as React from 'react';
import { Envelopes } from './envelopes';
import { Sequencer } from './sequencer';
import { Presets } from './presets';
import { Panel } from './panel';
import { Controllers } from '../../components/controllers';
import { usePreset } from '../hooks/use-preset';

const styles = {
  main: {
    display: 'flex',
    fontSize: '10px',
    alignItems: 'flex-start',
    padding: '5px'
  }
};

export const Synth: React.FC = () => {
  const { wave, filter, setWave, setFilter } = usePreset();

  return (
    <div style={styles.main}>
      <Presets />
      <Panel id="wave" label="Oscillators" size={4}>
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
      </Panel>
      <Panel id="filter" label="Filter" optional>
        <Controllers
          items={[{ id: 'cutoff' }, { id: 'resonance' }, { id: 'envelope' }]}
          values={filter}
          onChange={setFilter}
        />
      </Panel>
      <div>
        <Envelopes />
        <Sequencer />
      </div>
    </div>
  );
};
