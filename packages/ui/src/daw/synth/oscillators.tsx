import * as React from 'react';
import { Panel } from './panel';
import Presets from './presets';
import { Range } from '@wdaw/svg';
import { WaveButton } from './wave-button';
import { FILTER_ID, WAVE_ID } from '@wdaw/engine';
import { usePreset } from '../hooks/use-preset';
import { WaveForm } from '../../components/waveform';

const styles = {
  main: {
    display: 'flex',
    fontSize: '10px',
    alignItems: 'flex-start'
  }
};

type Item<K extends string> = {
  id: K;
  steps?: number;
  range?: Range;
};

const oscillators: Item<WAVE_ID>[] = [
  { id: 'sine' },
  { id: 'square' },
  { id: 'saw' },
  { id: 'saw2' },
  { id: 'tech' },
  { id: 'noise' },
  { id: 'offset' },
  { id: 'voices', range: [1, 12], steps: 11 },
  { id: 'octave', range: [-4, 4], steps: 8 }
];

const fm: Item<WAVE_ID>[] = [{ id: 'fm' }, { id: 'fmFreq' }];

const filters: Item<FILTER_ID>[] = [
  { id: 'cutoff' },
  { id: 'resonance' },
  { id: 'envelope' }
];

export const Oscillators: React.FC = () => {
  const [{ wave, filter }, dispatch] = usePreset();

  return (
    <div style={styles.main}>
      <Panel label="Global" size={2}>
        <WaveForm size={200}/>
        <Presets />
      </Panel>
      <Panel id="wave" label="Oscillator" size={3}>
        {oscillators.map(({ id, range, steps }) => (
          <WaveButton
            key={id}
            id={id}
            range={range}
            steps={steps}
            color="#555"
            value={wave[id]}
            onChange={(payload) => dispatch({ type: 'SET_WAVE', id, payload })}
          />
        ))}
      </Panel>
      <Panel id="wave" label="FM">
        {fm.map(({ id, range, steps }) => (
          <WaveButton
            id={id}
            key={id}
            range={range}
            steps={steps}
            color="#555"
            value={wave[id]}
            onChange={(payload) => dispatch({ type: 'SET_WAVE', id, payload })}
          />
        ))}
      </Panel>
      <Panel id="filter" label="Filter" optional>
        {filters.map(({ id, range, steps }) => (
          <WaveButton
            id={id}
            key={id}
            range={range}
            steps={steps}
            color="#555"
            value={filter[id]}
            onChange={(payload) =>
              dispatch({ type: 'SET_FILTER', id, payload })
            }
          />
        ))}
      </Panel>
    </div>
  );
};
