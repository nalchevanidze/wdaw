import * as React from 'react';
import { WaveGrid } from '../../components/wave-grid';
import { Panel } from './panel';
import PanelPresets from './presets';
import { Range } from '@wdaw/svg';
import { WaveButton } from './button/wave-button';
import { FILTER_ID, WAVE_ID, waveFunction } from '@wdaw/engine';
import { usePreset } from '../hooks/use-preset';

const styles = {
  main: {
    display: 'flex',
    fontSize: '10px',
    alignItems: 'flex-start'
  }
};

type Controller<K extends string> = {
  id: K;
  steps?: number;
  range?: Range;
};

const oscillators: Controller<WAVE_ID>[] = [
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

const fm: Controller<WAVE_ID>[] = [{ id: 'fm' }, { id: 'fmFreq' }];

const filters: Controller<FILTER_ID>[] = [
  { id: 'cutoff' },
  { id: 'resonance' },
  { id: 'envelope' }
];

const Oscillators: React.FC = () => {
  const [{ wave, filter }, dispatch] = usePreset();
  const wavePoint = (index: number) =>
    (1 - waveFunction((index + wave.offset) % 1, wave)) * 100;

  const end = wavePoint(0);
  const start = wavePoint(1);
  const middlePoint = (start + end) / 2;
  const waveList = Array.from(
    { length: 200 },
    (_, i) => i + ' ' + wavePoint(i / 200)
  );
  const waveForm =
    'M 0 ' + middlePoint + ' ' + waveList + ' 200 ' + middlePoint;

  return (
    <div style={styles.main}>
      <Panel label="Global" size={2}>
        <svg viewBox={[-1, 0, 202, 200].join(' ')} width="90px" height="90px">
          <path d={waveForm} stroke="#444" strokeWidth={2} fill="none" />
          <WaveGrid color="gray" />
        </svg>
        <PanelPresets />
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

export { Oscillators };
