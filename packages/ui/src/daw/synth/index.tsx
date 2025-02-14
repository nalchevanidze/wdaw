import * as React from 'react';
import { Envelopes } from './envelopes';
import { Sequencer } from './sequencer';
import { Presets } from './presets';
import { Panel } from './panel';
import { Controlers} from './wave-button';
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
  const [{ wave, filter }, dispatch] = usePreset();

  return (
    <div style={styles.main}>
      <Presets />
      <Panel id="wave" label="Oscillators" size={4}>
        <Controlers
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
          onChange={(id, payload) =>
            dispatch({ type: 'SET_WAVE', id, payload })
          }
        />
      </Panel>
      <Panel id="filter" label="Filter" optional>
        <Controlers
          items={[{ id: 'cutoff' }, { id: 'resonance' }, { id: 'envelope' }]}
          values={filter}
          onChange={(id, payload) =>
            dispatch({ type: 'SET_FILTER', id, payload })
          }
        />
      </Panel>
      <div>
        <Envelopes />
        <Sequencer />
      </div>
    </div>
  );
};
