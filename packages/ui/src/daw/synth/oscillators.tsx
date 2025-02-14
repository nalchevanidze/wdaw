import * as React from 'react';
import { Items, Panel } from './panel';
import { WaveButton } from './wave-button';
import { FILTER_ID, WAVE_ID } from '@wdaw/engine';
import { usePreset } from '../hooks/use-preset';

const oscillators: Items<WAVE_ID> = [
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
];

const filters: Items<FILTER_ID> = [
  { id: 'cutoff' },
  { id: 'resonance' },
  { id: 'envelope' }
];

export const Oscillators: React.FC = () => {
  const [{ wave, filter }, dispatch] = usePreset();

  return (
    <>
      <Panel id="wave" label="Oscillators" size={4}>
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
      <Panel id="filter" label="Filter" optional>
        {filters.map(({ id, range, steps }) => (
          <WaveButton
            id={id}
            key={id}
            range={range}
            steps={steps}
            value={filter[id]}
            onChange={(payload) =>
              dispatch({ type: 'SET_FILTER', id, payload })
            }
          />
        ))}
      </Panel>
    </>
  );
};
